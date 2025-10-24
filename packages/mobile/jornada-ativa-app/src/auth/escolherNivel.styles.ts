import { StyleSheet } from "react-native";

const COLORS = {
  bg: "#0f0f0f",
  card: "#171717",
  muted: "#9aa0a6",
  text: "#eaeaea",
  brand: "#ff8633",
  brand700: "#ff7a1e",
  stroke: "#2a2a2a",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardSelected: {
    borderColor: COLORS.brand,
    shadowColor: COLORS.brand,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.brand,
  },
  desc: {
    color: COLORS.text,
    opacity: 0.9,
    fontSize: 14,
    marginBottom: 6,
  },
  examples: {
    color: "#c9c9c9",
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.brand,
    borderRadius: 10,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#111",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
