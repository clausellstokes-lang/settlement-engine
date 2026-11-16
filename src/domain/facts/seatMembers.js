/**
 * domain/facts/seatMembers.js — THE SEAT'S MEMBERS HOME (BAR6-POWERS, LAW 6 › 6d-members; the brief BAR6's fact (f): "a
 * member-count atom"; on the veto list as new vocabulary). ONE atom, the record's fact: the governing power is a body of MORE
 * THAN ONE, as the page counts its members. A line that says "its members cannot agree" presumes two members or more: the
 * DS-POW council arm's counterforce line printed beside "· 1 member" on a one-headman authority (the wide read's C91256,
 * bar0-hamlet-under_siege-rand-30; 33 instances in the census's 720 at 600b7683a).
 *
 *   seatMembersOf(record)   THE ONE READER: true where the roster holds two members of the governing power or more; false
 *                           where it holds exactly one; where it holds NONE (a body the roster casts no face for), the
 *                           government's own label answers (`rulingBody.js :: rulingBodyOf`: a council is a body, a
 *                           headman is one); `undefined` where the record holds no governing power (fail-closed)
 *
 * THE COUNT IS THE PAGE'S OWN: `people/membership.js :: membersByRank(settlement.npcs, power)`, the reader the Power tab's
 * row counts by ("· 1 member · first …", `PowerStrata.jsx :: FactionRow`). One count, two surfaces.
 *
 * ⛔ TRUE OF THE SETTLED RECORD ONLY (the chair's ruling K10, as `seatOutranked.js`): the cast and its memberships land late in
 * assembly. Only a line rendered from the settled record (the page's desks) may be keyed by it.
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar6PowersCards.test.js
 */
import { membersByRank } from '../people/membership.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { rulingBodyOf } from './rulingBody.js';

/**
 * THE ONE READER of `seat members`.
 * @param {{ powerStructure?: unknown, npcs?: unknown } | null | undefined} record
 * @returns {boolean | undefined}
 */
export function seatMembersOf(record) {
  const seat = governingFactionOf(/** @type {any} */ (record));
  const name = seat ? nameOf(seat) : '';
  if (!name) return undefined;
  const count = membersByRank(Array.isArray(record?.npcs) ? record.npcs : [], name).length;
  if (count >= 2) return true;
  if (count === 1) return false;
  return rulingBodyOf(/** @type {any} */ (record));
}
