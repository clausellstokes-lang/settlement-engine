/**
 * rolling.mjs — THE ROLLING-SOAK PROTOCOL (SK-7; ODQ §143.1, §145.2, §146.3).
 *
 * Per family boundary: archive the newly exposed tip, run a CERT-30-class pass on the SK-1
 * pool with SK-4's reduced pairwise rows, SK-2A's tripwires armed, and send a
 * findings-only report to the chair.
 *
 * ⛔ CADENCE, NOT CHURN: ONE rolling run per exposure. A superseded run is CANCELLED, and
 * its partial results are marked SUPERSEDED and never merge into findings or density
 * (SK-6's rule — a partial run has completed only the sensitive head).
 *
 * ⛔ ROLLING RUNS ARE ADDITIVE. No rolling result ever substitutes for any rung, boundary
 * or official instrument (§141's refused-by-name list). The report says so on its face.
 *
 * ⛔ EVERY ROLLING CELL ATTACHES THE DARK CONTROL. A finding with no control row is not a
 * finding — it is an observation about a configuration nobody characterised.
 *
 * ⛔ THE DISPATCH GATE (§145.2 / §146.3): nothing soaks before tm+sk lands, and the first
 * rolling run begins at the next family exposure AFTER that landing. Because this family
 * IS tm+sk, it does not fire at this family's own exposure.
 */

export const ROLLING_PROFILE = 'cert-30';

/**
 * May a rolling run dispatch at this exposure? The gate is stated as data so it cannot be
 * satisfied by an operator's recollection of the rule.
 */
export function dispatchRefusals({ tmSkLanded, exposureIsTmSkOwn, fableAuditPassed }) {
  const refusals = [];
  if (!fableAuditPassed) {
    refusals.push('REFUSED: the §145.2 soak-process audit has not passed. No soak of any kind runs before it.');
  }
  if (!tmSkLanded) {
    refusals.push('REFUSED: tm+sk has not landed. Nothing soaks before the harness itself exists (§145.2).');
  }
  if (exposureIsTmSkOwn) {
    refusals.push(
      'REFUSED: this is tm+sk\'s OWN exposure. §146.3 fires the first rolling run at the NEXT '
      + 'family exposure AFTER tm+sk lands, and this family IS tm+sk.',
    );
  }
  return refusals;
}

/**
 * A findings-only report. The header carries the ARCHIVED TIP SHA it measured — archive
 * drift is lawful ONLY when named — and, when superseded, the superseding sha.
 */
export function rollingReport({
  archivedTipSha, supersededBy = null, cells, findings, observability, controlsAttached,
}) {
  const orphanFindings = (findings || []).filter((finding) => !controlsAttached.includes(finding.cellKey));
  return {
    kind: 'soak_rolling_report',
    profile: ROLLING_PROFILE,
    // The sha it MEASURED, not the sha that happens to be current when it is read.
    archivedTipSha: String(archivedTipSha),
    ...(supersededBy ? { superseded: true, supersededBy: String(supersededBy) } : {}),
    findingsOnly: true,
    additive: true,
    additiveNote: 'a rolling result never substitutes for any rung, boundary or official instrument (§141)',
    cells: Number(cells),
    findings: supersededBy ? [] : findings,
    observability: supersededBy ? [] : observability,
    // ⛔ A FINDING WITH NO CONTROL ROW IS NOT A FINDING. Reported rather than silently
    // dropped, so a missing control is visible as a defect in the run.
    orphanFindings: orphanFindings.map((finding) => finding.cellKey),
    ...(supersededBy
      ? { partialResultsWithheld: 'a superseded run\'s partial results never merge into findings or density' }
      : {}),
  };
}

/**
 * What a superseded run contributes: nothing. Returned explicitly so a caller cannot get
 * "some of it" by accident.
 */
export function supersededContribution() {
  return { findings: [], density: null, credited: false, status: 'superseded' };
}
