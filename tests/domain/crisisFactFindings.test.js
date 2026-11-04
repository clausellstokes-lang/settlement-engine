/**
 * tests/domain/crisisFactFindings.test.js — lane RUNG2-F13 (docs/SOAK_10000_RUNG2_2026-11-04.md
 * §3c): three crisis facts the page contradicts, each a check of kind 10 ("crisis") in the page
 * battery (src/domain/coherence/crisisFactFindings.js), each planted and caught, and each read
 * on the rung's own seeds re-born: a famine beside a full granary (soak1k-3605), a migration
 * told backwards (soak1k-0, soak1k-4204), a crisis cast whose wants contradict its roles
 * (soak1k-1805, -4200, -3000, -2404, -3005, -4203).
 *
 * The seed tests read the RECORD's own text (every stored string, walked) and the one Tonight
 * sheet composed from it, so they need no renderer; the soak reads the rendered surfaces.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import {
  crisisCastSenseFindings, famineStoresFindings, migrationDirectionFindings,
} from '../../src/domain/coherence/crisisFactFindings.js';
import { foodStoresWords } from '../../src/domain/summary/tonightSheet.js';
import { migrationDirectionOf } from '../../src/domain/crisis/migrationDirection.js';
import { FAMINE_RATION_FLOOR_PCT } from '../../src/generators/foodGenerator.js';
import { STOCKPILE_TUNING } from '../../src/domain/worldPulse/foodStockpile.js';

/** Every string the record stores, one per line (the prose the generators wrote). @param {unknown} v @returns {string} */
function recordText(v) {
  /** @type {string[]} */
  const out = [];
  const seen = new Set();
  /** @param {unknown} x */
  const walk = (x) => {
    if (typeof x === 'string') { out.push(x); return; }
    if (!x || typeof x !== 'object' || seen.has(x)) return;
    seen.add(x);
    for (const y of Array.isArray(x) ? x : Object.values(x)) walk(y);
  };
  walk(v);
  return out.join('\n');
}

describe('the three checks, planted', () => {
  it('famine-stores: a famine beside six months or more of stores in hand is a finding; held stores and a fed place are not', () => {
    const famine = { economicState: { foodSecurity: { foodRecord: { band: 'famine', storageMonths: 15 } } } };
    expect(famineStoresFindings(famine, 'Stores: a granary, 15 months of grain.')).toHaveLength(1);
    expect(famineStoresFindings(famine, 'Stores: a granary, five months of grain.')).toHaveLength(0);
    expect(famineStoresFindings(famine, 'Stores: a granary of 15 months that the hall will not open.')).toHaveLength(0);
    const fed = { economicState: { foodSecurity: { foodRecord: { band: 'secure', storageMonths: 15 } } } };
    expect(famineStoresFindings(fed, 'Stores: a granary, 15 months of grain.')).toHaveLength(0);
  });

  it('migration-direction: a departure under an influx is a finding, an arrival is not; the reverse under an exodus', () => {
    const influx = { stress: { type: 'mass_migration' } };
    expect(migrationDirectionOf(influx.stress)).toBe('influx');
    expect(migrationDirectionFindings(influx, 'Three families left this week. Two more last week.')).toHaveLength(1);
    expect(migrationDirectionFindings(influx, 'New arrivals come faster than housing can absorb them.')).toHaveLength(0);
    const exodus = { stress: { type: 'mass_migration', direction: 'exodus' } };
    expect(migrationDirectionFindings(exodus, 'New arrivals come faster than housing can absorb them.')).toHaveLength(1);
    expect(migrationDirectionFindings({ stress: { type: 'famine' } }, 'Three families left this week.')).toHaveLength(0);
  });

  it('crisis-cast-sense: the governing house meeting against itself is a finding', () => {
    const s = { powerStructure: { factions: [{ faction: 'Elder Council', isGoverning: true, power: 50 }] } };
    const text = 'Elder Council is conducting meetings with people who should not be meeting privately. The governing faction has noticed.';
    expect(crisisCastSenseFindings(s, { power: text }).map((f) => f.detail)).toEqual(['plotter_governs: the governing house meets against the governing house']);
  });
});

describe('the famine month-burn', () => {
  it('stops at the world pulse\'s own ration floor (one number, two homes pinned equal)', () => {
    expect(FAMINE_RATION_FLOOR_PCT).toBe(STOCKPILE_TUNING.rationFloorPct);
  });
  it('a held famine granary says so in the one stores writer; a famine of few months prints what is in hand', () => {
    expect(foodStoresWords({ storageMonths: 12.1, hasGranary: true, storesHeld: true })).toBe('Stores: a granary of twelve months that the hall will not open.');
    expect(foodStoresWords({ storageMonths: 2.4, hasGranary: true, storesHeld: false })).toBe('Stores: a granary, two months of grain.');
  });
});

describe('the rung-2 seeds, re-born', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('FAMINE-STORES — soak1k-3605: the famine stores line reads what the famine leaves, or says the hall holds it', () => {
    const s = birth(3605).settlement;
    const record = s.economicState.foodSecurity.foodRecord;
    expect(record.band).toBe('famine');
    expect(famineStoresFindings(s, foodStoresWords(record))).toEqual([]);
  });

  it.each([0, 4204])('MIGRATION-DIRECTION — soak1k-%i: no migration line tells the influx as a departure', (i) => {
    const s = birth(i).settlement;
    const entry = (Array.isArray(s.stress) ? s.stress : [s.stress]).find((e) => e?.type === 'mass_migration');
    expect(entry?.direction).toBe('influx');
    expect(migrationDirectionFindings(s, recordText(s)).map((f) => f.quote)).toEqual([]);
  });

  it.each([1805, 4200, 3000, 2404, 3005, 4203])('CRISIS-CAST-SENSE — soak1k-%i: the cast\'s wants fit its roles and no one holds two opposed roles', (i) => {
    const s = birth(i).settlement;
    expect(crisisCastSenseFindings(s, { record: recordText(s) }).map((f) => `${f.detail} | ${f.quote}`)).toEqual([]);
  });
});
