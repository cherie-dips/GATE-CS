# Lesson writing guide

You are writing lessons for a GATE CSE aspirant who wants to *learn* these topics from scratch, for the "Learn" tab of
their practice app (React + `marked` Markdown + KaTeX). The Engineering Mathematics lessons in `app/src/lessons/em/`
were written with this guide and are the reference for tone and depth. Make the question dump for a chapter with
`python3 pipeline/lessons/dump_pyq.py <subject id> <chapter id> <out.md>`. The reader asked for: **easy to learn, no jargon, every concept
explained properly, everything GATE CSE asks covered.** Treat that as the bar.

## Who the reader is

- A student who may have forgotten most school/college maths, or never understood it well. Assume class-12 algebra.
- Learns best from: a plain-words idea first → a tiny concrete example → the rule → a fully worked example → the
  common mistake → practice.
- Will practise on real GATE questions afterwards, so every lesson should end by connecting to how GATE asks it.

## Writing rules

1. **No jargon.** Use everyday words. When a technical term is unavoidable (e.g. "eigenvalue", "determinant",
   "probability density"), introduce it *after* the idea, in bold, with a plain meaning right next to it:
   "this number is called the **determinant**: it tells you how much the matrix stretches area". Never use a term
   before explaining it. Avoid formal machinery that GATE does not need (no ε–δ proofs, no "field", "isomorphism",
   "σ-algebra", "bijection"...). Never write "trivially", "obviously", "it is easy to see".
2. **Short sentences, second person, friendly teacher voice.** Paragraphs of 1–4 sentences. Use Indian English
   spellings consistently with British style ("practise" verb, "practice" noun).
3. **Explain why, not just what.** For each rule, give the reason in one or two plain sentences or a tiny example
   that makes it believable (e.g. why the determinant of a triangular matrix is the product of the diagonal).
4. **Every worked example shows every step.** No skipped arithmetic. Number the steps when there are more than two.
5. **Every concept GATE has asked must appear.** Read the GATE question dump for your chapter (path given in your
   task) end to end before writing, and list the concepts/tricks the questions rely on. Each one must be taught
   somewhere in your lessons. Older syllabus-only items (marked OLD SYLLABUS) can be skipped or mentioned briefly.
6. **Correctness is non-negotiable.** Verify every numeric worked example, every Quick-check answer and every
   claimed formula with Python (`python3`, `sympy` and `numpy` are installed) before you write it down. Keep your
   check scripts in your own scratch folder (given in your task). If a check fails, fix the content.
7. **Sources.** Ground the teaching in standard references (Kreyszig *Advanced Engineering Mathematics* for linear
   algebra — extracted text is provided; for others e.g. Strang's MIT 18.06 notes, Paul's Online Math Notes,
   OpenStax Calculus / Introductory Statistics, Sheldon Ross *A First Course in Probability*, Khan Academy). You may
   use WebSearch/WebFetch sparingly to check how a topic is usually taught or to confirm a fact, but write
   everything in your own words. Do not copy text. Do not cite sources inside the lessons.

## File format (must follow exactly — it is parsed by the app)

One file per chapter, e.g. `app/src/lessons/em/linear-algebra.md`.

```
# Linear Algebra

Two to four sentences: what this chapter is about in plain words, roughly how often GATE asks it (from the dump:
number of questions, typical 1- and 2-mark style), and the suggested order of lessons.

## Matrices: the basics {#matrices}

*One sentence in italics: what you will be able to do after this lesson.*

### Some subsection
...

## Next lesson title {#next-id}
...
```

- `# ` (exactly one, first line) = chapter title. Text before the first `## ` = chapter intro.
- Each `## Title {#id}` is one **lesson** (one page in the app). Ids: short, lowercase, hyphenated, unique in the file,
  and use exactly the ids listed in your task.
- `### ` = subsections inside a lesson. Don't use `####` or deeper headings; use bold lead-ins instead.
- Size: a lesson is roughly 600–1600 words. Split big ideas across subsections, not into giant paragraphs.

### Lesson template

```
## Lesson title {#id}

*What you'll learn, one sentence.*

### The idea
Plain-words intuition, a tiny example, a picture if it really helps.

### (several teaching subsections)
Concept → small example → rule → worked example → common mistake, as needed.

### How GATE asks this
Bulleted patterns seen in the GATE dump (e.g. "find the determinant after row operations"), then one or two real
GATE questions fully solved in the lesson's own style, each with a link (see below).

### Quick check
3–5 short questions (mix of easy and GATE-level). Each followed by a hidden answer with a short worked solution.

### Practice from GATE
3–8 bullet links to related real GATE questions from the dump, easiest first, each with a few words on what it tests.
```

### Maths

- Inline: `$...$`. Display: `$$...$$` (may span lines, except inside blockquotes — see below).
- No space right after the opening `$` or right before the closing `$` (the parser needs `$x$`, not `$ x $`).
- Never use a bare `$` for anything other than maths.
- Inside a table cell, never use a literal `|` (it ends the cell): use `\lvert x\rvert`, `\mid`, `\Vert`.
- Matrices: `\begin{bmatrix}1&2\\3&4\end{bmatrix}`. Use `\dfrac` in inline maths where fractions would be tiny.

### Callout boxes

A blockquote whose first word is one of these bold labels is shown as a coloured box:

```
> **Idea:** the one-line intuition.

> **Example:** a worked example. Multiple paragraphs are fine:
>
> Step 1 ...
>
> $$\det A = 1\cdot4-2\cdot3=-2$$

> **Watch out:** a common mistake or trap.

> **GATE tip:** a shortcut or exam-specific trick.

> **Remember:** a rule to memorise.
```

Labels allowed: `Idea`, `Example`, `Watch out`, `GATE tip`, `Remember`. Start the box with `> **Label:**` (the label
may have more words before the colon, e.g. `> **Example 2 — a 3×3 determinant:**`). Inside a blockquote,
**display maths must be on a single line** (`> $$ ... $$`), because the `>` on every line would end up inside a
multi-line formula. Long worked examples with multi-line display maths should be written as normal text under a
`**Example ...**` bold lead-in instead of inside a box.

### Hidden answers (Quick check)

Exactly this shape — blank lines around the inner Markdown are required:

```
**1.** If $A$ is $3\times3$ and $\det A=2$, what is $\det(2A)$?

<details><summary>Show answer</summary>

$\det(2A)=2^3\det A=16$, because each of the 3 rows gets multiplied by 2.

</details>
```

### Links to GATE questions

`[GATE 2019 Q.32](#/q/<question id>)` where the id is the one after `===` in the dump (e.g. `es_xqypoLYZAnI8iWTj`,
`go_v1_5.6.1`). Copy ids exactly. When you solve a GATE question in a lesson, restate it in your own words with the
numbers, solve it fully, and make sure your answer matches the `ANSWER`/official key in the dump (options are
0-indexed in `ANSWER: {'opts': [1]}`, i.e. 1 = (B)). If your answer disagrees with the key, recheck carefully; if
the key still looks wrong, pick a different question.

### Pictures (optional, use sparingly)

Only where a picture truly teaches (graph of $|x|$ with a corner, Rolle's theorem tangent, normal bell curve,
area under a curve, a probability tree). Write a small inline SVG as one HTML block with **no blank lines inside**:

```
<figure class="fig"><svg viewBox="0 0 320 160" role="img" aria-label="Graph of |x| with a sharp corner at 0">
<line x1="20" y1="140" x2="300" y2="140" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M40 20 L160 140 L280 20" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
<text x="160" y="155" font-size="12" fill="currentColor" text-anchor="middle">0</text>
</svg><figcaption>$y=|x|$ has a sharp corner at $x=0$.</figcaption></figure>
```

Use `currentColor` for axes/text and `var(--accent)` for the main curve (it works in light and dark themes). Keep
labels short, font-size 11–13, and check coordinates by computing them (e.g. with Python) so curves are accurate.
At most ~1 figure per lesson, and only if it helps.

## Working method

1. Read this guide, the GATE dump for your chapter, and (for linear algebra) the Kreyszig text.
2. Write a concept checklist for your chapter in your scratch folder (`concepts.md`): every concept/trick GATE uses,
   mapped to the lesson that teaches it.
3. Write the lesson file **one lesson at a time, appending as you go** (so partial work is never lost). Verify each
   lesson's numbers with Python before moving to the next.
4. At the end, reread the whole file once as the student would: is any term used before it is explained? Is any step
   skipped? Does the checklist have anything uncovered? Fix it.
5. Run the format checker: `node pipeline/lessons/check.mjs app/src/lessons/<subject>/<chapter>.md` and fix anything
   it reports.
6. Reply with a short report: lessons written (ids + word counts), anything from the dump you deliberately skipped,
   and any GATE key you believe is wrong.
