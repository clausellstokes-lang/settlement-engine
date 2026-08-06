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
function mission({ rules = AXES_LIT, covert = null, host = HOST_BELIEF, home = null } = {}) {
  const { worldState, errand } = mintCovertFixture(litCovertWorld(rules), { covert });
  return { worldState: withBeliefs(worldState, { host, home }), errand };
}

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
    // writes none of it. A scan for the ladder's writer names is the cheap, total form.
    const ladderWriters = Object.entries(sources)
      .filter(([, source]) => /\b(?:writeNpcLadder|setLadderState|npcLadderState\s*=)/.test(source))
      .map(([file]) => file);
    expect(ladderWriters).toEqual([]);
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
    // anchored: the assertion below pins `reached`'s exact value SET, and the positive at
    // the top of this test proves the same function returns 'delta' when the asset is live
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
    // would grade itself as though nobody had asked for it. Totality is what makes
    // STOP-ES3-1's `exports: null` a DECLARATION rather than a gap.
    expect(Object.keys(LEG_SLOTS).sort()).toEqual([...ENVOY_COVERT_LEG_REFS].sort());
    // ...and every mapped slot names a real belief-record field or a real conditions key.
    for (const [leg, mapping] of Object.entries(LEG_SLOTS)) {
      if (!mapping) continue;
      expect(mapping.family === 'core' || CONDITIONS_KEYS.includes(mapping.slot), leg).toBe(true);
    }
    // `pullBand` is not a leg at all — SP-B's own populations road fills it and no ES
    // product can, which is the dead-vocabulary-member rule the leg set was minted under.
    expect(CONDITIONS_KEYS).toContain('pullBand');
    // anchored: the exact-set assertion three lines up proves LEG_SLOTS is populated
    expect(Object.keys(LEG_SLOTS)).not.toContain('pullBand');
  });

  test('CONFIRM crosses NOTHING — it asserts the value the court already holds', () => {
    const out = productGroundTruth({ product: 'confirm', prior: HOME_PRIOR, read, conditionsLit: true });
    expect(out.crossed).toEqual([]);
    expect(out.refusal).toBe('');
    expect(out.groundTruth).toEqual({ ...HOME_PRIOR });
  });

  test('ACQUIRE crosses ONLY the legs it names, and NAMES the leg it cannot fill', () => {
    const out = productGroundTruth({
      product: 'acquire',
      prior: HOME_PRIOR,
      read,
      legRefs: ['storesBand', 'strength', 'exports'],
      conditionsLit: true,
    });
    expect(out.legsFilled).toEqual(['storesBand', 'strength']);
    // ⛔ STOP-ES3-1, executed: `exports` is a lawful legRef with NO belief slot, and the
    // product says so rather than reporting three of three.
    expect(out.legsUnfilled).toEqual(['exports']);
    expect(LEG_SLOTS.exports).toBeNull();
    expect(out.groundTruth.strengthBand).toBe(3);
    expect(out.groundTruth.conditionsBands).toEqual({ storesBand: 'deep' });
    // The legs it did NOT name are untouched: no opinion about the garrison's readiness.
    expect(out.groundTruth.readiness).toBe(HOME_PRIOR.readiness);
    expect(out.groundTruth.routePositionBand).toBeUndefined();
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
    // unfillable did not do what it was asked. Without this, STOP-ES3-1's dead leg would
    // report success.
    const uncapped = freshMissionGradeFor({ demand: 'confirm', landedConfidence01: 1 });
    const capped = freshMissionGradeFor({
      demand: 'confirm', landedConfidence01: 1, legsUnfilled: ['exports'],
    });
    expect(uncapped.grade).toBe('exceeded');
    expect(capped.grade).toBe('partial');
    expect(capped.capped).toBe(true);
    // A grade already below the bar is NOT re-graded by the cap.
    expect(freshMissionGradeFor({
      demand: 'certain', landedConfidence01: 0.1, legsUnfilled: ['exports'],
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
    // MAGIC — the pair gate is true at both ends, so the read is SENT as it is taken.
    const magic = mission({ home: HOME_PRIOR });
    const sent = run(magic.worldState, 13);
    expect(sent.gatherings[0].sentHome).toBe(true);
    expect(envoyErrandsOf(sent.worldState)[0].covert.gathered[0].sentHome).toBe(true);
    expect(sent.landings).toHaveLength(1);
    expect(sent.landings[0]).toMatchObject({ world: 'magic', reason: 'landed', changed: true });
    const landed = beliefRecord(sent.worldState, 'ashford', 'irontown');
    expect(landed.lastUpdateTick).toBe(13);
    expect(landed.confidence01).toBeGreaterThan(HOME_PRIOR.confidence01);
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
    const { worldState } = mission({ home: HOME_PRIOR });
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
    expect(beliefRecord(state, 'ashford', 'irontown').lastUpdateTick).toBe(HOME_PRIOR.lastUpdateTick);

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
    // not have caught the defect: `weight x CONF_GAIN` on a 0.7 prior CLAMPS at 1.0 whether
    // the fold hands over one report or nine, so the inflation would have hidden behind the
    // ceiling. Equality against a single-report reconcile is the only shape that sees it.
    const oneTelling = reconcileBelief({
      prior: HOME_PRIOR,
      groundTruth: { ...HOME_PRIOR },
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
    expect(landedRecord.confidence01).toBe(oneTelling.confidence01);
    // ONCE: the mouth fires on the tick the row came home, so a later tick folds nothing.
    expect(run(fold.worldState, 41, MUNDANE_SNAPSHOT).landings).toEqual([]);
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
      legRefs: ['exports', 'storesBand', 'tierBand'],
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
    expect(out.landings[0].legsUnfilled).toEqual(['exports']);
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
