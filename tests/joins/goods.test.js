import { afterEach, describe, expect, test } from 'vitest';

import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { TRADE_DEPENDENCY_NEEDS } from '../../src/data/economicData.js';
import { GOODS_MODIFIERS_BY_TIER } from '../../src/data/tradeGoodsData.js';
import { customDeps } from '../../src/lib/dependencyEngine.js';
import { generateEconomicState } from '../../src/generators/economicGenerator.js';
import { clearActiveRng, setActiveRng } from '../../src/generators/rngContext.js';

// Join harness: TRADE_DEPENDENCY_NEEDS keys and GOODS_MODIFIERS_BY_TIER
// requiredInstitution fields are free-string joins against the institution
// catalog. Both joins fail SILENTLY at runtime (the dependency/good simply
// never fires), so the catalog name set is asserted here through the same
// matching rules the consumers use:
//
//   - economicGenerator dependency loop: TRADE_DEPENDENCY_NEEDS[inst.name]
//     → EXACT key match required.
//   - getGoodsModifiers gate: w.name === reqInst || w.name.includes(reqInst)
//     → case-sensitive equality-or-substring against generated names, after
//     customDeps.resolveInstitutionRequirement (passthrough for prebuilt names).

/** Every institution name the catalog can generate, across all tiers. */
function catalogNameSet() {
  const names = new Set();
  for (const tierBlock of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tierBlock)) {
      for (const name of Object.keys(category)) names.add(name);
    }
  }
  return names;
}

describe('joins: TRADE_DEPENDENCY_NEEDS keys resolve against the institution catalog', () => {
  test('every dependency key is an exact catalog institution name', () => {
    const names = catalogNameSet();
    const dead = Object.keys(TRADE_DEPENDENCY_NEEDS).filter((k) => !names.has(k));
    expect(dead, `TRADE_DEPENDENCY_NEEDS keys with no catalog producer: ${dead.join(', ')}`).toEqual([]);
  });

  test('remapped phantom keys are present under their real catalog names', () => {
    // These six entries previously used institution names that no catalog tier
    // generates; they must stay keyed to real producers.
    for (const key of [
      'Craft guilds (100-150+)', // was 'Specialist craftsmen quarters'
      'Free company hall', // was 'Mercenary company HQ'
      'Shipyard', // was 'Navy (if coastal)'
      "Sage's quarter", // was 'Sage/library'
      "Caravan masters' exchange", // was 'Stock exchange (early)'
      "Harbour master's office", // was 'Major port'
    ]) {
      expect(TRADE_DEPENDENCY_NEEDS[key], `expected dependency entry for "${key}"`).toBeTruthy();
    }
  });
});

describe('joins: GOODS_MODIFIERS_BY_TIER requiredInstitution resolves against the catalog', () => {
  test('every requiredInstitution matches >=1 catalog name under the matcher rules', () => {
    const names = [...catalogNameSet()];
    const unresolved = [];
    for (const [tier, goods] of Object.entries(GOODS_MODIFIERS_BY_TIER)) {
      for (const [good, def] of Object.entries(goods)) {
        if (!def?.requiredInstitution) continue;
        // Mirror getGoodsModifiers exactly: resolve possible custom refIds,
        // then case-sensitive equality-or-substring against institution names.
        const req = customDeps.resolveInstitutionRequirement(def.requiredInstitution);
        const resolves = names.some((n) => n === req || n.includes(req));
        if (!resolves) unresolved.push(`${tier}/${good} -> "${def.requiredInstitution}"`);
      }
    }
    expect(unresolved, `goods gated on institutions no catalog tier generates: ${unresolved.join('; ')}`).toEqual([]);
  });
});

describe('vocabulary: GOODS_MODIFIERS_BY_TIER entries carry a valid p/on export shape', () => {
  // F30 pin: GOODS_MODIFIERS_BY_TIER is now the SINGLE goods table — the live
  // generator table (getGoodsModifiers), the wizard grid (TradeDynamicsPanel),
  // the EventComposer datalist, and the prebuilt registry all read it. The
  // export good shape is { category, p, on, [requiredInstitution], desc }: a
  // numeric probability p in (0,1] and a boolean default-on flag. getGoodsModifiers
  // gates on `spec.on && _rng() < spec.p`, so a good with a non-numeric p or a
  // non-boolean on silently never rolls (or always rolls) — the exact drift
  // class this file guards. The one deliberate exception is the resource/route
  // BOOST schema (town/Enslaved persons): institution/route boosts instead of a
  // p/on export shape, left inert by getGoodsModifiers (spec.on is undefined).

  const isBoostSpec = (def) =>
    'institutionBoost' in def || 'routeBoost' in def || 'resourceBoost' in def;

  test('every standard good has numeric p in (0,1] and boolean on', () => {
    const offenders = [];
    for (const [tier, goods] of Object.entries(GOODS_MODIFIERS_BY_TIER)) {
      for (const [good, def] of Object.entries(goods)) {
        if (isBoostSpec(def)) continue; // pinned separately below
        const pOk = typeof def.p === 'number' && def.p > 0 && def.p <= 1;
        const onOk = typeof def.on === 'boolean';
        if (!pOk || !onOk) {
          offenders.push(`${tier}/${good} -> p=${JSON.stringify(def.p)}, on=${JSON.stringify(def.on)}`);
        }
      }
    }
    expect(offenders, `goods with an invalid p/on export shape: ${offenders.join('; ')}`).toEqual([]);
  });

  test('the only non-p/on entries are the known boost specs', () => {
    // A new boost-schema (or otherwise shapeless) entry surfaces here for review
    // rather than silently joining the table as an inert good.
    const boostEntries = [];
    for (const [tier, goods] of Object.entries(GOODS_MODIFIERS_BY_TIER)) {
      for (const [good, def] of Object.entries(goods)) {
        if (isBoostSpec(def)) boostEntries.push(`${tier}/${good}`);
      }
    }
    expect(boostEntries).toEqual(['town/Enslaved persons']);
  });

  test('pin is not vacuous (standard goods are actually walked)', () => {
    let n = 0;
    for (const goods of Object.values(GOODS_MODIFIERS_BY_TIER)) {
      for (const def of Object.values(goods)) {
        if (typeof def.p === 'number' && typeof def.on === 'boolean') n++;
      }
    }
    expect(n).toBeGreaterThanOrEqual(40);
  });
});

describe('behavior: repaired joins produce DM-visible output', () => {
  afterEach(() => clearActiveRng());

  test("hamlet with a Fisher's landing gains fish exports and maritime income", () => {
    // rng pinned to 0 → every probability roll passes; output is fully
    // deterministic and the institution gate is the only variable under test.
    setActiveRng({ random: () => 0 });
    const withLanding = generateEconomicState(
      'hamlet',
      [{ name: "Fisher's landing", category: 'Crafts' }],
      'road',
      {},
      { nearbyResources: [] }
    );
    const incomeSources = withLanding.incomeSources.map((i) => i.source);
    expect(incomeSources).toContain('Fish & Maritime Produce');

    // Without the landing the good's institution gate must block the roll.
    setActiveRng({ random: () => 0 });
    const without = generateEconomicState('hamlet', [], 'road', {}, { nearbyResources: [] });
    expect(without.incomeSources.map((i) => i.source)).not.toContain('Fish & Maritime Produce');
  });

  test('Free company hall without local iron/grain reports a trade dependency', () => {
    setActiveRng({ random: () => 0 });
    const state = generateEconomicState(
      'town',
      [{ name: 'Free company hall', category: 'Defense' }],
      'road',
      {},
      { nearbyResources: [] }
    );
    const dep = state.tradeDependencies.find((d) => d.institution === 'Free company hall');
    expect(dep).toBeTruthy();
    expect(dep.resource).toBe('Iron + grain');
    expect(dep.severity).toBe('vulnerable');
  });

  test('Free company hall with local iron+grain has no trade dependency', () => {
    setActiveRng({ random: () => 0 });
    const state = generateEconomicState(
      'town',
      [{ name: 'Free company hall', category: 'Defense' }],
      'road',
      {},
      { nearbyResources: ['iron_deposits', 'grain_fields'] }
    );
    expect(state.tradeDependencies.find((d) => d.institution === 'Free company hall')).toBeUndefined();
  });
});
