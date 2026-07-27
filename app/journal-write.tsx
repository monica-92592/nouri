import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/Button";
import { getJournalPrompt } from "../src/lib/wellness";
import { useStore } from "../src/state/store";
import { colors, font, radius } from "../src/theme";

export default function JournalWrite() {
  const router = useRouter();
  const { promptId } = useLocalSearchParams<{ promptId: string }>();
  const prompt = useMemo(() => getJournalPrompt(promptId ?? "free") ?? getJournalPrompt("free")!, [promptId]);
  const { addJournalEntry } = useStore();

  const [answers, setAnswers] = useState<string[]>(() => prompt.prompts.map(() => ""));
  const [freeBody, setFreeBody] = useState("");

  const composedBody = useMemo(() => {
    if (prompt.prompts.length === 0) return freeBody.trim();
    return prompt.prompts
      .map((q, i) => {
        const a = answers[i]?.trim();
        return a ? `${q}\n${a}` : null;
      })
      .filter(Boolean)
      .join("\n\n");
  }, [prompt, answers, freeBody]);

  const save = () => {
    if (!composedBody) {
      Alert.alert("Add a few words", "Write something before saving your entry.");
      return;
    }
    addJournalEntry({
      promptId: prompt.id,
      title: prompt.title,
      body: composedBody,
      answers: prompt.prompts.length ? answers : undefined,
    });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.top}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
              <Ionicons name="chevron-back" size={22} color={colors.ink} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>JOURNAL · BASIC</Text>
              <Text style={styles.title}>{prompt.title}</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sub}>{prompt.subtitle}</Text>

            {prompt.prompts.length === 0 ? (
              <TextInput
                value={freeBody}
                onChangeText={setFreeBody}
                placeholder="Write freely…"
                placeholderTextColor={colors.textFaint}
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.freeInput]}
              />
            ) : (
              <View style={{ gap: 18, marginTop: 8 }}>
                {prompt.prompts.map((q, i) => (
                  <View key={i}>
                    <Text style={styles.q}>{q}</Text>
                    <TextInput
                      value={answers[i]}
                      onChangeText={(t) =>
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[i] = t;
                          return next;
                        })
                      }
                      placeholder="Your reflection…"
                      placeholderTextColor={colors.textFaint}
                      multiline
                      textAlignVertical="top"
                      style={styles.input}
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Save entry" onPress={save} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 4 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  kicker: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.forest },
  title: { fontFamily: font.displayBold, fontSize: 24, color: colors.ink, marginTop: 2 },
  sub: { fontFamily: font.body, fontSize: 15, color: colors.textMuted, marginBottom: 12 },
  q: { fontFamily: font.semibold, fontSize: 15, color: colors.ink, marginBottom: 8, lineHeight: 22 },
  input: {
    minHeight: 88,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  freeInput: { minHeight: 280, marginTop: 8 },
  footer: { padding: 20, paddingTop: 8 },
});
