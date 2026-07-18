/**
 * components/townMap/fog/SettlementMapFogControls — DOOR 2 the DM fog control panel.
 *
 * The DM's table-mode chrome: engage fog, pick/create a named session, choose the reveal brush
 * (reveal vs hide × auto/district/street/building), reveal-all / hide-all, open the live PLAYER
 * VIEW (shared screen), and export the fogged handout. Presentational — every action routes
 * through the useMapFog controller (which commits to the fogSessions sidecar). Gated by `editing`
 * (the pane's cosmetic-edit predicate); viewing a revealed map is free.
 */
import { useState } from 'react';
import { INK, MUTED, BORDER, CARD, GREEN, AMBER, sans, FS, R, SP } from '../../theme.js';
import Button from '../../primitives/Button.jsx';

const BRUSH_KINDS = [
  ['auto', 'Auto'], ['districts', 'Quarter'], ['streets', 'Street'], ['buildings', 'Building'],
];

const selStyle = {
  fontFamily: sans, fontSize: FS.sm, color: INK, background: CARD,
  border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: `2px 6px`,
};

/**
 * @param {{
 *   fog: ReturnType<typeof import('./useMapFog.js').useMapFog>,
 *   editing: boolean,
 *   onOpenPlayerView: () => void,
 *   onExportHandout: () => void,
 * }} props
 */
export default function SettlementMapFogControls({ fog, editing, onOpenPlayerView, onExportHandout }) {
  const [newName, setNewName] = useState('');
  const {
    sessionIds, activeSessionId, sessionName, fogActive, toggleFog, selectSession,
    brushMode, setBrushMode, brushKind, setBrushKind, hasReveal,
    createSession, deleteActive, revealAll, hideAll,
  } = fog;

  const wrap = {
    fontFamily: sans, fontSize: FS.sm, color: INK, background: CARD,
    border: `1px solid ${BORDER}`, borderRadius: R.md, padding: SP.sm,
    display: 'flex', flexDirection: 'column', gap: SP.xs, minWidth: 220,
  };
  const row = { display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' };

  return (
    <div data-fog-controls style={wrap}>
      <div style={{ ...row, justifyContent: 'space-between' }}>
        <strong style={{ fontSize: FS.sm, letterSpacing: '0.02em' }}>Table / Fog</strong>
        <label htmlFor="fog-engage" style={{ ...row, gap: 4, cursor: editing ? 'pointer' : 'not-allowed', opacity: editing ? 1 : 0.5 }}>
          <input id="fog-engage" type="checkbox" checked={fogActive} disabled={!editing} onChange={toggleFog} aria-label="Engage fog of war" />
          <span style={{ color: MUTED }}>{fogActive ? 'On' : 'Off'}</span>
        </label>
      </div>

      {!editing ? (
        <div style={{ color: MUTED }}>Fog editing needs an editable saved map on desktop.</div>
      ) : !fogActive ? (
        <div style={{ color: MUTED }}>Engage fog to reveal the map for players quarter by quarter.</div>
      ) : (
        <>
          {/* Session picker + create */}
          <div style={row}>
            <select
              aria-label="Active fog session"
              style={selStyle}
              value={activeSessionId || ''}
              onChange={(e) => selectSession(e.target.value)}
            >
              {sessionIds.length === 0 ? <option value="">No session yet</option> : null}
              {sessionIds.map((id) => (
                <option key={id} value={id}>{fog.activeEntry && id === activeSessionId ? sessionName : id}</option>
              ))}
            </select>
            {activeSessionId ? (
              <Button variant="ghost" size="sm" onClick={deleteActive} title="Delete this session">Delete</Button>
            ) : null}
          </div>
          <div style={row}>
            <input
              aria-label="New session name"
              placeholder="New session…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newName.trim()) { createSession(newName); setNewName(''); } }}
              style={{ ...selStyle, flex: 1, minWidth: 90 }}
            />
            <Button variant="secondary" size="sm" disabled={!newName.trim()} onClick={() => { createSession(newName); setNewName(''); }}>Add</Button>
          </div>

          {activeSessionId ? (
            <>
              {/* Brush mode + granularity */}
              <div style={row}>
                <Button variant={brushMode === 'reveal' ? 'primary' : 'ghost'} size="sm"
                  onClick={() => setBrushMode('reveal')} style={brushMode === 'reveal' ? { background: GREEN } : undefined}>Reveal</Button>
                <Button variant={brushMode === 'hide' ? 'primary' : 'ghost'} size="sm"
                  onClick={() => setBrushMode('hide')} style={brushMode === 'hide' ? { background: AMBER } : undefined}>Hide</Button>
                <select aria-label="Reveal granularity" style={selStyle} value={brushKind} onChange={(e) => setBrushKind(e.target.value)}>
                  {BRUSH_KINDS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                </select>
              </div>
              <div style={{ color: MUTED, fontSize: FS.xs }}>
                Click the map to {brushMode === 'reveal' ? 'reveal' : 'hide'} the {brushKind === 'auto' ? 'nearest feature' : brushKind.replace(/s$/, '')}.
              </div>
              <div style={row}>
                <Button variant="ghost" size="sm" onClick={revealAll}>Reveal all</Button>
                <Button variant="ghost" size="sm" onClick={hideAll}>Hide all</Button>
              </div>
              {/* Audiences */}
              <div style={{ ...row, marginTop: SP.xs }}>
                <Button variant="secondary" size="sm" onClick={onOpenPlayerView}>Player view</Button>
                <Button variant="ghost" size="sm" onClick={onExportHandout} disabled={!hasReveal} title={hasReveal ? 'Download a fogged player handout' : 'Reveal something first'}>Handout</Button>
              </div>
            </>
          ) : (
            <div style={{ color: MUTED, fontSize: FS.xs }}>Add a session to start revealing.</div>
          )}
        </>
      )}
    </div>
  );
}
