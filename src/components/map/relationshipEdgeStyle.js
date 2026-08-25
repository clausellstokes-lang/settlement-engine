/**
 * relationshipEdgeStyle.js — the shared source of truth for relationship-edge and
 * war/faith-channel colors/strokes on the world map.
 *
 * RelationshipEdges (the lines on the map) and MapLegend (the key) both read from
 * here, so the drawn line and the legend that explains it can never disagree on a
 * color, dash, or label (P11). REL_EDGE_STYLE keeps the SAME hues OUR map has always
 * drawn (the static authored-neighbour edges are byte-identical); WAR_FAITH_STYLE is
 * the net-new pulse-minted war/faith channel styling.
 *
 * NOTE — THEIRS routed REL_EDGE_STYLE colors through settlements/relationshipColors.js
 * (relColor). That module is absent on OUR floor and lives in another wave's fence, so
 * this module carries the literal hues directly (OUR existing map palette) rather than
 * pull that dependency. When relationshipColors lands, this can migrate to relColor.
 */

// Edge METADATA (color/width/dash/priority/arrow) + the type LIST. Colors are OUR
// existing map palette (previously inlined in RelationshipEdges), preserved exactly so
// the authored-neighbour edges render byte-identically.
export const REL_EDGE_STYLE = Object.freeze({
  trade_partner: { color: '#0f766e', width: 2,   dash: null,  priority: 2 },
  allied:        { color: '#2563eb', width: 2.2, dash: null,  priority: 3 },
  patron:        { color: '#7c3aed', width: 2,   dash: '6 3', priority: 2, arrow: true  },
  client:        { color: '#7c3aed', width: 2,   dash: '6 3', priority: 2, arrow: false },
  vassal:        { color: '#6d28d9', width: 2.3, dash: '8 3', priority: 3, arrow: true  },
  rival:         { color: '#ea580c', width: 1.8, dash: '2 3', priority: 1 },
  cold_war:      { color: '#b91c1c', width: 1.8, dash: '1 3', priority: 1 },
  hostile:       { color: '#991b1b', width: 3,   dash: null,  priority: 4 },
});

/** Edge color for a relationship type (falls back to a neutral grey). */
export function relEdgeColor(type) {
  return REL_EDGE_STYLE[type]?.color || '#888';
}

/**
 * The canonical relationship-type LIST (id + label + color) the legend rows draw
 * from. The color is always derived from REL_EDGE_STYLE so name and hue can never
 * drift apart. Order is the display order (calmest → most hostile).
 */
export const REL_TYPES = Object.freeze(
  [
    { id: 'trade_partner', label: 'Trade partner' },
    { id: 'allied',        label: 'Allied' },
    { id: 'patron',        label: 'Patron' },
    { id: 'client',        label: 'Client' },
    { id: 'vassal',        label: 'Vassal' },
    { id: 'rival',         label: 'Rival' },
    { id: 'cold_war',      label: 'Cold war' },
    { id: 'hostile',       label: 'Hostile' },
  ].map(t => Object.freeze({ ...t, color: relEdgeColor(t.id) })),
);

/**
 * §S3 — pulse-minted war/faith channels rendered as directed map edges, shared so
 * the LEGEND can never claim a color the map (RelationshipEdges) doesn't draw.
 * war_front is the red siege front-line (besieger → besieged); religious_authority
 * is the purple faith overlay along an allied/trade edge. war_front's hue matches
 * regionalMapOverlay's war_front channel color so the drawn edge, the spatial siege
 * glyphs (WarFaithMapOverlay), and this key all agree.
 */
export const WAR_FAITH_STYLE = Object.freeze({
  war_front:           { color: '#b91c1c', width: 3,   dash: null,  priority: 5, arrow: true },
  religious_authority: { color: '#6a2a9a', width: 2.2, dash: '5 3', priority: 4, arrow: true },
});

/** Channel color for a war/faith channel type (falls back to a neutral grey). */
export function relChannelColor(type) {
  return WAR_FAITH_STYLE[type]?.color || '#888';
}
