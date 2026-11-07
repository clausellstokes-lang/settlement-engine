/**
 * CENSUS-5d (2026-11-05), unit 3 — CENSUS-5c's off-census `{colour}` list fed into the wiring
 * census's `tablePools` (CENSUS-1g unit 3c, `scripts/lib/table-pools.mjs`), with the census's own
 * `colour` ruling (never a marker of the lane's). 1g enrolled the one-export tables it could see
 * (ALIGNED_BASIS, DEFENSE_PREFERENCES, the three faith-panel tables); this unit enrols the two left:
 *   warRemembrance.WAR_ENDING_TELLINGS  ending-keyed (the record's classifier); `{victor}` its one slot
 *   deityEffects.DEITY_AXIS_EFFECTS     axis-keyed; the printed lines are the `effect` strings
 * `stressFactions` (inline T branches) and `settlementNarrative :: STRESS_RUMORS` (ruled by
 * CENSUS-2e) are no single export here and stay listed in the lane doc.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TABLE_POOLS } from '../../scripts/lib/table-pools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CENSUS = JSON.parse(readFileSync(join(ROOT, 'docs', 'content', 'wiring-census.json'), 'utf8'));

describe('CENSUS-5d unit 3 · the off-census colour tables are enrolled colour', () => {
  for (const id of ['warRemembrance.WAR_ENDING_TELLINGS', 'deityEffects.DEITY_AXIS_EFFECTS']) {
    it(`${id} is enrolled with the census's colour ruling, and its lines are walked`, () => {
      expect(TABLE_POOLS.find((e) => e.id === id)?.rulings).toEqual(['colour']);
      const row = CENSUS.tablePools.find((t) => t.id === id);
      expect(row).toMatchObject({ colour: true, undeclared: 0 });
      expect(row.lines).toBeGreaterThan(5);
    });
  }
});
