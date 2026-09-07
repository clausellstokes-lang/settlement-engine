/**
 * magicBandReceipt.test.js — MG-3g: LEAK L9 CLOSED
 * (docs/DESIGN_REALM_MAGIC_TOGGLE.md §3 leak register, §4 MG-3 slice g).
 *
 * THE LEAK: canonBand's default arm swallowed ANY unrecognised band token into 'medium'
 * SILENTLY. That silence has already cost this project once — the medium/moderate
 * zero-supply incident magicLedger's own header documents, where a whole band matched
 * nothing and contributed zero supply for as long as nobody thought to look.
 *
 * THE CLOSURE: the fold is UNCHANGED (altering the fallback would be a live-behaviour
 * change with an unmeasured blast radius and is not this slice's business); the GUESS is
 * now receipted. Silence was the defect, not the value.
 *
 * The receipt rides as a CONDITIONAL key so every well-formed settlement in the estate
 * returns the exact same four-key object it always did — that byte-identity is pinned
 * here as hard as the receipt itself, because a fifth key on the hot path would move
 * goldens across the whole ledger surface.
 */
import { describe, expect, test } from 'vitest';

import { magicLedger, KNOWN_MAGIC_BAND_TOKENS, UNKNOWN_BAND_FALLBACK } from '../../src/domain/magicLedger.js';

const bandOf = (magicLevel) => magicLedger({ config: { magicLevel } });

describe('MG-3g — L9: an unrecognised band token no longer folds in silence', () => {
  test('a nonsense token is folded AND receipted (the leak, closed)', () => {
    const led = magicLedger({ config: { magicLevel: 'mystical' } });
    expect(led.magicLevel).toBe(UNKNOWN_BAND_FALLBACK); // the fold itself is unchanged
    expect(led.unknownBand).toEqual({
      token: 'mystical',
      assumed: UNKNOWN_BAND_FALLBACK,
      reason: 'unrecognised magic band token folded to the neutral midpoint',
    });
  });

  test('the incident of record — a token meaning NONE would have read moderately magical', () => {
    // The worst case the silence allowed: an import or a misspelling that meant "no
    // magic here" landing in the WIDEST band with nothing anywhere saying so.
    const led = magicLedger({ config: { magicLevel: 'nil' } });
    expect(led.magicLevel).toBe('medium');
    expect(led.unknownBand.token).toBe('nil'); // now it says so
  });

  test('EVERY known token folds cleanly and carries NO receipt', () => {
    for (const token of KNOWN_MAGIC_BAND_TOKENS) {
      const led = bandOf(token);
      expect(['none', 'low', 'medium', 'high']).toContain(led.magicLevel);
      expect('unknownBand' in led).toBe(false);
    }
  });

  test('the legacy vocabulary still folds to exactly what it always folded to', () => {
    expect(bandOf('pervasive').magicLevel).toBe('high');
    expect(bandOf('common').magicLevel).toBe('medium');
    expect(bandOf('moderate').magicLevel).toBe('medium');
    expect(bandOf('rare').magicLevel).toBe('low');
    expect(bandOf('none').magicLevel).toBe('none');
  });

  test('BYTE-IDENTITY: a well-formed ledger is still exactly the four-key object', () => {
    const dial = magicLedger({ config: { priorityMagic: 40, magicExists: true } });
    expect(Object.keys(dial).sort()).toEqual(['magicExists', 'magicLevel', 'present', 'priorityMagic']);
    const legacy = bandOf('high');
    expect(Object.keys(legacy).sort()).toEqual(['magicExists', 'magicLevel', 'present', 'priorityMagic']);
    // The neutral envelope for an un-generated settlement is untouched too.
    const neutral = magicLedger({});
    expect(Object.keys(neutral).sort()).toEqual(['magicExists', 'magicLevel', 'present', 'priorityMagic']);
    expect(neutral.present).toBe(false);
  });

  test('the GRANULAR dial never guesses, so it never receipts (the band is derived, not read)', () => {
    // A settlement carrying both a dial and a junk band reads the DIAL — canonBand is
    // never consulted, so no receipt is minted. Anti-vacuity for the conditional key.
    const led = magicLedger({ config: { priorityMagic: 80, magicLevel: 'mystical' } });
    expect(led.magicLevel).toBe('high');
    expect('unknownBand' in led).toBe(false);
  });

  test('the closed vocabulary is the ONE list — no token is handled that it omits', () => {
    // Finite-semantics law: the exported vocabulary and the fold must not drift apart.
    for (const token of KNOWN_MAGIC_BAND_TOKENS) expect('unknownBand' in bandOf(token)).toBe(false);
    expect('unknownBand' in bandOf('definitely-not-a-band')).toBe(true);
  });
});
