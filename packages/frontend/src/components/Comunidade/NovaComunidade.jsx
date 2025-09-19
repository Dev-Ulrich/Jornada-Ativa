import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovaComunidade.css";
import api from "../../services/api";

const NovaComunidade = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [integrantes, setIntegrantes] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const enviarComunidade = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("integrantes", integrantes);
    if (foto) formData.append("fotoPerfil", foto);

    try {
      const response = await api.post("/comunidades", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nomeComunidade =
        response.data?.data?.nome || response.data?.nome || "Comunidade";
      alert(nomeComunidade + " cadastrada com sucesso!");
      setNome("");
      setDescricao("");
      setIntegrantes("");
      setFoto(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Erro ao cadastrar comunidade: ", error);
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
        <div className="trilho-comunidade" id="trilho" onClick={toggleDarkMode}>
          <div className="indicador-comunidade">
            <i>
              <FaPowerOff />
            </i>
          </div>
        </div>
      </header>

      <div className="nova-comunidade-container">
        <Link to="/admin/dashboard" className="nova-comunidade-voltar">
          <FaArrowLeft className="nova-comunidade-voltar-icone" />
          Voltar
        </Link>
        <h2 className="nova-comunidade-titulo">Nova Comunidade</h2>
        <form onSubmit={enviarComunidade}>
          <div className="nova-comunidade-campo">
            <label htmlFor="nome" className="nova-comunidade-label">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="nova-comunidade-input"
            />
          </div>
          <div className="nova-comunidade-campo">
            <label htmlFor="descricao" className="nova-comunidade-label">
              Descrição:
            </label>
            <input
              type="text"
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="nova-comunidade-input"
            />
          </div>
          <div className="nova-comunidade-campo">
            <label htmlFor="image" className="nova-comunidade-label">
              Foto da Comunidade:
            </label>
            <input
              type="file"
              id="image"
              name="files"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="nova-comunidade-input"
            />
            {preview && (
              <div className="nova-comunidade-preview">
                <p className="nova-comunidade-preview-texto">Imagem Original:</p>
                <img
                  src={preview}
                  alt="Original"
                  className="nova-comunidade-preview-imagem"
                />
              </div>
            )}
          </div>
          <button type="submit" className="nova-comunidade-botao">
            Cadastrar Comunidade
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovaComunidade;