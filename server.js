#!/usr/bin/env node
// Local server for the GATE CSE PYQ bank.
// Serves the built app (app/dist) and persists your progress to data/progress.json.
//   node server.js            -> http://localhost:5178
//   PORT=8080 node server.js  -> custom port
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'app', 'dist');
const DATA_DIR = process.env.GATE_DATA_DIR ? path.resolve(process.env.GATE_DATA_DIR) : path.join(ROOT, 'data');
const PROGRESS = path.join(DATA_DIR, 'progress.json');
const PORT = Number(process.env.PORT || 5178);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};

fs.mkdirSync(DATA_DIR, { recursive: true });

function send(res, code, body, headers = {}) {
  res.writeHead(code, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 50 * 1024 * 1024) { reject(new Error('too large')); req.destroy(); }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function writeProgress(json) {
  const tmp = PROGRESS + '.tmp';
  fs.writeFileSync(tmp, json);
  // keep one rolling backup so a bad write can always be undone
  if (fs.existsSync(PROGRESS)) fs.copyFileSync(PROGRESS, PROGRESS + '.bak');
  fs.renameSync(tmp, PROGRESS);
}

async function api(req, res) {
  if (req.url === '/api/progress' && req.method === 'GET') {
    if (!fs.existsSync(PROGRESS)) return send(res, 200, '{}', { 'Content-Type': TYPES['.json'] });
    return send(res, 200, fs.readFileSync(PROGRESS), { 'Content-Type': TYPES['.json'] });
  }
  if (req.url === '/api/progress' && req.method === 'PUT') {
    try {
      const body = await readBody(req);
      JSON.parse(body); // validate before touching the file
      writeProgress(body);
      return send(res, 200, '{"ok":true}', { 'Content-Type': TYPES['.json'] });
    } catch (e) {
      return send(res, 400, JSON.stringify({ ok: false, error: String(e.message || e) }), { 'Content-Type': TYPES['.json'] });
    }
  }
  return send(res, 404, 'not found');
}

const gzCache = new Map();
function gzipCached(file, stat) {
  const hit = gzCache.get(file);
  if (hit && hit.mtime === stat.mtimeMs) return hit.buf;
  const buf = zlib.gzipSync(fs.readFileSync(file), { level: 6 });
  gzCache.set(file, { mtime: stat.mtimeMs, buf });
  return buf;
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.normalize(path.join(DIST, urlPath));
  if (!file.startsWith(DIST)) return send(res, 403, 'forbidden');
  let target = file;
  if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) target = path.join(DIST, 'index.html');
  if (!fs.existsSync(target)) return send(res, 500, 'App not built yet. Run: npm run build (inside app/)');
  const ext = path.extname(target).toLowerCase();
  const type = TYPES[ext] || 'application/octet-stream';
  const stat = fs.statSync(target);
  const compressible = /json|javascript|css|html|svg/.test(type) && stat.size > 1024;
  const headers = { 'Content-Type': type, 'Cache-Control': urlPath.startsWith('/assets/') ? 'max-age=31536000, immutable' : 'no-cache' };
  if (compressible && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    headers['Content-Encoding'] = 'gzip';
    return send(res, 200, gzipCached(target, stat), headers);
  }
  return send(res, 200, fs.readFileSync(target), headers);
}

http
  .createServer((req, res) => {
    if (req.url.startsWith('/api/')) return api(req, res).catch((e) => send(res, 500, String(e)));
    return serveStatic(req, res);
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`GATE CSE PYQ bank running at http://localhost:${PORT}`);
    console.log(`Progress is saved to ${PROGRESS}`);
  });
