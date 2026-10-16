"""Download every image referenced by parsed questions; write url -> local file map.

usage: fetch_images.py es_parsed.json out_dir map.json
"""
import hashlib, json, os, re, sys
sys.path.insert(0, '/Users/diptidhawade/Plaksha/Code/Projects/GATE/pipeline')
import fetch as F

es = json.load(open(sys.argv[1]))
out_dir = sys.argv[2]
os.makedirs(out_dir, exist_ok=True)
urls = []
for q in es:
    blobs = [q.get('question_html') or '', q.get('explanation_html') or ''] + [o or '' for o in q['options_html']]
    for b in blobs:
        urls += re.findall(r'<img src="([^"]+)"', b)
urls = list(dict.fromkeys(urls))
mapping = {}
for i, u in enumerate(urls):
    ext = os.path.splitext(u.split('?')[0])[1].lower() or '.png'
    if ext not in ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'):
        ext = '.png'
    name = hashlib.sha1(u.encode()).hexdigest()[:16] + ext
    dest = os.path.join(out_dir, name)
    if not os.path.exists(dest):
        try:
            data = F.fetch(u, binary=True, ext='img')
        except Exception as e:  # noqa
            print('FAIL', u, e)
            continue
        if not data:
            print('404', u)
            continue
        open(dest, 'wb').write(data)
    mapping[u] = name
    if i % 100 == 0:
        print(i, len(urls), flush=True)
json.dump(mapping, open(sys.argv[3], 'w'), indent=0)
print('images', len(mapping), 'of', len(urls))
