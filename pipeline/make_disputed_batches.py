"""Collect not-yet-reviewed ExamSIDE questions whose answer is in doubt into new review batches (dsp_NNN).

In doubt = the ExamSIDE and GATE Overflow keys conflict, only one key exists, the GO key is a numeric range,
or the question is descriptive. Questions where both keys agree are left as key-only.

usage: make_disputed_batches.py <scratch_dir> [batch_size] [--rest]
Appends dsp_NNN entries (kind review) to batches/manifest.json; re-running is a no-op once they exist.
--rest instead collects every remaining unreviewed ExamSIDE question (keys agree) into rem_NNN batches.
"""
import json, os, re, sys

args = [a for a in sys.argv[1:] if not a.startswith('--')]
rest = '--rest' in sys.argv
prefix = 'rem' if rest else 'dsp'
S = os.path.abspath(args[0])
size = int(args[1]) if len(args) > 1 else 34
mpath = os.path.join(S, 'batches', 'manifest.json')
manifest = json.load(open(mpath))
if any(m['batch'].startswith(prefix + '_') for m in manifest):
    sys.exit(prefix + ' batches already exist')


def norm(s):
    return re.sub(r'[\s()]', '', str(s or '')).upper()


def in_doubt(it):
    k = it.get('answer_keys') or {}
    es, go = norm(k.get('examside')), norm(k.get('gateoverflow'))
    if it.get('type') == 'DESC':
        return True
    if not go or go == 'N/A' or not es or es == 'SOLVEIT':
        return True
    if es == go or es.replace(',', ';') == go:
        return False
    return True  # conflicting keys, or a GO numeric range to check against


done, todo = set(), []
for m in manifest:
    p = os.path.join(S, 'results', m['batch'] + '.txt')
    if os.path.exists(p):
        done |= set(re.findall(r'^### END (\S+)', open(p, encoding='utf-8').read(), re.M))
for m in manifest:
    if m['kind'] != 'review' or m['batch'].startswith(('dsp_', 'rem_')):
        continue
    for it in json.load(open(os.path.join(S, 'batches', m['batch'] + '.json')))['items']:
        if it['id'] not in done and (rest or in_doubt(it)):
            todo.append((m.get('chapter') or '', it))

todo.sort(key=lambda x: (x[0], x[1]['paper'], str(x[1]['question_no'])))
nb = -(-len(todo) // size)
per = -(-len(todo) // nb)
for i in range(nb):
    chunk = todo[i * per:(i + 1) * per]
    name = '%s_%03d' % (prefix, i + 1)
    json.dump({'batch': name, 'items': [it for _, it in chunk]},
              open(os.path.join(S, 'batches', name + '.json'), 'w'), indent=1, ensure_ascii=False)
    manifest.append({'batch': name, 'kind': 'review', 'chapter': chunk[0][0], 'n': len(chunk)})
json.dump(manifest, open(mpath, 'w'), indent=1)
print('selected', len(todo), 'batches', nb, 'of ~', per)
