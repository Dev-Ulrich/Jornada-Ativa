import { StyleSheet } from "react-native";

export const JA_ORANGE = "#ff8633";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: { width: 200, height: 200, marginBottom: 8 },
  form: { width: "100%", maxWidth: 360 },
  label: { color: "#fff", fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 10 },
  input: {
    height: 48,
    paddingHorizontal: 14,
    color: "#fff",
    borderWidth: 1.5,
    borderColor: JA_ORANGE,
    borderRadius: 8,
    backgroundColor: "#0a0a0a",
  },
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    backgroundColor: JA_ORANGE,
  },
  buttonDisabled: { opacity: 2 },
  buttonText: { color: "#fff", fontWeight: "800", letterSpacing: 1 },
  signupText: { color: "#eaeaea", marginTop: 24, fontWeight: "700", textAlign: "center" },
  link: { color: JA_ORANGE, fontWeight: "700" },
});
