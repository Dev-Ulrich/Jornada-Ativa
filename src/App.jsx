import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Hero from "./components/Hero";
import Login from "./components/Login/Login";
import HeroFuncionario from "./components/Funcionario/HeroFuncionario";
import NovoUsuario from "./components/Usuario/NovoUsuario";
import UsuarioTabela from "./components/Usuario/UsuarioTabela";
import TreinoTabela from "./components/Treino/TreinoTabela";
import NovoTreino from "./components/Treino/NovoTreino";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Hero />} />
          <Route path="/jornadaativa/usuario/login" element={<Login />} />
          <Route
            path="/funcionario/herofuncionario"
            element={<HeroFuncionario />}
          />
          <Route
            path="/funcionario/usuario"
            element={<UsuarioTabela />}
          />
          <Route path="/funcionario/usuario/novousuario" 
          element={<NovoUsuario />} 
          />
          <Route
            path="/funcionario/treino"
            element={<TreinoTabela />}
          />
          <Route
            path="/funcionario/treino/novotreino"
            element={<NovoTreino />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
