/**
 * WorldMapTourSteps.js — guided-help step data for the world map.
 *
 * §16 — guided-help steps. Each spotlights a control by its data-tour anchor; a
 * step whose target isn't on screen (e.g. campaign-only controls) shows a centered
 * card instead of being skipped silently. Ordered left→right along the toolbar.
 *
 * V-25f TEACHING TRANCHE: the steps were brought current with the toolbar as it
 * stands today — the stale "Wizard News" step is now the Realm Inspector, the
 * advance cluster teaches the interval + Undo, and the History walk-back and the
 * "?" control reference (both previously untaught) each got a step. A pin
 * (worldMapTourSteps.test.js) now asserts every anchored step matches a real
 * control, so the tour can't silently drift from the toolbar again.
 */

export const WORLD_MAP_TOUR_STEPS = [
  { sel: 'mode',      title: 'Map modes', body: 'Switch between View, Terrain, Annotate, and Routes. Each mode swaps the toolbar below for tools specific to that task.' },
  { sel: 'map',       title: 'Place & select settlements', body: 'Drag a saved canon settlement from the palette onto the map to place it, then click any placed settlement to select and inspect it.' },
  { sel: 'campaign',  title: 'Campaign', body: 'Pick the campaign this map belongs to. Settlements, relationships, and the realm’s living state are all scoped to the active campaign.' },
  { sel: 'save',      title: 'Save the map', body: 'Save your placements, layers, and viewport to the campaign so the map is exactly as you left it next time.' },
  { sel: 'pulse',     title: 'Advance the realm', body: 'Choose how far to move — a week, month, season, or year — then Advance Realm and watch it run. Linked settlements ripple events to their neighbours. Undo Advance steps the last move back.' },
  { sel: 'history',   title: 'Advance history', body: 'Every advance is remembered. Open History to walk back to any earlier point in the campaign — a byte-exact return, not a guess.' },
  { sel: 'layers',    title: 'Layers', body: 'Toggle overlays: relationships, supply chains, labels, biomes, borders. Focus on what matters right now.' },
  { sel: 'controls',  title: 'What am I looking at?', body: 'The “?” opens an in-place reference for every control on this toolbar — the same teaching, reachable on touch, without hunting for a hover tooltip.' },
  { sel: 'inspector', title: 'Realm Inspector', body: 'Open the inspector for the realm’s read surfaces — the news bulletin, the chronicler’s letter, the timelapse, and the road scene — the DM’s window into what the simulation is doing and why.' },
  { sel: 'help',      title: 'Replay this tour', body: 'Reopen this walkthrough any time from the Help button. That’s the tour — happy worldbuilding.' },
];
