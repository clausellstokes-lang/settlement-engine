/**
 * tests/pdf/campaignPdfLivingWorld.test.js — lib-infra-7.
 *
 * The campaign-level PDF exported only the pre-spatial static world. The new
 * `collectRealmSummary` gathers the living world (chronicle beats, sieges,
 * war-weariness, pantheon, arcs) from the SAME pure read-models the settlement PDF
 * uses, gated on a canonized worldState. Pins: a legacy (pre-pulse) campaign is
 * skipped (byte-identical export), and a living campaign surfaces its realm state.
 */
import { describe, test, expect } from 'vitest';
import { collectRealmSummary } from '../../src/utils/generateCampaignPDF.js';

const saves = [
  { id: 'ashford', name: 'Ashford', settlement: { name: 'Ashford' } },
  { id: 'grimhold', name: 'Grimhold', settlement: { name: 'Grimhold' } },
];

test('a legacy campaign with no canonized world is skipped (present:false)', () => {
  expect(collectRealmSummary({ settlementIds: ['ashford'], worldState: null }, saves))
    .toEqual({ present: false });
  // A draft (canonize not yet run) is likewise skipped.
  expect(collectRealmSummary({ settlementIds: ['ashford'], worldState: { tick: 0 } }, saves).present).toBe(false);
});

test('a canonized but utterly quiet world reports nothing to print (present:false)', () => {
  const quiet = { settlementIds: ['ashford'], worldState: { canonizedAt: '2026-01-01T00:00:00Z', tick: 1 }, wizardNews: { entries: [] } };
  expect(collectRealmSummary(quiet, saves).present).toBe(false);
});

describe('a living campaign surfaces its realm state', () => {
  const living = {
    settlementIds: ['ashford', 'grimhold'],
    wizardNews: { currentTick: 8, entries: [] },
    worldState: {
      canonizedAt: '2026-01-01T00:00:00Z',
      tick: 8,
      warExhaustion: { ashford: 0.82 },
      pantheon: { 'deity:war': { seats: 3, tier: 'major', wins: 2, losses: 0 } },
      disposition: {},
    },
  };

  test('the summary is present and carries the war-weariness + pantheon reads', () => {
    const rs = collectRealmSummary(living, saves);
    expect(rs.present).toBe(true);
    expect(rs.weary.map(w => w.id)).toContain('ashford');
    expect(rs.pantheon.map(p => p.id)).toContain('deity:war');
    // nameFor resolves member ids to display names for the rendered chapter.
    expect(rs.nameFor('grimhold')).toBe('Grimhold');
  });
});
