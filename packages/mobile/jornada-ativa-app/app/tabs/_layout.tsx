// ...existing code...
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React, { useRef } from "react";
import { Dimensions, PanResponder, StyleSheet, View } from "react-native";
import { colors } from "../../src/theme"; // ...existing code...

const TAB_PATHS = ["/tabs/home", "/tabs/buscar", "/tabs/correr", "/tabs/perfil"] as const; // literal tuple
type TabPath = typeof TAB_PATHS[number];

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { width } = Dimensions.get("window");

  // índice atual baseado no pathname
  const idx = TAB_PATHS.findIndex((p) => pathname.startsWith(p));
  const indexRef = useRef(idx === -1 ? 0 : idx);
  // mantém indexRef atualizado quando pathname muda
  indexRef.current = idx === -1 ? indexRef.current : idx;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        // só ativar para swipe horizontal significativo e pouco movimento vertical
        return Math.abs(dx) > 20 && Math.abs(dy) < 50;
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const { dx, vx } = gestureState;
        const threshold = Math.max(0.15 * width, 60); // sensibilidade
        if (dx > threshold || vx > 0.6) {
          // swipe para direita -> tab anterior
          const prev = Math.max(0, indexRef.current - 1);
          if (prev !== indexRef.current) {
            router.push(TAB_PATHS[prev] as unknown as Parameters<typeof router.push>[0]);
            indexRef.current = prev;
          }
        } else if (dx < -threshold || vx < -0.6) {
          // swipe para esquerda -> próxima tab
          const next = Math.min(TAB_PATHS.length - 1, indexRef.current + 1);
          if (next !== indexRef.current) {
            router.push(TAB_PATHS[next] as unknown as Parameters<typeof router.push>[0]);
            indexRef.current = next;
          }
        }
      },
    })
  ).current;

  // desabilita swipe quando estivermos na tab "correr"
  const isCorrerTab = pathname.startsWith("/tabs/correr");
  const panProps = isCorrerTab ? {} : pan.panHandlers;

  return (
    <View style={styles.container} {...panProps}>
       <Tabs
         screenOptions={{
     headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.background, // cor do fundo da barra
      borderTopColor: colors.border,      // cor da linha superior
      height: 64,
      paddingBottom: 8,
    },
    tabBarActiveTintColor: colors.accent,   // ícone/texto ativo (laranja)
    tabBarInactiveTintColor: colors.muted,  // ícone/texto inativo
    tabBarLabelStyle: { fontSize: 12 },
  }}
>
        {/* Ordem: Home | Buscar | Correr | Perfil */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="buscar"
          options={{
            title: "Buscar",
            tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="correr"
          options={{
            title: "Correr",
            tabBarIcon: ({ color, size }) => <FontAwesome5 name="running" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
// ...existing code...