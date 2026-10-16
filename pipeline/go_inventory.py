"""Parse GATE Overflow book text (pdftotext -layout) into an inventory of questions + answer keys."""
import json, re, sys
from collections import Counter, OrderedDict

HDR = re.compile(r'^\s*(\d+)\.(\d+)\.(\d+)\s+(?:([^:|]+?):\s+)?(GATE.+?)\s*(?:\|\s*Question:|:)\s*(.+?)\s*$')
CHAP = re.compile(r'^\s*(\d+)\s{2,}(?:([^:]+?):\s+)?([^:]+?)\s+\((\d+)\)\s*$')
TOPIC = re.compile(r'^\s*(\d+)\.(\d+)\s{2,}(.+?)\s+\((\d+)\)\s*$')
KEYTOK = re.compile(r'(\d+\.\d+\.\d+)\s+(.+?)(?=\s{2,}\d+\.\d+\.\d+\s|\s*$)')


def parse(paths):
    qs = OrderedDict()
    chapters = {}
    for vol, path in enumerate(paths, 1):
        lines = open(path, encoding='utf-8', errors='replace').read().split('\n')
        in_key = False
        cur = None
        for i, line in enumerate(lines):
            line = line.replace('\x0c', '')
            if re.match(r'^\s*\d+\.\d+\.\d+\s+(.+?:\s+)?GATE', line) and 'Question:' not in line and not re.search(r'GA-\d+\s*$', line) and i + 1 < len(lines):
                line = line.rstrip() + ' ' + lines[i + 1].strip()
                lines[i + 1] = ''
            m = CHAP.match(line)
            if m:
                chapters[f'{vol}:{m.group(1)}'] = {'subject': (m.group(2) or m.group(3)).strip(), 'chapter': m.group(3).strip(), 'count': int(m.group(4))}
                in_key = False
                cur = None
                continue
            if re.match(r'^\s*Answer Keys\s*$', line):
                in_key = True
                cur = None
                continue
            if in_key:
                toks = re.findall(r'(\d+\.\d+\.\d+)\s+(\S+(?:\s?[:;]\s?\S+)*)', line)
                if toks:
                    for k, v in toks:
                        k = f'v{vol}:{k}'
                        if k in qs:
                            qs[k]['go_key'] = v.strip()
                    continue
                if line.strip() == '':
                    continue
                in_key = False
            m = HDR.match(line)
            if m:
                k = f'v{vol}:{m.group(1)}.{m.group(2)}.{m.group(3)}'
                cur = k
                qs[k] = {'go_id': k, 'vol': vol, 'topic': (m.group(4) or '').strip(), 'paper': re.sub(r'\s+', ' ', m.group(5).replace('|', ' ')).strip(),
                         'qno': m.group(6).strip(), 'chapter_no': f'{vol}:{m.group(1)}', 'tags': [], 'text': []}
                continue
            if cur and not in_key:
                if 'Answer key' in line:
                    cur = None
                    continue
                qs[cur]['text'].append(line.strip())
    for k, q in qs.items():
        ch = chapters.get(q['chapter_no'], {})
        q['subject'] = ch.get('subject')
        q['chapter'] = ch.get('chapter')
        # last non-empty text line(s) contain tags
        body = [t for t in q['text'] if t]
        tags = []
        while body and re.fullmatch(r'[a-z0-9\-\s.]+', body[-1]) and re.search(r'[a-z]', body[-1]):
            tags = body.pop().split() + tags
        q['tags'] = tags
        q['text'] = ' '.join(body)
    return qs, chapters


if __name__ == '__main__':
    qs, chapters = parse(sys.argv[2:])
    json.dump({'questions': list(qs.values()), 'chapters': chapters}, open(sys.argv[1], 'w'), indent=1)
    print(len(qs), 'questions;', sum(1 for q in qs.values() if 'go_key' in q), 'with keys')
    c = Counter(q['paper'] for q in qs.values())
    for p, n in sorted(c.items()):
        print(f'{n:4d}  {p}')
    for k, v in chapters.items():
        print(k, v)
