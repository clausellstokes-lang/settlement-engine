/** @vitest-environment jsdom */
/**
 * R2-CODE-B item 2 — A BADGE SAYS WHO ADDED THE HOUSE BY THE RECORD'S OWN WORD (the cold list
 * REVIEW-W2A-3, f385d487b: MEDIUM #893 "Hedge wizard YOU Magic", #894 "Teleportation circle YOU
 * Magic" in a city with `config.customInstitutions` empty; the rows' `source` is 'forced' and the
 * isolation pass wrote them, `forcedByIsolation: true`).
 *
 * `source: 'forced'` is written by every generator path that forces a row; the user's hand is
 * `forcedByToggle: true` (assembleInstitutions.js, every toggle path, as the deployed client has
 * stored it since the toggles shipped). Only that row wears "YOU — Added by you".
 */
import { describe, expect, test } from 'vitest';
import { institutionBadge } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('the YOU badge reads the record\'s word for who added the house', () => {
  test('a row the isolation pass forced carries no YOU', () => {
    const b = institutionBadge({ name: 'Hedge wizard', category: 'Magic', source: 'forced', forcedByIsolation: true });
    expect(b.label).not.toBe('YOU');
    expect(b.title).not.toBe('Added by you');
  });

  test('a row the user\'s toggle forced, as the deployed client stores it, wears YOU', () => {
    expect(institutionBadge({ name: 'Hedge Chapel', source: 'forced', forcedByToggle: true }))
      .toEqual(expect.objectContaining({ label: 'YOU', title: 'Added by you' }));
  });

  test('generated isolated towns: no house is badged YOU unless the user forced it', () => {
    const offenders = [];
    let forcedByGenerator = 0;
    for (let i = 0; i < 12; i++) {
      const s = generateSettlementPipeline({ settType: ['city', 'metropolis', 'town'][i % 3], tradeRouteAccess: 'isolated', magicExists: true, priorityMagic: 90 }, null, { seed: `r2b-badge-${i}`, customContent: {} });
      for (const inst of s.institutions || []) {
        if (inst.source === 'forced' && inst.forcedByToggle !== true) forcedByGenerator += 1;
        if (institutionBadge(inst).label === 'YOU' && inst.forcedByToggle !== true) offenders.push(`r2b-badge-${i}: ${inst.name}`);
      }
    }
    expect(forcedByGenerator, 'no generated row was forced by the generator').toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});
