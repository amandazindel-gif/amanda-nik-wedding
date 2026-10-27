#!/usr/bin/env node
/* Tiny static server for local preview. Serves dist/ with clean URLs, the same
   way GitHub Pages does. Not for production. */

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "dist");
const port = Number(process.env.PORT || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

async function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const candidates = [join(dist, clean)];
  if (!extname(clean)) candidates.push(join(dist, clean, "index.html"));
  for (const c of candidates) {
    if (!c.startsWith(dist)) continue;
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  let file = await resolve(pathname);
  let status = 200;
  if (!file) {
    file = join(dist, "404.html");
    status = 404;
  }
  res.writeHead(status, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Preview on http://localhost:${port}`));
