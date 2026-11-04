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
const OLD_NAMES = ['Dwellings (4-16)', 'Dwellings (17-80)', 'Dwellings (80-180)'];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(full);
  }
  return out;
}

describe('X-46 3c: the Dwellings rows name the owner\'s household bands', () => {
  it.each([
    ['thorp', 'Dwellings (1-8)'],
    ['hamlet', 'Dwellings (5-25)'],
    ['village', 'Dwellings (15-100)'],
  ])('%s carries %s as its required dwellings row', (tier, name) => {
    const row = institutionalCatalog[tier].Infrastructure?.[name];
    expect(row, `${tier} has no "${name}" row`).toBeDefined();
    expect(row.required).toBe(true);
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
