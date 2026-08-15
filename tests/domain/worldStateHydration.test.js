import { describe, expect, test, vi } from 'vitest';

import {
  ensureWorldState,
  ensureWorldStateWithEnvoyNormalizer,
} from '../../src/domain/worldPulse/worldState.js';
import { hydratePersistedWorldState } from '../../src/domain/worldPulse/worldStateHydration.js';
import { envoyErrandIdForOffer } from '../../src/domain/worldPulse/envoyErrandOffer.js';

const CAMPAIGN = Object.freeze({ id: 'campaign.hydration', name: 'Hydration Realm' });

function validEnvoyErrand() {
  const offer = {
    outcomeId: 'peace-outcome-1',
    generatedAtTick: 5,
    severity: 0.7,
    candidateType: 'strategy_sue_for_peace',
    targetSaveId: 'ashford',
    relationshipKey: 'ashford::irontown',
    relationshipPatch: { proposedRelationshipType: 'neutral' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: 'ashford::irontown',
      fromType: 'hostile',
      toType: 'neutral',
      peaceOffer: true,
      offererId: 'ashford',
      targetId: 'irontown',
      peaceFrontOwnerId: 'ashford',
      peaceFrontSinceTick: 4,
      reason: 'The court carries an authored peace offer home.',
    },
  };
  return {
    id: envoyErrandIdForOffer(offer),
    npcId: 'reeve',
    npcName: 'Reeve Mara',
    from: 'ashford',
    fromName: 'Ashford',
    to: 'irontown',
    toName: 'Irontown',
    purpose: 'sue',
    offer,
    acceptance: {
      accepted: true,
      offererId: 'ashford',
      targetId: 'irontown',
      receipt: {
        id: 'war-peace-decision.ashford.irontown.5',
        kind: 'war_peace_acceptance_read',
        tick: 5,
        offerId: 'peace-outcome-1',
        offererId: 'ashford',
        targetId: 'irontown',
        decision: 'accept',
        actualAction: 'peace',
        decidingTerm: 'cost_to_continue',
        bands: {
          cause: 'present',
          cost_to_continue: 'pressing',
          cost_to_stop: 'present',
          momentum: 'quiet',
        },
        reason: 'Both courts accept the carried peace.',
      },
      offererRead: {
        id: 'war-termination.ashford.irontown.5',
        kind: 'war_termination_read',
        tick: 5,
        attackerId: 'ashford',
        targetId: 'irontown',
        settlementIds: ['ashford', 'irontown'],
        decidingTerm: 'momentum',
      },
      targetTerminationReceipt: {
        id: 'war-termination.irontown.ashford.5',
        kind: 'war_termination_read',
        tick: 5,
        attackerId: 'irontown',
        targetId: 'ashford',
        settlementIds: ['irontown', 'ashford'],
        decidingTerm: 'cost_to_continue',
      },
      inheritedDemand: null,
      coalitionPeaceExpenditures: [{ settlementId: 'ashford', costBand: 'present' }],
    },
    snapshot: {
      storesBand: 'thin',
      strengthBand: 'ready',
      moraleExhaustionBand: 'present',
      foundingCauseStatus: 'live',
      believedRatioBand: 'matched',
    },
    termSheet: null,
    legs: [{
      fromId: 'ashford',
      toId: 'irontown',
      departTick: 5,
      arrivalTick: 7,
      journey: 'outbound',
      routeRef: { id: 'road-ash-iron', name: 'North Road' },
    }],
    positionRef: {
      journey: 'outbound',
      legIndex: 0,
      fromId: 'ashford',
      toId: 'irontown',
      progressBand: 'departed',
    },
    departedTick: 5,
    expectedReturnTick: 12,
    state: 'travelling',
  };
}

describe('persisted world hydration versus hot world normalization', () => {
  test('the hot path deep-clones admitted cargo but deliberately does not admit raw rows', () => {
    const forged = {
      id: 'forged-row',
      nested: { labels: ['not', 'a', 'valid', 'errand'] },
      negotiationPicture: { schemaVersion: 999 },
    };
    const rawRows = [forged];
    const hot = ensureWorldState({ envoyErrands: rawRows }, CAMPAIGN);

    expect(hot.envoyErrands).toEqual([forged]);
    expect(hot.envoyErrands).not.toBe(rawRows);
    expect(hot.envoyErrands[0]).not.toBe(forged);
    expect(hot.envoyErrands[0].nested).not.toBe(forged.nested);
    expect(hot.envoyErrands[0].nested.labels).not.toBe(forged.nested.labels);

    const hydrated = hydratePersistedWorldState({ envoyErrands: [forged] }, CAMPAIGN);
    // LIVENESS ANCHOR: every positive above measures the HOT world. A strict hydration
    // that returned undefined or {} would satisfy the absence below while admitting
    // nothing at all, so pin that a real world state came back first.
    expect(hydrated).toHaveProperty('schemaVersion');
    // anchored: `hydrated` is proven to be a materialized world state by the pin above
    expect(hydrated).not.toHaveProperty('envoyErrands');
  });

  test('valid persisted rows migrate, validate, deep-clone, and reach a byte fixpoint', () => {
    const errand = validEnvoyErrand();
    const raw = {
      schemaVersion: 1,
      religionStates: {
        ashford: { chiefRef: 'stormfather', chiefHeld: 4, share: 0.6 },
      },
      envoyErrands: [errand],
    };
    const hydrated = hydratePersistedWorldState(raw, CAMPAIGN);

    expect(hydrated.schemaVersion).toBe(2);
    expect(hydrated.religionStates.ashford).toEqual({
      share: 0.6,
      patronRef: 'stormfather',
      patronHeld: 4,
    });
    expect(hydrated.envoyErrands).toHaveLength(1);
    expect(hydrated.envoyErrands[0]).not.toBe(errand);
    expect(hydrated.envoyErrands[0].legs[0].routeRef).not.toBe(errand.legs[0].routeRef);
    expect(hydrated.envoyErrands[0].acceptance).not.toBe(errand.acceptance);
    expect(hydratePersistedWorldState(
      JSON.parse(JSON.stringify(hydrated)),
      CAMPAIGN,
    )).toEqual(hydrated);
  });

  test.each([
    ['teleporting lifecycle cursor', (row) => {
      Object.assign(row, {
        state: 'parlaying',
        parlayTick: 7,
        positionRef: { ...row.positionRef, progressBand: 'underway' },
      });
    }],
    ['malformed versioned carried terms', (row) => {
      row.termSheet = { schemaVersion: 1 };
    }],
    ['malformed frozen negotiation pictures', (row) => {
      row.negotiationPicture = { schemaVersion: 1 };
      row.targetCourtPicture = { schemaVersion: 1 };
    }],
  ])('strict hydration drops %s while the hot path preserves it', (_label, corrupt) => {
    const row = validEnvoyErrand();
    corrupt(row);
    const raw = { envoyErrands: [row] };

    expect(ensureWorldState(raw, CAMPAIGN)).toHaveProperty('envoyErrands');
    // The hot path above proves this fixture really carries the key. That alone anchors
    // the INPUT, not the SUBJECT: a strict path regressed to returning {} or undefined
    // would satisfy the absence below in all three cases. Bind the result and pin it.
    const strict = hydratePersistedWorldState(raw, CAMPAIGN);
    expect(strict).toHaveProperty('schemaVersion');
    // anchored: `strict` is proven a materialized world by the pin above, and the hot
    // anchored: path proves this same `raw` carries the key — a present-then-absent pair
    expect(strict).not.toHaveProperty('envoyErrands');
  });

  test('strict persistence de-duplicates by id with the last valid row winning', () => {
    const first = validEnvoyErrand();
    first.npcName = 'First Name';
    const last = structuredClone(first);
    last.npcName = 'Last Name';

    const hydrated = hydratePersistedWorldState({ envoyErrands: [first, last] }, CAMPAIGN);
    expect(hydrated.envoyErrands).toHaveLength(1);
    expect(hydrated.envoyErrands[0].npcName).toBe('Last Name');
  });

  test('the composed core invokes its injected envoy validator exactly once', () => {
    const rows = [validEnvoyErrand()];
    const validator = vi.fn(value => value);
    const world = ensureWorldStateWithEnvoyNormalizer(
      { envoyErrands: rows },
      CAMPAIGN,
      validator,
    );

    expect(validator).toHaveBeenCalledTimes(1);
    expect(validator).toHaveBeenCalledWith(rows);
    expect(world.envoyErrands).toEqual(rows);
  });
});
