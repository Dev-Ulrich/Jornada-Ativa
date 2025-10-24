// app/index.tsx
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { clearToken, getToken } from "../lib/token"; // <- usa o helper

const logo = require("../assets/images/ja-logo.png");



export default function LoadingGate() {
  useEffect(() => {

    
    
    let didNavigate = false;


    async function boot() {
      try {
        const token = await getToken();             
        await new Promise(r => setTimeout(r, 600));  // estética

        didNavigate = true;
        router.replace(token ? "/tabs" : "/auth/login");
      } catch {
        didNavigate = true;
        router.replace("/auth/login");
      } finally {
        await SplashScreen.hideAsync().catch(() => {});
      }
    }


    // fallback: se nada acontecer em 4s, força login
    const t = setTimeout(async () => {
      if (!didNavigate) {
        router.replace("/auth/login");
        await SplashScreen.hideAsync().catch(() => {});
      }
    }, 4000);

    boot();
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
      <Image source={logo} style={{ width: 160, height: 160, marginBottom: 16 }} resizeMode="contain" />
      <ActivityIndicator size="large" color="#ff8633" />
      <Text style={{ color: "#fff", marginTop: 12, opacity: 0.8 }}>carregando...</Text>
    </View>
  );
}
