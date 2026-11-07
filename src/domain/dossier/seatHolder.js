/**
 * domain/dossier/seatHolder.js — WHO HOLDS THE SEAT, read once (lane RULERS,
 * 2026-11-03; root-cause trace failure 5, fix shape B's interim seat fix).
 *
 * The generator creates a settlement's head of government FIRST — the Elder of a
 * thorp or hamlet, the Mayor of a village to city, the Governor of a metropolis
 * (npcGenerator.js :: generateNPCs, its TIER_MANDATORY_ROLES) — and files that
 * person into the governing faction. It does not yet record which person holds
 * the seat. Until it does (the scale program's roster car: a seat mark written at
 * generation), this leaf reads the seat back the generator's own way:
 *
 *   - the person is a MEMBER OF THE GOVERNING FACTION (never another faction's);
 *   - their ROLE carries one of the generator's head titles as a WHOLE WORD
 *     ("Chief Magistrate", "Crime Lord" and a farmer locally titled Elder are not
 *     heads; the culture title is a translation, the role is the office);
 *   - they are a named person, never an office stand-in ("The " + a role);
 *   - several heads: the TIER decides (chair ruling c, 2026-11-03): the head the
 *     generator mandates for this tier (TIER_HEAD) seats first; another head title
 *     seats only when the tier's own is absent from the governing faction, then in
 *     the title precedence (Governor over Mayor over Elder). Ties: a role that IS
 *     the title over one that merely contains it, then roster order. A settlement
 *     with no known tier falls straight to the title precedence.
 * Nobody qualifies: null, and the caller says the seat is empty, once.
 *
 * Pure and deterministic; reads name, role and the faction handle only. A play-time
 * ousting is the ruling chain's to skip (powerStrata.js :: liveSeatCandidatesOf), where
 * the chain has always read it.
 */

import { governingFactionOf } from '../rulingPower.js';
import { npcInFaction, ladderFactionKey } from '../worldPulse/npcLadderFactionMembership.js';

/** @typedef {import('../rulingPower.js').RulingPowerSettlement} RulingPowerSettlement */

/**
 * The settlement as the seat reads it: the ruling-power contract plus the roster.
 * @typedef {RulingPowerSettlement & { npcs?: unknown }} SeatSettlement
 */

/**
 * A roster row as the seat reads it.
 * @typedef {{ id?: unknown, name?: unknown, role?: unknown, title?: unknown, factionAffiliation?: unknown, memberships?: unknown }} SeatNpc
 */

/**
 * The generator's head-of-government titles, in its own precedence (highest first).
 * A READ-ONLY MIRROR of the first role of each tier in npcGenerator.js ::
 * generateNPCs's TIER_MANDATORY_ROLES (a local const there, so it cannot be
 * imported); tests/domain/dossier/seatHolder.test.js reads that source and fails
 * if a tier's head is ever missing from this list.
 */
export const SEAT_TITLES = Object.freeze(['Governor', 'Mayor', 'Elder']);

/**
 * The head each tier mandates: a READ-ONLY MIRROR of the first role of each tier's
 * list in npcGenerator.js :: generateNPCs TIER_MANDATORY_ROLES (the seat test reads
 * that source and fails on any drift).
 * @type {Readonly<Record<string, string>>}
 */
export const TIER_HEAD = Object.freeze({
  thorp: 'Elder',
  hamlet: 'Elder',
  village: 'Mayor',
  town: 'Mayor',
  city: 'Mayor',
  metropolis: 'Governor',
});

const TITLE_WORDS = SEAT_TITLES.map((t) => new RegExp(`\\b${t}\\b`, 'i'));

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * The seat title a role carries, as its precedence index (0 = Governor), or -1.
 * @param {SeatNpc | null | undefined} npc
 * @returns {number}
 */
export function seatTitleRankOf(npc) {
  const role = text(npc?.role);
  if (!role) return -1;
  return TITLE_WORDS.findIndex((re) => re.test(role));
}

/**
 * An unnamed office stand-in: a name that is "The " + its own role or title.
 * @param {SeatNpc | null | undefined} npc
 * @returns {boolean}
 */
export function isOfficeStandIn(npc) {
  const name = text(npc?.name).toLowerCase();
  if (!name) return true;
  return [text(npc?.role), text(npc?.title)].some((r) => r && name === `the ${r.toLowerCase()}`);
}

/**
 * Every named member of the governing faction who carries a seat title, best first.
 * @param {SeatSettlement | null | undefined} settlement
 * @returns {SeatNpc[]}
 */
export function seatCandidatesOf(settlement) {
  const governing = governingFactionOf(settlement);
  if (!governing) return [];
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const fkey = ladderFactionKey(governing);
  const roster = /** @type {unknown[]} */ (Array.isArray(settlement?.npcs) ? settlement.npcs : []);
  const tierHead = TIER_HEAD[text(settlement?.tier).toLowerCase()] || '';
  const tierRank = tierHead ? SEAT_TITLES.indexOf(tierHead) : -1;
  /** @type {Array<{ npc: SeatNpc, own: number, rank: number, exact: number, at: number }>} */
  const found = [];
  const governingName = text(/** @type {{ faction?: unknown, name?: unknown }} */ (governing)?.faction)
    || text(/** @type {{ name?: unknown }} */ (governing)?.name);
  roster.forEach((row, at) => {
    if (!row || typeof row !== 'object') return;
    const npc = /** @type {SeatNpc} */ (row);
    // 2026-11-07 PEOPLE-1 CAST, M-1b (the owner: a representative's ROLE is its institution's title and its
    // standing in each power is its RANK there): the seat is the card that ranks FIRST in the governing
    // power — read from `memberships` — whatever its title says; the seat-word read below stays for the
    // records born before the car and for a crafted roster. Re-pointed here, the one reader of the seat.
    const seatByRank = Array.isArray(npc.memberships) && npc.memberships.some((m) => m && typeof m === 'object'
      && text(/** @type {{ power?: unknown }} */ (m).power) === governingName && /** @type {{ rank?: unknown }} */ (m).rank === 1);
    const rank = seatByRank ? Math.max(tierRank, 0) : seatTitleRankOf(npc);
    if (rank < 0 || isOfficeStandIn(npc)) return;
    if (!npcInFaction(/** @type {Record<string, unknown>} */ (row), governing, fkey, factions)) return;
    const exact = text(npc.role).toLowerCase() === SEAT_TITLES[rank].toLowerCase() ? 0 : 1;
    found.push({ npc, own: rank === tierRank ? 0 : 1, rank, exact, at });
  });
  found.sort((a, b) => (a.own - b.own) || (a.rank - b.rank) || (a.exact - b.exact) || (a.at - b.at));
  return found.map((f) => f.npc);
}

