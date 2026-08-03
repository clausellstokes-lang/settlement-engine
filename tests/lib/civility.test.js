/**
 * civility.test.js — the CLIENT mirror of the civility guard, executed against
 * the shared vector file (docs/DESIGN_PROFILE_IMAGE.md §9 "Pins").
 *
 * The design names four pins for this guard; three of them live here (the
 * fourth — "the server refuses what a bypassed client submits" — is the SQL
 * mirror's, asserted structurally in tests/lint/civilityMirrors.test.js because
 * this suite has no live database):
 *
 *   1. shared vectors green on this mirror
 *   2. the Scunthorpe fixture set (innocent-containing-substring names PASS)
 *   3. the evasion fixture set (casual leet/spacing variants FAIL)
 *
 * Plus the storage law's two-sided veil pin, which is the load-bearing one for
 * the VEIL mode: the public artifact carries no flagged term AND the author's
 * original is untouched.
 */
import { describe, expect, test } from 'vitest';

import {
  BLOCKED_VECTORS, CLEAN_VECTORS, VEIL_VECTORS, } from '../fixtures/civilityVectors.js';
import {
  CIVILITY_LIST_VERSION, VEIL_MARK, checkCivility, normalizeTokens, veilDeep, veilText,
} from '../../src/lib/civility.js';
import { TERMS } from '../../src/data/civilityLists.js';

describe('civility guard — BLOCK mode', () => {
  test.each(CLEAN_VECTORS)('passes $text — $why', ({ text }) => {
    expect(checkCivility(text).blocked).toBe(false);
  });

  test.each(BLOCKED_VECTORS)('blocks $why', ({ text }) => {
    expect(checkCivility(text).blocked).toBe(true);
  });

  test('every listed term is blocked in its bare form (the list is actually wired)', () => {
    // Guards the vacuous-pin failure mode: if the lists failed to load, or the
    // normalizer folded everything to empty, the CLEAN set would still pass and
    // only a handful of BLOCKED entries would fail. This asserts the whole list.
    for (const term of TERMS) {
      expect(checkCivility(term).blocked, `term "${term}" must block`).toBe(true);
    }
  });

  test('reports the list version and NEVER the matched term (the no-echo law)', () => {
    const verdict = checkCivility('shit');
    expect(verdict).toEqual({ blocked: true, version: CIVILITY_LIST_VERSION });
    // A refusal surface that cannot obtain the term cannot echo it back at the
    // author — §9's "no echo of the matched term" is structural, not a copy rule.
    expect(Object.keys(verdict).sort()).toEqual(['blocked', 'version']);
  });

  test('non-string input is never blocked and never throws', () => {
    for (const input of [null, undefined, 42, {}, [], true]) {
      expect(checkCivility(/** @type {never} */ (input)).blocked).toBe(false);
    }
  });
});

describe('civility guard — the normalizer', () => {
  test('token spans point back into the ORIGINAL string, not the folded one', () => {
    // The veil depends on this: it must mask the author's real characters.
    const text = 'Hello  Wörld';
    const tokens = normalizeTokens(text);
    expect(tokens.map((t) => t.raw)).toEqual(['hello', 'world']);
    expect(text.slice(tokens[0].start, tokens[0].end)).toBe('Hello');
    expect(text.slice(tokens[1].start, tokens[1].end)).toBe('Wörld');
  });

  test('a multi-byte code point maps its whole width', () => {
    const text = 'a😀b';
    const tokens = normalizeTokens(text);
    expect(tokens.map((t) => t.raw)).toEqual(['a', 'b']);
    expect(text.slice(tokens[1].start, tokens[1].end)).toBe('b');
  });
});

describe('civility guard — VEIL mode', () => {
  test.each(VEIL_VECTORS)('veils: $why', ({ text, masked }) => {
    expect(veilText(text)).toBe(masked);
  });

  test('clean text returns the SAME string instance (no needless copying)', () => {
    const clean = 'A quiet plot hook.';
    expect(veilText(clean)).toBe(clean);
  });

  test('THE STORAGE LAW: veiling never mutates the author input', () => {
    const original = { secret: 'the priest is a shit', nested: { hook: ['bring shit', 7] } };
    const snapshot = JSON.parse(JSON.stringify(original));
    const veiled = veilDeep(original);

    // The author's own object survives byte-intact — their world is theirs.
    expect(original).toEqual(snapshot);
    expect(veiled).not.toBe(original);
    expect(veiled.nested).not.toBe(original.nested);

    // The public artifact carries no flagged term.
    expect(veiled.secret).toBe(`the priest is a ${VEIL_MARK}`);
    expect(veiled.nested.hook[0]).toBe(`bring ${VEIL_MARK}`);
    expect(veiled.nested.hook[1]).toBe(7);
  });

  test('a veiled projection is itself clean (the artifact carries no flagged term)', () => {
    for (const { text } of BLOCKED_VECTORS) {
      expect(checkCivility(veilText(text)).blocked, `veiled "${text}" must be clean`).toBe(false);
    }
  });

  test('veilDeep leaves non-JSON values alone rather than reconstructing them', () => {
    const when = new Date(0);
    const out = veilDeep({ when, count: 3, flag: false, missing: null });
    expect(out.when).toBe(when);
    expect(out.count).toBe(3);
    expect(out.flag).toBe(false);
    expect(out.missing).toBe(null);
  });
});
