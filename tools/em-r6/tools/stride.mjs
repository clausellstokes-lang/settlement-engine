/**
 * stride.mjs — EM-R6: the totality walker's CORPUS STRIDE options, timed.
 * The launch brief demands "say the stride and its wall-clock".
 */
import { TREE } from './instrument.mjs';
import { goldenCorpus, keyOf, sample63 } from './lib.mjs';

const { generateSettlementPipeline } = await import(`${TREE}/src/generators/generateSettlementPipeline.js`);

const ALL = goldenCorpus();
const oneEachTier = (() => {
  const seen = new Set(); const out = [];
  for (const r of ALL) { if (seen.has(r.settType)) continue; seen.add(r.settType); out.push(r); }
  return out;
})();
const stride = (n) => ALL.filter((_, i) => i % n === 0);

const OPTIONS = [
  ['the faction precedent — 3 named worlds', ALL.slice(0, 3)],
  ['one row per TIER (6)', oneEachTier],
  ['stride 71 (the recon 9-row diagnosis set)', stride(71)],
  ['stride 25 (21 rows)', stride(25)],
  ['stride 12 (44 rows)', stride(12)],
  ['the 63-row structured sample', sample63()],
];

for (const [label, rows] of OPTIONS) {
  const t0 = Date.now();
  let insts = 0; const tiers = new Set();
  for (const row of rows) {
    const { _seed, ...cfg } = row;
    const s = generateSettlementPipeline(cfg, null, { seed: _seed ?? keyOf(row), customContent: {} });
    insts += (s?.institutions || []).length;
    tiers.add(s?.tier ?? cfg.settType);
  }
  const ms = Date.now() - t0;
  console.log(
    `${label.padEnd(44)} rows=${String(rows.length).padStart(3)}  ${String(ms).padStart(6)} ms  `
    + `institutions=${String(insts).padStart(5)}  tiers=${[...tiers].sort().join(',')}`,
  );
}
