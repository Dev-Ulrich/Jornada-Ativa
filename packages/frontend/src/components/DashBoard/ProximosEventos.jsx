import { useEffect, useMemo, useState } from "react";
import api from "@services/api";
import "./ProximosEventos.css";

/**
 * Próximos Eventos
 * - Colunas: Status | Data | Nome (sem ações)
 * - Busca: GET /admin/eventos/proximos
 *
 * Props:
 *  - eventos?: Array<{ id, nome, data, status? }>  // se enviado, não busca na API
 *  - endpoint?: string                              // default: "/admin/eventos/proximos"
 *  - limite?: number                                // máximo de linhas (default 5)
 *  - titulo?: string                                // título do card
 */
export default function ProximosEventos({
  eventos,
  endpoint = "/eventos/proximos",
  limite = 5,               // ✅ agora 5 por padrão
  titulo = "Próximos eventos",
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(!Array.isArray(eventos));
  const [error, setError] = useState("");

  // normaliza payload flexível
  const normalize = (arr) =>
    (arr || []).map((e) => ({
      id: e.id || e.idEvento || e.id_evento || `${e.nome}-${e.data}`,
      nome: e.nome || e.titulo || e.name || "-",
      data: e.data || e.dataEvento || e.date || null,
      status: (e.status ?? e.ativo ?? e.active) ? "Ativo" : "Inativo",
    }));

  // 🔹 util: converte para timestamp (para ordenar); datas inválidas vão pro final
  const toTs = (d) => {
    if (!d) return Number.POSITIVE_INFINITY;
    const t = new Date(d).getTime();
    return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
  };

  // carrega da API se o prop "eventos" não vier
  useEffect(() => {
    if (Array.isArray(eventos)) {
      const norm = normalize(eventos)
        .sort((a, b) => toTs(a.data) - toTs(b.data));  // ✅ ordena asc
      setRows(norm);
      setLoading(false);
      setError("");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(endpoint);
        const norm = normalize(data)
          .sort((a, b) => toTs(a.data) - toTs(b.data)); // ✅ ordena asc
        setRows(norm);
      } catch (e) {
        console.error(e);
        setError("Falha ao carregar próximos eventos.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint, eventos]);

  // ✅ aplica limite aqui
  const list = useMemo(() => rows.slice(0, limite), [rows, limite]);

  return (
    <div className="prox-card">
      <div className="prox-header">
        <h3>{titulo}</h3>
      </div>

      <div className="prox-body">
        {loading && <div className="prox-hint">Carregando…</div>}
        {error && <div className="prox-warn">{error}</div>}

        <div className="prox-table-wrap">
          <table className="prox-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Data</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && list.length === 0 && (
                <tr>
                  <td className="prox-empty" colSpan={3}>
                    Nenhum evento encontrado.
                  </td>
                </tr>
              )}

              {list.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <span
                      className={
                        "chip " +
                        (ev.status === "Ativo" ? "chip-active" : "chip-inactive")
                      }
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td>
                    {ev.data
                      ? new Date(ev.data).toLocaleDateString("pt-BR")
                      : "--/--/----"}
                  </td>
                  <td className="prox-nome">{ev.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
