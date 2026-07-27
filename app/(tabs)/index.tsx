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
import { SectionTitle, Tag } from "../../src/components/bits";
import { affirmationOfTheDay } from "../../src/lib/affirmations";
import type { Meal } from "../../src/lib/types";
import { useStore } from "../../src/state/store";
import { colors, font, gradients, radius, shadow } from "../../src/theme";

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

  const affirmation = affirmationOfTheDay();

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

          {/* Affirmation */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <Pressable onPress={() => router.push("/(tabs)/affirmations")}>
              <LinearGradient colors={gradients.affirm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.affirm}>
                <Text style={styles.affirmLabel}>TODAY'S AFFIRMATION</Text>
                <Text style={styles.affirmText}>“{affirmation}”</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Meals */}
          <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
            <SectionTitle
              title="Today's meals"
              action={todaysMeals.length ? "History" : undefined}
              onAction={() => router.push("/(tabs)/diary")}
            />
            {todaysMeals.length === 0 ? (
              <Card soft style={styles.empty}>
                <Text style={{ fontSize: 32 }}>🍽️</Text>
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
          <Text style={styles.mealMeta}>{time}</Text>
          <View style={styles.dot} />
          <Text style={styles.mealMeta}>P{meal.protein} · C{meal.carbs} · F{meal.fat}</Text>
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
  affirmLabel: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1.5, color: colors.sageSoft },
  affirmText: { fontFamily: font.displayItalic, fontSize: 20, lineHeight: 28, color: colors.onDark, marginTop: 10 },

  empty: { alignItems: "center", paddingVertical: 32, gap: 8 },
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
