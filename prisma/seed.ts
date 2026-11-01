import { PrismaClient, Prisma } from "@prisma/client";
import { Difficulty, ExerciseCategory, ClassType, ProgramCategory } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { EXERCISES } from "../src/lib/exercise-data";
import { getPosts, BLOG_CATEGORIES } from "../src/lib/blog-data";

const POSTS = getPosts();

const prisma = new PrismaClient();
const seedNow = new Date();
const BLOG_COVERS = [
  "/images/blog/barbell.jpeg",
  "/images/blog/cardio.jpg",
  "/images/blog/fat-loss.webp",
  "/images/blog/mindset.jpeg",
  "/images/blog/protein.jpeg",
  "/images/blog/recovery.jpg",
];

function daysFromNow(days: number, hour = 12, minute = 0) {
  const date = new Date(seedNow);
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function daysAgo(days: number, hour = 12, minute = 0) {
  return daysFromNow(-days, hour, minute);
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

async function createUserWithCredentials(data: Prisma.UserUncheckedCreateInput) {
  const user = await prisma.user.create({ data });
  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      providerId: "credential",
      accountId: user.email,
      userId: user.id,
      password: user.password,
    },
  });
  return user;
}

async function main() {
  console.log("🌱 Seeding Titan Fitness database...");

  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_DESTRUCTIVE !== "true") {
    throw new Error(
      "Refusing to run the destructive seed in production. Set SEED_ALLOW_DESTRUCTIVE=true only for a disposable demo database."
    );
  }

  // ------------------------------------------------------------
  // 1. CLEANUP (FK-safe order)
  // ------------------------------------------------------------
  const tables = [
    "UserBadge",
    "UserChallenge",
    "UserPoint",
    "Referral",
    "AuditLog",
    "AIUsage",
    "AIChatMessage",
    "AIChat",
    "Meal",
    "MealDay",
    "MealPlan",
    "Notification",
    "TicketMessage",
    "SupportTicket",
    "ContactMessage",
    "BlogBookmark",
    "BlogLike",
    "BlogComment",
    "BlogPost",
    "BlogCategory",
    "FAQ",
    "GalleryImage",
    "Testimonial",
    "ProgressPhoto",
    "CalorieLog",
    "WaterLog",
    "BodyMetric",
    "WorkoutLog",
    "WorkoutSession",
    "WorkoutExercise",
    "WorkoutDay",
    "WorkoutPlan",
    "ExerciseFavorite",
    "Exercise",
    "Waitlist",
    "Booking",
    "ClassSchedule",
    "TrainerReview",
    "TrainerBooking",
    "Trainer",
    "Program",
    "Attendance",
    "Payment",
    "Invoice",
    "Membership",
    "MembershipPlan",
    "Coupon",
    "Challenge",
    "Badge",
    "Branch",
    "Account",
    "Session",
    "Verification",
    "User",
    "Setting",
  ] as const;

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
  }
  console.log("  ✔ Cleared existing data");

  // ------------------------------------------------------------
  // 2. BRANCHES
  // ------------------------------------------------------------
  const branches = await Promise.all(
    [
      {
        name: "Titan Fitness — Downtown",
        slug: "downtown",
        description: "Flagship branch with Olympic lifting platforms, sauna, and recovery lounge.",
        address: "12 Main Boulevard, Gulberg III",
        city: "Lahore",
        phone: "+92 300 1234567",
        email: "downtown@titanfitness.com",
      },
      {
        name: "Titan Fitness — North",
        slug: "north",
        description: "24/7 access branch with turf zone and boxing studio.",
        address: "45 Ring Road, DHA Phase 5",
        city: "Karachi",
        phone: "+92 300 7654321",
        email: "north@titanfitness.com",
      },
      {
        name: "Titan Fitness — Riverside",
        slug: "riverside",
        description: "Premium branch with outdoor training yard and recovery spa.",
        address: "88 Riverside Drive, F-7",
        city: "Islamabad",
        phone: "+92 300 5551234",
        email: "riverside@titanfitness.com",
      },
    ].map((b) => prisma.branch.create({ data: b }))
  );
  console.log(`  ✔ Created ${branches.length} branches`);

  // ------------------------------------------------------------
  // 3. USERS
  // ------------------------------------------------------------
  const passwordHash = await hashPassword("Titan@12345");

  const admin = await createUserWithCredentials({
    name: "Titan Admin",
    email: "admin@titanfitness.com",
    emailVerified: true,
    password: passwordHash,
    role: "SUPER_ADMIN",
    phone: "+92 300 0000000",
    branchId: branches[0].id,
  });

  const trainerDefs = [
    {
      name: "Marcus Cole",
      email: "marcus@titanfitness.com",
      specialty: "Strength & Powerlifting",
      experienceYears: 12,
      hourlyRate: 60,
      isFeatured: true,
    },
    {
      name: "Sara Khan",
      email: "sara@titanfitness.com",
      specialty: "Yoga & Mobility",
      experienceYears: 9,
      hourlyRate: 45,
      isFeatured: true,
    },
    {
      name: "David Okoro",
      email: "david@titanfitness.com",
      specialty: "CrossFit & HIIT",
      experienceYears: 11,
      hourlyRate: 55,
      isFeatured: true,
    },
    {
      name: "Emily Chen",
      email: "emily@titanfitness.com",
      specialty: "Weight Loss & Nutrition",
      experienceYears: 8,
      hourlyRate: 50,
      isFeatured: true,
    },
    {
      name: "James Carter",
      email: "james@titanfitness.com",
      specialty: "Bodybuilding & Hypertrophy",
      experienceYears: 10,
      hourlyRate: 55,
      isFeatured: false,
    },
    {
      name: "Maya Patel",
      email: "maya@titanfitness.com",
      specialty: "Calisthenics & Gymnastics",
      experienceYears: 7,
      hourlyRate: 40,
      isFeatured: false,
    },
  ];

  const trainers: { user: { id: string }; profile: { id: string } }[] = [];
  for (const def of trainerDefs) {
    const user = await createUserWithCredentials({
      name: def.name,
      email: def.email,
      emailVerified: true,
      password: passwordHash,
      role: "TRAINER",
      branchId: branches[0].id,
    });
    const profile = await prisma.trainer.create({
      data: {
        userId: user.id,
        specialty: def.specialty,
        bio: `${def.name} is a certified coach with ${def.experienceYears} years of experience transforming bodies and building champions.`,
        experienceYears: def.experienceYears,
        certifications: ["NASM-CPT", "CF-L1", "Precision Nutrition L1"],
        hourlyRate: new Prisma.Decimal(def.hourlyRate),
        rating: 4.9,
        reviewCount: 120,
        isFeatured: def.isFeatured,
        socialLinks: {
          instagram: `https://instagram.com/${def.name.toLowerCase().replace(/[^a-z]+/g, "")}`,
          youtube: "https://youtube.com/@titanfitness",
        },
        availability: {
          monday: ["06:00-12:00", "16:00-21:00"],
          tuesday: ["06:00-12:00", "16:00-21:00"],
          wednesday: ["06:00-12:00"],
          thursday: ["06:00-12:00", "16:00-21:00"],
          friday: ["06:00-12:00", "16:00-21:00"],
          saturday: ["08:00-14:00"],
          sunday: [],
        },
      },
    });
    trainers.push({ user, profile });
  }

  const member = await createUserWithCredentials({
    name: "Alex Member",
    email: "member@titanfitness.com",
    emailVerified: true,
    password: passwordHash,
    role: "MEMBER",
    phone: "+92 300 1112223",
    gender: "MALE",
    dateOfBirth: new Date("1996-04-12"),
    heightCm: 178,
    weightKg: 82,
    bodyFatPct: 18,
    fitnessGoal: "MUSCLE_GAIN",
    experience: "INTERMEDIATE",
    referralCode: "ALEX-TITAN",
    branchId: branches[0].id,
  });

  const member2 = await createUserWithCredentials({
    name: "Sarah Member",
    email: "sarah@titanfitness.com",
    emailVerified: true,
    password: passwordHash,
    role: "MEMBER",
    heightCm: 165,
    weightKg: 63,
    fitnessGoal: "WEIGHT_LOSS",
    experience: "BEGINNER",
    referralCode: "SARAH-TITAN",
    branchId: branches[1].id,
  });

  const blogger = await createUserWithCredentials({
    name: "Titan Editorial",
    email: "editorial@titanfitness.com",
    emailVerified: true,
    password: passwordHash,
    role: "ADMIN",
    branchId: branches[0].id,
  });

  const demoMemberDefs = [
    ["Jordan Blake", "jordan.blake", "MALE", 181, 86, "MUSCLE_GAIN", "INTERMEDIATE"],
    ["Mia Rodriguez", "mia.rodriguez", "FEMALE", 166, 61, "WEIGHT_LOSS", "BEGINNER"],
    ["Ethan Brooks", "ethan.brooks", "MALE", 178, 79, "STRENGTH", "ADVANCED"],
    ["Ava Thompson", "ava.thompson", "FEMALE", 170, 66, "GENERAL_FITNESS", "INTERMEDIATE"],
    ["Noah Kim", "noah.kim", "MALE", 175, 72, "ENDURANCE", "INTERMEDIATE"],
    ["Layla Hassan", "layla.hassan", "FEMALE", 163, 58, "FLEXIBILITY", "BEGINNER"],
    ["Liam Walker", "liam.walker", "MALE", 184, 91, "MUSCLE_GAIN", "ADVANCED"],
    ["Zoe Bennett", "zoe.bennett", "FEMALE", 168, 64, "WEIGHT_LOSS", "INTERMEDIATE"],
    ["Omar Farooq", "omar.farooq", "MALE", 177, 80, "STRENGTH", "BEGINNER"],
    ["Isabella Rossi", "isabella.rossi", "FEMALE", 172, 68, "GENERAL_FITNESS", "BEGINNER"],
    ["Lucas Nguyen", "lucas.nguyen", "MALE", 180, 77, "MUSCLE_GAIN", "INTERMEDIATE"],
    ["Amara Okafor", "amara.okafor", "FEMALE", 165, 62, "ENDURANCE", "ADVANCED"],
    ["Ben Carter", "ben.carter", "MALE", 183, 88, "WEIGHT_LOSS", "BEGINNER"],
    ["Sofia Petrova", "sofia.petrova", "FEMALE", 169, 60, "FLEXIBILITY", "INTERMEDIATE"],
    ["Kai Tanaka", "kai.tanaka", "MALE", 176, 74, "GENERAL_FITNESS", "INTERMEDIATE"],
    ["Priya Sharma", "priya.sharma", "FEMALE", 161, 57, "STRENGTH", "BEGINNER"],
    ["Mateo Silva", "mateo.silva", "MALE", 179, 83, "MUSCLE_GAIN", "ADVANCED"],
    ["Hannah Fischer", "hannah.fischer", "FEMALE", 174, 67, "WEIGHT_LOSS", "INTERMEDIATE"],
    ["Yusuf Demir", "yusuf.demir", "MALE", 182, 85, "ENDURANCE", "BEGINNER"],
    ["Elena Costa", "elena.costa", "FEMALE", 167, 59, "GENERAL_FITNESS", "ADVANCED"],
    ["Daniel Park", "daniel.park", "MALE", 173, 71, "MUSCLE_GAIN", "BEGINNER"],
    ["Nora Jensen", "nora.jensen", "FEMALE", 171, 65, "FLEXIBILITY", "INTERMEDIATE"],
    ["Ravi Mehta", "ravi.mehta", "MALE", 185, 89, "STRENGTH", "INTERMEDIATE"],
    ["Chloe Martin", "chloe.martin", "FEMALE", 164, 56, "WEIGHT_LOSS", "BEGINNER"],
  ] as const;

  const memberPhotos = ["/male3.jpg", "/female2.jpg", "/girl1.png"];
  const demoMembers: {
    user: Awaited<ReturnType<typeof createUserWithCredentials>>;
    index: number;
  }[] = [];

  for (const [index, def] of demoMemberDefs.entries()) {
    const [name, handle, gender, heightCm, weightKg, fitnessGoal, experience] = def;
    const user = await createUserWithCredentials({
      name,
      email: `${handle}@titanfitness.com`,
      emailVerified: true,
      password: passwordHash,
      image: memberPhotos[index % memberPhotos.length],
      role: "MEMBER",
      phone: `+92 300 2000${String(index + 10).padStart(3, "0")}`,
      gender,
      dateOfBirth: new Date(1988 + (index % 12), (index * 3) % 12, 8 + (index % 18)),
      heightCm,
      weightKg,
      bodyFatPct: gender === "MALE" ? 16 + (index % 8) : 22 + (index % 7),
      fitnessGoal,
      experience,
      referralCode: `${name.split(" ")[0].toUpperCase()}-TITAN`,
      branchId: branches[index % branches.length].id,
      createdAt: daysAgo((index * 4) % 110, 9, 30),
      lastLoginAt: daysAgo(index % 8, 7, 45),
    });
    demoMembers.push({ user, index });
  }

  console.log(
    `  ✔ Created users (admin, 6 trainers, 2 primary members, ${demoMembers.length} demo members, editorial)`
  );

  // ------------------------------------------------------------
  // 4. MEMBERSHIP PLANS
  // ------------------------------------------------------------
  const plans = await Promise.all(
    [
      {
        name: "Starter",
        slug: "starter",
        description: "Access to one branch, standard classes, and the workout tracker.",
        price: 29,
        billingCycle: "MONTHLY" as const,
        durationDays: 30,
        isPopular: false,
        features: [
          "1 branch access",
          "Group classes",
          "Workout tracker",
          "BMI calculator",
          "Community access",
        ],
      },
      {
        name: "Pro",
        slug: "pro",
        description: "Everything in Starter plus AI coaching, all branches, and premium classes.",
        price: 59,
        billingCycle: "MONTHLY" as const,
        durationDays: 30,
        isPopular: true,
        features: [
          "All branches access",
          "All classes + booking",
          "AI workout generator",
          "AI nutritionist",
          "Progress photos + analytics",
          "Priority support",
        ],
      },
      {
        name: "Elite",
        slug: "elite",
        description:
          "The complete Titan experience — personal training credit, spa, and 24/7 access.",
        price: 99,
        billingCycle: "MONTHLY" as const,
        durationDays: 30,
        isPopular: false,
        features: [
          "Everything in Pro",
          "2 PT sessions / month",
          "Recovery spa access",
          "24/7 branch access",
          "Guest passes (2/month)",
          "Dedicated coach",
        ],
      },
    ].map((p) =>
      prisma.membershipPlan.create({
        data: {
          ...p,
          price: new Prisma.Decimal(p.price),
          currency: "USD",
        },
      })
    )
  );
  console.log(`  ✔ Created ${plans.length} membership plans`);

  const primaryMembership = await prisma.membership.create({
    data: {
      userId: member.id,
      planId: plans[1].id,
      branchId: branches[0].id,
      status: "ACTIVE",
      startDate: daysAgo(180, 10, 0),
      endDate: daysFromNow(45, 23, 59),
      autoRenew: true,
    },
  });

  await prisma.payment.createMany({
    data: [89, 31, 1].map((days, index) => ({
      userId: member.id,
      membershipId: primaryMembership.id,
      branchId: branches[0].id,
      amount: new Prisma.Decimal(59),
      status: "SUCCEEDED" as const,
      method: index === 0 ? ("CARD" as const) : ("GOOGLE_PAY" as const),
      type: "MEMBERSHIP" as const,
      description: `Pro membership — month ${3 - index}`,
      createdAt: daysAgo(days, 11, 15),
      updatedAt: daysAgo(days, 11, 15),
    })),
  });

  const demoMemberships: {
    membership: Awaited<ReturnType<typeof prisma.membership.create>>;
    member: (typeof demoMembers)[number];
    plan: (typeof plans)[number];
  }[] = [];

  for (const [index, demo] of demoMembers.entries()) {
    const plan = plans[index % plans.length];
    const status =
      index >= demoMembers.length - 4
        ? index === demoMembers.length - 4
          ? "PENDING"
          : index === demoMembers.length - 3
            ? "CANCELLED"
            : index === demoMembers.length - 2
              ? "EXPIRED"
              : "SUSPENDED"
        : "ACTIVE";
    const expiring = index >= demoMembers.length - 6 && index < demoMembers.length - 4;
    const startDate = daysAgo(20 + ((index * 7) % 160), 9, 0);
    const endDate = expiring
      ? daysFromNow(2 + (index % 5), 23, 59)
      : daysFromNow(30 + ((index * 11) % 240), 23, 59);

    const membership = await prisma.membership.create({
      data: {
        userId: demo.user.id,
        planId: plan.id,
        branchId: branches[index % branches.length].id,
        status,
        startDate,
        endDate: status === "ACTIVE" || expiring ? endDate : daysAgo(2, 23, 59),
        autoRenew: index % 3 === 0,
        cancelledAt: status === "CANCELLED" ? daysAgo(5, 14, 0) : null,
      },
    });
    demoMemberships.push({ membership, member: demo, plan });

    const paymentCount = status === "ACTIVE" ? 2 + (index % 3) : 1;
    for (let paymentIndex = 0; paymentIndex < paymentCount; paymentIndex++) {
      const paidAt = daysAgo(2 + paymentIndex * 30 + (index % 12), 10 + (index % 8), 20);
      await prisma.payment.create({
        data: {
          userId: demo.user.id,
          membershipId: membership.id,
          branchId: branches[index % branches.length].id,
          amount: new Prisma.Decimal(Number(plan.price)),
          status: paymentIndex === paymentCount - 1 && index % 11 === 0 ? "FAILED" : "SUCCEEDED",
          method:
            index % 4 === 0
              ? "CASH"
              : index % 4 === 1
                ? "CARD"
                : index % 4 === 2
                  ? "APPLE_PAY"
                  : "BANK_TRANSFER",
          type: "MEMBERSHIP",
          description: `${plan.name} membership payment`,
          createdAt: paidAt,
          updatedAt: paidAt,
        },
      });
    }
  }

  console.log(`  ✔ Created memberships and payments for ${demoMembers.length + 1} members`);

  // ------------------------------------------------------------
  // 5. EXERCISES
  // ------------------------------------------------------------
  const MUSCLE_TO_CATEGORY: Record<string, ExerciseCategory> = {
    Chest: "CHEST",
    Back: "BACK",
    Shoulders: "SHOULDERS",
    Biceps: "BICEPS",
    Triceps: "TRICEPS",
    Quadriceps: "LEGS",
    Hamstrings: "LEGS",
    Calves: "LEGS",
    Glutes: "LEGS",
    Core: "CORE",
    Cardio: "CARDIO",
    Plyometrics: "PLYOMETRICS",
    "Full Body": "FULL_BODY",
    Stretching: "STRETCHING",
  };

  const exerciseMap = new Map<string, string>();
  for (const ex of EXERCISES) {
    const created = await prisma.exercise.create({
      data: {
        name: ex.name,
        slug: ex.id,
        category: MUSCLE_TO_CATEGORY[ex.muscleGroup] ?? "FULL_BODY",
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment,
        difficulty: ex.difficulty.toUpperCase() as Difficulty,
        instructions: {
          setup: `Set up for ${ex.name} with a safe working weight.`,
          execution: `Perform ${ex.name} with controlled form through the full range of motion.`,
          tips: "Keep tension on the target muscle and breathe steadily.",
        },
        videoUrl: ex.videoUrl ?? null,
      },
    });
    exerciseMap.set(ex.id, created.id);
  }
  console.log(`  ✔ Created ${exerciseMap.size} exercises`);

  // ------------------------------------------------------------
  // 6. PROGRAMS
  // ------------------------------------------------------------
  const programDefs = [
    {
      slug: "weight-loss",
      name: "Weight Loss",
      category: "WEIGHT_LOSS",
      difficulty: "BEGINNER",
      durationWeeks: 8,
      price: 199,
      trainerIdx: 3,
      description:
        "Metabolic conditioning, nutrition coaching, and AI meal plans engineered to burn fat while preserving muscle.",
    },
    {
      slug: "bodybuilding",
      name: "Bodybuilding",
      category: "BODYBUILDING",
      difficulty: "INTERMEDIATE",
      durationWeeks: 12,
      price: 249,
      trainerIdx: 4,
      description:
        "Hypertrophy-focused splits, progressive overload tracking, and physique analytics for lean dense muscle.",
    },
    {
      slug: "crossfit",
      name: "CrossFit",
      category: "CROSSFIT",
      difficulty: "BEGINNER",
      durationWeeks: 12,
      price: 179,
      trainerIdx: 2,
      description:
        "Constantly varied functional training — WODs, Olympic lifting, and conditioning for unmatched fitness.",
    },
    {
      slug: "yoga",
      name: "Yoga",
      category: "YOGA",
      difficulty: "BEGINNER",
      durationWeeks: 8,
      price: 99,
      trainerIdx: 1,
      description:
        "Vinyasa, Hatha, and mobility flows that build flexibility, balance, and a calm, focused mind.",
    },
    {
      slug: "cardio",
      name: "Cardio",
      category: "CARDIO",
      difficulty: "BEGINNER",
      durationWeeks: 8,
      price: 129,
      trainerIdx: 2,
      description:
        "Heart-rate zone training, intervals, and endurance building — from first mile to full marathon.",
    },
    {
      slug: "hiit",
      name: "HIIT",
      category: "HIIT",
      difficulty: "INTERMEDIATE",
      durationWeeks: 6,
      price: 149,
      trainerIdx: 3,
      description:
        "20-minute high-intensity sessions that torch calories and keep your metabolism elevated all day.",
    },
    {
      slug: "powerlifting",
      name: "Powerlifting",
      category: "POWERLIFTING",
      difficulty: "ADVANCED",
      durationWeeks: 16,
      price: 299,
      trainerIdx: 0,
      description:
        "Periodized programming for the squat, bench, and deadlift — with weekly PR testing and coaching.",
    },
    {
      slug: "calisthenics",
      name: "Calisthenics",
      category: "CALISTHENICS",
      difficulty: "BEGINNER",
      durationWeeks: 12,
      price: 139,
      trainerIdx: 5,
      description:
        "Master bodyweight strength — pull-ups, dips, handstands, and beyond. No weights, all control.",
    },
  ];

  const programs: { id: string }[] = [];
  for (const def of programDefs) {
    const program = await prisma.program.create({
      data: {
        name: def.name,
        slug: def.slug,
        category: def.category as ProgramCategory,
        difficulty: def.difficulty as Difficulty,
        durationWeeks: def.durationWeeks,
        price: new Prisma.Decimal(def.price),
        trainerId: trainers[def.trainerIdx].profile.id,
        description: def.description,
        longDescription: `${def.description} Led by ${trainerDefs[def.trainerIdx].name}. Includes structured weekly sessions, performance tracking, and access to the Titan AI coach for personalized adjustments.`,
        schedule: {
          sessionsPerWeek: def.category === "YOGA" ? 3 : 4,
          sessionLengthMin: def.category === "YOGA" ? 60 : 75,
          preferredDays: ["Mon", "Wed", "Fri", "Sat"],
        },
        isActive: true,
      },
    });
    programs.push(program);
  }
  console.log(`  ✔ Created ${programs.length} programs`);

  // ------------------------------------------------------------
  // 7. CLASS SCHEDULES (previous, current, next 14 days)
  // ------------------------------------------------------------
  const classTypes: ClassType[] = [
    "YOGA",
    "CROSSFIT",
    "HIIT",
    "ZUMBA",
    "SPINNING",
    "BOXING",
    "PILATES",
    "STRENGTH",
    "CARDIO",
  ];
  const classNames: Record<ClassType, string> = {
    YOGA: "Sunrise Yoga Flow",
    CROSSFIT: "CrossFit WOD",
    HIIT: "Titan HIIT",
    ZUMBA: "Latin Burn",
    SPINNING: "Power Ride",
    BOXING: "Boxing Fundamentals",
    PILATES: "Core Pilates",
    STRENGTH: "Barbell Strength",
    CARDIO: "Endurance Engine",
  };
  const classHours = [6, 12, 18];
  const classTrainerOffset = [0, 2, 4];
  const classes = [];

  for (let dayOffset = -14; dayOffset <= 14; dayOffset++) {
    for (let slot = 0; slot < classHours.length; slot++) {
      const type = classTypes[(Math.abs(dayOffset) + slot) % classTypes.length];
      const startTime = daysFromNow(dayOffset, classHours[slot], slot === 0 ? 30 : 0);
      const endTime = new Date(startTime.getTime() + 60 * 60_000);
      classes.push(
        await prisma.classSchedule.create({
          data: {
            branchId: branches[(Math.abs(dayOffset) + slot) % branches.length].id,
            programId: programs[(Math.abs(dayOffset) + slot) % programs.length].id,
            trainerId:
              trainers[(classTrainerOffset[slot] + Math.abs(dayOffset)) % trainers.length].profile
                .id,
            title: classNames[type],
            type,
            description: `${classNames[type]} — coached session for all levels at Titan Fitness.`,
            location: ["Studio A", "Main Floor", "Rooftop Studio"][slot],
            capacity: 16 + slot * 4,
            startTime,
            endTime,
            isRecurring: false,
            repeatDays: [],
          },
        })
      );
    }
  }
  console.log(`  ✔ Created ${classes.length} class schedules`);

  // ------------------------------------------------------------
  // 8. MEMBER DATA (metrics, water, attendance, workout plan)
  // ------------------------------------------------------------
  for (let i = 55; i >= 0; i--) {
    const date = daysFromNow(-i, 12, 0);
    await prisma.bodyMetric.create({
      data: {
        userId: member.id,
        date,
        weightKg: round1(78.5 + (55 - i) * 0.07 + Math.sin(i) * 0.25),
        bodyFatPct: round1(20 - (55 - i) * 0.045),
        muscleMassKg: round1(34 + (55 - i) * 0.05),
        bmi: round1(25.9 - (55 - i) * 0.025),
        waterLiters: 2.5 + Math.round(Math.sin(i * 2)) * 0.2,
        waistCm: 86 - (55 - i) * 0.06,
      },
    });
  }

  for (let i = 29; i >= 0; i--) {
    await prisma.waterLog.create({
      data: {
        userId: member.id,
        date: daysFromNow(-i, 18, 0),
        amountMl: 2200 + ((i * 7) % 10) * 120,
      },
    });
  }

  for (let i = 59; i >= 0; i--) {
    if (i > 12 && i % 9 === 0) continue;
    const checkIn = daysFromNow(-i, 6 + (i % 5), 15);
    const checkOut = new Date(checkIn.getTime() + (55 + (i % 4) * 10) * 60_000);
    await prisma.attendance.create({
      data: {
        userId: member.id,
        branchId: branches[i % branches.length].id,
        checkInTime: checkIn,
        checkOutTime: i === 0 ? null : checkOut,
        method: i % 4 === 0 ? "QR" : "MANUAL",
        status: i % 13 === 0 ? "LATE" : "PRESENT",
      },
    });
  }

  const plan = await prisma.workoutPlan.create({
    data: {
      userId: member.id,
      name: "Hypertrophy Split",
      goal: "MUSCLE_GAIN",
      description: "4-day upper/lower split generated with AI assistance.",
      isAiGenerated: true,
      isActive: true,
    },
  });

  const dayDefs = [
    {
      dayNumber: 1,
      title: "Upper Push",
      focus: "Chest, Shoulders, Triceps",
      exercises: [
        "barbell-bench-press",
        "incline-dumbbell-press",
        "overhead-press",
        "tricep-pushdown",
      ],
    },
    {
      dayNumber: 2,
      title: "Lower Power",
      focus: "Quads, Hamstrings, Glutes",
      exercises: ["barbell-squat", "romanian-deadlift", "leg-press", "calf-raise"],
    },
    {
      dayNumber: 3,
      title: "Upper Pull",
      focus: "Back, Biceps",
      exercises: ["deadlift", "pull-up", "barbell-row", "barbell-curl"],
    },
    {
      dayNumber: 4,
      title: "Lower Hypertrophy",
      focus: "Glutes, Quads, Core",
      exercises: ["hip-thrust", "walking-lunge", "goblet-squat", "plank"],
    },
  ];

  for (const def of dayDefs) {
    const day = await prisma.workoutDay.create({
      data: { planId: plan.id, dayNumber: def.dayNumber, title: def.title, focus: def.focus },
    });
    await Promise.all(
      def.exercises.map((slug, idx) => {
        const exId = exerciseMap.get(slug);
        if (!exId) return Promise.resolve();
        return prisma.workoutExercise.create({
          data: {
            workoutDayId: day.id,
            exerciseId: exId,
            sets: 4,
            reps: "8-12",
            restSeconds: 90,
            weightKg: 60 + idx * 10,
            order: idx,
          },
        });
      })
    );
  }

  const session = await prisma.workoutSession.create({
    data: {
      userId: member.id,
      planId: plan.id,
      title: "Upper Push — Morning",
      date: daysFromNow(0, 9, 0),
      durationMinutes: 65,
      caloriesBurned: 480,
      isCompleted: true,
      completedAt: new Date(),
      notes: "Felt strong today — added 2.5kg to bench.",
    },
  });

  await Promise.all(
    ["barbell-bench-press", "overhead-press", "tricep-pushdown"].map((slug, idx) => {
      const exId = exerciseMap.get(slug);
      if (!exId) return Promise.resolve();
      return prisma.workoutLog.create({
        data: {
          sessionId: session.id,
          exerciseId: exId,
          setsCompleted: 4,
          reps: "8-12",
          weightKg: 80 + idx * 10,
          personalRecord: idx === 0,
        },
      });
    })
  );

  const workoutTitles = [
    "Upper Push",
    "Lower Power",
    "Upper Pull",
    "Lower Hypertrophy",
    "Conditioning Finisher",
    "Full Body Strength",
  ];
  const workoutExercises = [
    "barbell-bench-press",
    "barbell-squat",
    "deadlift",
    "pull-up",
    "overhead-press",
    "barbell-row",
  ];

  for (let week = 0; week < 8; week++) {
    for (let sessionIndex = 0; sessionIndex < 2; sessionIndex++) {
      const sessionDate = daysFromNow(-(week * 7 + 2 + sessionIndex * 3), 7 + sessionIndex * 2, 10);
      const historySession = await prisma.workoutSession.create({
        data: {
          userId: member.id,
          planId: plan.id,
          title: workoutTitles[(week + sessionIndex) % workoutTitles.length],
          date: sessionDate,
          durationMinutes: 45 + ((week * 5 + sessionIndex * 7) % 20),
          caloriesBurned: 360 + ((week * 31 + sessionIndex * 23) % 180),
          isCompleted: true,
          completedAt: new Date(sessionDate.getTime() + 55 * 60_000),
          notes:
            sessionIndex === 0 ? "Progressive overload felt solid." : "Focused on tempo and form.",
        },
      });

      const chosenExercises = [
        workoutExercises[(week + sessionIndex) % workoutExercises.length],
        workoutExercises[(week + sessionIndex + 2) % workoutExercises.length],
        workoutExercises[(week + sessionIndex + 4) % workoutExercises.length],
      ];

      await Promise.all(
        chosenExercises.map((slug, exerciseIndex) => {
          const exerciseId = exerciseMap.get(slug);
          if (!exerciseId) return Promise.resolve();
          return prisma.workoutLog.create({
            data: {
              sessionId: historySession.id,
              exerciseId,
              setsCompleted: 3 + ((week + exerciseIndex) % 3),
              reps: exerciseIndex === 0 ? "6-8" : "8-12",
              weightKg: 55 + week * 2.5 + exerciseIndex * 10,
              personalRecord: week === 7 && exerciseIndex === 0,
            },
          });
        })
      );
    }
  }

  await prisma.calorieLog.createMany({
    data: [
      {
        userId: member.id,
        date: new Date(),
        mealType: "BREAKFAST",
        foodName: "Oats, eggs & banana",
        calories: 550,
        protein: 32,
        carbs: 65,
        fat: 18,
      },
      {
        userId: member.id,
        date: new Date(),
        mealType: "LUNCH",
        foodName: "Chicken rice bowl",
        calories: 780,
        protein: 55,
        carbs: 88,
        fat: 22,
      },
      {
        userId: member.id,
        date: new Date(),
        mealType: "DINNER",
        foodName: "Salmon & sweet potato",
        calories: 640,
        protein: 42,
        carbs: 52,
        fat: 26,
      },
      {
        userId: member.id,
        date: new Date(),
        mealType: "SNACK",
        foodName: "Protein shake",
        calories: 210,
        protein: 28,
        carbs: 12,
        fat: 5,
      },
    ],
  });
  console.log("  ✔ Created member data (metrics, water, attendance, workouts, meals)");

  // ------------------------------------------------------------
  // 9. BLOG
  // ------------------------------------------------------------
  const categories: Awaited<ReturnType<typeof prisma.blogCategory.create>>[] = [];
  for (const cat of BLOG_CATEGORIES.filter((c) => c !== "All")) {
    categories.push(
      await prisma.blogCategory.create({
        data: { name: cat, slug: cat.toLowerCase() },
      })
    );
  }

  let postsCreated = 0;
  for (const [postIndex, post] of POSTS.entries()) {
    const category = categories.find((c) => c.name.toLowerCase() === post.category.toLowerCase());
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: BLOG_COVERS[postIndex % BLOG_COVERS.length],
        authorId: blogger.id,
        categoryId: category?.id ?? null,
        tags: post.tags,
        status: "PUBLISHED",
        views: post.views,
        likes: post.likes,
        readTimeMin: post.readTime,
        publishedAt: new Date(post.publishedAt),
      },
    });
    postsCreated++;
  }
  console.log(`  ✔ Created ${postsCreated} blog posts + ${categories.length} categories`);

  // ------------------------------------------------------------
  // 10. FAQS
  // ------------------------------------------------------------
  await prisma.fAQ.createMany({
    data: [
      {
        question: "How do I book a class?",
        answer:
          "Log in, open the Classes page, pick a session, and hit Book. You can cancel or reschedule up to 4 hours before start.",
        category: "General",
        order: 1,
      },
      {
        question: "How does the AI workout generator work?",
        answer:
          "Tell us your goal, experience, equipment, and days per week — our AI builds a complete weekly plan with sets, reps, rest, warmup and cooldown in seconds.",
        category: "AI",
        order: 2,
      },
      {
        question: "What is the QR check-in?",
        answer:
          "Every member gets a personal QR membership card. Scan it at the front desk — attendance, streaks, and rewards update instantly.",
        category: "Membership",
        order: 3,
      },
      {
        question: "Can I freeze my membership?",
        answer:
          "Yes. Elite members can freeze for up to 30 days per year. Contact support to schedule a freeze.",
        category: "Membership",
        order: 4,
      },
      {
        question: "How do refunds work?",
        answer:
          "Annual plans are refundable within 14 days of purchase, minus processing fees. See the Refund Policy for details.",
        category: "Billing",
        order: 5,
      },
      {
        question: "Do you offer personal training?",
        answer:
          "Yes — 6 certified coaches offer 1-on-1 sessions. Book directly from a trainer's profile page.",
        category: "Training",
        order: 6,
      },
    ],
  });
  console.log("  ✔ Created FAQs");

  // ------------------------------------------------------------
  // 11. GAMIFICATION
  // ------------------------------------------------------------
  await prisma.badge.createMany({
    data: [
      {
        name: "First Step",
        description: "Complete your first workout",
        icon: "Footprints",
        xpValue: 10,
      },
      { name: "7-Day Streak", description: "Train 7 days in a row", icon: "Flame", xpValue: 25 },
      { name: "30-Day Streak", description: "Train 30 days in a row", icon: "Zap", xpValue: 100 },
      { name: "PR Hunter", description: "Set a personal record", icon: "Trophy", xpValue: 20 },
      {
        name: "Hydration Hero",
        description: "Hit your water goal 7 days straight",
        icon: "Droplets",
        xpValue: 15,
      },
      { name: "Early Bird", description: "Check in before 8 AM", icon: "Sunrise", xpValue: 15 },
      { name: "Century Club", description: "Complete 100 workouts", icon: "Medal", xpValue: 150 },
      {
        name: "Community Champ",
        description: "Refer a friend who joins",
        icon: "Users",
        xpValue: 50,
      },
    ],
  });
  const badges = await prisma.badge.findMany();

  const challengeDefs = [
    {
      title: "October Consistency",
      description: "Complete 16 workouts before the end of the month.",
      goalType: "WORKOUTS" as const,
      goalValue: 16,
      startDate: daysAgo(10, 0, 0),
      endDate: daysFromNow(20, 23, 59),
      isActive: true,
      reward: { description: "500 bonus points + Titan water bottle" },
    },
    {
      title: "Hydration Sprint",
      description: "Hit your 3L water goal for 7 days straight.",
      goalType: "WATER" as const,
      goalValue: 7,
      startDate: daysAgo(3, 0, 0),
      endDate: daysFromNow(10, 23, 59),
      isActive: true,
      reward: { description: "250 bonus points + recovery session" },
    },
    {
      title: "Weekend Warrior",
      description: "Check in 12 times this month, including weekends.",
      goalType: "ATTENDANCE" as const,
      goalValue: 12,
      startDate: daysAgo(1, 0, 0),
      endDate: daysFromNow(30, 23, 59),
      isActive: true,
      reward: { description: "300 bonus points + guest pass" },
    },
    {
      title: "Step Into Fall",
      description: "Log 70,000 steps this season.",
      goalType: "STEPS" as const,
      goalValue: 70000,
      startDate: daysAgo(45, 0, 0),
      endDate: daysFromNow(15, 23, 59),
      isActive: true,
      reward: { description: "400 bonus points + Titan hoodie" },
    },
    {
      title: "Summer Strength",
      description: "Complete 20 strength workouts in six weeks.",
      goalType: "WORKOUTS" as const,
      goalValue: 20,
      startDate: daysAgo(120, 0, 0),
      endDate: daysAgo(60, 23, 59),
      isActive: false,
      reward: { description: "Completed challenge badge" },
    },
  ];

  const challenges = [];
  for (const def of challengeDefs) {
    challenges.push(await prisma.challenge.create({ data: def }));
  }
  console.log("  ✔ Created badges + challenges");

  // ------------------------------------------------------------
  // 12. SETTINGS & COUPONS
  // ------------------------------------------------------------
  await prisma.setting.createMany({
    data: [
      { key: "site_name", value: "Titan Fitness", group: "general" },
      { key: "support_email", value: "support@titanfitness.com", group: "general" },
      { key: "referral_reward_amount", value: 20, group: "referrals" },
      { key: "workout_points_per_session", value: 10, group: "gamification" },
      { key: "daily_water_goal_ml", value: 3000, group: "goals" },
    ],
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: "TITAN10",
        type: "PERCENTAGE",
        value: new Prisma.Decimal(10),
        maxUses: 500,
        validFrom: daysAgo(30, 0, 0),
        validUntil: daysFromNow(120, 23, 59),
        isActive: true,
      },
      {
        code: "SUMMER25",
        type: "PERCENTAGE",
        value: new Prisma.Decimal(25),
        maxUses: 200,
        validFrom: daysAgo(90, 0, 0),
        validUntil: daysAgo(20, 23, 59),
        isActive: true,
      },
    ],
  });
  console.log("  ✔ Created settings + coupons");

  // ------------------------------------------------------------
  // 13. MEMBERSHIP FOR SECOND MEMBER (PENDING, for admin demos)
  // ------------------------------------------------------------
  await prisma.membership.create({
    data: {
      userId: member2.id,
      planId: plans[0].id,
      branchId: branches[1].id,
      status: "PENDING",
    },
  });

  // ------------------------------------------------------------
  // 14. DEMO ACTIVITY (bookings, notifications, tickets, gamification)
  // ------------------------------------------------------------
  const upcomingClasses = classes
    .filter((cls) => cls.startTime > seedNow)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const pastClasses = classes
    .filter((cls) => cls.startTime < seedNow)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  const memberBookingDefs = [
    { cls: upcomingClasses[0], status: "BOOKED" as const, checkedIn: false },
    { cls: upcomingClasses[4], status: "BOOKED" as const, checkedIn: false },
    { cls: upcomingClasses[7], status: "BOOKED" as const, checkedIn: false },
    { cls: pastClasses[0], status: "COMPLETED" as const, checkedIn: true },
    { cls: pastClasses[2], status: "COMPLETED" as const, checkedIn: true },
    { cls: pastClasses[4], status: "NO_SHOW" as const, checkedIn: false },
    { cls: pastClasses[6], status: "CANCELLED" as const, checkedIn: false },
    { cls: pastClasses[8], status: "COMPLETED" as const, checkedIn: true },
    { cls: pastClasses[10], status: "COMPLETED" as const, checkedIn: true },
  ];

  for (const booking of memberBookingDefs) {
    await prisma.booking.create({
      data: {
        userId: member.id,
        classId: booking.cls.id,
        branchId: booking.cls.branchId,
        programId: booking.cls.programId,
        status: booking.status,
        checkedIn: booking.checkedIn,
        completedAt:
          booking.status === "COMPLETED"
            ? new Date(booking.cls.endTime.getTime() + 15 * 60_000)
            : null,
        cancelledAt: booking.status === "CANCELLED" ? daysAgo(3, 10, 0) : null,
      },
    });
  }

  for (const [index, demo] of demoMembers.slice(0, 16).entries()) {
    const targetClass = upcomingClasses[(index * 3 + 2) % upcomingClasses.length];
    await prisma.booking.create({
      data: {
        userId: demo.user.id,
        classId: targetClass.id,
        branchId: targetClass.branchId,
        programId: targetClass.programId,
        status: "BOOKED",
        checkedIn: false,
      },
    });
    if (index % 2 === 0) {
      const completedClass = pastClasses[(index * 2 + 1) % pastClasses.length];
      await prisma.booking.create({
        data: {
          userId: demo.user.id,
          classId: completedClass.id,
          branchId: completedClass.branchId,
          programId: completedClass.programId,
          status: "COMPLETED",
          checkedIn: true,
          completedAt: completedClass.endTime,
        },
      });
    }
  }

  const notificationDefs = [
    {
      title: "Welcome to Titan Pro",
      body: "Your Pro membership is active. AI coaching, all branches, and priority booking are unlocked.",
      type: "MEMBERSHIP" as const,
      read: true,
      days: 18,
    },
    {
      title: "New personal record",
      body: "Bench press PR logged at 92.5 kg. Your strength score jumped 4%.",
      type: "ACHIEVEMENT" as const,
      read: false,
      days: 1,
    },
    {
      title: "Class reminder",
      body: "Your next class starts soon. Bring a towel and arrive 10 minutes early.",
      type: "CLASS" as const,
      read: false,
      days: 0,
    },
    {
      title: "Hydration check",
      body: "You are 600 ml away from today's water goal. Finish strong.",
      type: "DIET_REMINDER" as const,
      read: false,
      days: 0,
    },
    {
      title: "October Consistency is live",
      body: "Complete 16 workouts this month to earn 500 bonus points.",
      type: "PROMOTION" as const,
      read: true,
      days: 8,
    },
    {
      title: "Payment receipt",
      body: "Your Pro membership payment of $59.00 succeeded. Receipt is available in Payments.",
      type: "PAYMENT" as const,
      read: true,
      days: 31,
    },
    {
      title: "Referral reward",
      body: "A friend joined with your code. 20 points were added to your account.",
      type: "REFERRAL" as const,
      read: true,
      days: 44,
    },
  ];

  for (const notification of notificationDefs) {
    await prisma.notification.create({
      data: {
        userId: member.id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        readAt: notification.read ? daysAgo(notification.days + 1, 10, 0) : null,
        sentAt: daysAgo(notification.days, 9, 0),
        createdAt: daysAgo(notification.days, 9, 0),
        data: { url: "/dashboard/notifications" },
      },
    });
  }

  for (const [index, demo] of demoMembers.entries()) {
    await prisma.notification.createMany({
      data: [
        {
          userId: demo.user.id,
          title: index % 2 === 0 ? "Workout reminder" : "Class booked",
          body:
            index % 2 === 0
              ? "Your next session is waiting. Five minutes of warm-up makes all the difference."
              : "Your spot is confirmed. Check the class schedule for details.",
          type: index % 2 === 0 ? "WORKOUT_REMINDER" : "CLASS",
          readAt: index % 5 === 0 ? null : daysAgo(index + 1, 12, 0),
          sentAt: daysAgo(index % 12, 8, 0),
        },
      ],
    });

    const pointValue = 620 + ((index * 173) % 3100);
    await prisma.userPoint.create({
      data: { userId: demo.user.id, points: pointValue },
    });

    if (index < 12) {
      for (let day = 0; day < 12; day++) {
        if (day > 2 && (day + index) % 7 === 0) continue;
        await prisma.bodyMetric.create({
          data: {
            userId: demo.user.id,
            date: daysFromNow(-day, 7, 30),
            weightKg: round1(
              Number(demo.user.weightKg ?? 70) - (12 - day) * 0.04 + ((index + day) % 3) * 0.1
            ),
            bodyFatPct: round1(15 + (index % 9) - day * 0.03),
            muscleMassKg: round1(30 + (index % 8) + day * 0.02),
            bmi: round1(23 + (index % 5) * 0.4 - day * 0.01),
            waterLiters: 2.4 + ((index + day) % 4) * 0.2,
          },
        });
        await prisma.waterLog.create({
          data: {
            userId: demo.user.id,
            date: daysFromNow(-day, 19, 0),
            amountMl: 1800 + ((index + day) % 6) * 220,
          },
        });
      }
    }

    if (index < 18) {
      const attendanceDays = 8 + (index % 16);
      for (let day = 0; day < attendanceDays; day++) {
        if (day > 2 && (day + index) % 6 === 0) continue;
        const checkIn = daysFromNow(-day, 7 + ((index + day) % 8), 10);
        await prisma.attendance.create({
          data: {
            userId: demo.user.id,
            branchId: branches[(index + day) % branches.length].id,
            checkInTime: checkIn,
            checkOutTime: new Date(checkIn.getTime() + (45 + (index % 4) * 10) * 60_000),
            method: (index + day) % 3 === 0 ? "QR" : "MANUAL",
            status: (index + day) % 11 === 0 ? "LATE" : "PRESENT",
          },
        });
      }
    }
  }

  await prisma.userPoint.create({
    data: { userId: member.id, points: 4280 },
  });
  await prisma.userPoint.create({
    data: { userId: member2.id, points: 980 },
  });
  await prisma.userPoint.create({
    data: { userId: trainers[0].user.id, points: 720 },
  });

  const memberBadges = badges.filter((badge) =>
    ["First Step", "7-Day Streak", "PR Hunter", "Hydration Hero", "Early Bird"].includes(badge.name)
  );
  for (const badge of memberBadges) {
    await prisma.userBadge.create({
      data: {
        userId: member.id,
        badgeId: badge.id,
        earnedAt: daysAgo(12, 8, 0),
      },
    });
  }
  for (const [index, demo] of demoMembers.slice(0, 14).entries()) {
    const badge = badges[index % badges.length];
    await prisma.userBadge.create({
      data: {
        userId: demo.user.id,
        badgeId: badge.id,
        earnedAt: daysAgo(5 + index, 9, 0),
      },
    });
  }

  const activeChallenges = challenges.filter((challenge) => challenge.isActive);
  for (const [index, challenge] of activeChallenges.entries()) {
    await prisma.userChallenge.create({
      data: {
        userId: member.id,
        challengeId: challenge.id,
        progress: [11, 5, 7, 42000][index] ?? 1,
        joinedAt: daysAgo(6 + index, 10, 0),
      },
    });
    for (const demo of demoMembers.slice(0, 8)) {
      await prisma.userChallenge.create({
        data: {
          userId: demo.user.id,
          challengeId: challenge.id,
          progress: (demo.index * 3 + index * 2) % challenge.goalValue,
          joinedAt: daysAgo(4 + demo.index, 11, 0),
        },
      });
    }
  }

  const ticketDefs = [
    {
      subject: "Membership renewal question",
      description: "Can I switch from Pro to Elite before my next billing date?",
      status: "OPEN" as const,
      priority: "MEDIUM" as const,
      category: "Membership",
      days: 1,
      replies: [
        { role: "MEMBER", content: "I would like to upgrade and keep my existing start date." },
      ],
    },
    {
      subject: "Class booking not showing",
      description: "I booked the 6 PM HIIT class but it is not in my upcoming list.",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      category: "Classes",
      days: 2,
      replies: [
        { role: "MEMBER", content: "This happened on the mobile web version." },
        { role: "ADMIN", content: "Thanks for flagging it — we are checking the booking record." },
      ],
    },
    {
      subject: "Nutrition plan adjustment",
      description: "Please swap dairy options in my meal plan for plant-based alternatives.",
      status: "OPEN" as const,
      priority: "LOW" as const,
      category: "Nutrition",
      days: 4,
      replies: [{ role: "MEMBER", content: "I am lactose intolerant and mostly eat plant-based." }],
    },
    {
      subject: "Payment receipt missing",
      description: "I need a receipt for my last membership payment for expense reporting.",
      status: "RESOLVED" as const,
      priority: "MEDIUM" as const,
      category: "Billing",
      days: 8,
      replies: [
        { role: "MEMBER", content: "The receipt is for the Pro plan paid earlier this month." },
        { role: "ADMIN", content: "Sent to your email and attached to the payment record." },
      ],
    },
    {
      subject: "Trainer session reschedule",
      description: "Can I move Friday's personal training session to Saturday morning?",
      status: "IN_PROGRESS" as const,
      priority: "URGENT" as const,
      category: "Training",
      days: 1,
      replies: [
        { role: "MEMBER", content: "Saturday before 10 AM would be ideal." },
        { role: "ADMIN", content: "Marcus has an opening at 9 AM. Does that work?" },
      ],
    },
    {
      subject: "QR check-in not scanning",
      description: "The QR code on my phone has failed twice at the Downtown entrance.",
      status: "OPEN" as const,
      priority: "HIGH" as const,
      category: "Attendance",
      days: 0,
      replies: [{ role: "MEMBER", content: "The front desk checked me in manually both times." }],
    },
    {
      subject: "Feedback on the new recovery room",
      description: "The new recovery room is excellent. Please add more foam rollers.",
      status: "CLOSED" as const,
      priority: "LOW" as const,
      category: "Facilities",
      days: 15,
      replies: [
        { role: "MEMBER", content: "Loved the cold plunge setup." },
        { role: "ADMIN", content: "Thank you! More foam rollers are on the way." },
      ],
    },
  ];

  const ticketOwners = [member, ...demoMembers.slice(0, 5).map((demo) => demo.user)];
  for (const [index, ticketDef] of ticketDefs.entries()) {
    const owner = ticketOwners[index % ticketOwners.length];
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: owner.id,
        subject: ticketDef.subject,
        description: ticketDef.description,
        status: ticketDef.status,
        priority: ticketDef.priority,
        category: ticketDef.category,
        createdAt: daysAgo(ticketDef.days, 10, 0),
        resolvedAt: ticketDef.status === "RESOLVED" ? daysAgo(2, 16, 0) : null,
      },
    });
    for (const [replyIndex, reply] of ticketDef.replies.entries()) {
      await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          senderId: reply.role === "ADMIN" ? admin.id : owner.id,
          senderRole: reply.role,
          content: reply.content,
          createdAt: daysAgo(Math.max(0, ticketDef.days - replyIndex), 11 + replyIndex, 0),
        },
      });
    }
  }

  for (const [index, demo] of demoMembers.slice(0, 5).entries()) {
    await prisma.referral.create({
      data: {
        code: member.referralCode ?? "ALEX-TITAN",
        referredById: member.id,
        referredUserId: demo.user.id,
        status: index < 3 ? "REWARDED" : index === 3 ? "PENDING" : "EXPIRED",
        rewardAmount: index < 3 ? new Prisma.Decimal(20) : null,
        redeemedAt: index < 3 ? daysAgo(12 + index * 4, 12, 0) : null,
        createdAt: daysAgo(20 + index * 3, 9, 0),
      },
    });
  }

  await prisma.progressPhoto.createMany({
    data: [
      {
        userId: member.id,
        imageUrl: "/male3.jpg",
        stage: "BEFORE",
        note: "Starting point — building a consistent routine.",
        takenAt: daysAgo(120, 8, 0),
      },
      {
        userId: member.id,
        imageUrl: "/male3.jpg",
        stage: "NOW",
        note: "Eight weeks in — stronger and leaner.",
        takenAt: daysAgo(14, 8, 0),
      },
      {
        userId: member.id,
        imageUrl: "/male3.jpg",
        stage: "NOW",
        note: "Progress check after a full month of consistency.",
        takenAt: daysAgo(2, 8, 0),
      },
    ],
  });

  const mealDays = Array.from({ length: 7 }, (_, dayIndex) => ({
    dayNumber: dayIndex + 1,
    meals: [
      {
        mealType: "BREAKFAST" as const,
        name: ["Protein oats", "Egg white omelette", "Greek yogurt bowl", "Peanut butter toast"][
          dayIndex % 4
        ],
        calories: 520,
        protein: 34,
        carbs: 58,
        fat: 16,
      },
      {
        mealType: "LUNCH" as const,
        name: ["Chicken rice bowl", "Turkey wrap", "Salmon salad", "Beef burrito bowl"][
          dayIndex % 4
        ],
        calories: 710,
        protein: 48,
        carbs: 72,
        fat: 22,
      },
      {
        mealType: "SNACK" as const,
        name: ["Protein shake + banana", "Apple + peanut butter", "Cottage cheese + berries"][
          dayIndex % 3
        ],
        calories: 260,
        protein: 22,
        carbs: 26,
        fat: 8,
      },
      {
        mealType: "DINNER" as const,
        name: ["Salmon and sweet potato", "Lean beef stir fry", "Chicken pasta", "Tofu curry"][
          dayIndex % 4
        ],
        calories: 680,
        protein: 46,
        carbs: 54,
        fat: 26,
      },
    ],
  }));

  await prisma.mealPlan.create({
    data: {
      userId: member.id,
      name: "Lean Muscle — 7 Day Plan",
      goal: "MUSCLE_GAIN",
      dailyCalories: 2600,
      proteinGrams: 190,
      carbsGrams: 280,
      fatGrams: 78,
      durationDays: 7,
      isAiGenerated: true,
      shoppingList: [
        "Chicken breast",
        "Salmon",
        "Brown rice",
        "Oats",
        "Greek yogurt",
        "Eggs",
        "Bananas",
        "Sweet potato",
        "Mixed vegetables",
      ],
      days: {
        create: mealDays.map((day) => ({
          dayNumber: day.dayNumber,
          meals: { create: day.meals },
        })),
      },
    },
  });

  await prisma.aIUsage.createMany({
    data: Array.from({ length: 18 }, (_, index) => ({
      userId: member.id,
      feature:
        index % 3 === 0
          ? ("WORKOUT_GENERATOR" as const)
          : index % 3 === 1
            ? ("NUTRITIONIST" as const)
            : ("CHATBOT" as const),
      model: "titan-rule-based-v1",
      tokensIn: 180 + index * 17,
      tokensOut: 420 + index * 23,
      cost: new Prisma.Decimal(0),
      durationMs: 220 + index * 11,
      status: "SUCCESS",
      createdAt: daysAgo(index * 2, 9, 0),
    })),
  });

  for (const [index, demo] of demoMembers.slice(0, 10).entries()) {
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: index % 2 === 0 ? "member.updated" : "membership.renewed",
        entityType: "User",
        entityId: demo.user.id,
        details: { source: "seed", demo: true },
        createdAt: daysAgo(index + 1, 13, 0),
      },
    });
  }

  // ------------------------------------------------------------
  console.log("\n✅ Seed complete!");
  console.log("   Admin:  admin@titanfitness.com / Titan@12345");
  console.log("   Member: member@titanfitness.com / Titan@12345");
  console.log("   Trainer: marcus@titanfitness.com / Titan@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
