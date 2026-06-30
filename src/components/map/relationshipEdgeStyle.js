/**
 * relationshipEdgeStyle.js — the SINGLE source of truth for relationship-edge
 * colors/strokes on the world map.
 *
 * Previously four files hardcoded their own copy of this palette: RelationshipEdges
 * (the lines on the map), LayersPanel (the layer filter chips), MapLegend (the
 * key), and RoutesToolbar (the Routes-mode filter chips). RoutesToolbar's copy had
 * DIVERGED — a user filtering "Trade" there saw a green chip while the map line and
 * legend showed teal. Centralizing here keeps the chip, the legend, and the drawn
 * line in lockstep for every relationship type. The hues are now the muted
 * parchment brand set (relationshipColors.js), reconciled from the old vivid map
 * palette so the map agrees with the dossier and PDF.
 */

import { relColor } from '../settlements/relationshipColors.js';

// Edge COLORS derive from the canonical brand palette (relationshipColors.js) so
// the map line, the dossier chip, and the PDF line share one muted parchment hue
// per type. This module owns the edge METADATA (width/dash/priority/arrow) and the
// type LIST. criminal_network was previously uncolored on the map (grey fallback)
// despite being a real canonical relationship type — now covered.
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
 * The canonical relationship-type LIST (id + label) — the ONE place the filter
 * chips, the legend rows, and the Routes-mode chips draw their names from. The
 * three surfaces previously inlined their own copies and DIVERGED on wording
 * ("Trade partner" vs "Trade", "Cold war" vs "Cold"). Centralizing the list
 * here keeps the label identical everywhere; the color is always derived from
 * REL_EDGE_STYLE above so name and hue can never drift apart. Order is the
 * display order (calmest → most hostile).
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
 * §S3 — pulse-minted war/faith channels rendered as directed map edges, shared
 * so the LEGEND can never claim a color the map (RelationshipEdges) doesn't
 * draw. war_front is the red siege front-line (besieger → besieged);
 * religious_authority is the purple faith overlay along an allied/trade edge.
 * Three files previously re-typed `#b91c1c` independently; this is the one home.
 */
export const WAR_FAITH_STYLE = Object.freeze({
  war_front:           { color: relColor('hostile'), width: 3,   dash: null,  priority: 5, arrow: true },
  religious_authority: { color: '#6a2a9a',           width: 2.2, dash: '5 3', priority: 4, arrow: true },
});

/** Channel color for a war/faith channel type (falls back to a neutral grey). */
export function relChannelColor(type) {
  return WAR_FAITH_STYLE[type]?.color || '#888';
}
