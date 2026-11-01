export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "Titan@12345";

export const DEMO_ACCOUNTS = [
  {
    label: "Member",
    description: "Dashboard, workouts and progress",
    email: "member@titanfitness.com",
    redirect: "/dashboard",
  },
  {
    label: "Admin",
    description: "Gym management console",
    email: "admin@titanfitness.com",
    redirect: "/admin",
  },
  {
    label: "Trainer",
    description: "Coach schedule and members",
    email: "marcus@titanfitness.com",
    redirect: "/dashboard",
  },
] as const;
