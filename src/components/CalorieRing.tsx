import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors, font } from "../theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  consumed: number;
  target: number;
  size?: number;
  stroke?: number;
};

/** Animated circular calorie budget ring. Fills on mount + when values change. */
export function CalorieRing({ consumed, target, size = 220, stroke = 18 }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const over = consumed > target;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(pct, {
      duration: 1100,
      easing: Easing.out(Easing.cubic),
    });
  }, [pct, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const remaining = Math.max(0, Math.round(target - consumed));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={over ? colors.danger : colors.apricot} />
            <Stop offset="1" stopColor={over ? "#B84545" : colors.apricotDeep} />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceMuted}
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.big}>{remaining.toLocaleString()}</Text>
        <Text style={styles.label}>{over ? "over budget" : "kcal left"}</Text>
        <View style={styles.sub}>
          <Text style={styles.subText}>
            {Math.round(consumed).toLocaleString()} of {target.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: "absolute", alignItems: "center" },
  big: { fontFamily: font.displayBold, fontSize: 46, color: colors.ink, lineHeight: 50 },
  label: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  sub: {
    marginTop: 8,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  subText: { fontFamily: font.medium, fontSize: 12, color: colors.textMuted },
});
