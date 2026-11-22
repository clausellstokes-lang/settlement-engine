/**
 * @vitest-environment jsdom
 *
 * B15 #4 — saves.update / saves.delete (local backend) must match ids by VALUE,
 * not by strict type. A numeric local id round-tripped as a string (route param,
 * JSON re-parse, a caller that String()s the id) previously silently no-op'd
 * localUpdate/localDelete (=== vs String()===), producing "my edit didn't save".
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';

describe('saves local id equality (#4)', () => {
  let saves;

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('update matches a numeric id passed as a string', async () => {
    const id = await saves.save({
      id: 1234, name: 'Numeric', tier: 'town',
      settlement: { name: 'Numeric', tier: 'town', npcs: [], factions: [], neighbourNetwork: [] },
    });
    expect(id).toBe(1234);

    // Caller passes the id as a string (e.g. from a route param).
    await saves.update(String(id), { name: 'Renamed' });

    const list = await saves.list();
    const row = list.find(s => String(s.id) === '1234');
    expect(row).toBeTruthy();
    expect(row.name).toBe('Renamed'); // would still be 'Numeric' with === matching
  });

  test('delete matches a numeric id passed as a string', async () => {
    const id = await saves.save({
      id: 5678, name: 'ToDelete', tier: 'village',
      settlement: { name: 'ToDelete', tier: 'village', npcs: [], factions: [], neighbourNetwork: [] },
    });

    await saves.delete(String(id));

    const list = await saves.list();
    expect(list.find(s => String(s.id) === '5678')).toBeUndefined();
  });

  test('update still matches when id types align (no regression)', async () => {
    const id = await saves.save({
      id: 'str-id-1', name: 'StringId', tier: 'city',
      settlement: { name: 'StringId', tier: 'city', npcs: [], factions: [], neighbourNetwork: [] },
    });
    await saves.update(id, { name: 'StringId2' });
    const list = await saves.list();
    expect(list.find(s => s.id === 'str-id-1').name).toBe('StringId2');
  });

  test('explicit-id upsert is idempotent for a deterministic lineage birth', async () => {
    const entry = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Weirbrook',
      tier: 'village',
      settlement: {
        name: 'Weirbrook', tier: 'village', population: 430,
        parentRef: { birthId: 'lineage.birth.weirbrook', parentId: 'ashford' },
        npcs: [], factions: [], neighbourNetwork: [],
      },
      campaignState: { phase: 'canon', eventLog: [] },
    };

    expect(await saves.upsert(entry)).toBe(entry.id);
    expect(await saves.upsert({
      ...entry,
      settlement: { ...entry.settlement, population: 440 },
    })).toBe(entry.id);

    const rows = (await saves.list()).filter(row => row.id === entry.id);
    expect(rows).toHaveLength(1);
    expect(rows[0].settlement.population).toBe(440);
    expect(rows[0].settlement.parentRef.birthId).toBe('lineage.birth.weirbrook');
  });
});
