/**
 * importTableEvents.test.js — V-17 THE CAMPAIGN IMPORT commit path.
 *
 * The store action appends confirmed typed records to the campaign's news feed as
 * source:'table' history at each record's chosen tick; flavor stays display-only;
 * world-authored entries stay byte-identical (the source passthrough is neutral).
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve(true)), isConfigured: false },
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { buildTableEvent } from '../../src/domain/tableEvents.js';
import { ensureWizardNewsFeed, appendWizardNewsEntries } from '../../src/domain/region/index.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({ savedSettlements: [], activeSaveId: null });

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a) })));
}

function seedCampaign(store) {
  store.setState(state => {
    state.campaigns = [{
      id: 'camp1',
      name: 'The Long Winter',
      settlementIds: ['ashford'],
      wizardNews: { schemaVersion: 1, currentTick: 20, entries: [], updatedAt: '2026-01-01T00:00:00.000Z' },
      worldState: { tick: 20 },
      updatedAt: '2026-01-01T00:00:00.000Z',
    }];
    state.activeCampaignId = 'camp1';
  });
}

describe('importTableEvents store action', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('appends confirmed records as source:table news at their chosen ticks', () => {
    const store = makeStore();
    seedCampaign(store);
    const records = [
      buildTableEvent({ kind: 'incident', band: 'major', tick: 3, targets: { settlementIds: ['ashford'] }, flavor: 'the harvest failed', index: 0 }),
      buildTableEvent({ kind: 'stressor-relief', band: 'moderate', tick: 8, targets: { settlementIds: ['ashford'] }, flavor: 'the party bought grain from the south', index: 1 }),
    ];
    const n = store.getState().importTableEvents('camp1', records);
    expect(n).toBe(2);

    const feed = store.getState().campaigns[0].wizardNews;
    const table = feed.entries.filter(e => e.source === 'table');
    expect(table).toHaveLength(2);
    // Placed at the chosen ticks.
    expect(table.map(e => e.tick).sort((a, b) => a - b)).toEqual([3, 8]);
    // source:'table' provenance + typed impactKind so the soak can exclude them.
    expect(table.every(e => e.source === 'table')).toBe(true);
    expect(table.some(e => e.impactKind === 'table_incident')).toBe(true);
  });

  test('flavor is display-only: it lands in summary, NEVER in the headline or a mechanical field', () => {
    const store = makeStore();
    seedCampaign(store);
    const rec = buildTableEvent({ kind: 'exposure', band: 'minor', tick: 5, flavor: 'the steward embezzled the tithe', index: 0 });
    store.getState().importTableEvents('camp1', rec ? [rec] : []);
    const entry = store.getState().campaigns[0].wizardNews.entries.find(e => e.source === 'table');
    expect(entry.summary).toBe('the steward embezzled the tithe'); // verbatim flavor
    expect(entry.headline).not.toContain('embezzled');              // headline is typed-only
    expect(entry.headline).toMatch(/Exposure/);
    expect(entry.significance).toBe('notable');                     // from band, not text
  });

  test('empty / no records is a no-op (returns 0, feed unchanged)', () => {
    const store = makeStore();
    seedCampaign(store);
    const before = JSON.stringify(store.getState().campaigns[0].wizardNews);
    expect(store.getState().importTableEvents('camp1', [])).toBe(0);
    expect(JSON.stringify(store.getState().campaigns[0].wizardNews)).toBe(before);
  });

  test('a missing campaign is a safe no-op', () => {
    const store = makeStore();
    seedCampaign(store);
    const rec = buildTableEvent({ kind: 'incident', band: 'minor', tick: 1, index: 0 });
    expect(store.getState().importTableEvents('nope', [rec])).toBe(0);
  });
});

describe('wizardNews source passthrough is BYTE-NEUTRAL for world-authored entries', () => {
  test('a world entry (no source) normalizes identically before and after the change', () => {
    // A world-generated raw entry never carries `source`; the normalized entry must
    // have NO `source` key, so existing feeds serialize byte-identically.
    const feed = appendWizardNewsEntries(
      { schemaVersion: 1, currentTick: 0, entries: [] },
      [{ id: 'w1', tick: 2, headline: 'A hard winter', summary: 'grain ran short', significance: 'notable' }],
      { now: '2026-01-01T00:00:00.000Z' },
    );
    const entry = feed.entries.find(e => e.id === 'w1');
    expect(entry).toBeTruthy();
    expect('source' in entry).toBe(false); // no source key on world entries
  });

  test('a table entry preserves source:table through normalization', () => {
    const feed = ensureWizardNewsFeed({
      schemaVersion: 1, currentTick: 0,
      entries: [{ id: 't1', tick: 4, headline: 'Relief at the table (major)', summary: 'saved', source: 'table' }],
    });
    expect(feed.entries.find(e => e.id === 't1').source).toBe('table');
  });
});
