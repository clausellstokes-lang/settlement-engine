import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import { COVERT_KEY_RE } from '../../src/domain/display/worldSnapshotPublic.js';

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

/** Extract the alternation tokens from a `/(a|b|\bc)/i` regex, stripped of
 *  regex boundary/anchor noise so we compare the semantic key stem. */
function tokensOf(re) {
  const body = re.source.replace(/^\(/, '').replace(/\)$/, '');
  return body
    .split('|')
    .map((t) => t.replace(/\\[bm]/g, '').replace(/[()^$?]/g, '').trim().toLowerCase())
    .filter(Boolean);
}

describe('gallery snapshot denylist — SQL mirror stays in sync with the JS regexes', () => {
  test('the net-current server scanner is locatable across the migrations', () => {
    expect(SCANNER_SQL, 'no _gallery_world_snapshot_is_safe found in any migration').toBeTruthy();
  });

  const tokens = [...new Set([...tokensOf(COVERT_KEY_RE), ...tokensOf(PRIVATE_KEY_RE)])];

  test.each(tokens)('net-current SQL sanitizer contains the "%s" token', (token) => {
    expect(SCANNER_SQL).toContain(token);
  });
});
