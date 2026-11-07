/**
 * RUNG-2 LANDING phase D, unit 2 (the chair's R-D1; R-AU at the site): a sibling set is resolved
 * only where it prints. `buildGovernanceLabels` resolves the baseline conflict's sibling set
 * (`BASELINE_CONFLICT_SIBLINGS`) only where the baseline line is returned — no primary-stress
 * narrative, or the `infiltrated` narrative that carries it. A site the primary stress's narrative
 * overrides does not draw the set and writes no note. Rung 2E's `soak1k-5589`: the siege narrative
 * overwrote the baseline three times (the power step, `powerEconomyReconcilePass`, assembly) and the
 * three resolutions left three 'no soldiers' notes for a line that never printed.
 */
import { describe, expect, it } from 'vitest';
import { buildGovernanceLabels } from '../../src/generators/power/governanceNarrative.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { presumptionFindings } from '../../src/domain/facts/presumptionCheck.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const POOL = 'governanceNarrative:BASELINE_CONFLICT_SIBLINGS';
// The merchant-army baseline (a soldiers line, declared) in a town with a guild and a hired company.
const INPUT = {
  factions: [{ faction: 'Merchant Guilds', isGoverning: true }],
  config: { monsterThreat: 'frontier' },
  stressFlags: { merchantArmy: true },
  instFlags: { criminalEffective: 20, militaryEffective: 45, economyOutput: 50, religionInfluence: 30 },
  neighbourRelationship: null,
  instNames: ['merchant guild', 'mercenary company'],
  priorities: { military: 50, economy: 50 },
  tier: 'town',
  governingFaction: 'Merchant Guilds',
  hasNobleInstitution: false,
  fallbackStressType: null,
};
const run = (/** @type {string[]} */ stressTypes) => withPresumptionLedger(() => buildGovernanceLabels({ ...INPUT, stressTypes }));
const baselineNotes = (/** @type {any[]} */ ledger) => ledger.filter((e) => e.pool === POOL);

describe('R-D1 unit 2: the baseline conflict is resolved only where it prints', () => {
  it('no primary stress: the baseline prints, and its resolution is noted', () => {
    const { result, ledger } = run([]);
    expect(result.recentConflict).toMatch(/arrested a rival's factor/);
    expect(baselineNotes(ledger)).toHaveLength(1);
  });

  it('infiltrated carries the baseline: it prints, and its resolution is noted', () => {
    const { result, ledger } = run(['infiltrated']);
    expect(result.recentConflict).toMatch(/arrested a rival's factor/);
    expect(baselineNotes(ledger)).toHaveLength(1);
  });

  it('a siege narrative overrides the baseline: the set is not drawn and writes no note', () => {
    const { result, ledger } = run(['under_siege']);
    expect(result.recentConflict).toMatch(/^The settlement is under active siege\./);
    expect(baselineNotes(ledger)).toEqual([]);
  });

  it('soak1k-5589: no baseline-conflict note survives the siege', async () => {
    await ensureLaws();
    const born = withPresumptionLedger(() => birth(5589));
    const findings = presumptionFindings(born.result.settlement, born.ledger);
    expect(findings.map((p) => `${p.pool} #${p.lineId}: ${p.atom}`)).toEqual([]);
  }, 120_000);
});
