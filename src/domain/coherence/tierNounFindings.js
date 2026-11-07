/**
 * domain/coherence/tierNounFindings.js — DOES THE PAGE CALL THIS PLACE A TOWN WHEN IT IS NOT
 * ONE? (SIZE lane, coherence program, 2026-11-03, root-cause failure 8.)
 *
 * A standalone check over text a reader sees. For a settlement whose tier is not 'town', every
 * singular 'town' (or 'town's') in the text is a finding unless it sits inside a phrase the
 * kernel keeps on purpose (`TIER_NOUN_KEPT`: a genuine comparison, an idiom, an office
 * title). A plural ('towns') is never a finding: it never names this place. A town, and a tier
 * this build does not know, answer [] — the check never guesses a rung.
 *
 * ONE LIST, TWO READERS: the rewriter (`speakTierNoun`) and this check read the same kept
 * phrases, so what the page is allowed to keep and what the check forgives cannot drift.
 *
 * PURE: no React, no store, no seed, no clock.
 */
import { TIER_ORDER } from '../../data/constants.js';
import { tierNounKeptSpans } from '../display/stateProse/stateProseKernel.js';

/**
 * @typedef {{ phrase: string, index: number, context: string }} TierNounFinding
 */

const SINGULAR_TOWN = /(?<=^|[^\p{L}\p{N}_])[Tt]own(?:['’]s)?(?=[^\p{L}\p{N}_]|$)/gu;

/**
 * @param {{ tier?: unknown } | null | undefined} settlement the record (only its tier is read)
 * @param {unknown} renderedText the text a reader sees
 * @returns {TierNounFinding[]}
 */
export function tierNounFindings(settlement, renderedText) {
  const tier = typeof settlement?.tier === 'string' ? settlement.tier : '';
  if (!TIER_ORDER.includes(tier) || tier === 'town') return [];
  if (typeof renderedText !== 'string' || renderedText === '') return [];
  const kept = tierNounKeptSpans(renderedText, tier);
  /** @type {TierNounFinding[]} */
  const findings = [];
  for (const m of renderedText.matchAll(SINGULAR_TOWN)) {
    const index = m.index ?? 0;
    const end = index + m[0].length;
    if (kept.some(([a, b]) => index < b && a < end)) continue;
    findings.push({
      phrase: m[0].replace(/['’]s$/, ''),
      index,
      context: renderedText.slice(Math.max(0, index - 60), Math.min(renderedText.length, end + 40)),
    });
  }
  return findings;
}
