// Final integrity check of app/public/data/questions.json.
// usage: node check_app_data.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/Users/diptidhawade/Plaksha/Code/Projects/GATE/app/');
const katex = require('katex');

const APP = '/Users/diptidhawade/Plaksha/Code/Projects/GATE/app/public';
const data = JSON.parse(fs.readFileSync(path.join(APP, 'data/questions.json'), 'utf8'));
const MATH_MD = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?!\s)[^$\n]+?(?<!\s)\$)/g;
const MATH_HTML = /(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
const problems = [];
const counts = {};
const bump = (k) => (counts[k] = (counts[k] || 0) + 1);
const chapters = new Set(data.subjects.flatMap((s) => s.chapters.map((c) => c.id)));
const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

function checkMath(id, field, text, isHtml) {
  if (!text) return;
  const t = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  for (const m of t.matchAll(isHtml ? MATH_HTML : MATH_MD)) {
    let s = m[0];
    let display = false;
    if (s.startsWith('$$') || s.startsWith('\\[')) { s = s.slice(2, -2); display = true; }
    else if (s.startsWith('\\(')) s = s.slice(2, -2);
    else s = s.slice(1, -1);
    if (isHtml) s = unescape(s);
    bump('math');
    try {
      katex.renderToString(s, { throwOnError: true, strict: 'ignore', displayMode: display });
    } catch (e) {
      problems.push({ id, kind: 'katex', field, tex: s.slice(0, 120), err: e.message.slice(0, 100) });
    }
  }
}

for (const q of data.questions) {
  bump('questions');
  bump(`type:${q.t}`);
  if (!q.s || !q.c || !chapters.has(q.c)) problems.push({ id: q.id, kind: 'chapter', c: q.c });
  if (!q.q || q.q.length < 5) problems.push({ id: q.id, kind: 'empty-question' });
  if (!q.a) problems.push({ id: q.id, kind: 'no-answer' });
  if (['MCQ', 'MSQ', 'TF'].includes(q.t)) {
    if (!q.o || q.o.length < 2) problems.push({ id: q.id, kind: 'few-options', n: q.o?.length });
    if (q.a && !q.a.mta && !(q.a.opts && q.a.opts.length)) problems.push({ id: q.id, kind: 'choice-answer-missing', a: q.a });
    if (q.a?.opts?.some((i) => i >= (q.o?.length || 0))) problems.push({ id: q.id, kind: 'answer-out-of-range', a: q.a });
    if (q.t === 'MCQ' && q.a?.opts?.length > 1) problems.push({ id: q.id, kind: 'mcq-multi-answer', a: q.a });
  }
  if (q.t === 'NAT' && !(q.a && (q.a.lo != null || q.a.mta))) problems.push({ id: q.id, kind: 'nat-answer', a: q.a });
  if (!q.e || q.e.includes('Explanation not available')) problems.push({ id: q.id, kind: 'no-explanation' });
  if (q.v === 'key-only') bump('key-only');
  if (q.note) bump('with-note');
  if (q.oos) bump('old-syllabus');
  if (q.scan) bump('with-scan');
  checkMath(q.id, 'q', q.q, q.qf === 'html');
  (q.o || []).forEach((o, i) => checkMath(q.id, `o${i}`, o, q.of === 'html'));
  checkMath(q.id, 'e', q.e, false);
  for (const blob of [q.q, ...(q.o || []), q.e]) {
    for (const m of (blob || '').matchAll(/<img src="([^"]+)"/g)) {
      if (!fs.existsSync(path.join(APP, m[1]))) problems.push({ id: q.id, kind: 'missing-image', src: m[1] });
    }
  }
  if (q.scan && !fs.existsSync(path.join(APP, q.scan))) problems.push({ id: q.id, kind: 'missing-scan', src: q.scan });
}
const byKind = {};
for (const p of problems) byKind[p.kind] = (byKind[p.kind] || 0) + 1;
console.log(counts);
console.log('problems by kind', byKind);
for (const p of problems.slice(0, 40)) console.log(JSON.stringify(p));
fs.writeFileSync('/private/tmp/claude-501/-Users-diptidhawade-Plaksha-Code-Projects-GATE/8d662bfb-fe3f-4cfb-b9dc-aa5d7b3a5856/scratchpad/app_check.json', JSON.stringify(problems, null, 1));
