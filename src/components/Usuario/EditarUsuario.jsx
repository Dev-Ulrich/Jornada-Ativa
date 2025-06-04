import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaPowerOff } from "react-icons/fa";
import "./EditarUsuario.css";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [preview, setPreview] = useState("");

  // Dark mode igual ao HeroFuncionario
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

  useEffect(() => {
    api.get(`/usuarios/${id}`)
      .then((res) => {
        setUsuario(res.data);
        setNome(res.data.nome || "");
        setEmail(res.data.email || "");
        setPreview(res.data.fotoPerfil || "");
      })
      .catch(() => navigate("/funcionario/usuario"));
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFotoPerfil(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    if (fotoPerfil) {
      formData.append("fotoPerfil", fotoPerfil);
    }
    api.put(`/usuarios/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(() => {
      navigate("/funcionario/usuario");
    });
  };

  const handleCancel = () => {
    navigate("/funcionario/usuario");
  };

  if (!usuario) return <div>Carregando...</div>;

  return (
    <div className="editar-usuario-container">
      <div className="editar-usuario-card">
        {/* Trilho do dark mode igual ao HeroFuncionario */}
        <div
          className="trilho-funcionario"
          id="trilho"
          onClick={toggleDarkMode}
          title="Alternar modo escuro"
        >
          <div className="indicador-funcionario">
            <i>
              <FaPowerOff />
            </i>
          </div>
        </div>
        <h2>Editar Usuário</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <th>Id:</th>
                <td>{usuario?.id}</td>
              </tr>
              <tr>
                <th>Nome:</th>
                <td>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="form-control"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>Email:</th>
                <td>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>Foto_Perfil:</th>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Pré-visualização"
                      className="foto-perfil mt-2"
                      style={{ width: 60, height: 60, borderRadius: "50%" }}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">
              Salvar
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;