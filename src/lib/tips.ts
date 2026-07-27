import type { Profile, Targets } from "./types";

export type Tip = {
  id: string;
  icon: string; // emoji glyph used inside a rounded token
  title: string;
  body: string;
  tag: string;
  premium?: boolean;
};

/**
 * Generates coaching tips tailored to age, habits, and goals. This runs fully
 * on-device (rules-based) so free users always get value; premium users get
 * deeper, AI-personalized guidance from the backend when configured.
 */
export function buildTips(p: Profile, t: Targets): Tip[] {
  const tips: Tip[] = [];

  // Goal-driven
  if (p.goal === "lose") {
    tips.push({
      id: "protein",
      icon: "🥚",
      title: "Anchor meals with protein",
      body: `Aim for ~${t.protein}g protein daily. Protein keeps you full and protects muscle while you lose fat.`,
      tag: "Goal",
    });
    tips.push({
      id: "volume",
      icon: "🥗",
      title: "Add volume, not just calories",
      body: "Fill half your plate with non-starchy vegetables to feel satisfied on fewer calories.",
      tag: "Satiety",
    });
  } else if (p.goal === "gain") {
    tips.push({
      id: "surplus",
      icon: "🍠",
      title: "Eat in a gentle surplus",
      body: `Target ${t.calories} kcal with calorie-dense whole foods like nuts, oats, and olive oil.`,
      tag: "Goal",
    });
  } else {
    tips.push({
      id: "consistency",
      icon: "⚖️",
      title: "Consistency over perfection",
      body: `Staying near ${t.calories} kcal most days keeps your weight steady without stress.`,
      tag: "Goal",
    });
  }

  // Age-driven
  if (p.age >= 45) {
    tips.push({
      id: "muscle",
      icon: "💪",
      title: "Protect muscle as you age",
      body: "After 40, prioritize protein and 2–3 strength sessions weekly to keep metabolism high.",
      tag: "Age",
    });
  } else if (p.age <= 25) {
    tips.push({
      id: "foundation",
      icon: "🌱",
      title: "Build habits that last",
      body: "The routines you set now compound for decades. Focus on sleep, water, and whole foods.",
      tag: "Age",
    });
  }

  // Habit-driven
  if (p.habits.includes("late_snacker")) {
    tips.push({
      id: "night",
      icon: "🌙",
      title: "Tame late-night snacking",
      body: "Save ~200 kcal for an evening snack, and keep protein + fiber options within reach.",
      tag: "Habit",
    });
  }
  if (p.habits.includes("coffee_lover")) {
    tips.push({
      id: "coffee",
      icon: "☕️",
      title: "Watch liquid calories",
      body: "Flavored coffees can hide 300+ kcal. Snap them too — Nouri counts drinks as meals.",
      tag: "Habit",
    });
  }
  if (p.habits.includes("eats_out")) {
    tips.push({
      id: "dining",
      icon: "🍽️",
      title: "Dining out, on your terms",
      body: "Photograph restaurant meals before eating — portions there run 20–40% larger than home.",
      tag: "Habit",
    });
  }
  if (p.habits.includes("busy")) {
    tips.push({
      id: "prep",
      icon: "🧺",
      title: "Prep two, not seven",
      body: "Batch just two go-to meals. Fewer decisions means fewer off-plan days.",
      tag: "Habit",
    });
  }
  if (p.habits.includes("sweet_tooth")) {
    tips.push({
      id: "sweet",
      icon: "🍫",
      title: "Plan the treat in",
      body: "A planned dessert beats an unplanned binge. Log it and enjoy it fully — no guilt.",
      tag: "Habit",
    });
  }

  // Hydration always
  tips.push({
    id: "hydrate",
    icon: "💧",
    title: "Hydrate first",
    body: "Thirst often masquerades as hunger. A glass of water before meals aids portion control.",
    tag: "Wellness",
  });

  // Premium teasers
  tips.push({
    id: "ai-week",
    icon: "✨",
    title: "Your week, decoded",
    body: "Premium turns your logged meals into a weekly pattern report with 3 specific fixes.",
    tag: "Premium",
    premium: true,
  });

  return tips;
}
