/**
 * versionsTab.test.js — Contract over the pure timeline-builder.
 *
 * VersionsTab renders an interactive timeline; the pure
 * `buildVersionTimeline()` extracts entries from a save's campaignState
 * + versionHistory. Tested in isolation here.
 */

import { describe, it, expect } from 'vitest';
import { buildVersionTimeline } from '../../src/components/settlement/VersionsTab.jsx';

describe('buildVersionTimeline', () => {
  it('null / empty input → empty array', () => {
    expect(buildVersionTimeline(null)).toEqual([]);
    expect(buildVersionTimeline({})).toEqual([]);
  });

  it('extracts lifecycle entries from campaignState', () => {
    const save = {
      savedAt: '2024-03-01T12:00:00Z',
      campaignState: {
        editedAt:     '2024-03-05T12:00:00Z',
        canonizedAt:  '2024-03-04T12:00:00Z',
        lastExportAt: '2024-03-03T12:00:00Z',
      },
    };
    const entries = buildVersionTimeline(save);
    // Recent-first sort
    expect(entries[0].kind).toBe('edit');
    expect(entries[0].label).toMatch(/edited/i);
    expect(entries.find(e => e.kind === 'canonize')).toBeTruthy();
    expect(entries.find(e => e.kind === 'export')).toBeTruthy();
    expect(entries.find(e => e.kind === 'save')).toBeTruthy();
  });

  it('explicit snapshots come through with revertable=true', () => {
    const save = {
      versionHistory: [
        { id: 'snap1', ts: '2024-03-10T12:00:00Z', label: 'Pre-session 3', snapshot: { foo: 1 } },
      ],
    };
    const entries = buildVersionTimeline(save);
    expect(entries.length).toBe(1);
    expect(entries[0].kind).toBe('snapshot');
    expect(entries[0].revertable).toBe(true);
    expect(entries[0].snapshot).toEqual({ foo: 1 });
  });

  it('snapshots sort by ts most-recent first', () => {
    const save = {
      versionHistory: [
        { id: 's1', ts: '2024-03-01T00:00:00Z', label: 'old' },
        { id: 's2', ts: '2024-03-10T00:00:00Z', label: 'new' },
        { id: 's3', ts: '2024-03-05T00:00:00Z', label: 'mid' },
      ],
    };
    const entries = buildVersionTimeline(save);
    expect(entries.map(e => e.id)).toEqual(['s2', 's3', 's1']);
  });

  it('lifecycle entries are non-revertable', () => {
    const save = { campaignState: { editedAt: '2024-03-05T12:00:00Z' } };
    const entries = buildVersionTimeline(save);
    expect(entries[0].revertable).toBe(false);
  });

  it('combines snapshots + lifecycle in sort order', () => {
    const save = {
      savedAt: '2024-03-01T00:00:00Z',
      campaignState: { editedAt: '2024-03-08T00:00:00Z' },
      versionHistory: [
        { id: 'snap', ts: '2024-03-10T00:00:00Z', label: 'Manual snapshot' },
      ],
    };
    const entries = buildVersionTimeline(save);
    // Most-recent first: snapshot → edit → save
    expect(entries[0].kind).toBe('snapshot');
    expect(entries[1].kind).toBe('edit');
    expect(entries[2].kind).toBe('save');
  });
});
