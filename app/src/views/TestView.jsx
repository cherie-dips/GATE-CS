import { useEffect, useMemo, useRef, useState } from 'react';
import Content from '../components/Content.jsx';
import { Icon, Tag } from '../components/ui.jsx';
import { answerLabel, grade, sortList, TYPE_LABELS } from '../lib/data.js';
import { abandonTest, finishTest, saveTest } from '../lib/progress.js';
import { preview } from '../components/QuestionList.jsx';
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
    <div className="practice">
      <a className="back" href="#/papers">
        <Icon name="left" size={14} /> Papers
      </a>
      <div className="page-head">
        <div>
          <h1>{paperId}</h1>
          <p className="sub">
            Mock test · {questions.length} questions · {scorableQs.length} auto-scored ({maxMarks} marks)
            {questions.length > scorableQs.length && ` · ${questions.length - scorableQs.length} descriptive or fill-in questions are shown but not scored`}
          </p>
        </div>
      </div>
      <div>
        <ul className="rules">
          <li>No answers or explanations are shown until you submit.</li>
          <li>Marking: MCQ wrong answers carry negative marks as in the paper (usually ⅓ of the question's marks); MSQ and numerical answers have no negative marking.</li>
          <li>You can mark questions for review and jump around using the question palette.</li>
          <li>Your answers are saved continuously — you can close the tab and resume later.</li>
          <li>On submit, every answered question is recorded in your progress tracker.</li>
        </ul>
        <div className="actions">
          <select className="select" value={duration} onChange={(e) => setDuration(Number(e.target.value))} aria-label="Duration">
              <option value={180}>180 minutes (GATE)</option>
              <option value={120}>120 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={0}>No time limit</option>
          </select>
          <button className="btn primary" onClick={() => saveTest(paperId, { startedAt: Date.now(), durationMs: duration * 60000, answers: {}, marked: {}, visited: {}, cur: 0 })}>
            <Icon name="play" size={14} /> Start test
          </button>
          <a className="btn ghost" href={href('/list', `p=${encodeURIComponent(paperId)}&sort=paper`)}>
            Practise question by question instead
          </a>
        </div>
      </div>
      {history.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Previous attempts</h2>
          </div>
          <table className="table">
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
                  <td className="num good-text">{h.correct}</td>
                  <td className="num bad-text">{h.wrong}</td>
                  <td className="num">{h.skipped}</td>
                  <td className="num">{Math.round(h.ms / 60000)} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
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
    <div>
      <div className="test-bar">
        <strong>{paperId}</strong>
        <span className="muted small">
          {Object.keys(answers).length} / {questions.length} answered · {Object.keys(marked).length} marked
        </span>
        <span className="spacer" />
        {remaining != null && <span className={`clock ${remaining < 10 * 60000 ? 'low' : ''}`}>{fmtClock(remaining)}</span>}
        <button
          className="btn ghost small"
          onClick={() => {
            if (window.confirm('Abandon this test? Your answers in this attempt will be discarded.')) abandonTest(paperId);
          }}
        >
          Abandon
        </button>
        <button className="btn primary small" onClick={() => submit(false)}>
          Submit test
        </button>
      </div>
      <div className="test-grid">
        <article>
          <div className="qmeta">
            <span className="paper">
              Question {cur + 1}
              {q.n ? ` (Q.${q.n})` : ''}
            </span>
            <span>{TYPE_LABELS[q.t] || q.t}</span>
            {q.m ? (
              <span className="num">
                +{q.m}
                {(q.t === 'MCQ' || q.t === 'TF') && q.neg ? ` / −${q.neg}` : ''}
              </span>
            ) : null}
            {!scorable(q) && <Tag tone="warn">Not scored</Tag>}
          </div>
          <div className="qtext">
            {q.qf === 'md' ? <Content md={q.q} /> : <Content html={q.q} />}
            {q.scan && q.fig && (
              <div className="scan">
                <img src={q.scan} alt="Original question" />
              </div>
            )}
          </div>
          {q.o?.length > 0 && (
            <div className="options">
              {isMulti && <div className="hint">Select every correct option.</div>}
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
            <label className="answer-field">
              Your answer
              <input className="input" inputMode="decimal" value={typeof resp === 'string' ? resp : ''} onChange={(e) => setResp(e.target.value)} placeholder="Enter a number" />
            </label>
          )}
          {!scorable(q) && <p className="hint">Descriptive or fill-in question: attempt it on paper, then review the solution after you submit.</p>}
          <div className="qactions">
            <button className="btn ghost" disabled={cur === 0} onClick={() => setCur(cur - 1)}>
              <Icon name="left" /> Previous
            </button>
            <button className="btn" onClick={() => setResp(null)} disabled={resp == null}>
              Clear
            </button>
            <button className={`btn${marked[q.id] ? ' on' : ''}`} onClick={toggleMark}>
              <Icon name="flag" size={15} /> {marked[q.id] ? 'Unmark' : 'Mark for review'}
            </button>
            <span className="spacer" />
            <button className="btn primary" disabled={cur === questions.length - 1} onClick={() => setCur(cur + 1)}>
              Save &amp; next <Icon name="right" />
            </button>
          </div>
        </article>
        <aside className="palette">
          <h2>Questions</h2>
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
          <div className="palette-legend">
            <span>
              <i className="answered" /> Answered
            </span>
            <span>
              <i /> Seen
            </span>
            <span>
              <i className="fresh" /> Not seen
            </span>
            <span>
              <i className="marked" /> Marked
            </span>
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
    <div className="practice">
      <a className="back" href="#/papers">
        <Icon name="left" size={14} /> Papers
      </a>
      <div className="page-head">
        <div>
          <h1>
            {paperId}: {result.score} / {result.max}
          </h1>
          <p className="sub">
            {result.correct} correct · {result.wrong} wrong · {result.skipped} skipped · {Math.round(result.ms / 60000)} minutes
          </p>
        </div>
        <a className="btn" href={`#/test/${encodeURIComponent(paperId)}`} onClick={() => window.location.reload()}>
          Back to paper
        </a>
      </div>
      <section>
        <div className="section-head">
          <h2>By subject</h2>
        </div>
        <table className="table">
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
                <td className="num good-text">{s.correct}</td>
                <td className="num bad-text">{s.wrong}</td>
                <td className="num">{s.skipped}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="section">
        <div className="section-head">
          <h2>Questions</h2>
        </div>
        <div className="qlist">
          {questions.map((q, i) => {
            const r = result.rows[i];
            const yours = r.response == null ? '—' : Array.isArray(r.response) ? r.response.map((x) => String.fromCharCode(65 + x)).join(', ') : String(r.response);
            return (
              <a key={q.id} className="qrow" href={href(`/q/${q.id}`, qs)}>
                <span className={`dot ${r.status === 'correct' ? 'correct' : r.status === 'wrong' ? 'wrong' : 'new'}`} />
                <span className="qrow-body">
                  <span className="qrow-text">
                    {i + 1}. {preview(q)}
                  </span>
                  <span className="qrow-meta">
                    <span className={r.status === 'correct' ? 'good-text' : r.status === 'wrong' ? 'bad-text' : ''}>
                      {r.status === 'unscored' ? 'Not scored' : `${r.marks > 0 ? '+' : ''}${Math.round(r.marks * 100) / 100}`}
                    </span>
                    <span>
                      Yours: <b>{yours}</b>
                    </span>
                    <span>
                      Correct: <b><Content md={answerLabel(q)} inline /></b>
                    </span>
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
