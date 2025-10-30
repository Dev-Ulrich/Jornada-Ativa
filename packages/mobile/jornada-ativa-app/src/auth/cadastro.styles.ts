import { StyleSheet, Platform } from "react-native";
import { colors, common, spacing } from "../theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },

  label: { color: colors.text, marginBottom: 6, marginTop: 14, fontSize: 13 },

  input: {
    ...common.input,
    borderColor: colors.accent,
    borderWidth: 1,
    minHeight: 44,
  },

  // wrapper keeps same visual as inputs and gives room for the icon
  pickerWrapper: {
    ...common.input,
    height: 48,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingRight: 44, // espaço para o ícone do dropdown
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.inputBg,
    alignItems: "center",
  },

  // Ajustes para evitar corte do texto no Android e iOS
  picker: {
    color: colors.text,
    height: 48,
    minHeight: 48,
    width: "100%",
    fontSize: 15,
    lineHeight: 48,
    textAlignVertical: "center",
    includeFontPadding: true, // evitar corte em algumas fontes/Android
    paddingLeft: 14, // evita cortar início do texto
    paddingRight: 8,
    overflow: "hidden",
    ...Platform.select({
      android: {
        // garantir que o texto fique alinhado verticalmente em Android nativo
        paddingVertical: 0,
      },
      ios: {
        // iOS tende a adicionar padding por padrão, reduzir um pouco
        paddingVertical: 6,
      },
    }),
  },

  fileBox: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  fileBoxText: { color: colors.text, fontSize: 13 },

  preview: { width: "100%", height: 140, borderRadius: 8 },

  button: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  buttonText: { color: colors.card, fontWeight: "700", letterSpacing: 0.6 },
});