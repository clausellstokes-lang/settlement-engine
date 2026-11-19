/**
 * domain/display/impairedListShown.js — THE OUTLOOK'S LIST OF HOUSES "critically impaired by siege", AS THE TAB AND THE PDF
 * PRINT IT (BAR7-CARDS item 3, BRIEF-BAR7, 2026-11-17; vetoable by the owner).
 *
 * BAR6-RECORD (d) (LAW 8's 8e.outlook, the chair's direction of BRIEF-BAR6): THE OUTLOOK'S LIST AND THE HOUSES' CARDS READ
 * ONE READING. The record's list (`viability.js`, from the trade dependencies) named a house its own card prints bare
 * ("Mercenary quarter", bar0-city-under_siege+famine-rand-34); the list prints only the houses the mark leaf marks
 * (`crisisStoppedRow.js :: rowMarkText`), with its count, and no line where it marks none. The record keeps its list.
 *
 * BAR7-CARDS item 3 (the seam's PDF seat left it by name, `BAR6-SEAM-PDF-HANDBACK.md`, LEFT item 2): the helper stood
 * private in `ViabilityTab.jsx`, and the PDF's `viewModel.js :: viabilitySlice` printed the record's raw list, so the two
 * named different houses (16 towns of the 150, 11 of the 720). It is moved here unchanged, the tab imports it, the PDF
 * reads it: one reading. Display only: no draw, no stored byte.
 */
import { institutionDisplayName } from './institutionDisplayName.js';
import { rowMarkText } from './crisisStoppedRow.js';

/**
 * A stress-effect issue of the record (`economicViability.issues`), the shape `validationOnPage.js :: stressEffectsOf` returns:
 * its description a string, or an object carrying the short and the long text.
 * @typedef {import('./validationOnPage.js').ViabilityIssue} StressEffect
 */
/** A row of the record's roster, read by name. @typedef {{ name?: unknown, [key: string]: unknown }} RosterRow */
/** The settlement record, as far as this leaf reads it. @typedef {{ institutions?: RosterRow[] | null, [key: string]: unknown }} SettlementRecord */

/** The record's line, as `viability.js` writes it. */
export const IMPAIRED_LIST = /^(\d+) institutions? critically impaired by siege: (.+)\.$/;

/**
 * A stress-effect issue as the page prints it: the list line keeps only the houses the mark leaf marks (a name the roster
 * does not hold is kept), recounted; null where it keeps none; every other issue unchanged.
 * @param {StressEffect | null | undefined} item a stress-effect issue @param {SettlementRecord | null | undefined} s the settlement record
 * @returns {StressEffect | null | undefined}
 */
export function impairedListMarked(item, s) {
  const desc = item?.description;
  const d = typeof desc === 'object' && desc ? (desc.short || desc.text) : desc;
  const m = typeof d === 'string' ? IMPAIRED_LIST.exec(d) : null;
  if (!m) return item;
  const houses = Array.isArray(s?.institutions) ? s.institutions : [];
  const kept = m[2].split(', ').filter((name) => {
    const house = houses.find((h) => h?.name === name || institutionDisplayName(h?.name) === name);
    return !house || !!rowMarkText(s, 'house', house);
  });
  if (!kept.length) return null;
  if (kept.length === m[2].split(', ').length) return item;
  return { ...item, description: `${kept.length} institution${kept.length > 1 ? 's' : ''} critically impaired by siege: ${kept.join(', ')}.` };
}

/**
 * The stress effects the Outlook prints, in the record's order: `stressEffectsOf` (the record's list), each read by
 * `impairedListMarked`. The tab and the PDF both print this.
 * @param {ReadonlyArray<StressEffect> | null | undefined} effects the record's stress effects (`validationOnPage.js :: stressEffectsOf`)
 * @param {SettlementRecord | null | undefined} s
 * @returns {StressEffect[]}
 */
export function stressEffectsShown(effects, s) {
  /** @type {StressEffect[]} */ const out = [];
  for (const item of Array.isArray(effects) ? effects : []) {
    const shown = impairedListMarked(item, s);
    if (shown) out.push(shown);
  }
  return out;
}
