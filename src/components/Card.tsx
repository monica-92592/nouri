import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, shadow } from "../theme";

export function Card({
  children,
  style,
  soft,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  soft?: boolean;
}) {
  return (
    <View style={[styles.card, soft ? shadow.soft : shadow.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
  },
});
