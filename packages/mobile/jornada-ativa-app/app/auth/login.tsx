import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginRequest, saveToken } from "../../lib/api";
import { styles } from "../../src/auth/login.styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const canSubmit = /\S+@\S+\.\S+/.test(email.trim()) && senha.trim().length >= 6;

   async function handleLogin() {
  if (!canSubmit || loading) return;

  setLoading(true);
  setErr(null);

  try {
    // chama sua API (/auth/login) via helper
    // se o backend usar "password" em vez de "senha", garanta que o loginRequest
    // está enviando { email, password: senha }
    const { token } = await loginRequest(email.trim(), senha.trim());

    await saveToken(token); // expo-secure-store
    router.replace("/tabs/home"); // cai nas abas

  } catch (e: any) {
    // mensagens mais amigáveis
    const raw = (e?.message || "").toString().toLowerCase();

    if (raw.includes("401") || raw.includes("unauthorized")) {
      setErr("Email ou senha inválidos.");
    } else if (raw.includes("network") || raw.includes("failed to fetch")) {
      setErr("Sem conexão com a API. Verifique sua internet/servidor.");
    } else if (raw.includes("timeout")) {
      setErr("Tempo de conexão esgotado. Tente novamente.");
    } else {
      setErr("Falha ao entrar. Tente novamente.");
    }
  } finally {
    setLoading(false);
  }
}
  return (
  <SafeAreaView style={styles.page}>
    <StatusBar barStyle="light-content" />

    <Image
      source={require("../../assets/images/ja-logo.png")}
      style={styles.logo}
      resizeMode="contain"
    />

    <View style={styles.form}>
      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Coloque seu email"
        placeholderTextColor="#9c9c9c"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Coloque sua senha"
        placeholderTextColor="#9c9c9c"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={!canSubmit}
        activeOpacity={0.85}
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Entrar"
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.signupText}>
      NÃO TEM UMA CONTA?{" "}
      <Link href="/auth/cadastro" style={styles.link}>
        Cadastre-se
      </Link>
    </Text>
  </SafeAreaView>
)};