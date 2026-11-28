// TAIL-CLOSE-DOORS-1 · the chair's ruling PD3 (2026-11-15): the pool dominance rows traced BY MEASUREMENT.
// Run against a tree:  node pd3-probe.mjs <tree-root> [seed-prefix=quarrel] > out.json
// It reads the pool-dominance guard's own corpus (corpusSeeds), the same pipeline and the same ledger, and for
//  - the two plot-hook pools (succession_crisis, resource_scarcity): towns that draw the pool, draws by kind
//    (A = a tension prints its whole list, R = an event draws one), each line's pick share, and for each line
//    how many of those towns' records ADMIT it and which atoms REFUSE it (declarationAdmits over factsOf(record):
//    the final record's facts, PLAUSIBLY the draw-time facts);
//  - the two sibling tables (NPC_HOOK_SIBLINGS, HISTORY_DESC_SIBLINGS): draws and towns keyed by
//    (member index, the original's atoms), the finest key the ledger gives; the widest key's share is an UPPER
//    BOUND on the widest single sentence's share.
// Read-only: it writes nothing into the tree.
import { join } from 'node:path';

const ROOT = process.argv[2];
const PREFIX = process.argv[3] || 'quarrel';
const pd = await import(join(ROOT, 'scripts/census/pool-dominance.mjs'));
const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { withPresumptionLedger } = await import(join(ROOT, 'src/domain/facts/presumptionLedger.js'));
const { factsOf } = await import(join(ROOT, 'src/domain/facts/factsOf.js'));
const { declarationOf, declarationAdmits } = await import(join(ROOT, 'src/domain/facts/factVocabulary.js'));
const { HISTORICAL_EVENTS_DATA } = await import(join(ROOT, 'src/data/historyData.js'));

const HOOKS = ['succession_crisis', 'resource_scarcity'];
const SIB = ['npcData:NPC_HOOK_SIBLINGS', 'historyData:HISTORY_DESC_SIBLINGS'];
const text = (l) => (typeof l === 'string' ? l : l?.text ?? String(l));
const out = {};
for (const t of HOOKS) out[t] = { towns: 0, draws: 0, byKind: {}, picks: {}, lines: HISTORICAL_EVENTS_DATA.find((e) => e.type === t).plotHooks.map((l) => ({ text: text(l), eligible: 0, refused: {} })) };
for (const p of SIB) out[p] = { towns: 0, draws: 0, keys: {} };

for (const { tier, seed, config } of pd.corpusSeeds(PREFIX)) {
  const { result: s, ledger } = withPresumptionLedger(() => generateSettlementPipeline({ settType: tier, ...config }, null, { seed }));
  const seen = new Set();
  /** @type {Map<string, Set<string>>} */ const keyTowns = new Map();
  for (const e of ledger) {
    const hook = HOOKS.find((t) => e.pool === `historyData:HISTORICAL_EVENTS_DATA.plotHooks:${t}`);
    const sib = SIB.find((p) => e.pool === p);
    if (!hook && !sib) continue;
    const id = hook || sib;
    seen.add(id);
    if (e.resolvedBy === 'none') continue;
    const o = out[id]; o.draws += 1;
    if (hook) { o.byKind[e.drawKind] = (o.byKind[e.drawKind] || 0) + 1; o.picks[String(e.lineId)] = (o.picks[String(e.lineId)] || 0) + 1; }
    else {
      const k = `${e.lineId} | ${(e.atoms || []).join(', ')}`;
      const row = (o.keys[k] = o.keys[k] || { draws: 0, towns: 0 }); row.draws += 1;
      keyTowns.set(k, (keyTowns.get(k) || new Set()).add(seed));
    }
  }
  for (const id of seen) out[id].towns += 1;
  for (const [k] of keyTowns) for (const p of SIB) if (out[p].keys[k] && seen.has(p)) { out[p].keys[k].towns += 1; break; }
  const facts = factsOf(s);
  for (const t of HOOKS) {
    if (!seen.has(t)) continue;
    const raw = HISTORICAL_EVENTS_DATA.find((e) => e.type === t).plotHooks;
    raw.forEach((l, i) => {
      const r = declarationAdmits(declarationOf(l), facts);
      if (r.admitted) out[t].lines[i].eligible += 1;
      else for (const a of r.refused) out[t].lines[i].refused[a] = (out[t].lines[i].refused[a] || 0) + 1;
    });
  }
}
for (const t of HOOKS) for (const [k, n] of Object.entries(out[t].picks)) out[t].picks[k] = { draws: n, share: +(n / out[t].draws).toFixed(4) };
for (const p of SIB) {
  const sorted = Object.entries(out[p].keys).sort((a, b) => b[1].draws - a[1].draws);
  out[p].keys = Object.fromEntries(sorted.slice(0, 12).map(([k, v]) => [k, { ...v, share: +(v.draws / out[p].draws).toFixed(4) }]));
  out[p].distinctKeys = sorted.length;
}
console.log(JSON.stringify(out, null, 1));
