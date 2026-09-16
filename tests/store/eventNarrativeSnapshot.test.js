/**
 * eventNarrativeSnapshot.test.js — canon-history preservation (Wave E1).
 *
 * settlementSlice.applyEvent stamps the AI narrative that described the PRE-event
 * canon state into the save's aiData archive, keyed by event id, so the prose
 * lineage isn't overwritten as events accrue. This pins the pure archive helper:
 * append, dedupe-by-eventId, FIFO cap, and clone-once (isolation from mutation).
 */
import { describe, it, expect } from 'vitest';
import {
  appendEventNarrativeSnapshot, MAX_EVENT_NARRATIVE_SNAPSHOTS,
} from '../../src/store/settlementSlice.js';

const narrative = (thesis) => ({ thesis, npcs: [{ name: 'A' }] });

describe('appendEventNarrativeSnapshot', () => {
  it('appends a keyed, cloned snapshot into a fresh archive', () => {
    const next = appendEventNarrativeSnapshot(null, { eventId: 'e1', aiSettlement: narrative('t1'), ts: 'ts1' });
    expect(next.eventNarrativeSnapshots).toHaveLength(1);
    expect(next.eventNarrativeSnapshots[0]).toMatchObject({ eventId: 'e1', ts: 'ts1' });
    expect(next.eventNarrativeSnapshots[0].aiSettlement.thesis).toBe('t1');
  });

  it('preserves other aiData fields', () => {
    const next = appendEventNarrativeSnapshot({ aiSettlement: narrative('live'), narrativeMode: 'narrated' }, {
      eventId: 'e1', aiSettlement: narrative('t1'),
    });
    expect(next.narrativeMode).toBe('narrated');
    expect(next.aiSettlement.thesis).toBe('live');
  });

  it('clones the narrative once — later mutation of the source does not leak in', () => {
    const src = narrative('t1');
    const next = appendEventNarrativeSnapshot(null, { eventId: 'e1', aiSettlement: src });
    src.thesis = 'MUTATED';
    src.npcs[0].name = 'MUTATED';
    expect(next.eventNarrativeSnapshots[0].aiSettlement.thesis).toBe('t1');
    expect(next.eventNarrativeSnapshots[0].aiSettlement.npcs[0].name).toBe('A');
  });

  it('dedupes by eventId (a re-applied event replaces, never doubles)', () => {
    let d = appendEventNarrativeSnapshot(null, { eventId: 'e1', aiSettlement: narrative('t1') });
    d = appendEventNarrativeSnapshot(d, { eventId: 'e1', aiSettlement: narrative('t2') });
    expect(d.eventNarrativeSnapshots).toHaveLength(1);
    expect(d.eventNarrativeSnapshots[0].aiSettlement.thesis).toBe('t2');
  });

  it('FIFO-caps the archive so it never balloons', () => {
    let d = null;
    for (let i = 0; i < MAX_EVENT_NARRATIVE_SNAPSHOTS + 5; i++) {
      d = appendEventNarrativeSnapshot(d, { eventId: `e${i}`, aiSettlement: narrative(`t${i}`) });
    }
    const snaps = d.eventNarrativeSnapshots;
    expect(snaps).toHaveLength(MAX_EVENT_NARRATIVE_SNAPSHOTS);
    // oldest dropped, newest kept
    expect(snaps[0].eventId).toBe('e5');
    expect(snaps[snaps.length - 1].eventId).toBe(`e${MAX_EVENT_NARRATIVE_SNAPSHOTS + 4}`);
  });

  it('no-ops when there is nothing durable to snapshot', () => {
    const base = { aiSettlement: narrative('live') };
    expect(appendEventNarrativeSnapshot(base, { eventId: 'e1' })).toBe(base);         // no narrative
    expect(appendEventNarrativeSnapshot(base, { aiSettlement: narrative('x') })).toBe(base); // no eventId
  });
});
