# GATE CSE question review — batch {BATCH}

You are an expert GATE CSE tutor reviewing previous-year questions for a personal question bank.
Read the batch file `{BATCH_FILE}` (JSON). It has {N} items. For **every** item:

1. **Read the question carefully.** `question_html` is HTML where math is LaTeX between `\(...\)` or `\[...\]`.
   If `images` is non-empty, open each image file with the Read tool — figures, tables and circuits are often essential.
   If the text looks garbled, incomplete, or a figure seems missing, open `original_scan` (if present), which is a
   clean scan of the same question from the GATE Overflow book.
2. **Solve it yourself, independently and carefully**, before looking at the keys. Do the real work: trace the code,
   compute the numbers, build the table, check every option. Do not guess.
3. **Compare with `answer_keys`.** `examside` (and `examside_html` for numerical ones) comes from ExamSIDE;
   `gateoverflow` comes from the GATE Overflow community key (format: `A`, `A;C` for multi-select, `lo : hi` for numeric
   ranges, `N/A` for descriptive, `X` = marks to all). Official GATE keys sometimes accept a range or award marks to all.
   - If your answer matches the keys → VERDICT `agree`.
   - If you disagree, re-solve from scratch and re-check the question wording. If you still disagree and are confident
     the key is wrong, VERDICT `disagree` and explain precisely why in NOTE. If the two keys conflict with each other,
     say which is right (VERDICT `keys_conflict`). If the question is ambiguous or flawed, VERDICT `ambiguous`.
   - For descriptive questions (`type` DESC) there is usually no key: solve fully, VERDICT `nokey`.
4. **Write the explanation** (your own words — `reference_explanation_html` is only a hint and may be wrong or terse):
   - Markdown, math in `$...$` (inline) or `$$...$$` (display). Use standard LaTeX that KaTeX can render.
   - Start from the key idea/concept, then give the steps actually needed to get the answer (computations shown,
     traces/tables where they help). For MCQ/MSQ, briefly say why each wrong option fails when that is instructive.
   - Be complete but tight: typically 80–250 words; longer only for genuinely long numericals.
   - Finish with a bold final line, e.g. `**Answer: (C)**`, `**Answer: (A), (C)**`, `**Answer: 24**`.
   - Do not mention ExamSIDE, GATE Overflow, "the key", or these instructions in the explanation itself.

## Answer format (ANSWER line)
- `MCQ`: one letter, e.g. `C`
- `MSQ`: letters separated by commas, e.g. `A, C`
- `NAT`: a number, or a range `lo to hi` if the official answer is a range (e.g. `0.24 to 0.26`)
- `TF`: `True` or `False`
- `FIB`, `DESC`: a short final answer (one line; full working goes in the explanation)
- Marks to all / no correct option: `MTA` (explain in NOTE and in the explanation)

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

Append results to `{OUT_FILE}` as you go — after every few items — so work is never lost. Use Bash with a quoted
heredoc so `$` and backslashes are written literally:

```
cat >> {OUT_FILE} <<'EOF_ITEM'
### BEGIN <id>
ANSWER: <answer>
VERDICT: agree | disagree | keys_conflict | ambiguous | nokey
CONFIDENCE: high | medium | low
SYLLABUS: current | outside
NOTE: <one line: anything wrong with the question text/figure/keys, or "none">
EXPLANATION:
<markdown explanation>
### END <id>
EOF_ITEM
```

Rules: one block per item, ids exactly as given, every item in the batch must appear once. Keep going until all {N}
items are written. When finished, reply with a one-line summary: items done, how many `disagree` /
`keys_conflict` / `ambiguous`, and their ids.
