import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    image: session.user.image,
    role: session.user.role,
    fitnessGoal: session.user.fitnessGoal,
    heightCm: session.user.heightCm,
    weightKg: session.user.weightKg,
    experience: session.user.experience,
    referralCode: session.user.referralCode,
  });
}

import { headers } from "next/headers";
