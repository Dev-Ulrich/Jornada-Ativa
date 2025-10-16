import { useEffect, useState } from "react";

export default function HealthIndicator() {
  const [status, setStatus] = useState("checking");
  const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

  async function checkHealth() {
    try {
      const res = await fetch(`${baseURL}/health`, {
        headers: { Accept: "application/json" }, // sem Authorization aqui
      });

      if (!res.ok) return setStatus("offline");

      // tenta ler json, se falhar considera ok mesmo assim
      try {
        const data = await res.json();
        if (data?.status && String(data.status).toUpperCase() !== "UP") {
          return setStatus("offline");
        }
      } catch {
        /* ignore: pode ser texto simples */
      }

      setStatus("online");
    } catch {
      setStatus("offline");
    }
  }

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 10000); // 10s é suficiente
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
