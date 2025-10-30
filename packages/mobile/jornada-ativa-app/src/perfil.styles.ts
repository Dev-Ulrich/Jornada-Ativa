import { StyleSheet } from "react-native";
// ...existing code...
import { colors, spacing, common } from "./theme";

export const styles = StyleSheet.create({
  // base
  container: {
    flex: 1,
    backgroundColor: colors.background, // was "#121212"
  },

  // header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface, // was "#1c1c1c"
    borderRadius: 14,
    margin: spacing.md,
    padding: spacing.md,
    gap: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: colors.accent, // was "#ff7a1a"
  },
  nome: {
    color: colors.text, // was "#fff"
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sub: {
    color: colors.muted, // was "#ccc"
    fontSize: 13,
    marginBottom: 8,
  },

  // badges no header
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    ...common.tag, // was "#2a2a2a"
  },
  tagText: {
    color: "#d0d0d0",
    fontSize: 12.5,
  },

  // abas
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.cardAlt, // was "#2a2a2a"
  },
  tabActive: {
    backgroundColor: colors.accentTint, // was "#ff7a1a20"
    borderColor: colors.accent,
    borderWidth: 1,
  },
  tabText: {
    color: colors.muted, // was "#ccc"
    fontSize: 13.5,
  },
  tabTextActive: {
    color: colors.accent,
    fontWeight: "600",
  },

  // seção/card
  sectionTitle: {
    color: colors.text, // was "#fff"
    fontSize: 17,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
  },
  card: {
    ...common.card, // was "#1b1b1b" + layout
  },
  cardRow: {
    backgroundColor: colors.cardAlt, // was "#2a2a2a"
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  cardTitle: {
    color: colors.text, // was "#fff"
    fontSize: 14.5,
    fontWeight: "500",
  },
  cardMeta: {
    color: colors.meta, // was "#aaa"
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 6,
  },

  // formulário (Configurações)
  label: {
    color: colors.muted, // was "#ccc"
    fontSize: 13,
    marginBottom: 4,
    marginHorizontal: 4,
  },
  input: {
    ...common.input, // used unified input style (was background "#222", border "#2f2f2f")
  },

  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  pill: {
    ...common.pill, // was "#2a2a2a"
  },
  pillText: {
    color: colors.muted, // was "#ccc"
    fontSize: 13,
  },
  pillActive: {
    backgroundColor: colors.accent,
  },
  pillTextActive: {
    color: colors.text,
  },

  // botão salvar
  saveBtn: {
    marginTop: 14,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  helper: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginTop: 6,
  },
});