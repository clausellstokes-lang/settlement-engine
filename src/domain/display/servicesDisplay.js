/**
 * servicesDisplay — shared service-category knowledge: which categories a
 * settlement of a given tier is expected to offer, human labels, and the
 * "notable absences" derivation (expected-but-missing categories).
 *
 * Single source consumed by BOTH the web ServicesTab (via tabConstants re-export
 * of EXPECTED_SERVICES_BY_TIER) and the PDF services slice. The PDF previously
 * read a non-existent `settlement.notableAbsences` field (the web computes it),
 * so the dossier's Notable Absences block was always empty.
 */

// Expected service categories per tier. (Was J0 in tabConstants; moved here so
// screen + print derive absences from one map.)
export const EXPECTED_SERVICES_BY_TIER = Object.freeze({
  thorp:      ['food'],
  hamlet:     ['food', 'healing'],
  village:    ['food', 'healing', 'equipment'],
  town:       ['food', 'healing', 'equipment', 'information', 'lodging'],
  city:       ['food', 'healing', 'equipment', 'information', 'lodging', 'legal', 'transport'],
  metropolis: ['food', 'healing', 'equipment', 'information', 'lodging', 'legal', 'transport', 'entertainment'],
});

const SERVICE_LABELS = Object.freeze({
  lodging: 'Lodging', food: 'Food & Drink', equipment: 'Equipment',
  magic: 'Magical Services', information: 'Information', healing: 'Healing',
  transport: 'Transportation', legal: 'Legal & Financial',
  entertainment: 'Entertainment', employment: 'Employment', criminal: 'Criminal Services',
});

export const serviceLabel = (key) => SERVICE_LABELS[key] || key;

/**
 * Service categories a settlement of `tier` is expected to have but lacks.
 * Mirrors the web ServicesTab's `missing` computation. `availableServices` is
 * the settlement.availableServices map (category key -> array of services).
 * Returns [{ key, label }].
 */
export function deriveNotableAbsences(tier, availableServices) {
  const expected = EXPECTED_SERVICES_BY_TIER[tier] || [];
  const avail = availableServices || {};
  return expected
    .filter((k) => !(Array.isArray(avail[k]) && avail[k].length > 0))
    .map((k) => ({ key: k, label: serviceLabel(k) }));
}
