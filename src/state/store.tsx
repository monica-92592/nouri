import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { computeTargets } from "../lib/nutrition";
import type {
  JournalEntry,
  Meal,
  MeditationLogEntry,
  Profile,
  Subscription,
  SubscriptionPlan,
  Targets,
} from "../lib/types";
import { renewalDate } from "../lib/billing";
import { cryptoId } from "../lib/ai";

const STORAGE_KEY = "nouri.state.v1";

/** Free tier allows a limited number of AI scans per day. */
export const FREE_DAILY_SCANS = 2;

type PersistShape = {
  profile: Profile | null;
  meals: Meal[];
  subscription: Subscription;
  onboarded: boolean;
  scanLog: string[]; // ISO timestamps of AI scans (for daily limit)
  journalEntries: JournalEntry[];
  meditationLog: MeditationLogEntry[];
};

type StoreValue = PersistShape & {
  hydrated: boolean;
  targets: Targets | null;
  isPremium: boolean;
  todaysMeals: Meal[];
  consumedToday: { calories: number; protein: number; carbs: number; fat: number };
  scansUsedToday: number;
  scansRemaining: number;
  streak: number;
  setProfile: (p: Profile) => void;
  completeOnboarding: (p: Profile) => void;
  addMeal: (m: Meal) => void;
  removeMeal: (id: string) => void;
  logScan: () => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  removeJournalEntry: (id: string) => void;
  logMeditation: (sessionId: string, title: string, durationSec: number) => void;
  activateSubscription: (plan: SubscriptionPlan, demo?: boolean) => void;
  cancelSubscription: () => void;
  resetAll: () => void;
};

const defaultState: PersistShape = {
  profile: null,
  meals: [],
  subscription: { active: false },
  onboarded: false,
  scanLog: [],
  journalEntries: [],
  meditationLog: [],
};

const StoreContext = createContext<StoreValue | null>(null);

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

function computeStreak(meals: Meal[]): number {
  if (meals.length === 0) return 0;
  const days = new Set(
    meals.map((m) => new Date(m.createdAt).toDateString())
  );
  let streak = 0;
  const cursor = new Date();
  // Allow "today" to be empty without breaking streak.
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistShape>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistShape;
          // Migrate profiles saved before units existed.
          if (parsed.profile && !parsed.profile.units) {
            parsed.profile = { ...parsed.profile, units: "imperial" };
          }
          setState({ ...defaultState, ...parsed });
        }
      } catch (e) {
        console.warn("[store] hydrate failed", e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) =>
      console.warn("[store] persist failed", e)
    );
  }, [state, hydrated]);

  const patch = useCallback((p: Partial<PersistShape>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const setProfile = useCallback(
    (profile: Profile) => patch({ profile }),
    [patch]
  );

  const completeOnboarding = useCallback(
    (profile: Profile) => patch({ profile, onboarded: true }),
    [patch]
  );

  const addMeal = useCallback(
    (m: Meal) => setState((s) => ({ ...s, meals: [m, ...s.meals] })),
    []
  );

  const removeMeal = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, meals: s.meals.filter((m) => m.id !== id) })),
    []
  );

  const logScan = useCallback(
    () =>
      setState((s) => ({
        ...s,
        scanLog: [...s.scanLog, new Date().toISOString()],
      })),
    []
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "createdAt">) =>
      setState((s) => ({
        ...s,
        journalEntries: [
          {
            ...entry,
            id: cryptoId(),
            createdAt: new Date().toISOString(),
          },
          ...(s.journalEntries ?? []),
        ],
      })),
    []
  );

  const removeJournalEntry = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        journalEntries: (s.journalEntries ?? []).filter((e) => e.id !== id),
      })),
    []
  );

  const logMeditation = useCallback(
    (sessionId: string, title: string, durationSec: number) =>
      setState((s) => ({
        ...s,
        meditationLog: [
          {
            id: cryptoId(),
            sessionId,
            title,
            completedAt: new Date().toISOString(),
            durationSec,
          },
          ...(s.meditationLog ?? []),
        ],
      })),
    []
  );

  const activateSubscription = useCallback(
    (plan: SubscriptionPlan, demo = false) =>
      patch({
        subscription: {
          active: true,
          plan,
          since: new Date().toISOString(),
          renewsOn: renewalDate(plan),
          demo,
        },
      }),
    [patch]
  );

  const cancelSubscription = useCallback(
    () => patch({ subscription: { active: false } }),
    [patch]
  );

  const resetAll = useCallback(() => setState(defaultState), []);

  const targets = useMemo(
    () => (state.profile ? computeTargets(state.profile) : null),
    [state.profile]
  );

  const todaysMeals = useMemo(
    () => state.meals.filter((m) => isToday(m.createdAt)),
    [state.meals]
  );

  const consumedToday = useMemo(
    () =>
      todaysMeals.reduce(
        (acc, m) => ({
          calories: acc.calories + m.calories,
          protein: acc.protein + m.protein,
          carbs: acc.carbs + m.carbs,
          fat: acc.fat + m.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [todaysMeals]
  );

  const scansUsedToday = useMemo(
    () => state.scanLog.filter(isToday).length,
    [state.scanLog]
  );

  const isPremium = state.subscription.active;

  const value: StoreValue = {
    ...state,
    journalEntries: state.journalEntries ?? [],
    meditationLog: state.meditationLog ?? [],
    hydrated,
    targets,
    isPremium,
    todaysMeals,
    consumedToday,
    scansUsedToday,
    scansRemaining: isPremium
      ? Infinity
      : Math.max(0, FREE_DAILY_SCANS - scansUsedToday),
    streak: useMemo(() => computeStreak(state.meals), [state.meals]),
    setProfile,
    completeOnboarding,
    addMeal,
    removeMeal,
    logScan,
    addJournalEntry,
    removeJournalEntry,
    logMeditation,
    activateSubscription,
    cancelSubscription,
    resetAll,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
