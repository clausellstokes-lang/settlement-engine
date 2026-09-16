/**
 * lastMapView.js — THE LIVING BACKDROP device-local last-viewed map memory.
 *
 * A tiny localStorage sidecar recording, per saved settlement, the town-map VIEW
 * (plan | panorama | portrait3d) and LENS (a base styleId) the owner last looked
 * at. The library settlement view can then wash that exact composition behind
 * the dossier (SettlementDossierBackdrop). DEVICE-LOCAL only — it never touches
 * the settlement blob or the owner-gated `mapEdits` persistence surface.
 *
 * FAIL-SILENT: absent or throwing localStorage (SSR / jsdom / private mode / quota)
 * degrades to a no-op write and a null read, so the backdrop simply defaults to a
 * plan view under the default lens. A corrupt / partial entry also reads back as a
 * shape-guarded default, never a throw.
 */

const KEY_PREFIX = 'sf.lastMapView.';

/**
 * Stable persisted view identifiers. Never rename an id in place: old device
 * entries may outlive several releases. Add a migration branch in
 * `normalizeTownMapView` if a future presentation needs a different label.
 */
export const TOWN_MAP_VIEW_IDS = Object.freeze([
  'plan',
  'panorama',
  'portrait3d',
]);

/** The storage key for a saved settlement, or null when there is no saveId. */
function keyFor(saveId) {
  return saveId == null ? null : `${KEY_PREFIX}${saveId}`;
}

/**
 * Coerce persisted or caller-supplied view ids to the supported vocabulary.
 * Unknown and historical-corrupt values fail safely to the canonical 2D plan.
 *
 * @param {unknown} view
 * @returns {'plan'|'panorama'|'portrait3d'}
 */
export function normalizeTownMapView(view) {
  if (view === 'panorama' || view === 'portrait3d') return view;
  return 'plan';
}

/**
 * Best-effort record of the last-viewed {view, lens} for a saved settlement.
 * No-op when there is no saveId or no usable localStorage.
 * @param {string|number|null|undefined} saveId
 * @param {{ view?: 'plan'|'panorama'|'portrait3d', lens?: string }} [entry]
 */
export function writeLastMapView(saveId, entry = {}) {
  const key = keyFor(saveId);
  if (!key || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({
      view: normalizeTownMapView(entry.view),
      lens: entry.lens,
    }));
  } catch { /* private mode / quota / SSR — the backdrop just defaults */ }
}

/**
 * The last-viewed {view, lens} for a saved settlement, or null when never
 * recorded / unreadable. Shape-guarded: an unknown view falls back to 'plan' and
 * a non-string lens to null (the caller then resolves the default lens).
 * @param {string|number|null|undefined} saveId
 * @returns {{ view: 'plan'|'panorama'|'portrait3d', lens: string|null } | null}
 */
export function readLastMapView(saveId) {
  const key = keyFor(saveId);
  if (!key || typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      view: normalizeTownMapView(parsed.view),
      lens: typeof parsed.lens === 'string' ? parsed.lens : null,
    };
  } catch { return null; }
}
