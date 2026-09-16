/**
 * narrativeStampParity.test.js — Wave R-3 lane A (atlas VI.10 #157b).
 *
 * eventNarrativeSnapshots had TWO stamp writers whose parity held only by
 * parallel code: settlementSlice.applyEvent (legacy) and the
 * server-authoritative canon-event command transaction. Both now call the ONE
 * shared condition, `stampPreEventNarrative`. This file pins:
 *   1. the helper's contract (guards, shape, id coercion, clone discipline);
 *   2. writer parity — the lanes' genuinely DIFFERENT calling conventions (a
 *      raw composer event + domain logEntry + the store's editedAt, versus a
 *      fully normalized `prepared` envelope) converge on one identical stamp,
 *      keyed by the domain-assigned event id;
 *   3. the single-writer source scan — neither lane may inline the condition
 *      or call appendEventNarrativeSnapshot directly again, and each lane's
 *      real argument shape is pinned so the parity fixtures cannot drift away
 *      from the code they claim to mirror.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  appendEventNarrativeSnapshot,
  MAX_EVENT_NARRATIVE_SNAPSHOTS,
  stampPreEventNarrative,
} from '../../src/store/eventNarrativeSnapshots.js';

const NARRATIVE = { summary: 'A quiet market town.', districts: ['wharf'] };
const T = '2026-07-27T10:00:00.000Z';

function saveWith(aiData) {
  return { id: 'save-x', aiData };
}

describe('stampPreEventNarrative — the one stamp condition', () => {
  test('stamps nothing without an event id or without a narrative', () => {
    expect(stampPreEventNarrative(null, { event: { id: 'e1' }, appliedAt: T })).toBeNull();
    expect(stampPreEventNarrative(saveWith(undefined), { event: { id: 'e1' }, appliedAt: T })).toBeNull();
    expect(stampPreEventNarrative(saveWith({ aiSettlement: null }), { event: { id: 'e1' }, appliedAt: T })).toBeNull();
    expect(stampPreEventNarrative(saveWith({ aiSettlement: NARRATIVE }), { appliedAt: T })).toBeNull();
    expect(stampPreEventNarrative(saveWith({ aiSettlement: NARRATIVE }), { event: {}, logEntry: { event: {} }, appliedAt: T })).toBeNull();
  });

  test('stamps the pre-event narrative keyed by the coerced event id', () => {
    const aiData = { aiSettlement: NARRATIVE, other: 'kept' };
    const next = stampPreEventNarrative(saveWith(aiData), { event: { id: 42 }, appliedAt: T });
    expect(next.other).toBe('kept');
    expect(next.eventNarrativeSnapshots).toHaveLength(1);
    const snap = next.eventNarrativeSnapshots[0];
    expect(snap.eventId).toBe('42');
    expect(snap.ts).toBe(T);
    expect(snap.aiSettlement).toEqual(NARRATIVE);
    expect(snap.aiSettlement).not.toBe(NARRATIVE); // cloned, never aliased
    expect(aiData.eventNarrativeSnapshots).toBeUndefined(); // input untouched
  });

  test('falls back to the logEntry event id when the event carries none', () => {
    const next = stampPreEventNarrative(saveWith({ aiSettlement: NARRATIVE }), {
      logEntry: { event: { id: 'from-log' } }, appliedAt: T,
    });
    expect(next.eventNarrativeSnapshots[0].eventId).toBe('from-log');
  });

  test('parity: the two lanes\' DIVERGENT calling conventions converge on one stamp', () => {
    // The fixtures below mirror how each real call site sources its arguments;
    // they are deliberately NOT the same object literal twice (an earlier
    // version of this test compared identical inputs and proved nothing).
    //
    //  • Legacy — settlementSlice.applyEvent:
    //      stampPreEventNarrative(beforeSave, { event, logEntry, appliedAt: afterState.editedAt })
    //    `event` is the CALLER's raw composer event, which routinely carries no
    //    id (the domain assigns one); `logEntry` is the domain's normalized
    //    entry; `appliedAt` arrives via the store field, which applyEvent sets
    //    from `logEntry.appliedAt`.
    //  • Command — canonEventCommandTransaction.nextAiData:
    //      stampPreEventNarrative(beforeSave, { event: prepared.event, logEntry: prepared.logEntry, appliedAt: prepared.appliedAt })
    //    every value comes pre-normalized off the same `prepared` envelope, so
    //    the event DOES carry the id and the clock is the domain's directly.
    //
    // The transaction's own `nextAiData` wrapper is module-private and its lane
    // needs the server-authoritative persistence backend to run, so this pins
    // the convergence at the shared helper — the seam where the parity claim
    // actually lives — and the source scan below keeps these fixtures honest.
    const aiData = { aiSettlement: NARRATIVE };
    const legacy = stampPreEventNarrative(saveWith(aiData), {
      event: { type: 'CUT_TRADE_ROUTE', targetId: 'road-north' },
      logEntry: { event: { id: 'evt-9', type: 'CUT_TRADE_ROUTE' }, appliedAt: T, beforeState: {} },
      appliedAt: T,
    });
    const command = stampPreEventNarrative(saveWith(aiData), {
      event: { id: 'evt-9', type: 'CUT_TRADE_ROUTE', targetId: 'road-north' },
      logEntry: { event: { id: 'evt-9', type: 'CUT_TRADE_ROUTE' }, appliedAt: T },
      appliedAt: T,
    });
    expect(legacy).toEqual(command);
    // The convergence is on the DOMAIN-assigned identity, not on whichever
    // object happened to carry it.
    expect(legacy.eventNarrativeSnapshots[0].eventId).toBe('evt-9');
    // And the helper stays a thin condition over the established append writer.
    expect(legacy).toEqual(appendEventNarrativeSnapshot(aiData, {
      eventId: 'evt-9', aiSettlement: NARRATIVE, ts: T,
    }));
  });

  test('cap and same-id replacement ride through unchanged', () => {
    let aiData = { aiSettlement: NARRATIVE };
    for (let i = 0; i < MAX_EVENT_NARRATIVE_SNAPSHOTS + 3; i += 1) {
      aiData = stampPreEventNarrative(saveWith(aiData), { event: { id: `e${i}` }, appliedAt: T });
    }
    expect(aiData.eventNarrativeSnapshots).toHaveLength(MAX_EVENT_NARRATIVE_SNAPSHOTS);
    const replaced = stampPreEventNarrative(saveWith(aiData), { event: { id: 'e5' }, appliedAt: T });
    expect(replaced.eventNarrativeSnapshots).toHaveLength(MAX_EVENT_NARRATIVE_SNAPSHOTS);
    expect(replaced.eventNarrativeSnapshots.filter(s => s.eventId === 'e5')).toHaveLength(1);
  });
});

describe('single-writer scan — both lanes call the helper, neither inlines it', () => {
  const read = rel => readFileSync(new URL(rel, import.meta.url), 'utf8');

  test('settlementSlice.applyEvent stamps through the helper', () => {
    const source = read('../../src/store/settlementSlice.js');
    expect(source).toMatch(/stampPreEventNarrative\(/);
    expect(source).not.toMatch(/appendEventNarrativeSnapshot\s*\(/);
    // The legacy lane's argument shape, mirrored by the parity fixture above.
    expect(source).toMatch(
      /stampPreEventNarrative\(\s*beforeSave,\s*\{\s*event,\s*logEntry,\s*appliedAt:\s*afterState\.editedAt\s*\}\s*\)/,
    );
    // …and the clock the fixture assumes: editedAt IS the domain's appliedAt,
    // which is why the two lanes' `ts` values coincide rather than merely
    // being written the same way.
    expect(source).toMatch(/editedAt\s*=\s*logEntry\.appliedAt/);
  });

  test('the canon-event command transaction stamps through the helper', () => {
    const source = read('../../src/store/canonEventCommandTransaction.js');
    expect(source).toMatch(/stampPreEventNarrative\(/);
    expect(source).not.toMatch(/appendEventNarrativeSnapshot\s*\(/);
    // The command lane's argument shape — every value off `prepared`.
    expect(source).toMatch(
      /stampPreEventNarrative\(\s*beforeSave,\s*\{\s*event:\s*prepared\.event,\s*logEntry:\s*prepared\.logEntry,\s*appliedAt:\s*prepared\.appliedAt,?\s*\}\s*\)/,
    );
  });
});
