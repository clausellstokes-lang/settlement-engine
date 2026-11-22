/**
 * components/compendium/deityDraftPreview.js — the ONE source function behind the
 * deity effect preview (Phase 5 W-C4).
 *
 * A drafted deity IS a deity snapshot in shape (it carries the same `alignmentAxis`
 * / `lawAxis` / `rankAxis` field names the engine embed uses), so this function
 * reads the SAME sources the engine and the dossier read — never hand-copied
 * numbers, never duplicated prose:
 *
 *   - couplings — the exact axis→engine couplings, from the shared single source
 *     domain/display/deityEffects.describeDeityEffects (corruption direction, the
 *     aggression drive, religious-authority lift, magic legality, law_order +
 *     corruption tolerance). A re-tune in any engine file flows through here
 *     automatically.
 *   - stance    — the inter-deity STANCE GEOMETRY, banded from the two signed
 *     alignment coordinates the stance core is built on (deityAxes.evil01), with
 *     the band prose living once in copy/deityAuthoring.
 *   - synergy   — the GOVERNMENT synergy, banded from the law-axis sign the stance
 *     core reads (deityStance.lawSign): a lawful god props a traditional ruler’s
 *     mandate, a chaotic god undercuts it.
 *
 * PURE, rng-free, no store/React — a fully-neutral / unranked draft yields empty
 * couplings (the dormancy guarantee) and no stance/synergy line.
 */

import { describeDeityEffects } from '../../domain/display/deityEffects.js';
import { evil01, chaos01 } from '../../domain/worldPulse/deityAxes.js';
import { td } from '../../copy/deityAuthoring.js';

// The signed law-axis direction: +1 lawful · −1 chaotic · 0 neutral/legacy —
// identical to deityStance.lawSign, recomputed here from the dependency-free
// deityAxes leaf so the preview does NOT pull the deityStance chunk into the
// lazy Compendium preload set (first-paint manifest discipline). @param {DeityDraft} d
const lawSign = (d) => { const c = chaos01(d); return c < 0.5 ? 1 : c > 0.5 ? -1 : 0; };

/**
 * @typedef {{ alignmentAxis?: string, lawAxis?: string, rankAxis?: string,
 *   temperamentAxis?: string, domain?: string, portfolio?: string }} DeityDraft
 * @typedef {{ couplings: string[], stance: string|null, synergy: string|null }} DeityDraftPreview
 */

/**
 * Describe what a drafted deity will do — the single source the DeityEffectPreview
 * renders. @param {DeityDraft|null|undefined} draft @returns {DeityDraftPreview}
 */
export function describeDeityDraft(draft) {
  const couplings = describeDeityEffects(draft || {});

  // STANCE GEOMETRY — banded from the malice coordinate (evil01) the stance core
  // is built on. Only spoken when the god takes a moral side (a neutral core is
  // fully-zero stance — the byte-identity anchor — so it says nothing new here).
  const malice = evil01(draft);
  /** @type {string|null} */
  let stance = null;
  if (malice > 0.5) stance = td('preview.stance.evilTransactional');
  else if (malice < 0.5) stance = td('preview.stance.goodConsolidated');

  // GOVERNMENT SYNERGY — banded from the law-axis sign (lawSign): +1 lawful props
  // the mandate, −1 chaotic undercuts it, 0 neutral/legacy says nothing.
  const law = lawSign(draft);
  /** @type {string|null} */
  let synergy = null;
  if (law > 0) synergy = td('preview.synergy.lawful');
  else if (law < 0) synergy = td('preview.synergy.chaotic');

  return { couplings, stance, synergy };
}
