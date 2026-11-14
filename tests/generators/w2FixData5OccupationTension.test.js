/**
 * W2-FIX-DATA-5 item 1 (2026-11-13) — ROUND THREE'S HIGH LINE #1003, with round two's #1036
 * (lane/round-3-cut-2026-11-13, `ROUND-3-CUT.json`; REVIEW-W2A-3 `debt/final.json`):
 *   #1003 rr2s-city-occupied-rand-1, Summary/Overview: "The occupation ended long ago, but the families who collaborated
 *         and the families who resisted still keep apart" — beside "Active crisis: Under Occupation" and the History
 *         tab's "Now foreign officers give the orders".
 *   #1036 rw3-town-occupied-1: the same tension's hook "A former occupier officer has returned under a false identity".
 * The occupation's crisis maps to the `occupation_legacy` tension (`historyPolicyData.js :: STRESS_TO_TENSION`), and
 * every one of that template's words (its description, its two memory forms, its factions, its hooks) speaks of an
 * occupation that is OVER. Under an occupation in force the template is false; it declares so beside the selection
 * (`historyGenerator.js :: HISTORY_TEMPLATE_RECORD_DECLARATIONS`, an `excludes` arm read through the vocabulary's crisis
 * atom), and the selection's existing loop sets it aside (R-Q): no draw is added or moved. The past event keeps its
 * account (`timeline: false`): a town may have been occupied before.
 *
 * THIS FILE REDS WHEN: the template is admitted as the tension of a current occupation, or refused where no occupation
 * is in force (a siege maps to the same template and keeps it); when the reader's own towns print the false tension
 * again; or when the town under occupation is left with no current tension.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { HISTORY_TEMPLATE_RECORD_DECLARATIONS, trueToRecordAt } from '../../src/generators/historyGenerator.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The history's facts as the generator builds them (`generateHistory :: hookFacts`): the crisis from the config. */
const factsUnder = (/** @type {string[]} */ stressTypes) => factsOf({ institutions: [], config: { stressTypes }, tier: 'city', powerStructure: null, stress: stressTypes.map((type) => ({ type })) });

describe('W2-FIX-DATA-5 item 1: the occupation\'s legacy is no tension of an occupation in force', () => {
  it('occupation_legacy declares the occupation it presumes over, and is judged as a tension only', () => {
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.occupation_legacy).toEqual({ excludes: ['crisis: occupied'], timeline: false });
  });

  it('refused under an occupation in force (alone or beside another crisis), admitted under every other crisis and in calm', () => {
    const tmpl = { type: 'occupation_legacy' };
    expect(trueToRecordAt(tmpl, factsUnder(['occupied']), true, 'Volatile', 'Modest')).toBe(false);
    expect(trueToRecordAt(tmpl, factsUnder(['under_siege', 'occupied']), true, 'Volatile', 'Modest')).toBe(false);
    expect(trueToRecordAt(tmpl, () => factsUnder(['occupied']), true, 'Volatile', 'Modest'), 'the thunk the generator hands in').toBe(false);
    for (const calmOrOther of [[], ['under_siege'], ['famine'], ['wartime'], ['insurgency']]) {
      expect(trueToRecordAt(tmpl, factsUnder(calmOrOther), true, 'Volatile', 'Modest'), calmOrOther.join('+') || 'calm').toBe(true);
    }
  });

  it('the past event keeps its account under an occupation (timeline: false)', () => {
    expect(trueToRecordAt({ type: 'occupation_legacy' }, factsUnder(['occupied']), false)).toBe(true);
  });
});

/** The readers' towns, in the app's own shape (the configuration panel: Random off, the ticked list). */
const app = (/** @type {string} */ settType, /** @type {string[]} */ stresses) => birthConfig({ ...DEFAULT_CONFIG, settType, selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true });
const TOWNS = [
  { seed: 'rr2s-city-occupied-rand-1', settType: 'city', stresses: ['occupied'], row: '#1003' },
  { seed: 'rw3-town-occupied-1', settType: 'town', stresses: ['occupied'], row: '#1036' },
];
const FALSE_WORDS = ['occupation ended', 'previous occupation', 'former occupier officer', 'Former collaborators', 'Former resistance', 'Those who want it forgotten', 'old property seizures'];

describe('W2-FIX-DATA-5 item 1: the readers\' towns, re-born in the app\'s shape', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  for (const t of TOWNS) {
    it(`${t.seed} (${t.row}): no current tension speaks of the occupation as over, and the town still carries one`, () => {
      const s = generateSettlementPipeline(app(t.settType, t.stresses), null, { seed: t.seed, customContent: {} });
      expect((Array.isArray(s.stress) ? s.stress : [s.stress]).map((x) => x?.type)).toContain('occupied');
      const tensions = s.history.currentTensions || [];
      expect(tensions.map((x) => x.type)).not.toContain('occupation_legacy');
      const words = JSON.stringify(tensions);
      expect(FALSE_WORDS.filter((w) => words.includes(w))).toEqual([]);
      expect(tensions.length, 'the town still carries a current tension').toBeGreaterThan(0);
    }, 60_000);
  }
});
