import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/Button";
import { getMeditation, totalMeditationSeconds } from "../src/lib/wellness";
import { useStore } from "../src/state/store";
import { colors, font, gradients, radius } from "../src/theme";

export default function MeditateSession() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useMemo(() => getMeditation(id ?? ""), [id]);
  const { logMeditation } = useStore();

  const [phase, setPhase] = useState<"intro" | "play" | "paused" | "done">("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const elapsedRef = useRef(0);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (session) setRemaining(session.steps[0].seconds);
  }, [session]);

  const complete = useCallback(() => {
    if (!session || loggedRef.current) {
      setPhase("done");
      return;
    }
    loggedRef.current = true;
    const duration = elapsedRef.current || totalMeditationSeconds(session);
    logMeditation(session.id, session.title, duration);
    setPhase("done");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [session, logMeditation]);

  useEffect(() => {
    if (phase !== "play" || !session) return;

    const timer = setInterval(() => {
      elapsedRef.current += 1;
      setRemaining((r) => {
        if (r > 1) return r - 1;

        const next = stepIndex + 1;
        if (next >= session.steps.length) {
          clearInterval(timer);
          // defer to avoid setState during render of interval
          setTimeout(() => complete(), 0);
          return 0;
        }
        setStepIndex(next);
        Haptics.selectionAsync().catch(() => {});
        return session.steps[next].seconds;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, stepIndex, session, complete]);

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Session not found.</Text>
        <Button label="Go back" onPress={() => router.back()} />
      </View>
    );
  }

  const step = session.steps[stepIndex];
  const total = totalMeditationSeconds(session);
  const progress = Math.min(1, elapsedRef.current / total);

  const skip = () => {
    if (stepIndex >= session.steps.length - 1) {
      complete();
      return;
    }
    const next = stepIndex + 1;
    setStepIndex(next);
    setRemaining(session.steps[next].seconds);
  };

  return (
    <LinearGradient colors={gradients.brandWarm} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.top}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Text style={styles.kicker}>MEDITATE · BASIC</Text>
          <View style={{ width: 34 }} />
        </View>

        {phase === "intro" && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.intro}>
            <Text style={{ fontSize: 48 }}>{session.icon}</Text>
            <Text style={styles.introTitle}>{session.title}</Text>
            <Text style={styles.introSub}>{session.subtitle}</Text>
            <Text style={styles.introMeta}>
              {session.minutes} minutes · {session.steps.length} steps
            </Text>
            <View style={{ width: "100%", marginTop: 28 }}>
              <Button label="Begin" onPress={() => setPhase("play")} />
            </View>
          </Animated.View>
        )}

        {(phase === "play" || phase === "paused") && (
          <View style={styles.player}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(progress, 0.02) * 100}%` }]} />
            </View>
            <Text style={styles.stepCount}>
              Step {stepIndex + 1} of {session.steps.length}
            </Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepBody}>{step.body}</Text>
            <Text style={styles.timer}>{formatTime(remaining)}</Text>
            <View style={styles.playerActions}>
              {phase === "play" ? (
                <Pressable onPress={() => setPhase("paused")} style={styles.ghostBtn}>
                  <Text style={styles.ghostText}>Pause</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => setPhase("play")} style={styles.ghostBtn}>
                  <Text style={styles.ghostText}>Resume</Text>
                </Pressable>
              )}
              <Pressable onPress={skip} style={styles.ghostBtn}>
                <Text style={styles.ghostText}>Next</Text>
              </Pressable>
            </View>
          </View>
        )}

        {phase === "done" && (
          <Animated.View entering={FadeIn.duration(450)} style={styles.intro}>
            <Ionicons name="checkmark-circle" size={56} color={colors.apricot} />
            <Text style={styles.introTitle}>Well done</Text>
            <Text style={styles.introSub}>
              You completed {session.title}. Carry a little of this stillness with you.
            </Text>
            <View style={{ width: "100%", marginTop: 28 }}>
              <Button label="Back to Glow" onPress={() => router.back()} />
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.bg, gap: 16 },
  missing: { fontFamily: font.semibold, fontSize: 16, color: colors.text },

  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 4 },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: colors.onDark, fontFamily: font.bold, fontSize: 14 },
  kicker: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1.5, color: colors.sageSoft },

  intro: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
  introTitle: { fontFamily: font.displayBold, fontSize: 32, color: colors.onDark, marginTop: 16, textAlign: "center" },
  introSub: { fontFamily: font.body, fontSize: 16, lineHeight: 24, color: colors.onDarkMuted, marginTop: 10, textAlign: "center" },
  introMeta: { fontFamily: font.medium, fontSize: 13, color: colors.sageSoft, marginTop: 16 },

  player: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: colors.apricot, borderRadius: 999 },
  stepCount: { fontFamily: font.semibold, fontSize: 12, letterSpacing: 1, color: colors.sageSoft, marginTop: 22 },
  stepTitle: { fontFamily: font.displayBold, fontSize: 30, color: colors.onDark, marginTop: 10 },
  stepBody: { fontFamily: font.body, fontSize: 17, lineHeight: 27, color: colors.onDarkMuted, marginTop: 16 },
  timer: { fontFamily: font.displayBold, fontSize: 56, color: colors.onDark, marginTop: 36 },
  playerActions: { flexDirection: "row", gap: 12, marginTop: 28 },
  ghostBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  ghostText: { fontFamily: font.semibold, fontSize: 14, color: colors.onDark },
});
