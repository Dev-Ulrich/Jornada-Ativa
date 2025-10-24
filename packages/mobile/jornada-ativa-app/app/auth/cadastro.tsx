// app/auth/cadastro.tsx
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { styles } from "../../src/auth/cadastro.styles";
import type { RegisterPayload } from "../../lib/api";
import { router } from "expo-router";


// ---------- Tipos ----------
type Genero = "" | RegisterPayload["genero"];

type RootStackParamList = {
  EscolherNivel: {
    draft: Omit<RegisterPayload, "nivel"> & { foto?: string | null };
  };
  // outras rotas…
};

// ---------- Utils ----------
function isEmailOk(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// máscara dd/mm/aaaa
function formatDateDDMMYYYY(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function toISOFromDDMMYYYY(s: string) {
  const [dd, mm, yyyy] = s.split("/");
  if (!dd || !mm || !yyyy || dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4) {
    throw new Error("Data inválida");
  }
  return `${yyyy}-${mm}-${dd}`; // yyyy-MM-dd
}

function isValidDateDDMMYYYY(s: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return false;
  const dd = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const yyyy = parseInt(m[3], 10);
  if (mm < 1 || mm > 12) return false;
  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) return false;
  const date = new Date(yyyy, mm - 1, dd);
  if (date.getTime() > Date.now()) return false; // opcional: não permite futuro
  return true;
}

// ---------- Componente ----------
export default function Cadastro() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [genero, setGenero] = useState<Genero>("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  const showPlaceholder = genero === "";

  async function handleSelecionarFoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      return Alert.alert("Permissão necessária", "Autorize o acesso às suas fotos.");
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
    });
    if (!res.canceled) setFotoPerfil(res.assets[0].uri);
  }

  async function handleAvancarNivel() {
    // validações
    if (!isEmailOk(email)) return Alert.alert("Atenção", "Informe um e-mail válido.");
    if (senha.length < 6) return Alert.alert("Atenção", "A senha deve ter no mínimo 6 caracteres.");
    if (!nome.trim()) return Alert.alert("Atenção", "Informe o nome.");
    if (!isValidDateDDMMYYYY(nascimento)) {
      return Alert.alert("Atenção", "Informe uma data válida no formato dd/mm/aaaa.");
    }
    if (!genero) return Alert.alert("Atenção", "Selecione o gênero.");
    if (!altura.trim()) return Alert.alert("Atenção", "Informe a altura (ex.: 1.78).");
    if (!peso.trim()) return Alert.alert("Atenção", "Informe o peso (ex.: 68).");

    // monta o draft (no formato que o back espera depois)
    const draft: Omit<RegisterPayload, "nivel"> & { foto?: string | null } = {
      email,
      senha,
      nome,
      dataNascimento: toISOFromDDMMYYYY(nascimento),
      genero: genero as RegisterPayload["genero"],
      altura: parseFloat(altura.replace(",", ".")),
      peso: parseFloat(peso.replace(",", ".")),
      role: "ROLE_USER",
      foto: fotoPerfil ?? null,
    };

    router.push({
  pathname: "/auth/escolherNivel",
  params: { draft: encodeURIComponent(JSON.stringify(draft)) },
});
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: usuario@gmail.com"
          placeholderTextColor="#8f8f8f"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#8f8f8f"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: Fulano da Silva"
          placeholderTextColor="#8f8f8f"
          value={nome}
          onChangeText={setNome}
        />

        {/* Data de Nascimento */}
        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/aaaa"
          placeholderTextColor="#8f8f8f"
          keyboardType="number-pad"
          maxLength={10}
          value={nascimento}
          onChangeText={(t) => setNascimento(formatDateDDMMYYYY(t))}
          onBlur={() => {
            if (nascimento && !isValidDateDDMMYYYY(nascimento)) {
              Alert.alert("Data inválida", "Use o formato dd/mm/aaaa com uma data válida.");
            }
          }}
        />

        {/* Gênero */}
        <Text style={styles.label}>Gênero</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={genero}
            onValueChange={(v) => setGenero(v as RegisterPayload["genero"] | "")}
            dropdownIconColor="#ff8633"
            style={styles.picker}
            prompt="Selecione o gênero"
            mode="dropdown"
          >
            {showPlaceholder && (
              <Picker.Item label="Selecione o gênero" value="" color="#8f8f8f" />
            )}
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Feminino" value="Feminino" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>

        {/* Altura */}
        <Text style={styles.label}>Altura</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: 1.78"
          placeholderTextColor="#8f8f8f"
          keyboardType="decimal-pad"
          value={altura}
          onChangeText={setAltura}
        />

        {/* Peso */}
        <Text style={styles.label}>Peso</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: 68"
          placeholderTextColor="#8f8f8f"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />

        {/* Foto de Perfil (opcional) */}
        <Text style={styles.label}>Foto Perfil</Text>
        <TouchableOpacity style={styles.fileBox} onPress={handleSelecionarFoto} activeOpacity={0.8}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.preview} />
          ) : (
            <Text style={styles.fileBoxText}>Selecionar foto</Text>
          )}
        </TouchableOpacity>

        {/* Avançar para escolher nível */}
        <TouchableOpacity style={styles.button} onPress={handleAvancarNivel} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Escolher nível</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
