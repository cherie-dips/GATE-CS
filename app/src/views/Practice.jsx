import { useEffect, useMemo, useRef, useState } from 'react';
import Content from '../components/Content.jsx';
import { Badge, Icon } from '../components/ui.jsx';
import { applyFilters, parseFilters, filtersToQuery, answerLabel, grade, TYPE_LABELS } from '../lib/data.js';
import { recordAttempt, toggleBookmark, toggleRevise, setNote, setLast, clearAttempt } from '../lib/progress.js';
import { href, navigate } from '../lib/router.js';

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

  if (!q) return <p>Question not found.</p>;
  const prevId = idx > 0 ? ids[idx - 1] : null;
  const nextId = idx < ids.length - 1 ? ids[idx + 1] : null;
  const go = (qid) => qid && navigate(href(`/q/${qid}`, qs));

  return <QuestionCard key={q.id} bank={bank} q={q} progress={progress} pos={idx + 1} total={ids.length} onPrev={prevId ? () => go(prevId) : null} onNext={nextId ? () => go(nextId) : null} backHref={href('/list', filtersToQuery(f))} startRevealed={query.get('reveal') === '1'} />;
}

function QuestionCard({ bank, q, progress, pos, total, onPrev, onNext, backHref, startRevealed }) {
  const subject = bank.subjectById.get(q.s);
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

  return (
    <div className="practice">
      <div className="practice-top">
        <div className="crumbs">
          <a href={backHref}>← Back to list</a>
          <span className="sep">/</span>
          <a href={`#/subject/${q.s}`}>{subject?.name}</a>
          <span className="sep">/</span>
          <span>{chapter?.name}</span>
        </div>
        <div className="practice-pos">
          <span>
            {pos} / {total}
          </span>
          <div className="mini-bar">
            <span style={{ width: `${(100 * pos) / Math.max(total, 1)}%` }} />
          </div>
        </div>
      </div>

      <article className="qcard card">
        <header className="qcard-head">
          <div className="qcard-meta">
            <span className="paper-badge">
              {q.p}
              {q.n ? ` · Q.${q.n}` : ''}
            </span>
            <Badge tone="accent">{TYPE_LABELS[q.t] || q.t}</Badge>
            {q.m ? (
              <Badge>
                +{q.m}
                {q.neg ? ` / −${q.neg}` : ''}
              </Badge>
            ) : null}
            {q.oos && <Badge tone="warn" title="This topic is not in the current GATE CSE syllabus">Old syllabus</Badge>}
            {q.scanOnly && <Badge tone="warn" title="Shown as the original scan; graded with the GATE Overflow answer key; no worked explanation yet">Scan only</Badge>}
            {q.v === 'key-only' && <Badge tone="warn" title="Answer taken from the source answer key; not yet independently re-solved">Unverified key</Badge>}
            {q.official && <Badge tone="good" title={`Official GATE answer key: ${q.official}`}>Official key</Badge>}
            {prev && (
              <Badge tone={prev.s === 'correct' ? 'good' : 'bad'} title={`Attempted ${prev.n} time${prev.n === 1 ? '' : 's'}`}>
                {prev.s === 'correct' ? 'Solved' : 'Got wrong'} before
              </Badge>
            )}
          </div>
          <div className="qcard-tools">
            {!done && settings.hideTimer !== true && (
              <span className="timer" title="Time on this question">
                <Icon name="clock" size={14} /> {mm}:{ss}
              </span>
            )}
            <button className={`icon-btn ${progress.bookmarks[q.id] ? 'on star' : ''}`} onClick={() => toggleBookmark(q.id)} title="Bookmark (B)" aria-label="Bookmark">
              <Icon name="star" />
            </button>
            <button className={`icon-btn ${progress.revise[q.id] ? 'on flag' : ''}`} onClick={() => toggleRevise(q.id)} title="Mark for revision (R)" aria-label="Mark for revision">
              <Icon name="flag" />
            </button>
            <button className={`icon-btn ${showNote ? 'on' : ''}`} onClick={() => setShowNote((v) => !v)} title="Notes" aria-label="Notes">
              <Icon name="note" />
            </button>
          </div>
        </header>

        <div className="qbody">
          {q.qf === 'md' ? <Content md={q.q} /> : <Content html={q.q} />}
          {q.tags?.length > 0 && done && (
            <div className="tag-row">
              {q.tags.slice(0, 6).map((t) => (
                <a key={t} className="tag" href={href('/list', `q=${encodeURIComponent(t)}`)} title="More questions with this tag">
                  #{t}
                </a>
              ))}
            </div>
          )}
          {q.scan && (
            <div className="scan">
              <button className="link-btn" onClick={() => setShowScan((v) => !v)}>
                <Icon name="image" size={14} /> {showScan ? 'Hide' : 'Show'} original question scan
              </button>
              {showScan && <img src={q.scan} alt="Original question" loading="lazy" />}
            </div>
          )}
        </div>

        {hasOptions && (
          <div className={`options ${done ? 'done' : ''}`} role={isMulti ? 'group' : 'radiogroup'}>
            {isMulti && !done && <div className="muted small">Select all options that are correct.</div>}
            {q.o.map((o, i) => {
              const picked = sel.includes(i);
              const isCorrect = correctSet.has(i);
              let cls = 'option';
              if (picked) cls += ' picked';
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
          <div className="nat">
            <label htmlFor="nat-input">Your answer</label>
            <input
              id="nat-input"
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
          </div>
        )}

        {(q.t === 'DESC' || q.t === 'FIB' || (!gradable && !hasOptions && q.t !== 'NAT')) && !done && (
          <div className="freeform">
            <label htmlFor="ff">Work it out (optional scratchpad, not saved)</label>
            <textarea id="ff" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your answer, then reveal the solution and grade yourself." />
          </div>
        )}

        <div className="qactions">
          {!done && gradable && (
            <button className="btn primary" disabled={!canCheck} onClick={check} title="Enter">
              Check answer
            </button>
          )}
          {!done && (
            <button className="btn" onClick={reveal} title="S">
              {gradable ? 'Show solution' : 'Reveal solution'}
            </button>
          )}
          {done && (
            <button className="btn" onClick={retry}>
              <Icon name="refresh" /> Try again
            </button>
          )}
          <span className="grow" />
          <button className="btn ghost" onClick={onPrev} disabled={!onPrev} title="Previous (←)">
            <Icon name="left" /> Prev
          </button>
          <button className={`btn ${done ? 'primary' : 'ghost'}`} onClick={onNext} disabled={!onNext} title="Next (→)">
            Next <Icon name="right" />
          </button>
        </div>

        {done && (
          <section className={`result ${result || 'neutral'}`}>
            <div className="result-head">
              {result === 'correct' && (
                <strong>
                  <Icon name="check" /> Correct{q.m ? ` · +${q.m}` : ''}
                </strong>
              )}
              {result === 'wrong' && (
                <strong>
                  <Icon name="x" /> {selfGraded ? 'Marked as not solved' : 'Incorrect'}
                  {!selfGraded && q.neg && q.t === 'MCQ' ? ` · −${q.neg}` : ''}
                </strong>
              )}
              {result == null && <strong>Solution</strong>}
              <span className="answer-key">
                Answer: <b><Content md={answerLabel(q)} inline /></b>
              </span>
            </div>
            {revealed && !selfGraded && result == null && (
              <div className="selfgrade">
                <span>Did you get it right?</span>
                <button className="btn small good" onClick={() => selfGrade(true)}>
                  <Icon name="check" /> Yes, I solved it
                </button>
                <button className="btn small bad" onClick={() => selfGrade(false)}>
                  <Icon name="x" /> No
                </button>
              </div>
            )}
            {q.note && (
              <div className="verify-note">
                <strong>Note on the answer key:</strong> {q.note}
              </div>
            )}
            <div className="explanation">
              <h3>Explanation</h3>
              <Content md={q.e} />
            </div>
          </section>
        )}

        {showNote && (
          <div className="notes">
            <label htmlFor="note">My notes</label>
            <textarea id="note" rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} onBlur={() => setNote(q.id, noteText)} placeholder="Formulae, traps, things to remember… (saved automatically)" />
          </div>
        )}

        <footer className="qcard-foot muted small">
          {prev && (
            <>
              Attempts: {prev.n} · first try {prev.first === 'correct' ? 'correct' : 'incorrect'} · last on {new Date(prev.at).toLocaleDateString()}{' '}
              <button className="link-btn" onClick={() => clearAttempt(q.id)} title="Forget my attempts on this question">
                reset
              </button>
              {' · '}
            </>
          )}
          Shortcuts: A–D select · Enter check / next · ←/→ navigate · S solution · B bookmark · R revise
        </footer>
      </article>
    </div>
  );
}
