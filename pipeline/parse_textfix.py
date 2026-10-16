"""Parse text-fix outputs into textfixes.json {id: {action, changes, question_html?, options?}}.

usage: parse_textfix.py <scratch_dir> out.json
"""
import json, os, re, sys

S = os.path.abspath(sys.argv[1])
BLOCK = re.compile(r'^### BEGIN (\S+)\s*\n(.*?)\n### END \1\s*$', re.S | re.M)
man = json.load(open(os.path.join(S, 'fix_batches', 'manifest.json')))
out, problems = {}, []
for m in man['manifest']:
    items = {it['id']: it for it in json.load(open(os.path.join(S, 'fix_batches', m['batch'] + '.json')))['items']}
    path = os.path.join(S, 'fix_results', m['batch'] + '.txt')
    if not os.path.exists(path):
        problems.append((m['batch'], 'no result file'))
        continue
    seen = set()
    for bm in BLOCK.finditer(open(path, encoding='utf-8').read()):
        qid, body = bm.group(1), bm.group(2)
        if qid not in items:
            continue
        am = re.search(r'^ACTION:\s*(\w+)', body, re.M)
        cm = re.search(r'^CHANGES:\s*(.*)$', body, re.M)
        action = am.group(1).lower() if am else 'none'
        rec = {'action': action, 'changes': cm.group(1).strip() if cm else ''}
        chm = re.search(r'^CHAPTER:\s*(\S+)', body, re.M)
        if chm and chm.group(1).lower() != 'keep':
            rec['chapter'] = chm.group(1).strip()
        if action == 'fix':
            qm = re.search(r'^QUESTION_HTML:\s*\n(.*?)\n^OPTIONS:\s*$', body, re.S | re.M)
            om = re.search(r'^OPTIONS:\s*\n(.*)$', body, re.S | re.M)
            if not qm:
                problems.append((m['batch'], qid, 'fix without QUESTION_HTML'))
                continue
            rec['question_html'] = qm.group(1).strip()
            opts = []
            for line in (om.group(1) if om else '').split('\n'):
                mm = re.match(r'^([A-H])\)\s?(.*)$', line)
                if mm and len(opts) == ord(mm.group(1)) - 65:
                    opts.append(mm.group(2).strip())
                elif opts and line.strip():
                    opts[-1] += '\n' + line
            n_orig = len(items[qid]['options'])
            if n_orig and len(opts) != n_orig:
                problems.append((m['batch'], qid, f'option count {len(opts)} != {n_orig}; keeping stored options'))
                opts = None
            rec['options'] = opts
        out[qid] = rec
        seen.add(qid)
    for q in items:
        if q not in seen:
            problems.append((m['batch'], q, 'missing'))
json.dump(out, open(sys.argv[2], 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print('parsed', len(out), Counter(v['action'] for v in out.values()), 'problems', len(problems))
for p in problems[:20]:
    print('  ', p)
