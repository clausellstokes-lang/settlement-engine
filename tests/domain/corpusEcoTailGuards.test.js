// THE CORPUS-ECO TAIL'S GUARDS (TAIL-CORPUS-ECO, the READ-ALL worklist of 2026-11-14: the economy and general pools,
// DS-ECO-*, DS-GEN-*, DS-SUP-*, cured in docs/content/RECEIPT_POOLS_DOSSIER_STATE.md and the leaves generated from it).
//
// ONE COLLECTED TEST A BATCH, on births: each row is a FIXED census town, born in the census's own configuration
// shape (CENSUS-3 seedcfg.mjs: `r2r-<size>-<i>` random dials, `r2s-<crisis>-<size>-<i>` the one crisis ticked), and
// every dossier prose site drawn as the owner's page draws it (the public sites and the owner's own economy and
// general reads, so a `dm-only` line is read too). The kernel's draw records, per pool, what was eligible and what
// was drawn.
//   GONE rows: a sentence that was false in that town must NOT be drawn there; the row NAMES what is drawn instead
//     (`prints`: a vid of the same pool, or `null` = the pool is silent there by design). Each was red at the base.
//   KEEP rows: a true sibling that must still be drawn in its town (green before and after), so a cure that silences
//     the pool's true lines reds here too.
// A town that no longer reads the pool reds by name, and the row is re-keyed to a town of the case (by identity, with
// the cause), never dropped.
import { beforeAll, describe, expect, it, vi } from 'vitest';

const seen = vi.hoisted(() => ({ cur: /** @type {Record<string, {e: Set<number>, d: Map<number, string>}>|null} */ (null) }));

vi.mock('../../src/domain/display/stateProse/stateProseKernel.js', async (importOriginal) => {
  const kernel = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...kernel,
    drawVariant: (/** @type {any[]} */ eligible, /** @type {string} */ blockId, /** @type {string} */ poolKey, /** @type {string} */ seed) => {
      const drawn = kernel.drawVariant(eligible, blockId, poolKey, seed);
      if (seen.cur) {
        const row = (seen.cur[`${blockId}::${poolKey}`] ||= { e: new Set(), d: new Map() });
        for (const variant of eligible || []) row.e.add(variant.vid);
        if (drawn) row.d.set(drawn.vid, drawn.text);
      }
      return drawn;
    },
  };
});

/**
 * @typedef {{seed: string, pool: string, gone: RegExp, prints: number|null, why: string}} GoneRow
 * @typedef {{seed: string, pool: string, keep: number, text: RegExp, why: string}} KeepRow
 */
/** @type {ReadonlyArray<GoneRow>} */
const GONE = [
  // ── BATCH 1 · DS-ECO-12 (the income mix and the critical imports): REWORDED, the draw unmoved (each row prints the same vid) ──
  { seed: 'r2r-hamlet-34', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', gone: /from a single trade/, prints: 1, why: 'no exports and no imports: "comes from a single trade" of a town whose one source is its farm rents (B13238; v1 now "a single source")' },
  { seed: 'r2r-thorp-17', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', gone: /depends on one trade/, prints: 2, why: 'an isolated thorp under a famine, no trade either way: "depends on one trade" (B03337; v2 now "one source of income")' },
  { seed: 'r2r-hamlet-1', pool: 'DS-ECO-12::INCOME MIX: a criminal line is present', gone: /honest traders compete/, prints: 2, why: 'no market: "honest traders compete against it" where no market stands (18271; v2 now claims no traders)' },
  { seed: 'r2r-city-19', pool: 'DS-ECO-12::INCOME MIX: a broad spread, no leader', gone: /brings in a real portion/, prints: 1, why: 'a leader at 19%: "none of them brings in a real portion" where one does by the corpus\'s own scale (DS-ECO-6, a real portion >= 15) (01193)' },
  { seed: 'r2s-famine-thorp-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /produces no \{good\}/, prints: 1, why: 'luxury goods listed as made here: "the country produces no luxury goods" (20338; v1 now "does not give the town enough")' },
  { seed: 'r2s-slave_revolt-city-2', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /None of the \{good\} used/, prints: 2, why: 'gems mined and luxury made here: "None of the luxury goods ... comes from the country here" (14987)' },
  { seed: 'r2s-monster_pressure-thorp-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /produces no \{good\}/, prints: 3, why: 'sacred wood exported: "produces no timber" (20355)' },
  { seed: 'r2r-metropolis-13', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', gone: /produces none/, prints: 1, why: 'grain grown here: "the country around the metropolis produces none" (18237)' },
  { seed: 'r2r-hamlet-12', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', gone: /^Whatever \{good\}/, prints: 2, why: 'a dairy farmer and grazing land: "Whatever livestock ... must come from elsewhere" (28786; v2 now "A good part of")' },
];
/** @type {ReadonlyArray<KeepRow>} */
const KEEP = [
  // ── BATCH 1 · DS-ECO-12: the reworded line still draws in its pool's other towns (its unchanged stem, green before and after) ──
  { seed: 'r2s-wartime-village-1', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', keep: 1, text: /^More than half of what \{settlement\} earns comes from a single/, why: 'a village at war, its farm rents over half its income' },
  { seed: 'r2s-mass_migration-town-2', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', keep: 2, text: /^Almost everyone's living at \{settlement\} depends on one/, why: 'the largest town v2 reaches' },
  { seed: 'r2s-wartime-metropolis-3', pool: 'DS-ECO-12::INCOME MIX: a criminal line is present', keep: 2, text: /^Some of the money in \{settlement\} is made outside the law/, why: 'a metropolis with a criminal line under its market' },
  { seed: 'r2s-famine-town-1', pool: 'DS-ECO-12::INCOME MIX: a broad spread, no leader', keep: 1, text: /^\{settlement\} lives on many/, why: 'a famine town, no source near half' },
  { seed: 'r2s-wartime-city-1', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 1, text: /^The country around \{settlement\}/, why: 'a city at war' },
  { seed: 'r2r-thorp-12', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 2, text: /of the \{good\} used at \{settlement\} comes from the country here/, why: 'the smallest it reaches' },
  { seed: 'r2s-wartime-hamlet-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 3, text: /so the town must look elsewhere/, why: 'a hamlet at war, no imports' },
  { seed: 'r2s-occupied-town-0', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', keep: 1, text: /^Some of \{settlement\}'s work cannot go on without \{good\}/, why: 'an occupied town' },
  { seed: 'r2s-wartime-metropolis-1', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', keep: 2, text: /must come from elsewhere; when none comes, that work stands idle/, why: 'a metropolis at war' },
];

/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a guard seed is a census seed: ${seed}`);
}

/** @type {Map<string, Record<string, {e: Set<number>, d: Map<number, string>}>>} */
const READ = new Map();

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
  const { composePublicProse, PUBLIC_PROSE_SITES } = await import('../../src/components/new/publicProseCompose.js');
  const { publicVeiledRecordOf } = await import('../../src/domain/display/publicSafe.js');
  const { economyDeskRead } = await import('../../src/components/new/economyDeskRead.js');
  const { generalDeskLines } = await import('../../src/components/new/generalDeskRead.js');
  const { economicsDeskArgs } = await import('../../src/components/new/deskHostArgs.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of new Set([...GONE, ...KEEP].map((g) => g.seed))) {
    let town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    seen.cur = {};
    const ctx = { veiledRecord: publicVeiledRecordOf(town) };
    for (const [, draw] of PUBLIC_PROSE_SITES) {
      try { draw(town, false, ctx); } catch { /* a site that throws prints nothing; the row's own control says so */ }
    }
    // the owner's own reads (playerView false): the `dm-only` lines the owner's page prints
    try { economyDeskRead(town, { publicDossier: false, playerView: false, tier: town?.tier, ...economicsDeskArgs(town) }); } catch { /* as above */ }
    try { generalDeskLines(town, { publicDossier: false, playerView: false, tier: town?.tier }); } catch { /* as above */ }
    READ.set(seed, seen.cur);
    seen.cur = null;
  }
}, 600000);

describe('a cured sentence is not drawn in the census town that made it false; what is drawn instead is named', () => {
  for (const g of GONE) {
    it(`${g.pool} at ${g.seed}: ${g.why}`, () => {
      const pools = READ.get(g.seed) || {};
      expect(Object.keys(pools), `${g.seed} no longer reads ${g.pool}: re-key the row to a town of the case`).toContain(g.pool);
      const drawn = [...pools[g.pool].d.entries()];
      for (const [vid, text] of drawn) expect(text, `${g.pool} v${vid} at ${g.seed}`).not.toMatch(g.gone);
      expect(drawn.map(([vid]) => vid), `what ${g.pool} draws at ${g.seed}`).toEqual(g.prints === null ? [] : [g.prints]);
    });
  }
});

describe('a true sibling of each cured sentence still draws in its town', () => {
  for (const k of KEEP) {
    it(`${k.pool} v${k.keep} at ${k.seed}: ${k.why}`, () => {
      const pools = READ.get(k.seed) || {};
      expect(Object.keys(pools), `${k.seed} no longer reads ${k.pool}: re-key the row`).toContain(k.pool);
      const text = pools[k.pool].d.get(k.keep);
      expect(text, `${k.pool} v${k.keep} is drawn at ${k.seed}`).toBeTypeOf('string');
      expect(text).toMatch(k.text);
    });
  }
});
