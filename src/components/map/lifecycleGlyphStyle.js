/**
 * lifecycleGlyphStyle.js — the shared source of truth for the W-LIFECYCLE map
 * glyph hues (satellite steadings, the charter-pending ring, the relic-ruin
 * column). PlacementsLayer draws them and MapLegend documents them, so — like
 * relationshipEdgeStyle for edges — the drawn glyph and the key that explains it
 * can never disagree on a color (P11). Previously these hues were inlined in
 * PlacementsLayer with no legend row at all (components-map-2: the legend and the
 * line must agree).
 */

export const LIFECYCLE_GLYPH_STYLE = Object.freeze({
  // Satellite steading orbit dot (parent-routed, cosmetic).
  steading: Object.freeze({ fill: '#6b5340', stroke: '#f5efe4', label: 'Satellite steading' }),
  // The ring drawn around a steading whose charter has not yet been granted.
  charterRing: Object.freeze({ stroke: '#a0762a', label: 'Charter pending' }),
  // A generation-seeded ancient relic ruin near a settlement, or a settlement
  // that died into ruins.
  ruin: Object.freeze({ fill: '#7a6a52', stroke: '#4a3a28', label: 'Relic ruin / abandoned' }),
});
