/**
 * tests/generators/economicHistoryRecent.test.js — R2-CODE-A-2, the cold list REVIEW-W2A-3 MEDIUM #181:
 * "Economically dynamic … the Economic Divide is recent enough to remind everyone" for an event 88 years old (the
 * History tab: "88y ago · Ancient"). Two `economic_heavy` lines call their drawn event recent. They now read its
 * age as the political lines do (COHERENCE-PRESUME, the chair's ruling B: past sixty years an event is older than
 * its bearers): within sixty years, as before; older, a line that calls it long past. The one pick each line makes
 * is made in the same place, so no draw moves.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The phrase a line calling its event recent prints (a plain substring: the former `/is recent enough/`). */
const RECENT = 'is recent enough';
/** @param {number} yearsAgo */
const ev = (yearsAgo) => [{ name: 'Economic Divide', type: 'economic', severity: 'major', yearsAgo }];
const LINES = [1, 5].map((i) => textOf(POLITICAL_FLAVOR.economic_heavy[i]));
/** @param {(r: any) => string} line @param {any} r */
const run = (line, r) => { const prev = setActiveRng(createPRNG('economic-history-recent')); try { return line(r); } finally { clearActiveRng(prev); } };

describe('the economic lines that call their event recent read its age', () => {
  it('within sixty years: unchanged', () => {
    expect(run(LINES[0], ev(20))).toBe('Economically dynamic in ways that occasionally tip into instability: the Economic Divide is recent enough to remind everyone that prosperity here has always been earned and can always be lost');
    expect(run(LINES[1], ev(60))).toBe('People here are careful not to show off their money. The Economic Divide is recent enough that flaunting wealth looks like having learned nothing from it');
  });
  it('older than sixty years: neither line calls it recent, and each still names it', () => {
    for (const line of LINES) {
      const t = run(line, ev(88));
      expectAbsentWithAnchor(t, RECENT, 'Economic Divide', 'the line names its event, and not as recent');
      expect(t).toMatch(/Economic Divide/);
    }
  });
});

describe('the cold list\'s town, born as the app births it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-hamlet-calm-1 (#181): an 88-year-old event is not called recent', () => {
    const seed = 'rw3-hamlet-calm-1';
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'hamlet', selectedStressesRandom: false, selectedStresses: [], _randomizePriorities: true }), null, { seed, customContent: {} }));
    // re-keyed by identity (TAIL-NARRATIVE-5, the chair's U2): the town's 88-year economic event was "the Economic Divide"
    // when this was written; the joined line's history now names it "the Shortage" (same type, same age): the pin reads the
    // economic event the line names, not a literal name
    const character = String(s.history.historicalCharacter);
    const named = (s.history.historicalEvents || []).find((/** @type {any} */ e) => e.type === 'economic' && character.includes(String(e.name).replace(/^The /, '')));
    expect(named?.yearsAgo, character).toBeGreaterThan(60);
    expect(character).toMatch(/^Economically dynamic/);
    expectAbsentWithAnchor(character, RECENT, 'Economically dynamic', '#181: the character opens on its economic line, and does not call its event recent');
  });
});
