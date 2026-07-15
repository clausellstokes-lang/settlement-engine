/**
 * WorkshopGateToggle — the three living-world subsystem gates
 * (`warLayerEnabled`, `settlementStrategyEnabled`, `religionDynamicsEnabled`),
 * surfaced INSIDE the editor Workshop's Faith/War cards (UX overhaul Phase 6,
 * plan §4.3) — in ADDITION to the SimulationRulesDialog group.
 *
 * Each gate writes to the OWNING campaign's `simulationRules` via
 * `updateCampaignSimulationRules(campaignId, { [key]: value })` — the exact same
 * normalized seam the dialog uses, so the two surfaces stay in lockstep. The
 * gates default FALSE and carry the byte-identical-when-off promise in their
 * copy: a settlement whose campaign leaves the gate off (or which has no
 * campaign at all) is byte-identical to today.
 *
 * Self-gating:
 *   - No owning campaign (a non-campaign / dormant save) ⇒ a short read-only
 *     line explaining the gate lives on the campaign, never a dead toggle.
 *   - Write is premium: a non-premium user sees the read description, not the
 *     interactive checkbox (the read surface is the free→premium teaser).
 *
 * Pure store binding; the only write is the explicit `updateCampaignSimulationRules`.
 */

import { useId, useMemo, useState } from 'react';
import { useStore } from '../../store/index.js';
import { normalizeSimulationRules } from '../../domain/worldPulse/index.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { INK, BODY, MUTED, BORDER2, CARD, GOLD, sans, FS, R, SP } from '../theme.js';

// P9 — which simulation-intent pricing moment a non-premium reach toward a gate
// should fire. War/strategy → the war-layer curiosity; religion → the pantheon
// preview. Each NAMES that system (never size — size is free).
const GATE_MOMENT = Object.freeze({
  warLayerEnabled:           'war_layer_curiosity',
  settlementStrategyEnabled: 'war_layer_curiosity',
  religionDynamicsEnabled:   'pantheon_preview',
});

/** The three gate descriptors — mirror SimulationRulesDialog's ADVANCED_GATES copy. */
export const WORKSHOP_GATES = Object.freeze({
  warLayerEnabled: {
    label: 'War layer',
    description: 'Armies march, sieges form, conquests change rulers. Off = no war fronts (byte-identical to today).',
  },
  settlementStrategyEnabled: {
    label: 'Settlement strategy',
    description: 'Settlements choose to defend, deploy, or sue for peace. Off = no strategy candidates.',
  },
  religionDynamicsEnabled: {
    label: 'Awaken religion',
    description: 'Deities contest converts and gain seats, but only once a settlement carries a patron deity (or an imposed cult). Off (or deity-free) = no faith drift.',
  },
});

/**
 * @param {{
 *   gateKey: 'warLayerEnabled'|'settlementStrategyEnabled'|'religionDynamicsEnabled',
 *   campaign?: any,
 *   canWrite?: boolean,
 * }} props
 */
export default function WorkshopGateToggle({ gateKey, campaign, canWrite = false }) {
  const updateRules = useStore(s => s.updateCampaignSimulationRules);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const setActivePricingMoment = useStore(s => s.setActivePricingMoment);
  const tier = useStore(s => s.auth?.tier);
  const [busy, setBusy] = useState(false);
  const controlId = useId();
  const meta = WORKSHOP_GATES[gateKey];

  // A non-premium reach toward a living-world gate fires its simulation-intent
  // pricing moment (cooldown-guarded). Deterministic by gate; routes the CTA to
  // the canonical premium-value surface via the standard moment card.
  const fireGateMoment = () => {
    const reason = GATE_MOMENT[gateKey];
    if (!reason || typeof setActivePricingMoment !== 'function') return;
    triggerPricingMoment(reason, setActivePricingMoment, { tier });
  };

  const handleLockedReach = () => {
    fireGateMoment();
    setPurchaseModalOpen?.(true);
  };

  const { checked, warOn } = useMemo(() => {
    const rules = normalizeSimulationRules(campaign?.worldState?.simulationRules);
    return { checked: rules[gateKey] === true, warOn: rules.warLayerEnabled === true };
  }, [campaign, gateKey]);
  // Settlement Strategy is auto-enabled — and locked on — while the War layer is on:
  // it scores moves off war_front channels that only exist under War. Mirrors the
  // store-side coupling in updateCampaignSimulationRules.
  const forcedByWar = gateKey === 'settlementStrategyEnabled' && warOn;

  if (!meta) return null;

  const onChange = async (next) => {
    if (!canWrite) { handleLockedReach(); return; }
    if (!campaign?.id || busy) return;
    setBusy(true);
    try {
      await updateRules?.(campaign.id, { [gateKey]: next });
    } finally {
      setBusy(false);
    }
  };

  // No owning campaign — the gate has no home to write to. Explain, don't dead-click.
  if (!campaign?.id) {
    return (
      <div data-testid={`workshop-gate-${gateKey}`} data-gate-dormant style={{
        display: 'grid', gap: 3, padding: '8px 10px',
        border: `1px dashed ${BORDER2}`, borderRadius: R.md, background: CARD,
      }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>{meta.label}</span>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
          Add this settlement to a campaign to enable {meta.label.toLowerCase()}. {meta.description}
        </span>
      </div>
    );
  }

  return (
    <label
      htmlFor={controlId}
      data-testid={`workshop-gate-${gateKey}`}
      style={{
        display: 'grid', gap: 4, padding: '8px 10px',
        border: `1px solid ${checked ? GOLD : BORDER2}`, borderRadius: R.md,
        background: checked ? 'rgba(201,162,76,0.12)' : CARD,
        cursor: canWrite ? 'pointer' : 'default', marginBottom: SP.xs,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          id={controlId}
          type="checkbox"
          aria-label={meta.label}
          checked={checked}
          disabled={busy || (forcedByWar && canWrite)}
          onChange={canWrite ? (e) => onChange(e.target.checked) : undefined}
          onClick={!canWrite ? handleLockedReach : undefined}
          readOnly={!canWrite}
        />
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>{meta.label}</span>
      </span>
      <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
        {meta.description}{forcedByWar ? ' Auto-enabled by the War layer.' : ''}
      </span>
    </label>
  );
}
