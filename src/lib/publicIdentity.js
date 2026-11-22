/**
 * publicIdentity.js — THE ONE PUBLIC DISPLAY IDENTITY
 * (docs/DESIGN_PROFILE_IMAGE.md §1, §2, §4, §6).
 *
 * THE RULING THIS FILE EXISTS TO ENFORCE: a display name and a profile image are
 * ONE public display identity, not two switches. A single opt-in governs whether
 * the PAIR renders anywhere public, and every consumer — gallery author lines,
 * Founders' Hall plates, comment rows — reads the SAME projection from this one
 * resolver. No surface composes a name and an image independently, so consent
 * withdrawal blanks both everywhere at once rather than leaving an image behind
 * on the one surface somebody forgot.
 *
 * ⚠️ ZERO IMPORTS, DELIBERATELY. This module is pure string/number math with no
 * dependency on Supabase, the store, React or the DOM. That is a first-paint
 * budget decision as much as a testability one: an identity resolver is exactly
 * the kind of module that ends up imported from an EAGER surface, and if it
 * transitively pulled the storage client in, it would re-parent that client into
 * the first-paint closure (the recorded lazy-chunk re-parenting hazard). The
 * dependency therefore points the other way: src/lib/avatarUpload.js (network +
 * canvas) imports THIS, never the reverse.
 *
 * ── WHICH NAME IS THE PUBLIC NAME (a judgment, vetoable)
 * The schema carries two: `display_name` (migration 009 — the account's own
 * name, shown in the nav and the account page) and `external_name` (migration
 * 075 — auto-assigned, globally unique, reserved-word and profanity guarded, and
 * documented there as "the gallery AUTHOR shown on each shared settlement/map").
 * The public identity resolves `external_name` FIRST, because it is the field
 * built to be public and already carries the uniqueness + reserved-word guard;
 * `display_name` is a fallback for legacy rows only. Making `display_name`
 * public instead would quietly publish a field users entered as their own name,
 * often their real one. Say "veto" to flip the precedence.
 */

/**
 * The size ladder (§2). The canonical asset is ONE SQUARE MASTER at 512; 128
 * serves author lines and hall plates; 32 serves micro contexts (comment rows,
 * compact lists). The frame is circular AT RENDER and the asset is square AT
 * REST, so a surface stays free to choose its own ring treatment and a future
 * surface is not locked out by a pre-masked circle.
 */
export const AVATAR_RUNGS = Object.freeze({ master: 512, standard: 128, micro: 32 });

/** The rungs a consumer may ask for by name. */
export const AVATAR_RUNG_NAMES = Object.freeze(['micro', 'standard', 'master']);

/**
 * Derive a ladder rung's URL from the MASTER url.
 *
 * Storage layout (§2): `avatars/{userId}/{hash}.webp` for the master, with
 * `{hash}-128.webp` / `{hash}-32.webp` beside it. The content hash IS the
 * cache-buster, so objects are immutable and a replacement writes a new name
 * rather than mutating one — no cache-busting query string, ever.
 *
 * Returns '' for a falsy or non-string master so callers fall to the letter.
 *
 * @param {unknown} masterUrl
 * @param {'micro'|'standard'|'master'} rung
 * @returns {string}
 */
export function avatarRungUrl(masterUrl, rung) {
  if (typeof masterUrl !== 'string' || masterUrl.length === 0) return '';
  if (rung === 'master') return masterUrl;
  const px = rung === 'micro' ? AVATAR_RUNGS.micro : AVATAR_RUNGS.standard;
  const dot = masterUrl.lastIndexOf('.');
  // No extension (or a dot that belongs to the host, not the file) — append
  // rather than corrupt the URL.
  if (dot <= masterUrl.lastIndexOf('/')) return `${masterUrl}-${px}`;
  return `${masterUrl.slice(0, dot)}-${px}${masterUrl.slice(dot)}`;
}

/**
 * The `<img>` triplet for a rendered avatar slot (§6).
 *
 * Uses WIDTH descriptors plus an explicit `sizes`, not `1x/2x` — that is what
 * makes the design's pin enforceable. With `sizes: '32px'` and candidates of
 * 32w and 128w, the 512 master is NOT A CANDIDATE for a micro slot at any pixel
 * density, so "the 512 never ships to a 32px slot" is a property of the markup
 * rather than a hope about browser behavior. A retina micro slot still gets the
 * crisp 128.
 *
 * @param {unknown} masterUrl
 * @param {'micro'|'standard'} rung
 * @returns {{ src: string, srcSet: string, sizes: string } | null} null when there is no image
 */
export function avatarSources(masterUrl, rung) {
  // ⚠️ THE SCHEME GUARD LIVES HERE, not only in publicIdentityOf, and that is
  // deliberate defense in depth. publicIdentityOf sanitizes the URL it reads
  // from a profile row — but a caller can hand-assemble an identity object
  // (the account page's own self-view legitimately does, because its optedIn
  // semantics differ from a public surface's), and such a caller would
  // otherwise route an unsanitized string straight into an <img src>. This
  // function is the ONE place a rendered source is produced, so refusing a
  // non-http(s) scheme here makes the guarantee hold for every consumer,
  // including the ones written later by someone who never read §6.
  const safe = safeHttpUrl(masterUrl);
  const micro = avatarRungUrl(safe, 'micro');
  const standard = avatarRungUrl(safe, 'standard');
  if (!micro || !standard) return null;
  if (rung === 'micro') {
    return {
      src: micro,
      srcSet: `${micro} ${AVATAR_RUNGS.micro}w, ${standard} ${AVATAR_RUNGS.standard}w`,
      sizes: `${AVATAR_RUNGS.micro}px`,
    };
  }
  const master = avatarRungUrl(safe, 'master');
  return {
    src: standard,
    srcSet: `${standard} ${AVATAR_RUNGS.standard}w, ${master} ${AVATAR_RUNGS.master}w`,
    sizes: `${AVATAR_RUNGS.standard}px`,
  };
}

/**
 * Only http(s) URLs are ever rendered. A `javascript:` or `data:` avatar URL is
 * refused here, once, so no consumer has to remember to. Mirrors the guard the
 * account page already applies to its own preview.
 * @param {unknown} url
 * @returns {string}
 */
function safeHttpUrl(url) {
  if (typeof url !== 'string' || url.length === 0) return '';
  try {
    // Parsed WITHOUT a base, so only absolute URLs qualify.
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.href;
  } catch {
    return '';
  }
}

/** Read a field under either spelling. */
function pick(row, snake, camel) {
  const viaSnake = row?.[snake];
  if (typeof viaSnake === 'string' && viaSnake.length > 0) return viaSnake;
  const viaCamel = row?.[camel];
  if (typeof viaCamel === 'string' && viaCamel.length > 0) return viaCamel;
  return '';
}

/**
 * @typedef {Object} PublicIdentity
 * @property {string} displayName  '' when consent is off or no name exists
 * @property {string} imageUrl     the MASTER url; '' when consent is off or none
 * @property {boolean} optedIn     the single §1 consent switch
 */

/**
 * THE RESOLVER. Project a profile row to its public display identity.
 *
 * ⚠️ FAILS CLOSED, and the direction matters: an ABSENT opt-in column reads as
 * NOT opted in. The column ships with a migration that is dark and undeployed,
 * so on every tree where the schema has not landed this resolver returns a blank
 * identity and public surfaces render nothing rather than publishing a name and
 * face nobody consented to. Silence is the safe failure here; exposure is not.
 *
 * Accepts BOTH the snake_case database row and the camelCase auth object,
 * because both spellings genuinely exist in this codebase and a resolver that
 * silently returned a blank identity for the wrong one would be the
 * writer/reader spelling-drift hazard wearing a consent switch. Pinned for both.
 *
 * @param {unknown} profile a profiles row, an auth object, or null
 * @returns {PublicIdentity}
 */
export function publicIdentityOf(profile) {
  const row = (profile && typeof profile === 'object') ? /** @type {Record<string, unknown>} */ (profile) : null;
  const blank = { displayName: '', imageUrl: '', optedIn: false };
  if (!row) return blank;

  const consent = row.public_identity_opt_in ?? row.publicIdentityOptIn;
  if (consent !== true) return blank;

  // external_name FIRST — see the header's precedence judgment.
  const displayName = pick(row, 'external_name', 'externalName')
    || pick(row, 'display_name', 'displayName');
  const imageUrl = safeHttpUrl(pick(row, 'avatar_url', 'avatarUrl'));

  return { displayName, imageUrl, optedIn: true };
}

/**
 * The letter for the PERMANENT fallback circle (§4).
 *
 * The letter-circle is not a broken state and never renders as one: no avatar is
 * an ordinary, finished condition of the product. Returns a single upper-case
 * character, or '?' when there is nothing to take one from.
 *
 * @param {{ displayName?: string } | string | null | undefined} identityOrName
 * @returns {string}
 */
export function avatarLetter(identityOrName) {
  const name = typeof identityOrName === 'string'
    ? identityOrName
    : (identityOrName?.displayName || '');
  for (const ch of name.trim()) {
    // Skip leading punctuation/emoji so "  _quiet" yields Q, not underscore.
    if (/\p{L}|\p{N}/u.test(ch)) return ch.toUpperCase();
  }
  return '?';
}

/**
 * The deterministic gold hue behind the fallback letter (§4).
 *
 * Deterministic in the product's sense: the same identity always shows the same
 * circle, on every device and every reload, because the hue is a pure function
 * of the name rather than of a random or a render count. The band is narrow and
 * stays inside the house gold so a wall of fallback circles reads as one family.
 *
 * @param {{ displayName?: string } | string | null | undefined} identityOrName
 * @returns {number} hue in degrees, within the gold band
 */
export function avatarHue(identityOrName) {
  const name = typeof identityOrName === 'string'
    ? identityOrName
    : (identityOrName?.displayName || '');
  // FNV-1a: a small, well-behaved, dependency-free string hash. Not security.
  let hash = 0x811c9dc5;
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  const GOLD_HUE_MIN = 36;
  const GOLD_HUE_SPAN = 18;
  return GOLD_HUE_MIN + (hash % GOLD_HUE_SPAN);
}

/**
 * Alt text for an avatar image (§6): ALWAYS the display name, never a decorative
 * phrase and never the word "avatar". The image is never the only carrier of
 * identity — every surface that shows it also shows the name as text — so the
 * alt text repeats the name rather than inventing content for it.
 *
 * @param {{ displayName?: string } | null | undefined} identity
 * @returns {string}
 */
export function avatarAlt(identity) {
  return identity?.displayName || '';
}
