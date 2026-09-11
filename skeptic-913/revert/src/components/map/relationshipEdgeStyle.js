/**
 * relationshipEdgeStyle.js — the SINGLE source of truth for relationship-edge and
 * war/faith-channel colors/strokes on the world map.
 *
 * RelationshipEdges (the lines on the map) and MapLegend (the key) both read from
 * here, so the drawn line and the legend that explains it can never disagree on a
 * color, dash, or label (P11). REL_EDGE_STYLE derives its hues from the canonical
 * cross-surface palette (settlements/relationshipColors.js) so the map line, the
 * dossier neighbour chip, and the PDF relationship line share ONE muted parchment
 * hue per type; this module owns the edge METADATA (width/dash/priority/arrow) and
 * the type LIST. criminal_network is a real canonical relationship type that was
 * left to a grey fallback on the map — now covered. WAR_FAITH_STYLE is the net-new
 * pulse-minted war/faith channel styling.
 */

import { relColor } from '../settlements/relationshipColors.js';

// Edge METADATA (color/width/dash/priority/arrow) + the type LIST. Colors derive
// from the canonical brand palette (relColor) so the map line, the dossier chip,
// and the PDF line share one muted parchment hue per type.
export const REL_EDGE_STYLE = Object.freeze({
  trade_partner:    { color: relColor('trade_partner'),    width: 2,   dash: null,  priority: 2 },
  allied:           { color: relColor('allied'),           width: 2.2, dash: null,  priority: 3 },
  patron:           { color: relColor('patron'),           width: 2,   dash: '6 3', priority: 2, arrow: true  },
  client:           { color: relColor('client'),           width: 2,   dash: '6 3', priority: 2, arrow: false },
  vassal:           { color: relColor('vassal'),           width: 2.3, dash: '8 3', priority: 3, arrow: true  },
  rival:            { color: relColor('rival'),            width: 1.8, dash: '2 3', priority: 1 },
  cold_war:         { color: relColor('cold_war'),         width: 1.8, dash: '1 3', priority: 1 },
  hostile:          { color: relColor('hostile'),          width: 3,   dash: null,  priority: 4 },
  criminal_network: { color: relColor('criminal_network'), width: 1.8, dash: '3 2', priority: 2 },
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
    { id: 'criminal_network', label: 'Criminal network' },
  ].map(t => Object.freeze({ ...t, color: relEdgeColor(t.id) })),
);

/**
 * §S3 — pulse-minted war/faith channels rendered as directed map edges, shared so
 * the LEGEND can never claim a color the map (RelationshipEdges) doesn't draw.
 * war_front is the red siege front-line (besieger → besieged); religious_authority
 * is the purple faith overlay along an allied/trade edge. war_front's hue is the
 * literal #b91c1c (NOT relColor('hostile')) so it matches regionalMapOverlay's
 * war_front channel — the drawn edge, the spatial siege glyphs (WarFaithMapOverlay),
 * and this key all agree (mapPaletteSingleSource pins that agreement).
 */
export const WAR_FAITH_STYLE = Object.freeze({
  war_front:           { color: '#b91c1c', width: 3,   dash: null,  priority: 5, arrow: true },
  religious_authority: { color: '#6a2a9a', width: 2.2, dash: '5 3', priority: 4, arrow: true },
});

/** Channel color for a war/faith channel type (falls back to a neutral grey). */
export function relChannelColor(type) {
  return WAR_FAITH_STYLE[type]?.color || '#888';
}
