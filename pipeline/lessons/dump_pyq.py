"""Dump one chapter's questions (text, options, key, start of our explanation) as plain text for lesson writers.

Usage: python3 pipeline/lessons/dump_pyq.py <subject id> <chapter id> <out.md>
"""
import html
import json
import re
import sys
from pathlib import Path

BANK = Path(__file__).resolve().parents[2] / 'app/public/data/questions.json'


def clean(s):
    if not s:
        return ''
    s = re.sub(r'<img[^>]*>', ' [figure] ', s)
    s = re.sub(r'</p>|<br\s*/?>|</li>|</tr>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).strip()


def main(subject, chapter, out):
    bank = json.loads(BANK.read_text())
    num = lambda q: int(q['n']) if str(q.get('n', '')).isdigit() else 0
    qs = sorted((q for q in bank['questions'] if q.get('s') == subject and q['c'] == chapter),
                key=lambda q: (q['y'], q.get('set') or '', num(q)))
    with open(out, 'w') as f:
        for q in qs:
            old = ' | OLD SYLLABUS' if q.get('oos') else ''
            f.write(f"=== {q['id']} | {q['p']} Q{q.get('n', '?')} | {q['t']} | {q['m']} marks | tags {q.get('tags')}{old}\n")
            f.write(clean(q['q']) + '\n')
            for i, o in enumerate(q.get('o') or []):
                f.write(f"  ({'ABCD'[i] if i < 4 else i}) {clean(o)}\n")
            f.write(f"ANSWER: {q.get('a')}  official={q.get('official')}\n")
            e = q.get('e') or ''
            f.write('EXPLANATION (ours): ' + e[:900].replace('\n', ' ') + ('…' if len(e) > 900 else '') + '\n\n')
    print(f'{subject}/{chapter}: {len(qs)} questions -> {out}')


if __name__ == '__main__':
    main(*sys.argv[1:4])
