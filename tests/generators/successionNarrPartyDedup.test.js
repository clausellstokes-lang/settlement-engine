/**
 * tests/generators/successionNarrPartyDedup.test.js
 *
 * genSuccessionNarr's pair templates interpolated govFaction and topFaction
 * independently, but upstream (genPressureDetail) topFaction falls back to
 * govFaction, and the governing faction is often also the most powerful
 * (factions[0]) — so both slots could resolve to the same display name and a
 * town rendered "Corrupt Council and Corrupt Council disagree about who bears
 * the cost." Fix: resolvePartyPair dedupes by resolved display name
 * (case-insensitive, fallbacks included) and the four gov/top pair templates
 * switch to a single-party phrasing when only one distinct party exists.
 */
import { describe, expect, test } from 'vitest';

import { genSuccessionNarr } from '../../src/generators/power/settlementNarrative.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const baseCtx = {
  name: 'Treheath',
  tier: 'town',
  prosperity: 'Moderate',
  stability: 'Stable',
  topTension: null,
  isViable: true,
  viabilityIssues: [],
};

const findLine = (narratives, marker) => narratives.find(n => n.includes(marker));

describe('genSuccessionNarr party-pair dedup', () => {
  test('poor-settlement sentence never names the same party twice', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      prosperity: 'Poor',
      govFaction: 'Corrupt Council',
      topFaction: 'Corrupt Council',
    });
    const line = findLine(narratives, 'every resource decision is a political one');
    expect(line).toBeTruthy();
    // The single-party phrasing is what the dedup produces INSTEAD of the doubled name,
    // so it is the anchor: a template that stopped rendering this sentence reds here
    // rather than passing the doubled-name exclusion on a missing line.
    expectAbsentWithAnchor(
      line,
      'Corrupt Council and Corrupt Council',
      'Corrupt Council decides who bears the cost',
      'poor-settlement sentence collapses to one party',
    );
    expect(line).toContain('Corrupt Council decides who bears the cost');
  });

  test('poor-settlement sentence keeps the two-party phrasing when parties differ', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      prosperity: 'Poor',
      govFaction: 'Corrupt Council',
      topFaction: 'Merchant Houses',
    });
    const line = findLine(narratives, 'every resource decision is a political one');
    expect(line).toContain('Corrupt Council and Merchant Houses disagree about who bears the cost');
  });

  test('dedup compares resolved names case-insensitively', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      prosperity: 'Poor',
      govFaction: 'Corrupt Council',
      topFaction: 'corrupt council',
    });
    const line = findLine(narratives, 'every resource decision is a political one');
    // The case-insensitive dedup keeps the govFaction spelling and collapses to the
    // single-party phrasing; asserting that first proves the sentence rendered at all.
    expect(line).toContain('Corrupt Council decides who bears the cost');
    // anchored: the single-party phrasing assertion above proves `line` is live prose
    expect(line).not.toMatch(/corrupt council and corrupt council/i);
  });

  test('dedup applies after fallbacks resolve (missing govFaction vs literal "the council")', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      prosperity: 'Poor',
      govFaction: null,
      topFaction: 'the council',
    });
    const line = findLine(narratives, 'every resource decision is a political one');
    expectAbsentWithAnchor(
      line,
      'the council and the council',
      'the council decides who bears the cost',
      'dedup after fallback resolution collapses to one party',
    );
    expect(line).toContain('the council decides who bears the cost');
  });

  test('contested-stability sentence collapses to a single party on collision', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      stability: 'Unstable',
      govFaction: 'Corrupt Council',
      topFaction: 'Corrupt Council',
    });
    const line = findLine(narratives, 'looks stable from the outside');
    expect(line).toBeTruthy();
    expectAbsentWithAnchor(
      line,
      'Corrupt Council and Corrupt Council',
      "Corrupt Council's hold on that stability",
      'contested-stability sentence collapses to one party',
    );
    expect(line).toContain("Corrupt Council's hold on that stability");
  });

  test('economic-disparity sentence collapses to a single party on collision', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      topTension: 'economic_disparity',
      govFaction: 'Merchant Houses',
      topFaction: 'Merchant Houses',
    });
    const line = findLine(narratives, 'wealth gap');
    expect(line).toBeTruthy();
    expectAbsentWithAnchor(
      line,
      'Merchant Houses controls the surplus and Merchant Houses',
      'controls the surplus and will not redistribute it',
      'economic-disparity sentence collapses to one party',
    );
    expect(line).toContain('controls the surplus and will not redistribute it');
  });

  test('resource-scarcity sentence collapses to a single party on collision', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      topTension: 'resource_scarcity',
      commodity: 'grain',
      govFaction: 'Corrupt Council',
      topFaction: 'Corrupt Council',
    });
    const line = findLine(narratives, 'supply is tighter than the official position');
    expect(line).toBeTruthy();
    expectAbsentWithAnchor(
      line,
      'has been told a different version',
      'Corrupt Council knows the real numbers and has kept them close',
      'resource-scarcity sentence drops the second-party clause on collision',
    );
    expect(line).toContain('Corrupt Council knows the real numbers and has kept them close');
  });

  test('resource-scarcity sentence keeps both parties when they differ', () => {
    const narratives = genSuccessionNarr({
      ...baseCtx,
      topTension: 'resource_scarcity',
      commodity: 'grain',
      govFaction: 'The town council',
      topFaction: 'Merchant Houses',
    });
    const line = findLine(narratives, 'supply is tighter than the official position');
    expect(line).toContain('Merchant Houses knows the real numbers');
    expect(line).toContain('The town council has been told a different version');
  });
});
