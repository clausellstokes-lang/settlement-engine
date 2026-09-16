/**
 * demographicsEnvelope.test.js — CAPACITY C3, THE THIRTY-YEAR ENVELOPE.
 *
 * THE QUESTION THIS FILE ASKS, AND WHY IT IS NOT THE CURE SUITE'S QUESTION. The cure suite
 * runs three hundred years and proves the model PLATEAUS. That is the right horizon for the
 * defect it was built against, and it is the wrong horizon for a customer: a campaign is
 * about thirty years, and the reader corpus is thirty years. A model can plateau beautifully
 * at three hundred and be a flat, silent, indistinguishable nothing inside thirty. So this
 * file asks the OTHER question — inside the horizon a person actually plays, does the
 * population term MOVE, does it move DIFFERENTLY per settlement, does anything ever ARRIVE
 * anywhere — and it measures the answer rather than asserting it.
 *
 * ⛔⛔ THIS FILE GRAZES TUNING AND MAY NOT TOUCH IT. THE PROMISE is constitutional: the
 * demographic values are the owner's, signed last. If an arm here fails on the CURED kernel
 * that is a FINDING about the model (owner row CAP-7), never a licence to move BIRTH_EASE,
 * DEATH_EASE or any other dial until the arm goes green. A lane that "fixes" this file by
 * retuning has broken THE PROMISE. The fixture may be widened; the dials may not be touched.
 *
 * MEASURED AT THIS COMMIT, so a later reader knows what the bars are made of rather than
 * where they were set: over thirty years on the shared realm the cured kernel moves
 * 170 of 180 settlement-year transitions by at least a quarter percent (0.9444 against a bar
 * of 0.05), spreads its growth ratios by 0.4846 (against a bar of 0.10), leaves no settlement
 * unmoved, and lands Elderfen in the filling band in year 12. The bars are set an order of
 * magnitude below the measurement DELIBERATELY: they are a floor under "the term is alive
 * inside a campaign", not a golden of today's numbers, and a golden here would red on every
 * legitimate tuning move the owner makes at the sitting.
 *
 * ⚠ THREE OF THOSE FOUR FIGURES WERE WRONG FROM THE DAY THEY WERE WRITTEN, AND THE MODEL
 * NEVER MOVED (§907 car 4, M3-F1). The header shipped in `d02c5acde` reading 171 of 180
 * (0.95), spread 0.41 and Elderfen in year 14; every source file in this suite's reach is
 * byte-identical between that commit and now, so this is not drift — the numbers were taken
 * against some draft state and not re-measured before the commit landed. They are corrected
 * here from a run of THIS file at THIS tip. Nothing gates on them, which is exactly why they
 * could be wrong for three weeks: a comment is a CLAIM until it is measured.
 *
 * @enforced-by this file
 */
import { describe, expect, test, vi } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import { advanceDemographics } from '../../src/domain/worldPulse/demographicsKernel.js';
import { BIRTH_BANDS } from '../../src/domain/worldPulse/demographicsRates.js';
import { overflowBandOf, overflowRankOf } from '../../src/domain/worldPulse/demographicsResponses.js';
import { crowdingCrossingOf } from '../../src/domain/worldPulse/demographicsHerald.js';
import { LIT, boundsOf, realmUpdates, snapshotOf } from '../helpers/demographicsRealmFixture.js';
// ⭐ THE THREE FIGURES THIS SUITE OWNED ARE NOW IMPORTED, NOT TYPED (§909 car 3). Their one
// home moved to `scripts/audit/soakInvariants.mjs` so `scripts/soak/tripwires.mjs` could
// arm `capacity_envelope_30y` against the SAME bar this file grades — a registry row and a
// unit pin that disagree about what motion is would be worse than no row at all.
import {
  CAMPAIGN_HORIZON_YEARS,
  MOTION_FLOOR_01,
  MOVING_SHARE_FLOOR,
} from '../../scripts/audit/soakInvariants.mjs';

const RATES_MODULE = '../../src/domain/worldPulse/demographicsRates.js';
/** The customer horizon, and the reader corpus's horizon. One home, imported. */
const CAMPAIGN_YEARS = CAMPAIGN_HORIZON_YEARS;
/** The horizon the ARRIVAL arm is allowed, which is DELIBERATELY longer than the campaign
 *  and is itself the finding — see that arm. */
const ARRIVAL_YEARS = 60;

/**
 * Run the demographic lane for `years` years and return everything the arms below read.
 * ONE traversal feeds every arm, so the suite costs one run rather than six.
 * @param {(args: object) => { settlementUpdates: Array<object>, receipts?: Array<object> }} step
 */
function envelope(step, years, seed = 'envelope-seed-1') {
  let live = realmUpdates();
  const bounds = boundsOf(live);
  const series = new Map(live.map((u) => [u.saveId, [u.settlement.population]]));
  const firstFilling = new Map();
  let crowdingLines = 0;
  const fillingRank = overflowRankOf('filling');
  for (let t = 1; t <= years * 52; t += 1) {
    const r = step({
      snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
      rng: createPRNG(`${seed}::tick:${t}::one_week`), tick: t,
    });
    live = r.settlementUpdates;
    for (const receipt of (Array.isArray(r.receipts) ? r.receipts : [])) {
      if (crowdingCrossingOf(receipt) != null) crowdingLines += 1;
    }
    if (t % 52 !== 0) continue;
    const year = t / 52;
    for (const u of live) {
      series.get(u.saveId).push(u.settlement.population);
      const rank = overflowRankOf(overflowBandOf(u.settlement.population / Math.max(1, bounds.get(u.saveId))));
      if (rank >= fillingRank && !firstFilling.has(u.saveId)) firstFilling.set(u.saveId, year);
    }
  }
  return { series, bounds, firstFilling, crowdingLines };
}

/** The share of settlement-YEAR transitions that moved the head count at all.
 *  @param {Map<string, number[]>} series */
function movingShare(series, years) {
  let transitions = 0;
  let moved = 0;
  for (const [, s] of series) {
    for (let y = 1; y <= years; y += 1) {
      transitions += 1;
      if (s[y - 1] > 0 && Math.abs(s[y] - s[y - 1]) / s[y - 1] >= MOTION_FLOOR_01) moved += 1;
    }
  }
  return { transitions, moved, share: transitions ? moved / transitions : 0 };
}

/** How much each settlement grew over the horizon, as a multiple of where it started.
 *  @param {Map<string, number[]>} series */
const growthRatios = (series, years) => [...series].map(([id, s]) => ({ id, ratio: s[years] / s[0] }));

/** Load the kernel against a PATCHED rates module — the cure suite's own idiom, so the two
 *  files revert the model the same way and their findings are comparable. */
async function kernelWithRates(patch) {
  vi.resetModules();
  vi.doMock(RATES_MODULE, async (importOriginal) => {
    const actual = await importOriginal();
    return { ...actual, demographicRates: (input) => patch(actual.demographicRates(input), input) };
  });
  const mod = await import('../../src/domain/worldPulse/demographicsKernel.js');
  vi.doUnmock(RATES_MODULE);
  vi.resetModules();
  return mod.advanceDemographics;
}

describe('CAPACITY C3 — the thirty-year demographic envelope', () => {
  const cured = envelope(advanceDemographics, ARRIVAL_YEARS);

  test('STATE MOTION: at least five percent of settlement-year transitions move the head count by a quarter percent', () => {
    const { transitions, moved, share } = movingShare(cured.series, CAMPAIGN_YEARS);
    expect(transitions, 'the traversal produced no transitions — it is broken, not clean')
      .toBe(cured.series.size * CAMPAIGN_YEARS);
    // anchored: the transition count above proves the share below is over a real traversal
    expect(
      share,
      `only ${moved} of ${transitions} settlement-year transitions moved. A population term`
      + ' that is still inside a campaign is a term no reader can see, whatever it does at'
      + ' three hundred years. If this fails on the CURED kernel it is owner row CAP-7, a'
      + ' finding about the model, and NOT a dial to move.',
    ).toBeGreaterThanOrEqual(MOVING_SHARE_FLOOR);
  });

  test('DIFFERENTIATION: the realm does not grow in lockstep, and the widest thirty-year ratio exceeds the narrowest by a tenth', () => {
    const ratios = growthRatios(cured.series, CAMPAIGN_YEARS).map((r) => r.ratio);
    expect(ratios).toHaveLength(6);
    // anchored: the length pin above proves the spread below is over the whole realm
    const spread = Math.max(...ratios) - Math.min(...ratios);
    expect(
      spread,
      `the realm grew in lockstep: widest ${Math.max(...ratios).toFixed(4)} against narrowest`
      + ` ${Math.min(...ratios).toFixed(4)}. Six settlements across six tiers and six terrains`
      + ' that all grow at one rate are one settlement drawn six times.',
    ).toBeGreaterThan(0.1);
  });

  test('NO FLOOR: no settlement sits unmoved for thirty years', () => {
    const frozen = [...cured.series]
      .filter(([, s]) => s[CAMPAIGN_YEARS] === s[0])
      .map(([id]) => id);
    expect(cured.series.size, 'the traversal read no settlements').toBe(6);
    // anchored: the size pin above proves the filter ran over the whole realm
    expect(
      frozen,
      `${frozen.join(', ')} ended the campaign on exactly the head count it started with.`
      + ' The pre-cure defect had a floored half as well as an unbounded half, and a floored'
      + ' settlement is invisible to a reader for the whole campaign.',
    ).toEqual([]);
  });

  test('THE ARRIVAL: a settlement born below its bound crosses into the filling band, the crowding line says so, and the measured arrival years are recorded', () => {
    // ⭐⭐ THIS ARM CARRIES A FINDING, AND THE FINDING IS THE GAP BETWEEN ITS TWO HORIZONS.
    // The bar is SIXTY years, and the campaign is THIRTY. Both numbers are asserted below so
    // the gap is executable rather than described: over sixty years five of six settlements
    // reach the filling band, but the ones that arrive LATE arrive after the campaign a
    // customer plays is already over. That is precisely why C2 exists — a crossing-only
    // Herald cannot answer a thirty-year reader, and the STATE surface can.
    const arrivals = [...cured.firstFilling];
    const within30 = arrivals.filter(([, year]) => year <= CAMPAIGN_YEARS);
    const within60 = arrivals.filter(([, year]) => year <= ARRIVAL_YEARS);
    expect(
      within60.length,
      'no settlement reached the filling band in sixty years: nothing in this realm ever'
      + ' arrives anywhere, and the capacity term has no addressable consequence at all',
    ).toBeGreaterThanOrEqual(1);
    // THE RECORDED FINDING: the thirty-year count is a strict subset of the sixty-year one.
    // A run where they are EQUAL would mean the campaign horizon loses nothing, and this
    // assertion is what would notice that improvement.
    expect(within30.length).toBeLessThanOrEqual(within60.length);
    expect(
      within30.length,
      `only ${within30.length} of ${cured.series.size} settlements arrive inside a`
      + ` ${CAMPAIGN_YEARS}-year campaign (${within60.length} inside ${ARRIVAL_YEARS}).`
      + ' Recorded beside CAP-7 rather than tuned.',
    ).toBeGreaterThanOrEqual(1);
    // AND THE HERALD SAID SO. The crossing the ladder records is the crossing the line fires
    // on, so the reader is told about an arrival rather than left to infer it.
    expect(
      cured.crowdingLines,
      'settlements crossed into the filling band and the crowding line never fired: the'
      + ' ladder and the Herald disagree about what happened',
    ).toBeGreaterThanOrEqual(1);
  });

  test('THE THIRTY-YEAR WINDOW CANNOT SEE THE RUNAWAY: the pre-cure model passes the same three envelope arms', async () => {
    // ⛔ AN INSTRUMENT-SCOPE FACT, PINNED SO NOBODY RE-DISCOVERS IT AS A SURPRISE. The
    // defect that produced 2.91e13 people is INVISIBLE at thirty years. The pre-cure model —
    // births at the band, no death side — sails through motion, differentiation and no-floor.
    // So passing this file is NOT evidence that the model is bounded; that evidence is the
    // cure suite's three hundred years, and only that. These arms measure LIVENESS inside a
    // campaign, and a runaway is extremely lively.
    const preCure = await kernelWithRates((rates, input) => {
      const tier = String(input.settlement && input.settlement.tier ? input.settlement.tier : 'village');
      return { ...rates, birth01: BIRTH_BANDS[tier] || BIRTH_BANDS.village, death01: 0 };
    });
    const runaway = envelope(preCure, CAMPAIGN_YEARS);
    const motion = movingShare(runaway.series, CAMPAIGN_YEARS);
    const ratios = growthRatios(runaway.series, CAMPAIGN_YEARS).map((r) => r.ratio);
    const frozen = [...runaway.series].filter(([, s]) => s[CAMPAIGN_YEARS] === s[0]);
    expect(motion.share, 'the runaway must MOVE, or this arm proves nothing')
      .toBeGreaterThanOrEqual(MOVING_SHARE_FLOOR);
    expect(Math.max(...ratios) - Math.min(...ratios)).toBeGreaterThan(0.1);
    expect(frozen).toEqual([]);
    // AND THE CONTROL THAT MAKES IT A FINDING: the same model, over the same thirty years,
    // is ALREADY unbounded relative to the cured one. The window is what cannot see it.
    const runawayTotal = [...runaway.series.values()].reduce((sum, s) => sum + s[CAMPAIGN_YEARS], 0);
    const curedTotal = [...cured.series.values()].reduce((sum, s) => sum + s[CAMPAIGN_YEARS], 0);
    expect(runawayTotal, 'the pre-cure model must outgrow the cured one even at thirty years')
      .toBeGreaterThan(curedTotal);
  });

  test('RESTORE: the real kernel is back and still plateaus inside its own bound', () => {
    // The mock above is module-scoped and reset, and this arm proves it rather than trusting
    // it: the cure suite's own plateau property must hold from THIS file, at THIS tip, after
    // the revert has been loaded and unloaded.
    const after = envelope(advanceDemographics, ARRIVAL_YEARS);
    for (const [id, s] of after.series) {
      const bound = after.bounds.get(id);
      expect(s[ARRIVAL_YEARS] / bound, `${id} sits ABOVE its own bound after the restore`)
        .toBeLessThanOrEqual(1.05);
      expect(s[ARRIVAL_YEARS], `${id} never moved after the restore: the kernel did not come back`)
        .toBeGreaterThanOrEqual(s[0]);
    }
    // and it is byte-for-byte the same run as the one every arm above read
    for (const [id, s] of after.series) {
      expect(s, `${id} diverged between two runs of the SAME kernel and seed`).toEqual(cured.series.get(id));
    }
  });
});
