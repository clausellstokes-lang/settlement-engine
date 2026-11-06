/**
 * RUNG-2 LANDING phase E, R-E2: the power structure's passes replace their notes as the economy's
 * do. The power structure is derived three times (the generatePower step, then
 * `reconcilePowerStructure` at powerEconomyReconcilePass and again at assembly with the defense
 * label), and each pass runs through `projectPowerGenerationIntent`. Phase D's `withLedgerBlock`
 * gave the economy one note set; the power projection now runs as the `powerStructure` block, so a
 * later pass replaces the earlier pass's notes instead of adding to them.
 */
import { describe, expect, it } from 'vitest';

import {
  createPowerGenerationIntent,
  projectPowerGenerationIntent,
  reconcilePowerStructure,
} from '../../../src/generators/power/economyReconciliation.js';
import { createPRNG } from '../../../src/kernel/prng.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';

const intent = () => createPowerGenerationIntent({
  stepRng: createPRNG('r-e2'), tier: 'town', neighbourRelationship: null, config: {},
  institutions: [{ name: 'Town Council', category: 'government' }], stressEntries: [{ type: 'under_siege' }],
});
/** @param {Array<{ pool: string, lineId: unknown }>} ledger */
const lines = (ledger) => ledger.map((e) => `${e.pool} #${String(e.lineId)}`);

describe('R-E2: the ledger holds one power note set', () => {
  it('two passes leave the notes of one, tagged with the power block', () => {
    const planted = intent();
    const once = withPresumptionLedger(() => projectPowerGenerationIntent(planted, {})).ledger;
    expect(once.length).toBeGreaterThan(0);
    const twice = withPresumptionLedger(() => {
      projectPowerGenerationIntent(planted, {});
      projectPowerGenerationIntent(planted, {});
    }).ledger;
    expect(lines(twice)).toEqual(lines(once));
    expect(twice.every((e) => e.block === 'powerStructure')).toBe(true);
  });

  it('the step\'s pass and both reconciliations leave one note set', () => {
    const planted = intent();
    const once = withPresumptionLedger(() => projectPowerGenerationIntent(planted, {})).ledger;
    const three = withPresumptionLedger(() => {
      const ps = projectPowerGenerationIntent(planted, {});
      reconcilePowerStructure(ps, {}, planted);
      reconcilePowerStructure(ps, {}, planted, { defenseLabel: 'Weak' });
    }).ledger;
    expect(lines(three)).toEqual(lines(once));
  });
});
