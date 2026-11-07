// docs/chair/2026-11-07/people-5-prep/migrate-dry-run.mjs — PEOPLE-5-PREP (measure-only, 2026-11-07).
//
// A DRY RUN of M-7's save migration (schemaVersion 1 → 2): it PRINTS what each v1 fixture would
// become and writes nothing but its own report. It is NOT the migration: PEOPLE-5 writes that in
// `src/domain/settlementMigrations.js`. The proposal function below (`proposeV1toV2`) is the
// field-move table of the record's §3 spelled as code so it can be run on real bytes:
//
//   npcs[].factionAffiliation   → npcs[].memberships[] { power, rank: null, share: null }  (when it names a power)
//   npcs[].secondaryAffiliation → npcs[].memberships[] (when it names a power) · else reported (an institution handle)
//   npcs[].linkedFactionIds[]   → npcs[].memberships[] (each id resolved against powerStructure.factions)
//   npcs[].factionGoal, densityRungRole                       → deleted (no reader after PEOPLE-5)
//   npcs[].structuralRank       → reported only (PEOPLE-2 keeps a writer: a chair point, record §3.4)
//   npcs[].institution (the M-7 card field) → null for a DM-authored / event-born / locked card;
//                                             { kind: 'house', name } for a generated card whose v1 string
//                                             `institution` names a roster house; null otherwise
//   settlement.factions (the grouping) → dropped; a grouping entry that names NO power is reported (data loss)
//   relationships[] { npc1Id, npc2Id } → { from: npc1Id, to: npc2Id } (every other field kept)
//   schemaVersion 1 → 2
//
// Run: node docs/chair/2026-11-07/people-5-prep/migrate-dry-run.mjs [soakCount=60] > <out>
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../..');
const { normalizeSettlement } = await import(join(ROOT, 'src/domain/normalizeSettlement.js'));
const { resolveFactionRef } = await import(join(ROOT, 'src/domain/factionRefs.js'));
const { factionIdFromName } = await import(join(ROOT, 'src/lib/entities.js'));
const { tagEntityCanon } = await import(join(ROOT, 'src/domain/canonStatus.js'));
const { applyUserEdit, isEditablePath } = await import(join(ROOT, 'src/domain/userEdits.js'));
const { createNpc } = await import(join(ROOT, 'src/domain/entities/npcs.js'));

const OLD_NPC_FIELDS = ['factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal', 'densityRungRole', 'structuralRank'];

const powersOf = (s) => (Array.isArray(s?.powerStructure?.factions) ? s.powerStructure.factions : []);
const powerName = (p) => String(p?.faction || p?.name || '');
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** The power a name or id addresses, or null. Name first (the v1 field holds a display name). */
function powerFor(powers, ref) {
  if (ref == null || ref === '') return null;
  const hit = resolveFactionRef(powers, ref);
  if (hit) return hit;
  const byId = powers.filter((p) => factionIdFromName(powerName(p)) === String(ref));
  return byId.length === 1 ? byId[0] : null;
}

/** How a card is recognised as the DM's (record §3.3): the canon tagger's source, the entity flags, the envelope's lock map. */
function dmStatusOf(npc, locks) {
  const tag = tagEntityCanon(npc);
  const lockedIds = Array.isArray(locks?.npcs) ? locks.npcs.map(String) : [];
  const lockedById = lockedIds.includes(String(npc.id));
  const lockedWhole = locks?.npcs === true;
  const userEdited = isObj(npc._userEdits) && Object.keys(npc._userEdits).length > 0;
  const reasons = [];
  if (tag.source === 'user') reasons.push('authored');
  if (tag.source === 'event') reasons.push('event-born');
  if (tag.locked || npc.pinned === true) reasons.push('entity-locked');
  if (lockedById) reasons.push('lock-map-id');
  if (lockedWhole) reasons.push('lock-map-whole-roster');
  if (userEdited && tag.source !== 'user') reasons.push('user-edited');
  return reasons;
}

/**
 * The proposal: v1 settlement (+ its envelope's locks) → { next, report }. Pure.
 * @param {Record<string, any>} s @param {Record<string, any>} [locks]
 */
export function proposeV1toV2(s, locks = {}) {
  const powers = powersOf(s);
  const report = {
    npcs: 0, dmCards: [], moved: { factionAffiliation: 0, secondaryAffiliation: 0, linkedFactionIds: 0 },
    deleted: { factionGoal: 0, densityRungRole: 0 }, structuralRankCarried: 0,
    unmapped: [], membershipsPerCard: {}, groupingDropped: 0, groupingOrphans: [], memberCopyDiverged: 0,
    houseLinked: 0, dmHouseDropped: 0, relationships: 0, relMoved: 0, relMissingEnd: 0, outDegreeOver1: 0, cardsKept: 0, fieldsLeft: 0,
  };
  const npcs = Array.isArray(s.npcs) ? s.npcs : [];
  const nextNpcs = npcs.map((npc) => {
    if (!isObj(npc)) return npc;
    report.npcs += 1;
    const dm = dmStatusOf(npc, locks);
    if (dm.length) report.dmCards.push({ id: npc.id, name: npc.name, why: dm });
    /** @type {Array<{power: string, rank: null, share: null}>} */
    const memberships = [];
    const add = (p) => { const name = powerName(p); if (name && !memberships.some((m) => m.power === name)) memberships.push({ power: name, rank: null, share: null }); };
    if (npc.factionAffiliation != null && npc.factionAffiliation !== '') {
      const p = powerFor(powers, npc.factionAffiliation);
      if (p) { add(p); report.moved.factionAffiliation += 1; } else report.unmapped.push({ id: npc.id, field: 'factionAffiliation', value: npc.factionAffiliation });
    }
    if (npc.secondaryAffiliation != null && npc.secondaryAffiliation !== '') {
      const p = powerFor(powers, npc.secondaryAffiliation);
      if (p) { add(p); report.moved.secondaryAffiliation += 1; } else {
        const inst = (s.institutions || []).some((i) => String(i?.name || '') === String(npc.secondaryAffiliation));
        report.unmapped.push({ id: npc.id, field: 'secondaryAffiliation', value: npc.secondaryAffiliation, names: inst ? 'an institution on the roster' : 'neither a power nor a roster institution' });
      }
    }
    for (const ref of Array.isArray(npc.linkedFactionIds) ? npc.linkedFactionIds : []) {
      const p = powerFor(powers, ref);
      if (p) { add(p); report.moved.linkedFactionIds += 1; } else report.unmapped.push({ id: npc.id, field: 'linkedFactionIds[]', value: ref });
    }
    if ('factionGoal' in npc) report.deleted.factionGoal += 1;
    if ('densityRungRole' in npc) report.deleted.densityRungRole += 1;
    if ('structuralRank' in npc) report.structuralRankCarried += 1;
    const next = { ...npc };
    for (const k of ['factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal', 'densityRungRole']) delete next[k];
    next.memberships = memberships;
    // M-7: a DM-authored or locked NPC is a face of no house (`institution: null`). A v1 GENERATED card
    // keeps the one house link v1 can carry — a string `institution` naming a roster house (measured: 60 of
    // 1,173 soak cards, every one on the roster) — as `{ kind: 'house', name }`; every other card is null.
    const v1House = typeof npc.institution === 'string' && (s.institutions || []).some((i) => String(i?.name || '') === npc.institution) ? npc.institution : null;
    if (dm.length) { if (npc.institution != null) report.dmHouseDropped += 1; next.institution = null; }
    else if (v1House) { next.institution = { kind: 'house', name: v1House }; report.houseLinked += 1; }
    else { if (npc.institution != null) report.unmapped.push({ id: npc.id, field: 'institution', value: npc.institution }); next.institution = null; }
    report.membershipsPerCard[memberships.length] = (report.membershipsPerCard[memberships.length] || 0) + 1;
    // Everything else the card carries is kept verbatim (personality, secret, _userEdits, locks on the envelope ...)
    const keptKeys = Object.keys(npc).filter((k) => !OLD_NPC_FIELDS.includes(k) && k !== 'institution');
    if (keptKeys.every((k) => next[k] === npc[k])) report.cardsKept += 1;
    report.fieldsLeft += OLD_NPC_FIELDS.filter((k) => k !== 'structuralRank' && k in next).length;
    return next;
  });
  // the grouping: a MIRROR of npcs[] + powers; dropped. Report what dropping it would lose.
  const grouping = Array.isArray(s.factions) ? s.factions : [];
  report.groupingDropped = grouping.length;
  const byId = new Map(npcs.filter(isObj).map((n) => [String(n.id), n]));
  for (const g of grouping) {
    if (!isObj(g)) continue;
    const named = String(g.name || g.faction || '');
    if (!powerFor(powers, named)) report.groupingOrphans.push({ name: named, members: (g.members || []).length, createdByEventId: g.createdByEventId || null });
    for (const m of Array.isArray(g.members) ? g.members : []) {
      const src = isObj(m) ? byId.get(String(m.id)) : undefined;
      if (!src || JSON.stringify(src) !== JSON.stringify(m)) report.memberCopyDiverged += 1;
    }
  }
  // relationships: the undirected pair becomes a directed tie; out-degree > 1 is KEPT (DM content is never dropped)
  const rels = Array.isArray(s.relationships) ? s.relationships : [];
  const out = new Map();
  const nextRels = rels.map((r) => {
    if (!isObj(r)) return r;
    report.relationships += 1;
    const { npc1Id, npc2Id, ...rest } = r;
    if (npc1Id === undefined || npc2Id === undefined) { report.relMissingEnd += 1; return r; }
    report.relMoved += 1;
    out.set(String(npc1Id), (out.get(String(npc1Id)) || 0) + 1);
    return { ...rest, from: npc1Id, to: npc2Id };
  });
  report.outDegreeOver1 = [...out.values()].filter((n) => n > 1).length;
  const next = { ...s, npcs: nextNpcs, relationships: nextRels, schemaVersion: 2 };
  delete next.factions;
  return { next, report };
}

// ── The fixtures ──────────────────────────────────────────────────────────────────────────
/** Every v1 save shape committed in the repository (record §3.1), as the loader sees it. */
function committedFixtures() {
  const files = [
    'tests/fixtures/legacy-saves/april-2026-v1.json',
    'tests/fixtures/save-museum/02-v2-draft-2026-06.json',
    'tests/fixtures/save-museum/03-campaign-canon-2026-07.json',
    'tests/fixtures/save-museum/04-forward-version-vNext.json',
  ];
  const rows = [];
  for (const f of files) {
    const entries = JSON.parse(readFileSync(join(ROOT, f), 'utf8'));
    entries.forEach((e, i) => {
      const raw = e.settlement || e;
      const forward = typeof raw.schemaVersion === 'number' && raw.schemaVersion > 1;
      const s = forward ? raw : normalizeSettlement(raw);
      rows.push({ label: `${f.replace('tests/fixtures/', '')}#${i}`, s, locks: e.campaignState?.locks || {}, forward });
    });
  }
  return rows;
}

/** v1 settlements as today's generator writes them (every save made at this base is one). */
async function generatedFixtures(count) {
  const { birth, ensureLaws } = await import(join(ROOT, 'scripts/audit/soak-review/corpus.mjs'));
  await ensureLaws();
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    const s = JSON.parse(JSON.stringify(birth(i).settlement)); // a SAVE is JSON: the grouping's aliases split here
    rows.push({ label: `soak1k-${i} (${s.tier})`, s, locks: {} });
  }
  return rows;
}

/** The DM layer planted with the real writers on copies of six generated v1 settlements. */
function plantedFixtures(base) {
  const rows = [];
  base.slice(0, 6).forEach(({ label, s: s0 }, k) => {
    const s = JSON.parse(JSON.stringify(s0));
    const powers = powersOf(s);
    const p0 = powers[0] ? powerName(powers[0]) : '';
    const p1 = powers[1] ? powerName(powers[1]) : p0;
    // (a) a DM-authored edit of a generated card — userEdits.js :: applyUserEdit (stamps _authored + _userEdits)
    const a = s.npcs[0];
    const editable = isEditablePath('npc', 'factionAffiliation');
    if (a) applyUserEdit(a, editable ? 'factionAffiliation' : 'name', editable ? p1 : `${a.name} the Elder`);
    // (b) an event-born NPC — mutateEntities.js :: addNpc (createNpc + createdByEventId), linked by id to a power
    const born = createNpc({ name: `Planted ${k}`, role: 'envoy', linkedFactionIds: p0 ? [factionIdFromName(p0)] : [], _idSeed: `evt_plant_${k}` });
    born.createdByEventId = `evt_plant_${k}`;
    s.npcs.push(born);
    // (c) an entity lock flag on a generated card (canonStatus.js reads `locked`)
    if (s.npcs[1]) s.npcs[1].locked = true;
    // (d) the envelope's lock map naming a card by id (locksPreservation.js :: normalizeLocks reads nothing today)
    const locks = s.npcs[2] ? { npcs: [s.npcs[2].id] } : {};
    // (e) a grouping-only faction as an ADD_FACTION on a pre-pipeline save writes it (mutateEntities.js:426)
    if (k === 0) s.factions.push({ name: 'Planted Grouping-Only Faction', members: [], dominantCategory: 'other', createdByEventId: 'evt_fac' });
    // (f) a reloaded save whose member copy diverged from npcs[] (factionRename.js NPC_HOMES' own case)
    if (k === 1 && s.factions[0]?.members?.[0]) s.factions[0].members[0] = { ...s.factions[0].members[0], name: 'Stale Copy' };
    rows.push({ label: `planted<${label}>`, s, locks, planted: { factionAffiliationEditable: editable } });
  });
  return rows;
}

// ── Run ───────────────────────────────────────────────────────────────────────────────────
const soakCount = Number(process.argv[2] || 60);
const committed = committedFixtures();
const generated = await generatedFixtures(soakCount);
const planted = plantedFixtures(generated);
const totals = { fixtures: 0, npcs: 0, dmCards: 0, cardsKept: 0, unmapped: 0, unmappedByField: {}, moved: { factionAffiliation: 0, secondaryAffiliation: 0, linkedFactionIds: 0 }, deleted: { factionGoal: 0, densityRungRole: 0 }, structuralRankCarried: 0, groupingDropped: 0, groupingOrphans: 0, memberCopyDiverged: 0, relationships: 0, relMoved: 0, outDegreeOver1Cards: 0, membershipsPerCard: {}, fieldsLeft: 0, forwardPassThrough: 0, houseLinked: 0, dmHouseDropped: 0 };
const lines = [];
for (const set of [['COMMITTED', committed], ['GENERATED', generated], ['PLANTED', planted]]) {
  lines.push(`\n## ${set[0]} (${set[1].length})`);
  for (const row of set[1]) {
    totals.fixtures += 1;
    if (row.forward) { totals.forwardPassThrough += 1; lines.push(`${row.label}: schemaVersion ${row.s.schemaVersion} > 1 — the runner passes it through unchanged (no down-migration), not migrated`); continue; }
    const { report: r } = proposeV1toV2(row.s, row.locks);
    totals.npcs += r.npcs; totals.dmCards += r.dmCards.length; totals.cardsKept += r.cardsKept; totals.unmapped += r.unmapped.length;
    for (const u of r.unmapped) totals.unmappedByField[`${u.field}${u.names ? ' (' + u.names + ')' : ''}`] = (totals.unmappedByField[`${u.field}${u.names ? ' (' + u.names + ')' : ''}`] || 0) + 1;
    for (const k of Object.keys(r.moved)) totals.moved[k] += r.moved[k];
    for (const k of Object.keys(r.deleted)) totals.deleted[k] += r.deleted[k];
    totals.structuralRankCarried += r.structuralRankCarried; totals.groupingDropped += r.groupingDropped; totals.groupingOrphans += r.groupingOrphans.length;
    totals.memberCopyDiverged += r.memberCopyDiverged; totals.relationships += r.relationships; totals.relMoved += r.relMoved; totals.outDegreeOver1Cards += r.outDegreeOver1; totals.fieldsLeft += r.fieldsLeft; totals.houseLinked += r.houseLinked; totals.dmHouseDropped += r.dmHouseDropped;
    for (const [k, v] of Object.entries(r.membershipsPerCard)) totals.membershipsPerCard[k] = (totals.membershipsPerCard[k] || 0) + v;
    const brief = `${row.label}: npcs ${r.npcs} (kept ${r.cardsKept}) · moved fa ${r.moved.factionAffiliation}/sa ${r.moved.secondaryAffiliation}/lf ${r.moved.linkedFactionIds} · memberships/card ${JSON.stringify(r.membershipsPerCard)} · deleted goal ${r.deleted.factionGoal}/rung ${r.deleted.densityRungRole} · house-linked ${r.houseLinked} · structuralRank carried ${r.structuralRankCarried} · grouping dropped ${r.groupingDropped} (orphans ${r.groupingOrphans.length}, diverged member copies ${r.memberCopyDiverged}) · ties ${r.relMoved}/${r.relationships} → from/to (cards with out-degree>1: ${r.outDegreeOver1})`;
    lines.push(brief);
    if (r.dmCards.length) lines.push(`   DM cards → institution null, card kept: ${r.dmCards.map((d) => `${d.id}[${d.why.join('+')}]`).join(', ')}`);
    if (r.unmapped.length) lines.push(`   cannot map: ${r.unmapped.map((u) => `${u.id}.${u.field}=${JSON.stringify(u.value)}${u.names ? ' (' + u.names + ')' : ''}`).join('; ')}`);
    if (r.groupingOrphans.length) lines.push(`   grouping entries naming no power (lost if dropped): ${JSON.stringify(r.groupingOrphans)}`);
    if (row.planted) lines.push(`   planted: userEdits allows 'factionAffiliation' on an npc: ${row.planted.factionAffiliationEditable}`);
  }
}
console.log('# PEOPLE-5-PREP — the M-7 save-migration DRY RUN (v1 → v2), measure-only');
console.log(`# soak births: ${soakCount}; committed v1 files: 4 (+ the forward exhibit); planted DM variants: ${planted.length}`);
console.log(lines.join('\n'));
console.log('\n## TOTALS');
console.log(JSON.stringify(totals, null, 1));
