/**
 * Nouri design system.
 *
 * Soft blue + fresh green on clean white / light gray.
 * Accents & alerts: deep charcoal + warm orange.
 * Expressive Fraunces for display, DM Sans for UI.
 */

export const colors = {
  // Brand / ink (deep charcoal)
  ink: "#2A3238",
  inkSoft: "#3D4750",
  forest: "#3C9B72", // fresh green for links / positive UI

  // Accents
  apricot: "#F08A3C", // warm orange — CTAs, progress, alerts
  apricotDeep: "#E07528",
  sage: "#5FCB8F", // fresh green highlight
  sageSoft: "#C5EFD8",
  berry: "#6BA3D6", // soft blue accent

  // Surfaces
  bg: "#F5F7F9", // clean light gray
  surface: "#FFFFFF",
  surfaceMuted: "#EEF2F5",
  overlay: "rgba(42,50,56,0.55)",

  // Text
  text: "#1C242B",
  textMuted: "#5C6770",
  textFaint: "#8B959E",
  onDark: "#F8FAFB",
  onDarkMuted: "rgba(248,250,251,0.72)",

  // Utility
  line: "rgba(42,50,56,0.08)",
  lineStrong: "rgba(42,50,56,0.14)",
  success: "#3C9B72",
  warning: "#F08A3C",
  danger: "#D25C5C",

  // Macros
  protein: "#6BA3D6", // soft blue
  carbs: "#F08A3C", // warm orange
  fat: "#7A8B98", // charcoal-soft
} as const;

export const gradients = {
  brand: ["#2A3238", "#3A5F7A", "#3C9B72"] as const, // charcoal → soft blue → fresh green
  brandWarm: ["#3A5F7A", "#4A8FA0", "#3C9B72"] as const,
  apricot: ["#F08A3C", "#E07528"] as const,
  dawn: ["#6BA3D6", "#5FCB8F", "#A8E0C0"] as const,
  affirm: ["#3A5F7A", "#3C9B72", "#6BA3D6"] as const,
  mist: ["#F5F7F9", "#EEF2F5"] as const,
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
    shadowColor: "#2A3238",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  soft: {
    shadowColor: "#2A3238",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  lift: {
    shadowColor: "#2A3238",
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
