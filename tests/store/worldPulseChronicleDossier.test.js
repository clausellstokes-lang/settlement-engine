/**
 * worldPulseChronicleDossier.test.js
 *
 * Per-settlement chronicle on advance. The reported gap: advancing the campaign
 * world left each member's Library dossier Chronicle tab unchanged, because
 * campaignStateForWorldPulse only stamped { lastTick, lastInterval, updatedAt }
 * and never filled worldPulse.events — the source the dossier feed reads. The fix
 * attributes the world-pulse news that NAMES a settlement onto that save's own
 * worldPulse.events, so its Chronicle records what the autonomous world did to it.
 *
 * Contract:
 *   1. events carry the news rows whose settlementIds include this save, mapped to
 *      the dossier feed shape (title from headline, `at` from the threaded now).
 *   2. rows that name a DIFFERENT settlement, and PENDING proposals (kind 'queued'),
 *      are excluded.
 *   3. re-advancing appends only genuinely-new rows (dedupe by id), keeping prior
 *      rows' timestamps; the list is capped.
 *   4. the events flow through buildChronicleFeed as 'World'-tagged rows.
 */
import { describe, expect, test } from 'vitest';
import { campaignStateForWorldPulse } from '../../src/store/campaignPulseHelpers.js';
import { buildChronicleFeed } from '../../src/domain/dossier/chronicleFeed.js';

const STATE = { activeSaveId: null, phase: 'canon' };

function resultWith(entries, { tick = 5, interval = 'one_week' } = {}) {
  return { tick, interval, wizardNews: { currentTick: tick, entries } };
}

describe('campaignStateForWorldPulse — per-settlement chronicle', () => {
  test('attributes the news naming this save; drops others + pending proposals', () => {
    const save = { id: 's1', campaignState: {} };
    const result = resultWith([
      { id: 'wn1', kind: 'applied', settlementIds: ['s1'], headline: 'The river flooded the lower ward', summary: 'Granaries soaked.' },
      { id: 'wn2', kind: 'applied', settlementIds: ['s2'], headline: 'A distant coronation', summary: 'Not ours.' },
      { id: 'wn3', kind: 'queued', settlementIds: ['s1'], headline: 'A plot the DM has not approved', summary: 'Pending.' },
    ]);

    const cs = campaignStateForWorldPulse(STATE, save, null, 1000, result);

    expect(cs.worldPulse.lastTick).toBe(5);
    expect(cs.worldPulse.events).toEqual([
      { id: 'wn1', title: 'The river flooded the lower ward', summary: 'Granaries soaked.', at: 1000, kind: 'applied' },
    ]);
    // s2's row and the queued proposal are both absent.
    const ids = cs.worldPulse.events.map(e => e.id);
    expect(ids).not.toContain('wn2');
    expect(ids).not.toContain('wn3');
  });

  test('re-advance appends only new rows; prior rows keep their original `at`', () => {
    const save = {
      id: 's1',
      campaignState: { worldPulse: { events: [{ id: 'wn1', title: 'Tick-1 event', summary: '', at: 1000, kind: 'applied' }] } },
    };
    // The feed is cumulative, so it still carries wn1 plus a new wn4.
    const result = resultWith([
      { id: 'wn1', kind: 'applied', settlementIds: ['s1'], headline: 'Tick-1 event', summary: '' },
      { id: 'wn4', kind: 'applied', settlementIds: ['s1'], headline: 'Tick-2 event', summary: 'Newer.' },
    ], { tick: 7 });

    const cs = campaignStateForWorldPulse(STATE, save, null, 2000, result);

    expect(cs.worldPulse.events).toHaveLength(2);
    // wn1 kept its tick-1 timestamp; wn4 got this advance's timestamp.
    expect(cs.worldPulse.events.find(e => e.id === 'wn1').at).toBe(1000);
    expect(cs.worldPulse.events.find(e => e.id === 'wn4').at).toBe(2000);
  });

  test('caps the persisted per-save chronicle so it cannot grow without bound', () => {
    const prior = Array.from({ length: 60 }, (_, i) => ({ id: `old${i}`, title: `e${i}`, summary: '', at: 1, kind: 'applied' }));
    const save = { id: 's1', campaignState: { worldPulse: { events: prior } } };
    const result = resultWith([
      { id: 'newA', kind: 'applied', settlementIds: ['s1'], headline: 'Fresh A', summary: '' },
      { id: 'newB', kind: 'applied', settlementIds: ['s1'], headline: 'Fresh B', summary: '' },
    ]);

    const cs = campaignStateForWorldPulse(STATE, save, null, 3000, result);

    expect(cs.worldPulse.events.length).toBeLessThanOrEqual(60);
    // The newest rows survive; the oldest were dropped.
    const ids = cs.worldPulse.events.map(e => e.id);
    expect(ids).toContain('newA');
    expect(ids).toContain('newB');
    expect(ids).not.toContain('old0');
  });

  test('the events surface as World-tagged rows through the dossier feed', () => {
    const save = { id: 's1', campaignState: {} };
    const result = resultWith([
      { id: 'wn1', kind: 'applied', settlementIds: ['s1'], headline: 'A siege was lifted', summary: 'The host withdrew.' },
    ]);
    const cs = campaignStateForWorldPulse(STATE, save, null, 1000, result);

    const feed = buildChronicleFeed({ worldPulse: cs.worldPulse.events });
    const row = feed.find(r => r.id === 'wn1');
    expect(row).toBeTruthy();
    expect(row.source).toBe('world');
    expect(row.title).toBe('A siege was lifted');
  });
});
