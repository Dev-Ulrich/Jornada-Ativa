import "./Hero.css";
import {
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaPowerOff,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";

const Hero = () => {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("dark-mode");
    return storedDarkMode === "active";
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <header id="header" className={isScrolled ? "rolar" : ""} ref={headerRef}>
        <div className="interface">
          <div className="img-logo">
            <img src="/Jornada Ativa.png" />
          </div>

          <section className="espaço"></section>

          <section className="btn-contato">
            <Link to="/jornadaativa/usuario/login">
              <button>Login</button>
            </Link>
            <div className="trilho" id="trilho" onClick={toggleDarkMode}>
              <div className="indicador">
                <i>
                  <FaPowerOff />
                </i>
              </div>
            </div>
          </section>
        </div>
      </header>

      <section className="hero-site">
        <div className="interface">
          <div className="txt-hero">
            <h1>
              Jornada<span>Ativa</span>
            </h1>
            <p>
              Superando Limites,
              <span>Consquistando Vitorias</span>
            </p>
            <a href="https://github.com/Dev-Ulrich/Jornada-Ativa/tree/main/packages/mobile/jornada-ativa-app">
              <button>Quero conhecer</button>
            </a>
          </div>
        </div>
      </section>

      <section className="vantagens">
        <div className="interface">
          <article className="itens-container">
            <div className="txt-itens text-base">
              <h3>
                <span>Melhore</span> seu
                <br />
                desempenho
              </h3>
              <p>
                Nosso app calcula as rotas que mais se adaptam a você,
                oferecendo opções personalizadas para cada necessidade. Se você
                busca otimizar seu tempo, explorar novos caminhos ou até mesmo
                treinar para alcançar seus objetivos, nós garantimos a melhor
                escolha, levando em consideração seu estilo e suas preferências.
                Com a nossa plataforma, encontrar a rota ideal ficou mais fácil
                e eficiente.
              </p>
            </div>

            <div className="img-itens">
              <img src="/img1.png" />
            </div>
          </article>

          <article className="itens-container">
            <div className="img-itens item-1">
              <img src="/img2.png" />
            </div>

            <div className="txt-itens item-2 text-base">
              <h3>
                <span>Os</span> melhores
                <br />
                momentos
              </h3>
              <p>
                Nosso app mostra os dias mais propícios para correr, fornecendo
                informações detalhadas sobre a qualidade do ar e os níveis de
                poluição. Assim, você pode planejar suas corridas com segurança,
                escolhendo os melhores momentos para o seu treino, minimizando
                riscos à saúde e aproveitando o melhor do seu desempenho. Com
                dados atualizados e precisos, nosso app ajuda você a otimizar
                seus treinos ao ar livre, garantindo que cada corrida seja não
                só eficiente, mas também saudável.
              </p>
            </div>
          </article>

          <article className="itens-container">
            <div className="txt-itens text-base">
              <h3>
                <span>Uma</span> comunidade <br />
                ao seu gosto
              </h3>
              <p>
                Nosso app traz diversas comunidades, dependendo do estilo de se
                exercitar, para que você possa se conectar com pessoas que
                compartilham os mesmos interesses e objetivos. Se você é fã de
                corridas e ciclismo temos grupos específicos onde você pode
                trocar dicas, desafios e experiências. Além de motivação e
                apoio, essas comunidades oferecem um ambiente de aprendizado
                contínuo, ajudando você a alcançar seus objetivos de forma mais
                eficaz e divertida. Encontre o seu grupo, compartilhe sua
                jornada e evolua junto com outros atletas.
              </p>
            </div>

            <div className="img-itens">
              <img src="/img3.png" />
            </div>
          </article>
        </div>
      </section>

      <section className="contato">
        <div className="interface">
          <article className="txt-contato text-base">
            <h3>
              Fale agora com a <span>nossa equipe</span>
            </h3>
          </article>

          <article className="icons-contato">
            <a href="https://www.instagram.com/vp.ulrich">
              <button className="text-base">
                <i>
                  <FaInstagram />
                </i>{" "}
                <p>@vp.ulrich</p>
              </button>
            </a>
            <a href="https://www.instagram.com/amandahotoshi">
              <button className="text-base">
                <i>
                  <FaInstagram />
                </i>{" "}
                <p>@amandahotoshi</p>
              </button>
            </a>
            <a href="https://www.instagram.com/mtzz_rc">
              <button className="text-base">
                <i>
                  <FaInstagram />
                </i>{" "}
                <p>@mtzz_rc</p>
              </button>
            </a>
          </article>
        </div>
      </section>

      <footer>
        <div className="interface">
          <section className="top-footer">
            <a href="https://github.com/Dev-Ulrich/Jornada-Ativa">
              <button>
                <i>
                  <FaGithub />
                </i>
              </button>
            </a>
            <a href="https://www.linkedin.com/in/victorulrichcosta">
              <button>
                <i>
                  <FaLinkedinIn />
                </i>
              </button>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "mailto:jornadaativa2025@gmail.com";
              }}
            >
              <button>
                <i>
                  <MdEmail />
                </i>
              </button>
            </a>
          </section>

          <section className="middle-footer"></section>

          <section className="bottom-footer">
            <p>Jornada Ativa 2025 &copy; Todos os direitos reservados</p>
          </section>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
