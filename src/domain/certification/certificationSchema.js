/**
 * certification/certificationSchema.js — THE WORLD CERTIFICATION MANIFEST schema
 * (VISION WAVE V-10 THE CERTIFICATE).
 *
 * WHY: the claims-parity law (the product's spine) forbids a surface from
 * claiming what the maintained release evidence has not proven. This file is
 * the SCHEMA WALL for that claim: it defines the shape of a certification
 * manifest — the durable record an operator may publish from a source-bound
 * 100-year release receipt — and the validator that keeps a manifest honest.
 * The 300-year run remains research evidence. Until the owner's soak writes the
 * first band, the shipped manifest is EMPTY and every surface reads PENDING
 * (the inert-honest state).
 *
 * THE LAWS (enforced by validateCertificationManifest + the claims-parity pin):
 *  1. CLOSED PROPERTY VOCABULARY: a soak may only claim a property from
 *     SOAK_PROPERTY_KEYS — the panel renders a proof line only for a listed key.
 *  2. STATUS↔SOAK LOCKSTEP: pending carries no receipt, measured carries a
 *     partial receipt, and certified carries a receipt proving every required
 *     property. Passing a narrower harness can never mint a broad certificate.
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
/** Behavioral oracle version required before a band may claim certification. */
export const BEHAVIORAL_CONTRACT_VERSION = 4;

/** @type {ReadonlyArray<{ key: string, label: string }>} */
export const CERTIFICATION_STATUS = Object.freeze([
  { key: 'certified', label: 'Certified' },
  { key: 'measured', label: 'Measured' },
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
  { key: 'mover_activity', label: 'kept every load-bearing mover family active into the final decade' },
  { key: 'event_tempo_diversity', label: 'sustained consequential, varied events without cacophony' },
  { key: 'constructive_and_destructive_arcs', label: 'made recovery as observable as ruin' },
  { key: 'state_motion', label: 'continued moving population, prosperity, and faction power' },
  { key: 'neighbor_perturbation', label: 'carried a bounded neighbour change beyond its source' },
  { key: 'succession_integrity', label: 'turned governing seats over without corrupting them' },
  { key: 'attention_fairness', label: 'gave every settlement a fair share of the record' },
  { key: 'dark_controls', label: 'left gated movers truly dark when their controls were off' },
  { key: 'interaction_bounded', label: 'composed mover consequences without cascade storms' },
  { key: 'chronicle_human_reviewed', label: 'remained legible when a person read the late Chronicle' },
]);
/** @type {ReadonlyArray<string>} */
export const SOAK_PROPERTY_KEYS = Object.freeze(SOAK_PROPERTIES.map((p) => p.key));

/**
 * Certification is a conjunction, not a synonym for "some checks passed."
 * Measurement receipts may prove a subset; a certified band must prove all of
 * these properties in the same band receipt.
 */
export const CERTIFICATION_REQUIRED_PROPERTY_KEYS = SOAK_PROPERTY_KEYS;

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
 * @property {string[]} properties   the SOAK_PROPERTY_KEYS this run held
 * @property {string} runAt          ISO timestamp the soak completed
 * @property {string} [buildHash]    the build the soak ran against (optional)
 * @property {number} [behavioralContractVersion] behavioral oracle version
 * @property {string} [evidenceDigest] source-bound aggregate evidence digest
 * @property {string} [humanChronicleReviewDigest] signed human-review digest
 */

/**
 * One certification band: a seed-independent config grouping and its status.
 * @typedef {Object} CertificationBand
 * @property {string} bandId     the seed-independent grouping key (config signature or preset id)
 * @property {string} presetId   the human-facing preset label the band covers
 * @property {string} status     one of CERTIFICATION_STATUS_KEYS
 * @property {SoakResult|null} soak  absent when pending; present when measured/certified
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
    const seen = new Set();
    for (const p of props) {
      if (!SOAK_PROPERTY_KEYS.includes(/** @type {string} */ (p))) {
        errors.push(`unknown soak property: ${String(p)} (must be one of: ${SOAK_PROPERTY_KEYS.join(', ')}).`);
      }
      if (seen.has(p)) errors.push(`duplicate soak property: ${String(p)}.`);
      seen.add(p);
    }
  }
  if (typeof r.runAt !== 'string' || r.runAt.trim() === '') {
    errors.push('runAt must be a non-empty ISO timestamp string.');
  }
  if (r.buildHash != null && typeof r.buildHash !== 'string') {
    errors.push('buildHash, when present, must be a string.');
  }
  if (r.behavioralContractVersion != null
      && (typeof r.behavioralContractVersion !== 'number'
        || !Number.isInteger(r.behavioralContractVersion)
        || r.behavioralContractVersion < 1)) {
    errors.push('behavioralContractVersion, when present, must be a positive integer.');
  }
  for (const key of ['evidenceDigest', 'humanChronicleReviewDigest']) {
    if (r[key] != null
        && (typeof r[key] !== 'string' || !/^[a-f0-9]{64}$/.test(r[key]))) {
      errors.push(`${key}, when present, must be a lowercase SHA-256 digest.`);
    }
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
  // The status is itself a claim. Keep partial evidence visible as "measured"
  // without allowing it to inherit the stronger "certified" label.
  if (b.status === 'certified') {
    if (b.soak == null) {
      errors.push('a certified band must carry a soak result (no claim without a receipt).');
    } else {
      const s = validateSoakResult(b.soak);
      if (!s.ok) errors.push(...s.errors.map((e) => `soak: ${e}`));
      const soak = /** @type {Record<string, unknown>} */ (b.soak);
      const properties = Array.isArray(soak.properties) ? soak.properties : [];
      const missing = CERTIFICATION_REQUIRED_PROPERTY_KEYS.filter((key) => !properties.includes(key));
      if (missing.length) {
        errors.push(`a certified band is missing required properties: ${missing.join(', ')}.`);
      }
      if (Number(soak.years) < 100) {
        errors.push('a certified band must cover the 100-year release horizon.');
      }
      if (soak.behavioralContractVersion !== BEHAVIORAL_CONTRACT_VERSION) {
        errors.push(`a certified band must name behavioralContractVersion ${BEHAVIORAL_CONTRACT_VERSION}.`);
      }
      if (typeof soak.evidenceDigest !== 'string'
          || !/^[a-f0-9]{64}$/.test(soak.evidenceDigest)) {
        errors.push('a certified band must carry its aggregate evidenceDigest.');
      }
      if (typeof soak.humanChronicleReviewDigest !== 'string'
          || !/^[a-f0-9]{64}$/.test(soak.humanChronicleReviewDigest)) {
        errors.push('a certified band must carry its humanChronicleReviewDigest.');
      }
    }
  } else if (b.status === 'measured') {
    if (b.soak == null) {
      errors.push('a measured band must carry a soak result.');
    } else {
      const s = validateSoakResult(b.soak);
      if (!s.ok) errors.push(...s.errors.map((e) => `soak: ${e}`));
      const soak = /** @type {Record<string, unknown>} */ (b.soak);
      if (soak.behavioralContractVersion !== BEHAVIORAL_CONTRACT_VERSION) {
        errors.push(`a measured band must name behavioralContractVersion ${BEHAVIORAL_CONTRACT_VERSION}.`);
      }
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
