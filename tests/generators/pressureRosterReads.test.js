/**
 * tests/generators/pressureRosterReads.test.js — R2-CODE-A-3, the round-three cut's increment (ROUND-3-CUT-INCREMENT,
 * lane ra), HIGH ww-28, ww-1070, ww-1225 (`narrativeText.js :: PRESSURE_SENTENCES`):
 * - ww-28, rww-hamlet-famine-1: "The bakers of Ulfset have started cutting the bread…" in a hamlet whose roster holds
 *   no bakery. The bakers print only where the roster holds one (genPressureDetail's hasBakery); elsewhere the row
 *   says what people eat is being stretched.
 * - ww-1070, rww-metropolis-under_siege-1, and ww-1225, rww-village-under_siege-1: "… and Khadija al-Aziz, the priest,
 *   is deciding whether to negotiate terms" — the record's crisis cast names the seat's holder as the one who would
 *   treat, and the cast is derived after this line is drawn. The line names the governing power, never the first card.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe('the rows read the roster and the seat', () => {
  it('the bakers only where a bakery stands', () => {
    expect(PRESSURE_SENTENCES.famine({ name: 'X', hasBakery: true })[3]).toMatch(/^The bakers of X/);
    expect(PRESSURE_SENTENCES.famine({ name: 'X', hasBakery: false })[3]).toBe('What people eat in X is being stretched with things that are not food; everyone can taste it, and the fact that nobody complains is the most alarming part.');
  });
  it('the siege\'s terms are the governing power\'s to decide', () => {
    expect(PRESSURE_SENTENCES.under_siege({ name: 'X', govFaction: 'the elder council', topNPCName: 'Khadija al-Aziz', topNPCRole: 'priest' })[0])
      .toBe('X is surrounded. Supply lines are cut, morale is fracturing, and the elder council is deciding whether to negotiate terms or hold out for relief that may not be coming.');
  });
});

describe("the reader's towns, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => { const m = /** @type {RegExpMatchArray} */ (seed.match(/^rww-(\w+)-([a-z_+]+)-\d+$/)); return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} })); };
  it('Ulfset (ww-28): no bakers in a hamlet with no bakery', () => {
    const s = born('rww-hamlet-famine-1');
    expect((s.institutions || []).some((/** @type {any} */ i) => /baker/i.test(i.name))).toBe(false);
    expect(s.pressureSentence).not.toMatch(/bakers/);
  });
  it('the siege line names no card (every row)', () => {
    for (const [seed, name] of [['rww-metropolis-under_siege-1', 'Yellow Corn Coh'], ['rww-village-under_siege-1', 'Khadija al-Aziz']]) {
      const s = born(seed);
      expect(s.pressureSentence, `${seed}: the siege line names no card`).not.toContain(name);
    }
  });
});
