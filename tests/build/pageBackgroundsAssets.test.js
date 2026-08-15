/**
 * tests/build/pageBackgroundsAssets.test.js — the page-background asset gate.
 *
 * Every painting the app can show ships in TWO formats under
 * public/backgrounds/: the original <name>.jpg (universal fallback) and a
 * smaller <name>.webp twin built by `npm run optimize:backgrounds`
 * (scripts/optimize-backgrounds.mjs). The runtime (src/config/pageBackgrounds.js)
 * serves WebP to engines that decode it and JPEG to the rest, so BOTH files
 * must exist for every referenced view + generation-mode scene.
 *
 * This gate enforces two things a careless change would otherwise break:
 *   1. Both-format coverage — add a new background to pageBackgrounds.js and
 *      forget to run the optimizer (or commit the .webp), and CI fails here
 *      instead of shipping a 404 to WebP browsers.
 *   2. A per-file WebP byte budget — a NEW oversized background (a raw export,
 *      a 2×/4× image) trips the gate rather than silently re-inflating the
 *      perf tail the WebP pass was added to trim.
 *
 * Source of truth for "referenced" is the config's own exported maps, so the
 * gate tracks the app automatically as views come and go.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { PAGE_BACKGROUNDS, MODE_BACKGROUNDS } from '../../src/config/pageBackgrounds.js';

const BG_DIR = resolve(process.cwd(), 'public', 'backgrounds');

// Every basename the app can paint: per-view paintings + the three
// generation-mode settlement scenes (which also blow up as the flow bg).
const referenced = [
  ...new Set([...Object.values(PAGE_BACKGROUNDS), ...Object.values(MODE_BACKGROUNDS)]),
].sort();

// Per-file WebP ceiling. The quality-72 twins of these detailed painterly
// sources top out at ~417 KB (thorpe) — the perf brief's 160 KB guess isn't
// reachable without downscaling below native resolution (out of scope). This
// budget is the measured max + ~15% headroom: a legitimately re-optimized
// twin never false-fails, but a background committed at full un-optimized
// weight (or a high-DPI export) blows past it and fails the gate.
const WEBP_BUDGET_BYTES = 491_520; // 480 KB

describe('page-background assets', () => {
  it('references at least one background (config sanity)', () => {
    expect(referenced.length).toBeGreaterThan(0);
  });

  describe('every referenced painting ships in both jpg and webp', () => {
    for (const name of referenced) {
      it(`${name}: jpg + webp both present on disk`, () => {
        const jpg = join(BG_DIR, `${name}.jpg`);
        const webp = join(BG_DIR, `${name}.webp`);
        expect(existsSync(jpg), `${name}.jpg missing — source painting absent`).toBe(true);
        expect(
          existsSync(webp),
          `${name}.webp missing — run \`npm run optimize:backgrounds\` and commit the twin`,
        ).toBe(true);
      });
    }
  });

  it(`no referenced webp exceeds the ${WEBP_BUDGET_BYTES}-byte budget`, () => {
    const offenders = [];
    for (const name of referenced) {
      const webp = join(BG_DIR, `${name}.webp`);
      if (!existsSync(webp)) continue; // existence enforced by the test above
      const size = statSync(webp).size;
      if (size > WEBP_BUDGET_BYTES) {
        offenders.push(`${name}.webp = ${size} bytes (${(size / 1024).toFixed(1)} kB)`);
      }
    }
    expect(
      offenders,
      `WebP over budget (${WEBP_BUDGET_BYTES} bytes / 480 kB) — re-run the optimizer or shrink the source:\n  ${offenders.join('\n  ')}`,
    ).toHaveLength(0);
  });

  it('every referenced webp is smaller than its jpg (WebP must never regress bytes)', () => {
    const regressions = [];
    for (const name of referenced) {
      const jpg = join(BG_DIR, `${name}.jpg`);
      const webp = join(BG_DIR, `${name}.webp`);
      if (!existsSync(jpg) || !existsSync(webp)) continue;
      const jpgSize = statSync(jpg).size;
      const webpSize = statSync(webp).size;
      if (webpSize >= jpgSize) {
        regressions.push(`${name}: webp ${webpSize} >= jpg ${jpgSize} bytes`);
      }
    }
    expect(
      regressions,
      `WebP twin is not smaller than its JPEG — lower the optimizer quality:\n  ${regressions.join('\n  ')}`,
    ).toHaveLength(0);
  });
});
