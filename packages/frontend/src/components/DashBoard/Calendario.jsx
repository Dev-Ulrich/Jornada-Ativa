// src/components/Calendario/Calendario.jsx
import { useMemo } from "react";
import "./Calendario.css";

/**
 * Props:
 *  - eventos: Array<{ id, nome, data (YYYY-MM-DD|ISO), status? }>
 *  - titulo?: string (default: "EVENTOS")
 *  - startOnMonday?: boolean (default: true) → inicia a grade na segunda
 */
export default function Calendario({
  eventos = [],
  titulo = "EVENTOS",
  startOnMonday = true,
  size = "normal", // "normal" | "compact"
}) {
  const now = useMemo(() => new Date(), []);
  const y = now.getFullYear();
  const m = now.getMonth();

  const months = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
  ];
  const weekdaysFull = ["DOMINGO","SEGUNDA","TERÇA","QUARTA","QUINTA","SEXTA","SÁBADO"];
  const weekdayLabels = ["S","T","Q","Q","S","S","D"]; // cabeçalho compacto

  // zera horas p/ comparar por dia
  const toKey = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const todayKey = toKey(now);

  // normaliza eventos do mês corrente
  const parsed = (eventos || [])
    .map((e) => {
      const d = new Date(e.data);
      return { ...e, dateObj: d, key: toKey(d) };
    })
    .filter((e) => e.dateObj.getMonth() === m && e.dateObj.getFullYear() === y);

  // dia -> { status: "upcoming" | "past", nomes: [] }
  const eventMap = new Map();
  for (const e of parsed) {
    const day = e.dateObj.getDate();
    const status = e.key < todayKey ? "past" : "upcoming";
    const current = eventMap.get(day) || { status, nomes: [] };
    const newStatus =
      current.status === "upcoming" || status === "upcoming" ? "upcoming" : "past";
    eventMap.set(day, { status: newStatus, nomes: [...current.nomes, e.nome] });
  }

  // grid do mês
  const firstDay = new Date(y, m, 1);
  const jsWeekday = firstDay.getDay(); // 0=Dom..6=Sab
  const startOffset = startOnMonday ? (jsWeekday + 6) % 7 : jsWeekday;
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const grid = [];
  for (let i = 0; i < startOffset; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  const eventosHoje = eventMap.get(now.getDate());
  const notificacaoHoje =
    eventosHoje && eventosHoje.nomes.length ? eventosHoje.nomes.join(", ") : null;

  return (
    <div className={`cal-card ${size === "compact" ? "cal-compact" : ""}`}>
      <div className="cal-header">
        <div className="cal-weekday">{weekdaysFull[now.getDay()]}</div>
        <div className="cal-day">{String(now.getDate()).padStart(2, "0")}</div>
        <div className="cal-title">{titulo}</div>
      </div>

      <div className="cal-month">
        {months[m]} {y}
      </div>

      <div className="cal-grid">
        {weekdayLabels.map((l) => (
          <div key={l} className="cal-grid-label">
            {l}
          </div>
        ))}

        {grid.map((d, i) => {
          const isToday = d === now.getDate();
          const info = d ? eventMap.get(d) : null;

          let cls = "cal-cell";
          if (isToday) cls += " is-today";
          if (info) {
            if (info.status === "upcoming") cls += " is-upcoming";
            if (info.status === "past") cls += " is-past";
            if (isToday) cls += " is-today-upcoming";
          }

          return (
            <div
              key={i}
              className={cls}
              title={info ? info.nomes.join(", ") : undefined}
            >
              {d ?? ""}
            </div>
          );
        })}
      </div>

      <div className="cal-notify">
        <div className="cal-notify-title">
          Notificações de {String(now.getDate()).padStart(2, "0")} de{" "}
          {months[m].toLowerCase()} de {y} :
        </div>
        {notificacaoHoje ? (
          <div className="cal-notify-text">{notificacaoHoje}</div>
        ) : (
          <div className="cal-notify-empty">Nenhum evento proposto para hj</div>
        )}
      </div>
    </div>
  );
}
