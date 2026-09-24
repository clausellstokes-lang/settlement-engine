/**
 * editCorpusRatchet.test.js — THE CORPUS RATCHET (EM-R7), the re-entry family's terminal proof.
 *
 * The REAL seam (`src/domain/edit/dmLayer.js :: rederive`, which is `pinsFrom` plus the injected
 * engine plus `tracePartition.js :: partitionTrace`) and the REAL merge
 * (`src/domain/edit/mergeConsequence.js :: mergeConsequence` over `recordMergeTree.js ::
 * mergeTree`) meet here over the 63-row derived stride, the eight edits and all six tiers.
 *
 * THE STRIDE IS DERIVED, NEVER FIXTURED: one row per `settType|terrainOverride` over the first 504
 * configurations of `goldenCorpus()`, plus the 21-row tail — the rule `tests/domain/
 * recordMerge.test.js :: sample63` already spells. A second SPELLING of a corpus is how two
 * instruments come to disagree while both report green, so the count and the six-tier histogram
 * are asserted before any arm runs.
 *
 * THE CHANNELS, stated once, because each edit's consequence is its channel's and not its own.
 *   LAYER       E1 rename an NPC, E2 change a role, E5 change one faction's power share,
 *               E6 seat a different governing faction — through the DM layer's `roots`, with the
 *               op's own write already on the record.
 *   MEMBERSHIP  E3 remove an institution, E4 add one — record-membership writes with a DORMANT
 *               layer. No declared membership channel exists, so `R0` is `R1`, the merge is the
 *               identity and NOTHING FOLLOWS the edit. That darkness is ASSERTED, not hidden, so
 *               the day EM-C4b gives them a channel this file reds.
 *   CONFIG      E7 terrain to desert, E8 culture to norse — through EM-B2b's LANDED world-fact
 *               route: a `worldFact:` root whose declaration carries `provenance: 'world-fact'`
 *               is sent to `config'` at its declared `inputKey`, and the consequence is the
 *               DIFFERENCE between the two re-derivations.
 *
 * Every figure below was EXECUTED at this file's own base; each arm asserts in BOTH directions, so
 * a widening reds here rather than passing quietly.
 *
 * CANNOT-CATCH:
 * 1.  The byte price. This member writes no `src/`; the train's byte-arm holder prices it.
 * 2.  The key ORDER of a merged record. `tests/domain/recordMerge.test.js` holds it.
 * 3.  A DM edit outside the eight-edit corpus; the runtime guard covers it by design.
 * 4.  The ladder's top-level rung write that carries `generationCoherenceReceipt.repairs` along
 *     with its READING parent (EM-R8's own slot). A4 asserts the channel totals and the held-key
 *     law, and says nothing about that sub-path.
 * 5.  A surface. Nothing here renders; wave 4 owns the cards.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { legitimacyBandOf, readinessBandOf } from '../../src/data/bandLadders.js';
import { MONSTER_THREAT_TIERS } from '../../src/data/monsterThreat.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { EMPTY_DM_LAYER, pinsFrom, rederive } from '../../src/domain/edit/dmLayer.js';
import { FIELD_DECLARATIONS, declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { enclosingGroup, mergeConsequence } from '../../src/domain/edit/mergeConsequence.js';
import { CHECK_META, CROSS_KEY_CHECKS } from '../../src/domain/edit/recordInvariantMeta.js';
import { recordInvariants } from '../../src/domain/edit/recordInvariants.js';
import { mergeTree } from '../../src/domain/edit/recordMergeTree.js';
import { CLASS_EXCEPTIONS, CONSISTENCY_GROUPS, KEYED_COLLECTIONS, RECORD_CLASSES } from '../../src/domain/edit/recordRegister.js';
import { NON_CASCADED_SURFACES as FACTION_NON_CASCADED, NPC_NON_CASCADED_SURFACES } from '../../src/domain/factionRename.js';
import { NON_CASCADED_SURFACES as INSTITUTION_NON_CASCADED } from '../../src/domain/institutionRename.js';
import { institutionRemovalChanges } from '../../src/domain/institutionRemoval.js';
import { CULTURES, TERRAINS } from '../../src/domain/worldFactOptions.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { renormalizeFactionPower } from '../../src/generators/power/rulingStructure.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

/** The corpus IS the battery: MEASURED under the runner, the census arm 22.8 s, the value arm
 *  20.5 s and the ordered-pair census 305.6 s, the file 350.7 s end to end. */
const ARM_TIMEOUT = 600_000;
const ROOT = process.cwd();
/** The injected handles, built the way `src/store/settlementRederiveAction.js` builds them. */
const ENGINE = Object.freeze({ run: generateSettlementPipeline, getStepMeta });
/** EM-P3's canonical sets, each IMPORTED from its own home and never re-typed. */
const OPTION_SETS = Object.freeze({ terrain: TERRAINS, culture: CULTURES, monsterThreat: MONSTER_THREAT_TIERS, stressors: Object.keys(STRESS_TYPE_MAP), resources: Object.keys(RESOURCE_DATA) });
/** The CALLER's adapter: the consult EM-B2b's world-fact channel is ADOPTED through. */
const CONSULT = Object.freeze({ declarationsFor, worldFactOptions: (field) => OPTION_SETS[field] ?? [] });
const h = (value) => JSON.stringify(value); const clone = (value) => structuredClone(value);
const layerOf = (pairs) => ({ roots: Object.fromEntries(pairs), worldFacts: {}, minted: {}, phantoms: {} });
const collapse = (path) => path.replace(/\[\d+\]/g, '[]');
const parentOf = (path) => { const cut = Math.max(path.lastIndexOf('.'), path.lastIndexOf('[')); return cut <= 0 ? path : path.slice(0, cut); };
const tally = (values) => values.reduce((acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }), {});
const vkey = (violation) => `${violation.id}@${violation.path}`; const rosterNames = (record) => (record.npcs || []).map((npc) => npc.name);
const HELD_KEYS = Object.entries(RECORD_CLASSES).filter(([, cls]) => cls === 'HELD').map(([key]) => key);
/** The join `recordRegister.js` declares for a collection, plus the ONE atomic edit join. */
const joinFor = (path) => (typeof KEYED_COLLECTIONS[path] === 'string' ? KEYED_COLLECTIONS[path] : (path === 'powerStructure.factions' ? 'faction' : null));
/** The register's own DECLARED exception sub-paths that live under a HELD key. */
const HELD_EXCEPTIONS = Object.keys(CLASS_EXCEPTIONS).filter((path) => HELD_KEYS.includes(path.split(/[.[]/)[0]));

/**
 * A card's HELD keys with those declared exceptions REMOVED, so a MIRROR (`factions[].members[]`)
 * or a RECEIPT (`powerStructure.economyInputFingerprint`) recomputed after the merge is never read
 * as a real first-hand fact that moved.
 */
function realHeld(card) {
  const out = {};
  for (const key of HELD_KEYS) {
    if (card[key] === undefined) continue;
    const value = clone(card[key]);
    if (key === 'factions' && Array.isArray(value)) value.forEach((entry) => { if (entry) delete entry.members; });
    else if (key === 'powerStructure' && value !== null && typeof value === 'object') delete value.economyInputFingerprint;
    out[key] = value;
  }
  return out;
}
const movedKeys = (before, after) => HELD_KEYS.filter((key) => h(before[key]) !== h(after[key]));

/** The stride, by `tests/domain/recordMerge.test.js :: sample63`'s own rule, re-derived here. */
function sample63() {
  const all = goldenCorpus(); const seen = new Set(); const oneEach = [];
  for (const row of all.slice(0, 504)) { const pair = `${row.settType}|${row.terrainOverride}`; if (!seen.has(pair)) { seen.add(pair); oneEach.push(row); } }
  return [...oneEach, ...all.slice(504)];
}
const ROWS = sample63();
/** @type {?Array<{ key: string, cfg: object, base: object }>} */
let towns = null;
const buildTown = (row) => { const { _seed: grain, ...cfg } = row; return { key: keyOf(row), cfg, base: generateSettlementPipeline(cfg, null, { seed: grain, customContent: {} }) }; };
const stride = () => { if (towns === null) towns = ROWS.map(buildTown); return towns; };

/** The eight edits design section 22's X6 names, each with the channel that drives it. */
const EDITS = [
  ['E1', 'layer', (base) => { const npc = base.npcs?.[1]; if (!npc) return null;
    const rec = clone(base); rec.npcs[1].name = 'Aldhelm Prufstein';
    return { rec, roots: [[`npc:${npc.id}:name`, 'Aldhelm Prufstein']] }; }],
  ['E2', 'layer', (base) => { const npc = base.npcs?.[1]; if (!npc) return null;
    const rec = clone(base); rec.npcs[1].role = 'Harbourmaster';
    return { rec, roots: [[`npc:${npc.id}:role`, 'Harbourmaster']] }; }],
  ['E3', 'membership', (base) => { if ((base.institutions || []).length < 2) return null;
    const rec = clone(base); rec.institutions.splice(1, 1); return { rec, roots: [] }; }],
  ['E4', 'membership', (base) => { const source = base.institutions?.[0]; if (!source) return null;
    const rec = clone(base);
    rec.institutions.push({ ...clone(source), name: `${source.name} Annex`, source: 'dm', catalogId: 'dm_annex' });
    return { rec, roots: [] }; }],
  ['E5', 'layer', (base) => { const factions = base.powerStructure?.factions || []; if (factions.length < 2) return null;
    const rec = clone(base); const target = rec.powerStructure.factions[1];
    target.power = Math.max(1, Math.round((target.power || 20) * 0.5));
    renormalizeFactionPower(rec.powerStructure.factions);
    return { rec, roots: [[`faction:${factions[1].faction}:power`, rec.powerStructure.factions[1].power]] }; }],
  ['E6', 'layer', (base) => { const factions = base.powerStructure?.factions || []; if (factions.length < 2) return null;
    const seat = factions.findIndex((each) => each.isGoverning);
    const next = factions.findIndex((each, index) => index !== seat); if (next < 0) return null;
    const rec = clone(base); rec.powerStructure.factions.forEach((each, index) => { each.isGoverning = index === next; });
    rec.powerStructure.governingName = factions[next].faction;
    return { rec, roots: [[`powerSeat:${factions[next].faction}:holder`, factions[next].faction]] }; }],
  ['E7', 'config', (base, cfg) => (cfg.terrainOverride === 'desert' ? null
    : { rec: clone(base), roots: [['worldFact:settlement:terrain', 'desert']] })],
  ['E8', 'config', (base, cfg) => (cfg.culture === 'norse' ? null
    : { rec: clone(base), roots: [['worldFact:settlement:culture', 'norse']] })],
];

/** ONE pass over the stride and the eight edits. Every arm below reads this one census. */
function measure() {
  const out = { identity: 0, mergeIdentity: 0, rows: [] };
  for (const town of stride()) {
    const { cfg, base } = town;
    const R0 = rederive(base, cfg, EMPTY_DM_LAYER, ENGINE, CONSULT).record;
    if (h(R0) === h(base)) out.identity += 1;
    const alone = mergeConsequence(base, clone(R0), clone(R0), { edit: null });
    if (h(alone.record) === h(base) && alone.delta.escalations.length === 0 && alone.delta.readings.length === 0) out.mergeIdentity += 1;
    for (const [label, channel, build] of EDITS) {
      const plan = build(base, cfg);
      if (plan === null) continue;
      const R1 = rederive(plan.rec, cfg, layerOf(plan.roots), ENGINE, CONSULT).record;
      const { receipts } = mergeTree(plan.rec, clone(R0), clone(R1));
      const merged = mergeConsequence(plan.rec, clone(R0), clone(R1), { edit: { id: label, opType: label } });
      const taken = new Set([...receipts.taken, ...receipts.takenWhole].map(parentOf)); const settled = new Set([...receipts.settled, ...receipts.settledWhole].map(parentOf));
      const mixed = [...taken].filter((path) => settled.has(path)).map(collapse);
      const exempt = new Set([...recordInvariants(base).map(vkey), ...recordInvariants(plan.rec).map(vkey), ...recordInvariants(R1).map(vkey)]);
      const real = movedKeys(realHeld(plan.rec), realHeld(merged.record));
      out.rows.push({ key: town.key, label, channel, identical: h(R1) === h(R0),
        settledLive: receipts.settled.length + receipts.settledWhole.length,
        takenLive: receipts.taken.length + receipts.takenWhole.length, groupsJudged: receipts.groups.length,
        mixedOutside: mixed.filter((path) => enclosingGroup(path.replace(/\[\]/g, '')) === null),
        escalations: merged.delta.escalations, orderMoved: merged.delta.orderMoved, honesty: merged.delta.honesty,
        realMoved: real, declaredOnly: movedKeys(plan.rec, merged.record).filter((key) => !real.includes(key)),
        gone: rosterNames(plan.rec).filter((name) => !rosterNames(merged.record).includes(name)),
        arrived: rosterNames(merged.record).filter((name) => !rosterNames(plan.rec).includes(name)),
        live: recordInvariants(merged.record).filter((each) => !exempt.has(vkey(each))).map((each) => each.id) });
    }
  }
  return out;
}
/** @type {?ReturnType<typeof measure>} */
let censusMemo = null;
const census = () => { if (censusMemo === null) censusMemo = measure(); return censusMemo; };
const byChannel = (...names) => census().rows.filter((row) => names.includes(row.channel));

/** The probe value for each declared field: one no generated record already carries. */
const PROBE_VALUES = Object.freeze({
  'institution.name': '__R7_INSTITUTION__', 'institution.category': 'guild', 'institution.state': 'struggling',
  'npc.name': '__R7_PERSON__', 'npc.role': 'Harbourmaster', 'npc.status': 'missing',
  'faction.faction': '__R7_FACTION__', 'faction.category': 'criminal', 'faction.power': 7,
  'powerSeat.holder': '__R7_SEAT__', 'worldFact.terrain': 'desert', 'worldFact.culture': 'norse',
  'worldFact.monsterThreat': 'plagued', 'worldFact.stressors': ['famine'], 'worldFact.resources': ['magical_node'],
});
/** Design section 22.4's identity: the field an entity is anchored by, which a rename MOVES. */
const ANCHOR_FIELD = Object.freeze({ institution: 'name', npc: 'id', faction: 'faction' });
const anchorOf = (base, card) => {
  if (card === 'npc') return base.npcs?.[1]?.id ?? null;
  if (card === 'institution') return base.institutions?.[1]?.name ?? null;
  if (card === 'faction') return base.powerStructure?.factions?.[1]?.faction ?? null;
  return 'settlement';
};
/** Read the value AT a declaration's own `outputKey`, hopping arrays by the declared join. */
function readDeclared(record, outputKey, anchor) {
  let node = record; let path = '';
  for (const segment of outputKey.split('.')) {
    const hop = segment.endsWith('[]'); const name = hop ? segment.slice(0, -2) : segment;
    if (node === null || typeof node !== 'object' || !Object.hasOwn(node, name)) return { found: false };
    node = node[name]; path = path === '' ? name : `${path}.${name}`;
    if (!hop) continue;
    const field = joinFor(path);
    if (field === null || !Array.isArray(node)) return { found: false };
    const hits = node.filter((entry) => entry && String(entry[field] ?? '') === String(anchor));
    if (hits.length !== 1) return { found: false };
    node = hits[0];
  }
  return { found: true, value: node };
}

/** A chain: each edit merged ALONE against the town as it then stands, the layer ACCUMULATING. */
function runChain(town, labels) {
  let record = clone(town.base); let roots = []; let rideAlong = 0;
  let R0 = rederive(town.base, town.cfg, EMPTY_DM_LAYER, ENGINE, CONSULT).record;
  for (const label of labels) {
    const plan = EDITS.find(([id]) => id === label)[2](record, town.cfg);
    if (plan === null) return null;
    roots = [...roots, ...plan.roots];
    const R1 = rederive(plan.rec, town.cfg, layerOf(roots), ENGINE, CONSULT).record;
    const out = mergeConsequence(plan.rec, clone(R0), clone(R1), { edit: { id: label, opType: label } });
    record = out.record; R0 = out.delta.nextBase; rideAlong += out.delta.honesty.rideAlong;
  }
  return { record, rideAlong };
}
const SEQUENCES = Object.freeze([['E1', 'E5'], ['E5', 'E6'], ['E3', 'E5'], ['E2', 'E6']]);
const UNDO_EDITS = Object.freeze(['E2', 'E5']);
const PAIR_EDITS = Object.freeze(['E1', 'E2', 'E3', 'E4', 'E5', 'E6']);

/** THE ORDERED-PAIR CENSUS, computed ONCE: A5 reads its counts and A7 its ride-along. */
function chainCensus() {
  const out = { drifted: [], undoDrifted: [], pairs: [], determinism: 0, undoTrials: 0, pairTrials: 0, rideAlongChains: 0, rideAlongLeaves: 0 };
  for (const town of stride()) {
    for (const sequence of SEQUENCES) {
      const once = runChain(town, sequence); const twice = runChain(town, sequence);
      if (once === null || twice === null) continue;
      out.determinism += 1;
      if (h(once.record) !== h(twice.record)) out.drifted.push(`${town.key}:${sequence.join('|')}`);
    }
    for (const label of UNDO_EDITS) {
      const first = runChain(town, [label]); const again = runChain(town, [label]);
      if (first === null || again === null) continue;
      out.undoTrials += 1;
      if (h(first.record) !== h(again.record)) out.undoDrifted.push(`${town.key}:${label}`);
    }
    for (const first of PAIR_EDITS) for (const second of PAIR_EDITS) {
      if (first === second) continue;
      const forward = runChain(town, [first, second]); const backward = runChain(town, [second, first]);
      if (forward === null || backward === null) continue;
      out.pairTrials += 1;
      if (forward.rideAlong > 0) { out.rideAlongChains += 1; out.rideAlongLeaves += forward.rideAlong; }
      if (h(forward.record) !== h(backward.record)) out.pairs.push(`${first}|${second}`);
    }
  }
  return out;
}
/** @type {?ReturnType<typeof chainCensus>} */
let chainMemo = null;
const chains = () => { if (chainMemo === null) chainMemo = chainCensus(); return chainMemo; };

/** Every module under `src/`, POSIX and relative to that root — the estate's own scan idiom. */
const srcModules = () => readdirSync(resolve(ROOT, 'src'), { recursive: true }).map((each) => String(each).split('\\').join('/')).filter((each) => /\.jsx?$/.test(each));
const declaring = (ledger) => ledger.filter((row) => Object.hasOwn(row, 'readable'));
/** A ladder cut may answer a band object or a bare label; the producer emits the label. */
const bandLabel = (band) => band.label ?? band;

describe('the edit corpus ratchet: the re-entry seam and the merge over the 63-row corpus', () => {
  it('A1 the dormant re-derivation and the merge identity reproduce the record over the whole stride', () => {
    expect(ROWS.length, 'the stride is DERIVED from goldenCorpus(), never fixtured').toBe(63);
    expect(tally(ROWS.map((row) => row.settType))).toEqual({ thorp: 7, hamlet: 7, village: 7, town: 28, city: 7, metropolis: 7 });
    expect(census().identity, 'rederive with a dormant layer IS the record').toBe(63);
    expect(census().mergeIdentity, 'merge(record, R0, R0) is the record, 0 escalations, 0 readings').toBe(63);
    // anchored: E3 and E4 have no declared membership channel, so their re-derivation is R0 itself;
    // the day EM-C4b gives them one this count falls and the arm reds rather than passing quietly.
    expect(byChannel('membership').filter((row) => row.identical).length).toBe(126);
    expect(byChannel('layer', 'config').filter((row) => row.identical).length).toBe(0);
  }, ARM_TIMEOUT);

  it('A2 an edit that reports applied carries the DM value at the leaf its own declaration names', () => {
    const applied = {}; const carried = {}; const refusals = {}; const undeclared = [];
    for (const [card, fields] of Object.entries(FIELD_DECLARATIONS)) {
      for (const row of fields) {
        const id = `${card}.${row.field}`;
        if (row.outputKey === undefined) { undeclared.push(id); continue; }
        const probe = PROBE_VALUES[id];
        applied[id] = 0; carried[id] = 0;
        for (const town of stride()) {
          const anchor = anchorOf(town.base, card);
          const layer = layerOf([[`${card}:${anchor}:${row.field}`, probe]]);
          const envelope = pinsFrom(town.base, layer, CONSULT, ENGINE);
          if (envelope.unapplied.length === 0) applied[id] += 1;
          for (const un of envelope.unapplied) refusals[`${id}/${un.reason}`] = (refusals[`${id}/${un.reason}`] || 0) + 1;
          const out = rederive(town.base, town.cfg, layer, ENGINE, CONSULT).record;
          // a free-cascade rename MOVES the join field, so the anchor after the edit is the new value
          const leaf = readDeclared(out, row.outputKey, ANCHOR_FIELD[card] === row.field ? probe : anchor);
          if (leaf.found && h(leaf.value) === h(probe)) carried[id] += 1;
        }
      }
    }
    // anchored: the two annotation rows declare NO outputKey, and that absence IS their claim.
    // RE-MEASURED AT THE TRAIN TIP (2026-09-23, the chair): EM-F3's phantom card declares NO outputKey
    // by design (a phantom is a SAVE, not a record field — judgment 275), so its two rows join the
    // two annotation rows as the declared-absent set.
    expect(undeclared).toEqual(['institution.note', 'npc.note', 'phantom.name', 'phantom.size']);
    expect(Object.values(applied).every((each) => each === 63), 'every driven row REPORTS applied 63/63').toBe(true);
    expect(refusals, 'no declaration the corpus can drive is refused at this tip').toEqual({});
    // anchored: an empty envelope is NEVER accepted as proof of application — this table is the
    // proof. The one row below 63 is EM-B2b's own seam and is recorded rather than smoothed:
    // resolveResources overwrites its own input key, so the DM's word stands at
    // config.nearbyResources only in the single town whose RESOLVED roster happens to equal it.
    expect(carried).toEqual({
      'institution.name': 63, 'institution.category': 63, 'institution.state': 63,
      'npc.name': 63, 'npc.role': 63, 'npc.status': 63,
      'faction.faction': 63, 'faction.category': 63, 'faction.power': 63, 'powerSeat.holder': 63,
      'worldFact.terrain': 63, 'worldFact.culture': 63, 'worldFact.monsterThreat': 63,
      'worldFact.stressors': 63, 'worldFact.resources': 63, // 1 → 63: EM-B2b2 landed (resolveResources honours the DM's roster)
    });
  }, ARM_TIMEOUT);

  it('A3 no merged object mixes a taken leaf with a settled leaf outside a declared consistency group', () => {
    expect(census().rows.filter((row) => row.mixedOutside.length > 0)).toEqual([]);
    // anchored: the zero is a MEASUREMENT and not a pass — the settled receipt has no population on
    // the single-edit corpus, so the ratchet cannot fire here and the arm says so in its own breath.
    expect(census().rows.filter((row) => row.settledLive > 0).length).toBe(0);
    expect(census().rows.filter((row) => row.takenLive > 0).length, 'the instrument is not idle').toBe(213);
    expect(census().rows.filter((row) => row.groupsJudged > 0).length, 'declared groups ARE judged').toBe(98);
    // THE POSITIVE CONTROL, CONSTRUCTED: one object holding a leaf taken from R1 beside a leaf kept
    // where the record had settled away from R0 IS a MIXED object, and enclosingGroup classes it.
    const control = mergeTree({ population: { total: 10, note: 'kept' } }, { population: { total: 5, note: 'kept' } }, { population: { total: 5, note: 'moved' } }).receipts;
    expect(control.settled).toEqual(['population.total']);
    expect(control.taken).toEqual(['population.note']);
    expect(parentOf(control.settled[0])).toBe(parentOf(control.taken[0]));
    expect(enclosingGroup('population')).toBe(null);
    expect(enclosingGroup('economicState.foodSecurity.deficit').id).toBe('food-security');
    expect(CONSISTENCY_GROUPS.length).toBe(7);
  }, ARM_TIMEOUT);

  it('A4 the town keeps its invariants, the layer channel escalates nothing, and the config channel is named', () => {
    const layerRows = byChannel('layer', 'membership'); const configRows = byChannel('config');
    expect(layerRows.length).toBe(378);
    expect(configRows.length).toBe(120);
    // anchored: THE NAMED-PERSON LAW. No REAL unedited HELD fact moves and no named person leaves
    // or joins the merged roster; a non-zero here means the ladder overwrites a held key again.
    expect(census().rows.filter((row) => row.realMoved.length > 0)).toEqual([]);
    expect(census().rows.flatMap((row) => row.gone)).toEqual([]);
    expect(census().rows.flatMap((row) => row.arrived)).toEqual([]);
    // the ONLY held motion left is the register's own declared RECEIPT, on the config channel
    expect(HELD_EXCEPTIONS).toEqual(['powerStructure.economyInputFingerprint', 'factions[].members[]']);
    expect(tally(census().rows.filter((row) => row.declaredOnly.length > 0).map((row) => row.label))).toEqual({ E7: 42, E8: 2 });
    // anchored: the layer channel is clean on all three counts, and a widening reds here.
    expect(layerRows.filter((row) => row.escalations.length > 0)).toEqual([]);
    expect(layerRows.filter((row) => row.live.length > 0)).toEqual([]);
    expect(tally(configRows.filter((row) => row.escalations.length > 0).map((row) => row.label))).toEqual({ E7: 31, E8: 17 });
    expect(tally(configRows.flatMap((row) => Array(row.escalations.length).fill(row.label)))).toEqual({ E7: 136, E8: 76 });
    expect(tally(configRows.filter((row) => row.escalations.some((each) => each.step === 'EXHAUSTED')).map((row) => row.label))).toEqual({ E7: 31, E8: 17 });
    expect(census().rows.filter((row) => row.live.length > 0).length, 'EM-B2b seam, asserted AT the figure').toBe(48);
    expect(tally(census().rows.flatMap((row) => row.live))).toEqual({ 'V-DEFENSE-INST': 31, 'V-EVIDENCE-CONFLICT': 22 });
  }, ARM_TIMEOUT);

  it('A5 a chain is deterministic, undo then re-edit reproduces the town, and the ordered pairs are counted', () => {
    // anchored: a chain that is not deterministic is a defect, never history.
    expect(chains().drifted).toEqual([]);
    expect(chains().undoDrifted).toEqual([]);
    expect([chains().determinism, chains().undoTrials, chains().pairTrials]).toEqual([252, 126, 1890]);
    // section 22.2 item 6's history, counted and NAMED rather than smoothed away
    expect(tally(chains().pairs)).toEqual({ 'E1|E6': 1, 'E2|E6': 1, 'E6|E1': 1, 'E6|E2': 1 });
    expect(() => mergeConsequence({}, {}, {}, { edit: [] })).toThrow(TypeError);
  }, ARM_TIMEOUT);

  it('A6 the order rule second arm is zero on the layer channel and counted on the config channel', () => {
    // anchored: the layer channel moves no key order at all, and a regression there is a real defect.
    expect(byChannel('layer', 'membership').filter((row) => row.orderMoved.length > 0)).toEqual([]);
    expect(byChannel('config').filter((row) => row.orderMoved.length > 0).length, 'a counted diagnostic with a LIVE population, so the branch is not asserted on nothing').toBe(51);
  }, ARM_TIMEOUT);

  it('A7 the honesty figures are re-measured and the ride-along has its first population in the chain', () => {
    const taken = census().rows.reduce((acc, row) => ({ ...acc, [row.label]: (acc[row.label] || 0) + row.honesty.taken }), {});
    // anchored: rideAlong is a subset of settled and taken; on a FIRST edit R0 IS the record, so
    // nothing has settled and the figure is structurally zero rather than an absent instrument.
    expect(census().rows.reduce((sum, row) => sum + row.honesty.rideAlong, 0)).toBe(0);
    expect([taken.E1, taken.E5, taken.E6], 'the edits that DO reach a reading').toEqual([677, 389, 746]);
    // an npc ROLE reaches ZERO readings over the whole corpus, recorded so the zero is not silence
    expect([taken.E2, taken.E3, taken.E4], 'a role and a dormant membership edit reach none').toEqual([0, 0, 0]);
    // AND THE MACHINERY'S FIRST POPULATION, in the chain: the restatement at the first merge lets
    // the record settle away from R0 at a leaf, so the second merge's receipts carry a ride-along.
    expect([chains().rideAlongChains, chains().rideAlongLeaves], 'the honesty machinery firing').toEqual([11, 11]);
  }, ARM_TIMEOUT);

  it('A8 the family declared instruments hold at this seam', () => {
    const dirty = []; const bands = []; const witnessed = { legitimacy: new Set(), readiness: new Set() };
    for (const town of stride()) {
      const violations = recordInvariants(town.base);
      if (violations.length > 0) dirty.push({ key: town.key, ids: violations.map((each) => each.id) });
      const legitimacy = town.base.powerStructure?.publicLegitimacy;
      const readiness = town.base.defenseProfile?.readiness;
      if (typeof legitimacy?.score !== 'number' || typeof readiness?.score !== 'number') { bands.push(`${town.key}:absent`); continue; }
      witnessed.legitimacy.add(legitimacy.score); witnessed.readiness.add(readiness.score);
      if (bandLabel(legitimacyBandOf(legitimacy.score)) !== legitimacy.label) bands.push(`${town.key}:legitimacy`);
      if (bandLabel(readinessBandOf(readiness.score)) !== readiness.label) bands.push(`${town.key}:readiness`);
    }
    // (a) judgment 212d re-proved AT THE FIGURE THE TREE GIVES. The producer's own
    // emitted-versus-measured band equivalence is exact; the invariant sweep is 62 of 63, and the
    // ONE plainly generated record that carries a violation is NAMED rather than smoothed away.
    // It reproduces unchanged at train EM-T16's landed tip, so it is the generator's own
    // prose-count residue and not this seam's; the census exempts it wherever it is pre-existing.
    expect(dirty).toEqual([{ key: 'town|germanic|mountain|mountain_pass|civilized|golden-master-v3', ids: ['V-SUMMARY-DEPS'] }]);
    // anchored: the emitted label and the ladder's own measurement agree on every one of the 126
    // scores, so a ladder cut that drifted from the producer that emits its label reds here.
    expect(bands).toEqual([]);
    expect([witnessed.legitimacy.size, witnessed.readiness.size], 'the scores are WITNESSED, not assumed').toEqual([25, 34]);
    // (b) the witnessed score set of the ladders, RECORDED (charter addenda 71 and 73)
    expect([Math.min(...witnessed.legitimacy), Math.max(...witnessed.legitimacy)]).toEqual([1, 75]);
    expect([Math.min(...witnessed.readiness), Math.max(...witnessed.readiness)]).toEqual([11, 81]);
    // (c) the duplicated-leaf sweep, RECORDED (charter addendum 38), over the table's own producer
    const leafReaders = {};
    for (const [id, meta] of Object.entries(CHECK_META)) for (const path of meta.paths || []) leafReaders[path] = [...(leafReaders[path] || []), id];
    expect([Object.keys(CHECK_META).length, CROSS_KEY_CHECKS.length]).toEqual([33, 7]);
    expect(Object.entries(CHECK_META).filter(([, meta]) => (meta.paths || []).length === 2).length).toBe(19);
    expect(Object.keys(leafReaders).length).toBe(66);
    expect([Object.values(leafReaders).filter((ids) => ids.length > 1).length, Object.values(leafReaders).filter((ids) => ids.length === 2).length]).toEqual([13, 10]);
    // (d) THE TWO-SIDED `readable` LAW. EXIT 1, the DECLARED ledger: every row declares the field,
    // exactly one is true, and its ONE consumer RESOLVES that path rather than spelling it — the
    // import above is the proof, because institutionRemoval.js throws at import on any other count.
    expect([INSTITUTION_NON_CASCADED.length, declaring(INSTITUTION_NON_CASCADED).length]).toEqual([15, 15]);
    expect(INSTITUTION_NON_CASCADED.filter((row) => row.kind === 'matched-pattern' && row.readable).map((row) => row.path)).toEqual(['economicState.activeChains[].processingInstitutions[]']);
    expect(typeof institutionRemovalChanges).toBe('function');
    // EXIT 2, the UNDECLARED ledger: EM-R6's LANDED ruling is that none of its rows has a reader,
    // and the prose rule is ENFORCED by the scan rather than trusted, at zero src/ bytes.
    expect([FACTION_NON_CASCADED.length, NPC_NON_CASCADED_SURFACES.length]).toEqual([16, 13]);
    expect(declaring(FACTION_NON_CASCADED).length + declaring(NPC_NON_CASCADED_SURFACES).length).toBe(0);
    const importers = srcModules()
      .map((rel) => ({ rel, clause: /import\s*\{([^}]*)\}\s*from\s*'[^']*factionRename\.js'/s.exec(readFileSync(resolve(ROOT, 'src', rel), 'utf8')) }))
      .filter((each) => each.clause !== null);
    expect(importers.length, 'the scan is not vacuous: factionRename.js HAS src/ importers').toBe(3);
    // THE POSITIVE CONTROL. `importers.length` proves the importer SCAN is live; nothing proved the
    // CLAUSE READER would fire on a real violation — a renamed ledger export, a dropped `NPC_`
    // alternation or a lost `\b` leaves a reader that matches NOTHING, and the empty filter below
    // then passes forever. Every sibling scrape in this family (freeFieldGlyphNotice N4/N8/N10,
    // registryRealityBadge R4, editShellPlusDoor D5) drives its extractor over a control before it
    // trusts the extractor's silence. The two spellings a violation would wear are READ OUT OF
    // factionRename.js's own exports rather than re-typed here, so a rename there reds this arm
    // instead of blinding it, and the control runs the SAME reader the filter below runs.
    const readsClause = (clause) => /\b(NPC_)?NON_CASCADED_SURFACES\b/.test(clause);
    const ledgerExports = [...readFileSync(resolve(ROOT, 'src/domain/factionRename.js'), 'utf8').matchAll(/export const ([A-Z_]*NON_CASCADED_SURFACES)\b/g)].map((each) => each[1]);
    expect(ledgerExports, 'the ledger still spells both surfaces the reader looks for').toEqual(['NON_CASCADED_SURFACES', 'NPC_NON_CASCADED_SURFACES']);
    expect(ledgerExports.map((name) => readsClause(`${importers[0].clause[1]} ${name} `)), 'THE CONTROL: the clause reader FIRES on a real importer clause that gained each surface').toEqual([true, true]);
    // anchored: a faction roster row that GAINS a reader without declaring `readable` reds here.
    expect(importers.filter((each) => readsClause(each.clause[1])).map((each) => each.rel)).toEqual([]);
  }, ARM_TIMEOUT);
});
