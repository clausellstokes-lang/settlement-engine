/**
 * namingDataCharset.test.js -- THE TRANSLITERATION-DEBT REGISTER.
 *
 * The charset wall guards content an AUTHOR types. This file guards the content
 * the product SHIPS, against the same measured sets, because a name pool the
 * estate wrote is exactly as capable of carrying an unprintable codepoint as a
 * name a customer types, and nothing was checking.
 *
 * WHAT IT FOUND, MEASURED RATHER THAN FEARED. Walking every string in
 * NAMING_DATA against the two derived sets:
 *
 *   dossier PDF          0 misses   (eight embedded faces, 759 codepoints)
 *   campaign book / World Book   41 misses across 8 codepoints
 *
 * The 41 are Slavic and Arabic diacritics -- Kovacevic, Uros, Snezana,
 * Dordevic, Cupic, Khan -- which the dossier prints correctly and the two jsPDF
 * books cannot print at all, because those two are bounded by an encoder table
 * rather than by an embedded font. This is a real, shipped, paid-surface defect
 * and the number is its size.
 *
 * THE EXACT-EQUALITY IDIOM IS DELIBERATE. Growth reds, because a new pool entry
 * with a diacritic silently enlarges a defect. Shrinkage ALSO reds, because the
 * debt only shrinks when someone changes a renderer or a pool, and that is a
 * paid-surface movement which owes a re-record with its cause -- never a quiet
 * edit of the number here. The cure that would move it (re-deriving the jsPDF
 * text pass from the table, so the books stop erasing codepoints their own
 * encoder can draw) is owner-gated and NOT this file's to take.
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
      instances: 41,
      codepoints: [
        'U+0101', 'U+0107', 'U+010C', 'U+010D',
        'U+0110', 'U+0111', 'U+0161', 'U+017E',
      ],
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

  it('the debt is a property of the BOOK set, not of the pools alone', () => {
    // Stated as a relationship so the reason survives: every missing codepoint
    // is one the dossier CAN draw. The pools are fine; one renderer is narrower
    // than the other, and that asymmetry is the defect.
    const result = census(BOOK);
    for (const label of result.codepoints) {
      const cp = Number.parseInt(label.slice(2), 16);
      expect(has(DOSSIER, cp), `${label} should be printable in the dossier`).toBe(true);
    }
  });
});
