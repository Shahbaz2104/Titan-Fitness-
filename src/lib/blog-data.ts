export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  readTime: number;
  views: number;
  likes: number;
  publishedAt: string;
  content: string;
  featured?: boolean;
}

export const BLOG_CATEGORIES = [
  "All",
  "Nutrition",
  "Strength",
  "Recovery",
  "Cardio",
  "Mindset",
  "Science",
] as const;

const POSTS: BlogPostData[] = [
  {
    slug: "10-science-backed-habits-for-sustainable-fat-loss",
    title: "10 Science-Backed Habits for Sustainable Fat Loss",
    excerpt:
      "Forget crash diets. These evidence-based habits are what actually move the needle long-term.",
    category: "Nutrition",
    tags: ["fat loss", "nutrition", "habits"],
    author: "Emily Chen",
    authorRole: "Nutrition Coach",
    readTime: 8,
    views: 12400,
    likes: 342,
    publishedAt: "2026-07-20",
    featured: true,
    content: `# 10 Science-Backed Habits for Sustainable Fat Loss

Fat loss isn't complicated — but it is *hard*. The difference between people who keep the weight off and those who bounce back comes down to habits, not willpower.

## 1. Eat Protein at Every Meal

Protein is the most satiating macronutrient. Aim for **25–40g of protein per meal**. This keeps hunger in check and preserves muscle during a deficit.

> Research consistently shows that higher protein intakes (1.6–2.2g/kg) improve fat loss outcomes while retaining lean mass.

## 2. Walk More

Zone 2 cardio doesn't need to be sexy. A daily 8,000–10,000 step baseline burns 300–500 extra calories without adding stress.

## 3. Sleep 7–9 Hours

Sleep deprivation spikes ghrelin (hunger hormone) and suppresses leptin (satiety hormone). A single poor night can increase next-day calorie intake by 300+ calories.

## 4. Strength Train 3–4x Per Week

Muscle is metabolically expensive. More muscle = higher resting metabolism = easier maintenance.

## 5. Use Smaller Plates

It sounds silly, but plate size influences portion perception by up to **30%**.

## 6. Don't Drink Your Calories

Liquid calories bypass satiety signals. Soda, juice, and fancy coffees are the easiest calories to cut.

## 7. Prep Your Week on Sunday

Ninety minutes of meal prep on Sunday eliminates 90% of mid-week decisions — and decision fatigue is where diets die.

## 8. Weigh Yourself Daily (and Ignore Daily Fluctuations)

Daily weighing + weekly averaging removes the psychological noise of single weigh-ins. Track the 7-day trend, not the daily number.

## 9. Eat Fiber Before Carbs

Vegetables first, then protein, then carbs. Fiber slows gastric emptying and stabilizes blood sugar.

## 10. Focus on Consistency Over Perfection

The best diet is the one you can sustain at 80% compliance for a year. Perfection is a sprint; consistency is the marathon that wins.

## The Takeaway

Pick **two habits** from this list and master them for two weeks. Then add two more. Sustainable fat loss is a ladder, not a leap.`,
  },
  {
    slug: "the-complete-beginner-guide-to-barbell-training",
    title: "The Complete Beginner's Guide to Barbell Training",
    excerpt:
      "Master the squat, bench, and deadlift with this step-by-step guide to technique and programming.",
    category: "Strength",
    tags: ["barbell", "squat", "bench", "deadlift"],
    author: "Marcus Cole",
    authorRole: "Head Strength Coach",
    readTime: 12,
    views: 9800,
    likes: 415,
    publishedAt: "2026-07-12",
    content: `# The Complete Beginner's Guide to Barbell Training

The barbell is the most efficient tool ever invented for building strength. Here's how to master the big three safely.

## The Squat

**Setup:** Bar on your upper back (not your neck). Feet shoulder-width apart, toes slightly out.

**The descent:** Sit *back and down* — imagine closing a car door with your glutes. Keep your chest up and knees tracking over toes.

**Depth:** Hip crease below the top of the knee for competition standards. Build to this gradually with box squats.

## The Bench Press

**Setup:** Eyes under the bar. Scapulae pinched together — a stable shelf beats a big arch.

**The descent:** Bring the bar to your lower chest/sternum. Elbows at roughly 45° to protect your shoulders.

**The press:** Push the bar *back and up* toward your chin, driving through your feet.

## The Deadlift

**Setup:** Bar over mid-foot. Hinge back, grip the bar, and wedge your hips down.

**The pull:** Think "push the floor away." Keep the bar close to your legs — the closer the bar, the shorter the lever.

**Lockout:** Stand tall. Don't lean back at the top.

## How to Progress

Start with the **strongLifts-style framework** but adapt it to your life:

1. 3 sets of 5 reps across the board
2. Add **2.5kg per session** on upper body, **5kg** on lower body
3. When you stall, reset by 10% and work back up

## Common Beginner Mistakes

- **Looking in the mirror** — your neck hates it. Keep your head neutral.
- **Lifting in running shoes** — they compress. Flat soles or lifting shoes only.
- **Skipping warm-ups** — 5 ramp-up sets with increasing weight prepare your nervous system.

## When to Add Accessories

When your main lifts stall, accessories fix the weak links:

| Stuck lift | Weak point | Accessory |
|------------|-----------|-----------|
| Squat | Bottom position | Pause squats, goblet squats |
| Bench | Lockout | Close-grip bench, weighted dips |
| Deadlift | Off the floor | Deficit deadlifts, paused rows |

Remember: **technique is the foundation**. Lift light, film every set, and fix your form before adding weight.`,
  },
  {
    slug: "why-rest-days-are-where-gains-are-made",
    title: "Why Rest Days Are Where Gains Are Made",
    excerpt:
      "Recovery isn't laziness — it's training. Here's how to optimize sleep, nutrition, and recovery.",
    category: "Recovery",
    tags: ["recovery", "sleep", "muscle growth"],
    author: "David Okoro",
    authorRole: "Performance Coach",
    readTime: 6,
    views: 15200,
    likes: 528,
    publishedAt: "2026-07-05",
    content: `# Why Rest Days Are Where Gains Are Made

Here's the truth nobody at the gym wants to hear: **you don't grow in the gym. You grow while you recover.**

## The Science in 60 Seconds

Training damages muscle fibers. Your body rebuilds them *stronger* during the 24–72 hours after training — but only if you give it the right conditions.

## The Three Pillars of Recovery

### 1. Sleep — Non-Negotiable

- **7–9 hours** per night
- Growth hormone peaks during deep sleep
- Each lost hour of sleep measurably reduces next-day performance

### 2. Nutrition — The Building Blocks

- **1.6–2.2g protein/kg** bodyweight daily
- Carbs aren't the enemy — they refuel glycogen
- Hit your calories on rest days too. "Rest day deficit" is a myth that kills gains.

### 3. Active Recovery — Move, Don't Train

- 20–30 minutes of walking or easy cycling
- Foam rolling and mobility work
- Sauna/cold exposure *if* it makes you feel better

## Signs You Need More Rest

- Resting heart rate elevated 5+ bpm over baseline
- Poor sleep despite normal schedule
- Irritability and loss of motivation
- Strength stagnating for 3+ weeks

## The 80/20 Rule

If you're consistent with **sleep, protein, and daily movement**, you're doing 80% of recovery correctly. The rest (contrast baths, massage guns, supplements) is optional garnish.

## A Sample Rest Day

| Time | Action |
|------|--------|
| Morning | 20-min easy walk |
| Noon | High-protein meal (40g+) |
| Afternoon | Mobility flow (15 min) |
| Evening | 15-min foam rolling |
| Night | Lights out by 10:30pm |

Train hard. Recover harder. The gains follow.`,
  },
  {
    slug: "cardio-101-zone-training-explained",
    title: "Cardio 101: Heart Rate Zone Training Explained",
    excerpt: "Zone 2 isn't slow — it's smart. Here's how to build your aerobic engine properly.",
    category: "Cardio",
    tags: ["cardio", "zones", "endurance"],
    author: "David Okoro",
    authorRole: "Performance Coach",
    readTime: 7,
    views: 8900,
    likes: 267,
    publishedAt: "2026-06-28",
    content: `# Cardio 101: Heart Rate Zone Training Explained

Most people do cardio wrong — they run everything at "moderate" pace, which is neither fast enough to build power nor slow enough to build the aerobic base.

## The Five Zones

| Zone | % Max HR | Feel | Purpose |
|------|----------|------|---------|
| 1 | 50–60% | Very easy | Recovery |
| 2 | 60–70% | Conversational | Aerobic base |
| 3 | 70–80% | Steady effort | Tempo |
| 4 | 80–90% | Uncomfortable | Threshold |
| 5 | 90–100% | Sprints | Max power |

## Why Zone 2 Matters Most

Zone 2 trains your body to **burn fat for fuel** and builds mitochondrial density — your cellular energy factories. It's the foundation everything else sits on.

**The rule:** 80% of your weekly cardio volume should be Zone 2. The other 20% can be intervals.

## How to Find Your Zones

- **Simple formula:** 220 − age, then take percentages (estimate)
- **Better:** Lactate threshold test with a coach
- **Best:** Track with a heart rate monitor for 4–6 weeks

## Sample Weekly Structure

- **Mon:** 45 min Zone 2
- **Tue:** Rest
- **Wed:** 20 min Zone 4 intervals (4x4)
- **Thu:** 45 min Zone 2
- **Fri:** Rest
- **Sat:** 60 min Zone 2 (long)
- **Sun:** 30 min Zone 1 (recovery walk)

## Common Mistakes

1. **Too fast for Zone 2** — if you can't talk, you're not in Zone 2
2. **All intervals, no base** — you'll burn out in 3 weeks
3. **Ignoring strength** — cardio doesn't replace lifting

Build the engine first. Speed comes free.`,
  },
  {
    slug: "mindset-of-champions-mental-tools-for-gym-consistency",
    title: "The Mindset of Champions: Mental Tools for Gym Consistency",
    excerpt:
      "Motivation is unreliable. Systems, identity, and self-talk are what keep champions showing up.",
    category: "Mindset",
    tags: ["mindset", "consistency", "psychology"],
    author: "Sara Khan",
    authorRole: "Yoga & Mindset Coach",
    readTime: 5,
    views: 11300,
    likes: 489,
    publishedAt: "2026-06-15",
    content: `# The Mindset of Champions

You already know *what* to do in the gym. The question is *how* to keep doing it when motivation dies — because it always does.

## 1. Identity Over Goals

Don't set the goal "I want to lose 10kg." Become the person who **trains on Tuesdays at 7am**. Identity-based habits are sticky because they're not a chore — they're who you are.

> "Every action you take is a vote for the type of person you wish to become."

## 2. The Two-Day Rule

Never miss two days in a row. Life will interrupt you — work, travel, sickness. The rule isn't "never miss." It's "never miss *twice*."

## 3. Lower the Barrier

A 20-minute session you actually do beats a 90-minute session you skip. On hard days, tell yourself: *just put on the shoes and show up.* The workout will take care of itself.

## 4. Process Goals Beat Outcome Goals

You can't control whether you lose weight this month. You **can** control training 4x/week and hitting your protein. Focus on what you control.

## 5. Reframe Negative Self-Talk

- "I'm so weak" → "I'm in the early stages of strength"
- "I ate badly today" → "One meal doesn't define my week"
- "I'm too tired" → "I'll do a lighter session and keep the streak"

## 6. Use a Visibility System

Streaks, calendars, and checkmarks work. That X on the calendar is accountability you can see.

## The 5-Minute Journal

Every training day, write:

1. What I'm grateful for (body-related)
2. One win from today's session
3. What I'll do better tomorrow

Champions aren't born. They're built — one boring, consistent day at a time.`,
  },
  {
    slug: "protein-101-how-much-and-when-matters",
    title: "Protein 101: How Much and When It Actually Matters",
    excerpt:
      "The definitive breakdown of protein timing, dosing, and sources — without the bro-science.",
    category: "Nutrition",
    tags: ["protein", "muscle", "nutrition"],
    author: "Emily Chen",
    authorRole: "Nutrition Coach",
    readTime: 6,
    views: 14100,
    likes: 512,
    publishedAt: "2026-06-08",
    content: `# Protein 101: How Much and When It Actually Matters

Protein is the single most important macronutrient for body composition. Let's cut through the marketing and look at the science.

## How Much Do You Actually Need?

| Goal | Protein (g/kg bodyweight) |
|------|--------------------------|
| Sedentary maintenance | 0.8–1.0 |
| Active / training | 1.4–1.8 |
| Muscle building | 1.6–2.2 |
| Cutting / fat loss | 1.8–2.4 |

**Practical example:** An 80kg lifter cutting fat should target **144–192g of protein per day**.

## When It Matters: The Timing Question

The "anabolic window" is 10x wider than the supplement industry claims. What actually matters:

- **Total daily intake** — this is 90% of the story
- **4–5 meals of 25–40g** — spreads absorption and satiety
- **One dose within 2–3 hours post-training** — nice to have, not mandatory

## The Best Sources

| Source | Protein per 100g | Quality |
|--------|-----------------|---------|
| Chicken breast | 31g | Excellent |
| Greek yogurt | 10g | Excellent |
| Eggs | 13g | Excellent |
| Salmon | 25g | Great + omega-3 |
| Lentils | 9g | Great + fiber |
| Whey isolate | 85g | Excellent (supplement) |

## Protein Powders: Do You Need Them?

**No.** Real food covers 95% of cases. Supplements exist for convenience, not necessity. If you struggle to eat 150g+ from food, a scoop of whey is a great tool — not a magic bullet.

## The Bottom Line

Hit your daily number first. Split it across meals. Vary your sources. Everything else is noise.`,
  },
];

export function getPosts(): BlogPostData[] {
  return POSTS;
}

export function getPost(slug: string): BlogPostData | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getFeaturedPosts(): BlogPostData[] {
  return POSTS.filter((p) => p.featured);
}

export function searchPosts(query: string, category: string): BlogPostData[] {
  const q = query.toLowerCase().trim();
  return POSTS.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });
}
