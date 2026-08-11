/**
 * espionageProductsDormancyFence.test.js — ES-3's FOUR-FENCE dormancy set, its lit mutant,
 * and the door census.
 *
 * ⚠ ES-3 IS THE FIRST ESPIONAGE WAVE THAT WRITES, SO ITS DORMANCY CLAIM IS NARROWER THAN
 * ES-2'S AND THE NARROWING IS THE POINT. The gauntlet could claim byte-identity in every
 * world because it wrote nothing; this stage amends the errand row and lands beliefs, so
 * the claim it can honestly make is:
 *
 *   DARK IS DARK — with `espionageEnabled` absent, false, or any truthy-non-true value, a
 *     world carrying REAL covert missions is byte-identical to one the stage never saw.
 *   LIT WITHOUT MISSIONS IS ALSO DARK — the structural half. A world whose errand ledger
 *     carries only ORDINARY errands is byte-identical lit or dark, because the walk has
 *     nothing to walk. That is what makes a campaign that lights the flag and dispatches
 *     nobody cost zero bytes.
 *   LIT WITH MISSIONS MUST MOVE — and the LIT MUTANT below asserts it, because "the stage
 *     wrote nothing" is exactly the shape in which a fence proves nothing at all. Every
 *     identity claim here carries its own liveness control on the SAME fixture.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { litCovertWorld, mintCovertFixture } from '../helpers/covertMissionFixture.js';
import { advanceEnvoyErrands, envoyErrandsOf } from '../../src/domain/worldPulse/envoyErrand.js';
import { beliefRecord } from '../../src/domain/worldPulse/beliefMap.js';
import { espionageActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import { advanceEspionageProducts } from '../../src/domain/worldPulse/espionage/espionageProductStage.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ESPIONAGE_DIR = 'src/domain/worldPulse/espionage';

/** @param {unknown} value */
function hash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function town(id, name) {
  return {
    id,
    name,
    crimeRate: 'moderate',
    safety: 'guarded',
    wealth: 'moderate',
    population: 4000,
    settlement: {
      name,
      tier: 'city',
      economicState: {
        prosperity: 'Wealthy',
        tradeAccess: 'crossroads',
        foodSecurity: { storageMonths: 9, foodRatio: 1.2 },
      },
    },
  };
}

const SNAPSHOT = Object.freeze({
  settlements: [town('ashford', 'Ashford'), town('westmarch', 'Westmarch'), town('irontown', 'Irontown')],
});
const GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'hostile' }],
});
const AXES = Object.freeze({ beliefAxesEnabled: true, believedConditionsEnabled: true });

/** The sentinel for "the key is not there at all", which is not any value the key can hold. */
const ABSENT = Symbol('flag-absent');

/**
 * The lit rule set with `espionageEnabled` set to one exact value — or removed entirely.
 * @param {unknown} flag
 * @returns {Record<string, unknown>}
 */
function rulesWithFlag(flag) {
  const rules = { .../** @type {Record<string, unknown>} */ (litCovertWorld(AXES).simulationRules) };
  delete rules.espionageEnabled;
  if (flag !== ABSENT) rules.espionageEnabled = /** @type {never} */ (flag);
  return rules;
}

/** The seeded beliefs both worlds start from — WESTMARCH's opinion of IRONTOWN. */
const BELIEF_MAPS = Object.freeze({
  westmarch: {
    seat: {
      irontown: {
        readiness: 0.4,
        strengthBand: 3,
        allianceLabel: 'rival',
        faithLabel: null,
        confidence01: 0.8,
        lastUpdateTick: 11,
        conditionsBands: { storesBand: 'deep', tierBand: 'town' },
      },
    },
  },
  ashford: {
    seat: {
      irontown: {
        readiness: 0.1,
        strengthBand: 0,
        allianceLabel: 'allied',
        faithLabel: null,
        confidence01: 0.7,
        lastUpdateTick: 9,
      },
    },
  },
});

/**
 * TEN TICKS OF THE REAL ERRAND ADVANCE with the product stage composed where the pulse
 * composes it. Returns the per-tick hashes AND the stage's own receipts, so the identity
 * claim and its liveness control are measured off ONE run rather than two.
 *
 * ⚠ THE FLAG IS SET BY DELETION, NOT BY SPREAD. `litCovertWorld` lights `espionageEnabled`
 * by default, so a caller spreading `{}` over it gets a LIT world while believing it asked
 * for an absent flag — the exact shape in which an absent-vs-false differential quietly
 * compares a world with itself. `ABSENT` removes the key outright.
 *
 * @param {unknown} flag `ABSENT`, or the literal value to write at `espionageEnabled`
 * @param {{plain?: boolean}} [options]
 */
function tenTicks(flag, { plain = false } = {}) {
  const minted = mintCovertFixture({
    ...litCovertWorld(AXES),
    simulationRules: rulesWithFlag(flag),
  }, { plain });
  let state = { ...minted.worldState, spatialLedgers: { beliefMaps: BELIEF_MAPS } };
  const hashes = [];
  const gatherings = [];
  const landings = [];
  for (let tick = 11; tick <= 20; tick += 1) {
    state = advanceEnvoyErrands({ worldState: state, tick }).worldState;
    const products = advanceEspionageProducts({
      worldState: state, tick, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    });
    state = products.worldState;
    gatherings.push(...products.gatherings);
    landings.push(...products.landings);
    hashes.push(hash({ errands: envoyErrandsOf(state), beliefs: state.spatialLedgers }));
  }
  // THE FLAG KEY ITSELF IS THE ONE LAWFUL DIFFERENCE, excluded EXPLICITLY rather than by
  // hashing a narrower object — a fence that quietly compared only the errand ledger would
  // have hidden a write anywhere else in the world.
  const { espionageEnabled, ...rulesWithoutFlag } = /** @type {Record<string, unknown>} */ (
    state.simulationRules
  );
  return {
    hashes,
    gatherings,
    landings,
    worldHash: hash({ ...state, simulationRules: rulesWithoutFlag }),
    flagSeen: espionageEnabled,
    homeBelief: beliefRecord(state, 'ashford', 'irontown'),
  };
}

describe('ES-3 dormancy — FENCE 1: dark is dark, and lit-without-missions is dark too', () => {
  test('ten ticks DARK over a REAL mission are byte-identical to a world with no stage', () => {
    const dark = tenTicks(false);
    const absent = tenTicks(ABSENT);
    expect(dark.hashes).toEqual(absent.hashes);
    expect(dark.worldHash).toBe(absent.worldHash);
    expect(dark.hashes).toHaveLength(10);
    // NOTHING accrued and NOTHING landed in either.
    expect(dark.gatherings).toEqual([]);
    expect(dark.landings).toEqual([]);
    expect(dark.homeBelief.lastUpdateTick).toBe(9);
    // THE LIVENESS CONTROL, on the same fixture: the LIT run over the same mission moves.
    const lit = tenTicks(true);
    expect(lit.gatherings.length).toBeGreaterThan(0);
    expect(lit.hashes).not.toEqual(dark.hashes);
  });

  test('LIT with only ORDINARY errands is byte-identical to dark — the structural half', () => {
    const litPlain = tenTicks(true, { plain: true });
    const darkPlain = tenTicks(false, { plain: true });
    expect(litPlain.hashes).toEqual(darkPlain.hashes);
    expect(litPlain.worldHash).toBe(darkPlain.worldHash);
    expect(litPlain.gatherings).toEqual([]);
    // THE CONTROL that keeps this from being two empty runs: the ledger really is populated
    // and the SAME lit rules over a COVERT row do move the world.
    const rows = envoyErrandsOf(
      mintCovertFixture(litCovertWorld(AXES), { plain: true }).worldState,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].covert).toBeUndefined();
    expect(tenTicks(true).gatherings.length).toBeGreaterThan(0);
  });
});

describe('ES-3 dormancy — FENCE 2: absent, false and truthy-non-true are ONE world', () => {
  test('every non-true spelling of the flag reads identically at the gate and at the stage', () => {
    const world = mintCovertFixture(litCovertWorld(AXES)).worldState;
    const baseline = tenTicks(false).worldHash;
    for (const value of [ABSENT, false, 'true', 1, {}, null, 0]) {
      expect(espionageActive({ ...world, simulationRules: rulesWithFlag(value) })).toBe(false);
      expect(tenTicks(value).worldHash).toBe(baseline);
    }
    // ...and `=== true` is the ONE spelling that opens it.
    expect(espionageActive({ ...world, simulationRules: rulesWithFlag(true) })).toBe(true);
    expect(tenTicks(true).worldHash).not.toBe(baseline);
  });

  test('THE DOOR CENSUS: each of the three gate doors refuses ALONE', () => {
    const lit = {
      ...mintCovertFixture(litCovertWorld(AXES)).worldState,
      spatialLedgers: { beliefMaps: BELIEF_MAPS },
    };
    expect(espionageActive(lit)).toBe(true);
    // DOOR 1 — beliefs live. The products ARE belief writes; without the substrate the
    // layer is meaningless.
    const noBeliefs = { ...lit, spatialCanonVersion: 0 };
    expect(espionageActive(noBeliefs)).toBe(false);
    expect(advanceEspionageProducts({
      worldState: noBeliefs, tick: 13, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    }).gatherings).toEqual([]);
    // DOOR 2 — the errand spine. Covert missions ride SP-D's row; there is no host without it.
    const noSpine = {
      ...lit,
      simulationRules: { ...lit.simulationRules, errandSpineEnabled: false },
    };
    expect(espionageActive(noSpine)).toBe(false);
    expect(advanceEspionageProducts({
      worldState: noSpine, tick: 13, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    }).gatherings).toEqual([]);
    // DOOR 3 — the flag itself, by name.
    const noFlag = {
      ...lit,
      simulationRules: { ...lit.simulationRules, espionageEnabled: false },
    };
    expect(espionageActive(noFlag)).toBe(false);
    expect(advanceEspionageProducts({
      worldState: noFlag, tick: 13, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    }).gatherings).toEqual([]);
    // EACH ABSENCE IS THE DOOR'S DOING: with all three open the same call gathers.
    expect(advanceEspionageProducts({
      worldState: lit, tick: 13, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    }).gatherings).toHaveLength(1);
  });
});

describe('ES-3 dormancy — FENCE 3: the call path, and FENCE 4: the gate polarity', () => {
  test('a DARK stage returns the caller\'s OWN world by reference, having read nothing', () => {
    const lit = {
      ...mintCovertFixture(litCovertWorld({ ...AXES, espionageEnabled: false })).worldState,
      spatialLedgers: { beliefMaps: BELIEF_MAPS },
    };
    const out = advanceEspionageProducts({
      worldState: lit, tick: 13, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    });
    // BY REFERENCE, not merely deep-equal: a stage that rebuilt an identical world would
    // still have walked the ledger, and identity is the only evidence that it did not.
    expect(out.worldState).toBe(lit);
    expect(out.changed).toBe(false);
    expect(out).toMatchObject({ gatherings: [], landings: [], skipped: [] });
    // An invalid tick refuses the same way, before the gate is even consulted.
    expect(advanceEspionageProducts({
      worldState: { ...lit, simulationRules: { ...lit.simulationRules, espionageEnabled: true } },
      tick: -1,
      snapshot: SNAPSHOT,
      regionalGraph: GRAPH,
    }).worldState).toBeTruthy();
  });

  test('the flag is read BY NAME in exactly ONE espionage module — the gate', () => {
    /** @type {Record<string, string>} */
    const sources = {};
    for (const entry of readdirSync(join(ROOT, ESPIONAGE_DIR))) {
      if (!entry.endsWith('.js')) continue;
      sources[entry] = readFileSync(join(ROOT, ESPIONAGE_DIR, entry), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
    }
    expect(Object.keys(sources).length).toBeGreaterThanOrEqual(7);
    const readers = Object.entries(sources)
      .filter(([, source]) => /\bespionageEnabled\b/.test(source))
      .map(([file]) => file)
      .sort();
    // ONE by-name read, in the gate. A second would be a second polarity to keep in step,
    // and the estate has shipped a fully-wired flag the census could not see before.
    expect(readers).toEqual(['espionageGate.js']);
    // NON-VACUITY: the scan can see the token, proven by a plant rather than assumed.
    expect(Object.entries({ ...sources, planted: 'rules.espionageEnabled === true' })
      .filter(([, source]) => /\bespionageEnabled\b/.test(source))).toHaveLength(2);
    // ...and every OTHER espionage module that gates at all gates through the ONE door.
    const gated = Object.entries(sources)
      .filter(([, source]) => /\bespionageActive\b/.test(source))
      .map(([file]) => file)
      .sort();
    // ⏱ ES-5 ADDS ONE MEMBER AND DELIBERATELY DOES NOT ADD THE OTHER. The doctrine STAGE
    // gates (it is the wave's world-side reader, and dark must compose nothing); the
    // visibility predicate does NOT, because it is a counting function over rows its caller
    // already holds and its dormancy is the gauntlet's. That distinction is asserted rather
    // than left to be inferred from a list nobody reads twice.
    // ⏱ ES-5b ADDS ONE MEMBER, AND IT IS THE FIRST GATED LEAF WITH PRODUCTION IMPORTERS
    // OUTSIDE THE FAMILY. `espionagePresence.js` is read by settlementPolitics.js and
    // factionCompetition.js, so it cannot inherit anybody's dormancy the way the
    // visibility predicate does — its `presenceSharesFor` composer must refuse at the ONE
    // door itself, before it touches a world object, or a dark world stops being
    // byte-identical. That is exactly why it gates and the counting leaf beside it does not.
    // ⏱ ES-5c ADDS ONE MORE, FOR THE SAME REASON AND ONE STRONGER. `espionageCareer.js` is
    // read by `npcLadderChallenge.js` — the FIRST espionage→ladder import edge in the repo —
    // so it too has a production importer outside the family and can inherit nobody's
    // dormancy. Its `careerRiskFor` refuses at the ONE door, on a single `espionageActive`
    // read, BEFORE it touches a world object: the ladder calls it once per adjacent rung pair
    // per faction per settlement per tick, so a gate placed any later would cost a dark world
    // real work AND stop it being byte-identical. It gates first and reads second.
    // ⏱ ES-5d ADDS ONE MORE, AND IT IS THE FIRST GATED LEAF THAT **WRITES**. Every member
    // above refuses at the door to stay byte-identical while computing nothing; this one
    // refuses to keep from MINTING A LEDGER KEY. `espionageCareerCredit.js` deposits the
    // career credit, so an ungated pass would leave a `spatialLedgers` key in a dark world and
    // every dormancy golden in this file would move. It refuses on `espionageActive` before it
    // touches a world object, exactly like its siblings, and then on the LADDER's flag as
    // well — the chair's O5 ruling is that a dark ladder must mint no key either, because a
    // ledger that accumulates while nothing consumes it is a leak wearing a receipt.
    expect(gated).toEqual([
      'espionageCareer.js', 'espionageCareerCredit.js',
      'espionageDoctrineStage.js', 'espionageGate.js', 'espionageGauntlet.js',
      'espionageMissions.js', 'espionagePresence.js', 'espionageProductStage.js',
    ]);
    // The visibility predicate is a REAL module in the family that deliberately carries no
    // gate, so its exclusion is anchored by a gating sibling that travels the same scan.
    expectAbsentWithAnchor(gated, 'espionageWariness.js', 'espionageGate.js', 'the espionage gate census');
    expect(Object.keys(sources)).toContain('espionageWariness.js');
  });
});

describe('ES-3 dormancy — THE LIT MUTANT: the stage really does write when it should', () => {
  test('a lit world with a real mission moves the errand row AND the belief map', () => {
    const lit = tenTicks(true);
    // The gradient really accrued...
    expect(lit.gatherings.length).toBeGreaterThan(1);
    expect(new Set(lit.gatherings.map((row) => row.atTick)).size).toBe(lit.gatherings.length);
    // ...through the magic arm, so every partial was SENT and every send LANDED...
    expect(lit.gatherings.every((row) => row.sentHome === true)).toBe(true);
    expect(lit.landings.length).toBe(lit.gatherings.length);
    // ...and the home court's belief really moved off the seed.
    expect(lit.homeBelief.lastUpdateTick).toBeGreaterThan(9);
    expect(lit.homeBelief.confidence01).not.toBe(0.7);
    // Without this block, FENCE 1's identity claim would be the identity of two dead runs.
    expect(lit.flagSeen).toBe(true);
  });
});
