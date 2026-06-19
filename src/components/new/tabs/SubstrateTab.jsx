/**
 * SubstrateTab — the Substrate sub-tab (UX overhaul Phase 2, plan §4.1). Mounts
 * the P1 CausalViewTabs (15-var grid + band "why" + 9 pressures + settlementStrength
 * with the war-cost penalty + the homeostasis story), feeding it the owning
 * campaign's LIVE worldState / regionalGraph so a live siege/condition colours the
 * pressures. Standalone (non-campaign) settlements degrade to the frozen-generation
 * grid — the legitimate "advance time to watch it move" teaser.
 *
 * Altitude-gated by CausalViewTabs itself: Overview renders nothing (the clean
 * face), Detail shows the pressured rows, Engine shows the full grid + pressures +
 * strength. This wrapper adds an Overview hint so the empty Substrate tab is not a
 * dead end for a new DM who lands on it.
 */

import CausalViewTabs from '../../settlement/CausalViewTabs.jsx';
import { useSettlementLiveWorld } from '../../../hooks/useSettlementLiveWorld.js';
import { useAltitude } from '../../../hooks/useAltitude.js';
import { FS, MUTED, BODY, sans, SP } from '../../theme.js';

/**
 * @param {{ settlement: any, saveId?: string|null }} props
 */
export default function SubstrateTab({ settlement, saveId = null }) {
  const { level } = useAltitude();
  const { worldState, regionalGraph } = useSettlementLiveWorld(saveId);

  return (
    <div data-testid="substrate-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {level === 'guided' && (
        <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
          The <strong>causal substrate</strong> is the 15-variable engine under this
          settlement — food, legitimacy, defense, trade and more.{' '}
          <span style={{ color: MUTED }}>
            Raise the detail level (Detail / Engine) to see where the pressure is and
            watch it move as the world advances.
          </span>
        </div>
      )}
      <div style={{ marginTop: level === 'guided' ? SP.sm : 0 }}>
        <CausalViewTabs
          settlement={settlement}
          settlementId={saveId || settlement?.id}
          worldState={worldState}
          regionalGraph={regionalGraph}
        />
      </div>
    </div>
  );
}
