"""Select questions needing a second, independent check and write adjudication batches.

usage: make_adjudication.py <scratch_dir> results.json
Selection: reviewer verdict disagree / keys_conflict / ambiguous, low confidence, or an answer that does not
match the keys even though the reviewer said 'agree' (checked programmatically).
"""
import json, os, re, sys
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')

S = os.path.abspath(sys.argv[1])
R = json.load(open(sys.argv[2]))['results']
base = {r['id']: r for r in json.load(open(os.path.join(S, 'base.json')))}
BATCH = 20


def norm_choice(s):
    return ''.join(sorted(set(re.findall(r'[A-H]', (s or '').upper()))))


def nat_range(s):
    s = (s or '').replace(',', '').strip()
    m = re.fullmatch(r'(-?\d+(?:\.\d+)?)\s*(?:to|:)\s*(-?\d+(?:\.\d+)?)', s)
    if m:
        a, b = float(m.group(1)), float(m.group(2))
        return min(a, b), max(a, b)
    m = re.fullmatch(r'-?\d+(?:\.\d+)?', s)
    if m:
        return float(s), float(s)
    return None


def consistent(qtype, ans, key):
    """True / False when comparable, None when the key gives no usable information."""
    if not key or key.strip().upper() in ('N/A', 'TBA', 'SOLVE IT', 'SOLVE IT.', 'SCAN QR', 'SOLVE BY YOURSELF'):
        return None
    if key.strip().upper() == 'X':
        return ans.strip().upper() == 'MTA'
    if qtype in ('MCQ', 'MSQ'):
        k = norm_choice(key.replace(';', ','))
        if not k or not re.fullmatch(r'[A-H\s,;]+', key.strip()):
            return None
        return norm_choice(ans) == k
    if qtype == 'TF':
        kk = key.strip().upper()
        a = ans.strip().upper()
        if kk in ('A', 'TRUE'):
            return a in ('A', 'TRUE')
        if kk in ('B', 'FALSE'):
            return a in ('B', 'FALSE')
        return None
    if qtype == 'NAT':
        k = nat_range(key.split(';')[0])
        a = nat_range(ans)
        if not k or not a:
            return None
        # answer (point or range) must overlap the key range, with a small tolerance
        tol = 1e-6 + 0.005 * max(1.0, abs(k[1]))
        return a[0] <= k[1] + tol and a[1] >= k[0] - tol
    return None


def main():
    picked = []
    reasons = {}
    for qid, res in R.items():
        if res.get('duplicate_of'):
            continue
        r = base.get(qid)
        if not r:
            continue
        qtype = res.get('type') if res['kind'] == 'transcribe' else r['type']
        ans = res.get('answer') or ''
        verdict = (res.get('verdict') or '').strip()
        conf = (res.get('confidence') or '').strip().lower()
        why = []
        if verdict in ('disagree', 'keys_conflict', 'ambiguous'):
            why.append(verdict)
        if verdict == 'nokey' and qtype in ('MCQ', 'MSQ', 'NAT', 'TF'):
            why.append('single-source')
        if conf.startswith('low'):
            why.append('low-confidence')
        if conf.startswith('medium') and qtype in ('NAT', 'MSQ', 'MCQ'):
            why.append('medium-confidence')
        keys = r['keys']
        checks = {}
        for name in ('examside', 'gateoverflow'):
            c = consistent(qtype, ans, keys.get(name) or '')
            if c is not None:
                checks[name] = c
        if verdict == 'agree' and checks and not all(checks.values()):
            why.append('agree-but-mismatch:' + ','.join(k for k, v in checks.items() if not v))
        # Conflicts the reviewer traced to a different option order in the GATE Overflow book (same value, other
        # letter) are resolved when the reviewer's answer matches the ExamSIDE key for the stored options.
        note = res.get('note') or ''
        es_ok = consistent(qtype, ans, keys.get('examside') or '')
        if es_ok and re.search(r'order|reorder|permut|shuffl|different letter|letters? (differ|swap)|same (value|option)', note, re.I):
            why = [w for w in why if w not in ('keys_conflict',) and not w.startswith('agree-but-mismatch')]
        if why:
            picked.append(qid)
            reasons[qid] = why
    out = os.path.join(S, 'adj_batches')
    os.makedirs(out, exist_ok=True)
    os.makedirs(os.path.join(S, 'adj_results'), exist_ok=True)
    tmpl = open('/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline/prompts/adjudicate.md').read()
    mpath = os.path.join(out, 'manifest.json')
    prev = json.load(open(mpath)) if os.path.exists(mpath) else {'manifest': [], 'reasons': {}, 'assigned': {}}
    assigned = prev.get('assigned', {})
    manifest = prev['manifest']
    all_reasons = prev['reasons']
    all_reasons.update(reasons)
    picked = [q for q in picked if q not in assigned]
    picked.sort(key=lambda q: (base[q]['subject'] or '', base[q]['chapter'] or ''))
    start = len(manifest)
    new_batches = []
    for i in range(0, len(picked), BATCH):
        name = f'adj_{start + i // BATCH + 1:03d}'
        new_batches.append(name)
        items = []
        for qid in picked[i:i + BATCH]:
            r, res = base[qid], R[qid]
            if res['kind'] == 'transcribe':
                question, options = res.get('question'), {chr(65 + j): o for j, o in enumerate(res.get('options_list') or [])}
                qtype = res.get('type')
            else:
                question, options = r['question'], {chr(65 + j): o for j, o in enumerate(r['options'])}
                qtype = r['type']
            imgs = [os.path.join(S, 'es_images', f) for f in re.findall(r'<img src="img/es/([^"]+)"', (r.get('question') or '') + ''.join(r.get('options') or []))]
            items.append({
                'id': qid, 'paper': r['paper'], 'question_no': r['qno'], 'type': qtype,
                'question': question, 'options': options, 'images': imgs,
                'scan_image': os.path.join(S, 'go_crops', r['go']['crop']) if r.get('go') and r['go'].get('crop') else None,
                'answer_keys': {k: v for k, v in r['keys'].items() if v and k in ('examside', 'examside_html', 'gateoverflow')},
                'reviewer_answer': res.get('answer'), 'reviewer_verdict': res.get('verdict'),
                'reviewer_confidence': res.get('confidence'), 'reviewer_note': res.get('note'),
                'reviewer_explanation': res.get('explanation'), 'flagged_because': reasons[qid],
            })
        json.dump({'batch': name, 'items': items}, open(os.path.join(out, name + '.json'), 'w'), indent=1, ensure_ascii=False)
        t = (tmpl.replace('{BATCH}', name).replace('{BATCH_FILE}', os.path.join(out, name + '.json'))
             .replace('{N}', str(len(items))).replace('{OUT_FILE}', os.path.join(S, 'adj_results', name + '.txt')))
        open(os.path.join(S, 'instructions', name + '.md'), 'w').write(t)
        manifest.append({'batch': name, 'n': len(items)})
        for it in items:
            assigned[it['id']] = name
    json.dump({'manifest': manifest, 'reasons': all_reasons, 'assigned': assigned}, open(mpath, 'w'), indent=1)
    from collections import Counter
    c = Counter(w.split(':')[0] for q in picked for w in reasons[q])
    print('newly selected', len(picked), 'of', len(R), 'results', dict(c), 'new batches', new_batches, 'total assigned', len(assigned))


if __name__ == '__main__':
    main()
