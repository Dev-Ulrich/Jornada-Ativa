import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@services/api";
import "../Evento/EventoForm.css"; // reaproveitando estilos

export default function NovoTreino() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", descricao: "", nivel: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(
    () =>
      form.nome.trim().length > 2 &&
      form.descricao.trim().length > 3 &&
      form.nivel.trim(),
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
        nivel: form.nivel.trim(),
      };
      await api.post("/treinos", payload);
      setSuccess("Treino criado com sucesso!");
      setTimeout(() => navigate("/admin/treinos"), 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Erro ao criar treino";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ev-form-page">
      {/* Limita a largura e centraliza tudo */}
      <div className="ev-container" style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Topo centrado; botão de voltar no canto direito */}
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
            Novo Treino
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

        {/* Card central com sombra */}
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
                placeholder="Ex.: Treino A - Resistência"
              />
            </div>

            <div className="ev-field">
              <label className="ev-label">Descrição</label>
              <textarea
                className="ev-textarea"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Detalhes do treino..."
              />
            </div>

            <div className="ev-field">
              <label className="ev-label">Nível</label>
              <select
                className="ev-select"
                name="nivel"
                value={form.nivel}
                onChange={handleChange}
              >
                {!form.nivel && <option value="">Selecione o nível</option>}
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            {error && <div className="ev-alert-error">{error}</div>}
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
                {submitting ? "Salvando..." : "Salvar Treino"}
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
