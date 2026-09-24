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
 * The measurement at the freeze was 28 registered kinds under their own floor, every one of
 * them at depth EXACTLY FIVE — the fixed-five class chair ruling CR-FP-7 closed by
 * countersigning the cap-raise arm. Raising those pools is a content program's work across
 * five war annexes, not a test estate's. So they landed as a FROZEN SHRINK-ONLY BACKLOG (the
 * EP burn-down idiom): a wave may LEAVE the list, none may join it, and a NEW kind under its
 * floor reds on the day it lands.
 *
 * ⭐ 28 → 23 (CENSUSWIRE). FIVE kinds LEFT — they were not forgiven, they were WIRED.
 * `war_trajectory_winning`, `war_trajectory_losing`, `trajectory_misread`,
 * `succession_demand_inherited` and `war_culture_suppressed` each had the frequency-scaled
 * depth the floor owes ALREADY AUTHORED in docs/content/RECEIPT_POOLS_WAR.md by `1e8bf8a87`
 * (THE CHRONIC-TIER DEEPENING, a nine-file `docs/` commit that touched ZERO `src/`), against
 * a `src/` pool still wired at five. Wiring the thirteen missing families takes the two
 * notable trajectory kinds and the succession record to 6 ≥ 6, and the two routine kinds
 * (`trajectory_misread`, `war_culture_suppressed`) to 10 ≥ 8. THE REMOVAL IS NOT OPTIONAL AND
 * NOT COSMETIC: three arms below refuse a member that meets its floor — the shrink-only
 * EQUALITY, the fixed-five witness, and the compliant-row sweep — so this list and the pools
 * MOVE IN ONE COMMIT or the walker reds in both directions.
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
// THE ONE ROSTER (ODQ §356.2): this list used to be transcribed here AND, by hand, inside
// tests/domain/pantheon.test.js's A5. Both now read the same frozen source, so a registry
// that joins or leaves breaks both consumers identically instead of drifting one of them.
// ⭐⭐ AND THE SIX FIGURES FOLLOWED THE LIST, 2026-09-05, because leaving them literal in EACH
// consumer forked them TWICE (WF-8a, then ENC-4, whose miss landed four RED arms in A5 unseen).
// They are still LITERAL — a freeze derived from the tree is an assertion that cannot fail —
// but they are literal in ONE place now, and this file is a READER of that place.
// ⚠⚠ FOUR OF THEM ARE STILL SPELLED BELOW, AND THAT DUPLICATION IS DELIBERATE AND LOAD-BEARING.
// scripts/base-state-capsule.mjs PARSES THIS FILE'S SOURCE for `REGISTERED_KIND_COUNT` (:384),
// `LEGACY_UNVOICED_TOKENS` (:387), the `expect(REGISTRIES).toHaveLength(n)` identity (:388) and
// the `routedAndRegistered` `.toBe(n)` identity (:385) — `constNumber`/`assertionNumber` FAIL
// CLOSED on anything that is not a bare numeric literal — and tests/scripts/baseStateCapsule
// .test.js (:155-:159) re-reads the same four by REGEX with a second engine. Replacing those
// four numerals with roster reads would break the capsule generator AND its battery, and would
// falsify the capsule's own provenance sentence ("every PINNED row parsed out of the test that
// asserts it"). ⛔ So each of the four is BOUND to the roster by an executed equality instead:
// roster == this file == the live tree, all three asserted, so a registering commit that moves
// one side alone REDS. The equalities are NOT vacuous — the two literals live in two files and
// diverging is exactly what they did, twice.
import { KIND_REGISTRIES, KIND_REGISTRATION_FREEZES } from '../helpers/kindRegistryRoster.js';

/**
 * The estate-wide denominator, now DERIVED rather than transcribed.
 * ⛔ THIS DECLARATION IS PRESERVED DELIBERATELY: GR-4B-IIIA's `requiredSymbols` names
 * `const REGISTRIES = Object.freeze` in this file, and that row is a standing preservation
 * obligation the validator asserts at every status. The single-source repair removes the
 * duplicated LIST, never the declaration a landed packet is entitled to find here.
 * @type {ReadonlyArray<readonly [string, ReadonlyArray<any>]>}
 */
const REGISTRIES = Object.freeze([...KIND_REGISTRIES]);

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
// +1 at GR-4b-ii-W2: `reaffirmed`, that question's HONOR terminal answered aloud — a
// desk-BEARING row, so it moves this figure and REGISTERED_KIND_COUNT together and leaves
// the registered-minus-routed difference below untouched at 7.
// +1 at WF-8a: `faith_last_altar_dark`, the settlement extinction obituary. A desk-BEARING row,
// so it moves this figure and REGISTERED_KIND_COUNT TOGETHER and leaves the registered-minus-
// routed difference below untouched at 8 — the opposite road from IN-1c-a's dossier line. The
// `faith_` family prefix would have routed the token free; the EXACT_SECTION row is what keeps
// this census honest about a kind that genuinely files a desk.
// +1 at ENC-4: `chance_meeting_recorded`, the meeting neither court arranged. A desk-BEARING row
// on ROAD B, so it moves this figure and REGISTERED_KIND_COUNT TOGETHER and leaves the
// registered-minus-routed difference below untouched at 8 — WF-8a's road, not IN-1c-a's. The
// prefix `chance_meeting_` was NOT minted: the exact row is the refusal of the cheap door.
// ⭐ ROSTER-ONLY. Unlike the four below, no source scanner reads this constant: the capsule
// takes `routedTokens` MEASURED from src/domain/realm/heraldRouting.js (:95/:383), never from
// here. So the literal lives in the roster and nowhere else. (+1 at ENC-4b: `chance_meeting_exposed`,
// the refusal that travelled — moved IN THE ROSTER, with its attribution, at the §900 composition.)
// (+2 at GR-2b, in the roster too: GR-2b registers pact_proposed and realm_verb_propose_pact, each
// routed on its own EXACT_SECTION row, so 381 → 383; +1 at FP TR-3: `market_wrong_market_arrival`,
// the MARKET family's desk-bearing exact row, 383 → 384 — moved IN THE ROSTER beside
// REGISTERED_KIND_COUNT below. The union at the FP integration pick, 2026-09-24.)
// routed on its own EXACT_SECTION row, so 381 → 383.) (+1 at GR-6, in the roster: brokered_back,
// routed on its own EXACT_SECTION row, so 383 → 384.)
const ROUTED_TOKENS = KIND_REGISTRATION_FREEZES.routedTokens;
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
// +1 at GR-4b-ii-W2: the twelfth (`reaffirmed`), a `notable` row that DOES carry a desk —
// the exact opposite of the row above it, and the reason both censuses move together here
// while the difference below stays at 7.
// +1 at IN-1c-a: `mirror_standing_line`, the whole of the estate's FIFTH registry family
// (INFORMATION) and its first row. A `section: null` DOSSIER line rendered into the town
// page's standing-line block, so it takes the same no-desk road `succession_question_open`
// took: ROUTED_TOKENS holds at 378 while this figure moves, and the divergence below rises
// by exactly one.
// +1 at WF-8a: `faith_last_altar_dark`, the whole of the estate's SIXTH registry family (FAITH)
// and its first row. Unlike `mirror_standing_line` above it this row CARRIES a desk, so
// ROUTED_TOKENS moves with it and the divergence below stays at 8.
// +1 at ENC-4: `chance_meeting_recorded`, the whole of the estate's SEVENTH registry family
// (CHANCE_MEETING) and its first row. Like `faith_last_altar_dark` above it this row CARRIES a
// desk, so ROUTED_TOKENS moves with it and the divergence below stays at 8.
// +1 at ENC-4b: `chance_meeting_exposed`, the SEVENTH family's second row and the first member
// of this arc that did not also mint a family. It carries a desk on the same road, so both
// censuses move together and the divergence below is untouched.
// +2 at GR-2b: GR-2b registers pact_proposed and realm_verb_propose_pact, the GRAMMAR family's
// thirteenth and fourteenth rows and the DM verb PROPOSE_PACT's two news kinds (SR-8). Both carry
// the treaty cohort's desk, so ROUTED_TOKENS moves with them (381 → 383, in the roster) and the
// divergence below stays at 8; the unvoiced ceiling holds at 274 because they are REGISTERED.
// +1 at FP TR-3 (lane FP-D2): `market_wrong_market_arrival`, the whole of the estate's THIRTEENTH
// registry family (MARKET) and its first row. It carries a desk (an EXACT_SECTION row at trade),
// so ROUTED_TOKENS moves with it and the divergence below stays at 8 (SR-1, SR-8).
// The UNION at the FP integration pick (the chair, 2026-09-24): 115 + 2 + 1.
// +1 at FP IN-2 (SR-1, SR-8): IN-2 registers lure_sprung, the INFORMATION family's second row and
// the lure's DM-truth spring. It carries the infowar siblings' desk (`war`), so ROUTED_TOKENS moves
// with it (383 → 384, in the roster) and the divergence below stays at 8; the unvoiced ceiling holds.
// The UNION at the FP integration pick (the chair, 2026-09-24): 115 + 2 (GR-2b) + 1 (TR-3) + 1 (IN-2).
// +1 at FP GR-6 (brokered_back) — the UNION at the pick: 115 + 2 + 1 + 1 + 1.
// 120 → 122 at FP IN-3 (lane FP-I3, 2026-09-24; SR-8): `false_accusation` and `sweep_launched`.
const REGISTERED_KIND_COUNT = 122;
// +1 at GR-6: GR-6 registers brokered_back (the war that did not happen), the GRAMMAR family's
// fifteenth row and the mediation leaf's one news kind (SR-8). It carries the treaty cohort's
// desk, so ROUTED_TOKENS moves with it (383 → 384, in the roster) and the divergence below stays
// at 8; the unvoiced ceiling holds at 274 because the token is REGISTERED in the commit that
// routes it.

const violations = floorViolations(ALL_ROWS, { declaredExceptions: DECLARED_EXCEPTIONS });
const unvoiced = Object.keys(EXACT_SECTION).filter((token) => !REGISTERED_KINDS.has(token));

describe('SP-E frequency-scaled floors — anti-vacuity anchors', () => {
  test('every registry is live and the denominator is real', () => {
    // Nothing below means anything if a registry emptied or an import went stale: a violation
    // list is trivially short when there is nothing to violate.
    // ⛔ THE `13` IS PARSED OUT OF THIS LINE by scripts/base-state-capsule.mjs (:388) and
    // re-read by regex in tests/scripts/baseStateCapsule.test.js (:157). It must stay a bare
    // numeric literal in this exact spelling; the roster equality on the next line is what
    // keeps it from forking away from tests/domain/pantheon.test.js.
    expect(REGISTRIES).toHaveLength(13);
    expect(
      KIND_REGISTRATION_FREEZES.registries,
      'the roster and this walker disagree on the registry count — move BOTH in the registering'
      + ' commit (tests/helpers/kindRegistryRoster.js is the roster of record)',
    ).toBe(REGISTRIES.length);
    for (const [name, rows] of REGISTRIES) {
      expect(rows.length, `${name}: registry is empty`).toBeGreaterThanOrEqual(1);
    }
    // ⭐ THE OLD BLANKET FLOOR OF FIVE IS KEPT AS AN EXACT EXCEPTION LIST RATHER THAN LOWERED
    // FOR EVERYBODY. Every registry was multi-kind until IN-1c-a landed the estate's first
    // deliberately ONE-ROW family (its two siblings have no honest producer at this base and
    // re-file behind their own charter, so minting them now would register kinds whose pools
    // can never render). Lowering the loop above to a bare non-emptiness check would have
    // silently released the other NINE families from any width guard at all; naming the sole
    // exception instead keeps all nine at five-or-more by exact equality AND makes a SECOND
    // small family a visible, reviewed act rather than a number that quietly slipped.
    expect(REGISTRIES.filter(([, rows]) => rows.length < 5).map(([name]) => name))
    // ⭐ THE SECOND SMALL FAMILY, AND ITS ADMISSION IS THE REVIEWED ACT THIS LIST EXISTS TO
    // FORCE (ODQ §309.3 / §347.1(2), ruled at §350). WF-8a mints FAITH as a ONE-ROW family
    // because the FAITH volume's remaining narration kinds each need their own producer and
    // this member carries the one beat whose producer already exists — the sequencing WF-8's
    // multi-member arithmetic imposes, not a preference. The ORDER below is the registry
    // declaration order and was taken from this arm's own output, never predicted.
    // ⛔ THE SHRINK-BACK IS A RECORDED OBLIGATION of the next WF-8 member that takes FAITH to
    // five rows or more: strike FAITH from this list in that same commit. It is deferred and
    // written down here rather than dropped.
    // ⭐ THE THIRD SMALL FAMILY, AND ITS ADMISSION IS AGAIN THE REVIEWED ACT THIS LIST EXISTS TO
    // FORCE. ENC-4 minted CHANCE_MEETING as a ONE-ROW family because the annex's second authored
    // kind (`chance_meeting_exposed`) could not be wired from the stage's typed seed: that seed
    // carried no approach DIRECTION, so `{npc}` (who offered) and `{counterpart}` (who refused)
    // had no honest assignment.
    // ⭐ ENC-4b CURED THAT AT ITS SOURCE and CHANCE_MEETING IS NOW TWO ROWS — measured, not
    // assumed: the direction lives on the receipt's own exposure grievance, and the stage now
    // carries it. TWO IS STILL UNDER FIVE, so the family STAYS on this list and the shrink-back
    // obligation below is unpaid, not forgiven. ⚠ It is halfway, and it is recorded as halfway
    // rather than allowed to read as a family that never moved.
    // ⛔ THE SHRINK-BACK IS A RECORDED OBLIGATION of the member that takes CHANCE_MEETING to five
    // rows or more: strike it from this list in that same commit.
    // ⭐ ROSTER-ONLY, like ROUTED_TOKENS: no scanner reads this list out of this file, so the
    // reviewed act of admitting a small family is recorded in the roster of record instead.
      .toEqual([...KIND_REGISTRATION_FREEZES.smallFamilies]);
    expect(ALL_ROWS).toHaveLength(REGISTERED_KIND_COUNT);
    expect(REGISTERED_KINDS.size, 'two registries claim the same kind').toBe(REGISTERED_KIND_COUNT);
    expect(
      KIND_REGISTRATION_FREEZES.registeredKinds,
      'the roster and this walker disagree on the registered-kind census — move BOTH',
    ).toBe(REGISTERED_KIND_COUNT);
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
    expect(LEGACY_UNDER_FLOOR).toHaveLength(23);
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
    expect(
      KIND_REGISTRATION_FREEZES.unvoicedTokens,
      'the roster and this walker disagree on the unvoiced ceiling — move BOTH',
    ).toBe(LEGACY_UNVOICED_TOKENS);
  });

  test('the census arithmetic closes — no token is counted twice or lost', () => {
    // Every routed token is either registered or unvoiced, and the two partition the table.
    const routedAndRegistered = Object.keys(EXACT_SECTION).filter((t) => REGISTERED_KINDS.has(t));
    expect(routedAndRegistered.length + unvoiced.length).toBe(ROUTED_TOKENS);
    // Eight registered kinds route by no EXACT_SECTION row (dossier lines and the GRAMMAR
    // rows that file no desk; +1 at GR-4b-iii-b, +1 at IN-1c-a's `mirror_standing_line`).
    // Stated as a measurement so a kind that quietly LOST its routing is visible rather than
    // absorbed.
    // ⛔ THE `8` IS PARSED OUT OF THIS LINE by scripts/base-state-capsule.mjs (:385) and
    // re-read by regex in tests/scripts/baseStateCapsule.test.js (:158). Bare literal, this
    // exact spelling; the roster equality below binds it.
    expect(REGISTERED_KIND_COUNT - routedAndRegistered.length).toBe(8);
    expect(
      KIND_REGISTRATION_FREEZES.registeredMinusRouted,
      'the roster and this walker disagree on the registered-minus-routed divergence — move BOTH',
    ).toBe(REGISTERED_KIND_COUNT - routedAndRegistered.length);
  });
});
