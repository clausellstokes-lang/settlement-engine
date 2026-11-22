/**
 * tests/components/primitivesTi.test.js — the Ti value-coercer contract
 * (C3-experience finding 13, bar-18 fiction continuity).
 *
 * Ti is the shared dossier value formatter. It used to fall back to
 * JSON.stringify(v) for any object lacking product/name/chain/hook/
 * description/title — so an unexpected shape printed raw {"…"} on a
 * happy-path settlement read. Pinned here: known keys still win (and now
 * recurse, so a nested shape can never reach React as an object child),
 * unknown objects degrade to their first string field then a quiet dash,
 * arrays read as a joined list, and RAW JSON NEVER RENDERS.
 */
import { describe, it, expect } from 'vitest';
import { Ti } from '../../src/components/new/Primitives.jsx';

describe('Ti — dossier value coercion stays in-fiction', () => {
  it('passes strings and stringifies primitives', () => {
    expect(Ti('Ashford')).toBe('Ashford');
    expect(Ti(3)).toBe('3');
    expect(Ti(null)).toBe('');
    expect(Ti(undefined)).toBe('');
  });

  it('known keys win, in precedence order', () => {
    expect(Ti({ product: 'Iron ingots', name: 'ignored' })).toBe('Iron ingots');
    expect(Ti({ name: 'Guild of Coopers' })).toBe('Guild of Coopers');
    expect(Ti({ title: 'The Long Drought' })).toBe('The Long Drought');
  });

  it('a nested known key recurses instead of leaking an object child', () => {
    expect(Ti({ name: { title: 'Nested Seat' } })).toBe('Nested Seat');
  });

  it('an unknown object shape NEVER renders raw JSON — first string field, else a quiet dash', () => {
    expect(Ti({ weird: 'A strange ledger', n: 4 })).toBe('A strange ledger');
    expect(Ti({ n: 4, deep: { x: 1 } })).toBe('–');
    expect(Ti({})).toBe('–');
    for (const v of [{ weird: 'x' }, { n: 4 }, {}]) {
      expect(Ti(v)).not.toMatch(/[{}"]/);
    }
  });

  it('arrays read as a joined list, not JSON', () => {
    expect(Ti(['Wool', 'Salt'])).toBe('Wool, Salt');
    expect(Ti([{ name: 'Wool' }, 'Salt'])).toBe('Wool, Salt');
  });
});
