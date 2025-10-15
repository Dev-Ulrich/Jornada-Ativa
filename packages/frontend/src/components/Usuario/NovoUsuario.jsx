import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@services/api";
import "../Evento/EventoForm.css";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
const isValidOptionalUrl = (v) => {
  if (!v) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};
const toRoleName = (v) =>
  String(v).toLowerCase() === "admin" ? "ROLE_ADMIN" : "ROLE_USER";

export default function NovoUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    genero: "",
    dataNascimento: "",
    nivel: "",
    altura: "",
    peso: "",
    role: "", // user|admin (frontend)
    ftPerfil: "", // opcional
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(
    () =>
      form.nome.trim() &&
      isEmail(form.email) &&
      form.senha.trim().length >= 6 &&
      form.genero.trim() &&
      /^\d{4}-\d{2}-\d{2}$/.test(form.dataNascimento) &&
      form.nivel.trim() &&
      String(form.altura).trim() !== "" &&
      String(form.peso).trim() !== "" &&
      (form.role === "user" || form.role === "admin") &&
      isValidOptionalUrl(form.ftPerfil),
    [form]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha, // backend hasheia
        genero: form.genero.trim(),
        dataNascimento: form.dataNascimento, // yyyy-MM-dd
        nivel: form.nivel.trim(),
        altura: Number(form.altura),
        peso: Number(form.peso),
        role: toRoleName(form.role), // ROLE_USER | ROLE_ADMIN
        ftPerfil: form.ftPerfil || null,
      };
      await api.post("/auth/register", payload);
      setSuccess("Usuário criado com sucesso!");
      setTimeout(() => navigate("/admin/usuarios"), 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Erro ao criar usuário";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ev-form-page">
      <div className="ev-container">
        <div className="ev-topbar">
          <h1 className="ev-title">Novo Usuário</h1>
          <button
            type="button"
            onClick={() => navigate("/admin/usuarios")}
            className="ev-back"
          >
            ← Voltar para Tabela
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ev-grid">
          {/* Coluna esquerda: preview da foto */}
          <div>
            <div className="ev-card">
              <p className="ev-label" style={{ marginBottom: 8 }}>
                Pré-visualização
              </p>
              <div className="ev-preview">
                {form.ftPerfil ? (
                  <img
                    src={form.ftPerfil}
                    alt={form.nome || "Foto"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="ev-label" style={{ color: "#a3a3a3" }}>
                    Foto
                  </div>
                )}
              </div>
              <p className="ev-note">URL opcional para foto (CDN/Imgur).</p>
            </div>
          </div>

          {/* Coluna direita: formulário */}
          <div className="ev-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="ev-field">
              <label className="ev-label">Nome</label>
              <input
                className="ev-input"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="ev-field">
                <label className="ev-label">E-mail</label>
                <input
                  className="ev-input"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {!isEmail(form.email) && (
                  <p className="ev-alert-error">E-mail inválido</p>
                )}
              </div>
              <div className="ev-field">
                <label className="ev-label">Senha</label>
                <input
                  type="password"
                  className="ev-input"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="ev-field">
                <label className="ev-label">Gênero</label>
                <select
                  className="ev-select"
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  placeholder="Masculino/Feminino/Outro"
                >
                  {!form.genero && <option value="">Selecione o genero</option>}
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="ev-field">
                <label className="ev-label">Data de Nascimento</label>
                <input
                  type="date"
                  className="ev-input"
                  name="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {/* NÍVEL */}
              <div className="ev-field">
                <label className="ev-label">Nível</label>
                <select
                  className="ev-select"
                  name="nivel"
                  value={form.nivel}
                  onChange={handleChange}
                >
                  {!form.nivel && <option value="">Selecione o nível</option>}
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediario">Intermediário</option>
                  <option value="Avancado">Avançado</option>
                </select>
              </div>

              {/* ROLE */}
              <div className="ev-field">
                <label className="ev-label">Cargo</label>
                <select
                  className="ev-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  {!form.role && <option value="">Selecione um cargo</option>}
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="ev-field">
                <label className="ev-label">Altura (cm)</label>
                <input
                  className="ev-input"
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                />
              </div>
              <div className="ev-field">
                <label className="ev-label">Peso (kg)</label>
                <input
                  className="ev-input"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ev-field">
              <label className="ev-label">Foto (URL pública, opcional)</label>
              <input
                className="ev-input"
                name="ftPerfil"
                value={form.ftPerfil}
                onChange={handleChange}
                placeholder="https://.../foto.jpg"
              />
              {!isValidOptionalUrl(form.ftPerfil) && (
                <p className="ev-alert-error">URL inválida</p>
              )}
            </div>

            {error && <div className="ev-alert-error">{error}</div>}
            {success && <div className="ev-alert-ok">{success}</div>}

            <div className="ev-actions">
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="ev-btn ev-btn-primary"
              >
                {submitting ? "Salvando..." : "Salvar Usuário"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/usuarios")}
                className="ev-btn ev-btn-ghost"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
