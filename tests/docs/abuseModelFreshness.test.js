/**
 * Freshness guard for docs/abuse-model.md's edge-function inventory.
 *
 * The doc was written in a 4-edge-function era ("All four edge functions ...")
 * and rotted as the surface grew to 13 functions — most importantly, the
 * anonymous (`verify_jwt = false`) sinks it never named. This pins the two
 * facts that drifted so they can't silently drift back:
 *   1. the function count the doc states matches the filesystem, and
 *   2. every anonymous / self-authenticating endpoint is named in the doc.
 *
 * Both are derived from ground truth (the functions dir + config.toml), so the
 * doc has to keep pace when the surface changes.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (rel) => readFileSync(resolve(here, rel), 'utf8');

const doc = read('../../docs/abuse-model.md');
const fnDir = resolve(here, '../../supabase/functions');
const config = read('../../supabase/config.toml');

const edgeFunctions = readdirSync(fnDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== '_shared')
  .map((e) => e.name);

describe('docs/abuse-model.md edge-function freshness', () => {
  it('no longer claims there are only "four edge functions"', () => {
    // The stale sentence that this remediation replaced.
    expect(doc).not.toMatch(/All four edge functions/);
  });

  it('states the same function count the filesystem has', () => {
    const claim = doc.match(/There are \*\*(\d+)\*\* edge functions/);
    expect(claim, 'abuse-model.md should state the edge-function count').toBeTruthy();
    expect(Number(claim[1])).toBe(edgeFunctions.length);
  });

  it('names every anonymous (verify_jwt = false) endpoint', () => {
    // Derive the anon set from config.toml rather than hard-coding it, so a new
    // anon sink that isn't documented fails this test.
    const anon = [...config.matchAll(/\[functions\.([\w-]+)\]\s*\nverify_jwt = false/g)].map(
      (m) => m[1],
    );
    expect(anon.length).toBeGreaterThan(0);
    for (const fn of anon) {
      expect(doc, `abuse-model.md should name the anon endpoint ${fn}`).toContain(fn);
    }
  });

  it('names the newly-documented anonymous sinks explicitly', () => {
    // Regression anchor: these were entirely absent in the 4-function era.
    expect(doc).toContain('ingest-events');
    expect(doc).toContain('log-client-error');
  });
});
