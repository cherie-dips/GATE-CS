import { useEffect, useMemo, useRef, useState } from 'react';
import Content from '../components/Content.jsx';
import { Icon, Tag } from '../components/ui.jsx';
import { applyFilters, parseFilters, filtersToQuery, answerLabel, grade, TYPE_LABELS } from '../lib/data.js';
import { recordAttempt, toggleBookmark, toggleRevise, setNote, setLast, clearAttempt } from '../lib/progress.js';
import { href, navigate } from '../lib/router.js';
import { REVIEW_TABS } from './ListView.jsx';

// The practice list is frozen per filter set so that solving a question doesn't reshuffle "next".
const listCache = { key: null, ids: [] };

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Where "back" goes from practice, and what to call it: the list the user came from. */
function backTarget(bank, f, shuffle) {
  const fq = filtersToQuery(f);
  const review = REVIEW_TABS.find(([k]) => k === f.st);
  if (review && !f.s && !f.c && !f.p && !f.q) return [href('/review', fq), review[1]];
  if (shuffle && !f.s && !f.c && !f.p) return ['#/', 'Practice'];
  const label = (f.c && bank.chapterById.get(f.c)?.name) || (f.s && bank.subjectById.get(f.s)?.name) || f.p || (f.q ? 'Search results' : 'All questions');
  return [href('/list', fq), label];
}

export default function Practice({ bank, progress, id, query }) {
  const f = useMemo(() => parseFilters(query), [query]);
  const shuffle = query.get('shuffle') === '1';
  const qs = filtersToQuery(f) + (shuffle ? `${filtersToQuery(f) ? '&' : ''}shuffle=1` : '');
  const settings = progress.settings || {};

  const key = qs;
  if (listCache.key !== key) {
    let ids = applyFilters(bank, progress, f, settings).map((q) => q.id);
    if (shuffle) ids = seededShuffle(ids, Date.now() % 100000);
    listCache.key = key;
    listCache.ids = ids;
  }
  if (!listCache.ids.includes(id)) listCache.ids = [id, ...listCache.ids];
  const ids = listCache.ids;
  const idx = ids.indexOf(id);
  const q = bank.byId.get(id);

  useEffect(() => {
    setLast(window.location.hash);
  }, [id]);

  if (!q) return <p className="empty">Question not found.</p>;
  const prevId = idx > 0 ? ids[idx - 1] : null;
  const nextId = idx < ids.length - 1 ? ids[idx + 1] : null;
  const go = (qid) => qid && navigate(href(`/q/${qid}`, qs));

  return (
    <QuestionCard
      key={q.id}
      bank={bank}
      q={q}
      progress={progress}
      pos={idx + 1}
      total={ids.length}
      onPrev={prevId ? () => go(prevId) : null}
      onNext={nextId ? () => go(nextId) : null}
      back={backTarget(bank, f, shuffle)}
      startRevealed={query.get('reveal') === '1'}
    />
  );
}

function QuestionCard({ bank, q, progress, pos, total, onPrev, onNext, back, startRevealed }) {
  const chapter = bank.chapterById.get(q.c);
  const prev = progress.attempts[q.id];
  const settings = progress.settings || {};
  const gradable = ['MCQ', 'MSQ', 'TF', 'NAT'].includes(q.t) && (q.a?.opts || q.a?.lo != null || q.a?.mta);
  const [sel, setSel] = useState([]);
  const [nat, setNat] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [revealed, setRevealed] = useState(!!startRevealed);
  const [selfGraded, setSelfGraded] = useState(false);
  const [showScan, setShowScan] = useState(!!q.fig);
  const [showNote, setShowNote] = useState(!!progress.notes[q.id]);
  const [noteText, setNoteText] = useState(progress.notes[q.id] || '');
  const started = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const done = result != null || revealed;

  useEffect(() => {
    if (done) return undefined;
    const t = setInterval(() => setElapsed(Date.now() - started.current), 1000);
    return () => clearInterval(t);
  }, [done]);

  const isMulti = q.t === 'MSQ';
  const hasOptions = q.o && q.o.length > 0;
  const canCheck = gradable && (q.t === 'NAT' ? nat.trim() !== '' : sel.length > 0);

  function choose(i) {
    if (done) return;
    if (isMulti) setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i].sort()));
    else setSel([i]);
  }

  function check() {
    if (!canCheck || done) return;
    const response = q.t === 'NAT' ? nat.trim() : sel;
    const ok = grade(q, response);
    const r = ok ? 'correct' : 'wrong';
    setResult(r);
    recordAttempt(q.id, r, response, Date.now() - started.current);
  }

  function reveal() {
    setRevealed(true);
  }

  function selfGrade(ok) {
    if (selfGraded) return;
    setSelfGraded(true);
    setResult(ok ? 'correct' : 'wrong');
    recordAttempt(q.id, ok ? 'correct' : 'wrong', q.t === 'NAT' ? nat : text || sel, Date.now() - started.current);
  }

  function retry() {
    setSel([]);
    setNat('');
    setText('');
    setResult(null);
    setRevealed(false);
    setSelfGraded(false);
    started.current = Date.now();
    setElapsed(0);
  }

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (hasOptions && !done) {
        const n = 'abcdefgh'.indexOf(k) >= 0 ? 'abcdefgh'.indexOf(k) : '12345678'.indexOf(k);
        if (n >= 0 && n < q.o.length) {
          e.preventDefault();
          choose(n);
          return;
        }
      }
      if (k === 'enter') {
        e.preventDefault();
        if (!done && canCheck) check();
        else if (done && onNext) onNext();
      } else if (k === 'arrowright' || k === 'j') onNext && onNext();
      else if (k === 'arrowleft' || k === 'k') onPrev && onPrev();
      else if (k === 's' && !done) reveal();
      else if (k === 'b') toggleBookmark(q.id);
      else if (k === 'r') toggleRevise(q.id);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const correctSet = new Set(q.a?.opts || []);
  const mm = String(Math.floor(elapsed / 60000)).padStart(2, '0');
  const ss = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
  const freeform = q.t === 'DESC' || q.t === 'FIB' || (!gradable && !hasOptions && q.t !== 'NAT');

  return (
    <div className="practice">
      <div className="practice-nav">
        <a className="back" href={back[0]}>
          <Icon name="left" size={14} /> {back[1]}
        </a>
        <span className="muted small num">
          {pos} / {total}
        </span>
      </div>

      <div className="qmeta">
        <span className="paper">
          {q.p}
          {q.n ? ` · Q.${q.n}` : ''}
        </span>
        <span>{TYPE_LABELS[q.t] || q.t}</span>
        {q.m ? (
          <span className="num">
            +{q.m}
            {q.neg ? ` / −${q.neg}` : ''}
          </span>
        ) : null}
        <span className="tools">
          {!done && settings.hideTimer !== true && (
            <span className="timer" title="Time on this question">
              {mm}:{ss}
            </span>
          )}
          <button className={`icon-btn${progress.bookmarks[q.id] ? ' on' : ''}`} onClick={() => toggleBookmark(q.id)} title="Bookmark (B)" aria-label="Bookmark" aria-pressed={!!progress.bookmarks[q.id]}>
            <Icon name="star" size={17} />
          </button>
          <button className={`icon-btn flag${progress.revise[q.id] ? ' on' : ''}`} onClick={() => toggleRevise(q.id)} title="Mark for revision (R)" aria-label="Mark for revision" aria-pressed={!!progress.revise[q.id]}>
            <Icon name="flag" size={17} />
          </button>
          <button className={`icon-btn note${showNote ? ' on' : ''}`} onClick={() => setShowNote((v) => !v)} title="My notes" aria-label="My notes" aria-pressed={showNote}>
            <Icon name="note" size={17} />
          </button>
        </span>
      </div>

      <div className="qtags">
        {chapter && (
          <Tag href={href('/list', `s=${q.s}&c=${q.c}`)} title="All questions in this chapter">
            {chapter.name}
          </Tag>
        )}
        {q.oos && (
          <Tag tone="warn" title="This topic is not in the current GATE CSE syllabus">
            Old syllabus
          </Tag>
        )}
        {q.scanOnly && (
          <Tag tone="warn" title="Shown as the original scan and graded with the GATE Overflow answer key; no worked explanation yet">
            Scan only
          </Tag>
        )}
        {q.v === 'key-only' && (
          <Tag tone="warn" title="Answer taken from the source answer key; not yet independently re-solved">
            Unverified key
          </Tag>
        )}
        {q.official && <Tag title={`Official GATE answer key: ${q.official}`}>Official key</Tag>}
      </div>

      <div className="qtext">{q.qf === 'md' ? <Content md={q.q} /> : <Content html={q.q} />}</div>

      {q.scan && (
        <div className="scan">
          <button className="link-btn" onClick={() => setShowScan((v) => !v)}>
            <Icon name="image" size={14} /> {showScan ? 'Hide' : 'Show'} original scan
          </button>
          {showScan && <img src={q.scan} alt="Original question" loading="lazy" />}
        </div>
      )}

      {hasOptions && (
        <div className="options" role={isMulti ? 'group' : 'radiogroup'}>
          {isMulti && !done && <div className="hint">Select every correct option.</div>}
          {q.o.map((o, i) => {
            const picked = sel.includes(i);
            const isCorrect = correctSet.has(i);
            let cls = 'option';
            if (picked && !done) cls += ' picked';
            if (done && isCorrect) cls += ' correct';
            if (done && picked && !isCorrect) cls += ' wrong';
            return (
              <button key={i} className={cls} onClick={() => choose(i)} disabled={done} role={isMulti ? 'checkbox' : 'radio'} aria-checked={picked}>
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                <span className="opt-body">{q.of === 'md' ? <Content md={o} /> : <Content html={o} />}</span>
                {done && isCorrect && <Icon name="check" />}
                {done && picked && !isCorrect && <Icon name="x" />}
              </button>
            );
          })}
        </div>
      )}

      {q.t === 'NAT' && (
        <label className="answer-field">
          Your answer
          <input
            className="input"
            inputMode="decimal"
            value={nat}
            disabled={done}
            onChange={(e) => setNat(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                check();
              }
            }}
            placeholder="Enter a number"
          />
        </label>
      )}

      {freeform && !done && (
        <label className="answer-field wide">
          Scratchpad (not saved)
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Work it out here, then reveal the solution and grade yourself." />
        </label>
      )}

      <div className="qactions">
        {!done && gradable && (
          <button className="btn primary" disabled={!canCheck} onClick={check} title="Enter">
            Check answer
          </button>
        )}
        {!done && (
          <button className={`btn${gradable ? '' : ' primary'}`} onClick={reveal} title="S">
            Show solution
          </button>
        )}
        {done && (
          <button className="btn" onClick={retry}>
            <Icon name="refresh" size={15} /> Try again
          </button>
        )}
        <span className="step">
          <button className="btn ghost" onClick={onPrev} disabled={!onPrev} title="Previous (←)">
            <Icon name="left" /> Previous
          </button>
          <button className={`btn${done ? ' primary' : ''}`} onClick={onNext} disabled={!onNext} title="Next (→)">
            Next <Icon name="right" />
          </button>
        </span>
      </div>

      {done && (
        <section className="solution">
          <div className="solution-head">
            {result === 'correct' && (
              <span className="verdict correct">
                <Icon name="check" /> Correct{q.m ? ` · +${q.m}` : ''}
              </span>
            )}
            {result === 'wrong' && (
              <span className="verdict wrong">
                <Icon name="x" /> {selfGraded ? 'Marked as not solved' : 'Incorrect'}
                {!selfGraded && q.neg && q.t === 'MCQ' ? ` · −${q.neg}` : ''}
              </span>
            )}
            {result == null && <span className="verdict">Solution</span>}
            <span className="answer-key">
              Answer:{' '}
              <b>
                <Content md={answerLabel(q)} inline />
              </b>
            </span>
          </div>
          {revealed && !selfGraded && result == null && (
            <div className="selfgrade">
              <span>Did you get it right?</span>
              <button className="btn small" onClick={() => selfGrade(true)}>
                <Icon name="check" size={14} /> Yes
              </button>
              <button className="btn small" onClick={() => selfGrade(false)}>
                <Icon name="x" size={14} /> No
              </button>
            </div>
          )}
          {q.note && (
            <div className="key-note">
              <strong>About the answer key:</strong> {q.note}
            </div>
          )}
          <div className="explanation">
            <Content md={q.e} />
          </div>
        </section>
      )}

      {showNote && (
        <div className="notes">
          <label htmlFor="note">My notes (saved automatically)</label>
          <textarea id="note" rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} onBlur={() => setNote(q.id, noteText)} placeholder="Formulae, traps, things to remember…" />
        </div>
      )}

      <footer className="qfoot">
        {prev && (
          <p>
            Attempted {prev.n} time{prev.n === 1 ? '' : 's'} · first try {prev.first === 'correct' ? 'correct' : 'incorrect'} · last on {new Date(prev.at).toLocaleDateString()} ·{' '}
            <button className="link-btn" onClick={() => clearAttempt(q.id)} title="Forget my attempts on this question">
              reset
            </button>
          </p>
        )}
        <p>Keys: A–D choose · Enter check / next · ← → move · S solution · B bookmark · R revise</p>
      </footer>
    </div>
  );
}
