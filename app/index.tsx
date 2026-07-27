import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useStore } from "../src/state/store";
import { colors } from "../src/theme";

/** Routes users to onboarding or the main app once state is hydrated. */
export default function Index() {
  const { hydrated, onboarded } = useStore();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.ink }}>
        <ActivityIndicator color={colors.apricot} />
      </View>
    );
  }

  return <Redirect href={onboarded ? "/(tabs)" : "/onboarding"} />;
}
