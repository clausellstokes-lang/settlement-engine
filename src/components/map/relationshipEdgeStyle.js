/**
 * relationshipEdgeStyle.js — the SINGLE source of truth for relationship-edge
 * colors/strokes on the world map.
 *
 * Previously four files hardcoded their own copy of this palette: RelationshipEdges
 * (the lines on the map), LayersPanel (the layer filter chips), MapLegend (the
 * key), and RoutesToolbar (the Routes-mode filter chips). RoutesToolbar's copy had
 * DIVERGED — a user filtering "Trade" there saw a green chip while the map line and
 * legend showed teal. Centralizing here keeps the chip, the legend, and the drawn
 * line in lockstep for every relationship type. Values match the long-standing map
 * palette, so this is a dedupe, not a recolor.
 */

export const REL_EDGE_STYLE = Object.freeze({
  trade_partner: { color: '#0f766e', width: 2,   dash: null,    priority: 2 },
  allied:        { color: '#2563eb', width: 2.2, dash: null,    priority: 3 },
  patron:        { color: '#7c3aed', width: 2,   dash: '6 3',   priority: 2, arrow: true  },
  client:        { color: '#7c3aed', width: 2,   dash: '6 3',   priority: 2, arrow: false },
  vassal:        { color: '#6d28d9', width: 2.3, dash: '8 3',   priority: 3, arrow: true  },
  rival:         { color: '#ea580c', width: 1.8, dash: '2 3',   priority: 1 },
  cold_war:      { color: '#b91c1c', width: 1.8, dash: '1 3',   priority: 1 },
  hostile:       { color: '#991b1b', width: 3,   dash: null,    priority: 4 },
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
  war_front:           { color: '#b91c1c', width: 3,   dash: null,  priority: 5, arrow: true },
  religious_authority: { color: '#9333ea', width: 2.2, dash: '5 3', priority: 4, arrow: true },
});

/** Channel color for a war/faith channel type (falls back to a neutral grey). */
export function relChannelColor(type) {
  return WAR_FAITH_STYLE[type]?.color || '#888';
}
