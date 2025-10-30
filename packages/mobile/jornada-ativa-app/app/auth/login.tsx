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
import { loginRequest, BASE_URL } from "../../lib/api";
import { saveAuth } from "../../lib/token"; // <-- usar saveAuth
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
      // 1) login
      const { token } = await loginRequest(email.trim(), senha.trim());

      // 2) descobrir id do usuário já com o token recém obtido
      //    (ajuste a rota se seu backend expõe /usuarios/me)
      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let me: any = null;
      try { me = await meRes.json(); } catch { /* ignore */ }

      if (!meRes.ok) {
        // se /auth/me não existir, ainda assim seguimos salvando só o token
        // (o perfil consegue descobrir via outro fallback depois)
        console.warn("Falha ao obter /auth/me:", me);
      }

      const id_usuario =
        Number(me?.id_usuario) ||
        Number(me?.usuario?.id_usuario) ||
        Number(me?.id) ||
        undefined;

      // 3) salvar token + id_usuario + email (se tiver)
      await saveAuth({ token, id_usuario, email });

      // 4) navegar
      router.replace("/tabs/home");
    } catch (e: any) {
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
          <Text style={styles.buttonText}>{loading ? "Entrando..." : "LOGIN"}</Text>
        </TouchableOpacity>

        {err && <Text style={{ color: "#ff6767", marginTop: 8 }}>{err}</Text>}
      </View>

      <Text style={styles.signupText}>
        NÃO TEM UMA CONTA?{" "}
        <Link href="/auth/cadastro" style={styles.link}>
          Cadastre-se
        </Link>
      </Text>
    </SafeAreaView>
  );
}
