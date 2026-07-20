/**
 * components/townMap/fog/FogPlayerView — DOOR 2 THE TABLE LAYER player view (store-free).
 *
 * The PLAYER audience of the ONE projection: a second-window / shared-screen render of the
 * SAME town map with the fog mask applied and ONLY player-visible pins showing. A pure,
 * STORE-FREE, prop-mounted surface (the InteriorView idiom) — it reads NO store; the DM pane
 * passes the resolved `settlement` + the active session's `reveal` set + the lens + `onClose`.
 *
 * WYSIWYG BY CONSTRUCTION: it renders the EXACT same projection the fogged handout export
 * produces — townMapExportSvg(settlement, { audience:'player', fogReveal }) — so what the
 * players see live is byte-for-byte what a downloaded handout would show. The audience:'player'
 * split drops DM-only markers (fail-closed); fogReveal masks the unrevealed quarters.
 *
 * LAZY: imported by NOTHING eager — the DM pane React.lazy()-loads it — so the fog + export
 * fingerprint stays off first paint (the townMapLazy posture).
 */

import { useMemo } from 'react';
import { INK, MUTED, CARD, sans, FS, SP } from '../../theme.js';
import Button from '../../primitives/Button.jsx';
import { DEFAULT_STYLE_ID } from '../../../design/townMapStyles.js';
import { townMapExportSvg } from '../../../lib/townMapExport.js';

/**
 * @param {{
 *   settlement: any,
 *   reveal?: { districts?: string[], streets?: string[], buildings?: string[] } | null,
 *   styleId?: string,
 *   sessionName?: string,
 *   onClose?: (() => void) | null,
 * }} props
 */
export default function FogPlayerView({ settlement, reveal = null, styleId = DEFAULT_STYLE_ID, sessionName = '', onClose = null }) {
  // The SAME projection the fogged handout export produces (audience:'player' + the mask).
  // A null reveal ⇒ NO fog (an all-visible player view); a reveal set ⇒ the mask applied.
  const svg = useMemo(() => {
    if (!settlement) return null;
    return townMapExportSvg(settlement, {
      style: styleId, resolution: 1000, audience: 'player',
      fogReveal: reveal || undefined, fogOpacity: 1,
    });
  }, [settlement, reveal, styleId]);

  if (!settlement) return null;
  const dataUrl = svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : null;

  return (
    <div
      data-fog-player-view
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: INK,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: SP.md, fontFamily: sans,
      }}
    >
      <div style={{
        position: 'absolute', top: SP.md, left: SP.md, right: SP.md,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.sm,
        color: CARD,
      }}>
        <div style={{ fontSize: FS.md, fontWeight: 600, opacity: 0.85 }}>
          {(settlement && settlement.name) || 'Settlement'}
          {sessionName ? <span style={{ color: MUTED, fontWeight: 400 }}>{`  ·  ${sessionName}`}</span> : null}
        </div>
        {onClose ? (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close player view"
            style={{ color: CARD, borderColor: MUTED }}>
            Exit player view
          </Button>
        ) : null}
      </div>

      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`Player map of ${(settlement && settlement.name) || 'the settlement'}`}
          style={{ display: 'block', maxWidth: '100%', maxHeight: '92vh', width: 'auto', height: 'auto', boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}
        />
      ) : (
        <div style={{ fontSize: FS.md, background: CARD, color: INK, padding: SP.lg }}>
          This settlement has no drawable map.
        </div>
      )}
    </div>
  );
}
