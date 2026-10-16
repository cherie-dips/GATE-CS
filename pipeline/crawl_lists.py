"""Crawl ExamSIDE GATE CSE chapter lists and year-wise paper lists (polite, cached)."""
import json, re, sys
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from fetch import fetch

BASE = 'https://questions.examside.com'
OUT = sys.argv[1]


def rows(html):
    """Yield (section_id, section_title, href, index, paper_badge) for preview rows."""
    out = []
    for sec in re.finditer(r'<section class="[^"]*" id="([^"]+)"><h2 class="section-title">(.*?)<span', html, flags=re.S):
        start = sec.end()
        nxt = html.find('<section class=', start)
        body = html[start: nxt if nxt > 0 else len(html)]
        for r in re.finditer(r'<a class="preview-row" href="([^"]+)"><span class="preview-index">(\d+)</span>(.*?)</a>', body, flags=re.S):
            badge = re.search(r'<span class="badge badge-neutral">(.*?)</span>', r.group(3))
            out.append({'section': sec.group(1), 'section_title': re.sub(r'\s+', ' ', sec.group(2)).strip(),
                        'href': r.group(1), 'index': int(r.group(2)), 'paper': badge.group(1).strip() if badge else None})
    return out


root = fetch(BASE + '/past-years/gate/gate-cse')
chapters = sorted(set(re.findall(r'href="(/past-years/gate/gate-cse/[^/"]+/[^/"]+)"', root)))
data = {'chapters': [], 'papers': []}
for c in chapters:
    h = fetch(BASE + c)
    subj = re.search(r'<div class="sidebar-title">(.*?)</div>', h).group(1).strip()
    title = re.search(r'<h1 class="page-title">(.*?)</h1>', h).group(1).strip()
    oos = 'out of syllabus' in h.lower() or 'OutOfSyllabus' in h and 'cp-oos' in h
    rs = rows(h)
    data['chapters'].append({'path': c, 'subject': subj, 'chapter': title, 'rows': rs, 'oos_hint': oos})
    print(f'{len(rs):4d} {subj} / {title}', flush=True)

yw = fetch(BASE + '/past-years/year-wise/gate/gate-cse')
papers = sorted(set(re.findall(r'href="(/past-years/year-wise/gate/gate-cse/gate-cse-[^/"]+)"', yw)))
for p in papers:
    h = fetch(BASE + p)
    title = re.search(r'<h1 class="page-title">(.*?)</h1>', h).group(1).strip()
    rs = rows(h)
    data['papers'].append({'path': p, 'paper': title, 'rows': rs})
    print(f'{len(rs):4d} {title}  sections={sorted(set(r["section_title"] for r in rs))}', flush=True)

json.dump(data, open(OUT, 'w'), indent=1)
print('chapters', len(data['chapters']), 'chapter rows', sum(len(c['rows']) for c in data['chapters']),
      'papers', len(data['papers']), 'paper rows', sum(len(p['rows']) for p in data['papers']))
