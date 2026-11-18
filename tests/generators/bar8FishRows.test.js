// THE GUARD OF BAR8-FISH-ROWS (BRIEF-BAR8, ruling BR24, 2026-11-17; auditor J's rules 11b.fish and 11b.fishTitle): THE FISH
// MARKET'S CATCH ROW WHERE THE FISH IS BOUGHT IN. A Fish market printed "Fresh fish retail · Fish sold daily from the morning
// catch." in a town whose fish grounds are used up and whose fish is bought in ("Salted fish (local … exhausted)" on its
// imports). THE CURE (`src/generators/steps/generateNarratives.js :: boughtFishRowsInPlace`, right after the birth has written
// its imports): where the story is BOUGHT the catch row is its pool's own inland alternative (the catalogue's
// `inlandAlternative`: the Fish market's "Preserved fish", the Fishmonger's "Salted fish"), in place, with no draw. AN IDLE TOWN
// (grounds spent, no fish brought in) keeps its row and its "Short of fish." mark; A TOWN WHOSE FISHERS LAND THEIR OWN CATCH
// keeps "Fresh fish retail". The story here is the auditor's own reading of the stored record (`law11Supply.mjs ::
// materialStory`), not the cure's. The anchors are towns of the census's 720 and the read's thirty (the counts over the
// thirty, the 150 and the 720 are in docs/chair/2026-11-17/bar8/BAR8-FISH-ROWS-HANDBACK.md); every seed loop collects.
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { materialStory } from '../helpers/pageLaws/law11Supply.mjs';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { resolveServiceCatalogKey } from '../../src/generators/services/institutionServices.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';

const CATCH_ROW = 'Fresh fish retail';
const CATCH_DESC = 'Fish sold daily from the morning catch. Selection varies by season.';
const PRESERVED = 'Preserved fish';
const PRESERVED_DESC = 'Smoked, dried, and salt-preserved fish for storage and inland trade.';

/** BOUGHT: the fish grounds spent and the spent ground's salted fish on the imports (the Fish market's catch row moved). */
const BOUGHT = Object.freeze(['r2r-village-11', 'r2r-town-29', 'r2r-city-14', 'bar0-metropolis-calm-rand-8']);
/** IDLE: the fish grounds spent and no fish brought in: the row and its mark as at the base (ruling BR24). */
const IDLE = Object.freeze(['r2r-village-45', 'r2r-metropolis-45', 'r2s-recently_betrayed-metropolis-0', 'r2s-plague_onset-thorp-2']);
/** LOCAL: a live fishery, the fishers land their own catch (a fish market, a fishing community). */
const LOCAL = Object.freeze(['r2r-town-15', 'bar0-village-calm-rand-32', 'r2r-thorp-44']);
/** THE THIRTY of the seventh read (`docs/chair/2026-11-17/review-bar-7/packets/seeds.bar7.txt` on lane/read7-prep-2026-11-17). */
const THIRTY = Object.freeze(['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-calm', 'town-occupied',
  'city-under_siege+famine', 'city-wartime', 'metropolis-calm'].flatMap((shape) => [45, 46, 47].map((n) => `bar0-${shape}-rand-${n}`)));

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's census and bar arms, in shape (as `bar8Rows.test.js` reads them). @param {string} seed */
function configOf(seed) {
  const c = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (c) return { ...DIALS, settType: c[1] };
  const f = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (f) return { ...DIALS, selectedStresses: [f[1]], selectedStressesRandom: false, settType: f[2] };
  const m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (!m) throw new Error(`a guard seed is a census or a read seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
}

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of [...BOUGHT, ...IDLE, ...LOCAL, ...THIRTY]) {
    BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
  }
}, 600_000);

/** Every native service row of a record, with its pool. @param {any} town */
const rowsOf = (town) => Object.values(town?.availableServices || {}).flat()
  .filter((r) => r && typeof r === 'object' && r.custom !== true && r.source !== 'custom')
  .map((r) => ({ name: String(r.name), desc: String(r.desc ?? ''), house: String(r.institution ?? ''), pool: resolveServiceCatalogKey(String(r.institution ?? '')) }));
/** A row of a catch whose pool names its inland alternative (`data/institutionServices.js`). @param {{ name: string, pool: string | null }} r */
const altOf = (r) => { const def = r.pool ? /** @type {any} */ (INSTITUTION_SERVICES)[r.pool]?.[r.name] : null; return typeof def?.inlandAlternative === 'string' ? def.inlandAlternative : null; };
/** The Fish market pool's rows of a record (a fish market or a fishing community). @param {any} town */
const fishMarketRows = (town) => rowsOf(town).filter((r) => r.pool === 'Fish market');
const fishStory = (/** @type {string} */ seed) => materialStory(BORN.get(seed), 'fish').story;

describe('BAR8-FISH-ROWS: the fish market\'s catch row reads the fish story the birth wrote (BR24)', () => {
  it('BOUGHT: the fish bought in, the Fish market sells its "Preserved fish" with its own words, and no morning catch', () => {
    const failures = collectSeedFailures(BOUGHT, (seed) => {
      expect(fishStory(seed), `${seed}: the anchor's story`).toBe('bought-used');
      const rows = fishMarketRows(BORN.get(seed));
      expect(rows.filter((r) => r.name === PRESERVED).map((r) => r.desc), `${seed}: the pool's own row`).toEqual([PRESERVED_DESC]);
      expectAbsentWithAnchor(rows.map((r) => r.name), CATCH_ROW, PRESERVED, seed);
      expect(rowsOf(BORN.get(seed)).filter((r) => /morning'?s? catch/i.test(r.desc)), `${seed}: a morning catch`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every bought town sells the pool\'s preserved fish, not the morning catch');
  });

  it('IDLE: the grounds spent and no fish brought in, the catch row is kept as at the base (no "Preserved fish")', () => {
    const failures = collectSeedFailures(IDLE, (seed) => {
      expect(fishStory(seed), `${seed}: the anchor's story`).toBe('idle');
      const rows = fishMarketRows(BORN.get(seed));
      expect(rows.filter((r) => r.name === CATCH_ROW).map((r) => r.desc), `${seed}: the catch row`).toEqual([CATCH_DESC]);
      expectAbsentWithAnchor(rows.map((r) => r.name), PRESERVED, CATCH_ROW, seed);
    });
    expectNoSeedFailures(failures, 'every idle town keeps its catch row');
  });

  it('LOCAL: a live fishery, the fishers land their own catch: "Fresh fish retail" is kept (no "Preserved fish")', () => {
    const failures = collectSeedFailures(LOCAL, (seed) => {
      expect(fishStory(seed), `${seed}: the anchor's story`).toBe('local');
      const rows = fishMarketRows(BORN.get(seed));
      expect(rows.filter((r) => r.name === CATCH_ROW).map((r) => r.desc), `${seed}: the catch row`).toEqual([CATCH_DESC]);
      expectAbsentWithAnchor(rows.map((r) => r.name), PRESERVED, CATCH_ROW, seed);
    });
    expectNoSeedFailures(failures, 'every town that lands its own catch keeps its catch row');
  });

  it('THE THIRTY: a bought town prints no catch row whose pool names an alternative; a local or idle town no "Preserved fish"', () => {
    const failures = collectSeedFailures(THIRTY, (seed) => {
      const town = BORN.get(seed);
      const story = fishStory(seed);
      if (story === 'bought-used') {
        expect(rowsOf(town).filter((r) => altOf(r)).map((r) => `${r.house}: ${r.name}`), `${seed}: a catch row of a bought story`).toEqual([]);
      }
      if (story === 'local' || story === 'idle') {
        expect(fishMarketRows(town).filter((r) => r.name === PRESERVED).map((r) => r.house), `${seed}: preserved fish under a ${story} story`).toEqual([]);
      }
    });
    expectNoSeedFailures(failures, 'the thirty\'s fish rows tell the fish story');
    // the law is not vacuous: the thirty hold bought towns, and their markets print the alternative
    const bought = THIRTY.filter((seed) => fishStory(seed) === 'bought-used' && fishMarketRows(BORN.get(seed)).length > 0);
    expect(bought.length, 'bought towns with a fish market among the thirty').toBeGreaterThanOrEqual(4);
    expect(bought.filter((seed) => !fishMarketRows(BORN.get(seed)).some((r) => r.name === PRESERVED)), 'a bought market without its preserved fish').toEqual([]);
  });

  it('N4: the shared page keeps the row as the owner\'s page stores it (the public record and the share veil)', () => {
    const failures = collectSeedFailures([...BOUGHT, ...IDLE], (seed) => {
      const own = fishMarketRows(BORN.get(seed));
      expect(own.length, `${seed}: the owner's fish market rows`).toBeGreaterThan(0);
      expect(fishMarketRows(toPublicSafe(structuredClone(BORN.get(seed)))), `${seed}: public`).toEqual(own);
      expect(fishMarketRows(projectShareVeil(toPublicSafe(structuredClone(BORN.get(seed))), null)), `${seed}: veil`).toEqual(own);
    });
    expectNoSeedFailures(failures, 'the shared page prints the owner\'s fish row');
  });
});

// THE CONSTRUCTED ARMS (2026-11-18, the second reader's MED 1: three hunks no town of the 900 reaches). The real narratives step
// runs inside a real birth of a BOUGHT town (r2r-city-14) and of an IDLE one (r2r-village-45); in a module graph of their own,
// the step is wrapped so that just before it runs the constructed rows are laid into `ctx.availableServices.food` (a record no
// roll makes): (a) a later row of the Fish market already bearing "Preserved fish", (b) a CUSTOM row named "Fresh fish
// retail" under the Fish market, (c) the Fishmonger's "Fresh fish" and its later "Salted fish".
const FISHMONGER_FRESH = { name: 'Fresh fish', desc: "Today's catch. Buy early.", institution: 'Fishmonger' };
const FISHMONGER_SALTED = { name: 'Salted fish', desc: 'Salt-cured fish. Weeks of shelf life.', institution: 'Fishmonger' };
const LATER_PRESERVED = { name: PRESERVED, desc: PRESERVED_DESC, institution: 'Fish market' };
const CUSTOM_CATCH = { name: CATCH_ROW, desc: 'A custom catch row of the owner\'s own.', institution: 'Fish market', custom: true, source: 'custom', localUid: 'bar8-fish-rows-custom' };
/** @type {Map<string, any[]>} the food rows each constructed birth stores, keyed `<seed>` */
const CONSTRUCTED = new Map();
/** the food rows as laid in, before the step ran, keyed `<seed>` */
const LAID = new Map();
describe('BAR8-FISH-ROWS: the constructed rows (the splice, the custom row, the Fishmonger)', () => {
  beforeAll(async () => {
    vi.resetModules();
    vi.doMock('../../src/generators/pipeline.js', async (importOriginal) => {
      const orig = /** @type {any} */ (await importOriginal());
      return { ...orig, registerStep: (/** @type {string} */ name, /** @type {any} */ meta, /** @type {Function} */ fn) => orig.registerStep(name, meta, name !== 'generateNarratives' ? fn : (/** @type {any} */ ctx, /** @type {any} */ rng) => {
        const food = ctx.availableServices.food;
        food.push({ ...LATER_PRESERVED }, { ...CUSTOM_CATCH }, { ...FISHMONGER_FRESH }, { ...FISHMONGER_SALTED });
        LAID.set(String(ctx._seed), structuredClone(food));
        return fn(ctx, rng);
      }) };
    });
    const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    await boundary.loadGenerationLawPayloads();
    for (const seed of ['r2r-city-14', 'r2r-village-45']) {
      CONSTRUCTED.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }).availableServices.food);
    }
    vi.doUnmock('../../src/generators/pipeline.js');
    vi.resetModules();
  }, 600_000);
  /** @param {any[]} rows @param {string} house @param {string} name */
  const named = (rows, house, name) => rows.filter((r) => r.institution === house && r.name === name && r.custom !== true);

  it('(a) the splice: the catch row takes "Preserved fish" in its place, and the house\'s later "Preserved fish" is not printed twice', () => {
    const laid = LAID.get('r2r-city-14'); const food = CONSTRUCTED.get('r2r-city-14');
    const at = laid.findIndex((r) => r.institution === 'Fish market' && r.name === CATCH_ROW && r.custom !== true);
    expect(at, 'anchored: the bought town rolled its catch row').toBeGreaterThanOrEqual(0);
    expect(named(food, 'Fish market', PRESERVED).length, 'one "Preserved fish" for the house').toBe(1);
    expect(food[at], 'in the catch row\'s place').toEqual({ ...laid[at], name: PRESERVED, desc: PRESERVED_DESC });
    expect(food.length, 'one row fewer: the later duplicate only').toBe(laid.length - 2); // the catch row stays (renamed); the later "Preserved fish" and the Fishmonger's later "Salted fish" go
  });

  it('(b) the custom row: a custom row named "Fresh fish retail" under the Fish market is untouched', () => {
    const food = CONSTRUCTED.get('r2r-city-14');
    expect(food.filter((r) => r.custom === true && r.localUid === CUSTOM_CATCH.localUid), 'the custom row, as laid').toEqual([CUSTOM_CATCH]);
  });

  it('(c) the Fishmonger\'s half: its "Fresh fish" becomes its own "Salted fish" in place, printed once', () => {
    const laid = LAID.get('r2r-city-14'); const food = CONSTRUCTED.get('r2r-city-14');
    const at = laid.findIndex((r) => r.institution === 'Fishmonger' && r.name === 'Fresh fish');
    // its place: one row earlier than laid, the Fish market's later "Preserved fish" (laid before it) being spliced by (a)
    expect(food[at - 1], 'in its place, with the pool\'s own words').toEqual({ ...FISHMONGER_FRESH, name: 'Salted fish', desc: FISHMONGER_SALTED.desc });
    expectAbsentWithAnchor(food.filter((r) => r.institution === 'Fishmonger').map((r) => r.name), 'Fresh fish', 'Salted fish', 'the Fishmonger');
    expect(named(food, 'Fishmonger', 'Salted fish').length, 'printed once').toBe(1);
  });

  it('IDLE, the same rows laid: nothing moves (the swap is the bought story\'s only)', () => {
    expect(CONSTRUCTED.get('r2r-village-45'), 'the idle town stores the rows as laid').toEqual(LAID.get('r2r-village-45'));
    expect(named(LAID.get('r2r-village-45'), 'Fish market', CATCH_ROW).length, 'anchored: the idle town has its catch row').toBe(1);
  });
});
