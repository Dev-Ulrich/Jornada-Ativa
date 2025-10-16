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
      // sua API espera { email, senha }
      const { data } = await api.post("/auth/login", {
        email: email.trim(),
        senha,
      });

      const token = data?.token || data?.access_token || data?.jwt;
      if (!token) throw new Error("A API não retornou o token.");

      // salva e FORÇA o header global do axios (além do interceptor)
      localStorage.setItem("ja_token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // chama /auth/me passando o header explicitamente também (à prova de falhas)
      const { data: me } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          nome: me?.nome ?? "",
          email: me?.email ?? "",
          foto: me?.ftPerfil ?? null,
        })
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      // logs úteis p/ você ver no DevTools > Console e Network
      console.error("LOGIN/ME erro:", {
        status: err?.response?.status,
        data: err?.response?.data,
        headers: err?.response?.headers,
      });

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
        <form onSubmit={handleSubmit} noValidate>
          <h1>Login J.A</h1>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
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
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          {message && <p style={{ color: "#ff6b6b" }}>{message}</p>}

          <button className="login" type="submit" disabled={loading || !canSubmit}>
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
