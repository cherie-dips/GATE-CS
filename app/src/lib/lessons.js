// Lessons: one Markdown file per chapter in src/lessons/<subject id>/<chapter id>.md, loaded on demand.
// Format: "# Chapter title", a short intro, then one "## Lesson title {#lesson-id}" section per lesson, whose first
// line may be an *italic summary*, with "### Section" headings inside. Lesson ids are unique within a subject.
import { markdownToHtml } from './render.js';

const files = import.meta.glob('../lessons/*/*.md', { query: '?raw', import: 'default' });
const loaders = new Map(); // subject id -> Map(chapter id -> loader)
for (const [path, load] of Object.entries(files)) {
  const [, subject, chapter] = path.match(/lessons\/([^/]+)\/([^/]+)\.md$/);
  if (!loaders.has(subject)) loaders.set(subject, new Map());
  loaders.get(subject).set(chapter, load);
}
const cache = new Map();

export const lessonSubjects = new Set(loaders.keys());

export function hasLessons(subjectId, chapterId) {
  return !!loaders.get(subjectId)?.has(chapterId);
}

export const lessonKey = (subjectId, lessonId) => `${subjectId}/${lessonId}`;

/** subject from the bank -> { chapters: [{ id, title, intro, lessons }], lessons: [all, in order] } or null */
export function loadCourse(subject) {
  const chapters = loaders.get(subject.id);
  if (!chapters) return Promise.resolve(null);
  if (!cache.has(subject.id)) {
    const order = [...subject.chapters.map((c) => c.id).filter((id) => chapters.has(id)), ...[...chapters.keys()].filter((id) => !subject.chapters.some((c) => c.id === id))];
    const course = Promise.all(order.map((id) => chapters.get(id)().then((src) => parseChapter(id, src)))).then((list) => ({
      chapters: list,
      lessons: list.flatMap((c) => c.lessons),
    }));
    cache.set(subject.id, course);
  }
  return cache.get(subject.id);
}

function parseChapter(id, src) {
  const chapter = { id, title: id, intro: '', lessons: [] };
  const intro = [];
  let lesson = null;
  const finish = () => {
    if (!lesson) return;
    const body = lesson.lines.join('\n').trim();
    const summary = body.match(/^\*([^*\n]+)\*\s*(?:\n|$)/);
    lesson.summary = summary ? summary[1].trim() : '';
    lesson.md = summary ? body.slice(summary[0].length).trim() : body;
    lesson.sections = [...lesson.md.matchAll(/^###\s+(.+?)\s*$/gm)].map((m) => m[1]);
    lesson.minutes = readingMinutes(lesson.md);
    delete lesson.lines;
    chapter.lessons.push(lesson);
  };
  for (const line of src.split('\n')) {
    const h1 = line.match(/^#\s+(.+?)\s*$/);
    const h2 = line.match(/^##\s+(.+?)\s*(?:\{#([\w-]+)\})?\s*$/);
    if (h1 && !lesson) chapter.title = h1[1];
    else if (h2) {
      finish();
      lesson = { id: h2[2] || h2[1].toLowerCase().replace(/\W+/g, '-'), title: h2[1], chapterId: id, chapterTitle: chapter.title, lines: [] };
    } else if (lesson) lesson.lines.push(line);
    else intro.push(line);
  }
  finish();
  chapter.intro = intro.join('\n').trim();
  return chapter;
}

// figures don't count, and each formula counts as one word
function readingMinutes(md) {
  const prose = md
    .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
    .replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+\$/g, ' x ')
    .replace(/<[^>]+>/g, ' ');
  return Math.max(1, Math.round(prose.split(/\s+/).filter(Boolean).length / 180));
}

const CALLOUT = { Idea: 'idea', Example: 'example', 'Watch out': 'warn', 'GATE tip': 'tip', Remember: 'remember' };
const CALLOUT_RE = new RegExp(`<blockquote>\\s*<p><strong>(${Object.keys(CALLOUT).join('|')})`, 'g');

/** Lesson Markdown -> HTML with styled callout boxes and numbered section anchors (lesson-s0, lesson-s1, …). */
export function lessonHtml(md) {
  let n = 0;
  return markdownToHtml(md)
    .replace(CALLOUT_RE, (m, label) => `<blockquote class="callout ${CALLOUT[label]}"><p><strong>${label}`)
    .replace(/<h3>/g, () => `<h3 id="lesson-s${n++}">`);
}
