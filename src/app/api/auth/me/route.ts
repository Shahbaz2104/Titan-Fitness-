import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface MeUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  fitnessGoal: string | null;
  heightCm: number | null;
  weightKg: number | null;
  experience: string | null;
  referralCode: string | null;
}

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  const user = session.user as unknown as MeUser;

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
    fitnessGoal: user.fitnessGoal,
    heightCm: user.heightCm,
    weightKg: user.weightKg,
    experience: user.experience,
    referralCode: user.referralCode,
  });
}

import { headers } from "next/headers";
