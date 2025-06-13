import React, {useState, useEffect} from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovoEvento.css";

const NovoEvento = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [link, setLink] = useState('');
    const token = localStorage.getItem('token');

    const enviarEvento = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/eventos",
                {
                    nome: nome,
                    descricao: descricao,
                    link: link,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data);
            alert("Evento cadastrado com sucesso!");
            setNome("");
            setDescricao("");
            setLink("");
        } catch (error){
            console.error("Não foi possivel salvar o evento", error);
            alert("Erro ao cadastrar evento. Verifique os dados e tente novamente.");
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
                <div className="trilho-evento" id="trilho" onClick={toggleDarkMode}>
                  <div className="indicador-evento">
                    <i>
                      <FaPowerOff />
                    </i>
                  </div>
                </div>
              </header>
        
              <div className="novo-evento-container">
                <Link to="/funcionario/herofuncionario" className="novo-evento-voltar">
                  <FaArrowLeft className="novo-evento-voltar-icone" />
                  Voltar
                </Link>
                <h2 className="novo-evento-titulo">Novo Evento</h2>
                <form onSubmit={enviarEvento}>
                  <div className="novo-evento-campo">
                    <label htmlFor="nome" className="novo-evento-label">
                      Nome:
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="novo-evento-input"
                    />
                  </div>
                  <div className="novo-evento-campo">
                    <label htmlFor="descricao" className="novo-evento-label">
                      Descrição:
                    </label>
                    <input
                      type="text"
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      required
                      className="novo-evento-input"
                    />
                  </div>
                  <div className="novo-evento-campo">
                    <label htmlFor="link" className="novo-evento-label">
                      Link:
                    </label>
                    <input
                      type="text"
                      id="link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      required
                      className="novo-evento-input"
                    />
                  </div>
                  <button type="submit" className="novo-evento-botao">
                    Cadastrar Evento
                  </button>
                </form>
              </div>
            </div>
    )
}

export default NovoEvento;
