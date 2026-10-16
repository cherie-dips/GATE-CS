"""Render a PNG crop of every GATE Overflow book question (header .. 'Answer key' marker).

usage: go_crops.py out_dir index.json vol1.pdf vol2.pdf vol3.pdf
Writes <out_dir>/<vol>_<id>.png and an index {go_id: [png files]}.
"""
import json, os, re, sys
import fitz
from PIL import Image

ZOOM = 2.2
TOP, BOTTOM = 40, 805     # usable text band on an A4 page (points)
LEFT, RIGHT = 38, 565


def lines_of(doc):
    out = []
    for pno, page in enumerate(doc):
        for b in page.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                t = ''.join(s['text'] for s in l['spans']).strip()
                if t:
                    out.append((pno, l['bbox'][1], l['bbox'][3], l['bbox'][0], t))
    out.sort(key=lambda r: (r[0], round(r[1]), r[3]))
    return out


def main():
    out_dir, index_path, vols = sys.argv[1], sys.argv[2], sys.argv[3:]
    os.makedirs(out_dir, exist_ok=True)
    index = {}
    for vi, path in enumerate(vols, 1):
        doc = fitz.open(path)
        L = lines_of(doc)
        heads = []
        for i, (p, y0, y1, x, t) in enumerate(L):
            if re.fullmatch(r'\d+\.\d+\.\d+', t):
                # must sit on the same baseline as a 'GATE ...' header line
                same = [r for r in L[max(0, i - 3): i + 4] if r[0] == p and abs(r[1] - y0) < 3 and 'GATE' in r[4]]
                if same:
                    heads.append((i, t))
        for hi, (i, gid) in enumerate(heads):
            p0, y0 = L[i][0], L[i][1]
            # end: first 'Answer key' after the header
            end = None
            tag_top = None
            for j in range(i + 1, min(len(L), i + 400)):
                if 'Answer key' in L[j][4]:
                    end = (L[j][0], L[j][1])
                    # tag line right above the marker
                    k = j - 1
                    if k > i and re.fullmatch(r'[a-z0-9\-.\s]+', L[k][4]) and re.search(r'[a-z]', L[k][4]):
                        tag_top = (L[k][0], L[k][1])
                    break
                if hi + 1 < len(heads) and j >= heads[hi + 1][0]:
                    break
            if end is None:
                continue
            stop = tag_top or end
            segs = []
            for p in range(p0, stop[0] + 1):
                a = y0 - 4 if p == p0 else TOP
                b = stop[1] - 2 if p == stop[0] else BOTTOM
                if b - a > 8:
                    segs.append((p, a, b))
            imgs = []
            for p, a, b in segs:
                pix = doc[p].get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=fitz.Rect(LEFT, a, RIGHT, b))
                imgs.append(Image.frombytes('RGB', (pix.width, pix.height), pix.samples))
            if not imgs:
                continue
            W = max(im.width for im in imgs)
            H = sum(im.height for im in imgs)
            canvas = Image.new('RGB', (W, H), 'white')
            yy = 0
            for im in imgs:
                canvas.paste(im, (0, yy))
                yy += im.height
            canvas = canvas.convert('L').quantize(colors=32)
            name = f'v{vi}_{gid}.png'
            canvas.save(os.path.join(out_dir, name), optimize=True)
            index[f'v{vi}:{gid}'] = {'file': name, 'pages': [s[0] + 1 for s in segs]}
        print(path, len(heads), 'headers', flush=True)
    json.dump(index, open(index_path, 'w'), indent=0)
    print('crops', len(index))


if __name__ == '__main__':
    main()
