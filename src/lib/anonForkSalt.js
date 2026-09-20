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

const KEY = 'sf.anon.fork-salt';

// Fallback when localStorage is unavailable (private mode, sandboxed iframe,
// quota). Module-scoped so the salt is at least stable for the page's lifetime.
let memorySalt = null;

/** A short opaque token. Short because a fork seed is an address a reader can type. */
function mintSalt() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    }
  } catch { /* fall through to the arithmetic mint */ }
  // Not cryptographically strong, and it does not need to be: this only has to
  // differ between two browsers, never resist an attacker.
  return `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 12);
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
 * A signed-in account is its own identity and is used WHOLE — the id used to be
 * truncated to eight characters, which quietly made two accounts sharing eight
 * hex characters fork the same world (REVIEW-P noticed 8).
 *
 * @param {string | null | undefined} userId the signed-in account id, if any
 * @returns {string}
 */
export function forkIdentity(userId) {
  if (typeof userId === 'string' && userId !== '') return userId;
  return anonForkSalt();
}

/** The storage key, exported so tests seed and assert it without a second spelling. */
export const ANON_FORK_SALT_KEY = KEY;

/** Test helper: drop the in-memory fallback between cases. */
export function __resetAnonForkSaltMemory() { memorySalt = null; }
