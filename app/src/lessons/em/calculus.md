# Calculus

Calculus is the maths of change. It answers three questions: what value a function is heading towards (**limits**), how fast it is changing (**derivatives**), and how much it adds up to (**integrals**). Our collection has 71 GATE questions on it from 1987 to 2026, usually one or two per paper, mostly 1-mark with the odd 2-mark: evaluate a limit, check continuity or differentiability where two formulas meet, find a maximum or minimum, or work out a definite integral that collapses with a symmetry trick. Take the lessons in order, because each one builds on the ones before it.

## Functions and graphs: a warm-up {#functions-graphs}

*Read the graphs of the few functions calculus keeps using, and handle absolute values, even and odd functions and polynomial roots.*

### The idea

A **function** is a rule that takes in a number and gives back exactly one number. If the rule is "square it and add 1", you write $f(x)=x^2+1$. Then $f(3)=3^2+1=10$.

The inputs a rule accepts are called its **domain**. Most rules in this chapter accept every real number, but watch for three exceptions: $\sqrt{x}$ needs $x\ge0$, $\ln x$ needs $x>0$, and a fraction refuses any input that makes its bottom zero (so $\dfrac{1}{x-2}$ refuses $x=2$).

The **graph** of $f$ is the picture of all the points $(x,f(x))$. To read it, find the input $x$ on the horizontal axis and look at the height of the curve there. That height is $f(x)$.

### Lines and chains of functions

**Straight lines.** A rule $f(x)=mx+c$ draws a straight line. The number $m$ is the **slope**: how much $f$ rises when $x$ goes up by $1$. From any two points on the line, slope $=\dfrac{\text{rise in } f}{\text{rise in } x}$.

> **Example ([GATE 2015](#/q/es_ewBiaL3YKrw02eHS)):** A straight-line function has $f(-2)=29$ and $f(3)=39$. Find $f(5)$.
>
> The slope is $m=\dfrac{39-29}{3-(-2)}=\dfrac{10}{5}=2$. Going from $x=3$ to $x=5$ adds $2$ to $x$, so $f$ rises by $2\times2=4$. So $f(5)=39+4=43$.

**Chains.** Feeding the output of one function into another is called **composition**. $g(h(x))$ means: apply $h$ first, then apply $g$ to the answer. The order matters. With $g(x)=x+1$ and $h(x)=x^2$:

$$g(h(x))=x^2+1,\qquad h(g(x))=(x+1)^2.$$

### The six shapes you need

<figure class="fig"><svg viewBox="0 0 422 258" role="img" aria-label="Six small graphs: x squared, x cubed, absolute value of x, floor of x, e to the x with ln x, and sin x with cos x">
<text x="71" y="15" font-size="12" fill="currentColor" text-anchor="middle">y = x²</text>
<line x1="6.0" y1="106.0" x2="136.0" y2="106.0" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="71.0" y1="122.0" x2="71.0" y2="22.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M6.0 26.0 L9.3 33.8 L12.5 41.2 L15.8 48.2 L19.0 54.8 L22.2 61.0 L25.5 66.8 L28.8 72.2 L32.0 77.2 L35.2 81.8 L38.5 86.0 L41.8 89.8 L45.0 93.2 L48.2 96.2 L51.5 98.8 L54.8 101.0 L58.0 102.8 L61.2 104.2 L64.5 105.2 L67.8 105.8 L71.0 106.0 L74.2 105.8 L77.5 105.2 L80.8 104.2 L84.0 102.8 L87.2 101.0 L90.5 98.8 L93.8 96.2 L97.0 93.2 L100.2 89.8 L103.5 86.0 L106.8 81.8 L110.0 77.2 L113.2 72.2 L116.5 66.8 L119.8 61.0 L123.0 54.8 L126.2 48.2 L129.5 41.2 L132.8 33.8 L136.0 26.0" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<text x="211" y="15" font-size="12" fill="currentColor" text-anchor="middle">y = x³</text>
<line x1="146.0" y1="72.0" x2="276.0" y2="72.0" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="211.0" y1="122.0" x2="211.0" y2="22.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M152.5 114.6 L155.8 107.9 L159.0 101.9 L162.2 96.7 L165.5 92.1 L168.8 88.1 L172.0 84.6 L175.2 81.7 L178.5 79.3 L181.8 77.3 L185.0 75.7 L188.2 74.5 L191.5 73.6 L194.8 72.9 L198.0 72.5 L201.2 72.2 L204.5 72.1 L207.8 72.0 L211.0 72.0 L214.2 72.0 L217.5 71.9 L220.8 71.8 L224.0 71.5 L227.2 71.1 L230.5 70.4 L233.8 69.5 L237.0 68.3 L240.2 66.7 L243.5 64.7 L246.8 62.3 L250.0 59.4 L253.2 55.9 L256.5 51.9 L259.8 47.3 L263.0 42.1 L266.2 36.1 L269.5 29.4" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<text x="351" y="15" font-size="12" fill="currentColor" text-anchor="middle">y = |x|  (corner at 0)</text>
<line x1="286.0" y1="95.3" x2="416.0" y2="95.3" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="351.0" y1="122.0" x2="351.0" y2="22.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M286.0 28.7 L289.2 32.0 L292.5 35.3 L295.8 38.7 L299.0 42.0 L302.2 45.3 L305.5 48.7 L308.8 52.0 L312.0 55.3 L315.2 58.7 L318.5 62.0 L321.8 65.3 L325.0 68.7 L328.2 72.0 L331.5 75.3 L334.8 78.7 L338.0 82.0 L341.2 85.3 L344.5 88.7 L347.8 92.0 L351.0 95.3 L354.2 92.0 L357.5 88.7 L360.8 85.3 L364.0 82.0 L367.2 78.7 L370.5 75.3 L373.8 72.0 L377.0 68.7 L380.2 65.3 L383.5 62.0 L386.8 58.7 L390.0 55.3 L393.2 52.0 L396.5 48.7 L399.8 45.3 L403.0 42.0 L406.2 38.7 L409.5 35.3 L412.8 32.0 L416.0 28.7" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="351.0" cy="95.3" r="2.5" fill="var(--accent)"/>
<text x="71" y="147" font-size="12" fill="currentColor" text-anchor="middle">y = ⌊x⌋  (steps)</text>
<line x1="6.0" y1="204.0" x2="136.0" y2="204.0" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="61.0" y1="254.0" x2="61.0" y2="154.0" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="11.0" y1="242.5" x2="36.0" y2="242.5" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="11.0" cy="242.5" r="2.6" fill="var(--accent)"/>
<circle cx="36.0" cy="242.5" r="2.6" fill="none" stroke="var(--accent)" stroke-width="1.4"/>
<line x1="36.0" y1="223.2" x2="61.0" y2="223.2" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="36.0" cy="223.2" r="2.6" fill="var(--accent)"/>
<circle cx="61.0" cy="223.2" r="2.6" fill="none" stroke="var(--accent)" stroke-width="1.4"/>
<line x1="61.0" y1="204.0" x2="86.0" y2="204.0" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="61.0" cy="204.0" r="2.6" fill="var(--accent)"/>
<circle cx="86.0" cy="204.0" r="2.6" fill="none" stroke="var(--accent)" stroke-width="1.4"/>
<line x1="86.0" y1="184.8" x2="111.0" y2="184.8" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="86.0" cy="184.8" r="2.6" fill="var(--accent)"/>
<circle cx="111.0" cy="184.8" r="2.6" fill="none" stroke="var(--accent)" stroke-width="1.4"/>
<line x1="111.0" y1="165.5" x2="136.0" y2="165.5" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="111.0" cy="165.5" r="2.6" fill="var(--accent)"/>
<text x="211" y="147" font-size="12" fill="currentColor" text-anchor="middle">e<tspan dy="-4" font-size="9">x</tspan><tspan dy="4">&#160;and ln x</tspan></text>
<line x1="146.0" y1="210.1" x2="276.0" y2="210.1" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="205.1" y1="254.0" x2="205.1" y2="154.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M146.0 208.7 L149.2 208.5 L152.5 208.2 L155.8 208.0 L159.0 207.6 L162.2 207.3 L165.5 206.9 L168.8 206.4 L172.0 205.8 L175.2 205.2 L178.5 204.4 L181.8 203.6 L185.0 202.6 L188.2 201.5 L191.5 200.3 L194.8 198.8 L198.0 197.1 L201.2 195.2 L204.5 193.0 L207.8 190.5 L211.0 187.6 L214.2 184.3 L217.5 180.5 L220.8 176.1 L224.0 171.1 L227.2 165.3 L230.5 158.7" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<path d="M207.3 251.5 L209.1 241.3 L210.8 234.9 L212.6 230.2 L214.4 226.5 L216.1 223.5 L217.9 220.9 L219.7 218.6 L221.4 216.6 L223.2 214.8 L224.9 213.2 L226.7 211.7 L228.5 210.3 L230.2 209.1 L232.0 207.9 L233.7 206.8 L235.5 205.7 L237.3 204.7 L239.0 203.8 L240.8 202.9 L242.5 202.1 L244.3 201.3 L246.1 200.5 L247.8 199.8 L249.6 199.0 L251.3 198.4 L253.1 197.7 L254.9 197.1 L256.6 196.5 L258.4 195.9 L260.2 195.3 L261.9 194.8 L263.7 194.2 L265.4 193.7 L267.2 193.2 L269.0 192.7 L270.7 192.2 L272.5 191.8 L274.2 191.3 L276.0 190.9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/>
<text x="218.1" y="164.5" font-size="11" fill="var(--accent)">e<tspan dy="-4" font-size="9">x</tspan></text>
<text x="250.0" y="205.8" font-size="11" fill="currentColor">ln x</text>
<text x="351" y="147" font-size="12" fill="currentColor" text-anchor="middle">sin x and cos x</text>
<line x1="286.0" y1="200.9" x2="416.0" y2="200.9" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="296.7" y1="254.0" x2="296.7" y2="154.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M286.0 218.5 L289.2 213.6 L292.5 208.2 L295.8 202.6 L299.0 196.9 L302.2 191.3 L305.5 186.1 L308.8 181.4 L312.0 177.3 L315.2 173.9 L318.5 171.5 L321.8 170.1 L325.0 169.6 L328.2 170.2 L331.5 171.8 L334.8 174.4 L338.0 177.9 L341.2 182.1 L344.5 186.9 L347.8 192.2 L351.0 197.8 L354.2 203.4 L357.5 209.0 L360.8 214.4 L364.0 219.2 L367.2 223.5 L370.5 227.0 L373.8 229.7 L377.0 231.4 L380.2 232.1 L383.5 231.8 L386.8 230.4 L390.0 228.1 L393.2 224.9 L396.5 220.8 L399.8 216.1 L403.0 211.0 L406.2 205.4 L409.5 199.8 L412.8 194.1 L416.0 188.7" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<path d="M286.0 175.1 L289.2 172.3 L292.5 170.5 L295.8 169.7 L299.0 169.9 L302.2 171.1 L305.5 173.3 L308.8 176.5 L312.0 180.4 L315.2 185.0 L318.5 190.2 L321.8 195.7 L325.0 201.3 L328.2 207.0 L331.5 212.4 L334.8 217.5 L338.0 222.0 L341.2 225.8 L344.5 228.8 L347.8 230.9 L351.0 232.0 L354.2 232.0 L357.5 231.0 L360.8 229.1 L364.0 226.2 L367.2 222.4 L370.5 218.0 L373.8 212.9 L377.0 207.5 L380.2 201.9 L383.5 196.2 L386.8 190.7 L390.0 185.5 L393.2 180.8 L396.5 176.8 L399.8 173.6 L403.0 171.3 L406.2 170.0 L409.5 169.6 L412.8 170.4 L416.0 172.1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/>
<text x="324.7" y="165.9" font-size="11" fill="var(--accent)" text-anchor="middle">sin</text>
<text x="352.8" y="245.2" font-size="11" fill="currentColor" text-anchor="middle">cos</text>
<text x="352.8" y="211.9" font-size="10" fill="currentColor" text-anchor="middle">π</text>
<text x="408.9" y="211.9" font-size="10" fill="currentColor" text-anchor="middle">2π</text>
</svg><figcaption>The six shapes to know. Dashed curves are $\ln x$ and $\cos x$.</figcaption></figure>

**Absolute value.** $|x|$ is the size of $x$ with its sign thrown away: $|{-3}|=3$ and $|3|=3$. It is really two rules glued together:

$$|x|=\begin{cases}x & \text{if } x\ge0\\ -x & \text{if } x<0\end{cases}$$

That is why its graph is a V with a sharp corner at $0$. Whenever a question contains $|x|$, split it into these two cases and handle each one separately. For example, $x+|x|$ equals $2x$ when $x\ge0$ and $0$ when $x<0$.

**Floor.** $\lfloor x\rfloor$ is the largest whole number that is less than or equal to $x$: $\lfloor 2.7\rfloor=2$, $\lfloor 5\rfloor=5$, and $\lfloor -1.2\rfloor=-2$ (not $-1$, because $-1$ is bigger than $-1.2$). Its graph is a staircase that jumps up by $1$ at every whole number.

**$e^x$ and $\ln x$.** The number $e\approx2.718$ is the natural base for growth. $e^x$ is always positive, passes through $(0,1)$ and grows faster and faster. The **natural log** $\ln x$ undoes it: $\ln(e^x)=x$ and $e^{\ln x}=x$. So $\ln x$ only accepts $x>0$, passes through $(1,0)$, grows very slowly, and plunges downwards as $x$ gets close to $0$. Two log rules you will need later:

$$\ln(ab)=\ln a+\ln b,\qquad \ln(a^b)=b\ln a,\qquad\text{so}\qquad a^b=e^{\,b\ln a}.$$

**$\sin x$ and $\cos x$** are waves between $-1$ and $1$ that repeat every $2\pi$. Key values: $\sin0=0$, $\sin\frac{\pi}{2}=1$, $\sin\pi=0$, and $\cos0=1$, $\cos\frac{\pi}{2}=0$, $\cos\pi=-1$.

> **Watch out:** in calculus, angles are always measured in **radians**, where $\pi$ radians $=180^\circ$. Every formula in this chapter assumes radians. A calculator left in degrees gives wrong answers.

### Even and odd functions

Some graphs have a mirror symmetry that saves a lot of work later.

- A function is **even** if $f(-x)=f(x)$ for every $x$. Its graph is a mirror image across the vertical axis. Examples: $x^2$, $x^4$, $|x|$, $\cos x$.
- A function is **odd** if $f(-x)=-f(x)$ for every $x$. Spinning its graph half a turn around the origin gives the same graph. Examples: $x$, $x^3$, $\sin x$.
- Most functions are neither. For $e^x$, $e^{-1}\approx0.37$ is neither $e^1$ nor $-e^1$.

Multiplying works like multiplying signs, with even playing $+$ and odd playing $-$:

| product | result | example |
|---|---|---|
| even × even | even | $x^2\cos x$ |
| odd × odd | even | $x\sin x$ |
| even × odd | odd | $x^2\sin x$ |

Why: for $x\sin x$, replacing $x$ by $-x$ gives $(-x)\sin(-x)=(-x)(-\sin x)=x\sin x$. The two minus signs cancel.

A polynomial splits the same way: its even powers form an even function and its odd powers form an odd function. Adding $f(-x)$ cancels the odd powers and doubles the even ones:

$$f(x)=x^3+5x^2+2x+7\quad\Rightarrow\quad f(x)+f(-x)=10x^2+14.$$

> **Remember:** an odd function has zero total area over a balanced range like $-a$ to $a$, because the left half exactly cancels the right half. The definite integrals lesson uses this again and again.

### Polynomials and their roots

A **polynomial** is a sum of whole-number powers of $x$ multiplied by numbers, like $3x^2-4x+5$. Its **degree** is the highest power present (here $2$). A **root** is an input where the polynomial equals $0$.

1. **Factor form.** If a degree-$n$ polynomial has roots $r_1,\dots,r_n$, it equals $a(x-r_1)(x-r_2)\cdots(x-r_n)$ for some number $a\ne0$. So a degree-$n$ polynomial has **at most $n$ roots**.
2. **The sign flips at a root.** The factor $(x-r)$ is negative just left of $r$ and positive just right of it. So at a root like this the graph crosses the axis and the sign of the polynomial flips.
3. **Odd degree means at least one real root.** For large $x$ the highest power wins. With odd degree, as with $x^3$, the graph heads up without limit on one side and down without limit on the other, so it must cross the axis. The continuity lesson makes this exact.
4. **Sum and product of roots.** If $ax^2+bx+c=0$ has roots $p$ and $q$, then $p+q=-\dfrac ba$ and $pq=\dfrac ca$. Why: $a(x-p)(x-q)=ax^2-a(p+q)x+apq$, and the coefficients must match.
5. **Smallest degree from a table.** List the values at $x=0,1,2,3,\dots$, then the differences between neighbours, then the differences of those, and so on. A degree-$d$ polynomial has constant $d$-th differences. For $x^2$: values $0,1,4,9,16$, first differences $1,3,5,7$, second differences $2,2,2$. Each round of differences lowers the degree by one.
6. **Cube roots of 1.** Besides $1$, the equation $u^3=1$ has two complex roots, $\omega=\dfrac{-1+i\sqrt3}{2}$ and $\omega^2$ (where $i^2=-1$). They satisfy $\omega^3=1$ and $1+\omega+\omega^2=0$. So $u^3=k^3$ has the three roots $k$, $k\omega$ and $k\omega^2$. For example ([GATE 1995](#/q/go_v1_5.7.2)), $(x-1)^3+8=0$ means $(x-1)^3=(-2)^3$, so $x-1$ is $-2$, $-2\omega$ or $-2\omega^2$, and $x=-1$, $1-2\omega$ or $1-2\omega^2$.

**Example ([GATE 1997](#/q/go_v1_4.11.1)).** A polynomial has $p(0)=5$, $p(1)=4$, $p(2)=9$ and $p(3)=20$. What is its smallest possible degree?

1. Values: $5,\ 4,\ 9,\ 20$.
2. First differences: $4-5=-1$, $9-4=5$, $20-9=11$. Not constant.
3. Second differences: $5-(-1)=6$, $11-5=6$. Constant.

So the smallest degree is $2$. Indeed $p(x)=3x^2-4x+5$ gives $5, 4, 9, 20$.

### How GATE asks this

- Simplify a composition like $g(h(x))$ and match it to an option.
- Find a straight line's value from two of its points.
- Match a formula containing $|x|$ or $|y|$ to a drawn graph: split into the two cases.
- Polynomial root facts: the sign outside the roots, sum and product of roots, the smallest degree through given points, roots through the cube roots of 1.

**[GATE 2015 Set 1 Q.5](#/q/es_8CHGNWEJJjlZNoRt).** Let $g(x)=1-x$ and $h(x)=\dfrac{x}{x-1}$. Which option equals $\dfrac{g(h(x))}{h(g(x))}$: (A) $\dfrac{h(x)}{g(x)}$, (B) $-\dfrac1x$, (C) $\dfrac{g(x)}{h(x)}$, (D) $\dfrac{x}{(1-x)^2}$?

1. $g(h(x))=1-\dfrac{x}{x-1}=\dfrac{(x-1)-x}{x-1}=\dfrac{-1}{x-1}$.
2. $h(g(x))=\dfrac{1-x}{(1-x)-1}=\dfrac{1-x}{-x}=\dfrac{x-1}{x}$.
3. The ratio is $\dfrac{-1}{x-1}\times\dfrac{x}{x-1}=\dfrac{-x}{(x-1)^2}$.
4. Option (A) is $\dfrac{h(x)}{g(x)}=\dfrac{x}{(x-1)(1-x)}=\dfrac{-x}{(x-1)^2}$. It matches, so the answer is **(A)**.

> **GATE tip:** when the options are formulas, test one easy number. At $x=3$ the ratio is $\dfrac{-1/2}{2/3}=-\dfrac34$. Option (A) gives $\dfrac{3/2}{-2}=-\dfrac34$, while (B), (C) and (D) give $-\dfrac13$, $-\dfrac43$ and $\dfrac34$.

**[GATE 2014 Set 2 Q.5](#/q/go_v1_4.11.3).** A degree-3 polynomial $f$ has roots $1$, $2$ and $3$. Which must be true: (A) $f(0)f(4)<0$, (B) $f(0)f(4)>0$, (C) $f(0)+f(4)>0$, (D) $f(0)+f(4)<0$?

By the factor form, $f(x)=a(x-1)(x-2)(x-3)$ with $a\ne0$. Then $f(0)=a(-1)(-2)(-3)=-6a$ and $f(4)=a(3)(2)(1)=6a$. So $f(0)f(4)=-36a^2<0$, while $f(0)+f(4)=0$ rules out (C) and (D). The answer is **(A)**. In pictures: the sign flips three times between $0$ and $4$, and an odd number of flips leaves opposite signs.

### Quick check

**1.** If $f(x)=2x+1$ and $g(x)=x^2$, find $f(g(3))$ and $g(f(3))$.

<details><summary>Show answer</summary>

$g(3)=9$, so $f(g(3))=2(9)+1=19$. $f(3)=7$, so $g(f(3))=7^2=49$. Different answers, because the order matters.

</details>

**2.** What is $\lfloor -2.5\rfloor$?

<details><summary>Show answer</summary>

$-3$. It is the largest whole number that is $\le -2.5$. The number $-2$ does not qualify, because $-2$ is bigger than $-2.5$.

</details>

**3.** Is $x^3\cos x$ even, odd or neither?

<details><summary>Show answer</summary>

Odd, because odd × even = odd. Check: $(-x)^3\cos(-x)=-x^3\cos x$.

</details>

**4.** Write $y=x-|x|$ without the absolute value.

<details><summary>Show answer</summary>

For $x\ge0$, $|x|=x$, so $y=x-x=0$. For $x<0$, $|x|=-x$, so $y=x+x=2x$. The graph is flat on the right and a line of slope $2$ on the left.

</details>

**5.** A polynomial takes the values $1, 3, 7, 13, 21$ at $x=0,1,2,3,4$. What is its smallest possible degree?

<details><summary>Show answer</summary>

First differences: $2, 4, 6, 8$. Second differences: $2, 2, 2$, which are constant. So the smallest degree is $2$. (The polynomial is $x^2+x+1$.)

</details>

### Practice from GATE

- [GATE 2015 Set 3 GA Q.5](#/q/es_ewBiaL3YKrw02eHS): a straight line from two points.
- [GATE 2015 Set 1 Q.5](#/q/es_8CHGNWEJJjlZNoRt): composing two functions.
- [GATE 2015 Set 3 GA Q.8](#/q/es_b1dghJ81ChXHESsv): match a graph to a formula with $|y|$ by splitting into $y\ge0$ and $y<0$.
- [GATE 2014 Set 2 Q.5](#/q/go_v1_4.11.3): signs of a cubic outside its roots.
- [GATE 2017 Set 2 Q.24](#/q/es_lDjCuCxo5hNJ92uI): sum and product of roots, with a twist ($13$ in base $b$ means $b+3$).
- [GATE 1997 Q.4.4](#/q/go_v1_4.11.1): smallest degree from a table of values.
- [GATE 1995 Q.2.8](#/q/go_v1_5.7.2): roots using the cube roots of 1.

## Limits {#limits}

*Work out the value a function is heading towards, using left and right limits, simple algebra, the standard limits and the squeeze idea.*

### The idea

Take $f(x)=\dfrac{x^2-1}{x-1}$. At $x=1$ it gives $\frac00$, which has no meaning. But look at inputs close to $1$:

| $x$ | $0.9$ | $0.99$ | $0.999$ | $1.001$ | $1.01$ | $1.1$ |
|---|---|---|---|---|---|---|
| $f(x)$ | $1.9$ | $1.99$ | $1.999$ | $2.001$ | $2.01$ | $2.1$ |

The outputs close in on $2$ from both sides. We say the **limit** of $f(x)$ as $x$ approaches $1$ is $2$, and write

$$\lim_{x\to1}\frac{x^2-1}{x-1}=2.$$

The reason: for every $x\ne1$, $\dfrac{x^2-1}{x-1}=\dfrac{(x-1)(x+1)}{x-1}=x+1$. So the graph is the line $y=x+1$ with one point missing at $(1,2)$: a hole.

> **Idea:** a limit asks where $f(x)$ is heading as $x$ gets closer and closer to $a$. It never asks what happens exactly at $a$. The value $f(a)$ may be missing, or even different, and the limit does not care.

### Left and right limits

You can approach $a$ from the left, using inputs a little less than $a$ (written $x\to a^-$), or from the right, using inputs a little more than $a$ (written $x\to a^+$). These give the **left-hand limit** and the **right-hand limit**.

> **Remember:** the limit exists only when the left-hand and right-hand limits both exist and are equal. The limit is then that common value.

Three cases where something goes wrong:

- $\dfrac{|x|}{x}$ is $1$ for every $x>0$ and $-1$ for every $x<0$. At $0$ the right-hand limit is $1$ and the left-hand limit is $-1$, so the limit does not exist.
- $\lfloor x\rfloor$ just left of $2$ (say at $1.99$) is $1$, and just right of $2$ it is $2$. Left and right disagree, so there is no limit at $2$. Near $2.5$ both sides give $2$, so the limit there is $2$.
- $\dfrac1x$ shoots up without bound just right of $0$ and down without bound just left of $0$. No limit.

When the values grow without bound in one direction, we write $\lim f(x)=\infty$. For example, $\lim_{x\to0}\dfrac{1}{x^2}=\infty$, because $\dfrac{1}{x^2}$ is huge and positive on both sides. GATE lists "$\infty$" and "does not exist" as separate options. Choose $\infty$ when the values grow without bound in one direction, and "does not exist" when the two sides disagree or the values keep swinging.

### Rules for combining limits

If $\lim f(x)=A$ and $\lim g(x)=B$ are ordinary numbers, limits pass through ordinary arithmetic:

$$\lim(f\pm g)=A\pm B,\qquad \lim(fg)=AB,\qquad \lim\frac fg=\frac AB\ \ (\text{if } B\ne0),\qquad \lim f^n=A^n.$$

These rules mean that for polynomials, $e^x$, $\sin x$, $\cos x$, $\ln x$ (with $x>0$) and anything built from them, if plugging in $x=a$ gives a sensible number, that number is the limit. So always **try plugging in first**: $\lim_{x\to2}(x^2+3x)=4+6=10$.

You need tricks only when plugging in gives a meaningless form such as $\frac00$. If you get a non-zero number over $0$, as with $\frac{1}{x}$ at $0$, the function blows up. Check the sign on each side to decide between $\infty$, $-\infty$ and "does not exist".

### Algebra tricks for 0/0

**Trick 1: factorise and cancel.** If plugging $a$ into the top and the bottom gives $0$ for both, then $(x-a)$ is a factor of both. Cancel it, then plug in.

$$\lim_{x\to3}\frac{x^2-9}{x^2-x-6}=\lim_{x\to3}\frac{(x-3)(x+3)}{(x-3)(x+2)}=\lim_{x\to3}\frac{x+3}{x+2}=\frac65.$$

A handy special case is $x^n-a^n=(x-a)(x^{n-1}+x^{n-2}a+\cdots+a^{n-1})$. The second bracket has $n$ terms, and each is close to $a^{n-1}$ when $x$ is near $a$. So

$$\lim_{x\to a}\frac{x^n-a^n}{x-a}=na^{n-1},\qquad\text{for example}\qquad \lim_{x\to2}\frac{x^5-32}{x-2}=5\cdot2^4=80.$$

**Trick 2: rationalise.** When a square root causes the $\frac00$, multiply the top and the bottom by the same expression with the middle sign flipped. This uses $(\sqrt A-B)(\sqrt A+B)=A-B^2$:

$$\lim_{x\to0}\frac{\sqrt{1+x}-1}{x}=\lim_{x\to0}\frac{(1+x)-1}{x(\sqrt{1+x}+1)}=\lim_{x\to0}\frac{1}{\sqrt{1+x}+1}=\frac12.$$

**Trick 3: for $x\to\infty$, divide by the highest power.** Here $x\to\infty$ means $x$ grows without bound. Divide the top and the bottom by the highest power of $x$ in the bottom. Every term like $\dfrac5x$ or $\dfrac{7}{x^2}$ then fades to $0$:

$$\lim_{x\to\infty}\frac{3x^2+5x}{2x^2-7}=\lim_{x\to\infty}\frac{3+\frac5x}{2-\frac{7}{x^2}}=\frac32.$$

For a polynomial over a polynomial this gives a quick rule. Same degree: the answer is the ratio of the leading numbers (the numbers in front of the highest powers). Bigger degree on top: $\pm\infty$. Bigger degree at the bottom: $0$.

> **Watch out:** $\sin x$ and $\cos x$ never settle as $x\to\infty$, but they always stay between $-1$ and $1$. So after dividing by $x$ they fade to $0$, and next to $x$ itself they hardly matter: $\dfrac{x+\sin x}{x}\to1$.

### The squeeze idea

If $f$ is trapped between two functions that both head to the same value $L$, then $f$ has no choice: it heads to $L$ too. This is the **squeeze rule** (also called the sandwich theorem).

**Example.** For $x>0$, $-\dfrac1x\le\dfrac{\sin x}{x}\le\dfrac1x$, because $-1\le\sin x\le1$. Both outer functions fade to $0$ as $x\to\infty$, so $\dfrac{\sin x}{x}\to0$.

The squeeze also proves the most important limit of all: $\dfrac{\sin x}{x}\to1$ as $x\to0$. Draw a circle of radius $1$ with an angle $x$ (between $0$ and $\frac{\pi}{2}$) at its centre $O$.

<figure class="fig"><svg viewBox="30 18 250 185" role="img" aria-label="Unit circle with angle x: small triangle OAP inside the shaded slice OAP inside the larger triangle OAT">
<line x1="50" y1="178" x2="240.0" y2="178" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M210.0 178.0 L209.9 172.1 L209.5 166.2 L209.0 160.4 L208.2 154.5 L207.1 148.7 L205.9 143.0 L204.4 137.3 L202.7 131.6 L200.7 126.1 L198.6 120.6 L196.2 115.2 L193.7 109.9 L190.9 104.7 L187.9 99.6 L184.7 94.7 L181.4 89.8 L177.8 85.1 L174.1 80.6 L170.1 76.2 L166.1 71.9 L161.8 67.9 L157.4 63.9 L152.9 60.2 L148.2 56.6 L143.3 53.3 L138.4 50.1 L133.3 47.1 L128.1 44.3 L122.8 41.8 L117.4 39.4 L111.9 37.3 L106.4 35.3 L100.7 33.6 L95.0 32.1 L89.3 30.9 L83.5 29.8 L77.6 29.0 L71.8 28.5 L65.9 28.1 L60.0 28.0" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
<path d="M60 178 L210.0 178.0 L209.9 172.8 L209.6 167.5 L209.2 162.3 L208.5 157.1 L207.7 151.9 L206.7 146.7 L205.5 141.6 L204.2 136.5 L202.6 131.5 L200.9 126.6 L199.0 121.7 L197.0 116.8 L194.7 112.1 L192.3 107.4 L189.8 102.8 L187.1 98.3 L184.2 93.9 L181.2 89.6 L178.0 85.4 L174.7 81.4 Z" fill="var(--accent)" fill-opacity="0.18" stroke="none"/>
<path d="M60 178 L210.0 178.0 L210.0 51.7 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 3"/>
<path d="M60 178 L210.0 178.0 L174.7 81.4 Z" fill="none" stroke="var(--accent)" stroke-width="2"/>
<path d="M210.0 178.0 L209.9 172.8 L209.6 167.5 L209.2 162.3 L208.5 157.1 L207.7 151.9 L206.7 146.7 L205.5 141.6 L204.2 136.5 L202.6 131.5 L200.9 126.6 L199.0 121.7 L197.0 116.8 L194.7 112.1 L192.3 107.4 L189.8 102.8 L187.1 98.3 L184.2 93.9 L181.2 89.6 L178.0 85.4 L174.7 81.4" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
<line x1="174.7" y1="81.4" x2="174.7" y2="178.0" stroke="currentColor" stroke-dasharray="2 3" stroke-opacity="0.8"/>
<path d="M88.0 178.0 L87.9 176.0 L87.7 174.1 L87.4 172.2 L86.9 170.3 L86.3 168.4 L85.6 166.6 L84.7 164.8 L83.7 163.1 L82.6 161.5 L81.4 160.0" fill="none" stroke="currentColor"/>
<text x="52.0" y="192.0" font-size="12" fill="currentColor" text-anchor="middle">O</text>
<text x="218.0" y="192.0" font-size="12" fill="currentColor" text-anchor="middle">A</text>
<text x="168.7" y="73.4" font-size="12" fill="currentColor" text-anchor="middle">P</text>
<text x="220.0" y="55.7" font-size="12" fill="currentColor" text-anchor="start">T</text>
<text x="98.0" y="170.0" font-size="12" fill="currentColor" text-anchor="middle">x</text>
<text x="168.7" y="133.7" font-size="11" fill="currentColor" text-anchor="end">sin x</text>
<text x="218.0" y="118.8" font-size="11" fill="currentColor" text-anchor="start">tan x</text>
<text x="135.0" y="194.0" font-size="11" fill="currentColor" text-anchor="middle">1</text>
</svg><figcaption>Small triangle $OAP$ (area $\tfrac12\sin x$) sits inside the shaded slice (area $\tfrac12x$), which sits inside triangle $OAT$ (area $\tfrac12\tan x$).</figcaption></figure>

1. The three shapes are nested, so their areas are in order: $\tfrac12\sin x<\tfrac12x<\tfrac12\tan x$. (The slice is the fraction $\frac{x}{2\pi}$ of the whole circle, whose area is $\pi$, so its area is $\frac x2$.)
2. Divide everything by $\tfrac12\sin x$, which is positive: $1<\dfrac{x}{\sin x}<\dfrac{1}{\cos x}$.
3. Flip all three. Flipping positive numbers reverses their order: $\cos x<\dfrac{\sin x}{x}<1$.
4. As $x\to0$, $\cos x\to1$. So $\dfrac{\sin x}{x}$ is squeezed between two things heading to $1$, and $\lim_{x\to0}\dfrac{\sin x}{x}=1$. Negative $x$ gives the same ratio, because $\dfrac{\sin(-x)}{-x}=\dfrac{\sin x}{x}$.

### The standard limits

Memorise these. Each comes with a reason so that it sticks.

| limit | value | why you can believe it |
|---|---|---|
| $\dfrac{\sin x}{x}$ as $x\to0$ | $1$ | the squeeze above |
| $\dfrac{\tan x}{x}$ as $x\to0$ | $1$ | it equals $\dfrac{\sin x}{x}\cdot\dfrac{1}{\cos x}\to1\cdot1$ |
| $\dfrac{1-\cos x}{x^2}$ as $x\to0$ | $\dfrac12$ | multiply by $1+\cos x$: $\dfrac{\sin^2x}{x^2}\cdot\dfrac{1}{1+\cos x}\to1\cdot\dfrac12$ |
| $\dfrac{e^x-1}{x}$ as $x\to0$ | $1$ | near $0$, $e^x\approx1+x$ (at $x=0.001$ the ratio is $1.0005$) |
| $\dfrac{a^x-1}{x}$ as $x\to0$ | $\ln a$ | $a^x=e^{x\ln a}$; use the row above with $x\ln a$ in place of $x$ |
| $\dfrac{\ln(1+x)}{x}$ as $x\to0$ | $1$ | near $0$, $\ln(1+x)\approx x$, the row above undone |
| $(1+x)^{1/x}$ as $x\to0$ | $e$ | one way to define $e$; $1.001^{1000}\approx2.717$ |
| $\left(1+\dfrac ax\right)^{bx}$ as $x\to\infty$ | $e^{ab}$ | it is $\big[(1+\tfrac ax)^{x/a}\big]^{ab}$, and the bracket $\to e$ |
| $\dfrac{x^n}{e^x}$ and $\dfrac{\ln x}{x^n}$ as $x\to\infty$ ($n>0$) | $0$ | exponentials beat powers, and powers beat logs |
| $x\ln x$ as $x\to0^+$ | $0$ | the power $x$ beats the log |

The standard limits work with any small quantity in place of $x$, as long as the same quantity appears in both places:

- $\lim_{x\to0}\dfrac{\sin5x}{x}=\lim_{x\to0}5\cdot\dfrac{\sin5x}{5x}=5\cdot1=5$.
- $\lim_{x\to0}\dfrac{\sin^2x}{x}=\lim_{x\to0}\dfrac{\sin x}{x}\cdot\sin x=1\cdot0=0$.
- $\lim_{x\to4}\dfrac{\sin(x-4)}{x-4}$: put $t=x-4$, which goes to $0$, to get $\lim_{t\to0}\dfrac{\sin t}{t}=1$.

### Limits of sequences

A **sequence** is an endless list $a_1,a_2,a_3,\dots$. Its limit as $n\to\infty$ works exactly like $x\to\infty$. For example, $\dfrac{2n+1}{n+3}\to2$. Two facts GATE has leaned on:

- **Sequences made by a rule.** Suppose $x_{n+1}=g(x_n)$ and the sequence settles at $L$. For large $n$, both $x_n$ and $x_{n+1}$ are close to $L$, so $L=g(L)$. Example: $x_{n+1}=\dfrac{x_n+2}{2}$ gives $L=\dfrac{L+2}{2}$, so $L=2$. Starting from $0$, the terms are $0, 1, 1.5, 1.75, 1.875,\dots$ When $L=g(L)$ has two solutions, the mean value theorems lesson shows which one the sequence can settle at.
- **Geometric series.** $1+r+r^2+\cdots+r^{n-1}=\dfrac{1-r^n}{1-r}$. If $|r|<1$ then $r^n\to0$, so the endless sum is $\dfrac{1}{1-r}$. For example, $1+\frac12+\frac14+\cdots=2$. If $|r|\ge1$, the sum never settles.

### How GATE asks this

- Plug in, get $\frac00$, then factorise (2017, 2019) or rationalise (2021).
- $x\to\infty$ with harmless $\sin x$ or $\cos x$ terms: divide by the highest power (1995, 2008).
- A standard limit in disguise, uncovered by a substitution (2003, 2016, 2022).
- Show that $\dfrac{\sin x}{x}\to1$ without series (1995, a 5-mark question).

**[GATE 2019 Q.13](#/q/es_Gseax3gMzwwxLxF2XQjf76htyjzw1k26r).** Find $\lim_{x\to3}\dfrac{x^4-81}{2x^2-5x-3}$. Options: (A) $1$, (B) does not exist, (C) $\frac{53}{12}$, (D) $\frac{108}{7}$.

1. Plug in $x=3$: the top is $81-81=0$ and the bottom is $18-15-3=0$. So $(x-3)$ is a factor of both.
2. Factorise: $x^4-81=(x^2-9)(x^2+9)=(x-3)(x+3)(x^2+9)$ and $2x^2-5x-3=(x-3)(2x+1)$.
3. Cancel and plug in: $\dfrac{(x+3)(x^2+9)}{2x+1}\to\dfrac{6\times18}{7}=\dfrac{108}{7}$. **Answer: (D).**

**[GATE 2021 Set 1 Q.20](#/q/es_40599udkwrzogvt).** Find $\lim_{x\to-3}\dfrac{\sqrt{2x+22}-4}{x+3}$, to 2 decimal places.

1. Plug in: $\sqrt{16}-4=0$ and $-3+3=0$. It is $\frac00$ with a square root, so rationalise.
2. Multiply the top and the bottom by $\sqrt{2x+22}+4$. The top becomes $(2x+22)-16=2x+6=2(x+3)$.
3. Cancel $(x+3)$: $\dfrac{2}{\sqrt{2x+22}+4}\to\dfrac{2}{4+4}=0.25$. **Answer: 0.25.**

**[GATE 2008 Q.1](#/q/es_9vlJKJi9rHPIu6Sn).** Find $\lim_{x\to\infty}\dfrac{x-\sin x}{x+\cos x}$. Options: (A) $1$, (B) $-1$, (C) $\infty$, (D) $-\infty$.

Divide the top and the bottom by $x$ to get $\dfrac{1-\frac{\sin x}{x}}{1+\frac{\cos x}{x}}$. By the squeeze, $\dfrac{\sin x}{x}\to0$ and $\dfrac{\cos x}{x}\to0$. So the limit is $\dfrac{1-0}{1+0}=1$. **Answer: (A).**

### Quick check

**1.** Find $\lim_{x\to2}\dfrac{x^2-4}{x-2}$.

<details><summary>Show answer</summary>

Plugging in gives $\frac00$. Factorise: $\dfrac{(x-2)(x+2)}{x-2}=x+2\to4$.

</details>

**2.** Find $\lim_{x\to0}\dfrac{\sin3x}{x}$.

<details><summary>Show answer</summary>

Write it as $3\cdot\dfrac{\sin3x}{3x}$. The fraction is the standard limit with $3x$ as the small quantity, so the answer is $3\cdot1=3$.

</details>

**3.** Find $\lim_{x\to\infty}\dfrac{5x^3-x}{2x^3+7x^2}$.

<details><summary>Show answer</summary>

Divide by $x^3$: $\dfrac{5-\frac{1}{x^2}}{2+\frac7x}\to\dfrac52$. Same degree on top and bottom, so it is the ratio of the leading numbers.

</details>

**4.** Does $\lim_{x\to0}\dfrac{|x|}{x}$ exist?

<details><summary>Show answer</summary>

No. The right-hand limit is $1$ and the left-hand limit is $-1$. They disagree, so the limit does not exist.

</details>

**5.** ([GATE 2022](#/q/es_1kzzr35mq)) Find $\lim_{x\to0^+}\dfrac{\sqrt x}{1-e^{2\sqrt x}}$.

<details><summary>Show answer</summary>

Put $t=\sqrt x$, so $t\to0^+$. The expression becomes $\dfrac{t}{1-e^{2t}}=-\dfrac12\cdot\dfrac{2t}{e^{2t}-1}$. The last fraction is the flipped standard limit $\dfrac{e^{u}-1}{u}\to1$ with $u=2t$. So the answer is $-\dfrac12\cdot1=-0.5$.

</details>

### Practice from GATE

- [GATE 2016 Set 1 Q.3](#/q/es_CA25vuDDyn91IaDH): $\dfrac{\sin(x-4)}{x-4}$, a standard limit after a shift.
- [GATE 2003](#/q/es_7soTPCuJMhd3mOJl): $\dfrac{\sin^2x}{x}$ as $x\to0$.
- [GATE 2019 Q.13](#/q/es_Gseax3gMzwwxLxF2XQjf76htyjzw1k26r): factorise and cancel.
- [GATE 2021 Set 1 Q.20](#/q/es_40599udkwrzogvt): rationalise a square root.
- [GATE 2008 Q.1](#/q/es_9vlJKJi9rHPIu6Sn): $x\to\infty$ with $\sin x$ and $\cos x$ terms.
- [GATE 1995](#/q/es_pVXsd4g3FRB1s1xf): $\dfrac{x^3-\cos x}{x^2+\sin^2x}$ as $x\to\infty$, bigger degree on top.
- [GATE 2022 Q.24](#/q/es_1kzzr35mq): a standard limit after putting $t=\sqrt x$.
- [GATE 1995 Q.7(B)](#/q/go_v1_5.5.2): prove $\dfrac{\sin x}{x}\to1$ with the squeeze.

## Tricky limits: indeterminate forms {#indeterminate-forms}

*Recognise the seven indeterminate forms and crack each one with L'Hôpital's rule, a rewrite, logarithms or a series.*

### The idea

Here are three limits that all look like $\frac00$ when you plug in $x=0$:

$$\frac{x}{x}\to1,\qquad \frac{x^2}{x}=x\to0,\qquad \frac{x}{x^2}=\frac1x\ \text{blows up.}$$

So "$\frac00$" tells you nothing by itself. It only says that the top and the bottom are racing to $0$, and the answer depends on who gets there faster. A form like this is called an **indeterminate form**. There are seven of them:

$$\frac00,\qquad\frac\infty\infty,\qquad0\cdot\infty,\qquad\infty-\infty,\qquad1^\infty,\qquad0^0,\qquad\infty^0.$$

Some forms look scary but have a fixed answer: $\frac{0}{\infty}=0$, $\infty+\infty=\infty$, $\infty\cdot\infty=\infty$ and $0^\infty=0$. A non-zero number over $0$ blows up.

> **Watch out:** $1^\infty$ is not $1$. The base is only *close* to $1$, and a huge power magnifies the small gap. For example, $1.001^{1000}\approx2.717$.

### A few derivatives you need now

L'Hôpital's rule uses **derivatives**. The derivative $f'(x)$ of a function is a formula for its slope (steepness) at each point. The derivatives lesson builds it properly; for now this short list is enough.

| $f(x)$ | $x^n$ | $e^x$ | $\ln x$ | $\sin x$ | $\cos x$ |
|---|---|---|---|---|---|
| $f'(x)$ | $nx^{n-1}$ | $e^x$ | $\dfrac1x$ | $\cos x$ | $-\sin x$ |

Sums split up and constants stay put: the derivative of $3x^2+\sin x$ is $6x+\cos x$. For a function of a function, take the derivative of the outside and multiply by the derivative of the inside: the derivative of $e^{2x}$ is $2e^{2x}$, and the derivative of $\ln(1+x^2)$ is $\dfrac{1}{1+x^2}\cdot2x$. The derivative of $f'$ is written $f''$, the next one $f'''$, and the $n$-th one $f^{(n)}$.

### L'Hôpital's rule

> **Remember:** if plugging in gives $\frac00$ or $\frac\infty\infty$, then $\displaystyle\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}$, as long as the limit on the right exists (or is $\pm\infty$).

Why it works for $\frac00$ at a point $a$: zoom in near $a$ and each curve looks like a straight line through the point where it is $0$, with the curve's own slope. So $f(x)\approx f'(a)(x-a)$ and $g(x)\approx g'(a)(x-a)$. The $(x-a)$ cancels and you are left comparing slopes.

The method:

1. Plug in and confirm the form is $\frac00$ or $\frac\infty\infty$.
2. Differentiate the top and the bottom **separately**. This is not the rule for differentiating a fraction.
3. Plug in again. If it is still $\frac00$, repeat.

**Example 1.** $\displaystyle\lim_{x\to0}\frac{e^x-1-x}{x^2}$.

1. Plugging in gives $\frac{1-1-0}{0}=\frac00$.
2. Differentiate both: $\dfrac{e^x-1}{2x}$. Plugging in still gives $\frac00$.
3. Again: $\dfrac{e^x}{2}\to\dfrac12$.

**Example 2.** $\displaystyle\lim_{x\to\infty}\frac{\ln x}{x}$ is $\frac\infty\infty$. Differentiate both to get $\dfrac{1/x}{1}\to0$. So $x$ beats $\ln x$, as the standard limits promised.

> **Watch out:** three places where L'Hôpital is not allowed.
>
> 1. **The form is not $\frac00$ or $\frac\infty\infty$.** $\lim_{x\to0}\dfrac{x+1}{x+2}=\dfrac12$ by plugging in. Differentiating blindly gives $\dfrac11=1$, which is wrong.
> 2. **The new limit does not exist.** For $\dfrac{x-\sin x}{x+\cos x}$ as $x\to\infty$, the new fraction $\dfrac{1-\cos x}{1-\sin x}$ keeps swinging, so the rule tells you nothing. Dividing by $x$ gives the true answer, $1$.
> 3. **Proving $\dfrac{\sin x}{x}\to1$.** The derivative of $\sin x$ is itself worked out from this limit, so L'Hôpital would go round in a circle. Use the squeeze instead.

### 0·∞ and ∞−∞: rewrite first

These are not fractions yet, so make them into one.

**$0\cdot\infty$:** move one factor to the bottom as its reciprocal. For example, as $x\to0^+$, $x\ln x$ is $0\cdot(-\infty)$. Rewrite it and use L'Hôpital:

$$\lim_{x\to0^+}x\ln x=\lim_{x\to0^+}\frac{\ln x}{1/x}=\lim_{x\to0^+}\frac{1/x}{-1/x^2}=\lim_{x\to0^+}(-x)=0.$$

**$\infty-\infty$:** combine into one fraction, by a common denominator or by rationalising. For example, $\sqrt{x^2+x}-x$ as $x\to\infty$ is $\infty-\infty$:

$$\sqrt{x^2+x}-x=\frac{(x^2+x)-x^2}{\sqrt{x^2+x}+x}=\frac{x}{\sqrt{x^2+x}+x}=\frac{1}{\sqrt{1+\frac1x}+1}\to\frac12.$$

### Powers: 1^∞, 0^0 and ∞^0

All three are a variable raised to a variable power, $f(x)^{g(x)}$. The log rule from the warm-up turns the power into a product:

$$f^{\,g}=e^{\,g\ln f}.$$

So work out $L=\lim g\ln f$ (usually a $0\cdot\infty$ form), and the answer is $e^L$.

For **$1^\infty$** there is a shortcut. When $f$ is close to $1$, $\ln f\approx f-1$, by the standard limit $\dfrac{\ln(1+u)}{u}\to1$ with $u=f-1$. So:

$$\lim f^{\,g}=e^{\,\lim g\,(f-1)}\qquad\text{when } f\to1 \text{ and } g\to\infty.$$

**Example 3.** $\displaystyle\lim_{x\to\infty}\Big(1+\frac3x\Big)^{2x}$. Here $f-1=\dfrac3x$ and $g=2x$, so $g(f-1)=2x\cdot\dfrac3x=6$. The limit is $e^6$.

**Example 4.** $\displaystyle\lim_{x\to0^+}(1+\sin x)^{1/x}$. Here $g(f-1)=\dfrac{\sin x}{x}\to1$, so the limit is $e^1=e$.

For **$0^0$ and $\infty^0$**, use the logs directly. **Example 5:** $\lim_{x\to0^+}x^x$ is $0^0$. Its log is $x\ln x\to0$ (from above), so the limit is $e^0=1$.

### Series expansions

Near $0$, the common functions can be replaced by polynomials that match them better and better as you add terms. These are **Maclaurin series**. Here $n!=1\times2\times\cdots\times n$ (so $3!=6$):

$$e^x=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots\qquad \sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots\qquad \cos x=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots$$

$$\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots\qquad (1+x)^n=1+nx+\frac{n(n-1)}{2!}x^2+\cdots\qquad \frac{1}{1-x}=1+x+x^2+\cdots$$

The last three need $x$ to be small: $|x|<1$ (for $\ln(1+x)$, $x=1$ is also allowed; for $(1+x)^n$ with whole-number $n$, any $x$ works because the series stops).

Where they come from: you want a polynomial with the same value, slope, slope of slope, and so on, as $f$ at $0$. That forces the number in front of $x^n$ to be $\dfrac{f^{(n)}(0)}{n!}$. For $e^x$, every derivative is $e^x$, which is $1$ at $0$, so the numbers are $\dfrac{1}{n!}$. Around a point $a$ instead of $0$, the same idea gives the **Taylor series**:

$$f(x)=f(a)+f'(a)(x-a)+\frac{f''(a)}{2!}(x-a)^2+\frac{f'''(a)}{3!}(x-a)^3+\cdots$$

To use a series in a limit, replace each function by its first few terms, simplify, and keep the lowest power that survives.

**Example 6.** $\displaystyle\lim_{x\to0}\frac{x-\sin x}{x^3}$.

1. $x-\sin x=x-\Big(x-\dfrac{x^3}{6}+\dfrac{x^5}{120}-\cdots\Big)=\dfrac{x^3}{6}-\dfrac{x^5}{120}+\cdots$
2. Divide by $x^3$: $\dfrac16-\dfrac{x^2}{120}+\cdots$
3. Every term after the first goes to $0$, so the limit is $\dfrac16$.

L'Hôpital needs three rounds here. The series does it in one line.

> **GATE tip:** when a $\frac00$ needs more than one round of L'Hôpital, a series is usually faster and safer. Expand until the first term that does not cancel.

### How GATE asks this

- A $\frac00$ that one round of L'Hôpital finishes (2017, 2022).
- A $1^\infty$ limit, often with $n\to\infty$ (2010).
- An $\infty^0$ limit, cracked with logs (2015, twice).
- A $\frac00$ that needs a series because the first terms cancel (1993).
- Spotting when L'Hôpital fails (2008).

**[GATE 2010 Q.5](#/q/es_aPeMLGY13z8rWFqK).** Find $\lim_{n\to\infty}\Big(1-\dfrac1n\Big)^{2n}$. Options: (A) $0$, (B) $e^{-2}$, (C) $e^{-1/2}$, (D) $1$.

1. The base tends to $1$ and the power to $\infty$: a $1^\infty$ form.
2. $g(f-1)=2n\cdot\Big(-\dfrac1n\Big)=-2$.
3. So the limit is $e^{-2}$. **Answer: (B).** Option (D) is the classic trap of treating $1^\infty$ as $1$.

**[GATE 2015 Set 3 Q.9](#/q/es_kSv4WD6eZP6RvmDs).** Find $\lim_{x\to\infty}(1+x^2)^{e^{-x}}$. Options: (A) $0$, (B) $\frac12$, (C) $1$, (D) $\infty$.

1. The base grows without bound and the power $e^{-x}$ shrinks to $0$: an $\infty^0$ form. Take logs.
2. The log is $e^{-x}\ln(1+x^2)=\dfrac{\ln(1+x^2)}{e^x}$, which is $\frac\infty\infty$.
3. L'Hôpital: $\dfrac{\frac{2x}{1+x^2}}{e^x}=\dfrac{2x}{(1+x^2)e^x}\to0$.
4. So the limit is $e^0=1$. **Answer: (C).**

**[GATE 1993 Q.2.1](#/q/go_v1_5.5.1).** Find $\lim_{x\to0}\dfrac{x(e^x-1)+2(\cos x-1)}{x(1-\cos x)}$.

1. Top, first part: $x(e^x-1)=x\Big(x+\dfrac{x^2}{2}+\cdots\Big)=x^2+\dfrac{x^3}{2}+\cdots$
2. Top, second part: $2(\cos x-1)=2\Big(-\dfrac{x^2}{2}+\dfrac{x^4}{24}-\cdots\Big)=-x^2+\dfrac{x^4}{12}-\cdots$
3. The $x^2$ terms cancel, so the top is $\dfrac{x^3}{2}+(\text{higher powers})$.
4. Bottom: $x(1-\cos x)=x\Big(\dfrac{x^2}{2}-\cdots\Big)=\dfrac{x^3}{2}+(\text{higher powers})$.
5. Divide top and bottom by $x^3$ and let $x\to0$: $\dfrac{1/2}{1/2}=1$. **Answer: 1.**

### Quick check

**1.** Find $\lim_{x\to0}\dfrac{x-\sin x}{x^2}$.

<details><summary>Show answer</summary>

$\frac00$, so use L'Hôpital: $\dfrac{1-\cos x}{2x}$, still $\frac00$. Again: $\dfrac{\sin x}{2}\to0$. By series: the top is about $\dfrac{x^3}{6}$, so the ratio is about $\dfrac x6\to0$.

</details>

**2.** Find $\lim_{x\to\infty}\Big(1+\dfrac2x\Big)^{x}$.

<details><summary>Show answer</summary>

A $1^\infty$ form with $g(f-1)=x\cdot\dfrac2x=2$. So the limit is $e^2$.

</details>

**3.** Find $\lim_{x\to0^+}x^{\sin x}$.

<details><summary>Show answer</summary>

A $0^0$ form. Its log is $\sin x\cdot\ln x=\dfrac{\sin x}{x}\cdot(x\ln x)\to1\cdot0=0$. So the limit is $e^0=1$.

</details>

**4.** Which of these is not an indeterminate form: $0^\infty$, $1^\infty$, $\infty-\infty$?

<details><summary>Show answer</summary>

$0^\infty$. A base heading to $0$ raised to a huge power only gets smaller, so the answer is always $0$. The other two can come out to anything.

</details>

**5.** ([GATE 2015](#/q/es_Xvd5fxTxf8eRROIE)) Find $\lim_{x\to\infty}x^{1/x}$.

<details><summary>Show answer</summary>

An $\infty^0$ form. Its log is $\dfrac{\ln x}{x}$, which is $\frac\infty\infty$. L'Hôpital gives $\dfrac{1/x}{1}\to0$. So the limit is $e^0=1$. (Check: $100^{1/100}\approx1.047$.)

</details>

### Practice from GATE

- [GATE 2017 Set 1 Q.28](#/q/es_0cQnrAgEAmHo8JWH): one round of L'Hôpital at $x=1$.
- [GATE 2010 Q.5](#/q/es_aPeMLGY13z8rWFqK): a $1^\infty$ limit.
- [GATE 2015 Set 1 Q.4](#/q/es_Xvd5fxTxf8eRROIE): $x^{1/x}$, an $\infty^0$ form.
- [GATE 2015 Set 3 Q.9](#/q/es_kSv4WD6eZP6RvmDs): $(1+x^2)^{e^{-x}}$, logs then L'Hôpital.
- [GATE 2008 Q.1](#/q/es_9vlJKJi9rHPIu6Sn): a limit where L'Hôpital fails.
- [GATE 1993 Q.2.1](#/q/go_v1_5.5.1): first terms cancel, so use series.

## Continuity {#continuity}

*Test whether a function is continuous at a point, choose constants so that pieces join up, name the kind of break, and use the intermediate value theorem to locate roots.*

### The idea

A function is **continuous** when you can draw its graph without lifting your pen. Any place where you must lift the pen, such as a hole, a jump or a blow-up, is called a **discontinuity**.

Zoom in on one point $x=a$. "No lifting the pen" there means three things: the curve arrives at some height from the left, it leaves from the same height on the right, and the point at $x=a$ sits exactly at that height.

### The three-part check

> **Remember:** $f$ is continuous at $x=a$ when (1) $f(a)$ is defined, (2) $\lim_{x\to a}f(x)$ exists, so the left-hand and right-hand limits agree, and (3) that limit equals $f(a)$. In short: left-hand limit = right-hand limit = $f(a)$.

**Example.** Let $f(x)=\dfrac{x^2-9}{x-3}$ for $x\ne3$, and $f(3)=6$.

1. $f(3)=6$ is defined.
2. For $x\ne3$, $f(x)=\dfrac{(x-3)(x+3)}{x-3}=x+3$, so both one-sided limits at $3$ are $6$.
3. The limit, $6$, equals $f(3)=6$. So $f$ is continuous at $3$.

If the question had set $f(3)=5$ instead, step 3 would fail: the limit exists but misses the value.

**Which functions are continuous?** Polynomials, $e^x$, $\sin x$ and $\cos x$ are continuous everywhere. $\ln x$ and $\sqrt{x}$ are continuous wherever they are defined. Sums, products and chains of continuous functions are continuous, and so is a fraction, except where its bottom is $0$. So the only points worth checking are joins between formulas, zeros of a bottom, and the jumps of a floor function.

### Piecewise functions: find the constant

A function given by different formulas on different pieces is usually continuous inside each piece. So check only the joins. At each join, the left formula, the right formula and the value must all meet.

**Example.** $f(x)=kx+1$ for $x\le2$, and $f(x)=x^2-1$ for $x>2$. Find $k$ so that $f$ is continuous.

1. From the left, and at $x=2$ itself, the value is $2k+1$.
2. From the right, the formula heads to $2^2-1=3$.
3. Set them equal: $2k+1=3$, so $k=1$.

The same idea works with limits. If $f(x)=\dfrac{\sin3x}{x}$ for $x\ne0$ and $f(0)=k$, continuity needs $k=\lim_{x\to0}\dfrac{\sin3x}{x}=3$.

### Kinds of break

<figure class="fig"><svg viewBox="0 0 416 130" role="img" aria-label="Three kinds of break: a hole with the point moved up, a jump between two levels, and a blow-up near a vertical dashed line">
<text x="68" y="16" font-size="12" fill="currentColor" text-anchor="middle">hole (removable)</text>
<line x1="8.0" y1="111.8" x2="128.0" y2="111.8" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="30.5" y1="124.0" x2="30.5" y2="24.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M11.8 99.6 L13.5 98.4 L15.3 97.3 L17.1 96.1 L18.9 94.9 L20.8 93.8 L22.5 92.6 L24.3 91.4 L26.1 90.2 L28.0 89.1 L29.7 87.9 L31.5 86.7 L33.3 85.6 L35.1 84.4 L37.0 83.2 L38.8 82.0 L40.5 80.9 L42.4 79.7 L44.1 78.5 L45.9 77.4 L47.7 76.2 L49.5 75.0 L51.4 73.9 L53.1 72.7 L55.0 71.5 L56.7 70.3 L58.5 69.2 L60.3 68.0 L62.1 66.8 L64.0 65.7 L65.8 64.5" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<path d="M70.2 61.6 L72.1 60.4 L73.9 59.2 L75.7 58.0 L77.4 56.9 L79.2 55.7 L81.0 54.5 L82.8 53.4 L84.6 52.2 L86.4 51.0 L88.2 49.9 L90.0 48.7 L91.8 47.5 L93.7 46.3 L95.5 45.2 L97.2 44.0 L99.0 42.8 L100.8 41.7 L102.6 40.5 L104.4 39.3 L106.2 38.1 L108.0 37.0 L109.8 35.8 L111.6 34.6 L113.5 33.5 L115.2 32.3 L117.0 31.1 L118.8 30.0 L120.6 28.8 L122.5 27.6 L124.2 26.4" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="68.0" cy="63.0" r="3.2" fill="none" stroke="var(--accent)" stroke-width="1.6"/>
<circle cx="68.0" cy="38.6" r="3" fill="var(--accent)"/>
<line x1="68.0" y1="108.8" x2="68.0" y2="114.8" stroke="currentColor"/>
<text x="68.0" y="125.8" font-size="11" fill="currentColor" text-anchor="middle">a</text>
<text x="208" y="16" font-size="12" fill="currentColor" text-anchor="middle">jump</text>
<line x1="148.0" y1="111.8" x2="268.0" y2="111.8" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="170.5" y1="124.0" x2="170.5" y2="24.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M151.8 105.7 L153.6 105.1 L155.4 104.5 L157.2 103.9 L159.0 103.3 L160.8 102.8 L162.6 102.2 L164.4 101.6 L166.2 101.0 L168.1 100.4 L169.9 99.8 L171.7 99.2 L173.5 98.6 L175.3 98.0 L177.1 97.5 L178.9 96.9 L180.8 96.3 L182.6 95.7 L184.4 95.1 L186.2 94.5 L188.0 93.9 L189.8 93.3 L191.6 92.7 L193.4 92.2 L195.2 91.6 L197.1 91.0 L198.9 90.4 L200.7 89.8 L202.5 89.2 L204.3 88.6 L206.1 88.0" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<path d="M208.0 55.7 L209.9 55.1 L211.8 54.5 L213.6 53.9 L215.5 53.3 L217.4 52.7 L219.2 52.0 L221.1 51.4 L223.0 50.8 L224.9 50.2 L226.8 49.6 L228.6 49.0 L230.5 48.4 L232.4 47.8 L234.2 47.2 L236.1 46.6 L238.0 46.0 L239.9 45.3 L241.8 44.7 L243.6 44.1 L245.5 43.5 L247.4 42.9 L249.2 42.3 L251.1 41.7 L253.0 41.1 L254.9 40.5 L256.8 39.9 L258.6 39.2 L260.5 38.6 L262.4 38.0 L264.2 37.4" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<circle cx="208.0" cy="87.4" r="3.2" fill="none" stroke="var(--accent)" stroke-width="1.6"/>
<circle cx="208.0" cy="55.7" r="3" fill="var(--accent)"/>
<line x1="208.0" y1="108.8" x2="208.0" y2="114.8" stroke="currentColor"/>
<text x="208.0" y="125.8" font-size="11" fill="currentColor" text-anchor="middle">a</text>
<text x="348" y="16" font-size="12" fill="currentColor" text-anchor="middle">blow-up (infinite)</text>
<line x1="288.0" y1="86.5" x2="408.0" y2="86.5" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="310.5" y1="124.0" x2="310.5" y2="24.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M291.8 79.2 L293.0 79.3 L294.2 79.5 L295.5 79.6 L296.7 79.7 L298.0 79.9 L299.2 80.0 L300.5 80.2 L301.7 80.3 L303.0 80.5 L304.2 80.7 L305.5 80.9 L306.7 81.1 L308.0 81.3 L309.2 81.6 L310.5 81.8 L311.7 82.1 L313.0 82.4 L314.2 82.7 L315.5 83.0 L316.7 83.4 L318.0 83.8 L319.2 84.2 L320.5 84.7 L321.7 85.2 L323.0 85.7 L324.2 86.3 L325.5 87.0 L326.7 87.8 L328.0 88.6 L329.2 89.6 L330.5 90.7 L331.7 92.0 L333.0 93.5 L334.2 95.3 L335.5 97.4 L336.7 100.0 L338.0 103.3 L339.2 107.5 L340.5 113.0 L341.7 120.8" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<path d="M355.5 35.0 L356.7 40.4 L357.9 44.5 L359.2 47.7 L360.4 50.3 L361.6 52.5 L362.8 54.2 L364.0 55.7 L365.3 57.0 L366.5 58.1 L367.7 59.1 L368.9 60.0 L370.1 60.8 L371.3 61.5 L372.6 62.1 L373.8 62.6 L375.0 63.2 L376.2 63.6 L377.4 64.0 L378.7 64.4 L379.9 64.8 L381.1 65.1 L382.3 65.5 L383.5 65.8 L384.8 66.0 L386.0 66.3 L387.2 66.5 L388.4 66.7 L389.6 67.0 L390.8 67.2 L392.1 67.4 L393.3 67.5 L394.5 67.7 L395.7 67.9 L396.9 68.0 L398.2 68.2 L399.4 68.3 L400.6 68.4 L401.8 68.6 L403.0 68.7 L404.2 68.8" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<line x1="348.0" y1="124.0" x2="348.0" y2="24.0" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity="0.6"/>
<text x="352.0" y="100.5" font-size="11" fill="currentColor" text-anchor="start">a</text>
</svg><figcaption>The three main kinds of break at $x=a$. Open circles are missing points; filled dots show the value $f(a)$.</figcaption></figure>

| kind | what happens at $a$ | example |
|---|---|---|
| hole (**removable**) | the limit exists, but $f(a)$ is missing or different | $\dfrac{x^2-1}{x-1}$ at $1$ |
| **jump** | the left and right limits are different numbers | $\lfloor x\rfloor$ at each whole number; $\dfrac{\lvert x\rvert}{x}$ at $0$ |
| blow-up (**infinite**) | the values shoot off towards $\pm\infty$ | $\dfrac1x$ at $0$; $\dfrac{1}{x^3-27}$ at $3$ |

A hole is called removable because redefining one value fixes it. A jump or a blow-up cannot be fixed that way. There is also a rarer kind: $\sin\frac1x$ swings faster and faster near $0$ and never settles.

**Counting the breaks of a step function.** A function built from steps, like $\lfloor x\rfloor$, is constant on each step. It can only break where a step ends, and it breaks there only if the value actually changes. For example, $\lfloor x\rfloor$ for $0<x<5$ breaks at $1$, $2$, $3$ and $4$: four points.

### The intermediate value theorem

First, some notation for stretches of the number line, called **intervals**: $[a,b]$ means all $x$ with $a\le x\le b$ (ends included), and $(a,b)$ means all $x$ with $a<x<b$ (ends left out).

> **Remember:** if $f$ is continuous on $[a,b]$, then $f$ takes every value between $f(a)$ and $f(b)$ somewhere in $[a,b]$. This is the **intermediate value theorem** (IVT). A pen that moves from height $f(a)$ to height $f(b)$ without lifting must pass through every height in between.

The most useful case is the value $0$.

> **GATE tip:** if $f$ is continuous on $[a,b]$ and $f(a)\,f(b)<0$ (the two ends have opposite signs), then $f$ has a root somewhere in $(a,b)$.

For example, $f(x)=x^3-x-1$ has $f(1)=-1$ and $f(2)=5$, so it has a root between $1$ and $2$ (it is about $1.3247$). Halving the interval again and again, and keeping the half with a sign change, pins the root down. This is the **bisection method**.

GATE builds on this in four ways:

1. **Odd degree means a real root.** For an odd-degree polynomial, the values at large negative $x$ and at large positive $x$ have opposite signs, so the IVT gives a root. This makes the warm-up's picture exact.
2. **Exactly one root.** The IVT gives at least one root. If $f$ only ever rises (or only ever falls), it can cross $0$ only once. On $[0,\pi]$, $x$ rises while $\cos x$ falls, so $g(x)=x-\cos x$ only rises. With $g(0)=-1$ and $g(\pi)=\pi+1$, the equation $x=\cos x$ has exactly one solution in $[0,\pi]$.
3. **Counting forced roots.** Each sign change between neighbouring known values forces a separate root. If $p(1),\dots,p(5)$ are $1,-1,1,-1,1$, there are four sign changes, so a polynomial through these points has at least four roots and degree at least $4$.
4. **Build a helper function.** To show that some $y$ has $f(y)=f(y+1)$, apply the IVT to $g(y)=f(y)-f(y+1)$ and look for a sign change.

> **Watch out:** the IVT needs continuity on the whole closed interval. $\dfrac1x$ is $-1$ at $x=-1$ and $1$ at $x=1$, yet it is never $0$, because it breaks at $x=0$.

**A second gift of continuity.** A function that is continuous on a closed interval $[a,b]$ always reaches a largest value and a smallest value there. This is the **extreme value theorem**, and the maxima and minima lesson relies on it. Drop either condition and it can fail. For $0<x\le1$ (an interval open at one end), $\dfrac1x$ has no largest value. And $x^{-1/3}$ on $[-1,1]$ is not defined at $0$, so it is not continuous there, and its values grow without bound near $0$.

### How GATE asks this

- Which piecewise function is continuous at a given point (2013).
- Choose constants so that a function is continuous (2026).
- Count the points where a step-like function breaks (2026).
- Show that a root exists, count roots, or find a point with some property, using the IVT (1987 twice, 1995, 2000, 2014).

**[GATE 2026 Set 1 Q.22](#/q/es_mmz0yv4u).** Let $f(x)=c_1e^x-c_2\ln\dfrac1x$ for $x>0$, and $f(x)=3$ otherwise. If $f$ is continuous at $0$, find $c_1+c_2$.

1. At $0$ and to its left, $f$ is the constant $3$. So the right-hand limit must also be $3$.
2. For $x>0$, $\ln\dfrac1x=-\ln x$, so $f(x)=c_1e^x+c_2\ln x$.
3. As $x\to0^+$, $e^x\to1$ but $\ln x\to-\infty$. If $c_2\ne0$, the right-hand limit is $\pm\infty$ and continuity fails. So $c_2=0$.
4. The right-hand limit is then $c_1\cdot1=c_1$, which must equal $3$. So $c_1+c_2=3+0=3$. **Answer: 3.**

**[GATE 2014 Set 1 Q.47](#/q/es_UgyU8XjMRYrNzJlm).** $f$ is continuous on $[0,2]$, with $f(0)=f(2)=-1$ and $f(1)=1$. Which must be true? (A) Some $y$ in $(0,1)$ has $f(y)=f(y+1)$. (B) Every $y$ in $(0,1)$ has $f(y)=f(2-y)$. (C) The largest value of $f$ on $(0,2)$ is $1$. (D) Some $y$ in $(0,1)$ has $f(y)=-f(2-y)$.

1. For (A), build $g(y)=f(y)-f(y+1)$ on $[0,1]$. It is continuous, because $f$ is.
2. $g(0)=f(0)-f(1)=-1-1=-2$ and $g(1)=f(1)-f(2)=1-(-1)=2$.
3. Opposite signs, so $g(y)=0$ for some $y$ in $(0,1)$. That means $f(y)=f(y+1)$. **Answer: (A).**
4. (B) and (C) are not forced. The zigzag through $(0,-1)$, $(0.5,3)$, $(1,1)$, $(1.5,0)$, $(2,-1)$ fits the data, yet $f(0.5)=3$ while $f(1.5)=0$, and its largest value is $3$.

> **Watch out:** (D) is forced too. The same trick with $h(y)=f(y)+f(2-y)$ gives $h(0)=-2$ and $h(1)=2$. The official key accepts only (A), so this question really has two correct options.

### Quick check

**1.** $f(x)=\dfrac{x^2-4}{x-2}$ for $x\ne2$, and $f(2)=k$. Which $k$ makes $f$ continuous?

<details><summary>Show answer</summary>

For $x\ne2$, $f(x)=x+2$, so the limit at $2$ is $4$. Continuity needs $k=4$.

</details>

**2.** What kind of break does $\dfrac{|x-1|}{x-1}$ have at $x=1$?

<details><summary>Show answer</summary>

A jump. For $x>1$ the value is $1$, and for $x<1$ it is $-1$. The two one-sided limits are different numbers.

</details>

**3.** Show that $x^3+x-1=0$ has a root between $0$ and $1$.

<details><summary>Show answer</summary>

$f(x)=x^3+x-1$ is a polynomial, so it is continuous. $f(0)=-1<0$ and $f(1)=1>0$. Opposite signs, so by the IVT there is a root in $(0,1)$.

</details>

**4.** ([GATE 2013](#/q/es_xrvxoYD6085P4rhw)) $f(3)=2$, $f(x)=x-1$ for $x>3$, and $f(x)=\dfrac{x+3}{3}$ for $x<3$. Is $f$ continuous at $3$?

<details><summary>Show answer</summary>

Yes. The right-hand limit is $3-1=2$, the left-hand limit is $\dfrac{3+3}{3}=2$, and $f(3)=2$. All three agree.

</details>

**5.** ([GATE 2026](#/q/es_mmz108lh)) For $0<r<1$, let $f(r)=1$ if the second digit after the decimal point of $r$ is $2$, $3$, $6$ or $7$, and $f(r)=0$ otherwise. At how many points is $f$ discontinuous?

<details><summary>Show answer</summary>

The second digit stays fixed on each stretch from $\frac{k}{100}$ to $\frac{k+1}{100}$, so $f$ can only break at the points $\frac{k}{100}$. The value by digit is $0,0,1,1,0,0,1,1,0,0$ for digits $0$ to $9$. It changes only when the digit steps into $2$, $4$, $6$ or $8$; the step from $9$ to $0$ is $0$ to $0$. So the breaks are $0.02, 0.04, 0.06, 0.08, 0.12,\dots,0.98$: four for each of the ten first digits, which is $40$.

</details>

### Practice from GATE

- [GATE 2013 Q.22](#/q/es_xrvxoYD6085P4rhw): which piecewise function is continuous at $3$.
- [GATE 2026 Set 1 Q.22](#/q/es_mmz0yv4u): choose constants for continuity.
- [GATE 1987 Q.1(xxvi)](#/q/go_v1_5.6.1): a sign change forces a root.
- [GATE 1987 Q.1(xxii)](#/q/go_v1_5.7.1): an odd-degree polynomial has a real root.
- [GATE 1995 Q.1.21](#/q/go_v1_5.6.2): $x=\cos x$ has exactly one solution in $[0,\pi]$.
- [GATE 2000 Q.2.4](#/q/go_v1_4.11.2): alternating signs force four roots.
- [GATE 2014 Set 1 Q.47](#/q/es_UgyU8XjMRYrNzJlm): the helper-function trick.
- [GATE 2026 Set 2 Q.54](#/q/es_mmz108lh): counting the jumps of a digit function.

## Derivatives and differentiability {#differentiability}

*Find derivatives from the definition and with the standard rules, decide where a function is differentiable, and differentiate an integral with the Leibniz rule.*

### The idea

The **derivative** measures how fast a function is changing. On the graph, it is the slope of the curve at a point. In real life it is a rate: speed is the derivative of distance with respect to time.

Zoom in on a smooth curve at a point and it looks more and more like a straight line. That line is the **tangent** at the point, and the derivative is its slope.

### The derivative as a limit

The slope of the straight line through two nearby points of the graph, at $x=a$ and $x=a+h$, is $\dfrac{f(a+h)-f(a)}{h}$ (rise over run). Now slide the second point in by letting $h\to0$:

$$f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}.$$

If this limit exists as a finite number, $f$ is **differentiable** at $a$. The notations $f'(x)$, $\dfrac{dy}{dx}$ and $\dfrac{d}{dx}f(x)$ all mean the derivative.

**Example.** For $f(x)=x^2$:

$$\frac{(a+h)^2-a^2}{h}=\frac{2ah+h^2}{h}=2a+h\ \to\ 2a.$$

So the slope of $x^2$ at $x=3$ is $6$.

### Left and right derivatives

As with limits, $h$ can approach $0$ from either side. Using only $h<0$ gives the **left derivative**; using only $h>0$ gives the **right derivative**.

> **Remember:** $f$ is differentiable at $a$ only when the left and right derivatives both exist, are finite, and are equal.

<figure class="fig"><svg viewBox="0 0 305 130" role="img" aria-label="Left: y equals absolute x with slope minus one on the left and plus one on the right. Right: the cube root of x, whose tangent at zero is the vertical axis.">
<text x="75" y="16" font-size="12" fill="currentColor" text-anchor="middle">y = |x|</text>
<line x1="10.0" y1="102.6" x2="140.0" y2="102.6" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="75.0" y1="124.0" x2="75.0" y2="24.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M10.0 31.1 L75.0 102.6 L140.0 31.1" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<text x="31.1" y="91.9" font-size="11" fill="currentColor" text-anchor="middle">slope −1</text>
<text x="118.9" y="91.9" font-size="11" fill="currentColor" text-anchor="middle">slope +1</text>
<text x="230" y="16" font-size="12" fill="currentColor" text-anchor="middle">y = x<tspan dy="-5" font-size="9">1/3</tspan></text>
<line x1="165.0" y1="74.0" x2="295.0" y2="74.0" stroke="currentColor" stroke-opacity="0.4"/>
<line x1="230.0" y1="124.0" x2="230.0" y2="24.0" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M165.0 116.0 L166.6 115.6 L168.2 115.3 L169.9 114.9 L171.5 114.5 L173.1 114.2 L174.8 113.8 L176.4 113.4 L178.0 113.0 L179.6 112.6 L181.2 112.2 L182.9 111.7 L184.5 111.3 L186.1 110.8 L187.8 110.4 L189.4 109.9 L191.0 109.4 L192.6 108.9 L194.2 108.4 L195.9 107.9 L197.5 107.3 L199.1 106.8 L200.8 106.2 L202.4 105.6 L204.0 104.9 L205.6 104.3 L207.2 103.6 L208.9 102.9 L210.5 102.1 L212.1 101.3 L213.8 100.5 L215.4 99.5 L217.0 98.6 L218.6 97.5 L220.2 96.3 L221.9 95.0 L223.5 93.5 L225.1 91.7 L226.8 89.5 L228.4 86.3 L230.0 74.0 L231.6 61.7 L233.2 58.5 L234.9 56.3 L236.5 54.5 L238.1 53.0 L239.8 51.7 L241.4 50.5 L243.0 49.4 L244.6 48.5 L246.2 47.5 L247.9 46.7 L249.5 45.9 L251.1 45.1 L252.8 44.4 L254.4 43.7 L256.0 43.1 L257.6 42.4 L259.2 41.8 L260.9 41.2 L262.5 40.7 L264.1 40.1 L265.8 39.6 L267.4 39.1 L269.0 38.6 L270.6 38.1 L272.2 37.6 L273.9 37.2 L275.5 36.7 L277.1 36.3 L278.8 35.8 L280.4 35.4 L282.0 35.0 L283.6 34.6 L285.2 34.2 L286.9 33.8 L288.5 33.5 L290.1 33.1 L291.8 32.7 L293.4 32.4 L295.0 32.0" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
<text x="233.9" y="115.7" font-size="11" fill="currentColor" text-anchor="start">tangent</text>
<line x1="230.0" y1="120.7" x2="230.0" y2="27.3" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3"/>
</svg><figcaption>Two ways to fail at $x=0$: a corner ($|x|$) and a vertical tangent ($x^{1/3}$).</figcaption></figure>

Differentiability fails in three typical ways:

1. **A corner.** For $|x|$ at $0$, the slope ratio is $\dfrac{|h|-0}{h}$. It is $+1$ for $h>0$ and $-1$ for $h<0$. The two sides disagree, so $|x|$ is not differentiable at $0$. No single tangent fits the sharp point.
2. **A vertical tangent.** For $x^{1/3}$ at $0$, the ratio is $\dfrac{h^{1/3}}{h}=h^{-2/3}$, which grows without bound. The curve is smooth but stands straight up at $0$, so the slope is infinite and $x^{1/3}$ is not differentiable there. ($x^{2/3}$ is worse: slopes of $-\infty$ on one side and $+\infty$ on the other, a sharp spike.)
3. **A break.** A function that is not continuous at $a$ cannot be differentiable at $a$, as the next part shows.

### Differentiable means continuous, not the other way round

If $f$ is differentiable at $a$, then

$$f(a+h)-f(a)=h\cdot\frac{f(a+h)-f(a)}{h}\ \to\ 0\cdot f'(a)=0.$$

So $f(a+h)\to f(a)$: the function is continuous at $a$. The reverse is false: $|x|$ is continuous at $0$ but has a corner there.

> **Remember:** differentiable ⇒ continuous. Continuous does not imply differentiable ($|x|$, $x^{1/3}$). Not continuous ⇒ not differentiable. So an option saying "differentiable but not continuous" is always false.

### Joining pieces smoothly

For a function made of smooth pieces such as polynomials, only the joins need checking, and each join needs two checks:

1. **The values meet** (continuity).
2. **The slopes meet:** the derivative of the left formula at the join equals the derivative of the right formula there.

> **Watch out:** do check 1 first. The slopes can match across a jump. $x^2$ for $x<1$ and $x^2+5$ for $x\ge1$ both have slope $2$ at $x=1$, but the values $1$ and $6$ do not meet, so there is no derivative there.

The same test works one level up. To ask whether $f'$ is itself differentiable at a join, compare the slopes of $f'$ on each side. For example, take $f(x)=-\dfrac{x^2}{4}$ for $x\ge0$ and $f(x)=-\dfrac{9x^2}{4}$ for $x<0$. Both formulas give value $0$ and slope $0$ at $x=0$, so $f$ is differentiable and $f'$ is continuous. But $f'$ is $-\dfrac x2$ on the right and $-\dfrac{9x}{2}$ on the left, with slopes $-\dfrac12$ and $-\dfrac92$: $f'$ has a corner at $0$.

**Larger of two functions.** $\max\{f,g\}$ (the larger of the two values) switches formula where $f=g$. At a switch point it has a corner unless $f$ and $g$ have the same slope there.

### The derivative toolkit

| $f(x)$ | $f'(x)$ | $f(x)$ | $f'(x)$ |
|---|---|---|---|
| constant | $0$ | $\sin x$ | $\cos x$ |
| $x^n$ | $nx^{n-1}$ | $\cos x$ | $-\sin x$ |
| $e^{ax}$ | $ae^{ax}$ | $\tan x$ | $\sec^2x$ |
| $a^x$ | $a^x\ln a$ | $\sec x$ | $\sec x\tan x$ |
| $\ln x$ | $\dfrac1x$ | $\sin^{-1}x$ | $\dfrac{1}{\sqrt{1-x^2}}$ |
| $\log_a x$ | $\dfrac{1}{x\ln a}$ | $\tan^{-1}x$ | $\dfrac{1}{1+x^2}$ |

Here $\sec x=\dfrac{1}{\cos x}$, and $\sin^{-1}x$ and $\tan^{-1}x$ are the **inverse** functions: the angle whose sine (or tangent) is $x$.

The rules for combining them:

- **Sums and constants:** $(f+g)'=f'+g'$ and $(cf)'=cf'$.
- **Product rule:** $(uv)'=u'v+uv'$. Why: think of $uv$ as the area of a rectangle with sides $u$ and $v$. Nudge $x$ and the area grows by a thin strip along each side, $u'\cdot v$ and $u\cdot v'$.
- **Quotient rule:** $\left(\dfrac uv\right)'=\dfrac{u'v-uv'}{v^2}$.
- **Chain rule:** $\dfrac{d}{dx}f(g(x))=f'(g(x))\cdot g'(x)$. Differentiate the outside function, leaving the inside alone, then multiply by the derivative of the inside.

**Example 1.** $(x^2\sin x)'=2x\sin x+x^2\cos x$ (product rule).

**Example 2.** $\left(\dfrac{x}{1+x^2}\right)'=\dfrac{1\cdot(1+x^2)-x\cdot2x}{(1+x^2)^2}=\dfrac{1-x^2}{(1+x^2)^2}$ (quotient rule).

**Example 3.** $\dfrac{d}{dx}\sin(x^2)=\cos(x^2)\cdot2x$ and $\dfrac{d}{dx}\sqrt{x^3+1}=\dfrac{3x^2}{2\sqrt{x^3+1}}$ (chain rule).

**Example 4: a variable power, $x^x$.** Neither the $x^n$ rule nor the $a^x$ rule fits, because both the base and the power vary. So take logs first.

1. Let $y=x^x$. Then $\ln y=x\ln x$.
2. Differentiate both sides. The left side needs the chain rule: $\dfrac{y'}{y}=1\cdot\ln x+x\cdot\dfrac1x=\ln x+1$.
3. Multiply by $y$: $\dfrac{d}{dx}x^x=x^x(1+\ln x)$.

**Higher derivatives and symmetry.** Differentiating again gives $f''$, then $f'''$, and so on. Also, the derivative of an even function is odd, and the derivative of an odd function is even: each power drops by one, so $x^4\to4x^3$ and $x^3\to3x^2$.

### Differentiating an integral: the Leibniz rule

The **integral** $\int_a^x f(t)\,dt$ is the area under the graph of $f$ from $t=a$ to $t=x$ (the integration lessons build this properly). Push $x$ to the right by a tiny $h$, and the area grows by a thin strip of width $h$ and height about $f(x)$. So the area grows at rate $f(x)$:

$$\frac{d}{dx}\int_a^x f(t)\,dt=f(x).$$

When both ends move, the top end adds area at the height there times its speed, and the bottom end takes area away in the same way. This is the **Leibniz rule**:

$$\frac{d}{dx}\int_{a(x)}^{b(x)}f(t)\,dt=f(b(x))\,b'(x)-f(a(x))\,a'(x).$$

**Example.** $\dfrac{d}{dx}\displaystyle\int_0^{x^2}\sin t\,dt=\sin(x^2)\cdot2x$, and $\dfrac{d}{dx}\displaystyle\int_x^{2x}e^{-t^2}\,dt=2e^{-4x^2}-e^{-x^2}$.

### Two variables: partial derivatives

A function like $f(x,y)=x^2y+3y^2$ has two inputs. Its **partial derivative** with respect to $x$, written $f_x$, is the ordinary derivative in $x$ while you treat $y$ as a fixed number. $f_y$ is the same with the roles swapped:

$$f_x=2xy,\qquad f_y=x^2+6y,\qquad f_{xx}=2y,\qquad f_{yy}=6,\qquad f_{xy}=2x.$$

Here $f_{xy}$ means: take $f_x$, then differentiate it in $y$. Two more facts complete the picture:

- **Chain rule for two inputs.** If $x$ and $y$ both depend on $t$, then $\dfrac{df}{dt}=f_x\dfrac{dx}{dt}+f_y\dfrac{dy}{dt}$. This is the **total derivative**.
- **Euler's theorem.** $f$ is **homogeneous of degree $n$** if scaling both inputs by $\lambda$ scales $f$ by $\lambda^n$. Then $xf_x+yf_y=nf$. For $f=x^2+3xy$ (degree 2): $x(2x+3y)+y(3x)=2x^2+6xy=2f$.

### How GATE asks this

- Is $|x|$ continuous, differentiable, both or neither? (1998, 2007)
- Choose constants so that a piecewise function is differentiable: match values and slopes (1996, 2025).
- Find the corners of $\max\{\dots\}$ or of an expression with $|x|$ (2024, 2026).
- Use the product rule twice, or combine a derivative with an integral condition (2014, 2017).
- Even and odd parts under differentiation (2016).

**[GATE 2025 Set 1 Q.21](#/q/es_m7wybyu4).** $f(x)=ax+b$ for $x<1$ and $f(x)=x^3+x^2+1$ for $x\ge1$. If $f$ is differentiable everywhere, find $b$.

1. Both pieces are polynomials, so only the join at $x=1$ matters.
2. Values meet: $a(1)+b=1+1+1$, so $a+b=3$.
3. Slopes meet: the left slope is $a$; the right slope is $3x^2+2x=3+2=5$ at $x=1$. So $a=5$.
4. Then $b=3-5=-2$. **Answer: $-2$.**

**[GATE 2024 Set 1 Q.1](#/q/es_lwtfemll).** $f(x)=\max\{x,x^3\}$. Where is $f$ not differentiable? Options: (A) $\{-1,1,2\}$, (B) $\{-2,-1,1\}$, (C) $\{0,1\}$, (D) $\{-1,0,1\}$.

1. The formulas switch where $x=x^3$, that is $x(x-1)(x+1)=0$: at $x=-1,0,1$.
2. The sign of $x^3-x=x(x-1)(x+1)$ decides which is larger: $f=x$ for $x<-1$, $f=x^3$ on $(-1,0)$, $f=x$ on $(0,1)$, and $f=x^3$ for $x>1$.
3. Compare slopes at each switch. The slope of $x$ is $1$; the slope of $x^3$ is $3x^2$, which is $3$ at $x=\pm1$ and $0$ at $x=0$. All three switch points have unequal slopes, so all three are corners.
4. **Answer: (D).** Between the switch points $f$ is a single polynomial, so $\pm2$ are fine.

### Quick check

**1.** Use the definition to find the derivative of $x^3$.

<details><summary>Show answer</summary>

$\dfrac{(x+h)^3-x^3}{h}=\dfrac{3x^2h+3xh^2+h^3}{h}=3x^2+3xh+h^2\to3x^2$.

</details>

**2.** Is $|x-2|$ differentiable at $x=2$?

<details><summary>Show answer</summary>

No. It is the V-shape of $|x|$ moved right by $2$, so it has a corner at $x=2$: slope $-1$ on the left and $+1$ on the right.

</details>

**3.** Find the slope of $x^x$ at $x=1$.

<details><summary>Show answer</summary>

$\dfrac{d}{dx}x^x=x^x(1+\ln x)$. At $x=1$: $1^1(1+0)=1$.

</details>

**4.** Find $\dfrac{d}{dx}\displaystyle\int_0^{x^3}\cos t\,dt$.

<details><summary>Show answer</summary>

By the Leibniz rule, take the function inside the integral at the top end, times the top end's derivative: $\cos(x^3)\cdot3x^2$. The bottom end is fixed, so it adds nothing.

</details>

**5.** ([GATE 2014](#/q/es_4UUduCiX2y0APPro)) $f(x)=x\sin x$ satisfies $f''(x)+f(x)+t\cos x=0$ for all $x$. Find $t$.

<details><summary>Show answer</summary>

Product rule: $f'=\sin x+x\cos x$. Again: $f''=\cos x+(\cos x-x\sin x)=2\cos x-x\sin x$. Then $f''+f=2\cos x$, so $2\cos x+t\cos x=0$ for all $x$, which needs $t=-2$.

</details>

### Practice from GATE

- [GATE 1998 Q.1.4](#/q/es_vkiWQr38LQE7V7cs) and [GATE 2007 Q.1](#/q/es_stWz00hFCkPlrxqe): $|x|$ is continuous everywhere but not differentiable at $0$.
- [GATE 2025 Set 1 Q.21](#/q/es_m7wybyu4): match the value and the slope at a join.
- [GATE 2014 Set 1 Q.46](#/q/es_4UUduCiX2y0APPro): the product rule twice.
- [GATE 2017 Set 2 Q.10](#/q/es_AvUdGsiNx6hpIk3A): constants from a derivative condition and an integral condition.
- [GATE 2016 Set 2 Q.2](#/q/es_Kk2BQDjT4zCQbFdk): even and odd parts of a polynomial under differentiation.
- [GATE 2024 Set 1 Q.1](#/q/es_lwtfemll): corners of $\max\{x,x^3\}$.
- [GATE 1996 Q.3](#/q/go_v1_5.1.1): four constants for two smooth joins.
- [GATE 2026 Set 1 Q.36](#/q/es_mmz108z5): an $|x|$ expression whose $f'$ is continuous but has a corner.

## Mean value theorems {#mean-value-theorems}

*State Rolle's, Lagrange's and Cauchy's theorems with their conditions, find the promised point c, and use them to bound values and to judge which functions qualify.*

### The idea

You drive 100 km in 2 hours, so your average speed is 50 km/h. If your speed changes smoothly, then at some moment the speedometer must read exactly 50 km/h. You cannot average 50 without passing through 50.

On a graph, the average rate of change from $x=a$ to $x=b$ is the slope of the straight line joining $(a,f(a))$ and $(b,f(b))$. This line is called the **chord**. The rate at a single point $c$ is the slope of the tangent there. The mean value theorems say that somewhere between $a$ and $b$, the tangent is parallel to the chord.

<figure class="fig"><svg viewBox="0 0 304 182" role="img" aria-label="A curve from a to b with its chord, and a dashed tangent at an inside point c that runs parallel to the chord">
<line x1="12.0" y1="144.4" x2="292.0" y2="144.4" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M26.0 99.6 L31.0 95.4 L36.1 91.2 L41.1 87.1 L46.2 83.1 L51.2 79.1 L56.2 75.3 L61.3 71.5 L66.3 67.9 L71.4 64.3 L76.4 60.9 L81.4 57.7 L86.5 54.6 L91.5 51.7 L96.6 49.0 L101.6 46.4 L106.6 44.0 L111.7 41.8 L116.7 39.8 L121.8 38.0 L126.8 36.5 L131.8 35.1 L136.9 33.9 L141.9 32.9 L147.0 32.1 L152.0 31.5 L157.0 31.1 L162.1 30.9 L167.1 30.9 L172.2 31.0 L177.2 31.3 L182.2 31.8 L187.3 32.4 L192.3 33.1 L197.4 34.0 L202.4 35.0 L207.4 36.0 L212.5 37.2 L217.5 38.4 L222.6 39.7 L227.6 41.1 L232.6 42.5 L237.7 43.9 L242.7 45.3 L247.8 46.7 L252.8 48.0 L257.8 49.3 L262.9 50.6 L267.9 51.8 L273.0 52.9 L278.0 54.0" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
<line x1="47.0" y1="82.4" x2="257.0" y2="49.1" stroke="currentColor" stroke-width="1.6"/>
<line x1="53.1" y1="47.0" x2="235.1" y2="18.1" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 4"/>
<line x1="47.0" y1="82.4" x2="47.0" y2="144.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="2 3"/>
<text x="47.0" y="158.4" font-size="12" fill="currentColor" text-anchor="middle">a</text>
<circle cx="47.0" cy="82.4" r="3" fill="var(--accent)"/>
<line x1="257.0" y1="49.1" x2="257.0" y2="144.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="2 3"/>
<text x="257.0" y="158.4" font-size="12" fill="currentColor" text-anchor="middle">b</text>
<circle cx="257.0" cy="49.1" r="3" fill="var(--accent)"/>
<line x1="144.1" y1="32.5" x2="144.1" y2="144.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="2 3"/>
<text x="144.1" y="158.4" font-size="12" fill="currentColor" text-anchor="middle">c</text>
<circle cx="144.1" cy="32.5" r="3" fill="var(--accent)"/>
<text x="176.5" y="77.9" font-size="11" fill="currentColor" text-anchor="middle">chord</text>
<text x="217.6" y="13.9" font-size="11" fill="currentColor" text-anchor="middle">tangent at c</text>
</svg><figcaption>Somewhere between $a$ and $b$ the tangent (dashed) is parallel to the chord: $f'(c)=\dfrac{f(b)-f(a)}{b-a}$.</figcaption></figure>

### Rolle's theorem

> **Remember:** **Rolle's theorem.** If $f$ is (1) continuous on $[a,b]$, (2) differentiable on $(a,b)$, and (3) $f(a)=f(b)$, then there is at least one $c$ in $(a,b)$ with $f'(c)=0$.

The picture: you start and finish at the same height. If the curve goes up, it must come back down, and at the top it is flat for an instant. If it goes down first, it is flat at the bottom. If it never moves, it is flat everywhere.

Each condition is needed. Each example below breaks exactly one of them, and no flat point appears:

- **Continuous on the closed interval.** Let $f(x)=x$ for $0\le x<1$, with $f(1)=0$. The ends match and $f$ is smooth inside, but it drops suddenly at the very end. The slope is $1$ everywhere inside.
- **Differentiable inside.** $|x|$ on $[-1,1]$ is continuous with equal ends, but its lowest point is a corner. The slope is $-1$ or $+1$, never $0$.
- **Equal ends.** $x$ on $[0,1]$ is as smooth as can be, but the slope is always $1$.

**Finding $c$.** For $f(x)=x^2-4x+3$ on $[1,3]$: $f(1)=0=f(3)$, and $f'(x)=2x-4=0$ gives $c=2$, which is inside $(1,3)$. The theorem promises at least one $c$; there may be more. For $x^3-x$ on $[-1,1]$, $f'(x)=3x^2-1=0$ gives two points, $c=\pm\dfrac{1}{\sqrt3}\approx\pm0.577$.

A useful consequence: between two roots of $f$ there is always a root of $f'$. So if $f'$ is never $0$ on an interval, $f$ has at most one root there.

### Lagrange's mean value theorem

> **Remember:** **Lagrange's mean value theorem (LMVT).** If $f$ is (1) continuous on $[a,b]$ and (2) differentiable on $(a,b)$, then there is at least one $c$ in $(a,b)$ with $$f'(c)=\frac{f(b)-f(a)}{b-a}.$$

This is Rolle's theorem with the equal-ends condition removed. Tilt the picture of Rolle's theorem until the chord is no longer level and you get this one: the flat tangent becomes a tangent parallel to the tilted chord.

**Example 1.** $f(x)=x^2$ on $[1,3]$. The chord slope is $\dfrac{9-1}{3-1}=4$. Then $f'(c)=2c=4$ gives $c=2$.

**Example 2.** $f(x)=x^3$ on $[0,2]$. The chord slope is $\dfrac{8-0}{2-0}=4$. Then $3c^2=4$ gives $c=\pm\dfrac{2}{\sqrt3}$. Keep only the one inside the interval: $c=\dfrac{2}{\sqrt3}\approx1.155$.

> **GATE tip:** for any quadratic $px^2+qx+r$, the LMVT point is always the midpoint $c=\dfrac{a+b}{2}$. The chord slope works out to $p(a+b)+q$, which is exactly $f'$ at the midpoint.

Three consequences you will use:

1. If $f'(x)=0$ everywhere on an interval, $f$ is constant there, because every chord has slope $0$.
2. If $f'>0$ on an interval, $f$ is increasing there; if $f'<0$, it is decreasing. Every chord takes the sign of some $f'(c)$. The next lesson is built on this.
3. **Bounds.** If $f'(x)\le M$ on the interval, then $f(b)-f(a)=f'(c)(b-a)\le M(b-a)$. For example, since the slope of $\sin x$ is $\cos x$, which never exceeds $1$ in size, $|\sin b-\sin a|\le|b-a|$.

### Cauchy's mean value theorem

> **Remember:** **Cauchy's mean value theorem.** If $f$ and $g$ are both continuous on $[a,b]$ and differentiable on $(a,b)$, and $g'(x)\ne0$ inside, then there is at least one $c$ in $(a,b)$ with $$\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(c)}{g'(c)}.$$

The picture is the same chord-and-tangent picture, drawn for the curve traced by the point $(g(t),f(t))$ as $t$ runs from $a$ to $b$. Taking $g(x)=x$ gives back LMVT. Cauchy's theorem is also the reason L'Hôpital's rule works.

**Example.** $f(x)=x^2$ and $g(x)=x^3$ on $[1,2]$.

1. Left side: $\dfrac{4-1}{8-1}=\dfrac37$.
2. Right side: $\dfrac{f'(c)}{g'(c)}=\dfrac{2c}{3c^2}=\dfrac{2}{3c}$.
3. Solve $\dfrac{2}{3c}=\dfrac37$: $c=\dfrac{14}{9}\approx1.56$, which is inside $(1,2)$.

> **Watch out:** you cannot get Cauchy's theorem by using LMVT on $f$ and on $g$ separately. That gives two points $c_1$ and $c_2$, which are usually different. Cauchy's theorem promises one shared $c$.

### Which function satisfies the conditions?

GATE likes a list of functions and asks which one meets the conditions. Check, in order: continuous on the closed interval? Differentiable at every point strictly inside? For Rolle's theorem, are the end values equal?

| function on interval | continuous on $[a,b]$ | differentiable inside | equal ends | Rolle applies? |
|---|---|---|---|---|
| $x^2-4x+3$ on $[1,3]$ | yes | yes | yes | yes, $c=2$ |
| $\sin x$ on $[0,\pi]$ | yes | yes | yes | yes, $c=\frac{\pi}{2}$ |
| $\lvert x\rvert$ on $[-1,1]$ | yes | no: corner at $0$ | yes | no |
| $x^{2/3}$ on $[-1,1]$ | yes | no: spike at $0$ | yes | no |
| $\dfrac{1}{x^2}$ on $[-1,1]$ | no: blows up at $0$ | no | yes | no |
| $\tan x$ on $[0,\pi]$ | no: blows up at $\frac{\pi}{2}$ | no | yes | no |

> **Watch out:** a bad point matters only if it lies inside the interval. $|x|$ on $[1,3]$ is just $x$ there, so it is fine. A bad point at an end is also fine for differentiability: $\sqrt x$ has an infinite slope at $0$, yet LMVT holds for $\sqrt x$ on $[0,1]$, because differentiability is only needed inside. Its chord slope is $1$, and $\dfrac{1}{2\sqrt c}=1$ gives $c=\dfrac14$.

### Where does a sequence settle?

The limits lesson showed that if $x_{n+1}=g(x_n)$ settles at $L$, then $L=g(L)$. When this equation has two solutions, LMVT tells you which one can attract the sequence. Apply it to $g$ between $x_n$ and $L$:

$$x_{n+1}-L=g(x_n)-g(L)=g'(c)\,(x_n-L)\quad\text{for some } c \text{ between } x_n \text{ and } L.$$

So each step multiplies the distance from $L$ by roughly $|g'(L)|$.

- If $|g'(L)|<1$, the distance shrinks at every step, so starting points near $L$ get pulled in. $L$ **attracts**.
- If $|g'(L)|>1$, the distance grows, so nearby starting points get pushed away. $L$ **repels**, and the sequence can reach it only by landing on it exactly.

### How GATE asks this

- Bound a value using a bound on the derivative (2021).
- Guarantee a flat point with Rolle's theorem (2014).
- Pick out which function satisfies the conditions on an interval.
- Decide which solution of $L=g(L)$ a sequence can settle at (IT 2007).

**[GATE 2021 Set 2 Q.25](#/q/es_40599uckwrzvl1p).** $f$ is continuous on $[-3,3]$ and differentiable on $(-3,3)$, with $f'(x)\le2$ everywhere and $f(-3)=7$. At most how large can $f(3)$ be?

1. By LMVT, $f(3)-f(-3)=f'(c)\cdot\big(3-(-3)\big)=6f'(c)$ for some $c$.
2. Since $f'(c)\le2$: $f(3)-7\le12$, so $f(3)\le19$.
3. The line $f(x)=2x+13$ has slope $2$, $f(-3)=7$ and $f(3)=19$, so $19$ is actually reached. **Answer: 19.**

**[GATE IT 2007 Q.76](#/q/go_v1_1.7.7).** $x_{n+1}=c\,x_n^2-2$ with $c>0$. For every start $x_0$ in some open interval, the sequence converges. To what? (A) $\dfrac{1+\sqrt{1+8c}}{2c}$, (B) $\dfrac{1-\sqrt{1+8c}}{2c}$, (C) $2$, (D) $\dfrac{2}{2c-1}$.

1. The limit solves $L=cL^2-2$, that is $cL^2-L-2=0$, so $L=\dfrac{1\pm\sqrt{1+8c}}{2c}$.
2. Here $g(x)=cx^2-2$, so $g'(x)=2cx$ and $g'(L)=2cL=1\pm\sqrt{1+8c}$.
3. For the $+$ root, $g'(L)=1+\sqrt{1+8c}>2$. It repels, so it cannot attract a whole interval of starting points.
4. So the limit must be the $-$ root. **Answer: (B).** (It does attract when $|1-\sqrt{1+8c}|<1$, which works out to $c<\frac38$. For $c=0.2$, starting from $0$ the terms are $0, -2, -1.2, -1.712,\dots$ and settle at $-1.531$.)

### Quick check

**1.** Find the point $c$ promised by Rolle's theorem for $f(x)=x^2-6x+8$ on $[2,4]$.

<details><summary>Show answer</summary>

$f(2)=0=f(4)$, so the theorem applies. $f'(x)=2x-6=0$ gives $c=3$.

</details>

**2.** Find the LMVT point for $f(x)=x^2+x$ on $[0,2]$.

<details><summary>Show answer</summary>

Chord slope: $\dfrac{6-0}{2-0}=3$. Then $f'(c)=2c+1=3$ gives $c=1$, the midpoint, as the tip about quadratics predicts.

</details>

**3.** Does Rolle's theorem apply to $|x-1|$ on $[0,2]$?

<details><summary>Show answer</summary>

No. The ends are equal ($1$ and $1$) and the function is continuous, but it has a corner at $x=1$, which is inside the interval. Indeed the slope is never $0$.

</details>

**4.** Find the LMVT point for $\sqrt x$ on $[0,4]$.

<details><summary>Show answer</summary>

Chord slope: $\dfrac{2-0}{4-0}=\dfrac12$. Then $\dfrac{1}{2\sqrt c}=\dfrac12$ gives $\sqrt c=1$, so $c=1$.

</details>

**5.** ([GATE 2014](#/q/es_LyHAmLeCXDo0Pz7G)) $f(\theta)$ is the determinant with rows $(\sin\theta,\cos\theta,\tan\theta)$, $(\sin\frac{\pi}{6},\cos\frac{\pi}{6},\tan\frac{\pi}{6})$ and $(\sin\frac{\pi}{3},\cos\frac{\pi}{3},\tan\frac{\pi}{3})$, for $\theta$ in $[\frac{\pi}{6},\frac{\pi}{3}]$. Is it true that (I) $f'(\theta)=0$ somewhere inside, and (II) $f'(\theta)\ne0$ somewhere inside?

<details><summary>Show answer</summary>

Both. A determinant with two equal rows is $0$ (see the linear algebra chapter), so $f(\frac{\pi}{6})=0$ (rows 1 and 2 match) and $f(\frac{\pi}{3})=0$ (rows 1 and 3 match). Expanding along row 1, $f$ is a mix of $\sin\theta$, $\cos\theta$ and $\tan\theta$, all smooth here, so Rolle's theorem gives (I). If $f'$ were $0$ everywhere, $f$ would be constantly $0$, but $f(\frac{\pi}{4})\approx0.098$. So (II) holds too.

</details>

### Practice from GATE

- [GATE 2021 Set 2 Q.25](#/q/es_40599uckwrzvl1p): an LMVT bound on $f(3)$.
- [GATE 2014 Set 1 Q.6](#/q/es_LyHAmLeCXDo0Pz7G): Rolle's theorem on a determinant.
- [GATE 1995 Q.1.21](#/q/go_v1_5.6.2): exactly one solution, because the slope never vanishes.
- [GATE IT 2007 Q.76](#/q/go_v1_1.7.7): the attracting solution of $L=g(L)$.

## Maxima and minima {#maxima-minima}

*Find where a function rises and falls, locate and classify its turning points, and find its largest and smallest values on an interval, without forgetting corners and endpoints.*

### The idea

Walk along a graph from left to right like a mountain path. Where the path climbs, the slope is positive. Where it descends, the slope is negative. At the top of a hill or the bottom of a valley, the path is flat for an instant, or it has a sharp point.

- $f$ has a **local maximum** at $c$ if $f(c)$ is the largest value of $f$ near $c$: a hilltop.
- $f$ has a **local minimum** at $c$ if $f(c)$ is the smallest value near $c$: a valley floor.
- The **global** (or absolute) maximum and minimum are the largest and smallest values over the whole interval.
- Local maxima and minima together are called **extrema** (one of them is an **extremum**).

A local maximum need not be the global one: a small hill can stand next to a mountain.

### Rising and falling

By the mean value theorem, the sign of $f'$ tells you the direction:

> **Remember:** if $f'>0$ on an interval, $f$ is **increasing** there. If $f'<0$, $f$ is **decreasing**.

$f'$ may touch $0$ at a single point without spoiling this. $x^3$ is increasing everywhere, even though its slope is $0$ at $x=0$.

**Example.** Which of $e^{-x}$, $x^2-\sin x$ and $\sqrt{x^3+1}$ are increasing on all of $[0,1]$?

- $e^{-x}$ has slope $-e^{-x}<0$. It is decreasing.
- $x^2-\sin x$ has slope $2x-\cos x$, which is $-1$ at $x=0$. It falls at first, so it is not increasing on all of $[0,1]$.
- $\sqrt{x^3+1}$ has slope $\dfrac{3x^2}{2\sqrt{x^3+1}}$, which is positive except at the single point $x=0$. It is increasing.

So only the third one qualifies. This was [GATE 2020](#/q/es_gjnaKmLcvEwPJs33cG1da9i2ynkclm0vw4).

### Critical points

Inside an interval, an extremum can only happen at a **critical point**: a point where $f'(c)=0$ (a **stationary point**, with a flat tangent) or where $f'(c)$ does not exist (such as the corner of $|x|$).

Why: if $f'(c)>0$, the function is still climbing as it passes $c$, so $c$ cannot be a top or a bottom. The same goes for $f'(c)<0$.

But a critical point need not be an extremum. $x^3$ is flat at $0$ and keeps rising straight through. The curve switches there from bending like a cap to bending like a cup. A point where the bending switches is an **inflection point**.

### Three tests for a critical point

**1. The first-derivative test.** Look at the sign of $f'$ just left and just right of $c$:

- $+$ then $-$: local maximum (climb, then descend).
- $-$ then $+$: local minimum.
- the same sign on both sides: no extremum.

This also works at corners: for $|x|$ at $0$ the sign goes $-$ then $+$, a minimum.

**2. The second-derivative test.** $f''$ tells you how the slope itself is changing. If $f''(c)>0$, the slope is increasing, so the curve bends up like a cup, and a flat point there is a valley. If $f''(c)<0$, it bends like a cap, and a flat point is a hilltop.

> **Remember:** at a stationary point, $f''(c)>0$ means local minimum, $f''(c)<0$ means local maximum, and $f''(c)=0$ means the test says nothing.

**Example.** $f(x)=x^3-6x^2+9x+15$.

1. $f'(x)=3x^2-12x+9=3(x-1)(x-3)$, so the stationary points are $x=1$ and $x=3$.
2. $f''(x)=6x-12$. $f''(1)=-6<0$: local maximum, $f(1)=19$. $f''(3)=6>0$: local minimum, $f(3)=15$.
3. The first-derivative test agrees: $f'$ is $+$ before $1$, $-$ between $1$ and $3$, and $+$ after $3$.

**3. The higher-derivative test.** When $f''(c)=0$ too, keep differentiating until some derivative at $c$ is not zero. Say the first non-zero one is $f^{(n)}(c)$.

- If $n$ is even, there is an extremum: a minimum if $f^{(n)}(c)>0$, a maximum if $f^{(n)}(c)<0$.
- If $n$ is odd, there is no extremum: it is an inflection point.

Why: near $c$, the Taylor series says $f(x)-f(c)$ behaves like $\dfrac{f^{(n)}(c)}{n!}(x-c)^n$. An even power keeps one sign on both sides of $c$; an odd power flips sign. For example, $x^4$ at $0$: the first non-zero derivative is $f''''(0)=24>0$ with $n=4$, so a minimum. For $x^3$ it is $f'''(0)=6$ with $n=3$: no extremum.

### Largest and smallest values on a closed interval

By the extreme value theorem, a continuous $f$ on $[a,b]$ has a global maximum and a global minimum. They can only be at:

1. stationary points inside the interval,
2. corners or other points inside where $f'$ does not exist,
3. the two endpoints $a$ and $b$.

So list every candidate, work out $f$ at each, and pick the largest and the smallest. No test is needed.

<figure class="fig"><svg viewBox="0 0 330 186" role="img" aria-label="A cubic on the interval from a to b: a local maximum at x equals 1, a local and global minimum at x equals 3, and the global maximum at the right end b">
<line x1="14.0" y1="154.4" x2="314.0" y2="154.4" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M33.6 82.4 L37.8 77.6 L42.0 73.3 L46.3 69.6 L50.5 66.5 L54.8 63.8 L59.0 61.6 L63.2 59.9 L67.5 58.7 L71.7 57.8 L76.0 57.3 L80.2 57.2 L84.4 57.5 L88.7 58.1 L92.9 58.9 L97.2 60.1 L101.4 61.5 L105.6 63.1 L109.9 65.0 L114.1 67.0 L118.3 69.2 L122.6 71.6 L126.8 74.0 L131.1 76.6 L135.3 79.2 L139.5 81.9 L143.8 84.6 L148.0 87.3 L152.3 90.0 L156.5 92.6 L160.7 95.2 L165.0 97.7 L169.2 100.1 L173.5 102.3 L177.7 104.4 L181.9 106.3 L186.2 108.0 L190.4 109.5 L194.7 110.7 L198.9 111.7 L203.1 112.4 L207.4 112.7 L211.6 112.7 L215.8 112.4 L220.1 111.7 L224.3 110.5 L228.6 108.9 L232.8 106.9 L237.0 104.4 L241.3 101.4 L245.5 97.9 L249.8 93.8 L254.0 89.1 L258.2 83.9 L262.5 78.1 L266.7 71.6 L271.0 64.4 L275.2 56.6 L279.4 48.1 L283.7 38.8 L287.9 28.8" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
<line x1="33.6" y1="82.4" x2="33.6" y2="154.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="2 3"/>
<text x="33.6" y="168.4" font-size="12" fill="currentColor" text-anchor="middle">a</text>
<circle cx="33.6" cy="82.4" r="3.2" fill="var(--accent)"/>
<line x1="79.2" y1="57.2" x2="79.2" y2="154.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="2 3"/>
<text x="79.2" y="168.4" font-size="12" fill="currentColor" text-anchor="middle">1</text>
<circle cx="79.2" cy="57.2" r="3.2" fill="var(--accent)"/>
<line x1="209.7" y1="112.8" x2="209.7" y2="154.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="2 3"/>
<text x="209.7" y="168.4" font-size="12" fill="currentColor" text-anchor="middle">3</text>
<circle cx="209.7" cy="112.8" r="3.2" fill="var(--accent)"/>
<line x1="287.9" y1="28.8" x2="287.9" y2="154.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="2 3"/>
<text x="287.9" y="168.4" font-size="12" fill="currentColor" text-anchor="middle">b</text>
<circle cx="287.9" cy="28.8" r="3.2" fill="var(--accent)"/>
<text x="79.2" y="48.2" font-size="11" fill="currentColor" text-anchor="middle">local max</text>
<text x="209.7" y="130.8" font-size="11" fill="currentColor" text-anchor="middle">local and global min</text>
<text x="281.9" y="20.8" font-size="11" fill="currentColor" text-anchor="end">global max at the end</text>
<text x="39.6" y="98.4" font-size="11" fill="currentColor" text-anchor="start">end</text>
</svg><figcaption>On $[a,b]$ the highest point is at the end $b$, not at the local maximum. Always check the ends.</figcaption></figure>

**Example.** Largest value of $f(x)=2x^2-2x+6$ on $[0,2]$.

1. $f'(x)=4x-2=0$ at $x=\frac12$.
2. Candidates: $f(0)=6$, $f(\frac12)=\frac12-1+6=5.5$, $f(2)=8-4+6=10$.
3. The largest is $10$, at the endpoint $x=2$. (The stationary point is the minimum.)

**Example with a corner.** $f(x)=1-|x|$ on $[-1,1]$ has no stationary point. The corner gives $f(0)=1$, and the ends give $f(\pm1)=0$. So the maximum is $1$, at $x=0$.

**Quadratics.** $ax^2+bx+c$ turns at $x=-\dfrac{b}{2a}$: a minimum if $a>0$, a maximum if $a<0$. For $2x^2-4x+3$, the turn is at $x=1$, and the minimum value is $2-4+3=1$.

> **Watch out:** on a closed interval, an endpoint can be a local extremum. If $f$ rises as you move inwards from an end, that end is a local minimum. If $f$ falls as you move inwards, it is a local maximum. On an open interval like $(0,1)$, the ends are not included, so a largest or smallest value may never be reached: $x$ on $(0,1)$ has neither.

### Word problems

1. Name the quantity to make largest or smallest.
2. Use the given condition to write it as a function of one variable, and note the allowed range.
3. Find the critical points in that range, then compare with the ends.

**Example (an open box).** Cut a square of side $x$ from each corner of a $12\times12$ sheet and fold up the sides. Which $x$ gives the largest volume?

1. The base is $(12-2x)$ by $(12-2x)$ and the height is $x$, so $V(x)=x(12-2x)^2$ for $0<x<6$.
2. Product rule: $V'(x)=(12-2x)^2+x\cdot2(12-2x)(-2)=(12-2x)(12-6x)$.
3. $V'=0$ at $x=6$ (no box at all) or $x=2$.
4. $V(2)=2\times8^2=128$, while $V$ shrinks to $0$ at both ends. The largest volume is $128$, at $x=2$.

**Example (a number plus its reciprocal).** For $x>0$, find the smallest value of $x+\dfrac1x$. The slope is $1-\dfrac{1}{x^2}=0$ at $x=1$, and $f''(x)=\dfrac{2}{x^3}>0$ there, so it is a minimum: $1+1=2$. So $x+\dfrac1x\ge2$ for every positive $x$.

### Two variables: the rt − s² test

For $f(x,y)$, a **stationary point** is where both partial derivatives vanish: $f_x=0$ and $f_y=0$. To classify it, work out three numbers there: $r=f_{xx}$, $s=f_{xy}$ and $t=f_{yy}$.

> **Remember:** $rt-s^2>0$ and $r>0$: local minimum. $rt-s^2>0$ and $r<0$: local maximum. $rt-s^2<0$: a **saddle point**, which rises in one direction and falls in another, like a horse's saddle. $rt-s^2=0$: no conclusion.

**Example.** $f=x^2+y^2-2x+4y$. Then $f_x=2x-2$ and $f_y=2y+4$, which vanish at $(1,-2)$. There $r=2$, $s=0$, $t=2$, so $rt-s^2=4>0$ with $r>0$: a minimum, of value $1+4-2-8=-5$.

### How GATE asks this

- The largest or smallest value of a quadratic, or of a function on a closed interval (1995, 1997, 2015).
- Locate and classify the local extrema of a cubic or a quartic (1998, 2008, 2023).
- Endpoints and pieces: local minima on a closed interval, or the minimum of a piecewise function (2012, IT 2008).
- Which functions are increasing on an interval (2020).
- Stationary points of a function of two variables (2002).

**[GATE 2008 Q.25](#/q/es_NTEZ1vka5rdilQHv).** How many distinct extrema does $3x^4-16x^3+24x^2+37$ have? Options: (A) $0$, (B) $1$, (C) $2$, (D) $3$.

1. $f'(x)=12x^3-48x^2+48x=12x(x^2-4x+4)=12x(x-2)^2$.
2. The critical points are $x=0$ and $x=2$.
3. Signs of $f'$: negative for $x<0$, positive on $(0,2)$, positive for $x>2$, because $(x-2)^2$ is never negative.
4. At $0$ the sign goes $-$ to $+$: a local minimum. At $2$ it stays $+$: not an extremum (it is an inflection point).
5. **Answer: (B).** Counting both critical points gives the trap answer (C).

**[GATE 2012 Q.9](#/q/es_WhzBtTDlzh4PsO5Y).** $f(x)=\sin x$ on $[\frac{\pi}{4},\frac{7\pi}{4}]$. How many local minima, and where? (A) one, at $\frac{\pi}{2}$; (B) one, at $\frac{3\pi}{2}$; (C) two, at $\frac{\pi}{2}$ and $\frac{3\pi}{2}$; (D) two, at $\frac{\pi}{4}$ and $\frac{3\pi}{2}$.

1. Inside: $f'(x)=\cos x=0$ at $\frac{\pi}{2}$ and $\frac{3\pi}{2}$. Since $f''=-\sin x$, $f''(\frac{\pi}{2})=-1$ (a maximum) and $f''(\frac{3\pi}{2})=1$ (a minimum).
2. Left end, $\frac{\pi}{4}$: here $f'=\cos\frac{\pi}{4}>0$, so $f$ rises as you move inwards. That end is a local minimum.
3. Right end, $\frac{7\pi}{4}$: here $f'=\cos\frac{7\pi}{4}>0$, so $f$ rises into this end. It is a local maximum.
4. Two local minima, at $\frac{\pi}{4}$ and $\frac{3\pi}{2}$. **Answer: (D).**

### Quick check

**1.** Where is $f(x)=x^3-3x$ increasing?

<details><summary>Show answer</summary>

$f'(x)=3x^2-3=3(x-1)(x+1)$. This is positive when $x<-1$ or $x>1$, so $f$ is increasing there (and decreasing on $(-1,1)$).

</details>

**2.** Classify the stationary points of $x^3-3x$.

<details><summary>Show answer</summary>

$f''(x)=6x$. At $x=-1$, $f''=-6<0$: a local maximum, $f(-1)=2$. At $x=1$, $f''=6>0$: a local minimum, $f(1)=-2$.

</details>

**3.** Find the largest and smallest values of $x^3-3x$ on $[0,3]$.

<details><summary>Show answer</summary>

Candidates: the stationary point $x=1$ inside, with $f(1)=-2$, and the ends, $f(0)=0$ and $f(3)=27-9=18$. Largest $18$ (at the end $x=3$), smallest $-2$ (at $x=1$).

</details>

**4.** Does $x^5$ have an extremum at $0$?

<details><summary>Show answer</summary>

No. The first four derivatives are $0$ at $0$, and the fifth is $120\ne0$. The order $5$ is odd, so it is an inflection point, not an extremum.

</details>

**5.** ([GATE IT 2008](#/q/es_QwdYP5x9buOsJ3tI)) $f(x)=\dfrac{25}{8x}$ for $x\le\dfrac32$ and $f(x)=x+\dfrac1x$ otherwise. Find the smallest value of $f$ on $(0,2]$.

<details><summary>Show answer</summary>

On $(0,\frac32]$, $\dfrac{25}{8x}$ falls as $x$ grows, so its smallest value is at $x=\frac32$: $\dfrac{25}{12}=2\tfrac{1}{12}$. On $(\frac32,2]$, $x+\dfrac1x$ has slope $1-\dfrac{1}{x^2}>0$, so it rises from just above $\frac32+\frac23=2\tfrac16$. The answer is $2\tfrac{1}{12}$. (The tempting $2$ is the minimum of $x+\frac1x$ at $x=1$, but $x=1$ belongs to the first piece.)

</details>

### Practice from GATE

- [GATE 1995 Q.25a](#/q/go_v1_5.6.3): the minimum of a quadratic.
- [GATE 1997 Q.4.1](#/q/es_sp2lz0aPDXhiuzP5): the maximum on a closed interval sits at an end.
- [GATE 2015 Set 2 GA Q.3](#/q/go_v1_5.6.7): the maximum of $1-|x|$ is at a corner.
- [GATE 1998 Q.8](#/q/es_UCRZ3EEGVr0c4Bn0): local maximum and minimum of a cubic. The same cubic appears in [GATE 1998](#/q/es_NiU98AZ6RGZv8vj7), which adds $\int_{-\pi}^{\pi}x\cos x\,dx$ (odd, so $0$).
- [GATE 2023 Q.18](#/q/es_1lff3eaji): does a cubic have a local maximum and a local minimum?
- [GATE 2020 Q.1](#/q/es_gjnaKmLcvEwPJs33cG1da9i2ynkclm0vw4): which functions are increasing on $[0,1]$.
- [GATE IT 2008 Q.31](#/q/es_QwdYP5x9buOsJ3tI): the minimum of a piecewise function.
- [GATE 2002](#/q/es_s3VHLX0XwGvz5YDb): the stationary points of $2x^2+2xy-y^3$.

## Integration techniques {#integration}

*Undo differentiation with the standard integrals, substitution, integration by parts and partial fractions, and handle the trig integrals GATE likes.*

### The idea

Integration runs differentiation backwards. If $F'(x)=f(x)$, then $F$ is called an **antiderivative** of $f$, and you write

$$\int f(x)\,dx=F(x)+C.$$

The $dx$ says that $x$ is the variable, and $f$ is called the **integrand**. The $+C$ is there because constants vanish when you differentiate: $x^2+5$ and $x^2-3$ both have derivative $2x$. So every antiderivative is $F(x)$ plus some constant $C$.

> **Idea:** you can always check an integral by differentiating your answer. You should get the integrand back.

Integrals split over sums and let constants out: $\int(f+g)\,dx=\int f\,dx+\int g\,dx$ and $\int cf\,dx=c\int f\,dx$. There is no such simple rule for products: $\int fg\,dx$ is not $\int f\,dx\cdot\int g\,dx$. Products need the methods below.

### The standard integrals

Each row is a row of the derivative table read backwards ($+C$ left out):

| $f(x)$ | $\int f\,dx$ | $f(x)$ | $\int f\,dx$ |
|---|---|---|---|
| $x^n$ ($n\ne-1$) | $\dfrac{x^{n+1}}{n+1}$ | $\sin x$ | $-\cos x$ |
| $\dfrac1x$ | $\ln\lvert x\rvert$ | $\cos x$ | $\sin x$ |
| $e^{ax}$ | $\dfrac{e^{ax}}{a}$ | $\sec^2x$ | $\tan x$ |
| $a^x$ | $\dfrac{a^x}{\ln a}$ | $\tan x$ | $\ln\lvert\sec x\rvert$ |
| $\ln x$ | $x\ln x-x$ | $\dfrac{1}{a^2+x^2}$ | $\dfrac1a\tan^{-1}\dfrac xa$ |
| $\dfrac{1}{\sqrt{a^2-x^2}}$ | $\sin^{-1}\dfrac xa$ | $\dfrac{1}{x^2-a^2}$ | $\dfrac{1}{2a}\ln\left\lvert\dfrac{x-a}{x+a}\right\rvert$ |

Why $\ln|x|$ and not $\ln x$: for negative $x$, $\ln(-x)$ is defined, and its derivative is $\dfrac{-1}{-x}=\dfrac1x$ too. The rows for $\tan x$, $\ln x$ and $\dfrac{1}{x^2-a^2}$ come from the methods below.

### Putting in limits

A **definite integral** $\int_a^b f(x)\,dx$ is a number. Find any antiderivative $F$, then work out $F(b)-F(a)$, written $\big[F(x)\big]_a^b$. The $+C$ cancels, so you can drop it. The definite integrals lesson explains why this number measures area.

**Example.** $\displaystyle\int_0^2x^2\,dx=\Big[\frac{x^3}{3}\Big]_0^2=\frac83-0=\frac83$.

Swapping the limits flips the sign: $\int_b^a f\,dx=-\int_a^b f\,dx$, because $F(a)-F(b)=-\big(F(b)-F(a)\big)$.

### Substitution

Look for a function sitting inside another, with the inside's derivative also present as a factor. Call the inside $u$. Then $du=u'(x)\,dx$, and the integral becomes a simpler one in $u$:

$$\int f(g(x))\,g'(x)\,dx=\int f(u)\,du,\qquad u=g(x).$$

This is the chain rule run backwards.

**Example 1.** $\int 2x\cos(x^2)\,dx$. Put $u=x^2$, so $du=2x\,dx$. The integral becomes $\int\cos u\,du=\sin u=\sin(x^2)+C$.

**Example 2.** $\int\tan x\,dx=\int\dfrac{\sin x}{\cos x}\,dx$. Put $u=\cos x$, so $du=-\sin x\,dx$. The integral becomes $-\int\dfrac{du}{u}=-\ln|\cos x|=\ln|\sec x|+C$.

Two patterns worth memorising: $\int\dfrac{f'(x)}{f(x)}\,dx=\ln|f(x)|+C$, and for a straight-line inside, $\int f(ax+b)\,dx=\dfrac1aF(ax+b)+C$, such as $\int\cos3x\,dx=\dfrac{\sin3x}{3}+C$.

**With limits, change the limits too**, and never go back to $x$.

**Example 3 ([GATE 2018](#/q/es_yGSuvAzcT8unvtUU)).** $\int_0^{\pi/4}x\cos(x^2)\,dx$, with $\pi=3.14$.

1. Put $u=x^2$, so $du=2x\,dx$ and $x\,dx=\dfrac{du}{2}$.
2. New limits: $x=0$ gives $u=0$; $x=\frac{\pi}{4}$ gives $u=\frac{\pi^2}{16}$.
3. The integral is $\dfrac12\displaystyle\int_0^{\pi^2/16}\cos u\,du=\dfrac12\sin\dfrac{\pi^2}{16}$.
4. With $\pi=3.14$: $\dfrac{\pi^2}{16}=0.616225$ (radians), $\sin0.616225\approx0.57796$, so the answer is about $0.289$.

### Integration by parts

Start from the product rule, $(uv)'=u'v+uv'$. Integrate both sides and rearrange:

$$\int u\,dv=uv-\int v\,du.$$

Use it for a product where one factor, $u$, gets simpler when differentiated, and the other, $dv$, is easy to integrate.

> **Remember:** choose $u$ by **ILATE**: whichever factor comes first in the list **I**nverse trig ($\tan^{-1}x$), **L**og ($\ln x$), **A**lgebraic ($x^2$, $x$), **T**rig ($\sin x$), **E**xponential ($e^x$). The other factor is $dv$.

**Example 1.** $\int x\cos x\,dx$. Algebraic comes before trig, so $u=x$ and $dv=\cos x\,dx$, giving $du=dx$ and $v=\sin x$:

$$\int x\cos x\,dx=x\sin x-\int\sin x\,dx=x\sin x+\cos x+C.$$

**Example 2.** $\int\ln x\,dx$. Take $u=\ln x$ and $dv=dx$, so $du=\dfrac{dx}{x}$ and $v=x$:

$$\int\ln x\,dx=x\ln x-\int x\cdot\frac1x\,dx=x\ln x-x+C.$$

**Example 3: parts twice, by the table method.** For $\int x^2\cos x\,dx$, differentiate $x^2$ down to $0$ in one column and integrate $\cos x$ in the other. Multiply each left entry by the right entry one row below, with signs $+,-,+,\dots$:

| sign | differentiate | integrate |
|---|---|---|
| $+$ | $x^2$ | $\cos x$ |
| $-$ | $2x$ | $\sin x$ |
| $+$ | $2$ | $-\cos x$ |
| | $0$ | $-\sin x$ |

$$\int x^2\cos x\,dx=x^2\sin x-2x(-\cos x)+2(-\sin x)=x^2\sin x+2x\cos x-2\sin x+C.$$

### Partial fractions

To integrate a fraction whose bottom splits into different straight-line factors, break it into simpler fractions first:

$$\frac{1}{(x-1)(x-2)}=\frac{A}{x-1}+\frac{B}{x-2}.$$

**The cover-up trick.** To find $A$, cover the factor $(x-1)$ in the original fraction and put $x=1$ into what is left: $A=\dfrac{1}{1-2}=-1$. For $B$, cover $(x-2)$ and put $x=2$: $B=\dfrac{1}{2-1}=1$. So

$$\int\frac{dx}{(x-1)(x-2)}=-\ln|x-1|+\ln|x-2|+C=\ln\left|\frac{x-2}{x-1}\right|+C.$$

Check: $-\dfrac{1}{x-1}+\dfrac{1}{x-2}=\dfrac{-(x-2)+(x-1)}{(x-1)(x-2)}=\dfrac{1}{(x-1)(x-2)}$. The table's $\dfrac{1}{x^2-a^2}$ row comes from the same split: $\dfrac{1}{(x-a)(x+a)}=\dfrac{1}{2a}\Big(\dfrac{1}{x-a}-\dfrac{1}{x+a}\Big)$.

### Trig integrals

You need the double-angle formulas $\sin2x=2\sin x\cos x$ and $\cos2x=\cos^2x-\sin^2x$, along with $\sin^2x+\cos^2x=1$.

1. **Squares: lower the power.** $\sin^2x=\dfrac{1-\cos2x}{2}$ and $\cos^2x=\dfrac{1+\cos2x}{2}$. So $\int\cos^2x\,dx=\dfrac x2+\dfrac{\sin2x}{4}+C$, and $\int_0^{\pi/4}\cos^2x\,dx=\dfrac{\pi}{8}+\dfrac14$ ([GATE 2001](#/q/es_Wq4bvmwOGBzGdJis)).
2. **Other squares and products.** $\tan^2x=\sec^2x-1$ gives $\int\tan^2x\,dx=\tan x-x+C$, and $\sin x\cos x=\dfrac{\sin2x}{2}$.
3. **Odd powers: peel off one factor.** $\int\sin^3x\,dx=\int(1-\cos^2x)\sin x\,dx$. Put $u=\cos x$ to get $-\cos x+\dfrac{\cos^3x}{3}+C$.
4. **Spot an identity.** $\dfrac{1-\tan x}{1+\tan x}=\tan\Big(\dfrac{\pi}{4}-x\Big)$, from $\tan(A-B)=\dfrac{\tan A-\tan B}{1+\tan A\tan B}$ with $\tan\frac{\pi}{4}=1$.
5. **Complex numbers.** For $\dfrac{\cos x+i\sin x}{\cos x-i\sin x}$, multiply the top and the bottom by $\cos x+i\sin x$. The bottom becomes $\cos^2x+\sin^2x=1$, because $(p-iq)(p+iq)=p^2+q^2$. The top becomes $(\cos x+i\sin x)^2=\cos2x+i\sin2x$. So
$$\int_0^{\pi/2}\frac{\cos x+i\sin x}{\cos x-i\sin x}\,dx=\int_0^{\pi/2}\cos2x\,dx+i\int_0^{\pi/2}\sin2x\,dx=0+i\cdot1=i.$$
(Euler's formula $\cos x+i\sin x=e^{ix}$ gets there faster: the fraction is $\dfrac{e^{ix}}{e^{-ix}}=e^{2ix}$.)

### How GATE asks this

- Substitution, usually with limits to change (2015, 2018).
- Integration by parts, sometimes twice (2014, 2025).
- Lower a trig power (2001), spot an identity (2009), or simplify a complex fraction (2011).
- Work out $f$ from an equation it satisfies, then integrate (2015).

**[GATE 2015 Set 1 Q.44](#/q/es_EeQT6CfCKOAZkfzg).** Find $\displaystyle\int_{1/\pi}^{2/\pi}\frac{\cos(1/x)}{x^2}\,dx$.

1. The inside function is $\dfrac1x$, and its derivative $-\dfrac{1}{x^2}$ is present apart from the sign. Put $u=\dfrac1x$, so $du=-\dfrac{dx}{x^2}$.
2. New limits: $x=\frac1\pi$ gives $u=\pi$; $x=\frac2\pi$ gives $u=\frac\pi2$.
3. The integral becomes $\displaystyle\int_{\pi}^{\pi/2}\cos u\,(-du)=\int_{\pi/2}^{\pi}\cos u\,du=\big[\sin u\big]_{\pi/2}^{\pi}=0-1=-1$.
4. Sign check: here $\frac1x$ lies between $\frac\pi2$ and $\pi$, where $\cos$ is negative, so a negative answer makes sense. **Answer: $-1$.**

**[GATE 2025 Set 2 Q.2](#/q/es_m80a3jvp).** Find $x>1$ with $\displaystyle\int_1^x t\ln t\,dt=\frac14$. Options: (A) $\sqrt e$, (B) $e$, (C) $e^2$, (D) $e-1$.

1. ILATE puts log before algebraic, so $u=\ln t$ and $dv=t\,dt$. Then $du=\dfrac{dt}{t}$ and $v=\dfrac{t^2}{2}$.
2. $\displaystyle\int t\ln t\,dt=\frac{t^2}{2}\ln t-\int\frac{t^2}{2}\cdot\frac1t\,dt=\frac{t^2}{2}\ln t-\frac{t^2}{4}$.
3. From $1$ to $x$: $\Big(\dfrac{x^2}{2}\ln x-\dfrac{x^2}{4}\Big)-\Big(0-\dfrac14\Big)=\dfrac{x^2}{2}\ln x-\dfrac{x^2}{4}+\dfrac14$.
4. Setting this equal to $\dfrac14$ gives $\dfrac{x^2}{2}\ln x=\dfrac{x^2}{4}$, so $\ln x=\dfrac12$ and $x=\sqrt e$. **Answer: (A).**

### Quick check

**1.** Find $\int\Big(3x^2+\dfrac2x\Big)dx$.

<details><summary>Show answer</summary>

$x^3+2\ln|x|+C$. Check: the derivative is $3x^2+\dfrac2x$.

</details>

**2.** Find $\int xe^{x^2}\,dx$.

<details><summary>Show answer</summary>

Put $u=x^2$, so $x\,dx=\dfrac{du}{2}$. The integral is $\dfrac12\int e^u\,du=\dfrac{e^{x^2}}{2}+C$.

</details>

**3.** Find $\int xe^x\,dx$.

<details><summary>Show answer</summary>

By parts with $u=x$ and $dv=e^x\,dx$: $xe^x-\int e^x\,dx=xe^x-e^x+C$.

</details>

**4.** Find $\int_0^{\pi/2}\sin^2x\,dx$.

<details><summary>Show answer</summary>

$\sin^2x=\dfrac{1-\cos2x}{2}$, so the integral is $\Big[\dfrac x2-\dfrac{\sin2x}{4}\Big]_0^{\pi/2}=\dfrac{\pi}{4}-0=\dfrac{\pi}{4}$.

</details>

**5.** ([GATE 2015](#/q/es_xKHknMGR6T2sARiw)) For $x\ne0$, $af(x)+bf\big(\tfrac1x\big)=\dfrac1x-25$, where $a^2\ne b^2$. Find $\int_1^2f(x)\,dx$.

<details><summary>Show answer</summary>

Replace $x$ by $\frac1x$ to get a second equation: $af\big(\tfrac1x\big)+bf(x)=x-25$. Multiply the first equation by $a$ and the second by $b$, then subtract, so the $f\big(\tfrac1x\big)$ terms cancel: $(a^2-b^2)f(x)=\dfrac ax-25a-bx+25b$. Integrate from $1$ to $2$: $a\ln2-25a-\dfrac32b+25b$, and $-\dfrac32b+25b=\dfrac{47b}{2}$. So $\int_1^2f(x)\,dx=\dfrac{1}{a^2-b^2}\Big[a(\ln2-25)+\dfrac{47b}{2}\Big]$.

</details>

### Practice from GATE

- [GATE 2001](#/q/es_Wq4bvmwOGBzGdJis): $\int_0^{\pi/4}\cos^2x\,dx$ by lowering the power.
- [GATE 2018 Q.16](#/q/es_yGSuvAzcT8unvtUU): substitution $u=x^2$, then a calculator step.
- [GATE 2015 Set 1 Q.44](#/q/es_EeQT6CfCKOAZkfzg): substitution $u=\frac1x$ with new limits.
- [GATE 2025 Set 2 Q.2](#/q/es_m80a3jvp): integration by parts with a log.
- [GATE 2014 Set 3 Q.47](#/q/es_hps6kMlKUQ62jaMe): $\int_0^\pi x^2\cos x\,dx$, parts twice.
- [GATE 2009 Q.25](#/q/es_FanAbqJSQTa3dk8n): spot $\tan\big(\frac\pi4-x\big)$.
- [GATE 2011 Q.31](#/q/es_OwQCSMbD6ymaifOq): a complex integrand that simplifies to $\cos2x+i\sin2x$.
- [GATE 2015 Set 3 Q.45](#/q/es_xKHknMGR6T2sARiw): solve for $f$ first, then integrate.

## Definite integrals {#definite-integrals}

*Read a definite integral as an area, collapse hard integrals with symmetry and splitting, and handle Wallis' formula, areas between curves, improper integrals, the gamma shortcut and double integrals.*

### The idea

$\int_a^b f(x)\,dx$ is the area between the graph of $f$ and the $x$-axis, from $x=a$ to $x=b$. Area below the axis counts as negative, so it is really a **signed area**.

To measure it, slice the region into thin vertical strips. Each strip is nearly a rectangle of height $f(x)$ and width $\Delta x$ (a small step in $x$), so the area is about $\sum f(x)\,\Delta x$. As the strips get thinner, this sum closes in on the exact area. The sign $\int$ is a stretched S, for "sum".

<figure class="fig"><svg viewBox="0 0 314 182" role="img" aria-label="An increasing curve over 0 to 5 with the area under it shaded, and five unit-width rectangles whose heights are taken at the right end of each strip, so each rectangle pokes above the curve">
<path d="M26.7 147.5 L26.7 126.6 L31.7 126.6 L36.6 126.4 L41.5 126.2 L46.4 125.9 L51.3 125.6 L56.2 125.1 L61.2 124.6 L66.1 123.9 L71.0 123.2 L75.9 122.4 L80.8 121.5 L85.7 120.6 L90.6 119.5 L95.6 118.4 L100.5 117.2 L105.4 115.9 L110.3 114.5 L115.2 113.0 L120.1 111.5 L125.1 109.9 L130.0 108.1 L134.9 106.3 L139.8 104.5 L144.7 102.5 L149.6 100.4 L154.5 98.3 L159.5 96.1 L164.4 93.8 L169.3 91.4 L174.2 88.9 L179.1 86.4 L184.0 83.7 L188.9 81.0 L193.9 78.2 L198.8 75.3 L203.7 72.4 L208.6 69.3 L213.5 66.2 L218.4 62.9 L223.4 59.6 L228.3 56.2 L233.2 52.8 L238.1 49.2 L243.0 45.6 L247.9 41.8 L252.8 38.0 L257.8 34.1 L262.7 30.2 L267.6 26.1 L272.5 22.0 L272.5 147.5 Z" fill="var(--accent)" fill-opacity="0.22" stroke="none"/>
<rect x="26.7" y="122.4" width="49.2" height="25.1" fill="none" stroke="currentColor" stroke-width="1.2"/>
<rect x="75.9" y="109.9" width="49.2" height="37.7" fill="none" stroke="currentColor" stroke-width="1.2"/>
<rect x="125.1" y="88.9" width="49.2" height="58.6" fill="none" stroke="currentColor" stroke-width="1.2"/>
<rect x="174.2" y="59.6" width="49.2" height="87.9" fill="none" stroke="currentColor" stroke-width="1.2"/>
<rect x="223.4" y="22.0" width="49.2" height="125.6" fill="none" stroke="currentColor" stroke-width="1.2"/>
<path d="M26.7 126.6 L31.7 126.6 L36.6 126.4 L41.5 126.2 L46.4 125.9 L51.3 125.6 L56.2 125.1 L61.2 124.6 L66.1 123.9 L71.0 123.2 L75.9 122.4 L80.8 121.5 L85.7 120.6 L90.6 119.5 L95.6 118.4 L100.5 117.2 L105.4 115.9 L110.3 114.5 L115.2 113.0 L120.1 111.5 L125.1 109.9 L130.0 108.1 L134.9 106.3 L139.8 104.5 L144.7 102.5 L149.6 100.4 L154.5 98.3 L159.5 96.1 L164.4 93.8 L169.3 91.4 L174.2 88.9 L179.1 86.4 L184.0 83.7 L188.9 81.0 L193.9 78.2 L198.8 75.3 L203.7 72.4 L208.6 69.3 L213.5 66.2 L218.4 62.9 L223.4 59.6 L228.3 56.2 L233.2 52.8 L238.1 49.2 L243.0 45.6 L247.9 41.8 L252.8 38.0 L257.8 34.1 L262.7 30.2 L267.6 26.1 L272.5 22.0" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
<line x1="12.0" y1="147.5" x2="302.0" y2="147.5" stroke="currentColor" stroke-opacity="0.5"/>
<text x="26.7" y="161.5" font-size="11" fill="currentColor" text-anchor="middle">0</text>
<text x="75.9" y="161.5" font-size="11" fill="currentColor" text-anchor="middle">1</text>
<text x="125.1" y="161.5" font-size="11" fill="currentColor" text-anchor="middle">2</text>
<text x="174.2" y="161.5" font-size="11" fill="currentColor" text-anchor="middle">3</text>
<text x="223.4" y="161.5" font-size="11" fill="currentColor" text-anchor="middle">4</text>
<text x="272.5" y="161.5" font-size="11" fill="currentColor" text-anchor="middle">5</text>
<text x="85.7" y="28.9" font-size="11" fill="currentColor" text-anchor="middle">strips: tops at right ends</text>
</svg><figcaption>The shaded area is $\int_0^5 f(x)\,dx$. Unit strips with heights taken at their right ends add up to $f(1)+f(2)+\cdots+f(5)$, which overshoots because $f$ is increasing.</figcaption></figure>

**Why putting in the limits gives the area.** Let $A(x)$ be the area from $a$ up to $x$. The Leibniz rule showed that $A'(x)=f(x)$, because pushing $x$ along adds a strip of height $f(x)$. So $A$ is an antiderivative of $f$, and for any antiderivative $F$,

$$\int_a^b f(x)\,dx=F(b)-F(a).$$

This is the **fundamental theorem of calculus**: areas are found by undoing derivatives. For example, one arch of the sine wave has area $\int_0^\pi\sin x\,dx=\big[-\cos x\big]_0^\pi=1+1=2$. But $\int_0^{2\pi}\sin x\,dx=0$, because the second arch lies below the axis and cancels the first.

**Sums versus integrals.** For an increasing $f$, the strips in the picture overshoot, so $f(1)+f(2)+\cdots+f(5)>\int_0^5f(x)\,dx$. Strips with heights taken at their left ends undershoot instead.

### The basic properties

1. $\int_a^af\,dx=0$, and swapping the limits flips the sign: $\int_b^af\,dx=-\int_a^bf\,dx$.
2. You can split at any point $c$: $\int_a^bf\,dx=\int_a^cf\,dx+\int_c^bf\,dx$.
3. Sums split and constants come out: $\int_a^b(f+g)\,dx=\int_a^bf\,dx+\int_a^bg\,dx$ and $\int_a^bcf\,dx=c\int_a^bf\,dx$.
4. The letter used does not matter: $\int_a^bf(x)\,dx=\int_a^bf(t)\,dt$.

### King's rule

> **Remember:** $\displaystyle\int_a^bf(x)\,dx=\int_a^bf(a+b-x)\,dx$.

Why: as $x$ runs from $a$ to $b$, $a+b-x$ runs from $b$ back to $a$. It is the same area, read from right to left. (Formally, substitute $u=a+b-x$.)

The usual move is to add the two versions. **Example:** $I=\displaystyle\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}\,dx$.

1. Here $a+b=\frac{\pi}{2}$, and $\sin(\frac\pi2-x)=\cos x$ while $\cos(\frac\pi2-x)=\sin x$. So $I=\displaystyle\int_0^{\pi/2}\frac{\cos x}{\cos x+\sin x}\,dx$.
2. Add the two forms: $2I=\displaystyle\int_0^{\pi/2}\frac{\sin x+\cos x}{\sin x+\cos x}\,dx=\int_0^{\pi/2}1\,dx=\frac{\pi}{2}$.
3. So $I=\dfrac{\pi}{4}$.

### Even, odd and mirror symmetry

> **Remember:** $\displaystyle\int_{-a}^af(x)\,dx=2\int_0^af(x)\,dx$ if $f$ is even, and $\displaystyle\int_{-a}^af(x)\,dx=0$ if $f$ is odd.

An even graph has equal areas on the two sides of the vertical axis, and an odd graph has equal and opposite areas. So $\int_{-\pi}^{\pi}x\cos x\,dx=0$, because odd × even is odd. In $\int_{-1}^1(3x^2-ax+1)\,dx$, the odd part $-ax$ contributes nothing, so the answer is $\int_{-1}^1(3x^2+1)\,dx=2+2=4$, whatever $a$ is.

The same idea works about the middle of $[0,2a]$:

$$\int_0^{2a}f(x)\,dx=\begin{cases}2\displaystyle\int_0^af(x)\,dx & \text{if } f(2a-x)=f(x)\\ 0 & \text{if } f(2a-x)=-f(x)\end{cases}$$

For example, in $\int_0^{2\pi}(x-\pi)^2\sin x\,dx$, replacing $x$ by $2\pi-x$ leaves $(x-\pi)^2$ unchanged and turns $\sin x$ into $-\sin x$. So the integral is $0$.

Symmetry also kills terms in double and triple integrals over boxes centred at $0$: a term that is odd in any one of the variables integrates to $0$.

### Periodic functions and splitting

A function with **period** $T$ repeats every $T$: $f(x+T)=f(x)$. Every stretch of length $T$ then has the same area, so $\int_0^{nT}f\,dx=n\int_0^Tf\,dx$. For example, $|\sin x|$ has period $\pi$ and $\int_0^\pi|\sin x|\,dx=2$, so $\int_0^{10\pi}|\sin x|\,dx=20$.

For $|\cdot|$, the floor function or any piecewise formula, **split the integral where the formula changes**:

- $\int_{-1}^2|x|\,dx=\int_{-1}^0(-x)\,dx+\int_0^2x\,dx=\frac12+2=\frac52$.
- $\int_0^3\lfloor x\rfloor\,dx=0\cdot1+1\cdot1+2\cdot1=3$, since $\lfloor x\rfloor$ is $0$, $1$ and $2$ on the three unit stretches.

### Wallis' formula

For a whole number $n\ge2$:

$$\int_0^{\pi/2}\sin^nx\,dx=\int_0^{\pi/2}\cos^nx\,dx=\frac{n-1}{n}\cdot\frac{n-3}{n-2}\cdots\times\begin{cases}\dfrac{\pi}{2} & n\text{ even}\\ 1 & n\text{ odd}\end{cases}$$

The fractions step down by $2$ until they reach $\frac12$ (even $n$) or $\frac23$ (odd $n$). For example, $n=4$ gives $\frac34\cdot\frac12\cdot\frac\pi2=\frac{3\pi}{16}$, and $n=5$ gives $\frac45\cdot\frac23=\frac{8}{15}$. The reason: write $I_n$ for the integral of $\sin^nx$. Integration by parts gives $I_n=\frac{n-1}{n}I_{n-2}$, which steps down to $I_0=\frac\pi2$ or $I_1=1$.

### Area between curves

> **Remember:** the area between $y=f(x)$ and $y=g(x)$ from $a$ to $b$ is $\int_a^b|f(x)-g(x)|\,dx$: the top curve minus the bottom one, split wherever they cross.

**Example.** The area enclosed by $y=x$ and $y=x^2$.

1. They meet where $x=x^2$, at $x=0$ and $x=1$.
2. On $[0,1]$, $x\ge x^2$ (try $x=\frac12$: $\frac12>\frac14$), so $y=x$ is on top.
3. Area $=\int_0^1(x-x^2)\,dx=\frac12-\frac13=\frac16$.

> **Watch out:** an area is never negative. A plain integral counts the parts below the axis as negative, so for the area between $f$ and the axis use $\int|f|\,dx$.

### Improper integrals and the gamma shortcut

When a limit is infinite, or $f$ blows up inside the range, the integral is defined as a limit. It **converges** if that limit is a finite number and **diverges** otherwise.

- $\int_1^\infty\frac{dx}{x^2}=\lim_{R\to\infty}\Big[-\frac1x\Big]_1^R=\lim_{R\to\infty}\Big(1-\frac1R\Big)=1$, so it converges.
- $\int_1^\infty\frac{dx}{x}=\lim_{R\to\infty}\ln R=\infty$, so it diverges.

> **Remember:** $\int_1^\infty\frac{dx}{x^p}$ converges only when $p>1$, and $\int_0^1\frac{dx}{x^p}$ converges only when $p<1$. Comparing strips with the curve shows that the sum $\sum\frac{1}{n^p}$ is also finite only when $p>1$: $1+\frac14+\frac19+\cdots$ is finite, while $1+\frac12+\frac13+\cdots$ grows without bound.

For example, $x^{-1/3}$ blows up at $0$, but $p=\frac13<1$, so $\int_0^1x^{-1/3}\,dx=\Big[\frac32x^{2/3}\Big]_0^1=\frac32$ is finite.

The **gamma function** is $\Gamma(n)=\int_0^\infty x^{n-1}e^{-x}\,dx$ for $n>0$. Integration by parts gives $\Gamma(n+1)=n\,\Gamma(n)$, and $\Gamma(1)=1$, so for whole numbers:

$$\int_0^\infty x^ne^{-x}\,dx=\Gamma(n+1)=n!,\qquad \int_0^\infty x^ne^{-ax}\,dx=\frac{n!}{a^{n+1}},\qquad \int_0^\infty e^{-ax}\,dx=\frac1a.$$

Also $\Gamma(\frac12)=\sqrt\pi$, and $\int_{-\infty}^{\infty}e^{-x^2}\,dx=\sqrt\pi$. For example, $\int_0^\infty x^3e^{-x}\,dx=3!=6$ and $\int_0^\infty x^2e^{-2x}\,dx=\frac{2!}{2^3}=\frac14$.

### Double integrals

$\int_a^b\int_{c(x)}^{d(x)}f(x,y)\,dy\,dx$ is worked from the inside out. Do the inner integral in $y$ while holding $x$ fixed, which leaves a function of $x$. Then do the outer integral. The limits describe a region of the plane, so sketch it.

**Example ([GATE 2014](#/q/es_udOouq4EoACmXZef)).** $\displaystyle\int_0^3\int_0^x(6-x-y)\,dy\,dx$.

1. The region is the triangle $0\le y\le x\le3$.
2. Inner integral, with $x$ fixed: $\displaystyle\int_0^x(6-x-y)\,dy=\Big[(6-x)y-\frac{y^2}{2}\Big]_0^x=6x-x^2-\frac{x^2}{2}=6x-\frac32x^2$.
3. Outer integral: $\displaystyle\int_0^3\Big(6x-\frac32x^2\Big)dx=\Big[3x^2-\frac{x^3}{2}\Big]_0^3=27-13.5=13.5$.

**Changing the order.** The same region can be sliced the other way. The triangle $0\le y\le x\le3$ is also "$y$ from $0$ to $3$, and for each $y$, $x$ from $y$ to $3$". So $\int_0^3\int_0^xf\,dy\,dx=\int_0^3\int_y^3f\,dx\,dy$. Switching helps when the inner integral is hard. For example, $\int_0^1\int_x^1e^{y^2}\,dy\,dx$ is stuck, because $e^{y^2}$ has no simple antiderivative. Switched, it becomes $\int_0^1\int_0^ye^{y^2}\,dx\,dy=\int_0^1ye^{y^2}\,dy=\frac{e-1}{2}$.

When all the limits are constants and $f(x,y)=g(x)\,h(y)$, the double integral is simply $\int g\,dx\times\int h\,dy$.

### How GATE asks this

- Odd parts vanish over a balanced range, in one variable or several (1998, 2023, 2026).
- King's rule, often with a condition like $f(x)+f(2-x)=1$ (2024), or mirror symmetry about the middle (IT 2005).
- Split at a sign change to remove $|\cdot|$ (2014).
- Compare a sum with an integral (2000).
- An improper integral, or area versus signed integral (2015).
- A double integral, sometimes needing a change of order (1993, 2014).

**[GATE 2024 Set 2 Q.6](#/q/es_lwuez4mz).** $f$ is continuous and $f(x)=1-f(2-x)$ for all $x$. Find $\int_0^2f(x)\,dx$. Options: (A) $0$, (B) $1$, (C) $2$, (D) $-1$.

1. Let $I=\int_0^2f(x)\,dx$. King's rule with $a+b=2$ gives $I=\int_0^2f(2-x)\,dx$.
2. Add the two: $2I=\int_0^2\big[f(x)+f(2-x)\big]\,dx$. The condition says $f(x)+f(2-x)=1$, so $2I=\int_0^21\,dx=2$.
3. So $I=1$. **Answer: (B).** Check: the constant $f(x)=\frac12$ satisfies the condition, and its integral over $[0,2]$ is $1$.

**[GATE 2014 Set 3 Q.6](#/q/es_VuwjFFbNq241GKtJ).** If $\int_0^{2\pi}|x\sin x|\,dx=k\pi$, find $k$.

1. On $[0,\pi]$, $x\sin x\ge0$. On $[\pi,2\pi]$, $\sin x\le0$, so $|x\sin x|=-x\sin x$. Split at $\pi$.
2. By parts (see the integration lesson), $\int x\sin x\,dx=-x\cos x+\sin x$.
3. First part: $\big[-x\cos x+\sin x\big]_0^\pi=(-\pi)(-1)+0-0=\pi$.
4. Second part: $-\big[-x\cos x+\sin x\big]_\pi^{2\pi}=-\big[(-2\pi)-\pi\big]=3\pi$.
5. Total: $4\pi$, so $k=4$. **Answer: 4.** Without the absolute value you would get $\pi-3\pi=-2\pi$.

### Quick check

**1.** Find $\int_{-2}^{2}(x^3+x^2)\,dx$.

<details><summary>Show answer</summary>

$x^3$ is odd, so its part is $0$. $x^2$ is even, so its part is $2\int_0^2x^2\,dx=2\cdot\frac83=\frac{16}{3}$. Total: $\frac{16}{3}$.

</details>

**2.** Find $\int_0^{\pi/2}\sin^6x\,dx$.

<details><summary>Show answer</summary>

Wallis with $n=6$ (even): $\frac56\cdot\frac34\cdot\frac12\cdot\frac\pi2=\frac{15\pi}{96}=\frac{5\pi}{32}$.

</details>

**3.** Find the area enclosed by $y=x^2$ and $y=2x$.

<details><summary>Show answer</summary>

They meet where $x^2=2x$, at $x=0$ and $x=2$. In between, $2x\ge x^2$ (try $x=1$: $2>1$). Area $=\int_0^2(2x-x^2)\,dx=4-\frac83=\frac43$.

</details>

**4.** Find $\int_0^\infty x^4e^{-x}\,dx$.

<details><summary>Show answer</summary>

The gamma shortcut: $4!=24$.

</details>

**5.** ([GATE 2015](#/q/es_8bQL3JiQksb1iJXj)) For $f(x)=x^{-1/3}$ on $[-1,1]$, which are true? (I) $f$ is continuous on $[-1,1]$. (II) $f$ is not bounded on $[-1,1]$, meaning its size has no upper limit there. (III) The area between $f$ and the $x$-axis is non-zero and finite.

<details><summary>Show answer</summary>

(I) is false: $f$ is not even defined at $0$. (II) is true: near $0$ the values blow up. (III) is true: the area is $\int_{-1}^1|x|^{-1/3}\,dx=2\int_0^1x^{-1/3}\,dx=2\cdot\frac32=3$, finite because $p=\frac13<1$. So II and III. (The signed integral would be $0$, since $f$ is odd, but an area counts both halves as positive.)

</details>

### Practice from GATE

- [GATE 2026 Set 2 Q.17](#/q/es_mmz0zla4): the odd part of the integrand vanishes.
- [GATE 2023 Q.21](#/q/es_1lff3mwv4): a triple integral over a box centred at $0$.
- [GATE 2024 Set 2 Q.6](#/q/es_lwuez4mz): King's rule with $f(x)+f(2-x)=1$.
- [GATE IT 2005 Q.35](#/q/es_RFLuoTOQjZWzcm9J): symmetry about $x=\pi$ (the original paper has $(x-\pi)^2$, which gives $0$).
- [GATE 2014 Set 3 Q.6](#/q/es_VuwjFFbNq241GKtJ): split $|x\sin x|$ at $\pi$.
- [GATE 2000 Q.2.3](#/q/go_v1_5.4.3): a sum against an integral of an increasing function.
- [GATE 2014 Set 2 GA Q.5](#/q/es_udOouq4EoACmXZef): a double integral over a triangle.
- [GATE 1993 Q.2.6](#/q/es_xqypoLYZAnI8iWTj): a double integral where the inner limit is $\frac1x$; reversing the order is a good check.
