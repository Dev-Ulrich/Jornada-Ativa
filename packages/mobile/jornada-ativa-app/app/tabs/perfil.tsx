// app/tabs/perfil.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
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

// -------- helpers --------
const norm = (s: string) =>
  String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const toClientNivel = (s?: string): Nivel | undefined => {
  const v = norm(s || "");
  if (!v) return undefined;
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

export default function Perfil() {
  type TabKey = "history" | "settings";
  const [tab, setTab] = useState<TabKey>("history");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<Usuario | null>(null);

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

  // --------- LOAD: prioriza /usuarios/email/{email} ---------
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
        // alguns backends colocam o email no sub:
        if (!emailFromToken && typeof idFromToken === "string" && idFromToken.includes("@")) {
          emailFromToken = idFromToken;
        }

        let u: any = null;

        // 1) preferir por email (igual sua Home faz)
        if (emailFromToken) {
          try {
            u = await apiFetch<Usuario>(`/usuarios/email/${encodeURIComponent(emailFromToken)}`, {
              method: "GET",
            });
          } catch {
            u = null;
          }
        }

        // 2) fallback: descobrir id via /auth/me e buscar por id
        if (!u) {
          let who: any = null;
          try {
            who = await apiFetch("/auth/me", { method: "GET" });
          } catch {
            who = null;
          }
          const uid: number | undefined = Number(
            who?.id ?? who?.id_usuario ?? idFromToken
          );
          if (!u && uid && !Number.isNaN(uid)) {
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
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
        Alert.alert("Erro", "Não foi possível carregar seu perfil.");
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

      // ajuste de nomes conforme seu backend
      const payload: any = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        genero: form.genero,
        dataNascimento: iso,           // <- sua API usa dataNascimento (camelCase)
        ftPerfil: form.ft_perfil || null, // <- sua API usa ftPerfil
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
          <View className="tabs" style={styles.tabs}>
            <Pressable onPress={() => setTab("history")} style={[styles.tab, tab === "history" && styles.tabActive]}>
              <Text style={[styles.tabText, tab === "history" && styles.tabTextActive]}>Histórico</Text>
            </Pressable>
            <Pressable onPress={() => setTab("settings")} style={[styles.tab, tab === "settings" && styles.tabActive]}>
              <Text style={[styles.tabText, tab === "settings" && styles.tabTextActive]}>Configurações</Text>
            </Pressable>
          </View>

          {tab === "history" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Histórico</Text>
              {[
                { id: "1", t: "Z2 Leve • 4 km • 00:26:18" },
                { id: "2", t: "Tempo Run • 6.2 km • 00:34:21" },
                { id: "3", t: "Longão • 9.5 km • 00:55:07" },
              ].map((item) => (
                <View key={item.id} style={styles.cardRow}>
                  <Text style={styles.cardTitle}>{item.t}</Text>
                </View>
              ))}
            </View>
          )}

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
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
