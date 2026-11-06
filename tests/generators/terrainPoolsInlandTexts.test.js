/**
 * INLAND TEXTS AUTHORED UNDER THE OWNER'S DELEGATION (2026-11-04: "i leave everything ot your
 * judgemetn"). Where the record's water fact is 'none' and a row's whole pool speaks of water,
 * the row takes its inland text (src/data/inlandDescriptions.js); the Greek culture line takes
 * its harbourless form.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { INLAND_DESCRIPTIONS } from '../../src/data/inlandDescriptions.js';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('inland texts on their seeds', () => {
  beforeAll(async () => { await ensureLaws(); });
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland village with a Fish market): was 176, 104. Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  it.each([116, 152])('soak1k-%i: the village Fish market sells salted fish, not the day\'s catch', (i) => {
    const s = birth(i).settlement;
    const market = s.institutions.find((x) => x.name === 'Fish market');
    expect(market.desc).toBe(INLAND_DESCRIPTIONS['village|Economy|Fish market']);
  });
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland place with an Auction house): was 111, 113.
  it.each([11, 28])('soak1k-%i: the Auction house sells no ships', (i) => {
    const s = birth(i).settlement;
    expect(s.institutions.find((x) => x.name === 'Auction house').desc).toMatch(/\S/);
    expect(s.institutions.find((x) => x.name === 'Auction house').desc).not.toMatch(/\bships?\b/i); // anchored: the line above proves the Auction house desc is live text
  });
});

describe('the Greek line inland', () => {
  it('keeps the agora and drops the harbour', () => {
    const line = cultureScopeLine({ culturalIdentity: { key: 'greek', label: 'Greek-inspired' }, config: { terrainType: 'plains', tradeRouteAccess: 'road' } });
    expect(line).toBe('Greek-inspired, built around the agora, on hillside ground and civic association.');
  });
});
