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
 *  20.5 s and the ordered-pair census 305.6 s, the file 350.7 s end to end. RE-MEASURED 2026-10-01 after the
 *  pair census was cached by prefix: the census arm 20.5 s, the value arm 19.2 s, the ordered-pair census
 *  156.9 s (was 324.5 s at the same tip, and a 600 s TIMEOUT under full-suite load), the file 198.3 s. */
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

/** A chain's starting state: the town as generated, and its dormant re-derivation as R0. */
function startChain(town) {
  return { record: clone(town.base), R0: rederive(town.base, town.cfg, EMPTY_DM_LAYER, ENGINE, CONSULT).record, roots: [], rideAlong: 0 };
}
/** One edit merged ALONE against the town as it then stands, the layer ACCUMULATING. Pure over its
 *  state: the plan clones the record it is handed and the merge is handed clones, so a state can be
 *  stepped from more than once (the pair census below relies on exactly that). */
function stepChain(town, state, label) {
  const plan = EDITS.find(([id]) => id === label)[2](state.record, town.cfg);
  if (plan === null) return null;
  const roots = [...state.roots, ...plan.roots];
  const R1 = rederive(plan.rec, town.cfg, layerOf(roots), ENGINE, CONSULT).record;
  const out = mergeConsequence(plan.rec, clone(state.R0), clone(R1), { edit: { id: label, opType: label } });
  return { record: out.record, R0: out.delta.nextBase, roots, rideAlong: state.rideAlong + out.delta.honesty.rideAlong };
}
/** A chain: each edit merged ALONE against the town as it then stands, the layer ACCUMULATING. */
function runChain(town, labels) {
  let state = startChain(town);
  for (const label of labels) {
    state = stepChain(town, state, label);
    if (state === null) return null;
  }
  return { record: state.record, rideAlong: state.rideAlong };
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
    // ⭐ CACHED BY PREFIX (2026-10-01): the starting R0 and each single-edit state are computed ONCE
    // per town and stepped from for all thirty ordered pairs, where every pair used to re-derive both.
    // Measured alone this arm was 325 s and it timed out at 600 s under full-suite load; `stepChain` is
    // pure over its state, so the census figures are unchanged (A5 and A7 hold them). The determinism
    // and undo arms above still run their chains twice, independently, which is their whole point.
    const start = startChain(town);
    const firsts = new Map(PAIR_EDITS.map((label) => [label, stepChain(town, start, label)]));
    for (const first of PAIR_EDITS) for (const second of PAIR_EDITS) {
      if (first === second) continue;
      const fromFirst = firsts.get(first); const fromSecond = firsts.get(second);
      const forward = fromFirst === null ? null : stepChain(town, fromFirst, second);
      const backward = fromSecond === null ? null : stepChain(town, fromSecond, first);
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
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair, measured against the pre-band base 5d699cc68, where this file is 8/8): 213 → 220.
    // 2026-10-02 (the Voice Program waves 2-4, ODQ §934.88; measured leaf by leaf against the program's base 8a6f6b9d3):
    // 220 → 266. Every one of the 46 newly live rows is E6: the pressure sentence now draws on its own stream, and for
    // the corpus's infiltrated towns that draw is a template naming the governing body ("decisions at the Household
    // Council level…"), so seating another faction reaches the reading (51 pressureSentence leaves). E7 and E8 add
    // arrivalScene and pressureSentence leaves the re-composed prose speaks. No world leaf is among them.
    // 2026-10-31 (the GS-2 merge, lane G2's one faction set, ODQ §934.101; re-measured by cure lane T13 against 2cf542ce,
    // where this arm reads 266): 266 → 268. The two new rows are E5 and E6 on two hamlets: before GS-2 those edits reached
    // no reading, now each takes ONE, the receipt's judgment evidence, because `R1` derives a different conflict list
    // from the re-dealt power affiliations (the post-pass then restates its citations to the record's own, chair ruling
    // X-29, A4). No other row joined or left.
    // 2026-11-04, the window-end pin re-key (REGISTERS seat; traced by stage in DOORS-4, every figure re-measured at the
    // composed tip): not idle 268 → 266 at SIZE-3 (the guild market, stage S5); groups judged 98 → 101 (FOOD-1, the food
    // record) → 99 (FOOD-2, the food base numbers) → 130 (FOOD-3, food diversity: the food-security group is judged on
    // more rows as the record grows sources). The law of the arm is unchanged: mixedOutside is still empty.
    // 2026-11-05, the rung-1 landing (ODQ §934.105; LANDING-5 under the chair's ruling 4, READ and BISECTED over the
    // landing's first-parent stages, this file's census at each; at 1264a8152^ every figure is the frozen one): not idle
    // 266 -> 268 X-46 car 1 1264a8152 -> 265 car 2 d4bf6431c -> 284 CRISIS d3e072368 -> 286 SELF-VOUCH 0be13b5cb -> 276
    // car 3 90dc22f18 -> 275 car 1b-2 fb0341b93 -> 276 PLACE-NOT-TIER 6129c300d -> 275 car 3 I7 6ca454d2b -> 277 F6
    // 6d84aa834; groups judged 130 -> 132 -> 130 (cars 1, 2) -> 132 PINS 37b1e746d -> 133 F6. mixedOutside and
    // settledLive stay empty at every stage.
    // 2026-11-07 (LANDING-R2 seat C2, the pool census composed; this census at each stage of a change-point search over
    // census-1b's first parent, git-archive trees): not idle 277 -> 280 at census-1i unit 1 R-AW (ba7887862, the label
    // resolved at the birth's close: three more rows take a leaf live); groups judged 133 unmoved. Rung 1's final tip and
    // the merge base both read 277 / 133, the composed tip 280 / 133: no interaction. mixedOutside stays empty.
    // 2026-11-07 (the people landing; re-keyed BY IDENTITY, this census probed at each lane's tree): not idle 277 -> 276
    // PEOPLE-1 CAST dc655f712 -> 271 CAST-DERIVED 3aa160a70 -> 305 TIES c7d552370 -> 306 5B EDIT a725df7e4, unmoved to the
    // tip; groups judged 133 at every stage. mixedOutside and settledLive stay empty at every stage.
    // 2026-11-08, MERGE-CAR (the integration landing: records A and B, the rung-2 landing's merge and the people car's merge
    // over the integration branch; re-keyed BY IDENTITY, this census probed on git-archive trees): not idle 306 -> 312. By
    // stage: the merge base 262e8b255 reads 277; the car's tip 373a2947b 306 (+29, its pin above); the integration tip
    // 7b3ffb6ee 283 (+6; LANDING-R2's 280 was taken on the rung-2 lane before it composed); the merged tip 2c7437030 312 =
    // 277 + 29 + 6, additive, no interaction. Groups judged 133 at every stage; mixedOutside and settledLive stay empty.
    // 2026-11-10, GREEN-TIP (re-keyed BY IDENTITY; this census probed at every first-parent stage of 2c7437030..bf14617ca that
    // touches src/ or the corpus helper, 76 stages, on git-archive trees; MERGE-WAVE never ran this file, and the train and
    // STYLE-2 records called these figures "the base's, unchanged" while the values moved): not idle 312 -> 313
    // FIX-FOOD-ISOLATION's merge c6e8a4ad6 (E5 on the isolated forest town) -> 315 FIX-PUBLIC-VEIL 7e65c7bec (two rows join)
    // -> 329 ALLEGIANCE-CAR1 e5f88930b (+15 E2 role rows, -1 E5), unmoved to the tip. Each lane's generator move is named
    // and accepted in its own record; this figure was not. mixedOutside and settledLive stay empty.
    // 2026-11-12, STYLE-2-MERGE point 43 (re-keyed BY IDENTITY, STYLE-2-MERGE-8): 329 -> 330 at the COHERENCE-PRESUME merge
    // f922124d0 (docs/shift-records/2026-11-12-style-2-merge-43-coherence-presume.json; the re-titled watch role re-deals the
    // E2 role rows); point 42 and the line before it read 329. The arm's other figures measured green after the re-key.
    // 2026-11-13, STYLE-2-MERGE point 46 (re-keyed BY IDENTITY, STYLE-2-MERGE-9; a figure the COHERENCE-POWERS drafted record names for the merge seat, editCorpusRatchet A3/A5/A7): 330 -> 329 at the COHERENCE-POWERS merge 6aeaa4154 (docs/shift-records/2026-11-13-style-2-merge-46-coherence-powers.json;
    // the dual hat re-deals the cast the E-rows edit); 3575cf061 reads 330. mixedOutside and settledLive measured empty after.
    expect(census().rows.filter((row) => row.takenLive > 0).length, 'the instrument is not idle').toBe(329);
    expect(census().rows.filter((row) => row.groupsJudged > 0).length, 'declared groups ARE judged').toBe(133);
    // THE POSITIVE CONTROL, CONSTRUCTED: one object holding a leaf taken from R1 beside a leaf kept
    // where the record had settled away from R0 IS a MIXED object, and enclosingGroup classes it.
    const control = mergeTree({ population: { total: 10, note: 'kept' } }, { population: { total: 5, note: 'kept' } }, { population: { total: 5, note: 'moved' } }).receipts;
    expect(control.settled).toEqual(['population.total']);
    expect(control.taken).toEqual(['population.note']);
    expect(parentOf(control.settled[0])).toBe(parentOf(control.taken[0]));
    expect(enclosingGroup('population')).toBe(null);
    expect(enclosingGroup('economicState.foodSecurity.deficit').id).toBe('food-security');
    expect(CONSISTENCY_GROUPS.length).toBe(8); // 7 -> 8 PEOPLE-5B EDIT (069c6c7bc): the per-card group `card-standing` (memberships + importance)
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
    // PEOPLE-5B (M-7): the grouping's MIRROR left the register (`factions[].members[]`).
    expect(HELD_EXCEPTIONS).toEqual(['powerStructure.economyInputFingerprint']);
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair, measured against the pre-band base 5d699cc68, where this file is 8/8): declared-only {E7 42, E8 2} → {47, 7};
    // config escalation rows {31, 17} → {30, 10} and steps {136, 76} → {132, 40}, every one still EXHAUSTED; the live residue
    // 48 → 40 rows, V-DEFENSE-INST 31 → 35 and V-EVIDENCE-CONFLICT 22 → 8 (mergeLadderHeldKeys A2 reads the same re-deal).
    // 2026-11-04, the window-end pin re-key (REGISTERS seat, traced by stage in DOORS-4): declared-only {47, 7} → {41, 6}
    // (FOOD-1) → {28, 2} (FOOD-2); the escalation figures below did not move.
    // 2026-11-05 (LANDING-5, by stage as A3): declared-only {28, 2} -> {29, 2} car 1 1264a8152 -> {29, 3} car 3 90dc22f18 ->
    // {30, 7} PINS 37b1e746d -> {34, 12} car 3 I7 6ca454d2b -> {31, 6} F6 6d84aa834.
    // 2026-11-06 (LANDING-7 lane H, the chair's ruling R-H5: re-keyed by identity with its cause, measured by a probe of
    // this census's E7 half at the parent ba4366c83 and after): {31, 6} -> {32, 6}. The one new row is
    // thorp|germanic|coastal|port|civilized|golden-master-v3, declared-only on powerStructure (its economy fingerprint
    // receipt), one of the 17 thorps whose food writer read 0 lb beside 1% and now derives its per cent from its pounds.
    // 2026-11-10, GREEN-TIP (re-keyed BY IDENTITY; this census probed at every first-parent stage of 2c7437030..bf14617ca that
    // touches src/ or the corpus helper, 76 stages, on git-archive trees; MERGE-WAVE never ran this file, and the train and
    // STYLE-2 records called these figures "the base's, unchanged" while the values moved): {32, 6} -> {31, 6}
    // at FIX-FOOD-ISOLATION's merge c6e8a4ad6 (501c97412 reads 32): town|germanic|forest|isolated leaves declared-only, one
    // of the twelve forest-isolated towns that lane's record says moved. Unmoved to the tip.
    expect(tally(census().rows.filter((row) => row.declaredOnly.length > 0).map((row) => row.label))).toEqual({ E7: 31, E8: 9 }); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d; a figure its drafted record names for the merge seat): E8 6 -> 9 (the draft: A4's E8 5 -> 9 on the lane's base)
    // anchored: the layer channel is clean on all three counts, and a widening reds here.
    expect(layerRows.filter((row) => row.escalations.length > 0)).toEqual([]);
    expect(layerRows.filter((row) => row.live.length > 0)).toEqual([]);
    // 2026-10-31, the GS-2 merge (lane G2, ODQ §934.101) then chair ruling X-29 (cure lane T13), each measured against
    // 2cf542ce, where these read as before. GS-2 alone: config rows {30, 10} → {31, 9}, steps {132, 40} → {140, 36}, and
    // TWO layer rows (E5, E6 on two hamlets) escalating to EXHAUSTED on V-EVIDENCE-CONFLICT, because `R1` re-derives a
    // conflict list the HELD record does not carry and the receipt cited it by position. X-29 restates those citations
    // from the merged record (mergeConsequence.js :: restateConflictCitations), so the layer channel is clean again and
    // config rows {31, 9} → {26, 9}, steps {140, 36} → {104, 36}, every one still EXHAUSTED; the live residue 40 → 35,
    // V-EVIDENCE-CONFLICT 8 → 0, V-DEFENSE-INST unmoved at 35 (mergeLadderHeldKeys A2 reads the same figures).
    // 2026-11-05 (LANDING-5, by stage as A3; mergeLadderHeldKeys A2 reads the same figures): config rows {26, 9} -> {28, 9}
    // car 1 -> {28, 8} car 2 -> {14, 2} car 3 90dc22f18 -> {15, 2} car 1b-2 -> {19, 4} PINS -> {22, 4} car 3 I7 -> {18, 3}
    // F6; steps {104, 36} -> {72, 12} at the same steps; every one still EXHAUSTED; the live residue 35 -> 21, all
    // V-DEFENSE-INST. The layer channel is clean at every stage.
    expect(tally(configRows.filter((row) => row.escalations.length > 0).map((row) => row.label))).toEqual({ E7: 21, E8: 3 }); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d): the same escalation counts as mergeLadderHeldKeys A2: E7 18 -> 21
    expect(tally(configRows.flatMap((row) => Array(row.escalations.length).fill(row.label)))).toEqual({ E7: 84, E8: 12 }); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d): the same escalations, four seats each: E7 72 -> 84
    expect(tally(configRows.filter((row) => row.escalations.some((each) => each.step === 'EXHAUSTED')).map((row) => row.label))).toEqual({ E7: 21, E8: 3 }); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d): the same escalation counts as mergeLadderHeldKeys A2: E7 18 -> 21
    expect(census().rows.filter((row) => row.live.length > 0).length, 'EM-B2b seam, asserted AT the figure').toBe(24); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d): the same escalations (E7 21 + E8 3), equal to the lane's own tip: 21 -> 24
    expect(tally(census().rows.flatMap((row) => row.live))).toEqual({ 'V-DEFENSE-INST': 24 }); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d): the same escalations (E7 21 + E8 3): 21 -> 24
  }, ARM_TIMEOUT);

  it('A5 a chain is deterministic, undo then re-edit reproduces the town, and the ordered pairs are counted', () => {
    // anchored: a chain that is not deterministic is a defect, never history.
    expect(chains().drifted).toEqual([]);
    expect(chains().undoDrifted).toEqual([]);
    expect([chains().determinism, chains().undoTrials, chains().pairTrials]).toEqual([252, 126, 1890]);
    // section 22.2 item 6's history, counted and NAMED rather than smoothed away
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair, measured against the pre-band base 5d699cc68, where this file is 8/8): the four non-commuting pairs move from the SEAT
    // edit (E6) to the SHARE edit (E5), and the disagreement is still TRACE-ONLY. Probed both ways: on
    // town|germanic|plains|road|civilized|gm-seed-c, E1|E5 and E2|E5 differ ONLY in simulationTrace[92..93], the relationship
    // derivation's narrative ("25 edges" | "23 edges", "Direct=1 … scatter=0" | "Direct=0 …"); every world field is identical
    // in both orders. At the base the seat pairs differed in exactly that kind of trace reason on gm-seed-a's town.
    // 2026-11-05 (LANDING-5, the chair's ruling 4; re-keyed BY IDENTITY with its step, bisected over the landing's
    // first-parent stages by the chain census): the four non-commuting pairs (trace-only, E1|E5 E2|E5 E5|E1 E5|E2) hold
    // through 79c442330 and are GONE from X-46 car 3 90dc22f18 (the institution budget): every ordered pair now commutes.
    // Determinism, undo and the 252/126/1890 denominators hold at every probed stage.
    // 2026-11-07 (the people landing; re-keyed BY IDENTITY, probed at each lane's tree): FOUR towns' seat pairs stop
    // commuting at PEOPLE-1 CAST dc655f712 and hold unchanged to the tip (the metropolis on plains, hills and mountain,
    // the plains port town, golden-master-v3). TRACE-ONLY, diffed leaf by leaf: the ONLY differing leaf in either order is
    // the population step's summary trace `simulationTrace[].causes[0].effect` ("78 npcs" | "79 npcs": the cast that
    // step counted; why the order moves it is not traced); every world field, the roster included, is identical in both orders.
    // 2026-11-13, STYLE-2-MERGE point 46 (re-keyed BY IDENTITY, STYLE-2-MERGE-9; a figure the COHERENCE-POWERS drafted record names for the merge seat, editCorpusRatchet A3/A5/A7): each ordered seat pair 4 -> 6 at the COHERENCE-POWERS merge 6aeaa4154 (two more towns' seat pairs stop commuting;
    // 3575cf061 reads 4). NOT traced leaf by leaf here (PLAUSIBLE: the population step's trace, as at PEOPLE-1); CHARGED to the
    // powers follow-up seat to diff the two new towns' orders leaf by leaf. Determinism and undo held in the same run.
    expect(tally(chains().pairs)).toEqual({ 'E1|E6': 6, 'E2|E6': 6, 'E6|E1': 6, 'E6|E2': 6 });
    expect(() => mergeConsequence({}, {}, {}, { edit: [] })).toThrow(TypeError);
  }, ARM_TIMEOUT);

  it('A6 the order rule second arm is zero on the layer channel and counted on the config channel', () => {
    // anchored: the layer channel moves no key order except the ONE consequence named below, and any other
    // order move there is a real defect.
    // 2026-11-05 (LANDING-6, the chair's ruling 1 on LANDING-5's A6 STOP; re-keyed by identity with its step): two
    // rows, history.legacyAnnotations on the coastal-port village under E5 and E6, from X-46 car 3 (90dc22f18, the
    // institution budget). A CONSEQUENCE, not a defect: legacyGenerator.js :: deriveLegacyAnnotations ranks by its
    // own rule, and a political event scores 70 while legitimacy is under 45 ('contested') but 30 ('drift') at 45 or
    // over, below the disaster's 40 and the religious event's 35. The rank inputs the history step reads, measured:
    // at 79c442330 (the stage before car 3) the generation reads legitimacy 39 and the edited re-derivation 42, both
    // contested, so political leads both and nothing re-ranks; at the tip car 3's faction set (Elected Reeve 32/45,
    // Religious Authorities 35/19) reads 44 at generation (contested, political first) and 47 under E5 and E6 (stable,
    // political last), so the layer edit crosses the cut in exactly the direction the new order shows.
    expect(byChannel('layer', 'membership').filter((row) => row.orderMoved.length > 0).map((row) => [row.key, row.label, row.orderMoved]))
      .toEqual([
        ['village|germanic|coastal|port|civilized|golden-master-v3', 'E5', ['history.legacyAnnotations']],
        ['village|germanic|coastal|port|civilized|golden-master-v3', 'E6', ['history.legacyAnnotations']],
      ]);
    // 2026-11-05 (LANDING-6, masked behind the first assertion until ruling 1 re-keyed it; bisected over every first-parent
    // stage of the landing with this count alone): 52 → 50 X-46 car 1 (1264a8152) → 39 X-46 car 3 (90dc22f18) → 41 PINS
    // (37b1e746d) → 44 X-46 car 3, I7 (6ca454d2b) → 46 PINS (11467ed57) → 40 F6 BUDGET-FLOOR (6d84aa834), unmoved since and by
    // record 28's cure (the same 40 rows).
    expect(byChannel('config').filter((row) => row.orderMoved.length > 0).length, 'a counted diagnostic with a LIVE population, so the branch is not asserted on nothing').toBe(44); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d; a figure its drafted record names for the merge seat): 40 -> 44 (the draft: A6 40 -> 44); // 2026-10-01: 51 → 54, the same re-deal; 2026-11-04 (REGISTERS seat, traced in DOORS-4): 54 → 53 FOOD-2 → 52 SIZE-3
  }, ARM_TIMEOUT);

  it('A7 the honesty figures are re-measured and the ride-along has its first population in the chain', () => {
    const taken = census().rows.reduce((acc, row) => ({ ...acc, [row.label]: (acc[row.label] || 0) + row.honesty.taken }), {});
    // anchored: rideAlong is a subset of settled and taken; on a FIRST edit R0 IS the record, so
    // nothing has settled and the figure is structurally zero rather than an absent instrument.
    expect(census().rows.reduce((sum, row) => sum + row.honesty.rideAlong, 0)).toBe(0);
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair, measured against the pre-band base 5d699cc68, where this file is 8/8): [677, 389, 746] → [719, 211, 926], and the
    // ride-along's chain population [11, 11] → [12, 12] below.
    // 2026-10-02 (the Voice Program, as A3 above): [719, 211, 926] → [719, 211, 977], E6's +51 pressureSentence readings.
    // 2026-10-31 (the GS-2 merge, lane G2's one faction set, ODQ §934.101; re-measured by cure lane T13 against 2cf542ce,
    // leaf by leaf): [719, 211, 977] → [719, 200, 927]. The readings that left are simulationTrace leaves of the
    // retired `generatePopulation::faction` linkage trace (E5 11, E6 52), whose scatter read the power card; E6 gains
    // 4 receipt-evidence leaves (the conflict citations `R1` derives, A3).
    // 2026-11-04, the window-end pin re-key (REGISTERS seat, traced by stage in DOORS-4): [719, 200, 927] → [717, 200, 930]
    // (FOOD-1) → [715, 200, 1402] (FOOD-2: E6 reaches the food record's readings through the re-dealt economy) →
    // [717, 197, 1405] (SIZE-3).
    // 2026-11-05 (LANDING-6, the chair's ruling 2: read and re-banked on the tree record 28 cured; bisected over every
    // first-parent stage with a probe of this census, record 28's cure scripted into the stages from TRUTH ff4448d2e to
    // F10 54daafda3 so no stage carries the V-SUMMARY-HOOKS contamination, steps touching no src/ skipped):
    // [717, 197, 1405] → [731, 570, 1616] X-46 car 1 (1264a8152) → [715, 742, 1073] car 2 (d4bf6431c) → [741, 772, 1587]
    // CRISIS (d3e072368) → [721, 772, 1588] terrain-pools (ac09ea83b) → [721, 802, 1606] SELF-VOUCH (0be13b5cb) →
    // [695, 45, 1235] car 3 (90dc22f18) → [697, 41, 1233] car 1b (fb0341b93) → [697, 49, 1242] SELF-VOUCH I5 (cdc949867)
    // → [699, 63, 1217] PLACE-NOT-TIER (6129c300d) → [699, 63, 1199] TRUTH (ff4448d2e) → [705, 73, 1638] PINS (37b1e746d)
    // → [705, 71, 1688] TRUTH (844acaccc) → [703, 65, 1847] car 3 I7 (6ca454d2b) → [717, 66, 1810] F6 (6d84aa834) →
    // [709, 66, 1810] F1 (5e9ffb220), unmoved to the tip. Uncured, E6 read 1814 from F6 on (the 18 towns' summaries).
    // 2026-11-07 (WIRING-W0, re-keyed BY IDENTITY with its cause; bisected by this arm over the lane's stages): [709, 66, 1810]
    // held at 76febf9b0 and at cause 1 (343bd4eec) → [709, 66, 1821] at cause 4a, ONE IMPORT SHARE (c99531cf9, record 02:
    // foodSecurity.importPct is now the share of the published pounds, so E6's re-dealt economy reaches 11 more readings
    // through it), unmoved by 4b (3d1df12d7) and by cause 5.
    // 2026-11-07 (LANDING-R2 seat C2, the same change-point search): [709, 66, 1810] -> [712, 66, 1806]. On census-1b's
    // first parent from the merge base bf263a78d [709, 66, 1814] (record 28's cure is rung 1's): 1816 census-1b unit A (c)
    // (f4f765b72) -> 1810 the census-4 merge (950b75014) -> 1806 census-1h R-AU (d035cf840) -> E1 712 census-1i R-AW
    // (ba7887862). The census tip e36e4916f reads [712, 66, 1806], as does the composed tip; against rung 1's 1810 the
    // census's E6 -8 lands as -4, an interaction of +4 with rung 1's own -4 (record 28's cure, the same summary leaves).
    // 2026-11-08, MERGE-CAR (the integration landing: records A and B, the rung-2 landing's merge and the people car's merge
    // over the integration branch; re-keyed BY IDENTITY, this census probed on git-archive trees): [712, 66, 1806] ->
    // [656, 262, 2060]. By stage: the merge base 262e8b255 reads [709, 66, 1826]; the car's tip 373a2947b [642, 254, 2048]
    // (the people car moved this arm, E5 +188 and E6 +222, and its pin [709, 66, 1821] stood red there); the integration tip 7b3ffb6ee [753, 66, 1815] (LANDING-R2's figure was taken on the
    // rung-2 lane before it composed); the merged tip 2c7437030 [656, 262, 2060], against the additive [686, 254, 2037] an
    // interaction of [-30, +8, +23] between the car's cast and the rung-2 census (not traced leaf by leaf).
    // 2026-11-10, GREEN-TIP (re-keyed BY IDENTITY; this census probed at every first-parent stage of 2c7437030..bf14617ca that
    // touches src/ or the corpus helper, 76 stages, on git-archive trees; MERGE-WAVE never ran this file, and the train and
    // STYLE-2 records called these figures "the base's, unchanged" while the values moved): [656, 262, 2060] ->
    // [650, 261, 2060] W3 POW 1a160d599 -> [650, 261, 2010] W4 PEOPLE 66c23bfea -> [654, 264, 2006] FIX-FOOD-ISOLATION
    // c6e8a4ad6 -> [654, 273, 2023] FIX-PUBLIC-VEIL 7e65c7bec -> [668, 275, 2045] ALLEGIANCE-CAR1 e5f88930b -> [668, 268, 2046]
    // CAR2 f51058995 -> [668, 275, 2019] CAR3 c6ded8e3a -> [670, 277, 2027] CAR4 824a8ce2f (its own record names this step)
    // -> [670, 277, 2029] SW-B5 FRAMES 46e0121c2 -> [670, 281, 2031] SW-7 POWER-SIDE a3062d919 -> [670, 281, 2029] URBAN-FIX
    // 17b814803 (its record's reason, "the gm fixture", is not this file's: the census generates every town live), unmoved
    // to the tip. Each step is measured at the stage against its parent; the leaf-by-leaf cause inside each lane is not traced.
    // 2026-11-10, RESIDUE (re-keyed BY IDENTITY at the simulation batch's merged tip, STYLE-2-MERGE point 36; this census
    // probed — every other figure of A3, A4, A7 and A8 measured at once by an untracked expect.soft copy, and only this one
    // moved): [670, 281, 2029] -> [670, 281, 2015]. bf14617ca reads 2029 (GREEN-TIP's figure); the first-parent stages
    // point 27 SW-9b-B 8e532a663, 28, 29 and 33 and the line 90774f2fa read 2015; inside point 27, by merging each lane
    // prefix onto its first parent, a74e32c0f reads 2029 and b23e4e91b (SW-9b-B row 2b, E-3: the small-name instigator says
    // it speaks for the gaining power from a house it backs) reads 2015 — E6 reaches 14 fewer readings (the leaf-by-leaf
    // cause inside the commit is not traced). The batch (GREEN-TIP + PULSE-SITES over the line) moves none: the line and the merged tip both read 2015.
    // 2026-11-12, STYLE-2-MERGE point 42 (re-keyed BY IDENTITY, STYLE-2-MERGE-8): [670, 281, 2015] -> [670, 281, 2016]. The line's
    // tip decc7bf15 reads 2015; the COHERENCE-QUARREL merge d4723749a (lane/coherence-quarrel-2026-11-11 at 1c7b5786c, record
    // docs/shift-records/2026-11-12-style-2-merge-42-coherence-quarrel.json: the quarrels' issues and hooks, the safety plot
    // hooks) reads 2016 — E6 reaches one more reading; every other figure of the arm unmoved (the arm's later expects run green).
    // 2026-11-12, STYLE-2-MERGE point 43 (re-keyed BY IDENTITY, STYLE-2-MERGE-8): [670, 281, 2016] -> [682, 325, 2062] at the
    // COHERENCE-PRESUME merge f922124d0 (docs/shift-records/2026-11-12-style-2-merge-43-coherence-presume.json: the culture lines,
    // the re-titled watch role and the ties it re-deals, the history and institution texts reach more readings); point 42 reads
    // [670, 281, 2016]. The leaf-by-leaf cause inside the merge is not traced (PLAUSIBLE per component, CONFIRMED per point).
    // 2026-11-13, STYLE-2-MERGE point 46 (re-keyed BY IDENTITY, STYLE-2-MERGE-9; a figure the COHERENCE-POWERS drafted record names for the merge seat, editCorpusRatchet A3/A5/A7): [682, 325, 2062] -> [684, 257, 2168] at the COHERENCE-POWERS merge 6aeaa4154 (the dual hat re-deals the cast and
    // the ties the E-edits reach); 3575cf061 reads [682, 325, 2062]. PLAUSIBLE per component, CONFIRMED per point.
    expect([taken.E1, taken.E5, taken.E6], 'the edits that DO reach a reading').toEqual([684, 257, 2168]);
    // an npc ROLE reached ZERO readings over the whole corpus until CRISIS, recorded so the figure is not silence.
    // 2026-11-05 (LANDING-6, the same bisection): 0 → 48 CRISIS (d3e072368: the crisis record carries its derived cast,
    // and the cast is chosen by role) → 63 SELF-VOUCH (0be13b5cb) → 32 car 3 (90dc22f18) → 24 PINS (37b1e746d) → 28 F6
    // (6d84aa834), unmoved to the tip. The two dormant membership edits still reach none.
    // 2026-11-07 (LANDING-R2 seat C2, measured by this arm on git-archive trees): 28 → 31 at census-1i unit 1 R-AW
    // (ba7887862: the close-time relabel runs the rename cascade over the crisis cast; 28 at its parent 7e31beeb6, 31 at
    // it). Merge base and rung 1's final tip read 28, the census tip and the composed tip 31: no interaction.
    // 2026-11-08, MERGE-CAR (as above; masked behind the first figure until it was re-keyed): 31 -> 49. By stage: merge base
    // 262e8b255 28, the car's tip 35 (+7), the integration tip 34 (+6), the merged tip 49 (additive 41: interaction +8). The
    // two dormant membership edits still reach none.
    // 2026-11-10, GREEN-TIP (re-keyed BY IDENTITY; this census probed at every first-parent stage of 2c7437030..bf14617ca that
    // touches src/ or the corpus helper, 76 stages, on git-archive trees; MERGE-WAVE never ran this file, and the train and
    // STYLE-2 records called these figures "the base's, unchanged" while the values moved); masked behind the first figure until it was re-keyed): 49 -> 43 W3 POW 1a160d599 -> 59
    // ALLEGIANCE-CAR1 e5f88930b, unmoved to the tip. The two dormant membership edits still reach none.
    // 2026-11-12, STYLE-2-MERGE point 43 (re-keyed BY IDENTITY, STYLE-2-MERGE-8; masked behind A7's first figures until they were
    // re-keyed above): 59 -> 71 at the COHERENCE-PRESUME merge f922124d0 (the re-titled watch role reaches the crisis cast on
    // twelve more readings); point 42 reads 59. The two dormant membership edits still reach none.
    // 2026-11-13, STYLE-2-MERGE point 46 (re-keyed BY IDENTITY, STYLE-2-MERGE-9; masked behind A7's first figures until they were
    // re-keyed above): 71 -> 49 at the COHERENCE-POWERS merge 6aeaa4154 (the dual hat re-deals the cast, so the role edit reaches
    // the crisis cast on fewer readings); 3575cf061 reads 71. The two dormant membership edits still reach none.
    expect([taken.E2, taken.E3, taken.E4], 'a role reaches the crisis cast; a dormant membership edit reaches none').toEqual([49, 0, 0]);
    // AND THE MACHINERY'S FIRST POPULATION, in the chain: the restatement at the first merge lets
    // the record settle away from R0 at a leaf, so the second merge's receipts carry a ride-along.
    // 2026-10-31 (chair ruling X-29, cure lane T13; measured at the GS-2 tree WITHOUT it, where this reads [12, 12]):
    // [12, 12] → [21, 23]. The post-pass now also restates the receipt's conflict citations at the first merge, so the
    // record settles away from R0 at that evidence leaf in nine more chains, and the second merge carries it along.
    // 2026-11-04, the window-end pin re-key (REGISTERS seat; masked behind A7's first figure in DOORS-4, traced by this
    // seat over the same stage trees): [21, 23] → [18, 20] (FOOD-2, stage T2) → [12, 12] (SIZE-3, stage S5).
    // 2026-11-06 (LANDING-7 A, the chair's ruling R-A6: LANDING-6's "ride-along still bisecting", finished; re-keyed by
    // identity with its step, bisected over the rung-1 landing's first-parent stages with a probe of this census's pair
    // half and the tip's own EDITS, in scratch trees; every src-touching stage measured or bracketed by equal neighbours):
    // [12, 12] at a07ee4e0a and soak2 (a8739327e) → [16, 16] X-46 car 1 (1264a8152) → [14, 14] terrain-pools (ac09ea83b)
    // → [31, 31] X-46 car 3 (90dc22f18, the institution budget) → [24, 24] PLACE-NOT-TIER (6129c300d) → [27, 27] PINS
    // (37b1e746d) → [21, 21] car 3 I7 (6ca454d2b), unmoved to the tip (F6, F1, F10, the residual tick bc2a64000, the
    // summary-hook cure c1cf38bbb). Chains and leaves stay equal: every ride-along chain carries exactly one leaf.
    // 2026-11-08, MERGE-CAR (the integration landing: records A and B, the rung-2 landing's merge and the people car's merge
    // over the integration branch; re-keyed BY IDENTITY, masked behind A7's first figures until they were re-keyed): [21, 21]
    // -> [70, 72], measured by this file's own chain census at the merged tip 2c7437030. Chains and leaves are no longer
    // equal: two of the seventy ride-along chains carry two leaves. NOT attributed by stage (the chain census was not probed
    // on the car's and the integration's trees; both tips read A7 red at their first figure, so neither side's pin was live).
    // 2026-11-10, GREEN-TIP (re-keyed BY IDENTITY; masked behind A7's first figures until they were re-keyed above): [70, 72]
    // -> [144, 154], measured by this file's own chain census at the green-tip lane over bf14617ca. NOT attributed by stage:
    // the chain census (~5 minutes a tree) was not probed on the 76 stage trees the census figures above were measured on,
    // and every stage between 2c7437030 and the tip read A7 red at its first figure, so this pin was never live there.
    // PLAUSIBLE cause: the same eleven lane merges that moved [E1, E5, E6] above. Chains and leaves stay unequal.
    // 2026-11-13, STYLE-2-MERGE point 46 (re-keyed BY IDENTITY, STYLE-2-MERGE-9; masked behind the role reach until it was re-keyed):
    // [144, 154] -> [135, 151] at the COHERENCE-POWERS merge 6aeaa4154, this file's own chain census at the merged tree (the dual hat
    // re-deals the cast the chains ride along). PLAUSIBLE cause, not traced by chain. Chains and leaves stay unequal.
    expect([chains().rideAlongChains, chains().rideAlongLeaves], 'the honesty machinery firing').toEqual([135, 151]);
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
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair, measured against the pre-band base 5d699cc68, where this file is 8/8): THE SWEEP IS NOW 63 OF 63. The mountain town's
    // V-SUMMARY-DEPS residue no longer reproduces on the re-dealt record (recordInvariants' own A1 records the same cure).
    expect(dirty).toEqual([]);
    // anchored: the emitted label and the ladder's own measurement agree on every one of the 126
    // scores, so a ladder cut that drifted from the producer that emits its label reds here.
    expect(bands).toEqual([]);
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair, measured against the pre-band base 5d699cc68, where this file is 8/8): the witnessed sets widen, 25/34 → 28/37;
    // legitimacy now reaches 0 (the clamped village the V-LEGIT-SUM check mirrors) and readiness spans 8..82 (was 11..81).
    // 2026-11-04, the window-end pin re-key (REGISTERS seat, traced by stage in DOORS-4): 28/37 → 26/37 (FOOD-1) → 23/36
    // (FOOD-2) → 23/37 (FOOD-3); the ranges below did not move.
    // 2026-11-05 (LANDING-6, bisected as A7 above): 23/37 → 24/38 X-46 car 1 (1264a8152) → 23/38 car 2 (d4bf6431c) →
    // 24/38 terrain-pools (ac09ea83b) → 24/37 T1/T2 (fe56bddd4) → 22/36 car 3 (90dc22f18; readiness now spans 7..83) →
    // 22/35 car 1b (fb0341b93; 7..81) → 22/37 PINS (37b1e746d; 7..83) → 23/37 car 3 I7 (6ca454d2b) → 21/36 F6 (6d84aa834),
    // unmoved to the tip; legitimacy's range never moved.
    // 2026-11-10, GREEN-TIP (re-keyed BY IDENTITY; this census probed at every first-parent stage of 2c7437030..bf14617ca that
    // touches src/ or the corpus helper, 76 stages, on git-archive trees; MERGE-WAVE never ran this file, and the train and
    // STYLE-2 records called these figures "the base's, unchanged" while the values moved): 21/36 -> 20/36 at
    // FIX-FOOD-ISOLATION's merge c6e8a4ad6 (501c97412 reads 21/36): legitimacy scores {25, 62} gone, {42} new; readiness
    // unmoved. Unmoved to the tip.
    expect([witnessed.legitimacy.size, witnessed.readiness.size], 'the scores are WITNESSED, not assumed').toEqual([20, 32]); // STYLE-2-MERGE point 47 (2026-11-13, the COHERENCE-AGREE merge 22cc9ef7d; the draft names it for the merge seat): measured at the signed tree EQUAL to the lane's own tip 69b53decd: readiness 36 -> 32, legitimacy 20 held
    // (b) the witnessed score set of the ladders, RECORDED (charter addenda 71 and 73)
    expect([Math.min(...witnessed.legitimacy), Math.max(...witnessed.legitimacy)]).toEqual([0, 75]);
    expect([Math.min(...witnessed.readiness), Math.max(...witnessed.readiness)]).toEqual([7, 83]);
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
    // 2026-10-01 (the urban band, ODQ §934.86): 15 → 22, the seven faction-ledger paths the window declared NON-CASCADED in
    // institutionRename.js (J16's two, then the five that hold 'Democratic assembly'), every one declaring `readable`.
    // 2026-10-31 (the GS-2 merge, lane G2, ODQ §934.101; re-measured by cure lane T13): 22 → 25, the three paths the
    // register sweep 3511e283 declared because a power-faction name now reaches them (`factions[].name`,
    // `conflicts[].parties[]`, `powerStructure.conflicts[].parties[]`), every one declaring `readable: false`.
    // 2026-11-05 (LANDING-6, measured by import at each first-parent stage that touches the ledger): 25 → 26 PINS
    // (11467ed57) → 35 F7 RENAME-CASCADE (a373129ee: the duplicate NON_CASCADED rows and the criminal services' and crisis
    // cast's paths), every one declaring `readable`.
    // 2026-11-07 (the people landing, measured by import at each lane's tree): 35 -> 41 PEOPLE-1 CAST dc655f712 (the card's
    // `institution.family`, `memberships[].power` and `secondaryAffiliation` rows, each on npcs[] and the grouping's
    // members) -> 32 PEOPLE-5B EDIT a725df7e4 (the grouping's and the shim's label rows leave), every one declaring `readable`.
    expect([INSTITUTION_NON_CASCADED.length, declaring(INSTITUTION_NON_CASCADED).length]).toEqual([32, 32]);
    expect(INSTITUTION_NON_CASCADED.filter((row) => row.kind === 'matched-pattern' && row.readable).map((row) => row.path)).toEqual(['economicState.activeChains[].processingInstitutions[]']);
    expect(typeof institutionRemovalChanges).toBe('function');
    // EXIT 2, the UNDECLARED ledger: EM-R6's LANDED ruling is that none of its rows has a reader,
    // and the prose rule is ENFORCED by the scan rather than trusted, at zero src/ bytes.
    // 2026-11-05 (LANDING-6, measured by import at each first-parent stage that touches the ledger): [16, 13] → [18, 14]
    // F7 RENAME-CASCADE (a373129ee) → [22, 14] F7 unit 5 (09295e420); none of the new rows declares `readable`.
    // 2026-11-07 (the people landing, by import at each lane's tree): [22, 14] -> [25, 14] PEOPLE-1 CAST dc655f712 ->
    // [20, 12] PEOPLE-5B EDIT a725df7e4 (the grouping walks and the affiliation rows leave); none declares `readable`.
    // ALLEGIANCE-CAR1 (2026-11-08, 4e55421ea, measured by import): [20, 12] -> [21, 12], the allegiance receipt's
    // `simulationTrace[].downstreamEffects[].target` row (it names the criminal power); it declares no `readable`.
    // ALLEGIANCE-CAR4 (2026-11-09, 03ff59084 THE GOALS REBUILT, measured by import): [21, 12] -> [21, 14], the card's
    // `goal.short` and `goal.long` rows (npcs[].goal.*: the goal families name the people a goal binds; the durable join is
    // goal.intent.*.target.id) declared non-cascaded for a PERSON rename, owner-gated prose; neither declares `readable`.
    expect([FACTION_NON_CASCADED.length, NPC_NON_CASCADED_SURFACES.length]).toEqual([21, 14]);
    expect(declaring(FACTION_NON_CASCADED).length + declaring(NPC_NON_CASCADED_SURFACES).length).toBe(0);
    const importers = srcModules()
      .map((rel) => ({ rel, clause: /import\s*\{([^}]*)\}\s*from\s*'[^']*factionRename\.js'/s.exec(readFileSync(resolve(ROOT, 'src', rel), 'utf8')) }))
      .filter((each) => each.clause !== null);
    // 2026-11-07 (LANDING-R2 seat C2, the pool census composed): 3 → 4, census-1i unit 1 R-AW (ba7887862) adds
    // src/generators/power/factionLabelClose.js, which imports `applyFactionRenameToSettlement` (the rename cascade) and
    // no NON_CASCADED surface; the file is created by that commit (git log --diff-filter=A).
    expect(importers.length, 'the scan is not vacuous: factionRename.js HAS src/ importers').toBe(4);
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
