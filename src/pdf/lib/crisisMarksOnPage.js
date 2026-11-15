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
 * THE LEAF'S SECOND CAUSE (TAIL-EXPORTS-PDF-3, the chair's ruling E22 of 2026-11-15; vetoable by the owner): a service
 * or a house row that is what its house makes from an input the page says never reaches that house is marked short of
 * it ("Short of grapes."; the word "short" after a name with no description), calm town or not, and the chapter's head
 * line says once what such a row is: the leaf's `rowShortOf`, `rowMarkText`, `SHORT_WORD`, as the Services and
 * Institutions tabs print them. A chain or an income share takes no second cause (the leaf gives none).
 *
 * Pure: reads the record, writes nothing.
 */
import {
  stoppingCrisesOf, rowStoppedBy, crisisMarkText, markedDescription, ordinaryTimesLine, STOPPED_WORD,
  rowShortOf, shortMarkText, SHORT_WORD,
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
 * The input this row's house is short of by the page's own gap line, or null (the leaf's second cause: services and
 * houses only).
 * @param {object | null | undefined} settlement @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row
 * @returns {string | null}
 */
export function shortOnPage(settlement, kind, row) {
  return kind === 'service' || kind === 'house' ? rowShortOf(settlement, kind, row) : null;
}

/**
 * The leaf's marks for this row, its crisis's then its input's ("Stopped by the siege.", "Short of grapes."), or null.
 * @param {object | null | undefined} settlement @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row
 * @returns {string | null}
 */
export function markOnPage(settlement, kind, row) {
  const marks = [crisisMarkText(settlement, stoppedOnPage(settlement, kind, row)), shortMarkText(shortOnPage(settlement, kind, row))].filter(Boolean);
  return marks.length ? marks.join(' ') : null;
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
 * The word after a name that prints no description ("stopped", "short", "stopped, short"), as the Institutions tab's
 * doors print it; null where the row is neither stopped nor short, or the leaf's door refuses the crisis's mark.
 * @param {object | null | undefined} settlement @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row
 * @returns {string | null}
 */
export function stoppedWordOnPage(settlement, kind, row) {
  const crisis = stoppedOnPage(settlement, kind, row);
  const words = [crisis && crisisMarkText(settlement, crisis) ? STOPPED_WORD[crisis] || null : null, shortOnPage(settlement, kind, row) ? SHORT_WORD : null].filter(Boolean);
  return words.length ? words.join(', ') : null;
}

/**
 * The leaf's one head line for a chapter whose rows these are, when at least one is marked (by a crisis or short of its
 * input); else null.
 * @param {object | null | undefined} settlement
 * @param {ReadonlyArray<readonly ['service' | 'house' | 'chain' | 'income', Record<string, unknown> | null | undefined]>} rows
 * @returns {string | null}
 */
export function ordinaryTimesOnPage(settlement, rows) {
  const marked = [];
  let shortMarked = false;
  for (const [kind, row] of rows) {
    const crisis = stoppedOnPage(settlement, kind, row);
    if (crisis && crisisMarkText(settlement, crisis)) marked.push(crisis);
    if (!shortMarked && shortOnPage(settlement, kind, row)) shortMarked = true;
  }
  return ordinaryTimesLine(marked, shortMarked);
}
