import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiFetch } from "../../lib/api";
import { getUserInfo } from "../../lib/token";
import { styles } from "../../src/buscar.styles";

type Nivel = "Iniciante" | "Intermediário" | "Avançado";

type Treino = {
  id: number | string;
  titulo?: string | null;
  nome?: string | null;
  title?: string | null;
  descricao?: string | null;
  description?: string | null;
  nivel?: Nivel | string | null;
};

type Evento = {
  id: number | string;
  nome: string;
  descricao?: string | null;
  data?: string | null;
  dataEvento?: string | null;
  date?: string | null;
  inicio?: string | null;
  startAt?: string | null;
  createdAt?: string | null;
  link?: string | null;
  url?: string | null;
  site?: string | null;
  inscricao?: string | null;
};

const NIVEL_ORDER: Record<Nivel, number> = {
  Iniciante: 1,
  "Intermediário": 2,
  "Avançado": 3,
};

function asNivel(val?: string | null): Nivel | undefined {
  if (!val) return undefined;
  const norm = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (norm.startsWith("inic")) return "Iniciante";
  if (norm.startsWith("inter")) return "Intermediário";
  if (norm.startsWith("av")) return "Avançado";
  return undefined;
}

function first<T>(...vals: (T | undefined | null)[]) {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v as T;
  }
  return undefined;
}

function getTreinoTitulo(t: Treino) {
  return (first(t.titulo, t.nome, t.title) ?? "Treino").toString();
}
function getTreinoDescricao(t: Treino) {
  return first(t.descricao, t.description) ?? null;
}

function parseDate(isoLike?: string | null) {
  if (!isoLike) return undefined;
  const d = new Date(isoLike);
  if (!isNaN(d.getTime())) return d;
  const m = /^(\d{2})[/-](\d{2})[/-](\d{4})$/.exec(isoLike);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const d2 = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!isNaN(d2.getTime())) return d2;
  }
  return undefined;
}

function formatDateSmart(e: Evento) {
  const raw = first(e.data, e.dataEvento, e.date, e.inicio, e.startAt);
  const d = parseDate(raw ?? undefined);
  return d ? d.toLocaleDateString() : "-";
}

function formatDate(iso?: string | null) {
  const d = parseDate(iso);
  return d ? d.toLocaleDateString() : "-";
}

function normalizeUrl(u?: string | null) {
  if (!u) return undefined;
  let s = String(u).trim();
  s = s.replace(/[),.]+$/, "");
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const url = new URL(s);
    return url.toString();
  } catch {
    return undefined;
  }
}

function getEventoLink(e: Evento) {
  const primary = first(e.link, e.url, e.site, e.inscricao, (e as any).siteEvento, (e as any).urlEvento);
  const normalizedPrimary = normalizeUrl(primary as string | undefined);
  if (normalizedPrimary) return normalizedPrimary;

  const HTTP_RE = /https?:\/\/[^\s)]+/i;
  const DOMAIN_RE = /(?:^|[\s(])((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?)/i;

  const inDesc = [e.descricao].filter(Boolean).join(" ");
  const httpInDesc = inDesc.match(HTTP_RE);
  if (httpInDesc?.[0]) return normalizeUrl(httpInDesc[0])!;

  const domainInDesc = inDesc.match(DOMAIN_RE)?.[1];
  if (domainInDesc) return normalizeUrl(domainInDesc)!;

  for (const val of Object.values(e)) {
    if (typeof val !== "string") continue;
    const http = val.match(HTTP_RE)?.[0];
    if (http) return normalizeUrl(http)!;
    const domain = val.match(DOMAIN_RE)?.[1];
    if (domain) return normalizeUrl(domain)!;
  }

  return undefined;
}

async function openExternal(url?: string) {
  const u = normalizeUrl(url);
  if (!u) {
    Alert.alert("Link inválido", "Não foi possível abrir o site deste evento.");
    return;
  }
  const can = await Linking.canOpenURL(u);
  if (!can) {
    Alert.alert("Não suportado", "Seu dispositivo não conseguiu abrir este link.");
    return;
  }
  try {
    await Linking.openURL(u);
  } catch {
    Alert.alert("Erro ao abrir", "Tente novamente mais tarde.");
  }
}

export default function Buscar() {
  const isFocused = useIsFocused();
  const [aba, setAba] = useState<"treinos" | "eventos">("treinos");
  const [query, setQuery] = useState("");
  const [nivelFiltro, setNivelFiltro] = useState<Nivel | "">("");
  const [nivelUsuario, setNivelUsuario] = useState<Nivel | undefined>(undefined);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      setCarregando(true);
      setErro(null);
      try {
        const me = await getUserInfo();
        const n = asNivel(me?.nivel);
        if (mounted) setNivelUsuario(n);

        const [treinoRes, eventoRes] = await Promise.all([
          apiFetch<Treino[]>("/treinos"),
          apiFetch<Evento[]>("/eventos"),
        ]);

        if (mounted) {
          setTreinos(Array.isArray(treinoRes) ? treinoRes : []);
          setEventos(Array.isArray(eventoRes) ? eventoRes : []);
        }
      } catch {
        if (mounted) setErro("Não foi possível carregar os dados. Tente novamente.");
      } finally {
        if (mounted) setCarregando(false);
      }
    }
    if (isFocused) bootstrap();
    return () => {
      mounted = false;
    };
  }, [isFocused]);

  const treinosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();

    const byText = (t: Treino) => {
      const titulo = getTreinoTitulo(t).toLowerCase();
      const desc = (getTreinoDescricao(t) ?? "").toLowerCase();
      return !q ? true : titulo.includes(q) || desc.includes(q);
    };

    const byNivel = (t: Treino) => (!nivelFiltro ? true : asNivel(t.nivel) === nivelFiltro);

    return treinos.filter((t) => byText(t) && byNivel(t));
  }, [treinos, query, nivelFiltro]);

  const eventosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byText = (e: Evento) =>
      !q ? true : e.nome?.toLowerCase().includes(q) || (e.descricao ?? "").toLowerCase().includes(q);
    return eventos.filter(byText);
  }, [eventos, query]);

  function iniciarTreino(t: Treino) {
    router.push({
      pathname: "/tabs/correr",
      params: { treinoId: String(t.id), titulo: getTreinoTitulo(t) },
    });
  }

  function renderTreino(t: Treino) {
    const nTreino = asNivel(t.nivel);
    const acima = nTreino && nivelUsuario && NIVEL_ORDER[nTreino] > NIVEL_ORDER[nivelUsuario];

    return (
      <View style={styles.card} key={`treino-${t.id}`}>
        <Text style={styles.cardTitle}>{getTreinoTitulo(t)}</Text>
        {getTreinoDescricao(t) && <Text style={styles.cardMeta}>{getTreinoDescricao(t)}</Text>}
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{nTreino ?? "Sem nível"}</Text>
        </View>

        {acima ? (
          <View style={styles.warnBox}>
            <Text style={styles.warnText}>
              Nível acima do esperado para o seu perfil.{"\n"}
              Volte quando atingir o nível necessário.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.okText}>Disponível para você ✅</Text>
            <Pressable onPress={() => iniciarTreino(t)} style={styles.startButton}>
              <Text style={styles.startButtonText}>Iniciar</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  function renderEvento(e: Evento) {
    const link = getEventoLink(e);

    return (
      <View style={styles.card} key={`evento-${e.id}`}>
        <Text style={styles.cardTitle}>{e.nome}</Text>
        {!!e.descricao && <Text style={styles.cardMeta}>{e.descricao}</Text>}
        <View style={styles.row}>
          <Text style={styles.label}>Data do evento: </Text>
          <Text style={styles.value}>{formatDateSmart(e)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Criado em: </Text>
          <Text style={styles.value}>{formatDate(e.createdAt)}</Text>
        </View>

        {link ? (
          <Pressable onPress={() => openExternal(link)} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Abrir site</Text>
          </Pressable>
        ) : (
          <Text style={[styles.value, { marginTop: 6 }]}>Sem link informado</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Buscar</Text>

      <View style={styles.tabs}>
        <Pressable onPress={() => setAba("treinos")} style={[styles.tab, aba === "treinos" && styles.tabActive]}>
          <Text style={[styles.tabText, aba === "treinos" && styles.tabTextActive]}>Treinos</Text>
        </Pressable>
        <Pressable onPress={() => setAba("eventos")} style={[styles.tab, aba === "eventos" && styles.tabActive]}>
          <Text style={[styles.tabText, aba === "eventos" && styles.tabTextActive]}>Eventos</Text>
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder={aba === "treinos" ? "Buscar treinos por nome..." : "Buscar eventos por nome..."}
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      {aba === "treinos" && (
        <View style={styles.chipsRow}>
          {(["", "Iniciante", "Intermediário", "Avançado"] as ("" | Nivel)[]).map((n) => (
            <Pressable
              key={`chip-${n || "todos"}`}
              onPress={() => setNivelFiltro(n)}
              style={[styles.chip, nivelFiltro === n && styles.chipActive]}
            >
              <Text style={[styles.chipText, nivelFiltro === n && styles.chipTextActive]}>
                {n || "Todos os níveis"}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : erro ? (
        <Text style={styles.error}>{erro}</Text>
      ) : aba === "treinos" ? (
        <FlatList
          data={treinosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => renderTreino(item)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum treino encontrado.</Text>}
        />
      ) : (
        <FlatList
          data={eventosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => renderEvento(item)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum evento encontrado.</Text>}
        />
      )}
    </View>
  );
}
