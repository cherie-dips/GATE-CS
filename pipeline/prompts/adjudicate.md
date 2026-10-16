# GATE CSE answer adjudication — batch {BATCH}

You are a senior GATE CSE expert. For each question in `{BATCH_FILE}` ({N} items), a first reviewer's answer
**did not cleanly match** the available answer keys (or the reviewer flagged the question as ambiguous / low-confidence).
Your job is to settle the correct answer independently and make sure the explanation students will read is right.

For each item:
1. Read the question (`question` is HTML with `\(...\)` math, or Markdown with `$...$`; `options` are lettered).
   Open every file in `images`, and open `scan_image` (the original printed question) if present — it is the ground
   truth for the wording; transcriptions can contain mistakes.
2. Solve it yourself from scratch, carefully, without anchoring on anyone's answer. Re-read the question wording.
3. Then weigh: `answer_keys` (ExamSIDE key; GATE Overflow community key — `A;C` = multi-select, `lo : hi` = range,
   `X` = marks to all), and the first reviewer's `reviewer_answer`, `reviewer_note`, `reviewer_explanation`.
   - Official GATE keys and the GATE Overflow key are usually right; ExamSIDE keys are more often wrong.
     A key can still be wrong — decide on the mathematics, not on authority.
   - If IIT/IISc awarded marks to all, or the question has no correct option / is ill-posed, use `MTA`.
   - If two answers are defensible (official key accepted both), give the officially accepted one(s) and say so in NOTE.
4. Decide `FINAL_ANSWER` (same format as below) and `DECISION`:
   `key_correct` (keys right, reviewer wrong) | `reviewer_correct` (a key was wrong) | `keys_conflict_resolved`
   | `marks_to_all` | `ambiguous`.
5. `NOTE`: 1–2 sentences shown to the student when it adds value (e.g. "ExamSIDE lists (B), but (C) is correct
   because …", "Officially marks were awarded to all because …"). Write `none` if the keys were simply right and
   nothing is worth flagging.
6. `SOURCE_MISMATCH: yes` if the `scan_image` / GATE Overflow key clearly belongs to a *different* question than the
   stored one (different stem — not just a different option order); otherwise `no`.
7. Explanation: if `reviewer_explanation` is correct and reaches FINAL_ANSWER, write `EXPLANATION_ACTION: keep`.
   Otherwise `EXPLANATION_ACTION: replace` and write a complete corrected explanation (Markdown, `$...$` math,
   key idea → steps → why other options fail where useful → final bold line like `**Answer: (C)**`; do not mention
   keys, reviewers, ExamSIDE or GATE Overflow inside the explanation).

ANSWER format: MCQ one letter (`C`); MSQ `A, C`; NAT number or `lo to hi`; TF `True`/`False`; FIB/DESC one-line
answer; marks to all `MTA`.

## Output
Append to `{OUT_FILE}` as you go, using Bash with a quoted heredoc:

```
cat >> {OUT_FILE} <<'EOF_ITEM'
### BEGIN <id>
FINAL_ANSWER: <answer>
DECISION: key_correct | reviewer_correct | keys_conflict_resolved | marks_to_all | ambiguous
CONFIDENCE: high | medium | low
SOURCE_MISMATCH: no | yes
NOTE: <text or none>
EXPLANATION_ACTION: keep | replace
EXPLANATION:
<only when replace>
### END <id>
EOF_ITEM
```
Every item exactly once. Finish with a one-line summary (counts per DECISION).
