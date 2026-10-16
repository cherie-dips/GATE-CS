"""Parse official GATE CS answer keys (2022–2026, from the IIT Guwahati GATE archive) and compare them with
the bank's answers.

usage: official_keys.py <scratch_dir> <questions.json | -> out.json
  Without questions.json ('-'), only checks the mapping against the GATE Overflow keys in base.json.
"""
import json, os, re, subprocess, sys
from collections import defaultdict

S = os.path.abspath(sys.argv[1])
OFF = os.path.join(S, 'raw', 'official')
FILES = {
    'Answer_keys2022_cs_2022.pdf': 'GATE CSE 2022',
    'Answer_keys2023_CS_ANS_GATE2023.pdf': 'GATE CSE 2023',
    '2024_CS1FinalAnswerKey.pdf': 'GATE CSE 2024 Set 1',
    '2024_CS2FinalAnswerKey.pdf': 'GATE CSE 2024 Set 2',
    '2025_Key_CS1_Keys.pdf': 'GATE CSE 2025 Set 1',
    '2025_Key_CS2_Keys.pdf': 'GATE CSE 2025 Set 2',
    '2026_Keys_CS1_Keys.pdf': 'GATE CSE 2026 Set 1',
    '2026_Keys_CS2_Keys.pdf': 'GATE CSE 2026 Set 2',
}
ROW = re.compile(r'^\s*(\d{1,2})\s+\d\s+(MCQ|MSQ|NAT)\s+(\S+)\s+(.+?)\s+(\d)\s*$')


def parse(path):
    txt = subprocess.run(['pdftotext', '-layout', path, '-'], capture_output=True, text=True).stdout
    rows = {}
    for line in txt.split('\n'):
        m = ROW.match(line)
        if m:
            q = int(m.group(1))
            rows[q] = {'type': m.group(2), 'section': m.group(3), 'key': re.sub(r'\s+', ' ', m.group(4)).strip(), 'marks': int(m.group(5))}
    return rows


def norm_key(qtype, key):
    k = key.strip().upper()
    if k in ('MTA', 'MARKS TO ALL'):
        return ('mta',)
    if qtype in ('MCQ', 'MSQ'):
        alts = re.split(r'\s+OR\s+', k)
        return ('opts', tuple(sorted(''.join(sorted(set(re.findall(r'[A-H]', a)))) for a in alts)))
    parts = re.split(r'\s+OR\s+', k)
    rngs = []
    for part in parts:
        m = re.fullmatch(r'(-?[\d.]+)\s*(?:TO\s*(-?[\d.]+))?', part.strip())
        if not m:
            rngs = None
            break
        lo = float(m.group(1))
        hi = float(m.group(2)) if m.group(2) else lo
        rngs.append((min(lo, hi), max(lo, hi)))
    if rngs and len(rngs) > 1:
        return ('ranges', tuple(rngs))
    m = re.fullmatch(r'(-?[\d.]+)\s*TO\s*(-?[\d.]+)', k)
    if m:
        return ('range', float(m.group(1)), float(m.group(2)))
    try:
        v = float(k)
        return ('range', v, v)
    except ValueError:
        return ('raw', k)


def bank_answer_matches(q, nk):
    a = q.get('a') or {}
    if nk[0] == 'mta':
        return bool(a.get('mta'))
    if nk[0] == 'opts':
        if a.get('mta'):
            return False
        mine = ''.join(sorted(chr(65 + i) for i in a.get('opts', [])))
        accepted = nk[1]
        if q.get('t') == 'MCQ' and len(accepted) > 1:   # official "A OR B": bank must accept exactly those
            return sorted(mine) == sorted(''.join(accepted))
        return mine in accepted or (len(accepted) == 1 and mine == accepted[0])
    if nk[0] == 'ranges':
        alts = [(a.get('lo'), a.get('hi'))] + [tuple(x) for x in a.get('alt', [])]
        return sorted(alts) == sorted(nk[1])
    if nk[0] == 'range':
        if a.get('lo') is None:
            return False
        tol = 1e-9
        return a['lo'] >= nk[1] - tol and a['hi'] <= nk[2] + tol or (abs(a['lo'] - nk[1]) < 1e-6 and abs(a['hi'] - nk[2]) < 1e-6) \
            or (nk[1] - tol <= a['lo'] <= nk[2] + tol and nk[1] - tol <= a['hi'] <= nk[2] + tol)
    return None


def main():
    official = {paper: parse(os.path.join(OFF, f)) for f, paper in FILES.items() if os.path.exists(os.path.join(OFF, f))}
    for p, rows in official.items():
        print(p, len(rows), 'rows')
    report = {'papers': {}, 'mismatches': []}
    if sys.argv[2] != '-':
        bank = json.load(open(sys.argv[2]))['questions']
        by_paper = defaultdict(dict)
        for q in bank:
            if q.get('n'):
                by_paper[q['p']][str(q['n'])] = q
        for paper, rows in official.items():
            ok = bad = missing = 0
            for qn, row in sorted(rows.items()):
                our_n = f'GA.{qn}' if row['section'] == 'GA' else str(qn - 10)
                q = by_paper.get(paper, {}).get(our_n)
                if not q:
                    missing += 1
                    report['mismatches'].append({'paper': paper, 'official_q': qn, 'our_n': our_n, 'problem': 'not in bank (no question number link)', 'official': row})
                    continue
                nk = norm_key(row['type'], row['key'])
                res = bank_answer_matches(q, nk)
                if res:
                    ok += 1
                else:
                    bad += 1
                    report['mismatches'].append({'paper': paper, 'official_q': qn, 'id': q['id'], 'type': q['t'], 'bank_answer': q.get('a'),
                                                 'official': row})
            report['papers'][paper] = {'ok': ok, 'mismatch': bad, 'unmapped': missing}
            print(f'{paper:24s} ok={ok:3d} mismatch={bad:2d} unmapped={missing:2d}')
    json.dump({'official': official, **report}, open(sys.argv[3], 'w'), indent=1)


if __name__ == '__main__':
    main()
