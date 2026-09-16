/**
 * timelineTrackGolden.test.js — VISION V-3, the same-seed TIMELAPSE track hash.
 *
 * The track is a pure function of the durable pulseHistory, so a fixed fixture
 * hashes to a stable, machine-independent digest. A derivation change (pulse
 * aggregation, delta sign, ordering) trips this — the correct signal — and is
 * re-minted WITH a stated cause:
 *   UPDATE_TIMELINE_GOLDEN=1 npx vitest run tests/property/timelineTrackGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { buildTimelineTrack } from '../../src/domain/display/timelineTrack.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'timeline-track-golden.json');
const UPDATE = process.env.UPDATE_TIMELINE_GOLDEN === '1';

// A fixed multi-advance fixture exercising pulses, impacts, and both delta signs.
const FIXTURE = {
  pulseHistory: [
    { tick: 4, selectedOutcomes: [
      { severity: 0.8, settlementIds: ['s2', 's1'], populationDeltas: { s1: 50, s2: -20 } },
      { stressor: { severity: 0.6, affectedSettlementIds: ['s4'] } },
    ], impactDigest: [] },
    { tick: 8, selectedOutcomes: [
      { severity: 0.4, settlementIds: ['s1'], populationDeltas: { s1: -10, s3: 5 } },
      { severity: 0.95, settlementIds: ['s3'] },
    ], impactDigest: [{ severity: 0.3, affectedSettlementIds: ['s2', 's5'] }] },
    { tick: 13, selectedOutcomes: [
      { severity: 0.2, settlementIds: ['s4'], populationDeltas: { s4: -100 } },
    ], impactDigest: [] },
  ],
};

const hashOf = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

describe('GOLDEN — V-3 timeline track (pulseHistory → track) → bytes', () => {
  it('the fixture hashes to the committed manifest', () => {
    const track = buildTimelineTrack({ worldState: FIXTURE });
    const record = { hash: hashOf(track), frames: track.frames.length, ticks: track.ticks };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, null, 2) + '\n');
    }
    expect(
      existsSync(MANIFEST),
      'timeline-track-golden.json missing — for an APPROVED derivation change run: UPDATE_TIMELINE_GOLDEN=1 npx vitest run tests/property/timelineTrackGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(record.hash).toBe(pinned.hash);
    expect(record.frames).toBe(pinned.frames);
    expect(record.ticks).toEqual(pinned.ticks);
  });

  it('is reproducible — a second build hashes identically', () => {
    expect(hashOf(buildTimelineTrack({ worldState: FIXTURE }))).toBe(hashOf(buildTimelineTrack({ worldState: FIXTURE })));
  });
});
