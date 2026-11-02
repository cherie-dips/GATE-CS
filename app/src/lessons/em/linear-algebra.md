# Linear Algebra

Linear algebra is the maths of tables of numbers (called matrices) and of systems of equations that are solved together. GATE CSE asks it in almost every paper: there are about 95 real questions from 1987 to 2026, and since 2014 roughly two per paper, split evenly between 1-mark questions (an eigenvalue, a rank, a determinant) and 2-mark questions (a system with an unknown constant, eigenvalue shortcuts, LU). Take the lessons in order, because each one uses the ones before it: matrices, special matrices, determinants, inverse, rank, linear systems, vector spaces, eigenvalues, eigenvalue shortcuts and LU decomposition.

## Matrices: the basics {#matrices}

*Read a matrix, add and multiply matrices, and work with transposes, powers, the trace and the cost of a product.*

### The idea

A **matrix** is a rectangular table of numbers, arranged in rows and columns. It lets you store numbers that belong together and work with all of them at once.

Say two students took three short quizzes. You can store their marks as

$$A=\begin{bmatrix}2&5&1\\0&3&4\end{bmatrix}.$$

Each row is a student and each column is a quiz.

### Size, entries and vectors

- A matrix with $m$ rows and $n$ columns has **size** $m\times n$ (read "m by n"). Rows always come first. The matrix $A$ above is $2\times3$.
- The number in row $i$ and column $j$ is the **entry** $a_{ij}$. In $A$, $a_{12}=5$ (row 1, column 2) and $a_{23}=4$.
- A matrix with as many rows as columns is **square**. Its entries $a_{11},a_{22},\dots$ form the **main diagonal**, from the top-left corner to the bottom-right corner.
- A matrix with one row is a **row vector**, like $\begin{bmatrix}3&1&4\end{bmatrix}$. A matrix with one column is a **column vector**. When this chapter says "vector" without saying which, it means a column vector.

Two matrices are **equal** only when they have the same size and every entry matches.

### Adding and scaling

You can add two matrices only if they have the same size: add entry by entry. You can also multiply a matrix by a plain number $k$ (a plain number is called a **scalar**): multiply every entry by $k$.

$$\begin{bmatrix}1&2\\3&4\end{bmatrix}+\begin{bmatrix}5&6\\7&8\end{bmatrix}=\begin{bmatrix}6&8\\10&12\end{bmatrix},\qquad 3\begin{bmatrix}1&2\\3&4\end{bmatrix}=\begin{bmatrix}3&6\\9&12\end{bmatrix}.$$

These follow the usual rules of numbers: $A+B=B+A$ and $k(A+B)=kA+kB$. The **zero matrix** $O$ has every entry $0$, so $A+O=A$.

### Multiplying two matrices

Multiplication is the one operation that is not done entry by entry. To get the entry in row $i$, column $j$ of $AB$:

1. take row $i$ of $A$ and column $j$ of $B$;
2. multiply them pair by pair (first with first, second with second, and so on);
3. add up these products.

This is the **row × column rule**. It only works if a row of $A$ is exactly as long as a column of $B$.

> **Remember:** an $m\times n$ matrix times an $n\times p$ matrix gives an $m\times p$ matrix. The inner sizes must match, and the outer sizes give the size of the answer.

**Example 1.** Let $A=\begin{bmatrix}1&2&0\\3&-1&2\end{bmatrix}$ ($2\times3$) and $B=\begin{bmatrix}2&1\\0&3\\1&-2\end{bmatrix}$ ($3\times2$). The inner sizes are both $3$, so $AB$ exists and is $2\times2$.

1. Row 1 with column 1: $1\cdot2+2\cdot0+0\cdot1=2$.
2. Row 1 with column 2: $1\cdot1+2\cdot3+0\cdot(-2)=7$.
3. Row 2 with column 1: $3\cdot2+(-1)\cdot0+2\cdot1=8$.
4. Row 2 with column 2: $3\cdot1+(-1)\cdot3+2\cdot(-2)=-4$.

$$AB=\begin{bmatrix}2&7\\8&-4\end{bmatrix}.$$

Here $BA$ also exists, but it is a $3\times3$ matrix: something completely different.

Two small cases are worth knowing. A row times a column gives a single number, and a column times a row gives a whole matrix:

$$\begin{bmatrix}3&4\end{bmatrix}\begin{bmatrix}1\\2\end{bmatrix}=\begin{bmatrix}11\end{bmatrix},\qquad \begin{bmatrix}1\\2\end{bmatrix}\begin{bmatrix}3&4\end{bmatrix}=\begin{bmatrix}3&4\\6&8\end{bmatrix}.$$

**Why such a strange rule?** Because it is exactly what substitution does. Suppose

$$y_1=x_1+2x_2,\quad y_2=3x_1+4x_2,\qquad\text{and}\qquad x_1=5w_1+6w_2,\quad x_2=7w_1+8w_2.$$

Substituting gives $y_1=(5+14)w_1+(6+16)w_2=19w_1+22w_2$, and in the same way $y_2=43w_1+50w_2$. Now multiply the two tables of coefficients:

$$\begin{bmatrix}1&2\\3&4\end{bmatrix}\begin{bmatrix}5&6\\7&8\end{bmatrix}=\begin{bmatrix}19&22\\43&50\end{bmatrix}.$$

The same numbers appear. Multiplying matrices means "do one substitution, then the other", packed into one table.

### Order matters: AB is usually not BA

With numbers, $2\times3=3\times2$. With matrices the order usually matters:

- $AB$ can exist while $BA$ does not ($2\times3$ times $3\times4$ works; the other way round does not).
- Both can exist but have different sizes (Example 1).
- Even square matrices of the same size usually give different answers:

$$\begin{bmatrix}1&2\\3&4\end{bmatrix}\begin{bmatrix}5&6\\7&8\end{bmatrix}=\begin{bmatrix}19&22\\43&50\end{bmatrix},\qquad \begin{bmatrix}5&6\\7&8\end{bmatrix}\begin{bmatrix}1&2\\3&4\end{bmatrix}=\begin{bmatrix}23&34\\31&46\end{bmatrix}.$$

When $AB=BA$, we say $A$ and $B$ **commute**. A product can even be zero when neither factor is zero:

$$\begin{bmatrix}1&1\\2&2\end{bmatrix}\begin{bmatrix}-1&1\\1&-1\end{bmatrix}=\begin{bmatrix}0&0\\0&0\end{bmatrix}.$$

What still works: $(AB)C=A(BC)$, so you can simply write $ABC$, and $A(B+C)=AB+AC$.

**The identity matrix.** The square matrix with $1$ on the main diagonal and $0$ everywhere else is the **identity** $I$, for example $I=\begin{bmatrix}1&0\\0&1\end{bmatrix}$. It acts like the number 1: $AI=IA=A$. Every matrix commutes with $I$ and with any multiple $kI$.

> **Watch out:** $(A+B)^2=A^2+AB+BA+B^2$. It equals $A^2+2AB+B^2$ only when $AB=BA$. In the same way, "multiply both sides by $A$" must say which side: from $X=Y$ you get $AX=AY$ or $XA=YA$, never $AX=YA$.

### Rows on the left, columns on the right

Row $i$ of $AB$ is (row $i$ of $A$) times $B$, and column $j$ of $AB$ is $A$ times (column $j$ of $B$). So a matrix multiplied on the **left** works on the **rows**, and a matrix multiplied on the **right** works on the **columns**.

Take $E=\begin{bmatrix}0&1\\1&0\end{bmatrix}$, which is $I$ with its two rows swapped:

$$E\begin{bmatrix}1&2\\3&4\end{bmatrix}=\begin{bmatrix}3&4\\1&2\end{bmatrix}\ \text{(rows swapped)},\qquad \begin{bmatrix}1&2\\3&4\end{bmatrix}E=\begin{bmatrix}2&1\\4&3\end{bmatrix}\ \text{(columns swapped)}.$$

### Transpose

The **transpose** $A^T$ turns rows into columns: row 1 of $A$ becomes column 1 of $A^T$, and so on. The entry in row $i$, column $j$ of $A^T$ is $a_{ji}$, and an $m\times n$ matrix has an $n\times m$ transpose:

$$\begin{bmatrix}1&2&0\\3&-1&2\end{bmatrix}^T=\begin{bmatrix}1&3\\2&-1\\0&2\end{bmatrix}.$$

The rules are

$$(A^T)^T=A,\qquad (A+B)^T=A^T+B^T,\qquad (kA)^T=kA^T,\qquad (AB)^T=B^TA^T.$$

The last rule reverses the order, and the sizes show why. If $A$ is $2\times3$ and $B$ is $3\times4$, then $(AB)^T$ is $4\times2$. Now $B^T$ is $4\times3$ and $A^T$ is $3\times2$, so $B^TA^T$ is $4\times2$, while $A^TB^T$ does not even exist. With Example 1 you can check that $(AB)^T$ and $B^TA^T$ are both $\begin{bmatrix}2&8\\7&-4\end{bmatrix}$.

Transposing turns a column into a row. So for two column vectors $u$ and $v$ of the same length, $u^Tv=u_1v_1+u_2v_2+\dots$ is a row times a column, a single number, while $uv^T$ is a column times a row, a full matrix.

### Powers and trace

For a square matrix, $A^2=AA$, $A^3=AAA$, and so on, with $A^0=I$. Powers need a square matrix because $AA$ needs matching inner sizes. Powers of the same matrix commute: $A^2A^3=A^3A^2=A^5$.

> **GATE tip:** for a high power, square the matrix first. If $A^2=cI$, every power is easy: $A^{2k}=c^kI$ and $A^{2k+1}=c^kA$, because $(cI)^k=c^kI$.

The **trace** of a square matrix is the sum of its main diagonal: $\operatorname{tr}\begin{bmatrix}1&2\\3&4\end{bmatrix}=1+4=5$. Its rules are

$$\operatorname{tr}(A+B)=\operatorname{tr}A+\operatorname{tr}B,\qquad \operatorname{tr}(kA)=k\operatorname{tr}A,\qquad \operatorname{tr}(A^T)=\operatorname{tr}A,\qquad \operatorname{tr}(AB)=\operatorname{tr}(BA).$$

The last rule holds even when $A$ is $m\times n$ and $B$ is $n\times m$, so that $AB$ is $m\times m$ and $BA$ is $n\times n$. The reason: both traces add up every product $a_{ik}b_{ki}$, only in a different order. For example, with $A=\begin{bmatrix}1&2\end{bmatrix}$ and $B=\begin{bmatrix}3\\4\end{bmatrix}$, $AB=\begin{bmatrix}11\end{bmatrix}$ and $BA=\begin{bmatrix}3&6\\4&8\end{bmatrix}$, whose trace is $3+8=11$.

> **Watch out:** the trace of a product is not the product of the traces. The product of $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ and $\begin{bmatrix}5&6\\7&8\end{bmatrix}$ has trace $19+50=69$, but $5\times13=65$. Also, you may move the first factor to the end, $\operatorname{tr}(ABC)=\operatorname{tr}(BCA)$, but $\operatorname{tr}(ACB)$ can be different.

### The cost of a product

When $A$ is $p\times q$ and $B$ is $q\times r$, each entry of $AB$ is a row of length $q$ times a column of length $q$: that is $q$ multiplications. There are $pr$ entries.

> **Remember:** multiplying a $p\times q$ matrix by a $q\times r$ matrix takes $pqr$ scalar multiplications.

For a chain $ABC$ the brackets do not change the answer, but they can change the work a lot. Take $A$ of size $10\times100$, $B$ of size $100\times5$ and $C$ of size $5\times50$:

- $(AB)C$: $AB$ costs $10\cdot100\cdot5=5000$ and is $10\times5$; then times $C$ costs $10\cdot5\cdot50=2500$. Total $7500$.
- $A(BC)$: $BC$ costs $100\cdot5\cdot50=25000$ and is $100\times50$; then $A$ times it costs $10\cdot100\cdot50=50000$. Total $75000$.

Same answer, ten times the work: good orders get rid of big sizes early.

### How GATE asks this

- True/false statements about products: does $AB=BA$? What does multiplying by an identity with two rows swapped do (left acts on rows, right acts on columns)?
- Trace rules, especially $\operatorname{tr}(AB)=\operatorname{tr}(BA)$ when $A$ and $B$ are not square.
- A high power such as $A^8$: square first and look for $A^2=cI$.
- The minimum number of scalar multiplications for a chain of products.
- Counting puzzles about rows and columns.

**GATE 2016 (2 marks).** Matrices $A_1,A_2,A_3,A_4$ have sizes $10\times5$, $5\times20$, $20\times10$ and $10\times5$. Find the minimum number of scalar multiplications needed to compute $A_1A_2A_3A_4$. ([GATE 2016 Set 2](#/q/es_1UpSNkRtNKRTIfKy))

There are five ways to place the brackets. Cost each one with the $pqr$ rule, noting the size of every partial product:

| Order | Cost |
|---|---|
| $((A_1A_2)A_3)A_4$ | $1000+2000+500=3500$ |
| $(A_1A_2)(A_3A_4)$ | $1000+1000+1000=3000$ |
| $(A_1(A_2A_3))A_4$ | $1000+500+500=2000$ |
| $A_1((A_2A_3)A_4)$ | $1000+250+250=1500$ |
| $A_1(A_2(A_3A_4))$ | $1000+500+250=1750$ |

For the best row: $A_2A_3$ costs $5\cdot20\cdot10=1000$ and is $5\times10$; times $A_4$ costs $5\cdot10\cdot5=250$ and is $5\times5$; then $A_1$ times that costs $10\cdot5\cdot5=250$. The minimum is **1500**, because the big size 20 is used in only one product.

**GATE 2025 (1 mark).** If $A=\begin{bmatrix}1&2\\2&-1\end{bmatrix}$, find $A^8$. ([GATE 2025 Set 2 Q.1](#/q/es_m80a3q2b))

Square first:

$$A^2=\begin{bmatrix}1\cdot1+2\cdot2 & 1\cdot2+2\cdot(-1)\\ 2\cdot1+(-1)\cdot2 & 2\cdot2+(-1)(-1)\end{bmatrix}=\begin{bmatrix}5&0\\0&5\end{bmatrix}=5I.$$

So $A^8=(A^2)^4=(5I)^4=5^4I=625I$, which is option (C).

### Quick check

**1.** $A$ is $3\times2$ and $B$ is $2\times4$. Which of $AB$ and $BA$ exist, and what are their sizes?

<details><summary>Show answer</summary>

$AB$ exists, because the inner sizes are $2$ and $2$, and it is $3\times4$. $BA$ would need the inner sizes $4$ and $3$ to match, so it does not exist.

</details>

**2.** Find $AB$ and $BA$ for $A=\begin{bmatrix}1&0\\2&1\end{bmatrix}$ and $B=\begin{bmatrix}3&1\\0&2\end{bmatrix}$.

<details><summary>Show answer</summary>

$AB=\begin{bmatrix}1\cdot3+0\cdot0 & 1\cdot1+0\cdot2\\ 2\cdot3+1\cdot0 & 2\cdot1+1\cdot2\end{bmatrix}=\begin{bmatrix}3&1\\6&4\end{bmatrix}$ and $BA=\begin{bmatrix}3\cdot1+1\cdot2 & 3\cdot0+1\cdot1\\ 0\cdot1+2\cdot2 & 0\cdot0+2\cdot1\end{bmatrix}=\begin{bmatrix}5&1\\4&2\end{bmatrix}$. They are different, so $A$ and $B$ do not commute.

</details>

**3.** Let $A=\begin{bmatrix}1&2&3\\0&1&4\end{bmatrix}$ and $B=\begin{bmatrix}1&0\\2&1\\0&3\end{bmatrix}$. Find $\operatorname{tr}(BA)$ without working out the $3\times3$ matrix $BA$.

<details><summary>Show answer</summary>

$\operatorname{tr}(BA)=\operatorname{tr}(AB)$, and $AB$ is only $2\times2$. Its diagonal entries are $1\cdot1+2\cdot2+3\cdot0=5$ and $0\cdot0+1\cdot1+4\cdot3=13$. So $\operatorname{tr}(BA)=5+13=18$.

</details>

**4.** $A$ is $2\times3$, $B$ is $3\times4$ and $C$ is $4\times1$. Which is cheaper, $(AB)C$ or $A(BC)$?

<details><summary>Show answer</summary>

$(AB)C$ costs $2\cdot3\cdot4+2\cdot4\cdot1=24+8=32$. $A(BC)$ costs $3\cdot4\cdot1+2\cdot3\cdot1=12+6=18$. So $A(BC)$ is cheaper.

</details>

**5.** In a big matrix, every non-zero entry lies in one of 3 particular rows, and also in one of 5 particular columns. At most how many non-zero entries can you choose so that no two share a row or a column?

<details><summary>Show answer</summary>

Each chosen entry needs a row of its own, and only 3 rows hold non-zero entries, so at most 3. The 5 columns would allow up to 5, but the smaller limit wins: the answer is $\min(3,5)=3$. This is GATE 2004 Q.76, where the answer is $\le\min(a,b)$.

</details>

### Practice from GATE

- [GATE 2022 Q.10](#/q/es_1kzzoeund): trace of $AB$ and $BA$, including non-square matrices.
- [GATE 1997 Q.4.2](#/q/es_TD4kR58TS3zHQuTE): multiplying by an identity with two rows swapped.
- [GATE 2025 Set 2 Q.1](#/q/es_m80a3q2b): a high power using $A^2=cI$.
- [GATE 1996 Q.2.6](#/q/es_YySexUgwmMvGOMr6): when a rotation matrix and a diagonal matrix commute.
- [GATE 2016 Set 2](#/q/es_1UpSNkRtNKRTIfKy): the cheapest order for a chain of products.
- [GATE 2004 Q.76](#/q/es_JKmdV5finxyMbRUc): choosing entries with no two in the same row or column.

## Special kinds of matrices {#special-matrices}

*Spot the special matrices GATE uses, split any square matrix into a symmetric part and a skew-symmetric part, and count matrices of a given kind.*

### The idea

Exam matrices are rarely random tables. Often they have a pattern: zeros below the diagonal, or entries that mirror each other across it. Each pattern comes with shortcuts, so once you spot it, a long calculation can shrink to one line.

Every matrix in this lesson is square ($n\times n$).

### Diagonal, scalar and triangular matrices

- A **diagonal** matrix has zeros everywhere off the main diagonal, like $D=\begin{bmatrix}2&0\\0&3\end{bmatrix}$. Products and powers just act on the diagonal entries, so $D^3=\begin{bmatrix}8&0\\0&27\end{bmatrix}$. Two diagonal matrices always commute.
- A **scalar** matrix is a diagonal matrix with all diagonal entries equal, that is $kI$. Multiplying by it is the same as multiplying by the number $k$: $(kI)A=A(kI)=kA$.
- An **upper triangular** matrix has only zeros below the main diagonal. A **lower triangular** matrix has only zeros above it. The diagonal entries can be anything.

$$U=\begin{bmatrix}1&2&3\\0&4&5\\0&0&6\end{bmatrix}\ \text{(upper)},\qquad L=\begin{bmatrix}2&0&0\\1&3&0\\4&5&6\end{bmatrix}\ \text{(lower)}.$$

The product of two upper triangular matrices is again upper triangular, and its diagonal is the two diagonals multiplied entry by entry:

$$\begin{bmatrix}1&2&3\\0&4&5\\0&0&6\end{bmatrix}\begin{bmatrix}2&0&1\\0&3&1\\0&0&1\end{bmatrix}=\begin{bmatrix}2&6&6\\0&12&9\\0&0&6\end{bmatrix},$$

with diagonal $1\cdot2,\ 4\cdot3,\ 6\cdot1$. The transpose of an upper triangular matrix is lower triangular. These facts make triangular matrices the easiest ones in the determinant, eigenvalue and LU lessons.

### Symmetric matrices

A matrix is **symmetric** if $A^T=A$, that is, $a_{ij}=a_{ji}$ for every $i$ and $j$. The entries are mirror images across the main diagonal:

$$\begin{bmatrix}1&7&3\\7&4&-5\\3&-5&6\end{bmatrix}.$$

A table of road distances between cities is symmetric: the distance from city $i$ to city $j$ equals the distance from $j$ to $i$.

- Sums and scalar multiples of symmetric matrices are symmetric.
- For any matrix $B$, of any size, $B^TB$ and $BB^T$ are symmetric, because $(B^TB)^T=B^T(B^T)^T=B^TB$.
- A product of two symmetric matrices need not be symmetric. Since $(AB)^T=B^TA^T=BA$, the product $AB$ is symmetric exactly when $AB=BA$. For example, $\begin{bmatrix}1&0\\0&0\end{bmatrix}\begin{bmatrix}0&1\\1&0\end{bmatrix}=\begin{bmatrix}0&1\\0&0\end{bmatrix}$ is not symmetric.

### Skew-symmetric matrices

A matrix is **skew-symmetric** if $A^T=-A$, that is, $a_{ji}=-a_{ij}$: mirror entries are negatives of each other. Putting $j=i$ gives $a_{ii}=-a_{ii}$, so $2a_{ii}=0$. Every diagonal entry is $0$:

$$\begin{bmatrix}0&2&-1\\-2&0&4\\1&-4&0\end{bmatrix}.$$

Every entry cancels with its mirror image, and the diagonal is zero, so **all the entries of a skew-symmetric matrix add up to 0**. The only matrix that is both symmetric and skew-symmetric is the zero matrix, since $A=A^T=-A$ forces $A=O$.

### Splitting any matrix into symmetric plus skew-symmetric

Every square matrix $A$ can be written as

$$A=\underbrace{\tfrac12(A+A^T)}_{\text{symmetric}}+\underbrace{\tfrac12(A-A^T)}_{\text{skew-symmetric}}.$$

The reason: $(A+A^T)^T=A^T+A$, the same matrix, so the first part is symmetric. And $(A-A^T)^T=A^T-A=-(A-A^T)$, so the second part is skew-symmetric. The two halves add back to $A$, and this split is the only possible one.

**Example.** Take $A=\begin{bmatrix}1&4\\2&3\end{bmatrix}$, so $A^T=\begin{bmatrix}1&2\\4&3\end{bmatrix}$. Then

$$\tfrac12(A+A^T)=\tfrac12\begin{bmatrix}2&6\\6&6\end{bmatrix}=\begin{bmatrix}1&3\\3&3\end{bmatrix},\qquad \tfrac12(A-A^T)=\tfrac12\begin{bmatrix}0&2\\-2&0\end{bmatrix}=\begin{bmatrix}0&1\\-1&0\end{bmatrix}.$$

Check: $\begin{bmatrix}1&3\\3&3\end{bmatrix}+\begin{bmatrix}0&1\\-1&0\end{bmatrix}=\begin{bmatrix}1&4\\2&3\end{bmatrix}=A$.

### Counting matrices of a given kind

GATE asks questions like "how many $n\times n$ symmetric matrices have entries from $\{0,1\}$?" The method: count the entries you are **free** to choose. Every other entry is forced.

- **Symmetric:** you choose the $n$ diagonal entries and the $\tfrac{n(n-1)}{2}$ entries above the diagonal. The entries below are copies. Free entries: $n+\tfrac{n(n-1)}{2}=\tfrac{n(n+1)}{2}$.
- **Skew-symmetric:** the diagonal is forced to be $0$ and the entries below are forced to be negatives. Free entries: $\tfrac{n(n-1)}{2}$.
- **Upper triangular:** the $\tfrac{n(n+1)}{2}$ entries on and above the diagonal are free; the rest are $0$.

If each free entry can take $k$ values, the number of matrices is $k$ raised to the number of free entries.

| Kind | Free entries | Count with $k$ choices each |
|---|---|---|
| any matrix | $n^2$ | $k^{n^2}$ |
| symmetric | $\tfrac{n(n+1)}{2}$ | $k^{n(n+1)/2}$ |
| upper triangular | $\tfrac{n(n+1)}{2}$ | $k^{n(n+1)/2}$ |
| skew-symmetric | $\tfrac{n(n-1)}{2}$ | $k^{n(n-1)/2}$ |
| diagonal | $n$ | $k^{n}$ |

> **Watch out:** the skew-symmetric count needs $0$ to be allowed and the set to contain $-x$ whenever it contains $x$, as $\{-1,0,1\}$ does. With entries from $\{0,1\}$, the only skew-symmetric matrix is the zero matrix: a $1$ above the diagonal would need a $-1$ below it.

### Orthogonal matrices

Look at the product $A^TA$. Its entry in row $i$, column $j$ is (column $i$ of $A$)$^T$ times (column $j$ of $A$). For two columns $u$ and $v$, $u^Tv=u_1v_1+u_2v_2+\dots$ is the dot product you met with vectors in school. So:

- a diagonal entry of $A^TA$ is a column times itself, $u^Tu=u_1^2+u_2^2+\dots$, which is the squared **length** of that column;
- an off-diagonal entry is $u^Tv$ for two different columns, and $u^Tv=0$ means the two columns are **perpendicular** (at right angles).

A matrix is **orthogonal** if $A^TA=I$: every column has length 1, and every two different columns are perpendicular. Then $A^T$ undoes $A$. For a square matrix this also gives $AA^T=I$ (the inverse lesson shows why), so the rows have the same property.

Examples: the rotation $\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$, whose columns have length $\sqrt{\cos^2\theta+\sin^2\theta}=1$ and dot product $-\cos\theta\sin\theta+\sin\theta\cos\theta=0$; any identity matrix with its rows reordered; and $\dfrac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$.

### Idempotent, nilpotent and involutory matrices

These three are defined by what happens when you multiply the matrix by itself.

| Name | Rule | Plain meaning | Example |
|---|---|---|---|
| idempotent | $A^2=A$ | doing it twice is the same as once | $\begin{bmatrix}1&1\\0&0\end{bmatrix}$ |
| nilpotent | $A^k=O$ for some $k$ | some power is the zero matrix | $\begin{bmatrix}0&1\\0&0\end{bmatrix}$ |
| involutory | $A^2=I$ | it undoes itself | $\begin{bmatrix}0&1\\1&0\end{bmatrix}$ |

Check the examples: $\begin{bmatrix}1&1\\0&0\end{bmatrix}^2=\begin{bmatrix}1&1\\0&0\end{bmatrix}$, $\begin{bmatrix}0&1\\0&0\end{bmatrix}^2=\begin{bmatrix}0&0\\0&0\end{bmatrix}$, and swapping two rows twice puts them back, so $\begin{bmatrix}0&1\\1&0\end{bmatrix}^2=I$.

- $I$ and $O$ are idempotent. If $A$ is idempotent, so is $I-A$, because $(I-A)^2=I-2A+A^2=I-2A+A=I-A$.
- A triangular matrix with a zero diagonal is nilpotent. Each multiplication pushes the non-zero entries one step further from the diagonal, so an $n\times n$ one has $A^n=O$. For example, $\begin{bmatrix}0&1&2\\0&0&3\\0&0&0\end{bmatrix}^2=\begin{bmatrix}0&0&3\\0&0&0\\0&0&0\end{bmatrix}$ and the cube is $O$.
- $I$, $-I$ and $\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ are involutory. A matrix that is both symmetric and orthogonal is involutory, since $A^2=AA^T=I$; for example $\dfrac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$.

> **Remember:** symmetric $A^T=A$; skew-symmetric $A^T=-A$ (zero diagonal); orthogonal $A^TA=I$; idempotent $A^2=A$; nilpotent $A^k=O$; involutory $A^2=I$.

### How GATE asks this

- Count the symmetric (or skew-symmetric, or triangular) matrices with entries from a small set.
- Decide whether $A+A^T$, $A-A^T$, $AB$ or $A^TA$ is symmetric or skew-symmetric.
- Use the zero diagonal and cancelling entries of a skew-symmetric matrix.
- Spot an orthogonal, idempotent or involutory matrix inside a longer question. They come back in the eigenvalue lessons.

**GATE 2004 (1 mark).** How many different $n\times n$ symmetric matrices have every entry equal to $0$ or $1$? ([GATE 2004](#/q/es_leL9E3me6MEb7Gwo))

The free entries are the $n$ diagonal entries plus the $\frac{n(n-1)}{2}$ entries above the diagonal, a total of $\frac{n(n+1)}{2}=\frac{n^2+n}{2}$. Each has 2 choices, so the answer is $2^{(n^2+n)/2}$, option (C). Check with $n=2$: $\begin{bmatrix}a&b\\b&c\end{bmatrix}$ has 3 free entries, giving $2^3=8$ matrices, and $\frac{4+2}{2}=3$.

**GATE 2011 (2 marks).** $A$ is a square matrix that is neither symmetric nor skew-symmetric. Let $S=A+A^T$ and $D=A-A^T$. Which statement is true? ([GATE 2011](#/q/es_aHWIt8xB96Pf4z89))

$S^T=A^T+A=S$, so $S$ is symmetric. $D^T=A^T-A=-D$, so $D$ is skew-symmetric. That is option (D). The condition "neither symmetric nor skew-symmetric" only makes sure that neither $S$ nor $D$ is the zero matrix.

### Quick check

**1.** Split $A=\begin{bmatrix}2&5\\1&4\end{bmatrix}$ into a symmetric part plus a skew-symmetric part.

<details><summary>Show answer</summary>

$\tfrac12(A+A^T)=\tfrac12\begin{bmatrix}4&6\\6&8\end{bmatrix}=\begin{bmatrix}2&3\\3&4\end{bmatrix}$ and $\tfrac12(A-A^T)=\tfrac12\begin{bmatrix}0&4\\-4&0\end{bmatrix}=\begin{bmatrix}0&2\\-2&0\end{bmatrix}$. Their sum is $\begin{bmatrix}2&5\\1&4\end{bmatrix}=A$.

</details>

**2.** How many $3\times3$ symmetric matrices have all entries from $\{0,1,2\}$?

<details><summary>Show answer</summary>

Free entries: $\frac{3\cdot4}{2}=6$ (3 on the diagonal, 3 above it). Each has 3 choices, so $3^6=729$.

</details>

**3.** How many $3\times3$ skew-symmetric matrices have all entries from $\{-1,0,1\}$?

<details><summary>Show answer</summary>

The diagonal must be $0$ and the entries below are forced, so only the $\frac{3\cdot2}{2}=3$ entries above the diagonal are free. Each has 3 choices, so $3^3=27$.

</details>

**4.** Let $v$ be the $n\times n$ matrix with $v_{ij}=i-j$. What is the sum of all its entries?

<details><summary>Show answer</summary>

$v_{ji}=j-i=-v_{ij}$, so $v$ is skew-symmetric: the diagonal is $0$ and every other entry cancels with its mirror image. The sum is $0$ for every $n$ (GATE 2000).

</details>

**5.** Name the kind of each: $\begin{bmatrix}0&3\\0&0\end{bmatrix}$, $\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ and $\begin{bmatrix}1&0\\0&0\end{bmatrix}$.

<details><summary>Show answer</summary>

The first is nilpotent, since its square is $O$. The second is involutory, since its square is $I$ (it is also symmetric and orthogonal). The third is idempotent, since its square is itself.

</details>

### Practice from GATE

- [GATE 2011](#/q/es_aHWIt8xB96Pf4z89): the symmetric and skew-symmetric parts $A+A^T$ and $A-A^T$.
- [GATE 2000](#/q/es_5XRuLCn9rHlQ0441): the sum of the entries $v_{ij}=i-j$.
- [GATE 2004](#/q/es_leL9E3me6MEb7Gwo): counting symmetric 0/1 matrices.
- [GATE 1994 Q.1.2](#/q/es_HGKZ0QW7B8raLinR): which statements always hold for two symmetric matrices.

## Determinants {#determinants}

*Find the determinant of any small matrix quickly, use its properties and the effect of row operations, and spot the special patterns GATE uses.*

### The idea

A $2\times2$ matrix moves every point of the plane: the point $(x,y)$ goes to $A\begin{bmatrix}x\\y\end{bmatrix}$. The square with corners $(0,0)$, $(1,0)$, $(0,1)$ and $(1,1)$ goes to a parallelogram whose sides are the two columns of $A$.

The **determinant** of $A$, written $\det A$ or $|A|$, is the number that tells you **how much the matrix scales area**. Every shape's area gets multiplied by the absolute value of $\det A$ (its value without the sign). The sign tells you whether the shape was **flipped** over like a mirror image (negative) or not (positive). For a $3\times3$ matrix, the same number scales volume. Only square matrices have determinants.

<figure class="fig"><svg viewBox="0 0 260 190" role="img" aria-label="The unit square and the parallelogram it becomes under the matrix with columns (3,1) and (1,2)">
<line x1="20" y1="170" x2="250" y2="170" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="40" y1="185" x2="40" y2="20" stroke="currentColor" stroke-opacity="0.4"/>
<polygon points="40,170 80,170 80,130 40,130" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-opacity="0.6"/>
<polygon points="40,170 160,130 200,50 80,90" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="2.5"/>
<text x="120" y="114" font-size="13" fill="currentColor" text-anchor="middle">area 5</text>
<text x="166" y="144" font-size="12" fill="currentColor">(3,1)</text>
<text x="74" y="86" font-size="12" fill="currentColor" text-anchor="end">(1,2)</text>
<text x="206" y="48" font-size="12" fill="currentColor">(4,3)</text>
</svg><figcaption>$A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ turns the grey unit square (area 1) into a parallelogram of area $5=\det A$.</figcaption></figure>

If $\det A=0$, the matrix squashes the whole plane onto a line (or a point), so every area becomes $0$. Such a matrix is called **singular**. A matrix with $\det A\neq0$ is **non-singular**.

### 2×2 and 3×3 determinants

$$\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc.$$

For the picture, $\det\begin{bmatrix}3&1\\1&2\end{bmatrix}=3\cdot2-1\cdot1=5$. For $\begin{bmatrix}2&4\\1&2\end{bmatrix}$ the determinant is $4-4=0$: both columns, $(2,1)$ and $(4,2)$, lie on the same line, so the square collapses.

For bigger matrices, break the determinant into smaller ones. The **minor** $M_{ij}$ of the entry $a_{ij}$ is the determinant left after deleting row $i$ and column $j$. The **cofactor** is the minor with a sign, $C_{ij}=(-1)^{i+j}M_{ij}$. The signs form a checkerboard starting with $+$ at the top-left:

$$\begin{bmatrix}+&-&+\\-&+&-\\+&-&+\end{bmatrix}.$$

> **Remember:** pick any one row or column. Multiply each of its entries by that entry's cofactor and add. Every row and every column gives the same answer, so choose the one with the most zeros.

**Example 1.** Find $\det A$ for $A=\begin{bmatrix}1&2&3\\4&5&6\\7&8&10\end{bmatrix}$ by expanding along row 1.

1. Entry $1$, sign $+$, minor $\begin{vmatrix}5&6\\8&10\end{vmatrix}=50-48=2$.
2. Entry $2$, sign $-$, minor $\begin{vmatrix}4&6\\7&10\end{vmatrix}=40-42=-2$.
3. Entry $3$, sign $+$, minor $\begin{vmatrix}4&5\\7&8\end{vmatrix}=32-35=-3$.

$$\det A=1\cdot(2)-2\cdot(-2)+3\cdot(-3)=2+4-9=-3.$$

**Sarrus shortcut (3×3 only).** Write the first two columns again on the right. Add the three products going down to the right, then subtract the three products going up to the right:

$$\begin{matrix}1&2&3&1&2\\4&5&6&4&5\\7&8&10&7&8\end{matrix}\qquad (1\cdot5\cdot10+2\cdot6\cdot7+3\cdot4\cdot8)-(7\cdot5\cdot3+8\cdot6\cdot1+10\cdot4\cdot2)=230-233=-3.$$

> **Watch out:** Sarrus does not work for $4\times4$ or bigger matrices. Use cofactors or row operations there.

### The properties

These hold for every square matrix. Each comes with a short reason.

1. $|A^T|=|A|$. So every rule below for rows also works for columns.
2. **Swapping two rows** flips the sign. For $2\times2$: $\begin{vmatrix}c&d\\a&b\end{vmatrix}=cb-da=-(ad-bc)$.
3. **Multiplying one row by $k$** multiplies the determinant by $k$: every term of the expansion along that row picks up the factor $k$.
4. **Two equal rows** give $0$. Swapping them changes nothing, yet must flip the sign, so $D=-D$, which forces $D=0$. The same holds for two **proportional** rows (take the factor out first) and for a **zero row**.
5. **Adding a multiple of one row to another** changes nothing. In the picture, adding a multiple of one column to the other slides one side of the parallelogram along the other side: same base, same height, same area.
6. **Triangular** (or diagonal): the determinant is the product of the diagonal entries. Expand along the first column: its only non-zero entry is $a_{11}$, which leaves a smaller triangular matrix. Repeat.
7. $|AB|=|A|\,|B|$: applying one matrix after the other scales area by both factors.
8. $|kA|=k^n|A|$ for an $n\times n$ matrix, because all $n$ rows get multiplied by $k$. In particular $|-A|=(-1)^n|A|$.

> **Watch out:** $|A+B|\neq|A|+|B|$ in general. With $A=B=$ the $2\times2$ identity, $|2I|=4$ but $|A|+|B|=2$. Two singular matrices can even add up to a non-singular one, $\begin{bmatrix}1&0\\0&0\end{bmatrix}+\begin{bmatrix}0&0\\0&1\end{bmatrix}=I$, and two non-singular ones can add up to a singular one, $I+(-I)=O$.

### Row operations: the fast way for big determinants

| Row operation | Effect on the determinant |
|---|---|
| swap two rows | multiply by $-1$ |
| multiply a row by $k$ | multiply by $k$ |
| add $k$ times one row to another | no change |

So you can reduce a matrix to triangular form, keeping track of any swaps and scalings, and then multiply the diagonal.

**Example 2.** Find $\det\begin{bmatrix}1&2&1\\2&5&3\\1&3&4\end{bmatrix}$.

1. $R_2\to R_2-2R_1$ makes row 2 equal to $(0,1,1)$. No change to the determinant.
2. $R_3\to R_3-R_1$ makes row 3 equal to $(0,1,3)$. No change.
3. $R_3\to R_3-R_2$ makes row 3 equal to $(0,0,2)$. No change.

The matrix is now $\begin{bmatrix}1&2&1\\0&1&1\\0&0&2\end{bmatrix}$, so the determinant is $1\cdot1\cdot2=2$.

### Special patterns GATE uses

- **Make two rows equal to find a factor.** If putting $a=b$ makes two rows equal, the determinant becomes $0$, so $(a-b)$ is a factor. This is how you find $\begin{vmatrix}1&a&bc\\1&b&ca\\1&c&ab\end{vmatrix}=(a-b)(b-c)(c-a)$: putting $b=c$ or $c=a$ also makes two rows equal, giving the other two factors, and trying $a=1$, $b=2$, $c=3$ (both sides equal $2$) shows that no extra constant is needed.
- **Vandermonde.** Rows of the form $(1,x,x^2,\dots)$ give the product of all the differences "later value minus earlier value": $\begin{vmatrix}1&x&x^2\\1&y&y^2\\1&z&z^2\end{vmatrix}=(y-x)(z-x)(z-y)$. The same works for $4\times4$ with rows $(1,x,x^2,x^3)$.
- **Rows in arithmetic progression** (each row is the previous one plus the same step), like $\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}$: here $R_3-R_2=R_2-R_1$, so after those two subtractions two rows are equal and the determinant is $0$.
- **A column times a row**, $uv^T$, of size 2 or more: every row is a multiple of $v^T$, so the rows are proportional and the determinant is $0$.
- **Skew-symmetric of odd size:** $|A|=|A^T|=|-A|=(-1)^n|A|=-|A|$ when $n$ is odd, so $|A|=0$.
- **Orthogonal:** $A^TA=I$ gives $|A^T|\,|A|=1$, so $|A|^2=1$ and $|A|=\pm1$.
- **Cyclic rows** $\begin{vmatrix}p&q&r\\q&r&p\\r&p&q\end{vmatrix}$: add the other two columns to column 1. Every entry of column 1 becomes $p+q+r$, so $(p+q+r)$ is a factor. The full value is $-(p^3+q^3+r^3-3pqr)=-(p+q+r)(p^2+q^2+r^2-pq-qr-rp)$.
- **Tridiagonal** ($a$ on the diagonal, $b$ just above and just below it, $0$ elsewhere): if $D_n$ is the determinant of size $n$, expanding along the first row gives $D_n=aD_{n-1}-b^2D_{n-2}$. With $a=3$ and $b=1$ the values are $3, 8, 21, 55,\dots$

### How GATE asks this

- A $4\times4$ determinant with many zeros (expand along the sparse row or column), or a triangular one.
- The effect of row and column operations: swaps, additions, scalings.
- Which expression is a factor of, or equal to, a given determinant.
- True/false statements about $|AB|$, $|A+B|$, $|kA|$ and sums of singular matrices.

**GATE 2000 (1 mark).** Find $\det\begin{bmatrix}2&0&0&0\\8&1&7&2\\2&0&2&0\\9&0&6&1\end{bmatrix}$. ([GATE 2000 Q.1.3](#/q/es_e8cEFohcZN5PF9dS))

1. Row 1 is $(2,0,0,0)$, so expand along it. Only the entry $2$, with sign $+$, survives: $\det=2\begin{vmatrix}1&7&2\\0&2&0\\0&6&1\end{vmatrix}$.
2. In this $3\times3$, column 1 is $(1,0,0)$, so expand along it: $\begin{vmatrix}1&7&2\\0&2&0\\0&6&1\end{vmatrix}=1\cdot\begin{vmatrix}2&0\\6&1\end{vmatrix}=2\cdot1-0\cdot6=2$.
3. So $\det=2\times2=4$, option (A).

**GATE 2015 (2 marks).** Start with $\begin{bmatrix}3&4&45\\7&9&105\\13&2&195\end{bmatrix}$. (i) Add the third row to the second row. (ii) Subtract the third column from the first column. What is the determinant of the result? ([GATE 2015 Set 2 Q.27](#/q/es_8kIW6X61Gf4BN2qZ))

Neither operation changes the determinant, because each adds a multiple of one row (or column) to another. So the answer is the determinant of the original matrix. Its third column is $15$ times its first, $(45,105,195)=15\,(3,7,13)$, and proportional columns give $0$. The answer is **0**.

### Quick check

**1.** Find $\det\begin{bmatrix}4&7\\2&3\end{bmatrix}$.

<details><summary>Show answer</summary>

$4\cdot3-7\cdot2=12-14=-2$.

</details>

**2.** Find $\det\begin{bmatrix}2&0&1\\1&3&2\\1&1&2\end{bmatrix}$.

<details><summary>Show answer</summary>

Expand along row 1, which has a zero: $2\begin{vmatrix}3&2\\1&2\end{vmatrix}-0+1\begin{vmatrix}1&3\\1&1\end{vmatrix}=2(6-2)+1(1-3)=8-2=6$.

</details>

**3.** $A$ is $3\times3$ with $|A|=2$. Find $|2A|$, $|A^T|$, $|A^2|$ and $|-A|$.

<details><summary>Show answer</summary>

$|2A|=2^3\cdot2=16$, $|A^T|=|A|=2$, $|A^2|=|A|\,|A|=4$ and $|-A|=(-1)^3\cdot2=-2$.

</details>

**4.** $A$ is $3\times3$ with $|A|=3$. $B$ is made from $A$ by swapping rows 1 and 3 and then multiplying row 2 by 5. Find $|B|$.

<details><summary>Show answer</summary>

The swap changes $3$ to $-3$. Multiplying a row by 5 then gives $-15$. So $|B|=-15$.

</details>

**5.** Without expanding, find $\det\begin{bmatrix}0&2&-1\\-2&0&4\\1&-4&0\end{bmatrix}$.

<details><summary>Show answer</summary>

The matrix is skew-symmetric with odd size 3, so its determinant is $0$. Check by expanding along row 1: $0-2(0-4)+(-1)(8-0)=8-8=0$.

</details>

### Practice from GATE

- [GATE 1997 Q.1.3](#/q/es_9FMQQn1UNo7OfKFm): a triangular $4\times4$ determinant.
- [GATE IT 2005 Q.3](#/q/es_wXOM3xPf9ROA32Mq): a $4\times4$ with a sparse row.
- [GATE 2023 Q.8](#/q/es_1lfezg778): two matrices whose rows are swapped.
- [GATE 2024 Set 2 Q.37](#/q/es_lwug8ben): what a row swap keeps and what it changes.
- [GATE 2001 Q.1.1](#/q/es_RuD2saodRkOOCyCQ): sums of singular and non-singular matrices.
- [GATE 1998 Q.2.2](#/q/es_TQ2jpbpkrNQXkrWv): finding a factor of a determinant.
- [GATE 2013 Q.3](#/q/es_OYTGycmf9SCtEq0C): column operations on a Vandermonde determinant.
- [GATE IT 2004 Q.32](#/q/es_itK2sw5aksYwbHoy): the tridiagonal determinant recurrence.

## Inverse of a matrix {#inverse}

*Tell when a matrix has an inverse, find it by the adjoint formula or by Gauss–Jordan, and use the inverse and adjoint rules GATE tests.*

### The idea

With numbers, dividing by 5 is the same as multiplying by $\tfrac15$, the number that undoes "times 5": $5\times\tfrac15=1$. Matrices have no division, but you can still look for a matrix that undoes $A$.

The **inverse** of a square matrix $A$ is the matrix $A^{-1}$ with

$$AA^{-1}=A^{-1}A=I.$$

If it exists, $A$ is called **invertible**. Then an equation $Ax=b$ (a whole system of equations at once) is solved by $x=A^{-1}b$, just as $5x=10$ is solved by $x=\tfrac15\cdot10$.

Not every matrix has an inverse, just as $0$ has no reciprocal. If $\det A=0$, the matrix squashes the plane onto a line, and many points land on the same point. Nothing can undo that, because you cannot tell which point you started from. Taking determinants of $AA^{-1}=I$ also shows it: $|A|\,|A^{-1}|=1$, so $|A|$ cannot be $0$.

> **Remember:** a square matrix $A$ has an inverse exactly when $\det A\neq0$, that is, when $A$ is non-singular. Then $|A^{-1}|=\dfrac{1}{|A|}$.

Two more facts. The inverse is unique: if $B$ and $C$ both undo $A$, then $B=B(AC)=(BA)C=C$. And for square matrices one side is enough: if $AB=I$, then $BA=I$ too, so $B=A^{-1}$.

### The 2×2 formula

$$\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}.$$

In words: swap the two diagonal entries, change the sign of the other two, and divide by the determinant.

**Example.** For $A=\begin{bmatrix}2&1\\5&3\end{bmatrix}$, $\det A=6-5=1$, so $A^{-1}=\begin{bmatrix}3&-1\\-5&2\end{bmatrix}$. Check: $AA^{-1}=\begin{bmatrix}2\cdot3+1\cdot(-5)&2\cdot(-1)+1\cdot2\\5\cdot3+3\cdot(-5)&5\cdot(-1)+3\cdot2\end{bmatrix}=\begin{bmatrix}1&0\\0&1\end{bmatrix}$.

### Cofactors and the adjoint

Recall from the determinants lesson that the cofactor $C_{ij}$ is $(-1)^{i+j}$ times the minor of $a_{ij}$. Put all the cofactors in a matrix and transpose it. The result is the **adjoint** of $A$ (also called the adjugate), written $\operatorname{adj}A$:

$$\operatorname{adj}A=\begin{bmatrix}C_{ij}\end{bmatrix}^T,\qquad A\,(\operatorname{adj}A)=(\operatorname{adj}A)\,A=|A|\,I,\qquad A^{-1}=\frac{\operatorname{adj}A}{|A|}.$$

**Why $A\,(\operatorname{adj}A)=|A|I$.** A diagonal entry of this product is a row of $A$ times its own cofactors, which is exactly the expansion of $|A|$ along that row. An off-diagonal entry is a row of $A$ times the cofactors of a different row. That is the expansion of a determinant in which that row appears twice, so it is $0$.

For a $2\times2$ matrix the cofactors are $C_{11}=d$, $C_{12}=-c$, $C_{21}=-b$, $C_{22}=a$, so $\operatorname{adj}A=\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$: the $2\times2$ formula again.

**Example (GATE 1994).** Find the inverse of $A=\begin{bmatrix}1&0&1\\-1&1&1\\0&1&0\end{bmatrix}$.

1. Determinant, along row 1: $1\cdot(1\cdot0-1\cdot1)-0+1\cdot((-1)\cdot1-1\cdot0)=-1-1=-2$. It is not $0$, so the inverse exists.
2. Cofactors, row by row (with the checkerboard signs):
   - row 1: $C_{11}=+(0-1)=-1$, $C_{12}=-(0-0)=0$, $C_{13}=+(-1-0)=-1$;
   - row 2: $C_{21}=-(0-1)=1$, $C_{22}=+(0-0)=0$, $C_{23}=-(1-0)=-1$;
   - row 3: $C_{31}=+(0-1)=-1$, $C_{32}=-(1+1)=-2$, $C_{33}=+(1-0)=1$.
3. Transpose the cofactor matrix to get the adjoint, then divide by $-2$:

$$\operatorname{adj}A=\begin{bmatrix}-1&1&-1\\0&0&-2\\-1&-1&1\end{bmatrix},\qquad A^{-1}=\frac{1}{-2}\operatorname{adj}A=\begin{bmatrix}\tfrac12&-\tfrac12&\tfrac12\\0&0&1\\\tfrac12&\tfrac12&-\tfrac12\end{bmatrix}.$$

4. Quick check: row 3 of $A$ is $(0,1,0)$, so row 3 of $AA^{-1}$ is just row 2 of $A^{-1}$, which is $(0,0,1)$. That is row 3 of $I$, as it should be.

### Gauss–Jordan: from [A | I] to [I | A⁻¹]

For bigger matrices there is a faster method. Write $A$ and $I$ side by side. Use row operations (swap two rows, multiply a row by a non-zero number, add a multiple of one row to another) to turn the left half into $I$. The right half then becomes $A^{-1}$.

Why it works: every row operation is a multiplication on the left by some matrix. If all of them together turn $A$ into $I$, their combined matrix $E$ satisfies $EA=I$, so $E=A^{-1}$. The same operations turn the right half into $EI=A^{-1}$.

**Example.** Invert $A=\begin{bmatrix}1&0&2\\0&1&0\\1&0&3\end{bmatrix}$.

$$\left[\begin{array}{ccc|ccc}1&0&2&1&0&0\\0&1&0&0&1&0\\1&0&3&0&0&1\end{array}\right]\xrightarrow{R_3-R_1}\left[\begin{array}{ccc|ccc}1&0&2&1&0&0\\0&1&0&0&1&0\\0&0&1&-1&0&1\end{array}\right]\xrightarrow{R_1-2R_3}\left[\begin{array}{ccc|ccc}1&0&0&3&0&-2\\0&1&0&0&1&0\\0&0&1&-1&0&1\end{array}\right]$$

So $A^{-1}=\begin{bmatrix}3&0&-2\\0&1&0\\-1&0&1\end{bmatrix}$. Check row 1 of $A$ against the columns of $A^{-1}$: $(1\cdot3+2\cdot(-1),\ 0,\ 1\cdot(-2)+2\cdot1)=(1,0,0)$.

### Rules for inverses

$$(AB)^{-1}=B^{-1}A^{-1},\qquad (A^{-1})^{-1}=A,\qquad (A^T)^{-1}=(A^{-1})^T,\qquad (kA)^{-1}=\tfrac1k A^{-1},\qquad (A^k)^{-1}=(A^{-1})^k.$$

- **Order reverses**, like taking off shoes and socks: the last thing put on comes off first. Check: $(AB)(B^{-1}A^{-1})=A(BB^{-1})A^{-1}=AA^{-1}=I$.
- **Transpose:** transposing $AA^{-1}=I$ gives $(A^{-1})^TA^T=I$, so $(A^{-1})^T$ is the inverse of $A^T$.
- **Diagonal:** invert each diagonal entry (all must be non-zero).
- **Orthogonal:** $A^TA=I$ says exactly that $A^{-1}=A^T$.
- **Cancelling:** if $A$ is invertible, $AB=AC$ gives $B=C$ (multiply on the left by $A^{-1}$). Without an inverse this fails: $\begin{bmatrix}1&1\\2&2\end{bmatrix}\begin{bmatrix}-1&1\\1&-1\end{bmatrix}=O=\begin{bmatrix}1&1\\2&2\end{bmatrix}O$.

### Adjoint facts for an n×n matrix

$$|\operatorname{adj}A|=|A|^{n-1},\qquad \operatorname{adj}(\operatorname{adj}A)=|A|^{n-2}A,\qquad \operatorname{adj}(AB)=\operatorname{adj}B\,\operatorname{adj}A,\qquad \operatorname{adj}(kA)=k^{n-1}\operatorname{adj}A.$$

Where they come from: take determinants of $A\,(\operatorname{adj}A)=|A|I$. The right side $|A|\,I$ has determinant $|A|^n$ (by the rule $|kA|=k^n|A|$), so $|A|\,|\operatorname{adj}A|=|A|^n$ and $|\operatorname{adj}A|=|A|^{n-1}$. For the second rule, $\operatorname{adj}A=|A|A^{-1}$, so applying adj twice gives $|\operatorname{adj}A|\,(\operatorname{adj}A)^{-1}=|A|^{n-1}\cdot\dfrac{A}{|A|}=|A|^{n-2}A$.

**Example.** $A$ is $3\times3$ with $|A|=4$. Then $|A^{-1}|=\tfrac14$, $|\operatorname{adj}A|=4^2=16$, $\operatorname{adj}(\operatorname{adj}A)=4A$, and $|\operatorname{adj}(\operatorname{adj}A)|=|4A|=4^3\cdot4=256$.

### Inverse from a matrix equation

If a matrix satisfies a polynomial equation with a non-zero constant term, you can read off its inverse. Move the constant to one side and factor out $X$:

$$X^2-X+I=O\ \Longrightarrow\ I=X-X^2=X(I-X)\ \Longrightarrow\ X^{-1}=I-X.$$

> **GATE tip:** to check whether a given option is the inverse, multiply it by $A$ and see whether you get $I$. That is often quicker than computing $A^{-1}$ from scratch.

### How GATE asks this

- Find the inverse of a $2\times2$ or $3\times3$ matrix, or pick it from options.
- Rearrange products: $(AB)^{-1}$, or $B^{-1}$ from $ABCD=I$.
- Get the inverse from an equation such as $X^2-X+I=O$ or $L^2=L^{-1}$.
- Determinants of $A^{-1}$, $A^T$ and $\operatorname{adj}A$; "invertible" versus "non-zero determinant".

**GATE 2004 (1 mark).** $A,B,C,D$ are $n\times n$ matrices with non-zero determinants and $ABCD=I$. Find $B^{-1}$. ([GATE 2004 Q.27](#/q/es_VbO9VPTDFpbElo3U))

1. All four are invertible, since their determinants are non-zero.
2. Multiply $ABCD=I$ on the left by $A^{-1}$: $BCD=A^{-1}$.
3. Multiply on the right by $A$: $BCDA=I$, that is, $B\,(CDA)=I$.
4. For square matrices one side is enough, so $B^{-1}=CDA$, option (B).

A handy pattern: if $ABCD=I$, every cyclic shift also equals $I$: $BCDA=CDAB=DABC=I$.

**GATE IT 2004 (2 marks).** $X=\begin{bmatrix}a&1\\-a^2+a-1&1-a\end{bmatrix}$ satisfies $X^2-X+I=O$. Find $X^{-1}$. ([GATE IT 2004 Q.36](#/q/es_yNN6nIRaHAjDGDiL))

From the equation, $X(I-X)=I$, so

$$X^{-1}=I-X=\begin{bmatrix}1-a&-1\\a^2-a+1&a\end{bmatrix},$$

which is option (B). Check with the $2\times2$ formula: $\det X=a(1-a)-(-a^2+a-1)=a-a^2+a^2-a+1=1$, and swapping the diagonal and negating the other two entries of $X$ gives the same matrix.

### Quick check

**1.** Find the inverse of $\begin{bmatrix}4&3\\1&1\end{bmatrix}$.

<details><summary>Show answer</summary>

The determinant is $4-3=1$. Swap the diagonal and negate the rest: $\begin{bmatrix}1&-3\\-1&4\end{bmatrix}$.

</details>

**2.** $A$ is $3\times3$ with $|A|=5$. Find $|A^{-1}|$, $|\operatorname{adj}A|$ and $|\operatorname{adj}(\operatorname{adj}A)|$.

<details><summary>Show answer</summary>

$|A^{-1}|=\tfrac15$. $|\operatorname{adj}A|=5^{3-1}=25$. $\operatorname{adj}(\operatorname{adj}A)=5^{3-2}A=5A$, so its determinant is $5^3\cdot5=625$.

</details>

**3.** A matrix satisfies $A^2-3A+2I=O$. Write $A^{-1}$ in terms of $A$.

<details><summary>Show answer</summary>

Move $2I$ to the other side: $2I=3A-A^2=A(3I-A)$. Divide by 2: $A\cdot\tfrac12(3I-A)=I$, so $A^{-1}=\tfrac12(3I-A)$.

</details>

**4.** Does $\begin{bmatrix}2&4\\3&6\end{bmatrix}$ have an inverse?

<details><summary>Show answer</summary>

No. Its determinant is $2\cdot6-4\cdot3=0$; the second row is $\tfrac32$ times the first.

</details>

**5.** $A$ and $B$ are $2\times2$ with $AB=I$. Let $C=AP$ with $P=\begin{bmatrix}1&0\\1&1\end{bmatrix}$. Find $C^{-1}$ in terms of the entries of $B$.

<details><summary>Show answer</summary>

$AB=I$ means $A^{-1}=B$. So $C^{-1}=(AP)^{-1}=P^{-1}A^{-1}=P^{-1}B$, with $P^{-1}=\begin{bmatrix}1&0\\-1&1\end{bmatrix}$ (its determinant is 1). Multiplying on the left by $P^{-1}$ subtracts row 1 from row 2: $C^{-1}=\begin{bmatrix}b_{11}&b_{12}\\b_{21}-b_{11}&b_{22}-b_{12}\end{bmatrix}$. This is GATE 1996 Q.10.

</details>

### Practice from GATE

- [GATE 2019 Q.9](#/q/es_WFa4NDX4wuDkVAhX8J7km5fk04oen72): "invertible" versus "non-zero determinant".
- [GATE 1994 Q.3.12](#/q/es_vIhiMWAscv2DfZjn): the inverse of a $3\times3$ matrix.
- [GATE 2004 Q.27](#/q/es_VbO9VPTDFpbElo3U): $B^{-1}$ from $ABCD=I$.
- [GATE IT 2004 Q.36](#/q/es_yNN6nIRaHAjDGDiL): the inverse from $X^2-X+I=O$.
- [GATE 1996 Q.10](#/q/es_5pLO4DHFpjgv7EzT): the inverse of a product.
- [GATE 2025 Set 2 Q.4](#/q/es_m80a3r02): $L^2=L^{-1}$ forces $L^3=I$.

## Linear independence and rank {#rank}

*Tell whether vectors are independent, reduce a matrix to row echelon form, find its rank, and use the rank facts GATE tests.*

### The idea

Look at the vectors $(2,1)$ and $(4,2)$. The second is just twice the first, so it adds nothing new: both point along the same line. Now look at $(2,1)$ and $(1,3)$. They point in different directions, and together they can reach every point of the plane.

That is the whole idea of this lesson. A set of vectors either contains a **redundant** vector, one you could build from the others, or it does not. The **rank** of a matrix counts how many of its rows are genuinely new.

### Linear independence

Scaling some vectors and adding them up, $c_1v_1+c_2v_2+\dots+c_kv_k$, is called a **linear combination** of them.

- The vectors are **linearly dependent** if one of them is a linear combination of the others: it is redundant.
- They are **linearly independent** if none of them is.

The standard test: the vectors are independent exactly when $c_1v_1+\dots+c_kv_k=0$ forces every $c_i=0$. If some combination with a non-zero $c_i$ gives $0$, you can solve it for $v_i$, which shows $v_i$ is redundant.

- **Two vectors** are dependent exactly when one is a multiple of the other.
- A set that contains the **zero vector** is always dependent, since $1\cdot0=0$.
- $(1,0,0)$, $(0,1,0)$ and $(1,1,0)$ are dependent: the third is the first plus the second.
- More than $n$ vectors, each with $n$ entries, are always dependent. For example, any three vectors in the plane are dependent.

### Rank

The **rank** of a matrix is the largest number of linearly independent rows it has. A remarkable fact: this always equals the largest number of linearly independent **columns**. So $\operatorname{rank}A=\operatorname{rank}A^T$, and an $m\times n$ matrix has $\operatorname{rank}A\le\min(m,n)$.

For example, $\begin{bmatrix}1&2&3\\2&4&6\\1&1&1\end{bmatrix}$ has rank 2. Row 2 is twice row 1, so it is redundant, but rows 1 and 3 are not multiples of each other.

Only the zero matrix has rank $0$.

### Row echelon form, step by step

For bigger matrices you cannot spot the redundancy by eye. Row operations (swap rows, multiply a row by a non-zero number, add a multiple of one row to another) do not change the rank, because every new row is a combination of the old ones and the steps can be undone. So you simplify the matrix until the answer is obvious.

The target shape is **row echelon form**, a staircase:

- any all-zero rows are at the bottom;
- in every non-zero row, the first non-zero entry (called the **pivot**) is further right than the pivot of the row above.

Then **rank = number of non-zero rows = number of pivots**. The steps:

1. Find the first column that has a non-zero entry. If needed, swap a row with a non-zero entry there to the top. That entry is the pivot.
2. Subtract multiples of the pivot row from the rows below, to make every entry under the pivot $0$.
3. Cover the top row and repeat on the rows below it, until no non-zero rows are left.

**Example.** Find the rank of $A=\begin{bmatrix}1&2&1&3\\2&4&3&7\\3&6&4&10\end{bmatrix}$.

1. The pivot is the $1$ in the top-left corner. $R_2\to R_2-2R_1$ gives $(0,0,1,1)$ and $R_3\to R_3-3R_1$ gives $(0,0,1,1)$.
2. Now cover row 1. In the rows below, column 2 is all zero, so the next pivot is the $1$ in column 3 of row 2. $R_3\to R_3-R_2$ gives $(0,0,0,0)$.

$$\begin{bmatrix}1&2&1&3\\0&0&1&1\\0&0&0&0\end{bmatrix}\quad\Rightarrow\quad \operatorname{rank}A=2.$$

This makes sense: in the original matrix, row 3 is row 1 plus row 2. The columns tell the same story. The pivots sit in columns 1 and 3, and those two columns of $A$ are independent, while the others are built from them: column 2 is twice column 1, and column 4 is twice column 1 plus column 3. Two independent rows, two independent columns: each pivot uses up one row and one column.

### Rank from determinants

The rank is also the size of the largest square block with a non-zero determinant, where a block keeps some rows and the same number of columns. (A block with a non-zero determinant has independent rows, so the rank is at least its size.) For a square $n\times n$ matrix this gives: **rank $n$ exactly when $\det A\neq0$**. For small matrices this is often the fastest route.

**Example (GATE 1994).** Find the rank of $\begin{bmatrix}0&0&-3\\9&3&5\\3&1&1\end{bmatrix}$.

1. Expand along row 1, where only the $-3$ is non-zero: $\det=-3\begin{vmatrix}9&3\\3&1\end{vmatrix}=-3(9-9)=0$. So the rank is less than 3.
2. Rows 1 and 2 with columns 2 and 3 give $\begin{vmatrix}0&-3\\3&5\end{vmatrix}=0\cdot5-(-3)\cdot3=9\neq0$. So the rank is at least 2.
3. Hence the rank is **2**.

### The big picture for square matrices

A matrix times a vector is a combination of its columns: $\begin{bmatrix}1&2\\3&4\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}=x\begin{bmatrix}1\\3\end{bmatrix}+y\begin{bmatrix}2\\4\end{bmatrix}$. So "$Ax=0$ for some non-zero $x$" says exactly that the columns are dependent. Putting the lessons so far together:

> **Remember:** for an $n\times n$ matrix $A$, these all mean the same thing: $\det A\neq0$; $A$ is invertible; $\operatorname{rank}A=n$; the rows are independent; the columns are independent; $Ax=0$ only for $x=0$. Their opposites also go together: $\det A=0$, some row is a combination of the others, and $Ax=0$ for some non-zero $x$.

That is why GATE 1987 answers "a square matrix is singular whenever its rows are linearly dependent".

### Rank facts

- $\operatorname{rank}A^T=\operatorname{rank}A$, and $\operatorname{rank}(A^TA)=\operatorname{rank}(AA^T)=\operatorname{rank}A$.
- $\operatorname{rank}(AB)\le\min(\operatorname{rank}A,\operatorname{rank}B)$. Every column of $AB$ is $A$ times a column of $B$, so it is a combination of the columns of $A$; likewise every row of $AB$ is a combination of the rows of $B$. A product cannot create new directions.
- $\operatorname{rank}(A+B)\le\operatorname{rank}A+\operatorname{rank}B$. For example, $\begin{bmatrix}1&0\\0&0\end{bmatrix}+\begin{bmatrix}0&0\\0&1\end{bmatrix}=I$ has rank $2=1+1$.
- **Sylvester's inequality:** if $A$ is $m\times n$ and $B$ is $n\times p$, then $\operatorname{rank}(AB)\ge\operatorname{rank}A+\operatorname{rank}B-n$. So two $3\times3$ matrices of rank 2 have a product of rank at least $2+2-3=1$.
- Multiplying by an invertible matrix, on either side, does not change the rank.

> **Watch out:** $\operatorname{rank}(AB)$ is not $\operatorname{rank}A\cdot\operatorname{rank}B$. Take $A=B=I_2$, the $2\times2$ identity: $\operatorname{rank}(AB)=2$ but $2\cdot2=4$.

### Rank of special matrices

- **Rank 1:** every row is a multiple of one non-zero row. Such a matrix is always a column times a row, $uv^T$. For example $\begin{bmatrix}2\\-4\\7\end{bmatrix}\begin{bmatrix}1&9&5\end{bmatrix}=\begin{bmatrix}2&18&10\\-4&-36&-20\\7&63&35\end{bmatrix}$: its rows are $2$, $-4$ and $7$ times $(1,9,5)$. A square rank-1 matrix of size 2 or more has determinant $0$.
- **All rows equal** (and not all zero): rank 1. In particular the $n\times n$ **all-ones matrix** $J$ has rank 1.
- **Identity:** rank $n$. **Diagonal:** the number of non-zero diagonal entries.
- **Triangular with no zero on the diagonal:** rank $n$, since its determinant is the product of the diagonal. With zeros on the diagonal, count with echelon form instead: $\begin{bmatrix}0&1\\0&0\end{bmatrix}$ has rank 1.

### How GATE asks this

- Find the rank of a given $3\times3$ or $4\times4$ matrix (often a 1-mark numerical answer).
- The rank of a sum $P+Q$, or of a matrix with repeated or proportional rows.
- True/false statements about $\operatorname{rank}(AB)$, $\operatorname{rank}(A+B)$, $\det(AB)$ and $\det(A+B)$.
- What a zero determinant implies about rows, columns and $Mx=0$.

**GATE 2017 (1 mark).** $P=\begin{bmatrix}1&1&-1\\2&-3&4\\3&-2&3\end{bmatrix}$ and $Q=\begin{bmatrix}-1&-2&-1\\6&12&6\\5&10&5\end{bmatrix}$. Find the rank of $P+Q$. ([GATE 2017 Set 2 Q.22](#/q/es_TtXI4Hj3CSoKui4c))

1. Add entry by entry: $P+Q=\begin{bmatrix}0&-1&-2\\8&9&10\\8&8&8\end{bmatrix}$.
2. Swap $R_1$ and $R_3$ to get a non-zero pivot on top: rows $(8,8,8)$, $(8,9,10)$, $(0,-1,-2)$.
3. $R_2\to R_2-R_1$ gives $(0,1,2)$. Then $R_3\to R_3+R_2$ gives $(0,0,0)$.
4. Two non-zero rows remain, so the rank is **2**.

**GATE 2020 (2 marks).** For $n\times n$ real matrices, which are true? I: $\operatorname{rank}(AB)=\operatorname{rank}A\cdot\operatorname{rank}B$. II: $\det(AB)=\det A\det B$. III: $\operatorname{rank}(A+B)\le\operatorname{rank}A+\operatorname{rank}B$. IV: $\det(A+B)\le\det A+\det B$. ([GATE 2020 Q.27](#/q/es_fa5Zl10N4Zb4Zc7KRK1da9i2ynkcsluqns))

- I is false: $A=B=I_2$ gives rank 2, not 4.
- II is true: it is the product rule for determinants.
- III is true: it is the sum rule for rank.
- IV is false: $A=B=I_2$ gives $\det(2I_2)=4$, which is more than $1+1=2$.

So only II and III hold: option (B).

### Quick check

**1.** Are $(1,0,1)$, $(0,1,1)$ and $(1,1,0)$ linearly independent?

<details><summary>Show answer</summary>

Put them as rows of a $3\times3$ matrix and take the determinant: $1(1\cdot0-1\cdot1)-0+1(0\cdot1-1\cdot1)=-1-1=-2\neq0$. So the rank is 3 and the vectors are independent.

</details>

**2.** Find the rank of $\begin{bmatrix}1&2&3\\2&4&6\\3&6&9\end{bmatrix}$.

<details><summary>Show answer</summary>

Rows 2 and 3 are $2$ and $3$ times row 1. Subtracting those multiples leaves one non-zero row, so the rank is 1.

</details>

**3.** $A$ is a $4\times6$ matrix. What is the largest rank it can have? Can its 6 columns be independent?

<details><summary>Show answer</summary>

The rank is at most $\min(4,6)=4$. The columns have only 4 entries each, so at most 4 of them can be independent; all 6 cannot be.

</details>

**4.** $A$ is $3\times3$ with rank 2, and $B$ is an invertible $3\times3$ matrix. What is $\operatorname{rank}(AB)$?

<details><summary>Show answer</summary>

Multiplying by an invertible matrix does not change the rank, so $\operatorname{rank}(AB)=2$.

</details>

### Practice from GATE

- [GATE 2002 Q.1.1](#/q/es_JLyKo8cBDJEaZwpF): the rank of a $2\times2$ matrix.
- [GATE 1995 Q.1.24](#/q/es_9QK9N0kfd2Z7yf9c): a matrix whose rows are all equal.
- [GATE 1994 Q.1.9](#/q/es_WkQdWllSlEpxBhHu): the rank of a $3\times3$ matrix.
- [GATE 2014 Set 2 Q.4](#/q/es_H8ygOKLNR4wm7OKs): the determinant of a column times a row.
- [GATE 1987](#/q/es_U5anOOhdcNj7JUSa): singular matrices and dependent rows.
- [GATE IT 2008 Q.29](#/q/es_K9RaXLxA3Yetjeqo): everything a zero determinant implies.
- [GATE 1998 Q.2.1](#/q/es_3hCC1kNLilT4Uk9N): the rank of a $4\times4$ matrix (check its determinant first).
- [GATE 2020 Q.27](#/q/es_fa5Zl10N4Zb4Zc7KRK1da9i2ynkcsluqns): rank and determinant of sums and products.

## Systems of linear equations {#linear-systems}

*Tell whether a system has no solution, one solution or infinitely many, solve it by Gaussian elimination, and handle the "for what value of k" questions GATE loves.*

### The idea

An equation is **linear** when each unknown appears only to the first power and unknowns are never multiplied together. So $2x+3y=5$ is linear, but $x^2+y=1$ and $xy+x=2$ are not. The numbers in front can be anything: $abx+a^2y\ge15$ is still linear in $x$ and $y$, because $ab$ and $a^2$ are just constants. ([GATE 1987](#/q/es_xRWAGsYPYhwPxFGT) asks exactly this, about an inequality.)

A **system** is a set of linear equations that must all hold at once. With two unknowns, each equation is a straight line, and a solution is a point lying on every line. Two lines can cross once, be parallel, or be the same line:

<figure class="fig"><svg viewBox="0 0 330 125" role="img" aria-label="Two lines in the plane: crossing at one point, parallel, or the same line">
<line x1="10" y1="95" x2="100" y2="15" stroke="var(--accent)" stroke-width="2.5"/>
<line x1="10" y1="25" x2="100" y2="95" stroke="currentColor" stroke-width="2"/>
<circle cx="52" cy="57.7" r="4" fill="currentColor"/>
<line x1="120" y1="70" x2="210" y2="15" stroke="var(--accent)" stroke-width="2.5"/>
<line x1="120" y1="100" x2="210" y2="45" stroke="currentColor" stroke-width="2"/>
<line x1="230" y1="90" x2="320" y2="20" stroke="var(--accent)" stroke-width="4"/>
<line x1="230" y1="90" x2="320" y2="20" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="55" y="118" font-size="12" fill="currentColor" text-anchor="middle">one solution</text>
<text x="165" y="118" font-size="12" fill="currentColor" text-anchor="middle">no solution</text>
<text x="275" y="118" font-size="12" fill="currentColor" text-anchor="middle">infinitely many</text>
</svg><figcaption>Two equations in $x$ and $y$ are two lines: they cross once, are parallel, or are the same line.</figcaption></figure>

With three unknowns each equation is a plane, and the same three outcomes appear. A linear system **never has exactly two solutions**: if two different points satisfy every equation, so does every point on the line through them (the one-line reason is in the section on homogeneous systems below).

> **Remember:** a linear system has no solution, exactly one, or infinitely many. Nothing in between.

### Writing a system as Ax = b

$$\begin{aligned}x+2y+3z&=6\\x+3y+4z&=8\\2x+2y+3z&=12\end{aligned}\qquad\Longleftrightarrow\qquad \begin{bmatrix}1&2&3\\1&3&4\\2&2&3\end{bmatrix}\begin{bmatrix}x\\y\\z\end{bmatrix}=\begin{bmatrix}6\\8\\12\end{bmatrix}.$$

$A$ is the **coefficient matrix**, $x$ the vector of unknowns and $b$ the right-hand side. Putting $b$ next to $A$ as an extra column gives the **augmented matrix** $[A\mid b]$. Each of its rows is one equation, written without the letters.

### Gaussian elimination

Three operations never change the solutions, because each one can be undone: swap two equations, multiply an equation by a non-zero number, and add a multiple of one equation to another. On the augmented matrix these are exactly the row operations. **Gaussian elimination** uses them to bring $[A\mid b]$ to row echelon form. Then **back substitution** solves the last equation first and works upwards.

**Example (GATE IT 2004).** Solve the system above. ([GATE IT 2004 Q.6](#/q/es_K4yGfkBR64vwlQNB))

1. $R_2\to R_2-R_1$ gives $(0,1,1\mid2)$, that is, $y+z=2$.
2. $R_3\to R_3-2R_1$ gives $(0,-2,-3\mid0)$.
3. $R_3\to R_3+2R_2$ gives $(0,0,-1\mid4)$, that is, $-z=4$.
4. Back substitution: $z=-4$. Then $y=2-z=6$. Then $x=6-2y-3z=6-12+12=6$.

Check in the third equation: $2(6)+2(6)+3(-4)=12$. The solution is $(6,6,-4)$, option (C).

### The rank test: none, one or infinitely many

After elimination, look at the rows. A row $(0\ 0\ \dots\ 0\mid c)$ with $c\neq0$ says $0=c$, which is impossible. That happens exactly when the augmented matrix has a larger rank than $A$. With $n$ unknowns:

| Ranks | Solutions |
|---|---|
| $\operatorname{rank}A<\operatorname{rank}[A\mid b]$ | none: the system is **inconsistent** |
| $\operatorname{rank}A=\operatorname{rank}[A\mid b]=n$ | exactly one |
| $\operatorname{rank}A=\operatorname{rank}[A\mid b]=r< n$ | infinitely many, with $n-r$ free variables |

A system with at least one solution is called **consistent**. In echelon form, each pivot column gives an unknown that back substitution fixes. The other unknowns are **free variables**: you may choose any values for them.

**Example (infinitely many).** $x+y+z=2$ and $x+2y+3z=3$. Subtracting the first from the second gives $y+2z=1$. The rank is 2 but there are 3 unknowns, so one is free: let $z=t$. Then $y=1-2t$ and $x=2-y-z=1+t$. Every $t$ gives a solution $(1+t,\,1-2t,\,t)$.

**For a square system** ($n$ equations, $n$ unknowns): if $\det A\neq0$ there is exactly one solution, $x=A^{-1}b$. If $\det A=0$ there is either none or infinitely many, and you must check which.

### Homogeneous systems: Ax = 0

When every right-hand side is $0$, the system is **homogeneous**. It is always consistent, because $x=0$ (the **trivial solution**) works.

- A **non-trivial** (non-zero) solution exists exactly when $\operatorname{rank}A< n$. For a square $A$, that means $\det A=0$.
- With **fewer equations than unknowns** there is always a non-trivial solution, since the rank is at most the number of equations.
- If $x_0$ is one solution of $Ax=b$, every solution is $x_0$ plus a solution of $Ax=0$. So two different solutions $u\neq v$ of $Ax=b$ give $A(u-v)=0$ with $u-v\neq0$: $A$ is singular, and every point $u+t(v-u)$ is a solution too, because $A\big(u+t(v-u)\big)=b+t(b-b)=b$. That is infinitely many solutions.

### "For what value of k?"

For a square system with an unknown constant $k$:

1. Find $\det A$ in terms of $k$. Every $k$ with $\det A\neq0$ gives a unique solution.
2. For each $k$ with $\det A=0$, put it in and eliminate. A row $0=c$ with $c\neq0$ means no solution; otherwise there are infinitely many.

For two equations $a_1x+b_1y=c_1$ and $a_2x+b_2y=c_2$ this becomes a ratio test. If $a_1:b_1$ differs from $a_2:b_2$, the lines cross once. If the left sides are proportional but the right sides do not follow the same ratio, the lines are parallel: no solution. If all three are in proportion, the lines coincide: infinitely many.

### Cramer's rule

If $D=\det A\neq0$, each unknown is a ratio of determinants: $x_i=\dfrac{D_i}{D}$, where $D_i$ is $\det A$ with column $i$ replaced by $b$.

**Example.** For $2x+3y=8$ and $x-y=-1$: $D=\begin{vmatrix}2&3\\1&-1\end{vmatrix}=-5$, $D_x=\begin{vmatrix}8&3\\-1&-1\end{vmatrix}=-5$ and $D_y=\begin{vmatrix}2&8\\1&-1\end{vmatrix}=-10$. So $x=1$ and $y=2$.

Cramer's rule is handy for $2\times2$ and $3\times3$ systems but far too slow for big ones, and it says nothing when $D=0$. Gaussian elimination needs about $\tfrac{n^3}{3}$ multiplications for $n$ equations, almost all in the elimination; back substitution adds only about $\tfrac{n^2}{2}$ ([GATE 1998 Q.9](#/q/go_v1_6.13.3) asks for this count).

### How GATE asks this

- Count the solutions of a given system, often with more equations than unknowns.
- For which value(s) of a constant there is a unique solution, no solution or infinitely many.
- When a homogeneous system has a non-trivial solution.
- True/false statements comparing the number of equations $m$ with unknowns $n$ ([GATE 1996 Q.1.7](#/q/es_81QHt8C17mnf6czn), [GATE 2016 Set 2 Q.4](#/q/es_vbBmcMfLHG9V78RT)), or about systems known to have two solutions ([GATE 2017 Set 1 Q.3](#/q/es_RVtvBmuMSpgCxHSQ)).

**GATE 2008 (1 mark).** The system $x_1+x_2+2x_3=1$, $x_1+2x_2+3x_3=2$, $x_1+4x_2+\alpha x_3=4$ has a unique solution. What are the possible values of $\alpha$? ([GATE 2008 Q.3](#/q/es_BkxM49FXfhOmqJlb))

1. $\det A=\begin{vmatrix}1&1&2\\1&2&3\\1&4&\alpha\end{vmatrix}=1(2\alpha-12)-1(\alpha-3)+2(4-2)=\alpha-5$.
2. The solution is unique exactly when $\alpha-5\neq0$: any real number except 5, option (D).
3. Check by elimination: $R_2-R_1$ gives $(0,1,1\mid1)$, $R_3-R_1$ gives $(0,3,\alpha-2\mid3)$, and then $R_3-3R_2$ gives $(0,0,\alpha-5\mid0)$. For $\alpha=5$ this row is $0=0$, so there are infinitely many solutions.

**GATE 2025 (1 mark, more than one answer).** For $x+ky=1$ and $kx+y=-1$, which are true? (A) exactly one $k$ gives no solution; (B) infinitely many $k$ give no solution; (C) exactly one $k$ gives exactly one solution; (D) exactly one $k$ gives infinitely many solutions. ([GATE 2025 Set 1 Q.13](#/q/es_m7wybbj7))

1. $\det=\begin{vmatrix}1&k\\k&1\end{vmatrix}=1-k^2$. For every $k\neq\pm1$ there is exactly one solution, so infinitely many $k$ give one solution.
2. $k=1$: the equations are $x+y=1$ and $x+y=-1$, parallel lines, so no solution.
3. $k=-1$: the equations are $x-y=1$ and $-x+y=-1$; the second is the first times $-1$, the same line, so infinitely many solutions.

So (A) and (D) are true.

### Quick check

**1.** How many solutions does $x+y=3$, $2x+2y=7$ have?

<details><summary>Show answer</summary>

None. Doubling the first equation gives $2x+2y=6$, which contradicts $2x+2y=7$: the lines are parallel.

</details>

**2.** Solve $x+y+z=6$, $y+z=5$, $z=3$.

<details><summary>Show answer</summary>

It is already in echelon form, so back-substitute: $z=3$, then $y=5-3=2$, then $x=6-2-3=1$.

</details>

**3.** For which $k$ does $kx+2y=0$, $2x+ky=0$ have a non-trivial solution?

<details><summary>Show answer</summary>

A homogeneous square system has a non-trivial solution exactly when $\det=0$: $k^2-4=0$, so $k=2$ or $k=-2$.

</details>

**4.** A consistent system has 3 equations, 5 unknowns and coefficient rank 3. How many solutions, and how many free variables?

<details><summary>Show answer</summary>

Infinitely many solutions, with $5-3=2$ free variables.

</details>

**5.** $ax+y=b$ and $16x+ay=24$ have more than one solution. Find $ab$.

<details><summary>Show answer</summary>

More than one solution needs $\det=a^2-16=0$, so $a=\pm4$, and the equations must be the same line. For $a=4$, the second equation divided by 4 is $4x+y=6$, so $b=6$. For $a=-4$, it is $-4x+y=-6$, so $b=-6$. Either way $ab=24$ ([GATE 2026 Set 2 Q.21](#/q/es_mmz0zo8n)).

</details>

### Practice from GATE

- [GATE 1998 Q.1.2](#/q/es_lE4DqhepexTi32f2): spotting an inconsistent pair of equations.
- [GATE 2004 Q.71](#/q/es_v9TzAX4PH9VTrLq1): three equations in two unknowns.
- [GATE 2005 Q.48](#/q/es_cEln34aoM3V1x2P6): a square system with a non-zero determinant.
- [GATE 2014 Set 1 Q.4](#/q/es_VEsJT8YB4tibzHln): four equations in three unknowns.
- [GATE 2003](#/q/es_jEL37aD0T9h7B5pN): when $AX=0$ has a non-trivial solution.
- [GATE 2006 Q.23](#/q/es_2BmPw0c5FbDwZNzD): what two different solutions force.
- [GATE 2003 Q.41](#/q/es_AohF8254m4ioX5Jo): for how many values of $\alpha$ there are infinitely many solutions.
- [GATE 2015 Set 3 Q.33](#/q/es_AU5Y9aRrvsYFeyqC): a homogeneous system with cyclic coefficients $p,q,r$.

## Vector spaces, basis and dimension {#vector-spaces}

*Work with lengths, dot products and perpendicular vectors, check whether a set of vectors is a subspace, find a basis and the dimension, and use rank–nullity.*

### The idea

A vector with $n$ entries can be pictured as an arrow (or a point) in $n$-dimensional space. All such vectors together are called $\mathbb{R}^n$: $\mathbb{R}^2$ is the plane and $\mathbb{R}^3$ is ordinary space. This lesson gives names to a few shapes inside these spaces (lines and planes through the origin, and their higher-dimensional cousins) and to the number of directions they contain. GATE asks only the basics, so that is all you need here.

### Vectors: length, dot product and angles

For vectors $u$ and $v$ in $\mathbb{R}^n$:

- the **dot product** is $u\cdot v=u^Tv=u_1v_1+u_2v_2+\dots+u_nv_n$;
- the **length** is $\lVert u\rVert=\sqrt{u\cdot u}=\sqrt{u_1^2+\dots+u_n^2}$, and a **unit vector** has length 1 ($u/\lVert u\rVert$ is the unit vector along $u$);
- the angle $\theta$ between them satisfies $u\cdot v=\lVert u\rVert\,\lVert v\rVert\cos\theta$, so $u$ and $v$ are **perpendicular** (also called **orthogonal**) exactly when $u\cdot v=0$.

In $\mathbb{R}^3$, the **cross product** $u\times v$ is a vector perpendicular to both $u$ and $v$. Compute it as a determinant whose first row holds the unit vectors $i,j,k$ along the axes:

$$u\times v=\begin{vmatrix}i&j&k\\u_1&u_2&u_3\\v_1&v_2&v_3\end{vmatrix}.$$

**Example (GATE 1995).** Find a unit vector perpendicular to both $a=2i-3j+k$ and $b=i+j-2k$. ([GATE 1995 Q.2.13](#/q/go_v1_6.14.1))

1. $a\times b=i\big((-3)(-2)-1\cdot1\big)-j\big(2\cdot(-2)-1\cdot1\big)+k\big(2\cdot1-(-3)\cdot1\big)=5i+5j+5k$.
2. Its length is $5\sqrt3$, so the unit vector is $\tfrac{1}{\sqrt3}(i+j+k)$, option (A).
3. Check: $(2,-3,1)\cdot(1,1,1)=0$ and $(1,1,-2)\cdot(1,1,1)=0$.

**Bisecting an angle.** Two unit vectors form a rhombus, and the diagonal of a rhombus cuts its angle in half. So $\dfrac{u}{\lVert u\rVert}+\dfrac{v}{\lVert v\rVert}$ bisects the angle between $u$ and $v$. If $\lVert u\rVert=2\lVert v\rVert$, multiplying by $\lVert u\rVert$ gives the same direction $u+2v$, so $w=u+\alpha v$ bisects the angle when $\alpha=2$ ([GATE 2017 Set 1 Q.30](#/q/go_v1_6.14.4)).

**Perpendicular vectors are independent.** Suppose non-zero $v_1,\dots,v_k$ are all perpendicular to each other and $c_1v_1+\dots+c_kv_k=0$. Take the dot product with $v_j$: every other term is $0$, leaving $c_j\lVert v_j\rVert^2=0$, so $c_j=0$. Since more than $n$ vectors in $\mathbb{R}^n$ are always dependent, **at most $n$** non-zero vectors in $\mathbb{R}^n$ can be mutually perpendicular. In $\mathbb{R}^{10}$ the maximum is 10 ([GATE 2021 Set 2 Q.37](#/q/es_40599uckwrzvlqi)).

### Span and subspaces

The **span** of some vectors is the set of all their linear combinations. In $\mathbb{R}^3$, the span of one non-zero vector is a line through the origin, and the span of two independent vectors is a plane through the origin.

A **subspace** is a set of vectors that passes three tests:

1. it contains the zero vector;
2. adding two of its vectors gives a vector still in the set;
3. scaling one of its vectors by any number gives a vector still in the set.

Every span is a subspace, and so are $\{0\}$ and $\mathbb{R}^n$ itself. So are lines and planes through the origin, and the set $\{x\in\mathbb{R}^3: x_1+x_2+x_3=0\}$ (if two vectors satisfy the equation, so do their sum and any multiple).

Not subspaces: the line $x+y=1$ (it misses $0$); the quarter-plane $x\ge0,\ y\ge0$ (scaling by $-1$ leaves it); the two axes together ($(1,0)+(0,1)=(1,1)$ is on neither axis).

### Basis and dimension

A **basis** of a subspace is a set of vectors that are linearly independent and span the subspace. Every vector in the subspace is then a combination of the basis vectors in exactly one way. All bases of a subspace have the same number of vectors, called its **dimension**.

- $\mathbb{R}^n$ has dimension $n$; one basis is $e_1=(1,0,\dots,0)$, $e_2=(0,1,0,\dots,0)$, and so on.
- In a subspace of dimension $d$, any $d$ independent vectors form a basis, more than $d$ vectors are always dependent, and fewer than $d$ cannot span it.

**Example (GATE 2007).** $X=\{x\in\mathbb{R}^3: x_1+x_2+x_3=0\}$. You may choose $x_2$ and $x_3$ freely, and then $x_1=-x_2-x_3$. So every vector in $X$ is

$$x=x_2\begin{bmatrix}-1\\1\\0\end{bmatrix}+x_3\begin{bmatrix}-1\\0\\1\end{bmatrix},$$

and $X$ has dimension 2. Hence $\{(1,-1,0),(1,0,-1)\}$ is also a basis: both vectors lie in $X$ ($1-1+0=0$ and $1+0-1=0$), they are not multiples of each other, and there are exactly 2 of them. ([GATE 2007 Q.27](#/q/es_2SnqT3oVr5ybs21k))

### Null space, column space and rank–nullity

For an $m\times n$ matrix $A$:

- the **column space** is the span of the columns, which is the set of all products $Ax$. Its dimension is $\operatorname{rank}A$. The system $Ax=b$ has a solution exactly when $b$ lies in the column space;
- the **row space** is the span of the rows; its dimension is also $\operatorname{rank}A$;
- the **null space** is the set of all solutions of $Ax=0$. It is a subspace of $\mathbb{R}^n$, and its dimension is called the **nullity** of $A$.

> **Remember (rank–nullity):** $\operatorname{rank}A+\operatorname{nullity}A=n$, the number of columns.

The reason: after elimination, each of the $n$ columns is either a pivot column (there are $\operatorname{rank}A$ of them) or a free variable, and each free variable gives one independent solution of $Ax=0$. So **the number of independent solutions of $Ax=0$ is $n-\operatorname{rank}A$**.

**Example.** In the rank lesson, $A=\begin{bmatrix}1&2&1&3\\2&4&3&7\\3&6&4&10\end{bmatrix}$ reduced to the rows $(1,2,1,3)$ and $(0,0,1,1)$, so its rank is 2 and its nullity must be $4-2=2$. To see the null space, note the pivots are in columns 1 and 3, so $x_2$ and $x_4$ are free. Row 2 gives $x_3=-x_4$. Row 1 gives $x_1=-2x_2-x_3-3x_4=-2x_2-2x_4$. So

$$x=x_2\begin{bmatrix}-2\\1\\0\\0\end{bmatrix}+x_4\begin{bmatrix}-2\\0\\-1\\1\end{bmatrix}:$$

two independent solutions, as promised.

### Two subspaces at once

For two subspaces $U$ and $W$ of the same space, $U+W$ means all sums $u+w$, and $U\cap W$ means the vectors lying in both. Their dimensions behave like counting with overlaps:

$$\dim(U+W)=\dim U+\dim W-\dim(U\cap W).$$

Since $U+W$ lies inside the whole space $V$, this gives $\dim(U\cap W)\ge\dim U+\dim W-\dim V$. For example, two 4-dimensional subspaces of a 6-dimensional space must share at least $4+4-6=2$ dimensions, and they can share exactly 2: take $\operatorname{span}(e_1,e_2,e_3,e_4)$ and $\operatorname{span}(e_3,e_4,e_5,e_6)$ ([GATE 2014 Set 3 Q.5](#/q/es_ukb1gCAatlGA25sg)).

### How GATE asks this

- Is a given set a subspace? Is a given set of vectors a basis?
- Rank–nullity: the rank from a described null space, or the number of independent solutions of $Ax=0$.
- The smallest possible dimension of an intersection.
- Perpendicular vectors, cross products, unit vectors and angle bisectors.

**GATE 2021 (1 mark).** $P$ is a $4\times5$ matrix, and every solution of $Px=0$ is a multiple of $(2,5,4,3,1)^T$. Find the rank of $P$. ([GATE 2021 Set 2 Q.24](#/q/es_40599udkwrzvwzf))

The null space is all multiples of one non-zero vector, so the nullity is 1. $P$ has 5 columns, so rank–nullity gives $\operatorname{rank}P=5-1=$ **4**.

**GATE 2024 (2 marks, more than one answer).** $A$ is $n\times m$ with $m>n$. Which are always true about $Ax=0$? (A) It has at least $m-n$ linearly independent solutions. (B) Some $m-n$ independent vectors span all its solutions. (C) It has a non-zero solution with at least $m-n$ zero variables. (D) It has a solution with at least $n$ non-zero variables. ([GATE 2024 Set 1 Q.39](#/q/es_lwudf9zw))

1. $A$ has $m$ columns and rank at most $n$, so the nullity is $m-\operatorname{rank}A\ge m-n$. That makes **(A) true**.
2. (B) needs the nullity to be exactly $m-n$. It fails for $A=\begin{bmatrix}0&0\end{bmatrix}$ ($n=1$, $m=2$): every vector of $\mathbb{R}^2$ is a solution, and one vector cannot span them all.
3. (C) fails for $A=\begin{bmatrix}1&1\end{bmatrix}$: the solutions are $t(1,-1)$, and a non-zero one has no zero entry.
4. (D) fails for $A=\begin{bmatrix}1&0&0\\0&1&0\end{bmatrix}$ ($n=2$, $m=3$): the solutions are $t(0,0,1)$, with at most one non-zero variable.

So only (A) is always true.

### Quick check

**1.** Is $\{(x,y): y=2x\}$ a subspace of $\mathbb{R}^2$? Is $\{(x,y): y=2x+1\}$?

<details><summary>Show answer</summary>

The first is a line through the origin, closed under adding and scaling, so it is a subspace. The second does not contain $(0,0)$, so it is not.

</details>

**2.** Find the dimension and a basis of $\{x\in\mathbb{R}^3: x_1-2x_2+x_3=0\}$.

<details><summary>Show answer</summary>

Choose $x_2,x_3$ freely; then $x_1=2x_2-x_3$. So $x=x_2(2,1,0)+x_3(-1,0,1)$: dimension 2, with basis $\{(2,1,0),(-1,0,1)\}$.

</details>

**3.** $A$ is $5\times7$ with rank 4. What is its nullity?

<details><summary>Show answer</summary>

$7-4=3$: the null space has 3 independent vectors.

</details>

**4.** Find a unit vector perpendicular to both $(1,0,1)$ and $(0,1,1)$.

<details><summary>Show answer</summary>

$(1,0,1)\times(0,1,1)=i(0\cdot1-1\cdot1)-j(1\cdot1-1\cdot0)+k(1\cdot1-0\cdot0)=(-1,-1,1)$. Its length is $\sqrt3$, so a unit vector is $\tfrac{1}{\sqrt3}(-1,-1,1)$. Check: both dot products are $-1+0+1=0$ and $0-1+1=0$.

</details>

### Practice from GATE

- [GATE 2007 Q.27](#/q/es_2SnqT3oVr5ybs21k): a basis for the plane $x_1+x_2+x_3=0$.
- [GATE 2021 Set 2 Q.24](#/q/es_40599udkwrzvwzf): the rank from the null space.
- [GATE 2026 Set 1 Q.10](#/q/es_mmz0yrji): what a vector in the null space tells you.
- [GATE 2024 Set 1 Q.39](#/q/es_lwudf9zw): independent solutions of $Ax=0$.
- [GATE 2014 Set 3 Q.5](#/q/es_ukb1gCAatlGA25sg): the dimension of an intersection.
- [GATE 2021 Set 2 Q.37](#/q/es_40599uckwrzvlqi): how many vectors can be mutually perpendicular.
- [GATE 1995 Q.2.13](#/q/go_v1_6.14.1): a unit vector perpendicular to two vectors.
- [GATE 2017 Set 1 Q.30](#/q/go_v1_6.14.4): the vector that bisects an angle.

## Eigenvalues and eigenvectors {#eigenvalues}

*Find the eigenvalues and eigenvectors of $2\times2$ and $3\times3$ matrices, test a claimed eigenvector, and use the trace and determinant shortcuts.*

### The idea

When a matrix multiplies a vector, the vector usually turns to a new direction. But a few special vectors do not turn: they only get stretched, shrunk or flipped. For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$:

$$A\begin{bmatrix}1\\2\end{bmatrix}=\begin{bmatrix}4\\5\end{bmatrix}\ \text{(turned)},\qquad A\begin{bmatrix}1\\1\end{bmatrix}=\begin{bmatrix}3\\3\end{bmatrix}=3\begin{bmatrix}1\\1\end{bmatrix}\ \text{(same direction, 3 times longer)}.$$

<figure class="fig"><svg viewBox="0 0 220 170" role="img" aria-label="The vector (1,2) is turned by A, while (1,1) stays on its line and becomes three times longer">
<line x1="20" y1="160" x2="210" y2="160" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="30" y1="168" x2="30" y2="15" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="30" y1="160" x2="54" y2="112" stroke="currentColor" stroke-width="2"/>
<circle cx="54" cy="112" r="3" fill="currentColor"/>
<line x1="30" y1="160" x2="126" y2="40" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/>
<circle cx="126" cy="40" r="3" fill="currentColor"/>
<line x1="30" y1="160" x2="102" y2="88" stroke="var(--accent)" stroke-width="2.5"/>
<line x1="30" y1="160" x2="54" y2="136" stroke="var(--accent)" stroke-width="6"/>
<circle cx="102" cy="88" r="3.5" fill="var(--accent)"/>
<text x="46" y="108" font-size="12" fill="currentColor" text-anchor="end">x</text>
<text x="132" y="44" font-size="12" fill="currentColor">Ax</text>
<text x="60" y="150" font-size="12" fill="currentColor">v</text>
<text x="108" y="96" font-size="12" fill="currentColor">Av = 3v</text>
</svg><figcaption>$x=(1,2)$ is turned to $Ax=(4,5)$, but $v=(1,1)$ stays on its own line: $Av=(3,3)=3v$.</figcaption></figure>

A non-zero vector $v$ with $Av=\lambda v$ is called an **eigenvector** of $A$, and the stretch factor $\lambda$ is the matching **eigenvalue** ("eigen" is German for "own": these are the matrix's own directions). The zero vector is never counted, because $A0=\lambda0$ for every $\lambda$. Only square matrices have eigenvalues.

### Finding them: the characteristic equation

Rewrite $Av=\lambda v$ as $Av-\lambda Iv=0$, that is,

$$(A-\lambda I)\,v=0.$$

This homogeneous system has a non-zero solution $v$ exactly when $A-\lambda I$ is singular. So:

> **Remember:** the eigenvalues are the roots of the **characteristic equation** $\det(A-\lambda I)=0$. For an $n\times n$ matrix, $\det(A-\lambda I)$ is a polynomial of degree $n$ in $\lambda$, the **characteristic polynomial**. For each eigenvalue, the eigenvectors are the non-zero solutions of $(A-\lambda I)v=0$.

Any non-zero multiple of an eigenvector is again an eigenvector, so an answer like "$(1,1)$" really means "any non-zero multiple of $(1,1)$".

### A full 2×2 example

**Example 1.** $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$.

1. $\det(A-\lambda I)=\begin{vmatrix}4-\lambda&1\\2&3-\lambda\end{vmatrix}=(4-\lambda)(3-\lambda)-2=\lambda^2-7\lambda+10=(\lambda-2)(\lambda-5)$.
2. The eigenvalues are $\lambda=2$ and $\lambda=5$.
3. $\lambda=5$: $A-5I=\begin{bmatrix}-1&1\\2&-2\end{bmatrix}$. Both rows say $-x+y=0$, so $y=x$ and $v=(1,1)$. Check: $A(1,1)=(5,5)=5(1,1)$.
4. $\lambda=2$: $A-2I=\begin{bmatrix}2&1\\2&1\end{bmatrix}$. Both rows say $2x+y=0$, so $v=(1,-2)$. Check: $A(1,-2)=(4-2,\ 2-6)=(2,-4)=2(1,-2)$.

Notice that $2+5=7=4+3$, the trace, and $2\times5=10=4\cdot3-1\cdot2$, the determinant. That is no accident; see below.

### A full 3×3 example

**Example 2.** $A=\begin{bmatrix}4&0&1\\2&3&2\\1&0&4\end{bmatrix}$.

1. Column 2 of $A-\lambda I$ has two zeros, so expand along it. Only the middle entry $3-\lambda$ survives, with sign $+$:

$$\det(A-\lambda I)=\begin{vmatrix}4-\lambda&0&1\\2&3-\lambda&2\\1&0&4-\lambda\end{vmatrix}=(3-\lambda)\big[(4-\lambda)^2-1\big].$$

2. Factor the bracket as a difference of squares: $(4-\lambda)^2-1=(3-\lambda)(5-\lambda)$. So $\det(A-\lambda I)=(3-\lambda)^2(5-\lambda)$, and the eigenvalues are $5$ and $3$ (twice).
3. $\lambda=5$: $A-5I=\begin{bmatrix}-1&0&1\\2&-2&2\\1&0&-1\end{bmatrix}$. Row 1 gives $z=x$. Row 2 gives $2x-2y+2z=0$, so $y=x+z=2x$. Taking $x=1$: $v=(1,2,1)$. Check: $A(1,2,1)=(5,10,5)=5(1,2,1)$.
4. $\lambda=3$: $A-3I=\begin{bmatrix}1&0&1\\2&0&2\\1&0&1\end{bmatrix}$. Every row says $x+z=0$, and $y$ does not appear, so two unknowns are free. This gives two independent eigenvectors, $(0,1,0)$ and $(1,0,-1)$. Check: $A(0,1,0)=(0,3,0)$ and $A(1,0,-1)=(3,0,-3)$.

Here $A-3I$ has rank 1, so by rank–nullity it has $3-1=2$ independent solutions. A repeated eigenvalue can have one eigenvector direction or several; the next lesson shows why that matters.

### Sum = trace, product = determinant

If the eigenvalues of an $n\times n$ matrix are $\lambda_1,\dots,\lambda_n$ (repeats counted, complex ones included), then

$$\lambda_1+\lambda_2+\dots+\lambda_n=\operatorname{tr}A,\qquad \lambda_1\lambda_2\cdots\lambda_n=\det A.$$

Why the product: the characteristic polynomial equals $(\lambda_1-\lambda)(\lambda_2-\lambda)\cdots(\lambda_n-\lambda)$, and putting $\lambda=0$ into $\det(A-\lambda I)$ gives $\det A$. The sum comes from comparing the $\lambda^{n-1}$ terms in the same way. In Example 2, $5+3+3=11=4+3+4$ and $5\cdot3\cdot3=45=\det A$.

Useful consequences:

- **$0$ is an eigenvalue exactly when $\det A=0$**, that is, when $A$ is singular. Add this to the list of equivalent statements from the rank lesson.
- If all eigenvalues are real and $\det A<0$, at least one eigenvalue is negative.
- For the adjacency matrix of a graph, the sum of the eigenvalues is the trace, which counts the self-loops ([GATE 2023 Q.20](#/q/es_1lff3kyyk)).

### The 2×2 shortcut

For a $2\times2$ matrix, $\det(A-\lambda I)=\lambda^2-(\operatorname{tr}A)\lambda+\det A$. So you can write the characteristic equation straight away:

$$\lambda^2-(\operatorname{tr}A)\,\lambda+\det A=0.$$

For $\begin{bmatrix}2&-1\\-4&5\end{bmatrix}$: trace $7$, determinant $10-4=6$, so $\lambda^2-7\lambda+6=0$ and $\lambda=1,6$ ([GATE 2005 Q.49](#/q/es_5cOEFJ3O8UXppPRr)). It also works backwards: given the eigenvalues, the trace and determinant give two equations for two unknown entries.

### The 3×3 shortcut

$$\lambda^3-(\operatorname{tr}A)\,\lambda^2+(M_{11}+M_{22}+M_{33})\,\lambda-\det A=0,$$

where $M_{ii}$ is the $2\times2$ determinant left after deleting row $i$ and column $i$ (a **principal minor**). For Example 2: the trace is $11$; the minors are $\begin{vmatrix}3&2\\0&4\end{vmatrix}=12$, $\begin{vmatrix}4&1\\1&4\end{vmatrix}=15$ and $\begin{vmatrix}4&0\\2&3\end{vmatrix}=12$, which add to $39$; and $\det A=45$. So $\lambda^3-11\lambda^2+39\lambda-45=(\lambda-5)(\lambda-3)^2$, as before.

### Testing a claimed eigenvector or eigenvalue

- **Is $v$ an eigenvector?** Work out $Av$. It must be a multiple of $v$. If $v$ has a $0$ entry where $Av$ does not, it is not ([GATE 2022 Q.43](#/q/es_1l00i20zc), [GATE 1993 Q.1.1](#/q/es_Ui0PTkxXX8FGUqjs)).
- **Is $c$ an eigenvalue?** Check whether $\det(A-cI)=0$ ([GATE 2008 Q.28](#/q/es_VwDvoTPQTdXIAj6C)).

### Complex eigenvalues and multiplicity

A real matrix can have complex eigenvalues. The rotation by $90^\circ$, $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$, turns every direction, and indeed $\lambda^2+1=0$ gives $\lambda=\pm i$. The characteristic polynomial of a real matrix has real coefficients, so **complex eigenvalues come in conjugate pairs** $a\pm bi$.

Since the characteristic polynomial has degree $n$, an $n\times n$ matrix has exactly $n$ eigenvalues when repeats are counted. So no eigenvalue can repeat more than $n$ times, and the $n\times n$ identity $I_n$ (eigenvalue $1$, $n$ times) shows that $n$ repeats can happen ([GATE 2026 Set 1 Q.3](#/q/es_mmz0yrar)).

> **GATE tip:** if $v$ is a **unit** eigenvector ($v^Tv=1$) with $Av=\lambda v$, then $v^TAv=v^T(\lambda v)=\lambda$. So the largest value of $x^TAx$ over unit eigenvectors is the largest eigenvalue ([GATE IT 2007 Q.2](#/q/es_N0FSboioQh4URzOq)).

### How GATE asks this

- Eigenvalues of a $2\times2$ matrix, using trace and determinant: a very common 1-mark question.
- Unknown entries of a matrix from its given eigenvalues.
- The sum or product of eigenvalues, through the trace or the determinant.
- Which of several vectors are eigenvectors.
- A characteristic polynomial with an unknown coefficient.

**GATE 2015 (2 marks).** $A=\begin{bmatrix}1&4\\b&a\end{bmatrix}$ has eigenvalues $-1$ and $7$. Find $a$ and $b$. ([GATE 2015 Set 1 Q.36](#/q/es_zBGD51Nh3a5U8Dq5))

1. Trace: $1+a=-1+7=6$, so $a=5$.
2. Determinant: $a-4b=(-1)(7)=-7$, so $5-4b=-7$ and $b=3$.
3. Check: $\begin{bmatrix}1&4\\3&5\end{bmatrix}$ gives $\lambda^2-6\lambda-7=(\lambda-7)(\lambda+1)$. Option (D).

**GATE 2017 (2 marks).** A $3\times3$ real matrix has characteristic polynomial $\lambda^3-4\lambda^2+a\lambda+30$, and one eigenvalue is $2$. Find the largest absolute value among its eigenvalues. ([GATE 2017 Set 2 Q.52](#/q/es_QmLB1rkIrXEWebi3))

1. $\lambda=2$ is a root: $8-16+2a+30=0$, so $a=-11$.
2. Divide by $(\lambda-2)$: $\lambda^3-4\lambda^2-11\lambda+30=(\lambda-2)(\lambda^2-2\lambda-15)=(\lambda-2)(\lambda-5)(\lambda+3)$.
3. The eigenvalues are $2,5,-3$, so the answer is **5**. Check: $2+5-3=4$ matches the $-4\lambda^2$ term.

### Quick check

**1.** Find the eigenvalues of $\begin{bmatrix}4&5\\2&1\end{bmatrix}$.

<details><summary>Show answer</summary>

Trace $5$, determinant $4-10=-6$. So $\lambda^2-5\lambda-6=0$, which factors as $(\lambda-6)(\lambda+1)=0$: the eigenvalues are $6$ and $-1$.

</details>

**2.** Is $(1,2)$ an eigenvector of $\begin{bmatrix}1&1\\4&1\end{bmatrix}$?

<details><summary>Show answer</summary>

$\begin{bmatrix}1&1\\4&1\end{bmatrix}\begin{bmatrix}1\\2\end{bmatrix}=\begin{bmatrix}3\\6\end{bmatrix}=3\begin{bmatrix}1\\2\end{bmatrix}$. Yes, with eigenvalue $3$.

</details>

**3.** A real $3\times3$ matrix has eigenvalues $1$ and $1+2i$. Find its determinant.

<details><summary>Show answer</summary>

Complex eigenvalues come in pairs, so the third is $1-2i$. The determinant is $1\cdot(1+2i)(1-2i)=1\cdot(1+4)=5$.

</details>

**4.** Find the sum and the product of the eigenvalues of $\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}$.

<details><summary>Show answer</summary>

Sum $=$ trace $=1+5+9=15$. Product $=$ determinant $=0$, because the rows are in arithmetic progression. So one eigenvalue is $0$ (GATE 2024 Set 1 Q.2).

</details>

**5.** $1$ is an eigenvalue of $\begin{bmatrix}1&-1&2\\0&1&0\\1&2&1\end{bmatrix}$. Find its eigenvectors.

<details><summary>Show answer</summary>

$A-I=\begin{bmatrix}0&-1&2\\0&0&0\\1&2&0\end{bmatrix}$. Row 1: $-y+2z=0$, so $y=2z$. Row 3: $x+2y=0$, so $x=-4z$. The eigenvectors are the non-zero multiples of $(-4,2,1)$. Check: $A(-4,2,1)=(-4-2+2,\ 2,\ -4+4+1)=(-4,2,1)$ ([GATE 2015 Set 3 Q.15](#/q/es_jL23MckggcBTHuwn)).

</details>

### Practice from GATE

- [GATE 2005 Q.49](#/q/es_5cOEFJ3O8UXppPRr): the eigenvalues of a $2\times2$ matrix.
- [GATE 2015 Set 2 Q.5](#/q/es_dKB88Jw5SHvSDCEM): the larger eigenvalue of a $2\times2$ matrix.
- [GATE 2010 Q.29](#/q/es_Mn8ugeKk0ZSQO8ak): unknown entries from the eigenvalues $4$ and $8$.
- [GATE 2024 Set 1 Q.2](#/q/es_lwtfemo2): the product of all eigenvalues.
- [GATE 2019 Q.44](#/q/es_m4gppoat): the product of eigenvalues of a Vandermonde matrix.
- [GATE 2016 Set 1 Q.5](#/q/es_G44dOVPZre5hz2xd): complex eigenvalues and the determinant.
- [GATE 2014 Set 3 Q.4](#/q/es_pok6ktwgr8rfUYS4): what the trace and determinant say about signs.
- [GATE 2022 Q.43](#/q/es_1l00i20zc): which vectors are eigenvectors.

## Eigenvalue shortcuts, special matrices and diagonalization {#eigen-properties}

*Get the eigenvalues of related matrices without new work, use the eigenvalue facts for special matrices, decide whether a matrix is diagonalizable, and use Cayley–Hamilton.*

### The idea

Once you know an eigenvalue $\lambda$ and eigenvector $v$ of $A$, you get those of $A^2$, $A^{-1}$, $A+3I$ and many more for free. For example,

$$A^2v=A(Av)=A(\lambda v)=\lambda(Av)=\lambda^2v,$$

so $v$ is still an eigenvector and the eigenvalue is simply squared. Most GATE eigenvalue questions are one-line uses of facts like this one.

### The shortcut table

If $Av=\lambda v$, then:

| Matrix | $A^k$ | $A^{-1}$ | $kA$ | $A+kI$ | $\operatorname{adj}A$ | $p(A)$ | $A^T$ |
|---|---|---|---|---|---|---|---|
| Eigenvalue | $\lambda^k$ | $\dfrac{1}{\lambda}$ | $k\lambda$ | $\lambda+k$ | $\dfrac{\lvert A\rvert}{\lambda}$ | $p(\lambda)$ | $\lambda$ |

Here $p$ is any polynomial, so $A^2-3A+2I$ has eigenvalues $\lambda^2-3\lambda+2$. The eigenvector stays the same $v$ in every column except the last.

- **Inverse:** multiply $Av=\lambda v$ by $A^{-1}$ to get $v=\lambda A^{-1}v$, so $A^{-1}v=\tfrac1\lambda v$. ($\lambda\neq0$, since $A$ is invertible.)
- **Shift:** $(A+kI)v=\lambda v+kv=(\lambda+k)v$.
- **Adjoint:** $\operatorname{adj}A=|A|\,A^{-1}$, so its eigenvalues are $|A|/\lambda$.
- **Transpose:** $\det(A^T-\lambda I)=\det\big((A-\lambda I)^T\big)=\det(A-\lambda I)$, the same polynomial. Same eigenvalues, but the eigenvectors can differ.

Two more facts in the same spirit: $AB$ and $BA$ have the same eigenvalues (if $ABv=\lambda v$, then $BA(Bv)=B(ABv)=\lambda\,Bv$), and since $A^2$ has eigenvalues $\lambda_i^2$, its trace gives $\lambda_1^2+\dots+\lambda_n^2=\operatorname{tr}(A^2)$.

**Example.** If $A$ is $3\times3$ with eigenvalues $1,2,4$, then $\det\big((A^{-1})^T\big)=\det(A^{-1})=\dfrac{1}{1\cdot2\cdot4}=\dfrac18$ ([GATE 2016 Set 2 Q.6](#/q/es_mZUn5FmWpxZ5t82w)).

**Example.** $P=\begin{bmatrix}a&1&0\\1&a&1\\0&1&a\end{bmatrix}=aI+B$ with $B=\begin{bmatrix}0&1&0\\1&0&1\\0&1&0\end{bmatrix}$. Expanding $\det(B-\mu I)$ along row 1 gives $-\mu(\mu^2-1)-1\cdot(-\mu)=-\mu^3+2\mu$, so $B$ has eigenvalues $0,\pm\sqrt2$, and $P$ has eigenvalues $a,\ a\pm\sqrt2$ ([GATE IT 2006 Q.26](#/q/es_A5yQg2mAJHGgRUwU)).

### Triangular matrices

The eigenvalues of a triangular (or diagonal) matrix are its diagonal entries. The reason: $A-\lambda I$ is also triangular, so $\det(A-\lambda I)=(a_{11}-\lambda)(a_{22}-\lambda)\cdots(a_{nn}-\lambda)$. For example, $\begin{bmatrix}1&2&3\\0&4&7\\0&0&3\end{bmatrix}$ has eigenvalues $1,4,3$.

> **Watch out:** row operations change the eigenvalues, even the ones that keep the determinant. $\begin{bmatrix}2&1\\1&2\end{bmatrix}$ has eigenvalues $1$ and $3$; after $R_2\to R_2-\tfrac12R_1$ it becomes triangular with diagonal $2,\tfrac32$. Never row-reduce to find eigenvalues.

### Special matrices and their eigenvalues

For complex matrices, the **conjugate transpose** $A^*$ transposes and also changes every $a+bi$ to $a-bi$. A **Hermitian** matrix has $A^*=A$ and a **unitary** matrix has $A^*A=I$; they are the complex versions of symmetric and orthogonal matrices. A **positive definite** matrix is a symmetric $A$ with $x^TAx>0$ for every non-zero $x$.

| Matrix | Eigenvalues | Also |
|---|---|---|
| symmetric, $A^T=A$ | all real | eigenvectors for different eigenvalues are perpendicular; always diagonalizable |
| skew-symmetric, $A^T=-A$ | $0$ or purely imaginary ($\pm bi$) | odd size: $0$ is always an eigenvalue |
| orthogonal, $A^TA=I$ | modulus $\lvert\lambda\rvert=1$ | $\det A=\pm1$ |
| Hermitian / unitary | real / modulus $1$ | same as symmetric / orthogonal |
| positive definite | all positive | $v^TAv=\lambda v^Tv>0$ for an eigenvector $v$ |
| idempotent, $A^2=A$ | $0$ or $1$ | rank $=$ trace |
| nilpotent, $A^k=O$ | all $0$ | trace $0$, determinant $0$ |
| involutory, $A^2=I$ | $1$ or $-1$ | |

The last three come from the table above: if $Av=\lambda v$ then $A^2v=\lambda^2v$, so $A^2=A$ forces $\lambda^2=\lambda$, $A^k=O$ forces $\lambda^k=0$, and $A^2=I$ forces $\lambda^2=1$. For an idempotent matrix the trace adds up its eigenvalues, so it counts the eigenvalues equal to $1$, and that count is also its rank.

**Why symmetric eigenvectors are perpendicular.** Let $A^T=A$, $Ax=\lambda x$ and $Ay=\mu y$ with $\lambda\neq\mu$. Then $\lambda\,x^Ty=(Ax)^Ty=x^TA^Ty=x^T(Ay)=\mu\,x^Ty$. So $(\lambda-\mu)\,x^Ty=0$, which forces $x^Ty=0$. For example, $\begin{bmatrix}2&1\\1&2\end{bmatrix}$ has eigenvectors $(1,1)$ for $3$ and $(1,-1)$ for $1$, and $(1,1)\cdot(1,-1)=0$.

**Why orthogonal eigenvalues have modulus 1.** (The modulus of $a+bi$ is $\sqrt{a^2+b^2}$, its distance from $0$.) $A^TA=I$ gives $(Av)^T(Av)=v^Tv$, so $A$ keeps lengths. But $Av=\lambda v$ has $\lvert\lambda\rvert$ times the length of $v$, so $\lvert\lambda\rvert=1$. The rotation $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ has eigenvalues $\pm i$, both of modulus 1.

### Algebraic and geometric multiplicity

- The **algebraic multiplicity** (AM) of $\lambda$ is how many times it is a root of the characteristic polynomial.
- The **geometric multiplicity** (GM) is the number of independent eigenvectors for $\lambda$. By rank–nullity, $\text{GM}=n-\operatorname{rank}(A-\lambda I)$.
- Always $1\le\text{GM}\le\text{AM}$.

Compare $3I$ with $A=\begin{bmatrix}3&1\\0&3\end{bmatrix}$. Both have the eigenvalue $3$ twice (AM $=2$). For $3I$ every vector is an eigenvector, so GM $=2$. For $A$, $A-3I=\begin{bmatrix}0&1\\0&0\end{bmatrix}$ has rank 1, so GM $=2-1=1$: the only eigenvectors are multiples of $(1,0)$.

### Diagonalization

Suppose $A$ has $n$ independent eigenvectors $v_1,\dots,v_n$. Put them as the columns of $P$, and the matching eigenvalues on the diagonal of $D$. Column by column, $Av_i=\lambda_iv_i$ says $AP=PD$, so

$$A=PDP^{-1},\qquad D=P^{-1}AP.$$

Then $A$ is called **diagonalizable**. The pay-off is powers: $A^k=PD^kP^{-1}$, and $D^k$ just raises each diagonal entry to the power $k$.

**Example.** In the last lesson, $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$ had eigenvectors $(1,1)$ for $5$ and $(1,-2)$ for $2$. With $P=\begin{bmatrix}1&1\\1&-2\end{bmatrix}$ and $D=\begin{bmatrix}5&0\\0&2\end{bmatrix}$: $AP=\begin{bmatrix}5&2\\5&-4\end{bmatrix}=PD$. So $A^k=P\begin{bmatrix}5^k&0\\0&2^k\end{bmatrix}P^{-1}$.

> **Remember:** $A$ is diagonalizable exactly when it has $n$ independent eigenvectors, that is, when GM $=$ AM for every eigenvalue. It is guaranteed when the $n$ eigenvalues are all different (eigenvectors for different eigenvalues are always independent), and when $A$ is symmetric. $\begin{bmatrix}3&1\\0&3\end{bmatrix}$ and every non-zero nilpotent matrix are not diagonalizable.

**GATE 2018 (2 marks).** The only eigenvectors of $P$ are the multiples of $(1,4)$. So $P$ is $2\times2$ with just one independent eigenvector. Two different eigenvalues would give two independent eigenvectors, so the eigenvalue is repeated (II true), and with only one eigenvector $P$ is not diagonalizable (III true). But the repeated eigenvalue need not be $0$: $\begin{bmatrix}5&-1\\16&-3\end{bmatrix}$ has the eigenvalue $1$ twice, eigenvectors only along $(1,4)$, and determinant $1$. So "$P$ has no inverse" (I) is not forced. Answer: only II and III ([GATE 2018 Q.26](#/q/es_M2w7BTPrJYzogrGZ)).

### Cayley–Hamilton theorem

Every square matrix satisfies its own characteristic equation. Write the equation as $\lambda^n+c_{n-1}\lambda^{n-1}+\dots+c_0=0$, put $A$ in place of $\lambda$ and $c_0I$ in place of $c_0$: you get the zero matrix. It is easy to believe for a diagonalizable $A=PDP^{-1}$: any polynomial $p$ gives $p(A)=P\,p(D)\,P^{-1}$, and $p(D)$ is diagonal with entries $p(\lambda_i)=0$. For $2\times2$:

$$A^2-(\operatorname{tr}A)\,A+(\det A)\,I=O.$$

For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ (trace 4, determinant 3): $A^2=\begin{bmatrix}5&4\\4&5\end{bmatrix}$, and $A^2-4A+3I=\begin{bmatrix}5-8+3&4-4\\4-4&5-8+3\end{bmatrix}=O$.

Two uses:

- **Inverse:** $A^2-4A+3I=O$ gives $A(4I-A)=3I$, so $A^{-1}=\tfrac13(4I-A)=\tfrac13\begin{bmatrix}2&-1\\-1&2\end{bmatrix}$.
- **High powers:** an upper triangular $4\times4$ matrix with diagonal $1,-1,i,-i$ has characteristic polynomial $(\lambda^2-1)(\lambda^2+1)=\lambda^4-1$, so $A^4-I=O$ and $A^4=I$ ([GATE 1993 Q.2.7](#/q/es_cYeLvPa8dhpYnIhm)).

### Rank-1, all-ones and block matrices

- **$uv^T$** ($n\times n$, $u,v$ non-zero) has rank 1, so $0$ is an eigenvalue with $n-1$ independent eigenvectors. The last eigenvalue equals the trace, $v^Tu$, with eigenvector $u$, because $(uv^T)u=u(v^Tu)$. For $u=(1,2)$, $v=(1,1)$: the eigenvalues are $v^Tu=3$ and $0$ ([GATE 2018 Q.17](#/q/es_1v3QWEb0a3BC7pWt)).
- **All-ones $J$** ($n\times n$) is $uv^T$ with $u=v=(1,\dots,1)$: eigenvalues $n$ (once, eigenvector $(1,\dots,1)$) and $0$ ($n-1$ times). So $J-I$ has $n-1$ and $-1$ ($n-1$ times), and $aI+bJ$ has $a+nb$ and $a$.
- **Block diagonal** (square blocks along the diagonal and zeros everywhere else, possibly after listing the rows and columns in a new order): the eigenvalues are those of the blocks put together.
- **$\begin{bmatrix}A&I\\I&A\end{bmatrix}$:** if $Ax=\lambda x$, then stacking $x$ on $x$ gives $\begin{bmatrix}A&I\\I&A\end{bmatrix}\begin{bmatrix}x\\x\end{bmatrix}=\begin{bmatrix}Ax+x\\x+Ax\end{bmatrix}=(\lambda+1)\begin{bmatrix}x\\x\end{bmatrix}$, and stacking $x$ on $-x$ gives $\lambda-1$ the same way. So each eigenvalue $\lambda$ of $A$ gives $\lambda+1$ and $\lambda-1$ ([GATE 2007 Q.25](#/q/es_wRzNQgsx9XNtRTH0)).

> **GATE tip:** for a symmetric matrix, $\operatorname{tr}(A^2)$ is the sum of the squares of all its entries, so $\sum\lambda_i^2=\sum a_{ij}^2$. For example $\begin{bmatrix}3&4&0\\4&-3&0\\0&0&0\end{bmatrix}$ has entry squares adding to $50$ and eigenvalues $5,-5,0$: indeed $25+25=50$ ([GATE 2017 Set 1 Q.31](#/q/es_kSVpm4wlCFtCkKWl)).

### How GATE asks this

- Eigenvalues of $A^k$, $A^{-1}$, $A+kI$ or $\operatorname{adj}A$, or a determinant built from them.
- Triangular matrices, and matrices of the form $aI+(\text{something simple})$.
- Symmetric matrices: real eigenvalues and perpendicular eigenvectors.
- Rank-1, all-ones and block matrices.
- Repeated eigenvalues and diagonalizability; Cayley–Hamilton for powers or inverses.

**GATE 2025 (2 marks).** Find the eigenvalues of $A^{13}$ for $A=\begin{bmatrix}1&1\\1&-1\end{bmatrix}$. ([GATE 2025 Set 1 Q.31](#/q/es_m7wyas7f))

1. Trace $0$, determinant $-1-1=-2$, so $\lambda^2-2=0$ and $\lambda=\pm\sqrt2$.
2. $A^{13}$ has eigenvalues $(\pm\sqrt2)^{13}=\pm(\sqrt2)^{12}\sqrt2=\pm2^6\sqrt2=\pm64\sqrt2$, option (D).
3. Check another way: $A^2=2I$, so $A^{13}=(A^2)^6A=64A$, whose eigenvalues are $64\cdot(\pm\sqrt2)$.

**GATE 2014 (2 marks).** Find the product of the non-zero eigenvalues of $\begin{bmatrix}1&0&0&0&1\\0&1&1&1&0\\0&1&1&1&0\\0&1&1&1&0\\1&0&0&0&1\end{bmatrix}$. ([GATE 2014 Set 2 Q.47](#/q/es_7n7KsvhAKQhbJtvi))

1. Every entry that links an index in $\{1,5\}$ with an index in $\{2,3,4\}$ is $0$. So, listing rows and columns in the order $1,5,2,3,4$, the matrix is block diagonal: an all-ones $2\times2$ block and an all-ones $3\times3$ block.
2. The $2\times2$ all-ones block has eigenvalues $2,0$; the $3\times3$ one has $3,0,0$.
3. The non-zero eigenvalues are $2$ and $3$, so the product is **6**. Check: $2+3=5$, the trace.

### Quick check

**1.** $A$ is $3\times3$ with eigenvalues $2,3,-1$. Find the eigenvalues of $A^2+I$ and of $\operatorname{adj}A$, and find $\det A^{-1}$.

<details><summary>Show answer</summary>

$A^2+I$: $\lambda^2+1$ gives $5,10,2$. $|A|=2\cdot3\cdot(-1)=-6$, so $\operatorname{adj}A$ has $-6/\lambda$: $-3,-2,6$. And $\det A^{-1}=\tfrac{1}{-6}=-\tfrac16$.

</details>

**2.** Is $\begin{bmatrix}2&1\\0&2\end{bmatrix}$ diagonalizable?

<details><summary>Show answer</summary>

No. The eigenvalue $2$ has AM $=2$, but $A-2I=\begin{bmatrix}0&1\\0&0\end{bmatrix}$ has rank 1, so GM $=2-1=1<2$.

</details>

**3.** Find the eigenvalues of the $3\times3$ all-ones matrix $J$ and of $J+2I$.

<details><summary>Show answer</summary>

$J$: $3$ (the trace, since rank is 1) and $0,0$. Adding $2I$ adds 2 to each: $5,2,2$.

</details>

**4.** Use Cayley–Hamilton to write $A^{-1}$ for $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$.

<details><summary>Show answer</summary>

Trace $5$, determinant $4-6=-2$, so $A^2-5A-2I=O$. Then $A(A-5I)=2I$, and $A^{-1}=\tfrac12(A-5I)=\tfrac12\begin{bmatrix}-4&2\\3&-1\end{bmatrix}$. This matches the $2\times2$ formula $\tfrac{1}{-2}\begin{bmatrix}4&-2\\-3&1\end{bmatrix}$.

</details>

### Practice from GATE

- [GATE 2011 Q.40](#/q/es_J02K5Hv8t65FXWfE): eigenvalues of a triangular matrix.
- [GATE 2016 Set 2 Q.6](#/q/es_mZUn5FmWpxZ5t82w): the determinant of $(A^{-1})^T$ from eigenvalues.
- [GATE 2012 Q.11](#/q/es_aqlH6sLksh5JMIJr): eigenvalues of $A^{19}$.
- [GATE 2014 Set 1 Q.5](#/q/es_nYmYclUER1Lk20ys): eigenvectors of a symmetric matrix.
- [GATE 2018 Q.17](#/q/es_1v3QWEb0a3BC7pWt): the largest eigenvalue of $uv^T$.
- [GATE 2021 Set 1 Q.52](#/q/es_40599uckwrzoh9y): the largest eigenvalue of $J-I$.
- [GATE 2018 Q.26](#/q/es_M2w7BTPrJYzogrGZ): one eigenvector direction, repeated eigenvalue.
- [GATE 2002 Q.5a](#/q/es_m9YfACTA67OSmLL6): eigenvalues of a $4\times4$ triangular matrix.

## LU decomposition {#lu}

*Factor a matrix as $A=LU$ in the Doolittle and Crout styles, solve $Ax=b$ by forward and back substitution, and answer the GATE LU questions.*

### The idea

Triangular systems are easy. With a lower triangular matrix, the first equation has one unknown, the second has one new unknown, and so on: you solve from the top down. With an upper triangular matrix you solve from the bottom up.

**LU decomposition** writes a square matrix as a product

$$A=LU,\qquad L=\text{lower triangular},\quad U=\text{upper triangular}.$$

Then $Ax=b$ becomes $L(Ux)=b$. Call $y=Ux$ and solve two easy systems:

1. $Ly=b$ from the top down (**forward substitution**);
2. $Ux=y$ from the bottom up (**back substitution**).

Why bother, when Gaussian elimination already solves $Ax=b$? The expensive part of elimination, about $\tfrac{n^3}{3}$ multiplications, is done once when you factor $A$. After that, every new right-hand side $b$ costs only about $n^2$ for the two triangular solves. Programs that solve with the same $A$ many times rely on this.

### Doolittle: L holds the elimination multipliers

In the **Doolittle** form, $L$ has $1$s on its diagonal. Run Gaussian elimination without swapping rows:

- $U$ is the echelon form you end with;
- each time you do $R_i\to R_i-mR_j$, write the multiplier $m$ into $L$ at row $i$, column $j$.

**Example 1.** Factor $A=\begin{bmatrix}2&1&1\\4&3&3\\8&7&9\end{bmatrix}$.

1. Column 1, pivot $2$. $R_2\to R_2-2R_1$ gives $(0,1,1)$, so $l_{21}=2$. $R_3\to R_3-4R_1$ gives $(0,3,5)$, so $l_{31}=4$.
2. Column 2, pivot $1$. $R_3\to R_3-3R_2$ gives $(0,0,2)$, so $l_{32}=3$.
3. Collect the results:

$$L=\begin{bmatrix}1&0&0\\2&1&0\\4&3&1\end{bmatrix},\qquad U=\begin{bmatrix}2&1&1\\0&1&1\\0&0&2\end{bmatrix}.$$

Why this works: row 3 of $LU$ is $4\times(\text{row 1 of }U)+3\times(\text{row 2 of }U)+1\times(\text{row 3 of }U)=(8,\,4+3,\,4+3+2)=(8,7,9)$. The multipliers simply undo the elimination steps.

**Example 2.** Use this to solve $Ax=b$ with $b=(3,7,19)$.

1. Forward, $Ly=b$: $y_1=3$; then $2y_1+y_2=7$ gives $y_2=1$; then $4y_1+3y_2+y_3=19$ gives $y_3=19-12-3=4$.
2. Back, $Ux=y$: $2x_3=4$ gives $x_3=2$; then $x_2+x_3=1$ gives $x_2=-1$; then $2x_1+x_2+x_3=3$ gives $2x_1=2$, so $x_1=1$.
3. Check in the third equation: $8(1)+7(-1)+9(2)=19$.

### Crout: U gets the 1s

In the **Crout** form, $U$ has $1$s on its diagonal and the pivots move into $L$. Find the entries by multiplying out $LU$ and matching $A$ entry by entry, in order. For a $2\times2$ matrix:

$$\begin{bmatrix}a&b\\c&d\end{bmatrix}=\begin{bmatrix}l_{11}&0\\l_{21}&l_{22}\end{bmatrix}\begin{bmatrix}1&u_{12}\\0&1\end{bmatrix}=\begin{bmatrix}l_{11}&l_{11}u_{12}\\l_{21}&l_{21}u_{12}+l_{22}\end{bmatrix}.$$

**Example 3 (GATE 2015).** For $\begin{bmatrix}2&2\\4&9\end{bmatrix}$ with a unit diagonal in $U$, find $l_{22}$. ([GATE 2015 Set 1 Q.18](#/q/es_0WvQ0wMfQMFXsS1H))

1. $l_{11}=2$.
2. $l_{11}u_{12}=2$, so $u_{12}=1$.
3. $l_{21}=4$.
4. $l_{21}u_{12}+l_{22}=9$, so $4+l_{22}=9$ and $l_{22}=$ **5**.

Compare with Doolittle for the same matrix: the multiplier is $2$, so $L=\begin{bmatrix}1&0\\2&1\end{bmatrix}$ and $U=\begin{bmatrix}2&2\\0&5\end{bmatrix}$. The pivots $2$ and $5$ are the same; Crout just keeps them on the diagonal of $L$ instead of $U$. For a $3\times3$ Crout factorization, match in this order: column 1 of $L$, row 1 of $U$, column 2 of $L$, row 2 of $U$, and so on.

### When does an LU decomposition exist?

Elimination without row swaps needs every pivot to be non-zero. The pivots are tied to the top-left determinants $d_1,d_2,d_3,\dots$ (the $1\times1$, $2\times2$, $3\times3$ corners): $u_{11}=d_1$, $u_{22}=d_2/d_1$, $u_{33}=d_3/d_2$. In Example 1 these corners are $2,2,4$, giving pivots $2,1,2$.

> **Remember:** $A=LU$ without row swaps works when the top-left corner determinants are all non-zero (for the last one, $\det A$ itself, zero is allowed: it just makes $u_{nn}=0$).

If a zero pivot appears, you must swap rows. Recording the swaps in a **permutation matrix** $P$ (an identity with its rows reordered) gives $PA=LU$, and every invertible matrix has such a factorization. For example, $\begin{bmatrix}0&2\\3&1\end{bmatrix}$ has a zero first pivot, but after swapping the rows it is already upper triangular.

**Partial pivoting** swaps even when it is not forced: at each step it moves up the row whose entry in the pivot column has the largest absolute value, which keeps rounding errors small. For $\begin{bmatrix}2&5&9\\4&6&5\\8&2&3\end{bmatrix}$ the first step swaps rows 1 and 3 to use the pivot $8$ ([GATE 1988 Q.16i](#/q/go_v1_6.6.2) carries this through to $PA=LU$).

### Facts GATE checks

- In Doolittle form $\det L=1$, so $\det A=\det U=u_{11}u_{22}\cdots u_{nn}$, the product of the pivots.
- So $A$ is singular exactly when some $u_{ii}=0$, and if $A$ is invertible then $L$ and $U$ are both invertible.
- A symmetric $A$ does **not** give a symmetric $L$ or $U$: $L$ has zeros above its diagonal and $U$ below. For example $\begin{bmatrix}1&2\\2&1\end{bmatrix}=\begin{bmatrix}1&0\\2&1\end{bmatrix}\begin{bmatrix}1&2\\0&-3\end{bmatrix}$.
- Factoring costs about $\tfrac{n^3}{3}$ multiplications; each forward-plus-back solve costs about $n^2$ ([GATE 1998 Q.9](#/q/go_v1_6.13.3) asks for the exact elimination count).

### How GATE asks this

- Find one entry of $L$ or $U$ (Doolittle or Crout) for a $2\times2$ or $3\times3$ matrix.
- Solve a system through $LU$, often asking for an entry of $L$, of $U$ and of $x$ together.
- True/false statements about $LU$: how it is used, invertibility, singularity, symmetry.

**GATE 2022 (2 marks).** Solve $x_1+x_2-2x_3=4$, $x_1+3x_2-x_3=7$, $2x_1+x_2-5x_3=7$ by $LU$ decomposition and find $L_{32}$, $U_{33}$ and $x_1$. ([GATE 2022 Q.35](#/q/es_1l00gd6g0))

1. Column 1, pivot $1$: $R_2-1\cdot R_1=(0,2,1)$, so $L_{21}=1$; $R_3-2R_1=(0,-1,-1)$, so $L_{31}=2$.
2. Column 2, pivot $2$: the multiplier is $\tfrac{-1}{2}$, and $R_3-(-\tfrac12)R_2=(0,\,-1+1,\,-1+\tfrac12)=(0,0,-\tfrac12)$. So $L_{32}=-\tfrac12$ and $U_{33}=-\tfrac12$.

$$L=\begin{bmatrix}1&0&0\\1&1&0\\2&-\tfrac12&1\end{bmatrix},\qquad U=\begin{bmatrix}1&1&-2\\0&2&1\\0&0&-\tfrac12\end{bmatrix}.$$

3. Forward, $Ly=(4,7,7)$: $y_1=4$, $y_2=7-4=3$, $y_3=7-2(4)+\tfrac12(3)=\tfrac12$.
4. Back, $Ux=y$: $-\tfrac12x_3=\tfrac12$ gives $x_3=-1$; $2x_2+x_3=3$ gives $x_2=2$; $x_1+x_2-2x_3=4$ gives $x_1=4-2-2=0$.

So $L_{32}=-\tfrac12$, $U_{33}=-\tfrac12$ and $x_1=0$: option (D). Check in the third equation: $0+2+5=7$.

**GATE 2025 (2 marks, more than one answer).** $P=LU$ with $L$ unit lower triangular. Which are true? (A) $PX=Q$ can be solved by first solving $LY=Q$ and then $UX=Y$. (B) If $P$ is invertible, so are $L$ and $U$. (C) If $P$ is singular, some diagonal entry of $U$ is $0$. (D) If $P$ is symmetric, so are $L$ and $U$. ([GATE 2025 Set 2 Q.34](#/q/es_m80a3l7v))

(A) is the standard method. For (B) and (C), $\det P=\det L\det U=u_{11}u_{22}u_{33}$: if it is non-zero then $U$ is invertible (and $L$ always is), and if it is zero then some $u_{ii}=0$. (D) fails, as the symmetric example above shows. Answer: (A), (B) and (C).

### Quick check

**1.** Find the Doolittle LU decomposition of $\begin{bmatrix}2&3\\4&7\end{bmatrix}$.

<details><summary>Show answer</summary>

$R_2\to R_2-2R_1$ gives $(0,1)$, so the multiplier is $2$: $L=\begin{bmatrix}1&0\\2&1\end{bmatrix}$ and $U=\begin{bmatrix}2&3\\0&1\end{bmatrix}$.

</details>

**2.** Find the Crout decomposition (unit diagonal in $U$) of $\begin{bmatrix}4&8\\2&7\end{bmatrix}$.

<details><summary>Show answer</summary>

$l_{11}=4$; $4u_{12}=8$ gives $u_{12}=2$; $l_{21}=2$; $2\cdot2+l_{22}=7$ gives $l_{22}=3$. So $L=\begin{bmatrix}4&0\\2&3\end{bmatrix}$ and $U=\begin{bmatrix}1&2\\0&1\end{bmatrix}$.

</details>

**3.** Use your answer to question 1 to solve $\begin{bmatrix}2&3\\4&7\end{bmatrix}x=\begin{bmatrix}5\\11\end{bmatrix}$.

<details><summary>Show answer</summary>

Forward: $y_1=5$, then $2y_1+y_2=11$ gives $y_2=1$. Back: $x_2=1$, then $2x_1+3x_2=5$ gives $x_1=1$. So $x=(1,1)$.

</details>

**4.** In a Doolittle decomposition of a $3\times3$ matrix $A$, the diagonal of $U$ is $2,-1,3$. Find $\det A$. Is $A$ invertible?

<details><summary>Show answer</summary>

$\det A=\det U=2\cdot(-1)\cdot3=-6\neq0$, so yes, $A$ is invertible.

</details>

### Practice from GATE

- [GATE 2015 Set 1 Q.18](#/q/es_0WvQ0wMfQMFXsS1H): an entry of $L$ in Crout's form.
- [GATE 2022 Q.35](#/q/es_1l00gd6g0): solving a system through $LU$.
- [GATE 2025 Set 2 Q.34](#/q/es_m80a3l7v): true/false facts about $LU$.
- [GATE 1988 Q.16i](#/q/go_v1_6.6.2): $PA=LU$ with partial pivoting.
- [GATE 1998 Q.9](#/q/go_v1_6.13.3): counting the operations in Gaussian elimination.
