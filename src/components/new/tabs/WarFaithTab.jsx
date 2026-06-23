/**
 * WarFaithTab — the dossier's "War & Faith" sub-tab (dossier keystone §1).
 *
 * Re-homes WarFaithSection into the tabbed dossier so a FRESH OutputContainer
 * generation meets it (previously it lived only in the Workshop scroll, the
 * legacy SummaryTab, and the PDF). This thin wrapper resolves the owning
 * campaign's LIVE worldState via useSettlementLiveWorld — the SAME lookup the
 * legacy SummaryTab's FaithWarBlock used — and hands the pure projections down,
 * since OutputContainer does not otherwise thread worldState.
 *
 * WarFaithSection self-gates to nothing for a peaceful, deity-free, non-campaign
 * town, so a clean settlement pays nothing. The tab PRESENCE is gated upstream in
 * OutputContainer (deity snapshot OR saveId present), mirroring the
 * plot_hooks/dm_compass conditional-tab pattern, so a peaceful deity-free
 * non-campaign town shows no empty War & Faith tab at all.
 */

import WarFaithSection from '../../settlement/WarFaithSection.jsx';
import { useSettlementLiveWorld } from '../../../hooks/useSettlementLiveWorld.js';

/**
 * @param {{ settlement: any, saveId?: string|null }} props
 */
export default function WarFaithTab({ settlement, saveId = null }) {
  const { worldState, regionalGraph, settlements, nameFor } = useSettlementLiveWorld(saveId);
  return (
    <div data-testid="war-faith-tab" style={{ padding: '12px 14px' }}>
      <WarFaithSection
        settlement={settlement}
        settlementId={saveId || settlement?.id || settlement?.config?.id}
        worldState={worldState}
        regionalGraph={regionalGraph}
        settlements={settlements}
        nameFor={nameFor}
      />
    </div>
  );
}
