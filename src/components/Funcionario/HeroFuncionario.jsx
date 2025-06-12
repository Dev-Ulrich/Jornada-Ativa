import "./HeroFuncionario.css";
import React, { useState, useEffect, useRef, use } from "react";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import api from "../../services/api";
import UsuarioTabela from "../Usuario/UsuarioTabela";
import TreinoTabela from "../Treino/TreinoTabela";
import TipoTreinoTabela from "../TipoTreino/TipoTreinoTabela";
import ComunidadeTabela from "../Comunidade/ComunidadeTabela";

const HeroFuncionario = () => {
  const sectionsRef = useRef([]);
  const navLinksRef = useRef([]);

  const updateActiveLink = () => {
    let currentSection = "";

    sectionsRef.current.forEach((section) => {
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      }
    });

    navLinksRef.current.forEach((link) => {
      if (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active");
        }
      }
    });
  };

  useEffect(() => {
    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink);

    return () => window.removeEventListener("scroll", updateActiveLink);
  }, []);

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
  const [usuarios, setUsuarios] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [tipoTreinos, setTipoTreinos] = useState([]);
  const [comunidades, setComunidades] = useState([]);

  //Usuarios
  useEffect(() => {
    api
      .get("/usuarios")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => console.error("Erro ao buscar usuários: ", error));
  }, []);

  //treinos
  useEffect(() => {
    api
      .get("/treinos")
      .then((response) => {
        setTreinos(response.data);
      })
      .catch((error) => console.error("Erro ao buscar treinos: ", error));
  }, []);

  //tipotreinos
  useEffect(() => {
    api
      .get("/tipoTreinos")
      .then((response) => {
        setTipoTreinos(response.data);
      })
      .catch((error) =>
        console.error("Erro ao buscar tipo de treinos: ", error)
      );
  }, []);

  //Comunidades
  useEffect(() => {
    api
      .get("/comunidades")
      .then((response) => {
        setComunidades(response.data);
      })
      .catch((error) => console.error("Erro ao buscar comunidades: ", error));
  }, []);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/funcionario/usuario/editar/${id}`);
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
          <UsuarioTabela
            usuarios={usuarios}
            setUsuarios={setUsuarios}
            handleEdit={handleEdit}
          />
        </section>

        <section
          className="section-funcionario"
          id="section2"
          ref={(el) => (sectionsRef.current[1] = el)}
        >
          <TreinoTabela
            treinos={treinos}
            setTreinos={setTreinos}
            h1andleEdit={handleEdit}
          />
        </section>

        <section
          className="section-funcionario"
          id="section3"
          ref={(el) => (sectionsRef.current[2] = el)}
        >
          <TipoTreinoTabela
            tipoTreinos={tipoTreinos}
            setTiposTreinos={setTipoTreinos}
            handleEdit={handleEdit}
          />
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
          <ComunidadeTabela
            comunidades={comunidades}
            setComunidades={setComunidades}
            handleEdit={handleEdit}
          />
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
