/**
 * domain/coherence/seatHolderFindings.js — the seat's self-check (lane RULERS,
 * 2026-11-03; root-cause trace failure 5, fix 9: "exactly one named seat-holder,
 * in the governing faction, not a stand-in" — a check that would have failed 64
 * of 64 thorps the audit replayed).
 *
 * Standalone and pure: it reads the settlement and the dossier's own seat read
 * (powerStrata.js :: rulingChainOf, which resolves through seatHolder.js) and
 * returns one finding per fault. Wired into no gate and no generation step; a
 * caller decides what a finding costs.
 *
 *   seat_unfilled                  a governing faction, no claimant vacancy, and
 *                                  nobody seated.
 *   seat_outside_governing_faction the seated person is filed under another faction. UNDER THE SEAT LAW (U7, the
 *                                  chair's E70 item 3, read with E77), where the chain's faction is a holder
 *                                  apart from the form (`rulingChainOf`), the person may be of the HOLDER or
 *                                  of the form: the chain names the record's hat-wearer, who holds the form's
 *                                  first place (at a birth held by kind, the form's own; after a transfer, the
 *                                  holder's first, `rulingPower.js :: transferRulingPower`).
 *   seat_stand_in                  the seated person, or a seat-titled member of the
 *                                  governing faction, is an unnamed office stand-in.
 *   seat_contested                 a second named member of the governing faction
 *                                  holds the seat-holder's own title, or (the people
 *                                  car, PEOPLE-2 CAST-DERIVED, 2026-11-07) a second
 *                                  card holds rank 1 in the governing power beside the
 *                                  seated rank-1 face.
 */

import { governingFactionOf, nameOf } from '../rulingPower.js';
import { rulingChainOf, liveSeatCandidatesOf } from '../dossier/powerStrata.js';
import { seatTitleRankOf, isOfficeStandIn } from '../dossier/seatHolder.js';
import { npcInFaction, ladderFactionKey } from '../worldPulse/npcLadderFactionMembership.js';
import { rankIn } from '../people/membership.js';
import { seatsByHolder } from '../seat/seatLaw.js';

/** @typedef {import('../dossier/seatHolder.js').SeatSettlement} SeatSettlement */
/** @typedef {import('../dossier/seatHolder.js').SeatNpc} SeatNpc */

/**
 * @typedef {Object} SeatFinding
 * @property {'seat_unfilled'|'seat_outside_governing_faction'|'seat_stand_in'|'seat_contested'} code
 * @property {string} detail
 */

/**
 * @param {SeatSettlement | null | undefined} settlement
 * @returns {SeatFinding[]}
 */
export function seatHolderFindings(settlement) {
  /** @type {SeatFinding[]} */
  const findings = [];
  const governing = governingFactionOf(settlement);
  if (!governing) return findings;
  const govName = nameOf(governing);
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const fkey = ladderFactionKey(governing);
  const roster = /** @type {unknown[]} */ (Array.isArray(settlement?.npcs) ? settlement.npcs : []);
  /** @type {Array<{ npc: SeatNpc, row: Record<string, unknown> }>} */
  const rows = [];
  for (const row of roster) {
    if (row && typeof row === 'object') rows.push({ npc: /** @type {SeatNpc} */ (row), row: /** @type {Record<string, unknown>} */ (row) });
  }
  const inGov = (/** @type {Record<string, unknown>} */ row) => npcInFaction(row, governing, fkey, factions);

  // A stand-in filed in the seat's office inside the governing faction.
  for (const { npc, row } of rows) {
    if (seatTitleRankOf(npc) >= 0 && isOfficeStandIn(npc) && inGov(row)) {
      findings.push({ code: 'seat_stand_in', detail: `${String(npc.name || '')} stands in the seat office of ${govName}` });
    }
  }

  const chain = rulingChainOf(settlement);
  if (chain.absence?.kind === 'missing_seat') return findings;
  if (!chain.npc) {
    findings.push({ code: 'seat_unfilled', detail: `nobody holds the seat of ${govName}` });
    return findings;
  }
  const seatName = chain.npc.name;
  const seated = rows.find(({ npc }) => npc.name === seatName);
  // U7: under the seat law the seat's house is the chain's faction where it is a holder apart from the form
  const holder = seatsByHolder(settlement) && chain.faction && chain.faction.name !== govName
    ? factions.find((f) => !!f && f !== governing && nameOf(f) === chain.faction?.name) || null : null;
  const inHouse = holder
    ? (/** @type {Record<string, unknown>} */ row) => inGov(row) || npcInFaction(row, holder, ladderFactionKey(holder), factions)
    : inGov;
  if (seated && !inHouse(seated.row)) {
    findings.push({ code: 'seat_outside_governing_faction', detail: `${seatName} is not of ${holder ? nameOf(holder) : govName}` });
  }
  if (seated && isOfficeStandIn(seated.npc) && !findings.some((f) => f.code === 'seat_stand_in')) {
    findings.push({ code: 'seat_stand_in', detail: `${seatName} is an office stand-in` });
  }
  const rank = seated ? seatTitleRankOf(seated.npc) : -1;
  /** @type {SeatNpc[]} */
  const contested = [];
  if (rank >= 0) {
    contested.push(...liveSeatCandidatesOf(settlement).filter((n) => n !== seated?.npc && seatTitleRankOf(n) === rank));
  }
  if (seated && rankIn(seated.npc, govName) === 1) {
    for (const { npc } of rows) {
      if (npc !== seated.npc && !contested.includes(npc) && rankIn(npc, govName) === 1 && !(/** @type {Record<string, unknown>} */ (npc)).ousted) contested.push(npc);
    }
  }
  for (const peer of contested) {
    findings.push({ code: 'seat_contested', detail: `${String(peer.name || '')} holds the same office as ${seatName}` });
  }
  return findings;
}
