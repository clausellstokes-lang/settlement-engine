/**
 * TerrainToolbar — contextual toolbar for MAP_MODES.TERRAIN.
 *
 * Terrain editing is handled by FMG's built-in editors; this toolbar is a
 * thin facade that calls bridge.activateTool(...) to pop them open. The
 * actual brush interaction happens inside the iframe using FMG's native
 * UI. Our role is to surface those tools from a single place.
 */

import React from 'react';
import { Mountain, Waves, Anchor, Droplet, Trees as TreesIcon, Undo2, Redo2, Info } from 'lucide-react';
import { useStore } from '../../store';
import { TERRAIN_TOOLS } from '../../store/mapSlice.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, sans, FS, SP, R } from '../theme.js';

export default function TerrainToolbar({ bridgeRef }) {
  const terrainTool    = useStore(s => s.terrainTool);
  const setTerrainTool = useStore(s => s.setTerrainTool);

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
      />
      <ToolButton
        active={terrainTool === TERRAIN_TOOLS.RIVERS}
        onClick={() => activate(TERRAIN_TOOLS.RIVERS)}
        Icon={Waves}
        label="Rivers"
      />
      <ToolButton
        active={terrainTool === TERRAIN_TOOLS.COASTLINE}
        onClick={() => activate(TERRAIN_TOOLS.COASTLINE)}
        Icon={Anchor}
        label="Coastline"
      />
      <ToolButton
        active={terrainTool === TERRAIN_TOOLS.LAKES}
        onClick={() => activate(TERRAIN_TOOLS.LAKES)}
        Icon={Droplet}
        label="Lakes"
      />
      <ToolButton
        active={terrainTool === TERRAIN_TOOLS.BIOMES}
        onClick={() => activate(TERRAIN_TOOLS.BIOMES)}
        Icon={TreesIcon}
        label="Biomes"
      />

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
      }}>
        <Info size={12} />
        Pick a tool to open FMG's built-in editor inside the map.
      </div>
    </div>
  );
}

function ToolButton({ active, onClick, Icon, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 12px',
        background: active ? GOLD_BG : CARD,
        border: `1px solid ${active ? GOLD : BORDER}`,
        borderRadius: R.sm,
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
