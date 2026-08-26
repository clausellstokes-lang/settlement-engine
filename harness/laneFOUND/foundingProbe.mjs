#!/usr/bin/env node
/**
 * CAR-FOUND probe — ⛔ **DOES THE TRUTH LAYER CARRY A FOUNDING YEAR FOR AN INSTITUTION?**
 *
 * The brief's first half asks for institutions to be seated in the epoch history says founded
 * them. This probe measures whether such a year exists, and — if it does not — what the NEAREST
 * RECORDED signal is and how much of the roster it reaches. It mints nothing.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { buildGrowthLedger } from '../../src/domain/townMap/fabric/growthLedger.js';

const TEMPORAL = ['founded', 'foundedYear', 'foundingYear', 'establishedAt', 'establishedYear',
  'yearsAgo', 'age', 'since', 'sinceYear', 'builtYear', 'vintage', 'era', 'addedAt', 'epoch',
  'foundedTick', 'foundedAge'];

let total = 0;
let withAnyTemporal = 0;
let withNativeTier = 0;
const keyHisto = new Map();
const nativeTierHisto = new Map();
const rows = [];

for (const spec of CORPUS) {
  const { settlement, model } = buildOne(spec);
  const roster = liveInstitutions(settlement);
  const led = buildGrowthLedger(settlement, model, {});
  let t = 0; let nt = 0;
  for (const inst of roster) {
    total++;
    for (const k of Object.keys(inst)) keyHisto.set(k, (keyHisto.get(k) || 0) + 1);
    const hit = TEMPORAL.find((k) => inst[k] != null);
    if (hit) { withAnyTemporal++; t++; }
    if (inst.nativeTier) {
      withNativeTier++; nt++;
      nativeTierHisto.set(inst.nativeTier, (nativeTierHisto.get(inst.nativeTier) || 0) + 1);
    }
  }
  // the ledger's own tier ladder: the FIRST epoch at which each extent tier was reached
  const firstEpochOfTier = new Map();
  for (const e of led.epochs) if (!firstEpochOfTier.has(e.extentTier)) firstEpochOfTier.set(e.extentTier, e);
  rows.push({
    key: spec.key, roster: roster.length, temporal: t, nativeTier: nt,
    epochs: led.epochs.length,
    ladder: [...firstEpochOfTier.entries()].map(([tier, e]) => `${tier}@E${e.index}/y${e.year}`).join(' '),
  });
}

console.log('── PER-LEAF ──');
console.log('leaf         roster  withTemporalField  withNativeTier  epochs  ledger tier ladder');
for (const r of rows) {
  console.log(`${r.key.padEnd(12)} ${String(r.roster).padStart(6)} ${String(r.temporal).padStart(18)} `
    + `${String(r.nativeTier).padStart(15)} ${String(r.epochs).padStart(7)}  ${r.ladder}`);
}
console.log(`\nTOTAL live institutions across the corpus: ${total}`);
console.log(`  carrying ANY of [${TEMPORAL.join(', ')}]: ${withAnyTemporal}`);
console.log(`  carrying nativeTier:                      ${withNativeTier}`);
console.log('\n── EVERY KEY THAT APPEARS ON A LIVE INSTITUTION (count over the corpus) ──');
for (const [k, n] of [...keyHisto.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(34)} ${n}`);
}
console.log('\n── nativeTier DISTRIBUTION ──');
for (const [k, n] of [...nativeTierHisto.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(k).padEnd(14)} ${n}`);
}
