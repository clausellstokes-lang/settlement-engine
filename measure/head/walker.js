/**
 * tests/lint/proseWiringCensus.walker.test.js — INSTR-912 car 8's gate.
 *
 * WHAT IT PROVES. The wiring census (`src/domain/prose/wiringCensus.js`) recovers, per
 * (block, pool), the PREDICATE that selects the pool, the READINGS that predicate consults
 * and the SLOTS the composer's bag fills — from the composers' source, never from the pool's
 * own name. It then reads the same rows the other way: fact → the pools, variants and
 * grammars that can speak to it, sorted into MISSING · THIN · COVERED for the authoring wave.
 *
 * ── WHY EVERY ARM HERE CARRIES A CONTROL THAT MUST FIRE ─────────────────────────────
 * A census is the easiest instrument in the estate to make vacuous: report `[]`, report a
 * clean bill, and be believed. So every arm is proved on a fixture built to break it, in
 * PAIRS wherever the arm is a negative — the mutation must red and the cure must green, or
 * the arm measures as little as one that reds on everything.
 *
 * ── WHAT IT DOES NOT DO ─────────────────────────────────────────────────────────────
 * It gates NOTHING about the corpus. Every corpus figure below is REPORT-ONLY except the
 * three structural identities (the census covers every pool exactly once; the variant
 * arithmetic closes; both statuses occur). A pool the census cannot resolve is
 * WIRING-UNRESOLVED with its reason — a finding for the chair, never a defect asserted
 * against the corpus, and never a guess.
 *
 * @enforced-by npx vitest run tests/lint/proseWiringCensus.walker.test.js
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  absenceOf, attachSets, censusIndex, censusSummary, CIVIC_OBJECT_CLASSES, cleanPredicate,
  coOccurringPairs, COVERT_SOURCES, customReachable, decorateRows, factBudget, factIndex,
  isCovertPath, moduleKeyTables, narrowedReads, objectClassOf, poolKeyFunctions, rootOf,
  stringLiterals, tierRows, TIERS, wiringCensus, WIRING_STATUS,
} from '../../src/domain/prose/wiringCensus.js';
import {
  aliasDraft, aliasKey, buildCensus, censusCheck, CENSUS_JSON, draftSources, EVIDENCE_ORDER,
  factMounts, producerIndex, relationsFromSitting, relationTable, serialise, wilsonBp,
  wilsonFloorCount,
} from '../../scripts/wiring-census.mjs';
// ⛔ THE SHIPPED RULE, IMPORTED, NEVER RE-SPELLED HERE (car 0e). The first cut of the per-tier
// arm kept a second copy of the silence rule in this file, so the fixture proved the copy and
// the corpus figure proved the script, and nothing tied the two together. The estate's idiom
// is the walker importing the scanner, which is how the census's own readers arrive above.
import { tierSilences as tierSilencesOf } from '../../scripts/prose-rate-corpus.mjs';
import { DOSSIER_MOUNTS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { walkEntry, walkPair } from '../../src/domain/prose/entryWalker.js';
import { walkGrammar } from '../../src/domain/prose/grammarWalker.js';
import { UNMOUNTED_BLOCKS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { loadStateLeaves, poolCells, ROOT } from '../helpers/dossierCorpus.js';
import {
  composedFillByBlock, composedFillByKeyFunction, composerSources, fillSites, unrenderedFacts,
} from '../helpers/dossierComposedFill.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import {
  COMPOSER_COVERT_SOURCE, COMPOSER_DEEP_PATH, COMPOSER_DEFAULTING_READ,
  COMPOSER_DEFAULTING_READ_GUARDED, COMPOSER_DOUBLE_QUOTED_KEY,
  COMPOSER_DOUBLE_QUOTED_KEY_REMOVED, COMPOSER_FOUR_BRANCHES, COMPOSER_NUMERIC_KEY,
  COMPOSER_BRANCH_FLAT, COMPOSER_BRANCH_GRAIN,
  COMPOSER_ONE_BRANCH, COMPOSER_PAIR_TABLE, COMPOSER_POLARITY,
  COMPOSER_PREDICATE_OVER_UNREAD, COMPOSER_TABLE, COMPOSER_TEMPLATE, COMPOSER_TWO_BRANCHES,
  firingsByTier, firingsCoFiring, MARKED_ON_A_COVERT_PATH, NAMES_AN_UNFILLED_SLOT,
  NAMES_ONLY_FILLED_SLOTS, SETTLEMENT_ONLY, UNMARKED_ON_A_COVERT_PATH,
} from '../fixtures/wiringFixtures.js';

/** Build the block → pool → variants table the census takes, from the R1 leaves. */
function poolTableOf(leaves) {
  /** @type {Map<string, Map<string, Array<{text: string, slots: string[]}>>>} */
  const table = new Map();
  for (const e of leaves) {
    if (!table.has(e.block)) table.set(e.block, new Map());
    const block = table.get(e.block);
    if (!block) continue;
    if (!block.has(e.pool)) block.set(e.pool, []);
    (block.get(e.pool) || []).push({ text: e.text, slots: e.slots });
  }
  return table;
}

/** One fixture census, from a composer source and a hand-written pool table. */
function fixtureCensus(source, pools, extra = {}) {
  return wiringCensus({
    sources: new Map([['fixture/composer.js', source]]),
    pools,
    ...extra,
  });
}

/** @param {Array<[string, Array<[string, ReadonlyArray<{text: string, slots?: string[]}>]>]>} spec */
function poolsFrom(spec) {
  return new Map(spec.map(([block, entries]) => [block, new Map(entries)]));
}

const leaves = await loadStateLeaves();
const poolTable = poolTableOf(leaves);
const sites = fillSites();
const fillByBlock = new Map([...composedFillByBlock(sites)].map(([b, r]) => [b, r.slots]));
const census = wiringCensus({
  sources: composerSources(),
  pools: poolTable,
  fill: fillByBlock,
  fillByKeyFunction: composedFillByKeyFunction(sites),
  unmounted: UNMOUNTED_BLOCKS,
});
const held = [...new Set(unrenderedFacts().flatMap((r) => r.held))];
const summary = censusSummary(census.rows, held);

describe('the wiring census — TOTALITY over the corpus', () => {
  test('every (block, pool) the loaders enumerate has exactly ONE census row', () => {
    const cells = poolCells(leaves.filter((e) => e.register === 'R1'));
    // The loaders' own pool count, and the census's, as INTEGERS. `> 0` would pass a census
    // that covered one pool of seven hundred.
    expect(cells.size, 'the R1 loaders enumerate this many pool cells').toBe(708);
    expect(census.rows.length, 'and the census carries exactly one row for each').toBe(708);
    const ids = new Set(census.rows.map((r) => `${r.block} :: ${r.pool}`));
    expect(ids.size, 'no (block, pool) is counted twice').toBe(708);
    expect(new Set(census.rows.map((r) => r.block)).size, 'over the leaves\' 68 blocks').toBe(68);
  });

  test('the VARIANT column closes, and reproduces the histogram the owner\'s ruling sizes', () => {
    // ⭐ THE OWNER RULED (2026-09-07 ~21:50) that every semantic variant gets a family of
    // FOUR wordings and nothing is ever trimmed. That makes the variant count per pool a
    // first-class column of this census, because it is what the authoring wave is priced on.
    expect(summary.variants, 'the R1 corpus holds this many variants').toBe(2266);
    // THE MEAN IS THE CALLER'S TO FORMAT (INSTR-912 car 11). The census publishes `variants`
    // and `total` as integers; a `toFixed` inside `src/domain/prose/` is a float
    // interpolation and a two-decimal score against the estate's prose-numerics register, and
    // the module has no reader to format for. The arm keeps its full force — the same two
    // decimal places over the same two integers — computed here.
    expect((summary.variants / summary.total).toFixed(2), 'mean variants per pool').toBe('3.20');
    expect(Object.fromEntries(summary.variantHistogram), 'variants per pool, exactly').toEqual({
      2: 33, 3: 547, 4: 96, 5: 17, 6: 15,
    });
    const summed = summary.variantHistogram.reduce((total, [size, pools]) => total + size * pools, 0);
    expect(summed, 'and the histogram sums back to the corpus').toBe(2266);
    // PER PIECE: the same count rolled up to the block, which is the unit a reader meets.
    const perBlockTotal = summary.perBlock.reduce((total, [, n]) => total + n, 0);
    expect(perBlockTotal, 'the per-block roll-up carries every variant once').toBe(2266);
    expect(summary.perBlock.length, 'across every block').toBe(68);
  });

  test('ANTI-VACUITY: the corpus census carries BOTH statuses, in measured integers', () => {
    // A census that resolved nothing and a census that resolved everything are both useless
    // and both look healthy from a distance. The arm pins the split.
    expect(summary.resolved, 'pools that reached a recovery RUNG').toBe(318);
    expect(summary.unresolved, 'pools reported WIRING-UNRESOLVED with a reason').toBe(390);
    expect(summary.resolved + summary.unresolved, 'and the two exhaust the census').toBe(summary.total);
    expect(summary.resolved, 'zero resolved rows would mean the reader is dark').toBeGreaterThan(0);
    expect(summary.unresolved, 'zero unresolved rows would mean it is guessing').toBeGreaterThan(0);
    for (const row of census.rows) {
      if (row.status === WIRING_STATUS.UNRESOLVED) expect(row.reason.length, `${row.block} :: ${row.pool} must carry its reason`).toBeGreaterThan(0);
    }
  });

  test('"RESOLVED" IS NOT "RECOVERED": the two narrower integers ship beside it', () => {
    // ⛔ THE FALSE GREEN THIS ARM EXISTS TO FORECLOSE (INSTR-912 car 10, cure 2). At the
    // pre-cure tip the receipt, this file's own assertion message and the wave's tier table
    // all read "RESOLVED 310" as "the selecting predicate was recovered", and 143 of those
    // 310 carried `predicate: []`. `resolved` counts a RUNG REACHED; these two count what was
    // read. Sweep plant #84 makes the pair non-vacuous by execution: the literal rung
    // returning `predicate: []` unconditionally reds these two and leaves the split above
    // green, which is exactly the blindness plant #80 cannot see.
    expect(summary.resolvedWithPredicate, 'RESOLVED rows carrying at least one predicate row').toBe(185);
    expect(summary.resolvedWithCleanPredicate, 'and of those, every row a readable comparison').toBe(185);
    expect(summary.resolvedWithPredicate, 'a rung reached is never fewer than a predicate read')
      .toBeLessThanOrEqual(summary.resolved);
    expect(summary.resolvedWithCleanPredicate).toBeLessThanOrEqual(summary.resolvedWithPredicate);
    // THE RULE ITSELF, driven in both directions on a fixture, so the integers above are not
    // the only thing standing between the estate and a predicate made of source code.
    expect(cleanPredicate([{ field: 'readings.reading.mood', op: '===', value: 'calm' }])).toBe(true);
    expect(cleanPredicate([{ field: 'reading.rungs.length', op: '===', value: '0) return null; if (x' }]),
      'the exact shape the leftmost-`if` reader produced').toBe(false);
    expect(cleanPredicate([]), 'nothing recovered is not clean recovery').toBe(false);
  });
});

describe('the census printed BESIDE the composed-fill census (report-only)', () => {
  test('one table, and the join between them is total', () => {
    const rungs = census.rows.reduce((m, r) => m.set(r.rung, (m.get(r.rung) || 0) + 1), new Map());
    const unmounted = new Set(UNMOUNTED_BLOCKS);
    const lines = [
      'WIRING CENSUS · beside the composed-fill census · R1 at this tip',
      `  pools ${summary.total} · RESOLVED ${summary.resolved} · WIRING-UNRESOLVED ${summary.unresolved}`,
      `  of the RESOLVED: carrying a predicate row ${summary.resolvedWithPredicate} · every row a readable comparison ${summary.resolvedWithCleanPredicate}`,
      `  variants ${summary.variants} · mean/pool ${(summary.variants / summary.total).toFixed(2)} · histogram ${summary.variantHistogram.map(([k, n]) => `${k}->${n}`).join(' ')}`,
      `  recovery rungs: ${[...rungs].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ')}`,
      `  key functions ${census.functions} (consulted ${census.consulted}) · module key tables ${census.tables}`,
      '  the ten largest UNRESOLVED reasons:',
      ...summary.reasons.slice(0, 10).map(([reason, n]) => `    ${String(n).padStart(4)}  ${reason}`),
      `  slots with NO provider (the block has a bag): ${summary.slotless.length} pools`,
      ...summary.slotless.slice(0, 8).map((r) => `    ${r.block} :: ${r.pool} — {${r.slots.join('}, {')}}`),
      `  pools whose block has NO bag at all (unmounted): ${summary.bagless.length}`,
      `  predicates over a field no composer holds: ${summary.predicatesOverUnreadFields.length}`
        + ` (the table rung's own synthetic labels, counted apart: ${summary.syntheticTableFields})`,
      ...summary.predicatesOverUnreadFields.slice(0, 6).map((r) => `    ${r.block} :: ${r.pool} — ${r.field}`),
      '  status by block (the twelve with the most unresolved):',
      ...summary.byBlock.slice(0, 12).map(([b, c]) => `    ${b.padEnd(12)} resolved ${String(c.resolved).padStart(3)} · unresolved ${String(c.unresolved).padStart(3)}`),
      '  COMPOSED FILL (the sibling census this one sits beside):',
      `    blocks with a composer bag ${fillByBlock.size} of 68 · call sites ${sites.length}`,
    ];
    for (const line of lines) console.log(line);
    // The join: every census row's block either has a bag or is declared unmounted. A block
    // in neither set would mean the two censuses disagree about what the dossier IS.
    const orphans = census.rows
      .filter((r) => !fillByBlock.has(r.block) && !unmounted.has(r.block))
      .map((r) => r.block);
    expect([...new Set(orphans)], 'every block has a bag or is declared unmounted').toEqual([]);
    expect(summary.predicateArmExecutable, 'the unread-field arm ran against car 5\'s held facts').toBe(true);
    // ⛔ THE SUPPORTING FIGURES ARE ASSERTED, NOT PRINTED (car 10, cure 5). The lane's own
    // rule was "every count asserted as an integer" and these four were `console.log` — which
    // is to say they could drift under any rebase and the gate would print the drift.
    expect(summary.slotless.length, 'pools naming a slot the block\'s bag never fills').toBe(65);
    expect(summary.bagless.length, 'pools in a block with no bag at all').toBe(140);
    expect(summary.predicatesOverUnreadFields.length, 'predicates over a field no composer holds').toBe(99);
    expect(summary.syntheticTableFields, 'and the table rung\'s own labels, counted apart').toBe(78);
  });
});

describe('THE CONTROLS — each must fire, and each cure must stop it firing', () => {
  test('(c1) a pool whose key function has no branch selecting it reads WIRING-UNRESOLVED', () => {
    const pools = poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY],
      ['MOOD: restive', SETTLEMENT_ONLY],
    ]]]);
    const both = fixtureCensus(COMPOSER_TWO_BRANCHES, pools);
    const one = fixtureCensus(COMPOSER_ONE_BRANCH, pools);
    const statusOf = (result, key) => (result.rows.find((r) => r.pool === key) || {}).status;
    expect(statusOf(both, 'MOOD: restive'), 'with its branch present the pool resolves').toBe(WIRING_STATUS.RESOLVED);
    expect(statusOf(one, 'MOOD: restive'), 'with the branch struck it is UNRESOLVED, never guessed from the name')
      .toBe(WIRING_STATUS.UNRESOLVED);
    // The SIBLING pool must be unmoved, or the control proved only that the census can break.
    expect(statusOf(one, 'MOOD: calm'), 'and its sibling still resolves').toBe(WIRING_STATUS.RESOLVED);
    const restive = one.rows.find((r) => r.pool === 'MOOD: restive');
    expect(restive?.reason, 'the row says WHY').toMatch(/no pool-key function returns this key/);
    expect(restive?.predicate, 'and infers no predicate').toEqual([]);
  });

  test('(c1b) the predicate that IS recovered is the branch\'s own field, op and value', () => {
    const pools = poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]]);
    const row = fixtureCensus(COMPOSER_TWO_BRANCHES, pools).rows[0];
    expect(row.predicate, 'read off the guard, not off the pool name').toEqual([
      { field: 'readings.reading.mood', op: '===', value: 'calm' },
    ]);
    expect(row.keyFunction).toBe('moodPoolKey');
    expect(row.rung).toBe('literal');
    // The re-rooting is what joins this census to car 5's: the parameter is `reading`, the
    // call site supplies `readings.reading`, and the fact is the caller's path.
    expect(rootOf(row.predicate[0].field)).toBe('readings.reading');
  });

  test('(c1b2) FOUR branches before the literal — each recovers ITS OWN guard, not the first', () => {
    // ⛔ THE CONTROL THE ESTATE NEEDED AND DID NOT HAVE (car 10, cure 1). `COMPOSER_TWO_BRANCHES`
    // has ONE `if` before the matched literal, so a guard reader anchored at the LEFTMOST
    // `if (` read the right guard on it and swallowed four statements on the shipped shape.
    const pools = poolsFrom([['DS-FIX-6', [
      ['TIER: a large share off the books', SETTLEMENT_ONLY],
      ['TIER: significant off-book activity', SETTLEMENT_ONLY],
      ['TIER: minor shadow activity', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_FOUR_BRANCHES, pools).rows;
    const predicateOf = (key) => (rows.find((r) => r.pool === key) || {}).predicate;
    // The ARM the fold names, verbatim: the LAST branch's own field, op and value.
    expect(predicateOf('TIER: minor shadow activity')).toEqual([
      { field: 'safetyProfile.blackMarketCapture', op: '>=', value: '3' },
    ]);
    // AND THE DISCRIMINATION: three branches, three DIFFERENT thresholds. A leftmost reader
    // collapses all three into one blob, so equality across the three is what fails then.
    expect(rows.map((r) => predicateOf(r.pool)[0].value), 'each tier keeps its own threshold')
      .toEqual(['30', '15', '3']);
    expect(rows.every((r) => cleanPredicate(r.predicate)), 'and none is a code fragment').toBe(true);
    // The one-branch control stays beside it, so BOTH shapes are exercised, not one.
    expect(fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]])).rows[0].predicate)
      .toEqual([{ field: 'readings.reading.mood', op: '===', value: 'calm' }]);
  });

  test('(c1d) a fact spoken to by a DEEPER path, or by a guard that did not parse, is not MISSING', () => {
    // Cure 3's arm: the two independent faults that overstated MISSING by 41 %.
    const pools = poolsFrom([['DS-FIX-7', [
      ['POSTURE: net exporter', SETTLEMENT_ONLY],
      ['DRIFT: stalled', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_DEEP_PATH, pools).rows;
    const posture = rows.find((r) => r.pool === 'POSTURE: net exporter');
    const drift = rows.find((r) => r.pool === 'DRIFT: stalled');
    expect(posture?.predicate, 'the predicate names the DEEPER path').toEqual([
      { field: 'readings.exportPosture.status', op: '===', value: 'net exporter' },
    ]);
    expect(drift?.predicate, 'a regex guard yields no comparison row — correctly').toEqual([]);
    expect(drift?.fieldsRead, 'but the fact it READS is on the row').toContain('readings.flowDrift.label');
    const held = ['readings.exportPosture', 'readings.flowDrift'];
    const missingWith = tierRows({ rows, held }).filter((t) => t.tier === TIERS.MISSING).map((t) => t.subject);
    const missingWithout = tierRows({ rows: [], held }).filter((t) => t.tier === TIERS.MISSING).map((t) => t.subject);
    // PRESENT-THEN-ABSENT, both facts, on the same held list: MISSING when no pool speaks to
    // them, silent when these pools do.
    expectPresentThenAbsent(missingWithout, missingWith, 'readings.exportPosture', 'the deeper-path fact');
    expectPresentThenAbsent(missingWithout, missingWith, 'readings.flowDrift', 'the unparsed-guard fact');
  });

  test('(c1e) a PAIR-ARRAY key table is rung three, and a key it does not name is not', () => {
    const key = 'STABILITY: critical matched';
    const pools = poolsFrom([['DS-FIX-8', [
      [key, SETTLEMENT_ONLY], ['STABILITY: nothing matched', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_PAIR_TABLE, pools).rows;
    const hit = rows.find((r) => r.pool === key);
    expect(hit?.rung, 'the `[[value, key], …]` shape reaches the table rung').toBe('table');
    expect(hit?.predicate[0].value, 'and the pair\'s own first element is the value').toBe('critical');
    expect(rows.find((r) => r.pool === 'STABILITY: nothing matched')?.status,
      'a key the table does not name gains nothing').toBe(WIRING_STATUS.UNRESOLVED);
    expect(moduleKeyTables(COMPOSER_PAIR_TABLE)[0].shape).toBe('pairs');
    expect(moduleKeyTables(COMPOSER_TABLE)[0].shape, 'and the object shape still reads as itself').toBe('object');
    // PRESENT-THEN-ABSENT on the shape reader: a composer carrying only the OBJECT shape
    // cannot see this key, so the pair reader is what resolved it and not a looser match.
    const objectOnly = fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-8', [[key, SETTLEMENT_ONLY]]]])).rows;
    expectPresentThenAbsent(
      objectOnly.filter((r) => r.status === WIRING_STATUS.UNRESOLVED).map((r) => r.pool),
      rows.filter((r) => r.status === WIRING_STATUS.UNRESOLVED).map((r) => r.pool),
      key,
      'the pair-array shape reader',
    );
  });

  test('(c1f) a DOUBLE-quoted key is a key, and its apostrophe eats nothing after it', () => {
    const patron = 'NICHE: the patron\'s niche carries a contestant';
    const keys = [patron, 'NICHE: every niche uncontested', 'NICHE: no ranks were recorded'];
    const spec = poolsFrom([['DS-FIX-9', keys.map((k) => [k, SETTLEMENT_ONLY])]]);
    const withKey = fixtureCensus(COMPOSER_DOUBLE_QUOTED_KEY, spec).rows;
    const struck = fixtureCensus(COMPOSER_DOUBLE_QUOTED_KEY_REMOVED, spec).rows;
    // THE APOSTROPHE HALF: both keys written AFTER the double-quoted one resolve. Under a
    // single-quote regex scanner the apostrophe opened a phantom string and ate both.
    for (const key of keys.slice(1)) {
      expect(withKey.find((r) => r.pool === key)?.status, `${key} survives the apostrophe`).toBe(WIRING_STATUS.RESOLVED);
      expect(struck.find((r) => r.pool === key)?.status, `${key} resolves without it too`).toBe(WIRING_STATUS.RESOLVED);
    }
    // THE DOUBLE-QUOTE HALF, present-then-absent: the key resolves where the composer writes
    // it and is UNRESOLVED where it does not — so the scanner reads a key, not every string.
    expectPresentThenAbsent(
      withKey.filter((r) => r.status === WIRING_STATUS.RESOLVED).map((r) => r.pool),
      struck.filter((r) => r.status === WIRING_STATUS.RESOLVED).map((r) => r.pool),
      patron,
      'the double-quoted key',
    );
    // THE SCANNER ITSELF, driven on all three quote characters at once.
    expect(stringLiterals('const a = "x\'y"; const b = \'z\'; const c = `t`;').map((l) => `${l.kind}:${l.text}`))
      .toEqual(['double:x\'y', 'single:z', 'template:t']);
  });

  test('(c1c) rungs TWO and THREE recover a predicate the literal rung cannot see', () => {
    const template = fixtureCensus(COMPOSER_TEMPLATE, poolsFrom([['DS-FIX-3', [['posture peace', SETTLEMENT_ONLY]]]]));
    expect(template.rows[0].rung, 'a template binds the pool name\'s tail to the field').toBe('template');
    expect(template.rows[0].predicate).toEqual([{ field: 'war.status', op: '===', value: 'peace' }]);
    const table = fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-4', [['TERRAIN: Coastal', SETTLEMENT_ONLY]]]]));
    expect(table.rows[0].rung, 'a module-level key table is rung three').toBe('table');
    expect(table.rows[0].predicate[0].value, 'and the map\'s own key is the value').toBe('coastal');
    // A key NEITHER names is unresolved — the two rungs add reach, they do not add guessing.
    const miss = fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-4', [['TERRAIN: Marsh', SETTLEMENT_ONLY]]]]));
    expect(miss.rows[0].status).toBe(WIRING_STATUS.UNRESOLVED);
  });

  test('(c2) a variant naming a slot the bag never fills is a FINDING, not a crash', () => {
    const before = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', NAMES_AN_UNFILLED_SLOT]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    });
    const after = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', NAMES_ONLY_FILLED_SLOTS]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    });
    expectPresentThenAbsent(
      before.rows[0].slotsWithoutProvider,
      after.rows[0].slotsWithoutProvider,
      'seat',
      'the unprovided slot',
    );
    expect(before.rows[0].slotsFilled, 'the bag itself is unchanged between the two').toEqual(after.rows[0].slotsFilled);
    expect(censusSummary(before.rows, []).slotless.length, 'and the summary counts the pool once').toBe(1);
    expect(censusSummary(after.rows, []).slotless.length, 'and none once the slot is cured').toBe(0);
  });

  test('(c3) a predicate over a field no composer holds is a finding', () => {
    const pools = poolsFrom([['DS-FIX-5', [['DRIFT: yes', SETTLEMENT_ONLY]]]]);
    const drifted = fixtureCensus(COMPOSER_PREDICATE_OVER_UNREAD, pools);
    expect(drifted.rows[0].predicate, 'the guard IS recovered — the control is about its ROOT, not about reading it')
      .toEqual([{ field: 'ledger.ghostField', op: '===', value: 'yes' }]);
    // With `held` supplied and the root missing from it, the arm names the row. Name the
    // root as held and the same row goes quiet: one fixture, both halves of the pair.
    const named = censusSummary(drifted.rows, ['readings.reading']);
    const licensed = censusSummary(drifted.rows, ['readings.reading', rootOf(drifted.rows[0].predicate[0].field)]);
    const blind = censusSummary(drifted.rows, undefined);
    expect(named.predicateArmExecutable, 'held facts supplied').toBe(true);
    expect(blind.predicateArmExecutable, 'none supplied').toBe(false);
    expect(blind.predicatesOverUnreadFields.length, 'and the blind arm asserts nothing').toBe(0);
    expect(named.predicatesOverUnreadFields.length, 'the drifting predicate is named').toBe(1);
    expect(licensed.predicatesOverUnreadFields.length, 'and named as held it is not').toBe(0);
    // ⛔ AND THE ARM MUST NOT COUNT ITS OWN LABEL (car 10, cure 4). The table rung writes the
    // SAME synthetic string into `predicate[].field` and `fieldsRead`; its `rootOf` is the
    // whole string, so every table row was reported as a predicate over an unheld field BY
    // CONSTRUCTION — 74 of the shipped 158.
    expect(summary.predicatesOverUnreadFields.filter((r) => r.rung === 'table'),
      'no table row is a finding of this arm').toHaveLength(0);
    // NON-BLIND: on a census carrying BOTH a table row and a literal-rung predicate over an
    // unheld field, the literal one IS named. Silence over both would be the vacuous cure.
    const mixed = fixtureCensus(COMPOSER_PAIR_TABLE, poolsFrom([['DS-FIX-8', [['STABILITY: critical matched', SETTLEMENT_ONLY]]]])).rows
      .concat(drifted.rows);
    const both = censusSummary(mixed, ['readings.reading']);
    expect(both.predicatesOverUnreadFields.map((r) => r.rung), 'the literal rung is still named').toEqual(['literal']);
    expect(both.syntheticTableFields, 'and the table rung\'s own labels are counted, never dropped in silence').toBe(1);
  });

  test('(d) the ANTI-VACUITY arm reds on a fixture built to hold both, and can tell them apart', () => {
    const mixed = fixtureCensus(COMPOSER_ONE_BRANCH, poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY],
      ['MOOD: restive', SETTLEMENT_ONLY],
    ]]]));
    const mixedSummary = censusSummary(mixed.rows, []);
    expect(mixedSummary.resolved, 'the fixture was built to hold one of each').toBe(1);
    expect(mixedSummary.unresolved).toBe(1);
    const allResolved = censusSummary(fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY], ['MOOD: restive', SETTLEMENT_ONLY],
    ]]])).rows, []);
    expect(allResolved.unresolved, 'a census with nothing unresolved is a DIFFERENT reading').toBe(0);
    const allUnresolved = censusSummary(fixtureCensus('export function nothingPoolKey() { return null; }', poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY],
    ]]])).rows, []);
    expect(allUnresolved.resolved, 'and one with nothing resolved is a third').toBe(0);
  });

  test('(e) THE FENCE: no src/ file outside the ISLAND names any of its ELEVEN modules', () => {
    // ⛔ WIDENED FROM ONE MODULE TO TEN (INSTR-912 car 10, cure 10; FOLD-2 hazard H8). The
    // arm fenced `wiringCensus` alone, so a §913 or wave car could wire `entryWalker`,
    // `grammarWalker`, `moveGrammar`, `presenceMeasure`, `plantLedger`, `proseFingerprint`,
    // `entryGround`, `entryLexicons` or `institutionTable` into a product surface and NO GATE
    // WOULD SAY SO. The island is cheapest to fence before the merge, not after.
    const ISLAND = [
      'src/domain/prose/entryGround.js',
      'src/domain/prose/entryLexicons.js',
      'src/domain/prose/entryWalker.js',
      'src/domain/prose/grammarWalker.js',
      'src/domain/prose/moveGrammar.js',
      'src/domain/prose/plantLedger.js',
      'src/domain/prose/presenceMeasure.js',
      'src/domain/prose/proseFingerprint.js',
      // THE ELEVENTH, ADDED BY ARCH CAR 0e. The branch reader is a scanner the census module
      // could not hold under its 800-effective-line ceiling, and car 0's refusal 1 named this
      // exact shape as the honest one. It is fenced the moment it lands rather than after.
      'src/domain/prose/wiringBranch.js',
      'src/domain/prose/wiringCensus.js',
      'src/domain/institutions/institutionTable.js',
    ];
    /** @type {Array<[string, string]>} */
    const files = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const abs = join(dir, name);
        if (statSync(abs).isDirectory()) { walk(abs); continue; }
        if (!/\.(js|jsx|ts|tsx)$/.test(name)) continue;
        files.push([relative(ROOT, abs), readFileSync(abs, 'utf8')]);
      }
    };
    walk(join(ROOT, 'src'));
    expect(files.length, 'the scan read the estate\'s src/ tree, not an empty directory').toBeGreaterThan(500);
    const inIsland = (path) => path.startsWith('src/domain/prose/') || path === 'src/domain/institutions/institutionTable.js';
    /** @type {string[]} */
    const breaches = [];
    for (const path of ISLAND) {
      const module = path.split('/').pop().replace(/\.js$/, '');
      const hits = files.filter(([, text]) => text.includes(module)).map(([p]) => p);
      // A CONTROL PER MODULE: the scan must find each one where it lives, or an empty result
      // outside is the walker failing to read rather than the fence holding.
      expect(hits, `the scan finds ${module} where it lives`).toContain(path);
      for (const hit of hits) if (!inIsland(hit)) breaches.push(`${module} <- ${hit}`);
    }
    expect(breaches, 'no product surface reaches the island').toEqual([]);
    // AND THE INSIDE OF THE ISLAND IS STILL ONE GRAPH, not eleven copies of the same fence:
    // the census names exactly one module of the eleven, so the equality the first cut
    // asserted is kept as the sharpest single case rather than lost inside the loop.
    const censusHits = files.filter(([, text]) => text.includes('wiringCensus')).map(([p]) => p);
    expect(censusHits).toEqual(['src/domain/prose/wiringCensus.js']);
    // AND THE ELEVENTH IS REACHED FROM EXACTLY ONE PLACE INSIDE THE ISLAND, which is the
    // paired positive: a fence that held because nothing imports the module at all would
    // pass this loop and prove nothing.
    const branchHits = files.filter(([, text]) => text.includes('wiringBranch')).map(([p]) => p);
    expect(branchHits).toEqual(['src/domain/prose/wiringBranch.js', 'src/domain/prose/wiringCensus.js']);
  });
});

describe('THE MAP READ THE OTHER WAY — fact → text, and the three tiers', () => {
  test('the fact index inverts the census without losing a pool', () => {
    const facts = factIndex(census.rows);
    expect(facts.length, 'distinct readings a key function conjoins, at this tip').toBe(59);
    const poolsNamed = new Set(facts.flatMap((f) => f.pools));
    const resolvedWithFields = census.rows.filter((r) => r.predicate.length > 0);
    expect(poolsNamed.size, 'every pool with a recovered predicate appears in the inverse')
      .toBe(resolvedWithFields.length);
    for (const f of facts.slice(0, 12)) {
      console.log(`  FACT ${f.fact.slice(0, 52).padEnd(52)} pools ${String(f.pools.length).padStart(3)} · variants ${String(f.variants).padStart(4)} · grammars ${f.grammars}`);
    }
  });

  test('the tiers name the block, the field, the reading function and the COUNT', () => {
    const tiers = tierRows({ rows: census.rows, held });
    const counts = tiers.reduce((m, t) => m.set(t.tier, (m.get(t.tier) || 0) + 1), new Map());
    console.log(`  TIERS · MISSING ${counts.get(TIERS.MISSING)} · THIN ${counts.get(TIERS.THIN)} · COVERED ${counts.get(TIERS.COVERED)}`);
    // ⛔ ALL THREE ARE INTEGERS NOW (INSTR-912 car 10, cure 5). MISSING was the only asserted
    // one; `THIN` and `COVERED` were `console.log` while Part B §18 sized the authoring wave
    // from all three, so two of the three could drift silently under the rebase that H6 says
    // must re-measure everything. MISSING fell 58 → 34 when cure 3 taught the membership test
    // to read `fieldsRead` and to normalise with `rootOf`.
    expect(counts.get(TIERS.MISSING), 'held facts with no pool keyed on them').toBe(34);
    expect(counts.get(TIERS.THIN), 'pools with one variant, one grammar, or {settlement} alone').toBe(483);
    expect(counts.get(TIERS.COVERED), 'and the rest').toBe(225);
    expect(counts.get(TIERS.THIN) + counts.get(TIERS.COVERED), 'every pool lands in one of the two pool tiers')
      .toBe(census.rows.length);
    for (const row of tiers) {
      expect(row.count.length, `${row.tier} ${row.subject} must carry its measurement`).toBeGreaterThan(0);
      expect(typeof row.readingFunction, 'and name the reading function').toBe('string');
    }
    for (const row of tiers.filter((t) => t.tier === TIERS.MISSING).slice(0, 8)) {
      console.log(`    MISSING ${row.subject} — ${row.count}`);
    }
  });

  test('THIN fires on each of its three limbs, and COVERED on none of them', () => {
    const thinOf = (variants) => {
      const rows = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', variants]]]]), {
        fill: new Map([['DS-FIX-1', ['settlement', 'seat']]]),
      }).rows;
      return tierRows({ rows, held: [] }).find((t) => t.subject === 'MOOD: calm');
    };
    // limb 1 — ONE variant.
    expect(thinOf([SETTLEMENT_ONLY[0]])?.tier, 'a pool of one').toBe(TIERS.THIN);
    // limb 3 — a slot set of {settlement} alone (the S12 finding: twenty of sixty-eight
    // blocks carry only {settlement}).
    expect(thinOf(SETTLEMENT_ONLY)?.tier, 'settlement-only slots').toBe(TIERS.THIN);
    // COVERED — two variants, two grammars, a slot beyond {settlement}.
    const covered = thinOf([
      { text: 'The {seat} at {settlement} keeps the rolls, and has since the founding.', slots: ['seat', 'settlement'] },
      { text: 'Where the rolls are kept at {settlement} is the {seat}.', slots: ['seat', 'settlement'] },
    ]);
    expect(covered?.tier, 'a pool with a second slot and a second grammar').toBe(TIERS.COVERED);
    expect(covered?.count, 'and its count is the measurement, not a verdict').toMatch(/variant\(s\)/);
  });

  test('CO-OCCURRENCE has no floor of its own, and refuses to invent one', () => {
    const rows = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]])).rows
      .concat(fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-2', [['TERRAIN: Coastal', SETTLEMENT_ONLY]]]])).rows);
    const firings = firingsCoFiring(200);
    const blind = coOccurringPairs({ firings, rows });
    expect(blind.pairs, 'with no floor the measure answers nothing').toEqual([]);
    expect(blind.notExecutable.length, 'and says so rather than reading as a clean bill').toBe(1);
    const measured = coOccurringPairs({ firings, rows, minTowns: 100 });
    expect(measured.towns).toBe(200);
    expect(measured.pairs.length, 'the two facts co-fire on every town and no pool keys both').toBe(1);
    expect(measured.pairs[0].towns).toBe(200);
    // The PAIRED NEGATIVE: a floor above the sample must silence it, or the arm is reporting
    // every pair it can see rather than the pairs that meet the floor.
    expect(coOccurringPairs({ firings, rows, minTowns: 201 }).pairs.length, 'a floor above the sample silences it').toBe(0);
    // And a pair a pool IS keyed on must never be reported. One row keyed on BOTH facts.
    const keyedOnBoth = rows.concat([{
      ...rows[0],
      block: 'DS-FIX-9',
      pool: 'BOTH',
      predicate: [...rows[0].predicate, ...rows[1].predicate],
    }]);
    expect(coOccurringPairs({ firings, rows: keyedOnBoth, minTowns: 100 }).pairs.length,
      'a pair some pool already conjoins is not MISSING').toBe(0);
  });
});

describe('THE CENSUS AS THE WALKERS\' SOURCE OF TRUTH', () => {
  const entry = {
    id: 'fix#0',
    text: 'The {seat} at {settlement} keeps the rolls.',
    block: 'DS-FIX-1',
    pool: 'MOOD: calm',
    slots: ['seat', 'settlement'],
  };

  test('the GRAMMAR walker\'s arm D changes its verdict when the census is passed', () => {
    const corpus = [entry];
    const composedFill = new Map([['DS-FIX-1', ['seat', 'settlement']]]);
    const withoutCensus = walkGrammar({ corpus, composedFill, register: 'fixture' });
    const resolved = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    }).rows;
    const withCensus = walkGrammar({
      corpus, composedFill, register: 'fixture', wiring: censusIndex(resolved),
    });
    const armD = (r, channel) => r[channel].filter((f) => String(f.arm).startsWith('D'));
    expect(armD(withoutCensus, 'withheld').length, 'without a census the block-wide bag licenses {seat}').toBe(0);
    expect(armD(withCensus, 'withheld').length, 'with it, THIS pool\'s wiring does not, and the claim is banked').toBe(1);
    expect(armD(withCensus, 'withheld')[0].detail, 'as PRE-EXISTING, never as a rewrite failure')
      .toMatch(/PRE-EXISTING unlicensed/);
    expect(armD(withCensus, 'fails').length, 'and nothing green went red by the wiring alone').toBe(0);
    // An UNRESOLVED row must make the arm NOT-EXECUTABLE rather than pass.
    const unresolved = fixtureCensus(COMPOSER_ONE_BRANCH, poolsFrom([['DS-FIX-1', [['MOOD: restive', SETTLEMENT_ONLY]]]])).rows
      .map((r) => ({ ...r, pool: 'MOOD: calm' }));
    const blind = walkGrammar({
      corpus, composedFill, register: 'fixture', wiring: censusIndex(unresolved),
    });
    expect(blind.notExecutable.some((f) => f.arm === 'D/wiring'), 'an unrecovered predicate is not a pass').toBe(true);
  });

  test('the ENTRY walker\'s C-PAIR calls an inherited claim PRE-EXISTING and a new one a failure', () => {
    const ground = { scope: 'estate', columns: { whoIsCounted: { closed: false, values: [] } } };
    const before = { id: 'b', text: 'The watch at {settlement} keeps the gate.', slots: ['settlement'] };
    const after = { id: 'a', text: 'The watch at {settlement} keeps the gate, and every household is counted.', slots: ['settlement'] };
    const added = walkPair(before, after, ground);
    expect(added.added.length, 'the AFTER buys a totality over an open column').toBe(1);
    expect(added.preExisting.length, 'and inherits none').toBe(0);
    // The same fault present in BOTH halves is debt, never a rewrite failure.
    const inherited = walkPair(after, after, ground);
    expect(inherited.added.length, 'a fault the BEFORE already carried is not added').toBe(0);
    expect(inherited.preExisting.length, 'it is banked').toBe(1);
    expect(inherited.preExisting[0].arm, 'and labelled').toMatch(/^PRE-EXISTING · /);
    expect(walkPair(after, before, ground).cured.length, 'and a rewrite that removes it is credited').toBe(1);
  });

  test('the ENTRY walker\'s wiring arm is silent without a census and speaks with one', () => {
    const bare = walkEntry(entry, { scope: 'estate', columns: {} });
    const row = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    }).rows[0];
    const wired = walkEntry(entry, { scope: 'estate', columns: {}, wiring: row });
    const armW = (r, channel) => r[channel].filter((f) => f.klass === 'W');
    expect(armW(bare, 'withheld').length, 'no census, no wiring finding — the pre-car-8 behaviour').toBe(0);
    expect(armW(wired, 'withheld').length, 'with the census the unlicensed slot is banked').toBe(1);
    expect(armW(wired, 'withheld')[0].arm).toBe('PRE-EXISTING unlicensed');
    expect(wired.fails.length, 'and the wiring never fails an entry').toBe(bare.fails.length);
    const unresolvedRow = { status: WIRING_STATUS.UNRESOLVED, reason: 'no branch selects it', slotsFilled: [] };
    const blind = walkEntry(entry, { scope: 'estate', columns: {}, wiring: unresolvedRow });
    expect(armW(blind, 'notExecutable').length, 'an unrecovered predicate reports, never passes').toBe(1);
  });

  test('C-SIBLING will not call a disagreement a contradiction on an unrecovered pool', () => {
    const conflicting = [
      { id: 'p#0', text: 'A few souls hold the fields at {settlement}.', block: 'DS-FIX-1', pool: 'MOOD: calm', slots: ['settlement'] },
      { id: 'p#1', text: 'Thousands of souls hold the fields at {settlement}.', block: 'DS-FIX-1', pool: 'MOOD: calm', slots: ['settlement'] },
    ];
    const cells = new Map([['DS-FIX-1 :: MOOD: calm', conflicting]]);
    const plain = walkGrammar({ corpus: conflicting, cells, register: 'fixture' });
    expect(plain.fails.filter((f) => f.arm === 'C-sibling').length, 'without a census the arm fails as before').toBe(1);
    const unresolved = [{
      block: 'DS-FIX-1', pool: 'MOOD: calm', status: WIRING_STATUS.UNRESOLVED, reason: 'no branch selects it',
    }];
    const gated = walkGrammar({
      corpus: conflicting, cells, register: 'fixture', wiring: censusIndex(unresolved),
    });
    expect(gated.fails.filter((f) => f.arm === 'C-sibling').length, 'with an unrecovered predicate the premise is unestablished').toBe(0);
    expect(gated.notExecutable.some((f) => f.arm === 'C-sibling/wiring'), 'and the arm says so').toBe(true);
  });
});

describe('the source readers themselves', () => {
  test('the pool-key reader finds every key function in the six composers', () => {
    let total = 0;
    for (const [file, src] of composerSources()) total += poolKeyFunctions(src, file).length;
    expect(total, 'pool-key functions across the six desks').toBe(118);
    expect(census.functions, 'and the census reads the same set').toBe(118);
    // ⛔ FOUND IS NOT CONSULTED (INSTR-912 car 10, cure 8). The ladder's map was keyed on the
    // BARE function name, and two desks both export `foodSecurityPoolKey`
    // (`economyStateProse.js:393`, `generalStateProse.js:353`) — so 118 collapsed to 117 while
    // this line asserted `fns.length` and read healthy. The key is `file::name` now and the
    // two counts are asserted EQUAL, so the next same-named pair cannot go quiet.
    expect(census.consulted, 'and the ladder actually walks every one of them').toBe(census.functions);
    expect(census.consulted, 'as an integer, not only as an equality').toBe(118);
    expect(census.tables, 'module-level key tables (object shape and pair-array shape)').toBe(29);
  });

  test('a reader that went dark would report zero, so both readers are pinned against a fixture', () => {
    expect(poolKeyFunctions(COMPOSER_TWO_BRANCHES, 'fixture').length).toBe(1);
    expect(poolKeyFunctions('export function notAKey() { return 1; }', 'fixture').length).toBe(0);
    expect(moduleKeyTables(COMPOSER_TABLE).length).toBe(1);
    expect(moduleKeyTables(COMPOSER_TEMPLATE).length, 'a composer with no table has none').toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════════
// ARCH CAR 0 — THE COLUMNS THE COMPOSED-PROSE WAVE IS SIZED FROM
//
// Every arm below carries a fixture or a plant that MUST fire and a paired cure that MUST
// silence it. A census column is the easiest thing in the estate to make vacuous: answer
// `{}`, answer 0, answer "measured" for everything, and read healthy from a distance.
// ═══════════════════════════════════════════════════════════════════════════════════

/** The committed census, built once: the same call `scripts/wiring-census.mjs` makes. */
const committed = await buildCensus({ rates: JSON.parse(readFileSync(CENSUS_JSON, 'utf8')).rate });

describe('car 0 — `reads`, and the NARROWS line that may narrow it', () => {
  test('reads = the SELECTING BRANCH\'s tests where one was recovered, function-wide where none was', () => {
    // ⭐ THE RULING (SITTING §O.1, ARCH §4.4, E-F2, T-F7). `tests` is every field the
    // SELECTING BRANCH evaluates. Car 8 implemented the KEY FUNCTION's whole reading set, so
    // two branches of one ladder shared one read set; the sitting re-cut the grain and asked
    // for the cost to be measured. Both grains ship on every row: `reads` carries the branch
    // where the reader recovered one, `fieldsRead` stays the function-wide union.
    expect(committed.rows.length, 'the census still covers every pool').toBe(708);
    expect(committed.totals.branchGrainRows, 'rows whose selecting branch was recovered').toBe(287);
    expect(committed.totals.functionGrainRows, 'and rows that fall back, fail-closed').toBe(421);
    expect(committed.totals.branchGrainRows + committed.totals.functionGrainRows).toBe(708);
    for (const row of committed.rows) {
      expect(['branch', 'function'], `${row.pool} names its grain`).toContain(row.readsGrain);
      if (row.readsGrain === 'branch') expect(row.reads, `${row.pool}`).toEqual(row.branchReads);
      else expect(row.reads, `${row.pool} falls back to the whole function`).toEqual(row.fieldsRead);
    }
    // ⛔ THE FAIL-CLOSED HALF, AND IT IS THE ONE THAT COULD ROT. A row whose branch reader
    // recovered NOTHING must not read as a branch that evaluates nothing: that answers k = 3,
    // three free modifier seats on a pool nobody recovered, which is the §908 law's own
    // forbidden answer. Every function-grain row carries an EMPTY branch set and takes the
    // whole function's readings.
    const fellBack = committed.rows.filter((r) => r.readsGrain === 'function');
    expect(fellBack.every((r) => r.branchReads.length === 0), 'and it falls back only where nothing was read').toBe(true);
    const drift = committed.rows.filter((r) => r.reads.join('|') !== r.branchReads.join('|')
      && r.reads.join('|') !== r.fieldsRead.join('|'));
    expect(drift, 'no shipped row narrows its reads today').toEqual([]);
    expect(committed.totals.narrowedRows, 'and the narrowed count is an integer, not an impression').toBe(0);
    expect(committed.totals.narrowsRefused).toBe(0);
  });

  test('⭐ THE BRANCH IS READ STRUCTURALLY: an enclosing guard, a sibling that EXITS, and never a sibling BLOCK\'s insides', () => {
    // The fixture IS the shipped ladder (`defenseStateProse.js:747`), because the grain has
    // three shapes to get right and only the whole ladder carries all three at once.
    const pools = poolsFrom([['DS-FIX-13', [
      ['WALLED-STRAINED', SETTLEMENT_ONLY], ['WALLED-QUIET', SETTLEMENT_ONLY],
      ['WALLED-THREATENED', SETTLEMENT_ONLY], ['UNWALLED-SMALL', SETTLEMENT_ONLY],
      ['UNWALLED-LARGE', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_BRANCH_GRAIN, pools).rows;
    const readsOf = (pool) => (rows.find((r) => r.pool === pool) || {}).reads;
    expect(readsOf('WALLED-STRAINED'), 'the enclosing guard and the branch\'s own')
      .toEqual(['settlement.militaryGate', 'settlement.walls']);
    expect(readsOf('WALLED-QUIET'), 'plus the gate BY EXCLUSION and the family (ARCH §6.3)')
      .toEqual(['settlement.militaryGate', 'settlement.monsterThreat', 'settlement.walls']);
    expect(readsOf('WALLED-THREATENED')).toEqual(readsOf('WALLED-QUIET'));
    // ⛔ THE THIRD SHAPE, AND THE ONE A BACKWARDS SCAN FAILS: the UNWALLED literals sit AFTER
    // the walled block, so the guards INSIDE that block are NOT on their path.
    expect(readsOf('UNWALLED-SMALL'), 'never the gate and never the family')
      .toEqual(['settlement.tier', 'settlement.walls']);
    expect(readsOf('UNWALLED-LARGE')).toEqual(readsOf('UNWALLED-SMALL'));
    // THE PAIRED NEGATIVE — the same ladder flattened, where every branch tests everything.
    const flat = fixtureCensus(COMPOSER_BRANCH_FLAT, pools).rows.filter((r) => r.status === WIRING_STATUS.RESOLVED);
    expect(new Set(flat.map((r) => r.reads.join('|'))).size, 'the flat ladder collapses to ONE read set').toBe(1);
    expect(new Set(rows.map((r) => r.reads.join('|'))).size, 'and the shipped ladder to three').toBe(3);
    // AND THE CONSEQUENCE THE WAVE IS SIZED FROM: the ladder composes, the flat one cannot.
    expect(attachSets(rows)[0].spinesReachedBp, 'every spine of the ladder can carry a modifier').toBe(10000);
    expect(attachSets(flat)[0].spinesReachedBp, 'and none of the flat one can').toBe(0);
  });

  test('the SHIPPED DS-DEF-11 rows carry ARCH §6.3\'s own worked reading, to the field', () => {
    // ⭐ NOT A RESTATEMENT OF THE FIXTURE. ARCH §6.3 published DS-DEF-11's `tests` before this
    // reader existed — "STRAINED {walls, gate}; THREATENED and QUIET {walls, gate (by
    // exclusion), family}; UNWALLED-* {walls, tier}" — so the shipped rows reproducing it is
    // an independent check on the scanner, not the scanner checking itself.
    const readsOf = (pool) => (committed.rows.find(
      (r) => r.block === 'DS-DEF-11' && r.pool === pool,
    ) || {}).reads;
    const WALLS = 'forces.walls.present';
    const GATE = 'settlement.defenseProfile.economicGates.military';
    const FAMILY = 'settlement.config.monsterThreat';
    expect(readsOf('WALLED-STRAINED')).toEqual([WALLS, GATE]);
    expect(readsOf('WALLED-THREATENED')).toEqual([WALLS, FAMILY, GATE]);
    expect(readsOf('WALLED-QUIET')).toEqual([WALLS, FAMILY, GATE]);
    expect(readsOf('UNWALLED-SMALL')).toEqual([WALLS, 'settlement.tier']);
    expect(readsOf('UNWALLED-LARGE')).toEqual([WALLS, 'settlement.tier']);
    // AND THE BUDGET §6.3 PREDICTS FROM THEM: STRAINED and UNWALLED-* leave a seat, the two
    // three-field spines leave none unless the chair rules NARROWS on the gate.
    const kOf = (pool) => (committed.rows.find((r) => r.block === 'DS-DEF-11' && r.pool === pool) || {}).k;
    expect([kOf('WALLED-STRAINED'), kOf('UNWALLED-SMALL'), kOf('UNWALLED-LARGE')]).toEqual([1, 1, 1]);
    expect([kOf('WALLED-QUIET'), kOf('WALLED-THREATENED')]).toEqual([0, 0]);
  });

  test('a NARROWS line without a chair ruling id is REFUSED, and one with it narrows', () => {
    const row = {
      block: 'DS-FIX-1', pool: 'MOOD: calm', fieldsRead: ['readings.reading.mood', 'readings.reading.tier'],
    };
    const naked = narrowedReads(row, new Map([['DS-FIX-1 :: MOOD: calm', { fields: ['readings.reading.mood'] }]]));
    expect(naked.narrowed, 'a narrowing nobody ruled is not a narrowing').toBe(false);
    expect(naked.reads, 'and the reads stay at the recovered tests').toEqual(row.fieldsRead);
    expect(naked.refusal).toMatch(/no chair ruling id/);
    const ruled = narrowedReads(row, new Map([['DS-FIX-1 :: MOOD: calm', {
      fields: ['readings.reading.mood'], ruling: 'S-912-NARROWS-1', quote: 'the text claims the mood and never the tier',
    }]]));
    expect(ruled.narrowed, 'a ruled narrowing narrows').toBe(true);
    expect(ruled.reads).toEqual(['readings.reading.mood']);
    expect(ruled.refusal).toBe('');
    // AND THE SECOND REFUSAL: a ruling may not invent a field the branch does not test.
    const invented = narrowedReads(row, new Map([['DS-FIX-1 :: MOOD: calm', {
      fields: ['readings.reading.walls'], ruling: 'S-912-NARROWS-2', quote: 'x',
    }]]));
    expect(invented.narrowed).toBe(false);
    expect(invented.refusal).toMatch(/which the branch does not test/);
  });
});

describe('car 0 — `absent`: a measurement, or a default wearing a reading\'s clothes', () => {
  test('a read that supplies its own fallback is `default`; the guarded sibling is `measured`', () => {
    const pools = poolsFrom([['DS-FIX-10', [
      ['THREAT: embattled', SETTLEMENT_ONLY], ['GATE: underfunded', SETTLEMENT_ONLY],
    ]]]);
    const defaulting = fixtureCensus(COMPOSER_DEFAULTING_READ, pools).rows;
    const guarded = fixtureCensus(COMPOSER_DEFAULTING_READ_GUARDED, pools).rows;
    const labelOf = (rows, pool, needle) => {
      const row = rows.find((r) => r.pool === pool);
      const key = Object.keys(row.absent).find((f) => f.endsWith(needle));
      return row.absent[key];
    };
    // PRESENT-THEN-ABSENT on the one field, with the composer's ONLY change being the `||`.
    expect(labelOf(defaulting, 'THREAT: embattled', 'monsterThreat'), 'the fallback hides the absence').toBe('default');
    expect(labelOf(guarded, 'THREAT: embattled', 'monsterThreat'), 'and struck, the absence is visible').toBe('measured');
    // The gate read is the estate's own shape: ABSENT rather than 1.0 when no paid stack
    // exists, and guarded by `typeof === 'number' && Number.isFinite` before `< 1`.
    expect(labelOf(defaulting, 'GATE: underfunded', 'military'), 'a guarded read is a measurement').toBe('measured');
    // THE RULE ITSELF, driven in all three directions on strings, so the corpus integers
    // are not the only thing standing behind the column.
    expect(absenceOf('config.monsterThreat', "const t = config.monsterThreat || 'frontier';", null)).toBe('default');
    expect(absenceOf('config.monsterThreat', 'if (config.monsterThreat === \'plagued\') return 1;', new Set(['monsterThreat']))).toBe('measured');
    expect(absenceOf('ledger.ghostField', 'if (ledger.ghostField) return 1;', new Set(['other'])), 'no writer produces it').toBe('not-produced');
    // AND THE LONGEST-SUFFIX RULE: one `present ||` must not label every `*.present` path.
    const body = 'const a = forces.walls.present || false; if (forces.charter.present) return 1;';
    expect(absenceOf('forces.walls.present', body, new Set(['present']))).toBe('default');
    expect(absenceOf('forces.charter.present', body, new Set(['present'])), 'the sibling path is unmoved').toBe('measured');
  });

  test('the corpus\'s own absence distribution is an integer, and the table rung is counted apart', () => {
    const totals = committed.totals.absent;
    // ⚠ THE THREE MOVED WITH THE GRAIN (car 0e). `absent` is keyed on `reads`, so the branch
    // grain shrinks the read paths from 757 to 529 and the distribution with them; nothing
    // about a path's absence semantics changed, only how many paths a pool is entitled to.
    expect(totals.measured, 'read paths whose absence a predicate can see').toBe(377);
    expect(totals.default, 'read paths where a fallback hides it').toBe(10);
    expect(totals['not-produced'], 'read paths no writer in the estate produces').toBe(64);
    // ⛔ THE TABLE RUNG CARRIES NO ABSENCE RECORD (car 10, cure 4, applied to a new column).
    // Rung 3's field is `"<reader> (via <TABLE> in <file>)"` — this instrument's own label —
    // so asking a producer index about it answers `not-produced` on every table row BY
    // CONSTRUCTION. The rows are counted, never dropped in silence.
    expect(committed.totals.tableRungRowsWithoutAbsence, 'and they are counted').toBe(78);
    for (const row of committed.rows) {
      if (row.rung === 'table') expect(Object.keys(row.absent), `${row.pool} carries no absence record`).toEqual([]);
    }
  });
});

describe('car 0 — `covert`, `objectClass` and the numeric key', () => {
  test('a covert read is covert and its revealed sibling is not', () => {
    const pools = poolsFrom([['DS-FIX-11', [
      ['WATCH: bought, unexposed', UNMARKED_ON_A_COVERT_PATH],
      ['WATCH: bought, on the record', MARKED_ON_A_COVERT_PATH],
    ]]]);
    const rows = fixtureCensus(COMPOSER_COVERT_SOURCE, pools).rows;
    const covert = rows.find((r) => r.pool === 'WATCH: bought, unexposed');
    const revealed = rows.find((r) => r.pool === 'WATCH: bought, on the record');
    expect(covert.covert, 'the `.covert` path is on the frozen list').toBe(true);
    expect(revealed.covert, 'and the `.revealed` path over the same call is not').toBe(false);
    // THE PROJECTOR ERROR CAR 4 REFUSES, convicted here on the census's own column: a
    // covert pool holding a variant with no `dm-only` mark.
    const unmarked = rows.filter((r) => r.covert)
      .filter((r) => pools.get('DS-FIX-11').get(r.pool).some((v) => !(v.marks || []).includes('dm-only')));
    expect(unmarked.map((r) => r.pool), 'an unmarked variant on a covert path is a finding')
      .toEqual(['WATCH: bought, unexposed']);
    const curedPools = poolsFrom([['DS-FIX-11', [['WATCH: bought, unexposed', MARKED_ON_A_COVERT_PATH]]]]);
    const cured = fixtureCensus(COMPOSER_COVERT_SOURCE, curedPools).rows;
    expect(cured.filter((r) => r.covert).map((r) => r.pool), 'the pool is still covert').toEqual(['WATCH: bought, unexposed']);
    expect(cured.filter((r) => r.covert && curedPools.get('DS-FIX-11').get(r.pool)
      .some((v) => !(v.marks || []).includes('dm-only'))), 'and marked dm-only, it is no longer a finding').toEqual([]);
    // The roster is DECLARED, and the general limb catches a covert segment anywhere.
    expect(COVERT_SOURCES.length, 'the covert-source list is published as a frozen constant').toBe(6);
    expect(isCovertPath('compromisedSecurityInstitutions.covert')).toBe(true);
    expect(isCovertPath('npc.corrupt')).toBe(true);
    expect(isCovertPath('readings.reading.mood'), 'and an ordinary reading is not covert').toBe(false);
  });

  test('the object class is read off the KEY, from the closed list the census emits', () => {
    // ⛔ THE ONE LICENSED USE OF THE KEY STRING (ARCH T-F12). Every other column is derived
    // from the recovered wiring; this one is the LABEL half by construction, because the
    // refusal it grounds is "the spine key and the modifier key name the same civic object".
    expect(objectClassOf('WALLED-STRAINED')).toBe('wall');
    expect(objectClassOf('Disasters & Famine: NO reserves, NO medical provision')).toBe('store');
    expect(objectClassOf('MOOD: calm'), 'a key naming no civic object gets none').toBe(null);
    expect(Object.keys(CIVIC_OBJECT_CLASSES).length, 'the list is closed at ten classes').toBe(10);
    // THE SAME-CLASS ATTACH, convicted: two keys of one block naming one object.
    const spine = 'Disasters & Famine: NO reserves, NO medical provision';
    const modifier = 'stores: short';
    expect(objectClassOf(spine)).toBe(objectClassOf(modifier));
    expect(objectClassOf(spine), 'so the projector refuses this attach').toBe('store');
    // The paired negative: a modifier over a DIFFERENT object attaches lawfully.
    expect(objectClassOf('watch: bought (covert)')).not.toBe(objectClassOf(spine));
    expect(committed.totals.objectClassed, 'and the corpus count is an integer').toBe(99);
  });

  test('a numeric pool key is named, and its sibling is not', () => {
    const rows = fixtureCensus(COMPOSER_NUMERIC_KEY, poolsFrom([['DS-FIX-13', [
      ['1', SETTLEMENT_ONLY], ['RUNG: the second', SETTLEMENT_ONLY],
    ]]])).rows;
    // P-F12: a key matching `^\d+$` is refused at projection, because a desk that iterated
    // its own pools by index would select one. The census names them so car 4 can refuse.
    const numeric = rows.filter((r) => /^\d+$/.test(r.pool)).map((r) => r.pool);
    expect(numeric, 'the numeric key is named').toEqual(['1']);
    expect(rows.find((r) => r.pool === '1').status, 'and it is a real resolved row, not a parse artefact')
      .toBe(WIRING_STATUS.RESOLVED);
    expect(committed.rows.filter((r) => /^\d+$/.test(r.pool)), 'the shipped corpus holds none').toEqual([]);
  });
});

describe('car 0 — the derived ATTACH sets, their coverage, and the fact budget', () => {
  test('an attach set is every RESOLVED spine whose tests EXCLUDE the fact', () => {
    const rows = fixtureCensus(COMPOSER_POLARITY, poolsFrom([['DS-FIX-12', [
      ['WALLED-STRAINED', SETTLEMENT_ONLY], ['WALLED-QUIET', SETTLEMENT_ONLY],
      ['UNWALLED-SMALL', SETTLEMENT_ONLY], ['UNWALLED-LARGE', SETTLEMENT_ONLY],
    ]]])).rows;
    expect(rows.every((r) => r.status === WIRING_STATUS.RESOLVED), 'all four spines resolve').toBe(true);
    const [block] = attachSets(rows);
    expect(block.spines, 'four spines over one polarity field').toBe(4);
    const gate = block.byFact.find((f) => f.field === 'gate');
    expect(gate, 'the block reads a second fact only ONE spine tests').toBeTruthy();
    // The spines whose branch tests `gate` are excluded; the rest are the attach set.
    expect(gate.attach.sort(), 'and every spine that does NOT test it is attachable')
      .toEqual(['UNWALLED-LARGE', 'UNWALLED-SMALL', 'WALLED-QUIET']);
    // ⭐ THE SPANNING SET, CONVICTED (T-F3). `gate`'s attach set holds spines on BOTH sides
    // of the polarity field `forces.walls.present`, and a relation-bearing modifier may not
    // span two value classes: a pressed country beside a standing wall and beside no wall
    // are not one relation. The census hands car 4 the set the refusal is computed over.
    const polarityOf = (pool) => (pool.startsWith('WALLED') ? 'walls=true' : 'walls=false');
    expect(new Set(gate.attach.map(polarityOf)).size, 'the set spans two polarity classes').toBe(2);
    const walled = block.byFact.find((f) => f.field === 'forces.walls.present');
    expect(walled.attach, 'while the polarity field itself attaches nowhere: every spine tests it')
      .toEqual([]);
  });

  test('attach coverage is printed per block, in basis points, over the shipped corpus', () => {
    const coverage = committed.attachCoverage;
    expect(coverage.length, 'one row per block carrying a RESOLVED spine').toBe(
      new Set(committed.rows.filter((r) => r.status === WIRING_STATUS.RESOLVED).map((r) => r.block)).size,
    );
    const gen3 = coverage.find((c) => c.block === 'DS-GEN-3');
    expect(gen3.spines, 'DS-GEN-3 is the estate\'s widest block').toBe(42);
    expect(gen3.spinesReachedBp, 'and every one of its spines can carry a modifier').toBe(10000);
    expect(coverage.length, 'and that is fifty of the sixty-eight blocks').toBe(50);
    // ⭐⭐ THE RULING'S OWN CONSEQUENCE, MEASURED (SITTING §O.1, car 0e). Under the
    // FUNCTION-WIDE grain twenty-six of the fifty composable blocks read 0 bp, because on a
    // block whose pools come from ONE ladder every spine carried the same read set. The
    // BRANCH grain frees FOUR of them and DS-DEF-11 — the owner's walls block, on which ARCH
    // §6.3 works its whole example — is one: `country: pressed (walled)` attaching to
    // STRAINED is reachable at this grain and was not at the last.
    const dark = coverage.filter((c) => c.spinesReachedBp === 0).map((c) => c.block);
    expect(dark.length, 'blocks where no fact of the block can attach to any spine of it').toBe(22);
    expect(committed.grains.function.cannotAttach.length, 'against the grain the ruling replaced').toBe(26);
    expect(committed.grains.function.cannotAttach.filter((b) => !dark.includes(b)),
      'and these four are what the branch grain buys')
      .toEqual(['DS-DEF-11', 'DS-DEF-9', 'DS-ECO-9', 'DS-POW-3']);
    expectAbsentWithAnchor(dark, 'DS-DEF-11', 'DS-DEF-2', 'the blocks that cannot compose');
    // ⛔ AND DS-DEF-2 DOES NOT LEAVE, WHICH IS A SECOND MEASUREMENT AND NOT A MISS. The
    // grain cannot free a block whose spines nobody has recovered: 22 of DS-DEF-2's 26 pools
    // are WIRING-UNRESOLVED, and the 4 that resolve are ONE ladder (`internalRowPoolKey`)
    // whose every branch tests BOTH of its fields, so no fact of the block excludes a spine.
    // ARCH §6.4's own sentence names the cure and it is a wiring car, not a grain.
    expect(dark, 'the threat assessment §6.4 works its fact budget on').toContain('DS-DEF-2');
    const def2 = committed.rows.filter((r) => r.block === 'DS-DEF-2');
    const def2Resolved = def2.filter((r) => r.status === WIRING_STATUS.RESOLVED);
    expect(def2.length, 'DS-DEF-2 ships twenty-six pools').toBe(26);
    expect(def2Resolved.length, 'and the census recovers four of them').toBe(4);
    expect(new Set(def2Resolved.map((r) => r.keyFunction)).size, 'all from ONE ladder').toBe(1);
    expect(new Set(def2Resolved.map((r) => r.reads.join('|'))).size,
      'whose four branches all test the same two fields, so nothing of the block attaches').toBe(1);
    expect(dark, 'and the single-fact block').toContain('DS-STR-1');
    // THE PAIRED POSITIVE: a block whose pools come from SEVERAL key functions composes, so
    // the dark list is a SELECTION and not the whole roster. Anchored on DS-DEF-2, which the
    // same list does carry: a bare `not.toContain` would pass just as happily if the coverage
    // derivation drifted away entirely.
    expectAbsentWithAnchor(dark, 'DS-GEN-3', 'DS-DEF-2', 'the blocks that cannot compose');
  });

  test('the fact budget is counted over RESOLVED rows and refuses the rest', () => {
    const budget = committed.factBudget;
    expect(budget.zeroK, 'RESOLVED spines that can never take a modifier: k = 3 - |reads| <= 0').toBe(49);
    expect(budget.executable, 'counted over the RESOLVED rows').toBe(318);
    // ⛔ NOT-EXECUTABLE, NEVER k = 3. An UNRESOLVED row reads `[]`, which would answer "three
    // free seats" on a pool whose predicate nobody has recovered — the friendliest number,
    // and the §908 law forbids exactly that.
    expect(budget.notExecutable, 'and the UNRESOLVED rows declare themselves').toBe(390);
    expect(budget.executable + budget.notExecutable).toBe(708);
    const summed = budget.histogram.reduce((total, [, n]) => total + n, 0);
    expect(summed, 'the histogram carries every executable row once').toBe(318);
    // The rule itself, on a fixture: a three-field spine has no seat and a one-field spine has two.
    const rows = [
      { block: 'B', pool: 'p1', status: WIRING_STATUS.RESOLVED, reads: ['a', 'b', 'c'] },
      { block: 'B', pool: 'p2', status: WIRING_STATUS.RESOLVED, reads: ['a'] },
      { block: 'B', pool: 'p3', status: WIRING_STATUS.UNRESOLVED, reads: [] },
    ];
    expect(factBudget(rows).zeroK).toBe(1);
    expect(factBudget(rows).notExecutable).toBe(1);
    expect(Object.fromEntries(factBudget(rows).histogram)).toEqual({ 0: 1, 2: 1 });
    // AND THE BRANCH GRAIN IS WHAT THAT 49 IS COUNTED OVER, with the function-wide reading
    // beside it: the ruling's cost is 72 rows that leave k = 0, printed in ONE table.
    expect(committed.grains.branch.zeroK, 'the shipped grain').toBe(49);
    expect(committed.grains.function.zeroK, 'and the grain the ruling replaced').toBe(121);
  });
});

describe('car 0 — mounts per fact, custom reachability, and the relation table', () => {
  test('the modifier half of mounts-per-fact is NOT-EXECUTABLE without a desk-fact census', () => {
    const blind = factMounts(committed.rows, DOSSIER_MOUNTS);
    expect(blind.notExecutable.length, 'a comparison against nothing is not a clean bill').toBe(1);
    expect(blind.rows.every((r) => r.mountsModifier === null), 'and the column is null, never 0').toBe(true);
    const wired = committed.mountsPerFact;
    expect(wired.notExecutable, 'with the census supplied it is executable').toEqual([]);
    // ⭐ THE MODIFIER HALF IS THE TAB'S QUESTION. Derived within a block it is zero on every
    // row by construction, because a fact one of a block's own spines reads SPINES on that
    // block's tab and the echo bound excludes it there.
    expect(wired.rows.some((r) => (r.mountsModifier || 0) > 0), 'and it answers a real number').toBe(true);
    expect(wired.byTab.length, 'every mounted tab carries a modifier-eligible count').toBe(
      new Set(DOSSIER_MOUNTS.map((m) => m.tab)).size,
    );
    // ARCH §6.5's worked REFUSAL, as a measurement: `tradeRouteAccess` spines at
    // `overview.origin`, so it may take no modifier seat anywhere on the overview tab.
    const route = wired.rows.find((r) => r.field === 'readings.tradeRouteAccess');
    expect(route.spineTabs, 'the route spines on overview').toContain('overview');
    expect(route.modifierMounts.filter((m) => m.startsWith('overview.')),
      'so no overview mount is modifier-eligible for it').toEqual([]);
    expect(route.modifierMounts.length, 'while other tabs remain open to it').toBeGreaterThan(0);
  });

  test('custom-content reachability is enumerable from code, per kind, with the limb named', () => {
    // The owner's 2026-09-08 ~04:00 row: the CUSTOM-PROSE train authors one generic
    // construction per reachable (kind x fact x value), so the count per kind is its input.
    const custom = committed.customReachable;
    expect(custom.byKind.length, 'the eight authorable kinds, enumerated from the manifest').toBe(8);
    expect(custom.rows.length, 'in-house (block, pool) predicates a custom definition can reach').toBe(21);
    expect(Object.fromEntries(custom.byKind), 'per kind, as integers').toEqual({
      services: 6, resources: 6, institutions: 5, factions: 2, tradeGoods: 2, stressors: 0, deities: 0, traditions: 0,
    });
    for (const row of custom.rows) {
      expect(['bucket', 'field', 'value'], `${row.pool} names which limb caught it`).toContain(row.via);
    }
    // THE LIMBS, driven on a fixture so the integers above are not the only evidence.
    const categories = [{
      key: 'resources',
      singular: 'Resource',
      fields: [{ key: 'criticality', effect: 'mechanical', values: ['critical', 'important'] }],
    }];
    const hit = customReachable([{
      block: 'B', pool: 'p', reads: ['readings.resources'], predicate: [],
    }], categories);
    expect(hit.rows[0].via, 'a reads path naming the bucket').toBe('bucket');
    const byValue = customReachable([{
      block: 'B', pool: 'p', reads: ['readings.other'], predicate: [{ field: 'x', op: '===', value: 'critical' }],
    }], categories);
    expect(byValue.rows[0].via, 'a predicate value inside a mechanical enum').toBe('value');
    expect(customReachable([{ block: 'B', pool: 'p', reads: ['readings.mood'], predicate: [] }], categories).rows,
      'and a pool reaching nothing is not counted').toEqual([]);
  });

  test('the relation table has its row count by source and by direction, and source (d) is EMPTY', () => {
    const relations = committed.relations;
    expect(relations.rows.length, 'rows the four sources yield at this tip').toBe(165);
    expect(Object.fromEntries(relations.bySource), 'by source').toEqual({ a: 131, b: 28, c: 6 });
    expect(Object.fromEntries(relations.byDirection), 'and every row carries its direction').toEqual({ 'a->b': 165 });
    // ⭐ SOURCE (d) IS THE SITTING'S AND IS EMPTY, ASSERTED (ARCH §5.2, E-F14b). A missing key
    // would leave a reader to infer the emptiness; an assertion makes the standing
    // ratification door's first row visible the moment it lands.
    expect(relationsFromSitting(), 'no sitting has ratified an axis pair').toEqual([]);
    expect(relations.rows.filter((r) => r.source === 'd'), 'so the table carries none').toEqual([]);
    // THE EDGE ARCH §5.2 NAMES, recovered rather than transcribed: the generator's
    // `milUpkeepMult = min(1, 0.6 + econOutput/50 * 0.4)` degrading the military score.
    const gate = relations.rows.filter((r) => r.b === 'economicGates.military');
    expect(gate.map((r) => r.a), 'econOutput is the gate\'s source')
      .toEqual(['src/generators/defenseGenerator.js::econOutput']);
    expect(gate[0].relation).toBe('consequence');
    expect(gate[0].direction).toBe('a->b');
  });

  test('⭐ NOT ONE RELATION ROW JOINS TWO FIELDS A DESK READS, and that is the car\'s finding', () => {
    // ⛔ ARCH §11's EMPTY-TABLE RISK HAS MATERIALISED, MEASURED RATHER THAN FEARED. A
    // `consequence` or `tension` joint is licensed only by a row whose endpoints include the
    // spine's PRIMARY field. The table names PRODUCER tokens (`condition:<archetype>`,
    // `system:<variable>`, `economicGates.<gate>`); the census names CALLER paths and bare
    // key-function parameters (`readings.x`, `gate`, `forces`). At this tip the two
    // vocabularies do not meet — not once, in either direction, and not even at the leaf.
    const join = committed.relations.join;
    // 85 AND NOT 91 SINCE CAR 0e: the join is taken over `reads`, and six roots were reached
    // only by a field some OTHER branch of the same key function tested.
    expect(join.deskRoots, 'the desks read this many distinct field roots').toBe(85);
    expect(join.strictBoth, 'rows a projector could license today').toBe(0);
    expect(join.strictEither, 'and rows sharing even ONE endpoint with a desk read').toBe(0);
    expect(join.leafBoth, 'nor does a leaf-level normalisation reach a row').toBe(0);
    // ⭐ TWO ROWS JOIN ON ONE ENDPOINT AT THE LEAF, and one of them is the ARCH document's
    // own worked edge — `econOutput` degrading `economicGates.military`. Even that edge is
    // half-joined, because the desks read the gate as an unrooted parameter.
    expect(join.leafEither, 'two rows touch a desk read at the leaf').toBe(2);
    expect(join.leafRows, 'and none of them on BOTH endpoints').toEqual([]);
    // THE CONSEQUENCE, stated as an executable fact rather than a caution: until a
    // normalisation lands, the clause seat has no licensed row and every modifier at this
    // tip is an `addition` with the empty opener. The measurement is what car 5's arm A2
    // will refuse against.
    const licensed = committed.relations.rows.filter((r) => r.relation === 'tension');
    expect(licensed, 'and no source yields a tension row at all today').toEqual([]);
  });
});

describe('car 0f — the ALIAS DRAFT: measured, nothing ratified, no leaf written', () => {
  test('a shared identifier proposes exactly ONE candidate, and the case reading is what finds it', () => {
    // SITTING §O.2 chartered a MEASUREMENT of what a normalisation between the relation
    // table's PRODUCER TOKENS and the desks' READ PATHS would buy. The draft proposes; it
    // ratifies nothing and writes no leaf.
    const one = aliasDraft({
      endpoints: ['system:food_security'],
      roots: ['eco'],
      paths: ['eco.foodSecurity.label'],
    });
    expect(one.rows.length, 'one endpoint, one root, one candidate').toBe(1);
    expect(one.rows[0], 'carrying the read path that proposed it').toEqual({
      endpoint: 'system:food_security',
      readRoot: 'eco',
      evidence: 'identifier',
      at: 'eco.foodSecurity.label',
      line: 'eco.foodSecurity.label',
    });
    expect(one.noCandidate, 'and nothing is left over').toEqual([]);
    // ⛔ THE CASE READING IS THE WHOLE MATCH, AND HERE IS THE PAIRED NEGATIVE. `food_security`
    // and `foodSecurity` are one identifier under a case- and separator-insensitive reading
    // and two under any other; car 0's LEAF join compared raw segments and reached 0 rows on
    // both endpoints, which is exactly this.
    expect(aliasKey('food_security'), 'the reading that joins them').toBe(aliasKey('foodSecurity'));
    expect('food_security' === 'foodSecurity', 'while the raw tokens are two').toBe(false);
    expect(aliasDraft({
      endpoints: ['system:food_security'], roots: ['eco'], paths: ['eco.grainStore.label'],
    }).rows, 'and a path that shares no segment proposes nothing').toEqual([]);
    // A PAIR IS ONE PROPOSAL however many paths carry it.
    const twice = aliasDraft({
      endpoints: ['system:food_security'],
      roots: ['eco'],
      paths: ['eco.foodSecurity.label', 'eco.foodSecurity.stockpile'],
    });
    expect(twice.rows.length, 'two paths, one pair, one row').toBe(1);
  });

  test('the draft over the SHIPPED endpoints and read paths, with its evidence and its debt', () => {
    const endpoints = [...new Set(committed.relations.rows.flatMap((r) => [r.a, r.b]))];
    /** @type {Set<string>} */
    const roots = new Set();
    /** @type {Set<string>} */
    const paths = new Set();
    for (const row of committed.rows) {
      for (const path of row.reads || []) { roots.add(rootOf(path)); paths.add(path); }
    }
    const draft = aliasDraft({
      endpoints, roots: [...roots], paths: [...paths].sort(), ...draftSources(),
    });
    // THE STRUCTURAL HALF, which no unrelated car can move.
    expect(endpoints.length, 'the relation table\'s endpoints').toBe(89);
    expect(draft.endpointsWithCandidate + draft.noCandidate.length, 'every endpoint is answered once').toBe(89);
    expect(new Set(draft.rows.map((r) => `${r.endpoint}|${r.readRoot}`)).size,
      'one row per pair, never one per citation').toBe(draft.rows.length);
    for (const row of draft.rows) {
      expect(EVIDENCE_ORDER, `${row.endpoint} names an evidence kind from the closed list`).toContain(row.evidence);
      expect(row.at, `${row.endpoint} carries a citation a reader can open`).not.toBe('');
    }
    expect(draft.syntheticRootsExcluded, 'the instrument\'s own table labels are not join targets').toBe(15);
    // ⭐ THE THREE IDENTIFIER ROWS, which are the draft's whole strength and come from the
    // census's own read paths — including ARCH §5.2's OWN WORKED EDGE, whose gate endpoint
    // the defence desk reads at `settlement.defenseProfile.economicGates.military`.
    const identifiers = draft.rows.filter((r) => r.evidence === 'identifier');
    expect(identifiers.map((r) => `${r.endpoint} -> ${r.readRoot}`)).toEqual([
      'cause:occupation -> war',
      'economicGates.military -> settlement.defenseProfile',
      'system:food_security -> eco',
    ]);
    // ⚠ THE REPORT HALF. These counts read the six composers' docblocks and every file under
    // src/generators/, so a car that edits a generator comment can move them; they are
    // asserted because they are this car's FINDING and a drift should be seen, not because
    // they are structural.
    expect(draft.rows.length, 'candidate rows at this tip').toBe(37);
    expect(draft.endpointsWithCandidate, 'endpoints with at least one candidate').toBe(15);
    expect(draft.noCandidate.length, 'and the wiring debt the SEAM and WAVE trains inherit').toBe(74);
    /** @type {Set<string>} */
    const proposed = new Set(draft.rows.map((r) => r.endpoint));
    const joined = committed.relations.rows.filter((r) => proposed.has(r.a) && proposed.has(r.b));
    expect(joined.length, 'relation rows that WOULD join under the draft').toBe(4);
    expect(joined.map((r) => `${r.a} ${r.direction} ${r.b}`)).toEqual([
      'condition:famine a->b system:food_security',
      'condition:famine a->b system:public_legitimacy',
      'condition:boom a->b system:public_legitimacy',
      'signal:occupied a->b cause:occupation',
    ]);
    // ⛔ AND NOTHING IS RATIFIED: the shipped join is still zero, and the draft is in no leaf.
    // Anchored on `relations`, a key the committed census DOES carry: a bare exclusion would
    // pass just as happily if the JSON's whole top level drifted away.
    expect(committed.relations.join.strictBoth, 'the shipped join is unmoved').toBe(0);
    expectAbsentWithAnchor(Object.keys(committed), 'aliases', 'relations',
      'the committed census\'s top level');
  });
});

describe('car 0 — the committed JSON and its interlock', () => {
  test('the committed census is byte-identical to a fresh build, and the stamp is live', () => {
    const text = readFileSync(CENSUS_JSON, 'utf8');
    const verdict = censusCheck(text, committed);
    expect(verdict.reason, 'the committed file is current').toBe('');
    expect(verdict.ok).toBe(true);
    expect(text, 'and byte-identical to what the script would write').toBe(serialise(committed));
    expect(Object.keys(committed.stamp.files).length, 'the six composers and the mount registry').toBe(7);
  });

  test('a STALE STAMP and a STALE BYTE are different refusals, and both fire', () => {
    // ⛔ THE PLANT THE INTERLOCK EXISTS FOR. A composer moves, nobody re-takes the census,
    // and the projector goes on refusing `READS` tokens against a map of a tree that no
    // longer exists. The two failures have different cures and are not collapsed.
    const fresh = JSON.parse(serialise(committed));
    fresh.stamp.files[Object.keys(fresh.stamp.files)[0]] = '0'.repeat(64);
    const stamped = censusCheck(`${JSON.stringify(fresh, null, 2)}\n`, committed);
    expect(stamped.ok, 'a stale stamp refuses').toBe(false);
    expect(stamped.reason).toBe('stale-stamp');
    expect(stamped.detail).toMatch(/the composer moved since the census was taken/);
    const drifted = JSON.parse(serialise(committed));
    drifted.totals.pools = 707;
    const bytes = censusCheck(`${JSON.stringify(drifted, null, 2)}\n`, committed);
    expect(bytes.ok, 'a stale byte refuses').toBe(false);
    expect(bytes.reason, 'and says which failure it is').toBe('stale-bytes');
    expect(censusCheck(null, committed).reason, 'a missing file is its own refusal').toBe('missing');
    // THE PAIRED POSITIVE, so the check is not simply refusing everything.
    expect(censusCheck(serialise(committed), committed).ok).toBe(true);
  });

  test('the producer index reads the estate, and a blind one would report nothing', () => {
    const { produced, files } = producerIndex();
    expect(files, 'the scan read src/generators and src/domain, not an empty directory').toBeGreaterThan(400);
    expect(produced.size, 'and found this many written leaf keys').toBeGreaterThan(2000);
    expect(produced.has('economicGates'), 'including the gate the ARCH document works from').toBe(true);
    expect(produced.has('zzzNoWriterAnywhere'), 'and not a key nothing writes').toBe(false);
  });
});

describe('car 0 — the RATE corpus, its per-tier arm and the occurrence bound', () => {
  test('the corpus is a marginal-controlled grid whose TIER axis is balanced', () => {
    const rate = committed.rate;
    expect(rate, 'the committed census carries its rate half').toBeTruthy();
    expect(rate.corpus.cells, 'threat 4 x route 8 x tier 6').toBe(192);
    expect(rate.corpus.seeds, 'seeds per cell').toBe(4);
    expect(rate.corpus.towns, 'and the sample the Wilson bound is stated at').toBe(768);
    expect(rate.corpus.genThrows, 'no generator threw').toBe(0);
    expect(rate.corpus.deskThrows, 'and no desk threw').toEqual([]);
    // ⭐ THE TIER AXIS IS EXACTLY BALANCED (the owner's 2026-09-08 01:3x row). A corpus whose
    // tiers were rolled could not answer "is this pool dark at city?" at all.
    expect(Object.fromEntries(rate.corpus.tierMarginals)).toEqual({
      thorp: 128, hamlet: 128, village: 128, town: 128, city: 128, metropolis: 128,
    });
    expect(rate.rows.length, 'pools that fired somewhere on the grid').toBe(267);
    // The one-config 200-town probe reached 181; the grid reaches more, which is the point.
    expect(rate.rows.length, 'more than the single-configuration probe could reach').toBeGreaterThan(181);
  });

  test('a pool silent at a tier where its block MOUNTS is a per-tier finding', () => {
    expect(committed.rate.tierSilences.length, '(pool, tier) rows on the shipped grid').toBe(347);
    for (const row of committed.rate.tierSilences) {
      expect(row.sites, 'every finding is on a MOUNTED block').toBeGreaterThan(0);
      expect(row.firedOverall, 'and on a pool that fired somewhere').toBeGreaterThan(0);
    }
    // THE ARM ITSELF, on a fixture built to hold one silence and one lawful absence: a pool
    // that fires only at `city` is silent at `hamlet`, and a pool of an UNMOUNTED block is
    // not a finding at all, however silent it is.
    const towns = firingsByTier(4);
    const rows = [
      {
        block: 'DS-FIX-12', pool: 'WALLED-QUIET', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } },
      },
      {
        block: 'DS-FIX-99', pool: 'DARK', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } },
      },
    ];
    const tiers = [['hamlet', 4], ['city', 4]];
    const sites = new Map([['DS-FIX-12', ['defense.wallRationale']], ['DS-FIX-99', []]]);
    const found = tierSilencesOf(rows, tiers, sites);
    expect(found.map((f) => `${f.block}/${f.tier}`), 'the mounted block\'s silence is named, the unmounted one is not')
      .toEqual(['DS-FIX-12/hamlet']);
    expect(towns.length, 'and the fixture carries both tiers').toBe(8);
  });

  test('⭐ each per-tier silence is LAWFUL or MISSING-AT-TIER, and the second joins the tier table', () => {
    // SITTING §O.5. A pool silent at a size where its block mounts is LAWFUL when its own
    // RUNG spoke there and chose another value class — the ladder RAN and the field could not
    // hold this pool's value at that size, which is `walls at a thorp` exactly. It is
    // MISSING-AT-TIER when NO pool of the rung fired at that tier at all: the reader gets
    // silence at one size from a rung that speaks at every other, and that is the wave's row.
    const silences = committed.rate.tierSilences;
    const lawful = silences.filter((r) => r.verdict === 'LAWFUL');
    const missing = silences.filter((r) => r.verdict === 'MISSING-AT-TIER');
    expect(lawful.length, 'lawful silences, at 128 towns per tier').toBe(303);
    expect(missing.length, 'and the rows the authoring wave inherits').toBe(44);
    expect(lawful.length + missing.length, 'the two limbs partition the finding').toBe(347);
    expect(new Set(lawful.map((r) => r.limb)), 'each names the limb that answered it').toEqual(new Set(['value-class']));
    expect(new Set(missing.map((r) => r.limb))).toEqual(new Set(['rung-dark']));
    // THE FOURTH TIER, in the table the authoring wave reads and not in a second list.
    expect(committed.totals.tiers['MISSING-AT-TIER'], 'the fourth tier carries them').toBe(44);
    const fourth = committed.tiers.filter((t) => t.tier === TIERS.MISSING_AT_TIER);
    expect(fourth.length).toBe(44);
    for (const row of fourth) {
      expect(row.subject, 'each names the pool AND the size').toMatch(/ @ \w+$/);
      expect(row.count, 'and carries the measurement that put it there').toMatch(/fired on \d+ towns overall/);
    }
    // ⚠ WHAT THE 44 ARE NOT: no BLOCK is dark at a size on this corpus, only a RUNG is, and
    // twelve of the 44 sit on a block whose ladder SPLITS across a module-level key table and
    // the function carrying its `||` fallback, where the two halves cannot see each other.
    // Both are DECLARED with their integers rather than cured behind the verdict.
    expect(missing.filter((r) => r.siblingRungSpoke).length, 'every one of them').toBe(44);
    expect(missing.filter((r) => r.splitLadder).length, 'the split-ladder shape, counted').toBe(12);
    expect(new Set(missing.map((r) => r.block)).size, 'over this many blocks').toBe(6);
    // THE RULE ITSELF, on a fixture: two pools of ONE rung, one silent at hamlet where the
    // other spoke, against a rung with nothing at hamlet at all.
    const tiers2 = [['hamlet', 4], ['city', 4]];
    const sites2 = new Map([['DS-FIX-12', ['defense.wallRationale']]]);
    const rows2 = [
      { block: 'DS-FIX-12', pool: 'WALLED', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } } },
      { block: 'DS-FIX-12', pool: 'UNWALLED', towns: 4, byTier: { hamlet: { towns: 4 }, city: { towns: 0 } } },
      { block: 'DS-FIX-12', pool: 'MERCENARIES', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } } },
    ];
    const census2 = [
      { block: 'DS-FIX-12', pool: 'WALLED', keyFunction: 'wallPoolKey', rung: 'literal' },
      { block: 'DS-FIX-12', pool: 'UNWALLED', keyFunction: 'wallPoolKey', rung: 'literal' },
      { block: 'DS-FIX-12', pool: 'MERCENARIES', keyFunction: 'mercPoolKey', rung: 'literal' },
    ];
    const verdicts = tierSilencesOf(rows2, tiers2, sites2, census2);
    expect(verdicts.map((v) => `${v.pool}/${v.tier}/${v.verdict}`), 'the sibling class answers, the lone rung does not')
      .toEqual(['WALLED/hamlet/LAWFUL', 'UNWALLED/city/LAWFUL', 'MERCENARIES/hamlet/MISSING-AT-TIER']);
    // AND WITHOUT THE CENSUS the rung falls back to the BLOCK, which is coarser and says so.
    const blind = tierSilencesOf(rows2, tiers2, sites2);
    expect(new Set(blind.map((v) => v.grain)), 'the coarser grain is named on the row').toEqual(new Set(['block']));
    expect(blind.find((v) => v.pool === 'MERCENARIES').verdict, 'and it calls the lone rung lawful, which is why it is named')
      .toBe('LAWFUL');
  });

  test('the occurrence bound is the WILSON lower bound, and the pair distribution is printed at it', () => {
    // ARCH E-F4: at 27 of 525 a cell truly at 5 % clears a naive floor 48 % of the time, so
    // the floor is the 95 % LOWER bound and never the point estimate.
    expect(wilsonFloorCount(768, 500), 'the bound at N = 768').toBe(51);
    expect(wilsonFloorCount(525, 500), 'and at the golden corpus\'s N').toBe(37);
    expect(wilsonBp(51, 768).loBp, 'the interval at the bound clears 500 bp').toBeGreaterThanOrEqual(500);
    expect(wilsonBp(50, 768).loBp, 'and one town below it does not').toBeLessThan(500);
    const pairs = committed.rate.pairs;
    expect(pairs.n).toBe(768);
    expect(pairs.boundCount, 'the census carries the bound it was measured at').toBe(51);
    expect(pairs.rows.length, 'distinct co-occurring fact pairs with no pool keyed on both').toBe(729);
    expect(pairs.clearing, 'pairs clearing the bound, ALL members').toBe(590);
    // ⛔ AND THE HALF THE CHAIR MUST SET THE FLOOR FROM. `coOccurringPairs` builds a town's
    // facts from PREDICATE fields, two of whose shapes are this instrument's own bookkeeping:
    // the table rung's synthetic label and a bare unrooted parameter. A floor set on the
    // whole distribution would be set on 503 pairs of labels.
    expect(pairs.usable, 'pairs whose BOTH members are dotted reading paths').toBe(226);
    expect(pairs.usableClearing, 'and those clearing the bound').toBe(170);
    // ⛔ NO FLOOR IS SET HERE. The distribution ships; the floor is the chair's.
    expect(committed.rate.departureReport.lineBp, 'the departure line is a REPORT at 10 %').toBe(1000);
    expect(committed.rate.departureReport.uncommon
      + committed.rate.departureReport.common, 'over every fired pool').toBe(267);
  });

  test('the wizard-default weighting ships as a REPORT column beside every rate', () => {
    // SITTING §N.3: the measurement population is UNIFORM OVER THE CONFIGURATION CHOICES;
    // the funnel is printed beside it and never silently re-orders an installed world.
    const wizard = committed.rate.wizard;
    expect(wizard.towns, 'the same N, so the two columns are comparable').toBe(768);
    // ⭐ THE FUNNEL'S TIERS ARE NOT BALANCED AND THE GRID'S ARE, which is the whole reason
    // the two populations are different questions.
    const wizardTiers = Object.fromEntries(wizard.tiers);
    expect(new Set(Object.values(wizardTiers)).size, 'the wizard rolls its tier').toBeGreaterThan(1);
    for (const row of committed.rate.rows) {
      expect(typeof row.wizardRateBp, `${row.pool} carries its report column`).toBe('number');
    }
  });
});

