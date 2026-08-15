/**
 * Source contract for the custom-content edge trust boundary.
 *
 * Full behavior is exercised through customContentCore in the domain suite. This
 * pin prevents the HTTP shell from reintroducing client-owned schema widening.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');
const source = readFileSync(
  resolve(root, 'supabase/functions/custom-content/index.ts'),
  'utf8',
);

describe('custom-content edge manifest authority', () => {
  it('accepts only a version handshake and compares it to the server artifact', () => {
    expect(source).toContain('requestedManifestVersion(body)');
    expect(source).toContain("error: 'custom_content_manifest_stale'");
    expect(source).toContain('CUSTOM_CONTENT_MANIFEST_VERSION');
  });

  it('does not rebuild authority from posted buckets or fields', () => {
    expect(source).not.toContain('coerceVocabulary');
    expect(source).not.toContain('rawMech');
    expect(source).not.toContain('r.mechanicalFields');
    expect(source).not.toContain('r.flavorFields');
  });
});

