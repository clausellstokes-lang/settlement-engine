/**
 * tests/design/organicFixtureLeak.test.js — SAMPLE FICTION NEVER LEAKS TO LIVE
 * SURFACES (review revision #4, structural prevention).
 *
 * The phase-2 sample set typesets AUTHORED FICTION (a "Wanderer" tier, hand-typed
 * prices, Thornwall's crisis). Live surfaces must never import it: tier names come
 * from the entitlement/copy registries and every price/credit/seat figure
 * interpolates from config (the pricing copy law). This source-scan asserts that
 * NOTHING outside src/components/organic/samples/ (and tests) imports the samples
 * directory — so a hand-typed sample number can never reach a live surface via an
 * import. (New sample screens stay legal; wiring one into the app fails here.)
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const SRC = resolve(process.cwd(), 'src');
const SAMPLES_DIR = join('src', 'components', 'organic', 'samples');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (/\.(js|jsx)$/.test(name)) yield p;
  }
}

describe('organic samples — the fiction stays in the fixtures', () => {
  it('no live source file imports the samples directory', () => {
    const offenders = [];
    for (const file of walk(SRC)) {
      const rel = relative(process.cwd(), file).replace(/\\/g, '/');
      if (rel.startsWith(SAMPLES_DIR.replace(/\\/g, '/'))) continue; // the samples themselves
      const code = readFileSync(file, 'utf-8');
      if (/from\s+['"][^'"]*organic\/samples\//.test(code) || /import\(\s*['"][^'"]*organic\/samples\//.test(code)) {
        offenders.push(rel);
      }
    }
    expect(offenders, `live code importing sample fiction: ${offenders.join(', ')}`).toEqual([]);
  });

  it('distinctive fixture prose appears nowhere in live source (copy-paste guard)', () => {
    // NOTE (verified 2026-07-18): "Wanderer" is NOT sample fiction — it is the
    // registry's real free-tier display name (src/config/pricing.js TIER_NAMES.free),
    // so the phase-2 sample coincidentally used the real name and a name-ban would
    // red on legitimate code. The honest guard is (a) the import ban above and
    // (b) this scan for the fixtures' distinctive AUTHORED prose — if a sentence or
    // invented proper noun from the fixtures shows up in live src, someone pasted
    // sample fiction into a live surface.
    const MARKERS = [
      'Redwater Ford',            // fixture settlement
      'The harbour silts',        // fixture crisis label
      'Dovey Ash',                // fixture NPC
      'Maru of the Tide',         // fixture deity
      'trusts none of them',      // fixture NPC trait fragment
    ];
    const offenders = [];
    for (const file of walk(SRC)) {
      const rel = relative(process.cwd(), file).replace(/\\/g, '/');
      if (rel.startsWith(SAMPLES_DIR.replace(/\\/g, '/'))) continue;
      const code = readFileSync(file, 'utf-8');
      for (const m of MARKERS) if (code.includes(m)) offenders.push(`${rel} (${m})`);
    }
    expect(offenders, `fixture prose found in live code: ${offenders.join(', ')}`).toEqual([]);
  });
});
