/**
 * safetySeverity.js — the ONE safety-label → display-severity classifier
 * (cycle-3 Wave 2, M2 chokepoint).
 *
 * THE BUG (M2). The DefenseTab and OverviewTab each hand-rolled a substring
 * classifier over the safety label safetyProfile.js emits, to pick the crisis
 * colour. Both OMITTED the 'Strained' prefix — the MIDDLE stress tier
 * (safetyRatio >= 1, worse than 'Tense') — so the very common 'Strained — …'
 * labels fell to a quiet neutral colour, reading as calm. The two classifiers
 * also disagreed with each other (different colours for the same label), so the
 * "mirror" wasn't even a mirror.
 *
 * THE CHOKEPOINT. One TOTAL function over the producer's leading-token
 * vocabulary. Every strain/severity token safetyProfile.js can put at the front
 * of a label maps to a canonical tier with a canonical {color, bg}. There is NO
 * silent neutral default: an unrecognized label lands in a LOUD `unknown` tier
 * that the vocabularyTotality walker asserts no producer label ever reaches — so
 * a new safety label added upstream reddens a test instead of quietly rendering
 * grey. Colours are hex object-values (not inline JSX literals), which the
 * no-raw-color lint permits, exactly as defenseDisplay.js does.
 *
 * TIER SEMANTICS. The four canonical tiers preserve DefenseTab's historical
 * colour pairs byte-for-byte, so every label DefenseTab already classified keeps
 * its exact colour; only the previously-dropped tokens (Strained, Critical,
 * Quarantined, Restricted) newly land in their proper tier.
 */

/** The canonical display-severity tiers, worst → best. @type {ReadonlyArray<string>} */
export const SAFETY_SEVERITY_TIERS = Object.freeze(['dangerous', 'unsafe', 'controlled', 'stable']);

/** @type {Readonly<Record<string, { color: string, bg: string }>>} */
const TIER_STYLE = Object.freeze({
  dangerous:  { color: '#8b1a1a', bg: '#fdf4f4' },
  unsafe:     { color: '#8a4010', bg: '#fdf0e8' },
  controlled: { color: '#5a2a6b', bg: '#f8f0fc' },
  stable:     { color: '#1a5a28', bg: '#f0faf4' },
});

/**
 * The LOUD fallback. An unrecognized label lands here — NOT in a quiet neutral
 * tier that reads as "fine". `key: 'unknown'` is the signal the totality walker
 * keys on (no producer label may reach it). Its colour is the historical neutral
 * gold so a genuinely-unexpected string still renders legibly in production.
 */
const UNKNOWN_STYLE = Object.freeze({ color: '#a0762a', bg: '#faf8ec' });

// Producer leading-token → tier, checked in this ORDER (first substring match
// wins). Order matters in exactly one place: 'unsafe' must be tested before the
// stable 'safe' (the token 'safe' is a substring of 'unsafe'), which is why the
// whole unsafe group precedes the stable group. Every token below is a leading
// strain/severity word safetyProfile.js emits; the crisis names that follow
// ' — ' carry none of these tokens, so the classification keys on the front word.
/** @type {ReadonlyArray<readonly [string, string]>} */
const TOKEN_TIER = Object.freeze([
  ['desperate', 'dangerous'], ['dangerous', 'dangerous'], ['critical', 'dangerous'],
  ['unsafe', 'unsafe'], ['tense', 'unsafe'], ['volatile', 'unsafe'], ['strained', 'unsafe'],
  ['controlled', 'controlled'], ['suspicious', 'controlled'], ['quarantined', 'controlled'], ['restricted', 'controlled'],
  ['very safe', 'stable'], ['moderate', 'stable'], ['safe', 'stable'],
]);

/**
 * Classify a settlement safety label into its canonical display severity.
 * @param {string | null | undefined} safetyLabel  the label safetyProfile emits.
 * @returns {{ key: string, color: string, bg: string }} tier key + colours;
 *   key === 'unknown' (loud fallback) when no producer token is present.
 */
export function safetySeverityOf(safetyLabel) {
  const l = String(safetyLabel || '').toLowerCase();
  for (const [token, tier] of TOKEN_TIER) {
    if (l.includes(token)) return { key: tier, ...TIER_STYLE[tier] };
  }
  return { key: 'unknown', ...UNKNOWN_STYLE };
}
