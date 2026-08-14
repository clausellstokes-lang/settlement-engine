/**
 * kindPoolFloors.walker.test.js — SP-E. THE FREQUENCY-SCALED FLOOR WALKER, ESTATE-WIDE.
 *
 * Nine per-program kind-pool walkers each police their OWN registry. Nothing polices the
 * estate: a floor law that four walkers transcribe, four more ignore, and one spells as a
 * hard-coded five is not a law. This walker reads every registered phrased kind in the tree
 * through the ONE derived floor table (tests/helpers/kindPoolWalker.js) and reports the
 * violations as ROWS.
 *
 * ── J-SP-8 BINDS: THIS WALKER MAY NOT RED THE ESTATE AT BIRTH ───────────────────
 *
 * The measurement at this commit is 28 registered kinds under their own floor, every one of
 * them at depth EXACTLY FIVE — the fixed-five class chair ruling CR-FP-7 closed by
 * countersigning the cap-raise arm. Raising 28 pools is a content program's work across five
 * war annexes, not a test estate's. So the 28 land as a FROZEN SHRINK-ONLY BACKLOG (the EP
 * burn-down idiom): a wave may LEAVE the list, none may join it, and a NEW kind under its
 * floor reds on the day it lands.
 *
 * A walker born red is a walker someone disables. That is the whole reason this shape was
 * chosen over green-at-birth, which would have demanded either a content program before SP-E
 * could land or floor-gaming stubs in the pools — both worse (J-SP-8's own words).
 *
 * ── THE BACKLOG IS NOT AN AMNESTY ───────────────────────────────────────────────
 *
 * A frozen list that only says "these kinds are allowed to be short" lets its contents rot
 * invisibly — this estate has already been bitten by a red ratchet whose row diff stayed empty
 * while the inventory inside it grew. Three properties keep this one honest:
 *
 *   1. EVERY member must still NAME a live registered kind (a rename cannot orphan the list).
 *   2. EVERY member sits at depth exactly FIVE today, and that is asserted per row — a
 *      backlogged kind that drops to three reds instead of hiding inside its own entry.
 *   3. The count is measured `<=`, so a wave that raises a pool can lower the number and bank
 *      the win, and no wave can quietly widen it.
 *
 * ── THE SECOND, LARGER BACKLOG: THE UNVOICED TOKENS ─────────────────────────────
 *
 * 274 tokens the Herald ROUTES have no phrased pool at all. They are the content annexes'
 * wiring waves' work (seven of the eight FP annexes are read by nothing today), and they are
 * counted here shrink-only so the debt has a number that can only go down.
 *
 * EVERY NUMERAL BELOW IS AN EXECUTED SELF-ASSERTION, measured from the live registries at run
 * time and compared against the frozen figure — never a comment quoting a census that rotted.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  CHRONIC_COMPLIANT_PROBE,
  CHRONIC_TWO_VARIANT_PROBE,
  FREQUENCY_FLOORS,
  UNREGISTERED_PROBE,
  floorFor,
  floorReasons,
  floorViolations,
  poolDepth,
} from '../helpers/kindPoolWalker.js';
import { EXACT_SECTION } from '../../src/domain/realm/heraldRouting.js';
import {
  ENVOY_KIND_REGISTRY,
  WAR_COALITION_KIND_REGISTRY,
  WAR_COST_KIND_REGISTRY,
  WAR_DISPOSITION_KIND_REGISTRY,
  WAR_LINEAGE_KIND_REGISTRY,
  WAR_RULING_KIND_REGISTRY,
} from '../../src/domain/worldPulse/eventProse.js';
import { COMMERCIAL_KIND_REGISTRY } from '../../src/domain/worldPulse/commercialReasonsNews.js';
import { GRAMMAR_KIND_REGISTRY } from '../../src/domain/worldPulse/grammarNews.js';
import { SOVEREIGNTY_KIND_REGISTRY } from '../../src/domain/worldPulse/sovereigntyNews.js';

/**
 * EVERY phrased-kind registry in the tree, named by its program. Listed rather than globbed
 * because a registry that stopped being imported would silently leave the estate-wide claim —
 * a missing entry here is a review conversation, not a quiet shrink of the denominator.
 * @type {ReadonlyArray<readonly [string, ReadonlyArray<any>]>}
 */
const REGISTRIES = Object.freeze([
  ['WAR_DISPOSITION', WAR_DISPOSITION_KIND_REGISTRY],
  ['WAR_LINEAGE', WAR_LINEAGE_KIND_REGISTRY],
  ['WAR_COST', WAR_COST_KIND_REGISTRY],
  ['WAR_RULING', WAR_RULING_KIND_REGISTRY],
  ['WAR_COALITION', WAR_COALITION_KIND_REGISTRY],
  ['ENVOY', ENVOY_KIND_REGISTRY],
  ['COMMERCIAL', COMMERCIAL_KIND_REGISTRY],
  ['GRAMMAR', GRAMMAR_KIND_REGISTRY],
  ['SOVEREIGNTY', SOVEREIGNTY_KIND_REGISTRY],
]);

/**
 * GR-0's declared floor exception, carried here with the same written reason its own walker
 * gives: a dossier line or a DM chip files no Herald desk, so it carries no significance
 * class, yet a reader meets it as often as a notable kind.
 */
const DECLARED_EXCEPTIONS = Object.freeze({ 'n/a': FREQUENCY_FLOORS.notable });

const ALL_ROWS = REGISTRIES.flatMap(([, rows]) => [...rows]);
const REGISTERED_KINDS = new Set(ALL_ROWS.map((row) => String(row.kind)));

/**
 * THE FROZEN LEGACY BACKLOG (J-SP-8), measured 2026-08-06 at this wave's build. Every member
 * is a registered kind whose pool was authored at the fixed FIVE before floors scaled with
 * cadence. SHRINK-ONLY: a wave that deepens a pool removes its entry; a kind may never be
 * ADDED here — author the variants instead.
 *
 * The comment on each row is its measured shortfall at the freeze, kept so a reviewer can see
 * the size of the content debt without re-running anything. The DEPTH itself is asserted per
 * row below, so these comments cannot silently rot into fiction.
 */
const LEGACY_UNDER_FLOOR = Object.freeze([
  'casus_alliance_obligation', //      notable, 5 of 6
  'coalition_debt_paid', //            notable, 5 of 6
  'coalition_entry_priced', //         notable, 5 of 6
  'coalition_expenditure_read', //     notable, 5 of 6
  'coalition_stayed', //               notable, 5 of 6
  'deity_peace_pressure', //           notable, 5 of 6
  'deity_war_pressure', //             notable, 5 of 6
  'disposition_diplomatic_crossed', // notable, 5 of 6
  'disposition_insular_crossed', //    notable, 5 of 6
  'disposition_martial_crossed', //    notable, 5 of 6
  'disposition_mercantile_crossed', // notable, 5 of 6
  'disposition_reversal', //           notable, 5 of 6
  'home_front_hands', //               notable, 5 of 6
  'home_front_institutions', //        notable, 5 of 6
  'home_front_markets', //             notable, 5 of 6
  'home_front_roads', //               notable, 5 of 6
  'home_front_stores', //              notable, 5 of 6
  'lineage_claim_suppressed', //       routine, 5 of 8
  'lineage_edge_recorded', //          notable, 5 of 6
  'mirror_kinship_bond', //            notable, 5 of 6
  'mirror_obligation_discharged', //   notable, 5 of 6
  'refusal_cost_ally_patience', //     notable, 5 of 6
  'refusal_cost_legitimacy', //        notable, 5 of 6
  'succession_demand_inherited', //    notable, 5 of 6
  'trajectory_misread', //             routine, 5 of 8
  'war_culture_suppressed', //         routine, 5 of 8
  'war_trajectory_losing', //          notable, 5 of 6
  'war_trajectory_winning', //         notable, 5 of 6
]);

/**
 * The depth every backlogged pool was authored at. Named as a constant because it is the
 * measured CAUSE of the whole backlog — CR-FP-7's fixed-five class — and not a coincidence.
 */
const FIXED_FIVE = 5;

/** Herald-routed tokens with no phrased pool at all, at this commit. SHRINK-ONLY (`<=`). */
const LEGACY_UNVOICED_TOKENS = 274;

/** The routed-token and registered-kind censuses at this commit, asserted rather than quoted. */
// +1 at IN-0C: `treaty_disclosure_opened` takes an EXACT_SECTION row of its own so the
// compelled-books beat files the treaty cohort's trade desk by its OWN token.
// +1 at GR-4b: `disavowed_by_succession`, on the same reading and the same desk.
// +1 at GR-4b-iii-a: `succession_question_opened`, the pending instrument's public beat.
const ROUTED_TOKENS = 377;
// +1 at IN-0C: the eighth GR-0 lifecycle pool (`treaty_disclosure_opened`).
// +1 at GR-4b: the ninth (`disavowed_by_succession`), the registry's first `major` row.
// +1 at GR-4b-iii-a: the tenth (`succession_question_opened`), a `notable` row.
// +1 at GR-4b-iii-b: the eleventh (`succession_question_open`), a `section: null` DOSSIER
// row — registered here and deliberately NOT routed, which is why ROUTED_TOKENS holds at
// 377 while this figure moves.
// ⚠ THE NO-DESK CLASS IS WHY THE TWO DO NOT ALWAYS MOVE TOGETHER. A `section: null` row
// registers WITHOUT routing by design: it renders into another surface, so an EXACT_SECTION
// row would claim a desk it never reaches. Each such row raises the registered-minus-routed
// difference by exactly one — that difference is the census's honesty check, and it is
// asserted below at its current value rather than assumed constant. A kind routed WITHOUT a
// registry row (or a desk-bearing kind registered without routing) still breaks it.
const REGISTERED_KIND_COUNT = 110;

const violations = floorViolations(ALL_ROWS, { declaredExceptions: DECLARED_EXCEPTIONS });
const unvoiced = Object.keys(EXACT_SECTION).filter((token) => !REGISTERED_KINDS.has(token));

describe('SP-E frequency-scaled floors — anti-vacuity anchors', () => {
  test('every registry is live and the denominator is real', () => {
    // Nothing below means anything if a registry emptied or an import went stale: a violation
    // list is trivially short when there is nothing to violate.
    expect(REGISTRIES).toHaveLength(9);
    for (const [name, rows] of REGISTRIES) {
      expect(rows.length, `${name}: registry is empty`).toBeGreaterThanOrEqual(5);
    }
    expect(ALL_ROWS).toHaveLength(REGISTERED_KIND_COUNT);
    expect(REGISTERED_KINDS.size, 'two registries claim the same kind').toBe(REGISTERED_KIND_COUNT);
    expect(Object.keys(EXACT_SECTION)).toHaveLength(ROUTED_TOKENS);
  });

  test('the floor predicate is live on this estate\'s OWN rows, both ways', () => {
    // Proven against real registry rows rather than probes: at least one row is genuinely
    // under its floor and at least one genuinely meets it, so neither arm below can be green
    // because the predicate stopped answering.
    expect(violations.length, 'the predicate found nothing — it is not running').toBeGreaterThanOrEqual(1);
    expect(violations.length, 'every row reds — the predicate is stuck').toBeLessThan(ALL_ROWS.length);
    const compliant = ALL_ROWS.filter((row) => !floorReasons(row, { declaredExceptions: DECLARED_EXCEPTIONS }).length);
    expect(compliant.length).toBeGreaterThanOrEqual(1);
    expect(compliant.length + violations.length).toBe(ALL_ROWS.length);
  });

  test('every significance class in the estate resolves to a floor', () => {
    // A class nobody gave a floor would make its rows unmeasurable while the walker stayed
    // green — the silent-fallback hole the helper throws to prevent.
    const classes = [...new Set(ALL_ROWS.map((row) => String(row.significance)))].sort();
    expect(classes).toEqual(['major', 'n/a', 'notable', 'routine']);
    for (const cls of classes) {
      expect(floorFor(cls, { declaredExceptions: DECLARED_EXCEPTIONS })).toBeGreaterThan(0);
    }
  });
});

describe('SP-E frequency-scaled floors — the frozen legacy backlog (J-SP-8)', () => {
  test('EVERY kind under its floor today is already in the frozen backlog', () => {
    /** @type {string[]} */
    const intruders = [];
    for (const violation of violations) {
      if (!LEGACY_UNDER_FLOOR.includes(violation.kind)) {
        intruders.push(
          `${violation.kind} (${violation.significance}) has ${violation.depth} variants, floor ${violation.floor}`,
        );
      }
    }
    expect(
      intruders,
      'a kind is under its own frequency-scaled floor and is NOT in the frozen legacy backlog.'
      + ' Author the missing variants in the kind\'s content annex — do NOT widen the list below.'
      + ' The backlog is the 2026-08-06 measurement of pools authored before floors scaled with'
      + ' cadence; a kind minted after that date has no claim on it.',
    ).toEqual([]);
  });

  test('the backlog is SHRINK-ONLY: a kind may leave it, never join it', () => {
    expect(violations.length).toBeLessThanOrEqual(LEGACY_UNDER_FLOOR.length);
    // The list is proven LIVE by the equality below rather than measured against an empty set:
    // at the freeze the two sides are identical, so the `<=` above is a ratchet on a real
    // inventory instead of a bound nothing touches.
    expect(violations.map((v) => v.kind)).toEqual([...LEGACY_UNDER_FLOOR]);
    expect(LEGACY_UNDER_FLOOR).toHaveLength(28);
  });

  test('no backlog entry is an ORPHAN: every one still names a registered kind', () => {
    // A rename that retargeted a pool would otherwise leave a dead entry behind, quietly
    // widening the amnesty by one slot that any future kind could occupy.
    const orphans = LEGACY_UNDER_FLOOR.filter((kind) => !REGISTERED_KINDS.has(kind));
    expect(
      orphans,
      'a backlogged kind no longer exists in any registry — delete its entry (the debt is gone)'
      + ' rather than leaving a slot behind.',
    ).toEqual([]);
  });

  test('the backlog is NOT an amnesty: every member sits at exactly the fixed five', () => {
    // The measured CAUSE of the whole list, asserted per row. Without this a backlogged pool
    // could be cut to two and stay green inside its own entry — the red-ratchet-contents class,
    // where the row diff is empty while the inventory inside it rots.
    /** @type {string[]} */
    const drifted = [];
    for (const kind of LEGACY_UNDER_FLOOR) {
      const row = ALL_ROWS.find((candidate) => String(candidate.kind) === kind);
      const depth = poolDepth(row);
      if (depth !== FIXED_FIVE) drifted.push(`${kind}: ${depth} variants (frozen at ${FIXED_FIVE})`);
    }
    expect(
      drifted,
      'a backlogged pool changed depth. DEEPER than five is a win — remove its backlog entry.'
      + ' SHALLOWER than five is a regression the backlog was never meant to cover.',
    ).toEqual([]);
  });
});

describe('SP-E frequency-scaled floors — the walker\'s own negative controls', () => {
  test('a NEW kind under its floor reds, executed against the live measurement', () => {
    // The arm that matters: the backlog must not have switched the law off. A fabricated kind
    // is measured alongside the real rows and lands in the intruder list.
    const withIntruder = floorViolations(
      [...ALL_ROWS, CHRONIC_TWO_VARIANT_PROBE],
      { declaredExceptions: DECLARED_EXCEPTIONS },
    );
    const intruders = withIntruder.filter((v) => !LEGACY_UNDER_FLOOR.includes(v.kind));
    expect(intruders).toEqual([
      { kind: CHRONIC_TWO_VARIANT_PROBE.kind, significance: 'routine', depth: 2, floor: 8 },
    ]);
    // anchored: the SAME computation over ALL_ROWS alone is asserted to produce an empty
    // intruder list two tests above, so this non-empty result is the planted row and not a
    // walker that reds on everything.
    expect(intruders).not.toEqual([]);
  });

  test('a two-variant chronic kind reds EXACTLY AS an unregistered one', () => {
    // The constitution's own sentence, EXECUTED here as well as in the helper's guard — a
    // volume copying this walker copies the sentence with it.
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).toEqual(['starved']);
    expect(floorReasons(UNREGISTERED_PROBE)).toEqual(['starved']);
    expect(floorReasons(CHRONIC_TWO_VARIANT_PROBE)).toEqual(floorReasons(UNREGISTERED_PROBE));
    // …and the compliant control, so the equality above is not two identical failures of a
    // predicate that has stopped discriminating.
    expect(floorReasons(CHRONIC_COMPLIANT_PROBE)).toEqual([]);
  });

  test('a compliant registry row is NOT swept up by the backlog membership test', () => {
    // The reverse direction: backlog membership must never be the thing that makes a row pass.
    const compliantBacklogged = ALL_ROWS
      .filter((row) => LEGACY_UNDER_FLOOR.includes(String(row.kind)))
      .filter((row) => !floorReasons(row, { declaredExceptions: DECLARED_EXCEPTIONS }).length);
    expect(
      compliantBacklogged.map((row) => String(row.kind)),
      'a backlogged kind now MEETS its floor — remove its entry and bank the win',
    ).toEqual([]);
  });
});

describe('SP-E frequency-scaled floors — the unvoiced-token backlog', () => {
  test('the routed-but-unregistered census is a shrink-only ceiling', () => {
    expect(unvoiced.length).toBeLessThanOrEqual(LEGACY_UNVOICED_TOKENS);
    // Proven live: the set is genuinely large today, so the ceiling measures a real inventory.
    expect(unvoiced.length).toBeGreaterThanOrEqual(1);
    expect(unvoiced.length).toBe(LEGACY_UNVOICED_TOKENS);
  });

  test('the census arithmetic closes — no token is counted twice or lost', () => {
    // Every routed token is either registered or unvoiced, and the two partition the table.
    const routedAndRegistered = Object.keys(EXACT_SECTION).filter((t) => REGISTERED_KINDS.has(t));
    expect(routedAndRegistered.length + unvoiced.length).toBe(ROUTED_TOKENS);
    // Seven registered kinds route by no EXACT_SECTION row (dossier lines and the GRAMMAR
    // rows that file no desk; +1 at GR-4b-iii-b). Stated as a measurement so a kind that
    // quietly LOST its routing is visible rather than absorbed.
    expect(REGISTERED_KIND_COUNT - routedAndRegistered.length).toBe(7);
  });
});
