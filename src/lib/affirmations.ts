/**
 * Affirmations in Nouri.
 *
 * Daily Glow is part of the basic (free) package — a rotating daily line drawn
 * from this library. Premium unlocks themed packs about your relationship with
 * food (trust, guilt, fullness, all-or-nothing thinking).
 */
export type AffirmationPack = {
  id: string;
  title: string;
  subtitle: string;
  premium: boolean;
  items: string[];
};

/** Basic package — included for every user. */
export const BASIC_AFFIRMATIONS: string[] = [
  "There is no one better to be than myself.",
  "I am enough.",
  "I get better every single day.",
  "I am an amazing person.",
  "All of my problems have solutions.",
  "Today, I am a leader.",
  "I forgive myself for my mistakes.",
  "My challenges help me grow.",
  "I am perfect just the way I am.",
  "My mistakes help me learn and grow.",
  "Today is going to be a great day.",
  "I have courage and confidence.",
  "I can control my own happiness.",
  "I have people who love and respect me.",
  "I stand up for what I believe in.",
  "I believe in my goals and dreams.",
  "It's okay not to know everything.",
  "Today, I choose to think positive.",
  "I can get through anything.",
  "I can do anything I put my mind to.",
  "I give myself permission to make choices.",
  "I can do better next time.",
  "I have everything I need right now.",
  "I am capable of so much.",
  "Everything will be okay.",
  "I believe in myself.",
  "I am proud of myself.",
  "I deserve to be happy.",
  "I am free to make my own choices.",
  "I deserve to be loved.",
  "I can make a difference.",
  "Today, I choose to be confident.",
  "I am in charge of my life.",
  "I have the power to make my dreams true.",
  "I believe in myself and my abilities.",
  "Good things are going to come to me.",
  "I matter.",
  "My confidence grows when I step outside of my comfort zone.",
  "My positive thoughts create positive feelings.",
  "Today, I will walk through my fears.",
  "I am open and ready to learn.",
  "Every day is a fresh start.",
  "If I fall, I will get back up again.",
  "I am whole.",
  "I only compare myself to myself.",
  "I can do anything.",
  "It is enough to do my best.",
  "I can be anything I want to be.",
  "I accept who I am.",
  "Today is going to be an awesome day.",
];

export const packs: AffirmationPack[] = [
  {
    id: "daily",
    title: "Daily Glow",
    subtitle: "Basic package · one affirmation each day",
    premium: false,
    items: BASIC_AFFIRMATIONS,
  },
  {
    id: "relationship",
    title: "Relationship with Food",
    subtitle: "Trust, guilt, hunger & fullness",
    premium: true,
    items: [
      "My worth is not measured by what I eat today.",
      "I can enjoy food without earning it.",
      "I listen to hunger and fullness with respect.",
      "One meal does not define my progress.",
      "I release guilt and choose the next kind choice.",
      "I am allowed to eat when I am hungry.",
      "Food is nourishment and pleasure — both can be true.",
      "I trust myself around food a little more each day.",
      "I do not need to be perfect to take care of myself.",
      "I am rebuilding a peaceful relationship with food.",
    ],
  },
  {
    id: "body-trust",
    title: "Body Trust",
    subtitle: "Kindness toward the body you live in",
    premium: true,
    items: [
      "I treat my body as a partner, not an enemy.",
      "I honor what my body needs today.",
      "Rest and fuel are part of strength.",
      "I speak to myself the way I would speak to a friend.",
      "My body deserves care, not criticism.",
    ],
  },
  {
    id: "steady-path",
    title: "Steady Path",
    subtitle: "Consistency without all-or-nothing thinking",
    premium: true,
    items: [
      "I am not starting over — I am continuing.",
      "Small, steady choices add up.",
      "I can begin again at the next meal.",
      "Progress includes imperfect days.",
      "I keep promises to myself with compassion.",
    ],
  },
];

/** Deterministic daily affirmation from the basic package (stable for the calendar day). */
export function affirmationOfTheDay(): string {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return BASIC_AFFIRMATIONS[dayIndex % BASIC_AFFIRMATIONS.length];
}

export function dayStreakLine(streak: number) {
  if (streak <= 0) return "Begin your streak today.";
  if (streak === 1) return "Day one. A beautiful start.";
  if (streak < 7) return `${streak} days of showing up.`;
  if (streak < 30) return `${streak} days strong — a real habit forming.`;
  return `${streak} days. This is who you are now.`;
}
