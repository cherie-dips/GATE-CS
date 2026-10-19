## Lexical Analysis {#lexical-analysis}

### Compiler phases
| Phase | Input → output | Formalism / tool | Typical errors |
|---|---|---|---|
| Lexical analysis | characters → tokens | regular expressions, DFA (Lex) | illegal character, unterminated string |
| Syntax analysis | tokens → parse tree | CFG, PDA (Yacc) | missing `;`, unbalanced brackets |
| Semantic analysis | parse tree → annotated tree | attribute grammars, type rules | type mismatch, undeclared variable |
| Intermediate code | → three-address code | SDT | |
| Optimisation | IR → better IR | data-flow analysis | |
| Code generation | IR → target code | instruction selection, register allocation | |
- Symbol table is used by all phases; front end = analysis (machine-independent), back end = synthesis
- One-pass vs multi-pass; cross compiler: runs on one machine, emits code for another

### Tokens
- Token classes: keywords, identifiers, constants, operators, string literals, punctuation (`;` `,` `(` `)` `{` `}`)
- Not tokens: whitespace, comments, preprocessor lines (handled before)
- A string literal `"..."` is one token; `a++` is 2 tokens; `>=` is 1 token
- Longest match (maximal munch) wins; among equal lengths, the rule listed first wins (keywords before identifiers)
- Lexeme = actual character sequence; pattern = rule; token = (name, attribute)

## Parsing {#parsing}

### FIRST and FOLLOW
- FIRST($a$) = $\{a\}$. For $X\to Y_1Y_2\cdots Y_k$: add FIRST($Y_1$)−{ε}; if $Y_1\Rightarrow^*\epsilon$ add FIRST($Y_2$)−{ε}, …; if all $Y_i\Rightarrow^*\epsilon$, add ε
- FOLLOW($S$) ∋ `$`. For $A\to\alpha B\beta$: FIRST($\beta$)−{ε} ⊆ FOLLOW($B$); if $\beta\Rightarrow^*\epsilon$ (or $\beta$ empty): FOLLOW($A$) ⊆ FOLLOW($B$)
- FOLLOW never contains ε; FIRST never contains `$`

### LL(1)
- Table: for $A\to\alpha$, put it in $M[A,a]$ for each $a\in$ FIRST($\alpha$); if $\epsilon\in$ FIRST($\alpha$), also in $M[A,b]$ for each $b\in$ FOLLOW($A$)
- LL(1) $\iff$ no cell has two entries $\iff$ for every $A\to\alpha\mid\beta$: FIRST($\alpha$) ∩ FIRST($\beta$) = ∅, at most one derives ε, and if $\beta\Rightarrow^*\epsilon$ then FIRST($\alpha$) ∩ FOLLOW($A$) = ∅
- LL(1) grammars are never left-recursive or ambiguous
- Left recursion $A\to A\alpha\mid\beta$ ⇒ $A\to\beta A'$, $A'\to\alpha A'\mid\epsilon$
- Left factoring $A\to\alpha\beta_1\mid\alpha\beta_2$ ⇒ $A\to\alpha A'$, $A'\to\beta_1\mid\beta_2$
- Removing left recursion and left factoring are necessary but not sufficient for LL(1)
- Recursive descent = top-down; may backtrack unless the grammar is LL(1) (predictive)

### LR parsing
- Bottom-up, shift–reduce; produces a rightmost derivation in reverse; handle = RHS to reduce next
- LR(0) item $A\to\alpha\cdot\beta$; closure adds $B\to\cdot\gamma$ for each $B$ after the dot; goto moves the dot
- $A\to X_1\cdots X_n$ has $n+1$ LR(0) items; $A\to\epsilon$ gives the single item $A\to\cdot$
- Viable prefix: a prefix of a right-sentential form that doesn't go past the handle; the LR(0) automaton recognises exactly the viable prefixes
- Reduce placement for completed item $A\to\alpha\cdot$:

| Parser | Reduce on |
|---|---|
| LR(0) | every terminal (whole row) |
| SLR(1) | FOLLOW($A$) |
| LALR(1) | merged LR(1) look-aheads |
| CLR(1) / LR(1) | the item's own look-ahead |
- Shift–reduce conflict: a state has $A\to\alpha\cdot$ and $B\to\beta\cdot a\gamma$ with $a$ in the reduce set. Reduce–reduce: two completed items with overlapping reduce sets
- LALR merges LR(1) states with the same core: #states = LR(0) = SLR ≤ CLR. Merging can create R–R conflicts, never new S–R conflicts
- Grammar power: LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ LR(1); LL(1) ⊂ LR(1) (but LL(1) ⊄ LALR(1)); every ambiguous grammar is in none of them
- Languages: LR(1) grammars generate exactly the DCFLs; LR(0) languages = DCFLs with the prefix property
- YACC / Bison build LALR(1) parsers; default conflict resolution: S–R → shift, R–R → the production listed first

### Other parsers
- Operator-precedence grammar: no ε-productions, no two adjacent non-terminals in any RHS; can handle some ambiguous grammars via precedence relations
- Precedence/associativity resolve ambiguity in expression grammars: lower precedence near the start symbol; left-associative ⇒ left-recursive rule

### Ambiguity
- Ambiguous ⇔ some string has two parse trees / leftmost derivations / rightmost derivations
- Classic: $E\to E+E\mid E*E\mid id$; dangling else
- Undecidable in general

## Syntax Directed Translation {#syntax-directed-translation}

### Attributes
- Synthesized: computed from children (and the node itself). Inherited: from parent and/or siblings
- S-attributed: only synthesized ⇒ evaluate bottom-up (postorder); fits LR parsing
- L-attributed: each inherited attribute of $X_j$ in $A\to X_1\cdots X_n$ depends only on $A$'s inherited attributes and $X_1..X_{j-1}$ ⇒ one left-to-right depth-first pass; fits LL parsing
- Every S-attributed SDD is L-attributed
- Dependency graph must be acyclic; any topological order is a valid evaluation order

### Translation schemes
- Actions embedded in productions run when the parser reaches that position (postfix SDT: actions at the end)
- Evaluate on the annotated parse tree: draw the tree, compute attributes bottom-up / left-to-right, and follow the printed output order exactly

## Intermediate Code, Runtime & Optimization {#code-generation-and-optimization}

### Intermediate representations
- Three-address code: `x = y op z`, `x = op y`, `x = y`, `goto L`, `if x relop y goto L`, `param x`, `call p, n`, `x = y[i]`, `x = *y`
- Quadruples (op, arg1, arg2, result); triples (op, arg1, arg2) — results referenced by position; indirect triples: list of pointers to triples (easy to reorder)
- SSA: every variable assigned exactly once; φ-functions at control-flow joins; count variables by giving each assignment a new name
- Syntax tree vs DAG: DAG shares common subexpressions

### Basic blocks & flow graphs
- Leaders: (1) the first instruction, (2) any target of a jump, (3) any instruction right after a jump. A block runs from a leader up to (not including) the next leader
- Flow graph edges: jump to target, fall-through to the next block
- Dominator: $d$ dom $n$ if every path from entry to $n$ passes $d$. Back edge $n\to d$ with $d$ dom $n$ ⇒ natural loop

### DAG of a basic block
- One node per distinct value; detects common subexpressions and dead code
- Minimum nodes = distinct leaves + distinct operations after reuse

### Optimisations
| Optimisation | Example |
|---|---|
| Constant folding | `2*3` → `6` |
| Constant / copy propagation | `x=5; y=x+1` → `y=6`; `y=x; z=y` → `z=x` |
| Common subexpression elimination | reuse `a+b` computed earlier |
| Dead code elimination | remove assignments never used |
| Strength reduction | `x*2` → `x+x` or `x<<1`; `i*4` in loops → running addition |
| Loop-invariant code motion | move computations out of loops |
| Induction variable elimination | replace `i` by a derived pointer |
| Loop unrolling / jamming (fusion) | fewer tests / merge loops |
| Peephole | redundant load/store, jumps to jumps, algebraic simplification, unreachable code |

### Data-flow analysis
| Analysis | Direction | Meet | Equation |
|---|---|---|---|
| Reaching definitions | forward | ∪ | $out=gen\cup(in-kill)$ |
| Live variables | backward | ∪ | $in=use\cup(out-def)$ |
| Available expressions | forward | ∩ | $out=gen\cup(in-kill)$ |
| Very busy expressions | backward | ∩ | $in=use\cup(out-kill)$ |
- Live variable: its current value may be read later before being overwritten
- Constant propagation: forward; lattice UNDEF > constant > NAC; meet of two different constants = NAC
- Min registers for straight-line code ≈ max number of simultaneously live variables (register interference graph colouring)

### Register needs for expression trees (Sethi–Ullman)
- Leaf: 1 if it is a left child, 0 if a right child (operand can be used from memory)
- Internal node with children labels $l_1,l_2$: $\max(l_1,l_2)$ if $l_1\ne l_2$, else $l_1+1$

### Runtime environment
- Activation record: actual parameters, return value, control link (caller's AR), access link (lexically enclosing AR), saved machine state, locals, temporaries
- Static allocation: no recursion, sizes known at compile time. Stack: recursion, locals. Heap: dynamic data
- Static scoping with nested procedures uses access links or a display; dynamic scoping follows control links
- Backpatching: generate jumps with empty targets, fill them in when the target is known (boolean expressions, `if`/`while`)
