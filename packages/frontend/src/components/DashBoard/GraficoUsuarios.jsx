import { useEffect, useMemo, useState } from "react";
import api from "@services/api";
import "./GraficoUsuarios.css";

/**
 * Componente: GraficoUsuarios
 * - Renderiza um gráfico de linha com cadastros de usuários
 * - Intervalos: "semana" | "mes" (toggle)
 * - Carrega Recharts via import dinâmico (sem quebrar build caso a lib não esteja instalada)
 */
export default function GraficoUsuarios() {
  const [modo, setModo] = useState("semana"); // "semana" | "mes"
  const [charts, setCharts] = useState(null); // componentes do recharts (dinâmico)
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [errCharts, setErrCharts] = useState("");

  const [usuariosSemana, setUsuariosSemana] = useState([]);
  const [usuariosMes, setUsuariosMes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errData, setErrData] = useState("");

  // === Util: mapeadores de shape (tolerantes a campos diferentes)
  const mapUsuariosSemana = (resp) =>
    (resp || []).map((r) => ({
      dia: r.dia || r.label || r.weekday || "",
      cadastros: r.cadastros ?? r.value ?? r.count ?? 0,
    }));

  const mapUsuariosMes = (resp) =>
    (resp || []).map((r) => ({
      mes: r.mes || r.label || r.month || "",
      cadastros: r.cadastros ?? r.value ?? r.count ?? 0,
    }));

  // === Carrega dados (semana / mês)
  useEffect(() => {
    (async () => {
      try {
        setLoadingData(true);
        setErrData("");
        const [weekUsers, monthUsers] = await Promise.all([
          api.get("/usuarios/metricas?range=semana"),
          api.get("/usuarios/metricas?range=mes"),
        ]);
        setUsuariosSemana(mapUsuariosSemana(weekUsers.data));
        setUsuariosMes(mapUsuariosMes(monthUsers.data));
      } catch (e) {
        console.error(e);
        setErrData("Falha ao carregar métricas de usuários.");
        // Fallback leve (opcional): mantém arrays vazios
        setUsuariosSemana([]);
        setUsuariosMes([]);
      } finally {
        setLoadingData(false);
      }
    })();
  }, []);

  // === Carrega Recharts dinamicamente (sem quebrar build)
  useEffect(() => {
    (async () => {
      try {
        setLoadingCharts(true);
        setErrCharts("");
        const mod = await import("recharts");
        setCharts({
          ResponsiveContainer: mod.ResponsiveContainer,
          LineChart: mod.LineChart,
          Line: mod.Line,
          XAxis: mod.XAxis,
          YAxis: mod.YAxis,
          Tooltip: mod.Tooltip,
          CartesianGrid: mod.CartesianGrid,
        });
      } catch (e) {
        console.warn(
          "[GraficoUsuarios] Recharts não encontrado. Rode: npm i recharts"
        );
        setErrCharts("Recharts não encontrado. Rode: npm i recharts");
      } finally {
        setLoadingCharts(false);
      }
    })();
  }, []);

  // === Dados ativos
  const dataSemana = useMemo(() => usuariosSemana, [usuariosSemana]);
  const dataMes = useMemo(() => usuariosMes, [usuariosMes]);
  const dataAtiva = modo === "semana" ? dataSemana : dataMes;

  // === Sanity checks (dev-only)
  if (import.meta?.env?.MODE !== "production") {
    const okSemana = dataSemana.every(
      (x) => typeof x?.dia === "string" && typeof x?.cadastros === "number"
    );
    const okMes = dataMes.every(
      (x) => typeof x?.mes === "string" && typeof x?.cadastros === "number"
    );
    if (!okSemana) console.warn("Shape inesperado (semana):", dataSemana);
    if (!okMes) console.warn("Shape inesperado (mês):", dataMes);
  }

  // === Render
  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <h3>
          Usuários cadastrados —{" "}
          {modo === "semana" ? "Última semana" : "Últimos 12 meses"}
        </h3>
        <div className="grafico-tabs">
          <button
            type="button"
            className={`tab-btn ${modo === "semana" ? "active" : ""}`}
            onClick={() => setModo("semana")}
          >
            Semana
          </button>
          <button
            type="button"
            className={`tab-btn ${modo === "mes" ? "active" : ""}`}
            onClick={() => setModo("mes")}
          >
            Mês
          </button>
        </div>
      </div>

      <div className="grafico-body">
        {loadingData && <div className="grafico-hint">Carregando dados…</div>}
        {errData && <div className="grafico-warn">{errData}</div>}

        {loadingCharts && (
          <div className="grafico-hint">Carregando gráfico…</div>
        )}
        {errCharts && (
          <div className="grafico-warn">
            {errCharts} <code>npm i recharts</code>
          </div>
        )}

        {charts && dataAtiva.length > 0 && (
          <charts.ResponsiveContainer width="100%" height={300}>
            <charts.LineChart
              data={dataAtiva}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <charts.CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-base)"
              />
              {modo === "semana" ? (
                <charts.XAxis dataKey="dia" stroke="var(--text-base)" />
              ) : (
                <charts.XAxis dataKey="mes" stroke="var(--text-base)" />
              )}
              <charts.YAxis stroke="var(--text-base)" allowDecimals={false} />
              <charts.Tooltip
                contentStyle={{
                  background: "var(--bg-base)",
                  border: `1px solid var(--color-base)`,
                  color: "var(--text-base)",
                }}
              />
              <charts.Line
                type="monotone"
                dataKey="cadastros"
                stroke="#ff8633" // <-- aqui
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </charts.LineChart>
          </charts.ResponsiveContainer>
        )}

        {charts && dataAtiva.length === 0 && !loadingData && !errData && (
          <div className="grafico-empty">Sem dados para exibir.</div>
        )}
      </div>
    </div>
  );
}
