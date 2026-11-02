# Probability and Statistics

Probability is the maths of chance: it puts a number between 0 and 1 on how likely something is. Statistics, in the GATE syllabus, means summarising data with a few numbers such as the mean, median, mode and standard deviation. GATE CSE has asked about 90 questions on this chapter between 1989 and 2026, about two per paper in recent years, split between 1-mark and 2-mark MCQs and numerical answers; the same ideas also turn up inside hashing, networking and algorithms questions. Work through the lessons in order: counting, the basic rules, conditional probability, Bayes' theorem, random variables, expectation and variance, the standard distributions, and finally statistics of data.

## The counting toolkit {#counting}

*Count outcomes quickly and safely: arrangements, selections, repetition, "at least one" and sums of dice.*

### The idea

When every outcome of an experiment is equally likely, a probability is a ratio of two counts:

$$P(\text{event})=\frac{\text{number of outcomes in the event}}{\text{total number of outcomes}}$$

Toss two coins. The outcomes are HH, HT, TH and TT, so there are 4. Exactly one head happens in 2 of them (HT and TH), so the probability is $\tfrac24=\tfrac12$.

With 10 dice you cannot list everything, so you need counting rules. This lesson covers the ones GATE uses.

### The multiplication rule

If a job is done in steps, and step 1 can be done in $m$ ways and step 2 in $n$ ways whatever happened in step 1, then the whole job can be done in $m\times n$ ways.

Why: picture a grid with $m$ rows (the choices for step 1) and $n$ columns (the choices for step 2). Each cell is one way to do the whole job, and there are $m\times n$ cells. With 3 shirts and 4 pairs of trousers you can make $3\times4=12$ outfits. The rule extends to any number of steps. For example, a bit string of length $n$ has 2 choices in each position, so there are $2^n$ strings.

> **Example:** a number from 100 to 999 is chosen at random. What is the probability that it has no digit 7? ([GATE 1995 Q.1.18](#/q/es_57s1f5uaCcCGdGMx))
>
> There are $999-100+1=900$ numbers. Build a number with no 7, digit by digit:
>
> - hundreds digit: 1 to 9 but not 7, so 8 choices;
> - tens digit: 0 to 9 but not 7, so 9 choices;
> - units digit: also 9 choices.
>
> $$P=\frac{8\times9\times9}{900}=\frac{648}{900}=\frac{18}{25}$$

> **Watch out:** the first digit of a number cannot be 0. The tempting answer $(9/10)^3$ forgets this.

### Arrangements: when order matters

An **arrangement** (also called a **permutation**) is an ordering of objects. Three books A, B, C can stand on a shelf in 6 ways: ABC, ACB, BAC, BCA, CAB, CBA. The multiplication rule explains the 6: 3 choices for the first place, then 2 for the second, then 1 for the last.

In general, $n$ different objects can be arranged in a row in

$$n!=n\times(n-1)\times\cdots\times2\times1$$

ways. Read $n!$ as "$n$ factorial"; by agreement $0!=1$. If you fill only $r$ places from $n$ objects, you stop after $r$ factors:

$$^nP_r=n(n-1)\cdots(n-r+1)=\frac{n!}{(n-r)!}.$$

For example, a president and a secretary can be chosen from 10 people in $10\times9=90$ ways. Order matters here, because "Asha president, Ravi secretary" is different from the reverse.

> **Example:** six fair dice are rolled. What is the probability that all six numbers are different? ([GATE 2024 Set 2 Q.8](#/q/es_lwuf0z5z))
>
> Total outcomes: each die has 6 faces, so $6^6=46656$. Favourable: the first die can show any of 6 values, the second any of the other 5, and so on, giving $6!=720$.
>
> $$P=\frac{720}{46656}=\frac{5}{324}$$

### Selections: when order does not matter

A **selection** (also called a **combination**) is a group where order does not matter, like a committee or a hand of cards. From A, B, C, D you can pick 2 in 6 ways: AB, AC, AD, BC, BD, CD.

Here is why we divide. There are $4\times3=12$ ordered pairs, but each group such as {A, B} appears twice in that list (as AB and as BA). So the number of groups is $12/2=6$. In general each group of $r$ objects appears $r!$ times among the ordered choices, so

$$\binom{n}{r}=\frac{^nP_r}{r!}=\frac{n!}{r!\,(n-r)!}.$$

Read $\binom nr$ as "$n$ choose $r$"; it is also written $^nC_r$. Handy facts: $\binom n0=\binom nn=1$, $\binom n1=n$, and $\binom nr=\binom n{n-r}$, because choosing who is in is the same as choosing who is out.

> **Example:** a drawer has 3 red, 4 green and 3 blue socks. You take 2 at random. What is the probability that they match? ([GATE 2017 Set 2 GA.5](#/q/go_v1_9.44.4))
>
> All $\binom{10}{2}=45$ pairs are equally likely. Matching pairs: $\binom32+\binom42+\binom32=3+6+3=12$.
>
> $$P=\frac{12}{45}=\frac{4}{15}$$

**Mixed groups.** When the objects come in types, choose from each type separately and multiply. From 5 men and 4 women, a committee of 3 with exactly 2 women can be formed in $\binom42\times\binom51=6\times5=30$ ways.

### Repetition allowed or not

Ask two questions: does order matter, and can the same thing be used again? With $n$ things and $r$ picks:

| | Order matters | Order does not matter |
|---|---|---|
| No repetition | $^nP_r=\dfrac{n!}{(n-r)!}$ | $\dbinom nr$ |
| Repetition allowed | $n^r$ | $\dbinom{n+r-1}{r}$ |

With repetition and order, each of the $r$ picks has all $n$ options, so the multiplication rule gives $n^r$. The last cell (repetition, no order) is the stars-and-bars count at the end of this lesson.

The commonest GATE use of $n^r$ is putting **distinct** objects into boxes: each object chooses its own box.

> **Example:** seven different car accidents happen in a week. What is the probability that all of them happen on the same day? ([GATE 2001 Q.2.4](#/q/es_xK8EYy3q9m84DslC))
>
> Each accident can fall on any of 7 days, so there are $7^7$ equally likely assignments. "All on the same day" has 7 assignments, one for each day.
>
> $$P=\frac{7}{7^7}=\frac{1}{7^6}$$
>
> The trap answer $1/7^7$ is the chance that all of them fall on one particular day, say Monday.

**All different.** If $r$ objects each pick one of $n$ boxes, the number of ways in which no two share a box is $n(n-1)\cdots(n-r+1)$. This is the **birthday problem**: in a group of just 23 people, the chance that all birthdays differ is already below one half (about 0.49). In computing it appears as hashing: $r$ keys going into $n$ slots with no collision.

### "At least one": count the opposite

"At least one six" covers many cases: exactly one six, exactly two, and so on. Its opposite, "no six at all", is one simple case. So use

$$P(\text{at least one})=1-P(\text{none}).$$

Two dice: $P(\text{no six})=\dfrac{5\times5}{36}=\dfrac{25}{36}$, so $P(\text{at least one six})=1-\dfrac{25}{36}=\dfrac{11}{36}$. Check by counting: 6 outcomes have a six on the first die, 6 on the second, and $(6,6)$ is in both lists, so there are $6+6-1=11$.

The same trick handles "at least one head and at least one tail" in 4 coin tosses. Only HHHH and TTTT fail, so the answer is $1-\tfrac{2}{16}=\tfrac78$ ([GATE 2002 Q.2.16](#/q/es_XtaVJOywQnOtotnZ)).

### Identical objects: stars and bars

How many ways can you write 5 as $x+y+z$ with whole numbers $x,y,z\ge0$? Draw 5 stars and 2 bars in a row: for example $\star\star\mid\star\mid\star\star$ means $2+1+2$. Every row of 5 stars and 2 bars gives one solution, and every solution gives one row. A row has 7 positions, and we choose 2 of them for the bars, so there are $\binom72=21$ solutions. In general:

$$\text{solutions of } x_1+\cdots+x_k=n \text{ with every } x_i\ge0:\quad\binom{n+k-1}{k-1}.$$

> **Example:** four fair dice are rolled. The probability that the sum is 22 is $X/1296$. Find $X$. ([GATE 2014 Set 1 Q.48](#/q/es_IG9iX0GRmWnQTTVS))
>
> The largest possible sum is 24, so a sum of 22 is 2 short of it. If die $i$ shows $x_i$, let $d_i=6-x_i$ be how far it falls below 6. Then $d_1+d_2+d_3+d_4=2$ with each $d_i\ge0$, which has $\binom{2+3}{3}=\binom53=10$ solutions. (A die can fall at most 5 below 6, but with a total shortfall of 2 that limit never matters.) Each solution is exactly one ordered outcome of the dice, so $X=10$.
>
> Check by listing: one die shows 4 and the rest show 6 (4 ways), or two dice show 5 and the rest show 6 ($\binom42=6$ ways). Total $4+6=10$.

> **Watch out:** stars and bars counts how many identical units go to each labelled slot. It fits "dice that add to 22" because each ordered outcome is one solution. It does not fit distinct objects such as the seven accidents: there each object picks its own box, giving $7^7$, and the "how many per day" patterns are not equally likely.

### How GATE asks this

- Count favourable and total outcomes for digits, bit strings, dice or divisors with the multiplication rule.
- Draw a group of mixed types without putting anything back: multiply one combination per type.
- "All different" or "at least two the same": dice, birthdays, chocolates from bags, keys in a hash table.
- "At least one": go through the complement.
- Sums of dice: stars and bars, or a short list.

**[GATE 2014 Set 2 Q.1](#/q/es_Jrhp2s0qOv0chaPD).** A system has 10 computers, of which exactly 4 are working. Inspectors pick 4 computers at random, without replacement, and call the system functional if at least 3 of the 4 are working. If $p$ is the probability of being called functional, find $100p$.

1. Total: any 4 of the 10, so $\binom{10}{4}=210$ equally likely samples.
2. Exactly 3 working: choose 3 of the 4 working ones and 1 of the 6 others, $\binom43\binom61=4\times6=24$.
3. All 4 working: $\binom44=1$.
4. $p=\dfrac{24+1}{210}=\dfrac{25}{210}\approx0.119$, so $100p\approx11.9$.

**[GATE 2010 Q.27](#/q/es_WEcJOXTlh9e6D66n).** A divisor of $10^{99}$ is picked at random. What is the probability that it is a multiple of $10^{96}$?

1. $10^{99}=2^{99}\times5^{99}$, so every divisor is $2^a5^b$ with $a$ and $b$ each from 0 to 99. That gives $100\times100=10^4$ divisors.
2. A multiple of $10^{96}=2^{96}5^{96}$ needs $a\ge96$ and $b\ge96$: 4 choices each, so 16 divisors.
3. $P=\dfrac{16}{10^4}=\dfrac{1}{625}$.

### Quick check

**1.** How many 4-letter codes can be made from the letters A to E if no letter repeats? If letters may repeat? What is the probability that a random code (repeats allowed) has 4 different letters?

<details><summary>Show answer</summary>

No repeats: $5\times4\times3\times2=120$. Repeats allowed: $5^4=625$. So the probability is $\tfrac{120}{625}=0.192$.

</details>

**2.** A bag has 5 red and 3 blue balls. Three balls are drawn together. What is the probability of exactly 2 red?

<details><summary>Show answer</summary>

Favourable: $\binom52\binom31=10\times3=30$. Total: $\binom83=56$. So $P=\tfrac{30}{56}=\tfrac{15}{28}\approx0.536$.

</details>

**3.** How many solutions does $x+y+z=5$ have in non-negative integers? In positive integers?

<details><summary>Show answer</summary>

Non-negative: $\binom{7}{2}=21$. Positive: write $x=x'+1$ and so on, so $x'+y'+z'=2$ with $x',y',z'\ge0$, giving $\binom42=6$.

</details>

**4.** Five bags each hold the same 10 different chocolates. One chocolate is taken from each bag. What is the probability that at least two of the five are the same chocolate? ([GATE 2021 Set 1 GA.8](#/q/es_e1tzCfCaRFFkqbBrtG1kloymv8t))

<details><summary>Show answer</summary>

Complement: all five different, $\dfrac{10\times9\times8\times7\times6}{10^5}=0.3024$. So $P=1-0.3024=0.6976$.

</details>

**5.** Seven different balls are dropped at random into 3 boxes. What is the probability that box 1 stays empty?

<details><summary>Show answer</summary>

Each ball must land in box 2 or 3: $\dfrac{2^7}{3^7}=\dfrac{128}{2187}\approx0.059$.

</details>

### Practice from GATE

- [GATE 1996 Q.1.5](#/q/es_0dvqkitkdVTP0L2s): at least one six on two dice.
- [GATE 2005 Q.52](#/q/es_KsHpbD8feuWsV8i1): two random bit strings that are not identical.
- [GATE 2011 Q.34](#/q/es_uCOZtY6GpR5eplEM): ordered pairs of cards from a small deck.
- [GATE 2015 Set 2 Q.54](#/q/es_LKDH4TC6b0KyGUIa): a random function that is one-to-one.
- [GATE 2014 Set 3 Q.40](#/q/es_BRe0sVTVg5htJ2M9): hashing keys so that some slots stay empty.
- [GATE IT 2007 Q.28](#/q/es_EhBi0IhZfF33EDB1): the birthday problem inside a hash table.
- [GATE IT 2008 Q.23](#/q/es_vGvJkiM7qbXPFus4): at least three people share a birthday (the printed options contain a misprint).

## Probability basics {#probability-basics}

*Set up a sample space, use the basic rules (complement, "or", inclusion–exclusion) and solve the classic dice, coin, card and number questions.*

### The idea

An **experiment** is anything whose result you cannot predict for sure: tossing a coin, rolling a die, picking a card. Each possible result is an **outcome**. The list of all outcomes is the **sample space**, usually written $S$. For one die, $S=\{1,2,3,4,5,6\}$.

An **event** is a collection of outcomes you care about. "The die shows an even number" is the event $\{2,4,6\}$. The event happens if the outcome is one of its members.

The **probability** of an event is a number from 0 to 1 that measures how likely it is: 0 means it never happens and 1 means it always happens. If you repeated the experiment many times, it is roughly the fraction of times the event happens.

### Equally likely outcomes

When all outcomes are equally likely (a fair coin, a fair die, a well-shuffled deck, a number "chosen at random"), probability is counting:

$$P(E)=\frac{\text{number of outcomes in }E}{\text{number of outcomes in }S}.$$

For a fair die, $P(\text{even})=\tfrac36=\tfrac12$.

**Two dice.** Think of one die as red and the other as blue. An outcome is the ordered pair (red, blue), so there are $6\times6=36$ outcomes, all equally likely. A sum of 7 comes from (1,6), (2,5), (3,4), (4,3), (5,2) and (6,1), so $P(\text{sum}=7)=\tfrac{6}{36}=\tfrac16$.

> **Watch out:** (1, 2) and (2, 1) are different outcomes. Unordered results are not equally likely: "a 1 and a 2" happens in 2 ways but "two 1s" in only 1 way. So $P(\text{sum}=3)=\tfrac{2}{36}$, not $\tfrac{1}{21}$ (which wrongly treats the 21 unordered results as equally likely).

> **Watch out:** be clear about what is picked at random. In a town, 50% of families have 3 children, 30% have 2 and 20% have 1. A random **child** is not the same as a random **family**. For every $N$ families there are $1.5N+0.6N+0.2N=2.3N$ children, and $0.6N$ of them live in 2-child families. So $P=\tfrac{0.6}{2.3}=\tfrac{6}{23}$, not $\tfrac{3}{10}$ ([GATE IT 2004 Q.1](#/q/es_XpHCaslPBnm8p0WB)).

### The basic rules

Some notation first, with plain meanings:

- $A\cup B$ ("$A$ or $B$"): at least one of $A$ and $B$ happens. This is the **union**.
- $A\cap B$ ("$A$ and $B$"): both happen. This is the **intersection**.
- $A^c$ or $\bar A$ ("not $A$"): $A$ does not happen. This is the **complement**.

Every probability obeys these rules:

1. $0\le P(A)\le1$ and $P(S)=1$. The impossible event has probability 0.
2. **Complement:** $P(A^c)=1-P(A)$. Either $A$ happens or it does not, so the two chances add to 1.
3. **Addition rule:** $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.

Why the minus sign: when you add $P(A)$ and $P(B)$, the outcomes in both events are counted twice, so you take them away once. The picture shows it.

<figure class="fig"><svg viewBox="0 0 320 170" role="img" aria-label="Venn diagram: overlapping circles A and B inside a box, with 0.2 in A only, 0.1 in the overlap, 0.4 in B only and 0.3 outside both">
<rect x="10" y="10" width="300" height="150" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<circle cx="125" cy="85" r="60" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="2"/>
<circle cx="195" cy="85" r="60" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="2"/>
<text x="78" y="34" font-size="13" fill="currentColor" text-anchor="middle">A</text>
<text x="242" y="34" font-size="13" fill="currentColor" text-anchor="middle">B</text>
<text x="98" y="89" font-size="12" fill="currentColor" text-anchor="middle">0.2</text>
<text x="160" y="89" font-size="12" fill="currentColor" text-anchor="middle">0.1</text>
<text x="222" y="89" font-size="12" fill="currentColor" text-anchor="middle">0.4</text>
<text x="268" y="150" font-size="12" fill="currentColor" text-anchor="middle">neither 0.3</text>
</svg><figcaption>$P(A)=0.3$ and $P(B)=0.5$ both contain the overlap 0.1, so $P(A\cup B)=0.3+0.5-0.1=0.7$. The four regions add up to 1.</figcaption></figure>

Two events are **mutually exclusive** if they cannot happen together, like "the die shows 1" and "the die shows 6". Then $P(A\cap B)=0$ and the addition rule becomes $P(A\cup B)=P(A)+P(B)$.

Since $P(A\cap B)\ge0$, it is always true that $P(A\cup B)\le P(A)+P(B)$. This is the **union bound**.

The diagram also gives the region formulas:

- only $A$: $P(A\cap B^c)=P(A)-P(A\cap B)$, so $P(A)=P(A\cap B)+P(A\cap B^c)$;
- neither: $P(A^c\cap B^c)=1-P(A\cup B)$.

> **Example:** $P(A)=0.3$, $P(B)=0.5$ and $P(A\cap B)=0.1$. Find $P(A\cup B)$, $P(\text{only }A)$ and $P(\text{neither})$. ([GATE 2024 Set 1 Q.17](#/q/es_lwu9itlu))
>
> $P(A\cup B)=0.3+0.5-0.1=0.7$. Only $A$: $0.3-0.1=0.2$. Neither: $1-0.7=0.3$. These are the numbers in the diagram.

> **Example:** the chance of rain today is 0.5, tomorrow 0.6, and today or tomorrow 0.7. What is the chance of rain on both days? ([GATE 1997 Q.1.1](#/q/es_PYjCdyPN5YBj2iXe))
>
> Rearrange the addition rule: $P(T\cap M)=P(T)+P(M)-P(T\cup M)=0.5+0.6-0.7=0.4$.

### Three events: inclusion–exclusion

For three events, add the singles, subtract the pairs and add back the triple:

$$P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(A\cap B)-P(A\cap C)-P(B\cap C)+P(A\cap B\cap C).$$

Why the last term: an outcome in all three events is added 3 times by the singles and subtracted 3 times by the pairs, which leaves it counted 0 times. Adding the triple once counts it exactly once. The same formula works for counts of objects instead of probabilities.

> **Example:** a number from 1 to 100 is picked at random. What is the probability that it is divisible by none of 2, 3 and 5? ([GATE 2014 Set 2 Q.48](#/q/es_dQXfEwXRlukxsJtx))
>
> From 1 to $N$ there are $\lfloor N/k\rfloor$ multiples of $k$ (the whole-number part of $N/k$).
>
> - Singles: $50+33+20=103$ (multiples of 2, 3 and 5).
> - Pairs: $16+10+6=32$ (multiples of 6, 10 and 15).
> - Triple: $3$ (multiples of 30).
>
> Divisible by at least one: $103-32+3=74$. Divisible by none: $100-74=26$, so $P=0.26$.

### Classic setups

- **Coins:** $n$ tosses give $2^n$ equally likely sequences.
- **Dice:** $n$ dice give $6^n$ equally likely ordered outcomes.
- **Cards:** a deck has 52 cards in 4 suits (hearts, diamonds, clubs, spades; the first two are red) of 13 ranks each (A, 2 to 10, J, Q, K). There are 4 aces and 12 face cards (J, Q, K). For example, $P(\text{king or heart})=\tfrac{4}{52}+\tfrac{13}{52}-\tfrac{1}{52}=\tfrac4{13}$; the $\tfrac1{52}$ is the king of hearts, which was counted twice.
- **Numbers:** count multiples with $\lfloor N/k\rfloor$, or list the few cases.
- **Symmetry:** if nothing in the setup favours one candidate over another, all candidates are equally likely. In a random ordering of 1 to 20, each of the 10 even numbers is equally likely to be the first even number to appear, so $P(2\text{ comes before every other even number})=\tfrac1{10}$ ([GATE 2007 Q.24](#/q/es_89JeQCVYam5xpSSz)).

### How GATE asks this

- Count favourable outcomes for coins, dice, cards or chosen numbers.
- Give some of $P(A)$, $P(B)$, $P(A\cap B)$, $P(A\cup B)$ or the complements, and ask for another.
- Inclusion–exclusion for "divisible by 2, 3 or 5".
- Check that you used the right sample space (ordered outcomes; child or family).
- Symmetry in random orderings.

**[GATE IT 2008 Q.2](#/q/es_13uG6H3wBMJ4SalE).** $P(A\cap B)=\tfrac12$, $P(\bar A)=\tfrac13$ and $P(\bar B)=\tfrac13$. Find $P(A\cup B)$.

1. Complements: $P(A)=1-\tfrac13=\tfrac23$, and in the same way $P(B)=\tfrac23$.
2. Addition rule: $P(A\cup B)=\tfrac23+\tfrac23-\tfrac12=\tfrac{8+8-6}{12}=\tfrac{10}{12}$.

**[GATE 2014 Set 3 Q.48](#/q/es_dscUVNCocQ2GAoqM).** $A$ and $B$ are mutually exclusive and $A\cup B=S$. What is the largest possible value of $P(A)P(B)$?

1. They cannot overlap and together they cover everything, so $P(A)+P(B)=1$. Write $P(A)=x$ and $P(B)=1-x$.
2. Complete the square: $x(1-x)=\tfrac14-\left(x-\tfrac12\right)^2$. A square is never negative, so $x(1-x)\le\tfrac14$.
3. Equality holds at $x=\tfrac12$, so the maximum is $0.25$.

### Quick check

**1.** Two fair dice are rolled. What is the probability that the sum is 8?

<details><summary>Show answer</summary>

The outcomes (2,6), (3,5), (4,4), (5,3), (6,2) give 8, so $P=\tfrac{5}{36}$.

</details>

**2.** One card is drawn from a deck. What is the probability that it is red or a face card?

<details><summary>Show answer</summary>

Red: 26. Face: 12. Red face cards: 6, counted in both. So $P=\dfrac{26+12-6}{52}=\dfrac{32}{52}=\dfrac{8}{13}$.

</details>

**3.** $P(A)=0.6$, $P(B)=0.5$ and $P(A\cup B)=0.8$. Find $P(A\cap B)$, $P(\text{neither})$ and $P(\text{exactly one})$.

<details><summary>Show answer</summary>

$P(A\cap B)=0.6+0.5-0.8=0.3$. Neither: $1-0.8=0.2$. Exactly one: $P(A\cup B)-P(A\cap B)=0.8-0.3=0.5$.

</details>

**4.** A two-digit number (10 to 99) is chosen at random. What is the probability that it is not divisible by 7? ([GATE 2013 Q.62](#/q/go_v1_9.22.1))

<details><summary>Show answer</summary>

There are 90 two-digit numbers. The multiples of 7 among them run from $14=7\times2$ to $98=7\times14$, which is 13 numbers. So $P=\tfrac{90-13}{90}=\tfrac{77}{90}$.

</details>

**5.** The numbers 1 to $n$ ($n\ge3$) are put in a random order. What is the probability that 1 comes before both 2 and 3?

<details><summary>Show answer</summary>

Only the relative order of 1, 2 and 3 matters, and each of the three is equally likely to come first. So $P=\tfrac13$.

</details>

### Practice from GATE

- [GATE 2015 Set 1 GA.3](#/q/es_RiyhnxIgREj6oE0d): one number from each of two sets, with sum 16.
- [GATE 2026 Set 2 GA.10](#/q/es_mmz0zje4): two dice with a prime sum.
- [GATE 1994 Q.1.4](#/q/es_324NkkZHiOZA8nyq): which rule holds for any two events.
- [GATE 1994 Q.2.6](#/q/go_v1_7.6.2): rebuild $P(A)$ from two pieces.
- [GATE 2019 Q.22](#/q/es_W6Bi8hTM2IRjqdFTlPjf76htyjzxekr7w): two numbers with the same leading bit.
- [GATE 2020 Q.45](#/q/es_KpsqleAELXGyTR0oj71da9i2ynkcve3us3): parity of a random sum, by pairing outcomes.
- [GATE 2025 Set 2 Q.54](#/q/es_m80a3py1): count the objects first, then the favourable ones.

## Conditional probability and independence {#conditional-probability}

*Work out a probability "given" some information, multiply along a chain of events, and tell independent events apart from mutually exclusive ones.*

### The idea: "given" shrinks the sample space

Two fair coins are tossed, and someone tells you "at least one of them is a head". What is the chance that both are heads?

Before the news, HH, HT, TH and TT were equally likely. The news rules out TT. The three outcomes left are still equally likely, and only HH is "both heads". So the answer is $\tfrac13$, not $\tfrac12$ ([GATE 2011 Q.3](#/q/es_LYIJXZ35yFVoQQ4m)).

That is all "given" means: once you know that an event $B$ has happened, throw away every outcome outside $B$ and measure probabilities inside $B$.

### The formula

The probability of $A$ given $B$ is written $P(A\mid B)$ and equals

$$P(A\mid B)=\frac{P(A\cap B)}{P(B)},\qquad P(B)>0.$$

Why: inside the smaller world $B$, the part where $A$ also happens is $A\cap B$. Dividing by $P(B)$ rescales the smaller world so that its total probability is 1.

For a die, $P(6\mid\text{even})=\dfrac{P(\{6\})}{P(\{2,4,6\})}=\dfrac{1/6}{1/2}=\dfrac13$.

> **Watch out:** $P(A\mid B)$ and $P(B\mid A)$ are different. $P(6\mid\text{even})=\tfrac13$, but $P(\text{even}\mid6)=1$.

### The multiplication rule

Rearranging the formula gives the probability that both events happen:

$$P(A\cap B)=P(A)\,P(B\mid A).$$

For a chain of events, keep going: $P(A\cap B\cap C)=P(A)\,P(B\mid A)\,P(C\mid A\cap B)$. This is how you handle "first this, then that".

> **Example:** a deck is shuffled. What is the probability that the top and bottom cards are both aces? ([GATE 1996 Q.2.7](#/q/es_6zMu6dffgEwwajMF))
>
> The top card is an ace with probability $\tfrac{4}{52}$. Given that, the bottom card is one of the other 51 cards, and 3 of them are aces. So $P=\tfrac{4}{52}\times\tfrac{3}{51}=\tfrac{1}{221}$.

### Tree diagrams

When an experiment happens in stages, draw a tree. Each branch carries the probability of that step given everything before it. Multiply along a path to get the probability of the whole path, then add the paths that make up your event.

**Example ([GATE 2008 Q.27](#/q/es_GuC6dNSNQwwzee4k)).** Aishwarya studies either CS or maths each day. After a CS day she studies maths the next day with probability 0.6 (so CS with 0.4). After a maths day she studies CS the next day with probability 0.4. She studies CS on Monday. What is the probability that she studies CS on Wednesday?

<figure class="fig"><svg viewBox="0 0 340 190" role="img" aria-label="Tree diagram: Monday CS branches to Tuesday CS with 0.4 and Tuesday maths with 0.6; each branches to Wednesday CS with 0.4 and maths with 0.6; the two paths ending in Wednesday CS have probabilities 0.16 and 0.24">
<text x="40" y="14" font-size="11" fill="currentColor" fill-opacity="0.7" text-anchor="middle">Mon</text>
<text x="150" y="14" font-size="11" fill="currentColor" fill-opacity="0.7" text-anchor="middle">Tue</text>
<text x="262" y="14" font-size="11" fill="currentColor" fill-opacity="0.7" text-anchor="middle">Wed</text>
<line x1="56" y1="100" x2="134" y2="60" stroke="var(--accent)" stroke-width="2.2"/>
<text x="95" y="71" font-size="11" fill="currentColor" text-anchor="middle">0.4</text>
<line x1="56" y1="100" x2="134" y2="140" stroke="var(--accent)" stroke-width="2.2"/>
<text x="95" y="137" font-size="11" fill="currentColor" text-anchor="middle">0.6</text>
<line x1="166" y1="60" x2="246" y2="35" stroke="var(--accent)" stroke-width="2.2"/>
<text x="206" y="38" font-size="11" fill="currentColor" text-anchor="middle">0.4</text>
<line x1="166" y1="60" x2="246" y2="85" stroke="currentColor" stroke-width="1.3" stroke-opacity="0.45"/>
<text x="206" y="90" font-size="11" fill="currentColor" text-anchor="middle">0.6</text>
<line x1="166" y1="140" x2="246" y2="115" stroke="var(--accent)" stroke-width="2.2"/>
<text x="206" y="118" font-size="11" fill="currentColor" text-anchor="middle">0.4</text>
<line x1="166" y1="140" x2="246" y2="165" stroke="currentColor" stroke-width="1.3" stroke-opacity="0.45"/>
<text x="206" y="170" font-size="11" fill="currentColor" text-anchor="middle">0.6</text>
<text x="40" y="104" font-size="13" fill="currentColor" text-anchor="middle">CS</text>
<text x="150" y="64" font-size="13" fill="currentColor" text-anchor="middle">CS</text>
<text x="150" y="144" font-size="13" fill="currentColor" text-anchor="middle">M</text>
<text x="262" y="39" font-size="13" fill="currentColor" text-anchor="middle">CS</text>
<text x="262" y="89" font-size="13" fill="currentColor" text-anchor="middle">M</text>
<text x="262" y="119" font-size="13" fill="currentColor" text-anchor="middle">CS</text>
<text x="262" y="169" font-size="13" fill="currentColor" text-anchor="middle">M</text>
<text x="292" y="39" font-size="12" fill="var(--accent)">0.16</text>
<text x="292" y="119" font-size="12" fill="var(--accent)">0.24</text>
</svg><figcaption>Multiply along each path; add the paths that end in CS on Wednesday: $0.16+0.24=0.40$.</figcaption></figure>

The two paths that end in CS are CS, CS, CS with probability $0.4\times0.4=0.16$, and CS, maths, CS with probability $0.6\times0.4=0.24$. The answer is $0.16+0.24=0.40$.

### Independent events

Two events are **independent** if knowing that one happened does not change the chance of the other: $P(A\mid B)=P(A)$. Put this into the formula and you get the **product rule**, which is the test GATE wants:

$$A,B\text{ independent}\iff P(A\cap B)=P(A)\,P(B).$$

Compute both sides and compare. Two fair coins: let $A$ = both heads, $B$ = first is a head, $C$ = second is a head ([GATE 2023 Q.43](#/q/es_1lffbdol3)).

- $P(B\cap C)=\tfrac14=\tfrac12\times\tfrac12$, so $B$ and $C$ are independent.
- $P(A\cap B)=P(A)=\tfrac14$, but $P(A)P(B)=\tfrac18$, so $A$ and $B$ are not independent. Knowing $B$ doubles the chance of $A$.

If $A$ and $B$ are independent, so are $A$ and $B^c$, $A^c$ and $B$, and $A^c$ and $B^c$: knowing whether $B$ happened still tells you nothing about $A$. This gives the formula GATE uses most:

$$P(\text{at least one of }A_1,\dots,A_n)=1-(1-p_1)(1-p_2)\cdots(1-p_n)\quad\text{for independent events}.$$

> **Example:** independent events $A$, $B$, $C$ have probabilities 0.8, 0.5 and 0.3. What is the probability that at least one happens? ([GATE 1994 Q.2.8](#/q/go_v1_7.10.1))
>
> $P(\text{none})=0.2\times0.5\times0.7=0.07$, so $P(\text{at least one})=1-0.07=0.93$. Adding $0.8+0.5+0.3=1.6$ is wrong: you may add only for mutually exclusive events.

In the same way, a 5-bit message whose bits flip independently with probability 0.01 arrives error-free with probability $0.99^5\approx0.951$ ([GATE 2025 Set 1 Q.46](#/q/es_m7wybxo1)).

### Independent is not the same as mutually exclusive

These two ideas sound alike but are almost opposites.

| | Mutually exclusive | Independent |
|---|---|---|
| Meaning | cannot happen together | one tells you nothing about the other |
| Test | $P(A\cap B)=0$ | $P(A\cap B)=P(A)P(B)$ |
| $P(A\cup B)$ | $P(A)+P(B)$ | $P(A)+P(B)-P(A)P(B)$ |
| Example | die shows 1; die shows 6 | first coin is H; second coin is H |

If $P(A)>0$ and $P(B)>0$, mutually exclusive events are strongly dependent: once $A$ happens, you know $B$ did not. So two events with non-zero probabilities can never be both.

> **Example:** the numbers 1 to $n$ ($n\ge4$) are put in a random order. Let $X$ = "1 comes before 2" and $Y$ = "3 comes before 4". ([GATE 2024 Set 1 Q.4](#/q/es_lwtfj7s2))
>
> All $4!=24$ relative orders of 1, 2, 3, 4 are equally likely. $P(X)=P(Y)=\tfrac12$ by symmetry. For $X\cap Y$, choose which 2 of the 4 places hold 1 and 2 ($\binom42=6$ ways); then 1 must come first in its pair and 3 in its pair. So $P(X\cap Y)=\tfrac{6}{24}=\tfrac14=P(X)P(Y)$: independent. They are not mutually exclusive, since the order 1, 2, 3, 4 satisfies both.

### Pairwise independence is not enough

Three events $A$, $B$, $C$ are **mutually independent** when every pair is independent **and** $P(A\cap B\cap C)=P(A)P(B)P(C)$. The last condition does not follow from the pairs.

Toss two fair coins. Let $A$ = first is H, $B$ = second is H, $C$ = both coins show the same face. Each has probability $\tfrac12$. Every pair meets only in the outcome HH, so each pair has $P=\tfrac14=\tfrac12\times\tfrac12$: they are pairwise independent. But $A\cap B\cap C$ is also just HH, with probability $\tfrac14$, not $\tfrac18$. Indeed, once you know $A$ and $B$, event $C$ is certain.

### With and without replacement

Drawing **with replacement** (putting the item back) leaves the bag unchanged, so the draws are independent and you multiply the same probabilities. Drawing **without replacement** changes the bag, so each draw depends on the earlier ones and you multiply updated fractions.

> **Example (with replacement):** a bag has 10 blue, 20 green and 30 red marbles. Three are drawn, one at a time, each put back. What is the probability that all three colours appear? ([GATE IT 2005 Q.1](#/q/es_5OiHsp5Ps0PHcHK9))
>
> One particular order, say blue, green, red, has probability $\tfrac16\times\tfrac13\times\tfrac12=\tfrac1{36}$. There are $3!=6$ orders, so $P=\tfrac{6}{36}=\tfrac16$.

> **Example (without replacement):** a bag has 10 red and 15 blue balls. Two are drawn without replacement. Given that the first is red, what is the probability that both are red? ([GATE 2024 Set 1 Q.53](#/q/es_lwue3e3s))
>
> After one red ball is gone, the bag has 9 red out of 24, so $P=\tfrac{9}{24}=0.375$.

### How GATE asks this

- "Given that at least one ...": shrink the sample space.
- Find $P(A\mid B)$, a reversed condition or a condition on complements from given numbers.
- Test independence with the product rule.
- "At least one" of several independent events; error-free transmission.
- Processes in stages: trees, urns, and experiments that restart.

**[GATE 2017 Set 2 Q.26](#/q/es_UwVgi9EInxDO1VyG).** Two people, P and Q, may apply for a job. Let $A$ = "P applies" and $B$ = "Q applies". We know $P(A)=\tfrac14$, $P(A\mid B)=\tfrac12$ and $P(B\mid A)=\tfrac13$. Find the probability that P does not apply given that Q does not apply, $P(A^c\mid B^c)$.

1. Both apply: $P(A\cap B)=P(A)\,P(B\mid A)=\tfrac14\times\tfrac13=\tfrac1{12}$.
2. From $P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}$: $P(B)=\dfrac{1/12}{1/2}=\dfrac16$.
3. At least one applies: $P(A\cup B)=\tfrac14+\tfrac16-\tfrac1{12}=\tfrac13$, so neither applies with probability $\tfrac23$.
4. $P(A^c\mid B^c)=\dfrac{P(A^c\cap B^c)}{P(B^c)}=\dfrac{2/3}{5/6}=\dfrac45$.

**[GATE 2016 Set 1 Q.29](#/q/es_1wbEOlnoBCRBqDFe).** Flip a fair coin twice. On (T, H) output Y; on (H, H) or (H, T) output N; on (T, T) start again. Find $P(\text{output Y})$.

1. In one round: Y with probability $\tfrac14$, N with $\tfrac12$, restart with $\tfrac14$.
2. Let $p=P(\text{Y})$. Either Y comes now, or there is a restart and then everything begins afresh: $p=\tfrac14+\tfrac14p$.
3. So $\tfrac34p=\tfrac14$ and $p=\tfrac13\approx0.33$.

Shortcut: only the round that ends the game matters, so $p=P(\text{Y}\mid\text{round ends})=\dfrac{1/4}{3/4}=\dfrac13$.

### Quick check

**1.** A die shows an even number. What is the probability that it is greater than 3?

<details><summary>Show answer</summary>

Given "even", the outcomes are 2, 4, 6. Two of them (4 and 6) exceed 3, so $P=\tfrac23$.

</details>

**2.** $P(A)=0.5$, $P(B)=0.4$ and $P(A\cap B)=0.2$. Find $P(A\mid B)$ and $P(B\mid A)$. Are $A$ and $B$ independent?

<details><summary>Show answer</summary>

$P(A\mid B)=\tfrac{0.2}{0.4}=0.5$ and $P(B\mid A)=\tfrac{0.2}{0.5}=0.4$. Yes, they are independent, because $0.5\times0.4=0.2=P(A\cap B)$. Notice $P(A\mid B)=P(A)$.

</details>

**3.** Two cards are drawn without replacement. What is the probability that both are hearts?

<details><summary>Show answer</summary>

$\tfrac{13}{52}\times\tfrac{12}{51}=\tfrac{1}{17}$.

</details>

**4.** A bag has 10 white and 15 black balls. Two balls are drawn **with** replacement. What is the probability of one of each colour?

<details><summary>Show answer</summary>

Either white then black or black then white: $2\times\tfrac{10}{25}\times\tfrac{15}{25}=\tfrac{12}{25}=0.48$. (Without replacement it would be $\tfrac{10}{25}\cdot\tfrac{15}{24}+\tfrac{15}{25}\cdot\tfrac{10}{24}=\tfrac12$.)

</details>

**5.** $A$ and $B$ are mutually exclusive with $P(A)=0.3$ and $P(B)=0.4$. Are they independent?

<details><summary>Show answer</summary>

No. $P(A\cap B)=0$, but $P(A)P(B)=0.12\ne0$.

</details>

### Practice from GATE

- [GATE 1995 Q.2.14](#/q/es_r4P7htBpQTKaxSIy): two balls of different colours drawn in turn.
- [GATE 2003 Q.3](#/q/es_UZWctAy1RkFRjFdy): conditioning when one event is certain.
- [GATE 1999 Q.2.1](#/q/es_RfNNZY5pfLf9fsRb): test independence and find a conditional probability.
- [GATE 2000 Q.2.2](#/q/es_YC3qvK2KtHn363zy): independent events whose union is certain.
- [GATE 2009 Q.21](#/q/es_8FRc65bMXcfKWpar): conditional probability on a biased die.
- [GATE 2015 Set 3 Q.37](#/q/es_a0uKog20F8yPZBoE): conditioning on an independent bit.
- [GATE 2026 Set 1 Q.1](#/q/es_mmz10a1i): an urn that grows; draw the tree.
- [GATE 2026 Set 2 Q.53](#/q/es_mmz108l0): two coin events that share one toss.

## Total probability and Bayes' theorem {#bayes-theorem}

*Find a probability by splitting it into cases, and turn "how likely is this evidence under each cause" into "how likely is each cause, now that I have seen the evidence".*

### The idea

Many GATE questions have two stages. First a hidden **cause** is chosen: which box, which factory, which coin, which signal was sent. Then you see an **effect**: a red ball, a faulty part, two heads, a received signal.

There are two natural questions:

- **Forwards:** what is the chance of the effect? This is the total probability rule.
- **Backwards:** you saw the effect; what is the chance of each cause? This is Bayes' theorem.

### Splitting into cases: the total probability rule

Events $B_1,\dots,B_n$ form a **partition** if exactly one of them happens every time: they do not overlap and together they cover everything. "Box P was chosen" and "box Q was chosen" form a partition. Then for any event $A$:

$$P(A)=P(B_1)\,P(A\mid B_1)+P(B_2)\,P(A\mid B_2)+\cdots+P(B_n)\,P(A\mid B_n).$$

Why: $A$ splits into the non-overlapping pieces $A\cap B_1,\dots,A\cap B_n$. By the multiplication rule each piece has probability $P(B_i)\,P(A\mid B_i)$, and you add the pieces. So $P(A)$ is a weighted average of the $P(A\mid B_i)$, with the weights $P(B_i)$.

> **Example:** one coin gives heads with probability $\tfrac58$, another with probability $\tfrac14$. One coin is picked at random and tossed. What is $P(\text{heads})$? ([GATE IT 2007 Q.1](#/q/es_YiYmAw8DJy7Ry2xJ))
>
> $$P(H)=\tfrac12\cdot\tfrac58+\tfrac12\cdot\tfrac14=\tfrac{5}{16}+\tfrac{2}{16}=\tfrac{7}{16}$$

The rule also works backwards to find a missing piece.

> **Example:** the chance of afternoon rain is 0.6. If the noon temperature is at most $25^\circ$C, the chance is 0.4. Noon is equally likely to be above or at most $25^\circ$C. What is the chance of rain on a day above $25^\circ$C? ([GATE IT 2006 Q.1](#/q/es_4ii9RGFrCVNshvra))
>
> Let $x$ be the unknown. Then $0.6=0.5\times0.4+0.5\,x$, so $0.5\,x=0.4$ and $x=0.8$.

### Reversing the condition: Bayes' theorem

You saw $A$ and want $P(B_i\mid A)$:

$$P(B_i\mid A)=\frac{P(B_i)\,P(A\mid B_i)}{P(A)}=\frac{P(B_i)\,P(A\mid B_i)}{\sum_j P(B_j)\,P(A\mid B_j)}.$$

Why: the chance that both $B_i$ and $A$ happen can be written in two ways, $P(A)\,P(B_i\mid A)=P(B_i)\,P(A\mid B_i)$. Divide both sides by $P(A)$, and expand $P(A)$ with the total probability rule.

In words: **the path through $B_i$ divided by all the paths that lead to $A$.** Three names you will meet: $P(B_i)$ is the **prior** (the chance of the cause before you look), $P(A\mid B_i)$ is the **likelihood** (how likely the evidence is under that cause), and $P(B_i\mid A)$ is the **posterior** (the updated chance after the evidence).

### The tree method

**Example ([GATE 2005 Q.51](#/q/es_Dvbj82nFQ8d9cwKi)).** Box P has 2 red and 3 blue balls; box Q has 3 red and 1 blue. Box P is chosen with probability $\tfrac13$ and box Q with $\tfrac23$, and then one ball is drawn from the chosen box. The ball is red. What is the probability that it came from box P?

<figure class="fig"><svg viewBox="0 0 340 190" role="img" aria-label="Tree diagram: box P with probability 1/3 gives red 2/5 or blue 3/5; box Q with probability 2/3 gives red 3/4 or blue 1/4; the red paths have probabilities 2/15 and 1/2">
<text x="150" y="14" font-size="11" fill="currentColor" fill-opacity="0.7" text-anchor="middle">box</text>
<text x="266" y="14" font-size="11" fill="currentColor" fill-opacity="0.7" text-anchor="middle">ball</text>
<line x1="60" y1="100" x2="126" y2="60" stroke="var(--accent)" stroke-width="2.2"/>
<text x="93" y="71" font-size="11" fill="currentColor" text-anchor="middle">1/3</text>
<line x1="60" y1="100" x2="126" y2="140" stroke="var(--accent)" stroke-width="2.2"/>
<text x="93" y="137" font-size="11" fill="currentColor" text-anchor="middle">2/3</text>
<line x1="174" y1="60" x2="250" y2="35" stroke="var(--accent)" stroke-width="2.2"/>
<text x="212" y="38" font-size="11" fill="currentColor" text-anchor="middle">2/5</text>
<line x1="174" y1="60" x2="248" y2="85" stroke="currentColor" stroke-width="1.3" stroke-opacity="0.45"/>
<text x="211" y="90" font-size="11" fill="currentColor" text-anchor="middle">3/5</text>
<line x1="174" y1="140" x2="250" y2="115" stroke="var(--accent)" stroke-width="2.2"/>
<text x="212" y="118" font-size="11" fill="currentColor" text-anchor="middle">3/4</text>
<line x1="174" y1="140" x2="248" y2="165" stroke="currentColor" stroke-width="1.3" stroke-opacity="0.45"/>
<text x="211" y="170" font-size="11" fill="currentColor" text-anchor="middle">1/4</text>
<text x="40" y="104" font-size="13" fill="currentColor" text-anchor="middle">start</text>
<text x="150" y="64" font-size="13" fill="currentColor" text-anchor="middle">box P</text>
<text x="150" y="144" font-size="13" fill="currentColor" text-anchor="middle">box Q</text>
<text x="266" y="39" font-size="13" fill="currentColor" text-anchor="middle">red</text>
<text x="266" y="89" font-size="13" fill="currentColor" text-anchor="middle">blue</text>
<text x="266" y="119" font-size="13" fill="currentColor" text-anchor="middle">red</text>
<text x="266" y="169" font-size="13" fill="currentColor" text-anchor="middle">blue</text>
<text x="290" y="39" font-size="12" fill="var(--accent)">2/15</text>
<text x="290" y="119" font-size="12" fill="var(--accent)">1/2</text>
</svg><figcaption>The two paths that end in a red ball have probabilities $\tfrac{2}{15}$ and $\tfrac12$. Bayes compares the box P path with their total.</figcaption></figure>

1. Path P then red: $\tfrac13\times\tfrac25=\tfrac{2}{15}=\tfrac{4}{30}$.
2. Path Q then red: $\tfrac23\times\tfrac34=\tfrac12=\tfrac{15}{30}$.
3. All red paths: $P(\text{red})=\tfrac{4}{30}+\tfrac{15}{30}=\tfrac{19}{30}$.
4. Bayes: $P(\text{P}\mid\text{red})=\dfrac{4/30}{19/30}=\dfrac{4}{19}$.

> **Watch out:** $\tfrac{19}{30}$ is one of the options in this question. It is $P(\text{red})$, the denominator, not the answer.

### The table method

Imagine a convenient number of trials, say 10000, and fill a table with counts. Then every answer is one count divided by another, and you cannot mix up the direction of a condition.

**Example (a medical test).** 1% of people have a disease. The test is positive for 99% of sick people, and also, wrongly, for 5% of healthy people. You test positive. What is the chance that you are sick?

| | Test positive | Test negative | Total |
|---|---|---|---|
| Sick | 99 | 1 | 100 |
| Healthy | 495 | 9405 | 9900 |
| Total | 594 | 9406 | 10000 |

Of the 594 people who test positive, 99 are sick, so $P(\text{sick}\mid\text{positive})=\tfrac{99}{594}=\tfrac16\approx0.17$.

Only about 1 in 6! The disease is rare, so the 99 true positives are outnumbered by 495 false alarms from the much larger healthy group. The prior matters a lot.

### Classic setups

- **Factories and suppliers.** Supplier X makes 60% of the parts and 96% of them are reliable; supplier Y makes 40% and 72% are reliable. $P(\text{reliable})=0.576+0.288=0.864$, so $P(\text{Y}\mid\text{reliable})=\tfrac{0.288}{0.864}=\tfrac13$ ([GATE 2012 Q.63](#/q/go_v1_9.9.1)).
- **Tests that can be wrong.** A part is faulty with probability $p$ and the test is right with probability $q$. It is declared faulty if it is faulty and the test is right, or good and the test is wrong: $pq+(1-p)(1-q)$ ([GATE 2010 Q.26](#/q/es_Up4fdo1Mihe39Cfk)).
- **Pick a coin, box or urn, then draw or toss.**
- **Signals through a noisy channel**, and **tables of conditional probabilities** (weather in two cities).

> **Watch out:** read which way the given condition points. A table of $P(\text{Delhi}\mid\text{Guwahati})$ needs Bayes to give $P(\text{Guwahati}\mid\text{Delhi})$. And the denominator is the total chance of the evidence over every cause, not the prior.

### How GATE asks this

- A weighted average over cases: coins, bulbs, a die that is rolled again.
- Solve the total probability rule for a missing conditional probability.
- Reverse a condition: boxes, coins, channels, tables.

**[GATE 2021 Set 1 Q.54](#/q/es_40599uckwrzobg0).** A sender transmits H with probability 0.1 and L with probability 0.9. A sent H is received as H with probability 0.3; a sent L is received as H with probability 0.8. The received signal is H. What is the probability that H was sent?

1. Paths to "received H": sent H, $0.1\times0.3=0.03$; sent L, $0.9\times0.8=0.72$.
2. $P(\text{received H})=0.03+0.72=0.75$.
3. $P(\text{sent H}\mid\text{received H})=\tfrac{0.03}{0.75}=0.04$.

**[GATE 2025 Set 1 Q.22](#/q/es_m7wyc1t6).** A box has 4 fair coins and 1 fake coin that always shows heads. You pick a coin at random, toss it twice and get two heads. What is the probability that you picked the fake coin?

1. Priors: fake $\tfrac15$, fair $\tfrac45$. Likelihoods of two heads: fake 1, fair $\left(\tfrac12\right)^2=\tfrac14$.
2. $P(HH)=\tfrac15\times1+\tfrac45\times\tfrac14=\tfrac15+\tfrac15=\tfrac25$.
3. $P(\text{fake}\mid HH)=\dfrac{1/5}{2/5}=\dfrac12=0.5$.

### Quick check

**1.** Machine A makes 60% of the items and 2% of them are defective. Machine B makes 40% and 5% of them are defective. Find $P(\text{defective})$ and $P(\text{B}\mid\text{defective})$.

<details><summary>Show answer</summary>

$P(\text{defective})=0.6\times0.02+0.4\times0.05=0.012+0.020=0.032$. Then $P(\text{B}\mid\text{defective})=\tfrac{0.020}{0.032}=0.625$.

</details>

**2.** A student knows the answer to a 4-option question with probability 0.6 and guesses otherwise. If she knows it she is right; if she guesses she is right with probability $\tfrac14$. She answered correctly. What is the probability that she guessed?

<details><summary>Show answer</summary>

$P(\text{correct})=0.6\times1+0.4\times\tfrac14=0.7$. So $P(\text{guessed}\mid\text{correct})=\tfrac{0.1}{0.7}=\tfrac17\approx0.143$.

</details>

**3.** In the "declared faulty" setup above, take $p=0.1$ and $q=0.9$. Find $P(\text{declared faulty})$ and $P(\text{faulty}\mid\text{declared faulty})$.

<details><summary>Show answer</summary>

$P(\text{declared faulty})=0.1\times0.9+0.9\times0.1=0.18$. Then $P(\text{faulty}\mid\text{declared faulty})=\tfrac{0.09}{0.18}=0.5$.

</details>

**4.** Bag 1 has 3 red and 2 blue balls; bag 2 has 1 red and 4 blue. A bag is picked at random and a red ball is drawn. What is the probability that it came from bag 1?

<details><summary>Show answer</summary>

$\dfrac{\frac12\cdot\frac35}{\frac12\cdot\frac35+\frac12\cdot\frac15}=\dfrac{3/10}{4/10}=\dfrac34$.

</details>

**5.** A bag has $r$ red and $b$ black balls. A ball is drawn and put back together with one more ball of the same colour. Show that the second draw is red with probability $\tfrac{r}{r+b}$.

<details><summary>Show answer</summary>

Split on the first draw:

$$\frac{r}{r+b}\cdot\frac{r+1}{r+b+1}+\frac{b}{r+b}\cdot\frac{r}{r+b+1}=\frac{r(r+1+b)}{(r+b)(r+b+1)}=\frac{r}{r+b}.$$

The same argument repeated shows that every later draw is also red with probability $\tfrac{r}{r+b}$.

</details>

### Practice from GATE

- [GATE 2016 Set 2 Q.5](#/q/es_5OEj5RGeUozEfHYc): two types of LED bulb.
- [GATE 2022 GA.8](#/q/es_1kzya7y4z): split on the colour of the first ball.
- [GATE 2012 Q.33](#/q/es_WJnZZosXXmccGC4o): split on the first roll of a die.
- [GATE 2018 Q.44](#/q/es_7yX24SWevlhvrSLs): reverse a table of conditional probabilities.
- [GATE 2021 Set 2 Q.33](#/q/es_40599uckwrzvljm): a growing urn, fourth draw.

## Random variables {#random-variables}

*Describe a random quantity with a PMF, a PDF or a CDF, move between them, make a density valid by finding its constant, and find a median.*

### The idea

A **random variable** is a rule that attaches a number to each outcome. Toss two coins and let $X$ be the number of heads: HH gives 2, HT and TH give 1, TT gives 0. Capital letters name the variable and small letters its values, so "$X=1$" is the event "exactly one head".

There are two kinds:

- **Discrete:** the values can be listed, like 0, 1, 2, ... (number of heads, number of faulty items, the face of a die).
- **Continuous:** any value in an interval is possible (a waiting time, a length, a temperature).

### Discrete: the PMF

For a discrete variable, list each value with its probability. This list is the **probability mass function (PMF)**, $p(x)=P(X=x)$. For the number of heads in two tosses:

| $x$ | 0 | 1 | 2 |
|---|---|---|---|
| $P(X=x)$ | $\tfrac14$ | $\tfrac12$ | $\tfrac14$ |

Every $p(x)$ is at least 0, and they add up to 1, because some value must occur.

> **Example:** $P(X=x)=kx^2$ for $x=1,2,3$. Find $k$.
>
> The probabilities must add to 1: $k(1+4+9)=14k=1$, so $k=\tfrac1{14}$.

### Continuous: the PDF

For a continuous variable, the chance of hitting one exact value, such as a waiting time of exactly 2.000... seconds, is zero. So we ask about intervals instead. The tool is a **probability density function (PDF)** $f(x)$: a curve whose **area** over an interval is the probability of landing in that interval.

$$P(a\le X\le b)=\int_a^b f(x)\,dx$$

A density must satisfy $f(x)\ge0$ everywhere, and the total area must be $\int_{-\infty}^{\infty}f(x)\,dx=1$.

In plain words, $f(x)$ is "probability per unit length" near $x$, like the mass per centimetre of a rod. So $f(x)$ itself is not a probability, and it can be bigger than 1. The density $f(x)=2$ on $[0,0.5]$ is perfectly valid: the area is $2\times0.5=1$.

**Why $P(X=a)=0$:** the area above a single point is a line of zero width. So for a continuous variable it does not matter whether the ends of an interval are included: $P(a<X\le b)=P(a\le X\le b)$.

<figure class="fig"><svg viewBox="0 0 330 175" role="img" aria-label="Density curve f(x) equal to x squared over 21 between 1 and 4, rising from left to right, with the area between 2 and 3 shaded">
<line x1="20" y1="150" x2="318" y2="150" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M126.7 150 L126.7 120.0 L129.6 119.0 L132.4 118.0 L135.3 116.9 L138.2 115.9 L141.1 114.8 L144.0 113.7 L146.9 112.6 L149.8 111.5 L152.7 110.3 L155.6 109.2 L158.4 108.0 L161.3 106.8 L164.2 105.6 L167.1 104.4 L170.0 103.1 L172.9 101.9 L175.8 100.6 L178.7 99.3 L181.6 98.0 L184.4 96.7 L187.3 95.3 L190.2 94.0 L193.1 92.6 L196.0 91.2 L198.9 89.8 L201.8 88.4 L204.7 86.9 L207.6 85.5 L210.4 84.0 L213.3 82.5 L213.3 150 Z" fill="var(--accent)" fill-opacity="0.3"/>
<line x1="40.0" y1="150" x2="40.0" y2="142.5" stroke="var(--accent)" stroke-width="2.5"/>
<path d="M40.0 142.5 L44.3 141.7 L48.7 140.9 L53.0 140.1 L57.3 139.2 L61.7 138.3 L66.0 137.3 L70.3 136.3 L74.7 135.3 L79.0 134.2 L83.3 133.1 L87.7 132.0 L92.0 130.8 L96.3 129.6 L100.7 128.3 L105.0 127.0 L109.3 125.7 L113.7 124.3 L118.0 122.9 L122.3 121.5 L126.7 120.0 L131.0 118.5 L135.3 116.9 L139.7 115.3 L144.0 113.7 L148.3 112.0 L152.7 110.3 L157.0 108.6 L161.3 106.8 L165.7 105.0 L170.0 103.1 L174.3 101.2 L178.7 99.3 L183.0 97.3 L187.3 95.3 L191.7 93.3 L196.0 91.2 L200.3 89.1 L204.7 86.9 L209.0 84.7 L213.3 82.5 L217.7 80.2 L222.0 77.9 L226.3 75.6 L230.7 73.2 L235.0 70.8 L239.3 68.3 L243.7 65.8 L248.0 63.3 L252.3 60.7 L256.7 58.1 L261.0 55.5 L265.3 52.8 L269.7 50.1 L274.0 47.3 L278.3 44.5 L282.7 41.7 L287.0 38.8 L291.3 35.9 L295.7 33.0 L300.0 30.0" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
<line x1="300.0" y1="30.0" x2="300.0" y2="150" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="4 3"/>
<text x="40.0" y="166" font-size="12" fill="currentColor" text-anchor="middle">1</text>
<text x="126.7" y="166" font-size="12" fill="currentColor" text-anchor="middle">2</text>
<text x="213.3" y="166" font-size="12" fill="currentColor" text-anchor="middle">3</text>
<text x="300.0" y="166" font-size="12" fill="currentColor" text-anchor="middle">4</text>
<text x="170.0" y="142" font-size="12" fill="currentColor" text-anchor="middle">0.30</text>
<text x="230.7" y="57.2" font-size="12" fill="currentColor" text-anchor="end">f(x)</text>
</svg><figcaption>For $f(x)=x^2/21$ on $[1,4]$, the shaded area is $P(2\le X\le 3)=\tfrac{19}{63}\approx0.30$. The whole area under the curve is 1.</figcaption></figure>

### Find the constant that makes a PDF valid

If a density contains an unknown constant, set the total area equal to 1 and solve.

> **Example:** $f(x)=Cx^2$ for $1\le x\le4$ and 0 elsewhere. Find $P(2\le X\le3)$. ([GATE 2025 Set 1 Q.48](#/q/es_m7wybxq9))
>
> Step 1: total area $\int_1^4Cx^2\,dx=C\cdot\dfrac{4^3-1^3}{3}=21C=1$, so $C=\tfrac1{21}$.
>
> Step 2: $P(2\le X\le3)=\dfrac1{21}\cdot\dfrac{3^3-2^3}{3}=\dfrac{19}{63}\approx0.302$.

### The CDF: probability up to $x$

The **cumulative distribution function (CDF)** is $F(x)=P(X\le x)$, the chance of landing at or below $x$. It starts at 0 on the far left, ends at 1 on the far right, and never goes down.

**Discrete $X$:** add up the PMF. The CDF is a staircase that jumps at each possible value by that value's probability. Because of the "$\le$", the jump already counts at the point itself. For the number of heads in two tosses:

$$F(x)=\begin{cases}0,&x<0\\[2pt] \tfrac14,&0\le x<1\\[2pt] \tfrac34,&1\le x<2\\[2pt] 1,&x\ge2\end{cases}$$

So $F(1)=\tfrac34$, not $\tfrac14$, and $F(1.5)=\tfrac34$ as well.

**Continuous $X$:** $F(x)=\int_{-\infty}^{x}f(t)\,dt$ is the area to the left of $x$, and the density is its slope, $f(x)=F'(x)$.

In both cases, $P(a<X\le b)=F(b)-F(a)$.

| To go from | to | do this |
|---|---|---|
| PMF | CDF | add the probabilities of all values up to $x$ |
| CDF | PMF | read off the size of each jump |
| PDF | CDF | integrate from the left end up to $x$ |
| CDF | PDF | differentiate |

> **Example:** $F(x)=x^2$ for $0\le x\le1$ (0 before, 1 after). Then $f(x)=F'(x)=2x$ on $[0,1]$, and $P(0.5<X\le1)=F(1)-F(0.5)=1-0.25=0.75$.

### The median from the CDF

The **median** $m$ is the halfway point: half the probability lies at or below it. For a continuous variable, solve $F(m)=\tfrac12$.

For $f(x)=2x$ on $[0,1]$, $F(m)=m^2=\tfrac12$ gives $m=\tfrac{1}{\sqrt2}\approx0.707$. Its mean (next lesson) is $\tfrac23\approx0.667$, so the median and the mean need not be equal.

When the CDF jumps, it can leap over $\tfrac12$. Then the median is the smallest $m$ with $F(m)\ge\tfrac12$. For example, let $X$ be equally likely to fall anywhere in $[-3,1]$ (a flat density of $\tfrac14$ there), and let $Y=\max(X,0)$. Every negative value of $X$ becomes 0, so $P(Y=0)=P(X\le0)=\tfrac34$, the share of the interval below 0. The CDF of $Y$ is 0 before 0 and jumps to $\tfrac34$ at 0, so the median of $Y$ is 0.

### How GATE asks this

- Which expression gives $P(a<X\le b)$: an area under $f$, never a difference of $f$ values.
- Make a density valid, then integrate over a range.
- Read the CDF of a discrete variable at its jump points.
- Find a median, including for a variable with a jump.
- Build a new variable from old ones (a maximum, an XOR) and find a probability.

**[GATE 2016 Set 1 Q.4](#/q/es_zj2qo4JX6FyDZ76t).** A density on $[a,1]$ equals $\dfrac1{x^2}$, and is 0 outside. Find $a$.

1. Total area: $\displaystyle\int_a^1\frac{dx}{x^2}=\Big[-\frac1x\Big]_a^1=-1+\frac1a$.
2. Set it equal to 1: $\tfrac1a=2$, so $a=\tfrac12$.

**[GATE 2015 Set 3 Q.37](#/q/es_a0uKog20F8yPZBoE).** $X_1,X_2,X_3$ are independent, and each is 0 or 1 with probability $\tfrac12$. Let $Y=X_1X_2\oplus X_3$, where $\oplus$ is XOR. Find $P(Y=0\mid X_3=0)$.

1. XOR with 0 changes nothing, so when $X_3=0$ we have $Y=X_1X_2$.
2. $X_1$ and $X_2$ do not depend on $X_3$, so given $X_3=0$ they are still fair bits, and $P(X_1X_2=1)=\tfrac12\times\tfrac12=\tfrac14$.
3. $P(Y=0\mid X_3=0)=1-\tfrac14=0.75$.

### Quick check

**1.** $P(X=k)=ck$ for $k=1,2,3,4$. Find $c$ and $P(X\ge3)$.

<details><summary>Show answer</summary>

$c(1+2+3+4)=1$ gives $c=\tfrac1{10}$. Then $P(X\ge3)=\tfrac{3+4}{10}=0.7$.

</details>

**2.** $f(x)=3x^2$ on $[0,1]$. Find $P(X\le\tfrac12)$ and the median.

<details><summary>Show answer</summary>

$F(x)=x^3$ on $[0,1]$. So $P(X\le\tfrac12)=\tfrac18$, and $m^3=\tfrac12$ gives $m=(1/2)^{1/3}\approx0.794$.

</details>

**3.** Is $f(x)=2$ on $[0,0.5]$ (and 0 elsewhere) a valid PDF?

<details><summary>Show answer</summary>

Yes. It is never negative and its area is $2\times0.5=1$. A density may exceed 1; only areas are probabilities.

</details>

**4.** $F(x)=1-e^{-2x}$ for $x\ge0$ and $F(x)=0$ for $x<0$. Find $f(x)$ and $P(X>1)$.

<details><summary>Show answer</summary>

$f(x)=F'(x)=2e^{-2x}$ for $x\ge0$. And $P(X>1)=1-F(1)=e^{-2}\approx0.135$.

</details>

**5.** $X$ takes the values 0, 1, 2 with probabilities 0.3, 0.5, 0.2. Find $F(1)$ and the median.

<details><summary>Show answer</summary>

$F(1)=0.3+0.5=0.8$. $F(0)=0.3$ is below $\tfrac12$, and $F(1)=0.8$ is the first value at or above $\tfrac12$, so the median is 1.

</details>

### Practice from GATE

- [GATE 2005 Q.12](#/q/es_cTgDs5jHIlAqB3p2): which expression gives $P(a<X\le b)$.
- [GATE 2012 Q.21](#/q/es_uGPYATjSmLQMOyMr): the CDF of a variable that is $\pm1$.
- [GATE 2017 Set 1 Q.19](#/q/es_Am9CJIIYYycmO0F4): median of $\max(X,0)$ for a normal $X$.

## Expectation and variance {#expectation-variance}

*Find the average value of a random variable, count "expected numbers of things" with linearity and indicators, and measure spread with the variance and standard deviation.*

### The idea: the mean is a long-run average

Roll a fair die many times and average the results. The average settles near 3.5. That number is the **expectation** of the roll (also called the **expected value** or **mean**), written $E[X]$ or $\mu$. It is a weighted average of the values, each weighted by its probability:

$$E[X]=\sum_x x\,P(X=x)\quad\text{(discrete)},\qquad E[X]=\int_{-\infty}^{\infty}x\,f(x)\,dx\quad\text{(continuous)}.$$

For a die, $E[X]=\tfrac{1+2+3+4+5+6}{6}=3.5$. The die never shows 3.5: a mean need not be a possible value. But an average can never be larger than every value, so $X$ always takes some value at least $E[X]$ (and some value at most $E[X]$).

> **Example:** $X$ takes the values 1, 2, 5, 7 with probability $\tfrac16$ each and 3, 4, 6, 8 with probability $\tfrac1{12}$ each. Find $E[X]$. ([GATE 2026 Set 1 Q.48](#/q/es_mmz0z9z3))
>
> $$E[X]=\frac{1+2+5+7}{6}+\frac{3+4+6+8}{12}=\frac{15}{6}+\frac{21}{12}=2.5+1.75=4.25$$

For a continuous example, $f(x)=2x$ on $[0,1]$ gives $E[X]=\int_0^1x\cdot2x\,dx=\tfrac23$.

**Expected value of a function.** To find $E[g(X)]$, weight $g(x)$ by the same probabilities: $E[g(X)]=\sum g(x)P(X=x)$ or $\int g(x)f(x)\,dx$. For a die, $E[X^2]=\tfrac{1+4+9+16+25+36}{6}=\tfrac{91}{6}\approx15.17$, which is not $(E[X])^2=12.25$.

### Linearity: the most useful rule

For any random variables $X$, $Y$ and numbers $a$, $b$:

$$E[aX+b]=aE[X]+b,\qquad E[X+Y]=E[X]+E[Y].$$

The second rule holds **always**, even when $X$ and $Y$ depend on each other. Why: for each outcome, $X+Y$ is just the sum of two numbers, and averaging a sum over all outcomes gives the sum of the two averages.

> **Example:** a paper has 150 questions with 4 options each; a right answer gets 1 mark and a wrong one loses 0.25. 1000 students guess every answer at random. What is the expected total of all their marks? ([GATE 2004 Q.74](#/q/es_CDfDeOTTGfUHlcau))
>
> One guess: $E=\tfrac14(1)+\tfrac34(-0.25)=\tfrac14-\tfrac3{16}=\tfrac1{16}$. By linearity, one student expects $150\times\tfrac1{16}=9.375$, and 1000 students expect $9375$.

### The indicator trick

To find the expected **number** of things that happen, write the count as a sum of **indicators**. An indicator is a variable that is 1 if one particular thing happens and 0 if not. Its mean is $1\cdot p+0\cdot(1-p)=p$, the probability of that thing. So by linearity:

$$E[\text{count}]=\text{sum of the probabilities of the individual things}.$$

No independence is needed. This turns hard counting into one line:

- **Fixed points.** Shuffle cards labelled 1 to $n$. Card $i$ lands in place $i$ with probability $\tfrac1n$, so the expected number of cards in their own place is $n\times\tfrac1n=1$, whatever $n$ is.
- **Inversions.** In a random ordering of $1,\dots,n$, each of the $\binom n2$ pairs of positions is out of order with probability $\tfrac12$, so the expected number of inversions is $\tfrac{n(n-1)}{4}$ ([GATE 2003 Q.61](#/q/go_v2_1.25.1)).
- **Triangles.** In a random graph on 8 vertices where each edge is present with probability $\tfrac12$, each of the $\binom83=56$ triples forms a triangle with probability $\left(\tfrac12\right)^3$, so the expected number of triangles is $56\times\tfrac18=7$ ([GATE 2013 Q.24](#/q/es_XUHQZ8a97Nge2oyf)).
- **Hashing.** Put $n$ keys into $m$ slots uniformly at random (each key equally likely to land in any slot, independently of the others). A given slot expects $n\times\tfrac1m=\tfrac nm$ keys. Each of the $\binom n2$ pairs of keys collides with probability $\tfrac1m$, so the expected number of colliding pairs is $\binom n2\tfrac1m$. Each slot stays empty with probability $\left(1-\tfrac1m\right)^n$, so the expected number of empty slots is $m\left(1-\tfrac1m\right)^n$.

### Variance and standard deviation

The mean tells you where the values are centred. The **variance** tells you how spread out they are: it is the average squared distance from the mean.

$$\operatorname{Var}(X)=E\big[(X-\mu)^2\big]=E[X^2]-(E[X])^2$$

The **standard deviation** is $\sigma=\sqrt{\operatorname{Var}(X)}$; it has the same units as $X$.

Why the shortcut: expand $(X-\mu)^2=X^2-2\mu X+\mu^2$ and use linearity: $E[X^2]-2\mu\cdot\mu+\mu^2=E[X^2]-\mu^2$.

A variance is an average of squares, so it is never negative. Hence $E[X^2]\ge(E[X])^2$ always, with equality only when $X$ is a constant. For a die, $\operatorname{Var}(X)=\tfrac{91}{6}-\tfrac{49}{4}=\tfrac{35}{12}\approx2.92$ and $\sigma\approx1.71$.

$$\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X),\qquad \sigma_{aX+b}=\lvert a\rvert\,\sigma_X$$

Why: adding $b$ moves every value and the mean together, so the distances from the mean do not change. Multiplying by $a$ multiplies every distance by $\lvert a\rvert$, and so every squared distance by $a^2$.

> **Example:** $E[X]=2$ and $\operatorname{Var}(X)=3$. Then $E[X^2]=3+2^2=7$, and $\operatorname{Var}(3-2X)=(-2)^2\times3=12$.

### Two random variables: covariance

The **covariance** measures whether $X$ and $Y$ move together:

$$\operatorname{Cov}(X,Y)=E\big[(X-\mu_X)(Y-\mu_Y)\big]=E[XY]-E[X]\,E[Y].$$

It is positive if $X$ and $Y$ tend to be large together, negative if one tends to be large when the other is small, and it can be any sign.

- **Independent** $X$ and $Y$ have $E[XY]=E[X]E[Y]$, so $\operatorname{Cov}(X,Y)=0$. The reverse is false: if $X$ is $-1$, 0 or 1 with equal chances and $Y=X^2$, then $E[XY]=E[X^3]=0=E[X]E[Y]$, yet $Y$ is completely fixed by $X$.
- $\operatorname{Var}(X\pm Y)=\operatorname{Var}X+\operatorname{Var}Y\pm2\operatorname{Cov}(X,Y)$. For independent variables the covariance is 0, so $\operatorname{Var}(X\pm Y)=\operatorname{Var}X+\operatorname{Var}Y$: variances add even for a difference.
- The **correlation** $\rho=\dfrac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}$ always lies between $-1$ and 1. Equivalently, $(\operatorname{Cov}(X,Y))^2\le\operatorname{Var}X\cdot\operatorname{Var}Y$.
- Without knowing the covariance, you cannot compare $E[XY]$ with $E[X]E[Y]$. You can still use simple bounds: if $0\le Y\le1$ and $X\ge0$, then $XY\le X$ for every outcome, so $E[XY]\le E[X]$.

### Joint distributions, as far as GATE goes

For two continuous variables, a **joint density** $f(x,y)$ gives probabilities as volumes under a surface. The density of $X$ alone (its **marginal**) is $f_X(x)=\int f(x,y)\,dy$, and $X$ and $Y$ are independent exactly when $f(x,y)=f_X(x)\,f_Y(y)$. GATE has used two cases:

- A point chosen uniformly in a rectangle (every point equally likely) has constant joint density $\tfrac{1}{\text{area}}$, and its two coordinates are independent, each spread evenly along its own side. In the rectangle $[0,1]\times[0,2]$, $X$ has density 1 on $[0,1]$ and $Y$ has density $\tfrac12$ on $[0,2]$, so $E[X^2+Y^2]=\int_0^1x^2\,dx+\int_0^2\tfrac{y^2}{2}\,dy=\tfrac13+\tfrac43=\tfrac53$.
- If $T=X+Y$ for independent non-negative $X$ and $Y$ (two program modules run one after the other), the density of $T$ is the **convolution** $f_T(t)=\int_0^t f_X(x)\,f_Y(t-x)\,dx$: to total $t$, the first part takes $x$ and the second must take $t-x$.

### The tail-sum formula

For $X$ taking the values $0,1,2,\dots$:

$$E[X]=\sum_{k\ge1}P(X\ge k).$$

Why: $X$ is the sum of the indicators "$X\ge1$", "$X\ge2$", ..., because a value such as $X=3$ switches on exactly the first three. Then use linearity.

> **Example:** two dice are rolled. The larger number is below $k$ only when both dice are, which has probability $\left(\tfrac{k-1}{6}\right)^2$. So the expected larger number is $\sum_{k=1}^{6}P(\max\ge k)=\sum_{k=1}^{6}\left(1-\left(\tfrac{k-1}{6}\right)^2\right)=6-\tfrac{55}{36}=\tfrac{161}{36}\approx4.47$.

### How GATE asks this

- Find $E[X]$ from a table, or as a plain average (word lengths).
- Linearity with marks; counting expected numbers with indicators.
- The variance identity and its sign; true or false statements about covariance.
- $E$ of a function of a uniform point.
- The expectation of a process in stages.

**[GATE 2015 Set 1 GA.10](#/q/es_GESJtHvrBKNoL7ZV).** A student passes maths, physics and chemistry with probabilities $m$, $p$, $c$. She passes at least one with probability 0.75, at least two with 0.5 and exactly two with 0.4. Which is true: I. $m+p+c=\tfrac{27}{20}$; II. $m+p+c=\tfrac{13}{20}$; III. $mpc=\tfrac1{10}$?

1. Let $N$ be the number of subjects passed. Then $N$ is the sum of three indicators, so $E[N]=m+p+c$ with no independence needed.
2. Tail sum: $E[N]=P(N\ge1)+P(N\ge2)+P(N\ge3)$, where $P(N\ge3)=P(N=3)=0.5-0.4=0.1$.
3. $m+p+c=0.75+0.5+0.1=1.35=\tfrac{27}{20}$. So I is true and II is false.
4. III would need independence, which is not given. In fact it is impossible: three numbers with sum 1.35 have their largest product when all equal 0.45, and $0.45^3\approx0.091<0.1$. Only I is true.

**[GATE 2006 Q.18](#/q/go_v1_7.8.3).** The set $\{2^1,2^2,\dots,2^n\}$ is sampled by keeping each element independently with probability $\tfrac12$. What is the expected value of the smallest number in the sample?

1. The smallest number is $2^i$ when $2^1,\dots,2^{i-1}$ are all left out and $2^i$ is kept: probability $\left(\tfrac12\right)^{i-1}\cdot\tfrac12=2^{-i}$.
2. $E=\sum_{i=1}^{n}2^i\cdot2^{-i}=\sum_{i=1}^{n}1=n$. (An empty sample has no smallest number and adds nothing.)

### Quick check

**1.** $X$ is the number of heads in two fair tosses. Find $E[X]$ and $\operatorname{Var}(X)$.

<details><summary>Show answer</summary>

$E[X]=0\cdot\tfrac14+1\cdot\tfrac12+2\cdot\tfrac14=1$. $E[X^2]=0+\tfrac12+4\cdot\tfrac14=1.5$, so $\operatorname{Var}(X)=1.5-1^2=0.5$.

</details>

**2.** $E[X]=2$ and $\operatorname{Var}(X)=3$. Find $E[(X+1)^2]$.

<details><summary>Show answer</summary>

$E[X^2]=3+4=7$, so $E[(X+1)^2]=E[X^2]+2E[X]+1=7+4+1=12$.

</details>

**3.** Ten keys are hashed uniformly into 10 slots. What is the expected number of empty slots?

<details><summary>Show answer</summary>

Each slot is empty with probability $0.9^{10}$, so the expected number is $10\times0.9^{10}\approx3.49$.

</details>

**4.** Question A (10 marks) is answered correctly with probability 0.8 and question B (20 marks) with probability 0.5, independently. The second question's marks count only if the first is right. Which order gives more expected marks? ([GATE 2021 Set 2 Q.29](#/q/es_40599uckwrzvla7))

<details><summary>Show answer</summary>

A first: $0.8\times(10+0.5\times20)=16$. B first: $0.5\times(20+0.8\times10)=14$. So attempt A first, for 16 expected marks.

</details>

**5.** $X$ is $-1$, 0 or 1 with equal chances, and $Y=X^2$. Show that $\operatorname{Cov}(X,Y)=0$ but $X$ and $Y$ are not independent.

<details><summary>Show answer</summary>

$E[X]=0$ and $E[XY]=E[X^3]=0$, so $\operatorname{Cov}=0-0=0$. But $P(Y=0)=\tfrac13$ while $P(Y=0\mid X=0)=1$, so they are not independent.

</details>

### Practice from GATE

- [GATE 2014 Set 2 Q.2](#/q/es_SAUWG5k1Zpy3ipio): expected length of a word drawn from a box.
- [GATE 1999 Q.1.1](#/q/es_x0NS2kmilbhSsaKh): what $E[X]=5$ guarantees.
- [GATE 2011 Q.18](#/q/es_EhM9OlIT4Eom8Bzc): the sign of $E[X^2]-(E[X])^2$.
- [GATE 2022 Q.6](#/q/es_1kzybldpy): expected number of keys in a hash slot.
- [GATE 2004 Q.80](#/q/es_2kvuHnYcIZNOUHE6): a uniform point in a rectangle.
- [GATE 2021 Set 1 Q.35](#/q/es_40599uckwrzo12n): true or false about covariance.
- [GATE 2024 Set 2 Q.34](#/q/es_lwug6pui): comparing $E[xy]$ with $E[x]$ and $E[x]E[y]$.
- [GATE 2003 Q.60](#/q/go_v1_7.14.1): the density of a total time (convolution).

## Discrete distributions {#discrete-distributions}

*Recognise the Bernoulli, binomial, geometric, Poisson and discrete uniform patterns, and use their formulas, means and variances.*

### The idea

Many experiments follow one of a handful of standard patterns, called **distributions**. Once you recognise the story, the formula, the mean and the variance come for free. For each pattern below you get the story, the formula, the mean and variance, and an example.

### Bernoulli: one yes-or-no trial

**Story:** a single trial that succeeds with probability $p$, such as one coin toss or one bit that may flip. Let $X=1$ for success and $X=0$ for failure.

$$P(X=1)=p,\quad P(X=0)=1-p,\qquad E[X]=p,\quad \operatorname{Var}(X)=p(1-p).$$

Why: $E[X]=1\cdot p+0\cdot(1-p)=p$, and $E[X^2]=p$ too, so $\operatorname{Var}(X)=p-p^2$. This is exactly the indicator from the previous lesson.

### Binomial: successes in $n$ trials

**Story:** $n$ independent trials, each a success with the same probability $p$; $X$ counts the successes. We write $X\sim\text{Bin}(n,p)$.

$$P(X=k)=\binom nk p^k(1-p)^{n-k},\quad k=0,1,\dots,n.\qquad E[X]=np,\quad\operatorname{Var}(X)=np(1-p).$$

Why the formula: one particular pattern with $k$ successes (say the first $k$ trials succeed) has probability $p^k(1-p)^{n-k}$, and there are $\binom nk$ patterns, one for each choice of which trials succeed. Why the mean and variance: $X$ is a sum of $n$ independent Bernoulli variables, and means add, and so do variances of independent variables.

> **Example:** a die is rolled 3 times. What is the probability that exactly one roll is odd? ([GATE 1998 Q.1.1](#/q/es_Q0jsSZWbp1Xh2R3m))
>
> Each roll is odd with probability $\tfrac12$, so $P=\binom31\left(\tfrac12\right)^1\left(\tfrac12\right)^2=\tfrac38$.

> **Example:** a coin with $P(\text{head})=0.4$ is tossed 1000 times. The standard deviation of the number of heads is $\sqrt{1000\times0.4\times0.6}=\sqrt{240}\approx15.49$ ([GATE 2021 Set 2 Q.22](#/q/es_40599uckwrzvsqy)).

The binomial hides inside many CS questions. The number of positions where two random $n$-bit strings differ is $\text{Bin}(n,\tfrac12)$. If each of $n$ stations transmits with probability $p$, independently, the chance that exactly one transmits is $\binom n1p(1-p)^{n-1}=np(1-p)^{n-1}$.

> **GATE tip:** if a question gives $\sum_j p_jz^j=(1-\beta+\beta z)^N$, expanding with the binomial theorem shows it is $\text{Bin}(N,\beta)$, so the mean is $N\beta$. In general, the mean is the derivative of $\sum_j p_jz^j$ at $z=1$, because differentiating gives $\sum_j j\,p_jz^{j-1}$, which at $z=1$ is $\sum_j j\,p_j=E[X]$.

### Geometric: trials until the first success

**Story:** repeat independent trials, each a success with probability $p$, until the first success. $X$ is the number of trials, including the successful one.

$$P(X=k)=(1-p)^{k-1}p,\qquad P(X>k)=(1-p)^k,\qquad E[X]=\frac1p,\qquad\operatorname{Var}(X)=\frac{1-p}{p^2}.$$

The first formula is "$k-1$ failures, then a success"; the second is "the first $k$ trials all fail".

Why the mean is $\tfrac1p$: one trial is always used, and with probability $1-p$ it fails and you are back at the start. So $E=1+(1-p)E$, which gives $pE=1$. A fair die needs 6 rolls on average to show a six.

**Memoryless.** $P(X>s+t\mid X>s)=P(X>t)$, because $\dfrac{(1-p)^{s+t}}{(1-p)^s}=(1-p)^t$. Ten failures in a row do not make a success "due": the coin has no memory.

> **Example:** two players roll a die each; a trial is a tie with probability $\tfrac16$, and ties are replayed. What is the probability that someone wins on exactly the third trial? ([GATE 2018 Q.15](#/q/es_aanX71JsQwsaGgEW))
>
> Two ties, then a decisive trial: $\left(\tfrac16\right)^2\times\tfrac56=\tfrac{5}{216}\approx0.023$.

> **Watch out:** some books count the failures before the first success instead, which has mean $\tfrac{1-p}{p}$. GATE questions so far count all trials including the success, but read each question carefully.

**Collecting every type.** How many rolls does it take to see all 6 faces of a die? Once you have seen $i$ different faces, each roll shows a new one with probability $\tfrac{6-i}{6}$, so the wait for the next new face is geometric with mean $\tfrac{6}{6-i}$. Adding these waits by linearity gives $\tfrac66+\tfrac65+\tfrac64+\tfrac63+\tfrac62+\tfrac61=6\left(1+\tfrac12+\cdots+\tfrac16\right)=14.7$ rolls. For $n$ types, the expected wait is $n\left(1+\tfrac12+\cdots+\tfrac1n\right)$.

### Poisson: counts of rare events in a window

**Story:** events happen at random at a steady average rate (requests to a server, cars at a junction, errors in a long file). $X$ is the number of events in a fixed window, and $\lambda$ is the average number in that window.

$$P(X=k)=\frac{e^{-\lambda}\lambda^k}{k!},\quad k=0,1,2,\dots\qquad E[X]=\operatorname{Var}(X)=\lambda.$$

- **Scale $\lambda$ to the window.** A rate of 20 per hour means $\lambda=20\times\tfrac{45}{60}=15$ for a 45-minute window.
- **Limit of the binomial.** If $n$ is large and $p$ is small, $\text{Bin}(n,p)$ is close to Poisson with $\lambda=np$. For 1000 bits, each wrong with probability 0.002, $\lambda=2$ and $P(\text{no error})\approx e^{-2}\approx0.135$ (the exact $0.998^{1000}$ is $0.1351$).
- **Sums.** If $X$ and $Y$ are independent Poisson with means $\lambda_1$ and $\lambda_2$, then $X+Y$ is Poisson with mean $\lambda_1+\lambda_2$: counting two sources together just adds the rates.

> **Example:** $X$ is Poisson with mean 5. Find $E[(X+2)^2]$. ([GATE 2017 Set 2 Q.48](#/q/es_LKHVWb1wHjqBqihO))
>
> Mean and variance are both 5, so $E[X^2]=\operatorname{Var}(X)+(E[X])^2=5+25=30$. Then $E[(X+2)^2]=E[X^2]+4E[X]+4=30+20+4=54$.

### Discrete uniform

**Story:** $X$ is equally likely to be any of $1,2,\dots,n$, like a fair die or a random index.

$$P(X=k)=\frac1n,\qquad E[X]=\frac{n+1}{2},\qquad\operatorname{Var}(X)=\frac{n^2-1}{12}.$$

For a die this gives 3.5 and $\tfrac{35}{12}$, as in the previous lesson. For the values $a,a+1,\dots,b$, the mean is $\tfrac{a+b}{2}$ and the variance uses $n=b-a+1$.

### Hypergeometric: drawing without replacement

**Story:** draw $n$ items **without replacement** from $N$ items, of which $K$ are "successes"; $X$ counts the successes drawn.

$$P(X=k)=\frac{\binom Kk\binom{N-K}{n-k}}{\binom Nn},\qquad E[X]=\frac{nK}{N}.$$

The mean comes from indicators: each draw is a success with probability $\tfrac KN$, even though the draws are not independent. The computer-inspection question in the counting lesson is this pattern; with replacement it would be binomial.

| Distribution | Story | $P(X=k)$ | Mean | Variance |
|---|---|---|---|---|
| Bernoulli$(p)$ | one trial | $p^k(1-p)^{1-k}$, $k=0,1$ | $p$ | $p(1-p)$ |
| Binomial$(n,p)$ | successes in $n$ trials | $\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Geometric$(p)$ | trials to first success | $(1-p)^{k-1}p$, $k\ge1$ | $1/p$ | $(1-p)/p^2$ |
| Poisson$(\lambda)$ | count of rare events | $e^{-\lambda}\lambda^k/k!$ | $\lambda$ | $\lambda$ |
| Uniform on $1..n$ | equally likely values | $1/n$ | $(n+1)/2$ | $(n^2-1)/12$ |

### How GATE asks this

- "Exactly $k$" or "at least $k$" successes in $n$ independent trials: coins, dice, bits, stations.
- The mean or standard deviation of a binomial count.
- The expected number of trials until something happens: tosses, retransmissions, random probes.
- Poisson counts with the rate scaled to the window, and expectations of a Poisson variable.

**[GATE 2013 Q.2](#/q/es_VAwA2uFIL2vseGMj).** The number of cars passing a junction per minute is Poisson with mean 3. What is the probability of fewer than 3 cars in a given minute?

1. "Fewer than 3" means $k=0,1,2$.
2. $P=e^{-3}\left(\dfrac{3^0}{0!}+\dfrac{3^1}{1!}+\dfrac{3^2}{2!}\right)=e^{-3}\left(1+3+\dfrac92\right)=\dfrac{17}{2e^3}\approx0.423$.

**[GATE IT 2005 Q.32](#/q/es_9STA1AhYEmyoGw1t).** A fair coin is tossed until two successive tosses give the same result. What is the expected number of tosses?

1. The first toss can never end the game on its own.
2. After it, each new toss matches the toss before it with probability $\tfrac12$, whatever happened earlier. So the number of tosses after the first is geometric with $p=\tfrac12$, with mean $\tfrac{1}{1/2}=2$.
3. Expected total: $1+2=3$.

### Quick check

**1.** A fair coin is tossed 10 times. Find $P(\text{exactly 3 heads})$, and the mean and variance of the number of heads.

<details><summary>Show answer</summary>

$P=\binom{10}{3}\big/2^{10}=\tfrac{120}{1024}\approx0.117$. Mean $np=5$, variance $np(1-p)=2.5$.

</details>

**2.** A die is rolled until a six appears. What is the expected number of rolls? What is the probability that more than 3 rolls are needed?

<details><summary>Show answer</summary>

Geometric with $p=\tfrac16$: mean 6. More than 3 rolls means the first 3 all fail: $\left(\tfrac56\right)^3=\tfrac{125}{216}\approx0.579$.

</details>

**3.** $X\sim\text{Bin}(n,p)$ has mean 6 and variance 4.2. Find $n$ and $p$.

<details><summary>Show answer</summary>

$\dfrac{np(1-p)}{np}=1-p=\dfrac{4.2}{6}=0.7$, so $p=0.3$ and $n=\dfrac{6}{0.3}=20$.

</details>

**4.** Calls arrive at 4 per hour, following a Poisson distribution. Find the probability of no calls, and of at least 2 calls, in 30 minutes.

<details><summary>Show answer</summary>

$\lambda=4\times\tfrac12=2$. No calls: $e^{-2}\approx0.135$. At least 2: $1-e^{-2}(1+2)=1-3e^{-2}\approx0.594$.

</details>

**5.** Each transmission of a packet fails with probability 0.2, independently, and the packet is resent until it gets through. What is the average number of transmissions needed for 100 packets? ([GATE IT 2006 Q.68](#/q/go_v3_2.33.6))

<details><summary>Show answer</summary>

Each packet needs a geometric number of attempts with $p=0.8$, mean $\tfrac1{0.8}=1.25$. For 100 packets: $125$.

</details>

### Practice from GATE

- [GATE 2004 Q.25](#/q/es_o29sFw3ETK2PZ8gF): two heads and two tails in four tosses.
- [GATE 2026 Set 2 GA.3](#/q/es_mmz0zgbo): three cloudy days out of four.
- [GATE IT 2006 Q.22](#/q/es_9z30jmajAyAFVafD): the mean number of tosses until the first head.
- [GATE 2004 Q.78](#/q/es_vq6PsDrPZQXYV2pE): Hamming distance between random bit strings.
- [GATE 2007 Q.65](#/q/es_0Ot0o0VzQNIcz4dc): exactly one of $n$ stations transmits.
- [GATE 2002 Q.2.10](#/q/es_SVJgUzQlr1rIuEEH): expected probes of a random search.
- [GATE IT 2007 Q.57](#/q/go_v1_7.12.5): Poisson with the rate scaled to 45 minutes.
- [GATE 2017 Set 2 Q.31](#/q/es_Y2rYqhxeHosUHk1G): the mean from a generating function.

## Continuous distributions {#continuous-distributions}

*Use the uniform, exponential and normal distributions: when each one applies, how to get probabilities and means from it, and the shortcuts GATE rewards.*

### The idea

Three shapes cover almost every GATE question on continuous variables:

- **flat** (uniform): every value in a range is equally likely, like a random cut point on a stick;
- **decaying** (exponential): waiting times, like the time until the next request reaches a server;
- **bell-shaped** (normal): measurements that cluster around an average, like heights or exam marks.

### Uniform: every point equally likely

$X$ is **uniform** on $[a,b]$, written $X\sim U(a,b)$, if its density is flat:

$$f(x)=\frac{1}{b-a}\ \text{ for } a\le x\le b,\qquad E[X]=\frac{a+b}{2},\qquad \operatorname{Var}(X)=\frac{(b-a)^2}{12}.$$

Probabilities are length ratios: for $[c,d]$ inside $[a,b]$, $P(c\le X\le d)=\dfrac{d-c}{b-a}$. If a bus arrives at a uniform time between 8:00 and 8:30, the chance that it comes between 8:10 and 8:15 is $\tfrac{5}{30}=\tfrac16$.

**Expected value of a function.** $E[g(U)]=\dfrac{1}{b-a}\displaystyle\int_a^b g(u)\,du$. When $g$ changes formula partway, split the integral there.

> **Example:** a stick of length 1 is broken at a uniformly random point. What is the expected length of the shorter piece? ([GATE 2014 Set 1 Q.2](#/q/es_qkZjCzAz5ZEQzwCa))
>
> If the cut is at $u$, the shorter piece is $u$ when $u<\tfrac12$ and $1-u$ otherwise:
>
> $$E=\int_0^{1/2}u\,du+\int_{1/2}^1(1-u)\,du=\frac18+\frac18=\frac14.$$

**Two independent uniforms.** The pair $(X,Y)$ is a uniform point in a rectangle, so probabilities are area ratios.

**Example ([GATE 1998 Q.3a](#/q/go_v1_7.19.1)).** Two friends each arrive at a uniform time between 4:00 and 5:00 pm, independently, and each waits 10 minutes for the other. What is the probability that they do not meet?

1. Measure arrival times $X$, $Y$ in minutes after 4:00. The point $(X,Y)$ is uniform in a $60\times60$ square of area 3600.
2. The one who comes first waits 10 minutes, so they meet exactly when the later one arrives within 10 minutes: $\lvert X-Y\rvert\le10$, a band along the diagonal.
3. The region where they miss is two right triangles with legs $60-10=50$, of total area $2\times\tfrac12\times50\times50=2500$.
4. $P(\text{not meet})=\dfrac{2500}{3600}=\dfrac{25}{36}\approx0.69$.

**Largest and smallest of $n$ uniforms.** For independent $U_1,\dots,U_n\sim U(0,1)$, the largest is at most $x$ only if every one is, so $P(\max\le x)=x^n$. Its density is the derivative $nx^{n-1}$, which gives $E[\max]=\int_0^1x\cdot nx^{n-1}\,dx=\tfrac{n}{n+1}$. By symmetry (replace each $U_i$ by $1-U_i$), $E[\min]=\tfrac{1}{n+1}$. With $n=2$: $\tfrac23$ and $\tfrac13$.

### Exponential: waiting times

**Story:** the waiting time until the next event, when events happen at random at a steady **rate** $\lambda$ per unit time: the lifetime of a component, the time until the next request.

$$f(x)=\lambda e^{-\lambda x}\ (x\ge0),\qquad P(X>x)=e^{-\lambda x},\qquad F(x)=1-e^{-\lambda x}.$$

$$E[X]=\frac1\lambda,\qquad\operatorname{Var}(X)=\frac1{\lambda^2},\qquad\text{median}=\frac{\ln2}{\lambda}\approx\frac{0.693}{\lambda}.$$

The mean waiting time is one over the rate: 4 requests per minute means a quarter of a minute on average. The median comes from solving $e^{-\lambda m}=\tfrac12$.

- **Memoryless:** $P(X>s+t\mid X>s)=\dfrac{e^{-\lambda(s+t)}}{e^{-\lambda s}}=e^{-\lambda t}=P(X>t)$. A component that has already lasted $s$ hours is as good as new.
- **Beyond the mean:** $P(X>\tfrac1\lambda)=e^{-1}\approx0.37$ for every exponential, whatever $\lambda$ is.
- **The first of several clocks:** for independent exponentials, $\min(X,Y)>t$ only if both exceed $t$, which has probability $e^{-\lambda_1t}e^{-\lambda_2t}=e^{-(\lambda_1+\lambda_2)t}$. So the minimum is exponential with rate $\lambda_1+\lambda_2$: **rates add**.
- **Link to Poisson:** if events arrive as a Poisson stream with rate $\lambda$, "the wait exceeds $t$" means "no events in $[0,t]$", which has probability $e^{-\lambda t}$. So the waiting time is exponential. Also, "no events in $t+h$" means none in the first $t$ and none in the next $h$, so $P_0(t+h)=P_0(t)\,P_0(h)$.

> **Watch out:** "exponential with parameter 2" usually means rate 2 (mean $\tfrac12$), but some questions give the mean instead. Check which one before using $e^{-\lambda x}$.

### Normal: the bell curve

$X$ is **normal** with mean $\mu$ and variance $\sigma^2$, written $X\sim N(\mu,\sigma^2)$, if

$$f(x)=\frac{1}{\sigma\sqrt{2\pi}}\,e^{-(x-\mu)^2/(2\sigma^2)},\qquad -\infty<x<\infty.$$

The curve is symmetric about $\mu$, so the mean, median and mode are all $\mu$. The standard deviation $\sigma$ sets the width.

**Reading $\mu$ and $\sigma$ off a formula.** Match the pieces. For $f(x)=\dfrac{1}{2\sqrt{2\pi}}e^{-(x-1)^2/8}$, the centre is $\mu=1$, and $2\sigma^2=8$ gives $\sigma=2$ (which matches the $2$ in front).

**Standardising.** $Z=\dfrac{X-\mu}{\sigma}$ is the **standard normal** $N(0,1)$, so every normal question becomes a question about $Z$, "how many standard deviations from the mean". Symmetry gives $P(Z\le-z)=P(Z\ge z)$.

<figure class="fig"><svg viewBox="0 0 330 170" role="img" aria-label="Normal bell curve centred at the mean; the band within one standard deviation is shaded dark and holds about 68 percent; the bands out to two standard deviations are shaded lighter">
<line x1="10" y1="135" x2="320" y2="135" stroke="currentColor" stroke-opacity="0.4"/>
<path d="M75.0 135 L75.0 120.1 L76.1 119.4 L77.2 118.6 L78.4 117.8 L79.5 116.9 L80.6 116.0 L81.8 115.1 L82.9 114.2 L84.0 113.2 L85.1 112.2 L86.2 111.2 L87.4 110.2 L88.5 109.1 L89.6 108.0 L90.8 106.8 L91.9 105.6 L93.0 104.4 L94.1 103.2 L95.2 101.9 L96.4 100.6 L97.5 99.3 L98.6 97.9 L99.8 96.6 L100.9 95.1 L102.0 93.7 L103.1 92.3 L104.2 90.8 L105.4 89.3 L106.5 87.7 L107.6 86.2 L108.8 84.6 L109.9 83.1 L111.0 81.5 L112.1 79.8 L113.2 78.2 L114.4 76.6 L115.5 74.9 L116.6 73.3 L117.8 71.6 L118.9 69.9 L120.0 68.3 L120.0 135 Z" fill="var(--accent)" fill-opacity="0.15"/>
<path d="M210.0 135 L210.0 68.3 L211.1 69.9 L212.2 71.6 L213.4 73.3 L214.5 74.9 L215.6 76.6 L216.8 78.2 L217.9 79.8 L219.0 81.5 L220.1 83.1 L221.2 84.6 L222.4 86.2 L223.5 87.7 L224.6 89.3 L225.8 90.8 L226.9 92.3 L228.0 93.7 L229.1 95.1 L230.2 96.6 L231.4 97.9 L232.5 99.3 L233.6 100.6 L234.8 101.9 L235.9 103.2 L237.0 104.4 L238.1 105.6 L239.2 106.8 L240.4 108.0 L241.5 109.1 L242.6 110.2 L243.8 111.2 L244.9 112.2 L246.0 113.2 L247.1 114.2 L248.2 115.1 L249.4 116.0 L250.5 116.9 L251.6 117.8 L252.8 118.6 L253.9 119.4 L255.0 120.1 L255.0 135 Z" fill="var(--accent)" fill-opacity="0.15"/>
<path d="M120.0 135 L120.0 68.3 L122.2 64.9 L124.5 61.6 L126.8 58.4 L129.0 55.1 L131.2 52.0 L133.5 48.9 L135.8 45.9 L138.0 43.1 L140.2 40.4 L142.5 37.9 L144.8 35.6 L147.0 33.5 L149.2 31.5 L151.5 29.8 L153.8 28.4 L156.0 27.2 L158.2 26.2 L160.5 25.5 L162.8 25.1 L165.0 25.0 L167.2 25.1 L169.5 25.5 L171.8 26.2 L174.0 27.2 L176.2 28.4 L178.5 29.8 L180.8 31.5 L183.0 33.5 L185.2 35.6 L187.5 37.9 L189.8 40.4 L192.0 43.1 L194.2 45.9 L196.5 48.9 L198.8 52.0 L201.0 55.1 L203.2 58.4 L205.5 61.6 L207.8 64.9 L210.0 68.3 L210.0 135 Z" fill="var(--accent)" fill-opacity="0.35"/>
<path d="M21.0 134.3 L23.2 134.2 L25.5 134.1 L27.8 133.9 L30.0 133.8 L32.2 133.6 L34.5 133.4 L36.8 133.1 L39.0 132.8 L41.2 132.5 L43.5 132.1 L45.7 131.7 L48.0 131.3 L50.2 130.7 L52.5 130.2 L54.7 129.5 L57.0 128.8 L59.2 128.0 L61.5 127.2 L63.8 126.2 L66.0 125.2 L68.2 124.1 L70.5 122.9 L72.8 121.5 L75.0 120.1 L77.2 118.6 L79.5 116.9 L81.8 115.1 L84.0 113.2 L86.2 111.2 L88.5 109.1 L90.8 106.8 L93.0 104.4 L95.2 101.9 L97.5 99.3 L99.7 96.6 L102.0 93.7 L104.2 90.8 L106.5 87.7 L108.8 84.6 L111.0 81.5 L113.2 78.2 L115.5 74.9 L117.7 71.6 L120.0 68.3 L122.2 64.9 L124.5 61.6 L126.8 58.4 L129.0 55.1 L131.2 52.0 L133.5 48.9 L135.8 45.9 L138.0 43.1 L140.2 40.4 L142.5 37.9 L144.8 35.6 L147.0 33.5 L149.2 31.5 L151.5 29.8 L153.8 28.4 L156.0 27.2 L158.2 26.2 L160.5 25.5 L162.8 25.1 L165.0 25.0 L167.2 25.1 L169.5 25.5 L171.8 26.2 L174.0 27.2 L176.2 28.4 L178.5 29.8 L180.8 31.5 L183.0 33.5 L185.2 35.6 L187.5 37.9 L189.8 40.4 L192.0 43.1 L194.2 45.9 L196.5 48.9 L198.8 52.0 L201.0 55.1 L203.2 58.4 L205.5 61.6 L207.8 64.9 L210.0 68.3 L212.2 71.6 L214.5 74.9 L216.8 78.2 L219.0 81.5 L221.2 84.6 L223.5 87.7 L225.8 90.8 L228.0 93.7 L230.2 96.6 L232.5 99.3 L234.8 101.9 L237.0 104.4 L239.2 106.8 L241.5 109.1 L243.8 111.2 L246.0 113.2 L248.3 115.1 L250.5 116.9 L252.8 118.6 L255.0 120.1 L257.2 121.5 L259.5 122.9 L261.8 124.1 L264.0 125.2 L266.2 126.2 L268.5 127.2 L270.8 128.0 L273.0 128.8 L275.2 129.5 L277.5 130.2 L279.8 130.7 L282.0 131.3 L284.2 131.7 L286.5 132.1 L288.8 132.5 L291.0 132.8 L293.2 133.1 L295.5 133.4 L297.8 133.6 L300.0 133.8 L302.2 133.9 L304.5 134.1 L306.8 134.2 L309.0 134.3" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
<line x1="75.0" y1="135" x2="75.0" y2="139" stroke="currentColor" stroke-opacity="0.6"/>
<text x="75.0" y="152" font-size="11" fill="currentColor" text-anchor="middle">μ−2σ</text>
<line x1="120.0" y1="135" x2="120.0" y2="139" stroke="currentColor" stroke-opacity="0.6"/>
<text x="120.0" y="152" font-size="11" fill="currentColor" text-anchor="middle">μ−σ</text>
<line x1="165.0" y1="135" x2="165.0" y2="139" stroke="currentColor" stroke-opacity="0.6"/>
<text x="165.0" y="152" font-size="11" fill="currentColor" text-anchor="middle">μ</text>
<line x1="210.0" y1="135" x2="210.0" y2="139" stroke="currentColor" stroke-opacity="0.6"/>
<text x="210.0" y="152" font-size="11" fill="currentColor" text-anchor="middle">μ+σ</text>
<line x1="255.0" y1="135" x2="255.0" y2="139" stroke="currentColor" stroke-opacity="0.6"/>
<text x="255.0" y="152" font-size="11" fill="currentColor" text-anchor="middle">μ+2σ</text>
<text x="165.0" y="113" font-size="13" fill="currentColor" text-anchor="middle">68%</text>
<text x="97.5" y="129" font-size="10" fill="currentColor" text-anchor="middle">13.5%</text>
<text x="232.5" y="129" font-size="10" fill="currentColor" text-anchor="middle">13.5%</text>
</svg><figcaption>About 68% of a normal distribution lies within one standard deviation of the mean, and about 95% ($68+13.5+13.5$) within two.</figcaption></figure>

**The 68–95–99.7 rule.** About 68% of the values lie within $\sigma$ of $\mu$, 95% within $2\sigma$, and 99.7% within $3\sigma$. If marks are $N(60,10^2)$, then 80 is $z=2$; 95% lie within $2\sigma$, so about 2.5% score above 80 (tables give 2.3%).

**Sums.** If $X\sim N(\mu_1,\sigma_1^2)$ and $Y\sim N(\mu_2,\sigma_2^2)$ are independent, then $X+Y\sim N(\mu_1+\mu_2,\ \sigma_1^2+\sigma_2^2)$. Variances add, not standard deviations: $N(1,4)+N(2,5)$ is $N(3,9)$, with standard deviation 3.

> **Example:** $X\sim N(1,4)$ and $Y\sim N(-1,\sigma^2)$ with $P(X\le-1)=P(Y\ge2)$. Find $\sigma$. ([GATE 2008 Q.29](#/q/es_0no5zJz3mZhNt15J))
>
> Step 1: $X$ has $\sigma_X=2$, so $-1$ is $\tfrac{-1-1}{2}=-1$ standard deviation from its mean: $P(X\le-1)=P(Z\le-1)=P(Z\ge1)$.
>
> Step 2: $P(Y\ge2)=P\big(Z\ge\tfrac{2-(-1)}{\sigma}\big)=P\big(Z\ge\tfrac3\sigma\big)$.
>
> Step 3: equal probabilities need $\tfrac3\sigma=1$, so $\sigma=3$.

### Two general bounds: Markov and Chebyshev

These hold for **every** distribution, so they are rough, but they need only the mean (and the standard deviation):

- **Markov:** if $X\ge0$, then $P(X\ge a)\le\dfrac{E[X]}{a}$. If the average response time is 2 seconds, at most $\tfrac{2}{10}=20\%$ of requests can take 10 seconds or more.
- **Chebyshev:** $P(\lvert X-\mu\rvert\ge k\sigma)\le\dfrac1{k^2}$. With $k=2$, at most 25% of any distribution lies $2\sigma$ or further from the mean; for a normal the true figure is about 5%.

GATE CSE has not asked these directly so far, but know the statements.

### How GATE asks this

- Uniform: a probability as a length, or as an area for two uniforms.
- The expected value of a function of a uniform: the shorter piece, the piece containing a point.
- Exponential: tail probabilities, memorylessness, the chance of exceeding the mean, the minimum of several.
- Normal: standardise and use symmetry; recognise $\mu$ and $\sigma$ in a formula.

**[GATE IT 2004 Q.33](#/q/es_kCBhZXhTjdmq4KAQ).** $X$ and $Y$ are independent exponential variables with means $\alpha$ and $\beta$. What is the mean of $Z=\min(X,Y)$?

1. The rates are $\tfrac1\alpha$ and $\tfrac1\beta$, so $P(Z>z)=e^{-z/\alpha}e^{-z/\beta}$.
2. $Z$ is exponential with rate $\tfrac1\alpha+\tfrac1\beta=\tfrac{\alpha+\beta}{\alpha\beta}$.
3. $E[Z]=\dfrac{\alpha\beta}{\alpha+\beta}$. (Check: with $\alpha=\beta$ this is $\tfrac\alpha2$, smaller than either mean, as it should be.)

**[GATE 2025 Set 2 Q.55](#/q/es_m80a3wxi).** The interval $(0,1)$ is cut at a uniformly random point $U$. What is the expected length of the piece that contains 0.4?

1. If $U>0.4$, the point 0.4 is in $(0,U)$, of length $U$. If $U<0.4$, it is in $(U,1)$, of length $1-U$.
2. $E=\displaystyle\int_0^{0.4}(1-u)\,du+\int_{0.4}^{1}u\,du=(0.4-0.08)+\frac{1-0.16}{2}=0.32+0.42=0.74$.

### Quick check

**1.** $X\sim U(0,10)$. Find $P(3<X<7)$, $E[X]$ and $\operatorname{Var}(X)$.

<details><summary>Show answer</summary>

$P=\tfrac{7-3}{10}=0.4$. $E[X]=5$ and $\operatorname{Var}(X)=\tfrac{10^2}{12}\approx8.33$.

</details>

**2.** A bulb's lifetime is exponential with mean 1000 hours. Find the probability that it lasts more than 2000 hours. Given that it has lasted 500 hours, find the probability that it lasts at least 1000 hours more.

<details><summary>Show answer</summary>

$\lambda=\tfrac1{1000}$, so $P(X>2000)=e^{-2}\approx0.135$. By memorylessness the second answer is $P(X>1000)=e^{-1}\approx0.368$.

</details>

**3.** $X\sim N(50,25)$. Roughly what are $P(40<X<60)$ and $P(X>60)$?

<details><summary>Show answer</summary>

$\sigma=5$, so 40 and 60 are $\mu\pm2\sigma$: $P(40<X<60)\approx0.95$. The remaining 5% splits equally, so $P(X>60)\approx0.025$.

</details>

**4.** What is the expected value of the largest of three independent $U(0,1)$ numbers?

<details><summary>Show answer</summary>

$\tfrac{n}{n+1}$ with $n=3$, which is $\tfrac34$.

</details>

**5.** Two servers finish their jobs after independent exponential times with rates 2 and 3 per hour. What is the expected time until the first one finishes?

<details><summary>Show answer</summary>

The minimum is exponential with rate $2+3=5$ per hour, so the mean is $\tfrac15$ hour, which is 12 minutes.

</details>

### Practice from GATE

- [GATE 2026 Set 2 Q.4](#/q/es_mmz0zjjj): recognise a normal density from its formula.
- [GATE 2021 Set 1 Q.18](#/q/es_40599udkwrzoaoj): an exponential lifetime exceeding its mean.
- [GATE 2019 Q.47](#/q/es_QDc3h2lhg3TdQG47de7kejek27jd2sh): a uniform coefficient and a quadratic with real roots.
- [GATE 2017 Set 1 Q.19](#/q/es_Am9CJIIYYycmO0F4): normal symmetry and the median of $\max(X,0)$.
- [GATE 1989 Q.4(viii)](#/q/go_v1_7.12.1): no events in $t+h$, and the exponential waiting time.

## Mean, median, mode and standard deviation of data {#descriptive-statistics}

*Summarise a list of numbers by its centre and its spread, work from a frequency table, and predict what shifting or scaling the data does to each summary.*

### The idea

A list of numbers, such as the marks of a class, is hard to take in all at once. So we summarise it with two kinds of number:

- a **centre**: the mean, the median or the mode;
- a **spread**: the standard deviation (or, roughly, the range).

These are the data versions of the expectation and variance from the earlier lessons. If you pick one entry of the list at random, its expected value is the mean of the list. That is all [GATE 2014 Set 2 Q.2](#/q/es_SAUWG5k1Zpy3ipio) asks: the expected length of a word drawn from a box is the average of the nine word lengths, $\tfrac{35}{9}\approx3.9$.

### Mean, median and mode

- **Mean** (average): $\bar x=\dfrac{\text{sum of the values}}{\text{number of values}}$.
- **Median:** sort the values. If the count $n$ is odd, the median is the middle one. If $n$ is even, it is the average of the two middle ones (positions $\tfrac n2$ and $\tfrac n2+1$).
- **Mode:** the value that occurs most often. A list can have more than one mode.

> **Example:** find the median of 9, 18, 11, 14, 15, 17, 10, 69, 11, 13. ([GATE 2024 Set 1 GA.3](#/q/es_lwtewvrq))
>
> Sorted: 9, 10, 11, 11, 13, 14, 15, 17, 18, 69. There are 10 values, so the median is the average of the 5th and 6th: $\tfrac{13+14}{2}=13.5$. For comparison, the mean is $\tfrac{187}{10}=18.7$ and the mode is 11.

The single large value 69 (an **outlier**) drags the mean up to 18.7, above 9 of the 10 values, but leaves the median untouched. That is why medians are preferred for things like incomes. In the exam, the mean and the mode usually appear among the wrong options.

### Frequency tables

When values repeat, data often come as a table of values $x_i$ with **frequencies** $f_i$ (how many times each value occurs). With $N=\sum f_i$ values in all:

- mean $=\dfrac{\sum f_ix_i}{\sum f_i}$: each value counts as many times as it occurs;
- median: the value in the middle position, found with running totals (**cumulative frequencies**);
- mode: the value with the largest frequency.

**Example.** The number of children in 25 families:

| Children $x$ | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Families $f$ | 5 | 10 | 8 | 2 |
| Running total | 5 | 15 | 23 | 25 |

1. Mean: $\dfrac{0\times5+1\times10+2\times8+3\times2}{25}=\dfrac{32}{25}=1.28$.
2. Median: the middle of 25 values is the 13th. Positions 6 to 15 hold the value 1, so the median is 1.
3. Mode: 1, the value with the largest frequency (10).

**Class intervals.** If the data are given as ranges (0–10, 10–20, ...), use the midpoint of each range as its value when finding the mean. The median can be estimated inside the class that holds the middle position, assuming the values are spread evenly within it: median $\approx L+\dfrac{N/2-C}{f}\times h$, where $L$ is the lower end of the median class, $h$ its width, $f$ its frequency and $C$ the running total before it. GATE CSE has not asked these interval formulas so far.

### Spread: variance and standard deviation

The lists 49, 50, 51 and 0, 50, 100 have the same mean, 50, but very different spreads. To measure spread:

- **Variance:** the average squared distance from the mean, $\sigma^2=\dfrac1n\sum(x_i-\bar x)^2$. Shortcut: the mean of the squares minus the square of the mean.
- **Standard deviation:** $\sigma=\sqrt{\text{variance}}$, in the same units as the data.
- **Range:** largest minus smallest. Quick, but one outlier changes it a lot.

**Example.** Data: 2, 4, 4, 4, 5, 5, 7, 9.

1. Mean: $\tfrac{40}{8}=5$.
2. Squared distances from 5: 9, 1, 1, 1, 0, 0, 4, 16, which add to 32.
3. Variance: $\tfrac{32}{8}=4$, so the standard deviation is 2.
4. Shortcut check: the mean of the squares is $\tfrac{4+16+16+16+25+25+49+81}{8}=\tfrac{232}{8}=29$, and $29-5^2=4$.

**Population and sample variance.** Dividing by $n$ gives the **population variance**: use it when the list is the whole group you care about. If the list is a **sample** used to estimate the spread of a larger population, divide by $n-1$ instead: $s^2=\dfrac{1}{n-1}\sum(x_i-\bar x)^2$. Why: the distances are measured from the sample's own mean, which sits closer to the sample values than the true mean does, so dividing by $n$ would come out slightly too small on average. In the example, $s^2=\tfrac{32}{7}\approx4.57$. When a question just says "the standard deviation of the data", use $n$.

### Shifting and scaling the data

If every value $x$ is changed to $y=ax+b$:

| Summary | New value |
|---|---|
| mean, median, mode | $a\times\text{old}+b$ |
| standard deviation, range | $\lvert a\rvert\times\text{old}$ |
| variance | $a^2\times\text{old}$ |

Why: adding $b$ slides every value, and the centre, by $b$, so the distances between values do not change. Multiplying by $a$ stretches every distance by $\lvert a\rvert$. For example, the list 1, 3 has mean 2 and standard deviation 1. Adding 7 gives 8, 10: mean 9, standard deviation still 1. Doubling gives 2, 6: mean 4, standard deviation 2.

> **Watch out:** a common wrong option is "$\sigma_y=a\sigma_x+b$". Adding a constant never changes the spread.

### How mean, median and mode compare

- **Symmetric data**, like the normal curve: mean = median = mode.
- **A long tail to the right** (a few very large values, like incomes or the 69 above): mean > median > mode. The mean is pulled towards the tail.
- **A long tail to the left:** mean < median < mode.

For moderately skewed data there is a rough **empirical relation**: mode $\approx$ 3 median $-$ 2 mean. With mean 60 and median 55 it estimates the mode as $3\times55-2\times60=45$, and indeed mean > median > mode, as for a right tail.

### How GATE asks this

- The median, mean or mode of a short list, often with an outlier as the trap.
- An average from a table of counts.
- The effect of $y=ax+b$ on the mean, median, mode and standard deviation.
- The expected value of a randomly drawn item, which is the mean of the list.

**[GATE 2011 Q.33](#/q/es_dfbrsLpV6jJgXisU).** A list $Y$ is made from a list $X$ by $y_i=ax_i+b$ with $a,b>0$. Which statement is **incorrect**: (A) the mode sits at the same index in both lists; (B) the median sits at the same index in both lists; (C) $\mu_y=a\mu_x+b$; (D) $\sigma_y=a\sigma_x+b$?

1. (A) True: equal values stay equal and different values stay different, so the most frequent value is at the same positions.
2. (B) True: with $a>0$ the order is kept, so the same entry is in the middle.
3. (C) True: the mean moves with every value.
4. (D) Incorrect: the shift $b$ does not change the spread, so $\sigma_y=a\sigma_x$. The answer is (D).

**[GATE 2015 Set 1 GA.6](#/q/es_tiVLvFNCf9AXukNX).** In a class, the numbers of correct answers to five questions worth 2, 3, 1, 2 and 5 marks are 21, 15, 11, 23 and 31. Each row of the table (correct, wrong, not attempted) adds up to 44 students. There is no negative marking. What is the class average?

1. Class size: every row adds up to 44, so there are 44 students.
2. Total marks: $21\times2+15\times3+11\times1+23\times2+31\times5=42+45+11+46+155=299$.
3. Average: $\tfrac{299}{44}\approx6.795$. Dividing by the number of correct answers instead of by the 44 students is the trap.

### Quick check

**1.** Find the mean, median and mode of 3, 7, 7, 2, 9.

<details><summary>Show answer</summary>

Mean $\tfrac{28}{5}=5.6$. Sorted: 2, 3, 7, 7, 9, so the median is 7. The mode is 7.

</details>

**2.** Ten numbers have mean 20 and standard deviation 4. Each is multiplied by 3 and then 5 is subtracted. Find the new mean and standard deviation.

<details><summary>Show answer</summary>

Mean $3\times20-5=55$. Standard deviation $3\times4=12$; the $-5$ does not matter.

</details>

**3.** A moderately skewed data set has mean 40 and median 42. Estimate its mode.

<details><summary>Show answer</summary>

$3\times42-2\times40=126-80=46$.

</details>

**4.** 30 students average 60 marks and 20 other students average 70. What is the average of all 50?

<details><summary>Show answer</summary>

Add the totals, not the averages: $\dfrac{30\times60+20\times70}{50}=\dfrac{1800+1400}{50}=64$.

</details>

**5.** For the data 1, 2, 3, 4, 5, find the population variance and the sample variance.

<details><summary>Show answer</summary>

The mean is 3 and the squared distances are 4, 1, 0, 1, 4, which add to 10. Population variance $\tfrac{10}{5}=2$; sample variance $\tfrac{10}{4}=2.5$.

</details>

### Practice from GATE

- [GATE 2014 Set 2 GA.4](#/q/go_v1_9.37.2): the average of the multiples of 10 between 2 and 198.
- [GATE 2014 Set 3 GA.5](#/q/go_v1_9.55.2): a class average from a table of answers.
- [GATE 2012 Q.64](#/q/go_v1_9.52.1): what adding 7 or doubling does to the mean and standard deviation.
