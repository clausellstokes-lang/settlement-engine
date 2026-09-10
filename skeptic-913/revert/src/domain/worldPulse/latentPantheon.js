/**
 * domain/worldPulse/latentPantheon.js — the LATENT-PANTHEON ACTIVATION SEAM
 * (Phase 4 W-F5 stage 2; PHASE4_FAITH_DELTA "THE PREMIUM GATE" addendum,
 * owner 2026-07-10).
 *
 * ⚠️ LEGACY-ONLY SEAM (T4 ONE-REGEN batch). Generation NO LONGER bakes a latent
 * pantheon: the deity doctrine retires the premade pool (no premade deities —
 * custom content only), and the `seedStartingPantheon` step and its pool were
 * deleted with it. This module is KEPT, unchanged in behavior, because saves
 * written before that batch still carry a `config.latentPantheon` record, and
 * those un-activated gods must keep working. It is a reader of persisted data,
 * never a producer.
 *
 * WHAT IT DOES: the post-generation, RNG-FREE seam that turns the key —
 * `activateLatentPantheon` COPIES the latent patron/cults into the live embed
 * keys (`config.primaryDeityRef` / `primaryDeitySnapshot` /
 * `cultDeitySnapshots`) in the exact field-disciplined shape the
 * SET_PRIMARY_DEITY / IMPOSE_CULT handlers write. Until it fires there are ZERO
 * embeds, the religion subsystem gate (subsystemActivation) stays closed, and
 * the engine is provably inert by the neutrality theorem — the free tier IS the
 * certified ground state. Upgrade = activation fires on open: "the gods were
 * always there, latent in the seed."
 *
 * THE ONE LIFECYCLE CONSEQUENCE, stated plainly: a FULL REGENERATION re-runs the
 * pipeline, and the seeding step no longer exists — so an old save that never
 * activated its latent gods and is then fully regenerated comes back without
 * them. That is the doctrine's intent, and it is declared in the batch. An
 * ACTIVATED patron is unaffected: the live embed rides `config` through
 * regeneration verbatim (pinned by tests/domain/latentPantheon.test.js).
 *
 * WHO CALLS THIS: the store's generation-complete / save-open wiring for
 * premium accounts (W-F6 — tier checks, dossier gating, and generic-faith copy
 * all live THERE). This module is deliberately tier-blind and store-blind:
 * pure functions over a settlement object, no I/O, no React, no account reads.
 *
 * Properties (pinned by tests/domain/latentPantheon.test.js):
 *   - DETERMINISTIC + RNG-FREE: a pure copy of the latent record; same input ⇒
 *     same output, byte-equal embeds to the latent data.
 *   - IDEMPOTENT: activating an already-active settlement returns it UNCHANGED
 *     (same reference); re-activation can never double-write or reshape.
 *   - CONSERVATIVE: a settlement with no latent record (faith:'none', legacy,
 *     or DM-authored) is returned unchanged; an EXPLICIT live deity is never
 *     clobbered (a DM assignment outranks the latent seed).
 *   - LATENCY-PRESERVING: the latent record is KEPT after activation (it is
 *     the seed's truth; regeneration re-bakes it and idempotence re-holds).
 */

/**
 * @typedef {{ _deityRef: string, name: string, alignmentAxis: string,
 *   temperamentAxis: string, rankAxis: string, lawAxis: string,
 *   domain?: string, portfolio?: string }} LatentDeitySnapshot
 * @typedef {{ patron: LatentDeitySnapshot, cults?: readonly LatentDeitySnapshot[] }} LatentPantheon
 * @typedef {{ config?: { latentPantheon?: LatentPantheon,
 *   primaryDeityRef?: string, primaryDeitySnapshot?: object,
 *   cultDeitySnapshots?: readonly object[] } & Record<string, unknown> }} PantheonSettlement
 */

/**
 * The settlement's latent pantheon record, or null. Pure read.
 * @param {PantheonSettlement | null | undefined} settlement
 * @returns {LatentPantheon | null}
 */
export function latentPantheonOf(settlement) {
  const latent = settlement?.config?.latentPantheon;
  return latent && typeof latent === 'object' && latent.patron ? latent : null;
}

/**
 * True when the settlement already carries a LIVE primary-deity embed (its
 * faith is active — whether via this seam or a DM assignment). Pure read.
 * @param {PantheonSettlement | null | undefined} settlement
 * @returns {boolean}
 */
export function hasActivePantheon(settlement) {
  return Boolean(settlement?.config?.primaryDeitySnapshot);
}

/**
 * ACTIVATE the latent pantheon: copy the latent patron (and cults, when
 * present) into the live embed keys. RNG-free, deterministic, idempotent,
 * store-blind (the caller owns tier checks — W-F6).
 *
 * Returns the SAME settlement reference when there is nothing to do (no latent
 * record, or faith already active), else a NEW settlement object whose config
 * carries the frozen live embeds. The latent record is preserved.
 *
 * @template {PantheonSettlement} S
 * @param {S | null | undefined} settlement
 * @returns {S | null | undefined}
 */
export function activateLatentPantheon(settlement) {
  if (!settlement || typeof settlement !== 'object') return settlement;
  const latent = latentPantheonOf(settlement);
  if (!latent) return settlement;              // nothing latent ⇒ untouched
  if (hasActivePantheon(settlement)) return settlement; // already live ⇒ idempotent no-op

  const config = { ...(settlement.config || {}) };
  // The latent records are already field-disciplined frozen snapshots in the
  // setPrimaryDeity/imposeCult shape (written by the retired generation step,
  // and persisted in the save ever since). Copy them VERBATIM: latent and
  // activated data stay byte-equal.
  config.primaryDeityRef = String(latent.patron._deityRef || latent.patron.name || '');
  config.primaryDeitySnapshot = Object.freeze({ ...latent.patron });
  if (Array.isArray(latent.cults) && latent.cults.length) {
    config.cultDeitySnapshots = Object.freeze(latent.cults.map((c) => Object.freeze({ ...c })));
  }
  return { ...settlement, config };
}
