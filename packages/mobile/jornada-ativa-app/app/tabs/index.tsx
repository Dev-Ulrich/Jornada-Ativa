import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function HomeTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontSize: 18 }}>Bem-vindo à Jornada Ativa 🏃</Text>
    </SafeAreaView>
  );
}
