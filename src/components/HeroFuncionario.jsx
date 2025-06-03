import "./HeroFuncionario.css";
import React, { useState, useEffect, useRef, use } from "react";
import { FaPowerOff, FaTrashAlt } from "react-icons/fa";
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

  const [usuarios, setUsuarios] = useState({});

  useEffect(() => {
    api
      .get("/usuarios") // ajuste o endpoint conforme sua API
      .then((response) => setUsuarios(response.data.data))
      .catch((error) => console.error("Erro ao buscar usuários: ", error));
  }, []);

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
          <h1>Usuarios</h1>

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Foto_Perfil</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td style={{ fontSize: "13px" }}>{usuario.id}</td>
                    <td style={{ fontSize: "13px" }}>{usuario.nome}</td>
                    <td style={{ fontSize: "13px" }}>{usuario.email}</td>
                    <td style={{ fontSize: "13px" }}>{usuario.foto_perfil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
