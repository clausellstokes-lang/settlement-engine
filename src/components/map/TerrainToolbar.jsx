/**
 * TerrainToolbar — contextual toolbar for MAP_MODES.TERRAIN.
 *
 * Most of FMG's per-feature editors (rivers, coastline, lakes) require a
 * clicked map element as their input — they read `d3.event.target` and break
 * silently when called from a context-free toolbar button. So those buttons
 * have been removed; users double-click the feature directly on the map to
 * edit it (the hint at the right of the toolbar surfaces that workflow).
 *
 * What remains:
 *   • Heightmap — opens FMG's heightmap editor (works from a toolbar because
 *                 editHeightmap defensively defaults its options arg).
 *   • Biomes    — split control: the main button toggles the visibility of
 *                 the biomes SVG layer; the adjacent pencil opens FMG's
 *                 native biomes editor (editBiomes) so users can repaint
 *                 biome regions even while the layer is on. Toggle is wired
 *                 to mapState.layers.nativeBiomes via the standard layer-
 *                 toggle path in WorldMap.jsx.
 *   • Undo / Redo — passed through to FMG's history.
 */

import { Mountain, Trees as TreesIcon, Undo2, Redo2, Info, Pencil } from 'lucide-react';
import { useStore } from '../../store';
import { TERRAIN_TOOLS } from '../../store/mapSlice.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, sans, FS, SP, R } from '../theme.js';

export default function TerrainToolbar({ bridgeRef }) {
  const terrainTool    = useStore(s => s.terrainTool);
  const setTerrainTool = useStore(s => s.setTerrainTool);
  const nativeBiomes   = useStore(s => s.mapState.layers.nativeBiomes);
  const toggleLayer    = useStore(s => s.toggleLayer);

  async function activate(tool) {
    setTerrainTool(tool);
    const bridge = bridgeRef?.current;
    if (!bridge?.isReady) return;
    try {
      await bridge.activateTool(tool);
    } catch (err) {
      console.warn('[TerrainToolbar] activateTool failed', err);
    }
  }

  // Biomes is a pure visibility toggle — flipping the store flag fires the
  // setFmgLayer effect in WorldMap.jsx, which shows/hides the #biomes SVG
  // group. No editor dialog, no per-feature selection required.
  function toggleBiomes() {
    toggleLayer('nativeBiomes');
  }

  // Open FMG's native biomes editor dialog. Available as a separate
  // affordance (the pencil button next to Biomes) so users can toggle
  // visibility without losing the ability to edit, and vice versa.
  async function editBiomes() {
    const bridge = bridgeRef?.current;
    if (!bridge?.isReady) return;
    // Make sure the layer is on first — editing a hidden layer is confusing.
    if (!nativeBiomes) toggleLayer('nativeBiomes');
    try {
      await bridge.activateTool('biomes');
    } catch (err) {
      console.warn('[TerrainToolbar] biomes editor failed', err);
    }
  }

  async function undo() {
    const bridge = bridgeRef?.current;
    if (!bridge?.isReady) return;
    try { await bridge.terrainUndo(); } catch (e) {}
  }

  async function redo() {
    const bridge = bridgeRef?.current;
    if (!bridge?.isReady) return;
    try { await bridge.terrainRedo(); } catch (e) {}
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      padding: `${SP.sm}px ${SP.md}px`,
      background: CARD, borderRadius: R.lg, border: `1px solid ${BORDER}`,
    }}>
      <ToolButton
        active={terrainTool === TERRAIN_TOOLS.HEIGHTMAP}
        onClick={() => activate(TERRAIN_TOOLS.HEIGHTMAP)}
        Icon={Mountain}
        label="Heightmap"
        title="Open FMG's heightmap editor — paint terrain elevation."
      />
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        <ToolButton
          active={!!nativeBiomes}
          onClick={toggleBiomes}
          Icon={TreesIcon}
          label={nativeBiomes ? 'Hide Biomes' : 'Show Biomes'}
          title="Toggle the biomes overlay on or off. Click again to reverse."
          attached="right"
        />
        <button
          onClick={editBiomes}
          title="Open FMG's biomes editor — repaint biome regions or change classification."
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 8px',
            background: nativeBiomes ? GOLD_BG : CARD,
            // Long-hand borders so React doesn't conflict-warn between
            // `border` shorthand and `borderLeft: none` longhand.
            borderTop:    `1px solid ${nativeBiomes ? GOLD : BORDER}`,
            borderRight:  `1px solid ${nativeBiomes ? GOLD : BORDER}`,
            borderBottom: `1px solid ${nativeBiomes ? GOLD : BORDER}`,
            borderLeft:   'none',
            borderTopRightRadius: R.sm,
            borderBottomRightRadius: R.sm,
            color: nativeBiomes ? INK : SECOND,
            cursor: 'pointer',
          }}
        >
          <Pencil size={12} />
        </button>
      </div>

      <div style={{ width: 1, height: 24, background: BORDER2 }} />

      <button onClick={undo} title="Undo" style={iconBtnStyle}>
        <Undo2 size={13} />
      </button>
      <button onClick={redo} title="Redo" style={iconBtnStyle}>
        <Redo2 size={13} />
      </button>

      <div style={{ flex: 1 }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xxs, color: MUTED, fontStyle: 'italic',
        maxWidth: 360, lineHeight: 1.35,
      }}>
        <Info size={12} style={{ flexShrink: 0 }} />
        <span>
          To edit a river, lake, or coastline, double-click it directly on
          the map — FMG's per-feature editor will open in place.
        </span>
      </div>
    </div>
  );
}

function ToolButton({ active, onClick, Icon, label, title, attached }) {
  // `attached="right"` flattens the right side so the button can dock against
  // a sibling (the biomes-editor pencil) without a visible seam between them.
  const radiusStyle = attached === 'right'
    ? { borderTopLeftRadius: R.sm, borderBottomLeftRadius: R.sm,
        borderTopRightRadius: 0, borderBottomRightRadius: 0 }
    : { borderRadius: R.sm };
  return (
    <button
      onClick={onClick}
      title={title || label}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 12px',
        background: active ? GOLD_BG : CARD,
        border: `1px solid ${active ? GOLD : BORDER}`,
        ...radiusStyle,
        color: active ? INK : SECOND,
        fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

const iconBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 26,
  padding: 0,
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: R.sm,
  color: INK, cursor: 'pointer',
};
