import { describe, expect, it } from 'vitest';

import {
  applyEnvoySilenceInference,
  beliefRecord,
  canApplyEnvoySilenceInference,
  clearEnvoySilenceInference,
} from '../../src/domain/worldPulse/beliefMap.js';

const RECORD = Object.freeze({
  readiness: 0.5,
  strengthBand: 2,
  allianceLabel: 'trade_partner',
  faithLabel: null,
  confidence01: 0.7,
  lastUpdateTick: 8,
});

function litWorld() {
  return {
    tick: 12,
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full' },
    spatialLedgers: {
      beliefMaps: { home: { seat: { target: { ...RECORD } } } },
    },
  };
}

describe('WR-7a envoy silence is a fallible belief, not truth', () => {
  it('amends an existing picture once and the exact returning envoy clears it', () => {
    const world = litWorld();
    const inferred = applyEnvoySilenceInference({
      worldState: world,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.1',
      tick: 12,
    });

    expect(inferred.changed).toBe(true);
    expect(beliefRecord(inferred.worldState, 'home', 'target')).toEqual({
      ...RECORD,
      allianceLabel: 'hostile',
      hostilityInference: {
        kind: 'envoy_silence',
        errandId: 'envoy.offer.1',
        sinceTick: 12,
        priorAllianceLabel: 'trade_partner',
        priorLastUpdateTick: 8,
      },
    });
    expect(applyEnvoySilenceInference({
      worldState: inferred.worldState,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.1',
      tick: 13,
    }).worldState).toBe(inferred.worldState);

    const wrong = clearEnvoySilenceInference({
      worldState: inferred.worldState,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'another-envoy',
    });
    expect(wrong.worldState).toBe(inferred.worldState);

    const answered = clearEnvoySilenceInference({
      worldState: inferred.worldState,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.1',
    });
    expect(answered.changed).toBe(true);
    expect(beliefRecord(answered.worldState, 'home', 'target')).toEqual(RECORD);

    const refreshedWorld = {
      ...inferred.worldState,
      spatialLedgers: {
        ...inferred.worldState.spatialLedgers,
        beliefMaps: {
          home: {
            seat: {
              target: {
                ...beliefRecord(inferred.worldState, 'home', 'target'),
                allianceLabel: 'neutral',
                lastUpdateTick: 13,
              },
            },
          },
        },
      },
    };
    const conflictSafe = clearEnvoySilenceInference({
      worldState: refreshedWorld,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.1',
    });
    expect(beliefRecord(conflictSafe.worldState, 'home', 'target')).toMatchObject({
      allianceLabel: 'neutral',
      lastUpdateTick: 13,
    });
    expect(beliefRecord(conflictSafe.worldState, 'home', 'target'))
      .not.toHaveProperty('hostilityInference');
  });

  it('does not fabricate missing axes or materialize anything while beliefs are dark', () => {
    const missing = litWorld();
    missing.spatialLedgers.beliefMaps = { home: { seat: {} } };
    expect(canApplyEnvoySilenceInference({
      worldState: missing,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.2',
    })).toBe(false);
    expect(applyEnvoySilenceInference({
      worldState: missing,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.2',
      tick: 12,
    }).worldState).toBe(missing);

    const dark = { ...litWorld(), simulationRules: { infoMode: 'omniscient' } };
    expect(canApplyEnvoySilenceInference({
      worldState: dark,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.2',
    })).toBe(false);
    expect(applyEnvoySilenceInference({
      worldState: dark,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.2',
      tick: 12,
    }).worldState).toBe(dark);
  });

  it('clears an exact persisted inference even while belief reads are temporarily omniscient', () => {
    const inferred = applyEnvoySilenceInference({
      worldState: litWorld(),
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.mode-switch',
      tick: 12,
    });
    expect(inferred.changed).toBe(true);

    const omniscient = {
      ...inferred.worldState,
      simulationRules: { ...inferred.worldState.simulationRules, infoMode: 'omniscient' },
    };
    const answered = clearEnvoySilenceInference({
      worldState: omniscient,
      observerId: 'home',
      subjectId: 'target',
      errandId: 'envoy.offer.mode-switch',
    });
    expect(answered.changed).toBe(true);

    const fullAgain = {
      ...answered.worldState,
      simulationRules: { ...answered.worldState.simulationRules, infoMode: 'full' },
    };
    expect(beliefRecord(fullAgain, 'home', 'target')).toEqual(RECORD);
  });
});
