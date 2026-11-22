/**
 * THE VENDORED EDGE MODULES ARE THE LOCK'S BYTES.
 *
 * deno.json sets `"vendor": true`, so `deno check --frozen` and `deno test --frozen`
 * read the edge functions' remote modules from vendor/ and never fetch esm.sh or
 * deno.land in CI. Deno trusts a vendored file as local and does not re-hash it
 * against deno.lock, so this test is where the lock keeps its grip: every runtime
 * module the lock pins (`remote`: url → sha256) must be present in vendor/ with
 * exactly those bytes. A tampered or missing vendored module reds here; a type
 * declaration (not in the lock, never executed) is outside its reach by design.
 *
 * Why vendor at all: esm.sh served two builds of one pinned URL within two days
 * (ODQ §934.103), so a bare hash pin could never be stable; the bytes the lock
 * names now live in the tree, reviewed as a diff. Refresh recipe: docs/DEPLOY.md,
 * "Refreshing the vendored edge modules".
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const VENDOR = join(ROOT, 'vendor');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

describe('the vendored edge modules carry the lock\'s bytes', () => {
  const lock = JSON.parse(readFileSync(join(ROOT, 'deno.lock'), 'utf8'));
  const remote = lock.remote ?? {};
  const urls = Object.keys(remote);

  it('deno.json vendors the remote modules', () => {
    const denoJson = JSON.parse(readFileSync(join(ROOT, 'deno.json'), 'utf8'));
    expect(denoJson.vendor).toBe(true);
  });

  it('the lock pins a non-trivial remote graph', () => {
    expect(urls.length).toBeGreaterThan(100);
    expect(statSync(VENDOR).isDirectory()).toBe(true);
  });

  it('every locked remote module is vendored with exactly the locked bytes', () => {
    const files = walk(VENDOR).filter((f) => !f.endsWith('manifest.json'));
    const byHash = new Map();
    for (const f of files) byHash.set(sha256(f), relative(ROOT, f));
    const missing = urls.filter((url) => !byHash.has(remote[url]));
    // Anchor: a module the lock names whose bytes are absent from vendor/ is a
    // tampered or stale vendoring, and the list below names it.
    expect(missing, `locked modules absent from vendor/ (or vendored with other bytes):\n${missing.join('\n')}`).toEqual([]);
  });
});
