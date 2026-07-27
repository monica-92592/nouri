import type { GoalType } from "./types";

/**
 * A curated affirmation library. Free users get a rotating daily affirmation;
 * premium unlocks themed packs and the full archive.
 */
export type AffirmationPack = {
  id: string;
  title: string;
  subtitle: string;
  premium: boolean;
  items: string[];
};

export const packs: AffirmationPack[] = [
  {
    id: "daily",
    title: "Everyday Calm",
    subtitle: "Gentle grounding for any moment",
    premium: false,
    items: [
      "I nourish my body with kindness, one choice at a time.",
      "Progress is built from small, steady steps.",
      "I am allowed to enjoy food and honor my goals.",
      "My worth is not measured by a number.",
      "I listen to my hunger and my fullness with respect.",
      "Today I choose foods that help me feel alive.",
      "I release guilt and welcome balance.",
    ],
  },
  {
    id: "mindful-eating",
    title: "Mindful Eating",
    subtitle: "Slow down and savor",
    premium: true,
    items: [
      "I eat slowly and taste every bite fully.",
      "Each meal is a chance to care for myself.",
      "I pause, I breathe, and then I nourish.",
      "Fullness is a signal I trust and honor.",
      "I bring calm attention to my plate.",
    ],
  },
  {
    id: "confidence",
    title: "Quiet Confidence",
    subtitle: "Strength from within",
    premium: true,
    items: [
      "I am becoming healthier and stronger every day.",
      "I trust myself to make choices that serve me.",
      "My consistency is quietly transforming me.",
      "I show up for myself, especially on hard days.",
      "I am proud of how far I have come.",
    ],
  },
  {
    id: "motivation",
    title: "Steady Motivation",
    subtitle: "Keep the momentum",
    premium: true,
    items: [
      "Discipline is a form of self-respect.",
      "I keep my promises to myself.",
      "Every good choice compounds into change.",
      "I am not restarting — I am continuing.",
      "The effort I give today is a gift to tomorrow's me.",
    ],
  },
];

const goalLine: Record<GoalType, string> = {
  lose: "Lighter, calmer, stronger — I am on my way.",
  maintain: "I honor my balance and protect my peace.",
  gain: "I am building myself up with intention.",
};

/** Deterministic daily affirmation so it stays stable across a day. */
export function affirmationOfTheDay(goal: GoalType = "maintain"): string {
  const pool = [...packs[0].items, goalLine[goal]];
  const dayIndex = Math.floor(Date.now() / 86400000);
  return pool[dayIndex % pool.length];
}

export function dayStreakLine(streak: number) {
  if (streak <= 0) return "Begin your streak today.";
  if (streak === 1) return "Day one. A beautiful start.";
  if (streak < 7) return `${streak} days of showing up.`;
  if (streak < 30) return `${streak} days strong — a real habit forming.`;
  return `${streak} days. This is who you are now.`;
}
