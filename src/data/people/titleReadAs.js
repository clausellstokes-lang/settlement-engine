/**
 * data/people/titleReadAs.js — A FACE'S TITLE READ AS ANOTHER BY THE TABLES KEYED ON TITLES (BIRTH-1 D8, the tenth chair's ruling G10
 * of 2026-11-25 on intake 6). A zero-import leaf.
 *
 * The thorp's "Lord's reeve" seats the Feudal Stewardship; its face said "the reeve", so the seat line read "Isamu Liu, the reeve,
 * holds its seat" beside a stewardship. The ruling: the face says whose officer he is, "the lord's reeve". The tables that take
 * MEANING from a title (its name pool, its secrets and presentations, its honorific, its styled form) read the new title exactly
 * as they read the old (R24g (2): a reader that takes meaning from a name reads the new name as it read the old), so the card is
 * the same card with the same lines and only its title's words move. One row; nothing copied.
 */

/** @type {Readonly<Record<string, string>>} a face's title -> the title the tables keyed on titles read it as */
export const TITLE_READ_AS = Object.freeze({ "the lord's reeve": 'the reeve' });

/** The title the tables keyed on titles read for this one (itself, unless it has a row above). @param {string} title */
export const titleKeyOf = (title) => (Object.prototype.hasOwnProperty.call(TITLE_READ_AS, title) ? TITLE_READ_AS[title] : title);
