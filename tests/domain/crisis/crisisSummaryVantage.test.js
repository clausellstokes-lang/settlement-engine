/**
 * crisisSummaryVantage.test.js — #29, THE CRISIS SUMMARY ONE VANTAGE PER SURFACE (STYLE-RULINGS
 * §1(c), WAVE-RULINGS item 2; W4 PEOPLE second seat, 2026-11-07). The crisis section keeps the full
 * text; the cover prints the traveller's vantage, the Overview the local's, Defence the watch's and
 * Tonight the official's — so one PDF no longer prints one paragraph four times.
 */
import { describe, expect, it } from 'vitest';
import {
  CRISIS_SUMMARY_VANTAGES, SUMMARY_VANTAGE_OF_SURFACE, crisisSummaryForSurface, crisisSummaryVantage,
} from '../../../src/domain/crisis/crisisSummaryVantage.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { composeTonightSheet } from '../../../src/domain/summary/tonightSheet.js';
import { composeCrisisPage } from '../../../src/domain/crisis/crisisPage.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const KINDS = Object.keys(STRESS_TYPE_MAP);
const VANTAGES = Object.values(SUMMARY_VANTAGE_OF_SURFACE);
/** every vantage set of the table, the migration's two directions apart */
const SETS = KINDS.flatMap((kind) => (kind === 'mass_migration'
  ? [['mass_migration/arrivals', CRISIS_SUMMARY_VANTAGES.mass_migration.arrivals], ['mass_migration/departures', CRISIS_SUMMARY_VANTAGES.mass_migration.departures]]
  : [[kind, CRISIS_SUMMARY_VANTAGES[kind]]]));

describe('#29 — the crisis summary, one vantage per surface', () => {
  it('every crisis kind carries four vantages, each naming the place, none another\'s words', () => {
    expect(SETS.length).toBe(16);
    const failures = collectSeedFailures(SETS, ([kind, set]) => {
      expect(set, kind).toBeTruthy();
      const lines = VANTAGES.map((v) => set[v]);
      for (const line of lines) {
        expect(typeof line === 'string' && line.includes('{name}'), `${kind}: ${line}`).toBe(true);
        // a vantage claims no defence the record may lack, and no figure (the digit ban)
        expect(line).not.toMatch(/\b(?:garrison|soldiers?|walls?|walled|hospitals?)\b/i); // anchored: the line above pins this same string as a real line with its {name} slot
        expect(line).not.toMatch(/[0-9]/); // anchored: the same string, pinned two lines above
      }
      expect(new Set(lines).size, `${kind}: four different vantages`).toBe(4);
    });
    expectNoSeedFailures(failures, 'every crisis kind has four distinct, slotted vantages');
  });

  it('the stored summary stays the crisis section\'s, and the fallback for a kind the table does not know', () => {
    const entry = { type: 'famine', summary: 'Stored.' };
    expect(crisisSummaryForSurface(entry, 'Thornwall', 'crisis')).toBe('Stored.');
    expect(crisisSummaryVantage({ type: 'custom_crisis', summary: 'Authored.' }, 'Thornwall', 'local')).toBe('Authored.');
    expect(crisisSummaryVantage(entry, '', 'local')).toBe('Stored.');
    expect(crisisSummaryForSurface(entry, 'Thornwall', 'overview')).toBe(CRISIS_SUMMARY_VANTAGES.famine.local.replace('{name}', 'Thornwall'));
  });

  it('a migration speaks in the direction its record declares', () => {
    const arrivals = crisisSummaryVantage({ type: 'mass_migration', direction: 'arrivals' }, 'Thornwall', 'traveller');
    const departures = crisisSummaryVantage({ type: 'mass_migration', direction: 'departures' }, 'Thornwall', 'traveller');
    expect(arrivals).toBe(CRISIS_SUMMARY_VANTAGES.mass_migration.arrivals.traveller.replace('{name}', 'Thornwall'));
    expect(departures).toBe(CRISIS_SUMMARY_VANTAGES.mass_migration.departures.traveller.replace('{name}', 'Thornwall'));
    // an entry saved before the field reads as arrivals, the ruled default (ODQ §934.101)
    expect(crisisSummaryVantage({ type: 'mass_migration' }, 'Thornwall', 'traveller')).toBe(arrivals);
  });

  it('over generated crisis towns, the four surfaces print four vantages and the crisis page the full text', () => {
    const cases = KINDS.map((kind, i) => ({ kind, seed: `vantage-${i}` }));
    const failures = collectSeedFailures(cases, ({ kind, seed }) => {
      const s = generateSettlementPipeline({ settType: 'town', stressTypes: [kind] }, null, { seed, customContent: {} });
      const entry = (Array.isArray(s.stress) ? s.stress : [s.stress]).find((x) => x?.type === kind);
      expect(entry, `${kind} drawn`).toBeTruthy();
      const vm = buildViewModel({ settlement: s });
      const cover = vm.summary.crisis.chips.find((c) => c.label === entry.label)?.summary;
      const overview = vm.overview.stress.find((c) => c.label === entry.label)?.summary;
      const tonight = composeTonightSheet(s).opening;
      const page = composeCrisisPage(s).find((x) => x.type === kind)?.summary;
      expect(page, `${kind}: the crisis page keeps the stored summary`).toBe(entry.summary);
      expect(cover).toBe(crisisSummaryVantage(entry, s.name, 'traveller'));
      expect(overview).toBe(crisisSummaryVantage(entry, s.name, 'local'));
      expect(tonight).toContain(crisisSummaryVantage(entry, s.name, 'official'));
      expect(new Set([cover, overview, entry.summary]).size, `${kind}: no surface repeats another`).toBe(3);
    });
    expectNoSeedFailures(failures, 'every surface prints its own vantage of the crisis');
  });
});
