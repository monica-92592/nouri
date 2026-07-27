import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/Card";
import { Tag } from "../../src/components/bits";
import { affirmationOfTheDay, dayStreakLine, packs } from "../../src/lib/affirmations";
import {
  journalPacks,
  journalPrompts,
  meditations,
  type JournalCategory,
} from "../../src/lib/wellness";
import { useStore } from "../../src/state/store";
import { colors, font, gradients, radius, shadow } from "../../src/theme";

type GlowTab = "affirm" | "journal" | "meditate";

export default function Glow() {
  const [tab, setTab] = useState<GlowTab>("affirm");

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.h1}>Glow</Text>
          <Text style={styles.sub}>Affirmations, journaling & meditation — included in basic.</Text>
          <View style={styles.seg}>
            {(
              [
                { id: "affirm", label: "Affirm" },
                { id: "journal", label: "Journal" },
                { id: "meditate", label: "Meditate" },
              ] as { id: GlowTab; label: string }[]
            ).map((t) => (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={[styles.segBtn, tab === t.id && styles.segBtnActive]}
              >
                <Text style={[styles.segText, tab === t.id && styles.segTextActive]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {tab === "affirm" && <AffirmPanel />}
        {tab === "journal" && <JournalPanel />}
        {tab === "meditate" && <MeditatePanel />}
      </SafeAreaView>
    </View>
  );
}

function AffirmPanel() {
  const router = useRouter();
  const { isPremium, streak } = useStore();
  const [openPack, setOpenPack] = useState<string | null>("daily");
  const daily = affirmationOfTheDay();

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(500)}>
        <LinearGradient colors={gradients.affirm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featured}>
          <Text style={styles.featuredLabel}>TODAY · BASIC</Text>
          <Text style={styles.featuredText}>“{daily}”</Text>
          <View style={styles.streakRow}>
            <Ionicons name="flame" size={16} color={colors.apricot} />
            <Text style={styles.streakText}>{dayStreakLine(streak)}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.sectionTitle}>Affirmation packs</Text>
      <View style={{ gap: 14 }}>
        {packs.map((pack, i) => {
          const locked = pack.premium && !isPremium;
          const open = openPack === pack.id && !locked;
          return (
            <Animated.View key={pack.id} entering={FadeInDown.duration(400).delay(i * 60)}>
              <Card soft style={{ padding: 0, overflow: "hidden" }}>
                <Pressable
                  onPress={() => (locked ? router.push("/paywall") : setOpenPack(open ? null : pack.id))}
                  style={styles.packHead}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.packTitleRow}>
                      <Text style={styles.packTitle}>{pack.title}</Text>
                      {pack.premium ? <Tag label="Premium" tone="apricot" /> : <Tag label="Basic" tone="sage" />}
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
                  <Animated.View entering={FadeIn.duration(280)} style={styles.packBody}>
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
            <Text style={styles.unlockText}>Unlock relationship-with-food packs</Text>
          </LinearGradient>
        </Pressable>
      )}
    </ScrollView>
  );
}

function JournalPanel() {
  const router = useRouter();
  const { journalEntries, removeJournalEntry } = useStore();
  const [pack, setPack] = useState<"all" | JournalCategory>("all");

  const filtered = useMemo(
    () => (pack === "all" ? journalPrompts : journalPrompts.filter((p) => p.category === pack)),
    [pack]
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitleTop}>Guided prompts</Text>
      <Text style={styles.hint}>
        From your Emotions, Purpose, Self Discovery, Relationships & Mindfulness packs — all basic.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packChips}
        style={{ marginTop: 14, marginHorizontal: -4 }}
      >
        {journalPacks.map((p) => {
          const active = pack === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setPack(p.id)}
              style={[styles.packChip, active && styles.packChipActive]}
            >
              <Text style={{ fontSize: 13 }}>{p.icon}</Text>
              <Text style={[styles.packChipText, active && styles.packChipTextActive]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ gap: 12, marginTop: 14 }}>
        {filtered.map((p, i) => (
          <Animated.View key={p.id} entering={FadeInDown.duration(350).delay(i * 30)}>
            <Pressable onPress={() => router.push({ pathname: "/journal-write", params: { promptId: p.id } })}>
              <Card soft style={styles.rowCard}>
                <View style={styles.iconBox}>
                  <Text style={{ fontSize: 22 }}>{p.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{p.title}</Text>
                  <Text style={styles.rowSub}>{p.subtitle}</Text>
                </View>
                <Tag label="Basic" tone="sage" />
              </Card>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Your entries</Text>
      {journalEntries.length === 0 ? (
        <Card soft style={styles.empty}>
          <Text style={{ fontSize: 28 }}>📓</Text>
          <Text style={styles.emptyTitle}>No journal entries yet</Text>
          <Text style={styles.emptySub}>Pick a prompt above to begin reflecting.</Text>
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {journalEntries.map((e) => (
            <Pressable
              key={e.id}
              onLongPress={() => removeJournalEntry(e.id)}
              delayLongPress={350}
            >
              <Card soft>
                <Text style={styles.entryTitle}>{e.title}</Text>
                <Text style={styles.entryDate}>
                  {new Date(e.createdAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={styles.entryBody} numberOfLines={4}>
                  {e.body}
                </Text>
              </Card>
            </Pressable>
          ))}
          <Text style={styles.longPressHint}>Long-press an entry to delete it.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function MeditatePanel() {
  const router = useRouter();
  const { meditationLog } = useStore();
  const recent = useMemo(() => meditationLog.slice(0, 5), [meditationLog]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitleTop}>Guided sessions</Text>
      <Text style={styles.hint}>Step-by-step practices — all included in basic.</Text>
      <View style={{ gap: 12, marginTop: 14 }}>
        {meditations.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInDown.duration(350).delay(i * 35)}>
            <Pressable onPress={() => router.push({ pathname: "/meditate-session", params: { id: m.id } })}>
              <Card soft style={styles.rowCard}>
                <View style={styles.iconBox}>
                  <Text style={{ fontSize: 22 }}>{m.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{m.title}</Text>
                  <Text style={styles.rowSub}>{m.subtitle}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <Text style={styles.mins}>{m.minutes} min</Text>
                  <Tag label="Basic" tone="sage" />
                </View>
              </Card>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      {recent.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recently completed</Text>
          <View style={{ gap: 8 }}>
            {recent.map((r) => (
              <View key={r.id} style={styles.recentRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.recentText}>
                  {r.title} · {Math.round(r.durationSec / 60) || 1} min ·{" "}
                  {new Date(r.completedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8 },
  h1: { fontFamily: font.displayBold, fontSize: 30, color: colors.ink },
  sub: { fontFamily: font.body, fontSize: 15, color: colors.textMuted, marginTop: 6 },
  seg: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 4,
    marginTop: 16,
    gap: 4,
  },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: "center" },
  segBtnActive: { backgroundColor: colors.surface, ...shadow.soft },
  segText: { fontFamily: font.semibold, fontSize: 13, color: colors.textMuted },
  segTextActive: { color: colors.ink },

  featured: { borderRadius: radius.xl, padding: 26, ...shadow.card },
  featuredLabel: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 2, color: colors.sageSoft },
  featuredText: { fontFamily: font.displayItalic, fontSize: 24, lineHeight: 34, color: colors.onDark, marginTop: 14 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20 },
  streakText: { fontFamily: font.medium, fontSize: 13, color: colors.onDarkMuted },

  sectionTitleTop: { fontFamily: font.display, fontSize: 20, color: colors.ink },
  sectionTitle: { fontFamily: font.display, fontSize: 20, color: colors.ink, marginTop: 28, marginBottom: 12 },
  hint: { fontFamily: font.body, fontSize: 14, color: colors.textMuted, marginTop: 4 },
  packChips: { gap: 8, paddingHorizontal: 4, paddingVertical: 2 },
  packChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  packChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  packChipText: { fontFamily: font.semibold, fontSize: 12, color: colors.text },
  packChipTextActive: { color: colors.onDark },

  packHead: { flexDirection: "row", alignItems: "center", padding: 18, gap: 12 },
  packTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
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

  rowCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.ink },
  rowSub: { fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  mins: { fontFamily: font.bold, fontSize: 13, color: colors.forest },

  empty: { alignItems: "center", paddingVertical: 28, gap: 8 },
  emptyTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.text },
  emptySub: { fontFamily: font.body, fontSize: 14, color: colors.textMuted, textAlign: "center" },

  entryTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.ink },
  entryDate: { fontFamily: font.medium, fontSize: 12, color: colors.textFaint, marginTop: 4 },
  entryBody: { fontFamily: font.body, fontSize: 14, lineHeight: 21, color: colors.textMuted, marginTop: 10 },
  longPressHint: { fontFamily: font.body, fontSize: 12, color: colors.textFaint, textAlign: "center", marginTop: 8 },

  recentRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  recentText: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted, flex: 1 },
});
