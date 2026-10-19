## Machine Instructions & Addressing Modes {#machine-instructions-and-addressing-modes}

### Addressing modes
| Mode | Effective address / operand | Memory refs for operand | Typical use |
|---|---|---|---|
| Immediate | operand = field | 0 | constants |
| Register | operand = $R$ | 0 | fast temporaries |
| Direct (absolute) | EA = $A$ | 1 | global / static variables |
| Indirect | EA = $M[A]$ | 2 | pointers |
| Register indirect | EA = $R$ | 1 | pointers held in registers |
| Indexed | EA = $A+R_{index}$ | 1 | arrays ($A$ = base, $R$ = index) |
| Base register | EA = $R_{base}+\text{offset}$ | 1 | relocation, struct fields, locals |
| PC-relative | EA = PC + offset | 1 | branches; position-independent code |
| Auto-increment / decrement | EA = $R$, then $R\mathrel{+}=d$ / $R\mathrel{-}=d$ first | 1 | stacks, array walks |
| Implied | operand implicit | 0 | e.g. CLA, stack ops |
- PC-relative: PC already points to the **next** instruction when the offset is added
- Indirect costs one extra memory access beyond direct

### Instruction formats
- Bits for a field = $\lceil\log_2(\text{choices})\rceil$: opcode bits from number of instructions, register field from number of registers, address field from memory size (or immediate range)
- Expanding opcode: with $k$ opcode bits and $t$ two-address instructions, the $2^k-t$ unused patterns each extend into the freed address field: one-address instructions possible $=(2^k-t)\times2^{\text{freed bits}}$
- Number of addresses: 3-address (fewest instructions), 2-, 1- (accumulator), 0-address (stack machine, operands on stack)
- Byte-addressable memory of $2^n$ bytes → $n$-bit addresses; word-addressable with $w$-byte words → $\log_2(\text{size}/w)$ bits

### Byte order & alignment
- Big-endian: most significant byte at the lowest address; little-endian: least significant byte at the lowest address
- Aligned access: a $k$-byte item at an address divisible by $k$

### Instruction cycle
- Fetch (MAR ← PC; MBR ← M[MAR]; IR ← MBR; PC ← PC + 1) → decode → operand fetch → execute → write back → check interrupts
- Interrupts are serviced between instructions (after the current instruction completes)
- CPU time $=\text{IC}\times\text{CPI}\times T_{clk}=\dfrac{\text{IC}\times\text{CPI}}{f}$; MIPS $=\dfrac{f}{\text{CPI}\times10^6}$
- Average CPI $=\sum_i(\text{fraction}_i\times\text{CPI}_i)$
- Amdahl: speedup $=\dfrac1{(1-f)+f/s}$ when a fraction $f$ is sped up by $s$

### RISC vs CISC
| RISC | CISC |
|---|---|
| fixed-length, few formats | variable-length |
| load/store architecture | memory operands in ALU ops |
| many registers, hardwired control | microprogrammed control |
| ~1 CPI, pipeline-friendly | multi-cycle instructions |

## ALU, Data Path & Control Unit {#alu-data-path-and-control-unit}

### Control units
- Hardwired: faster, inflexible (combinational logic + state counter)
- Microprogrammed: control words stored in control memory; easier to modify; slower
- Horizontal microcode: one bit per control signal (wide, fast, parallel signals)
- Vertical microcode: encoded fields, field of $k$ mutually exclusive signals needs $\lceil\log_2(k+1)\rceil$ bits (+1 for "none"); narrow, needs decoders

### Control word size
- Control word = control-signal field + condition-select field ($\lceil\log_2(\#\text{conditions})\rceil$) + next-address field ($\lceil\log_2(\#\text{control-memory words})\rceil$)
- Control memory size = words × word width
- Control memory words ≈ total microinstructions over all instructions (shared fetch routine counted once)

### Data path
- Single-bus: one transfer per cycle → more cycles per instruction; 2- and 3-bus organisations allow parallel transfers
- Count micro-operations / clock cycles per instruction by listing register transfers, at most one bus use per bus per cycle
- Register transfer $R1\leftarrow R2$: $R2_{out}$, $R1_{in}$ in one cycle on the bus

## Computer Arithmetic {#computer-arithmetic}

### Booth's multiplication (2's complement)
- Look at pair $(Q_0, Q_{-1})$, start $Q_{-1}=0$: 00 / 11 → shift; 01 → $A=A+M$; 10 → $A=A-M$; then arithmetic right shift $A,Q,Q_{-1}$
- Recoding: multiplier bit pair $(q_i,q_{i-1})$: 10 → $-1$, 01 → $+1$, 00 / 11 → $0$
- Number of add/subtract operations = number of 0↔1 transitions in the multiplier (with an implied 0 on the right)
- Worst case: alternating bits (0101…); best: long runs of 1s
- Bit-pair (radix-4) recoding halves the number of partial products

### Division
- Restoring: shift left, subtract divisor; if negative, restore (add back) and set quotient bit 0, else 1
- Non-restoring: if $A\ge0$ shift and subtract, else shift and add; final correction if remainder negative
- $n$-bit unsigned division takes $n$ iterations

### Arithmetic facts
- $n$-bit × $n$-bit product needs $2n$ bits; array multiplier uses $n^2$ AND gates
- Shift left by $k$: $\times2^k$ (2's complement overflow iff the top $k+1$ bits are not all equal); arithmetic right shift: $\lfloor x/2^k\rfloor$ (rounds toward $-\infty$)
- Floating-point add: align exponents (shift smaller right), add mantissas, normalise, round; not associative
- See Digital Logic → Number Systems for 2's complement ranges, overflow and IEEE 754

## Pipelining {#pipelining}

### Timing & speedup
- $k$ stages, $n$ instructions, cycle $t_p=\max(\text{stage delay})+\text{latch delay}$
- Pipelined time $=(k+n-1)\,t_p$; non-pipelined time $=n\,t_n$ ($t_n$ = sum of stage delays, no latches)
- Speedup $S=\dfrac{n\,t_n}{(k+n-1)\,t_p}\to\dfrac{t_n}{t_p}$ as $n\to\infty$ ($=k$ for equal stages, no latch delay)
- Efficiency $=S/k$; throughput $=\dfrac{n}{(k+n-1)t_p}\approx\dfrac1{t_p}$

### Stalls & CPI
- Ideal CPI = 1; actual CPI $=1+\text{stall cycles per instruction}$
- Speedup $=\dfrac{\text{CPI}_{unpipelined}\times T_{unpipelined}}{\text{CPI}_{pipelined}\times T_{pipelined}}$; balanced stages, no latch delay: $\dfrac{\text{depth}}{1+\text{stalls per instruction}}$
- Branches: CPI = 1 + (fraction of all instructions that are branches paying the penalty) × (penalty cycles)
- Branch resolved in stage $s$ (stage 1 = IF): penalty $=s-1$ cycles if every branch flushes

### Hazards
| Hazard | Cause | Fixes |
|---|---|---|
| Structural | two instructions need the same unit | duplicate resources, split I/D caches, stall |
| Data RAW (true) | read after write | forwarding, stall, reorder |
| Data WAR (anti) | write after read | register renaming (only in out-of-order) |
| Data WAW (output) | write after write | register renaming (only in out-of-order) |
| Control | branch outcome / target unknown | stall, predict, delayed branch, early resolution |
- In-order 5-stage (IF ID EX MEM WB): only RAW causes stalls
- Without forwarding (register write in first half, read in second half): dependent instruction right after ⇒ 2 stalls
- With forwarding: ALU → ALU no stall; **load-use** still costs 1 stall
- Delayed branch: instruction in the delay slot always executes

### Counting cycles
- Draw the space-time diagram: instruction $i$ enters IF at cycle $i$ plus all earlier stalls
- Total cycles $=k+(n-1)+\text{total stalls}$
- Non-uniform stages: cycle = slowest stage (+ latch); splitting the slowest stage raises throughput

## Memory Hierarchy, Cache & Main Memory {#memory-interfacing}

### Address breakdown
| Mapping | Address fields |
|---|---|
| Direct | Tag \| Line ($\log_2\#\text{lines}$) \| Offset ($\log_2\text{block}$) |
| $k$-way set associative | Tag \| Set ($\log_2\frac{\#\text{lines}}{k}$) \| Offset |
| Fully associative | Tag \| Offset |
- Tag bits = address bits − index bits − offset bits
- #lines = cache size / block size; #sets = #lines / $k$
- Block $j$ → line $j\bmod\#\text{lines}$ (direct) or set $j\bmod\#\text{sets}$
- Doubling associativity (same size): +1 tag bit, −1 set bit

### Tag directory & hardware
- Tag memory = #lines × (tag + valid + dirty (write-back) + replacement bits)
- Comparators: direct 1; $k$-way $k$ (each tag-width); fully associative one per line
- $k$-way needs a $k$:1 MUX to select the hit block; direct mapped needs none
- LRU per set: $\lceil\log_2(k!)\rceil$ bits minimum, or $k\log_2k$ with counters

### Access time
- AMAT $=$ hit time $+$ miss rate × miss penalty
- Hierarchical (look-through), 2 levels: $T=t_1+(1-h_1)\,t_2$ = $h_1t_1+(1-h_1)(t_1+t_2)$
- Simultaneous (look-aside): $T=h_1t_1+(1-h_1)\,t_2$
- Three levels hierarchical: $T=t_1+(1-h_1)\left[t_2+(1-h_2)\,t_3\right]$ ($h_2$ = local hit rate of L2)
- Miss penalty with block transfer: latency $+\frac{\text{block size}}{\text{bus width}}\times$ transfer time per word
- Global miss rate (L2) = $(1-h_1)(1-h_2)$

### Write policies
| | Write-through | Write-back |
|---|---|---|
| Memory updated | every write | on eviction of a dirty block |
| Extra bit | — | dirty bit |
| Usually paired with | no-write-allocate | write-allocate |

- Write-back with dirty fraction $d$: miss penalty $=(1+d)\times$ block transfer time (write back the victim, then fetch)
- Average time with reads and writes: weight each by its fraction, $T=f_r\,T_{read}+f_w\,T_{write}$; in write-through every write costs a memory access

### Misses
- Compulsory (first reference), capacity (cache too small), conflict (mapping collisions; none in fully associative)
- Larger blocks: fewer compulsory misses, more miss penalty; higher associativity: fewer conflict misses
- Array of $N$ bytes scanned once with block $B$: $\lceil N/B\rceil$ misses (if not already cached)
- Row-major array traversed column-wise: up to one miss per element when a row ≥ block size

### Replacement
- FIFO, LRU, random, optimal (not implementable). Direct mapped needs no policy
- Trace hits/misses with a table of sets; on a tie, follow the policy exactly as stated

### Main memory organisation
- Chips needed $=\dfrac{\text{total words}}{\text{chip words}}\times\dfrac{\text{word width}}{\text{chip width}}$
- Rows of chips selected by a decoder on the high-order address bits: $\log_2(\#\text{rows})$ : $\#\text{rows}$
- Low-order interleaving: module = address mod $m$ → consecutive words in different modules (parallel access)
- Block of $m$ words with $m$-way low-order interleaving: one access time + $m$ word transfers (vs $m$ access times without)
- DRAM refresh overhead $=\dfrac{\#\text{rows}\times\text{refresh cycle time}}{\text{refresh period}}$
- Locality: temporal (reuse soon), spatial (nearby addresses)

## I/O Interface (Interrupts, DMA) {#io-interface}

### I/O methods
| Method | CPU involvement |
|---|---|
| Programmed I/O | CPU busy-waits polling the status register |
| Interrupt-driven | CPU runs other work; interrupt per word / event |
| DMA | DMA controller transfers a block; one interrupt at the end |
- Memory-mapped I/O: devices share the address space, ordinary loads/stores. Isolated I/O: separate IN/OUT instructions

### DMA modes
- Burst (block) mode: DMA holds the bus for the whole block; CPU blocked meanwhile
- Cycle stealing: DMA takes the bus for one word at a time
- Transparent: DMA uses the bus only when the CPU isn't using it (no slowdown)
- % CPU time blocked $=\dfrac{\text{bus time used by DMA}}{\text{total time}}\times100$; e.g. burst: $\dfrac{T_{transfer}}{T_{prepare}+T_{transfer}}$

### Interrupts
- Vectored: device supplies the ISR address; polled: CPU checks devices in priority order
- Daisy chain: priority by position — the device nearest the CPU has the highest priority
- Overhead fraction = (interrupts per second) × (time per interrupt); polling overhead = (polls per second × cycles per poll) / clock rate
- Interrupt latency: time from request to start of ISR (finish current instruction, save state)
- Nested interrupts: higher priority can preempt a lower-priority ISR

### Transfer rates
- Bytes per second ÷ bytes per transfer = transfers per second
- Device must be serviced before its buffer overruns: service time < time to fill buffer

## Secondary Storage {#secondary-memory}

### Disk geometry
- Capacity = surfaces × tracks per surface × sectors per track × bytes per sector
- Cylinder = same track on all surfaces; address bits $=\log_2\#\text{cyl}+\log_2\#\text{heads}+\log_2\#\text{sectors}$
- Rotation time $=60/\text{RPM}$ s; average rotational latency = half a rotation
- Data rate = bytes per track × rotations per second
- Time to transfer one sector = rotation time / sectors per track
- Access time = seek + rotational latency + transfer time (+ controller overhead)
- See Operating Systems → File Systems, Disk & I/O for disk scheduling
