// src/perfil.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // base
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  // header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderRadius: 14,
    margin: 16,
    padding: 14,
    gap: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#ff7a1a",
  },
  // <- usado no perfil.tsx
  nome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sub: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 8,
  },

  // badges no header
  // <- usado no perfil.tsx
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  // <- usado no perfil.tsx
  tag: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  // <- usado no perfil.tsx
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
    backgroundColor: "#2a2a2a",
  },
  tabActive: {
    backgroundColor: "#ff7a1a20",
    borderColor: "#ff7a1a",
    borderWidth: 1,
  },
  tabText: {
    color: "#ccc",
    fontSize: 13.5,
  },
  tabTextActive: {
    color: "#ff7a1a",
    fontWeight: "600",
  },

  // seção/card
  sectionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#1b1b1b",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 24,
  },
  // <- usado no perfil.tsx
  cardRow: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14.5,
    fontWeight: "500",
  },
  cardMeta: {
    color: "#aaa",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 6,
  },

  // formulário (Configurações)
  label: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 4,
    marginHorizontal: 4,
  },
  input: {
    backgroundColor: "#222", // cinza mais claro que o fundo
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#2f2f2f",
  },

  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  pill: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  pillText: {
    color: "#ccc",
    fontSize: 13,
  },
  pillActive: {
    backgroundColor: "#ff7a1a",
  },
  pillTextActive: {
    color: "#fff",
  },

  // botão salvar
  saveBtn: {
    marginTop: 14,
    backgroundColor: "#ff7a1a",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
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
