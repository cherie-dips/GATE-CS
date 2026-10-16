"""Parse cached ExamSIDE question pages into structured question records.

usage: parse_examside.py lists.json - out.json
"""
import html as htmllib
import json, re, sys
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
from fetch import fetch
from mjx2tex import convert

BASE = 'https://questions.examside.com'
STATS = {'math': 0, 'math_warn': 0, 'merror': 0}


def math_to_tex(fragment):
    """Replace every <mjx-container> in an HTML fragment with \\( tex \\) or \\[ tex \\]."""
    def rep(m):
        tex, display, warn = convert(m.group(0))
        STATS['math'] += 1
        if warn:
            STATS['math_warn'] += 1
        if tex.startswith('\x01'):
            STATS['merror'] += 1
            tex = tex[1:]
        tex = htmllib.escape(tex, quote=False)
        return ('\\[' + tex + '\\]') if display else ('\\(' + tex + '\\)')
    return re.sub(r'<mjx-container.*?</mjx-container>', rep, fragment, flags=re.S)


def clean(fragment):
    if fragment is None:
        return None
    s = math_to_tex(fragment)
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    # keep the original-resolution image URL when one is given
    def img(m):
        tag = m.group(0)
        orig = re.search(r'data-orsrc="([^"]+)"', tag)
        src = orig.group(1) if orig else (re.search(r'src="([^"]+)"', tag) or [None, None])[1]
        return f'<img src="{src}">' if src else ''
    s = re.sub(r'<img\b[^>]*>', img, s)
    s = re.sub(r'\s+(class|style|data-[\w-]+|loading|alt)="[^"]*"', '', s)
    s = re.sub(r'<(span|div)>\s*</\1>', '', s)
    return s.strip()


def text_of(fragment):
    s = re.sub(r'<mjx-container.*?</mjx-container>', ' ', fragment or '', flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', htmllib.unescape(s)).strip()


SECTION = re.compile(r'<h2 class="q-section-title"[^>]*>(.*?)</h2>\s*<div class="question q-prose"><!-- HTML_TAG_START -->(.*?)<!-- HTML_TAG_END --></div>', re.S)


def parse_card(card):
    q = {}
    q['qid'] = re.search(r'data-qid="([^"]+)"', card).group(1)
    q['es_type'] = re.search(r'data-type="([^"]+)"', card).group(1)
    pm = re.search(r'<div class="q-paper">(.*?)</div>', card)
    q['paper'] = pm.group(1).strip() if pm else None
    tm = re.search(r'<span class="q-chip q-chip-type">(.*?)</span>', card)
    q['type_label'] = tm.group(1).strip() if tm else None
    mp = re.search(r'marks-plus">\+?([\d.]+)</span>', card)
    mm = re.search(r'marks-minus">[−-]?([\d.]+)</span>', card)
    q['marks'] = float(mp.group(1)) if mp else None
    q['negative'] = float(mm.group(1)) if mm else None
    body = re.search(r'<div class="q-body">.*?<div class="question q-prose"><!-- HTML_TAG_START -->(.*?)<!-- HTML_TAG_END --></div>', card, re.S)
    q['question_raw'] = body.group(1) if body else ''
    opts = re.findall(r'<div class="option" data-option="(\d+)"[^>]*>\s*<span class="option-badge">(.*?)</span>\s*<div class="option-content question"><!-- HTML_TAG_START -->(.*?)<!-- HTML_TAG_END --></div>', card, re.S)
    q['options_raw'] = [o[2] for o in opts]
    q['option_labels'] = [o[1].strip() for o in opts]
    q['answer_raw'] = None
    q['explanation_raw'] = None
    for title, content in SECTION.findall(card):
        t = title.strip().lower()
        if t == 'answer':
            q['answer_raw'] = content
        elif t == 'explanation':
            q['explanation_raw'] = content
    return q


def main():
    lists = json.load(open(sys.argv[1]))
    import glob, os
    cache = os.environ.get('GATE_RAW', '/private/tmp/claude-501/-Users-diptidhawade-Plaksha-Code-Projects-GATE/8d662bfb-fe3f-4cfb-b9dc-aa5d7b3a5856/scratchpad/raw/examside')
    records = {}
    for f in sorted(glob.glob(os.path.join(cache, '*', '*.html'))):
        h = open(f, encoding='utf-8', errors='replace').read()
        if 'question-component card' not in h:
            continue
        parts = h.split('<div class="question-component card"')[1:]
        for part in parts:
            card = '<div class="question-component card"' + part
            try:
                q = parse_card(card)
            except Exception as e:  # noqa
                print('card parse failed', f, e)
                continue
            if q['qid'] not in records:
                records[q['qid']] = q
    # classification from chapter listings / ordering from paper listings
    def qid_of(href):
        last = href.rstrip('/').split('/')[-1].replace('.htm', '')
        return last.split('-')[-1]
    low = {k.lower(): k for k in records}
    for c in lists['chapters']:
        for i, r in enumerate(c['rows']):
            k = low.get(qid_of(r['href']).lower())
            if not k:
                print('missing chapter row', r['href'])
                continue
            rec = records[k]
            rec.setdefault('chapters', []).append({'subject': htmllib.unescape(c['subject']), 'chapter': htmllib.unescape(c['chapter']),
                                                    'path': c['path'], 'pos': i, 'section': r['section']})
    for pp in lists['papers']:
        for i, r in enumerate(pp['rows']):
            k = low.get(qid_of(r['href']).lower())
            if not k:
                print('missing paper row', r['href'])
                continue
            rec = records[k]
            rec.setdefault('papers', []).append({'paper': pp['paper'], 'path': pp['path'], 'pos': i,
                                                 'section': r['section_title']})
    out = []
    for k, q in records.items():
        q['question_html'] = clean(q.pop('question_raw'))
        q['options_html'] = [clean(o) for o in q.pop('options_raw')]
        q['answer_text'] = text_of(q.pop('answer_raw')) if q.get('answer_raw') else None
        ex = q.pop('explanation_raw')
        q['explanation_html'] = None if (ex is None or 'Currently no explanation available' in ex) else clean(ex)
        out.append(q)
    json.dump(out, open(sys.argv[3], 'w'), indent=1, ensure_ascii=False)
    print(len(out), 'records', STATS)


if __name__ == '__main__':
    main()
