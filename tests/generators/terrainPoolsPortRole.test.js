/**
 * F5 unit 6 (2026-11-04): THE PORT TEST FOR THE CRAFTS ROLES IS WORD-BOUNDED. `npcGenerator.js`
 * seats a `requiresPort` role (the Harbor Master, the Master Shipwright, the Ship Captain) where
 * the route is water or an institution names a port or harbour; the name test was a SUBSTRING,
 * so the "port" inside "Teleportation circle" seated a Harbor Master in four landlocked cities of
 * the 1,000 (soak1k-46, -706, -814, -874; rung 1B's A-11 residue). Red-first on soak1k-46.
 */
import { describe, expect, it } from 'vitest';

const rolesOf = async (i) => {
  const { birth, ensureLaws } = await import('../../scripts/audit/soak-review/corpus.mjs');
  await ensureLaws();
  const s = birth(i).settlement;
  return { s, roles: (s.npcs || []).map((n) => String(n?.role)) };
};

describe('the crafts roles\' port test', () => {
  it('soak1k-46, a desert city on a road whose only "port" is a Teleportation circle: no Harbor Master', async () => {
    const { s, roles } = await rolesOf(46);
    expect((s.institutions || []).map((x) => x.name)).toContain('Teleportation circle');
    expect(roles.length).toBeGreaterThan(0);
    expect(roles).not.toContain('Harbor Master'); // anchored: the line above proves the roles are live
  });
  it('soak1k-11, a Teleportation circle beside a real port row: the Harbor Master stays', async () => {
    const { s, roles } = await rolesOf(11);
    expect((s.institutions || []).some((x) => /\b(?:port|harbou?r|docks?)\b/i.test(x.name))).toBe(true);
    expect(roles).toContain('Harbor Master');
  });
});
