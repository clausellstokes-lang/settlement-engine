/**
 * tests/domain/facts/declaredKernel.test.js — CENSUS-1b wave 1 item 2: THE KERNEL CHANNEL READS
 * DECLARED ATOMS (law 5 generalised; `docs/DESIGN_POOL_CENSUS.md` §3.1, §3.3).
 *
 * A state variant's tag-slot atoms ride `marks`; the pool's brace group rides `poolMeta`. The
 * kernel pre-filters both against `facts` (fail-closed without them), and a pool that declares
 * nothing reads exactly as before. The composer notes every drawn line in the open ledger.
 *
 * @enforced-by npx vitest run tests/domain/facts/declaredKernel.test.js
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants, variantFactDeclaration } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { composeStateProse } from '../../../src/domain/display/stateProse/composeStateProse.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';

const MARKET = factsOf({ tier: 'town', institutions: [{ name: 'Weekly market', category: 'Economy' }] });
const BARE = factsOf({ tier: 'town', institutions: [] });
const pool = [
  { vid: 1, angle: 'street', marks: ['market'], text: 'The stalls are loud.' },
  { vid: 2, angle: 'street', marks: ['no market'], text: 'Nobody sells here in quantity.' },
  { vid: 3, angle: 'ledger', text: 'The town keeps its accounts.' },
];

describe('the kernel reads declared atoms', () => {
  it('a declared pool is read against facts; without facts it is unreadable (fail-closed)', () => {
    expect(eligibleVariants(pool, { facts: MARKET }).map((v) => v.vid)).toEqual([1, 3]);
    expect(eligibleVariants(pool, { facts: BARE }).map((v) => v.vid)).toEqual([2, 3]);
    expect(eligibleVariants(pool, {})).toEqual([]);
  });

  it('an undeclared pool reads exactly as before, facts or none', () => {
    const plain = [pool[2], { vid: 4, text: 'Another.' }];
    expect(eligibleVariants(plain, {})).toEqual(plain);
    expect(eligibleVariants(plain, { facts: BARE })).toEqual(plain);
  });

  it("a causal arm spelled like an atom declares nothing (no vid: not the state schema)", () => {
    expect(variantFactDeclaration({ marks: ['market'], text: 'x' }).needs).toEqual([]);
    expect(variantFactDeclaration(pool[0]).needs).toEqual(['market']);
  });

  it("the pool's brace group gates the pool, and {crisis-scoped} reads silence as calm", () => {
    const plain = [pool[2]];
    expect(eligibleVariants(plain, { facts: MARKET, poolDeclares: ['market'] })).toHaveLength(1);
    expect(eligibleVariants(plain, { facts: BARE, poolDeclares: ['market'] })).toEqual([]);
    expect(eligibleVariants(plain, { poolDeclares: ['market'] })).toEqual([]);
    const sieged = factsOf({ tier: 'town', stress: [{ type: 'under_siege' }], institutions: [] });
    const scoped = [{ vid: 1, text: 'Nothing presses.' }, { vid: 2, marks: ['crisis: under_siege'], text: 'The siege presses.' }];
    expect(eligibleVariants(scoped, { facts: sieged, crisisScoped: true }).map((v) => v.vid)).toEqual([2]);
    expect(eligibleVariants(scoped, { facts: BARE, crisisScoped: true }).map((v) => v.vid)).toEqual([1]);
  });

  it('the composer notes the drawn line (and its walls atom) in the open ledger', () => {
    const corpus = { 'DS-T': { pools: { K: [{ vid: 1, marks: ['walls'], text: 'The walls hold.' }] } } };
    const { result, ledger } = withPresumptionLedger(() => composeStateProse(corpus, 'DS-T', { spineKey: 'K', dimensions: { walls: 'walls' }, seed: 's' }));
    expect(result?.text ?? result).toBeTruthy();
    expect(ledger).toEqual([expect.objectContaining({ pool: 'DS-T::K', lineId: 1, atoms: ['walls'], drawKind: 'K' })]);
  });
});
