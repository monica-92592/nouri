import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/Card";
import { Tag } from "../../src/components/bits";
import { affirmationOfTheDay, dayStreakLine, packs } from "../../src/lib/affirmations";
import { useStore } from "../../src/state/store";
import { colors, font, gradients, radius, shadow } from "../../src/theme";

export default function Affirmations() {
  const router = useRouter();
  const { profile, isPremium, streak } = useStore();
  const [openPack, setOpenPack] = useState<string | null>("daily");

  const daily = affirmationOfTheDay(profile?.goal ?? "maintain");

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Daily glow</Text>
          <Text style={styles.sub}>A moment of mindfulness to pair with your nourishment.</Text>

          {/* Featured affirmation */}
          <Animated.View entering={FadeIn.duration(600)}>
            <LinearGradient colors={gradients.affirm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featured}>
              <Text style={styles.featuredLabel}>TODAY</Text>
              <Text style={styles.featuredText}>“{daily}”</Text>
              <View style={styles.streakRow}>
                <Ionicons name="flame" size={16} color={colors.apricot} />
                <Text style={styles.streakText}>{dayStreakLine(streak)}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Packs */}
          <Text style={styles.sectionTitle}>Affirmation packs</Text>
          <View style={{ gap: 14 }}>
            {packs.map((pack, i) => {
              const locked = pack.premium && !isPremium;
              const open = openPack === pack.id && !locked;
              return (
                <Animated.View key={pack.id} entering={FadeInDown.duration(400).delay(i * 70)}>
                  <Card soft style={{ padding: 0, overflow: "hidden" }}>
                    <Pressable
                      onPress={() => (locked ? router.push("/paywall") : setOpenPack(open ? null : pack.id))}
                      style={styles.packHead}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={styles.packTitleRow}>
                          <Text style={styles.packTitle}>{pack.title}</Text>
                          {pack.premium ? <Tag label="Premium" tone="apricot" /> : <Tag label="Free" tone="sage" />}
                        </View>
                        <Text style={styles.packSub}>{pack.subtitle}</Text>
                      </View>
                      <Ionicons
                        name={locked ? "lock-closed" : open ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={colors.textFaint}
                      />
                    </Pressable>

                    {open && (
                      <Animated.View entering={FadeIn.duration(300)} style={styles.packBody}>
                        {pack.items.map((item, idx) => (
                          <View key={idx} style={styles.affirmItem}>
                            <View style={styles.affirmBullet} />
                            <Text style={styles.affirmItemText}>{item}</Text>
                          </View>
                        ))}
                      </Animated.View>
                    )}
                  </Card>
                </Animated.View>
              );
            })}
          </View>

          {!isPremium && (
            <Pressable onPress={() => router.push("/paywall")}>
              <LinearGradient colors={gradients.apricot} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.unlock}>
                <Ionicons name="sparkles" size={20} color={colors.ink} />
                <Text style={styles.unlockText}>Unlock all packs with Premium</Text>
              </LinearGradient>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: font.displayBold, fontSize: 30, color: colors.ink },
  sub: { fontFamily: font.body, fontSize: 15, color: colors.textMuted, marginTop: 6, marginBottom: 20 },

  featured: { borderRadius: radius.xl, padding: 26, ...shadow.card },
  featuredLabel: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 2, color: colors.sageSoft },
  featuredText: { fontFamily: font.displayItalic, fontSize: 26, lineHeight: 36, color: colors.onDark, marginTop: 14 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20 },
  streakText: { fontFamily: font.medium, fontSize: 13, color: colors.onDarkMuted },

  sectionTitle: { fontFamily: font.display, fontSize: 20, color: colors.ink, marginTop: 30, marginBottom: 14 },

  packHead: { flexDirection: "row", alignItems: "center", padding: 18, gap: 12 },
  packTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  packTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.ink },
  packSub: { fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: 3 },
  packBody: { paddingHorizontal: 18, paddingBottom: 18, gap: 14, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16 },
  affirmItem: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  affirmBullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.sage, marginTop: 7 },
  affirmItemText: { fontFamily: font.body, fontSize: 15, lineHeight: 22, color: colors.text, flex: 1 },

  unlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 18,
    borderRadius: radius.lg,
    marginTop: 24,
    ...shadow.soft,
  },
  unlockText: { fontFamily: font.semibold, fontSize: 15, color: colors.ink },
});
