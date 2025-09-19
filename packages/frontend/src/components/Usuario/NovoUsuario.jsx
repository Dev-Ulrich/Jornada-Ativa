import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovoUsuario.css";

const formatarData = (valor) => {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 2) valor = valor.slice(0,2) + "/" + valor.slice(2);
  if (valor.length > 5) valor = valor.slice(0,5) + "/" + valor.slice(5,9);
  return valor.slice(0,10);
};

const NovoUsuario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [genero, setGenero] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [nivel, setNivel] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const enviarUsuario = async (event) => {
    event.preventDefault();
    // Converte para yyyy-mm-dd para o backend
    let dataFormatada = "";
    if (dataNascimento.length === 10) {
      const [dia, mes, ano] = dataNascimento.split("/");
      dataFormatada = `${ano}-${mes}-${dia}`;
    }
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("senha", senha);
    formData.append("genero", genero);
    formData.append("dataNascimento", dataFormatada);
    formData.append("nivel", nivel);
    formData.append("altura", altura);
    formData.append("peso", peso);
    if (image) formData.append("files", image);

    try {
      const response = await api.post("/usuarios", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nomeUsuario =
        response.data?.data?.nome || response.data?.nome || "Usuário";
      alert(nomeUsuario + " cadastrado com sucesso");
      setNome("");
      setEmail("");
      setSenha("");
      setGenero("");
      setDataNascimento("");
      setNivel("");
      setAltura("");
      setPeso("");
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Não foi possível salvar o usuário ", error);
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
        <div className="trilho-usuario" id="trilho" onClick={toggleDarkMode}>
          <div className="indicador-usuario">
            <i>
              <FaPowerOff />
            </i>
          </div>
        </div>
      </header>

      <div className="novo-usuario-container">
        <Link to="/admin/dashboard" className="novo-usuario-voltar">
          <FaArrowLeft className="novo-usuario-voltar-icone" />
          Voltar
        </Link>
        <h2 className="novo-usuario-titulo">Novo Usuário</h2>
        <form onSubmit={enviarUsuario}>
          <div className="novo-usuario-campo">
            <label htmlFor="nome" className="novo-usuario-label">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="novo-usuario-input"
            />
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="email" className="novo-usuario-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="novo-usuario-input"
            />
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="senha" className="novo-usuario-label">
              Senha:
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="novo-usuario-input"
            />
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="genero" className="novo-usuario-label">
              Gênero:
            </label>
            <select
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
              className="novo-usuario-input"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Prefiro não dizer">Prefiro não dizer</option>
            </select>
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="dataNascimento" className="novo-usuario-label">
              Data de Nascimento:
            </label>
            <input
              type="text"
              id="dataNascimento"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(formatarData(e.target.value))}
              required
              className="novo-usuario-input"
              placeholder="dd/mm/aaaa"
              maxLength={10}
            />
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="nivel" className="novo-usuario-label">
              Nível:
            </label>
            <select
              id="nivel"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              required
              className="novo-usuario-input"
            >
              <option value="">Selecione</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="altura" className="novo-usuario-label">
              Altura (m):
            </label>
            <input
              type="number"
              id="altura"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              min="0"
              step="0.01"
              required
              className="novo-usuario-input"
              placeholder="Ex: 1.75"
            />
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="peso" className="novo-usuario-label">
              Peso (kg):
            </label>
            <input
              type="number"
              id="peso"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              min="0"
              step="0.1"
              required
              className="novo-usuario-input"
              placeholder="Ex: 70.5"
            />
          </div>
          <div className="novo-usuario-campo">
            <label htmlFor="image" className="novo-usuario-label">
              Foto Perfil:
            </label>
            <input
              type="file"
              id="image"
              name="files"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="novo-usuario-input"
            />
            {preview && (
              <div className="novo-usuario-preview">
                <p className="novo-usuario-preview-texto">Imagem Original:</p>
                <img
                  src={preview}
                  alt="Original"
                  className="novo-usuario-preview-imagem"
                />
              </div>
            )}
          </div>
          <button type="submit" className="novo-usuario-botao">
            Cadastrar Usuário
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovoUsuario;