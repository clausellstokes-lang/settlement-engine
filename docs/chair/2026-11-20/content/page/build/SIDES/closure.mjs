// RUN (from the repository root, after `npm run build`): node docs/chair/2026-11-20/content/page/build/SIDES/closure.mjs dist > <out>.txt
// PAGE-9's SIDES / CAUSES-WIRING first-paint proof (SIDES.md and CAUSES-WIRING.md, "THE FIRST PAINT DOES NOT GROW"): the entry
// chunk's transitive STATIC import closure, read exactly as tests/build/vendorPdfLazy.test.js reads it (entryStaticClosure:
// the <script type=module> of dist/index.html, BFS over `from "./x.js"` and bare `import "./x.js"` edges; gzip level 9,
// Brotli quality 11), its raw, gzip and Brotli totals; then every built chunk that carries the trouble half's tables (a
// marker string of each table, found in the chunk's bytes) and whether that chunk is in the closure.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, constants as Z, gzipSync } from 'node:zlib';

const dist = process.argv[2] || 'dist';
const assets = join(dist, 'assets');
const html = readFileSync(join(dist, 'index.html'), 'utf-8');
const entry = /** @type {RegExpMatchArray} */ (html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/))[1];
/** @param {string} code */
const statics = (code) => {
  const out = new Set();
  for (const m of code.matchAll(/\bfrom\s*["'](\.\/[^"']+\.js)["']/g)) out.add(m[1].replace('./', ''));
  for (const m of code.matchAll(/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g)) out.add(m[1].replace('./', ''));
  return [...out];
};
const seen = new Set([entry]);
const queue = [entry];
while (queue.length) {
  const f = /** @type {string} */ (queue.shift());
  for (const d of statics(readFileSync(join(assets, f), 'utf-8'))) if (!seen.has(d)) { seen.add(d); queue.push(d); }
}
let raw = 0; let gz = 0; let br = 0;
for (const f of [...seen].sort()) {
  const b = readFileSync(join(assets, f));
  const g = gzipSync(b, { level: 9 }).length;
  const r = brotliCompressSync(b, { params: { [Z.BROTLI_PARAM_QUALITY]: 11 } }).length;
  raw += b.length; gz += g; br += r;
  console.log(`CLOSURE-FILE raw ${String(b.length).padStart(8)} gzip ${String(g).padStart(7)} br ${String(r).padStart(7)} ${f}`);
}
console.log(`CLOSURE files ${seen.size} raw ${raw} gzip ${gz} brotli ${br}`);
// marker strings: one row's own words from each table (never printed to a DM by this script; only searched for)
const MARKERS = {
  'data/tensionSideMeanings.js': 'Those who profit from the muddle',
  'data/tensionSidePower.js': 'solePowerNameOf',
  'data/tensionCauses.js': 'governedByTrade',
  'domain/display/tensionShown.js': 'tensionSidesShown',
};
const js = readdirSync(assets).filter((f) => f.endsWith('.js'));
for (const [mod, marker] of Object.entries(MARKERS)) {
  const hits = js.filter((f) => readFileSync(join(assets, f), 'utf-8').includes(marker));
  console.log(`TABLE ${mod} marker ${JSON.stringify(marker)} in ${hits.length ? hits.map((f) => `${f}${seen.has(f) ? ' (IN FIRST PAINT)' : ' (lazy)'}`).join(', ') : 'no chunk (minified away or absent)'}`);
}
