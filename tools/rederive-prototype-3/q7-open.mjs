/**
 * Q7 — the two items the second recon could not settle.
 *  (a) draw-SKIP vs draw-CONSUME inside `assembleInstitutions` (3,324 draws over 63 rows).
 *      The MAXIMAL version of "the held producer's draws did not happen the way they did" is to
 *      give that step a DIFFERENT stream (`perturbStep`). Anything that moves is what a real skip
 *      COULD move; nothing that moves means skip and consume are indistinguishable.
 *  (b) a NEWLY ADDED NPC when `enrichNpcCoherence` is skipped for a held roster.
 * usage: node --import ./hook3.mjs q7-open.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, rederiveFull, HELD_KEYS } from './seam3.mjs';
import { merge } from './merge.mjs';

const OPT = { nameMode: 'consume', relink: true, pinAwareAsserts: true, holdPower: true };
const rows = sample63();

console.log('=== Q7.a — is a held step\'s STREAM POSITION observable? (perturb one step\'s stream under the seam) ===');
for (const step of ['assembleInstitutions', 'cascadePass', 'generatePopulation', 'assembleSettlement']) {
  let same = 0; const div = new Map(); let threw = 0; let drawTotal = 0; let drawTotalP = 0;
  const otherStepDrawsDiffer = [];
  for (const row of rows) {
    const rec = generate(row); const held = heldOf(rec);
    let a; let b;
    try { a = rederiveFull(row, held, OPT); b = rederiveFull(row, held, { ...OPT, rootOpts: { perturbStep: step } }); }
    catch (e) { threw += 1; continue; }
    drawTotal += a.ctx.__perStep.get(step)?.draws ?? 0;
    drawTotalP += b.ctx.__perStep.get(step)?.draws ?? 0;
    for (const [k, v] of a.ctx.__perStep) { const w = b.ctx.__perStep.get(k); if (k !== step && (w?.draws ?? -1) !== v.draws) otherStepDrawsDiffer.push(`${keyOf(row)}:${k}`); }
    if (h(a.settlement) === h(b.settlement)) { same += 1; continue; }
    for (const k of new Set([...Object.keys(a.settlement), ...Object.keys(b.settlement)])) {
      if (h(a.settlement[k]) === h(b.settlement[k])) continue;
      const d = pathDiff(a.settlement[k], b.settlement[k]);
      const e = div.get(k) || { rows: 0, paths: [] }; e.rows += 1; e.paths.push(...d.added, ...d.changed, ...d.removed); div.set(k, e);
    }
  }
  console.log(`  perturb ${step.padEnd(22)} identical=${same}/${rows.length} threw=${threw} · that step's draws ${drawTotal}→${drawTotalP} · OTHER steps' draw counts changed in ${otherStepDrawsDiffer.length} (step,row) pairs`);
  for (const [k, e] of [...div.entries()].sort((a, b) => b[1].paths.length - a[1].paths.length).slice(0, 8)) {
    console.log(`      ⛔ ${k.padEnd(28)} rows=${e.rows} paths=${e.paths.length}  ${fmtTally(e.paths, 5)}`);
  }
}

console.log('\n=== Q7.b — the NEWCOMER: a `dm:`-id NPC pushed into a held roster ===');
for (const t of ['village', 'town', 'city', 'metropolis']) {
  const row = rows.find(r => r.settType === t);
  const rec = generate(row); const held0 = heldOf(rec);
  const R0 = rederiveFull(row, held0, OPT).settlement;
  const H = clone(held0);
  const neighbour = H.npcs[0];
  const newcomer = { id: 'dm:npc_new_1', name: 'Reinhild Ostwald', role: 'Ferrier', age: 41, gender: 'female' };
  H.npcs = [...H.npcs, newcomer];
  let R1; let err = null;
  try { R1 = rederiveFull(row, H, OPT).settlement; } catch (e) { err = e.message; }
  if (err) { console.log(`  ${t}: ⛔ THREW ${err}`); continue; }
  const recEdited = (() => { const c = clone(rec); for (const k of HELD_KEYS) c[k] = clone(H[k]); return c; })();
  const { out: M } = merge(recEdited, R0, R1, { heldFrom: 'edited' });
  const outNew = (M.npcs || []).find(n => n.id === 'dm:npc_new_1');
  const outNeigh = (M.npcs || []).find(n => n.id === neighbour.id);
  const missing = Object.keys(outNeigh || {}).filter(k => outNew?.[k] === undefined);
  const extra = Object.keys(outNew || {}).filter(k => outNeigh?.[k] === undefined);
  const moved = [];
  for (const k of new Set([...Object.keys(recEdited), ...Object.keys(M)])) {
    if (h(recEdited[k]) === h(M[k])) continue;
    const d = pathDiff(recEdited[k], M[k]); moved.push(`${k}:${d.added.length + d.changed.length + d.removed.length}`);
  }
  console.log(`  ${t.padEnd(11)} threw=no · npcs ${rec.npcs.length}→${M.npcs.length} · newcomer present=${!!outNew}`);
  console.log(`     relationships ${rec.relationships.length}→${M.relationships.length} (unchanged=${h(M.relationships) === h(rec.relationships)}) · conflicts unchanged=${h(M.conflicts) === h(rec.conflicts)} · factions members touched=${h(M.factions) !== h(rec.factions)}`);
  console.log(`     ⛔ fields the newcomer LACKS beside its enriched neighbour (${missing.length}): ${missing.join(', ')}`);
  console.log(`     fields only the newcomer has (${extra.length}): ${extra.join(', ') || 'none'}`);
  console.log(`     readings that moved: ${moved.join(' ') || 'NONE'}`);
  const R = M.generationCoherenceReceipt;
  const ev = (R?.judgments || []).flatMap(j => (j.evidence || []).map(e => e.evidence)).filter(x => /NPCs \//.test(String(x)));
  console.log(`     receipt roster evidence: ${JSON.stringify(ev)} (record holds ${M.npcs.length} NPCs / ${M.relationships.length} relationships)`);
}
