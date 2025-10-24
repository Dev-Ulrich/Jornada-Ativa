// lib/token.ts
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "ja_token";

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
