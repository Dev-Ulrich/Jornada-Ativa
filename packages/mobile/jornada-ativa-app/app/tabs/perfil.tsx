import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff" }}>Minha conta</Text>
    </SafeAreaView>
  );
}
