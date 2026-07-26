/**
 * narrative/historyCoherence.js — the history half of the coherence tail.
 *
 * Three derived history fields are minted by the FULL-ASSEMBLY path only:
 * `historicalCharacter` (generateCoherence), `siegeNarrative`
 * (generateCoherence), and `legacyAnnotations` (the generateNarratives step).
 * generateHistory itself mints none of them — it ships a crude in-generator
 * `historicalCharacter` stub ("stable and prosperous") that assembly then
 * overwrites with real prose.
 *
 * regenHistoryPipeline returned generateHistory's output raw, so "Reroll
 * history" traded a paragraph of authored prose for that stub and dropped both
 * other fields outright — the same structurally-poorer-shape defect the NPC
 * reroll had before enrichNpcCoherence was extracted [generators-domain-3].
 * This module is the shared source both paths now read, so the two cannot
 * drift: `buildStressProfile` and `historySiegeNarrative` live HERE and
 * generateCoherence imports them.
 *
 * Why the composition below is not itself shared with assembly:
 * generateCoherence runs its two fields on separately-forked coherence
 * substreams (label-derived, so order is irrelevant) and the assembly path
 * derives legacyAnnotations several steps EARLIER, against the economicState
 * that step 14 saw. Recomputing it inside generateCoherence would read a
 * later economicState and could change generated output, which THE PROMISE
 * forbids. So assembly keeps its two call sites and the reroll gets one;
 * tests/generators/regenHistoryEnrichment.test.js pins that both produce the
 * same field set.
 */

import { pickRandom2, random01 } from '../helpers.js';
import { collapseArticleSeams } from '../narrativeProse.js';
import { POLITICAL_FLAVOR } from '../narrativeText.js';
import { generateSiegeCapability } from './siegeCapability.js';
import { deriveLegacyAnnotations } from '../legacyGenerator.js';

// ─── buildStressProfile ───────────────────────────────────────────────────────
/**
 * Return a one-sentence historical character description driven by the pattern
 * of event types in the settlement's history. Uses POLITICAL_FLAVOR templates.
 *
 * Draws from the active RNG, so callers that need a stable draw budget wrap it
 * in their own substream (generateCoherence does).
 */
export const buildStressProfile = (events, _tier, _config) => {
  if (!events || events.length === 0) return 'recently established and still finding its character';

  const disasters = events.filter(e => e.type === 'disaster').length;
  const political = events.filter(e => e.type === 'political').length;
  const economic = events.filter(e => e.type === 'economic').length;
  const religious = events.filter(e => e.type === 'religious').length;
  const magical = events.filter(e => e.type === 'magical').length;
  const catastrophic = events.some(e => e.severity === 'catastrophic');

  if (random01(0.15)) {
    return collapseArticleSeams(pickRandom2(POLITICAL_FLAVOR.stable)(events));
  }

  let pattern;
  if (catastrophic) pattern = 'catastrophic';
  else if (political >= 2) pattern = 'political_heavy';
  else if (disasters >= 2) pattern = 'disaster_heavy';
  else if (economic >= 2) pattern = 'economic_heavy';
  else if (religious >= 1 && random01(0.6)) pattern = 'religious_heavy';
  else if (magical >= 1 && random01(0.5)) pattern = 'magical_heavy';
  else if (events.length >= 4 && random01(0.65)) pattern = 'layered_history';
  else pattern = 'stable';

  const subset = {
    political_heavy: events.filter(e => e.type === 'political'),
    disaster_heavy: events.filter(e => e.type === 'disaster'),
    economic_heavy: events.filter(e => e.type === 'economic'),
    religious_heavy: events.filter(e => e.type === 'religious'),
    magical_heavy: events.filter(e => e.type === 'magical'),
    catastrophic: events.filter(e => e.severity === 'catastrophic'),
    layered_history: events,
    stable: events,
  }[pattern];

  const flavors = POLITICAL_FLAVOR[pattern];
  if (!flavors || !subset || subset.length === 0) {
    return collapseArticleSeams(pickRandom2(POLITICAL_FLAVOR.stable)(events));
  }

  return collapseArticleSeams(pickRandom2(flavors)(subset));
};

/**
 * The siege/tension sentence as `history.siegeNarrative` STORES it.
 *
 * generateSiegeCapability passes the raw currentTensions array straight back
 * when recent history supports no sentence; rendering that array printed
 * "[object Object]", so the stored field keeps strings only. Both the assembly
 * path and the reroll must apply the identical filter — that is why the filter
 * lives here beside the producer rather than at each call site.
 *
 * @param {{ historicalEvents?: unknown[], currentTensions?: unknown[], age?: number }} history
 * @returns {string|null}
 */
export const historySiegeNarrative = (history) => {
  const narrative = generateSiegeCapability(
    history.historicalEvents || [],
    history.currentTensions || [],
    history.age || 100,
  );
  return typeof narrative === 'string' ? narrative : null;
};

/**
 * The history coherence-enrichment tail, for the RE-ROLL path.
 *
 * Mirrors enrichNpcCoherence's role: a rerolled history must carry the same
 * derived fields a freshly generated one does, not the poorer raw
 * generateHistory shape. Runs on whatever RNG is active (regenHistoryPipeline
 * sets a seeded one), and reads the FINAL historicalEvents — including any
 * campaign-era entries carried across the reroll — so the character sentence
 * describes the array that is actually stored beside it.
 *
 * @param {{ historicalEvents?: unknown[], currentTensions?: unknown[], age?: number }} history
 *   The freshly generated history, after campaign-era carry-over.
 * @param {{ tier?: string, config?: object, powerStructure?: object,
 *   economicState?: object, institutions?: unknown[] }} settlement
 *   The live settlement being rerolled (supplies the present-day state the
 *   annotations link the past to).
 * @returns {{ historicalCharacter: string, siegeNarrative: string|null,
 *   legacyAnnotations: unknown[] }}
 */
export const enrichHistoryCoherence = (history, settlement) => ({
  historicalCharacter: buildStressProfile(
    history.historicalEvents || [],
    settlement.tier,
    settlement.config,
  ),
  siegeNarrative: historySiegeNarrative(history),
  legacyAnnotations: deriveLegacyAnnotations(history, settlement),
});
