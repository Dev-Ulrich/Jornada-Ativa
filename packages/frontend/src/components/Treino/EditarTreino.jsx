// src/pages/Treinos/EditarTreino.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@services/api";
import Sidebar from "@components/DashBoard/Sidebar";
import "../Evento/EventoForm.css"; // mantém seu estilo base de formulários

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

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("dark-mode") === "active"
  );
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("dark-mode", darkMode ? "active" : "inactive");
  }, [darkMode]);

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

  // Validações de metas
  const parsed = useMemo(() => {
    const dm = form.distanciaMinKm === "" ? null : Number(form.distanciaMinKm);
    const dM = form.distanciaMaxKm === "" ? null : Number(form.distanciaMaxKm);
    const dur = form.duracaoAlvoMin === "" ? null : Number(form.duracaoAlvoMin);
    const pace =
      form.paceAlvoMinpkm === "" ? null : Number(form.paceAlvoMinpkm);
    return { dm, dM, dur, pace };
  }, [form]);

  const metaIncompleta = (parsed.dm === null) !== (parsed.dM === null); // apenas um dos dois preenchido
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
      <div className="dashboard-container">
        <Sidebar
          activeSection="treinos"
          setActiveSection={() => {}}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((v) => !v)}
        />
        <main className="main">
          <h1 className="ev-title">Editar Treino</h1>
          <p className="ev-muted">Carregando…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection="treinos"
        setActiveSection={() => {}}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((v) => !v)}
      />

      <main className="main">
        <div className="ev-header">
          <h1 className="ev-title">Editar Treino</h1>
        </div>

        <form className="ev-form" onSubmit={handleSubmit}>
          {error && <div className="ev-alert ev-alert-error">{error}</div>}
          {success && (
            <div className="ev-alert ev-alert-success">{success}</div>
          )}

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
              className="ev-input"
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
              className="ev-input"
              value={normalizeNivel(form.nivel)}
              onChange={handleChange}
              required
            >
              <option value="">Selecione…</option>
              {NIVEIS.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          {/* ------- Novos Campos de Meta ------- */}
          <div className="ev-grid-2">
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

          <div className="ev-grid-2">
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
              Para definir meta de distância, preencha **mínimo e máximo**.
            </div>
          )}
          {faixaInvalida && (
            <div className="ev-alert ev-alert-warning">
              Faixa inválida: a distância mínima não pode ser maior que a
              máxima.
            </div>
          )}

          <div className="ev-actions">
            <button
              type="button"
              className="ev-btn"
              onClick={() => navigate("/admin/treinos")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="ev-btn ev-btn-primary"
              disabled={!canSubmit}
            >
              {submitting ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
