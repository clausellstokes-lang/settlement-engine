/**
 * customContentCharset.test.js -- THE CHARSET WALL AND ITS PROVENANCE.
 *
 * The product validates custom content for shape and length at four walls and
 * not one of them asks whether a codepoint can be DRAWN. A name carrying a CJK
 * letter passes every existing check and then prints as a substitute glyph in a
 * paid dossier and as a blank in a paid World Book. This file pins the wall that
 * answers that question.
 *
 * WHY THE PROVENANCE ARMS MATTER MORE THAN THE PROTOCOL ARMS. The protocol is
 * ordinary code and a reader can check it. The TABLE is the interesting half: it
 * claims to be a measurement of the renderers rather than a hand-typed list, and
 * a hand-typed list is exactly what it would decay into the first time someone
 * "fixed" a count. So the arms below RECOMPUTE the two bounded sets live -- the
 * font intersection through fontkit, the jsPDF set by executing the one text
 * pass -- and compare. A font swap, a jsPDF bump or a sanitiser edit moves the
 * table; if the table did not move, one of these arms reds.
 *
 * The dossier set and the jsPDF set are DIFFERENT sets, and the difference used
 * to be THE defect: the dossier embedded eight faces and drew 759 codepoints
 * while the two jsPDF books were bounded by an ENCODER TABLE and drew 190, so 41
 * of the product's own shipped names could not be printed on a paid page. The
 * books now embed Lora Regular/Bold/Italic and are bounded by a FONT and a text
 * pass at 776. The sets are still not identical — a field that reaches both is
 * still bounded by the intersection — but the three that divide them (U+00A0,
 * U+00AD, U+FFFF) are characters no reader sees.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import { jsPDF } from 'jspdf';

import { sanitizeJsPdfText } from '../../src/utils/jsPdfText.js';
import { BOOK_FACES, BOOK_FAMILY } from '../../src/utils/jsPdfBookFont.js';
import { CUSTOM_CONTENT_CHARSET } from '../../src/domain/content/customContentCharset.generated.js';
import {
  CHARSET_REJECTION_CODES,
  CHARSET_SURFACES,
  charsetSetFor,
  customContentFieldOsrIdentity,
  customContentFieldSurfaces,
  decodeRanges,
  transliterationPreview,
  validateCustomContentCharset,
} from '../../src/domain/content/customContentCharset.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const TABLE = CUSTOM_CONTENT_CHARSET;

/** Membership in a decoded set, spelled once. */
function has(set, cp) {
  if (cp < 0x10000) return (set.bmp[cp >> 3] & (1 << (cp & 7))) !== 0;
  return set.astral.some(([lo, hi]) => cp >= lo && cp <= hi);
}

/** Every codepoint of a decoded set, as a Set of numbers. */
function expand(set) {
  const out = new Set();
  for (let cp = 0; cp <= 0xffff; cp += 1) if (has(set, cp)) out.add(cp);
  for (const [lo, hi] of set.astral) for (let cp = lo; cp <= hi; cp += 1) out.add(cp);
  return out;
}

const codes = (result) => result.rejections.map((entry) => entry.code);

describe('the charset table is a measurement, not a list', () => {
  it('the dossier set equals a LIVE fontkit intersection over the faces theme.js registers', () => {
    // The `src:` string literals ARE the registration. Read them from the source
    // with comments stripped, so a commented-out face is not counted as one.
    const themeSource = readFileSync(join(ROOT, 'src/pdf/theme.js'), 'utf8');
    const stripped = themeSource
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
    const faces = [...stripped.matchAll(/src:\s*'(\/fonts\/[^'?]+\.ttf)(?:\?[^']*)?'/g)]
      .map((match) => match[1]);
    expect(faces.length).toBe(8);

    let live = null;
    for (const face of faces) {
      const font = fontkit.openSync(join(ROOT, 'public', face.replace(/^\//, '')));
      const set = new Set(font.characterSet);
      live = live === null ? set : new Set([...live].filter((cp) => set.has(cp)));
    }
    expect(TABLE.surfaces['dossier-pdf'].count).toBe(live.size);
    expect(expand(decodeRanges(TABLE.surfaces['dossier-pdf'].ranges))).toEqual(live);
  });

  it('the campaign-book set equals the EMBEDDED ROSTER narrowed by EXECUTING the one text pass', () => {
    // ⭐ THIS ARM MOVED WITH ITS SUBJECT. It used to derive from jsPDF's
    // WinAnsiEncoding map, because the two books painted with standard-14
    // Helvetica and were bounded by an encoder table — 190 codepoints against the
    // dossier's 759, which is the asymmetry namingDataCharset.test.js calls "the
    // defect". The books now embed Lora (src/utils/jsPdfBookFont.js), so the
    // honest bound is what those three faces can DRAW.
    // ⚠ READ THROUGH jsPDF's OWN LOADED cmap, NOT fontkit: fontkit reports the
    // format-4 sentinel U+FFFF as covered and jsPDF maps it to glyph 0. Measured,
    // per face: fontkit 779, jsPDF 778. A .notdef is not a drawable glyph.
    const probe = new jsPDF();
    let drawable = null;
    for (const face of BOOK_FACES) {
      probe.addFileToVFS(face.file, readFileSync(join(ROOT, 'public/fonts', face.file)).toString('base64'));
      probe.addFont(face.file, BOOK_FAMILY, face.style);
      probe.setFont(BOOK_FAMILY, face.style);
      const { metadata } = probe.getFont(BOOK_FAMILY, face.style);
      const set = new Set(Object.keys(metadata.cmap.unicode.codeMap)
        .map(Number).filter((cp) => metadata.characterToGlyph(cp) !== 0));
      drawable = drawable === null ? set : new Set([...drawable].filter((cp) => set.has(cp)));
    }
    expect(drawable.size, 'the roster draws nothing — the derivation would be vacuous').toBeGreaterThan(700);
    // Context-anchored, and the anchor is load-bearing: a bare lone space trims
    // to empty, which would read one codepoint lower and disagree with the
    // derivation by construction.
    const live = new Set([...drawable].filter((cp) => {
      const anchored = `a${String.fromCodePoint(cp)}a`;
      return sanitizeJsPdfText(anchored) === anchored;
    }));
    // The two the whitespace collapse removes, named so the gap is not a mystery.
    expect([...drawable].filter((cp) => !live.has(cp))).toEqual([0x0d, 0xa0]);
    expect(TABLE.surfaces['campaign-pdf'].count).toBe(live.size);
    expect(expand(decodeRanges(TABLE.surfaces['campaign-pdf'].ranges))).toEqual(live);
  });

  it('the World Book and the campaign book are bounded by the same derived set', () => {
    expect(TABLE.surfaces['world-book']).toEqual(TABLE.surfaces['campaign-pdf']);
  });

  it('the face roster theme.js registers equals the TTF set on disk', () => {
    // A silent divergence here is a font the dossier will not embed.
    const themeSource = readFileSync(join(ROOT, 'src/pdf/theme.js'), 'utf8');
    const roster = [...themeSource.matchAll(/src:\s*'\/fonts\/([^'?]+\.ttf)(?:\?[^']*)?'/g)]
      .map((match) => match[1]).sort();
    const onDisk = TABLE.surfaces['dossier-pdf'].inputs
      .map((input) => input.replace('public/fonts/', '')).sort();
    expect(roster).toEqual(onDisk);
  });

  it('institutions.name is bounded by the ARITHMETIC of the two live sets, not by a literal', () => {
    // The field reaches the dossier and the World Book, so its set is the
    // intersection. Computed from the table's own sets rather than typed, so the
    // day either renderer changes this arm moves with it.
    const dossier = expand(decodeRanges(TABLE.surfaces['dossier-pdf'].ranges));
    const book = expand(decodeRanges(TABLE.surfaces['world-book'].ranges));
    const intersection = [...dossier].filter((cp) => book.has(cp));
    expect(customContentFieldSurfaces('institutions', 'name'))
      .toEqual(['web-display', 'dossier-pdf', 'world-book', 'foundry']);
    // 189 -> 756 when the books stopped being bounded by an encoder table and
    // started being bounded by the face they embed. The 3 the dossier draws and
    // the books do not are U+00A0, U+00AD and U+FFFF — a non-breaking space the
    // whitespace collapse rewrites, a soft hyphen Lora has no glyph for, and a
    // format-4 sentinel. None is a character a reader sees.
    expect(intersection.length).toBe(756);
  });

  it('every classified field declares surfaces drawn from the closed vocabulary', () => {
    let classified = 0;
    for (const [bucket, fields] of Object.entries(TABLE.fields)) {
      for (const [field, cls] of Object.entries(fields)) {
        classified += 1;
        expect(cls.surfaces.length, `${bucket}.${field}`).toBeGreaterThan(0);
        for (const surface of cls.surfaces) {
          expect(CHARSET_SURFACES, `${bucket}.${field}`).toContain(surface);
        }
      }
    }
    expect(classified).toBe(41);
  });

  it('the identity spelling is "<key> on <shape>" for the materialized buckets and null elsewhere', () => {
    expect(customContentFieldOsrIdentity('institutions', 'name')).toBe('name on institutions');
    expect(customContentFieldOsrIdentity('tradeGoods', 'name')).toBe('name on tradeGoods');
    expect(customContentFieldOsrIdentity('deities', 'name')).toBe(null);
    expect(customContentFieldOsrIdentity('factions', 'name')).toBe(null);
  });

  it('an unbounded surface carries no set, so a web-only field is bounded only by the bans', () => {
    expect(charsetSetFor(TABLE, 'web-display')).toBe(null);
    expect(charsetSetFor(TABLE, 'foundry')).toBe(null);
    expect(charsetSetFor(TABLE, 'json-export')).toBe(null);
    expect(charsetSetFor(TABLE, 'dossier-pdf')).not.toBe(null);
  });

  it('the books declare their embedded face; the wall still only reports', () => {
    // ⚠ THE TITLE CHANGED BECAUSE THE CLAIM DID. It read "the door ships dark"
    // while embeddedFont was null. The two jsPDF books now embed Lora, so the
    // policy names it — but ENFORCEMENT is untouched (still `report`, never
    // `refuse`), and nonLatin stays `undecided` ON PURPOSE: embedding a Latin
    // serif does not answer the CJK/Arabic question, and writing `embed` here
    // would claim an answer this car did not earn.
    expect(TABLE.policy.enforcement).toBe('report');
    expect(TABLE.policy.nonLatin).toBe('undecided');
    expect(TABLE.policy.embeddedFont).toBe('Lora');
  });
});

describe('range strings decode to the set they spell', () => {
  it('a range string round-trips through the decoder', () => {
    const decoded = decodeRanges('20-22 41 1F600-1F601');
    expect(has(decoded, 0x20)).toBe(true);
    expect(has(decoded, 0x22)).toBe(true);
    expect(has(decoded, 0x23)).toBe(false);
    expect(has(decoded, 0x41)).toBe(true);
    expect(has(decoded, 0x1f600)).toBe(true);
    expect(has(decoded, 0x1f602)).toBe(false);
  });

  it('an empty range string is an empty set rather than a crash', () => {
    expect(expand(decodeRanges('')).size).toBe(0);
  });
});

describe('the wall names what it refuses', () => {
  it('a hostile name yields exactly one typed finding per offending codepoint', () => {
    const result = validateCustomContentCharset(
      'institutions',
      { name: 'Aurora 影 Provisioners ⚔ ✦ →' },
    );
    expect(result.rejections.length).toBe(4);
    expect(result.rejections.map((entry) => entry.codepoint))
      .toEqual(['U+5F71', 'U+2694', 'U+2726', 'U+2192']);
    for (const entry of result.rejections) {
      expect(entry.code).toBe('uncovered_codepoint');
      expect(entry.surface).toBe('dossier-pdf');
      expect(entry.surfaces).toContain('world-book');
      expect(entry.bucket).toBe('institutions');
      expect(entry.field).toBe('name');
    }
  });

  it('a finding carries the GLYPH and a 1-based position, never a bare codepoint number', () => {
    const [first] = validateCustomContentCharset(
      'institutions',
      { name: 'Aurora 影 Provisioners' },
    ).rejections;
    expect(first.char).toBe('影');
    expect(first.position).toBe(8);
    expect(first.index).toBe(7);
    expect(first.hint).toBe('errors.customContentCharset.uncovered_codepoint');
  });

  it('the reference-pack name passes every surface it reaches', () => {
    expect(validateCustomContentCharset(
      'institutions',
      { name: 'Aurora Provisioners' },
    ).rejections).toEqual([]);
  });

  it('a control character is caught even on a field no bounded surface guards', () => {
    // stressors.name reaches only the web, which is unbounded. Before the bans
    // carried C0 whole, a newline here produced no finding at all.
    expect(customContentFieldSurfaces('stressors', 'name')).toEqual(['web-display']);
    expect(codes(validateCustomContentCharset(
      'stressors',
      { name: `a${String.fromCodePoint(0x0a)}b` },
    ))).toEqual(['control_character']);
  });

  it('a multiline field carries TAB, LF and CR as layout rather than as glyphs', () => {
    // A font intersection legitimately lacks a newline, so a fall-through to the
    // surface check would flag every paragraph break in a description.
    expect(TABLE.fields.institutions.description.multiline).toBe(true);
    expect(validateCustomContentCharset(
      'institutions',
      { description: `a${String.fromCodePoint(0x0a)}b${String.fromCodePoint(0x09)}c` },
    ).rejections).toEqual([]);
  });

  it('a bidi override is refused on every surface', () => {
    expect(codes(validateCustomContentCharset(
      'institutions',
      { name: `a${String.fromCodePoint(0x202e)}b` },
    ))).toEqual(['bidi_override']);
  });

  it('a non-breaking space is a typed finding, because both jsPDF passes collapse it', () => {
    // The REASON, pinned in the body: the pass rewrites it to a plain space, and
    // a silent rewrite is the mangling this module exists to make visible.
    const nbsp = String.fromCodePoint(0xa0);
    expect(sanitizeJsPdfText(`a${nbsp}a`)).toBe('a a');
    expect(codes(validateCustomContentCharset(
      'institutions',
      { name: `Aurora${nbsp}Hall` },
    ))).toEqual(['invisible_format']);
  });

  it('a zero-width joiner is a typed finding', () => {
    expect(codes(validateCustomContentCharset(
      'institutions',
      { name: `a${String.fromCodePoint(0x200d)}b` },
    ))).toEqual(['invisible_format']);
  });

  it('a lone surrogate stops the walk for that string', () => {
    expect(codes(validateCustomContentCharset(
      'institutions',
      { name: 'a\uD800 影 b' },
    ))).toEqual(['malformed_encoding']);
  });

  it('length is measured in codepoints, and an astral string proves the unit', () => {
    const astral = String.fromCodePoint(0x1d11e);
    // 501 codepoints, 1002 UTF-16 units, against a 500-codepoint ceiling.
    const [entry] = validateCustomContentCharset(
      'deities',
      { portfolio: astral.repeat(501) },
    ).rejections.filter((row) => row.code === 'length');
    expect(entry.unit).toBe('codepoints');
    expect(entry.max).toBe(500);
    expect(entry.actual).toBe(501);
  });

  it('a list field reports the offending ITEM, so the author knows which one', () => {
    const [entry] = validateCustomContentCharset(
      'institutions',
      { tags: ['clean', 'b→d'] },
    ).rejections;
    expect(entry.item).toBe(1);
    expect(entry.position).toBe(2);
  });

  it('nfcWouldPass is true when normalising the string clears it, and false otherwise', () => {
    // ⭐ THE PROBE MOVED, AND THE REASON IS THE GOOD NEWS. This arm used to use
    // `Andre` + U+0301 COMBINING ACUTE, which produced a finding because the two
    // jsPDF books were bounded by WinAnsiEncoding and had no combining marks at
    // all. They now embed Lora, whose cmap carries U+0300-U+030C — and MEASURED,
    // every one of those 20 marks has ADVANCE WIDTH 0, so it stacks on the
    // preceding glyph instead of displacing it: jsPDF gives the decomposed
    // "Andre\u0301" and the precomposed "André" the SAME text width (11.879 mm at
    // 12pt). The decomposed spelling now prints correctly on every surface, so
    // reporting nothing about it is right, not a hole.
    // U+0340 COMBINING GRAVE TONE MARK is outside the roster and still needs NFC
    // (which maps it to U+0300 and then composes), so it keeps the true branch
    // honest rather than leaving it vacuous.
    const decomposed = validateCustomContentCharset(
      'institutions',
      { name: `Andr${String.fromCodePoint(0x65, 0x340)}` },
    ).rejections;
    expect(decomposed.length).toBe(1);
    expect(decomposed[0].nfcWouldPass).toBe(true);
    expect(validateCustomContentCharset(
      'institutions',
      { name: `Andr${String.fromCodePoint(0x65, 0x340)}`.normalize('NFC') },
    ).rejections).toEqual([]);
    // And the codepoint the old probe used is now genuinely printable everywhere.
    expect(validateCustomContentCharset(
      'institutions',
      { name: `Andre${String.fromCodePoint(0x301)}` },
    ).rejections).toEqual([]);

    const [cjk] = validateCustomContentCharset('institutions', { name: '影' }).rejections;
    expect(cjk.nfcWouldPass).toBe(false);
  });

  it('the rejection vocabulary is closed at six', () => {
    expect(CHARSET_REJECTION_CODES).toEqual([
      'uncovered_codepoint',
      'control_character',
      'bidi_override',
      'invisible_format',
      'malformed_encoding',
      'length',
    ]);
  });

  it('an unknown bucket and a missing definition are answered, not thrown on', () => {
    expect(validateCustomContentCharset('nope', { name: '影' }))
      .toEqual({ rejections: [], marks: [] });
    expect(validateCustomContentCharset('institutions', null))
      .toEqual({ rejections: [], marks: [] });
  });

  it('under undecided every finding is a rejection and nothing is marked', () => {
    // The marks list is the keep_and_mark policy's channel. Under today's policy
    // it must stay empty, or the caller would silently accept an unprintable name.
    expect(TABLE.policy.nonLatin).toBe('undecided');
    expect(validateCustomContentCharset('institutions', { name: '影' }).marks).toEqual([]);
  });
});

describe('the ASCII preview offers a rewrite without performing one', () => {
  it('it folds accents and the closed letter map', () => {
    expect(transliterationPreview('Kovačević')).toBe('Kovacevic');
    expect(transliterationPreview('Uroš Hadžić')).toBe('Uros Hadzic');
    expect(transliterationPreview('ß æ Æ ø Ø đ Đ þ Þ ł Ł œ Œ'))
      .toBe('ss ae AE o O d D th Th l L oe OE');
  });

  it('it never collapses whitespace and never trims, because the string is the author’s', () => {
    expect(transliterationPreview('  two  spaces  ')).toBe('  two  spaces  ');
  });

  it('every codepoint of the preview of a shipped pool name is printable on the campaign book', () => {
    const book = decodeRanges(TABLE.surfaces['campaign-pdf'].ranges);
    for (const name of ['Kovačević', 'Uroš', 'Snežana', 'Đorđević', 'Čupić', 'Khān', 'Babić']) {
      for (const ch of transliterationPreview(name)) {
        expect(has(book, ch.codePointAt(0)), `${name} -> ${ch}`).toBe(true);
      }
    }
  });
});
