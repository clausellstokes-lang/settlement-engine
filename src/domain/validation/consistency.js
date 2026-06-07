/**
 * domain/validation/consistency.js
 *
 * Display-consistency validator (feature doc §1b) — the trust gate. Detects
 * facts that contradict across the dossier so they can block a publish/export
 * or be logged for debugging.
 *
 * This is the display-layer sibling of domain/contradictions.js (which
 * surfaces narrative-worthy structural tensions); both share the record shape
 * { id, type, classification, description, references }. M0.1 ships the two
 * rules tied to the food/export spine; M1–M2 wire it into the publish/export
 * gates and add the remaining §1b rules.
 *
 * Pure, read-only.
 */

function record(type, description, { severity = 'block', references = [] } = {}) {
  return { id: `consistency.${type}`, type, classification: 'invalid', severity, description, references };
}

/**
 * Validate a settlement for cross-surface display contradictions.
 * Returns { blocking, warnings } — both arrays of contradiction records.
 */
export function validateDossier(settlement) {
  const blocking = [];
  const warnings = [];
  if (!settlement) return { blocking, warnings };

  // §1c — impossible food math: a real surplus/deficit while produced AND
  // needed both read zero. This is the dailyProduction/dailyNeed vs
  // production/need field mismatch that rendered "Produced 0 / Needed 0 /
  // Surplus +X" in the PDF.
  const fb = settlement?.economicViability?.metrics?.foodBalance;
  if (fb) {
    const produced  = Number(fb.dailyProduction) || 0;
    const needed    = Number(fb.dailyNeed) || 0;
    const magnitude = Math.max(Number(fb.surplus) || 0, Number(fb.deficit) || 0);
    if (magnitude > 0 && produced === 0 && needed === 0) {
      blocking.push(record('impossible_food_math',
        `Food balance reports ${Number(fb.surplus) > 0 ? 'a surplus' : 'a deficit'} of ${magnitude} while produced and needed are both zero.`));
    }
  }

  // §1d — export contradiction: one surface would report no exports while
  // another lists them. economicState.exports (legacy; read by the Current
  // State risk) disagrees with economicState.primaryExports (Economics).
  const eco = settlement?.economicState || {};
  const legacy  = Array.isArray(eco.exports) ? eco.exports.filter(Boolean) : [];
  const primary = Array.isArray(eco.primaryExports) ? eco.primaryExports.filter(Boolean) : [];
  if (legacy.length === 0 && primary.length > 0) {
    blocking.push(record('export_status_contradiction',
      `Export status would read "none" (economicState.exports is empty) while ${primary.length} export(s) are listed in primaryExports. Read exportPosture from the display model instead.`));
  }

  return { blocking, warnings };
}
