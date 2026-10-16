// Minimal hash router: #/path/segments?query
import { useSyncExternalStore } from 'react';

function snapshot() {
  return window.location.hash || '#/';
}

function subscribe(cb) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, snapshot);
  const raw = hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  const segments = path.split('/').filter(Boolean).map(decodeURIComponent);
  return { hash, path, segments, query: new URLSearchParams(qs) };
}

export function navigate(to, { replace = false } = {}) {
  const target = to.startsWith('#') ? to : `#${to}`;
  if (replace) window.location.replace(target);
  else window.location.hash = target;
}

export function href(path, query) {
  const qs = query ? (typeof query === 'string' ? query : new URLSearchParams(query).toString()) : '';
  return `#${path}${qs ? `?${qs}` : ''}`;
}
