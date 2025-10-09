// src/components/DashBoard/Sidebar.jsx
import { useMemo, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaRunning, FaCalendarAlt, FaBars, FaPowerOff } from "react-icons/fa";
import HealthIndicator from "@components/Health/HealthIndicator";
import "./Sidebar.css";

export default function Sidebar({
  activeSection,
  setActiveSection,
  darkMode,
  toggleDarkMode,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const usuarioLogado = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuarioLogado")) || {};
    } catch {
      return {};
    }
  }, []);

  const handleToggleOpen = () => setIsOpen((v) => !v);

  return (
    <nav id="sidebar" className={isOpen ? "open-sidebar" : ""}>
      <div id="sidebar_content">
        {/* Status de saúde */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <HealthIndicator />
        </div>

        {/* Usuário */}
        <div id="user">
          {usuarioLogado?.foto ? (
            <img
              src={usuarioLogado.foto}
              id="user_avatar"
              alt={`Avatar de ${usuarioLogado?.nome || "Usuário"}`}
            />
          ) : (
            <div
              className="avatar-initial"
              aria-label={`Avatar de ${usuarioLogado?.nome || "Usuário"}`}
              role="img"
            >
              {(usuarioLogado?.nome?.trim()?.[0] || "U").toUpperCase()}
            </div>
          )}

          <div id="user_infos">
            <span className="item-description name">
              {usuarioLogado?.nome || "Usuário"}
            </span>
            <span className="item-description email">
              {usuarioLogado?.email || "email@email.com"}
            </span>
          </div>
        </div>

        {/* Menu */}
        <ul id="side_items">
          <li className={`side-item ${activeSection === "dashboard" ? "active" : ""}`}>
            <button type="button" onClick={() => setActiveSection("dashboard")}>
              <MdDashboard />
              <span className="item-description">Dashboard</span>
            </button>
          </li>

          <li className={`side-item ${activeSection === "usuario" ? "active" : ""}`}>
            <button type="button" onClick={() => setActiveSection("usuario")}>
              <FaUser />
              <span className="item-description">Usuário</span>
            </button>
          </li>

          <li className={`side-item ${activeSection === "eventos" ? "active" : ""}`}>
            <button type="button" onClick={() => setActiveSection("eventos")}>
              <FaCalendarAlt />
              <span className="item-description">Eventos</span>
            </button>
          </li>

          <li className={`side-item ${activeSection === "treino" ? "active" : ""}`}>
            <button type="button" onClick={() => setActiveSection("treino")}>
              <FaRunning />
              <span className="item-description">Treino</span>
            </button>
          </li>

          {/* Dark mode como item independente */}
          <li className="side-item">
            <button
              type="button"
              onClick={toggleDarkMode}
              className={darkMode ? "active" : ""}
              aria-pressed={darkMode}
              title="Alternar tema"
            >
              <FaPowerOff />
              <span className="item-description">
                {darkMode ? "Modo escuro" : "Modo claro"}
              </span>
            </button>
          </li>
        </ul>

        {/* Botão abrir/fechar */}
        <button
          id="open_btn"
          type="button"
          onClick={handleToggleOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <FaBars id="open_btn_icon" />
        </button>
      </div>
    </nav>
  );
}
