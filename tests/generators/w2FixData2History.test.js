/**
 * W2-FIX-DATA-2 (2026-11-13) — the history's place words, read false by the cold list (REVIEW-W2B,
 * `docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json` on lane/review-w2b-2026-11-13, rows 3, 7, 29, 204, 282):
 * "reshaped the lower districts" in a thorp of six and a village of ninety-nine; "the waterfront" in a village
 * and a city with no water. The words are `historyData.js :: HISTORY_QUARTER_WORDS` (the timeline's one pick of
 * `{quarter}`, kept) and `HISTORY_SMALL_PLACE_WORDS` (the route context's word at village size and below,
 * `historyRouteContext.js :: smallPlaceWordsOf`).
 *
 * THIS FILE REDS WHEN: a case of the words' table (tier × water × market × temple) has a drawn index that resolves to
 * no word or to a word its own declaration refuses; a small place keeps a district, quarter or sector word; a town
 * loses its words; or a fixture town prints its false sentence again (each fixture town is re-born from its own
 * configuration and seed, and the record is read whole).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { HISTORY_QUARTER_WORDS, HISTORY_SMALL_PLACE_WORDS } from '../../src/data/historyData.js';
import { drawDeclared, lineText } from '../../src/domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { smallPlaceWordsOf } from '../../src/generators/history/historyRouteContext.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SMALL = new Set(['thorp', 'hamlet', 'village']);
const SIZE_WORD = /\b(?:district|districts|quarter|quarters|sector)\b/i;

/** A facts double answering exactly the atoms the words declare. */
const factsFor = (/** @type {{ tier: string, water: 'maritime'|'river'|'none', market: boolean, temple: boolean }} */ c) => ({
  tier: c.tier,
  market: c.market,
  water: { navigable: c.water !== 'none', coast: c.water === 'maritime', river: c.water === 'river' },
  hasInstitution: (/** @type {string} */ k) => (k === 'temple' ? c.temple : false),
});

const CASES = TIERS.flatMap((tier) => /** @type {const} */ (['maritime', 'river', 'none']).flatMap((water) => [false, true].flatMap((market) => [false, true].map((temple) => ({ tier, water, market, temple })))));
const ORIGINALS = HISTORY_QUARTER_WORDS.filter((l) => !('twinOf' in l));

describe('W2-FIX-DATA-2 item 1: the timeline\'s {quarter} words cover their whole table', () => {
  it('the draw keeps its four words in their order (the one pick is the base\'s pick)', () => {
    expect(ORIGINALS.map(lineText)).toEqual(["the merchants' quarter", 'the residential district', 'the waterfront', 'the temple district']);
  });

  it(`every drawn index of every case (${CASES.length}) resolves to a word its own declaration admits`, () => {
    const bad = [];
    for (const c of CASES) {
      const facts = factsFor(c);
      for (let i = 0; i < ORIGINALS.length; i++) {
        const r = drawDeclared(HISTORY_QUARTER_WORDS, { draw: (p) => p[i], facts, poolId: 'test', key: `k${i}` });
        const ok = r.line != null && declarationAdmits(declarationOf(r.line), facts).admitted;
        const sizeWrong = SMALL.has(c.tier) && SIZE_WORD.test(String(r.text));
        const dryWater = c.water === 'none' && /waterfront/.test(String(r.text));
        if (!ok || sizeWrong || dryWater) bad.push(`${JSON.stringify(c)} #${i} -> ${r.text}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('a town keeps the drawn word wherever it is true (no true word lost)', () => {
    const facts = factsFor({ tier: 'city', water: 'river', market: true, temple: true });
    for (const w of ORIGINALS) expect(drawDeclared(HISTORY_QUARTER_WORDS, { draw: () => w, facts, poolId: 'test' }).text).toBe(w.text);
  });
});

describe('W2-FIX-DATA-2 item 1: the route context\'s word at village size and below', () => {
  it('a small place takes its water\'s word; a town keeps the route\'s word', () => {
    for (const c of CASES) {
      const profile = c.water === 'maritime' ? 'coastal' : c.water === 'river' ? 'river' : 'general';
      const out = smallPlaceWordsOf({ disasterProfile: profile }, factsFor(c));
      if (!SMALL.has(c.tier)) { expect(out).toEqual({}); continue; }
      const word = c.water === 'maritime' ? HISTORY_SMALL_PLACE_WORDS.coastal.text : c.water === 'river' ? HISTORY_SMALL_PLACE_WORDS.river.text : HISTORY_SMALL_PLACE_WORDS.inland.text;
      expect(out).toEqual({ disasterLocation: word, disasterQuarter: word });
    }
  });
});

/** The cold list's fixture towns this item reads (`town.config` and `town.seed` as the list gives them). */
const FIXTURE = [
  { id: 'c01-thorp-none', seed: 'review-w2b-1', config: { settType: 'thorp', selectedStressesRandom: false, selectedStresses: [], stressType: null, stressTypes: [] }, rows: [3, 7], text: 'lower districts' },
  { id: 'c11-village-none', seed: 'review-w2b-11', config: { settType: 'village', selectedStressesRandom: false, selectedStresses: [], stressType: null, stressTypes: [] }, rows: [29], text: 'lower districts' },
  { id: 'c13-village-famine', seed: 'review-w2b-13', config: { settType: 'village', stressType: 'famine', stressTypes: ['famine'] }, rows: [204], text: 'the waterfront' },
  { id: 'c24-city-none', seed: 'review-w2b-24', config: { settType: 'city', selectedStressesRandom: false, selectedStresses: [], stressType: null, stressTypes: [] }, rows: [282], text: 'the waterfront' },
];

describe('W2-FIX-DATA-2 item 1: the fixture towns print no false place word', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  for (const t of FIXTURE) {
    it(`${t.id} (rows ${t.rows.join(', ')}): "${t.text}" is gone from the history, which still tells its event`, () => {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...t.config }), null, { seed: t.seed, customContent: {} });
      const texts = [...s.history.historicalEvents, ...s.history.currentTensions].map((e) => String(e.description));
      expect(texts.length).toBeGreaterThan(0);
      expect(texts.filter((d) => d.includes(t.text))).toEqual([]);
      expect(texts.some((d) => /Waters rose|surge of magic/.test(d)), 'the flood or the surge still prints').toBe(true);
    }, 60_000);
  }
});
