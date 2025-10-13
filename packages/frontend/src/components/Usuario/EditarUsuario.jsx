import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

// Mantém ROLE_* no back
const toRoleName = (v) => {
  if (!v) return ""; // não envia nada se não foi escolhido (canSubmit evita submit)
  return String(v).toLowerCase().includes("admin") ? "ROLE_ADMIN" : "ROLE_USER";
};

// Corrigido: se vier vazio/undefined/array vazio, retorna ""
const fromRoleName = (r) => {
  if (!r) return "";
  const s = Array.isArray(r) ? r.join(",") : String(r);
  const up = s.toUpperCase();
  if (up.includes("ADMIN")) return "admin";
  if (up.includes("USER")) return "user";
  return "";
};

const toYMD = (input) => {
  if (!input) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return String(input).slice(0, 10);
};

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    genero: "",
    dataNascimento: "",
    nivel: "", // <- começa vazio para mostrar placeholder
    altura: "",
    peso: "",
    role: "", // <- começa vazio para mostrar "Selecione um cargo"
    ftPerfil: "",
    senha: "", // opcional na edição; só envia se preenchida
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/usuarios/${id}`);
        if (!alive) return;
        setForm((f) => ({
          ...f,
          nome: data?.nome ?? "",
          email: data?.email ?? "",
          genero: data?.genero ?? "",
          dataNascimento: toYMD(data?.dataNascimento),
          nivel: (data?.nivel ?? "").toString().toLowerCase(), // mantém "" se vier null/undefined
          altura: data?.altura ?? "",
          peso: data?.peso ?? "",
          role: fromRoleName(data?.role ?? data?.roles), // "" se não houver
          ftPerfil: data?.ftPerfil ?? data?.foto ?? "",
          senha: "",
        }));
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Erro ao carregar usuário";
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const canSubmit = useMemo(() => {
    const roleOk = form.role === "user" || form.role === "admin";
    const nivelOk = ["iniciante", "intermediario", "avancado"].includes(
      (form.nivel || "").toLowerCase()
    );

    return (
      form.nome.trim() &&
      isEmail(form.email) &&
      form.genero.trim() &&
      /^\d{4}-\d{2}-\d{2}$/.test(form.dataNascimento) &&
      nivelOk &&
      String(form.altura).trim() !== "" &&
      String(form.peso).trim() !== "" &&
      roleOk &&
      isValidOptionalUrl(form.ftPerfil)
    );
  }, [form]);

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
        genero: form.genero.trim(),
        dataNascimento: form.dataNascimento,
        nivel: form.nivel.trim(),
        altura: Number(form.altura),
        peso: Number(form.peso),
        role: toRoleName(form.role), // ROLE_ADMIN | ROLE_USER
        ftPerfil: form.ftPerfil || null,
        ...(form.senha ? { senha: form.senha } : {}),
      };
      await api.put(`/usuarios/${id}`, payload);
      setSuccess("Usuário atualizado com sucesso!");
      setTimeout(() => navigate("/admin/usuarios"), 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao salvar alterações";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ev-form-page">
        <div className="ev-container">
          <div className="ev-topbar">
            <div className="ev-card" style={{ height: 36, width: 160 }} />
            <div className="ev-card" style={{ height: 36, width: 180 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ev-form-page">
      <div className="ev-container">
        <div className="ev-topbar">
          {form?.nome
            ? `Editar Usuario ( ${form.nome} )`
            : `Editar Usuario #${id}`}
          <button
            type="button"
            onClick={() => navigate("/admin/usuarios")}
            className="ev-back"
          >
            ← Voltar para Tabela
          </button>
        </div>

        {error && (
          <div className="ev-alert-error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="ev-grid">
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
                <label className="ev-label">
                  Senha (preencher para alterar)
                </label>
                <input
                  type="password"
                  className="ev-input"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
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

            {/* Nível + Role com placeholders que somem */}
            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="ev-field">
                <label className="ev-label">Nível</label>
                <select
                  className="ev-select"
                  name="nivel"
                  value={form.nivel ?? ""}
                  onChange={handleChange}
                >
                  {!form.nivel && (
                    <option value="" disabled>
                      Selecione o nível
                    </option>
                  )}
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              <div className="ev-field">
                <label className="ev-label">Role</label>
                <select
                  className="ev-select"
                  name="role"
                  value={form.role ?? ""}
                  onChange={handleChange}
                >
                  {!form.role && (
                    <option value="" disabled>
                      Selecione um cargo
                    </option>
                  )}
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

            {success && <div className="ev-alert-ok">{success}</div>}

            <div className="ev-actions">
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="ev-btn ev-btn-primary"
              >
                {submitting ? "Salvando..." : "Salvar Alterações"}
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
