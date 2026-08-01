import { PrismaClient, Prisma } from "@prisma/client";
import { Difficulty, ExerciseCategory, ClassType, ProgramCategory } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { EXERCISES } from "../src/lib/exercise-data";
import { getPosts, BLOG_CATEGORIES } from "../src/lib/blog-data";

const POSTS = getPosts();

const prisma = new PrismaClient();

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

  await createUserWithCredentials({
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

  console.log("  ✔ Created users (admin, 6 trainers, 2 members, editorial)");

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

  await prisma.membership.create({
    data: {
      userId: member.id,
      planId: plans[1].id,
      branchId: branches[0].id,
      status: "ACTIVE",
      startDate: new Date("2026-01-05"),
      endDate: new Date("2026-12-31"),
      autoRenew: true,
    },
  });

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
  // 7. CLASS SCHEDULES (today + next 7 days)
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
  const now = new Date();

  const classes = await Promise.all(
    classTypes.map((type, i) => {
      const day = new Date(now);
      day.setDate(day.getDate() + (i % 7));
      const startTime = new Date(day);
      startTime.setHours(8 + (i % 3) * 3, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1, 0, 0, 0);
      return prisma.classSchedule.create({
        data: {
          branchId: branches[i % branches.length].id,
          programId: programs[i % programs.length].id,
          trainerId: trainers[i % trainers.length].profile.id,
          title: `Titan ${type.charAt(0) + type.slice(1).toLowerCase()}`,
          type,
          description: `High-energy ${type.toLowerCase()} session for all levels.`,
          capacity: 20,
          startTime,
          endTime,
          isRecurring: true,
          repeatDays: ["MON", "WED", "FRI"],
        },
      });
    })
  );
  console.log(`  ✔ Created ${classes.length} class schedules`);

  // ------------------------------------------------------------
  // 8. MEMBER DATA (metrics, water, attendance, workout plan)
  // ------------------------------------------------------------
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(12, 0, 0, 0);
    await prisma.bodyMetric.create({
      data: {
        userId: member.id,
        date,
        weightKg: 82 - i * 0.2 + Math.sin(i) * 0.3,
        bodyFatPct: 18 - i * 0.15,
        muscleMassKg: 34 + i * 0.1,
        bmi: 25.9 - i * 0.06,
        waterLiters: 2.5 + Math.round(Math.sin(i * 2)) * 0.2,
      },
    });
  }

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    await prisma.waterLog.create({
      data: { userId: member.id, date, amountMl: 1500 + ((i * 7) % 10) * 250 },
    });
  }

  for (let i = 10; i >= 1; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const checkIn = new Date(date);
    checkIn.setHours(8 + (i % 5), 15, 0, 0);
    const checkOut = new Date(checkIn);
    checkOut.setHours(checkIn.getHours() + 1, 20, 0, 0);
    await prisma.attendance.create({
      data: {
        userId: member.id,
        branchId: branches[0].id,
        checkInTime: checkIn,
        checkOutTime: checkOut,
        method: "QR",
        status: "PRESENT",
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
      date: new Date(now.setHours(9, 0, 0, 0)),
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
  for (const post of POSTS) {
    const category = categories.find((c) => c.name.toLowerCase() === post.category.toLowerCase());
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: null,
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

  await prisma.challenge.createMany({
    data: [
      {
        title: "March Momentum",
        description: "Complete 12 workouts this month.",
        startDate: new Date("2026-03-01"),
        endDate: new Date("2026-03-31"),
        goalType: "WORKOUTS",
        goalValue: 12,
        isActive: false,
      },
      {
        title: "Hydration Week",
        description: "Drink 3L every day for 7 days.",
        startDate: new Date("2026-07-20"),
        endDate: new Date("2026-07-26"),
        goalType: "WATER",
        goalValue: 7,
        isActive: false,
      },
      {
        title: "August Push",
        description: "Complete 15 workouts in August.",
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-08-31"),
        goalType: "WORKOUTS",
        goalValue: 15,
        isActive: true,
      },
      {
        title: "Early Riser Challenge",
        description: "Check in before 9 AM 10 times.",
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-08-31"),
        goalType: "ATTENDANCE",
        goalValue: 10,
        isActive: true,
      },
    ],
  });
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
        validFrom: new Date("2026-01-01"),
        validUntil: new Date("2026-12-31"),
        isActive: true,
      },
      {
        code: "SUMMER25",
        type: "PERCENTAGE",
        value: new Prisma.Decimal(25),
        maxUses: 200,
        validFrom: new Date("2026-06-01"),
        validUntil: new Date("2026-08-31"),
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
