/**
 * WorldMapTourSteps.js — guided-help step data for the world map.
 *
 * Extracted verbatim from WorldMap.jsx (no content change). §16 — guided-help
 * steps. Each spotlights a control by its data-tour anchor; a step whose target
 * isn't on screen (e.g. campaign-only controls) shows a centered card instead of
 * being skipped silently.
 */

export const WORLD_MAP_TOUR_STEPS = [
  { sel: 'mode',     title: 'Map modes', body: 'Switch between View, Terrain, Annotate, and Routes. Each mode swaps the toolbar below for tools specific to that task.' },
  { sel: 'map',      title: 'Place & select settlements', body: 'Drag a saved canon settlement from the palette onto the map to place it, then click any placed settlement to select and inspect it.' },
  { sel: 'campaign', title: 'Campaign', body: 'Pick the campaign this map belongs to. Settlements, relationships, and the World Pulse are all scoped to the active campaign.' },
  { sel: 'save',     title: 'Save the map', body: 'Save your placements, layers, and viewport to the campaign so the map is exactly as you left it next time.' },
  { sel: 'layers',   title: 'Layers', body: 'Toggle overlays: relationships, supply chains, labels, biomes, borders. Focus on what matters right now.' },
  { sel: 'pulse',    title: 'World Pulse', body: 'Advance the realm and watch it run. Linked settlements ripple events to their neighbours over time.' },
  { sel: 'inspector', title: 'Wizard News', body: 'Read the in-world bulletin of recent realm events, a narrative digest of what the simulation produced.' },
  { sel: 'help',     title: 'Replay this tour', body: 'You can reopen this walkthrough any time from this ? button. That’s the tour. Happy worldbuilding.' },
];
