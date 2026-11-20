// CENSUS-4 R3: the tie rule — ONE role-class rule, read by the generator's tie step and by the
// instrument (reader:relation-types), and no generated tie whose kind presumes a relation the two
// roles lack.
import { describe, it, expect, beforeAll } from 'vitest';
import * as RC from '../../../src/domain/roles/roleClass.js';
import * as R from '../../../src/domain/coherence/readerBattery.js';
import { STRESS_ECONOMIC_EFFECTS } from '../../../src/data/npcData.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';

describe('the role-class rule has one home', () => {
  it('the instrument reads the domain rule itself, not a copy', () => {
    expect(R.exemptedVerdict).toBe(RC.exemptedVerdict);
    expect(R.shareTradeOrOffice).toBe(RC.shareTradeOrOffice);
    expect(R.ROLE_CLASS).toBe(RC.ROLE_CLASS);
  });
  it('names the three presuming kinds by their archetype labels', () => {
    for (const [key, { label }] of Object.entries(RC.TIE_PRESUMES)) expect(STRESS_ECONOMIC_EFFECTS[key].label).toBe(label);
    expect(Object.values(RC.TIE_PRESUMES).map((p) => p.label).sort()).toEqual([...RC.PRESUMING_KINDS].sort());
  });
  it('a refused kind keeps its polarity (a rivalry stays hostile, so it still seeds its conflict)', () => {
    for (const [kind, keys] of Object.entries(RC.ROLE_FREE_BY_KIND)) {
      for (const key of keys) expect(RC.ROLE_FREE_TIE_KEYS).toContain(key);
      if (STRESS_ECONOMIC_EFFECTS[kind].type === 'rival') for (const key of keys) expect(['rival', 'enemy']).toContain(STRESS_ECONOMIC_EFFECTS[key].type);
    }
  });
  it('every role-free kind is a real archetype that presumes nothing', () => {
    for (const key of RC.ROLE_FREE_TIE_KEYS) {
      expect(STRESS_ECONOMIC_EFFECTS[key]).toBeTruthy();
      expect(RC.TIE_PRESUMES[key]).toBeUndefined();
    }
  });
});

describe('the resolve-after rule', () => {
  const smith = { role: 'Blacksmith', npc: {} };
  const priest = { role: 'High Priest', npc: {} };
  const mayor = { role: 'Mayor', npc: {} };
  const smith2 = { role: 'Blacksmith', npc: {} };
  it('keeps a lawful kind (byte-identical) and refuses a presuming kind the roles lack', () => {
    expect(RC.resolveTieKey('mentor_legacy', smith, smith2, 'a>b')).toEqual({ key: 'mentor_legacy', refused: false });
    expect(RC.resolveTieKey('old_debt', smith, priest, 'a>b')).toEqual({ key: 'old_debt', refused: false });
    const r = RC.resolveTieKey('mentor_legacy', smith, priest, 'a>b');
    expect(r.refused).toBe(true);
    expect(RC.ROLE_FREE_TIE_KEYS).toContain(r.key);
    expect(RC.resolveTieKey('gov_mil_friction', smith, mayor, 'a>b').refused).toBe(true);
  });
  it('is a pure function of the pair (a hash, never a roll)', () => {
    expect(RC.resolveTieKey('peer_rivalry', smith, priest, 'x>y')).toEqual(RC.resolveTieKey('peer_rivalry', smith, priest, 'x>y'));
  });
});

describe('no generated tie presumes a relation its two roles lack (reader:relation-types, exempted)', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('holds on soak1k-0..11, read on the final record with the seat', () => {
    const fires = [];
    for (let i = 0; i < 12; i += 1) {
      const { seed, settlement: s } = birth(i);
      const byId = new Map((s.npcs || []).map((n) => [n.id, n]));
      const seat = RC.seatFactions(s);
      for (const rel of s.relationships || []) {
        const p = RC.TIE_PRESUMES[rel.archetypeKey];
        if (!p) continue;
        const a = byId.get(rel.npc1Id); const b = byId.get(rel.npc2Id);
        const v = RC.exemptedVerdict(p.label, { role: rel.npc1Role, npc: a }, { role: rel.npc2Role, npc: b }, seat);
        if (v.fires) fires.push(`${seed}: ${rel.npc1Role} · ${p.label} · ${rel.npc2Role}`);
      }
    }
    expect(fires).toEqual([]);
  }, 120000);
});
