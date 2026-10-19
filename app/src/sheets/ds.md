## Arrays {#arrays}

### Address calculation
- 1-D `A[L..U]`, element size $w$: $\text{addr}(A[i])=B+(i-L)\,w$
- 2-D `A[L1..U1][L2..U2]`, $M$ rows $=U_1-L_1+1$, $N$ columns $=U_2-L_2+1$:
  - Row-major: $B+\left[(i-L_1)N+(j-L_2)\right]w$
  - Column-major: $B+\left[(j-L_2)M+(i-L_1)\right]w$
- 3-D `A[p][q][r]` row-major (0-based): $B+\left[(i\,q+j)\,r+k\right]w$
- C is row-major; FORTRAN is column-major

### Special matrices ($n\times n$, 1-based)
| Matrix | Stored elements | Row-major index of $(i,j)$ (0-based offset) |
|---|---|---|
| Lower triangular ($i\ge j$) | $\frac{n(n+1)}2$ | $\frac{i(i-1)}2+(j-1)$ |
| Upper triangular ($i\le j$) | $\frac{n(n+1)}2$ | $(i-1)n-\frac{(i-1)(i-2)}2+(j-i)$ |
| Tridiagonal ($\lvert i-j\rvert\le1$) | $3n-2$ | $2i+j-3$ |
- Lower triangular column-major = upper triangular row-major of the transpose

### Array algorithms
- Kadane (max subarray sum) $O(n)$; two-pointer / sliding window $O(n)$
- Find a missing number in $1..n$: $\frac{n(n+1)}2-\text{sum}$, or XOR

## Stacks & Queues {#stacks-and-queues}

### Infix → postfix
- Operand → output. `(` → push. `)` → pop to output until `(`
- Operator $o$: pop while top has higher precedence, or equal precedence and $o$ is left-associative; then push $o$
- `^` is right-associative: `a^b^c` → `abc^^`
- End: pop everything. Prefix: reverse, swap brackets, convert (treat associativity mirrored), reverse
- Max stack size during conversion = max operators/brackets simultaneously pending

### Postfix evaluation
- Operand → push. Operator → pop $b$, pop $a$, push $a\ o\ b$ (order matters for $-$, $/$, ^)
- Prefix: scan right to left, pop $a$ then $b$, push $a\ o\ b$

### Stack facts
- Valid stack permutations of $1..n$ (push in order, pop any time): Catalan $C_n=\frac1{n+1}\binom{2n}n$
- An output order is possible iff it has no "3-1-2" pattern: no $a$, then later $b$, then later $c$ with $b<c<a$
- Balanced parentheses: one pass with a stack
- Recursion, DFS, undo, expression evaluation use stacks

### Queues
- Circular array of size $n$, one slot kept empty: empty `front == rear`; full `(rear+1) % n == front`; holds $n-1$; count `(rear - front + n) % n`
- Enqueue `rear = (rear+1) % n`; dequeue `front = (front+1) % n`
- Queue with two stacks: enqueue $O(1)$, dequeue amortised $O(1)$ (worst $O(n)$)
- Stack with two queues: one of push / pop is $O(n)$
- Deque: insert/delete at both ends. Priority queue: heap ($O(\log n)$ insert / delete)

## Linked Lists {#linked-lists}

### Operation costs
| Operation | Singly | Doubly | Array |
|---|---|---|---|
| Access $k$-th | $O(n)$ | $O(n)$ | $O(1)$ |
| Insert / delete at head | $O(1)$ | $O(1)$ | $O(n)$ |
| Insert at tail (with tail pointer) | $O(1)$ | $O(1)$ | $O(1)$ amortised |
| Delete tail | $O(n)$ | $O(1)$ (with tail ptr) | $O(1)$ |
| Delete a given node (pointer to it) | $O(n)$ (needs predecessor) | $O(1)$ | $O(n)$ |
| Search | $O(n)$ | $O(n)$ | $O(n)$; sorted $O(\log n)$ |
- Binary search on a linked list is $O(n)$ (no random access); merge sort is the natural $O(n\log n)$ sort

### Techniques
- Reverse: three pointers (prev, cur, next), $O(n)$, $O(1)$ space
- Cycle detection: Floyd slow/fast pointers; middle: slow/fast; $k$-th from end: two pointers $k$ apart
- Merge two sorted lists $O(m+n)$
- Insert into sorted list $O(n)$; delete node given only its pointer (not last): copy next node's data, delete next
- Doubly linked insert after $p$: `q->next = p->next; q->prev = p; p->next->prev = q; p->next = q;` (order matters)

## Trees, BST & Heaps {#trees}

### Binary tree properties (root at level 0, height = edges on longest root–leaf path)
- Max nodes at level $i$: $2^i$; max nodes with height $h$: $2^{h+1}-1$; min nodes: $h+1$
- $n$ nodes: min height $\lceil\log_2(n+1)\rceil-1$, max height $n-1$
- Leaves $n_0=n_2+1$ (nodes with 2 children); edges $n-1$; NULL links $n+1$
- Full / strict binary tree ($0$ or $2$ children) with $I$ internal nodes: $I+1$ leaves, $2I+1$ nodes
- $k$-ary tree where every internal node has $k$ children: $L=(k-1)I+1$
- Complete binary tree height $\lfloor\log_2n\rfloor$
- Unlabelled binary trees with $n$ nodes: $C_n$; labelled: $n!\,C_n$; BSTs on $n$ distinct keys: $C_n$
- Binary trees of height $h$ with $h+1$ nodes (max height): $2^h$

### Traversals
- Preorder: N L R; inorder: L N R; postorder: L R N; level-order: BFS with a queue — all $O(n)$
- Unique tree from inorder + (preorder or postorder or level-order). Preorder + postorder fixes the tree only if it is full
- Preorder of a BST alone determines it (sort it → inorder)
- Expression tree: inorder = infix (with brackets), postorder = postfix
- First in preorder = root = last in postorder

### Array representation (complete tree)
| | 1-based | 0-based |
|---|---|---|
| Children of $i$ | $2i$, $2i+1$ | $2i+1$, $2i+2$ |
| Parent of $i$ | $\lfloor i/2\rfloor$ | $\lfloor(i-1)/2\rfloor$ |
| Leaves | $\lfloor n/2\rfloor+1..n$ | $\lfloor n/2\rfloor..n-1$ |
- $d$-ary heap (0-based): children $di+1..di+d$, parent $\lfloor(i-1)/d\rfloor$, height $\approx\log_dn$

### Binary search tree
- Inorder is sorted; search / insert / delete $O(h)$, $h$ between $\log n$ and $n$
- Delete with two children: replace by inorder successor (min of right subtree) or predecessor
- Inorder successor: min of the right subtree; with no right subtree, the lowest ancestor whose left subtree contains the node
- Inserting sorted keys gives a skewed tree (height $n-1$)
- Insertion orders that build the same BST: $W(T)=\binom{L+R}{L}\,W(T_L)\,W(T_R)$ ($L,R$ = subtree sizes; root must come first)

### AVL trees
- Balance factor $=h(L)-h(R)\in\{-1,0,1\}$ at every node
- Min nodes with height $h$: $N(h)=N(h-1)+N(h-2)+1$, $N(0)=1$, $N(1)=2$ → 1, 2, 4, 7, 12, 20, 33, 54, 88
- Max height $\approx1.44\log_2n$; all operations $O(\log n)$
- Rotations: LL → right rotate; RR → left rotate; LR → left on child then right; RL → right on child then left
- Insertion: at most one (single or double) rotation; deletion may need $O(\log n)$ rotations

### Heaps
| Operation (binary heap) | Time |
|---|---|
| Build heap (bottom-up heapify) | $O(n)$ |
| Insert / delete root / decrease key | $O(\log n)$ |
| Find min (min-heap) | $O(1)$ |
| Search / find max in a min-heap / delete arbitrary without index | $O(n)$ |
| $k$-th smallest in a min-heap | $O(k\log k)$ (aux heap) or $O(k\log n)$ |
- Max element of a min-heap is in a leaf (positions $\lfloor n/2\rfloor+1..n$)
- Second largest in a max-heap: one of the root's children
- Heaps on $n$ distinct keys: $H(n)=\binom{n-1}{L}H(L)H(n-1-L)$, $L$ = size of left subtree (e.g. $H(3)=2$, $H(4)=3$, $H(5)=8$, $H(7)=80$)
- Merging two binary heaps of size $n$: $O(n)$
- Building a heap by $n$ successive inserts: $O(n\log n)$ worst (bottom-up heapify is $O(n)$)
- In a max-heap the $k$-th largest is at depth $\le k-1$ (within the first $2^k-1$ positions)

### Other trees
- Red–black: height $\le2\log_2(n+1)$; root and NIL leaves black, no red–red, equal black height
- B / B+ trees: see Databases → File Organization & Indexing
- Threaded binary tree: NULL links point to inorder predecessor / successor

## Hashing {#hashing}

### Hash functions
- Division $h(k)=k\bmod m$ ($m$ prime, not near a power of 2); multiplication $\lfloor m\,(kA\bmod1)\rfloor$
- Load factor $\alpha=n/m$

### Collision resolution
| Method | Probe sequence | Issue |
|---|---|---|
| Chaining | linked list per slot | $\alpha$ may exceed 1 |
| Linear probing | $(h(k)+i)\bmod m$ | primary clustering |
| Quadratic probing | $(h(k)+c_1i+c_2i^2)\bmod m$ | secondary clustering; may not reach every slot |
| Double hashing | $(h_1(k)+i\,h_2(k))\bmod m$ | $h_2(k)\ne0$, coprime to $m$ |
- Deletion under open addressing: mark slot "deleted" (tombstone), don't empty it

### Expected probes (uniform hashing)
| | Unsuccessful | Successful |
|---|---|---|
| Chaining | $1+\alpha$ | $1+\frac\alpha2$ |
| Open addressing | $\frac1{1-\alpha}$ | $\frac1\alpha\ln\frac1{1-\alpha}$ |
| Linear probing | $\frac12\left(1+\frac1{(1-\alpha)^2}\right)$ | $\frac12\left(1+\frac1{1-\alpha}\right)$ |

### Probability facts ($n$ keys, $m$ slots, uniform)
- Expected keys per slot $=n/m$; expected empty slots $=m\left(1-\frac1m\right)^n$
- P(no collision) $=\dfrac{m(m-1)\cdots(m-n+1)}{m^n}$; expected colliding pairs $=\binom n2/m$
- Linear probing: an empty slot's chance of being filled next = (1 + length of the cluster just before it) / $m$

## Graphs (Representation & Traversal) {#graphs}

### Representations
| | Adjacency matrix | Adjacency list |
|---|---|---|
| Space | $O(V^2)$ | $O(V+E)$ |
| Edge $(u,v)$ check | $O(1)$ | $O(\deg u)$ |
| All neighbours | $O(V)$ | $O(\deg u)$ |
| BFS / DFS | $O(V^2)$ | $O(V+E)$ |

### BFS
- Queue; visits by distance; gives shortest paths (edge counts) in unweighted graphs
- BFS tree of an undirected graph: non-tree edges join vertices whose levels differ by at most 1 (cross edges only)
- Bipartite test: BFS 2-colouring (no edge inside a level)

### DFS
- Stack / recursion; discovery $d[v]$ and finish $f[v]$ times; intervals are nested or disjoint (parenthesis theorem)
- Undirected DFS: only tree and back edges
- Directed edge $(u,v)$ types:

| Type | Condition |
|---|---|
| Tree / forward | $d[u]<d[v]<f[v]<f[u]$ |
| Back | $d[v]\le d[u]<f[u]\le f[v]$ |
| Cross | $d[v]<f[v]<d[u]<f[u]$ |
- Directed graph has a cycle $\iff$ DFS finds a back edge

### Applications ($O(V+E)$)
- Topological sort (DAG only): decreasing finish time, or Kahn's algorithm (repeatedly remove in-degree-0 vertices)
- Topological order is unique iff the DAG has a Hamiltonian path (Kahn's queue never holds 2 vertices)
- Strongly connected components: Kosaraju (DFS, transpose, DFS in decreasing finish order) or Tarjan; condensation is a DAG
- Articulation points / bridges: DFS low-link values. Root is a cut vertex iff it has ≥ 2 DFS children
- Connected components: repeated BFS / DFS, or union–find ($O(\alpha(n))$ amortised with union by rank + path compression)
