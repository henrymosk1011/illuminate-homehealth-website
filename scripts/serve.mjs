// Local preview that runs the real Cloudflare Worker (src/worker.js) in Node,
// with dist/ standing in for Workers Static Assets.
//   npm run build && npm run dev   ->  http://localhost:8787
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import worker from '../src/worker.js';

const dist = join(import.meta.dirname, '..', 'dist');
const port = Number(process.env.PORT || 8787);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
};

async function tryFile(path) {
  try {
    const s = await stat(path);
    return s.isFile() ? path : null;
  } catch {
    return null;
  }
}

// Mimics assets with html_handling "auto-trailing-slash" and not_found_handling "404-page"
const ASSETS = {
  async fetch(request) {
    const url = new URL(request.url);
    let p = decodeURIComponent(url.pathname);
    const safe = normalize(p).replace(/^(\.\.[/\\])+/, '');
    let file = await tryFile(join(dist, safe));
    if (!file && !safe.endsWith('/')) {
      const dir = await tryFile(join(dist, safe, 'index.html'));
      if (dir) return new Response(null, { status: 307, headers: { Location: `${url.pathname}/${url.search}` } });
      file = await tryFile(join(dist, `${safe}.html`));
    }
    if (!file && safe.endsWith('/')) file = await tryFile(join(dist, safe, 'index.html'));
    if (!file) {
      const body = await readFile(join(dist, '404.html'));
      return new Response(body, { status: 404, headers: { 'Content-Type': TYPES['.html'] } });
    }
    const body = await readFile(file);
    return new Response(body, { status: 200, headers: { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' } });
  },
};

const env = {
  ASSETS,
  CONTACT_TO: process.env.CONTACT_TO || 'contact@illuminatehomehealth.com',
  CONTACT_FROM: process.env.CONTACT_FROM || 'Illuminate Website <website@forms.illuminatehomehealth.com>',
  ALLOWED_ORIGINS: `http://localhost:${port}`,
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  CANONICAL_HOST: 'www.illuminatehomehealth.com',
  DRY_RUN: process.env.RESEND_API_KEY ? '' : '1',
};

createServer(async (req, res) => {
  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request(`http://localhost:${port}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
    });
    const response = await worker.fetch(request, env, {});
    const headers = Object.fromEntries(response.headers);
    // Plain http on localhost: drop the https only directives
    if (headers['content-security-policy']) headers['content-security-policy'] = headers['content-security-policy'].replace('; upgrade-insecure-requests', '');
    delete headers['strict-transport-security'];
    res.writeHead(response.status, headers);
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error(err);
    res.writeHead(500).end('Server error');
  }
}).listen(port, () => console.log(`Preview running at http://localhost:${port}`));
