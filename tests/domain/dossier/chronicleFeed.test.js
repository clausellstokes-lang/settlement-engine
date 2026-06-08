import { describe, it, expect } from 'vitest';
import { buildChronicleFeed } from '../../../src/domain/dossier/chronicleFeed.js';

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
});
