"""Polite cached HTTP fetcher used by the crawl scripts."""
import hashlib, os, time, urllib.request, urllib.error

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/126.0 Safari/537.36')
CACHE = os.environ.get('GATE_RAW', '/private/tmp/claude-501/-Users-diptidhawade-Plaksha-Code-Projects-GATE/8d662bfb-fe3f-4cfb-b9dc-aa5d7b3a5856/scratchpad/raw/examside')
DELAY = float(os.environ.get('GATE_DELAY', '0.8'))
_last = [0.0]


def cache_path(url, ext='html'):
    h = hashlib.sha1(url.encode()).hexdigest()[:20]
    return os.path.join(CACHE, h[:2], f'{h}.{ext}')


def fetch(url, binary=False, ext='html', retries=4):
    p = cache_path(url, ext)
    if os.path.exists(p) and os.path.getsize(p) > 0:
        with open(p, 'rb') as f:
            data = f.read()
        return data if binary else data.decode('utf-8', 'replace')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    for attempt in range(retries):
        wait = DELAY - (time.time() - _last[0])
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en'})
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            with open(p + '.tmp', 'wb') as f:
                f.write(data)
            os.replace(p + '.tmp', p)
            return data if binary else data.decode('utf-8', 'replace')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(3 * (attempt + 1))
        except Exception:
            time.sleep(3 * (attempt + 1))
    raise RuntimeError('failed ' + url)
