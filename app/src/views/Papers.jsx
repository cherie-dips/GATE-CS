import { useMemo, useState } from 'react';
import { pct } from '../lib/data.js';
import { href } from '../lib/router.js';
import { StackBar } from '../components/ui.jsx';

function best(progress, id) {
  const h = (progress.testHistory || {})[id];
  if (!h || !h.length) return null;
  const b = h.reduce((a, x) => (x.score / (x.max || 1) > a.score / (a.max || 1) ? x : a), h[0]);
  return ` · best test ${Math.round(b.score * 10) / 10}/${b.max}`;
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
    <div className="papers">
      <div className="page-head">
        <div>
          <div className="crumbs">
            <a href="#/">Dashboard</a> / Papers
          </div>
          <h1>Papers &amp; mock tests</h1>
          <p className="muted">Practise a paper question by question, or take it as a timed mock test with GATE marking. GATE IT (2004–2008) papers are included for extra practice.</p>
        </div>
        <div className="seg-control">
          {['ALL', 'CSE', 'IT'].map((e) => (
            <button key={e} className={exam === e ? 'on' : ''} onClick={() => setExam(e)}>
              {e === 'ALL' ? 'All' : `GATE ${e}`}
            </button>
          ))}
        </div>
      </div>
      <div className="year-list">
        {byYear.map(([year, papers]) => (
          <div className="year-row" key={year}>
            <div className="year-label">{year}</div>
            <div className="paper-cards">
              {papers.map((p) => {
                const s = stats.byPaper.get(p.id) || { total: p.count, attempted: 0, correct: 0, wrong: 0 };
                return (
                  <div className="paper-card card" key={p.id}>
                    <div className="paper-card-top">
                      <strong>{p.id.replace(/^GATE /, '')}</strong>
                      <span className="muted small">{p.count} Qs</span>
                    </div>
                    <StackBar stats={s} height={6} />
                    <div className="muted small">
                      {s.attempted}/{s.total} done{s.attempted ? ` · ${pct(s.correct, s.attempted)}% acc` : ''}
                      {best(progress, p.id)}
                    </div>
                    <div className="paper-card-actions">
                      <a className="btn small" href={href('/list', `p=${encodeURIComponent(p.id)}&sort=paper`)}>
                        Practise
                      </a>
                      <a className="btn small" href={`#/test/${encodeURIComponent(p.id)}`}>
                        {(progress.tests || {})[p.id] ? 'Resume test' : 'Mock test'}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
