/**
 * pdf/lib/crisisMarksOnPage.js — THE PDF'S ROWS OF ORDINARY TIMES UNDER A CRISIS, MARKED BY THE TABS' ONE LEAF
 * (TAIL-EXPORTS-PDF-2, the chair's rulings E3 and E17 of 2026-11-14/15; vetoable by the owner).
 *
 * The PDF prints the same service, house, chain and income rows the tabs print. Under a siege, an outbreak or a famine
 * the tabs mark a row that lives on what the crisis stops and say once, at the head, that the descriptions are of
 * ordinary times (`domain/display/crisisStoppedRow.js`, the SERVICES seat's ruling S1). The PDF calls that leaf and
 * keeps NO wording of its own: the mark ("Stopped by the siege."), the word after a name with no description
 * ("(stopped)") and the head line are the leaf's.
 *
 * Pure: reads the record, writes nothing.
 */
import {
  stoppingCrisesOf, rowStoppedBy, crisisMarkText, markedDescription, ordinaryTimesLine, STOPPED_WORD,
} from '../../domain/display/crisisStoppedRow.js';

/** The active stopping crises of a record, read once a record. @type {WeakMap<object, string[]>} */
const CRISES = new WeakMap();

/**
 * @param {object | null | undefined} settlement
 * @returns {string[]}
 */
function crisesOf(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];
  let crises = CRISES.get(settlement);
  if (!crises) { crises = stoppingCrisesOf(settlement); CRISES.set(settlement, crises); }
  return crises;
}

/**
 * The crisis that stops this row on the page, or null (a calm town, a custom row, a row living on nothing it stops).
 * @param {object | null | undefined} settlement
 * @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row the record's own row
 * @returns {string | null}
 */
export function stoppedOnPage(settlement, kind, row) {
  const crises = crisesOf(settlement);
  return crises.length ? rowStoppedBy(settlement, kind, row, crises) : null;
}

/**
 * The leaf's mark for this row ("Stopped by the siege."), or null.
 * @param {object | null | undefined} settlement @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row
 * @returns {string | null}
 */
export function markOnPage(settlement, kind, row) {
  return crisisMarkText(settlement, stoppedOnPage(settlement, kind, row));
}

/**
 * The description as the tab prints it: the leaf's mark, then the description of ordinary times.
 * @param {object | null | undefined} settlement @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row @param {unknown} desc
 * @returns {string}
 */
export function markedOnPage(settlement, kind, row, desc) {
  return markedDescription(markOnPage(settlement, kind, row), desc);
}

/**
 * The word after a name that prints no description ("stopped"), as the Institutions tab's doors print it; null where
 * the row is not stopped or the leaf's door refuses the crisis's mark.
 * @param {object | null | undefined} settlement @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row
 * @returns {string | null}
 */
export function stoppedWordOnPage(settlement, kind, row) {
  const crisis = stoppedOnPage(settlement, kind, row);
  return crisis && crisisMarkText(settlement, crisis) ? STOPPED_WORD[crisis] || null : null;
}

/**
 * The leaf's one head line for a chapter whose rows these are, when at least one is marked; else null.
 * @param {object | null | undefined} settlement
 * @param {ReadonlyArray<readonly ['service' | 'house' | 'chain' | 'income', Record<string, unknown> | null | undefined]>} rows
 * @returns {string | null}
 */
export function ordinaryTimesOnPage(settlement, rows) {
  if (crisesOf(settlement).length === 0) return null;
  const marked = [];
  for (const [kind, row] of rows) {
    const crisis = stoppedOnPage(settlement, kind, row);
    if (crisis && crisisMarkText(settlement, crisis)) marked.push(crisis);
  }
  return ordinaryTimesLine(marked);
}
