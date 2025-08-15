import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovoTreino.css";

const NovoTreino = () => {
  const [data, setData] = useState("");
  const [distancia, setDistancia] = useState("");
  const [tempo, setTempo] = useState("");
  const token = localStorage.getItem("token");

  const enviarTreino = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post(
        "/treinos",
        {
          data: data,
          distancia: distancia,
          tempo: tempo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Treino cadastrado com sucesso!");
      setData("");
      setDistancia("");
      setTempo("");
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

  //Final Dark Mode

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
        <Link to="/funcionario/herofuncionario" className="novo-treino-voltar">
          <FaArrowLeft className="novo-treino-voltar-icone" />
          Voltar
        </Link>
        <h2 className="novo-treino-titulo">Novo Treino</h2>
        <form onSubmit={enviarTreino}>
          <div className="novo-treino-campo">
            <label htmlFor="data" className="novo-treino-label">
              Data:
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
              className="novo-treino-input"
            />
          </div>
          <div className="novo-treino-campo">
            <label htmlFor="distancia" className="novo-treino-label">
              Distância:
            </label>
            <input
              type="number"
              id="distancia"
              value={distancia}
              onChange={(e) => setDistancia(e.target.value)}
              required
              className="novo-treino-input"
            />
          </div>
          <div className="novo-treino-campo">
            <label htmlFor="tempo" className="novo-treino-label">
              Tempo:
            </label>
            <input
              type="text"
              id="tempo"
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
              required
              className="novo-treino-input"
            />
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