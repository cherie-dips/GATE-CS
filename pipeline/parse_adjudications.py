"""Parse adjudication outputs into adjudications.json {id: {...}}.

usage: parse_adjudications.py <scratch_dir> out.json
"""
import json, os, re, sys

S = os.path.abspath(sys.argv[1])
ORDER = ['FINAL_ANSWER', 'DECISION', 'CONFIDENCE', 'SOURCE_MISMATCH', 'NOTE', 'EXPLANATION_ACTION', 'EXPLANATION']
BLOCK = re.compile(r'^### BEGIN (\S+)\s*\n(.*?)\n### END \1\s*$', re.S | re.M)
out, problems = {}, []
man = json.load(open(os.path.join(S, 'adj_batches', 'manifest.json')))
for m in man['manifest']:
    path = os.path.join(S, 'adj_results', m['batch'] + '.txt')
    ids = [it['id'] for it in json.load(open(os.path.join(S, 'adj_batches', m['batch'] + '.json')))['items']]
    if not os.path.exists(path):
        problems.append((m['batch'], 'no result file'))
        continue
    txt = open(path, encoding='utf-8').read()
    seen = set()
    for bm in BLOCK.finditer(txt):
        qid, body = bm.group(1), bm.group(2)
        lines = body.split('\n')
        found, i = [], 0
        for name in ORDER:
            for j in range(i, len(lines)):
                if re.match(r'^%s:' % name, lines[j]):
                    found.append((name, j))
                    i = j + 1
                    break
        f = {}
        for k, (name, j) in enumerate(found):
            nxt = found[k + 1][1] if k + 1 < len(found) else len(lines)
            first = lines[j][len(name) + 1:].strip()
            f[name] = '\n'.join(([first] if first else []) + lines[j + 1:nxt]).strip()
        rec = {'final_answer': f.get('FINAL_ANSWER', '').strip(), 'decision': f.get('DECISION', '').strip(),
               'confidence': f.get('CONFIDENCE', '').strip()}
        if f.get('SOURCE_MISMATCH', '').strip().lower().startswith('yes'):
            rec['source_mismatch'] = True
        note = f.get('NOTE', '').strip()
        if note and note.lower() != 'none':
            rec['note'] = note
        if f.get('EXPLANATION_ACTION', '').strip().lower().startswith('replace') and len(f.get('EXPLANATION', '')) > 40:
            rec['explanation'] = f['EXPLANATION']
        rec['verdict'] = {'key_correct': 'agree', 'reviewer_correct': 'key-corrected', 'keys_conflict_resolved': 'keys-resolved',
                          'marks_to_all': 'mta', 'ambiguous': 'ambiguous'}.get(rec['decision'], rec['decision'])
        if not rec['final_answer']:
            problems.append((m['batch'], qid, 'no final answer'))
            continue
        out[qid] = rec
        seen.add(qid)
    for q in ids:
        if q not in seen:
            problems.append((m['batch'], q, 'missing'))
json.dump(out, open(sys.argv[2], 'w'), indent=1, ensure_ascii=False)
print('adjudicated', len(out), 'problems', len(problems))
for p in problems[:30]:
    print('  ', p)
