import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@services/api";
import "../Evento/EventoForm.css"; // reaproveitando estilos

// --------- Normalização de Nível (aceita vários formatos) ----------
const normalizeNivel = (raw) => {
  if (raw == null) return "";
  if (typeof raw === "object") {
    const v =
      raw.name ??
      raw.value ??
      raw.label ??
      raw.nivel ??
      raw.level ??
      raw.nivelNome ??
      raw.nivelDescricao ??
      raw.nivel_display;
    if (v != null) return normalizeNivel(v);
    return "";
  }
  const n = String(raw).trim().toLowerCase();
  if (["1", "iniciante", "iniciantes"].includes(n)) return "iniciante";
  if (["2", "intermediario", "intermediário", "intermed"].includes(n))
    return "intermediario";
  if (["3", "avancado", "avançado", "advanced"].includes(n)) return "avancado";
  return "";
};
// -------------------------------------------------------------------

export default function EditarTreino() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    nivel: "", // <- começa vazio para mostrar o placeholder
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
        const { data } = await api.get(`/treinos/${id}`);
        if (!alive) return;
        setForm({
          nome: data?.nome ?? "",
          descricao: data?.descricao ?? "",
          nivel: normalizeNivel(data?.nivel), // <- carrega do back normalizado
        });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Erro ao carregar treino";
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
    const nomeOk = form.nome.trim().length > 2;
    const descOk = form.descricao.trim().length > 3;
    const nivelOk = ["iniciante", "intermediario", "avancado"].includes(
      (form.nivel || "").toLowerCase()
    );
    return nomeOk && descOk && nivelOk;
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
        descricao: form.descricao.trim(),
        nivel: form.nivel.trim().toLowerCase(), // <- envia pro back
      };
      await api.put(`/treinos/${id}`, payload);
      setSuccess("Treino atualizado com sucesso!");
      setTimeout(() => navigate("/admin/treinos"), 800);
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
        <div
          className="ev-container"
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          <div className="ev-topbar" style={{ gap: 12, marginBottom: 16 }}>
            <div className="ev-card" style={{ height: 36, width: 160 }} />
            <div
              className="ev-card"
              style={{ height: 36, width: 180, marginLeft: "auto" }}
            />
          </div>
          <div
            className="ev-card"
            style={{
              height: 180,
              borderRadius: 18,
              background: "#1f1f1f",
              border: "1px solid #2c2c2c",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ev-form-page">
      <div className="ev-container" style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          className="ev-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <h1
            className="ev-title"
            style={{ margin: "0 auto", textAlign: "center" }}
          >
            {form?.nome
              ? `Editar Treino ( ${form.nome} )`
              : `Editar Treino #${id}`}
          </h1>
          <button
            type="button"
            onClick={() => navigate("/admin/treinos")}
            className="ev-back"
            style={{ marginLeft: "auto" }}
          >
            ← Voltar para Tabela
          </button>
        </div>

        {error && (
          <div className="ev-alert-error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div
          style={{
            background: "#1f1f1f",
            border: "1px solid #2c2c2c",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="ev-grid"
            style={{ gridTemplateColumns: "1fr", gap: 18 }}
          >
            <div className="ev-field">
              <label className="ev-label">Nome</label>
              <input
                className="ev-input"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div className="ev-field">
              <label className="ev-label">Descrição</label>
              <textarea
                className="ev-textarea"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

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

            {success && <div className="ev-alert-ok">{success}</div>}

            <div
              className="ev-actions"
              style={{ justifyContent: "center", paddingTop: 4 }}
            >
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="ev-btn ev-btn-primary"
              >
                {submitting ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/treinos")}
                className="ev-btn ev-btn-ghost"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
