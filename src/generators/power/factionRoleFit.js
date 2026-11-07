/**
 * generators/power/factionRoleFit.js — FACTION-ROLE-FIT at the assembly seam (CENSUS-4 R12).
 *
 * Every affiliation writer has run by the time the one faction set is grouped (the population
 * step's capacity-weighted roll, the density dispersal at the coherence seam, the structural
 * seats). A member whose role does not fit its faction's kind (`domain/roles/roleClass.js ::
 * factionRoleFits`) is re-homed, by hash and never by a roll, to the fitting power faction with
 * the greatest `fnv1a32(faction::npc id)`. THE DENSITY LAW binds it (R18/R20: a faction exists
 * exactly as long as its roster does; every house is crewed): a misfit that is its faction's LAST
 * member, or that no other faction fits, stays where it is, and the reader counts it.
 * A roster with no misfit comes back as the very same array, so its birth is byte-identical; the
 * crisis cast, which runs after assembly, reads the fitted roster.
 *
 * Pure: no randomness, no clock; it returns a new array and mutates nothing.
 */
import { factionRoleFits, seatFactions } from '../../domain/roles/roleClass.js';
import { fnv1a32 } from '../../kernel/proseHash.js';

/**
 * The factions that hold or contest the seat also seat office-holders and nobles (the chair's
 * ruling Q1: the seat is one office), so the seat holder is never re-homed off the seat.
 * @param {ReadonlyArray<any>} npcs the roster
 * @param {{ powerStructure?: any } | null | undefined} settlement the place (its power factions and seat)
 * @returns {any[]} the same array when nothing misfits
 */
export function fitFactionRoster(npcs, settlement) {
  const powerFactions = settlement?.powerStructure?.factions;
  if (!Array.isArray(npcs) || !Array.isArray(powerFactions) || powerFactions.length === 0) return /** @type {any[]} */ (npcs);
  const seat = seatFactions(settlement);
  const categoryOf = new Map(powerFactions.map((f) => [String(f?.faction ?? ''), f?.category]));
  /** @type {Map<string, number>} members per faction, kept current as misfits move */
  const crew = new Map();
  for (const npc of npcs) if (typeof npc?.factionAffiliation === 'string') crew.set(npc.factionAffiliation, (crew.get(npc.factionAffiliation) || 0) + 1);
  let changed = false;
  const out = npcs.map((npc) => {
    const affil = npc?.factionAffiliation;
    if (typeof affil !== 'string' || !categoryOf.has(affil) || factionRoleFits(categoryOf.get(affil), npc?.role, { seat: seat.has(affil) })) return npc;
    // THE DENSITY LAW (R18/R20): a faction exists exactly as long as its roster does, and every
    // house is crewed — so a misfit is never its faction's last member, and never left unaffiliated.
    if ((crew.get(affil) || 0) <= 1) return npc;
    let best = null; let bestScore = -1;
    for (const f of powerFactions) {
      const name = String(f?.faction ?? '');
      if (!name || name === affil || !factionRoleFits(f?.category, npc?.role, { seat: seat.has(name) })) continue;
      const score = fnv1a32(`${name}::${String(npc?.id ?? npc?.name ?? '')}`);
      if (score > bestScore) { best = name; bestScore = score; }
    }
    if (best === null) return npc;
    crew.set(affil, (crew.get(affil) || 0) - 1); crew.set(best, (crew.get(best) || 0) + 1);
    changed = true;
    return { ...npc, factionAffiliation: best };
  });
  return changed ? out : /** @type {any[]} */ (npcs);
}
