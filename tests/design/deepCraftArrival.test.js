/**
 * tests/design/deepCraftArrival.test.js — THE ARRIVAL pins
 * (Deep Craft cluster 1b; hero H1 per docs/DESIGN_DEEP_CRAFT_PAGES.md).
 *
 * 1. The orchestration exists and is composed FROM the motion grammar
 *    (oc-laydown + oc-unfold — never bespoke keyframes).
 * 2. THE 2-SECOND LAW, computed from the tokens: the worst-case block begins
 *    at (ink/2) × maxRank and settles one `settle` later — must be ≤ 2000ms
 *    at any block count (the beyond-cap default rank is the ceiling).
 * 3. Reduced-motion collapses the arrival (duration AND delay).
 * 4. The generate-flow dossier wrapper actually wears the class
 *    (GenerateWizard.jsx — the walker idiom; a rename breaks loudly here).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { MOTION_DURATION } from '../../src/design/organic/motion.js';

const css = readFileSync(resolve(process.cwd(), 'src', 'styles', 'organic.css'), 'utf-8');
const wizard = readFileSync(resolve(process.cwd(), 'src', 'components', 'GenerateWizard.jsx'), 'utf-8');

const ms = (v) => Number(/^(\d+(?:\.\d+)?)ms$/.exec(v)[1]);

describe('THE ARRIVAL', () => {
  it('is composed from the motion grammar (lay-down + unfold, token delays only)', () => {
    expect(css).toContain('.oc-arrival {');
    expect(css).toMatch(/\.oc-arrival \{ animation: oc-laydown var\(--oc-motion-lay\)/);
    expect(css).toMatch(/\.oc-arrival > div > \* \{[\s\S]*?animation: oc-unfold var\(--oc-motion-settle\)/);
    // Delay derives from tokens via calc — never a literal (the motion test's
    // literal scan also covers this file; this pins the mechanism by name).
    expect(css).toContain('animation-delay: calc(var(--oc-motion-ink) * var(--oc-arrival-i, 13) / 2)');
  });

  it('obeys the 2-second law at any block count (computed from the tokens)', () => {
    const defaultRank = Number(/var\(--oc-arrival-i, (\d+)\)/.exec(css)[1]);
    const ranks = [...css.matchAll(/--oc-arrival-i: (\d+);/g)].map((m) => Number(m[1]));
    const maxRank = Math.max(defaultRank, ...ranks);
    const lastBegins = (ms(MOTION_DURATION.ink) / 2) * maxRank;
    const lastSettles = lastBegins + ms(MOTION_DURATION.settle);
    expect(lastBegins, 'last block must begin ≤ 1,300ms (H1 spec)').toBeLessThanOrEqual(1300);
    expect(lastSettles, 'the document must settle under 2s').toBeLessThanOrEqual(2000);
  });

  it('reduced-motion collapses the arrival — duration and delay', () => {
    const reduced = css.split('@media (prefers-reduced-motion: reduce)')[1] || '';
    expect(reduced).toContain('.oc-arrival, .oc-arrival > div > *');
    expect(reduced).toContain('animation-delay: 0.001ms');
  });

  it('the generate-flow dossier wrapper wears the orchestration class', () => {
    expect(wizard).toContain('className="oc-arrival"');
  });
});
