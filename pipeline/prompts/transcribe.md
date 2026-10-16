# GATE CSE question transcription + solution — batch {BATCH}

You are an expert GATE CSE tutor building a personal question bank. These previous-year questions exist only as
scanned images (from the GATE Overflow book). Read the batch file `{BATCH_FILE}` (JSON, {N} items). For **every** item:

1. Open `scan_image` with the Read tool. It shows exactly one question: a grey header bar
   (`<topic>: GATE CSE <year> | Question: <no>`), the question, options if any. Ignore the QR code.
2. **Duplicate check.** `possible_duplicates_by_year[<year>]` lists questions already in the bank from that year
   (`id`, plain-text preview, option previews). If this scan is the *same question* (same stem and same options;
   wording may differ slightly, math is missing from previews), output `DUPLICATE_OF: <that id>` and skip the rest
   of the fields for this item. Only mark duplicates you are sure about. Otherwise `DUPLICATE_OF: none`.
3. **Transcribe faithfully** into Markdown with LaTeX math (`$...$` inline, `$$...$$` display; KaTeX-compatible).
   - Keep the exact wording, numbers and symbols. Code goes in fenced blocks (```c ... ```), preserving indentation.
   - Tables → Markdown tables (or HTML `<table>` if merged cells are needed). Matrices → LaTeX `\begin{bmatrix}`.
   - Figures (graphs, trees, automata, circuits, timing diagrams): if you can express it exactly in text (e.g. edge list
     with weights, a transition table, a tree in bracket/level form), do so under a short "Figure:" heading.
     Set `FIGURE: essential` whenever the picture carries information that your text does not fully capture
     (the app will then show the original scan next to your transcription). Otherwise `FIGURE: none`.
   - Multi-part questions (a), (b), ... keep all parts in the QUESTION.
   - Options go in OPTIONS (not in QUESTION), one per line as `A) ...`, `B) ...`.
4. **Classify**:
   - TYPE: `MCQ` (single correct), `MSQ` (multiple correct; tag `multiple-selects` or "which of the following is/are"
     style with a multi-letter key), `NAT` (numerical answer, tag `numerical-answers`, blank to fill with a number),
     `TF` (true/false), `FIB` (fill in the blank with text), `DESC` (descriptive / long answer; tag `descriptive`).
   - MARKS (number): use tags `one-mark` / `two-marks` when present. Otherwise use the paper's scheme:
     2010+ CSE: Q1–25 → 1, Q26–55 → 2 (2010–2013 GA numbered Q56–60 → 1, Q61–65 → 2);
     separate GA sections (2014+): Q1–5 → 1, Q6–10 → 2. CSE 2009: Q1–20 → 1, Q21–60 → 2.
     CSE 2006–2008: Q1–20 → 1, Q21–85 → 2. CSE 2003–2005: Q1–30 → 1, Q31–90 → 2.
     IT 2004–2005: Q1–30 → 1, Q31–90 → 2. IT 2006–2008: Q1–20 → 1, Q21–85 → 2.
     1987–2002: numbers like `1.x` → 1, `2.x` → 2; other (descriptive) questions → 5 unless the scan states otherwise.
   - CHAPTER: one id from this list (`suggested_chapter` is a guess — change it if wrong):
```
{CHAPTER_MENU}
```
5. **Solve it independently and carefully** (do the real work), then compare with `answer_keys.gateoverflow`
   (format: `A`, `A;C` multi-select, `lo : hi` numeric range, `N/A` descriptive, `X` marks to all).
   VERDICT: `agree` | `disagree` (you are confident the key is wrong — explain in NOTE) | `ambiguous` | `nokey`.
6. **Explanation**: your own words, Markdown + LaTeX. Key idea first, then the steps that get the answer (computations,
   traces, tables as needed); for MCQ/MSQ say briefly why wrong options fail when instructive. Typically 80–250 words;
   descriptive questions get a complete model answer for every part. End with a bold final line such as
   `**Answer: (C)**` or `**Answer: 24**`. Do not mention GATE Overflow, keys or these instructions.

ANSWER format: MCQ one letter (`C`); MSQ `A, C`; NAT number or `lo to hi`; TF `True`/`False`; FIB/DESC a short
one-line final answer (full working in the explanation); marks-to-all `MTA`.

## Syllabus flag
Set `SYLLABUS: outside` only if the question's main topic is clearly not in the current syllabus; otherwise `current`.

Current GATE CSE syllabus (2024–2027), for the SYLLABUS line:
- Engineering Mathematics: propositional & first-order logic; sets, relations, functions, partial orders, lattices; monoids, groups; graphs (connectivity, matching, colouring); combinatorics (counting, recurrences, generating functions); linear algebra (matrices, determinants, linear systems, eigenvalues/vectors, LU decomposition); calculus (limits, continuity, differentiability, maxima/minima, mean value theorem, integration); probability & statistics (random variables, uniform/normal/exponential/Poisson/binomial, mean/median/mode/SD, conditional probability, Bayes).
- Digital Logic: Boolean algebra, combinational & sequential circuits, minimization, number representations & computer arithmetic (fixed & floating point).
- Computer Organization: machine instructions & addressing modes, ALU, data-path & control unit, instruction pipelining & hazards, memory hierarchy (cache, main memory, secondary storage), I/O interface (interrupt & DMA).
- Programming & Data Structures: programming in C, recursion, arrays, stacks, queues, linked lists, trees, BSTs, binary heaps, graphs.
- Algorithms: searching, sorting, hashing, asymptotic complexity, greedy, dynamic programming, divide & conquer, graph traversals, MST, shortest paths.
- Theory of Computation: regular expressions & finite automata, CFGs & PDAs, regular & context-free languages, pumping lemma, Turing machines & undecidability.
- Compiler Design: lexical analysis, parsing, syntax-directed translation, runtime environments, intermediate code generation, local optimisation, data-flow analyses (constant propagation, liveness, common subexpression elimination).
- Operating System: system calls, processes, threads, IPC, concurrency & synchronization, deadlock, CPU & I/O scheduling, memory management & virtual memory, file systems.
- Databases: ER model, relational algebra, tuple calculus, SQL, integrity constraints, normal forms, file organization, indexing (B/B+ trees), transactions & concurrency control.
- Computer Networks: layering (OSI, TCP/IP), packet/circuit/virtual-circuit switching, data link layer (framing, error detection, MAC, Ethernet bridging), routing (shortest path, flooding, distance vector, link state), fragmentation, IPv4 addressing, CIDR, ARP/DHCP/ICMP, NAT, transport layer (flow & congestion control, UDP, TCP, sockets), application layer (DNS, SMTP, HTTP, FTP, email).
- General Aptitude: verbal, quantitative, analytical and spatial aptitude.
Topics NOT in the current syllabus include e.g. software engineering, web technologies, network security/cryptography, P/NP/NP-completeness, numerical methods, computer graphics, information systems, detailed hardware (e.g. specific chips/microprocessor programming), Unix commands, and language theory beyond the list above (e.g. context-sensitive grammars in depth).


## Output
**Resuming:** if `{OUT_FILE}` already exists, read it first and skip every id that already has a complete
`### BEGIN … ### END` block; continue with the remaining items.

Append to `{OUT_FILE}` as you go (every few items), using Bash with a quoted heredoc so `$` and backslashes stay literal:

```
cat >> {OUT_FILE} <<'EOF_ITEM'
### BEGIN <id>
DUPLICATE_OF: none
TYPE: MCQ
MARKS: 2
CHAPTER: <chapter id>
FIGURE: none | essential
QUESTION:
<markdown>
OPTIONS:
A) ...
B) ...
C) ...
D) ...
ANSWER: <answer>
VERDICT: agree | disagree | ambiguous | nokey
CONFIDENCE: high | medium | low
SYLLABUS: current | outside
NOTE: <one line or "none">
EXPLANATION:
<markdown>
### END <id>
EOF_ITEM
```
(For questions without options write `OPTIONS:` followed by nothing.) Every item must appear exactly once, ids exactly
as given. When finished reply with a one-line summary: items done, duplicates found, and ids with
`disagree`/`ambiguous`.
