/** @vitest-environment jsdom */
/**
 * tests/components/livingWorldGates.test.jsx — the campaign-card / Realm
 * living-world gate row (LivingWorldGates).
 *
 * The gates are CAMPAIGN-scoped: they write the owning campaign's
 * simulationRules through updateCampaignSimulationRules (the same normalized
 * seam as SimulationRulesDialog), replacing the per-settlement Workshop
 * placement that read as per-settlement state. Pins:
 *   (1) the three DM-facing gates render and reflect the campaign rules;
 *   (2) a write goes through updateCampaignSimulationRules with the gate key;
 *   (3) War is DISABLED with the dependency reason while Relationship drift
 *       is off (relationship drift ⊃ war);
 *   (4) a non-premium reach fires the pricing moment + purchase modal, never
 *       a write (the monetization touchpoint moved with the control);
 *   (5) no campaign ⇒ renders nothing (the surface only exists on a campaign).
 */
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const updateRules = vi.fn(() => Promise.resolve());
const setPurchaseModalOpen = vi.fn();
const setActivePricingMoment = vi.fn();
const baseState = {
  updateCampaignSimulationRules: updateRules,
  setPurchaseModalOpen,
  setActivePricingMoment,
  auth: { tier: 'free' },
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(baseState); }
  useStore.getState = () => baseState;
  return { useStore };
});
vi.mock('../../src/lib/pricingMoments.js', () => ({
  triggerPricingMoment: vi.fn(),
}));

import LivingWorldGates from '../../src/components/settlements/LivingWorldGates.jsx';
import { triggerPricingMoment } from '../../src/lib/pricingMoments.js';

const campaignWith = (simulationRules = {}) => ({
  id: 'camp-1', name: 'Realm', worldState: { simulationRules },
});

const gateInput = (key) =>
  screen.getByTestId(`living-world-gate-${key}`).querySelector('input');

describe('LivingWorldGates', () => {
  beforeEach(() => { updateRules.mockClear(); setPurchaseModalOpen.mockClear(); vi.mocked(triggerPricingMoment).mockClear(); });
  afterEach(() => cleanup());

  it('(1) renders the three gates reflecting the campaign rules (drift defaults ON)', () => {
    render(<LivingWorldGates campaign={campaignWith({})} canWrite />);
    expect(gateInput('relationshipDynamicsEnabled').checked).toBe(true);   // default true
    expect(gateInput('warLayerEnabled').checked).toBe(false);              // default false
    expect(gateInput('religionDynamicsEnabled').checked).toBe(false);
  });

  it('(2) a premium write goes through updateCampaignSimulationRules', () => {
    render(<LivingWorldGates campaign={campaignWith({})} canWrite />);
    fireEvent.click(gateInput('religionDynamicsEnabled'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { religionDynamicsEnabled: true });
  });

  it('(3) War is disabled while Relationship drift is off, and enabled once drift is on', () => {
    const { unmount } = render(
      <LivingWorldGates campaign={campaignWith({ relationshipDynamicsEnabled: false })} canWrite />,
    );
    expect(gateInput('warLayerEnabled').disabled).toBe(true);
    unmount();
    render(<LivingWorldGates campaign={campaignWith({ relationshipDynamicsEnabled: true })} canWrite />);
    expect(gateInput('warLayerEnabled').disabled).toBe(false);
    fireEvent.click(gateInput('warLayerEnabled'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { warLayerEnabled: true });
  });

  it('(4) a non-premium reach fires the pricing moment and purchase modal, never a write', () => {
    render(<LivingWorldGates campaign={campaignWith({})} canWrite={false} />);
    fireEvent.click(gateInput('warLayerEnabled'));
    expect(updateRules).not.toHaveBeenCalled();
    expect(triggerPricingMoment).toHaveBeenCalledWith('war_layer_curiosity', setActivePricingMoment, { tier: 'free' });
    expect(setPurchaseModalOpen).toHaveBeenCalledWith(true);
  });

  it('(5) renders nothing without a campaign', () => {
    const { container } = render(<LivingWorldGates campaign={null} canWrite />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the drift-off hint on the card surface (showHint)', () => {
    render(<LivingWorldGates campaign={campaignWith({ relationshipDynamicsEnabled: false })} canWrite showHint />);
    expect(screen.getByTestId('living-world-gates').textContent).toMatch(/ties between them hold/i);
  });
});
