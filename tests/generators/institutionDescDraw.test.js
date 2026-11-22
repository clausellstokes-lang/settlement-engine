/**
 * tests/generators/institutionDescDraw.test.js — CENSUS-1f unit 1b, Appendix B site 18 (H): the
 * institution description draw keeps its fnv pick and resolves the drawn text through
 * `drawDeclared` against CENSUS-4c's `DESC_VARIANT_DECLARATIONS` and CENSUS-1c's walls siblings.
 *
 * @enforced-by npx vitest run tests/generators/institutionDescDraw.test.js
 */
import { describe, expect, it } from 'vitest';
import { DESC_VARIANT_DECLARATIONS, DESC_VARIANT_SIBLINGS, INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';
import { drawInstitutionDesc } from '../../src/generators/steps/institutionDescDraw.js';
import { pickVariant } from '../../src/kernel/proseHash.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const ADMIT_ALL = { ...CALM_FACTS_ADMIT_ALL, guild: true, tier: 'metropolis', terrain: 'forest' };
/** A village with no market, no guild, no walls, inland plains. */
const BARE = factsOf({ institutions: [], tier: 'village', config: { terrainType: 'plains', tradeRouteAccess: 'road' } });

/** The site's pool (`[catalogDesc, ...variants]`; the catalogue line declares nothing) and a seed that draws a declared text. */
function declaredDraw(key) {
  const pool = ['The catalogue line, which presumes nothing.', ...INSTITUTION_DESC_VARIANTS[key]];
  for (let n = 0; n < 500; n++) {
    const seed = `s${n}:inst`;
    const t = pickVariant(pool, seed);
    if (DESC_VARIANT_DECLARATIONS[t]) return { pool, seed, drawn: t };
  }
  throw new Error(`no seed draws a declared text in ${key}`);
}

describe('the institution description draw resolves through drawDeclared (CENSUS-1f, site 18)', () => {
  it('a declared text the record refuses is not printed (village dairy farmer needs a market)', () => {
    const { pool, seed, drawn } = declaredDraw('village|Economy|Dairy farmer');
    const got = drawInstitutionDesc(pool, seed, BARE, 'village|Economy|Dairy farmer');
    expect(got).not.toBe(drawn);
    expect(DESC_VARIANT_DECLARATIONS[got]).toBeUndefined();
    expect(pool).toContain(got);
  });

  it('a record that admits every line keeps the old pick, for every table key (byte witness)', () => {
    const cases = Object.entries(INSTITUTION_DESC_VARIANTS).flatMap(([key, variants]) => ['a:x', 'b:y', 'c:z'].map((seed) => ({ key, pool: [...variants], seed })));
    const failures = collectSeedFailures(cases, ({ key, pool, seed }) => {
      expect(drawInstitutionDesc(pool, seed, ADMIT_ALL, key), `${key} @ ${seed}`).toBe(pickVariant(pool, seed));
    });
    expectNoSeedFailures(failures, 'every table key keeps its old pick under an admit-all record');
  });

  it('a walls sibling still resolves to its twin where the roster has no walls', () => {
    const [original, set] = Object.entries(DESC_VARIANT_SIBLINGS)[0];
    const twin = set.find((l) => l.twinOf);
    expect(drawInstitutionDesc([original], 'any:seed', BARE, 'sibling')).toBe(twin.text);
  });
});
