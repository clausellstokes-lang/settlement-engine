/**
 * traditionsPublicProse.pglite.test.js — TRAD-1 (CTR9, the seventh chair, 2026-11-20): THE ROUND TRIP of the shared
 * page's traditions through the SERVER's own sanitizer. The owner's save writes `publicProse.blocks.traditions` (a list
 * of text rows: id, name, element, chip, when, text); the RLS-enforced boundary is `_gallery_sanitize_public_json`
 * (net-current across the migrations, latest wins, as tests/security/gallerySanitizer.pglite.test.js loads it). This
 * file proves the rows come back out of that function byte for byte: no key of theirs matches the deeper private-key
 * denylist, and `publicProse` stands on the top-level allowlist (migration 210). It loads the SQL and edits nothing.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget (see pgliteHookTimeoutRatchet.test.js)
const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** The LAST definition of a function across the migrations, in file order. @param {string} name */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'igm');
  let last = null;
  for (const f of files) {
    const matches = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8').match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

const SANITIZER = netCurrentFn('_gallery_sanitize_public_json');
let db;

describe('the shared traditions survive the server sanitizer (pglite)', () => {
  it('locates the net-current sanitizer', () => {
    expect(SANITIZER).toBeTruthy();
  });

  beforeAll(async () => {
    db = new PGlite();
    await db.exec('create schema if not exists public;');
    await db.exec(SANITIZER);
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('a born town\'s drawn traditions come back out of _gallery_sanitize_public_json byte for byte', async () => {
    const t = generateSettlementPipeline(
      { settType: 'town', culture: 'norse', terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' },
      null, { seed: 'trad-pglite-1', customContent: {} },
    );
    const saved = withPublicProse(t, composePublicProse(t));
    const rows = saved.publicProse.blocks.traditions;
    expect(Array.isArray(rows) && rows.length > 0).toBe(true);
    const out = (await db.query('select public._gallery_sanitize_public_json($1::jsonb) as out', [JSON.stringify(saved)])).rows[0].out;
    expect(out.publicProse.blocks.traditions).toEqual(rows);
    expect(out._seed).toBeUndefined(); // the seed stays home; only the drawn text travels
  }, 60000);
});
