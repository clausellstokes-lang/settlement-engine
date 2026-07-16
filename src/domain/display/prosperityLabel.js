/**
 * domain/display/prosperityLabel.js — the TOLERANT prosperity read
 * (components-dossier-library-3).
 *
 * `economicState.prosperity` is a STRING label from the generator
 * (deriveProsperityLabel → 'Struggling'..'Wealthy'; galleryUtils.PROSPERITY_OPTIONS
 * is its vocabulary). Two display surfaces (SummaryTabV2, TableView) read it as an
 * OBJECT — `prosperity?.tier` — which is ALWAYS undefined for a string, so the
 * default-on magazine Summary's prosperity + stressors block never rendered.
 *
 * This helper reads the label whatever shape it arrives in: a plain string, or a
 * defensive `{ tier }` object (a future shape the read tolerates without breaking).
 * Pure; no store, no rng. Trivial leaf — byte-inert.
 *
 * @param {unknown} prosperity  economicState.prosperity (string label, or {tier}).
 * @returns {string}  the label, or '' when absent/unreadable.
 */
export function prosperityLabel(prosperity) {
  if (typeof prosperity === 'string') return prosperity.trim();
  if (prosperity && typeof prosperity === 'object') {
    const tier = /** @type {{ tier?: unknown }} */ (prosperity).tier;
    if (typeof tier === 'string') return tier.trim();
    if (typeof tier === 'number' && Number.isFinite(tier)) return String(tier);
  }
  return '';
}
