// src/components/DashBoard/EventosMes.jsx
import { useEffect, useMemo, useState } from "react";
import api from "@services/api";
import "./EventosMes.css";

/**
 * Eventos por mês
 * - Tenta usar resposta agregada (array: [{mes,eventos}] ou objeto: {"2025-10":2})
 * - Se o pacote "recharts" estiver instalado, renderiza BarChart
 * - Caso contrário, exibe fallback CSS (barrinhas)
 *
 * Props:
 *  - height?: number (px) — default 220
 *  - endpoint?: string — default "/eventos/metricas/por-mes?ano=2025"
 */
export default function EventosMes({
  height = 220,
  endpoint = "/eventos/metricas/por-mes?ano=2025",
}) {
  const [charts, setCharts] = useState(null);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [errCharts, setErrCharts] = useState("");

  const [dados, setDados] = useState([]); // [{ mes, eventos }]
  const [loadingData, setLoadingData] = useState(true);
  const [errData, setErrData] = useState("");

  // ---------------- Utils de normalização ----------------
  const MESES_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  // Extrai um array de dentro de possíveis envelopes
  const pickArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return null; // pode não ser array
  };

  // Quando vem agregado como array de objetos
  const mapArrayAgregado = (arr) =>
    arr.map((r) => {
      // aceita "mes" como string ("Out") OU número ("10"/10) OU "month"
      let mesLabel = r.mes || r.label || r.month || r.mesNome;
      let mesNum = r.mesNumero ?? r.monthNumber ?? r.monthNum;

      if (typeof mesLabel === "number") mesNum = mesLabel;
      if (typeof mesLabel === "string") {
        const n = Number(mesLabel);
        if (!Number.isNaN(n)) mesNum = n; // "10" -> 10
      }

      if (mesNum != null) {
        const idx = Number(mesNum) - 1; // 1..12 -> 0..11
        if (idx >= 0 && idx < 12) mesLabel = MESES_PT[idx];
      }

      if (!mesLabel && typeof r?.mesNome === "string") {
        const nome = r.mesNome.slice(0, 3).toLowerCase(); // "outubro" -> "out"
        const idx = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"].indexOf(nome);
        mesLabel = idx >= 0 ? MESES_PT[idx] : r.mesNome;
      }

      const eventos =
        r.eventos ?? r.qtd ?? r.quantidade ?? r.value ?? r.total ?? r.count ?? 0;

      return { mes: String(mesLabel || ""), eventos: Number(eventos) || 0 };
    });

  // Quando vem como objeto/record: { "2025-10": 2 } / { "10": 2 } / { "Out": 2 }
  const mapObjetoAgregado = (obj) => {
    const out = Array(12).fill(0);
    for (const [k, v] of Object.entries(obj || {})) {
      let m; // 0..11
      const num = Number(k.slice(-2)); // "2025-10" -> 10, "10" -> 10
      if (!Number.isNaN(num) && num >= 1 && num <= 12) {
        m = num - 1;
      } else {
        const k3 = k.slice(0, 3).toLowerCase();
        const idx = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"].indexOf(k3);
        if (idx >= 0) m = idx;
      }
      if (m != null) out[m] = Number(v) || 0;
    }
    return out.map((qtd, i) => ({ mes: MESES_PT[i], eventos: qtd }));
  };

  // Normalizador geral (aceita array, objeto ou “envelopes”)
  const normalizeEventosMes = (payload) => {
    const arr = pickArray(payload);
    if (arr) {
      if (arr.length === 0) return [];
      const f = arr[0] ?? {};
      const pareceAgregado =
        (f.mes || f.label || f.month || f.mesNome || f.mesNumero || f.monthNumber) != null &&
        (f.eventos != null ||
          f.qtd != null ||
          f.quantidade != null ||
          f.value != null ||
          f.total != null ||
          f.count != null);
      return pareceAgregado ? mapArrayAgregado(arr) : [];
    }
    if (payload && typeof payload === "object") {
      return mapObjetoAgregado(payload);
    }
    return [];
  };
  // -------------------------------------------------------

  // Carregar dados
  useEffect(() => {
    (async () => {
      try {
        setLoadingData(true);
        setErrData("");
        const resp = await api.get(endpoint);
        setDados(normalizeEventosMes(resp?.data ?? resp));
      } catch (e) {
        console.error(e);
        setErrData("Falha ao carregar métricas de eventos mensais.");
        setDados([]);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [endpoint]);

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
    if (!ok) console.warn("[EventosMes] shape inesperado pós-normalização:", dados);
  }

  const max = useMemo(() => Math.max(1, ...dados.map((d) => d.eventos)), [dados]);

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
            <charts.BarChart
              data={dados}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <charts.CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-base)"
              />
              <charts.XAxis dataKey="mes" stroke="var(--text-base)" />
              <charts.YAxis stroke="var(--text-base)" allowDecimals={false} />
              <charts.Tooltip
                contentStyle={{
                  background: "var(--bg-base)",
                  border: `1px solid var(--color-base)`,
                  color: "var(--text-base)",
                }}
              />
              <charts.Bar
                dataKey="eventos"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
              />
            </charts.BarChart>
          </charts.ResponsiveContainer>
        )}

        {/* Fallback sem Recharts */}
        {!charts && !loadingCharts && (
          <>
            {errCharts && (
              <div className="eventos-warn">
                {errCharts} <code>npm i recharts</code>
              </div>
            )}
            <div className="eventos-mini-bars">
              {dados.length === 0 && !loadingData && !errData && (
                <div className="eventos-empty">Sem dados para exibir.</div>
              )}
              {dados.map((d, i) => (
                <div
                  key={i}
                  className="ev-bar-item"
                  title={`${d.mes}: ${d.eventos}`}
                >
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
