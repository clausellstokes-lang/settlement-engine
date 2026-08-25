/**
 * domainAnyCastBaseline.test.js — the domain any-cast + ts-suppression ratchet.
 *
 * The strict burn-down (domainStrictBaseline.test.js) holds src/domain at ZERO
 * strict errors — but part of that zero was bought with suppression: hundreds
 * of `@type {any}`-style JSDoc casts and a handful of `@ts-ignore` /
 * `@ts-expect-error` directives. A "strict-0" gate is blind to that debt: a
 * fresh `@type {any}` keeps the gate green while silently regrowing the holes
 * the burn-down closed. This ratchet makes the suppression debt itself a
 * frozen, MONOTONE-DOWN number (scripts/count-domain-any.mjs is the counter;
 * tests/lint/.domain-any-baseline.json is the frozen per-file baseline):
 *   - a file ABOVE its baseline (or a new file with any debt) FAILS — fix the
 *     types, do not widen the baseline;
 *   - a file BELOW its baseline (or a stale entry) FAILS with the ratchet-down
 *     instruction (`node scripts/count-domain-any.mjs --update`) so the
 *     baseline can never go stale — the raw-button exact-set idiom;
 *   - the committed total can never rise past the pinned CEILING, even via
 *     `--update` (the domain-strict CEILING idiom).
 *
 * Debt is counted per OCCURRENCE (each `any`/`*` type-token, each directive),
 * not per annotation or per file — occurrence count is split-invariant:
 * relocating annotations to a new sibling file cannot trip it; only replacing
 * a hole with a real type lowers it. The detector is pinned honest below by
 * unit fixtures (multi-line typedefs, prose "any", comment-gutter stars).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { countDomain, countText } from '../../scripts/count-domain-any.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// Committed any+suppress ceiling — lower it as holes are typed; NEVER raise.
// (2026-07-09 start: 1196. First burn-down — crisisLifecycle payload/entry/
// condition typing, 41 → 6 — landed the ratchet at 1161.)
//
// (2026-07-10 — ONE-TIME subsystem-adoption raise, 1161 → 1720. The worldPulse
// war/trade/religion reconciliation merge brings a new lineage of leaf modules
// (religionState, pantheon, relationshipState, subsystemActivation), the region
// contest primitives (contestMath/contestOverThirdParty), clone/resolveTerrain,
// display/pantheonDepth, and the dormant deity exports — all "loose by design"
// per the reference tree's own sim-shape typedef notes. W2a-prep lands the leaf
// substrate at total 1247; the ceiling is set at 1720 to absorb W2a-main's
// remaining war/trade modules (warDeployment, occupation, tradeWar, etc.) WITHOUT
// a second ceiling churn. Monotone-DOWN thereafter: burn holes as the sim types
// are enumerated — never raise past 1720.)
//
// (projection corrected to measurement at main-port landing, 2026-07-10 —
// 1720 → 2291. Same adoption event, not a second raise: 1720 was W2a-prep's
// PRE-MERGE projection of the main port's debt; the landed merge (pulseKernel +
// the full war/trade/religion module set + the 33 three-way both-file merges)
// measures 2291. Monotone-down hereafter; burn-down pass scheduled wave 5
// (worst: warDeployment, occupation, tradeWar).)
//
// (wave 5b burn-down, 2026-07-10 — 2291 → 2252. The war/trade/occupation modules
// get named, index-signature-backed sim-shape typedefs (src/domain/worldPulse/
// pulseShapes.js): warDeployment 89→64, occupation 40→28, tradeWar 39→19. JSDoc-
// only, zero runtime change (golden byte-identical), strict-0 preserved. The
// shared pulseShapes module carries an 18-hole fixed cost that amortizes as more
// war/pulse files adopt the shapes — the mechanism is now in place for the next
// wave to keep burning down factionCompetition/npcAgency/institutionLifecycle/
// etc. Ceiling lowered to the measured total. Monotone-down; never raise.)
const CEILING = 2252;

const baseline = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.domain-any-baseline.json'), 'utf8'));
const current = countDomain();

describe('domain any-cast ratchet — the detector is honest', () => {
  test('counts every any/star form this codebase actually writes', () => {
    expect(countText('/** @type {any} */').any).toBe(1);
    expect(countText('/** @type {any[]} */').any).toBe(1);
    expect(countText('/** @type {*} */').any).toBe(1);
    expect(countText('/** @param {Record<string, any>} x */').any).toBe(1);
    expect(countText('/** @returns {Map<string, any>} */').any).toBe(1);
    // Inline object types count each hole, not each annotation.
    expect(countText('/** @param {{ a: any, b: any[], c: * }} x */').any).toBe(3);
    // Multiple tags on one line.
    expect(countText('/** @param {any} a @returns {any} */').any).toBe(2);
    // Multi-line type expressions (wrapped @typedef / @returns).
    expect(countText([
      '/**',
      ' * @typedef {{ a: any,',
      ' *   b: Record<string, any>,',
      ' *   c: * }} Wrapped',
      ' */',
    ].join('\n')).any).toBe(3);
  });

  test('never counts prose, identifiers, or comment gutters as holes', () => {
    // "any" in a tag DESCRIPTION (outside the type braces) is prose.
    expect(countText('/** @param {unknown} items  candidate array (any shape tolerated) */').any).toBe(0);
    expect(countText('/** @property {boolean} ok  false if any violations were found */').any).toBe(0);
    // "any" inside a type as part of an identifier is not the any type.
    expect(countText('/** @type {Company} */').any).toBe(0);
    expect(countText('/** @param {anyThing} x */').any).toBe(0);
    // The JSDoc continuation gutter's `*` is not the star type.
    expect(countText([
      '/**',
      ' * @typedef {{ a: string,',
      ' *   b: number }} Clean',
      ' */',
    ].join('\n')).any).toBe(0);
    // `*/` closers and `**` are never star types; untyped @param has no braces.
    expect(countText('/** @param x plain doc, no type */').any).toBe(0);
  });

  test('counts suppression directives, not prose about them', () => {
    expect(countText('// @ts-ignore').suppress).toBe(1);
    expect(countText('// @ts-expect-error -- legacy shape').suppress).toBe(1);
    // canonicalAccessors.js prose: "The two @ts-expect-errors below" — plural,
    // not a directive.
    expect(countText('// (The two @ts-expect-errors below are narrowing workarounds)').suppress).toBe(0);
    expect(countText('// @ts-ignore\n// @ts-expect-error').suppress).toBe(2);
  });
});

describe('domain any-cast ratchet — frozen baseline governance', () => {
  test('baseline totals equal the sum of their per-file counts (no stale drift)', () => {
    const anySum = Object.values(baseline.files).reduce((a, f) => a + f.any, 0);
    const supSum = Object.values(baseline.files).reduce((a, f) => a + f.suppress, 0);
    expect(baseline.totalAny).toBe(anySum);
    expect(baseline.totalSuppress).toBe(supSum);
    expect(baseline.total).toBe(anySum + supSum);
  });

  test('every baselined file is a src/domain file carrying real debt', () => {
    for (const [file, { any, suppress }] of Object.entries(baseline.files)) {
      expect(file.startsWith('src/domain/'), `${file} is outside the domain`).toBe(true);
      expect(Number.isInteger(any) && any >= 0, `${file} has a malformed any count`).toBe(true);
      expect(Number.isInteger(suppress) && suppress >= 0, `${file} has a malformed suppress count`).toBe(true);
      expect(any + suppress, `${file} is a zero-debt entry — remove it (run --update)`).toBeGreaterThan(0);
    }
  });

  test('no file exceeds its baseline (new files get 0) — fix the types, do not widen', () => {
    const regressions = [];
    for (const [file, { any, suppress }] of Object.entries(current.files)) {
      const base = baseline.files[file] ?? { any: 0, suppress: 0 };
      if (any > base.any) regressions.push(`${file}: ${any} any-holes (baseline ${base.any})`);
      if (suppress > base.suppress) regressions.push(`${file}: ${suppress} ts-suppressions (baseline ${base.suppress})`);
    }
    expect(regressions, `any-cast debt grew — replace the any/* / ts-ignore with a real type:\n  ${regressions.join('\n  ')}`).toEqual([]);
  });

  test('no file is below its baseline — ratchet down instead of leaving slack', () => {
    // Slack in the baseline is headroom a future regression could hide in.
    // After a burn-down, freeze the win: node scripts/count-domain-any.mjs --update
    const stale = [];
    for (const [file, base] of Object.entries(baseline.files)) {
      const cur = current.files[file] ?? { any: 0, suppress: 0 };
      if (cur.any < base.any || cur.suppress < base.suppress) {
        stale.push(`${file}: now ${cur.any} any / ${cur.suppress} suppress (baseline ${base.any}/${base.suppress})`);
      }
    }
    expect(stale, `debt shrank below the baseline — lock it in with \`node scripts/count-domain-any.mjs --update\`:\n  ${stale.join('\n  ')}`).toEqual([]);
  });

  test('baseline exactly matches the tree (airtight against any drift mode)', () => {
    expect(current.files).toEqual(baseline.files);
    expect(current.total).toBe(baseline.total);
  });

  test('the committed ceiling never rises (ratchet is monotone-down)', () => {
    expect(baseline.total).toBeLessThanOrEqual(CEILING);
  });
});
