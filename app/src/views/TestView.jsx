import { useEffect, useMemo, useRef, useState } from 'react';
import Content from '../components/Content.jsx';
import { Badge, Icon } from '../components/ui.jsx';
import { answerLabel, grade, sortList, TYPE_LABELS } from '../lib/data.js';
import { abandonTest, finishTest, saveTest } from '../lib/progress.js';
import { href } from '../lib/router.js';

const SCORABLE = new Set(['MCQ', 'MSQ', 'NAT', 'TF']);

function scorable(q) {
  return SCORABLE.has(q.t) && (q.a?.opts || q.a?.lo != null || q.a?.mta);
}

function scoreOf(q, response) {
  if (response == null || (Array.isArray(response) && response.length === 0) || response === '') return { status: 'skipped', marks: 0 };
  const ok = grade(q, response);
  if (ok) return { status: 'correct', marks: q.m || 0 };
  const neg = q.t === 'MCQ' || q.t === 'TF' ? q.neg || 0 : 0;
  return { status: 'wrong', marks: -neg };
}

function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function TestView({ bank, progress, paperId }) {
  const questions = useMemo(() => sortList(bank.questions.filter((q) => q.p === paperId), 'paper'), [bank, paperId]);
  const active = (progress.tests || {})[paperId];
  const history = (progress.testHistory || {})[paperId] || [];
  const [result, setResult] = useState(null);
  const [duration, setDuration] = useState(180);

  if (!questions.length) return <p>Unknown paper.</p>;
  const scorableQs = questions.filter(scorable);
  const maxMarks = scorableQs.reduce((a, q) => a + (q.m || 0), 0);

  if (result) return <TestResult bank={bank} paperId={paperId} questions={questions} result={result} />;

  if (active) {
    return <TestRunner bank={bank} paperId={paperId} questions={questions} test={active} onSubmit={(r) => setResult(r)} />;
  }

  return (
    <div className="test-start">
      <div className="page-head">
        <div>
          <div className="crumbs">
            <a href="#/papers">Papers</a> / Mock test
          </div>
          <h1>{paperId} — mock test</h1>
          <p className="muted">
            {questions.length} questions · {scorableQs.length} auto-scored ({maxMarks} marks)
            {questions.length > scorableQs.length && ` · ${questions.length - scorableQs.length} descriptive/fill-in questions are shown but not scored`}
          </p>
        </div>
      </div>
      <div className="card">
        <h2>Exam conditions</h2>
        <ul className="rules">
          <li>No answers or explanations are shown until you submit.</li>
          <li>Marking: MCQ wrong answers carry negative marks as in the paper (usually ⅓ of the question's marks); MSQ and numerical answers have no negative marking.</li>
          <li>You can mark questions for review and jump around using the question palette.</li>
          <li>Your answers are saved continuously — you can close the tab and resume later.</li>
          <li>On submit, every answered question is recorded in your progress tracker.</li>
        </ul>
        <div className="action-row">
          <label className="inline-field">
            Duration
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
              <option value={180}>180 minutes (GATE)</option>
              <option value={120}>120 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={0}>No time limit</option>
            </select>
          </label>
          <button className="btn primary" onClick={() => saveTest(paperId, { startedAt: Date.now(), durationMs: duration * 60000, answers: {}, marked: {}, visited: {}, cur: 0 })}>
            <Icon name="play" /> Start test
          </button>
          <a className="btn" href={href('/list', `p=${encodeURIComponent(paperId)}&sort=paper`)}>
            Practise this paper question-by-question instead
          </a>
        </div>
      </div>
      {history.length > 0 && (
        <div className="card mt">
          <h2>Previous attempts</h2>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="num">Score</th>
                <th className="num">Correct</th>
                <th className="num">Wrong</th>
                <th className="num">Skipped</th>
                <th className="num">Time</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((h) => (
                <tr key={h.at}>
                  <td>{new Date(h.at).toLocaleString()}</td>
                  <td className="num">
                    <b>{Math.round(h.score * 100) / 100}</b> / {h.max}
                  </td>
                  <td className="num good">{h.correct}</td>
                  <td className="num bad">{h.wrong}</td>
                  <td className="num">{h.skipped}</td>
                  <td className="num">{Math.round(h.ms / 60000)} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TestRunner({ bank, paperId, questions, test, onSubmit }) {
  const [cur, setCur] = useState(Math.min(test.cur || 0, questions.length - 1));
  const [now, setNow] = useState(Date.now());
  const submitted = useRef(false);
  const q = questions[cur];
  const answers = test.answers || {};
  const marked = test.marked || {};
  const visited = test.visited || {};
  const resp = answers[q.id];
  const remaining = test.durationMs ? test.startedAt + test.durationMs - now : null;

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!visited[q.id] || test.cur !== cur) saveTest(paperId, { ...test, cur, visited: { ...visited, [q.id]: true } });
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  function setResp(v) {
    const a = { ...answers };
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) delete a[q.id];
    else a[q.id] = v;
    saveTest(paperId, { ...test, cur, answers: a, visited: { ...visited, [q.id]: true } });
  }

  function toggleMark() {
    const m = { ...marked };
    if (m[q.id]) delete m[q.id];
    else m[q.id] = true;
    saveTest(paperId, { ...test, cur, marked: m });
  }

  function submit(auto = false) {
    if (submitted.current) return;
    if (!auto) {
      const unanswered = questions.filter((x) => scorable(x) && answers[x.id] == null).length;
      if (!window.confirm(`Submit the test?${unanswered ? ` ${unanswered} scored question(s) are unanswered.` : ''}`)) return;
    }
    submitted.current = true;
    let score = 0;
    let max = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const rows = [];
    const graded = [];
    for (const x of questions) {
      if (!scorable(x)) {
        rows.push({ id: x.id, status: 'unscored', marks: 0 });
        continue;
      }
      max += x.m || 0;
      const r = scoreOf(x, answers[x.id]);
      score += r.marks;
      if (r.status === 'correct') correct++;
      else if (r.status === 'wrong') wrong++;
      else skipped++;
      rows.push({ id: x.id, ...r, response: answers[x.id] });
      if (r.status !== 'skipped') graded.push({ qid: x.id, result: r.status, response: answers[x.id] });
    }
    score = Math.round(score * 100) / 100;
    const summary = { score, max, correct, wrong, skipped, ms: Date.now() - test.startedAt, rows };
    finishTest(paperId, { ...test, score, max, correct, wrong, skipped }, graded);
    onSubmit(summary);
  }

  useEffect(() => {
    if (remaining != null && remaining <= 0) submit(true);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const isMulti = q.t === 'MSQ';
  const sel = Array.isArray(resp) ? resp : [];

  return (
    <div className="test-runner">
      <div className="test-bar card">
        <strong>{paperId}</strong>
        <span className="muted small">
          Answered {Object.keys(answers).length}/{questions.length} · Marked {Object.keys(marked).length}
        </span>
        <span className="grow" />
        {remaining != null && <span className={`clock ${remaining < 10 * 60000 ? 'low' : ''}`}>{fmtClock(remaining)}</span>}
        <button className="btn primary" onClick={() => submit(false)}>
          Submit test
        </button>
        <button
          className="btn ghost small"
          onClick={() => {
            if (window.confirm('Abandon this test? Your answers in this attempt will be discarded.')) abandonTest(paperId);
          }}
        >
          Abandon
        </button>
      </div>
      <div className="test-grid">
        <article className="card qcard">
          <header className="qcard-head">
            <div className="qcard-meta">
              <span className="paper-badge">Question {cur + 1}{q.n ? ` (Q.${q.n})` : ''}</span>
              <Badge tone="accent">{TYPE_LABELS[q.t] || q.t}</Badge>
              {q.m ? <Badge>+{q.m}{(q.t === 'MCQ' || q.t === 'TF') && q.neg ? ` / −${q.neg}` : ''}</Badge> : null}
              {!scorable(q) && <Badge tone="warn">not scored</Badge>}
            </div>
          </header>
          <div className="qbody">
            {q.qf === 'md' ? <Content md={q.q} /> : <Content html={q.q} />}
            {q.scan && q.fig && <img className="scan-inline" src={q.scan} alt="Original question" />}
          </div>
          {q.o?.length > 0 && (
            <div className="options">
              {isMulti && <div className="muted small">Select all options that are correct.</div>}
              {q.o.map((o, i) => {
                const picked = sel.includes(i);
                return (
                  <button
                    key={i}
                    className={`option ${picked ? 'picked' : ''}`}
                    onClick={() => setResp(isMulti ? (picked ? sel.filter((x) => x !== i) : [...sel, i].sort()) : picked ? [] : [i])}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="opt-body">{q.of === 'md' ? <Content md={o} /> : <Content html={o} />}</span>
                  </button>
                );
              })}
            </div>
          )}
          {q.t === 'NAT' && (
            <div className="nat">
              <label htmlFor="tnat">Your answer</label>
              <input id="tnat" inputMode="decimal" value={typeof resp === 'string' ? resp : ''} onChange={(e) => setResp(e.target.value)} placeholder="Enter a number" />
            </div>
          )}
          {!scorable(q) && <p className="muted small qbody">Descriptive / fill-in question — attempt it on paper; review the solution after submitting.</p>}
          <div className="qactions">
            <button className="btn ghost" disabled={cur === 0} onClick={() => setCur(cur - 1)}>
              <Icon name="left" /> Prev
            </button>
            <button className="btn" onClick={() => setResp(null)} disabled={resp == null}>
              Clear response
            </button>
            <button className={`btn ${marked[q.id] ? 'marked' : ''}`} onClick={toggleMark}>
              <Icon name="flag" /> {marked[q.id] ? 'Unmark' : 'Mark for review'}
            </button>
            <span className="grow" />
            <button className="btn primary" disabled={cur === questions.length - 1} onClick={() => setCur(cur + 1)}>
              Save &amp; next <Icon name="right" />
            </button>
          </div>
        </article>
        <aside className="card palette">
          <h3>Question palette</h3>
          <div className="palette-grid">
            {questions.map((x, i) => {
              const st = answers[x.id] != null ? 'answered' : visited[x.id] ? 'visited' : 'fresh';
              return (
                <button key={x.id} className={`pal ${st} ${marked[x.id] ? 'marked' : ''} ${i === cur ? 'current' : ''}`} onClick={() => setCur(i)} title={`Q${i + 1}${x.n ? ` (paper Q.${x.n})` : ''}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="palette-legend small muted">
            <span><i className="pal answered" /> answered</span>
            <span><i className="pal visited" /> not answered</span>
            <span><i className="pal fresh" /> not visited</span>
            <span><i className="pal marked" /> marked</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TestResult({ bank, paperId, questions, result }) {
  const bySubject = new Map();
  questions.forEach((q, i) => {
    const r = result.rows[i];
    const s = bySubject.get(q.s) || { score: 0, max: 0, correct: 0, wrong: 0, skipped: 0 };
    if (r.status !== 'unscored') {
      s.max += q.m || 0;
      s.score += r.marks;
      s[r.status] += 1;
    }
    bySubject.set(q.s, s);
  });
  const qs = `p=${encodeURIComponent(paperId)}&sort=paper`;
  return (
    <div className="test-result">
      <div className="page-head">
        <div>
          <div className="crumbs">
            <a href="#/papers">Papers</a> / Result
          </div>
          <h1>
            {paperId}: {result.score} / {result.max}
          </h1>
          <p className="muted">
            {result.correct} correct · {result.wrong} wrong · {result.skipped} skipped · {Math.round(result.ms / 60000)} minutes
          </p>
        </div>
        <a className="btn primary" href={`#/test/${encodeURIComponent(paperId)}`} onClick={() => window.location.reload()}>
          Back to paper
        </a>
      </div>
      <div className="card">
        <h2>By subject</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th className="num">Score</th>
              <th className="num">Correct</th>
              <th className="num">Wrong</th>
              <th className="num">Skipped</th>
            </tr>
          </thead>
          <tbody>
            {[...bySubject.entries()].map(([sid, s]) => (
              <tr key={sid}>
                <td>{bank.subjectById.get(sid)?.name || sid}</td>
                <td className="num">
                  <b>{Math.round(s.score * 100) / 100}</b> / {s.max}
                </td>
                <td className="num good">{s.correct}</td>
                <td className="num bad">{s.wrong}</td>
                <td className="num">{s.skipped}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card mt">
        <h2>Question review</h2>
        <div className="qlist">
          {questions.map((q, i) => {
            const r = result.rows[i];
            const yours = r.response == null ? '—' : Array.isArray(r.response) ? r.response.map((x) => String.fromCharCode(65 + x)).join(', ') : String(r.response);
            return (
              <a key={q.id} className={`qrow st-${r.status}`} href={href(`/q/${q.id}`, qs)}>
                <span className="qrow-idx">{i + 1}</span>
                <span className={`dot dot-${r.status === 'correct' ? 'correct' : r.status === 'wrong' ? 'wrong' : 'new'}`} />
                <div className="qrow-body">
                  <div className="qrow-text">{q._preview}</div>
                  <div className="qrow-meta">
                    <Badge tone={r.status === 'correct' ? 'good' : r.status === 'wrong' ? 'bad' : 'neutral'}>
                      {r.status === 'unscored' ? 'not scored' : `${r.marks > 0 ? '+' : ''}${Math.round(r.marks * 100) / 100}`}
                    </Badge>
                    <span className="small">
                      Your answer: <b>{yours}</b> · Correct: <b><Content md={answerLabel(q)} inline /></b>
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
