/**
 * lastVariety.test.js — LAST-VARIETY (the last small round, `docs/chair/2026-11-18/last/BRIEF-LAST.md` on the chair's lane,
 * section LAST-VARIETY; the hand-back `docs/chair/2026-11-18/last/LAST-VARIETY-HANDBACK.md`).
 *
 *   1  THE DS-DEF-3 SAFETY POOLS FOR SMALL PLACES. FAULTS-DESKS's R7 tables counted, over the 900, the towns whose public-order
 *      pool admits fewer than three lines (Moderate 105, Safe 21, Very Safe 10, Unsafe 3; almost all thorps, hamlets and
 *      villages with no court and no gaol and no watch). Two lines stand at the END of each of the four pools (the vids law:
 *      the next numbers, nothing renumbered), each declared on what it presumes. Held here: the eight stand at their numbers
 *      with their declarations; the towns that admitted one or two lines at the base (the hardest of the R7 tables: each
 *      pool's one-line towns) now admit three or more, on the record, its public projection and the share veil; each new
 *      line prints in a town of the 900 on all three forms; and each declaration refuses its line where its premise is
 *      false (a negative beside each positive). Red at the base: the eight are not in the leaf.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { defenseStateProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { censusPlan, configOf } from '../components/pageCensusWalk.shared.mjs';

const BLOCK = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-3'];

/** The eight, by pool and vid, with the declaration each carries (the leaf's marks, the annex's tags less the angle). */
const NEW_LINES = [
  { pool: 'Very Safe', vid: 6, marks: ['tier: ≤ village', 'no crime wave', 'crisis: any', 'no crisis: threat, unrest'] },
  { pool: 'Very Safe', vid: 7, marks: ['no watch', 'crisis: any', 'no crisis: threat, unrest'] },
  { pool: 'Safe', vid: 6, marks: ['no prison', 'crisis: any', 'no crisis: threat, unrest'] },
  { pool: 'Safe', vid: 7, marks: ['no guardPresence', 'crisis: any', 'no crisis: threat, unrest'] },
  { pool: 'Moderate', vid: 9, marks: ['tier: ≤ village'] },
  { pool: 'Moderate', vid: 10, marks: ['no court or gaol'] },
  { pool: 'Unsafe', vid: 5, marks: ['no guardPresence', 'crime wave'] },
  { pool: 'Unsafe', vid: 6, marks: [] },
];
const BASE_COUNTS = { 'Very Safe': 5, Safe: 5, Moderate: 8, Unsafe: 4 };
const variantOf = (/** @type {string} */ pool, /** @type {number} */ vid) => (BLOCK.pools[pool] || []).find((/** @type {any} */ v) => v.vid === vid);

/** the bar0- arm of the census probe's seed map (as `faultsDesks.test.js`), and the census's own plan for the 720 */
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const PLAN = new Map(censusPlan('r2').map((row) => [row.seed, row]));
/** @param {string} seed */
function cfgFor(seed) {
  const row = PLAN.get(seed);
  if (row) return configOf(row, DEFAULT_CONFIG, birthConfig);
  const m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
}

/** R7's towns that admitted ONE line at the base (each pool's hardest), and one that admitted two, by the pool they draw */
const SHORT = {
  Moderate: ['bar0-hamlet-calm-rand-45', 'bar0-thorp-calm-rand-31', 'r2r-hamlet-17', 'r2r-thorp-0'],
  Safe: ['bar0-thorp-calm-rand-28', 'r2s-infiltrated-village-2', 'r2r-town-4'],
  'Very Safe': ['bar0-village-calm-rand-36', 'r2r-hamlet-11'],
  Unsafe: ['bar0-hamlet-calm-rand-27', 'bar0-hamlet-calm-rand-29', 'r2r-thorp-30'],
};
/** a town of the 900 where each new line is the one the slot prints (measured at the tip over the 900) */
const PRINTS = [
  { pool: 'Very Safe', vid: 6, seed: 'bar0-village-calm-rand-36' },
  { pool: 'Very Safe', vid: 7, seed: 'r2r-village-8' },
  { pool: 'Safe', vid: 6, seed: 'r2r-town-4' },
  { pool: 'Safe', vid: 7, seed: 'bar0-thorp-calm-rand-28' },
  { pool: 'Moderate', vid: 9, seed: 'bar0-village-calm-rand-46' },
  { pool: 'Moderate', vid: 10, seed: 'bar0-thorp-calm-rand-45' },
  { pool: 'Unsafe', vid: 5, seed: 'bar0-hamlet-calm-rand-29' },
  { pool: 'Unsafe', vid: 6, seed: 'bar0-hamlet-calm-rand-27' },
];

/** @type {Map<string, any>} */ const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...Object.values(SHORT).flat(), ...PRINTS.map((p) => p.seed)])) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
}, 300_000);

const forms = (/** @type {any} */ s) => /** @type {Array<[string, any]>} */ ([['record', s], ['public', toPublicSafe(structuredClone(s))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(s)), null)]]);
/** the lines of `pool` the kernel admits over `facts` (the pool's own crisisScoped flag) */
const admitted = (/** @type {string} */ pool, /** @type {any} */ facts) => BLOCK.pools[pool]
  .filter((/** @type {any} */ v) => declarationAdmits(variantFactDeclaration(v), facts, { crisisScoped: BLOCK.poolMeta?.[pool]?.crisisScoped === true }).admitted);

describe('LAST-VARIETY item 1: two lines at the end of each DS-DEF-3 safety pool', () => {
  it('each pool keeps its old lines at their numbers and takes the two new ones at the NEXT numbers, declared', () => {
    const failures = collectSeedFailures(Object.keys(BASE_COUNTS), (pool) => {
      const vids = BLOCK.pools[pool].map((/** @type {any} */ v) => v.vid);
      expect(vids, pool).toEqual(Array.from({ length: BASE_COUNTS[/** @type {keyof typeof BASE_COUNTS} */ (pool)] + 2 }, (_, i) => i + 1));
    });
    expectNoSeedFailures(failures, 'the vids law: appended, nothing renumbered');
    for (const { pool, vid, marks } of NEW_LINES) expect(variantOf(pool, vid)?.marks ?? [], `${pool} v${vid}`).toEqual(marks);
  });

  it('the towns that admitted one or two lines at the base admit three or more, on all three forms', () => {
    const failures = collectSeedFailures(Object.entries(SHORT).flatMap(([pool, seeds]) => seeds.map((seed) => ({ pool, seed }))), ({ pool, seed }) => {
      const s = towns.get(seed);
      expect(s.economicState?.safetyProfile?.safetyLabel, seed).toBe(pool);
      for (const [form, r] of forms(s)) expect(admitted(pool, factsOf(r)).length, `${seed} · ${form}`).toBeGreaterThanOrEqual(3);
    });
    expectNoSeedFailures(failures, 'every short town of R7 now admits three');
  });

  it('each new line prints in a town of the 900, on the record, its public projection and the share veil', () => {
    const failures = collectSeedFailures(PRINTS, ({ pool, vid, seed }) => {
      const s = towns.get(seed);
      const want = String(variantOf(pool, vid)?.text).replace('{settlement}', s.name);
      for (const [form, r] of forms(s)) expect(defenseStateProse(r, { seed })?.publicOrder?.beside, `${pool} v${vid} · ${seed} · ${form}`).toBe(want);
    });
    expectNoSeedFailures(failures, 'each new line is drawn somewhere true');
  });

  it('each declaration refuses its line where its premise is false and admits it where true (a negative beside each positive)', () => {
    /** @param {any} base @param {Record<string, unknown>} o */
    const over = (base, o) => { const f = Object.create(base); for (const [k, v] of Object.entries(o)) Object.defineProperty(f, k, { value: v }); return f; };
    /** each premise, and the double that breaks it over the facts of a town where the line prints */
    /** @type {Record<string, (f: any) => Record<string, unknown>>} */
    const BREAK = {
      'tier: ≤ village': () => ({ tier: 'town' }),
      'no crime wave': () => ({ crimeWave: true }),
      'crime wave': () => ({ crimeWave: false }),
      'no watch': (f) => ({ defence: { ...f.defence, watch: true } }),
      'no prison': (f) => ({ defence: { ...f.defence, prison: true } }),
      'no guardPresence': () => ({ guardPresence: true }),
      'no court or gaol': () => ({ courtOrGaol: true }),
    };
    const failures = collectSeedFailures(NEW_LINES.flatMap(({ pool, vid, marks }) => marks.filter((m) => !/crisis/.test(m)).map((mark) => ({ pool, vid, mark }))), ({ pool, vid, mark }) => {
      const where = /** @type {{ seed: string }} */ (PRINTS.find((p) => p.pool === pool && p.vid === vid));
      const facts = factsOf(towns.get(where.seed));
      const decl = variantFactDeclaration(variantOf(pool, vid));
      const opts = { crisisScoped: BLOCK.poolMeta?.[pool]?.crisisScoped === true };
      expect(declarationAdmits(decl, facts, opts).refused, `${pool} v${vid} over ${where.seed}`).toEqual([]);
      const broken = declarationAdmits(decl, over(facts, BREAK[mark](facts)), opts);
      expect(broken.admitted, `${pool} v${vid} where "${mark}" fails`).toBe(false);
      expect(broken.refused.length, `${pool} v${vid}: only "${mark}" is refused`).toBe(1);
    });
    expectNoSeedFailures(failures, 'each premise refuses its line exactly where it fails');
    // the unmarked line (Unsafe v6) declares nothing, so every Unsafe town admits it
    expect(variantFactDeclaration(variantOf('Unsafe', 6)).needs).toEqual([]);
    expect(variantFactDeclaration(variantOf('Unsafe', 6)).excludes).toEqual([]);
  });
});
