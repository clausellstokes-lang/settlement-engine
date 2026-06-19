/**
 * advanceTimeTarget.js — the SINGLE forward-compatible nav target for the Library
 * "Advance Time" CTA (UX overhaul Phase 3, plan §4.2).
 *
 * UX Phase 4 (DONE): the Realm hub is the simulation's IA home. This constant now
 * deep-links the CTA into the Realm destination (`view: 'realm'`), landing on the
 * `news` workspace — which the Realm Inspector maps to its Chronicle section (the
 * post-advance "what changed" surface). ONE edit here repoints every Advance-Time
 * CTA in the Library; no caller changes (the Realm consumes the same
 * `pendingMapWorkspace` store signal the World Map did).
 *
 *   import { ADVANCE_TIME_NAV_TARGET } from './advanceTimeTarget.js';
 *   onNavigate?.(ADVANCE_TIME_NAV_TARGET.view);
 *   requestMapWorkspace?.(ADVANCE_TIME_NAV_TARGET.workspace);
 *
 * @typedef {{ view: string, workspace: string }} AdvanceTimeNavTarget
 */

/** @type {Readonly<AdvanceTimeNavTarget>} */
export const ADVANCE_TIME_NAV_TARGET = Object.freeze({
  // Phase 4 — the Realm hub. The Realm consumes pendingMapWorkspace exactly as the
  // World Map did, so the `news` workspace lands on the post-advance Chronicle.
  view: 'realm',
  // The post-advance "what changed" surface (Wizard News → Realm Inspector Chronicle).
  workspace: 'news',
});

