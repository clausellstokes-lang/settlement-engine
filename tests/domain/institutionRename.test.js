/**
 * institutionRename.test.js — THE INSTITUTION CASCADE DENOMINATOR PIN (design §22.1 ruling 7).
 *
 * SAVES, NOT SETTLEMENTS. Every fixture here is JSON round-tripped through
 * `reloaded()` before it is renamed. That is not a convenience clone: at
 * generation one NPC object is SHARED between `settlement.npcs[]` and
 * `settlement.factions[].members[]`, so an in-memory rename appears to move both
 * homes and every in-memory probe agrees. Serialization splits the alias, and the
 * member copies are the stale ones on every reloaded save. Testing the live
 * object would reproduce the exact blindness that let the faction bug ship.
 *
 * THE DENOMINATOR IS INDEPENDENT, AND IT HAS THREE ARMS. `walkNamePaths` walks
 * the WHOLE settlement blob and reports the path shape of every string value,
 * scoring each shape three ways: EXACT equality with a roster house name, and
 * two arms the exact walk is blind to BY CONSTRUCTION, because their paths hold
 * no exact name at all: CATALOGUE names and NORMALISED names. It never reads the
 * module's declarations for its denominator. A RED CONTROL runs the same two
 * arms against VERSION 2's lists and requires them to convict, because an arm
 * that cannot fail is not a guard.
 *
 * THE FLOORS ARE RAISE-ONLY: 40 shapes, 2,000 institutions, 1 catalogue path,
 * 4 normalised paths, 1 red-control finding. Lower one and this file stops
 * measuring the thing it was written to measure.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { goldenCorpus } from '../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import {
  INSTITUTION_RENAME_SURFACES,
  LABEL_REWRITE,
  NON_CASCADED_SURFACES,
  SERVICE_PROVENANCE_SENTINELS,
  applyInstitutionRenameToSettlement,
  institutionRenameChanges,
  listOf,
  resolveSites,
} from '../../src/domain/institutionRename.js';

const NEW_NAME = 'The Amber Concord Hall';
/** The STRUCTURED SAMPLE: every eighth row of the golden corpus, capped at 63. */
const SAMPLE_STEP = 8;
const SAMPLE_SIZE = 63;
const ROOT = join(import.meta.dirname, '../..');

/** A settlement as a RELOADED SAVE. See the file header. */
function reloaded(settlement) {
  return JSON.parse(JSON.stringify(settlement));
}

/** Resolve a DECLARED path against the data generically, returning every string leaf. */
function valuesAt(root, path) {
  const out = [];
  for (const site of resolveSites(root, path)) {
    const held = site.owner[site.key];
    if (site.isList) { for (const item of listOf(held) || []) if (typeof item === 'string') out.push(item); }
    else if (typeof held === 'string') out.push(held);
  }
  return out;
}

const normalise = (value) => value.toLowerCase().replace(/['’]/g, '').replace(/\s+/g, ' ').trim();
const rosterOf = (save) => valuesAt(save, 'institutions[].name').map((value) => value.trim());

/** Every handle to `name` across the declared cascade rows, under each row's own match kind. */
function handleCount(save, name) {
  let total = 0;
  for (const row of INSTITUTION_RENAME_SURFACES) {
    for (const value of valuesAt(save, row.path)) {
      if (row.match === 'label' ? normalise(value) === normalise(name) : value.trim() === name) total += 1;
    }
  }
  return total;
}

/** The house carrying the most declared handles: the worst case a rename can meet. */
function worstCaseHouse(save) {
  let worst = null;
  let best = -1;
  for (const name of rosterOf(save)) {
    const count = handleCount(save, name);
    if (count > best) { best = count; worst = name; }
  }
  return { name: worst, handles: best };
}

/**
 * ⭐ THE TRUE REFERENCE SET. A dangling JOIN is a value that is SUPPOSED to name a
 * house and names none. Five declared `exact` rows are not references and are
 * named here with the reason each is excluded, because a denominator that counts
 * them reports thousands of false dangles and can never reach zero.
 */
const NOT_A_REFERENCE = Object.freeze({
  'institutions[].name': 'the roster itself: it IS the set a reference joins to',
  'economicState.activeChains[].label': 'a chain LABEL, present on every chain and report-only on removal',
  'spatialLayout.quarters[].landmarks[]': 'a HAYSTACK districtProfile stem-matches, mostly not house names',
  'npcs[].secondaryAffiliation': 'a FREE vocabulary shared with faction names, so a non-roster value is lawful',
  'factions[].members[].secondaryAffiliation': 'the member mirror of that same free vocabulary',
});
const REFERENCE_ROWS = INSTITUTION_RENAME_SURFACES
  .filter((row) => row.match === 'exact' && !Object.hasOwn(NOT_A_REFERENCE, row.path));
const SENTINELS = new Set(SERVICE_PROVENANCE_SENTINELS);

/** Values on the true reference set that name no surviving house and no declared sentinel. */
function danglingJoins(save) {
  const roster = new Set(rosterOf(save));
  let total = 0;
  for (const row of REFERENCE_ROWS) {
    for (const value of valuesAt(save, row.path)) {
      const held = value.trim();
      if (!held || SENTINELS.has(held) || roster.has(held)) continue;
      total += 1;
    }
  }
  return total;
}

/** Every key PATH a record carries, for the no-new-key comparison. */
function keySetOf(node, out = new Set(), prefix = '') {
  if (Array.isArray(node)) { for (const item of node) keySetOf(item, out, `${prefix}[]`); return out; }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) { out.add(`${prefix}.${key}`); keySetOf(node[key], out, `${prefix}.${key}`); }
  }
  return out;
}

/** The whole-blob walk: one row per PATH SHAPE, with its three scores. */
function walkNamePaths(node, shape, tally, roster, rosterNormal, catalogue) {
  if (typeof node === 'string') {
    const row = tally.get(shape) || { total: 0, exact: 0, catalogue: 0, normal: 0, sample: node };
    row.total += 1;
    const held = node.trim();
    if (roster.has(held)) { row.exact += 1; row.sample = node; }
    if (catalogue.has(held)) row.catalogue += 1;
    if (rosterNormal.has(normalise(held))) row.normal += 1;
    tally.set(shape, row);
    return;
  }
  if (Array.isArray(node)) { for (const item of node) walkNamePaths(item, `${shape}[]`, tally, roster, rosterNormal, catalogue); return; }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) walkNamePaths(node[key], shape ? `${shape}.${key}` : key, tally, roster, rosterNormal, catalogue);
  }
}

const CATALOGUE_NAMES = new Set();
for (const tier of Object.values(institutionalCatalog)) {
  for (const group of Object.values(tier || {})) for (const name of Object.keys(group || {})) CATALOGUE_NAMES.add(name);
}

/** @type {Array<{ key: string, save: any, worst: { name: string, handles: number } }>} */
const worlds = [];
/** @type {Map<string, { total: number, exact: number, catalogue: number, normal: number, sample: string }>} */
const shapes = new Map();
let institutionsSeen = 0;

beforeAll(() => {
  const rows = goldenCorpus().filter((_, index) => index % SAMPLE_STEP === 0).slice(0, SAMPLE_SIZE);
  for (const row of rows) {
    const { _seed, ...config } = row;
    const save = reloaded(generateSettlementPipeline(config, null, { seed: _seed, customContent: {} }));
    const roster = rosterOf(save);
    if (!roster.length) continue;
    institutionsSeen += roster.length;
    const rosterSet = new Set(roster);
    walkNamePaths(save, '', shapes, rosterSet, new Set(roster.map(normalise)), CATALOGUE_NAMES);
    worlds.push({ key: `${config.settType}|${config.culture}|${config.terrainOverride}`, save, worst: worstCaseHouse(save) });
  }
}, 300000);

describe('institution rename: the declared cascade over real pipeline saves', () => {
  it('A1 the independent three-arm denominator declares every name-bearing path, and version 2 lists red', () => {
    expect(worlds.length, 'the sample generated no worlds at all').toBe(SAMPLE_SIZE);
    expect(institutionsSeen, 'anti-vacuity: too few institutions to measure a cascade over').toBeGreaterThanOrEqual(2000);

    const exactShapes = [...shapes.entries()].filter(([, row]) => row.exact > 0).map(([shape]) => shape).sort();
    const catalogueShapes = [...shapes.entries()]
      .filter(([, row]) => row.exact === 0 && row.total > 0 && row.catalogue / row.total >= 0.5).map(([shape]) => shape).sort();
    const normalShapes = [...shapes.entries()]
      .filter(([, row]) => row.exact === 0 && row.total > 0 && row.normal / row.total >= 0.5).map(([shape]) => shape).sort();
    process.stdout.write(`\n[A1] exact shapes ${exactShapes.length}: ${exactShapes.join(', ')}\n`);
    process.stdout.write(`[A1] catalogue-majority ${catalogueShapes.length}: ${catalogueShapes.join(', ')}\n`);
    process.stdout.write(`[A1] normalised-majority ${normalShapes.length}: ${normalShapes.join(', ')}\n`);
    expect(exactShapes.length, 'anti-vacuity: the exact walk found almost no name-bearing paths').toBeGreaterThanOrEqual(40);
    expect(catalogueShapes.length, 'anti-vacuity: the catalogue arm is blind, so it proves nothing').toBeGreaterThanOrEqual(1);
    expect(normalShapes.length, 'anti-vacuity: the normalised arm is blind, so it proves nothing').toBeGreaterThanOrEqual(4);

    const declared = new Set([...INSTITUTION_RENAME_SURFACES.map((row) => row.path), ...NON_CASCADED_SURFACES.map((row) => row.path)]);
    const undeclared = [...new Set([...exactShapes, ...catalogueShapes, ...normalShapes])]
      .filter((shape) => !declared.has(shape))
      .map((shape) => `${shape}  e.g. ${JSON.stringify(String(shapes.get(shape).sample).slice(0, 60))}`).sort();
    expect(undeclared,
      '\nStored paths hold an institution name but appear in NEITHER INSTITUTION_RENAME_SURFACES'
      + ' nor NON_CASCADED_SURFACES. Either cascade the path or record why it must not move.'
      + '\nTWO SENTENCES A LATER READER WILL NEED. (a) A catalogId path crossing the 50 percent'
      + ' threshold is a CATALOGUE-SHAPE change, not a missing cascade row. (b) Aliased or'
      + ' duplicated stamps DECLARE ONCE PER PATH by design: the walk addresses by path, and a'
      + ` reloaded save has already split any alias.\n${undeclared.map((row) => `  ${row}`).join('\n')}\n`,
    ).toEqual([]);

    // ⛔ THE RED CONTROL. Version 2 cascaded four paths that are not references and ruled out
    // only five. Without this the two new arms are unfalsifiable.
    const version2 = new Set([
      ...INSTITUTION_RENAME_SURFACES.filter((row) => row.match !== 'label').map((row) => row.path),
      'economicState.activeChains[].processingInstitutions[]',
      'resourceAnalysis.resourceChains[].processingInstitutions[]',
      'resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]',
      'resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]',
      'simulationTrace[].downstreamEffects[].target',
      'generationCoherenceReceipt.repairs[].subject',
      'availableServices.legal[].name',
      'resourceAnalysis.resourceConditions[].label',
      'economicState.activeChains[].resource',
    ]);
    const versionTwoMisses = [...new Set([...catalogueShapes, ...normalShapes])].filter((shape) => !version2.has(shape)).sort();
    process.stdout.write(`[A1] red control: version 2 misses ${versionTwoMisses.length}: ${versionTwoMisses.join(', ')}\n`);
    expect(versionTwoMisses.length,
      'THE RED CONTROL PASSED: version 2 lists survived the two new arms, so the arms convict nothing',
    ).toBeGreaterThanOrEqual(1);

    // (v) THE DISJOINTNESS ARM: no secondaryAffiliation value is BOTH a roster house and a roster faction.
    const bothKinds = [];
    for (const world of worlds) {
      const houses = new Set(rosterOf(world.save));
      const factions = new Set((world.save.powerStructure?.factions || [])
        .map((record) => String(record?.faction || record?.name || '').trim()).filter(Boolean));
      for (const value of [...valuesAt(world.save, 'npcs[].secondaryAffiliation'), ...valuesAt(world.save, 'factions[].members[].secondaryAffiliation')]) {
        const held = value.trim();
        if (houses.has(held) && factions.has(held)) bothKinds.push(`${world.key}: ${held}`);
      }
    }
    expect([...new Set(bothKinds)], 'a secondaryAffiliation value names BOTH a house and a faction, so the exact guard cannot tell them apart').toEqual([]);

    // (vi) THE LABEL_REWRITE CLOSED-VOCABULARY PIN, in OrphanKind's exact shape.
    const forms = Object.keys(LABEL_REWRITE).sort();
    const labelRows = INSTITUTION_RENAME_SURFACES.filter((row) => row.match === 'label');
    const exactRows = INSTITUTION_RENAME_SURFACES.filter((row) => row.match === 'exact');
    expect(forms.length, 'anti-vacuity: the rewrite map is empty, so membership proves nothing').toBeGreaterThan(0);
    expect(labelRows.length, 'anti-vacuity: no label row exists, so the membership arm is empty').toBeGreaterThan(0);
    expect(forms, 'the rewrite vocabulary is CLOSED at two: a third form reds here, not on a DM screen').toEqual(['lower', 'verbatim']);
    expect(labelRows.map((row) => row.rewrite).sort(), 'every label row declares a form from that key set').toEqual(['lower', 'verbatim']);
    expect(exactRows.filter((row) => Object.hasOwn(row, 'rewrite')).map((row) => row.path),
      'an exact row carries no rewrite field: the match kind forbids the question').toEqual([]);
    expect(exactRows.length, 'the exact rows are the 34 the packet declares').toBe(34);

    // (vi)(d) BOTH MEMBERS OBSERVED FIRING through the cascade, never asserted from the declaration.
    const fired = new Set();
    for (const world of worlds) {
      const save = reloaded(world.save);
      const before = new Map(labelRows.map((row) => [row.path, valuesAt(save, row.path).length]));
      applyInstitutionRenameToSettlement(save, world.worst.name, NEW_NAME);
      for (const row of labelRows) {
        if (!before.get(row.path)) continue;
        if (valuesAt(save, row.path).includes(LABEL_REWRITE[row.rewrite](NEW_NAME))) fired.add(row.rewrite);
      }
    }
    expect([...fired].sort(), 'a rewrite form never fired over the whole sample, so the vocabulary has a dead member').toEqual(['lower', 'verbatim']);
  });

  it('A2 the rename is total on real pipeline data: zero stale handles and zero new dangling joins', () => {
    const rows = [];
    const residue = new Map();
    let handlesBefore = 0;
    let staleAfter = 0;
    let newDangles = 0;
    let baselineDangles = 0;
    for (const world of worlds) {
      const save = reloaded(world.save);
      const before = handleCount(save, world.worst.name);
      const baseline = danglingJoins(save);
      baselineDangles += baseline;
      handlesBefore += before;
      const result = applyInstitutionRenameToSettlement(save, world.worst.name, NEW_NAME);
      const stale = handleCount(save, world.worst.name);
      staleAfter += stale;
      newDangles += Math.max(0, danglingJoins(save) - baseline);
      for (const row of NON_CASCADED_SURFACES) {
        const held = valuesAt(save, row.path)
          .filter((value) => value.trim() === world.worst.name || normalise(value) === normalise(world.worst.name)).length;
        if (held) residue.set(row.path, (residue.get(row.path) || 0) + held);
      }
      rows.push({ key: world.key, before, stale, changed: result.changed, touched: result.touched.length });
    }
    // GUARD THE GUARD: a rename that had nothing to move cannot prove totality.
    expect(handlesBefore, 'the sample carried no handles at all before the rename').toBeGreaterThan(0);
    expect(rows.filter((row) => !row.changed).map((row) => row.key), 'a world reported changed: false with handles to move').toEqual([]);
    process.stdout.write(`\n[A2] handles before ${handlesBefore} over ${rows.length} rows; stale after ${staleAfter}\n`);
    process.stdout.write(`[A2] declared NON_CASCADED residue: ${JSON.stringify([...residue.entries()].sort())}\n`);
    process.stdout.write(`[A2] reference-set dangles: baseline ${baselineDangles}, new ${newDangles}\n`);
    expect(rows.filter((row) => row.stale > 0).map((row) => `${row.key}: ${row.stale} stale`),
      'a declared cascade row still spells the old house name after the rename').toEqual([]);
    expect(newDangles, 'the rename minted a dangling reference join the record did not carry').toBe(0);
    expect(baselineDangles, 'the pre-existing reference-set dangle baseline is a finding: it is zero').toBe(0);
    const residuePaths = [...residue.keys()].sort();
    const declaredNonCascaded = new Set(NON_CASCADED_SURFACES.map((row) => row.path));
    expect(residuePaths.filter((path) => !declaredNonCascaded.has(path)),
      'the residue after a rename sits on a path no ledger declares').toEqual([]);
    expect(residuePaths.length, 'anti-vacuity: no residue at all means the walk found nothing').toBeGreaterThan(0);
  });

  it('A3 both NPC homes move together, proved against a one-home negative control', () => {
    const PAIRED_FIELDS = ['institution', 'secondaryAffiliation'];
    const membersById = (save) => {
      const index = new Map();
      for (const faction of save.factions || []) for (const member of faction.members || []) if (member?.id) index.set(member.id, member);
      return index;
    };
    const disagreeing = (save) => {
      const members = membersById(save);
      return (save.npcs || []).filter((npc) => {
        const twin = npc?.id ? members.get(npc.id) : null;
        return twin ? PAIRED_FIELDS.some((field) => npc[field] !== twin[field]) : false;
      }).length;
    };
    let paired = 0;
    let disagreeBefore = 0;
    const oneHomeRed = [];
    const twoHomeRed = [];
    for (const world of worlds) {
      const base = reloaded(world.save);
      const members = membersById(base);
      for (const npc of base.npcs || []) if (npc?.id && members.has(npc.id)) paired += 1;
      disagreeBefore += disagreeing(base);

      // THE NEGATIVE CONTROL: the identical cascade with the SECOND home dropped.
      const oneHome = reloaded(world.save);
      for (const row of INSTITUTION_RENAME_SURFACES) {
        if (row.path.startsWith('factions[].members[]')) continue;
        for (const site of resolveSites(oneHome, row.path)) {
          if (site.isList) {
            const list = listOf(site.owner[site.key]) || [];
            for (let index = 0; index < list.length; index += 1) {
              if (typeof list[index] === 'string' && list[index].trim() === world.worst.name) list[index] = NEW_NAME;
            }
            continue;
          }
          const value = site.owner[site.key];
          const hit = typeof value === 'string'
            && (row.match === 'label' ? normalise(value) === normalise(world.worst.name) : value.trim() === world.worst.name);
          if (hit) site.owner[site.key] = LABEL_REWRITE[row.rewrite || 'verbatim'](NEW_NAME);
        }
      }
      if (disagreeing(oneHome)) oneHomeRed.push(world.key);

      const twoHome = reloaded(world.save);
      applyInstitutionRenameToSettlement(twoHome, world.worst.name, NEW_NAME);
      if (disagreeing(twoHome)) twoHomeRed.push(world.key);
    }
    process.stdout.write(`\n[A3] paired people ${paired}; disagreeing before ${disagreeBefore}; one-home red ${oneHomeRed.length}/${worlds.length}; two-home red ${twoHomeRed.length}/${worlds.length}\n`);
    expect(paired, 'no person is stored at both homes in this sample, so the mirror claim is vacuous').toBeGreaterThan(0);
    expect(disagreeBefore, 'the two homes already disagree before any edit, so the baseline is not clean').toBe(0);
    expect(oneHomeRed.length, 'THE CONTROL PASSED: dropping the second home changed nothing, so this arm proves nothing').toBeGreaterThan(0);
    expect(twoHomeRed, 'the cascade left a person disagreeing with their own member copy').toEqual([]);
  });

  it('A6 the rename touches nothing it must not touch', () => {
    const siblingMoved = [];
    const nonCascadedMoved = [];
    const keyGained = [];
    const noOpMoved = [];
    let bothRows = 0;
    let guildHandles = 0;
    let guildUntouched = 0;
    let legalEntries = 0;
    let legalNameEqualsInstitution = 0;
    let legalRosterNames = 0;
    let legalNamesDifferentHouse = 0;
    for (const world of worlds) {
      const base = reloaded(world.save);
      const save = reloaded(world.save);
      const beforeKeys = keySetOf(save);
      const sibling = rosterOf(base).find((name) => name !== world.worst.name) || null;
      applyInstitutionRenameToSettlement(save, world.worst.name, NEW_NAME);

      // (i) a sibling house keeps its name.
      if (sibling && !rosterOf(save).includes(sibling)) siblingMoved.push(`${world.key}: ${sibling}`);
      // (ii) every declared NON_CASCADED path is byte-identical.
      for (const row of NON_CASCADED_SURFACES) {
        if (JSON.stringify(valuesAt(save, row.path)) !== JSON.stringify(valuesAt(base, row.path))) nonCascadedMoved.push(`${world.key}: ${row.path}`);
      }
      // (iii) no record GAINS a key it did not carry.
      for (const key of keySetOf(save)) if (!beforeKeys.has(key)) keyGained.push(`${world.key}: ${key}`);
      // (iv) a no-op rename reports changed: false and mutates nothing.
      const noOp = reloaded(world.save);
      const noOpResult = applyInstitutionRenameToSettlement(noOp, world.worst.name, world.worst.name);
      if (noOpResult.changed || noOpResult.touched.length || JSON.stringify(noOp) !== JSON.stringify(base)) noOpMoved.push(world.key);

      // (v) THE FACTION-HANDLE PIN: a case near-miss must NOT follow an institution rename.
      const guild = rosterOf(base).find((name) => name === "Thieves' guild chapter");
      if (guild) {
        const handlesOf = (record) => [...valuesAt(record, 'npcs[].secondaryAffiliation'), ...valuesAt(record, 'factions[].members[].secondaryAffiliation')]
          .filter((value) => value.trim() === "Thieves' Guild").length;
        const before = handlesOf(base);
        if (before > 0) {
          bothRows += 1;
          guildHandles += before;
          const pinned = reloaded(world.save);
          applyInstitutionRenameToSettlement(pinned, guild, NEW_NAME);
          if (handlesOf(pinned) === before) guildUntouched += before;
        }
      }
      // (vi) the ledger's one prose-backed ruling, asserted directly.
      const houses = new Set(rosterOf(base));
      for (const entry of base.availableServices?.legal || []) {
        legalEntries += 1;
        const name = typeof entry?.name === 'string' ? entry.name.trim() : null;
        const institution = typeof entry?.institution === 'string' ? entry.institution.trim() : null;
        if (name && institution && name === institution) legalNameEqualsInstitution += 1;
        if (name && houses.has(name)) { legalRosterNames += 1; if (name !== institution) legalNamesDifferentHouse += 1; }
      }
    }
    process.stdout.write(`\n[A6] guild rows ${bothRows}, handles ${guildHandles}, untouched ${guildUntouched}\n`);
    process.stdout.write(`[A6] legal[].name entries ${legalEntries}, name===institution ${legalNameEqualsInstitution}, roster names ${legalRosterNames}, different house ${legalNamesDifferentHouse}\n`);
    expect(siblingMoved, 'renaming one house moved a sibling house').toEqual([]);
    expect(nonCascadedMoved, 'a declared NON_CASCADED path moved under a rename').toEqual([]);
    expect(keyGained, 'the rename minted a key the record did not carry').toEqual([]);
    expect(noOpMoved, 'a no-op rename reported a change or mutated the record').toEqual([]);
    expect(bothRows, 'no sample row carries both the guild house and the faction handle, so the pin is vacuous').toBeGreaterThan(0);
    expect(guildUntouched, 'a faction handle followed an INSTITUTION rename: the match is exact and must NOT be case-folded').toBe(guildHandles);
    expect(legalEntries, 'no legal service entries at all, so the ledger ruling is untested').toBeGreaterThan(0);
    expect(legalNameEqualsInstitution, 'a legal entry name equals its own institution, so the ruling that they differ is refuted').toBe(0);
    expect(legalNamesDifferentHouse, 'a legal entry name holds a roster house that is its own institution').toBe(legalRosterNames);
  });

  it('A7 the immutable rename form returns only touched buckets and never mutates its input', () => {
    const mutated = [];
    const touchedDiffer = [];
    const sharedBucket = [];
    for (const world of worlds) {
      const pristine = JSON.stringify(world.save);
      const inPlace = reloaded(world.save);
      const direct = applyInstitutionRenameToSettlement(inPlace, world.worst.name, NEW_NAME);
      const result = institutionRenameChanges(world.save, world.worst.name, NEW_NAME);
      if (JSON.stringify(world.save) !== pristine) mutated.push(world.key);
      if (JSON.stringify(result.touched) !== JSON.stringify(direct.touched)) touchedDiffer.push(world.key);
      for (const bucket of Object.keys(result.changes)) if (result.changes[bucket] === world.save[bucket]) sharedBucket.push(`${world.key}: ${bucket}`);
      expect(result.orphaned, 'a rename emits no orphan notes').toEqual([]);
    }
    expect(mutated, 'the immutable form mutated the settlement it was handed').toEqual([]);
    expect(touchedDiffer, 'the immutable form reports a different touched set from the in-place form').toEqual([]);
    expect(sharedBucket, 'a returned bucket is the caller own object rather than a clone').toEqual([]);
  });

  it('A8 the golden posture is unchanged: both fixture digests equal their frozen register rows', () => {
    const register = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/.golden-freeze-register.json'), 'utf8'));
    const wanted = ['tests/fixtures/generator-golden-master.json', 'tests/fixtures/dossier-prose-manifest-golden.json'];
    const frozen = new Map((register.surfaces || []).filter((row) => wanted.includes(row.path)).map((row) => [row.path, row.sha256]));
    expect([...frozen.keys()].sort(), 'the freeze register does not carry both fixture rows, so this arm compares nothing').toEqual([...wanted].sort());
    const drifted = wanted.filter((path) => createHash('sha256').update(readFileSync(join(ROOT, path))).digest('hex') !== frozen.get(path));
    expect(drifted, 'a golden fixture moved: a re-record is the owner decision, never a lane one').toEqual([]);
  });
});
