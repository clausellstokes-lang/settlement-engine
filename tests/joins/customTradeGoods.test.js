/**
 * Join harness — config.customTradeGoods: the editor's trade-good events
 * survive regeneration.
 *
 * The seam: ADD/REMOVE_TRADE_GOOD used to write economicState ONLY —
 * derived state that a full regeneration (applyChange) rebuilds from
 * config, silently dropping every authored good and resurrecting every
 * removed one. config.customTradeGoods is the config-level input that
 * closes the loop:
 *
 *   { exports, imports }  authored labels, appended after the chain-derived
 *                         endpoints (applyCustomTradeGoodsConfig in
 *                         generateEconomy), opaque to subsumption and
 *                         gold-tinted via customTradeLabels;
 *   { transit }           entrepôt goods — '<label> (transit)' export form
 *                         plus the un-suffixed transit entry;
 *   { removed }           suppression list, so removing even a
 *                         GENERATOR-derived good stays gone across regens.
 *
 * The events write BOTH formats (depleteResource's dual-format discipline):
 * the live economicState for immediate visibility, and config +_config for
 * the regeneration input — applyChange reads _config first, falling back to
 * the stripped config snapshot, so the key must live in both and must NOT
 * be in DERIVED_CONFIG_KEYS.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { applyCustomTradeGoodsConfig } from '../../src/generators/steps/generateEconomy.js';
import { finalizeTradeLists } from '../../src/generators/steps/economyReconcilePass.js';
import {
  stripDerivedConfigKeys,
  DERIVED_CONFIG_KEYS,
} from '../../src/store/settlementSlice.js';

const NOW = '2026-06-11T00:00:00.000Z';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config
    || stripDerivedConfigKeys(settlement?.config)
    || {}),
});

const ev = (type, overrides = {}) => ({
  id: `ev_${type.toLowerCase()}`,
  type,
  targetId: '',
  payload: {},
  cause: 'player_action',
  ...overrides,
});

const labelOf = (e) => (typeof e === 'string' ? e : String(e?.name || e?.good || e?.label || ''));
const hasLabel = (list, label) =>
  (list || []).some((e) => labelOf(e).toLowerCase() === String(label).toLowerCase());

function deepFreeze(o) {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

// ── 1. applyCustomTradeGoodsConfig — the derivation-side consumer ───────────

describe('applyCustomTradeGoodsConfig', () => {
  test('adds exports/imports/transit with case-insensitive dedupe and gold-tints what it appended', () => {
    const ec = { primaryExports: ['Salted fish'], primaryImports: [], transit: [] };
    applyCustomTradeGoodsConfig(ec, {
      exports: ['Dragonscale wine', 'SALTED FISH'],
      imports: ['Glass beads'],
      transit: ['Saffron'],
      removed: [],
    });
    expect(ec.primaryExports).toEqual(['Salted fish', 'Dragonscale wine', 'Saffron (transit)']);
    expect(ec.primaryImports).toEqual(['Glass beads']);
    expect(ec.transit).toEqual(['Saffron']);
    // Only APPENDED labels are flagged custom — the derived 'Salted fish'
    // keeps its vanilla treatment even though the user re-authored it.
    expect(ec.customTradeLabels.exports).toEqual(['Dragonscale wine', 'Saffron (transit)']);
    expect(ec.customTradeLabels.imports).toEqual(['Glass beads']);
  });

  test('removed suppresses derived labels in every list, base and (transit) forms', () => {
    const ec = {
      primaryExports: ['Iron ore', 'Rare spices (transit)', 'Timber'],
      primaryImports: [{ name: 'Iron ore', good: 'Iron ore' }],
      transit: ['Rare spices'],
    };
    applyCustomTradeGoodsConfig(ec, {
      exports: [], imports: [], transit: [],
      removed: ['Iron ore', 'Rare spices'],
    });
    expect(ec.primaryExports).toEqual(['Timber']);
    expect(ec.primaryImports).toEqual([]);
    expect(ec.transit).toEqual([]);
  });

  test('removal wins over an authored add of the same label', () => {
    const ec = { primaryExports: [], primaryImports: [] };
    applyCustomTradeGoodsConfig(ec, {
      exports: ['Dragonscale wine'], imports: [], transit: [],
      removed: ['Dragonscale wine'],
    });
    expect(ec.primaryExports).toEqual([]);
  });

  test('strict no-op when the config carries no entries (vanilla stays byte-identical)', () => {
    const exportsRef = ['Grain'];
    const ec = { primaryExports: exportsRef, primaryImports: [] };
    applyCustomTradeGoodsConfig(ec, undefined);
    applyCustomTradeGoodsConfig(ec, { exports: [], imports: [], transit: [], removed: [] });
    expect(ec.primaryExports).toBe(exportsRef);
    expect(ec.customTradeLabels).toBeUndefined();
  });

  test('idempotent — economyReconcilePass re-applies it after demand imports', () => {
    const ec = { primaryExports: ['Grain'], primaryImports: ['Salt'], transit: [] };
    const ctg = { exports: ['Dragonscale wine'], imports: [], transit: ['Saffron'], removed: ['Grain'] };
    applyCustomTradeGoodsConfig(ec, ctg);
    const snap = JSON.parse(JSON.stringify(ec));
    applyCustomTradeGoodsConfig(ec, ctg);
    expect(ec).toEqual(snap);
  });
});

// ── 2. finalizeTradeLists gets the final say ────────────────────────────────

describe('finalizeTradeLists(economicState, customTradeGoods)', () => {
  test('a removed label reintroduced by demand imports is filtered; a cap-cut authored import is restored', () => {
    const ec = {
      primaryExports: [],
      // 'Grain' = a demand import re-introducing a removed label;
      // the authored 'Glass beads' was cut by the 10-import cap upstream.
      primaryImports: ['Grain'],
      customTradeLabels: { exports: [], imports: ['Glass beads'] },
    };
    finalizeTradeLists(ec, {
      exports: [], imports: ['Glass beads'], transit: [],
      removed: ['Grain'],
    });
    expect(hasLabel(ec.primaryImports, 'Grain')).toBe(false);
    expect(hasLabel(ec.primaryImports, 'Glass beads')).toBe(true);
  });

  test('without customTradeGoods the legacy single-argument behavior is unchanged', () => {
    const ec = {
      primaryExports: ['Salted fish'],
      primaryImports: ['Iron tools'],
      customTradeLabels: { exports: [], imports: [] },
    };
    finalizeTradeLists(ec);
    expect(hasLabel(ec.primaryExports, 'Salted fish')).toBe(true);
    expect(hasLabel(ec.primaryImports, 'Iron tools')).toBe(true);
  });
});

// ── 3. The pipeline consumes config.customTradeGoods ────────────────────────

describe('join: the pipeline derives authored goods from config.customTradeGoods', () => {
  test('exports/imports/transit all land in the final economicState, gold-tinted', () => {
    const s = gen({
      ...BASE_CFG,
      customTradeGoods: {
        exports: ['Dragonscale wine'],
        imports: ['Glass beads'],
        transit: ['Saffron'],
        removed: [],
      },
    }, 'ctg-pipeline-1');
    const ec = s.economicState;
    expect(hasLabel(ec.primaryExports, 'Dragonscale wine')).toBe(true);
    expect(hasLabel(ec.primaryExports, 'Saffron (transit)')).toBe(true);
    expect(hasLabel(ec.transit, 'Saffron')).toBe(true);
    expect(hasLabel(ec.primaryImports, 'Glass beads')).toBe(true);
    // Gold tint: the dossier matches customTradeLabels by exact label.
    expect(hasLabel(ec.customTradeLabels?.exports, 'Dragonscale wine')).toBe(true);
    expect(hasLabel(ec.customTradeLabels?.imports, 'Glass beads')).toBe(true);
  });
});

// ── 4. The pin: add → regenerate → survives; remove → regenerate → gone ─────

describe('join: ADD/REMOVE_TRADE_GOOD survive a full regeneration', () => {
  const SEED = 'ctg-roundtrip-1';

  test('add → regenerate → the authored good survives; remove → regenerate → it stays gone', () => {
    const s1 = gen(BASE_CFG, SEED);

    const added = mutateSettlement({
      settlement: deepFreeze(s1),
      event: ev('ADD_TRADE_GOOD', {
        targetId: 'Dragonscale wine',
        payload: { direction: 'export', entrepot: false, label: 'Dragonscale wine' },
      }),
      now: NOW,
    });
    // Live write (immediate visibility) + BOTH config formats (regeneration input).
    expect(hasLabel(added.economicState.primaryExports, 'Dragonscale wine')).toBe(true);
    expect(added.config.customTradeGoods.exports).toEqual(['Dragonscale wine']);
    expect(added._config.customTradeGoods.exports).toEqual(['Dragonscale wine']);

    // Full regeneration, exactly as applyChange rebuilds its input.
    const s2 = gen(buildNextConfig(added), SEED);
    expect(hasLabel(s2.economicState.primaryExports, 'Dragonscale wine')).toBe(true);
    expect(hasLabel(s2.economicState.customTradeLabels?.exports, 'Dragonscale wine')).toBe(true);

    // Remove on the REGENERATED settlement, then regenerate again.
    const removed = mutateSettlement({
      settlement: deepFreeze(s2),
      event: ev('REMOVE_TRADE_GOOD', { targetId: 'Dragonscale wine' }),
      now: NOW,
    });
    expect(hasLabel(removed.economicState.primaryExports, 'Dragonscale wine')).toBe(false);
    expect(removed.config.customTradeGoods.exports).toEqual([]);
    expect(removed.config.customTradeGoods.removed).toContain('Dragonscale wine');

    const s3 = gen(buildNextConfig(removed), SEED);
    expect(hasLabel(s3.economicState.primaryExports, 'Dragonscale wine')).toBe(false);
  });

  test('an entrepôt good round-trips through config.customTradeGoods.transit', () => {
    const s1 = gen(BASE_CFG, SEED);
    const added = mutateSettlement({
      settlement: deepFreeze(s1),
      event: ev('ADD_TRADE_GOOD', {
        targetId: 'Saffron',
        payload: { direction: 'export', entrepot: true, label: 'Saffron' },
      }),
      now: NOW,
    });
    expect(added.config.customTradeGoods.transit).toEqual(['Saffron']);

    const s2 = gen(buildNextConfig(added), SEED);
    expect(hasLabel(s2.economicState.primaryExports, 'Saffron (transit)')).toBe(true);
    expect(hasLabel(s2.economicState.transit, 'Saffron')).toBe(true);
  });

  test('removing a GENERATOR-derived good also stays gone (the removed suppression list)', () => {
    const s1 = gen(BASE_CFG, 'ctg-derived-removal-1');
    const target = labelOf((s1.economicState.primaryExports || [])[0]);
    expect(target, 'a town on a road must derive at least one export').toBeTruthy();

    const removed = mutateSettlement({
      settlement: deepFreeze(s1),
      event: ev('REMOVE_TRADE_GOOD', { targetId: target }),
      now: NOW,
    });
    expect(hasLabel(removed.economicState.primaryExports, target)).toBe(false);

    const s2 = gen(buildNextConfig(removed), 'ctg-derived-removal-1');
    expect(hasLabel(s2.economicState.primaryExports, target)).toBe(false);
    expect(hasLabel(s2.economicState.primaryImports, target)).toBe(false);
    expect(hasLabel(s2.economicState.transit, target)).toBe(false);
  });

  test('re-adding a removed good clears its suppression entry (the formats keep agreeing)', () => {
    const s1 = gen(BASE_CFG, SEED);
    const removed = mutateSettlement({
      settlement: deepFreeze(s1),
      event: ev('REMOVE_TRADE_GOOD', { targetId: 'Dragonscale wine' }),
      now: NOW,
    });
    // Unknown label everywhere → pure no-op, no phantom suppression.
    // (mutateSettlement always shallow-copies, so compare one level down.)
    expect(removed.economicState).toBe(s1.economicState);
    expect(removed.config).toBe(s1.config);
    expect(removed.config.customTradeGoods).toBeUndefined();

    const added = mutateSettlement({
      settlement: deepFreeze(mutateSettlement({
        settlement: s1,
        event: ev('ADD_TRADE_GOOD', {
          targetId: 'Dragonscale wine',
          payload: { direction: 'export', label: 'Dragonscale wine' },
        }),
        now: NOW,
      })),
      event: ev('REMOVE_TRADE_GOOD', { targetId: 'Dragonscale wine' }),
      now: NOW,
    });
    expect(added.config.customTradeGoods.removed).toEqual(['Dragonscale wine']);

    const readded = mutateSettlement({
      settlement: deepFreeze(added),
      event: ev('ADD_TRADE_GOOD', {
        targetId: 'Dragonscale wine',
        payload: { direction: 'export', label: 'Dragonscale wine' },
      }),
      now: NOW,
    });
    expect(readded.config.customTradeGoods.removed).toEqual([]);
    expect(readded.config.customTradeGoods.exports).toEqual(['Dragonscale wine']);
    expect(hasLabel(readded.economicState.primaryExports, 'Dragonscale wine')).toBe(true);
  });
});

// ── 5. The slice strip must never eat the new key ───────────────────────────

describe('join: customTradeGoods is user input, not derived config', () => {
  test('stripDerivedConfigKeys preserves customTradeGoods', () => {
    expect(DERIVED_CONFIG_KEYS).not.toContain('customTradeGoods');
    const stripped = stripDerivedConfigKeys({
      stressType: 'plague',
      customTradeGoods: { exports: ['Dragonscale wine'], imports: [], transit: [], removed: [] },
    });
    expect(stripped.stressType).toBeUndefined();
    expect(stripped.customTradeGoods).toEqual({
      exports: ['Dragonscale wine'], imports: [], transit: [], removed: [],
    });
  });
});
