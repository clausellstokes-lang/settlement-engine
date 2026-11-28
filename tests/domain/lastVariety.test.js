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
 *   2  THE SUPPLY GOAL FAMILY. Where a card's house depends on a good the page's need list says is needed and not brought in,
 *      every dependency line is refused (FAULTS-NEED's 11e.wantBuy), and a card whose SUPPLY family held nothing else had NO
 *      admitted SUPPLY line (93 cards in 85 towns of the 900 at the base). A sub-kind `want` (a house that LACKS the good: two
 *      lines a vantage, none presuming a supply, none refused under a siege) is dealt ONLY there. Held here: the cell and its
 *      slots; five such cards (two under a siege) now hold two admitted SUPPLY lines in each vantage; a want line is dealt on a
 *      card of the 900; and a card whose dependency is met is dealt no want line (the negative). Red at the base: no cell.
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
import { GOAL_FAMILY_LINES, GOAL_SUBKIND_SLOTS } from '../../src/data/people/goalFamilies.js';
import { familyCandidates, goalContextOf, resourceFill } from '../../src/generators/people/goals.js';
import { needListOf } from '../../src/domain/facts/needNotBroughtIn.js';

const BLOCK = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-3'];

/** The eight, by pool and vid, with the declaration each carries (the leaf's marks, the annex's tags less the angle). */
const NEW_LINES = [
  { pool: 'Very Safe', vid: 6, marks: ['tier: ≤ village', 'no crime wave', 'crisis: any', 'no crisis: threat, unrest'] },
  { pool: 'Very Safe', vid: 7, marks: ['no watch', 'crisis: any', 'no crisis: threat, unrest'] },
  { pool: 'Safe', vid: 6, marks: ['no prison', 'crisis: any', 'no crisis: threat, unrest'] },
  { pool: 'Safe', vid: 7, marks: ['no guardPresence', 'no crime wave', 'crisis: any', 'no crisis: threat, unrest'] }, // LR6 (3): `no crime wave`
  { pool: 'Safe', vid: 8, marks: ['tier: ≤ village', 'crime wave', 'crisis: any', 'no crisis: threat, unrest'] }, // LR6 (3)
  { pool: 'Moderate', vid: 9, marks: ['tier: ≤ village'] },
  { pool: 'Moderate', vid: 10, marks: ['no court or gaol'] },
  { pool: 'Unsafe', vid: 5, marks: ['no guardPresence', 'crime wave'] },
  { pool: 'Unsafe', vid: 6, marks: ['tier: ≤ village'] }, // LR6 (2): its words corrected in place
  { pool: 'Unsafe', vid: 7, marks: ['militia', 'no watch'] }, // LR6 (4): the third kind of Unsafe town
];
const BASE_COUNTS = { 'Very Safe': 5, Safe: 5, Moderate: 8, Unsafe: 4 };
/** the lines this seat appended to each pool (LR6 added Safe v8 and Unsafe v7) */
const ADDED = { 'Very Safe': 2, Safe: 3, Moderate: 2, Unsafe: 3 };
const variantOf = (/** @type {string} */ pool, /** @type {number} */ vid) => (BLOCK.pools[pool] || []).find((/** @type {any} */ v) => v.vid === vid);

/** the bar0- arm of the census probe's seed map (as `faultsDesks.test.js`), and the census's own plan for the 720 */
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const PLAN = new Map(censusPlan('r2').map((row) => [row.seed, row]));
/** @param {string} seed */
function cfgFor(seed) {
  const row = PLAN.get(seed);
  if (row) return configOf(row, DEFAULT_CONFIG, birthConfig);
  // the second reader's 600 fresh (READ-LAST): the census's calm plan at indices 5000 to 5099
  const fresh = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (fresh) return configOf({ size: fresh[1], crisis: null }, DEFAULT_CONFIG, birthConfig);
  const m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
}

/** R7's towns that admitted ONE line at the base (each pool's hardest), and one that admitted two, by the pool they draw */
const SHORT = {
  Moderate: ['bar0-hamlet-calm-rand-45', 'bar0-thorp-calm-rand-31', 'r2r-hamlet-17', 'r2r-thorp-0'],
  Safe: ['bar0-thorp-calm-rand-28', 'r2s-infiltrated-village-2', 'r2r-town-4'],
  'Very Safe': ['bar0-village-calm-rand-36', 'r2r-hamlet-11'],
  Unsafe: ['bar0-hamlet-calm-rand-27', 'bar0-hamlet-calm-rand-29', 'r2r-thorp-30', 'r2r-thorp-5005'], // LR6 (4): a household levy, no watch
};
/** a town of the 900 where each new line is the one the slot prints (measured at the tip over the 900) */
const PRINTS = [
  { pool: 'Very Safe', vid: 6, seed: 'bar0-village-calm-rand-36' },
  { pool: 'Very Safe', vid: 7, seed: 'r2r-village-8' },
  { pool: 'Safe', vid: 6, seed: 'r2r-town-4' },
  { pool: 'Safe', vid: 7, seed: 'r2r-thorp-28' },
  // RE-ANCHORED AT POINT 116 (the trouble law lit, 2026-11-25; LAND-116, the chair's ruling B): bar0-thorp-calm-rand-28 lit holds no crime
  // wave (Safe v8 presumes one); no bar0 calm thorp, hamlet or village 0..149 and no small town of the census prints v8
  // lit; of the second reader's fresh 5000..5099 (this file's own cfgFor) r2r-village-5004 prints it on all three forms.
  { pool: 'Safe', vid: 8, seed: 'r2r-village-5004' },
  { pool: 'Moderate', vid: 9, seed: 'bar0-village-calm-rand-46' },
  { pool: 'Moderate', vid: 10, seed: 'bar0-thorp-calm-rand-45' },
  { pool: 'Unsafe', vid: 5, seed: 'bar0-hamlet-calm-rand-29' },
  { pool: 'Unsafe', vid: 6, seed: 'bar0-hamlet-calm-rand-27' },
  { pool: 'Unsafe', vid: 7, seed: 'r2r-thorp-5005' },
];

/** item 2: cards whose SUPPLY family held only refused dependency lines at the base (measured over the 900), two under a siege */
const WANT_CARDS = [
  { seed: 'bar0-city-wartime-rand-45', id: 'npc_citadel' },
  { seed: 'bar0-hamlet-under_siege-rand-27', id: 'npc_resident_smith_part_time' },
  { seed: 'bar0-city-wartime-rand-31', id: 'npc_banking_houses' },
  { seed: 'r2r-hamlet-17', id: 'npc_citizen_militia' },
  { seed: 'r2s-under_siege-city-3', id: 'npc_banking_houses' },
];
/** item 2: a card of the 900 the deal gives a want line (measured at the tip), and the vantage */
const WANT_DEALT = [
  { seed: 'bar0-city-wartime-rand-45', id: 'npc_citadel', vantage: 'short' },
  { seed: 'r2r-village-8', id: 'npc_citizen_militia', vantage: 'long' },
];

/** @type {Map<string, any>} */ const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...Object.values(SHORT).flat(), ...PRINTS.map((p) => p.seed), ...WANT_CARDS.map((c) => c.seed), ...WANT_DEALT.map((c) => c.seed)])) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
}, 300_000);

const forms = (/** @type {any} */ s) => /** @type {Array<[string, any]>} */ ([['record', s], ['public', toPublicSafe(structuredClone(s))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(s)), null)]]);
/** the lines of `pool` the kernel admits over `facts` (the pool's own crisisScoped flag) */
const admitted = (/** @type {string} */ pool, /** @type {any} */ facts) => BLOCK.pools[pool]
  .filter((/** @type {any} */ v) => declarationAdmits(variantFactDeclaration(v), facts, { crisisScoped: BLOCK.poolMeta?.[pool]?.crisisScoped === true }).admitted);

describe('LAST-VARIETY item 1: two lines at the end of each DS-DEF-3 safety pool', () => {
  it('each pool keeps its old lines at their numbers and takes the two new ones at the NEXT numbers, declared', () => {
    const failures = collectSeedFailures(Object.keys(BASE_COUNTS), (pool) => {
      const vids = BLOCK.pools[pool].map((/** @type {any} */ v) => v.vid);
      expect(vids, pool).toEqual(Array.from({ length: BASE_COUNTS[/** @type {keyof typeof BASE_COUNTS} */ (pool)] + ADDED[/** @type {keyof typeof ADDED} */ (pool)] }, (_, i) => i + 1));
    });
    expectNoSeedFailures(failures, 'the vids law: appended, nothing renumbered');
    for (const { pool, vid, marks } of NEW_LINES) expect(variantOf(pool, vid)?.marks, `${pool} v${vid}`).toEqual(marks);
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
      militia: (f) => ({ defence: { ...f.defence, militia: false } }),
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
  });
});

describe('LAST-VARIETY item 2: the SUPPLY family keeps two admitted lines where a dependency\'s good is not brought in', () => {
  /** @param {string} seed @param {string} id @param {'short'|'long'} vantage */
  const supplyOf = (seed, id, vantage) => {
    const s = towns.get(seed);
    const cards = s.npcs || [];
    const card = cards.find((/** @type {any} */ c) => c.id === id);
    expect(card, `${seed} · ${id}`).toBeTruthy();
    return familyCandidates(card, cards, goalContextOf({ ...s }, cards, s.relationships || []), vantage, new Set()).SUPPLY || [];
  };

  it('the cell `want` stands with two lines a vantage, on the resource and the house only', () => {
    const want = /** @type {any} */ (GOAL_FAMILY_LINES.SUPPLY).want;
    expect(want.short).toHaveLength(2);
    expect(want.long).toHaveLength(2);
    expect(/** @type {any} */ (GOAL_SUBKIND_SLOTS.SUPPLY).want).toEqual(['resource', 'house']);
  });

  it('each card that held only refused dependency lines now holds two admitted SUPPLY lines in each vantage', () => {
    const failures = collectSeedFailures(WANT_CARDS.flatMap((c) => /** @type {const} */ (['short', 'long']).map((vantage) => ({ ...c, vantage }))), ({ seed, id, vantage }) => {
      const sup = supplyOf(seed, id, vantage);
      expect(sup.some((c) => c.kind === 'dependency' && c.refused === true), `${seed} · ${id} · ${vantage}: the dependency refused`).toBe(true);
      expect(sup.filter((c) => !c.refused).length, `${seed} · ${id} · ${vantage}`).toBeGreaterThanOrEqual(2);
      expect(sup.filter((c) => !c.refused).every((c) => c.kind === 'want'), `${seed} · ${id} · ${vantage}: what is admitted is want`).toBe(true);
    });
    expectNoSeedFailures(failures, 'two admitted SUPPLY lines on every such card');
  });

  it('LR6 (5): every want line names only goods the page\'s need list prints, never the dependency\'s whole compound', () => {
    const failures = collectSeedFailures(WANT_CARDS, ({ seed, id }) => {
      const s = towns.get(seed);
      const needs = needListOf(s).map((n) => resourceFill(n));
      for (const vantage of /** @type {const} */ (['short', 'long'])) {
        for (const c of supplyOf(seed, id, vantage).filter((x) => x.kind === 'want')) {
          const goods = String(c.slots.resource).split(' and ');
          expect(goods.every((g) => needs.some((n) => n === g || n.split(' and ').includes(g))), `${seed} · ${id} · "${c.slots.resource}" against [${needs.join('; ')}]`).toBe(true);
        }
      }
    });
    expectNoSeedFailures(failures, 'the want slot holds the need list\'s goods');
    // the citadel's dependency is the compound "stone and iron and grain"; its want line names only the stone the list prints
    const citadel = supplyOf('bar0-city-wartime-rand-45', 'npc_citadel', 'short').filter((x) => x.kind === 'want');
    expect(citadel.map((c) => c.slots.resource)).toEqual(['stone', 'stone']);
  });

  it('a want line is dealt on a card of the 900, filled with its house and its good', () => {
    const failures = collectSeedFailures(WANT_DEALT, ({ seed, id, vantage }) => {
      const card = (towns.get(seed).npcs || []).find((/** @type {any} */ c) => c.id === id);
      expect(card?.goal?.intent?.[vantage]?.family, `${seed} · ${id}`).toBe('SUPPLY');
      const texts = supplyOf(seed, id, vantage).filter((c) => c.kind === 'want').map((c) => c.text);
      expect(texts, `${seed} · ${id} · ${vantage}`).toContain(card.goal[vantage]);
    });
    expectNoSeedFailures(failures, 'the want lines are dealt');
  });

  it('NEGATIVE: a card whose dependency is met is dealt no want line (the cell reads the need list, nothing else)', () => {
    let seen = 0;
    const failures = collectSeedFailures([...towns.keys()], (seed) => {
      const s = towns.get(seed);
      for (const card of s.npcs || []) {
        const sup = supplyOf(seed, card.id, 'short');
        if (!sup.some((c) => c.kind === 'dependency' && c.refused !== true)) continue;
        seen += 1;
        expect(sup.filter((c) => c.kind === 'want'), `${seed} · ${card.id}`).toEqual([]);
      }
    });
    expectNoSeedFailures(failures, 'no want line beside a met dependency');
    expect(seen, 'cards with a met dependency were read').toBeGreaterThan(0);
  });
});
