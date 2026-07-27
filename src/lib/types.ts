export type Sex = "female" | "male" | "other";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "athlete";

export type GoalType = "lose" | "maintain" | "gain";

export type Pace = "gentle" | "steady" | "focused";

export type UnitSystem = "metric" | "imperial";

export type Profile = {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activity: ActivityLevel;
  goal: GoalType;
  pace: Pace;
  habits: string[]; // e.g. ["late_snacker", "coffee_lover", "eats_out"]
  units: UnitSystem;
  createdAt: string;
};

export type Macros = {
  calories: number;
  protein: number; // grams
  carbs: number;
  fat: number;
};

export type MealItem = {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Meal = {
  id: string;
  createdAt: string; // ISO
  title: string;
  photoUri?: string;
  items: MealItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number; // 0-100
  note?: string;
  confidence: "low" | "medium" | "high";
};

export type Targets = Macros & {
  bmr: number;
  tdee: number;
};

export type SubscriptionPlan = "monthly" | "yearly";

export type Subscription = {
  active: boolean;
  plan?: SubscriptionPlan;
  since?: string;
  renewsOn?: string;
  demo?: boolean;
};

export type JournalEntry = {
  id: string;
  createdAt: string;
  promptId: string;
  title: string;
  body: string;
  answers?: string[]; // optional per-prompt answers
};

export type MeditationLogEntry = {
  id: string;
  sessionId: string;
  title: string;
  completedAt: string;
  durationSec: number;
};
