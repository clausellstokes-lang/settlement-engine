/**
 * domain/display/navalDisplay.js — the naval-legibility read-model
 * (experience-product-fit-5). W-NAVY promised the sea would become "the legibility
 * surface of a real number", yet navalStrength had ZERO display consumers and no
 * standing surface answered "who commands the sea; is this port blockaded now?" —
 * only scroll-back news.
 *
 * THE STANDING BLOCKADE SURFACE (the liveSieges idiom — "a blockade is the same as
 * a siege" is the wave's own law): every port a hostile navy blockades RIGHT NOW,
 * with its blockaders and a banded strangulation, read from the navalTransit
 * ledger. The blockade record's strength IS the blockading navy's navalStrengthOf,
 * folded into the strangulation band — so the "real number" surfaces here.
 *
 * DORMANT ⇒ []: a campaign with no navalTransit blockade records (the layer dark)
 * yields an empty list, so the panel renders nothing extra — byte-identical.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock. Lazy-only leaf (rides
 * the realm-inspector chunk) so it never drags the naval engine into first paint.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { activeBlockadeTargets, blockadeStrangulationOf } from '../spatial/navalLayer.js';

const STRANGULATION_WORDS = Object.freeze(['a loose blockade', 'a tightening blockade', 'a stranglehold']);

/** 0..1 strangulation → a banded phrase. @param {number} s */
export function blockadeStrangulationBand(s) {
  const v = typeof s === 'number' && Number.isFinite(s) ? s : 0;
  if (v >= 0.75) return 2;
  if (v >= 0.4) return 1;
  return 0;
}

/**
 * Every port under a standing blockade, with its blockaders and banded
 * strangulation, codepoint-ordered by port. The realm read for "which ports does
 * a hostile fleet command right now?". Dormant (no blockade records) ⇒ [].
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {Array<{ portId: string, blockaders: string[], strangulation: number, band: number, phrase: string }>}
 */
export function liveBlockades(worldState) {
  const targets = activeBlockadeTargets(worldState);
  if (!targets || targets.size === 0) return [];
  /** @type {Array<{ portId: string, blockaders: string[], strangulation: number, band: number, phrase: string }>} */
  const out = [];
  for (const portId of [...targets.keys()].map(String).sort(compareCodepoint)) {
    const owners = targets.get(portId);
    const blockaders = [...(owners || new Set())].map(String).sort(compareCodepoint);
    const strangulation = blockadeStrangulationOf(worldState, portId);
    const band = blockadeStrangulationBand(strangulation);
    out.push({ portId, blockaders, strangulation, band, phrase: STRANGULATION_WORDS[band] });
  }
  return out;
}

/**
 * Panel presence gate: does this world carry ANY standing blockade? Dormant ⇒
 * false ⇒ the surface renders nothing ⇒ byte-identical UI.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {boolean}
 */
export function hasLiveBlockades(worldState) {
  const targets = activeBlockadeTargets(worldState);
  return !!targets && targets.size > 0;
}
