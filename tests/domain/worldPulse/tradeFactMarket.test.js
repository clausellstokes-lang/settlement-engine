/**
 * THE TRADE FACT NAMES THE MARKET'S STALLS ONLY WHERE A MARKET STANDS (TAIL-CONTENT-CLOSE-1, 2026-11-15).
 *
 * The landing town Cnocby (seed `lf-033`) holds no market, yet its weeks printed "Caravans are passing Cnocby by,
 * and its market stalls stand half empty." The trade condition's fact is now declared (heraldDeeds.js ::
 * CONDITION_FACT_SIBLINGS: it needs a market) and resolved where the summary is written (candidateEvents.js ::
 * conditionFactOf); its twin tells the same event without the market. The anchors are computed from the shipped
 * sibling set at the town's own name, never a literal sentence.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { evaluateWorldPulseRules, generateWorldPulseCandidates } from '../../../src/domain/worldPulse/candidateEvents.js';
import { CONDITION_FACT_SIBLINGS } from '../../../src/domain/worldPulse/heraldDeeds.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const [ORIGINAL, TWIN] = CONDITION_FACT_SIBLINGS.trade;
/** The pulse's rules with only the emergent-condition rule on: the door this guard reads. */
const ONLY_EMERGENT = Object.freeze({
  emergentEventsEnabled: true, stressorsEnabled: false, relationshipDynamicsEnabled: false, npcAgencyEnabled: false,
  factionCompetitionEnabled: false, populationDynamicsEnabled: false, migrationFlowsEnabled: false, tradeFlowsEnabled: false,
  resourceDriftEnabled: false, tierDriftEnabled: false, institutionLifecycleEnabled: false,
});
const SEEDS = ['hamlet', 'village', 'town', 'city'].flatMap((t) => [1, 2, 3, 4].map((i) => `tfm-${t}-${i}`));

/** @param {string} seed */
const birth = (seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, settType: seed.split('-')[1] }), null, { seed, customContent: {} });

/** The trade condition's summary for one town, drawn through the pulse's own rule pass. @param {any} town */
const tradeSummary = (town) => {
  const id = 'tfm-save';
  const pressure = { kind: 'trade', score: 0.8, settlementId: id, settlementName: town.name, reasons: [] };
  const item = { id, settlement: town };
  const candidates = evaluateWorldPulseRules(
    { settlements: [item], byId: new Map([[id, item]]), worldState: { tick: 1 } },
    { tick: 1, pressures: [pressure], simulationRules: ONLY_EMERGENT },
  );
  const condition = candidates.find((c) => c.type === 'condition' && c.candidateType === 'trade_pressure');
  return /** @type {string} */ (condition?.summary);
};

describe('the trade condition names the market only where one stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('a town with a market hears of its stalls; a town without one hears of its traders', () => {
    /** @type {{ market: number, none: number }} */
    const seen = { market: 0, none: 0 };
    // seed-loop: collected — every town is judged, and a red names each seed that printed a false fact
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const town = birth(seed);
      const summary = tradeSummary(town);
      const [stalls, traders] = [ORIGINAL.text(town.name), TWIN.text(town.name)];
      if (factsOf(town).market) {
        seen.market++;
        expectAbsentWithAnchor([summary], traders, stalls, `${seed}: a market stands`);
      } else {
        seen.none++;
        expectAbsentWithAnchor([summary], stalls, traders, `${seed}: no market stands`);
      }
    });
    expectNoSeedFailures(failures, 'the trade fact reads the town\'s market');
    // both arms live: the loop met towns with a market and towns without one
    expect(seen.market, 'no town with a market was met').toBeGreaterThan(0);
    expect(seen.none, 'no town without a market was met').toBeGreaterThan(0);
  });

  it('an unanswered record (no snapshot: the pressure-only door) prints the twin, which is true either way', () => {
    const pressure = { kind: 'trade', score: 0.8, settlementId: 'gone', settlementName: 'Nowhere', reasons: [] };
    const candidates = generateWorldPulseCandidates({ pressures: [pressure], tick: 1 });
    const summary = candidates.find((c) => c.candidateType === 'trade_pressure')?.summary;
    expectAbsentWithAnchor([summary], ORIGINAL.text('Nowhere'), TWIN.text('Nowhere'), 'unanswered');
  });
});
