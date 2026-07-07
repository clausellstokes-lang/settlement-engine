/**
 * WorkshopGateToggle — now a READ-ONLY status line for the living-world gates
 * (`warLayerEnabled`, `settlementStrategyEnabled`, `religionDynamicsEnabled`)
 * inside the editor Workshop's Faith/War cards.
 *
 * WHY read-only: these gates are CAMPAIGN-scoped (they write the owning
 * campaign's simulationRules), but living inside a per-settlement editor made
 * them read as per-settlement state — inviting the DM to visit every
 * settlement to "turn them all on" when one flip was ever enough. The CONTROL
 * moved to where its scope lives: the Library campaign card (CampaignFolder)
 * and the Realm dashboard, both rendering LivingWorldGates and writing the
 * same normalized updateCampaignSimulationRules seam. This surface keeps the
 * discovery moment (the Faith/War cards still TEACH that the systems exist
 * and show whether they are on) without the misleading write affordance —
 * and without a per-settlement path that races the campaign surfaces.
 *
 * Self-gating: with no owning campaign, a short line explains the gates live
 * on a campaign — never a dead control.
 */

import { useMemo } from 'react';
import { normalizeSimulationRules } from '../../domain/worldPulse/index.js';
import { INK, BODY, MUTED, BORDER2, CARD, GOLD, sans, FS, R, SP } from '../theme.js';

/** The three gate descriptors — mirror LivingWorldGates / SimulationRulesDialog copy. */
export const WORKSHOP_GATES = Object.freeze({
  warLayerEnabled: {
    label: 'War layer',
    description: 'Armies march, sieges form, conquests change rulers. Off = no war fronts.',
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
 * }} props
 */
export default function WorkshopGateToggle({ gateKey, campaign }) {
  const meta = WORKSHOP_GATES[gateKey];
  const checked = useMemo(() => {
    const rules = normalizeSimulationRules(campaign?.worldState?.simulationRules);
    return rules[gateKey] === true;
  }, [campaign, gateKey]);

  if (!meta) return null;

  // No owning campaign — the gate has no home. Explain, don't dead-click.
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
    <div
      data-testid={`workshop-gate-${gateKey}`}
      data-gate-status={checked ? 'on' : 'off'}
      style={{
        display: 'grid', gap: 4, padding: '8px 10px',
        border: `1px solid ${checked ? GOLD : BORDER2}`, borderRadius: R.md,
        background: checked ? 'rgba(201,162,76,0.12)' : CARD,
        marginBottom: SP.xs,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>{meta.label}</span>
        <span style={{
          color: checked ? GOLD : MUTED, fontFamily: sans, fontSize: FS.xxs,
          fontWeight: 900, letterSpacing: 0.4, textTransform: 'uppercase',
        }}>
          {checked ? 'On' : 'Off'}
        </span>
      </span>
      <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
        {meta.description} Managed for the whole campaign on its library card and the realm view.
      </span>
    </div>
  );
}
