/**
 * deployEdgeUngatedWarning.test.js — pins the honest edge-deploy risk callout.
 *
 * The client deploy is fail-closed CI-gated (vercel-ignore-build.mjs) and the DB
 * has the applied-head.json currency gate, but edge functions ship via a bare
 * `npx supabase functions deploy` from the local tree: no CI-green check, no
 * clean-tree check, and no deployed-head ledger analog. `check-edge-behavior.mjs`
 * is additionally FAIL-OPEN when deno is missing (exits 0 / skips). That asymmetry
 * across the money + auth trust boundary is a real operational hazard, so DEPLOY.md
 * MUST warn operators about it and prescribe the substituting discipline. This guard
 * fails if that callout is ever dropped.
 *
 * Cohesive with tests/docs/docCounts.test.js and the "claims carry enforcement"
 * meta-pin: an operational doc's safety guidance is load-bearing, so it is pinned.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const deployMd = readFileSync(resolve(repo, 'docs/DEPLOY.md'), 'utf8');

describe('DEPLOY.md surfaces the ungated edge-deploy hazard', () => {
  it('names edge deploy as the ungated path to production', () => {
    expect(deployMd).toMatch(/ungated path to production/i);
  });

  it('prescribes deploying only from a clean tree at a CI-green, pushed commit', () => {
    expect(deployMd).toMatch(/clean/i);
    expect(deployMd).toMatch(/git status/i);
    expect(deployMd).toMatch(/CI-green|CI is green|green commit/i);
  });

  it('warns there is no deployed-head ledger analog for edge functions', () => {
    // Something must record/note the live commit by hand, since (unlike the
    // migration ledger) nothing records which commit's functions are live.
    expect(deployMd).toMatch(/records?\s+which commit/i);
    expect(deployMd).toMatch(/\bSHA\b/);
  });

  it('warns that the edge behavioral check is FAIL-OPEN when deno is missing', () => {
    expect(deployMd).toMatch(/fail-open/i);
    expect(deployMd).toMatch(/deno is absent|deno is missing|without deno|deno.*PATH/i);
  });
});
