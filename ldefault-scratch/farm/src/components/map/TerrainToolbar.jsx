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
import { BODY, BORDER, ELEV, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

export default function TerrainToolbar({ bridgeRef, bridgeReady = false }) {
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
    // Second row of the shared toolbar card (WorldMap.jsx) — no border/fill of
    // its own; a single top hairline divides it from the mode row (P5).
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      padding: `${SP.sm}px ${SP.md}px`,
      borderTop: `1px solid ${BORDER}`,
    }}>
      <ToolButton
        active={terrainTool === TERRAIN_TOOLS.HEIGHTMAP}
        onClick={() => activate(TERRAIN_TOOLS.HEIGHTMAP)}
        Icon={Mountain}
        label="Heightmap"
        title="Open the heightmap editor. Paint terrain elevation."
        disabled={!bridgeReady}
      />
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        <ToolButton
          active={!!nativeBiomes}
          onClick={toggleBiomes}
          Icon={TreesIcon}
          label={nativeBiomes ? 'Hide Biomes' : 'Show Biomes'}
          title="Toggle the biomes overlay on or off. Click again to reverse."
          attached="right"
          disabled={!bridgeReady}
        />
        <IconButton
          Icon={Pencil}
          label="Open the biomes editor. Repaint biome regions or change classification."
          onClick={editBiomes}
          pressed={!!nativeBiomes}
          size="sm"
          disabled={!bridgeReady}
        />
      </div>

      {/* Differential spacing (P5) separates the edit-tools cluster from the
          history cluster — no hairline divider. */}
      <div style={{ width: SP.lg }} />

      <IconButton Icon={Undo2} label="Undo" onClick={undo} size="lg" disabled={!bridgeReady} />
      <IconButton Icon={Redo2} label="Redo" onClick={redo} size="lg" disabled={!bridgeReady} />

      <div style={{ flex: 1 }} />

      {/* Visibility of status (P10): until the engine is up the tools above are
          disabled, so the hint says WHY rather than leaving silent dead clicks. */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, color: BODY,
        maxWidth: 360, lineHeight: 1.35,
      }}>
        <Info size={12} style={{ flexShrink: 0 }} />
        <span>
          {bridgeReady
            ? 'To edit a river, lake, or coastline, double-click it directly on the map. The per-feature editor opens in place.'
            : 'The map engine is still loading… terrain tools will enable once it’s ready.'}
        </span>
      </div>
    </div>
  );
}

function ToolButton({ active, onClick, Icon, label, title, attached, disabled }) {
  // `attached="right"` flattens the right side so the button can dock against
  // a sibling (the biomes-editor pencil) without a visible seam between them.
  // This is essential layout the Button variants can't express, so it's passed
  // through as style residue (Button merges `style` last).
  // Active toggles carry a SECOND channel beyond their secondary fill — the
  // same inset ELEV[1] shadow ModeSwitch and the map IconButton use — so
  // "selected" reads identically across every map-chrome toggle (P11/P7).
  const radiusStyle = {
    ...(attached === 'right'
      ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
      : {}),
    ...(active ? { boxShadow: ELEV[1] } : {}),
  };
  return (
    <Button
      // Active state uses the subordinate `secondary` channel, not `gold`: an
      // active-tool toggle is STATE, not a CTA, so the gold CTA channel stays
      // reserved for the page's one real primary (Advance Realm). Mirrors the
      // ModeSwitch secondary-active / ghost-inactive convention (P8/P4).
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      icon={<Icon size={13} />}
      title={title || label}
      onClick={onClick}
      aria-pressed={active}
      disabled={disabled}
      style={radiusStyle}
    >
      {label}
    </Button>
  );
}
