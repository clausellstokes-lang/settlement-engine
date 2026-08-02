/**
 * components/townMap/subtabs/MapPlayerSubTab — TC-0, the Map tab's PLAYER VIEW
 * sub-tab (DESIGN_TOWN_CARTOGRAPHY.md §12 / J-TC-8).
 *
 * The fog / audience projection promoted from a button buried in the DM's fog
 * chrome to a sibling of Plan and Portrait: "what my table sees" is a
 * presentation of the settlement, not a mode of the editor.
 *
 * ONE PROJECTION, ONE SOURCE. This surface derives nothing of its own. It calls
 * the SAME `townMapExportSvg(settlement, { audience: 'player', fogReveal })` that
 * the fogged handout download and the fullscreen FogPlayerView call, so the
 * inline preview, the shared screen, and the downloaded handout cannot disagree.
 * The `audience: 'player'` split drops DM-only markers by PROJECTION (fail-closed,
 * never by paint-time filtering); the reveal set masks the unrevealed quarters.
 *
 * THE SESSION IS PERSISTED, THE ENGAGEMENT IS NOT. `settlement.fogSessions` is
 * durable state (it rides the blob through every lifecycle path); whether the DM
 * currently has the fog overlay engaged is ephemeral pane state that does not
 * belong to this surface. So this reads the sessions straight off the settlement
 * and lets the reader choose which one to project, and says plainly when a
 * settlement has no session at all rather than implying the table sees everything
 * by accident.
 *
 * STORE-FREE and prop-mounted (the FogPlayerView / InteriorView posture): a lazy
 * leaf reached only from MapTabShell.
 */

import { lazy, Suspense, useMemo, useState } from 'react';
import { BORDER, CARD, FS, INK, MUTED, SP, sans } from '../../theme.js';
import Button from '../../primitives/Button.jsx';
import Segmented from '../../primitives/Segmented.jsx';
import { readMapEdits, readStyleLens } from '../../../domain/townMap/mapEdits.js';
import {
  listFogSessionIds,
  readFogSession,
  readFogSessions,
  readReveal,
  sessionHasReveal,
} from '../../../domain/townMap/fogSessions.js';
import { townMapExportSvg } from '../../../lib/townMapExport.js';

// The fullscreen shared-screen surface, unchanged and reused rather than
// re-implemented: the second-window render the DM throws onto the table.
const FogPlayerView = lazy(() => import('../fog/FogPlayerView.jsx'));

/** Build sentinel — see MapTabShell's, and tests/build/mapTabShellLazy.test.js. */
export const MAP_PLAYER_SUBTAB_LAZY_SENTINEL = 'settlementforge:map-player-subtab:lazy-v1';

const noteStyle = {
  fontFamily: sans, fontSize: FS.sm, color: MUTED, lineHeight: 1.5, margin: 0,
};

/**
 * @param {{ settlement: any }} props
 */
export default function MapPlayerSubTab({ settlement }) {
  const [openOnShared, setOpenOnShared] = useState(false);
  const [pickedId, setPickedId] = useState(/** @type {string|null} */ (null));

  const sessions = useMemo(() => readFogSessions(settlement), [settlement]);
  const sessionIds = useMemo(() => listFogSessionIds(sessions), [sessions]);
  const activeId = (pickedId && sessionIds.includes(pickedId)) ? pickedId : (sessionIds[0] || null);
  const activeEntry = useMemo(
    () => (activeId ? readFogSession(sessions, activeId) : null),
    [sessions, activeId],
  );
  // A session with nothing revealed would mask the WHOLE map. That is a legitimate
  // table state (the party has seen nothing yet), so it is projected honestly and
  // named below rather than quietly degraded to an unfogged map.
  const reveal = activeEntry ? readReveal(activeEntry) : null;
  const styleId = useMemo(() => readStyleLens(readMapEdits(settlement)), [settlement]);
  const sessionName = (activeEntry && activeEntry.name) || activeId || '';

  const svg = useMemo(() => {
    if (!settlement) return null;
    return townMapExportSvg(settlement, {
      style: styleId, resolution: 1000, audience: 'player',
      fogReveal: reveal || undefined, fogOpacity: 1,
    });
  }, [settlement, styleId, reveal]);

  const dataUrl = svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : null;

  return (
    <div
      data-map-player-subtab={MAP_PLAYER_SUBTAB_LAZY_SENTINEL}
      style={{
        display: 'flex', flexDirection: 'column', gap: SP.sm,
        padding: SP.md, background: CARD, border: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.sm, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: INK }}>
            What the table sees
          </div>
          <p style={noteStyle}>
            {sessionIds.length === 0
              ? 'No table session has been started for this settlement, so nothing is hidden. Every quarter below is visible to the players.'
              : sessionHasReveal(activeEntry)
                ? 'The players see the revealed quarters below. Everything else stays under the fog.'
                : 'This session has revealed nothing yet, so the players see none of the town.'}
          </p>
        </div>
        {dataUrl && (
          <Button size="sm" onClick={() => setOpenOnShared(true)}>
            Open on the shared screen
          </Button>
        )}
      </div>

      {sessionIds.length > 1 && (
        <Segmented
          size="sm"
          ariaLabel="Table session"
          value={activeId || ''}
          onChange={setPickedId}
          options={sessionIds.map((id) => ({ id, label: readFogSession(sessions, id)?.name || id }))}
        />
      )}

      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`Player map of ${(settlement && settlement.name) || 'the settlement'}`}
          style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${BORDER}` }}
        />
      ) : (
        <p style={noteStyle}>This settlement has no drawable map yet.</p>
      )}

      {openOnShared && (
        <Suspense
          fallback={(
            <p role="status" aria-live="polite" aria-busy="true" style={noteStyle}>
              Carrying the map to the shared screen&hellip;
            </p>
          )}
        >
          <FogPlayerView
            settlement={settlement}
            reveal={reveal}
            styleId={styleId}
            sessionName={sessionName}
            onClose={() => setOpenOnShared(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
