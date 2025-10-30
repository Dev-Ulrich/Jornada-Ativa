// app/tabs/home.tsx
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View
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
  id?: number | string;
  nome: string;
  email?: string;
  foto?: string;
  nivel?: Nivel;
};

type Treino = {
  id: string;
  titulo: string;
  descricao?: string;
  nivel: Nivel;
};

type UltimoTreino = {
  id: string;
  titulo: string; // ex: "5,20 km • 32:10"
  when: string;   // "Hoje" | "Ontem" | "dd/MM"
};

const MAX_RECOM = 3; // <= limite de treinos recomendados visíveis

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [user, setUser] = useState<UserProfile>({ nome: "Usuário" });
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [ultimos, setUltimos] = useState<UltimoTreino[]>([]);
  const router = useRouter();
  const apiAny = api as any;

  // ---------------- utils ----------------
  async function callApi(path: string, token?: string) {
    if (typeof apiAny.apiFetch === "function") {
      return await apiAny.apiFetch(path);
    }
    const base = API_BASE.replace(/\/$/, "");
    const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
    const txt = await res.text();
    try {
      return JSON.parse(txt || "{}");
    } catch {
      return txt;
    }
  }

  function safeDecodeJwt(token?: string | null) {
    try {
      if (!token) return null;
      const [_, payload] = token.split(".");
      if (!payload) return null;
      const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      // @ts-ignore
      const json = (typeof atob === "function"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf8")) as string;
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  const norm = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const toClientNivel = (s?: string): Nivel | undefined => {
    if (!s) return undefined;
    const v = norm(s);
    if (v.includes("inic")) return "Iniciante";
    if (v.includes("inter")) return "Intermediario";
    if (v.includes("avanc")) return "Avancado";
    return undefined;
  };

  const toApiNivel = (n?: Nivel) => {
    if (!n) return undefined;
    if (n === "Iniciante") return "INICIANTE";
    if (n === "Intermediario") return "INTERMEDIARIO";
    return "AVANCADO";
  };

  const km = (v?: number) =>
    typeof v === "number" ? `${v.toFixed(2)} km` : "— km";

  const tempoFmt = (v?: number) => {
    // assume DECIMAL em minutos (ex.: 32.50 → 32m30s)
    if (typeof v !== "number") return "—";
    const totalSeg = Math.round(v * 60);
    const mm = Math.floor(totalSeg / 60);
    const ss = totalSeg % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  function parseApiDate(value: any): Date {
  // Se vier 'YYYY-MM-DD', parseia como data LOCAL (sem UTC)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d); // meia-noite local
  }
  return new Date(value);
}

  function fmtDay(d: Date) {
  const today = new Date();
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());             // 00:00 local
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 00:00 local
  const diff = Math.round((t0.getTime() - d0.getTime()) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

  function profileRespSafe(x: any) {
    try {
      if (!x) return null;
      const u = x.usuario ?? x.user ?? x.data ?? x;
      return {
        id: u.id ?? u.id_usuario ?? u.idUsuario,
        nome: u.nome,
        email: u.email,
        nivel: u.nivel,
        foto: u.ft_perfil ?? u.foto ?? u.imagem ?? u.ftPerfil,
      };
    } catch {
      return null;
    }
  }

  // -------------- load perfil + dados --------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const raw = await getToken();
        const token = raw ? String(raw) : undefined;

        // tenta descobrir usuário
        const payload = safeDecodeJwt(token);
        let emailFromToken = payload?.email ?? payload?.user?.email;
        const idFromToken = payload?.sub ?? payload?.id ?? payload?.user?.id;
        if (!emailFromToken && typeof idFromToken === "string" && idFromToken.includes("@")) {
          emailFromToken = idFromToken;
        }

        let perfil: any = null;
        if (emailFromToken) {
          try { perfil = await callApi(`/usuarios/email/${encodeURIComponent(emailFromToken)}`, token); } catch {}
        }
        if (!perfil && idFromToken) {
          try { perfil = await callApi(`/usuarios/${idFromToken}`, token); } catch {}
        }
        if (!perfil) {
          for (const p of ["/usuarios/me", "/me", "/auth/me", "/users/me"]) {
            try { perfil = await callApi(p, token); if (perfil) break; } catch {}
          }
        }

        const safe = profileRespSafe(perfil);
        if (mounted && safe) {
          const fotoAbs =
            safe.foto && typeof safe.foto === "string" && !/^https?:\/\//i.test(safe.foto)
              ? `${API_BASE}${safe.foto.startsWith("/") ? "" : "/"}${safe.foto}`
              : safe.foto;

          const u: UserProfile = {
            id: safe.id,
            nome: safe.nome ?? "Usuário",
            email: safe.email,
            foto: fotoAbs,
            nivel: toClientNivel(safe.nivel),
          };
          setUser(u);

          setLoadingData(true);
          await Promise.all([loadTreinosRecomendados(u, token), loadUltimos(u, token)]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingData(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  // -------------- treinos recomendados (catálogo) --------------
  async function loadTreinosRecomendados(u: UserProfile, token?: string) {
    if (!u.nivel) { setTreinos([]); return; }
    const lvl = encodeURIComponent(String(toApiNivel(u.nivel)));

    const candidates = [
      `/treino?nivel=${lvl}`,                 // tabela "treino" (singular)
      `/treinos?nivel=${lvl}`,                // fallback plural
      `/treinos/recomendados?nivel=${lvl}`,   // fallback específico
    ];
    let data: any = null;
    for (const p of candidates) {
      try { data = await callApi(p, token); if (data) break; } catch {}
    }

    const arr = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
    const mapped: Treino[] = arr.map((t: any) => ({
      id: String(t.id ?? t.id_treino ?? t.idTreino ?? Math.random()),
      titulo: String(t.nome ?? t.titulo ?? "Treino"),
      descricao: t.descricao ?? undefined,
      nivel: toClientNivel(t.nivel) ?? u.nivel!,
    }));
    setTreinos(mapped);
  }

  // -------------- últimos treinos do usuário (histórico) --------------
  async function loadUltimos(u: UserProfile, token?: string) {
  if (!u.id) { setUltimos([]); return; }

  let data: any = null;
  try {
    // lista completa (seu endpoint /all)
    data = await callApi(`/historico-treinos/usuario/${u.id}/all`, token);
  } catch {
    // fallback: página 0 ordenada por data desc (seu endpoint paginado)
    try {
      data = await callApi(
        `/historico-treinos/usuario/${u.id}?page=0&size=5&sort=data,desc`,
        token
      );
    } catch {}
  }

  const arr = Array.isArray(data?.content) ? data.content
            : (Array.isArray(data) ? data : []);

  // ordena por data usando parse LOCAL (evita “Ontem” indevido)
  arr.sort((a: any, b: any) => {
    const da = parseApiDate(a.data ?? a.createdAt);
    const db = parseApiDate(b.data ?? b.createdAt);
    return db.getTime() - da.getTime(); // desc
  });

  // pega só os 5 mais recentes
  const top = arr.slice(0, 5);

  const mapped: UltimoTreino[] = top.map((h: any) => {
    const dist = typeof h.distancia === "number" ? h.distancia : Number(h.distancia ?? 0);
    const tempo = typeof h.tempo === "number" ? h.tempo : Number(h.tempo ?? 0);
    const d = h.data ? parseApiDate(h.data)
                     : (h.createdAt ? parseApiDate(h.createdAt) : new Date());
    const title = `${km(dist)} • ${tempoFmt(tempo)}`;
    return {
      id: String(h.id ?? h.id_historico_treino ?? Math.random()),
      titulo: title,
      when: fmtDay(d),
    };
  });

  setUltimos(mapped);
}


  // -------------- derivados --------------
  const treinosRecomendados = useMemo(() => {
    const nivelUser = user?.nivel ?? "";
    if (!nivelUser) return [];
    return treinos.filter((t) => norm(t.nivel) === norm(nivelUser));
  }, [treinos, user]);

  // LIMITADOR + “Ver todos”
  const treinosVisiveis = useMemo<Treino[]>(
    () => (treinosRecomendados ?? []).slice(0, MAX_RECOM),
    [treinosRecomendados]
  );

  function iniciarTreino(t: Treino) {
  // navega para a tela de correr com o id do treino
  router.push({
    pathname: "/tabs/correr",
    params: { treinoId: t.id, titulo: t.titulo },
  });
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
        {/* HEADER */}
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

        {/* SAUDAÇÃO */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            Olá, {user.nome.split(" ")[0]} <Text style={styles.wave}>👋</Text>
          </Text>
          <Text style={styles.greetingSubtitle}>Pronto para mais um treino?</Text>
        </View>

        {/* TREINOS RECOMENDADOS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Treinos recomendados</Text>
          {loadingData ? (
            <ActivityIndicator style={{ marginTop: 8 }} />
          ) : treinosRecomendados.length === 0 ? (
            <Text style={styles.cardMeta}>Nenhum treino disponível para seu nível.</Text>
          ) : (
            <>
              {treinosVisiveis.map((t) => (
                <View key={t.id} style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{t.titulo}</Text>
                    {t.descricao ? <Text style={styles.cardMeta}>{t.descricao}</Text> : null}
                  </View>
                  <Pressable onPress={() => iniciarTreino(t)} style={styles.startButton}>
                    <Text style={styles.startButtonText}>Iniciar</Text>
                  </Pressable>
                </View>
              ))}

              {treinosRecomendados.length > MAX_RECOM && (
                <Pressable onPress={() => router.push("/tabs/correr")}>
                  <Text
                    style={[
                      styles.cardMeta,
                      { textAlign: "right", marginTop: 6, color: "#ff7a1a" },
                    ]}
                  >
                    Ver todos →
                  </Text>
                </Pressable>
              )}
            </>
          )}
        </View>

        {/* ÚLTIMOS TREINOS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Últimos treinos</Text>
          {loadingData ? (
            <ActivityIndicator style={{ marginTop: 8 }} />
          ) : ultimos.length === 0 ? (
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

        {/* (Sem botão "+ Adicionar treino") */}
      </ScrollView>
    </SafeAreaView>
  );
}
