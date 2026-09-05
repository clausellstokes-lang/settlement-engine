/**
 * domain/display/labelBands.js — THE ONE band-word recovery for generated
 * display labels (`"<Band> — <gloss>"`, `"<Band> (<gloss>)"`, `"<Band>; <note>"`).
 *
 * ════════════════════════════════════════════════════════════════════════════
 * THE DEFECT THIS EXISTS TO MAKE IMPOSSIBLE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Three compact display surfaces recovered a BAND WORD from a generated label by
 * splitting on a punctuation mark and taking `[0]`:
 *
 *   SummaryTab.jsx:212  powStab.split(';')[0].split('(')[0].split('—')[0].trim()
 *   SummaryTab.jsx:213  eco.economicComplexity?.split('—')[0].trim()
 *   OverviewTab.jsx:301 sp.safetyLabel?.split('—')[0].trim()
 *
 * A delimiter offset is not a field accessor. It is a guess about where a word
 * ends, and it fails in two directions:
 *
 *  1. ⛔ IT IS ALREADY WRONG, TODAY, ON 174 OF 360 DRIVEN SETTLEMENTS.
 *     `deriveEconomicComplexity` emits ELEVEN strings and only FIVE carry an em
 *     dash — the separator was never a field separator in that vocabulary. On the
 *     other six `split('—')[0]` returns the WHOLE STRING, so a tile whose entire
 *     purpose is the band word prints "Subsistence with minor surplus" and
 *     "Agricultural surplus with trade links". Measured over the 360-settlement
 *     corpus at 5e28d5c83: 174 of 360 (48%).
 *
 *  2. ⚠ AND IT BREAKS ON ANY RE-WORDING. `powerStructure.stability` alone uses
 *     THREE separator conventions in one producer (` — `, ` (…)`, `; `), which is
 *     why the SummaryTab expression is a three-delimiter cascade. Every prose pass
 *     over a gloss is a silent break in a file nobody edited.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * THE CURE: A CLOSED VOCABULARY, NOT A DELIMITER
 * ════════════════════════════════════════════════════════════════════════════
 *
 * The band is recovered by matching the label against the producer's own declared
 * band vocabulary, so the gloss and its punctuation are irrelevant. Re-wording a
 * gloss cannot move a band; RENAMING a band reddens the totality walker
 * (tests/lint/vocabularyTotality.walker.test.js), which binds each vocabulary
 * below to its producer EXACTLY, both ways.
 *
 * There is NO silent default. `bandOf` returns `null` when the label is not in the
 * vocabulary, and each caller states its own fallback in the open. That is the
 * same shape safetySeverity.js uses for the colour of these very labels (its LOUD
 * `unknown` tier), and the same shape economyStateProse.js's `bareCommonFill` uses
 * for a fill: refuse, do not guess.
 *
 * ⛔ ZERO IMPORTS, and keep it that way — this leaf is reachable from the eager
 * first-paint graph through SummaryTab/OverviewTab, exactly like exportPosture.js.
 * Pure: no store, no React, no time, no I/O.
 */

/**
 * SAFETY — every leading strain/severity word `safetyProfile.js` can put at the
 * front of a label. The labels themselves are COMPOSED at runtime
 * (`` `${strainLabel} — ${condition}` ``), so the vocabulary is the token list, not
 * the label list.
 *
 * ⚠ `'Dangerous — Plague Unrest'` is itself one of the producer's `strainLabel`
 * values (safetyProfile.js:119), so that leaf emits
 * `'Dangerous — Plague Unrest — Plague Conditions'` — a label with TWO em dashes
 * whose band is still `Dangerous`. A delimiter split gets that right by luck; a
 * vocabulary match gets it right by construction.
 *
 * This is the same curated list `vocabularyTotality.walker.test.js` binds to
 * safetyProfile.js (lower-cased there for `safetySeverityOf`'s substring test).
 * @type {ReadonlyArray<string>}
 */
export const SAFETY_BANDS = Object.freeze([
  'Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Dangerous', 'Controlled',
  'Tense', 'Strained', 'Desperate', 'Quarantined', 'Restricted', 'Volatile',
  'Critical', 'Suspicious',
]);

/**
 * STABILITY — every label `governanceNarrative.js` can return, by its band word.
 * `deriveBaselineStability` supplies the first eight; `applyStressStability`
 * supplies the rest and may append `'; monster threat active'`
 * (`annotateMonsterThreat`). Three separator conventions, one vocabulary.
 * @type {ReadonlyArray<string>}
 */
export const STABILITY_BANDS = Object.freeze([
  'Enforced Order', 'Unstable', 'Rigid', 'Fragile', 'Tense', 'Stable',
  'Vulnerable', 'Ordered', 'Critical', 'Suppressed', 'Fractured', 'Shaken',
  'Desperate', 'Anxious', 'Volatile', 'Strained',
]);

/**
 * COMPLEXITY — a TOTAL map over `deriveEconomicComplexity`'s closed vocabulary,
 * because that producer returns whole authored strings rather than composing a
 * band with a gloss. Exhausted over (tier × incomeSources 0..14 × exports 0..14 ×
 * hasMarketInst): exactly these eleven, no more.
 *
 * ⛔ THE SIX `null` ROWS ARE THE FINDING, DECLARED. Those six labels have NO band
 * word — the producer never authored one — so there is nothing to recover and
 * `complexityBandOf` says so instead of returning a silent slice of the phrase.
 * They ride 174 of 360 driven settlements. Giving them a band is authoring
 * reader-facing words (the §0c-3 class: chair's, not a lane's); until that is
 * ruled, the caller falls back to the full label, which is byte-for-byte what
 * this surface already renders today.
 * @type {Readonly<Record<string, string|null>>}
 */
export const COMPLEXITY_BAND_BY_LABEL = Object.freeze({
  'Highly diversified — multiple major revenue streams': 'Highly diversified',
  'Diversified — broad institutional economic base': 'Diversified',
  'Concentrated — fewer revenue streams than scale suggests': 'Concentrated',
  'Limited — narrow economic base for this scale': 'Limited',
  'Subsistence — survival economy': 'Subsistence',
  'Diversified market economy': null,
  'Specialized production and trade': null,
  'Mixed subsistence and market': null,
  'Agricultural surplus with trade links': null,
  'Subsistence with minor surplus': null,
  'Subsistence with surplus': null,
});

/**
 * The band a label opens with, or `null`.
 *
 * Longest band first, so a vocabulary containing both `'Safe'` and `'Very Safe'`
 * (or `'Stable'` and `'Unstable'`) cannot resolve to the shorter one — the same
 * ordering hazard safetySeverity.js documents for `'unsafe'` before `'safe'`.
 * The match must end on a word boundary, so `'Stable'` never matches a longer
 * word that merely starts with it.
 *
 * @param {string|null|undefined} label
 * @param {ReadonlyArray<string>} bands
 * @returns {string|null}
 */
export function bandOf(label, bands) {
  const text = typeof label === 'string' ? label.trim() : '';
  if (!text) return null;
  let best = null;
  for (const band of bands) {
    if (!text.startsWith(band)) continue;
    const next = text.charAt(band.length);
    if (next && /[A-Za-z]/.test(next)) continue;
    if (!best || band.length > best.length) best = band;
  }
  return best;
}

/** @param {string|null|undefined} label @returns {string|null} */
export function safetyBandOf(label) {
  return bandOf(label, SAFETY_BANDS);
}

/** @param {string|null|undefined} label @returns {string|null} */
export function stabilityBandOf(label) {
  return bandOf(label, STABILITY_BANDS);
}

/**
 * The complexity band, or `null` for the six labels that have none.
 * An unrecognised label is `null` too — never a slice of itself.
 * @param {string|null|undefined} label
 * @returns {string|null}
 */
export function complexityBandOf(label) {
  const text = typeof label === 'string' ? label.trim() : '';
  if (!text) return null;
  return COMPLEXITY_BAND_BY_LABEL[text] ?? null;
}
