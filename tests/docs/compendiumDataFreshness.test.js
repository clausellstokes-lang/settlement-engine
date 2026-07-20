/**
 * tests/docs/compendiumDataFreshness.test.js — THE DRIFT CONTRACT for the Compendium.
 *
 * The public Compendium renders every enumerable and every count from the committed
 * artifact src/domain/compendium/generated/compendiumData.generated.js. This suite
 * is the contract that keeps that artifact honest:
 *
 *   1. BYTE-IDENTITY — the committed file must equal a fresh generation. If a
 *      registry gains/loses an entry and nobody regenerated, this reds.
 *   2. PARITY — the committed COUNTS must equal the LIVE registries' counts, so a
 *      drift gives a specific, named failure (not just "bytes differ").
 *   3. THE OP-WALKER — every registered operation appears in the op-registry render.
 *
 * Regenerate on any red: npm run gen:compendium-data
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

import { buildCompendiumData, DATA_PATH } from '../../scripts/generate-compendium-data.mjs';
import { COMPENDIUM_DATA } from '../../src/domain/compendium/generated/compendiumData.generated.js';

import { SYSTEM_VARIABLES, CAUSAL_BANDS } from '../../src/domain/causalState.js';
import { PRESSURE_KINDS } from '../../src/domain/autonomy/signalRegistry.js';
import { POPULATION_RANGES, TIER_ORDER, PROSPERITY_TIERS } from '../../src/data/constants.js';
import { OPERATIONS, EXEMPT_OPERATIONS } from '../../src/store/operationRegistry.js';
import { DEITY_POOL } from '../../src/generators/data/deityPool.js';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { ARCHETYPES, REL_TYPES } from '../../src/domain/compendium/catalogData.js';
import { APPROVED_CORPUS, CORPUS_KINDS } from '../../src/domain/compendium/corpusStaging.js';

describe('Compendium data — the drift contract', () => {
  it('the committed artifact is byte-identical to a fresh generation', () => {
    const committed = readFileSync(DATA_PATH, 'utf8');
    expect(committed, 'compendiumData.generated.js is stale. Run: npm run gen:compendium-data')
      .toBe(buildCompendiumData());
  });

  it('renders the real causal-variable count (never the stale "14" doc comment)', () => {
    expect(COMPENDIUM_DATA.causal.variableCount).toBe(SYSTEM_VARIABLES.length);
    expect(COMPENDIUM_DATA.causal.variables).toEqual([...SYSTEM_VARIABLES]);
    expect(COMPENDIUM_DATA.causal.bands).toEqual([...CAUSAL_BANDS]);
  });

  it('renders the real pressure count from PRESSURE_KINDS (the "nine pressures")', () => {
    expect(COMPENDIUM_DATA.pressures.count).toBe(PRESSURE_KINDS.length);
    expect(COMPENDIUM_DATA.pressures.kinds).toEqual([...PRESSURE_KINDS]);
  });

  it('renders tier population bands from the engine POPULATION_RANGES (corrected)', () => {
    expect(COMPENDIUM_DATA.tiers.map((t) => t.id)).toEqual([...TIER_ORDER]);
    for (const t of COMPENDIUM_DATA.tiers) {
      expect(t.min, `tier ${t.id} min`).toBe(POPULATION_RANGES[t.id].min);
      expect(t.max, `tier ${t.id} max`).toBe(POPULATION_RANGES[t.id].max);
    }
    expect(COMPENDIUM_DATA.prosperity.tiers).toEqual([...PROSPERITY_TIERS]);
  });

  it('THE OP-WALKER: every registered operation renders, with its class and scope', () => {
    const registered = Object.keys(OPERATIONS);
    expect(COMPENDIUM_DATA.operations.count).toBe(registered.length);
    expect(COMPENDIUM_DATA.operations.exemptCount).toBe(Object.keys(EXEMPT_OPERATIONS).length);
    const rendered = new Set(COMPENDIUM_DATA.operations.entries.map((e) => e.opType));
    for (const opType of registered) {
      expect(rendered.has(opType), `operation "${opType}" is missing from the op-registry render`).toBe(true);
    }
    // Every rendered op carries the honest trust fields (class + scope), never a schema.
    for (const e of COMPENDIUM_DATA.operations.entries) {
      expect(['canon', 'macro', 'mechanical']).toContain(e.klass);
      expect(['save', 'campaign', 'global']).toContain(e.targetScope);
    }
    // The byKlass tally must sum to the total (no op dropped from the histogram).
    const sum = Object.values(COMPENDIUM_DATA.operations.byKlass).reduce((a, b) => a + b, 0);
    expect(sum).toBe(registered.length);
  });

  it('renders the real deity, lens, archetype and relationship counts', () => {
    expect(COMPENDIUM_DATA.deities.count).toBe(DEITY_POOL.length);
    expect(COMPENDIUM_DATA.deities.entries).toHaveLength(DEITY_POOL.length);
    expect(COMPENDIUM_DATA.lenses.count).toBe(TOWN_MAP_STYLE_IDS.length);
    expect(COMPENDIUM_DATA.lenses.entries.map((e) => e.id)).toEqual([...TOWN_MAP_STYLE_IDS]);
    expect(COMPENDIUM_DATA.archetypes.count).toBe(ARCHETYPES.length);
    expect(COMPENDIUM_DATA.relationships.count).toBe(REL_TYPES.length);
  });

  it('renders the corpus block from the OWNER-COMMITTED APPROVED_CORPUS only (V-5)', () => {
    // Parity: the generated corpus count equals the committed canon leaf's length. Staged/
    // rejected candidates live in the runtime store and can NEVER inflate this number —
    // gen:compendium-data reads corpusStaging.js, not the store (the approval boundary).
    expect(COMPENDIUM_DATA.corpus.count).toBe(APPROVED_CORPUS.length);
    expect(COMPENDIUM_DATA.corpus.entries).toHaveLength(APPROVED_CORPUS.length);
    expect(COMPENDIUM_DATA.corpus.kinds).toEqual([...CORPUS_KINDS]);
    expect(COMPENDIUM_DATA.corpus.authored).toBe(true);
    // Every canon entry carries provenance (no anonymous corpus in the compendium).
    for (const e of COMPENDIUM_DATA.corpus.entries) {
      expect(e.provenance && typeof e.provenance.source === 'string').toBe(true);
    }
  });

  it('derives preset-lighting membership from the real preset configs', () => {
    const presetIds = Object.keys(SIMULATION_RULE_PRESETS);
    expect(COMPENDIUM_DATA.presets.map((p) => p.id)).toEqual(presetIds);
    // Each system's preset membership must match the live rule objects exactly.
    for (const sys of COMPENDIUM_DATA.systems) {
      const live = presetIds.filter(
        (id) => (SIMULATION_RULE_PRESETS[id]?.rules || {})[sys.flag] === true,
      );
      expect(sys.presets, `system "${sys.id}" preset membership drifted`).toEqual(live);
    }
  });
});
