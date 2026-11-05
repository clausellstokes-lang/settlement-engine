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

// ── UNIT 2 — the remaining tables ────────────────────────────────────────────────────────────
import { expectedDeclaration, declaredLiteralsOf } from './census2dTables.test.js';
import { extractSettlementContext } from '../../../src/components/new/dailyLifeLogic.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';

/** @param {string} name @param {string} lineId */
const ledgerLine = (name, lineId) => {
  for (const pool of ledger(name).pools) for (const line of pool.lines) if (line.lineId === lineId) return { pool, line };
  throw new Error(`${lineId} not in ${name}`);
};

describe('DAILY_LIFE_CONTEXT — DEFENSE_CONTEXT declared at CENSUS-1e\'s wired site (enforced)', () => {
  const found = declaredLiteralsOf('src/components/new/dailyLifeLogic.js');
  it('every readiness cell declares the ledger\'s atoms; Defensible is reworded to the watch (R-W)', () => {
    for (const label of ['Fortress', 'Well-Defended', 'Vulnerable', 'Undefended']) {
      const { pool, line } = ledgerLine('DAILY_LIFE_CONTEXT', `DAILY_LIFE_CONTEXT.DEFENSE_CONTEXT['${label}']`);
      expect([label, found.get(line.text)]).toEqual([label, [expectedDeclaration(pool, line)]]);
    }
    const { line } = ledgerLine('DAILY_LIFE_CONTEXT', "DAILY_LIFE_CONTEXT.DEFENSE_CONTEXT['Defensible']");
    expect(found.has(line.text)).toBe(false);
    const reworded = [...found.entries()].find(([k]) => k.startsWith('There are defenses, but nobody'));
    expect(reworded?.[1]).toEqual([{ needs: ['watch'], excludes: ['crisis: threat'], crisis: ['any'] }]);
    expect(reworded?.[0]).not.toMatch(/palisade|militia/);
  });
  it('a Fortress label on a record with no walls prints nothing; Undefended on an open record prints and is noted with its atoms', () => {
    const fort = withPresumptionLedger(() => extractSettlementContext({ tier: 'town', defenseProfile: { readiness: { label: 'Fortress' } } }));
    expect(fort.result.defenseCtx).toBe(null);
    const open = withPresumptionLedger(() => extractSettlementContext({ tier: 'town', defenseProfile: { readiness: { label: 'Undefended' } } }));
    expect(open.result.defenseCtx).toMatch(/^There are no walls, no garrison/);
    expect(open.ledger.filter((e) => e.pool === 'dailyLife:DEFENSE_CONTEXT.Undefended')).toEqual([expect.objectContaining({ drawKind: 'T', resolvedBy: 'drawn', crisisScoped: true })]);
  });
});

describe('DAILY_LIFE_TAB — LOAD_MSGS and the local narrative (carried through textOf)', () => {
  const found = declaredLiteralsOf('src/components/new/tabs/DailyLifeTab.jsx');
  it('the loading messages and the food / order cells declare what the ledger says', () => {
    const ids = ['LOAD_MSGS[1]', 'LOAD_MSGS[2]', 'localNarrative.food[deficit>20]', 'localNarrative.food[deficit>0]', 'localNarrative.food[surplus>10]', 'localNarrative.food[else]',
      'localNarrative.order[>=70]', 'localNarrative.order[>=45]', 'localNarrative.order[else]'];
    for (const id of ids) {
      const { pool, line } = ledgerLine('DAILY_LIFE_TAB', `DAILY_LIFE_TAB.${id}`);
      expect([id, found.get(line.text)]).toEqual([id, [expectedDeclaration(pool, line)]]);
    }
  });
  it('paragraph [1] needs guardPresence (the parked guards stop); paragraph [2]\'s settled-authority sentence denies a succession crisis', () => {
    const p1 = [...found.entries()].find(([k]) => k.startsWith('${food}. Work is divided'));
    expect(p1?.[1]).toEqual([{ needs: ['guardPresence'], excludes: [], crisis: ['any'] }]);
    expect(found.get('Most residents know where authority lives and how to petition it without making themselves memorable.')).toEqual([{ needs: [], excludes: ['crisis: succession'], crisis: ['any'] }]);
  });
  it('the anchors fallback names nothing the place must hold (R-W)', () => {
    const src = readFileSync(new URL('../../../src/components/new/tabs/DailyLifeTab.jsx', import.meta.url), 'utf8');
    expect(src).not.toContain('the market, shrine, workshop, and watch post');
    expect(src).toContain("listText(institutions, 'the wells, the lanes, and the common ground')");
  });
});
