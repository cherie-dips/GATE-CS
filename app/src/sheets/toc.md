## Finite Automata & Regular Languages {#finite-automata-and-regular-language}

### Automata
- DFA $(Q,\Sigma,\delta,q_0,F)$, $\delta:Q\times\Sigma\to Q$ (total). NFA: $\delta:Q\times(\Sigma\cup\{\epsilon\})\to2^Q$
- DFA = NFA = ε-NFA = regular expressions = regular grammars = 2-way DFA (all describe regular languages)
- Subset construction: an $n$-state NFA → DFA with at most $2^n$ states (reachable subsets only)
- Complement a DFA: make it complete (add a dead state), swap final and non-final. **Doesn't** work on an NFA
- Product construction ($m\times n$ states) for $L_1\cap L_2$, $L_1\cup L_2$, $L_1-L_2$

### Minimal DFA state counts
| Language over $\{a,b\}$ (or binary) | Min DFA states |
|---|---|
| $\lvert w\rvert\equiv0\pmod n$ | $n$ |
| $\#_a(w)\equiv0\pmod m$ and $\#_b(w)\equiv0\pmod n$ | $mn$ |
| Binary numbers divisible by $n$ | $\le n$ (odd $n$: exactly $n$; $n=2^k$: $k+1$) |
| Contains substring $w$, $\lvert w\rvert=k$ | $k+1$ |
| Starts with $w$, $\lvert w\rvert=k$ | $k+2$ (with dead state) |
| Ends with $w$, $\lvert w\rvert=k$ | $k+1$ |
| $k$-th symbol from the left is $a$ | $k+2$ |
| $k$-th symbol from the right is $a$ | $2^k$ (NFA: $k+1$) |
| $\lvert w\rvert\le k$ / $\lvert w\rvert=k$ / $\lvert w\rvert\ge k$ | $k+2$ / $k+2$ / $k+1$ |
- Minimisation: remove unreachable states, then merge equivalent states (partition refinement / table filling)
- Myhill–Nerode: #states of the minimal DFA = #equivalence classes of $\equiv_L$; infinitely many classes ⇒ not regular
- DFAs with $n$ states (fixed start state), $|\Sigma|=m$: $n^{nm}\cdot2^n$

### Regular expression identities
- $\emptyset^*=\epsilon$, $\epsilon^*=\epsilon$, $r\emptyset=\emptyset$, $r+\emptyset=r$, $r\epsilon=r$, $r+r=r$
- $(r^*)^*=r^*$, $r^*r^*=r^*$, $rr^*=r^*r=r^+$, $\epsilon+rr^*=r^*$, $(\epsilon+r)^*=r^*$
- $(r+s)^*=(r^*s^*)^*=(r^*+s^*)^*=(r^*s)^*r^*$
- $r(sr)^*=(rs)^*r$ (shifting)
- **Not** equal: $(r+s)^*$ vs $r^*+s^*$; $(rs)^*$ vs $r^*s^*$; $(r+s)^*$ vs $r^*s^*$
- Arden: $R=Q+RP$ with $\epsilon\notin P$ ⇒ $R=QP^*$
- Even number of $a$s: $(b^*ab^*a)^*b^*=b^*(ab^*ab^*)^*$; no two consecutive $a$s: $(b+ab)^*(\epsilon+a)$

### Regular or not?
| Regular | Not regular |
|---|---|
| any finite language | $a^nb^n$, $\{w:\#_a=\#_b\}$ |
| $a^mb^n$, $a^{2n}$, $(\#_a\bmod k)$ conditions | $ww$, $ww^R$, palindromes ($\lvert\Sigma\rvert\ge2$) |
| $\{w:\#_{ab}(w)=\#_{ba}(w)\}$ | $a^{n^2}$, $a^{2^n}$, $a^p$ ($p$ prime) |
| $a^nb^m$ with $n+m$ even | balanced parentheses |
| $\{w:\lvert w\rvert\text{ even}\}$, $(ab)^n$ | $a^nb^m$ with $n<m$ / $n\ne m$ |
| $ww$, $ww^R$ over a **unary** alphabet | $a^{n!}$ |
- Unary language is regular iff its set of lengths is ultimately periodic
- A subset or superset of a regular language may be non-regular
- Pumping lemma: if $L$ regular, $\exists p$: every $w\in L$ with $|w|\ge p$ splits $w=xyz$, $|xy|\le p$, $|y|\ge1$, $xy^iz\in L\ \forall i\ge0$ (used only to prove non-regularity)

### Decision problems (regular)
- Membership, emptiness, finiteness (no reachable cycle that leads to a final state), equivalence, inclusion, universality — all decidable
- $n$-state DFA: $L\ne\emptyset$ iff it accepts some $w$ with $|w|<n$; $L$ infinite iff it accepts some $w$ with $n\le|w|<2n$

### Mealy & Moore machines
- Moore: output on states (input of length $n$ → $n+1$ outputs); Mealy: output on transitions ($n$ outputs)
- Equivalent power; Moore → Mealy keeps states; Mealy → Moore may need up to $|Q|\times|\Delta|$ states

## PDA & Context-Free Languages {#push-down-automata-and-context-free-language}

### Grammars
- CNF: $A\to BC\mid a$ (and $S\to\epsilon$ if needed). A string of length $n\ge1$ needs exactly $2n-1$ derivation steps; parse-tree height $\ge\lceil\log_2n\rceil+1$
- GNF: $A\to a\alpha$ ($\alpha$ non-terminals): exactly $n$ steps
- Simplification order: remove ε-productions, then unit productions, then useless symbols (non-generating, then unreachable)
- Ambiguous: some string has two parse trees (equivalently two leftmost derivations). Inherently ambiguous: $\{a^ib^jc^k:i=j\text{ or }j=k\}$
- Left-linear or right-linear grammars generate exactly the regular languages (mixing both does not)

### PDA
- NPDA accepts exactly the CFLs; acceptance by final state = by empty stack (for NPDA)
- DPDA accepts DCFLs $\subsetneq$ CFLs; DPDA by empty stack accepts only prefix-free DCFLs
- $wcw^R$ is a DCFL; $ww^R$ is a CFL but not a DCFL
- Every regular language is a DCFL; every DCFL is unambiguous (has an unambiguous grammar)
- PDA with 2 stacks = Turing machine

### CFL or not?
| CFL | Not CFL |
|---|---|
| $a^nb^n$, $ww^R$, palindromes | $a^nb^nc^n$ |
| $a^nb^mc^{n+m}$, $a^nb^mc^md^n$ | $ww$ |
| $\{a^ib^jc^k:i=j\text{ or }j=k\}$ | $a^nb^mc^nd^m$ |
| $\{w:\#_a=\#_b\}$, balanced parentheses | $a^{n^2}$, $a^p$ ($p$ prime), $a^{2^n}$ |
| complement of $ww$ | $\{a^ib^jc^k:i<j<k\}$, $\{w:\#_a=\#_b=\#_c\}$ |
| $a^nb^m$, $n\ne m$ / $n\le m\le2n$ | $\{a^ib^jc^k: k=ij\}$ |
- Rule of thumb: a PDA can match **one** pair of counts in a nested (not crossing) way
- Unary CFLs are regular
- Pumping lemma (CFL): $w=uvxyz$, $|vxy|\le p$, $|vy|\ge1$, $uv^ixy^iz\in L\ \forall i\ge0$
- CYK membership $O(n^3|G|)$; emptiness and finiteness decidable

## Turing Machines & RE Languages {#recursively-enumerable-language-and-turing-machine}

### Chomsky hierarchy
| Type | Grammar | Machine | Languages |
|---|---|---|---|
| 0 | unrestricted $\alpha\to\beta$ | Turing machine | recursively enumerable |
| 1 | context-sensitive $\lvert\alpha\rvert\le\lvert\beta\rvert$ | linear-bounded automaton | context-sensitive |
| 2 | context-free $A\to\gamma$ | PDA | context-free |
| 3 | regular $A\to aB\mid a$ | finite automaton | regular |
- Regular ⊂ DCFL ⊂ CFL ⊂ CSL ⊂ Recursive ⊂ RE ⊂ all languages (all proper)

### Turing machines
- Equivalent to a TM: multi-tape, multi-track, two-way infinite tape, nondeterministic TM, 2-stack PDA, queue automaton, 2-counter machine
- Recursive (decidable): some TM halts on every input. RE: some TM accepts exactly $L$ (may loop on non-members)
- $L$ and $\bar L$ both RE ⇒ $L$ recursive. $L$ RE but not recursive ⇒ $\bar L$ not RE
- Every CSL is recursive; every recursive language is RE
- TMs are countable, languages uncountable ⇒ non-RE languages exist
- Universal language $L_u=\{\langle M,w\rangle: M\text{ accepts }w\}$: RE, not recursive; $\bar L_u$ not RE. Diagonal $L_d$: not RE

### Closure properties
| Operation | Reg | DCFL | CFL | CSL | Rec | RE |
|---|---|---|---|---|---|---|
| Union | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Intersection | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ |
| Complement | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| Concatenation | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Kleene star | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Reversal | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Homomorphism | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ |
| ε-free homomorphism | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Inverse homomorphism | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Intersection with regular | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Difference ($L_1-L_2$) | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Substitution | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ |
- CFL − regular is CFL; regular − CFL need not be
- Regular languages are also closed under prefix, suffix, substring, quotient $L/R$ (any $R$) and half($L$)
- $L_1$ recursive, $L_2$ RE: $L_1\cup L_2$, $L_1\cap L_2$, $L_2-L_1$ are RE; $L_1-L_2$ is only co-RE
- Finite unions / intersections of regular languages are regular; infinite ones need not be
- Union of a CFL and a non-CFL can be anything; check each case

## Decidability {#undecidability}

### Decidability table (D = decidable, U = undecidable)
| Problem | Reg | DCFL | CFL | CSL | Rec | RE |
|---|---|---|---|---|---|---|
| Membership $w\in L$ | D | D | D | D | D | U |
| Emptiness $L=\emptyset$ | D | D | D | U | U | U |
| Finiteness | D | D | D | U | U | U |
| Universality $L=\Sigma^*$ | D | D | U | U | U | U |
| Equivalence $L_1=L_2$ | D | D | U | U | U | U |
| Inclusion $L_1\subseteq L_2$ | D | U | U | U | U | U |
| Disjointness $L_1\cap L_2=\emptyset$ | D | U | U | U | U | U |
| Is $L$ regular? | D | D | U | U | U | U |
- CFG ambiguity: undecidable. Is a CFL's complement a CFL? undecidable. Is $L(G_1)\cap L(G_2)$ a CFL? undecidable

### Rice's theorem
- Every non-trivial property of the **language** of a TM (true for some RE languages, false for others) is undecidable
- Does not apply to properties of the machine itself ("has 5 states", "moves left at some step" may be decidable) or to running $\le k$ steps
- If a property is not monotone (some $L\in P$ has a superset $L'\notin P$), it is not even RE (Rice–Shapiro)

### Reductions ($A\le B$)
- $B$ decidable ⇒ $A$ decidable; $A$ undecidable ⇒ $B$ undecidable
- $B$ RE ⇒ $A$ RE; $A$ not RE ⇒ $B$ not RE

### Classic results
| Problem | Status |
|---|---|
| Halting $\{\langle M,w\rangle: M\text{ halts on }w\}$ | RE, undecidable; complement not RE |
| $M$ halts on blank tape / accepts $\epsilon$ / accepts some string | RE, undecidable |
| $L(M)=\emptyset$ | co-RE, not RE |
| $L(M)$ is finite / regular / $=\Sigma^*$ / total (halts on all inputs) | neither RE nor co-RE |
| $M$ runs more than $k$ steps on $w$ | decidable |
| PCP (Post correspondence) | undecidable; decidable over a unary alphabet |
| Does a DFA / CFG generate a given string? | decidable |
- Semi-decidable = RE; co-RE = complement is RE; decidable = RE ∩ co-RE
