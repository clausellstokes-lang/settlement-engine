import { describe, test, expect } from 'vitest';

import { safe, noLig, stripZwnj } from '../../src/pdf/lib/format.js';
import { SafeText } from '../../src/pdf/primitives/Dense.jsx';

/**
 * The PDF string chokepoint is TRANSPARENT — it must not mutate what it is given.
 *
 * ⚠ THIS SUITE WAS INVERTED ON 2026-09-01, and the inversion is the point.
 * It used to assert the opposite: that `noLig()` inserted a zero-width
 * non-joiner (U+200C) into every lowercase f-cluster, to defuse a `liga` GSUB
 * lookup in the pre-v2 Lora/Nunito faces. The v2 re-cut removed those lookups
 * (pinned as an executed guarantee in tests/build/fontsAndMeta.test.js §3d), so
 * the insertion had nothing left to defuse — while U+200C is covered by NONE of
 * the eight embedded faces, so every insertion split the run onto a
 * NON-EMBEDDED base-14 Helvetica: 25–86 such runs per dossier, measured, on
 * 100% of exports, swallowing adjacent covered characters.
 *
 * What is worth pinning was never the marker — it was the CHOKEPOINT: that the
 * Dense value primitives and SafeText are the single seam every section's raw
 * engine string renders through. That is still pinned here. The assertion the
 * seam carries is now the stronger one the product actually promises: the
 * string arrives at the renderer BYTE-IDENTICAL. If anyone re-introduces a
 * mutating chokepoint, these reds.
 */
const ZWNJ = '‌';

describe('PDF string chokepoint is transparent', () => {
  // The f-clusters that used to be rewritten. They must now survive verbatim —
  // this is the exact set the old suite asserted was mutated.
  test('noLig passes every former f-ligature cluster through byte-identically', () => {
    for (const word of ['Griffin', 'Waffle', 'Refined', 'Reflected', 'Offer']) {
      expect(noLig(word)).toBe(word);
      // anchored: the toBe above pins the FULL string — it cannot have gone empty.
      expect(noLig(word)).not.toContain(ZWNJ);
    }
  });

  test('is a no-op for f-free strings (byte-identical) and idempotent', () => {
    expect(noLig('Barracks')).toBe('Barracks');
    expect(safe('Griffin')).toBe(safe(safe('Griffin'))); // idempotent
    // safe() emits nothing to strip; stripZwnj is now a defence against
    // USER-AUTHORED joiners, not against our own.
    expect(stripZwnj(safe('Griffin Hall'))).toBe('Griffin Hall');
    expect(safe('Griffin Hall')).toBe('Griffin Hall');
  });

  test('stripZwnj still removes a ZWNJ that arrives in user-authored data', () => {
    // customContentSchema.js validates type and length only — no charset check —
    // so a pasted joiner reaches the renderer. This is the live reason to keep it.
    expect(stripZwnj(`Auror${ZWNJ}a Provisioners`)).toBe('Aurora Provisioners');
  });

  test('safe() null-guards and stringifies', () => {
    expect(safe(null)).toBe('');
    expect(safe(undefined)).toBe('');
    expect(safe(42)).toBe('42');
  });
});

describe('SafeText wrapper', () => {
  test('passes a string child through byte-identically', () => {
    const el = SafeText({ children: 'Griffin Hall' });
    expect(el.props.children).toBe('Griffin Hall');
    // anchored: the toBe above pins the exact child — an emptied child reds there first.
    expect(el.props.children).not.toContain(ZWNJ);
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
