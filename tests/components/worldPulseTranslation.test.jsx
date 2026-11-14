/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { OutcomeCard } from '../../src/components/map/WorldPulsePrimitives.jsx';
import {
  digestDetails,
  outcomeDetails,
  proposalDetails,
  stressorDetails,
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

  test('a government change states the preserved institutions only when its payload carries that fact', () => {
    // CURE-PEACE-1: the line is read from the payload's own preserveInstitutions (the writer-reach walker's
    // owed registration), where it used to be a constant the card asserted for every government change.
    const change = (extra) => proposalDetails({
      proposalPayload: { kind: 'government_change', governmentPreference: 'merchant_charter', legitimacyBand: 'contested', ...extra },
    });
    expect(change({ preserveInstitutions: true })).toEqual(['merchant charter', 'contested', 'preserve institutions']);
    // anchored: the same payload with the fact set yields the line on the line above, so its absence here is the payload's.
    expect(change({})).not.toContain('preserve institutions');
  });

  test('STYLE-2 SW-12 (ledger D·29–31): standing, goals, digest chips and a trouble read in plain words', () => {
    // D·29: a rank change is a standing that rises or falls, never a dot count.
    const npc = (before, after) => proposalDetails({
      proposalPayload: { kind: 'npc_action', actionFamily: 'seize_office', dotRankBefore: before, dotRankAfter: after },
    });
    expect(npc(2, 3)).toEqual(['seize office', 'standing rises']);
    expect(npc(3, 2)).toEqual(['seize office', 'standing falls']);
    // D·30: goals carry a plain lead; the digest drops the lifecycle word.
    expect(outcomeDetails({ npcPatch: { shortGoal: 'secure_food', longGoal: 'consolidate_power' } }))
      .toEqual(['wants now: secure food', 'wants in time: consolidate power']);
    expect(digestDetails({ kind: 'queued', scope: 'regional', impactKind: 'import_shortage', channelType: 'trade_dependency' }))
      .toEqual(['regional', 'import shortage', 'trade dependency']);
    // D·31: how the place copes; a blocked trouble is held by another, unnamed (the synergy records no blocker).
    expect(stressorDetails({
      lifecycleStage: 'peaking',
      durationPolicy: 'episodic',
      counterforce: { score: 0.31, floorsMet: false },
      synergy: { companions: ['siege', 'disease_outbreak'], blocksResolution: true },
    })).toEqual(['peaking', 'not recovering', 'missing something it needs to recover', 'entangled with siege, disease outbreak', 'held in place by another trouble']);
  });

  test('outcome tier changes use the same size vocabulary', () => {
    expect(outcomeDetails({
      tierChange: { fromTier: 'large_town', toTier: 'capital' },
    })).toContain('Size Large town → Metropolis');
  });
});
