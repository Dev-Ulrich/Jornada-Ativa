import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa";
import "./NovoUsuario.css"; // Importe o arquivo CSS

const NovoUsuario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("senha", senha);
    if (image) formData.append("files", image);

    try {
      const response = await api.post(
        "/usuarios",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
const nomeUsuario = response.data?.data?.nome || response.data?.nome || "Usuário";
alert(nomeUsuario + " cadastrado com sucesso");
      setNome("");
      setEmail("");
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
  
    //Final Dark Mode


  return (
    <div>
      <header>
              <div
                className="trilho-usuario"
                id="trilho"
                onClick={toggleDarkMode}
              >
                <div className="indicador-usuario">
                  <i>
                    <FaPowerOff />
                  </i>
                </div>
              </div>
      </header>

      <div className="novo-usuario-container">
      <Link to="/funcionario/herofuncionario" className="novo-usuario-voltar">
        <FaArrowLeft className="novo-usuario-voltar-icone" />Voltar
      </Link>
      <h2 className="novo-usuario-titulo">Novo Usuário</h2>
      <form onSubmit={enviarUsuario}>
        <div className="novo-usuario-campo">
          <label htmlFor="nome" className="novo-usuario-label">Nome:</label>
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
          <label htmlFor="email" className="novo-usuario-label">Email:</label>
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
          <label htmlFor="senha" className="novo-usuario-label">Senha:</label>
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
          <label htmlFor="image" className="novo-usuario-label">Foto Perfil:</label>
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