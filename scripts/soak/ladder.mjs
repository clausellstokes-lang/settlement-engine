/**
 * ladder.mjs — THE RUNG LADDER (SK-3; ODQ §141.3).
 *
 * Profiles run cheapest-first with gating: CERT-30-class clean-ish before century before
 * CENTURY-300. Each rung is FINDINGS-ONLY — a rung reports, it does not certify.
 *
 * ⛔ §141'S REFUSED-BY-NAME LIST IS ENFORCED HERE, NOT REMEMBERED. No shortened centuries,
 * no sampled ticks, no reduced seed grids on any official instrument. Every one of the
 * three has a named refusal below, because each is a plausible thing a hurried operator
 * would reach for and each thins the instrument the owner's §109 checkpoint depends on.
 *
 * ⛔ AT EVERY PHASE BOUNDARY THE FULL GRID RUNS REGARDLESS. The differential is an
 * accelerant BETWEEN boundaries, never a substitute AT one.
 */

export const RUNGS = Object.freeze([
  Object.freeze({ id: 'cert-30', years: 30, gatesOn: null }),
  Object.freeze({ id: 'century', years: 100, gatesOn: 'cert-30' }),
  Object.freeze({ id: 'century-300', years: 300, gatesOn: 'century' }),
]);

export const RUNG_IDS = Object.freeze(RUNGS.map((rung) => rung.id));

/**
 * The refusals §141 names, made executable. Each takes the SHAPE of the ask rather than a
 * flag name, so a differently-spelled version of the same thinning is still refused.
 */
export function ladderRefusals({ rung, years, sampledTicks = false, seedCount, fullSeedCount, atPhaseBoundary = false, differential = false }) {
  const row = RUNGS.find((entry) => entry.id === rung);
  const refusals = [];
  if (!row) return [`REFUSED: unknown rung "${rung}" — the ladder is a closed set (${RUNG_IDS.join(', ')})`];
  if (Number(years) < row.years) {
    refusals.push(
      `REFUSED: ${rung} asked for ${years} years against its ${row.years}. §141 refuses SHORTENED `
      + 'CENTURIES by name — a rung that ran short is a different instrument wearing the rung\'s label.',
    );
  }
  if (sampledTicks) {
    refusals.push('REFUSED: sampled ticks. §141 refuses tick sampling by name; the tick series IS the measurement.');
  }
  if (fullSeedCount != null && Number(seedCount) < Number(fullSeedCount)) {
    refusals.push(
      `REFUSED: ${seedCount} seeds against the grid's ${fullSeedCount}. §141 refuses REDUCED SEED `
      + 'GRIDS by name on any official instrument.',
    );
  }
  if (atPhaseBoundary && differential) {
    refusals.push(
      'REFUSED: a differential AT a phase boundary. The full grid runs at every boundary '
      + 'regardless — the differential is an accelerant between boundaries, never a substitute at one.',
    );
  }
  return refusals;
}

/**
 * Which rung runs next, given what is already clean. Returns null when the ladder is
 * complete. A rung whose gate is not clean does NOT run — that is the whole point of
 * cheapest-first.
 */
export function nextRung(cleanRungs = []) {
  for (const rung of RUNGS) {
    if (cleanRungs.includes(rung.id)) continue;
    if (rung.gatesOn && !cleanRungs.includes(rung.gatesOn)) return null;
    return rung;
  }
  return null;
}

/**
 * A rung's report is FINDINGS-ONLY. It carries no verdict, no property array and no
 * certification claim — those belong to the official instrument, and a rung that spoke
 * like one would be quoted like one.
 */
export function rungReport({ rung, tipSha, findings, observability, cells }) {
  return {
    kind: 'soak_rung_report',
    rung,
    tipSha: String(tipSha),
    findingsOnly: true,
    cells: Number(cells),
    findings,
    observability,
    // Stated on the artifact itself so no reader has to know the law to read the report.
    verdict: null,
    verdictWithheld: 'a rung is findings-only; verdicts belong to the full instrument (§141.3)',
  };
}
