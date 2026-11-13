/**
 * W2-FIX-DATA-HISTORY (2026-11-13) — the history, culture and arrival lines of the data lane's seventh seat, each item a
 * describe of its own, each with its GUARD: a fixed town, born in the app's own shape (the configuration panel: Random
 * off, the ticked list), in which the cured line must not print, beside the town in which it still does.
 *
 * ITEM A (ROUND-3-CUT-INCREMENT ww-543, ww-572, ww-1524; CENSUS-2's `historyDescVariants.js :: economic_disparity`,
 * 46 towns): the Economic Divide is merchants against labourers, and the trade dispute "touched every merchant and every
 * purse in town"; each printed in hamlets the market home reads none in. Each needs a market
 * (`historyGenerator.js :: HISTORY_TEMPLATE_RECORD_DECLARATIONS`), the divide and the crash its pool falls to as past
 * events too.
 *
 * ITEM C (the review of the data lane, L4; ROUND-3-CUT-INCREMENT ww-254, ww-724, ww-752, ww-754, ww-755, ww-756): the
 * occupation's legacy (collaborators and resisters, a former occupier officer) printed in towns whose timeline holds no
 * occupation; it is set aside there (`historyData.js :: tensionHeldByTimeline`), and the former officer is not said
 * under an occupation in force.
 *
 * THIS FILE REDS WHEN: a cured line prints again in its guard town, or a declaration is dropped or turned.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { HISTORY_TEMPLATE_RECORD_DECLARATIONS, trueToRecordAt } from '../../src/generators/historyGenerator.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { HISTORICAL_EVENTS_DATA, TENSIONS_THAT_NEED_THEIR_OWN_EVENT, tensionHeldByTimeline } from '../../src/data/historyData.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** A reader's town re-born in the app's own shape (the seed's tier and ticked crises). */
const born = (/** @type {string} */ seed) => {
  const [, settType, crises] = /** @type {RegExpMatchArray} */ (seed.match(/^r[a-z0-9]+-(\w+?)-([a-z_+]+)-\d+$/));
  const selectedStresses = crises === 'calm' ? [] : crises.split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType, selectedStressesRandom: false, selectedStresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** Every history sentence of a record (the timeline's and the tensions'). */
const historyText = (/** @type {any} */ s) => JSON.stringify([s.history.historicalEvents, s.history.currentTensions]);
const townWith = (/** @type {string[]} */ houses) => factsOf({ tier: 'village', institutions: houses.map((name) => ({ name, tags: name === 'Weekly market' ? ['market'] : [] })), config: {} });

describe('W2-FIX-DATA-HISTORY item A: merchants only where a market stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('the divide, the dispute and the crash declare the market they presume', () => {
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.economic_disparity).toEqual({ needs: ['market'], timeline: true });
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.trade_dispute).toEqual({ needs: ['market'], timeline: false });
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.market_crash).toEqual({ needs: ['market'], timeline: true });
  });

  it('refused where the market home reads none, admitted where it reads one', () => {
    const none = townWith([]); const market = townWith(['Weekly market']);
    expect(market.market, 'the fixture holds a market').toBe(true);
    for (const type of ['economic_disparity', 'trade_dispute', 'market_crash']) {
      expect(trueToRecordAt({ type }, none, true), `${type}: no market`).toBe(false);
      expect(trueToRecordAt({ type }, market, true), `${type}: a market`).toBe(true);
    }
    expect(trueToRecordAt({ type: 'economic_disparity' }, none, false), 'the divide as a past event').toBe(false);
    expect(trueToRecordAt({ type: 'trade_dispute' }, none, false), 'the dispute is judged as a tension only').toBe(true);
  });

  // GUARDS: the readers' own towns (ww-543 and ww-572; ww-1524), each a hamlet with no market
  for (const [seed, words] of /** @type {const} */ ([
    ['rww-hamlet-succession_void-1', ['The merchants are getting richer', 'A merchant is funding both', 'The merchant class prospers', 'The Economic Divide']],
    ['rww-hamlet-calm-1', ['every merchant and every purse', 'Merchants tied to the old partner']],
  ])) {
    it(`${seed}: no merchant of the divide or the dispute where no market stands, and the town keeps its history`, () => {
      const s = born(seed);
      expect(factsOf(s).market, `${seed} has no market`).toBe(false);
      const text = historyText(s);
      expect(words.filter((w) => text.includes(w))).toEqual([]);
      expect(s.history.currentTensions.length, 'the town still carries a current tension').toBeGreaterThan(0);
    }, 60_000);
  }
});

describe('W2-FIX-DATA-HISTORY item C: the occupation\'s legacy only where the timeline holds the occupation', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const OCCUPATION_WORDS = /collaborat|resistance fighters|resistance famil|occupier/i;

  it('the legacy needs its own past; every other tension stands as before', () => {
    expect(TENSIONS_THAT_NEED_THEIR_OWN_EVENT).toEqual(['occupation_legacy']);
    expect(tensionHeldByTimeline({ type: 'occupation_legacy' }, [{ templateType: 'religious_tension' }])).toBe(false);
    expect(tensionHeldByTimeline({ type: 'occupation_legacy' }, [{ templateType: 'occupation_legacy', yearsAgo: 120 }])).toBe(true);
    expect(tensionHeldByTimeline({ type: 'great_fire' }, [])).toBe(true);
    const officer = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'occupation_legacy')?.plotHooks?.find((h) => typeof h === 'object');
    expect(officer).toEqual({ text: 'A former occupier officer has returned under a false identity', excludes: ['crisis: occupied'] });
  });

  // GUARDS: the readers' own towns with no occupation on the timeline (a thorp under a siege, ww-254; a calm city, ww-752..756)
  for (const seed of ['rww-thorp-under_siege-1', 'rww-city-calm-1', 'rww-hamlet-under_siege-1']) {
    it(`${seed}: no tension speaks of collaborators or an occupier, and the town keeps a tension`, () => {
      const s = born(seed);
      expect(s.history.historicalEvents.some((/** @type {any} */ e) => e.templateType === 'occupation_legacy'), 'no occupation on the timeline').toBe(false);
      expect(JSON.stringify(s.history.currentTensions)).not.toMatch(OCCUPATION_WORDS);
      expect(s.history.currentTensions.length).toBeGreaterThan(0);
    }, 60_000);
  }
  it('rpf-thorp-occupied-13: under an occupation in force no "former occupier officer" is told, and its Occupation keeps its account', () => {
    const s = born('rpf-thorp-occupied-13');
    expect(factsOf(s).crisis.kinds).toContain('occupied');
    const own = s.history.historicalEvents.find((/** @type {any} */ e) => e.templateType === 'occupation_legacy');
    expect(own, 'the past Occupation on the timeline').toBeTruthy();
    expect(historyText(s)).not.toContain('former occupier officer');
  }, 60_000);
});
