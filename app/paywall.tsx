import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/Button";
import { createSubscriptionIntent, PLANS } from "../src/lib/billing";
import { config, DEMO_MODE, hasStripe } from "../src/lib/config";
import type { SubscriptionPlan } from "../src/lib/types";
import { useStore } from "../src/state/store";
import { colors, font, gradients, radius, shadow } from "../src/theme";

const BENEFITS = [
  { icon: "📸", title: "Unlimited photo scans", body: "Log every meal, snack and drink — no daily cap." },
  { icon: "🎯", title: "Personalized coaching", body: "Weekly AI reports with fixes tuned to your habits." },
  { icon: "🌸", title: "All affirmation packs", body: "Mindful eating, confidence, motivation & more." },
  { icon: "📊", title: "Full history & trends", body: "See patterns, streaks and progress over time." },
];

export default function Paywall() {
  const router = useRouter();
  const { activateSubscription } = useStore();
  const [selected, setSelected] = useState<SubscriptionPlan>("yearly");
  const [busy, setBusy] = useState(false);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  const subscribe = async () => {
    setBusy(true);
    try {
      const intent = await createSubscriptionIntent(selected);

      // Demo mode: no backend/Stripe — grant access immediately.
      if (intent.demo || DEMO_MODE) {
        activateSubscription(selected, true);
        Alert.alert(
          "Welcome to Nouri Premium ✨",
          "Demo mode: premium unlocked without payment. Add Stripe keys to enable real billing.",
          [{ text: "Let's go", onPress: () => router.replace("/(tabs)") }]
        );
        return;
      }

      if (intent.error || !intent.clientSecret) {
        throw new Error(intent.error || "Could not start checkout");
      }

      // Real Stripe Payment Sheet (only when the native module is present).
      if (hasStripe) {
        const stripe = require("@stripe/stripe-react-native");
        const init = await stripe.initPaymentSheet({
          merchantDisplayName: "Nouri",
          paymentIntentClientSecret: intent.clientSecret,
          customerId: intent.customerId,
          customerEphemeralKeySecret: intent.ephemeralKey,
          allowsDelayedPaymentMethods: false,
        });
        if (init.error) throw new Error(init.error.message);

        const res = await stripe.presentPaymentSheet();
        if (res.error) {
          Alert.alert("Payment cancelled", res.error.message);
          return;
        }
        activateSubscription(selected, false);
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      Alert.alert("Something went wrong", e?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <LinearGradient colors={gradients.brandWarm} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable onPress={close} hitSlop={12} style={styles.close}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Pressable onPress={close} hitSlop={12}>
            <Text style={styles.restore}>Not now</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text style={styles.kicker}>NOURI PREMIUM</Text>
            <Text style={styles.title}>Your effortless path to a lighter you</Text>
            <Text style={styles.sub}>
              Everything you need to eat mindfully and reach your goal — accurate,
              personal, and calm.
            </Text>
          </Animated.View>

          <View style={styles.benefits}>
            {BENEFITS.map((b, i) => (
              <Animated.View
                key={b.title}
                entering={FadeInDown.duration(500).delay(120 + i * 80)}
                style={styles.benefitRow}
              >
                <View style={styles.benefitIcon}>
                  <Text style={{ fontSize: 20 }}>{b.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>{b.title}</Text>
                  <Text style={styles.benefitBody}>{b.body}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={styles.plans}>
            {PLANS.map((p) => {
              const active = selected === p.id;
              return (
                <Pressable key={p.id} onPress={() => setSelected(p.id)} style={[styles.plan, active && styles.planActive]}>
                  {p.badge ? (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{p.badge}</Text>
                    </View>
                  ) : null}
                  <View style={styles.planLeft}>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                    <View>
                      <Text style={[styles.planLabel, active && styles.planTextDark]}>{p.label}</Text>
                      <Text style={[styles.planPerDay, active && styles.planSubDark]}>
                        {p.savings ? `${p.savings} · ${p.perDay}` : p.perDay}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.planPrice, active && styles.planTextDark]}>{p.price}</Text>
                    <Text style={[styles.planCadence, active && styles.planSubDark]}>{p.cadence}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Button
            label={busy ? "Starting…" : "Start Premium"}
            onPress={subscribe}
            loading={busy}
            style={{ marginTop: 20 }}
          />
          <Text style={styles.finePrint}>
            {DEMO_MODE
              ? "Demo mode active — no real charge. Configure Stripe to enable live billing."
              : "Recurring billing. Cancel anytime in Settings. Terms & Privacy apply."}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: colors.onDark, fontFamily: font.bold, fontSize: 15 },
  restore: { color: colors.onDarkMuted, fontFamily: font.medium, fontSize: 14 },

  kicker: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 2, color: colors.sageSoft },
  title: { fontFamily: font.displayBold, fontSize: 34, lineHeight: 39, color: colors.onDark, marginTop: 10 },
  sub: { fontFamily: font.body, fontSize: 15, lineHeight: 23, color: colors.onDarkMuted, marginTop: 12 },

  benefits: { marginTop: 26, gap: 16 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  benefitIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.onDark },
  benefitBody: { fontFamily: font.body, fontSize: 13, lineHeight: 19, color: colors.onDarkMuted, marginTop: 2 },

  plans: { marginTop: 28, gap: 12 },
  plan: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  planActive: { backgroundColor: colors.surface, borderColor: colors.apricot, ...shadow.lift },
  planTextDark: { color: colors.ink },
  planSubDark: { color: colors.textMuted },
  planLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  planLabel: { fontFamily: font.semibold, fontSize: 17, color: colors.onDark },
  planPerDay: { fontFamily: font.medium, fontSize: 12, color: colors.onDarkMuted, marginTop: 2 },
  planPrice: { fontFamily: font.displayBold, fontSize: 22, color: colors.onDark },
  planCadence: { fontFamily: font.medium, fontSize: 12, color: colors.onDarkMuted },
  planBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: colors.apricot,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  planBadgeText: { fontFamily: font.bold, fontSize: 11, color: colors.ink },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: colors.apricot },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.apricot },

  finePrint: { fontFamily: font.body, fontSize: 12, lineHeight: 18, color: colors.onDarkMuted, textAlign: "center", marginTop: 14 },
});
