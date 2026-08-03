/**
 * publicIdentitySingleRender.walker.test.js — THE STRUCTURAL GUARD behind §1
 * (DESIGN_PROFILE_IMAGE.md: "No surface composes name and image independently").
 *
 * WHY A WALKER AND NOT A CODE REVIEW. §1's guarantee is that a display name and a
 * profile image are ONE identity under ONE consent, so that withdrawing consent
 * blanks both everywhere at once. Today that holds because exactly one resolver
 * (publicIdentityOf) and one renderer (PublicAvatar) exist and everyone uses
 * them. But this feature's whole point is that OTHER lanes will add public
 * surfaces later — the gallery author line, Founders' Hall plates, comment rows —
 * and a guarantee maintained by everyone remembering is a guarantee until the
 * first person who does not. The cost of that lapse is not a visual bug: it is a
 * user who turned their visibility off and still has their face on a page.
 *
 * So the invariant is enforced rather than documented. This is the
 * registration-manifest idiom: the census of files that touch the avatar pointer
 * must EQUAL the manifest below. A new file reading it fails here, and joining
 * the manifest is a deliberate act with a reason attached — which is exactly the
 * moment to ask "should this be calling publicIdentityOf instead?".
 *
 * WHAT THIS CANNOT CATCH, said plainly rather than implied away:
 *   • A surface that renders a name WITHOUT an image (no avatar token to scan
 *     for). The consent half of §1 covers names too, and only review catches a
 *     new bare-name render.
 *   • An avatar URL reached through an alias or a computed key.
 *   • Server-side renders. There are none today.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/**
 * THE MANIFEST — every file permitted to touch the avatar pointer, each with the
 * reason it is allowed to. Adding a row is the deliberate act; the reason is for
 * the reviewer who will one day ask why this file is here.
 */
const AVATAR_READERS = Object.freeze({
  'src/lib/publicIdentity.js':
    'THE RESOLVER. The one place a profile row becomes a public identity.',
  'src/lib/auth.js':
    'The profile read/write transport — it carries avatar_url between the row and the store.',
  'src/store/authSlice.js':
    'The auth cache + setAvatarUrl, the one store action that moves the pointer.',
  'src/components/account/AccountIdentitySection.jsx':
    'THE SINGLE WRITER of profiles.avatar_url (upload, replace, remove, sweep).',
  'src/components/account/AccountProfileSection.jsx':
    'The account self-view header, which renders through PublicAvatar.',
  'src/components/AccountPage.jsx':
    'Owns the auth-refresh call whose payload carries avatarUrl through setAuth.',
});

/** Files allowed to build an <img> from an avatar source. Exactly one. */
const AVATAR_RENDERERS = Object.freeze(['src/components/primitives/PublicAvatar.jsx']);

function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(js|jsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const stripComments = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const FILES = walk(SRC).map((f) => ({
  rel: relative(ROOT, f).replace(/\\/g, '/'),
  body: stripComments(readFileSync(f, 'utf8')),
}));

describe('the public display identity has ONE resolver and ONE renderer', () => {
  test('NON-VACUITY — the scan actually sees this repo', () => {
    // Without this, a broken walk() or a bad strip would make every assertion
    // below pass by finding nothing at all.
    expect(FILES.length).toBeGreaterThan(200);
    expect(FILES.some((f) => f.rel === 'src/lib/publicIdentity.js')).toBe(true);
  });

  test('the census of avatar readers EQUALS the manifest', () => {
    const found = FILES
      .filter((f) => /\bavatarUrl\b|\bavatar_url\b/.test(f.body))
      .map((f) => f.rel)
      .sort();
    const declared = Object.keys(AVATAR_READERS).sort();

    const undeclared = found.filter((f) => !declared.includes(f));
    const stale = declared.filter((f) => !found.includes(f));

    expect(
      undeclared,
      'A new file reads the avatar pointer. Before adding it to AVATAR_READERS, ask '
      + 'whether it should call publicIdentityOf() instead — a surface that composes a '
      + 'name and an image itself is the one that keeps showing a face after consent '
      + 'is withdrawn (DESIGN_PROFILE_IMAGE.md §1).',
    ).toEqual([]);

    expect(
      stale,
      'A manifest row no longer reads the avatar pointer — delete the row to keep the '
      + 'census honest rather than leaving slack for the next arrival.',
    ).toEqual([]);
  });

  test('only PublicAvatar turns an avatar into an <img>', () => {
    // avatarSources() is the one function that produces a rendered source, so
    // any file calling it and emitting markup is a second renderer.
    const renderers = FILES
      .filter((f) => /avatarSources\s*\(/.test(f.body) && /<img\b/.test(f.body))
      .map((f) => f.rel)
      .sort();
    expect(renderers).toEqual([...AVATAR_RENDERERS].sort());
  });

  test('every manifest row is real (no row names a deleted file)', () => {
    const known = new Set(FILES.map((f) => f.rel));
    for (const row of [...Object.keys(AVATAR_READERS), ...AVATAR_RENDERERS]) {
      expect(known.has(row), `manifest row "${row}" does not exist`).toBe(true);
    }
  });

  test('the consent flag is read ONLY through the resolver', () => {
    // The sharpest form of §1: if a component tests public_identity_opt_in
    // itself, it has begun making its own consent decision, and the single
    // switch has quietly become two. AccountIdentitySection is the exception —
    // it is the surface that SETS the flag.
    const SETTER = 'src/components/account/AccountIdentitySection.jsx';
    const readers = FILES
      .filter((f) => /public_identity_opt_in|publicIdentityOptIn/.test(f.body))
      .map((f) => f.rel)
      .filter((rel) => rel !== 'src/lib/publicIdentity.js' && rel !== SETTER)
      .sort();
    expect(
      readers,
      'Read consent through publicIdentityOf(), never directly: a surface that '
      + 'branches on the flag itself is a second consent decision, and the two will '
      + 'disagree the first time one of them is updated alone.',
    ).toEqual([]);
  });
});
