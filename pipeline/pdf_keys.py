"""Download ExamGOAL chapter + paper PDFs and extract answer keys mapped to question ids.

Each PDF question carries a hyperlink to questions.examside.com/past-years/gate/question/<qid>,
so the i-th distinct qid (in page order) is answer-key entry i.

usage: pdf_keys.py lists.json out.json
"""
import json, os, re, sys, subprocess, tempfile
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
import fetch as F
import fitz

PDFBASE = 'https://pdf.questions.examgoal.com'


def ordered_qids(doc):
    seen, out = set(), []
    for page in doc:
        links = sorted([l for l in page.get_links() if 'uri' in l], key=lambda l: (l['from'].y0, l['from'].x0))
        for l in links:
            m = re.search(r'questions\.examside\.com/past-years/gate/question/([^?/#]+)', l['uri'])
            if m and m.group(1) not in seen:
                seen.add(m.group(1))
                out.append(m.group(1))
    return out


def answer_key(doc, n):
    """Answer key entries are 'k. value' lines in order 1..n; values may be blank or wrap lines."""
    text = '\n'.join(page.get_text('text') for page in doc)
    i = text.rfind('\nAnswer Key')
    if i < 0:
        return {}
    key_txt = text[i:]
    j = key_txt.find('For numerical answers')
    if j > 0:
        key_txt = key_txt[:j]
    key_txt += '\n'
    pos = []
    cur = 0
    for k in range(1, n + 1):
        m = re.compile(r'\n%d\.[ \n]' % k).search(key_txt, cur)
        if not m:
            break
        pos.append((k, m.start(), m.end()))
        cur = m.end() - 1
    entries = {}
    for idx, (k, s0, e0) in enumerate(pos):
        e1 = pos[idx + 1][1] if idx + 1 < len(pos) else len(key_txt)
        lines = [l.strip() for l in key_txt[e0:e1].split('\n')]
        lines = [l for l in lines if l and not re.fullmatch(r'(Marks \d+|General Aptitude|GATE CSE|Section .*)', l)]
        v = re.sub(r'\s+', ' ', ' '.join(lines)).strip()
        v = v.split('Keep practising on the ExamGOAL app')[0].strip()
        v = re.sub(r'(\d)\.$', r'\1', v)
        entries[k] = v
    return entries


def process(kind, slug):
    url = f'{PDFBASE}/download/{kind}/gate/gate-cse/{slug}/en.pdf'
    data = F.fetch(url, binary=True, ext='pdf')
    if not data or not data.startswith(b'%PDF'):
        return {'url': url, 'error': 'not a pdf'}
    doc = fitz.open(stream=data, filetype='pdf')
    qids = ordered_qids(doc)
    keys = answer_key(doc, len(qids))
    res = {'url': url, 'n_qids': len(qids), 'n_keys': len(keys), 'map': {}}
    for idx, q in enumerate(qids, 1):
        if idx in keys:
            res['map'][q] = keys[idx]
    return res


def main():
    lists = json.load(open(sys.argv[1]))
    out = {'chapters': {}, 'papers': {}}
    for c in lists['chapters']:
        slug = c['path'].replace('/past-years/gate/gate-cse/', '')
        r = process('chapter', slug)
        out['chapters'][slug] = r
        print('chapter', slug, r.get('n_qids'), r.get('n_keys'), r.get('error', ''), flush=True)
    for p in lists['papers']:
        slug = p['path'].split('/')[-1]
        r = process('paper', slug)
        out['papers'][slug] = r
        print('paper', slug, r.get('n_qids'), r.get('n_keys'), r.get('error', ''), flush=True)
    json.dump(out, open(sys.argv[2], 'w'), indent=1)


if __name__ == '__main__':
    main()
