/**
 * Transport contract for the command-specific canon-event RPC.
 *
 * Domain preparation and store projection are tested separately. This suite
 * keeps the network seam deliberately boring: exact parameter names, tolerant
 * PostgREST response casing, and typed failures for every unconfirmed answer.
 */

import { describe, expect, test, vi } from 'vitest';
import {
  commitCreateRouteCommand,
  commitCutTradeRouteCommand,
  readCanonEventCommandAuthority,
} from '../../src/lib/canonEventCommandPersistence.js';

function request() {
  return {
    ownerId: '11111111-1111-4111-8111-111111111111',
    commandId: 'cmd:canon-event-apply:review-1',
    saveId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    expectedRevision: '2026-07-24T12:00:00.000Z',
    event: {
      id: 'event.cut-route.1',
      type: 'CUT_TRADE_ROUTE',
      targetId: 'Old North Road',
    },
    expectedSettlement: { name: 'Ashford', config: {} },
    expectedCampaignState: { phase: 'canon', eventLog: [] },
    expectedAiData: { aiSettlement: { overview: 'Before' } },
    settlement: { name: 'Ashford', config: { _cutRoutes: [{ name: 'Old North Road' }] } },
    campaignState: {
      phase: 'canon',
      eventLog: [{ event: { id: 'event.cut-route.1' } }],
    },
    aiData: { aiSettlement: { overview: 'Before' }, eventNarrativeSnapshots: [] },
  };
}

describe('commitCutTradeRouteCommand', () => {
  test('sends the complete base and next projections to the specific RPC', async () => {
    const client = {
      rpc: vi.fn(async () => ({
        data: {
          status: 'applied',
          replayed: false,
          fingerprint: 'a'.repeat(64),
          revisionKind: 'base-projection-v1',
          settlement: request().settlement,
          campaign_state: request().campaignState,
          ai_data: request().aiData,
          updated_at: '2026-07-24T12:05:00.000Z',
          receipt: { eventType: 'CUT_TRADE_ROUTE' },
        },
        error: null,
      })),
    };

    const result = await commitCutTradeRouteCommand(request(), { client });

    expect(client.rpc).toHaveBeenCalledWith(
      'apply_cut_trade_route_command',
      {
        p_expected_owner: request().ownerId,
        p_command_id: request().commandId,
        p_save_id: request().saveId,
        p_expected_revision: request().expectedRevision,
        p_event: request().event,
        p_expected_data: request().expectedSettlement,
        p_expected_campaign_state: request().expectedCampaignState,
        p_expected_ai_data: request().expectedAiData,
        p_next_data: request().settlement,
        p_next_campaign_state: request().campaignState,
        p_next_ai_data: request().aiData,
      },
    );
    expect(result).toEqual({
      status: 'applied',
      reason: null,
      replayed: false,
      fingerprint: 'a'.repeat(64),
      revisionKind: 'base-projection-v1',
      settlement: request().settlement,
      campaignState: request().campaignState,
      aiData: request().aiData,
      updatedAt: '2026-07-24T12:05:00.000Z',
      receipt: { eventType: 'CUT_TRADE_ROUTE' },
    });
  });

  test('normalizes a structured RPC refusal without pretending it threw', async () => {
    const client = {
      rpc: vi.fn(async () => ({
        data: {
          status: 'stale',
          reason: 'base_projection_changed',
          replayed: false,
          fingerprint: 'b'.repeat(64),
        },
        error: null,
      })),
    };
    await expect(commitCutTradeRouteCommand(request(), { client }))
      .resolves.toMatchObject({
        status: 'stale',
        reason: 'base_projection_changed',
        revisionKind: 'base-projection-v1',
      });
  });

  test('turns PostgREST and malformed-answer failures into typed errors', async () => {
    const denied = {
      rpc: vi.fn(async () => ({
        data: null,
        error: {
          code: '42501',
          message: 'application command owner changed',
          details: 'owner mismatch',
        },
      })),
    };
    await expect(commitCutTradeRouteCommand(request(), { client: denied }))
      .rejects.toMatchObject({
        name: 'CanonEventCommandPersistenceError',
        code: '42501',
        details: 'owner mismatch',
      });

    const malformed = {
      rpc: vi.fn(async () => ({ data: [], error: null })),
    };
    await expect(commitCutTradeRouteCommand(request(), { client: malformed }))
      .rejects.toMatchObject({
        name: 'CanonEventCommandPersistenceError',
        code: 'canon_command_response_invalid',
      });

    await expect(commitCutTradeRouteCommand(request(), { client: null }))
      .rejects.toMatchObject({
        name: 'CanonEventCommandPersistenceError',
        code: 'canon_command_backend_unavailable',
      });
  });

  test('reads one exact owner and command identity without hiding kind conflicts', async () => {
    const maybeSingle = vi.fn(async () => ({
      data: {
        owner_id: request().ownerId,
        command_id: request().commandId,
        kind: 'settlement.canon-event.apply',
        target_id: request().saveId,
        phase: 'finalized',
        status: 'applied',
        receipt: {
          eventType: 'CUT_TRADE_ROUTE',
          updatedAt: '2026-07-24T12:05:00.000Z',
        },
        failure_code: null,
        claimed_at: '2026-07-24T12:04:59.000Z',
        finalized_at: '2026-07-24T12:05:00.000Z',
        updated_at: '2026-07-24T12:05:00.000Z',
      },
      error: null,
    }));
    const secondEq = vi.fn(() => ({ maybeSingle }));
    const firstEq = vi.fn(() => ({ eq: secondEq }));
    const select = vi.fn(() => ({ eq: firstEq }));
    const client = { from: vi.fn(() => ({ select })) };

    await expect(readCanonEventCommandAuthority({
      ownerId: request().ownerId,
      commandId: request().commandId,
    }, { client })).resolves.toEqual({
      ownerId: request().ownerId,
      commandId: request().commandId,
      kind: 'settlement.canon-event.apply',
      targetId: request().saveId,
      phase: 'finalized',
      status: 'applied',
      receipt: {
        eventType: 'CUT_TRADE_ROUTE',
        updatedAt: '2026-07-24T12:05:00.000Z',
      },
      failureCode: null,
      claimedAt: '2026-07-24T12:04:59.000Z',
      finalizedAt: '2026-07-24T12:05:00.000Z',
      updatedAt: '2026-07-24T12:05:00.000Z',
    });
    expect(client.from).toHaveBeenCalledWith('application_command_journal');
    expect(firstEq).toHaveBeenCalledWith('owner_id', request().ownerId);
    expect(secondEq).toHaveBeenCalledWith(
      'command_id',
      request().commandId,
    );
  });
});

// R7 (VEIL-FIX, the pre-deploy review of 2026-11-10, finding 5): the canon commands write `p_next_data`
// straight from the store, bypassing the row builder, so the record carried the stamp its last save drew
// before the command changed the town (and, for a route, its partner). The next projections leave
// WITHOUT `publicProse` (the shared page prints silence until the next save re-stamps); the expected
// projections keep it, since they are the compare-and-swap base the server holds.
describe('R7: a canon command never writes a stale public prose stamp', () => {
  const STAMP = { v: 'pp-1', blocks: { 'general:overview': { text: 'drawn before the command' } } };
  const okClient = () => ({ rpc: vi.fn(async () => ({ data: { status: 'applied', settlement: {}, campaign_state: {}, updated_at: 'x' }, error: null })) });

  test('cut route: p_next_data leaves without publicProse; p_expected_data keeps it', async () => {
    const client = okClient();
    const r = request();
    await commitCutTradeRouteCommand({
      ...r,
      expectedSettlement: { ...r.expectedSettlement, publicProse: STAMP },
      settlement: { ...r.settlement, publicProse: STAMP },
    }, { client });
    const args = client.rpc.mock.calls[0][1];
    expect(args.p_next_data).toEqual(r.settlement);
    expect(args.p_expected_data.publicProse).toEqual(STAMP);
  });

  test('create route: the initiating and the partner next projections leave without publicProse', async () => {
    const client = okClient();
    const r = request();
    await commitCreateRouteCommand({
      ...r,
      partnerSaveId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      partnerExpectedSettlement: { name: 'Partner', publicProse: STAMP },
      partnerSettlement: { name: 'Partner', config: {}, publicProse: STAMP },
      settlement: { ...r.settlement, publicProse: STAMP },
    }, { client });
    const args = client.rpc.mock.calls[0][1];
    expect(args.p_next_data).toEqual(r.settlement);
    expect(args.p_partner_next_data).toEqual({ name: 'Partner', config: {} });
    expect(args.p_partner_expected_data.publicProse).toEqual(STAMP);
  });
});
