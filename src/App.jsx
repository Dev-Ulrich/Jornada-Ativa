import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Hero from "./components/Hero";
import Login from "./components/Login/Login";
import HeroFuncionario from "./components/Funcionario/HeroFuncionario";
import NovoUsuario from "./components/Usuario/NovoUsuario";
import EditarUsuario from "./components/Usuario/EditarUsuario";
import ExcluirUsuario from "./components/Usuario/ExcluirUsuario";
import UsuarioTabela from "./components/Usuario/UsuarioTabela";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Hero />} />
          <Route path="/jornadaativa/usuario/login" element={<Login />} />
          <Route
            path="/jornadaativa/usuario/herofuncionario"
            element={<HeroFuncionario />}
          />
          <Route
            path="/jornadaativa/usuario/usuario"
            element={<UsuarioTabela />}
          />
          <Route
            path="/jornadaativa/usuario/novousuario"
            element={<NovoUsuario />}
          />
          <Route
            path="/funcionario/usuario/editar/:id"
            element={<EditarUsuario />}
          />
          <Route
            path="/jornadaativa/usuario/excluirusuario/:id"
            element={<ExcluirUsuario />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
