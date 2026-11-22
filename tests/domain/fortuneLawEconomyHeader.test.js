/**
 * fortuneLawEconomyHeader.test.js — FS7 FINDING F1 (FORTUNE-1's U4, FORTUNE-3's builder), DARK.
 *
 * ⭐ THE FINDING. DS-ECO-1's high rung (Prosperous, Wealthy) credits its money to the economy its `{complexity}` slot
 * names ("{settlement} lives on a {complexity} and ends each year with money to spare."). At a thorp or a hamlet that
 * slot is the size ladder's own rung (`prosperity.js :: complexityByExports`), and its bottom rung, "Subsistence —
 * survival economy", fills it as "subsistence living": under the fortune law a Prosperous hamlet printed "Rasdeh lives on
 * a subsistence living and ends each year with money to spare." (docs/chair/2026-11-20/content/fortune/FS7-INVENTORY.md
 * section 1.B).
 *
 * ⭐ THE CURE, BY THE LINE'S OWN CONDITION: under law 2 only, at a high rung, the subsistence complexity does not fill
 * the slot, so the variants that name it are not drawn (the kernel's anchored liveness), and the pool keeps the lines
 * that never needed it. Under law 1 the slot fills exactly as today.
 *
 * THE ARMS:
 *   (a) LIT — every law-2 birth at a high rung whose complexity is the subsistence rung prints a header that names no
 *       complexity (the noun is read off `COMPLEXITY_NOUN`, never quoted), and still prints a header.
 *   (b) DARK — the same records with the marker taken off (law 1) print the header that names the noun in at least one,
 *       and a record carrying `_fortuneLawVersion: 1` prints exactly what the marker-less one prints.
 *   (c) UNTOUCHED — a law-2 birth at the middle rung on the subsistence rung still names it ("gets by on ... with a little
 *       left over" is true there).
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { COMPLEXITY_NOUN, prosperityHeaderPoolKey } from '../../src/domain/display/stateProse/economyStateProse.js';
import { COMPLEXITY_LABEL } from '../../src/domain/display/labelBands.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { prosperityRank } from '../../src/data/constants.js';
import { FORTUNE_LAW_CONFIG_KEY, SIZE_RELATIVE_FORTUNE_LAW_VERSION } from '../../src/domain/fortune/fortuneLaw.js';

const SUBSISTENCE_NOUN = COMPLEXITY_NOUN[COMPLEXITY_LABEL.SUBSISTENCE];
const SIZES = ['thorp', 'hamlet', 'village'];
const PER_SIZE = 20;
/** The working-approach high rung's pool key and the middle rungs', read off the desk's own key function. */
const HIGH_KEY = prosperityHeaderPoolKey(prosperityRank('Prosperous'), 'road');
const MIDDLE_KEY = prosperityHeaderPoolKey(prosperityRank('Comfortable'), 'road');

/** @param {any} s */
const headerOf = (s) => String(buildPrintProse(s)?.economics?.['economics.prosperityHeader'] ?? '');
/** The record as a law-1 world: the marker off its config and its echo. @param {any} s */
const withoutMarker = (s) => {
  const strip = (/** @type {any} */ c) => (c && typeof c === 'object' ? Object.fromEntries(Object.entries(c).filter(([k]) => k !== FORTUNE_LAW_CONFIG_KEY)) : c);
  return { ...s, config: strip(s.config), _config: strip(s._config) };
};
/** @param {any} s @param {number} v */
const withMarker = (s, v) => ({ ...s, config: { ...s.config, [FORTUNE_LAW_CONFIG_KEY]: v }, _config: { ...s._config, [FORTUNE_LAW_CONFIG_KEY]: v } });
/** @param {any} s */
const onSubsistenceRung = (s) => s.economicState?.economicComplexity === COMPLEXITY_LABEL.SUBSISTENCE;

/** @type {any[]} */
let born = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) {
    for (let i = 0; i < PER_SIZE; i += 1) {
      born.push(generateSettlementPipeline(
        { ...birthConfig({ ...DEFAULT_CONFIG, settType: size }), [FORTUNE_LAW_CONFIG_KEY]: SIZE_RELATIVE_FORTUNE_LAW_VERSION },
        null, { seed: `u4-${size}-${i}`, customContent: {} },
      ));
    }
  }
}, 240_000);

describe('FS7 F1: the high rung never credits its money to a subsistence living (law 2 only)', () => {
  it('the pools are what the finding says: the high rung has variants naming the slot', () => {
    const pools = /** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY)['DS-ECO-1'].pools;
    expect(pools[HIGH_KEY].some((/** @type {any} */ v) => (v.slots || []).includes('complexity'))).toBe(true);
    expect(pools[HIGH_KEY].some((/** @type {any} */ v) => !(v.slots || []).includes('complexity'))).toBe(true);
    expect(typeof SUBSISTENCE_NOUN).toBe('string');
  });

  it('(a) LIT: a law-2 birth at a high rung on the subsistence rung names no subsistence living, and still has a header', () => {
    const cases = born.filter((s) => onSubsistenceRung(s) && prosperityRank(s.economicState.prosperity) >= prosperityRank('Prosperous'));
    expect(cases.length, 'the arm reads at least one such birth').toBeGreaterThan(0);
    for (const s of cases) {
      const header = headerOf(s);
      // anchored: arm (b) reads the noun in the same records' law-1 header, and arm (c) in a law-2 middle-rung header
      expect(header, `${s.name} (${s.tier}, ${s.economicState.prosperity})`).not.toContain(SUBSISTENCE_NOUN);
    }
    expect(cases.some((s) => headerOf(s).length > 0), 'the pool keeps the lines that never needed the slot').toBe(true);
  });

  it('(b) DARK: the same records under law 1 print today\'s line, and an explicit 1 is the marker-less world', () => {
    const cases = born.filter((s) => onSubsistenceRung(s) && prosperityRank(s.economicState.prosperity) >= prosperityRank('Prosperous'));
    expect(cases.some((s) => headerOf(withoutMarker(s)).includes(SUBSISTENCE_NOUN)), 'law 1 still fills the slot').toBe(true);
    for (const s of cases) expect(headerOf(withMarker(s, 1))).toBe(headerOf(withoutMarker(s)));
  });

  it('(c) UNTOUCHED: the middle rung on the subsistence rung still names it under law 2', () => {
    const middle = born.filter((s) => onSubsistenceRung(s)
      && prosperityHeaderPoolKey(prosperityRank(s.economicState.prosperity), String(s.economicState.tradeAccess)) === MIDDLE_KEY);
    expect(middle.length).toBeGreaterThan(0);
    expect(middle.some((s) => headerOf(s).includes(SUBSISTENCE_NOUN))).toBe(true);
  });
});
