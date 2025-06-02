import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, SetError] = useState(""); //exibir mensagem de erro
  const navigate = useNavigate();

  // Dados Fixos para validação
  const fixedEmail = "admin@admin.com.br";
  const fixedSenha = "123456";

  // Função chamada ao submeter o formulario
  const handleSubmit = (e) => {
    e.preventDefault(); //Previne o envio padrão do formulario

    SetError(""); // Limpar o erro anterior

    if (username === fixedEmail && password === fixedSenha) {
      navigate("/jornadaativa/usuario/herofuncionario");
    } else {
      setError("Email ou Senha inválidos!");
    }
  };

  return (
    <div className="body">
      <main className="container">
        <form onSubmit={handleSubmit}>
          <h1>Login J.A</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {error && <p className="erro-message">{error}</p>}

          <button type="submit" className="login">
            Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
