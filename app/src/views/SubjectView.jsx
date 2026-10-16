import { useMemo } from 'react';
import { pct, applyFilters, parseFilters } from '../lib/data.js';
import { href } from '../lib/router.js';
import { Bar, Icon } from '../components/ui.jsx';

export default function SubjectView({ bank, progress, stats, id }) {
  const subject = bank.subjectById.get(id);
  const firstUnsolved = useMemo(() => {
    const list = applyFilters(bank, progress, parseFilters(new URLSearchParams(`s=${id}&st=new`)), progress.settings || {});
    return list[0]?.id;
  }, [bank, progress, id]);

  if (!subject) return <p className="empty">Unknown subject.</p>;
  const ss = stats.bySubject.get(id);
  if (!ss) return <p className="empty">No questions in this subject with the current settings.</p>;

  return (
    <div>
      <a className="back" href="#/">
        <Icon name="left" size={14} /> Practice
      </a>
      <div className="page-head">
        <div>
          <h1>{subject.name}</h1>
          <p className="sub">
            {ss.total} questions · {ss.attempted} solved
            {ss.attempted > 0 && ` · ${pct(ss.correct, ss.attempted)}% correct`}
          </p>
        </div>
        <div className="actions">
          {ss.wrong > 0 && (
            <a className="btn" href={href('/list', `s=${id}&st=wrong`)}>
              Retry mistakes
            </a>
          )}
          {firstUnsolved && (
            <a className="btn primary" href={href(`/q/${firstUnsolved}`, `s=${id}&st=new`)}>
              <Icon name="play" size={14} /> Practise unsolved
            </a>
          )}
        </div>
      </div>

      <div className="section-head">
        <h2>Chapters</h2>
        <a className="link small" href={href('/list', `s=${id}`)}>
          All {ss.total} questions
        </a>
      </div>
      <div className="rows">
        {subject.chapters.map((c) => {
          const cs = stats.byChapter.get(c.id);
          if (!cs) return null;
          return (
            <a className="row" key={c.id} href={href('/list', `s=${id}&c=${c.id}`)}>
              <span className="row-main">
                <span className="row-title">{c.name}</span>
              </span>
              <span className="row-end">
                {cs.attempted > 0 && <span className="acc">{pct(cs.correct, cs.attempted)}% correct</span>}
                <Bar value={cs.attempted} total={cs.total} />
                <span className="count">
                  {cs.attempted} / {cs.total}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
