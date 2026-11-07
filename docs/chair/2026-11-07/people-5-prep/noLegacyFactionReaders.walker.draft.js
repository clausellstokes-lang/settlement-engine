// docs/chair/2026-11-07/people-5-prep/noLegacyFactionReaders.walker.draft.js — PEOPLE-5-PREP DRAFT, not a test yet.
//
// PEOPLE-5's closing proof (M-2): no reader of the NPC grouping or the six per-NPC faction fields is left
// outside FPZ's list. It is RED at the prep base by design (record §5 banks the count); it turns green the
// commit PEOPLE-5's last surface is rewired. PEOPLE-5 lands it as `tests/lint/noLegacyFactionReaders.walker.test.js`
// with `ast-sites.mjs` + `noLegacyFactionReaders.core.mjs` beside it under `tests/lint/` and the fixture at
// `tests/lint/.fpz-legacy-faction-readers.json` (the names are PEOPLE-5's to choose; the paths below are the draft's).
// The name `.walker.draft.js` matches no vitest include glob, so the suite never runs it from here.
import { describe, it, expect } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { violationsIn, walk } from './noLegacyFactionReaders.core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../..');
const FPZ_LIST = join(HERE, 'fpz-list.json');

describe('no legacy faction readers outside FPZ (PEOPLE-5, M-2)', () => {
  it('POSITIVE CONTROL: a planted read of every refused shape is caught; the powers and other shapes are not', () => {
    const planted = [
      'export const a = (npc) => npc.factionAffiliation;',               // the field, read
      'export const b = (npc) => npc?.secondaryAffiliation ?? null;',     // optional chain
      'export const c = ({ linkedFactionIds }) => linkedFactionIds;',     // a destructured read
      "export const d = ['factionGoal'];",                                // a dynamic key list
      "export const e = 'npcs[].densityRungRole';",                       // a key-path string
      'export const f = (s) => s.factions.length;',                       // the grouping
      'export const g = (s, x) => factionRosterOf(s, x);',                // a refused helper
      'export const h = (npc) => npc.structuralRank;',                    // the sixth (chair point §4.2)
    ].join('\n');
    const { parsed, violations } = violationsIn('src/planted/control.js', planted);
    expect(parsed).toBe(true);
    expect(violations.map((v) => v.name).sort()).toEqual([
      'densityRungRole', 'factionAffiliation', 'factionGoal', 'factionRosterOf', 'factions', 'linkedFactionIds',
      'secondaryAffiliation', 'structuralRank',
    ]);
    // anchored: the negative half — the same file reading the POWERS and a tension's names is clean.
    const clean = 'export const p = (s) => s.powerStructure.factions.length;\nexport const q = (ps) => ps.factions[0];';
    expect(violationsIn('src/planted/clean.js', clean).violations).toEqual([]);
    expect(violationsIn('src/components/new/tabs/HistoryTab.jsx', 'export const t = (t) => t.factions;').violations).toEqual([]);
  });

  it('every read outside the FPZ list is red (zero once PEOPLE-5 lands)', () => {
    const { violations, unparsed, scanned, fpz } = walk(ROOT, FPZ_LIST);
    expect(unparsed).toEqual([]);
    expect(scanned).toBeGreaterThan(2000); // liveness: the walk reached src/
    expect(fpz).toBeGreaterThan(30);
    expect(violations.map((v) => `${v.file}:${v.line} ${v.name}`)).toEqual([]);
  });
});
