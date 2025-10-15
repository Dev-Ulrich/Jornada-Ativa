import { useEffect, useState } from "react";

export default function HealthIndicator() {
  const [status, setStatus] = useState("checking");
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  async function checkHealth() {
    try {
      // pega o token do localStorage
      const token = localStorage.getItem("ja_token");

      const res = await fetch(`${baseURL}/health`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined, // sem header se ainda não logou
      });

      setStatus(res.ok ? "online" : "offline");
    } catch {
      setStatus("offline");
    }
  }

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 5000);
    return () => clearInterval(id);
  }, []);

  const color =
    status === "online"
      ? "#3adb3a"
      : status === "offline"
      ? "#db3a3a"
      : "#ffb300";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 4px",
      }}
    >
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
