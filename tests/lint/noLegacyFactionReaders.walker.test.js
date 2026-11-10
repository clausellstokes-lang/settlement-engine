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
import { readFileSync as readSiteList } from 'node:fs';
import { filesUnder, sitesIn } from './legacyFactionReaders/ast-sites.mjs';

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

// ── THE PER-SITE ARM (PULSE-SITES, 2026-11-10; the chair's S3) ─────────────────────────────────────────────────────
// The arm above exempts a WHOLE FPZ file. This one is exact to the SITE: every read, destructure or string access of
// the five retired per-card fields in src/ outside the migration is a row of `legacyFactionReaders/retired-field-sites.json`
// (file, field, line, class, reason), and every row is a site the scan finds. SHRINK-ONLY: a new read reds as
// "not on the list"; a cured site reds as "a stale row" until its row is removed, so the list ratchets down through
// this door to the legacy rows alone. Classes: LEGACY (a v1-shaped or external record's path, named), DEAD (unreachable
// from src, named), DARK (a dark feature's read, decided when it is lit: the chair, 2026-11-10), and CURED-ON-LANE (GREEN-TIP's sites, cured on its lane and
// removed here by the merge seat).
const SITE_LIST = join(HERE, 'legacyFactionReaders/retired-field-sites.json');
const RETIRED_FIELDS = Object.freeze(['factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal', 'densityRungRole']);
const SITE_KINDS = new Set(['read', 'destructure', 'string', 'path-string']);
const SITE_CLASSES = new Set(['LEGACY', 'DEAD', 'DARK', 'CURED-ON-LANE']);
const MIGRATION_FILE = 'src/domain/settlementMigrations.js';

/** The retired-field sites of one source, as `file:line field`. @param {string} file @param {string} source */
function retiredSitesIn(file, source) {
  const r = sitesIn(source);
  if (!r.parsed) return { parsed: false, sites: [] };
  return {
    parsed: true,
    sites: r.sites.filter((s) => RETIRED_FIELDS.includes(s.name) && SITE_KINDS.has(s.kind)).map((s) => `${file}:${s.line} ${s.name}`),
  };
}

describe('the retired per-card fields: every remaining site is a named row (PULSE-SITES, S3)', () => {
  it('POSITIVE CONTROL: each field, read four ways, is a site; a write and the powers are not', () => {
    const planted = [
      'export const a = (npc) => npc.factionAffiliation;',
      'export const b = ({ linkedFactionIds }) => linkedFactionIds;',
      "export const c = ['secondaryAffiliation', 'factionGoal'];",
      "export const d = 'npcs[].densityRungRole';",
      'export const w = (npc) => { npc.factionAffiliation = 1; };',
      'export const p = (s) => s.powerStructure.factions;',
    ].join('\n');
    const r = retiredSitesIn('src/planted/control.js', planted);
    expect(r.parsed).toBe(true);
    expect(r.sites.sort()).toEqual([
      'src/planted/control.js:1 factionAffiliation', 'src/planted/control.js:2 linkedFactionIds',
      'src/planted/control.js:3 factionGoal', 'src/planted/control.js:3 secondaryAffiliation',
      'src/planted/control.js:4 densityRungRole',
    ]);
  });

  it('the scan of src/ equals the named list exactly (shrink-only)', () => {
    const list = JSON.parse(readSiteList(SITE_LIST, 'utf8'));
    for (const row of list.sites) {
      expect(SITE_CLASSES.has(row.class), `${row.file}:${row.line} class ${row.class}`).toBe(true);
      expect(String(row.reason || '').length, `${row.file}:${row.line} has a reason`).toBeGreaterThan(20);
    }
    const files = filesUnder(ROOT, 'src');
    expect(files.length).toBeGreaterThan(2000); // liveness: the walk reached src/
    const found = []; const unparsed = [];
    for (const f of files) {
      if (f === MIGRATION_FILE) continue;
      const r = retiredSitesIn(f, readSiteList(join(ROOT, f), 'utf8'));
      if (!r.parsed) unparsed.push(f);
      found.push(...r.sites);
    }
    expect(unparsed).toEqual([]);
    const listed = list.sites.map((row) => `${row.file}:${row.line} ${row.field}`);
    const named = new Set(listed);
    const seen = new Set(found);
    expect(found.filter((s) => !named.has(s)), 'a retired-field read NOT on the list (cure it, or name it with its class)').toEqual([]);
    expect(listed.filter((s) => !seen.has(s)), 'a STALE row: the site is gone, so its row leaves the list').toEqual([]);
    expect(list.sites.length).toBe(list.count);
  });
});
