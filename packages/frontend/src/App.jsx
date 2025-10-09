import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Hero from "./components/Inicial/Hero";
import Login from "./components/Login/Login";
import NovoUsuario from "./components/Usuario/NovoUsuario";
import UsuarioTabela from "./components/Usuario/UsuarioTabela";
import TreinoTabela from "./components/Treino/TreinoTabela";
import NovoTreino from "./components/Treino/NovoTreino";
import EventoTabela from "./components/Evento/EventoTabela";
import NovoEvento from "./components/Evento/NovoEvento";
import DashBoard from "./components/DashBoard/DashBoard";
import HealthIndicator from "./components/Health/HealthIndicator";
import Sidebar from "./components/DashBoard/Sidebar";
import GraficoUsuarios from "./components/DashBoard/GraficoUsuarios";
import EventosMes from "./components/DashBoard/EventosMes"
import Calendario from "@components/DashBoard/Calendario";
import ProximosEventos from "@components/DashBoard/ProximosEventos";

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
          {/* DashBoard SideBar*/}
          <Route path="/admin/dashboard/sidebar" element={<Sidebar />} />
          {/* DashBoard Grafico Usuarios*/}
          <Route path="/admin/dashboard/graficousuarios" element={<GraficoUsuarios />} />
          {/* DashBoard Calendario*/}
          <Route path="/admin/dashboard/calendario" element={<Calendario />} />
          {/* DashBoard Eventos por mes*/}
          <Route path="/admin/dashboard/eventosmes" element={<EventosMes />} />
          {/* DashBoard Proximos Eventos*/}
          <Route path="/admin/dashboard/proximoseventos" element={<ProximosEventos />} />
          {/* Cadastro Novo Usuário */}
          <Route path="/admin/usuario/novousuario" element={<NovoUsuario />} />
          {/* Tabela Treino */}
          <Route path="/admin/treino" element={<TreinoTabela />} />
          {/* Cadastro Novo Treino */}
          <Route path="/admin/treino/novotreino" element={<NovoTreino />} />
          {/* Health Indicato*/}
          <Route path="/admin/health" element={<HealthIndicator />} />
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
