"""Build app/public/data/questions.json from the base list + agent results (+ adjudications).

usage: build_app_data.py <scratch_dir> results.json [adjudications.json] [textfixes.json]
"""
import datetime, html as htmllib, json, os, re, shutil, sys
from collections import Counter, defaultdict
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from taxonomy import SUBJECTS, CHAPTER_INDEX

S = os.path.abspath(sys.argv[1])
APP = '/Users/diptidhawade/Plaksha/Code/Projects/GATE/app/public'
base = json.load(open(os.path.join(S, 'base.json')))
R = json.load(open(sys.argv[2]))['results']
ADJ = json.load(open(sys.argv[3])) if len(sys.argv) > 3 and os.path.exists(sys.argv[3]) else {}
FIX = json.load(open(sys.argv[4])) if len(sys.argv) > 4 and os.path.exists(sys.argv[4]) else {}
# hand-curated decisions (pipeline/overrides.json): applied last, documented with a reason each
OVR = json.load(open('/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline/overrides.json'))

SHORT = {'ga': 'General Aptitude', 'em': 'Engineering Maths', 'dm': 'Discrete Maths', 'dl': 'Digital Logic',
         'co': 'COA', 'pl': 'Programming in C', 'ds': 'Data Structures', 'algo': 'Algorithms', 'toc': 'Theory of Computation',
         'cd': 'Compiler Design', 'os': 'Operating Systems', 'db': 'Databases', 'cn': 'Computer Networks',
         'se': 'Software Engg (old)', 'web': 'Web Tech (old)'}

stats = Counter()


def letters_to_idx(s):
    return sorted({ord(x) - 65 for x in re.findall(r'[A-H]', s.upper())})


def parse_nat(s):
    s = (s or '').replace(',', '').strip()
    m = re.fullmatch(r'(-?\d+(?:\.\d+)?)\s*(?:to|:|–|-(?=\s))\s*(-?\d+(?:\.\d+)?)', s)
    if m:
        lo, hi = float(m.group(1)), float(m.group(2))
        return {'lo': min(lo, hi), 'hi': max(lo, hi)}
    m = re.fullmatch(r'-?\d+(?:\.\d+)?', s)
    if m:
        v = float(s)
        return {'lo': v, 'hi': v}
    return None


def encode_answer(qtype, ans, nopts):
    a = (ans or '').strip()
    if a.upper() == 'MTA':
        return {'mta': True}
    if qtype in ('MCQ', 'MSQ'):
        # strictly a list of option letters ("C", "A, C", "A;C", "B or D"); anything else is not an answer
        if not re.fullmatch(r'\(?[A-H]\)?(\s*(,|;|/|or|and|&)\s*\(?[A-H]\)?)*', a, re.I):
            return None
        idx = [i for i in letters_to_idx(a) if i < max(nopts, 1)]
        return {'opts': idx} if idx else None
    if qtype == 'TF':
        if re.fullmatch(r'[AB]', a):
            return {'opts': [ord(a) - 65]}
        if a.lower().startswith('true'):
            return {'opts': [0]}
        if a.lower().startswith('false'):
            return {'opts': [1]}
        return None
    if qtype == 'NAT':
        return parse_nat(a)
    return {'text': a} if a else None


def key_answer(r):
    """Fallback answer from source keys when no agent result exists (only well-formed keys are used)."""
    k = r['keys']
    es, go = (k.get('examside') or '').strip(), (k.get('gateoverflow') or '').strip()
    if r['type'] in ('MCQ', 'MSQ', 'TF'):
        for v in (es, go.replace(';', ',')):
            if re.fullmatch(r'[A-H](\s*,\s*[A-H])*', v):
                return v
        return None
    if r['type'] == 'NAT':
        for v in (es, k.get('examside_html') or '', go.replace(':', ' to ')):
            if parse_nat(v):
                return v
        return None
    return es or k.get('examside_html')


def norm_md(s):
    return (s or '').strip()


def fix_html_entities_in_tex(h):
    return h


# official final answer keys (2022-2026): authoritative for NAT ranges and marks-to-all; MCQ/MSQ disagreements are reported
from official_keys import parse as parse_official, norm_key, FILES as OFFICIAL_FILES
OFFICIAL = {}
for fname, paper in OFFICIAL_FILES.items():
    fp = os.path.join(S, 'raw', 'official', fname)
    if os.path.exists(fp):
        for qn, row in parse_official(fp).items():
            OFFICIAL[(paper, f'GA.{qn}' if row['section'] == 'GA' else str(qn - 10))] = row
official_conflicts = []

img_needed = set()
crop_needed = set()
out = []
dup_links = {}

# first pass: transcription duplicates -> link to existing ExamSIDE question
for r in base:
    res = R.get(r['id'])
    if r['src'] == 'gateoverflow' and res and res.get('duplicate_of'):
        dup_links[res['duplicate_of'].strip()] = r
by_id = {r['id']: r for r in base}

for r in base:
    res = R.get(r['id'])
    ovr = OVR.get(r['id'], {})
    adj = None if ovr.get('ignore_adjudication') else ADJ.get(r['id'])
    if r['src'] == 'gateoverflow' and res and res.get('duplicate_of'):
        if res['duplicate_of'].strip() in by_id:
            stats['go_duplicate_dropped'] += 1
            continue
    q = {'id': r['id'], 'p': r['paper'], 'ex': r['exam'], 'y': r['year'], 'set': r['set'], 'n': r['qno']}
    if r.get('go') and r['go'].get('ga') and q['n'] and not str(q['n']).startswith('GA'):
        q['n'] = f"GA.{q['n']}"   # GA sections (2014+) are numbered separately from the technical questions
    if r['src'] == 'examside':
        if adj and adj.get('source_mismatch'):
            # the GATE Overflow entry matched to this question is a different question: use ExamSIDE's label
            q['p'] = r['es_paper']
            mm = re.match(r'GATE (CSE|IT) (\d{4})(?: Set (\d))?$', r['es_paper'])
            q['ex'], q['y'], q['set'] = (mm.group(1), int(mm.group(2)), int(mm.group(3)) if mm.group(3) else None) if mm else (q['ex'], q['y'], q['set'])
            q['n'] = None
            stats['source_mismatch'] += 1
        link = dup_links.get(r['id'])
        if link and not q['n']:
            q['n'] = link['qno']
            q['p'] = link['paper']
            q['ex'], q['y'], q['set'] = link['exam'], link['year'], link['set']
        q.update({'s': r['subject'], 'c': r['chapter'], 't': r['type'], 'm': r['marks'], 'neg': r['negative'] or 0,
                  'q': r['question'], 'qf': 'html', 'o': r['options'], 'of': 'html'})
        fx = FIX.get(r['id'])
        if fx:
            if fx.get('action') == 'fix' and fx.get('question_html'):
                q['q'] = fx['question_html']
                if fx.get('options'):
                    q['o'] = fx['options']
                stats['text_fixed'] += 1
            elif fx.get('action') == 'scan' and r.get('go') and r['go'].get('crop'):
                q['scan'] = f"img/go/{r['go']['crop']}"
                q['fig'] = True
                crop_needed.add(r['go']['crop'])
                stats['scan_added'] += 1
            ch = fx.get('chapter')
            if ch and ch in CHAPTER_INDEX and ch != q['c']:
                q['s'], q['c'] = CHAPTER_INDEX[ch][0], ch
                stats['chapter_fixed'] += 1
        for blob in [r['question']] + r['options']:
            img_needed.update(re.findall(r'<img src="img/es/([^"]+)"', blob or ''))
        if r['type'] == 'TF' and not r['options']:
            q['o'], q['of'] = ['True', 'False'], 'md'
    else:
        if not res:
            # not transcribed yet: include as a scan-only question graded with the GATE Overflow key
            g, key = r['go'], (r['keys'].get('gateoverflow') or '').strip()
            tags = set(g.get('tags') or [])
            if re.fullmatch(r'[A-E](;[A-E])+', key):
                qtype = 'MSQ'
            elif re.fullmatch(r'[A-E]', key):
                qtype = 'MCQ'
            elif key in ('True', 'False'):
                qtype = 'TF'
            elif 'numerical-answers' in tags or re.fullmatch(r'-?[\d.]+(\s*:\s*-?[\d.]+)?', key):
                qtype = 'NAT'
            else:
                qtype = 'DESC'
            marks = 1 if 'one-mark' in tags else 2 if 'two-marks' in tags else None
            opts = ['Option A', 'Option B', 'Option C', 'Option D'] if qtype in ('MCQ', 'MSQ') else (['True', 'False'] if qtype == 'TF' else [])
            if qtype in ('MCQ', 'MSQ') and 'E' in key:
                opts.append('Option E')
            q.update({'s': r['subject'], 'c': r['chapter'], 't': qtype, 'm': marks,
                      'neg': round(marks / 3, 2) if qtype == 'MCQ' and marks and (r['year'] or 0) >= 2003 else 0,
                      'q': '_The question is shown in the original scan below; options A–D refer to the options printed there._',
                      'qf': 'md', 'o': opts, 'of': 'md', 'scan': f"img/go/{g['crop']}", 'fig': True, 'scanOnly': True})
            crop_needed.add(g['crop'])
            if key.upper() == 'X':
                enc = {'mta': True}
            elif qtype in ('MCQ', 'MSQ'):
                enc = {'opts': letters_to_idx(key)}
            elif qtype == 'TF':
                enc = {'opts': [0 if key == 'True' else 1]}
            elif qtype == 'NAT':
                enc = parse_nat(key.replace(':', ' to ').split(';')[0]) or {'text': key}
            else:
                enc = {'text': 'No official key (descriptive question)'}
            q['a'] = enc
            q['e'] = '_A worked explanation has not been written for this question yet._'
            q['v'] = 'scan-only'
            if g.get('ga'):
                q['ga'] = True
            off = OFFICIAL.get((q['p'], str(q['n']))) if q.get('n') else None
            if off:
                nk = norm_key(off['type'], off['key'])
                if nk[0] == 'range':
                    q['t'], q['a'] = 'NAT', {'lo': nk[1], 'hi': nk[2]}
                elif nk[0] == 'mta':
                    q['a'] = {'mta': True}
            q = {k: v for k, v in q.items() if v not in (None, '', [], False)}
            out.append(q)
            stats['go_scan_only'] += 1
            stats['questions'] += 1
            continue
        qtype = res.get('type') or 'DESC'
        chap = (res.get('chapter') or '').strip()
        if chap not in CHAPTER_INDEX:
            chap = r['chapter']
        try:
            marks = float(re.findall(r'[\d.]+', res.get('marks') or '')[0])
            marks = int(marks) if marks == int(marks) else marks
        except (IndexError, ValueError):
            marks = None
        opts = res.get('options_list') or []
        if qtype == 'TF' and not opts:
            opts = ['True', 'False']
        neg = 0
        if qtype == 'MCQ' and (r['year'] or 0) >= 2003 and marks in (1, 2):
            neg = round(marks / 3, 2)
        q.update({'s': CHAPTER_INDEX[chap][0], 'c': chap, 't': qtype, 'm': marks, 'neg': neg,
                  'q': norm_md(res.get('question')), 'qf': 'md', 'o': [norm_md(o) for o in opts], 'of': 'md'})
        crop = r['go']['crop']
        q['scan'] = f'img/go/{crop}'
        crop_needed.add(crop)
        if (res.get('figure') or '').strip().lower().startswith('essential'):
            q['fig'] = True

    # ---------------- answer + explanation
    ans_src = None
    if adj and adj.get('final_answer'):
        ans_txt = adj['final_answer']
        ans_src = 'adjudicated'
    elif res and res.get('answer'):
        ans_txt = res['answer']
        ans_src = 'review'
    else:
        ans_txt = key_answer(r) if r['src'] == 'examside' else None
        ans_src = 'key'
    enc = encode_answer(q['t'], ans_txt, len(q['o']))
    if enc is None and q['t'] == 'NAT' and ans_txt and ans_src != 'key':
        # a "numerical" question whose answer is not a number (e.g. a matrix): make it self-graded
        q['t'] = 'FIB'
        enc = {'text': ans_txt}
        stats['nat_to_fib'] += 1
    if enc is None and r['src'] == 'examside':
        enc = encode_answer(q['t'], key_answer(r), len(q['o']))
    if enc is None:
        enc = {'text': ans_txt or 'See explanation'}
        stats['answer_unencodable'] += 1
    q['a'] = enc
    off = OFFICIAL.get((q['p'], str(q['n']))) if q.get('n') else None
    if off:
        nk = norm_key(off['type'], off['key'])
        q['official'] = off['key']
        if nk[0] == 'mta':
            if not enc.get('mta'):
                official_conflicts.append((q['id'], q['p'], q.get('n'), 'MTA', enc))
            q['a'] = {'mta': True}
            stats['official_mta'] += 1
        elif nk[0] in ('range', 'ranges') and q['t'] in ('NAT', 'FIB'):
            rngs = [(nk[1], nk[2])] if nk[0] == 'range' else list(nk[1])
            mine = (enc.get('lo'), enc.get('hi'))
            inside = mine[0] is not None and any(lo - 1e-9 <= mine[0] <= hi + 1e-9 for lo, hi in rngs)
            if not inside:
                official_conflicts.append((q['id'], q['p'], q.get('n'), off['key'], enc))
            q['t'] = 'NAT'
            q['a'] = {'lo': rngs[0][0], 'hi': rngs[0][1]}
            if len(rngs) > 1:
                q['a']['alt'] = [list(x) for x in rngs[1:]]
            stats['official_range'] += 1
        elif nk[0] == 'opts':
            mine = ''.join(sorted(chr(65 + i) for i in enc.get('opts', [])))
            accepted = nk[1]
            if q['t'] == 'MCQ' and len(accepted) > 1:
                ok = sorted(mine) == sorted(''.join(accepted))
            else:
                ok = mine in accepted
            if not ok:
                official_conflicts.append((q['id'], q['p'], q.get('n'), off['key'], enc))
            stats['official_choice_checked'] += 1
    if q['t'] in ('MCQ', 'MSQ', 'TF') and 'opts' not in q['a'] and 'mta' not in q['a']:
        stats['choice_without_opts'] += 1

    expl = None
    if adj and adj.get('explanation'):
        expl = adj['explanation']
    elif res and res.get('explanation'):
        expl = res['explanation']
    if not expl and r['src'] == 'examside' and r.get('es_explanation'):
        # convert stored HTML explanation to markdown-compatible HTML (marked passes raw HTML through)
        expl = re.sub(r'\\\((.*?)\\\)', lambda m: '$' + htmllib.unescape(m.group(1)) + '$', r['es_explanation'], flags=re.S)
        expl = re.sub(r'\\\[(.*?)\\\]', lambda m: '$$' + htmllib.unescape(m.group(1)) + '$$', expl, flags=re.S)
        stats['fallback_es_explanation'] += 1
        for f in re.findall(r'<img src="img/es/([^"]+)"', expl):
            img_needed.add(f)
    if not expl:
        expl = '_Explanation not available yet._'
        stats['no_explanation'] += 1
    q['e'] = expl

    verdict = (adj or {}).get('verdict') or (res or {}).get('verdict') or ''
    note = (adj or {}).get('note') or ''
    if not note and res and verdict in ('disagree', 'keys_conflict', 'ambiguous'):
        n = (res.get('note') or '').strip()
        if n and n.lower() != 'none':
            note = n
    if note:
        q['note'] = note
    q['v'] = verdict or ('key-only' if ans_src == 'key' else '')
    syl = ((res or {}).get('syllabus') or '').strip().lower()
    if q['s'] in ('se', 'web') or syl.startswith('outside'):
        q['oos'] = True
    tags = []
    if r.get('go'):
        tags = [t for t in (r['go'].get('tags') or []) if not re.match(r'(gate|gatecse|gateit)[-\d]', t) and t not in ('normal', 'easy', 'difficult', 'one-mark', 'two-marks', 'numerical-answers', 'descriptive', 'multiple-selects')]
        if r['go'].get('ga'):
            q['ga'] = True
            if q.get('n') and not str(q['n']).startswith('GA'):
                q['n'] = f"GA.{q['n']}"
    if q['s'] == 'ga' and r['src'] == 'examside' and (r['year'] or 0) >= 2014:
        q['ga'] = True
    if tags:
        q['tags'] = tags
    if r['src'] == 'examside' and res and re.search(r'garbl|missing|incomplete|unclear figure|figure (is )?missing|not shown', res.get('note') or '', re.I) and r.get('go') and r['go'].get('crop'):
        q['scan'] = f"img/go/{r['go']['crop']}"
        crop_needed.add(r['go']['crop'])
    if ovr:
        if 'n' in ovr:
            q['n'] = ovr['n']
        if 'note' in ovr:
            q['note'] = ovr['note']
        if 'answer' in ovr:
            q['a'] = encode_answer(q['t'], ovr['answer'], len(q['o'])) or q['a']
        if 'chapter' in ovr and ovr['chapter'] in CHAPTER_INDEX:
            q['s'], q['c'] = CHAPTER_INDEX[ovr['chapter']][0], ovr['chapter']
        stats['override'] += 1
    q = {k: v for k, v in q.items() if v not in (None, '', [], False)}
    out.append(q)
    stats['questions'] += 1
    stats['src_' + r['src']] += 1

# ---------------------------------------------------------------- papers / subjects / meta
papers = defaultdict(lambda: {'count': 0})
for q in out:
    p = papers[q['p']]
    p['count'] += 1
    p['id'] = q['p']
    p['exam'] = q.get('ex')
    p['year'] = q.get('y')
    p['set'] = q.get('set')
paper_list = sorted(papers.values(), key=lambda p: (-(p['year'] or 0), p['exam'] or '', p['set'] or 0))
subjects = []
used_ch = Counter(q.get('c') for q in out)
for sid, sname, chs in SUBJECTS:
    chapters = [{'id': cid, 'name': cname, 'count': used_ch[cid]} for cid, cname in chs if used_ch[cid]]
    if chapters:
        subjects.append({'id': sid, 'name': sname, 'short': SHORT.get(sid, sname), 'chapters': chapters})
years = sorted({q['y'] for q in out if q.get('y')})
meta = {
    'generated': datetime.date.today().isoformat(),
    'total': len(out),
    'paperCount': len(paper_list),
    'yearRange': f'{years[0]}–{years[-1]}' if years else '',
    'sources': 'ExamSIDE (questions.examside.com) and the GATE Overflow GATE CSE book (gateoverflow.in); answers cross-checked and explanations written by Claude',
}
os.makedirs(os.path.join(APP, 'data'), exist_ok=True)
json.dump({'meta': meta, 'subjects': subjects, 'papers': paper_list, 'questions': out},
          open(os.path.join(APP, 'data', 'questions.json'), 'w'), ensure_ascii=False, separators=(',', ':'))

# ---------------------------------------------------------------- images
for sub, names, src in [('es', img_needed, os.path.join(S, 'es_images_opt')), ('go', crop_needed, os.path.join(S, 'go_crops'))]:
    d = os.path.join(APP, 'img', sub)
    os.makedirs(d, exist_ok=True)
    for n in names:
        if not os.path.exists(os.path.join(d, n)) and os.path.exists(os.path.join(src, n)):
            shutil.copy2(os.path.join(src, n), os.path.join(d, n))
json.dump(official_conflicts, open(os.path.join(S, 'official_conflicts.json'), 'w'), indent=1)
print('official-key conflicts:', len(official_conflicts))
for c in official_conflicts[:20]:
    print('   ', c)
print(dict(stats))
print('papers', len(paper_list), 'subjects', len(subjects), 'images', len(img_needed), 'scans', len(crop_needed))
