/**
 * namingDataCharset.test.js -- THE TRANSLITERATION-DEBT REGISTER.
 *
 * The charset wall guards content an AUTHOR types. This file guards the content
 * the product SHIPS, against the same measured sets, because a name pool the
 * estate wrote is exactly as capable of carrying an unprintable codepoint as a
 * name a customer types, and nothing was checking.
 *
 * WHAT IT FOUND, AND WHAT CLOSED IT. Walking every string in NAMING_DATA against
 * the two derived sets, this register read for the whole life of the defect:
 *
 *   dossier PDF          0 misses   (eight embedded faces, 759 codepoints)
 *   campaign book / World Book   41 misses across 8 codepoints
 *     U+0101 a-macron x1 . U+0107 c-acute x30 . U+010C x1 . U+010D x1
 *     U+0110 D-stroke x2 . U+0111 x1 . U+0161 s-caron x3 . U+017E z-caron x2
 *
 * The 41 were Slavic and Arabic diacritics -- Kovacevic, Uros, Snezana,
 * Dordevic, Cupic, Khan -- which the dossier printed correctly and the two jsPDF
 * books could not print at all, because those two were bounded by an ENCODER
 * TABLE rather than by an embedded font. Dordevic reached a paid page as
 * "or evi": not a truncation, a name a reader cannot recognise.
 *
 * ⭐ RE-RECORDED 41 -> 0, WITH ITS CAUSE. The two books now EMBED Lora
 * Regular/Bold/Italic (src/utils/jsPdfBookFont.js) and the one text pass admits
 * what that roster can DRAW rather than what WinAnsi can encode, so the set the
 * books are bounded by went 190 -> 776 and every one of the 41 is inside it.
 * ⚠ The cure was NOT the one this header used to predict. Re-deriving the pass
 * from the charset table would have cured 5 of the 41 (12%) and left Dordevic
 * printing "or evi"; the 27 codepoints it would have added are all inside the
 * font the product already shipped, so the embed DELETES that step rather than
 * building on it. Measured, both counts, before either was built.
 * ⛔ AND IT IS PROVED AT THE RENDER, NOT HERE. This file compares codepoint sets;
 * a set can agree while the encoder still drops the letter. The arm that emits a
 * real campaign book and decodes its painted glyph ids back through the
 * document's own ToUnicode CMap lives in tests/pdf/renderedFontEmbedding.test.js.
 *
 * THE EXACT-EQUALITY IDIOM IS DELIBERATE, AND MATTERS MORE AT ZERO. Growth reds,
 * because a new pool entry carrying a codepoint outside the embedded roster --
 * a CJK name, an emoji, a soft hyphen -- would silently reopen the defect. And
 * `codepoints: []` is why the arm below no longer iterates the miss list: a `for`
 * over an empty list passes forever, so the relationship is stated over the
 * POOLS, which the vacuity arm pins at 3,000+ strings.
 *
 * A note for whoever re-records it: `namingDecontamination.test.js` pins pool
 * SIZES for rng draw stability. A transliteration of the pools is a same-seed
 * shift only if it changes a pool's length or order, and the two pins together
 * make doing that silently impossible.
 */

import { describe, expect, it } from 'vitest';

import { NAMING_DATA } from '../../src/data/namingData.js';
import { CUSTOM_CONTENT_CHARSET } from '../../src/domain/content/customContentCharset.generated.js';
import { decodeRanges } from '../../src/domain/content/customContentCharset.js';

const DOSSIER = decodeRanges(CUSTOM_CONTENT_CHARSET.surfaces['dossier-pdf'].ranges);
const BOOK = decodeRanges(CUSTOM_CONTENT_CHARSET.surfaces['campaign-pdf'].ranges);

function has(set, cp) {
  if (cp < 0x10000) return (set.bmp[cp >> 3] & (1 << (cp & 7))) !== 0;
  return set.astral.some(([lo, hi]) => cp >= lo && cp <= hi);
}

/** Every string in the pools, with the path that reaches it. */
function pooledStrings() {
  const out = [];
  const walk = (node, path) => {
    if (typeof node === 'string') { out.push([path, node]); return; }
    if (Array.isArray(node)) { node.forEach((child, index) => walk(child, `${path}[${index}]`)); return; }
    if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) walk(value, `${path}.${key}`);
    }
  };
  walk(NAMING_DATA, 'NAMING_DATA');
  return out;
}

function census(set) {
  const codepoints = new Set();
  let instances = 0;
  const examples = new Map();
  for (const [path, value] of pooledStrings()) {
    for (const char of value) {
      const cp = char.codePointAt(0);
      if (has(set, cp)) continue;
      instances += 1;
      codepoints.add(cp);
      if (!examples.has(cp)) examples.set(cp, `${path} = ${value}`);
    }
  }
  return {
    instances,
    codepoints: [...codepoints].sort((a, b) => a - b)
      .map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`),
    examples,
  };
}

describe('the shipped name pools against the renderers that must print them', () => {
  it('the walk is not vacuous', () => {
    const strings = pooledStrings();
    expect(strings.length).toBeGreaterThan(3000);
  });

  it('every shipped name is printable in the dossier PDF', () => {
    const result = census(DOSSIER);
    expect(
      result.instances,
      `the dossier cannot print ${result.codepoints.join(' ')}; examples: ${
        [...result.examples.values()].slice(0, 5).join(' | ')}`,
    ).toBe(0);
  });

  it('the campaign-book miss census is EXACT, so it can neither grow nor shrink in silence', () => {
    const result = census(BOOK);
    expect({ instances: result.instances, codepoints: result.codepoints }).toEqual({
      instances: 0,
      codepoints: [],
    });
  });

  it('every miss is inside a name, not inside a pool KEY', () => {
    // A diacritic in a key would be a different defect (a lookup that cannot be
    // spelled) and must not hide inside this census.
    const keys = [];
    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) { node.forEach(walk); return; }
      for (const [key, value] of Object.entries(node)) { keys.push(key); walk(value); }
    };
    walk(NAMING_DATA);
    for (const key of keys) {
      for (const char of key) {
        expect(has(BOOK, char.codePointAt(0)), `pool key ${key}`).toBe(true);
      }
    }
  });

  it('the ASYMMETRY that was the defect is gone: no pooled codepoint divides the two renderers', () => {
    // WAS: iterate the miss list and assert the dossier could draw each one --
    // the debt is a property of the BOOK set, not of the pools. With the census
    // at zero that loop iterates nothing and passes forever, so the same
    // relationship is stated over a collection that CANNOT go empty: every
    // codepoint the shipped pools actually use, which the two renderers must now
    // agree about. It reds if either renderer narrows under the pools again.
    const pooled = new Set();
    for (const [, value] of pooledStrings()) for (const char of value) pooled.add(char.codePointAt(0));
    // Non-vacuity, and not a round number: the pools genuinely span this many.
    expect(pooled.size, 'the pooled codepoint set is empty — the arm would be vacuous').toBeGreaterThan(60);
    const divided = [...pooled]
      .filter((cp) => has(DOSSIER, cp) !== has(BOOK, cp))
      .map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`);
    expect(divided, 'a pooled codepoint one renderer can draw and the other cannot').toEqual([]);
  });
});
