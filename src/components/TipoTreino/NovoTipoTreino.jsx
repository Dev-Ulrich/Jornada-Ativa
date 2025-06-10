import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovoTipoTreino.css";

const NovoTipoTreino = () => {
  const [velocidade, setVelocidade] = useState("");
  const [caminhada, setCaminhada] = useState("");
  const [resistencia, setResistencia] = useState("");
  const token = localStorage.getItem("token");

  const enviarTipoTreino = async (event) => {
    event.preventDefault();

    try {
      // Correção: nomes dos campos em minúsculo e corretos
      const response = await api.post(
        "/tipoTreinos",
        {
          velocidade,
          resistencia,
          caminhada,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Tipo de treino cadastrado com sucesso!");
      setVelocidade("");
      setResistencia("");
      setCaminhada("");
    } catch (error) {
      console.error("Não foi possível salvar o tipo de treino ", error);
      alert("Erro ao cadastrar tipo de treino. Verifique os dados e tente novamente.");
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

  //Final Dark Mode

  return (
    <div>
      <header>
        <div className="trilho-tipotreino" id="trilho" onClick={toggleDarkMode}>
          <div className="indicador-tipotreino">
            <i>
              <FaPowerOff />
            </i>
          </div>
        </div>
      </header>

      <div className="novo-tipotreino-container">
        <Link to="/funcionario/herofuncionario" className="novo-tipotreino-voltar">
          <FaArrowLeft className="novo-tipotreino-voltar-icone" />
          Voltar
        </Link>
        <h2 className="novo-tipotreino-titulo">Novo Tipo de Treino</h2>
        <form onSubmit={enviarTipoTreino}>
          <div className="novo-tipotreino-campo">
            <label htmlFor="velocidade" className="novo-tipotreino-label">
              Velocidade:
            </label>
            <input
              type="number"
              id="velocidade"
              value={velocidade}
              onChange={(e) => setVelocidade(e.target.value)}
              required
              className="novo-tipotreino-input"
            />
          </div>
          <div className="novo-tipotreino-campo">
            <label htmlFor="resistencia" className="novo-tipotreino-label">
              Resistencia:
            </label>
            <input
              type="text"
              id="resistencia"
              value={resistencia}
              onChange={(e) => setResistencia(e.target.value)}
              required
              className="novo-tipotreino-input"
            />
          </div>
          <div className="novo-tipotreino-campo">
            <label htmlFor="caminhada" className="novo-tipotreino-label">
              Caminhada:
            </label>
            <input
              type="text"
              id="caminhada"
              value={caminhada}
              onChange={(e) => setCaminhada(e.target.value)}
              required
              className="novo-tipotreino-input"
            />
          </div>
          <button type="submit" className="novo-tipotreino-botao">
            Cadastrar Tipo de Treino
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovoTipoTreino;