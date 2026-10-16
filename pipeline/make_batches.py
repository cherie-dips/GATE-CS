"""Split the base question list into agent batches.

usage: make_batches.py <scratch_dir> base.json
Creates <scratch>/batches/es_NNN.json (review existing questions) and go_NNN.json (transcribe GO-only questions).
"""
import html as htmllib
import json, os, re, sys
from collections import defaultdict
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from taxonomy import SUBJECTS, CHAPTER_INDEX

S = os.path.abspath(sys.argv[1])
base = json.load(open(sys.argv[2]))
BATCH_ES, BATCH_GO = 35, 25
img_dir = os.path.join(S, 'es_images')
crop_dir = os.path.join(S, 'go_crops')
out = os.path.join(S, 'batches')
os.makedirs(out, exist_ok=True)

chap_order = {}
for sid, sname, chs in SUBJECTS:
    for cid, cname in chs:
        chap_order[cid] = len(chap_order)
subject_name = {sid: sname for sid, sname, _ in SUBJECTS}


def plain(h, n=400):
    s = re.sub(r'<[^>]+>', ' ', h or '')
    s = htmllib.unescape(re.sub(r'\s+', ' ', s)).strip()
    return s[:n]


def images_of(r):
    blobs = [r.get('question') or ''] + list(r.get('options') or [])
    files = []
    for b in blobs:
        for f in re.findall(r'<img src="img/es/([^"]+)"', b):
            files.append(os.path.join(img_dir, f))
    return files


def year_key(r):
    return (r.get('year') or 0, r.get('set') or 0, r.get('paper') or '')


# unmatched ExamSIDE questions are duplicate candidates for GO-only transcriptions (same year)
es_unmatched_by_year = defaultdict(list)
for r in base:
    if r['src'] == 'examside' and not r.get('go'):
        es_unmatched_by_year[r.get('year')].append({'id': r['id'], 'paper': r['es_paper'], 'type': r['type'],
                                                     'text': plain(r['question'], 300),
                                                     'options': [plain(o, 80) for o in r['options']]})

es_groups = defaultdict(list)
go_groups = defaultdict(list)
for r in base:
    if r['src'] == 'examside':
        es_groups[r['subject'] or 'zz'].append(r)
    else:
        go_groups[r['subject'] or 'zz'].append(r)

manifest = []
n = 0
SUBJ_IDS = [x[0] for x in SUBJECTS]
for cid in sorted(es_groups, key=lambda s_: SUBJ_IDS.index(s_) if s_ in SUBJ_IDS else 99):
    rs = sorted(es_groups[cid], key=lambda r: (chap_order.get(r['chapter'], 999), year_key(r)))
    k = max(1, round(len(rs) / BATCH_ES + 0.49))
    size = -(-len(rs) // k)
    for i in range(0, len(rs), size):
        chunk = rs[i:i + size]
        n += 1
        name = f'es_{n:03d}'
        items = []
        for r in chunk:
            items.append({
                'id': r['id'], 'paper': r['paper'], 'question_no': r['qno'], 'type': r['type'], 'marks': r['marks'],
                'subject': subject_name.get(r['subject']), 'chapter': CHAPTER_INDEX.get(r['chapter'], (None, None))[1],
                'question_html': r['question'],
                'options': {chr(65 + j): o for j, o in enumerate(r['options'])},
                'images': images_of(r),
                'answer_keys': {k2: v for k2, v in r['keys'].items() if v and k2 != 'examside_chapter_pdf'},
                'reference_explanation_html': r.get('es_explanation'),
                'original_scan': os.path.join(crop_dir, r['go']['crop']) if r.get('go') and r['go'].get('crop') else None,
            })
        json.dump({'batch': name, 'kind': 'review', 'chapter': cid, 'items': items}, open(os.path.join(out, name + '.json'), 'w'), indent=1, ensure_ascii=False)
        manifest.append({'batch': name, 'kind': 'review', 'chapter': cid, 'n': len(items)})

n = 0
for sid in sorted(go_groups, key=lambda s: [x[0] for x in SUBJECTS].index(s) if s in [x[0] for x in SUBJECTS] else 99):
    rs = sorted(go_groups[sid], key=lambda r: (chap_order.get(r['chapter'], 999), year_key(r)))
    k = max(1, round(len(rs) / BATCH_GO + 0.49))
    size = -(-len(rs) // k)
    for i in range(0, len(rs), size):
        chunk = rs[i:i + size]
        n += 1
        name = f'go_{n:03d}'
        items = []
        for r in chunk:
            items.append({
                'id': r['id'], 'paper': r['paper'], 'question_no': r['qno'],
                'scan_image': os.path.join(crop_dir, r['go']['crop']),
                'gateoverflow_topic': f"{r['go']['subject']} / {r['go']['chapter']} / {r['go']['topic']}",
                'gateoverflow_tags': r['go']['tags'],
                'suggested_chapter': r['chapter'],
                'answer_keys': {'gateoverflow': r['keys'].get('gateoverflow')},
                'year': r.get('year'),
            })
        years = sorted({r.get('year') for r in chunk if es_unmatched_by_year.get(r.get('year'))})
        dupc = {str(y): es_unmatched_by_year[y] for y in years}
        json.dump({'batch': name, 'kind': 'transcribe', 'subject': sid, 'items': items,
                   'possible_duplicates_by_year': dupc}, open(os.path.join(out, name + '.json'), 'w'), indent=1, ensure_ascii=False)
        manifest.append({'batch': name, 'kind': 'transcribe', 'subject': sid, 'n': len(items)})

json.dump(manifest, open(os.path.join(out, 'manifest.json'), 'w'), indent=1)
print('review batches', sum(1 for m in manifest if m['kind'] == 'review'), 'transcribe batches', sum(1 for m in manifest if m['kind'] == 'transcribe'))
print('sizes', sorted(m['n'] for m in manifest)[:5], '...', sorted(m['n'] for m in manifest)[-5:])
