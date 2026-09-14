/**
 * REWRITE car 8b-W — THE CROSS-DESK ATTRIBUTION SCAN (lane instrument, never committed).
 *
 * Maps every `…PoolKey` function and every module-level table to the composer that owns it,
 * then asks the committed census which RESOLVED rows are attributed to a key function of a
 * DIFFERENT desk. A hit is a false resolution: the rung-1 reader takes every string literal
 * in a key function's body as a candidate key, and a COMPARISON VALUE is a string literal, so
 * a bare word that some other block also uses as a pool name resolves that block's pool
 * against this desk's function and hands it this desk's parameter names as its read set.
 *
 *   node rw8bw-crossdesk.mjs <dock> [<census.json>]
 *
 * Executed: 1 at f73bdbf16 (DS-GEN-6 :: isolated, keyed by the defence desk's
 * `supplyLogisticsPoolKey`, whose `access === 'isolated'` comparison is that pool's own name),
 * 0 at 290f86ee0.
 */
import { readFileSync } from 'node:fs';

const LANE = process.argv[2];
const CENSUS = process.argv[3] || `${LANE}/docs/content/wiring-census.json`;
const { COMPOSERS } = await import(`${LANE}/tests/helpers/dossierComposedFill.js`);
const census = JSON.parse(readFileSync(CENSUS, 'utf8'));

/** Which block-id prefixes each composer legitimately keys. */
const PREFIX = {
  economyStateProse: ['DS-ECO', 'DS-SUP'],
  powerStateProse: ['DS-POW'],
  defenseStateProse: ['DS-DEF'],
  warFaithStateProse: ['DS-WAR', 'DS-FTH'],
  stressorsStateProse: ['DS-STR', 'DS-CND'],
  generalStateProse: ['DS-GEN', 'DS-HK', 'DS-REL', 'DS-POP'],
};

const owner = new Map();
for (const rel of COMPOSERS) {
  const base = rel.split('/').pop().replace(/\.js$/, '');
  const src = readFileSync(`${LANE}/${rel}`, 'utf8');
  for (const m of src.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*[Pp]oolKey)\s*\(/g)) owner.set(m[1], base);
  for (const m of src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]*)\s*=/g)) if (!owner.has(m[1])) owner.set(m[1], base);
}

const bad = [];
for (const r of census.rows) {
  if (r.status !== 'RESOLVED' || !r.keyFunction) continue;
  const file = owner.get(r.keyFunction);
  if (!file) { bad.push(`${r.block} :: ${r.pool} — keyFunction ${r.keyFunction} owned by NO composer`); continue; }
  if (!(PREFIX[file] || []).some((p) => r.block.startsWith(p))) {
    bad.push(`${r.block} :: ${r.pool} — rung ${r.rung}, keyed by ${r.keyFunction} in ${file}.js  reads ${JSON.stringify(r.reads)}`);
  }
}
console.log(`[cross-desk] RESOLVED rows attributed to a key function of ANOTHER desk: ${bad.length}`);
for (const line of bad) console.log('   ', line);
