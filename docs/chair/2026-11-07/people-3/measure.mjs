// PEOPLE-3 HOOKS measurement (2026-11-07): PEOPLE-0's hook instrument (../people-0/measure.mjs,
// untouched) adapted to the three classes and the parties. Measure-only: births settlements,
// writes one JSON line each. Runs at ANY tree (the base included): a hook without `class` is
// classed by its category, a hook without `parties` by its links, so the before and the after
// are read by the one instrument.
//   node docs/chair/2026-11-07/people-3/measure.mjs soak <out.jsonl> [from] [to]
//   node docs/chair/2026-11-07/people-3/measure.mjs golden <out.jsonl>
// Run from the tree to measure (the imports resolve against the working directory).
import { appendFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const at = (rel) => pathToFileURL(`${process.cwd()}/${rel}`).href;
const { generateSettlementPipeline } = await import(at('src/generators/generateSettlementPipeline.js'));
const { collectPlotHooks } = await import(at('src/domain/dossier/plotHooks.js'));

const CLASS_OF = { npc: 'person', faction: 'tension', tension: 'tension', economics: 'tension', safety: 'tension', history: 'history', relationship: 'tension' };

export function measure(s, label) {
  const npcs = s.npcs || [];
  const cards = npcs.filter((n) => n && n.institution);
  const temps = npcs.filter((n) => n && !n.institution);
  const hooks = collectPlotHooks(s);
  const cls = { person: 0, tension: 0, history: 0 };
  const src = {};
  const partyKinds = {};
  const personHooksOf = new Map();
  for (const h of hooks) {
    const c = h.class || CLASS_OF[h.category] || 'tension';
    cls[c] += 1;
    const source = h.crisis ? 'crisis' : (h.source === 'Traditions' ? 'tradition' : h.category);
    src[source] = (src[source] || 0) + 1;
    const kinds = Array.isArray(h.parties)
      ? [...new Set(h.parties.map((p) => p.kind))].sort().join('+') || 'none'
      : ([...new Set((h.links || []).map((l) => (l.kind === 'npc' ? 'person' : l.kind === 'faction' ? 'power' : l.kind)))].sort().join('+')
        || (h.category === 'history' ? 'history' : 'none'));
    partyKinds[kinds] = (partyKinds[kinds] || 0) + 1;
    if (c === 'person') {
      const id = (h.parties || []).find((p) => p.kind === 'person')?.id ?? (h.links || []).find((l) => l.kind === 'npc')?.id;
      personHooksOf.set(String(id), (personHooksOf.get(String(id)) || 0) + 1);
    }
  }
  const perCard = cards.map((c) => personHooksOf.get(String(c.id)) || 0);
  const recordPerCard = cards.map((c) => (c.plotHooks || []).length);
  // what the gate's party arm is offered that the record does not hold (should be none)
  const powers = new Set((s.powerStructure?.factions || []).map((f) => String(f?.faction || f?.name || '').trim()));
  const ids = new Set(npcs.map((n) => String(n?.id ?? n?.name)));
  const strayConflictParties = (s.conflicts || []).flatMap((c) => c.parties || []).filter((p) => !powers.has(p)).length;
  const strayLosers = [].concat(s.stress || []).flatMap((e) => e?.cast?.stakes || []).filter((k) => k?.stake === 'loses' && k.factionId && !powers.has(k.factionId)).length;
  const strayHolders = [].concat(s.stress || []).flatMap((e) => e?.cast?.roles || []).filter((r) => r?.kind === 'npc' && !ids.has(String(r.id))).length;
  const lines = cards.map((c) => (c.plotHooks || [])[0]).filter(Boolean);
  return { label, tier: s.tier, cards: cards.length, temps: temps.length, nHooks: hooks.length, cls, src, partyKinds,
    perCardMin: perCard.length ? Math.min(...perCard) : null, perCardMax: perCard.length ? Math.max(...perCard) : null,
    recordMin: recordPerCard.length ? Math.min(...recordPerCard) : null, recordMax: recordPerCard.length ? Math.max(...recordPerCard) : null,
    tempHooks: temps.reduce((a, n) => a + (n.plotHooks || []).length, 0),
    repeats: lines.length - new Set(lines).size, strayConflictParties, strayLosers, strayHolders };
}

const [mode, out, from = '0', to = '1000'] = process.argv.slice(2);
if (mode) {
  writeFileSync(out, '');
  if (mode === 'golden') {
    const { goldenCorpus, keyOf } = await import(at('tests/helpers/goldenMasterCorpus.js'));
    for (const cfg of goldenCorpus()) {
      const { _seed, ...rest } = cfg;
      appendFileSync(out, JSON.stringify(measure(generateSettlementPipeline(rest, null, { seed: _seed, customContent: {} }), keyOf(cfg))) + '\n');
    }
  } else {
    const { birth, ensureLaws } = await import(at('scripts/audit/soak-review/corpus.mjs'));
    await ensureLaws();
    for (let i = Number(from); i < Number(to); i += 1) appendFileSync(out, JSON.stringify(measure(birth(i).settlement, `soak1k-${i}`)) + '\n');
  }
}
