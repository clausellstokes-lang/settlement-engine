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

  test('a dormant world (no belief maps) renders nothing — byte-identical off-state', () => {
    setStore({ auth: { tier: 'premium' } });
    const dormant = { id: 'camp-1', settlementIds: ['alderport'], worldState: { tick: 3, spatialLedgers: {} } };
    expect(render(<BeliefDivergenceBand campaign={dormant} nameById={nameById} />)
      .queryByTestId('belief-divergence-band')).toBeNull();
  });
});
