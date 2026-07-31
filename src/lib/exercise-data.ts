export interface ExerciseData {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  videoUrl?: string;
}

export const EXERCISES: ExerciseData[] = [
  // Chest
  { id: "barbell-bench-press", name: "Barbell Bench Press", muscleGroup: "Chest", equipment: "Barbell", difficulty: "Intermediate", category: "Chest" },
  { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", muscleGroup: "Chest", equipment: "Dumbbells", difficulty: "Beginner", category: "Chest" },
  { id: "push-up", name: "Push-Up", muscleGroup: "Chest", equipment: "Bodyweight", difficulty: "Beginner", category: "Chest" },
  { id: "cable-fly", name: "Cable Fly", muscleGroup: "Chest", equipment: "Cable Machine", difficulty: "Beginner", category: "Chest" },
  { id: "dips", name: "Dips (Chest)", muscleGroup: "Chest", equipment: "Parallel Bars", difficulty: "Intermediate", category: "Chest" },
  { id: "dumbbell-fly", name: "Dumbbell Fly", muscleGroup: "Chest", equipment: "Dumbbells", difficulty: "Beginner", category: "Chest" },
  // Back
  { id: "deadlift", name: "Deadlift", muscleGroup: "Back", equipment: "Barbell", difficulty: "Advanced", category: "Back" },
  { id: "pull-up", name: "Pull-Up", muscleGroup: "Back", equipment: "Pull-Up Bar", difficulty: "Intermediate", category: "Back" },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "Back", equipment: "Barbell", difficulty: "Intermediate", category: "Back" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "Back", equipment: "Cable Machine", difficulty: "Beginner", category: "Back" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "Back", equipment: "Cable Machine", difficulty: "Beginner", category: "Back" },
  { id: "face-pull", name: "Face Pull", muscleGroup: "Back", equipment: "Cable Machine", difficulty: "Beginner", category: "Back" },
  // Shoulders
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "Shoulders", equipment: "Barbell", difficulty: "Intermediate", category: "Shoulders" },
  { id: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press", muscleGroup: "Shoulders", equipment: "Dumbbells", difficulty: "Beginner", category: "Shoulders" },
  { id: "lateral-raise", name: "Lateral Raise", muscleGroup: "Shoulders", equipment: "Dumbbells", difficulty: "Beginner", category: "Shoulders" },
  { id: "rear-delt-fly", name: "Rear Delt Fly", muscleGroup: "Shoulders", equipment: "Dumbbells", difficulty: "Beginner", category: "Shoulders" },
  { id: "arnold-press", name: "Arnold Press", muscleGroup: "Shoulders", equipment: "Dumbbells", difficulty: "Intermediate", category: "Shoulders" },
  // Arms
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "Biceps", equipment: "Barbell", difficulty: "Beginner", category: "Arms" },
  { id: "dumbbell-curl", name: "Dumbbell Curl", muscleGroup: "Biceps", equipment: "Dumbbells", difficulty: "Beginner", category: "Arms" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "Biceps", equipment: "Dumbbells", difficulty: "Beginner", category: "Arms" },
  { id: "skull-crusher", name: "Skull Crusher", muscleGroup: "Triceps", equipment: "Barbell", difficulty: "Intermediate", category: "Arms" },
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "Triceps", equipment: "Cable Machine", difficulty: "Beginner", category: "Arms" },
  { id: "overhead-tricep-extension", name: "Overhead Tricep Extension", muscleGroup: "Triceps", equipment: "Dumbbells", difficulty: "Beginner", category: "Arms" },
  // Legs
  { id: "barbell-squat", name: "Barbell Squat", muscleGroup: "Quadriceps", equipment: "Barbell", difficulty: "Intermediate", category: "Legs" },
  { id: "front-squat", name: "Front Squat", muscleGroup: "Quadriceps", equipment: "Barbell", difficulty: "Advanced", category: "Legs" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "Quadriceps", equipment: "Machine", difficulty: "Beginner", category: "Legs" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "Hamstrings", equipment: "Barbell", difficulty: "Intermediate", category: "Legs" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "Hamstrings", equipment: "Machine", difficulty: "Beginner", category: "Legs" },
  { id: "walking-lunge", name: "Walking Lunge", muscleGroup: "Quadriceps", equipment: "Bodyweight", difficulty: "Beginner", category: "Legs" },
  { id: "calf-raise", name: "Calf Raise", muscleGroup: "Calves", equipment: "Machine", difficulty: "Beginner", category: "Legs" },
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "Glutes", equipment: "Barbell", difficulty: "Intermediate", category: "Legs" },
  { id: "goblet-squat", name: "Goblet Squat", muscleGroup: "Quadriceps", equipment: "Dumbbells", difficulty: "Beginner", category: "Legs" },
  // Core
  { id: "plank", name: "Plank", muscleGroup: "Core", equipment: "Bodyweight", difficulty: "Beginner", category: "Core" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscleGroup: "Core", equipment: "Pull-Up Bar", difficulty: "Advanced", category: "Core" },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "Core", equipment: "Cable Machine", difficulty: "Beginner", category: "Core" },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "Core", equipment: "Bodyweight", difficulty: "Beginner", category: "Core" },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", muscleGroup: "Core", equipment: "Ab Wheel", difficulty: "Intermediate", category: "Core" },
  // Cardio
  { id: "treadmill-run", name: "Treadmill Run", muscleGroup: "Cardio", equipment: "Treadmill", difficulty: "Beginner", category: "Cardio" },
  { id: "rowing-machine", name: "Rowing Machine", muscleGroup: "Cardio", equipment: "Rower", difficulty: "Beginner", category: "Cardio" },
  { id: "battle-ropes", name: "Battle Ropes", muscleGroup: "Cardio", equipment: "Battle Ropes", difficulty: "Intermediate", category: "Cardio" },
  { id: "jump-rope", name: "Jump Rope", muscleGroup: "Cardio", equipment: "Jump Rope", difficulty: "Beginner", category: "Cardio" },
  { id: "box-jump", name: "Box Jump", muscleGroup: "Plyometrics", equipment: "Box", difficulty: "Advanced", category: "Cardio" },
  { id: "burpee", name: "Burpee", muscleGroup: "Full Body", equipment: "Bodyweight", difficulty: "Intermediate", category: "Cardio" },
  { id: "kettlebell-swing", name: "Kettlebell Swing", muscleGroup: "Full Body", equipment: "Kettlebell", difficulty: "Intermediate", category: "Cardio" },
];

export function getExercises(): ExerciseData[] {
  return EXERCISES;
}

export function searchExercises(query: string, muscleGroup: string): ExerciseData[] {
  const q = query.toLowerCase().trim();
  return EXERCISES.filter((exercise) => {
    const matchesGroup = muscleGroup === "All" || exercise.category === muscleGroup;
    const matchesQuery =
      !q ||
      exercise.name.toLowerCase().includes(q) ||
      exercise.equipment.toLowerCase().includes(q);
    return matchesGroup && matchesQuery;
  });
}

export const MUSCLE_GROUPS = [
  "All",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Cardio",
] as const;
