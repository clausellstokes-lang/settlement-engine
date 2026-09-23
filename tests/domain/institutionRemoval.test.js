/**
 * institutionRemoval.test.js — THE REMOVAL SWEEPS THE RENAME'S OWN LIST
 * (design §22.3 item 10, via §22.2 item 10).
 *
 * SAVES, NOT SETTLEMENTS: every fixture is JSON round-tripped before it is swept,
 * for the reason the rename battery's header states.
 *
 * THE GATE IS A DELTA, NEVER AN ABSOLUTE. A removal adds ZERO new dangling joins
 * MEASURED AGAINST THE RECORD'S OWN PRE-EXISTING BASELINE, because a SAVED record
 * may carry dangles the generator never wrote. That the baseline turns out to be
 * zero over the true reference set is a FINDING reported here, not the contract.
 *
 * ⛔ `src/generators/servicesGenerator.js` IS READ, NEVER IMPORTED. It lives in
 * the generation worker's zero-slack closure, so a `readFileSync` is the only
 * lawful join between the generator's own literals and the domain's declared list.
 * The read is ANTI-VACUOUS BY CONSTRUCTION: the arm asserts its anchor is FOUND
 * and that it extracted at least eleven literals BEFORE it compares anything,
 * because a marker-slice source scan that silently returns nothing is this
 * estate's own live defect class.
 *
 * ⭐ WHAT THE ANCHOR GUARDS, AND WHY IT IS NOT THE EXTRACTION (packet version 8,
 * judgment 183). Version 7 extracted the literals passed as `addCrimeService`'s
 * THIRD ARGUMENT and required eleven; the build measured SEVEN, because four of
 * the eleven spellings are written by a different shape in the same file, a
 * direct `buckets.criminal.push({ ...item, institution: '(…)' })`. Reading one
 * writer shape measures the shape, not the file. So the anchor stays exactly
 * where it was, as the liveness proof that this scan has not gone quietly empty,
 * and the EXTRACTION it guards is every parenthetical string literal the file
 * spells, which is what the packet's own §5 and §6 always executed.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { goldenCorpus } from '../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  INSTITUTION_RENAME_SURFACES,
  NON_CASCADED_SURFACES,
  SERVICE_PROVENANCE_SENTINELS,
  applyInstitutionRenameToSettlement,
  listOf,
  resolveSites,
} from '../../src/domain/institutionRename.js';
import { applyInstitutionRemovalToSettlement, institutionRemovalChanges } from '../../src/domain/institutionRemoval.js';

const SAMPLE_STEP = 8;
const SAMPLE_SIZE = 63;
const ROOT = join(import.meta.dirname, '../..');
const SERVICES_SOURCE = join(ROOT, 'src/generators/servicesGenerator.js');
const ANCHOR = 'addCrimeService = (name, desc, institution) =>';
const SENTINELS = new Set(SERVICE_PROVENANCE_SENTINELS);

function reloaded(settlement) {
  return JSON.parse(JSON.stringify(settlement));
}

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

function handleCount(save, name) {
  let total = 0;
  for (const row of INSTITUTION_RENAME_SURFACES) {
    for (const value of valuesAt(save, row.path)) {
      if (row.match === 'label' ? normalise(value) === normalise(name) : value.trim() === name) total += 1;
    }
  }
  return total;
}

function worstCaseHouse(save) {
  let worst = null;
  let best = -1;
  for (const name of rosterOf(save)) {
    const count = handleCount(save, name);
    if (count > best) { best = count; worst = name; }
  }
  return worst;
}

/** THE TRUE REFERENCE SET, with the five non-reference exact rows named and reasoned. */
const NOT_A_REFERENCE = Object.freeze({
  'institutions[].name': 'the roster itself',
  'economicState.activeChains[].label': 'a chain LABEL, report-only on removal by declared rule',
  'spatialLayout.quarters[].landmarks[]': 'a HAYSTACK districtProfile stem-matches',
  'npcs[].secondaryAffiliation': 'a FREE vocabulary shared with faction names',
  'factions[].members[].secondaryAffiliation': 'the member mirror of that same vocabulary',
});
const REFERENCE_ROWS = INSTITUTION_RENAME_SURFACES
  .filter((row) => row.match === 'exact' && !Object.hasOwn(NOT_A_REFERENCE, row.path));

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

function keySetOf(node, out = new Set(), prefix = '') {
  if (Array.isArray(node)) { for (const item of node) keySetOf(item, out, `${prefix}[]`); return out; }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) { out.add(`${prefix}.${key}`); keySetOf(node[key], out, `${prefix}.${key}`); }
  }
  return out;
}

/** The three exploitation arms PARTITION their parent chain list. */
function partitionHolds(save) {
  const parent = valuesAt(save, 'resourceAnalysis.resourceChains[].processingInstitutions[]').length;
  const arms = ['fullyExploited', 'partiallyExploited', 'unexploited']
    .reduce((sum, key) => sum + valuesAt(save, `resourceAnalysis.exploitation.${key}[].processingInstitutions[]`).length, 0);
  return parent === arms;
}

/**
 * Extract every parenthetical string literal the generator spells, ANCHORED on
 * `addCrimeService`'s declaration: the anchor is the liveness proof (a scan that
 * cannot find its anchor has gone empty and must refuse), and the extraction is
 * file-wide because the sentinels have several writer shapes in this one file.
 * Returns null when the anchor is absent, so the caller can name that failure
 * apart from an empty extraction.
 */
function generatorSentinels(source) {
  if (source.indexOf(ANCHOR) < 0) return null;
  return new Set([...source.matchAll(/'(\([^']*\))'/g)].map((match) => match[1]));
}

/** @type {Array<{ key: string, save: any, worst: string }>} */
const worlds = [];

beforeAll(() => {
  const rows = goldenCorpus().filter((_, index) => index % SAMPLE_STEP === 0).slice(0, SAMPLE_SIZE);
  for (const row of rows) {
    const { _seed, ...config } = row;
    const save = reloaded(generateSettlementPipeline(config, null, { seed: _seed, customContent: {} }));
    if (!rosterOf(save).length) continue;
    worlds.push({ key: `${config.settType}|${config.culture}|${config.terrainOverride}`, save, worst: worstCaseHouse(save) });
  }
}, 300000);

describe('institution removal: the sweep over the declared cascade list', () => {
  it('A4 the removal sweeps the same list, adds zero new dangling joins, and fires every declared kind', () => {
    expect(worlds.length, 'the sample generated no worlds at all').toBe(SAMPLE_SIZE);
    const kindsFired = new Set();
    const declaredKinds = new Set(INSTITUTION_RENAME_SURFACES.map((row) => row.removal).filter((kind) => kind !== 'report-only'));
    let baselineDangles = 0;
    let newDangles = 0;
    let partitionBefore = 0;
    let partitionRenamed = 0;
    let partitionRemoved = 0;
    let handlesAfter = 0;
    const sentinelSeen = new Map();
    let sentinelOutside = 0;
    for (const world of worlds) {
      const base = reloaded(world.save);
      const baseline = danglingJoins(base);
      baselineDangles += baseline;
      if (partitionHolds(base)) partitionBefore += 1;
      for (const row of INSTITUTION_RENAME_SURFACES) {
        if (!row.path.startsWith('availableServices.')) continue;
        for (const value of valuesAt(base, row.path)) {
          const held = value.trim();
          if (!held.startsWith('(')) continue;
          if (SENTINELS.has(held)) sentinelSeen.set(held, (sentinelSeen.get(held) || 0) + 1);
          else sentinelOutside += 1;
        }
      }
      const renamed = reloaded(world.save);
      applyInstitutionRenameToSettlement(renamed, world.worst, 'The Amber Concord Hall');
      if (partitionHolds(renamed)) partitionRenamed += 1;

      const removed = reloaded(world.save);
      const result = applyInstitutionRemovalToSettlement(removed, world.worst);
      for (const path of result.touched) {
        const row = INSTITUTION_RENAME_SURFACES.find((candidate) => candidate.path === path);
        if (row) kindsFired.add(row.removal);
      }
      handlesAfter += REFERENCE_ROWS.reduce((sum, row) => sum + valuesAt(removed, row.path).filter((value) => value.trim() === world.worst).length, 0);
      newDangles += Math.max(0, danglingJoins(removed) - baseline);
      if (partitionHolds(removed)) partitionRemoved += 1;
    }
    const live = [...sentinelSeen.entries()].sort();
    const dark = SERVICE_PROVENANCE_SENTINELS.filter((spelling) => !sentinelSeen.has(spelling));
    process.stdout.write(`\n[A4] kinds fired: ${[...kindsFired].sort().join(', ')}\n`);
    process.stdout.write(`[A4] reference-set dangles: baseline ${baselineDangles}, new ${newDangles}; partition ${partitionBefore}/${partitionRenamed}/${partitionRemoved} of ${worlds.length}\n`);
    process.stdout.write(`[A4] sentinels live ${live.length} ${JSON.stringify(live)}; dark ${dark.length} ${JSON.stringify(dark)}; outside the declared list ${sentinelOutside}\n`);
    expect([...kindsFired].sort(), 'a declared removal kind never fired over the whole sample, so the rule is dead').toEqual([...declaredKinds].sort());
    expect(handlesAfter, 'a reference row still spells the removed house name after the sweep').toBe(0);
    expect(newDangles, 'the removal minted a dangling reference join the record did not carry').toBe(0);
    expect(baselineDangles, 'the pre-existing reference-set dangle baseline is a finding: it is zero').toBe(0);
    expect([partitionBefore, partitionRenamed, partitionRemoved], 'the three exploitation arms stopped partitioning their parent').toEqual([worlds.length, worlds.length, worlds.length]);

    // (iv) FIX-D5's CONTROL: the denominator excludes a sentinel BY THE DECLARED LIST.
    expect(sentinelOutside, 'a parenthetical provenance value falls outside the declared eleven, so the dangle denominator would count it as a house').toBe(0);
    expect(live.length, 'anti-vacuity: no declared sentinel was observed at all, so the split proves nothing').toBeGreaterThanOrEqual(2);
    expect(live.length + dark.length, 'the live and dark halves must account for every declared spelling').toBe(SERVICE_PROVENANCE_SENTINELS.length);

    // (v) THE SET-EQUALITY ARM: the generator's own literals against the domain's declared list.
    // The anchor is the anti-vacuity half; the extraction it guards is FILE-WIDE, because a
    // third-argument read reaches only seven of the eleven (packet version 8, judgment 183).
    const source = readFileSync(SERVICES_SOURCE, 'utf8');
    const extracted = generatorSentinels(source);
    expect(extracted, `the anchor ${ANCHOR} was NOT FOUND in servicesGenerator.js: a silent source scan is the defect class this arm exists to refuse`).not.toBeNull();
    process.stdout.write(`[A4] anchored file-wide extraction: ${extracted.size} distinct parenthetical literals\n`);
    expect(extracted.size, 'the anchored extraction returned fewer than eleven literals, so it read almost nothing').toBeGreaterThanOrEqual(11);
    expect([...extracted].filter((spelling) => !SENTINELS.has(spelling)).sort(),
      'the generator writes a parenthetical sentinel SERVICE_PROVENANCE_SENTINELS does not declare').toEqual([]);
    expect(SERVICE_PROVENANCE_SENTINELS.filter((spelling) => !extracted.has(spelling)).sort(),
      'SERVICE_PROVENANCE_SENTINELS declares a spelling the generator no longer writes: a retired spelling rotting in a frozen list').toEqual([]);
  });

  it('A5 the orphan report is a report with two kinds, and the path it reads is resolved from the ledger', () => {
    const readable = NON_CASCADED_SURFACES.filter((row) => row.kind === 'matched-pattern' && row.readable);
    expect(readable.map((row) => row.path), 'EXACTLY ONE non-cascaded row is readable: a second reader is a decision the chair grants').toHaveLength(1);
    const processorPath = readable[0].path;
    const labelRow = INSTITUTION_RENAME_SURFACES.find((row) => row.removal === 'report-only');
    expect(labelRow?.path, 'no cascade row declares report-only, so the second orphan kind has no home').toBeTruthy();

    const counts = { 'chain-lost-its-last-processor': 0, 'chain-label-names-a-removed-house': 0 };
    const badPaths = [];
    const badKinds = [];
    const labelDeleted = [];
    const refusedToChange = [];
    const labelKeptWithSurvivor = [];
    for (const world of worlds) {
      const base = reloaded(world.save);
      const removed = reloaded(world.save);
      const result = applyInstitutionRemovalToSettlement(removed, world.worst);
      if (!result.changed) refusedToChange.push(world.key);
      for (const note of result.orphaned) {
        counts[note.kind] = (counts[note.kind] || 0) + 1;
        if (!Object.hasOwn(counts, note.kind)) badKinds.push(`${world.key}: ${note.kind}`);
        const wanted = note.kind === 'chain-lost-its-last-processor' ? processorPath : labelRow.path;
        if (note.path !== wanted) badPaths.push(`${world.key}: ${note.kind} carried ${note.path}`);
      }
      // (ii) THE LABEL IS NOT DELETED: row 24 is report-only and the chain keeps its label.
      if (valuesAt(removed, labelRow.path).length !== valuesAt(base, labelRow.path).length) labelDeleted.push(world.key);
      if (result.orphaned.some((note) => note.kind === 'chain-label-names-a-removed-house')
        && !valuesAt(removed, labelRow.path).some((value) => value.trim() === world.worst)) labelKeptWithSurvivor.push(world.key);
      // ⛔ THE READ IS A READ: the non-cascaded processor list is byte-identical after the sweep.
      if (JSON.stringify(valuesAt(removed, processorPath)) !== JSON.stringify(valuesAt(base, processorPath))) badPaths.push(`${world.key}: the readable path was WRITTEN`);
    }
    process.stdout.write(`\n[A5] orphan notes over ${worlds.length} removals: ${JSON.stringify(counts)}\n`);
    expect(counts['chain-lost-its-last-processor'], 'anti-vacuity: the first orphan kind never fired over the sample').toBeGreaterThan(0);
    expect(counts['chain-label-names-a-removed-house'], 'anti-vacuity: the second orphan kind never fired over the sample').toBeGreaterThan(0);
    expect(badKinds, 'an orphan note carried a kind outside the closed vocabulary of two').toEqual([]);
    expect(badPaths, 'an orphan note spelled a path instead of resolving it, or the readable path was written').toEqual([]);
    expect(labelDeleted, 'a removal deleted a chain label: row 24 is report-only and the label STANDS').toEqual([]);
    expect(labelKeptWithSurvivor, 'a label orphan note fired without the label still naming the removed house').toEqual([]);
    expect(refusedToChange, 'the sweep refused rather than completing: a writer that refuses is a STOP').toEqual([]);
  });

  it('A6 the removal touches nothing it must not touch, and a name no record holds is a no-op', () => {
    const nonCascadedMoved = [];
    const keyGained = [];
    const noOpMoved = [];
    const siblingLost = [];
    for (const world of worlds) {
      const base = reloaded(world.save);
      const removed = reloaded(world.save);
      const beforeKeys = keySetOf(removed);
      const sibling = rosterOf(base).find((name) => name !== world.worst) || null;
      applyInstitutionRemovalToSettlement(removed, world.worst);
      if (sibling && !rosterOf(removed).includes(sibling)) siblingLost.push(`${world.key}: ${sibling}`);
      for (const row of NON_CASCADED_SURFACES) {
        if (JSON.stringify(valuesAt(removed, row.path)) !== JSON.stringify(valuesAt(base, row.path))) nonCascadedMoved.push(`${world.key}: ${row.path}`);
      }
      for (const key of keySetOf(removed)) if (!beforeKeys.has(key)) keyGained.push(`${world.key}: ${key}`);

      const absent = reloaded(world.save);
      const result = applyInstitutionRemovalToSettlement(absent, 'A House This Record Has Never Held');
      if (result.changed || result.touched.length || result.orphaned.length || JSON.stringify(absent) !== JSON.stringify(base)) noOpMoved.push(world.key);
    }
    expect(siblingLost, 'removing one house dropped a sibling house').toEqual([]);
    expect(nonCascadedMoved, 'a declared NON_CASCADED path moved under a removal').toEqual([]);
    expect(keyGained, 'the removal minted a key the record did not carry: the rule is the record own absence shape, never a null').toEqual([]);
    expect(noOpMoved, 'removing a name no record holds reported a change or mutated the record').toEqual([]);
  });

  it('A7 the immutable removal form returns only touched buckets, never mutates, and carries the same notes', () => {
    const mutated = [];
    const touchedDiffer = [];
    const orphanDiffer = [];
    const sharedBucket = [];
    for (const world of worlds) {
      const pristine = JSON.stringify(world.save);
      const inPlace = reloaded(world.save);
      const direct = applyInstitutionRemovalToSettlement(inPlace, world.worst);
      const result = institutionRemovalChanges(world.save, world.worst);
      if (JSON.stringify(world.save) !== pristine) mutated.push(world.key);
      if (JSON.stringify(result.touched) !== JSON.stringify(direct.touched)) touchedDiffer.push(world.key);
      if (JSON.stringify(result.orphaned) !== JSON.stringify(direct.orphaned)) orphanDiffer.push(world.key);
      for (const bucket of Object.keys(result.changes)) if (result.changes[bucket] === world.save[bucket]) sharedBucket.push(`${world.key}: ${bucket}`);
    }
    expect(mutated, 'the immutable form mutated the settlement it was handed').toEqual([]);
    expect(touchedDiffer, 'the immutable form reports a different touched set from the in-place form').toEqual([]);
    expect(orphanDiffer, 'the immutable form reports different orphan notes from the in-place form').toEqual([]);
    expect(sharedBucket, 'a returned bucket is the caller own object rather than a clone').toEqual([]);
  });
});
