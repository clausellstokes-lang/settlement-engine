/**
 * pdf/lib/cultureOnPage.js — THE CULTURE BLOCK ON THE PDF AND IN THE FOUNDRY JOURNAL (EXPORTS-B24 · B2, 2026-11-14; the
 * chair's ruling on EXPORTS-MEASURE-1 B2; the law: ONE READER FOR ONE FACT ON EVERY SURFACE; A SURFACE WITH NO ROOM
 * PRINTS LESS, NEVER SOMETHING ELSE).
 *
 * The PDF's CULTURAL IDENTITY printed the culture profile's raw fields in the present tense of the place (a thorp of
 * eleven: "A ritual plaza at the centre, tribute coming in, and waterworks and gardens around it"), and the journal
 * its "Cultural notes" (the profile's socialTexture + builtForm). The ruling, four parts, one cause:
 *   (i)   the scope line prints through the tab's reader (`settlementQuickGuide.js :: cultureScopeLine`, the Overview's
 *         identity line), never the profile's raw `scope` (the PDF's chapter calls it: the journal prints no scope line,
 *         so this module leaves that reader out of the journal's closure);
 *   (ii)  the six raw rows (Built form, Civic pattern, Exchange, Sacred life, Defense, Social texture) and the
 *         GENERATED cultural notes print only in a town or larger (quarters, guilds and bazaars belong to a town or
 *         larger): a thorp, a hamlet and a village print the scope line, Foodways and Architecture, no more;
 *   (iii) there, each row is held to its own declarations against the whole record (`declarationAdmits`, as the
 *         Architecture row already is: `cultureProfiles.js :: architecturalDetailRefused`): a row that declares
 *         `ruler: lord` is not printed under an Arcane Council; the generated notes print only where both their rows do;
 *   (iv)  what the user wrote always prints: notes that are not the generated default print whole, at every size.
 *
 * Display only: the record is not touched. Pure.
 * @enforced-by tests/pdf/cultureBlockTwoSurfaces.test.jsx
 */
import { CULTURE_PROFILES, culturalNotesFor, resolveCultureProfileKey } from '../../data/cultureProfiles.js';
import { declarationAdmits, declarationOf } from '../../domain/facts/factVocabulary.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { textOf } from '../../domain/facts/textOf.js';

/** The tiers that print no raw culture row (ruling (ii)); `settlementQuickGuide.js`'s small tiers. */
const SMALL_TIERS = new Set(['thorp', 'hamlet', 'village']);

/** The six raw rows, in the PDF's order: [label, the identity's field, the profile's list]. */
export const RAW_CULTURE_ROWS = Object.freeze(/** @type {const} */ ([
  ['Built form', 'builtForm'],
  ['Civic pattern', 'civicPattern'],
  ['Exchange', 'exchangePattern'],
  ['Sacred life', 'sacredLife'],
  ['Defense', 'defensePattern'],
  ['Social texture', 'socialTexture'],
]));

/** @param {unknown} v */
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * The profile row a materialized text was drawn from, or undefined (an older save, a hand-built identity).
 * @param {string} profileKey @param {string} field @param {string} text
 */
const rowOf = (profileKey, field, text) => {
  const list = /** @type {Record<string, unknown>} */ (CULTURE_PROFILES)[profileKey];
  const rows = /** @type {unknown[]} */ ((/** @type {any} */ (list))?.[field] || []);
  return rows.find((d) => clean(textOf(/** @type {any} */ (d))) === text);
};

/**
 * Whether one materialized row passes its row's declaration against the record ('unknown' where no profile row is
 * found: printed as before, the ruling's check reads what is declared).
 * @param {any} settlement @param {string} profileKey @param {string} field @param {string} text @param {() => any} facts
 * @returns {boolean | 'unknown'}
 */
const rowAdmitted = (settlement, profileKey, field, text, facts) => {
  const row = rowOf(profileKey, field, text);
  if (row === undefined) return 'unknown';
  return declarationAdmits(declarationOf(/** @type {any} */ (row)), facts(), { crisisScoped: false }).admitted;
};

/**
 * One raw field of the culture, held to its declarations (ruling (iii)). A blend ('mixed') is two profiles' rows
 * joined by a space: each half is held to its own row; either refused, the field prints nothing.
 * @param {any} settlement @param {any} culture @param {string} field @param {() => any} facts
 * @returns {string | null}
 */
function rawRowShown(settlement, culture, field, facts) {
  const text = clean(culture?.[field]);
  if (!text) return null;
  const key = resolveCultureProfileKey(culture?.key || settlement?.config?.culture || 'germanic');
  if (key === 'mixed') {
    const [a, b] = Array.isArray(culture?.sourceKeys) ? culture.sourceKeys.map((/** @type {unknown} */ k) => resolveCultureProfileKey(k)) : [];
    if (!a || !b) return text;
    for (const d of /** @type {unknown[]} */ ((/** @type {any} */ (CULTURE_PROFILES))[a]?.[field] || [])) {
      const first = clean(textOf(/** @type {any} */ (d)));
      if (!first || !text.startsWith(`${first} `)) continue;
      const second = text.slice(first.length + 1).trim();
      const okA = rowAdmitted(settlement, a, field, first, facts);
      const okB = rowAdmitted(settlement, b, field, second, facts);
      return okA === false || okB === false ? null : text;
    }
    return text;
  }
  return rowAdmitted(settlement, key, field, text, facts) === false ? null : text;
}

/**
 * The culture block's raw rows and notes as the PDF's CULTURAL IDENTITY and the journal's "Cultural notes" print them.
 * @param {any} settlement the record
 * @param {unknown} [notes] the notes box's text as the view model holds it (`vm.identity.anchor.culturalNotes`); defaults
 *   to the record's `culturalNotes`
 * @returns {{ rows: Array<[string, string]>, notes: string | null, notesAuthored: boolean }}
 */
export function cultureOnPage(settlement, notes = settlement?.culturalNotes) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const culture = s.culturalIdentity || null;
  const small = SMALL_TIERS.has(clean(s.tier).toLowerCase());
  /** @type {any} */ let factsMemo = null;
  const facts = () => (factsMemo ??= factsOf(s));
  /** @type {Record<string, string | null>} */ const shown = {};
  if (culture && !small) for (const [, field] of RAW_CULTURE_ROWS) shown[field] = rawRowShown(s, culture, field, facts);
  const rows = /** @type {Array<[string, string]>} */ (RAW_CULTURE_ROWS
    .map(([label, field]) => [label, shown[field] || null])
    .filter(([, v]) => v));
  const text = clean(notes);
  const generated = culture ? clean(culturalNotesFor(culture)) : '';
  const notesAuthored = !!text && text !== generated;
  // The generated default is the profile's socialTexture + builtForm: it prints where both of its rows print (ii, iii).
  const notesShown = !text ? null
    : notesAuthored ? text
      : (!small && shown.socialTexture && shown.builtForm ? text : null);
  return { rows, notes: notesShown, notesAuthored };
}
