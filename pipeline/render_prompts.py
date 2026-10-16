"""Render one instruction file per batch from the prompt templates.

usage: render_prompts.py <scratch_dir>
"""
import json, os, sys
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from taxonomy import chapter_menu

S = os.path.abspath(sys.argv[1])
P = '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline/prompts'
tmpl = {'review': open(os.path.join(P, 'review.md')).read(), 'transcribe': open(os.path.join(P, 'transcribe.md')).read()}
os.makedirs(os.path.join(S, 'instructions'), exist_ok=True)
os.makedirs(os.path.join(S, 'results'), exist_ok=True)
for m in json.load(open(os.path.join(S, 'batches', 'manifest.json'))):
    b = m['batch']
    t = tmpl[m['kind']]
    t = (t.replace('{BATCH}', b).replace('{BATCH_FILE}', os.path.join(S, 'batches', b + '.json'))
          .replace('{N}', str(m['n'])).replace('{OUT_FILE}', os.path.join(S, 'results', b + '.txt'))
          .replace('{CHAPTER_MENU}', chapter_menu()))
    open(os.path.join(S, 'instructions', b + '.md'), 'w').write(t)
print('ok')
