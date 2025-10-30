// src/theme.ts
import { TextStyle, ViewStyle } from "react-native";

export const colors = {
  background: "#121212",   // container principal
  surface: "#1c1c1c",      // header / seções principais
  surfaceElevated: "#1e1e1e", // cards mais elevados
  card: "#1b1b1b",         // base dos cards
  cardAlt: "#2a2a2a",      // linhas / pills / tags
  inputBg: "#222222",      // campos de input
  accent: "#ff7a1a",       // laranja principal
  accentTint: "rgba(255,122,26,0.12)", // variação translúcida
  onAccent: "#0f0f0f",     // texto sobre o botão/acento
  text: "#ffffff",         // texto principal
  muted: "#ccc",           // texto secundário
  meta: "#aaa",            // texto descritivo
  border: "#2f2f2f",       // bordas sutis
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
};

export const common = {
  safeArea: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1, backgroundColor: colors.background, paddingBottom: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 24,
  } as ViewStyle,
  pill: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  } as ViewStyle,
  tag: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  } as ViewStyle,
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  } as TextStyle & ViewStyle,
};

export default { colors, spacing, common };
