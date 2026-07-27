/**
 * Nouri design system.
 *
 * Visual direction: calm botanical wellness. A deep forest-green "ink" anchors
 * the brand, paired with a warm apricot accent for energy/CTAs and soft
 * green-tinted neutrals. Expressive Fraunces serif for display, DM Sans for UI.
 */

export const colors = {
  // Brand / ink
  ink: "#0E3B34", // deep forest — primary brand color
  inkSoft: "#14524A",
  forest: "#1E6B5E",

  // Accents
  apricot: "#F4A259", // warm energy — CTAs, calorie progress
  apricotDeep: "#E5843B",
  sage: "#7FBFA3", // fresh / positive
  sageSoft: "#B7DCC9",
  berry: "#C86B7B", // affirmations accent

  // Surfaces
  bg: "#F2F6F1", // green-tinted mist (not cream)
  surface: "#FFFFFF",
  surfaceMuted: "#EAF1EA",
  overlay: "rgba(14,59,52,0.55)",

  // Text
  text: "#12231F",
  textMuted: "#5B6B65",
  textFaint: "#8CA097",
  onDark: "#F4FBF7",
  onDarkMuted: "rgba(244,251,247,0.72)",

  // Utility
  line: "rgba(18,35,31,0.08)",
  lineStrong: "rgba(18,35,31,0.14)",
  success: "#3F9E7A",
  warning: "#E5843B",
  danger: "#D25C5C",

  // Macros
  protein: "#5C8CD6",
  carbs: "#F4A259",
  fat: "#C86B7B",
} as const;

export const gradients = {
  brand: ["#0E3B34", "#14524A", "#1E6B5E"] as const,
  brandWarm: ["#0E3B34", "#1E6B5E", "#2E7D68"] as const,
  apricot: ["#F4A259", "#E5843B"] as const,
  dawn: ["#1E6B5E", "#3E9E7F", "#7FBFA3"] as const,
  affirm: ["#14524A", "#3B6E63", "#C86B7B"] as const,
  mist: ["#F2F6F1", "#EAF1EA"] as const,
};

export const font = {
  display: "Fraunces_600SemiBold",
  displayBold: "Fraunces_700Bold",
  displayItalic: "Fraunces_500Medium_Italic",
  body: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semibold: "DMSans_600SemiBold",
  bold: "DMSans_700Bold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  x2: 32,
  x3: 48,
  x4: 64,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: "#0E3B34",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  soft: {
    shadowColor: "#0E3B34",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  lift: {
    shadowColor: "#0E3B34",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;

export const type = {
  hero: { fontFamily: font.displayBold, fontSize: 40, lineHeight: 44 },
  h1: { fontFamily: font.display, fontSize: 30, lineHeight: 36 },
  h2: { fontFamily: font.display, fontSize: 23, lineHeight: 29 },
  h3: { fontFamily: font.semibold, fontSize: 18, lineHeight: 24 },
  title: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: font.body, fontSize: 15, lineHeight: 23 },
  bodyMed: { fontFamily: font.medium, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: font.body, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: font.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.6 },
  tiny: { fontFamily: font.medium, fontSize: 11, lineHeight: 15 },
} as const;
