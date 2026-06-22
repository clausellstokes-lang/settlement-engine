/**
 * SubstrateTab — the Substrate sub-tab. Mounts CausalViewTabs (16-var grid +
 * band "why" + 9 pressures + settlementStrength with the war-cost penalty + the
 * homeostasis story), feeding it the owning campaign's LIVE worldState /
 * regionalGraph so a live siege/condition colours the pressures. Standalone
 * (non-campaign) settlements degrade to the frozen-generation grid.
 *
 * Depth is controlled by a LOCAL control on this tab (Overview / Detail /
 * Engine), not the old global dossier toggle: the engine grid is the one place
 * where the depth difference is dramatic (nothing -> pressured rows -> the full
 * 16-var grid), so the control lives on the content it modulates. Defaults to
 * Detail so the tab opens on "where the pressure is" rather than an empty face.
 */

import { useState } from 'react';
import CausalViewTabs from '../../settlement/CausalViewTabs.jsx';
import AltitudeControl from '../../common/AltitudeControl.jsx';
import { useSettlementLiveWorld } from '../../../hooks/useSettlementLiveWorld.js';
import { FS, MUTED, BODY, INK, sans, serif_, SP } from '../../theme.js';

/**
 * @param {{ settlement: any, saveId?: string|null }} props
 */
export default function SubstrateTab({ settlement, saveId = null }) {
  // Local depth — scoped to this tab, not the global reading pref. Opens at
  // Detail (pressured rows); Overview collapses to the explainer, Engine shows
  // the full grid + pressures + strength.
  const [level, setLevel] = useState('standard');
  const { worldState, regionalGraph } = useSettlementLiveWorld(saveId);

  return (
    <div data-testid="substrate-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', marginBottom: SP.sm }}>
        <span style={{ flex: 1, fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>
          Causal substrate
        </span>
        <AltitudeControl size="sm" ariaLabel="Substrate detail level" value={level} onChange={setLevel} />
      </div>

      {level === 'guided' ? (
        <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
          The <strong>causal substrate</strong> is the sixteen forces that hold this
          settlement together: food, legitimacy, defense, trade, and more.{' '}
          <span style={{ color: MUTED }}>
            Switch to Detail or Engine to see where the pressure sits and watch it shift
            as the world advances.
          </span>
        </div>
      ) : (
        <CausalViewTabs
          settlement={settlement}
          settlementId={saveId || settlement?.id}
          worldState={worldState}
          regionalGraph={regionalGraph}
          forceLevel={level}
        />
      )}
    </div>
  );
}
