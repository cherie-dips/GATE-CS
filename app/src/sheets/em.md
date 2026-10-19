## Linear Algebra {#linear-algebra}

### Matrix basics
- $(AB)^T = B^TA^T$, $(AB)^{-1} = B^{-1}A^{-1}$, $(A^T)^{-1} = (A^{-1})^T$
- $A^{-1} = \dfrac{\operatorname{adj}A}{|A|}$; for $2\times2$: $\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \dfrac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$
- $\operatorname{tr}(A+B)=\operatorname{tr}A+\operatorname{tr}B$, $\operatorname{tr}(AB)=\operatorname{tr}(BA)$
- Multiplying $p\times q$ by $q\times r$: $pqr$ scalar multiplications

### Determinants
- $|A^T| = |A|$, $|AB| = |A||B|$, $|A^{-1}| = 1/|A|$, $|kA| = k^n|A|$ ($n\times n$)
- $|\operatorname{adj}A| = |A|^{n-1}$, $\operatorname{adj}(\operatorname{adj}A) = |A|^{n-2}A$
- Swap two rows → sign flips; scale a row by $k$ → $\times k$; add a multiple of a row to another → unchanged
- Two equal / proportional rows, or a zero row → $|A| = 0$
- Triangular or diagonal: $|A|$ = product of diagonal entries

### Rank
- Rank = number of non-zero rows in echelon form = max independent rows = max independent columns
- $\rho(A)=\rho(A^T)=\rho(A^TA)$, $\rho(AB)\le\min(\rho(A),\rho(B))$, $\rho(A+B)\le\rho(A)+\rho(B)$
- Sylvester ($A$ is $m\times n$, $B$ is $n\times p$): $\rho(AB)\ge\rho(A)+\rho(B)-n$
- Rank–nullity: $\rho(A) + \text{nullity}(A) = $ number of columns
- $n\times n$: $\rho(A)=n \iff |A|\ne0 \iff A$ invertible
- Rank-1 matrix = $uv^T$ (every row a multiple of one row)

### Systems of equations ($Ax=b$, $n$ unknowns)
| Condition | Solutions |
|---|---|
| $\rho(A) \ne \rho([A\mid b])$ | none (inconsistent) |
| $\rho(A) = \rho([A\mid b]) = n$ | unique |
| $\rho(A) = \rho([A\mid b]) = r < n$ | infinitely many, $n-r$ free variables |
- Homogeneous $Ax=0$ is always consistent; non-trivial solution $\iff \rho(A) < n$ ($\iff |A|=0$ when square)
- Number of independent solutions of $Ax=0$ = $n - \rho(A)$

### Eigenvalues & eigenvectors
- $|A-\lambda I| = 0$; $2\times2$: $\lambda^2 - (\operatorname{tr}A)\lambda + |A| = 0$
- $3\times3$: $\lambda^3 - (\operatorname{tr}A)\lambda^2 + (\text{sum of principal } 2\times2 \text{ minors})\lambda - |A| = 0$
- $\sum\lambda_i = \operatorname{tr}A$, $\prod\lambda_i = |A|$; $A$ singular $\iff$ 0 is an eigenvalue
- If $A$ has eigenvalue $\lambda$ (same eigenvector $x$):

| Matrix | $A^k$ | $A^{-1}$ | $kA$ | $A+kI$ | $\operatorname{adj}A$ | $p(A)$ |
|---|---|---|---|---|---|---|
| Eigenvalue | $\lambda^k$ | $1/\lambda$ | $k\lambda$ | $\lambda+k$ | $\lvert A\rvert/\lambda$ | $p(\lambda)$ |
- $A^T$ has the same eigenvalues (eigenvectors may differ); $AB$ and $BA$ have the same eigenvalues
- Triangular / diagonal: eigenvalues = diagonal entries
- Independent eigenvectors for $\lambda$ (geometric multiplicity) $= n - \rho(A-\lambda I) \le$ algebraic multiplicity
- Distinct eigenvalues → eigenvectors independent → diagonalizable. Diagonalizable $\iff$ GM = AM for every $\lambda$
- $n\times n$ all-ones matrix $J$: eigenvalues $n$ (once) and $0$ ($n-1$ times). Rank-1 $uv^T$: $v^Tu$ and $0$s
- Cayley–Hamilton: $A$ satisfies its own characteristic equation (use it for $A^{-1}$, $A^k$)
- $\sum\lambda_i^2=\operatorname{tr}(A^2)$

### Special matrices
| Type | Definition | Eigenvalues / facts |
|---|---|---|
| Symmetric | $A^T=A$ | real; eigenvectors of distinct $\lambda$ orthogonal; always diagonalizable |
| Skew-symmetric | $A^T=-A$ | 0 or purely imaginary; diagonal = 0; odd order ⇒ $\lvert A\rvert=0$ |
| Orthogonal | $A^TA=I$ | $\lvert\lambda\rvert=1$, $\lvert A\rvert=\pm1$, $A^{-1}=A^T$ |
| Idempotent | $A^2=A$ | $\lambda\in\{0,1\}$, rank = trace |
| Nilpotent | $A^k=0$ | all $\lambda=0$, $\lvert A\rvert=0$, trace 0 |
| Involutory | $A^2=I$ | $\lambda=\pm1$ |
| Positive definite | $x^TAx>0$ | all $\lambda>0$ (symmetric) |
- Hermitian ($A^*=A$): real eigenvalues; unitary ($A^*A=I$): $|\lambda|=1$

### LU decomposition
- $A = LU$; Doolittle: $L$ has unit diagonal; Crout: $U$ has unit diagonal
- Solve $Ly=b$ (forward), then $Ux=y$ (back)

## Calculus {#calculus}

### Standard limits
- $\lim\limits_{x\to0}\dfrac{\sin x}{x}=1$, $\dfrac{\tan x}{x}\to1$, $\dfrac{1-\cos x}{x^2}\to\dfrac12$
- $\lim\limits_{x\to0}\dfrac{e^x-1}{x}=1$, $\dfrac{a^x-1}{x}\to\ln a$, $\dfrac{\ln(1+x)}{x}\to1$
- $\lim\limits_{x\to a}\dfrac{x^n-a^n}{x-a}=na^{n-1}$
- $\lim\limits_{x\to0}(1+x)^{1/x}=e$, $\lim\limits_{x\to\infty}\left(1+\dfrac ax\right)^{bx}=e^{ab}$
- $1^\infty$ form: $\lim f^g = e^{\lim g\,(f-1)}$
- $\lim\limits_{x\to\infty}\dfrac{x^n}{e^x}=0$, $\lim\limits_{x\to\infty}\dfrac{\ln x}{x^n}=0$ ($n>0$), $\lim\limits_{x\to0^+}x\ln x=0$

### L'Hôpital & indeterminate forms
- For $\frac00$ or $\frac\infty\infty$: $\lim\frac fg = \lim\frac{f'}{g'}$ (repeat if still indeterminate)
- $0\cdot\infty$ → rewrite as a fraction; $\infty-\infty$ → combine into one fraction
- $0^0,\ \infty^0,\ 1^\infty$ → take $\ln$: $\lim f^g = e^{\lim g\ln f}$

### Continuity & differentiability
- Continuous at $a$: LHL = RHL = $f(a)$
- Differentiable at $a$: LHD = RHD. Differentiable ⇒ continuous (not conversely: $|x|$ at 0)
- $|x|$, $\lfloor x\rfloor$, $x^{1/3}$ are standard counterexamples (corner, jump, vertical tangent)

### Derivatives
| $f$ | $f'$ | $f$ | $f'$ |
|---|---|---|---|
| $x^n$ | $nx^{n-1}$ | $\sin x$ | $\cos x$ |
| $e^{ax}$ | $ae^{ax}$ | $\cos x$ | $-\sin x$ |
| $a^x$ | $a^x\ln a$ | $\tan x$ | $\sec^2x$ |
| $\ln x$ | $1/x$ | $\sec x$ | $\sec x\tan x$ |
| $\log_a x$ | $\dfrac{1}{x\ln a}$ | $\sin^{-1}x$ | $\dfrac{1}{\sqrt{1-x^2}}$ |
| $x^x$ | $x^x(1+\ln x)$ | $\tan^{-1}x$ | $\dfrac{1}{1+x^2}$ |
- Product $(uv)'=u'v+uv'$; quotient $(u/v)'=(u'v-uv')/v^2$; chain $\frac{d}{dx}f(g(x))=f'(g(x))\,g'(x)$
- Leibniz: $\dfrac{d}{dx}\displaystyle\int_{a(x)}^{b(x)}f(t)\,dt = f(b)\,b' - f(a)\,a'$

### Mean value theorems
- Rolle: $f$ continuous on $[a,b]$, differentiable on $(a,b)$, $f(a)=f(b)$ ⇒ $\exists c\in(a,b)$: $f'(c)=0$
- Lagrange (LMVT): same conditions without $f(a)=f(b)$ ⇒ $f'(c)=\dfrac{f(b)-f(a)}{b-a}$
- Cauchy: $\dfrac{f'(c)}{g'(c)}=\dfrac{f(b)-f(a)}{g(b)-g(a)}$

### Maxima & minima
- Stationary point: $f'(c)=0$. $f''(c)<0$ → local max; $f''(c)>0$ → local min
- $f''(c)=0$: first non-zero derivative of even order → extremum (max if negative); odd order → inflection
- Global extremum on $[a,b]$: compare $f$ at stationary points, non-differentiable points **and** endpoints
- Two variables: $r=f_{xx}$, $s=f_{xy}$, $t=f_{yy}$ at a stationary point
  - $rt-s^2>0$, $r<0$ → max; $rt-s^2>0$, $r>0$ → min; $rt-s^2<0$ → saddle; $=0$ → inconclusive

### Integrals
| $f$ | $\int f\,dx$ | $f$ | $\int f\,dx$ |
|---|---|---|---|
| $x^n$ ($n\ne-1$) | $\dfrac{x^{n+1}}{n+1}$ | $\sin x$ | $-\cos x$ |
| $1/x$ | $\ln\lvert x\rvert$ | $\cos x$ | $\sin x$ |
| $e^{ax}$ | $e^{ax}/a$ | $\sec^2x$ | $\tan x$ |
| $a^x$ | $a^x/\ln a$ | $\tan x$ | $\ln\lvert\sec x\rvert$ |
| $\ln x$ | $x\ln x-x$ | $\dfrac{1}{a^2+x^2}$ | $\dfrac1a\tan^{-1}\dfrac xa$ |
| $\dfrac{1}{\sqrt{a^2-x^2}}$ | $\sin^{-1}\dfrac xa$ | $\dfrac{1}{x^2-a^2}$ | $\dfrac{1}{2a}\ln\left\lvert\dfrac{x-a}{x+a}\right\rvert$ |
- By parts: $\int u\,dv = uv-\int v\,du$; pick $u$ by ILATE (Inverse trig, Log, Algebraic, Trig, Exponential)

### Definite integrals
- $\int_a^b f(x)\,dx = \int_a^b f(a+b-x)\,dx$ (King's rule)
- $\int_{-a}^{a} f = 2\int_0^a f$ if $f$ even; $=0$ if $f$ odd
- $\int_0^{2a} f = 2\int_0^a f$ if $f(2a-x)=f(x)$; $=0$ if $f(2a-x)=-f(x)$
- Period $T$: $\int_0^{nT} f = n\int_0^T f$
- Wallis: $\int_0^{\pi/2}\sin^n x\,dx=\int_0^{\pi/2}\cos^n x\,dx=\dfrac{n-1}{n}\cdot\dfrac{n-3}{n-2}\cdots\times\begin{cases}\pi/2 & n\text{ even}\\ 1 & n\text{ odd}\end{cases}$
- $\int_0^\infty x^ne^{-x}dx = \Gamma(n+1) = n!$, $\Gamma(\tfrac12)=\sqrt\pi$, $\int_0^\infty e^{-ax}dx = \tfrac1a$, $\int_{-\infty}^{\infty}e^{-x^2}dx=\sqrt\pi$
- Area between curves: $\int_a^b |f-g|\,dx$

### Series
- Taylor at $a$: $f(x)=\sum \dfrac{f^{(n)}(a)}{n!}(x-a)^n$; Maclaurin = Taylor at 0
- $e^x = 1+x+\frac{x^2}{2!}+\cdots$, $\sin x = x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots$, $\cos x = 1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots$
- $\ln(1+x)=x-\frac{x^2}2+\frac{x^3}3-\cdots$ ($|x|\le1$, $x\ne-1$), $\frac1{1-x}=1+x+x^2+\cdots$ ($|x|<1$)
- $(1+x)^n = 1+nx+\frac{n(n-1)}{2!}x^2+\cdots$
- $\sum 1/n^p$ converges iff $p>1$; geometric $\sum r^n$ converges iff $|r|<1$

### Partial derivatives
- Euler (homogeneous of degree $n$): $xf_x+yf_y=nf$
- Total derivative: $\dfrac{df}{dt}=f_x\dfrac{dx}{dt}+f_y\dfrac{dy}{dt}$

## Probability & Statistics {#probability}

### Basic rules
- $P(A\cup B)=P(A)+P(B)-P(A\cap B)$
- $P(A\cup B\cup C)=\sum P(A)-\sum P(A\cap B)+P(A\cap B\cap C)$
- $P(A^c)=1-P(A)$; $P(\text{at least one})=1-P(\text{none})$
- Mutually exclusive: $P(A\cap B)=0$. Independent: $P(A\cap B)=P(A)P(B)$. Two events with non-zero probability can't be both
- Independence of $A,B$ ⇒ independence of $A^c,B$; $A,B^c$; $A^c,B^c$
- $A,B,C$ mutually independent needs pairwise independence **and** $P(A\cap B\cap C)=P(A)P(B)P(C)$

### Conditional probability & Bayes
- $P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}$; $P(A\cap B)=P(A\mid B)P(B)$
- Total probability: $P(B)=\sum_i P(B\mid A_i)P(A_i)$ ($A_i$ partition the space)
- Bayes: $P(A_i\mid B)=\dfrac{P(B\mid A_i)P(A_i)}{\sum_j P(B\mid A_j)P(A_j)}$

### Random variables
- Discrete: $E[X]=\sum x\,p(x)$; continuous: $E[X]=\int x f(x)\,dx$, $\int f=1$
- CDF $F(x)=P(X\le x)$; $f=F'$; $P(a<X\le b)=F(b)-F(a)$; median $m$: $F(m)=\tfrac12$
- $\operatorname{Var}X=E[X^2]-(E[X])^2$, $\sigma=\sqrt{\operatorname{Var}X}$
- $E[aX+b]=aE[X]+b$, $\operatorname{Var}(aX+b)=a^2\operatorname{Var}X$
- $E[X+Y]=E[X]+E[Y]$ **always** (linearity — use indicator variables)
- $\operatorname{Var}(X\pm Y)=\operatorname{Var}X+\operatorname{Var}Y\pm2\operatorname{Cov}(X,Y)$
- $\operatorname{Cov}(X,Y)=E[XY]-E[X]E[Y]$; independent ⇒ Cov = 0 and $E[XY]=E[X]E[Y]$ (not conversely)
- Correlation $\rho=\dfrac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}\in[-1,1]$
- Non-negative integer $X$: $E[X]=\sum_{k\ge1}P(X\ge k)$
- Joint pdf: marginal $f_X(x)=\int f(x,y)\,dy$; independent $\iff f(x,y)=f_X(x)f_Y(y)$; $P(X=a)=0$ for continuous $X$

### Distributions
| Distribution | $P(X=k)$ or $f(x)$ | Mean | Variance |
|---|---|---|---|
| Bernoulli$(p)$ | $p^k(1-p)^{1-k}$ | $p$ | $p(1-p)$ |
| Binomial$(n,p)$ | $\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Geometric (trials to 1st success) | $(1-p)^{k-1}p$, $k\ge1$ | $1/p$ | $(1-p)/p^2$ |
| Poisson$(\lambda)$ | $e^{-\lambda}\lambda^k/k!$ | $\lambda$ | $\lambda$ |
| Discrete uniform $1..n$ | $1/n$ | $\frac{n+1}2$ | $\frac{n^2-1}{12}$ |
| Uniform$(a,b)$ | $\frac1{b-a}$ | $\frac{a+b}2$ | $\frac{(b-a)^2}{12}$ |
| Exponential$(\lambda)$ | $\lambda e^{-\lambda x}$, $x\ge0$ | $1/\lambda$ | $1/\lambda^2$ |
| Normal$(\mu,\sigma^2)$ | $\frac1{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/2\sigma^2}$ | $\mu$ | $\sigma^2$ |
- Geometric and exponential are **memoryless**: $P(X>s+t\mid X>s)=P(X>t)$
- Exponential: $P(X>x)=e^{-\lambda x}$, median $\frac{\ln2}{\lambda}$; min of independent exponentials is Exp$(\lambda_1+\lambda_2)$
- Poisson approximates Binomial when $n$ large, $p$ small ($\lambda=np$); sum of independent Poissons is Poisson$(\lambda_1+\lambda_2)$
- Normal: $Z=\frac{X-\mu}\sigma\sim N(0,1)$; within $1\sigma,2\sigma,3\sigma$: 68%, 95%, 99.7%; symmetric so mean = median = mode
- Hypergeometric (draw $n$ from $N$ with $K$ successes, no replacement): mean $nK/N$
- Sum of independent normals: $N(\mu_1+\mu_2,\ \sigma_1^2+\sigma_2^2)$; $n$ i.i.d. $U(0,1)$: $E[\max]=\frac n{n+1}$, $E[\min]=\frac1{n+1}$

### Useful expectations
- Expected trials until first success: $1/p$ (fair die, a 6: 6 rolls)
- Coupon collector ($n$ types): $nH_n = n\left(1+\frac12+\cdots+\frac1n\right)$
- Expected number of fixed points of a random permutation: 1

### Inequalities
- Markov: $P(X\ge a)\le E[X]/a$ ($X\ge0$)
- Chebyshev: $P(|X-\mu|\ge k\sigma)\le 1/k^2$

### Descriptive statistics
- Mean $\bar x=\frac{\sum x_i}n$; median = middle value of sorted data (average of two middle values for even $n$); mode = most frequent
- Empirical relation (moderately skewed): Mode $\approx$ 3 Median − 2 Mean
- Adding $c$ to every value: mean $+c$, variance unchanged. Multiplying by $k$: mean $\times k$, variance $\times k^2$, SD $\times|k|$
- Population variance $\frac1n\sum(x_i-\bar x)^2$; sample variance $\frac1{n-1}\sum(x_i-\bar x)^2$
