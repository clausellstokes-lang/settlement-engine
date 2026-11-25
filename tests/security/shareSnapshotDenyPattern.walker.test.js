/**
 * shareSnapshotDenyPattern.walker.test.js — SNAP-CHRONICLE's walker (VEIL-52, the chair's V13, 2026-11-25): no key a
 * SHARED MAP's world can carry at its top level is one the server refuses.
 *
 * THE CLASS: the share editor offered a world section (`chronicle`, ticked by default) whose top-level snapshot key
 * the server's scanner public._gallery_world_snapshot_is_safe refuses (`.*chronicle.*`, since 089), so the editor's
 * default publish was refused. The client and the server each held one half of the rule and nothing joined them.
 *
 * THE WALK: every section key the editor OFFERS (WorldSectionToggles :: WORLD_SECTIONS) and every TOP-LEVEL key
 * serializeWorldSnapshotPublic emits on the SHARE PATH with every offered section on (the opts built by
 * worldSnapshotShareOpts, the one function MapShareEditor :: buildShareOpts calls) is tried against the server's deny
 * pattern, READ FROM the net-current text of _gallery_world_snapshot_is_safe in supabase/migrations: the `key ~* (...)`
 * expression is cut out of the SQL and evaluated BY POSTGRES (pglite), never copied as a literal and never translated
 * to a JS regex (Postgres's `\m` / `\y` boundaries have no JS equal; galleryScannerMirrorTotality's CANNOT-CATCH 4).
 * A second arm runs the whole net-current scanner on `{ key: 0 }`, so its `hard_deny` array is held too.
 * 0 refused.
 *
 * THE TOOTH (executed every run): the scratch key `chronicle`, tried by the same predicate, IS refused by both arms.
 * So the walk discriminates; a broken extraction or a pattern that refuses nothing cannot pass it.
 *
 * CANNOT-CATCH: a key BELOW the top level (each section's own fields: the serializer's final scrub and
 * tests/security/mapShareChronicle.pglite.test.jsx's whole-depth publish hold those); a re-creation of the scanner in
 * a shape the latest-wins extractor cannot read (galleryScannerMirrorTotality's A4 holds that); the DATABASE itself
 * (this reads committed migrations, not production).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { serializeWorldSnapshotPublic } from '../../src/domain/display/worldSnapshotPublic.js';
import { WORLD_SECTIONS, worldSnapshotShareOpts } from '../../src/components/gallery/WorldSectionToggles.jsx';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of a `create or replace function` body across all migrations (file order). */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  // ⚠ ANCHORED AT LINE START (`^` + m) — the unanchored form also matches header prose quoting the statement.
  const re = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'igm');
  let last = null;
  for (const f of files) {
    const matches = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8').match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

const SCANNER_SQL = netCurrentFn('_gallery_world_snapshot_is_safe');
/** The scanner's deny-pattern EXPRESSION, exactly as the SQL spells it (`key ~* (<expression>) then`). */
const PATTERN_EXPRESSIONS = SCANNER_SQL ? [...SCANNER_SQL.matchAll(/\bkey\s+~\*\s+(\([\s\S]*?\))\s+then\b/gi)].map((m) => m[1]) : [];

// A campaign world with a chronicle, a clock and rules: the share path's top-level keys do not depend on content (each
// section's key is set whenever its opt is on), but a live world keeps the fixture honest.
const WORLD_STATE = {
  schemaVersion: 3,
  tick: 4,
  calendar: { elapsedMonths: 4, month: 5, year: 1, season: 'summer' },
  pulseHistory: [{ tick: 3, selectedOutcomes: [{ id: 'o-1', applyMode: 'auto', headline: 'Port raises its walls', summary: '', settlementIds: ['s-1'] }], impactDigest: [] }],
};
const MEMBERS = [{ name: 'Port', tier: 'town', settlement: { id: 's-1', name: 'Port', tier: 'town' } }];

const OFFERED = WORLD_SECTIONS.map(([key]) => key);
const SHARE_SNAPSHOT = serializeWorldSnapshotPublic(WORLD_STATE, { channels: [] }, MEMBERS, worldSnapshotShareOpts(OFFERED));
const EMITTED = Object.keys(SHARE_SNAPSHOT);
const TRIED = [...new Set([...OFFERED, ...EMITTED])].sort();

let db;
let pattern;

/** The keys of `keys` the server refuses, by each arm: the extracted pattern (Postgres `~*`) and the whole scanner. */
async function refusedOf(keys) {
  const byPattern = [];
  const byScanner = [];
  for (const key of keys) {
    if ((await db.query('select $1::text ~* $2::text as hit', [key, pattern])).rows[0].hit) byPattern.push(key);
    if (!(await db.query('select public._gallery_world_snapshot_is_safe(jsonb_build_object($1::text, 0)) as ok', [key])).rows[0].ok) byScanner.push(key);
  }
  return { byPattern, byScanner };
}

describe('SNAP-CHRONICLE walker: every key a shared map\'s world carries at its top level passes the server\'s deny pattern', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(SCANNER_SQL);
    pattern = (await db.query(`select ${PATTERN_EXPRESSIONS[0]} as re`)).rows[0].re;
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('reads the deny pattern out of the net-current scanner text (one expression, evaluated by Postgres)', () => {
    expect(SCANNER_SQL, 'no net-current _gallery_world_snapshot_is_safe in supabase/migrations').toBeTruthy();
    expect(PATTERN_EXPRESSIONS.length, 'the scanner must spell exactly one `key ~* (...)` deny pattern').toBe(1);
    expect(pattern).toMatch(/^\^\(.+\)\$$/s);
  });

  it('the walk is non-vacuous: the share path emits every offered section and the snapshot envelope', () => {
    expect(OFFERED.length).toBeGreaterThanOrEqual(4);
    expect(EMITTED).toEqual(expect.arrayContaining(['schemaVersion', ...OFFERED]));
  });

  it('0 refused: no offered section key and no top-level key of the share path\'s snapshot is refused', async () => {
    const { byPattern, byScanner } = await refusedOf(TRIED);
    expect(byPattern, `the server's deny pattern refuses these keys a shared map's world carries (tried: ${TRIED.join(', ')})`).toEqual([]);
    expect(byScanner, `the net-current scanner refuses these keys a shared map's world carries (tried: ${TRIED.join(', ')})`).toEqual([]);
  });

  it('THE TOOTH: the scratch key `chronicle` is refused by both arms of the same predicate', async () => {
    const { byPattern, byScanner } = await refusedOf([...TRIED, 'chronicle']);
    expect(byPattern).toEqual(['chronicle']);
    expect(byScanner).toEqual(['chronicle']);
  });
});
