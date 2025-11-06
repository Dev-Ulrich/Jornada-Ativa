// app/tabs/perfil.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api, { apiFetch } from "../../lib/api";
import { getToken } from "../../lib/token";
import { styles } from "../../src/perfil.styles";

type Nivel = "Iniciante" | "Intermediário" | "Avançado";
type Genero = "Masculino" | "Feminino" | "Outro";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  genero: string;
  dataNascimento: string;
  ftPerfil?: string;
  nivel: string;
  altura: number;
  peso: number;
};

type Historico = {
  id?: number;
  id_historico_treino?: number;
  data: string;              // "YYYY-MM-DD"
  distancia: number;         // km
  tempo: number;             // minutos (decimal)
  pace: number;              // min/km (decimal)
  v_media?: number;          // km/h
  kcal?: number;             // kcal
  id_treino?: number | null;
  treinoNome?: string | null;
  nivel?: string | null;
};

/* ----------------- helpers ----------------- */
const norm = (s: string) =>
  String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const toClientNivel = (s?: string): Nivel | undefined => {
  const v = norm(s || "");
  if (v.includes("inic")) return "Iniciante";
  if (v.includes("inter")) return "Intermediário";
  if (v.includes("avanc")) return "Avançado";
  return undefined;
};

const mapGenero = (g: any): Genero | string => {
  const v = norm(g || "");
  if (v === "m" || v.startsWith("masc")) return "Masculino";
  if (v === "f" || v.startsWith("fem")) return "Feminino";
  if (v === "o" || v.startsWith("out")) return "Outro";
  return typeof g === "string" ? g : "Masculino";
};

// decodifica JWT sem libs externas
function safeDecodeJwt(token?: string | null): any | null {
  try {
    if (!token) return null;
    const [, payload] = token.split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // @ts-ignore
    const json =
      typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function displayDateISO(iso?: string) {
  if (!iso) return "";
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso!;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function toISO(d: any): string | undefined {
  if (!d) return undefined;
  const s = String(d);
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  const m2 = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m2) return m2[1];
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return undefined;
}

/** Parse YYYY-MM-DD como data local (evita dizer “Ontem” por causa de UTC) */
function parseApiDate(value: any): Date {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d); // meia-noite local
  }
  return new Date(value);
}

function fmtDayLabel(iso: string) {
  const d = parseApiDate(iso);
  const today = new Date();
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((t0.getTime() - d0.getTime()) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function tempoFmt(min: number) {
  const total = Math.round(min * 60);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const hh = h > 0 ? `${String(h).padStart(2, "0")}:` : "";
  return `${hh}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function paceFmt(p: number) {
  if (!isFinite(p) || p <= 0) return "—";
  const m = Math.floor(p);
  const s = Math.round((p - m) * 60);
  return `${m}:${String(s).padStart(2, "0")} min/km`;
}

/* ------------------------------------------- */

export default function Perfil() {
  type TabKey = "history" | "settings";
  const [tab, setTab] = useState<TabKey>("history");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<Usuario | null>(null);
  const router = useRouter();

  // mover handleDeleteUser para aqui — agora consegue usar `user` e `router`
  const handleDeleteUser = () => {
    if (!user) return;
    Alert.alert(
      "Tem certeza?",
      "Tem certeza que deseja deletar seu usuário? Essa ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/usuarios/${user.id}`);
              Alert.alert("Conta deletada", "Seu usuário foi removido com sucesso.");
              router.replace("/auth/login");
            } catch (e) {
              console.error("Erro ao deletar usuário:", e);
              Alert.alert("Erro", "Não foi possível deletar o usuário.");
            }
          },
        },
      ]
    );
  };

  // botão de logout
  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await api.post("/auth/logout");
          } catch (e) {
            console.warn("Logout no servidor falhou:", e);
          }

          try {
            // @ts-ignore
            const mod = await import("../../lib/token");
            if (mod && typeof mod.removeToken === "function") {
              await mod.removeToken();
            }
          } catch {}

          router.replace("/auth/login");
        },
      },
    ]);
  };

  // === ESTADO NOVO: histórico + modal detalhes ===
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [details, setDetails] = useState<Historico | null>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    genero: "Masculino" as Genero | string,
    data_nascimento: "",
    ft_perfil: "",
    nivel: "Iniciante" as Nivel | string,
    altura: "1.70",
    peso: "70.00",
  });

  // --------- LOAD USER + HISTÓRICO ----------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error("Token ausente.");

        // tenta extrair email/id do JWT
        const claims = safeDecodeJwt(token);
        let emailFromToken: string | undefined =
          claims?.email ?? claims?.user?.email ?? undefined;
        const idFromToken =
          claims?.sub ?? claims?.id ?? claims?.user?.id ?? undefined;
        if (!emailFromToken && typeof idFromToken === "string" && idFromToken.includes("@")) {
          emailFromToken = idFromToken;
        }

        let u: any = null;

        // 1) por email
        if (emailFromToken) {
          try {
            u = await apiFetch<Usuario>(`/usuarios/email/${encodeURIComponent(emailFromToken)}`, {
              method: "GET",
            });
          } catch {
            u = null;
          }
        }

        // 2) fallback por id (via /auth/me ou claim)
        if (!u) {
          let who: any = null;
          try {
            who = await apiFetch("/auth/me", { method: "GET" });
          } catch {
            who = null;
          }
          const uid: number | undefined = Number(who?.id ?? who?.id_usuario ?? idFromToken);
          if (uid && !Number.isNaN(uid)) {
            u = await apiFetch<Usuario>(`/usuarios/${uid}`, { method: "GET" });
          }
        }

        if (!u) throw new Error("Não foi possível carregar seus dados.");

        const usuario: Usuario = {
          id: u.id,
          nome: u.nome,
          email: u.email,
          genero: u.genero,
          dataNascimento: u.dataNascimento,
          ftPerfil: u.ftPerfil,
          nivel: u.nivel,
          altura: u.altura,
          peso: u.peso,
        };

        setUser(usuario);
        setForm({
          nome: usuario.nome,
          email: usuario.email,
          senha: "",
          genero: mapGenero(usuario.genero),
          data_nascimento: displayDateISO(usuario.dataNascimento),
          ft_perfil: usuario.ftPerfil || "",
          nivel: toClientNivel(usuario.nivel) || "Iniciante",
          altura: String(usuario.altura ?? "1.70"),
          peso: String(usuario.peso ?? "70.00"),
        });

        // === carrega histórico pelo endpoint correto ===
        let lista: any[] = [];
        try {
          lista = await apiFetch(`/historico-treinos/usuario/${usuario.id}/all`, { method: "GET" });
        } catch {
          // fallback paginado
          const page = await apiFetch(`/historico-treinos/usuario/${usuario.id}?page=0&size=50&sort=data,desc`);
          lista = page?.content ?? [];
        }

        const mapped: Historico[] = (Array.isArray(lista) ? lista : []).map((h: any) => ({
          id: h.id ?? h.id_historico_treino,
          id_historico_treino: h.id_historico_treino ?? h.id,
          data: h.data ?? h.createdAt ?? h.created_at,
          distancia: Number(h.distancia ?? 0),
          tempo: Number(h.tempo ?? 0),
          pace: Number(h.pace ?? 0),
          v_media: h.v_media != null ? Number(h.v_media) : undefined,
          kcal: h.kcal != null ? Number(h.kcal) : undefined,
          id_treino: h.treinoId ?? h.id_treino ?? null,
          treinoNome: h.treino?.nome ?? h.nome ?? null,
          nivel: h.nivel ?? h.treino?.nivel ?? null,
        }));

        // ordena e limita aos 5 mais recentes
        mapped.sort((a, b) => parseApiDate(b.data).getTime() - parseApiDate(a.data).getTime());
        setHistorico(mapped.slice(0, 5));
      } catch (e) {
        console.error("Erro ao carregar perfil/histórico:", e);
        Alert.alert("Aviso", "Não foi possível carregar seu histórico agora.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChangeNivel = (next: string) => {
    if (next === form.nivel) return;
    Alert.alert(
      "Alterar nível?",
      "Tem certeza que deseja alterar o seu nível? Seus treinos serão recalculados e poderão ficar mais desafiadores. Você poderá reverter depois.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", style: "destructive", onPress: () => setForm((f) => ({ ...f, nivel: next })) },
      ]
    );
  };

  const onSave = async () => {
    try {
      setSaving(true);
      if (!user) return;
      if (!form.nome.trim()) return Alert.alert("Atenção", "Informe seu nome.");
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
        return Alert.alert("Atenção", "E-mail inválido.");
      if (form.senha && form.senha.length < 6)
        return Alert.alert("Atenção", "A senha deve ter no mínimo 6 caracteres.");

      const alturaNum = Number(String(form.altura).replace(",", "."));
      const pesoNum = Number(String(form.peso).replace(",", "."));
      const iso = toISO(form.data_nascimento);
      if (!iso) return Alert.alert("Atenção", "Data inválida (dd/mm/aaaa ou aaaa-mm-dd).");

      const nivelApi =
        form.nivel === "Iniciante" ? "INICIANTE" :
        form.nivel === "Intermediário" ? "INTERMEDIARIO" :
        "AVANCADO";

      const payload: any = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        genero: form.genero,
        dataNascimento: iso,
        ftPerfil: form.ft_perfil || null,
        nivel: nivelApi,
        altura: Number(alturaNum.toFixed(2)),
        peso: Number(pesoNum.toFixed(2)),
      };
      if (form.senha) payload.senha = form.senha;

      const updated = await api.put(`/usuarios/${user.id}`, payload);
      const novo: Usuario = {
        id: updated.id ?? user.id,
        nome: updated.nome ?? user.nome,
        email: updated.email ?? user.email,
        genero: updated.genero ?? user.genero,
        dataNascimento: updated.dataNascimento ?? user.dataNascimento,
        ftPerfil: updated.ftPerfil ?? user.ftPerfil,
        nivel: updated.nivel ?? user.nivel,
        altura: updated.altura ?? user.altura,
        peso: updated.peso ?? user.peso,
      };
      setUser(novo);
      setForm((f) => ({ ...f, senha: "" }));
      Alert.alert("Pronto!", "Seu perfil foi atualizado.");
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 24 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: (form.ft_perfil || user.ftPerfil || "https://i.pravatar.cc/150").toString() }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{form.nome || user.nome}</Text>
              <Text style={styles.sub}>
                Nível: {form.nivel || toClientNivel(user.nivel) || "Iniciante"} • {user.email}
              </Text>
              <View style={styles.tagsRow}>
                <View style={styles.tag}><Text style={styles.tagText}>Gênero: {form.genero}</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>Altura: {form.altura} m</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>Peso: {form.peso} kg</Text></View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable onPress={() => setTab("history")} style={[styles.tab, tab === "history" && styles.tabActive]}>
              <Text style={[styles.tabText, tab === "history" && styles.tabTextActive]}>Histórico</Text>
            </Pressable>
            <Pressable onPress={() => setTab("settings")} style={[styles.tab, tab === "settings" && styles.tabActive]}>
              <Text style={[styles.tabText, tab === "settings" && styles.tabTextActive]}>Configurações</Text>
            </Pressable>
          </View>

          {/* --------- HISTÓRICO --------- */}
          {tab === "history" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Histórico de Treino</Text>

              {/* KPIs compactos */}
              <Kpis historico={historico} />

              {/* Lista dos 5 últimos */}
              <View style={{ marginTop: 12 }}>
                {historico.length === 0 ? (
                  <Text style={styles.cardMeta}>Nenhum treino registrado ainda.</Text>
                ) : (
                  historico.map((h) => {
                    const id = h.id ?? h.id_historico_treino!;
                    return (
                      <View key={id} style={styles.cardRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.cardTitle, { fontWeight: "700" }]}>
                            {fmtDayLabel(h.data)}
                          </Text>
                          {!!h.treinoNome && (
                            <Text style={{ color: "#aaa", fontSize: 12 }}>{h.treinoNome}</Text>
                          )}
                        </View>

                        <View style={{ flex: 1.2 }}>
                          <Text style={styles.cardTitle}>
                            <Text style={{ fontWeight: "700" }}>{h.distancia.toFixed(2)} km</Text>
                            {"  •  "}
                            <Text style={{ fontWeight: "700" }}>{tempoFmt(h.tempo)}</Text>
                          </Text>
                          <Text style={{ color: "#ccc", fontSize: 12 }}>
                            Pace {paceFmt(h.pace)}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => setDetails(h)}
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 10,
                            backgroundColor: "#ff7a1a",
                          }}
                        >
                          <Text style={{ color: "#121212", fontWeight: "700" }}>Detalhes</Text>
                        </Pressable>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          )}

          {/* --------- CONFIGURAÇÕES --------- */}
          {tab === "settings" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Editar perfil</Text>

              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.label}>Foto (URL)</Text>
                  <TextInput
                    value={form.ft_perfil}
                    onChangeText={(v) => setForm((f) => ({ ...f, ft_perfil: v }))}
                    placeholder="https://..."
                    placeholderTextColor="#8E939B"
                    style={styles.input}
                  />
                </View>

                <View>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    value={form.nome}
                    onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
                    placeholder="Seu nome"
                    placeholderTextColor="#8E939B"
                    style={styles.input}
                  />
                </View>

                <View>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput
                    value={form.email}
                    onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
                    placeholder="email@exemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#8E939B"
                    style={styles.input}
                  />
                </View>

                <View>
                  <Text style={styles.label}>Nova senha (opcional)</Text>
                  <TextInput
                    value={form.senha}
                    onChangeText={(v) => setForm((f) => ({ ...f, senha: v }))}
                    placeholder="mín. 6 caracteres"
                    secureTextEntry
                    placeholderTextColor="#8E939B"
                    style={styles.input}
                  />
                </View>

                <View>
                  <Text style={styles.label}>Gênero</Text>
                  <View style={styles.pillsRow}>
                    {["Masculino", "Feminino", "Outro"].map((g) => (
                      <Pressable
                        key={g}
                        style={[styles.pill, form.genero === g && styles.pillActive]}
                        onPress={() => setForm((f) => ({ ...f, genero: g as Genero }))}
                      >
                        <Text style={[styles.pillText, form.genero === g && styles.pillTextActive]}>{g}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Data de nascimento</Text>
                  <TextInput
                    value={form.data_nascimento}
                    onChangeText={(v) => setForm((f) => ({ ...f, data_nascimento: v }))}
                    placeholder="dd/mm/aaaa"
                    placeholderTextColor="#8E939B"
                    style={styles.input}
                  />
                </View>

                <View>
                  <Text style={styles.label}>Nível</Text>
                  <View style={styles.pillsRow}>
                    {["Iniciante", "Intermediário", "Avançado"].map((n) => (
                      <Pressable
                        key={n}
                        style={[styles.pill, form.nivel === n && styles.pillActive]}
                        onPress={() => onChangeNivel(n)}
                      >
                        <Text style={[styles.pillText, form.nivel === n && styles.pillTextActive]}>{n}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Altura (m)</Text>
                  <TextInput
                    value={form.altura}
                    onChangeText={(v) => setForm((f) => ({ ...f, altura: v }))}
                    placeholder="1.68"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#8E939B"
                    style={styles.input}
                  />
                </View>

                <View>
                  <Text style={styles.label}>Peso (kg)</Text>
                  <TextInput
                    value={form.peso}
                    onChangeText={(v) => setForm((f) => ({ ...f, peso: v }))}
                    placeholder="65.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#8E939B"
                    style={styles.input}
                  />
                </View>

                <Pressable disabled={saving} onPress={onSave} style={[styles.saveBtn, saving && { opacity: 0.7 }]}>
                  <Text style={styles.saveBtnText}>{saving ? "Salvando..." : "Salvar"}</Text>
                </Pressable>
                <Text style={styles.helper}>Obs.: deixar a senha vazia mantém a senha atual.</Text>

                {/* >>>> NOVOS BOTÕES AQUI <<<< */}
                <Pressable
                  onPress={handleLogout}
                  style={{
                    marginTop: 12,
                    backgroundColor: "#ff7a1a",
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#121212", fontWeight: "700" }}>Sair</Text>
                </Pressable>

                <Pressable
                  onPress={handleDeleteUser}
                  style={{
                    marginTop: 12,
                    backgroundColor: "#a62828",
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Deletar conta</Text>
                </Pressable>
                {/* <<<< FIM DA TROCA >>>> */}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Detalhes */}
      <Modal visible={!!details} transparent animationType="fade" onRequestClose={() => setDetails(null)}>
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}>
          <View style={{
            width: "100%",
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#1c1c1c",
          }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Detalhes da corrida</Text>
            {details && (
              <View style={{ marginTop: 12, gap: 8 }}>
                <Row label="Data" value={fmtDayLabel(details.data)} />
                {!!details.treinoNome && <Row label="Treino" value={String(details.treinoNome)} />}
                {!!details.nivel && <Row label="Nível" value={String(details.nivel)} />}
                <Row label="Distância" value={`${details.distancia.toFixed(2)} km`} />
                <Row label="Tempo" value={tempoFmt(details.tempo)} />
                <Row label="Pace" value={paceFmt(details.pace)} />
                {!!details.v_media && <Row label="Vel. média" value={`${details.v_media?.toFixed(2)} km/h`} />}
                {!!details.kcal && <Row label="Kcal" value={String(details.kcal)} />}
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <Pressable
                onPress={() => setDetails(null)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#2a2a2a", alignItems: "center" }}
              >
                <Text style={{ color: "#fff" }}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* --------- componentes auxiliares --------- */
function Kpis({ historico }: { historico: Historico[] }) {
  const k = useMemo(() => {
    const total = historico.length;
    const dist = historico.reduce((acc, h) => acc + (h.distancia || 0), 0);
    const bestPace = historico
      .map((h) => h.pace)
      .filter((p) => isFinite(p) && p > 0)
      .reduce((min, p) => (p < min ? p : min), Number.POSITIVE_INFINITY);
    const kcal = historico
      .map((h) => h.kcal ?? Math.round(70 * 8 * (h.tempo / 60)))
      .reduce((a, b) => a + b, 0);

    return {
      total,
      dist: Number(dist.toFixed(2)),
      bestPace: isFinite(bestPace) ? bestPace : 0,
      kcal,
    };
  }, [historico]);

  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
      <Kpi label="Total" value={String(k.total)} />
      <Kpi label="Distância" value={`${k.dist} km`} />
      <Kpi label="Melhor pace" value={paceFmt(k.bestPace)} />
      <Kpi label="Kcal" value={String(k.kcal)} />
    </View>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: "#2a2a2a" }}>
      <Text style={{ color: "#ccc", fontSize: 12 }}>{label}</Text>
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: "#ccc" }}>{label}</Text>
      <Text style={{ color: "#fff", fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
