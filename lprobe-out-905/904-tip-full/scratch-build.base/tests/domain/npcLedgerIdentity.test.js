/**
 * npcLedgerIdentity.test.js — W-H1 IDENTITY GRADUATION (design §3a).
 *
 * THE ONE-WAY DOOR the design names as this slice's heaviest risk: "changing id
 * semantics after persistence ships is a migration." These pins fix the contract.
 *
 *   MINTED ONCE          re-graduating returns the existing id and mints nothing.
 *   DETERMINISTIC        same inputs, same id, in any process, forever.
 *   ZERO-RNG             the mint consumes no PRNG draws (structurally golden-safe).
 *   COLLISION-CHECKED    a taken id is never returned.
 *   POSITIONALLY SAFE    a reroll that re-issues npc_N to somebody else cannot
 *                        inherit the graduated identity.
 *   ONE-WAY              graduation is not an update verb; it never rewrites a record.
 */
import { describe, expect, test } from 'vitest';

import {
  DURABLE_NPC_ID_PREFIX,
  mintDurableNpcId,
  graduateNpc,
  durableIdForRoster,
  graduatedNpcIds,
  npcLedgerOf,
} from '../../src/domain/worldPulse/npcLedger.js';

const LIT = () => ({ simulationRules: { npcConsequencesEnabled: true }, tick: 1 });
const MIRA = { rosterId: 'npc_3', name: 'Mira Vane', role: 'Magistrate' };

/** Graduate one person into a fresh lit world; returns the whole result. */
function graduateMira(worldState, patch = {}) {
  return graduateNpc({
    worldState,
    settlementSeed: 'seed-aldermoor',
    settlementId: 'aldermoor',
    rosterIdentity: MIRA,
    tick: 5,
    ...patch,
  });
}

describe('durable id minting — deterministic, shaped, and rng-free', () => {
  test('the id is the declared shape: wnpc_ plus eight lowercase hex digits', () => {
    const id = mintDurableNpcId('seed-a', MIRA, 5);
    expect(id.startsWith(DURABLE_NPC_ID_PREFIX)).toBe(true);
    expect(id).toMatch(/^wnpc_[0-9a-f]{8}$/);
  });

  test('same inputs always mint the same id (THE PROMISE: a seed is a world, forever)', () => {
    const a = mintDurableNpcId('seed-a', MIRA, 5);
    const b = mintDurableNpcId('seed-a', { ...MIRA }, 5);
    expect(b).toBe(a);
    // Repeated calls cannot drift: there is no hidden counter or clock in the mint.
    for (let i = 0; i < 25; i += 1) expect(mintDurableNpcId('seed-a', MIRA, 5)).toBe(a);
  });

  test('each of the three seeded inputs actually moves the id (no ignored argument)', () => {
    const base = mintDurableNpcId('seed-a', MIRA, 5);
    expect(mintDurableNpcId('seed-b', MIRA, 5)).not.toBe(base);              // settlement seed
    expect(mintDurableNpcId('seed-a', { ...MIRA, name: 'Other' }, 5)).not.toBe(base); // identity
    expect(mintDurableNpcId('seed-a', { ...MIRA, rosterId: 'npc_9' }, 5)).not.toBe(base);
    expect(mintDurableNpcId('seed-a', MIRA, 6)).not.toBe(base);              // tick
  });

  test('the mint consumes ZERO PRNG draws (Math.random is never reached)', () => {
    // A DRAW-ACCOUNTING pin, not a style pin: a draw here would shift every seeded
    // stream downstream of graduation and could move a generation golden. The mint is
    // a hash precisely so it cannot.
    const real = Math.random;
    let draws = 0;
    Math.random = () => { draws += 1; return real(); };
    try {
      for (let i = 0; i < 50; i += 1) mintDurableNpcId('seed-a', { rosterId: `npc_${i}`, name: `N${i}` }, i);
      graduateMira(LIT());
    } finally {
      Math.random = real;
    }
    expect(draws, 'the mint and graduation must not draw from any PRNG').toBe(0);
  });

  test('a taken id is never returned: the probe walks deterministically to a free one', () => {
    const natural = mintDurableNpcId('seed-a', MIRA, 5);
    const taken = new Set([natural]);
    const probed = mintDurableNpcId('seed-a', MIRA, 5, taken);
    expect(probed).not.toBe(natural);
    expect(taken.has(probed)).toBe(false);
    // The probe is itself deterministic, so a collision does not make the world
    // unreproducible: the same taken-set yields the same replacement every time.
    expect(mintDurableNpcId('seed-a', MIRA, 5, taken)).toBe(probed);
  });

  test('the mint is TOTAL even when everything collides (never throws, never loops forever)', () => {
    // Every hash-derived candidate is taken; only the widened suffix form can escape.
    // This is the astronomically-unlikely branch, executed rather than assumed.
    const everything = { has: (/** @type {string} */ id) => !id.includes('_9') };
    const id = mintDurableNpcId('seed-a', MIRA, 5, everything);
    expect(everything.has(id)).toBe(false);
    expect(id.startsWith(DURABLE_NPC_ID_PREFIX)).toBe(true);
  });
});

describe('graduation — one-way and idempotent', () => {
  test('the first graduation mints and records the roster linkage', () => {
    const world = LIT();
    const result = graduateMira(world);
    expect(result.minted).toBe(true);
    expect(result.changed).toBe(true);
    expect(result.wnpcId).toMatch(/^wnpc_[0-9a-f]{8}$/);

    const ledger = npcLedgerOf(result.worldState);
    const record = ledger.roamers[String(result.wnpcId)];
    expect(record.originRef).toEqual({ settlementId: 'aldermoor', rosterId: 'npc_3', name: 'Mira Vane' });
    expect(record.identityFacets).toEqual({ name: 'Mira Vane', role: 'Magistrate' });
    expect(record.sinceTick).toBe(5);
  });

  test('re-graduating the SAME person returns the existing id and mints nothing', () => {
    const first = graduateMira(LIT());
    const again = graduateMira(first.worldState, { tick: 400, verdictCause: 'banished' });
    expect(again.wnpcId).toBe(first.wnpcId);
    expect(again.minted, 'a second mint would break the one-way door').toBe(false);
    expect(again.changed).toBe(false);
    // ONE-WAY, not an update verb: the record is byte-unchanged even though the second
    // call passed a later tick and a different verdict.
    expect(again.worldState).toBe(first.worldState);
    expect(graduatedNpcIds(again.worldState)).toEqual([first.wnpcId]);
  });

  test('idempotency survives a JSON round trip (the reverse lookup is persisted, not cached)', () => {
    const first = graduateMira(LIT());
    const reloaded = JSON.parse(JSON.stringify(first.worldState));
    expect(durableIdForRoster(reloaded, 'aldermoor', MIRA)).toBe(first.wnpcId);
    const again = graduateMira(reloaded);
    expect(again.minted).toBe(false);
    expect(again.wnpcId).toBe(first.wnpcId);
  });

  test('POSITIONAL TRAP: a reroll re-issuing npc_3 to a stranger cannot inherit the identity', () => {
    // regenerationPreservation.js documents the trap: a reroll re-stamps npc_1..npc_N
    // onto entirely different characters. If the durable lookup keyed on the slot id
    // alone, the stranger who inherits npc_3 would silently become the banished
    // magistrate. The identity key carries the NAME, so it cannot.
    const first = graduateMira(LIT());
    const stranger = { rosterId: 'npc_3', name: 'Tobin Reave', role: 'Cooper' };
    expect(durableIdForRoster(first.worldState, 'aldermoor', stranger)).toBe(null);

    const second = graduateNpc({
      worldState: first.worldState,
      settlementSeed: 'seed-aldermoor',
      settlementId: 'aldermoor',
      rosterIdentity: stranger,
      tick: 60,
    });
    expect(second.minted).toBe(true);
    expect(second.wnpcId).not.toBe(first.wnpcId);
    expect(graduatedNpcIds(second.worldState)).toHaveLength(2);
  });

  test('the same name in a DIFFERENT settlement is a different person', () => {
    const first = graduateMira(LIT());
    const elsewhere = graduateNpc({
      worldState: first.worldState,
      settlementSeed: 'seed-crowmarch',
      settlementId: 'crowmarch',
      rosterIdentity: MIRA,
      tick: 5,
    });
    expect(elsewhere.minted).toBe(true);
    expect(elsewhere.wnpcId).not.toBe(first.wnpcId);
    expect(durableIdForRoster(elsewhere.worldState, 'aldermoor', MIRA)).toBe(first.wnpcId);
    expect(durableIdForRoster(elsewhere.worldState, 'crowmarch', MIRA)).toBe(elsewhere.wnpcId);
  });

  test('a graduation into a HOST lands in placed, not roamers (law 6: exactly one home)', () => {
    const result = graduateMira(LIT(), { hostSettlementId: 'aldermoor', verdictCause: 'jailed' });
    const ledger = npcLedgerOf(result.worldState);
    expect(Object.keys(ledger.placed)).toEqual([String(result.wnpcId)]);
    expect(Object.keys(ledger.roamers)).toEqual([]);
    expect(ledger.placed[String(result.wnpcId)].hostSettlementId).toBe('aldermoor');
    expect(ledger.placed[String(result.wnpcId)].verdictCause).toBe('jailed');
  });

  test('collision handling holds END TO END: two identities never share a durable id', () => {
    // Drive a realistic cast through graduation and assert the id space stays injective.
    let world = /** @type {Record<string, unknown>} */ (LIT());
    /** @type {string[]} */
    const ids = [];
    for (let s = 0; s < 12; s += 1) {
      for (let n = 1; n <= 10; n += 1) {
        const out = graduateNpc({
          worldState: world,
          settlementSeed: `seed-${s}`,
          settlementId: `town_${s}`,
          rosterIdentity: { rosterId: `npc_${n}`, name: `Person ${s}-${n}`, role: 'Elder' },
          tick: s + n,
        });
        world = out.worldState;
        ids.push(String(out.wnpcId));
      }
    }
    expect(ids).toHaveLength(120);
    expect(new Set(ids).size, 'a duplicate durable id would merge two people into one').toBe(120);
    expect(graduatedNpcIds(world)).toHaveLength(120);
  });
});
