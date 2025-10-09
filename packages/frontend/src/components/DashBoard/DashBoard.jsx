import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaPowerOff, FaRunning, FaCalendarAlt } from "react-icons/fa";
import UsuarioTabela from "@components/Usuario/UsuarioTabela";
import EventoTabela from "@components/Evento/EventoTabela";
import TreinoTabela from "@components/Treino/TreinoTabela";
import api from "@services/api"; // ✅ axios centralizado

import GraficoUsuarios from "@components/DashBoard/GraficoUsuarios";
import Calendario from "@components/DashBoard/Calendario";
import EventosMes from "@components/DashBoard/EventosMes";
import ProximosEventos from "@components/DashBoard/ProximosEventos";

import "./DashBoard.css";
import Sidebar from "@components/DashBoard/Sidebar";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

const DashBoard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const [usuarios, setUsuarios] = useState([]);
  const [treinos, setTreinos] = useState([]);

  // 🔹 KPIs
  const [metrics, setMetrics] = useState({
    totalEventos: 0,
    totalEventosAtivos: 0,
    totalUsuarios: 0,
    totalInscricoes: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // 🔹 Próximos eventos (compartilhado por Calendário e Tabela)
  const [proximosEventos, setProximosEventos] = useState([]);
  const [loadingProx, setLoadingProx] = useState(true);

  // Normalizador do backend -> front
  const mapProximos = (arr = []) =>
    (Array.isArray(arr) ? arr : []).map((e, i) => ({
      id: e.id ?? e.idEvento ?? e.id_evento ?? i,
      nome: e.nome ?? e.titulo ?? e.name ?? "-",
      data: e.data ?? e.dataEvento ?? e.date ?? null,         // aceita ISO ou DD/MM/YYYY
      hora: e.hora ?? e.horario ?? e.time ?? e.horaEvento ?? null,
      status: (e.status ?? e.ativo ?? e.active) ? "Ativo" : "Inativo",
    }));

  // 🔹 Busca KPIs
  async function loadMetrics() {
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
  }

  // 🔹 Carrega KPIs ao entrar no dashboard
  useEffect(() => {
    if (activeSection === "dashboard") {
      loadMetrics();
    }
  }, [activeSection]);

  // 🔹 Carrega próximos eventos (uma vez só)
  useEffect(() => {
    (async () => {
      try {
        setLoadingProx(true);
        const { data } = await api.get("/eventos/proximos");
        setProximosEventos(mapProximos(Array.isArray(data) ? data : data?.items || data?.results || []));
      } catch (e) {
        console.error("Falha ao carregar /eventos/proximos:", e);
        setProximosEventos([]); // mantém vazio se falhar
      } finally {
        setLoadingProx(false);
      }
    })();
  }, []);

  // 🔹 Carrega seções listagens
  useEffect(() => {
    if (activeSection === "usuario") {
      import("../../services/api").then(({ default: api }) => {
        api
          .get("/usuarios")
          .then((response) => setUsuarios(response.data))
          .catch((error) => console.error("Erro ao buscar usuários: ", error));
      });
    }
    if (activeSection === "treino") {
      import("../../services/api").then(({ default: api }) => {
        api
          .get("/treinos")
          .then((response) => setTreinos(response.data))
          .catch((error) => console.error("Erro ao buscar treinos: ", error));
      });
    }
  }, [activeSection]);

  // 🔹 Dark mode
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
        {activeSection === "dashboard" && (
          <>
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

            {/* Gráfico + Calendário + Eventos por mês + Próximos eventos */}
            <section className="dashboard-row-2col">
              <div className="dashboard-col">
                <GraficoUsuarios height={320} />
              </div>

              <div className="dashboard-col">
                {/* ✅ Calendário consome /eventos/proximos */}
                <Calendario eventos={proximosEventos} size="compact" />
              </div>

              <div className="dashboard-col">
                <EventosMes height={200} />
              </div>

              <div className="dashboard-col">
                {/* ✅ Tabela também consome o mesmo array */}
                <ProximosEventos eventos={proximosEventos} limite={5} />
              </div>

              <footer className="ja-inline-footer">
                © {new Date().getFullYear()} Jornada Ativa · Dashboard
              </footer>
            </section>
          </>
        )}

        {activeSection === "usuario" && (
          <UsuarioTabela usuarios={usuarios} setUsuarios={setUsuarios} />
        )}

        {activeSection === "eventos" && <EventoTabela />}

        {activeSection === "treino" && <TreinoTabela treinos={treinos} />}
      </main>
    </div>
  );
};

export default DashBoard;
