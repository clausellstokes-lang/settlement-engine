/**
 * npcStasisSnapshot.test.js — DESIGN_NPC_LIFECYCLE §2/§5 pin: STASIS participation
 * exclusion at the buildWorldSnapshot chokepoint, and its DORMANCY.
 *
 * A stasis NPC must vanish from the settlement the pulse reads (excluded from ALL
 * participation reads), while a roster with no stasis NPC passes through the SAME
 * settlement reference (byte-identical dormancy — goldens use no ops).
 */
import { describe, expect, test } from 'vitest';
import { buildWorldSnapshot } from '../../../src/domain/worldPulse/worldSnapshot.js';

function canonSave(npcs) {
  return { id: 's1', phase: 'canon', settlement: { id: 's1', name: 'Testholm', tier: 'town', npcs } };
}
const campaign = { settlementIds: ['s1'] };

describe('STASIS — participation exclusion at the snapshot chokepoint', () => {
  test('a stasis NPC is excluded from the pulse participation view', () => {
    const save = canonSave([
      { id: 'active-1', name: 'Ava', role: 'ruler' },
      { id: 'shelved-1', name: 'Bo', role: 'merchant', stasis: { reason: 'journey' } },
    ]);
    const snap = buildWorldSnapshot({ campaign, saves: [save] });
    const item = snap.settlements.find((s) => String(s.id) === 's1');
    const names = item.settlement.npcs.map((n) => n.name);
    expect(names).toContain('Ava');
    expect(names).not.toContain('Bo'); // shelved — excluded from participation
    expect(item.settlement.npcs).toHaveLength(1);
  });

  test('DORMANCY: a roster with no stasis NPC yields the SAME settlement reference', () => {
    const save = canonSave([{ id: 'active-1', name: 'Ava', role: 'ruler' }]);
    const snap = buildWorldSnapshot({ campaign, saves: [save] });
    const item = snap.settlements.find((s) => String(s.id) === 's1');
    // Same reference in ⇒ same reference out (the WeakMap cache + every downstream
    // byte is unchanged when no op is used).
    expect(item.settlement).toBe(save.settlement);
  });

  test('the DM view (the save) is never mutated — stasis prunes only the participation copy', () => {
    const save = canonSave([
      { id: 'active-1', name: 'Ava', role: 'ruler' },
      { id: 'shelved-1', name: 'Bo', role: 'merchant', stasis: { reason: 'imprisoned' } },
    ]);
    buildWorldSnapshot({ campaign, saves: [save] });
    // The save's own roster still shows Bo — the DM (sole author of stasis) still sees them.
    expect(save.settlement.npcs.map((n) => n.name)).toEqual(['Ava', 'Bo']);
  });
});
