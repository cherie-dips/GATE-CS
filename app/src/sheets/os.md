## Processes, Threads & CPU Scheduling {#process-concepts-and-cpu-scheduling}

### Process states
- New → Ready → Running → Terminated; Running → Waiting (I/O or event) → Ready; Running → Ready (preempted / time-slice over)
- Suspended ready / suspended blocked: swapped out by the medium-term scheduler
- Long-term scheduler: controls degree of multiprogramming; short-term: picks the next process for the CPU; medium-term: swapping
- PCB: PID, state, PC, registers, scheduling info, memory-management info, open files, accounting
- Mode switch (user ↔ kernel) is cheaper than a context switch

### fork()
- Returns 0 in the child, the child's PID in the parent, −1 on failure
- $n$ sequential `fork()` calls → $2^n$ processes ($2^n-1$ new children)
- `for (i=0; i<n; i++) { fork(); printf("x"); }` prints $2+4+\cdots+2^n=2^{n+1}-2$ times
- `fork() && fork()`, `fork() || fork()`: apply short-circuiting separately in parent and child (child sees 0)
- Count prints: each process executes every statement after its creation point; `printf` without `\n` may be duplicated by buffered output

### Threads
- Threads share code, data, heap, open files; each has its own stack, registers, PC (and thread ID)
- User-level threads: kernel unaware; fast switches; one blocking system call blocks the whole process (many-to-one)
- Kernel-level threads: scheduled independently, can run in parallel on multiple CPUs; costlier switches

### Scheduling formulas
- Turnaround time TAT = completion − arrival; waiting time WT = TAT − burst; response time = first run − arrival
- Throughput = processes completed / time; CPU utilisation = busy time / total time
- Exponential averaging (SJF prediction): $\tau_{n+1}=\alpha t_n+(1-\alpha)\tau_n$
- HRRN response ratio $=\dfrac{W+S}{S}$ (W = waiting so far, S = burst)
- Utilisation with $n$ processes each waiting for I/O a fraction $p$ of the time: $1-p^n$
- RR with context-switch cost $s$: useful fraction $\frac q{q+s}$ (when every slice is used fully)

### Scheduling algorithms
| Algorithm | Preemptive | Notes |
|---|---|---|
| FCFS | no | convoy effect; simple |
| SJF | no | minimal average waiting time among non-preemptive; starvation |
| SRTF (preemptive SJF) | yes | minimal average waiting time overall; starvation |
| Round robin (quantum $q$) | yes | response ≤ $(n-1)q$; $q\to\infty$ ⇒ FCFS; tiny $q$ ⇒ overhead |
| Priority | either | starvation → aging |
| HRRN | no | favours short jobs, no starvation |
| Multilevel queue / feedback | yes | MLFQ demotes CPU-bound jobs |
- Ties: follow the question's rule (usually lower process ID / FCFS)
- Draw the Gantt chart; at each arrival in preemptive algorithms re-check who should run
- RR: a newly arriving process is usually queued **before** the preempted process at the same instant (state the convention)

## Synchronization & Concurrency {#synchronization-and-concurrency}

### Critical-section requirements
- Mutual exclusion, progress (only processes wanting to enter decide, no indefinite postponement), bounded waiting (limit on bypasses)
- Strict alternation (`turn` only): mutual exclusion but violates progress
- Flags only (`flag[i]=true; while(flag[j]);`): can deadlock
- Peterson (2 processes): `flag[i]=true; turn=j; while(flag[j] && turn==j);` — satisfies all three
- Test-and-set / swap locks: mutual exclusion and progress, but not bounded waiting (busy waiting)
- Disabling interrupts works only on a uniprocessor

### Semaphores
- `wait(S)` (P): `S--`; if `S < 0` block. `signal(S)` (V): `S++`; if `S <= 0` wake one
- Final value = initial − (#P) + (#V); a negative value $-k$ means $k$ processes are blocked
- Binary semaphore / mutex: 0 or 1. Counting semaphore initialised to $n$ allows $n$ concurrent holders
- Order of `wait` calls matters: `wait(mutex)` before `wait(empty)` in the producer can deadlock

### Classic problems
- Producer–consumer (buffer $N$): `empty = N`, `full = 0`, `mutex = 1`. Producer: `wait(empty); wait(mutex); add; signal(mutex); signal(full)`. Consumer: mirror image
- Readers–writers (first): `readcount` protected by `mutex`; first reader locks `wrt`, last reader releases it; writers may starve
- Dining philosophers: all picking the left fork first can deadlock. Fixes: one philosopher picks right first, at most $n-1$ seated, pick both forks atomically
- Sleeping barber: `customers`, `barbers`, `mutex`

### Monitors & condition variables
- Only one process active inside a monitor at a time
- `x.wait()` always blocks; `x.signal()` with no waiter does nothing (unlike a semaphore's `signal`)

### Race conditions
- Possible final values: enumerate interleavings of load / modify / store (e.g. two `x++` on `x=0` can give 1 or 2)
- Interleavings of sequences of lengths $m,n$: $\binom{m+n}m$

## Deadlocks {#deadlocks}

### Conditions (Coffman) — all four necessary
- Mutual exclusion, hold and wait, no preemption, circular wait
- Resource-allocation graph: cycle ⇒ deadlock if every resource has one instance; with multiple instances a cycle is necessary but not sufficient

### Handling
| Strategy | Idea |
|---|---|
| Prevention | break a condition: request all at once (hold & wait), preempt, global resource ordering (circular wait) |
| Avoidance | Banker's algorithm: grant only if the state stays safe |
| Detection & recovery | wait-for graph / detection algorithm; kill or roll back |
| Ignore | ostrich approach (most OSes) |
- Safe state ⇒ no deadlock; unsafe ⇏ deadlock (just possible)

### Banker's algorithm
- Need = Max − Allocation; Available = Total − ΣAllocation
- Safety: find $P_i$ with Need$_i$ ≤ Work, then Work += Allocation$_i$; repeat; safe if all finish. $O(mn^2)$
- Request: check Request ≤ Need and ≤ Available, pretend to allocate, run safety check

### Counting formulas
- $n$ processes, each needs at most $k$ instances of a resource with $R$ instances: deadlock impossible iff $R\ge n(k-1)+1$
- Different maxima $k_i$: deadlock-free iff $R\ge\sum_i(k_i-1)+1$
- Max processes guaranteed deadlock-free: $n=\left\lfloor\frac{R-1}{k-1}\right\rfloor$

## Memory Management & Virtual Memory {#memory-management}

### Paging basics
- Logical address = page number ($p$ bits) + offset ($d$ bits); page size $=2^d$
- #pages $=\frac{\text{virtual address space}}{\text{page size}}$; #frames $=\frac{\text{physical memory}}{\text{page size}}$
- Page table size = #pages × PTE size; PTE ≥ frame-number bits + valid/dirty/reference/protection bits
- Inverted page table: one entry per frame; size = #frames × entry size; needs search / hashing

### Multilevel paging
- Entries per page = page size / PTE size; each level indexes $\log_2(\text{entries per page})$ bits
- Levels $=\left\lceil\dfrac{p}{\log_2(\text{page size}/\text{PTE size})}\right\rceil$
- Without a TLB, $k$-level paging: $k+1$ memory accesses per reference

### Effective access time
- TLB hit ratio $h$, TLB time $t$, memory time $m$, single-level: EMAT $=h(t+m)+(1-h)(t+2m)$
- $k$-level page table: miss costs $t+(k+1)m$. If the TLB is searched in parallel or $t$ is ignored, drop $t$
- Page faults with rate $p$ and service time $s$: EAT $=(1-p)\,m+p\,s$ (use EMAT for $m$ if a TLB is given)
- Dirty victim: service time includes writing it back (often $2\times$ disk time when dirty)
- TLB reach = #TLB entries × page size

### Page replacement
| Algorithm | Notes |
|---|---|
| FIFO | Belady's anomaly possible (more frames, more faults) |
| Optimal (OPT) | evict the page used farthest in the future; minimum faults; not implementable |
| LRU | evict least recently used; stack algorithm, no Belady anomaly |
| LFU / MFU | frequency counters |
| Clock / second chance | FIFO + reference bit; approximates LRU |
- Faults ≥ number of distinct pages (all frames start empty); ≤ length of the reference string
- Stack algorithms (OPT, LRU) never show Belady's anomaly
- Belady example: 1 2 3 4 1 2 5 1 2 3 4 5 under FIFO → 9 faults with 3 frames, 10 with 4

### Thrashing & working set
- Thrashing: too little memory per process ⇒ constant paging, CPU utilisation collapses
- Working set $WSS_i$ = distinct pages referenced in the last $\Delta$ references; demand $D=\sum WSS_i$; thrashing if $D>$ total frames
- Proportional allocation: $a_i=\frac{s_i}{\sum s_j}\times m$

### Contiguous allocation & fragmentation
- First fit (first hole big enough), best fit (smallest adequate hole), worst fit (largest hole), next fit
- Internal fragmentation: fixed partitions, paging (average half a page per process)
- External fragmentation: variable partitions, segmentation; fixed by compaction or paging
- 50% rule (first fit): $N$ allocated blocks ⇒ about $N/2$ blocks lost to fragmentation
- Optimal page size (page-table overhead vs internal fragmentation): $\sqrt{2se}$ ($s$ = avg process size, $e$ = PTE size)

### Segmentation
- Logical address (segment, offset); physical = base + offset if offset < limit, else trap
- Segmented paging: segment table → page table per segment

## File Systems, Disk & I/O {#file-system-io-and-protection}

### Disk timing
- Capacity = surfaces × tracks/surface × sectors/track × bytes/sector
- Rotation time $=\frac{60}{\text{RPM}}$ s; average rotational latency = $\frac12$ rotation
- Transfer time = bytes ÷ (bytes per track × rotations per second)
- Access time = seek + rotational latency + transfer (+ controller overhead)

### Disk scheduling
| Algorithm | Behaviour |
|---|---|
| FCFS | in arrival order |
| SSTF | nearest request next; may starve far requests |
| SCAN (elevator) | sweep to the disk end, reverse |
| C-SCAN | sweep to the end, jump to cylinder 0, sweep again in the same direction |
| LOOK / C-LOOK | like SCAN / C-SCAN but turn at the last request |
- Total head movement = sum of the distances between consecutive positions; check whether the question counts the return jump in C-SCAN / C-LOOK

### File allocation
| Method | Random access | Fragmentation | Notes |
|---|---|---|---|
| Contiguous | fast | external | file growth is hard |
| Linked | sequential only | none | pointer per block; one bad pointer loses the rest |
| FAT | via table | none | linked list kept in a table (size = #blocks × entry size) |
| Indexed (inode) | yes | none | index block overhead |

### Inode max file size
- $B$ = block size, $p$ = pointer size, $k=B/p$ pointers per block
- Max size $=(\#\text{direct}+k+k^2+k^3)\times B$ (with single, double, triple indirect)
- Max file size is also limited by the pointer width: $2^{\text{pointer bits}}\times B$
- Disk reads to reach a byte (inode in memory): 1 for a direct block, +1 per level of indirection

### Free-space management
- Bit vector: 1 bit per block (size = #blocks / 8 bytes); linked list; grouping; counting

### Directories & links
- Single-level, two-level, tree, acyclic graph (shared files), general graph (needs garbage collection)
- Hard link: another name for the same inode (same file system only; link count); soft link: a file holding a path (can dangle)

### RAID
| Level | Technique | Usable capacity ($n$ disks) | Survives |
|---|---|---|---|
| 0 | striping | $n$ | no failure |
| 1 | mirroring | $n/2$ | one disk per mirror pair |
| 5 | striping + distributed parity | $n-1$ | 1 disk |
| 6 | dual distributed parity | $n-2$ | 2 disks |
| 10 | mirrored stripes | $n/2$ | one per mirror pair |

### Protection & I/O
- Access matrix (rows domains, columns objects); stored as ACLs (per object) or capability lists (per domain)
- Unix permissions: `rwx` for owner, group, others (e.g. 754)
- Buffering, caching, spooling (printer queue); DMA and interrupts — see CO → I/O Interface
