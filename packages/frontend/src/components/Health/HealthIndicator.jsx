import { useEffect, useState } from "react";

export default function HealthIndicator() {
  const [status, setStatus] = useState<"checking"|"online"|"offline">("checking");

  const envBase = import.meta.env.VITE_API_BASE_URL?.toString().trim();
  const baseURL = (envBase || "").replace(/\/+$/, ""); // remove barra final
  // fallback só se você REALMENTE tiver API local rodando:
  const api = baseURL || "http://localhost:8080";

  async function checkHealth() {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000); // 5s

    try {
      const res = await fetch(`${api}/health`, {
        headers: { Accept: "application/json" },
        signal: ctrl.signal,
        // mode: "cors",  // (o padrão já é 'cors' no navegador)
        // credentials: "omit",
      });

      if (!res.ok) return setStatus("offline");

      try {
        const data = await res.json();
        if (String(data?.status).toUpperCase() !== "UP") return setStatus("offline");
      } catch {
        /* ok se não for json */
      }

      setStatus("online");
    } catch {
      setStatus("offline");
    } finally {
      clearTimeout(t);
    }
  }

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 10000);
    return () => clearInterval(id);
  }, []);

  const color = status === "online" ? "#3adb3a" : status === "offline" ? "#db3a3a" : "#ffb300";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 4px" }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />
      <small style={{ color }}>
        {status === "checking" ? "Verificando..." : status === "online" ? "Online" : "Offline"}
      </small>
    </div>
  );
}
