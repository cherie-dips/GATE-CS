import { useMemo } from 'react';
import { pct, fmtTime } from '../lib/data.js';
import { href } from '../lib/router.js';
import { StackBar, Ring, Icon } from '../components/ui.jsx';

export default function SubjectView({ bank, progress, stats, id }) {
  const subject = bank.subjectById.get(id);
  const settings = progress.settings || {};
  const weight = useMemo(() => {
    // marks per paper-year for this subject (CSE papers only), last 15 years
    const m = new Map();
    for (const q of bank.questions) {
      if (q.s !== id || q.ex !== 'CSE') continue;
      m.set(q.y, (m.get(q.y) || 0) + (q.m || 0));
    }
    const sets = new Map();
    for (const p of bank.papers) if (p.exam === 'CSE') sets.set(p.year, (sets.get(p.year) || 0) + 1);
    const years = [...m.keys()].sort((a, b) => a - b).filter((y) => y >= 2010);
    return years.map((y) => ({ y, marks: Math.round((m.get(y) / (sets.get(y) || 1)) * 10) / 10 }));
  }, [bank, id]);

  if (!subject) return <p>Unknown subject.</p>;
  const ss = stats.bySubject.get(id);
  if (!ss) return <p>No questions.</p>;
  const maxW = Math.max(1, ...weight.map((w) => w.marks));

  return (
    <div className="subject-view">
      <div className="page-head">
        <div>
          <div className="crumbs">
            <a href="#/">Dashboard</a> / Subject
          </div>
          <h1>{subject.name}</h1>
          <p className="muted">
            {ss.total} questions · {ss.attempted} attempted · {ss.correct} correct · {ss.wrong} incorrect · {fmtTime(ss.time)} spent
          </p>
        </div>
        <Ring value={ss.attempted} total={ss.total} size={96} stroke={9} sub="done" />
      </div>

      <div className="action-row">
        <a className="btn primary" href={href('/list', `s=${id}&st=new`)}>
          <Icon name="play" /> Practise unsolved
        </a>
        <a className="btn" href={href('/list', `s=${id}`)}>
          <Icon name="list" /> All {subject.name} questions
        </a>
        <a className="btn" href={href('/list', `s=${id}&st=wrong`)}>
          <Icon name="x" /> Retry mistakes
        </a>
      </div>

      <div className="card">
        <h2>Chapters</h2>
        <div className="chapter-table">
          <div className="chapter-row chapter-head">
            <span>Chapter</span>
            <span>Progress</span>
            <span className="num">Done</span>
            <span className="num">Accuracy</span>
            <span />
          </div>
          {subject.chapters.map((c) => {
            const cs = stats.byChapter.get(c.id);
            if (!cs) return null;
            return (
              <div className="chapter-row" key={c.id}>
                <a className="chapter-name" href={href('/list', `s=${id}&c=${c.id}`)}>
                  {c.name}
                  <small>{cs.total} questions</small>
                </a>
                <StackBar stats={cs} />
                <span className="num">
                  {cs.attempted}/{cs.total}
                </span>
                <span className="num">{cs.attempted ? `${pct(cs.correct, cs.attempted)}%` : '—'}</span>
                <span className="chapter-actions">
                  <a className="btn small" href={href('/list', `s=${id}&c=${c.id}&st=new`)} title="Unsolved questions">
                    Practise
                  </a>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {weight.length > 2 && (
        <div className="card">
          <h2>Weightage trend</h2>
          <p className="muted small">Average marks per paper from {subject.name} in GATE CSE (2010 onwards; GA excluded for technical subjects).</p>
          <div className="bars">
            {weight.map((w) => (
              <div className="bar-col" key={w.y} title={`${w.y}: ${w.marks} marks per paper`}>
                <span className="bar-val">{w.marks}</span>
                <span className="bar" style={{ height: `${(100 * w.marks) / maxW}%` }} />
                <span className="bar-label">{String(w.y).slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {settings.currentSyllabusOnly && <p className="muted small">Showing current-syllabus questions only (change in Progress tracker → Settings).</p>}
    </div>
  );
}
