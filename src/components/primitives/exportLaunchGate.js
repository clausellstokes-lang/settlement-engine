/**
 * exportLaunchGate.js - the one question every export control asks before it works.
 *
 * THE OWNER (2026-11-03): "Oh and export (outside of gallery) buttons are not to work are to
 * say available at launch and have the purple gold combination as well." Later the same day:
 * "In essence for right now. Anyone that is not a developer can only have access to the free
 * account version."
 *
 * So, until launch, an export (a settlement, campaign or dossier leaving the app as a file)
 * works only for a STAFF account (the developer and admin roles, authSlice.isElevated, so the
 * owner can test exports) and for the GALLERY's own export. Every other control renders
 * disabled with <AvailableAtLaunchPill /> as a direct child, which gives a Button the launch
 * skin (the regal purple ground with the gold letters, Button.jsx). At launch the build carries
 * VITE_PURCHASES_OPEN=true (lib/launchGate.js) and the gate opens for everyone with no code
 * change.
 *
 * No store import: a control reads staff with `useStore(selectExportStaff)` and passes it in,
 * so this module stays as light as the launch switch it reads.
 */
import { purchasesOpen } from '../../lib/launchGate.js';

/**
 * Whether an export control works for this viewer in this build.
 * @param {{ staff?: boolean, gallery?: boolean, env?: unknown }} [facts]
 *   staff: the account holds a staff role; gallery: the export is the gallery's own;
 *   env: the build env, import.meta.env by default (a seam for tests)
 * @returns {boolean}
 */
export function exportsOpenFor({ staff = false, gallery = false, env = undefined } = {}) {
  return staff === true || gallery === true || purchasesOpen(env);
}

/**
 * The store selector for the staff fact (authSlice.isElevated: the developer and admin roles).
 * @param {{ isElevated?: unknown }} state
 * @returns {boolean}
 */
export function selectExportStaff(state) {
  return typeof state?.isElevated === 'function' && state.isElevated() === true;
}
