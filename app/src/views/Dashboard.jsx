import { useMemo } from 'react';
import { pct, fmtTime, applyFilters } from '../lib/data.js';
import { activityByDay, dayKey, streak } from '../lib/progress.js';
import { href, navigate } from '../lib/router.js';
import { Heatmap, Ring, StackBar, StatCard, Icon } from '../components/ui.jsx';

export default function Dashboard({ bank, progress, stats }) {
  const { overall } = stats;
  const settings = progress.settings || {};
  const today = useMemo(() => activityByDay(progress).get(dayKey(Date.now())), [progress]);
  const st = streak(progress);
  const counts = {
    wrong: Object.values(progress.attempts).filter((a) => a.s === 'wrong').length,
    bookmarks: Object.keys(progress.bookmarks).length,
    revise: Object.keys(progress.revise).length,
  };

  function practiceRandom() {
    const pool = applyFilters(bank, progress, { s: '', c: '', p: '', y0: 0, y1: 0, t: '', st: 'new', q: '', m: '', ex: '', syl: '', sort: '' }, settings);
    if (!pool.length) return;
    const q = pool[Math.floor(Math.random() * pool.length)];
    navigate(href(`/q/${q.id}`, 'st=new&shuffle=1'));
  }

  const last = progress.last;

  return (
    <div className="dashboard">
      <section className="hero card">
        <div className="hero-ring">
          <Ring value={overall.attempted} total={overall.total} size={132} sub="attempted" />
        </div>
        <div className="hero-body">
          <h1>Your GATE CSE preparation</h1>
          <p className="muted">
            {overall.total.toLocaleString()} previous-year questions from {bank.meta.paperCount} papers ({bank.meta.yearRange}), organised by
            subject and chapter, each with a verified answer and a worked explanation.
          </p>
          <div className="hero-actions">
            {last?.route && (
              <a className="btn primary" href={last.route}>
                <Icon name="play" /> Continue where you left off
              </a>
            )}
            <button className={`btn ${last?.route ? '' : 'primary'}`} onClick={practiceRandom}>
              <Icon name="shuffle" /> Random unsolved question
            </button>
            <a className="btn" href="#/papers">
              <Icon name="calendar" /> Solve a full paper
            </a>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard label="Attempted" value={overall.attempted.toLocaleString()} sub={`of ${overall.total.toLocaleString()} · ${pct(overall.attempted, overall.total)}%`} />
        <StatCard label="Accuracy" value={`${pct(overall.correct, overall.attempted)}%`} sub={`${overall.correct} correct · ${overall.wrong} incorrect`} tone="good" />
        <StatCard label="First-try accuracy" value={`${pct(overall.firstCorrect, overall.attempted)}%`} sub="right on the first attempt" />
        <StatCard label="Today" value={today ? today.qs.size : 0} sub={today ? `${today.correct} correct answers` : 'no attempts yet today'} />
        <StatCard label="Streak" value={`${st} day${st === 1 ? '' : 's'}`} sub="consecutive days practised" />
        <StatCard label="Time spent" value={fmtTime(overall.time)} sub="on attempted questions" />
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head">
            <h2>Subjects</h2>
            <span className="legend">
              <i className="lg correct" /> correct <i className="lg wrong" /> incorrect <i className="lg rest" /> unsolved
            </span>
          </div>
          <div className="subject-list">
            {bank.subjects.map((s) => {
              const ss = stats.bySubject.get(s.id);
              if (!ss) return null;
              return (
                <a className="subject-row" key={s.id} href={`#/subject/${s.id}`}>
                  <div className="subject-row-top">
                    <span className="subject-name">{s.name}</span>
                    <span className="subject-count">
                      {ss.attempted}/{ss.total}
                      {ss.attempted > 0 && <em> · {pct(ss.correct, ss.attempted)}% acc</em>}
                    </span>
                  </div>
                  <StackBar stats={ss} />
                </a>
              );
            })}
          </div>
        </div>
        <div className="stack">
          <div className="card">
            <div className="card-head">
              <h2>Activity</h2>
              <span className="muted small">last 26 weeks</span>
            </div>
            <Heatmap progress={progress} />
          </div>
          <div className="card">
            <h2>Review queue</h2>
            <div className="review-links">
              <a href={href('/list', 'st=wrong')} className="review-link">
                <Icon name="x" />
                <span>Mistakes to retry</span>
                <strong>{counts.wrong}</strong>
              </a>
              <a href={href('/list', 'st=revise')} className="review-link">
                <Icon name="flag" />
                <span>Marked for revision</span>
                <strong>{counts.revise}</strong>
              </a>
              <a href={href('/list', 'st=bookmarked')} className="review-link">
                <Icon name="star" />
                <span>Bookmarked</span>
                <strong>{counts.bookmarks}</strong>
              </a>
            </div>
          </div>
          <FocusAreas bank={bank} stats={stats} />
          <div className="card">
            <h2>By question type</h2>
            <div className="type-grid">
              {[...stats.byType.entries()]
                .sort((a, b) => b[1].total - a[1].total)
                .map(([t, s]) => (
                  <div key={t} className="type-cell">
                    <span className="type-name">{t}</span>
                    <span className="type-num">
                      {s.attempted}/{s.total}
                    </span>
                    <span className="muted small">{s.attempted ? `${pct(s.correct, s.attempted)}% acc` : '—'}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FocusAreas({ bank, stats }) {
  const rows = [];
  for (const s of bank.subjects) {
    for (const c of s.chapters) {
      const cs = stats.byChapter.get(c.id);
      if (!cs || cs.attempted < 5) continue;
      rows.push({ s, c, cs, acc: cs.correct / cs.attempted });
    }
  }
  rows.sort((a, b) => a.acc - b.acc);
  const weak = rows.filter((r) => r.acc < 0.7).slice(0, 5);
  return (
    <div className="card">
      <div className="card-head">
        <h2>Focus areas</h2>
        <span className="muted small">lowest accuracy, ≥ 5 attempts</span>
      </div>
      {weak.length === 0 ? (
        <p className="muted small">{rows.length ? 'No weak chapters right now — every practised chapter is at 70%+ accuracy.' : 'Attempt at least 5 questions in a chapter to see where you need work.'}</p>
      ) : (
        <div className="review-links">
          {weak.map(({ s, c, cs, acc }) => (
            <a key={c.id} className="review-link" href={href('/list', `s=${s.id}&c=${c.id}&st=wrong`)}>
              <span>
                {c.name}
                <small className="muted"> · {s.short || s.name}</small>
              </span>
              <strong className={acc < 0.5 ? 'bad-text' : 'warn-text'}>{Math.round(acc * 100)}%</strong>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
