// PEOPLE-4 TIES measurement (2026-11-07): PEOPLE-0's tie readers (../people-0/measure.mjs, untouched)
// adapted to the DIRECTED tie (`from`, `to`). Measure-only: births settlements, writes one JSON line
// each. Reads both shapes, so the same script measures the lane's base (the undirected
// `npc1Id`/`npc2Id` pair) and its tip:
//   node docs/chair/2026-11-07/people-4/measure.mjs soak <out.jsonl> [from] [to]
//   node docs/chair/2026-11-07/people-4/measure.mjs golden <out.jsonl>
// Per settlement: the cards (every NPC but the crisis cast's temporary person), the ties, each
// card's out-degree and in-degree (directed) or degree (the pair), the kinds, self-ties, ties
// whose ends are off the roster.
import { appendFileSync, writeFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../../../../src/generators/generateSettlementPipeline.js';

export function measure(s, label) {
  const cards = (s.npcs || []).filter((n) => n && !n.temporary);
  const ids = new Set(cards.map((n) => n.id));
  const rels = s.relationships || [];
  const directed = rels.length === 0 || rels.every((r) => r && 'from' in r);
  const out = Object.fromEntries(cards.map((n) => [n.id, 0]));
  const inn = Object.fromEntries(cards.map((n) => [n.id, 0]));
  const kinds = {}; let self = 0; let offRoster = 0;
  for (const r of rels) {
    kinds[r.type] = (kinds[r.type] || 0) + 1;
    const a = directed ? r.from : r.npc1Id; const b = directed ? r.to : r.npc2Id;
    if (a === b) self += 1;
    if (!ids.has(a) || !ids.has(b)) offRoster += 1;
    if (a in out) out[a] += 1;
    if (b in inn) inn[b] += 1;
  }
  return {
    label, tier: s.tier, shape: directed ? 'directed' : 'pair', cards: cards.length, ties: rels.length,
    outDeg: Object.values(out), inDeg: Object.values(inn),
    degree: cards.map((n) => out[n.id] + inn[n.id]), kinds, self, offRoster,
  };
}

const [mode, outFile, from = '0', to = '1000'] = process.argv.slice(2);
if (mode) {
  writeFileSync(outFile, '');
  if (mode === 'golden') {
    const { goldenCorpus, keyOf } = await import('../../../../tests/helpers/goldenMasterCorpus.js');
    for (const cfg of goldenCorpus()) {
      const { _seed, ...rest } = cfg;
      appendFileSync(outFile, JSON.stringify(measure(generateSettlementPipeline(rest, null, { seed: _seed, customContent: {} }), keyOf(cfg))) + '\n');
    }
  } else {
    const { birth, ensureLaws } = await import('../../../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    for (let i = Number(from); i < Number(to); i += 1) appendFileSync(outFile, JSON.stringify(measure(birth(i).settlement, `soak1k-${i}`)) + '\n');
  }
}
