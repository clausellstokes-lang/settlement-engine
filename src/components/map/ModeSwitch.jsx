/**
 * ModeSwitch.jsx — World-map mode pill (View / Terrain / Annotate / Routes).
 *
 * Extracted byte-for-byte from WorldMap.jsx (no logic change). Pure
 * presentational segmented control: clicking a mode promotes its tooling and,
 * for Routes, fires MAP_ROUTES_MODE_ENTERED analytics.
 */

import { Eye, Mountain, PenTool, Link as LinkIcon } from 'lucide-react';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { MAP_MODES } from '../../store/mapSlice.js';
import { BORDER2, ELEV, R } from '../theme.js';
import Button from '../primitives/Button.jsx';

export function ModeSwitch({ mapMode, setMapMode, imageMode }) {
  // Routes mode appended to the mode pill group. The
  // existing mode pill is already segmented; this is one more entry.
  // Click promotes relationship/road/supply-chain layers to primary
  // content and fires MAP_ROUTES_MODE_ENTERED analytics.
  // Image-mode maps have no FMG geometry, so Terrain (heightmap/biome editor)
  // and Routes (geography-charted trails) are omitted.
  // Each mode carries a one-line affordance gloss (title=) so a first-time GM can
  // tell what a segment does before clicking it (the labels are bare verbs/nouns).
  const modes = [
    { id: MAP_MODES.VIEW,     label: 'View',     Icon: Eye,      hint: 'Read the world. Pan and zoom without editing.' },
    { id: MAP_MODES.TERRAIN,  label: 'Terrain',  Icon: Mountain, hint: 'Reshape the land. Edit the heightmap and biomes.' },
    { id: MAP_MODES.ANNOTATE, label: 'Annotate', Icon: PenTool,  hint: 'Mark the map. Place labels and notes.' },
    { id: MAP_MODES.ROUTES,   label: 'Routes',   Icon: LinkIcon, hint: 'Trace the ties. Roads, relationships, and supply chains.' },
  ].filter(m => !imageMode || (m.id !== MAP_MODES.TERRAIN && m.id !== MAP_MODES.ROUTES));
  const handleClick = (id) => {
    setMapMode(id);
    if (id === MAP_MODES.ROUTES) {
      Funnel.track(EVENTS.MAP_ROUTES_MODE_ENTERED);
    }
  };
  return (
    <div style={{
      display: 'flex', gap: 2, padding: 2,
      background: BORDER2, borderRadius: R.md,
    }}>
      {modes.map(m => {
        const active = mapMode === m.id;
        return (
          <Button
            key={m.id}
            onClick={() => handleClick(m.id)}
            variant={active ? 'secondary' : 'ghost'}
            size="md"
            icon={<m.Icon size={13} />}
            title={m.hint}
            aria-pressed={active}
            // The active segment is the primary STATE of the whole stage, so it
            // needs a second emphasis channel beyond its near-tray fill: an
            // inset shadow lifts it off the BORDER2 tray (depth + fill) without
            // borrowing the gold reserved for the one primary action (P4/P8).
            style={active ? { boxShadow: ELEV[1] } : undefined}
          >
            {m.label}
          </Button>
        );
      })}
    </div>
  );
}
