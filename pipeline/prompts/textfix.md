# Question-text correction — batch {BATCH}

The questions in `{BATCH_FILE}` ({N} items) were reviewed by an expert. In the reviewer's `reviewer_note`, they said the
**stored question text may differ from the original GATE paper** (typo, wrong symbol, missing words, garbled math,
missing figure, swapped sub-question, etc.). Your job is to fix the stored text so students see the question exactly as
it appeared in the exam — nothing more.

For each item:
1. Read `reviewer_note`. Open `original_scan` (a clean scan of the original question from the GATE Overflow book) if
   present, and the files in `images`. When there is no scan, rely on the note only if it is specific and clearly right.
2. Compare the scan with `question_html` and `options` (HTML; math is LaTeX inside `\(...\)` or `\[...\]`).
3. Decide:
   - `ACTION: none`: the stored text already matches the original (or the difference is purely cosmetic, such as
     spacing, a harmless typo or line breaks), or you cannot verify the claimed problem.
   - `ACTION: fix`: there is a real discrepancy that affects meaning (a symbol such as < vs ≤, a number, a missing
     clause, a wrong option, missing or garbled math, a figure that is missing and could be written as text/table).
4. If fixing: output the **complete corrected** `QUESTION_HTML` and the complete `OPTIONS` list (all options, even
   unchanged ones), keeping the same format:
   - HTML, with math in `\(...\)` (inline) or `\[...\]` (display). Inside HTML write `<` as `&lt;`, `>` as `&gt;` and
     `&` as `&amp;`, including inside math (e.g. `\(a &lt; b\)`).
   - Keep every existing `<img src="...">` tag unless the image is clearly wrong. Keep tables and code formatting.
   - Change only what is wrong. Do not rephrase correct text.
   - If a figure is missing and cannot be expressed as text, write `ACTION: scan` instead. The app will then show the
     original scan beside the question.

## Chapter
If `reviewer_note` says the question is filed under the wrong chapter/subject (e.g. "tagged Calculus but is a
dynamic-programming question"), or you can see that it plainly is, give the right chapter id in a `CHAPTER:` line
(otherwise `CHAPTER: keep`). The current chapter is `chapter`. Valid ids:
```
{CHAPTER_MENU}
```

## Output
Append to `{OUT_FILE}` with Bash and a quoted heredoc, one block per item. Put the options in the same order as the
stored options, which may differ from the scan's order; never reorder them.

```
cat >> {OUT_FILE} <<'EOF_ITEM'
### BEGIN <id>
ACTION: none | fix | scan
CHAPTER: keep | <chapter id>
CHANGES: <one line describing the fix, or none>
QUESTION_HTML:
<only when fix>
OPTIONS:
A) <html>
B) <html>
...
### END <id>
EOF_ITEM
```
Every item exactly once. Finish with a one-line summary of the counts per ACTION.
