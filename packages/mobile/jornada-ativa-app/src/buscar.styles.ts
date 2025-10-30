import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#0d0f14",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
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
    backgroundColor: "#1a1f2b",
  },
  tabActive: {
    backgroundColor: "#ff8633",
  },
  tabText: {
    color: "#c9cbd1",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#0d0f14",
  },

  searchBox: { marginBottom: 8 },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#131826",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#232a3b",
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
    backgroundColor: "#1a1f2b",
    borderWidth: 1,
    borderColor: "#263047",
  },
  chipActive: {
    backgroundColor: "#ff8633",
    borderColor: "#ff8633",
  },
  chipText: {
    color: "#c9cbd1",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#0d0f14",
    fontWeight: "700",
  },

  list: {
    paddingVertical: 8,
    paddingBottom: 24,
    gap: 10,
  },

  card: {
    backgroundColor: "#111624",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1f2740",
  },
  cardTitle: {
  color: "#FFFFFF",   // branco puro
  fontSize: 22,       // maior (pode testar 24 se quiser ainda mais)
  fontWeight: "900",  // bem forte
  marginBottom: 6,
  letterSpacing: 0.2, // leve destaque
},


  cardMeta: {
    color: "#aab0bf",
    fontSize: 13,
    marginBottom: 10,
  },

  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  badge: {
    backgroundColor: "#1a2033",
    borderColor: "#2a3557",
    borderWidth: 1,
    color: "#c7d0e6",
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
    backgroundColor: "#ff8633",
  },
  startButtonText: {
    color: "#0d0f14",
    fontWeight: "800",
  },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { color: "#9aa3b2", fontWeight: "600" },
  value: { color: "#e4e8f0" },

  linkButton: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#ff8633",
  },
  linkButtonText: {
    color: "#0d0f14",
    fontWeight: "800",
  },

  error: { color: "#ffb4b4", textAlign: "center", marginTop: 16 },
  empty: { color: "#95a0b8", textAlign: "center", marginTop: 16 },
});
