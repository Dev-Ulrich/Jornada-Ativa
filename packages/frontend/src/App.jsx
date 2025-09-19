import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Hero from "./components/Inicial/Hero";
import Login from "./components/Login/Login";
import NovoUsuario from "./components/Usuario/NovoUsuario";
import UsuarioTabela from "./components/Usuario/UsuarioTabela";
import TreinoTabela from "./components/Treino/TreinoTabela";
import NovoTreino from "./components/Treino/NovoTreino";
import ComunidadeTabela from "./components/Comunidade/ComunidadeTabela";
import NovaComunidade from "./components/Comunidade/NovaComunidade";
import EventoTabela from "./components/Evento/EventoTabela";
import NovoEvento from "./components/Evento/NovoEvento";
import DashBoard from "./components/DashBoard/DashBoard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          {/* Página Inicial */}
          <Route path="/" element={<Hero />} />
          {/* Login */}
          <Route path="/jornadaativa/usuario/login" element={<Login />} />
          {/* DashBoard */}
          <Route path="/admin/dashboard" element={<DashBoard />} />
          {/* Tabela Usuário */}
          <Route path="/admin/usuario" element={<UsuarioTabela />} />
          {/* Cadastro Novo Usuário */}
          <Route path="/admin/usuario/novousuario" element={<NovoUsuario />} />
          {/* Tabela Treino */}
          <Route path="/admin/treino" element={<TreinoTabela />} />
          {/* Cadastro Novo Treino */}
          <Route path="/admin/treino/novotreino" element={<NovoTreino />} />
          {/* Tabela Comunidade */}
          <Route
            path="/admin/comunidade/comunidade"
            element={<ComunidadeTabela />}
          />
          {/* Cadastro Nova Comunidade */}
          <Route
            path="/admin/comunidade/novacomunidade"
            element={<NovaComunidade />}
          />
          {/* Tabela Evento */}
          <Route path="/admin/evento/evento" element={<EventoTabela />} />
          {/* Cadastro Novo Evento */}
          <Route path="/admin/evento/novoevento" element={<NovoEvento />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
