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
 *   Faith spread        (faithSpreadEnabled, default OFF)
 *     Cross-settlement propagation ONLY. Since the W-F1 gate split, each
 *     settlement's own pantheon — the deity contest, rank ladder, legitimacy,
 *     and patron seat — runs LOCALLY the moment it carries a deity, with no
 *     flag. This gate opens only the borders: a dominant creed spreading along
 *     trade / alliance / war ties into its neighbours. (Writes the canonical
 *     faithSpreadEnabled key; normalizeSimulationRules keeps the legacy
 *     religionDynamicsEnabled in sync until its Phase-6 deprecation.)
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
import Button from '../primitives/Button.jsx';
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
    key: 'faithSpreadEnabled',
    label: 'Faith spread',
    moment: 'pantheon_preview',
    description: 'Faith crosses BETWEEN settlements — a dominant creed spreads along trade, alliance, and war ties into its neighbours. Off: each settlement still grows its own pantheon, but no creed reaches across the borders.',
  }),
]);

const DRIFT_REASON = 'Needs Relationship drift: war is a relationship dynamic, so a frozen web cannot raise fronts.';

/**
 * Phase 5.5 KEYSTONE — the ENTITLED spatial opt-in, surfaced beside the living-
 * world gates. Unlike the gates (persistent toggles), mapping geography is a
 * one-shot canonize ACTION that freezes an immutable spatial digest into the
 * campaign's worldState. It appears ONLY for a loaded GENERATED map (imported /
 * custom-backdrop maps stay aspatial — II.5-3) and reflects whether the realm has
 * been mapped (worldState.spatialCanonVersion). Premium-gated the same way the
 * gates are: a non-premium reach fires the pricing moment. The store action is
 * the source of truth — it re-reads the entitlement + generated-map + capture
 * gates at the call site, so this control is purely an affordance.
 *
 * NB: the live pack.cells capture is wired (5.5-M) — a READ-ONLY one-shot read of
 * the mounted FMG iframe. With no map view open the capture is unavailable, so the
 * action returns 'spatial_capture_unavailable' and this control shows a truthful
 * "open the world map" note; open the map and the same control maps the realm.
 */
function SpatialCanonGate({ campaign, canWrite }) {
  const canonizeSpatial = useStore(s => s.canonizeCampaignWorldSpatial);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const setActivePricingMoment = useStore(s => s.setActivePricingMoment);
  const tier = useStore(s => s.auth?.tier);
  const isImportedMap = useStore(s => !!s.mapState?.customBackdrop?.imageUrl);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  // Only offered for GENERATED maps (imported maps have no terrain to route on).
  if (isImportedMap) return null;

  const version = Number(campaign?.worldState?.spatialCanonVersion) || 0;
  const mapped = version > 0;

  const handleLockedReach = () => {
    triggerPricingMoment('map_realm_teaser', setActivePricingMoment, { tier });
    setPurchaseModalOpen?.(true);
  };

  const onClick = async () => {
    if (!canWrite) { handleLockedReach(); return; }
    if (!campaign?.id || busy) return;
    setBusy(true);
    setNote('');
    try {
      const result = await canonizeSpatial?.(campaign.id);
      if (result && result.ok === false) {
        setNote(
          result.reason === 'spatial_capture_unavailable' ? 'Open the world map to map geography.'
            : result.reason === 'not_entitled' ? '' // handled by the locked reach
              : result.reason === 'not_generated_map' ? 'Only generated maps can be mapped.'
                : 'Could not map geography.',
        );
        if (result.reason === 'not_entitled') handleLockedReach();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 2 }}>
      <Button
        data-testid="spatial-canon-gate"
        variant={mapped ? 'gold' : 'secondary'}
        size="sm"
        busy={busy}
        title={mapped
          ? `Geography mapped (spatial canon v${version}). Re-map to refreeze after new placements.`
          : 'Freeze this realm’s geography — territories, routes, and distances become canon the simulation reads.'}
        onClick={onClick}
        style={{ fontSize: FS.xxs, fontWeight: 900, minHeight: 26, padding: '4px 8px' }}
      >
        {mapped ? 'Geography mapped ✓' : busy ? 'Mapping…' : 'Map geography'}
      </Button>
      {note && (
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
          {note}
        </span>
      )}
    </div>
  );
}

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
      // CL-0 legacy-key cleanup: the faith gate writes the CANONICAL
      // faithSpreadEnabled AND its legacy religionDynamicsEnabled mirror in one
      // patch. Writing the canonical key alone is silently DROPPED: the store
      // merges the patch over stored rules whose normalize-materialized legacy
      // mirror (religionDynamicsEnabled:false) is authoritative in the
      // normalizer's lockstep, so { faithSpreadEnabled: true } normalized back
      // to false (verified empirically pre-CL0 — the gate could never turn
      // faith on). Pair-writing keeps THIS control's intent authoritative
      // through the deprecation window; the pair collapses to one key in the
      // Phase 6 lifecycle pass.
      const patch = gate.key === 'faithSpreadEnabled'
        ? { faithSpreadEnabled: next, religionDynamicsEnabled: next }
        : { [gate.key]: next };
      await updateRules?.(campaignId, patch);
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
        <SpatialCanonGate campaign={campaign} canWrite={canWrite} />
      </div>
      {showHint && driftOff && (
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
          Relationship drift is off: settlements keep evolving on their own, but the ties between them hold until you change them.
        </span>
      )}
    </div>
  );
}
