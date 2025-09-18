import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaArchive,
  FaPowerOff,
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

const DashBoard = () => {
  const navigate = useNavigate();
  // Dark Mode
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
      <aside className="sidebar">
        <div
          className="trilho-dashboard"
          id="trilho"
          onClick={toggleDarkMode}
          style={{ cursor: "pointer", marginBottom: "18px" }}
          title="Alternar modo escuro"
        >
          <div className="indicador-dashboard">
            <FaPowerOff />
          </div>
        </div>
        <div className="sidebar-user">
          <div className="avatar">
            {usuarioLogado?.foto ? (
              <img src={usuarioLogado.foto} alt="Foto do usuário" />
            ) : (
              <span className="avatar-placeholder">
                {usuarioLogado?.nome ? usuarioLogado.nome[0] : <FaUser />}
              </span>
            )}
          </div>
          <h2>{usuarioLogado?.nome || "Usuário"}</h2>
          <p>{usuarioLogado?.email || "email@email.com"}</p>
        </div>
        <nav className="menu">
          <div
            className="menu-item"
            onClick={() => navigate("/admin/dashboard")}
          >
            <MdDashboard /> DashBoard
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/usuario")}>
            <FaUser /> Usuário
          </div>
          <div className="menu-item">
            <FaUsers /> Comunidade
          </div>
          <div className="menu-item">
            <FaCalendarAlt /> Eventos
          </div>
          <div className="menu-item">
            <FaArchive /> Histórico
          </div>
        </nav>
      </aside>
      <main className="main">
        <section className="stats-row">
          <div className="stat-card">
            <span>Eventos criados:</span>
            <h1>67</h1>
          </div>
          <div className="stat-card">
            <span>Eventos ativos:</span>
            <h1>34</h1>
          </div>
          <div className="stat-card">
            <span>Usuários cadastrados:</span>
            <h1>476</h1>
          </div>
          <div className="stat-card">
            <span>Inscrições realizadas:</span>
            <h1>639</h1>
          </div>
        </section>
        <section className="highlights-row">
          <div className="highlight-card">
            <h1>+900</h1>
            <span>Downloads</span>
          </div>
          <div className="highlight-card">
            <h1>+80%</h1>
            <span>Crescimentos</span>
          </div>
          <div className="highlight-card">
            <h1>+400</h1>
            <span>Novos Usuários</span>
          </div>
        </section>
        <section className="charts-row">
          <div className="chart-box">
            <h2>Usuários Novos</h2>
            {/* Aqui você pode usar um componente de gráfico */}
            <div className="bar-placeholder">Gráfico de barras</div>
            <div className="chart-labels">
              <span>Janeiro</span>
              <span>Fevereiro</span>
              <span>Março</span>
              <span>Abril</span>
              <span>Maio</span>
              <span>Junho</span>
              <span>Julho</span>
              <span>Agosto</span>
              <span>Setembro</span>
              <span>Outubro</span>
              <span>Novembro</span>
              <span>Dezembro</span>
            </div>
          </div>
          <div className="chart-box">
            <h2>Inscrições</h2>
            <div className="area-placeholder">Gráfico de área</div>
            <div className="chart-labels">
              <span>1ª semana ago</span>
              <span>2ª semana ago</span>
              <span>3ª semana ago</span>
              <span>4ª semana ago</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashBoard;
