// ...existing code...
import { StyleSheet } from "react-native";
import { colors, spacing, common } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.background, // was "#0d0f14"
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text, // was "#fff"
    marginBottom: 8,
  },

  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.cardAlt, // was "#1a1f2b"
  },
  tabActive: {
    backgroundColor: colors.accent, // was "#ff8633"
  },
  tabText: {
    color: colors.muted, // was "#c9cbd1"
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.card, // was "#0d0f14"
  },

  searchBox: { marginBottom: 8 },
  input: {
    ...common.input,
    height: 44,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.cardAlt, // was "#1a1f2b"
    borderWidth: 1,
    borderColor: colors.border, // was "#263047"
  },
  chipActive: {
    backgroundColor: colors.accent, // was "#ff8633"
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.muted, // was "#c9cbd1"
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.card, // was "#0d0f14"
    fontWeight: "700",
  },

  list: {
    paddingVertical: 8,
    paddingBottom: 24,
    gap: 10,
  },

  card: {
    backgroundColor: colors.card, // was "#111624"
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border, // was "#1f2740"
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: 0.2,
  },

  cardMeta: {
    color: colors.meta, // was "#aab0bf"
    fontSize: 13,
    marginBottom: 10,
  },

  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  badge: {
    backgroundColor: colors.cardAlt, // was "#1a2033"
    borderColor: colors.border, // was "#2a3557"
    borderWidth: 1,
    color: colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
  },

  warnBox: {
    backgroundColor: "#3a1b1b",
    borderColor: "#a84e4e",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  warnText: {
    color: "#ffd6d6",
    fontSize: 13,
    lineHeight: 18,
  },
  okText: {
    color: "#86f7a6",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },

  // botões
  startButton: {
    marginTop: 4,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  startButtonText: {
    color: colors.card,
    fontWeight: "800",
  },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { color: colors.muted, fontWeight: "600" },
  value: { color: colors.text },

  linkButton: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  linkButtonText: {
    color: colors.card,
    fontWeight: "800",
  },

  error: { color: "#ffb4b4", textAlign: "center", marginTop: 16 },
  empty: { color: "#95a0b8", textAlign: "center", marginTop: 16 },
});
// ...existing code...