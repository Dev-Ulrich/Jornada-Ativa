import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../src/evento.styles";

/** ===== Locale PT-BR ===== */
LocaleConfig.locales["pt-br"] = {
  monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
  monthNamesShort: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
  dayNames: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],
  dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

/** ===== ENV / Config ===== */
const BASE_URL = (process.env.EXPO_PUBLIC_API || "https://jornada-ativa-api.onrender.com").replace(/\/$/,"");
const PROTECTED_PATH = process.env.EXPO_PUBLIC_EVENTS_PATH || "/eventos";           // protegido
const PUBLIC_PATH    = process.env.EXPO_PUBLIC_PUBLIC_EVENTS_PATH || "/eventos";    // agora liberado por GET
const AUTH_SCHEME    = process.env.EXPO_PUBLIC_AUTH_SCHEME || "Bearer";
const USE_MOCK_ON_FAIL = false; // agora que liberou GET público, pode deixar false

/** ===== Tipos ===== */
type EventoAPI = {
  id: number | string;
  nome: string;
  descricao?: string;
  linkEvento?: string;
  dataEvento: string;   // pode ser "DD/MM/YYYY" OU "YYYY-MM-DD" OU ISO
  dataCriacao?: string;
  status?: "Ativo" | "Inativo" | string;
  imagemEvento?: string;
};

type Evento = {
  id: string;
  nome: string;
  descricao: string;
  linkEvento: string;
  dataLocalYMD: string; // "YYYY-MM-DD" (local)
  dataDate: Date;       // Date (00:00 local)
  status: "Ativo" | "Inativo" | string;
  imagemEvento?: string;
};

/** ===== Helpers de data (sempre LOCAL) ===== */
function toLocalYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// aceita "DD/MM/YYYY", "YYYY-MM-DD" e ISO ("2025-10-29T00:00:00Z")
function parseFlexibleDate(input: string): { ymd?: string; date?: Date } {
  if (!input) return {};
  const s = String(input).trim();

  // DD/MM/YYYY
  const mBR = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (mBR) {
    const dd = +mBR[1], mm = +mBR[2] - 1, yy = +mBR[3];
    const d = new Date(yy, mm, dd, 0, 0, 0, 0); // local
    if (!Number.isNaN(d.getTime())) return { ymd: toLocalYMD(d), date: d };
  }

  // YYYY-MM-DD
  const mISODate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (mISODate) {
    const yy = +mISODate[1], mm = +mISODate[2] - 1, dd = +mISODate[3];
    const d = new Date(yy, mm, dd, 0, 0, 0, 0); // local
    if (!Number.isNaN(d.getTime())) return { ymd: toLocalYMD(d), date: d };
  }

  // ISO completo com hora
  const dISO = new Date(s);
  if (!Number.isNaN(dISO.getTime())) {
    // normaliza para meia-noite LOCAL do mesmo dia
    const d = new Date(dISO.getFullYear(), dISO.getMonth(), dISO.getDate(), 0, 0, 0, 0);
    return { ymd: toLocalYMD(d), date: d };
  }

  return {};
}

function isPastDayLocal(d: Date) {
  const end = new Date(d); end.setHours(23, 59, 59, 999);
  return end.getTime() < Date.now();
}

function brFromYMD(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

/** ===== token helper ===== */
async function getAnyToken(): Promise<string | null> {
  const keys = ["ja_token", "token", "access_token", "auth_token", "jwt"];
  for (const k of keys) {
    const v = await AsyncStorage.getItem(k);
    if (v && v.trim()) return v;
  }
  return null;
}

/** ===== Tela ===== */
export default function CalendarioEventos() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string>(toLocalYMD(new Date()));
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [marks, setMarks] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchEventos() {
      setLoading(true);
      setLoadError(null);

      try {
        // tenta protegido com token se existir, mas como você liberou GET público, tanto faz
        const token = await getAnyToken();
        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) headers["Authorization"] = `${AUTH_SCHEME} ${token}`;

        let res = await fetch(`${BASE_URL}${PROTECTED_PATH}`, { headers });

        // se ainda assim der 401/403, tenta só GET público (que você liberou)
        if (res.status === 401 || res.status === 403) {
          res = await fetch(`${BASE_URL}${PUBLIC_PATH}`, { headers: { Accept: "application/json" } });
        }

        if (!res.ok) {
          if (mounted) {
            setLoadError(`Erro ao carregar eventos: HTTP ${res.status}`);
            if (USE_MOCK_ON_FAIL) {
              setEventos([]);
              setMarks({});
            }
          }
          return;
        }

        const text = await res.text();
        if (!text?.trim()) {
          if (!mounted) return;
          setEventos([]);
          setMarks({});
          return;
        }

        let data: any;
        try { data = JSON.parse(text); }
        catch {
          if (!mounted) return;
          setLoadError("A API retornou um formato inesperado (não-JSON).");
          setEventos([]);
          setMarks({});
          return;
        }

        const arr: EventoAPI[] = Array.isArray(data) ? data : [];
        const norm: Evento[] = [];

        for (const e of arr) {
          const p = parseFlexibleDate(e.dataEvento);
          if (!p.ymd || !p.date) continue;

          norm.push({
            id: String(e.id ?? Math.random()),
            nome: e.nome ?? "Evento",
            descricao: e.descricao ?? "",
            linkEvento: e.linkEvento ?? "",
            dataLocalYMD: p.ymd,
            dataDate: p.date,
            status: (e.status as any) ?? "Ativo",
            imagemEvento: e.imagemEvento,
          });
        }

        if (!mounted) return;

        // DEBUG (opcional): comente depois
        console.log(`[Eventos] recebidos: ${arr.length}, válidos: ${norm.length}`);

        setEventos(norm);

        // construir marcações (multi-dot) + marked:true
        const m: Record<string, any> = {};
        for (const ev of norm) {
          const inactive = String(ev.status).toLowerCase() !== "ativo";
          const color = inactive ? "#6b6b6b" : isPastDayLocal(ev.dataDate) ? "#27AE60" : "#ff8633";
          if (!m[ev.dataLocalYMD]) m[ev.dataLocalYMD] = { dots: [], marked: true };
          if (!m[ev.dataLocalYMD].dots.some((d: any) => d.color === color)) {
            m[ev.dataLocalYMD].dots.push({ color });
          }
        }

        // DEBUG (opcional)
        console.log(`[Eventos] dias marcados: ${Object.keys(m).length}`);

        setMarks(m);
      } catch (err: any) {
        if (!mounted) return;
        setLoadError(`Erro ao carregar eventos: ${err?.message ?? "erro inesperado"}`);
        setEventos([]);
        setMarks({});
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchEventos();
    return () => { mounted = false; };
  }, []);

  const eventosDoDia = useMemo(
    () => eventos.filter((e) => e.dataLocalYMD === selectedDate),
    [eventos, selectedDate]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).goBack?.()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendário de Eventos</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.container}>
        <Calendar
          firstDay={1}
          hideExtraDays
          enableSwipeMonths
          markingType="multi-dot"
          onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
          markedDates={{
            ...marks,
            [selectedDate]: {
              ...(marks[selectedDate] || { marked: true }),
              selected: true,
              selectedColor: "#ff8633",
              selectedTextColor: "#1c1c1c",
            },
          }}
          theme={{
            backgroundColor: "#121212",
            calendarBackground: "#1c1c1c",
            monthTextColor: "#ffffff",
            textMonthFontWeight: "700",
            textMonthFontSize: 18,
            textDayFontSize: 15,
            textDayHeaderFontSize: 12,
            dayTextColor: "#eaeaea",
            textDisabledColor: "#5e5e5e",
            todayTextColor: "#ffb27a",
            selectedDayBackgroundColor: "#ff8633",
            selectedDayTextColor: "#1c1c1c",
            arrowColor: "#ff8633",
            dotColor: "#ff8633",
          }}
          style={styles.calendar}
        />

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#ff8633" }]} />
            <Text style={styles.legendText}>Próximos (Ativos)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#27AE60" }]} />
            <Text style={styles.legendText}>Passados (Ativos)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#6b6b6b" }]} />
            <Text style={styles.legendText}>Inativos</Text>
          </View>
        </View>

        <View style={styles.listaContainer}>
          <Text style={styles.tituloLista}>Eventos em {brFromYMD(selectedDate)}</Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" />
              <Text style={styles.loadingTxt}>Carregando eventos…</Text>
            </View>
          ) : loadError ? (
            <Text style={styles.errorTxt}>{loadError}</Text>
          ) : (
            <FlatList
              data={eventosDoDia}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const inactive = String(item.status).toLowerCase() !== "ativo";
                const past = isPastDayLocal(item.dataDate);
                const barColor = inactive ? "#6b6b6b" : past ? "#27AE60" : "#ff8633";
                return (
                  <View style={styles.cardEvento}>
                    <View style={[styles.statusBar, { backgroundColor: barColor }]} />
                    <View style={styles.cardRow}>
                      {item.imagemEvento ? (
                        <Image source={{ uri: item.imagemEvento }} style={styles.thumb} />
                      ) : (
                        <View style={[styles.thumb, styles.thumbFallback]}>
                          <Ionicons name="image" size={18} color="#999" />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.nomeEvento} numberOfLines={1}>{item.nome}</Text>
                        {!!item.descricao && (
                          <Text style={styles.infoEvento} numberOfLines={2}>{item.descricao}</Text>
                        )}
                        <Text style={styles.metaEvento}>
                          Data: {brFromYMD(item.dataLocalYMD)}
                          {inactive ? "  •  Inativo" : past ? "  •  Encerrado" : "  •  Ativo"}
                        </Text>
                        {!!item.linkEvento && (
  <Text
    style={styles.linkEvento}
    numberOfLines={1}
    onPress={() => {
      const url = item.linkEvento.startsWith("http")
        ? item.linkEvento
        : `https://${item.linkEvento}`;
      import("react-native").then(({ Linking }) => Linking.openURL(url));
    }}
  >
    {item.linkEvento}
  </Text>
)}
                      </View>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={<Text style={styles.semEvento}>Nenhum evento neste dia.</Text>}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
