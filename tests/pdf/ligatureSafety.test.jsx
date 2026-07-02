import { describe, test, expect } from 'vitest';

import { safe, noLig, stripZwnj } from '../../src/pdf/lib/format.js';
import { SafeText } from '../../src/pdf/primitives/Dense.jsx';

/**
 * Ligature safety (audit finding: defusing was convention-only — a new section
 * rendering a raw engine string reintroduced "tofu" with a green suite). The Dense
 * value primitives now defuse f-ligatures at the shared chokepoint, and SafeText is
 * the reusable wrapper for section-level raw strings. This pins the mechanism and the
 * wrapper so the defusion can't silently regress.
 */
const ZWNJ = '‌';

describe('f-ligature defusion mechanism', () => {
  // Only LOWERCASE f-clusters ligate in the font's GSUB (capital F doesn't), so the
  // guard targets internal lowercase f — exactly where names carry the risk.
  test('noLig inserts a zero-width non-joiner into every lowercase f-ligature cluster', () => {
    expect(noLig('Griffin')).toContain(ZWNJ); // ffi
    expect(noLig('Waffle')).toContain(ZWNJ);  // ffl
    expect(noLig('Refined')).toContain(ZWNJ); // fi
    expect(noLig('Reflected')).toContain(ZWNJ); // fl
    expect(noLig('Offer')).toContain(ZWNJ);   // ff
  });

  test('is a no-op for f-free strings (byte-identical) and idempotent', () => {
    expect(noLig('Barracks')).toBe('Barracks');
    expect(safe('Griffin')).toBe(safe(safe('Griffin'))); // idempotent
    // round-trips: stripping the ZWNJ recovers the original glyphs
    expect(stripZwnj(safe('Griffin Hall'))).toBe('Griffin Hall');
  });

  test('safe() null-guards and stringifies', () => {
    expect(safe(null)).toBe('');
    expect(safe(undefined)).toBe('');
    expect(safe(42)).toBe('42');
  });
});

describe('SafeText wrapper', () => {
  test('defuses a string child', () => {
    const el = SafeText({ children: 'Griffin Hall' });
    expect(el.props.children).toContain(ZWNJ);
    expect(stripZwnj(el.props.children)).toBe('Griffin Hall');
  });

  test('passes non-string children through untouched (no crash on nested nodes)', () => {
    const node = { type: 'Text', props: {} };
    expect(SafeText({ children: node }).props.children).toBe(node);
  });

  test('forwards style/other props', () => {
    const style = { color: 'red' };
    expect(SafeText({ children: 'x', style }).props.style).toBe(style);
  });
});
