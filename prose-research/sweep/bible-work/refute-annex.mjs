// INDEPENDENT wired/unwired re-count. Method: RAW BYTE SCAN of the source tree with a
// word-window index. No module import, no AST, no walker — deliberately different from
// x6-annex.mjs's X2 (import+walk) u X3 (espree) u X4 (jsx walker) join.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const D = process.argv[2], W = process.argv[3];

// PUNCTUATION-BLIND normalisation, applied identically to the annex row and to the raw source
// bytes: slots (annex {x} and source ${...}) collapse to the token " qq ", everything that is not
// a letter or digit becomes a space. Deliberately GENEROUS: it can only over-count wiring.
const normText = (t) => t.toLowerCase()
  .replace(/\\u2019|\\u2018/g, "'").replace(/\\n|\\r|\\t/g, ' ')
  .replace(/\$\{[^}]*\}/g, ' qq ')
  .replace(/\{[a-z_0-9]+\}/gi, ' qq ')
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ').trim();

// ── the annex rows, re-parsed by the SAME published grammar (so the denominator is comparable)
const rowRe = /^(\d+)\. (.+)$/, tagRe = /^`\[([^`]*)\]`\s*/;
const metaRe = /(?:\s*·)?\s*`(?:\[[^`]*\]|requiredSlots:[^`]*)`\s*$/;
const noteRe = /\s*\*(?:\([^)]*\)|—[^*]*)\*\s*$/;
const annexRows = [];
const CD = path.join(D, 'docs/content');
for (const f of readdirSync(CD).filter((x) => /^RECEIPT_POOLS_.*\.md$/.test(x))) {
  let inFence = false;
  for (const line of readFileSync(path.join(CD, f), 'utf8').split('\n')) {
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = rowRe.exec(line); if (!m) continue;
    let body = m[2]; if (/^\*\*/.test(body)) continue;
    body = body.replace(tagRe, '');
    let prev; do { prev = body; body = body.replace(metaRe, '').replace(noteRe, ''); } while (body !== prev);
    body = body.replace(noteRe, '').trim();
    if (body.length < 20) continue;
    annexRows.push({ annex: f, text: body, key: normText(body).trim() });
  }
}
console.log('annex prose rows re-parsed:', annexRows.length, '(x6-annex published 9,115)');

// ── the word-window index over the RAW source bytes
const files = [];
const walk = (dir) => { for (const e of readdirSync(dir)) { const p = path.join(dir, e);
  if (e === 'node_modules' || e === '.git' || e === 'dist' || e === 'coverage') continue;
  const s = statSync(p); if (s.isDirectory()) walk(p); else if (/\.(js|jsx|mjs|cjs|ts|tsx|json)$/.test(e)) files.push(p); } };
for (const root of process.argv.slice(4)) walk(path.join(D, root));
console.log('raw source files scanned:', files.length, 'roots:', process.argv.slice(4).join(' '));

const PREFIX = 6;
const prefixIndex = new Map();
for (const r of annexRows) { const w = r.key.split(' ').filter(Boolean); const p = w.slice(0, PREFIX).join(' ');
  if (!prefixIndex.has(p)) prefixIndex.set(p, []); prefixIndex.get(p).push(r); }
const hit = new Set(); const where = new Map();
let bytes = 0;
for (const f of files) {
  const raw = readFileSync(f, 'utf8'); bytes += raw.length;
  const t = normText(raw);
  const words = t.split(' ');
  for (let i = 0; i + PREFIX <= words.length; i++) {
    const p = words.slice(i, i + PREFIX).join(' ');
    const cands = prefixIndex.get(p); if (!cands) continue;
    for (const r of cands) { if (hit.has(r)) continue;
      const seg = words.slice(i, i + r.key.split(' ').length).join(' ');
      if (seg === r.key || seg.startsWith(r.key)) { hit.add(r); where.set(r, path.relative(D, f)); } }
  }
}
console.log('bytes scanned:', (bytes / 1e6).toFixed(1) + 'MB');
const per = {};
for (const r of annexRows) { const s = (per[r.annex] ||= { prose: 0, wired: 0 }); s.prose++; if (hit.has(r)) s.wired++; }
console.log('\nannex'.padEnd(34), 'prose'.padStart(6), 'wiredRAW'.padStart(9), 'pct'.padStart(6));
let T = { prose: 0, wired: 0 };
for (const [a, s] of Object.entries(per).sort((x, y) => y[1].prose - x[1].prose)) {
  console.log(a.padEnd(34), String(s.prose).padStart(6), String(s.wired).padStart(9), (100 * s.wired / s.prose).toFixed(1).padStart(6));
  T.prose += s.prose; T.wired += s.wired; }
console.log('TOTAL'.padEnd(34), String(T.prose).padStart(6), String(T.wired).padStart(9), (100 * T.wired / T.prose).toFixed(1).padStart(6));

// ── set-difference against x6-annex's own stamp
const X = JSON.parse(readFileSync(path.join(W, 'annex.json'), 'utf8'));
const xWired = new Set(X.filter((r) => r.register === 'ANNEX-WIRED').map((r) => r.text));
const mineWired = new Set([...hit].map((r) => r.text));
const onlyMine = [...mineWired].filter((t) => !xWired.has(t));
const onlyX = [...xWired].filter((t) => !mineWired.has(t));
console.log(`\nx6-annex wired: ${xWired.size}   raw-scan wired: ${mineWired.size}`);
console.log(`WIRED BY RAW SCAN BUT NOT BY x6-annex: ${onlyMine.length}`);
for (const t of onlyMine.slice(0, 15)) { const r = [...hit].find((x) => x.text === t); console.log('   +', where.get(r), '::', t.slice(0, 110)); }
console.log(`WIRED BY x6-annex BUT NOT BY RAW SCAN: ${onlyX.length}`);
for (const t of onlyX.slice(0, 10)) console.log('   -', t.slice(0, 110));
