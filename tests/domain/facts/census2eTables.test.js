/**
 * CENSUS-2e — Phase B of CENSUS-2 continued (docs/CENSUS_2_LANE_2026-11-04.md "CENSUS-2e").
 *
 * UNIT 1, the chair's answer 4 (R-AF, "flags now, pins at the compose"): a carried table whose
 * ledger pool opted into the crisis dimension SETS the flag where the table lives, so the site's
 * wiring passes `crisisScoped: true` from the table and never from a doc. The flag is the table
 * module's `<…>_CRISIS_SCOPED` list of the ledger's pool names; a pool keyed on a crisis is not
 * scoped (R-B1). The register PIN (`tests/lint/crisisScopedPools.register.json`) is the compose's
 * (R-T), so these lists are held to the LEDGER here, not to the register.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ARRIVAL_CRISIS_SCOPED } from '../../../src/data/arrivalProse.js';
import { ARRIVAL_SCENES_CRISIS_SCOPED } from '../../../src/data/narrativeData.js';
import { SPATIAL_QUARTER_CRISIS_SCOPED } from '../../../src/generators/spatialGenerator.js';
import { CONDITION_ARCHETYPE_CRISIS_SCOPED, CONDITION_ARCHETYPE_SIBLINGS, CONDITION_ARCHETYPE_TEMPLATES } from '../../../src/domain/activeConditions.js';
import { QUICK_GUIDE_CRISIS_SCOPED, QUICK_GUIDE_SIBLINGS } from '../../../src/domain/summary/settlementQuickGuide.js';

const ledger = (name) => JSON.parse(readFileSync(new URL(`../../../docs/census/declarations/${name}.json`, import.meta.url), 'utf8'));
/** the ledger's opted pools that no crisis key guarantees (R-B1 drops the keyed ones) */
const scopedPools = (name) => ledger(name).pools.filter((p) => p.crisisScoped && !(p.poolCrisis && p.poolCrisis.length)).map((p) => p.pool);

describe('unit 1 — the crisis-scoped flags stand on the carried tables (R-AF)', () => {
  it('the arrival tables flag exactly the ledger\'s opted pools', () => {
    for (const t of ['ARRIVAL_SENSES', 'ARRIVAL_PEOPLE', 'ARRIVAL_TENSIONS', 'ARRIVAL_MEMORIES']) {
      expect([t, [...ARRIVAL_CRISIS_SCOPED[t]]]).toEqual([t, scopedPools(t)]);
    }
    expect(Object.keys(ARRIVAL_CRISIS_SCOPED).sort()).toEqual(['ARRIVAL_MEMORIES', 'ARRIVAL_PEOPLE', 'ARRIVAL_SENSES', 'ARRIVAL_TENSIONS']);
    expect([...ARRIVAL_SCENES_CRISIS_SCOPED]).toEqual(scopedPools('ARRIVAL_SCENES'));
  });
  it('the spatial quarters flag the market and religious quarters', () => {
    expect(SPATIAL_QUARTER_CRISIS_SCOPED.map((q) => `quarters: ${q}`)).toEqual(scopedPools('SPATIAL_TEXT'));
  });
  it('the condition archetypes and the quick-guide food clauses flag their sibling sets by key', () => {
    expect(CONDITION_ARCHETYPE_CRISIS_SCOPED.map((k) => Object.keys(CONDITION_ARCHETYPE_TEMPLATES).find((a) => CONDITION_ARCHETYPE_TEMPLATES[a].description === k)))
      .toEqual(scopedPools('CONDITION_ARCHETYPE_TEMPLATES'));
    for (const k of CONDITION_ARCHETYPE_CRISIS_SCOPED) expect(Object.prototype.hasOwnProperty.call(CONDITION_ARCHETYPE_SIBLINGS, k)).toBe(true);
    expect(QUICK_GUIDE_CRISIS_SCOPED.length).toBe(scopedPools('QUICK_GUIDE_CLAUSES').length);
    for (const k of QUICK_GUIDE_CRISIS_SCOPED) expect(Object.prototype.hasOwnProperty.call(QUICK_GUIDE_SIBLINGS, k)).toBe(true);
  });
  it('every flag is frozen (a table, not a mutable switch)', () => {
    for (const l of [ARRIVAL_SCENES_CRISIS_SCOPED, SPATIAL_QUARTER_CRISIS_SCOPED, CONDITION_ARCHETYPE_CRISIS_SCOPED, QUICK_GUIDE_CRISIS_SCOPED, ...Object.values(ARRIVAL_CRISIS_SCOPED)]) {
      expect(Object.isFrozen(l)).toBe(true);
    }
  });
});
