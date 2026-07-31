import { betterAuth } from "better-auth";
import { prisma } from "@/lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { sendAuthEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail(user.email, "reset-password", { url, name: user.name });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail(user.email, "verify-email", { url, name: user.name });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "MEMBER",
        input: false,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        input: false,
      },
      fitnessGoal: {
        type: "string",
        input: true,
        required: false,
      } as const,
      heightCm: {
        type: "number",
        input: true,
        required: false,
      } as const,
      weightKg: {
        type: "number",
        input: true,
        required: false,
      } as const,
      experience: {
        type: "string",
        defaultValue: "BEGINNER",
        input: true,
        required: false,
      } as const,
      referralCode: {
        type: "string",
        input: true,
        required: false,
      } as const,
      branchId: {
        type: "string",
        input: false,
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "MEMBER",
    }),
  ],
});
