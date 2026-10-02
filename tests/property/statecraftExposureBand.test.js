/**
 * statecraftExposureBand.test.js — STATECRAFT-BAND U1 (FPQ-74): THE SPY-EXPOSURE RATE'S BAND.
 *
 * `informationStatecraft.js :: SIGHT_TUNING.EXPOSE_BASE` is the per-tick odds that paid eyes in an
 * OPEN court (no secrecy posture) are found. At 0.06 a spy lived about sixteen weeks and the head
 * produced a scandal every few months per pair, the "constant whisper-war hum" the design forbids
 * (DESIGN_INFORMATION_STATECRAFT.md §8). The band 0.01 was chosen from a measured spread (the FP
 * kit's findings/STATECRAFT-BAND-REPORT.md; ODQ §934.89 FP-43), and these two arms hold it:
 *
 *   THE HEADLESS PACE — the real `processSight` over twenty years of weekly ticks for one covert
 *     watcher on one open, hostile court, seeded per tick the way the kernel seeds a pulse. It
 *     pins what the constant itself governs: a spy's life in an open court and how often it falls.
 *   THE SEEDED RUN — the reader corpus's four-court realm (dramatic_campaign, fp-read-2, the WF-0
 *     two-faith seating, the statecraft head forced on for this realm only), twenty yearly
 *     advances. It pins the chain the band exists for: the scandals stay inside the measured band
 *     and the war mobilizations stay at the head-dark twin's figure (100 measured; 70 at 0.06).
 *
 * Every bound is `expect.soft`, so a red names every arm that moved rather than the first.
 *
 * THE MUTANT, EXECUTED: with 0.06 planted back, both arms red (the headless total and every
 * seed's lifetime; the seeded run's scandals 46 and mobilizations 70). Re-measure with the lane's
 * probe (`.lane-scratch/probe/twin-band.mjs`, copied into the FP kit's evidence folder) whenever an
 * unrelated landing moves the realm's world; the figures here are measurements, not targets.
 */
import { describe, expect, it } from 'vitest';
import { processSight, SIGHT_TUNING } from '../../src/domain/worldPulse/informationStatecraft.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { composeReaderRegion, advanceReaderCampaign, READER_NOW } from '../../scripts/review/readerCorpus.mjs';
import { seatDeityBearingCase, WF0_DEITY_BEARING_CASE } from '../../scripts/audit/whole-world-soak-deity-fixture.mjs';

const TWENTY_YEARS_OF_TICKS = 1040;
const PACE_SEEDS = Object.freeze(['band-a', 'band-b', 'band-c', 'band-d']);

/** One open, hostile pair; the watcher can afford eyes and the target never hides. */
function paceRun(seed) {
  const item = (/** @type {string} */ id) => ({ id, settlement: { economicState: { prosperity: 'Prosperous' }, powerStructure: {} } });
  const snapshot = { byId: new Map([['W', item('W')], ['T', item('T')]]), settlements: [{ id: 'W' }, { id: 'T' }] };
  const beliefMaps = { W: { seat: { T: { readiness: 0.5, strengthBand: 3, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.8, lastUpdateTick: 0 } } } };
  /** @type {Record<string, unknown>} */
  let prior = {};
  let exposures = 0;
  /** @type {number[]} */
  const lifetimes = [];
  /** @type {number | null} */
  let since = null;
  for (let t = 1; t <= TWENTY_YEARS_OF_TICKS; t += 1) {
    const r = processSight({ snapshot, priorSight: prior, secrecy: {}, beliefMaps, rng: createPRNG(`${seed}::tick:${t}`), tick: t, nameFor: (/** @type {string} */ id) => id });
    const had = Boolean(/** @type {any} */ (prior).W?.T);
    const has = Boolean(r.sight?.W?.T);
    if (!had && has) since = t;
    if (r.newsEntries.length) {
      exposures += 1;
      if (since != null) lifetimes.push(t - since);
      since = null;
    }
    prior = r.sight || {};
  }
  const meanLife = lifetimes.length ? lifetimes.reduce((a, b) => a + b, 0) / lifetimes.length : Infinity;
  return { exposures, meanLife };
}

describe('STATECRAFT-BAND U1 — the headless pace of a spy in an open court', () => {
  it('a spy in an open court lives at least a year on every seed, and twenty years see a handful of falls, not a season of them', () => {
    const runs = PACE_SEEDS.map((seed) => ({ seed, ...paceRun(seed) }));
    const total = runs.reduce((s, r) => s + r.exposures, 0);
    // Measured at 0.01: 3 + 7 + 9 + 6 = 25 falls, mean lives 326 / 91 / 78 / 84 weeks.
    // At 0.06: 140 falls, mean lives 13 to 18 weeks. At 0.02: 55 falls, one life 37 weeks.
    expect.soft(total, `falls across ${PACE_SEEDS.length} seeds at EXPOSE_BASE ${SIGHT_TUNING.EXPOSE_BASE}`).toBeGreaterThanOrEqual(12);
    expect.soft(total).toBeLessThanOrEqual(40);
    for (const r of runs) {
      expect.soft(r.meanLife, `seed ${r.seed}: a spy's mean life in weeks`).toBeGreaterThanOrEqual(52);
    }
  });
});

describe('STATECRAFT-BAND U1 — the seeded run: the chain at the band', () => {
  it('dramatic_campaign fp-read-2, head on, twenty years: scandals inside the measured band and mobilizations at the dark twin', async () => {
    const row = { campaignId: 'fp-read-2', posture: 'launch', preset: 'dramatic_campaign', goldenKey: null, seed: 'fp-read-2', overlay: null, years: 20 };
    let { campaign, saves } = composeReaderRegion(row);
    ({ saves } = seatDeityBearingCase(saves, WF0_DEITY_BEARING_CASE, { now: READER_NOW }));
    const rules = campaign.worldState.simulationRules;
    campaign = { ...campaign, worldState: { ...campaign.worldState, simulationRules: { ...rules, infoStatecraftEnabled: true, informationBrokeragesEnabled: true } } };
    /** @type {Record<string, number>} */
    const kinds = {};
    await advanceReaderCampaign({
      campaign, saves, years: 20, seed: 'fp-read-2',
      onYear: (/** @type {{ rawWizardNewsEntries: Array<{ kind?: string, impactKind?: string }> }} */ cap) => {
        for (const n of cap.rawWizardNewsEntries) {
          const k = String(n?.impactKind || n?.kind || 'unknown');
          kinds[k] = (kinds[k] || 0) + 1;
        }
      },
    });
    const scandals = kinds.infowar_spy_exposed || 0;
    const mobilizations = kinds.war_mobilization || 0;
    // Measured (fp-read-2, this realm): EXPOSE_BASE 0.005 / 0.01 / 0.02 / 0.03 / 0.06 gave
    // scandals 23 / 28 / 35 / 42 / 46 and mobilizations 99 / 99 / 99 / 70 / 70; the head-dark twin 100.
    expect.soft(scandals, 'spy scandals in twenty years').toBeGreaterThanOrEqual(20);
    expect.soft(scandals).toBeLessThanOrEqual(38);
    expect.soft(mobilizations, 'war mobilizations in twenty years (the dark twin: 100)').toBeGreaterThanOrEqual(90);
  }, 480_000);
});
