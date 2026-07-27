import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, font } from "../theme";

type Props = {
  label: string;
  value: number;
  target: number;
  color: string;
  unit?: string;
};

export function MacroBar({ label, value, target, color, unit = "g" }: Props) {
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const w = useSharedValue(0);

  useEffect(() => {
    w.value = withTiming(pct, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [pct, w]);

  const fill = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {Math.round(value)}
          <Text style={styles.target}>
            {" "}
            / {Math.round(target)}
            {unit}
          </Text>
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { backgroundColor: color }, fill]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 6 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  label: { fontFamily: font.semibold, fontSize: 13, color: colors.text },
  value: { fontFamily: font.semibold, fontSize: 13, color: colors.text },
  target: { fontFamily: font.body, fontSize: 12, color: colors.textFaint },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 999 },
});
