/**
 * @vitest-environment jsdom
 *
 * tests/ui/beliefDivergenceBand.test.jsx — experience-product-fit-2.
 *
 * The belief read-model (settlementBeliefs) had zero UI consumers. This band mounts
 * it DM-gated in the Realm Inspector's War surface. Pins: the premium DM sees the
 * belief band; a non-premium / anon viewer sees NOTHING (fail-closed player
 * projection) even when the ledger carries deity names + ground truth (adversarial
 * scrub); a dormant belief-free world renders nothing.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';

afterEach(cleanup);

let storeState = {};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

const { default: BeliefDivergenceBand } = await import('../../src/components/map/BeliefDivergenceBand.jsx');

function beliefCampaign() {
  return {
    id: 'camp-1',
    settlementIds: ['alderport'],
    worldState: {
      tick: 20,
      spatialLedgers: { beliefMaps: {
        alderport: { [GOVERNING_SEAT_KEY]: {
          grimhold: { readiness: 0, strengthBand: 0, allianceLabel: 'hostile', faithLabel: 'Old Sea-God', confidence01: 0.35, lastUpdateTick: 4 },
          rivermouth: { readiness: 0.75, strengthBand: 3, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 19 },
        } },
      } },
    },
  };
}
const nameById = new Map([['alderport', 'Alderport'], ['grimhold', 'Grimhold'], ['rivermouth', 'Rivermouth']]);

/** FP IN-6 U3: a realm whose TRUTH the band can now read (saves + regional graph + postures). */
function truthSettlement(name, deity = null) {
  return {
    name, tier: 'city', population: 45000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 40, ...(deity ? { primaryDeitySnapshot: { name: deity } } : {}) },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 62, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}
const truthSaves = () => [
  { id: 'alderport', name: 'Alderport', phase: 'canon', settlement: truthSettlement('Alderport') },
  { id: 'grimhold', name: 'Grimhold', phase: 'canon', settlement: truthSettlement('Grimhold', 'Old Sea-God') },
  { id: 'rivermouth', name: 'Rivermouth', phase: 'canon', settlement: truthSettlement('Rivermouth') },
];
/** Rivermouth's belief is its truth; Grimhold's is wrong on strength, readiness and the bond. */
const RIVERMOUTH_TRUE_BAND = 4;
function truthCampaign() {
  const c = beliefCampaign();
  c.worldState.spatialCanonVersion = 1;
  c.worldState.simulationRules = { infoMode: 'full' };
  c.worldState.warPosture = { grimhold: { state: 'mobilized' }, rivermouth: { state: 'mobilized' } };
  c.worldState.spatialLedgers.beliefMaps.alderport[GOVERNING_SEAT_KEY].rivermouth.strengthBand = RIVERMOUTH_TRUE_BAND;
  c.settlementIds = ['alderport', 'grimhold', 'rivermouth'];
  c.regionalGraph = { edges: [
    { id: 'edge.alderport.grimhold', from: 'alderport', to: 'grimhold', relationshipType: 'trade_partner' },
    { id: 'edge.alderport.rivermouth', from: 'alderport', to: 'rivermouth', relationshipType: 'trade_partner' },
  ] };
  return c;
}

function setStore(over) { storeState = { auth: { tier: 'anon' }, isElevated: () => false, ...over }; return storeState; }

describe('BeliefDivergenceBand', () => {
  test('a premium DM sees each settlement\'s believed picture of the others', () => {
    setStore({ auth: { tier: 'premium' } });
    const { getByTestId } = render(<BeliefDivergenceBand campaign={beliefCampaign()} nameById={nameById} />);
    const el = getByTestId('belief-divergence-band');
    expect(el.textContent).toMatch(/Alderport believes/);
    expect(el.textContent).toMatch(/Grimhold/);
    expect(el.textContent).toMatch(/Rivermouth/);
    expect(el.textContent).toMatch(/negligible/); // grimhold believed strength
  });

  test('an elevated (non-premium) viewer also sees it', () => {
    setStore({ auth: { tier: 'free' }, isElevated: () => true });
    expect(render(<BeliefDivergenceBand campaign={beliefCampaign()} nameById={nameById} />)
      .queryByTestId('belief-divergence-band')).toBeTruthy();
  });

  test('ADVERSARIAL: an anon / free viewer sees NOTHING — no belief, no deity name leaks', () => {
    setStore({ auth: { tier: 'anon' }, isElevated: () => false });
    const { queryByTestId, container } = render(<BeliefDivergenceBand campaign={beliefCampaign()} nameById={nameById} />);
    expect(queryByTestId('belief-divergence-band')).toBeNull();
    // Fail-closed: the DM-only ledger (deity names, believed strength) never renders.
    expect(container.textContent).not.toMatch(/Old Sea-God/);
    expect(container.textContent).not.toMatch(/negligible/);
  });

  test('FP IN-6 U3: a premium DM SEES WRONGNESS, the display-safe truth joined to each belief', () => {
    setStore({ auth: { tier: 'premium' } });
    const { getByTestId } = render(<BeliefDivergenceBand campaign={truthCampaign()} saves={truthSaves()} nameById={nameById} />);
    const text = getByTestId('belief-divergence-band').textContent;
    // Alderport believes Grimhold negligible, at peace and hostile; the realm says otherwise.
    expect(text).toMatch(/underestimates Grimhold: (slight|middling|formidable|overwhelming) in strength, believed negligible/);
    expect(text).toMatch(/believes Grimhold at peace; it is in the field/);
    expect(text).toMatch(/still reads the bond with Grimhold as hostile; it is now trade partner/);
    // Rivermouth's belief matches its truth band for band: no divergence line names it.
    expect(text.match(/Rivermouth/g)).toHaveLength(1);
  });

  test('FP IN-6 U3: without saves the band still renders, belief only, and never a guessed truth', () => {
    setStore({ auth: { tier: 'premium' } });
    const text = render(<BeliefDivergenceBand campaign={truthCampaign()} nameById={nameById} />)
      .getByTestId('belief-divergence-band').textContent;
    expect(text).toMatch(/Alderport believes/);
    // anchored: the same campaign WITH saves renders this line (the test above)
    expect(text).not.toMatch(/underestimates/);
  });

  test('a dormant world (no belief maps) renders nothing — byte-identical off-state', () => {
    setStore({ auth: { tier: 'premium' } });
    const dormant = { id: 'camp-1', settlementIds: ['alderport'], worldState: { tick: 3, spatialLedgers: {} } };
    expect(render(<BeliefDivergenceBand campaign={dormant} nameById={nameById} />)
      .queryByTestId('belief-divergence-band')).toBeNull();
  });
});
