/**
 * CENSUS-1i unit 1 (R-AW, the chair's ruling of 2026-11-05 08:3x): a label resolved by an unsettled
 * fact is resolved where the fact settles. The "Military/Guard" faction label is pushed at the power
 * step, where `guardPresence` is not settled (R-AN: 1 of 363 holders differs); no roll moves — the
 * declared label row (`data/factionLabelSiblings.js`, CENSUS-4f) resolves against the FINAL record
 * at the birth's close, and its twin "Military Party" replaces the label in every copy of the name
 * (the converged faction rename cascade) where the record holds no enforcement body.
 */
import { describe, expect, it } from 'vitest';
import { resolveFactionLabelsAtClose } from '../../src/generators/power/factionLabelClose.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { presumptionFindings } from '../../src/domain/facts/presumptionCheck.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const fixture = (/** @type {any[]} */ institutions) => ({
  tier: 'town',
  institutions,
  npcs: [{ name: 'Ada Vell', role: 'Officer', factionAffiliation: 'Military/Guard' }],
  powerStructure: {
    factions: [{ faction: 'Military/Guard', power: 30, desc: 'Officers.' }, { faction: 'Merchant Guilds', power: 70, desc: 'Rivals of the Military/Guard.' }],
    conflicts: [{ parties: ['Merchant Guilds', 'Military/Guard'], issue: 'Tolls' }],
  },
});

describe('R-AW: the Military/Guard label resolves at the birth\'s close (CENSUS-1i unit 1)', () => {
  it('(a) no enforcement body on the final record: every copy of the label reads the twin', () => {
    const s = fixture([{ name: 'Shrine', category: 'Religious' }]);
    resolveFactionLabelsAtClose(s);
    const text = JSON.stringify(s);
    expect(text.includes('Military/Guard')).toBe(false);
    expect(s.powerStructure.factions[0].faction).toBe('Military Party');
    expect(s.powerStructure.factions[1].desc).toBe('Rivals of the Military Party.');
  });

  it('(b) a guard stands: the record is untouched, and the kept label is noted for the self-check', () => {
    const s = fixture([{ name: 'Town watch', category: 'Defense' }]);
    const before = JSON.stringify(s);
    const { ledger } = withPresumptionLedger(() => resolveFactionLabelsAtClose(s));
    expect(JSON.stringify(s)).toBe(before);
    expect(ledger.some((e) => e.pool === 'factionLabelSiblings:FACTION_LABEL_SIBLINGS' && e.atoms.includes('guardPresence'))).toBe(true);
    expect(presumptionFindings(s, ledger)).toEqual([]);
  });

  it('(c) a record with no such label is untouched', () => {
    const s = { tier: 'village', institutions: [], powerStructure: { factions: [{ faction: 'Elders', power: 100 }] } };
    const before = JSON.stringify(s);
    resolveFactionLabelsAtClose(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('(d) soak1k-110 (no guardPresence on the final record) carries the twin and never the label', async () => {
    await ensureLaws();
    const born = withPresumptionLedger(() => birth(110));
    const s = born.result.settlement;
    const { simulationTrace, ...rest } = s; // the generation receipt keeps the old name (NON_CASCADED_SURFACES)
    void simulationTrace;
    const text = JSON.stringify(rest);
    expect(text.includes('Military/Guard')).toBe(false);
    expect(text.includes('Military Party')).toBe(true);
    expect(presumptionFindings(s, born.ledger).filter((p) => p.pool.startsWith('factionLabelSiblings'))).toEqual([]);
  });
});
