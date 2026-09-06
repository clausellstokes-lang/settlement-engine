/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PrioritySliders from '../../src/components/generate/PrioritySliders.jsx';
import {
  NearbyResourcesPanel,
  StressPanel,
} from '../../src/components/ConfigurationPanel.jsx';
import { StepRow } from '../../src/components/PipelineRail.jsx';

afterEach(cleanup);

describe('Create controls — meaning before numeric precision', () => {
  it('pairs every priority setting with its canonical band', () => {
    render(
      <PrioritySliders
        config={{
          priorityEconomy: 50,
          priorityMilitary: 92,
          priorityMagic: 12,
          priorityReligion: 70,
          priorityCriminal: 30,
        }}
        updateConfig={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Economy').getAttribute('aria-valuetext'))
      .toBe('Economy priority: Medium, setting 50');
    expect(screen.getByText('Medium').textContent).toBe('Medium · 50');
    expect(screen.getByText('Very High').textContent).toBe('Very High · 92');
  });

  it('describes conditional stress generation instead of claiming a flat formula', () => {
    const { container } = render(
      <StressPanel
        config={{ selectedStressesRandom: true }}
        updateConfig={vi.fn()}
      />,
    );

    expect(container.textContent).toMatch(/Settlement conditions decide/);
    expect(container.textContent).toMatch(/may have none/);
    expect(container.textContent).not.toMatch(/40%|chance/i);
  });

  it('explains resource depletion as size-sensitive availability, not a raw roll', () => {
    const { container } = render(
      <NearbyResourcesPanel
        config={{
          settType: 'town',
          tradeRouteAccess: 'road',
          terrainOverride: 'auto',
          nearbyResourcesRandom: true,
        }}
        updateConfig={vi.fn()}
      />,
    );

    expect(container.textContent).toMatch(/Some may begin depleted/);
    expect(container.textContent).toMatch(/pressure rising as settlement size grows/);
    expect(container.textContent).not.toMatch(/% chance|% depleted/);
  });
});

describe('Pipeline trace — rendered receipts contain no machine vocabulary', () => {
  it('translates target, result, source, and downstream target on expansion', () => {
    const { container } = render(
      <ol>
        <StepRow
          entry={{ id: 'resolveConfig', summary: 'Resolved the starting choices.' }}
          isLast
          traces={[{
            targetType: 'condition',
            targetId: 'tradeRoute.crossroads',
            result: 'present_but_depleted',
            causes: [{
              source: 'config.tradeRouteAccess=random_trade',
              effect: 'trade_access_input',
              reason: 'The route was chosen from the eligible options.',
            }],
            downstreamEffects: [{
              target: 'economicViability',
              effect: 'trade_access_input',
            }],
          }]}
        />
      </ol>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(container.textContent).toMatch(/Trade access: Crossroads/);
    expect(container.textContent).toMatch(/Present, but depleted/);
    expect(container.textContent).toMatch(/Because of Your trade access choice: Random/);
    expect(container.textContent).toMatch(/What this shaped: Economic viability/);
    expect(container.textContent).not.toMatch(
      /tradeRoute|present_but_depleted|tradeRouteAccess|economicViability|trade_access_input/,
    );
  });
});
