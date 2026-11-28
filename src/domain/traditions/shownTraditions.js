/**
 * domain/traditions/shownTraditions.js — THE TRADITIONS THE TAB SHOWS, in one place (TRAD-1, the seventh chair's CTR9,
 * 2026-11-20). Extracted from `components/new/tabs/TraditionsTab.jsx` VERBATIM in behaviour (the house's law for a
 * shared page: "NEVER A SECOND DERIVATION", publicProseCompose.js), so the owner's tab and the save-time composer that
 * draws the shared page's traditions read one rule:
 *   - the SET: the lit mirror (`settlement.traditions`) where the record holds one, else genesis's founding preview with
 *     the DM's authored custom traditions merged in;
 *   - the ADMISSIBLE rows: a generated row whose motif presumes a fact the record does not hold is not printed (CENSUS-3b
 *     unit 5; NOLANE-2's fair-needs-a-market), a DM's custom row stands as authored;
 *   - the CALENDAR LINE: one per window (X-50, F2 REPEAT-ONCE): a later rite kept in the same weeks names the nearest
 *     earlier one instead of repeating the phrase;
 *   - the MOTIF CHIP: the element, and the act only where the name does not already carry it.
 * And `sharedTraditionRowsOf`, the rows the owner's save writes as TEXT under `publicProse` (CTR9): the shared page's
 * Traditions tab prints these and never derives a set from `id` (the seed never travels, 099/121). THE DRAWN SET ADMITS BY
 * THE FLOOR (TRAD-3 unit 4, the chair's cure B, 2026-11-20): the rows drawn for the shared page admit their motifs over
 * the record with every house's `function`-eye fields stripped (traditionDescription.js :: withoutFunction: a house's
 * NAME against the catalogue's tags, hidden or shown), so no later shut of a house's function eye could have moved the
 * set; and over no house of the hideable class (people/cardVeil.js :: isHideableHouse, TRAD-3 unit 4b), so no later
 * hide of a house whole could have. The owner's set (shownTraditionsOf) is unchanged and admits by the record it is handed.
 * And `descriptionSetOf` (TRAD-4 unit 10): THE SET A DESCRIPTION ROTATES OVER, one rule for every surface that composes
 * one (the tab, the drawn rows, the printed export, the search index), so a town reads the same on each: the owner's set
 * for the owner; for a reader the DRAWN set (CTR11: never a row a DM can hide).
 * Pure: no draw, no clock, no write.
 */
import { deriveFoundingTraditions, describeTraditionWindow } from './genesis.js';
import { mergeCustomFoundingTraditions } from './customFounding.js';
import { describeTraditions } from './traditionDescription.js';
import { traditionFloorOf } from './traditionFloor.js';
import { TRADITION_ELEMENTS, TRADITION_ACTS } from '../../data/traditionCorpus.js';
import { filterDeclared } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */
/** @typedef {{ id?: unknown, name?: unknown, coreMotif?: { element?: unknown, act?: unknown }|null, window?: { startWeekOfYear?: number, weeks?: number }|null } & Record<string, unknown>} AnyRec  a tradition row as the tab holds it (generated, lit or custom) */
/**
 * @typedef {Object} SharedTraditionRow  one tradition as the shared page prints it: text, drawn owner-side at save
 * @property {string} id       `tradition.shared.<n>`, its place in the drawn set (a React key and the search's key; never
 *                             the genesis id, never a seed: TRAD-3 unit 4, the chair's item 5)
 * @property {string} name     the tradition's name
 * @property {string} element  its motif element id (the register glyph's key)
 * @property {string} chip     the motif chip as the card prints it
 * @property {string} when     the calendar line as the card prints it ("Kept in Harvest, the eighth week.")
 * @property {string} text     THE READER'S DESCRIPTION ('' where none is composed)
 */

/** The drawn row's id: this prefix and the row's place in the drawn set (0..n-1, dense, in the order served). */
const SHARED_ROW_ID = 'tradition.shared.';

/** element id → the facts it declares (`traditionCorpus.js :: TRADITION_ELEMENTS`' `needs`). */
const ELEMENT_NEEDS = new Map(TRADITION_ELEMENTS.filter((e) => Array.isArray(e.needs) && e.needs.length).map((e) => [e.id, e.needs]));
/**
 * act id → the facts it declares. A FAIR IS KEPT WHERE THERE IS A MARKET (NOLANE-2, BAR-169/170): the act `fair` presumes
 * the market the Overview's market line reads (`market`, the vocabulary's market atom). Kind A, display only.
 */
const ACT_NEEDS = new Map(TRADITION_ACTS.filter((a) => Array.isArray(a.needs) && a.needs.length).map((a) => [a.id, a.needs]));

/** The facts a generated tradition's motif declares: its element's, and its act's. @param {AnyRec|null|undefined} rec @returns {string[]} */
export function motifNeeds(rec) {
  return [...new Set([...(ELEMENT_NEEDS.get(String(rec?.coreMotif?.element ?? '')) || []), ...(ACT_NEEDS.get(String(rec?.coreMotif?.act ?? '')) || [])])];
}

/**
 * The traditions the tab shows: the lit mirror, else the founding preview with the DM's custom traditions merged in,
 * filtered to the admissible rows.
 * @param {AnyRec|null|undefined} settlement @param {unknown} [customTraditions] the DM's authored custom traditions
 * @returns {{ preview: boolean, recs: AnyRec[] }}
 */
export function shownTraditionsOf(settlement, customTraditions) {
  return shownOver(settlement, customTraditions, settlement);
}

/**
 * The shown set, its motifs admitted over `admitOver` (the owner's tab: the record itself; the shared page's drawn rows:
 * the record at its floor). The set itself (the lit mirror, else genesis's preview) is always the record's own.
 * @param {AnyRec|null|undefined} settlement @param {unknown} customTraditions @param {AnyRec|null|undefined} admitOver
 * @returns {{ preview: boolean, recs: AnyRec[] }}
 */
function shownOver(settlement, customTraditions, admitOver) {
  if (!settlement || typeof settlement !== 'object') return { preview: true, recs: [] };
  const mirror = Array.isArray(settlement.traditions) ? settlement.traditions : null;
  const preview = !mirror || mirror.length === 0;
  const kept = preview
    ? mergeCustomFoundingTraditions(deriveFoundingTraditions(/** @type {Parameters<typeof deriveFoundingTraditions>[0]} */ (settlement)),
      /** @type {Parameters<typeof mergeCustomFoundingTraditions>[1]} */ (Array.isArray(customTraditions) ? customTraditions : []))
    : /** @type {AnyRec[]} */ (mirror);
  const recs = filterDeclared(
    kept.map((rec) => ({
      text: String(rec?.name ?? ''),
      // A DM's AUTHORED custom tradition (`customFounding.js`, id `custom:…`) is the DM's truth and is printed as
      // authored; only a generated row is held to its motif's declaration.
      needs: String(rec?.id ?? '').startsWith('custom:') ? [] : motifNeeds(rec),
      rec,
    })),
    { facts: () => factsOf(admitOver), poolId: 'traditions:tab', surface: 'traditions', drawKind: 'A' },
  ).map((row) => /** @type {AnyRec} */ (row.rec));
  return { preview, recs };
}

/** Humanize a motif id ("the-dead" → "The Dead", "long-sun" → "Long Sun"). @param {unknown} id @returns {string} */
export function humanizeMotif(id) {
  return String(id || '').split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
}

/** The motif chip: the element, and the act only where the name does not carry it. @param {AnyRec} rec @returns {string} */
export function motifChipOf(rec) {
  const element = humanizeMotif(rec?.coreMotif?.element);
  const act = humanizeMotif(rec?.coreMotif?.act);
  const actInName = !act || String(rec?.name || '').toLowerCase().includes(act.toLowerCase());
  return [element, actInName ? '' : act].filter(Boolean).join(' · ');
}

/**
 * For each tradition whose window phrase an earlier one on the tab already printed: the NEAREST earlier tradition's name
 * in that window, keyed by the later one's id (RUNG-2 LANDING phase C unit 3: nearest, not first).
 * @param {ReadonlyArray<AnyRec>|null|undefined} traditions @returns {Map<string, string>}
 */
export function sameWindowPlan(traditions) {
  /** @type {Map<string, string>} */
  const plan = new Map();
  /** @type {Map<string, string>} */
  const lastBy = new Map();
  for (const rec of Array.isArray(traditions) ? traditions : []) {
    const phrase = describeTraditionWindow(/** @type {import('./genesis.js').TraditionWindow|null|undefined} */ (rec?.window));
    const name = String(rec?.name ?? '');
    const prev = lastBy.get(phrase);
    if (prev) plan.set(String(rec?.id ?? ''), prev);
    if (name || prev === undefined) lastBy.set(phrase, name);
  }
  return plan;
}

/** The card's calendar line. @param {AnyRec} rec @param {string|null} sameWindowAs @returns {string} */
export function calendarLineOf(rec, sameWindowAs) {
  if (sameWindowAs) return `Kept in the same ${(Number(rec?.window?.weeks) || 1) >= 2 ? 'weeks' : 'week'} as ${sameWindowAs}.`;
  return `Kept in ${describeTraditionWindow(/** @type {import('./genesis.js').TraditionWindow|null|undefined} */ (rec?.window))}.`;
}

/**
 * THE DRAWN SET: the set the owner's tab shows (the DM's custom traditions are the owner's library and are not shipped:
 * none is passed), its motifs admitted by the floor (the chair's cure B): every live house NOT of the hideable class
 * (cardVeil.js :: isHideableHouse, read on the house whole before the strip, as readerView reads it; TRAD-3 unit 4b), less
 * its function-eye fields (the facts the admission reads, market and the smith, read the live roster only).
 * @param {AnyRec|null|undefined} settlement the owner's record @returns {AnyRec[]}
 */
function drawnSetOf(settlement) {
  return shownOver(settlement, [], traditionFloorOf(settlement)).recs; // the floor: traditionFloor.js (RULING 122-T-2)
}

/**
 * THE SET A DESCRIPTION ROTATES OVER (TRAD-4 unit 10; traditionDescription.js :: describeTradition's `set`), in the order
 * the surface shows it: for the OWNER, the owner's set (shownTraditionsOf, with the DM's custom traditions the surface
 * shows); for a READER (anything but 'owner', as the leaf reads it), THE DRAWN SET the shared page serves (CTR11: the
 * reader's rotation runs over the rites the reader is shown, never over a row a DM can hide), whatever page composes it.
 * @param {AnyRec|null|undefined} settlement the owner's record @param {unknown} audience
 * @param {unknown} [customTraditions] the DM's authored custom traditions (the owner's set only) @returns {AnyRec[]}
 */
export function descriptionSetOf(settlement, audience, customTraditions) {
  return audience === 'owner' ? shownTraditionsOf(settlement, customTraditions).recs : drawnSetOf(settlement);
}

/**
 * THE SHARED PAGE'S TRADITIONS (CTR9), composed on the OWNER's record at save: the drawn set (drawnSetOf), each as text
 * with THE READER'S description, composed over that same set (descriptionSetOf's reader set: TRAD-4 unit 10). Null where
 * the record shows none.
 * @param {AnyRec|null|undefined} settlement the owner's record @returns {SharedTraditionRow[]|null}
 */
export function sharedTraditionRowsOf(settlement) {
  const recs = descriptionSetOf(settlement, 'reader');
  if (!recs.length) return null;
  const plan = sameWindowPlan(recs);
  // composed whole by the leaf over the drawn set, in its order (its pools drawn through drawDeclared inside it)
  const descriptions = describeTraditions(recs, /** @type {Record<string, unknown>} */ (settlement), { audience: 'reader' });
  return recs.map((rec, i) => {
    const described = descriptions[i];
    return {
      // THE DRAWN ROW'S ID (the chair's item 5, TRAD-3 unit 4): its place in the DRAWN set, dense, in the order served;
      // never the genesis id (which holds the seed), so a rite the floor rule drops leaves no gap. The owner's page keeps the genesis ids.
      id: `${SHARED_ROW_ID}${i}`,
      name: String(rec.name ?? ''),
      element: String(rec?.coreMotif?.element ?? ''),
      chip: motifChipOf(rec),
      when: calendarLineOf(rec, plan.get(String(rec.id ?? '')) ?? null),
      text: described ? described.text : '',
    };
  });
}
