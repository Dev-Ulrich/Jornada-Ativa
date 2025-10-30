import * as SecureStore from "expo-secure-store";

export const BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL || "https://jornada-ativa-api.onrender.com").replace(/\/$/, "");

// ----------------- Auth DTOs -----------------
type LoginResponse = { token: string };

export type Genero = "Masculino" | "Feminino" | "Outro";

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

// ----------------- Requests diretos -----------------
export async function registerRequest(body: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const txt = await res.text();
  let data: any = {};
  try { data = JSON.parse(txt); } catch {}

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }
  return data as RegisterResponse;
}

export async function loginRequest(email: string, senha: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, senha }),
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
  if (!data?.token) throw new Error("Resposta sem token.");
  return data;
}

// ----------------- Token helpers -----------------
const TOKEN_KEY = "ja_token";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ----------------- Fetch com bearer -----------------
export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const baseHeaders: Record<string, string> = { Accept: "application/json" };
  if (init.body !== undefined && !(init.headers as any)?.["Content-Type"]) {
    baseHeaders["Content-Type"] = "application/json";
  }
  if (token) baseHeaders.Authorization = `Bearer ${token}`;

  const headers: Record<string, string> = {
    ...baseHeaders,
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Erro ${res.status}`);
  }

  const text = await res.text().catch(() => "");
  if (!text) return null as T;
  try { return JSON.parse(text) as T; } catch { return text as T; }
}

// ----------------- Cliente com métodos (DEFAULT) -----------------
type Query = Record<string, string | number | boolean | undefined | null>;

function toQuery(q?: Query): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

const api = {
  get<T = any>(path: string, q?: Query) {
    return apiFetch<T>(`${path}${toQuery(q)}`, { method: "GET" });
  },
  post<T = any>(path: string, body?: any) {
    return apiFetch<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined });
  },
  put<T = any>(path: string, body?: any) {
    return apiFetch<T>(path, { method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined });
  },
  patch<T = any>(path: string, body?: any) {
    return apiFetch<T>(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined });
  },
  delete<T = any>(path: string) {
    return apiFetch<T>(path, { method: "DELETE" });
  },
};

export default api;
