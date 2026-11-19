// BAR4-CORPUS-ECO's GUARD (BRIEF-BAR4, amendment K4): the three detectors of `tests/helpers/corpusEcoKinds.js` kept as a
// guard, each with (a) THE ZERO and (b) A POSITIVE CONTROL.
//
//   (a) THE ZERO: every census town in which a detector fired at the base (8aef8e7d4, the census's 720 read whole by
//       the detectors: the hand-back's table "THE KINDS"), born in the census's own configuration shape and drawn as the
//       owner's page draws it (the public sites and the owner's own economy read; the kernel's draw record holds each
//       member's authored text); the detectors over the town's record and those lines find nothing. The census's after
//       run over the 720 and the fresh 300 is the whole measure; these towns are where it bit.
//   (b) THE POSITIVE CONTROL: a record built for each kind's state, with a line of the kind printed in it: the detector
//       MUST fire, so it cannot go blind (a reworded member is still watched: the detectors read each member's own text).
//   And the spent-source atom (`src/domain/facts/leadingSourceSpent.js`, read off the config) agrees with the detector's
//   reading of the page's land rows (`resourceAnalysis.resourceConditions`) in every guard town.
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { detectE1, detectE2, detectE3, leadingSourceSpent, memberSearch, LEADING_SOURCE_LINES, REASSURANCE, SIZING } from '../helpers/corpusEcoKinds.js';
import { leadingSourceSpentOf } from '../../src/domain/facts/leadingSourceSpent.js';
import { ownPlotsOf } from '../../src/domain/facts/ownPlots.js';
import { liveInstitutionNames } from '../../src/domain/facts/liveInstitutionNames.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { FISH_BOUGHT_LINE, FISH_RITES_LINE } from '../../src/generators/economy/incomeLineSiblings.js';

/** The food-source pools' members (the twins are found by what they declare, never by a literal). */
const STATE_TWINS = /** @type {Array<{text: string, marks?: string[]}>} */ (Object.entries(/** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY)['DS-ECO-9'].pools)
  .filter(([key]) => key.startsWith('FOOD SOURCES')).flatMap(([, members]) => members));

const seen = vi.hoisted(() => ({ cur: /** @type {string[]|null} */ (null) }));

vi.mock('../../src/domain/display/stateProse/stateProseKernel.js', async (importOriginal) => {
  const kernel = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...kernel,
    drawVariant: (/** @type {any[]} */ eligible, /** @type {string} */ blockId, /** @type {string} */ poolKey, /** @type {string} */ seed) => {
      const drawn = kernel.drawVariant(eligible, blockId, poolKey, seed);
      if (seen.cur && drawn) seen.cur.push(String(drawn.text));
      return drawn;
    },
  };
});

/** The census towns in which a detector fired at the base (8aef8e7d4), by kind. */
const SPENT_AT_BASE = Object.freeze(['r2r-hamlet-10', 'r2r-village-45', 'r2r-town-38', 'r2r-metropolis-11', 'r2r-metropolis-42', 'r2s-under_siege-village-1', 'r2s-indebted-hamlet-1', 'r2s-recently_betrayed-metropolis-0']);
const PLOTS_AT_BASE = Object.freeze(['r2r-thorp-3', 'r2r-thorp-33', 'r2r-thorp-59', 'r2r-hamlet-23', 'r2r-hamlet-47', 'r2s-famine-hamlet-2', 'r2s-recently_betrayed-thorp-2', 'r2s-religious_conversion-thorp-0']);
// (a spread of each row's towns at the base: E1 31 spent-ground and 98 own-plots towns, E2 38, E3 55 of the 720)
const AT_BASE = Object.freeze({
  E1: Object.freeze([...SPENT_AT_BASE, ...PLOTS_AT_BASE]),
  E2: Object.freeze(['r2r-thorp-45', 'r2r-thorp-58', 'r2s-under_siege-hamlet-0', 'r2r-hamlet-27', 'r2r-town-7', 'r2s-occupied-village-0', 'r2s-indebted-city-0', 'r2s-monster_pressure-town-0', 'r2s-religious_conversion-metropolis-0', 'r2s-wartime-thorp-0', 'r2s-mass_migration-hamlet-2']),
  E3: Object.freeze(['r2r-town-15', 'r2r-city-10', 'r2r-city-36', 'r2r-city-49', 'r2r-metropolis-6', 'r2r-metropolis-24', 'r2r-metropolis-45', 'r2r-metropolis-57', 'r2s-recently_betrayed-city-2', 'r2s-infiltrated-metropolis-3']),
});
/** The chair's FS1 (CORPUS-DEF's measure): towns of the 720 that printed FISH_BOUGHT_LINE at the base over a fishing chain the rites
 * hold up (13 of the 19), and two that printed it with no rites (6 of 19: the KEEP: still bought in). */
const RITES_AT_BASE = Object.freeze(['r2r-town-6', 'r2r-city-35', 'r2r-metropolis-11', 'r2s-wartime-city-1']);
const BOUGHT_KEEP = Object.freeze(['r2r-town-3', 'r2r-city-34']);
const SEEDS = [...new Set([...Object.values(AT_BASE).flat(), ...RITES_AT_BASE, ...BOUGHT_KEEP])];

/** @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a guard seed is a census seed: ${seed}`);
}

/** @type {Map<string, {record: any, lines: string[]}>} */
const READ = new Map();
/** The economy desk's read of a record, every line it draws (set in beforeAll; BAR4-SCENES-2's MU1 proof reads it). @type {(town: any) => string[]} */
let deskLines = () => [];

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
  const { composePublicProse, PUBLIC_PROSE_SITES } = await import('../../src/components/new/publicProseCompose.js');
  const { publicVeiledRecordOf } = await import('../../src/domain/display/publicSafe.js');
  const { economyDeskRead } = await import('../../src/components/new/economyDeskRead.js');
  const { economicsDeskArgs } = await import('../../src/components/new/deskHostArgs.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    let town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    seen.cur = [];
    const ctx = { veiledRecord: publicVeiledRecordOf(town) };
    for (const [, draw] of PUBLIC_PROSE_SITES) {
      try { draw(town, false, ctx); } catch { /* a site that throws prints nothing */ }
    }
    try { economyDeskRead(town, { publicDossier: false, playerView: false, tier: town?.tier, ...economicsDeskArgs(town) }); } catch { /* as above */ }
    READ.set(seed, { record: town, lines: seen.cur });
    seen.cur = null;
  }
  deskLines = (/** @type {any} */ town) => {
    seen.cur = [];
    try { economyDeskRead(town, { publicDossier: false, playerView: false, tier: town?.tier, ...economicsDeskArgs(town) }); } catch { /* a desk that throws prints nothing */ }
    const out = seen.cur; seen.cur = null; return out;
  };
}, 600000);

const DETECTORS = Object.freeze({ E1: detectE1, E2: detectE2, E3: detectE3 });

describe('THE ZERO: in every census town where a kind was found at the base, the detector now finds none', () => {
  it('each town is read (born, and its desks drew lines)', () => {
    expect(SEEDS.length).toBeGreaterThan(0);
    expectNoSeedFailures(collectSeedFailures(SEEDS, (seed) => { expect(READ.get(seed)?.lines.length, seed).toBeGreaterThan(0); }));
  });
  for (const [kind, seeds] of Object.entries(AT_BASE)) {
    it(`${kind}: no instance in the ${seeds.length} towns of the base`, () => {
      expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
        const read = /** @type {{record: any, lines: string[]}} */ (READ.get(seed));
        expect(/** @type {any} */ (DETECTORS)[kind](read.record, read.lines).map((h) => `${h.id} | ${h.state}`), `${kind} at ${seed}`).toEqual([]);
      }));
    });
  }
  it('the spent-source atom (read off the config) agrees with the page\'s land rows in every guard town', () => {
    expectNoSeedFailures(collectSeedFailures(SEEDS, (seed) => {
      const { record } = /** @type {{record: any}} */ (READ.get(seed));
      expect(leadingSourceSpentOf(record), seed).toBe(Boolean(leadingSourceSpent(record)?.spent));
    }));
  });
  it('E1: a spent-ground town and an own-plots town now read the twin written for their state', () => {
    const twin = (/** @type {string} */ mark) => STATE_TWINS.filter((m) => (m.marks || []).includes(mark)).map((m) => memberSearch(m.text));
    const cases = [...SPENT_AT_BASE.map((seed) => ({ seed, res: twin('source spent'), atom: leadingSourceSpentOf })),
      ...PLOTS_AT_BASE.map((seed) => ({ seed, res: twin('own plots'), atom: (/** @type {any} */ r) => ownPlotsOf(r, liveInstitutionNames(r)) }))];
    expectNoSeedFailures(collectSeedFailures(cases, ({ seed, res, atom }) => {
      const read = /** @type {{record: any, lines: string[]}} */ (READ.get(seed));
      expect(atom(read.record), `${seed} is still in its state`).toBe(true);
      expect(read.lines.some((l) => res.some((re) => re.test(l))), `${seed} prints a twin of its state`).toBe(true);
    }));
  });
});

describe('FS1: the fished-out income line reads the rites that hold the fishing chain up', () => {
  const descs = (/** @type {string} */ seed) => (/** @type {any} */ (READ.get(seed))?.record?.economicState?.incomeSources || []).map((/** @type {any} */ i) => String(i.desc ?? ''));
  // FS1 (a) RETIRED BY RULING BR33 (the sixth chair, 2026-11-18; BAR8 J-INCOME item 2): the earlier ruling yields to the owner's
  // supply rule. A chain kept by magic feeds no house (`supplyStory.js :: sourceStoryOf`), so where the fish is bought in the
  // bought line prints, whatever the rites hold. The retired claim, in its own words: "where the rites hold the chain up, the rites
  // line prints in place of \"bought in\"". FS1 (a)'s four towns, re-keyed to the claim that now holds there.
  it('BR33: where the fish is bought in, the bought line prints and the rites line does not, whatever the rites hold', () => {
    expectNoSeedFailures(collectSeedFailures(RITES_AT_BASE, (seed) => {
      expectAbsentWithAnchor(descs(seed), FISH_RITES_LINE, FISH_BOUGHT_LINE, seed);
    }));
  });
  it('where no rites hold it, the bought line still prints (KEEP)', () => {
    expectNoSeedFailures(collectSeedFailures(BOUGHT_KEEP, (seed) => { expect(descs(seed), seed).toContain(FISH_BOUGHT_LINE); }));
  });
});

/** A record in a kind's state, built from nothing but the fields the detectors read. */
const record = (/** @type {any} */ over) => ({
  tier: 'town', config: {}, stress: [], stressors: [], activeConditions: [],
  economicState: { foodSecurity: { deficitPct: 0, foodRecord: { band: 'secure', foodSources: ['grain'] } }, safetyProfile: { blackMarketCapture: 0 } },
  resourceAnalysis: { resourceConditions: [] }, ...over,
});
/** A member's authored text, its slots filled as a page fills them. @param {{text: string}} w */
const printed = (w) => w.text.replace(/\{settlement\}/g, 'Tzulcoatl').replace(/\{good\}/g, 'fishing').replace(/\{\w+\}/g, 'the guild');

// BAR4-SCENES-2 (2026-11-16, the chair's MU1 of 12:16 UTC: a line whose state is reachable stays, proved by one constructed
// record). DS-ECO-9 "FOOD SOURCES: several, the largest named" v6 (a food band at or under deficit, no siege, no famine, no source
// spent) prints in neither population; its state is reached here: a guard town whose desk draws the pool, its food band set to
// deficit, prints v6, the pool's one line its declarations admit there.
describe('REACHABLE (MU1): DS-ECO-9 several v6 prints in a town of its state', () => {
  it('a guard town that draws the pool, its band at deficit and no crisis, prints v6', () => {
    const pool = /** @type {Array<{text: string, vid: number, marks?: string[]}>} */ (/** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY)['DS-ECO-9'].pools['FOOD SOURCES: several, the largest named']);
    // the draw spy records each drawn variant's own text (its template), so a member is found by its text
    const calmVids = new Set([1, 2, 3]); // the pool's members of no crisis and a band above deficit
    const drewCalm = (/** @type {string[]} */ lines) => pool.some((v) => calmVids.has(v.vid) && lines.includes(v.text));
    const seed = SEEDS.find((x) => drewCalm(/** @type {any} */ (READ.get(x)).lines));
    expect(seed, 'a guard town drew one of the pool\'s no-crisis members').toBeTruthy();
    const town = /** @type {any} */ (READ.get(/** @type {string} */ (seed))).record;
    const e = town.economicState; const fs = e.foodSecurity;
    const deficit = { ...town, economicState: { ...e, foodSecurity: { ...fs, foodRecord: { ...fs.foodRecord, band: 'deficit' } } } };
    const v6 = /** @type {{text: string}} */ (pool.find((v) => v.vid === 6));
    const lines = deskLines(deficit);
    expect(lines, `v6 prints in ${seed} at deficit`).toContain(v6.text);
  });
});

describe('THE POSITIVE CONTROL: on a record in the kind\'s state, a line of the kind printed there is found', () => {
  it('E1: a spent fishery under a fish-led food record, with a food-source line', () => {
    const r = record({
      economicState: { foodSecurity: { foodRecord: { band: 'secure', foodSources: ['fish'] } } },
      resourceAnalysis: { resourceConditions: [{ key: 'river_fish', condition: 'depleted' }] },
      config: { nearbyResources: ['river_fish'], nearbyResourcesDepleted: ['river_fish'] },
    });
    const line = printed(/** @type {any} */ (LEADING_SOURCE_LINES.find((w) => /leans first/.test(w.text))));
    expect(detectE1(r, [line]).map((h) => h.kind)).toEqual(['E1']);
    expect(leadingSourceSpentOf(r)).toBe(true);
    // and the same line beside an available fishery is not one
    expect(detectE1(record({ ...r, resourceAnalysis: { resourceConditions: [{ key: 'river_fish', condition: 'available' }] } }), [line])).toEqual([]);
  });
  it('E2: a deficit band with a structural reassurance, and a crisis over a shortfall with a calm-times line', () => {
    const structural = printed(/** @type {any} */ (REASSURANCE.find((w) => /does not empty/.test(w.text))));
    expect(detectE2(record({ economicState: { foodSecurity: { foodRecord: { band: 'deficit', foodSources: ['grain', 'fish'] } } } }), [structural]).map((h) => h.kind)).toEqual(['E2']);
    const calm = printed(/** @type {any} */ (REASSURANCE.find((w) => w.calm && /raises unprompted/.test(w.text))));
    const wartime = record({ stress: [{ type: 'wartime' }], stressors: [{ type: 'wartime' }], economicState: { foodSecurity: { deficitPct: 3, foodRecord: { band: 'secure', foodSources: ['grain'] } } } });
    expect(detectE2(wartime, [calm]).map((h) => h.kind)).toEqual(['E2']);
  });
  it('E3: a minor share with a line that calls it large', () => {
    const large = printed(/** @type {any} */ (SIZING.find((w) => /large share/.test(w.text))));
    expect(detectE3(record({ economicState: { safetyProfile: { blackMarketCapture: 11 } } }), [large]).map((h) => h.kind)).toEqual(['E3']);
    expect(detectE3(record({ economicState: { safetyProfile: { blackMarketCapture: 31 } } }), [large])).toEqual([]);
  });
});
