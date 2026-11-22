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
import { DAILY_LIFE_LOCAL_CRISIS_SCOPED } from '../../../src/components/new/tabs/DailyLifeTab.jsx';

const ledger = (name) => JSON.parse(readFileSync(new URL(`../../../docs/census/declarations/${name}.json`, import.meta.url), 'utf8'));
/** a line the scope can bite: it does not write `crisis: any` (a calm or silent line) */
const holdsCalm = (line) => !(line.crisis === 'any' || (Array.isArray(line.crisis) && line.crisis.includes('any')));
/**
 * the ledger's opted pools that no crisis key guarantees (R-B1 drops the keyed ones) AND that hold a
 * calm line — CENSUS-2f, the chair's R-AH: a pool whose every line writes `crisis: any` has nothing
 * for the flag to protect, so the flag is dropped there (39 inert pools; DEFENSE_CONTEXT's 5 sit on
 * dead text, R-AI, and stay in stasis at its site).
 */
const scopedPools = (name) => ledger(name).pools
  .filter((p) => p.crisisScoped && !(p.poolCrisis && p.poolCrisis.length) && p.lines.some(holdsCalm)).map((p) => p.pool);

describe('unit 1 — the crisis-scoped flags stand only where a calm line is (R-AF, R-AH)', () => {
  it('the arrival tables flag exactly the ledger\'s opted pools that hold a calm line', () => {
    for (const t of ['ARRIVAL_SENSES', 'ARRIVAL_PEOPLE', 'ARRIVAL_TENSIONS', 'ARRIVAL_MEMORIES']) {
      expect([t, [...ARRIVAL_CRISIS_SCOPED[t]]]).toEqual([t, scopedPools(t)]);
    }
    expect(Object.keys(ARRIVAL_CRISIS_SCOPED).sort()).toEqual(['ARRIVAL_MEMORIES', 'ARRIVAL_PEOPLE', 'ARRIVAL_SENSES', 'ARRIVAL_TENSIONS']);
    expect([...ARRIVAL_SCENES_CRISIS_SCOPED]).toEqual(scopedPools('ARRIVAL_SCENES'));
    expect([...ARRIVAL_SCENES_CRISIS_SCOPED]).toEqual(['market', 'ordinary']);
  });
  it('the spatial quarters, the condition archetypes and the quick-guide food clauses flag nothing (every line `crisis: any`)', () => {
    expect(SPATIAL_QUARTER_CRISIS_SCOPED.map((q) => `quarters: ${q}`)).toEqual(scopedPools('SPATIAL_TEXT'));
    expect(CONDITION_ARCHETYPE_CRISIS_SCOPED.map((k) => Object.keys(CONDITION_ARCHETYPE_TEMPLATES).find((a) => CONDITION_ARCHETYPE_TEMPLATES[a].description === k)))
      .toEqual(scopedPools('CONDITION_ARCHETYPE_TEMPLATES'));
    for (const k of CONDITION_ARCHETYPE_CRISIS_SCOPED) expect(Object.prototype.hasOwnProperty.call(CONDITION_ARCHETYPE_SIBLINGS, k)).toBe(true);
    expect(QUICK_GUIDE_CRISIS_SCOPED.length).toBe(scopedPools('QUICK_GUIDE_CLAUSES').length);
    for (const k of QUICK_GUIDE_CRISIS_SCOPED) expect(Object.prototype.hasOwnProperty.call(QUICK_GUIDE_SIBLINGS, k)).toBe(true);
  });
  it('the local Daily Life narrative flags its stress pool only (the no-stress sentence is calm)', () => {
    expect([...DAILY_LIFE_LOCAL_CRISIS_SCOPED]).toEqual(scopedPools('DAILY_LIFE_TAB'));
    expect([...DAILY_LIFE_LOCAL_CRISIS_SCOPED]).toEqual(['localNarrative.stress']);
  });
  it('every flag is frozen (a table, not a mutable switch)', () => {
    for (const l of [ARRIVAL_SCENES_CRISIS_SCOPED, SPATIAL_QUARTER_CRISIS_SCOPED, CONDITION_ARCHETYPE_CRISIS_SCOPED, QUICK_GUIDE_CRISIS_SCOPED, DAILY_LIFE_LOCAL_CRISIS_SCOPED, ...Object.values(ARRIVAL_CRISIS_SCOPED)]) {
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
    expect(reworded?.[0]).not.toMatch(/palisade|militia/); // anchored: the reworded line is found and its declaration pinned on the line above
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
    const p1 = [...found.entries()].find(([k]) => k.startsWith('${food}. Everyone knows their work')); // re-keyed by cause: STYLE-2 SW-4 (A7) reworded the line, its declaration untouched
    // CENSUS-2g unit 3 (the chair's answer 3): + `priest`, re-keyed by cause.
    expect(p1?.[1]).toEqual([{ needs: ['guardPresence', 'priest'], excludes: [], crisis: ['any'] }]);
    expect(found.get('Most residents know whom to petition, and how to do it without drawing notice.')).toEqual([{ needs: [], excludes: ['crisis: succession'], crisis: ['any'] }]);
  });
  it('the anchors fallback names nothing the place must hold (R-W)', () => {
    const src = readFileSync(new URL('../../../src/components/new/tabs/DailyLifeTab.jsx', import.meta.url), 'utf8');
    expect(src).toContain("listText(institutions, 'the wells, the lanes, and the common ground')");
    expect(src).not.toContain('the market, shrine, workshop, and watch post'); // anchored: the new fallback is matched in this same source on the line above
  });
});

import { POLITICAL_FLAVOR, POLITICAL_FLAVOR_CRISIS_SCOPED } from '../../../src/generators/narrativeText.js';
import { declarationOf } from '../../../src/domain/facts/factVocabulary.js';
import { textOf } from '../../../src/domain/facts/textOf.js';
import { setActiveRng } from '../../../src/kernel/rngContext.js';
import { createPRNG } from '../../../src/kernel/prng.js';

describe('POLITICAL_FLAVOR — the cascade\'s rows carry the ledger\'s declarations (R, carried through textOf)', () => {
  /** atoms the row does not write, by cause (recorded in the lane doc) */
  const NOT_WRITTEN = {
    'POLITICAL_FLAVOR.disaster_heavy[4]': ['walls'], // POLITICAL_FLAVOR_SIBLINGS (CENSUS-1c) resolves the walls after the draw
    'POLITICAL_FLAVOR.catastrophic[1].monster_incursion': ['walls', 'militia'], // one branch of the closure
    'POLITICAL_FLAVOR.religious_heavy[0]': ['institution: temple'], // the ledger's temple is a sacred house of any kind (R-AE): written `sacredHouse` (CENSUS-2f unit 5)
    'POLITICAL_FLAVOR.religious_heavy[2]': ['institution: temple'],
  };
  /** atoms the row writes in place of the ledger's, by cause (CENSUS-2f unit 5, R-AE's composite landed at `fc45cc1`) */
  const WRITTEN_FOR = { 'POLITICAL_FLAVOR.religious_heavy[0]': ['sacredHouse'], 'POLITICAL_FLAVOR.religious_heavy[2]': ['sacredHouse'] };
  it('every row declares what its ledger lines say (a closure\'s branches share one row)', () => {
    const want = {};
    for (const pool of ledger('POLITICAL_FLAVOR').pools) for (const line of pool.lines) {
      const m = /^POLITICAL_FLAVOR\.(\w+)\[(\d+)\]/.exec(line.lineId);
      const d = expectedDeclaration(pool, line);
      const skip = NOT_WRITTEN[line.lineId] || [];
      d.needs = [...d.needs.filter((a) => !skip.includes(a)), ...(WRITTEN_FOR[line.lineId] || [])];
      const key = `${m[1]}[${m[2]}]`;
      want[key] = JSON.stringify(d);
    }
    const wrong = Object.entries(want).filter(([k, d]) => {
      const [, pool, i] = /^(\w+)\[(\d+)\]$/.exec(k);
      const have = declarationOf(POLITICAL_FLAVOR[pool][Number(i)]);
      return JSON.stringify({ needs: have.needs, excludes: have.excludes, crisis: have.crisis }) !== d;
    });
    expect(wrong).toEqual([]);
  });
  it('the stable pool is flagged; every row still renders through textOf', () => {
    expect([...POLITICAL_FLAVOR_CRISIS_SCOPED]).toEqual(ledger('POLITICAL_FLAVOR').pools.filter((p) => p.crisisScoped).map((p) => p.pool));
    setActiveRng(createPRNG('census-2e'));
    const events = [{ name: 'the Long Flood', type: 'disaster', severity: 'catastrophic' }, { name: 'the Salt Charter', type: 'economic' }];
    for (const rows of Object.values(POLITICAL_FLAVOR)) for (const row of rows) expect(typeof textOf(row)(events)).toBe('string');
    setActiveRng(null);
  });
});

describe('CHECK_INST_COMPAT_LANDMARKS — the arrival landmarks (R, inline in structuralValidator.js; carried through textOf)', () => {
  it('every declaring ledger line is declared in place, exactly; nothing else is', () => {
    const found = declaredLiteralsOf('src/generators/structuralValidator.js');
    const wrong = []; let declaring = 0;
    for (const pool of ledger('CHECK_INST_COMPAT_LANDMARKS').pools) for (const line of pool.lines) {
      const want = expectedDeclaration(pool, line);
      const have = found.get(line.text);
      if (!(want.needs.length || want.excludes.length || want.crisis.length)) { if (have) wrong.push(`${line.lineId}: declares, the ledger does not`); continue; }
      declaring++;
      if (!have || JSON.stringify(have) !== JSON.stringify([want])) wrong.push(`${line.lineId}: ${JSON.stringify(have)} ≠ ${JSON.stringify(want)}`);
    }
    expect(wrong).toEqual([]);
    expect(declaring).toBe(6);
  });
});

describe('the {colour} rulings (R-R) and the season table under "needs a field" (ruling 8)', () => {
  const src = (rel) => readFileSync(new URL(`../../../${rel}`, import.meta.url), 'utf8');
  it('each ruled table carries its ruling where it lives', () => {
    expect(src('src/generators/power/settlementNarrative.js')).toMatch(/\{colour\} \(CENSUS-2e, R-R; ledger docs\/census\/declarations\/STRESS_RUMORS\.json\)/);
    expect(src('src/generators/historyGenerator.js')).toMatch(/\{colour\} \(CENSUS-2e, R-R and R-AD; ledger ECHO_PREFIXES_DOSSIER\.json\)/);
    expect(src('src/data/biomeTexture.js')).toMatch(/\{colour\} \(CENSUS-2e, R-R; ledger TERRAIN_SEASON_TEXTURE\.json\)/);
    expect(src('docs/content/RECEIPT_POOLS_DOSSIER_STATE.md')).toMatch(/`\{colour\}` \(CENSUS-2e, the chair's R-R; ledger `docs\/census\/declarations\/DOSSIER_CONNECTIVES\.json`\)/);
  });
  it('the season table is a hand-kept "needs a field" row', () => {
    const reg = JSON.parse(src('tests/lint/undeclaredLines.register.json'));
    expect(reg.needsAField.filter((r) => r.where.startsWith('src/data/biomeTexture.js :: TERRAIN_SEASON_TEXTURE') && r.presumes === 'season')).toHaveLength(1);
  });
});
