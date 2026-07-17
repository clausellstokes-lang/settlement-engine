/**
 * npcOps.test.js — DESIGN_NPC_LIFECYCLE §2/§3/§5 pins for the NPC ops + instant NPC.
 *
 * Covers: bank-bounded EDIT (free-text rejected) · facts-frozen (no op rewrites the
 * past / other fields) · travel/stay (reassignment moves seat-held, leaves people-held)
 * · stasis exclusion predicate + memory-flow shape + STATE-NEVER-FATE reversibility ·
 * counterpart citizenship (instant ≡ generated at every facet read) · determinism
 * (same seed ⇒ same instant NPC) · the Decree-Tracker receipt (cone attaches free).
 */
import { describe, expect, test } from 'vitest';
import { NPC_ALIGNMENTS, npcFacetOf, NPC_FACET_KINDS } from '../../../src/domain/npc/npcBank.js';
import {
  applyEditNpcFacet, reassignNpc, enterStasis, returnNpc, isInStasis,
  instantNpc, instantNpcFacetSummary, npcOpReceipt, STASIS_REASONS, SEAT_HELD_FIELDS,
} from '../../../src/domain/npc/npcOps.js';
import { NAMING_DATA } from '../../../src/data/namingData.js';
import { RECEIPT_SOURCES, RECEIPT_KINDS } from '../../../src/domain/trace.js';

describe('EDIT_NPC — bank-bounded, facts-frozen, immutable', () => {
  const base = () => ({ id: 'n1', name: 'Alda', role: 'baker', personality: { dominant: 'honest', flaw: 'prideful' }, goal: { short: 'secure_office', long: 'expand_influence' } });

  test('a valid facet edit is applied as a declared facet', () => {
    const r = applyEditNpcFacet(base(), 'alignment', 'lawful_good');
    expect(r.ok).toBe(true);
    expect(r.npc.facets.alignment).toBe('lawful_good');
  });

  test('free-text / off-vocab is refused and the npc is unchanged', () => {
    const npc = base();
    const r = applyEditNpcFacet(npc, 'alignment', 'super evil');
    expect(r.ok).toBe(false);
    expect(r.npc).toBe(npc); // untouched reference
  });

  test('temperament edit syncs the live native field (personality.dominant) — propagates', () => {
    const r = applyEditNpcFacet(base(), 'temperament', 'incorruptible');
    expect(r.npc.facets.temperament).toBe('incorruptible');
    expect(r.npc.personality.dominant).toBe('incorruptible');
  });

  test('goal edit syncs the display native field (goal.short)', () => {
    const r = applyEditNpcFacet(base(), 'goal', 'restore_order');
    expect(r.npc.facets.goal).toBe('restore_order');
    expect(r.npc.goal.short).toBe('restore_order');
    expect(r.npc.goal.long).toBe('expand_influence'); // long untouched
  });

  test('facts-frozen: the edit is immutable (input never mutated) and touches no other field', () => {
    const npc = base();
    const snapshot = JSON.parse(JSON.stringify(npc));
    const r = applyEditNpcFacet(npc, 'alignment', 'chaotic_neutral');
    expect(npc).toEqual(snapshot);          // original untouched
    expect(r.npc.name).toBe('Alda');
    expect(r.npc.role).toBe('baker');        // unrelated fields stand
  });
});

describe('REASSIGN_NPC — travel/stay (people-held travels, seat-held stays)', () => {
  const settlement = () => ({
    npcs: [{ id: 'n1', name: 'Bran', role: 'merchant', factionLink: 'guild-A', institutionId: 'market-A', factionAffiliation: 'Guild A' }],
    // a PEOPLE-HELD tie: a patronage relationship edge keyed by the NPC's id
    relationships: [{ npc1Id: 'n1', npc2Id: 'n2', type: 'patronage' }],
  });

  test('seat-held ties change to the new posting; the old seat is vacated', () => {
    const r = reassignNpc(settlement(), 0, { institutionId: 'temple-B', factionLink: 'faith-B', factionAffiliation: 'Faith B' });
    expect(r.ok).toBe(true);
    expect(r.settlement.npcs[0].institutionId).toBe('temple-B');
    expect(r.settlement.npcs[0].factionLink).toBe('faith-B');
    // The old seat's factionLink is no longer held by this NPC → a vacancy the
    // role-fill machinery refills next tick.
  });

  test('people-held ties (relationship edges) TRAVEL — untouched, still keyed to the NPC', () => {
    const s = settlement();
    const r = reassignNpc(s, 0, { institutionId: 'temple-B' });
    expect(r.settlement.relationships).toBe(s.relationships); // same reference — untouched
    expect(r.settlement.relationships[0]).toEqual({ npc1Id: 'n1', npc2Id: 'n2', type: 'patronage' });
  });

  test('every SEAT_HELD_FIELD present on the target overwrites; absent fields stand', () => {
    const s = settlement();
    const r = reassignNpc(s, 0, { institutionId: 'x' }); // only institutionId in target
    expect(r.settlement.npcs[0].institutionId).toBe('x');
    expect(r.settlement.npcs[0].factionLink).toBe('guild-A'); // untouched (not in target)
    expect(SEAT_HELD_FIELDS).toContain('institutionId');
  });

  test('the input settlement is not mutated (immutable)', () => {
    const s = settlement();
    const snap = JSON.parse(JSON.stringify(s));
    reassignNpc(s, 0, { institutionId: 'temple-B' });
    expect(s).toEqual(snap);
  });
});

describe('STASIS / RETURN — reversible state (STATE-NEVER-FATE), memory flows', () => {
  const settlement = () => ({ npcs: [{ id: 'n1', name: 'Cyra', role: 'ruler' }], relationships: [{ npc1Id: 'n1', npc2Id: 'n2', type: 'grievance', resentment: 0.6 }] });

  test('enterStasis sets a typed reason; isInStasis flips true', () => {
    const r = enterStasis(settlement(), 0, 'journey');
    expect(r.ok).toBe(true);
    expect(r.settlement.npcs[0].stasis).toEqual({ reason: 'journey' });
    expect(isInStasis(r.settlement.npcs[0])).toBe(true);
  });

  test('an unknown stasis reason is refused', () => {
    const r = enterStasis(settlement(), 0, 'vaporized');
    expect(r.ok).toBe(false);
    for (const reason of STASIS_REASONS) expect(enterStasis(settlement(), 0, reason).ok).toBe(true);
  });

  test('returnNpc is the reversal — stasis is a shelf, not a grave (reversible)', () => {
    const inStasis = enterStasis(settlement(), 0, 'imprisoned').settlement;
    const back = returnNpc(inStasis, 0);
    expect(back.ok).toBe(true);
    expect(isInStasis(back.settlement.npcs[0])).toBe(false);
    expect('stasis' in back.settlement.npcs[0]).toBe(false);
  });

  test('MEMORY FLOWS: stasis touches only the NPC — relationship edges (the D5 ledger) are left intact', () => {
    const s = settlement();
    const r = enterStasis(s, 0, 'missing');
    // The op never touches settlement.relationships, so the world's grievance/warmth
    // toward the NPC keeps decaying per D5 while they are shelved.
    expect(r.settlement.relationships).toBe(s.relationships);
    expect(r.settlement.relationships[0].resentment).toBe(0.6);
  });

  test('returnNpc on an already-active NPC is a safe no-op', () => {
    const s = settlement();
    const r = returnNpc(s, 0);
    expect(r.ok).toBe(true);
    expect(r.settlement).toBe(s);
  });
});

describe('INSTANT NPC — determinism + counterpart citizenship + tier-blind', () => {
  test('same seed ⇒ byte-identical NPC (determinism)', () => {
    const a = instantNpc({ seed: 'abc', namingData: NAMING_DATA.germanic });
    const b = instantNpc({ seed: 'abc', namingData: NAMING_DATA.germanic });
    expect(a).toEqual(b);
  });

  test('different seeds ⇒ (generally) different NPCs', () => {
    const a = instantNpc({ seed: 'seed-1', namingData: NAMING_DATA.germanic });
    const b = instantNpc({ seed: 'seed-2', namingData: NAMING_DATA.germanic });
    expect(a).not.toEqual(b);
  });

  test('COUNTERPART: an instant NPC resolves to a bank-valid value at EVERY facet kind', () => {
    const npc = instantNpc({ seed: 'xyz', namingData: NAMING_DATA.latin });
    const summary = instantNpcFacetSummary(npc);
    for (const kind of NPC_FACET_KINDS) {
      // Every facet resolves through the facet law to a real, non-null value.
      expect(summary[kind], `facet ${kind}`).toBeTruthy();
    }
    // The generated-shape fields a generated NPC has, an instant NPC also has.
    expect(npc.name).toBeTruthy();
    expect(npc.personality.dominant).toBeTruthy();
    expect(npc.goal.short).toBeTruthy();
    expect(['high', 'moderate', 'low']).toContain(npc.influence);
    expect(NPC_ALIGNMENTS).toContain(npc.facets.alignment);
  });

  test('a role constraint narrows the archetype; the generator takes no tier argument (tier-blind)', () => {
    const npc = instantNpc({ seed: 'q', namingData: NAMING_DATA.germanic, role: 'military', institutionId: 'garrison-1' });
    expect(npc.role).toBe('military');
    expect(npc.institutionId).toBe('garrison-1');
    // Signature accepts no tier/entitlement — the premium seam wraps the BUTTON only.
    expect(instantNpc.length).toBeLessThanOrEqual(1); // single options arg
  });
});

describe('THE DECREE-TRACKER RECEIPT — the cone attaches free', () => {
  test('an NPC op yields a conformant edit/npc receipt with its causal cone', () => {
    const npc = { id: 'n9', name: 'Doria' };
    const r = npcOpReceipt('edit-npc', npc, { facetKind: 'alignment', effects: ['alignment'], detail: 'alignment → lawful_good' });
    expect(RECEIPT_SOURCES).toContain(r.source);
    expect(r.source).toBe('edit');
    expect(RECEIPT_KINDS).toContain(r.kind);
    expect(r.kind).toBe('npc');
    expect(r.id).toContain('n9');
    expect(Array.isArray(r.causes) && r.causes.length >= 1).toBe(true); // WHY
    expect(r.causes[0].source).toBe('edit-npc');
    expect(Array.isArray(r.effects)).toBe(true);                        // WHAT it feeds
    expect(r.effects[0].target).toBe('alignment');
  });

  test('every op type produces a valid receipt (reassign / stasis / return)', () => {
    for (const op of ['reassign-npc', 'stasis-npc', 'return-npc']) {
      const r = npcOpReceipt(op, { id: 'n1' }, {});
      expect(r.source).toBe('edit');
      expect(r.kind).toBe('npc');
    }
  });
});
