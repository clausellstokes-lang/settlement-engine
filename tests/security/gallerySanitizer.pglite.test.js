/**
 * gallerySanitizer.pglite.test.js — EXECUTION test of the NET-CURRENT gallery
 * public-JSON sanitizer (review B16 #4, #12).
 *
 * The server-side SQL sanitizer is the TRUE RLS-enforced privacy boundary for
 * public dossiers: the client can be bypassed by calling get_gallery_dossier
 * directly, so whatever _gallery_sanitize_public_json keeps IS what an anonymous
 * reader sees. The existing gallery_privacy.contract.test.js only asserts the
 * function body in migration 020 — which is OVERWRITTEN at deploy time by the
 * hardened version in migration 033. A regression in the 033 sanitizer that
 * re-leaked DM secrets / private NPC fields would pass that contract.
 *
 * This loads the ACTUAL net-current _gallery_sanitize_public_json (latest-wins
 * across all migrations — currently 033) into in-process Postgres (pglite) and
 * RUNS it against a settlement carrying DM secrets and private NPC internals,
 * asserting they are stripped. It also pins the SQL npc_allowed[] in sync with
 * the JS mirror in src/domain/display/publicSafe.js so the dual-maintenance
 * trap (a field added to one list but not the other) fails CI.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const PUBLIC_SAFE_JS = resolve(process.cwd(), 'src', 'domain', 'display', 'publicSafe.js');

/** Latest-wins extraction of a `create or replace function` body across all
 *  migrations (file order). Returns the LAST definition so we test the
 *  net-current behavior, not a superseded one. */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'ig');
  let last = null;
  let lastFile = null;
  for (const f of files) {
    const src = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) { last = matches[matches.length - 1]; lastFile = f; }
  }
  return { sql: last, file: lastFile };
}

/** Extract the npc_allowed text[] array literal from the net-current sanitizer SQL. */
function sqlNpcAllowed(sql) {
  const m = sql.match(/npc_allowed\s+constant\s+text\[\]\s*:=\s*array\[([\s\S]*?)\]/i);
  if (!m) throw new Error('npc_allowed array not found in net-current sanitizer');
  return new Set([...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
}

/** Extract the NPC allowlist the JS mirror keeps (the object literal in toPublicSafe). */
function jsNpcAllowed() {
  const js = readFileSync(PUBLIC_SAFE_JS, 'utf-8');
  // The npcs map projects `key: npc.key` for each kept field. Capture the LHS keys
  // inside the `clean.npcs = clean.npcs.map(npc => ({ ... }))` block.
  const block = js.match(/clean\.npcs\s*=\s*clean\.npcs\.map\(npc\s*=>\s*\(\{([\s\S]*?)\}\)\)/);
  if (!block) throw new Error('npc projection block not found in publicSafe.js');
  return new Set([...block[1].matchAll(/(\w+):\s*npc\./g)].map((x) => x[1]));
}

let db;
const SANITIZER = netCurrentFn('_gallery_sanitize_public_json');

describe('gallery public-JSON sanitizer — net-current execution (pglite)', () => {
  // Hard-fail (not skip) if the net-current sanitizer can't be located — a moved/
  // renamed migration must surface loudly, not silently drop this coverage.
  it('locates the net-current _gallery_sanitize_public_json across migrations', () => {
    expect(SANITIZER.sql, 'no _gallery_sanitize_public_json found in any migration').toBeTruthy();
    // It must be the HARDENED (allowlist) version, i.e. it carries npc_allowed.
    expect(SANITIZER.sql).toMatch(/npc_allowed/);
  });

  beforeAll(async () => {
    db = new PGlite();
    // The function pins `set search_path = public`; create the schema + load it.
    await db.exec('create schema if not exists public;');
    await db.exec(SANITIZER.sql);
  });

  const sanitize = async (obj) =>
    (await db.query(`select public._gallery_sanitize_public_json($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;

  it('strips top-level DM-secret blocks (dmCompass, secret, notes, plotHooks, chronicle)', async () => {
    const out = await sanitize({
      name: 'Riverbend',
      population: 1200,
      dmCompass: { secretPlot: 'the mayor is a doppelganger' },
      secretTreasure: 'buried under the inn',
      dmNotes: 'players must not see this',
      plotHooks: ['a stranger arrives'],
      chronicle: [{ secretEvent: 'x' }],
      gmGuidance: 'run it tense',
    });
    expect(out.name).toBe('Riverbend');
    expect(out.population).toBe(1200);
    expect(out.dmCompass).toBeUndefined();
    expect(out.secretTreasure).toBeUndefined();
    expect(out.dmNotes).toBeUndefined();
    expect(out.plotHooks).toBeUndefined();
    expect(out.chronicle).toBeUndefined();
    expect(out.gmGuidance).toBeUndefined();
  });

  it('reduces NPCs to the public allowlist — private internals are dropped', async () => {
    const out = await sanitize({
      npcs: [{
        id: 'n1', name: 'Aldric', role: 'mayor', title: 'Lord', category: 'leader',
        personality: 'wary', physical: 'tall', factionAffiliation: 'crown',
        secondaryAffiliation: 'guild', presentation: 'formal', influence: 'high',
        // Private internals that must NOT leak:
        power: 9000, successionContribution: 0.4, potentialSuccessors: ['n2'],
        linkedSecrets: ['blackmail'], dmNotes: 'is actually a spy',
      }],
    });
    const npc = out.npcs[0];
    // Allowlisted fields survive.
    expect(npc.name).toBe('Aldric');
    expect(npc.role).toBe('mayor');
    expect(npc.influence).toBe('high');
    expect(npc.presentation).toBe('formal');
    // Private internals stripped.
    expect(npc.power).toBeUndefined();
    expect(npc.successionContribution).toBeUndefined();
    expect(npc.potentialSuccessors).toBeUndefined();
    expect(npc.linkedSecrets).toBeUndefined();
    expect(npc.dmNotes).toBeUndefined();
  });

  it('keeps benign nested data (does not over-strip public structure)', async () => {
    const out = await sanitize({
      districts: [{ name: 'Market Ward', landmarks: ['fountain'] }],
      judgment: 'fair-handed',  // matches no denylist token (no \mdm / \mgm word boundary)
    });
    expect(out.districts[0].name).toBe('Market Ward');
    expect(out.districts[0].landmarks).toEqual(['fountain']);
    expect(out.judgment).toBe('fair-handed');
  });

  it('SQL npc_allowed[] stays in sync with the JS mirror (publicSafe.js)', () => {
    const sql = sqlNpcAllowed(SANITIZER.sql);
    const js = jsNpcAllowed();
    // Both lists must be identical: a field added to one but not the other either
    // hides a public field or (worse) leaks a private one.
    expect([...sql].sort()).toEqual([...js].sort());
  });
});
