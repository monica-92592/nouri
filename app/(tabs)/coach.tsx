import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/Card";
import { Glyph, SectionTitle, Tag } from "../../src/components/bits";
import { estimateWeeksToGoal } from "../../src/lib/nutrition";
import { buildTips } from "../../src/lib/tips";
import { useStore } from "../../src/state/store";
import { colors, font, gradients, radius, shadow } from "../../src/theme";

export default function Coach() {
  const router = useRouter();
  const { profile, targets, isPremium, subscription, cancelSubscription, resetAll } = useStore();

  const tips = useMemo(() => (profile && targets ? buildTips(profile, targets) : []), [profile, targets]);
  const weeks = useMemo(() => (profile ? estimateWeeksToGoal(profile) : null), [profile]);

  if (!profile || !targets) return null;

  const goalLabel =
    profile.goal === "lose" ? "Lose weight" : profile.goal === "gain" ? "Build / gain" : "Maintain";

  const confirmReset = () =>
    Alert.alert("Reset Nouri?", "This clears your profile, meals and subscription on this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: () => { resetAll(); router.replace("/onboarding"); } },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Your coach</Text>
          <Text style={styles.sub}>Guidance shaped by your age, habits and goals.</Text>

          {/* Plan summary */}
          <Animated.View entering={FadeInDown.duration(450)}>
            <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.planCard}>
              <View style={styles.planTop}>
                <View>
                  <Text style={styles.planKicker}>YOUR PLAN</Text>
                  <Text style={styles.planGoal}>{goalLabel}</Text>
                </View>
                <View style={styles.planKcal}>
                  <Text style={styles.planKcalNum}>{targets.calories.toLocaleString()}</Text>
                  <Text style={styles.planKcalLabel}>kcal / day</Text>
                </View>
              </View>
              <View style={styles.planStats}>
                <PlanStat label="Protein" value={`${targets.protein}g`} />
                <PlanStat label="Carbs" value={`${targets.carbs}g`} />
                <PlanStat label="Fat" value={`${targets.fat}g`} />
                <PlanStat label="TDEE" value={`${targets.tdee}`} />
              </View>
              {weeks ? (
                <View style={styles.planProjection}>
                  <Ionicons name="trending-down-outline" size={16} color={colors.sageSoft} />
                  <Text style={styles.planProjText}>
                    ~{weeks} weeks to reach {profile.targetWeightKg}kg at a {profile.pace} pace
                  </Text>
                </View>
              ) : null}
            </LinearGradient>
          </Animated.View>

          {/* Premium weekly report teaser / status */}
          {!isPremium ? (
            <Pressable onPress={() => router.push("/paywall")}>
              <Card style={styles.premiumTeaser}>
                <View style={styles.premiumIcon}>
                  <Ionicons name="sparkles" size={22} color={colors.apricotDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumTitle}>Unlock your weekly report</Text>
                  <Text style={styles.premiumSub}>AI-personalized pattern analysis + 3 specific fixes each week.</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
              </Card>
            </Pressable>
          ) : (
            <Card style={styles.premiumActive}>
              <View style={styles.premiumIcon}>
                <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumTitle}>Premium active</Text>
                <Text style={styles.premiumSub}>
                  {subscription.plan === "yearly" ? "Yearly plan" : "Monthly plan"}
                  {subscription.demo ? " · demo" : ""}
                  {subscription.renewsOn ? ` · renews ${new Date(subscription.renewsOn).toLocaleDateString()}` : ""}
                </Text>
              </View>
            </Card>
          )}

          {/* Tips */}
          <SectionTitle title="Tips for you" style={{ marginTop: 28 }} />
          <View style={{ gap: 12 }}>
            {tips.map((tip, i) => {
              const locked = tip.premium && !isPremium;
              return (
                <Animated.View key={tip.id} entering={FadeInDown.duration(400).delay(i * 50)}>
                  <Pressable onPress={() => locked && router.push("/paywall")}>
                    <Card soft style={[styles.tipCard, locked && { opacity: 0.85 }]}>
                      <Glyph char={tip.icon} />
                      <View style={{ flex: 1 }}>
                        <View style={styles.tipTop}>
                          <Text style={styles.tipTitle}>{tip.title}</Text>
                          {tip.premium ? <Tag label={locked ? "Premium" : "Premium"} tone="apricot" /> : <Tag label={tip.tag} tone="sage" />}
                        </View>
                        <Text style={styles.tipBody}>
                          {locked ? "Upgrade to unlock personalized weekly insights based on your logged meals." : tip.body}
                        </Text>
                      </View>
                    </Card>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Account */}
          <SectionTitle title="Account" style={{ marginTop: 28 }} />
          <Card soft style={{ gap: 4 }}>
            <SettingRow label="Profile" value={`${profile.name} · ${profile.age} yrs`} />
            <View style={styles.divider} />
            <SettingRow label="Current weight" value={`${profile.weightKg} kg`} />
            <View style={styles.divider} />
            <SettingRow label="Goal weight" value={`${profile.targetWeightKg} kg`} />
            {isPremium && (
              <>
                <View style={styles.divider} />
                <Pressable onPress={() => Alert.alert("Manage subscription", "Cancel your subscription?", [
                  { text: "Keep", style: "cancel" },
                  { text: "Cancel plan", style: "destructive", onPress: cancelSubscription },
                ])}>
                  <SettingRow label="Subscription" value="Manage" accent />
                </Pressable>
              </>
            )}
          </Card>

          <Pressable onPress={confirmReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset app data</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PlanStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={styles.planStatValue}>{value}</Text>
      <Text style={styles.planStatLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={[styles.settingValue, accent && { color: colors.forest }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: font.displayBold, fontSize: 30, color: colors.ink },
  sub: { fontFamily: font.body, fontSize: 15, color: colors.textMuted, marginTop: 6, marginBottom: 20 },

  planCard: { borderRadius: radius.lg, padding: 22, ...shadow.card },
  planTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  planKicker: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1.5, color: colors.sageSoft },
  planGoal: { fontFamily: font.displayBold, fontSize: 26, color: colors.onDark, marginTop: 4 },
  planKcal: { alignItems: "flex-end" },
  planKcalNum: { fontFamily: font.displayBold, fontSize: 26, color: colors.onDark },
  planKcalLabel: { fontFamily: font.medium, fontSize: 11, color: colors.onDarkMuted },
  planStats: {
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  planStatValue: { fontFamily: font.displayBold, fontSize: 18, color: colors.onDark },
  planStatLabel: { fontFamily: font.medium, fontSize: 11, color: colors.onDarkMuted, marginTop: 2 },
  planProjection: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 },
  planProjText: { fontFamily: font.medium, fontSize: 13, color: colors.sageSoft },

  premiumTeaser: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 16 },
  premiumActive: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 16 },
  premiumIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.ink },
  premiumSub: { fontFamily: font.body, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: 2 },

  tipCard: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  tipTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  tipTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text, flex: 1 },
  tipBody: { fontFamily: font.body, fontSize: 14, lineHeight: 21, color: colors.textMuted, marginTop: 6 },

  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  settingLabel: { fontFamily: font.medium, fontSize: 15, color: colors.text },
  settingValue: { fontFamily: font.medium, fontSize: 15, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.line },

  resetBtn: { alignItems: "center", marginTop: 24 },
  resetText: { fontFamily: font.medium, fontSize: 14, color: colors.danger },
});
