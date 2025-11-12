import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@services/api";
import Sidebar from "@components/DashBoard/Sidebar";
import { Search, Trash2 } from "lucide-react";
import "../Evento/EventoForm.css"; // reaproveitando estilos
import "./UsuarioTabela.css";     // (opcional) estilos específicos da tabela
import ConfirmModal from "../Common/ConfirmModal"


// Avatar simples (sem hooks)
function AvatarUser({ nome, foto }) {
  const letra = (nome?.trim()?.[0] || "U").toUpperCase();
  return (
    <div className="ev-avatar">
      {foto ? (
        <>
          <img
            src={foto}
            alt={nome || "Usuário"}
            className="ev-avatar-img"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fb = e.currentTarget.parentElement.querySelector(".ev-avatar-fallback");
              if (fb) fb.style.display = "flex";
            }}
          />
          <div className="ev-avatar-fallback" style={{ display: "none" }}>{letra}</div>
        </>
      ) : (
        <div className="ev-avatar-fallback">{letra}</div>
      )}
    </div>
  );
}

function AcoesUsuario({ id, onDeleted }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const editar = () => navigate(`/admin/usuarios/editar/${id}`);
  const askRemove = () => setOpen(true);

  const confirmRemove = async () => {
    await api.delete(`/usuarios/${id}`);
    onDeleted && onDeleted();
    setOpen(false);
  };

  return (
    <>
      <div className="ev-actions">
        <button className="ev-icon-btn" title="Ver / Editar" onClick={editar}>
          🔍
        </button>
        <button className="ev-icon-btn ev-danger" title="Excluir" onClick={askRemove}>
          <Trash2 size={18} />
        </button>
      </div>

      {/* Modal de confirmação */}
      <ConfirmModal
        open={open}
        title="Excluir usuário?"
        message="Deseja realmente excluir este usuário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        danger
        onConfirm={confirmRemove}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

// helper data: aceita "YYYY-MM-DD" sem timezone
const fmtYMDptBR = (v) => {
  if (!v) return "-";
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  try { return new Date(v).toLocaleDateString("pt-BR"); } catch { return String(v); }
};

export default function UsuarioTabela() {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("dark-mode") === "active");
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("dark-mode", darkMode ? "active" : "inactive");
  }, [darkMode]);

  const loadUsuarios = async () => {
    try {
      setLoading(true); setErro("");
      const { data } = await api.get("/usuarios");
      const arr = Array.isArray(data) ? data : data?.content || [];
      const rows = arr.map((u) => ({
        id: u.id ?? u.idUsuario ?? u.id_user,
        nome: u.nome ?? "-",
        email: u.email ?? "-",
        genero: u.genero ?? "-",
        dataNascimento: u.dataNascimento ?? null,
        nivel: u.nivel ?? "-",
        altura: u.altura ?? null,
        peso: u.peso ?? null,
        role: u.role ?? u.roles ?? "ROLE_USER",
        ftPerfil: u.ftPerfil ?? u.foto ?? "",
        createdAt: u.createdAt ?? u.criadoEm ?? null,
      }));
      setLista(rows);
    } catch (err) {
      console.error(err);
      setErro("Falha ao carregar usuários.");
      setLista([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsuarios(); }, []);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter((u) =>
      u.nome?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [lista, busca]);

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtrados.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize);

  const normalizeRoleLabel = (r) => {
    const s = Array.isArray(r) ? r[0] : r;
    if (String(s).toUpperCase().includes("ADMIN")) return "admin";
    return "user";
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection="usuarios"
        setActiveSection={() => {}}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((v) => !v)}
      />

      <main className="main">
        <div className="ev-header">
          <h1 className="ev-title">Tabela de Usuários</h1>

          <div className="ev-header-actions">
            <input
              type="text"
              className="ev-input"
              placeholder="Buscar por nome ou e-mail…"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPage(1); }}
            />
            <button onClick={() => navigate("/admin/usuarios/novo")} className="ev-btn ev-btn-primary">
              + Novo Usuário
            </button>
          </div>
        </div>

        <div className="ev-table-wrap">
          <table className="ev-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Gênero</th>
                <th>Nascimento</th>
                <th>Nível</th>
                <th>Altura</th>
                <th>Peso</th>
                <th>Role</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={12} className="ev-empty">Carregando…</td></tr>
              )}
              {erro && !loading && (
                <tr><td colSpan={12} className="ev-error">{erro}</td></tr>
              )}
              {!loading && !erro && pageRows.length === 0 && (
                <tr><td colSpan={12} className="ev-empty">Nenhum usuário encontrado.</td></tr>
              )}
              {!loading && !erro && pageRows.map((u) => (
                <tr key={u.id}>
                  <td><AvatarUser nome={u.nome} foto={u.ftPerfil} /></td>
                  <td>{u.id}</td>
                  <td className="ev-strong">{u.nome}</td>
                  <td className="ev-muted">{u.email}</td>
                  <td>{u.genero}</td>
                  <td>{fmtYMDptBR(u.dataNascimento)}</td>
                  <td>{u.nivel}</td>
                  <td>{u.altura ?? "-"}</td>
                  <td>{u.peso ?? "-"}</td>
                  <td>{normalizeRoleLabel(u.role)}</td>
                  <td>{fmtYMDptBR(u.createdAt)}</td>
                  <td><AcoesUsuario id={u.id} onDeleted={loadUsuarios} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ev-footer">
          <div className="ev-pagination">
            <button className="ev-page-btn" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
            <span className="ev-page-indicator">{safePage} / {totalPages}</span>
            <button className="ev-page-btn" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</button>
          </div>
          <div>
            <select className="ev-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
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
