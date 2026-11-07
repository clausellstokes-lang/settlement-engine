/**
 * I5 (the chair, 2026-11-04, on soak 1000 rung 1): a placeholder faction or a role-only person is
 * a contradiction the page must not vouch against (root-cause kind 7). The receipt's eighth
 * judgment, record_coherence_battery, now includes it, so the self-vouch line (selected only on
 * a 'pass') does not print for such a record.
 */
import { describe, expect, it } from 'vitest';
import { recordBatteryJudgment } from '../../src/generators/recordBatteryFindings.js';

const base = { tier: 'village', name: 'Ashford', npcs: [{ name: 'Edda Cole', role: 'Elder' }], powerStructure: { factions: [{ faction: 'Village Elders', power: 100 }] } };

describe('I5 — kind 7 in the record battery', () => {
  it('a clean record passes', () => {
    expect(recordBatteryJudgment(base).status).toBe('pass');
  });
  it('a record whose only finding is a placeholder faction does not pass', () => {
    const s = { ...base, powerStructure: { factions: [{ faction: 'Village Elders', power: 60 }, { faction: 'Claimant Bloc A', power: 40 }] } };
    const j = recordBatteryJudgment(s);
    expect(j.status).toBe('needs_review');
    expect(j.findings.map((f) => f.path)).toEqual(['battery.unnamed']);
  });
  it('a role-only person does not pass', () => {
    const s = { ...base, npcs: [...base.npcs, { name: 'The Guildmaster', role: 'Guildmaster' }] };
    expect(recordBatteryJudgment(s).findings.map((f) => f.path)).toEqual(['battery.unnamed']);
  });
});
