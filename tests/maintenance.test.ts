import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  membershipFindMany: vi.fn(),
  membershipUpdateMany: vi.fn(),
  pushDeleteMany: vi.fn(),
  createNotification: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    membership: {
      findMany: mocks.membershipFindMany,
      updateMany: mocks.membershipUpdateMany,
    },
    pushSubscription: {
      deleteMany: mocks.pushDeleteMany,
    },
  },
}));

vi.mock("@/services/notifications", () => ({
  createNotification: mocks.createNotification,
}));

import { expireMemberships, prunePushSubscriptions, runMaintenance } from "@/services/maintenance";

describe("maintenance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.membershipUpdateMany.mockResolvedValue({ count: 0 });
    mocks.pushDeleteMany.mockResolvedValue({ count: 0 });
    mocks.createNotification.mockResolvedValue({ id: "notification" });
  });

  describe("expireMemberships", () => {
    it("does nothing when no membership is overdue", async () => {
      mocks.membershipFindMany.mockResolvedValue([]);

      await expect(expireMemberships(new Date("2026-06-01T00:00:00Z"))).resolves.toBe(0);
      expect(mocks.membershipUpdateMany).not.toHaveBeenCalled();
      expect(mocks.createNotification).not.toHaveBeenCalled();
    });

    it("expires overdue memberships and notifies their owners", async () => {
      const now = new Date("2026-06-01T00:00:00Z");
      mocks.membershipFindMany.mockResolvedValue([
        { id: "membership-1", userId: "user-1", plan: { name: "Pro" } },
        { id: "membership-2", userId: "user-2", plan: { name: "Elite" } },
      ]);

      await expect(expireMemberships(now)).resolves.toBe(2);

      expect(mocks.membershipFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "ACTIVE", endDate: { lte: now }, deletedAt: null },
        })
      );
      expect(mocks.membershipUpdateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ["membership-1", "membership-2"] },
          status: "ACTIVE",
          endDate: { lte: now },
        },
        data: { status: "EXPIRED" },
      });
      expect(mocks.createNotification).toHaveBeenCalledTimes(2);
      expect(mocks.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          title: "Membership expired",
          type: "MEMBERSHIP",
          data: { membershipId: "membership-1" },
        })
      );
      expect(mocks.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-2",
          body: expect.stringContaining("Elite"),
        })
      );
    });

    it("still expires memberships when a notification fails", async () => {
      mocks.membershipFindMany.mockResolvedValue([
        { id: "membership-1", userId: "user-1", plan: { name: "Pro" } },
      ]);
      mocks.createNotification.mockRejectedValue(new Error("push unavailable"));

      await expect(expireMemberships()).resolves.toBe(1);
      expect(mocks.membershipUpdateMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("prunePushSubscriptions", () => {
    it("deletes failed and idle subscriptions using a 90-day cutoff", async () => {
      const now = new Date("2026-01-01T00:00:00Z");
      mocks.pushDeleteMany.mockResolvedValue({ count: 4 });

      await expect(prunePushSubscriptions(now)).resolves.toBe(4);

      expect(mocks.pushDeleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { failureCount: { gte: 3 } },
            { lastSuccessAt: { lt: new Date("2025-10-03T00:00:00Z") } },
            {
              lastSuccessAt: null,
              createdAt: { lt: new Date("2025-10-03T00:00:00Z") },
            },
          ],
        },
      });
    });
  });

  describe("runMaintenance", () => {
    it("returns both counters and the run timestamp", async () => {
      const now = new Date("2026-03-15T05:00:00Z");
      mocks.membershipFindMany.mockResolvedValue([
        { id: "membership-1", userId: "user-1", plan: { name: "Starter" } },
      ]);
      mocks.pushDeleteMany.mockResolvedValue({ count: 2 });

      await expect(runMaintenance(now)).resolves.toEqual({
        expiredMemberships: 1,
        prunedPushSubscriptions: 2,
        ranAt: now.toISOString(),
      });
    });
  });
});
