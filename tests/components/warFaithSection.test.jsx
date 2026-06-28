/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

import WarFaithSection from '../../src/components/settlement/WarFaithSection.jsx';

afterEach(cleanup);

// A peaceful, deity-free, non-campaign settlement: no live world, no deity.
// The self-gating guarantee — this must render NOTHING.
const peacefulTown = {
  id: 'peace',
  name: 'Calmwater',
  population: 800,
  config: {},
  powerStructure: { factions: [{ faction: 'Council', archetype: 'government', power: 50, isGoverning: true }] },
  economicState: {},
};

// A warlike-deity campaign settlement under siege by a coalition, carrying a
// war-exhaustion scar, a disposition record, and a flipped trade prize.
const warTown = {
  id: 'A',
  name: 'Ashford',
  population: 1200,
  config: {
    primaryDeitySnapshot: { name: 'Maug', rankAxis: 'major', temperamentAxis: 'warlike', alignmentAxis: 'evil', domain: 'war' },
  },
  powerStructure: { factions: [{ faction: 'Warlord', archetype: 'military', power: 60, isGoverning: true }] },
  economicState: {},
};
const warWorldState = {
  deployments: { A: { targetId: 'B', sinceTick: 3, role: 'siege' } },
  warExhaustion: { A: 0.35 },
  dispositionStats: { A: { wins: 3, losses: 1, score: 2 } },
  tradeWarState: { 'B:grain': { winnerId: 'A', incumbentId: 'C', lastFlipTick: 5 } },
};
const warGraph = {
  channels: [
    { type: 'war_front', status: 'confirmed', from: 'C', to: 'A', strength: 0.7, visibility: 'public' },
    { type: 'trade_dependency', from: 'A', to: 'B', goods: [{ id: 'grain', label: 'grain' }] },
  ],
};

describe('WarFaithSection — self-gating + altitude', () => {
  test('a peaceful, deity-free, non-campaign settlement renders NOTHING', () => {
    const { container } = render(
      <WarFaithSection settlement={peacefulTown} settlementId="peace" forceLevel="expert" />,
    );
    expect(container.querySelector('[data-testid="war-faith-section"]')).toBeNull();
  });

  test('a war/deity campaign settlement DOES render the section', () => {
    const { getByTestId } = render(
      <WarFaithSection
        settlement={warTown}
        settlementId="A"
        worldState={warWorldState}
        regionalGraph={warGraph}
        nameFor={(id) => ({ A: 'Ashford', B: 'Brightvale', C: 'Caldmoor' }[id] || id)}
        forceLevel="standard"
      />,
    );
    const root = getByTestId('war-faith-section');
    expect(root.textContent).toMatch(/Ashford|besieges|Brightvale/i);
    // under siege by a single besieger Caldmoor
    expect(root.textContent).toMatch(/Caldmoor/);
  });

  test('a deity-only settlement (at peace) still renders, showing the faith line', () => {
    const deityOnly = { ...peacefulTown, config: { primaryDeitySnapshot: { name: 'Lumina', rankAxis: 'minor', alignmentAxis: 'good' } } };
    const { getByTestId } = render(
      <WarFaithSection settlement={deityOnly} settlementId="peace" forceLevel="standard" />,
    );
    expect(getByTestId('war-faith-section').textContent).toMatch(/Primary faith|Lumina/);
  });

  test('Detail+ surfaces war-exhaustion, disposition, trade-war prize and named posture inputs', () => {
    const { getByTestId } = render(
      <WarFaithSection
        settlement={warTown} settlementId="A"
        worldState={warWorldState} regionalGraph={warGraph}
        forceLevel="standard"
      />,
    );
    expect(getByTestId('war-exhaustion').textContent).toMatch(/war-weary/i);
    expect(getByTestId('disposition-standing').textContent).toMatch(/3W \/ 1L/);
    expect(getByTestId('trade-war-prize').textContent).toMatch(/grain/);
    // The aggressiveness posture is always present once the block opens.
    expect(getByTestId('war-faith-posture').textContent).toMatch(/Posture|aggression/);
  });

  test('Faith Effects disclosure renders the engine couplings (good/evil, warlike, major, magic)', () => {
    const { getByTestId, getByText } = render(
      <WarFaithSection
        settlement={warTown} settlementId="A"
        worldState={warWorldState} regionalGraph={warGraph}
        forceLevel="expert"
      />,
    );
    const faith = getByTestId('faith-effects');
    expect(faith.textContent).toMatch(/Faith Effects/);
    // Open the disclosure and assert the engine coupling strings appear.
    fireEvent.click(getByText(/Faith Effects/));
    expect(faith.textContent).toMatch(/corrupt/i);   // evil → corruption
    expect(faith.textContent).toMatch(/aggression/i); // warlike → aggression
    expect(faith.textContent).toMatch(/magic legality/i); // major → magic legality
  });

  test('Overview (guided) shows the headline status but NOT the named inputs / faith disclosure', () => {
    const { getByTestId, queryByTestId } = render(
      <WarFaithSection
        settlement={warTown} settlementId="A"
        worldState={warWorldState} regionalGraph={warGraph}
        forceLevel="guided"
      />,
    );
    expect(getByTestId('war-faith-section')).toBeTruthy();
    // Detail-only surfaces are absent at Overview.
    expect(queryByTestId('faith-effects')).toBeNull();
    expect(queryByTestId('trade-war-prize')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Religion rework — the per-settlement PANTHEON panel (multiple faiths competing
// for adherents, the chief, contested-ness, and the divine-mandate line).
// ─────────────────────────────────────────────────────────────────────────────
describe('WarFaithSection — pantheon panel', () => {
  const pantheonTown = {
    id: 'P', name: 'Pyrespire', population: 9000,
    config: {
      primaryDeitySnapshot: { name: 'Aurum', rankAxis: 'major', temperamentAxis: 'peaceful', alignmentAxis: 'good', domain: 'sun' },
      faithProfile: {
        chief: { name: 'Aurum', deityRef: 'custom:lu_aurum', share: 62 },
        deities: [
          { deityRef: 'custom:lu_aurum', name: 'Aurum', niche: 'peaceful:good', share: 62, standing: 'ascendant', isChief: true },
          { deityRef: 'custom:lu_korl', name: 'Korl', niche: 'warlike:evil', share: 38, standing: 'established', isChief: false },
        ],
        contested: false,
        chiefSecurity: 0.62,
      },
    },
    powerStructure: { government: 'theocracy', publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: 'Temple', archetype: 'religious', power: 70, isGoverning: true }] },
    economicState: {},
  };

  test('renders each faith with its share, standing, and the chief marker', () => {
    const { getByTestId } = render(<WarFaithSection settlement={pantheonTown} settlementId="P" forceLevel="standard" />);
    const panel = getByTestId('pantheon-panel');
    expect(panel.textContent).toMatch(/Aurum/);
    expect(panel.textContent).toMatch(/Korl/);
    expect(panel.textContent).toMatch(/62%/);
    expect(panel.textContent).toMatch(/chief/i);
    expect(panel.textContent).toMatch(/ascendant|established/i);
  });

  test('a theocracy with a secure chief shows the divine-mandate prop', () => {
    const { getByTestId } = render(<WarFaithSection settlement={pantheonTown} settlementId="P" forceLevel="standard" />);
    expect(getByTestId('divine-mandate').textContent).toMatch(/mandate/i);
  });

  test('a single-faith settlement shows NO pantheon panel (only the faith line)', () => {
    const single = { ...pantheonTown, config: { primaryDeitySnapshot: pantheonTown.config.primaryDeitySnapshot } };
    const { queryByTestId } = render(<WarFaithSection settlement={single} settlementId="P" forceLevel="standard" />);
    expect(queryByTestId('pantheon-panel')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F1 — the B-track surfaces (mobilization / army strength / occupation), in
// heuristic language, self-gating, player-safe (covert excluded by default).
// ─────────────────────────────────────────────────────────────────────────────

const bTrackWorldState = {
  warPosture: { A: { state: 'mobilized', progress: 1, sinceTick: 0 } },
  deployments: { A: { targetId: 'B', sinceTick: 3, role: 'siege', maxStartStrength: 100, currentEffectiveStrength: 38, supplyIntegrity: 0.3, morale: 0.4, foodReserve: 0.3 } },
  occupations: { D: { occupierId: 'A', state: 'contested', resistance: 0.7, sinceTick: 0 } },
};

describe('WarFaithSection — B-track surfaces (heuristic, player-safe)', () => {
  const nameFor = (id) => ({ A: 'Ashford', B: 'Brightvale', D: 'Dunmoor' }[id] || id);

  test('mobilization, army strength + attrition, and occupier holdings render in plain words', () => {
    const { getByTestId } = render(
      <WarFaithSection
        settlement={warTown} settlementId="A"
        worldState={bTrackWorldState} regionalGraph={warGraph}
        settlements={[]} nameFor={nameFor}
        forceLevel="standard"
      />,
    );
    expect(getByTestId('mobilization-posture').textContent).toMatch(/mobiliz/i);
    const army = getByTestId('army-strength');
    expect(army.textContent).toMatch(/Brightvale/);
    expect(army.textContent).toMatch(/strength|gutted|battered/i);
    // The occupier-holdings surface names who it holds.
    expect(getByTestId('occupation-holder').textContent).toMatch(/Dunmoor/);
    // No raw enum / engine internal leaks into the B-track surfaces (the deeper
    // heuristic-no-internals + no-float property is pinned on the read-models in
    // tests/domain/display/visibilityAudit.test.js).
    for (const id of ['mobilization-posture', 'army-strength', 'occupation-holder']) {
      const text = getByTestId(id).textContent;
      expect(text).not.toMatch(/war_preparation|currentEffectiveStrength|accumulatedAttrition|occupation_burden/);
    }
  });

  test('the OCCUPIED settlement reads its occupier + resistance', () => {
    const occupiedTown = { id: 'D', name: 'Dunmoor', population: 600, config: {}, powerStructure: { factions: [] }, economicState: {} };
    const { getByTestId } = render(
      <WarFaithSection
        settlement={occupiedTown} settlementId="D"
        worldState={bTrackWorldState} regionalGraph={warGraph}
        settlements={[]} nameFor={nameFor}
        forceLevel="standard"
      />,
    );
    const occ = getByTestId('occupation-occupied');
    expect(occ.textContent).toMatch(/Ashford/);
    expect(occ.textContent).toMatch(/revolt|resist/i);
  });

  test('a covert mobilizer never surfaces on the dossier (player-safe default)', () => {
    const covertWorld = { warPosture: { A: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true } } };
    const { queryByTestId } = render(
      <WarFaithSection
        settlement={warTown} settlementId="A"
        worldState={covertWorld} regionalGraph={null}
        settlements={[]} nameFor={nameFor}
        forceLevel="standard"
      />,
    );
    // The covert prep must NOT render a mobilization line (the section may still
    // render for the deity, but the mobilization surface is suppressed).
    expect(queryByTestId('mobilization-posture')).toBeNull();
  });
});
