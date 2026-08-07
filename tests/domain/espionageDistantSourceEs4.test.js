/**
 * espionageDistantSourceEs4.test.js — ES-4: THE DISTANT SOURCE.
 *
 * docs/DESIGN_FP_ARCH_ES.md, the ES-4 charter and §5 seam row 6. This is the THIRD member
 * of the CR-WR10-H lighting discharge: SP-B minted the leg SURFACES, SP-B2 wired the SEAM
 * from those surfaces to the appraisal's own key spellings, and this wave proves the
 * SOURCE — that a court can hold those legs about a holding NO RUMOUR REACHES, because a
 * spy went and looked.
 *
 * ⭐ THIS FILE IS A DECLARED EVIDENCE ADDRESS. It is one of the three literal paths in
 * `EVIDENCE_FILE_ADDRESSES` in tests/lint/sovereigntyLightingContract.walker.test.js, and
 * the marker `ES-4-DISTANT-SOURCE-EVIDENCE` stands in ONE `it` TITLE below — never a
 * `describe` title, which is parsed and joined against by nothing. That walker's header
 * carries the nine clauses a carrying pin must satisfy and is the maintained copy of the
 * recipe; this file OBEYS it and does not restate it. Two consequences bind whoever edits
 * this file next:
 *   • THE MARKER IS A JOIN KEY, NOT A DESCRIPTION. Renaming it silently un-lights the
 *     `sovereigntyTradeEnabled` condition. The pin below asserts the token against the
 *     contract row's own `marker` field so a drift on either side reds here.
 *   • THIS FILE MAY NEVER PARK. The walker refuses a declared address that parks, so: no
 *     `.only` (focus is file-scope), no test generated from a loop, no `it.each` over a
 *     computed table, no options bag, no callback parameter, no `return`/`if`/`for`
 *     STATEMENT inside a `describe` block. A loop belongs INSIDE a named test, which is the
 *     estate's recorded idiom and the shape the one `for…of` below uses.
 *     ⚠ `.skip` IS THE EXCEPTION AND KNOWING WHICH KIND IT IS MATTERS — MEASURED at this
 *     landing: `it.skip` does NOT park the file, it costs only its own title. Harmless on
 *     any pin here EXCEPT the carrying one, where it silently deletes the evidence and
 *     un-lights the wave with every gate green.
 *
 * ── WHAT THE WAVE ACTUALLY CLAIMS, AND WHY THE FIXTURE IS SHAPED THIS WAY ───────────────
 * The CR-WR10-H trap one level up is a market lit on SURFACES WITHOUT SOURCES: every gate
 * green, every leg spelled, and a market that can only ever clear the holdings a court
 * already gossips about. The refutation has to be a DIFFERENTIAL, and a differential is
 * only worth anything when both sides run on the same road:
 *
 *   NEAR (`nearvale`) sits inside Ashford's relationship neighbourhood. The REAL belief
 *     road — `advanceBeliefMaps`, not a hand-written ledger — gives Ashford four legs
 *     about it and the appraisal prices it.
 *   FAR (`irontown`) sits outside that neighbourhood and outside every rumour ledger.
 *     The same road, at the same tick, gives Ashford NOTHING, and the appraisal refuses.
 *
 * THE TWO HOLDINGS ARE BYTE-IDENTICAL SETTLEMENTS, asserted below through the belief
 * layer's own `conditionsGroundTruth`. That is the anti-vacuity spine of the whole file:
 * the far holding is unpriced for an EPISTEMIC reason and for no other, so when the spy
 * comes home and the price appears, distance is the only thing that moved.
 *
 * ── THE FIVE SHIPPED VACUITY SHAPES, EACH REFUSED BY NAME ───────────────────────────────
 *   1. A FUNCTION AGAINST ITSELF — the differential is never "the reader returned nothing
 *      twice". Every absence here is measured beside a LIVE positive off the SAME call at
 *      the SAME tick: `beliefLegsOf` hands back four legs for NEAR in the same breath it
 *      hands back none for FAR.
 *   2. AN OPERATOR THAT PASSES ON EQUALITY — every CLAIM is an exact `toEqual`/`toBe` on
 *      both sides; no `toBeGreaterThan(0)` ever stands in for "it moved". The inequalities
 *      that do appear are anti-vacuity BOUNDS on the fixture (the gradient is non-trivial,
 *      the value is off its clamp), which is the opposite job, and they are strict.
 *   3. A CLAIM IN A HEADER THAT NO PIN IMPLEMENTS — every sentence above is asserted
 *      below, including the identical-ground-truth premise and the one-directional seam.
 *   4. TWO GUARDS OVER ONE JOB — the degraded arms are pinned one family at a time
 *      (conditions dark alone, then the whole axis family dark) so neither hides the other.
 *   5. CEILING SATURATION — the priced holding lands `value01` strictly inside 0..1 and a
 *      band strictly inside its ladder, asserted, so a later tuning that saturates this
 *      fixture reds HERE instead of quietly emptying the equalities.
 *
 * ── ONE NAMING POINT, STATED SO IT DOES NOT READ AS A MISMATCH ──────────────────────────
 * The lighting contract's ES-4 row says "through a completed CONFIRMATION MISSION". That is
 * the MISSION CLASS — the layer's own name for a covert confirmation mission, the DM verb
 * `DISPATCH_CONFIRMATION_MISSION` — and not the CONFIRM product. The product here is
 * ACQUIRE, because §3.6 makes ACQUIRE the one product that may CREATE a belief: a CONFIRM
 * with no prior has nothing to assert and refuses rather than materialising an opinion the
 * court never held. `unknown → known` at distance is therefore an acquire by construction,
 * and a later pin drives a following CONFIRM over the same distant pair so the class's own
 * verb is executed too rather than argued — its claim is that the price SURVIVES, because
 * that fixture's confidence lands on its clamp and a saturated rise proves nothing.
 *
 * ── WHAT THIS FILE DELIBERATELY IS NOT ──────────────────────────────────────────────────
 * It does not re-drive `advanceSovereigntyMarket`. SP-B2's own battery already EXECUTES
 * "the PRODUCTION reader clears the market end to end" through this same `beliefLegsOf`,
 * on beliefs the engine wrote; a second copy of that market fixture here would measure the
 * composer twice and the SOURCE — ES-4's actual subject — no better. The chain this file
 * owns is the one the contract row names: completed mission → belief record → `beliefLegsOf`
 * → `appraiseSettlementAsset`. JUDGMENT J-ES4-A, vetoable; the cost of a veto is a market
 * fixture whose settlements must satisfy both the demographic-pressure trigger and the
 * belief layer's conditions ground truth at once.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { litCovertWorld, mintCovertFixture } from '../helpers/covertMissionFixture.js';
import {
  advanceEnvoyErrands,
  beginEnvoyReturn,
  envoyErrandsOf,
  markEnvoyHome,
} from '../../src/domain/worldPulse/envoyErrand.js';
import { writeErrands } from '../../src/domain/worldPulse/envoyErrandLedger.js';
import { advanceBeliefMaps, beliefRecord } from '../../src/domain/worldPulse/beliefMap.js';
import { setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { CONDITIONS_KEYS, conditionsGroundTruth } from '../../src/domain/worldPulse/beliefAxisSubjects.js';
import { ENVOY_COVERT_LEG_REFS } from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import { LEG_SLOTS } from '../../src/domain/worldPulse/espionage/espionageProducts.js';
import { advanceEspionageProducts } from '../../src/domain/worldPulse/espionage/espionageProductStage.js';
import { beliefLegsOf } from '../../src/domain/worldPulse/sovereigntyMarketStage.js';
import {
  SOVEREIGNTY_VALUE_BANDS,
  appraiseSettlementAsset,
} from '../../src/domain/worldPulse/sovereigntyAppraisal.js';
import { SOVEREIGNTY_LIGHTING_EVIDENCE } from '../../src/domain/certification/warConvergenceContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ESPIONAGE_DIR = 'src/domain/worldPulse/espionage';
const SELF_REL = 'tests/domain/espionageDistantSourceEs4.test.js';

// ── The world ─────────────────────────────────────────────────────────────────
const HOME = 'ashford';
const WAYPOINT = 'westmarch';
const NEAR = 'nearvale';
const FAR = 'irontown';

/** The tick the mission is marked home — the mundane fold's exactly-once moment. */
const HOME_TICK = 40;

/**
 * ONE SETTLEMENT FACTORY FOR ALL FOUR COURTS, and that is the differential's foundation:
 * NEAR and FAR are the same town twice, so nothing about the far holding's WORTH can
 * explain why it is unpriced. The economy is rich enough for every rung of
 * `conditionsGroundTruth` to resolve — a fixture whose granary read `undefined` would
 * prove the appraisal refuses an empty record, which is a different and much smaller claim.
 * @param {string} id
 */
function town(id) {
  const name = `${id.charAt(0).toUpperCase()}${id.slice(1)}`;
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
      // MUNDANE AT EVERY END, ON PURPOSE. The magic pair gate would SEND each read the
      // moment it was taken, and a mission that reports by sending is not a mission that
      // came home. The whole gradient folds at the home mouth here, so "completed" is a
      // property of the journey rather than of a spell.
      config: { priorityMagic: 25, magicExists: false },
    },
  };
}

const ITEMS = [HOME, WAYPOINT, NEAR, FAR].map((id) => town(id));

/**
 * THE GEOGRAPHY IS THE CLAIM. `relationshipNeighbourhood` builds a court's declared
 * neighbourhood from these edges and the belief road seeds nothing outside it, so the
 * ABSENCE of a HOME↔FAR edge is precisely what "non-neighbour" means to this engine.
 * WAYPOINT↔FAR exists so the satellite really does hold an opinion for a passing agent to
 * overhear — the mission's own waypoint reads are not the claim, but a fixture where they
 * silently yielded nothing would leave the target read carrying the file alone.
 */
const SNAPSHOT = {
  settlements: ITEMS,
  byId: new Map(ITEMS.map((item) => [String(item.id), item])),
  regionalGraph: {
    edges: [
      { id: `edge.${HOME}.${WAYPOINT}`, from: HOME, to: WAYPOINT, relationshipType: 'neutral' },
      { id: `edge.${HOME}.${NEAR}`, from: HOME, to: NEAR, relationshipType: 'neutral' },
      { id: `edge.${WAYPOINT}.${FAR}`, from: WAYPOINT, to: FAR, relationshipType: 'neutral' },
    ],
  },
};

/** The three believed-conditions legs an ACQUIRE may be sent to fill, in the SUPPLY side's
 *  own spellings — SP-B's field names, which is the whole point of ⟨F5⟩'s closed set. */
const CONDITION_LEG_REFS = Object.freeze(['routePositionBand', 'storesBand', 'tierBand']);

/** Both axis families lit — the world SP-B2's seam was built for. */
const AXES_LIT = Object.freeze({ beliefAxesEnabled: true, believedConditionsEnabled: true });

/** One court's picture of one holding, read through the CONSUMER's own reader and priced
 *  by the CONSUMER's own leaf. This is the chain the ES-4 contract row names, and every
 *  arm below goes through this one function so no two pins can drift apart.
 *  @param {unknown} worldState @param {string} assetId */
function priceOf(worldState, assetId) {
  const legs = beliefLegsOf({ worldState, courtId: HOME, assetId });
  return { legs, appraisal: appraiseSettlementAsset({ assetId, appraiserId: HOME, ...legs }) };
}

/**
 * THE REAL BELIEF ROAD, RUN — never a hand-written `beliefMaps` ledger.
 *
 * `advanceBeliefMaps` is the estate's own rumour/belief advance. Its cold start seeds each
 * court's DECLARED NEIGHBOURHOOD to ground truth and its normal path feeds from
 * `rumorLedgers`; a court with neither an edge nor a ledger entry about a subject hears
 * nothing on either. Both passes are run so the far pair's silence is the road standing
 * still rather than the road not having started.
 * @param {Record<string, unknown>} worldState
 */
function runTheBeliefRoad(worldState) {
  const cold = advanceBeliefMaps({
    snapshot: SNAPSHOT, pressureIdx: null, worldState, tick: 11,
  });
  const seeded = cold.next ? setSpatialLedger(worldState, 'beliefMaps', cold.next) : worldState;
  const again = advanceBeliefMaps({
    snapshot: SNAPSHOT, pressureIdx: null, worldState: seeded, tick: 12,
  });
  return again.next ? setSpatialLedger(seeded, 'beliefMaps', again.next) : seeded;
}

/** The espionage product stage over this file's one world. */
function stage(worldState, tick) {
  return advanceEspionageProducts({
    worldState, tick, snapshot: SNAPSHOT, regionalGraph: SNAPSHOT.regionalGraph,
  });
}

/**
 * WALK ONE COVERT MISSION FROM THE MINT TO THE HOME MOUTH, through the PRODUCTION writers
 * at every step: `mintEnvoyErrand` (via the shared fixture), `advanceEnvoyErrands`,
 * `beginEnvoyReturn`, `markEnvoyHome`. Nothing here hand-shapes an errand row, so the
 * persistence DTO cannot drift out from under the file — ES-3's recorded discipline.
 *
 * Returns the world on BOTH sides of the mission plus the landing receipt, because every
 * claim in this file is a difference between those two worlds.
 *
 * `carryFrom` runs a SECOND mission into a world a first one already taught. The spent row
 * is retired through the errand ledger's OWN writer first: leaving it standing would put a
 * second row at state `home` with the same `homeTick`, and the mouth would fold the FIRST
 * mission's gradient a second time — which is exactly what the first cut of this file did,
 * and it read as a CONFIRM crossing an ACQUIRE's slots.
 *
 * @param {{rules?: Record<string, unknown>, legRefs?: ReadonlyArray<string>|null,
 *   product?: string, carryFrom?: Record<string, unknown>|null}} [options]
 */
function walkOneMission({
  rules = AXES_LIT, legRefs = CONDITION_LEG_REFS, product = 'acquire', carryFrom = null,
} = {}) {
  const covert = {
    demand: 'confirm',
    product,
    subjectId: FAR,
    ...(legRefs ? { legRefs: [...legRefs] } : {}),
    itinerary: [
      { face: 'covert', settlementId: WAYPOINT, stayTicks: 2 },
      { face: 'declared', settlementId: FAR, stayTicks: 2 },
    ],
  };
  const seed = carryFrom ? writeErrands(carryFrom, []) : litCovertWorld(rules);
  const { worldState: minted } = mintCovertFixture(
    /** @type {Record<string, unknown>} */ (seed), { covert },
  );
  const errandId = envoyErrandsOf(minted)[0].id;
  // The fresh path runs the belief road so the world starts with whatever rumour can give
  // it; the carry path starts from a world a mission already taught, and running the road
  // again there would decay the very row the second mission is about.
  const before = carryFrom ? minted : runTheBeliefRoad(minted);
  let state = before;
  for (let tick = 11; tick <= 30; tick += 1) {
    state = advanceEnvoyErrands({ worldState: state, tick }).worldState;
    state = stage(state, tick).worldState;
  }
  const returned = beginEnvoyReturn({
    worldState: state,
    errandId,
    routePlan: {
      legs: [{ fromId: FAR, toId: HOME, departTick: 31, arrivalTick: 34 }],
      expectedReturnTick: 34,
      routeRef: { id: 'road.north', name: 'North Road' },
    },
    tick: 30,
  });
  state = returned.worldState;
  for (let tick = 31; tick <= 39; tick += 1) {
    state = advanceEnvoyErrands({ worldState: state, tick }).worldState;
  }
  const home = markEnvoyHome({ worldState: state, errandId, tick: HOME_TICK });
  const gathered = envoyErrandsOf(home.worldState)[0].covert.gathered;
  const fold = stage(home.worldState, HOME_TICK);
  return {
    before,
    after: fold.worldState,
    errandId,
    gathered,
    returnReason: returned.reason,
    homeReason: home.reason,
    landing: fold.landings[0] || null,
    skipped: fold.skipped,
  };
}

/**
 * ⚠ THE SCAN READS THE CODE, NEVER THE PROSE — ES-3's battery records this lesson one file
 * over and this wave paid for it again. `espionageDoctrine.js`'s header NAMES
 * `sovereigntyAppraisal` as a geometry precedent, and the first cut of the seam scan below
 * read that sentence as the offence: a law stated in a comment is not the law being broken.
 * Comments come out first, and the planted mutants prove the stripped scan still bites.
 * @param {string} source
 */
const stripComments = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

/** Every source file in the espionage module set, keyed by its repo-relative path, with
 *  comments already stripped so every scan below reads code alone. */
function espionageSources() {
  /** @type {Record<string, string>} */
  const out = {};
  for (const entry of readdirSync(join(ROOT, ESPIONAGE_DIR))) {
    if (!entry.endsWith('.js')) continue;
    out[`${ESPIONAGE_DIR}/${entry}`] = stripComments(readFileSync(join(ROOT, ESPIONAGE_DIR, entry), 'utf8'));
  }
  return out;
}

/** Which sources name `word` as a whole word. The scan under test, as a function, so a
 *  PLANTED source can be driven through the identical reader. */
function namers(sources, word) {
  const probe = new RegExp(`\\b${word}\\b`);
  return Object.entries(sources)
    .filter(([, source]) => probe.test(source))
    .map(([file]) => file)
    .sort();
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('ES-4 — the distant source: a holding no rumour reaches, priced because a spy went', () => {
  it('GUARD THE GUARD: the two holdings are the SAME TOWN twice, so only distance can differ', () => {
    // Without this the whole file could be measuring a far holding that is unpriceable
    // because it is unreadable, which is a fixture accident wearing an epistemic claim.
    const near = conditionsGroundTruth(ITEMS[2].settlement);
    const far = conditionsGroundTruth(ITEMS[3].settlement);
    expect(near, 'the belief layer cannot read this fixture at all').not.toBeNull();
    expect(JSON.stringify(far), 'NEAR and FAR are not economically identical').toBe(JSON.stringify(near));
    // ...and the ground truth really carries the three rungs the appraisal will grade, so
    // a spy standing in the market has something to bring home.
    expect(Object.keys(far).sort()).toEqual([...CONDITIONS_KEYS].sort());
    // THE GEOGRAPHY: HOME neighbours NEAR and the WAYPOINT, and nothing joins it to FAR.
    const edges = SNAPSHOT.regionalGraph.edges.map((edge) => `${edge.from}>${edge.to}`);
    expect(edges).toContain(`${HOME}>${NEAR}`);
    // anchored: the live edge asserted one line above comes off the same array, so this absence is a missing edge rather than an empty graph
    expect(edges).not.toContain(`${HOME}>${FAR}`);
  });

  it('THE NON-NEIGHBOUR DIFFERENTIAL — the same road, the same tick: NEAR is priced, FAR is not', () => {
    // THE REAL BELIEF ROAD, not a hand-written ledger. Whatever it can give a court about
    // a holding at rumour range, it gives here.
    //
    // ⭐ AND THE MISSION IS MINTED BUT NEVER WALKED, WHICH IS THE POINT OF MINTING IT AT
    // ALL. This world holds a live covert errand aimed at FAR — dispatched, funded,
    // travelling — and the holding is STILL unpriced. What the market gets is not a court's
    // intention to find out; it is a mission that CAME HOME, which is the next pin.
    const { worldState } = mintCovertFixture(litCovertWorld(AXES_LIT), {
      covert: {
        demand: 'confirm',
        product: 'acquire',
        subjectId: FAR,
        legRefs: [...CONDITION_LEG_REFS],
        itinerary: [{ face: 'declared', settlementId: FAR, stayTicks: 2 }],
      },
    });
    const world = runTheBeliefRoad(worldState);

    // THE LIVE POSITIVE. Four legs, under the consumer's own keys, and a real price.
    const near = priceOf(world, NEAR);
    expect(Object.keys(near.legs).sort())
      .toEqual(['routeBand', 'storesBand', 'tierBand', 'trajectoryBand']);
    expect(near.appraisal.known, 'the belief road cannot price a NEIGHBOUR — the fixture is'
      + ' dead and every absence below would be meaningless').toBe(true);

    // THE ABSENCE, MEASURED IN THE SAME BREATH. Same reader, same world, same tick.
    const far = priceOf(world, FAR);
    expect(beliefRecord(world, HOME, FAR), 'the road wrote a row about the far holding')
      .toBeNull();
    expect(far.legs, 'a court out of rumour range holds no leg at all').toEqual({});
    expect(far.appraisal.known).toBe(false);
    expect(far.appraisal.value01, 'the honest answer is null, never zero').toBeNull();
    expect(far.appraisal.valueBand).toBe(SOVEREIGNTY_VALUE_BANDS[0]);
    // AND THE MARKET'S OWN SENTENCE FOR IT — the dead-lighting trap, in words: every gate
    // green, the surfaces all built, and this holding still cannot be bought or sold.
    expect(String(far.appraisal.receipt)).toContain('cannot price');
  });

  // ⭐ THE CARRYING PIN. The leading token is the join key `SOVEREIGNTY_LIGHTING_EVIDENCE`'s
  // ES-4 row declares and tests/lint/sovereigntyLightingContract.walker.test.js measures.
  // It must stand in THIS title — an `it` title, in THIS file — or the wave carries the
  // token and lights nothing.
  it('ES-4-DISTANT-SOURCE-EVIDENCE — a non-neighbour (court, holding) pair is priced known:true through a completed covert mission', () => {
    const walked = walkOneMission();

    // ── THE PREMISE: before the mission, this pair is out of reach. ──────────────
    const before = priceOf(walked.before, FAR);
    expect(beliefRecord(walked.before, HOME, FAR)).toBeNull();
    expect(before.legs).toEqual({});
    expect(before.appraisal.known).toBe(false);

    // ── THE MISSION COMPLETED — through the production writers, end to end. ──────
    expect(walked.returnReason).toBe('returning');
    expect(walked.homeReason, 'the mission never came home, so nothing below is a landing')
      .toBe('home');
    expect(walked.gathered.length, 'the agent gathered no gradient to bring home')
      .toBeGreaterThan(2);
    expect(walked.landing, 'the home mouth folded nothing').not.toBeNull();
    expect(walked.landing.reason).toBe('landed');
    expect(walked.landing.world, 'a mundane world folds at the mouth, which is what makes'
      + ' this a mission that CAME HOME rather than one that reported by magic').toBe('mundane');
    expect(walked.landing.product).toBe('acquire');
    expect(walked.landing.observerId).toBe(HOME);
    expect(walked.landing.subjectId).toBe(FAR);
    expect(walked.landing.legsFilled).toEqual([...CONDITION_LEG_REFS]);
    expect(walked.landing.legsUnfilled, 'a leg the belief substrate could not take').toEqual([]);
    expect([...walked.landing.familiesAbsent], 'a family was silently dropped').toEqual([]);
    expect(walked.landing.crossed).toEqual(['conditionsBands']);

    // ── THE SOURCE: the row exists now, and it is THIS mission's own write. ──────
    const record = beliefRecord(walked.after, HOME, FAR);
    expect(record, 'the product reported landed and wrote no row').not.toBeNull();
    expect(record.lastUpdateTick, 'the row is stamped with some other tick than the mouth')
      .toBe(HOME_TICK);
    expect(record.conditionsBands).toEqual({
      routePositionBand: 'established', storesBand: 'deep', tierBand: 'city',
    });

    // ── THE PRICE: four legs under the CONSUMER's keys, and a real valuation. ────
    const after = priceOf(walked.after, FAR);
    expect(after.legs).toEqual({
      tierBand: 'city', storesBand: 'deep', routeBand: 'established', trajectoryBand: 'steady',
    });
    expect(after.appraisal.known, 'THE WHOLE WAVE: a spy-fed court prices a distant holding')
      .toBe(true);
    expect(after.appraisal.valueBand).toBe('great');
    expect(after.appraisal.evidence.tierBand).toBe('city');
    expect(after.appraisal.evidence.storesBand).toBe('deep');
    expect(after.appraisal.evidence.routeBand).toBe('established');
    expect(after.appraisal.evidence.trajectoryBand).toBe('steady');

    // ── THE ANTI-VACUITY GUARDS ON THE CLAIM ITSELF ─────────────────────────────
    // CEILING SATURATION, refused: an appraisal pinned at a bound would satisfy these
    // equalities for any implementation. Both the scalar and the band are asserted to sit
    // strictly INSIDE their ranges, so a later tuning that saturates this fixture reds
    // here rather than emptying the pin.
    expect(after.appraisal.value01).toBeGreaterThan(0);
    expect(after.appraisal.value01).toBeLessThan(1);
    expect(SOVEREIGNTY_VALUE_BANDS.indexOf(after.appraisal.valueBand)).toBeGreaterThan(1);
    expect(SOVEREIGNTY_VALUE_BANDS.indexOf(after.appraisal.valueBand))
      .toBeLessThan(SOVEREIGNTY_VALUE_BANDS.length - 1);
    // AND THE MISSION TOUCHED EXACTLY ONE PAIR. The near holding's row is byte-identical
    // across the whole journey, so the price above is the spy's doing and not a belief
    // advance running underneath the fixture.
    expect(JSON.stringify(beliefRecord(walked.after, HOME, NEAR)))
      .toBe(JSON.stringify(beliefRecord(walked.before, HOME, NEAR)));
  });

  it('the marker in the pin above is the CONTRACT ROW\'s own join key, not a description', () => {
    const row = SOVEREIGNTY_LIGHTING_EVIDENCE.find((entry) => entry.wave === 'ES-4');
    expect(row, 'the lighting contract no longer declares an ES-4 row').toBeTruthy();
    expect(row.kind).toBe('TEST_MARKER');
    // Spelling the token in an `expect` ARGUMENT is exactly the position the walker's door 1
    // refuses, so this line names the marker without ever carrying it.
    expect(row.marker).toBe('ES-4-DISTANT-SOURCE-EVIDENCE');
    expect(row.supplies).toBe('SOURCE');
    // ...and it stands in EXACTLY ONE `it` title in this file. A second copy would make the
    // evidence surface ambiguous; zero copies would light nothing at all.
    const own = readFileSync(join(ROOT, SELF_REL), 'utf8');
    const carried = own.split(`it('${row.marker}`).length - 1;
    expect(carried, 'the marker is not the head of exactly one `it` title in this file')
      .toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('ES-4 — SP-B2\'s totality and degraded arms, re-run against espionage-fed rows', () => {
  it('THE FOUR-LEG TOTALITY on a spy-fed row: every leg the appraisal reads is supplied, and nothing else is', () => {
    const walked = walkOneMission();
    const { legs } = priceOf(walked.after, FAR);
    // THE AUTHORITY IS THE CONSUMER'S OWN RUNTIME SHAPE, measured rather than transcribed —
    // SP-B2's precedent, re-run here on a row no rumour produced.
    const declared = Object.keys(appraiseSettlementAsset({}).evidence);
    expect(declared.length, 'the appraisal declared no evidence shape at all').toBeGreaterThan(3);
    expect(Object.keys(legs).length, 'the spy supplied no legs to check').toBe(4);
    expect(Object.keys(legs).filter((key) => !declared.includes(key)),
      'a spy-fed leg is named by a key the appraisal never reads — it would degrade to'
      + " `'unknown'` silently").toEqual([]);
    // THE ROUTE RUNG IS THE TRAP, and it is SP-B2's table that springs it, not this wave's:
    // the spy writes `routePositionBand` and the appraisal asks for `routeBand`.
    expect(beliefRecord(walked.after, HOME, FAR).conditionsBands.routePositionBand)
      .toBe('established');
    expectAbsentWithAnchor(Object.keys(legs), 'routePositionBand', 'routeBand',
      'the rung a spy wrote arrives at the appraisal under the appraisal\'s own key');
    // AND `pullBand` IS STILL NOT A LEG. ⟨F5⟩ refuses it at the mint because SP-B's own
    // populations road feeds it and no espionage product can, so a spy-fed record is the
    // sharpest place to prove the exclusion survived the whole road.
    expectAbsentWithAnchor(Object.keys(legs), 'pullBand', 'tierBand',
      'the believed-conditions family is wider than the appraisal, and the table is the filter');
  });

  it('DEGRADED — believedConditionsEnabled dark: the SOURCE arrives, the SURFACES do not, and the receipt names the family', () => {
    const dark = walkOneMission({
      rules: { beliefAxesEnabled: true, believedConditionsEnabled: false },
    });
    // THE MISSION STILL RAN AND STILL LANDED — this is a degrade, not a failure, and the
    // difference is exactly what the SP-C idiom exists to keep visible.
    expect(dark.landing.reason).toBe('landed');
    expect(dark.landing.changed).toBe(true);
    expect(dark.landing.legsFilled).toEqual([]);
    expect(dark.landing.legsUnfilled, 'a dropped leg must be NAMED, never silently absent')
      .toEqual([...CONDITION_LEG_REFS]);
    expect([...dark.landing.familiesAbsent]).toEqual(['believedConditions']);
    expect(dark.landing.crossed).toEqual([]);
    // THE ROW EXISTS AND CARRIES NO CONDITIONS FAMILY.
    const record = beliefRecord(dark.after, HOME, FAR);
    expect(record, 'the degraded product wrote no row at all').not.toBeNull();
    expect(record.conditionsBands).toBeUndefined();
    // ...SO THE MARKET STILL CANNOT CLEAR. One leg is not a price.
    const priced = priceOf(dark.after, FAR);
    expect(priced.legs).toEqual({ trajectoryBand: 'steady' });
    expect(priced.appraisal.known).toBe(false);
    expect(priced.appraisal.value01).toBeNull();
    // BOTH SIDES LIVE, driven off the identical mission with one flag moved — without this
    // the arm above is a claim about a fixture that could never have supplied anything.
    const lit = walkOneMission();
    expect(lit.landing.legsFilled).toEqual([...CONDITION_LEG_REFS]);
    expect(priceOf(lit.after, FAR).appraisal.known).toBe(true);
  });

  it('DEGRADED — the whole axis family dark: a landed belief with no leg the appraisal can read', () => {
    // PINNED SEPARATELY FROM THE CLAUSE ABOVE, deliberately. Two guards over one job hide
    // each other, so the conditions family and the host axis family are each measured on
    // their own world: here the trajectory leg goes too, because `populationTrendBand` is
    // D-1's field and a dark axis fold never writes it.
    const dark = walkOneMission({
      rules: { beliefAxesEnabled: false, believedConditionsEnabled: false },
    });
    expect(dark.landing.reason).toBe('landed');
    expect([...dark.landing.familiesAbsent]).toEqual(['beliefAxes', 'believedConditions']);
    const record = beliefRecord(dark.after, HOME, FAR);
    expect(record).not.toBeNull();
    expect(record.populationTrendBand).toBeUndefined();
    expect(record.conditionsBands).toBeUndefined();
    const priced = priceOf(dark.after, FAR);
    expect(priced.legs, 'a dark axis world supplies the appraisal nothing whatever').toEqual({});
    expect(priced.appraisal.known).toBe(false);
  });

  it('THREE OF FOUR IS NOT A PRICE: each conditions leg alone lights its OWN appraisal key and no other', () => {
    // THE SEAM, MEASURED PER MEMBER RATHER THAN AS A SET. A mission sent for ONE leg must
    // light exactly the appraisal key that leg maps to — which is what makes the leg
    // vocabulary a real join and not three words that happen to travel together. The loop
    // runs INSIDE this named test (the estate's recorded idiom) so the file stays credited.
    const seen = [];
    for (const ref of CONDITION_LEG_REFS) {
      const one = walkOneMission({ legRefs: [ref] });
      expect(one.landing.legsFilled, `${ref} was not filled by a mission sent for it`)
        .toEqual([ref]);
      const priced = priceOf(one.after, FAR);
      const conditionKeys = Object.keys(priced.legs).filter((key) => key !== 'trajectoryBand');
      expect(conditionKeys.length, `${ref} lit ${conditionKeys.length} appraisal keys, not one`)
        .toBe(1);
      seen.push(conditionKeys[0]);
      // ...AND THE APPRAISAL REFUSES. Three legs of four is a guess, and a guess is not a
      // price — the strictest-reading rule, re-run on a spy-fed row.
      expect(priced.appraisal.known, `one leg priced ${FAR}`).toBe(false);
      expect(priced.appraisal.value01).toBeNull();
    }
    // THE THREE ARE DISTINCT, so no two legs are quietly the same key.
    expect(seen.sort()).toEqual(['routeBand', 'storesBand', 'tierBand']);
    // AND THE POSITIVE CONTROL: the same three legs TOGETHER do price the holding, so the
    // refusals above measure incompleteness rather than a leaf that never says yes.
    expect(priceOf(walkOneMission().after, FAR).appraisal.known).toBe(true);
  });

  it('THE `exports` LEG STILL HAS NO SLOT (STOP-ES3-1), and it costs the appraisal a price', () => {
    // ⛔ The one lawful legRef with no belief slot, carried all the way to the market: a
    // mission sent for it comes home having filled nothing, says so by name, and the
    // holding stays unpriced. Recorded here rather than left as a leaf-level fact, because
    // the market is where the cost of that stop is actually paid.
    const walked = walkOneMission({ legRefs: ['exports'] });
    expect(walked.landing.legsUnfilled).toEqual(['exports']);
    expect(walked.landing.legsFilled).toEqual([]);
    expect(LEG_SLOTS.exports, 'the leg grew a slot — STOP-ES3-1 is closed and this pin'
      + ' should become a positive').toBeNull();
    expect(priceOf(walked.after, FAR).appraisal.known).toBe(false);
  });

  it('A FOLLOWING CONFIRM ON THE SAME DISTANT PAIR KEEPS THE PRICE — the class\'s own verb, executed', () => {
    // The mission CLASS is confirmation; the first product had to be ACQUIRE because only
    // ACQUIRE may create a belief. Once the court holds one, the class's own verb works at
    // distance too — and this is the pin that says so rather than the header arguing it.
    const acquired = walkOneMission();
    const first = priceOf(acquired.after, FAR);
    const firstRecord = beliefRecord(acquired.after, HOME, FAR);
    expect(first.appraisal.known).toBe(true);

    const confirmed = walkOneMission({
      product: 'confirm', legRefs: null, carryFrom: acquired.after,
    });
    // The second mission is the ONLY row the mouth folds — the first was retired through
    // the ledger's own writer, so this landing cannot be the acquire's echo.
    expect(envoyErrandsOf(confirmed.after)).toHaveLength(1);
    expect(confirmed.landing.product).toBe('confirm');
    expect(confirmed.landing.reason, 'a CONFIRM with a prior has something to assert')
      .toBe('landed');
    expect(confirmed.landing.crossed, 'a CONFIRM crosses no observed slot — it asserts the'
      + ' value the court already holds').toEqual([]);
    // THE CLAIM THIS PIN OWNS: the price SURVIVES a second mission. A CONFIRM re-anchors
    // every numeric attribute toward a fidelity-degraded truth, so "nothing moves" is false
    // and "the legs survive" is the thing actually at risk.
    const second = priceOf(confirmed.after, FAR);
    expect(second.appraisal.known, 'the confirm cost the court its price').toBe(true);
    expect(second.legs).toEqual(first.legs);
    expect(second.appraisal.valueBand).toBe(first.appraisal.valueBand);
    const secondRecord = beliefRecord(confirmed.after, HOME, FAR);
    expect(secondRecord.lastUpdateTick, 'the row was not re-stamped, so nothing landed')
      .toBe(HOME_TICK);
    expect(secondRecord.confidence01).toBeGreaterThan(firstRecord.confidence01);
    // ⚠ AND THE LIMIT OF THAT INEQUALITY, STATED RATHER THAN ASSERTED PAST. On this fixture
    // the confirm lands EXACTLY on `confidence01`'s clamp — MEASURED, and the anti-vacuity
    // guard that was written here first is what found it. A rise to a bound is true for a
    // correct fold and for any implementation that simply writes 1, so this pin is NOT
    // evidence about the fold's arithmetic and does not pretend to be. It catches the
    // regression it can see: a confirm that LOWERED or dropped the court's certainty. The
    // arithmetic itself is pinned where it has headroom — tests/domain/espionageProducts.
    // test.js folds at a 0.2 prior for precisely this reason, and says so.
    expect(secondRecord.confidence01, 'the fixture stopped saturating — the inequality above'
      + ' has become a real measurement and this row should say so').toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('ES-4 — seam 5: the axis vocabulary flows ONE WAY, from SP-B into the market', () => {
  it('THE AXIS-DRIFT SCAN: no espionage module names an APPRAISAL-ONLY key — and the scan REDS on a plant', () => {
    const sources = espionageSources();
    // ANTI-VACUITY FIRST: the corpus is real and holds the two modules that actually write.
    expect(Object.keys(sources).length).toBeGreaterThanOrEqual(7);
    expect(Object.keys(sources)).toContain(`${ESPIONAGE_DIR}/espionageProducts.js`);
    expect(Object.keys(sources)).toContain(`${ESPIONAGE_DIR}/espionageProductStage.js`);
    // THE FORBIDDEN SET IS DERIVED FROM TWO LIVE TABLES, never transcribed: the keys the
    // appraisal reads MINUS the keys the belief side owns. What remains is the consumer's
    // private spelling, and an espionage module writing one of them would put a rung on a
    // key `beliefLegsOf` never forwards — a leg that reads `'unknown'` with every gate green.
    const appraisalOnly = Object.keys(appraiseSettlementAsset({}).evidence)
      .filter((key) => !CONDITIONS_KEYS.includes(key));
    expect(appraisalOnly, 'the derivation produced nothing to forbid').toContain('routeBand');
    expect(appraisalOnly).toContain('trajectoryBand');
    for (const key of appraisalOnly) {
      expect(namers(sources, key), `an espionage module spells the consumer key ${key}`)
        .toEqual([]);
    }
    // THE MUTANT, EXECUTED. The identical scan over a source that DOES spell the consumer
    // key must name it — a boundary nobody can see being crossed is a boundary nobody keeps.
    const planted = {
      ...sources,
      [`${ESPIONAGE_DIR}/espionageProducts.js`]: 'export const leg = { routeBand: 1 };',
    };
    expect(namers(planted, 'routeBand')).toEqual([`${ESPIONAGE_DIR}/espionageProducts.js`]);
  });

  it('THE SEAM IS ONE-DIRECTIONAL: the espionage set imports NOTHING from the market or the appraisal', () => {
    // The structural half of seam 5, and it is TOTAL rather than a word list: a source that
    // cannot reach the consumer's module cannot borrow its ladders, cannot re-validate
    // against them, and cannot mint a second answer to what a rung is. J-TR-2's zero-import
    // precedent, one seam over.
    const sources = espionageSources();
    const consumers = ['sovereigntyAppraisal.js', 'sovereigntyMarketStage.js'];
    for (const consumer of consumers) {
      expect(namers(sources, consumer.replace('.js', '')),
        `an espionage module reaches into ${consumer} — the supply is importing its consumer`)
        .toEqual([]);
    }
    // THE POSITIVE HALF, which is what makes the negative above a boundary and not a void:
    // the rungs a product writes come from the belief layer's OWN derivation, spelled in
    // exactly one espionage module.
    expect(namers(sources, 'conditionsGroundTruth'))
      .toEqual([`${ESPIONAGE_DIR}/espionageProductStage.js`]);
    // THE MUTANT, EXECUTED, on the same reader.
    const planted = {
      ...sources,
      [`${ESPIONAGE_DIR}/espionageTap.js`]:
        "import { SOVEREIGNTY_ROUTE_BANDS } from '../sovereigntyAppraisal.js';\nexport const x = SOVEREIGNTY_ROUTE_BANDS;",
    };
    expect(namers(planted, 'sovereigntyAppraisal'))
      .toEqual([`${ESPIONAGE_DIR}/espionageTap.js`]);
  });

  it('THE RUNG WORDS ARE NOT SPELLED IN THE ESPIONAGE SET, and the ONE collision is named rather than excused', () => {
    // The value half of seam 5. A product that hand-spelled `'established'` would be
    // writing a rung the belief layer did not derive, and the two would drift the first
    // time a ladder moved.
    const sources = espionageSources();
    const rungs = ['trace', 'stirring', 'steady', 'established', 'bare', 'thin', 'stocked',
      'deep', 'shunned', 'overlooked', 'sought', 'coveted', 'thorp', 'hamlet', 'village',
      'town', 'city', 'metropolis'];
    const quoted = (source, word) => new RegExp(`['"]${word}['"]`).test(source);
    const spellers = [];
    for (const rung of rungs) {
      for (const [file, source] of Object.entries(sources)) {
        if (quoted(source, rung)) spellers.push(`${file}:${rung}`);
      }
    }
    expect(spellers, 'an espionage module spells a conditions rung of its own').toEqual([]);
    // ⚠ THE ONE MEASURED COLLISION, DECLARED RATHER THAN SWEPT UNDER THE LIST ABOVE.
    // `'none'` IS a member of the route ladder AND the fallback of `foreignTieBand`, a
    // different vocabulary that happens to share an English word. It is pinned as an EXACT
    // pair — this file, this word, this count — so a SECOND occurrence anywhere in the set
    // reds, which an exemption for the word would not have done.
    const noneSpellers = Object.entries(sources)
      .filter(([, source]) => quoted(source, 'none'))
      .map(([file]) => file)
      .sort();
    expect(noneSpellers, 'a second espionage module spells the word — re-measure it before'
      + ' widening this row, because the route ladder owns that rung too')
      .toEqual([`${ESPIONAGE_DIR}/espionageMissions.js`]);
    const collisions = (readFileSync(join(ROOT, ESPIONAGE_DIR, 'espionageMissions.js'), 'utf8')
      .match(/['"]none['"]/g) || []).length;
    expect(collisions, 'the foreignTieBand fallback grew a sibling').toBe(1);
    // THE MUTANT, EXECUTED: the rung scan really bites.
    const planted = { ...sources, [`${ESPIONAGE_DIR}/espionageProducts.js`]: "const b = 'established';" };
    expect(Object.entries(planted).filter(([, source]) => quoted(source, 'established')).map(([f]) => f))
      .toEqual([`${ESPIONAGE_DIR}/espionageProducts.js`]);
  });

  it('THE LEG VOCABULARY IS A JOIN, both sides measured: every conditions legRef reaches a real appraisal key', () => {
    // ⟨F5⟩'s closed six-member set, `LEG_SLOTS`'s total table, `CONDITIONS_KEYS` and the
    // appraisal's own evidence shape are FOUR live tables, and this is the one place they
    // are asked to agree. A leg that named a slot the belief side does not own, or a slot
    // the appraisal never reads, would be a dead vocabulary member.
    const conditionLegs = [...ENVOY_COVERT_LEG_REFS]
      .filter((ref) => LEG_SLOTS[ref] && LEG_SLOTS[ref].family === 'conditions')
      .sort();
    expect(conditionLegs, 'the conditions half of the leg vocabulary emptied')
      .toEqual([...CONDITION_LEG_REFS].sort());
    for (const ref of conditionLegs) {
      expect(CONDITIONS_KEYS, `${ref} names a slot the belief side does not own`)
        .toContain(LEG_SLOTS[ref].slot);
    }
    // AND THE ONE CONDITIONS KEY NO LEG MAY NAME. `pullBand` is SP-B's populations road and
    // no espionage product can fill it, so admitting it would mint a dead member.
    expectAbsentWithAnchor(conditionLegs, 'pullBand', 'tierBand',
      'the leg vocabulary is narrower than the belief family, by rule');
    expect(CONDITIONS_KEYS, 'the excluded key vanished from the belief family — re-argue the'
      + ' exclusion before deleting this row').toContain('pullBand');
  });
});
