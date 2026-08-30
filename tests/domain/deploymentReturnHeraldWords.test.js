/**
 * deploymentReturnHeraldWords.test.js — TE-HERALD-1 car HER-1a, the band-mapping arm.
 *
 * The wave's claim about this file is narrow and checkable: the return outcomes' reader
 * prose carries the FACT the resolution used, in words, and carries no engine scalar.
 * Three properties are proved, and the third is what makes the first two mean anything.
 *
 *   TOTALITY — every rung of both ladders is produced by the real classifier, and the
 *     classifier NEVER returns a non-member. The ladders are imported from source, never
 *     transcribed here: a test that iterated its own copy of the words would keep passing
 *     after the source ladder changed, which is the vacuity shape
 *     tests/lint/contractTestAntiVacuity.walker.test.js Rule 2 exists to red.
 *
 *   THE CUTS ARE THE RESOLUTION'S OWN — the muster word changes at exactly the ratios
 *     the branch logic changes at. This is the property that stops the prose drifting
 *     away from the arithmetic it describes: it is asserted at the boundary from BOTH
 *     sides, so moving a cut without moving the words reds.
 *
 *   REACHABLE, AND EXECUTED — the words are driven out of the REAL kernel over a real
 *     snapshot, not read off the pure function. A ladder that no live path can reach is
 *     a vocabulary nobody is ever told, and only a drive can tell the difference.
 *
 * ⚠ THE UNROLLED FORK IS PINNED BY ABSENCE, and it is the reason this file exists rather
 * than a snippet check. `failedReturnOutcome` is called with `pSuccess: 0` on the
 * splinter and disband paths because NO ROLL IS DRAWN there — the host's condition alone
 * decides. The retired sentence printed "Success 0.00, roll 0.00" on both, reporting a
 * throw that never happened. The pin below is that those two paths speak no odds word at
 * all, from the ladder or otherwise.
 */
import { describe, expect, test } from 'vitest';

import {
  RETURN_MUSTER_WORDS,
  RETURN_ODDS_WORDS,
  SEAT_GRIP_WORDS,
  deploymentReturnOutcomes,
  returnMusterWordFor,
  returnOddsWordFor,
  seatGripWordFor,
} from '../../src/domain/worldPulse/deploymentReturn.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

/** The fixture idiom of tests/domain/deploymentReturnOccupied.test.js. */
function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: {
      name,
      tier: 'town',
      population: patch.population ?? 4000,
      config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 40 },
      institutions: [],
      economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 55, label: 'Stable' },
        factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function returnHome({ saves, extraState = {}, deployment, seed = 'c' }) {
  const campaign = {
    id: 'her-words',
    name: 'her-words',
    settlementIds: saves.map((s) => s.id),
    worldState: { rngSeed: 'her-words', tick: 5, simulationRules: {}, ...extraState },
    regionalGraph: ensureRegionalGraph({ edges: [] }),
    wizardNews: { currentTick: 5, entries: [] },
  };
  const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  return deploymentReturnOutcomes({
    resolvedDeployments: [{ attackerId: 'home', deployment, targetId: 'foe', outcome: 'conquest' }],
    snapshot: snap,
    graph: snap.regionalGraph,
    rng: createPRNG(seed),
    tick: 5,
  });
}

const OCCUPIED = {
  occupations: {
    home: { occupierId: 'occupier', state: 'contested', sinceTick: 2, stateHeld: 1, resistance: 0.5, benefitYield: 0, lastTick: 4 },
  },
};
const depAt = (ratio) => ({
  maxStartStrength: 100,
  currentEffectiveStrength: 100 * ratio,
  targetId: 'foe',
  sinceTick: 1,
  role: 'siege',
});
/** All reason sentences an occupied-home return produced. */
const reasonsOf = (outcomes) => outcomes.flatMap((o) => (Array.isArray(o.reasons) ? o.reasons : []));

// A fine sweep of the whole domain, so a rung that no ratio can produce is visible.
const RATIO_GRID = Array.from({ length: 201 }, (_, i) => i / 200);

describe('TE-HERALD-1 — the return ladders are total, and never leave their vocabulary', () => {
  test('every muster rung is produced, and nothing outside the ladder ever is', () => {
    const produced = new Set(RATIO_GRID.map(returnMusterWordFor));
    expect([...produced].sort()).toEqual([...RETURN_MUSTER_WORDS].sort());
    // Out-of-domain and junk inputs still land INSIDE the vocabulary — a band function
    // that can emit `undefined` puts the word `undefined` in front of a reader.
    for (const junk of [-5, 5, NaN, Infinity, -Infinity, null, undefined, 'x']) {
      expect(RETURN_MUSTER_WORDS).toContain(returnMusterWordFor(/** @type {any} */ (junk)));
    }
  });

  test('every odds rung is produced, and nothing outside the ladder ever is', () => {
    const produced = new Set(RATIO_GRID.map(returnOddsWordFor));
    expect([...produced].sort()).toEqual([...RETURN_ODDS_WORDS].sort());
    for (const junk of [-5, 5, NaN, Infinity, -Infinity, null, undefined, 'x']) {
      expect(RETURN_ODDS_WORDS).toContain(returnOddsWordFor(/** @type {any} */ (junk)));
    }
  });

  test('every seat-grip rung is produced across the coup verdict\'s own 0.1..0.9 bound', () => {
    const produced = new Set(Array.from({ length: 81 }, (_, i) => 0.1 + i / 100).map(seatGripWordFor));
    expect([...produced].sort()).toEqual([...SEAT_GRIP_WORDS].sort());
    for (const junk of [-5, 5, NaN, null, undefined]) {
      expect(SEAT_GRIP_WORDS).toContain(seatGripWordFor(/** @type {any} */ (junk)));
    }
  });

  test('the ladders are ordered, frozen, and share no word with each other', () => {
    for (const ladder of [RETURN_MUSTER_WORDS, RETURN_ODDS_WORDS, SEAT_GRIP_WORDS]) {
      expect(Object.isFrozen(ladder)).toBe(true);
      expect(new Set(ladder).size).toBe(ladder.length);
    }
    const all = [...RETURN_MUSTER_WORDS, ...RETURN_ODDS_WORDS, ...SEAT_GRIP_WORDS];
    expect(new Set(all).size, 'two ladders share a rung — a reader cannot tell which axis they are being told about')
      .toBe(all.length);
  });
});

describe('TE-HERALD-1 — the words sit on the RESOLUTION\'s cuts, not on cuts of their own', () => {
  // SPLINTER_RATIO 0.3, DISBAND_RATIO_SCALE 0.6 (⇒ 0.18) and STRONG_RETURN_RATIO 0.62
  // are the branch's own thresholds. Asserted from BOTH sides of each, so moving a
  // threshold without moving the word reds here rather than drifting silently.
  test.each([
    ['the disband cut', 0.18],
    ['the splinter cut', 0.3],
    ['the strong-return cut', 0.62],
  ])('%s separates two DIFFERENT muster words', (_label, cut) => {
    expect(returnMusterWordFor(cut - 1e-6)).not.toBe(returnMusterWordFor(cut));
  });

  test('the muster ladder is monotone: a stronger host never reads worse', () => {
    const rank = (r) => RETURN_MUSTER_WORDS.indexOf(returnMusterWordFor(r));
    for (let i = 1; i < RATIO_GRID.length; i += 1) {
      expect(rank(RATIO_GRID[i])).toBeGreaterThanOrEqual(rank(RATIO_GRID[i - 1]));
    }
  });

  test('the odds ladder is monotone: a likelier attempt never reads longer', () => {
    const rank = (p) => RETURN_ODDS_WORDS.indexOf(returnOddsWordFor(p));
    for (let i = 1; i < RATIO_GRID.length; i += 1) {
      expect(rank(RATIO_GRID[i])).toBeGreaterThanOrEqual(rank(RATIO_GRID[i - 1]));
    }
  });
});

describe('TE-HERALD-1 — the reader is told a word, and never a scalar', () => {
  // The four detector classes of tests/helpers/proseNumericsWalk.js, at the surface a
  // reader actually sees. The census freezes the SOURCE; this pins the OUTPUT, which a
  // source-shaped cure (a scalar laundered through a differently-named helper) passes
  // and this does not.
  const SCALAR_SHAPES = [
    [/\d+\.\d{2}/, 'a two-decimal engine score'],
    [/\d\s*%/, 'a percent readout'],
    [/×\s*\d|\d\s*×/, 'a multiplier'],
    [/\b(?:Success|roll|Hold chance|chance)\s+[\d.]/i, 'a named scalar readout'],
  ];

  test.each([
    ['a gutted host', 0.05],
    ['a broken host', 0.25],
    ['a thinned host', 0.45],
    ['an all-but-whole host', 0.95],
  ])('%s: the occupied-home return speaks words only', (_label, ratio) => {
    const saves = [save('home', 'Home'), save('occupier', 'Occupier')];
    const lines = reasonsOf(returnHome({ saves, extraState: OCCUPIED, deployment: depAt(ratio) }));
    expect(lines.length, 'the branch produced no reader prose at all — the pin would be vacuous')
      .toBeGreaterThan(0);
    for (const line of lines) {
      for (const [shape, what] of SCALAR_SHAPES) {
        expect(shape.test(line), `${what} reached the reader: ${line}`).toBe(false);
      }
    }
  });

  test('the muster words are REACHABLE from the live kernel, not merely computable', () => {
    const saves = [save('home', 'Home'), save('occupier', 'Occupier')];
    const seen = new Set();
    for (const ratio of RATIO_GRID) {
      for (const line of reasonsOf(returnHome({ saves, extraState: OCCUPIED, deployment: depAt(ratio) }))) {
        for (const word of RETURN_MUSTER_WORDS) if (line.includes(word)) seen.add(word);
      }
    }
    // MEASURED, and it corrected a wrong prediction: the first draft of this arm
    // asserted three rungs on the reasoning that `gutted` belonged to the disband/
    // splinter vocabulary. It does not. The occupied branch gates on NOTHING but the
    // roll, so a gutted host mounts a failed rebellion and is described as gutted — all
    // four rungs are live here. The arm is kept as an EXACT set rather than a subset
    // precisely because that is what caught the error.
    expect([...seen].sort()).toEqual([...RETURN_MUSTER_WORDS].sort());
  });

  test('the splinter path speaks NO odds word — no roll was ever drawn there', () => {
    // An untroubled home + a host below SPLINTER_RATIO is the generic-clear splinter.
    const saves = [save('home', 'Home'), save('other', 'Other')];
    const lines = reasonsOf(returnHome({ saves, deployment: depAt(0.1) }));
    expect(lines.length, 'the splinter branch minted no prose — the pin would be vacuous')
      .toBeGreaterThan(0);
    for (const word of RETURN_ODDS_WORDS) {
      for (const line of lines) {
        expect(line.includes(word), `an odds word survived onto an unrolled path: ${line}`).toBe(false);
      }
    }
    expect(lines.join(' ')).not.toMatch(/\b(?:odds|chance|likel)/i); // anchored: lines.length > 0 asserted above, and the rolled-path control test below proves an odds word DOES appear when a roll was drawn
  });

  test('a ROLLED failure DOES carry its odds word, so the fork above is a fork', () => {
    // The control for the pin above: the same failure shape on a path that really did
    // draw a roll must still tell the reader how the attempt stood.
    const saves = [save('home', 'Home'), save('occupier', 'Occupier')];
    const lines = reasonsOf(returnHome({ saves, extraState: OCCUPIED, deployment: depAt(0.25) }));
    expect(lines.some((line) => RETURN_ODDS_WORDS.some((word) => line.includes(word))),
      `no odds word on a rolled path: ${lines.join(' | ')}`).toBe(true);
  });
});
