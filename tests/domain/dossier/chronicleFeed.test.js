import { describe, it, expect } from 'vitest';
import { buildChronicleFeed, selectChronicleContext } from '../../../src/domain/dossier/chronicleFeed.js';

describe('buildChronicleFeed', () => {
  it('merges all sources and tags each entry with a source', () => {
    const feed = buildChronicleFeed({
      manual: [{ id: 'a', type: 'KILL_NPC', appliedAt: '2026-01-02' }],
      worldPulse: [{ id: 'b', title: 'Plague spreads', at: '2026-01-03' }],
      recent: [{ id: 'c', title: 'Founded', at: '2026-01-01' }],
    });
    const byId = Object.fromEntries(feed.map(e => [e.id, e]));
    expect(byId.a.source).toBe('manual');
    expect(byId.b.source).toBe('world');
    expect(byId.c.source).toBe('world');
  });

  it('sorts newest first by timestamp', () => {
    const feed = buildChronicleFeed({
      worldPulse: [
        { id: 'old', title: 'Old', at: '2026-01-01' },
        { id: 'new', title: 'New', at: '2026-03-01' },
        { id: 'mid', title: 'Mid', at: '2026-02-01' },
      ],
    });
    expect(feed.map(e => e.id)).toEqual(['new', 'mid', 'old']);
  });

  it('classifies a party-caused manual event as source "party"', () => {
    const feed = buildChronicleFeed({
      manual: [{ id: 'p', type: 'KILL_NPC', partyCaused: true, appliedAt: '2026-01-05' }],
    });
    expect(feed[0].source).toBe('party');
    expect(feed[0].partyCaused).toBe(true);
  });

  it('reads partyCaused from a nested EventLog entry (.event)', () => {
    const feed = buildChronicleFeed({
      manual: [{ appliedAt: '2026-01-05', event: { id: 'e1', type: 'IMPAIR_FACTION', cause: 'party_action' }, narrativeSummary: 'The guild is weakened.' }],
    });
    expect(feed[0].source).toBe('party');
    expect(feed[0].summary).toBe('The guild is weakened.');
  });

  it('dedupes by id, manual winning over a world duplicate', () => {
    const feed = buildChronicleFeed({
      manual: [{ id: 'dup', type: 'KILL_NPC', partyCaused: true, appliedAt: '2026-01-05' }],
      worldLog: [{ id: 'dup', title: 'Some world echo', at: '2026-01-05' }],
    });
    expect(feed.filter(e => e.id === 'dup')).toHaveLength(1);
    expect(feed.find(e => e.id === 'dup').source).toBe('party');
  });

  it('keeps undated entries after dated ones, in order', () => {
    const feed = buildChronicleFeed({
      worldPulse: [
        { id: 'd1', title: 'Dated', at: '2026-01-01' },
        { id: 'u1', title: 'Undated A' },
        { id: 'u2', title: 'Undated B' },
      ],
    });
    expect(feed.map(e => e.id)).toEqual(['d1', 'u1', 'u2']);
  });

  it('drops empties and respects the limit', () => {
    const many = Array.from({ length: 60 }, (_, i) => ({ id: `e${i}`, title: `E${i}`, at: `2026-01-01T00:00:${String(i).padStart(2, '0')}Z` }));
    const feed = buildChronicleFeed({ worldPulse: [null, {}, ...many] }, { limit: 10 });
    expect(feed).toHaveLength(10);
    expect(feed.every(e => e.title)).toBe(true);
  });

  it('handles empty / missing input', () => {
    expect(buildChronicleFeed()).toEqual([]);
    expect(buildChronicleFeed({})).toEqual([]);
  });

  it('computes relative "Day N" labels from the reference (starting at zero)', () => {
    const feed = buildChronicleFeed({
      worldPulse: [
        { id: 'a', title: 'Canonized', at: '2026-01-01T00:00:00Z' },
        { id: 'b', title: 'Later', at: '2026-01-13T00:00:00Z' },
      ],
    }, { reference: '2026-01-01T00:00:00Z' });
    const byId = Object.fromEntries(feed.map(e => [e.id, e]));
    expect(byId.a.relativeDay).toBe(0);
    expect(byId.a.relativeLabel).toBe('Day 0');
    expect(byId.b.relativeDay).toBe(12);
    expect(byId.b.relativeLabel).toBe('Day 12');
  });

  it('clamps pre-reference entries to Day 0 and leaves undated/no-reference null', () => {
    const before = buildChronicleFeed({ worldPulse: [{ id: 'x', title: 'Before', at: '2025-12-20' }] }, { reference: '2026-01-01' });
    expect(before[0].relativeDay).toBe(0);
    const noRef = buildChronicleFeed({ worldPulse: [{ id: 'y', title: 'Dated', at: '2026-01-01' }] });
    expect(noRef[0].relativeLabel).toBeNull();
    const undated = buildChronicleFeed({ worldPulse: [{ id: 'z', title: 'Undated' }] }, { reference: '2026-01-01' });
    expect(undated[0].relativeLabel).toBeNull();
  });
});

describe('selectChronicleContext', () => {
  const feed = [
    { id: 'n', title: 'Newest world', source: 'world', partyCaused: false, relativeLabel: 'Day 10' },
    { id: 'p', title: 'Party deed', source: 'party', partyCaused: true, relativeLabel: 'Day 8', summary: 'The party broke the siege.' },
    { id: 'e', title: 'An edit', source: 'manual', partyCaused: false, relativeLabel: 'Day 6' },
    { id: 'o1', title: 'Old 1', source: 'world', partyCaused: false, relativeLabel: 'Day 2' },
    { id: 'o2', title: 'Old 2', source: 'world', partyCaused: false, relativeLabel: 'Day 1' },
  ];

  it('returns a compact payload and respects the limit', () => {
    const ctx = selectChronicleContext(feed, { limit: 3 });
    expect(ctx).toHaveLength(3);
    expect(ctx[0]).toHaveProperty('what');
    expect(ctx[0]).toHaveProperty('when');
    expect(ctx[0]).toHaveProperty('source');
  });

  it('keeps party-caused entries even when older (party weighted strongly)', () => {
    const ctx = selectChronicleContext(feed, { limit: 2 });
    expect(ctx.some(c => c.party)).toBe(true);
  });

  it('outputs in chronological (newest-first) order', () => {
    const ctx = selectChronicleContext(feed, { limit: 5 });
    expect(ctx.map(c => c.what)).toEqual(['Newest world', 'Party deed', 'An edit', 'Old 1', 'Old 2']);
  });

  it('handles empty input', () => {
    expect(selectChronicleContext([])).toEqual([]);
    expect(selectChronicleContext()).toEqual([]);
  });
});
