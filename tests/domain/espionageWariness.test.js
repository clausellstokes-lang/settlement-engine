/**
 * espionageWariness.test.js — ES-5: the missing-NPC tell's visibility predicate.
 *
 * ⟨F3⟩ IS A CONJUNCTION AND THIS FILE PROVES BOTH SIDES OF IT WITH THE SAME ROW. The law
 * says an IN-SCHEDULE, FULLY-COVERT mission contributes ZERO wariness at its target. A pin
 * that only asserted the zero would be satisfied by a predicate that counts nothing at all,
 * which is the vacuity shape this estate has shipped before — so every negative below is
 * anchored by the SAME mission one tick past its declared clock, counting ONE. The
 * difference between the two readings is a single tick and nothing else: same world, same
 * row, same covert sub-record.
 *
 * AND THE ROW IS REAL. Every mission here is minted through `mintEnvoyErrand` — the
 * production writer — and read back out of the ledger through `envoyErrandsOf`. A
 * hand-shaped errand would let the persistence DTO drift out from under the whole file, and
 * it would also make the covert-silence claim worthless: the point is that a row a save
 * file can actually hold contributes nothing while it is on time.
 *
 * ── THE EXECUTED MUTANT RECORD (ES-5a build, cp backup + cmp restore each) ───────────────
 * Five plants against this file's own claims, each run and each RED, each restored
 * byte-identically in the same shell. They are recorded here because the sweep script's own
 * revert is `git checkout --`, which this program's shared-tree protocol forbids outright
 * (the recorded reason at scripts/mutation-coverage-manifest.json's
 * sovereignty-lighting rationale), so the plants are run by hand and their results written
 * where the next reader of these pins will find them.
 *
 *   M1 — the FOREIGN fence deleted (`errand.from === observer` skip)      → 1 failed / 8.
 *   M2 — the fence-post loosened (`now > arrival` → `>=`)                 → 4 failed / 5.
 *   M3 — the lookback deleted                                            → 1 failed / 8.
 *   M4 — the cluster membership check deleted                            → 1 failed / 8.
 *   M7 — `overdueNotables` dropped from the gauntlet's wariness fold      → 2 failed / 46
 *        (run across this file, the doctrine stage, the ES-5 fence and ES-2's battery).
 *
 * ── THE REPAIR ROUND'S OWN PLANTS ───────────────────────────────────────────────────────
 *   M9  — the declared-absent ARM dropped, leaving only the weight (the ES-5a register)
 *                                                                    → 1 failed / 33.
 *   M10 — the five explicit no-tell arms collapsed back into ES-5a's one shared
 *         `state_raises_no_tell` catch-all                            → 1 failed / 10.
 *   M11 — `TELL_TERMS_ABSENT` EMPTIED, which is the exact drift an anchored negative
 *         exists to catch                                             → 1 failed / 10,
 *         on the helper's own LIVENESS ANCHOR message.
 *   M11b — ⚠⚠ THE ONE THAT PROVES THE FINDING RATHER THAN THE FIX. With the register
 *         still EMPTIED, the assertion was reverted to ES-5a's spelling —
 *         `expectAbsentWithAnchor([...TELL_TERMS_ABSENT, 'overdueForeignNotables'], …,
 *         'overdueForeignNotables', …)` — and the file went 10 passed / 10, GREEN. The
 *         anchor was appended to the subject BY THE TEST on the same line, so the liveness
 *         half was a tautology and the whole collection could vanish underneath it. That
 *         is the vacuity tests/helpers/anchoredNegatives.js names verbatim in its own
 *         header; M11 and M11b are the same world one edit apart, and only one of them
 *         can see it.
 * M5, M6 and M8 are the doctrine stage's and are recorded in its own file's header.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  LAPSE_KINDS,
  LAPSE_STATES,
  NO_TELL_STATES,
  TELL_TERMS_ABSENT,
  TELL_TUNING,
  declaredScheduleLapse,
  observerClusterIds,
  overdueForeignNotables,
} from '../../src/domain/worldPulse/espionage/espionageWariness.js';
import { ENVOY_ERRAND_STATES } from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import {
  catchChance01,
  wariness01Core,
} from '../../src/domain/worldPulse/espionage/espionageMath.js';
import { gauntletCatchFactors } from '../../src/domain/worldPulse/espionage/espionageGauntlet.js';
import { envoyErrandsOf } from '../../src/domain/worldPulse/envoyErrand.js';
import { litCovertWorld, mintCovertFixture } from '../helpers/covertMissionFixture.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/espionage/espionageWariness.js';

/** The default fixture plan: ashford → westmarch (arrive 12) → irontown (arrive 22). The
 *  ANNOUNCED ARRIVAL at the target is therefore 22, and 23 is the first overdue tick. */
const ANNOUNCED_ARRIVAL = 22;

/** A FULLY-COVERT itinerary: every stop wears a covert face, so nothing about this journey
 *  is publicly a visit anywhere. It is the hardest case for ⟨F3⟩ and the one the law names. */
const FULLY_COVERT = Object.freeze({
  demand: 'confirm',
  product: 'confirm',
  subjectId: 'irontown',
  itinerary: [
    { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
    { face: 'covert', settlementId: 'irontown', stayTicks: 2 },
  ],
});

/** @param {Record<string, unknown>} options */
function missionWorld(options = {}) {
  const { worldState } = mintCovertFixture(litCovertWorld(), options);
  return { worldState, errands: envoyErrandsOf(worldState) };
}

/** The tell as the target itself reads it. @param {unknown} errands @param {number} tick */
function tellAt(errands, tick, observerId = 'irontown', clusterIds = []) {
  return overdueForeignNotables({
    errands, observerId, clusterIds, tick,
  });
}

describe('ES-5 ⟨F3⟩ — the covert-silence negative, and the declared-face-lapsed positive', () => {
  test('a REAL fully-covert mission contributes ZERO while in schedule, and ONE past it', () => {
    const { errands } = missionWorld({ covert: FULLY_COVERT });
    // LIVENESS: the row really is a covert mission, minted and read back out of the ledger.
    // Without this the zero below could be the zero of an empty ledger.
    expect(errands).toHaveLength(1);
    expect(errands[0].state).toBe('travelling');
    expect(errands[0].covert.itinerary.map((s) => s.face)).toEqual(['covert', 'covert']);

    // THE LAW. In schedule ⇒ silent, at every tick up to and including the announced one.
    for (const tick of [10, 12, 15, 21, ANNOUNCED_ARRIVAL]) {
      expect(tellAt(errands, tick).count, `in schedule at tick ${tick}`).toBe(0);
    }
    // THE ANCHOR. The SAME row, one tick later, is loud — so the zeros above are a fence
    // and not a predicate that counts nothing.
    const overdue = tellAt(errands, ANNOUNCED_ARRIVAL + 1);
    expect(overdue.count).toBe(1);
    expect(overdue.rows[0]).toMatchObject({
      kind: 'never_arrived', placeId: 'irontown', dueTick: ANNOUNCED_ARRIVAL,
    });
  });

  test('the DECLARED-FACE mission behaves identically — the predicate never sees the face', () => {
    // The conjunction's other side. An ordinary diplomatic errand on the same schedule is
    // counted on exactly the same rule, which is what proves the covert zero above came
    // from the SCHEDULE and not from some covert-shaped exclusion nobody can see.
    const { errands } = missionWorld({ plain: true });
    expect(errands[0].covert).toBeUndefined();
    expect(tellAt(errands, ANNOUNCED_ARRIVAL).count).toBe(0);
    expect(tellAt(errands, ANNOUNCED_ARRIVAL + 1).count).toBe(1);
  });

  test('the FOREIGN fence: a court is never made wary by its OWN overdue people', () => {
    const { errands } = missionWorld({ covert: FULLY_COVERT });
    // ashford SENT this mission. Its own embassy running late is home-side business
    // (`advanceEnvoySilence`, J-ES-14) and must not raise ashford's own guard.
    expect(tellAt(errands, ANNOUNCED_ARRIVAL + 1, 'ashford', ['irontown']).count).toBe(0);
    // The anchor that keeps that zero honest: the SAME row, the SAME tick, read by the
    // court that was expecting him.
    expect(tellAt(errands, ANNOUNCED_ARRIVAL + 1, 'irontown').count).toBe(1);
  });

  test('the CLUSTER arm counts a neighbour’s lapse, and only a neighbour’s', () => {
    const { errands } = missionWorld({ covert: FULLY_COVERT });
    const tick = ANNOUNCED_ARRIVAL + 1;
    // A court that is NOT the destination and names no cluster hears nothing.
    expect(tellAt(errands, tick, 'westmarch').count).toBe(0);
    // The same court, once irontown is in its cluster, hears it.
    expect(tellAt(errands, tick, 'westmarch', ['irontown']).count).toBe(1);
    // And the cluster is read off the graph's own edge shape, both directions.
    expect(observerClusterIds({
      edges: [
        { from: 'westmarch', to: 'irontown', relationshipType: 'rival' },
        { from: 'ashford', to: 'westmarch', relationshipType: 'hostile' },
        { from: 'far', to: 'away', relationshipType: 'allied' },
      ],
    }, 'westmarch')).toEqual(['ashford', 'irontown', 'westmarch']);
    // A graph with no edges still yields the observer itself, never an empty set: a town
    // can always notice a visit to its own gate.
    expect(observerClusterIds({}, 'westmarch')).toEqual(['westmarch']);
    expect(observerClusterIds({}, '')).toEqual([]);
  });

  test('the LOOKBACK forgets: an ancient disappointment is not a standing alarm', () => {
    const { errands } = missionWorld({ covert: FULLY_COVERT });
    const last = ANNOUNCED_ARRIVAL + TELL_TUNING.LAPSE_LOOKBACK_TICKS;
    expect(tellAt(errands, last).count, 'the last tick inside the window').toBe(1);
    expect(tellAt(errands, last + 1).count, 'one tick past the window').toBe(0);
  });

  test('the two lapse KINDS are both reachable, and every other state raises no tell', () => {
    const legs = [
      { fromId: 'ashford', toId: 'irontown', departTick: 10, arrivalTick: 14 },
    ];
    const { errands } = missionWorld({ legs });
    const row = errands[0];
    // `never_arrived` — the announced visit that did not turn up.
    expect(declaredScheduleLapse({ errand: row, tick: 14 }).lapsed).toBe(false);
    expect(declaredScheduleLapse({ errand: row, tick: 15 })).toMatchObject({
      lapsed: true, kind: 'never_arrived', placeId: 'irontown', dueTick: 14,
    });
    // `never_left` — the announced guest still sitting there past his own return date.
    // The fixture's `expectedReturnTick` is arrival + 18 = 32.
    const parlaying = { ...row, state: 'parlaying' };
    expect(row.expectedReturnTick).toBe(32);
    expect(declaredScheduleLapse({ errand: parlaying, tick: 32 }).lapsed).toBe(false);
    expect(declaredScheduleLapse({ errand: parlaying, tick: 33 })).toMatchObject({
      lapsed: true, kind: 'never_left', placeId: 'irontown', dueTick: 32,
    });
    // Both members of the closed set are reached above, and no third word exists.
    expect(LAPSE_KINDS).toEqual(['never_arrived', 'never_left']);
    // Garbage in, silence out — never an invented lapse.
    expect(declaredScheduleLapse({ errand: row, tick: -1 }).reason).toBe('invalid_tick');
    expect(declaredScheduleLapse({ errand: { state: 'travelling' }, tick: 5 }).reason)
      .toBe('no_declared_route');
    expect(overdueForeignNotables().count).toBe(0);
  });

  test('⭐ THE STATE CENSUS — every live errand state is routed EXPLICITLY, none by a catch-all', () => {
    // ES-5a routed five of seven states into one trailing catch-all whose comment argued
    // three. This is the walker half of the MIRROR-NOT-IMPORT pair: the leaf declares its
    // state set locally (it imports nothing — that is ⟨F3⟩'s whole fence), and the equality
    // below is what keeps the local copy from rotting away from the real vocabulary.
    expect([...LAPSE_STATES, ...NO_TELL_STATES].sort())
      .toEqual([...ENVOY_ERRAND_STATES].sort());
    // The two halves are disjoint — a state that both lapses and raises no tell would make
    // the union above pass while the routing contradicted itself.
    expect(LAPSE_STATES.filter((s) => NO_TELL_STATES.includes(s))).toEqual([]);

    const legs = [{ fromId: 'ashford', toId: 'irontown', departTick: 10, arrivalTick: 14 }];
    const { errands } = missionWorld({ legs });
    const row = errands[0];
    const reasonFor = (state) => declaredScheduleLapse({
      errand: { ...row, state, expectedReturnTick: 32 }, tick: 999,
    });
    // EVERY no-tell state answers with its OWN argued reason, and NONE of them lapses. A
    // shared reason string is what let two states go unargued in the first place.
    const reasons = Object.fromEntries(NO_TELL_STATES.map((s) => [s, reasonFor(s).reason]));
    expect(reasons).toEqual({
      held: 'fate_is_visible',
      home: 'schedule_kept',
      intercepted: 'fate_is_visible',
      lost: 'absence_already_accounted',
      returning: 'schedule_kept',
    });
    for (const state of NO_TELL_STATES) expect(reasonFor(state).lapsed).toBe(false);
    // …and the anchor that keeps those five falses honest: the SAME row in a lapsing state
    // at the SAME tick really does lapse, so the zeros are the routing and not the fixture.
    for (const state of LAPSE_STATES) expect(reasonFor(state).lapsed).toBe(true);

    // ⭐ THE POINT OF THE WHOLE CENSUS: a state nobody has minted yet does NOT join the
    // no-tell bucket. It lands in its own arm, which is the tell that a vocabulary grew.
    expect(reasonFor('sequestered').reason).toBe('unrecognized_state');
    // And the lookup is an OWN-KEY test, so a row whose state names a prototype member is
    // an unrecognized state rather than a truthy non-reason off Object.prototype.
    for (const poison of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      expect(reasonFor(poison), poison).toMatchObject({
        lapsed: false, reason: 'unrecognized_state',
      });
    }
  });

  test('the absent ARM and the absent WEIGHT are both DECLARED, and the live term is not among them', () => {
    // ⚠ THE ANCHOR IS THE PIPELINE'S, NOT THIS TEST'S. ES-5a wrote the anchor INTO the
    // subject on the assertion line — `[...TELL_TERMS_ABSENT, 'overdueForeignNotables']` —
    // so the liveness half could never fail no matter what the register did, which is the
    // exact shape tests/helpers/anchoredNegatives.js names in its own header: "A hardcoded
    // constant that the pipeline never touches is not an anchor — it re-introduces the
    // vacuity one level up." The collection below is the register as a REAL READ hands it
    // back, and the anchor is a member the leaf itself put there.
    const read = tellAt(missionWorld({ covert: FULLY_COVERT }).errands, ANNOUNCED_ARRIVAL + 1);
    expect(read.count, 'the read that carries the register must be a live one').toBe(1);
    expectAbsentWithAnchor(
      read.termsAbsent,
      'overdueNotables',
      'believedNotorietyWeighting',
      'the §3.8 declared-absent register',
    );
    // BOTH absences, in codepoint order: §3.8's union ARM (b) and the weight over the
    // union. ES-5a declared only the weight, which reads as "the union is built, one
    // multiplier is missing" — it is not, and the arm is the bigger silence of the two.
    expect(TELL_TERMS_ABSENT).toEqual(['believedNotorietyWeighting', 'heldAbsenceBeliefs']);
    expect([...TELL_TERMS_ABSENT].sort()).toEqual([...TELL_TERMS_ABSENT]);
    // The register a real read hands back IS the export, not a copy that can drift.
    expect(read.termsAbsent).toBe(TELL_TERMS_ABSENT);
  });
});

describe('ES-5 — the fence is the module’s own emptiness', () => {
  test('the visibility predicate imports NOTHING, and the scan reds on a plant', () => {
    // THE WHOLE OF ⟨F3⟩'s STRUCTURAL GUARANTEE. A module with no imports cannot resolve a
    // true purpose, cannot reach a covert reader, and cannot grow one without this reddening
    // — which is a stronger statement than any blacklist of forbidden spellings, because a
    // blacklist is a credit-side enumeration and those fail open (the recorded class).
    const source = readFileSync(join(ROOT, LEAF), 'utf8');
    const importsOf = (/** @type {string} */ text) => [
      ...text.matchAll(/(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g),
    ].map((m) => m[1]);
    expect(importsOf(source)).toEqual([]);
    // POSITIVE CONTROL: the detector really detects. Without this the emptiness above could
    // be the emptiness of a regex that stopped matching.
    const planted = `import { normalizeErrand } from '../envoyErrandRecords.js';\n${source}`;
    expect(importsOf(planted)).toEqual(['../envoyErrandRecords.js']);
    // And the words themselves appear nowhere as a READ — only in the header's prose, which
    // is why this asserts on code lines rather than on the file.
    const code = source.split('\n').filter((line) => !/^\s*(\*|\/\*|\/\/)/.test(line)).join('\n');
    expect(code).toContain('overdueForeignNotables');
    // anchored: the live export name one line up proves `code` is the real stripped source.
    expect(code).not.toMatch(/truePurpose|\.covert\b/);
  });
});

describe('ES-5 — the sibling header stops restating a term that moved', () => {
  const SIBLING = 'src/domain/worldPulse/espionage/espionageProductStage.js';

  test('the product stage points at the REGISTER instead of naming a term that went live', () => {
    // THE HAND-RESTATED-FACT FAMILY. ES-2's sibling header said its detections name
    // `overdueForeignNotables` as ABSENT. ES-5 built that predicate, made the term LIVE, and
    // updated the assertion in ES-2's battery — but not this header, and nothing pinned it.
    // A stale cross-reference is exactly as wrong as a stale assertion and reds nowhere.
    const source = readFileSync(join(ROOT, SIBLING), 'utf8');
    // LIVENESS FIRST — a scan over a file that failed to load, or over a path that moved,
    // would report a clean absence forever. The corpus is real and it is the right file.
    expect(source.length).toBeGreaterThan(1000);
    expect(source).toContain('espionageProductStage.js');
    // The header points at the register, which cannot go stale when a member changes.
    expect(source).toContain('TELL_TERMS_ABSENT');
    // …and the retired restatement is gone. `overdueForeignNotables` is a LIVE term now, so
    // this file naming it among the absences is the defect, in either direction.
    // A file that failed to load, or moved, reds on the positive above instead of here.
    // anchored: the live `TELL_TERMS_ABSENT` mention is asserted on the SAME string above.
    expect(source).not.toContain('name `overdueForeignNotables`');
    // POSITIVE CONTROL: the detector really detects. Without this the absence above could be
    // the absence of a needle nobody would have found either way.
    expect(`${source}name \`overdueForeignNotables\``).toContain('name `overdueForeignNotables`');
    // And the term this header now points at really is the one the leaf publishes.
    expect(TELL_TERMS_ABSENT).toContain('believedNotorietyWeighting');
    // This exclusion cannot be satisfied by a register that drifted away to nothing.
    // anchored: the live member asserted one line up proves the register is populated.
    expect(TELL_TERMS_ABSENT).not.toContain('overdueForeignNotables');
  });
});

describe('ES-5 — the tell reaches the catch roll, and moves it', () => {
  const SNAPSHOT = Object.freeze([
    {
      id: 'ashford', name: 'Ashford', crimeRate: 'moderate', safety: 'guarded', wealth: 'moderate', population: 4000,
    },
    {
      id: 'irontown',
      name: 'Irontown',
      crimeRate: 'rampant',
      safety: 'lawless',
      wealth: 'poor',
      population: 2500,
      activeConditions: [{ id: 'c1' }, { id: 'c2' }],
    },
  ]);
  const GRAPH = Object.freeze({
    edges: [{ from: 'ashford', to: 'irontown', relationshipType: 'hostile' }],
  });

  /** @param {Record<string, unknown>} worldState @param {number} tick */
  function factorsAt(worldState, tick) {
    return gauntletCatchFactors({
      worldState,
      regionalGraph: GRAPH,
      homeId: 'ashford',
      homeItem: SNAPSHOT[0],
      targetItem: SNAPSHOT[1],
      tick,
      dwell: { settlementId: 'irontown', stopIndex: 1, intervalIdx: 0 },
    });
  }

  test('a court whose announced guest never came catches the next man harder', () => {
    // TWO MISSIONS, because the one that is overdue must be a DIFFERENT journey from the one
    // being priced — a court is made wary by the man who did not arrive, not by the man
    // standing in front of it.
    const first = mintCovertFixture(litCovertWorld(), { covert: FULLY_COVERT });
    const both = mintCovertFixture(first.worldState, {
      from: 'harrow',
      to: 'irontown',
      npcId: 'npc.other',
      // The plan must start where the offer says the sender is; the route plan is validated
      // against the offer's own origin, so a second court needs its own road.
      legs: [{ fromId: 'harrow', toId: 'irontown', departTick: 10, arrivalTick: ANNOUNCED_ARRIVAL }],
      covert: {
        ...FULLY_COVERT,
        itinerary: [{ face: 'covert', settlementId: 'irontown', stayTicks: 2 }],
      },
    });
    expect(envoyErrandsOf(both.worldState)).toHaveLength(2);

    const calm = factorsAt(both.worldState, ANNOUNCED_ARRIVAL);
    const wary = factorsAt(both.worldState, ANNOUNCED_ARRIVAL + 1);
    // THE TERM MOVED, not merely the chance — the drop discipline ES-2's battery records:
    // asserting only the chance lets a world edit that shifts two terms hide a dead one.
    expect(calm.overdueNotables).toBe(0);
    expect(wary.overdueNotables).toBe(2);
    expect(calm.wariness01).toBe(0);
    expect(wary.wariness01).toBeGreaterThan(0);
    // …and it is the ARITHMETIC's own answer for that count, not a number this file made up.
    expect(wary.wariness01).toBe(wariness01Core({ overdueNotables: 2, recentCovertHolds: 0 }));
    // THE CONSEQUENCE. A wary town is a more dangerous town.
    expect(catchChance01(wary)).toBeGreaterThan(catchChance01(calm));
    // The declaration travels with the reading in both states.
    expect(calm.warinessTermsAbsent).toEqual(TELL_TERMS_ABSENT);
    expect(wary.warinessTermsAbsent).toEqual(TELL_TERMS_ABSENT);
    // POINT, DON'T RESTATE: the gauntlet must hand back the leaf's OWN register, so a term
    // added or dropped at the leaf cannot leave this detection receipt quoting a stale set.
    expect(wary.warinessTermsAbsent).toBe(TELL_TERMS_ABSENT);
  });
});
