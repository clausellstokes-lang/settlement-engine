/**
 * lib/scribeRenderer.js — THE ONE SEAM BETWEEN THE TRIGGER AND THE TRANSPORT.
 *
 * The OPEN decides that a render is owed (design §5, rule 14). Sending it is a different concern
 * living in a different place: a metered, credited, server-side call whose module must never be
 * pulled into the dossier's render path. This registry is the joint, and it is deliberately the
 * smallest thing that can be one:
 *
 *   • the TRIGGER asks for the renderer and does nothing at all when none is registered, which is
 *     the truthful state of a build whose transport is not wired, an offline session, and any
 *     test that wants the decision without the call;
 *   • the TRANSPORT registers itself when its module loads, so the trigger never imports it and
 *     the edge client cannot reach the first-paint closure through this file;
 *   • the registration is one function, so a test can install a recorder and assert exactly what
 *     the trigger would have sent, with no network and no mock of a module graph.
 *
 * ⛔ NOT A PLUGIN SYSTEM. There is ONE renderer at a time and registering a second replaces the
 * first. A list would invite two transports to bill the same render twice.
 */

/** @typedef {(request: object) => Promise<{ok: boolean, reason?: string}>} ScribeRenderer */

/** @type {ScribeRenderer|null} */
let renderer = null;

/**
 * Install the transport. Pass null to remove it (what a test does in its teardown, and what a
 * sign-out could do if the transport ever became account-scoped).
 * @param {ScribeRenderer|null} fn
 */
export function setScribeRenderer(fn) {
  renderer = typeof fn === 'function' ? fn : null;
}

/** The transport, or null when nothing is wired. @returns {ScribeRenderer|null} */
export function getScribeRenderer() {
  return renderer;
}

/** True when a render could actually be sent. Read by the trigger before it spends a queue slot. */
export function hasScribeRenderer() {
  return renderer !== null;
}
