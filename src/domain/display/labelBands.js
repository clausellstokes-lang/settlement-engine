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
 *  1. ⛔ IT WAS ALREADY WRONG ON 174 OF 360 DRIVEN SETTLEMENTS.
 *     `deriveEconomicComplexity` emits ELEVEN strings and only FIVE carry an em
 *     dash — the separator was never a field separator in that vocabulary. On the
 *     other six `split('—')[0]` returned the WHOLE STRING, so a tile whose entire
 *     purpose is the band word printed "Subsistence with minor surplus" and
 *     "Agricultural surplus with trade links". Measured over the 360-settlement
 *     corpus at 5e28d5c83: 174 of 360 (48%). Closed 2026-09-05, when the chair
 *     authored the six missing band words — see COMPLEXITY_BAND_BY_LABEL. The
 *     same census now reports 0 of 360.
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
 * ⭐ ELEVEN OF ELEVEN CARRY A BAND, and six of them did not until 2026-09-05.
 * Five producer labels spell their band before a gloss (`"<Band> — <gloss>"`); the
 * other six are whole phrases the producer never gave a band word at all, and they
 * rode 174 of 360 driven settlements printing themselves in full into a tile whose
 * entire purpose is the band word.
 *
 * ⛔ THE SIX BAND WORDS BELOW ARE THE CHAIR'S, authored by the Fable 5.1 chair on
 * 2026-09-05 as a §0c-3 reader-facing-words act and replayed here VERBATIM. They
 * are not this file's, not a lane's, and not derivable — a later reader who wants
 * to change one asks the chair, exactly as one would for the gloss text itself.
 *
 * THE RULE THE CHAIR FOLLOWED, so the map can be extended the same way: the band
 * word is the label's OWN HEAD WORD, exactly as the five dashed labels already do.
 * No word enters the reader's page that the label did not already carry — which is
 * why the totality walker can assert `label.startsWith(band)` on all eleven rows.
 *
 * ⚠ `Subsistence` names THREE labels and `Diversified` TWO. That is deliberate and
 * declared: a band is a CLASS, not an identifier. The tile shows the band; the full
 * label keeps the gloss that separates them. Do not "resolve" the collision by
 * inventing a word — that would be authoring, and authoring is the chair's.
 * ⛔ THE ELEVEN STRINGS ARE NAMED ONCE, HERE, AND EVERY KEYED MAP IN src/domain IS BUILT
 * FROM THESE CONSTANTS. `economyStateProse.js`'s `{complexity}` fill table keyed on the same
 * eleven strings by a second transcription; a re-wording of one producer label would have
 * desynchronised the two silently, each still passing its own totality arm.
 *
 * ⛔ AND THEY ARE STILL NOT READ FROM THEIR AUTHOR. `src/generators/economy/prosperity.js`
 * writes them, and importing them from there would drag the economy generator and its
 * transitive graph into the eager first-paint chunk (the ZERO IMPORTS law above) and into
 * every tab chunk that draws (economyStateProse.js's own recorded reason). The estate ruled
 * this direction once already: `priorityToCategory` was re-homed OUT of that generator and
 * INTO a dependency-free domain leaf so presentation could read the same vocabulary without
 * the graph. A vocabulary moves TOWARDS this leaf, never away from it.
 * @type {Readonly<Record<string, string>>}
 */
export const COMPLEXITY_LABEL = Object.freeze({
  HIGHLY_DIVERSIFIED: 'Highly diversified — multiple major revenue streams',
  DIVERSIFIED: 'Diversified — broad institutional economic base',
  CONCENTRATED: 'Concentrated — fewer revenue streams than scale suggests',
  LIMITED: 'Limited — narrow economic base for this scale',
  SUBSISTENCE: 'Subsistence — survival economy',
  MARKET_ECONOMY: 'Diversified market economy',
  SPECIALIZED: 'Specialized production and trade',
  MIXED: 'Mixed subsistence and market',
  AGRICULTURAL: 'Agricultural surplus with trade links',
  MINOR_SURPLUS: 'Subsistence with minor surplus',
  SURPLUS: 'Subsistence with surplus',
});

/**
 * The band a producer label opens with, keyed through the constants above rather than
 * through a second transcription of the same eleven strings.
 * @type {Readonly<Record<string, string>>}
 */
export const COMPLEXITY_BAND_BY_LABEL = Object.freeze({
  [COMPLEXITY_LABEL.HIGHLY_DIVERSIFIED]: 'Highly diversified',
  [COMPLEXITY_LABEL.DIVERSIFIED]: 'Diversified',
  [COMPLEXITY_LABEL.CONCENTRATED]: 'Concentrated',
  [COMPLEXITY_LABEL.LIMITED]: 'Limited',
  [COMPLEXITY_LABEL.SUBSISTENCE]: 'Subsistence',
  [COMPLEXITY_LABEL.MARKET_ECONOMY]: 'Diversified',
  [COMPLEXITY_LABEL.SPECIALIZED]: 'Specialized',
  [COMPLEXITY_LABEL.MIXED]: 'Mixed',
  [COMPLEXITY_LABEL.AGRICULTURAL]: 'Agricultural',
  [COMPLEXITY_LABEL.MINOR_SURPLUS]: 'Subsistence',
  [COMPLEXITY_LABEL.SURPLUS]: 'Subsistence',
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
 * The complexity band of a producer label.
 *
 * The map is TOTAL over `deriveEconomicComplexity`, so `null` now means one thing
 * only: this string did not come from that producer. An unrecognised label is
 * refused — never returned as a slice of itself.
 *
 * ⚠ `Object.hasOwn` before the read, not `?? null` after it. A bare object literal
 * inherits `Object.prototype`, so `COMPLEXITY_BAND_BY_LABEL['constructor']` is a
 * FUNCTION and `??` passes it straight through — this function's declared
 * `string|null` was false for `constructor`, `toString`, `valueOf`,
 * `hasOwnProperty`, `isPrototypeOf` and `__proto__`, and its caller renders the
 * result into a React child. Unreachable from the producer; wrong all the same.
 *
 * @param {string|null|undefined} label
 * @returns {string|null}
 */
export function complexityBandOf(label) {
  const text = typeof label === 'string' ? label.trim() : '';
  if (!text) return null;
  return Object.hasOwn(COMPLEXITY_BAND_BY_LABEL, text) ? COMPLEXITY_BAND_BY_LABEL[text] : null;
}
