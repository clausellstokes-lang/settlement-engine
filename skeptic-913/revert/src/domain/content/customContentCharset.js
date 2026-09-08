/**
 * The charset wall: can this product actually DRAW the characters an author typed.
 *
 * Custom content is admitted for shape and length by one generated projection
 * consumed at four walls, and not one of them asks whether a codepoint can be
 * rendered. So a name carrying a CJK letter passes every existing check and then
 * prints as a substitute glyph in a paid dossier and as a blank in a paid World
 * Book. Nothing tells the author, because nothing ever measured what the
 * renderers can draw.
 *
 * This leaf answers that question from a table the manifest compiler DERIVES by
 * reading the renderers' own bytes: the intersection of the registered font faces
 * for the dossier, and the set the jsPDF text pass actually admits for the two
 * jsPDF books. Nothing here is hand-typed. A font swap, a jsPDF bump or a
 * sanitiser edit moves the table and reds the gate, instead of silently moving a
 * paid surface.
 *
 * THREE LAWS THIS MODULE IS BUILT AROUND.
 *
 * 1. NEVER SILENTLY STRIP. Every finding is a typed code with the offending
 *    grapheme, its position, and the surface that cannot draw it. The caller
 *    decides what to do; this module rewrites nothing.
 * 2. THE CHOKEPOINT LAW. This runs where content is AUTHORED, never where it is
 *    reloaded. A library minted before this law existed keeps loading, binding
 *    and restoring. Refusing it would delete a user's content.
 * 3. THE TABLE IS THE AUTHORITY. The allowed sets, the bans, the per-field
 *    surface lists and the policy all arrive as data. This file holds the
 *    protocol, never the figures.
 *
 * The module imports only its generated table so it can sit alone in a lazy
 * chunk. It is pure and synchronous.
 */

import { CUSTOM_CONTENT_CHARSET as GENERATED_CHARSET } from './customContentCharset.generated.js';

/**
 * @typedef {'web-display'|'dossier-pdf'|'campaign-pdf'|'world-book'|'foundry'|'json-export'} CharsetSurface
 * @typedef {'uncovered_codepoint'|'control_character'|'bidi_override'|'invisible_format'|'malformed_encoding'|'length'} CharsetRejectionCode
 * @typedef {'report'|'refuse'} CharsetEnforcement
 * @typedef {'undecided'|'embed'|'transliterate'|'keep_and_mark'} NonLatinPolicy
 * @typedef {{
 *   ranges:string,
 *   count:number,
 *   method:'unbounded'|'fontkit-intersection'|'winansi-table'|'winansi-and-textpass'|'fontkit-single',
 *   inputs:readonly string[],
 *   inputsSha256:string,
 * }} SurfaceCharset
 * @typedef {{
 *   surfaces:readonly CharsetSurface[],
 *   multiline:boolean,
 *   maxCodepoints:number|null,
 *   osrIdentity:string|null,
 * }} FieldCharsetClass
 * @typedef {{
 *   manifestVersion:string,
 *   policy:{
 *     enforcement:CharsetEnforcement,
 *     nonLatin:NonLatinPolicy,
 *     embeddedFont:string|null,
 *   },
 *   surfaces:Readonly<Record<string, SurfaceCharset>>,
 *   bans:Readonly<Record<'control'|'bidi'|'invisible'|'noncharacter', string>>,
 *   fields:Readonly<Record<string, Readonly<Record<string, FieldCharsetClass>>>>,
 * }} CustomContentCharsetTable
 * @typedef {{
 *   code:CharsetRejectionCode,
 *   bucket:string,
 *   field:string,
 *   item?:number,
 *   index?:number,
 *   codepoint?:string,
 *   char?:string,
 *   position?:number,
 *   surface?:CharsetSurface,
 *   surfaces?:readonly CharsetSurface[],
 *   max?:number,
 *   actual?:number,
 *   unit:'codepoints',
 *   nfcWouldPass?:boolean,
 *   hint:string,
 * }} CharsetRejection
 * @typedef {{
 *   ranges:string,
 *   bmp:Uint8Array,
 *   astral:readonly (readonly [number, number])[],
 * }} DecodedCharset
 */

/**
 * The generated table, admitted to the type system at exactly one place.
 *
 * The JS artifact is a plain object literal, so TypeScript widens its `method`,
 * `enforcement` and `nonLatin` fields to `string` and they no longer satisfy the
 * closed vocabularies declared above. The TS twin carries `as const` and needs
 * no such bridge. Rather than weaken the typedef -- which is the part a reader
 * consults to learn what the vocabularies ARE -- the widening is narrowed here,
 * once, through `unknown`. The compiler validates all three vocabularies against
 * their closed lists before it emits the file, so the narrowing is checked at
 * generation time rather than merely asserted here.
 *
 * @type {CustomContentCharsetTable}
 */
export const CUSTOM_CONTENT_CHARSET = /** @type {CustomContentCharsetTable} */ (
  /** @type {unknown} */ (GENERATED_CHARSET)
);

/**
 * The six RENDERING surfaces a custom-content string can be drawn on.
 *
 * A pinned mirror of the writer-reach vocabulary minus `news` (a custom-content
 * field is never a news key) and minus `web-transitive` (a transitive reach is
 * not a surface a glyph is drawn on). The class token is never shown to a
 * customer: the copy map carries the product noun.
 *
 * @type {readonly CharsetSurface[]}
 */
export const CHARSET_SURFACES = Object.freeze([
  'web-display',
  'dossier-pdf',
  'campaign-pdf',
  'world-book',
  'foundry',
  'json-export',
]);

/**
 * The closed vocabulary of reasons this wall can refuse a string.
 *
 * Mirrored into the AI output schema, the AI charter and the edge compiler, and
 * pinned EQUAL across all four so the clerk can name exactly what the wall
 * refused.
 *
 * @type {readonly CharsetRejectionCode[]}
 */
export const CHARSET_REJECTION_CODES = Object.freeze([
  'uncovered_codepoint',
  'control_character',
  'bidi_override',
  'invisible_format',
  'malformed_encoding',
  'length',
]);

/** The ban classes, in the order the protocol tests them. */
const BAN_ORDER = Object.freeze(
  /** @type {readonly ['control', 'bidi', 'invisible', 'noncharacter']} */ ([
    'control',
    'bidi',
    'invisible',
    'noncharacter',
  ]),
);

/** Ban class to the code it produces. */
const BAN_CODE = Object.freeze({
  control: /** @type {CharsetRejectionCode} */ ('control_character'),
  bidi: /** @type {CharsetRejectionCode} */ ('bidi_override'),
  invisible: /** @type {CharsetRejectionCode} */ ('invisible_format'),
  noncharacter: /** @type {CharsetRejectionCode} */ ('invisible_format'),
});

/** TAB, LF and CR, which a multiline field is allowed to carry. */
const MULTILINE_CONTROLS = Object.freeze([0x09, 0x0a, 0x0d]);

const BMP_BYTES = 0x10000 / 8;

/**
 * The closed transliteration map: letters whose ASCII shape is a WORD, not an
 * accent that stripping combining marks would already handle.
 *
 * Prior art is the civility fold, never the slug builder: the slug builder
 * DELETES what it cannot map, which turns a name into a mangled fragment.
 */
const TRANSLITERATION_MAP = Object.freeze({
  'ß': 'ss',
  'æ': 'ae',
  'Æ': 'AE',
  'ø': 'o',
  'Ø': 'O',
  'đ': 'd',
  'Đ': 'D',
  'ð': 'd',
  'Ð': 'D',
  'þ': 'th',
  'Þ': 'Th',
  'ł': 'l',
  'Ł': 'L',
  'œ': 'oe',
  'Œ': 'OE',
});

const decodeCache = new WeakMap();
/** @type {Map<string, DecodedCharset>} */
const rangeCache = new Map();

/**
 * Decode a RangeString into a BMP bitmap plus a sorted list of astral ranges.
 *
 * A RangeString is an ordered, space-separated list of inclusive hex ranges, so
 * `20-7E A0` means printable ASCII plus U+00A0. It is deliberately not a regex
 * literal: a regex would have to be re-parsed, could not be intersected, and
 * could not be counted, and the count is the figure the gate byte-checks.
 *
 * @param {string} ranges the RangeString to decode
 * @returns {DecodedCharset} a membership structure for the set
 */
export function decodeRanges(ranges) {
  const key = String(ranges || '');
  const cached = rangeCache.get(key);
  if (cached) return cached;

  const bmp = new Uint8Array(BMP_BYTES);
  /** @type {[number, number][]} */
  const astral = [];
  for (const token of key.split(/\s+/)) {
    if (!token) continue;
    const dash = token.indexOf('-');
    const lo = Number.parseInt(dash === -1 ? token : token.slice(0, dash), 16);
    const hi = dash === -1 ? lo : Number.parseInt(token.slice(dash + 1), 16);
    if (!Number.isInteger(lo) || !Number.isInteger(hi) || hi < lo) continue;
    if (lo >= 0x10000) {
      astral.push([lo, hi]);
      continue;
    }
    const bmpHi = Math.min(hi, 0xffff);
    for (let cp = lo; cp <= bmpHi; cp += 1) bmp[cp >> 3] |= 1 << (cp & 7);
    if (hi >= 0x10000) astral.push([0x10000, hi]);
  }
  astral.sort((a, b) => a[0] - b[0]);
  const decoded = /** @type {DecodedCharset} */ ({
    ranges: key,
    bmp,
    astral: Object.freeze(astral.map((pair) => Object.freeze(pair))),
  });
  rangeCache.set(key, decoded);
  return decoded;
}

/**
 * Test membership of a codepoint in a decoded set.
 *
 * @param {DecodedCharset} set the decoded set
 * @param {number} cp the codepoint
 * @returns {boolean} true when the set contains the codepoint
 */
function has(set, cp) {
  if (cp < 0x10000) return (set.bmp[cp >> 3] & (1 << (cp & 7))) !== 0;
  for (const [lo, hi] of set.astral) {
    if (cp >= lo && cp <= hi) return true;
  }
  return false;
}

/**
 * The decoded allowed set for one surface, or null when that surface is unbounded.
 *
 * @param {CustomContentCharsetTable} table the charset table
 * @param {CharsetSurface} surface the surface
 * @returns {DecodedCharset|null} the decoded set, or null when unbounded
 */
export function charsetSetFor(table, surface) {
  const entry = table?.surfaces?.[surface];
  if (!entry || entry.method === 'unbounded') return null;
  return decodeRanges(entry.ranges);
}

/**
 * The decoded ban classes for a table, memoized per table object.
 *
 * @param {CustomContentCharsetTable} table the charset table
 * @returns {Record<string, DecodedCharset>} the decoded bans
 */
function bansOf(table) {
  const cached = decodeCache.get(table);
  if (cached) return cached;
  /** @type {Record<string, DecodedCharset>} */
  const decoded = {};
  for (const ban of BAN_ORDER) decoded[ban] = decodeRanges(table?.bans?.[ban] || '');
  decodeCache.set(table, decoded);
  return decoded;
}

/**
 * The declared surfaces for one field.
 *
 * @param {string} bucket the content bucket
 * @param {string} field the field key
 * @param {CustomContentCharsetTable} [table] the charset table
 * @returns {readonly CharsetSurface[]} the declared surfaces, empty when unclassified
 */
export function customContentFieldSurfaces(bucket, field, table = CUSTOM_CONTENT_CHARSET) {
  return table?.fields?.[bucket]?.[field]?.surfaces || Object.freeze([]);
}

/**
 * The observed-shape identity for a materialized custom key.
 *
 * Spelled `"<key> on <shape>"`, the one identity the reader registers, the writer
 * reach map and the band census all use. Null for a bucket whose fields are not
 * materialized as engine keys.
 *
 * @param {string} bucket the content bucket
 * @param {string} field the field key
 * @param {CustomContentCharsetTable} [table] the charset table
 * @returns {string|null} the identity, or null
 */
export function customContentFieldOsrIdentity(bucket, field, table = CUSTOM_CONTENT_CHARSET) {
  return table?.fields?.[bucket]?.[field]?.osrIdentity ?? null;
}

/**
 * An ASCII preview of a string, for an author who would rather rewrite than be refused.
 *
 * Decomposes, drops combining marks, then applies the closed map for the letters
 * whose ASCII shape is a word rather than an accent. It deliberately does NOT
 * collapse whitespace and does NOT trim: this is a preview of the author's own
 * string, and silently reshaping it would be the mangling this whole module
 * exists to prevent.
 *
 * Dark under the undecided policy: exported and tested, wired into the rejection
 * detail only once the non-Latin decision is made.
 *
 * @param {unknown} value the string to preview
 * @returns {string} the ASCII preview
 */
export function transliterationPreview(value) {
  const source = typeof value === 'string' ? value : String(value ?? '');
  let out = '';
  for (const ch of source.normalize('NFD').replace(/\p{M}/gu, '')) {
    out += Object.prototype.hasOwnProperty.call(TRANSLITERATION_MAP, ch)
      ? TRANSLITERATION_MAP[/** @type {keyof typeof TRANSLITERATION_MAP} */ (ch)]
      : ch;
  }
  return out;
}

/**
 * Format a codepoint the way the register spells it.
 *
 * @param {number} cp the codepoint
 * @returns {string} the U+ spelling
 */
function codepointLabel(cp) {
  return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

/**
 * Build one finding.
 *
 * @param {CharsetRejectionCode} code the typed reason
 * @param {string} bucket the bucket
 * @param {string} field the field
 * @param {Partial<CharsetRejection>} detail the rest of the finding
 * @returns {CharsetRejection} the finding
 */
function finding(code, bucket, field, detail) {
  return /** @type {CharsetRejection} */ ({
    code,
    bucket,
    field,
    unit: 'codepoints',
    hint: `errors.customContentCharset.${code}`,
    ...detail,
  });
}

/**
 * Walk one string of one field.
 *
 * @param {string} value the string
 * @param {string} bucket the bucket
 * @param {string} field the field key
 * @param {FieldCharsetClass} cls the field's class
 * @param {CustomContentCharsetTable} table the table
 * @param {number|undefined} item the list index, when the field is a list
 * @param {CharsetRejection[]} out the collector
 */
function walkString(value, bucket, field, cls, table, item, out) {
  const base = item === undefined ? {} : { item };

  // A lone surrogate is not a character. Nothing downstream can reason about the
  // rest of the string, so the walk stops here for this string.
  if (/[\uD800-\uDFFF]/.test(value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''))) {
    out.push(finding('malformed_encoding', bucket, field, base));
    return;
  }

  const points = Array.from(value);
  if (cls.maxCodepoints !== null && points.length > cls.maxCodepoints) {
    out.push(finding('length', bucket, field, {
      ...base,
      max: cls.maxCodepoints,
      actual: points.length,
    }));
  }

  const bans = bansOf(table);
  const bounded = cls.surfaces
    .map((surface) => ({ surface, set: charsetSetFor(table, surface) }))
    .filter((entry) => entry.set !== null);

  // Computed once per string, never per codepoint: the question is whether
  // normalising the WHOLE string would clear its findings.
  /** @type {boolean|undefined} */
  let nfcWouldPass;

  points.forEach((char, index) => {
    const cp = char.codePointAt(0);
    if (cp === undefined) return;
    const detail = {
      ...base,
      index,
      codepoint: codepointLabel(cp),
      char,
      position: index + 1,
    };

    // TAB, LF and CR on a multiline field are LAYOUT, not glyphs. They are
    // exempt from the ban AND from every surface check below, because no
    // renderer asks a font to draw a newline: a font intersection legitimately
    // lacks them, so falling through would report every paragraph break in a
    // description as an uncovered codepoint.
    if (cls.multiline && MULTILINE_CONTROLS.includes(cp)) return;

    for (const ban of BAN_ORDER) {
      if (!has(bans[ban], cp)) continue;
      out.push(finding(BAN_CODE[ban], bucket, field, detail));
      return;
    }

    const missing = bounded.filter((entry) => !has(
      /** @type {DecodedCharset} */ (entry.set),
      cp,
    ));
    if (missing.length === 0) return;

    if (nfcWouldPass === undefined) {
      const normalised = value.normalize('NFC');
      nfcWouldPass = normalised !== value && Array.from(normalised).every((other) => {
        const otherCp = other.codePointAt(0);
        if (otherCp === undefined) return true;
        if (BAN_ORDER.some((ban) => has(bans[ban], otherCp))) return false;
        return bounded.every((entry) => has(/** @type {DecodedCharset} */ (entry.set), otherCp));
      });
    }

    out.push(finding('uncovered_codepoint', bucket, field, {
      ...detail,
      surface: missing[0].surface,
      surfaces: Object.freeze(missing.map((entry) => entry.surface)),
      nfcWouldPass,
    }));
  });
}

/**
 * Check every free-text field of one definition against the surfaces it reaches.
 *
 * Pure and synchronous. Runs at AUTHORING chokepoints only, never at hydration,
 * campaign binding or restore.
 *
 * Under the `keep_and_mark` policy an uncovered codepoint on a rendering surface
 * is a MARK rather than a rejection: the verdict changes, the vocabulary does
 * not. Every other class stays a rejection under every policy, because a bidi
 * override or a lone surrogate is a defect on any surface.
 *
 * @param {string} bucket the content bucket
 * @param {Record<string, unknown>} definition the authored definition
 * @param {CustomContentCharsetTable} [table] the charset table
 * @returns {{rejections:CharsetRejection[], marks:CharsetRejection[]}} the findings
 */
export function validateCustomContentCharset(bucket, definition, table = CUSTOM_CONTENT_CHARSET) {
  /** @type {CharsetRejection[]} */
  const found = [];
  const classes = table?.fields?.[bucket];
  if (!classes || !definition || typeof definition !== 'object') {
    return { rejections: [], marks: [] };
  }

  for (const [field, cls] of Object.entries(classes)) {
    const raw = definition[field];
    if (typeof raw === 'string') {
      walkString(raw, bucket, field, cls, table, undefined, found);
    } else if (Array.isArray(raw)) {
      raw.forEach((entry, item) => {
        if (typeof entry === 'string') walkString(entry, bucket, field, cls, table, item, found);
      });
    }
  }

  if (table?.policy?.nonLatin !== 'keep_and_mark') {
    return { rejections: found, marks: [] };
  }
  /** @type {CharsetRejection[]} */
  const rejections = [];
  /** @type {CharsetRejection[]} */
  const marks = [];
  for (const entry of found) {
    if (entry.code === 'uncovered_codepoint' && entry.surface !== 'web-display') marks.push(entry);
    else rejections.push(entry);
  }
  return { rejections, marks };
}
