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
import { HelpCircle } from 'lucide-react';
import { useStore } from '../../store/index.js';
// code-quality-6: import the leaf, not the 22-module worldPulse barrel — a static
// barrel import would drag the whole pulse engine into this component's chunk.
import { normalizeSimulationRules } from '../../domain/worldPulse/simulationRules.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { INK, BODY, MUTED, BORDER2, CARD, GOLD, sans, FS, SP } from '../theme.js';

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
// GUIDE-2b — the geography control's teaching, surfaced in the in-theme help
// panel below (was a native title= OS tooltip; the deep title tranche migrates
// text-bearing controls off foreign chrome onto the study's own cloth).
const GEOGRAPHY_HELP = 'Map geography freezes this realm’s territories, routes, and distances into canon the simulation reads. Re-map to refreeze after new placements.';

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
        aria-label={mapped ? `Geography mapped, spatial canon v${version}` : 'Map geography'}
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
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        border: `1px solid ${checked ? GOLD : BORDER2}`,
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
 * The in-theme help panel — GUIDE-2b's replacement for the native title= OS
 * tooltips the gates and the geography button used to carry. Comprehension-
 * first (visible on demand, mobile-reachable — a hover title reached neither),
 * rendered from the study's own tokens rather than foreign chrome. The gate
 * descriptions are the single source; the war gate appends its drift
 * dependency, and the spatial control speaks last.
 */
function LivingWorldHelp() {
  return (
    <div
      role="note"
      data-testid="living-world-help"
      style={{ display: 'grid', gap: 6, padding: '7px 9px', border: `1px solid ${BORDER2}`, background: CARD }}
    >
      {LIVING_WORLD_GATES.map(g => (
        <div key={g.key} style={{ display: 'grid', gap: 1 }}>
          <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900 }}>{g.label}</span>
          <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 600, lineHeight: 1.45 }}>
            {g.key === 'warLayerEnabled' ? `${g.description} ${DRIFT_REASON}` : g.description}
          </span>
        </div>
      ))}
      <div style={{ display: 'grid', gap: 1 }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900 }}>Map geography</span>
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 600, lineHeight: 1.45 }}>{GEOGRAPHY_HELP}</span>
      </div>
    </div>
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
  const [helpOpen, setHelpOpen] = useState(false);
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
        <IconButton
          Icon={HelpCircle}
          label="About the living-world controls"
          tone="ghost"
          size="sm"
          pressed={helpOpen}
          onClick={() => setHelpOpen(o => !o)}
        />
      </div>
      {helpOpen && <LivingWorldHelp />}
      {showHint && driftOff && (
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
          Relationship drift is off: settlements keep evolving on their own, but the ties between them hold until you change them.
        </span>
      )}
    </div>
  );
}
