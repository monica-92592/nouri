import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { colors, gradients } from "../theme";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  variant?: "mist" | "brand" | "plain";
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  padded?: boolean;
};

/** Consistent screen wrapper with an atmospheric background (never flat). */
export function Screen({
  children,
  scroll = false,
  variant = "mist",
  edges = ["top"],
  contentStyle,
  padded = true,
}: Props) {
  const bg =
    variant === "brand"
      ? gradients.brand
      : variant === "mist"
      ? gradients.mist
      : null;

  const Inner = (
    <SafeAreaView
      style={styles.safe}
      edges={edges}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            padded && styles.padded,
            { paddingBottom: 120 },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padded && styles.padded, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );

  if (!bg) {
    return <View style={[styles.flex, { backgroundColor: colors.bg }]}>{Inner}</View>;
  }

  return (
    <LinearGradient colors={bg} style={styles.flex} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {Inner}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  padded: { paddingHorizontal: 20 },
});
