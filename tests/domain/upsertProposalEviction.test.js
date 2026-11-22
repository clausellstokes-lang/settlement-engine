/**
 * upsertProposalEviction.test.js — worldpulse-tick-core-2.
 *
 * The proposals ring (MAX_PROPOSALS = 80) used to overflow via a blind
 * `.slice(-MAX_PROPOSALS)`, dropping the OLDEST records regardless of status —
 * so under a forcing mode (dm_only / recommendations) a long advance minting
 * hundreds of proposals could silently evict a PENDING decision the DM never
 * saw. upsertProposal now evicts in a status-aware, always-receipted order:
 *   (1) RESOLVED records (any non-pending status) are pruned FIRST — lossless,
 *       they were already surfaced when they resolved;
 *   (2) a residual PENDING flood is EXPIRE-TO-DECLINED (status 'expired' +
 *       evictionReason), mirroring expireStaleActorMajors, so no pending
 *       proposal ever vanishes without a visible receipt.
 *
 * These pins are the LAW. The √N ring-scaling for forcing modes is a separate
 * wave (W-R2-DEPTH D2c) — NOT built here.
 */
import { describe, expect, test } from 'vitest';
import { upsertProposal } from '../../src/domain/worldPulse/worldState.js';

const MAX = 80;

/** A minimal proposal record. */
function proposal(n, status = 'pending') {
  return {
    id: `world_proposal.${n}`,
    status,
    tick: n,
    createdAt: `2026-01-01T00:00:${String(n % 60).padStart(2, '0')}.000Z`,
    updatedAt: `2026-01-01T00:00:${String(n % 60).padStart(2, '0')}.000Z`,
    outcome: { type: 'demo', id: `o${n}` },
  };
}

describe('upsertProposal: under the ring cap — byte-identical passthrough', () => {
  test('adds a proposal without dropping anything when under MAX_PROPOSALS', () => {
    let ws = { proposals: [] };
    for (let i = 0; i < MAX; i++) ws = upsertProposal(ws, proposal(i));
    expect(ws.proposals).toHaveLength(MAX);
    // Order preserved oldest-first; nothing stamped.
    expect(ws.proposals[0].id).toBe('world_proposal.0');
    expect(ws.proposals[MAX - 1].id).toBe('world_proposal.79');
    expect(ws.proposals.every(p => p.status === 'pending')).toBe(true);
    expect(ws.proposals.some(p => p.evictionReason)).toBe(false);
  });

  test('an idempotent re-upsert of an existing id merges in place (no growth, no eviction)', () => {
    let ws = { proposals: [] };
    for (let i = 0; i < 10; i++) ws = upsertProposal(ws, proposal(i));
    ws = upsertProposal(ws, { ...proposal(5), status: 'applied', appliedAt: 'x' });
    expect(ws.proposals).toHaveLength(10);
    expect(ws.proposals.find(p => p.id === 'world_proposal.5').status).toBe('applied');
  });
});

describe('upsertProposal: over the cap — resolved records evicted FIRST (pending protected)', () => {
  test('a RESOLVED record is dropped before any PENDING one, so a pending the blind slice would have dropped survives', () => {
    // Oldest record is APPLIED (resolved); fill the rest with pending, then push
    // one more pending to overflow. The blind `.slice(-80)` would have dropped
    // the OLDEST (index 0) — here index 0 is resolved and is dropped losslessly,
    // while a pending that would otherwise have been evicted stays.
    let ws = { proposals: [] };
    ws = upsertProposal(ws, proposal(0, 'applied')); // oldest = resolved
    for (let i = 1; i < MAX; i++) ws = upsertProposal(ws, proposal(i)); // 79 pending → total 80
    expect(ws.proposals).toHaveLength(MAX);
    // Overflow by one PENDING.
    ws = upsertProposal(ws, proposal(MAX));
    expect(ws.proposals).toHaveLength(MAX);
    // The resolved oldest was evicted; every retained record is pending.
    expect(ws.proposals.some(p => p.id === 'world_proposal.0')).toBe(false);
    expect(ws.proposals.every(p => p.status === 'pending')).toBe(true);
    // The newest pending landed and NO pending was expired (a resolved slot absorbed it).
    expect(ws.proposals.some(p => p.id === `world_proposal.${MAX}`)).toBe(true);
    expect(ws.proposals.some(p => p.evictionReason === 'ring_overflow')).toBe(false);
  });
});

describe('upsertProposal: pure-pending flood — the oldest overflow is EXPIRE-TO-DECLINED, never silently dropped', () => {
  test('the oldest pending is stamped expired (receipt) instead of vanishing as a phantom pending', () => {
    // Fill the ring entirely with pending, then overflow — no resolved records
    // exist to absorb it, so the oldest pending must leave. It leaves as a
    // VISIBLE expire-to-decline, not a silent drop.
    let ws = { proposals: [] };
    for (let i = 0; i < MAX; i++) ws = upsertProposal(ws, proposal(i));
    ws = upsertProposal(ws, proposal(MAX)); // one over

    // The oldest (world_proposal.0) is transitioned to expired with a receipt.
    const oldest = ws.proposals.find(p => p.id === 'world_proposal.0');
    expect(oldest).toBeTruthy();
    expect(oldest.status).toBe('expired');
    expect(oldest.evictionReason).toBe('ring_overflow');
    expect(oldest.expiredAt).toBeTruthy();
    // The newest pending is retained; the DM's active queue (status==='pending')
    // holds the newest MAX proposals, and the expired tombstone is visible.
    expect(ws.proposals.some(p => p.id === `world_proposal.${MAX}`)).toBe(true);
    const pending = ws.proposals.filter(p => p.status === 'pending');
    expect(pending.some(p => p.id === 'world_proposal.0')).toBe(false);
    // No pending proposal is EVER dropped without first becoming an expired receipt.
    expect(pending.length).toBe(MAX);
  });

  test('the ring stays bounded under sustained flood (the expired tombstone recycles)', () => {
    let ws = { proposals: [] };
    // Mint far more than the cap, all pending, one at a time.
    for (let i = 0; i < MAX * 3; i++) ws = upsertProposal(ws, proposal(i));
    // Bounded: at most MAX + a small tombstone margin (never unbounded growth).
    expect(ws.proposals.length).toBeLessThanOrEqual(MAX + 1);
    // The newest MAX are all still pending and present (the DM's live queue).
    const pending = ws.proposals.filter(p => p.status === 'pending');
    expect(pending.length).toBe(MAX);
    expect(pending.some(p => p.id === `world_proposal.${MAX * 3 - 1}`)).toBe(true);
    // Every evicted pending left as a receipted expire-to-decline (never silent).
    const expired = ws.proposals.filter(p => p.status === 'expired');
    expect(expired.every(p => p.evictionReason === 'ring_overflow')).toBe(true);
  });
});
