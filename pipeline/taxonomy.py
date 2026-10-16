"""Subject / chapter taxonomy for the question bank (GATE CSE syllabus order)."""

SUBJECTS = [
    ('ga', 'General Aptitude', [
        ('verbal-ability', 'Verbal Ability'),
        ('numerical-ability', 'Numerical / Quantitative Ability'),
        ('logical-reasoning', 'Analytical & Logical Reasoning'),
        ('spatial-aptitude', 'Spatial Aptitude'),
    ]),
    ('em', 'Engineering Mathematics', [
        ('linear-algebra', 'Linear Algebra'),
        ('calculus', 'Calculus'),
        ('probability', 'Probability & Statistics'),
    ]),
    ('dm', 'Discrete Mathematics', [
        ('mathematical-logic', 'Mathematical Logic'),
        ('set-theory-and-algebra', 'Set Theory & Algebra'),
        ('combinatorics', 'Combinatorics'),
        ('graph-theory', 'Graph Theory'),
    ]),
    ('dl', 'Digital Logic', [
        ('boolean-algebra', 'Boolean Algebra'),
        ('k-maps', 'K-Maps & Minimization'),
        ('combinational-circuits', 'Combinational Circuits'),
        ('sequential-circuits', 'Sequential Circuits'),
        ('number-systems', 'Number Systems & Representation'),
    ]),
    ('co', 'Computer Organization & Architecture', [
        ('machine-instructions-and-addressing-modes', 'Machine Instructions & Addressing Modes'),
        ('alu-data-path-and-control-unit', 'ALU, Data Path & Control Unit'),
        ('computer-arithmetic', 'Computer Arithmetic'),
        ('pipelining', 'Pipelining'),
        ('memory-interfacing', 'Memory Hierarchy, Cache & Main Memory'),
        ('io-interface', 'I/O Interface (Interrupts, DMA)'),
        ('secondary-memory', 'Secondary Storage'),
    ]),
    ('pl', 'Programming in C', [
        ('basic-of-programming-language', 'C Basics & Programming Concepts'),
        ('function-and-recursion', 'Functions, Recursion & Scope'),
        ('pointer-and-structure-in-c', 'Pointers, Arrays & Structures'),
    ]),
    ('ds', 'Data Structures', [
        ('arrays', 'Arrays'),
        ('stacks-and-queues', 'Stacks & Queues'),
        ('linked-list', 'Linked Lists'),
        ('trees', 'Trees, BST & Heaps'),
        ('hashing', 'Hashing'),
        ('graphs', 'Graphs (Representation & Traversal)'),
    ]),
    ('algo', 'Algorithms', [
        ('complexity-analysis-and-asymptotic-notations', 'Asymptotic Analysis & Recurrences'),
        ('searching-and-sorting', 'Searching & Sorting'),
        ('divide-and-conquer-method', 'Divide & Conquer'),
        ('greedy-method', 'Greedy Algorithms, MST & Shortest Paths'),
        ('dynamic-programming', 'Dynamic Programming'),
        ('p-and-np-concepts', 'P, NP & Complexity Classes'),
    ]),
    ('toc', 'Theory of Computation', [
        ('finite-automata-and-regular-language', 'Finite Automata & Regular Languages'),
        ('push-down-automata-and-context-free-language', 'PDA & Context-Free Languages'),
        ('recursively-enumerable-language-and-turing-machine', 'Turing Machines & RE Languages'),
        ('undecidability', 'Decidability'),
    ]),
    ('cd', 'Compiler Design', [
        ('lexical-analysis', 'Lexical Analysis'),
        ('parsing', 'Parsing'),
        ('syntax-directed-translation', 'Syntax Directed Translation'),
        ('code-generation-and-optimization', 'Intermediate Code, Runtime & Optimization'),
    ]),
    ('os', 'Operating Systems', [
        ('process-concepts-and-cpu-scheduling', 'Processes, Threads & CPU Scheduling'),
        ('synchronization-and-concurrency', 'Synchronization & Concurrency'),
        ('deadlocks', 'Deadlocks'),
        ('memory-management', 'Memory Management & Virtual Memory'),
        ('file-system-io-and-protection', 'File Systems, Disk & I/O'),
    ]),
    ('db', 'Databases', [
        ('er-diagrams', 'ER Model'),
        ('relational-algebra', 'Relational Algebra & Calculus'),
        ('structured-query-language', 'SQL'),
        ('functional-dependencies-and-normalization', 'Functional Dependencies & Normalization'),
        ('transactions-and-concurrency', 'Transactions & Concurrency Control'),
        ('file-structures-and-indexing', 'File Organization & Indexing (B/B+ Trees)'),
    ]),
    ('cn', 'Computer Networks', [
        ('concepts-of-layering', 'Layering (OSI / TCP-IP)'),
        ('data-link-layer-and-switching', 'Data Link Layer, Framing & Error Control'),
        ('lan-technologies-and-wi-fi', 'MAC Protocols, Ethernet & Wi-Fi'),
        ('network-layer', 'Network Layer: IP, Addressing & Subnetting'),
        ('routing-algorithm', 'Routing Algorithms'),
        ('tcp-udp-sockets-and-congestion-control', 'Transport Layer: TCP, UDP & Congestion Control'),
        ('application-layer-protocol', 'Application Layer Protocols'),
        ('network-security', 'Network Security'),
    ]),
    ('se', 'Software Engineering (old syllabus)', [
        ('software-engineering', 'Software Engineering'),
    ]),
    ('web', 'Web Technologies (old syllabus)', [
        ('web-technologies', 'Web Technologies'),
    ]),
]

# ExamSIDE "<subject-slug>/<chapter-slug>" -> (subject id, chapter id)
ES_SUBJECT = {
    'general-aptitude': 'ga', 'algorithms': 'algo', 'compiler-design': 'cd', 'computer-networks': 'cn',
    'computer-organization': 'co', 'data-structures': 'ds', 'database-management-system': 'db',
    'digital-logic': 'dl', 'operating-systems': 'os', 'programming-languages': 'pl',
    'software-engineering': 'se', 'theory-of-computation': 'toc', 'web-technologies': 'web',
}
EM_CHAPTERS = {'calculus', 'linear-algebra', 'probability'}


def es_chapter(slug):
    subj, chap = slug.split('/')
    if subj == 'discrete-mathematics':
        return ('em' if chap in EM_CHAPTERS else 'dm'), chap
    return ES_SUBJECT[subj], chap


CHAPTER_INDEX = {}
for sid, sname, chs in SUBJECTS:
    for cid, cname in chs:
        CHAPTER_INDEX[cid] = (sid, cname)


def chapter_menu():
    """Text list of valid chapter ids for agent prompts."""
    lines = []
    for sid, sname, chs in SUBJECTS:
        lines.append(f'{sname}:')
        for cid, cname in chs:
            lines.append(f'  {cid}  ({cname})')
    return '\n'.join(lines)
