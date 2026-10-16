"""Parse agent result files (results/<batch>.txt) into JSON and validate them.

usage: parse_results.py <scratch_dir> out.json [batch ...]
"""
import json, os, re, sys

S = os.path.abspath(sys.argv[1])
VALID_TYPES = {'MCQ', 'MSQ', 'NAT', 'TF', 'FIB', 'DESC'}
VALID_VERDICTS = {'agree', 'disagree', 'keys_conflict', 'ambiguous', 'nokey'}

BLOCK = re.compile(r'^### BEGIN (\S+)\s*\n(.*?)\n### END \1\s*$', re.S | re.M)
ORDER = {
    'review': ['ANSWER', 'VERDICT', 'CONFIDENCE', 'SYLLABUS', 'NOTE', 'EXPLANATION'],
    'transcribe': ['DUPLICATE_OF', 'TYPE', 'MARKS', 'CHAPTER', 'FIGURE', 'QUESTION', 'OPTIONS', 'ANSWER', 'VERDICT',
                   'CONFIDENCE', 'SYLLABUS', 'NOTE', 'EXPLANATION'],
}


def parse_block(body, kind):
    """Fields appear in a fixed order; each runs until the next expected header line (EXPLANATION runs to the end)."""
    lines = body.split('\n')
    found = []
    i = 0
    for name in ORDER[kind]:
        for j in range(i, len(lines)):
            if re.match(r'^%s:' % name, lines[j]):
                found.append((name, j))
                i = j + 1
                break
    fields = {}
    for k, (name, j) in enumerate(found):
        nxt = found[k + 1][1] if k + 1 < len(found) else len(lines)
        first = lines[j][len(name) + 1:].strip()
        rest = lines[j + 1:nxt]
        fields[name] = '\n'.join(([first] if first else []) + rest).strip()
    return fields


def parse_options(txt):
    opts = []
    for line in (txt or '').split('\n'):
        m = re.match(r'^\s*\(?([A-H])[\).:]\s?(.*)$', line)
        if m and (len(opts) == ord(m.group(1)) - 65):
            opts.append(m.group(2).strip())
        elif opts and line.strip():
            opts[-1] += '\n' + line.rstrip()
    return opts


def check_answer(qtype, ans, nopts):
    a = (ans or '').strip()
    if not a:
        return 'empty answer'
    if a == 'MTA':
        return None
    if qtype == 'MCQ':
        # a single letter, or several letters when the official key accepted more than one option
        if not re.fullmatch(r'[A-H](\s*(,|or|/)\s*[A-H])*', a):
            return f'MCQ answer not a letter: {a!r}'
        if nopts and any(ord(x) - 65 >= nopts for x in re.findall(r'[A-H]', a)):
            return f'answer {a} beyond {nopts} options'
    elif qtype == 'MSQ':
        if not re.fullmatch(r'[A-H](\s*,\s*[A-H])*', a):
            return f'MSQ answer bad: {a!r}'
    elif qtype == 'NAT':
        if not re.fullmatch(r'-?\d+(\.\d+)?(\s*to\s*-?\d+(\.\d+)?)?', a.replace(',', '')):
            return f'NAT answer bad: {a!r}'
    elif qtype == 'TF':
        if a not in ('True', 'False'):
            return f'TF answer bad: {a!r}'
    return None


def main():
    out_path = sys.argv[2]
    batches = sys.argv[3:]
    manifest = json.load(open(os.path.join(S, 'batches', 'manifest.json')))
    if batches:
        manifest = [m for m in manifest if m['batch'] in batches]
    results = {}
    problems = []
    for m in manifest:
        b = m['batch']
        bj = json.load(open(os.path.join(S, 'batches', b + '.json')))
        items = {it['id']: it for it in bj['items']}
        path = os.path.join(S, 'results', b + '.txt')
        if not os.path.exists(path):
            problems.append((b, '*', 'no result file'))
            continue
        txt = open(path, encoding='utf-8').read()
        seen = set()
        for bm in BLOCK.finditer(txt):
            qid, body = bm.group(1), bm.group(2)
            if qid not in items:
                problems.append((b, qid, 'unknown id'))
                continue
            f = parse_block(body, m['kind'])
            rec = {'batch': b, 'kind': m['kind']}
            rec.update({k.lower(): v for k, v in f.items()})
            it = items[qid]
            if m['kind'] == 'review':
                qtype = it['type']
                nopts = len(it['options'])
            else:
                dup = (f.get('DUPLICATE_OF') or 'none').strip()
                if dup.lower() != 'none':
                    rec['duplicate_of'] = dup
                    results[qid] = rec
                    seen.add(qid)
                    continue
                # "DUPLICATE_OF: none" must not survive as a truthy field (make_adjudication skips duplicates)
                rec.pop('duplicate_of', None)
                qtype = (f.get('TYPE') or '').strip().upper()
                rec['type'] = qtype
                if qtype not in VALID_TYPES:
                    problems.append((b, qid, f'bad type {qtype!r}'))
                rec['options_list'] = parse_options(f.get('OPTIONS'))
                nopts = len(rec['options_list'])
                if qtype in ('MCQ', 'MSQ') and nopts < 2:
                    problems.append((b, qid, f'{qtype} with {nopts} options'))
                if not f.get('QUESTION'):
                    problems.append((b, qid, 'empty question'))
            err = check_answer(qtype, f.get('ANSWER'), nopts)
            if err:
                problems.append((b, qid, err))
            v = (f.get('VERDICT') or '').strip()
            if v not in VALID_VERDICTS:
                problems.append((b, qid, f'bad verdict {v!r}'))
            if len(f.get('EXPLANATION') or '') < 40:
                problems.append((b, qid, 'explanation too short'))
            if qid in seen:
                problems.append((b, qid, 'duplicate block'))
            seen.add(qid)
            results[qid] = rec
        missing = [i for i in items if i not in seen]
        for i in missing:
            problems.append((b, i, 'missing'))
    json.dump({'results': results, 'problems': problems}, open(out_path, 'w'), indent=1, ensure_ascii=False)
    print('parsed', len(results), 'problems', len(problems))
    for p in problems[:60]:
        print('  ', p)


if __name__ == '__main__':
    main()
