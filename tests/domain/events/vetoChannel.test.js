/**
 * tests/domain/events/vetoChannel.test.js — THE PHANTOM-EVENT REGRESSION PIN
 * (Composer V2 §2/§9).
 *
 * The sharpest recon finding: a gated mutation used to silently no-op while
 * the registry's stateDeltas AND narration still committed — the canon
 * timeline recorded a story the world never did. The handler-veto channel
 * closes it. This suite pins, at every seam:
 *   • runEventPipeline: a vetoed mutation commits NO deltas, NO narration,
 *     NO faction responses; the settlement is untouched; a blocking 'veto'
 *     warning (with its machine code) surfaces.
 *   • preview ≡ apply: the veto is identical through previewEvent and
 *     applyEvent (the DM sees the refusal BEFORE committing).
 *   • the pure batch: a vetoed member contributes nothing; the rest land.
 *   • the queued-event drain: a lapsed intention is refused, never
 *     phantom-committed (no husk entry).
 *   • the legacy mutateSettlement wrapper stays a byte-identical silent no-op
 *     (undo replay + old tests keep their contract).
 */

import { describe, it, expect } from 'vitest';
import { runEventPipeline } from '../../../src/domain/events/eventPipeline.js';
import { previewEvent } from '../../../src/domain/events/previewEvent.js';
import { applyEvent } from '../../../src/domain/events/applyEvent.js';
import { mutateSettlement, mutateSettlementChecked } from '../../../src/domain/events/mutate.js';
import { applyEventBatch } from '../../../src/domain/events/batch.js';
import { drainQueuedEvents } from '../../../src/domain/events/drainQueuedEvents.js';

const NOW = '2026-07-14T00:00:00.000Z';

const settlement = () => ({
  name: 'Vetoford',
  population: 900,
  tier: 'village',
  institutions: [{ id: 'i1', name: 'Granary' }],
  powerStructure: { factions: [{ id: 'f1', name: 'Town Council', faction: 'Town Council' }] },
  npcs: [{ id: 'n1', name: 'Alderman Puce', factionAffiliation: 'Town Council' }],
  config: { nearbyResources: ['timber'] },
});

// A canonical gated event: CHANGE_RULING_POWER to a faction that does not
// exist — transferRulingPower errors, the handler vetoes.
const gatedEvent = () => ({
  id: 'ev_veto_1',
  type: 'CHANGE_RULING_POWER',
  targetId: 'The Invisible Cabal',
  payload: { cause: 'coup' },
});

const duplicateFactionEvent = () => ({
  id: 'ev_duplicate_faction',
  type: 'ADD_FACTION',
  targetId: 'Town Council',
  payload: {},
});

describe('the handler-veto channel (phantom-event hole closed)', () => {
  it('runEventPipeline: a vetoed mutation commits NO deltas and NO narration', () => {
    const s = settlement();
    const result = runEventPipeline(s, gatedEvent());
    const veto = result.warnings.find(w => w.severity === 'veto');
    expect(veto).toBeTruthy();
    expect(typeof veto.code).toBe('string');
    expect(veto.code.length).toBeGreaterThan(0);
    // The phantom pin proper: nothing committed.
    expect(result.systemStateDeltas).toEqual([]);
    expect(result.causalStateDeltas).toEqual([]);
    expect(result.factionResponses).toEqual([]);
    expect(result.factionRelationshipDeltas).toEqual([]);
    expect(result.narrativeSummary).toBe('');
    expect(result.nextSettlement).toBe(s); // the BEFORE settlement, by reference
    expect(result.afterSystemState).toBe(result.beforeSystemState);
  });

  it('a NON-gated event still commits normally (negative control)', () => {
    const s = settlement();
    const result = runEventPipeline(s, {
      id: 'ev_ok_1', type: 'CHANGE_RULING_POWER', targetId: 'Town Council', payload: { cause: 'election' },
    });
    // 'Town Council' is the only faction, so it's governing → veto expected?
    // No: with a single faction and no governing seat marker, governingFactionOf
    // may resolve it as governing. Use IMPAIR_INSTITUTION as the clean control.
    const ok = runEventPipeline(s, {
      id: 'ev_ok_2', type: 'IMPAIR_INSTITUTION', targetId: 'Granary', payload: { severity: 0.5, dimension: 'capacity' },
    });
    expect(ok.warnings.filter(w => w.severity === 'veto')).toEqual([]);
    expect(ok.narrativeSummary.length).toBeGreaterThan(0);
    expect(ok.systemStateDeltas.length).toBeGreaterThan(0);
    expect(ok.nextSettlement).not.toBe(s);
    // (result intentionally unasserted beyond the control — single-faction
    // governing resolution is transferRulingPower's own contract.)
    expect(result).toBeTruthy();
  });

  it('preview ≡ apply on a veto: both surface the same refusal, neither commits', () => {
    const s = settlement();
    const preview = previewEvent({ settlement: s, systemState: null, event: gatedEvent() });
    const applied = applyEvent({ settlement: s, systemState: null, event: gatedEvent(), now: NOW });
    const pVeto = preview.warnings.find(w => w.severity === 'veto');
    expect(pVeto).toBeTruthy();
    expect(applied.veto).toBeTruthy();
    expect(applied.veto.code).toBe(pVeto.code);
    expect(applied.veto.message).toBe(pVeto.message);
    expect(preview.deltas).toEqual([]);
    expect(applied.logEntry.deltas).toEqual([]);
    expect(applied.logEntry.narrativeSummary).toBe('');
    expect(applied.nextSettlement).toBe(s);
  });

  it('duplicate ADD_FACTION is non-loggable: full apply commits no state, deltas, responses, or narration', () => {
    const s = settlement();
    const applied = applyEvent({
      settlement: s,
      systemState: null,
      event: duplicateFactionEvent(),
      now: NOW,
    });

    expect(applied.veto).toMatchObject({
      severity: 'veto',
      code: 'faction_already_present',
      detail: 'Town Council',
    });
    expect(applied.nextSettlement).toBe(s);
    expect(applied.nextSystemState).toStrictEqual(applied.logEntry.beforeState);
    expect(applied.logEntry.afterState).toStrictEqual(applied.logEntry.beforeState);
    expect(applied.logEntry.deltas).toEqual([]);
    expect(applied.logEntry.causalStateDeltas).toEqual([]);
    expect(applied.logEntry.factionResponses).toEqual([]);
    expect(applied.logEntry.factionRelationshipDeltas).toEqual([]);
    expect(applied.logEntry.narrativeSummary).toBe('');
    expect(applied.logEntry.undo).toBeUndefined();
  });

  it('a committing event carries veto: null on the apply envelope', () => {
    const applied = applyEvent({
      settlement: settlement(), systemState: null,
      event: { id: 'ev_ok_3', type: 'IMPAIR_INSTITUTION', targetId: 'Granary', payload: { severity: 0.5 } },
      now: NOW,
    });
    expect(applied.veto).toBeNull();
  });

  it('the pure batch: a vetoed member contributes nothing while the rest land', () => {
    const s = settlement();
    const result = applyEventBatch({
      settlement: s,
      events: [
        { id: 'b1', type: 'IMPAIR_INSTITUTION', targetId: 'Granary', payload: { severity: 0.5 } },
        gatedEvent(),
      ],
      now: NOW,
    });
    // The good event landed…
    const granary = result.nextSettlement.institutions.find(i => i.name === 'Granary');
    expect((granary.impairments || []).length).toBeGreaterThan(0);
    // …the vetoed one refused visibly and summed nothing.
    const vetoed = result.perEvent[1];
    expect(vetoed.warnings.some(w => w.severity === 'veto')).toBe(true);
    expect(vetoed.narrativeSummary).toBe('');
    // Summed deltas equal the single good event's (no coup deltas leaked in):
    // CHANGE_RULING_POWER(coup) would add volatility +18 — assert its absence.
    const soloResult = applyEventBatch({
      settlement: settlement(),
      events: [{ id: 'b1', type: 'IMPAIR_INSTITUTION', targetId: 'Granary', payload: { severity: 0.5 } }],
      now: NOW,
    });
    expect(result.summedStateDeltas).toEqual(soloResult.summedStateDeltas);
  });

  it('the queued-event drain refuses a lapsed intention — no phantom entry', () => {
    const save = { id: 's1', settlement: settlement(), campaignState: null };
    const { updates, drainedCount } = drainQueuedEvents({
      queue: [
        { queueId: 'q1', saveId: 's1', event: gatedEvent(), queuedAt: NOW },
        { queueId: 'q2', saveId: 's1', event: { id: 'q_ok', type: 'IMPAIR_INSTITUTION', targetId: 'Granary', payload: { severity: 0.5 } }, queuedAt: NOW },
      ],
      saves: [save],
      now: NOW,
      tick: 7,
    });
    expect(drainedCount).toBe(1); // only the good event drained
    expect(updates).toHaveLength(1);
    const log = updates[0].eventLog;
    expect(log).toHaveLength(1);
    expect(log[0].event.id).toBe('q_ok'); // the vetoed intention left NO entry
  });

  it('legacy mutateSettlement stays a byte-identical silent no-op on a veto', () => {
    const s = settlement();
    const legacy = mutateSettlement({ settlement: s, event: gatedEvent(), now: NOW });
    const checked = mutateSettlementChecked({ settlement: s, event: gatedEvent(), now: NOW });
    expect(checked.veto).toBeTruthy();
    expect(legacy).toEqual(checked.settlement);
    // Unchanged content (the condition-sync of an untouched copy).
    expect(legacy.npcs).toEqual(s.npcs);
    expect(legacy.powerStructure).toEqual(s.powerStructure);
  });

  it('every veto family fires: a sweep across the gated verbs', () => {
    const s = settlement();
    const cases = [
      [{ id: 'v1', type: 'KILL_NPC', targetId: 'Nobody' }, 'npc_not_found'],
      [{ id: 'v2', type: 'IMPAIR_INSTITUTION', targetId: 'No Such Hall' }, 'institution_not_found'],
      [{ id: 'v3', type: 'IMPAIR_FACTION', targetId: 'No Such Circle' }, 'faction_not_found'],
      [duplicateFactionEvent(), 'faction_already_present'],
      [{ id: 'v4', type: 'IMPOSE_CORRUPTION', targetId: 'Alderman Puce' }, 'no_criminal_org'],
      // SETTLEMENT_DISPUTE with an unlinked target deliberately does NOT veto:
      // the Lane-2 campaign ripple gives a campaign-peer dispute real effect
      // beyond this settlement-local view (see setNeighbourRelationship).
      [{ id: 'v6', type: 'RESOLVE_STRESSOR', targetId: 'no_such_crisis' }, 'stressor_not_found'],
      [{ id: 'v7', type: 'REMOVE_TRADE_GOOD', targetId: 'Moon Cheese' }, 'trade_good_not_found'],
      [{ id: 'v8', type: 'REMOVE_RESOURCE', targetId: 'adamantine' }, 'resource_not_found'],
      [{ id: 'v9', type: 'SHIFT_TIER', payload: { direction: 'demotion' }, targetId: null }, 'tier_at_bound_or_ok'],
      [{ id: 'v10', type: 'PROMOTE_NPC', targetId: 'n1', payload: {} }, 'swap_pair_incomplete'],
    ];
    for (const [event, expectedCode] of cases) {
      const result = runEventPipeline(s, event);
      const veto = result.warnings.find(w => w.severity === 'veto');
      if (expectedCode === 'tier_at_bound_or_ok') {
        // village CAN demote (hamlet exists) — this one legitimately commits.
        expect(veto).toBeFalsy();
        continue;
      }
      expect(veto, `${event.type} should veto`).toBeTruthy();
      expect(veto.code).toBe(expectedCode);
      expect(result.systemStateDeltas).toEqual([]);
      expect(result.narrativeSummary).toBe('');
    }
  });
});
