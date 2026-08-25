/**
 * lib/guidance.js — the ONE device-local dismissal store for guidance whispers.
 *
 * Before W-GUIDE-1 every teaching organ invented its own localStorage key across
 * three naming conventions (`sf:dismissed_callouts:*`, `sf.postGenCoachDismissedAt`,
 * `sf:dismissed_whats_next`, `sf_worldmap_tour_done`, …). This unifies them under
 * ONE convention — `sf:guidance:<whisperId>` — with ONE shared helper, and
 * READ-ONCE-MIGRATES the legacy keys so a user who already dismissed the old
 * surface is never re-taught. Device-local is accepted (§3); cross-device
 * seen-once is a persistence-shape decision DEFERRED to the owner.
 *
 * Pure w.r.t. the store: components and the onboarding slice call these directly.
 * Every access is try/caught so a blocked/again localStorage never throws into
 * render.
 */

const PREFIX = 'sf:guidance:';

/**
 * Legacy dismissal keys that read-once-migrate into a unified whisper id.
 *   anyOf — the unified key is set if ANY listed legacy key is present/'1'.
 *   allOf — the unified key is set only if EVERY listed legacy key is '1'
 *           (the band was fully dismissed before the consolidation).
 * @type {Record<string, { anyOf?: string[], allOf?: Array<{ key: string, equals?: string }> }>}
 */
export const LEGACY_DISMISSAL_MIGRATIONS = Object.freeze({
  // FirstDossierCallouts dismissed each of its three callouts independently and
  // hid the band only when all three were gone — so the unified band counts as
  // dismissed only when all three legacy keys read '1'.
  dossier_first_callouts: {
    allOf: [
      { key: 'sf:dismissed_callouts:tension', equals: '1' },
      { key: 'sf:dismissed_callouts:supply', equals: '1' },
      { key: 'sf:dismissed_callouts:hook', equals: '1' },
    ],
  },
  // The retired PostGenCoach wrote one timestamp on dismiss/complete; its
  // presence retires all three preserved coach whispers.
  postgen_read_dossier: { anyOf: ['sf.postGenCoachDismissedAt'] },
  postgen_watch_simulated: { anyOf: ['sf.postGenCoachDismissedAt'] },
  postgen_save_it: { anyOf: ['sf.postGenCoachDismissedAt'] },
  // content-immersion-r2-3: WizardNextSteps migrates off its bespoke legacy key
  // onto the unified sf:guidance:wizard_next_steps convention — a keeper who
  // already dismissed the What's-next guide is never re-taught.
  wizard_next_steps: { anyOf: ['sf:dismissed_whats_next'] },
});

/** @param {string} key */
function readRaw(key) {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

/** @param {string} key @param {string} value */
function writeRaw(key, value) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — accept an ephemeral dismiss */
  }
}

/**
 * Read-once migration: if a whisper's unified key is unset but its legacy
 * source(s) indicate a prior dismissal, stamp the unified key so this runs at
 * most once (afterwards the unified key is present and the migration is skipped).
 * @param {string} id
 */
function migrateLegacyDismissal(id) {
  const spec = LEGACY_DISMISSAL_MIGRATIONS[id];
  if (!spec) return;
  let migrate = false;
  if (spec.anyOf) {
    migrate = spec.anyOf.some((k) => readRaw(k) != null);
  }
  if (!migrate && spec.allOf) {
    migrate = spec.allOf.every((m) => readRaw(m.key) === (m.equals ?? '1'));
  }
  if (migrate) writeRaw(PREFIX + id, '1');
}

/**
 * Whether a whisper has been dismissed on this device. Runs the read-once legacy
 * migration on first access so an old dismissal carries forward.
 * @param {string} id
 * @returns {boolean}
 */
export function isGuidanceDismissed(id) {
  if (readRaw(PREFIX + id) === '1') return true;
  migrateLegacyDismissal(id);
  return readRaw(PREFIX + id) === '1';
}

/**
 * Permanently dismiss a whisper on this device.
 * @param {string} id
 */
export function markGuidanceDismissed(id) {
  writeRaw(PREFIX + id, '1');
}

/** The unified localStorage key for a whisper id (test + debug helper). @param {string} id */
export function guidanceDismissalKey(id) {
  return PREFIX + id;
}
