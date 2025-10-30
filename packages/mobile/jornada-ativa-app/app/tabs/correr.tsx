// app/tabs/correr.tsx
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import type { LocationSubscription } from "expo-location";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Linking, Platform, Pressable, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { apiFetch } from "../../lib/api";
import { getUserInfo } from "../../lib/token";
import getCorrerStyles from "../../src/correr.styles";
import { colors } from "../../src/theme";

dayjs.locale("pt-br");
const styles = getCorrerStyles(colors);

type Coords = { latitude: number; longitude: number; timestamp: number };

type TreinoAtivo = {
  id?: number;
  nome?: string;
  nivel?: string;
  descricao?: string;
  distanciaMinKm?: number | null;
  distanciaMaxKm?: number | null;
  duracaoAlvoMin?: number | null;
  paceAlvoMinpkm?: number | null;
} | null;

// ---------- helpers exportados p/ testes ----------
export function fmtTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const hh = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  return `${hh}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function fmtPace(minPerKm: number) {
  if (!isFinite(minPerKm) || minPerKm <= 0) return "—";
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}'${String(s).padStart(2, "0")}"/km`;
}

export function haversine(a: Coords, b: Coords) {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ===== Helpers para obter o ID numérico do usuário =====
function isNumericId(v: any): v is number {
  return typeof v === "number" && Number.isFinite(v) && v > 0;
}

/** Resolve o ID do usuário por etapas, evitando enviar email no lugar do Long */
async function fetchCurrentUserId(): Promise<number | null> {
  // 1) getUserInfo() do app
  try {
    const u = await getUserInfo();
    const idCand =
      (u && (u.id ?? u.id_usuario)) ?? null;
    if (isNumericId(idCand)) return idCand;

    const email: string | null =
      (u && (u.email)) ?? null;

    // 2) /usuarios/me (se existir)
    try {
      const me = await apiFetch("/usuarios/me");
      const meId = me?.id ?? me?.id_usuario ?? me?.idUser ?? null;
      if (isNumericId(meId)) return meId;
    } catch {
      // segue o fluxo
    }

    // 3) se temos email, tenta por email
    if (email) {
      try {
        const byEmail = await apiFetch(
          `/usuarios/email/${encodeURIComponent(email)}`
        );
        const id1 =
          byEmail?.id ?? byEmail?.id_usuario ?? byEmail?.[0]?.id ?? null;
        if (isNumericId(id1)) return id1;
      } catch {}

      try {
        const list = await apiFetch(
          `/usuarios?email=${encodeURIComponent(email)}`
        );
        const first = Array.isArray(list) ? list[0] : null;
        const id2 = first?.id ?? first?.id_usuario ?? null;
        if (isNumericId(id2)) return id2;
      } catch {}
    }
  } catch {}

  return null;
}

export default function Correr() {
  const isFocused = useIsFocused();
  const { treinoId, titulo } = useLocalSearchParams<{ treinoId?: string; titulo?: string }>();
  const mapRef = useRef<MapView | null>(null);
  const watchRef = useRef<LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [running, setRunning] = useState(false);
  const [coords, setCoords] = useState<Coords[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [treinoAtivo, setTreinoAtivo] = useState<TreinoAtivo>(null);
  const [posting, setPosting] = useState(false);

  const paceMinPerKm = useMemo(() => {
    if (distanceKm <= 0) return 0;
    return elapsedSec / 60 / distanceKm;
  }, [elapsedSec, distanceKm]);

  const speedKmh = useMemo(() => {
    if (elapsedSec <= 0) return 0;
    return distanceKm / (elapsedSec / 3600);
  }, [elapsedSec, distanceKm]);

  // Carregar treino por ID (quando vier via params)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!treinoId) {
        setTreinoAtivo((t) => t ?? { nome: titulo || undefined });
        return;
      }
      try {
        const data = await apiFetch(`/treinos/${encodeURIComponent(String(treinoId))}`);
        if (!mounted || !data) return;
        setTreinoAtivo({
          id: data.id ?? data.id_treino ?? data.idTreino,
          nome: data.nome ?? titulo ?? "Treino",
          nivel: data.nivel ?? undefined,
          descricao: data.descricao ?? undefined,
          distanciaMinKm: data.distanciaMinKm ?? data.distancia_min_km ?? null,
          distanciaMaxKm: data.distanciaMaxKm ?? data.distancia_max_km ?? null,
          duracaoAlvoMin: data.duracaoAlvoMin ?? data.duracao_alvo_min ?? null,
          paceAlvoMinpkm: data.paceAlvoMinpkm ?? data.pace_alvo_minpkm ?? null,
        });
      } catch {
        setTreinoAtivo({ nome: titulo ?? "Treino" });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [treinoId, titulo]);

  const requestPerms = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua localização para registrar a corrida."
      );
      return false;
    }
    if (Platform.OS === "android") {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled)
        Alert.alert("GPS desativado", "Ative o GPS para iniciar a corrida.");
    }
    return true;
  }, []);

  const centerOnUserOnce = useCallback(async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      mapRef.current?.animateCamera({
        center: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        zoom: 16,
      });
    } catch {}
  }, []);

  const startRun = useCallback(async () => {
    const ok = await requestPerms();
    if (!ok) return;
    setRunning(true);
    setElapsedSec(0);
    setDistanceKm(0);
    setCoords([]);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setInterval(() => setElapsedSec((t) => t + 1), 1000);

    watchRef.current?.remove();
    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        timeInterval: 1000,
      },
      (pos) => {
        setCoords((prev) => {
          const next: Coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timestamp: pos.timestamp ?? Date.now(),
          };
          if (prev.length > 0) {
            const inc = haversine(prev[prev.length - 1], next);
            if (isFinite(inc) && inc > 0) setDistanceKm((d) => d + inc);
          }
          return [...prev, next];
        });
      }
    );
  }, [requestPerms]);

  const stopRun = useCallback(async () => {
    setRunning(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    watchRef.current?.remove();

    if (coords.length < 2) {
      Alert.alert(
        "Corrida muito curta",
        "Movimente-se um pouco mais para registrar a atividade."
      );
      return;
    }

    try {
      setPosting(true);

      // 🔐 resolve o ID do usuário de forma confiável (nunca email)
      const usuarioId = await fetchCurrentUserId();
      if (!isNumericId(usuarioId)) {
        throw new Error(
          "Não foi possível identificar seu usuário (ID). Faça login novamente e tente de novo."
        );
      }

      const dataHojeISO = dayjs().format("YYYY-MM-DD");
      const kcal = Math.round(70 * 8 * (elapsedSec / 3600));
      const paceDecimal = Number(
        ((elapsedSec / 60) / Math.max(distanceKm, 0.0001)).toFixed(2)
      );
      const vMedia = Number((speedKmh || 0).toFixed(2));

      const historico = await apiFetch("/historico-treinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId,
          treinoId: treinoAtivo?.id ?? null,
          data: dataHojeISO,
          distancia: Number(distanceKm.toFixed(2)),
          kcal: Number(kcal.toFixed(0)),
          pace: paceDecimal,
          tempo: Number((elapsedSec / 60).toFixed(2)), // minutos
          v_media: vMedia,
        }),
      });

      const historicoId =
        historico?.id ??
        historico?.id_historico_treino ??
        historico?.body?.id;
      if (!historicoId)
        throw new Error("Não foi possível obter o ID do histórico.");

      // >>> dentro do stopRun, antes de enviar o batch:

// 1) Monta com formato ISO_LOCAL_DATE_TIME (SEM milissegundos, COM 'T')
const batchTry1 = coords.map((c) => ({
  historicoTreinoId: historicoId,
  latitude: c.latitude,
  longitude: c.longitude,
  // formato aceito por LocalDateTime padrão:
  momento: dayjs(c.timestamp).format("YYYY-MM-DDTHH:mm:ss"),
}));

try {
  // tenta com 'momento' formatado
  await apiFetch("/treinos-pontos-gps/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batchTry1),
  });
} catch (err: any) {
  // Se o back ainda não aceitar, caímos no fallback:
  const msg = err?.response?.data?.message || err?.message || "";
  const isDateParse =
    typeof msg === "string" &&
    msg.includes("Cannot deserialize value of type `java.time.LocalDateTime`");

  if (!isDateParse) {
    throw err; // não é erro de data: repropaga
  }

  // 2) Fallback: remove 'momento' para o servidor usar LocalDateTime.now()
  const batchTry2 = coords.map((c) => ({
    historicoTreinoId: historicoId,
    latitude: c.latitude,
    longitude: c.longitude,
    // sem 'momento'
  }));

  await apiFetch("/treinos-pontos-gps/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batchTry2),
  });
}

      const batch = coords.map((c) => ({
        historicoTreinoId: historicoId,
        latitude: c.latitude,
        longitude: c.longitude,
        //momento: dayjs(c.timestamp).format("YYYY-MM-DD HH:mm:ss"),
      }));

      await apiFetch("/treinos-pontos-gps/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });

      Alert.alert("Corrida salva! ✅", "Seu percurso e métricas foram registrados.");
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro ao salvar", e?.message || "Tente novamente mais tarde.");
    } finally {
      setPosting(false);
    }
  }, [coords, distanceKm, elapsedSec, speedKmh, treinoAtivo]);

  useEffect(() => {
    if (isFocused) centerOnUserOnce();
  }, [isFocused, centerOnUserOnce]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      watchRef.current?.remove();
    };
  }, []);

  const initialRegion = useMemo(
    () => ({
      latitude: -23.55052,
      longitude: -46.633308,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    []
  );

  const polylineCoords = useMemo(
    () => coords.map(({ latitude, longitude }) => ({ latitude, longitude })),
    [coords]
  );

  const metas =
    treinoAtivo?.distanciaMinKm ||
    treinoAtivo?.distanciaMaxKm ||
    treinoAtivo?.duracaoAlvoMin ||
    treinoAtivo?.paceAlvoMinpkm
      ? [
          (treinoAtivo?.distanciaMinKm != null || treinoAtivo?.distanciaMaxKm != null)
            ? `Dist.: ${treinoAtivo?.distanciaMinKm ?? "?"}–${treinoAtivo?.distanciaMaxKm ?? "?"} km`
            : null,
          treinoAtivo?.duracaoAlvoMin != null ? `Duração: ${treinoAtivo?.duracaoAlvoMin} min` : null,
          treinoAtivo?.paceAlvoMinpkm != null ? `Pace: ${treinoAtivo?.paceAlvoMinpkm} min/km` : null,
        ].filter(Boolean).join(" • ")
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        initialRegion={initialRegion}
      >
        {polylineCoords.length > 1 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor={colors.accent}
            strokeWidth={6}
          />
        )}
        {polylineCoords.length > 0 && (
          <Marker coordinate={polylineCoords[0]} title="Início" />
        )}
        {polylineCoords.length > 1 && (
          <Marker
            coordinate={polylineCoords[polylineCoords.length - 1]}
            title="Agora"
          />
        )}
      </MapView>

      {/* HUD topo */}
      <View style={styles.topbar}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            GPS: {running ? "Gravando" : "Pronto"}
          </Text>
        </View>
        <Pressable
          style={styles.pill}
          onPress={() => Linking.openURL("https://www.google.com/maps")}
        >
          <Text style={styles.pillText}>
            {treinoAtivo?.nome ? `Plano: ${treinoAtivo.nome}` : "Corrida livre"}
          </Text>
        </Pressable>
      </View>

      {/* Painel inferior */}
      <View style={styles.panel}>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Tempo</Text>
            <Text style={styles.metricValue}>{fmtTime(elapsedSec)}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Distância</Text>
            <Text style={styles.metricValue}>{distanceKm.toFixed(2)} km</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Ritmo</Text>
            <Text style={styles.metricValue}>{fmtPace(paceMinPerKm)}</Text>
          </View>
        </View>

        <View style={styles.trainCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.trainTitle}>
              Treino ativo: {treinoAtivo?.nome || "—"}
            </Text>
            {!!treinoAtivo?.nivel && (
              <Text style={styles.trainMeta}>Nível: {treinoAtivo?.nivel}</Text>
            )}
            {!!metas && <Text style={styles.trainMeta}>{metas}</Text>}
          </View>
          <Pressable
            style={styles.btnGhost}
            onPress={() =>
              Alert.alert("Plano", treinoAtivo?.descricao || "Sem plano vinculado")
            }
          >
            <Text style={styles.btnGhostText}>Ver plano</Text>
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            disabled={posting}
            style={[styles.btnGhost, { flex: 1, opacity: posting ? 0.6 : 1 }]}
            onPress={centerOnUserOnce}
          >
            <Text style={styles.btnGhostText}>Centralizar</Text>
          </Pressable>

          <Pressable
            disabled={posting}
            style={[styles.btnPrimary, { flex: 2, opacity: posting ? 0.6 : 1 }]}
            onPress={running ? stopRun : startRun}
          >
            <Text style={styles.btnPrimaryText}>
              {running ? "Finalizar corrida" : "Iniciar corrida"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
