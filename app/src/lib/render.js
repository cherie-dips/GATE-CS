import { marked } from 'marked';
import renderMathInElement from 'katex/contrib/auto-render';

marked.setOptions({ gfm: true, breaks: false });

const MATH_DELIMITERS = [
  { left: '$$', right: '$$', display: true },
  { left: '\\[', right: '\\]', display: true },
  { left: '\\(', right: '\\)', display: false },
  { left: '$', right: '$', display: false },
];

// Render KaTeX inside an element that already contains HTML.
export function typeset(el) {
  if (!el) return;
  renderMathInElement(el, {
    delimiters: MATH_DELIMITERS,
    throwOnError: false,
    strict: 'ignore',
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
  });
}

// Markdown -> HTML while protecting LaTeX segments from the markdown parser
// (underscores and backslashes inside math must survive untouched).
const MATH_RE = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?!\s)[^$\n]+?(?<!\s)\$)/g;

export function markdownToHtml(md, inline = false) {
  if (!md) return '';
  const stash = [];
  const protectedMd = md.replace(MATH_RE, (m) => {
    stash.push(m);
    return `\u0000M${stash.length - 1}\u0000`;
  });
  let html = inline ? marked.parseInline(protectedMd) : marked.parse(protectedMd);
  html = html.replace(/\u0000M(\d+)\u0000/g, (_, i) => escapeHtml(stash[Number(i)]));
  return html;
}

export function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TEX_SYMBOLS = {
  le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', times: '×', cdot: '·', div: '÷', pm: '±',
  rightarrow: '→', to: '→', leftarrow: '←', Rightarrow: '⇒', Leftrightarrow: '⇔', leftrightarrow: '↔',
  in: '∈', notin: '∉', subseteq: '⊆', subset: '⊂', supseteq: '⊇', cup: '∪', cap: '∩', emptyset: '∅',
  forall: '∀', exists: '∃', neg: '¬', lnot: '¬', wedge: '∧', land: '∧', vee: '∨', lor: '∨', oplus: '⊕',
  infty: '∞', sum: 'Σ', prod: 'Π', int: '∫', sqrt: '√', ldots: '…', cdots: '⋯', dots: '…', log: 'log',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', theta: 'θ', lambda: 'λ',
  mu: 'μ', pi: 'π', sigma: 'σ', Sigma: 'Σ', phi: 'φ', varphi: 'φ', omega: 'ω', Omega: 'Ω', Theta: 'Θ',
  Delta: 'Δ', Gamma: 'Γ', Pi: 'Π', Phi: 'Φ', lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉',
  langle: '⟨', rangle: '⟩', equiv: '≡', approx: '≈', mid: '|', vert: '|', circ: '∘', star: '*', bowtie: '⋈',
};

/** Rough plain-text rendering of LaTeX for previews and search (not for display of full questions). */
export function texToPlain(t) {
  return t
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\(?:mathrm|mathbf|text|textbf|operatorname|mathit|mathsf|mathtt|boldsymbol)\{([^{}]*)\}/g, '$1')
    .replace(/\\(left|right|big|Big|bigg|Bigg)\b/g, '')
    .replace(/\\([A-Za-z]+)/g, (m, w) => TEX_SYMBOLS[w] ?? w)
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\([{}%#&$_])/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ');
}

// Plain-text preview of question HTML or Markdown (used in lists and search).
export function plainText(html, max = 220) {
  if (!html) return '';
  const s = html
    .replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g, (m, a, b, c, d) => ` ${texToPlain(a ?? b ?? c ?? d ?? '')} `)
    .replace(/```[\s\S]*?```/g, ' [code] ')
    .replace(/(^\|.*\|\s*$\n?)+/gm, ' [table] ')
    .replace(/\*\*|__|^#+\s/gm, '')
    .replace(/^\s*[-*]\s+/gm, ' ')
    .replace(/<img[^>]*>/g, ' [figure] ')
    .replace(/<table[\s\S]*?<\/table>/g, ' [table] ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > max ? s.slice(0, max).replace(/\s+\S*$/, '') + ' …' : s;
}
