/**
 * publicIdentity.test.js — the ONE display identity (DESIGN_PROFILE_IMAGE.md §1).
 *
 * The pins that matter here are consent pins. §7 asks for "Identity coherence:
 * consent off ⇒ no surface renders name OR image", and the only way to make that
 * a guarantee rather than a review note is to prove the resolver itself cannot
 * emit half an identity. Every consumer reads this projection, so a consent test
 * here is a consent test everywhere.
 */
import { describe, expect, test } from 'vitest';

import {
  AVATAR_RUNGS, avatarAlt, avatarHue, avatarLetter, avatarRungUrl, avatarSources,
  publicIdentityOf,
} from '../../src/lib/publicIdentity.js';

const MASTER = 'https://cdn.example.com/storage/v1/object/public/avatars/u1/abc123.webp';

describe('publicIdentityOf — the single consent switch', () => {
  test('consent ON yields the pair', () => {
    expect(publicIdentityOf({
      external_name: 'QuietCartographer418',
      avatar_url: MASTER,
      public_identity_opt_in: true,
    })).toEqual({ displayName: 'QuietCartographer418', imageUrl: MASTER, optedIn: true });
  });

  test('consent OFF blanks BOTH halves — never a name without an image, never the reverse', () => {
    const identity = publicIdentityOf({
      external_name: 'QuietCartographer418',
      avatar_url: MASTER,
      public_identity_opt_in: false,
    });
    expect(identity).toEqual({ displayName: '', imageUrl: '', optedIn: false });
  });

  test('FAILS CLOSED: an absent opt-in column reads as NOT opted in', () => {
    // The column ships dark. Until the migration deploys, every row lacks it —
    // and the safe reading of a missing consent is silence, not exposure.
    expect(publicIdentityOf({ external_name: 'Anon', avatar_url: MASTER }))
      .toEqual({ displayName: '', imageUrl: '', optedIn: false });
  });

  test('a truthy-but-not-true consent value does not open the gate', () => {
    for (const value of ['true', 1, {}, 'yes']) {
      expect(publicIdentityOf({ external_name: 'A', public_identity_opt_in: value }).optedIn)
        .toBe(false);
    }
  });

  test('null / non-object input yields a blank identity rather than throwing', () => {
    for (const input of [null, undefined, 'nope', 7]) {
      expect(publicIdentityOf(input)).toEqual({ displayName: '', imageUrl: '', optedIn: false });
    }
  });
});

describe('publicIdentityOf — spelling drift and precedence', () => {
  test('reads the camelCase auth object identically to the snake_case row', () => {
    const snake = publicIdentityOf({
      external_name: 'Same', avatar_url: MASTER, public_identity_opt_in: true,
    });
    const camel = publicIdentityOf({
      externalName: 'Same', avatarUrl: MASTER, publicIdentityOptIn: true,
    });
    expect(camel).toEqual(snake);
  });

  test('external_name wins over display_name (the public field is the public name)', () => {
    expect(publicIdentityOf({
      external_name: 'PublicHandle',
      display_name: 'Real Person Name',
      public_identity_opt_in: true,
    }).displayName).toBe('PublicHandle');
  });

  test('display_name is used only when external_name is absent (legacy rows)', () => {
    expect(publicIdentityOf({
      display_name: 'Legacy', public_identity_opt_in: true,
    }).displayName).toBe('Legacy');
  });

  test('a non-http(s) avatar URL is refused, leaving the letter fallback', () => {
    for (const bad of ['javascript:alert(1)', 'data:image/png;base64,AAA', 'not a url', '//host/x.webp']) {
      expect(publicIdentityOf({
        external_name: 'A', avatar_url: bad, public_identity_opt_in: true,
      }).imageUrl).toBe('');
    }
  });
});

describe('the size ladder', () => {
  test('derives the rungs beside the master, sharing its hash stem', () => {
    expect(avatarRungUrl(MASTER, 'master')).toBe(MASTER);
    expect(avatarRungUrl(MASTER, 'standard')).toBe(
      'https://cdn.example.com/storage/v1/object/public/avatars/u1/abc123-128.webp');
    expect(avatarRungUrl(MASTER, 'micro')).toBe(
      'https://cdn.example.com/storage/v1/object/public/avatars/u1/abc123-32.webp');
  });

  test('an extensionless URL is appended to, never corrupted', () => {
    expect(avatarRungUrl('https://h.example.com/a/b', 'micro')).toBe('https://h.example.com/a/b-32');
  });

  test('DEFENSE IN DEPTH — a hostile scheme is refused even by a hand-assembled identity', () => {
    // Regression pin. A caller that builds an identity object by hand rather
    // than through publicIdentityOf — which the account page's own self-view
    // legitimately does, because its consent semantics differ — would otherwise
    // hand an unsanitized string straight to an <img src>. That bug was real and
    // shipped for the length of one test run; this is the pin that caught it.
    for (const hostile of ['javascript:alert(1)', 'data:image/svg+xml,<svg onload=alert(1)>', '");background:red;//']) {
      expect(avatarSources(hostile, 'standard')).toBe(null);
      expect(avatarSources(hostile, 'micro')).toBe(null);
    }
    // Non-vacuity: the safe case still produces sources.
    expect(avatarSources(MASTER, 'standard')).not.toBe(null);
  });

  test('no image yields no sources (the caller falls to the letter-circle)', () => {
    expect(avatarSources('', 'micro')).toBe(null);
    expect(avatarSources(null, 'standard')).toBe(null);
  });

  test('§7 PIN — the 512 master is not even a CANDIDATE for a 32px slot', () => {
    const micro = avatarSources(MASTER, 'micro');
    expect(micro.sizes).toBe('32px');
    expect(micro.srcSet).toContain(`${AVATAR_RUNGS.micro}w`);
    expect(micro.srcSet).toContain(`${AVATAR_RUNGS.standard}w`);
    // The master's own filename must be absent from the micro candidate list, at
    // any pixel density — this is the design's "the 512 never ships to a 32px
    // slot" made structural rather than hoped for.
    expect(micro.srcSet).not.toContain('abc123.webp');
    expect(micro.src).toContain('-32.webp');
  });

  test('the standard slot may reach for the master at 2x, and does', () => {
    const standard = avatarSources(MASTER, 'standard');
    expect(standard.sizes).toBe('128px');
    expect(standard.src).toContain('-128.webp');
    expect(standard.srcSet).toContain(`abc123.webp ${AVATAR_RUNGS.master}w`);
  });
});

describe('the permanent letter-circle fallback', () => {
  test('takes the first letter or digit, upper-cased', () => {
    expect(avatarLetter({ displayName: 'quiet' })).toBe('Q');
    expect(avatarLetter('  _hollow')).toBe('H');
    expect(avatarLetter('418Cairn')).toBe('4');
  });

  test('never renders empty — an unnamed identity still gets a circle', () => {
    expect(avatarLetter({ displayName: '' })).toBe('?');
    expect(avatarLetter(null)).toBe('?');
    expect(avatarLetter('***')).toBe('?');
  });

  test('the hue is deterministic and stays inside the gold band', () => {
    const a = avatarHue('QuietCartographer418');
    expect(avatarHue('QuietCartographer418')).toBe(a);
    for (const name of ['a', 'Amber Steward', '', 'Zzz', 'QuietCartographer418']) {
      const hue = avatarHue(name);
      expect(hue).toBeGreaterThanOrEqual(36);
      expect(hue).toBeLessThan(54);
    }
  });

  test('alt text is the display name, never a decorative phrase', () => {
    expect(avatarAlt({ displayName: 'Amber Steward' })).toBe('Amber Steward');
    expect(avatarAlt({ displayName: '' })).toBe('');
    expect(avatarAlt(null)).toBe('');
  });
});
