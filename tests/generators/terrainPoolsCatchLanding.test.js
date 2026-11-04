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
  it.each([83, 305, 169, 853])('soak1k-%i lands no catch', (i) => {
    const { settlement: s } = birth(i);
    expect(waterAccessKind(s.config.terrainType, s.config.tradeRouteAccess)).toBe('none');
    const sources = (s.economicState?.incomeSources || []).map((x) => (typeof x === 'string' ? x : x?.source));
    expect(sources.join(' | ')).not.toMatch(/\bFish\b/);
  });
});
