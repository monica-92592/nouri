/**
 * Emoji skin-tone helpers (Unicode Fitzpatrick modifiers).
 * Default is medium (🏽) — not the light/pale tone.
 */

export type SkinToneId =
  | "light"
  | "mediumLight"
  | "medium"
  | "mediumDark"
  | "dark";

/** Inclusive default — medium brown, not light/pale. */
export const DEFAULT_SKIN_TONE: SkinToneId = "medium";

export const SKIN_TONES: {
  id: SkinToneId;
  modifier: string;
  label: string;
  swatch: string;
  preview: string; // 🙌 with this tone for picker
}[] = [
  { id: "light", modifier: "🏻", label: "Light", swatch: "#F0D5B8", preview: "🙌🏻" },
  { id: "mediumLight", modifier: "🏼", label: "Medium light", swatch: "#E0B089", preview: "🙌🏼" },
  { id: "medium", modifier: "🏽", label: "Medium", swatch: "#C68642", preview: "🙌🏽" },
  { id: "mediumDark", modifier: "🏾", label: "Medium dark", swatch: "#8D5524", preview: "🙌🏾" },
  { id: "dark", modifier: "🏿", label: "Dark", swatch: "#5C3310", preview: "🙌🏿" },
];

const SKIN_TONE_RE = /\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF}/gu;

/** Base glyphs that accept a Fitzpatrick skin-tone modifier. */
const TONEABLE_BASES = new Set([
  "💪",
  "🙏",
  "🤝",
  "✍️",
  "✍",
  "🧘",
  "🚶",
  "🙌",
  "👏",
  "👋",
  "👍",
  "👎",
  "👊",
  "✊",
  "✋",
  "👌",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "👇",
  "🫵",
  "🤚",
  "🖐️",
  "🖖",
  "💅",
  "🤳",
  "👂",
  "👃",
  "👶",
  "👧",
  "🧒",
  "👦",
  "👩",
  "🧑",
  "👨",
  "👵",
  "🧓",
  "👴",
]);

function stripToneAndVs(emoji: string): string {
  return emoji.replace(SKIN_TONE_RE, "").replace(/\uFE0F/g, "");
}

function isToneable(emoji: string): boolean {
  const base = stripToneAndVs(emoji);
  if (TONEABLE_BASES.has(base)) return true;
  // Also match if the first grapheme (approx) is toneable when emoji has ZWJ bits
  for (const t of TONEABLE_BASES) {
    if (base.startsWith(stripToneAndVs(t))) return true;
  }
  return false;
}

export function getSkinToneModifier(id: SkinToneId): string {
  return SKIN_TONES.find((t) => t.id === id)?.modifier ?? SKIN_TONES.find((t) => t.id === DEFAULT_SKIN_TONE)!.modifier;
}

/**
 * Apply the selected skin tone to an emoji when supported; otherwise return as-is.
 */
export function withSkinTone(emoji: string, toneId: SkinToneId = DEFAULT_SKIN_TONE): string {
  if (!emoji) return emoji;
  const modifier = getSkinToneModifier(toneId);
  const stripped = stripToneAndVs(emoji);
  if (!isToneable(emoji) && !isToneable(stripped)) return emoji;

  // Prefer the stripped base + modifier. Re-add VS16 for symbols that commonly need it when untoned only.
  // With a skin tone, VS16 is omitted (Unicode: emoji + tone).
  return `${stripped}${modifier}`;
}

export function isSkinToneId(v: unknown): v is SkinToneId {
  return typeof v === "string" && SKIN_TONES.some((t) => t.id === v);
}
