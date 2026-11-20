// docs/chair/2026-11-07/people-5b/write-v1-fixture.mjs — PEOPLE-5B EDIT (2026-11-07, M-7).
//
// Writes the committed v1 fixture `tests/fixtures/legacy-saves/people-car-v1-2026-11-07.json`: the
// PEOPLE-5-PREP dry run's own fixtures (`docs/chair/2026-11-07/people-5-prep/migrate-dry-run.mjs`,
// its `generatedFixtures(60)` and `plantedFixtures`), born at the dry run's base `1031233a4` — the
// PRE-CAR v1 shape every save written before the people car carries (`factionAffiliation`,
// `secondaryAffiliation`, the grouping `settlement.factions`, ties `npc1Id`/`npc2Id`). The births
// and the six planted DM variants are the dry run's code, copied verbatim; only the output differs
// (the settlements themselves, as `{ label, campaignState: { locks }, settlement }` save entries,
// instead of a report). Each settlement is PROJECTED onto what the v1 -> v2 step reads or writes
// (identity, the roster's names, the powers' names, `npcs` whole, the grouping whole, the ties
// whole) — 9.8 MB of full records -> 3.0 MB; every card and every grouping member is byte-whole.
//
// Run FROM A CHECKOUT OF 1031233a4 (the generator must be the pre-car one):
//   git worktree add <dir> 1031233a4 && node <this file> <dir> > people-car-v1-2026-11-07.json
import { join } from 'node:path';

const ROOT = process.argv[2];
if (!ROOT) throw new Error('usage: node write-v1-fixture.mjs <checkout of 1031233a4>');
const { factionIdFromName } = await import(join(ROOT, 'src/lib/entities.js'));
const { applyUserEdit, isEditablePath } = await import(join(ROOT, 'src/domain/userEdits.js'));
const { createNpc } = await import(join(ROOT, 'src/domain/entities/npcs.js'));
const { birth, ensureLaws } = await import(join(ROOT, 'scripts/audit/soak-review/corpus.mjs'));

const powersOf = (s) => (Array.isArray(s?.powerStructure?.factions) ? s.powerStructure.factions : []);
const powerName = (p) => String(p?.faction || p?.name || '');

await ensureLaws();
const generated = [];
for (let i = 0; i < 60; i += 1) {
  const s = JSON.parse(JSON.stringify(birth(i).settlement)); // a SAVE is JSON: the grouping's aliases split here
  generated.push({ label: `soak1k-${i} (${s.tier})`, s, locks: {} });
}
const planted = [];
generated.slice(0, 6).forEach(({ label, s: s0 }, k) => {
  const s = JSON.parse(JSON.stringify(s0));
  const powers = powersOf(s);
  const p0 = powers[0] ? powerName(powers[0]) : '';
  const p1 = powers[1] ? powerName(powers[1]) : p0;
  const a = s.npcs[0];
  const editable = isEditablePath('npc', 'factionAffiliation');
  if (a) applyUserEdit(a, editable ? 'factionAffiliation' : 'name', editable ? p1 : `${a.name} the Elder`);
  const born = createNpc({ name: `Planted ${k}`, role: 'envoy', linkedFactionIds: p0 ? [factionIdFromName(p0)] : [], _idSeed: `evt_plant_${k}` });
  born.createdByEventId = `evt_plant_${k}`;
  s.npcs.push(born);
  if (s.npcs[1]) s.npcs[1].locked = true;
  const locks = s.npcs[2] ? { npcs: [s.npcs[2].id] } : {};
  if (k === 0) s.factions.push({ name: 'Planted Grouping-Only Faction', members: [], dominantCategory: 'other', createdByEventId: 'evt_fac' });
  if (k === 1 && s.factions[0]?.members?.[0]) s.factions[0].members[0] = { ...s.factions[0].members[0], name: 'Stale Copy' };
  planted.push({ label: `planted<${label}>`, s, locks });
});
const project = (s) => ({
  id: s.id, name: s.name, tier: s.tier, schemaVersion: s.schemaVersion, _seed: s._seed,
  institutions: (s.institutions || []).map((i) => ({ name: i.name, category: i.category })),
  powerStructure: { factions: (s.powerStructure?.factions || []).map((f) => ({ faction: f.faction, name: f.name, id: f.id, power: f.power, isGoverning: f.isGoverning })) },
  npcs: s.npcs, factions: s.factions, relationships: s.relationships,
});
const entries = [...generated, ...planted].map(({ label, s, locks }) => ({ label, campaignState: { locks }, settlement: project(s) }));
process.stdout.write(`${JSON.stringify(entries)}\n`);
