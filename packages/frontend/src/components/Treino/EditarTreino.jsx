import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@services/api";
import "../Evento/EventoForm.css"; // reaproveitando estilos

export default function EditarTreino() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({ nome: "", descricao: "" });
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

  const canSubmit = useMemo(
    () => form.nome.trim().length > 2 && form.descricao.trim().length > 3,
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
        descricao: form.descricao.trim(),
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
      {/* Limita a largura e centraliza tudo */}
      <div className="ev-container" style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Título central e botão voltar à direita */}
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
            Editar Treino
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

        {/* Card central */}
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

            {success && <div className="ev-alert-ok">{success}</div>}

            {/* Botões centralizados */}
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
