/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { OutcomeCard } from '../../src/components/map/WorldPulsePrimitives.jsx';
import {
  outcomeDetails,
  proposalDetails,
} from '../../src/components/map/WorldPulseData.js';

afterEach(cleanup);

describe('World Pulse presentation translation', () => {
  test('OutcomeCard names the severity band and recasts recorded reason tokens', () => {
    const { container } = render(
      <OutcomeCard
        heading="The border is under strain"
        summary="The council has the report."
        severity={0.84}
        reasons={['critical_impact_type', 'border_raid']}
      />,
    );

    expect(screen.getByText('critical')).toBeTruthy();
    expect(screen.getByText('a matter that cuts deep')).toBeTruthy();
    expect(screen.getByText('a raid across the border')).toBeTruthy();
    expect(container.textContent).not.toMatch(/84%|critical_impact_type|border_raid/i);
  });

  test('proposal details show reader facts and suppress implementation addresses', () => {
    expect(proposalDetails({
      proposalPayload: {
        kind: 'tier_change',
        fromTier: 'large_town',
        toTier: 'city',
        direction: 'growth_phase',
      },
    })).toEqual(['Size Large town → City', 'growth phase']);

    expect(proposalDetails({
      ruleFamily: 'relationship_evolution',
      ruleId: 'relationship_rule_7',
      proposalPayload: {
        kind: 'relationship_label_change',
        fromType: 'trade_partner',
        toType: 'hostile',
      },
    })).toEqual(['trade partner → hostile']);

    expect(proposalDetails({
      ruleFamily: 'internal_rule_family',
      ruleId: 'internal_rule_id',
    })).toEqual([]);
  });

  test('outcome tier changes use the same size vocabulary', () => {
    expect(outcomeDetails({
      tierChange: { fromTier: 'large_town', toTier: 'capital' },
    })).toContain('Size Large town → Metropolis');
  });
});
