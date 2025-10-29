import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../../lib/api";
import { getToken } from "../../lib/token";
import { styles } from "../../src/home.styles";

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\$/, "") ||
  "https://jornada-ativa-api.onrender.com";

type Nivel = "Iniciante" | "Intermediario" | "Avancado";

type UserProfile = {
  nome: string;
  foto?: string;
  nivel?: Nivel;
};

type Treino = {
  id: string;
  titulo: string;
  duracao?: string;
  nivel: Nivel;
  descricao?: string;
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile>({ nome: "Usuário" });
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [ultimos, setUltimos] = useState<{ id: string; titulo: string; when: string }[]>([]);

  const router = useRouter();
  const apiAny = api as any;

  // helper para chamar API (usa api.apiFetch quando disponível)
  async function callApi(path: string, token?: string) {
    if (typeof apiAny.apiFetch === "function") {
      return await apiAny.apiFetch(path);
    }
    const base = API_BASE.replace(/\/$/, "");
    const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  // decodifica payload JWT (se possível). Se não der, retorna null.
  function safeDecodeJwt(token?: string | null) {
    try {
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      if (typeof atob === "function") {
        const jsonStr = decodeURIComponent(
          Array.prototype
            .map.call(atob(b64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonStr);
      }
      // fallback: try atob via Buffer (node-like envs)
      try {
        // @ts-ignore
        const buf = typeof Buffer !== "undefined" ? Buffer.from(b64, "base64").toString("utf8") : null;
        return buf ? JSON.parse(buf) : null;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const tokenRaw = await getToken();
        const token: string | undefined = tokenRaw ? String(tokenRaw) : undefined;

        // tenta decodificar token para obter email ou id
        const payload = safeDecodeJwt(token);
        let emailFromToken = payload?.email ?? payload?.user?.email;
        const idFromToken = payload?.sub ?? payload?.id ?? payload?.user?.id;

        // se o "idFromToken" for um email (contém @), use como email
        if (!emailFromToken && typeof idFromToken === "string" && idFromToken.includes("@")) {
          emailFromToken = idFromToken;
        }

        let perfilResp: any = null;

        // tenta /usuarios/email/{email}
        if (emailFromToken) {
          try {
            perfilResp = await callApi(`/usuarios/email/${encodeURIComponent(emailFromToken)}`, token);
          } catch {
            perfilResp = null;
          }
        }

        // tenta /usuarios/{id}
        if (!perfilResp && idFromToken) {
          try {
            perfilResp = await callApi(`/usuarios/${idFromToken}`, token);
          } catch {
            perfilResp = null;
          }
        }

        // tenta endpoints alternativos
        if (!perfilResp) {
          for (const p of ["/usuarios/me", "/me", "/auth/me", "/users/me"]) {
            try {
              perfilResp = await callApi(p, token);
              if (perfilResp) break;
            } catch {
              perfilResp = null;
            }
          }
        }

        // DEBUG: mostra o que pegamos (pequeno resumo)
        console.log("DEBUG perfilResp:", profileRespSafe(perfilResp), "emailFromToken:", emailFromToken, "idFromToken:", idFromToken);

        if (mounted && perfilResp) {
          // normaliza: backend pode retornar { usuario: {...} } ou o próprio objeto
          const u = perfilResp.usuario ?? perfilResp.user ?? perfilResp.data ?? perfilResp ?? {};

          // seguir mapeamento do frontend web que você mostrou
          const mapped = {
            id: u.id ?? u.idUsuario ?? u.id_user,
            nome: u.nome ?? "-",
            email: u.email ?? "-",
            genero: u.genero ?? "-",
            dataNascimento: u.dataNascimento ?? null,
            nivel: u.nivel ?? u.level ?? undefined,
            altura: u.altura ?? null,
            peso: u.peso ?? null,
            role: u.role ?? u.roles ?? "ROLE_USER",
            foto: u.ftPerfil ?? u.foto ?? u.fotoPerfil ?? u.imagem ?? perfilResp.foto ?? "",
            createdAt: u.createdAt ?? u.criadoEm ?? null,
          };

          // converte nivel para os rótulos do client (se existir)
          let nivelUser: Nivel | undefined = undefined;
          if (typeof mapped.nivel === "string") {
            const n = mapped.nivel.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (n.includes("inic")) nivelUser = "Iniciante";
            else if (n.includes("inter")) nivelUser = "Intermediario";
            else if (n.includes("avan")) nivelUser = "Avancado";
          }

          // foto absoluta / relativa
          let fotoUrl: string | undefined = undefined;
          if (mapped.foto && typeof mapped.foto === "string" && mapped.foto.trim() !== "") {
            const trimmed = mapped.foto.trim();
            fotoUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `${API_BASE}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
          }

          console.log("DEBUG mapped user:", { nome: mapped.nome, nivel: nivelUser, fotoUrl });

          setUser({
            nome: String(mapped.nome ?? "Usuário"),
            foto: fotoUrl,
            nivel: nivelUser,
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // pequena função para evitar log de objetos grandes
  function profileRespSafe(x: any) {
    try {
      if (!x) return null;
      const u = x.usuario ?? x.user ?? x.data ?? x;
      return { id: u.id ?? u.idUsuario, nome: u.nome, nivel: u.nivel ?? u.level, foto: u.foto ?? u.ftPerfil ?? u.imagem };
    } catch {
      return null;
    }
  }

  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const treinosRecomendados = useMemo(() => {
    const nivelUser = user?.nivel ?? "";
    if (!nivelUser) return [];
    return treinos.filter((t) => normalize(t.nivel) === normalize(nivelUser));
  }, [treinos, user]);

  function iniciarTreino(t: Treino) {
    Alert.alert("Iniciar treino", `${t.titulo}\nDuração: ${t.duracao ?? "—"}`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Iniciar", onPress: () => Alert.alert("Treino iniciado", `Boa sorte em: ${t.titulo}`) },
    ]);
  }

  function adicionarTreino() {
    Alert.alert("Adicionar treino", "Ir para tela de adicionar treino (implementar).");
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff7a1a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.brand}>
            {user.foto ? (
              <Image source={{ uri: user.foto }} style={styles.brandImage} resizeMode="cover" />
            ) : (
              <View style={styles.brandPlaceholder}>
                <Text style={styles.brandInitials}>{user.nome?.split(" ")[0]?.[0] ?? "U"}</Text>
                {user.nivel ? (
                  <View style={styles.brandLevelBadge}>
                    <Text style={styles.brandLevelText}>{user.nivel}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.brandName}>{user.nome}</Text>
            <Text style={styles.smallMuted}>{user.nivel ? `Nível: ${user.nivel}` : ""}</Text>
          </View>

          <Pressable style={styles.iconButton} onPress={() => router.push("/calendario")}>
            <Feather name="calendar" size={18} color="#ffffff" />
         </Pressable>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            Olá, {user.nome.split(" ")[0]} <Text style={styles.wave}>👋</Text>
          </Text>
          <Text style={styles.greetingSubtitle}>Pronto para mais um treino?</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Treinos recomendados</Text>
          {treinosRecomendados.length === 0 ? (
            <Text style={styles.cardMeta}>Nenhum treino disponível para seu nível.</Text>
          ) : (
            treinosRecomendados.map((t) => (
              <View key={t.id} style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{t.titulo}</Text>
                  {t.descricao ? <Text style={styles.cardMeta}>{t.descricao}</Text> : null}
                </View>
                <Pressable onPress={() => iniciarTreino(t)} style={styles.startButton}>
                  <Text style={styles.startButtonText}>Iniciar</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Últimos treinos</Text>
          {ultimos.length === 0 ? (
            <Text style={styles.cardMeta}>Nenhum treino registrado ainda.</Text>
          ) : (
            ultimos.map((a) => (
              <View key={a.id} style={styles.activityRow}>
                <View style={styles.activityIcon}>
                  <Feather name="activity" size={18} color="#ff7a1a" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityText}>{a.titulo}</Text>
                  <Text style={styles.activityDay}>{a.when}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <Pressable style={styles.ctaButton} onPress={adicionarTreino}>
          <Text style={styles.ctaButtonText}>+ Adicionar treino</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
