import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import middleware from '../middleware.js';

const root = path.resolve(decodeURIComponent(new URL('..', import.meta.url).pathname));
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const matches = (source, pathname) => new RegExp('^' + source + '$').test(pathname);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8' };
const inside = file => file === root || file.startsWith(root + path.sep);
const refused = pathname => /^\/(?:\.git|scripts|tests|graphify-out)(?:\/|$)/.test(pathname);

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
    const pathname = decodeURIComponent(url.pathname);
    for (const rule of config.headers || []) {
      if (matches(rule.source, pathname)) for (const header of rule.headers) res.setHeader(header.key, header.value);
    }
    const redirect = (destination, status) => { res.writeHead(status, { Location: destination }); res.end(); };
    for (const rule of config.redirects || []) {
      if (matches(rule.source, pathname)) {
        redirect(rule.destination + url.search, rule.permanent ? 308 : 307);
        return;
      }
    }
    if (pathname !== '/' && pathname.endsWith('/')) {
      redirect(pathname.replace(/\/+$/, '') + url.search, 308); return;
    }
    if (pathname.endsWith('.html')) {
      const clean = pathname.replace(/\.html$/, '').replace(/\/index$/, '') || '/';
      redirect(clean + url.search, 308); return;
    }
    if (pathname === '/') {
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) value.forEach(item => headers.append(key, item));
        else if (value !== undefined) headers.set(key, value);
      }
      const response = middleware(new Request(url, { headers }));
      if (!response.headers.has('x-middleware-next')) {
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.writeHead(response.status); res.end(); return;
      }
    }
    let file;
    if (!refused(pathname)) {
      const base = path.resolve(root, '.' + pathname);
      if (inside(base)) {
        for (const candidate of [base, base + '.html', path.join(base, 'index.html')]) {
          try {
            const real = fs.realpathSync(candidate);
            if (inside(real) && !refused('/' + path.relative(root, real).split(path.sep).join('/')) && fs.statSync(real).isFile()) { file = real; break; }
          } catch { /* Try the next clean-URL candidate. */ }
        }
      }
    }
    if (!file) { file = path.join(root, '404.html'); res.statusCode = 404; }
    res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] || 'application/octet-stream');
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file).pipe(res);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Bad request');
  }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', function () {
  console.log(`http://127.0.0.1:${this.address().port}`);
});
