"""Fetch every ExamSIDE question page (each page carries several question cards). Cached + polite."""
import json, re, sys
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from fetch import fetch

BASE = 'https://questions.examside.com'
lists = json.load(open(sys.argv[1]))
seen, pages = set(), []
todo = []
for p in lists['papers']:
    for r in p['rows']:
        todo.append(r['href'])
for c in lists['chapters']:
    for r in c['rows']:
        todo.append(r['href'])


def qid_of(href):
    last = href.rstrip('/').split('/')[-1].replace('.htm', '')
    return last.split('-')[-1].lower()


n = 0
for href in todo:
    if qid_of(href) in seen:
        continue
    h = fetch(BASE + href)
    n += 1
    if h is None:
        print('404', href, flush=True)
        continue
    ids = re.findall(r'data-qid="([^"]+)"', h)
    for i in ids:
        seen.add(i.lower())
    pages.append({'href': href, 'qids': ids})
    if n % 50 == 0:
        print(n, 'pages', len(seen), 'qids', flush=True)
json.dump(pages, open(sys.argv[2], 'w'), indent=1)
print('done', n, 'pages', len(seen), 'qids')
