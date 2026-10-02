/**
 * WatchPanel.jsx — FP IN-3, THE WATCH PANEL: `sightPostures`' FIRST UI consumer (the survey's
 * named missing surface, the twin of BeliefDivergenceBand; docs/DESIGN_FP_INFORMATION.md §5 IN-3
 * "Dossier round-trip pin"; J-INF-12).
 *
 * The DM asking "is anyone spying on my town?" finds it here: whom the town watches, who watches
 * the town (DM TRUTH), the town's own suspicion band, and whether its gates stand closed.
 *
 * ⛔ DM-ONLY, FAIL-CLOSED. The DM seam is composed from props the container already holds (the
 * RelationshipsTab convention: `viewerIsPremium && !playerView && !publicDossier`), so no second
 * premium comparison is minted here. Any other reader renders NOTHING and throws nothing, and a
 * world where the counter-game is dark renders nothing either (the layer's surface lights with the
 * layer). The read is `counterIntelSweep.js :: watchRowsFor`, the DM-truth side; the suspicion
 * band inside it never read truth.
 *
 * PURE PROPS: no store read, so the component is its own fixture. Not mounted by this wave: the
 * town page's mount is the page owner's (IN-3's report names the slot).
 */
import { useMemo } from 'react';

import { counterIntelActive } from '../../../domain/worldPulse/suspicion.js';
import { watchRowsFor } from '../../../domain/worldPulse/counterIntelSweep.js';
import { FS, MUTED, BODY, BORDER, CARD_ALT, sans } from '../../theme.js';
import { serif } from '../Primitives';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import useIsMobile from '../../../hooks/useIsMobile.js';

/** @param {{ label: string, rows: Array<{ id: string, covert: boolean }>, empty: string, nameFor: (id: string) => string }} props */
function WatchList({ label, rows, empty, nameFor }) {
  const mobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gap: 3 }}>
      <div style={{ color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800 }}>{label}</div>
      {rows.length === 0
        ? <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile) }}>{empty}</div>
        : rows.map((row) => (
          <div key={row.id} data-testid="watch-row" style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile) }}>
            {nameFor(row.id)} {row.covert ? '(covert eyes)' : '(open watch)'}
          </div>
        ))}
    </div>
  );
}

/**
 * @param {{ worldState?: any, settlement?: any, regionalGraph?: any, nameFor?: (id: string) => string,
 *   viewerIsPremium?: boolean, playerView?: boolean, publicDossier?: boolean }} props
 */
export default function WatchPanel({ worldState = null, settlement = null, regionalGraph = null, nameFor = (id) => id, viewerIsPremium = false, playerView = false, publicDossier = false }) {
  const mobile = useIsMobile();
  const includeGroundTruth = viewerIsPremium && !playerView && !publicDossier;
  const id = settlement && settlement.id != null ? String(settlement.id) : '';
  const rows = useMemo(() => {
    if (!includeGroundTruth || !id || !counterIntelActive(worldState)) return null;
    const snapshot = { byId: new Map([[id, { id, settlement }]]), regionalGraph };
    return watchRowsFor({ worldState, snapshot, settlementId: id });
  }, [includeGroundTruth, id, worldState, settlement, regionalGraph]);
  if (!rows) return null;
  return (
    <section data-testid="watch-panel" style={{ display: 'grid', gap: 8, border: `1px solid ${BORDER}`, background: CARD_ALT, padding: '9px 11px' }}>
      <div style={{ ...serif, color: BODY, fontSize: chromeFontSize(FS.sm, mobile), fontWeight: 700 }}>Who watches</div>
      <WatchList label="This town watches" rows={rows.watches.map((r) => ({ id: r.targetId, covert: r.covert }))} empty="No one." nameFor={nameFor} />
      <WatchList label="Watching this town" rows={rows.watchedBy.map((r) => ({ id: r.watcherId, covert: r.covert }))} empty="No one, as far as the record goes." nameFor={nameFor} />
      <div data-testid="watch-suspicion" style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile) }}>
        The court&apos;s suspicion reads {rows.suspicion.band}; its gates stand {rows.gateClosed ? 'closed' : 'open'}.
      </div>
    </section>
  );
}
