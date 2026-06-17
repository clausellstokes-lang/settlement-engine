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
import { BORDER2, R } from '../theme.js';
import Button from '../primitives/Button.jsx';

export function ModeSwitch({ mapMode, setMapMode, imageMode }) {
  // P110 / M-4 — Routes mode appended to the mode pill group. The
  // existing mode pill is already segmented; this is one more entry.
  // Click promotes relationship/road/supply-chain layers to primary
  // content and fires MAP_ROUTES_MODE_ENTERED analytics.
  // Image-mode maps have no FMG geometry, so Terrain (heightmap/biome editor)
  // and Routes (geography-charted trails) are omitted.
  const modes = [
    { id: MAP_MODES.VIEW,     label: 'View',     Icon: Eye },
    { id: MAP_MODES.TERRAIN,  label: 'Terrain',  Icon: Mountain },
    { id: MAP_MODES.ANNOTATE, label: 'Annotate', Icon: PenTool },
    { id: MAP_MODES.ROUTES,   label: 'Routes',   Icon: LinkIcon },
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
            aria-pressed={active}
          >
            {m.label}
          </Button>
        );
      })}
    </div>
  );
}
