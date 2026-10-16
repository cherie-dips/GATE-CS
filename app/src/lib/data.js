// Question bank loading, indexes, filtering and statistics.
import { plainText } from './render.js';

let DB = null;

export async function loadBank() {
  if (DB) return DB;
  const r = await fetch('data/questions.json');
  if (!r.ok) throw new Error(`Could not load data/questions.json (${r.status})`);
  const raw = await r.json();
  DB = indexBank(raw);
  return DB;
}

export function getBank() {
  return DB;
}

function indexBank(raw) {
  const subjects = raw.subjects;
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const chapterById = new Map();
  for (const s of subjects) for (const c of s.chapters) chapterById.set(c.id, { ...c, subject: s.id });
  const questions = raw.questions;
  const byId = new Map();
  for (const q of questions) {
    q._text = plainText(q.q, 100000).toLowerCase();
    q._preview = plainText(q.q, 230);
    byId.set(q.id, q);
  }
  const papers = raw.papers;
  return { meta: raw.meta, subjects, subjectById, chapterById, questions, byId, papers };
}

// ------------------------------------------------------------------ filters

export const STATUS_OPTIONS = [
  ['all', 'All'],
  ['new', 'Unsolved'],
  ['attempted', 'Attempted'],
  ['correct', 'Correct'],
  ['wrong', 'Incorrect'],
  ['bookmarked', 'Bookmarked'],
  ['revise', 'To revise'],
  ['notes', 'With notes'],
];

export const TYPE_LABELS = {
  MCQ: 'MCQ',
  MSQ: 'MSQ',
  NAT: 'Numerical',
  TF: 'True / False',
  FIB: 'Fill in the blank',
  DESC: 'Descriptive',
};

export function parseFilters(query) {
  return {
    s: query.get('s') || '',
    c: query.get('c') || '',
    p: query.get('p') || '',
    y0: Number(query.get('y0')) || 0,
    y1: Number(query.get('y1')) || 0,
    t: query.get('t') || '',
    st: query.get('st') || 'all',
    q: query.get('q') || '',
    m: query.get('m') || '',
    ex: query.get('ex') || '',
    syl: query.get('syl') || '',
    sort: query.get('sort') || '',
  };
}

export function filtersToQuery(f) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v === '' || v === 0 || v == null) continue;
    if (k === 'st' && v === 'all') continue;
    q.set(k, String(v));
  }
  return q.toString();
}

export function applyFilters(bank, progress, f, settings = {}) {
  const words = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const types = f.t ? new Set(f.t.split(',')) : null;
  const includeIT = f.ex ? f.ex !== 'CSE' : settings.includeIT !== false;
  const onlyIT = f.ex === 'IT';
  const currentOnly = f.syl ? f.syl === 'current' : settings.currentSyllabusOnly === true;
  let list = bank.questions.filter((q) => {
    if (f.s && q.s !== f.s) return false;
    if (f.c && q.c !== f.c) return false;
    if (f.p && q.p !== f.p) return false;
    if (f.y0 && q.y < f.y0) return false;
    if (f.y1 && q.y > f.y1) return false;
    if (types && !types.has(q.t)) return false;
    if (f.m && String(q.m) !== f.m) return false;
    if (!f.p) {
      if (!includeIT && q.ex === 'IT') return false;
      if (onlyIT && q.ex !== 'IT') return false;
    }
    if (currentOnly && q.oos) return false;
    if (f.st && f.st !== 'all') {
      const a = progress.attempts[q.id];
      switch (f.st) {
        case 'new': if (a) return false; break;
        case 'attempted': if (!a) return false; break;
        case 'correct': if (!a || a.s !== 'correct') return false; break;
        case 'wrong': if (!a || a.s !== 'wrong') return false; break;
        case 'bookmarked': if (!progress.bookmarks[q.id]) return false; break;
        case 'revise': if (!progress.revise[q.id]) return false; break;
        case 'notes': if (!progress.notes[q.id]) return false; break;
        default: break;
      }
    }
    if (words.length) {
      const hay = q._text + ' ' + (q.p || '').toLowerCase() + ' ' + (q.tags || []).join(' ');
      for (const w of words) if (!hay.includes(w)) return false;
    }
    return true;
  });
  list = sortList(list, f.sort || (f.p ? 'paper' : 'year-desc'));
  return list;
}

function qnoKey(n) {
  if (!n) return [9999, 0, ''];
  const m = String(n).match(/(\d+)(?:\.(\d+))?/);
  return m ? [Number(m[1]), Number(m[2] || 0), String(n)] : [9999, 0, String(n)];
}

function cmpQno(a, b) {
  const x = qnoKey(a.n);
  const y = qnoKey(b.n);
  return x[0] - y[0] || x[1] - y[1] || x[2].localeCompare(y[2]);
}

export function paperSortKey(q) {
  // since 2014 the General Aptitude section (numbered separately) comes first in the paper
  return q.ga ? 0 : 1;
}

export function sortList(list, sort) {
  const l = [...list];
  if (sort === 'year-asc') l.sort((a, b) => a.y - b.y || (a.set || 0) - (b.set || 0) || cmpQno(a, b));
  else if (sort === 'paper') l.sort((a, b) => paperSortKey(a) - paperSortKey(b) || cmpQno(a, b));
  else if (sort === 'marks') l.sort((a, b) => (b.m || 0) - (a.m || 0) || b.y - a.y);
  else l.sort((a, b) => b.y - a.y || (a.set || 0) - (b.set || 0) || cmpQno(a, b));
  return l;
}

// ------------------------------------------------------------------ stats

export function emptyStats() {
  return { total: 0, attempted: 0, correct: 0, wrong: 0, firstCorrect: 0, time: 0, marks: 0, marksScored: 0 };
}

export function addToStats(st, q, a) {
  st.total += 1;
  st.marks += q.m || 0;
  if (a) {
    st.attempted += 1;
    st.time += a.t || 0;
    if (a.s === 'correct') {
      st.correct += 1;
      st.marksScored += q.m || 0;
    } else st.wrong += 1;
    if (a.first === 'correct') st.firstCorrect += 1;
  }
  return st;
}

export function computeStats(bank, progress, settings = {}) {
  const overall = emptyStats();
  const bySubject = new Map();
  const byChapter = new Map();
  const byPaper = new Map();
  const byType = new Map();
  const includeIT = settings.includeIT !== false;
  const currentOnly = settings.currentSyllabusOnly === true;
  for (const q of bank.questions) {
    if (!includeIT && q.ex === 'IT') continue;
    if (currentOnly && q.oos) continue;
    const a = progress.attempts[q.id];
    addToStats(overall, q, a);
    for (const [map, key] of [[bySubject, q.s], [byChapter, q.c], [byPaper, q.p], [byType, q.t]]) {
      if (!map.has(key)) map.set(key, emptyStats());
      addToStats(map.get(key), q, a);
    }
  }
  return { overall, bySubject, byChapter, byPaper, byType };
}

export function pct(n, d) {
  return d ? Math.round((100 * n) / d) : 0;
}

export function fmtTime(ms) {
  if (!ms) return '0m';
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

// ------------------------------------------------------------------ answers

export function answerLabel(q) {
  const a = q.a || {};
  if (a.mta) return 'Marks to all';
  if (a.opts) return a.opts.map((i) => String.fromCharCode(65 + i)).join(q.t === 'MSQ' ? ', ' : ' or ');
  if (a.lo != null) {
    const one = (lo, hi) => (lo === hi ? String(lo) : `${lo} to ${hi}`);
    return [one(a.lo, a.hi), ...(a.alt || []).map(([lo, hi]) => one(lo, hi))].join(' or ');
  }
  if (a.tf != null) return a.tf ? 'True' : 'False';
  return a.text || '—';
}

/** Returns true / false for gradable answers, or null when the question needs self-assessment. */
export function grade(q, response) {
  const a = q.a || {};
  if (a.mta) return true;
  if (q.t === 'MCQ' || q.t === 'MSQ' || q.t === 'TF') {
    if (a.opts) {
      const sel = [...(response || [])].sort();
      const key = [...a.opts].sort();
      // single-answer questions where the official key accepted more than one option
      if (q.t !== 'MSQ' && key.length > 1) return sel.length === 1 && key.includes(sel[0]);
      return sel.length === key.length && sel.every((v, i) => v === key[i]);
    }
    return null;
  }
  if (q.t === 'NAT' && a.lo != null) {
    const v = Number(String(response ?? '').trim());
    if (String(response ?? '').trim() === '' || Number.isNaN(v)) return false;
    const ranges = [[a.lo, a.hi], ...(a.alt || [])];
    return ranges.some(([lo, hi]) => {
      const eps = 1e-9 + 1e-6 * Math.max(1, Math.abs(hi));
      return v >= lo - eps && v <= hi + eps;
    });
  }
  return null;
}
