import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync, brotliCompressSync, constants as z } from 'node:zlib';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');

function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}
function findEntryChunk() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  return m[1];
}
function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]); const q = [entry];
  while (q.length) {
    const f = q.shift();
    for (const d of staticImportSpecifiers(readFileSync(join(assetsDir, f), 'utf-8')))
      if (!seen.has(d)) { seen.add(d); q.push(d); }
  }
  return { entry, files: [...seen] };
}

const { entry, files } = entryStaticClosure();
let raw = 0, gz = 0, br = 0;
console.log('── THE FIRST-PAINT CLOSURE ───────────────────────────');
for (const f of files.sort()) {
  const b = readFileSync(join(assetsDir, f));
  const g = gzipSync(b, { level: 9 }).length;
  const bo = brotliCompressSync(b, { params: { [z.BROTLI_PARAM_QUALITY]: 11 } }).length;
  raw += b.length; gz += g; br += bo;
  console.log(String(b.length).padStart(9), String(g).padStart(8), String(bo).padStart(8), ' ', f);
}
console.log(`ENTRY ${entry}`);
console.log(`CLOSURE files ${files.length} · raw ${raw} / 1048000 (margin ${1048000 - raw}) · gzip ${gz} / 337000 (margin ${337000 - gz}) · brotli ${br} / 283000 (margin ${283000 - br})`);

console.log('\n── THE data-lazy CHUNKS ──────────────────────────────');
const dl = readdirSync(assetsDir).filter((f) => /^data-lazy-[A-Za-z0-9_-]+\.js$/.test(f));
let dlRaw = 0, dlGz = 0;
for (const f of dl) {
  const b = readFileSync(join(assetsDir, f));
  const g = gzipSync(b, { level: 9 }).length;
  dlRaw += b.length; dlGz += g;
  console.log(String(b.length).padStart(9), String(g).padStart(8), ' ', f);
}
console.log(`data-lazy chunks ${dl.length} · raw ${dlRaw} · gzip ${dlGz} · ratio ${(dlRaw / dlGz).toFixed(4)}`);

const eagerData = readdirSync(assetsDir).filter((f) => /^data-[A-Za-z0-9_-]+\.js$/.test(f));
console.log('eager data chunks:', eagerData.join(', '));

console.log('\n── PROSE LEAF MEMBERSHIP (fingerprint derived from the leaf source) ──');
const LEAVES = [
  'src/data/dossierStateProse/defense.generated.js',
  'src/data/dossierStateProse/economy.generated.js',
  'src/data/dossierStateProse/general.generated.js',
  'src/data/dossierStateProse/power.generated.js',
  'src/data/dossierStateProse/stressors.generated.js',
  'src/data/dossierStateProse/warFaith.generated.js',
  'src/data/dossierCausalProse.generated.js',
];
const SAFE = /^[A-Za-z0-9 ,.:;()\-]+$/;
function fingerprintOf(rel) {
  const src = readFileSync(resolve(process.cwd(), rel), 'utf-8');
  const texts = [...src.matchAll(/^\s*"text": "([^"\\]+)",?$/gm)].map((m) => m[1]).filter((t) => SAFE.test(t));
  texts.sort((a, b) => (b.length - a.length) || (a < b ? -1 : 1));
  return texts[0];
}
const closureSet = new Set(files);
const allChunks = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
const chunkText = new Map(allChunks.map((f) => [f, readFileSync(join(assetsDir, f), 'utf-8')]));
for (const leaf of LEAVES) {
  const fp = fingerprintOf(leaf);
  const carriers = allChunks.filter((f) => chunkText.get(f).includes(fp));
  const inClosure = carriers.filter((f) => closureSet.has(f));
  console.log(`${leaf}\n    fp(${fp.length}B) "${fp.slice(0, 62)}…"\n    carriers: ${carriers.join(', ') || 'NONE'} · in-closure: ${inClosure.join(', ') || 'none'}`);
}
