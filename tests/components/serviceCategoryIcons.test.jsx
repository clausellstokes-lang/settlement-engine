/**
 * tests/components/serviceCategoryIcons.test.jsx — THE ICON SWEEP PIN (lane IC).
 *
 * OWNER DIRECTIVE (2026-08-03): remove every icon that is not a logo, keeping
 * only the AI Surveyor prompt's own mark, genuine functional controls, and the
 * map/data-semantic glyph sets. The eleven service-category emoji pictograms
 * (🏠 lodging, 🍺 food, ⚔️ equipment, ✨ magic, 📜 information, ⚕️ healing,
 * 🐎 transport, ⚖️ legal, 🎭 entertainment, 📋 employment, 🗡️ criminal) were the
 * clearest instance of the decorative class: each sat immediately beside the
 * category's own text label, which already carried the whole meaning.
 *
 * This pin freezes their ABSENCE, and does it structurally rather than by
 * listing the eleven glyphs — a list would go stale the moment someone reached
 * for a twelfth emoji. The rule enforced is the general one: no entry in the
 * service-category table may carry an `icon` field, and no value in the table
 * may contain a pictographic glyph at all.
 *
 * WHY NOT JUST THE LINT PIN: tests/lint/copyCorruption.test.js bans the EMPTY
 * icon slot (`icon: ''`) because that shape renders a stray leading space. It
 * says nothing about a NON-empty one, so re-adding `icon:'🏠'` would sail past
 * it. The two pins are complementary: that one bans the residue of a removal,
 * this one bans the removal being undone.
 */

import { describe, it, expect } from 'vitest';
import { Ts } from '../../src/components/new/tabConstants.js';

/**
 * Pictographic glyph classes: emoji planes, dingbats, misc symbols, geometric
 * shapes, arrows. Deliberately EXCLUDES the typographic marks the copy genuinely
 * uses in prose — the middot separator (·), en/em dashes, and curly quotes are
 * punctuation, not icons, and must not be swept up by this detector.
 */
// U+FE0F is matched by its own alternative rather than as a class member: inside
// the class it reads as a combining mark on the preceding range and trips
// eslint's no-misleading-character-class.
const PICTOGRAPH =
  /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}]|\u{FE0F}/u;

describe('service categories carry no icons (owner icon sweep, 2026-08-03)', () => {
  it('the table is non-empty — otherwise every assertion below is vacuous', () => {
    const keys = Object.keys(Ts);
    expect(keys.length).toBeGreaterThanOrEqual(11);
    // Spot-anchor a few known categories so a rename-to-empty cannot pass.
    expect(keys).toEqual(expect.arrayContaining(['lodging', 'food', 'magic', 'criminal']));
  });

  it('no category declares an icon field', () => {
    const withIcon = Object.entries(Ts)
      .filter(([, v]) => Object.prototype.hasOwnProperty.call(v, 'icon'))
      .map(([k]) => k);
    expect(
      withIcon,
      `These service categories re-grew an \`icon\` field: ${withIcon.join(', ')}. ` +
        'The label and accent colour carry the category; see tabConstants.js.',
    ).toEqual([]);
  });

  it('no category value contains a pictographic glyph', () => {
    const offenders = [];
    for (const [key, meta] of Object.entries(Ts)) {
      for (const [field, value] of Object.entries(meta)) {
        if (typeof value === 'string' && PICTOGRAPH.test(value)) {
          offenders.push(`${key}.${field} = ${JSON.stringify(value)}`);
        }
      }
    }
    expect(offenders, `Pictographic glyphs re-entered the service table:\n${offenders.join('\n')}`)
      .toEqual([]);
  });

  it('NEGATIVE CONTROL — the detector really does catch a pictograph', () => {
    // Without this, a broken regex would make the two assertions above pass
    // trivially and the pin would guard nothing.
    expect(PICTOGRAPH.test('🏠')).toBe(true);
    expect(PICTOGRAPH.test('⚔️')).toBe(true);
    expect(PICTOGRAPH.test('✦')).toBe(true);
    // …and does NOT catch the punctuation the labels legitimately use.
    expect(PICTOGRAPH.test('Food & Drink')).toBe(false);
    expect(PICTOGRAPH.test('Legal & Financial')).toBe(false);
    expect(PICTOGRAPH.test('services · categories')).toBe(false);
  });
});
