// ...existing code...
import { StyleSheet } from "react-native";

import { colors, spacing, common } from "./theme";

export const styles = StyleSheet.create({
  safeArea: {
    ...common.safeArea,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  brand: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  brandImage: {
    width: "100%",
    height: "100%",
  },
  brandPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  brandInitials: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  brandLevelBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardAlt,
  },
  brandLevelText: {
    color: colors.card, // contraste com o laranja
    fontSize: 10,
    fontWeight: "700",
  },
  brandName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  smallMuted: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  greetingSection: {
    marginTop: 18,
  },
  greetingTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
  },
  wave: {
    fontSize: 24,
  },
  greetingSubtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 6,
  },
  card: {
    ...common.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  cardMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 12,
  },
  startButtonText: {
    color: colors.card,
    fontWeight: "700",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  activityDay: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  ctaButton: {
    marginTop: 22,
    backgroundColor: colors.accent,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ctaButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "700",
  },
});
// ...existing code...