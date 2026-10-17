# GATE CSE Question Bank

A subject-wise bank of **GATE CSE previous-year questions (1987–2026)**, plus GATE IT 2004–2008 for extra practice.
Every question has a cross-checked answer and a worked explanation. A local web app lets you solve the questions and
tracks your progress.

**Live site:** <https://cherie-dips.github.io/GATE-CS/>. On the hosted site your progress is kept in the
browser's local storage. Sign in to sync it across devices (see [Sync across devices](#sync-across-devices-google-sign-in)),
or use **Progress → Export progress** to back it up.
Running it locally (below) saves progress to a file instead.

## Run it

```bash
npm run setup     # once: installs app dependencies and builds the app
npm start         # serves http://localhost:5178
```

Open <http://localhost:5178>. Your progress is saved to `data/progress.json`. The previous save is kept as
`data/progress.json.bak`, and a copy is mirrored in the browser's localStorage. You can export or import progress
from **Progress → Your data**.

`npm run dev` runs a Vite dev server on :5173 with hot reload. Keep `npm start` running alongside it so progress
still gets saved.

## Sync across devices (Google sign-in)

Once it is set up, a **Sign in** button appears in the top bar. Sign in with the same Google account on each device. The
first time you sign in on a device, that device's progress is merged with your account's. After that it syncs
automatically: a couple of seconds after each change, and whenever you return to the tab. Signing out keeps the copy on
that device. Your progress is stored in your own Firebase project, and the security rules in `firestore.rules` let
only your signed-in account read or write it. Firebase's free tier is far more than one person needs.

One-time setup in the [Firebase console](https://console.firebase.google.com), with your Google account:

1. **Create a project** (any name, e.g. `gate-pyq`). Google Analytics is not needed.
2. **Authentication** → Get started → Sign-in method → **Google** → Enable → choose a support email → Save.
3. **Authentication → Settings → Authorized domains** → Add domain → `cherie-dips.github.io` (`localhost` is listed
   already, so the local app works too).
4. **Firestore Database** → Create database → pick a location near you (e.g. Mumbai, `asia-south1`) → production
   mode. In its **Rules** tab, replace the rules with the contents of [`firestore.rules`](firestore.rules) → Publish.
5. **Project settings** (gear icon) → General → Your apps → add a **Web app** (`</>`); Firebase Hosting is not needed.
   Copy the `firebaseConfig` object it shows into [`app/src/lib/firebase-config.js`](app/src/lib/firebase-config.js),
   replacing `null`. These values identify the project; they are not secrets.
6. Rebuild: `npm run setup` for the local app, or push to `main` to update the hosted site.

## Status (2026-10-17)

The bank has **3,692 questions**. Every question has a worked explanation and an answer that was solved independently
and checked against the source keys. Questions that existed only as scans in the GATE Overflow book are transcribed to
text. Disputed answers went to a second, independent check (adjudication), and text errors were fixed against the
original scans.

The run was stopped before the last part of the second pass finished:

- **82 flagged questions have not had their second check** (`adj_014`, `adj_016`–`adj_018`, `adj_020`). They are
  ambiguous, medium-confidence or single-key answers, plus 9 where the reviewer disagreed with the key. In 8 of those 9,
  the app grades with the key and shows the reviewer's objection as a *Disputed* note.
- **87 text and chapter fixes from the last batches are not applied** (`fix_010`–`fix_013`).

All 520 questions from GATE 2022–2026 match the official IIT answer keys, which the build applies automatically
(badge: *Official key*). To finish the second pass, follow `pipeline/RUNBOOK.md`. Completed work is saved in
`pipeline/work/`, and re-launched batches skip items that are already done.

## What's inside the app

The top bar has four sections:

- **Practice**: overall progress, *Continue where you left off*, a random unsolved question, and the subject list.
  A subject opens its chapters, and a chapter opens its questions.
- **Question lists**: search, status and type filters. The *Filters* panel adds subject, chapter, year range,
  marks, CSE vs IT papers, current syllabus only, and sort order.
- **Practice mode**:
  - MCQ and MSQ are auto-graded, and numerical answers are graded against the official range.
  - Descriptive and fill-in-the-blank questions are self-graded after you reveal the solution.
  - Each question has a timer, a bookmark, a "revise later" flag, and personal notes.
  - Questions transcribed from scans also show the original question image.
  - Keyboard shortcuts: `A–D` select, `Enter` check / next, `←/→` navigate, `S` solution, `B` bookmark, `R` revise.
- **Papers**: every paper by year. Solve it question by question, or take it as a timed mock test with GATE
  marking and a question palette.
- **Review**: your mistakes, bookmarks, questions flagged for revision, and questions with notes.
- **Progress**: questions solved, accuracy, streak and practice time; a subject → chapter breakdown; settings;
  and export / import / reset of your progress.

The app has a light and a dark theme. It follows the system setting by default; change it with the button in the top
bar or under Progress → Settings.

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
