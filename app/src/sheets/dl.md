## Boolean Algebra {#boolean-algebra}

### Laws
| Law | AND form | OR form |
|---|---|---|
| Identity | $x\cdot1=x$ | $x+0=x$ |
| Null | $x\cdot0=0$ | $x+1=1$ |
| Idempotent | $xx=x$ | $x+x=x$ |
| Complement | $xx'=0$ | $x+x'=1$ |
| Absorption | $x(x+y)=x$ | $x+xy=x$ |
| Redundancy | $x(x'+y)=xy$ | $x+x'y=x+y$ |
| Distributive | $x(y+z)=xy+xz$ | $x+yz=(x+y)(x+z)$ |
| De Morgan | $(xy)'=x'+y'$ | $(x+y)'=x'y'$ |
| Consensus | $(x+y)(x'+z)(y+z)=(x+y)(x'+z)$ | $xy+x'z+yz=xy+x'z$ |
- Duality: swap $+\leftrightarrow\cdot$ and $0\leftrightarrow1$ (not variables) — the dual of any identity is an identity
- $xy+x'z = (x+z)(x'+y)$

### XOR / XNOR
- $x\oplus y=xy'+x'y$; XNOR $x\odot y=xy+x'y'=(x\oplus y)'$
- $x\oplus0=x$, $x\oplus1=x'$, $x\oplus x=0$, $x\oplus x'=1$; commutative and associative
- $x\oplus y\oplus z$ = 1 iff an odd number of inputs are 1 (odd function); XNOR of an even number of variables is the complement of their XOR
- $x\oplus y\oplus xy=x+y$; $(x\oplus y)'=x'\oplus y=x\oplus y'$
- XOR of $n$ variables has $2^{n-1}$ minterms, no two adjacent → K-map can't simplify it; minimal SOP has $2^{n-1}$ terms

### Canonical forms
- Minterm $m_i$: AND of all variables (1 → $x$, 0 → $x'$); maxterm $M_i$: OR (0 → $x$, 1 → $x'$); $M_i=m_i'$
- $f=\sum m(\text{1-rows})=\prod M(\text{0-rows})$; $f'$ = $\sum m$ of the 0-rows
- Dual $f^d$: swap AND/OR and constants. Self-dual: $f=f^d$, i.e. $f(x')=f(x)'$

### Counting functions of $n$ variables
| Functions | Count |
|---|---|
| All | $2^{2^n}$ |
| Self-dual | $2^{2^{n-1}}$ |
| Neutral (equal 0s and 1s) | $\binom{2^n}{2^{n-1}}$ |
| Symmetric | $2^{n+1}$ |
| Truth tables with exactly $k$ minterms | $\binom{2^n}{k}$ |

### Universal gates
- NAND alone, NOR alone, $\{\text{AND},\text{NOT}\}$, $\{\text{OR},\text{NOT}\}$, 2:1 MUX (with constants 0, 1) are functionally complete
- Minimum 2-input gates: NOT = 1 NAND/NOR; AND = 2 NAND / 3 NOR; OR = 3 NAND / 2 NOR; XOR = 4 NAND / 5 NOR; XNOR = 5 NAND / 4 NOR
- NAND and NOR are commutative but **not** associative

## K-Maps & Minimization {#k-maps}

### Rules
- Cells in Gray-code order (00, 01, 11, 10); edges wrap around
- Groups: rectangles of $2^k$ cells; a group of $2^k$ cells in an $n$-variable map gives a term with $n-k$ literals
- SOP: group 1s. POS: group 0s, write each group as a sum term, then AND
- Don't-cares (X): use only if they enlarge a group; never group X alone

### Implicants
- Implicant: any group of 1s. Prime implicant (PI): cannot be enlarged
- Essential PI: covers some 1 that no other PI covers — must be in every minimal SOP
- Minimal SOP = all EPIs + fewest remaining PIs to cover left-over 1s
- Count PIs on the map carefully — a GATE favourite; overlapping groups count separately

### Quine–McCluskey
- Group minterms by number of 1s, combine pairs differing in one bit (mark $-$), repeat; unmarked terms are PIs; then the PI chart picks EPIs

## Combinational Circuits {#combinational-circuits}

### Adders & subtractors
- Half adder: $S=A\oplus B$, $C=AB$
- Full adder: $S=A\oplus B\oplus C_{in}$, $C_{out}=AB+BC_{in}+AC_{in}=AB+C_{in}(A\oplus B)$; = 2 half adders + OR
- Half subtractor: $D=A\oplus B$, $B_{out}=A'B$; full subtractor: $D=A\oplus B\oplus B_{in}$, $B_{out}=A'B+A'B_{in}+BB_{in}$
- $n$-bit ripple-carry adder: delay grows linearly, $\approx n\times$ (carry delay of one full adder)
- Carry look-ahead: $G_i=A_iB_i$, $P_i=A_i\oplus B_i$, $C_{i+1}=G_i+P_iC_i$; $S_i=P_i\oplus C_i$; all carries in constant gate levels (needs gates with up to $n+1$ inputs)
- Adder–subtractor: $B\oplus M$ with $C_0=M$ ($M=1$ → $A-B$ by 2's complement)

### Multiplexer (MUX)
- $2^n$:1 MUX has $n$ select lines; output $=\sum_i m_i(S)\,I_i$
- $2^n$:1 MUX implements any function of $n$ variables (inputs = 0/1), or of $n+1$ variables (inputs ∈ $\{0,1,x,x'\}$)
- 2:1 MUX: $Y=S'I_0+SI_1$. Building $2^n$:1 from 2:1 needs $2^n-1$ MUXes; $N$:1 from $k$:1 needs $\lceil\frac{N-1}{k-1}\rceil$
- 2:1 MUX as gates: $I_0=0$ → AND ($S\cdot I_1$); $I_1=1$ → OR; $I_0=1,I_1=0$ → NOT $S$

### Decoder / encoder / demux
- $n$:$2^n$ decoder: each output is one minterm → any $n$-variable function = OR of chosen outputs (= NOR of the other outputs); active-low outputs: NAND of chosen outputs (= AND of the others)
- Larger decoders: two 2:4 + enable give 3:8; $n$:$2^n$ from $k$:$2^k$ blocks — build a tree
- Encoder $2^n$:$n$; priority encoder outputs the index of the highest-priority active input (plus a valid bit)
- DEMUX 1:$2^n$ = decoder with the data on the enable line

### Other blocks
- $n$-bit comparator: $A=B$ iff all $x_i=(A_i\odot B_i)=1$; $A>B$: $A_{n-1}B'_{n-1}+x_{n-1}A_{n-2}B'_{n-2}+\cdots$
- Parity generator / checker: XOR tree
- Code converters: binary ↔ Gray with XORs (see Number Systems)

### Hazards & delay
- Static-1 hazard (SOP): two adjacent 1-cells not covered by a common term → add the consensus term
- Static-0 hazard (POS) dually; dynamic hazards come from multi-level logic
- Critical path = longest gate path from input to output; output settles after its total delay

## Sequential Circuits {#sequential-circuits}

### Flip-flops
| FF | Characteristic equation | Notes |
|---|---|---|
| SR | $Q^+=S+R'Q$ | $S=R=1$ invalid ($SR=0$) |
| JK | $Q^+=JQ'+K'Q$ | $J=K=1$ toggles |
| D | $Q^+=D$ | delay / data |
| T | $Q^+=T\oplus Q$ | $T=1$ toggles |

### Excitation table ($Q\to Q^+$)
| $Q\ Q^+$ | SR | JK | D | T |
|---|---|---|---|---|
| 0 0 | 0 X | 0 X | 0 | 0 |
| 0 1 | 1 0 | 1 X | 1 | 1 |
| 1 0 | 0 1 | X 1 | 0 | 1 |
| 1 1 | X 0 | X 0 | 1 | 0 |
- Conversions: JK → T: $J=K=T$; JK → D: $J=D$, $K=D'$; D → T: $D=T\oplus Q$; D → JK: $D=JQ'+K'Q$
- Race-around: level-triggered JK with $J=K=1$ and pulse width > propagation delay; fixed by master–slave or edge triggering
- Latch = level-sensitive; flip-flop = edge-triggered

### Counters
| Counter | FFs | States |
|---|---|---|
| Binary (ripple or synchronous) | $n$ | $2^n$ |
| Mod-$N$ | $\lceil\log_2N\rceil$ | $N$ |
| Ring | $n$ | $n$ (unused $2^n-n$) |
| Johnson (twisted ring) | $n$ | $2n$ (unused $2^n-2n$) |

- Mod-$N$ ripple counter: clear all FFs when state $N$ is reached (NAND of the outputs that are 1 in $N$)
- Ripple (asynchronous) counter: settles after $n\,t_{pd}$ ⇒ $f_{max}=\frac1{n\,t_{pd}}$; only the first FF gets the clock
- Synchronous counter: all FFs share the clock; $T_{clk}\ge t_{pd,FF}+t_{comb}+t_{setup}$ ($t_{comb}$ = next-state logic delay)
- Ripple up/down: negative-edge FFs clocked from the previous $Q$ count **up**, from $Q'$ count down; positive-edge FFs are the reverse
- Counting sequence from a given circuit: tabulate present state → FF inputs → next state; check lock-out (unused states that never return)

### Timing
- Max clock: $T\ge t_{clk\to Q}+t_{comb,max}+t_{setup}$; $f_{max}=1/T_{min}$
- Hold constraint: $t_{clk\to Q}+t_{comb,min}\ge t_{hold}$
- Clock skew $s$ (capture clock later): $T\ge t_{clk\to Q}+t_{comb}+t_{setup}-s$

### Registers & state machines
- $n$-bit shift register: $n$ FFs; serial load takes $n$ clocks; SISO, SIPO, PISO, PIPO
- Moore: output depends on state only; Mealy: on state and input (usually fewer states, output reacts within the cycle)
- Sequence detector for a pattern of length $n$: Mealy needs $n$ states, Moore $n+1$
- State minimization: merge states with identical outputs and equivalent next states (partition refinement)
- $k$ states need $\lceil\log_2k\rceil$ flip-flops

## Number Systems & Representation {#number-systems}

### Base conversion
- $(d_k\dots d_1d_0.d_{-1}\dots)_r=\sum d_ir^i$; every digit $<r$
- Decimal → base $r$: integer part by repeated division (remainders bottom-up); fraction by repeated multiplication (integer parts top-down)
- Binary ↔ octal: groups of 3 bits; binary ↔ hex: groups of 4 bits (from the point outward)
- Unknown base: write both sides as polynomials in $r$ and solve; $r$ must exceed every digit used

### Signed integers ($n$ bits)
| Representation | Range | Zeros |
|---|---|---|
| Unsigned | $0$ to $2^n-1$ | 1 |
| Sign-magnitude | $-(2^{n-1}-1)$ to $2^{n-1}-1$ | 2 |
| 1's complement | $-(2^{n-1}-1)$ to $2^{n-1}-1$ | 2 |
| 2's complement | $-2^{n-1}$ to $2^{n-1}-1$ | 1 |
- 2's complement of $x$: $2^n-x$ = invert bits + 1 = copy up to and including the rightmost 1, invert the rest
- Value of 2's complement $b_{n-1}\dots b_0$: $-b_{n-1}2^{n-1}+\sum_{i<n-1}b_i2^i$
- Sign extension: repeat the sign bit. $r$'s complement $r^n-N$; $(r-1)$'s complement $r^n-1-N$
- Excess-$K$ (biased): stored = value $+K$

### Overflow
- 2's complement addition overflows iff both operands have the same sign and the result's sign differs $\iff C_{in}(\text{MSB})\oplus C_{out}(\text{MSB})=1$
- Adding numbers of opposite sign never overflows
- Unsigned addition overflows iff carry out of MSB = 1
- 1's complement addition: add any end-around carry back into the LSB

### IEEE 754
| | Sign | Exponent | Mantissa | Bias |
|---|---|---|---|---|
| Single (32) | 1 | 8 | 23 | 127 |
| Double (64) | 1 | 11 | 52 | 1023 |
- Normal ($1\le E\le254$): $(-1)^S\times1.M\times2^{E-127}$
- $E=0$, $M=0$: $\pm0$; $E=0$, $M\ne0$: denormal $(-1)^S\times0.M\times2^{-126}$
- $E=255$, $M=0$: $\pm\infty$; $E=255$, $M\ne0$: NaN
- Single: largest $(2-2^{-23})\times2^{127}$; smallest normal $2^{-126}$; smallest denormal $2^{-149}$
- Gap between consecutive floats with unbiased exponent $e=E-127$: $2^{e-23}$ (single)
- Custom format with $k$ exponent bits: bias $=2^{k-1}-1$; max normal stored exponent $=2^k-2$

### Codes
- BCD (8421): each decimal digit in 4 bits; 1010–1111 invalid; BCD addition: add 6 if sum > 9 or a carry occurs
- Excess-3: BCD + 0011; self-complementing
- Gray: $g_{n-1}=b_{n-1}$, $g_i=b_{i+1}\oplus b_i$; back: $b_{n-1}=g_{n-1}$, $b_i=b_{i+1}\oplus g_i$; consecutive codes differ in one bit
- ASCII: 'A' = 65, 'a' = 97, '0' = 48; 7-bit code
