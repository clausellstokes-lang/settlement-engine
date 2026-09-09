/**
 * firstHundred.js — R-29 THE FIRST HUNDRED (the founding-cohort honor roll, config source).
 *
 * WHAT IT IS
 *   A quiet acknowledgment of the first hundred people to make a home in SettlementForge:
 *   the earliest members who backed the world when it was still being built. It is a
 *   thank-you, not a leaderboard and not a product. It has NO mechanics: no seat, no
 *   license, no entitlement rides on being listed here.
 *
 * NOT THE FOUNDERS' HALL. This is a DIFFERENT thing from the thirty numbered chairs of
 *   the Founders' Hall (src/lib/foundersHall.js, /founders). A chair is GIVEN, never
 *   sold: all thirty are by invitation, each is bound to one founder permanently, and no
 *   transfer path exists — the paid, transferable license this note used to describe was
 *   the SUPERSEDED design and was abolished before it ever sold (docs/
 *   DESIGN_FOUNDERS_HALL.md §1/§4). The First Hundred is an open, unpriced
 *   acknowledgment of early members, capped at FIRST_HUNDRED_CAP.
 *
 * THE RELATIONSHIP, STATED RATHER THAN DISCOVERED (DESIGN_FOUNDERS_HALL §8 build-time
 *   check): the two lists are INDEPENDENT. A person may be on either, both, or neither;
 *   a place on this roll is not a claim on a chair, and holding a chair does not put a
 *   name here. Nothing in this file changes the chair count or implies a paid tier.
 *
 * CLAIMS-PARITY (the law): this list ships EMPTY and carries only real, opted-in names.
 *   No placeholder people, no seeded examples, no "coming soon" names. The page renders
 *   exactly this list and nothing else, so the wall can never show a person who is not
 *   really on it. The owner adds a name here (by hand, in a commit) only after that
 *   person has opted in to be shown.
 *
 * PURITY / BUDGET: pure data + pure helpers, no transport, no store import. A page reads
 *   it lazily; it never touches the first-paint graph.
 */

/** The size of the founding cohort this page honors. A config fact, never a literal in copy. */
export const FIRST_HUNDRED_CAP = 100;

/**
 * @typedef {{ name: string, note?: string, since?: string }} Honoree
 *   name  — the display name the person opted into (never an email or account id).
 *   note  — an optional one-line dedication in the house register.
 *   since — an optional ISO date (or 'YYYY-MM') of when they joined.
 */

/**
 * THE ROLL — ships EMPTY. Add a { name } entry (optionally note/since) only for a real
 * person who has opted in. Frozen so no runtime path mutates it.
 * @type {ReadonlyArray<Honoree>}
 */
export const FIRST_HUNDRED = Object.freeze(/** @type {Honoree[]} */ ([]));

/** A valid honoree has a non-empty display name (claims-parity: a real, named person). */
export function isValidHonoree(entry) {
  return !!entry && typeof entry === 'object' && typeof entry.name === 'string' && entry.name.trim().length > 0;
}

/**
 * The listed honorees, filtered to the valid + capped to FIRST_HUNDRED_CAP. The cap is a
 * hard guard: even a mis-edited longer list can never render past the cohort size.
 * @param {ReadonlyArray<Honoree>} [roll]
 * @returns {Honoree[]}
 */
export function listedHonorees(roll = FIRST_HUNDRED) {
  return (Array.isArray(roll) ? roll : []).filter(isValidHonoree).slice(0, FIRST_HUNDRED_CAP);
}

/** How many names are on the roll. */
export function firstHundredCount(roll = FIRST_HUNDRED) {
  return listedHonorees(roll).length;
}

/** How many places remain open in the cohort. */
export function firstHundredRemaining(roll = FIRST_HUNDRED) {
  return Math.max(0, FIRST_HUNDRED_CAP - firstHundredCount(roll));
}
