import { useMemo, useRef, useState } from 'react';
import { pct, fmtTime } from '../lib/data.js';
import { activityByDay, dayKey, exportProgress, importProgress, resetProgress, setSetting, streak, useSaveStatus } from '../lib/progress.js';
import { href } from '../lib/router.js';
import { Heatmap, Ring, StackBar, StatCard } from '../components/ui.jsx';

export default function Tracker({ bank, progress, stats }) {
  const [open, setOpen] = useState({});
  const fileRef = useRef(null);
  const settings = progress.settings || {};
  const { serverOk } = useSaveStatus();
  const { overall } = stats;
  const days = useMemo(() => activityByDay(progress), [progress]);
  const last14 = useMemo(() => {
    const out = [];
    const d = new Date();
    for (let i = 0; i < 14; i++) {
      const k = dayKey(d.getTime());
      const v = days.get(k);
      out.push({ k, label: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }), n: v ? v.qs.size : 0, c: v ? v.correct : 0 });
      d.setDate(d.getDate() - 1);
    }
    return out.reverse();
  }, [days]);
  const max14 = Math.max(1, ...last14.map((d) => d.n));
  const yearRows = useMemo(() => [...bank.papers].sort((a, b) => b.year - a.year || (a.exam > b.exam ? 1 : -1) || (a.set || 0) - (b.set || 0)), [bank]);

  function doExport() {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gate-progress-${dayKey(Date.now())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function doImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((t) => {
      try {
        const obj = JSON.parse(t);
        if (!obj || typeof obj !== 'object' || !obj.attempts) throw new Error('not a progress file');
        if (window.confirm('Replace your current progress with the imported file?')) importProgress(obj);
      } catch (err) {
        window.alert(`Could not import: ${err.message}`);
      }
    });
    e.target.value = '';
  }

  return (
    <div className="tracker">
      <div className="page-head">
        <div>
          <div className="crumbs">
            <a href="#/">Dashboard</a> / Tracker
          </div>
          <h1>Progress tracker</h1>
          <p className="muted">How much of the question bank you have covered, subject by subject and paper by paper.</p>
        </div>
        <Ring value={overall.attempted} total={overall.total} size={104} sub="covered" />
      </div>

      <section className="stat-grid">
        <StatCard label="Questions attempted" value={`${overall.attempted} / ${overall.total}`} sub={`${overall.total - overall.attempted} remaining`} />
        <StatCard label="Correct" value={overall.correct} sub={`${pct(overall.correct, overall.attempted)}% of attempted`} tone="good" />
        <StatCard label="Incorrect" value={overall.wrong} sub="retry them from Mistakes" tone="bad" />
        <StatCard label="Marks scored" value={`${overall.marksScored} / ${overall.marks}`} sub="sum of marks of correctly solved questions" />
        <StatCard label="Streak" value={`${streak(progress)} days`} sub={`${days.size} active days in total`} />
        <StatCard label="Time spent" value={fmtTime(overall.time)} sub={overall.attempted ? `${Math.round(overall.time / overall.attempted / 1000)} s per question on average` : '—'} />
      </section>

      <section className="card">
        <h2>Subjects &amp; chapters</h2>
        <div className="track-table">
          <div className="track-row track-head">
            <span>Subject</span>
            <span>Progress</span>
            <span className="num">Done</span>
            <span className="num">Correct</span>
            <span className="num">Wrong</span>
            <span className="num">Accuracy</span>
            <span className="num">Time</span>
          </div>
          {bank.subjects.map((s) => {
            const st = stats.bySubject.get(s.id);
            if (!st) return null;
            return (
              <div key={s.id} className="track-group">
                <button className="track-row track-subject" onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))} aria-expanded={!!open[s.id]}>
                  <span className="track-name">
                    <span className="caret">{open[s.id] ? '▾' : '▸'}</span> {s.name}
                  </span>
                  <StackBar stats={st} />
                  <span className="num">
                    {st.attempted}/{st.total}
                  </span>
                  <span className="num good">{st.correct}</span>
                  <span className="num bad">{st.wrong}</span>
                  <span className="num">{st.attempted ? `${pct(st.correct, st.attempted)}%` : '—'}</span>
                  <span className="num">{fmtTime(st.time)}</span>
                </button>
                {open[s.id] &&
                  s.chapters.map((c) => {
                    const cs = stats.byChapter.get(c.id);
                    if (!cs) return null;
                    return (
                      <a key={c.id} className="track-row track-chapter" href={href('/list', `s=${s.id}&c=${c.id}`)}>
                        <span className="track-name">{c.name}</span>
                        <StackBar stats={cs} height={6} />
                        <span className="num">
                          {cs.attempted}/{cs.total}
                        </span>
                        <span className="num good">{cs.correct}</span>
                        <span className="num bad">{cs.wrong}</span>
                        <span className="num">{cs.attempted ? `${pct(cs.correct, cs.attempted)}%` : '—'}</span>
                        <span className="num">{fmtTime(cs.time)}</span>
                      </a>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head">
            <h2>Last 14 days</h2>
            <span className="muted small">distinct questions attempted per day</span>
          </div>
          <div className="bars">
            {last14.map((d) => (
              <div className="bar-col" key={d.k} title={`${d.k}: ${d.n} questions, ${d.c} correct answers`}>
                <span className="bar-val">{d.n || ''}</span>
                <span className="bar" style={{ height: `${(100 * d.n) / max14}%` }} />
                <span className="bar-label">{d.label}</span>
              </div>
            ))}
          </div>
          <h3 className="mt">Activity</h3>
          <Heatmap progress={progress} />
        </div>
        <div className="card">
          <h2>Papers</h2>
          <div className="paper-track">
            {yearRows.map((p) => {
              const st = stats.byPaper.get(p.id);
              if (!st) return null;
              return (
                <a key={p.id} className="paper-track-row" href={href('/list', `p=${encodeURIComponent(p.id)}&sort=paper`)}>
                  <span>{p.id.replace(/^GATE /, '')}</span>
                  <StackBar stats={st} height={6} />
                  <span className="num">
                    {st.attempted}/{st.total}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="card settings">
        <h2>Settings &amp; data</h2>
        <label className="toggle">
          <input type="checkbox" checked={settings.includeIT !== false} onChange={(e) => setSetting('includeIT', e.target.checked)} />
          Include GATE IT (2004–2008) questions in practice and statistics
        </label>
        <label className="toggle">
          <input type="checkbox" checked={settings.currentSyllabusOnly === true} onChange={(e) => setSetting('currentSyllabusOnly', e.target.checked)} />
          Current syllabus only (hide questions on topics removed from the GATE CSE syllabus)
        </label>
        <label className="toggle">
          <input type="checkbox" checked={settings.hideTimer === true} onChange={(e) => setSetting('hideTimer', e.target.checked)} />
          Hide the per-question timer
        </label>
        <div className="action-row">
          <button className="btn" onClick={doExport}>
            Export progress (JSON)
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Import progress
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={doImport} />
          <button
            className="btn bad"
            onClick={() => {
              if (window.confirm('Reset ALL progress (attempts, bookmarks, notes)? Consider exporting first.')) resetProgress();
            }}
          >
            Reset progress
          </button>
        </div>
        <p className="muted small">
          {serverOk === false ? (
            <>Progress is stored in this browser's local storage. Export it regularly as a backup, and import it to continue on another device or browser.</>
          ) : (
            <>
              Progress is saved to <code>data/progress.json</code> in the project folder (with a <code>.bak</code> of the previous save) and mirrored in this browser.
            </>
          )}
        </p>
        <p className="muted small">
          Question bank: {bank.meta.total} questions · built {bank.meta.generated}. Sources: {bank.meta.sources}.
        </p>
      </section>
    </div>
  );
}
