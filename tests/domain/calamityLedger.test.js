/**
 * calamityLedger.test.js — W-UPSWING stage 0d: the dossier's calamity-history read.
 * Proves the display-lazy projection of settlement.calamityHistory (persisted, read by
 * nothing before) into a bucket-neutral dossier ledger with a DM flavor SUGGESTION.
 */
import { describe, expect, it } from 'vitest';
import { buildCalamityLedger, projectCalamityStamp } from '../../src/domain/display/calamityLedger.js';

const stamp = (over) => ({
  type: 'fire', name: 'The Great Calamity of Thornwood, year 12', year: 12, tick: 600,
  deaths: 240, exodus: 900, k: 2, targets: ['Blacksmith', 'Tavern'], ...over,
});

describe('calamityLedger — projectCalamityStamp (one dossier row)', () => {
  it('projects the bucket-neutral title + the DM flavor SUGGESTION (never engine-asserted)', () => {
    const row = projectCalamityStamp(stamp());
    expect(row.title).toBe('The Great Calamity of Thornwood, year 12');
    expect(row.flavorSuggestion).toBe('Great Fire'); // a suggestion, offered separately
    expect(row.deaths).toBe(240);
    expect(row.exodus).toBe(900);
    expect(row.institutionsLost).toBe(2);
    expect(row.targets).toEqual(['Blacksmith', 'Tavern']);
    expect(row.flavorText).toBe(null);
  });

  it('surfaces an optional DM freetext (from a FORCE_CALAMITY authoring)', () => {
    const row = projectCalamityStamp(stamp({ flavorText: 'A dragon razed the market.' }));
    expect(row.flavorText).toBe('A dragon razed the market.');
  });

  it('is total on garbage / partial stamps', () => {
    expect(projectCalamityStamp(null)).toBe(null);
    expect(projectCalamityStamp(undefined)).toBe(null);
    const row = projectCalamityStamp({ year: 5 });
    expect(row.title).toContain('year 5');
    expect(row.deaths).toBe(0);
    expect(row.flavorSuggestion).toBe('Great Calamity'); // unknown hint ⇒ bucket
  });
});

describe('calamityLedger — buildCalamityLedger (the dossier section)', () => {
  it('projects the persisted history newest-first with a summary', () => {
    const settlement = { calamityHistory: [
      stamp({ year: 8, deaths: 100, exodus: 200 }),
      stamp({ year: 20, deaths: 300, exodus: 500 }),
      stamp({ year: 14, deaths: 50, exodus: 90 }),
    ] };
    const ledger = buildCalamityLedger(settlement);
    expect(ledger.count).toBe(3);
    expect(ledger.entries.map((e) => e.year)).toEqual([20, 14, 8]); // newest first
    expect(ledger.lastYear).toBe(20);
    expect(ledger.totalDeaths).toBe(450);
    expect(ledger.totalExodus).toBe(790);
  });

  it('an absent / empty history ⇒ an empty ledger (no dossier section renders)', () => {
    expect(buildCalamityLedger(null)).toEqual({ entries: [], count: 0, lastYear: null, totalDeaths: 0, totalExodus: 0 });
    expect(buildCalamityLedger({})).toEqual({ entries: [], count: 0, lastYear: null, totalDeaths: 0, totalExodus: 0 });
    expect(buildCalamityLedger({ calamityHistory: [] }).count).toBe(0);
  });
});
