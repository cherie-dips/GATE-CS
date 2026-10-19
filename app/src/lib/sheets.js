// Cheatsheets: one Markdown file per subject in src/sheets/<subject id>.md, loaded on demand.
// Format: "## Chapter title {#chapter-id}" (chapter ids match the question bank) and "### Topic" sections below it.
import { texToPlain } from './render.js';

const files = import.meta.glob('../sheets/*.md', { query: '?raw', import: 'default' });
const loaders = new Map(Object.entries(files).map(([path, load]) => [path.match(/([^/]+)\.md$/)[1], load]));
const cache = new Map();

export const sheetIds = new Set(loaders.keys());

export function loadSheet(id) {
  if (!loaders.has(id)) return Promise.resolve(null);
  if (!cache.has(id)) cache.set(id, loaders.get(id)().then(parseSheet));
  return cache.get(id);
}

export function loadAllSheets() {
  return Promise.all([...loaders.keys()].map((id) => loadSheet(id).then((sheet) => [id, sheet]))).then((pairs) => new Map(pairs));
}

// GFM needs a blank line between a table and the text around it
function spaceTables(md) {
  const lines = md.split('\n');
  const out = [];
  lines.forEach((line, i) => {
    const isTable = line.trimStart().startsWith('|');
    const prev = i > 0 ? lines[i - 1] : '';
    const prevTable = prev.trimStart().startsWith('|');
    if (line.trim() && prev.trim() && isTable !== prevTable) out.push('');
    out.push(line);
  });
  return out.join('\n');
}

// searchable text: math turned into rough plain text, Markdown punctuation dropped
function searchText(md) {
  return md
    .replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g, (m, a, b) => ` ${texToPlain(a ?? b)} `)
    .replace(/[|*`#>_]|---/g, ' ')
    .replace(/\s+/g, ' ');
}

function topic(title, lines, chapter) {
  const md = spaceTables(lines.join('\n').trim());
  return { title, md, text: `${title} ${chapter.title} ${searchText(md)}`.toLowerCase() };
}

/** -> { chapters: [{ id, title, topics: [{ title, md, text }] }] } */
export function parseSheet(src) {
  const chapters = [];
  let chapter = null;
  let title = null;
  let lines = [];
  const flush = () => {
    if (chapter && (title || lines.some((l) => l.trim()))) chapter.topics.push(topic(title || '', lines, chapter));
    title = null;
    lines = [];
  };
  for (const line of src.split('\n')) {
    const h2 = line.match(/^##\s+(.+?)\s*(?:\{#([\w-]+)\})?\s*$/);
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h2 && !line.startsWith('###')) {
      flush();
      chapter = { id: h2[2] || h2[1].toLowerCase().replace(/\W+/g, '-'), title: h2[1], topics: [] };
      chapters.push(chapter);
    } else if (h3) {
      flush();
      title = h3[1];
    } else lines.push(line);
  }
  flush();
  return { chapters };
}

/** Topics whose text contains every word of the query. */
export function matchTopics(sheet, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (t) => words.every((w) => t.text.includes(w));
  return sheet.chapters.map((c) => ({ ...c, topics: words.length ? c.topics.filter(hit) : c.topics })).filter((c) => c.topics.length);
}
