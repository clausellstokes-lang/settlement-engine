// X-46 car 2, 3c (docs/DESIGN_X46_SCALE_TRAIN.md §3c) — THE DWELLINGS ROWS' NAMES CARRY THE
// OWNER'S HOUSEHOLD COLUMN. "Dwellings (4-16)", "(17-80)", "(80-180)" were household counts from
// the old scale; the owner's table gives thorp 1–8, hamlet 5–25, village 15–100 households. This
// is the only place the household figure survives, and it is a NAME, not a field (the record
// carries no household count, by the owner's word of 2026-11-02).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OLD_NAMES = [
  'Dwellings (4-16)', 'Dwellings (17-80)', 'Dwellings (80-180)',
  'Housing (180-1000 structures)', 'Housing (1000-5000 structures)', 'Housing (5000+ structures)',
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(full);
  }
  return out;
}

describe('X-46 3c: the Dwellings and Housing rows name the owner\'s household bands', () => {
  // Each-family cure (2026-11-05, LANDING-6): one parameterless test looping over the rows,
  // each failure naming its tier and row.
  const HOUSEHOLD_ROWS = [
    ['thorp', 'Dwellings (1-8)'],
    ['hamlet', 'Dwellings (5-25)'],
    ['village', 'Dwellings (15-100)'],
    // The chair's extension of 3c (X46-2 hand-back): the urban Housing rows follow the same
    // household column (town 75–650, city 500–4,000, metropolis 3,500+). Each keeps its own
    // grammar — a range with a noun, which townCartography's COUNT_RANGE does not parse — so
    // the noun is now the true one (households, not structures) and the drawn count is unchanged.
    ['town', 'Housing (75-650 households)'],
    ['city', 'Housing (500-4000 households)'],
    ['metropolis', 'Housing (3500+ households)'],
  ];

  it('every tier from thorp to metropolis carries its household-band dwellings row as required', () => {
    expect(HOUSEHOLD_ROWS).toHaveLength(6);
    for (const [tier, name] of HOUSEHOLD_ROWS) {
      const row = institutionalCatalog[tier].Infrastructure?.[name];
      expect(row, `${tier} has no "${name}" row`).toBeDefined();
      expect(row.required, `${tier}: "${name}" must be required`).toBe(true);
    }
  });

  it('no source file still names an old-scale Dwellings row (every name-keyed table followed)', () => {
    const hits = [];
    for (const file of walk(join(ROOT, 'src'))) {
      const text = readFileSync(file, 'utf8');
      for (const old of OLD_NAMES) if (text.includes(old)) hits.push(`${file.slice(ROOT.length + 1)}: ${old}`);
    }
    expect(hits).toEqual([]);
  });
});
