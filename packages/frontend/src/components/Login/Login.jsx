import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import api from "@services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // 🔑 A API espera { email, senha } (não "password")
      const { data } = await api.post("/auth/login", {
        email: email.trim(),
        senha: senha, // <- CORRETO
      });

      const token = data?.token || data?.access_token || data?.jwt;
      if (!token) throw new Error("A API não retornou o token");

      // Salva na mesma chave que o interceptor usa
      localStorage.setItem("ja_token", token);

      // Já busca o perfil com o Bearer do interceptor
      const { data: me } = await api.get("/auth/me");
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          nome: me.nome,
          email: me.email,
          foto: me.ftPerfil ?? null,
        })
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Falha no login";
      setMessage(apiMsg);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = email.trim() && senha;

  return (
    <div className="body">
      <main className="container">
        <form onSubmit={handleSubmit}>
          <h1>Login J.A</h1>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Lembrar Senha
            </label>
          </div>

          {message && <p>{message}</p>}

          <button
            type="submit"
            className="login"
            disabled={loading || !canSubmit}
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
