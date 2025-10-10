import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@services/api";
import "./EventoForm.css"; // ajuste o path se necessário

// validações
const isValidRequiredUrl = (v) => {
  if (!v) return false;
  try { new URL(v); return true; } catch { return false; }
};
const isValidOptionalUrl = (v) => {
  if (!v) return true;
  try { new URL(v); return true; } catch { return false; }
};

// coerção de data para yyyy-MM-dd (caso backend retorne ISO com hora)
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

export default function EditarEventos() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataEvento: "",
    imagemEvento: "",
    linkEvento: "",
    status: "ATIVO",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // carregar dados do evento
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/eventos/${id}`);
        if (!alive) return;
        setForm({
          nome: data?.nome ?? "",
          descricao: data?.descricao ?? "",
          dataEvento: toYMD(data?.dataEvento),
          imagemEvento: data?.imagemEvento ?? "",
          linkEvento: data?.linkEvento ?? "",
          status: data?.status ?? "ATIVO",
        });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Erro ao carregar evento";
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

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
        dataEvento: form.dataEvento, // yyyy-MM-dd
        imagemEvento: form.imagemEvento || null,
        linkEvento: form.linkEvento.trim(),
        status: form.status.trim(),
      };
      await api.put(`/eventos/${id}`, payload);
      setSuccess("Evento atualizado com sucesso!");
      setTimeout(() => navigate("/admin/eventos"), 800);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao salvar alterações";
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
            <div className="h-8 w-48 ev-card" />
            <div className="h-9 w-48 ev-card" />
          </div>
          <div className="ev-grid">
            <div className="ev-card" style={{ height: 256 }} />
            <div className="ev-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="ev-card" style={{ height: 48 }} />
              <div className="ev-card" style={{ height: 112 }} />
              <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="ev-card" style={{ height: 48 }} />
                <div className="ev-card" style={{ height: 48 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ev-form-page">
      <div className="ev-container">
        <div className="ev-topbar">
          <h1 className="ev-title">Editar Evento #{id}</h1>
          <button
            type="button"
            onClick={() => navigate("/admin/eventos")}
            className="ev-back"
          >
            ← Voltar para Tabela
          </button>
        </div>

        {error && <div className="ev-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit} className="ev-grid">
          {/* Coluna esquerda: preview */}
          <div>
            <div className="ev-card">
              <p className="ev-label" style={{ marginBottom: 8 }}>Pré-visualização</p>
              <div className="ev-preview">
                {form.imagemEvento ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img
                    src={form.imagemEvento}
                    alt={form.nome || "Prévia do Evento"}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div className="ev-label" style={{ color: "#a3a3a3" }}>Imagem</div>
                )}
              </div>
              <p className="ev-note">Dica: use uma URL pública (CDN/Imgur) para a imagem ou deixe em branco.</p>
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
                placeholder="Ex.: Corrida Noturna"
              />
            </div>

            <div className="ev-field">
              <label className="ev-label">Descrição</label>
              <textarea
                className="ev-textarea"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Detalhes do evento..."
              />
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="ev-field">
                <label className="ev-label">Data do Evento</label>
                <input
                  type="date"
                  className="ev-input"
                  name="dataEvento"
                  value={form.dataEvento}
                  onChange={handleChange}
                />
                <span className="ev-note">Formato enviado: yyyy-MM-dd</span>
              </div>

              <div className="ev-field">
                <label className="ev-label">Status</label>
                <select
                  className="ev-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="ev-field">
                <label className="ev-label">Link do Evento</label>
                <input
                  className="ev-input"
                  name="linkEvento"
                  value={form.linkEvento}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/meu-evento"
                />
                {!isValidRequiredUrl(form.linkEvento) && (
                  <p className="ev-alert-error">URL inválida</p>
                )}
              </div>

              <div className="ev-field">
                <label className="ev-label">Imagem (URL pública, opcional)</label>
                <input
                  className="ev-input"
                  name="imagemEvento"
                  value={form.imagemEvento}
                  onChange={handleChange}
                  placeholder="https://.../imagem.jpg"
                />
                {!isValidOptionalUrl(form.imagemEvento) && (
                  <p className="ev-alert-error">URL inválida</p>
                )}
              </div>
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
                onClick={() => navigate("/admin/eventos")}
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
