/**
 * Rung 2D, unit 3 (the chair's ruling): `coh:crisis-blind-prose` widened by the phrases rung
 * 2C's sixty-line read found outside its vocabulary (`docs/SOAK_10000_RUNG2C_2026-11-04.md`
 * §3c: 14 crisis-blind rows, 2 of them the seat-safety line unit 2 answers, 12 outside the
 * instrument). The twelve rows carry nine distinct phrases; each is read here on the seed the
 * read named, born the soak's way, under the crisis the read named.
 *
 * THE INSTRUMENT ONLY. The cure is the census's declarations (the registry goals R11 and
 * CENSUS-4 own, the desk marks), not this unit: the goals are read from the born record and the
 * desk lines from the leaves, never rewritten. State-prose wording is reached through a short
 * fragment and the leaves, never quoted (`tests/lint/proseDrawnAnchors.walker.test.js`).
 *
 * Red first at the unit-2 tip: every seed row below reads no finding.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { crisisBlindFindings } from '../../src/domain/coherence/crisisBlindFindings.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { variantByVid } from '../helpers/drawnProse.js';

/** The one leaf variant whose text holds a fragment, slots filled with the place's name. */
function leafLine(leaf, fragment, name) {
  const hits = Object.values(leaf).flatMap((block) => Object.values(block.pools || {}).flat())
    .filter((v) => v.text.includes(fragment));
  expect(hits, fragment).toHaveLength(1);
  return hits[0].text.replace(/\{settlement\}/g, name).replace(/\{tier\}|\{tierNoun\}/g, 'town');
}

// (`rulerWant`, which read the calm control's born want, retired with that want: ALLEGIANCE-CAR4, see the control row.)

/** The three goals' R11 wording (efb84c0); the claims keep their rung-2D names. */
const GOAL = {
  stability: "Find and mend the seat's weak spot", // W3 POW: the goal's words of 2026-11-08
  administration: 'Do every task the seat hands them so well',
  competition: 'Keep the family\'s name honoured at every feast',
};

/**
 * ⭐ THE CENSUS CURED THESE SIX ROWS AT THE SOURCE (census-1d unit 2, e267287e7, and its parallel
 * twin census-1e unit 1, b8fdcd3d5: the registry goal lookup resolves through the one rule, so
 * CENSUS-4b's CALM_ONLY goals are refused under a crisis). Measured with this file's own births
 * on archives: at each commit's parent seeds 604/1804/2404/3604 carry the stability want, 3005
 * the administration want and 3000 the competition want; at each commit none does, and the calm
 * control 1803 keeps its want. So the born record no longer prints the want, and the instrument
 * is read on the want as it WOULD print (the registry's R11 wording, verbatim) under the same
 * born crisis: both halves asserted, the cure and the instrument.
 */
const WANT = {
  stability: "Find and mend the seat's weak spot before a rival finds it first.",
  administration: 'Do every task the seat hands them so well that the seat cannot do without them.',
  competition: 'Keep the family\'s name honoured at every feast while the new offices take its old work.',
};
/** @param {any} s @param {string} fragment @returns {boolean} does any NPC of the born record want it? */
const holdsWant = (s, fragment) => (s.npcs || []).some((n) => (typeof n?.goal === 'string' ? n.goal : n?.goal?.short || '').includes(fragment));
/** @param {string} want @returns {string} the want as the Tonight sheet prints it */
const printed = (want) => `Wants to ${want.charAt(0).toLowerCase()}${want.slice(1)}`;

const SEEDS = [604, 1804, 2404, 3604, 1205, 2402, 5404, 4803, 1204, 3005, 3000, 5402, 1803];
/** @type {Record<number, any>} */
const born = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of SEEDS) born[i] = birth(i).settlement;
}, 400_000);

/** @param {number} i @param {(s: any) => string} line */
const readOn = (i, line) => crisisBlindFindings(born[i], { page: line(born[i]) }).map((f) => [f.claim, f.family]);

describe('rung 2D · the crisis-blind instrument reads the twelve sampled rows', () => {
  // LANDING-R2 seat E: one parameterless test over the four seeds, every seed run and collected.
  it('soak1k-604, -1804, -2404, -3604: the ruler\'s "current stability" want under a fracture or a debt', () => {
    const failures = collectSeedFailures([604, 1804, 2404, 3604], (i) => {
      expect(holdsWant(born[i], GOAL.stability), `soak1k-${i}: the census refuses the calm-only want under the crisis`).toBe(false);
      expect(readOn(i, () => printed(WANT.stability)), `soak1k-${i}`).toEqual([['current stability', 'crisis']]);
    });
    expectNoSeedFailures(failures, 'the stability want reads as crisis-blind under each fracture or debt');
  });

  // CENSUS-2c (the chair's R-P 1): the food record counts the influx (×1.15, CENSUS-1c unit 7), so
  // "Food Secure." under a fed influx is TRUE; the instrument's `migration` row is retired.
  it('soak1k-1205: "Food Secure." under a fed influx reads no finding (R-P 1: the row is retired)', () => {
    expect(readOn(1205, () => 'Food Secure.')).toEqual([]);
  });

  it('soak1k-2402: the one-earner line that says nothing is failing, under famine', () => {
    expect(readOn(2402, (s) => variantByVid({ leaf: 'economy', blockId: 'DS-ECO-12', poolKey: 'INCOME MIX: one source carries the town', vid: 3, slots: { settlement: s.name } }) /* W1 ECO (2026-11-07): the line reworded under the owner's style law, its claim and regex moved with it. BAR4-CLOSE-SWEEP (2026-11-16): computed by its identity, DS-ECO-12 one source v3 (a literal anchor is the drawn-anchors law's), after BAR4-CORPUS-ECO 7354471e5's DECLARED rewording (C43690: "one trade" -> "one source of income"); its second sentence, the one read, unchanged */.split(/(?<=\.)\s+/)[1])).toEqual([['nothing is failing', 'hunger']]);
  });

  it('soak1k-5404: pilgrims queue patiently in a besieged city', () => {
    expect(readOn(5404, () => 'Pilgrims in travel-stained cloaks queue patiently for their turn at the holy places.')).toEqual([['pilgrims queue patiently', 'threat']]);
  });

  it('soak1k-4803: the line that a stranger walks in unchallenged, under siege', () => {
    expect(readOn(4803, (s) => leafLine(DOSSIER_STATE_PROSE_DEFENSE, 'or counted by', s.name))).toEqual([['nobody stops a stranger', 'threat']]);
  });

  it('soak1k-1204: the line that the year closes ahead, under a debt', () => {
    expect(readOn(1204, (s) => leafLine(DOSSIER_STATE_PROSE_ECONOMY, 'closes every year', s.name).split(/(?<=\.)\s+/)[0])).toEqual([['a year closed ahead', 'debt']]);
  });

  it('soak1k-3005: the governor\'s "competent administration" want under a succession void and an insurgency', () => {
    expect(holdsWant(born[3005], GOAL.administration), 'the census refuses the calm-only want under the crisis').toBe(false);
    expect(readOn(3005, () => printed(WANT.administration))).toEqual([['competent administration', 'succession']]);
  });

  it('soak1k-3000: the elder\'s "stable institutional competition" want under an insurgency', () => {
    expect(holdsWant(born[3000], GOAL.competition), 'the census refuses the calm-only want under the crisis').toBe(false);
    expect(readOn(3000, () => printed(WANT.competition))).toEqual([['stable institutional competition', 'unrest']]);
  });

  // ⭐ RE-KEYED BY IDENTITY (TAIL-CRISIS-7): the line this row read, DS-ECO-10 POSTURE `established` v1, was re-said at
  // 5132da377 (W2-WRITE-SIDE-ECO-2 C, round three's #309: the pool's key is the export posture and says nothing of how the
  // town lives; landed at ba4cc210b), so its claim is CURED AT THE SOURCE, as the six census-cured rows above are: both
  // halves asserted. The cure: no economy leaf line reads the claim under this famine (anchored on the one-earner line's
  // claim, which the same leaves still carry and the same famine still reads). The instrument: it still reads the line as
  // v1 printed it before the cure, on the same born record.
  it('soak1k-5402: the line that no one export matters, under a famine that took the herds', () => {
    const name = born[5402].name;
    const leafClaims = Object.values(DOSSIER_STATE_PROSE_ECONOMY).flatMap((block) => Object.values(block.pools || {}).flat())
      .flatMap((v) => readOn(5402, () => v.text.replace(/\{settlement\}/g, name).replace(/\{tier\}|\{tierNoun\}/g, 'town')).map(([claim]) => claim));
    expectAbsentWithAnchor(leafClaims, 'depends on none alone', 'nothing is failing', 'soak1k-5402: the economy leaves under its famine');
    expect(readOn(5402, () => `${name} sends several different goods out to market; if one trade fails, the others still go.`)).toEqual([['depends on none alone', 'hunger']]);
  });

  // RE-KEYED BY CAUSE (ALLEGIANCE-CAR4, 03ff59084 THE GOALS REBUILT): the calm control's born want was the structural
  // pass's top-N seat-goal template (npcStructure.js), and A9 (people/goals.js :: dealGoals) now overwrites it — the chair
  // ruled that seat-goal pool retired (position and constraint kept). So, like the six census-cured rows above, the
  // control reads the want as it WOULD print (the registry's R11 wording, verbatim) on the same calm record: both halves
  // asserted — the born record no longer prints it, and the instrument still reads nothing without a crisis.
  it('soak1k-1803 (no crisis, the control): the same want reads nothing', () => {
    expect(born[1803].stress ?? null).toBeFalsy();
    expect(holdsWant(born[1803], GOAL.stability), 'soak1k-1803: A9 overwrites the retired seat-goal template').toBe(false);
    expect(readOn(1803, () => printed(WANT.stability))).toEqual([]);
  });
});
