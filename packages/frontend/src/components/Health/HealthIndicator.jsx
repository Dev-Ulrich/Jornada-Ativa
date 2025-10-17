import { useEffect, useState } from "react";

export default function HealthIndicator() {
  const [status, setStatus] = useState("checking");

  // Lê a env e garante que não dá erro mesmo se vier vazia
  const raw = import.meta.env.VITE_API_BASE_URL || "";
  const base = raw.trim().replace(/\/+$/, "") || "http://localhost:8080";

  async function checkHealth() {
    let healthUrl = "";
    try {
      healthUrl = new URL("/health", base).toString();
    } catch {
      setStatus("offline");
      return;
    }

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);

    try {
      const res = await fetch(healthUrl, {
        headers: { Accept: "application/json" },
        signal: ctrl.signal,
      });

      if (!res.ok) {
        setStatus("offline");
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          const data = await res.json();
          if (String(data?.status).toUpperCase() !== "UP") {
            setStatus("offline");
            return;
          }
        } catch {
          // ignora erro de parse e considera online
        }
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
    const id = setInterval(checkHealth, 10000); // verifica a cada 10s
    return () => clearInterval(id);
  }, []);

  const color =
    status === "online"
      ? "#3adb3a"
      : status === "offline"
      ? "#db3a3a"
      : "#ffb300";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 4px" }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      <small style={{ color }}>
        {status === "checking"
          ? "Verificando..."
          : status === "online"
          ? "Online"
          : "Offline"}
      </small>
    </div>
  );
}
