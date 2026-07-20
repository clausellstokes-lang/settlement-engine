/**
 * certification/certificationSchema.js — THE WORLD CERTIFICATION MANIFEST schema
 * (VISION WAVE V-10 THE CERTIFICATE).
 *
 * WHY: nobody else CAN run a 300-year soak; saying so HONESTLY is marketing that
 * compounds. The claims-parity law (the product's spine) forbids a surface from
 * claiming what the soak has not proven. This file is the SCHEMA WALL for that
 * claim: it defines the shape of a certification manifest — the durable record a
 * soak writes ("seed/config band → soak results") — and the validator that keeps
 * a manifest honest. Until the owner's soak writes the first band, the shipped
 * manifest is EMPTY and every surface reads PENDING (the inert-honest state).
 *
 * THE LAWS (enforced by validateCertificationManifest + the claims-parity pin):
 *  1. CLOSED PROPERTY VOCABULARY: a soak may only claim a property from
 *     SOAK_PROPERTY_KEYS — the panel renders a proof line only for a listed key.
 *  2. STATUS↔SOAK LOCKSTEP: a 'certified' band MUST carry a soak result; a
 *     'pending' band MUST carry soak:null. No claim can exist without its receipt.
 *  3. VERSIONED + TOTAL ON GARBAGE: the validator never throws; it returns
 *     { ok, errors } (the customContentSchema idiom) and tolerates absence of
 *     optional fields, rejecting only present-but-invalid ones.
 *
 * Pure: imports nothing, no store/React/I/O. Hand-rolled validation (the repo has
 * no zod/ajv — the customContentSchema.js / simulationProfile.js idiom).
 *
 * @enforced-by tests/domain/certificationSchema.test.js (schema validation +
 *   status/soak lockstep + band lookup),
 *   tests/domain/certificationClaimsParity.test.js (no claim without manifest).
 */

/** The manifest schema version (bumped only on a breaking shape change). @type {number} */
export const CERTIFICATION_MANIFEST_VERSION = 1;

/** A band is either proven by a soak or awaiting one. @type {ReadonlyArray<{ key: string, label: string }>} */
export const CERTIFICATION_STATUS = Object.freeze([
  { key: 'certified', label: 'Certified' },
  { key: 'pending', label: 'Pending' },
]);
/** @type {ReadonlyArray<string>} */
export const CERTIFICATION_STATUS_KEYS = Object.freeze(CERTIFICATION_STATUS.map((s) => s.key));

/**
 * THE CLOSED PROPERTY VOCABULARY — the only properties a soak result may claim.
 * The panel renders a proof line ONLY for a key present here AND listed on the
 * soak result (the claims-parity wall). Each label is a house-voice clause that
 * completes "the world …".
 * @type {ReadonlyArray<{ key: string, label: string }>}
 */
export const SOAK_PROPERTIES = Object.freeze([
  { key: 'no_crash', label: 'ran to term without crash or arithmetic fault' },
  { key: 'rerun_identical', label: 'reproduced byte-for-byte on the same seed' },
  { key: 'seed_divergent', label: 'told a different tale on a different seed' },
  { key: 'population_bounded', label: 'held its people within honest bounds' },
  { key: 'stressor_rhythm', label: 'kept a steady rhythm of trouble and relief' },
  { key: 'no_stasis', label: 'never once fell still' },
]);
/** @type {ReadonlyArray<string>} */
export const SOAK_PROPERTY_KEYS = Object.freeze(SOAK_PROPERTIES.map((p) => p.key));

/** The human label for a soak property key ('' for an unknown key). Pure, total.
 *  @param {string} key @returns {string} */
export function soakPropertyLabel(key) {
  const row = SOAK_PROPERTIES.find((p) => p.key === key);
  return row ? row.label : '';
}

// ── Shapes ────────────────────────────────────────────────────────────────────

/**
 * The results a soak proves for one config band.
 * @typedef {Object} SoakResult
 * @property {number} years          calendar years advanced (e.g. 100)
 * @property {number} seedsTested    distinct seeds run in the band
 * @property {number} ticksAdvanced  total ticks advanced across the run
 * @property {string[]} properties   a subset of SOAK_PROPERTY_KEYS the run held
 * @property {string} runAt          ISO timestamp the soak completed
 * @property {string} [buildHash]    the build the soak ran against (optional)
 */

/**
 * One certification band: a seed-independent config grouping and its status.
 * @typedef {Object} CertificationBand
 * @property {string} bandId     the seed-independent grouping key (config signature or preset id)
 * @property {string} presetId   the human-facing preset label the band covers
 * @property {string} status     one of CERTIFICATION_STATUS_KEYS
 * @property {SoakResult|null} soak  the proof (present iff status==='certified')
 */

/**
 * The manifest: the durable set of certification bands a soak has recorded.
 * @typedef {Object} CertificationManifest
 * @property {number} manifestVersion
 * @property {string|null} generatedAt  ISO of the last soak write (null ⇒ never run)
 * @property {ReadonlyArray<CertificationBand>} bands  read-only: the soak write path
 *   appends via immutable update ({ ...m, bands: [...m.bands, band] }), never in place
 */

// ── Validators (the { ok, errors } idiom — never throw) ─────────────────────────

/**
 * @param {unknown} raw
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateSoakResult(raw) {
  /** @type {string[]} */
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['A soak result must be an object.'] };
  }
  const r = /** @type {Record<string, unknown>} */ (raw);
  for (const k of ['years', 'seedsTested', 'ticksAdvanced']) {
    const v = r[k];
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) {
      errors.push(`${k} must be a non-negative finite number.`);
    }
  }
  const props = r.properties;
  if (!Array.isArray(props)) {
    errors.push('properties must be an array of proven-property keys.');
  } else {
    for (const p of props) {
      if (!SOAK_PROPERTY_KEYS.includes(/** @type {string} */ (p))) {
        errors.push(`unknown soak property: ${String(p)} (must be one of: ${SOAK_PROPERTY_KEYS.join(', ')}).`);
      }
    }
  }
  if (typeof r.runAt !== 'string' || r.runAt.trim() === '') {
    errors.push('runAt must be a non-empty ISO timestamp string.');
  }
  if (r.buildHash != null && typeof r.buildHash !== 'string') {
    errors.push('buildHash, when present, must be a string.');
  }
  return { ok: errors.length === 0, errors };
}

/**
 * @param {unknown} raw
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateCertificationBand(raw) {
  /** @type {string[]} */
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['A certification band must be an object.'] };
  }
  const b = /** @type {Record<string, unknown>} */ (raw);
  if (typeof b.bandId !== 'string' || b.bandId.trim() === '') errors.push('bandId must be a non-empty string.');
  if (typeof b.presetId !== 'string' || b.presetId.trim() === '') errors.push('presetId must be a non-empty string.');
  if (!CERTIFICATION_STATUS_KEYS.includes(/** @type {string} */ (b.status))) {
    errors.push(`status must be one of: ${CERTIFICATION_STATUS_KEYS.join(', ')}.`);
  }
  // THE STATUS↔SOAK LOCKSTEP (the claims-parity wall at the schema level): a
  // certified band MUST prove itself; a pending band MUST claim nothing.
  if (b.status === 'certified') {
    if (b.soak == null) {
      errors.push('a certified band must carry a soak result (no claim without a receipt).');
    } else {
      const s = validateSoakResult(b.soak);
      if (!s.ok) errors.push(...s.errors.map((e) => `soak: ${e}`));
    }
  } else if (b.status === 'pending') {
    if (b.soak != null) errors.push('a pending band must carry soak:null (it has proven nothing yet).');
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Validate a whole manifest. Total on garbage; never throws.
 * @param {unknown} raw
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateCertificationManifest(raw) {
  /** @type {string[]} */
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['A certification manifest must be an object.'] };
  }
  const m = /** @type {Record<string, unknown>} */ (raw);
  if (m.manifestVersion !== CERTIFICATION_MANIFEST_VERSION) {
    errors.push(`manifestVersion must be ${CERTIFICATION_MANIFEST_VERSION}.`);
  }
  if (m.generatedAt != null && typeof m.generatedAt !== 'string') {
    errors.push('generatedAt must be null or an ISO timestamp string.');
  }
  const bands = m.bands;
  if (!Array.isArray(bands)) {
    errors.push('bands must be an array.');
  } else {
    /** @type {Set<string>} */
    const seen = new Set();
    bands.forEach((band, i) => {
      const res = validateCertificationBand(band);
      if (!res.ok) errors.push(...res.errors.map((e) => `bands[${i}]: ${e}`));
      const id = band && typeof band === 'object' ? /** @type {Record<string, unknown>} */ (band).bandId : undefined;
      if (typeof id === 'string') {
        if (seen.has(id)) errors.push(`bands[${i}]: duplicate bandId ${id}.`);
        seen.add(id);
      }
    });
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Look up the certification band covering a world, seed-independently. Matches by
 * bandId first (the config signature), then by presetId (the named config band).
 * Returns null when no band covers the world (⇒ the pending state).
 * @param {CertificationManifest|null|undefined} manifest
 * @param {{ bandId?: string|null, presetId?: string|null }} key
 * @returns {CertificationBand|null}
 */
export function certificationForBand(manifest, key) {
  const bands = manifest && Array.isArray(manifest.bands) ? manifest.bands : [];
  const bandId = key && key.bandId != null ? String(key.bandId) : null;
  const presetId = key && key.presetId != null ? String(key.presetId) : null;
  if (bandId) {
    const byBand = bands.find((b) => b && b.bandId === bandId);
    if (byBand) return byBand;
  }
  if (presetId) {
    const byPreset = bands.find((b) => b && b.presetId === presetId);
    if (byPreset) return byPreset;
  }
  return null;
}
