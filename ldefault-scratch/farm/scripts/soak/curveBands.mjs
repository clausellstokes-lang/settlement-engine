/**
 * curveBands.mjs — MACHINE-DIFFED CURVE BASELINES (SK-5; ODQ §143.3, §72.3/§110.3).
 *
 * ⭐ THIS IS THE MEMBER THAT MAKES `sk-b` DEPEND ON `tm-core`. The band set is enumerated
 * FROM tm-3's closed registry — `bandFamilies()` in scripts/telemetry/simMetricAggregate.mjs,
 * one family per `epoch: 'year'` row — and never hand-listed. A registry row with no band
 * family is a curve the harness would silently not watch, so it REDS.
 *
 * ⛔ THESE ARE HARNESS-SIDE REGRESSION INSTRUMENTS. Never engine tuning bands, never
 * `certificationManifest` entries, never anything under `src/`. §3h's band firewall is
 * untouched: nothing here signs, applies or adjusts a tuning band.
 *
 * ⛔⛔ BANDS FREEZE ONLY FROM THE FIRST CLEAN RUN OF THE FULL INSTRUMENT AT
 * BUILD-COMPLETE-DARK — clean meaning ZERO deterministic-class tripwires AND every
 * behavioral-contract property passing — and the freeze is a recorded, chair-signed act.
 * A rolling soak on a mid-build tip may NEVER freeze a band: pre-freeze rolling runs emit
 * curves marked PROVISIONAL. Tripwire verdicts bind; provisional curves inform; nothing
 * freezes. `freeze()` on a provisional receipt THROWS.
 *
 * ⛔ THE DECLARED-SHIFT LAW (SK.L5). A fix that legitimately moves a curve re-records its
 * band at the shifting train's own terminal, never silently, and the re-record is proven
 * THREE WAYS or refused: (1) the declared-shift table quoted in the re-record itself — the
 * table IS the declaration; (2) a KEY-BY-KEY band diff proving ZERO undeclared curves
 * moved, which is the arm that stops a bad fix hiding wide damage behind one declared
 * shift, and which is never satisfied by the capture's own exit 0; (3) the chair's CAS.
 *
 * ⛔ A RED HARNESS OR A RED RATCHET MAKES THE BAND CAPSULE UNWRITABLE BY DESIGN. Clear the
 * reds; never invent the figure.
 */

import { bandFamilies } from '../telemetry/simMetricAggregate.mjs';

/**
 * ⭐ THE tm-3 SEAM, CONSUMED IN CODE RATHER THAN IN A TEST. The band set is whatever the
 * registry's `epoch: 'year'` rows say it is — enumerated at runtime, never hand-listed, so
 * a row added to tm's registry automatically becomes a curve this harness watches and a
 * row removed stops being one. Wiring this only in the test would leave the production
 * path free to hand-list and the pin free to agree with itself.
 *
 * ⚠ Both directories are on the TELEMETRY side of the engine/telemetry wall, so this edge
 * is lawful: Arm B forbids `scripts/soak/**` importing ENGINE specifiers, not sibling
 * telemetry modules.
 */
export function registryBandFamilies() {
  return bandFamilies();
}

/**
 * ⚠ UNSOAKED (§43). Band WIDTH is `observed ± k·σ` over the first clean instrument's own
 * cells, and both `k` and the aggregation await that run's existence. Recorded here with
 * the reasoning so the freeze is a signature rather than an improvisation: a band tighter
 * than 2σ manufactures false findings on a legitimately stochastic grid, and one wider
 * than 3σ stops detecting the regressions §143.3 exists to detect. CHAIR-SIGNED AT THE
 * FREEZE, not at promotion.
 */
export const BAND_WIDTH_K = Object.freeze({ min: 2, max: 3, default: 2.5, unsoaked: true });

export const FREEZE_PRECONDITIONS = Object.freeze([
  'zero DETERMINISTIC-class tripwire firings',
  'every behavioral-contract property passing',
  'the FULL instrument, at build-complete-dark',
  'not a rolling run, and not a restored run',
]);

/** Which preconditions a receipt fails. Empty means the freeze is eligible. */
export function freezeBlockers(receipt) {
  const blockers = [];
  if (receipt?.provisional === true) {
    blockers.push('receipt is PROVISIONAL — a rolling soak on a mid-build tip may never freeze a band');
  }
  if (receipt?.rolling === true) blockers.push('a rolling run is additive and never freezes');
  if (receipt?.restored === true) blockers.push('a restored run computes no official figure');
  if (receipt?.fullInstrument !== true) blockers.push('not the FULL instrument at build-complete-dark');
  if ((receipt?.deterministicFirings ?? 1) !== 0) blockers.push('deterministic-class tripwires fired — the run is not clean');
  if (receipt?.behavioralPropertiesPassing !== true) blockers.push('a behavioral-contract property did not pass');
  if (receipt?.ratchetsRed === true || receipt?.harnessRed === true) {
    blockers.push('a red harness or red ratchet makes the band capsule UNWRITABLE BY DESIGN — clear the reds, never invent the figure');
  }
  return blockers;
}

const mean = (list) => (list.length ? list.reduce((sum, value) => sum + value, 0) / list.length : 0);
const stdDev = (list) => {
  if (list.length < 2) return 0;
  const mu = mean(list);
  return Math.sqrt(list.reduce((sum, value) => sum + ((value - mu) ** 2), 0) / (list.length - 1));
};

/**
 * Freeze the bands. THROWS on any blocker — an unfreezeable receipt must not yield a
 * half-written capsule that a later reader mistakes for a baseline.
 *
 * @param {{families: string[], series: Record<string, number[]>, receipt: object, k?: number}} input
 */
export function freeze({ families, series, receipt, k = BAND_WIDTH_K.default }) {
  const blockers = freezeBlockers(receipt);
  if (blockers.length) {
    throw new Error(`REFUSED to freeze curve bands:\n  ${blockers.join('\n  ')}`);
  }
  // ⛔ THE FAMILY SET COMES FROM THE REGISTRY. A family with no observed series is a curve
  // nobody is watching, and it reds rather than being quietly dropped from the capsule.
  const missing = families.filter((family) => !Array.isArray(series[family]));
  if (missing.length) {
    throw new Error(`REFUSED to freeze curve bands: no observed series for ${missing.join(', ')} — a registry row with no band family is a gap the harness would silently not watch`);
  }
  const bands = {};
  for (const family of families) {
    const observed = series[family].filter((value) => Number.isFinite(value));
    const mu = mean(observed);
    const sigma = stdDev(observed);
    bands[family] = {
      observations: observed.length,
      mean: mu,
      sigma,
      k,
      low: mu - (k * sigma),
      high: mu + (k * sigma),
    };
  }
  return {
    kind: 'soak_curve_band_capsule',
    frozenFrom: { sourceSha: receipt.sourceSha, profile: receipt.profile },
    k,
    kUnsoaked: BAND_WIDTH_K.unsoaked,
    families: [...families],
    bands,
  };
}

/** A pre-freeze rolling curve. It INFORMS; it never binds and it never freezes. */
export function provisionalCurves({ families, series, receipt }) {
  return {
    kind: 'soak_curve_report',
    provisional: true,
    provisionalReason: 'pre-freeze rolling run — tripwire verdicts bind, provisional curves inform, nothing freezes',
    sourceSha: receipt?.sourceSha ?? null,
    families: [...families],
    series: Object.fromEntries(families.map((family) => [family, series[family] || []])),
  };
}

/**
 * ⛔⛔ THE THREE-PART RE-RECORD PROOF. The key-by-key diff is the arm that matters: a fix
 * may declare ONE shifted curve and quietly move six others, and only a diff over EVERY
 * key can see that. A capture's own exit 0 proves nothing — it is the same instrument
 * agreeing with itself.
 *
 * @param {{before: object, after: object, declared: string[], chairCas: boolean}} input
 * @returns {{accepted: boolean, refusals: string[], moved: string[], undeclared: string[], added: string[], removed: string[]}}
 */
export function verifyDeclaredShift({ before, after, declared, chairCas }) {
  const beforeKeys = Object.keys(before?.bands || {}).sort();
  const afterKeys = Object.keys(after?.bands || {}).sort();
  const added = afterKeys.filter((key) => !beforeKeys.includes(key));
  const removed = beforeKeys.filter((key) => !afterKeys.includes(key));
  const moved = afterKeys.filter((key) => beforeKeys.includes(key)
    && JSON.stringify(before.bands[key]) !== JSON.stringify(after.bands[key]));
  const undeclared = moved.filter((key) => !(declared || []).includes(key));
  const refusals = [];
  if (!Array.isArray(declared) || declared.length === 0) {
    refusals.push('REFUSED: no declared-shift table. The table IS the declaration — a re-record without one is a silent re-record.');
  }
  if (undeclared.length) {
    refusals.push(`REFUSED: ${undeclared.length} UNDECLARED curve(s) moved: ${undeclared.join(', ')}. A key-by-key diff is what stops a bad fix hiding wide damage behind one declared shift.`);
  }
  if (added.length || removed.length) {
    refusals.push(`REFUSED: the band key set changed (added ${added.join(', ') || 'none'}; removed ${removed.join(', ') || 'none'}). A re-record is proven by ZERO keys added and ZERO removed.`);
  }
  const declaredButStill = (declared || []).filter((key) => beforeKeys.includes(key) && !moved.includes(key));
  if (declaredButStill.length) {
    refusals.push(`REFUSED: declared shift(s) that did not move: ${declaredButStill.join(', ')}. A declaration nothing happened to is a declaration nobody checked.`);
  }
  if (!chairCas) refusals.push('REFUSED: no chair CAS on the re-record.');
  return { accepted: refusals.length === 0, refusals, moved, undeclared, added, removed };
}
