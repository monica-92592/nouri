import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/Card";
import type { Meal } from "../../src/lib/types";
import { useStore } from "../../src/state/store";
import { MealRow } from "./index";
import { colors, font, radius, shadow } from "../../src/theme";

function dayKey(iso: string) {
  return new Date(iso).toDateString();
}

function friendlyDay(key: string) {
  const d = new Date(key);
  const today = new Date().toDateString();
  const yest = new Date(Date.now() - 86400000).toDateString();
  if (key === today) return "Today";
  if (key === yest) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default function Diary() {
  const router = useRouter();
  const { meals, targets, removeMeal } = useStore();

  const grouped = useMemo(() => {
    const map = new Map<string, Meal[]>();
    for (const m of meals) {
      const k = dayKey(m.createdAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    }
    return Array.from(map.entries());
  }, [meals]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Your diary</Text>
          <Text style={styles.sub}>Every meal you've logged, day by day.</Text>

          {grouped.length === 0 ? (
            <Card soft style={styles.empty}>
              <Text style={{ fontSize: 34 }}>📖</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptySub}>Your logged meals will appear here so you can spot patterns over time.</Text>
              <Pressable onPress={() => router.push("/(tabs)/scan")} style={styles.emptyBtn}>
                <Ionicons name="camera" size={18} color={colors.onDark} />
                <Text style={styles.emptyBtnText}>Log a meal</Text>
              </Pressable>
            </Card>
          ) : (
            grouped.map(([key, dayMeals], gi) => {
              const total = dayMeals.reduce((a, m) => a + m.calories, 0);
              return (
                <Animated.View key={key} entering={FadeInDown.duration(400).delay(gi * 60)} style={{ marginTop: gi === 0 ? 8 : 24 }}>
                  <View style={styles.dayHead}>
                    <Text style={styles.dayTitle}>{friendlyDay(key)}</Text>
                    <View style={styles.dayTotal}>
                      <Text style={styles.dayTotalText}>{total.toLocaleString()} kcal</Text>
                      {targets ? (
                        <Text style={styles.dayGoal}>/ {targets.calories.toLocaleString()}</Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={{ gap: 10 }}>
                    {dayMeals.map((m) => (
                      <Pressable
                        key={m.id}
                        onLongPress={() => removeMeal(m.id)}
                        delayLongPress={350}
                      >
                        <MealRow meal={m} />
                      </Pressable>
                    ))}
                  </View>
                </Animated.View>
              );
            })
          )}
          {grouped.length > 0 && (
            <Text style={styles.hint}>Tip: long-press a meal to remove it.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: font.displayBold, fontSize: 30, color: colors.ink },
  sub: { fontFamily: font.body, fontSize: 15, color: colors.textMuted, marginTop: 6 },
  empty: { alignItems: "center", paddingVertical: 36, gap: 10, marginTop: 24 },
  emptyTitle: { fontFamily: font.semibold, fontSize: 17, color: colors.text },
  emptySub: { fontFamily: font.body, fontSize: 14, color: colors.textMuted, textAlign: "center", maxWidth: 260, lineHeight: 20 },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.ink,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 8,
  },
  emptyBtnText: { fontFamily: font.semibold, fontSize: 14, color: colors.onDark },

  dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  dayTitle: { fontFamily: font.display, fontSize: 20, color: colors.ink },
  dayTotal: { flexDirection: "row", alignItems: "baseline", gap: 4, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, ...shadow.soft },
  dayTotalText: { fontFamily: font.bold, fontSize: 14, color: colors.ink },
  dayGoal: { fontFamily: font.medium, fontSize: 12, color: colors.textFaint },
  hint: { fontFamily: font.body, fontSize: 12, color: colors.textFaint, textAlign: "center", marginTop: 24 },
});
