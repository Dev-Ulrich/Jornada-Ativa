// ...existing code...
import { StyleSheet } from "react-native";
import { colors, spacing, common } from "../theme";

export const JA_ORANGE = colors.accent;

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  form: {
    width: "100%",
    maxWidth: 360,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 8,
    backgroundColor: colors.inputBg,
  },
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    backgroundColor: colors.accent,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "800",
    letterSpacing: 1,
  },
  signupText: {
    color: colors.muted,
    marginTop: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  link: {
    color: colors.accent,
    fontWeight: "700",
  },
});
// ...existing code...