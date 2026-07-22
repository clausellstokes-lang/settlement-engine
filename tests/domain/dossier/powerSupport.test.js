/**
 * tests/domain/dossier/powerSupport.test.js
 *
 * The Power tab institution-support web (owner order 2026-07-22). deriveFactionSupport
 * maps each power faction to the institutions that stand behind it, READ-ONLY from
 * the settlement's own generated data. These pins run it over REAL full-pipeline
 * settlements and assert:
 *   - the web is non-empty and deterministic (same settlement -> same web; same
 *     seed -> same web);
 *   - every basis phrase is drawn from the FROZEN finite vocabulary (no free text);
 *   - every `aligned` edge agrees with the shared InstitutionCard backing relation
 *     (institutionBackingFactionName) — the two never diverge;
 *   - every `founded` edge is an exact factionSource match;
 *   - each institution is attributed to AT MOST ONE faction (no double-counting).
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { deriveFactionSupport, SUPPORT_BASIS } from '../../../src/domain/dossier/powerSupport.js';
import { institutionBackingFactionName } from '../../../src/domain/display/institutionProfile.js';
import { nameOf } from '../../../src/domain/rulingPower.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

const CASES = [
  { label: 'city', config: { settType: 'city', culture: 'germanic', terrainOverride: 'hills', tradeRouteAccess: 'road' }, seed: 'support-city' },
  { label: 'town', config: { settType: 'town', terrain: 'river' }, seed: 'support-town' },
  { label: 'village', config: { settType: 'village', terrain: 'grassland', tradeRouteAccess: 'road' }, seed: 'support-village' },
];

// Serialize a support map to a comparable, order-stable structure.
function serialize(map) {
  return [...map.entries()].map(([faction, edges]) => [
    faction,
    edges.map((e) => ({ name: e.name, basis: e.basis, why: e.why })),
  ]);
}

// The finite set of legal basis phrases.
const LEGAL_WHY = new Set([SUPPORT_BASIS.founded, ...Object.values(SUPPORT_BASIS.aligned)]);

describe('deriveFactionSupport — the power support web', () => {
  for (const { label, config, seed } of CASES) {
    test(`${label}: derives a non-empty, well-typed support web`, () => {
      const s = gen(config, seed);
      const map = deriveFactionSupport(s);

      // Every power faction gets a bucket (present even if empty).
      const factionNames = (s.powerStructure?.factions || []).map(nameOf).filter(Boolean);
      for (const fn of factionNames) expect(map.has(fn)).toBe(true);

      // The web is not empty: at least one faction has >= 1 supporting institution.
      const total = [...map.values()].reduce((n, edges) => n + edges.length, 0);
      expect(total).toBeGreaterThan(0);

      // Every edge is well-formed and its `why` is from the FROZEN vocabulary.
      for (const [, edges] of map) {
        for (const e of edges) {
          expect(typeof e.name).toBe('string');
          expect(e.name.length).toBeGreaterThan(0);
          expect(e.basis === 'founded' || e.basis === 'aligned').toBe(true);
          expect(LEGAL_WHY.has(e.why)).toBe(true);
          // F24 copy law: no dashes in the typed phrases.
          expect(/[—–]/.test(e.why)).toBe(false);
        }
      }
    });

    test(`${label}: deterministic — same settlement and same seed yield the same web`, () => {
      const s1 = gen(config, seed);
      // Two derivations over the same settlement are identical.
      expect(serialize(deriveFactionSupport(s1))).toEqual(serialize(deriveFactionSupport(s1)));
      // Regenerating from the same seed yields the same web (generation is
      // deterministic; the derivation is pure).
      const s2 = gen(config, seed);
      expect(serialize(deriveFactionSupport(s2))).toEqual(serialize(deriveFactionSupport(s1)));
    });

    test(`${label}: aligned edges agree with the InstitutionCard backing relation`, () => {
      const s = gen(config, seed);
      const map = deriveFactionSupport(s);
      for (const [faction, edges] of map) {
        for (const e of edges) {
          if (e.basis !== 'aligned') continue;
          // The support web reuses the exact same backing helper, so an aligned
          // institution's backer name IS the faction it is listed under.
          expect(institutionBackingFactionName(e.institution, s)).toBe(faction);
        }
      }
    });

    test(`${label}: founded edges are exact factionSource matches`, () => {
      const s = gen(config, seed);
      const map = deriveFactionSupport(s);
      for (const [faction, edges] of map) {
        for (const e of edges) {
          if (e.basis !== 'founded') continue;
          expect(String(e.institution.factionSource || '').trim().toLowerCase())
            .toBe(faction.trim().toLowerCase());
        }
      }
    });

    test(`${label}: each institution is attributed to at most one faction`, () => {
      const s = gen(config, seed);
      const map = deriveFactionSupport(s);
      const seen = new Map(); // institution object -> count
      for (const [, edges] of map) {
        for (const e of edges) seen.set(e.institution, (seen.get(e.institution) || 0) + 1);
      }
      for (const [, count] of seen) expect(count).toBe(1);
    });
  }

  test('degrades safely on missing / malformed input', () => {
    expect(deriveFactionSupport(undefined).size).toBe(0);
    expect(deriveFactionSupport({}).size).toBe(0);
    expect(deriveFactionSupport({ powerStructure: { factions: [] }, institutions: [] }).size).toBe(0);
    // Factions present, no institutions -> buckets exist but are empty.
    const m = deriveFactionSupport({ powerStructure: { factions: [{ faction: 'A', category: 'economy' }] }, institutions: [] });
    expect(m.get('A')).toEqual([]);
  });

  test('an exact factionSource wins over the category alignment (founded, not aligned)', () => {
    const s = {
      powerStructure: { factions: [
        { faction: 'Merchant Guild', power: 60, category: 'economy' },
        { faction: 'Templars', power: 40, category: 'religious' },
      ] },
      // A market-category institution the Templars are recorded as founding: the
      // exact factionSource must place it under Templars, not the economy backer.
      institutions: [{ name: 'Alms Market', priorityCategory: 'economy', factionSource: 'Templars' }],
    };
    const map = deriveFactionSupport(s);
    expect(map.get('Templars').map((e) => e.name)).toEqual(['Alms Market']);
    expect(map.get('Templars')[0].basis).toBe('founded');
    expect(map.get('Merchant Guild')).toEqual([]);
  });
});
