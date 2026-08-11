import { describe, expect, it, vi } from 'vitest';
import {
  durationBand,
  errorKindFromError,
} from '../../src/store/aiOverlayLifecycle.js';
import { buildAiDataBlob } from '../../src/store/aiPersistenceEnvelope.js';
import { buildChronicleContextFromSave } from '../../src/store/aiChronicleContext.js';
import {
  aiRequestDisposition,
  DAILY_LIFE_FIELD_LABELS,
  NARRATIVE_FIELD_LABELS,
  ROTATING_AI_PROGRESS,
} from '../../src/store/aiRequestLifecycle.js';

describe('AI slice helpers', () => {
  it('classifies telemetry without leaking error text', () => {
    expect(durationBand(4_999)).toBe('lt_5s');
    expect(durationBand(5_000)).toBe('5_15s');
    expect(durationBand(60_000)).toBe('1_5m');
    expect(errorKindFromError(new DOMException('stopped', 'AbortError'))).toBe('aborted');
    expect(errorKindFromError(new Error('Failed to fetch private detail'))).toBe('network');
    expect(errorKindFromError(new Error('insufficient credits'))).toBe('credits');
  });

  it('preserves sibling durable collections while replacing an overlay field', () => {
    const chronicle = [{ id: 'c1' }];
    const pinnedNpcs = ['npc-1'];
    const snapshots = [{ eventId: 'e1' }];
    const dossierNotes = { private: 'note' };
    const next = buildAiDataBlob({
      aiSettlement: { old: true },
      chronicle,
      pinnedNpcs,
      eventNarrativeSnapshots: snapshots,
      dossierNotes,
    }, {
      aiSettlement: { next: true },
    });

    expect(next.aiSettlement).toEqual({ next: true });
    expect(next.chronicle).toBe(chronicle);
    expect(next.pinnedNpcs).toBe(pinnedNpcs);
    expect(next.eventNarrativeSnapshots).toBe(snapshots);
    expect(next.dossierNotes).toBe(dossierNotes);
  });

  it('distinguishes commit, lock release, and superseded abandonment', () => {
    const state = {
      aiRequestId: 4,
      activeSaveId: 'save-1',
      setCreditBalance: vi.fn(),
    };
    const get = () => state;
    expect(aiRequestDisposition(get, 4, 'save-1')).toBe('commit');
    expect(aiRequestDisposition(get, 4, 'save-2')).toBe('release');
    expect(aiRequestDisposition(get, 3, 'save-1')).toBe('abandon');
  });

  it('keeps request copy tables complete and immutable', () => {
    expect(Object.keys(NARRATIVE_FIELD_LABELS)).toHaveLength(12);
    expect(Object.keys(DAILY_LIFE_FIELD_LABELS)).toHaveLength(5);
    expect(ROTATING_AI_PROGRESS.length).toBeGreaterThan(2);
    expect(Object.isFrozen(NARRATIVE_FIELD_LABELS)).toBe(true);
    expect(Object.isFrozen(DAILY_LIFE_FIELD_LABELS)).toBe(true);
    expect(Object.isFrozen(ROTATING_AI_PROGRESS)).toBe(true);
  });
});

/**
 * CR-S6-6 — THE AI-CHRONICLE WORLD LANE. `buildChronicleContextFromSave` read the
 * world events off `campaignState.worldPulse.events`, a path NO writer produces:
 * campaignStateForWorldPulse stamps {lastTick, lastInterval, updatedAt} and nothing
 * else, so the model's world grounding was permanently empty however far the campaign
 * had been advanced. The repair points the lane at the campaign's own
 * worldState.pulseHistory, the same source the dossier Chronicle was repaired onto.
 *
 * The FIRST case below is the NON-VACUITY ARM and the reason this suite is worth the
 * bytes: it drives the OLD wiring against the SAME advanced campaign and measures the
 * empty result, so "the new wiring returns rows" cannot pass on a fixture that would
 * have produced rows either way.
 */
describe('AI chronicle grounding — the world lane (CR-S6-6)', () => {
  const SAVE_ID = 'save.harrowgate';

  /** A campaign worldState as the advance actually persists it: events on pulseHistory. */
  const advancedWorldState = () => ({
    pulseHistory: [{
      id: 'pulse-1',
      tick: 3,
      createdAt: '2026-03-04T00:00:00.000Z',
      selectedOutcomes: [{
        id: 'out-1',
        targetSaveId: SAVE_ID,
        headline: 'The granary tithe collapses',
        summary: 'Two seasons of levy arrears come due at once.',
        candidateType: 'economic_shock',
        reasons: ['arrears'],
      }],
      impactDigest: [],
    }],
  });

  /** The per-save campaignState the SAME advance writes — note: no `events` slot. */
  const advancedSave = () => ({
    id: SAVE_ID,
    campaignState: {
      eventLog: [],
      canonizedAt: '2026-03-01T00:00:00.000Z',
      worldPulse: { lastTick: 3, lastInterval: 'one_month', updatedAt: '2026-03-04T00:00:00.000Z' },
    },
  });

  const savedSettlements = [{ id: SAVE_ID, settlement: { name: 'Harrowgate' } }];

  it('THE NON-VACUITY ARM — the old per-save wiring is empty on this very campaign', () => {
    // Exactly what the reader used to consult, on the fixture the repair is proven
    // against. `worldPulse` carries the three keys the writer stamps and no `events`,
    // so the old lane had nothing to hand the model and this fixture cannot be one
    // that would have worked before.
    const save = advancedSave();
    expect(Object.keys(save.campaignState.worldPulse).sort())
      .toEqual(['lastInterval', 'lastTick', 'updatedAt']);
    expect(save.campaignState.worldPulse.events).toBeUndefined();
    // …and with NO campaign worldState threaded, the builder still falls back to that
    // dead path and returns null — the permanently-empty behaviour, reproduced.
    expect(buildChronicleContextFromSave(save, { id: SAVE_ID })).toBeNull();
  });

  it('produces REAL world rows once the campaign worldState is threaded through', () => {
    const items = buildChronicleContextFromSave(advancedSave(), { id: SAVE_ID }, {
      campaignWorldState: advancedWorldState(),
      savedSettlements,
    })?.items;
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(1);
    expect(items[0].source).toBe('world');
    // The CONTENT travelled, not merely a row: the headline and the summary the
    // advance recorded are what the model will be grounded on. (selectChronicleContext
    // hands the prompt a compact {when, what, detail, source, party} payload.)
    expect(items[0].what).toBe('The granary tithe collapses');
    expect(String(items[0].detail)).toContain('levy arrears');
  });

  it('a campaign with no advances yet still returns null rather than an empty shell', () => {
    // anchored: the SAME call with a populated pulseHistory returns one item, asserted
    // in the case directly above, so this null is an empty history and not a broken call.
    expect(buildChronicleContextFromSave(advancedSave(), { id: SAVE_ID }, {
      campaignWorldState: { pulseHistory: [] },
      savedSettlements,
    })).toBeNull();
  });

  it('rows belonging to OTHER settlements never reach this settlement\'s grounding', () => {
    const foreign = advancedWorldState();
    foreign.pulseHistory[0].selectedOutcomes[0].targetSaveId = 'save.elsewhere';
    // anchored: the identical record with targetSaveId back on SAVE_ID yields one item
    // (the case two above), so the null here is the projection filtering by settlement.
    expect(buildChronicleContextFromSave(advancedSave(), { id: SAVE_ID }, {
      campaignWorldState: foreign,
      savedSettlements,
    })).toBeNull();
  });

  it('the dead `recent` slot is gone — settlement.recentEvents no longer reaches the feed (H9)', () => {
    // `settlement.recentEvents` has NO writer in this repo. The slot is deleted at both
    // reader sites; this pins that a settlement carrying one is NOT consulted, so the
    // deletion cannot be silently undone by a future edit re-adding the slot.
    const items = buildChronicleContextFromSave(advancedSave(), {
      id: SAVE_ID,
      recentEvents: [{ id: 'legacy-1', title: 'A hand-authored recent event' }],
    }, { campaignWorldState: advancedWorldState(), savedSettlements })?.items;
    expect(items).toHaveLength(1);
    // anchored: `items` is non-empty above, so this absence is measured over a real feed
    expect(items.map((entry) => entry.what)).not.toContain('A hand-authored recent event');
    expect(items[0].source).toBe('world');
  });
});
