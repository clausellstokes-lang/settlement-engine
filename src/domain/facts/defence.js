/**
 * domain/facts/defence.js — THE DEFENCE-PRESENCE HOME (CENSUS-1 wave 0, fact 3; the design's §1
 * rows walls / gate / garrison / watch / militia / hospital, Appendix A competing readings 1, 2, 4).
 *
 * The facts are `defense/defenseFacts.js :: defenseFactsOf`'s, which already reads the LIVE
 * roster (ruined rows filtered) through the force buckets. This module names them as the
 * census's atoms, one meaning each, so a prose consumer that used `priorityHelpers ::
 * getInstitutionNames` (the raw roster, substring flags) reads them here instead:
 *
 *   walls    — a perimeter wall or palisade stands (a building's own walls declare nothing:
 *              the chair's ruling 3, F11's enclosure rule)
 *   gate     — a gate on a wall: stone walls, or a roster row that names a gate. A palisade has
 *              no gate unless the roster says so.
 *   watch    — a watch institution. A militia is its own fact; "watch or militia" is two atoms.
 *   militia  — a militia institution
 *   garrison — a standing garrison (soldiers and a commander)
 *   hospital — a hospital. A healer, a monastery or a friary is not one (`healer` is its own).
 *   mercenary — a hired company (for the composite `guardPresence`, `factsOf.js`)
 *   commander — a garrison stands, so someone commands one (`hasCommander`; CENSUS-1c, R-E)
 *   court    — a court sits: a courthouse, or a town or city hall a magistrate hears cases in
 *              (`hasCourt`; COHERENCE-AGREE, 2026-11-12)
 *   prison   — somewhere to hold the guilty: a prison, the stocks, a gaol or a jail (`hasPrison`;
 *              COHERENCE-AGREE-4, 2026-11-12). A court and a prison are two facts.
 *
 * Pure: no randomness, no clock.
 */
import { defenseFactsOf } from '../defense/defenseFacts.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * @typedef {object} DefenceFacts
 * @property {boolean} walls @property {'stone'|'palisade'|null} wallKind @property {boolean} palisade
 * @property {boolean} gate @property {boolean} watch @property {boolean} militia
 * @property {boolean} garrison @property {boolean} hospital @property {boolean} healer @property {boolean} mercenary @property {boolean} commander @property {boolean} court
 * @property {boolean} prison
 */

/**
 * THE ONE READER of the defence-presence atoms.
 * @param {{ institutions?: unknown } | null | undefined} record a settlement, or any record that carries its roster
 * @returns {Readonly<DefenceFacts>}
 */
export function defenceOf(record) {
  const d = defenseFactsOf(/** @type {Parameters<typeof defenseFactsOf>[0]} */ (record));
  return Object.freeze({
    walls: d.hasWalls,
    wallKind: /** @type {'stone'|'palisade'|null} */ (d.wallKind ?? null),
    palisade: d.hasPalisade,
    gate: d.hasGate,
    watch: d.hasWatch,
    militia: d.hasMilitia,
    garrison: d.hasGarrison,
    hospital: d.hasHospital,
    healer: d.hasHealer,
    mercenary: d.hasMercenary,
    commander: d.hasCommander,
    court: d.hasCourt,
    prison: d.hasPrison,
  });
}

/**
 * A SERVICE THE DEFENCE ATOMS DECIDE (TAIL-CLOSE-SRC-2, the defence walker's court-and-gate member: the agreement
 * `display/chainNeedShown.js` asked on its own line, a printed service string tested for "gate" beside this home's
 * answer, is a question this home answers): a service that names a gate ("gate control") stands only where a gate
 * stands (`gate`: stone walls, or a roster row that names one; a palisade alone keeps none); every other service stands.
 * @param {{ institutions?: unknown } | null | undefined} record @param {unknown} service a service as the record names it
 * @returns {boolean}
 */
export function defenceKeepsService(record, service) {
  return defenceOf(record).gate || !/\bgate\b/i.test(String(service));
}

// ─── THE COURT ON THE LIVE ROSTER (TAIL-CLOSE-SRC-4, the chair's SR1: every read of a defence fact goes through the one
// home). Moved VERBATIM from `display/defenseDisplay.js` (W2-C-LEAVES-SIDE, the chair's #575; V6, TAIL-DISPLAY-CIVIC-4),
// where the defence walker's court-and-gate member read its four name tests. It asks a different question from this
// home's `court` atom (`defenseFacts.js :: hasCourt`, a name test that takes every town hall for a court): the roster
// governs the Defense tab's legal row, and the two disagree in 37 of the census's 720, by design. ───

/** @typedef {{ institutions?: unknown, availableServices?: unknown } | null | undefined} CourtRecord */

/** A house that is a court by its name: the courthouse, the court buildings. */
const COURT_HOUSE = /courthouse|court buildings/i;
/**
 * The catalogue's court services (`data/institutionServices.js`): a hall, a council or an administration holds a court
 * only where the town drew one of these for it ("Dispute adjudication: hears civil pleas in the town court", "Dispute
 * arbitration … before a magistrate", "Appeals court", "Courts and adjudication", the courthouse's own rows).
 */
const COURT_SERVICES = new Set(['Civil disputes', 'Criminal trials', 'Civil litigation', 'Criminal proceedings', 'Appeals',
  'Dispute arbitration', 'Appeals court', 'Dispute adjudication', 'Courts and adjudication', 'Legal appeals', 'Civic law enforcement']);

/**
 * THE HOUSES THAT HOLD THE TOWN'S COURT on the live roster: 'Courthouse' where a courthouse or court buildings stand,
 * else each live house that drew a court service (its roster name).
 * @param {CourtRecord} settlement
 * @returns {string[]}
 */
export function courtHoldersOf(settlement) {
  const live = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (/** @type {unknown} */ (settlement)))
    .map((i) => String(/** @type {{ name?: unknown } | null} */ (i)?.name ?? '')).filter(Boolean);
  if (live.some((n) => COURT_HOUSE.test(n))) return ['Courthouse'];
  const drawn = /** @type {{ availableServices?: unknown }} */ (settlement)?.availableServices;
  const rows = drawn && typeof drawn === 'object' ? Object.values(drawn).flat() : [];
  /** @type {string[]} */
  const holders = [];
  for (const row of rows) {
    const sv = /** @type {{ name?: unknown, institution?: unknown } | null} */ (row);
    const inst = String(sv?.institution ?? '');
    if (typeof sv?.name === 'string' && COURT_SERVICES.has(sv.name) && live.includes(inst) && !holders.includes(inst)) holders.push(inst);
  }
  return holders;
}

/**
 * V6 (TAIL-DISPLAY-CIVIC-4): THE BENCH THAT HEARS THE CASES where no courthouse stands: a council's ("Council bench") or
 * a town hall's ("Town hall bench"); null where a courthouse stands or the court's holder is another house (a city
 * administration's courts, a city hall's appeals court: courts by their own service rows).
 * @param {CourtRecord} settlement
 * @returns {string | null}
 */
export function courtBenchOf(settlement) {
  const holders = courtHoldersOf(settlement);
  if (holders.length === 0 || holders.includes('Courthouse')) return null;
  if (holders.some((h) => !/council|town hall/i.test(h))) return null;
  return holders.some((h) => /council/i.test(h)) ? 'Council bench' : 'Town hall bench';
}
