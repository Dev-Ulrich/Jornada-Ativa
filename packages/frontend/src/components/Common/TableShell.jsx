import React from "react";
import "./TableShell.css";


export default function TableShell({
  title,
  actions,
  columns = [],
  data = [],
  loading = false,
  error = "",
  emptyText = "Nenhum registro encontrado.",
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil((total || data.length) / pageSize));

  const go = (p) => {
    if (!onPageChange) return;
    const np = Math.min(totalPages, Math.max(1, p));
    if (np !== page) onPageChange(np);
  };

  return (
    <div className="ts-card">
      <div className="ts-header">
        <h2 className="ts-title">{title}</h2>
        <div className="ts-actions">{actions}</div>
      </div>

      <div className="ts-body">
        {error ? (
          <div className="ts-state ts-error">{error}</div>
        ) : loading ? (
          <table className="ts-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} style={{ width: c.width, textAlign: c.align || "left" }}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="ts-skeleton-row">
                  {columns.map((c) => (
                    <td key={c.key}>
                      <div className="ts-skeleton" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : data.length === 0 ? (
          <div className="ts-state">{emptyText}</div>
        ) : (
          <table className="ts-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} style={{ width: c.width, textAlign: c.align || "left" }}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.id ?? idx}>
                  {columns.map((c) => (
                    <td key={c.key} style={{ textAlign: c.align || "left" }}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="ts-footer">
        <div className="ts-pagination">
          <button className="ts-page-btn" onClick={() => go(page - 1)} disabled={!onPageChange || page <= 1}>
            ‹
          </button>
          <span className="ts-page-label">
            Página <b>{page}</b> de <b>{totalPages}</b>
          </span>
          <button
            className="ts-page-btn"
            onClick={() => go(page + 1)}
            disabled={!onPageChange || page >= totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}