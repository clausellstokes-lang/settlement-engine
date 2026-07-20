/**
 * timelineTrack.test.js — VISION V-3 THE TIMELAPSE derivation pins.
 *
 * The track derives deterministically from the durable pulseHistory: per-advance
 * frames carrying event pulses (max severity per struck settlement, sorted) and
 * population tint deltas (grew/declined), with a total frame-at-tick lookup.
 */
import { describe, it, expect } from 'vitest';
import {
  buildTimelineTrack, frameAtTick, trackSettlementIds, settlementTimeline,
  serializeTimelapseClip, TIMELAPSE_CLIP_FORMAT, TIMELAPSE_CLIP_VERSION,
} from '../../src/domain/display/timelineTrack.js';

const worldState = {
  pulseHistory: [
    // out of order on purpose — the track sorts ascending by tick.
    { tick: 8, selectedOutcomes: [
      { severity: 0.4, settlementIds: ['s1'], populationDeltas: { s1: -10 } },
      { severity: 0.9, settlementIds: ['s3'] },
    ], impactDigest: [{ severity: 0.3, affectedSettlementIds: ['s2'] }] },
    { tick: 4, selectedOutcomes: [
      { severity: 0.8, settlementIds: ['s2', 's1'], populationDeltas: { s1: 50, s2: -20 } },
    ], impactDigest: [] },
  ],
};

describe('V-3 — buildTimelineTrack', () => {
  const track = buildTimelineTrack({ worldState });

  it('orders frames ascending by tick', () => {
    expect(track.ticks).toEqual([4, 8]);
    expect(track.minTick).toBe(4);
    expect(track.maxTick).toBe(8);
  });

  it('aggregates pulses (max severity per struck settlement, sorted by id)', () => {
    expect(track.frames[0].pulses).toEqual([
      { settlementId: 's1', severity: 0.8 },
      { settlementId: 's2', severity: 0.8 },
    ]);
    // tick 8: s1 (0.4 outcome), s2 (0.3 impact), s3 (0.9 outcome) — sorted by id.
    expect(track.frames[1].pulses).toEqual([
      { settlementId: 's1', severity: 0.4 },
      { settlementId: 's2', severity: 0.3 },
      { settlementId: 's3', severity: 0.9 },
    ]);
  });

  it('derives grew/declined tint from populationDeltas', () => {
    expect(track.frames[0].deltas).toEqual({ s1: 'up', s2: 'down' });
    expect(track.frames[1].deltas).toEqual({ s1: 'down' });
  });

  it('is deterministic — a second build is identical', () => {
    expect(JSON.stringify(buildTimelineTrack({ worldState }))).toBe(JSON.stringify(track));
  });

  it('an absent / empty pulseHistory yields an empty track (byte-inert overlay)', () => {
    for (const ws of [undefined, null, {}, { pulseHistory: [] }]) {
      const t = buildTimelineTrack({ worldState: ws });
      expect(t.frames).toEqual([]);
      expect(t.minTick).toBeNull();
      expect(t.maxTick).toBeNull();
    }
  });
});

describe('V-3 — frameAtTick (total, stable lookup)', () => {
  const track = buildTimelineTrack({ worldState });
  it('returns the latest frame at or before the scrub tick', () => {
    expect(frameAtTick(track, 6)?.tick).toBe(4);
    expect(frameAtTick(track, 8)?.tick).toBe(8);
    expect(frameAtTick(track, 100)?.tick).toBe(8);
  });
  it('clamps a pre-track scrub to the first frame, and null ⇒ latest (live)', () => {
    expect(frameAtTick(track, 0)?.tick).toBe(4);
    expect(frameAtTick(track, null)?.tick).toBe(8);
  });
  it('returns null for an empty track', () => {
    expect(frameAtTick(buildTimelineTrack({ worldState: {} }), 5)).toBeNull();
  });
});

describe('V-25d — the per-settlement drill', () => {
  const track = buildTimelineTrack({ worldState });

  it('lists every settlement that appears (as a pulse or a delta), codepoint-sorted', () => {
    expect(trackSettlementIds(track)).toEqual(['s1', 's2', 's3']);
    expect(trackSettlementIds(buildTimelineTrack({ worldState: {} }))).toEqual([]);
  });

  it('slices one settlement across the track — points, counts, peak severity', () => {
    const s1 = settlementTimeline(track, 's1');
    expect(s1.points).toEqual([
      { tick: 4, severity: 0.8, delta: 'up' },
      { tick: 8, severity: 0.4, delta: 'down' },
    ]);
    expect(s1.struck).toBe(2);
    expect(s1.grew).toBe(1);
    expect(s1.declined).toBe(1);
    expect(s1.peakSeverity).toBe(0.8);
    // s3: struck once (0.9), never moved.
    const s3 = settlementTimeline(track, 's3');
    expect(s3.points).toEqual([{ tick: 8, severity: 0.9, delta: null }]);
    expect(s3.struck).toBe(1);
    expect(s3.peakSeverity).toBe(0.9);
  });

  it('a settlement that never appears yields an empty, zeroed slice; deterministic', () => {
    const gone = settlementTimeline(track, 'nope');
    expect(gone).toEqual({ settlementId: 'nope', points: [], struck: 0, grew: 0, declined: 0, peakSeverity: 0 });
    expect(JSON.stringify(settlementTimeline(track, 's1'))).toBe(JSON.stringify(settlementTimeline(track, 's1')));
  });
});

describe('V-25d — export-as-clip (deterministic, encode-free)', () => {
  const track = buildTimelineTrack({ worldState });

  it('serializes a self-describing frame sequence — no raster, no ffmpeg', () => {
    const clip = serializeTimelapseClip(track);
    expect(clip.format).toBe(TIMELAPSE_CLIP_FORMAT);
    expect(clip.version).toBe(TIMELAPSE_CLIP_VERSION);
    expect(clip.minTick).toBe(4);
    expect(clip.maxTick).toBe(8);
    expect(clip.frameCount).toBe(2);
    expect(clip.frames.map((f) => f.tick)).toEqual([4, 8]);
    expect(clip.frames[0]).toEqual(track.frames[0]);
  });

  it('is deterministic — the same track serializes to identical bytes', () => {
    expect(JSON.stringify(serializeTimelapseClip(track))).toBe(JSON.stringify(serializeTimelapseClip(track)));
  });

  it('is total on an empty/garbage track (an empty clip, never a throw)', () => {
    for (const t of [buildTimelineTrack({ worldState: {} }), null, undefined]) {
      const clip = serializeTimelapseClip(t);
      expect(clip.frameCount).toBe(0);
      expect(clip.frames).toEqual([]);
      expect(clip.minTick).toBeNull();
    }
  });
});
