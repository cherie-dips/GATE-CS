import { pct } from '../lib/data.js';

/** Thin progress bar: share of `value` in `total`. */
export function Bar({ value, total, title }) {
  return (
    <span className="bar" title={title}>
      <span style={{ width: `${pct(value, total)}%` }} />
    </span>
  );
}

export function StatusDot({ status }) {
  const label = { new: 'Unsolved', correct: 'Correct', wrong: 'Incorrect' }[status] || status;
  return <span className={`dot ${status}`} title={label} aria-label={label} />;
}

export function Tag({ children, tone, title, href }) {
  const cls = `tag${tone ? ` ${tone}` : ''}`;
  if (href) {
    return (
      <a className={cls} href={href} title={title}>
        {children}
      </a>
    );
  }
  return (
    <span className={cls} title={title}>
      {children}
    </span>
  );
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
    sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    monitor: 'M3 5h18v11H3zM8 20h8M12 16v4',
    check: 'M5 12l5 5L20 7',
    x: 'M6 6l12 12M18 6 6 18',
    clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01',
    play: 'M7 4v16l13-8z',
    refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  }[name];
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={p} />
    </svg>
  );
}
