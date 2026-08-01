import { describe, it, expect } from "vitest";
import {
  checkoutSchema,
  couponSchema,
  membershipUpdateSchema,
  referralCreateSchema,
} from "@/lib/validators/payment";
import {
  workoutSessionSchema,
  workoutPlanSchema,
  workoutLogSchema,
} from "@/lib/validators/workout";
import {
  memberProfileSchema,
  waterLogSchema,
  calorieLogSchema,
  progressPhotoSchema,
} from "@/lib/validators/member";
import {
  bookingSchema,
  attendanceCheckInSchema,
  attendanceQuerySchema,
} from "@/lib/validators/booking";
import { mealPlanSchema, nutritionLogSchema } from "@/lib/validators/nutrition";

describe("payment validators", () => {
  it("checkout requires a plan", () => {
    expect(checkoutSchema.safeParse({}).success).toBe(false);
    expect(checkoutSchema.safeParse({ planId: "plan_1" }).success).toBe(true);
    expect(
      checkoutSchema.safeParse({ planId: "plan_1", couponCode: "SAVE10", branchId: null }).success
    ).toBe(true);
  });

  it("coupon codes are uppercased", () => {
    const parsed = couponSchema.parse({
      code: "save10",
      type: "PERCENTAGE",
      value: 10,
    });
    expect(parsed.code).toBe("SAVE10");
  });

  it("coupon rejects negative value", () => {
    expect(couponSchema.safeParse({ code: "X", type: "FIXED", value: -5 }).success).toBe(false);
  });

  it("membership action is enum-restricted", () => {
    expect(membershipUpdateSchema.safeParse({ action: "CANCEL" }).success).toBe(true);
    expect(membershipUpdateSchema.safeParse({ action: "DELETE" }).success).toBe(false);
  });

  it("referral requires a real email", () => {
    expect(referralCreateSchema.safeParse({ referredEmail: "not-an-email" }).success).toBe(false);
    expect(referralCreateSchema.safeParse({ referredEmail: "friend@example.com" }).success).toBe(
      true
    );
  });
});

describe("workout validators", () => {
  it("session rejects empty title", () => {
    expect(workoutSessionSchema.safeParse({ title: "" }).success).toBe(false);
    expect(workoutSessionSchema.safeParse({ title: "Leg Day", durationMinutes: 45 }).success).toBe(
      true
    );
  });

  it("session clamps duration range", () => {
    expect(workoutSessionSchema.safeParse({ title: "A", durationMinutes: 1000 }).success).toBe(
      false
    );
  });

  it("plan requires a name and default day fields", () => {
    expect(workoutPlanSchema.safeParse({}).success).toBe(false);
    const plan = workoutPlanSchema.parse({ name: "Push Pull" });
    expect(plan.isAiGenerated).toBe(false);
  });

  it("plan exercises enforce ranges", () => {
    const bad = {
      name: "PPL",
      days: [
        {
          dayNumber: 1,
          title: "Push",
          exercises: [{ exerciseId: "e1", sets: 20, reps: "5" }],
        },
      ],
    };
    expect(workoutPlanSchema.safeParse(bad).success).toBe(false);
  });

  it("workout log defaults", () => {
    const log = workoutLogSchema.parse({ exerciseId: "e1" });
    expect(log.setsCompleted).toBe(0);
    expect(log.personalRecord).toBe(false);
  });
});

describe("member validators", () => {
  it("profile rejects impossible height", () => {
    expect(memberProfileSchema.safeParse({ heightCm: 50 }).success).toBe(false);
    expect(memberProfileSchema.safeParse({ heightCm: 180, weightKg: 75 }).success).toBe(true);
  });

  it("profile restricts fitness goal enum", () => {
    expect(memberProfileSchema.safeParse({ fitnessGoal: "LOSE_FAT" }).success).toBe(false);
    expect(memberProfileSchema.safeParse({ fitnessGoal: "MUSCLE_GAIN" }).success).toBe(true);
  });

  it("water log bounds", () => {
    expect(waterLogSchema.safeParse({ amountMl: 30 }).success).toBe(false);
    expect(waterLogSchema.safeParse({ amountMl: 6000 }).success).toBe(false);
    expect(waterLogSchema.safeParse({ amountMl: 250 }).success).toBe(true);
  });

  it("calorie log requires food name", () => {
    expect(calorieLogSchema.safeParse({ foodName: "", calories: 300 }).success).toBe(false);
    const log = calorieLogSchema.parse({ foodName: "Chicken", calories: 300 });
    expect(log.mealType).toBe("SNACK");
  });

  it("progress photo requires a URL", () => {
    expect(progressPhotoSchema.safeParse({ imageUrl: "not-a-url" }).success).toBe(false);
    expect(progressPhotoSchema.safeParse({ imageUrl: "https://img.com/a.png" }).success).toBe(true);
  });
});

describe("booking validators", () => {
  it("booking requires a class", () => {
    expect(bookingSchema.safeParse({}).success).toBe(false);
    expect(bookingSchema.safeParse({ classId: "c1" }).success).toBe(true);
  });

  it("check-in defaults to QR method", () => {
    const checkIn = attendanceCheckInSchema.parse({ branchId: "b1" });
    expect(checkIn.method).toBe("QR");
  });

  it("check-in accepts FACE method", () => {
    expect(attendanceCheckInSchema.safeParse({ branchId: "b1", method: "FACE" }).success).toBe(
      true
    );
  });

  it("attendance query defaults pagination", () => {
    const q = attendanceQuerySchema.parse({});
    expect(q.page).toBe(1);
    expect(q.limit).toBe(20);
  });
});

describe("nutrition validators", () => {
  it("meal plan enforces calorie bounds", () => {
    expect(
      mealPlanSchema.safeParse({
        name: "Cut",
        dailyCalories: 100,
        proteinGrams: 150,
        carbsGrams: 150,
        fatGrams: 50,
      }).success
    ).toBe(false);
    expect(
      mealPlanSchema.safeParse({
        name: "Cut",
        dailyCalories: 2000,
        proteinGrams: 150,
        carbsGrams: 150,
        fatGrams: 50,
      }).success
    ).toBe(true);
  });

  it("nutrition log defaults meal type", () => {
    const log = nutritionLogSchema.parse({ foodName: "Oats", calories: 150 });
    expect(log.mealType).toBe("SNACK");
  });

  it("nutrition log rejects missing food", () => {
    expect(nutritionLogSchema.safeParse({ calories: 150 }).success).toBe(false);
  });
});
