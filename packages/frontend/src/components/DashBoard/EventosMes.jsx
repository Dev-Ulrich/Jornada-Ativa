import { useEffect, useMemo, useState } from "react";
import api from "@services/api";
import "./EventosMes.css";

/**
 * Eventos por mês
 * - Busca em /admin/eventos/metricas/mensal
 * - Mostra BarChart (Recharts) se instalado
 * - Fallback CSS (barrinhas) se não houver Recharts
 * Props:
 *  - height?: number (px) — default 220
 */
export default function EventosMes({ height = 220 }) {
  const [charts, setCharts] = useState(null);        // componentes do recharts
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [errCharts, setErrCharts] = useState("");

  const [dados, setDados] = useState([]);            // [{ mes, eventos }]
  const [loadingData, setLoadingData] = useState(true);
  const [errData, setErrData] = useState("");

  // mapeia payload flexível
  const mapEventosMes = (resp) =>
    (resp || []).map((r) => ({
      mes: r.mes || r.label || r.month || "",
      eventos: r.eventos ?? r.value ?? r.count ?? 0,
    }));

  // Carregar dados
  useEffect(() => {
    (async () => {
      try {
        setLoadingData(true);
        setErrData("");
        const { data } = await api.get("/admin/eventos/metricas/mensal");
        setDados(mapEventosMes(data));
      } catch (e) {
        console.error(e);
        setErrData("Falha ao carregar métricas de eventos mensais.");
        setDados([]); // fallback: vazio
      } finally {
        setLoadingData(false);
      }
    })();
  }, []);

  // Carregar Recharts dinamicamente (sem quebrar se não estiver instalado)
  useEffect(() => {
    (async () => {
      try {
        setLoadingCharts(true);
        setErrCharts("");
        const mod = await import("recharts");
        setCharts({
          ResponsiveContainer: mod.ResponsiveContainer,
          BarChart: mod.BarChart,
          Bar: mod.Bar,
          XAxis: mod.XAxis,
          YAxis: mod.YAxis,
          Tooltip: mod.Tooltip,
          CartesianGrid: mod.CartesianGrid,
        });
      } catch (e) {
        console.warn("[EventosMes] Recharts não encontrado. Rode: npm i recharts");
        setErrCharts("Recharts não encontrado. Rode: npm i recharts");
      } finally {
        setLoadingCharts(false);
      }
    })();
  }, []);

  // sanity (dev only)
  if (import.meta?.env?.MODE !== "production") {
    const ok = dados.every(
      (x) => typeof x?.mes === "string" && typeof x?.eventos === "number"
    );
    if (!ok) console.warn("[EventosMes] shape inesperado:", dados);
  }

  const max = useMemo(
    () => Math.max(1, ...dados.map((d) => d.eventos)),
    [dados]
  );

  return (
    <div className="eventos-card" style={{ "--chart-h": `${height}px` }}>
      <div className="eventos-header">
        <h3>Eventos por mês</h3>
      </div>

      <div className="eventos-body">
        {loadingData && <div className="eventos-hint">Carregando dados…</div>}
        {errData && <div className="eventos-warn">{errData}</div>}

        {/* Recharts */}
        {charts && dados.length > 0 && (
          <charts.ResponsiveContainer width="100%" height={height}>
            <charts.BarChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <charts.CartesianGrid strokeDasharray="3 3" stroke="var(--color-base)" />
              <charts.XAxis dataKey="mes" stroke="var(--text-base)" />
              <charts.YAxis stroke="var(--text-base)" allowDecimals={false} />
              <charts.Tooltip
                contentStyle={{
                  background: "var(--bg-base)",
                  border: `1px solid var(--color-base)`,
                  color: "var(--text-base)",
                }}
              />
              <charts.Bar dataKey="eventos" fill="var(--color-base)" radius={[6,6,0,0]} />
            </charts.BarChart>
          </charts.ResponsiveContainer>
        )}

        {/* Fallback sem Recharts */}
        {!charts && !loadingCharts && (
          <>
            {errCharts && <div className="eventos-warn">{errCharts} <code>npm i recharts</code></div>}
            <div className="eventos-mini-bars">
              {dados.length === 0 && !loadingData && !errData && (
                <div className="eventos-empty">Sem dados para exibir.</div>
              )}
              {dados.map((d, i) => (
                <div key={i} className="ev-bar-item" title={`${d.mes}: ${d.eventos}`}>
                  <div
                    className="ev-bar"
                    style={{ height: `${(d.eventos / max) * 100}%` }}
                  />
                  <div className="ev-bar-label">{d.mes}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
