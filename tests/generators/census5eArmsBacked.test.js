/**
 * CENSUS-5e unit 2 (the chair's answer 1 to CENSUS-5d; R-AN, R-U; 2026-11-05): a town's informal
 * military modifier no longer presumes a garrison. `garrison` differs between the power step and the
 * final record on 9 of 2,121 steps (CENSUS-5c's probe), so it is not settled where the modifier is
 * resolved (R-AN: "differs on some birth" is "not settled"). The `MILITARY_MODIFIER_SIBLINGS` set
 * ('garrison-backed' / its twin 'arms-backed') dissolves: every such town reads its twin's wording,
 * which presumes nothing about the garrison, and nothing is noted.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as powerSiblings from '../../src/data/powerSiblings.js';
import * as rulingStructure from '../../src/generators/power/rulingStructure.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

const config = { priorityMilitary: 60, priorityEconomy: 30, priorityReligion: 30, priorityCriminal: 10, priorityMagic: 10, tradeRouteAccess: 'road' };

/** @param {Array<{name: string, category?: string}>} institutions */
function governing(institutions) {
  const { result, ledger } = withPresumptionLedger(() => rulingStructure.generatePowerStructure('town', { prosperity: 'Moderate' }, null, config, institutions));
  const row = (result.factions || []).find((f) => f.isGoverning);
  return { modifier: row?.modifier, ledger: ledger.filter((e) => /MILITARY_MODIFIER/.test(e.pool)) };
}

describe('CENSUS-5e unit 2 · the town military modifier presumes no garrison (R-AN)', () => {
  it('a town with a garrison and one without both read "arms-backed", unnoted', () => {
    for (const roster of [[{ name: 'Garrison', category: 'Defense' }], [{ name: 'Shrine', category: 'Religious' }]]) {
      expect(governing(roster)).toEqual({ modifier: 'arms-backed', ledger: [] });
    }
  });

  it('the declared set is gone from the data module and its re-export; no source spells "garrison-backed"', () => {
    expect('MILITARY_MODIFIER_SIBLINGS' in powerSiblings).toBe(false);
    expect('MILITARY_MODIFIER_SIBLINGS' in rulingStructure).toBe(false);
    for (const f of ['src/generators/power/rulingStructure.js', 'src/data/powerSiblings.js']) {
      expect(readFileSync(f, 'utf8')).not.toContain("'garrison-backed'"); // anchored: readFileSync throws on a vanished file, and both modules are imported live above
    }
  });
});
