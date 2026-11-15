/**
 * domain/display/clergyHouse.js — A HOUSE WITH CLERGY STANDS: the one reading two display lines share.
 *
 * A church, temple, cathedral, chapel, abbey, monastery, friary or priory on the live roster, of the town's own. A wayside
 * shrine alone keeps no clergy, and "Access to parish church" is a neighbour's house (`facts/institutions.js ::
 * ACCESS_ONLY`). Read by the threat rows' clergy line (EXPORTS-B1, the chair's ruling C: the economy compound's
 * `hasChurch` counts both) and by the governing power's faith chip, "church guidance" / "church sway"
 * (TAIL-DISPLAY-CIVIC-2, the chair's ruling X14: `factsOf(...).sacredHouse` does not count the neighbour's church, but it
 * does count a wayside shrine, and the chip named a church over a shrine alone in 15 of the census's 720 towns at
 * e633bd333). The sacred-house fact itself is left as it is: its other readers (a bell, an offering at the shrine, the
 * vestments "too grand for the shrine they serve") are true of a shrine.
 *
 * Pure: reads the roster, draws nothing, writes nothing.
 */
import { liveInstitutionNames, ACCESS_ONLY } from '../facts/liveInstitutionNames.js'; // TAIL-TIES-6 (T23): the pure leaf, no edge into the lazy facts/institutions.js

const CLERGY_HOUSE_RE = /\btemple|\bchurch|\bcathedral|\bchapel|\babbey|\bmonaster|\bfriary|\bpriory/i;

/** @param {{ institutions?: unknown } | null | undefined} r @returns {boolean} */
export const clergyHouseStands = (r) => liveInstitutionNames(r).some((n) => !ACCESS_ONLY.test(n) && CLERGY_HOUSE_RE.test(n));
