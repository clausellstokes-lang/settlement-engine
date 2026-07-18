/**
 * tests/design/deepCraftKillList.test.js — THE DEEP CRAFT KILL-LIST RATCHETS
 * (annex §Enforcement; written FIRST, before any surface moved — phase 0a).
 *
 * The owner ruled the overhaul incomplete: materials landed but the SaaS
 * STRUCTURE survived — white rounded cards, shadows, tinted callouts, off-palette
 * washes. These four scanners count that structure across src/components (the
 * title-census walker idiom: a source grep with a frozen ceiling) and are
 * MONOTONE-DECREASING: a count above its ceiling is a regression (new SaaS
 * structure landed); when a sweep lowers a count, LOWER the ceiling in the same
 * commit (lock the win). THE WAVE CANNOT CLOSE ABOVE ZERO — phase D checks these
 * ceilings are 0, and the deep recompositions burn them down cluster by cluster.
 *
 * Counts are LINE-match counts (grep -r pattern | wc -l equivalent) over every
 * .js/.jsx file under src/components — stable, reproducible, and cheap.
 *
 * FROZEN 2026-07-18 at the wave's base (THE COMPOSITE 78a04afc):
 *   borderRadius 1097 · boxShadow 118 · rgba( 275 · tinted-callout tokens 251
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'src', 'components');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (/\.(js|jsx)$/.test(name)) yield p;
  }
}

/** grep -r <re> src/components --include=*.{js,jsx} | wc -l  (line matches) */
function countLines(re) {
  let n = 0;
  for (const f of walk(ROOT)) {
    for (const line of readFileSync(f, 'utf-8').split('\n')) {
      if (re.test(line)) n += 1;
    }
  }
  return n;
}

// ── THE CEILINGS — shrink-only; lower in the same commit as each win. ─────────
const CEILINGS = Object.freeze({
  // Lowered 2026-07-18 (cluster 1, THE GAUGE): borderRadius 1097→1095,
  // boxShadow 118→117, rgba 275→273 — the hero size cards and the hero
  // plate's shadow/radius fell to the scale-rule recomposition.
  borderRadius: 1095,   // the rounded-card tell — plates are rule-framed, not rounded
  boxShadow: 117,       // print has no z-axis — depth is ink, never elevation
  rgbaLiterals: 273,    // off-palette translucent washes — ink tones come from the ramp
  tintedCallouts: 251,  // the tinted callout box — replaced by rubric-headed clerk's notes
});

const PATTERNS = Object.freeze({
  borderRadius: /borderRadius/,
  boxShadow: /boxShadow/,
  rgbaLiterals: /rgba\(/,
  tintedCallouts: /VIOLET_BG|AMBER_BG|GREEN_BG|RED_BG|BLUE_BG|GOLD_BG|successBg|dangerBg|infoBg|warningBg/,
});

describe('THE DEEP CRAFT kill-list ratchets (shrink-only; zero closes the wave)', () => {
  for (const [name, ceiling] of Object.entries(CEILINGS)) {
    it(`${name}: count <= ${ceiling} (grew = new SaaS structure; shrank = lower this ceiling)`, () => {
      const count = countLines(PATTERNS[name]);
      expect(count, `${name} grew past its frozen ceiling — new SaaS structure landed`).toBeLessThanOrEqual(ceiling);
      // The lock-the-win nudge: if the real count is far under the ceiling, the
      // sweep forgot to lower it. Tolerance 0 — the ceiling IS the count.
      expect(count, `${name} shrank to ${count} — LOWER the ceiling to lock the win`).toBe(ceiling);
    });
  }
});
