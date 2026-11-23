// V39-C2M M4: THE BYTES. node fp.mjs <dist dir> [<other dist dir>]
// First paint's three figures by tests/build/vendorPdfLazy.test.js's own reading (the entry chunk named by dist/index.html, its
// transitive STATIC closure by the same two regexes, raw bytes by statSync, gzip level 9, Brotli quality 11), the chunk that
// holds publicProseCompose.js (the one chunk whose text carries all of its distinctive site keys and its flag read), and with a
// second dist: the two closures side by side (same file names = no chunk added to or dropped from first paint) and every
// chunk whose bytes moved.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, brotliCompressSync, constants as Z } from 'node:zlib';
const statics = (code) => {
  const specs = new Set(); let m;
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g; const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
};
const read = (dist) => {
  const assets = join(dist, 'assets');
  const entry = readFileSync(join(dist, 'index.html'), 'utf8').match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1];
  const seen = new Set([entry]); const q = [entry];
  while (q.length) { const f = q.shift(); for (const d of statics(readFileSync(join(assets, f), 'utf8'))) if (!seen.has(d)) { seen.add(d); q.push(d); } }
  let raw = 0; let gz = 0; let br = 0;
  for (const f of seen) { const b = readFileSync(join(assets, f)); raw += statSync(join(assets, f)).size; gz += gzipSync(b, { level: 9 }).length; br += brotliCompressSync(b, { params: { [Z.BROTLI_PARAM_QUALITY]: 11 } }).length; }
  const js = readdirSync(assets).filter((f) => f.endsWith('.js'));
  const KEYS = ['"viewModel:viability"', '"warFaith:faith"', '"economy:daily_life"', '"canonicalViewModel"', '"power:ladder"'];
  const composer = js.filter((f) => { const s = readFileSync(join(assets, f), 'utf8'); return KEYS.every((k) => s.includes(k) || s.includes(k.replace(/"/g, "'"))); });
  const sizes = Object.fromEntries(js.map((f) => [f, statSync(join(assets, f)).size]));
  return { entry, closure: [...seen].sort(), raw, gz, br, composer: composer.map((f) => ({ f, bytes: sizes[f], inFirstPaint: seen.has(f), gz: gzipSync(readFileSync(join(assets, f)), { level: 9 }).length })), sizes };
};
const stem = (f) => f.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');
const [a, b] = process.argv.slice(2);
const A = read(a);
const show = (n, X) => console.log(`${n}: first paint raw ${X.raw} / gzip ${X.gz} / brotli ${X.br}; ${X.closure.length} chunks; entry ${X.entry}; composer chunk ${JSON.stringify(X.composer)}`);
show(a, A);
if (b) {
  const B = read(b); show(b, B);
  console.log(`DELTA first paint: raw ${B.raw - A.raw} / gzip ${B.gz - A.gz} / brotli ${B.br - A.br}`);
  const sa = A.closure.map(stem).sort().join(','); const sb = B.closure.map(stem).sort().join(',');
  console.log(`first-paint closure by chunk name (hash stripped): ${sa === sb ? 'THE SAME' : 'DIFFERENT'}`);
  if (sa !== sb) { const x = new Set(A.closure.map(stem)); const y = new Set(B.closure.map(stem)); console.log(`  only in ${a}: ${[...x].filter((k) => !y.has(k)).join(', ')}\n  only in ${b}: ${[...y].filter((k) => !x.has(k)).join(', ')}`); }
  const byStem = (S) => { const o = {}; for (const [f, n] of Object.entries(S)) (o[stem(f)] ||= []).push(n); for (const k of Object.keys(o)) o[k].sort((p, q) => p - q); return o; };
  const xa = byStem(A.sizes); const xb = byStem(B.sizes);
  for (const k of [...new Set([...Object.keys(xa), ...Object.keys(xb)])].sort()) if (JSON.stringify(xa[k]) !== JSON.stringify(xb[k])) console.log(`  chunk moved: ${k} ${JSON.stringify(xa[k] || [])} -> ${JSON.stringify(xb[k] || [])}`);
}
