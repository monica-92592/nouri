import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/Card";
import { Emoji, Tag } from "../../src/components/bits";
import {
  dailyAffirmationDetail,
  dayStreakLine,
  packs,
} from "../../src/lib/affirmations";
import {
  groupJournalByCategory,
  groupMeditationsByCategory,
  journalPacks,
  journalPrompts,
  meditationPacks,
  meditations,
  type JournalCategory,
  type MeditationCategory,
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
          <Text style={styles.sub}>Affirmations, journaling & meditation — all free with basic.</Text>
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
  const { streak } = useStore();
  const [openPack, setOpenPack] = useState<string | null>("daily");
  const daily = dailyAffirmationDetail();

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(500)}>
        <LinearGradient colors={gradients.affirm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featured}>
          <Text style={styles.featuredLabel}>TODAY · FREE</Text>
          <Text style={styles.featuredPack}>{daily.packTitle}</Text>
          <Text style={styles.featuredText}>“{daily.text}”</Text>
          <View style={styles.streakRow}>
            <Ionicons name="flame" size={16} color={colors.apricot} />
            <Text style={styles.streakText}>{dayStreakLine(streak)}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.sectionTitle}>All affirmation packs</Text>
      <Text style={styles.hint}>Every pack is included in basic — browse anytime.</Text>
      <View style={{ gap: 14, marginTop: 12 }}>
        {packs.map((pack, i) => {
          const open = openPack === pack.id;
          return (
            <Animated.View key={pack.id} entering={FadeInDown.duration(400).delay(i * 60)}>
              <Card soft style={{ padding: 0, overflow: "hidden" }}>
                <Pressable onPress={() => setOpenPack(open ? null : pack.id)} style={styles.packHead}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.packTitleRow}>
                      <Text style={styles.packTitle}>{pack.title}</Text>
                      <Tag label="Basic" tone="sage" />
                    </View>
                    <Text style={styles.packSub}>{pack.subtitle}</Text>
                  </View>
                  <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.textFaint} />
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
    </ScrollView>
  );
}

function JournalPanel() {
  const router = useRouter();
  const { journalEntries, removeJournalEntry } = useStore();
  const [pack, setPack] = useState<"all" | JournalCategory>("all");

  const list = useMemo(() => {
    const base = pack === "all" ? journalPrompts : journalPrompts.filter((p) => p.category === pack);
    return base.filter((p) => p.id !== "gratitude-heart");
  }, [pack]);

  const sections = useMemo(() => {
    if (pack !== "all") {
      const meta = journalPacks.find((p) => p.id === pack)!;
      return [{ category: pack, label: meta.label, icon: meta.icon, items: list }];
    }
    return groupJournalByCategory(list);
  }, [pack, list]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitleTop}>Journal prompts</Text>
      <Text style={styles.hint}>Organized by theme — all included in basic.</Text>

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
              <Emoji char={p.icon} style={{ fontSize: 13 }} />
              <Text style={[styles.packChipText, active && styles.packChipTextActive]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {sections.map((section) => (
        <View key={section.category} style={styles.groupBlock}>
          <View style={styles.groupHead}>
            <Emoji char={section.icon} style={{ fontSize: 16 }} />
            <Text style={styles.groupTitle}>{section.label}</Text>
            <Text style={styles.groupCount}>{section.items.length}</Text>
          </View>
          <View style={{ gap: 10 }}>
            {section.items.map((p, i) => (
              <Animated.View key={p.id} entering={FadeInDown.duration(320).delay(i * 25)}>
                <Pressable onPress={() => router.push({ pathname: "/journal-write", params: { promptId: p.id } })}>
                  <Card soft style={styles.rowCard}>
                    <View style={styles.iconBox}>
                      <Emoji char={p.icon} style={{ fontSize: 22 }} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{p.title}</Text>
                      <Text style={styles.rowSub}>{p.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
                  </Card>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>
      ))}

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
            <Pressable key={e.id} onLongPress={() => removeJournalEntry(e.id)} delayLongPress={350}>
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
  const [cat, setCat] = useState<"all" | MeditationCategory>("all");
  const recent = useMemo(() => meditationLog.slice(0, 5), [meditationLog]);

  const list = useMemo(
    () => (cat === "all" ? meditations : meditations.filter((m) => m.category === cat)),
    [cat]
  );

  const sections = useMemo(() => {
    if (cat !== "all") {
      const meta = meditationPacks.find((p) => p.id === cat)!;
      return [
        {
          category: cat,
          label: meta.label,
          icon: meta.icon,
          items: [...list].sort((a, b) => a.minutes - b.minutes),
        },
      ];
    }
    return groupMeditationsByCategory(list);
  }, [cat, list]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitleTop}>Guided meditations</Text>
      <Text style={styles.hint}>Grouped by focus — sorted shortest to longest. All free.</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packChips}
        style={{ marginTop: 14, marginHorizontal: -4 }}
      >
        {meditationPacks.map((p) => {
          const active = cat === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setCat(p.id)}
              style={[styles.packChip, active && styles.packChipActive]}
            >
              <Emoji char={p.icon} style={{ fontSize: 13 }} />
              <Text style={[styles.packChipText, active && styles.packChipTextActive]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {sections.map((section) => (
        <View key={section.category} style={styles.groupBlock}>
          <View style={styles.groupHead}>
            <Emoji char={section.icon} style={{ fontSize: 16 }} />
            <Text style={styles.groupTitle}>{section.label}</Text>
            <Text style={styles.groupCount}>{section.items.length}</Text>
          </View>
          <View style={{ gap: 10 }}>
            {section.items.map((m, i) => (
              <Animated.View key={m.id} entering={FadeInDown.duration(320).delay(i * 25)}>
                <Pressable onPress={() => router.push({ pathname: "/meditate-session", params: { id: m.id } })}>
                  <Card soft style={styles.rowCard}>
                    <View style={styles.iconBox}>
                      <Emoji char={m.icon} style={{ fontSize: 22 }} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{m.title}</Text>
                      <Text style={styles.rowSub}>{m.subtitle}</Text>
                    </View>
                    <Text style={styles.mins}>{m.minutes} min</Text>
                  </Card>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>
      ))}

      {recent.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recently completed</Text>
          <View style={{ gap: 8 }}>
            {recent.map((r) => (
              <View key={r.id} style={styles.recentRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.forest} />
                <Text style={styles.recentText} numberOfLines={1}>
                  {r.title}
                </Text>
                <Text style={styles.recentMeta}>
                  {new Date(r.completedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
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
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  h1: { fontFamily: font.displayBold, fontSize: 30, color: colors.ink },
  sub: { fontFamily: font.body, fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 14 },
  seg: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: "center" },
  segBtnActive: { backgroundColor: colors.surface, ...shadow.soft },
  segText: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted },
  segTextActive: { fontFamily: font.semibold, color: colors.ink },

  featured: { borderRadius: radius.lg, padding: 22, ...shadow.soft },
  featuredLabel: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1.5, color: colors.sageSoft },
  featuredPack: { fontFamily: font.medium, fontSize: 13, color: colors.onDarkMuted, marginTop: 8 },
  featuredText: { fontFamily: font.displayItalic, fontSize: 22, lineHeight: 30, color: colors.onDark, marginTop: 6 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20 },
  streakText: { fontFamily: font.medium, fontSize: 13, color: colors.onDarkMuted },

  sectionTitleTop: { fontFamily: font.display, fontSize: 22, color: colors.ink },
  sectionTitle: { fontFamily: font.display, fontSize: 20, color: colors.ink, marginTop: 28, marginBottom: 12 },
  hint: { fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: 4 },

  packChips: { gap: 8, paddingHorizontal: 4, paddingVertical: 2 },
  packChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  packChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  packChipText: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  packChipTextActive: { color: colors.onDark },

  packHead: { flexDirection: "row", alignItems: "center", padding: 18, gap: 12 },
  packTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  packTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.ink },
  packSub: { fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: 3 },
  packBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 16,
  },
  affirmItem: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  affirmBullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.sage, marginTop: 7 },
  affirmItemText: { fontFamily: font.body, fontSize: 15, lineHeight: 22, color: colors.text, flex: 1 },

  groupBlock: { marginTop: 22 },
  groupHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  groupTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.ink, flex: 1 },
  groupCount: { fontFamily: font.medium, fontSize: 12, color: colors.textFaint },

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
  recentText: { flex: 1, fontFamily: font.medium, fontSize: 14, color: colors.text },
  recentMeta: { fontFamily: font.body, fontSize: 12, color: colors.textFaint },
});
