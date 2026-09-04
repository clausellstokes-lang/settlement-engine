/**
 * livedExperienceFunnel.test.js — the funnel's laws (W-LIVES car L3).
 *
 * Six things are pinned here, and each exists because its absence has a name in
 * this estate's history:
 *
 *   CLOSEST-PLANE-WINS. One person learns one event ONCE, at the closest distance
 *   it reached them — and two different people learning the same event is NOT that
 *   and must survive. Both directions are proved, because a dedupe that also
 *   silences the second person would be a cure worse than the disease.
 *
 *   THE WALLPAPER GUARD, PROVED BY A CONTROL. A raw movement that crosses no band,
 *   reverses nothing and displaces nobody must emit ZERO receipts while still
 *   MOVING THE WORLD. A guard tested only by things that should emit is a guard
 *   nobody has tested.
 *
 *   THE F9 SOURCE LAW (§853). No source may emit a pull that cannot cross the
 *   floor. A per-tick ambient emission is REFUSED, in a receipt, rather than
 *   silently marking nobody forever — which is precisely the failure L2 measured.
 *
 *   RECEIPTED REFUSALS. Every door this funnel closes says which door it was.
 *   "Nothing happened" and "nothing COULD happen here" are different facts.
 *
 *   THE ANTI-RATCHET WALK HOME, through SP-5b's one decay shape, and F9's delete
 *   in the direction that matters: a soul all the way home serializes as one that
 *   never left.
 *
 *   DARK BY CONSTRUCTION, and ONE DOOR. No src importer, and no second flag — a
 *   family with two switches has a half-lit state nobody ever tests.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered
 * suite is TEST_UNREGISTERED to the lighting census and its assertions are then
 * evidence nowhere, however green vitest reports it.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  AMBIENT_CADENCE_TICKS,
  CHARACTER_LEGACY_KIND,
  CHARACTER_STOCK_KIND,
  FUNNEL_REFUSALS,
  FUNNEL_TUNING,
  HOMEWARD_DECAY_CAUSE,
  NEUTRAL_BAND,
  SPECTRUM_BAND_LADDER,
  TOP_POSITIONS,
  bandWordOf,
  characterLegacyRecord,
  chartOrderOf,
  decayCharacterDrift,
  displacementsBetween,
  effectiveChartOf,
  foldLivedExperience,
  topPositionsOf,
} from '../../../src/domain/npc/livedExperienceFunnel.js';
import {
  AXIS_LEVELS,
  MATERIALIZATION_EPSILON,
  axisOffsetAt,
  axisOffsetOf,
  characterDriftOf,
  driftEntryOf,
} from '../../../src/domain/npc/characterDrift.js';
import { HALF_LIFE_BANDS } from '../../../src/domain/worldPulse/bandedStock.js';
import { INTERVAL_WEEKS } from '../../../src/domain/worldPulse/intervalWeeks.js';
import { durableIdForRoster, npcLedgerOf } from '../../../src/domain/worldPulse/npcLedger.js';
import { SOURCE_UNVERIFIED_KINDS, EXPERIENCE_TABLE } from '../../../src/domain/npc/livedExperienceCatalog.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const TOWN = 'save.town';

/** A world with BOTH doors open: the drift flag and the ledger the mint needs. */
const lit = () => ({ tick: 10, simulationRules: { characterDriftEnabled: true, npcConsequencesEnabled: true } });
/** The same world with the drift door shut. */
const dark = () => ({ tick: 10, simulationRules: { npcConsequencesEnabled: true } });
/** Drift on, ledger dark — there is no identity to key on, so nothing may be written. */
const noLedger = () => ({ tick: 10, simulationRules: { characterDriftEnabled: true } });

const npc = (id, name, axes = {}) => ({ id, name, role: 'Reeve', character: { axes } });
const entry = (kind, subject, eventId, extra = {}) =>
  ({ kind, settlementId: TOWN, settlementSeed: 'seed', npc: subject, eventId, ...extra });
const idOf = (worldState, subject) =>
  durableIdForRoster(worldState, TOWN, { rosterId: subject.id, name: subject.name, role: subject.role });
const reasons = (result) => result.refusals.map((row) => row.reason);
const kindsOf = (result) => result.receipts.map((row) => `${row.kind}:${row.axisId}`);

// `turned_by_crime` is the workhorse: family `fall` steps 0, so its heavy JUSTICE
// pull is one FULL band and reaches a crossing in a single event.
const ALDA = npc('npc_1', 'Alda', { JUSTICE: { pole: 'virtue', level: 'a_touch' } });

describe('THE LADDER AND THE TUNING — derived, never authored', () => {
  test('the 7-rung ladder is built from L2\'s band words and is all tokens', () => {
    expect(SPECTRUM_BAND_LADDER.length).toBe(2 * AXIS_LEVELS.length + 1);
    expect([...SPECTRUM_BAND_LADDER]).toEqual([
      'vice_defining', 'vice_marked', 'vice_a_touch',
      'neutral',
      'virtue_a_touch', 'virtue_marked', 'virtue_defining',
    ]);
    expect(SPECTRUM_BAND_LADDER[AXIS_LEVELS.length]).toBe(NEUTRAL_BAND);
    // Every rung must satisfy bandedStock's token rule, or a crossing receipt
    // THROWS at mint time instead of reaching prose.
    for (const rung of SPECTRUM_BAND_LADDER) expect(rung).toMatch(/^[a-z][a-z_]*$/);
    expect(CHARACTER_STOCK_KIND).toMatch(/^[a-z][a-z_]*$/);
    expect(HOMEWARD_DECAY_CAUSE).toMatch(/^[a-z][a-z_]*$/);
  });

  test('faint IS the materialization floor, and heavy is exactly one full band', () => {
    // This is the F9 amendment made structural: the smallest thing a source may
    // say is exactly the smallest thing that can be recorded.
    expect(FUNNEL_TUNING.magnitudes.faint).toBe(MATERIALIZATION_EPSILON);
    expect(FUNNEL_TUNING.magnitudes.firm).toBe(2 * MATERIALIZATION_EPSILON);
    expect(FUNNEL_TUNING.magnitudes.heavy).toBe(1);
    for (const magnitude of Object.values(FUNNEL_TUNING.magnitudes)) {
      expect(magnitude).toBeGreaterThanOrEqual(MATERIALIZATION_EPSILON);
    }
  });

  test('the family steps are a MECHANICAL tercile over the pack ladder, not invented rates', () => {
    expect(FUNNEL_TUNING.familyStep).toEqual({
      ordeal: 0, bond: 0, fall: 0, career: 0,
      house: -1, realm: -1, creed: -1,
      repute: -2, word: -2, milieu: -2,
    });
    // Monotone: a lighter family never teaches harder than a heavier one.
    const steps = Object.values(FUNNEL_TUNING.familyStep);
    for (let i = 1; i < steps.length; i += 1) expect(steps[i]).toBeLessThanOrEqual(steps[i - 1]);
  });

  test('the decay band is CHOSEN from the shared ladder, and the cadence from the one time truth', () => {
    expect(HALF_LIFE_BANDS).toContain(FUNNEL_TUNING.decayBand);
    expect(AMBIENT_CADENCE_TICKS).toBe(INTERVAL_WEEKS.one_season);
    expect(FUNNEL_TUNING.signedBy).toBeNull();
    expect(FUNNEL_TUNING.ownerRows.length).toBeGreaterThanOrEqual(4);
  });

  test('the refusal vocabulary is closed and sorted', () => {
    expect(FUNNEL_REFUSALS.length).toBe(12);
    expect([...FUNNEL_REFUSALS]).toEqual([...FUNNEL_REFUSALS].sort());
    for (const reason of FUNNEL_REFUSALS) expect(reason).toMatch(/^[a-z][a-z_]*$/);
  });
});

describe('THE GATE — one door for the whole family', () => {
  test('dormant is a whole-entry-point early return, and it says so', () => {
    const worldState = dark();
    const out = foldLivedExperience({ worldState, entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11 });
    // The SAME reference: a dark fold cannot even look like it touched the world.
    expect(out.worldState).toBe(worldState);
    expect(out.receipts).toEqual([]);
    expect(reasons(out)).toEqual(['dormant']);
    expect(out.applied).toBe(0);
  });

  test('decay is dormant through the same one door', () => {
    const worldState = dark();
    const out = decayCharacterDrift({ worldState, subjects: [{ settlementId: TOWN, npc: ALDA }], tick: 99 });
    expect(out.worldState).toBe(worldState);
    expect(out.moved).toBe(0);
  });

  test('NO DRIFT WITHOUT A DURABLE IDENTITY — a dark ledger refuses, it does not fall back', () => {
    const out = foldLivedExperience({ worldState: noLedger(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11 });
    expect(reasons(out)).toEqual(['no_durable_identity', 'no_durable_identity']);
    expect(characterDriftOf(out.worldState)).toEqual({});
  });
});

describe('CLOSEST-PLANE-WINS — a dedupe over (person, event), not a filter', () => {
  test('one person, one event, two planes: the PERSONAL lesson is the one that lands', () => {
    const dett = npc('npc_4', 'Dett');
    const pair = [entry('goal_culminated', dett, 'evX'), entry('home_liberated', dett, 'evX')];
    const out = foldLivedExperience({ worldState: lit(), entries: pair, tick: 11 });
    const chart = driftEntryOf(out.worldState, idOf(out.worldState, dett));
    // goal_culminated (personal/career) pulls CONTENT and TEMPERANCE;
    // home_liberated (affiliation/realm) pulls CHEER and FORBEARANCE. Only one set
    // may appear, and it must be the closer one.
    expect(Object.keys(chart).sort()).toEqual(['CONTENT', 'TEMPERANCE']);
  });

  test('and the survivor is a property of the SET, not of arrival order', () => {
    const dett = npc('npc_4', 'Dett');
    const pair = [entry('goal_culminated', dett, 'evX'), entry('home_liberated', dett, 'evX')];
    const forward = foldLivedExperience({ worldState: lit(), entries: pair, tick: 11 });
    const reversed = foldLivedExperience({ worldState: lit(), entries: [...pair].reverse(), tick: 11 });
    expect(JSON.stringify(forward.worldState)).toBe(JSON.stringify(reversed.worldState));
    expect(kindsOf(forward)).toEqual(kindsOf(reversed));
  });

  test('⭐ a SAME-PLANE tie breaks on the kind\'s codepoint, not on who arrived first', () => {
    // Both kinds are PERSONAL, so the plane cannot separate them. Without an
    // explicit tie-break the survivor would be whichever entry the caller happened
    // to push first — a world that differs by input order, which is the class every
    // codepoint fold in this estate exists to prevent.
    const dett = npc('npc_4', 'Dett');
    const pair = [entry('goal_culminated', dett, 'evX'), entry('promotion_won', dett, 'evX')];
    const forward = foldLivedExperience({ worldState: lit(), entries: pair, tick: 11 });
    const reversed = foldLivedExperience({ worldState: lit(), entries: [...pair].reverse(), tick: 11 });
    expect(JSON.stringify(forward.worldState)).toBe(JSON.stringify(reversed.worldState));
    // ...and the winner is the codepoint-first kind, whichever way they arrived:
    // goal_culminated pulls CONTENT/TEMPERANCE, promotion_won pulls CHEER/HUMILITY.
    for (const out of [forward, reversed]) {
      expect(Object.keys(driftEntryOf(out.worldState, idOf(out.worldState, dett))).sort())
        .toEqual(['CONTENT', 'TEMPERANCE']);
    }
  });

  test('TWO PEOPLE, ONE EVENT: both learn — that is the design, not double-counting', () => {
    const dett = npc('npc_4', 'Dett');
    const emm = npc('npc_5', 'Emm');
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('goal_culminated', dett, 'evY'), entry('home_liberated', emm, 'evY')],
      tick: 11,
    });
    // If the dedupe keyed on the EVENT alone, the second person would be silenced.
    expect(Object.keys(characterDriftOf(out.worldState)).length).toBe(2);
  });

  test('ONE PERSON, TWO EVENTS of the same kind: both teach, and they accumulate', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e1'), entry('turned_by_crime', ALDA, 'e2')],
      tick: 11,
    });
    // The `fall` family teaches JUSTICE at one full band; two events is two bands.
    expect(axisOffsetOf(out.worldState, idOf(out.worldState, ALDA), 'JUSTICE')).toBe(-2);
  });

  test('a declared plane that disagrees with the kind is REFUSED, never honoured', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e1', { plane: 'witness' })],
      tick: 11,
    });
    // Trusting the declaration would let an adapter smuggle a witness lesson onto
    // the personal plane, where the family ladder teaches it four times as hard.
    expect(reasons(out)).toEqual(['plane_mismatch']);
    expect(characterDriftOf(out.worldState)).toEqual({});
  });

  test('a matching declared plane passes — the cross-check is not a ban', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e1', { plane: 'personal' })],
      tick: 11,
    });
    expect(out.refusals).toEqual([]);
    expect(out.applied).toBe(2);
  });
});

describe('RECEIPTED REFUSALS — every closed door says which door it was', () => {
  test('a kind outside the closed vocabulary is silent, and says so', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('a_kind_from_the_future', ALDA, 'e1'), entry('ordinary_day', ALDA, 'e2')],
      tick: 11,
    });
    expect(reasons(out)).toEqual(['silent_kind', 'silent_kind']);
    expect(characterDriftOf(out.worldState)).toEqual({});
  });

  test('a kind with no receipt in the tree is refused AT THE DOOR', () => {
    // The source qualification law, enforced rather than documented: the L4 adapter
    // car cannot wire a phantom even by accident.
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('survived_battle', ALDA, 'e1'), entry('news_believed_atrocity', ALDA, 'e2')],
      tick: 11,
    });
    expect(reasons(out)).toEqual(['source_unverified', 'source_unverified']);
    expect(SOURCE_UNVERIFIED_KINDS).toContain('survived_battle');
    expect(characterDriftOf(out.worldState)).toEqual({});
  });

  test('an entry with no evidence is refused — a receipt with nothing to bind is not a receipt', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('turned_by_crime', ALDA, '')], tick: 11 });
    expect(reasons(out)).toEqual(['no_evidence']);
  });

  test('a supplied vector is refused for every kind whose vector the TABLE owns', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e1', { pulls: [{ axisId: 'MERCY', pole: 'vice', band: 'heavy' }] })],
      tick: 11,
    });
    expect(reasons(out)).toEqual(['pulls_not_overridable']);
  });

  test('⭐ ENC-3 THE THIRD ADMISSION ARM IS LIVE — met_a_foreigner is its ONE carrier', () => {
    // §12 row 10. The funnel gained a third road into a supplied vector, for a kind whose
    // vector genuinely cannot be a constant: what a chance meeting teaches depends on WHO
    // was met, and only the adapter knows that. The AMBIENT road cannot carry such a kind —
    // an ambient entry divides its quantum by a season and a one-week meeting can never
    // cross that floor — which is why the arm exists rather than a reuse.
    //
    // ⛔ THIS ASSERTION USED TO SAY THE ARM WAS INERT, and it said so as a REMINDER: "it is
    // EXPECTED to move when ENC-3 lands `met_a_foreigner` — that lane owns the positive arm
    // (a supplied vector admitted at span 1), and this assertion is its reminder to write
    // it." ENC-3 landed the row and did NOT write the arm; the reminder did its job. The
    // roster is now exact in the other direction, so a SECOND carrier still reds here.
    const carriers = Object.entries(EXPERIENCE_TABLE)
      .filter(([, spec]) => spec.vectorSupplied === true)
      .map(([kind]) => kind);
    expect(carriers).toEqual(['met_a_foreigner']);
    // and it is NON-AMBIENT by construction, which is the half the design leans on
    expect(EXPERIENCE_TABLE.met_a_foreigner.ambient === true).toBe(false);
    expect(EXPERIENCE_TABLE.met_a_foreigner.pulls).toEqual([]);
  });

  test('⭐ THE POSITIVE ARM ENC-3 OWED: a supplied vector is ADMITTED for met_a_foreigner', () => {
    // The claim the previous test was a placeholder for. Without this, `vectorSupplied`
    // would be a field that only ever proved a refusal did NOT happen — which is exactly
    // the shape of a guard nobody has watched work.
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('met_a_foreigner', ALDA, 'e1', {
        pulls: [{ axisId: 'JUSTICE', pole: 'vice', band: 'heavy' }],
      })],
      tick: 11,
    });
    expect(reasons(out)).toEqual([]);
    // ⚠ the receipt names the funnel's OWN event word (`band_crossing`), not the experience
    // kind — the supplied vector really moved JUSTICE across a band, which is the whole
    // point. Measured, not assumed: I predicted `met_a_foreigner:JUSTICE` and was wrong.
    expect(kindsOf(out)).toEqual(['band_crossing:JUSTICE']);
  });

  test('⭐ AND THE ARM IS NARROW: the SAME supplied vector is refused for a table-owned kind', () => {
    // THE DIFFERENTIAL, which is what makes the admission above a fact about
    // `vectorSupplied` rather than about the funnel having stopped refusing anything.
    // One entry shape, two kinds, opposite outcomes.
    const supplied = [{ axisId: 'JUSTICE', pole: 'vice', band: 'heavy' }];
    const admitted = foldLivedExperience({
      worldState: lit(),
      entries: [entry('met_a_foreigner', ALDA, 'e1', { pulls: supplied })],
      tick: 11,
    });
    const refused = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e2', { pulls: supplied })],
      tick: 11,
    });
    expect(reasons(admitted)).toEqual([]);
    expect(reasons(refused)).toEqual(['pulls_not_overridable']);
  });

  test('a met_a_foreigner entry that supplies NO vector is refused, never silently taught nothing', () => {
    // The table holds no vector for this kind ON PURPOSE, so an adapter that forgets to
    // compute one must hear about it rather than watch nobody drift.
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('met_a_foreigner', ALDA, 'e1')],
      tick: 11,
    });
    expect(reasons(out)).toEqual(['no_pull_vector']);
  });

  test('an ambient kind whose adapter sent no vector is refused, never silently taught nothing', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('dwell_milieu', ALDA, 'e1', { spanTicks: AMBIENT_CADENCE_TICKS })],
      tick: 11,
    });
    expect(reasons(out)).toEqual(['no_pull_vector']);
  });

  test('a pull naming an axis the catalog does not carry is refused', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('dwell_milieu', ALDA, 'e1', {
        spanTicks: AMBIENT_CADENCE_TICKS,
        pulls: [{ axisId: 'INVENTED', pole: 'vice', band: 'heavy' }],
      })],
      tick: 11,
    });
    expect(reasons(out)).toEqual(['unknown_axis']);
  });

  test('every reason the funnel can emit is a member of its own closed vocabulary', () => {
    const emitted = [
      foldLivedExperience({ worldState: dark(), entries: [entry('turned_by_crime', ALDA, 'e')], tick: 11 }),
      foldLivedExperience({ worldState: noLedger(), entries: [entry('turned_by_crime', ALDA, 'e')], tick: 11 }),
      foldLivedExperience({ worldState: lit(), entries: [entry('nope', ALDA, 'e')], tick: 11 }),
      foldLivedExperience({ worldState: lit(), entries: [entry('survived_battle', ALDA, 'e')], tick: 11 }),
      foldLivedExperience({ worldState: lit(), entries: [entry('turned_by_crime', ALDA, '')], tick: 11 }),
      foldLivedExperience({ worldState: lit(), entries: [entry('dwell_milieu', ALDA, 'e')], tick: 11 }),
    ].flatMap(reasons);
    expect(emitted.length).toBeGreaterThan(5);
    for (const reason of emitted) expect(FUNNEL_REFUSALS).toContain(reason);
  });
});

describe('THE F9 SOURCE LAW (§853) — no source may emit a sub-floor pull', () => {
  const milieu = (spanTicks) => entry('dwell_milieu', ALDA, 'eD', {
    spanTicks,
    pulls: [{ axisId: 'MERCY', pole: 'vice', band: 'faint' }],
  });

  test('an ambient kind with NO span is refused — the cadence is not optional', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [milieu(undefined)], tick: 11 });
    expect(reasons(out)).toEqual(['ambient_without_span']);
  });

  test('A PER-TICK AMBIENT PULL IS REFUSED — this is the exact failure L2 measured', () => {
    // One tick of dwelling integrates to 1/13 of a faint quantum, which can never
    // cross the floor and — because nothing sub-floor is stored — could never
    // accumulate to cross it either. Fifty such ticks mark nobody. So it is
    // REFUSED, out loud, instead of vanishing.
    const out = foldLivedExperience({ worldState: lit(), entries: [milieu(1)], tick: 11 });
    expect(reasons(out)).toEqual(['sub_floor_pull']);
    expect(characterDriftOf(out.worldState)).toEqual({});
  });

  test('a full cadence of dwelling DOES mark — sparsity and accumulation both survive', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [milieu(AMBIENT_CADENCE_TICKS)], tick: 11 });
    expect(out.refusals).toEqual([]);
    expect(out.applied).toBe(1);
    expect(axisOffsetOf(out.worldState, idOf(out.worldState, ALDA), 'MERCY')).toBe(-MATERIALIZATION_EPSILON);
  });

  test('and a longer dwell is TIME-INTEGRATED, not repeated', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [milieu(4 * AMBIENT_CADENCE_TICKS)], tick: 11 });
    expect(axisOffsetOf(out.worldState, idOf(out.worldState, ALDA), 'MERCY')).toBe(-1);
  });

  test('NO SOURCE-SIDE MAGNITUDE UNDER THE FLOOR IS REACHABLE under today\'s derived tuning', () => {
    // Guards 1 and 2, stated as arithmetic: the lightest family stepping the
    // lightest word still lands exactly ON the floor, never under it.
    const lightest = Math.min(...Object.values(FUNNEL_TUNING.familyStep));
    const floorWord = FUNNEL_TUNING.magnitudes.faint;
    expect(lightest).toBe(-2);
    expect(floorWord).toBe(MATERIALIZATION_EPSILON);
    // A `word`-family faint pull (step -2, clamped at faint) still materializes.
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('festival_kept', ALDA, 'eF')], tick: 11 });
    expect(out.refusals).toEqual([]);
    expect(out.applied).toBe(2);
  });

  test('NO SUB-FLOOR ACCUMULATOR STATE EXISTS — the world holds offsets and nothing else', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11 });
    const cell = driftEntryOf(out.worldState, idOf(out.worldState, ALDA)).JUSTICE;
    expect(Object.keys(cell).sort()).toEqual(['offset', 'updatedTick']);
    const serialized = JSON.stringify(out.worldState);
    // The world is asserted to HOLD a real offset first, so the two exclusions
    // below cannot pass on a world where nothing was ever written.
    expect(serialized).toContain('"offset":-1');
    // anchored: the same serialized world is pinned to carry a live offset above
    expect(serialized).not.toContain('pending');
    // anchored: the same serialized world is pinned to carry a live offset above
    expect(serialized).not.toContain('accum');
  });
});

describe('RECEIPTS — crossings, reversals, displacements, AND NOTHING ELSE', () => {
  test('a band crossing rides SP-5b\'s grammar and carries its cause', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11 });
    const crossing = out.receipts.find((row) => row.axisId === 'JUSTICE');
    expect(crossing.kind).toBe('band_crossing');
    expect(crossing.crossing).toEqual({
      stockKind: CHARACTER_STOCK_KIND,
      from: 'virtue_a_touch',
      to: NEUTRAL_BAND,
      direction: 'fell',
      cause: 'fall',
      tick: 11,
    });
  });

  test('a REVERSAL is minted BESIDE its crossing — the paradigm shift is its own sentence', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e1'), entry('turned_by_crime', ALDA, 'e2')],
      tick: 11,
    });
    const justice = out.receipts.filter((row) => row.axisId === 'JUSTICE');
    expect(justice.map((row) => row.kind)).toEqual(['band_crossing', 'reversal']);
    // A virtue curdling into ITS OWN vice: the two ends sit on opposite sides.
    expect(justice[1].crossing.from).toBe('virtue_a_touch');
    expect(justice[1].crossing.to).toBe('vice_a_touch');
  });

  test('a crossing that does NOT pass the midpoint mints no reversal', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11 });
    expect(out.receipts.filter((row) => row.kind === 'reversal')).toEqual([]);
  });

  test('⭐ THE WALLPAPER CONTROL — raw movement moves the world and emits NOTHING', () => {
    // JUSTICE sits at vice `marked` (-2); a faint further pull takes it to -2.25,
    // which is still `marked`. The world CHANGES and no receipt is minted. A guard
    // tested only by things that should emit is a guard nobody has tested.
    const bern = npc('npc_2', 'Bern', { JUSTICE: { pole: 'vice', level: 'marked' } });
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('corruption_exposed', bern, 'e3')], tick: 11 });
    expect(out.receipts).toEqual([]);
    expect(out.refusals).toEqual([]);
    // ...and the movement is REAL, which is what makes the empty receipt list mean
    // something rather than merely reporting that nothing happened.
    expect(out.applied).toBe(2);
    expect(axisOffsetOf(out.worldState, idOf(out.worldState, bern), 'JUSTICE')).toBe(-0.25);
  });

  test('a displacement is minted when a background axis OVERTAKES a foreground one', () => {
    const cund = npc('npc_3', 'Cund', {
      JUSTICE: { pole: 'virtue', level: 'defining' },
      TRUST: { pole: 'virtue', level: 'marked' },
      CHEER: { pole: 'virtue', level: 'a_touch' },
    });
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', cund, 'x1'), entry('turned_by_crime', cund, 'x2')],
      tick: 11,
    });
    const moved = out.receipts.filter((row) => row.kind === 'displacement');
    // JUSTICE collapsed two bands and TRUST is now the strongest thing about him —
    // one sentence, and every word of it is true. CANDOR merely arrived LEVEL with
    // the wreckage, which is not an overtaking.
    expect(moved.map((row) => [row.axisId, row.overtook, row.rank])).toEqual([
      ['TRUST', 'JUSTICE', 0],
    ]);
  });

  test('⭐ THE PASS IS MEASURED IN MAGNITUDES, NOT RANKS — the regression two pins caught', () => {
    // JUSTICE collapses from 3 to 1; TRUST and CHEER do not move at all, yet both
    // shift up a rank. A RANK-WISE rule mints for each of them, including the false
    // claim that an untouched CHEER "overtook" a TRUST it is still a full band
    // behind. Only TRUST genuinely passed anybody, so only TRUST mints.
    const before = { JUSTICE: 3, TRUST: 2, CHEER: 1 };
    const after = { JUSTICE: 1, TRUST: 2, CHEER: 1 };
    expect(displacementsBetween(before, after)).toEqual([{ axisId: 'TRUST', overtook: 'JUSTICE', rank: 0 }]);
  });

  test('a TIE is never an overtaking — you have not passed somebody you are level with', () => {
    const before = { JUSTICE: 3, TRUST: 2 };
    const after = { JUSTICE: 2, TRUST: 2 };
    // JUSTICE fell to exactly TRUST's strength. The read order changes on the
    // codepoint tiebreak alone, and a receipt minted off a tiebreak is noise.
    expect(displacementsBetween(before, after)).toEqual([]);
  });

  test('a background axis entering the read model DOES mint, and names what it passed', () => {
    const before = { JUSTICE: 3, TRUST: 2, CHEER: 1 };
    const after = { JUSTICE: 3, TRUST: 2, CHEER: 1, MERCY: -2.5 };
    // MERCY was invisible and is now strictly ahead of both TRUST and CHEER; the
    // sentence names the STRONGEST thing it overtook.
    expect(displacementsBetween(before, after)).toEqual([{ axisId: 'MERCY', overtook: 'TRUST', rank: 1 }]);
  });

  test('a soul\'s FIRST position is a crossing, never a displacement — nothing was displaced', () => {
    const emm = npc('npc_5', 'Emm');
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('turned_by_crime', emm, 'e1')], tick: 11 });
    expect(out.receipts.filter((row) => row.kind === 'displacement')).toEqual([]);
    expect(out.receipts.every((row) => row.kind === 'band_crossing')).toBe(true);
  });

  test('receipts are codepoint-ordered per soul, so a feed is permutation-independent', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e2'), entry('turned_by_crime', ALDA, 'e1')],
      tick: 11,
    });
    const crossings = out.receipts.filter((row) => row.kind === 'band_crossing').map((row) => row.axisId);
    expect(crossings).toEqual([...crossings].sort());
  });
});

describe('EVIDENCE BINDING — no later composer may guess an event', () => {
  test('every receipt carries the kinds and the event ids that moved that axis', () => {
    const out = foldLivedExperience({
      worldState: lit(),
      entries: [entry('turned_by_crime', ALDA, 'e2'), entry('turned_by_crime', ALDA, 'e1')],
      tick: 11,
    });
    for (const row of out.receipts) {
      expect(row.sourceKinds).toEqual(['turned_by_crime']);
      // Sorted, so the same two events in either arrival order bind identically.
      expect(row.sourceEventIds).toEqual(['e1', 'e2']);
      expect(row.tick).toBe(11);
      expect(row.wnpcId).toMatch(/^wnpc_/);
    }
  });

  test('an axis only the homeward walk moved says HOMEWARD_DECAY, not an empty cause', () => {
    const seeded = foldLivedExperience({
      worldState: lit(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11,
    }).worldState;
    // Far enough for JUSTICE's -1 to decay under half a band and re-band, with no
    // lesson in the fold at all.
    const out = foldLivedExperience({ worldState: seeded, entries: [], tick: 11 + 400 });
    expect(out.receipts).toEqual([]);
    // With no entries there are no subjects, so the fold is silent by construction —
    // the decay-only receipt path is exercised through a fold that HAS a subject.
    const withSubject = foldLivedExperience({
      worldState: seeded, entries: [entry('festival_kept', ALDA, 'eF')], tick: 11 + 400,
    });
    const justice = withSubject.receipts.find((row) => row.axisId === 'JUSTICE');
    expect(justice.crossing.cause).toBe(HOMEWARD_DECAY_CAUSE);
    expect(justice.sourceKinds).toEqual([HOMEWARD_DECAY_CAUSE]);
    expect(justice.sourceEventIds).toEqual([]);
  });

  test('THE HEAVIEST TEACHER GETS THE CREDIT when two families move one axis', () => {
    const emm = npc('npc_5', 'Emm');
    const out = foldLivedExperience({
      worldState: lit(),
      // Both pull CHEER toward virtue, and together they cross a band.
      // home_liberated is `realm` (step -1); promotion_won is `career` (step 0) —
      // so `career` is the heavier teacher and must be the cause on the receipt.
      // ⚠ THE EVENT IDS ARE DELIBERATELY ORDERED LIGHTEST-FIRST: the fold walks
      // candidates in (subject, eventId, kind) order, so if the cause were "the
      // first family seen" instead of "the heaviest", this fixture would answer
      // `realm` and the assertion below would catch it. Ordering them the other
      // way round makes the two rules agree and tests nothing.
      entries: [entry('home_liberated', emm, 'e1'), entry('promotion_won', emm, 'e2')],
      tick: 11,
    });
    const cheer = out.receipts.find((row) => row.axisId === 'CHEER');
    expect(cheer.crossing.to).toBe('virtue_a_touch');
    expect(cheer.crossing.cause).toBe('career');
    // ...while the EVIDENCE keeps both, sorted, so no composer has to guess which
    // of the two the sentence is about.
    expect(cheer.sourceKinds).toEqual(['home_liberated', 'promotion_won']);
    expect(cheer.sourceEventIds).toEqual(['e1', 'e2']);
  });
});

describe('THE HOMEWARD WALK — anti-ratchet, and F9 in the direction that matters', () => {
  const seed = () => foldLivedExperience({
    worldState: lit(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11,
  }).worldState;

  test('one half-life halves the offset, exactly', () => {
    const worldState = seed();
    const id = idOf(worldState, ALDA);
    expect(axisOffsetOf(worldState, id, 'JUSTICE')).toBe(-1);
    const walked = decayCharacterDrift({ worldState, subjects: [{ settlementId: TOWN, npc: ALDA }], tick: 11 + 156 });
    expect(axisOffsetOf(walked.worldState, id, 'JUSTICE')).toBe(-0.5);
    expect(walked.moved).toBe(2);
  });

  test('a soul all the way home serializes as one that NEVER LEFT (F9, both ways)', () => {
    const walked = decayCharacterDrift({
      worldState: seed(), subjects: [{ settlementId: TOWN, npc: ALDA }], tick: 11 + 5000,
    });
    expect(characterDriftOf(walked.worldState)).toEqual({});
    // The KEY is gone, not merely emptied — a `characterDrift: {}` would serialize
    // differently from a world that never drifted, which is the whole claim.
    expect('characterDrift' in walked.worldState).toBe(false);
  });

  test('a zero-age walk returns the SAME reference — a stock does not un-decay', () => {
    const worldState = seed();
    const walked = decayCharacterDrift({ worldState, subjects: [{ settlementId: TOWN, npc: ALDA }], tick: 11 });
    expect(walked.worldState).toBe(worldState);
    expect(walked.moved).toBe(0);
  });

  test('DECAY NEVER GRADUATES ANYBODY — a one-way door is not opened by an absence', () => {
    const worldState = lit();
    const before = Object.keys(npcLedgerOf(worldState).roamers).length;
    const walked = decayCharacterDrift({ worldState, subjects: [{ settlementId: TOWN, npc: ALDA }], tick: 99 });
    expect(walked.worldState).toBe(worldState);
    expect(Object.keys(npcLedgerOf(walked.worldState).roamers).length).toBe(before);
    expect(idOf(walked.worldState, ALDA)).toBeNull();
  });

  test('READ-LAST / WRITE-NEXT survives the fold — this tick\'s writes carry this tick', () => {
    const out = foldLivedExperience({ worldState: lit(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11 });
    const cell = driftEntryOf(out.worldState, idOf(out.worldState, ALDA)).JUSTICE;
    // Every write is stamped with the fold's OWN tick, which is what makes
    // `axisOffsetAt(.., 11)` still read zero: a reader anywhere in this tick's
    // order sees the same chart, so a multi-source fold is order-independent
    // rather than order-dependent-and-nobody-noticed.
    expect(cell.updatedTick).toBe(11);
    expect(axisOffsetAt(out.worldState, idOf(out.worldState, ALDA), 'JUSTICE', 11)).toBe(0);
    expect(axisOffsetAt(out.worldState, idOf(out.worldState, ALDA), 'JUSTICE', 12)).toBe(-1);
  });

  test('DECAY RUNS FIRST — a lesson lands on a soul that has already walked home', () => {
    const worldState = seed();
    const id = idOf(worldState, ALDA);
    // 156 ticks later JUSTICE's -1 has decayed to -0.5; one more full-band lesson
    // then takes it to -1.5. Lessons-first would have given -2 then -1.
    const out = foldLivedExperience({ worldState, entries: [entry('turned_by_crime', ALDA, 'e2')], tick: 11 + 156 });
    expect(axisOffsetOf(out.worldState, id, 'JUSTICE')).toBe(-1.5);
    expect(out.decayed).toBe(2);
  });
});

describe('THE READ MODEL — §5\'s pinned total order', () => {
  test('the order is |position| desc, then band rank, then codepoint axis id', () => {
    const chart = { TRUST: 2, CANDOR: -3, CHEER: 1, MERCY: -1 };
    expect(chartOrderOf(chart)).toEqual(['CANDOR', 'TRUST', 'CHEER', 'MERCY']);
    expect(topPositionsOf(chart)).toEqual(['CANDOR', 'TRUST', 'CHEER']);
    expect(TOP_POSITIONS).toBe(3);
  });

  test('a neutral axis holds no position, so an all-neutral soul has an empty read model', () => {
    expect(chartOrderOf({ TRUST: 0, CHEER: 0.2 })).toEqual([]);
    expect(topPositionsOf({})).toEqual([]);
    expect(bandWordOf(0)).toBe(NEUTRAL_BAND);
    expect(bandWordOf(0.2)).toBe(NEUTRAL_BAND);
  });

  test('the effective chart is core PLUS offset, over the union of both halves', () => {
    const subject = npc('npc_9', 'Frid', { TRUST: { pole: 'virtue', level: 'marked' } });
    const chart = effectiveChartOf(subject, { TRUST: { offset: -1, updatedTick: 3 }, MERCY: { offset: -2, updatedTick: 3 } });
    expect(chart).toEqual({ MERCY: -2, TRUST: 1 });
    expect(bandWordOf(chart.MERCY)).toBe('vice_marked');
  });

  test('the two directions of one journey band identically', () => {
    for (const [rung, level] of AXIS_LEVELS.entries()) {
      expect(bandWordOf(rung + 1)).toBe(`virtue_${level}`);
      expect(bandWordOf(-(rung + 1))).toBe(`vice_${level}`);
    }
  });
});

describe('F6 — THE DEATH RECEIPT: one typed record, and NO store', () => {
  const cund = npc('npc_3', 'Cund', { JUSTICE: { pole: 'virtue', level: 'defining' }, TRUST: { pole: 'virtue', level: 'marked' } });

  test('it carries the remembered top-3 in band words, and whether the world marked them', () => {
    const record = characterLegacyRecord({
      wnpcId: 'wnpc_abc', npc: cund, drift: { JUSTICE: { offset: -2, updatedTick: 4 } }, cause: 'killed_in_battle', tick: 12,
    });
    expect(record).toEqual({
      kind: CHARACTER_LEGACY_KIND,
      wnpcId: 'wnpc_abc',
      cause: 'killed_in_battle',
      tick: 12,
      lived: true,
      remembered: [
        { axisId: 'TRUST', band: 'virtue_marked' },
        { axisId: 'JUSTICE', band: 'virtue_a_touch' },
      ],
    });
    expect(Object.isFrozen(record)).toBe(true);
  });

  test('an undrifted soul is remembered as authored, and says it never lived a mark', () => {
    const record = characterLegacyRecord({ wnpcId: 'wnpc_abc', npc: cund, cause: 'old_age', tick: 12 });
    expect(record.lived).toBe(false);
    expect(record.remembered.map((row) => row.axisId)).toEqual(['JUSTICE', 'TRUST']);
  });

  test('it is FAIL-CLOSED — a non-token cause or a non-integer tick throws', () => {
    expect(() => characterLegacyRecord({ wnpcId: 'wnpc_a', npc: cund, cause: 'Killed In Battle', tick: 12 })).toThrow(/token/);
    expect(() => characterLegacyRecord({ wnpcId: 'wnpc_a', npc: cund, cause: 'died', tick: 1.5 })).toThrow(/integer/);
    expect(() => characterLegacyRecord({ wnpcId: '', npc: cund, cause: 'died', tick: 1 })).toThrow(/durable identity/);
  });

  test('⭐ IT MINTS NO STORE AND CLOSES NO CHART — GAP D, and the close-out is an OWNER row', () => {
    const worldState = foldLivedExperience({
      worldState: lit(), entries: [entry('turned_by_crime', ALDA, 'e1')], tick: 11,
    }).worldState;
    const id = idOf(worldState, ALDA);
    const snapshot = JSON.stringify(worldState);
    characterLegacyRecord({ wnpcId: id, npc: ALDA, drift: driftEntryOf(worldState, id), cause: 'killed_in_battle', tick: 12 });
    // The record is an EVENT. Whether a dead soul's chart closes or ghosts is
    // unruled, and answering it here would answer it in code.
    expect(JSON.stringify(worldState)).toBe(snapshot);
  });
});

describe('DARK BY CONSTRUCTION — two independent darknesses, one door', () => {
  /** @param {string} dir @returns {string[]} */
  function jsFilesUnder(dir) {
    /** @type {string[]} */
    const out = [];
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, item.name);
      if (item.isDirectory()) out.push(...jsFilesUnder(full));
      else if (/\.(js|jsx|ts|tsx|mjs)$/.test(item.name)) out.push(full);
    }
    return out;
  }

  /**
   * ⚠⚠ COMMENTS ARE STRIPPED BEFORE ANY CLOSURE SCAN — L5's amendment, which this
   * walker did not receive until the substrate coupling. An IMPORT is a dependency;
   * a CITATION is not.
   * @param {string} text
   */
  const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

  /**
   * ⛔ THE SYMBOLS MUST BE UNIQUELY OWNED IN `src/`. `AMBIENT_CADENCE_TICKS` is
   * exported by this very funnel AND by `faithWitnessSource.js`, and `PULL_BANDS` by
   * three files — a dereference arm naming either would convict the wrong file. The
   * control below measures that rather than trusting it.
   */
  const FUNNEL_FAMILY_SYMBOLS = Object.freeze([
    'EXPERIENCE_TABLE', 'LIVED_EXPERIENCE_KINDS', 'AMBIENT_EXPERIENCE_KINDS',
    'experienceKindOf', 'experienceRowOf',
    'foldLivedExperience', 'effectiveChartOf', 'decayCharacterDrift', 'characterLegacyRecord',
    'collectLivedExperience', 'LIVED_EXPERIENCE_SOURCES', 'SOURCE_ADAPTER_OF',
  ]);


  /**
   * ⛔⛔⛔ AND A SYMBOL INSIDE A STRING LITERAL IS A CITATION TOO — THE SIXTH SIGHTING
   * OF THIS ESTATE'S LAW, AND IT CONVICTED THE VERY CAR THAT WROTE THE CURE.
 *
   * The dereference arm above was added to catch an aliased import plus a call. On its
   * first run it convicted `livedExperienceCatalog.js` of depending on the witness
   * adapter — on the strength of the RECEIPT STRING that names it:
   * `'faithWitnessSource.js:faithWitnessEntries (religionState pantheon ...)'`. A quoted
   * name followed by a space and a paren is indistinguishable from a call to a scanner
   * that only strips comments.
 *
   * ⭐ THE GENERALISATION, and it is the one this whole family has been converging on:
   * COMMENTS AND STRING LITERALS ARE BOTH CITATIONS. Only two things are dependencies —
   * an import specifier, and a dereference in CODE. So the module arm is asked BEFORE
   * strings are blanked (an import specifier IS a string literal), and the symbol arm is
   * asked AFTER. Ban lists, seam-name constants, `home:` paths and receipt strings all
   * fall out of the detector at once, because they were always the same shape.
   * @param {string} text
   */
  const codeWithoutCitations = (text) => stripComments(text)
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');

  /** @param {string} text */
  const dependsOnFunnelFamily = (text) => (
    /from\s+'[^']*\/livedExperience(Funnel|Catalog|Sources)\.js'/.test(stripComments(text))
      || new RegExp(`\\b(${FUNNEL_FAMILY_SYMBOLS.join('|')})\\s*[([.]`).test(codeWithoutCitations(text))
  );

  test('the ONLY src namer of the funnel family is car L4\'s adapter leaf', () => {
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100);
    const importers = files
      .filter((file) => !/livedExperience(Funnel|Catalog)\.js$/.test(file))
      .filter((file) => dependsOnFunnelFamily(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'));
    // AMENDED BY CAR L4 — the act this pin was written to meet, and it is
    // TIGHTENED rather than opened. The old form said "nobody"; the new form names
    // the ONE file allowed to, so a second consumer still reds. The adapter leaf is
    // itself imported by nobody (its own suite pins that), so the family remains
    // unreachable from production and the dormancy claim is unchanged.
    //
    // ⭐⭐ AND THE DETECTOR WAS SHARPENED AT THE SUBSTRATE COUPLING. This walker was
    // still a RAW substring over UNSTRIPPED source, so W-FAITH's `faithWitnessSource.js`
    // was convicted on TWO COMMENT LINES that say the funnel is not in its tree. It
    // imports nothing from the family. The roster it must equal is unchanged; only
    // the question "does this file depend on the family" is now asked properly.
    //
    // AMENDED AGAIN BY CAR L7, the same way: the read model reads the funnel's order
    // and its band words, so it names the family — and it is ITSELF imported by
    // nobody (its own suite pins that, and the drift family's closure walker carries
    // it as a member). The set stays EXACT, so a third namer still reds; what the
    // dormancy claim rests on is unchanged, because neither named file is reachable
    // from production.
    expect(importers.sort()).toEqual([
      'src/domain/npc/characterReadModel.js',
      'src/domain/npc/livedExperienceSources.js',
    ]);
  });

  test('⭐⭐ THE SHARPENED DETECTOR IS ANTI-VACUOUS, AND ITS SYMBOLS ARE UNIQUELY OWNED', () => {
    // Both directions, because a scan that stopped seeing things would report the
    // same one-file roster forever.
    expect(dependsOnFunnelFamily("import { x } from './livedExperienceCatalog.js';")).toBe(true);
    expect(dependsOnFunnelFamily('const out = foldLivedExperience({ entries });')).toBe(true);
    expect(dependsOnFunnelFamily('const row = EXPERIENCE_TABLE[kind];')).toBe(true);
    expect(dependsOnFunnelFamily('/** MIRRORED from livedExperienceCatalog */\nconst a = 1;')).toBe(false);
    expect(dependsOnFunnelFamily('// foldLivedExperience lives elsewhere\nconst a = 1;')).toBe(false);
    expect(dependsOnFunnelFamily("const row = { home: 'src/domain/npc/livedExperienceFunnel.js' };")).toBe(false);
    // ⛔ AND THE STRING-LITERAL CITATION — a receipt naming an adapter is not a call.
    expect(dependsOnFunnelFamily("const r = 'livedExperienceFunnel.js:foldLivedExperience (the door)';")).toBe(false);
    // ⭐ THE UNIQUE-OWNERSHIP CONTROL — the trap the sharpening invents for itself,
    // reachable only once two lines share a tree.
    // ⚠ READ EACH FILE ONCE. The first cut re-read all of `src/` PER SYMBOL and
    // timed out at 20s — an O(files x symbols) walk dressed as a one-line helper.
    const texts = jsFilesUnder(join(REPO_ROOT, 'src')).map((file) => readFileSync(file, 'utf8'));
    /** @param {string} symbol */
    const exportersOf = (symbol) => texts
      .filter((text) => new RegExp(`^export (const|function) ${symbol}\\b`, 'm').test(text));
    for (const symbol of FUNNEL_FAMILY_SYMBOLS) {
      expect(exportersOf(symbol), `${symbol} must be owned by exactly one module`).toHaveLength(1);
    }
    // anchored: these three really do have multiple owners on this tree, so the
    // check above discriminates rather than passing trivially.
    expect(exportersOf('AMBIENT_CADENCE_TICKS').length).toBeGreaterThan(1);
    expect(exportersOf('PULL_BANDS').length).toBeGreaterThan(1);
  });

  test('⭐ ONE DOOR: the funnel mints NO flag of its own, it rides L2\'s', () => {
    const source = readFileSync(join(REPO_ROOT, 'src/domain/npc/livedExperienceFunnel.js'), 'utf8');
    expect(source.length).toBeGreaterThan(5000);
    // A family with two switches has a half-lit state, and nobody ever tests it.
    // Neither file may READ the rules at all: the one gate is L2's, reached through
    // its exported predicate, so a second spelling of the door is unrepresentable.
    // Each file is asserted to be the REAL, live source before anything is
    // excluded from it — a path that read back empty would otherwise pass.
    expect(source).toContain('characterDriftActive');
    // anchored: `source` is pinned above to contain the gate call, so it is live
    expect(source).not.toContain('simulationRules');
    const catalog = readFileSync(join(REPO_ROOT, 'src/domain/npc/livedExperienceCatalog.js'), 'utf8');
    expect(catalog).toContain('EXPERIENCE_TABLE');
    // NARROWED BY CAR L4 from a substring ban to a DEREFERENCE ban. The catalog now
    // cites `simulationRules.js:499` in a comment as the evidence for a corrected
    // census verdict, and a rule that forbids citing one's own proof is a rule that
    // buys darkness with honesty. What the file may never do is READ the rules —
    // the one door is L2's, so a second spelling of the gate stays unrepresentable.
    // anchored: `catalog` is pinned above to contain the table, so it is live
    expect(catalog).not.toMatch(/\.simulationRules|simulationRules\s*\[|simulationRules\s*\)/);
  });

  test('the funnel writes through L2\'s writer and no other path', () => {
    const source = readFileSync(join(REPO_ROOT, 'src/domain/npc/livedExperienceFunnel.js'), 'utf8');
    // No direct world-state surgery: every move goes through the one writer, so the
    // floor, the clamp and the rounding cannot be bypassed by a second accumulator.
    // The two writers are asserted PRESENT first, which is what makes the two
    // exclusions below meaningful rather than vacuous on an unread file.
    expect(source).toContain('writeAxisDrift');
    expect(source).toContain('applyAxisDrift');
    // anchored: `source` is pinned above to contain both L2 writers, so it is live
    expect(source).not.toContain('setCharacterDrift');
    // anchored: `source` is pinned above to contain both L2 writers, so it is live
    expect(source).not.toContain('characterDrift[');
  });
});
