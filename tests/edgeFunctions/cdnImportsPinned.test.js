/**
 * cdnImportsPinned.test.js — [critic-4] every edge-function CDN import is EXACT-pinned.
 *
 * Generalizes supabaseJsPinned.test.js beyond @supabase/supabase-js to the WHOLE
 * request-/build-time supply-chain surface the edge functions pull from third-party
 * CDNs: every esm.sh package (@supabase/supabase-js, stripe, @resvg/resvg-wasm, …) and
 * every deno.land/std module must carry an exact @X.Y.Z version. A floating / major-only
 * specifier lets the CDN resolve to whatever the newest matching build is at deploy time,
 * so two deploys of the same function can silently ship different bytes — a supply-chain
 * + reproducibility hazard on a live money/auth surface, and (for og-image's request-time
 * @resvg/resvg-wasm wasm fetch) on a public endpoint's integrity.
 *
 * This is the pinned-versions manifest WALKER (the vendored-libs manifest idiom applied to
 * remote URL pins rather than sha256 file hashes). npm `audit --audit-level=high --omit=dev`
 * already gates the npm dependency tree in CI (ci.yml); npm audit cannot see esm.sh/deno
 * URLs, so this test is the currency net for the CDN surface it is blind to.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FUNCTIONS_DIR = join(ROOT, 'supabase/functions');

/** Recursively collect every .ts source under supabase/functions (skip generated bundles). */
function collectTsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectTsFiles(full));
    else if (entry.name.endsWith('.ts')) out.push(full);
  }
  return out;
}

// esm.sh/<pkg>@<ver>  (pkg may be scoped: @scope/name). Version stops at / ? ' " space.
const ESM_RE = /esm\.sh\/(@?[\w./-]+?)@([^/'"?\s]+)/g;
// deno.land/std@<ver>/...
const DENO_STD_RE = /deno\.land\/std@([^/'"?\s]+)/g;
// Exact pin: X.Y.Z (three numeric segments) — 2.108.2, 14.14.0, 0.177.0, 2.6.2.
const EXACT_RE = /^\d+\.\d+\.\d+$/;

/** { file, specifier, version } for every CDN pin in the tree. */
function gatherCdnPins() {
  const out = [];
  for (const file of collectTsFiles(FUNCTIONS_DIR)) {
    const src = readFileSync(file, 'utf8');
    const rel = file.slice(ROOT.length + 1);
    for (const m of src.matchAll(ESM_RE)) out.push({ file: rel, specifier: `esm.sh/${m[1]}@${m[2]}`, version: m[2] });
    for (const m of src.matchAll(DENO_STD_RE)) out.push({ file: rel, specifier: `deno.land/std@${m[1]}`, version: m[1] });
  }
  return out;
}

describe('edge-function CDN imports are exact-pinned (critic-4)', () => {
  const pins = gatherCdnPins();

  it('finds a non-trivial number of CDN imports (walker did not silently break)', () => {
    expect(pins.length).toBeGreaterThanOrEqual(10);
  });

  it('every esm.sh / deno.land CDN import carries an exact @X.Y.Z version', () => {
    const floating = pins
      .filter((p) => !EXACT_RE.test(p.version))
      .map((p) => `${p.file}: ${p.specifier}`);
    expect(
      floating,
      `edge CDN imports must pin an exact @X.Y.Z version; floating/major-only found:\n${floating.join('\n')}`,
    ).toEqual([]);
  });

  it('og-image pins its request-time @resvg/resvg-wasm wasm dependency to an exact version', () => {
    // The public og-image endpoint dynamic-imports @resvg/resvg-wasm from esm.sh at request
    // time (and fetches its index_bg.wasm) — pin it so a CDN drift can't change the bytes a
    // cold render pulls. (Whether to VENDOR the wasm onto the app origin is a deploy-posture
    // decision routed to the owner; the exact pin is the in-loop currency guard.)
    const resvg = pins.filter((p) => p.specifier.includes('@resvg/resvg-wasm'));
    expect(resvg.length).toBeGreaterThan(0);
    for (const p of resvg) expect(p.version, `${p.file}: ${p.specifier}`).toMatch(EXACT_RE);
  });
});
