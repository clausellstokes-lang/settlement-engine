/**
 * espionageMath.test.js — ES-0's arithmetic leaves.
 *
 * TWO THINGS THIS FILE REFUSES TO DO, because both are how a band table ships dead:
 *   1. It never asserts a rung set against a transcription of the table it is testing.
 *      The `law_order` rung reachability below is measured by RUNNING the real deriver
 *      over really-generated settlements, and the ladder it is compared against is
 *      `causalBand`'s own — not a copy.
 *   2. It never proves a product's factors are live by checking the product. Every term
 *      in `catchChance01` is dropped INDIVIDUALLY and the result must move. A factor
 *      that a caller silently stopped supplying would otherwise sit at its neutral
 *      value forever with every green test agreeing.
 */
import { describe, expect, test } from 'vitest';

import {
  DELIBERATION_VERDICTS,
  DEMAND_BANDS,
  ESPIONAGE_TUNING,
  MISSION_GRADES,
  MISSION_GRADE_ORDER,
  TAP_DEPTH,
  TAP_LEVELS,
  catchChance01,
  covertCompetence01,
  deliberationRead,
  dwellRamp,
  legStack,
  missionGradeFor,
  operativeNotoriety01,
  promotionRisk01Core,
  wariness01Core,
} from '../../src/domain/worldPulse/espionage/espionageMath.js';
import {
  ROADS_TUNING,
  embassyEnvoyWeight01,
  factionPowerStanding01,
  roadsImportanceWeight,
} from '../../src/domain/roads/state.js';
import { causalBand, deriveSystemVariable } from '../../src/domain/causalState.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const ROUTES = Object.freeze(['isolated', 'road', 'river', 'port', 'crossroads', 'mountain_pass']);
const CULTURES = Object.freeze(['germanic', 'nordic', 'celtic']);
const LAWFUL_PATRON = Object.freeze({ name: 'The Ordinant', lawAxis: 'lawful', moralAxis: 'good' });
const CHAOTIC_PATRON = Object.freeze({ name: 'The Unbound', lawAxis: 'chaotic', moralAxis: 'evil' });

/** Really generated settlements — the only corpus any reachability claim here reads. */
const CORPUS = [];
for (const settType of TIERS) {
  for (const tradeRouteAccess of ROUTES) {
    for (const culture of CULTURES) {
      CORPUS.push(generateSettlementPipeline(
        { settType, culture, tradeRouteAccess },
        null,
        { seed: `es0-math-${settType}-${tradeRouteAccess}-${culture}`, customContent: {} },
      ));
    }
  }
}

/** The catch chain with every factor at a value that is NOT its neutral element. */
const LIVE_FACTORS = Object.freeze({
  hostRung: ROADS_TUNING.T4_RUNG.cold_war,
  securityEff01: 0.7,
  orderBand: 'adequate',
  stressLoad01: 0.4,
  hasUnderways: true,
  hasInsideAsset: true,
  wariness01: 0.6,
  competence01: 0.5,
  stops: 2,
  intervalIdx: 1,
});

describe('operativeNotoriety01 — a consumer widening, not a second spelling', () => {
  test('it IS embassyEnvoyWeight01 over the roads resolvers, on real people', () => {
    // J-WR-10 forbids a rival spelling of an existing pure leaf. This pin is what makes
    // "we imported it" falsifiable: if a later edit re-derives the blend here, the two
    // sides diverge and this reds. Driven over REAL rosters so a resolver change on
    // either side is caught too.
    let compared = 0;
    for (const settlement of CORPUS) {
      for (const npc of (settlement.npcs || []).slice(0, 4)) {
        const expected = embassyEnvoyWeight01({
          importanceWeight01: roadsImportanceWeight(npc),
          factionPower01: factionPowerStanding01(settlement, npc),
        });
        expect(operativeNotoriety01(settlement, npc)).toBe(expected);
        compared += 1;
      }
    }
    // Guard the guard: an empty roster would make the loop above prove nothing.
    expect(compared, 'the corpus produced no people to compare').toBeGreaterThan(50);
  });

  test('it spans a real range on a real corpus — a constant would be a dead term', () => {
    const values = new Set();
    for (const settlement of CORPUS) {
      for (const npc of settlement.npcs || []) values.add(operativeNotoriety01(settlement, npc));
    }
    expect(values.size, 'notoriety is constant across the whole corpus').toBeGreaterThan(3);
  });
});

describe('covertCompetence01 — the criminal court trains a better spy', () => {
  test('it is bounded, real, and moves with the corpus', () => {
    const values = [];
    for (const settlement of CORPUS) {
      for (const npc of (settlement.npcs || []).slice(0, 3)) {
        const value = covertCompetence01(settlement, npc);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
        values.push(value);
      }
    }
    expect(new Set(values).size, 'competence is constant — a term is dead').toBeGreaterThan(3);
  });

  test('fame is a DRAG, and the notability term is genuinely live', () => {
    // The design's joke made arithmetic: the realm's most notable person is its worst
    // operative. Two people in the SAME town, differing only in ladder importance.
    const settlement = CORPUS.find((s) => (s.npcs || []).length > 0);
    const base = { ...(settlement.npcs || [])[0] };
    const nobody = { ...base, importance: 'minor', role: 'minor' };
    const pillar = { ...base, importance: 'pillar', role: 'pillar' };
    const nobodyFame = operativeNotoriety01(settlement, nobody);
    const pillarFame = operativeNotoriety01(settlement, pillar);
    // Only assert the drag where the fixture really produces different fame — otherwise
    // the claim would be about the roster shape, not about this function.
    if (pillarFame > nobodyFame) {
      expect(covertCompetence01(settlement, pillar))
        .toBeLessThan(covertCompetence01(settlement, nobody));
    }
    expect(pillarFame).toBeGreaterThanOrEqual(nobodyFame);
  });
});

describe('legStack — the third stop is a bet, not free efficiency', () => {
  test('the three rungs are exactly x1 / x1.35 / x2.4 at the proposed weight', () => {
    expect(legStack(1)).toBe(1);
    expect(legStack(2)).toBe(1.35);
    expect(legStack(3)).toBe(2.4);
  });

  test('it is strictly increasing over the legal range and clamps outside it', () => {
    expect(legStack(2)).toBeGreaterThan(legStack(1));
    expect(legStack(3)).toBeGreaterThan(legStack(2));
    // A bad index is a multiplier in a product: clamping keeps a caller bug local
    // instead of turning it into a NaN two frames away.
    expect(legStack(0)).toBe(legStack(1));
    expect(legStack(99)).toBe(legStack(ESPIONAGE_TUNING.MAX_ITINERARY_STOPS));
    expect(legStack('nonsense')).toBe(legStack(1));
  });
});

describe('dwellRamp — a face seen too long gets noticed', () => {
  test('interval 0 is EXACTLY 1, so a mission that never roots is unramped', () => {
    // The byte-identity claim for every within-plan mission rests on this one value.
    expect(dwellRamp(0)).toBe(1);
    expect(dwellRamp(-5)).toBe(1);
    expect(dwellRamp('x')).toBe(1);
  });

  test('every band is reachable and the ladder is monotone non-decreasing', () => {
    const produced = ESPIONAGE_TUNING.DWELL_RAMP.map((_, index) => dwellRamp(index));
    expect(produced).toEqual([...ESPIONAGE_TUNING.DWELL_RAMP]);
    for (let i = 1; i < produced.length; i += 1) {
      expect(produced[i]).toBeGreaterThan(produced[i - 1]);
    }
    // And it plateaus rather than running off the end of the table.
    expect(dwellRamp(ESPIONAGE_TUNING.DWELL_RAMP.length + 10))
      .toBe(ESPIONAGE_TUNING.DWELL_RAMP[ESPIONAGE_TUNING.DWELL_RAMP.length - 1]);
  });
});

describe('catchChance01 — the stay-detection roll', () => {
  test('A FRIENDLY HOST ROLLS NOTHING', () => {
    // anchored: §3.3(b) — the catch surface is hostile-class stops and army collisions
    // ONLY. The friend case reaches the world through §3.5's exposure road instead, and
    // that is what makes the betrayal an exposure event rather than a patrol event.
    // Expressed as arithmetic rather than as a caller-side condition somebody can forget.
    for (const hostRung of [undefined, null, 0, 'friendly', -1, 4, NaN]) {
      expect(catchChance01({ ...LIVE_FACTORS, hostRung })).toBe(0);
    }
    // And the three hostile rungs really do roll — otherwise the negative above is
    // measuring an inert function.
    for (const rung of Object.values(ROADS_TUNING.T4_RUNG)) {
      expect(catchChance01({ ...LIVE_FACTORS, hostRung: rung })).toBeGreaterThan(0);
    }
  });

  test('the hostility rung scales the roll', () => {
    const rival = catchChance01({ ...LIVE_FACTORS, hostRung: ROADS_TUNING.T4_RUNG.rival });
    const cold = catchChance01({ ...LIVE_FACTORS, hostRung: ROADS_TUNING.T4_RUNG.cold_war });
    const hostile = catchChance01({ ...LIVE_FACTORS, hostRung: ROADS_TUNING.T4_RUNG.hostile });
    expect(cold).toBeGreaterThan(rival);
    expect(hostile).toBeGreaterThan(cold);
  });

  test('EVERY factor is individually live (the dropped-term battery)', () => {
    // THE CONJUNCTION-COVERAGE LAW, applied to a product. Each mutant below neutralises
    // exactly ONE term; if the result does not move, that term is dead and every other
    // test in this file would still pass.
    const live = catchChance01(LIVE_FACTORS);
    /** @type {Array<[string, Record<string, unknown>]>} */
    const mutants = [
      ['securityEff01 (the dragged watch — J-ES-3\'s single dip)', { securityEff01: 1 }],
      ['orderBand (the LIVE term the frozen climate cannot supply)', { orderBand: 'surplus' }],
      ['stressLoad01 (addition C: stressed is porous)', { stressLoad01: 0 }],
      ['hasUnderways (the target\'s clandestine facet)', { hasUnderways: false }],
      ['hasInsideAsset (addition C: the web is espionage infrastructure)', { hasInsideAsset: false }],
      ['wariness01 (§3.8\'s derived tell)', { wariness01: 0 }],
      ['competence01 (§3.2\'s shelter)', { competence01: 0 }],
      ['stops (§3.4\'s superlinear leg stack)', { stops: 1 }],
      ['intervalIdx (§3.4b\'s dwell ramp)', { intervalIdx: 0 }],
    ];
    for (const [what, patch] of mutants) {
      expect(catchChance01({ ...LIVE_FACTORS, ...patch }), `${what} is a DEAD term`).not.toBe(live);
    }
  });

  test('an unreadable order band degrades to the neutral rung, never to NaN', () => {
    const neutral = catchChance01({ ...LIVE_FACTORS, orderBand: 'adequate' });
    expect(catchChance01({ ...LIVE_FACTORS, orderBand: 'nonsense' })).toBe(neutral);
    expect(catchChance01({ ...LIVE_FACTORS, orderBand: undefined })).toBe(neutral);
  });

  test('the cap binds and the floor holds', () => {
    const maxed = catchChance01({
      hostRung: ROADS_TUNING.T4_RUNG.hostile,
      securityEff01: 1,
      orderBand: 'surplus',
      stressLoad01: 0,
      hasUnderways: false,
      hasInsideAsset: false,
      wariness01: 1,
      competence01: 0,
      stops: 3,
      intervalIdx: 9,
    });
    expect(maxed).toBeLessThanOrEqual(ESPIONAGE_TUNING.CATCH_CAP);
    expect(maxed).toBeGreaterThan(0);
    expect(catchChance01(null)).toBe(0);
  });

  test('ORDER_FACTOR is TOTAL over causalBand, and every rung is REACHABLE on real worlds', () => {
    // The dead-band law, executed rather than asserted. `surplus` is reachable ONLY
    // through the patron-deity law lever, which is why the corpus carries patrons: a
    // deity-free corpus alone would "prove" the top rung dead and invite it to be cut,
    // leaving `ORDER_FACTOR[band]` undefined for every lawfully-patroned metropolis.
    const scoreOf = (settlement) => {
      const read = deriveSystemVariable('law_order', settlement);
      return typeof read === 'number' ? read : read?.score;
    };
    const produced = new Set();
    for (const settlement of CORPUS) {
      for (const patron of [null, LAWFUL_PATRON, CHAOTIC_PATRON]) {
        const row = patron
          ? { ...settlement, config: { ...(settlement.config || {}), primaryDeitySnapshot: patron } }
          : settlement;
        produced.add(causalBand(scoreOf(row)));
      }
    }
    // Every rung the world can produce has a factor.
    for (const band of produced) {
      expect(ESPIONAGE_TUNING.ORDER_FACTOR[band], `${band} has no ORDER_FACTOR rung`).toBeTypeOf('number');
    }
    // And the table has no rung the ladder does not carry (no invented sixth band).
    for (const band of Object.keys(ESPIONAGE_TUNING.ORDER_FACTOR)) {
      expect(produced.has(band), `ORDER_FACTOR carries ${band}, which the corpus never produced`).toBe(true);
    }
    expect(produced.size, 'the corpus collapsed to one rung — every claim here is vacuous').toBeGreaterThan(3);
    // A collapsed rule of law catches almost nobody; a working one catches more.
    expect(ESPIONAGE_TUNING.ORDER_FACTOR.collapsed).toBeLessThan(ESPIONAGE_TUNING.ORDER_FACTOR.adequate);
    expect(ESPIONAGE_TUNING.ORDER_FACTOR.surplus).toBeGreaterThan(ESPIONAGE_TUNING.ORDER_FACTOR.adequate);
  });
});

describe('the closed vocabularies (owner additions G and H)', () => {
  test('TAP_LEVELS is sorted, and the DEPTH order is deliberately not the sort order', () => {
    expect([...TAP_LEVELS]).toEqual([...TAP_LEVELS].sort());
    expect(Object.keys(TAP_DEPTH).sort()).toEqual([...TAP_LEVELS]);
    // A consumer that ranked by array index would put an open visitor's hearsay above an
    // embedded agent's read. The two orders differ, and that difference is the pin.
    const byIndex = [...TAP_LEVELS];
    const byDepth = [...TAP_LEVELS].sort((a, b) => TAP_DEPTH[a] - TAP_DEPTH[b]);
    expect(byDepth).not.toEqual(byIndex);
    expect(byDepth).toEqual(['performance', 'beliefs', 'delta']);
  });

  test('MISSION_GRADES is sorted, ranked separately, and every grade is reachable', () => {
    expect([...MISSION_GRADES]).toEqual([...MISSION_GRADES].sort());
    expect(Object.keys(MISSION_GRADE_ORDER).sort()).toEqual([...MISSION_GRADES]);
    const produced = new Set();
    for (const demand of DEMAND_BANDS) {
      for (const bestConfidence01 of [0, 0.1, 0.5, 0.7, 0.9, 1]) {
        produced.add(missionGradeFor({ demand, bestConfidence01 }));
      }
    }
    expect([...produced].sort()).toEqual([...MISSION_GRADES]);
    // `empty` is the honesty arm: a host with no belief about the subject yields nothing.
    expect(missionGradeFor({ demand: 'confirm', bestConfidence01: 0 })).toBe('empty');
    // The bar really is the demand band — one bar, three consumers, no second spelling.
    expect(missionGradeFor({ demand: 'corroborate', bestConfidence01: 0.5 })).toBe('met');
    expect(missionGradeFor({ demand: 'certain', bestConfidence01: 0.5 })).toBe('partial');
  });

  test('DEMAND_BANDS and DELIBERATION_VERDICTS are sorted totality exports', () => {
    expect([...DEMAND_BANDS]).toEqual([...DEMAND_BANDS].sort());
    expect([...DELIBERATION_VERDICTS]).toEqual([...DELIBERATION_VERDICTS].sort());
    expect(Object.keys(ESPIONAGE_TUNING.DEMAND_FLOOR01).sort()).toEqual([...DEMAND_BANDS]);
    // The floors are a real ladder, or the grade is graded against noise.
    const { corroborate, confirm, certain } = ESPIONAGE_TUNING.DEMAND_FLOOR01;
    expect(corroborate).toBeLessThan(confirm);
    expect(confirm).toBeLessThan(certain);
  });
});

describe('the derived reads that stay pure cores at ES-0', () => {
  test('wariness01Core rises with both terms and saturates', () => {
    const T = ESPIONAGE_TUNING;
    expect(wariness01Core({ overdueNotables: 0, recentCovertHolds: 0 })).toBe(0);
    const tellOnly = wariness01Core({ overdueNotables: T.TELL_CAP, recentCovertHolds: 0 });
    const caughtOnly = wariness01Core({ overdueNotables: 0, recentCovertHolds: T.CAUGHT_CAP });
    expect(tellOnly).toBeGreaterThan(0);
    expect(caughtOnly).toBeGreaterThan(0);
    // BOTH terms live, separately — a single weighted sum is exactly where one term
    // quietly goes to zero and nothing notices.
    expect(tellOnly).not.toBe(caughtOnly);
    expect(wariness01Core({ overdueNotables: 99, recentCovertHolds: 99 })).toBe(1);
    expect(wariness01Core(null)).toBe(0);
  });

  test('promotionRisk01Core needs BOTH absence and pressure', () => {
    // A person who never left defends their rung normally, however contested it is; a
    // person abroad with no rival and no exposure loses nothing. The register is the
    // PRODUCT, and both halves are pinned so neither can go inert.
    expect(promotionRisk01Core({ awayWeeks: 0, rungExposure01: 1, rivalPressure01: 1 })).toBe(0);
    expect(promotionRisk01Core({ awayWeeks: 99, rungExposure01: 0, rivalPressure01: 0 })).toBe(0);
    const exposed = promotionRisk01Core({ awayWeeks: 6, rungExposure01: 1, rivalPressure01: 0 });
    const pressed = promotionRisk01Core({ awayWeeks: 6, rungExposure01: 0, rivalPressure01: 1 });
    expect(exposed).toBeGreaterThan(0);
    expect(pressed).toBeGreaterThan(0);
    const longer = promotionRisk01Core({ awayWeeks: 12, rungExposure01: 1, rivalPressure01: 1 });
    expect(longer).toBeGreaterThan(exposed);
    expect(longer).toBeLessThanOrEqual(1);
  });

  test('deliberationRead reaches all three verdicts, and urgency outranks everything', () => {
    const produced = new Set();
    // 1. URGENCY FORCES act_now — even with a perfectly dispatchable mission waiting.
    produced.add(deliberationRead({
      urgent: true, castable: true, decidingConfidence01: 0, dispatched: true, ticksSinceDispatch: 0,
    }));
    expect(deliberationRead({ urgent: true, castable: true, decidingConfidence01: 0 })).toBe('act_now');
    // 2. A stale leg and a castable operative buys the wait.
    produced.add(deliberationRead({ castable: true, decidingConfidence01: 0.1 }));
    // 3. Patience runs out and the court decides on a picture staler than when it began.
    produced.add(deliberationRead({
      dispatched: true, frequency01: 0, ticksSinceDispatch: ESPIONAGE_TUNING.PATIENCE_BASE_TICKS,
    }));
    expect([...produced].sort()).toEqual([...DELIBERATION_VERDICTS]);
    // EVERY GUARD IS SEPARATELY LOAD-BEARING, dropped one at a time.
    expect(deliberationRead({ castable: false, decidingConfidence01: 0.1 }), 'castable is dead').toBe('act_now');
    expect(deliberationRead({ castable: true, decidingConfidence01: 0.99 }), 'the confidence floor is dead').toBe('act_now');
    // A patient doctrine waits longer than an impatient one at the SAME elapsed clock.
    const elapsed = ESPIONAGE_TUNING.PATIENCE_BASE_TICKS + 1;
    expect(deliberationRead({ dispatched: true, frequency01: 0, ticksSinceDispatch: elapsed })).toBe('wait_expired');
    expect(deliberationRead({ dispatched: true, frequency01: 1, ticksSinceDispatch: elapsed })).toBe('dispatch_and_wait');
  });
});
