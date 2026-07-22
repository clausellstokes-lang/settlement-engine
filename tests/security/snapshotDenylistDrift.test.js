import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import { COVERT_KEY_RE } from '../../src/domain/display/worldSnapshotPublic.js';
import { jsRegexTokens, sqlRegexAlternation } from '../helpers/sourceContract.js';

// The gallery world-snapshot denylist lives in THREE hand-mirrored places: the
// client PRIVATE_KEY_RE (publicSafe.js) + COVERT_KEY_RE (worldSnapshotPublic.js),
// and the server-side SQL sanitizer public._gallery_world_snapshot_is_safe (089,
// amended net-current by 127) that is documented to mirror their UNION. This guard
// fails the gate if a token is added to either JS regex without being added to the
// SQL (the direction that matters — the client is the source of truth and the SQL is
// the last line before an anon read). It prevents a private key silently reaching the
// gallery because only two of the three copies were updated.
//
// It reads the NET-CURRENT scanner definition (latest-wins across all migrations),
// not a hardcoded file, so a token added in a later amendment (e.g. `_config` in 127)
// is credited to the effective server denylist, not just to the migration that first
// introduced the scanner.

const here = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = resolve(here, '../../supabase/migrations');

/** Latest-wins extraction of the net-current `_gallery_world_snapshot_is_safe`
 *  function body across all migrations (file order). Returns the LAST definition so
 *  drift is checked against the EFFECTIVE server denylist, not a superseded one. */
function netCurrentScannerSql() {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = /create\s+or\s+replace\s+function\s+public\._gallery_world_snapshot_is_safe\b[\s\S]*?\$\$;/ig;
  let last = null;
  for (const f of files) {
    const src = readFileSync(join(MIGRATIONS_DIR, f), 'utf8');
    const matches = src.match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return (last || '').toLowerCase();
}

const SCANNER_SQL = netCurrentScannerSql();

// The JS denylists' concrete denied-key stems (COVERT_KEY_RE ∪ PRIVATE_KEY_RE) and the SQL
// scanner's denylist rebuilt as MEMBERSHIP regexes (comments stripped) — both via the
// fail-closed sourceContract chokepoint. jsRegexTokens throws on a token it cannot
// normalize and sqlRegexAlternation throws if the alternation is absent, so neither set can
// silently shrink to nothing (the old tokensOf `.filter(Boolean)` swallowed mangled tokens).
const JS_TOKENS = [...new Set([
  ...jsRegexTokens(COVERT_KEY_RE.source),
  ...jsRegexTokens(PRIVATE_KEY_RE.source),
])];
const SQL_ALTS = sqlRegexAlternation(SCANNER_SQL);

/** MEMBERSHIP, not substring: a key is server-denied iff SOME SQL alternative matches it as
 *  a WHOLE key. The old test used `SCANNER_SQL.toContain(token)`, so `hook` passed merely
 *  because `plothook` contained it — a genuinely dropped `.*hook.*` alternative would not
 *  have reddened. Here each SQL alternative is applied as `^alt$` against the client token. */
const sqlDenies = (key) => SQL_ALTS.some((alt) => new RegExp(`^${alt}$`, 'i').test(key));

describe('gallery snapshot denylist — SQL mirror stays in sync with the JS regexes', () => {
  test('the net-current server scanner is locatable across the migrations', () => {
    expect(SCANNER_SQL, 'no _gallery_world_snapshot_is_safe found in any migration').toBeTruthy();
  });

  test('the JS token set and the SQL alternation set are both non-vacuous', () => {
    // `test.each([])` registers ZERO cases and passes silently — pin a floor so a parse
    // regression that empties either set fails HERE instead of going green-on-nothing.
    expect(JS_TOKENS.length, 'client denied-key tokens (COVERT ∪ PRIVATE)').toBeGreaterThanOrEqual(30);
    expect(SQL_ALTS.length, 'SQL scanner denylist alternatives').toBeGreaterThanOrEqual(30);
  });

  test.each(JS_TOKENS)('the net-current SQL sanitizer denies the "%s" key (membership)', (token) => {
    expect(
      sqlDenies(token),
      `client denylist token "${token}" is NOT covered by the net-current SQL scanner — a `
        + 'private key the client drops could reach the gallery (only 2 of the 3 mirrors updated).',
    ).toBe(true);
  });
});
