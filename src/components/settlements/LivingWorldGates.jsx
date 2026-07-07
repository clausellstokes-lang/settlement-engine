/**
 * LivingWorldGates — the campaign-scoped living-world toggles, surfaced where
 * their scope actually lives: the Library campaign card (CampaignFolder) and
 * the Realm dashboard. One row, three DM-facing gates:
 *
 *   Relationship drift  (relationshipDynamicsEnabled, default ON)
 *     Inter-settlement relationships and dynamics evolve on their own. Off:
 *     each settlement still lives and drifts internally, but the web BETWEEN
 *     settlements stays exactly as the DM authored it until acted on directly.
 *   War layer           (warLayerEnabled, default OFF)
 *     Requires Relationship drift: war is a relationship dynamic, so a frozen
 *     web cannot raise fronts. Renders disabled until drift is on; turning
 *     drift off cascades war off (armies wind down and march home on the next
 *     advance via the deploymentReturn machinery).
 *   Faith dynamics      (religionDynamicsEnabled, default OFF)
 *     The deity contest and conversion spread.
 *
 * These write the OWNING campaign's simulationRules through the SAME
 * normalized store seam as the Realm's SimulationRulesDialog
 * (updateCampaignSimulationRules), so every surface stays in lockstep and the
 * store-side dependency cascade is the single source of truth. The old
 * per-settlement Workshop placement made the gates read as per-settlement
 * state and invited the DM to visit every settlement to "turn them all on";
 * the Workshop now shows a read-only status line pointing here.
 *
 * Premium: writes require canManageCampaigns. A non-premium reach fires the
 * gate's simulation-intent pricing moment and opens the purchase modal, same
 * as the Workshop toggles did (the monetization touchpoint moves with the
 * control, it does not die).
 */
import { useId, useMemo, useState } from 'react';
import { useStore } from '../../store/index.js';
import { normalizeSimulationRules } from '../../domain/worldPulse/index.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { INK, BODY, MUTED, BORDER2, CARD, GOLD, sans, FS, R, SP } from '../theme.js';

export const LIVING_WORLD_GATES = Object.freeze([
  Object.freeze({
    key: 'relationshipDynamicsEnabled',
    label: 'Relationship drift',
    moment: 'war_layer_curiosity',
    description: 'Ties between settlements evolve on their own. Off: each settlement still lives and changes internally, but the web between them holds until you act on it.',
  }),
  Object.freeze({
    key: 'warLayerEnabled',
    label: 'War layer',
    moment: 'war_layer_curiosity',
    description: 'Armies march, sieges form, conquests change rulers. Off: no war fronts.',
  }),
  Object.freeze({
    key: 'religionDynamicsEnabled',
    label: 'Faith dynamics',
    moment: 'pantheon_preview',
    description: 'Deities contest converts and gain seats once a settlement carries a patron deity. Off, or deity-free: no faith drift.',
  }),
]);

const DRIFT_REASON = 'Needs Relationship drift: war is a relationship dynamic, so a frozen web cannot raise fronts.';

function Gate({ gate, rules, campaignId, canWrite, busyKey, setBusyKey }) {
  const updateRules = useStore(s => s.updateCampaignSimulationRules);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const setActivePricingMoment = useStore(s => s.setActivePricingMoment);
  const tier = useStore(s => s.auth?.tier);
  const controlId = useId();

  const checked = rules[gate.key] === true;
  const blockedByDrift = gate.key === 'warLayerEnabled' && rules.relationshipDynamicsEnabled !== true;
  const busy = busyKey === gate.key;

  const handleLockedReach = () => {
    triggerPricingMoment(gate.moment, setActivePricingMoment, { tier });
    setPurchaseModalOpen?.(true);
  };

  const onChange = async (next) => {
    if (!canWrite) { handleLockedReach(); return; }
    if (!campaignId || busy || blockedByDrift) return;
    setBusyKey(gate.key);
    try {
      await updateRules?.(campaignId, { [gate.key]: next });
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <label
      htmlFor={controlId}
      data-testid={`living-world-gate-${gate.key}`}
      title={blockedByDrift ? DRIFT_REASON : gate.description}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        border: `1px solid ${checked ? GOLD : BORDER2}`, borderRadius: R.md,
        background: checked ? 'rgba(201,162,76,0.12)' : CARD,
        cursor: canWrite && !blockedByDrift ? 'pointer' : 'default',
        opacity: blockedByDrift ? 0.6 : 1,
      }}
    >
      <input
        id={controlId}
        type="checkbox"
        aria-label={gate.label}
        checked={checked}
        disabled={busy || (blockedByDrift && canWrite)}
        onChange={canWrite ? (e) => onChange(e.target.checked) : undefined}
        onClick={!canWrite ? handleLockedReach : undefined}
        readOnly={!canWrite}
      />
      <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, whiteSpace: 'nowrap' }}>
        {gate.label}
      </span>
    </label>
  );
}

/**
 * @param {{ campaign?: any, canWrite?: boolean, showHint?: boolean }} props
 *   campaign: the owning campaign (reads worldState.simulationRules).
 *   canWrite: canManageCampaigns for the current user (premium write gate).
 *   showHint: render the one-line explainer under the row (card surface).
 */
export default function LivingWorldGates({ campaign, canWrite = false, showHint = false }) {
  const [busyKey, setBusyKey] = useState(null);
  const rules = useMemo(
    () => normalizeSimulationRules(campaign?.worldState?.simulationRules),
    [campaign],
  );
  if (!campaign?.id) return null;

  const driftOff = rules.relationshipDynamicsEnabled !== true;
  return (
    <div data-testid="living-world-gates" style={{ display: 'grid', gap: 4 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SP.xs }}>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Living world
        </span>
        {LIVING_WORLD_GATES.map(gate => (
          <Gate
            key={gate.key}
            gate={gate}
            rules={rules}
            campaignId={campaign.id}
            canWrite={canWrite}
            busyKey={busyKey}
            setBusyKey={setBusyKey}
          />
        ))}
      </div>
      {showHint && driftOff && (
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
          Relationship drift is off: settlements keep evolving on their own, but the ties between them hold until you change them.
        </span>
      )}
    </div>
  );
}
