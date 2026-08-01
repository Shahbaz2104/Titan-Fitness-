export const APP_NAME = "Titan Fitness";
export const APP_TAGLINE = "Train Harder. Live Stronger.";
export const APP_DESCRIPTION =
  "The AI-powered gym management platform — workouts, nutrition, classes, and progress tracking in one place.";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const SUPPORT_EMAIL = "support@titanfitness.com";
export const SUPPORT_PHONE = "+1 (555) 014-8826";

export const SOCIALS = {
  instagram: "https://instagram.com",
  twitter: "https://x.com",
  youtube: "https://youtube.com",
  facebook: "https://facebook.com",
  tiktok: "https://tiktok.com",
} as const;

export const PROGRAM_CATEGORIES = [
  { label: "Weight Loss", value: "WEIGHT_LOSS", icon: "flame" },
  { label: "Bodybuilding", value: "BODYBUILDING", icon: "dumbbell" },
  { label: "CrossFit", value: "CROSSFIT", icon: "trophy" },
  { label: "Yoga", value: "YOGA", icon: "sparkles" },
  { label: "Cardio", value: "CARDIO", icon: "heart" },
  { label: "HIIT", value: "HIIT", icon: "zap" },
  { label: "Powerlifting", value: "POWERLIFTING", icon: "weight" },
  { label: "Calisthenics", value: "CALISTHENICS", icon: "person-standing" },
] as const;

export const CLASS_TYPES = [
  "YOGA",
  "CROSSFIT",
  "HIIT",
  "ZUMBA",
  "SPINNING",
  "BOXING",
  "PILATES",
  "STRENGTH",
  "CARDIO",
] as const;

export const FITNESS_GOALS = [
  { label: "Weight Loss", value: "WEIGHT_LOSS" },
  { label: "Muscle Gain", value: "MUSCLE_GAIN" },
  { label: "Strength", value: "STRENGTH" },
  { label: "Endurance", value: "ENDURANCE" },
  { label: "General Fitness", value: "GENERAL_FITNESS" },
  { label: "Flexibility", value: "FLEXIBILITY" },
] as const;

export const EXPERIENCE_LEVELS = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
] as const;

export const EQUIPMENT_OPTIONS = [
  "none",
  "dumbbells",
  "barbell",
  "kettlebell",
  "resistance-bands",
  "pull-up-bar",
  "bench",
  "cable-machine",
  "machine",
  "full-gym",
] as const;

export const WATER_DAILY_GOAL_ML = 3000;

export const STREAK_BONUS_POINTS = 5;
export const WORKOUT_POINTS = 10;
export const CLASS_POINTS = 8;
export const ATTENDANCE_POINTS = 5;
export const WATER_GOAL_POINTS = 3;

export const REFERRAL_REWARD = 20;

export const ITEMS_PER_PAGE = 12;

export const AI_FEATURES = {
  WORKOUT_GENERATOR: "WORKOUT_GENERATOR",
  NUTRITIONIST: "NUTRITIONIST",
  CHATBOT: "CHATBOT",
} as const;

export const DEFAULT_AI_MODEL = "gpt-4o-mini";

export const QUERY_KEYS = {
  user: ["user"],
  dashboard: ["dashboard"],
  workouts: ["workouts"],
  workoutPlans: ["workout-plans"],
  exercises: ["exercises"],
  nutrition: ["nutrition"],
  mealPlans: ["meal-plans"],
  classes: ["classes"],
  bookings: ["bookings"],
  attendance: ["attendance"],
  payments: ["payments"],
  membership: ["membership"],
  notifications: ["notifications"],
  blog: ["blog"],
  trainers: ["trainers"],
  programs: ["programs"],
  leaderboard: ["leaderboard"],
  challenges: ["challenges"],
  badges: ["badges"],
  referrals: ["referrals"],
  metrics: ["metrics"],
  water: ["water"],
  calories: ["calories"],
  aiChats: ["ai-chats"],
  adminDashboard: ["admin-dashboard"],
  adminMembers: ["admin-members"],
  adminMemberDetail: ["admin-member-detail"],
  adminRevenue: ["admin-revenue"],
  adminAttendance: ["admin-attendance"],
  adminPrograms: ["admin-programs"],
  adminClasses: ["admin-classes"],
  adminSettings: ["admin-settings"],
  adminTickets: ["admin-tickets"],
  adminCoupons: ["admin-coupons"],
  adminBranches: ["admin-branches"],
  adminBlogPosts: ["admin-blog-posts"],
  adminChallenges: ["admin-challenges"],
} as const;
