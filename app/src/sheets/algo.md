## Asymptotic Analysis & Recurrences {#complexity-analysis-and-asymptotic-notations}

### Notation
| Notation | Meaning | Analogy |
|---|---|---|
| $f=O(g)$ | $f\le c\,g$ eventually | $\le$ |
| $f=\Omega(g)$ | $f\ge c\,g$ eventually | $\ge$ |
| $f=\Theta(g)$ | both | $=$ |
| $f=o(g)$ | $f/g\to0$ | $<$ |
| $f=\omega(g)$ | $f/g\to\infty$ | $>$ |
- Transitive; $f=O(g)\iff g=\Omega(f)$; $O(f)+O(g)=O(\max(f,g))$
- Not every pair is comparable (e.g. $n$ and $n^{1+\sin n}$)

### Growth order
- $1<\log\log n<\log n<\log^kn<n^\epsilon<n<n\log n<n^2<n^k<2^n<3^n<n!<n^n$
- $\log(n!)=\Theta(n\log n)$; $n!=o(n^n)$, $n!=\omega(2^n)$; $2^{n+1}=\Theta(2^n)$ but $2^{2n}=4^n\ne O(2^n)$
- $\log_an=\Theta(\log_bn)$ (bases don't matter inside $\Theta$); $n^{1/\log n}=2$; $2^{\log_2n}=n$; $a^{\log_bc}=c^{\log_ba}$
- Compare tricky pairs by taking $\log$ of both: e.g. $n^{\log n}$ vs $2^{\sqrt n}$ → $\log^2n$ vs $\sqrt n$ ⇒ $2^{\sqrt n}$ grows faster
- Stirling: $n!\approx\sqrt{2\pi n}\,(n/e)^n$

### Summations
- $\sum_{i=1}^ni=\frac{n(n+1)}2$, $\sum i^2=\frac{n(n+1)(2n+1)}6$, $\sum i^3=\left(\frac{n(n+1)}2\right)^2$, $\sum i^k=\Theta(n^{k+1})$
- Harmonic $\sum_{i=1}^n\frac1i=\ln n+O(1)=\Theta(\log n)$; $\sum_{i=1}^n\log i=\Theta(n\log n)$
- Geometric $\sum_{i=0}^nr^i=\frac{r^{n+1}-1}{r-1}$: $\Theta(1)$ if $r<1$, $\Theta(n)$ if $r=1$, $\Theta(r^n)$ if $r>1$
- $\sum_{i\ge0}i\,x^i=\frac x{(1-x)^2}$ ($|x|<1$); $\sum_{i=1}^ni\,2^i=(n-1)2^{n+1}+2$
- Loops: `for (i=1; i<n; i*=2)` runs $\lceil\log_2n\rceil$ times; `i=i*i` from 2 runs $\Theta(\log\log n)$; inner loop $j$ from $1..i$ gives $\sum i$

### Master theorem
$T(n)=aT(n/b)+f(n)$, $a\ge1$, $b>1$; compare $f$ with $n^{\log_ba}$:

| Case | Condition | $T(n)$ |
|---|---|---|
| 1 | $f=O(n^{\log_ba-\epsilon})$ | $\Theta(n^{\log_ba})$ |
| 2 | $f=\Theta(n^{\log_ba}\log^kn)$, $k\ge0$ | $\Theta(n^{\log_ba}\log^{k+1}n)$ |
| 2′ | $k=-1$ | $\Theta(n^{\log_ba}\log\log n)$ |
| 2″ | $k<-1$ | $\Theta(n^{\log_ba})$ |
| 3 | $f=\Omega(n^{\log_ba+\epsilon})$ and $af(n/b)\le cf(n)$, $c<1$ | $\Theta(f(n))$ |
- Subtract-and-conquer $T(n)=aT(n-b)+f(n)$ with $f=O(n^k)$: $a<1$: $O(n^k)$; $a=1$: $O(n^{k+1})$; $a>1$: $O(n^ka^{n/b})$
- Unequal splits: $T(n)=T(\alpha n)+T(\beta n)+n$ is $\Theta(n)$ if $\alpha+\beta<1$, $\Theta(n\log n)$ if $\alpha+\beta=1$
- Change of variable: $n=2^m$ for $T(\sqrt n)$ recurrences

### Common recurrences
| Recurrence | Solution | Example |
|---|---|---|
| $T(n-1)+1$ | $\Theta(n)$ | linear recursion |
| $T(n-1)+n$ | $\Theta(n^2)$ | quicksort worst, selection sort |
| $T(n-1)+\log n$ | $\Theta(n\log n)$ | |
| $2T(n-1)+1$ | $\Theta(2^n)$ | Tower of Hanoi ($2^n-1$ moves) |
| $T(n-1)+T(n-2)+1$ | $\Theta(\phi^n)$, $\phi\approx1.618$ | naive Fibonacci |
| $T(n/2)+1$ | $\Theta(\log n)$ | binary search |
| $T(n/2)+n$ | $\Theta(n)$ | |
| $2T(n/2)+1$ | $\Theta(n)$ | tree traversal |
| $2T(n/2)+n$ | $\Theta(n\log n)$ | merge sort |
| $2T(n/2)+n\log n$ | $\Theta(n\log^2n)$ | |
| $2T(n/2)+n/\log n$ | $\Theta(n\log\log n)$ | |
| $3T(n/2)+n$ | $\Theta(n^{\log_23})\approx n^{1.585}$ | Karatsuba |
| $4T(n/2)+n^2$ | $\Theta(n^2\log n)$ | |
| $7T(n/2)+n^2$ | $\Theta(n^{\log_27})\approx n^{2.81}$ | Strassen |
| $8T(n/2)+n^2$ | $\Theta(n^3)$ | naive D&C matrix multiply |
| $T(\sqrt n)+1$ | $\Theta(\log\log n)$ | |
| $2T(\sqrt n)+1$ | $\Theta(\log n)$ | |
| $2T(\sqrt n)+\log n$ | $\Theta(\log n\log\log n)$ | |
| $\sqrt n\,T(\sqrt n)+n$ | $\Theta(n\log\log n)$ | |
| $T(n/5)+T(7n/10)+n$ | $\Theta(n)$ | median of medians |
| $T(n/3)+T(2n/3)+n$ | $\Theta(n\log n)$ | |

## Searching & Sorting {#searching-and-sorting}

### Sorting algorithms
| Algorithm | Best | Average | Worst | Stable | In-place |
|---|---|---|---|---|---|
| Bubble (with swap flag) | $n$ | $n^2$ | $n^2$ | ✓ | ✓ |
| Selection | $n^2$ | $n^2$ | $n^2$ | ✗ | ✓ |
| Insertion | $n$ | $n^2$ | $n^2$ | ✓ | ✓ |
| Merge | $n\log n$ | $n\log n$ | $n\log n$ | ✓ | ✗ ($O(n)$ extra) |
| Quick | $n\log n$ | $n\log n$ | $n^2$ | ✗ | ✓ ($O(\log n)$ stack avg) |
| Heap | $n\log n$ | $n\log n$ | $n\log n$ | ✗ | ✓ |
| Counting | $n+k$ | $n+k$ | $n+k$ | ✓ | ✗ |
| Radix ($d$ digits, base $k$) | $d(n+k)$ | $d(n+k)$ | $d(n+k)$ | ✓ | ✗ |
| Bucket | $n$ | $n$ | $n^2$ | ✓ | ✗ |

### Sorting facts
- Comparison sorts need $\lceil\log_2n!\rceil=\Omega(n\log n)$ comparisons in the worst case
- Selection sort: at most $n-1$ swaps (fewest swaps); insertion sort: shifts = number of inversions, best for nearly sorted input
- Bubble sort: number of swaps = number of inversions; passes = until no swap
- Exact comparisons: selection always $\frac{n(n-1)}2$; insertion best $n-1$, worst $\frac{n(n-1)}2$; bubble without flag always $\frac{n(n-1)}2$
- Merge sort comparisons ($n=2^k$): best $\frac n2\log_2n$, worst $n\log_2n-n+1$
- Randomised quicksort: expected comparisons $\approx2n\ln n\approx1.39\,n\log_2n$; recursion depth worst $n-1$
- Quicksort worst case: sorted / reverse-sorted input with first or last element as pivot (also all-equal with Lomuto); worst comparisons $\frac{n(n-1)}2$; any constant-ratio split is still $O(n\log n)$
- Merging sorted lists of sizes $m,n$: worst $m+n-1$ comparisons, best $\min(m,n)$
- Merge $k$ sorted lists ($n$ total) with a min-heap: $O(n\log k)$
- Count inversions: merge sort, $O(n\log n)$
- Max inversions in an array of $n$: $\frac{n(n-1)}2$ (reverse sorted)

### Searching
- Linear $O(n)$; binary search $O(\log n)$, at most $\lfloor\log_2n\rfloor+1$ comparisons (sorted array only)
- Interpolation search: $O(\log\log n)$ average on uniform data, $O(n)$ worst
- Binary search on a linked list: $O(n)$

### Selection & comparison counts
| Task | Comparisons |
|---|---|
| Max (or min) | $n-1$ |
| Max and min together | $\lceil3n/2\rceil-2$ |
| Second largest | $n+\lceil\log_2n\rceil-2$ |
| $k$-th smallest | $O(n)$ worst (median of medians), quickselect $O(n)$ avg / $O(n^2)$ worst |
| Median of 5 | 6 |

## Divide & Conquer {#divide-and-conquer-method}

### Classic algorithms
| Problem | Recurrence | Time |
|---|---|---|
| Binary search | $T(n/2)+1$ | $O(\log n)$ |
| Merge sort | $2T(n/2)+n$ | $O(n\log n)$ |
| Quicksort (balanced) | $2T(n/2)+n$ | $O(n\log n)$ |
| Max–min | $2T(n/2)+2$ | $\frac{3n}2-2$ comparisons |
| Power $a^n$ | $T(n/2)+1$ | $O(\log n)$ multiplications |
| Karatsuba multiplication | $3T(n/2)+n$ | $O(n^{1.585})$ |
| Strassen matrix multiply | $7T(n/2)+n^2$ | $O(n^{2.81})$ |
| Closest pair of points | $2T(n/2)+n$ | $O(n\log n)$ |
| Max subarray (D&C) | $2T(n/2)+n$ | $O(n\log n)$ ($O(n)$ with Kadane) |
- D&C: subproblems are independent (vs DP: overlapping)

## Greedy Algorithms, MST & Shortest Paths {#greedy-method}

### Greedy problems
| Problem | Greedy rule | Time |
|---|---|---|
| Activity selection | earliest finish time first | $O(n\log n)$ |
| Fractional knapsack | highest value/weight first | $O(n\log n)$ |
| Huffman coding | merge two least frequent | $O(n\log n)$ |
| Optimal merge pattern | merge two smallest files | $O(n\log n)$ |
| Job sequencing with deadlines | highest profit first, latest free slot ≤ deadline | $O(n^2)$ / $O(n\log n)$ with DSU |
- Greedy fails for 0/1 knapsack, general coin change, longest path
- Huffman: $n-1$ merges; cost $=\sum f_i\,\text{depth}_i$ = sum of all internal node weights; average code length $=\frac{\sum f_il_i}{\sum f_i}$

### Minimum spanning tree
| Algorithm | Time |
|---|---|
| Kruskal (sort + union–find) | $O(E\log E)=O(E\log V)$ |
| Prim, binary heap | $O(E\log V)$ |
| Prim, adjacency matrix / array | $O(V^2)$ |
| Prim, Fibonacci heap | $O(E+V\log V)$ |
- MST has $V-1$ edges. Distinct weights ⇒ unique MST
- Cut property: the lightest edge crossing any cut is in some MST (in every MST if it is the unique lightest)
- Cycle property: the unique heaviest edge on a cycle is in no MST
- The lightest edge is always in some MST; with distinct weights, the 2nd lightest is too (the 3rd may not be)
- Adding a constant to all weights or applying any increasing function (e.g. squaring positive weights) keeps the MST
- MST minimises the maximum edge (bottleneck); the MST path between $u,v$ is a minimax path
- Kruskal can produce a forest midway; Prim always keeps one tree

### Shortest paths
| Algorithm | Graph | Time |
|---|---|---|
| BFS | unweighted | $O(V+E)$ |
| Dijkstra, binary heap | non-negative weights | $O((V+E)\log V)$ |
| Dijkstra, array | non-negative weights | $O(V^2)$ |
| Dijkstra, Fibonacci heap | non-negative weights | $O(E+V\log V)$ |
| Bellman–Ford | negative edges OK; detects negative cycles | $O(VE)$ |
| DAG (topological order relax) | DAG, any weights | $O(V+E)$ |
| Floyd–Warshall | all pairs, no negative cycles | $O(V^3)$ |
| Johnson | all pairs, sparse | $O(VE\log V)$ |
- Dijkstra can give wrong answers with negative edges (even without negative cycles)
- Bellman–Ford: $V-1$ rounds of relaxing every edge; an update in round $V$ ⇒ negative cycle
- Floyd–Warshall detects a negative cycle iff some $d[i][i]<0$ at the end
- Multiplying all weights by a positive constant keeps shortest paths; **adding** a constant does not (it favours fewer edges)
- Shortest-path tree ≠ MST in general

## Dynamic Programming {#dynamic-programming}

### When to use
- DP: optimal substructure + overlapping subproblems. Greedy: optimal substructure + greedy-choice property
- Memoisation (top-down) vs tabulation (bottom-up); time = #subproblems × time per subproblem

### Classic problems
| Problem | Recurrence | Time |
|---|---|---|
| LCS | $L[i][j]=L[i-1][j-1]+1$ if $x_i=y_j$, else $\max(L[i-1][j],L[i][j-1])$ | $O(mn)$ |
| Edit distance | $\min(D[i-1][j]+1,\ D[i][j-1]+1,\ D[i-1][j-1]+[x_i\ne y_j])$ | $O(mn)$ |
| 0/1 knapsack | $K[i][w]=\max(K[i-1][w],\ v_i+K[i-1][w-w_i])$ | $O(nW)$ pseudo-poly |
| Subset sum | $S[i][s]=S[i-1][s]\lor S[i-1][s-a_i]$ | $O(nS)$ |
| Matrix chain | $m[i][j]=\min_{i\le k<j}m[i][k]+m[k+1][j]+p_{i-1}p_kp_j$ | $O(n^3)$ |
| LIS | $L[i]=1+\max_{j<i,\,a_j<a_i}L[j]$ | $O(n^2)$; $O(n\log n)$ with binary search |
| Coin change (ways) | $W[s]\mathrel{+}=W[s-c]$ for each coin $c$ | $O(nS)$ |
| Rod cutting | $R[n]=\max_i(p_i+R[n-i])$ | $O(n^2)$ |
| Floyd–Warshall | $d_k[i][j]=\min(d_{k-1}[i][j],\ d_{k-1}[i][k]+d_{k-1}[k][j])$ | $O(V^3)$ |
| Optimal BST | $e[i][j]=\min_r(e[i][r-1]+e[r+1][j])+w(i,j)$ | $O(n^3)$ |
| TSP (Held–Karp) | $C(S,j)=\min_i C(S-\{j\},i)+d_{ij}$ | $O(n^22^n)$ |
| Fibonacci | $F_n=F_{n-1}+F_{n-2}$ | $O(n)$ |
- Matrix chain: parenthesisations of $n$ matrices $=C_{n-1}$ (Catalan); multiplying $p\times q$ by $q\times r$ costs $pqr$
- LCS: table fill order row by row; number of LCSs can be exponential
- 0/1 knapsack (decision) is NP-complete — $O(nW)$ is exponential in the bit-length of $W$

## P, NP & Complexity Classes {#p-and-np-concepts}

### Definitions
- P: solvable in polynomial time. NP: a "yes" certificate is verifiable in polynomial time (nondeterministic poly time)
- $P\subseteq NP$, $P\subseteq\text{co-NP}$; $P=NP$? open
- NP-hard: every NP problem reduces to it (it need not be in NP — e.g. halting problem)
- NP-complete = NP ∩ NP-hard

### Reductions ($A\le_pB$: $A$ reduces to $B$)
- $B\in P\Rightarrow A\in P$; $B\in NP\Rightarrow A\in NP$
- $A$ NP-hard $\Rightarrow B$ NP-hard. To show a new problem $X$ is NP-hard, reduce a **known** NP-hard problem **to** $X$
- Any NP-complete problem in P ⇒ P = NP
- $\le_p$ is transitive

### Known classes
| NP-complete | In P |
|---|---|
| SAT, 3-SAT, CNF-SAT | 2-SAT, Horn-SAT |
| Clique, independent set, vertex cover | max matching, min vertex cover in bipartite graphs |
| Hamiltonian cycle / path, TSP (decision) | Euler circuit, shortest path, MST |
| Graph $k$-colouring ($k\ge3$) | 2-colouring (bipartite test) |
| Subset sum, partition, 0/1 knapsack (decision) | fractional knapsack, max flow, linear programming |
| Set cover, exact cover, longest path | primality (AKS), sorting, LCS of 2 strings |
- Halting problem: NP-hard, undecidable, not in NP
