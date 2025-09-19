import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovoEvento.css";

const formatarData = (valor) => {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 2) valor = valor.slice(0, 2) + "/" + valor.slice(2);
  if (valor.length > 5) valor = valor.slice(0, 5) + "/" + valor.slice(5, 9);
  return valor.slice(0, 10);
};

const NovoEvento = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const enviarEvento = async (e) => {
    e.preventDefault();
    let dataFormatada = "";
    if (dataEvento.length === 10) {
      const [dia, mes, ano] = dataEvento.split("/");
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("link", link);
    formData.append("dataEvento", dataFormatada);
    if (imagem) formData.append("imagem", imagem);

    try {
      const response = await api.post("/eventos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Evento cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      setLink("");
      setDataEvento("");
      setImagem(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
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
        <Link to="/admin/dashboard" className="novo-evento-voltar">
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
              Link do Evento:
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
          <div className="novo-evento-campo">
            <label htmlFor="dataEvento" className="novo-evento-label">
              Data do Evento:
            </label>
            <input
              type="text"
              id="dataEvento"
              value={dataEvento}
              onChange={(e) => setDataEvento(formatarData(e.target.value))}
              required
              className="novo-evento-input"
              placeholder="dd/mm/aaaa"
              maxLength={10}
            />
          </div>
          <div className="novo-evento-campo">
            <label htmlFor="imagem" className="novo-evento-label">
              Imagem do Evento:
            </label>
            <input
              type="file"
              id="imagem"
              name="imagem"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="novo-evento-input"
            />
            {preview && (
              <div className="novo-evento-preview">
                <p className="novo-evento-preview-texto">Imagem Original:</p>
                <img
                  src={preview}
                  alt="Evento"
                  className="novo-evento-preview-imagem"
                />
              </div>
            )}
          </div>
          <button type="submit" className="novo-evento-botao">
            Cadastrar Evento
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovoEvento;
