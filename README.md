# GATE CSE Question Bank

A subject-wise bank of **GATE CSE previous-year questions (1987–2026)**, plus GATE IT 2004–2008 for extra practice.
Every question has a cross-checked answer and a worked explanation. A local web app lets you solve the questions and
tracks your progress.

**Live site:** <https://cherie-dips.github.io/gate-cse-pyq-bank/>. On the hosted site your progress is kept in the
browser's local storage, so use **Progress tracker → Export progress** to back it up or move it to another device.
Running it locally (below) saves progress to a file instead.

## Run it

```bash
npm run setup     # once: installs app dependencies and builds the app
npm start         # serves http://localhost:5178
```

Open <http://localhost:5178>. Your progress is saved to `data/progress.json`. The previous save is kept as
`data/progress.json.bak`, and a copy is mirrored in the browser's localStorage. You can export or import progress
from **Progress tracker → Settings & data**.

`npm run dev` runs a Vite dev server on :5173 with hot reload. Keep `npm start` running alongside it so progress
still gets saved.

## Status (generation stopped early, 2026-10-15)

The review run was stopped before it finished, to save tokens. The bank has **3,700 questions**:

| State | Questions | What you get |
|---|---|---|
| Reviewed | 1,858 | Answer independently re-solved and cross-checked, a worked explanation, disputes adjudicated, text errors fixed |
| Unreviewed, with source explanation | 488 | Source answer key + the ExamSIDE explanation (badge: *Unverified key*) |
| Unreviewed, key only | 1,070 | Source answer key, no explanation yet (badge: *Unverified key*) |
| Scan only | 284 | Original question image + GATE Overflow key, no explanation yet (badge: *Scan only*) |

All 520 questions from GATE 2022–2026 match the official IIT answer keys, which the build applies automatically
(badge: *Official key*). To finish the remaining batches later, follow `pipeline/RUNBOOK.md`: completed work is
saved in `pipeline/work/`, and re-launched batches skip items that are already done.

## What's inside the app

- **Dashboard**: overall coverage, accuracy, first-try accuracy, streak, time spent, per-subject progress bars, an
  activity heatmap, and review queues.
- **Subjects → chapters**: progress per chapter and the weightage trend for each subject, with a practice button
  for every chapter.
- **Question lists** with filters for subject, chapter, year range, type (MCQ / MSQ / NAT / descriptive …), marks,
  status (unsolved / correct / incorrect / bookmarked / to revise / has notes), CSE vs IT papers,
  current-syllabus-only, and full-text search.
- **Practice mode**:
  - MCQ and MSQ are auto-graded, and numerical answers are graded against the official range.
  - Descriptive and fill-in-the-blank questions are self-graded after you reveal the solution.
  - Each question has a timer, bookmarks, a "revise later" flag, and personal notes.
  - Questions transcribed from scans also show the original question image.
  - Keyboard shortcuts: `A–D` select, `Enter` check / next, `←/→` navigate, `S` solution, `B` bookmark, `R` revise.
- **Year-wise papers**: solve any paper in exam order.
- **Progress tracker**: a subject → chapter table (done, correct, wrong, accuracy, time), paper-wise coverage, the
  last 14 days of activity, and settings.

## How the bank was built (`pipeline/`)

1. **Sources**
   - [ExamSIDE](https://questions.examside.com/past-years/gate/gate-cse) supplies the structured question HTML,
     options and images. Its server-rendered MathJax SVG was converted back to LaTeX (`mjx2tex.py`) and validated
     with KaTeX.
   - ExamGOAL chapter and paper PDFs supply two independent answer keys, mapped to question IDs through the
     per-question hyperlinks in the PDFs (`pdf_keys.py`).
   - The **GATE Overflow GATE CSE book** ([GO-PDFs releases](https://github.com/GATEOverflow/GO-PDFs/releases))
     supplies the complete question inventory with official question numbers, community answer keys and topic
     tags (`go_inventory.py`). Its page crops (`go_crops.py`) are used to transcribe the questions ExamSIDE lacks.
2. **Merging** (`match_go.py`, `assemble_base.py`): ExamSIDE and GATE Overflow questions are matched by paper and
   text similarity. This fixes paper labels (e.g. GATE IT questions that ExamSIDE files under CSE), removes
   duplicates, and assigns subject and chapter.
3. **Review**: every question is solved independently by an AI reviewer and compared with all available keys.
   Disagreements go to a second, independent adjudication pass. Each question gets a fresh explanation in Markdown
   and LaTeX. Questions that exist only as scans are transcribed in the same pass.
4. **Build** (`build_app_data.py`): writes `app/public/data/questions.json` and copies the images that are needed.

The questions themselves belong to their respective owners (IISc/IITs for the GATE papers, and the sites above for
their presentation). This bank is for personal study only, so please don't redistribute it.
