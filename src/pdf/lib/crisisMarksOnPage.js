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
 * Institutions tabs print them. A chain takes no second cause (the leaf gives none).
 *
 * LEFT-PDF L1 (BRIEF-LEFT, the sixth chair, 2026-11-17; vetoable by the owner): AN INCOME SHARE IS MARKED AS THE ECONOMICS
 * TAB MARKS IT. The tab marks a share by its crisis (`economicsCrisisMarks.js :: incomeKindShown`: the leaf's kind, or the
 * siege's partial mark where the chain of the share's name prints "impaired" by the siege) AND by its houses short
 * (`crisisStoppedRow.js :: incomeShortOf`), as `incomeMarkShown` joins them; the PDF and the journal printed the leaf's
 * crisis half alone ("Iron & Metalwork" bare beside the tab's "Short of iron.": 29 towns of the census's 720 at
 * e0242a12a). `stoppedOnPage` and `shortOnPage` read those two halves for kind 'income', so `markOnPage`,
 * `stoppedWordOnPage` and `ordinaryTimesOnPage` print the tab's mark, its word and its head line.
 * PDF-2 item 8 (BRIEF-BAR8, 2026-11-17): `incomeMarkOnPage` (the tab's `incomeMarkShown`, exported with no caller) is gone;
 * the PDF's row reads `incomeDescShown` and the journal reads `stoppedOnPage` and `shortOnPage`, the same two halves.
 *
 * PDF-2 items 1, 5 and 6 (BRIEF-BAR8, the sixth chair, 2026-11-17; vetoable by the owner): A PDF CHAIN CARD AND THE
 * JOURNAL'S CHAIN ROW READ THE CHAIN THE TAB'S CARD RENDERS. The Economics tab's card is
 * `chainCardUnderSiege(town, record, chainAsShown(record, town))` (`EconomicsTab.jsx :: chains`); the PDF's Services card
 * read the stored chain and its flow row and the journal `chainAsShown` alone, so a card under a crisis that marks every
 * house of the chain said "Operational" or "Running" where the tab says "Impaired", listed outputs the tab's refused card
 * withholds, and named a source house the tab's card leaves off a spent ground (`chainHouses.js :: chainHousesOf` handed
 * the card: ruling BR10 (3), amended). `chainCardOnPage` is that one reading, with the tab's chip word.
 *
 * Pure: reads the record, writes nothing.
 */
import {
  stoppingCrisesOf, rowStoppedBy, crisisMarkText, markedDescription, ordinaryTimesLine, STOPPED_WORD,
  rowShortOf, shortMarkText, SHORT_WORD, isVentureMark, incomeShortOf,
} from '../../domain/display/crisisStoppedRow.js';
import { incomeKindShown, chainCardUnderSiege } from '../../domain/display/economicsCrisisMarks.js'; // LEFT-PDF L1: the tab's income mark; PDF-2 items 5, 6: the tab's chain card
import { chainAsShown } from '../../domain/display/chainStateShown.js';
import { chainStateOnPage } from './chainStateOnPage.js';

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
  if (kind === 'income') return crises.length ? incomeKindShown(settlement, row, crises) : null; // LEFT-PDF L1: the tab's crisis half
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
  if (kind === 'income') return incomeShortOf(settlement, row, crisesOf(settlement)); // LEFT-PDF L1: the tab's short half
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
 * PDF-2 items 5 and 6: the chain the Economics tab's card renders (`EconomicsTab.jsx :: chains`: the state a crisis left,
 * then the card's word under a crisis that marks its houses), and the word its chip prints ('' where the tab prints no
 * chip; `chainStateOnPage.js :: CHAIN_STATE_WORDS`). Without a town, the chain as given. Display only: the record's chain
 * is not touched.
 * @template {{ status?: unknown }} C
 * @param {C} chain one of the record's chains, as the record holds it
 * @param {object | null | undefined} town the settlement record
 * @returns {{ chain: C, key: string, word: string }}
 */
export function chainCardOnPage(chain, town) {
  const shown = town ? chainCardUnderSiege(town, /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (chain)), chainAsShown(chain, town)) : chain;
  return chainStateOnPage(shown, null);
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
  const words = [crisis && crisisMarkText(settlement, crisis) ? STOPPED_WORD[crisis] || null : null, shortOnPage(settlement, kind, row) && !isVentureMark(shortOnPage(settlement, kind, row)) ? SHORT_WORD : null].filter(Boolean); // BIRTH-3: none beside a failed venture's mark
  return words.length ? words.join(', ') : null;
}

/**
 * The leaf's one head line for a chapter whose rows these are, when at least one is marked (by a crisis or short of its
 * input); else null.
 * @param {object | null | undefined} settlement
 * @param {ReadonlyArray<readonly ['service' | 'house' | 'chain' | 'income', Record<string, unknown> | null | undefined]>} rows
 * @param {{ readings?: boolean }} [options] `readings` (default true): hand the leaf the rows' short readings (the Services and
 *   Institutions tabs' form); false: a boolean (the Economics tab's form)
 * @returns {string | null}
 */
export function ordinaryTimesOnPage(settlement, rows, { readings = true } = {}) {
  const marked = [];
  /** @type {Array<string | null>} */ const shorts = [];
  for (const [kind, row] of rows) {
    const crisis = stoppedOnPage(settlement, kind, row);
    if (crisis && crisisMarkText(settlement, crisis)) marked.push(crisis);
    shorts.push(shortOnPage(settlement, kind, row));
  }
  // PDF-2b (BRIEF-BAR8 item 3, LEFT-MARKS M3; the chair, 2026-11-18): the rows' short readings, as the Services and
  // Institutions tabs hand them (`ServicesTab.jsx`, `InstitutionsTab.jsx`: a failed venture's mark is no short mark, so the
  // sentence no longer prints over a venture alone); the Economics chapter hands the boolean its tab hands
  // (`economicsCrisisMarks.js :: econOrdinaryTimesLine`), by `{ readings: false }`.
  return ordinaryTimesLine(marked, readings ? shorts : shorts.some((m) => m !== null));
}
