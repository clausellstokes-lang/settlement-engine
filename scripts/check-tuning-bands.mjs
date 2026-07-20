/**
 * check-tuning-bands.mjs — schema-guard the R-15 TUNING-BAND MANIFEST
 * (src/domain/tuning/proposedSoakBands.js). Wired into `npm run check`.
 *
 * WHY
 *   The soak proves the world against a committed set of PROPOSED distribution bands.
 *   A malformed band (a flipped min/max, a missing governing constant, a band silently
 *   promoted out of 'PROPOSED', a duplicate metric) would corrupt the soak's diagnosis
 *   or quietly assert a fact the owner never ratified. This gate makes the manifest's
 *   integrity a build invariant rather than trust.
 *
 * WHAT (dependency-free — imports only the manifest module; no pg driver, no fs):
 *   - assertValidSoakBands: every band has a known coupling, a finite min < max, a
 *     non-empty constant list, a rationale, and status EXACTLY 'PROPOSED'; no duplicate
 *     metric.
 *   - envelope projection sanity: toEnvelopes() yields one { metric, min, max } per band
 *     (so the manifest can feed runWeeklyTuningJob unchanged).
 *   - the PROPOSED law: NOTHING here may ship pre-ratified.
 *
 *   --json prints the manifest as JSON to stdout (the machine-readable emit) and exits.
 *
 * Exit 0 = valid. Exit 1 = a malformed band (message names the offending metric).
 */

import { fileURLToPath } from 'node:url';

import {
  PROPOSED_SOAK_BANDS,
  assertValidSoakBands,
  toEnvelopes,
  SOAK_BAND_MANIFEST_VERSION,
} from '../src/domain/tuning/proposedSoakBands.js';

/** Run every manifest invariant. Throws with a metric-named message on the first failure. */
export function checkManifest() {
  assertValidSoakBands(PROPOSED_SOAK_BANDS);

  // The PROPOSED law, asserted independently of validateSoakBand so a future relaxation
  // of the validator cannot silently let a pre-ratified band through this gate.
  const promoted = PROPOSED_SOAK_BANDS.filter((b) => b.status !== 'PROPOSED');
  if (promoted.length) {
    throw new Error(
      `[check-tuning-bands] ${promoted.length} band(s) are not 'PROPOSED': ` +
      `${promoted.map((b) => b.metric).join(', ')}. Every soak band is owner-vetoable and ships PROPOSED.`,
    );
  }

  // Envelope projection must be lossless (one envelope per band, min < max preserved).
  const envelopes = toEnvelopes(PROPOSED_SOAK_BANDS);
  if (envelopes.length !== PROPOSED_SOAK_BANDS.length) {
    throw new Error('[check-tuning-bands] envelope projection dropped or duplicated a band');
  }
  for (const env of envelopes) {
    if (!(Number.isFinite(env.min) && Number.isFinite(env.max) && env.min < env.max)) {
      throw new Error(`[check-tuning-bands] envelope for '${env.metric}' is not a valid [min, max]`);
    }
  }
  return { bandCount: PROPOSED_SOAK_BANDS.length, version: SOAK_BAND_MANIFEST_VERSION };
}

function main() {
  if (process.argv.includes('--json')) {
    process.stdout.write(JSON.stringify({ version: SOAK_BAND_MANIFEST_VERSION, bands: PROPOSED_SOAK_BANDS }, null, 2) + '\n');
    return;
  }
  try {
    const { bandCount, version } = checkManifest();
    console.log(`[check-tuning-bands] manifest v${version} OK: ${bandCount} proposed soak bands, all valid.`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

// Run only when invoked as a script (the importable helper stays side-effect-free).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
