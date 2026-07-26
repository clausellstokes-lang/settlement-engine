import { describe, expect, it, vi } from 'vitest';
import {
  durationBand,
  errorKindFromError,
} from '../../src/store/aiOverlayLifecycle.js';
import { buildAiDataBlob } from '../../src/store/aiPersistenceEnvelope.js';
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
