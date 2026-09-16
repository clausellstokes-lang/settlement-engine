/**
 * domain/criminalOpRole.js — THE CRIMINAL OPERATION'S ECONOMIC ROLE, as a classifier.
 *
 * WHY THIS IS ITS OWN LEAF. This function used to live in
 * `domain/display/defenseDisplay.js`, which is 19.6 KB and imports `threatAssessment.js`
 * behind it — and `defenseDisplay` never called it. It was a passenger there, and it was in
 * the wrong LAYER before it was a byte problem: mapping an operation's name to its economic
 * role is a CLASSIFICATION, not a rendering decision. Two surfaces already read it (the
 * economics tab and the PDF body slices) and a third (the power desk, DS-POW-6) needs it.
 *
 * ⛔ THE MEASURED REASON IT MOVED, so nobody helpfully folds it back. `EconomicsTab.jsx`
 * imported `criminalOpEcon` and NOTHING ELSE from `defenseDisplay`, so the economics tab's
 * chunk carried the whole defense display module — plus its `threatAssessment` import — to
 * get an eight-line string map. The first-paint closure budget has ~504 B of headroom, so a
 * module of that size entering a chunk by accident is not a trade-off, it is a breach.
 * Keeping this leaf PURE — no imports, no state, no clock — is what makes it free to reach
 * from anywhere.
 *
 * ⚠ THE VOCABULARY IS A CONTRACT, NOT A DETAIL. These seven strings are the exact pool keys
 * `DS-POW-6` is written against (`operation role <value>`, with the fallback spelled
 * `criminal revenue stream (unclassified)` in the corpus). Renaming a value here silently
 * darkens a corpus pool, so the desk asserts the mapping rather than trusting it.
 *
 * PURE HEADLESS LEAF: no imports.
 */

/**
 * Per-criminal-operation economic role (Economics-tab voice). Short label.
 *
 * Matched by substring on the operation NAME, which is correct here and is not the
 * first-word rule the stability ladder needs: these are open-vocabulary operation names
 * ("Black Market Ring", "Smuggling Operation") where the classifying word can sit anywhere,
 * and there is no negation form for a substring to fall into.
 *
 * @param {string | null | undefined} name
 * @returns {string}
 */
export function criminalOpEcon(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('black market'))   return 'parallel marketplace';
  if (n.includes('smuggling'))      return 'duty evasion';
  if (n.includes('gambling'))       return 'unlicensed revenue';
  if (n.includes('front business')) return 'money laundering';
  if (n.includes('fence'))          return 'stolen goods market';
  if (n.includes('thieves'))        return 'protection + extraction';
  return 'criminal revenue stream';
}

/**
 * Every role the classifier can emit, so a consumer's table can be pinned TOTAL rather than
 * hand-listed beside it. The fallback is last, and is the one a caller must map to the
 * corpus's `(unclassified)` spelling.
 * @type {ReadonlyArray<string>}
 */
export const CRIMINAL_OP_ROLES = Object.freeze([
  'parallel marketplace',
  'duty evasion',
  'unlicensed revenue',
  'money laundering',
  'stolen goods market',
  'protection + extraction',
  'criminal revenue stream',
]);
