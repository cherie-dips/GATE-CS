import { useEffect, useMemo, useState } from 'react';
import { applyFilters, parseFilters, filtersToQuery, STATUS_OPTIONS, TYPE_LABELS } from '../lib/data.js';
import { href, navigate } from '../lib/router.js';
import { Icon } from '../components/ui.jsx';
import QuestionList from '../components/QuestionList.jsx';

export const REVIEW_TABS = [
  ['wrong', 'Mistakes', 'Questions you answer incorrectly show up here.'],
  ['bookmarked', 'Bookmarks', 'Star a question (or press B) to keep it here.'],
  ['revise', 'To revise', 'Flag a question for revision (or press R) to collect it here.'],
  ['notes', 'Notes', 'Questions you write notes on show up here.'],
];

// panel filters counted on the "Filters" button (subject, chapter and paper are shown in the title instead)
const PANEL_KEYS = ['y0', 'y1', 'm', 'ex', 'syl', 'sort'];

export default function ListView({ bank, progress, query, review = false }) {
  const f = useMemo(() => {
    const x = parseFilters(query);
    if (review && !REVIEW_TABS.some(([k]) => k === x.st)) x.st = 'wrong';
    return x;
  }, [query, review]);
  const settings = progress.settings || {};
  const qs = filtersToQuery(f);
  const list = useMemo(() => applyFilters(bank, progress, f, settings), [bank, progress, f, settings]);
  const start = list.length ? href(`/q/${list[0].id}`, qs) : null;

  if (review) return <Review bank={bank} progress={progress} f={f} qs={qs} list={list} start={start} />;
  return <Browse bank={bank} progress={progress} f={f} qs={qs} list={list} start={start} />;
}

function Review({ bank, progress, f, qs, list, start }) {
  const settings = progress.settings || {};
  const counts = useMemo(
    () => Object.fromEntries(REVIEW_TABS.map(([k]) => [k, applyFilters(bank, progress, parseFilters(new URLSearchParams(`st=${k}`)), settings).length])),
    [bank, progress, settings],
  );
  const tab = REVIEW_TABS.find(([k]) => k === f.st);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Review</h1>
          <p className="sub">Go back over your mistakes, bookmarks and flagged questions.</p>
        </div>
        {start && (
          <a className="btn primary" href={start}>
            <Icon name="play" size={14} /> Practise these
          </a>
        )}
      </div>
      <div className="tabs" role="tablist">
        {REVIEW_TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={f.st === k} className={f.st === k ? 'on' : ''} onClick={() => navigate(href('/review', `st=${k}`), { replace: true })}>
            {label} <span className="count">{counts[k]}</span>
          </button>
        ))}
      </div>
      <QuestionList bank={bank} progress={progress} list={list} qs={qs} empty={tab[2]} />
    </div>
  );
}

function Browse({ bank, progress, f, qs, list, start }) {
  const [searchText, setSearchText] = useState(f.q);
  const [panel, setPanel] = useState(false);
  useEffect(() => {
    setSearchText(f.q);
  }, [f.q]);
  const years = useMemo(() => [...new Set(bank.questions.map((q) => q.y))].sort((a, b) => b - a), [bank]);
  const subject = f.s ? bank.subjectById.get(f.s) : null;
  const chapter = f.c ? bank.chapterById.get(f.c) : null;
  const panelCount = PANEL_KEYS.filter((k) => f[k]).length;
  const type = f.t && !f.t.includes(',') ? f.t : '';

  function set(patch) {
    const next = { ...f, ...patch };
    if (patch.s !== undefined && patch.s !== f.s) next.c = '';
    navigate(href('/list', filtersToQuery(next)), { replace: true });
  }

  const title = chapter?.name || subject?.name || f.p || (f.q ? 'Search' : 'All questions');
  const back = chapter && subject ? [`#/subject/${subject.id}`, subject.name] : f.p ? ['#/papers', 'Papers'] : ['#/', 'Practice'];
  const filtered = f.st !== 'all' || f.t || f.q || panelCount > 0;

  return (
    <div>
      <a className="back" href={back[0]}>
        <Icon name="left" size={14} /> {back[1]}
      </a>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
        </div>
        {start && (
          <a className="btn primary" href={start}>
            <Icon name="play" size={14} /> Start practice
          </a>
        )}
      </div>

      <div className="toolbar">
        <form
          style={{ display: 'contents' }}
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: searchText.trim() });
          }}
        >
          <input className="input grow" type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search (press Enter)" aria-label="Search in questions" />
        </form>
        <select className="select" value={f.st} onChange={(e) => set({ st: e.target.value })} aria-label="Status">
          {STATUS_OPTIONS.map(([k, label]) => (
            <option key={k} value={k}>
              {k === 'all' ? 'Any status' : label}
            </option>
          ))}
        </select>
        <select className="select" value={type} onChange={(e) => set({ t: e.target.value })} aria-label="Question type">
          <option value="">Any type</option>
          {Object.entries(TYPE_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <button className={`btn${panel ? ' on' : ''}`} onClick={() => setPanel((v) => !v)} aria-expanded={panel}>
          Filters{panelCount > 0 ? ` · ${panelCount}` : ''}
        </button>
      </div>

      {panel && (
        <div className="filter-panel">
          <label className="field">
            Subject
            <select className="select" value={f.s} onChange={(e) => set({ s: e.target.value })}>
              <option value="">All subjects</option>
              {bank.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Chapter
            <select className="select" value={f.c} onChange={(e) => set({ c: e.target.value })} disabled={!subject}>
              <option value="">{subject ? 'All chapters' : 'Pick a subject first'}</option>
              {subject?.chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            From year
            <select className="select" value={f.y0 || ''} onChange={(e) => set({ y0: Number(e.target.value) || 0 })}>
              <option value="">Any</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            To year
            <select className="select" value={f.y1 || ''} onChange={(e) => set({ y1: Number(e.target.value) || 0 })}>
              <option value="">Any</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Marks
            <select className="select" value={f.m} onChange={(e) => set({ m: e.target.value })}>
              <option value="">Any</option>
              <option value="1">1 mark</option>
              <option value="2">2 marks</option>
            </select>
          </label>
          <label className="field">
            Papers
            <select className="select" value={f.ex} onChange={(e) => set({ ex: e.target.value })}>
              <option value="">As in settings</option>
              <option value="CSE">GATE CSE only</option>
              <option value="IT">GATE IT only</option>
            </select>
          </label>
          <label className="field">
            Syllabus
            <select className="select" value={f.syl} onChange={(e) => set({ syl: e.target.value })}>
              <option value="">As in settings</option>
              <option value="current">Current syllabus only</option>
            </select>
          </label>
          <label className="field">
            Sort
            <select className="select" value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
              <option value="">Newest first</option>
              <option value="year-asc">Oldest first</option>
              <option value="marks">Marks, high first</option>
              <option value="paper">Paper order</option>
            </select>
          </label>
        </div>
      )}

      <p className="result-count">
        {list.length.toLocaleString()} question{list.length === 1 ? '' : 's'}
        {f.q && <> matching “{f.q}”</>}
        {filtered && (
          <>
            {' · '}
            <a className="link" href={href('/list', filtersToQuery({ ...f, st: 'all', t: '', q: '', y0: 0, y1: 0, m: '', ex: '', syl: '', sort: '' }))}>
              Clear filters
            </a>
          </>
        )}
      </p>

      <QuestionList bank={bank} progress={progress} list={list} qs={qs} showChapter={!f.c} empty="No questions match these filters." />
    </div>
  );
}
