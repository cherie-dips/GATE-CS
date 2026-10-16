"""Downscale + compress question images for the app (originals stay untouched).

usage: optimize_images.py src_dir dst_dir [max_width]
"""
import os, sys
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
maxw = int(sys.argv[3]) if len(sys.argv) > 3 else 1200
os.makedirs(dst, exist_ok=True)
before = after = 0
for f in sorted(os.listdir(src)):
    sp, dp = os.path.join(src, f), os.path.join(dst, f)
    before += os.path.getsize(sp)
    try:
        im = Image.open(sp)
        im.load()
    except Exception:
        with open(sp, 'rb') as a, open(dp, 'wb') as b:
            b.write(a.read())
        after += os.path.getsize(dp)
        continue
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert('RGB')
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    ext = os.path.splitext(f)[1].lower()
    if ext in ('.jpg', '.jpeg'):
        im.save(dp, 'JPEG', quality=85, optimize=True)
    else:
        im.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(dp, 'PNG', optimize=True)
        # keep whichever is smaller and still faithful (photos quantize badly -> keep original size cap)
        if os.path.getsize(dp) > os.path.getsize(sp):
            im.save(dp, 'PNG', optimize=True)
    after += os.path.getsize(dp)
print(f'{before/1e6:.1f} MB -> {after/1e6:.1f} MB')
