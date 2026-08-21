/**
 * domain/autonomy/standingInstructions.js — STANDING CAMPAIGN INSTRUCTIONS
 * (SURVEYOR S7, DESIGN_AI_CONTROL_SURFACE §2 stage 7).
 *
 * Campaign-scoped, versioned, editable text the DM sets once and every compile then
 * carries — injected into the PER-REQUEST SUFFIX of the compile prompt (the static-first
 * prompt-cache discipline: the byte-stable static prefix NEVER carries them), and NEVER
 * into engine state (no kernel, no worldState, no tick path reads this key — the
 * dormancy pin proves an instruction-bearing campaign advances byte-identically).
 *
 * PERSISTENCE: the campaign envelope is blob-resident (saved_maps.map_data.campaign —
 * lib/campaigns.js), so `surveyorInstructions` rides the existing registered
 * `updateSavedCampaign` op with no schema change and no new store code. Absent key ⇒
 * exactly the pre-S7 record (dormancy-lawful by construction).
 */

/** The campaign-envelope key (blob-resident; engine-invisible). */
export const STANDING_INSTRUCTIONS_KEY = 'surveyorInstructions';

/** Bounded length (JUDGMENT, vetoable): instructions are guidance, not a corpus. */
export const MAX_INSTRUCTIONS_CHARS = 2000;

/**
 * @typedef {object} StandingInstructions
 * @property {string} text — trimmed, ≤ MAX_INSTRUCTIONS_CHARS
 * @property {number} version — bumps on every edit (1-based)
 * @property {string} updatedAt — ISO timestamp of the last edit
 */

/**
 * Normalize a raw persisted value. Empty/absent/malformed ⇒ null (the key should then
 * be ABSENT, never an empty husk — dormancy).
 * @param {unknown} raw
 * @returns {StandingInstructions | null}
 */
export function normalizeStandingInstructions(raw) {
  const r = /** @type {Record<string, unknown>} */ (raw && typeof raw === 'object' ? raw : {});
  const text = typeof r.text === 'string' ? r.text.trim().slice(0, MAX_INSTRUCTIONS_CHARS) : '';
  if (!text) return null;
  const versionRaw = typeof r.version === 'number' && Number.isFinite(r.version) ? Math.floor(r.version) : 1;
  return {
    text,
    version: Math.max(1, versionRaw),
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : '',
  };
}

/**
 * The next version after an edit. Empty text ⇒ null (the caller REMOVES the key —
 * the record returns to its pre-S7 shape rather than keeping a husk).
 * @param {StandingInstructions | null} prev
 * @param {string} text
 * @param {string} nowIso — caller-supplied clock (this module stays clock-free)
 * @returns {StandingInstructions | null}
 */
export function nextStandingInstructions(prev, text, nowIso) {
  const trimmed = String(text || '').trim().slice(0, MAX_INSTRUCTIONS_CHARS);
  if (!trimmed) return null;
  return {
    text: trimmed,
    version: (prev?.version || 0) + 1,
    updatedAt: String(nowIso || ''),
  };
}

/**
 * The compile-suffix payload: the instruction text a compile carries, '' when none.
 * @param {{ [STANDING_INSTRUCTIONS_KEY]?: unknown } | null | undefined} campaign
 * @returns {string}
 */
export function instructionsForCompile(campaign) {
  const rec = campaign ? campaign[STANDING_INSTRUCTIONS_KEY] : null;
  return normalizeStandingInstructions(rec)?.text || '';
}
