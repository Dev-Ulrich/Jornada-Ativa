import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaPowerOff, FaRunning, FaCalendarAlt } from "react-icons/fa";
import UsuarioTabela from "@components/Usuario/UsuarioTabela";
import EventoTabela from "@components/Evento/EventoTabela";
import TreinoTabela from "@components/Treino/TreinoTabela";
import api from "@services/api"; // ✅ usa o axios centralizado
import "./DashBoard.css"; 
import Sidebar from "@components/DashBoard/Sidebar";


const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

const DashBoard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const [usuarios, setUsuarios] = useState([]);
  const [treinos, setTreinos] = useState([]);

  // 🔹 Novos estados para métricas do dashboard
  const [metrics, setMetrics] = useState({
    totalEventos: 0,
    totalEventosAtivos: 0,
    totalUsuarios: 0,
    totalInscricoes: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // 🔹 Função para buscar métricas no backend
  async function loadMetrics() {
    try {
      setLoadingMetrics(true);

      const [usuariosCount, eventosCount, eventosAtivosCount, inscricoesCount] =
        await Promise.all([
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

  

  // 🔹 Carrega métricas quando abrir a tela de dashboard
  useEffect(() => {
    if (activeSection === "dashboard") {
      loadMetrics();
    }
  }, [activeSection]);

  // 🔹 Lógica já existente de carregamento dinâmico
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

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

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
          </>
        )}

        {activeSection === "usuario" && (
          <UsuarioTabela usuarios={usuarios} setUsuarios={setUsuarios} />
        )}
        {activeSection === "comunidade" && <ComunidadeTabela />}
        {activeSection === "eventos" && <EventoTabela />}
        {activeSection === "treino" && <TreinoTabela treinos={treinos} />}
      </main>
    </div>
  );
};

export default DashBoard;
