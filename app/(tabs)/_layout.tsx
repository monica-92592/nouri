import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font, gradients, shadow } from "../../src/theme";

type TabDef = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  center?: boolean;
};

const TABS: TabDef[] = [
  { name: "index", label: "Today", icon: "sunny-outline" },
  { name: "diary", label: "Diary", icon: "book-outline" },
  { name: "scan", label: "Scan", icon: "camera", center: true },
  { name: "coach", label: "Coach", icon: "compass-outline" },
  { name: "affirmations", label: "Glow", icon: "sparkles-outline" },
];

function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <BlurView intensity={Platform.OS === "ios" ? 40 : 0} tint="light" style={styles.bar}>
        {TABS.map((tab, i) => {
          const focused = state.index === i;
          const onPress = () => {
            Haptics.selectionAsync().catch(() => {});
            const event = navigation.emit({ type: "tabPress", target: state.routes[i].key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(tab.name);
          };

          if (tab.center) {
            return (
              <Pressable key={tab.name} onPress={onPress} style={styles.centerBtnWrap}>
                <LinearGradient colors={gradients.apricot} style={styles.centerBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Ionicons name={tab.icon} size={26} color={colors.ink} />
                </LinearGradient>
              </Pressable>
            );
          }

          return (
            <Pressable key={tab.name} onPress={onPress} style={styles.tab}>
              <Ionicons name={tab.icon} size={22} color={focused ? colors.ink : colors.textFaint} />
              <Text style={[styles.tabLabel, { color: focused ? colors.ink : colors.textFaint }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Platform.OS === "ios" ? "rgba(255,255,255,0.75)" : colors.surface,
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...shadow.card,
  },
  tab: { flex: 1, alignItems: "center", gap: 3 },
  tabLabel: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 0.2 },
  centerBtnWrap: { flex: 1, alignItems: "center" },
  centerBtn: {
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -34,
    ...shadow.lift,
  },
});
