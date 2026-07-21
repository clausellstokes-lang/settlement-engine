/**
 * components/townMap/fog/SettlementMapFogControls — DOOR 2 the DM fog control panel.
 *
 * The DM's table-mode chrome: engage fog, pick/create a named session, choose the reveal brush
 * (reveal vs hide × auto/district/street/building), reveal-all / hide-all, open the live PLAYER
 * VIEW (shared screen), and export the fogged handout. Presentational — every action routes
 * through the useMapFog controller (which commits to the fogSessions sidecar).
 *
 * ENTITLEMENT (THE FREELY-GIVEN RULINGS, 2026-07-17): the table layer is PREMIUM (Cartographer),
 * riding the SAME predicate as every cosmetic map edit (canEdit = premium|founder|elevated).
 * The PREMIUM-SEAM LAW (the mapChains precedent) holds: the gate wraps the AFFORDANCE, never
 * the derivation — `!entitled` renders the panel LOCKED-VISIBLE (a drawn padlock + teaser;
 * clicking fires `onUnlock` → the purchase modal, the cosmetic-edit gate's own moment) and no
 * fog interaction mounts. Stored fogSessions are never rewritten while locked, so an upgrade
 * restores every session untouched. `editing` (entitled ∧ saveId ∧ desktop) additionally gates
 * the working chrome — an entitled owner on mobile sees the device note, not the lock.
 * Drawn-SVG padlock, no lucide (the map's icons-off posture).
 */
import { useState } from 'react';
import { INK, MUTED, BORDER, CARD, GREEN, AMBER, sans, FS, SP } from '../../theme.js';
import Button from '../../primitives/Button.jsx';

/** A small drawn padlock (the map chrome is lucide-free). */
function LockGlyph({ size = 14 }) {
  return (
    <svg data-testid="fog-controls-lock" width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
      <rect x="2.5" y="6" width="9" height="6.5" rx="1.5" fill="none" stroke={INK} strokeWidth="1.5" />
      <path d="M 4.5 6 V 4.2 a 2.5 2.5 0 0 1 5 0 V 6" fill="none" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

const BRUSH_KINDS = [
  ['auto', 'Auto'], ['districts', 'Quarter'], ['streets', 'Street'], ['buildings', 'Building'],
];

const selStyle = {
  fontFamily: sans, fontSize: FS.sm, color: INK, background: CARD,
  border: `1px solid ${BORDER}`, padding: `2px 6px`,
};

/**
 * @param {{
 *   fog: ReturnType<typeof import('./useMapFog.js').useMapFog>,
 *   editing: boolean,
 *   entitled?: boolean,
 *   onUnlock?: () => void,
 *   onOpenPlayerView: () => void,
 *   onExportHandout: () => void,
 * }} props
 */
export default function SettlementMapFogControls({ fog, editing, entitled = false, onUnlock, onOpenPlayerView, onExportHandout }) {
  const [newName, setNewName] = useState('');
  const {
    sessionIds, activeSessionId, sessionName, fogActive, toggleFog, selectSession,
    brushMode, setBrushMode, brushKind, setBrushKind, hasReveal,
    createSession, deleteActive, revealAll, hideAll,
  } = fog;

  const wrap = {
    fontFamily: sans, fontSize: FS.sm, color: INK, background: CARD,
    border: `1px solid ${BORDER}`, padding: SP.sm,
    display: 'flex', flexDirection: 'column', gap: SP.xs, minWidth: 220,
  };
  const row = { display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' };

  // THE LOCKED STATE (locked is VISIBLE, never absent — the mapChains law): the free tier
  // sees the affordance with a drawn padlock + teaser; clicking fires the purchase modal.
  // No fog interaction mounts, and stored fogSessions are never touched from here.
  if (!entitled) {
    return (
      <div data-fog-controls style={wrap}>
        <div style={{ ...row, justifyContent: 'space-between' }}>
          <strong style={{ fontSize: FS.sm, letterSpacing: '0.02em' }}>Table / Fog</strong>
          <LockGlyph />
        </div>
        <div style={{ color: MUTED, fontSize: FS.xs }}>
          Run a live table session. Reveal quarters, streets, and buildings as your players explore.
        </div>
        <Button
          variant="secondary" size="sm"
          onClick={() => { if (typeof onUnlock === 'function') onUnlock(); }}
          aria-label="Fog of war is a Cartographer premium feature. Upgrade to unlock"
        >
          Fog of war (Premium)
        </Button>
        <div style={{ color: MUTED, fontSize: FS.xs }}>Unlocks with Cartographer.</div>
      </div>
    );
  }

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
              <Button variant="ghost" size="sm" onClick={deleteActive} aria-label="Delete this fog session">Delete</Button>
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
                <Button variant="ghost" size="sm" onClick={onExportHandout} disabled={!hasReveal} aria-label="Download a fogged player handout">Handout</Button>
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
