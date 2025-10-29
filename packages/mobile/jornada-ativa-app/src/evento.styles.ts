import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },
  header: {
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: "#181818",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2a2a2a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  container: { flex: 1, padding: 12, gap: 12 },

  calendar: {
    borderRadius: 14,
    overflow: "hidden",
    paddingBottom: 6,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 6 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "#bfbfbf", fontSize: 12 },

  listaContainer: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    borderRadius: 14,
    padding: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  tituloLista: { color: "#eaeaea", fontSize: 16, fontWeight: "700", marginBottom: 8 },

  cardEvento: {
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#303030",
    overflow: "hidden",
  },
  statusBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  cardRow: { flexDirection: "row", gap: 12 },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: "#333" },
  thumbFallback: { alignItems: "center", justifyContent: "center" },
  nomeEvento: { color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  infoEvento: { color: "#cfcfcf", fontSize: 13 },
  metaEvento: { color: "#b5b5b5", fontSize: 12, marginTop: 6 },
  linkEvento: { color: "#7ab8ff", fontSize: 12, marginTop: 2 },

  semEvento: { color: "#9a9a9a", fontSize: 14, textAlign: "center", paddingVertical: 24 },
  loadingBox: { paddingVertical: 24, alignItems: "center", gap: 8 },
  loadingTxt: { color: "#bdbdbd", fontSize: 13 },
  errorTxt: { color: "#ff6b6b", fontSize: 14, textAlign: "center", paddingVertical: 16 },
});
