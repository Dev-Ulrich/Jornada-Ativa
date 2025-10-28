import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { registerRequest, saveToken, type RegisterPayload } from "../../lib/api";
import { styles } from "../../src/auth/escolherNivel.styles";

// 🔒 draft com todos os campos OBRIGATÓRIOS (mesmo tipo do back, só sem 'nivel')
type RequiredDraft = Omit<RegisterPayload, "nivel"> & { foto?: string | null };

// mapeia o texto exibido no card -> enum do backend (sem acentos e em CAIXA ALTA)
function normalizeNivel(label: string): RegisterPayload["nivel"] {
  const key = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  if (key.startsWith("INICIANTE")) return "Iniciante";
  if (key.startsWith("INTERMEDIARIO")) return "Intermediario";
  if (key.startsWith("AVANCADO")) return "Avancado";
  return "Iniciante";
}

export default function EscolherNivel() {
  const { draft } = useLocalSearchParams<{ draft?: string }>();

  // ✅ Faz o parse garantindo o tipo RequiredDraft (sem opcionais)
  const base = useMemo<RequiredDraft | null>(() => {
    try {
      if (!draft) return null;
      return JSON.parse(decodeURIComponent(draft)) as RequiredDraft;
    } catch {
      return null;
    }
  }, [draft]);

  // Se não veio draft, volta para o cadastro
  if (!base) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Ops…</Text>
          <Text style={styles.subtitle}>
            Não encontramos seus dados de cadastro. Volte e preencha novamente.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/auth/cadastro")}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Voltar ao cadastro</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Estado local da seleção (texto do card)
  const [nivelLabel, setNivelLabel] =
    useState<"" | "Iniciante" | "Intermediário" | "Avançado">("");

  const niveis = [
    {
      id: "Iniciante" as const,
      titulo: "Iniciante",
      descricao:
        "Treinos leves e progressivos para ganhar base e condicionamento. Alterna caminhada com corrida leve.",
      exemplo: "Ex: 20–40 min com blocos de 1 min correndo / 2 min caminhando.",
    },
    {
      id: "Intermediário" as const,
      titulo: "Intermediário / Amador",
      descricao:
        "Treinos moderados com foco em ritmo e distância. Combina contínuos e intervalados.",
      exemplo: "Ex: 40–60 min contínuo + 5×400 m de tiros leves/moderados.",
    },
    {
      id: "Avançado" as const,
      titulo: "Avançado / Atleta",
      descricao:
        "Treinos intensos com foco em performance. Inclui ritmo, intervalos longos e subidas.",
      exemplo: "Ex: 8–12 km ritmo moderado/forte, treinos de subida, intervalos longos.",
    },
  ];

  async function handleConcluir() {
    if (!nivelLabel) return Alert.alert("Atenção", "Selecione um nível para continuar.");

    // 🔁 normaliza para o enum do backend
    const nivel = normalizeNivel(nivelLabel);

    // ✅ base é RequiredDraft (sem opcionais), então não quebra o tipo de RegisterPayload
    const payload = { ...base, nivel } as RegisterPayload;

    try {
      const { token } = await registerRequest(payload);
      if (token) await saveToken(token);
      Alert.alert("Sucesso", "Cadastro concluído!");
      router.replace("/auth/login");
    } catch (e: any) {
      Alert.alert("Erro no cadastro", e?.message ?? "Tente novamente.");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Escolha seu nível</Text>
        <Text style={styles.subtitle}>
          Selecione o nível que melhor representa seu momento atual. Você pode mudar depois nas configurações.
        </Text>

        {niveis.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.card, nivelLabel === n.id && styles.cardSelected]}
            onPress={() => setNivelLabel(n.id)}
            activeOpacity={0.9}
          >
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>{n.titulo}</Text>
              <View style={styles.radio}>{nivelLabel === n.id && <View style={styles.radioInner} />}</View>
            </View>
            <Text style={styles.desc}>{n.descricao}</Text>
            <Text style={styles.examples}>{n.exemplo}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, !nivelLabel && styles.buttonDisabled]}
          onPress={handleConcluir}
          disabled={!nivelLabel}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Concluir cadastro</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
