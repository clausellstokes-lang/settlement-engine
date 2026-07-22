/**
 * sourceContract.test.js — self-test for the fail-closed source extractors.
 *
 * Proves the chokepoint's load-bearing property: every extractor THROWS (never returns a
 * silent '' / empty set) when its target is absent or its input is reshaped. If any of
 * these regress to a silent fallback, the contract tests that route through them would go
 * vacuously green — so this file is the guard on the guard.
 */
import { describe, it, expect } from 'vitest';
import {
  mustExtract,
  functionBody,
  sqlFunctionBody,
  jsRegexTokens,
  sqlRegexAlternation,
} from './sourceContract.js';

const JS_SRC = [
  "export function alpha(x) {",
  "  return x + 1;",
  "}",
  "",
  "export async function fetchThing(slug) {",
  "  return slug.toUpperCase();",
  "}",
].join('\n');

const SQL_SRC = [
  'create or replace function public._demo_scanner(value jsonb)',
  'returns boolean language plpgsql as $$',
  'begin',
  "  if key ~* ('^('",
  "    -- covert / seed channels (a comment mentioning secret must NOT pollute)",
  "    || 'covert|rngSeed|seed|rollExplanations?'",
  "    || '|.*secret.*|.*\\mdm.*|.*\\ynotes?\\y.*|.*_config.*'",
  "    || ')$') then",
  '    return false;',
  '  end if;',
  '  return true;',
  'end;',
  '$$;',
].join('\n');

describe('sourceContract.mustExtract', () => {
  it('returns the match when present (string and regex)', () => {
    expect(mustExtract(JS_SRC, 'function alpha')).toBe('function alpha');
    expect(mustExtract(JS_SRC, /async function \w+/)).toBe('async function fetchThing');
  });
  it('THROWS when the needle is absent — never returns a falsy sentinel', () => {
    expect(() => mustExtract(JS_SRC, 'function ghost')).toThrow(/not found/);
    expect(() => mustExtract(JS_SRC, /function ghost\d/)).toThrow(/not found/);
  });
  it('throws on a non-string source', () => {
    expect(() => mustExtract(null, 'x')).toThrow(/not a string/);
  });
});

describe('sourceContract.functionBody', () => {
  it('extracts a non-empty body up to the next top-level export', () => {
    const body = functionBody(JS_SRC, 'alpha');
    expect(body).toContain('return x + 1;');
    expect(body).not.toContain('fetchThing'); // stops at the next export
  });
  it('matches an `export async function` anchor', () => {
    expect(functionBody(JS_SRC, 'fetchThing')).toContain('toUpperCase');
  });
  it('THROWS when the function is absent (the M7 silent empty-string failure mode)', () => {
    expect(() => functionBody(JS_SRC, 'renamedAway')).toThrow(/not found/);
  });
});

describe('sourceContract.sqlFunctionBody', () => {
  it('extracts the definition up to the closing $$;', () => {
    const body = sqlFunctionBody(SQL_SRC, 'public._demo_scanner');
    expect(body).toContain('returns boolean');
    expect(body).toContain('return false;');
  });
  it('THROWS when the SQL function is absent', () => {
    expect(() => sqlFunctionBody(SQL_SRC, 'public._nope')).toThrow(/not found/);
  });
});

describe('sourceContract.jsRegexTokens', () => {
  it('extracts concrete stems, stripping boundaries and expanding optional chars', () => {
    const toks = jsRegexTokens('(secret|\\bdm|\\bnotes?\\b|rollExplanations?)');
    expect(new Set(toks)).toEqual(new Set(['secret', 'dm', 'note', 'notes', 'rollexplanation', 'rollexplanations']));
  });
  it('THROWS on an unhandled metachar rather than silently mangling (the M8 filter-Boolean failure mode)', () => {
    expect(() => jsRegexTokens('(a|[xy]z)')).toThrow(/metachar|nested/);
  });
  it('THROWS on a zero-token / empty alternative', () => {
    expect(() => jsRegexTokens('(a||b)')).toThrow(/empty alternative/);
  });
});

describe('sourceContract.sqlRegexAlternation', () => {
  it('rebuilds the alternation from concatenated literals, comments stripped', () => {
    const alts = sqlRegexAlternation(SQL_SRC.toLowerCase());
    // whole-key alternatives keep their shape; contains-alternatives keep `.*`; \m/\y gone.
    expect(alts).toContain('covert');
    expect(alts).toContain('rollexplanations?');
    expect(alts).toContain('.*secret.*');
    expect(alts).toContain('.*dm.*');       // \m boundary stripped
    expect(alts).toContain('.*notes?.*');   // \y boundaries stripped, ? preserved
    // comment prose ("secret") must not have produced a bare `secret` alternative
    expect(alts).not.toContain('secret');
  });
  it('the alternatives are MEMBERSHIP regexes, not substrings', () => {
    const alts = sqlRegexAlternation(SQL_SRC.toLowerCase());
    const denies = (key) => alts.some((a) => new RegExp(`^${a}$`, 'i').test(key));
    expect(denies('seed')).toBe(true);
    expect(denies('note')).toBe(true);          // notes? optional-s
    expect(denies('rollexplanation')).toBe(true);
    expect(denies('dmNotes')).toBe(true);       // .*dm.* contains-semantics
    expect(denies('publicName')).toBe(false);   // not denied — a real membership miss shows
  });
  it('THROWS when the scanner expression is absent', () => {
    expect(() => sqlRegexAlternation('create function noop() returns void as $$ begin end; $$;')).toThrow(/no .* regex expression/);
  });
});
