/**
 * tests/copy/localeParity.test.js — the localization extraction-completeness pin
 * (V-27a scaffold).
 *
 * The localization door swings on ONE invariant: a locale is only valid if it
 * covers every key the base `en` locale defines. This pins that invariant with
 * the walker set-equality idiom (mirrors tests/store/operationRegistry.walker):
 * collect every string-leaf key-path of `en` (the denominator), collect the
 * pseudo-locale's key-paths, and assert both directions are empty-diff — no
 * missing keys (completeness), no orphan keys (no stale). The moment a real
 * hand-authored locale (es.js, …) is added, this same pin is the gate it must
 * pass before it can ship.
 *
 * It also proves the door actually swings: activating the pseudo-locale changes
 * what `t()` returns, interpolation survives the transform, and falling back to
 * `en` covers a partial locale.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { en } from '../../src/copy/en.js';
import { pseudo, pseudoString, PSEUDO_LOCALE_ID } from '../../src/copy/pseudo.js';
import {
  t,
  getLocale,
  setLocale,
  registerLocale,
  listLocales,
  loadPseudoLocale,
} from '../../src/copy/index.js';

// Collect the key-path of every string leaf, including array indices (so array
// length is part of the contract, not just object keys).
function leafPaths(node, prefix = '', out = []) {
  if (typeof node === 'string') {
    out.push(prefix);
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((el, i) => leafPaths(el, prefix ? `${prefix}.${i}` : String(i), out));
    return out;
  }
  if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) {
      leafPaths(node[k], prefix ? `${prefix}.${k}` : k, out);
    }
    return out;
  }
  return out;
}

// Always leave the shared module-level active locale on 'en' for other suites.
afterEach(() => setLocale('en'));

describe('locale extraction-completeness (en ⇄ pseudo key parity)', () => {
  const enKeys = leafPaths(en).sort();
  const pseudoKeys = leafPaths(pseudo).sort();

  it('every en key exists in the pseudo-locale (completeness)', () => {
    const missing = enKeys.filter((k) => !new Set(pseudoKeys).has(k));
    expect(missing).toEqual([]);
  });

  it('the pseudo-locale has no keys absent from en (no stale)', () => {
    const extra = pseudoKeys.filter((k) => !new Set(enKeys).has(k));
    expect(extra).toEqual([]);
  });

  it('anti-vacuity: the copy registry is substantial', () => {
    // Guards against a future refactor silently emptying the registry and
    // making the parity check pass on nothing.
    expect(enKeys.length).toBeGreaterThan(300);
  });
});

describe('the pseudo transform', () => {
  it('brackets and accents prose while preserving {placeholders}', () => {
    const out = pseudoString('Generate narrative ({cost} credits)');
    expect(out.startsWith('⟦')).toBe(true);
    expect(out.endsWith('⟧')).toBe(true);
    // The placeholder token survives verbatim so interpolation still works.
    expect(out).toContain('{cost}');
    // The prose is visibly transformed (at least one accented vowel).
    expect(out).not.toContain('Generate narrative');
  });

  it('is total over en — every leaf is a bracketed string', () => {
    const notBracketed = leafPaths(pseudo).filter((path) => {
      const val = path.split('.').reduce((o, seg) => o?.[seg], pseudo);
      return typeof val !== 'string' || !(val.startsWith('⟦') && val.endsWith('⟧'));
    });
    expect(notBracketed).toEqual([]);
  });
});

describe('the door swings (runtime locale activation)', () => {
  it('activating the pseudo-locale changes what t() returns', () => {
    const english = t('common.save');
    expect(getLocale()).toBe('en');

    registerLocale(PSEUDO_LOCALE_ID, pseudo);
    expect(setLocale(PSEUDO_LOCALE_ID)).toBe(true);
    expect(getLocale()).toBe(PSEUDO_LOCALE_ID);

    const localized = t('common.save');
    expect(localized).not.toBe(english);
    expect(localized.startsWith('⟦')).toBe(true);
  });

  it('interpolation survives the pseudo transform', () => {
    registerLocale(PSEUDO_LOCALE_ID, pseudo);
    setLocale(PSEUDO_LOCALE_ID);
    const out = t('ai.narrative.button', { cost: 3 });
    // The {cost} placeholder was preserved through the transform, so the
    // value still lands in the localized string.
    expect(out).toContain('3');
  });

  it('an unknown locale id is rejected and the active locale is unchanged', () => {
    expect(setLocale('zz-ZZ')).toBe(false);
    expect(getLocale()).toBe('en');
  });

  it('a partial locale falls back to en for keys it lacks', () => {
    // Register a locale that overrides exactly one key.
    registerLocale('en-PARTIAL', { common: { save: '⟦PARTIAL⟧' } });
    setLocale('en-PARTIAL');
    expect(t('common.save')).toBe('⟦PARTIAL⟧');
    // A key the partial locale lacks resolves through en, not a blank/keyname.
    expect(t('pricing.tiers.wanderer.name')).toBe('Wanderer');
  });

  it('loadPseudoLocale lazily registers the pseudo-locale', async () => {
    const id = await loadPseudoLocale();
    expect(id).toBe(PSEUDO_LOCALE_ID);
    expect(listLocales()).toContain(PSEUDO_LOCALE_ID);
  });
});
