import { describe, expect, it } from 'vitest';

import {
  FOREIGN_GUEST_HOLD_CAUSES,
  FOREIGN_GUEST_HOLD_CLOSE_REASONS,
  MAX_ACTIVE_FOREIGN_GUEST_HOLDS,
  closeForeignGuestHold,
  foreignGuestHoldForErrand,
  foreignGuestHoldForNpc,
  foreignGuestHoldsOf,
  normalizeForeignGuestHold,
  openForeignGuestHold,
  restoreForeignGuestHold,
} from '../../src/domain/worldPulse/foreignGuestHold.js';

const routeRef = (id = 'road:ash') => ({ id, name: `Road ${id}` });

const outboundContinuation = (overrides = {}) => ({
  schemaVersion: 1,
  resumeState: 'travelling',
  journey: 'outbound',
  destinationId: 'court:b',
  interruptedTick: 4,
  positionRef: {
    journey: 'outbound',
    legIndex: 0,
    fromId: 'court:a',
    toId: 'court:b',
    progressBand: 'near',
  },
  journeyLegs: [{
    fromId: 'court:a',
    toId: 'court:b',
    departTick: 1,
    arrivalTick: 6,
    journey: 'outbound',
    routeRef: routeRef(),
  }],
  expectedReturnTick: 20,
  ...overrides,
});

const returningContinuation = (overrides = {}) => ({
  schemaVersion: 1,
  resumeState: 'returning',
  journey: 'return',
  destinationId: 'court:a',
  interruptedTick: 14,
  positionRef: {
    journey: 'return',
    legIndex: 0,
    fromId: 'court:b',
    toId: 'court:a',
    progressBand: 'underway',
  },
  journeyLegs: [{
    fromId: 'court:b',
    toId: 'court:a',
    departTick: 12,
    arrivalTick: 18,
    journey: 'return',
    routeRef: routeRef('road:return'),
  }],
  expectedReturnTick: 20,
  scheduledHomeTick: 20,
  ...overrides,
});

const hold = (suffix = 'a', overrides = {}) => ({
  schemaVersion: 1,
  id: `hold:${suffix}`,
  npcId: `npc:${suffix}`,
  errandId: `errand:${suffix}`,
  encounterId: `encounter:${suffix}`,
  captorId: `court:captor:${suffix}`,
  venueId: `hall:${suffix}`,
  venueRef: { kind: 'settlement', settlementId: `hall:${suffix}` },
  heldSinceTick: 5,
  cause: 'private_imprisonment',
  continuation: outboundContinuation(),
  ...overrides,
});

const withRaw = (rows, extra = {}) => ({
  ...extra,
  spatialLedgers: { ...(extra.spatialLedgers || {}), foreignGuestHolds: rows },
});

describe('WR-7b foreign guest hold one-writer substrate', () => {
  it('is absent by identity and refuses malformed opening without materializing a ledger', () => {
    const worldState = { tick: 5, simulationRules: {} };
    expect(foreignGuestHoldsOf(worldState)).toEqual([]);
    expect(foreignGuestHoldForNpc(worldState, 'npc:none')).toBeNull();
    expect(foreignGuestHoldForErrand(worldState, 'errand:none')).toBeNull();

    for (const malformed of [null, {}, { ...hold(), id: 7 }, { ...hold(), extra: true }]) {
      const out = openForeignGuestHold({ worldState, hold: malformed });
      expect(out.worldState).toBe(worldState);
      expect(out.changed).toBe(false);
    }
    // `worldState` is a literal built in this test body and every rejection above
    // asserts the writer returned that SAME reference, so "no ledger key was created"
    // cannot be confused with "the subject drifted away".
    // anchored: subject is a test-body literal, proven unchanged by the toBe checks above.
    expect(worldState).not.toHaveProperty('spatialLedgers');
  });

  it('opens detached rows, sorts by codepoint id, and enforces person/errand singularity', () => {
    const inputZ = hold('z');
    const first = openForeignGuestHold({ worldState: { tick: 5 }, hold: inputZ });
    const inputA = hold('a');
    const second = openForeignGuestHold({ worldState: first.worldState, hold: inputA });
    expect(second.changed).toBe(true);
    expect(second.worldState.spatialLedgers.foreignGuestHolds.map((row) => row.id))
      .toEqual(['hold:a', 'hold:z']);

    inputA.venueRef.settlementId = 'mutated';
    inputA.continuation.positionRef.progressBand = 'arrived';
    expect(foreignGuestHoldForNpc(second.worldState, 'npc:a')).toMatchObject({
      id: 'hold:a',
      venueRef: { settlementId: 'hall:a' },
      continuation: { positionRef: { progressBand: 'near' } },
    });
    expect(foreignGuestHoldForErrand(second.worldState, 'errand:z')?.npcId).toBe('npc:z');

    const projection = foreignGuestHoldsOf(second.worldState);
    projection[0].continuation.journeyLegs[0].routeRef.name = 'tampered';
    expect(foreignGuestHoldsOf(second.worldState)[0].continuation.journeyLegs[0].routeRef.name)
      .toBe('Road road:ash');

    const same = openForeignGuestHold({ worldState: second.worldState, hold: hold('z') });
    expect(same.worldState).toBe(second.worldState);
    expect(same.reason).toBe('already_open');

    for (const collision of [
      hold('other-npc', { npcId: 'npc:z' }),
      hold('other-errand', { errandId: 'errand:z' }),
      hold('z', { captorId: 'court:someone-else' }),
    ]) {
      const out = openForeignGuestHold({ worldState: second.worldState, hold: collision });
      expect(out.worldState).toBe(second.worldState);
      expect(out.reason).toBe('authority_conflict');
    }
  });

  it('accepts exact settlement and route-node venues and survives JSON transport', () => {
    const routeNode = hold('road', {
      venueId: 'crossing:7',
      venueRef: { kind: 'route_node', nodeId: 'crossing:7', routeId: 'road:ash' },
      continuation: returningContinuation(),
      heldSinceTick: 14,
      cause: 'terms_shopping',
    });
    const opened = openForeignGuestHold({ worldState: { tick: 14 }, hold: routeNode });
    const roundTripped = JSON.parse(JSON.stringify(opened.worldState));
    expect(foreignGuestHoldsOf(roundTripped)).toEqual([routeNode]);
    expect(foreignGuestHoldsOf(roundTripped)[0]).not.toBe(routeNode);

    for (const badVenue of [
      { kind: 'settlement', settlementId: 'wrong' },
      { kind: 'route_node', nodeId: 'crossing:7' },
      { kind: 'route_node', nodeId: 'crossing:8', routeId: 'road:ash' },
      { kind: 'road', nodeId: 'crossing:7', routeId: 'road:ash' },
    ]) {
      expect(normalizeForeignGuestHold({ ...routeNode, venueRef: badVenue })).toBeNull();
    }
  });

  it('rejects impossible continuation chronologies, crossed journeys, and opaque cargo', () => {
    const base = hold();
    const badContinuations = [
      outboundContinuation({ interruptedTick: 8 }),
      outboundContinuation({ destinationId: 'court:elsewhere' }),
      outboundContinuation({ expectedReturnTick: 5 }),
      outboundContinuation({ scheduledHomeTick: 20 }),
      outboundContinuation({ resumeState: 'returning' }),
      outboundContinuation({ positionRef: { ...outboundContinuation().positionRef, toId: 'wrong' } }),
      outboundContinuation({ journeyLegs: [{
        ...outboundContinuation().journeyLegs[0],
        arrivalTick: 1,
      }] }),
      { ...outboundContinuation(), liveWorldTruth: { strength: 0.9 } },
    ];
    for (const continuation of badContinuations) {
      expect(normalizeForeignGuestHold({ ...base, continuation })).toBeNull();
    }

    const parlay = outboundContinuation({
      resumeState: 'parlaying',
      interruptedTick: 6,
      positionRef: { ...outboundContinuation().positionRef, progressBand: 'arrived' },
    });
    expect(normalizeForeignGuestHold({ ...base, heldSinceTick: 6, continuation: parlay }))
      .not.toBeNull();
  });

  it('drops malformed imports and every row participating in duplicate authority', () => {
    const goodA = hold('good-a');
    const goodB = hold('good-b');
    const duplicateNpcA = hold('dup-npc-a', { npcId: 'npc:duplicate' });
    const duplicateNpcB = hold('dup-npc-b', { npcId: 'npc:duplicate' });
    const duplicateErrandA = hold('dup-errand-a', { errandId: 'errand:duplicate' });
    const duplicateErrandB = hold('dup-errand-b', { errandId: 'errand:duplicate' });
    const duplicateIdA = hold('same', { npcId: 'npc:same-a', errandId: 'errand:same-a' });
    const duplicateIdB = hold('same', { npcId: 'npc:same-b', errandId: 'errand:same-b' });
    const malformed = { ...hold('malformed'), encounterId: '' };
    const rows = foreignGuestHoldsOf(withRaw([
      duplicateNpcA,
      goodB,
      malformed,
      duplicateErrandB,
      duplicateIdA,
      goodA,
      duplicateNpcB,
      duplicateErrandA,
      duplicateIdB,
    ]));
    expect(rows.map((row) => row.id)).toEqual(['hold:good-a', 'hold:good-b']);
  });

  it.each(FOREIGN_GUEST_HOLD_CLOSE_REASONS)(
    'closes through the one writer with explicit %s provenance and drops the empty key',
    (closeReason) => {
      const otherLedger = closeReason === 'release' ? { keep: { value: 1 } } : null;
      const base = otherLedger
        ? { tick: 7, spatialLedgers: { unrelated: otherLedger } }
        : { tick: 7 };
      const opened = openForeignGuestHold({ worldState: base, hold: hold(closeReason) });
      // Lifecycle cleanup stays live after configuration changes.
      const darkened = {
        ...opened.worldState,
        simulationRules: { envoyDiplomacyEnabled: false },
      };
      const current = foreignGuestHoldForNpc(darkened, `npc:${closeReason}`);
      const closed = closeForeignGuestHold({
        worldState: darkened,
        expectedHold: current,
        tick: 7,
        reason: closeReason,
      });
      expect(closed.changed).toBe(true);
      expect(closed.closure).toMatchObject({
        schemaVersion: 1,
        closeReason,
        closedTick: 7,
        hold: { id: `hold:${closeReason}` },
      });
      expect(closed.worldState.spatialLedgers?.foreignGuestHolds).toBeUndefined();
      if (otherLedger) expect(closed.worldState.spatialLedgers.unrelated).toEqual(otherLedger);
      // `closed.changed` and the exact `closed.closure` match above prove the writer
      // really ran on a live world, so drop-when-empty is measured here rather than
      // absence-of-everything.
      // anchored: live closure proven by the changed/closure assertions above.
      else expect(closed.worldState).not.toHaveProperty('spatialLedgers');
    },
  );

  it('requires the exact active row and valid close chronology', () => {
    const opened = openForeignGuestHold({ worldState: { tick: 7 }, hold: hold() });
    const current = foreignGuestHoldForNpc(opened.worldState, 'npc:a');
    for (const args of [
      { expectedHold: { ...current, captorId: 'court:replacement' }, tick: 7, reason: 'release' },
      { expectedHold: current, tick: 4, reason: 'release' },
      { expectedHold: current, tick: 7, reason: 'ransom' },
    ]) {
      const out = closeForeignGuestHold({ worldState: opened.worldState, ...args });
      expect(out.worldState).toBe(opened.worldState);
      expect(out.changed).toBe(false);
    }
  });

  it('restores exact closure cargo once and rejects moved clocks or intervening authority', () => {
    const opened = openForeignGuestHold({ worldState: { tick: 7 }, hold: hold() });
    const current = foreignGuestHoldForNpc(opened.worldState, 'npc:a');
    const closed = closeForeignGuestHold({
      worldState: opened.worldState,
      expectedHold: current,
      tick: 7,
      reason: 'pardon',
    });
    const restored = restoreForeignGuestHold({
      worldState: closed.worldState,
      closure: closed.closure,
      tick: 7,
    });
    expect(restored.changed).toBe(true);
    expect(foreignGuestHoldsOf(restored.worldState)).toEqual([hold()]);

    const repeated = restoreForeignGuestHold({
      worldState: restored.worldState,
      closure: closed.closure,
      tick: 7,
    });
    expect(repeated.worldState).toBe(restored.worldState);

    const movedClock = { ...closed.worldState, tick: 8 };
    expect(restoreForeignGuestHold({
      worldState: movedClock,
      closure: closed.closure,
      tick: 7,
    }).worldState).toBe(movedClock);

    const intervening = openForeignGuestHold({
      worldState: closed.worldState,
      hold: hold('later', { heldSinceTick: 7 }),
    }).worldState;
    expect(restoreForeignGuestHold({
      worldState: intervening,
      closure: closed.closure,
      tick: 7,
    }).worldState).toBe(intervening);

    const tampered = structuredClone(closed.closure);
    tampered.hold.continuation.destinationId = 'court:forged';
    expect(restoreForeignGuestHold({
      worldState: closed.worldState,
      closure: tampered,
      tick: 7,
    }).worldState).toBe(closed.worldState);
  });

  it('bounds living custody without evicting an active guest', () => {
    let worldState = { tick: 5 };
    for (let index = MAX_ACTIVE_FOREIGN_GUEST_HOLDS - 1; index >= 0; index -= 1) {
      const opened = openForeignGuestHold({ worldState, hold: hold(String(index).padStart(3, '0')) });
      expect(opened.changed).toBe(true);
      worldState = opened.worldState;
    }
    expect(foreignGuestHoldsOf(worldState)).toHaveLength(MAX_ACTIVE_FOREIGN_GUEST_HOLDS);
    expect(foreignGuestHoldsOf(worldState).map((row) => row.id)).toEqual(
      [...foreignGuestHoldsOf(worldState).map((row) => row.id)].sort(),
    );
    const overflow = openForeignGuestHold({ worldState, hold: hold('overflow') });
    expect(overflow.worldState).toBe(worldState);
    expect(overflow.reason).toBe('capacity');
  });

  it('keeps both vocabularies closed and complete', () => {
    expect(FOREIGN_GUEST_HOLD_CAUSES).toEqual([
      'war_continuation',
      'private_imprisonment',
      'terms_shopping',
      'parlay_refused',
      // ES-2: the covert cause. Appended rather than inserted — two consumers key off the
      // word and one (`ransomDwellRead`) now branches on this exact member.
      'caught_spying',
    ]);
    expect(FOREIGN_GUEST_HOLD_CLOSE_REASONS).toEqual([
      'release',
      'escape',
      'death',
      'pardon',
    ]);
  });
});
