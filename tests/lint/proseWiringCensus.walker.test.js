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
  censusIndex, censusSummary, cleanPredicate, coOccurringPairs, factIndex, moduleKeyTables,
  poolKeyFunctions, rootOf, stringLiterals, tierRows, TIERS, wiringCensus, WIRING_STATUS,
} from '../../src/domain/prose/wiringCensus.js';
import { walkEntry, walkPair } from '../../src/domain/prose/entryWalker.js';
import { walkGrammar } from '../../src/domain/prose/grammarWalker.js';
import { UNMOUNTED_BLOCKS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { loadStateLeaves, poolCells, ROOT } from '../helpers/dossierCorpus.js';
import {
  composedFillByBlock, composedFillByKeyFunction, composerSources, fillSites, unrenderedFacts,
} from '../helpers/dossierComposedFill.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import {
  COMPOSER_DEEP_PATH, COMPOSER_DOUBLE_QUOTED_KEY, COMPOSER_DOUBLE_QUOTED_KEY_REMOVED,
  COMPOSER_FOUR_BRANCHES, COMPOSER_ONE_BRANCH, COMPOSER_PAIR_TABLE,
  COMPOSER_PREDICATE_OVER_UNREAD, COMPOSER_TABLE, COMPOSER_TEMPLATE, COMPOSER_TWO_BRANCHES,
  firingsCoFiring, NAMES_AN_UNFILLED_SLOT, NAMES_ONLY_FILLED_SLOTS, SETTLEMENT_ONLY,
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

  test('(e) THE FENCE: no src/ file outside the ISLAND names any of its TEN modules', () => {
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
    // AND THE INSIDE OF THE ISLAND IS STILL ONE GRAPH, not ten copies of the same fence: the
    // census names exactly one module of the ten, so the equality the first cut asserted is
    // kept as the sharpest single case rather than lost inside the loop.
    const censusHits = files.filter(([, text]) => text.includes('wiringCensus')).map(([p]) => p);
    expect(censusHits).toEqual(['src/domain/prose/wiringCensus.js']);
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
