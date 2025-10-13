import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@services/api";
import Sidebar from "@components/DashBoard/Sidebar";
import { Search, Trash2 } from "lucide-react";
import "../Evento/EventoForm.css";
import "./TreinoTabela.css";

const fmtYMDptBR = (v) => {
  if (!v) return "-";
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  try {
    return new Date(v).toLocaleDateString("pt-BR");
  } catch {
    return String(v);
  }
};

// função auxiliar de normalização de nível
const fmtNivel = (v) => {
  if (!v) return "-";
  const n = String(v).toLowerCase();
  if (n === "iniciante") return "Iniciante";
  if (n === "intermediario") return "Intermediário";
  if (n === "avancado") return "Avançado";
  return "-";
};

function AcoesTreino({ id, onDeleted }) {
  const navigate = useNavigate();
  const editar = () => navigate(`/admin/treinos/editar/${id}`);
  const remover = async () => {
    if (!confirm("Deseja excluir este treino?")) return;
    await api.delete(`/treinos/${id}`);
    onDeleted && onDeleted();
  };

  return (
    <div className="ev-actions">
      <button className="ev-icon-btn" title="Ver / Editar" onClick={editar}>
        🔍
      </button>
      <button
        className="ev-icon-btn ev-danger"
        title="Excluir"
        onClick={remover}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default function TreinoTabela() {
  const navigate = useNavigate();

  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("dark-mode") === "active"
  );
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("dark-mode", darkMode ? "active" : "inactive");
  }, [darkMode]);

  const loadTreinos = async (termo = "") => {
    try {
      setLoading(true);
      setErro("");
      const url = termo ? `/treinos?nome=${encodeURIComponent(termo)}` : "/treinos";
      const { data } = await api.get(url);
      const arr = Array.isArray(data) ? data : data?.content || [];
      const rows = arr.map((t) => ({
        id: t.id ?? t.idTreino ?? t.id_treino,
        nome: t.nome ?? "-",
        descricao: t.descricao ?? "",
        createdAt: t.createdAt ?? t.dataCriacao ?? t.created_at ?? null,
        nivel: t.nivel ?? t.level ?? "",
      }));
      setLista(rows);
    } catch (err) {
      console.error(err);
      setErro("Falha ao carregar treinos.");
      setLista([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreinos();
  }, []);

  // toda vez que o usuário digitar, dispara busca no backend
  useEffect(() => {
    const delay = setTimeout(() => {
      loadTreinos(busca.trim());
    }, 400); // debounce
    return () => clearTimeout(delay);
  }, [busca]);

  const total = lista.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = lista.slice(
    (safePage - 1) * pageSize,
    (safePage - 1) * pageSize + pageSize
  );

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
          <h1 className="ev-title">Tabela de Treinos</h1>

          <div className="ev-header-actions">
            <input
              type="text"
              className="ev-input"
              placeholder="Buscar por nome ou nível..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => navigate("/admin/treinos/novo")}
              className="ev-btn ev-btn-primary"
            >
              + Novo Treino
            </button>
          </div>
        </div>

        <div className="ev-table-wrap">
          <table className="ev-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Criado em</th>
                <th>Nível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="ev-empty">
                    Carregando…
                  </td>
                </tr>
              )}

              {erro && !loading && (
                <tr>
                  <td colSpan={6} className="ev-error">
                    {erro}
                  </td>
                </tr>
              )}

              {!loading && !erro && pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="ev-empty">
                    Nenhum treino encontrado.
                  </td>
                </tr>
              )}

              {!loading &&
                !erro &&
                pageRows.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td className="ev-strong">{t.nome}</td>
                    <td className="ev-muted">{t.descricao || "-"}</td>
                    <td>{fmtYMDptBR(t.createdAt)}</td>
                    <td>{fmtNivel(t.nivel)}</td>
                    <td>
                      <AcoesTreino id={t.id} onDeleted={() => loadTreinos(busca)} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="ev-footer">
          <div className="ev-pagination">
            <button
              className="ev-page-btn"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            <span className="ev-page-indicator">
              {safePage} / {totalPages}
            </span>
            <button
              className="ev-page-btn"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
          <div>
            <select
              className="ev-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5/página</option>
              <option value={10}>10/página</option>
              <option value={20}>20/página</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}
