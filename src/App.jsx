import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';



import Hero from './components/Hero';
import Login from './components/Login';
import HeroFuncionario from './components/HeroFuncionario';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/' element =  {<Hero/>} />
        <Route
        path='/jornadaativa/usuario/login'
        element = {<Login/>}
        />
        <Route
        path='/jornadaativa/usuario/herofuncionario'
        element= {<HeroFuncionario/>}
        />
      </Routes>
    </Router>
    
    </>
  )
}

export default App
