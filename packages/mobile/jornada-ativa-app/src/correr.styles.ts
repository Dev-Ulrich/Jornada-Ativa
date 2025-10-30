// src/correr.styles.ts
import { StyleSheet } from "react-native";

// Export default ANÔNIMO. Não importe `colors` aqui para evitar duplicidade.
// O componente injeta o objeto `colors`.
export default (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    topbar: {
      position: "absolute",
      top: 12,
      left: 12,
      right: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      borderRadius: 12,
      backgroundColor: "#0f1320aa",
      borderWidth: 1,
      borderColor: colors.border,
    },
    pill: {
      backgroundColor: colors.cardAlt,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pillText: { color: colors.muted, fontSize: 12 },

    panel: {
      position: "absolute",
      left: 12,
      right: 12,
      bottom: 12,
      padding: 14,
      borderRadius: 18,
      backgroundColor: "#161922e6",
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricsRow: {
      flexDirection: "row",
      gap: 10 as any,
    },
    metricBox: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricLabel: { color: colors.meta, fontSize: 12 },
    metricValue: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
    },

    trainCard: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10 as any,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 12,
    },
    trainTitle: { color: colors.text, fontWeight: "700" },
    trainMeta: { color: colors.meta, fontSize: 12, marginTop: 2 },

    actionsRow: {
      marginTop: 12,
      flexDirection: "row",
      gap: 10 as any,
    },

    // botões
    btnPrimary: {
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 12,
      elevation: 4,
    },
    btnPrimaryText: { color: "#1b120b", fontWeight: "700" },
    btnGhost: {
      backgroundColor: colors.inputBg,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    btnGhostText: { color: colors.text, fontWeight: "700" },
  });
