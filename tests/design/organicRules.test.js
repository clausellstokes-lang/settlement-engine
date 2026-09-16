/**
 * tests/design/organicRules.test.js — THE RULE FAMILY contract (Organic Craft
 * law §3). Pins: four variants with assigned grammar; each is a valid, distinct,
 * self-contained pre-baked SVG (no runtime turbulence/filter/blend — §8); straight
 * rules stretch (preserveAspectRatio=none) while the swelled rule keeps its taper;
 * every mark is decorative (aria-hidden) and has a whitespace-only fallback.
 */
import { describe, expect, it } from 'vitest';

import { ruleSvg, RULE_VARIANTS, RULE_GRAMMAR, RULE_FALLBACK_SPACE } from '../../src/design/organic/rules.js';

describe('rule vocabulary', () => {
  it('is exactly the four graded variants, each with an assigned meaning', () => {
    expect(RULE_VARIANTS).toEqual(['hairline', 'single', 'double', 'swelled']);
    for (const v of RULE_VARIANTS) expect(typeof RULE_GRAMMAR[v]).toBe('string');
    expect(RULE_GRAMMAR.swelled).toMatch(/hiatus/);
    expect(RULE_GRAMMAR.double).toMatch(/finality|total/);
  });

  it('every variant has a whitespace-only fallback (marks degrade to space)', () => {
    for (const v of RULE_VARIANTS) expect(RULE_FALLBACK_SPACE[v]).toBeGreaterThan(0);
  });
});

describe('rule SVG', () => {
  it('each variant renders a distinct, self-contained, decorative SVG', () => {
    const svgs = RULE_VARIANTS.map((v) => ruleSvg(v));
    expect(new Set(svgs).size).toBe(svgs.length); // all distinct
    for (const svg of svgs) {
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg.trim().endsWith('</svg>')).toBe(true);
      expect(svg).toContain('aria-hidden="true"');
      // §8: pre-baked only — no runtime filter/turbulence/blend, no raster.
      expect(/feturbulence|fedisplacement|filter=|mix-blend|<image\b/i.test(svg)).toBe(false);
    }
  });

  it('straight rules stretch (constant weight); the swelled rule keeps its taper', () => {
    for (const v of ['hairline', 'single', 'double']) {
      expect(ruleSvg(v)).toContain('preserveAspectRatio="none"');
    }
    const swelled = ruleSvg('swelled');
    expect(swelled).not.toContain('preserveAspectRatio="none"');
    expect(swelled).toContain('<path'); // the tapered spindle
  });

  it('is deterministic and honours an ink override', () => {
    expect(ruleSvg('single')).toBe(ruleSvg('single'));
    expect(ruleSvg('single', { ink: '#123456' })).toContain('#123456');
  });

  it('throws on an unknown variant (no silent empty rule)', () => {
    expect(() => ruleSvg('squiggle')).toThrow();
  });
});
