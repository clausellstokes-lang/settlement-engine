/**
 * @vitest-environment jsdom
 *
 * localLoad() must guard against valid-but-non-array localStorage values.
 * The old `JSON.parse(... || '[]')` only caught malformed JSON — a stored
 * `{}` / number / `null` parses fine but isn't an array, so the downstream
 * .map/.filter/.findIndex/.unshift on the local-only path crashed.
 * Mirrors the `Array.isArray(raw) ? raw : []` guard in campaigns.js.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';

const LOCAL_KEY = 'dnd_settlement_saves';

describe('saves localLoad non-array guard', () => {
  let saves;

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('list() returns [] when stored value is a valid-but-non-array object', async () => {
    localStorage.setItem(LOCAL_KEY, '{}'); // valid JSON, not an array
    // Before the fix this threw `localLoad(...).map is not a function`.
    const list = await saves.list();
    expect(Array.isArray(list)).toBe(true);
    expect(list).toEqual([]);
  });

  test('count() returns 0 when stored value is a number', async () => {
    localStorage.setItem(LOCAL_KEY, '42');
    const count = await saves.count();
    expect(count).toBe(0);
  });

  test('save() still works when stored value was a non-array', async () => {
    localStorage.setItem(LOCAL_KEY, 'null'); // valid JSON null
    const id = await saves.save({
      id: 'g1', name: 'Guarded', tier: 'town',
      settlement: { name: 'Guarded', tier: 'town', npcs: [], factions: [], neighbourNetwork: [] },
    });
    const list = await saves.list();
    expect(list.find(s => s.id === id).name).toBe('Guarded');
  });
});
