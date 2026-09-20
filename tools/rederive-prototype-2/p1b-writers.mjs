/**
 * P1.E — for every wrapped symbol inside `assembleSettlement`: (i) which HELD KEY it changes,
 * by leaf-path delta arg0→(ret|arg0-after); (ii) HOW MANY DRAWS it spends on the step's own
 * stream. (ii) is what decides whether "consult the pin and leave the key as it is" (ruling 1)
 * can SKIP the writer — a writer that draws cannot be skipped without moving the stream for
 * everything after it in the same step.
 *
 * Instrument: `__FN_OVERRIDE__` around each symbol, calling the ORIGINAL, reading the
 * instrumented root's per-step draw counter across the call.
 *
 * usage: node --import ./hook3.mjs p1b-writers.mjs
 */
import { instrumentedRoot, runHeadless } from './instrument.mjs';
import { clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';

const HELD = ['name', 'institutions', 'npcs', 'factions', 'relationships', 'conflicts', 'powerStructure'];
const SYMS = ['generateSettlementName', 'renderStressSummary', 'generatePressureSentence', 'generateArrivalScene',
  'generateDefenseProfile', 'assertPowerEconomyFreshness', 'projectPowerGenerationIntent', 'assertStableGeneratedRoster',
  'reconcilePowerStructure', 'refreshPowerGenerationTraces', 'resizePoliticalRoster', 'buildPoliticalNarrative',
  'mergeNPCLists', 'disperseNamedRoster', 'enrichNpcCoherence', 'relinkFactionMembers', 'generateCoherence',
  'ensureFactionStructuralNpcs', 'buildGenerationCoherenceReceipt', 'normalizeSettlement',
  'promoteStressorsToConditions', 'reapplyEventConditions'];

const ROWS = ['thorp', 'village', 'town', 'city', 'metropolis'].map(t => sample63().find(r => r.settType === t));

const agg = new Map(); // sym -> { calls, draws, keys: Map<key, paths> }

for (const row of ROWS) {
  const { root, perStep } = instrumentedRoot(row._seed);
  const ov = {};
  for (const s of SYMS) {
    ov[s] = (args, orig, self) => {
      const rec = perStep.get('assembleSettlement');
      const d0 = rec ? rec.draws : 0;
      const before = (args[0] && typeof args[0] === 'object') ? clone(args[0]) : undefined;
      const ret = orig.apply(self, args);
      const d1 = rec ? rec.draws : 0;
      const a = agg.get(s) || { calls: 0, draws: 0, keys: new Map(), perRow: new Map() };
      a.calls += 1; a.draws += (d1 - d0);
      a.perRow.set(keyOf(row), (a.perRow.get(keyOf(row)) || 0) + (d1 - d0));
      // which held key did it change? compare arg0's held keys with (ret ?? arg0-after)
      const after = (ret && typeof ret === 'object' && !Array.isArray(ret)) ? ret : args[0];
      if (before && after && typeof after === 'object') {
        for (const k of HELD) {
          if (!(k in before) && !(k in after)) continue;
          const d = pathDiff(before[k], after[k]);
          const n = d.added.length + d.changed.length + d.removed.length;
          if (!n) continue;
          const cur = a.keys.get(k) || { n: 0, shapes: [] };
          cur.n += n; cur.shapes.push(...d.added, ...d.changed, ...d.removed);
          a.keys.set(k, cur);
        }
      }
      agg.set(s, a);
      return ret;
    };
  }
  globalThis.__FN_OVERRIDE__ = ov;
  try { runHeadless(row, root); } finally { globalThis.__FN_OVERRIDE__ = null; }
}

console.log('=== P1.E — writers inside assembleSettlement: DRAWS and the HELD KEYS they move ===');
console.log('(5 rows: thorp, village, town, city, metropolis — draws are the SUM over the five)\n');
console.log('symbol                          calls  draws  held keys it changes (leaf paths, shapes)');
for (const s of SYMS) {
  const a = agg.get(s);
  if (!a) { console.log(`${s.padEnd(30)}   (never called)`); continue; }
  const keys = [...a.keys.entries()].map(([k, v]) => `${k}:${v.n} [${fmtTally(v.shapes, 3)}]`).join(' ; ');
  console.log(`${s.padEnd(30)} ${String(a.calls).padStart(5)}  ${String(a.draws).padStart(5)}  ${keys || '—'}`);
}
console.log('\nper-row draw split for the drawing writers:');
for (const s of SYMS) {
  const a = agg.get(s);
  if (!a || !a.draws) continue;
  console.log(`  ${s.padEnd(30)} ${[...a.perRow.entries()].map(([k, n]) => `${k.split('|')[0]}=${n}`).join(' ')}`);
}
