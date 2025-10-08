// src/components/Layout/Sidebar.jsx
import { useMemo } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaRunning, FaCalendarAlt, FaBars, FaSignOutAlt, FaPowerOff } from "react-icons/fa";
import HealthIndicator from "@components/Health/HealthIndicator";
import "./Sidebar.css"; 

export default function Sidebar({
  activeSection,
  setActiveSection,
  darkMode,           // mantido para futuro (toggle de tema)
  toggleDarkMode,     // mantido para futuro
}) {
  const usuarioLogado = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuarioLogado")) || {};
    } catch {
      return {};
    }
  }, []);

  // Toggle igual ao exemplo do ZIP: adiciona/remove a classe 'open-sidebar' no #sidebar
  const toggleOpen = () => {
    const el = document.getElementById("sidebar");
    if (el) el.classList.toggle("open-sidebar");
  };

  return (
    <nav id="sidebar">
      <div id="sidebar_content">
        {/* Saúde / status (seu componente atual) */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <HealthIndicator />
        </div>

        {/* Usuário (estrutura similar ao exemplo) */}
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

  <p id="user_infos">
    <span className="item-description name">{usuarioLogado?.nome || "Usuário"}</span>
    <span className="item-description email">{usuarioLogado?.email || "email@email.com"}</span>
  </p>
</div>

        {/* Ações / menu */}
        <ul id="side_items">
          <li className="side-item">
            <button
              type="button"
              onClick={() => setActiveSection("dashboard")}
              className={activeSection === "dashboard" ? "active" : ""}
            >
              <MdDashboard />
              <span className="item-description">Dashboard</span>
            </button>
          </li>

          <li className="side-item">
            <button
              type="button"
              onClick={() => setActiveSection("usuario")}
              className={activeSection === "usuario" ? "active" : ""}
            >
              <FaUser />
              <span className="item-description">Usuário</span>
            </button>
          </li>

          <li className="side-item">
            <button
              type="button"
              onClick={() => setActiveSection("eventos")}
              className={activeSection === "eventos" ? "active" : ""}
            >
              <FaCalendarAlt />
              <span className="item-description">Eventos</span>
            </button>
          </li>

          <li className="side-item">
            <button
              type="button"
              onClick={() => setActiveSection("treino")}
              className={activeSection === "treino" ? "active" : ""}
            >
              <FaRunning />
              <span className="item-description">Treino</span>
            </button>

             <li className="side-item">
    <button
      type="button"
      onClick={toggleDarkMode}
      className={darkMode ? "active" : ""}
      aria-pressed={darkMode}
      title="Alternar tema"
    >
      <FaPowerOff />
      <span className="item-description">Dark Mode</span>
    </button>
  </li>
            
          </li>
        </ul>

        {/* Botão abrir/fechar (id igual ao exemplo) */}
        <button id="open_btn" type="button" onClick={toggleOpen} aria-label="Abrir/fechar menu">
          <FaBars id="open_btn_icon"/>
        </button>
      </div>
    </nav>
  );
}
