/**
 * domain/regenerationPreservation.js — carrying user canon through a reroll.
 *
 * A section reroll replaces a whole roster with a freshly generated one. The
 * characters the user wrote must survive that, but the reroll must stay a real
 * reroll: same cast size, same internally-consistent reference graph, and — for
 * a settlement carrying no user canon at all — byte-identical output.
 *
 * This module decides WHICH entities survive and WHERE they land. It is pure:
 * no RNG, no clock, no generator or store imports. Every draw the generators
 * make has already happened by the time a caller reaches here, so preservation
 * cannot perturb a seeded run — it only rewrites the result.
 *
 * ── Why substitution rather than insertion ──────────────────────────────────
 *
 * NPC ids are positional. generateNPCs stamps `npc_${idx + 1}` over the
 * finished roster, so a reroll re-issues npc_1..npc_N to entirely different
 * characters, and every edge in the settlement — relationships' npc1Id/npc2Id,
 * factions' member object references — is keyed on those ids. Inserting a
 * preserved NPC alongside the fresh roster therefore drags a stale id into a
 * namespace that has already reissued it: two people answer to npc_3, and each
 * id-keyed consumer silently binds to whichever one it finds first.
 *
 * So a preserved character does not join the roster, it TAKES OVER a fresh
 * character's slot and inherits that slot's id. The roster keeps exactly the ids
 * the generators just minted and every reference stays resolvable. The cast
 * holds its size whenever the fresh roll has room for every keeper; roster size
 * is itself a seeded draw, so a later roll can come back smaller, and the
 * surplus is appended and reported on `overflow` for the caller to seat.
 *
 * Slot choice is deliberate, and the roster's ORDER is what makes it delicate:
 * enrichment leaves the roster sorted by relevance, so index 0 is the
 * settlement's leader. A keeper displaces the fresh character it most resembles
 * — its namesake first (that is the same person regenerated, and leaving it
 * would duplicate a name), then a shared role, then a shared category. Only the
 * namesake test scans from the front; every weaker match takes the LEAST
 * relevant qualifying slot, because scanning front-to-back quietly deleted the
 * settlement's mayor whenever an edited bystander happened to share its
 * category, leaving a town with no government at all.
 *
 * Every substitution is reported on `displacements`, because a name is not only
 * held in the fields that carry it structurally — generated prose bakes it into
 * relationship descriptions and NPC secrets, and those read as a different
 * person until the caller rewrites them.
 *
 * ── DELIBERATELY DEFERRED — documented, not bugs to re-find ─────────────────
 *
 * 1. A keeper's DERIVED standing is frozen at the roll it was preserved from.
 *    Merging after enrichment protects the authored goal.short, but it also
 *    exempts the keeper from structuralRank / structuralPosition /
 *    activeConstraint / settlementCondition, all of which are functions of
 *    current settlement state. If that state moved between rolls, one card
 *    narrates a stable town beside nine narrating a famine. The clean cure is
 *    to re-run ONLY enrichNPCsWithStructure (it is RNG-free) over the merged
 *    roster and restore the keeper's recorded edits — never the whole
 *    enrichNpcCoherence, whose first stage draws RNG and rewrites `secret`.
 *    Note the honest baseline: before preservation existed the keeper was
 *    destroyed outright, so this is a gap in a new feature, not a regression.
 *
 * 2. A keeper's OWN prose can still name peers from the previous cast who did
 *    not survive. Curing it means rewriting text the user may have authored,
 *    which is a different kind of decision from repairing generated prose —
 *    owner's call, not the merge's.
 */

import { deepClone } from './clone.js';
// The POLICY leaf, deliberately not regenerationMode.js: importing the rules
// through the plan builder pulls entityCatalog's dependency fan into the lazy
// engine chunk, which the bundler then re-parents into the first-paint closure.
import { preservesEntity } from './regenerationPolicy.js';
// The LOCKS leaf, for the same reason: a frozen read over a sparse map, reachable
// without dragging anything behind it.
import { lockedNpcIdSet } from './locksPreservation.js';

/**
 * @typedef {import('./canonStatus.js').CanonTaggable & {
 *   id?: string,
 *   name?: string,
 *   role?: string,
 *   category?: string,
 * }} RosterMember
 */

/**
 * @typedef {Object} PreservationResult
 * @property {RosterMember[]} npcs        The merged roster.
 * @property {Array<{id: string, name: string, fromId: string}>} preserved  What
 *   survived, for the caller's trace. `id` is the slot id the keeper INHERITED;
 *   `fromId` is the id it arrived with. The pair is what lets a caller holding
 *   id-keyed state — the lock map is the one that exists — follow its subject
 *   through the substitution instead of pointing at whoever took the old slot.
 * @property {Array<{from: string, to: string}>} displacements  Who each keeper
 *   replaced. The caller needs these to rewrite prose that names the departed.
 * @property {Array<{id: string, name: string}>} overflow  Keepers appended
 *   because the fresh roll had no slot left. They arrive with no relationships
 *   and no faction, so a caller that can prevent this should.
 */

/** @param {string|undefined} value @returns {string} */
function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * The lowest `npc_N` id not already used by the roster.
 *
 * Only reached when the user has preserved more characters than the fresh roll
 * produced, which needs a settlement whose cast shrank between rolls.
 *
 * @param {RosterMember[]} roster
 * @returns {string}
 */
function mintUnusedId(roster) {
  const used = new Set(roster.map(npc => normalize(npc?.id)));
  let n = roster.length + 1;
  while (used.has(`npc_${n}`)) n += 1;
  return `npc_${n}`;
}

/**
 * The fresh-roster index a keeper should take over, or -1 when every slot is
 * already claimed.
 *
 * @param {RosterMember[]} fresh
 * @param {RosterMember} keeper
 * @param {Set<number>} claimed
 * @returns {number}
 */
function chooseSlot(fresh, keeper, claimed) {
  const free = fresh.map((_, i) => i).filter(i => !claimed.has(i));
  if (free.length === 0) return -1;

  /**
   * A matching free slot, or -1. An empty `value` never matches: a keeper with
   * no role should not collect every roleless stranger.
   *
   * `fromEnd` picks the LEAST relevant qualifying slot. The roster arrives
   * sorted by relevance, so scanning forward on a weak match aims the keeper
   * straight at the settlement's leader.
   *
   * @param {string} value
   * @param {(npc: RosterMember) => string} read
   * @param {boolean} fromEnd
   * @returns {number}
   */
  const match = (value, read, fromEnd) => {
    if (!value) return -1;
    const order = fromEnd ? [...free].reverse() : free;
    return order.find(i => read(fresh[i]) === value) ?? -1;
  };

  // A namesake is the same character regenerated: displacing it both keeps the
  // authored copy and removes what would otherwise be a duplicate name. This is
  // an exact identity match, so it scans forward.
  const namesake = match(normalize(keeper.name), npc => normalize(npc?.name), false);
  if (namesake !== -1) return namesake;

  const sameRole = match(normalize(keeper.role), npc => normalize(npc?.role), true);
  if (sameRole !== -1) return sameRole;

  const sameCategory = match(normalize(keeper.category), npc => normalize(npc?.category), true);
  if (sameCategory !== -1) return sameCategory;

  return free[free.length - 1];
}

/**
 * The entities of `previousNpcs` this mode carries forward, in roster order.
 *
 * Two independent grounds for survival, unioned: the MODE's policy (canon /
 * locked-on-the-entity), and the settlement's own lock map naming this id. The
 * union is why an unlocked settlement is unaffected — an empty id set adds
 * nobody, so the filter returns exactly what it returned before locks existed.
 *
 * `lockedIdsOnly` narrows that union to its second half, and exists for exactly
 * one caller: the FULL-generate lock carry (locks engine Phase B, in
 * generators/generateSettlementPipeline.js). A full generate mints a new town,
 * and its baseline is that NOTHING survives — carrying the user's canon across
 * it is a separate, unordered capability, and the mode policies would smuggle it
 * in through the entity's own `locked` flag. Under this option the lock map is
 * the whole ground of survival, so the carry performs precisely what the user
 * asked for and nothing else. Default false ⇒ every existing caller is untouched.
 *
 * @param {RosterMember[]|null|undefined} previousNpcs
 * @param {string|undefined} mode
 * @param {Set<string>} lockedIds  ids the settlement's lock map names; may be empty
 * @param {boolean} [lockedIdsOnly]  ignore the mode policy; survive on the map alone
 * @returns {RosterMember[]}
 */
function keepersOf(previousNpcs, mode, lockedIds, lockedIdsOnly = false) {
  if (!Array.isArray(previousNpcs)) return [];
  if (lockedIdsOnly) {
    return previousNpcs.filter(npc => npc && lockedIds.has(String(npc.id ?? '')));
  }
  return previousNpcs.filter(npc => npc
    && (preservesEntity(mode, 'npc', npc) || lockedIds.has(String(npc.id ?? ''))));
}

/**
 * How many characters a reroll in this mode must find room for.
 *
 * Exported so a caller can size the fresh roll BEFORE generating it. Roster
 * count is a seeded draw and can come back smaller than the pinned cast, and a
 * keeper with no slot is appended with no relationships and no faction — it
 * survives in name only. Sharing this predicate with the merge is the whole
 * point: a floor computed from a second, drifting rule would strand exactly the
 * characters it was added to protect.
 *
 * @param {RosterMember[]|null|undefined} previousNpcs
 * @param {{ mode?: string, locks?: Record<string, unknown>|null, lockedIdsOnly?: boolean }} [options]
 * @returns {number}
 */
export function countPreservedNpcs(previousNpcs, options = {}) {
  return keepersOf(
    previousNpcs, options.mode, lockedNpcIdSet(options.locks), options.lockedIdsOnly === true,
  ).length;
}

/**
 * Merge the user canon from a previous roster into a freshly generated one.
 *
 * Returns the fresh array UNTOUCHED (same reference) when the previous roster
 * held no preserved entity — the dormancy contract the caller relies on to
 * keep an unedited settlement's reroll byte-identical.
 *
 * The returned keepers are deep clones, so a caller may hand in a frozen store
 * roster and still receive a mutable result.
 *
 * @param {RosterMember[]|null|undefined} previousNpcs  Roster being replaced.
 * @param {RosterMember[]|null|undefined} freshNpcs     Roster the generators just produced.
 * @param {{ mode?: string, locks?: Record<string, unknown>|null, lockedIdsOnly?: boolean }} [options]
 *   Regeneration mode (defaults to 'rebalance') and the settlement's lock map.
 *   `lockedIdsOnly` drops the mode policy so the map is the only ground for
 *   survival — see keepersOf; it is the full-generate carry's policy.
 * @returns {PreservationResult}
 */
export function mergePreservedNpcs(previousNpcs, freshNpcs, options = {}) {
  const fresh = Array.isArray(freshNpcs) ? freshNpcs : [];
  const keepers = keepersOf(
    previousNpcs, options.mode, lockedNpcIdSet(options.locks), options.lockedIdsOnly === true,
  );
  if (keepers.length === 0) {
    return { npcs: fresh, preserved: [], displacements: [], overflow: [] };
  }

  const merged = fresh.slice();
  /** @type {Set<number>} */
  const claimed = new Set();
  /** @type {Array<{id: string, name: string, fromId: string}>} */
  const preserved = [];
  /** @type {Array<{from: string, to: string}>} */
  const displacements = [];
  /** @type {Array<{id: string, name: string}>} */
  const overflow = [];

  for (const keeper of keepers) {
    const clone = /** @type {RosterMember} */ (deepClone(keeper));
    const slot = chooseSlot(fresh, keeper, claimed);
    // fromId is the id the keeper ARRIVED with, recorded before the substitution
    // overwrites it. Additive: existing consumers read .id / .length and are
    // untouched; the lock map is the consumer that needs the pair.
    const entry = { id: '', name: String(clone.name || ''), fromId: String(keeper.id ?? '') };

    if (slot === -1) {
      clone.id = mintUnusedId(merged);
      merged.push(clone);
      entry.id = String(clone.id);
      overflow.push({ ...entry });
    } else {
      claimed.add(slot);
      clone.id = fresh[slot]?.id || mintUnusedId(merged);
      merged[slot] = clone;
      entry.id = String(clone.id);
      const departed = String(fresh[slot]?.name || '');
      // A namesake substitution replaces someone with themselves; there is no
      // departed character to write out of the prose.
      if (departed && normalize(departed) !== normalize(clone.name)) {
        displacements.push({ from: departed, to: entry.name });
      }
    }
    preserved.push(entry);
  }

  return { npcs: merged, preserved, displacements, overflow };
}
