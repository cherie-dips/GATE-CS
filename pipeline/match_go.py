"""Match ExamSIDE questions to the GATE Overflow inventory (same paper, text similarity).

usage: match_go.py es_parsed.json go_inventory.json out.json
"""
import difflib, html, json, re, sys
from collections import defaultdict


def norm_paper(p):
    p = p.replace('Set-', 'Set ').replace('|', ' ')
    p = re.sub(r'\s+', ' ', p).strip()
    ga = p.endswith(' GA')
    if ga:
        p = p[:-3]
    return p, ga


def words(s):
    s = re.sub(r'\\\(.*?\\\)|\\\[.*?\\\]', ' ', s or '', flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html.unescape(s).lower()
    return re.findall(r'[a-z]{2,}', s)


def main():
    es = json.load(open(sys.argv[1]))
    go = json.load(open(sys.argv[2]))['questions']
    es_by_paper = defaultdict(list)
    for q in es:
        es_by_paper[q['paper']].append(q)
    go_by_paper = defaultdict(list)
    for g in go:
        p, ga = norm_paper(g['paper'])
        g['_paper'], g['_ga'] = p, ga
        go_by_paper[p].append(g)
    matches = {}
    report = {}
    def score_pairs(eqs, gqs, ew, gw, floor):
        pairs = []
        for q in eqs:
            a = ew[q['qid']]
            sa = set(a)
            for g in gqs:
                b = gw[g['go_id']]
                sb = set(b)
                if not sa or not sb:
                    continue
                jac = len(sa & sb) / len(sa | sb)
                if jac < floor:
                    continue
                r = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
                pairs.append((0.6 * r + 0.4 * jac, q['qid'], g['go_id']))
        pairs.sort(reverse=True)
        return pairs

    used_e, used_g = set(), set()
    for paper, eqs in es_by_paper.items():
        gqs = list(go_by_paper.get(paper, []))
        ym = re.match(r'GATE CSE (200[4-8])$', paper)
        if ym:  # ExamSIDE files many GATE IT 2004-08 questions under the CSE paper of that year
            gqs += go_by_paper.get('GATE IT ' + ym.group(1), [])
        ew = {q['qid']: words(q['question_html']) + words(' '.join(q['options_html'])) for q in eqs}
        gw = {g['go_id']: words(g['text']) for g in gqs}
        n0 = len(matches)
        for score, e, g in score_pairs(eqs, gqs, ew, gw, 0.15):
            if e in used_e or g in used_g or score < 0.35:
                continue
            used_e.add(e)
            used_g.add(g)
            matches[e] = {'go_id': g, 'score': round(score, 3)}
        report[paper] = {'es': len(eqs), 'go': len(gqs), 'matched': len(matches) - n0}
    # second pass: leftovers against every unmatched GO question (mislabelled year/paper), strict threshold
    left_e = [q for q in es if q['qid'] not in used_e]
    left_g = [g for g in go if g['go_id'] not in used_g and re.match(r'GATE (CSE|IT) ', g['_paper'])]
    ew = {q['qid']: words(q['question_html']) + words(' '.join(q['options_html'])) for q in left_e}
    gw = {g['go_id']: words(g['text']) for g in left_g}
    for score, e, g in score_pairs(left_e, left_g, ew, gw, 0.3):
        if e in used_e or g in used_g or score < 0.6:
            continue
        used_e.add(e)
        used_g.add(g)
        matches[e] = {'go_id': g, 'score': round(score, 3), 'cross_paper': True}
    go_by_id = {g['go_id']: g for g in go}
    for e, m in matches.items():
        g = go_by_id[m['go_id']]
        m.update({'go_paper': g['_paper'], 'qno': g['qno'], 'go_key': g.get('go_key'), 'go_topic': g['topic'], 'go_subject': g['subject'],
                  'go_chapter': g['chapter'], 'go_tags': g['tags'], 'ga': g['_ga']})
    matched_go = {m['go_id'] for m in matches.values()}
    unmatched_go = [g for g in go if g['go_id'] not in matched_go]
    json.dump({'matches': matches, 'unmatched_go': unmatched_go, 'report': report}, open(sys.argv[3], 'w'), indent=1)
    tot = sum(v['es'] for v in report.values())
    print('es', tot, 'matched', len(matches))
    for p in sorted(report):
        v = report[p]
        print(f"{p:28s} es={v['es']:3d} go={v['go']:3d} matched={v['matched']:3d}")


if __name__ == '__main__':
    main()
