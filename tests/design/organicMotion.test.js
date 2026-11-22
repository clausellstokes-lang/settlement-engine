/**
 * tests/design/organicMotion.test.js — THE MOTION GRAMMAR pins
 * (Deep Craft phase 0c; annex Foundation addition 2).
 *
 * The vocabulary is CLOSED and its physics are law:
 *   1. All twelve named behaviors exist in organic.css under their one class
 *      spelling (MOTION_GRAMMAR is canonical; CSS is the projection).
 *   2. NO duration token exceeds 700ms — and the motion CSS carries NO literal
 *      durations at all (tokens only; a hand-typed 2s animation cannot land).
 *   3. Reduced-motion collapses every oc-m-* behavior (and its pseudo-elements)
 *      to instant states, globally — not only inside .oc-surface.
 *   4. GPU-CHEAP, permanently: @keyframes in organic.css animate ONLY
 *      transform/opacity. Layout properties (width/height/top/left/margin/…),
 *      filter, and box-shadow are banned from keyframes AND from transition
 *      lists (ink-darken's color-family transitions are the one sanctioned
 *      paint-property exception — hover is discrete, not continuous work).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { MOTION_GRAMMAR, MOTION_CLASSES, MOTION_DURATION } from '../../src/design/organic/motion.js';

const css = readFileSync(resolve(process.cwd(), 'src', 'styles', 'organic.css'), 'utf-8');
const vars = readFileSync(resolve(process.cwd(), 'src', 'styles', 'organicVars.css'), 'utf-8');

describe('the motion grammar', () => {
  it('names exactly twelve behaviors (the closed vocabulary)', () => {
    expect(MOTION_CLASSES).toHaveLength(12);
    expect(new Set(MOTION_CLASSES).size).toBe(12);
  });

  it('every behavior class exists in organic.css; every token projects to organicVars.css', () => {
    for (const { className } of Object.values(MOTION_GRAMMAR)) {
      expect(css, `organic.css must define .${className}`).toContain(`.${className}`);
    }
    for (const name of Object.keys(MOTION_DURATION)) {
      expect(vars, `--oc-motion-${name} missing — run node scripts/gen-organic-vars.mjs`).toContain(`--oc-motion-${name}:`);
    }
  });

  it('no duration token exceeds 700ms', () => {
    for (const [name, val] of Object.entries(MOTION_DURATION)) {
      const ms = /^(\d+(?:\.\d+)?)ms$/.exec(val);
      const s = /^(\d+(?:\.\d+)?)s$/.exec(val);
      const dur = ms ? Number(ms[1]) : s ? Number(s[1]) * 1000 : NaN;
      expect(dur, `${name}=${val} must parse as ms/s`).not.toBeNaN();
      expect(dur, `${name}=${val} exceeds the 700ms ceiling`).toBeLessThanOrEqual(700);
    }
  });

  it('the motion CSS carries no literal durations — tokens only', () => {
    // Scan animation/transition declarations for hand-typed time values.
    const timeLiteral = /(?:animation|transition)[^;{}]*\b\d+(?:\.\d+)?m?s\b/g;
    const offenders = (css.match(timeLiteral) || [])
      // The reduced-motion collapse (0.001ms) is the sanctioned instant state.
      .filter((m) => !m.includes('0.001ms'));
    expect(offenders, `literal durations found — pin via --oc-motion-*:\n  ${offenders.join('\n  ')}`).toHaveLength(0);
  });

  it('reduced-motion collapses every oc-m-* behavior globally (incl. pseudo-elements)', () => {
    const reduced = css.split('@media (prefers-reduced-motion: reduce)')[1] || '';
    expect(reduced, 'missing the prefers-reduced-motion block').not.toBe('');
    expect(reduced).toContain("[class*='oc-m-']");
    expect(reduced).toContain("[class*='oc-m-']::after");
    expect(reduced).toContain('animation-duration: 0.001ms');
    expect(reduced).toContain('transition-duration: 0.001ms');
  });

  it('@keyframes animate transform/opacity ONLY (compositor-cheap, permanently)', () => {
    const frames = [...css.matchAll(/@keyframes\s+[\w-]+\s*\{([\s\S]*?)\n\}/g)];
    expect(frames.length, 'expected at least the grammar keyframes').toBeGreaterThanOrEqual(8);
    const allowed = new Set(['transform', 'opacity']);
    const offenders = [];
    for (const [, body] of frames) {
      for (const decl of body.matchAll(/([a-z-]+)\s*:/g)) {
        if (!allowed.has(decl[1])) offenders.push(decl[1]);
      }
    }
    expect(offenders, `keyframes may animate transform/opacity only; found: ${offenders.join(', ')}`).toHaveLength(0);
  });

  it('transitions never touch layout, filter, or box-shadow (hover never lifts)', () => {
    const banned = /transition[^;{}]*\b(width|height|top|left|right|bottom|margin|padding|flex|font-size|box-shadow|filter)\b/g;
    const offenders = css.match(banned) || [];
    expect(offenders, `layout/elevation transitions banned:\n  ${offenders.join('\n  ')}`).toHaveLength(0);
  });
});
