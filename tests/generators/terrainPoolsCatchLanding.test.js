/**
 * A CATCH LANDS FROM WATER OR A FISHING LANDING (soak 1000 row 7; chair ruling 3's measured
 * premise). The fish income row read any water-access institution, which admitted the airship
 * override's aerial docks and harbour office (cascadePass.js) and inland Salt works (exempt:
 * inland salt is real, but it lands no catch). It now reads a fishing landing on the roster.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { waterAccessKind } from '../../src/domain/tradeRouteSemantics.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('inland cities with aerial docks or salt works', () => {
  beforeAll(async () => { await ensureLaws(); });
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland place with airship docking or salt works): was 83, 169, 853, then 305 and 109 (each lost its docking or salt works). Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  it('soak1k-1, -289, -11 and -215 land no catch', () => {
    for (const i of [1, 289, 11, 215]) {
      const { settlement: s } = birth(i);
      expect(waterAccessKind(s.config.terrainType, s.config.tradeRouteAccess), `soak1k-${i} is inland`).toBe('none');
      const sources = (s.economicState?.incomeSources || []).map((x) => (typeof x === 'string' ? x : x?.source));
      expect(sources.join(' | '), `soak1k-${i} lands no catch`).not.toMatch(/\bFish\b/);
    }
  });
});
