// src/components/DashBoard/Sidebar.jsx
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaRunning, FaCalendarAlt, FaBars, FaPowerOff } from "react-icons/fa";
import HealthIndicator from "@components/Health/HealthIndicator";
import "./Sidebar.css";

export default function Sidebar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const usuarioLogado = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuarioLogado")) || {};
    } catch {
      return {};
    }
  }, []);

  const toggleOpen = () => {
    const el = document.getElementById("sidebar");
    if (el) el.classList.toggle("open-sidebar");
  };

  const isActive = (test) => pathname.startsWith(test);

  return (
    <nav id="sidebar">
      <div id="sidebar_content">
        <div style={{ position: "relative", marginBottom: 10 }}>
          <HealthIndicator />
        </div>

        <div id="user">
          {usuarioLogado?.foto ? (
            <img
              src={usuarioLogado.foto}
              id="user_avatar"
              alt={`Avatar de ${usuarioLogado?.nome || "Usuário"}`}
            />
          ) : (
            <div className="avatar-initial" role="img" aria-label={`Avatar de ${usuarioLogado?.nome || "Usuário"}`}>
              {(usuarioLogado?.nome?.trim()?.[0] || "U").toUpperCase()}
            </div>
          )}
          <p id="user_infos">
            <span className="item-description name">{usuarioLogado?.nome || "Usuário"}</span>
            <span className="item-description email">{usuarioLogado?.email || "email@email.com"}</span>
          </p>
        </div>

        <ul id="side_items">
          <li className={`side-item ${isActive("/admin/dashboard") ? "active" : ""}`}>
            <button type="button" onClick={() => navigate("/admin/dashboard")}>
              <MdDashboard />
              <span className="item-description">Dashboard</span>
            </button>
          </li>

          <li className={`side-item ${isActive("/admin/usuarios") ? "active" : ""}`}>
            <button type="button" onClick={() => navigate("/admin/usuarios")}>
              <FaUser />
              <span className="item-description">Usuários</span>
            </button>
          </li>

          {/* Habilite quando tiver os componentes/rotas */}
          <li className={`side-item ${isActive("/admin/eventos") ? "active" : ""}`}>
            <button type="button" onClick={() => navigate("/admin/eventos")}>
              <FaCalendarAlt />
              <span className="item-description">Eventos</span>
            </button>
          </li>

          <li className={`side-item ${isActive("/admin/treinos") ? "active" : ""}`}>
            <button type="button" onClick={() => navigate("/admin/treinos")}>
              <FaRunning />
              <span className="item-description">Treinos</span>
            </button>
          </li>

          {/* Dark mode “como um item” */}
          <li className={`side-item ${darkMode ? "active" : ""}`}>
            <button type="button" onClick={toggleDarkMode} aria-pressed={darkMode} title="Alternar tema">
              <FaPowerOff />
              <span className="item-description">Dark Mode</span>
            </button>
          </li>
        </ul>

        <button id="open_btn" type="button" onClick={toggleOpen} aria-label="Abrir/fechar menu">
          <FaBars id="open_btn_icon" />
        </button>
      </div>
    </nav>
  );
}
