import { useEffect, useMemo, useState } from 'react';
import { applyFilters, parseFilters, filtersToQuery, STATUS_OPTIONS, TYPE_LABELS } from '../lib/data.js';
import { statusOf } from '../lib/progress.js';
import { href, navigate } from '../lib/router.js';
import { Badge, StatusDot, Icon } from '../components/ui.jsx';

const PAGE = 80;

export default function ListView({ bank, progress, query }) {
  const f = useMemo(() => parseFilters(query), [query]);
  const settings = progress.settings || {};
  const [limit, setLimit] = useState(PAGE);
  const [searchText, setSearchText] = useState(f.q);
  const qs = filtersToQuery(f);
  useEffect(() => {
    setLimit(PAGE);
    setSearchText(f.q);
  }, [qs]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => applyFilters(bank, progress, f, settings), [bank, progress, f, settings]);
  const years = useMemo(() => [...new Set(bank.questions.map((q) => q.y))].sort((a, b) => b - a), [bank]);
  const subject = f.s ? bank.subjectById.get(f.s) : null;
  const chapter = f.c ? bank.chapterById.get(f.c) : null;

  function set(patch) {
    const next = { ...f, ...patch };
    if (patch.s !== undefined && patch.s !== f.s) next.c = '';
    navigate(href('/list', filtersToQuery(next)), { replace: true });
  }

  function toggleType(t) {
    const cur = new Set(f.t ? f.t.split(',') : []);
    if (cur.has(t)) cur.delete(t);
    else cur.add(t);
    set({ t: [...cur].join(',') });
  }

  const title = chapter ? chapter.name : subject ? subject.name : f.p ? f.p : f.st === 'wrong' ? 'Mistakes' : f.st === 'bookmarked' ? 'Bookmarks' : f.st === 'revise' ? 'To revise' : 'All questions';
  const startHref = list.length ? href(`/q/${list[0].id}`, qs) : null;

  return (
    <div className="list-view">
      <div className="page-head">
        <div>
          <div className="crumbs">
            <a href="#/">Dashboard</a>
            {subject && (
              <>
                {' '}/ <a href={`#/subject/${subject.id}`}>{subject.name}</a>
              </>
            )}
          </div>
          <h1>{title}</h1>
          <p className="muted">
            {list.length.toLocaleString()} question{list.length === 1 ? '' : 's'}
            {f.q && <> matching “{f.q}”</>}
          </p>
        </div>
        {startHref && (
          <a className="btn primary" href={startHref}>
            <Icon name="play" /> Start practice
          </a>
        )}
      </div>

      <div className="filters card">
        <div className="filter-row">
          <select value={f.s} onChange={(e) => set({ s: e.target.value })} aria-label="Subject">
            <option value="">All subjects</option>
            {bank.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select value={f.c} onChange={(e) => set({ c: e.target.value })} aria-label="Chapter" disabled={!subject}>
            <option value="">{subject ? 'All chapters' : 'Chapter (pick a subject)'}</option>
            {subject?.chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={f.y0 || ''} onChange={(e) => set({ y0: Number(e.target.value) || 0 })} aria-label="From year">
            <option value="">From year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={f.y1 || ''} onChange={(e) => set({ y1: Number(e.target.value) || 0 })} aria-label="To year">
            <option value="">To year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={f.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort">
            <option value="">Newest first</option>
            <option value="year-asc">Oldest first</option>
            <option value="marks">Marks (high first)</option>
            <option value="paper">Paper order</option>
          </select>
          <form
            className="filter-search"
            onSubmit={(e) => {
              e.preventDefault();
              set({ q: searchText.trim() });
            }}
          >
            <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search in questions…" aria-label="Search in questions" />
          </form>
        </div>
        <div className="filter-row chips">
          {STATUS_OPTIONS.map(([k, label]) => (
            <button key={k} className={`chip ${f.st === k ? 'on' : ''}`} onClick={() => set({ st: k })}>
              {label}
            </button>
          ))}
          <span className="chip-sep" />
          {Object.entries(TYPE_LABELS).map(([k, label]) => (
            <button key={k} className={`chip ${f.t.split(',').includes(k) ? 'on' : ''}`} onClick={() => toggleType(k)}>
              {label}
            </button>
          ))}
          <span className="chip-sep" />
          {['1', '2'].map((m) => (
            <button key={m} className={`chip ${f.m === m ? 'on' : ''}`} onClick={() => set({ m: f.m === m ? '' : m })}>
              {m} mark{m === '1' ? '' : 's'}
            </button>
          ))}
          <span className="chip-sep" />
          <button className={`chip ${f.ex === 'CSE' ? 'on' : ''}`} onClick={() => set({ ex: f.ex === 'CSE' ? '' : 'CSE' })} title="Only GATE CSE papers">
            CSE only
          </button>
          <button className={`chip ${f.ex === 'IT' ? 'on' : ''}`} onClick={() => set({ ex: f.ex === 'IT' ? '' : 'IT' })} title="Only GATE IT papers (2004–2008)">
            IT only
          </button>
          <button className={`chip ${f.syl === 'current' ? 'on' : ''}`} onClick={() => set({ syl: f.syl === 'current' ? '' : 'current' })} title="Hide questions on topics removed from the current syllabus">
            Current syllabus
          </button>
          {qs && (
            <a className="chip clear" href={href('/list', f.s ? `s=${f.s}` : '')}>
              Clear filters
            </a>
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty card">
          <p>No questions match these filters.</p>
        </div>
      ) : (
        <div className="qlist">
          {list.slice(0, limit).map((q, i) => {
            const st = statusOf(progress, q.id);
            return (
              <a key={q.id} className={`qrow st-${st}`} href={href(`/q/${q.id}`, qs)}>
                <span className="qrow-idx">{i + 1}</span>
                <StatusDot status={st} />
                <div className="qrow-body">
                  <div className="qrow-text">{q._preview || '(figure-based question)'}</div>
                  <div className="qrow-meta">
                    <span className="paper">
                      {q.p}
                      {q.n ? ` · Q${q.n}` : ''}
                    </span>
                    <Badge>{q.t}</Badge>
                    {q.m ? <Badge>{q.m} mark{q.m === 1 ? '' : 's'}</Badge> : null}
                    {!f.c && <span className="muted small">{bank.chapterById.get(q.c)?.name}</span>}
                    {q.oos && <Badge tone="warn">old syllabus</Badge>}
                    {progress.bookmarks[q.id] && <Icon name="star" size={14} />}
                    {progress.revise[q.id] && <Icon name="flag" size={14} />}
                  </div>
                </div>
              </a>
            );
          })}
          {limit < list.length && (
            <button className="btn more" onClick={() => setLimit((l) => l + PAGE * 2)}>
              Show more ({list.length - limit} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
