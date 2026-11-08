// tests/lint/noLegacyFactionReaders.walker.test.js — THE NO-LEGACY-FACTION-READERS WALKER (M-2's closing proof).
//
// Promoted by PEOPLE-LAND (2026-11-07) from PEOPLE-5-PREP's draft (docs/chair/2026-11-07/people-5-prep/
// noLegacyFactionReaders.walker.draft.js). No read of the NPC grouping `settlement.factions` (its `members[]`, its
// `dominantCategory`), of the five retired per-NPC faction fields (`factionAffiliation`, `secondaryAffiliation`,
// `linkedFactionIds`, `factionGoal`, `densityRungRole`; `structuralRank` stays, a real field, lane 2's) or of the two
// legacy helpers is left in `src/` outside FPZ's list (`legacyFactionReaders/fpz-list.json`, M-6: the simulation's
// readers, broken by design), the migration's one class (v1-migration-reads) and the reviewed rows in the core.
// The fixture lives beside the core (the landing's call: the chair's docs/chair tree is not on the landing's base).
import { describe, it, expect } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { violationsIn, walk } from './legacyFactionReaders/noLegacyFactionReaders.core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../..');
const FPZ_LIST = join(HERE, 'legacyFactionReaders/fpz-list.json');

describe('no legacy faction readers outside FPZ (PEOPLE-5, M-2; landed by PEOPLE-LAND)', () => {
  it('POSITIVE CONTROL: a planted read of every refused shape is caught; the powers, other shapes and structuralRank are not', () => {
    const planted = [
      'export const a = (npc) => npc.factionAffiliation;',               // the field, read
      'export const b = (npc) => npc?.secondaryAffiliation ?? null;',     // optional chain
      'export const c = ({ linkedFactionIds }) => linkedFactionIds;',     // a destructured read
      "export const d = ['factionGoal'];",                                // a dynamic key list
      "export const e = 'npcs[].densityRungRole';",                       // a key-path string
      'export const f = (s) => s.factions.length;',                       // the grouping
      'export const g = (s, x) => factionRosterOf(s, x);',                // a refused helper
    ].join('\n');
    const { parsed, violations } = violationsIn('src/planted/control.js', planted);
    expect(parsed).toBe(true);
    expect(violations.map((v) => v.name).sort()).toEqual([
      'densityRungRole', 'factionAffiliation', 'factionGoal', 'factionRosterOf', 'factions', 'linkedFactionIds',
      'secondaryAffiliation',
    ]);
    // anchored: the negative half — the same file reading the POWERS, a tension's names and the kept structuralRank is clean.
    const clean = 'export const p = (s) => s.powerStructure.factions.length;\nexport const q = (ps) => ps.factions[0];\nexport const h = (npc) => npc.structuralRank;';
    expect(violationsIn('src/planted/clean.js', clean).violations).toEqual([]);
    expect(violationsIn('src/components/new/tabs/HistoryTab.jsx', 'export const t = (t) => t.factions;').violations).toEqual([]);
  });

  it('every read outside the FPZ list is red; zero at the landing', () => {
    const { violations, unparsed, scanned, fpz } = walk(ROOT, FPZ_LIST);
    expect(unparsed).toEqual([]);
    expect(scanned).toBeGreaterThan(2000); // liveness: the walk reached src/
    expect(fpz).toBe(38); // PEOPLE-5-PREP's 35 + the landing's three (the density law's retired rung machinery)
    expect(violations.map((v) => `${v.file}:${v.line} ${v.name}`)).toEqual([]);
  });
});
