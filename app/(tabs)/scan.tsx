import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { Tag } from "../../src/components/bits";
import { analyzeMealPhoto } from "../../src/lib/ai";
import { DEMO_MODE } from "../../src/lib/config";
import type { Meal } from "../../src/lib/types";
import { useStore } from "../../src/state/store";
import { colors, font, gradients, radius, shadow } from "../../src/theme";

type Phase = "idle" | "analyzing" | "result";

export default function Scan() {
  const router = useRouter();
  const { addMeal, logScan, isPremium, scansRemaining } = useStore();
  const [phase, setPhase] = useState<Phase>("idle");
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<Meal | null>(null);

  const gate = () => {
    if (!isPremium && scansRemaining <= 0) {
      Alert.alert(
        "Daily free scans used",
        "Upgrade to Nouri Premium for unlimited meal scans and personalized coaching.",
        [
          { text: "Maybe later", style: "cancel" },
          { text: "Go Premium", onPress: () => router.push("/paywall") },
        ]
      );
      return false;
    }
    return true;
  };

  const runAnalysis = async (uri: string, base64?: string | null) => {
    setPhoto(uri);
    setPhase("analyzing");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      const meal = await analyzeMealPhoto(base64 ?? "", undefined);
      meal.photoUri = uri;
      setResult(meal);
      setPhase("result");
      logScan();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e: any) {
      Alert.alert("Analysis failed", e?.message ?? "Please try again.");
      reset();
    }
  };

  const takePhoto = async () => {
    if (!gate()) return;
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera access needed", "Enable camera access in Settings to snap meals.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled) runAnalysis(res.assets[0].uri, res.assets[0].base64);
  };

  const pickPhoto = async () => {
    if (!gate()) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ["images"],
    });
    if (!res.canceled) runAnalysis(res.assets[0].uri, res.assets[0].base64);
  };

  const reset = () => {
    setPhase("idle");
    setPhoto(null);
    setResult(null);
  };

  const save = () => {
    if (result) {
      addMeal(result);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    reset();
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Scan a meal</Text>
          <Text style={styles.sub}>
            Point, shoot, and Nouri estimates calories & macros in seconds.
          </Text>

          {phase === "idle" && <IdleView onCamera={takePhoto} onLibrary={pickPhoto} premium={isPremium} remaining={scansRemaining} />}

          {phase === "analyzing" && photo && <AnalyzingView photo={photo} />}

          {phase === "result" && result && (
            <ResultView meal={result} photo={photo} onSave={save} onRetry={reset} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function IdleView({
  onCamera,
  onLibrary,
  premium,
  remaining,
}: {
  onCamera: () => void;
  onLibrary: () => void;
  premium: boolean;
  remaining: number;
}) {
  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroFrame}>
          <Ionicons name="scan-outline" size={72} color={colors.sageSoft} />
        </View>
        <Text style={styles.heroTitle}>Ready when you are</Text>
        <Text style={styles.heroSub}>
          {premium ? "Unlimited scans included" : `${remaining} free ${remaining === 1 ? "scan" : "scans"} left today`}
        </Text>
      </LinearGradient>

      <View style={{ gap: 12, marginTop: 20 }}>
        <Button
          label="Take a photo"
          onPress={onCamera}
          icon={<Ionicons name="camera" size={20} color={colors.ink} />}
        />
        <Button
          label="Choose from library"
          variant="light"
          onPress={onLibrary}
          icon={<Ionicons name="images-outline" size={20} color={colors.ink} />}
        />
      </View>

      <Card soft style={{ marginTop: 20 }}>
        <Text style={styles.howTitle}>How it works</Text>
        {[
          "Snap your plate — one photo is enough.",
          "AI identifies foods and estimates portions.",
          "Review, tweak if needed, and log it.",
        ].map((t, i) => (
          <View key={i} style={styles.howRow}>
            <View style={styles.howNum}>
              <Text style={styles.howNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.howText}>{t}</Text>
          </View>
        ))}
        {DEMO_MODE && (
          <View style={styles.demoNote}>
            <Ionicons name="information-circle-outline" size={16} color={colors.forest} />
            <Text style={styles.demoText}>
              Demo mode: sample results shown. Add OpenAI keys to your server for live analysis.
            </Text>
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

function AnalyzingView({ photo }: { photo: string }) {
  const shimmer = useSharedValue(0);
  React.useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [shimmer]);
  const pulse = useAnimatedStyle(() => ({ opacity: 0.4 + shimmer.value * 0.6 }));

  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ alignItems: "center", marginTop: 8 }}>
      <View style={styles.analyzeImgWrap}>
        <Image source={{ uri: photo }} style={styles.analyzeImg} />
        <View style={styles.analyzeOverlay}>
          <Animated.View style={pulse}>
            <Ionicons name="sparkles" size={34} color={colors.onDark} />
          </Animated.View>
        </View>
      </View>
      <Text style={styles.analyzeTitle}>Analyzing your meal…</Text>
      <Text style={styles.analyzeSub}>Identifying foods and estimating portions</Text>
    </Animated.View>
  );
}

function ResultView({
  meal,
  photo,
  onSave,
  onRetry,
}: {
  meal: Meal;
  photo: string | null;
  onSave: () => void;
  onRetry: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(450)}>
      {photo && <Image source={{ uri: photo }} style={styles.resultImg} />}

      <View style={styles.resultHead}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resultTitle}>{meal.title}</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Tag label={`Health ${meal.healthScore}/100`} tone={meal.healthScore >= 75 ? "sage" : meal.healthScore >= 55 ? "apricot" : "berry"} />
            <Tag label={`${meal.confidence} confidence`} tone="muted" />
          </View>
        </View>
        <View style={styles.resultKcalBox}>
          <Text style={styles.resultKcal}>{meal.calories}</Text>
          <Text style={styles.resultKcalLabel}>kcal</Text>
        </View>
      </View>

      <View style={styles.macroStrip}>
        <MacroPill label="Protein" value={meal.protein} color={colors.protein} />
        <MacroPill label="Carbs" value={meal.carbs} color={colors.carbs} />
        <MacroPill label="Fat" value={meal.fat} color={colors.fat} />
      </View>

      {meal.note ? (
        <Card soft style={{ marginTop: 16, flexDirection: "row", gap: 10 }}>
          <Ionicons name="bulb-outline" size={18} color={colors.apricotDeep} />
          <Text style={styles.noteText}>{meal.note}</Text>
        </Card>
      ) : null}

      <Text style={styles.itemsLabel}>DETECTED ITEMS</Text>
      <View style={{ gap: 8 }}>
        {meal.items.map((it, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{it.name}</Text>
              <Text style={styles.itemQty}>{it.quantity}</Text>
            </View>
            <Text style={styles.itemKcal}>{it.calories} kcal</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 12, marginTop: 24 }}>
        <Button label="Log this meal" onPress={onSave} icon={<Ionicons name="checkmark" size={20} color={colors.ink} />} />
        <Button label="Retake" variant="ghost" onPress={onRetry} />
      </View>
    </Animated.View>
  );
}

function MacroPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.macroPill}>
      <View style={[styles.macroDot, { backgroundColor: color }]} />
      <Text style={styles.macroPillValue}>{value}g</Text>
      <Text style={styles.macroPillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: font.displayBold, fontSize: 30, color: colors.ink },
  sub: { fontFamily: font.body, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: 6, marginBottom: 20 },

  hero: { borderRadius: radius.xl, alignItems: "center", paddingVertical: 40, ...shadow.card },
  heroFrame: {
    width: 130,
    height: 130,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroTitle: { fontFamily: font.display, fontSize: 22, color: colors.onDark, marginTop: 20 },
  heroSub: { fontFamily: font.medium, fontSize: 14, color: colors.sageSoft, marginTop: 4 },

  howTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.ink, marginBottom: 14 },
  howRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  howNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surfaceMuted, alignItems: "center", justifyContent: "center" },
  howNumText: { fontFamily: font.bold, fontSize: 13, color: colors.forest },
  howText: { fontFamily: font.body, fontSize: 14, color: colors.textMuted, flex: 1 },
  demoNote: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: radius.sm,
    marginTop: 6,
  },
  demoText: { fontFamily: font.medium, fontSize: 12, color: colors.forest, flex: 1, lineHeight: 17 },

  analyzeImgWrap: { width: 240, height: 240, borderRadius: 28, overflow: "hidden", ...shadow.lift },
  analyzeImg: { width: "100%", height: "100%" },
  analyzeOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlay, alignItems: "center", justifyContent: "center" },
  analyzeTitle: { fontFamily: font.display, fontSize: 22, color: colors.ink, marginTop: 24 },
  analyzeSub: { fontFamily: font.body, fontSize: 14, color: colors.textMuted, marginTop: 6 },

  resultImg: { width: "100%", height: 220, borderRadius: radius.lg, marginBottom: 18 },
  resultHead: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  resultTitle: { fontFamily: font.displayBold, fontSize: 24, color: colors.ink, lineHeight: 29 },
  resultKcalBox: { alignItems: "center", backgroundColor: colors.ink, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 10 },
  resultKcal: { fontFamily: font.displayBold, fontSize: 26, color: colors.onDark },
  resultKcalLabel: { fontFamily: font.medium, fontSize: 11, color: colors.sageSoft },

  macroStrip: { flexDirection: "row", gap: 10, marginTop: 18 },
  macroPill: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 14, alignItems: "center", gap: 4, ...shadow.soft },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroPillValue: { fontFamily: font.displayBold, fontSize: 20, color: colors.ink },
  macroPillLabel: { fontFamily: font.medium, fontSize: 12, color: colors.textMuted },

  noteText: { fontFamily: font.body, fontSize: 14, lineHeight: 21, color: colors.text, flex: 1 },

  itemsLabel: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 1, color: colors.textFaint, marginTop: 24, marginBottom: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, ...shadow.soft },
  itemName: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  itemQty: { fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  itemKcal: { fontFamily: font.semibold, fontSize: 14, color: colors.forest },
});
