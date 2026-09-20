/**
 * Q6 — two edits in a row. (i) THE CACHE CLAIM: is `rederive(S1)` equal to the previous `R1`?
 * (ii) is merge-then-merge equal to the merge of both edits at once? Three trials.
 * usage: node --import ./hook3.mjs q6-sequences.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive, HELD_KEYS } from './seam.mjs';
import { merge } from './merge.mjs';
import { checkExact, checkBands, observeBands, checkFlags, observeFlags } from './invariants.mjs';
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';

const OPT = { nameMode: 'consume', relink: true, pinAwareAsserts: true, holdPower: true };
const ARM = process.argv[2] || 'edited';
const applyHeld = (base, H) => { const c = clone(base); for (const k of HELD_KEYS) c[k] = clone(H[k]); return c; };
const diffKeys = (a, b) => {
  const out = [];
  for (const k of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) {
    if (h(a?.[k]) === h(b?.[k])) continue;
    const d = pathDiff(a?.[k], b?.[k]); out.push(`${k}:${d.added.length + d.changed.length + d.removed.length}`);
  }
  return out;
};

globalThis.__FOBS__ = observeFlags(sample63().map(r => generate(r)));

const TRIALS = [
  { tier: 'town', name: 'add institution → change NPC role (independent)',
    e1: (rec, H, cat) => { const c = cat(); H.institutions.push(c); return { H, row: null, what: `add "${c.name}"` }; },
    e2: (rec, H) => { H.npcs[1].role = 'Harbourmaster'; return { H, row: null, what: 'role→Harbourmaster' }; } },
  { tier: 'city', name: 'remove institution → terrain desert (interacting)',
    e1: (rec, H) => { const g = H.institutions.splice(1, 1)[0]; return { H, row: null, what: `remove "${g.name}"` }; },
    e2: (rec, H, cat, row) => ({ H, row: { ...row, terrainOverride: 'desert' }, what: 'terrain→desert' }) },
  { tier: 'village', name: 'power share → culture norse',
    e1: (rec, H) => { const f = H.powerStructure.factions[1]; f.power = Math.max(1, Math.round((f.power || 20) * 0.5)); return { H, row: null, what: `share→${f.power}` }; },
    e2: (rec, H, cat, row) => ({ H, row: { ...row, culture: 'norse' }, what: 'culture→norse' }) },
];

for (const T of TRIALS) {
  const row = sample63().find(r => r.settType === T.tier);
  let catalog = null;
  runHeadless(row, instrumentedRoot(row._seed).root, { onStep: (n, c) => { if (n === 'assembleInstitutions') catalog = clone(c.catalogForTier); } });
  const rec = generate(row); const held0 = heldOf(rec);
  const have = new Set((rec.institutions || []).map(i => i.name));
  const cat = () => { for (const [c, b] of Object.entries(catalog || {})) for (const [name, def] of Object.entries(b || {})) if (!have.has(name)) return { category: c, name, ...def, source: 'dm', catalogId: `dm_${name}` }; return null; };
  const R0 = tryRederive(row, held0, OPT).out;

  const a1 = T.e1(rec, clone(held0), cat, row); const row1 = a1.row || row;
  const R1 = tryRederive(row1, a1.H, OPT).out;
  const M1 = merge(applyHeld(rec, a1.H), R0, R1, { heldFrom: ARM }).out;

  // (i) THE CACHE CLAIM: rederive(S1) === the previous R1 ?
  const R0p = tryRederive(row1, heldOf(M1), OPT).out;
  const cacheDiff = diffKeys(R1, R0p);

  // (ii) merge twice vs merge of both at once
  const a2 = T.e2(rec, heldOf(M1), cat, row1); const row2 = a2.row || row1;
  const R1p = tryRederive(row2, a2.H, OPT).out;
  const M2 = merge(applyHeld(M1, a2.H), R0p, R1p, { heldFrom: ARM }).out;

  const bothH = T.e2(rec, (() => { const x = T.e1(rec, clone(held0), cat, row); return x.H; })(), cat, row1);
  const rowBoth = bothH.row || row1;
  const R1both = tryRederive(rowBoth, bothH.H, OPT).out;
  const Mboth = merge(applyHeld(rec, bothH.H), R0, R1both, { heldFrom: ARM }).out;

  const seqDiff = diffKeys(M2, Mboth);
  console.log(`\n=== ${keyOf(row)}  —  ${T.name}   (arm='${ARM}')`);
  console.log(`  e1=${a1.what}  e2=${a2.what}`);
  console.log(`  (i)  CACHE CLAIM  rederive(S1) === previous R1 ? ${cacheDiff.length === 0}  ${cacheDiff.length ? `⛔ differs: ${cacheDiff.join(' ')}` : ''}`);
  if (cacheDiff.length) {
    for (const kv of cacheDiff.slice(0, 4)) { const k = kv.split(':')[0]; const d = pathDiff(R1[k], R0p[k]); console.log(`        ${k}: ${[...d.changed, ...d.added, ...d.removed].slice(0, 6).join(' ')}`); }
  }
  console.log(`  (ii) merge∘merge === merge(both) ? ${seqDiff.length === 0}  ${seqDiff.length ? `⛔ differs: ${seqDiff.join(' ')}` : ''}`);
  if (seqDiff.length) {
    for (const kv of seqDiff.slice(0, 5)) {
      const k = kv.split(':')[0]; const d = pathDiff(M2[k], Mboth[k]);
      const p0 = [...d.changed, ...d.added, ...d.removed].slice(0, 4);
      console.log(`        ${k}: ${fmtTally([...d.added, ...d.changed, ...d.removed], 5)}   e.g. ${p0.join(' ')}`);
    }
  }
  const OBS = observeBands([rec]);
  const FOBS = globalThis.__FOBS__;
  const base = new Set([...checkExact(rec), ...checkBands(rec, OBS), ...checkFlags(rec, FOBS)]);
  const iv = (x) => [...checkExact(x), ...checkBands(x, OBS), ...checkFlags(x, FOBS)].filter(y => !base.has(y));
  console.log(`  invariants — M2 new=${JSON.stringify(iv(M2))} · Mboth new=${JSON.stringify(iv(Mboth))} · M1 new=${JSON.stringify(iv(M1))}`);
  console.log(`  foodSecurity: M2 label="${M2.economicState?.foodSecurity?.label}" isSecure=${M2.economicState?.foodSecurity?.isSecure} | Mboth label="${Mboth.economicState?.foodSecurity?.label}" isSecure=${Mboth.economicState?.foodSecurity?.isSecure} | record label="${rec.economicState?.foodSecurity?.label}" isSecure=${rec.economicState?.foodSecurity?.isSecure}`);
  console.log(`  sanity: M2 vs the record: ${diffKeys(rec, M2).join(' ').slice(0, 150)}`);
}
