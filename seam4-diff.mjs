// seam4-diff.mjs <before.json> <after.json> — the key-by-key leaf diff SEAM car 4 rests on.
import { readFileSync } from 'node:fs';
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f, 'utf8')));
const A = new Set(Object.keys(a.pools)); const B = new Set(Object.keys(b.pools));
const added = [...B].filter((k) => !A.has(k));
const removed = [...A].filter((k) => !B.has(k));
const changed = [...A].filter((k) => B.has(k) && a.pools[k].join(' ') !== b.pools[k].join(' '));
console.log(`[leaf-diff] ${added.length} ADDED / ${removed.length} REMOVED / ${changed.length} CHANGED pools`);
for (const k of added.slice(0, 10)) console.log(`  ADDED   ${k}`);
for (const k of removed.slice(0, 10)) console.log(`  REMOVED ${k}`);
for (const k of changed.slice(0, 10)) console.log(`  CHANGED ${k}`);
const vk = new Map(); const bk = new Map();
for (const k of Object.keys(b.variantKeys)) {
  const before = (a.variantKeys[k] || []).join('|'); const after = b.variantKeys[k].join('|');
  if (before !== after) vk.set(`${before}  ->  ${after}`, (vk.get(`${before}  ->  ${after}`) || 0) + 1);
}
for (const k of Object.keys(b.blockKeys)) {
  const before = a.blockKeys[k] || '(new)'; const after = b.blockKeys[k];
  if (before !== after) bk.set(`${before}  ->  ${after}`, (bk.get(`${before}  ->  ${after}`) || 0) + 1);
}
console.log('[leaf-diff] VARIANT key-set moves (distinct shapes, pools each):');
for (const [m, n] of vk) console.log(`  ${n} pools:  ${m}`);
console.log('[leaf-diff] BLOCK key-set moves:');
for (const [m, n] of bk) console.log(`  ${n} blocks:  ${m}`);
console.log('[leaf-diff] BYTES:');
for (const rel of Object.keys(b.bytes)) {
  const was = a.bytes[rel]; const now = b.bytes[rel];
  const delta = was === undefined ? '' : `${now - was >= 0 ? '+' : ''}${now - was}`;
  console.log(`  ${rel.padEnd(48)} ${String(was ?? 'new').padStart(7)} -> ${String(now).padStart(7)}  ${delta}`);
}
