#!/usr/bin/env node
/**
 * TWIN DUMP (WORDS-1): per birth of a plan, on one tree, the record's hash RAW and the hash of the record with a unit's
 * declared word change NORMALIZED away; two trees' dumps compared (`--cmp`) say how many records moved, and whether
 * anything moved BESIDES the declared change (the normalized hashes must be equal, 900 of 900). A MEASURE.
 *   node twin-dump.mjs <tree> <plan.json> <out.json> --norm=<e8|behaviour|none>
 *   node twin-dump.mjs --cmp <a.json> <b.json>
 * --norm=e8: "himself"/"herself" → "themselves"; the bound tie's asked mention before "would rather keep to" → "§".
 * --norm=behaviour (E13b, G39): every card's `npcs[i].presentation.behaviour` set aside ("§"), nothing else.
 * Also writes, per seed, the strings that carry the normalized change (count), for the before-and-after's examples.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const sha = (/** @type {string} */ s) => createHash('sha256').update(s).digest('hex');
if (process.argv[2] === '--cmp') {
  const A = JSON.parse(readFileSync(process.argv[3], 'utf8')); const B = JSON.parse(readFileSync(process.argv[4], 'utf8'));
  const by = {}; let raw = 0; let norm = 0; const normSeeds = []; const rawSeeds = [];
  for (const [seed, a] of Object.entries(A)) {
    const b = B[seed]; if (!b) { console.log(`MISSING ${seed}`); continue; }
    if (a.raw !== b.raw) { raw++; rawSeeds.push(seed); by[a.size] = (by[a.size] || 0) + 1; }
    if (a.norm !== b.norm) { norm++; normSeeds.push(seed); }
  }
  const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  console.log(`twin --cmp: births ${Object.keys(A).length}; records moved RAW ${raw} [${SIZES.map((z) => by[z] || 0).join(' ')}]; moved BEYOND the declared change ${norm}${norm ? ` (first: ${normSeeds.slice(0, 5).join(' ')})` : ''}`);
  console.log(`three moved: ${rawSeeds.slice(0, 3).join(' ')}`);
  process.exit(norm ? 1 : 0);
}
const [T, PLAN, OUT] = process.argv.slice(2);
const NORM = (process.argv.find((a) => a.startsWith('--norm=')) || '--norm=none').slice(7);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
/** @param {string} j */
const normalize = (j) => (NORM === 'e8'
  ? j.replace(/for an introduction ([^"]+?) would rather keep to (?:him|her|them)sel(?:f|ves)/g, 'for an introduction § would rather keep to themselves').replace(/\b(?:him|her)self\b/g, 'themselves')
  : j);
const out = {};
for (const p of JSON.parse(readFileSync(PLAN, 'utf8'))) {
  const s = generateSettlementPipeline(birthConfig(p.config), null, { seed: p.seed, customContent: {} });
  const j = JSON.stringify(s);
  const jb = NORM === 'behaviour' ? JSON.stringify({ ...s, npcs: (s.npcs || []).map((c) => (c?.presentation && typeof c.presentation.behaviour === 'string' ? { ...c, presentation: { ...c.presentation, behaviour: '§' } } : c)) }) : null;
  out[p.seed] = { size: p.size, raw: sha(j), norm: sha(jb ?? normalize(j)) };
}
writeFileSync(OUT, JSON.stringify(out));
console.log(`twin-dump ${T} ${PLAN}: ${Object.keys(out).length} births (norm ${NORM})`);
