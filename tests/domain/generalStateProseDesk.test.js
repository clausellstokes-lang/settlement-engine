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
  coherencePoolKey,
  conflictIntensityPoolKey,
  foodDeficitDimension,
  foodSecurityPoolKey,
  generalStateProse,
  originRoutePoolKey,
  originTierPoolKey,
  calamityFill,
  criticalIssuePoolKey,
  escalationClockPoolKey,
  hookCategoryPoolKey,
  flagDrivenPoolKey,
  notableConnectionPoolKey,
  viabilityVerdictPoolKey,
  eventAnchorDimension,
  eventRecordPoolKey,
  eventTypePoolKey,
  foundedPoolKey,
  recencyFramingPoolKey,
  significantEvent,
  groundPoolKey,
  institutionsPoolKey,
  marketPoolKey,
  prosperityPoolKey,
  readinessPoolKey,
  safetyPoolKey,
  situationPoolKey,
  structuralSuggestionsPoolKey,
  structuralViolationsPoolKey,
  systemsHealthScorePoolKey,
  viabilityPoolKey,
  craftReasonPoolKey,
  craftInstitutionFill,
  remnantPoolKey,
  ancientRuinPoolKey,
  steadingPoolKey,
  neighbourTiePoolKey,
  crossSettlementNpcPoolKey,
  crossEngagementPoolKey,
  populationDirectionPoolKey,
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
import { EVENT_TYPE_NAMES, HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { PLOT_HOOK_CATEGORIES, collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { deriveEscalationClocks } from '../../src/domain/hookEscalation.js';
import { populationTrendBand } from '../../src/domain/display/trendLens.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mustExtract } from '../helpers/sourceContract.js';
import { fillShapeViolation, mergeSlotShapes, parseSlotShapes } from '../../scripts/lib/dossier-slot-shapes.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { drawnMember } from '../helpers/drawnProse.js';

const ROOT = resolve(import.meta.dirname, '../..');
const src = (rel) => readFileSync(resolve(ROOT, rel), 'utf8');


/** The two annexes' slot register, merged — the authority on what a fill shape means. */
const mergedShapes = () => mergeSlotShapes([
  parseSlotShapes(src('docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'), 'state annex'),
  parseSlotShapes(src('docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'causal annex'),
]);

/** Every block this desk lights, and the pool counts the shipped leaf carries. */
const BLOCK_POOLS = Object.freeze({
  'DS-GEN-2': 3, 'DS-GEN-3': 42, 'DS-GEN-5': 5, 'DS-GEN-6': 9, 'DS-GEN-12': 5, 'DS-GEN-13': 4,
  'DS-GEN-7': 8, 'DS-GEN-17': 5,
  // The history chapter (DESK-GEN2 car 1).
  'DS-GEN-9': 15, 'DS-GEN-14': 3, 'DS-GEN-16': 5,
  // The viability verdict and the plot-hook framing (DESK-GEN2 car 2).
  'DS-GEN-11': 6, 'DS-HK-1': 11,
  // The notable connection (DESK-GEN2 car 4).
  'DS-REL-2': 3,
  // Why these workshops (DESK-GEN3 car 1).
  'DS-GEN-18': 4,
  // The steadings, the remnant and the fallen city (DESK-GEN3 car 2).
  'DS-GEN-8': 6,
  // The neighbour network and the direction of the roll (DESK-GEN3 car 3).
  'DS-REL-1': 10, 'DS-POP-3': 5,
});

/**
 * The ONE block of the set that partitions itself by a demoted STATE dimension. Named here
 * so the arm below can hold every OTHER block to `[]` and this one to its dimension, rather
 * than exempting it — an exemption is how a block quietly grows a dimension nobody answers.
 */
const DIMENSIONED = Object.freeze({ 'DS-GEN-6': 'deficit', 'DS-GEN-9': 'anchor' });

/** @param {string} id @returns {string[]} */
const poolsOf = (id) => Object.keys(DOSSIER_STATE_PROSE_GENERAL[id].pools);

/**
 * The modules a file really IMPORTS — its specifiers, never its prose.
 *
 * ⛔ THIS EXISTS BECAUSE A `not.toContain` OVER A WHOLE SOURCE FILE CONVICTS A CITATION.
 * Two arms below assert that this desk does NOT reach for a generator module or for the
 * trend reader, and both failed on the desk's own DOCBLOCK, which names
 * `computeActiveChains.js:297` and `domain/display/trendLens.js` in writing precisely so a
 * later reader knows why the value is handed in instead. The citation law, one layer over:
 * a string is a citation or a mint BY THE CLAIM, and a coupling claim is about the import
 * graph. Nothing in a comment can add an edge to it.
 * @param {string} body @returns {string[]}
 */
function importSpecifiers(body) {
  return [...body.matchAll(/^import[^;]*?from\s+'([^']+)';/gm)].map((m) => m[1]);
}

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
    conflicts: prose.overview.conflicts.map((rung) => rung?.sentence ?? null),
    warnings: prose.overview.warnings.map((rung) => rung.sentence).filter(Boolean),
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
    // The slot mirror is the annex's — asserted against the PARSED register rather than
    // against a copy of it, so the mirror cannot become a fork — and the desk owns no
    // literal fill table.
    const shapes = mergedShapes();
    // ⛔ THE ROSTER IS DERIVED, NOT HAND-LISTED, AND THE CHANGE IS THE FINDING. This arm
    // named its eleven slots literally, so it convicted the DESK for the crime of lighting
    // another block: DESK-GEN3 added seven mirror rows (`institution`, `resource`, `good`,
    // `steading`, `ruin`, `counterpart`, `npc`) and the list — not the mirror — was what
    // went stale. A roster keyed on exactly what a later car MINTS is a control that reds
    // on correct work, which is the third instance of this shape in this subsystem (the
    // walker's `mountsForTab('history')` pin was the second). What the mirror OWES is that
    // every row agrees with the annex and that it declares no slot the desk cannot fill —
    // both asserted below, neither of which a literal list adds anything to.
    expect(Object.keys(SLOT_FILL_SHAPES).length, 'the mirror is empty — the arm is vacuous')
      .toBeGreaterThan(10);
    for (const [slot, shape] of Object.entries(SLOT_FILL_SHAPES)) {
      expect(shape, `{${slot}} shape`).toBe(shapes.shapeOf(slot));
    }
    // ⛔ AND IT MAY DECLARE NO SHAPE FOR A RESERVED SLOT. §0c refuses a fill table for
    // `{band}` outright, and four DS-GEN-8 variants name it; a mirror row would be the desk
    // claiming a shape the register says cannot exist.
    for (const [slot, shape] of Object.entries(SLOT_FILL_SHAPES)) {
      expect(shape, `{${slot}} is RESERVED and cannot carry a declared fill`).not.toBe('RESERVED');
    }
    expect(shapes.shapeOf('band'), 'the RESERVED anchor moved').toBe('RESERVED');
    expect(SLOT_FILL_SHAPES.band, 'the desk declared a shape for a RESERVED slot').toBeUndefined();
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

  it('⛔ THE MARKET READ IS RUIN-FILTERED — a burnt bazaar is not a market (DESKCURE-2)', () => {
    // THE CURE THIS PINS, and the behaviour shift it carries. `marketPoolKey` read the raw
    // roster, so a calamity-flattened bazaar still credited the town with a market and the
    // block printed MARKET-OPEN over a heap of ash — a confident falsehood, not a missing
    // sentence. It now routes through `liveInstitutions()`, the estate's single writer of the
    // ruin question, and the ruin-filter walker sees it as COMPLIANT rather than exempt.
    //
    // ⚠ THIS ARM IS THE FALSIFIER, so it is written in the two directions that a bare
    // "ruined reads NO-MARKET" cannot distinguish: the SAME row reads MARKET-OPEN while it
    // stands and NO-MARKET once stamped. A one-sided assertion here would pass just as
    // happily if `marketPoolKey` had been broken into always answering NO-MARKET.
    const bazaar = (extra) => [{ name: 'Grand bazaar', ...extra }];
    expect(marketPoolKey({ institutions: bazaar({}), tradeRouteAccess: 'road' }))
      .toBe('MARKET-OPEN');
    // Both ruin spellings the estate stamps, each against that same standing reading.
    expect(marketPoolKey({ institutions: bazaar({ status: 'ruined' }), tradeRouteAccess: 'road' }))
      .toBe('NO-MARKET');
    expect(marketPoolKey({ institutions: bazaar({ _worldPulseInactive: true }), tradeRouteAccess: 'road' }))
      .toBe('NO-MARKET');
    // A ruined market does not become an entrepôt either: NO-MARKET is tested first, so the
    // ruin verdict survives the key that would otherwise outrank it.
    expect(marketPoolKey({ institutions: bazaar({ status: 'ruined' }), isEntrepot: true, tradeRouteAccess: 'road' }))
      .toBe('NO-MARKET');
    // A live row alongside a ruined one still carries the town — the filter is per ROW.
    expect(marketPoolKey({ institutions: [...bazaar({ status: 'ruined' }), { name: 'Weekly market' }], tradeRouteAccess: 'road' }))
      .toBe('MARKET-OPEN');
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
    conflicts: s.conflicts,
    structuralViolations: s.structuralViolations,
    structuralSuggestions: s.structuralSuggestions,
    coherenceNotes: s.coherenceNotes,
    govFaction: (s.powerStructure?.factions || []).find((f) => f.isGoverning)?.faction,
    tier: s.tier,
    primaryStress: resolvePrimaryStress(((Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean)).map((v) => v.type)),
    foodBalance: s.economicViability?.metrics?.foodBalance,
    // DS-GEN-18's four antecedents. ⚠ THE EXPLOITATION LEDGER IS `resourceAnalysis`'s, NOT
    // `economicState`'s — the corpus title names both records in one line and they are two.
    activeChains: s.economicState?.activeChains,
    exploitation: s.resourceAnalysis?.exploitation,
    primaryImports: s.economicState?.primaryImports,
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
    // ⛔ DS-GEN-3 IS NOT HERE SINCE OWNER ORDER 2026-09-17: its one row, overview.systemsHealth,
    // GLANCES (the stacked sentence list under the bars was removed), so it has no speaking
    // position until its lenses are re-homed. Pinned just below this loop.
    const expected = {
      'DS-GEN-12': 'overview.ground',
      'DS-GEN-13': 'overview.market',
      'DS-GEN-17': 'overview.institutions',
      // DESK-GEN3 car 1 — the general desk's first position off the overview/history pages.
      'DS-GEN-18': 'economics.craftReason',
      // DESK-GEN3 car 2 — a lawful DARK mount, on the DS-STR-2 precedent.
      'DS-GEN-8': 'overview.steadings',
      // DESK-GEN3 car 3.
      'DS-REL-1': 'relationships.network',
      'DS-POP-3': 'overview.populationDirection',
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
    // DS-GEN-3: still MOUNTED (not declared dark), at a GLANCE row that strips the sentence.
    expect(sentenceMountForBlock('DS-GEN-3'), 'DS-GEN-3 speaks again: the Systems Health stack is back').toBeNull();
    expectAbsentWithAnchor(UNMOUNTED_BLOCKS, 'DS-GEN-3', UNMOUNTED_BLOCKS[0], 'DS-GEN-3 was parked dark instead of glanced');
    const health = { glance: 'x', sentence: 'y', detail: [], provenance: { blockId: 'DS-GEN-3', poolKey: 'p', angle: 'a' } };
    const drawn = drawnAtMount('overview.systemsHealth', health);
    expect(drawn.glance, 'the position is still mounted and keeps its glance').toBe('x');
    expect(drawn.sentence, 'overview.systemsHealth draws no sentence').toBeNull();
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

describe('DS-GEN-2 — one line per standing quarrel', () => {
  const conflict = (intensity) => ({
    parties: ['The Grey Council', 'The Independent Bloc'],
    issue: 'Military conscription of guild apprentices',
    stakes: 'Labor control',
    intensity,
  });

  it('all three intensities fire, and an unknown one renders nothing', () => {
    const lines = draw({ conflicts: ['low', 'moderate', 'high'].map(conflict) }).conflicts;
    expect(lines).toHaveLength(3);
    for (const line of lines) expectSentence(line, 'conflict');
    expect(new Set(['low', 'moderate', 'high'].map((i) => conflictIntensityPoolKey({ intensity: i }))).size).toBe(3);
    expect([...new Set(['low', 'moderate', 'high'].map((i) => conflictIntensityPoolKey({ intensity: i })))].sort())
      .toEqual(poolsOf('DS-GEN-2').sort());
    // How close two factions are to violence is not a thing to guess at.
    expect(conflictIntensityPoolKey({ intensity: 'simmering' })).toBeNull();
    expect(conflictIntensityPoolKey({})).toBeNull();
    // A conflict the desk cannot key on holds its PLACE, so the caller's index pairing
    // cannot slip onto the wrong row.
    const mixed = draw({ conflicts: [conflict('low'), { intensity: 'simmering' }, conflict('high')] }).conflicts;
    expect(mixed).toHaveLength(3);
    expect(mixed[1]).toBeNull();
    expectSentence(mixed[0], 'first');
    expectSentence(mixed[2], 'third');
  });

  it('THE WHOLE PRODUCER TABLE CONFORMS: every authored issue and stakes fills a phrase seam', () => {
    // The closed vocabulary, extracted from the producer rather than sampled from a run:
    // a value that cannot conform must red HERE, not lose a variant in silence.
    const body = src('src/generators/power/conflicts.js');
    mustExtract(body, 'export const generateConflicts', 'the conflict table in conflicts.js');
    const values = [...body.matchAll(/^\s*(?:issue|stakes): (?:'([^']+)'|"([^"]+)")/gm)]
      .map((m) => m[1] ?? m[2]);
    expect(values.length, 'the conflict table extractor found nothing').toBeGreaterThan(30);
    const shapes = mergedShapes();
    for (const value of values) {
      const filled = draw({ conflicts: [{ ...conflict('low'), issue: value, stakes: value }] }).conflicts[0];
      expectSentence(filled, value);
      // The fill really landed: the seam's own word is in the line, lowercased where the
      // table wrote it sentence-case.
      const expected = /^[A-Z][a-z]/.test(value) ? value[0].toLowerCase() + value.slice(1) : value;
      expect(fillShapeViolation(shapes.shapeOf('issue'), expected), `${value} violates its shape`).toBe('');
    }
  });

  it('the parties fill faction and faction2, and a nameless party drops its variant', () => {
    const named = draw({ conflicts: [conflict('high')] }).conflicts[0];
    expect(named).toContain('The Grey Council');
    expect(named).toContain('The Independent Bloc');
    // EVERY DS-GEN-2 variant names both factions, so a conflict with no parties has no
    // eligible variant at all and the pool falls silent — anchored liveness, not a stub.
    expect(draw({ conflicts: [{ intensity: 'high' }] }).conflicts[0]).toBeNull();
  });
});

describe('⛔ DS-GEN-1 STAYS DARK — the severity dimension has no measured producer', () => {
  const SEED_SET = ['sf-test-2026-04', 'alpha', 'beta', 'gamma'];
  const TIERS = [
    { settType: 'hamlet', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated' },
    { settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' },
    { settType: 'metropolis', culture: 'mediterranean', terrainOverride: 'riverside', tradeRouteAccess: 'port' },
  ];

  it('every generated tension carries the TEMPLATE range, never a per-settlement value', () => {
    // THE FINDING. DS-GEN-1's ten pools are each partitioned by the kernel's `severity`
    // dimension, whose vocabulary is one of {minor, major, catastrophic}. `buildHistoricalEvent`
    // spreads `{ ...tmpl }` out of HISTORICAL_EVENTS_DATA and never collapses `severity`, so
    // what reaches the record is the template's RANGE — a property of the tension TYPE,
    // identical on every settlement that carries it, and not a measurement of this town.
    let seen = 0;
    const shapes = new Set();
    for (const seed of SEED_SET) {
      for (const config of TIERS) {
        const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
        for (const tension of (s.history?.currentTensions || [])) {
          seen += 1;
          shapes.add(Array.isArray(tension.severity) ? 'ARRAY' : `SCALAR:${typeof tension.severity}`);
        }
      }
    }
    expect(seen, 'no tension was generated, so this arm proves nothing').toBeGreaterThan(15);
    expect([...shapes], 'a per-settlement severity appeared, and DS-GEN-1 may now be lit').toEqual(['ARRAY']);
    // Picking an element would be a DEFAULT WEARING A READING'S CLOTHES: `severity[0]` makes
    // every crime wave in every world minor and darkens three of five variants in each of
    // the ten pools forever. The cure is one line in the producer and it already has two
    // precedents in the same file — generateEventNarrative collapses with
    // `pick(eventTemplate.severity)` and the resource path collapses arrays outright — but a
    // generation-side collapse MOVES SAME-SEED OUTPUT, which is constitutionally the owner's.
    const templateRanges = new Set(HISTORICAL_EVENTS_DATA.map((e) => JSON.stringify(e.severity)));
    expect(templateRanges.size, 'the templates stopped carrying ranges').toBeGreaterThan(1);
  });

  it('and the corpus writes ten pools against a producer vocabulary of more than twenty', () => {
    // The SECOND, independent reason: even with a severity, fourteen of the tension types
    // the generator can write have no pool at all.
    const pools = poolsOf('DS-GEN-1');
    expect(pools).toHaveLength(10);
    const producerTypes = new Set(HISTORICAL_EVENTS_DATA.map((e) => e.type));
    expect(producerTypes.size, 'the tension template roster collapsed').toBeGreaterThan(20);
    const unpooled = [...producerTypes].filter((t) => !pools.includes(t)).sort();
    expect(unpooled.length, 'the producer roster is now inside the corpus').toBeGreaterThan(10);
    // Both directions: every pool the corpus DOES write is a real producer type, so the ten
    // are not themselves stale. Anchored on `crime_wave`, which both sides carry.
    for (const pool of pools) expect([...producerTypes], `${pool} is not a producer type`).toContain(pool);
    expectAbsentWithAnchor(
      pools, 'legitimacy_crisis', 'crime_wave',
      'a producer tension type the corpus writes no pool for',
    );
    // It is still DARK in the shipped registry, and it must stay that way until the owner
    // rules on the collapse.
    expect(UNMOUNTED_BLOCKS).toContain('DS-GEN-1');
    expect(sentenceMountForBlock('DS-GEN-1')).toBeNull();
  });
});

describe('DS-GEN-7 — the record disagreeing with itself, and five pools the producer cannot reach', () => {
  const NOTE = (type, tab) => ({ type, tab, severity: 'notable', note: 'x' });

  it('ALL EIGHT POOLS FIRE, and the coherence key is the type-and-tab PAIR', () => {
    const pairs = [
      ['power_economic', 'economics'], ['power_economic', 'power'], ['power_economic', 'overview'],
      ['stress_economic', 'economics'], ['power_stress', 'power'], ['historical_economic', 'history'],
    ];
    const reached = new Set(pairs.map(([t, tab]) => coherencePoolKey(NOTE(t, tab))));
    expect([...reached].filter((k) => k === null), 'a coherence pair routed nowhere').toEqual([]);
    expect(reached.size, 'two pairs collapsed onto one pool').toBe(6);
    // THE PAIR IS THE KEY. Three notes share `type: 'power_economic'` and differ only by tab;
    // a type-only route would print the criminal-transit-hub line over a church-run economy.
    expect(new Set(pairs.filter(([t]) => t === 'power_economic').map(([, tab]) => tab)).size).toBe(3);
    expect(new Set(pairs.filter(([t]) => t === 'power_economic')
      .map(([t, tab]) => coherencePoolKey(NOTE(t, tab)))).size).toBe(3);
    // An unrecognised pair renders nothing rather than guessing which contradiction it meant.
    expect(coherencePoolKey(NOTE('power_economic', 'history'))).toBeNull();
    expect(coherencePoolKey(NOTE('nonesuch', 'overview'))).toBeNull();
    expect(coherencePoolKey(null)).toBeNull();
    // Every pool, including the two list pools, draws a real sentence.
    for (const [t, tab] of pairs) {
      const lines = draw({ coherenceNotes: [NOTE(t, tab)], govFaction: 'The Town Council' }).warnings;
      expect(lines, `${t}|${tab}`).toHaveLength(1);
      expectSentence(lines[0], `${t}|${tab}`);
    }
    expect(structuralViolationsPoolKey([{ reason: 'x' }])).toBe('structuralViolations[]');
    expect(structuralSuggestionsPoolKey([{ reason: 'x' }])).toBe('structuralSuggestions[]');
    expect(structuralViolationsPoolKey([])).toBeNull();
    expect(structuralSuggestionsPoolKey([])).toBeNull();
    expect(structuralViolationsPoolKey(undefined)).toBeNull();
    const both = draw({ structuralViolations: [{ reason: 'x' }], structuralSuggestions: [{ reason: 'y' }] }).warnings;
    expect(both).toHaveLength(2);
    for (const line of both) expectSentence(line, 'list pool');
    // The union of everything this desk can emit IS the block's pool set.
    const all = new Set([
      ...pairs.map(([t, tab]) => coherencePoolKey(NOTE(t, tab))),
      structuralViolationsPoolKey([{}]), structuralSuggestionsPoolKey([{}]),
    ]);
    expect([...all].sort()).toEqual(poolsOf('DS-GEN-7').sort());
  });

  it('⛔ THE PRODUCER MEASUREMENT: two coherence notes are dead by threshold, one by name', () => {
    // These are the numbers the docblock cites, re-derived here every run so neither the
    // finding nor its cure can decay into a comment nobody re-checks.
    const configs = [];
    for (const t of ['village', 'town', 'city', 'metropolis']) {
      for (const r of ['port', 'road', 'crossroads', 'river']) configs.push({ settType: t, culture: 'germanic', tradeRouteAccess: r });
    }
    const crimePowers = [];
    let factions = 0; let events = 0; let boomNamed = 0; let collapseNamed = 0;
    const eventNames = new Set();
    for (const seed of ['a', 'b', 'c']) {
      for (const config of configs) {
        const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
        for (const f of (s.powerStructure?.factions || [])) {
          factions += 1;
          if (/thieve|criminal|underworld/i.test(f.faction || '')) crimePowers.push(f.power);
        }
        for (const e of (s.history?.historicalEvents || [])) {
          events += 1;
          eventNames.add(e.name);
          if (/Boom|Trade Route Opened/.test(e.name || '')) boomNamed += 1;
          if (/Collapse|Famine/.test(e.name || '')) collapseNamed += 1;
        }
      }
    }
    // NON-VACUITY FIRST: the sweep really generated worlds with crime factions and events.
    expect(factions, 'no factions were generated').toBeGreaterThan(100);
    expect(crimePowers.length, 'no crime-named faction was generated').toBeGreaterThan(10);
    expect(events, 'no historical events were generated').toBeGreaterThan(300);
    expect(eventNames.size, 'the event name space collapsed').toBeGreaterThan(10);
    // ⛔ DEAD BY THRESHOLD. `genCoherence` needs `power > 20` and `power > 35`.
    expect(Math.max(...crimePowers), 'a crime faction reached the transit-hub threshold').toBeLessThan(20);
    // ⛔ DEAD BY NAME. The predicate reads an event name no writer writes, while the OTHER
    // half of the same `&&` matches often — which is what makes it half-live and silent.
    expect(boomNamed, 'an event named Boom / Trade Route Opened appeared').toBe(0);
    expect(collapseNamed, 'the collapse half of the predicate also stopped matching').toBeGreaterThan(0);
  });
});

/**
 * ── THE HISTORY CHAPTER (DESK-GEN2) ─────────────────────────────────────────────────
 * DS-GEN-9 at `history.identity`, DS-GEN-14 at `history.founded`, DS-GEN-16 at
 * `history.record`. Every map below is asserted TOTAL IN BOTH DIRECTIONS — every producer
 * token reaches a pool or is named as measured residue, and every pool of the block is
 * claimed by a token or is named as unreachable — which is this leaf's standing discipline.
 */
describe('the history chapter', () => {
  /** The eight coarse event types the generator writes, measured rather than transcribed. */
  const generatedEventTypes = () => {
    const types = new Set();
    for (const seed of ['sf-test-2026-04', 'gen2-a', 'gen2-b']) {
      for (const settType of ['hamlet', 'town', 'city', 'metropolis']) {
        const s = generateSettlementPipeline(
          { settType, culture: 'germanic', tradeRouteAccess: 'road' }, null, { seed, customContent: {} },
        );
        for (const e of (s.history?.historicalEvents || [])) types.add(e.type);
      }
    }
    return types;
  };

  it('DS-GEN-9 event types: the corpus pools and the producer vocabulary are the SAME EIGHT', () => {
    const poolTypes = poolsOf('DS-GEN-9')
      .filter((k) => k.startsWith('event type: ')).map((k) => k.slice('event type: '.length)).sort();
    expect(poolTypes.length, 'the corpus event-type pool set moved').toBe(8);
    const written = [...generatedEventTypes()].sort();
    // NON-VACUITY: the sweep really produced events before either direction is asserted.
    expect(written.length, 'the generator wrote no event types').toBeGreaterThan(0);
    // DIRECTION 1 — every type the generator writes reaches a pool.
    for (const type of written) {
      expect(eventTypePoolKey(type), `the generator writes '${type}' and no pool claims it`)
        .toBe(`event type: ${type}`);
    }
    // DIRECTION 2 — every pool is claimed by a type the generator writes.
    expect(written).toEqual(poolTypes);
    // A type outside the vocabulary renders NOTHING rather than the nearest neighbour.
    expect(eventTypePoolKey('cheese_incident')).toBeNull();
    expect(eventTypePoolKey(undefined)).toBeNull();
  });

  it('the recency ladder is HistoryTab\'s OWN ladder, and both sides of every cut are driven', () => {
    // The mirror is asserted against the component's literal, so the desk cannot band a year
    // differently from the label the tab prints beside the same event row.
    const body = src('src/components/new/tabs/HistoryTab.jsx');
    mustExtract(
      body,
      "yrs<=10?'Recent':yrs<=30?'Living memory':yrs<=80?'Last century':yrs<=200?'Ancient':'Deep history'",
      'the recency ladder in HistoryTab.jsx',
    );
    for (const [years, label] of /** @type {ReadonlyArray<[number, string]>} */ ([
      [0, 'Recent'], [10, 'Recent'], [11, 'Living memory'], [30, 'Living memory'],
      [31, 'Last century'], [80, 'Last century'], [81, 'Ancient'], [200, 'Ancient'],
      [201, 'Deep history'], [9999, 'Deep history'],
    ])) expect(recencyFramingPoolKey(years), `${years} years ago`).toBe(`recency framing: ${label}`);
    // TOTAL the other way: the five pools are exactly the five labels.
    expect(poolsOf('DS-GEN-9').filter((k) => k.startsWith('recency framing: ')).length).toBe(5);
    // A non-number is not a year: it renders nothing rather than banding zero.
    expect(recencyFramingPoolKey('recent')).toBeNull();
    expect(recencyFramingPoolKey(Number.NaN)).toBeNull();
  });

  it('{calamity} is BARE-COMMON and invents nothing: total over EVENT_TYPE_NAMES, refusing the rest', () => {
    // DIRECTION 1 — the estate's whole authored vocabulary yields a word.
    const values = Object.values(EVENT_TYPE_NAMES);
    expect(values.length, 'the event-name table collapsed').toBeGreaterThan(25);
    for (const name of values) {
      const word = calamityFill(name);
      expect(word, `${name} yields no calamity word`).toBeTruthy();
      expect(word, `${name}: the article survived`).not.toMatch(/^the /i); // anchored: the toBeTruthy on the line above proves a word came back, so this absence is the strip working
      expect(word, `${name}: not bare-common`).toBe(String(word).toLowerCase());
    }
    // DIRECTION 2 — a name carrying an embedded proper noun is REFUSED, not lowercased. The
    // opt-in ancient-ruin event is named this way and "the fall of ecserys" is the defect.
    expect(calamityFill('The Fall of Ecserys')).toBeUndefined();
    expect(calamityFill('Steinmark')).toBeUndefined();
    expect(calamityFill(null)).toBeUndefined();
    // ⛔ THE DEFECT THIS FUNCTION EXISTS FOR, driven rather than described: the seam supplies
    // its own article, so the raw name would print a doubled one.
    expect(`The ${calamityFill('The Economic Divide')}`).toBe('The economic divide');
  });

  it('DS-GEN-14 and DS-GEN-16 are total over their own pools, and strict about `anchored`', () => {
    // DS-GEN-14 — three pools, three antecedents, no fourth state.
    expect(foundedPoolKey({ founding: null, age: 40 })).toBe('GROWN-UNRECORDED');
    expect(foundedPoolKey({ founding: {}, age: 40 })).toBe('FOUNDED-YOUNG');
    expect(foundedPoolKey({ founding: {}, age: 400 })).toBe('FOUNDED-OLD');
    expect(new Set([
      foundedPoolKey({ founding: null, age: 40 }),
      foundedPoolKey({ founding: {}, age: 40 }),
      foundedPoolKey({ founding: {}, age: 400 }),
    ]).size).toBe(3);
    expect([...new Set([
      foundedPoolKey({ founding: null, age: 1 }), foundedPoolKey({ founding: {}, age: 1 }),
      foundedPoolKey({ founding: {}, age: 900 }),
    ])].sort()).toEqual(poolsOf('DS-GEN-14').sort());
    expect(foundedPoolKey(null)).toBeNull();

    // DS-GEN-16 — five pools over the whole record.
    const blow = (anchored, yearsAgo) => ({ anchored, yearsAgo, lastingEffects: ['x'] });
    expect(eventRecordPoolKey([])).toBe('UNMARKED');
    expect(eventRecordPoolKey([{ anchored: true, yearsAgo: 5, lastingEffects: [] }])).toBe('UNMARKED');
    expect(eventRecordPoolKey([blow(true, 5)])).toBe('ANCHORED-RECENT');
    expect(eventRecordPoolKey([blow(true, 500)])).toBe('ANCHORED-OLD');
    expect(eventRecordPoolKey([blow(true, 5), blow(true, 9)])).toBe('LAYERED-ANCHORED');
    expect(eventRecordPoolKey([blow(false, 5)])).toBe('RECORDED-UNANCHORED');
    expect([...new Set([
      eventRecordPoolKey([]), eventRecordPoolKey([blow(true, 5)]), eventRecordPoolKey([blow(true, 500)]),
      eventRecordPoolKey([blow(true, 5), blow(true, 9)]), eventRecordPoolKey([blow(false, 5)]),
    ])].sort()).toEqual(poolsOf('DS-GEN-16').sort());
    // ⚠ AN ABSENT `anchored` IS NOT A `false`. A record that has not been asked the question
    // reads UNMARKED when it carries no severe row, and counting it as unanchored would state
    // something the record does not.
    expect(eventRecordPoolKey([{ yearsAgo: 5, lastingEffects: ['x'] }])).toBe('UNMARKED');
    expect(eventRecordPoolKey([{ severity: 'minor', yearsAgo: 5, lastingEffects: [] }])).toBe('UNMARKED');
    // ⛔ AND UNMARKED IS "no severe event on the record" (the block's STATE-KEY; owner order
    // 2026-09-17, "fix the remaining contradictions"). A `major` or `catastrophic` row that
    // neither arm claims used to fall through to UNMARKED, which printed "No great blow stands on
    // the record" beside that very row on the History tab. It now draws NOTHING.
    for (const severity of ['major', 'catastrophic']) {
      expect(eventRecordPoolKey([{ severity, yearsAgo: 40, lastingEffects: [] }]), severity).toBeNull();
      expect(eventRecordPoolKey([{ severity, anchored: false, yearsAgo: 40, lastingEffects: [] }]), severity).toBeNull();
      expect(eventRecordPoolKey([{ severity, yearsAgo: 40, lastingEffects: ['x'] }]), severity).toBeNull();
      // The arms that DO claim a severe row are untouched by the severity read.
      expect(eventRecordPoolKey([{ ...blow(true, 5), severity }])).toBe('ANCHORED-RECENT');
      expect(eventRecordPoolKey([{ ...blow(false, 5), severity }])).toBe('RECORDED-UNANCHORED');
    }
    expect(eventAnchorDimension(undefined)).toBeNull();
    expect(eventAnchorDimension(true)).toBe('anchored');
    expect(eventAnchorDimension(false)).toBe('not anchored');
    // The marker SELECTION is stated, not left to array order: the nearest ANCHORED row wins.
    expect(significantEvent([blow(false, 1), blow(true, 90), blow(true, 20)]).yearsAgo).toBe(20);
    expect(significantEvent([blow(false, 8), blow(false, 3)]).yearsAgo).toBe(3);
    expect(significantEvent([])).toBeNull();
  });

  it('⛔ GENERATED TOWNS: "No great blow stands on the record" never composes over a severe row (owner order 2026-09-17)', () => {
    // The 12 hamlets below are twelve of the fifteen DRIFT-corpus towns the old fall-through
    // spoke UNMARKED over (each lists a `major` or `catastrophic` event on its History tab).
    const cultures = ['arabic', 'celtic', 'east_asian', 'germanic', 'greek', 'latin', 'mediterranean',
      'mesoamerican', 'norse', 'slavic', 'south_asian', 'steppe'];
    let severeTowns = 0;
    for (const culture of cultures) {
      const s = generateSettlementPipeline({
        settType: 'hamlet', culture, terrainOverride: 'forest', tradeRouteAccess: 'isolated', monsterThreat: 'civilized',
      }, null, { seed: 'golden-master-v3', customContent: {} });
      const events = s.history?.historicalEvents || [];
      const severe = events.some((e) => e.severity === 'major' || e.severity === 'catastrophic');
      if (severe) severeTowns += 1;
      if (severe) expect(eventRecordPoolKey(events), `${culture}: a severe row still read UNMARKED`).not.toBe('UNMARKED');
    }
    // Non-vacuity: the sweep really reached towns whose record carries a severe row.
    expect(severeTowns).toBeGreaterThan(0);
  }, 60_000);

  it('MEASURED RESIDUE: the duration ladder tops out below this chapter\'s subject', () => {
    // ⛔ THE FINDING, PINNED SO IT CANNOT DECAY. `{timeband_since}` is the ADVERBIAL column
    // and the sixth band (`older_than_bearers`) is PREDICATE-ONLY, so the slot is unfillable
    // beyond a generation — while generated history is mostly centuries old. Both halves are
    // counted here: the day either the ladder or the generator moves, this arm moves with it.
    let events = 0; let beyond = 0; let anchoredReligious = 0;
    for (const seed of ['sf-test-2026-04', 'gen2-a', 'gen2-b']) {
      for (const settType of ['hamlet', 'town', 'city', 'metropolis']) {
        const s = generateSettlementPipeline(
          { settType, culture: 'germanic', tradeRouteAccess: 'road' }, null, { seed, customContent: {} },
        );
        for (const e of (s.history?.historicalEvents || [])) {
          events += 1;
          if ((e.yearsAgo || 0) > 60) beyond += 1;
          if (e.type === 'religious' && e.anchored === true) anchoredReligious += 1;
        }
      }
    }
    expect(events, 'the sweep generated no events').toBeGreaterThan(80);
    // The MAJORITY of the record sits past the ladder's last adverbial band.
    expect(beyond / events, 'the record stopped being mostly ancient').toBeGreaterThan(0.6);
    // ⛔ AND ONE POOL FALLS SILENT BECAUSE OF IT. `event type: religious` carries four
    // variants; the two that name no duration are marked for the OTHER side of the anchor
    // dimension, so an anchored religious event older than a generation has nothing eligible
    // to say. The cure is a corpus or ladder act, not a desk act.
    expect(anchoredReligious, 'no anchored religious event was generated').toBeGreaterThan(0);
    const religious = DOSSIER_STATE_PROSE_GENERAL['DS-GEN-9'].pools['event type: religious'];
    const unslotted = religious.filter((v) => !(v.slots || []).includes('timeband_since'));
    expect(unslotted.length, 'the religious pool changed shape').toBeGreaterThan(0);
    expect(
      unslotted.every((v) => (v.marks || []).includes('not anchored')),
      'a duration-free ANCHORED variant appeared — the religious silence below is cured',
    ).toBe(true);
  });
});

/**
 * ── THE VIABILITY VERDICT AND THE PLOT-HOOK FRAMING (DESK-GEN2 car 2) ───────────────
 * DS-GEN-11 at `viability.verdict`, DS-HK-1 at `plot_hooks.framing`.
 */
describe('the viability verdict and the hook framing', () => {
  it('DS-GEN-11 is TOTAL over the three states `viable` can be in, and MARGINAL is one of them', () => {
    // ⚠ AN ABSENT VERDICT IS THE MARGINAL ARM, NOT SILENCE. ViabilityTab renders exactly this
    // three-way split as its own headline, and a desk that read `undefined` as "nothing to
    // say" would fall dumb on the one verdict the page prints in amber.
    expect(viabilityVerdictPoolKey(true)).toBe('viable: true: the arithmetic closes');
    expect(viabilityVerdictPoolKey(false)).toBe('viable: false: the arithmetic does not close');
    expect(viabilityVerdictPoolKey(undefined)).toBe('the MARGINAL arm: neither verdict returned');
    expect(viabilityVerdictPoolKey(null)).toBe('the MARGINAL arm: neither verdict returned');
    // The three-way headline is the mirror this totality is FOR — and it MOVED. The tab
    // forked inline on `viable` and printed its own words while the paid PDF printed four
    // different ones from a private `verdictOf`; both now read ONE derivation, so the anchor
    // follows it there and the tab is anchored on the fact that it reads it.
    mustExtract(
      src('src/components/new/tabs/ViabilityTab.jsx'),
      'const verdict = viabilityVerdict(v);',
      'the viability tab reads the ONE shared verdict derivation',
    );
    mustExtract(
      src('src/domain/display/viabilityVerdict.js'),
      "return { tone: 'good', label: 'Viable', glyph: '✓' };",
      'the VIABLE arm of the shared verdict',
    );
    mustExtract(
      src('src/domain/display/viabilityVerdict.js'),
      "return { tone: 'bad', label: 'Not viable', glyph: '✗' };",
      'the NOT-VIABLE arm of the shared verdict',
    );
    // ⚠ THE MARGINAL ARM LOST ITS `verdict` SPELLING ON 2026-09-19, and the anchor follows
    // the arm rather than the string it used to be written in. It read
    // `label: String(tokenCase(v?.verdict ? String(v.verdict) : 'Uncertain'))` — a
    // fall-through that consulted `verdict` and `verdictTone`, two keys MEASURED to have no
    // writer anywhere in src/ (a generated `economicViability` carries only dependencies,
    // issues, metrics, plotHooks, suggestions, summary, viable, warnings). The
    // observed-shape ratchet convicted them once the lift moved them into the scanned tree,
    // and the doctrine is cure rather than admit. The ARM IS UNCHANGED in every way this
    // test cares about: an absent verdict is still MARGINAL, still 'Uncertain', still the
    // third of three states. Its full pin lives in tests/pdf/labelLadderParity.test.jsx.
    mustExtract(
      src('src/domain/display/viabilityVerdict.js'),
      "return { tone: 'warn', label: 'Uncertain', glyph: '' };",
      'the MARGINAL fall-through arm of the shared verdict',
    );
    // The contradiction count: two pools, and a non-number is NOT a zero.
    expect(criticalIssuePoolKey(2)).toBe('criticalIssueCount: critical contradictions on the record');
    expect(criticalIssuePoolKey(0)).toBe('criticalIssueCount zero');
    expect(criticalIssuePoolKey(undefined), 'an unmeasured record read as zero').toBeNull();
    expect(criticalIssuePoolKey('2')).toBeNull();
    // TOTAL the other way: the six pools are claimed by these three lenses and no other.
    expect([...new Set([
      viabilityVerdictPoolKey(true), viabilityVerdictPoolKey(false), viabilityVerdictPoolKey(undefined),
      criticalIssuePoolKey(1), criticalIssuePoolKey(0), 'THE FIRST-SURVEY QUALIFICATION',
    ])].sort()).toEqual(poolsOf('DS-GEN-11').sort());
  });

  it('⚠ the contradiction count is at metrics.criticalIssueCount — the abbreviated path is dark', () => {
    // The corpus title spells the path `criticalIssueCount`; the producer writes it one level
    // down. This lane's FIRST probe read the abbreviation and measured the field 0/24 present
    // when it is 48/48 — the same trap DS-GEN-17's `compound.inst` note records. Both
    // directions are driven so the finding cannot decay into a shrug.
    mustExtract(
      src('src/generators/economy/viability.js'),
      'criticalIssueCount: criticalIssues.length',
      'the criticalIssueCount writer in viability.js',
    );
    let atMetrics = 0; let atRoot = 0; let towns = 0;
    for (const seed of ['sf-test-2026-04', 'gen2-a']) {
      for (const settType of ['hamlet', 'town', 'city', 'metropolis']) {
        const s = generateSettlementPipeline(
          { settType, culture: 'germanic', tradeRouteAccess: 'road' }, null, { seed, customContent: {} },
        );
        towns += 1;
        if (typeof s.economicViability?.metrics?.criticalIssueCount === 'number') atMetrics += 1;
        if (typeof (/** @type {any} */ (s.economicViability)?.criticalIssueCount) === 'number') atRoot += 1;
      }
    }
    expect(towns).toBeGreaterThan(0);
    expect(atMetrics, 'the canonical path stopped carrying the count').toBe(towns);
    expect(atRoot, 'the abbreviated path started carrying the count — the trap is cured').toBe(0);
  });

  it('DS-HK-1 is a 7-for-7 and 4-for-4 identity with the two closed producer vocabularies', () => {
    // DIRECTION 1 — every category the registry declares reaches a pool.
    const categories = Object.keys(PLOT_HOOK_CATEGORIES);
    expect(categories.length, 'the hook category registry moved').toBe(7);
    for (const c of categories) {
      expect(hookCategoryPoolKey(c), `no pool claims the '${c}' category`).toBeTruthy();
    }
    // DIRECTION 2 — every `category ` pool is claimed by a registry member.
    const categoryPools = poolsOf('DS-HK-1').filter((k) => k.startsWith('category '));
    expect(categoryPools.length).toBe(7);
    expect(new Set(categories.map((c) => hookCategoryPoolKey(c))).size).toBe(7);
    // And the vocabulary is CLOSED: an unknown category renders nothing.
    expect(hookCategoryPoolKey('weather')).toBeNull();
    expect(hookCategoryPoolKey('')).toBeNull();

    // THE CLOCKS, keyed on the TOKEN inside the id and never on the label.
    const clockPools = poolsOf('DS-HK-1').filter((k) => k.startsWith('clock '));
    expect(clockPools.length).toBe(4);
    for (const pool of clockPools) {
      expect(escalationClockPoolKey(`clock.${pool.slice('clock '.length)}.whatever`)).toBe(pool);
    }
    // ⚠ THE LABEL IS NOT A KEY. 'Bread Riot Clock' is a display string.
    expect(escalationClockPoolKey('Bread Riot Clock')).toBeNull();
    expect(escalationClockPoolKey('clock.nonesuch.x')).toBeNull();
    expect(escalationClockPoolKey('notaclock.bread_riot.x')).toBeNull();

    // THE PRODUCERS REALLY WRITE THESE TOKENS — measured, not transcribed, over real worlds.
    const seenCategories = new Set(); const seenClocks = new Set();
    for (const seed of ['sf-test-2026-04', 'gen2-a', 'gen2-b']) {
      for (const settType of ['hamlet', 'town', 'city', 'metropolis']) {
        const s = generateSettlementPipeline(
          { settType, culture: 'germanic', tradeRouteAccess: 'road' }, null, { seed, customContent: {} },
        );
        for (const h of collectPlotHooks(s)) if (h?.category) seenCategories.add(h.category);
        for (const c of deriveEscalationClocks(s)) seenClocks.add(String(c.id).split('.')[1]);
      }
    }
    expect(seenCategories.size, 'the generator wrote no hook categories').toBeGreaterThan(0);
    // Every category the generator writes is one the registry declares — no stranger.
    for (const c of seenCategories) expect(categories, `'${c}' is not a declared category`).toContain(c);
    // Every clock the generator raises reaches a pool.
    for (const k of seenClocks) {
      expect(escalationClockPoolKey(`clock.${k}.x`), `the clock '${k}' reaches no pool`).toBeTruthy();
    }
  });
});

/**
 * ── DS-REL-2 AT `overview.notableConnection` (DESK-GEN2 car 4) ──────────────────────
 * One lens DRAWN and one DROPPED, which is the registry's MEASUREMENT-OR-DEFAULT test
 * resolving both ways inside a single block.
 */
describe('the notable connection', () => {
  it('draws ONLY where the record really carries a prominent relationship', () => {
    expect(notableConnectionPoolKey({ phrasing: 'Two people, one debt.' }))
      .toBe('prominentRelationship present');
    // An absence is a town whose ties are level — a true statement, not a missing reading.
    expect(notableConnectionPoolKey(null)).toBeNull();
    expect(notableConnectionPoolKey({})).toBeNull();
    expect(notableConnectionPoolKey({ phrasing: '   ' })).toBeNull();
    expect(notableConnectionPoolKey({ phrasing: 42 })).toBeNull();
  });

  it('⛔ flagDriven HAS a writer — the count is a MEASUREMENT, and the one-line grep lied', () => {
    // ⛔⛔ THIS ARM EXISTS BECAUSE THIS LANE GOT IT WRONG FIRST. A one-line grep for
    // `flagDriven\s*[:=]` found exactly ONE site — a READ in RelationshipsTab.jsx — and the
    // lens was ruled dead on the `economicBase: mixed` precedent. It is not dead:
    // npcGenerator.js writes the flag on EVERY relationship row, and the grep missed it only
    // because the value is a multi-line boolean and the key sits alone on its line. A count
    // of zero over a field a producer WRITES is a measurement; over a field nothing writes it
    // is a default in a reading's clothes. This one is the first.
    mustExtract(src('src/generators/npcGenerator.js'), 'flagDriven:', 'the flagDriven writer in npcGenerator.js');
    // BOTH pools are routed, and the third state — no roll at all — is neither.
    expect(flagDrivenPoolKey([{ flagDriven: true }, { flagDriven: false }])).toBe('flagDriven count > 0');
    expect(flagDrivenPoolKey([{ flagDriven: false }])).toBe('flagDriven count zero');
    expect(flagDrivenPoolKey([{}])).toBe('flagDriven count zero');
    // ⚠ AN ABSENT ROLL IS NOT AN EMPTY ONE: a settlement with no `relationships` array has
    // not been asked the question, and neither pool is a true answer.
    expect(flagDrivenPoolKey(undefined)).toBeNull();
    expect(flagDrivenPoolKey([])).toBeNull();
    // TOTAL over the block: the three pools are exactly the three this desk routes.
    expect([...new Set([
      notableConnectionPoolKey({ phrasing: 'x' }),
      flagDrivenPoolKey([{ flagDriven: true }]),
      flagDrivenPoolKey([{ flagDriven: false }]),
    ])].sort()).toEqual(poolsOf('DS-REL-2').sort());
  });

  it('MEASURED RESIDUE: the flag is written on every row and TRUE on none of them yet', () => {
    // The finding, pinned so it cannot decay into "the lens is dead". The flag is
    // `stressFlags.anyActive && archetype ∈ {six stress-economic effects}`, so `count > 0`
    // is reached only in a stressed world. Both halves are counted: rows carrying the field,
    // and rows where it is true.
    let rows = 0; let carried = 0; let driven = 0;
    for (const seed of ['sf-test-2026-04', 'gen2-a', 'gen2-b']) {
      for (const settType of ['hamlet', 'town', 'city', 'metropolis']) {
        const s = generateSettlementPipeline(
          { settType, culture: 'germanic', tradeRouteAccess: 'road' }, null, { seed, customContent: {} },
        );
        for (const rel of (s.relationships || [])) {
          rows += 1;
          if (Object.prototype.hasOwnProperty.call(rel, 'flagDriven')) carried += 1;
          if (rel.flagDriven === true) driven += 1;
        }
      }
    }
    expect(rows, 'no relationships were generated').toBeGreaterThan(20);
    // THE WRITER REACHES EVERY ROW — this is what makes the zero a reading.
    expect(carried, 'the writer stopped stamping the field').toBe(rows);
    // AND IT IS TRUE ON NONE OF THEM in an unstressed sweep, which is the residue.
    expect(driven, 'a flag-driven relationship appeared — re-measure the residue').toBe(0);
  });

  it('the producer really writes prominentRelationship, on some towns and not others', () => {
    // BOTH directions over real worlds: a lens that fired on every town would be a default,
    // and one that fired on none would be dark. It is a genuine, conditional reading.
    mustExtract(
      src('src/generators/narrativeGenerator.js'),
      'const prominentRelationship',
      'the prominentRelationship writer in narrativeGenerator.js',
    );
    let towns = 0; let carried = 0;
    for (const seed of ['sf-test-2026-04', 'gen2-a', 'gen2-b']) {
      for (const settType of ['hamlet', 'town', 'city', 'metropolis']) {
        const s = generateSettlementPipeline(
          { settType, culture: 'germanic', tradeRouteAccess: 'road' }, null, { seed, customContent: {} },
        );
        towns += 1;
        if (s.prominentRelationship?.phrasing) carried += 1;
      }
    }
    expect(towns).toBeGreaterThan(0);
    expect(carried, 'no generated town carried a prominent relationship').toBeGreaterThan(0);
    expect(carried, 'every town carried one — the lens is a default, not a reading')
      .toBeLessThan(towns);
  });
});

describe('DS-GEN-18 — why these workshops, and the blocker that was in the wrong place', () => {
  const CHAIN = (over = {}) => ({
    resource: 'Iron ore deposits', upstreamMissing: [], processingInstitutions: ['Smelter'], ...over,
  });
  const drawCraft = (readings) => generalStateProse(TOWN, readings, { seed: 'craft', audience: 'dm' })
    .economics.craftReason?.sentence ?? null;

  it('ALL FOUR POOLS FIRE, and a record with nothing to explain is SILENT rather than defaulted', () => {
    const cases = [
      ['STALLED', { activeChains: [CHAIN({ upstreamMissing: ['warehouse_logistics'] })] }],
      ['HOME-FED', {
        activeChains: [CHAIN({ resource: 'Livestock' })],
        exploitation: { partiallyExploited: [{ rawResource: 'livestock' }] },
      }],
      ['BOUGHT-IN', { isEntrepot: true, primaryImports: ['Wool'] }],
      ['UNWORKED', { exploitation: { unexploited: [{ rawResource: 'wool' }] } }],
    ];
    for (const [key, readings] of cases) {
      expect(craftReasonPoolKey(readings), key).toBe(key);
      expectSentence(drawCraft(readings), key);
    }
    expect([...new Set(cases.map(([key]) => key))].sort()).toEqual(poolsOf('DS-GEN-18').sort());
    // ⛔ THE STATED SILENCE IS HALF THE TOTALITY. An else-arm here would put an authored
    // sentence on an empty record; the annex rules R-DST-K instead, so a record carrying
    // none of the four antecedents resolves to NO KEY and draws nothing.
    expect(craftReasonPoolKey({ activeChains: [], exploitation: {}, primaryImports: [] })).toBeNull();
    expect(drawCraft({})).toBeNull();
  });

  it('THE ORDER IS THE ANNEX\'S OWN, and each key outranks the one below it', () => {
    // A record satisfying EVERY antecedent at once resolves to the narrowest — the only
    // one naming a live defect — and the ladder is walked one rung at a time from there.
    const everything = {
      activeChains: [CHAIN({ resource: 'Livestock', upstreamMissing: ['stone'] })],
      exploitation: { partiallyExploited: [{ rawResource: 'livestock' }], unexploited: [{ rawResource: 'wool' }] },
      isEntrepot: true,
      primaryImports: ['Wool'],
    };
    expect(craftReasonPoolKey(everything)).toBe('STALLED');
    expect(craftReasonPoolKey({ ...everything, activeChains: [CHAIN({ resource: 'Livestock' })] })).toBe('HOME-FED');
    expect(craftReasonPoolKey({ ...everything, activeChains: [], exploitation: { unexploited: [{ rawResource: 'wool' }] } })).toBe('BOUGHT-IN');
    expect(craftReasonPoolKey({
      activeChains: [], exploitation: { unexploited: [{ rawResource: 'wool' }] }, isEntrepot: false, primaryImports: [],
    })).toBe('UNWORKED');
  });

  it('⛔ {institution} REFUSES A PLURAL HOUSE, and the digit was never the whole blocker', () => {
    // The seams say "outlived ITS feed" and "the building stands", so the fill must be one
    // house. The head word carries the number; a possessive and a trailing `ss` do not.
    expect(craftInstitutionFill(['Carriers\' guild'])).toBe('Carriers\' guild');
    expect(craftInstitutionFill(['Waystation'])).toBe('Waystation');
    expect(craftInstitutionFill(['Cobbler\'s guild'])).toBe('Cobbler\'s guild');
    // …and every one of these is REFUSED rather than repaired.
    expect(craftInstitutionFill(['Glassmakers']), 'a plural house took a singular seam').toBeUndefined();
    expect(craftInstitutionFill(['City walls and gates'])).toBeUndefined();
    expect(craftInstitutionFill(['Merchant guilds (3-8)']), '§0d bans digits from dossier prose').toBeUndefined();
    expect(craftInstitutionFill([])).toBeUndefined();
    // THE ORDER OF THE LIST IS NOT THE ORDER OF THE FILL: the first CONFORMING row wins, so
    // a roster whose first entry is plural still names its singular house.
    expect(craftInstitutionFill(['Glassmakers', 'Merchant guilds (3-8)', 'Smelter'])).toBe('Smelter');
    // And where nothing conforms, both STALLED variants name the slot ⇒ the pool is SILENT.
    const withheld = { activeChains: [CHAIN({ upstreamMissing: ['stone'], processingInstitutions: ['Glassmakers'] })] };
    expect(craftReasonPoolKey(withheld), 'the KEY still resolves — the silence is the FILL\'s').toBe('STALLED');
    expect(drawCraft(withheld), 'a plural house drew a singular sentence').toBeNull();
    // Every fill this desk offers passes the ANNEX'S OWN shape checker, not a local twin.
    const shapes = mergedShapes();
    expect(fillShapeViolation(shapes.shapeOf('institution'), craftInstitutionFill(['Smelter']))).toBe('');
  });

  it('⛔ {resource} IS NOT OFFERED ON STALLED — the feed that failed has no honest producer', () => {
    // MEASURED IN RENDERED PROSE. Filling from the chain's own `resource` printed "the iron
    // ore deposits stopped arriving" — the town's standing ground described as a delivery
    // that failed. The only producer of what actually stopped is `upstreamMissing[]`, which
    // holds CHAIN IDS (`warehouse_logistics`), refused outright as raw engine tokens.
    const stalled = { activeChains: [CHAIN({ upstreamMissing: ['warehouse_logistics'] })] };
    const line = drawCraft(stalled);
    expectSentence(line, 'STALLED');
    expect(line, 'the chain\'s own ground was described as a delivery that failed')
      .not.toMatch(/iron ore deposits/i); // anchored: expectSentence above proves this render drew a real STALLED sentence, and the equality on the next lines proves it is the variant that names no {resource}
    // The variant naming the slot is dropped and the pool speaks through the one that does
    // not. ⭐ ASSERTED THROUGH THE SHIPPED READ PATH, not through a transcribed fragment
    // (car 8a-13): the same bag WITHOUT `{resource}` is what makes the drop happen, so the
    // corpus's own answer to that bag is the honest right-hand side, and a rewrite of the
    // surviving wording moves the desk's line and this anchor together.
    expect(line).toBe(drawnMember({
      leaf: 'general', blockId: 'DS-GEN-18', poolKey: 'STALLED', seed: 'craft',
      slots: { settlement: 'Thornwall', institution: 'Smelter' },
    }));
    // The token itself must never reach a reader through any seam of this block.
    expect(fillShapeViolation(mergedShapes().shapeOf('resource'), 'warehouse_logistics')).toBe('ENGINE-TOKEN-IN-FILL');
  });

  it('⛔ {good} REFUSES THE ENGINE\'S PARENTHETICAL BOOKKEEPING', () => {
    // `primaryImports[]` really writes `Bulk grain (local fields depleted)`. That is the
    // `{complexity}` defect §0c records — a gloss reaching a reader through a slot — in its
    // round-bracket spelling, which the shared dash test does not catch.
    const glossed = { isEntrepot: true, primaryImports: ['Bulk grain (local fields depleted)', 'Wool'] };
    const line = drawCraft(glossed);
    expectSentence(line, 'BOUGHT-IN');
    expect(line).not.toMatch(/[()]/); // anchored: expectSentence above proves the line is a real drawn sentence over a glossed import list
    // An entrepôt whose every import is glossed still SPEAKS: one BOUGHT-IN variant names
    // no good at all, which is why the key resolves on the flag and not on the fill.
    const allGlossed = { isEntrepot: true, primaryImports: ['Iron ore (local mines exhausted)'] };
    expect(craftReasonPoolKey(allGlossed)).toBe('BOUGHT-IN');
    expectSentence(drawCraft(allGlossed), 'BOUGHT-IN, every import glossed');
  });

  it('⛔ HOME-FED IS ALL BUT UNREACHABLE, and the route that would light it is a DEFAULT', () => {
    // The two ledgers speak different vocabularies: the chain rows name their feed
    // `Grazing land` / `Iron ore deposits`, the exploitation rows name theirs `livestock` /
    // `wool` / `timber`. The desk keys the join on the canonical token anyway, because the
    // reading is TRUE where it holds — and the tempting alternative, `resourceActive`, is
    // true on every chain of every town and would print the home-fed sentence everywhere.
    const disjoint = {
      activeChains: [CHAIN({ resource: 'Grazing land' })],
      exploitation: { partiallyExploited: [{ rawResource: 'livestock' }] },
    };
    expect(craftReasonPoolKey(disjoint), 'the vocabularies agreed when they should not').toBeNull();
    expect(disjoint.activeChains[0].upstreamMissing).toHaveLength(0);
    // …and it DOES hold where the two records really name the same thing.
    expect(craftReasonPoolKey({
      activeChains: [CHAIN({ resource: 'Livestock' })],
      exploitation: { fullyExploited: [{ rawResource: 'livestock' }] },
    })).toBe('HOME-FED');
  });
});

describe('DS-GEN-18 over the real generator — the route, measured', () => {
  const CONFIGS = [
    ['hamlet_forest_isolated', { settType: 'hamlet', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated' }],
    ['city_plains_crossroads', { settType: 'city', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'crossroads' }],
    ['metropolis_riverside_port', { settType: 'metropolis', culture: 'mediterranean', terrainOverride: 'riverside', tradeRouteAccess: 'port' }],
    ['village_coastal_port', { settType: 'village', culture: 'norse', terrainOverride: 'coastal', tradeRouteAccess: 'port' }],
  ];
  const SEEDS = ['sf-test-2026-04', 'gen3-a', 'gen3-b'];

  it('the antecedents are REAL: three of the four keys are reached over generated towns', () => {
    /** @type {Record<string, number>} */
    const seen = {};
    let unfilled = 0;
    let digits = 0;
    for (const seed of SEEDS) {
      for (const [, config] of CONFIGS) {
        const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
        const readings = {
          activeChains: s.economicState?.activeChains,
          exploitation: s.resourceAnalysis?.exploitation,
          isEntrepot: s.economicState?.isEntrepot,
          primaryImports: s.economicState?.primaryImports,
        };
        const key = craftReasonPoolKey(readings);
        seen[String(key)] = (seen[String(key)] || 0) + 1;
        const line = generalStateProse(s, readings, { seed, audience: 'dm' }).economics.craftReason?.sentence;
        if (line) {
          if (/\{[a-z_]+\}/i.test(line)) unfilled += 1;
          if (/[0-9]/.test(line)) digits += 1;
        }
      }
    }
    expect(unfilled, 'an unfilled seam reached the reader').toBe(0);
    expect(digits, '§0d bans digits from dossier prose').toBe(0);
    // ⚠ A FLOOR, NOT AN EXACT COUNT: which key a town reaches is the generator's business
    // and the seeds may move. What is asserted is that the route is not keyed on one arm.
    expect(Object.keys(seen).filter((k) => k !== 'null').length, `keys reached: ${JSON.stringify(seen)}`)
      .toBeGreaterThanOrEqual(3);
    expect(seen.STALLED, 'STALLED was never reached over the sample').toBeGreaterThan(0);
    expect(seen.null || 0, 'a generated town reached no antecedent at all').toBe(0);
  });

  it('THE INSTITUTION FILL IS THE CHAIN ROW\'S OWN — no roster join, no generator import', () => {
    // The annex rules the fill "a processingInstitutions[] row's own recorded name", and
    // that list is ALREADY the matched subset: computeActiveChains returns early where no
    // institution matches, so the chain row alone is sufficient. Resolving through the
    // roster instead would drag a GENERATOR module into every tab chunk that draws this
    // desk — and would clean nothing, because the roster spells the plural category the
    // same way (`Merchant guilds (3-8)` resolves to `Merchant guilds (50-100+)`).
    const specs = importSpecifiers(src('src/domain/display/stateProse/generalStateProse.js'));
    expect(specs.length, 'the import extractor found nothing — the arm is vacuous').toBeGreaterThan(3);
    expect(specs.filter((x) => x.includes('generators/')), 'the desk imports a generator module')
      .toEqual([]);
    expect(specs.some((x) => x.includes('computeActiveChains'))).toBe(false);
    let stalledTowns = 0;
    let named = 0;
    for (const seed of SEEDS) {
      for (const [, config] of CONFIGS) {
        const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
        const chains = (s.economicState?.activeChains || [])
          .filter((c) => Array.isArray(c.upstreamMissing) && c.upstreamMissing.length > 0);
        if (chains.length === 0) continue;
        stalledTowns += 1;
        if (chains.some((c) => craftInstitutionFill(c.processingInstitutions))) named += 1;
      }
    }
    expect(stalledTowns, 'no generated town carried a stalled chain — the arm is vacuous')
      .toBeGreaterThan(0);
    // MEASURED at this tip: most stalled towns offer a singular house and some offer none,
    // and the ones that offer none fall SILENT. A floor rather than a ratio: the generator
    // owns which rosters a seed produces.
    expect(named, 'not one stalled town could name a house').toBeGreaterThan(0);
  });
});

describe('DS-GEN-8 — the remnant, the fallen city and the steadings (a lawful DARK mount)', () => {
  const drawSteadings = (readings) => {
    const g = generalStateProse(TOWN, readings, { seed: 'gen8', audience: 'dm' }).steadings;
    return { remnant: g.remnant?.sentence ?? null, ruin: g.ruin?.sentence ?? null, rows: g.rows.map((r) => r?.sentence ?? null) };
  };

  it('ALL SIX POOLS FIRE — two grades, the ruin, and the three steading arms', () => {
    const keys = [
      ['lifecycleStatus: relic_ruin', remnantPoolKey('relic_ruin')],
      ['lifecycleStatus: abandoned_site', remnantPoolKey('abandoned_site')],
      ['history.ancientRuin present', ancientRuinPoolKey({ name: 'Ecserys', yearsAgo: 12 })],
      ["steading row: provenance: 'forced'", steadingPoolKey({ provenance: 'forced' })],
      ['steading row: charterPending', steadingPoolKey({ provenance: 'growth', charterPending: true })],
      ['steading row: organic', steadingPoolKey({ provenance: 'growth' })],
    ];
    for (const [expected, actual] of keys) expect(actual, expected).toBe(expected);
    expect(keys.map(([k]) => k).sort()).toEqual(poolsOf('DS-GEN-8').sort());
    // …and each of them really draws a sentence.
    expectSentence(drawSteadings({ lifecycleStatus: 'relic_ruin' }).remnant, 'relic_ruin');
    expectSentence(drawSteadings({ lifecycleStatus: 'abandoned_site' }).remnant, 'abandoned_site');
    expectSentence(drawSteadings({ ancientRuin: { name: 'Ecserys', yearsAgo: 12 } }).ruin, 'the ruin');
    for (const row of [{ provenance: 'forced' }, { provenance: 'growth', charterPending: true }, { provenance: 'growth' }]) {
      expectSentence(drawSteadings({ steadings: [{ ...row, name: 'Brackenfold' }] }).rows[0], JSON.stringify(row));
    }
  });

  it('⛔ DORMANT AT BIRTH, AND DORMANT IS A TRUE STATEMENT — nothing defaults', () => {
    // Every one of the three antecedents is ABSENT on a freshly generated settlement, and
    // the block renders NOTHING rather than an else-arm. This is the DS-STR-2 precedent: a
    // real writer off the generation path is a lawful dark mount.
    const dark = drawSteadings({});
    expect(dark.remnant).toBeNull();
    expect(dark.ruin).toBeNull();
    expect(dark.rows).toEqual([]);
    expect(remnantPoolKey(''), 'a living town resolved a remnant grade').toBeNull();
    expect(remnantPoolKey('thriving'), 'an unknown grade fell into a pool').toBeNull();
    expect(ancientRuinPoolKey(null)).toBeNull();
    expect(steadingPoolKey(null)).toBeNull();
    // …and the producers are real, which is what makes the silence dormancy and not death.
    // ⚠ THE FLAG IS NECESSARY AND NOT SUFFICIENT, which this lane learned by pinning one
    // seed and watching it come back empty. Measured over twelve seeds on one config: the
    // ruin appears on ONE of twelve with `ancientRuinsEnabled` and on NONE of twelve
    // without. So the seeds are scanned rather than pinned, and the flag-off control is
    // what makes the presence a reading of the flag rather than of the seed.
    const SEEDS = ['sf-test-2026-04', 'gen3-a', 'gen3-b', 'gen3-c', 'gen3-e', 'gen3-f',
      'gen3-g', 'gen3-h', 'ruin-1', 'ruin-2', 'ruin-3', 'ruin-4'];
    const site = { settType: 'city', culture: 'celtic', terrainOverride: 'hills', tradeRouteAccess: 'river' };
    /** @param {object} config @param {string} seed */
    const ruinOf = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} })
      .history?.ancientRuin;
    const withFlag = SEEDS.map((seed) => ruinOf({ ...site, ancientRuinsEnabled: true }, seed)).filter(Boolean);
    const withoutFlag = SEEDS.map((seed) => ruinOf(site, seed)).filter(Boolean);
    expect(withFlag.length, 'the opt-in ancient ruin no longer writes on any seed').toBeGreaterThan(0);
    expect(withoutFlag, 'a ruin arrived without its config flag').toEqual([]);
    expect(typeof withFlag[0].name).toBe('string');
    expect(typeof withFlag[0].yearsAgo).toBe('number');
    // …and the desk really keys on it.
    expect(ancientRuinPoolKey(withFlag[0])).toBe('history.ancientRuin present');
  });

  it('THE PROVENANCE FOLD IS TOTAL over the ledger\'s own closed four-word vocabulary', () => {
    // `satellitesLedger.js`'s SatelliteRecord typedef is the authority, and it is read from
    // the source rather than transcribed, so a fifth word reds here instead of folding.
    const ledger = src('src/domain/worldPulse/satellitesLedger.js');
    mustExtract(ledger, "@property {'growth'|'resource_strike'|'resettlement'|'forced'} provenance",
      'the SatelliteRecord provenance vocabulary');
    for (const word of ['growth', 'resource_strike', 'resettlement']) {
      expect(steadingPoolKey({ provenance: word }), word).toBe('steading row: organic');
    }
    expect(steadingPoolKey({ provenance: 'forced' })).toBe("steading row: provenance: 'forced'");
    // ⚠ THE ORDER IS A RULING: a steading that is BOTH forced and charter-pending speaks
    // about its origin, which is permanent, rather than its standing, which the record will
    // itself resolve at the charter.
    expect(steadingPoolKey({ provenance: 'forced', charterPending: true }))
      .toBe("steading row: provenance: 'forced'");
  });

  it('⛔ `{band}` IS RESERVED AND IS NEVER FILLED — four variants drop and every pool survives', () => {
    // §0c declares `{band}` RESERVED — one name for six incompatible roles — and
    // `fillShapeViolation` refuses a fill for it outright. So the steading HEAD COUNT never
    // reaches a reader through this desk, which is also §0d's own answer to a raw number.
    const shapes = mergedShapes();
    expect(shapes.shapeOf('band')).toBe('RESERVED');
    expect(fillShapeViolation(shapes.shapeOf('band'), 'a few souls')).toBe('RESERVED-SLOT-HAS-NO-DECLARABLE-FILL');
    expect(SLOT_FILL_SHAPES.band, 'the desk declared a shape for a RESERVED slot').toBeUndefined();
    // Four variants of this block name it. Each of their POOLS still speaks through a
    // variant that does not — which is the whole reason the block is mountable at all.
    const named = Object.entries(DOSSIER_STATE_PROSE_GENERAL['DS-GEN-8'].pools)
      .flatMap(([key, variants]) => variants.filter((v) => (v.slots || []).includes('band')).map(() => key));
    // MEASURED, and this lane first wrote 4 from a hand count of the dump. vitest prints
    // ACTUAL first: `expected 5 to be 4` said the tree carries FIVE, and it does — the
    // `charterPending` ledger variant names the slot too.
    expect(named.length, 'the number of {band} variants moved').toBe(5);
    for (const key of new Set(named)) {
      const survivors = DOSSIER_STATE_PROSE_GENERAL['DS-GEN-8'].pools[key]
        .filter((v) => !(v.slots || []).includes('band'));
      expect(survivors.length, `${key} has no variant that avoids {band}`).toBeGreaterThan(0);
    }
    // And no drawn line ever carries a digit.
    const drawn = drawSteadings({
      lifecycleStatus: 'relic_ruin',
      ancientRuin: { name: 'Ecserys', yearsAgo: 12 },
      steadings: [{ name: 'Brackenfold', provenance: 'growth', population: 40 }],
    });
    for (const line of [drawn.remnant, drawn.ruin, ...drawn.rows].filter(Boolean)) {
      expect(line, '§0d bans digits from dossier prose').not.toMatch(/[0-9]/); // anchored: expectSentence in the first arm proves these same draws are real sentences
    }
  });

  it('THE ROWS ARE INDEX-PAIRED — an unkeyable steading keeps its place', () => {
    // The caller renders each sentence inside the card it is about, so a shortened list
    // would slip the pairing by one. The DS-GEN-2 conflict rule, for the same reason.
    const rows = drawSteadings({
      steadings: [
        { name: 'Brackenfold', provenance: 'forced' },
        { provenance: 'growth' },                       // no name ⇒ no fill ⇒ null IN PLACE
        { name: 'Thornmere', provenance: 'growth', charterPending: true },
      ],
    }).rows;
    expect(rows).toHaveLength(3);
    expect(rows[1], 'a nameless steading shortened the list').toBeNull();
    expectSentence(rows[0], 'the forced steading');
    expectSentence(rows[2], 'the charter-pending steading');
  });

  it('⛔ `{timeband_since}` GOES DARK ON AN OLD RUIN and the pool still speaks', () => {
    // §0d's sixth band is PREDICATE-ONLY, so the adverbial column is null beyond a
    // generation — and the measured ancient ruin is 619 years old. Two of the four variants
    // name the slot and drop; the other two carry the pool.
    const old = drawSteadings({ ancientRuin: { name: 'Ecserys', yearsAgo: 619 } });
    expectSentence(old.ruin, 'a 619-year-old ruin');
    const recent = drawSteadings({ ancientRuin: { name: 'Ecserys', yearsAgo: 12 } });
    expectSentence(recent.ruin, 'a 12-year-old ruin');
    // A ruin whose name cannot be a `proper` fill is WITHHELD rather than repaired.
    expect(ancientRuinPoolKey({ name: 'ecserys', yearsAgo: 12 }), 'a lowercase name filled a proper slot').toBeNull();
    expect(ancientRuinPoolKey({ yearsAgo: 12 })).toBeNull();
  });
});

/**
 * ⛔ DS-GEN-15 IS NOT MOUNTED, AND THIS IS THE MEASURED REASON PINNED SO IT CANNOT DECAY.
 *
 * The block's STATE-KEY needs two 0..1 THRESHOLDS the annex does not author and the estate
 * does not publish: `SCARRED-FRESH` is "a scar carried at high severity", `SCARRED-FADING` is
 * "decayed low", and `ENCROACHED` is "drift high". Three of its five pools are unreachable
 * without them. A lane may not mint the cut — a new named constant enters the tuning register
 * as unregistered debt and raising that ceiling is the chair's act — and borrowing
 * `scoreBand`'s 65/40/20 defence ladder would be this desk ruling that a masonry scar reads
 * on a defence scale, which is a VOCABULARY decision and belongs to whoever owns the words.
 */
describe('⛔ DS-GEN-15 stays dark — the fabric split needs a threshold nobody has authored', () => {
  it('the reader is real and the two threshold-free keys are identified', () => {
    // The block is NOT a reader-with-no-writer: `fabricRead.js` is a live, pure, zero-import
    // API and `urbanFabricKernel.js` writes the mirror it reads. What is missing is the CUT.
    const reader = src('src/domain/townMap/fabricRead.js');
    mustExtract(reader, 'export function fabricScarsOf', 'the fabric scar reader');
    mustExtract(reader, 'export function fabricDriftOf', 'the fabric drift reader');
    mustExtract(reader, 'export function hasFabric', 'the fabric presence check');
    // The two keys that need NO threshold, so the chair's ruling is one line rather than a
    // re-derivation: a rebirth row on record, and a present mirror with neither scar nor
    // rebirth. The other three need the cut.
    expect(poolsOf('DS-GEN-15').sort())
      .toEqual(['ENCROACHED', 'REBUILT', 'SCARRED-FADING', 'SCARRED-FRESH', 'WORN-PLAIN']);
    // …and it is still declared dark, so nothing can quietly half-mount it.
    expect(UNMOUNTED_BLOCKS).toContain('DS-GEN-15');
    expect(sentenceMountForBlock('DS-GEN-15')).toBeNull();
  });

  it('the scar KIND vocabulary is closed at eight, which is what the fill table will need', () => {
    // Measured now so the day the chair rules the threshold, the kind-to-word table the
    // annex calls "wiring work" is written against a vocabulary that has not moved.
    const kernel = src('src/domain/worldPulse/urbanFabricKernel.js');
    mustExtract(kernel, 'export const SCAR_HALF_LIFE_WEEKS', 'the scar kind registry');
    const window = kernel.slice(kernel.indexOf('export const SCAR_HALF_LIFE_WEEKS'));
    const kinds = [...window.slice(0, 700).matchAll(/^\s{2}([a-z_]+):\s*\d+,/gm)].map((m) => m[1]);
    expect(kinds.sort()).toEqual([
      'burn_lots', 'calamity_scar', 'flood_line', 'lean_years',
      'occupation_marks', 'plague_quarter', 'rubble_field', 'siege_repairs',
    ]);
    // ⚠ `calamity_scar` is the UNCLASSIFIED default and has no honest common noun: calling
    // it "calamity" would print the classifier's own failure as a fact about the town.
    expect(kinds).toContain('calamity_scar');
  });
});

describe('DS-REL-1 — the neighbour network, and the arm that prints the wrong town\'s standing', () => {
  const link = (over) => ({ neighbourName: 'Thornmere', ...over });
  const drawNet = (neighbours) => generalStateProse(TOWN, { neighbours }, { seed: 'rel1', audience: 'dm' })
    .relationships.network.flat().filter(Boolean).map((l) => l.sentence);

  it('ALL TEN POOLS FIRE — eight standings, the named people, and the houses', () => {
    const byType = ['trade_partner', 'allied', 'rival', 'cold_war', 'hostile', 'neutral'];
    for (const t of byType) {
      expect(neighbourTiePoolKey(link({ relationshipType: t })), t).toBe(t);
      expectSentence(drawNet([link({ relationshipType: t })])[0], t);
    }
    // The two asymmetric ends, each resolved from the LOCAL role.
    expect(neighbourTiePoolKey(link({ relationshipType: 'patron', localRelationshipRole: 'patron' }))).toBe('patron');
    expect(neighbourTiePoolKey(link({ relationshipType: 'patron', localRelationshipRole: 'client' }))).toBe('client');
    // The two cross-settlement pools.
    expect(crossSettlementNpcPoolKey(link({ npcConnections: [{ primaryNPCName: 'Mugain' }] })))
      .toBe('cross-settlement NPC contacts');
    expect(crossEngagementPoolKey({ type: 'faction_engagement' })).toBe('cross-settlement engagements');
    const all = [...byType, 'patron', 'client', 'cross-settlement NPC contacts', 'cross-settlement engagements'];
    expect(all.sort()).toEqual(poolsOf('DS-REL-1').sort());
  });

  it('⛔⛔ THE ARM: the two ends of one asymmetric tie are DIFFERENT SENTENCES', () => {
    // "{counterpart} looks to {settlement}" against "{settlement}'s decisions are made with
    // {counterpart} in the room". Both read perfectly fluent; only one is true of this town.
    const asPatron = drawNet([link({ relationshipType: 'patron', localRelationshipRole: 'patron' })])[0];
    const asClient = drawNet([link({ relationshipType: 'patron', localRelationshipRole: 'client' })])[0];
    expectSentence(asPatron, 'this town is the patron');
    expectSentence(asClient, 'this town is the client');
    expect(asPatron, 'the two ends drew the same sentence').not.toBe(asClient);
    // …and the direction really is read from the field the estate's own consumer reads.
    const canonical = src('src/domain/relationships/canonicalRelationship.js');
    mustExtract(canonical, 'export function directionalRelationshipLabel', 'the directional label reader');
    mustExtract(canonical, 'link?.localRelationshipRole || link?.displayRelationshipType',
      'the per-side role read this desk mirrors');
    expect(neighbourTiePoolKey(link({ relationshipType: 'patron', displayRelationshipType: 'client' })))
      .toBe('client');
  });

  it('⛔ A TIE WITH NO STATED END IS WITHHELD, never guessed', () => {
    // A legacy row carrying only `relationshipType: 'patron'` does not say which end this
    // town is. Picking one would decide a town's standing by array position.
    expect(neighbourTiePoolKey(link({ relationshipType: 'patron' }))).toBeNull();
    expect(neighbourTiePoolKey(link({ relationshipType: 'client' }))).toBeNull();
    expect(drawNet([link({ relationshipType: 'patron' })])).toEqual([]);
    // …and a SYMMETRIC tie is unaffected, because it has no end to get wrong.
    expectSentence(drawNet([link({ relationshipType: 'rival' })])[0], 'the symmetric arm');
    // MEASURED RESIDUE: two real roles reach no pool and render nothing rather than folding.
    for (const role of ['overlord', 'vassal']) {
      expect(neighbourTiePoolKey(link({ relationshipType: 'vassal', localRelationshipRole: role })), role).toBeNull();
    }
    // The estate's own helper for a SELECTION: the anchor is a member the roster must still
    // carry, so a collapsed corpus fails on the anchor rather than passing on the absence.
    expectAbsentWithAnchor(poolsOf('DS-REL-1'), 'vassal', 'patron', 'a vassal pool appeared');
    expectAbsentWithAnchor(poolsOf('DS-REL-1'), 'overlord', 'client', 'an overlord pool appeared');
  });

  it('⛔ THE NPC NAMED IS THE ONE ON THIS TOWN\'S SIDE', () => {
    // The seam is "{npc} in {settlement} keeps a standing tie in {counterpart}", so naming
    // the neighbour's person would put a stranger inside this town's walls.
    const drawn = drawNet([link({
      relationshipType: 'allied',
      npcConnections: [{ primaryNPCName: 'Mugain', neighbourNPCName: 'Felix' }],
    })]);
    expect(drawn).toHaveLength(2);
    for (const line of drawn) expect(line, 'the far end\'s person was named').not.toContain('Felix'); // anchored: `drawn` is asserted to be two real sentences on the line above, and the npc pool is asserted to have resolved below
    // NON-VACUITY: the npc lens really fired, so the absence above is the fill choosing the
    // local end rather than the lens being dark. ⚠ WHICH VARIANT the pool draws is the
    // SEED's business and two of the three name no `{npc}` at all, so the arm asserts the
    // KEY resolved rather than that a particular name appears.
    expect(crossSettlementNpcPoolKey(link({ npcConnections: [{ primaryNPCName: 'Mugain', neighbourNPCName: 'Felix' }] })))
      .toBe('cross-settlement NPC contacts');
    // NON-VACUITY: the fixture really carries the far end's name.
    expect(link({ npcConnections: [{ neighbourNPCName: 'Felix' }] }).npcConnections[0].neighbourNPCName).toBe('Felix');
    // A tie with no npc rows has not been asked the question.
    expect(crossSettlementNpcPoolKey(link({ npcConnections: [] }))).toBeNull();
    expect(crossSettlementNpcPoolKey(link({}))).toBeNull();
  });

  it('the ENGAGEMENT pool takes faction rows only, and a nameless counterpart is silent', () => {
    // `RelationshipsTab.jsx` merges `conflict` and `faction_engagement` into one list; only
    // the second is what these variants describe (a quarrel between named HOUSES).
    expect(crossEngagementPoolKey({ type: 'conflict' })).toBeNull();
    expect(crossEngagementPoolKey({})).toBeNull();
    const eng = generalStateProse(TOWN, {
      crossEngagements: [
        { type: 'faction_engagement', factionName: 'The Guild', partnerSettlement: 'Thornmere' },
        { type: 'conflict', npcName: 'Mugain', partnerSettlement: 'Thornmere' },
      ],
    }, { seed: 'rel1', audience: 'dm' }).relationships.engagements;
    expect(eng).toHaveLength(2);
    expectSentence(eng[0]?.sentence, 'the faction engagement');
    expect(eng[1], 'a plain conflict drew an engagement sentence').toBeNull();
    // A link whose counterpart has no name fills nothing and drops every variant.
    expect(drawNet([{ relationshipType: 'allied' }])).toEqual([]);
  });
});

describe('DS-POP-3 — the direction of the roll, and the default it would have been', () => {
  const drawPop = (trend, access) => generalStateProse(TOWN,
    { populationTrend: trend, tradeRouteAccess: access }, { seed: 'pop3', audience: 'dm' })
    .overview.populationDirection?.sentence ?? null;

  it('ALL FIVE POOLS FIRE — the band\'s sign by the approach\'s width', () => {
    const cases = [
      ['RISING-OPEN', { band: 1, window: 5 }, 'road'],
      ['RISING-NARROW', { band: 2, window: 5 }, 'isolated'],
      ['LEVEL', { band: 0, window: 5 }, 'road'],
      ['FALLING-OPEN', { band: -1, window: 5 }, 'crossroads'],
      ['FALLING-NARROW', { band: -2, window: 5 }, 'mountain_pass'],
    ];
    for (const [key, trend, access] of cases) {
      expect(populationDirectionPoolKey(trend, access), key).toBe(key);
      expectSentence(drawPop(trend, access), key);
    }
    expect(cases.map(([k]) => k).sort()).toEqual(poolsOf('DS-POP-3').sort());
    // NARROW is DS-GEN-13's convention unchanged, driven on all three of its members.
    for (const narrow of ['isolated', 'mountain_pass', 'mountain_road']) {
      expect(populationDirectionPoolKey({ band: 1, window: 5 }, narrow), narrow).toBe('RISING-NARROW');
    }
    expect(populationDirectionPoolKey({ band: 1, window: 5 }, 'desert_road')).toBe('RISING-OPEN');
  });

  it('⛔⛔ THE WINDOW GATE — fewer than two readings is SILENCE, not LEVEL', () => {
    // `populationTrendBand` returns `{band: 0, window: 0}` for an EMPTY ring, and
    // `populationHistory` is 0 of 48 on a freshly generated town. Keyed on the sign alone,
    // LEVEL would print "the roll holds where it is" over EVERY town in EVERY world.
    const empty = populationTrendBand(undefined);
    expect(empty).toEqual({ band: 0, net: 0, window: 0 });
    expect(populationDirectionPoolKey(empty, 'road'), 'an unread ring resolved LEVEL').toBeNull();
    expect(drawPop(empty, 'road')).toBeNull();
    expect(populationDirectionPoolKey({ band: 0, window: 1 }, 'road')).toBeNull();
    // …and it DOES speak the moment the ring carries two readings.
    const two = populationTrendBand([100, 100]);
    expect(two.window).toBe(2);
    expectSentence(drawPop(two, 'road'), 'a two-reading ring');
    // A generated settlement really does carry no ring, which is what makes the gate live.
    const real = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' },
      null, { seed: 'sf-test-2026-04', customContent: {} },
    );
    expect(populationTrendBand(real.populationHistory).window,
      'a generated town now carries a trend ring — re-derive the gate').toBeLessThan(2);
    expect(real.name, 'the generator produced no settlement').toBeTruthy();
  });

  it('the band comes from the ANNEX\'S OWN READER and this desk computes none of it', () => {
    // "THIS IS DS-POP-2's READER, DELIBERATELY… keying this block on the same one keeps the
    // two POP blocks reading one band rather than two."
    const specs = importSpecifiers(src('src/domain/display/stateProse/generalStateProse.js'));
    expect(specs.length, 'the import extractor found nothing — the arm is vacuous').toBeGreaterThan(3);
    expect(specs.some((x) => x.includes('trendLens')),
      'the desk imports the trend reader instead of being handed its result').toBe(false);
    expect(specs.filter((x) => x.includes('worldPulse/')), 'the desk imports a worldPulse module')
      .toEqual([]);
    // The reader's thresholds are its own and are exercised through it, not transcribed.
    expect(populationTrendBand([100, 60]).band).toBeLessThan(0);
    expect(populationTrendBand([100, 160]).band).toBeGreaterThan(0);
    expect(populationTrendBand([100, 101]).band).toBe(0);
  });
});

/**
 * ⛔ DS-POP-1 AND DS-POP-2 ARE NOT MOUNTED, and both refusals are measured rather than tired.
 * DS-POP-2 carries an explicit corpus fence — "NO SURFACE — DO NOT WIRE A SELECTOR UNTIL A
 * DOSSIER POPULATION-TREND SURFACE EXISTS" — and that fence is still TRUE at this tip.
 * DS-POP-1 keys on a migration ledger that reaches no dossier tab at all.
 */
describe('⛔ DS-POP-1 and DS-POP-2 stay dark — a written fence and a ledger with no surface', () => {
  it('DS-POP-2\'s NO-SURFACE fence is current, not stale', () => {
    const annex = src('docs/content/RECEIPT_POOLS_DOSSIER_STATE.md');
    mustExtract(annex, 'NO SURFACE — DO NOT WIRE A SELECTOR UNTIL A DOSSIER POPULATION-TREND',
      'DS-POP-2\'s own fence');
    // The fence's premise: `buildTrendLenses` is consumed ONLY by WhatChangedPanel, which is
    // not a dossier tab. Measured here so the day a trend surface lands, this reds.
    expect(src('src/components/settlement/WhatChangedPanel.jsx')).toContain('buildTrendLenses');
    expect(UNMOUNTED_BLOCKS).toContain('DS-POP-2');
    expect(sentenceMountForBlock('DS-POP-2')).toBeNull();
  });

  it('DS-POP-1\'s migration ledger reaches no dossier tab', () => {
    // Its STATE-KEY is `spatialLedgers.migration` × demographic receipts × QUANTITY_BANDS ×
    // the BELIEVED band. `QUANTITY_BANDS` lives in a worldPulse herald, the receipts live in
    // the demographics kernels, and the block carries NO `sectionTarget` at all — so there
    // is no position on any tab that renders its evidence.
    expect(DOSSIER_STATE_PROSE_GENERAL['DS-POP-1'].sectionTarget).toBeUndefined();
    expect(src('src/domain/worldPulse/demographicsHerald.js')).toContain('export const QUANTITY_BANDS');
    expect(UNMOUNTED_BLOCKS).toContain('DS-POP-1');
    expect(sentenceMountForBlock('DS-POP-1')).toBeNull();
  });
});
