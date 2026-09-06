/**
 * densityAscension.js — §810.6 R21: SEAT ASCENSION MATERIALIZES THE HOUSE.
 *
 * The owner's words: *"if a power gains the ruler seat in simulation, then that
 * should create both a faction, appropriate number of NPCs for the tier, and NPC
 * generation for that power"* — clarified in §810.6(b) with *"if that power
 * didn't have a faction"*.
 *
 * This is the density law's THIRD CALLER. `applyDensityLaw.js`'s header names
 * them: **birth · growth · ascension — one law, never three.** Birth is built
 * (three seams there); this file is ascension. It shares the same bands, the
 * same `rollRoster`, and the same keyed-fork discipline, so a house materialized
 * in play is drawn by the same law that would have drawn it at birth.
 *
 * ── PLAN, NOT APPLY (the boundary, and why it sits here) ──────────────────────
 *
 * This module DECIDES and returns an inert plan; the caller mints. The roll
 * decides, the writer writes — the same split `applyDensityLaw.js` keeps, and
 * the reason is testability: the law is provable over thousands of seeds without
 * standing up the NPC name generator, custom content, or an event chain.
 *
 * The plan is nonetheless ATOMIC in the sense R21 requires: it describes the
 * faction AND its full roster together, and a caller must apply both or neither.
 * A materialized house with no members would be exactly the R17 violation the
 * atomic mint exists to forbid.
 *
 * ── ⛔ THE REPLAY HAZARD, INHERITED FROM THE EVENT LAYER ──────────────────────
 *
 * `mutateEntities.js`'s v2 `ADD_FACTION` co-mint carries a warning this file
 * must respect: event chains are REPLAYED (undo, rerun, rerun-keys), so an
 * unconditional mint "would add a person to every already-authored event in
 * every existing campaign the next time it replayed — lived history rewritten,
 * which THE PROMISE forbids." Two consequences here:
 *
 *   1. The version gate is not timidity. A v1 world plans NOTHING and draws
 *      NOTHING, so replaying its history cannot materialize a house that was
 *      never there.
 *   2. The draw is taken from a KEYED FORK of the caller's stream
 *      (`density-law` → `seat-ascension`), never the ambient one. This lane
 *      measured what an ambient draw costs: a stressor row that can never fire
 *      still moved 104 of 240 same-seed worlds, purely by drawing. A fork is
 *      how a new law joins an existing world without moving it.
 */

import { bandsForTier, tierKey } from '../../domain/density/densityBands.js';
import { rollsRegisterVii } from '../../domain/density/densityLaw.js';
import { rollInBand, rollRoster } from './densityRoll.js';
import { seatKey } from '../../domain/density/seatKey.js';
import { slugify } from '../../kernel/slugify.js';

/** Every reason ascension may decline to materialize. A typed refusal is a
 *  finding the caller can act on; a silent `null` is a bug that looks like a
 *  policy. CLOSED — the pins assert this set exactly. */
export const ASCENSION_REFUSALS = Object.freeze([
  'dormant_law',            // v1: the law is not in force for this world
  'no_ascending_power',     // the caller named nobody
  'power_already_housed',   // §810.6(b): it has a house; crown it, don't mint one
]);

/** ⚠ THE ONE SLUG PRIMITIVE, NOT A NINTH HAND-ROLLED VARIANT. This file shipped an
 *  inline builder, which the estate's slug-idiom ratchet counts as a new offender —
 *  and the ratchet is right for an IDENTITY-BEARING slug: `faction.<slug>` is a join
 *  key, and copy-discipline is the only thing that was keeping this spelling equal to
 *  `mutateHelpers.slugify`'s. `{ sep: '_' }` is that spelling. The swap was PROVEN
 *  byte-identical over 20,015 executed inputs (the trim is a no-op: leading and
 *  trailing whitespace becomes a separator run and is then edge-trimmed anyway).
 *  @param {unknown} s @returns {string} */
const slug = s => slugify(s, { sep: '_' });

/** The inert "nothing happens" plan. Shared so every refusal path returns the
 *  SAME shape and a caller can read `.materialized` without a null check. */
function declined(reason) {
  return Object.freeze({ materialized: false, reason, faction: null, roster: [], occupancy: null });
}

/**
 * Plan the materialization of a house for a power that has just taken the
 * ruling seat and holds no faction of its own.
 *
 * Returns a DECLINED plan — never throws — for every reason in
 * `ASCENSION_REFUSALS`, including the dormant default, where it also takes no
 * draw at all.
 *
 * @param {{
 *   tier?: string,
 *   config?: Record<string, unknown>,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 *   ascendingPower?: string|null,
 *   cause?: string|null,
 *   rng: {random: () => number, fork: (l: string) => any},
 * }} input
 * ⚠ THE RETURN TYPE IS DECLARED `readonly` BECAUSE IT IS. The plan is frozen at
 * every level (that inertness is the point — see the header), and `Object.freeze`
 * produces `Readonly`/`ReadonlyArray`. Declaring a mutable `Array` here would be
 * a declaration that lies about its own value, which `typecheck:ratchet` catches
 * and which would invite a caller to push into a frozen roster at runtime.
 *
 * @returns {{materialized: boolean, reason: string|null,
 *            faction: Readonly<Record<string, unknown>>|null,
 *            roster: ReadonlyArray<Readonly<Record<string, unknown>>>,
 *            occupancy: Readonly<Record<string, boolean>>|null}}
 */
export function planSeatAscension(input) {
  const config = input?.config || {};
  if (!rollsRegisterVii(config)) return declined('dormant_law');

  const name = String(input?.ascendingPower || '').trim();
  if (!name) return declined('no_ascending_power');

  // §810.6(b), in the owner's own clarification: materialization fires ONLY for
  // a seat-gaining power holding NO faction. "A power with a standing house
  // simply sees it crowned and thickened on the slow cadence" — that is R7's
  // job, not this one, and doing it here would double-thicken.
  const seats = Array.isArray(input?.powerStructure?.factions) ? input.powerStructure.factions : [];
  if (seats.some(seat => seatKey(seat) === name)) return declined('power_already_housed');

  const tier = tierKey(input?.tier);
  const bands = bandsForTier(tier);

  // The keyed fork. `density-law` is the law's own namespace on the caller's
  // stream; `seat-ascension` is this seam's room inside it. Nothing drawn here
  // can move birth's three seams, and nothing they draw can move this.
  const rng = input.rng.fork('density-law').fork('seat-ascension');

  // "Appropriate number of NPCs for the tier" (owner's words) = the tier's
  // SUITE band — the same per-house roster band birth disperses mass into, so
  // an ascended house is indistinguishable in size from a born one.
  const size = Math.max(1, rollInBand(rng, bands.suite));

  // ⛔ `requireHead: true` is REQUIRED, not a default. This house is taking the
  // ruling seat, and §810.3's seat floor says the ruling faction always holds
  // its head rung. A headless government materialized at the moment of
  // ascension would create the very vacancy the ascension is resolving.
  const rolled = rollRoster(rng, tier, size, 1, { requireHead: true, officeRoleKey: null });

  return Object.freeze({
    materialized: true,
    reason: null,
    // The shape mirrors the event layer's ADD_FACTION mint exactly, so a house
    // that arrives by ascension is byte-shaped like one that arrives by DM verb.
    faction: Object.freeze({
      id: `faction.${slug(name)}`,
      name,
      faction: name,
      status: 'active',
      isGoverning: true,
      impairments: [],
      internalSeats: {},
      description: '',
      // Provenance the chronicle can read without re-deriving it.
      materializedBy: 'seat_ascension',
      materializedCause: input?.cause ? String(input.cause) : null,
    }),
    roster: Object.freeze(rolled.members.map(m => Object.freeze({ ...m }))),
    occupancy: rolled.occupancy,
  });
}
