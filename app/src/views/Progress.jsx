import { useRef, useState } from 'react';
import { pct, fmtTime } from '../lib/data.js';
import { dayKey, exportProgress, importProgress, resetProgress, setSetting, streak, useSaveStatus } from '../lib/progress.js';
import { href } from '../lib/router.js';
import { Bar, Icon } from '../components/ui.jsx';

export default function Progress({ bank, progress, stats }) {
  const [open, setOpen] = useState({});
  const fileRef = useRef(null);
  const settings = progress.settings || {};
  const { serverOk } = useSaveStatus();
  const { overall } = stats;
  const days = streak(progress);
  const theme = settings.theme || 'system';

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
    <div>
      <h1>Progress</h1>
      <div className="stats">
        <Stat value={overall.attempted.toLocaleString()} label={`of ${overall.total.toLocaleString()} solved`} />
        <Stat value={overall.attempted ? `${pct(overall.correct, overall.attempted)}%` : '—'} label="correct" />
        <Stat value={days} label={`day streak`} />
        <Stat value={fmtTime(overall.time)} label="practice time" />
      </div>

      <section className="section">
        <div className="section-head">
          <h2>By subject</h2>
        </div>
        <div className="rows">
          {bank.subjects.map((s) => {
            const st = stats.bySubject.get(s.id);
            if (!st) return null;
            return (
              <div key={s.id}>
                <button className="row" onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))} aria-expanded={!!open[s.id]}>
                  <span className="row-main">
                    <span className={`caret${open[s.id] ? ' open' : ''}`}>
                      <Icon name="right" size={14} />
                    </span>
                    <span className="row-title">{s.name}</span>
                  </span>
                  <Counts st={st} />
                </button>
                {open[s.id] &&
                  s.chapters.map((c) => {
                    const cs = stats.byChapter.get(c.id);
                    if (!cs) return null;
                    return (
                      <a key={c.id} className="row child" href={href('/list', `s=${s.id}&c=${c.id}`)}>
                        <span className="row-main">
                          <span className="row-title">{c.name}</span>
                        </span>
                        <Counts st={cs} />
                      </a>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section settings">
        <div className="section-head">
          <h2>Settings</h2>
        </div>
        <div className="setting-row">
          <span>Theme</span>
          <div className="segmented" role="group" aria-label="Theme">
            {[
              ['system', 'System'],
              ['light', 'Light'],
              ['dark', 'Dark'],
            ].map(([k, label]) => (
              <button key={k} className={theme === k ? 'on' : ''} onClick={() => setSetting('theme', k)} aria-pressed={theme === k}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="check">
          <input type="checkbox" checked={settings.includeIT !== false} onChange={(e) => setSetting('includeIT', e.target.checked)} />
          Include GATE IT (2004–2008) questions in practice and progress
        </label>
        <label className="check">
          <input type="checkbox" checked={settings.currentSyllabusOnly === true} onChange={(e) => setSetting('currentSyllabusOnly', e.target.checked)} />
          Current syllabus only (hide topics removed from the GATE CSE syllabus)
        </label>
        <label className="check">
          <input type="checkbox" checked={settings.hideTimer === true} onChange={(e) => setSetting('hideTimer', e.target.checked)} />
          Hide the timer on questions
        </label>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Your data</h2>
        </div>
        <p className="muted small">
          {serverOk === false ? (
            <>Progress is stored in this browser only. Export it regularly as a backup, and import it to continue on another device.</>
          ) : (
            <>
              Progress is saved to <code>data/progress.json</code> in the project folder (with a <code>.bak</code> of the previous save) and mirrored in this browser.
            </>
          )}
        </p>
        <div className="actions">
          <button className="btn" onClick={doExport}>
            Export progress
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Import progress
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={doImport} />
          <button
            className="btn ghost danger"
            onClick={() => {
              if (window.confirm('Reset ALL progress (attempts, bookmarks, notes)? Consider exporting first.')) resetProgress();
            }}
          >
            Reset progress
          </button>
        </div>
        <p className="muted small">
          Question bank: {bank.meta.total.toLocaleString()} questions, built {bank.meta.generated}. Sources: {bank.meta.sources}.
        </p>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="stat-num">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Counts({ st }) {
  return (
    <span className="row-end">
      {st.attempted > 0 && <span className="acc">{pct(st.correct, st.attempted)}% correct</span>}
      <Bar value={st.attempted} total={st.total} />
      <span className="count">
        {st.attempted} / {st.total}
      </span>
    </span>
  );
}
