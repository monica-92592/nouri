import type { ActivityLevel, Pace, Profile, Targets } from "./types";

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

// Daily calorie adjustment applied toward the goal.
const PACE_DELTA: Record<Pace, number> = {
  gentle: 250,
  steady: 500,
  focused: 750,
};

/**
 * Mifflin-St Jeor BMR + activity multiplier for TDEE, then apply a goal-based
 * calorie delta. Floors keep intake in a safe, realistic range.
 */
export function computeTargets(p: Profile): Targets {
  const s = p.sex === "male" ? 5 : p.sex === "female" ? -161 : -78;
  const bmr = Math.round(10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + s);
  const tdee = Math.round(bmr * ACTIVITY_FACTOR[p.activity]);

  let calories = tdee;
  const delta = PACE_DELTA[p.pace];
  if (p.goal === "lose") calories = tdee - delta;
  if (p.goal === "gain") calories = tdee + delta;

  // Safety floor: never recommend below ~1200 (F) / ~1500 (M).
  const floor = p.sex === "male" ? 1500 : 1200;
  calories = Math.max(calories, floor);

  // Protein: 1.6 g/kg for active goals, high-protein bias when losing.
  const proteinPerKg = p.goal === "lose" ? 1.8 : 1.6;
  const protein = Math.round(p.weightKg * proteinPerKg);
  // Fat: ~27% of calories.
  const fat = Math.round((calories * 0.27) / 9);
  // Carbs: remainder.
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { bmr, tdee, calories, protein, carbs, fat };
}

/** Weeks to reach target weight given the chosen pace (approx, 7700 kcal/kg). */
export function estimateWeeksToGoal(p: Profile): number | null {
  if (p.goal === "maintain") return null;
  const diffKg = Math.abs(p.weightKg - p.targetWeightKg);
  if (diffKg < 0.5) return null;
  const dailyDelta = PACE_DELTA[p.pace];
  const kgPerWeek = (dailyDelta * 7) / 7700;
  if (kgPerWeek <= 0) return null;
  return Math.max(1, Math.round(diffKg / kgPerWeek));
}

export function macroCalories(protein: number, carbs: number, fat: number) {
  return protein * 4 + carbs * 4 + fat * 9;
}

export function clampPct(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, value / total));
}
