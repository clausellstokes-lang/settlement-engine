/**
 * coherenceBattery — the soak's UNSTORED check set (lane SOAK-1000, 2026-11-03).
 *
 * The battery wraps the seven coherence instruments of src/domain/coherence/ in one call over
 * a settlement and the text rendered for it, surface by surface, and returns findings in ONE
 * shape `{ check, surface, quote, detail }`. It writes nothing into the record, so no golden
 * moves: these assertions prove the wrapper (every instrument reached, the surface carried,
 * the quote the instrument's own words, the record left byte-identical), not the instruments,
 * whose own suites stand beside them.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { BATTERY_CHECKS, coherenceBattery } from '../../src/domain/coherence/coherenceBattery.js';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';
import { tierNounFindings } from '../../src/domain/coherence/tierNounFindings.js';
import { seatHolderFindings } from '../../src/domain/coherence/seatHolderFindings.js';
import { hookTruthFindings, renderedHookTruthFindings } from '../../src/domain/coherence/hookTruthFindings.js';

/** @type {any} */
let village;
/** @type {any} */
let thorp;

beforeAll(async () => {
  await loadGenerationLawPayloads();
  village = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'village' }), null, { seed: 'coherence-battery-village' });
  thorp = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'thorp' }), null, { seed: 'coherence-battery-thorp' });
}, 120_000);

describe('coherenceBattery — the seven instruments behind one call', () => {
  it('names the checks it runs: one per instrument, the rendered hook reading, the reader\'s three two-tab checks and the four kind-10 crisis page checks', () => {
    expect([...BATTERY_CHECKS]).toEqual([
      'defense-words', 'faith-denial', 'food-words', 'hook-truth-record', 'hook-truth-page',
      'magic-words', 'seat-holder', 'tier-noun',
      'grade-vs-food', 'magic-absent-prose', 'crime-denied-and-listed',
      // F12 (rung 2, 2026-11-04): a calm line under the crisis it denies.
      'crisis-blind-prose',
      // F13 (rung 2, 2026-11-04): three crisis facts the page contradicts. One kind with F12's
      // (kind 10, crisis), pinned once at the composed list (the rung-2 window).
      'famine-stores', 'migration-direction', 'crisis-cast-sense',
      // W2-A-LEAVES (2026-11-12): the rendered-dossier arm, one finding per census pattern over the views.
      'page-census',
    ]);
  });

  it('carries the surface a word finding came from, and quotes the instrument\'s own phrase', () => {
    const text = 'The town gate is shut at dusk.';
    const own = tierNounFindings(thorp, text);
    expect(own.length).toBeGreaterThan(0);
    const out = coherenceBattery(thorp, { overview: text, economics: 'Grain is sold by the sack.' })
      .filter((f) => f.check === 'tier-noun');
    expect(out).toHaveLength(own.length);
    expect(out.every((f) => f.surface === 'overview')).toBe(true);
    expect(out[0].quote).toContain(own[0].context.trim());
  });

  it('reads a food sentence against the one food record, per surface', () => {
    const line = 'No food reserves are kept.';
    const own = foodWordsFindings(village, line);
    const out = coherenceBattery(village, { defense: line }).filter((f) => f.check === 'food-words');
    expect(out).toHaveLength(own.length);
    for (const f of out) expect(f.surface).toBe('defense');
  });

  it('reads the record-level instruments once, on the record and the page, never per surface', () => {
    const once = coherenceBattery(village, { a: '', b: '', c: '' });
    expect(once.filter((f) => f.check === 'seat-holder')).toHaveLength(seatHolderFindings(village).length);
    expect(once.filter((f) => f.check === 'hook-truth-record')).toHaveLength(hookTruthFindings(village).length);
    expect(once.filter((f) => f.check === 'hook-truth-page')).toHaveLength(renderedHookTruthFindings(village).length);
    for (const f of once.filter((x) => x.check === 'seat-holder' || x.check === 'hook-truth-record')) expect(f.surface).toBe('record');
  });

  it('every finding has the one shape: check, surface, quote and detail, all strings', () => {
    const all = coherenceBattery(thorp, { overview: 'The town is starving. Magical Capability: Critical. No single creed holds sway.' });
    expect(all.length).toBeGreaterThan(0);
    for (const f of all) {
      expect(Object.keys(f).sort()).toEqual(['check', 'detail', 'quote', 'surface']);
      for (const v of Object.values(f)) expect(typeof v).toBe('string');
      expect(BATTERY_CHECKS).toContain(f.check);
    }
  });

  it('writes nothing into the record: the settlement is byte-identical after a run', () => {
    const before = JSON.stringify(village);
    coherenceBattery(village, { overview: 'The town has no food reserves.', faith: 'No single creed holds sway.' });
    expect(JSON.stringify(village)).toBe(before);
  });

  it('answers [] for an absent settlement and empty text instead of throwing', () => {
    expect(coherenceBattery(null, {})).toEqual([]);
  });
});
