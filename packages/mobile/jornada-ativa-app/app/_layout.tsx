// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Registra as rotas principais */}
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/cadastro" />
      <Stack.Screen name="auth/escolherNivel" />
      <Stack.Screen name="tabs" />
    </Stack>
  );
}
