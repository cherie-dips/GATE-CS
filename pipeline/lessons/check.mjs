// Format checker for lesson files: node pipeline/lessons/check.mjs app/src/lessons/<subject>/<chapter>.md [...]
// Checks headings, callouts, hidden answers, figures, question links, and renders every formula with KaTeX.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(ROOT, 'app/package.json'));
const katex = require('katex');
const { marked } = require('marked');

const bank = JSON.parse(fs.readFileSync(path.join(ROOT, 'app/public/data/questions.json'), 'utf8'));
const qids = new Set(bank.questions.map((q) => q.id));
const MATH_RE = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?!\s)[^$\n]+?(?<!\s)\$)/g;
const LABELS = ['Idea', 'Example', 'Watch out', 'GATE tip', 'Remember'];

let failed = false;
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const errs = [];
  const err = (i, m) => errs.push(`${file}:${i + 1}: ${m}`);

  if (!/^# \S/.test(lines[0])) err(0, 'first line must be "# Chapter title"');
  const ids = new Set();
  let lessons = 0;
  let inDisplay = false;
  let inSvg = false;
  let openDetails = 0;
  lines.forEach((l, i) => {
    if (/^#\s/.test(l) && i > 0) err(i, 'only one "# " heading allowed');
    if (/^####/.test(l)) err(i, '#### headings are not allowed');
    if (/^##\s/.test(l)) {
      lessons++;
      const m = l.match(/^##\s+(.+?)\s*\{#([a-z0-9-]+)\}\s*$/);
      if (!m) err(i, 'lesson heading must be "## Title {#id}"');
      else if (ids.has(m[2])) err(i, `duplicate lesson id ${m[2]}`);
      else ids.add(m[2]);
    }
    // display math spanning lines inside a blockquote
    const dd = (l.match(/\$\$/g) || []).length;
    if (dd % 2 === 1) {
      if (!inDisplay && l.startsWith('>')) err(i, 'multi-line $$ inside a blockquote; put it on one line');
      inDisplay = !inDisplay;
    }
    if (/^<figure|<svg/.test(l)) inSvg = !/<\/figure>|<\/svg>/.test(l);
    else if (inSvg && /<\/figure>|<\/svg>/.test(l)) inSvg = false;
    else if (inSvg && !l.trim()) err(i, 'blank line inside an SVG/figure block');
    if (/<details>/.test(l)) {
      openDetails++;
      if (!/^<details><summary>Show answer<\/summary>\s*$/.test(l)) err(i, 'use exactly "<details><summary>Show answer</summary>"');
      if (lines[i + 1]?.trim()) err(i + 1, 'blank line required after <details> line');
    }
    if (/<\/details>/.test(l)) {
      openDetails--;
      if (l.trim() !== '</details>') err(i, '</details> must be on its own line');
      if (lines[i - 1]?.trim()) err(i - 1, 'blank line required before </details>');
    }
    if (/^>\s*\*\*/.test(l) && (i === 0 || !lines[i - 1].startsWith('>'))) {
      const label = l.match(/^>\s*\*\*([^*]+?):\*\*/);
      if (!label || !LABELS.some((x) => label[1].startsWith(x))) err(i, `callout should start "> **Label:**" with one of ${LABELS.join(', ')}`);
    }
    // table rows: literal | inside inline math
    if (l.trimStart().startsWith('|')) {
      for (const m of l.matchAll(/\$[^$]*\$/g)) if (m[0].includes('|')) err(i, 'literal | inside maths in a table row; use \\lvert/\\mid');
    }
    for (const m of l.matchAll(/\]\(#\/q\/([^)\s]+)\)/g)) if (!qids.has(m[1])) err(i, `unknown question id ${m[1]}`);
  });
  if (openDetails !== 0) err(0, 'unbalanced <details>');
  if (inDisplay) err(0, 'unbalanced $$');
  if (!lessons) err(0, 'no lessons');

  // stray $ outside maths, and KaTeX errors
  const stripped = src.replace(MATH_RE, (m) => {
    const display = m.startsWith('$$') || m.startsWith('\\[');
    const tex = m.startsWith('$$') ? m.slice(2, -2) : m.startsWith('$') ? m.slice(1, -1) : m.slice(2, -2);
    try {
      katex.renderToString(tex.replace(/^>\s?/gm, ''), { displayMode: display, throwOnError: true, strict: 'ignore' });
    } catch (e) {
      const at = src.slice(0, src.indexOf(m)).split('\n').length;
      errs.push(`${file}:${at}: KaTeX: ${String(e.message).split('\n')[0]}  in  ${m.slice(0, 80)}`);
    }
    return 'MATH';
  });
  stripped.split('\n').forEach((l, i) => {
    if (l.includes('$')) errs.push(`${file}: stray $ (outside maths) near: ${l.trim().slice(0, 100)}`);
  });
  marked.parse(stripped); // throws on catastrophic input

  const words = src.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
  console.log(`${file}: ${lessons} lessons [${[...ids].join(', ')}], ~${words} words`);
  if (errs.length) {
    failed = true;
    console.log(errs.join('\n'));
  } else console.log('OK');
}
process.exit(failed ? 1 : 0);
