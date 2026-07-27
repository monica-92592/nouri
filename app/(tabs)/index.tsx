import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalorieRing } from "../../src/components/CalorieRing";
import { Card } from "../../src/components/Card";
import { MacroBar } from "../../src/components/MacroBar";
import { Emoji, SectionTitle, Tag } from "../../src/components/bits";
import { affirmationsOfTheDayExtras, dailyAffirmationDetail } from "../../src/lib/affirmations";
import type { Meal } from "../../src/lib/types";
import { getJournalPrompt } from "../../src/lib/wellness";
import { useStore } from "../../src/state/store";
import { colors, font, gradients, radius, shadow } from "../../src/theme";

const GRATITUDE_PROMPT_ID = "gratitude-heart";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Today() {
  const router = useRouter();
  const {
    profile,
    targets,
    consumedToday,
    todaysMeals,
    isPremium,
    scansRemaining,
    streak,
  } = useStore();

  if (!profile || !targets) return null;

  const daily = dailyAffirmationDetail();
  const extras = affirmationsOfTheDayExtras(2);
  const gratitude = getJournalPrompt(GRATITUDE_PROMPT_ID);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.name}>{profile.name} 🌿</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.streakPill}>
                <Ionicons name="flame" size={14} color={colors.apricotDeep} />
                <Text style={styles.streakText}>{streak}</Text>
              </View>
              {!isPremium && (
                <Pressable onPress={() => router.push("/paywall")} style={styles.proBtn}>
                  <Text style={styles.proText}>Go Premium</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Ring + macros */}
          <Animated.View entering={FadeInDown.duration(500)} style={{ paddingHorizontal: 20 }}>
            <Card style={{ alignItems: "center", paddingVertical: 24 }}>
              <CalorieRing consumed={consumedToday.calories} target={targets.calories} />
              <View style={styles.macros}>
                <MacroBar label="Protein" value={consumedToday.protein} target={targets.protein} color={colors.protein} />
                <MacroBar label="Carbs" value={consumedToday.carbs} target={targets.carbs} color={colors.carbs} />
                <MacroBar label="Fat" value={consumedToday.fat} target={targets.fat} color={colors.fat} />
              </View>
            </Card>
          </Animated.View>

          {/* Scan CTA */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <Pressable onPress={() => router.push("/(tabs)/scan")}>
              <LinearGradient colors={gradients.dawn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.scanCta}>
                <View style={styles.scanIcon}>
                  <Ionicons name="camera" size={24} color={colors.onDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scanTitle}>Snap your next meal</Text>
                  <Text style={styles.scanSub}>
                    {isPremium
                      ? "Unlimited scans · instant macros"
                      : `${scansRemaining} free ${scansRemaining === 1 ? "scan" : "scans"} left today`}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={colors.onDark} />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Affirmations — free daily offering from the full library */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <Pressable onPress={() => router.push("/(tabs)/affirmations")}>
              <LinearGradient colors={gradients.affirm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.affirm}>
                <View style={styles.affirmTop}>
                  <Text style={styles.affirmLabel}>TODAY'S AFFIRMATION · FREE</Text>
                  <Tag label="Basic" tone="sage" />
                </View>
                <Text style={styles.affirmPack}>{daily.packTitle}</Text>
                <Text style={styles.affirmText}>“{daily.text}”</Text>
              </LinearGradient>
            </Pressable>

            {extras.length > 0 ? (
              <View style={styles.affirmExtras}>
                <Text style={styles.affirmExtrasLabel}>More for today</Text>
                {extras.map((a) => (
                  <Pressable key={a.text} onPress={() => router.push("/(tabs)/affirmations")}>
                    <Card soft style={styles.affirmExtraCard}>
                      <Text style={styles.affirmExtraPack}>{a.packTitle}</Text>
                      <Text style={styles.affirmExtraText}>“{a.text}”</Text>
                    </Card>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </Animated.View>

          {/* Daily gratitude journal — featured on Today */}
          {gratitude ? (
            <Animated.View entering={FadeInDown.duration(500).delay(260)} style={{ paddingHorizontal: 20, marginTop: 12 }}>
              <Pressable
                onPress={() =>
                  router.push({ pathname: "/journal-write", params: { promptId: gratitude.id } })
                }
              >
                <Card soft style={styles.gratitudeCard}>
                  <View style={styles.gratitudeIcon}>
                    <Emoji char={gratitude.icon} style={{ fontSize: 22 }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gratitudeTitle}>{gratitude.title}</Text>
                    <Text style={styles.gratitudeSub}>{gratitude.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
                </Card>
              </Pressable>
            </Animated.View>
          ) : null}

          {/* Meals */}
          <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
            <SectionTitle
              title="Today's meals"
              action={todaysMeals.length ? "History" : undefined}
              onAction={() => router.push("/(tabs)/diary")}
            />
            {todaysMeals.length === 0 ? (
              <Card soft style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="camera-outline" size={28} color={colors.forest} />
                </View>
                <Text style={styles.emptyTitle}>No meals logged yet</Text>
                <Text style={styles.emptySub}>Tap the camera to add your first meal of the day.</Text>
              </Card>
            ) : (
              <View style={{ gap: 12 }}>
                {todaysMeals.map((m, i) => (
                  <Animated.View key={m.id} entering={FadeInDown.duration(400).delay(i * 60)}>
                    <MealRow meal={m} />
                  </Animated.View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function MealRow({ meal }: { meal: Meal }) {
  const time = new Date(meal.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return (
    <View style={styles.mealRow}>
      {meal.photoUri ? (
        <Image source={{ uri: meal.photoUri }} style={styles.mealThumb} />
      ) : (
        <View style={[styles.mealThumb, styles.mealThumbFallback]}>
          <Ionicons name="restaurant-outline" size={22} color={colors.forest} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.mealTitle} numberOfLines={1}>{meal.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          <Text style={styles.mealMeta}>{time}</Text>
          <View style={styles.dot} />
          <Text style={styles.mealMeta}>P{meal.protein} · C{meal.carbs} · F{meal.fat}</Text>
          {meal.source === "restaurant" ? (
            <>
              <View style={styles.dot} />
              <Text style={styles.mealMeta} numberOfLines={1}>
                {meal.venueName ? meal.venueName : "Restaurant"}
              </Text>
            </>
          ) : null}
        </View>
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <Text style={styles.mealKcal}>{meal.calories}</Text>
        <Tag
          label={`${meal.healthScore}`}
          tone={meal.healthScore >= 75 ? "sage" : meal.healthScore >= 55 ? "apricot" : "berry"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: { fontFamily: font.body, fontSize: 15, color: colors.textMuted },
  name: { fontFamily: font.displayBold, fontSize: 28, color: colors.ink, marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(244,162,89,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  streakText: { fontFamily: font.bold, fontSize: 13, color: colors.apricotDeep },
  proBtn: { backgroundColor: colors.ink, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  proText: { fontFamily: font.semibold, fontSize: 12, color: colors.onDark },

  macros: { flexDirection: "row", gap: 14, marginTop: 22, alignSelf: "stretch" },

  scanCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: radius.lg,
    ...shadow.soft,
  },
  scanIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.onDark },
  scanSub: { fontFamily: font.body, fontSize: 13, color: colors.onDarkMuted, marginTop: 2 },

  affirm: { padding: 20, borderRadius: radius.lg, ...shadow.soft },
  affirmTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  affirmLabel: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.sageSoft, flex: 1 },
  affirmPack: { fontFamily: font.medium, fontSize: 13, color: colors.onDarkMuted, marginTop: 10 },
  affirmText: { fontFamily: font.displayItalic, fontSize: 20, lineHeight: 28, color: colors.onDark, marginTop: 6 },
  affirmExtras: { marginTop: 12, gap: 8 },
  affirmExtrasLabel: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 0.4, color: colors.textMuted, marginBottom: 2 },
  affirmExtraCard: { paddingVertical: 14, paddingHorizontal: 16 },
  affirmExtraPack: { fontFamily: font.medium, fontSize: 11, color: colors.textFaint, letterSpacing: 0.3 },
  affirmExtraText: { fontFamily: font.body, fontSize: 15, lineHeight: 22, color: colors.text, marginTop: 4 },

  gratitudeCard: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 16, paddingHorizontal: 16 },
  gratitudeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  gratitudeTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.ink },
  gratitudeSub: { fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },

  empty: { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.text },
  emptySub: { fontFamily: font.body, fontSize: 14, color: colors.textMuted, textAlign: "center", maxWidth: 240 },

  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    ...shadow.soft,
  },
  mealThumb: { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.surfaceMuted },
  mealThumbFallback: { alignItems: "center", justifyContent: "center" },
  mealTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  mealMeta: { fontFamily: font.medium, fontSize: 12, color: colors.textMuted },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textFaint },
  mealKcal: { fontFamily: font.displayBold, fontSize: 18, color: colors.ink },
});
