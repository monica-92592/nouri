import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, font, radius } from "../theme";

export function Chip({
  label,
  active,
  onPress,
  emoji,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  emoji?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
    >
      {emoji ? <Text style={{ fontSize: 15 }}>{emoji}</Text> : null}
      <Text style={[styles.chipText, active && { color: colors.onDark }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Glyph({ char, tint }: { char: string; tint?: string }) {
  return (
    <View style={[styles.glyph, tint ? { backgroundColor: tint } : null]}>
      <Text style={{ fontSize: 20 }}>{char}</Text>
    </View>
  );
}

export function Tag({ label, tone = "sage" }: { label: string; tone?: "sage" | "apricot" | "berry" | "muted" }) {
  const bg =
    tone === "apricot"
      ? "rgba(244,162,89,0.16)"
      : tone === "berry"
      ? "rgba(200,107,123,0.16)"
      : tone === "muted"
      ? colors.surfaceMuted
      : "rgba(127,191,163,0.18)";
  const fg =
    tone === "apricot"
      ? colors.apricotDeep
      : tone === "berry"
      ? colors.berry
      : tone === "muted"
      ? colors.textMuted
      : colors.forest;
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Text style={[styles.tagText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.sectionRow, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  chipIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  chipActive: { backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.ink },
  chipText: { fontFamily: font.medium, fontSize: 14, color: colors.text },
  glyph: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  tagText: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 0.3 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: font.display, fontSize: 20, color: colors.ink },
  sectionAction: { fontFamily: font.semibold, fontSize: 13, color: colors.forest },
});
