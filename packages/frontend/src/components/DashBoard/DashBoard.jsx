import { useEffect, useState } from "react";
import api from "@services/api";

import GraficoUsuarios from "@components/DashBoard/GraficoUsuarios";
import Calendario from "@components/DashBoard/Calendario";
import EventosMes from "@components/DashBoard/EventosMes";
import ProximosEventos from "@components/DashBoard/ProximosEventos";

import "./DashBoard.css";
import Sidebar from "@components/DashBoard/Sidebar";

const DashBoard = () => {
  // Mantemos para o Sidebar (se ele usar highlight do item atual)
  const [activeSection, setActiveSection] = useState("dashboard");

  // KPIs
  const [metrics, setMetrics] = useState({
    totalEventos: 0,
    totalEventosAtivos: 0,
    totalUsuarios: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Próximos eventos (compartilhado por Calendário e tabela)
  const [proximosEventos, setProximosEventos] = useState([]);
  const [loadingProx, setLoadingProx] = useState(true);

  // Normalizador do backend -> front
  const mapProximos = (arr = []) =>
    (Array.isArray(arr) ? arr : []).map((e, i) => ({
      id: e.id ?? e.idEvento ?? e.id_evento ?? i,
      nome: e.nome ?? e.titulo ?? e.name ?? "-",
      data: e.data ?? e.dataEvento ?? e.date ?? null,   // ISO ou DD/MM/YYYY
      hora: e.hora ?? e.horario ?? e.time ?? null,
      status: (e.status ?? e.ativo ?? e.active) ? "Ativo" : "Inativo",
    }));

  // KPIs
  useEffect(() => {
    (async () => {
      try {
        setLoadingMetrics(true);
        const [usuariosCount, eventosCount, eventosAtivosCount] = await Promise.all([
          api.get("/usuarios/count"),
          api.get("/eventos/count"),
          api.get("/eventos/ativos/count"),
        ]);
        setMetrics({
          totalUsuarios: usuariosCount.data,
          totalEventos: eventosCount.data,
          totalEventosAtivos: eventosAtivosCount.data,
        });
      } catch (error) {
        console.error("Erro ao buscar métricas do dashboard:", error);
      } finally {
        setLoadingMetrics(false);
      }
    })();
  }, []);

  // Próximos eventos
  useEffect(() => {
    (async () => {
      try {
        setLoadingProx(true);
        const { data } = await api.get("/eventos/proximos");
        const list = Array.isArray(data) ? data : data?.items || data?.results || [];
        setProximosEventos(mapProximos(list));
      } catch (e) {
        console.error("Falha ao carregar /eventos/proximos:", e);
        setProximosEventos([]);
      } finally {
        setLoadingProx(false);
      }
    })();
  }, []);

  // Dark mode (mesma lógica que você já usa)
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("dark-mode");
    return storedDarkMode === "active";
  });
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "active");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "inactive");
    }
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode((p) => !p);

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="main">
        {/* KPIs */}
        <section className="stats-row">
          <div className="stat-card">
            <span>Eventos criados:</span>
            <h1>{loadingMetrics ? "..." : metrics.totalEventos}</h1>
          </div>
          <div className="stat-card">
            <span>Eventos ativos:</span>
            <h1>{loadingMetrics ? "..." : metrics.totalEventosAtivos}</h1>
          </div>
          <div className="stat-card">
            <span>Usuários cadastrados:</span>
            <h1>{loadingMetrics ? "..." : metrics.totalUsuarios}</h1>
          </div>
        </section>

        {/* GRID principal do dashboard */}
        <section className="dashboard-grid">
          {/* Coluna 1: gráfico grande + eventos por mês */}
          <div className="grid-item span-2">
            <GraficoUsuarios height={320} />
          </div>

          {/* Coluna 2: calendário compacto */}
          <div className="grid-item">
            <Calendario eventos={proximosEventos} size="compact" />
          </div>

          <div className="grid-item">
            <EventosMes height={220} />
          </div>

          <div className="grid-item">
            <ProximosEventos eventos={proximosEventos} limite={5} loading={loadingProx} />
          </div>
        </section>

        <footer className="ja-inline-footer">
          © {new Date().getFullYear()} Jornada Ativa · Dashboard
        </footer>
      </main>
    </div>
  );
};

export default DashBoard;
