import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@services/api";
import Sidebar from "@components/DashBoard/Sidebar";
import "./EventoTabela.css";
import { Trash2 } from "lucide-react";
import ConfirmModal from "../Common/ConfirmModal";

// Avatar do evento (sem hooks)
function AvatarEvento({ nome, imagemUrl }) {
  const letra = (nome?.trim()?.[0] || "E").toUpperCase();
  return (
    <div className="ev-avatar">
      {imagemUrl ? (
        <>
          <img
            src={imagemUrl}
            alt={nome || "Evento"}
            className="ev-avatar-img"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fb = e.currentTarget.parentElement.querySelector(
                ".ev-avatar-fallback"
              );
              if (fb) fb.style.display = "flex";
            }}
          />
          <div className="ev-avatar-fallback" style={{ display: "none" }}>
            {letra}
          </div>
        </>
      ) : (
        <div className="ev-avatar-fallback">{letra}</div>
      )}
    </div>
  );
}

// Botões de ação (editar/excluir)
function AcoesEvento({ id, onDeleted }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const editar = () => navigate(`/admin/eventos/editar/${id}`);
  const askRemove = () => setOpen(true);

  const confirmRemove = async () => {
    await api.delete(`/eventos/${id}`);
    onDeleted && onDeleted();
    setOpen(false);
  };

  return (
    <>
      <div className="ev-actions">
        <button className="ev-icon-btn" title="Ver / Editar" onClick={editar}>
          🔍
        </button>
        <button
          className="ev-icon-btn ev-danger"
          title="Excluir"
          onClick={askRemove}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <ConfirmModal
        open={open}
        title="Excluir evento?"
        message="Deseja realmente excluir este evento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        danger
        onConfirm={confirmRemove}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default function EventoTabela() {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("dark-mode") === "active"
  );
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("dark-mode", darkMode ? "active" : "inactive");
  }, [darkMode]);

  // função para carregar a lista (reusada após delete)
  const loadEventos = async () => {
    try {
      setLoading(true);
      setErro("");
      const { data } = await api.get("/eventos");
      const arr = Array.isArray(data) ? data : data?.content || [];
      const rows = arr.map((e) => {
        const statusStr =
          typeof e.status === "string"
            ? e.status
            : e.status ?? e.ativo ?? e.active
            ? "ATIVO"
            : "INATIVO";
        return {
          id: e.id ?? e.idEvento ?? e.id_evento,
          nome: e.nome ?? e.titulo ?? e.name ?? "-",
          descricao: e.descricao ?? "",
          link: e.linkEvento ?? e.link ?? "",
          dataEvento: e.dataEvento ?? e.data ?? null, // esperado: "YYYY-MM-DD"
          createdAt: e.createdAt ?? e.criadoEm ?? e.dataCriacao ?? null,
          imagem: e.imagemEvento ?? e.imagem ?? "",
          status: statusStr, // "ATIVO" | "INATIVO" | "CANCELADO"
        };
      });
      setLista(rows);
    } catch (err) {
      console.error(err);
      setErro("Falha ao carregar eventos.");
      setLista([]);
    } finally {
      setLoading(false);
    }
  };

  // carregar eventos
  useEffect(() => {
    loadEventos();
  }, []);

  // filtro por nome
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter((e) => e.nome?.toLowerCase().includes(q));
  }, [lista, busca]);

  // helper para mostrar data "YYYY-MM-DD" sem quebrar fuso
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

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection="eventos"
        setActiveSection={() => {}}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((v) => !v)}
      />

      <main className="main">
        <div className="ev-header">
          <h1 className="ev-title">Tabela de Eventos</h1>

          <div className="ev-header-actions">
            <input
              type="text"
              className="ev-input"
              placeholder="Buscar por nome…"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
              }}
            />
            <button
              onClick={() => navigate("/admin/eventos/novo")}
              className="ev-btn ev-btn-primary"
            >
              + Novo Evento
            </button>
          </div>
        </div>

        {/* scroll interno */}
        <div
          className="ev-table-wrap"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <table className="ev-table">
            <thead>
              <tr>
                <th>Imagem Evento</th>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Link do Evento</th>
                <th>Data do Evento</th>
                <th>Data de Criação</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="ev-empty">
                    Carregando…
                  </td>
                </tr>
              )}
              {erro && !loading && (
                <tr>
                  <td colSpan={9} className="ev-error">
                    {erro}
                  </td>
                </tr>
              )}
              {!loading && !erro && filtrados.length === 0 && (
                <tr>
                  <td colSpan={9} className="ev-empty">
                    Nenhum evento encontrado.
                  </td>
                </tr>
              )}

              {!loading &&
                !erro &&
                filtrados.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <AvatarEvento nome={ev.nome} imagemUrl={ev.imagem} />
                    </td>
                    <td>{ev.id}</td>
                    <td className="ev-strong">{ev.nome}</td>
                    <td className="ev-muted">{ev.descricao || "-"}</td>
                    <td>
                      {ev.link ? (
                        <a
                          href={ev.link}
                          target="_blank"
                          rel="noreferrer"
                          className="ev-link"
                        >
                          {ev.link}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{fmtYMDptBR(ev.dataEvento)}</td>
                    <td>{fmtYMDptBR(ev.createdAt)}</td>
                    <td>
                      <span
                        className={
                          "ev-badge " +
                          (ev.status?.toUpperCase() === "ATIVO"
                            ? "ev-badge-active"
                            : ev.status?.toUpperCase() === "CANCELADO"
                            ? "ev-badge-cancel"
                            : "ev-badge-inactive")
                        }
                      >
                        {ev.status?.charAt(0).toUpperCase() +
                          ev.status?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td>
                      <AcoesEvento id={ev.id} onDeleted={loadEventos} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="ev-footer" style={{ justifyContent: "flex-end" }}>
          <span className="ev-muted">
            Total de eventos: {filtrados.length}
          </span>
        </div>
      </main>
    </div>
  );
}
