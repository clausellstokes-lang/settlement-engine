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
 *   seat_vacant_held_line          (VACANT, CLOSE-3 unit (1), the chair's E131) the seat stands empty (the chain's
 *                                  `missing_seat`), and a row's description carries a W3 line, or a relation row
 *                                  naming the form a W1 line, for that form and that row: the page says no one holds
 *                                  the seat and a power sits in it.
 *   seat_held_vacant_line          the seat is held (no `missing_seat`), and a W3v or W1v line prints.
 *
 * The holder's lines are judged FIRST, on every record under the seat law (`seatsByHolder`), by exact matching of
 * the filled lines (`generators/factionDynamics.js :: seatHolderLinesOf`, each non-form row as the holder, the form
 * the governing row); then the `missing_seat` return and every other check as before.
 */

import { governingFactionOf, nameOf } from '../rulingPower.js';
import { rulingChainOf, liveSeatCandidatesOf } from '../dossier/powerStrata.js';
import { seatTitleRankOf, isOfficeStandIn } from '../dossier/seatHolder.js';
import { npcInFaction, ladderFactionKey } from '../worldPulse/npcLadderFactionMembership.js';
import { rankIn } from '../people/membership.js';
import { seatsByHolder } from '../seat/seatLaw.js';
import { seatHolderLinesOf } from '../../generators/factionDynamics.js'; // VACANT: the holder's lines, filled as the writer fills them

/** @typedef {import('../dossier/seatHolder.js').SeatSettlement} SeatSettlement */
/** @typedef {import('../dossier/seatHolder.js').SeatNpc} SeatNpc */

/**
 * @typedef {Object} SeatFinding
 * @property {'seat_unfilled'|'seat_outside_governing_faction'|'seat_stand_in'|'seat_contested'|'seat_vacant_held_line'|'seat_held_vacant_line'} code
 * @property {string} detail
 */

/**
 * VACANT: the holder's lines that contradict the seat, each filled for its own row (a W3 or W3v on a non-form row's
 * description; a W1 or W1v on a relation row naming the form, the other power as the holder). The held pools fault an
 * empty seat; the vacant twins fault a held one.
 * @param {ReadonlyArray<unknown>} factions @param {object} form the governing row
 * @param {unknown} relations the record's relation rows @param {boolean} empty the chain's `missing_seat`
 * @returns {SeatFinding[]}
 */
function holderLineFindings(factions, form, relations, empty) {
  /** @type {'standing' | 'standingVacant'} */
  const standing = empty ? 'standing' : 'standingVacant';
  /** @type {'relation' | 'relationVacant'} */
  const relation = empty ? 'relation' : 'relationVacant';
  const code = empty ? 'seat_vacant_held_line' : 'seat_held_vacant_line';
  const formRow = /** @type {Record<string, unknown>} */ (form);
  const formName = String(formRow.faction || '');
  /** @type {SeatFinding[]} */
  const out = [];
  for (const entry of factions) {
    const f = entry && typeof entry === 'object' ? /** @type {Record<string, unknown>} */ (entry) : null;
    const desc = f && f !== formRow && typeof f.desc === 'string' ? f.desc : null;
    if (!f || desc === null) continue;
    const line = seatHolderLinesOf(standing, { form: formRow, holder: f }).find((l) => desc.includes(l));
    if (line) out.push({ code, detail: `${String(f.faction || '')}: "${line}"` });
  }
  for (const entry of Array.isArray(relations) ? relations : []) {
    const row = entry && typeof entry === 'object' ? /** @type {{ pair?: unknown, narrative?: unknown }} */ (entry) : null;
    const pair = Array.isArray(row?.pair) ? row.pair.map(String) : [];
    const other = pair.includes(formName) ? pair.find((n) => n !== formName) : undefined;
    const narrative = typeof row?.narrative === 'string' ? row.narrative : null;
    if (!other || narrative === null) continue;
    const line = seatHolderLinesOf(relation, { form: formRow, holder: { faction: other } }).find((l) => narrative.includes(l));
    if (line) out.push({ code, detail: `${formName}<->${other}: "${line}"` });
  }
  return out;
}

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
  const chain = rulingChainOf(settlement);
  // VACANT: the holder's lines first, under the seat law, before the empty seat's return
  if (seatsByHolder(settlement)) {
    const relations = /** @type {{ powerStructure?: { factionRelationships?: unknown } } | null | undefined} */ (settlement)?.powerStructure?.factionRelationships;
    findings.push(...holderLineFindings(factions, governing, relations, chain.absence?.kind === 'missing_seat'));
  }

  // A stand-in filed in the seat's office inside the governing faction.
  for (const { npc, row } of rows) {
    if (seatTitleRankOf(npc) >= 0 && isOfficeStandIn(npc) && inGov(row)) {
      findings.push({ code: 'seat_stand_in', detail: `${String(npc.name || '')} stands in the seat office of ${govName}` });
    }
  }

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
