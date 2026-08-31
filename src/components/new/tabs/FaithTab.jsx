/**
 * FaithTab — the dossier's WORLD-group FAITH tab (§805: the faith half of the
 * old WarFaithTab, split out; the layout deepens as the W-FAITH / W-LIVES
 * trains land).
 *
 * THE NON-NEGOTIABLE (unchanged from the WarFaithTab lineage): this composes
 * OUR gated FaithSection — the Phase-4 W-F6 CONSTITUTIONAL premium seam.
 * Free/anon see the generic true-neutral teaser and NEVER a deity name; an
 * owned/shared embed renders the read-only panel to everyone. This file never
 * adopts THEIRS' ungated WarFaithSection / useSettlementLiveWorld (those read
 * the live pantheon with no tier check).
 *
 * A premium, deity-free, non-campaign town renders the honest absence note
 * (FaithSection's HIDDEN mode would otherwise leave a blank body).
 */

import { useMemo } from 'react';
import FaithSection from '../../settlement/FaithSection.jsx';
import { faithPanelModel } from '../../settlement/faithPanelModel.js';
import { useStore } from '../../../store/index.js';
import { FS, MUTED, sans } from '../../theme.js';

/**
 * @param {{ settlement: any, publicDossier?: boolean }} props
 */
export default function FaithTab({ settlement, publicDossier = false }) {
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const isPremium = tier === 'premium' || elevated;

  // Mirror FaithSection's mode resolution for the honest-absence note through
  // the SAME model (never a second spelling of the embed check): the section
  // renders SOMETHING unless the viewer is premium/elevated AND the settlement
  // carries no deity embed (its HIDDEN mode).
  const hasEmbed = useMemo(() => !!faithPanelModel(settlement).hasEmbed, [settlement]);
  const faithWillRender = hasEmbed || !isPremium;

  return (
    <div data-testid="faith-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {/* The gated faith surface — the constitutional seam, unchanged. */}
      <FaithSection settlement={settlement} publicDossier={publicDossier} />
      {!faithWillRender && (
        <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.6 }}>
          This settlement keeps no named faith. Assign a patron deity to awaken its pantheon.
        </div>
      )}
    </div>
  );
}
