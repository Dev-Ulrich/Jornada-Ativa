// src/pages/Treinos/EditarTreino.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@services/api";
import "../Evento/EventoForm.css"; // mantém seus estilos base

const NIVEIS = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const normalizeNivel = (v) => {
  if (!v) return "";
  const n = String(v).toLowerCase();
  if (n.startsWith("inic")) return "iniciante";
  if (n.startsWith("inter")) return "intermediario";
  if (n.startsWith("avan")) return "avancado";
  return n;
};

export default function EditarTreino() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    nivel: "",
    distanciaMinKm: "",
    distanciaMaxKm: "",
    duracaoAlvoMin: "",
    paceAlvoMinpkm: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Carregar dados do treino
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/treinos/${id}`);
        if (!mounted) return;

        setForm({
          nome: data?.nome ?? "",
          descricao: data?.descricao ?? "",
          nivel: normalizeNivel(data?.nivel),
          distanciaMinKm: data?.distanciaMinKm ?? data?.distancia_min_km ?? "",
          distanciaMaxKm: data?.distanciaMaxKm ?? data?.distancia_max_km ?? "",
          duracaoAlvoMin: data?.duracaoAlvoMin ?? data?.duracao_alvo_min ?? "",
          paceAlvoMinpkm: data?.paceAlvoMinpkm ?? data?.pace_alvo_minpkm ?? "",
        });
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Não foi possível carregar o treino."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Validações de metas (mesma lógica do seu arquivo)
  const parsed = useMemo(() => {
    const dm = form.distanciaMinKm === "" ? null : Number(form.distanciaMinKm);
    const dM = form.distanciaMaxKm === "" ? null : Number(form.distanciaMaxKm);
    const dur = form.duracaoAlvoMin === "" ? null : Number(form.duracaoAlvoMin);
    const pace =
      form.paceAlvoMinpkm === "" ? null : Number(form.paceAlvoMinpkm);
    return { dm, dM, dur, pace };
  }, [form]);

  const metaIncompleta = (parsed.dm === null) !== (parsed.dM === null);
  const faixaInvalida =
    parsed.dm !== null &&
    parsed.dM !== null &&
    Number.isFinite(parsed.dm) &&
    Number.isFinite(parsed.dM) &&
    parsed.dm > parsed.dM;

  const canSubmit =
    form.nome.trim().length > 0 &&
    normalizeNivel(form.nivel) &&
    !metaIncompleta &&
    !faixaInvalida &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        nivel: normalizeNivel(form.nivel),
        distanciaMinKm: parsed.dm,
        distanciaMaxKm: parsed.dM,
        duracaoAlvoMin: parsed.dur,
        paceAlvoMinpkm: parsed.pace,
      };

      await api.put(`/treinos/${id}`, payload);
      setSuccess("Treino atualizado com sucesso!");
      setTimeout(() => navigate("/admin/treinos"), 800);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao salvar alterações.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ev-form-page">
        <div className="ev-container" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 className="ev-title">Editar Treino</h1>
          <p className="ev-muted">Carregando…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ev-form-page">
      {/* container centralizado e com largura igual ao do NovoTreino */}
      <div className="ev-container" style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Topo com título central e botão Voltar alinhado à direita */}
        <div
          className="ev-topbar"
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
        >
          <h1 className="ev-title" style={{ margin: "0 auto", textAlign: "center" }}>
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

        {/* Card com o formulário — mesmo estilo do NovoTreino */}
        <div
          style={{
            background: "#1f1f1f",
            border: "1px solid #2c2c2c",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          }}
        >
          <form onSubmit={handleSubmit} className="ev-grid" style={{ gridTemplateColumns: "1fr", gap: 18 }}>
            {error && <div className="ev-alert ev-alert-error">{error}</div>}
            {success && <div className="ev-alert ev-alert-success">{success}</div>}

            <div className="ev-field">
              <label className="ev-label">Nome</label>
              <input
                type="text"
                name="nome"
                className="ev-input"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex.: Corrida leve"
                required
              />
            </div>

            <div className="ev-field">
              <label className="ev-label">Descrição</label>
              <textarea
                name="descricao"
                className="ev-textarea"
                rows={3}
                value={form.descricao}
                onChange={handleChange}
                placeholder="Ex.: Rodagem leve para base aeróbica"
              />
            </div>

            <div className="ev-field">
              <label className="ev-label">Nível</label>
              <select
                name="nivel"
                className="ev-select"
                value={normalizeNivel(form.nivel)}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o nível</option>
                {NIVEIS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            {/* metas em grid 2 colunas */}
            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div className="ev-field">
                <label className="ev-label">Distância mínima (km)</label>
                <input
                  type="number"
                  step="0.01"
                  name="distanciaMinKm"
                  className="ev-input"
                  value={form.distanciaMinKm}
                  onChange={handleChange}
                  placeholder="Ex.: 2.50"
                />
              </div>
              <div className="ev-field">
                <label className="ev-label">Distância máxima (km)</label>
                <input
                  type="number"
                  step="0.01"
                  name="distanciaMaxKm"
                  className="ev-input"
                  value={form.distanciaMaxKm}
                  onChange={handleChange}
                  placeholder="Ex.: 5.00"
                />
              </div>
            </div>

            <div className="ev-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div className="ev-field">
                <label className="ev-label">Duração alvo (minutos)</label>
                <input
                  type="number"
                  step="0.01"
                  name="duracaoAlvoMin"
                  className="ev-input"
                  value={form.duracaoAlvoMin}
                  onChange={handleChange}
                  placeholder="Ex.: 30"
                />
              </div>
              <div className="ev-field">
                <label className="ev-label">Pace alvo (min/km)</label>
                <input
                  type="number"
                  step="0.01"
                  name="paceAlvoMinpkm"
                  className="ev-input"
                  value={form.paceAlvoMinpkm}
                  onChange={handleChange}
                  placeholder="Ex.: 6.00"
                />
              </div>
            </div>

            {/* Avisos de validação */}
            {metaIncompleta && (
              <div className="ev-hint ev-alert-warning">
                Para definir meta de distância, preencha <b>mínimo e máximo</b>.
              </div>
            )}
            {faixaInvalida && (
              <div className="ev-alert ev-alert-warning">
                Faixa inválida: a distância mínima não pode ser maior que a máxima.
              </div>
            )}

            {/* Botões centralizados */}
            <div className="ev-actions" style={{ justifyContent: "center", paddingTop: 4 }}>
              <button
                type="submit"
                className="ev-btn ev-btn-primary"
                disabled={!canSubmit}
              >
                {submitting ? "Salvando…" : "Salvar alterações"}
              </button>
              <button
                type="button"
                className="ev-btn ev-btn-ghost"
                onClick={() => navigate("/admin/treinos")}
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
