/**
 * espionageProducts.test.js — ES-3: the tap ladder, the three typed products, the gradient
 * and the two landing worlds.
 *
 * WHAT THIS FILE REFUSES TO DO, each because it is a recorded way a pin ships vacuous:
 *
 *   1. IT NEVER ASSERTS A LAW THAT ONLY HOLDS ON EQUALITY. The never-purer-than-access law
 *      is measured at inputs where the inequality is STRICT — the declared-face target
 *      visit, and the poisoned waypoint — because at an honest waypoint the three taps
 *      agree numerically BY DESIGN and a matrix built there would prove nothing while
 *      reading like a proof.
 *   2. IT NEVER DRIVES A HAND-BUILT ERRAND. Every gradient below rides a row minted through
 *      `mintEnvoyErrand` and read back out of the ledger (tests/helpers/covertMissionFixture),
 *      so the persistence DTO cannot drift out from under the file.
 *   3. IT NEVER PROVES THE WRITER BOUNDARY BY READING THE SOURCE ONCE. The scan that says
 *      no espionage module imports `applyBeliefOverrides` is run against a PLANTED source
 *      that does, and must red — a boundary nobody can see being crossed is a boundary
 *      nobody is keeping.
 *   4. IT NEVER SPLITS AN ERRAND ID. Real ids carry dots, colons and pipes; every join here
 *      is by whole-string equality or by reconstruction.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { expectRungBelowBandTop } from '../helpers/bandSaturation.js';
import { litCovertWorld, mintCovertFixture } from '../helpers/covertMissionFixture.js';
import {
  advanceEnvoyErrands,
  beginEnvoyReturn,
  envoyErrandsOf,
  markEnvoyHome,
} from '../../src/domain/worldPulse/envoyErrand.js';
import { normalizeErrand } from '../../src/domain/worldPulse/envoyErrandRecords.js';
import {
  ENVOY_COVERT_LEG_REFS,
  ENVOY_COVERT_TAPS,
  MAX_COVERT_DWELL_RESAMPLES,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import { CONDITIONS_KEYS } from '../../src/domain/worldPulse/beliefAxisSubjects.js';
import { beliefRecord, reconcileBelief } from '../../src/domain/worldPulse/beliefMap.js';
import { ESPIONAGE_TUNING, MISSION_GRADES, TAP_LEVELS } from '../../src/domain/worldPulse/espionage/espionageMath.js';
import {
  TAP_RECEIPTS,
  TAP_TUNING,
  accuracyCapFor,
  flawDistortion,
  hostileRung01,
  perfPoison01,
  recordStaleness01,
  standoffRead,
  tapLevelFor,
  tapReceiptFor,
} from '../../src/domain/worldPulse/espionage/espionageTap.js';
import {
  LEG_SLOTS,
  PRODUCT_TUNING,
  buildProductReport,
  freshMissionGradeFor,
  gatheringAnchorTick,
  landableGatherings,
  observedReadAt,
  productGroundTruth,
} from '../../src/domain/worldPulse/espionage/espionageProducts.js';
import {
  advanceEspionageProducts,
  standoffDecisionFor,
} from '../../src/domain/worldPulse/espionage/espionageProductStage.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ESPIONAGE_DIR = 'src/domain/worldPulse/espionage';

// ── The world the battery runs in ──────────────────────────────────────────────
/** A settlement carrying enough economy for SP-B's conditions ground truth to resolve. */
function town(id, name, extra = {}) {
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
      config: { ...extra },
    },
  };
}

/** A settlement whose magic axis says magic does NOT work — the mundane arm's fixture. */
const MUNDANE_AXIS = Object.freeze({ priorityMagic: 25, magicExists: false });

const MAGIC_SNAPSHOT = Object.freeze({
  settlements: [town('ashford', 'Ashford'), town('westmarch', 'Westmarch'), town('irontown', 'Irontown')],
});
const MUNDANE_SNAPSHOT = Object.freeze({
  settlements: [
    town('ashford', 'Ashford', MUNDANE_AXIS),
    town('westmarch', 'Westmarch', MUNDANE_AXIS),
    town('irontown', 'Irontown', MUNDANE_AXIS),
  ],
});
const HOSTILE_GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'hostile' }],
});
const FRIENDLY_GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'allied' }],
});

/** Westmarch's belief about Irontown — the thing a covert visitor at Westmarch overhears. */
const HOST_BELIEF = Object.freeze({
  readiness: 0.4,
  strengthBand: 3,
  allianceLabel: 'rival',
  faithLabel: 'The Anvil',
  confidence01: 0.8,
  lastUpdateTick: 11,
  conditionsBands: { routePositionBand: 'trace', storesBand: 'deep', tierBand: 'town' },
});

/** Ashford's own (stale, wrong) prior about Irontown — what a REFUTE has to break. */
const HOME_PRIOR = Object.freeze({
  readiness: 0.1,
  strengthBand: 0,
  allianceLabel: 'allied',
  faithLabel: null,
  confidence01: 0.7,
  lastUpdateTick: 9,
});

function withBeliefs(worldState, { host = HOST_BELIEF, home = null } = {}) {
  return {
    ...worldState,
    spatialLedgers: {
      beliefMaps: {
        ...(host ? { westmarch: { seat: { irontown: host } } } : {}),
        ...(home ? { ashford: { seat: { irontown: home } } } : {}),
      },
    },
  };
}

const AXES_LIT = Object.freeze({ beliefAxesEnabled: true, believedConditionsEnabled: true });

/** One covert mission, seeded beliefs, ready to walk. */
function mission({
  rules = AXES_LIT, covert = null, host = HOST_BELIEF, home = null, legs = undefined,
} = {}) {
  const { worldState, errand } = mintCovertFixture(litCovertWorld(rules), {
    covert, ...(legs ? { legs } : {}),
  });
  return { worldState: withBeliefs(worldState, { host, home }), errand };
}

// ── The three-stop world the STANDOFF is reachable in ──────────────────────────
/**
 * ⚠ THE STANDOFF WAS UNREACHABLE AT EVERY EARLIER FIXTURE, AND THE REASON IS ARITHMETIC.
 * `assessedRisk` is `catch01 x clusterHostility01 x flawDistortion`, and in the two-stop
 * world above the only stop AHEAD of the waypoint is the target, which carries no hostile
 * edge — so `clusterHostility01` was 0 and the product was 0 at every input. A term that can
 * only ever be zero is not an unpinned arm, it is an unreachable one, and a battery cannot
 * tell the difference between the two by staying green.
 *
 * This world fixes each factor by name: a THIRD stop so the approach is measured over a
 * genuinely hostile remainder AND the leg stack is at its second rung, a well-policed target
 * (`safetyProfile.safetyRatio` is the security lever `readCorruptionClimate` actually reads,
 * off the ITEM rather than the settlement), and a FRIENDLY waypoint so the integrity term
 * does not quietly raise the bar out of reach.
 */
function policedTown(id, name) {
  return { ...town(id, name), safetyProfile: { safetyRatio: 2.5 } };
}
const STANDOFF_SNAPSHOT = Object.freeze({
  settlements: [
    town('ashford', 'Ashford'),
    town('westmarch', 'Westmarch'),
    policedTown('harrowgate', 'Harrowgate'),
    policedTown('irontown', 'Irontown'),
  ],
});
const STANDOFF_GRAPH = Object.freeze({
  edges: [
    { from: 'ashford', to: 'westmarch', relationshipType: 'allied' },
    { from: 'ashford', to: 'harrowgate', relationshipType: 'hostile' },
    { from: 'ashford', to: 'irontown', relationshipType: 'hostile' },
  ],
});
const STANDOFF_LEGS = Object.freeze([
  { fromId: 'ashford', toId: 'westmarch', departTick: 10, arrivalTick: 12 },
  { fromId: 'westmarch', toId: 'harrowgate', departTick: 20, arrivalTick: 22 },
  { fromId: 'harrowgate', toId: 'irontown', departTick: 30, arrivalTick: 32 },
]);
const STANDOFF_COVERT = Object.freeze({
  demand: 'confirm',
  product: 'confirm',
  subjectId: 'irontown',
  itinerary: [
    { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
    { face: 'covert', settlementId: 'harrowgate', stayTicks: 2 },
    { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
  ],
});
const TIMID_NPC = Object.freeze({ personality: { dominant: 'cowardly', flaw: 'timid' } });
const BOLD_NPC = Object.freeze({ personality: { dominant: 'bold' } });

// ── 1. THE WRITER BOUNDARY (J-ES-5) ────────────────────────────────────────────
describe('ES-3 the writer boundary — the products ride reconcileBelief, never the plant road', () => {
  /**
   * ⚠ THE SCAN READS THE CODE, NEVER THE PROSE. Two of these headers STATE the boundary in
   * words that name the forbidden symbol, and a raw scan would read the law itself as the
   * offence — the envoyErrandLedger single-writer walker records the same lesson. Comments
   * are stripped first, and the plant below proves the stripped scan still bites.
   */
  const stripComments = (source) => source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  /** The scan under test, as a function so a PLANTED source can be run through it. */
  function overrideImporters(sources) {
    return Object.entries(sources)
      .filter(([, source]) => /\bapplyBeliefOverrides\b/.test(stripComments(source)))
      .map(([file]) => file)
      .sort();
  }

  function espionageSources() {
    /** @type {Record<string, string>} */
    const out = {};
    for (const entry of readdirSync(join(ROOT, ESPIONAGE_DIR))) {
      if (!entry.endsWith('.js')) continue;
      out[`${ESPIONAGE_DIR}/${entry}`] = readFileSync(join(ROOT, ESPIONAGE_DIR, entry), 'utf8');
    }
    return out;
  }

  test('NO espionage module names applyBeliefOverrides — and the scan REDS on a plant', () => {
    const sources = espionageSources();
    // ANTI-VACUITY FIRST: the corpus is real and the module set is the one that matters.
    expect(Object.keys(sources).length).toBeGreaterThanOrEqual(7);
    expect(Object.keys(sources)).toContain(`${ESPIONAGE_DIR}/espionageProducts.js`);
    expect(Object.keys(sources)).toContain(`${ESPIONAGE_DIR}/espionageProductStage.js`);
    // THE CLAIM.
    expect(overrideImporters(sources)).toEqual([]);
    // THE MUTANT, EXECUTED: the same scan over a source that DOES take the plant road must
    // name it. `PAID_PLANT_OVERRIDE_KEYS` is an exact six-key envelope that would silently
    // reject an axis payload, so a product landing there would look landed and write nothing.
    const planted = {
      ...sources,
      [`${ESPIONAGE_DIR}/espionageProducts.js`]: [
        "import { applyBeliefOverrides } from '../disinformationPlant.js';",
        'export const x = applyBeliefOverrides;',
      ].join('\n'),
    };
    expect(overrideImporters(planted)).toEqual([`${ESPIONAGE_DIR}/espionageProducts.js`]);
  });

  test('the ES module set writes NO ladder state, and only ONE of them writes the ledger', () => {
    const sources = espionageSources();
    // §3.14's ladder handoff is a READ consumed by the ladder's own maintenance; the ES set
    // writes none of it.
    //
    // ⭐ ES-5c REPAIRED THIS SCAN, AND THE REPAIR IS THIS PACKET'S ONE PREVENTION GUARD.
    // As shipped it forbade `writeNpcLadder`, `setLadderState` and `npcLadderState =` —
    // MEASURED: all three exist NOWHERE in src/, and the third could not even match the
    // module's own import line because it requires an `=` after the token. Meanwhile the
    // ladder's REAL persistence spelling went entirely unguarded, so an espionage leaf
    // writing ladder state the way the ladder actually writes it left this assertion GREEN.
    // ES-3's registry docstring cites this pin as PROOF of the boundary, and ES-5c opens the
    // first espionage→ladder import direction in the repo — the guard stops being theoretical
    // in exactly the commit that makes it matter, so it is made real here rather than later.
    // Comments are stripped for the same reason the sibling scans strip them: the headers of
    // this boundary STATE the law in words, and a raw scan would read the law as the offence.
    const LADDER_WRITE_RE = new RegExp(
      // the real writer/remover, keyed on the ledger name it addresses
      String.raw`\b(?:set|drop)SpatialLedger\s*\([^;]{0,160}?['"]npcLadder['"]`
      // …and a direct mutation of the ledger slot, which would bypass the writer entirely
      + String.raw`|\bspatialLedgers\s*(?:\.\s*npcLadder\b|\[\s*['"]npcLadder['"]\s*\])\s*=`,
    );
    const ladderWritersOf = (set) => Object.entries(set)
      .filter(([, source]) => LADDER_WRITE_RE.test(stripComments(source)))
      .map(([file]) => file)
      .sort();
    expect(ladderWritersOf(sources)).toEqual([]);
    // NON-VACUITY, ARM BY ARM — a guard that cannot be reddened is not a guard, and an
    // alternative no plant reaches is an UNPINNED alternative. Each planted source carries
    // one real way to write the ladder's ledger, and each must be named.
    for (const [label, plant] of [
      ['the writer', "setSpatialLedger(worldState, 'npcLadder', next);"],
      ['the remover', "dropSpatialLedger(worldState, 'npcLadder');"],
      ['a direct slot mutation', "worldState.spatialLedgers.npcLadder = next;"],
      ['a computed slot mutation', "worldState.spatialLedgers['npcLadder'] = next;"],
    ]) {
      const planted = { ...sources, [`${ESPIONAGE_DIR}/espionageCareer.js`]: plant };
      expect(ladderWritersOf(planted), `the scan is blind to ${label}`)
        .toEqual([`${ESPIONAGE_DIR}/espionageCareer.js`]);
    }
    // …and the stripping really is what lets the honest headers stand: the SAME text inside a
    // comment must NOT convict, or every module that documents the boundary indicts itself.
    const commented = { ...sources, [`${ESPIONAGE_DIR}/espionageCareer.js`]: "// setSpatialLedger(worldState, 'npcLadder', next);" };
    expect(ladderWritersOf(commented), 'a comment naming the writer was read as a write').toEqual([]);
    // §1's single-amender census: exactly one espionage module routes the errand ledger's
    // own writer, and it is the product stage. A second amender is a second answer to what
    // a mission learned.
    const amendersOf = (set) => Object.entries(set)
      .filter(([, source]) => /\bwriteErrands\b/.test(stripComments(source)))
      .map(([file]) => file)
      .sort();
    expect(amendersOf(sources)).toEqual([`${ESPIONAGE_DIR}/espionageProductStage.js`]);
    // NON-VACUITY for that scan: the name it looks for really is spellable and really is
    // absent from the rest of the set, which the plant proves.
    const plantedSecond = { ...sources, [`${ESPIONAGE_DIR}/espionageGauntlet.js`]: 'writeErrands(w, r);' };
    expect(amendersOf(plantedSecond)).toHaveLength(2);
  });
});

// ── 2. THE TAP LADDER (owner addition H, J-ES-16) ──────────────────────────────
describe('ES-3 the tap ladder — a spy never reports purer than his access', () => {
  test('the tap is DERIVED from presence, and fails closed to the shallowest rung', () => {
    expect(tapLevelFor({ face: 'covert', hasInsideAsset: false })).toBe('beliefs');
    expect(tapLevelFor({ face: 'covert', hasInsideAsset: true })).toBe('delta');
    expect(tapLevelFor({ face: 'declared', hasInsideAsset: true })).toBe('performance');
    // The standoff NEVER enters, so it never taps deeper — addition H's own ruling, and it
    // beats BOTH the covert face and a live asset.
    expect(tapLevelFor({ face: 'covert', hasInsideAsset: true, standoff: true })).toBe('performance');
    // Fail-closed on garbage: a malformed stop must not buy access nobody had.
    for (const face of [undefined, null, '', 'secret', 42, {}]) {
      expect(tapLevelFor({ face, hasInsideAsset: true })).toBe('performance');
    }
    // Every rung the tap can return is a rung the persistence DTO admits — and it is the
    // SAME FROZEN ARRAY, not a copy of it, so the arithmetic and the normalizer can never
    // disagree about what a tap may be. ES-3 moved the mint to the errand vocabulary for
    // exactly the reason ES-1 moved the demand bands: the row's DTO matches against it.
    expect([...TAP_LEVELS].sort()).toEqual(['beliefs', 'delta', 'performance']);
    expect(TAP_LEVELS).toBe(ENVOY_COVERT_TAPS);
    // The gradient's rooted cap is the same one number on both sides for the same reason.
    expect(ESPIONAGE_TUNING.DWELL_RESAMPLE_CAP).toBe(MAX_COVERT_DWELL_RESAMPLES);
  });

  test('THE ASSET-LESS DELTA NEGATIVE: no arrangement of the other inputs reaches delta', () => {
    // anchored: the positive one line up returns 'delta' for the SAME face with the asset
    // live, so this absence is a property of the asset term and not of a dead function.
    expect(tapLevelFor({ face: 'covert', hasInsideAsset: true })).toBe('delta');
    const reached = [];
    for (const face of ['covert', 'declared']) {
      for (const standoff of [true, false, undefined]) {
        for (const hasInsideAsset of [false, undefined, null, 'true', 1]) {
          reached.push(tapLevelFor({ face, standoff, hasInsideAsset }));
        }
      }
    }
    // ⚠ THE MARKER MUST SIT ON THE LINE IMMEDIATELY ABOVE — the anchor walker's own
    // documented edge, and a two-line reason above this assertion left it un-anchored.
    // anchored: the next line pins `reached`'s exact value SET, and the positive at the top of this test returns 'delta' for the same call with the asset live
    expect(reached).not.toContain('delta');
    expect(new Set(reached)).toEqual(new Set(['beliefs', 'performance']));
  });

  test('THE MATRIX: performance is STRICTLY below the entered taps where the law bites', () => {
    const at = (tap, extra = {}) => accuracyCapFor({
      tap, hostConfidence01: 1, staleness01: 1, poison01: 0, ...extra,
    });
    // (1) AT THE TARGET. A declared-face visit reads the target's SELF-performance —
    //     paraded granaries — and caps at PERF_SELF_CAP; an entered agent caps at 1.0.
    expect(at('performance', { isTarget: true })).toBe(ESPIONAGE_TUNING.PERF_SELF_CAP);
    expect(at('beliefs', { isTarget: true })).toBe(1);
    expect(at('delta', { isTarget: true })).toBe(1);
    expect(at('performance', { isTarget: true })).toBeLessThan(at('beliefs', { isTarget: true }));
    // (2) AT A POISONED WAYPOINT. The poison discounts the TOLD version only.
    const poisoned = { poison01: 0.8 };
    expect(at('performance', poisoned)).toBeLessThan(at('beliefs', poisoned));
    // BOTH SIDES OF THE POISON TERM ARE LIVE, and the honest case is stated as the design
    // rather than smuggled: a truthful court tells you what it believes.
    expect(at('performance')).toBe(at('beliefs'));
    expect(at('performance', poisoned)).toBeLessThan(at('performance'));
    // (3) THE SECONDHAND CAP IS THE CEILING AWAY FROM THE TARGET, and its two terms both
    //     move the answer, so neither is a constant.
    expect(at('beliefs')).toBe(ESPIONAGE_TUNING.SECONDHAND_CAP);
    expect(at('beliefs', { hostConfidence01: 0.5 })).toBeLessThan(at('beliefs'));
    expect(at('beliefs', { staleness01: 0.5 })).toBeLessThan(at('beliefs'));
    // An unrecognised tap earns NOTHING rather than a default.
    expect(accuracyCapFor({ tap: 'hearsay', hostConfidence01: 1, staleness01: 1 })).toBe(0);
  });

  test('the poison term is REAL on both sides, and a friend never poisons', () => {
    const malicious = {
      malice01: 1, lawfulness01: 0, desperation01: 0, relationship: 'hostile',
    };
    expect(perfPoison01(malicious)).toBeGreaterThan(0);
    // A friend's markets are honest even when its council is malicious — the second factor.
    expect(perfPoison01({ ...malicious, relationship: 'allied' })).toBe(0);
    // And a saintly hostile court poisons nothing either — the first factor.
    expect(perfPoison01({ ...malicious, malice01: 0, lawfulness01: 1 })).toBe(0);
    // ⚠ THAT LAST LINE ALONE PROVES LESS THAN IT READS, AND THE GAP IS A FLOOR. With malice
    // and desperation both zero every POSITIVE term in `lieWillingness` is already zero, so
    // the clamp returns 0 whether or not the lawful-good RESTRAINT term exists — the pin
    // holds with `- restraint` deleted. The restraint has to be measured where it is
    // SUBTRACTING from something: a court that is genuinely malicious AND genuinely lawful
    // poisons strictly less than the same malice without the conscience.
    const wicked = { malice01: 0.8, lawfulness01: 0, desperation01: 0, relationship: 'hostile' };
    expect(perfPoison01({ ...wicked, lawfulness01: 1 }))
      .toBeLessThan(perfPoison01(wicked));
    expect(perfPoison01({ ...wicked, lawfulness01: 1 })).toBeGreaterThan(0);
    // The rung ladder is normalized against its own top rung and is zero off-ladder.
    expect(hostileRung01('hostile')).toBe(1);
    expect(hostileRung01('rival')).toBeLessThan(hostileRung01('cold_war'));
    expect(hostileRung01('allied')).toBe(0);
  });

  test('staleness rides the estate\'s ONE decay law, and the three receipts are the owner\'s', () => {
    expect(recordStaleness01(10, 10)).toBe(1);
    expect(recordStaleness01(10, 12)).toBeLessThan(recordStaleness01(10, 11));
    expect(recordStaleness01(10, 11)).toBeLessThan(1);
    // The three house-voice registers, verbatim, and the substitution that names the host.
    expect(Object.keys(TAP_RECEIPTS).sort()).toEqual(['beliefs', 'delta', 'performance']);
    expect(tapReceiptFor('performance', 'Westmarch')).toBe('as told in Westmarch\'s markets');
    expect(tapReceiptFor('beliefs', 'Westmarch')).toBe('as Westmarch itself believes');
    expect(tapReceiptFor('delta', 'Westmarch'))
      .toBe('Westmarch speaks one thing and believes another');
    expect(tapReceiptFor('hearsay', 'Westmarch')).toBe('');
  });
});

// ── 3. THE STANDOFF (owner addition D, with H's integrity axis) ────────────────
describe('ES-3 the standoff — risk, confidence and integrity, all three live', () => {
  const bold = { personality: { dominant: 'bold' } };
  const timid = { personality: { dominant: 'cowardly', flaw: 'timid' } };

  test('both arms are reachable, and each of the three axes moves the answer alone', () => {
    // The gate is tuned so that EVERY axis below can flip this one decision on its own —
    // a base where three of four axes were already saturated would prove one term live and
    // call it four.
    const base = { catch01: 0.35, clusterHostility01: 1, npc: timid, homeDesperation01: 0, poison01: 0 };
    // A timid man in front of a bad gate stands off; the same gate does not stop a bold one.
    expect(standoffRead(base).standoff).toBe(true);
    expect(standoffRead({ ...base, npc: bold }).standoff).toBe(false);
    // RISK: a quieter gate flips the timid man back through it.
    expect(standoffRead({ ...base, catch01: 0.1 }).standoff).toBe(false);
    // TOPOLOGY: a friendly approach does the same, at the same gate.
    expect(standoffRead({ ...base, clusterHostility01: 0.1 }).standoff).toBe(false);
    // INTEGRITY (addition H): a POISONED satellite raises the bar for standing off there,
    // because what he would hear from outside is worth less.
    expect(standoffRead({ ...base, poison01: 1 }).standoff).toBe(false);
    // DESPERATION is the fourth mover and it is DECLARED ABSENT at the stage, not here.
    expect(standoffRead({ ...base, homeDesperation01: 1 }).standoff).toBe(false);
    // The receipt names the choice in character, both ways, and they differ.
    expect(standoffRead(base).receipt).not.toBe(standoffRead({ ...base, npc: bold }).receipt);
  });

  test('THE FLAW MUTANT: flattening the distortion table reverts a decision', () => {
    // `flawDistortion` extends the ladder's own `riskAppetiteOf` rather than forking it, so
    // the three classes must be genuinely distinct — a flat table is the mutant.
    expect(flawDistortion(bold)).toBeLessThan(1);
    expect(flawDistortion(timid)).toBeGreaterThan(1);
    expect(flawDistortion({ personality: { dominant: 'dutiful' } })).toBe(1);
    expect(new Set(Object.values(TAP_TUNING.FLAW_DISTORTION)).size).toBe(3);
    // The decision the distortion is load-bearing for: at this gate the two temperaments
    // disagree, and they disagree ONLY because the table is not flat (both share the same
    // risk tolerance would-be if the table were 1 — which the assertion below fixes by
    // holding the appetite constant across the pair).
    const same = { personality: { dominant: 'bold', flaw: 'timid' } };
    const distorted = standoffRead({
      catch01: 0.6, clusterHostility01: 1, npc: same, homeDesperation01: 0, poison01: 0,
    });
    expect(distorted.assessedRisk).toBe(Math.round(0.6 * flawDistortion(same) * 10000) / 10000);
  });
});

// ── 4. THE THREE PRODUCTS (§3.6) ───────────────────────────────────────────────
describe('ES-3 the three products — what each one crosses, and what it refuses', () => {
  const read = {
    slots: {
      readiness: 0.4, strengthBand: 3, allianceLabel: 'rival', faithLabel: 'The Anvil',
    },
    conditions: { routePositionBand: 'trace', storesBand: 'deep', tierBand: 'town' },
    lieSeen: false,
    hostConfidence01: 0.8,
    hostUpdatedTick: 11,
  };

  test('THE LEG TABLE IS TOTAL over the vocabulary — a new leg cannot land unmapped', () => {
    // A leg the table simply OMITTED would read as an unrecognised word and the mission
    // would grade itself as though nobody had asked for it.
    expect(Object.keys(LEG_SLOTS).sort()).toEqual([...ENVOY_COVERT_LEG_REFS].sort());
    // EP-r: and totality is now a STRONGER claim than it was. ES-3 kept `exports: null` in
    // this table as a DECLARATION that one lawful leg had no slot; the leg was cut, so
    // every remaining member maps to a real one and no lawful ref can come home unfillable
    // for want of a slot. This loop reds if a later lane re-admits a slotless member.
    for (const [leg, mapping] of Object.entries(LEG_SLOTS)) {
      expect(mapping, `${leg} maps to NOTHING — a slotless leg is the dead member EP-r cut`)
        .not.toBeNull();
      expect(mapping.family === 'core' || CONDITIONS_KEYS.includes(mapping.slot), leg).toBe(true);
    }
    // NEITHER excluded word is a leg. `pullBand` is SP-B's own populations road and
    // `exports` has no belief slot at all, which is the one dead-vocabulary-member rule
    // both exclusions are made of.
    expect(CONDITIONS_KEYS).toContain('pullBand');
    // anchored: the exact-set assertion above proves LEG_SLOTS is populated
    expect(Object.keys(LEG_SLOTS)).not.toContain('pullBand');
    // anchored: the exact-set assertion above proves LEG_SLOTS is populated
    expect(Object.keys(LEG_SLOTS)).not.toContain('exports');
  });

  test('CONFIRM crosses NOTHING — it asserts the value the court already holds', () => {
    const out = productGroundTruth({ product: 'confirm', prior: HOME_PRIOR, read, conditionsLit: true });
    expect(out.crossed).toEqual([]);
    expect(out.refusal).toBe('');
    expect(out.groundTruth).toEqual({ ...HOME_PRIOR });
  });

  test('ACQUIRE crosses ONLY the legs it names, and NAMES the leg it cannot fill', () => {
    // EP-r: this pin used to drive the unfillable arm with `exports`, the lawful-but-
    // slotless member. That member is CUT, so the arm is driven by a ref from OUTSIDE the
    // vocabulary instead — which is the only way `LEG_SLOTS`'s null arm can be reached now
    // that every lawful member maps to a real slot. The claim is unchanged and the arm is
    // the same one; what changed is that the ref is no longer one the mint would accept.
    // `productGroundTruth` is pure and does NOT re-validate against COVERT_LEG_REF_SET, so
    // an unrecognised ref must report UNFILLED rather than throw on `undefined.slot`.
    const out = productGroundTruth({
      product: 'acquire',
      prior: HOME_PRIOR,
      read,
      legRefs: ['storesBand', 'strength', 'pullBand'],
      conditionsLit: true,
    });
    expect(out.legsFilled).toEqual(['storesBand', 'strength']);
    expect(out.legsUnfilled).toEqual(['pullBand']);
    // anchored: the two filled legs one line above prove the table resolves real members,
    // so this undefined is an ABSENT ROW and not a table that resolves nothing.
    expect(LEG_SLOTS.pullBand).toBeUndefined();
    // ...and the cut leg is gone from the table entirely rather than mapping to null.
    expect(LEG_SLOTS.exports).toBeUndefined();
    expect(out.groundTruth.strengthBand).toBe(3);
    expect(out.groundTruth.conditionsBands).toEqual({ storesBand: 'deep' });
    // The legs it did NOT name are untouched: no opinion about the garrison's readiness.
    expect(out.groundTruth.readiness).toBe(HOME_PRIOR.readiness);
    expect(out.groundTruth.routePositionBand).toBeUndefined();
  });

  test('J-ES3-E: an ACQUIRE naming NO legs is a general reconnaissance, never inert', () => {
    // THE JUDGMENT, MEASURED. `legRefs` is CONDITIONAL on the errand row, so a lawful
    // acquire may name nothing at all — and the ruling is that such a mission crosses
    // everything readable rather than landing having learned nothing. It was recorded as
    // decided and never asserted: deleting the `word === 'acquire' && !refs.length` clause
    // left the whole battery green while every legless acquire silently became a no-op.
    const sweeping = productGroundTruth({
      product: 'acquire', prior: HOME_PRIOR, read, conditionsLit: true,
    });
    expect(sweeping.crossed).toEqual([
      'allianceLabel', 'faithLabel', 'readiness', 'strengthBand', 'conditionsBands',
    ]);
    expect(sweeping.groundTruth.strengthBand).toBe(3);
    expect(sweeping.groundTruth.conditionsBands).toEqual(read.conditions);
    // An EMPTY array is the same mission as an absent one — the DTO drops the key when the
    // list is empty, so the two spellings must not disagree about what was asked for.
    expect(productGroundTruth({
      product: 'acquire', prior: HOME_PRIOR, read, legRefs: [], conditionsLit: true,
    }).crossed).toEqual(sweeping.crossed);
    // BOTH SIDES LIVE, and this is the half that makes the clause load-bearing rather than
    // decorative: the SAME product naming ONE leg crosses that leg and nothing else. Without
    // it the assertion above would hold for a function that always swept.
    expect(productGroundTruth({
      product: 'acquire', prior: HOME_PRIOR, read, legRefs: ['strength'], conditionsLit: true,
    }).crossed).toEqual(['strengthBand']);
  });

  test('REFUTE crosses everything readable, so the contradiction term can bite', () => {
    const out = productGroundTruth({ product: 'refute', prior: HOME_PRIOR, read, conditionsLit: true });
    expect(out.crossed).toEqual([
      'allianceLabel', 'faithLabel', 'readiness', 'strengthBand', 'conditionsBands',
    ]);
    expect(out.groundTruth.allianceLabel).toBe('rival');
    expect(out.groundTruth.strengthBand).toBe(3);
  });

  test('the two products that need a prior REFUSE without one — no opinion is materialized', () => {
    for (const [product, refusal] of [['confirm', 'nothing_to_confirm'], ['refute', 'nothing_to_refute']]) {
      const out = productGroundTruth({ product, prior: null, read, conditionsLit: true });
      expect(out.refusal).toBe(refusal);
      expect(out.crossed).toEqual([]);
    }
    // ACQUIRE is the ONE product that may create a belief — the unknown → known road.
    const acquired = productGroundTruth({
      product: 'acquire', prior: null, read, legRefs: ['tierBand'], conditionsLit: true,
    });
    expect(acquired.refusal).toBe('');
    expect(acquired.groundTruth.conditionsBands).toEqual({ tierBand: 'town' });
  });

  test('the DEGRADED ARM: conditions dark leaves the axis legs alone and says which family', () => {
    const dark = productGroundTruth({
      product: 'acquire', prior: HOME_PRIOR, read, legRefs: ['storesBand', 'strength'], conditionsLit: false,
    });
    expect(dark.legsFilled).toEqual(['strength']);
    expect(dark.legsUnfilled).toEqual(['storesBand']);
    expect(dark.groundTruth.conditionsBands).toBeUndefined();
    // BOTH SIDES LIVE: the same call with the family lit fills the leg.
    const lit = productGroundTruth({
      product: 'acquire', prior: HOME_PRIOR, read, legRefs: ['storesBand', 'strength'], conditionsLit: true,
    });
    expect(lit.legsFilled).toEqual(['storesBand', 'strength']);
  });

  test('THE HONESTY NEGATIVE: a host holding no belief about the subject yields NOTHING', () => {
    // anchored: the same call WITH a host record returns a read one line down, so this null
    // is the absence of a belief and not the absence of a working function.
    expect(observedReadAt({ tap: 'beliefs', isTarget: false, hostRecord: null })).toBeNull();
    expect(observedReadAt({ tap: 'beliefs', isTarget: false, hostRecord: HOST_BELIEF })).toBeTruthy();
  });

  test('the PERFORMANCE overlay carries the ASSERTED band; an entered agent reads past it', () => {
    const lie = { liarId: 'westmarch', subjectId: 'irontown', assertedBand: 0 };
    const told = observedReadAt({
      tap: 'performance', isTarget: false, hostRecord: HOST_BELIEF, hostLie: lie,
    });
    const embedded = observedReadAt({
      tap: 'beliefs', isTarget: false, hostRecord: HOST_BELIEF, hostLie: lie,
    });
    expect(told.slots.strengthBand).toBe(0);
    expect(embedded.slots.strengthBand).toBe(HOST_BELIEF.strengthBand);
    expect(told.lieSeen).toBe(false);
    // The delta tap is handed the lie ITSELF — counter-disinfo by access depth.
    expect(observedReadAt({
      tap: 'delta', isTarget: false, hostRecord: HOST_BELIEF, hostLie: lie,
    }).lieSeen).toBe(true);
  });

  test('the synthetic report is FLOORED and first-hand, and carries the agent as its source', () => {
    const report = buildProductReport({
      product: 'confirm', errandId: 'a.b|c', sourceId: 'ashford#npc.reeve', accuracy01: 0.4, completeness01: 0,
    });
    expect(report.completeness01).toBe(PRODUCT_TUNING.COMPLETENESS_FLOOR);
    expect(report.hopCount).toBe(0);
    expect(report.ageTicks).toBe(0);
    expect(report.independentSources).toBe(1);
    expect(report.sourceId).toBe('ashford#npc.reeve');
    expect(report.sortKey).toBe('espionage.confirm.a.b|c');
    // ⚠ The live BeliefReport typedef carries `ageTicks`, NOT the volume's `arrivalTick`.
    expect('arrivalTick' in report).toBe(false);
  });
});

// ── 5. THE GRADE + THE JEWEL (§3.14, §3.7) ─────────────────────────────────────
describe('ES-3 the grade and the two landing worlds', () => {
  test('all FOUR grades are reachable, and an unfilled leg caps the grade at partial', () => {
    const grades = new Set([
      freshMissionGradeFor({ demand: 'confirm', landedConfidence01: 0 }).grade,
      freshMissionGradeFor({ demand: 'confirm', landedConfidence01: 0.4 }).grade,
      freshMissionGradeFor({ demand: 'confirm', landedConfidence01: 0.7 }).grade,
      freshMissionGradeFor({ demand: 'confirm', landedConfidence01: 1 }).grade,
    ]);
    expect([...grades].sort()).toEqual([...MISSION_GRADES]);
    // THE CAP: a mission that landed a high confidence while leaving a leg it was SENT for
    // unfillable did not do what it was asked.
    // EP-r: the cap is KEPT and the witness leg is now a LIVE one. These examples used to
    // name `exports`, the leg that could never be filled in any world; that member is cut,
    // and the cap survives because a leg whose belief FAMILY is dark is unfillable for a
    // second and entirely legitimate reason (the degraded-arm pin above drives exactly
    // this with `storesBand` and conditions unlit).
    const uncapped = freshMissionGradeFor({ demand: 'confirm', landedConfidence01: 1 });
    const capped = freshMissionGradeFor({
      demand: 'confirm', landedConfidence01: 1, legsUnfilled: ['storesBand'],
    });
    expect(uncapped.grade).toBe('exceeded');
    expect(capped.grade).toBe('partial');
    expect(capped.capped).toBe(true);
    // A grade already below the bar is NOT re-graded by the cap.
    expect(freshMissionGradeFor({
      demand: 'certain', landedConfidence01: 0.1, legsUnfilled: ['storesBand'],
    })).toEqual({ grade: 'partial', bestConfidence01: 0.1, capped: false });
  });

  test('LOSE THE SPY, KEEP THE INTEL — both arms, and the uncaught control', () => {
    const gathered = [
      { accuracyCap01: 0.5, atTick: 12, subjectId: 'irontown', tap: 'beliefs', sentHome: true },
      { accuracyCap01: 0.6, atTick: 14, subjectId: 'irontown', tap: 'beliefs' },
    ];
    // MAGIC: what was sent stays landed; what was unsent dies with the man.
    const magic = landableGatherings({ gathered, captured: true, magic: true });
    expect(magic.landable.map((row) => row.atTick)).toEqual([12]);
    expect(magic.lost.map((row) => row.atTick)).toEqual([14]);
    expect(magic.reason).toBe('caught_magic_partials_kept');
    // MUNDANE: nothing left his head, so a capture loses the man AND the gradient.
    const mundane = landableGatherings({ gathered, captured: true, magic: false });
    expect(mundane.landable).toEqual([]);
    expect(mundane.lost.map((row) => row.atTick)).toEqual([12, 14]);
    expect(mundane.reason).toBe('caught_mundane_all_lost');
    // THE CONTROL: uncaught, both worlds keep everything — so the two arms above are the
    // capture's doing and not the function refusing everything it is handed.
    for (const magicWorld of [true, false]) {
      const out = landableGatherings({ gathered, captured: false, magic: magicWorld });
      expect(out.landable).toHaveLength(2);
      expect(out.lost).toEqual([]);
    }
  });

  test('the interval anchor is the exactly-once key, and it is monotone per stop', () => {
    const at = (intervalIdx) => gatheringAnchorTick({
      arrivalTick: 12, plannedStayTicks: 2, intervalIdx, intervalTicks: 2,
    });
    expect(at(0)).toBe(12);
    expect(at(1)).toBe(14);
    expect(at(2)).toBe(16);
    expect(at(3)).toBeGreaterThan(at(2));
  });
});

// ── 6. THE STAGE, ON A REAL MISSION ────────────────────────────────────────────
describe('ES-3 the stage — the gradient accrues once, persists, and survives the round-trip', () => {
  const run = (worldState, tick, snapshot = MAGIC_SNAPSHOT, extra = {}) => advanceEspionageProducts({
    worldState, tick, snapshot, regionalGraph: HOSTILE_GRAPH, ...extra,
  });

  test('one read per interval: a second pass at the same tick appends NOTHING', () => {
    const { worldState } = mission();
    const first = run(worldState, 13);
    expect(first.gatherings).toHaveLength(1);
    expect(first.gatherings[0]).toMatchObject({
      stopId: 'westmarch', tap: 'beliefs', intervalIdx: 0, atTick: 12, written: true,
    });
    const row = envoyErrandsOf(first.worldState)[0];
    expect(row.covert.gathered).toHaveLength(1);
    // IDEMPOTENT BY IDENTITY, not by a stored byte: every tick inside one interval yields
    // the same anchor, so re-evaluating it cannot produce a second partial.
    const second = run(first.worldState, 13);
    expect(second.gatherings).toEqual([]);
    expect(second.skipped[0].reason).toBe('interval_already_read');
    expect(envoyErrandsOf(second.worldState)[0].covert.gathered).toHaveLength(1);
    // ...and the world is returned BY REFERENCE when nothing moved (writeErrands' own law).
    expect(second.worldState).toBe(first.worldState);
    expect(second.changed).toBe(false);
  });

  test('the gradient PERSISTS: it round-trips through the real normalizer, byte-stable', () => {
    const { worldState } = mission();
    const walked = run(worldState, 13).worldState;
    const row = envoyErrandsOf(walked)[0];
    // LIFECYCLE — persist: through REAL serialization, never an in-memory probe (the
    // JSON-alias trap: an in-memory compare cannot tell a shared reference from a copy).
    const reloaded = normalizeErrand(JSON.parse(JSON.stringify(row)));
    expect(reloaded).not.toBeNull();
    expect(JSON.stringify(reloaded.covert)).toBe(JSON.stringify(row.covert));
    // LIFECYCLE — import/heal: a FORGED partial degrades the whole sub-record to ABSENT
    // rather than nulling the errand and dropping a traveller.
    const forged = JSON.parse(JSON.stringify(row));
    forged.covert.gathered[0].accuracyCap01 = 4;
    const healed = normalizeErrand(forged);
    expect(healed).not.toBeNull();
    expect(healed.covert).toBeUndefined();
    expect(healed.id).toBe(row.id);
    // LIFECYCLE — regenerate/undo: the row is event-accrued campaign state and the ledger
    // is the only place it lives, so a re-read of the SAME world hands back the same bytes.
    expect(JSON.stringify(envoyErrandsOf(walked)[0].covert))
      .toBe(JSON.stringify(envoyErrandsOf(JSON.parse(JSON.stringify(walked)))[0].covert));
  });

  test('MAGIC lands at the stop; MUNDANE holds everything until the home mouth', () => {
    // ⚠ THE SEND PRIOR IS HELD BELOW THE CEILING for the fold test's reason exactly: on the
    // file's 0.7 seed a single send CLAMPS `confidence01` at 1.0, so "the certainty rose"
    // would have been true for every accuracy the tap ladder could possibly produce — and
    // for no accuracy at all. At 0.2 the rise is a measurement.
    const SEND_PRIOR = Object.freeze({ ...HOME_PRIOR, confidence01: 0.2 });
    // MAGIC — the pair gate is true at both ends, so the read is SENT as it is taken.
    const magic = mission({ home: SEND_PRIOR });
    const sent = run(magic.worldState, 13);
    expect(sent.gatherings[0].sentHome).toBe(true);
    expect(envoyErrandsOf(sent.worldState)[0].covert.gathered[0].sentHome).toBe(true);
    expect(sent.landings).toHaveLength(1);
    expect(sent.landings[0]).toMatchObject({ world: 'magic', reason: 'landed', changed: true });
    const landed = beliefRecord(sent.worldState, 'ashford', 'irontown');
    expect(landed.lastUpdateTick).toBe(13);
    expect(landed.confidence01).toBeGreaterThan(SEND_PRIOR.confidence01);
    // The same guard as the fold test below, through the same shared helper — the sibling
    // instance of the class, not a second hand-rolled copy of the cure.
    expectRungBelowBandTop(landed.confidence01, 1, 'confidence01');
    // A CONFIRM CROSSES NO OBSERVED SLOT — its ground truth IS the prior, which is the
    // whole product. ⚠ THE BAND STILL DRIFTS, AND SAYING SO IS THE POINT: `reconcileBelief`
    // re-anchors every numeric attribute toward a FIDELITY-DEGRADED truth (`accuracy x gt +
    // (1 - accuracy) x NEUTRAL`), so a half-faithful telling pulls the number toward the
    // midpoint even when it asserts the prior verbatim. That is the substrate's documented
    // law, INHERITED not introduced, and a pin claiming "nothing else moves" would have been
    // a claim about arithmetic this wave does not own.
    expect(sent.landings[0].crossed).toEqual([]);
    expect(landed.allianceLabel).toBe(HOME_PRIOR.allianceLabel);
    expect(landed.strengthBand).toBeGreaterThanOrEqual(HOME_PRIOR.strengthBand);
    expect(landed.strengthBand).toBeLessThan(2);

    // MUNDANE — the same tick, the same mission, magic absent at both ends.
    const mundane = mission({ home: HOME_PRIOR });
    const held = run(mundane.worldState, 13, MUNDANE_SNAPSHOT);
    expect(held.gatherings[0].sentHome).toBe(false);
    expect(held.landings).toEqual([]);
    // anchored: the MAGIC run four lines up is the same mission at the same tick and it
    // landed one product, so an untouched belief here measures the mundane arm holding
    // rather than a stage that never ran.
    expect(beliefRecord(held.worldState, 'ashford', 'irontown').lastUpdateTick)
      .toBe(HOME_PRIOR.lastUpdateTick);
  });

  test('the MUNDANE fold at the home mouth lands the whole gradient, once', () => {
    // ⚠⚠ THE PRIOR IS HELD BELOW THE CEILING ON PURPOSE, AND THE SHAPE IT DODGES HAS A
    // NAME: CEILING SATURATION. `confidence01` is CLAMPED at 1.0, and at the file's own
    // 0.7 prior a single report already saturates it — MEASURED across eleven priors, the
    // correct ONE-report fold and a NINE-report echo chamber BOTH land exactly 1.0 from
    // prior 0.5 upward. The equality this test exists for therefore HELD UNDER THE VERY
    // DEFECT IT EXCLUDES, which is how it shipped. At 0.2 the honest fold lands 0.7 while
    // the echo chamber still lands 1.0, so the arithmetic has room to move and the pin
    // bites. The REFUTE test below holds its prior at 0.2 for exactly this reason.
    const FOLD_PRIOR = Object.freeze({ ...HOME_PRIOR, confidence01: 0.2 });
    const { worldState } = mission({ home: FOLD_PRIOR });
    let state = run(worldState, 13, MUNDANE_SNAPSHOT).worldState;
    // Walk the REAL writers to the home mouth: advance, return, advance, mark home.
    for (let t = 14; t <= 30; t += 1) {
      state = advanceEnvoyErrands({ worldState: state, tick: t }).worldState;
      state = run(state, t, MUNDANE_SNAPSHOT).worldState;
    }
    const parlaying = envoyErrandsOf(state)[0];
    expect(parlaying.state).toBe('parlaying');
    const returned = beginEnvoyReturn({
      worldState: state,
      errandId: parlaying.id,
      routePlan: {
        legs: [{ fromId: 'irontown', toId: 'ashford', departTick: 31, arrivalTick: 34 }],
        expectedReturnTick: 34,
        routeRef: { id: 'road.north', name: 'North Road' },
      },
      tick: 30,
    });
    expect(returned.reason).toBe('returning');
    state = returned.worldState;
    for (let t = 31; t <= 39; t += 1) {
      state = advanceEnvoyErrands({ worldState: state, tick: t }).worldState;
    }
    const marked = markEnvoyHome({
      worldState: state, errandId: parlaying.id, tick: 40,
    });
    expect(marked.reason).toBe('home');
    state = marked.worldState;
    const gradient = envoyErrandsOf(state)[0].covert.gathered;
    // The gradient really did accrue across two stops and several intervals, and NOTHING
    // has landed yet — so the fold below is measuring a fold and not an empty run.
    expect(gradient.length).toBeGreaterThan(2);
    expect(new Set(gradient.map((row) => row.tap))).toEqual(new Set(['beliefs', 'performance']));
    expect(gradient.every((row) => row.sentHome === undefined)).toBe(true);
    expect(beliefRecord(state, 'ashford', 'irontown').lastUpdateTick).toBe(FOLD_PRIOR.lastUpdateTick);

    const fold = run(state, 40, MUNDANE_SNAPSHOT);
    expect(fold.landings).toHaveLength(1);
    expect(fold.landings[0]).toMatchObject({
      world: 'mundane', reason: 'landed', foldReason: 'uncaught', lost: 0,
    });
    expect(fold.landings[0].partials).toBe(gradient.length);
    // ⚠⚠ ONE MAN'S N LOOKS ARE ONE TELLING. `aggregateReports` SUMS weight across reports,
    // so folding N partials as N reports would hand the reconciler N independent witnesses
    // — the echo chamber `INDEP_BASE`/`INDEP_PER` exists to close. The fold's accuracy is
    // the BEST cap he achieved and its completeness is COVERAGE, and the confidence that
    // lands must therefore stay inside what ONE first-hand telling can buy.
    const best = Math.max(...gradient.map((row) => row.accuracyCap01));
    expect(fold.landings[0].accuracy01).toBe(best);
    expect(fold.landings[0].completeness01).toBe(1);
    const landedRecord = beliefRecord(fold.worldState, 'ashford', 'irontown');
    expect(landedRecord.lastUpdateTick).toBe(40);
    // ...and the record the stage wrote is EXACTLY the record ONE such telling produces,
    // recomputed here independently through the substrate's own function. A threshold would
    // not have caught the defect — `weight x CONF_GAIN` CLAMPS at 1.0 whether the fold hands
    // over one report or nine — so the shape has to be an EQUALITY against a single-report
    // reconcile, at a prior where that equality can fail.
    const oneTelling = reconcileBelief({
      prior: FOLD_PRIOR,
      groundTruth: { ...FOLD_PRIOR },
      reports: [{
        accuracy01: best,
        ageTicks: 0,
        completeness01: 1,
        hopCount: 0,
        independentSources: 1,
        score: PRODUCT_TUNING.REPORT_SCORE,
        sortKey: 'probe',
        sourceId: 'ashford#npc.reeve',
      }],
      now: 40,
    });
    // THE CLAIM, stated on three slots rather than one. `readiness` is re-anchored by the
    // AGGREGATE WEIGHT, so nine reports move it at every prior measured — it is the term
    // that sees the echo chamber whether or not the certainty is saturated. `strengthBand`
    // is named separately because BANDING IS LOSSY: it discriminates at a confident prior
    // and rounds the same difference away at a weak one, so it may never be the only
    // witness. `confidence01` is the quantity the defect INFLATES and is stated last.
    expect(landedRecord.readiness).toBe(oneTelling.readiness);
    expect(landedRecord.strengthBand).toBe(oneTelling.strengthBand);
    expect(landedRecord.confidence01).toBe(oneTelling.confidence01);
    // ⚠ AND THE ANTI-VACUITY GUARD ON THE CLAIM ITSELF, which is not decoration: an
    // equality between two CLAMPED quantities is true for every implementation. This
    // asserts the compared number is still INSIDE the range where the arithmetic can move,
    // so a later tuning change that re-saturates this fixture reds HERE instead of silently
    // emptying the equality above. ⭐ IT IS NOW MACHINERY RATHER THAN A HAND-ROLLED LINE
    // (F-SURVEY-1 M4): the shared guard names the slot, names the clamp, and carries the
    // declaration path a legitimately-saturated fixture has to take.
    expectRungBelowBandTop(landedRecord.confidence01, 1, 'confidence01');
    // ONCE: the mouth fires on the tick the row came home, so a later tick folds nothing.
    expect(run(fold.worldState, 41, MUNDANE_SNAPSHOT).landings).toEqual([]);
  });

  /**
   * Walk one mission all the way to `markEnvoyHome` through the REAL writers, under whatever
   * magic geography the caller hands in, and return the world standing at the mouth.
   * Shared by the two tests below so the double-landing guard and the coverage share are
   * measured on the same journey rather than on two fixtures that could drift apart.
   */
  function walkToTheMouth(snapshot, home = HOME_PRIOR) {
    const { worldState } = mission({ home });
    let state = run(worldState, 13, snapshot).worldState;
    const errandId = envoyErrandsOf(state)[0].id;
    for (let t = 14; t <= 30; t += 1) {
      state = advanceEnvoyErrands({ worldState: state, tick: t }).worldState;
      state = run(state, t, snapshot).worldState;
    }
    state = beginEnvoyReturn({
      worldState: state,
      errandId,
      routePlan: {
        legs: [{ fromId: 'irontown', toId: 'ashford', departTick: 31, arrivalTick: 34 }],
        expectedReturnTick: 34,
        routeRef: { id: 'road.north', name: 'North Road' },
      },
      tick: 30,
    }).worldState;
    for (let t = 31; t <= 39; t += 1) {
      state = advanceEnvoyErrands({ worldState: state, tick: t }).worldState;
    }
    state = markEnvoyHome({ worldState: state, errandId, tick: 40 }).worldState;
    return { state, errandId, gathered: envoyErrandsOf(state)[0].covert.gathered };
  }

  test('A MAGIC MISSION COMES HOME AND THE MOUTH CHARGES NOTHING TWICE', () => {
    // ⚠⚠ THE ARM THE JEWEL WAS NEVER PROVEN ON. `landableGatherings` returns EVERY row as
    // landable when nobody was caught, sentHome or not, so at the mouth of an uncaught magic
    // mission the fold is holding nine partials that ALREADY LANDED at their own send ticks.
    // The only thing standing between that and charging one telling twice is the
    // `row.sentHome !== true` filter — and deleting it left the whole battery green, because
    // no fixture had ever driven a magic mission to the home mouth. Every earlier magic pin
    // stopped at the stop.
    const { state, gathered } = walkToTheMouth(MAGIC_SNAPSHOT);
    // The premise, asserted so this is not the identity of an empty run: he really did gather
    // a gradient and every partial really did leave his head on the road.
    expect(gathered.length).toBeGreaterThan(2);
    expect(gathered.every((row) => row.sentHome === true)).toBe(true);
    const before = beliefRecord(state, 'ashford', 'irontown');
    const fold = run(state, 40, MAGIC_SNAPSHOT);
    // NOTHING LANDS, and the mouth SAYS SO rather than falling silent.
    expect(fold.landings).toEqual([]);
    expect(fold.skipped[0]).toMatchObject({ reason: 'home_uncaught', lost: 0 });
    // ...and the court's belief is byte-identical across the mouth, which is the claim the
    // receipt above is only evidence for.
    expect(JSON.stringify(beliefRecord(fold.worldState, 'ashford', 'irontown')))
      .toBe(JSON.stringify(before));
  });

  test('A MIXED-MAGIC MISSION FOLDS ONLY WHAT NEVER LEFT HIS HEAD, and coverage says so', () => {
    // Magic works at home and at the waypoint and is DEAD at the target — a lawful world,
    // and the one that puts BOTH kinds of partial on a single errand row. It is what makes
    // `completeness01` a measurement instead of a constant: every other fixture in this file
    // folds a gradient with nothing already sent, so COVERAGE is N/N = 1 by construction and
    // the stage's own sentence — "a captured magic mission that kept one partial of five
    // tells a fifth of a story" — was asserted nowhere.
    const MIXED_SNAPSHOT = Object.freeze({
      settlements: [
        town('ashford', 'Ashford'),
        town('westmarch', 'Westmarch'),
        town('irontown', 'Irontown', MUNDANE_AXIS),
      ],
    });
    const { gathered, state } = walkToTheMouth(MIXED_SNAPSHOT);
    const sent = gathered.filter((row) => row.sentHome === true);
    const unsent = gathered.filter((row) => row.sentHome !== true);
    // BOTH KINDS ARE REALLY PRESENT — without this the test below is a mundane fold wearing
    // a different fixture's name.
    expect(sent.length).toBeGreaterThan(0);
    expect(unsent.length).toBeGreaterThan(0);
    const fold = run(state, 40, MIXED_SNAPSHOT);
    expect(fold.landings).toHaveLength(1);
    // THE COUNT: only the partials that never left his head. Not the whole gradient.
    expect(fold.landings[0].partials).toBe(unsent.length);
    expect(fold.landings[0].partials).toBeLessThan(gathered.length);
    // THE SHARE: a man who sent four of nine home by magic comes back carrying five ninths
    // of a story, and the report he hands the court is discounted to exactly that.
    expect(fold.landings[0].completeness01)
      .toBe(Math.round((unsent.length / gathered.length) * 10000) / 10000);
    expect(fold.landings[0].completeness01).toBeLessThan(1);
  });

  test('a CAUGHT mundane mission loses the man AND the gradient at the mouth', () => {
    // The capture arrives as ES-2's own detection record — the stage never re-rolls it.
    const { worldState } = mission({ home: HOME_PRIOR });
    let state = run(worldState, 13, MUNDANE_SNAPSHOT).worldState;
    const errandId = envoyErrandsOf(state)[0].id;
    for (let t = 14; t <= 30; t += 1) {
      state = advanceEnvoyErrands({ worldState: state, tick: t }).worldState;
      state = run(state, t, MUNDANE_SNAPSHOT).worldState;
    }
    state = beginEnvoyReturn({
      worldState: state,
      errandId,
      routePlan: {
        legs: [{ fromId: 'irontown', toId: 'ashford', departTick: 31, arrivalTick: 34 }],
        expectedReturnTick: 34,
        routeRef: { id: 'road.north', name: 'North Road' },
      },
      tick: 30,
    }).worldState;
    for (let t = 31; t <= 39; t += 1) {
      state = advanceEnvoyErrands({ worldState: state, tick: t }).worldState;
    }
    state = markEnvoyHome({ worldState: state, errandId, tick: 40 }).worldState;
    const caught = run(state, 40, MUNDANE_SNAPSHOT, {
      detections: [{ errandId, caught: true }],
    });
    expect(caught.landings).toEqual([]);
    expect(caught.skipped[0].reason).toBe('home_caught_mundane_all_lost');
    expect(caught.skipped[0].lost).toBeGreaterThan(2);
    expect(beliefRecord(caught.worldState, 'ashford', 'irontown').lastUpdateTick)
      .toBe(HOME_PRIOR.lastUpdateTick);
    // THE CONTROL: the SAME world at the SAME tick without the detection lands. So the
    // absence above is the capture's doing and not a mouth that never opened.
    expect(run(state, 40, MUNDANE_SNAPSHOT).landings).toHaveLength(1);
  });

  test('an ACQUIRE fills SP-B\'s legs, and a friendly host is read exactly as honestly', () => {
    const covert = {
      demand: 'confirm',
      product: 'acquire',
      subjectId: 'irontown',
      // EP-r: this mission used to name `exports` alongside the two real legs. The member
      // is CUT, and this fixture mints through the REAL `mintEnvoyErrand`, so naming it
      // here would now be refused `invalid_leg_refs` and the row would never exist — which
      // is the cut proving itself at the writer rather than a pin being relaxed.
      legRefs: ['storesBand', 'tierBand'],
      itinerary: [
        { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
        { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
      ],
    };
    const { worldState } = mission({ covert });
    const out = advanceEspionageProducts({
      worldState, tick: 13, snapshot: MAGIC_SNAPSHOT, regionalGraph: FRIENDLY_GRAPH,
    });
    expect(out.landings[0].legsFilled).toEqual(['storesBand', 'tierBand']);
    // Every leg it was sent for came home filled, now that no lawful leg is slotless.
    expect(out.landings[0].legsUnfilled).toEqual([]);
    // The court now believes what WESTMARCH believes about Irontown's granary — not the
    // truth, the host's opinion. That is the epistemic constitution, landed.
    const record = beliefRecord(out.worldState, 'ashford', 'irontown');
    expect(record.conditionsBands).toEqual({ storesBand: 'deep', tierBand: 'town' });
    // A FRIENDLY host poisons nothing, so the read is un-discounted at the same stop.
    expect(out.gatherings[0].poison01).toBe(0);
  });

  test('the DEGRADED ARM names the missing family on the receipt', () => {
    const { worldState } = mission({ rules: {}, home: HOME_PRIOR });
    const out = advanceEspionageProducts({
      worldState, tick: 13, snapshot: MAGIC_SNAPSHOT, regionalGraph: HOSTILE_GRAPH,
    });
    expect(out.landings[0].familiesAbsent).toEqual(['beliefAxes', 'believedConditions']);
    expect(beliefRecord(out.worldState, 'ashford', 'irontown').conditionsBands).toBeUndefined();
    // BOTH SIDES: with the families lit the same receipt names none.
    const lit = advanceEspionageProducts({
      worldState: mission({ home: HOME_PRIOR }).worldState,
      tick: 13,
      snapshot: MAGIC_SNAPSHOT,
      regionalGraph: HOSTILE_GRAPH,
    });
    expect(lit.landings[0].familiesAbsent).toEqual([]);
  });

  test('THE STANDOFF\'S INTEGRITY AXIS IS LIVE IN THE STAGE, not only in the pure leaf', () => {
    // ⚠ THE DEFECT THIS PIN EXISTS FOR, RECORDED BECAUSE IT SHIPPED FOR AN HOUR: the stage
    // used to hand `standoffDecisionFor` a literal `poison01: 0`, so addition H's third
    // axis was live in `standoffRead`, pinned in this file's own standoff block, and
    // STRUCTURALLY DEAD in the world. A pure-leaf pin cannot see that. This one drives the
    // REAL stage and asserts the gathered term MOVES with the host's own alignment.
    const decide = (worldState) => standoffDecisionFor({
      worldState,
      snapshotById: new Map(MAGIC_SNAPSHOT.settlements.map((item) => [item.id, item])),
      regionalGraph: HOSTILE_GRAPH,
      homeId: 'ashford',
      hostId: 'westmarch',
      hostItem: MAGIC_SNAPSHOT.settlements[1],
      itinerary: [{ settlementId: 'westmarch' }, { settlementId: 'irontown' }],
      stopIndex: 1,
      tick: 13,
    });
    const base = mission().worldState;
    const saintly = decide(base);
    // The SAME town in a world where it has been at sustained war — `computeMalice`'s own
    // ACTS term, a real world read the alignment leaf already owns. One input moved.
    const wicked = decide({ ...base, warExhaustion: { westmarch: 1 } });
    expect(saintly.poison01).toBeLessThan(wicked.poison01);
    // ...and the bar moved WITH it, which is the axis actually reaching the decision.
    expect(saintly.bar).not.toBe(wicked.bar);
    // The receipt still names the declared-absent term rather than pretending it is folded.
    expect(saintly.termsAbsent).toEqual(['desperation01']);
  });

  test('THE STANDOFF WRITE ARM: the mark is decided, PERSISTED, and caps every later read', () => {
    // ⚠⚠ THE SEAM THIS PIN EXISTS FOR. The pure decision's true arm was pinned, and the
    // covert DTO's `standoff` round-trip was pinned, and NOTHING JOINED THEM: reducing
    // `standoffMarkFor` to `return { mark: false, receipt: null }` left the whole battery
    // green. Both ends of a wire are not the wire.
    const walkOne = (npc) => {
      let state = mission({
        legs: STANDOFF_LEGS,
        covert: STANDOFF_COVERT,
        host: HOST_BELIEF,
      }).worldState;
      // Harrowgate must hold an opinion about Irontown or the second stop yields nothing.
      state = {
        ...state,
        spatialLedgers: {
          beliefMaps: {
            ...state.spatialLedgers.beliefMaps,
            harrowgate: { seat: { irontown: HOST_BELIEF } },
          },
        },
      };
      const seen = [];
      for (let t = 12; t <= 29; t += 1) {
        const out = advanceEspionageProducts({
          worldState: state,
          tick: t,
          snapshot: STANDOFF_SNAPSHOT,
          regionalGraph: STANDOFF_GRAPH,
          npcFor: () => npc,
        });
        state = out.worldState;
        seen.push(...out.gatherings);
        state = advanceEnvoyErrands({ worldState: state, tick: t }).worldState;
      }
      return { row: envoyErrandsOf(state)[0], gatherings: seen };
    };

    // A TIMID MAN AT THE SECOND GATE STANDS OFF. The mark is written onto his own errand row
    // through the one amender, and the receipt names the gate he refused.
    const timid = walkOne(TIMID_NPC);
    expect(timid.row.covert.standoff).toBe(true);
    const marked = timid.gatherings.find((row) => row.standoff);
    expect(marked).toBeTruthy();
    expect(marked.stopId).toBe('harrowgate');
    expect(marked.standoff.nextStopId).toBe('irontown');
    expect(marked.standoff.assessedRisk).toBeGreaterThan(marked.standoff.bar);
    expect(marked.standoff.termsAbsent).toEqual(['desperation01']);
    // ...and the INFORMATIONAL consequence, which is the half §3.7 makes arithmetic: from the
    // moment he stands off, every read plateaus at the performance rung even at a stop whose
    // face is `covert` and would otherwise have bought him the host's own beliefs.
    const atHarrowgate = timid.gatherings.filter((row) => row.stopId === 'harrowgate');
    expect(atHarrowgate.length).toBeGreaterThan(1);
    expect(new Set(atHarrowgate.map((row) => row.tap))).toEqual(new Set(['performance']));

    // THE CONTROL, AND IT IS THE SAME GATE. A bold man walks through it: no mark, no receipt,
    // and the covert face still buys him what the host believes. So the mark above is the
    // decision's doing and not a stage that marks everybody.
    const bold = walkOne(BOLD_NPC);
    expect(bold.row.covert.standoff).toBeUndefined();
    expect(bold.gatherings.some((row) => row.standoff)).toBe(false);
    expect(new Set(bold.gatherings.filter((row) => row.stopId === 'harrowgate').map((row) => row.tap)))
      .toEqual(new Set(['beliefs']));
    // ⚠ AND THE THIRD ARM IS THE ONE THE PRODUCTION CALL SITE USED TO TAKE. With NO npc
    // reaching the stage the decision is made against a temperament nobody has — it lands
    // between the two and stands off at neither gate, which is why the wiring at
    // envoyPulse.js is a correctness fix and not a tidy-up.
    const faceless = walkOne(null);
    expect(faceless.row.covert.standoff).toBeUndefined();

    // THE MARK SURVIVES THE SAVE FILE, through the real normalizer rather than a probe.
    const reloaded = normalizeErrand(JSON.parse(JSON.stringify(timid.row)));
    expect(reloaded.covert.standoff).toBe(true);
  });

  test('a host with NO belief about the subject yields no partial at all', () => {
    const { worldState } = mission({ host: null });
    const out = advanceEspionageProducts({
      worldState, tick: 13, snapshot: MAGIC_SNAPSHOT, regionalGraph: HOSTILE_GRAPH,
    });
    expect(out.gatherings).toEqual([]);
    expect(out.skipped[0].reason).toBe('host_holds_no_belief');
    expect(envoyErrandsOf(out.worldState)[0].covert.gathered).toBeUndefined();
    // anchored: the SAME world with the host's belief seeded gathers one partial, so the
    // absence above is the honesty negative and not a stage that never runs.
    expect(advanceEspionageProducts({
      worldState: mission().worldState,
      tick: 13,
      snapshot: MAGIC_SNAPSHOT,
      regionalGraph: HOSTILE_GRAPH,
    }).gatherings).toHaveLength(1);
  });

  test('a REFUTE collapses a wrong confidence and corrects the categorical label', () => {
    const covert = {
      demand: 'confirm',
      product: 'refute',
      subjectId: 'irontown',
      itinerary: [
        { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
        { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
      ],
    };
    // The court is WRONG: it believes Irontown is a negligible ally. Its certainty is held
    // BELOW the ceiling on purpose — at a high prior BOTH products clamp at 1.0 and the
    // differential below would compare two saturated numbers, which is the equality trap.
    const { worldState } = mission({ covert, home: { ...HOME_PRIOR, confidence01: 0.2 } });
    const out = advanceEspionageProducts({
      worldState, tick: 13, snapshot: MAGIC_SNAPSHOT, regionalGraph: FRIENDLY_GRAPH,
    });
    const record = beliefRecord(out.worldState, 'ashford', 'irontown');
    // THE VALUE RE-ANCHORS toward what the host believes...
    expect(record.strengthBand).toBeGreaterThan(HOME_PRIOR.strengthBand);
    expect(out.landings[0].crossed).toContain('strengthBand');
    // ...and the SAME fold pays for it in certainty. ⚠ THE CLAIM IS A DIFFERENTIAL, NOT A
    // THRESHOLD, and that is the only honest shape: a first-hand telling ADDS
    // `weight x CONF_GAIN` while the contradiction term SUBTRACTS, so on a confident prior
    // the sum still clamps at 1.0 and an absolute bound would pass with the contradiction
    // term DELETED. Run the identical mission as a CONFIRM — same prior, same host, same
    // tick, the only difference being which slots cross — and the refute must land STRICTLY
    // less certain and STRICTLY further re-anchored.
    const confirmed = advanceEspionageProducts({
      worldState: mission({
        covert: { ...covert, product: 'confirm' },
        home: { ...HOME_PRIOR, confidence01: 0.2 },
      }).worldState,
      tick: 13,
      snapshot: MAGIC_SNAPSHOT,
      regionalGraph: FRIENDLY_GRAPH,
    });
    const confirmRecord = beliefRecord(confirmed.worldState, 'ashford', 'irontown');
    expect(confirmed.landings[0].crossed).toEqual([]);
    expect(record.confidence01).toBeLessThan(confirmRecord.confidence01);
    expect(record.strengthBand).toBeGreaterThan(confirmRecord.strengthBand);
  });
});

// ── 7. THE PRODUCTION CALL SITE (the injected world readers) ───────────────────
describe('ES-3 the world readers — what actually reaches the stage in a running world', () => {
  /**
   * ⚠⚠ WHY A SOURCE CENSUS AND NOT A PULSE RUN. `advanceEspionageProducts` takes its three
   * world readers as ARGUMENTS, which is the ES-0 discipline that lets each be mutated out —
   * and it is also the shape whose failure mode is silent: a call site that OMITS one gets
   * the null default, the term goes structurally dead in the running world, and every
   * pure-leaf pin in this file stays green. ES-3 shipped omitting all three. Only the CALL
   * SITE can be asked whether they arrive, so the call site is what is read.
   */
  const stripComments = (source) => source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  /**
   * The argument text of one call, by BRACE MATCHING from the callee name rather than by a
   * line window — a line-anchored extractor goes vacuous the first time somebody reformats
   * the call, which is the recorded filename/line-anchored pin class.
   * @param {string} source @param {string} callee @returns {string|null}
   */
  function callArgsOf(source, callee) {
    const at = source.indexOf(`${callee}(`);
    if (at < 0) return null;
    const from = at + callee.length;
    let depth = 0;
    for (let i = from; i < source.length; i += 1) {
      if (source[i] === '(') depth += 1;
      else if (source[i] === ')') {
        depth -= 1;
        if (depth === 0) return source.slice(from + 1, i);
      }
    }
    return null;
  }

  /** Every .js/.jsx under src/, keyed by repo-relative path. */
  function srcSources() {
    /** @type {Record<string, string>} */
    const out = {};
    const walk = (dir) => {
      for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
        const rel = `${dir}/${entry.name}`;
        if (entry.isDirectory()) { walk(rel); continue; }
        if (!/\.jsx?$/.test(entry.name)) continue;
        out[rel] = readFileSync(join(ROOT, rel), 'utf8');
      }
    };
    walk('src');
    return out;
  }

  test('the ONE production caller passes the man AND his credibility', () => {
    const sources = srcSources();
    // ANTI-VACUITY: the walk really reached the tree, and the stage really is in it.
    expect(Object.keys(sources).length).toBeGreaterThan(500);
    expect(sources).toHaveProperty('src/domain/worldPulse/espionage/espionageProductStage.js');
    // Exactly one module under src/ CALLS the stage. (The registry leaf names it as a string
    // address, and the stage names its own definition; neither is a call.)
    const callers = Object.entries(sources)
      .filter(([file, source]) => file !== 'src/domain/worldPulse/espionage/espionageProductStage.js'
        && /\badvanceEspionageProducts\s*\(/.test(stripComments(source)))
      .map(([file]) => file)
      .sort();
    expect(callers).toEqual(['src/domain/worldPulse/envoyPulse.js']);

    const args = callArgsOf(stripComments(sources[callers[0]]), 'advanceEspionageProducts');
    expect(args).toBeTruthy();
    // THE TWO THAT ARE LAWFULLY AVAILABLE AND ARE NOW PASSED. Without `npcFor` the standoff
    // reads the same number for a coward and a hero; without `credibilityOf` the taint model
    // `buildProductReport`'s own header promises never reaches the belief write.
    expect(/\bnpcFor\s*:/.test(args)).toBe(true);
    expect(/\bcredibilityOf\s*:/.test(args)).toBe(true);
    // NON-VACUITY FOR THE EXTRACTOR, planted rather than assumed: it must be able to see an
    // argument's ABSENCE, or the two assertions above are a scan that always says yes.
    expect(callArgsOf('advanceEspionageProducts({ worldState, tick })', 'advanceEspionageProducts'))
      .toBe('{ worldState, tick }');
    expect(/\bnpcFor\s*:/.test(
      /** @type {string} */ (callArgsOf('advanceEspionageProducts({ worldState, tick })', 'advanceEspionageProducts')),
    )).toBe(false);
    // ...and it must not stop at the first `)` inside a nested call.
    expect(callArgsOf('f(a, g(b), c)', 'f')).toBe('a, g(b), c');
  });

  test('⛔ THE DELTA ARM IS DECLARED DEAD, and this census REDS the day it stops being', () => {
    const sources = srcSources();
    // `insideAssetAt` has NO PRODUCER in this estate. The identifier appears in exactly two
    // files and both are CONSUMERS with a null default, so `tapLevelFor` can never return
    // `delta` in a running world: TAP_DEPTH.delta, the `lieSeen` road, the delta receipt and
    // the counter-disinformation story are all unreachable outside this battery.
    //
    // THIS IS A DECLARATION, NOT A DEFECT — the leaves are built and pinned so that the wave
    // minting an inside-asset ledger turns them on by supplying one argument (the SP-C
    // idiom). What WOULD be a defect is the silence, so the day a third file names the
    // predicate this reds and the DEAD ARM block in espionageProductStage.js must be revised
    // rather than quietly outliving its own fact.
    const namers = Object.entries(sources)
      .filter(([, source]) => /\binsideAssetAt\b/.test(stripComments(source)))
      .map(([file]) => file)
      .sort();
    expect(namers).toEqual([
      'src/domain/worldPulse/espionage/espionageGauntlet.js',
      'src/domain/worldPulse/espionage/espionageProductStage.js',
    ]);
    // AND THE ARITHMETIC CONSEQUENCE, stated where a reader will meet it: with the predicate
    // absent the ladder's deepest rung is simply not produced. Both arms live, so this is the
    // absence of a PRODUCER and not the absence of a working function.
    expect(tapLevelFor({ face: 'covert', hasInsideAsset: false })).toBe('beliefs');
    expect(tapLevelFor({ face: 'covert', hasInsideAsset: true })).toBe('delta');
  });
});
