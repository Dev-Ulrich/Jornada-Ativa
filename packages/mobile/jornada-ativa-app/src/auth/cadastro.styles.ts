import { StyleSheet } from "react-native";

const COLORS = {
  bg: "#0f0f0f",
  card: "#141414",
  text: "#eaeaea",
  brand: "#ff8633",
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16 },

  label: { color: COLORS.text, marginBottom: 6, marginTop: 14, fontSize: 13 },

  input: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.brand,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    color: COLORS.text,
  },

  // <<< Ajustado para não cortar no Android >>>
  pickerWrapper: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.brand,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 4, // dá espaço pro ícone do dropdown
  },
  picker: {
    color: COLORS.text,
    minHeight: 48,
    width: "100%",
  },

  fileBox: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.brand,
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  fileBoxText: { color: COLORS.text, fontSize: 13 },

  preview: { width: "100%", height: 160, borderRadius: 8 },

  button: {
    backgroundColor: COLORS.brand,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  buttonText: { color: "#0f0f0f", fontWeight: "700", letterSpacing: 0.6 },
});
