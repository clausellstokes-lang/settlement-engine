/**
 * tests/generators/famineFrameStore.test.js — R2-CODE-A-3, round three's cut (ROUND-3-CUT-2026-11-13,
 * lane ra): #40 and #4 (its round-two twin) and #48, one pool, `narrativeText.js :: PRESSURE_SENTENCES.famine`.
 *
 * #40 / #4: "Elder Council of Sahlfort promised a fair share of the food reserves last week…" in a thorp
 * with no granary and three days of household stores: the frame presumes a common store. The chair's
 * rule: the line prints only where the record holds one (a granary, the vocabulary's `institution:
 * granary`). The draw resolves a refused row to the NEXT admitted row (`narrativeGenerator.js ::
 * generatePressureSentence`), so row 0 ("the remaining … reserves are in few hands"), the same
 * presumption, declares it too.
 * #48: "Since the harvest failed … at least three powers are fighting over the stores" in a one-power
 * thorp whose famine failed its fishing: the row names the failed source from the food record, counts
 * only the powers the record holds, and calls the food "the stores" only beside a granary.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** @param {any} l */
const textOf = (l) => (typeof l === 'string' ? l : l.text);
/** @param {any} l */
const needsOf = (l) => (typeof l === 'string' ? [] : l.needs || []);

describe('the famine pool: a common store, a failed source, the powers counted', () => {
  const base = { name: 'X', govFaction: 'the elder council', foodRecord: { hasGranary: false, failedSource: 'fish' } };

  it('the two reserves rows need a granary', () => {
    const rows = PRESSURE_SENTENCES.famine({ ...base, powerCount: 1 });
    for (const row of rows.filter((l) => /reserves/.test(textOf(l)))) expect(needsOf(row)).toContain('institution: granary');
  });

  it('one power, a failed fishing, no granary: no harvest, no count, no stores', () => {
    const line = textOf(PRESSURE_SENTENCES.famine({ ...base, powerCount: 1 })[1]);
    expect(line).toMatch(/^Since the fishing failed, food is power in X, /); // a pattern (proseDrawnAnchors)
    expect(line).not.toMatch(/harvest|three powers|the stores/);
  });

  it('two powers: the two, over what food is left', () => {
    expect(textOf(PRESSURE_SENTENCES.famine({ ...base, powerCount: 2, foodRecord: { hasGranary: false, failedSource: 'game' } })[1]))
      .toMatch(/^Since the hunt failed, .+ its two powers are fighting over what food is left\.$/); // a pattern (proseDrawnAnchors)
  });

  it('three powers, a failed grain harvest, a granary: the original line', () => {
    expect(textOf(PRESSURE_SENTENCES.famine({ ...base, powerCount: 3, foodRecord: { hasGranary: true, failedSource: 'grain' } })[1]))
      .toMatch(/^Since the harvest failed, .+ at least three powers are fighting over the stores\.$/); // a pattern, not the literal sentence (proseDrawnAnchors)
  });
});

describe("the reader's two thorps, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed @param {string} settType @param {string[]} stresses */
  const born = (seed, settType, stresses) => /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType, selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} }));

  it('Sahlfort (#40): no granary, so no reserves are promised', () => {
    const s = born('rr2s-thorp-calm-rand-1', 'thorp', []);
    expect(s.economicState.foodSecurity.foodRecord.hasGranary).toBe(false);
    expect(s.pressureSentence).not.toMatch(/reserves|stores/);
  });

  it('Archodion (#48): one power and a failed fishing, so no harvest and no three powers', () => {
    const s = born('rr2s-thorp-famine-rand-1', 'thorp', ['famine']);
    expect(s.powerStructure.factions.length).toBe(1);
    expect(s.pressureSentence).not.toMatch(/harvest|three powers|the stores/);
  });
});
