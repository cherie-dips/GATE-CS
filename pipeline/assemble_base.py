"""Merge ExamSIDE records, PDF answer keys and the GATE Overflow inventory into one base list.

usage: assemble_base.py <scratch_dir> base.json
Inputs (in scratch_dir): es_parsed.json, pdfkeys.json, go_match.json, raw/go/go_inventory.json,
                         go_crops_index.json, es_images_map.json
"""
import json, os, re, sys
from collections import Counter, defaultdict
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from taxonomy import es_chapter, CHAPTER_INDEX

S = sys.argv[1]
es = json.load(open(os.path.join(S, 'es_parsed.json')))
pdfkeys = json.load(open(os.path.join(S, 'pdfkeys.json')))
M = json.load(open(os.path.join(S, 'go_match.json')))
inv = json.load(open(os.path.join(S, 'raw/go/go_inventory.json')))['questions']
crops = json.load(open(os.path.join(S, 'go_crops_index.json')))
imgmap = json.load(open(os.path.join(S, 'es_images_map.json'))) if os.path.exists(os.path.join(S, 'es_images_map.json')) else {}

matches = M['matches']
go_by_id = {g['go_id']: g for g in inv}

# ---------------------------------------------------------------- keys + chapter membership
paper_key, chapter_key, chapter_of = {}, {}, {}
for slug, v in pdfkeys['chapters'].items():
    for i, (qid, k) in enumerate(v['map'].items()):
        chapter_key[qid] = k
        chapter_of[qid] = (slug, i)
for slug, v in pdfkeys['papers'].items():
    for i, (qid, k) in enumerate(v['map'].items()):
        paper_key[qid] = k


def norm_paper(p):
    p = re.sub(r'\s+', ' ', p.replace('|', ' ').replace('Set-', 'Set ')).strip()
    ga = False
    if p.endswith(' GA'):
        p, ga = p[:-3], True
    return p, ga


def paper_meta(p):
    m = re.match(r'GATE (CSE|IT) (\d{4})(?: Set (\d))?$', p)
    if not m:
        return {'exam': None, 'year': None, 'set': None}
    return {'exam': m.group(1), 'year': int(m.group(2)), 'set': int(m.group(3)) if m.group(3) else None}


def es_type(q):
    return {'mcq': 'MCQ', 'mcqm': 'MSQ', 'integer': 'NAT', 'subjective': 'DESC', 't/f': 'TF', 'fill-blanks': 'FIB'}[q['es_type']]


def localize(html):
    if not html:
        return html
    def rep(m):
        u = m.group(1)
        return f'<img src="img/es/{imgmap[u]}">' if u in imgmap else m.group(0)
    return re.sub(r'<img src="([^"]+)">', rep, html)


# ---------------------------------------------------------------- exact duplicates inside ExamSIDE
dups = set()
seen = {}
for q in es:
    sig = (q['question_html'], tuple(q['options_html']))
    if sig in seen:
        other = seen[sig]
        # keep the one matched to GATE Overflow (else the first one)
        drop = q['qid'] if (other in matches or q['qid'] not in matches) else other
        if drop == other:
            seen[sig] = q['qid']
        dups.add(drop)
    else:
        seen[sig] = q['qid']

# ---------------------------------------------------------------- GO topic -> chapter votes (from matched pairs)
topic_votes = defaultdict(Counter)
for qid, m in matches.items():
    if qid in chapter_of:
        sid, cid = es_chapter(chapter_of[qid][0])
        g = go_by_id[m['go_id']]
        topic_votes[(g['subject'], g['chapter'], g['topic'])][cid] += 1
        topic_votes[(g['subject'], g['chapter'], None)][cid] += 1

GO_CHAPTER_DEFAULT = {
    ('General Aptitude', 'Verbal Aptitude'): 'verbal-ability',
    ('General Aptitude', 'Quantitative Aptitude'): 'numerical-ability',
    ('General Aptitude', 'Analytical Aptitude'): 'logical-reasoning',
    ('General Aptitude', 'Spatial Aptitude'): 'spatial-aptitude',
}


def guess_chapter(g):
    d = GO_CHAPTER_DEFAULT.get((g['subject'], g['chapter']))
    if d and not topic_votes.get((g['subject'], g['chapter'], g['topic'])):
        return d
    for key in [(g['subject'], g['chapter'], g['topic']), (g['subject'], g['chapter'], None)]:
        if topic_votes.get(key):
            return topic_votes[key].most_common(1)[0][0]
    return d


# two ExamSIDE questions are not filed under any chapter there
MANUAL_CHAPTER = {'40599udkwrzo0fg': 'process-concepts-and-cpu-scheduling', '40599uckwrzo0j7': 'relational-algebra'}

# ---------------------------------------------------------------- build
base = []
for q in es:
    if q['qid'] in dups:
        continue
    m = matches.get(q['qid'])
    paper = q['paper']
    qno = None
    go = None
    if m:
        gp, ga = m['go_paper'], bool(m.get('ga'))   # go_paper is already normalised; GA flag comes from the match
        paper = gp
        qno = m['qno']
        g = go_by_id[m['go_id']]
        go = {'id': m['go_id'], 'key': g.get('go_key'), 'topic': g['topic'], 'tags': g['tags'], 'score': m['score'],
              'crop': crops.get(m['go_id'], {}).get('file'), 'ga': ga}
    slug = chapter_of.get(q['qid'], (None, 0))[0]
    if slug:
        sid, cid = es_chapter(slug)
    else:
        sid, cid = (None, None)
    rec = {
        'id': 'es_' + q['qid'], 'src': 'examside', 'qid': q['qid'], 'paper': paper, **paper_meta(paper), 'qno': qno,
        'es_paper': q['paper'], 'subject': sid, 'chapter': cid,
        'type': es_type(q), 'marks': q['marks'], 'negative': q['negative'],
        'question': localize(q['question_html']),
        'options': [localize(o) for o in q['options_html']],
        'keys': {'examside': paper_key.get(q['qid']) or chapter_key.get(q['qid']),
                 'examside_chapter_pdf': chapter_key.get(q['qid']),
                 'examside_html': (q['answer_text'] or '').replace('Correct answer is', '').strip() or None,
                 'gateoverflow': go['key'] if go else None},
        'es_explanation': localize(q['explanation_html']),
        'go': go,
    }
    if not slug and q['qid'] in MANUAL_CHAPTER:
        rec['subject'], rec['chapter'] = CHAPTER_INDEX[MANUAL_CHAPTER[q['qid']]][0], MANUAL_CHAPTER[q['qid']]
    elif not slug:
        rec['flags'] = ['no-chapter']
    base.append(rec)

go_only = []
for g in M['unmatched_go']:
    p, ga = norm_paper(g['paper'])
    if not re.match(r'GATE (CSE|IT) \d{4}', p):
        continue  # GATE DA / other-branch GA papers are not part of the CSE bank
    cid = guess_chapter(g)
    rec = {
        'id': 'go_' + g['go_id'].replace(':', '_'), 'src': 'gateoverflow', 'paper': p, **paper_meta(p), 'qno': g['qno'],
        'subject': CHAPTER_INDEX[cid][0] if cid else None, 'chapter': cid,
        'type': None, 'marks': None, 'negative': None,
        'question': None, 'options': [],
        'keys': {'gateoverflow': g.get('go_key')},
        'go': {'id': g['go_id'], 'key': g.get('go_key'), 'topic': g['topic'], 'tags': g['tags'],
               'subject': g['subject'], 'chapter': g['chapter'], 'text': g['text'],
               'crop': crops.get(g['go_id'], {}).get('file'), 'ga': ga},
    }
    go_only.append(rec)
    base.append(rec)

json.dump(base, open(sys.argv[2], 'w'), indent=1, ensure_ascii=False)
print('examside kept', sum(1 for r in base if r['src'] == 'examside'), 'dups dropped', len(dups))
print('go-only', len(go_only), 'without crop', sum(1 for r in go_only if not r['go']['crop']),
      'without chapter guess', sum(1 for r in go_only if not r['chapter']))
print('papers', Counter(r['exam'] for r in base))
print('by subject', Counter(r['subject'] for r in base).most_common())
