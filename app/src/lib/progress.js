// Progress store: attempts, bookmarks, revision flags, notes and an activity log.
// Saved to the local server (data/progress.json) and mirrored to localStorage.
import { useSyncExternalStore } from 'react';

const LS_KEY = 'gate-pyq-progress-v1';

function empty() {
  return { version: 1, updatedAt: 0, attempts: {}, bookmarks: {}, revise: {}, notes: {}, log: [], last: null, settings: {} };
}

let state = empty();
let listeners = new Set();
let serverOk = null; // null = unknown, true/false after first contact
let saveTimer = null;
let saveStatus = 'idle';

function emit() {
  for (const l of listeners) l();
}

function normalize(p) {
  const base = empty();
  if (!p || typeof p !== 'object') return base;
  return { ...base, ...p, settings: { ...base.settings, ...(p.settings || {}) } };
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? normalize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeLocal() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: the server copy still holds the data */
  }
}

export async function loadProgress() {
  const local = readLocal();
  let remote = null;
  try {
    const r = await fetch('api/progress', { cache: 'no-store' });
    if (r.ok) {
      remote = normalize(await r.json());
      serverOk = true;
    } else serverOk = false;
  } catch {
    serverOk = false;
  }
  if (remote && local) state = (local.updatedAt || 0) > (remote.updatedAt || 0) ? local : remote;
  else state = remote || local || empty();
  // if the local copy was newer (server was down last time), push it up
  if (serverOk && local && remote && (local.updatedAt || 0) > (remote.updatedAt || 0)) scheduleSave();
  emit();
}

function scheduleSave() {
  writeLocal();
  clearTimeout(saveTimer);
  saveStatus = 'pending';
  saveTimer = setTimeout(async () => {
    if (serverOk === false) {
      saveStatus = 'local';
      emit();
      return;
    }
    try {
      const r = await fetch('api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      serverOk = r.ok;
      saveStatus = r.ok ? 'saved' : 'local';
    } catch {
      serverOk = false;
      saveStatus = 'local';
    }
    emit();
  }, 500);
}

function update(fn) {
  const next = { ...state };
  fn(next);
  next.updatedAt = Date.now();
  state = next;
  scheduleSave();
  emit();
}

// ------------------------------------------------------------------ actions

/** result: 'correct' | 'wrong' ; answer: what the user entered ; ms: time spent on this attempt */
export function recordAttempt(qid, result, answer, ms) {
  update((s) => {
    const prev = s.attempts[qid];
    const now = Date.now();
    s.attempts = {
      ...s.attempts,
      [qid]: {
        s: result,
        first: prev?.first || result,
        n: (prev?.n || 0) + 1,
        a: answer,
        t: (prev?.t || 0) + Math.max(0, Math.min(ms || 0, 3 * 3600 * 1000)),
        at: now,
        firstAt: prev?.firstAt || now,
      },
    };
    s.log = [...s.log, { q: qid, r: result === 'correct' ? 'c' : 'w', at: now }];
  });
}

export function clearAttempt(qid) {
  update((s) => {
    const a = { ...s.attempts };
    delete a[qid];
    s.attempts = a;
  });
}

export function toggleBookmark(qid) {
  update((s) => {
    const b = { ...s.bookmarks };
    if (b[qid]) delete b[qid];
    else b[qid] = Date.now();
    s.bookmarks = b;
  });
}

export function toggleRevise(qid) {
  update((s) => {
    const b = { ...s.revise };
    if (b[qid]) delete b[qid];
    else b[qid] = Date.now();
    s.revise = b;
  });
}

export function setNote(qid, text) {
  update((s) => {
    const n = { ...s.notes };
    if (text && text.trim()) n[qid] = text;
    else delete n[qid];
    s.notes = n;
  });
}

export function setLast(route) {
  update((s) => {
    s.last = { route, at: Date.now() };
  });
}

// ------------------------------------------------------------------ mock tests

export function saveTest(paperId, test) {
  update((s) => {
    s.tests = { ...(s.tests || {}), [paperId]: test };
  });
}

export function finishTest(paperId, test, graded) {
  // graded: [{qid, result: 'correct'|'wrong', response}] for answered questions
  update((s) => {
    const now = Date.now();
    const attempts = { ...s.attempts };
    const log = [...s.log];
    const per = graded.length ? Math.round((now - test.startedAt) / Math.max(graded.length, 1)) : 0;
    for (const g of graded) {
      const prev = attempts[g.qid];
      attempts[g.qid] = {
        s: g.result,
        first: prev?.first || g.result,
        n: (prev?.n || 0) + 1,
        a: g.response,
        t: (prev?.t || 0) + Math.min(per, 3600 * 1000),
        at: now,
        firstAt: prev?.firstAt || now,
      };
      log.push({ q: g.qid, r: g.result === 'correct' ? 'c' : 'w', at: now, test: paperId });
    }
    s.attempts = attempts;
    s.log = log;
    const history = [...((s.testHistory || {})[paperId] || []), { at: now, score: test.score, max: test.max, correct: test.correct, wrong: test.wrong, skipped: test.skipped, ms: now - test.startedAt }];
    s.testHistory = { ...(s.testHistory || {}), [paperId]: history };
    const tests = { ...(s.tests || {}) };
    delete tests[paperId];
    s.tests = tests;
  });
}

export function abandonTest(paperId) {
  update((s) => {
    const tests = { ...(s.tests || {}) };
    delete tests[paperId];
    s.tests = tests;
  });
}

export function setSetting(key, value) {
  update((s) => {
    s.settings = { ...s.settings, [key]: value };
  });
}

export function resetProgress() {
  state = { ...empty(), settings: state.settings, updatedAt: Date.now() };
  scheduleSave();
  emit();
}

export function importProgress(obj) {
  state = { ...normalize(obj), updatedAt: Date.now() };
  scheduleSave();
  emit();
}

export function exportProgress() {
  return JSON.stringify(state, null, 1);
}

// ------------------------------------------------------------------ hooks

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state);
}

export function getSaveStatus() {
  return { saveStatus, serverOk };
}

export function useSaveStatus() {
  useSyncExternalStore(subscribe, () => state);
  return { saveStatus, serverOk };
}

// ------------------------------------------------------------------ derived

export function statusOf(progress, qid) {
  const a = progress.attempts[qid];
  if (!a) return 'new';
  return a.s; // 'correct' | 'wrong'
}

export function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function activityByDay(progress) {
  const m = new Map();
  for (const e of progress.log) {
    const k = dayKey(e.at);
    const v = m.get(k) || { total: 0, correct: 0, qs: new Set() };
    v.total += 1;
    if (e.r === 'c') v.correct += 1;
    v.qs.add(e.q);
    m.set(k, v);
  }
  return m;
}

export function streak(progress) {
  const days = activityByDay(progress);
  let n = 0;
  const d = new Date();
  // today counts if practiced; otherwise the streak can still be alive from yesterday
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
