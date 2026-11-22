/**
 * certification/certificationManifest.js — THE COMMITTED CERTIFICATION MANIFEST
 * (VISION WAVE V-10). The durable "seed/config band → soak results" record every
 * certification surface reads.
 *
 * INERT-HONEST BY DESIGN: no soak has written a band yet, so `bands` is empty and
 * `generatedAt` is null. Every surface therefore reads PENDING ("the hundred-year
 * proving is scheduled") — the claims-parity law holds by construction because
 * there is nothing to over-claim.
 *
 * ── HOW THE OWNER LIGHTS IT (the write path) ──────────────────────────────────
 * When the maintained realm-scale runner completes, an operator may append a
 * validated band here:
 *   { bandId, presetId, status: 'certified', soak: { years, seedsTested,
 *     ticksAdvanced, properties: [<all required property keys>], runAt, buildHash,
 *     behavioralContractVersion, evidenceDigest, humanChronicleReviewDigest } }
 * and sets generatedAt. validateCertificationManifest MUST pass before commit
 * (the schema wall). A `measured` band records an honest partial result; a
 * `pending` band (soak:null) records an unproven config band explicitly.
 * Certification requires the 100-year release horizon. A 30-year useful-horizon
 * result and a 300-year research result remain measured evidence.
 *
 * Pure data. Imported ONLY by the lazy certification read/panel — never eager.
 */

import { CERTIFICATION_MANIFEST_VERSION } from './certificationSchema.js';

/** @type {import('./certificationSchema.js').CertificationManifest} */
export const WORLD_CERTIFICATION_MANIFEST = Object.freeze({
  manifestVersion: CERTIFICATION_MANIFEST_VERSION,
  generatedAt: null,
  // EMPTY until the owner's soak writes the first band (see header). Do NOT hand-
  // author a band here — a band exists only as the receipt of a real soak run.
  bands: Object.freeze([]),
});
