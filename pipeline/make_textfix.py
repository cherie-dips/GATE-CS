"""Select reviewed ExamSIDE questions whose reviewer note points at a text problem; write text-fix batches.

usage: make_textfix.py <scratch_dir> results.json   (incremental, like make_adjudication.py)
"""
import json, os, re, sys
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from taxonomy import chapter_menu

S = os.path.abspath(sys.argv[1])
R = json.load(open(sys.argv[2]))['results']
base = {r['id']: r for r in json.load(open(os.path.join(S, 'base.json')))}
BATCH = 25
STRONG = re.compile(r"(typo|misprint|garbl|missing|omit|should (read|be)|stray|truncat|incomplete|corrupt|mangl|"
                    r"wrong (symbol|sign|number|value|operator|option)|instead of|original (paper|question|exam)[^.]{0,40}"
                    r"(reads|has|says|gives|prints|shows|states|uses)|stored (text|option|question)|figure[^.]{0,30}(missing|absent|not shown)|"
                    r"not shown|image[^.]{0,30}(missing|wrong)|swapped (sub-?questions?|parts?)|lacks|cut off)", re.I)
OPTION_ORDER = re.compile(r"(order|ordering|reorder|permut|shuffl|not a real conflict)", re.I)
CHAPTER_WRONG = re.compile(r"(tagged|filed|classified|listed|placed|categori[sz]ed)[^.]{0,60}(but|actually|really|is a|belongs)|wrong (chapter|subject|topic)|despite the [^.]{0,40}(chapter|tag)", re.I)
NOT_TEXT = re.compile(r"^(none|n/?a)\.?$", re.I)


def main():
    picked = []
    for qid, res in R.items():
        if res.get('kind') != 'review':
            continue
        note = (res.get('note') or '').strip()
        if not note or NOT_TEXT.match(note):
            continue
        if CHAPTER_WRONG.search(note):
            picked.append(qid)
        elif STRONG.search(note) and not (OPTION_ORDER.search(note) and not re.search(r'typo|misprint|garbl|missing|stray|should read', note, re.I)):
            picked.append(qid)
    out = os.path.join(S, 'fix_batches')
    os.makedirs(out, exist_ok=True)
    os.makedirs(os.path.join(S, 'fix_results'), exist_ok=True)
    mpath = os.path.join(out, 'manifest.json')
    prev = json.load(open(mpath)) if os.path.exists(mpath) else {'manifest': [], 'assigned': {}}
    assigned = prev['assigned']
    manifest = prev['manifest']
    picked = sorted(q for q in picked if q not in assigned)
    tmpl = open('/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline/prompts/textfix.md').read()
    start = len(manifest)
    new = []
    for i in range(0, len(picked), BATCH):
        name = f'fix_{start + i // BATCH + 1:03d}'
        new.append(name)
        items = []
        for qid in picked[i:i + BATCH]:
            r, res = base[qid], R[qid]
            imgs = [os.path.join(S, 'es_images', f) for f in re.findall(r'<img src="img/es/([^"]+)"', (r['question'] or '') + ''.join(r['options']))]
            items.append({'id': qid, 'paper': r['paper'], 'question_no': r['qno'], 'type': r['type'], 'chapter': r['chapter'],
                          'question_html': r['question'], 'options': {chr(65 + j): o for j, o in enumerate(r['options'])},
                          'images': imgs,
                          'original_scan': os.path.join(S, 'go_crops', r['go']['crop']) if r.get('go') and r['go'].get('crop') else None,
                          'reviewer_note': res.get('note'), 'reviewer_answer': res.get('answer')})
            assigned[qid] = name
        json.dump({'batch': name, 'items': items}, open(os.path.join(out, name + '.json'), 'w'), indent=1, ensure_ascii=False)
        t = (tmpl.replace('{BATCH}', name).replace('{BATCH_FILE}', os.path.join(out, name + '.json'))
             .replace('{N}', str(len(items))).replace('{OUT_FILE}', os.path.join(S, 'fix_results', name + '.txt'))
             .replace('{CHAPTER_MENU}', chapter_menu()))
        open(os.path.join(S, 'instructions', name + '.md'), 'w').write(t)
        manifest.append({'batch': name, 'n': len(items)})
    json.dump({'manifest': manifest, 'assigned': assigned}, open(mpath, 'w'), indent=1)
    print('newly selected', len(picked), 'new batches', new, 'total assigned', len(assigned))


if __name__ == '__main__':
    main()
