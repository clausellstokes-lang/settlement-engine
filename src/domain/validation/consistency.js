/**
 * domain/validation/consistency.js
 *
 * Display-consistency validator (feature doc §1b) — the trust gate. Detects
 * facts that contradict across the dossier so they can block a publish/export
 * or be logged for debugging.
 *
 * This is the display-layer sibling of domain/contradictions.js (which
 * surfaces narrative-worthy structural tensions); both share the record shape
 * { id, type, classification, description, references }. The first cut ships the
 * two rules tied to the food/export spine; later work wires it into the
 * publish/export gates and adds the remaining §1b rules.
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

  // §1f — viability is NOT a publish gate. A settlement may be intentionally
  // non-viable — a dying outpost, a doomed hold, an artist's deliberate
  // creation — and that is valid public content. So we never BLOCK on it; we
  // only surface a non-blocking warning when a "self-sufficient" verdict sits
  // next to a LARGE unmet deficit (>25% of need), and even then publishing is
  // the owner's call. (Small residual deficits are the baseline — most
  // settlements import some food and some people always go hungry.)
  const viabilitySummary = String(settlement?.economicViability?.summary || '');
  const need = Number(fb?.dailyNeed) || 0;
  const def = Number(fb?.deficit) || 0;
  if (/self-sufficient/i.test(viabilitySummary) && need > 0 && def / need > 0.25) {
    warnings.push(record('viability_contradicts_food',
      `Viability reads "self-sufficient" while ${Math.round((def / need) * 100)}% of the daily food need is unmet (deficit ${def} of ${need}).`,
      { severity: 'warn' }));
  }

  // (§1d export-status contradiction removed: the display model now reads
  // economicState.primaryExports everywhere, so an empty legacy exports[] beside
  // a populated primaryExports is the normal modern state, not a contradiction.)

  return { blocking, warnings };
}
