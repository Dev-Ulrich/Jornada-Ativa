import { useMemo } from "react";
import "./Calendario.css";

/**
 * Calendário mensal com marcação de eventos
 * - Laranja (#ff8633) para hoje/futuro; verde para passado
 * - Tooltip com "Nome — HH:mm"
 * - Notificação do dia lista "Nome — HH:mm" (ou só Nome)
 *
 * Props:
 *  - eventos: Array<{ nome|name|titulo, data|dataEvento|date, hora|horario|time|horaEvento }>
 *  - size?: "normal" | "compact"
 *  - titulo?: string
 */
export default function Calendario({
  eventos = [],
  size = "normal",
  titulo = "EVENTOS",
}) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const MONTHS = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ];
  const WEEK_LETTERS = ["S", "T", "Q", "Q", "S", "S", "D"];

  // Helpers
  const toMidnight = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayKey = toMidnight(now).getTime();

  // Aceita "YYYY-MM-DD" ou "DD/MM/YYYY"
  function parseDateFlexible(input) {
    if (!input) return null;
    if (typeof input === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [Y, M, D] = input.split("-").map(Number);
        return new Date(Y, M - 1, D);
      }
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
        const [D, M, Y] = input.split("/").map(Number);
        return new Date(Y, M - 1, D);
      }
    }
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Normaliza “hora” → "HH:mm"
  function normalizeTime(e) {
    const raw = e.hora ?? e.horario ?? e.time ?? e.horaEvento ?? null;
    if (!raw) return null;
    // tenta "HH:mm" direto
    if (/^\d{2}:\d{2}$/.test(raw)) return raw;
    // tenta Date/ISO
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      const h = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      return `${h}:${mi}`;
    }
    // tenta "HHmm"
    if (/^\d{3,4}$/.test(String(raw))) {
      const s = String(raw).padStart(4, "0");
      return `${s.slice(0, 2)}:${s.slice(2)}`;
    }
    return null;
  }

  const normEventos = useMemo(() => {
    return (Array.isArray(eventos) ? eventos : [])
      .map((e, i) => {
        const nome = e.nome || e.name || e.titulo || `Evento ${i + 1}`;
        const rawDate = e.data || e.dataEvento || e.date;
        const date = parseDateFlexible(rawDate);
        const hora = normalizeTime(e); // "HH:mm" ou null
        return { nome, date, hora };
      })
      .filter((e) => e.date);
  }, [eventos]);

  // Mapa de eventos por dia do mês atual
  const { grid, eventMap, nomesHoje } = useMemo(() => {
    const firstDay = new Date(y, m, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const g = [];
    for (let i = 0; i < startWeekday; i++) g.push(null);
    for (let d = 1; d <= daysInMonth; d++) g.push(d);

    const map = new Map(); // dia -> { status, itens: [{nome, hora}] }
    for (const ev of normEventos) {
      if (ev.date.getFullYear() !== y || ev.date.getMonth() !== m) continue;
      const day = ev.date.getDate();
      const key = toMidnight(ev.date).getTime();
      const status = key < todayKey ? "past" : "upcoming";
      const curr = map.get(day) || { status, itens: [] };
      map.set(day, {
        status:
          curr.status === "upcoming" || status === "upcoming"
            ? "upcoming"
            : "past",
        itens: [...curr.itens, { nome: ev.nome, hora: ev.hora }],
      });
    }

    const hoje = map.get(now.getDate());
    return { grid: g, eventMap: map, nomesHoje: hoje?.itens || [] };
  }, [normEventos, m, y]);

  // Monta texto "Nome — HH:mm" para tooltip/notificação
  const label = (it) => (it.hora ? `${it.nome} — ${it.hora}` : it.nome);

  return (
    <div className={`cal-card ${size === "compact" ? "cal-compact" : ""}`}>
      <div className="cal-header">
        <div className="cal-badge">
          {
            [
              "DOMINGO",
              "SEGUNDA",
              "TERÇA",
              "QUARTA",
              "QUINTA",
              "SEXTA",
              "SÁBADO",
            ][now.getDay()]
          }
        </div>
        <div className="cal-day">{String(now.getDate()).padStart(2, "0")}</div>
        <div className="cal-title">{titulo}</div>
      </div>

      <div className="cal-month">
        {MONTHS[m]} {y}
      </div>

      <div className="cal-grid">
        {WEEK_LETTERS.map((l, i) => (
          <div key={`${l}-${i}`} className="cal-week">
            {l}
          </div>
        ))}
        {grid.map((d, i) => {
          const info = d ? eventMap.get(d) : null;
          const isToday = d === now.getDate();
          let cls = "cal-cell";
          if (isToday) cls += " cal-today";
          if (info)
            cls += info.status === "upcoming" ? " cal-upcoming" : " cal-past";

          // tooltip com "Nome — HH:mm"
          const tip = info ? info.itens.map(label).join(", ") : undefined;

          return (
            <div key={i} className={cls} title={tip}>
              {d ?? ""}
            </div>
          );
        })}
      </div>

      <div className="cal-notify">
        <div className="cal-notify-title">
          Notificações de {String(now.getDate()).padStart(2, "0")} de{" "}
          {MONTHS[m].toLowerCase()} de {y} :
        </div>
        {nomesHoje.length ? (
          <div className="cal-notify-list">
            {nomesHoje.map((it, idx) => (
              <div key={idx} className="cal-notify-item">
                • {label(it)}
              </div>
            ))}
          </div>
        ) : (
          <div className="cal-notify-empty">Nenhum evento proposto para hj</div>
        )}
      </div>
    </div>
  );
}
