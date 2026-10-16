// Validate every LaTeX segment in agent output (markdown fields) with KaTeX.
// usage: node validate_math.mjs results.json report.json
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/private/tmp/claude-501/-Users-diptidhawade-Plaksha-Code-Projects-GATE/8d662bfb-fe3f-4cfb-b9dc-aa5d7b3a5856/scratchpad/katexcheck/');
const katex = require('katex');

const MATH_RE = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?!\s)[^$\n]+?(?<!\s)\$)/g;
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).results;
const bad = [];
let n = 0;
for (const [id, r] of Object.entries(data)) {
  const fields = { explanation: r.explanation, question: r.question };
  (r.options_list || []).forEach((o, i) => (fields[`option${i}`] = o));
  for (const [field, text] of Object.entries(fields)) {
    if (!text) continue;
    // ignore code blocks
    const t = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
    for (const m of t.matchAll(MATH_RE)) {
      let s = m[0];
      let display = false;
      if (s.startsWith('$$')) { s = s.slice(2, -2); display = true; }
      else if (s.startsWith('\\[')) { s = s.slice(2, -2); display = true; }
      else if (s.startsWith('\\(')) s = s.slice(2, -2);
      else s = s.slice(1, -1);
      n++;
      try {
        katex.renderToString(s, { throwOnError: true, strict: 'ignore', displayMode: display });
      } catch (e) {
        bad.push({ id, batch: r.batch, field, tex: s.slice(0, 300), error: e.message.slice(0, 160) });
      }
    }
  }
}
fs.writeFileSync(process.argv[3], JSON.stringify(bad, null, 1));
console.log(`math segments ${n}, failures ${bad.length}`);
for (const b of bad.slice(0, 25)) console.log(b.id, b.field, '|', b.tex.slice(0, 90), '=>', b.error.slice(0, 90));
