/**
 * generalStateProseDesk.test.js — DESK CAR 11: the general desk, and an ALIVENESS suite.
 *
 * WHAT THIS FILE IS FOR. A dark world and a lit-but-incapable world are BYTE-IDENTICAL to
 * every test that checks shape, arm, identity or determinism. So the arms below are not
 * "the desk returns the right key" — they are "SWITCH THE BLOCK ON AND A SENTENCE COMES
 * OUT", pool by pool, driven from values the real producers really write.
 *
 * ── THE THREE THINGS THAT WOULD MAKE THIS SUITE VACUOUS ──────────────────────────────
 *   • A POOL KEY THE CORPUS DOES NOT CARRY. Every key the desk can emit is asserted to
 *     exist in the shipped leaf, and each band vocabulary is proved EQUAL to the
 *     producer's own rather than to a transcription of it.
 *   • A POOL NO STATE CAN REACH. Every pool of all four blocks is driven, and the counts
 *     are asserted against the leaf so a new pool cannot arrive untested.
 *   • A ROUTE THAT FIRES ON A DEFAULT. The route maps are asserted TOTAL IN BOTH
 *     DIRECTIONS against source-extracted producer vocabularies, and the residue — the
 *     tokens with no pool and the pools no token reaches — is PINNED as a number, so the
 *     day either side moves the number moves with it.
 *
 * ── ⭐ THE PRODUCER VOCABULARIES ARE READ OUT OF THE PRODUCERS ───────────────────────
 * Three of the four label ladders this desk routes are inline literals in generator
 * source rather than exported constants, so they are extracted here through
 * `mustExtract`, which THROWS when its anchor moves. A hand-kept twin in this file would
 * be the second opinion that drifts, and an extractor that returned `[]` on a rename
 * would turn every totality arm below green-on-nothing in the same instant.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  GENERAL_STATE_PROSE_SILENT,
  SLOT_FILL_SHAPES,
  SLOT_FILL_TABLES,
  foodDeficitDimension,
  foodSecurityPoolKey,
  generalStateProse,
  originRoutePoolKey,
  originTierPoolKey,
  groundPoolKey,
  institutionsPoolKey,
  marketPoolKey,
  prosperityPoolKey,
  readinessPoolKey,
  safetyPoolKey,
  situationPoolKey,
  systemsHealthScorePoolKey,
  viabilityPoolKey,
} from '../../src/domain/display/stateProse/generalStateProse.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import {
  UNMOUNTED_BLOCKS, drawnAtMount, sentenceMountForBlock,
} from '../../src/domain/display/stateProse/dossierMounts.js';
import { poolDimensions } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { PROSPERITY_LABELS, PROSPERITY_RANK } from '../../src/domain/prosperityRank.js';
import { getTerrainType } from '../../src/generators/terrainHelpers.js';
import { ROUTE_TO_SCENE } from '../../src/generators/narrativeGenerator.js';
import { ORIGIN_ARMS, originArmKey } from '../../src/generators/narrative/settlementOriginProse.js';
import { resolvePrimaryStress } from '../../src/generators/stressPriority.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mustExtract } from '../helpers/sourceContract.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = resolve(import.meta.dirname, '../..');
const src = (rel) => readFileSync(resolve(ROOT, rel), 'utf8');

/** Every block this desk lights, and the pool counts the shipped leaf carries. */
const BLOCK_POOLS = Object.freeze({
  'DS-GEN-3': 42, 'DS-GEN-5': 5, 'DS-GEN-6': 9, 'DS-GEN-12': 5, 'DS-GEN-13': 4, 'DS-GEN-17': 5,
});

/**
 * The ONE block of the set that partitions itself by a demoted STATE dimension. Named here
 * so the arm below can hold every OTHER block to `[]` and this one to its dimension, rather
 * than exempting it — an exemption is how a block quietly grows a dimension nobody answers.
 */
const DIMENSIONED = Object.freeze({ 'DS-GEN-6': 'deficit' });

/** @param {string} id @returns {string[]} */
const poolsOf = (id) => Object.keys(DOSSIER_STATE_PROSE_GENERAL[id].pools);

/** A settlement stub carrying only a name — the one slot this desk fills. */
const TOWN = Object.freeze({ name: 'Thornwall' });

/**
 * A drawn line is a real sentence: a non-empty string with no unfilled seam left in it.
 *
 * ⚠ IT DOES NOT ASSERT THE TOWN'S NAME, and that is measured rather than lax. Several pools
 * carry a variant that names NO slot at all — DS-GEN-12's WOODLAND elder line is one — and
 * the draw is seeded, so which variant a pool yields is not this arm's business. The
 * generator arm below asserts the name over a whole page, where at least one line must
 * carry it.
 * @param {unknown} line @param {string} where
 */
function expectSentence(line, where) {
  expect(typeof line, `${where}: no sentence`).toBe('string');
  expect(String(line).length, `${where}: empty sentence`).toBeGreaterThan(20);
  expect(String(line), `${where}: an unfilled seam reached the reader`).not.toMatch(/\{[a-z_]+\}/i); // anchored: the two assertions above prove the line is a real non-empty string
}

/**
 * The desk over one set of readings, BY POSITION.
 *
 * ⚠ IT MUST BE BY POSITION AND NOT A FLAT LIST, and the first cut of this file learned it
 * the hard way: `DS-GEN-13` resolves `NO-MARKET` on a reading that names no institutions,
 * so a flat count of "how many sentences came out" is one higher than the lens under test
 * on every arm that does not mention a market. A helper that folds four positions into one
 * number cannot tell a lens firing from its neighbour firing.
 * @param {object} readings
 * @returns {{health: string[], ground: string|null, market: string|null, institutions: string|null}}
 */
function draw(readings) {
  const prose = generalStateProse(TOWN, readings, { seed: 'aliveness', audience: 'dm' });
  return {
    situation: prose.overview.situation?.sentence ?? null,
    origin: prose.overview.origin.map((rung) => rung.sentence).filter(Boolean),
    health: prose.overview.systemsHealth.map((rung) => rung.sentence).filter(Boolean),
    ground: prose.overview.ground?.sentence ?? null,
    market: prose.overview.market?.sentence ?? null,
    institutions: prose.overview.institutions?.sentence ?? null,
  };
}

// ── The producer vocabularies, extracted from the producers themselves ───────────────

/**
 * `defenseGenerator.js`'s readiness band table — six labels, inline literals.
 * @returns {string[]}
 */
function readinessLabels() {
  const body = src('src/generators/defenseGenerator.js');
  mustExtract(body, 'readiness >= 76 ?', 'the readiness band table in defenseGenerator.js');
  const window = body.slice(body.indexOf('readiness >= 76 ?'));
  const found = [...window.slice(0, 900).matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
  if (found.length !== 6) throw new Error(`readinessLabels extracted ${found.length}, expected 6`);
  return found;
}

/**
 * `foodGenerator.js`'s food-security ladder — six labels, inline assignments.
 * @returns {string[]}
 */
function foodLabels() {
  const body = src('src/generators/foodGenerator.js');
  mustExtract(body, "label = 'Deficit — Active Famine'", 'the food security ladder in foodGenerator.js');
  const found = [...body.matchAll(/^\s*label = '([^']+)';$/gm)].map((m) => m[1]);
  const unique = [...new Set(found)];
  if (unique.length !== 6) throw new Error(`foodLabels extracted ${unique.length}, expected 6`);
  return unique;
}

/**
 * `safetyProfile.js`'s complete HEAD-WORD vocabulary: every strain label it can compose a
 * composite from, plus every base label it can assign outright. The head word is the part
 * before the first em dash, which is the producer's own fold.
 * @returns {string[]}
 */
function safetyHeadWords() {
  const body = src('src/generators/safetyProfile.js');
  mustExtract(body, 'const strainLabel', 'the strain label ladder in safetyProfile.js');
  mustExtract(body, "safetyLabel = 'Very Safe'", 'the base safety ladder in safetyProfile.js');
  const strain = [...body.matchAll(/strainLabel = [^;]*?;/g)]
    .flatMap((m) => [...m[0].matchAll(/'([^']+)'/g)].map((q) => q[1]));
  const base = [...body.matchAll(/safetyLabel = '([^']+)';/g)].map((m) => m[1]);
  const composite = [...body.matchAll(/safetyLabels\.push\('([^'`]+)'\)/g)].map((m) => m[1]);
  const heads = [...strain, ...base, ...composite].map((l) => l.split('—')[0].trim());
  const unique = [...new Set(heads)].sort();
  if (unique.length < 10) throw new Error(`safetyHeadWords extracted ${unique.length}, expected the full ladder`);
  return unique;
}

/** The live terrain vocabulary, from `getTerrainType`'s own route table plus its default. */
const TERRAINS = Object.freeze([...new Set([
  ...['port', 'river', 'crossroads', 'road', 'isolated', 'mountain_pass', 'mountain_road', 'desert_road', 'unknown_route']
    .map((route) => getTerrainType(route)),
  'hills',
])].sort());

describe('the general desk — guard the guard', () => {
  it('the corpus join is populated and the four blocks carry the pools the arms count', () => {
    expect(Object.keys(DOSSIER_STATE_PROSE_GENERAL).length, 'the general leaf emptied').toBe(23);
    for (const [id, count] of Object.entries(BLOCK_POOLS)) {
      expect(poolsOf(id).length, `${id} pool count moved`).toBe(count);
    }
    // The slot mirror is the annex's, and the desk owns no literal fill table.
    expect(SLOT_FILL_SHAPES).toEqual({ settlement: 'proper' });
    expect(SLOT_FILL_TABLES).toEqual({});
    // WHICH BLOCKS PARTITION THEMSELVES BY A DEMOTED STATE DIMENSION, derived from the
    // kernel's own reader so this file cannot hold a second opinion about what a dimension
    // is. Every block but DS-GEN-6 must be free of one — that is why their mount rows
    // declare none — and DS-GEN-6 must carry exactly `deficit`, which is what its row
    // declares and what the kernel fails closed on when the caller does not answer it.
    for (const id of Object.keys(BLOCK_POOLS)) {
      const found = new Set();
      for (const pool of Object.values(DOSSIER_STATE_PROSE_GENERAL[id].pools)) {
        for (const dimension of poolDimensions(pool)) found.add(dimension);
      }
      expect([...found], `${id} dimensions`).toEqual(DIMENSIONED[id] ? [DIMENSIONED[id]] : []);
    }
  });

  it('the source extractors reach real producers and would throw if they moved', () => {
    expect(readinessLabels()).toEqual([
      'Fortress', 'Well-Defended', 'Defensible', 'Lightly Defended', 'Vulnerable', 'Undefended',
    ]);
    expect(foodLabels().sort()).toEqual([
      'Deficit', 'Deficit — Active Famine', 'Import-Dependent', 'Pressured', 'Secure', 'Surplus',
    ]);
    expect(safetyHeadWords().length).toBeGreaterThan(9);
    expect(TERRAINS).toEqual(['coastal', 'desert', 'forest', 'hills', 'mountain', 'plains', 'riverside']);
  });
});

describe('DS-GEN-3 — ten lenses over one block, and three label traps', () => {
  it('THE SCORE LADDER: five axes by four bands, and all twenty pools fire from a number', () => {
    const reached = new Set();
    // Driven from SCORES rather than from band words: the desk must do the banding, and it
    // must do it with the canonical ladder. 10/30/50/80 sit inside CRITICAL/WEAK/ADEQUATE/
    // STRONG on the 65/40/20 cut and nowhere near a boundary.
    for (const axis of ['military', 'monster', 'internal', 'economic', 'magical']) {
      for (const score of [10, 30, 50, 80]) {
        const key = systemsHealthScorePoolKey(axis, score);
        expect(key, `${axis} at ${score} routed nowhere`).toBe(`scores.${axis}: ${scoreBand(score)}`);
        reached.add(key);
        const drawn = draw({ scores: { [axis]: score } }).health;
        expect(drawn.length, `${axis} ${score} drew no sentence`).toBe(1);
        expect(drawn[0]).toContain('Thornwall');
      }
    }
    expect(reached.size).toBe(20);
    // A score that is not a number is NOT a zero: an absent defence profile must not read
    // CRITICAL. Asserted POSITIVELY as null rather than as an exclusion, because the answer
    // this arm is about is a value and not a membership.
    expect(systemsHealthScorePoolKey('military', undefined)).toBeNull();
    expect(systemsHealthScorePoolKey('military', NaN)).toBeNull();
    expect(systemsHealthScorePoolKey('nonesuch', 80)).toBeNull();
    expect(draw({ scores: { military: undefined } }).health).toEqual([]);
  });

  it('THE PROSPERITY TRAP: no pool key is a producer label, and the map is total both ways', () => {
    // FORWARD: every spelling the ONE prosperity ladder knows routes to a pool.
    const unrouted = Object.keys(PROSPERITY_RANK).filter((label) => prosperityPoolKey(label) === null);
    expect(unrouted, 'a PROSPERITY_RANK spelling reaches no pool').toEqual([]);
    // BACKWARD: every prosperity pool of the block is claimed by at least one spelling.
    const claimed = new Set(Object.keys(PROSPERITY_RANK).map((l) => prosperityPoolKey(l)));
    const pools = poolsOf('DS-GEN-3').filter((k) => k.startsWith('prosperity: '));
    expect([...claimed].sort()).toEqual(pools.sort());
    expect(pools.length).toBe(5);
    // THE TRAP ITSELF: not one pool key equals a label, so a `label`-shaped route darkens
    // the whole lens. Anchored on the totality arm two lines up, which proves the CLOSED
    // map does route every one of them.
    for (const label of PROSPERITY_LABELS) {
      expectAbsentWithAnchor(
        pools, `prosperity: ${label}`, pools[0],
        `${label} was assumed to be its own pool key`,
      );
    }
    // ⛔ THE DORMANT POOL, DECLARED. `deriveProsperityLabel` emits six labels and none of
    // them is the bottom rung's, so `Poverty / Impoverished` is unreachable from a freshly
    // generated settlement and reachable only from a stored or authored alias. That is a
    // measurement of the producer, not a hole in this map.
    const fromEmitted = new Set(PROSPERITY_LABELS.map((l) => prosperityPoolKey(l)));
    expect(fromEmitted.size).toBe(4);
    expect(prosperityPoolKey('Impoverished')).toBe('prosperity: Poverty / Impoverished');
    expect(prosperityPoolKey('Subsistence')).toBe('prosperity: Poverty / Impoverished');
    // Every one of the five pools still draws a real sentence when it IS reached.
    for (const pool of pools) {
      const label = Object.keys(PROSPERITY_RANK).find((l) => prosperityPoolKey(l) === pool);
      expect(draw({ prosperity: label }).health, `${pool} drew nothing`).toHaveLength(1);
    }
  });

  it('THE FOOD TRAP: five labels are identities and the sixth is not, which is the point', () => {
    const labels = foodLabels();
    const pools = poolsOf('DS-GEN-3').filter((k) => k.startsWith('foodSecurity.label: '));
    expect(pools.length).toBe(6);
    // FORWARD and BACKWARD in one comparison: six labels, six pools, a bijection.
    const routed = labels.map((l) => foodSecurityPoolKey(l));
    expect(routed.filter((k) => k === null), 'a food label reaches no pool').toEqual([]);
    expect([...new Set(routed)].sort()).toEqual(pools.sort());
    // THE TRAP: the producer writes an em dash, the corpus a multiplication sign, and the
    // pool it darkens is the FAMINE one. Anchored on the bijection above.
    expect(foodSecurityPoolKey('Deficit — Active Famine')).toBe('foodSecurity.label: Deficit × Active Famine');
    expectAbsentWithAnchor(
      pools, 'foodSecurity.label: Deficit — Active Famine',
      'foodSecurity.label: Deficit × Active Famine',
      'the famine pool was assumed to be spelled the way the producer spells it',
    );
    for (const label of labels) {
      expect(draw({ foodSecurityLabel: label }).health, `${label} drew nothing`).toHaveLength(1);
    }
  });

  it('READINESS: a six-for-six identity with the generator band table, and all six fire', () => {
    const labels = readinessLabels();
    const pools = poolsOf('DS-GEN-3').filter((k) => k.startsWith('defenseProfile.readiness.label: '));
    expect(labels.map((l) => readinessPoolKey(l))).toEqual(labels.map((l) => `defenseProfile.readiness.label: ${l}`));
    expect([...new Set(labels.map((l) => readinessPoolKey(l)))].sort()).toEqual(pools.sort());
    for (const label of labels) {
      expect(draw({ readinessLabel: label }).health, `${label} drew nothing`).toHaveLength(1);
    }
  });

  it('VIABILITY: both pools fire on a boolean, and an absent verdict is not a failed one', () => {
    expect(draw({ viable: true }).health).toHaveLength(1);
    expect(draw({ viable: false }).health).toHaveLength(1);
    expect(viabilityPoolKey(true)).toBe('economicViability.viable: true');
    expect(viabilityPoolKey(false)).toBe('economicViability.viable: false');
    // A settlement with no verdict must not read as one that failed, and neither a string
    // nor a zero may stand in for the boolean. Asserted positively as null.
    for (const value of [undefined, null, 'false', 0, '']) {
      expect(viabilityPoolKey(value), `${String(value)} routed somewhere`).toBeNull();
    }
  });

  it('THE SAFETY RESIDUE: nine head words routed, six emitted with no pool, one pool word never emitted', () => {
    const heads = safetyHeadWords();
    const pools = poolsOf('DS-GEN-3').filter((k) => k.startsWith('safetyProfile.safetyLabel: '));
    expect(pools.length).toBe(3);
    const routed = heads.filter((h) => safetyPoolKey(h) !== null).sort();
    const residue = heads.filter((h) => safetyPoolKey(h) === null).sort();
    // ⛔ THE FINDING, PINNED IN BOTH DIRECTIONS. Six head words the producer really writes
    // reach no pool at all — and three of them (`Very Safe`, `Safe`, `Moderate`) are the
    // NO-STRESS base labels, so this lens speaks on a troubled town and is silent on a calm
    // one. Routing them onto the {Secure, …} pool would be this lane deciding that the
    // corpus's `Secure` and the generator's `Safe` name one reading, which is a vocabulary
    // ruling and is raised for the chair rather than taken here.
    expect(residue).toEqual(['Critical', 'Moderate', 'Safe', 'Suspicious', 'Very Safe', 'Volatile']);
    expect(routed).toEqual(['Controlled', 'Dangerous', 'Desperate', 'Quarantined', 'Restricted', 'Strained', 'Tense', 'Unsafe']);
    // The other direction: `Secure` is named by a pool and written by no branch of the
    // producer. Anchored on the routed list above, which is extracted from the same source.
    expectAbsentWithAnchor(
      heads, 'Secure', 'Controlled',
      'the corpus safety vocabulary was assumed to be the producer vocabulary',
    );
    // All three pools still fire from a head word the producer really writes, and the
    // COMPOSITE shape a real settlement carries routes on its head word.
    for (const head of routed) expect(draw({ safetyLabel: head }).health, `${head} drew nothing`).toHaveLength(1);
    expect(safetyPoolKey('Dangerous — Plague Unrest — Plague Conditions'))
      .toBe('safetyProfile.safetyLabel: head word in {Dangerous, Desperate}');
    expect([...new Set(routed.map((h) => safetyPoolKey(h)))].sort()).toEqual(pools.sort());
  });
});

describe('DS-GEN-12 / DS-GEN-13 / DS-GEN-17 — three total partitions', () => {
  it('THE GROUND: the terrain family partition is total over the live enum and all five fire', () => {
    const reached = new Set(TERRAINS.map((t) => groundPoolKey(t)));
    expect([...reached].filter((k) => k === null), 'a live terrain reaches no family').toEqual([]);
    expect([...reached].sort()).toEqual(poolsOf('DS-GEN-12').sort());
    for (const terrain of TERRAINS) {
      expectSentence(draw({ terrainType: terrain }).ground, terrain);
    }
  });

  it('THE MARKET: four pools, and the evaluation order is driven rather than described', () => {
    const stalls = [{ name: 'Weekly market' }];
    // NO-MARKET first — a town with no market-class row is not an entrepôt of its own stalls.
    expect(marketPoolKey({ institutions: [{ name: 'Mill' }], isEntrepot: true, tradeRouteAccess: 'road' })).toBe('NO-MARKET');
    // ENTREPOT beats the two MARKET- keys, on an open approach and on a narrow one alike.
    expect(marketPoolKey({ institutions: stalls, isEntrepot: true, tradeRouteAccess: 'road' })).toBe('ENTREPOT');
    expect(marketPoolKey({ institutions: stalls, isEntrepot: true, tradeRouteAccess: 'isolated' })).toBe('ENTREPOT');
    // The remainder splits by approach, on the three-value NARROW convention.
    for (const route of ['isolated', 'mountain_pass', 'mountain_road']) {
      expect(marketPoolKey({ institutions: stalls, tradeRouteAccess: route }), route).toBe('MARKET-NARROW');
    }
    for (const route of ['road', 'river', 'port', 'crossroads', 'desert_road']) {
      expect(marketPoolKey({ institutions: stalls, tradeRouteAccess: route }), route).toBe('MARKET-OPEN');
    }
    // The name class is the engine's own, not a category test.
    for (const name of ['Weekly market', 'Grand bazaar', 'Caravan masters\' exchange', 'The shambles', 'Market stalls']) {
      expect(marketPoolKey({ institutions: [{ name }], tradeRouteAccess: 'road' }), name).toBe('MARKET-OPEN');
    }
    const reached = new Set([
      marketPoolKey({ institutions: [], tradeRouteAccess: 'road' }),
      marketPoolKey({ institutions: stalls, isEntrepot: true, tradeRouteAccess: 'road' }),
      marketPoolKey({ institutions: stalls, tradeRouteAccess: 'isolated' }),
      marketPoolKey({ institutions: stalls, tradeRouteAccess: 'road' }),
    ]);
    expect([...reached].sort()).toEqual(poolsOf('DS-GEN-13').sort());
    for (const state of [
      { institutions: [] }, { institutions: stalls, isEntrepot: true },
      { institutions: stalls, tradeRouteAccess: 'isolated' }, { institutions: stalls, tradeRouteAccess: 'road' },
    ]) expectSentence(draw(state).market, JSON.stringify(state));
  });

  it('THE ROSTER: five keys in most-constrained order, and BARE is the pure else-arm', () => {
    const cases = [
      [{ hasCourtSystem: true, hasPrison: true, hasGranary: true }, 'ADMINISTERED'],
      [{ hasCourtSystem: true, hasPrison: false, hasWatch: true }, 'GARRISONED'],
      [{ hasNavy: true }, 'GARRISONED'],
      [{ hasMilitaryInst: true }, 'GARRISONED'],
      [{ hasMagicInst: true, hasGranary: true }, 'LETTERED'],
      [{ hasGranary: true }, 'PROVISIONED'],
      [{ hasHospital: true }, 'PROVISIONED'],
      [{ hasChurch: true, hasMarket: true, hasGuild: true }, 'BARE'],
      [{}, 'BARE'],
    ];
    for (const [inst, key] of cases) {
      expect(institutionsPoolKey(inst), JSON.stringify(inst)).toBe(key);
      expectSentence(draw({ inst }).institutions, JSON.stringify(inst));
    }
    // ORDER IS THE ARGUMENT: a roster satisfying every antecedent at once resolves to the
    // most constrained one, and PROVISIONED — which a granary alone would win — does not
    // swamp it.
    const everything = {
      hasCourtSystem: true, hasPrison: true, hasMilitaryInst: true, hasMagicInst: true, hasGranary: true,
    };
    expect(institutionsPoolKey(everything)).toBe('ADMINISTERED');
    // ⛔ BARE CARRIES NO TIER CLAUSE. A high-tier town with an empty roster still resolves,
    // which is the whole reason the annex refused the compiled draft's tier gate. Anchored
    // on the `{}` case above, which proves the same function answers on an empty record.
    expect(institutionsPoolKey({ hasCathedral: true, hasBank: true })).toBe('BARE');
    expect(new Set(cases.map(([inst]) => institutionsPoolKey(inst))).size).toBe(5);
    expect([...new Set(cases.map(([, key]) => key))].sort()).toEqual(poolsOf('DS-GEN-17').sort());
  });
});

describe('the general desk over the real generator', () => {
  const SEED = 'sf-test-2026-04';
  /** @param {object} config */
  const gen = (config) => generateSettlementPipeline(config, null, { seed: SEED, customContent: {} });
  const FIXTURES = [
    ['hamlet_forest_isolated', { settType: 'hamlet', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated' }],
    ['town_mountain_road', { settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' }],
    ['metropolis_riverside_port', { settType: 'metropolis', culture: 'mediterranean', terrainOverride: 'riverside', tradeRouteAccess: 'port' }],
  ];

  /** The readings OverviewTab assembles, spelled once here so the arms read the real paths. */
  const readingsOf = (s) => ({
    scores: s.defenseProfile?.scores,
    prosperity: s.economicState?.prosperity,
    safetyLabel: s.economicState?.safetyProfile?.safetyLabel,
    viable: s.economicViability?.viable,
    readinessLabel: s.defenseProfile?.readiness?.label,
    foodSecurityLabel: s.economicState?.foodSecurity?.label,
    terrainType: s.config?.terrainType,
    institutions: s.institutions,
    tradeRouteAccess: s.config?.tradeRouteAccess,
    isEntrepot: s.economicState?.isEntrepot,
    inst: s.economicState?.compound?.inst,
    tier: s.tier,
    primaryStress: resolvePrimaryStress(((Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean)).map((v) => v.type)),
    foodBalance: s.economicViability?.metrics?.foodBalance,
  });

  it('MEASUREMENT, NOT DEFAULT: every reading the desk uses is written by the generator', () => {
    for (const [name, config] of FIXTURES) {
      const r = readingsOf(gen(config));
      // The paths themselves are the claim. `inst` is the one that would silently read
      // undefined at the path the corpus title abbreviates, and `foodSecurityLabel` is the
      // one whose spelling differs from its pool.
      expect(typeof r.inst, `${name}: the institution booleans are not at economicState.compound.inst`).toBe('object');
      expect(Object.keys(r.inst).length, `${name}: the institution record is empty`).toBeGreaterThan(20);
      expect(typeof r.prosperity, `${name}: prosperity`).toBe('string');
      expect(typeof r.safetyLabel, `${name}: safetyLabel`).toBe('string');
      expect(typeof r.viable, `${name}: viable`).toBe('boolean');
      expect(typeof r.readinessLabel, `${name}: readiness.label`).toBe('string');
      expect(typeof r.foodSecurityLabel, `${name}: foodSecurity.label`).toBe('string');
      expect(TERRAINS, `${name}: terrainType`).toContain(r.terrainType);
      expect(Array.isArray(r.institutions), `${name}: institutions`).toBe(true);
      // And every one of them ROUTES: a reading the desk cannot key on is a reading that
      // would render nothing while looking like a state with nothing to say.
      expect(prosperityPoolKey(r.prosperity), `${name}: prosperity routed nowhere`).not.toBeNull(); // anchored: the typeof assertions above prove each reading is a real measured value
      expect(readinessPoolKey(r.readinessLabel), `${name}: readiness routed nowhere`).not.toBeNull(); // anchored: same measured readings
      expect(foodSecurityPoolKey(r.foodSecurityLabel), `${name}: food routed nowhere`).not.toBeNull(); // anchored: same measured readings
      expect(groundPoolKey(r.terrainType), `${name}: ground routed nowhere`).not.toBeNull(); // anchored: same measured readings
      expect(institutionsPoolKey(r.inst), `${name}: roster routed nowhere`).not.toBeNull(); // anchored: same measured readings
      expect(marketPoolKey(r), `${name}: market routed nowhere`).not.toBeNull(); // anchored: same measured readings
    }
  });

  it('SWITCH IT ON AND A SENTENCE COMES OUT, on every generated tier', () => {
    for (const [name, config] of FIXTURES) {
      const s = gen(config);
      const drawn = generalStateProse(s, readingsOf(s), { seed: String(s.id), audience: 'dm' });
      const lines = [
        drawn.overview.situation?.sentence, ...drawn.overview.origin.map((rung) => rung.sentence),
        ...drawn.overview.systemsHealth.map((rung) => rung.sentence),
        drawn.overview.ground?.sentence, drawn.overview.market?.sentence, drawn.overview.institutions?.sentence,
      ].filter(Boolean);
      // Nine of the ten health lenses, the two origin lines and the three site blocks. Two
      // lenses are deliberately conditional and so the count is a FLOOR rather than an exact
      // number: safety is silent whenever the town's head word is one of the six the corpus
      // does not name, and DS-GEN-5 SUPPRESSES itself under a resolved primary stress —
      // which every one of these fixtures carries.
      expect(lines.length, `${name} drew ${lines.length} lines`).toBeGreaterThanOrEqual(13);
      for (const line of lines) {
        expect(line, `${name}: an unfilled slot reached the reader`).not.toMatch(/\{[a-z_]+\}/i); // anchored: the same lines are asserted to contain the town's own name below
        expect(line, `${name}: §0d bans digits from dossier prose`).not.toMatch(/[0-9]/); // anchored: the same lines are asserted non-empty and named above
      }
      expect(lines.some((l) => l.includes(s.name)), `${name}: no line named the town`).toBe(true);
    }
  });

  it('DIFFERENTIAL: two settlements under one seed do not read the same', () => {
    const [a, b] = [gen(FIXTURES[0][1]), gen(FIXTURES[2][1])];
    const draw = (s) => generalStateProse(s, readingsOf(s), { seed: 'one-seed', audience: 'dm' });
    const [la, lb] = [draw(a), draw(b)];
    expect(la.overview.ground?.sentence).not.toBe(lb.overview.ground?.sentence); // anchored: both are asserted non-null on the next line
    expect([la.overview.ground?.sentence, lb.overview.ground?.sentence].filter(Boolean)).toHaveLength(2);
    expect(la.overview.institutions?.sentence).not.toBe(lb.overview.institutions?.sentence); // anchored: both are asserted non-null on the next line
    expect([la.overview.institutions?.sentence, lb.overview.institutions?.sentence].filter(Boolean)).toHaveLength(2);
  });

  it('THE PAID GATE: the silent projection has the same shape and says nothing', () => {
    const s = gen(FIXTURES[1][1]);
    const lit = generalStateProse(s, readingsOf(s), { seed: 'x', audience: 'dm' });
    expect(Object.keys(GENERAL_STATE_PROSE_SILENT.overview).sort())
      .toEqual(Object.keys(lit.overview).sort());
    expect(GENERAL_STATE_PROSE_SILENT.overview.systemsHealth).toHaveLength(0);
    expect(lit.overview.systemsHealth.length).toBeGreaterThan(0);
    expect(Object.isFrozen(GENERAL_STATE_PROSE_SILENT.overview)).toBe(true);
    expect(Object.isFrozen(lit.overview.systemsHealth)).toBe(true);
  });
});

describe('the general desk — the mount registry', () => {
  it('the four blocks speak at the positions the registry names, and none is still dark', () => {
    const expected = {
      'DS-GEN-3': 'overview.systemsHealth',
      'DS-GEN-12': 'overview.ground',
      'DS-GEN-13': 'overview.market',
      'DS-GEN-17': 'overview.institutions',
    };
    for (const [blockId, mount] of Object.entries(expected)) {
      const row = sentenceMountForBlock(blockId);
      expect(row, `${blockId} has no speaking position`).not.toBeNull(); // anchored: the mount id is asserted on the next line
      expect(row.mount).toBe(mount);
      expect(row.desk).toBe('general');
      // The anchor is the dark list's OWN first member, which is still dark by
      // construction — the same cure the registry walker's routing-ledger arm carries, so
      // this control cannot go stale as later desk cars mount blocks out of that list.
      expectAbsentWithAnchor(
        UNMOUNTED_BLOCKS, blockId, UNMOUNTED_BLOCKS[0],
        `${blockId} is mounted AND still declared dark`,
      );
      // The router read: a SENTENCE row hands the rung back whole.
      const rung = { glance: 'x', sentence: 'y', detail: [], provenance: { blockId, poolKey: 'p', angle: 'a' } };
      expect(drawnAtMount(mount, rung)).toBe(rung);
    }
  });
});

describe('DS-GEN-5 — the live companion, and the suppression that is not optional', () => {
  it('the scene mirror is IDENTICAL to the producer\'s exported ROUTE_TO_SCENE', () => {
    // Not "compatible with" — identical. The desk keeps a five-entry mirror instead of
    // importing a generator module into a display leaf, and this is the arm that keeps the
    // mirror from becoming a fork.
    for (const [route, scene] of Object.entries(ROUTE_TO_SCENE)) {
      const expected = { market: 'market (route crossroads)', port: 'port', river: 'river', smoke: 'smoke (route isolated / mountain_pass)' }[scene];
      expect(situationPoolKey({ tradeRouteAccess: route }), route).toBe(expected);
    }
    expect(Object.keys(ROUTE_TO_SCENE).sort()).toEqual(['crossroads', 'isolated', 'mountain_pass', 'port', 'river']);
  });

  it('all five pools fire, and three of the five keys are NOT the scene word', () => {
    const reached = new Set([
      ...Object.keys(ROUTE_TO_SCENE).map((route) => situationPoolKey({ tradeRouteAccess: route })),
      situationPoolKey({ tradeRouteAccess: 'road' }),
    ]);
    expect([...reached].sort()).toEqual(poolsOf('DS-GEN-5').sort());
    for (const route of [...Object.keys(ROUTE_TO_SCENE), 'road', 'mountain_road', 'desert_road', '']) {
      expectSentence(draw({ tradeRouteAccess: route }).situation, route || '(no route)');
    }
    // THE GLOSS TRAP: three pool keys carry a parenthetical, so the scene word alone is not
    // a key. Anchored on `port`, which IS both.
    for (const bare of ['market', 'smoke', 'ordinary']) {
      expectAbsentWithAnchor(poolsOf('DS-GEN-5'), bare, 'port', `${bare} was assumed to be its own pool key`);
    }
  });

  it('an inland river port reads as a river and not as a seaport', () => {
    expect(situationPoolKey({ tradeRouteAccess: 'port', terrainType: 'riverside' })).toBe('river');
    expect(situationPoolKey({ tradeRouteAccess: 'port', terrainType: 'coastal' })).toBe('port');
    expect(situationPoolKey({ tradeRouteAccess: 'port' })).toBe('port');
  });

  it('THE STRESS ARM: a resolved primary stress suppresses the companion entirely', () => {
    // The page must not describe an ordinary market day underneath a siege banner. Asserted
    // positively as null, and paired with the same reading minus the stress so the arm
    // cannot pass because the route stopped routing.
    expect(situationPoolKey({ tradeRouteAccess: 'crossroads' })).toBe('market (route crossroads)');
    expect(situationPoolKey({ tradeRouteAccess: 'crossroads', primaryStress: 'under_siege' })).toBeNull();
    expect(draw({ tradeRouteAccess: 'crossroads', primaryStress: 'famine' }).situation).toBeNull();
    expectSentence(draw({ tradeRouteAccess: 'crossroads' }).situation, 'no stress');
  });
});

describe('DS-GEN-6 — the route, the tier overlay, and the demoted deficit dimension', () => {
  const NO_DEFICIT = { dailyNeed: 100, dailyProduction: 100, deficit: 0, rawDeficit: 0 };
  const DEFICIT = { dailyNeed: 100, dailyProduction: 20, deficit: 10, rawDeficit: 80 };

  it('THE FOLD: eight producer arms onto five route pools, total in both directions', () => {
    // The producer sub-splits `port` by terrain and `isolated` by deficit; the corpus keeps
    // five route pools and demotes the deficit split into its own dimension. This arm proves
    // the fold covers every arm the producer can resolve and claims every pool the corpus
    // carries — the join, driven, rather than the join described.
    const routePools = poolsOf('DS-GEN-6').filter((k) => !k.startsWith('tier overlay'));
    expect(routePools.length).toBe(5);
    const armToPool = new Map();
    for (const route of ['crossroads', 'river', 'port', 'isolated', 'road', 'mountain_pass', 'mountain_road', 'desert_road', '']) {
      for (const terrainType of [null, 'riverside', 'coastal']) {
        for (const hasFoodDeficit of [true, false]) {
          const arm = originArmKey({ route, terrainType, hasFoodDeficit });
          armToPool.set(arm, originRoutePoolKey(route));
        }
      }
    }
    expect([...armToPool.keys()].sort()).toEqual([...ORIGIN_ARMS].sort());
    expect([...new Set(armToPool.values())].sort()).toEqual(routePools.sort());
    // Each producer arm folds to the pool its own prefix names.
    for (const [arm, pool] of armToPool) expect(pool, arm).toBe(arm.split('.')[0]);
  });

  it('THE DEFICIT DIMENSION: both values fire, and an unmeasured town is neither', () => {
    // The threshold is the producer's own, and it is PINNED to the producer's source rather
    // than to this file's belief about it.
    const body = src('src/generators/narrativeGenerator.js');
    mustExtract(body, 'gap / need >= 0.05', 'the hasFoodDeficit cut in generateSettlementReason');
    expect(foodDeficitDimension(DEFICIT)).toBe('deficit');
    expect(foodDeficitDimension(NO_DEFICIT)).toBe('no deficit');
    // Rounding noise below five percent must not flip the founding narrative.
    expect(foodDeficitDimension({ dailyNeed: 100, rawDeficit: 4, deficit: 0 })).toBe('no deficit');
    expect(foodDeficitDimension({ dailyNeed: 100, rawDeficit: 5, deficit: 0 })).toBe('deficit');
    // The residual and the pre-import gap are BOTH signals; the larger wins, as it does in
    // the producer.
    expect(foodDeficitDimension({ dailyNeed: 100, rawDeficit: 0, deficit: 40 })).toBe('deficit');
    // ⛔ NO ARITHMETIC ON THE RECORD IS NOT "NO DEFICIT". It is unmeasured, the kernel fails
    // closed on the unanswered dimension, and the block renders nothing.
    expect(foodDeficitDimension(null)).toBeNull();
    expect(foodDeficitDimension(undefined)).toBeNull();
    expect(draw({ tradeRouteAccess: 'road', tier: 'town' }).origin).toEqual([]);
  });

  it('all nine pools fire — five routes by both deficit values, and four tier overlays', () => {
    const seen = new Set();
    for (const route of ['crossroads', 'river', 'port', 'isolated', 'road']) {
      for (const foodBalance of [DEFICIT, NO_DEFICIT]) {
        const lines = draw({ tradeRouteAccess: route, tier: 'town', foodBalance }).origin;
        expect(lines.length, `${route} ${foodBalance === DEFICIT ? 'deficit' : 'fed'}`).toBe(2);
        for (const line of lines) expectSentence(line, route);
        seen.add(originRoutePoolKey(route));
      }
    }
    for (const tier of ['metropolis', 'city', 'thorp', 'hamlet', 'town', 'village', '']) {
      const key = originTierPoolKey(tier);
      expect(key, `${tier} routed nowhere`).not.toBeNull(); // anchored: the overlay pool set is compared to the corpus two lines below
      seen.add(key);
      expect(draw({ tradeRouteAccess: 'road', tier, foodBalance: DEFICIT }).origin, tier).toHaveLength(2);
    }
    expect([...seen].sort()).toEqual(poolsOf('DS-GEN-6').sort());
    // THE TIER OVERLAY IS TOTAL: `other tiers` is a real else-arm, not a gap. `town` and
    // `village` are the tiers the producer writes no tier line for at all.
    expect(originTierPoolKey('town')).toBe('tier overlay: other tiers');
    expect(originTierPoolKey('village')).toBe('tier overlay: other tiers');
    expect(originTierPoolKey('thorp')).toBe('tier overlay: thorp / hamlet');
    expect(originTierPoolKey('hamlet')).toBe('tier overlay: thorp / hamlet');
  });
});
