import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

export const TOKEN_KEY = "ja_token";
const AUTH_KEY = "JA_AUTH"; // <- novo, armazena { token, id_usuario, email }

async function canUseSecureStore() {
  try {
    if (Platform.OS === "web") return false;
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function saveToken(token: string) {
  if (await canUseSecureStore()) return SecureStore.setItemAsync(TOKEN_KEY, token);
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  if (await canUseSecureStore()) return SecureStore.getItemAsync(TOKEN_KEY);
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken() {
  if (await canUseSecureStore()) return SecureStore.deleteItemAsync(TOKEN_KEY);
  return AsyncStorage.removeItem(TOKEN_KEY);
}

// ======== NOVOS helpers de auth completo ========
export type AuthInfo = {
  token: string;
  id_usuario?: number;
  email?: string;
};

export async function saveAuth(info: AuthInfo) {
  // salva token no local seguro
  await saveToken(info.token);
  // salva o objeto com id/email também
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(info));
}

export type UserInfo = {
  token: string;
  id?: string | number;     // id cru das claims, quando existir
  id_usuario?: number;      // id salvo (preferido)
  nome?: string;
  email?: string;
  nivel?: string;
};

export async function getUserInfo(): Promise<UserInfo | null> {
  try {
    const token = await getToken();
    if (!token) return null;

    // tenta ler o auth completo
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    let saved: AuthInfo | null = null;
    if (raw) {
      try { saved = JSON.parse(raw); } catch { saved = null; }
    }

    // decodifica claims (fallback)
    let claims: any = null;
    try { claims = jwtDecode(token); } catch { /* ignore */ }

    return {
      token,
      id_usuario: saved?.id_usuario,
      email: saved?.email ?? claims?.email,
      id: claims?.sub || claims?.id || claims?.userId || claims?.uid,
      nome: claims?.nome || claims?.name || claims?.username,
      nivel: claims?.nivel || claims?.Nivel || claims?.userNivel,
    };
  } catch (err) {
    console.warn("Falha ao obter user info:", err);
    return null;
  }
}
