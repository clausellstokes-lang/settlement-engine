/**
 * pageClashCensus.walker.test.js — THE PAGE CLASH CENSUS IN THE SUITE (SURVEY S-C (3), the eleventh chair's SURVEY-DESIGN §2 (ii)).
 *
 * The census (`scripts/page-clash-census.mjs`) counts, for every row of the table of exclusions
 * (`src/domain/facts/claimExclusions.js`), the owner pages of the corpora C and V that print both sides; its register
 * (`scripts/.page-clash-census.json`) banks the 1,800 SHRINK-ONLY through its door (`--write`), and carries `sample`, the rows
 * each birth of THE FIXED SAMPLE prints (the script's `SAMPLE`: the measure's worked examples of E-clashes rows 10 to 14, C
 * dp-thorp-120, dp-village-141, dp-thorp-99, dp-hamlet-33, dp-hamlet-26, with C dp-thorp-3, V dp-town-7 and V dp-city-12).
 * HERE the sample is rendered as the app renders it (the script's own renderer, `--sample`, built at run time by vitest) and its
 * rows must EQUAL the register's: a page that newly prints both sides of a row reds in the lane that prints it; a cure lowers
 * the register through the door in its own commit. Measured: about two minutes on a 4-core container. The 1,800 are the door's
 * and the chair's to run.
 * Anti-vacuity: the register's 1,800 must still bank the two late writes the sample holds (prosperity, guild) until another
 * seat's unit cures them, and every row of the table has its register row.
 */
import { describe, expect, test } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIM_EXCLUSIONS } from '../../src/domain/facts/claimExclusions.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTER = JSON.parse(readFileSync(join(ROOT, 'scripts/.page-clash-census.json'), 'utf8'));

describe('the page clash census holds its register', () => {
  test('every row of the table has its register row, banked on the 1,800, each with its towns', () => {
    expect(REGISTER.pages).toBe(1800);
    expect(Object.keys(REGISTER.rows).sort()).toEqual(CLAIM_EXCLUSIONS.map((r) => r.id).sort());
    for (const [id, row] of Object.entries(REGISTER.rows)) {
      expect(row.towns.length, id).toBe(row.pages);
      expect(row.C + row.V, id).toBe(row.pages);
    }
  });
  test('the fixed sample, rendered as the app renders it, prints exactly the register\'s rows', () => {
    const run = spawnSync(process.execPath, [join(ROOT, 'scripts/page-clash-census.mjs'), '--sample', '--workers=2'], { cwd: ROOT, encoding: 'utf8', timeout: 900000 });
    expect(run.stdout, run.stderr).toMatch(/--sample: equals the register/);
    expect(run.status).toBe(0);
  }, 900000);
  test('not vacuous: the sample carries rows, and the two late writes are banked as they print', () => {
    expect(Object.values(REGISTER.sample).flat().length).toBeGreaterThan(0);
    expect(REGISTER.sample['C:dp-hamlet-33']).toContain('prosperity');
    expect(REGISTER.sample['C:dp-hamlet-26']).toContain('guild');
  });
});
