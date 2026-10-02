/**
 * HousesBlock.jsx — FP IN-3, THE HOUSES BLOCK (docs/DESIGN_FP_INFORMATION.md §5 IN-3, the
 * volume's CORRECTED dossier clause: the house sub-program was a dossier orphan, three mechanisms
 * and no landing).
 *
 * Each information house standing in the town, the power it truly serves (DM truth), and what the
 * town itself knows of that service: `projectPatronBindings` projected for the PLAYER audience with
 * the organic exposure producer supplying its `exposed` list (`patronExposure.js ::
 * projectedPatronBindingsFor`), so a covert patron reads "not known" until the world turns it up.
 * This block is that projection's FIRST non-test consumer.
 *
 * ⛔ DM-ONLY, FAIL-CLOSED, on WatchPanel's composed seam (props the container holds; no second
 * premium comparison). Any other reader renders NOTHING and throws nothing, and a world where the
 * counter-game or the brokerages are dark renders nothing either. Not mounted by this wave: the
 * town page's mount is the page owner's.
 */
import { useMemo } from 'react';

import { counterIntelActive } from '../../../domain/worldPulse/suspicion.js';
import { projectPatronBindings } from '../../../domain/worldPulse/brokeragePatronage.js';
import { projectedPatronBindingsFor } from '../../../domain/worldPulse/patronExposure.js';
import { FS, MUTED, BODY, BORDER, CARD_ALT, sans } from '../../theme.js';
import { serif } from '../Primitives';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import useIsMobile from '../../../hooks/useIsMobile.js';

/**
 * @param {{ worldState?: any, settlement?: any, regionalGraph?: any,
 *   viewerIsPremium?: boolean, playerView?: boolean, publicDossier?: boolean }} props
 */
export default function HousesBlock({ worldState = null, settlement = null, regionalGraph = null, viewerIsPremium = false, playerView = false, publicDossier = false }) {
  const mobile = useIsMobile();
  const includeGroundTruth = viewerIsPremium && !playerView && !publicDossier;
  const id = settlement && settlement.id != null ? String(settlement.id) : '';
  const houses = useMemo(() => {
    if (!includeGroundTruth || !id || !counterIntelActive(worldState)) return [];
    const item = { id, settlement };
    const snapshot = { byId: new Map([[id, item]]), regionalGraph };
    const dm = projectedPatronBindingsFor({ worldState, snapshot, item, audience: 'dm' });
    const known = projectPatronBindings(dm.bindings, { audience: 'player', exposed: dm.exposed });
    return dm.bindings.map((row, index) => ({ row, known: known[index], exposed: dm.exposed.includes(row.institutionId) }));
  }, [includeGroundTruth, id, worldState, settlement, regionalGraph]);
  if (houses.length === 0) return null;
  return (
    <section data-testid="houses-block" style={{ display: 'grid', gap: 8, border: `1px solid ${BORDER}`, background: CARD_ALT, padding: '9px 11px' }}>
      <div style={{ ...serif, color: BODY, fontSize: chromeFontSize(FS.sm, mobile), fontWeight: 700 }}>The houses</div>
      {houses.map(({ row, known, exposed }) => (
        <div key={row.institutionId} data-testid="house-row" style={{ display: 'grid', gap: 2 }}>
          <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), fontWeight: 800 }}>
            {row.houseName} ({row.legality === 'illegal' ? 'a whisper market' : 'a licensed house'})
          </div>
          <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile) }}>
            Serves {row.patronName}{row.source === 'captured' ? ', taken by force' : ''}.
          </div>
          <div data-testid="house-known" style={{ color: MUTED, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile) }}>
            {row.covert
              ? (exposed ? `The town now knows it serves ${known.patronName}.` : 'The town does not know whom it serves.')
              : 'Its patron is a public fact.'}
          </div>
        </div>
      ))}
    </section>
  );
}
