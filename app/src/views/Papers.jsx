import { useMemo, useState } from 'react';
import { href } from '../lib/router.js';

function bestScore(progress, id) {
  const h = (progress.testHistory || {})[id];
  if (!h || !h.length) return null;
  const b = h.reduce((a, x) => (x.score / (x.max || 1) > a.score / (a.max || 1) ? x : a), h[0]);
  return `best mock ${Math.round(b.score * 10) / 10} / ${b.max}`;
}

export default function Papers({ bank, progress, stats }) {
  const [exam, setExam] = useState('ALL');
  const byYear = useMemo(() => {
    const m = new Map();
    for (const p of bank.papers) {
      if (exam !== 'ALL' && p.exam !== exam) continue;
      if (!m.has(p.year)) m.set(p.year, []);
      m.get(p.year).push(p);
    }
    return [...m.entries()].sort((a, b) => b[0] - a[0]);
  }, [bank, exam]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Papers</h1>
          <p className="sub">Solve a paper question by question, or take it as a timed mock test.</p>
        </div>
        <div className="segmented" role="group" aria-label="Exam">
          {[
            ['ALL', 'All'],
            ['CSE', 'CSE'],
            ['IT', 'IT (2004–08)'],
          ].map(([k, label]) => (
            <button key={k} className={exam === k ? 'on' : ''} onClick={() => setExam(k)} aria-pressed={exam === k}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {byYear.map(([year, papers]) => (
        <div className="year-group" key={year}>
          <div className="year">{year}</div>
          <div>
            {papers.map((p) => {
              const s = stats.byPaper.get(p.id) || { total: p.count, attempted: 0 };
              const best = bestScore(progress, p.id);
              return (
                <div className="paper-row" key={p.id}>
                  <div className="paper-main">
                    <span className="row-title">
                      GATE {p.exam}
                      {p.set ? ` · Set ${p.set}` : ''}
                    </span>
                    <span className="row-meta">
                      {s.attempted} / {s.total} solved{best ? ` · ${best}` : ''}
                    </span>
                  </div>
                  <a className="btn small ghost" href={href('/list', `p=${encodeURIComponent(p.id)}&sort=paper`)}>
                    Practise
                  </a>
                  <a className="btn small" href={`#/test/${encodeURIComponent(p.id)}`}>
                    {(progress.tests || {})[p.id] ? 'Resume test' : 'Mock test'}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
