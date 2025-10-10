import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@services/api";
import "./EventoForm.css"; 


// validações
const isValidRequiredUrl = (v) => {
  if (!v) return false;
  try { new URL(v); return true; } catch { return false; }
};
const isValidOptionalUrl = (v) => {
  if (!v) return true;
  try { new URL(v); return true; } catch { return false; }
};

export default function NovoEvento() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataEvento: "",
    imagemEvento: "",
    linkEvento: "",
    status: "ATIVO",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(() => (
    form.nome.trim().length > 2 &&
    form.descricao.trim().length > 3 &&
    /^\d{4}-\d{2}-\d{2}$/.test(form.dataEvento) &&
    isValidRequiredUrl(form.linkEvento) &&
    isValidOptionalUrl(form.imagemEvento) &&
    form.status.trim().length > 0
  ), [form]);

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
        dataEvento: form.dataEvento,     // yyyy-MM-dd (LocalDate)
        imagemEvento: form.imagemEvento || null,
        linkEvento: form.linkEvento.trim(),
        status: form.status.trim(),
      };
      await api.post("/eventos", payload);
      setSuccess("Evento criado com sucesso!");
      setTimeout(() => navigate("/admin/eventos"), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao criar evento";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="ev-form-page">
    <div className="ev-container">
      <div className="ev-topbar">
        <h1 className="ev-title">Novo Evento</h1>
        <button type="button" onClick={() => navigate("/admin/eventos")} className="ev-back">
          ← Voltar para Tabela
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ev-grid">
        <div>
          <div className="ev-card">
            <p className="ev-label" style={{marginBottom: 8}}>Pré-visualização</p>
            <div className="ev-preview">
              {form.imagemEvento ? (
                <img src={form.imagemEvento} alt={form.nome || "Prévia do Evento"}
                     onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : <div className="ev-label" style={{color:"#a3a3a3"}}>Imagem</div>}
            </div>
            <p className="ev-note">Dica: use uma URL pública (CDN/Imgur) para a imagem ou deixe em branco.</p>
          </div>
        </div>

        <div className="ev-grid" style={{gridTemplateColumns:"1fr"}}>
          <div className="ev-field">
            <label className="ev-label">Nome</label>
            <input className="ev-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex.: Corrida Noturna" />
          </div>

          <div className="ev-field">
            <label className="ev-label">Descrição</label>
            <textarea className="ev-textarea" name="descricao" value={form.descricao}
                      onChange={handleChange} placeholder="Detalhes do evento..." />
          </div>

          <div className="ev-grid" style={{gridTemplateColumns:"1fr 1fr"}}>
            <div className="ev-field">
              <label className="ev-label">Data do Evento</label>
              <input type="date" className="ev-input" name="dataEvento" value={form.dataEvento} onChange={handleChange} />
              <span className="ev-note">Formato enviado: yyyy-MM-dd</span>
            </div>

            <div className="ev-field">
              <label className="ev-label">Status</label>
              <select className="ev-select" name="status" value={form.status} onChange={handleChange}>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="ev-grid" style={{gridTemplateColumns:"1fr 1fr"}}>
            <div className="ev-field">
              <label className="ev-label">Link do Evento</label>
              <input className="ev-input" name="linkEvento" value={form.linkEvento}
                     onChange={handleChange} placeholder="https://exemplo.com/meu-evento" />
              {!isValidRequiredUrl(form.linkEvento) && <p className="ev-alert-error">URL inválida</p>}
            </div>

            <div className="ev-field">
              <label className="ev-label">Imagem (URL pública, opcional)</label>
              <input className="ev-input" name="imagemEvento" value={form.imagemEvento}
                     onChange={handleChange} placeholder="https://.../imagem.jpg" />
              {!isValidOptionalUrl(form.imagemEvento) && <p className="ev-alert-error">URL inválida</p>}
            </div>
          </div>

          {error && <div className="ev-alert-error">{error}</div>}
          {success && <div className="ev-alert-ok">{success}</div>}

          <div className="ev-actions">
            <button type="submit" disabled={!canSubmit || submitting} className="ev-btn ev-btn-primary">
              {submitting ? "Salvando..." : "Salvar Evento"}
            </button>
            <button type="button" onClick={() => setForm({ nome: "", descricao: "", dataEvento: "", imagemEvento: "", linkEvento: "", status: "ATIVO" })}
                    className="ev-btn ev-btn-ghost">
              Limpar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}