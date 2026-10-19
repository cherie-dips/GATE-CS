## ER Model {#er-diagrams}

### ER → tables (minimum number of tables)
| ER construct | Tables |
|---|---|
| Strong entity | its own table |
| Weak entity | own table: owner's key + partial key (discriminator) as the key |
| Multivalued attribute | separate table (entity key + attribute) |
| Composite attribute | flatten into simple columns; derived attributes aren't stored |
| 1:1 relationship | no extra table — merge into either side (into the total-participation side; total on both sides ⇒ one table for all) |
| 1:N relationship | no extra table — foreign key on the N side |
| M:N relationship | separate table; key = both entity keys |
| $n$-ary relationship ($n\ge3$) | separate table |
- Identifying relationship of a weak entity has total participation on the weak side and is 1:N from the owner

### Keys
- Super key: uniquely identifies tuples. Candidate key: minimal super key. Primary key: chosen candidate key (no NULLs)
- Foreign key: references a primary/candidate key of another (or the same) table; may be NULL
- Referential integrity can be violated by: inserting into (or updating the FK in) the referencing table, deleting/updating in the referenced table (handled by `ON DELETE/UPDATE CASCADE / SET NULL / RESTRICT`)

### Generalisation / specialisation
- Disjoint vs overlapping; total vs partial. Tables: one per subclass (+ superclass), or a single table with a type column

## Relational Algebra & Calculus {#relational-algebra}

### Operators
| Operator | Meaning |
|---|---|
| $\sigma_c(R)$ | select rows |
| $\pi_A(R)$ | project columns (removes duplicates) |
| $R\times S$ | Cartesian product |
| $R\cup S$, $R-S$, $R\cap S$ | need union-compatible schemas |
| $R\bowtie S$ | natural join on common attributes (common columns kept once) |
| $R\bowtie_\theta S$ | $\sigma_\theta(R\times S)$ |
| $\rho$ | rename |
| $R\div S$ | values of $R$'s other attributes paired with **every** tuple of $S$ |
- Basic set: $\sigma,\pi,\times,\cup,-,\rho$. $R\cap S=R-(R-S)$
- $R(A,B)\div S(B)=\pi_A(R)-\pi_A\big((\pi_A(R)\times S)-R\big)$
- Natural join with no common attribute = Cartesian product

### Result sizes ($|R|=m$, $|S|=n$)
| Expression | Min | Max |
|---|---|---|
| $R\times S$ | $mn$ | $mn$ |
| $R\bowtie S$ | 0 | $mn$ |
| $R\bowtie S$, join on $R$'s foreign key → $S$'s key (no NULLs) | $m$ | $m$ |
| $R\cup S$ | $\max(m,n)$ | $m+n$ |
| $R\cap S$ | 0 | $\min(m,n)$ |
| $R-S$ | $\max(0,m-n)$ | $m$ |
| $\sigma(R)$ | 0 | $m$ |
| $\pi(R)$ | 1 (if $m\ge1$) | $m$ |
| $R$ ⟕ $S$ (left outer) | $m$ | $mn$ (if $n\ge1$) |

### Equivalences
- $\sigma_{c_1\land c_2}(R)=\sigma_{c_1}(\sigma_{c_2}(R))$; selections commute
- $\pi_{A}(\pi_{B}(R))=\pi_A(R)$ if $A\subseteq B$
- Push selections and projections below joins; joins are commutative and associative
- $\pi$ does not distribute over $-$; $\sigma$ distributes over $\cup$, $\cap$, $-$

### Relational calculus
- TRC $\{t\mid P(t)\}$; DRC $\{\langle x_1..x_n\rangle\mid P\}$
- Safe expressions: results drawn from values in the database. Relational algebra = safe TRC = safe DRC (relationally complete)
- "For all" queries: $\forall$ in calculus ≈ division in algebra ≈ `NOT EXISTS (... EXCEPT ...)` in SQL

## SQL {#structured-query-language}

### Evaluation order
- `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `DISTINCT` → `ORDER BY` → `LIMIT`
- `WHERE` filters rows (no aggregates); `HAVING` filters groups (aggregates allowed)
- With `GROUP BY`, `SELECT` may contain only grouping columns and aggregates

### NULL & three-valued logic
| AND | T | U | F |
|---|---|---|---|
| T | T | U | F |
| U | U | U | F |
| F | F | F | F |
- OR: T if either is T, F if both F, else U. NOT U = U
- Any comparison with NULL (even `NULL = NULL`) is UNKNOWN; `WHERE` keeps only TRUE rows; use `IS NULL`
- Aggregates ignore NULLs except `COUNT(*)`; `COUNT(col)` counts non-NULL values; `AVG(col)` = `SUM(col)/COUNT(col)`
- On an empty input: `COUNT` = 0, `SUM`/`AVG`/`MAX`/`MIN` = NULL
- `GROUP BY` puts all NULLs in one group

### Subqueries
- `IN` ≡ `= ANY`; `NOT IN` ≡ `<> ALL`
- `x NOT IN (subquery containing a NULL)` is never TRUE ⇒ no rows
- `x > ALL (empty)` is TRUE; `x > ANY (empty)` is FALSE; `EXISTS` is TRUE iff the subquery returns a row
- `x > ALL (S)` ≡ `x > MAX(S)` (if S is non-empty and has no NULLs); `x > ANY (S)` ≡ `x > MIN(S)`
- Correlated subquery: re-evaluated for each outer row
- Division ("for all") pattern: `NOT EXISTS (SELECT ... WHERE NOT EXISTS (...))`

### Duplicates & set operations
- SQL tables are multisets; `SELECT` keeps duplicates unless `DISTINCT`
- `UNION`, `INTERSECT`, `EXCEPT` remove duplicates; `UNION ALL` etc. keep them
- `SELECT ... FROM R, S` without `WHERE` = Cartesian product ($|R|\times|S|$ rows)

### Joins
- `INNER JOIN` keeps matches; `LEFT/RIGHT/FULL OUTER JOIN` also keep unmatched rows, padded with NULLs
- `NATURAL JOIN` joins on all same-named columns

### DDL / constraints
- `PRIMARY KEY` (unique + not null), `UNIQUE` (allows NULLs), `CHECK`, `FOREIGN KEY ... REFERENCES`
- Views: stored queries; updatable only when simple (one table, no aggregates/DISTINCT)

## Functional Dependencies & Normalization {#functional-dependencies-and-normalization}

### Armstrong's axioms
- Reflexivity: $Y\subseteq X\Rightarrow X\to Y$. Augmentation: $X\to Y\Rightarrow XZ\to YZ$. Transitivity: $X\to Y,Y\to Z\Rightarrow X\to Z$
- Derived: union ($X\to Y,X\to Z\Rightarrow X\to YZ$), decomposition ($X\to YZ\Rightarrow X\to Y$), pseudotransitivity ($X\to Y,WY\to Z\Rightarrow WX\to Z$)
- $XY\to Z$ does **not** imply $X\to Z$

### Closures & keys
- $X^+$: start with $X$, add RHS of any FD whose LHS ⊆ current set, repeat. $X$ is a superkey $\iff X^+$ = all attributes
- Attributes on no RHS are in every candidate key; attributes only on RHS are in no candidate key
- Prime attribute: belongs to some candidate key
- Super keys of $R$ with $n$ attributes and a single candidate key of $k$ attributes: $2^{n-k}$
- Two candidate keys $K_1,K_2$: $2^{n-|K_1|}+2^{n-|K_2|}-2^{n-|K_1\cup K_2|}$
- $F$ and $G$ equivalent $\iff$ each FD of one follows from the other ($F^+=G^+$)

### Minimal cover
1. Split every RHS into single attributes
2. Remove extraneous LHS attributes ($A$ in $XA\to B$ is extraneous if $X^+\ni B$)
3. Remove redundant FDs (implied by the rest)

### Normal forms
| NF | Condition |
|---|---|
| 1NF | atomic (single-valued) attributes |
| 2NF | 1NF + no non-prime attribute depends on a **proper subset** of any candidate key |
| 3NF | every non-trivial $X\to A$: $X$ is a superkey **or** $A$ is prime |
| BCNF | every non-trivial $X\to A$: $X$ is a superkey |
| 4NF | every non-trivial MVD $X\twoheadrightarrow Y$: $X$ is a superkey |
- BCNF ⇒ 3NF ⇒ 2NF ⇒ 1NF
- Any two-attribute relation is in BCNF. All candidate keys single attributes ⇒ 2NF. All attributes prime ⇒ 3NF
- Find the highest NF: compute candidate keys, then test each FD against 2NF, 3NF, BCNF

### Decomposition
- Lossless (binary): $R_1\cap R_2\to R_1$ or $R_1\cap R_2\to R_2$ (common attributes are a key of one side)
- Dependency preserving: $(F_1\cup F_2\cup\cdots)^+=F^+$ ($F_i$ = FDs of $F^+$ restricted to $R_i$)
- 3NF synthesis: always lossless and dependency preserving. BCNF: always lossless, not always dependency preserving
- 3NF synthesis: minimal cover → one relation per LHS group → add a relation holding a candidate key if none has one → drop subsumed relations
- Lossless test for more than 2 relations: chase / tableau — lossless iff some row becomes all "a" values
- Every FD is an MVD; $X\twoheadrightarrow Y$ ⇒ $X\twoheadrightarrow R-X-Y$

## Transactions & Concurrency Control {#transactions-and-concurrency}

### ACID
- Atomicity (recovery: undo), Consistency (application + constraints), Isolation (concurrency control), Durability (recovery: redo / log)
- States: active → partially committed → committed; active/partially committed → failed → aborted

### Schedules
- Conflicting operations: same item, different transactions, at least one write (RW, WR, WW)
- Conflict serializable $\iff$ precedence graph acyclic; equivalent serial orders = topological orders
- View serializable: same initial reads, same reads-from, same final writes. Conflict serializable ⇒ view serializable; VS but not CS ⇒ has a blind write. Testing VS is NP-complete
- Serial schedules of $n$ transactions: $n!$. All schedules for transactions with $n_1,\dots,n_k$ operations: $\dfrac{(n_1+\cdots+n_k)!}{n_1!\cdots n_k!}$

### Recoverability
| Schedule | Rule |
|---|---|
| Recoverable | if $T_j$ reads from $T_i$, $T_i$ commits before $T_j$ commits |
| Cascadeless (ACA) | read only committed data |
| Strict | no read or write of an item until its last writer commits/aborts |
- Strict ⊂ cascadeless ⊂ recoverable; serializability and recoverability are independent

### Anomalies
- Lost update (WW), dirty read (WR on uncommitted), unrepeatable read (RW), phantom (new rows in a range)
- Isolation levels: read uncommitted (dirty reads possible) < read committed (no dirty reads) < repeatable read (no unrepeatable reads) < serializable (no phantoms)

### Locking
- S–S compatible; S–X and X–X conflict
- 2PL (growing then shrinking phase) ⇒ conflict serializable; can deadlock and cascade rollbacks
- Strict 2PL: hold X locks until commit ⇒ strict schedules. Rigorous 2PL: hold all locks until commit
- Conservative (static) 2PL: lock everything before starting ⇒ deadlock-free
- Not every conflict-serializable schedule is 2PL-possible

### Timestamp ordering
- `read(X)` by $T$: if TS($T$) < W-TS($X$) → roll back $T$; else read, R-TS($X$) = max(R-TS, TS($T$))
- `write(X)`: if TS($T$) < R-TS($X$) → roll back; if TS($T$) < W-TS($X$) → roll back (Thomas write rule: ignore the write); else write, W-TS = TS($T$)
- Basic TO: conflict serializable, deadlock-free, may starve, not necessarily recoverable. Thomas rule allows some view-serializable non-CS schedules
- Deadlock prevention: wait–die (older waits, younger dies; non-preemptive), wound–wait (older wounds younger, younger waits; preemptive)

### Recovery
- Write-ahead logging: log record reaches stable storage before the data page
- Checkpoint: transactions committed before it are ignored; committed after it → redo; uncommitted at crash → undo
- Deferred update: no undo needed (redo only); immediate update: undo + redo

## File Organization & Indexing (B/B+ Trees) {#file-structures-and-indexing}

### Files
- Blocking factor bfr $=\lfloor B/R\rfloor$ (unspanned); blocks $=\lceil r/\text{bfr}\rceil$
- Search cost (blocks): unordered file $b/2$ average, $b$ worst / not found; ordered file binary search $\lceil\log_2b\rceil$

### Index types
| Index | On | Density | Entries |
|---|---|---|---|
| Primary | ordering key field | sparse | one per data block |
| Clustering | ordering non-key field | sparse | one per distinct value |
| Secondary | non-ordering field | dense | one per record (key) or per value |
- At most one primary or clustering index per file; many secondary indexes
- Index blocking factor (fan-out) $f_o=\lfloor B/(K+P)\rfloor$; index blocks $=\lceil\#\text{entries}/f_o\rceil$
- Multilevel index: levels $=\lceil\log_{f_o}(\#\text{first-level entries})\rceil$; access cost = levels + 1 (data block)

### B-tree (order $p$ = max children)
- Node: $p\cdot P_{block}+(p-1)(K+P_{record})\le B$
- Every node except the root has $\lceil p/2\rceil..p$ children ($\lceil p/2\rceil-1..p-1$ keys); root 2..$p$ children; all leaves at the same level
- Max keys with $h$ levels: $p^h-1$. Min keys with $h$ levels: $2\lceil p/2\rceil^{h-1}-1$
- Splitting a full node pushes the median key up; height grows only when the root splits

### B+ tree
- Internal node: $p\cdot P_{block}+(p-1)K\le B$. Leaf: $p_{leaf}(K+P_{record})+P_{next}\le B$
- Records only at leaves; leaves linked ⇒ fast range queries; higher fan-out than a B-tree ⇒ shorter
- Every key appears in a leaf; internal keys are copies used for routing
- Max record pointers with $h$ levels (root..leaves): $p^{h-1}\times p_{leaf}$
- Min nodes / keys: root ≥ 2 children, internal ≥ $\lceil p/2\rceil$ children, leaves ≥ $\lceil p_{leaf}/2\rceil$ keys (conventions vary — use the question's definition of order)

### Hashing files
- Static hashing: overflow chains. Extendible hashing: directory of $2^{\text{global depth}}$ pointers; bucket split raises local depth; directory doubles when local depth would exceed global depth
- Linear hashing: split buckets in round-robin order
