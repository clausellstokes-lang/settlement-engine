/**
 * domain/facts/seatMembers.js — THE SEAT'S MEMBERS HOME (BAR6-POWERS, LAW 6 › 6d-members; the brief BAR6's fact (f): "a
 * member-count atom"; on the veto list as new vocabulary). ONE atom, the record's fact: the governing power is a body of MORE
 * THAN ONE, as the page counts its members. A line that says "its members cannot agree" presumes two members or more: the
 * DS-POW council arm's counterforce line printed beside "· 1 member" on a one-headman authority (the wide read's C91256,
 * bar0-hamlet-under_siege-rand-30; 33 instances in the census's 720 at 600b7683a).
 *
 *   seatMembersOf(record)   THE ONE READER: true where the roster holds two members of the governing power or more; false
 *                           where it holds exactly one; where it holds NONE (a body the roster casts no face for), the
 *                           government's own label answers (`rulingBody.js :: rulingBodyOf`, handed by `factsOf`: a council is a body, a
 *                           headman is one); `undefined` where the record holds no governing power (fail-closed)
 *
 * THE COUNT IS THE PAGE'S OWN: `people/membership.js :: membersByRank(settlement.npcs, power)`'s count (read here in its own
 * terms, below), the reader the Power tab's row counts by ("· 1 member · first …", `PowerStrata.jsx :: FactionRow`). One count, two surfaces.
 *
 * ⛔ TRUE OF THE SETTLED RECORD ONLY (the chair's ruling K10, as `seatOutranked.js`): the cast and its memberships land late in
 * assembly. Only a line rendered from the settled record (the page's desks) may be keyed by it.
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar6PowersCards.test.js
 */
// EG1 (the chair's ruling): `factsOf.js` reads this leaf eagerly, so it IMPORTS NOTHING (an import of `rulingBody.js` here moved
// `rulerKindLabel.js` into the lazy coherence chunk and dragged it, with narrative-mutations and data-lazy, into first paint:
// tests/build/vendorPdfLazy.test.js, measured by a build). The roster count and the governing power are read here in
// `membership.js :: membersByRank`'s own terms and `rulingPower.js :: governingFactionOf`'s; with no member cast, the caller
// hands the government label's answer (`factsOf` passes `rulingBody.js :: rulingBodyOf`, which it already imports).
/**
 * The record's slices this home reads, as stored (each read defensively; CLOSE-SWEEP S1, the any-casts typed):
 * @typedef {{ factions?: unknown, governingName?: unknown }} SeatPowers the record's `powerStructure`
 * @typedef {{ faction?: unknown, name?: unknown, isGoverning?: unknown } | null | undefined} SeatPower a power of `powerStructure.factions`
 * @typedef {{ memberships?: unknown } | null | undefined} SeatPerson a person of the record's `npcs`
 * @typedef {{ power?: unknown } | string | number | boolean | null | undefined} SeatMembership an entry of a person's `memberships` (a stored value; an object is read for its power)
 */
/** @param {unknown} f @returns {string} a power's name, as `rulingPower.js :: nameOf` reads it */
const nameOf = (f) => String(/** @type {SeatPower} */ (f)?.faction || /** @type {SeatPower} */ (f)?.name || '').trim();

/**
 * THE ONE READER of `seat members`.
 * @param {{ powerStructure?: unknown, npcs?: unknown } | null | undefined} record
 * @param {() => boolean | undefined} [bodyOfLabel] with no member cast: the government label's own answer (`rulingBodyOf`)
 * @returns {boolean | undefined}
 */
export function seatMembersOf(record, bodyOfLabel = () => undefined) {
  const ps = /** @type {{ powerStructure?: SeatPowers } | null | undefined} */ (record)?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const seat = factions.find((/** @type {SeatPower} */ f) => f?.isGoverning) || factions.find((/** @type {SeatPower} */ f) => nameOf(f) && nameOf(f) === String(ps.governingName || '')) || null;
  const name = seat ? nameOf(seat) : '';
  if (!name) return undefined;
  const npcs = Array.isArray(/** @type {{ npcs?: unknown } | null | undefined} */ (record)?.npcs) ? /** @type {{ npcs: SeatPerson[] }} */ (record).npcs : [];
  const count = npcs.filter((/** @type {SeatPerson} */ n) => Array.isArray(n?.memberships)
    && n.memberships.some((/** @type {SeatMembership} */ m) => !!m && typeof m === 'object' && typeof m.power === 'string' && m.power !== '' && m.power === name)).length;
  if (count >= 2) return true;
  if (count === 1) return false;
  return bodyOfLabel();
}
