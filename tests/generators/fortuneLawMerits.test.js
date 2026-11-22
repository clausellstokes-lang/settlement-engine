/**
 * fortuneLawMerits.test.js — U5a, THE MERITS OF RULE AT BIRTH (FORTUNE-3, the chair's seven conditions of 2026-11-20
 * 15:30 UTC, its census rulings of 16:45 UTC and its rulings (A) to (C) of 18:38 UTC), DARK.
 *
 * ⭐ WHAT THIS FILE PROVES. The merits run as the TAIL of the `assembleSettlement` step (no new pipeline step), under
 * the fortune law (version 2) only:
 *   (a) DARK — births with no marker are byte-identical to `_fortuneLawVersion: 1`, and THE STEP TRACE PARTITION AND
 *       THE RAIL are untouched: the runner's step order is the partition's declared order (`TRACE_STEP_ORDER`, no step
 *       added), the rail (`runGenerationRequest`'s `pipelineHistory`) names exactly those steps under law 1 AND law 2,
 *       and a law-1 birth's trace and rail equal the version-1 birth's, byte for byte.
 *   (f) BORN, forced — births under law 2 whose stored band is `legitimacyBandFor(score)` and play-time `reBand`'s
 *       tuple (reached through `advanceTime`, for every score 0..100); `breakdown.merits` is the rule's points for the
 *       merits `meritsOf` names (absent when 0); no score below the birth's own (the base).
 *   (g) THE CENSUS and condition 3's ARM — on every town the tail moved: W1 (the seat-criminal direction) reads the
 *       stored band, and re-running `withCaptureRelations` changes nothing; W2 (the standing sentences) re-run from the
 *       pre-merit band changes nothing; W3 (the legitimacy tension twins) is the identity at both bands; W4 (the crisis
 *       stakes, derived AFTER the tail) equals the cast at the stored band; W5 (the law band) never falls, and every
 *       law atom of the political-flavour pool is a floor, so no stored line is contradicted.
 *   (5) THE RUNG IS NEVER READ (the chair's ruling of 19:33 UTC): a born place with a capture rung and the same place
 *       without one, equal in every served band, carry the same merits and the same score; and a place BORN captured
 *       (hxd-metropolis-73, rung `corrupted`, a weathered catastrophe) carries its merit.
 *   (S) EVERY INPUT IS SERVED (the chair's ruling of 19:38 UTC): on every forced birth, the merits recomputed from the
 *       SHARED read (`toPublicSafe`, then the veil with every hideable grouping and every field class of every card
 *       kind hidden) equal the owner's, and so do the score and its terms the shared page carries.
 *   (U7) LASTING, THE SECOND MERIT (FORTUNE-7 U7, the chair's decision E32 of 2026-11-22 04:51 UTC): the law's table
 *       holds one DRAFT lasting age for each size, inside that size's own age range; `meritsOf` credits `lasting` on
 *       every forced birth exactly where `history.age` reaches its size's age through the same gates; two merits are two
 *       reasons at the Endorsed guard; the edge is the table's own figure and the size is read as the record carries it;
 *       law 1 and a legacy config move nothing; a lit place without it holds the first merit's legitimacy exactly; at
 *       every capture rung and on the shared read under the widest veil, a lasting place carries the same merits.
 *
 * Every expectation is COMPUTED from `FORTUNE_LAW_TUNING`, `LEGITIMACY_CUTS`, the predicates and the writers
 * themselves; none is quoted. The seeds are towns the measure (`measures/u5-place-served-*.txt`) saw the tail move
 * (Tolerated to Approved, Approved to Endorsed, Endorsed held, stressed towns, seats at every capture rung born,
 * hxr-town-42 a criminal seat), and three it did not (hxd-thorp-2 among them: moved only by the retired principled merit).
 * The three visitor places are LASTING's (`measures/sentences/LASTING-DRAFT.md`: a thorp and a captured hamlet lasting
 * only, a village with both merits); the arms read their eligibility, never their draw.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { getStepOrder } from '../../src/generators/pipeline.js';
import '../../src/generators/steps/index.js';
import { TRACE_STEP_ORDER, partitionTrace } from '../../src/domain/edit/tracePartition.js';
import { runGenerationRequest } from '../../src/workers/generationRequest.js';
import { GENERATION_PROTOCOL_VERSION, GENERATION_REQUEST_KIND } from '../../src/lib/generationProtocol.js';
import { FORTUNE_LAW_CONFIG_KEY, FORTUNE_LAW_TUNING, SIZE_RELATIVE_FORTUNE_LAW_VERSION } from '../../src/domain/fortune/fortuneLaw.js';
import { MERIT_NAMES, meritedLegitimacy, meritsOf, rulerTroubled, settleMeritsOfRule } from '../../src/domain/fortune/fortuneMerits.js';
import { LEGITIMACY_CUTS } from '../../src/data/bandLadders.js';
import { govCriminalRelation, legitimacyBandFor, withCaptureRelations } from '../../src/generators/factionDynamics.js';
import { settleStandingToLegitimacy } from '../../src/generators/power/rosterText.js';
import { AGE_BY_TIER, legitimacyHeldTensions } from '../../src/data/historyData.js';
import { deriveCrisisCast } from '../../src/domain/crisis/crisisCast.js';
import { STRESS_SEVERITY_WEIGHT } from '../../src/generators/stressGenerator.js';
import { lawBandOf } from '../../src/domain/facts/lawBand.js';
import { LAW_ORDER_RUNGS } from '../../src/domain/facts/factVocabulary.js';
import { POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { advanceTime } from '../../src/domain/timeProgression.js';
import { supportedArchetypes } from '../../src/domain/factionRelationshipUpdate.js';
import { CAPTURE_RUNGS } from '../../src/data/people/dmPowerLines.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { legacyConfig } from '../helpers/fortuneLegacyConfig.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { CARD_KINDS, GROUPING_REMOVERS, applyVeil, isHideable } from '../../src/domain/display/galleryVeil.js';

const STANDING = /** @type {any} */ (FORTUNE_LAW_TUNING.standing);
const LIT = SIZE_RELATIVE_FORTUNE_LAW_VERSION;
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const VISITOR = { _randomizePriorities: true };
/** [seed, dials?]: towns the measure saw the tail move (incl. two merits, stressed towns, W1's two), and two it did not */
const SEEDS = [
  ['hxd-hamlet-39'], ['hxd-village-20'], ['hxd-thorp-30'], ['hxd-hamlet-27'], ['hxd-town-33'], ['hxd-metropolis-91'],
  ['hxd-metropolis-73'], ['hxd-city-15'], ['hxd-thorp-2'], ['hxd-town-0'], ['hxd-city-2'],
  ['hxr-metropolis-30', DIALS], ['hxr-town-42', DIALS], ['hxr-village-3', DIALS], ['hxr-hamlet-22', DIALS], ['hxr-town-30', DIALS],
  ['visitor-thorp-52', VISITOR], ['visitor-hamlet-139', VISITOR], ['visitor-village-8', VISITOR],
];
const sizeOf = (/** @type {string} */ seed) => seed.split('-')[1];
/** @param {string} seed @param {object|undefined} dials @param {unknown} [law] the marker forced AFTER birthConfig;
 *  absent, a LEGACY config (the law's key deleted, whatever the dial) */
const configOf = (seed, dials, law) => {
  const config = { ...DEFAULT_CONFIG, settType: sizeOf(seed), ...(dials || {}) };
  return law === undefined ? legacyConfig(config) : { ...birthConfig(config), [FORTUNE_LAW_CONFIG_KEY]: law };
};
const birth = (/** @type {string} */ seed, /** @type {any} */ dials, /** @type {unknown} */ law) => /** @type {any} */ (generateSettlementPipeline(configOf(seed, dials, law), null, { seed, customContent: {} }));
const requestFor = (/** @type {any} */ fullConfig, /** @type {string} */ seed) => ({
  kind: GENERATION_REQUEST_KIND, v: GENERATION_PROTOCOL_VERSION, op: 'settlement', requestId: 'u5a',
  payload: { fullConfig, neighbour: null, seed, contentRuntime: { customContent: {} }, previousSettlement: null, locks: null },
});
/** a town's bytes with the law's marker left out (the version-1 birth carries it; the unmarked one does not) */
const bytesWithoutMarker = (/** @type {unknown} */ town) => JSON.stringify(town, (key, value) => (key === FORTUNE_LAW_CONFIG_KEY ? undefined : value));
/** the band tuple of a legitimacy object (everything but the score and its terms) */
const tupleOf = (/** @type {any} */ pl) => {
  const { score: _s, breakdown: _b, ...rest } = pl;
  return rest;
};
/** the pre-merit legitimacy of a stored one: its base score, banded by the one derivation, its terms without `merits` */
const preOf = (/** @type {any} */ pl) => {
  const { merits = 0, ...terms } = pl.breakdown || {};
  const base = pl.score - merits;
  const band = legitimacyBandFor(base);
  return { score: base, label: band.label, color: band.color, bg: band.bg, breakdown: terms, govMultiplier: band.govMultiplier, crimMultiplier: band.crimMultiplier, isEndorsed: band.isEndorsed, isApproved: band.isApproved, isTolerated: band.isTolerated, isContested: band.isContested, isLegitimacyCrisis: band.isLegitimacyCrisis, governanceFractured: band.governanceFractured };
};

/** @type {Array<{ seed: string, dials: any, town: any }>} */
let LAW2 = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  LAW2 = SEEDS.map(([seed, dials]) => ({ seed, dials, town: birth(seed, dials, LIT) }));
}, 120_000);
const moved = () => LAW2.filter(({ town }) => (town.powerStructure.publicLegitimacy.breakdown?.merits ?? 0) > 0);

describe('U5a (a) — DARK: no marker is law 1, and the trace partition and the rail do not move', () => {
  it('no step is added: the runner\'s order is the partition\'s declared order', () => {
    expect(getStepOrder()).toEqual([...TRACE_STEP_ORDER]);
  });

  // "with no marker" means a LEGACY config (the law's key deleted), not a bare birthConfig that mints the dial
  it('every seed with no marker is byte-identical to `_fortuneLawVersion: 1`, its trace and its rail included', () => {
    expectNoSeedFailures(collectSeedFailures(SEEDS, ([seed, dials]) => {
      const none = runGenerationRequest(requestFor(configOf(seed, dials), seed));
      const one = runGenerationRequest(requestFor(configOf(seed, dials, 1), seed));
      expect(bytesWithoutMarker(none.settlement)).toBe(JSON.stringify(none.settlement));
      expect(bytesWithoutMarker(one.settlement)).toBe(bytesWithoutMarker(none.settlement));
      expect(JSON.stringify(none.settlement.simulationTrace)).toBe(JSON.stringify(one.settlement.simulationTrace));
      expect(JSON.stringify(none.pipelineHistory)).toBe(JSON.stringify(one.pipelineHistory));
      expect(none.pipelineHistory.map((/** @type {any} */ row) => row.id)).toEqual([...TRACE_STEP_ORDER]);
      // the partition with nothing held IS the trace, by identity; with the power structure held it carries the record's own
      expect(partitionTrace(none.settlement.simulationTrace, none.settlement.simulationTrace, [])).toBe(none.settlement.simulationTrace);
      expect(JSON.stringify(partitionTrace(none.settlement.simulationTrace, one.settlement.simulationTrace, ['powerStructure']))).toBe(JSON.stringify(none.settlement.simulationTrace));
    }), 'every town of the arm');
  }, 120_000);

  it('under law 2 the rail names the same steps and the trace no step outside them: the tail is no step', () => {
    expectNoSeedFailures(collectSeedFailures(SEEDS.slice(0, 4), ([seed, dials]) => {
      const lit = runGenerationRequest(requestFor(configOf(seed, dials, LIT), seed));
      expect(lit.pipelineHistory.map((/** @type {any} */ row) => row.id)).toEqual([...TRACE_STEP_ORDER]);
      for (const entry of lit.settlement.simulationTrace || []) expect(TRACE_STEP_ORDER.includes(entry.step) || entry.step === 'people-allegiance').toBe(true);
    }), 'every town of the arm');
  }, 60_000);
});

describe('U5a (f) — BORN under law 2: the stored band, the points, never below the birth', () => {
  it('the forced births move some towns and leave others (anti-vacuity)', () => {
    expect(moved().length).toBeGreaterThanOrEqual(8);
    expect(LAW2.length - moved().length).toBeGreaterThanOrEqual(1);
    expect(moved().some(({ town }) => town.powerStructure.publicLegitimacy.isEndorsed)).toBe(true);
  });

  it('every stored legitimacy is the band of its score; `merits` is the rule\'s points for the merits named', () => {
    expectNoSeedFailures(collectSeedFailures(LAW2, ({ seed, town }) => {
      const pl = town.powerStructure.publicLegitimacy;
      expect(tupleOf(pl), seed).toEqual(tupleOf({ ...legitimacyBandFor(pl.score) }));
      const pre = preOf(pl);
      const names = meritsOf(town);
      const raised = Math.max(0, Math.min(100, pre.score + STANDING.meritPoints * names.length));
      const reasons = names.length + Object.values(pre.breakdown).filter((v) => typeof v === 'number' && v > 0).length;
      const want = raised >= LEGITIMACY_CUTS.endorsed && reasons < STANDING.endorsedMinReasons ? Math.max(pre.score, LEGITIMACY_CUTS.endorsed - 1) : raised;
      expect(pl.score, seed).toBe(want);
      expect(pl.breakdown.merits, seed).toBe(want > pre.score ? want - pre.score : undefined);
      expect('merits' in pl.breakdown, seed).toBe(want > pre.score);
      expect(pl.score).toBeGreaterThanOrEqual(pre.score);
      if (names.length) expect(pre.score).toBeGreaterThanOrEqual(LEGITIMACY_CUTS.tolerated);
    }), 'every town of the arm');
  });

  it('play-time `reBand` stamps the same tuple as the birth for every score 0..100 (reached through advanceTime)', () => {
    const base = moved()[0].town;
    /** @type {Map<number, any>} */
    const seen = new Map();
    for (const archetype of supportedArchetypes()) {
      for (let start = 0; start <= 100; start += 1) {
        const town = { ...base, powerStructure: { ...base.powerStructure, publicLegitimacy: { ...legitimacyBandFor(start), score: start, breakdown: {} } } };
        const after = advanceTime(town, { activeConditions: [archetype] }).newSettlement.powerStructure?.publicLegitimacy;
        if (!after || after.score === start) break;
        seen.set(after.score, after);
      }
    }
    for (let score = 0; score <= 100; score++) {
      const after = seen.get(score);
      if (!after) continue;
      const band = legitimacyBandFor(score);
      for (const key of ['label', 'color', 'govMultiplier', 'crimMultiplier', 'isEndorsed', 'isApproved', 'isTolerated', 'isContested', 'isLegitimacyCrisis', 'governanceFractured']) {
        expect(after[key], `${score} ${key}`).toBe(/** @type {any} */ (band)[key]);
      }
    }
    // every cut is crossed by some tick, so every band's tuple was compared
    for (const cut of Object.values(LEGITIMACY_CUTS)) expect(seen.has(cut) || seen.has(cut - 1)).toBe(true);
  }, 120_000);
});

describe('U5a (g) — the census\'s word-writers on every moved town, and condition 3\'s arm', () => {
  const entriesOf = (/** @type {any} */ s) => (Array.isArray(s) ? s.filter((e) => e && typeof e === 'object') : s && typeof s === 'object' ? [s] : []);
  const ranked = (/** @type {any} */ s) => entriesOf(s).map((e, at) => ({ e, at })).sort((a, b) => ((/** @type {any} */ (STRESS_SEVERITY_WEIGHT))[String(b.e.type)] || 0) - ((/** @type {any} */ (STRESS_SEVERITY_WEIGHT))[String(a.e.type)] || 0) || a.at - b.at).map(({ e }) => e);
  const stakesOfCast = (/** @type {any} */ casts) => JSON.stringify([...casts].map(([k, v]) => [k, (v.stakes || []).map((/** @type {any} */ x) => [x.factionId, x.stake, x.reason])]));

  it('W1: the seat-criminal direction is the stored band\'s, and re-running the capture rows changes nothing', () => {
    let rows = 0;
    expectNoSeedFailures(collectSeedFailures(moved(), ({ seed, town }) => {
      const ps = town.powerStructure;
      const byName = (/** @type {string} */ n) => ps.factions.find((/** @type {any} */ f) => f.faction === n);
      for (const r of ps.factionRelationships || []) {
        if (r?.captureState === undefined || !Array.isArray(r.pair)) continue;
        const [g, c] = r.pair.map(byName);
        if (!g || !c || !g.isGoverning) continue;
        rows++;
        expect(r.direction, seed).toBe(govCriminalRelation(g, c, r.captureState, ps.publicLegitimacy).direction);
      }
      expect(JSON.stringify(withCaptureRelations(ps, ps.criminalCaptureState).factionRelationships), seed).toBe(JSON.stringify(ps.factionRelationships));
    }), 'every town of the arm');
    expect(rows).toBeGreaterThan(0);
  });

  it('W2: the standing sentences re-run from the pre-merit band change nothing (run twice: the same)', () => {
    expectNoSeedFailures(collectSeedFailures(moved(), ({ seed, town }) => {
      const ps = town.powerStructure;
      expect(settleStandingToLegitimacy(ps, preOf(ps.publicLegitimacy), town), seed).toBe(ps);
      expect(settleStandingToLegitimacy(ps, ps.publicLegitimacy, town), seed).toBe(ps);
    }), 'every town of the arm');
  });

  it('W3: the legitimacy tension twins are the identity at both bands on every moved town', () => {
    expectNoSeedFailures(collectSeedFailures(moved(), ({ seed, town }) => {
      const ts = town.history?.currentTensions || [];
      expect(legitimacyHeldTensions(ts, { publicLegitimacy: preOf(town.powerStructure.publicLegitimacy) }), seed).toBe(ts);
      expect(legitimacyHeldTensions(ts, { publicLegitimacy: town.powerStructure.publicLegitimacy }), seed).toBe(ts);
    }), 'every town of the arm');
  });

  it('W4: the stored crisis stakes are the cast derived at the stored band (the cast runs after the tail)', () => {
    let stressed = 0;
    expectNoSeedFailures(collectSeedFailures(moved(), ({ seed, town }) => {
      if (!entriesOf(town.stress).length) return;
      stressed++;
      const stored = JSON.stringify(ranked(town.stress).filter((e) => e.cast).map((e) => [String(e.type), (e.cast.stakes || []).map((/** @type {any} */ x) => [x.factionId, x.stake, x.reason])]));
      expect(stored, seed).toBe(stakesOfCast(deriveCrisisCast(town, ranked(town.stress), String(town._seed), {})));
    }), 'every town of the arm');
    expect(stressed).toBeGreaterThan(0);
  });

  it('W5: the law band never falls on a moved town, and every law atom of the flavour pool is a floor', () => {
    expectNoSeedFailures(collectSeedFailures(moved(), ({ seed, town }) => {
      const pre = lawBandOf({ ...town, powerStructure: { ...town.powerStructure, publicLegitimacy: preOf(town.powerStructure.publicLegitimacy) } });
      expect(LAW_ORDER_RUNGS.indexOf(lawBandOf(town)), seed).toBeGreaterThanOrEqual(LAW_ORDER_RUNGS.indexOf(pre));
    }), 'every town of the arm');
    /** @type {string[]} */
    const atoms = [];
    const walk = (/** @type {unknown} */ v) => {
      if (typeof v === 'string') {
        if (/^law:/.test(v)) atoms.push(v);
      } else if (v && typeof v === 'object') {
        Object.values(v).forEach(walk);
      }
    };
    walk(POLITICAL_FLAVOR);
    expect(atoms.length).toBeGreaterThan(0);
    for (const atom of atoms) expect(atom.startsWith('law: ≥')).toBe(true);
  });

  it('the ARM: on every moved town, re-running the tail (and so its word-writers) changes nothing', async () => {
    const { settleMeritsOfRule } = await import('../../src/domain/fortune/fortuneMerits.js');
    const seams = { bandFor: legitimacyBandFor, recapture: withCaptureRelations, restand: settleStandingToLegitimacy };
    expectNoSeedFailures(collectSeedFailures(moved(), ({ seed, town }) => {
      const text = JSON.stringify(town);
      const copy = structuredClone(town);
      expect(JSON.stringify(settleMeritsOfRule(copy, seams)), seed).toBe(text);
    }), 'every town of the arm');
  });
});

describe('U5a (5) — the capture rung is never read: one score on the owner\'s page and a shared one', () => {
  const seams = { bandFor: legitimacyBandFor, recapture: withCaptureRelations, restand: settleStandingToLegitimacy };
  /** the town at its pre-merit legitimacy, with its seat's rung (state and the governing row's seed) set to `rung` */
  const atRung = (/** @type {any} */ town, /** @type {string} */ rung) => {
    const copy = structuredClone(town);
    copy.powerStructure.publicLegitimacy = preOf(town.powerStructure.publicLegitimacy);
    copy.powerStructure.criminalCaptureState = rung;
    copy.powerStructure.factions = copy.powerStructure.factions.map((/** @type {any} */ f) => (f.isGoverning ? { ...f, captureState: rung } : f));
    return copy;
  };

  it('a place BORN captured carries its merit (hxd-metropolis-73)', () => {
    const town = LAW2.find((x) => x.seed === 'hxd-metropolis-73')?.town;
    expect(['corrupted', 'capture'].filter((r) => CAPTURE_RUNGS.includes(r))).toContain(town.powerStructure.criminalCaptureState);
    expect(meritsOf(town).length).toBeGreaterThan(0);
    expect(town.powerStructure.publicLegitimacy.breakdown.merits).toBe(STANDING.meritPoints * meritsOf(town).length);
  });

  it('every forced birth at every rung of the ladder: the same merits and the same score as at its own rung', async () => {
    const { settleMeritsOfRule } = await import('../../src/domain/fortune/fortuneMerits.js');
    let compared = 0;
    expectNoSeedFailures(collectSeedFailures(LAW2, ({ seed, town }) => {
      const own = settleMeritsOfRule(atRung(town, town.powerStructure.criminalCaptureState), seams).powerStructure.publicLegitimacy;
      expect(own.score, seed).toBe(town.powerStructure.publicLegitimacy.score);
      for (const rung of CAPTURE_RUNGS) {
        const rec = settleMeritsOfRule(atRung(town, rung), seams);
        expect(meritsOf(rec), `${seed} at ${rung}`).toEqual(meritsOf(town));
        expect(rec.powerStructure.publicLegitimacy.score, `${seed} at ${rung}`).toBe(own.score);
        expect(rec.powerStructure.publicLegitimacy.breakdown, `${seed} at ${rung}`).toEqual(own.breakdown);
        compared++;
      }
    }), 'every town of the arm');
    expect(compared).toBe(LAW2.length * CAPTURE_RUNGS.length);
  });
});

describe('U5a (S) — every input of the merit is served, unchanged, on every shared read', () => {
  /** the widest veil the registry admits: every grouping, and every field class of every card kind */
  const WIDEST = [
    ...Object.keys(GROUPING_REMOVERS),
    ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((field) => `class:${kind}:${field}`)),
  ].filter((address) => isHideable(address));

  it('the widest veil is wide (anti-vacuity)', () => {
    expect(WIDEST.length).toBeGreaterThan(Object.keys(GROUPING_REMOVERS).length);
  });

  it('the shared read, plain and under the widest veil, recomputes the owner\'s merits; the score and terms ride unchanged', () => {
    expectNoSeedFailures(collectSeedFailures(LAW2, ({ seed, town }) => {
      for (const shared of [toPublicSafe(town), applyVeil(toPublicSafe(town), WIDEST)]) {
        expect(meritsOf(shared), seed).toEqual(meritsOf(town));
        expect(shared.powerStructure.publicLegitimacy.score, seed).toBe(town.powerStructure.publicLegitimacy.score);
        expect(shared.powerStructure.publicLegitimacy.breakdown, seed).toEqual(town.powerStructure.publicLegitimacy.breakdown);
      }
    }), 'every town of the arm');
    expect(moved().length).toBeGreaterThan(0);
  });
});

describe('U7 — LASTING, the second merit: a place that has lasted, through the same gates and points', () => {
  const seams = { bandFor: legitimacyBandFor, recapture: withCaptureRelations, restand: settleStandingToLegitimacy };
  /** the lasting age of the size the record carries (`tier`, else `config.settType`), from the law's table */
  const lastingAgeOf = (/** @type {any} */ town) => STANDING.lastingAgeBySize[town.tier ?? town.config?.settType];
  /** does the record pass the merits' gates, on the birth's own score? */
  const gated = (/** @type {any} */ town) => {
    const pl = town.powerStructure.publicLegitimacy;
    return pl.score - (pl.breakdown?.merits ?? 0) >= LEGITIMACY_CUTS.tolerated && !rulerTroubled(town);
  };
  const lasting = () => LAW2.filter(({ town }) => meritsOf(town).includes('lasting'));
  /** a legitimacy of the birth's shape at a score, all four terms 0 */
  const legitimacyAt = (/** @type {number} */ score) => ({ ...legitimacyBandFor(score), score, breakdown: { prosperity: 0, safety: 0, defense: 0, food: 0 } });

  it('the table: one lasting age for each of the six sizes, frozen, each inside that size\'s own age range', () => {
    const byAge = STANDING.lastingAgeBySize;
    expect(byAge && typeof byAge).toBe('object');
    expect(Object.isFrozen(byAge)).toBe(true);
    expect(Object.keys(byAge).sort()).toEqual(Object.keys(AGE_BY_TIER).sort());
    for (const [size, range] of Object.entries(AGE_BY_TIER)) {
      expect(byAge[size], size).toBeGreaterThanOrEqual(range.min);
      expect(byAge[size], size).toBeLessThanOrEqual(range.max);
    }
    expect(MERIT_NAMES).toEqual(['weathered', 'lasting']);
  });

  it('every forced birth: `lasting` is credited exactly where history.age reaches its size\'s age and the gates pass', () => {
    let credited = 0;
    expectNoSeedFailures(collectSeedFailures(LAW2, ({ seed, town }) => {
      const want = gated(town) && typeof town.history?.age === 'number' && town.history.age >= lastingAgeOf(town);
      expect(typeof lastingAgeOf(town), seed).toBe('number');
      expect(meritsOf(town).includes('lasting'), seed).toBe(want);
      if (want) credited += 1;
    }), 'every town of the arm');
    expect(credited).toBeGreaterThanOrEqual(2);
    expect(LAW2.some(({ town }) => meritsOf(town).length === 1 && meritsOf(town)[0] === 'lasting')).toBe(true);
    expect(LAW2.some(({ town }) => meritsOf(town).length === MERIT_NAMES.length)).toBe(true);
  });

  it('two merits are two reasons at the Endorsed guard; one merit alone is not', () => {
    const at = LEGITIMACY_CUTS.endorsed - STANDING.meritPoints * MERIT_NAMES.length;
    expect(MERIT_NAMES.length).toBe(2);
    const both = meritedLegitimacy(legitimacyAt(at), [...MERIT_NAMES], legitimacyBandFor);
    expect(both.score).toBe(LEGITIMACY_CUTS.endorsed);
    expect(both.isEndorsed).toBe(true);
    const lone = meritedLegitimacy(legitimacyAt(LEGITIMACY_CUTS.endorsed - STANDING.meritPoints), ['lasting'], legitimacyBandFor);
    expect(lone.isEndorsed).toBe(false);
    expect(lone.score).toBe(LEGITIMACY_CUTS.endorsed - 1);
  });

  it('the edge is the table\'s own figure, and the size is read as the record carries it (tier, else config.settType)', () => {
    const town = lasting()[0]?.town;
    expect(town).toBeTruthy();
    const edge = lastingAgeOf(town);
    /** the born place re-settled at an age, its tier kept, dropped, or replaced */
    const at = (/** @type {number} */ age, /** @type {'keep'|'drop'|'nowhere'} */ tier = 'keep') => {
      const copy = structuredClone(town);
      copy.history.age = age;
      if (tier === 'drop') delete copy.tier;
      if (tier === 'nowhere') copy.tier = 'nowhere';
      return settleMeritsOfRule(copy, seams);
    };
    expect(meritsOf(at(edge)).includes('lasting')).toBe(true);
    expect(meritsOf(at(edge - 1)).includes('lasting')).toBe(false);
    expect(at(edge).powerStructure.publicLegitimacy.breakdown.merits).toBeGreaterThan(at(edge - 1).powerStructure.publicLegitimacy.breakdown.merits ?? 0);
    expect(meritsOf(at(edge, 'drop')).includes('lasting')).toBe(true);
    expect(meritsOf(at(edge - 1, 'drop')).includes('lasting')).toBe(false);
    expect(meritsOf(at(Number.MAX_SAFE_INTEGER, 'nowhere')).includes('lasting')).toBe(false);
  });

  it('DARK: under law 1 and a legacy config a lasting place is born with no merits, and the tail returns it untouched', () => {
    const seeds = SEEDS.filter(([seed]) => lasting().some((x) => x.seed === seed));
    expect(seeds.length).toBeGreaterThanOrEqual(2);
    expectNoSeedFailures(collectSeedFailures(seeds, ([seed, dials]) => {
      for (const law of [undefined, 1]) {
        const town = birth(seed, dials, law);
        expect('merits' in (town.powerStructure.publicLegitimacy.breakdown || {}), `${seed} law ${law}`).toBe(false);
        expect(meritsOf(town), `${seed} law ${law}`).toEqual([]);
        const text = JSON.stringify(town);
        expect(settleMeritsOfRule(town, seams), `${seed} law ${law}`).toBe(town);
        expect(JSON.stringify(town), `${seed} law ${law}`).toBe(text);
      }
    }), 'every lasting town of the arm');
  }, 120_000);

  it('a lit place without the lasting merit holds exactly the legitimacy of the first merit alone (the base tree\'s rule)', () => {
    const without = LAW2.filter(({ town }) => !meritsOf(town).includes('lasting'));
    expect(without.length).toBeGreaterThan(0);
    expectNoSeedFailures(collectSeedFailures(without, ({ seed, town }) => {
      const pl = town.powerStructure.publicLegitimacy;
      expect(meritedLegitimacy(preOf(pl), meritsOf(town).filter((name) => name === 'weathered'), legitimacyBandFor), seed).toEqual(pl);
    }), 'every town of the arm without it');
  });

  it('every lasting place at every capture rung, and on the shared read under the widest veil: the same merits and score', () => {
    const WIDEST = [
      ...Object.keys(GROUPING_REMOVERS),
      ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((field) => `class:${kind}:${field}`)),
    ].filter((address) => isHideable(address));
    let compared = 0;
    expectNoSeedFailures(collectSeedFailures(lasting(), ({ seed, town }) => {
      for (const rung of CAPTURE_RUNGS) {
        const copy = structuredClone(town);
        copy.powerStructure.publicLegitimacy = preOf(town.powerStructure.publicLegitimacy);
        copy.powerStructure.criminalCaptureState = rung;
        copy.powerStructure.factions = copy.powerStructure.factions.map((/** @type {any} */ f) => (f.isGoverning ? { ...f, captureState: rung } : f));
        const rec = settleMeritsOfRule(copy, seams);
        expect(meritsOf(rec), `${seed} at ${rung}`).toEqual(meritsOf(town));
        expect(rec.powerStructure.publicLegitimacy.score, `${seed} at ${rung}`).toBe(town.powerStructure.publicLegitimacy.score);
        compared += 1;
      }
      const shared = applyVeil(toPublicSafe(town), WIDEST);
      expect(meritsOf(shared), seed).toEqual(meritsOf(town));
      expect(shared.powerStructure.publicLegitimacy.score, seed).toBe(town.powerStructure.publicLegitimacy.score);
    }), 'every lasting town of the arm');
    expect(compared).toBe(lasting().length * CAPTURE_RUNGS.length);
    expect(compared).toBeGreaterThan(0);
  });
});
