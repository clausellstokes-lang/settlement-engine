/**
 * traditionFieldRiteFloor.test.js — G72 (1): THE FIELD RULE'S STAMP IS A FLOOR, NOT AN EQUALITY.
 *
 * `traditions/genesis.js :: fieldRiteRefused` is asked of a record whose stamp is AT OR AFTER the engine that first carried
 * the rule (`FIELD_RITE_SINCE = '0.10.0'`, a literal in the rule's own file), through `settlement.schema.js ::
 * bornAtOrAfter`: three dot-separated whole numbers, compared number by number; anything else answers false.
 *
 * RED FIRST (ef10a71f3a, the equality reader `bornByThisEngine`): "a record stamped 0.11.0 ... is refused a field rite"
 * failed (expected false to be true), and the next release simulated (the constant read as 0.11.0) showed the replaced
 * rite gone back: the 0.10.0-born place drew `field` again.
 */
import { describe, expect, test, vi } from 'vitest';
import { deriveFoundingTraditions, fieldRiteRefused } from '../../src/domain/traditions/genesis.js';
import { bornAtOrAfter } from '../../src/domain/settlement.schema.js';

/** The seed's identity (traditionFieldRite.test.js): a plains road town whose row 1 draws a rite of the fields. */
const IDENTITY = { _seed: 'furrow-4', tier: 'town', population: 3000, config: { culture: 'celtic', terrainType: 'plains', tradeRouteAccess: 'road' } };
/** a place whose food record refuses the rite (livestock and fish, no farmland), stamped `stamp` @param {unknown} stamp */
const stamped = (stamp) => ({
  ...IDENTITY,
  generatorVersion: stamp,
  institutions: [{ name: 'Tavern' }],
  economicState: { foodSecurity: { foodRecord: { foodSources: ['livestock', 'fish'] } } },
});
/** @param {ReturnType<typeof deriveFoundingTraditions>} set */
const elements = (set) => set.map((t) => t.coreMotif.element);

describe('G72 (1): a stamp at or after 0.10.0 is asked the rule', () => {
  test.each(['0.10.0', '0.11.0', '1.0.0'])('a record stamped %s whose food record refuses is refused a field rite', (stamp) => {
    expect(fieldRiteRefused(stamped(stamp))).toBe(true);
    expect(elements(deriveFoundingTraditions(stamped(stamp)))).not.toContain('field');
  });
});

describe('G72 (1): anything else is not asked, and keeps its whole set', () => {
  const before = JSON.stringify(deriveFoundingTraditions(IDENTITY));
  test.each([['0.9.0'], ['legacy'], ['0.10'], ['0.10.0-rc1'], [10], [0.1], [null]])('stamp %s answers false', (stamp) => {
    expect(fieldRiteRefused(stamped(stamp))).toBe(false);
    expect(JSON.stringify(deriveFoundingTraditions(stamped(stamp)))).toBe(before);
  });
  test('no stamp at all answers false', () => {
    const { generatorVersion: _drop, ...stampless } = stamped('0.10.0');
    expect(fieldRiteRefused(stampless)).toBe(false);
  });
});

describe('G72 (1): the reader itself', () => {
  test('compares number by number, never as text', () => {
    expect(bornAtOrAfter({ generatorVersion: '0.10.0' }, '0.9.0')).toBe(true);
    expect(bornAtOrAfter({ generatorVersion: '0.9.0' }, '0.10.0')).toBe(false);
    expect(bornAtOrAfter({ generatorVersion: '0.10.0' }, '0.10.0')).toBe(true);
    expect(bornAtOrAfter({ generatorVersion: '0.10.1' }, '0.10.0')).toBe(true);
    expect(bornAtOrAfter({ generatorVersion: '2.0.0' }, '10.0.0')).toBe(false);
  });
  test('a malformed floor, or no record, answers false', () => {
    expect(bornAtOrAfter({ generatorVersion: '0.10.0' }, '0.10')).toBe(false);
    expect(bornAtOrAfter(null, '0.10.0')).toBe(false);
    expect(bornAtOrAfter('0.10.0', '0.10.0')).toBe(false);
  });
});

describe('G72 (1): the next release, simulated', () => {
  test('with the build constant read as 0.11.0, a 0.10.0-born unlit place still shows its replaced rite', async () => {
    vi.resetModules();
    // The module mocked as tests/store/rederiveGuard.test.js G6 does. A real release moves the constant every reader closes
    // over; a spread does not re-bind a closure, so a reader of the constant (the equality reader this unit removes) is
    // re-bound here to the moved constant: the simulation is of the release, not of one export.
    vi.doMock('../../src/domain/settlement.schema.js', async (importOriginal) => {
      const real = /** @type {Record<string, unknown>} */ (await importOriginal());
      const moved = { ...real, GENERATOR_VERSION: '0.11.0' };
      if ('bornByThisEngine' in real) {
        moved.bornByThisEngine = (/** @type {any} */ r) => !!r && typeof r === 'object' && r.generatorVersion === '0.11.0';
      }
      return moved;
    });
    try {
      const schema = await import('../../src/domain/settlement.schema.js');
      expect(schema.GENERATOR_VERSION, 'the premise: the constant has moved').toBe('0.11.0');
      const next = await import('../../src/domain/traditions/genesis.js');
      const born = stamped('0.10.0');
      expect(next.fieldRiteRefused(born)).toBe(true);
      expect(elements(next.deriveFoundingTraditions(born)), 'the replaced rite does not come back').not.toContain('field');
    } finally {
      vi.doUnmock('../../src/domain/settlement.schema.js');
      vi.resetModules();
    }
  });
});
