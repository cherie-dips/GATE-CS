import { useEffect, useMemo, useState } from 'react';
import Content from '../components/Content.jsx';
import { Icon } from '../components/ui.jsx';
import { href, navigate } from '../lib/router.js';
import { loadAllSheets, loadSheet, matchTopics, sheetIds } from '../lib/sheets.js';

export default function Sheets({ bank, id, query }) {
  return id ? <Sheet bank={bank} id={id} chapterId={query.get('c')} /> : <SheetIndex bank={bank} />;
}

function useSheet(id) {
  const [sheet, setSheet] = useState(undefined);
  useEffect(() => {
    let live = true;
    setSheet(undefined);
    loadSheet(id).then((s) => live && setSheet(s));
    return () => {
      live = false;
    };
  }, [id]);
  return sheet;
}

function SheetIndex({ bank }) {
  const [q, setQ] = useState('');
  const [all, setAll] = useState(null);
  const subjects = useMemo(() => bank.subjects.filter((s) => sheetIds.has(s.id)), [bank]);

  useEffect(() => {
    if (q.trim() && !all) loadAllSheets().then(setAll);
  }, [q, all]);

  const results = useMemo(() => {
    if (!q.trim() || !all) return null;
    return subjects.map((s) => ({ s, chapters: matchTopics(all.get(s.id), q) })).filter((r) => r.chapters.length);
  }, [q, all, subjects]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Cheatsheets</h1>
          <p className="sub">Formulas and key facts for each subject, chapter by chapter.</p>
        </div>
      </div>
      <Filter value={q} onChange={setQ} placeholder="Search all cheatsheets, e.g. eigenvalue, CSMA, 3NF" />

      {q.trim() ? (
        !results ? (
          <p className="empty">Searching…</p>
        ) : results.length === 0 ? (
          <p className="empty">Nothing matches "{q.trim()}".</p>
        ) : (
          results.map(({ s, chapters }) => (
            <section key={s.id} className="sheet-results">
              <a className="sheet-results-head" href={href(`/sheets/${s.id}`)}>
                {s.name} <Icon name="right" size={14} />
              </a>
              {chapters.map((c) => (
                <Chapter key={c.id} subjectId={s.id} chapter={c} />
              ))}
            </section>
          ))
        )
      ) : (
        <div className="rows">
          {subjects.map((s) => (
            <a key={s.id} className="row" href={href(`/sheets/${s.id}`)}>
              <span className="row-main">
                <span className="row-title">{s.name}</span>
              </span>
              <span className="row-end">
                <span className="sheet-chapters">{s.chapters.map((c) => c.name).join(' · ')}</span>
                <Icon name="right" size={14} />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Sheet({ bank, id, chapterId }) {
  const subject = bank.subjectById.get(id);
  const sheet = useSheet(id);
  const [q, setQ] = useState('');
  const chapters = useMemo(() => (sheet ? matchTopics(sheet, q) : []), [sheet, q]);

  // jump to ?c=<chapter> once the sheet is rendered
  useEffect(() => {
    if (sheet && chapterId) scrollToChapter(chapterId);
  }, [sheet, chapterId]);

  if (sheet === undefined) return <p className="empty">Loading…</p>;
  if (!sheet || !subject) return <p className="empty">No cheatsheet for this subject.</p>;

  return (
    <div>
      <a className="back" href={href('/sheets')}>
        <Icon name="left" size={14} /> Cheatsheets
      </a>
      <div className="page-head">
        <div>
          <h1>{subject.name}</h1>
          <p className="sub">Cheatsheet</p>
        </div>
        <div className="actions">
          <a className="btn" href={href(`/subject/${id}`)}>
            Practice questions
          </a>
        </div>
      </div>

      <div className="sheet-bar">
        <Filter value={q} onChange={setQ} placeholder="Filter this sheet" />
        {!q.trim() && (
          <nav className="sheet-toc" aria-label="Chapters">
            {sheet.chapters.map((c) => (
              <button
                key={c.id}
                className={c.id === chapterId ? 'on' : ''}
                onClick={() => {
                  if (c.id === chapterId) scrollToChapter(c.id);
                  else navigate(href(`/sheets/${id}`, `c=${c.id}`), { replace: true });
                }}
              >
                {c.title}
              </button>
            ))}
          </nav>
        )}
      </div>

      {chapters.length === 0 ? (
        <p className="empty">Nothing in this sheet matches "{q.trim()}".</p>
      ) : (
        chapters.map((c) => <Chapter key={c.id} subjectId={id} chapter={c} anchor />)
      )}
    </div>
  );
}

// scroll so the chapter heading sits just below the sticky header and chapter bar
function scrollToChapter(id) {
  const el = document.getElementById(`sheet-${id}`);
  if (!el) return;
  const covered = [...document.querySelectorAll('.header, .sheet-bar')].reduce((h, e) => h + e.offsetHeight, 0);
  window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - covered + 8 });
}

function Chapter({ subjectId, chapter, anchor }) {
  return (
    <section className="sheet-chapter" id={anchor ? `sheet-${chapter.id}` : undefined}>
      <div className="sheet-chapter-head">
        <h2>{chapter.title}</h2>
        <a className="link small" href={href('/list', `s=${subjectId}&c=${chapter.id}`)}>
          Questions
        </a>
      </div>
      {chapter.topics.map((t, i) => (
        <div className="sheet-topic" key={`${t.title}-${i}`}>
          {t.title && (
            <h3>
              <Content md={t.title} inline />
            </h3>
          )}
          <Content md={t.md} />
        </div>
      ))}
    </section>
  );
}

function Filter({ value, onChange, placeholder }) {
  return (
    <div className="sheet-filter">
      <Icon name="search" size={15} />
      <input
        className="input"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange('');
        }}
      />
    </div>
  );
}
