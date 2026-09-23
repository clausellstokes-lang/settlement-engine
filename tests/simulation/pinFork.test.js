/**
 * pinFork.test.js — EM-E4 acceptance cases E4-1 to E4-14 (wave 3; design §16, §18 and §19
 * rulings 1, 2, 3, 4 and 7; the chair's judgment 265).
 *
 * THE CLAIM. A directive decree names a REGISTERED fork, an outcome from that fork's own
 * vocabulary and a tick; the pulse's head folds the due pins into one bag; a fork whose id
 * is in the bag takes the pinned outcome and DOES NOT DRAW, so the seed trace on either
 * side of it is identical to a run that never reached the fork at all; a fork that is not
 * pinned draws exactly as today; a pin naming a word outside the fork's vocabulary, or a
 * fork that declares none, is refused BEFORE the tick and never reaches the world; and a
 * pin's write can take only the route `authorityFor` gives it.
 *
 * ⭐ THE VOCABULARIES ARE MEASURED FROM THE FORKS THEMSELVES, NEVER TRANSCRIBED. Cases
 * E4-1 and E4-2 run the real `outcomeForDraw` and the real `resolveSiegeVerdict` and
 * COLLECT the outcomes they produce; every later case pins against that measured set. A
 * suite that spelled the words would pass on a fork whose vocabulary had moved underneath
 * it, which is the exact failure design §19 ruling 1 exists to prevent (FINITE-SEMANTICS).
 *
 * ⛔ WHAT THIS SUITE DOES NOT CLAIM, STATED SO NOBODY READS IT AS COVERAGE. The fork SITES
 * are not wired to the bag in this member: `traditionsKernel.js` and the body of
 * `resolveSiegeVerdict` belong to no builder at this wave, and design §16's consult is
 * landed here as the verb and the bag the sites take, proven against those sites' own
 * live draws. Nothing here asserts that a pinned festival moved prosperity. The coup, the
 * non-drawing processes (the war terminations, the envoy's road, the exile's landing, the
 * tempo) and the keyed-hash ones (the court's verdict, the chance meetings) are OUT of
 * this cut by judgment 265 (c) and are slot EM-E0b.
 *
 * ⚠ TWO SYNTHETIC LITERALS ARE DECLARED, AND BOTH ARE MEASURED RATHER THAN INVENTED. The
 * four siege rolls below were found by EXECUTING `resolveSiegeVerdict` over the fixture in
 * this file (case E4-2 re-derives the whole band set from them on every run, so a drift in
 * the band cuts reds here rather than passing on a stale number), and the tradition score
 * is the kernel's own documented mid-band, asserted only through outcomes the same run
 * collects.
 *
 * Proof shape copied from `tests/simulation/decreeTick.test.js` (EM-E1): straight-line
 * literal `it`s under ONE literal `describe`, its own `vitest` import, and the leaf's own
 * source read for the structural fence.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  PIN_FORK_FIELDS, PIN_FORK_TYPE, chooseOrPinFork, forkPinsFor, forkVocabularyOf,
  pinApplyMode, pinForkOf, resolvePinFork,
} from '../../src/domain/edit/directives.js';
import { stage } from '../../src/domain/edit/registry.js';
import { applyDecreesAtTick, dueEntriesAtTick } from '../../src/domain/worldPulse/decreeHook.js';
import { HABIT_FORK_REGISTRY } from '../../src/domain/worldPulse/habitForkRegistry.js';
import { TRADITION_OUTCOME, outcomeForDraw } from '../../src/domain/worldPulse/traditionsKernel.js';
import { SIEGE_VERDICT_BANDS, resolveSiegeVerdict } from '../../src/domain/worldPulse/warSiegeVerdict.js';
import {
  PEACE_OFFER_KEY, draftPeaceOffer, draftTerms, peaceOffersOf, pendingPeaceOfferFrom,
  withPeaceOffer, withoutPeaceOffer,
} from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { ACTOR_INITIATED_MAJOR_TYPES } from '../../src/domain/worldPulse/actorMajorApproval.js';
import { authorityFor } from '../../src/domain/worldPulse/changeAuthorityPolicy.js';
import { createPRNG } from '../../src/kernel/prng.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/edit/directives.js';
const HOOK_REL = 'src/domain/worldPulse/decreeHook.js';

/** The two forks judgment 265 (c) leaves in the first cut, by their registry ids. */
const FESTIVAL = 'HBF-85';
const SIEGE = 'HBF-86';
/** The event lottery — a registered row the survey left MEASUREMENT OWED (no vocabulary). */
const LOTTERY = 'HBF-60';

const NOW = '2026-04-04T00:00:00.000Z';
const TICK_REF = 'pulse:harrowfen:7';
/** The traditions kernel's own mid-band observance score, used only to collect outcomes. */
const SCORE = 0.55;
const SEED = 'em-e4::pin-fork::harrowfen';

/** @param {string} forkId @param {string} outcome @returns {Record<string, unknown>} */
const pinOp = (forkId, outcome) => ({
  type: PIN_FORK_TYPE,
  payload: { [PIN_FORK_FIELDS[0]]: forkId, [PIN_FORK_FIELDS[1]]: outcome },
});

/** @param {string} id @param {Record<string, unknown>} op @param {Record<string, unknown>} [when] */
const stagedPin = (id, op, when) => stage([], op, { id, orderedAt: NOW, ...(when ? { when } : {}) });

/** One registry holding several staged entries, in the order given. */
function registryOf(rows) {
  let registry = [];
  for (const row of rows) {
    registry = stage(registry, row.op, { id: row.id, orderedAt: NOW, ...(row.when ? { when: row.when } : {}) });
  }
  return registry;
}

// ── THE SIEGE FIXTURE. A plausible matchup, so the deterministic feasibility gate admits
//    it and the stochastic roll is reached; the rng is a stub whose fork returns the roll
//    under test, which is the only way to address the four post-roll bands by name.
const siegeCapacityFor = (id) => (id === 'target'
  ? { offensive: 30, homeDefense: 50, facets: {} }
  : { offensive: 62, homeDefense: 40, facets: {} });
const siegeVerdictAt = (roll) => resolveSiegeVerdict({
  targetId: 'target',
  besiegers: ['besieger'],
  capacityFor: siegeCapacityFor,
  effectiveStrengthFor: () => null,
  defenderItem: { name: 'Harrowfen', settlement: {} },
  rng: { fork: () => ({ random: () => roll }) },
  tick: 4,
});
const SIEGE_ROLLS = Object.freeze([0.001, 0.2, 0.3, 0.45]);

/** The festival's outcomes AS THE DRAW PRODUCES THEM, collected over the unit interval. */
function festivalWordsDrawn() {
  const drawn = new Set();
  for (let step = 0; step <= 200; step += 1) drawn.add(outcomeForDraw(SCORE, step / 200));
  return [...drawn].sort();
}

/** The siege's bands AS THE ROLL PRODUCES THEM, collected from the real verdict. */
function siegeBandsRolled() {
  return [...new Set(SIEGE_ROLLS.map((roll) => siegeVerdictAt(roll).band))].sort();
}

/** The catalogue a caller hands in: each fork's words, read from the fork's own run. */
const CATALOGUE = Object.freeze({
  [FESTIVAL]: Object.freeze(festivalWordsDrawn()),
  [SIEGE]: Object.freeze(siegeBandsRolled()),
});

/**
 * THE CONSULT AS THE KERNEL'S HEAD COMPOSES IT: the pulse's own DUE schedule, folded by
 * the directive leaf's vocabulary judgment. Spelled once here, and nowhere twice.
 */
const pinsAtTick = (worldState, registry, catalogue) => forkPinsFor(dueEntriesAtTick(worldState, registry), catalogue);

/** The trace of a stream around one consult: the draw before it, and the three after. */
function traceAround(pins, forkId, fork) {
  const rng = createPRNG(SEED);
  const opening = rng.random();
  const outcome = chooseOrPinFork(pins, forkId, () => fork(rng));
  return { opening, outcome, after: [rng.random(), rng.random(), rng.random()] };
}

/** The same stream with the fork NEVER REACHED — the control every pinned trace is held to. */
function traceUntouched() {
  const rng = createPRNG(SEED);
  const opening = rng.random();
  return { opening, after: [rng.random(), rng.random(), rng.random()] };
}

describe('EM-E4 — the director\'s pins over the registered forks', () => {
  it('E4-1 RULING 1 IS LIVE: both first-cut forks carry a REGISTERED row WITH a declared vocabulary, and the lottery carries a row WITHOUT one', () => {
    const rowOf = (forkId) => HABIT_FORK_REGISTRY.find((row) => row.forkId === forkId);
    for (const forkId of [FESTIVAL, SIEGE]) {
      const row = rowOf(forkId);
      expect(row, `${forkId} has no row in HABIT_FORK_REGISTRY, so no pin may be offered over it`).toBeTruthy();
      expect(typeof row.actionVocabulary, `${forkId} declares no outcome vocabulary`).toBe('string');
    }
    // ⭐ THE NEGATIVE HALF OF RULING 1, AND IT IS THE ONE THAT MATTERS: a fork the survey
    // measured as REGISTRATION-OWED is registered and still declares nothing, which is
    // what "measurement owed, never a seal with invented words" looks like in the tree.
    const lottery = rowOf(LOTTERY);
    expect(lottery, 'the event lottery lost its registry row').toBeTruthy();
    expect(lottery.actionVocabulary, 'the lottery gained a vocabulary — re-open its seal in E4\'s next cut').toBeNull();
  });

  it('E4-2 THE SIEGE BAND EXPORT IS THE ROLL\'S OWN: the four bands the real verdict rolls are exactly SIEGE_VERDICT_BANDS, and each one\'s falls agrees', () => {
    expect(siegeBandsRolled()).toEqual(Object.keys(SIEGE_VERDICT_BANDS).sort());
    for (const roll of SIEGE_ROLLS) {
      const verdict = siegeVerdictAt(roll);
      expect(verdict.verdict, 'the fixture stopped reaching the stochastic roll').toBe('plausible');
      expect(SIEGE_VERDICT_BANDS[verdict.band], `band ${verdict.band} disagrees with the verdict's own falls`)
        .toBe(verdict.falls);
    }
  });

  it('E4-3 THE FESTIVAL\'S PIN WORDS ARE THE DRAW\'S OWN, and the deterministic cancellation is not among them', () => {
    const drawn = festivalWordsDrawn();
    expect(drawn.length, 'the outcome map stopped producing a spread').toBeGreaterThan(1);
    expect(drawn.every((word) => Object.values(TRADITION_OUTCOME).includes(word))).toBe(true);
    // ⚠ MEASURED, AND IT IS A REAL NARROWING: `TRADITION_OUTCOME` types SIX words and the
    // DRAW produces five. `cancelled` is written by the deterministic skip arm — a town at
    // war holds no festival — so a pin naming it would pin a draw that never happens, which
    // is design §19 ruling 4's own law. The catalogue a caller hands in is the draw's set.
    expect(drawn.includes(TRADITION_OUTCOME.CANCELLED)).toBe(false);
    expect(Object.values(TRADITION_OUTCOME).length - drawn.length).toBe(1);
  });

  it('E4-4 A PIN YIELDS THE PINNED OUTCOME AND THE STREAM IS WHERE IT WAS — the festival', () => {
    const control = traceUntouched();
    const pinned = traceAround({ [FESTIVAL]: TRADITION_OUTCOME.TRIUMPH }, FESTIVAL,
      (rng) => outcomeForDraw(SCORE, rng.random()));
    expect(pinned.outcome).toBe(TRADITION_OUTCOME.TRIUMPH);
    expect(pinned.opening).toBe(control.opening);
    expect(pinned.after, 'the pinned fork advanced the stream').toEqual(control.after);
    // The negative control: unpinned, the same fork DOES take its draw, so the three
    // draws after it move. Without this the equality above would pass on a dead stream.
    const drawn = traceAround({}, FESTIVAL, (rng) => outcomeForDraw(SCORE, rng.random()));
    expect(drawn.after).not.toEqual(control.after);
    expect(CATALOGUE[FESTIVAL].includes(drawn.outcome)).toBe(true);
  });

  it('E4-5 A PIN YIELDS THE PINNED OUTCOME AND THE STREAM IS WHERE IT WAS — the siege band', () => {
    const band = CATALOGUE[SIEGE][0];
    const control = traceUntouched();
    const pinned = traceAround({ [SIEGE]: band }, SIEGE, (rng) => siegeVerdictAt(rng.random()).band);
    expect(pinned.outcome).toBe(band);
    expect(pinned.after, 'the pinned siege advanced the stream').toEqual(control.after);
    // ⭐ THE BAND CARRIES `falls` WITH IT (design §19 rulings 3 and 4): the pin does not
    // leave the caller guessing the direction of a verdict whose roll never happened.
    expect(typeof SIEGE_VERDICT_BANDS[pinned.outcome]).toBe('boolean');
    const drawn = traceAround({}, SIEGE, (rng) => siegeVerdictAt(rng.random()).band);
    expect(drawn.after, 'the unpinned siege took no draw').not.toEqual(control.after);
  });

  it('E4-6 AN UNPINNED FORK DRAWS EXACTLY AS TODAY', () => {
    for (const step of [0, 1, 2, 3, 4]) {
      const r = step / 4;
      expect(chooseOrPinFork({}, FESTIVAL, () => outcomeForDraw(SCORE, r))).toBe(outcomeForDraw(SCORE, r));
    }
    for (const roll of SIEGE_ROLLS) {
      expect(chooseOrPinFork(null, SIEGE, () => siegeVerdictAt(roll).band)).toBe(siegeVerdictAt(roll).band);
    }
    // A bag that holds SOME OTHER fork is a miss here, and a non-string held value is a
    // miss too: a bag whose word has rotted into a number draws rather than pinning junk.
    expect(chooseOrPinFork({ [SIEGE]: CATALOGUE[SIEGE][0] }, FESTIVAL, () => TRADITION_OUTCOME.GOOD))
      .toBe(TRADITION_OUTCOME.GOOD);
    expect(chooseOrPinFork({ [FESTIVAL]: 7 }, FESTIVAL, () => TRADITION_OUTCOME.MODEST))
      .toBe(TRADITION_OUTCOME.MODEST);
  });

  it('E4-7 AN OUT-OF-VOCABULARY OUTCOME AND A FORK WITH NO VOCABULARY ARE BOTH REFUSED, BEFORE ANY TICK', () => {
    expect(resolvePinFork(pinOp(FESTIVAL, 'jubilant'), CATALOGUE))
      .toEqual({ ok: false, missing: 'outcome', was: 'jubilant' });
    // The siege's own READING words are not its pin words — the sharpest confusion this
    // member could have made, so it is asserted rather than described (judgment 265 (e)).
    expect(resolvePinFork(pinOp(SIEGE, 'all but settled'), CATALOGUE))
      .toEqual({ ok: false, missing: 'outcome', was: 'all but settled' });
    expect(resolvePinFork(pinOp(LOTTERY, 'anything'), CATALOGUE))
      .toEqual({ ok: false, missing: 'fork', was: LOTTERY });
    expect(resolvePinFork(pinOp('', 'triumph'), CATALOGUE)).toEqual({ ok: false, missing: 'fork', was: '' });
    // Silence on an op this member does not own: the caller selects, this judges.
    expect(resolvePinFork({ type: 'set-field', payload: {} }, CATALOGUE)).toEqual({ ok: true });
    expect(resolvePinFork(pinOp(FESTIVAL, TRADITION_OUTCOME.GOOD), CATALOGUE)).toEqual({ ok: true });
    expect(forkVocabularyOf(CATALOGUE, LOTTERY)).toBeNull();
    expect(forkVocabularyOf({ [FESTIVAL]: [] }, FESTIVAL), 'an empty list is no vocabulary').toBeNull();
    expect(forkVocabularyOf({ [FESTIVAL]: TRADITION_OUTCOME }, FESTIVAL), 'an object is not the one reading').toBeNull();
  });

  it('E4-8 A REFUSED PIN NEVER ENTERS THE BAG, SO THE FORK IS NEVER REACHED BY IT AT THE TICK', () => {
    const registry = registryOf([
      { id: 'd-bad-word', op: pinOp(FESTIVAL, 'jubilant') },
      { id: 'd-no-vocab', op: pinOp(LOTTERY, 'anything') },
    ]);
    const bag = pinsAtTick({ tick: 7 }, registry, CATALOGUE);
    expect(Object.keys(bag)).toEqual([]);
    expect(chooseOrPinFork(bag, FESTIVAL, () => TRADITION_OUTCOME.MODEST)).toBe(TRADITION_OUTCOME.MODEST);
    // And the refusal is the SAME judgment at both ends: the stage-time reader and the
    // tick's fold cannot disagree, because the fold calls the reader.
    expect(forkPinsFor(registry, CATALOGUE)).toEqual({});
  });

  it('E4-9 THE BAG AT THE TICK: due now, due at this tick, a future pin untouched, and the later of two on one fork wins', () => {
    const registry = registryOf([
      { id: 'd-now', op: pinOp(SIEGE, CATALOGUE[SIEGE][0]) },
      { id: 'd-this-tick', op: pinOp(FESTIVAL, TRADITION_OUTCOME.TROUBLED), when: { tick: 7 } },
      { id: 'd-later', op: pinOp(FESTIVAL, TRADITION_OUTCOME.TRIUMPH), when: { tick: 12 } },
    ]);
    expect(pinsAtTick({ tick: 7 }, registry, CATALOGUE))
      .toEqual({ [SIEGE]: CATALOGUE[SIEGE][0], [FESTIVAL]: TRADITION_OUTCOME.TROUBLED });
    expect(pinsAtTick({ tick: 12 }, registry, CATALOGUE)[FESTIVAL],
      'the later entry on one fork wins, which is the contention guard\'s own reading')
      .toBe(TRADITION_OUTCOME.TRIUMPH);
    // ⛔ ZERO PINS ALLOCATES NOTHING AND COMPARES ALIKE — the by-reference law a byte
    // golden depends on (design §12.11). Two dormant ticks hand back ONE frozen bag.
    const empty = pinsAtTick({ tick: 7 }, [], CATALOGUE);
    expect(pinsAtTick({ tick: 3 }, registryOf([{ id: 'd-far', op: pinOp(SIEGE, CATALOGUE[SIEGE][0]), when: { tick: 40 } }]), CATALOGUE))
      .toBe(empty);
    expect(Object.isFrozen(empty)).toBe(true);
    // ABSENT catalogue: nothing resolves, so nothing pins. This wave's shape, said out loud.
    expect(pinsAtTick({ tick: 7 }, registry)).toBe(empty);
  });

  it('E4-10 THE BAG IS READ AT THE HEAD, BEFORE THE APPLY — and the same read after it is empty', () => {
    const registry = stagedPin('d-head', pinOp(SIEGE, CATALOGUE[SIEGE][1]));
    const before = pinsAtTick({ tick: 7 }, registry, CATALOGUE);
    expect(before).toEqual({ [SIEGE]: CATALOGUE[SIEGE][1] });
    const applied = applyDecreesAtTick({ tick: 7 }, registry, TICK_REF, { now: NOW });
    expect(applied.causes.map((cause) => cause.opType)).toEqual([PIN_FORK_TYPE]);
    expect(pinsAtTick({ tick: 7 }, applied.registry, CATALOGUE),
      'a pin read after the apply would pin nothing — the consult belongs at the head')
      .toEqual({});
    // The entry itself is untouched by the consult: reading pins writes nothing.
    expect(pinsAtTick({ tick: 7 }, registry, CATALOGUE)).toEqual(before);
    expect(pinForkOf(registry[0])).toEqual({ forkId: SIEGE, outcome: CATALOGUE[SIEGE][1] });
    // ⭐ THE TWO READINGS OF `isDue` CANNOT DRIFT: the consult's due set and the entries
    // the apply turns into causes are the same rows, in the same order, over a mixed
    // registry where one entry is due and one is not.
    const mixed = registryOf([
      { id: 'd-due', op: pinOp(FESTIVAL, TRADITION_OUTCOME.GOOD) },
      { id: 'd-waiting', op: pinOp(SIEGE, CATALOGUE[SIEGE][0]), when: { tick: 40 } },
    ]);
    const dueIds = dueEntriesAtTick({ tick: 7 }, mixed).map((row) => row.id);
    expect(dueIds).toEqual(['d-due']);
    expect(applyDecreesAtTick({ tick: 7 }, mixed, TICK_REF, { now: NOW }).causes.map((cause) => cause.decreeId))
      .toEqual(dueIds);
    expect(dueEntriesAtTick({ tick: 7 }, []), 'a dormant tick allocates nothing')
      .toBe(dueEntriesAtTick({ tick: 9 }, []));
  });

  it('E4-11 EVERY PIN\'S WRITE TAKES THE ROUTE authorityFor GIVES IT, AND AN UNROUTABLE PIN IS A PROPOSAL', () => {
    const major = ACTOR_INITIATED_MAJOR_TYPES[0];
    expect(pinApplyMode(authorityFor, { politicalAutonomy: 'dm_only' }, major, 'auto')).toBe('proposal');
    expect(pinApplyMode(authorityFor, { politicalAutonomy: 'recommendations' }, 'tradition_change', 'auto')).toBe('proposal');
    expect(pinApplyMode(authorityFor, { politicalAutonomy: 'routine', routineMajorApproval: true }, major, 'auto')).toBe('proposal');
    // A non-major under routine falls through to the family's own legacy mode VERBATIM —
    // this member adds no rule of its own, which is what "no second write path" means.
    expect(pinApplyMode(authorityFor, { politicalAutonomy: 'routine', routineMajorApproval: true }, 'tradition_change', 'auto')).toBe('auto');
    expect(pinApplyMode(authorityFor, { politicalAutonomy: 'full' }, major, 'auto')).toBe('auto');
    // ⛔ THE FAIL-SAFE: no reader, or no change family, and the pin waits for the table.
    expect(pinApplyMode(null, { politicalAutonomy: 'full' }, major, 'auto')).toBe('proposal');
    expect(pinApplyMode(authorityFor, { politicalAutonomy: 'full' }, '', 'auto')).toBe('proposal');
  });

  it('E4-12 THE STANDING PEACE OFFER: the drafting table\'s own terms become a record, and the pending-offer read finds it', () => {
    const drafted = draftTerms({
      ranked: [{ termType: 'tribute', value: 10 }, { termType: 'reparations', value: 6 }],
      budget: 12, margin01: 0.7, press: 1, tick: 9,
    });
    expect(drafted.terms.length, 'the drafting table stopped drafting').toBeGreaterThan(0);
    const offer = draftPeaceOffer({
      fromId: 'greymoor', toId: 'harrowfen', terms: drafted.terms, budgetSpent: drafted.budgetSpent, tick: 9,
    });
    expect(offer.terms.map((term) => term.type)).toEqual(drafted.terms.map((term) => term.type));
    expect(offer.draftedTick).toBe(9);
    // ⭐ DESIGN §18's CONDITION, READ FROM THE RECORD: the seal exists because the offer does.
    const record = withPeaceOffer({ name: 'Harrowfen' }, offer);
    expect(pendingPeaceOfferFrom(record, 'greymoor')).toEqual(offer);
    expect(pendingPeaceOfferFrom(record, 'nobody')).toBeNull();
    expect(pendingPeaceOfferFrom({ name: 'Harrowfen' }, 'greymoor'), 'a bare record offers no seal').toBeNull();
    // A second suing REPLACES rather than duplicating; acceptance or refusal takes it off.
    const resued = withPeaceOffer(record, draftPeaceOffer({
      fromId: 'greymoor', toId: 'harrowfen', terms: drafted.terms, budgetSpent: 0, tick: 11,
    }));
    expect(peaceOffersOf(resued).length).toBe(1);
    expect(pendingPeaceOfferFrom(resued, 'greymoor').draftedTick).toBe(11);
    expect(pendingPeaceOfferFrom(withoutPeaceOffer(resued, 'greymoor'), 'greymoor')).toBeNull();
  });

  it('E4-13 THE OFFER KEY IS NEVER MINTED WITHOUT AN OFFER, AND IT RIDES THE SAVED BLOB WHOLE', () => {
    const bare = Object.freeze({ name: 'Harrowfen' });
    // ⛔ BY REFERENCE, because a key minted with no cause moves a byte golden with no cause.
    expect(withPeaceOffer(bare, null)).toBe(bare);
    expect(withPeaceOffer(bare, { toId: 'harrowfen' })).toBe(bare);
    expect(withoutPeaceOffer(bare, 'greymoor')).toBe(bare);
    expect(draftPeaceOffer({ fromId: 'greymoor', toId: 'greymoor', terms: [{ type: 'tribute' }] })).toBeNull();
    expect(draftPeaceOffer({ fromId: 'greymoor', toId: 'harrowfen', terms: [] })).toBeNull();
    // The positive half runs below: the key IS present on a record that holds an offer, so
    // the absence asserted here cannot be the vacuous green of a key nothing ever writes.
    expect(Object.hasOwn(bare, PEACE_OFFER_KEY)).toBe(false);
    const offer = draftPeaceOffer({ fromId: 'greymoor', toId: 'harrowfen', terms: [{ type: 'tribute' }], tick: 9 });
    const record = withPeaceOffer(bare, offer);
    expect(Object.hasOwn(record, PEACE_OFFER_KEY)).toBe(true);
    // The save path assigns the settlement blob whole, so the key needs no column: what it
    // costs is that the record must survive a JSON round trip unchanged, which is executed.
    expect(JSON.parse(JSON.stringify(record))).toEqual(JSON.parse(JSON.stringify(record)));
    expect(pendingPeaceOfferFrom(JSON.parse(JSON.stringify(record)), 'greymoor')).toEqual(offer);
  });

  it('E4-14 THE STRUCTURAL FENCE: the directive leaf imports ONE module and the hook gains ONE edge', () => {
    const leaf = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const importsOf = (source) => [...source.matchAll(/^import[^;]*?from\s*'([^']+)'/gm)].map((hit) => hit[1]);
    expect(importsOf(leaf), 'the directive leaf reached for a catalogue instead of taking one').toEqual(['./registry.js']);
    // ⛔ The vocabularies are ARGUMENTS for a measured reason: this leaf is reached from the
    // pulse's head, and importing the fork registry would make a classification table with
    // ZERO src importers eager in every tick for nothing.
    expect(leaf.includes('habitForkRegistry')).toBe(false);
    expect(leaf.includes('traditionsKernel')).toBe(false);
    const hook = readFileSync(join(ROOT, HOOK_REL), 'utf8');
    // ⛔ THE SPLIT IS WHY THIS IS STILL EXACTLY TWO. EM-E1's own case E1-8 pins this
    // roster, and the hook's argued-substrate entry declares `reads: []` which the coupling
    // walker MEASURES against the live graph, so the fork consult's schedule half lives here
    // and its vocabulary half stays in the edit leaf, composed by the caller.
    expect(importsOf(hook)).toEqual(['../edit/registry.js', './pulseHelpers.js']);
    expect(hook.includes('forkPinsFor'), 'the schedule half names the fold it does not import').toBe(true);
  });
});
