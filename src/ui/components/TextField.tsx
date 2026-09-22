import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors, radius, spacing, typography } from "../theme";

export interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  keyboardType?: TextInputProps["keyboardType"];
  testID?: string;
}

export function TextField({
  label,
  value,
  onChangeText,
  error,
  hint,
  placeholder,
  multiline = false,
  autoCapitalize = "sentences",
  keyboardType,
  testID,
}: TextFieldProps) {
  const hasError = error !== undefined && error.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[styles.input, multiline ? styles.inputMultiline : null, hasError ? styles.inputError : null]}
      />
      {hasError ? <Text style={styles.error}>{error}</Text> : null}
      {!hasError && hint !== undefined ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.label,
    color: colors.textMuted,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontSize: typography.label,
    color: colors.danger,
  },
  hint: {
    fontSize: typography.label,
    color: colors.textMuted,
  },
});
