/**
 * embeddedMapConsoleGate.walker.test.js — THE EMBEDDED MAP DOES NOT TALK TO VISITORS
 * (REVIEW-P F15, ODQ §934.63).
 *
 * ── THE CLASS ───────────────────────────────────────────────────────────────────
 * REVIEW-P walked the whole anonymous public path on both viewports and found exactly
 * one route with anything in its console. `/realm` printed three lines:
 *
 *     warning: Generate random map
 *     warning: Unresolved depressions: 21. Edit heightmap to fix
 *     warning: TOTAL: 0.31s
 *
 * Every other public route was clean. The three come from the vendored Fantasy Map
 * Generator fork under `public/map/`, which FMG ships as a developer tool and we ship as a
 * product surface; all three are guarded by the fork's `WARN` channel, and `INFO`, `TIME`
 * and `WARN` were all vendored in flat-`true` at the original import (`f386f48d96`) while
 * `PRODUCTION` — FMG's own dev switch, declared on the line above them — was read nowhere
 * in `public/map/**`. The cure reads it (`docs/fmg-fork.md` §2, the `~8–30` row).
 *
 * ── WHY THIS WALKER IS SOURCE-LEVEL, STATED OUTRIGHT ───────────────────────────
 * The law is "the realm route logs nothing on a deployed host". The honest runtime pin
 * needs a browser AND a non-loopback hostname, which no vitest environment has. So this
 * walker proves the same thing one layer down, and proves it by EXECUTION rather than by
 * text match: it lifts each channel's gate expression out of `public/map/main.js` and RUNS
 * it under a synthetic deployed-host environment and a synthetic localhost one. A gate that
 * has been flattened back to `true` fails the first, which is exactly the regression.
 *
 * ⛔ WHAT IT DOES NOT CLAIM. `public/map/**` holds 49 console calls that carry no channel
 * guard at all — 22 of them inside vendored third-party libs (tinymce, jquery, polylabel),
 * the rest on error and conditional paths in `sf-bridge.js` (9), `main.js` (6),
 * `modules/io/cloud.js` (2) and `modules/io/load.js` (1). None of them fired on the realm
 * load REVIEW-P measured, so they are not the walked defect and they are not frozen here.
 * Closing that wider class needs its own register with a reason per site; it is named in
 * this lane's report rather than smuggled in under F15.
 *
 * ── THE ARMS ────────────────────────────────────────────────────────────────────
 *   1. `PRODUCTION` is still declared (the gate would otherwise reference a phantom and
 *      `!undefined` would silently mean "always verbose").
 *   2. INFO / TIME / WARN are OFF on a deployed host, ON on localhost, and each re-openable
 *      through its own `debug` localStorage key. Executed, per channel, per environment.
 *   3. ERROR is unconditional — an error must still reach the console.
 *   4. THE CONTROL: the PRE-CURE source shape (`const WARN = true;`) is pushed through the
 *      same extractor and evaluator and asserted to come out TRUE on a deployed host. The
 *      detector therefore demonstrably separates the cured shape from the vendored one, and
 *      arm 2 cannot be passing because the extractor found nothing.
 *   5. The three emitters REVIEW-P measured still carry their `WARN &&` guard, so a
 *      re-vendor that keeps the flags but drops a guard reds here too.
 *   6. `console.time` and `console.timeEnd` stay paired and BOTH `TIME`-guarded (64 and 64).
 *      An unpaired `timeEnd` under a muted `TIME` is a new console warning in its own right
 *      ("Timer 'x' does not exist"), which would make the cure the defect.
 *   7. The vendor build bundle `index-*.js` is NOT patched: its `Unresolved depressions`
 *      emitter is asserted present and still channel-guarded, because a fork patch inside a
 *      regenerated bundle is a patch that dies at the next FMG upgrade.
 *
 * @enforced-by docs/fmg-fork.md §2 (the upgrade runbook row this walker is named in)
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MAP_DIR = join(ROOT, 'public/map');
const MAIN = readFileSync(join(MAP_DIR, 'main.js'), 'utf8');

/** The channels whose output a visitor must never see on a deployed host. */
const MUTED_CHANNELS = ['INFO', 'TIME', 'WARN'];

/** Lift `const <NAME> = <expr>;` out of the fork's flag block. */
function gateExprOf(src, name) {
  const m = src.match(new RegExp(`^const ${name} = (.+);\\s*$`, 'm'));
  return m === null ? null : m[1];
}

/**
 * RUN a lifted gate expression under a synthetic environment. `new Function` rather than a
 * regex is the whole point: the arm must fail when the expression's MEANING regresses, not
 * only when its spelling does. (The `fnv1a32Identity` walker uses the same device.)
 */
function evaluateGate(expr, { PRODUCTION, DEBUG = {} }) {
  const fn = new Function('PRODUCTION', 'DEBUG', `return (${expr});`);
  return Boolean(fn(PRODUCTION, DEBUG));
}

/** FMG's own constant: truthy on any host that is not loopback. */
const DEPLOYED = { PRODUCTION: true };
const LOCALHOST = { PRODUCTION: false };

describe('the embedded map fork declares a real DEV switch', () => {
  test('PRODUCTION is still declared, so the gates below are not reading a phantom', () => {
    const decl = MAIN.match(/^const PRODUCTION = (.+);\s*$/m);
    expect(decl, 'public/map/main.js no longer declares PRODUCTION').not.toBe(null);
    expect(decl[1]).toContain('location.hostname');
    // And it really is a loopback test in both spellings the dev server uses.
    expect(decl[1]).toContain('"localhost"');
    expect(decl[1]).toContain('"127.0.0.1"');
  });

  test('every muted channel has a gate expression to evaluate', () => {
    for (const ch of MUTED_CHANNELS) {
      expect(gateExprOf(MAIN, ch), `public/map/main.js declares no const ${ch}`).not.toBe(null);
    }
  });
});

describe('the diagnostic channels are OFF for a visitor and ON for a developer', () => {
  test.each(MUTED_CHANNELS)('%s is muted on a deployed host', (ch) => {
    expect(
      evaluateGate(gateExprOf(MAIN, ch), DEPLOYED),
      `${ch} prints on a deployed host: this is REVIEW-P F15 returning`,
    ).toBe(false);
  });

  test.each(MUTED_CHANNELS)('%s still speaks on localhost', (ch) => {
    expect(
      evaluateGate(gateExprOf(MAIN, ch), LOCALHOST),
      `${ch} is muted in development too, which throws the diagnostics away instead of gating them`,
    ).toBe(true);
  });

  test.each(MUTED_CHANNELS)('%s re-opens on a deployed host through its debug key', (ch) => {
    const key = ch.toLowerCase();
    expect(
      evaluateGate(gateExprOf(MAIN, ch), { PRODUCTION: true, DEBUG: { [key]: true } }),
      `the debug door does not open ${ch}`,
    ).toBe(true);
  });

  test('ERROR is unconditional in every environment', () => {
    const expr = gateExprOf(MAIN, 'ERROR');
    expect(expr).not.toBe(null);
    expect(evaluateGate(expr, DEPLOYED)).toBe(true);
    expect(evaluateGate(expr, LOCALHOST)).toBe(true);
    expect(evaluateGate(expr, { PRODUCTION: true, DEBUG: {} })).toBe(true);
  });

  test('THE CONTROL — the pre-cure shape is caught by this very detector', () => {
    // What the fork was vendored with, verbatim. If the extractor or the evaluator ever
    // stops seeing the flag block, this arm goes green for the wrong reason and the muting
    // arms above become vacuous — so the regression is run through them here.
    const preCure = 'const INFO = true;\nconst TIME = true;\nconst WARN = true;\nconst ERROR = true;\n';
    for (const ch of MUTED_CHANNELS) {
      const expr = gateExprOf(preCure, ch);
      expect(expr, `the extractor cannot read the pre-cure spelling of ${ch}`).toBe('true');
      expect(
        evaluateGate(expr, DEPLOYED),
        `the detector failed to catch a flat-true ${ch}`,
      ).toBe(true);
    }
  });
});

describe('the three emitters REVIEW-P measured are still behind their channel', () => {
  test('both main.js emitters keep their WARN guard', () => {
    expect(MAIN).toContain('WARN && console.warn("Generate random map")');
    expect(MAIN).toContain('WARN && console.warn(`TOTAL:');
  });

  test('the vendor bundle keeps its guard and was NOT patched', () => {
    const bundle = readdirSync(MAP_DIR).filter((f) => /^index-.*\.js$/.test(f));
    expect(bundle, 'the FMG build bundle is gone from public/map').toHaveLength(1);
    const code = readFileSync(join(MAP_DIR, bundle[0]), 'utf8');
    // Still emitted, still channel-guarded, still minified vendor output: the cure is in
    // the flag block, never inside a file the next FMG upgrade regenerates.
    expect(code).toContain('WARN&&console.warn(`Unresolved depressions:');
  });
});

describe('muting TIME cannot orphan a timer into a new warning', () => {
  test('every console.time is paired with a console.timeEnd, and both are TIME-guarded', () => {
    const files = [];
    (function walk(dir) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (entry.name.endsWith('.js')) files.push(p);
      }
    })(MAP_DIR);

    let starts = 0;
    let ends = 0;
    const unguarded = [];
    for (const f of files) {
      const code = readFileSync(f, 'utf8');
      for (const m of code.matchAll(/console\.(time|timeEnd)\(/g)) {
        if (m[1] === 'time') starts += 1; else ends += 1;
        const before = code.slice(Math.max(0, m.index - 24), m.index);
        if (!/TIME\s*&&\s*$/.test(before)) unguarded.push(`${f.slice(ROOT.length + 1)}: console.${m[1]}`);
      }
    }
    // The pairing is what makes muting safe; the guard is what makes it happen at all.
    expect(starts, 'the fork has no timers left, so this arm has gone vacuous').toBeGreaterThan(0);
    expect(ends).toBe(starts);
    expect(
      unguarded,
      'a console.time/timeEnd outside the TIME channel: under a muted TIME its partner '
        + 'still fires and the browser prints "Timer does not exist", which is a NEW '
        + `console line on a visitor's screen:\n  ${unguarded.join('\n  ')}`,
    ).toEqual([]);
  });
});
