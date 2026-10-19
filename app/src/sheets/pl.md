## C Basics & Programming Concepts {#basic-of-programming-language}

### Data types (typical; use the sizes the question gives)
| Type | Size (bytes) | Range |
|---|---|---|
| `char` | 1 | −128 to 127 (`unsigned`: 0 to 255) |
| `short` | 2 | −32768 to 32767 |
| `int` | 4 (2 on old 16-bit) | $-2^{31}$ to $2^{31}-1$ |
| `long` | 8 on 64-bit Linux, 4 on Windows / 32-bit | |
| `float` / `double` | 4 / 8 | |
| pointer | 8 on 64-bit, 4 on 32-bit | |
- `sizeof` is evaluated at compile time; `sizeof(i++)` does not increment `i`
- Integer literals: `010` is octal (8), `0x10` is hex (16); `'A'` = 65, `'a'` = 97, `'0'` = 48

### Operator precedence (high → low)
| Level | Operators | Associativity |
|---|---|---|
| 1 | `()` `[]` `->` `.` postfix `++` `--` | L → R |
| 2 | unary `+ - ! ~` prefix `++ --` `*` `&` `(type)` `sizeof` | R → L |
| 3 | `* / %` | L → R |
| 4 | `+ -` | L → R |
| 5 | `<< >>` | L → R |
| 6 | `< <= > >=` | L → R |
| 7 | `== !=` | L → R |
| 8–10 | `&` then `^` then `\|` | L → R |
| 11–12 | `&&` then `\|\|` | L → R |
| 13 | `?:` | R → L |
| 14 | `= += -= *=` … | R → L |
| 15 | `,` | L → R |
- `*p++` = `*(p++)` (use, then advance pointer); `(*p)++` increments the value; `++*p` increments the value
- `a & b == c` parses as `a & (b == c)`; `x = y == z` assigns the comparison result

### Evaluation rules
- `&&`, `||` short-circuit: the right side is skipped when the result is already known — side effects in it don't happen
- `&&`, `||`, `?:`, `,` are sequence points; modifying a variable twice between sequence points (`i = i++`, `i++ + i++`) is undefined
- Integer division truncates toward zero; `%` takes the sign of the dividend: `-7/2 = -3`, `-7 % 2 = -1`
- Mixed signed/unsigned: the signed operand converts to unsigned — `-1 < 1u` is **false**
- `char` and `short` are promoted to `int` in expressions; overflow of signed `char` on assignment wraps (implementation-defined): `char c = 200` → −56
- Relational and logical operators yield `int` 0 or 1; any non-zero value is true
- Order of evaluating function arguments and most operands is unspecified; `printf("%d %d", i, i++)` is undefined
- Unsigned arithmetic wraps mod $2^n$; signed overflow is undefined; `>>` on a negative value is implementation-defined
- Assignment returns the assigned value: `if (x = 0)` is always false

### Control flow
- `switch` falls through until `break`; `default` can be anywhere; case labels must be constant
- Dangling `else` binds to the nearest unmatched `if`
- `while (cond);` or `for (...);` with a stray semicolon has an empty body
- `for (i = 0; i < n; i++)` runs $n$ times; `i <= n` runs $n+1$; loop variable after loop = first failing value
- `continue` in a `for` jumps to the increment step; in `while` to the condition
- Nested loop counts: $\sum_{i}\sum_{j}1$ — write the sum, don't guess

### Storage classes
| Class | Scope | Lifetime | Default value |
|---|---|---|---|
| `auto` (locals) | block | block | garbage |
| `register` | block | block | garbage (no `&`) |
| `static` local | block | whole program, initialised once | 0 |
| `static` global | file | whole program | 0 |
| global / `extern` | program | whole program | 0 |
- A `static` local keeps its value between calls; its initializer runs only once

### Bitwise tricks
- `x & (x-1)` clears the lowest set bit (counts set bits in a loop; 0 iff $x$ is 0 or a power of 2)
- `x & -x` isolates the lowest set bit; `x ^ x = 0`; `x << k` = $x\cdot2^k$; `x >> k` = $\lfloor x/2^k\rfloor$ for non-negative $x$
- `~x = -x - 1` (2's complement)

### Preprocessor
- Macros are textual substitution: `#define SQ(x) x*x` → `SQ(a+1)` = `a+1*a+1`; argument side effects repeat
- `#define` has no scope and no type checking

### I/O return values
- `printf` returns the number of characters printed; `scanf` returns the number of items assigned

## Functions, Recursion & Scope {#function-and-recursion}

### Parameter passing
| Mechanism | Behaviour |
|---|---|
| Call by value (C) | copy; callee can't change caller's variable |
| Call by reference | alias; changes visible immediately |
| Call by value-result (copy-in/copy-out) | copy in, copy back at return (differs from reference under aliasing) |
| Call by name | argument expression re-evaluated at every use (like textual substitution) |
| Call by need | by name, but evaluated at most once (lazy) |
- C is always call by value; passing a pointer (or an array, which decays to a pointer) lets the callee modify the pointee

### Scoping
- Static (lexical): a free variable refers to the declaration in the textually enclosing block where the function is **defined**
- Dynamic: a free variable refers to the most recent active binding on the **call stack** (the caller's)
- C uses static scoping; inner declarations shadow outer ones within their block

### Activation records
- Contents: return value, actual parameters, return address, control link (caller's frame), access link (enclosing scope, for nested functions), saved registers, local variables, temporaries
- Stack allocation supports recursion; static allocation (old FORTRAN) does not
- Returning the address of a local variable → dangling pointer

### Recursion
- Trace with a recursion tree; the output order of prints before vs after the recursive call reverses
- Naive Fibonacci $C(n)=C(n-1)+C(n-2)+1$, $C(0)=C(1)=1$: calls $=2F(n+1)-1$ ($F(1)=F(2)=1$)
- Max stack depth = height of the recursion tree; tail recursion can be turned into a loop
- Recursive functions with static variables: the static is shared by all calls

## Pointers, Arrays & Structures {#pointer-and-structure-in-c}

### Pointer arithmetic
- `a[i]` ≡ `*(a+i)` ≡ `i[a]`; `p + k` advances $k\times$`sizeof(*p)` bytes; `p - q` = number of elements between
- Array name decays to a pointer to its first element (except in `sizeof` and `&`)
- An array parameter is really a pointer: `sizeof(a)` inside the callee = `sizeof(int *)`
- `&a` has type pointer-to-whole-array: `&a + 1` skips the entire array

### 2-D arrays (`int a[R][C]`)
- `a[i][j]` ≡ `*(*(a+i)+j)`; address $=\text{base}+(iC+j)\times$`sizeof(int)`
- `a + 1` skips one row ($C$ ints); `*a + 1` skips one element; `a`, `*a`, `a[0]`, `&a[0][0]` share the same address but differ in type
- `sizeof(a)` $=RC\times4$; `sizeof(a[0])` $=C\times4$
- A function parameter `int a[][C]` needs every dimension except the first

### Strings
- `char s[] = "abc"` → array of 4 bytes, modifiable; `char *s = "abc"` → pointer to a read-only literal
- `strlen` excludes `'\0'`; `sizeof` of the array includes it
- `printf("%s", p)` prints from `p` up to `'\0'`

### Reading declarations (right-left rule)
| Declaration | Meaning |
|---|---|
| `int *p[10]` | array of 10 pointers to int |
| `int (*p)[10]` | pointer to an array of 10 ints |
| `int *f()` | function returning pointer to int |
| `int (*f)()` | pointer to function returning int |
| `int (*f[5])()` | array of 5 pointers to functions returning int |
| `const int *p` | pointer to const int (can't change `*p`) |
| `int *const p` | const pointer (can't change `p`) |

### Structures & unions
- `p->x` ≡ `(*p).x`
- `struct` size ≥ sum of members (padding for alignment; size is a multiple of the largest member's alignment)
- `union` size = largest member (rounded up to alignment); all members share the same memory
- Self-referential struct: `struct node { int v; struct node *next; };`

### Dynamic memory & pitfalls
- `malloc(n)` uninitialised; `calloc(k, n)` zero-filled; `free` once only
- Dangling pointer (use after free / pointer to dead local), memory leak (lost last reference), NULL dereference
- Swap via pointers needs `swap(&a, &b)`; swapping the pointers inside the callee changes nothing in the caller
