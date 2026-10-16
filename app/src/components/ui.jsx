import { useMemo } from 'react';
import { activityByDay, dayKey } from '../lib/progress.js';
import { pct } from '../lib/data.js';

export function StackBar({ stats, height = 8, title }) {
  const t = stats.total || 1;
  const c = (100 * stats.correct) / t;
  const w = (100 * stats.wrong) / t;
  return (
    <div className="stackbar" style={{ height }} title={title || `${stats.correct} correct · ${stats.wrong} incorrect · ${stats.total - stats.attempted} left`}>
      <span className="seg correct" style={{ width: `${c}%` }} />
      <span className="seg wrong" style={{ width: `${w}%` }} />
    </div>
  );
}

export function Ring({ value, total, size = 112, stroke = 10, label, sub }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const frac = total ? value / total : 0;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-value"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${C * frac} ${C}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-label">
        <strong>{label ?? `${pct(value, total)}%`}</strong>
        {sub && <span>{sub}</span>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, tone }) {
  return (
    <div className={`statcard ${tone || ''}`}>
      <div className="statcard-label">{label}</div>
      <div className="statcard-value">{value}</div>
      {sub && <div className="statcard-sub">{sub}</div>}
    </div>
  );
}

export function Heatmap({ progress, weeks = 26 }) {
  const days = useMemo(() => activityByDay(progress), [progress]);
  const cells = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1) - start.getDay());
  const d = new Date(start);
  let max = 1;
  for (const v of days.values()) max = Math.max(max, v.total);
  while (d <= today) {
    const k = dayKey(d.getTime());
    const v = days.get(k);
    const n = v ? v.total : 0;
    const level = n === 0 ? 0 : Math.min(4, Math.ceil((4 * n) / Math.max(max, 8)));
    cells.push({ k, n, level, dow: d.getDay(), correct: v ? v.correct : 0 });
    d.setDate(d.getDate() + 1);
  }
  const cols = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));
  return (
    <div className="heatmap" role="img" aria-label="Daily practice activity">
      {cols.map((col, i) => (
        <div className="heatmap-col" key={i}>
          {col.map((c) => (
            <span key={c.k} className={`hm l${c.level}`} title={`${c.k}: ${c.n} attempt${c.n === 1 ? '' : 's'}${c.n ? `, ${c.correct} correct` : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Badge({ children, tone = 'neutral', title }) {
  return (
    <span className={`badge badge-${tone}`} title={title}>
      {children}
    </span>
  );
}

export function StatusDot({ status }) {
  const label = { new: 'Unsolved', correct: 'Correct', wrong: 'Incorrect' }[status] || status;
  return <span className={`dot dot-${status}`} title={label} aria-label={label} />;
}

export function Icon({ name, size = 16 }) {
  const p = {
    star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
    flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
    note: 'M5 4h10l4 4v12H5zM15 4v4h4M8 12h8M8 16h5',
    left: 'M15 18l-6-6 6-6',
    right: 'M9 18l6-6-6-6',
    shuffle: 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
    search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-5-5',
    home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h8',
    calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    check: 'M5 12l5 5L20 7',
    x: 'M6 6l12 12M18 6 6 18',
    clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01',
    menu: 'M4 6h16M4 12h16M4 18h16',
    settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    play: 'M7 4v16l13-8z',
    refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  }[name];
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={p} />
    </svg>
  );
}
