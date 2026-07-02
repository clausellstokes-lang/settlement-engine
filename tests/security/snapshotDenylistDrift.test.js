import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import { COVERT_KEY_RE } from '../../src/domain/display/worldSnapshotPublic.js';

// The gallery world-snapshot denylist lives in THREE hand-mirrored places: the
// client PRIVATE_KEY_RE (publicSafe.js) + COVERT_KEY_RE (worldSnapshotPublic.js),
// and the server-side 089 SQL sanitizer that is documented to mirror their UNION.
// This guard fails the gate if a token is added to either JS regex without being
// added to the SQL (the direction that matters — the client is the source of
// truth and the SQL is the last line before an anon read). It prevents a private
// key silently reaching the gallery because only two of the three copies were updated.

const here = dirname(fileURLToPath(import.meta.url));
const SQL_089 = readFileSync(
  join(here, '../../supabase/migrations/089_publish_map_server_snapshot_sanitize.sql'),
  'utf8',
).toLowerCase();

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
  const tokens = [...new Set([...tokensOf(COVERT_KEY_RE), ...tokensOf(PRIVATE_KEY_RE)])];

  test.each(tokens)('089 SQL sanitizer contains the "%s" token', (token) => {
    expect(SQL_089).toContain(token);
  });
});
