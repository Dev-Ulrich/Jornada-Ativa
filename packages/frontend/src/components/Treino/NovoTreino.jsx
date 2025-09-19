import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovoTreino.css";

const NovoTreino = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [nivel, setNivel] = useState("");
  const token = localStorage.getItem("token");

  const enviarTreino = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post(
        "/treinos",
        {
          nome,
          descricao,
          nivel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Treino cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      setNivel("");
    } catch (error) {
      console.error("Não foi possível salvar o treino ", error);
      alert("Erro ao cadastrar treino. Verifique os dados e tente novamente.");
    }
  };

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
    <div>
      <header>
        <div className="trilho-treino" id="trilho" onClick={toggleDarkMode}>
          <div className="indicador-treino">
            <i>
              <FaPowerOff />
            </i>
          </div>
        </div>
      </header>

      <div className="novo-treino-container">
        <Link to="/admin/dashboard" className="novo-treino-voltar">
          <FaArrowLeft className="novo-treino-voltar-icone" />
          Voltar
        </Link>
        <h2 className="novo-treino-titulo">Novo Treino</h2>
        <form onSubmit={enviarTreino}>
          <div className="novo-treino-campo">
            <label htmlFor="nome" className="novo-treino-label">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="novo-treino-input"
            />
          </div>
          <div className="novo-treino-campo">
            <label htmlFor="descricao" className="novo-treino-label">
              Descrição:
            </label>
            <input
              type="text"
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="novo-treino-input"
            />
          </div>
          <div className="novo-treino-campo">
            <label htmlFor="nivel" className="novo-treino-label">
              Nível:
            </label>
            <select
              id="nivel"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              required
              className="novo-treino-input"
            >
              <option value="">Selecione</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>
          <button type="submit" className="novo-treino-botao">
            Cadastrar Treino
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovoTreino;