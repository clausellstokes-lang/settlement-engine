/**
 * certification/certificationRead.js — THE WORLD CERTIFICATION VIEW MODEL
 * (VISION WAVE V-10). The pure read that turns (manifest, world band) into exactly
 * what the panel/badge render — so the claims-parity law is testable on a pure
 * function, not only on the DOM.
 *
 * THE CLAIMS-PARITY CONTRACT (pinned in certificationClaimsParity.test.js):
 *  · PENDING ⇒ `lines` is [] and no field states a proven claim (no numbers, no
 *    "certified/proven/guaranteed" vocabulary). The world says only that the
 *    proving is scheduled.
 *  · CERTIFIED ⇒ every proof line is built from the soak result: each numeric
 *    token comes from soak.years / seedsTested / ticksAdvanced, and each property
 *    clause comes from a key in soak.properties (⊆ SOAK_PROPERTY_KEYS). No line
 *    exists without a manifest receipt behind it.
 *
 * Pure: imports only the schema (labels + lookup). No store/React.
 */

import { certificationForBand, soakPropertyLabel } from './certificationSchema.js';

/** The one honest thing an uncertified world says — STATIC, no claim, no number.
 *  Deliberately free of completed-claim vocabulary (certified/proven/…): the
 *  world states only that its trial is SCHEDULED, never that it has held. */
export const PENDING_HEADLINE = 'The hundred-year proving is scheduled.';
export const PENDING_DETAIL =
  'This world has not yet stood the long soak. When it has, the tally of how it held appears here — and never a claim before.';

/**
 * @typedef {Object} WorldCertificationView
 * @property {'certified'|'pending'} status
 * @property {string} headline          the panel's lead line
 * @property {string} detail            a supporting sentence
 * @property {string[]} lines           certified: one proof line per proven property; [] when pending
 * @property {import('./certificationSchema.js').SoakResult|null} soak  the raw receipt (null when pending)
 * @property {string|null} presetId
 */

/**
 * Build the certification view for a world's config band.
 * @param {Object} args
 * @param {import('./certificationSchema.js').CertificationManifest|null|undefined} args.manifest
 * @param {string|null} [args.bandId]     the world's seed-independent config signature (optional)
 * @param {string|null} [args.presetId]   the world's simulation preset id (the named band)
 * @returns {WorldCertificationView}
 */
export function buildWorldCertification({ manifest, bandId = null, presetId = null }) {
  const band = certificationForBand(manifest, { bandId, presetId });
  if (!band || band.status !== 'certified' || !band.soak) {
    return {
      status: 'pending',
      headline: PENDING_HEADLINE,
      detail: PENDING_DETAIL,
      lines: [],
      soak: null,
      presetId: presetId != null ? String(presetId) : (band ? band.presetId : null),
    };
  }
  const soak = band.soak;
  /** @type {string[]} */
  const lines = [];
  // The lead proof line: the span + breadth, both interpolated from the soak.
  lines.push(
    `Soaked ${soak.years} years across ${soak.seedsTested} seeds (${soak.ticksAdvanced} ticks advanced), this world:`,
  );
  for (const key of soak.properties) {
    const label = soakPropertyLabel(key);
    if (label) lines.push(`— ${label}`);
  }
  return {
    status: 'certified',
    headline: 'Certified by the long soak.',
    detail: `Proven for the ${band.presetId} band.`,
    lines,
    soak,
    presetId: band.presetId,
  };
}
