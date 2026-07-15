/**
 * institutionDisplay — shared display vocabulary for institution names.
 *
 * Institution names flow through the pipeline as the raw catalog keys (e.g.
 * "Thieves' guild chapter"). A handful of criminal-institution keys carry an
 * older "thieves' guild" vocabulary that the rest of the app has relabeled to
 * "Organized Crime". This module is the single place that maps those raw keys
 * to their user-facing labels, so the web Overview/Services tabs, the PDF
 * dossier, and the Viability safety profile all read the same.
 *
 * Keys are matched case-insensitively. A name with no relabel is returned
 * unchanged. Pure, no React/Zustand imports.
 */

// Raw catalog key (lowercased) -> user-facing display label.
export const CRIMINAL_INST_LABELS = Object.freeze({
  "thieves' guild chapter": 'Organized Crime (Chapter)',
  "thieves' guild (powerful)": 'Organized Crime (Powerful)',
  "assassins' guild": "Assassins' Guild",
  'multiple criminal factions': 'Multiple Criminal Factions',
  'black market': 'Black Market',
  'black market bazaar': 'Black Market Bazaar',
  'smuggling operation': 'Smuggling Operation',
  'smuggling network': 'Smuggling Network',
  'street gang': 'Street Gang',
  'front businesses': 'Front Businesses',
  'underground city': 'Underground City',
  'gambling den': 'Gambling Den',
  'gambling halls': 'Gambling Halls',
  'gambling district': 'Gambling District',
  'red light district': 'Red Light District',
});

/**
 * Map a raw institution name to its user-facing display label. Falls back to
 * the original name when no relabel applies.
 * @param {string} name
 * @returns {string}
 */
export function displayInstitutionName(name) {
  if (typeof name !== 'string' || !name) return name;
  return /** @type {Record<string, string>} */ (CRIMINAL_INST_LABELS)[name.toLowerCase()] || name;
}
