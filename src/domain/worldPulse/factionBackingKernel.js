/**
 * factionBackingKernel.js — THE BACKING MARK (ADDENDUM 18 ruling 16; car 8b-W-18e).
 *
 * *"a faction whose backing is absent is not minted (or is retired when its last
 * backing row is ruined)."* Generation refuses the mint (`generators/power/
 * rulingStructure.js`); this leaf answers the second clause IN PLAY, as a MARK:
 *
 *   - a standing power whose last backing institution row was ruined, abandoned or
 *     economically closed this tick (or any earlier tick — a loaded save is read as it
 *     is) is stamped `unbacked: true`;
 *   - a marked power whose backing row stands again (built by institutionLifecycle,
 *     forced by a game master, restored by a tier promotion) has the mark REMOVED —
 *     the symmetric half, so the rule is not a ratchet.
 *
 * ── WHY A MARK AND NOT A RETIREMENT ──────────────────────────────────────────────────
 * Deleting a persisted faction is an owner-gated class (data deletion; judgment-ledger
 * §3), and the estate's one faction-retirement road (`factionDensityKernel`, R18) is
 * a REACTION to a named roster reaching zero under the v2 density law, dormant for
 * every world the product makes today. So this car marks and reports; the retirement
 * of an unbacked power is chartered to the owner's pen, and the v2 thin step is the
 * seam where it would go (an `unbacked` seat should rank first among the foldable).
 *
 * ── WHAT IS NEVER MARKED ─────────────────────────────────────────────────────────────
 * The governing seat (R14), a crisis faction (`crisis: true` or a name in
 * CRISIS_FACTIONS — an event, not a standing power), a DM-authored house
 * (`createdByEventId` — the author's word), and any faction of no gated archetype.
 * `gatedArchetypeOf` in domain/factionBacking.js is the one place that says so.
 *
 * ── DORMANCY BY CONSTRUCTION ─────────────────────────────────────────────────────────
 * No draw, no clock, no news beat (a chronicle line for "the temple burned and the
 * clergy no longer speak among the powers" belongs to the prose programme, not to this
 * car). The mover walks settlements in codepoint order and returns its inputs BY
 * REFERENCE when no mark changes, so a world where nothing was ruined or built is
 * byte-identical after this leaf. Like the density lane it writes only onto an
 * existing `settlementUpdates` entry (the one-writer law) and reads the FRESH copy so
 * a row ruined earlier in this tick is seen.
 *
 * @enforced-by tests/domain/factionBacking.test.js
 */
import { asObject, compareCodepoint } from './npcLadderState.js';
import { gatedArchetypesOf, backedArchetypesOf } from '../factionBacking.js';

/** The mark a standing power carries while no institution row represents it. */
export const UNBACKED_MARK = 'unbacked';

/**
 * Re-derive the marks for ONE settlement. Returns the same object when nothing
 * changes; otherwise a shallow copy with a new `powerStructure.factions` array in
 * which only the moved factions are new objects.
 *
 * @param {Record<string, unknown>} settlement
 * @returns {{settlement: Record<string, unknown>, marked: string[], cleared: string[]}}
 */
export function markUnbackedFactions(settlement) {
  const ps = asObject(settlement.powerStructure);
  const seats = Array.isArray(ps.factions) ? /** @type {Record<string, unknown>[]} */ (ps.factions) : null;
  if (!seats || !seats.length) return { settlement, marked: [], cleared: [] };

  const backed = backedArchetypesOf(/** @type {Parameters<typeof backedArchetypesOf>[0]} */ (settlement));
  /** @type {string[]} */
  const marked = [];
  /** @type {string[]} */
  const cleared = [];
  let moved = false;
  const next = seats.map((raw) => {
    const f = asObject(raw);
    const archetypes = gatedArchetypesOf(f);
    const has = f[UNBACKED_MARK] === true;
    if (!archetypes) {
      // Exempt: never marked. A stale mark on an exempt row (a faction that became
      // governing, say) is cleared rather than left to lie.
      if (!has) return raw;
      const { [UNBACKED_MARK]: _drop, ...rest } = f;
      moved = true;
      cleared.push(String(f.faction || f.name || ''));
      return rest;
    }
    const want = !archetypes.some((a) => Array.isArray(backed[a]) && backed[a].length > 0);
    if (want === has) return raw;
    moved = true;
    if (want) {
      marked.push(String(f.faction || f.name || ''));
      return { ...f, [UNBACKED_MARK]: true };
    }
    const { [UNBACKED_MARK]: _drop, ...rest } = f;
    cleared.push(String(f.faction || f.name || ''));
    return rest;
  });
  if (!moved) return { settlement, marked, cleared };
  return {
    settlement: { ...settlement, powerStructure: { ...ps, factions: next } },
    marked,
    cleared,
  };
}

/**
 * THE MOVER. Walks the tick's settlements (codepoint order), re-derives every mark
 * from the FRESH settlement copy, and writes only where a mark moved.
 *
 * @param {{ snapshot?: unknown, settlementUpdates?: unknown }} args
 * @returns {{ changed: boolean, settlementUpdates: Record<string, unknown>[] }}
 */
export function advanceFactionBacking(args) {
  const updates = Array.isArray(args.settlementUpdates)
    ? /** @type {Record<string, unknown>[]} */ (args.settlementUpdates)
    : [];
  const snap = asObject(args.snapshot);
  const items = Array.isArray(snap.settlements)
    ? /** @type {Record<string, unknown>[]} */ (snap.settlements)
    : [];
  if (!items.length || !updates.length) return { changed: false, settlementUpdates: updates };

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(asObject(u).saveId), i));
  const orderedIds = items.map(it => String(asObject(it).id)).sort(compareCodepoint);

  let nextUpdates = updates;
  let cloned = false;
  for (const sid of orderedIds) {
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    const entry = asObject(nextUpdates[ui]);
    const fresh = entry.settlement ? asObject(entry.settlement) : null;
    if (!fresh) continue;
    const result = markUnbackedFactions(fresh);
    if (result.settlement === fresh) continue;
    if (!cloned) { nextUpdates = updates.slice(); cloned = true; }
    nextUpdates[ui] = { ...entry, settlement: result.settlement };
  }
  return { changed: nextUpdates !== updates, settlementUpdates: nextUpdates };
}
