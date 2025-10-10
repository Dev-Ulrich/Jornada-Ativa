import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Hero from "./components/Inicial/Hero";
import Login from "./components/Login/Login";

import DashBoard from "./components/DashBoard/DashBoard";
import HealthIndicator from "./components/Health/HealthIndicator";

import EventoTabela from "@components/Evento/EventoTabela";
import NovoEvento from "@components/Evento/NovoEvento";
import EditarEvento from "@components/Evento/EditarEvento";

import TreinoTabela from "@components/Treino/TreinoTabela";
import NovoTreino from "./components/Treino/NovoTreino";
import EditarTreino from "./components/Treino/EditarTreino";

import UsuarioTabela from "@components/Usuario/UsuarioTabela";
import NovoUsuario from "./components/Usuario/NovoUsuario";
import EditarUsuario from "./components/Usuario/EditarUsuario";



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

          {/* Health Indicator*/}
          <Route path="/admin/health" element={<HealthIndicator />} />

          {/* Lista de eventos, criacao e edicao*/}
          <Route path="/admin/eventos" element={<EventoTabela />} />
          <Route path="/admin/eventos/novo" element={<NovoEvento />} />
          <Route path="/admin/eventos/editar/:id" element={<EditarEvento />} />

          {/* Lista de eventos, criacao e edicao */}
          <Route path="/admin/treinos" element={<TreinoTabela />} />
          <Route path="/admin/treinos/novo" element={<NovoTreino />} />
          <Route path="/admin/treinos/editar/:id" element={<EditarTreino />} />

          {/* Lista de usuario, criacao e edicao*/}
          <Route path="/admin/usuarios" element={<UsuarioTabela />} />
          <Route path="/admin/usuarios/novo" element={<NovoUsuario />} />
          <Route path="/admin/usuarios/editar/:id" element={<EditarUsuario />} />


        </Routes>
      </Router>
    </>
  );
}

export default App;
