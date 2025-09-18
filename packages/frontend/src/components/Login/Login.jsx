//No terminal, dentro do seu projeto react, executa
//npm install -g json-server
//npm install axios

//comandos de inicializacao
//npx json-server --watch db.json --port 3001
//npm run dev

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Função chamada ao submeter o formulario
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/usuario?email=${email}&senha=${senha}`
      );
      const data = await response.json();

      if (data.length > 0) {
        setMessage("Login realizado com sucesso!");
        localStorage.setItem("usuarioLogado", JSON.stringify(data[0]));
        // Redireciona para a Home
        navigate("/admin/dashboard");
      } else {
        setMessage("Email ou senha inválidos.");
      }
    } catch (error) {
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="body">
      <main className="container">
        <form onSubmit={handleLogin}>
          <h1>Login J.A</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Lembrar Senha
            </label>
          </div>
          {/*Exibe mensagem de erro, se houver*/}
          {message && <p>{message}</p>}

          <button type="submit" className="login">
            Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
