/**
 * galleryScannerMirrorTotality.test.js — THE CLIENT-MIRROR TOTALITY OF THE GALLERY SCANNER.
 *
 * THE CLAIM. Every member of the client WORLD_SNAPSHOT_HARD_DENY is refused by the repository's
 * NET-CURRENT public._gallery_world_snapshot_is_safe — as an exact, case-insensitive `hard_deny`
 * array member (Postgres's own `lower(key) = any (select lower(x) from unnest(hard_deny))`, migration
 * 202) OR by a covering alternation alternative under the whole-key `^alt$` rule. Plus the
 * RECONCILIATION claim: every migration DECLARING a re-creation of that scanner is one the latest-wins
 * extractor could read, and its owner is the highest-numbered such migration under a NUMERIC sort.
 *
 * THE DIRECTION THIS DELIBERATELY DOES NOT DUPLICATE. tests/security/snapshotDenylistDrift.test.js
 * asserts the OTHER direction, in 'the net-current SQL sanitizer denies the "%s" key (membership)':
 * every CLIENT REGEX TOKEN has a covering SQL alternative. It reads the two client regexes and the SQL
 * ALTERNATION, so it says nothing about the `hard_deny` ARRAY, nor about keys living only in
 * WORLD_SNAPSHOT_HARD_DENY. Three conditional ledgers landed on the client after migration 136 froze
 * that array — factionPairStates (2026-07-20), envoyErrands (2026-08-03), concludedWars (2026-08-31) —
 * and nothing carried them to the server until 203. This file makes that class RED, not silent.
 *
 * THE THIRD COPY OF THE LATEST-WINS WALK, DELIBERATELY. netCurrentScanner() re-implements the walk
 * snapshotDenylistDrift.test.js and tests/ops/migrationRehearsal.test.js each already carry (chair
 * ruling R3); consolidating all three onto tests/helpers/sourceContract.js is TOOL-4 and would edit two
 * shipped security guards. Until then ARM A4 keeps this copy honest, reddening whenever a migration
 * declares the scanner in a shape this walk cannot read.
 *
 * CANNOT-CATCH (the six shapes this guard is blind to, named rather than hidden):
 *   1. a `DO $$ ... $$;` block re-creating the scanner through EXECUTE: no line-anchored
 *      `create ... function`, so it is neither declared nor matched;
 *   2. a non-`$$` tag (`$fn$ ... $fn$;`) in a file carrying a LATER `$$;`: the definition regex
 *      OVER-RUNS into the next statement, so A4 sees a match and the text is wrong, not absent;
 *   3. an `alter function` / `comment on function` touch: the body is unchanged so nothing here moves
 *      — correct, but those statements are unguarded by this file;
 *   4. the Postgres `\m` / `\y` boundaries, stripped by sourceContract before the alternatives become
 *      JS regexes, so `.*\mdm.*` reads here as `.*dm.*` — WIDER than Postgres, and a key this file
 *      calls refused-by-alternation may not be refused by the server;
 *   5. THE DATABASE. This reads COMMITTED MIGRATION FILES; supabase/applied-head.json sits at 200 and
 *      applying 201-203 is the owner's hand, so a gap closed here can still be open in production;
 *   6. a key private in fact but registered in NO client list: the claim's left side is
 *      WORLD_SNAPSHOT_HARD_DENY, so an unregistered key is invisible to it, and
 *      tests/security/worldSnapshotDenyCensus.test.js is the guard that forces registration.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import { COVERT_KEY_RE, WORLD_SNAPSHOT_HARD_DENY } from '../../src/domain/display/worldSnapshotPublic.js';
import { jsRegexTokens, sqlRegexAlternation } from '../helpers/sourceContract.js';

const MIGRATIONS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../supabase/migrations');
/** A LINE-ANCHORED declaration, with or without `or replace` (A4's left side). */
const DECLARATION_RE = /^create\s+(or\s+replace\s+)?function\s+public\._gallery_world_snapshot_is_safe\b/im;
/** The shape the extractor can read, through its closing `$$;` (A4's right side). */
const DEFINITION_RE = /^create\s+or\s+replace\s+function\s+public\._gallery_world_snapshot_is_safe\b[\s\S]*?\$\$;/igm;
const ARRAY_LITERAL_RE = /hard_deny\s+constant\s+text\[\]\s*:=\s*array\[[\s\S]*?\];/;
const NEW_MEMBERS = ['factionpairstates', 'envoyerrands', 'concludedwars'];
/** @param {string} name @returns {number} the migration's numeric prefix */
const numericPrefix = (name) => parseInt(name, 10);

/**
 * Latest-wins extraction of the net-current scanner, visiting files in NUMERIC prefix order.
 * @returns {{ sql: string, owner: string|null, declarers: string[], matchedIn: string[] }} sql — the LAST
 *   matched definition, LOWERCASED, or '' when none matched; owner — the file that produced it, or null;
 *   declarers — every migration carrying a LINE-ANCHORED declaration whether or not the extractor matched
 *   it (A4's left side); matchedIn — the subset it matched (A4's right side).
 */
function netCurrentScanner() {
  const ordered = readdirSync(MIGRATIONS_DIR)
    .filter((f) => /^\d.*\.sql$/.test(f))
    .sort((a, b) => numericPrefix(a) - numericPrefix(b));
  const declarers = [];
  const matchedIn = [];
  let sql = '';
  let owner = null;
  for (const file of ordered) {
    const src = readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
    if (DECLARATION_RE.test(src)) declarers.push(file);
    const hits = src.match(DEFINITION_RE);
    if (hits && hits.length) {
      sql = hits[hits.length - 1].toLowerCase();
      owner = file;
      matchedIn.push(file);
    }
  }
  return { sql, owner, declarers, matchedIn };
}

/** The scanner's `hard_deny` members, lowercased with the SQL. THROWS when the literal is absent —
 *  never returns []. @param {string} sql @returns {string[]} */
function hardDenyMembers(sql) {
  const literal = sql.match(/hard_deny\s+constant\s+text\[\]\s*:=\s*array\[([\s\S]*?)\];/);
  if (!literal) throw new Error('galleryScannerMirrorTotality: no hard_deny array literal in the scanner body');
  return [...literal[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

const SCANNER = netCurrentScanner();
const SQL_ALTS = sqlRegexAlternation(SCANNER.sql);
const HARD_DENY = hardDenyMembers(SCANNER.sql);
const JS_TOKENS = [...new Set([...jsRegexTokens(COVERT_KEY_RE.source), ...jsRegexTokens(PRIVATE_KEY_RE.source)])];

/** THE CLAIM'S PREDICATE. A key is refused iff it is an EXACT, case-insensitive member of the hard_deny
 *  array, OR some alternation alternative matches it as a WHOLE key. The array is checked first and the
 *  mechanism is RECORDED, never constrained.
 *  @param {string} key @param {string[]} [members] @param {string[]} [alternatives]
 *  @returns {{ refused: boolean, by: 'array'|'alternation'|null, alts?: string[] }} */
function refusalOf(key, members = HARD_DENY, alternatives = SQL_ALTS) {
  if (members.includes(key.toLowerCase())) return { refused: true, by: 'array' };
  const alts = alternatives.filter((alt) => new RegExp(`^${alt}$`, 'i').test(key));
  return alts.length ? { refused: true, by: 'alternation', alts } : { refused: false, by: null };
}

describe('gallery scanner client-mirror totality — the server refuses every key the client hard-denies', () => {
  it('A1 — every client WORLD_SNAPSHOT_HARD_DENY key is refused by the net-current scanner', () => {
    const verdicts = WORLD_SNAPSHOT_HARD_DENY.map((key) => ({ key, ...refusalOf(key) }));
    const unrefused = verdicts.filter((v) => !v.refused).map((v) => v.key);
    expect(unrefused, `the net-current gallery scanner (${SCANNER.owner}) refuses ${verdicts.length - unrefused.length}`
      + ` of ${verdicts.length} client WORLD_SNAPSHOT_HARD_DENY keys. UNREFUSED: ${unrefused.join(', ')}. Satisfy each`
      + ' in a NEW migration re-creating public._gallery_world_snapshot_is_safe, either by adding it to the hard_deny'
      + ' array or by a covering alternation alternative matching it as a whole key. A member is never removed.').toEqual([]);
    expect(verdicts.filter((v) => v.refused && v.by === null),
      'a refused key with no recorded mechanism means the predicate lost its `by`').toEqual([]);
  });

  it('A2 — the extraction is non-vacuous and every derived set carries a floor', () => {
    expect(SCANNER.sql, 'no _gallery_world_snapshot_is_safe definition matched in any migration').toBeTruthy();
    expect(SCANNER.owner, 'the net-current scanner has no owning migration file').toBeTruthy();
    expect(SQL_ALTS.length, 'SQL scanner denylist alternatives').toBeGreaterThanOrEqual(30);
    expect(HARD_DENY.length, 'net-current scanner hard_deny members').toBeGreaterThanOrEqual(20);
    expect(WORLD_SNAPSHOT_HARD_DENY.length, 'client WORLD_SNAPSHOT_HARD_DENY members').toBeGreaterThanOrEqual(20);
    expect(JS_TOKENS.length, 'client denied-key tokens (COVERT union PRIVATE)').toBeGreaterThanOrEqual(30);
  });

  it('A3 — the struck-member mutant is refused here and accepted by the drift test rule', () => {
    const mutantSql = SCANNER.sql.replace(ARRAY_LITERAL_RE, (literal) =>
      literal.replace(/,?'(?:factionpairstates|envoyerrands|concludedwars)'/g, ''));
    const mutantMembers = hardDenyMembers(mutantSql);
    const mutantAlts = sqlRegexAlternation(mutantSql);
    expect(mutantMembers, 'the mutant must be the net-current array with exactly the three struck, or A3 tests nothing')
      .toEqual(HARD_DENY.filter((member) => !NEW_MEMBERS.includes(member)));
    expect(NEW_MEMBERS.filter((key) => refusalOf(key, mutantMembers, mutantAlts).refused),
      'this predicate must DISCRIMINATE: the struck members are not refused by the mutant').toEqual([]);
    const driftAccepts = (key) => mutantAlts.some((alt) => new RegExp(`^${alt}$`, 'i').test(key));
    expect(JS_TOKENS.filter((token) => !driftAccepts(token)),
      "snapshotDenylistDrift's sqlDenies rule must ACCEPT this mutant: the claim is genuinely unasserted elsewhere").toEqual([]);
  });

  it('A4 — every migration that DECLARES the scanner was read by the extractor', () => {
    const unextractable = SCANNER.declarers.filter((file) => !SCANNER.matchedIn.includes(file));
    expect(unextractable, `declared but unextractable — the guard would go on reading ${SCANNER.owner} while the real`
      + ` net-current definition lives in: ${unextractable.join(', ')}`).toEqual([]);
    const dollarTagged = 'create or replace function public._gallery_world_snapshot_is_safe(value jsonb)\n'
      + 'returns boolean language plpgsql as $fn$ begin return true; end; $fn$;\n';
    const droppedAndRecreated = 'drop function if exists public._gallery_world_snapshot_is_safe(jsonb);\n'
      + 'create function public._gallery_world_snapshot_is_safe(value jsonb)\n'
      + 'returns boolean language plpgsql as $$ begin return true; end; $$;\n';
    const readAs = (source) => [DECLARATION_RE.test(source), Boolean(source.match(DEFINITION_RE))];
    expect(readAs(dollarTagged), 'a $fn$-quoted re-creation is DECLARED and NOT MATCHED').toEqual([true, false]);
    expect(readAs(droppedAndRecreated), 'a drop-then-plain-create is DECLARED and NOT MATCHED').toEqual([true, false]);
  });

  it('A5 — latest-wins is by NUMERIC migration prefix, and the live corpus agrees under both orders', () => {
    const numericOwner = [...SCANNER.declarers].sort((a, b) => numericPrefix(a) - numericPrefix(b)).at(-1);
    const lexicalOwner = [...SCANNER.declarers].sort().at(-1);
    expect([SCANNER.owner, lexicalOwner], 'the orders disagree or the owner is not the highest-numbered declarer:'
      + ` numeric ${numericOwner}, lexical ${lexicalOwner}, extractor owner ${SCANNER.owner}`).toEqual([numericOwner, numericOwner]);
    // A5's SORT FIXTURES, not references. A FOUR-DIGIT prefix is the case that distinguishes
    // numeric order from lexical order, and the live corpus has none — so these name no
    // migration, and tests/security/migrationRefIntegrity.meta.test.js is TOLD so, per literal,
    // rather than left to read them as broken references (run 19's one red; CURE-I).
    // synthetic-migration-name: A5's numeric-vs-lexical sort fixtures; no such migrations exist
    const synthetic = ['089_a.sql', '1000_z.sql', '202_b.sql'];
    expect([[...synthetic].sort().at(-1), [...synthetic].sort((a, b) => numericPrefix(a) - numericPrefix(b)).at(-1)],
      'a four-digit prefix must be a distinguishing case, or A5 asserts nothing about the sort')
      // synthetic-migration-name: the same two fixtures, written out INDEPENDENTLY as the expected
      .toEqual(['202_b.sql', '1000_z.sql']);
  });

  it('A6 — the hard_deny arm is exact equality, not substring, and the mechanism is recorded per key', () => {
    expect(refusalOf('npcStatesCount').by === 'array',
      'Postgres compares lower(key) = any (...) by EXACT equality, so a key merely CONTAINING npcStates is no member').toBe(false);
    expect(refusalOf('xdm'), 'xdm is refused by the alternation and never by the array — recording `by` is what makes a'
      + ' key migrating between the two mechanisms visible instead of invisible inside a boolean')
      .toMatchObject({ refused: true, by: 'alternation' });
  });

  it("A7 — the settlement editor's two persisted keys are refused, with the mechanism recorded", () => {
    const dmLayer = refusalOf('dmLayer');
    const decrees = refusalOf('decrees');
    expect([dmLayer.refused, decrees.refused], 'dmLayer and decrees are DM-private and must both be refused').toEqual([true, true]);
    expect([dmLayer.by, decrees.by].every((by) => by === 'array' || by === 'alternation'),
      'each refusal names the mechanism that produced it. tests/ops/migrationRehearsal.test.js asserts the ARRAY mechanism'
      + ' for these two specifically, which this subset claim does not subsume').toBe(true);
  });

  it('A8 — migration 203 re-creates 202 byte-for-byte outside the hard_deny array literal', () => {
    const path202 = join(MIGRATIONS_DIR, '202_edit_registry_public_denylist.sql');
    const path203 = join(MIGRATIONS_DIR, '203_gallery_scanner_client_mirror_totality.sql');
    expect(existsSync(path203), `${path203} is absent: A8 is the mechanical-diff contract on migration 203`).toBe(true);
    const scannerDefinitionIn = (file) => {
      const hits = readFileSync(file, 'utf8').match(DEFINITION_RE);
      if (!hits) throw new Error(`galleryScannerMirrorTotality: no scanner definition in ${file}`);
      return hits[hits.length - 1].toLowerCase();
    };
    const definition202 = scannerDefinitionIn(path202);
    const definition203 = scannerDefinitionIn(path203);
    const mask = (sql) => sql.replace(ARRAY_LITERAL_RE, '<<ARRAY>>');
    expect(mask(definition202).length, 'the masked residual collapsed — the mask ate the body').toBeGreaterThanOrEqual(3000);
    expect(mask(definition203), '203 differs from 202 OUTSIDE the hard_deny array literal. The alternation, the recursion,'
      + ' immutable, set search_path, the two jsonb_typeof branches and the scalar return are contracted byte-identical')
      .toBe(mask(definition202));
    expect(sqlRegexAlternation(definition203), 'the alternation moved: same alternatives, same order')
      .toEqual(sqlRegexAlternation(definition202));
    const members202 = hardDenyMembers(definition202);
    const members203 = hardDenyMembers(definition203);
    expect(members203.filter((m) => !members202.includes(m)), '203 adds exactly the three missing members').toEqual(NEW_MEMBERS);
    expect(members202.filter((m) => !members203.includes(m)), 'a hard_deny member was REMOVED — the denylist only grows').toEqual([]);
  });
});
