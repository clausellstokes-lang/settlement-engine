/**
 * anonForkSalt.js — THE PER-VISITOR FORK SALT (REVIEW-P F1, ODQ §934.63).
 *
 * Why this exists:
 *   A curated sample's fork seed is `${sample.config.seed}-${who}` — and for a
 *   signed-out reader `who` used to be the constant string 'anon'. A constant is
 *   the same constant in every browser on earth, so two anonymous visitors
 *   forking Cnocby were handed the SAME seed, hence the same `idFromSeed` id
 *   (domain/normalizeSettlement.js) and byte-for-byte the same town: same
 *   population, same four NPCs, same first faction. Walked and measured on two
 *   independent browser contexts, 2026-09-20.
 *
 *   The create landing promises the opposite in as many words — "no two the
 *   same, all deterministic from their seed" (generate/FoundingWorlds.jsx) —
 *   and the Library's sample dashboard promises "Each forks with a unique
 *   character. Same setting, different settlement." This module is what makes
 *   both sentences true without editing either of them.
 *
 * ⭐ THE SHAPE IS A SALT, NOT A COUNTER, AND BOTH HALVES MATTER.
 *   MINTED ONCE and then held: a visitor's own second fork of Cnocby must land
 *   on the SAME town, because THE PROMISE is that a seed is a starting world
 *   forever and a reader who reloads has not asked for a different place. Two
 *   different visitors must land on different towns. A per-click mint would buy
 *   the second at the cost of the first; a constant buys the first at the cost
 *   of the second. A per-VISITOR constant is the only value that pays for both.
 *
 * ⛔ THIS IS NOT THE PARKED QUESTION. docs/DESIGN_FP_ARCH_EP.md §7a row 1 parks
 *   "should a SECOND CLICK by the same user draw fresh?" as owner-gated, and its
 *   own text says today's justification "is about different USERS, never a
 *   second click". This module answers the different-USERS half only and leaves
 *   the same-user half exactly as it stands, so a later living-door ruling
 *   composes on top of it with nothing to undo here.
 *
 * ⛔ IT LIVES IN lib/ BECAUSE data/ MAY NOT MINT IT. `forkSeedFor` is in
 *   src/data, which is pure data by a rule with two enforcers (eslint
 *   no-restricted-imports + tests/domain/dataPurity.test.js) so that ambient
 *   entropy and IO cannot reach the tables. A salt is both. So the fork doors
 *   resolve WHO IS FORKING here, through `forkIdentity`, and hand `forkSeedFor`
 *   a value it can stay a pure function of.
 *
 * ⛔ NOT A SCHEMA, AND DELIBERATELY NOT THE STORE'S ENVELOPE. The anonymous
 *   draft rides zustand's persisted projection under PERSIST_KEY
 *   (store/persistProjection.js), whose key set is frozen by a walker
 *   (tests/store/lifecycleRoundTrip.test.js ZUSTAND_PERSIST_KEYS) and whose
 *   every key has to be covered in mergePersistedState. A salt is not part of a
 *   world and has no business widening that shape, so it lives where the other
 *   device-local facts live: its own key, beside `sf.anon.gens`
 *   (lib/anonGenCounter.js) and `sf_view_token` (lib/deviceToken.js), whose
 *   mint-once-and-hold shape this file follows deliberately rather than
 *   inventing a second one.
 *
 * ⚠ IT NEVER IDENTIFIES ANYONE. It is opaque random entropy with no meaning
 *   outside this one derivation, it is never transmitted, and the seed it ends
 *   up inside is stripped from every published dossier by the gallery's own
 *   contract, "never the generation seed" (lib/gallery.js stripImportConfidential,
 *   pinned by tests/security/gallerySeedLeak.pglite.test.js).
 *
 * Degradation: a private-mode or storage-blocked browser cannot remember
 * anything, so it falls back to an in-memory salt. That visitor still differs
 * from every other visitor (the point of the cure) and still repeats within the
 * page they are on; only across reloads can they not be remembered. Strictly
 * better than the constant it replaces, on both axes.
 */

import { fnv1a32 } from '../kernel/proseHash.js';

const KEY = 'sf.anon.fork-salt';

/**
 * The second hash round's domain, PREPENDED to the id (see `accountDigest`). The
 * trailing NUL keeps the domain from running into the id, so no account id can be
 * chosen to imitate the prefix boundary.
 *
 * ⛔ BUILT WITH `fromCharCode`, NOT WRITTEN AS A LITERAL, AND THAT IS NOT FUSSINESS.
 * A raw NUL byte in a source file makes git classify the whole file as BINARY: the
 * first cut of this line embedded one, and `git diff --numstat` reported `-  -`
 * for it, meaning every future review of this module would have shown "binary file
 * differs" instead of the change. The escape has to survive as SOURCE text, so the
 * character is constructed rather than typed.
 */
const DIGEST_DOMAIN = `sf.fork${String.fromCharCode(0)}`;

/**
 * ⭐ THE SUFFIX IS AN ADDRESS, SO ITS WIDTH IS DECLARED HERE AND NOWHERE ELSE.
 *
 * A fork seed is `${card seed}-${suffix}`, and §7a row 1 calls that seed "the
 * address … typeable in the `SeedField`". An account id used whole made it ~48
 * characters, which is a string a reader copies rather than types. Both widths
 * are named here so the tests can pin the seed's length against the module's own
 * contract instead of against a number somebody chose in a test file.
 */
export const ACCOUNT_DIGEST_HEX = 12;
export const ANON_SALT_HEX = 12;
/** The widest suffix either branch can produce. */
export const FORK_SUFFIX_MAX = Math.max(ACCOUNT_DIGEST_HEX, ANON_SALT_HEX);

// Fallback when localStorage is unavailable (private mode, sandboxed iframe,
// quota). Module-scoped so the salt is at least stable for the page's lifetime.
let memorySalt = null;

/** A short opaque token. Short because a fork seed is an address a reader can type. */
function mintSalt() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().replace(/-/g, '').slice(0, ANON_SALT_HEX);
    }
  } catch { /* fall through to the arithmetic mint */ }
  // Not cryptographically strong, and it does not need to be: this only has to
  // differ between two browsers, never resist an attacker.
  return `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`.slice(0, ANON_SALT_HEX);
}

/**
 * This visitor's fork salt, minting and storing one on first use.
 * Always returns a non-empty string, so a caller never has to branch on storage.
 * @returns {string}
 */
export function anonForkSalt() {
  let store = null;
  try {
    store = typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    /* localStorage access itself can throw in a sandboxed iframe — leave it null */
  }

  if (store) {
    try {
      const existing = store.getItem(KEY);
      // A length guard, not a truthiness check: a half-written or cleared value
      // would otherwise be handed out as this visitor's identity forever.
      if (typeof existing === 'string' && existing.length >= 8) return existing;
      const fresh = mintSalt();
      store.setItem(KEY, fresh);
      return fresh;
    } catch { /* quota or disabled — fall through to the memory salt */ }
  }

  if (!memorySalt) memorySalt = mintSalt();
  return memorySalt;
}

/**
 * An account id as a short, fixed-width, lower-hex suffix.
 *
 * ⛔ THE HASH IS THE ESTATE'S OWN, NOT A NEW ONE. `kernel/proseHash.js#fnv1a32` is
 * the declared short-hash idiom here — its own header records that it "matches the
 * `newsVoice.js` / `eventProse.js` idiom (same constants)", and the same FNV-1a
 * family already stamps every settlement id (`domain/normalizeSettlement.js`
 * `idFromSeed`). It is also SYNCHRONOUS, which this call path needs: both fork
 * doors resolve the identity inline before calling the generator, and
 * `crypto.subtle.digest` (sha-256) returns a Promise, so reaching for it would
 * have turned one pure lookup into an await on two surfaces for no gain a
 * non-secret de-duplication token can use.
 *
 * ⚠ IT IS NOT A SECRET AND DOES NOT NEED TO RESIST ANYONE. Its only job is to
 * differ between two accounts; it is never a credential, never transmitted, and
 * the seed it lands in is stripped from every published dossier by the gallery's
 * "never the generation seed" contract.
 *
 * ⛔⛔ TWO ROUNDS, AND THE SECOND DOMAIN IS PREPENDED — NOT APPENDED, AND NOT A
 * WIDER `padStart`. Both wrong turns were taken and measured before this shape
 * was written, and both LOOK right in a diff:
 *
 *   · `fnv1a32(id).toString(16).padStart(12, '0')` yields `00000905f093` — twelve
 *     characters carrying THIRTY-TWO bits, because fnv1a32 maxes at `ffffffff`.
 *     The leading zeros are filler. Widening the field without widening the hash
 *     buys nothing and hides that it bought nothing.
 *   · `fnv1a32(id + separator)` is worthless for the same reason a length
 *     extension is: FNV-1a is iterative, so two ids that already collide are in
 *     the SAME internal state, and every byte appended after that point is
 *     applied to one state. MEASURED: `acct-d36f` and `acct-bb799` both hash to
 *     3192671852, and both still hash to 2748183937 with the suffix added.
 *     Over 400,000 UUIDs the appended variant collided exactly as often at
 *     twelve characters as at eight: 22 and 22.
 *
 * PREPENDING the domain changes the state the id is mixed INTO, so the two rounds
 * are independent. Same pair, same measurement: they diverge, and over 400,000
 * UUIDv4 ids the digest collided 27 times at eight characters (birthday
 * expectation ~18.6) and ZERO times at twelve. That is the whole reason the
 * suffix is twelve characters and not eight: at 32 bits a collision is even odds
 * somewhere around 77,000 accounts, which is a real number of real people.
 *
 * @param {string} userId @returns {string} exactly ACCOUNT_DIGEST_HEX hex characters
 */
function accountDigest(userId) {
  const hi = fnv1a32(userId).toString(16).padStart(8, '0');
  const lo = fnv1a32(DIGEST_DOMAIN + userId).toString(16).padStart(8, '0');
  return `${hi}${lo}`.slice(0, ACCOUNT_DIGEST_HEX);
}

/**
 * WHO IS FORKING, as the one string `forkSeedFor` suffixes a sample's seed with.
 *
 * ⭐ THIS IS THE WHOLE RULE, IN ONE PLACE, AND BOTH FORK DOORS CALL IT.
 * `generate/FoundingWorlds.jsx` and `SettlementsPanel.jsx` run the same fork
 * wiring, and the estate has already been bitten once by a rule that lived in
 * two doors instead of one: the sample-fork INTENT was passed on the create
 * landing and silently not in the Library, so the same click spent the day's
 * allowance on one surface and was exempt on the other (ODQ §934.24(b)). A
 * walker over both call sites pins that neither hands `forkSeedFor` a bare auth
 * id (tests/data/sampleSettlements.test.js).
 *
 * ⭐ AN ACCOUNT IS A SHORT DIGEST OF ITS WHOLE ID, AND THAT IS THE THIRD ANSWER
 * TO ONE QUESTION (chair ruling, FIX-P1b). The id used to be TRUNCATED to eight
 * characters, so two accounts agreeing on eight hex characters forked the same
 * world (REVIEW-P noticed 8). FIX-P1 used the id WHOLE, which cured the collision
 * but made the seed ~48 characters — and §7a row 1 calls a fork seed "the address
 * … typeable in the `SeedField`", which a copied UUID is not. A digest reads the
 * WHOLE id (so no two accounts are confused by a shared prefix) and emits a short
 * fixed-width suffix (so the address stays typeable).
 *
 * ⚠ AND IT KEEPS THE DETERMINISM THE PROMISE REQUIRES: `fnv1a32` is pure, draws
 * no rng and reads no clock, so one account forking one card lands on one town
 * forever. The per-click question is still the owner's (§7a row 1 / ODQ §934.66)
 * and this function is the one seam a living door would enter through.
 *
 * @param {string | null | undefined} userId the signed-in account id, if any
 * @returns {string}
 */
export function forkIdentity(userId) {
  if (typeof userId === 'string' && userId !== '') return accountDigest(userId);
  return anonForkSalt();
}

/** The storage key, exported so tests seed and assert it without a second spelling. */
export const ANON_FORK_SALT_KEY = KEY;

/** Test helper: drop the in-memory fallback between cases. */
export function __resetAnonForkSaltMemory() { memorySalt = null; }
