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
 * THE PEOPLE CAR (PEOPLE-2 CAST-DERIVED, 2026-11-07). The cast now records who holds the seat:
 * the governing power's RANK-1 FACE (people/castPowers.js floor 1 — the seat house's face, or
 * the seat minted from the governing power). That card seats FIRST, title or none (a headman,
 * a steward, the eldest carry no head word); the title read above follows it, for a record with
 * no memberships (a pre-car save, a DM-authored person) and as the line behind an ousting.
 *
 * Pure and deterministic; reads name, role, the memberships and the faction handle only. A play-time
 * ousting is the ruling chain's to skip (powerStrata.js :: liveSeatCandidatesOf), where
 * the chain has always read it.
 */

import { governingFactionOf, nameOf } from '../rulingPower.js';
import { npcInFaction, ladderFactionKey } from '../worldPulse/npcLadderFactionMembership.js';
import { rankIn } from '../people/membership.js';

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
 * Every named seat-holder of the governing power, best first: its rank-1 face (the people car),
 * then every named member who carries a seat title.
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
  const govName = text(nameOf(governing));
  /** @type {SeatNpc | null} */
  let first = null;
  /** @type {Array<{ npc: SeatNpc, own: number, rank: number, exact: number, at: number }>} */
  const found = [];
  roster.forEach((row, at) => {
    if (!row || typeof row !== 'object') return;
    const npc = /** @type {SeatNpc} */ (row);
    if (!first && govName && rankIn(npc, govName) === 1 && !isOfficeStandIn(npc)) { first = npc; return; }
    const rank = seatTitleRankOf(npc);
    if (rank < 0 || isOfficeStandIn(npc)) return;
    if (!npcInFaction(/** @type {Record<string, unknown>} */ (row), governing, fkey, factions)) return;
    const exact = text(npc.role).toLowerCase() === SEAT_TITLES[rank].toLowerCase() ? 0 : 1;
    found.push({ npc, own: rank === tierRank ? 0 : 1, rank, exact, at });
  });
  found.sort((a, b) => (a.own - b.own) || (a.rank - b.rank) || (a.exact - b.exact) || (a.at - b.at));
  const titled = found.map((f) => f.npc);
  return first ? [first, ...titled] : titled;
}

