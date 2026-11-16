// BAR4-CORPUS-DEF · THE DEFENCE DESK'S KINDS, GUARDED (BRIEF-BAR4 amendment K4): the detectors of
// tests/helpers/defenceDeskKinds.js read over the census's 720 and the read towns of REVIEW-BAR-4, with a positive
// control for every kind so that no detector can go blind.
//
//   THE ZERO: every census town (the CENSUS-3 rule: `r2r-<size>-<0..59>` random dials, `r2s-<crisis>-<size>-<0..3>`
//     one crisis ticked) and every read town of the worklist is born and its defence and magic desks drawn as the
//     owner's page draws them (the public sites and the owner's own reads); the kernel's draw record gives each DS-DEF
//     member drawn; the detectors find no member printing in a state that makes it false. Red at 8aef8e7d46: D1 16
//     instances in 15 census towns, D2 20 in 20, D3 13 in 13, C24893 4 in 4 (BAR4-CORPUS-DEF's K2 line), and each read
//     town's own row.
//   THE POSITIVE CONTROL: on each read town's own record the detector MUST fire for the member the reader met there
//     (handed to it as drawn), so a detector that stops reading its state reds here, not silently.
//   THE TWINS DRAW: a state the cure would have left mute takes a twin true in it, and the twin is drawn in a read town.
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFENCE_DESK_KINDS, defenceDeskKindsIn } from '../helpers/defenceDeskKinds.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { CRISIS_KIND_WORDS, TIER_WORDS } from '../../src/domain/facts/factVocabulary.js';

const seen = vi.hoisted(() => ({ cur: /** @type {Map<string, {blockId: string, poolKey: string, vid: number}>|null} */ (null) }));

vi.mock('../../src/domain/display/stateProse/stateProseKernel.js', async (importOriginal) => {
  const kernel = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...kernel,
    drawVariant: (/** @type {any[]} */ eligible, /** @type {string} */ blockId, /** @type {string} */ poolKey, /** @type {string} */ seed) => {
      const drawn = kernel.drawVariant(eligible, blockId, poolKey, seed);
      if (seen.cur && drawn && String(blockId).startsWith('DS-DEF-')) seen.cur.set(`${blockId}::${poolKey}::${drawn.vid}`, { blockId, poolKey, vid: drawn.vid });
      return drawn;
    },
  };
});

/** @param {{blockId: string, poolKey: string, vid: number}} d @returns {ReadonlyArray<string>} */
function marksOf(d) {
  const pool = /** @type {any} */ (DOSSIER_STATE_PROSE_DEFENSE)[d.blockId]?.pools?.[d.poolKey] || [];
  return pool.find((/** @type {any} */ v) => v.vid === d.vid)?.marks || [];
}

/** THE CENSUS'S 720, by its rule (CENSUS-3 seeds.txt). */
const CENSUS = [
  ...TIER_WORDS.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISIS_KIND_WORDS.flatMap((crisis) => TIER_WORDS.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${crisis}-${size}-${i}`))),
];

/** THE READ TOWNS of the worklist (REVIEW-BAR-4), each with the member its reader met and the kind it is. */
const READ = [
  { seed: 'bar0-hamlet-calm-rand-23', row: 'C18744', kind: 'D1', d: { blockId: 'DS-DEF-11', poolKey: 'UNWALLED-SMALL', vid: 4 } },
  { seed: 'bar0-village-calm-rand-23', row: 'C45642', kind: 'D1', d: { blockId: 'DS-DEF-11', poolKey: 'UNWALLED-SMALL', vid: 4 } },
  { seed: 'bar0-town-calm-rand-22', row: 'C36862', kind: 'D2', d: { blockId: 'DS-DEF-9', poolKey: 'magicDependency false', vid: 2 } },
  { seed: 'bar0-metropolis-calm-rand-23', row: 'C31074', kind: 'D2', d: { blockId: 'DS-DEF-9', poolKey: 'magicDependency true, with a NAMED dependent chain', vid: 2 } },
  { seed: 'bar0-town-occupied-rand-21', row: 'C40032', kind: 'D3', d: { blockId: 'DS-DEF-5', poolKey: 'watch PRESENT', vid: 3 } },
  { seed: 'bar0-thorp-calm-rand-23', row: 'C34105', kind: 'D3', d: { blockId: 'DS-DEF-2', poolKey: 'Economic Survival: WEAK', vid: 3 } },
  { seed: 'bar0-city-wartime-rand-23', row: 'C16539', kind: 'D3', d: { blockId: 'DS-DEF-11', poolKey: 'WALLED-QUIET', vid: 3 } },
];

/** CENSUS-3 seedcfg.mjs's r2r-, r2s- and bar0- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  m = seed.match(/^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if (m) return { ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  throw new Error(`a guard seed is a census or a read seed: ${seed}`);
}

/** @type {Map<string, {record: any, drawn: Array<{blockId: string, poolKey: string, vid: number}>}>} */
const TOWNS = new Map();

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
  const { composePublicProse, PUBLIC_PROSE_SITES } = await import('../../src/components/new/publicProseCompose.js');
  const { publicVeiledRecordOf } = await import('../../src/domain/display/publicSafe.js');
  const { defenseDeskRead } = await import('../../src/components/new/defenseDeskRead.js');
  const { magicDeskRead } = await import('../../src/components/new/magicDeskRead.js');
  const { criminalStructureOf } = await import('../../src/components/new/deskHostArgs.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of [...CENSUS, ...READ.map((r) => r.seed)]) {
    let town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    seen.cur = new Map();
    town = withPublicProse(town, composePublicProse(town));
    const ctx = { veiledRecord: publicVeiledRecordOf(town) };
    for (const [, draw] of PUBLIC_PROSE_SITES) {
      try { draw(town, false, ctx); } catch { /* a site that throws prints nothing */ }
    }
    // the owner's own reads (playerView false): the lines the owner's page prints
    try { defenseDeskRead(town, { publicDossier: false, playerView: false, tier: town?.tier, crimStructure: criminalStructureOf(town) }); } catch { /* as above */ }
    try { magicDeskRead(town, { publicDossier: false, playerView: false }); } catch { /* as above */ }
    TOWNS.set(seed, { record: town, drawn: [...seen.cur.values()] });
    seen.cur = null;
  }
}, 1800000);

describe('THE ZERO: no defence-desk member prints in a state that makes it false (the census\'s 720 and the read towns)', () => {
  it('every census town and every read town reads zero instances of D1, D2, D3, PAY and C24893', () => {
    const failures = collectSeedFailures([...CENSUS, ...READ.map((r) => r.seed)], (seed) => {
      const town = TOWNS.get(seed);
      expect(town, `${seed} was born`).toBeDefined();
      expect(town?.drawn.length, `${seed} drew its defence desk`).toBeGreaterThan(0);
      expect(defenceDeskKindsIn(town?.record, town?.drawn || [], marksOf).filter((i) => !i.split), `the instances at ${seed}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no defence-desk member prints in a state that makes it false');
  });
  // THE SPLIT this desk does not write (K6; named for the seat holding `incomeLineSiblings.js`, 2026-11-16): the income
  // line's "fished out ... bought in" beside a fishing chain the record holds up by magic. Counted; a CEILING, shrink-only:
  // 20 census towns at 8aef8e7d46 (the K2 line). It may fall when that writer reads the magic-held chain; it may not rise.
  it('THE SPLIT\'s census towns stay at or under their measured ceiling (20)', () => {
    const towns = CENSUS.filter((seed) => defenceDeskKindsIn(TOWNS.get(seed)?.record, TOWNS.get(seed)?.drawn || [], marksOf).some((i) => i.split));
    expect(towns.length, towns.join(' ')).toBeLessThanOrEqual(20);
    expect(towns.length).toBeGreaterThan(0);
  });
});

describe('THE POSITIVE CONTROL: each detector fires on the read town whose state it reads', () => {
  for (const r of READ) {
    it(`${r.kind} fires at ${r.seed} (${r.row}) for ${r.d.blockId} :: ${r.d.poolKey} v${r.d.vid}`, () => {
      const town = TOWNS.get(r.seed);
      const found = defenceDeskKindsIn(town?.record, [r.d], marksOf);
      expect(found.map((i) => i.kind)).toContain(r.kind);
      expect(found[0].state).toMatch(/\S/);
    });
  }
  it('every kind of the table has a read town that fires it', () => {
    // C24893 and PAY have no read town of their own: each has a constructed control below
    expect([...new Set(READ.map((r) => r.kind))].sort()).toEqual([...new Set(DEFENCE_DESK_KINDS.map((k) => k.kind))].filter((k) => k !== 'C24893' && k !== 'PAY').sort());
  });
  it('PAY fires on a constructed record: a well-funded line beside an unpaid rota of households and no paid force', () => {
    const record = { defenseProfile: { institutions: { watch: [{ name: 'Village watch', catalogId: 'village_watch' }], garrison: [], mercenary: [] } } };
    const found = defenceDeskKindsIn(record, [{ blockId: 'DS-DEF-6', poolKey: 'Economic Backing: Well-funded', vid: 4 }], marksOf);
    expect(found.map((i) => i.kind)).toEqual(['PAY']);
  });
  it('C24893 fires on a constructed record: the null structure line beside a fence\'s covert service', () => {
    const record = { availableServices: [{ name: 'Sell stolen goods', institution: 'Local fence' }], economicState: { incomeSources: [] } };
    const found = defenceDeskKindsIn(record, [{ blockId: 'DS-DEF-4', poolKey: 'structure null (nothing organized recognized)', vid: 1 }], marksOf);
    expect(found.map((i) => i.kind)).toEqual(['C24893']);
  });
  it('C24893 fires on a constructed record: the null structure line beside a black-market revenue', () => {
    const record = { economicState: { incomeSources: [{ source: 'Black Market Revenue', percentage: 12 }] } };
    const found = defenceDeskKindsIn(record, [{ blockId: 'DS-DEF-4', poolKey: 'structure null (nothing organized recognized)', vid: 1 }], marksOf);
    expect(found.map((i) => i.kind)).toEqual(['C24893']);
  });
});

describe('THE TWINS DRAW where the cure would have left a state mute', () => {
  it('the magic-supply twin of DS-DEF-9 is drawn at bar0-town-calm-rand-22 (C36862: timber, iron and grain brought in by magic)', () => {
    const drawn = TOWNS.get('bar0-town-calm-rand-22')?.drawn || [];
    expect(drawn.filter((d) => d.blockId === 'DS-DEF-9').map((d) => `${d.poolKey} v${d.vid}`)).toContain('magicDependency false v4');
  });
  it('the well-off twin of DS-DEF-2 Economic Survival WEAK is drawn at bar0-thorp-calm-rand-23 (C34105: a wealthy thorp)', () => {
    const drawn = TOWNS.get('bar0-thorp-calm-rand-23')?.drawn || [];
    expect(drawn.filter((d) => d.poolKey === 'Economic Survival: WEAK').map((d) => d.vid)).toEqual([6]);
  });
});
