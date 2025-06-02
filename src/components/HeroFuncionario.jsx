import "./HeroFuncionario.css";
import React, { useState, useEffect, useRef } from "react";
import { FaPowerOff, FaTrashAlt } from "react-icons/fa";

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
          <h1>Analitics</h1>
        </section>

        <section
          className="section-funcionario"
          id="section2"
          ref={(el) => (sectionsRef.current[1] = el)}
        >
          <h1>Eventos</h1>
        </section>

        <section
          className="section-funcionario"
          id="section3"
          ref={(el) => (sectionsRef.current[2] = el)}
        >
          <h1>Alertas</h1>
        </section>
      </header>
      <nav className="navbar">
        <a href="#section1" ref={(el) => (navLinksRef.current[0] = el)}></a>
        <a href="#section2" ref={(el) => (navLinksRef.current[1] = el)}></a>
        <a href="#section3" ref={(el) => (navLinksRef.current[2] = el)}></a>
      </nav>
    </div>
  );
};

export default HeroFuncionario;
