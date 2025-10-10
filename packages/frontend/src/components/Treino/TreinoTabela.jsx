import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@services/api";
import Sidebar from "@components/DashBoard/Sidebar";
import { Search, Trash2 } from "lucide-react";
import "../Evento/EventoForm.css"; // reaproveitando estilos
import "./TreinoTabela.css"; // opcional para ajustes específicos

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

  const loadTreinos = async () => {
    try {
      setLoading(true);
      setErro("");
      const { data } = await api.get("/treinos");
      const arr = Array.isArray(data) ? data : data?.content || [];
      const rows = arr.map((t) => ({
        id: t.id ?? t.idTreino ?? t.id_treino,
        nome: t.nome ?? t.titulo ?? "-",
        descricao: t.descricao ?? "",
        createdAt: t.createdAt ?? t.criadoEm ?? t.dataCriacao ?? null,
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

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (t) =>
        t.nome?.toLowerCase().includes(q) ||
        t.descricao?.toLowerCase().includes(q)
    );
  }, [lista, busca]);

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtrados.slice(
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
              placeholder="Buscar por nome "
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="ev-empty">
                    Carregando…
                  </td>
                </tr>
              )}
              {erro && !loading && (
                <tr>
                  <td colSpan={5} className="ev-error">
                    {erro}
                  </td>
                </tr>
              )}
              {!loading && !erro && pageRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="ev-empty">
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
                    <td>
                      <AcoesTreino id={t.id} onDeleted={loadTreinos} />
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
