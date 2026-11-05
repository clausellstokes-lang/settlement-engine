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

/** The one leaf variant whose text holds a fragment, slots filled with the place's name. */
function leafLine(leaf, fragment, name) {
  const hits = Object.values(leaf).flatMap((block) => Object.values(block.pools || {}).flat())
    .filter((v) => v.text.includes(fragment));
  expect(hits, fragment).toHaveLength(1);
  return hits[0].text.replace(/\{settlement\}/g, name).replace(/\{tier\}|\{tierNoun\}/g, 'town');
}

/** The governing ruler's want as the Tonight sheet prints it, read from the born record. */
function rulerWant(s, fragment) {
  const npc = (s.npcs || []).find((n) => typeof n?.goal === 'string' && n.goal.includes(fragment))
    ?? (s.npcs || []).find((n) => typeof n?.goal?.short === 'string' && n.goal.short.includes(fragment));
  expect(npc, `${s.name}: no NPC wants "${fragment}"`).toBeDefined();
  const goal = typeof npc.goal === 'string' ? npc.goal : npc.goal.short;
  return `Wants to ${goal.charAt(0).toLowerCase()}${goal.slice(1)}`;
}

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
  it.each([604, 1804, 2404, 3604])('soak1k-%i: the ruler\'s "current stability" want under a fracture or a debt', (i) => {
    expect(readOn(i, (s) => rulerWant(s, 'current stability'))).toEqual([['current stability', 'crisis']]);
  });

  it('soak1k-1205: "Food Secure." under an influx it cannot feed', () => {
    expect(readOn(1205, () => 'Food Secure.')).toEqual([['food secure', 'migration']]);
  });

  it('soak1k-2402: the one-earner line that says nothing is failing, under famine', () => {
    expect(readOn(2402, (s) => leafLine(DOSSIER_STATE_PROSE_ECONOMY, 'one earner.', s.name).split(/(?<=\.)\s+/)[1])).toEqual([['nothing is failing', 'hunger']]);
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
    expect(readOn(3005, (s) => rulerWant(s, 'competent administration'))).toEqual([['competent administration', 'succession']]);
  });

  it('soak1k-3000: the elder\'s "stable institutional competition" want under an insurgency', () => {
    expect(readOn(3000, (s) => rulerWant(s, 'stable institutional competition'))).toEqual([['stable institutional competition', 'unrest']]);
  });

  it('soak1k-5402: the line that no one export matters, under a famine that took the herds', () => {
    expect(readOn(5402, (s) => leafLine(DOSSIER_STATE_PROSE_ECONOMY, 'things outward', s.name).split(/(?<=\.)\s+/)[0])).toEqual([['depends on none alone', 'hunger']]);
  });

  it('soak1k-1803 (no crisis, the control): the same want reads nothing', () => {
    expect(born[1803].stress ?? null).toBeFalsy();
    expect(readOn(1803, (s) => rulerWant(s, 'current stability'))).toEqual([]);
  });
});
