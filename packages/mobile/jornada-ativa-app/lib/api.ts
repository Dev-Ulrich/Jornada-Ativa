import * as SecureStore from "expo-secure-store";

const BASE_URL = 
    process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\$/, "") ||
    "https://jornada-ativa-api.onrender.com";
    



type LoginResponse = {token: string};

export type Genero = "Masculino" | "Feminio" | "Outro";

export type RegisterPayload = {
  email: string;
  senha: string;
  nome: string;
  dataNascimento: string; // dd/mm/aaaa
  genero: Genero;
  altura: number;
  peso: number;
  nivel: "Iniciante" | "Intermediario" | "Avancado";
  role?: "ROLE_USER";
  foto?: string | null; // opcional (URL/base64)
};

export type RegisterResponse = {
  token?: string;
  id?: number;
  email?: string;
  // ...outros campos que sua API devolve
};

export async function registerRequest(body: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }
  return data as RegisterResponse;
}


export async function loginRequest(email: string, senha: string): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },

        body: JSON.stringify({email, senha}),
    });

    if (!res.ok) {
        let msg = `Erro ${res.status}`;
        try {
            const data = await res.json();
            msg = data?.message || data?.error || msg;
        } catch {

            const txt = await res.text();
            if (txt) msg = txt;
        }

        throw new Error(msg);
    }

    const data = (await res.json()) as LoginResponse;
    if (!data?.token) throw new Error("Resposta sem tokem.");
    return data;
}

const TOKEN_KEY = "ja_token";

export async function saveToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function getToken(): Promise<String | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getToken();
  const headers = {
    ...(init.headers || {}),
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Erro ${res.status}`);
  }
  // tente json, senão devolve texto
  try {
    return await res.json();
  } catch {
    return null;
  }
}

