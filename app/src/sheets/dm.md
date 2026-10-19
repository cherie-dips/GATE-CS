## Mathematical Logic {#mathematical-logic}

### Connectives
| $p$ | $q$ | $p\land q$ | $p\lor q$ | $p\to q$ | $p\leftrightarrow q$ | $p\oplus q$ |
|---|---|---|---|---|---|---|
| T | T | T | T | T | T | F |
| T | F | F | T | F | F | T |
| F | T | F | T | T | F | T |
| F | F | F | F | T | T | F |
- $p\to q$ is false **only** when $p$ = T, $q$ = F ("if F then anything" is true)
- Read as $p\to q$: "if $p$ then $q$", "$p$ only if $q$", "$q$ if $p$", "$q$ is necessary for $p$", "$p$ is sufficient for $q$", "$q$ unless $\lnot p$"

### Equivalences
- $p\to q \equiv \lnot p\lor q \equiv \lnot q\to\lnot p$ (contrapositive)
- $\lnot(p\to q)\equiv p\land\lnot q$
- $p\leftrightarrow q\equiv(p\to q)\land(q\to p)\equiv(p\land q)\lor(\lnot p\land\lnot q)\equiv\lnot(p\oplus q)$
- De Morgan: $\lnot(p\land q)\equiv\lnot p\lor\lnot q$, $\lnot(p\lor q)\equiv\lnot p\land\lnot q$
- Absorption: $p\lor(p\land q)\equiv p$, $p\land(p\lor q)\equiv p$
- Exportation: $p\to(q\to r)\equiv(p\land q)\to r$
- $(p\to q)\land(p\to r)\equiv p\to(q\land r)$; $(p\to r)\land(q\to r)\equiv(p\lor q)\to r$
- $(p\to q)\lor(p\to r)\equiv p\to(q\lor r)$; $(p\to r)\lor(q\to r)\equiv(p\land q)\to r$
- $\to$ is **not** associative: $(p\to q)\to r\not\equiv p\to(q\to r)$
- Converse $q\to p$ ≡ inverse $\lnot p\to\lnot q$; neither is equivalent to $p\to q$

### Tautology, satisfiability, validity
- Tautology (valid): true in every row. Contradiction: false in every row. Satisfiable: true in some row
- $F$ valid $\iff\lnot F$ unsatisfiable
- Argument $P_1,\dots,P_n\vdash C$ is valid $\iff(P_1\land\cdots\land P_n)\to C$ is a tautology
- $n$ variables: $2^n$ rows, $2^{2^n}$ distinct Boolean functions

### Rules of inference
| Rule | Premises | Conclusion |
|---|---|---|
| Modus ponens | $p,\ p\to q$ | $q$ |
| Modus tollens | $\lnot q,\ p\to q$ | $\lnot p$ |
| Hypothetical syllogism | $p\to q,\ q\to r$ | $p\to r$ |
| Disjunctive syllogism | $p\lor q,\ \lnot p$ | $q$ |
| Resolution | $p\lor q,\ \lnot p\lor r$ | $q\lor r$ |
| Addition / Simplification | $p$ / $p\land q$ | $p\lor q$ / $p$ |
- Fallacies: affirming the consequent ($q,\ p\to q\ \vdash p$), denying the antecedent ($\lnot p,\ p\to q\ \vdash\lnot q$)

### Functional completeness
- Complete: $\{\lnot,\land\}$, $\{\lnot,\lor\}$, $\{\lnot,\to\}$, $\{\to,F\}$, {NAND}, {NOR}
- Not complete: $\{\land,\lor\}$, $\{\land,\lor,\to,\leftrightarrow\}$ (no way to get F from all-T), $\{\oplus,\leftrightarrow\}$, $\{\lnot,\leftrightarrow\}$

### Predicate logic
- $\lnot\forall x\,P(x)\equiv\exists x\,\lnot P(x)$, $\lnot\exists x\,P(x)\equiv\forall x\,\lnot P(x)$
- $\forall$ distributes over $\land$; $\exists$ distributes over $\lor$:
  $\forall x(P\land Q)\equiv\forall xP\land\forall xQ$, $\exists x(P\lor Q)\equiv\exists xP\lor\exists xQ$
- One way only: $\forall xP\lor\forall xQ\Rightarrow\forall x(P\lor Q)$; $\exists x(P\land Q)\Rightarrow\exists xP\land\exists xQ$
- $\exists x\,\forall y\,P(x,y)\Rightarrow\forall y\,\exists x\,P(x,y)$ (not conversely); same quantifiers swap freely
- $x$ not free in $Q$: $\forall x(P(x)\to Q)\equiv\exists xP(x)\to Q$, $\exists x(P(x)\to Q)\equiv\forall xP(x)\to Q$, $\forall x(Q\to P(x))\equiv Q\to\forall xP(x)$
- "All $A$ are $B$": $\forall x(A(x)\to B(x))$; "Some $A$ are $B$": $\exists x(A(x)\land B(x))$
- "No $A$ is $B$": $\forall x(A(x)\to\lnot B(x))$; "Not all $A$ are $B$": $\exists x(A(x)\land\lnot B(x))$
- Trap: $\exists x(A(x)\to B(x))$ is almost always true — wrong translation of "some"

## Set Theory & Algebra {#set-theory-and-algebra}

### Sets
- $|P(A)|=2^n$, $|A\times B|=|A||B|$
- $|A\cup B|=|A|+|B|-|A\cap B|$; three sets: $\sum|A|-\sum|A\cap B|+|A\cap B\cap C|$
- $A\oplus B=(A-B)\cup(B-A)$, $|A\oplus B|=|A|+|B|-2|A\cap B|$
- Countable: $\mathbb N,\mathbb Z,\mathbb Q$, $\Sigma^*$, set of all programs/TMs, finite subsets of $\mathbb N$
- Uncountable: $\mathbb R$, $P(\mathbb N)$, all functions $\mathbb N\to\{0,1\}$, all languages over $\Sigma$

### Relation properties ($R$ on set $A$)
| Property | Definition | Matrix / digraph |
|---|---|---|
| Reflexive | $(a,a)\in R\ \forall a$ | all diagonal 1 |
| Irreflexive | $(a,a)\notin R\ \forall a$ | all diagonal 0 |
| Symmetric | $aRb\Rightarrow bRa$ | $M=M^T$ |
| Antisymmetric | $aRb\land bRa\Rightarrow a=b$ | no 2-way pair off diagonal |
| Asymmetric | $aRb\Rightarrow\lnot bRa$ | antisymmetric + irreflexive |
| Transitive | $aRb\land bRc\Rightarrow aRc$ | $M^2\le M$ (Boolean) |
- Empty relation on non-empty $A$: symmetric, antisymmetric, transitive, irreflexive; **not** reflexive
- Intersection preserves all of reflexive, symmetric, antisymmetric, transitive. Union does **not** preserve transitivity (nor antisymmetry)
- Union of two equivalence relations need not be one; intersection always is

### Counting relations on an $n$-element set
| Relations that are | Count |
|---|---|
| All | $2^{n^2}$ |
| Reflexive (or irreflexive) | $2^{n(n-1)}$ |
| Symmetric | $2^{n(n+1)/2}$ |
| Antisymmetric | $2^n\cdot3^{n(n-1)/2}$ |
| Asymmetric | $3^{n(n-1)/2}$ |
| Reflexive and symmetric | $2^{n(n-1)/2}$ |
| Reflexive and antisymmetric | $3^{n(n-1)/2}$ |
| Both symmetric and antisymmetric | $2^n$ |
| Equivalence relations | Bell $B_n$: 1, 1, 2, 5, 15, 52, 203, 877 ($n=0..7$) |
- Equivalence relation (reflexive, symmetric, transitive) ↔ partition into classes

### Functions ($|A|=m$ to $|B|=n$)
| Functions | Count |
|---|---|
| All | $n^m$ |
| One-one (needs $m\le n$) | $n!/(n-m)!$ |
| Onto (needs $m\ge n$) | $\sum_{k=0}^{n}(-1)^k\binom nk(n-k)^m = n!\,S(m,n)$ |
| Bijections ($m=n$) | $n!$ |
| Partial functions | $(n+1)^m$ |
- Onto $m\to2$: $2^m-2$; onto $m\to3$: $3^m-3\cdot2^m+3$
- $g\circ f$ one-one ⇒ $f$ one-one; $g\circ f$ onto ⇒ $g$ onto. Inverse exists $\iff$ bijective
- Finite $A$, $f:A\to A$: one-one $\iff$ onto

### Posets & lattices
- Poset: reflexive, antisymmetric, transitive. Hasse diagram omits loops and transitive edges
- Lattice: every pair has a LUB (join $\lor$) and GLB (meet $\land$). Every finite lattice is bounded
- Complement of $a$: $a\lor b=1$, $a\land b=0$
- Distributive $\iff$ no sublattice isomorphic to the diamond $M_3$ or pentagon $N_5$; in a distributive lattice complements are unique (if they exist)
- Boolean algebra = complemented + distributive lattice; has $2^k$ elements
- Divisors of $n$ under divisibility $D_n$: always distributive; Boolean $\iff n$ square-free
- Every chain (total order) is a distributive lattice; $(P(S),\subseteq)$ is Boolean

### Algebraic structures
| Structure | Closure | Associative | Identity | Inverse | Commutative |
|---|---|---|---|---|---|
| Semigroup | ✓ | ✓ | | | |
| Monoid | ✓ | ✓ | ✓ | | |
| Group | ✓ | ✓ | ✓ | ✓ | |
| Abelian group | ✓ | ✓ | ✓ | ✓ | ✓ |
- Identity and inverses are unique; $(ab)^{-1}=b^{-1}a^{-1}$; cancellation laws hold
- Every element its own inverse ($a^2=e$) ⇒ abelian. Groups of order $\le5$ are abelian
- Binary operations on an $n$-set: $n^{n^2}$; commutative: $n^{n(n+1)/2}$
- $(\mathbb Z_n,+_n)$ is a group; $(\mathbb Z_n^*,\times_n)$ (units) is a group of order $\varphi(n)$; $\{1..p-1\}$ under $\times_p$ is a group for prime $p$

### Groups, subgroups, cyclic groups
- Lagrange: order of a subgroup (and of any element) divides $|G|$; $a^{|G|}=e$
- Prime order ⇒ cyclic ⇒ abelian
- Cyclic group $\langle a\rangle$ of order $n$: $\varphi(n)$ generators; exactly one subgroup of each order $d\mid n$; $a^k$ has order $n/\gcd(n,k)$
- Subgroup test: $H\ne\emptyset$ and $a,b\in H\Rightarrow ab^{-1}\in H$; finite $H$: closure alone suffices
- Intersection of subgroups is a subgroup; union is one only if one contains the other
- $\varphi(n)=n\prod_{p\mid n}(1-\frac1p)$; $\varphi(p^k)=p^k-p^{k-1}$

## Combinatorics {#combinatorics}

### Arrangements & selections
| | Order matters | Order doesn't matter |
|---|---|---|
| No repetition | $P(n,r)=\frac{n!}{(n-r)!}$ | $\binom nr=\frac{n!}{r!(n-r)!}$ |
| Repetition allowed | $n^r$ | $\binom{n+r-1}{r}$ |
- Permutations of a multiset: $\frac{n!}{n_1!\,n_2!\cdots n_k!}$
- Circular: $(n-1)!$; necklace / garland (flip allowed): $\frac{(n-1)!}2$
- Lattice paths $(0,0)\to(m,n)$ with right/up steps: $\binom{m+n}n$

### Distributing objects
| $r$ objects into $n$ boxes | Any | Each box $\ge1$ |
|---|---|---|
| Identical → distinct | $\binom{n+r-1}{n-1}$ | $\binom{r-1}{n-1}$ |
| Distinct → distinct | $n^r$ | $n!\,S(r,n)$ |
| Distinct → identical | $\sum_{k\le n}S(r,k)$ | $S(r,n)$ |
| Identical → identical | partitions of $r$ into $\le n$ parts | partitions into exactly $n$ parts |
- Non-negative integer solutions of $x_1+\cdots+x_n=r$: $\binom{n+r-1}{n-1}$; with $x_i\ge a_i$, substitute $y_i=x_i-a_i$

### Binomial identities
- $\binom nr=\binom n{n-r}$, Pascal $\binom nr=\binom{n-1}r+\binom{n-1}{r-1}$
- $\sum_r\binom nr=2^n$, $\sum_{r\text{ even}}\binom nr=\sum_{r\text{ odd}}\binom nr=2^{n-1}$, $\sum_r r\binom nr=n2^{n-1}$
- Vandermonde $\sum_k\binom mk\binom n{r-k}=\binom{m+n}r$; $\sum_k\binom nk^2=\binom{2n}n$
- Hockey stick $\sum_{i=r}^n\binom ir=\binom{n+1}{r+1}$
- Coefficient of $x^r$ in $(1+x)^n$ is $\binom nr$

### Special numbers
| Sequence | Formula | Values | Counts |
|---|---|---|---|
| Catalan $C_n$ | $\frac1{n+1}\binom{2n}n$ | 1, 1, 2, 5, 14, 42, 132, 429, 1430 | binary trees / BSTs with $n$ nodes, balanced parentheses ($n$ pairs), stack permutations of $n$, triangulations of an $(n+2)$-gon, Dyck paths |
| Derangements $D_n$ | $n!\sum_{k=0}^n\frac{(-1)^k}{k!}\approx\frac{n!}e$ | 1, 0, 1, 2, 9, 44, 265, 1854 | permutations with no fixed point |
| Stirling 2nd kind $S(n,k)$ | $kS(n{-}1,k)+S(n{-}1,k{-}1)$ | $S(n,2)=2^{n-1}-1$, $S(n,n-1)=\binom n2$ | partitions of $n$ items into $k$ non-empty blocks |
| Bell $B_n$ | $\sum_kS(n,k)$ | 1, 1, 2, 5, 15, 52, 203 | all partitions / equivalence relations |
| Fibonacci | $F_n=F_{n-1}+F_{n-2}$ | 1, 1, 2, 3, 5, 8, 13, 21 | $n$-bit strings with no "11": $F_{n+2}$ |
- $D_n=(n-1)(D_{n-1}+D_{n-2})$; exactly $k$ fixed points: $\binom nkD_{n-k}$

### Pigeonhole & inclusion–exclusion
- $n$ items in $k$ boxes ⇒ some box has $\ge\lceil n/k\rceil$
- To guarantee $r$ of one kind among $k$ kinds: $k(r-1)+1$ items
- $|\overline{A_1}\cap\cdots\cap\overline{A_n}|=N-\sum|A_i|+\sum|A_i\cap A_j|-\cdots$
- Numbers in $1..N$ divisible by $a$ or $b$: $\lfloor\frac Na\rfloor+\lfloor\frac Nb\rfloor-\lfloor\frac N{\operatorname{lcm}(a,b)}\rfloor$

### Recurrence relations
- Linear homogeneous $a_n=c_1a_{n-1}+c_2a_{n-2}$: roots of $r^2=c_1r+c_2$
  - distinct $r_1,r_2$: $a_n=Ar_1^n+Br_2^n$; repeated $r$: $a_n=(A+Bn)r^n$
- Non-homogeneous $a_n=c\,a_{n-1}+f(n)$: total = homogeneous + particular
  - $f(n)=k$ → try constant; $f(n)=$ polynomial degree $d$ → polynomial degree $d$; $f(n)=k\,b^n$ → $Cb^n$; multiply the trial by $n^s$ if $b$ (take $b=1$ for constant/polynomial $f$) is a characteristic root of multiplicity $s$
- $a_n=a_{n-1}+n\Rightarrow a_n=a_0+\frac{n(n+1)}2$; $a_n=2a_{n-1}+1,\ a_0=0\Rightarrow 2^n-1$ (Tower of Hanoi)

### Generating functions
| Sequence $a_n$ | $G(x)=\sum a_nx^n$ |
|---|---|
| $1$ | $\frac1{1-x}$ |
| $c^n$ | $\frac1{1-cx}$ |
| $n+1$ | $\frac1{(1-x)^2}$ |
| $n$ | $\frac x{(1-x)^2}$ |
| $\binom{n+k-1}{k-1}$ | $\frac1{(1-x)^k}$ |
| $\binom kn$ | $(1+x)^k$ |
| $1$ for $n\le k$, else 0 | $\frac{1-x^{k+1}}{1-x}$ |
- Product of GFs ↔ convolution; $x^kG(x)$ shifts right by $k$

## Graph Theory {#graph-theory}

### Degrees & edge counts
- Handshake: $\sum\deg v=2e$; number of odd-degree vertices is even
- $k$-regular on $n$ vertices: $e=nk/2$ (needs $nk$ even)
- $K_n$: $\binom n2$ edges, $(n-1)$-regular. $K_{m,n}$: $mn$ edges. Cycle $C_n$: $n$ edges. Wheel $W_n$ ($n$-cycle + hub): $2n$ edges
- Hypercube $Q_n$: $2^n$ vertices, $n2^{n-1}$ edges, bipartite
- Max edges in a bipartite graph on $n$ vertices: $\lfloor n^2/4\rfloor$
- Labelled simple graphs on $n$ vertices: $2^{\binom n2}$
- Complement: $e(G)+e(\bar G)=\binom n2$; self-complementary needs $n\equiv0$ or $1\pmod4$, with $\binom n2/2$ edges
- Degree sequence realizable? Havel–Hakimi: drop the largest $d$, subtract 1 from the next $d$, repeat

### Connectivity
- Connected $\Rightarrow e\ge n-1$; simple graph with $e>\binom{n-1}2$ ⇒ connected
- $k$ components, simple: $n-k\le e\le\binom{n-k+1}2$
- $\kappa(G)\le\lambda(G)\le\delta(G)$ (vertex connectivity ≤ edge connectivity ≤ min degree)
- Cut vertex: removal increases components. Bridge: edge in no cycle
- Adjacency matrix: $(A^k)_{ij}$ = walks of length $k$ from $i$ to $j$; triangles $=\operatorname{tr}(A^3)/6$

### Trees
- Tree on $n$ vertices: connected, acyclic, exactly $n-1$ edges (any two imply the third); unique path between any two vertices
- Forest with $k$ trees: $n-k$ edges. Tree with $n\ge2$ has $\ge2$ leaves
- Labelled trees on $n$ vertices (spanning trees of $K_n$): $n^{n-2}$ (Cayley). $K_{m,n}$: $m^{n-1}n^{m-1}$
- Spanning trees of $C_n$: $n$. Any graph: Kirchhoff (any cofactor of $D-A$)
- Edges to delete from a connected graph to get a spanning tree (cyclomatic number): $e-n+1$

### Euler & Hamilton
- Euler circuit $\iff$ connected (ignoring isolated vertices) and every degree even
- Euler path (not circuit) $\iff$ connected and exactly 2 odd vertices (path joins them)
- Directed Euler circuit: in-degree = out-degree everywhere, strongly connected
- Hamiltonian: no simple test. Sufficient: Dirac $\deg v\ge n/2$; Ore $\deg u+\deg v\ge n$ for non-adjacent $u,v$ ($n\ge3$)
- Hamiltonian cycles in $K_n$: $\frac{(n-1)!}2$; $K_{m,n}$ Hamiltonian $\iff m=n\ge2$

### Planar graphs
- Euler: $v-e+f=2$ (connected); $v-e+f=1+k$ for $k$ components
- Simple planar ($v\ge3$): $e\le3v-6$; no triangles (e.g. bipartite): $e\le2v-4$
- Connected planar graph with girth $g$: $e\le\frac{g(v-2)}{g-2}$
- $\sum$ face degrees $=2e$; every simple planar graph has a vertex of degree $\le5$
- $K_5$ and $K_{3,3}$ are non-planar; Kuratowski: planar $\iff$ no subdivision of either
- $K_n$ planar $\iff n\le4$; $K_{m,n}$ planar $\iff\min(m,n)\le2$

### Colouring
| Graph | $\chi$ (vertex) |
|---|---|
| $K_n$ | $n$ |
| Bipartite (≥1 edge), tree ($n\ge2$), even cycle | 2 |
| Odd cycle | 3 |
| Wheel $W_n$ | 3 if $n$ even, 4 if $n$ odd |
| Planar | $\le4$ |
- $\chi\ge\omega$ (largest clique), $\chi\ge n/\alpha$, $\chi\le\Delta+1$
- Chromatic polynomial: $K_n$: $k(k-1)\cdots(k-n+1)$; tree: $k(k-1)^{n-1}$; $C_n$: $(k-1)^n+(-1)^n(k-1)$
- Edge chromatic number (Vizing): $\Delta$ or $\Delta+1$; bipartite: $\Delta$; $K_n$: $n-1$ ($n$ even), $n$ ($n$ odd)

### Matching, covers, independent sets
- $\alpha$ = max independent set, $\beta$ = min vertex cover: $\alpha+\beta=n$
- $\nu$ = max matching, $\rho$ = min edge cover (no isolated vertices): $\nu+\rho=n$
- König (bipartite): $\nu=\beta$. Always $\nu\le\beta\le2\nu$
- Perfect matchings: $K_{2n}$: $\frac{(2n)!}{2^nn!}=(2n-1)(2n-3)\cdots1$; $K_{n,n}$: $n!$
- $\alpha(K_n)=1$, $\alpha(C_n)=\lfloor n/2\rfloor$, $\alpha(K_{m,n})=\max(m,n)$

### Isomorphism
- Necessary (not sufficient): same $n$, $e$, degree sequence, cycle lengths, number of components
- Unlabelled graphs on 1, 2, 3, 4 vertices: 1, 2, 4, 11
