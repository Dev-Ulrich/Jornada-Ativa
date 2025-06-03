import "./HeroFuncionario.css";
import React, { useState, useEffect, useRef, use } from "react";
import { FaPowerOff, FaTrashAlt, FaPencilAlt, FaPlus } from "react-icons/fa";
import api from "../services/api"; // Certifique-se de que o caminho para o arquivo api.js está correto

const HeroFuncionario = () => {
  const sectionsRef = useRef([]);
  const navLinksRef = useRef([]);

  // Função para atualizar o link ativo
  const updateActiveLink = () => {
    let currentSection = "";

    sectionsRef.current.forEach((section) => {
      if (section) {
        // Verifica se a referência existe
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      }
    });

    navLinksRef.current.forEach((link) => {
      if (link) {
        // Verifica se a referência existe
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active");
        }
      }
    });
  };

  // useEffect para eventos de scroll e load
  useEffect(() => {
    updateActiveLink(); // Executa ao carregar
    window.addEventListener("scroll", updateActiveLink);

    // Limpeza do evento ao desmontar o componente
    return () => window.removeEventListener("scroll", updateActiveLink);
  }, []);

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

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
  api
    .get("/usuarios")
    .then((response) => {
      setUsuarios(response.data); // <-- ajuste aqui
    })
    .catch((error) => console.error("Erro ao buscar usuários: ", error));
}, []);

  // Função para excluir um usuário
  const excluirUsuario = (id) => {
    api
      .delete(`/usuarios/${id}`)
      .then(() => {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.id !== id)
        );
      })
      .catch((error) => console.error("Erro ao excluir usuário: ", error));
  };

  return (
    <div className="body-funcionario">
      <header>
        <div
          className="trilho-funcionario"
          id="trilho"
          onClick={toggleDarkMode}
        >
          <div className="indicador-funcionario">
            <i>
              <FaPowerOff />
            </i>
          </div>
        </div>
        <section
          className="section-funcionario"
          id="section1"
          ref={(el) => (sectionsRef.current[0] = el)}
        >
          <h1 className="titulo-usuarios">Usuarios</h1>

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Foto_Perfil</th>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      {usuario.foto_perfil ? (
                        <img
                          src={usuario.foto_perfil}
                          alt="Perfil"
                          className="foto-perfil"
                        />
                      ) : (
                        <span className="sem-foto">-</span>
                      )}
                    </td>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        title="Editar"
                        onClick={() => handleEdit(usuario.id)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Excluir"
                        onClick={() => handleDelete(usuario.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-3">
            <a href="/funcionario/usuario/novo" className="btn btn-success">
              <FaPlus /> Novo Usuário
            </a>
          </div>
        </section>

        <section
          className="section-funcionario"
          id="section2"
          ref={(el) => (sectionsRef.current[1] = el)}
        >
          <h1>Treinos</h1>
        </section>

        <section
          className="section-funcionario"
          id="section3"
          ref={(el) => (sectionsRef.current[2] = el)}
        >
          <h1>Tipos Treinos</h1>
        </section>

        <section
          className="section-funcionario"
          id="section4"
          ref={(el) => (sectionsRef.current[3] = el)}
        >
          <h1>Eventos</h1>
        </section>
        <section
          className="section-funcionario"
          id="section5"
          ref={(el) => (sectionsRef.current[4] = el)}
        >
          <h1>Comunidades</h1>
        </section>
      </header>
      <nav className="navbar">
        <a href="#section1" ref={(el) => (navLinksRef.current[0] = el)}></a>
        <a href="#section2" ref={(el) => (navLinksRef.current[1] = el)}></a>
        <a href="#section3" ref={(el) => (navLinksRef.current[2] = el)}></a>
        <a href="#section4" ref={(el) => (navLinksRef.current[3] = el)}></a>
        <a href="#section5" ref={(el) => (navLinksRef.current[4] = el)}></a>
      </nav>
    </div>
  );
};
export default HeroFuncionario;
