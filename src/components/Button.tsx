import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, font, gradients, radius, shadow } from "../theme";

type Variant = "primary" | "secondary" | "ghost" | "light";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  full?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  icon,
  style,
  full = true,
}: Props) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const press = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.ink : colors.onDark} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              variant === "primary" && { color: colors.ink },
              variant === "secondary" && { color: colors.onDark },
              variant === "ghost" && { color: colors.ink },
              variant === "light" && { color: colors.ink },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Animated.View style={[full && styles.full, aStyle, style]}>
      <Pressable
        onPress={press}
        onPressIn={() => (scale.value = withTiming(0.97, { duration: 90 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
        disabled={disabled || loading}
        style={[full && styles.full, disabled && { opacity: 0.5 }]}
      >
        {variant === "primary" ? (
          <LinearGradient
            colors={gradients.apricot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.base, shadow.soft]}
          >
            {content}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.base,
              variant === "secondary" && styles.secondary,
              variant === "ghost" && styles.ghost,
              variant === "light" && styles.light,
            ]}
          >
            {content}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  full: { width: "100%" },
  base: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  secondary: { backgroundColor: colors.ink },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
  },
  light: { backgroundColor: colors.surface, ...shadow.soft },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { fontFamily: font.semibold, fontSize: 16 },
});
