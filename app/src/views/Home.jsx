import { pct, applyFilters, parseFilters } from '../lib/data.js';
import { href, navigate } from '../lib/router.js';
import { Bar, Icon } from '../components/ui.jsx';

export default function Home({ bank, progress, stats }) {
  const { overall } = stats;
  const last = progress.last;

  function practiceRandom() {
    const pool = applyFilters(bank, progress, parseFilters(new URLSearchParams('st=new')), progress.settings || {});
    if (!pool.length) return;
    const q = pool[Math.floor(Math.random() * pool.length)];
    navigate(href(`/q/${q.id}`, 'st=new&shuffle=1'));
  }

  return (
    <div>
      <h1>Practice</h1>
      <p className="sub">
        {overall.total.toLocaleString()} previous-year questions from {bank.meta.paperCount} papers, {bank.meta.yearRange}
      </p>

      <div className="overview">
        <Bar value={overall.attempted} total={overall.total} />
        <span className="muted small">
          {overall.attempted.toLocaleString()} solved
          {overall.attempted > 0 && ` · ${pct(overall.correct, overall.attempted)}% correct`}
        </span>
      </div>

      <div className="actions">
        {last?.route && (
          <a className="btn primary" href={last.route}>
            <Icon name="play" size={14} /> Continue where you left off
          </a>
        )}
        <button className={`btn${last?.route ? '' : ' primary'}`} onClick={practiceRandom}>
          <Icon name="shuffle" size={15} /> Random question
        </button>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Subjects</h2>
          <a className="link small" href="#/list">
            Browse all questions
          </a>
        </div>
        <div className="rows">
          {bank.subjects.map((s) => {
            const ss = stats.bySubject.get(s.id);
            if (!ss) return null;
            return (
              <a className="row" key={s.id} href={`#/subject/${s.id}`}>
                <span className="row-main">
                  <span className="row-title">{s.name}</span>
                </span>
                <span className="row-end">
                  <Bar value={ss.attempted} total={ss.total} />
                  <span className="count">
                    {ss.attempted} / {ss.total}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
