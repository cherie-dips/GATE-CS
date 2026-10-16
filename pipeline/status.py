"""Batch status: launched / finished / blocks written; prints the next batches to launch.

usage: status.py <scratch_dir> [n_next]
"""
import json, os, re, sys
S = sys.argv[1]
n_next = int(sys.argv[2]) if len(sys.argv) > 2 else 0
m = json.load(open(os.path.join(S, 'batches', 'manifest.json')))
size = {x['batch']: x['n'] for x in m}
launched = [l.strip() for l in open(os.path.join(S, 'launched.txt')) if l.strip()]
done_blocks = {}
for b in size:
    p = os.path.join(S, 'results', b + '.txt')
    done_blocks[b] = len(re.findall(r'^### END ', open(p).read(), re.M)) if os.path.exists(p) else 0
complete = [b for b in launched if done_blocks[b] >= size[b]]
running = [b for b in launched if b not in complete]
order = []
es = [b for b in size if b.startswith('es_')]
go = [b for b in size if b.startswith('go_')]
for i in range(max(len(es), len(go))):
    for lst in (go, es):
        if i < len(lst):
            order.append(lst[i])
todo = [b for b in order if b not in launched]
print(f'blocks {sum(done_blocks.values())}/{sum(size.values())} | complete {len(complete)} | running {len(running)} | not launched {len(todo)}')
print('running:', ' '.join(f'{b}({done_blocks[b]}/{size[b]})' for b in running))
if n_next:
    print('NEXT:', ' '.join(todo[:n_next]))
