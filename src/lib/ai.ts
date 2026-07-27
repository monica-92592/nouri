import { config, DEMO_MODE } from "./config";
import type { Meal, MealItem } from "./types";

export type AnalyzeOptions = {
  hint?: string;
  /** Bias portion estimates toward typical restaurant servings. */
  isRestaurant?: boolean;
  venueName?: string;
};

/**
 * Analyzes a meal photo. When a backend is configured it POSTs the image to
 * our server, which calls OpenAI Vision (gpt-4o) with a strict JSON schema.
 * Otherwise it returns a realistic demo estimate so the flow always works.
 */
export async function analyzeMealPhoto(
  base64: string,
  options: AnalyzeOptions = {}
): Promise<Meal> {
  const { hint, isRestaurant, venueName } = options;
  const contextHint = buildContextHint({ hint, isRestaurant, venueName });

  if (DEMO_MODE) {
    return demoAnalysis({ isRestaurant, venueName });
  }

  try {
    const res = await fetch(`${config.apiBaseUrl}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64,
        hint: contextHint,
        isRestaurant: !!isRestaurant,
        venueName: venueName?.trim() || undefined,
      }),
    });
    if (!res.ok) throw new Error(`Analyze failed: ${res.status}`);
    const data = await res.json();
    return normalizeMeal(data, { isRestaurant, venueName });
  } catch (err) {
    console.warn("[ai] falling back to demo analysis:", err);
    return demoAnalysis({ isRestaurant, venueName });
  }
}

function buildContextHint(opts: AnalyzeOptions): string | undefined {
  const parts: string[] = [];
  if (opts.isRestaurant) {
    parts.push(
      "This meal was eaten at a restaurant. Use restaurant portion sizes (typically 20–40% larger than home cooking). Include oil, sauces, and sides that are often undercounted."
    );
    if (opts.venueName?.trim()) {
      parts.push(`Restaurant / venue name: ${opts.venueName.trim()}.`);
    }
  }
  if (opts.hint?.trim()) parts.push(opts.hint.trim());
  return parts.length ? parts.join(" ") : undefined;
}

function normalizeMeal(
  data: any,
  meta: { isRestaurant?: boolean; venueName?: string } = {}
): Meal {
  const items: MealItem[] = (data.items ?? []).map((it: any) => ({
    name: String(it.name ?? "Item"),
    quantity: String(it.quantity ?? ""),
    calories: Math.round(Number(it.calories ?? 0)),
    protein: Math.round(Number(it.protein ?? 0)),
    carbs: Math.round(Number(it.carbs ?? 0)),
    fat: Math.round(Number(it.fat ?? 0)),
  }));
  const sum = (k: keyof MealItem) =>
    items.reduce((a, it) => a + (Number(it[k]) || 0), 0);
  const venue = meta.venueName?.trim();
  return {
    id: cryptoId(),
    createdAt: new Date().toISOString(),
    title: String(data.title ?? "Meal"),
    items,
    calories: Math.round(Number(data.calories ?? sum("calories"))),
    protein: Math.round(Number(data.protein ?? sum("protein"))),
    carbs: Math.round(Number(data.carbs ?? sum("carbs"))),
    fat: Math.round(Number(data.fat ?? sum("fat"))),
    healthScore: clamp(Math.round(Number(data.healthScore ?? 70)), 0, 100),
    note: data.note ? String(data.note) : undefined,
    confidence: ["low", "medium", "high"].includes(data.confidence)
      ? data.confidence
      : "medium",
    source: meta.isRestaurant ? "restaurant" : "home",
    venueName: venue || undefined,
  };
}

const DEMO_MEALS: Omit<Meal, "id" | "createdAt" | "source" | "venueName">[] = [
  {
    title: "Grilled chicken & greens bowl",
    items: [
      { name: "Grilled chicken breast", quantity: "150 g", calories: 248, protein: 46, carbs: 0, fat: 6 },
      { name: "Mixed greens & veg", quantity: "2 cups", calories: 70, protein: 4, carbs: 12, fat: 1 },
      { name: "Quinoa", quantity: "1/2 cup", calories: 111, protein: 4, carbs: 20, fat: 2 },
      { name: "Olive oil dressing", quantity: "1 tbsp", calories: 90, protein: 0, carbs: 0, fat: 10 },
    ],
    calories: 519, protein: 54, carbs: 32, fat: 19, healthScore: 88,
    note: "Excellent protein-to-calorie ratio and plenty of fiber.",
    confidence: "high",
  },
  {
    title: "Avocado toast & egg",
    items: [
      { name: "Sourdough toast", quantity: "2 slices", calories: 200, protein: 8, carbs: 38, fat: 2 },
      { name: "Avocado", quantity: "1/2", calories: 120, protein: 1, carbs: 6, fat: 11 },
      { name: "Fried egg", quantity: "1", calories: 90, protein: 6, carbs: 0, fat: 7 },
    ],
    calories: 410, protein: 15, carbs: 44, fat: 20, healthScore: 74,
    note: "Balanced, but watch total fat if aiming for a deficit.",
    confidence: "medium",
  },
  {
    title: "Pasta with tomato & parmesan",
    items: [
      { name: "Spaghetti", quantity: "2 cups cooked", calories: 400, protein: 14, carbs: 78, fat: 4 },
      { name: "Tomato sauce", quantity: "3/4 cup", calories: 90, protein: 3, carbs: 14, fat: 3 },
      { name: "Parmesan", quantity: "2 tbsp", calories: 43, protein: 4, carbs: 0, fat: 3 },
    ],
    calories: 533, protein: 21, carbs: 92, fat: 10, healthScore: 58,
    note: "Carb-heavy — add a side of protein or veg for balance.",
    confidence: "medium",
  },
  {
    title: "Berry Greek yogurt bowl",
    items: [
      { name: "Greek yogurt", quantity: "1 cup", calories: 130, protein: 22, carbs: 8, fat: 0 },
      { name: "Mixed berries", quantity: "1 cup", calories: 70, protein: 1, carbs: 17, fat: 0 },
      { name: "Granola", quantity: "1/4 cup", calories: 120, protein: 3, carbs: 18, fat: 4 },
      { name: "Honey", quantity: "1 tsp", calories: 21, protein: 0, carbs: 6, fat: 0 },
    ],
    calories: 341, protein: 26, carbs: 49, fat: 4, healthScore: 82,
    note: "Great high-protein breakfast. Berries add antioxidants.",
    confidence: "high",
  },
];

async function demoAnalysis(meta: {
  isRestaurant?: boolean;
  venueName?: string;
} = {}): Promise<Meal> {
  await new Promise((r) => setTimeout(r, 1400));
  const base = DEMO_MEALS[Math.floor(Math.random() * DEMO_MEALS.length)];
  const venue = meta.venueName?.trim();

  if (!meta.isRestaurant) {
    return {
      ...base,
      id: cryptoId(),
      createdAt: new Date().toISOString(),
      source: "home",
    };
  }

  // Restaurant prior: bump portions ~30% for a realistic demo difference.
  const scale = 1.3;
  const items = base.items.map((it) => ({
    ...it,
    calories: Math.round(it.calories * scale),
    protein: Math.round(it.protein * scale),
    carbs: Math.round(it.carbs * scale),
    fat: Math.round(it.fat * scale),
  }));
  const where = venue ? ` at ${venue}` : "";
  return {
    ...base,
    id: cryptoId(),
    createdAt: new Date().toISOString(),
    title: base.title,
    items,
    calories: Math.round(base.calories * scale),
    protein: Math.round(base.protein * scale),
    carbs: Math.round(base.carbs * scale),
    fat: Math.round(base.fat * scale),
    note: `Restaurant portions${where} often run larger — estimate adjusted upward. ${base.note ?? ""}`.trim(),
    confidence: "medium",
    source: "restaurant",
    venueName: venue || undefined,
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function cryptoId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}
