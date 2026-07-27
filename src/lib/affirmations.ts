/**
 * Affirmations in Nouri — all packs are free / basic.
 * Today's affirmation is drawn from the full library (stable per calendar day).
 */
export type AffirmationPack = {
  id: string;
  title: string;
  subtitle: string;
  /** @deprecated All packs are free; kept for type compatibility. */
  premium: boolean;
  items: string[];
};

/** Everyday calm — included for every user. */
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
    title: "Everyday Calm",
    subtitle: "Gentle grounding for any moment",
    premium: false,
    items: BASIC_AFFIRMATIONS,
  },
  {
    id: "relationship",
    title: "Relationship with Food",
    subtitle: "Trust, guilt, hunger & fullness",
    premium: false,
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
    premium: false,
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
    premium: false,
    items: [
      "I am not starting over — I am continuing.",
      "Small, steady choices add up.",
      "I can begin again at the next meal.",
      "Progress includes imperfect days.",
      "I keep promises to myself with compassion.",
    ],
  },
];

/** Flat list of every affirmation across all packs (deduped). */
export function allAffirmations(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const pack of packs) {
    for (const item of pack.items) {
      if (!seen.has(item)) {
        seen.add(item);
        out.push(item);
      }
    }
  }
  return out;
}

export type DailyAffirmation = {
  text: string;
  packTitle: string;
  packId: string;
};

function daySeed(): number {
  return Math.floor(Date.now() / 86400000);
}

/** Deterministic daily affirmation from the full free library. */
export function affirmationOfTheDay(): string {
  const all = allAffirmations();
  return all[daySeed() % all.length];
}

/** Daily affirmation with pack context for home / Glow. */
export function dailyAffirmationDetail(): DailyAffirmation {
  const seed = daySeed();
  const all = allAffirmations();
  const text = all[seed % all.length];
  const pack = packs.find((p) => p.items.includes(text)) ?? packs[0];
  return { text, packTitle: pack.title, packId: pack.id };
}

/** A few extra free picks for the day (excluding today's main line). */
export function affirmationsOfTheDayExtras(count = 2): DailyAffirmation[] {
  const seed = daySeed();
  const all = allAffirmations();
  const mainIdx = seed % all.length;
  const extras: DailyAffirmation[] = [];
  for (let i = 1; i <= count && i < all.length; i++) {
    const text = all[(mainIdx + i * 7) % all.length];
    if (extras.some((e) => e.text === text) || text === all[mainIdx]) continue;
    const pack = packs.find((p) => p.items.includes(text)) ?? packs[0];
    extras.push({ text, packTitle: pack.title, packId: pack.id });
  }
  return extras;
}

export function dayStreakLine(streak: number) {
  if (streak <= 0) return "Begin your streak today.";
  if (streak === 1) return "Day one. A beautiful start.";
  if (streak < 7) return `${streak} days of showing up.`;
  if (streak < 30) return `${streak} days strong — a real habit forming.`;
  return `${streak} days. This is who you are now.`;
}
