import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/Button";
import { Chip } from "../src/components/bits";
import { computeTargets, estimateWeeksToGoal } from "../src/lib/nutrition";
import type {
  ActivityLevel,
  GoalType,
  Pace,
  Profile,
  Sex,
  UnitSystem,
} from "../src/lib/types";
import {
  cmToFeetInches,
  feetInchesToCm,
  formatWeight,
  kgToLb,
  lbToKg,
  pacePerWeekLabel,
} from "../src/lib/units";
import { useStore } from "../src/state/store";
import { colors, font, gradients, radius, type as T } from "../src/theme";

const HABITS: { id: string; label: string; emoji: string }[] = [
  { id: "late_snacker", label: "Late-night snacker", emoji: "🌙" },
  { id: "coffee_lover", label: "Coffee lover", emoji: "☕️" },
  { id: "eats_out", label: "Eats out often", emoji: "🍽️" },
  { id: "sweet_tooth", label: "Sweet tooth", emoji: "🍫" },
  { id: "busy", label: "Always busy", emoji: "⚡️" },
  { id: "home_cook", label: "Home cook", emoji: "🍳" },
];

const ACTIVITIES: { id: ActivityLevel; label: string; sub: string }[] = [
  { id: "sedentary", label: "Sedentary", sub: "Mostly sitting" },
  { id: "light", label: "Lightly active", sub: "1–2 workouts / wk" },
  { id: "moderate", label: "Moderately active", sub: "3–4 workouts / wk" },
  { id: "active", label: "Very active", sub: "5–6 workouts / wk" },
  { id: "athlete", label: "Athlete", sub: "Twice daily / physical job" },
];

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState(30);
  const [units, setUnits] = useState<UnitSystem>("imperial");
  // Stored in metric for BMR math; UI converts at the edges.
  const [heightCm, setHeightCm] = useState(168); // ~5'6"
  const [weightKg, setWeightKg] = useState(72); // ~159 lb
  const [targetWeightKg, setTargetWeightKg] = useState(64); // ~141 lb
  const [activity, setActivity] = useState<ActivityLevel>("light");
  const [goal, setGoal] = useState<GoalType>("lose");
  const [pace, setPace] = useState<Pace>("steady");
  const [habits, setHabits] = useState<string[]>(["coffee_lover"]);

  const totalSteps = 8;
  const { feet, inches } = cmToFeetInches(heightCm);
  const weightDisplay = units === "imperial" ? Math.round(kgToLb(weightKg)) : Math.round(weightKg);
  const targetDisplay =
    units === "imperial" ? Math.round(kgToLb(targetWeightKg)) : Math.round(targetWeightKg);
  const paceLabels = pacePerWeekLabel(units);

  const profile: Profile = useMemo(
    () => ({
      name: name.trim() || "friend",
      sex,
      age,
      heightCm,
      weightKg,
      targetWeightKg,
      activity,
      goal,
      pace,
      habits,
      units,
      createdAt: new Date().toISOString(),
    }),
    [name, sex, age, heightCm, weightKg, targetWeightKg, activity, goal, pace, habits, units]
  );

  const targets = useMemo(() => computeTargets(profile), [profile]);
  const weeks = useMemo(() => estimateWeeksToGoal(profile), [profile]);

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    completeOnboarding(profile);
    router.replace("/paywall");
  };

  const toggleHabit = (id: string) =>
    setHabits((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));

  // ---- Welcome (step 0): full-bleed brand hero ----
  if (step === 0) {
    return (
      <LinearGradient colors={gradients.brandWarm} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between", padding: 28 }}>
          <Animated.View entering={FadeIn.duration(700)} style={styles.brandTop}>
            <View style={styles.leaf}>
              <Text style={{ fontSize: 22 }}>🌿</Text>
            </View>
            <Text style={styles.brandMark}>Nouri</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(800).delay(150)}>
            <Text style={styles.heroKicker}>PHOTO CALORIE COACH</Text>
            <Text style={styles.hero}>
              Snap a meal.{"\n"}Know it in seconds.
            </Text>
            <Text style={styles.heroSub}>
              Accurate calories and macros from a single photo — plus tips tuned to
              your age, habits and goals, and a daily affirmation to keep you kind
              to yourself.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(800).delay(300)} style={{ gap: 12 }}>
            <Button label="Start my plan" variant="primary" onPress={next} />
            <Text style={styles.legal}>
              Personalized in under a minute. No credit card to begin.
            </Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.mist} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* Progress */}
          <View style={styles.progressRow}>
            <Pressable onPress={back} hitSlop={10} style={styles.backBtn}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(step / (totalSteps - 1)) * 100}%` }]} />
            </View>
            <Text style={styles.stepCount}>
              {step}/{totalSteps - 1}
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View key={step} entering={FadeIn.duration(350)} exiting={FadeOut.duration(120)}>
              {step === 1 && (
                <StepShell title="First, the basics" caption="So Nouri can greet you and tailor your targets.">
                  <FieldLabel text="What should we call you?" />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={colors.textFaint}
                    style={styles.input}
                    returnKeyType="done"
                  />
                  <FieldLabel text="Sex (for calorie formula)" />
                  <View style={styles.chipWrap}>
                    {(["female", "male", "other"] as Sex[]).map((s) => (
                      <Chip key={s} label={cap(s)} active={sex === s} onPress={() => setSex(s)} />
                    ))}
                  </View>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell title="Your body metrics" caption="Used to calculate your daily energy needs.">
                  <FieldLabel text="Units" />
                  <View style={styles.chipWrap}>
                    <Chip
                      label="Imperial"
                      active={units === "imperial"}
                      onPress={() => setUnits("imperial")}
                    />
                    <Chip
                      label="Metric"
                      active={units === "metric"}
                      onPress={() => setUnits("metric")}
                    />
                  </View>
                  <View style={{ height: 12 }} />
                  <Stepper label="Age" value={age} unit="yrs" min={13} max={100} onChange={setAge} />
                  {units === "imperial" ? (
                    <>
                      <View style={styles.dualRow}>
                        <View style={{ flex: 1 }}>
                          <Stepper
                            label="Height"
                            value={feet}
                            unit="ft"
                            min={4}
                            max={7}
                            onChange={(f) => setHeightCm(feetInchesToCm(f, inches))}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Stepper
                            label="Inches"
                            value={inches}
                            unit="in"
                            min={0}
                            max={11}
                            onChange={(i) => setHeightCm(feetInchesToCm(feet, i))}
                          />
                        </View>
                      </View>
                      <Stepper
                        label="Weight"
                        value={weightDisplay}
                        unit="lb"
                        min={80}
                        max={550}
                        onChange={(lb) => setWeightKg(lbToKg(lb))}
                      />
                    </>
                  ) : (
                    <>
                      <Stepper
                        label="Height"
                        value={Math.round(heightCm)}
                        unit="cm"
                        min={120}
                        max={220}
                        onChange={setHeightCm}
                      />
                      <Stepper
                        label="Weight"
                        value={weightDisplay}
                        unit="kg"
                        min={35}
                        max={250}
                        onChange={setWeightKg}
                      />
                    </>
                  )}
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="Where are you headed?" caption="Pick a goal — you can change it anytime.">
                  <View style={{ gap: 12 }}>
                    {(
                      [
                        { id: "lose", label: "Lose weight", emoji: "🍃" },
                        { id: "maintain", label: "Maintain", emoji: "⚖️" },
                        { id: "gain", label: "Build / gain", emoji: "💪" },
                      ] as { id: GoalType; label: string; emoji: string }[]
                    ).map((g) => (
                      <SelectRow
                        key={g.id}
                        title={g.label}
                        emoji={g.emoji}
                        selected={goal === g.id}
                        onPress={() => setGoal(g.id)}
                      />
                    ))}
                  </View>
                  {goal !== "maintain" && (
                    <View style={{ marginTop: 18 }}>
                      <Stepper
                        label="Target weight"
                        value={targetDisplay}
                        unit={units === "imperial" ? "lb" : "kg"}
                        min={units === "imperial" ? 80 : 35}
                        max={units === "imperial" ? 550 : 250}
                        onChange={(v) =>
                          setTargetWeightKg(units === "imperial" ? lbToKg(v) : v)
                        }
                      />
                    </View>
                  )}
                </StepShell>
              )}

              {step === 4 && (
                <StepShell title="How active are you?" caption="Be honest — this shapes your calorie budget.">
                  <View style={{ gap: 10 }}>
                    {ACTIVITIES.map((a) => (
                      <SelectRow
                        key={a.id}
                        title={a.label}
                        sub={a.sub}
                        selected={activity === a.id}
                        onPress={() => setActivity(a.id)}
                      />
                    ))}
                  </View>
                </StepShell>
              )}

              {step === 5 && (
                <StepShell title="Choose your pace" caption="Slower is more sustainable. Effortless beats extreme.">
                  <View style={{ gap: 12 }}>
                    {(
                      [
                        { id: "gentle", label: "Gentle", sub: paceLabels.gentle },
                        { id: "steady", label: "Steady", sub: paceLabels.steady },
                        { id: "focused", label: "Focused", sub: paceLabels.focused },
                      ] as { id: Pace; label: string; sub: string }[]
                    ).map((p) => (
                      <SelectRow
                        key={p.id}
                        title={p.label}
                        sub={p.sub}
                        selected={pace === p.id}
                        onPress={() => setPace(p.id)}
                      />
                    ))}
                  </View>
                </StepShell>
              )}

              {step === 6 && (
                <StepShell title="Your habits" caption="Select any that sound like you. We'll tailor your tips.">
                  <View style={[styles.chipWrap, { gap: 10 }]}>
                    {HABITS.map((h) => (
                      <Chip
                        key={h.id}
                        label={h.label}
                        emoji={h.emoji}
                        active={habits.includes(h.id)}
                        onPress={() => toggleHabit(h.id)}
                      />
                    ))}
                  </View>
                </StepShell>
              )}

              {step === 7 && (
                <StepShell title={`You're all set, ${profile.name}`} caption="Here's your personalized daily plan.">
                  <LinearGradient colors={gradients.brand} style={styles.summaryCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.summaryLabel}>DAILY CALORIE TARGET</Text>
                    <Text style={styles.summaryBig}>{targets.calories.toLocaleString()}</Text>
                    <Text style={styles.summaryUnit}>kcal / day</Text>
                    <View style={styles.summaryMacros}>
                      <SummaryMacro label="Protein" value={`${targets.protein}g`} />
                      <SummaryMacro label="Carbs" value={`${targets.carbs}g`} />
                      <SummaryMacro label="Fat" value={`${targets.fat}g`} />
                    </View>
                  </LinearGradient>
                  {weeks ? (
                    <Text style={styles.projection}>
                      At a {pace} pace, you could reach{" "}
                      {formatWeight(targetWeightKg, units)} in about{" "}
                      <Text style={{ fontFamily: font.bold, color: colors.ink }}>{weeks} weeks</Text>.
                    </Text>
                  ) : (
                    <Text style={styles.projection}>
                      We'll help you hold steady with balanced, realistic days.
                    </Text>
                  )}
                </StepShell>
              )}
            </Animated.View>
          </ScrollView>

          <View style={styles.footer}>
            {step < 7 ? (
              <Button label="Continue" onPress={next} />
            ) : (
              <Button label="See my plan & unlock Nouri" onPress={finish} />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ---------- small building blocks ---------- */

function StepShell({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepCaption}>{caption}</Text>
      <View style={{ marginTop: 24 }}>{children}</View>
    </View>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={styles.fieldLabel}>{text}</Text>;
}

function Stepper({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable style={styles.stepperBtn} onPress={() => onChange(clamp(value - 1))}>
          <Text style={styles.stepperBtnText}>–</Text>
        </Pressable>
        <View style={styles.stepperValueBox}>
          <Text style={styles.stepperValue}>{value}</Text>
          <Text style={styles.stepperUnit}>{unit}</Text>
        </View>
        <Pressable style={styles.stepperBtn} onPress={() => onChange(clamp(value + 1))}>
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SelectRow({
  title,
  sub,
  emoji,
  selected,
  onPress,
}: {
  title: string;
  sub?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.selectRow, selected && styles.selectRowActive]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
        {emoji ? <Text style={{ fontSize: 22 }}>{emoji}</Text> : null}
        <View style={{ flex: 1 }}>
          <Text style={[styles.selectTitle, selected && { color: colors.onDark }]}>{title}</Text>
          {sub ? (
            <Text style={[styles.selectSub, selected && { color: colors.onDarkMuted }]}>{sub}</Text>
          ) : null}
        </View>
      </View>
      <View style={[styles.radio, selected && styles.radioActive]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function SummaryMacro({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={styles.sMacroValue}>{value}</Text>
      <Text style={styles.sMacroLabel}>{label}</Text>
    </View>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  // welcome
  brandTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  leaf: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandMark: { fontFamily: font.displayBold, fontSize: 30, color: colors.onDark },
  heroKicker: {
    fontFamily: font.semibold,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.sageSoft,
    marginBottom: 14,
  },
  hero: { fontFamily: font.displayBold, fontSize: 44, lineHeight: 48, color: colors.onDark },
  heroSub: {
    fontFamily: font.body,
    fontSize: 16,
    lineHeight: 25,
    color: colors.onDarkMuted,
    marginTop: 16,
    maxWidth: 340,
  },
  legal: { fontFamily: font.body, fontSize: 12, color: colors.onDarkMuted, textAlign: "center" },

  // progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontFamily: font.bold, fontSize: 22, color: colors.ink, marginTop: -2 },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: colors.apricot, borderRadius: 999 },
  stepCount: { fontFamily: font.medium, fontSize: 12, color: colors.textMuted, width: 32, textAlign: "right" },

  // step content
  stepTitle: { fontFamily: font.displayBold, fontSize: 30, lineHeight: 35, color: colors.ink },
  stepCaption: { fontFamily: font.body, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: 8 },
  fieldLabel: { ...T.label, color: colors.textMuted, marginBottom: 10, marginTop: 20 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    height: 56,
    fontFamily: font.medium,
    fontSize: 17,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dualRow: { flexDirection: "row", gap: 10 },
  stepperLabel: { fontFamily: font.semibold, fontSize: 16, color: colors.text },
  stepperControls: { flexDirection: "row", alignItems: "center", gap: 14 },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnText: { fontFamily: font.bold, fontSize: 22, color: colors.ink, marginTop: -2 },
  stepperValueBox: { flexDirection: "row", alignItems: "baseline", gap: 4, minWidth: 64, justifyContent: "center" },
  stepperValue: { fontFamily: font.displayBold, fontSize: 24, color: colors.ink },
  stepperUnit: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted },

  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  selectRowActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  selectTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.text },
  selectSub: { fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: colors.apricot },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.apricot },

  summaryCard: { borderRadius: radius.lg, padding: 24, alignItems: "center" },
  summaryLabel: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 1.5, color: colors.sageSoft },
  summaryBig: { fontFamily: font.displayBold, fontSize: 56, color: colors.onDark, marginTop: 6 },
  summaryUnit: { fontFamily: font.medium, fontSize: 14, color: colors.onDarkMuted },
  summaryMacros: {
    flexDirection: "row",
    marginTop: 22,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    alignSelf: "stretch",
  },
  sMacroValue: { fontFamily: font.displayBold, fontSize: 22, color: colors.onDark },
  sMacroLabel: { fontFamily: font.medium, fontSize: 12, color: colors.onDarkMuted, marginTop: 2 },
  projection: {
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
    marginTop: 20,
    textAlign: "center",
  },

  footer: { padding: 24, paddingTop: 8 },
});
