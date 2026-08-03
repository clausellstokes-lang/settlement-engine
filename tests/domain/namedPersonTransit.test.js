/**
 * namedPersonTransit.test.js — WR-7a law M, the shared named-person speed floor.
 */
import { describe, expect, it } from 'vitest';
import {
  NAMED_PERSON_TRANSIT_TUNING,
  namedPersonArrivalTick,
  namedPersonLegPosition,
  namedPersonLegTicks,
  namedPersonPathPosition,
  openNamedPersonLeg,
} from '../../src/domain/worldPulse/namedPersonTransit.js';

describe('WR-7a law M — one shared weekly floor with injected grade price', () => {
  it('no absent, zero, tiny, or fast-grade leg arrives in less than one week', () => {
    expect(NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS).toBe(1);
    expect(namedPersonLegTicks({ nominalWeeks: null })).toBe(1);
    expect(namedPersonLegTicks({ nominalWeeks: 0 })).toBe(1);
    expect(namedPersonLegTicks({ nominalWeeks: 0.1, gradeMultiplier: 0.1 })).toBe(1);
    expect(namedPersonLegTicks({ nominalWeeks: 1, gradeMultiplier: 0.75 })).toBe(1);
  });

  it('the caller injects grade price while the shared kernel owns flooring', () => {
    expect(namedPersonLegTicks({ nominalWeeks: 8, gradeMultiplier: 0.75 })).toBe(6);
    expect(namedPersonLegTicks({ nominalWeeks: 8, gradeMultiplier: 1 })).toBe(8);
    expect(namedPersonLegTicks({ nominalWeeks: 8, gradeMultiplier: 1.5 })).toBe(12);
    expect(namedPersonLegTicks({ nominalWeeks: 8, gradeMultiplier: 2 })).toBe(16);
    expect(namedPersonLegTicks({ nominalWeeks: 8, gradeMultiplier: 'unknown' })).toBe(8);
  });

  it('opens the established H3/J4 leg shape without a false conditional key', () => {
    expect(openNamedPersonLeg({
      fromId: 'a', toId: 'b', departTick: 7.9, nominalWeeks: 3, hidden: false,
    })).toEqual({ fromId: 'a', toId: 'b', departTick: 7, arrivalTick: 10 });
    expect(openNamedPersonLeg({
      fromId: 'a', toId: 'b', departTick: 7, nominalWeeks: 3, hidden: true,
    })).toEqual({ fromId: 'a', toId: 'b', departTick: 7, arrivalTick: 10, hidden: true });
    expect(namedPersonArrivalTick({ departTick: 7.9, nominalWeeks: 0 })).toBe(8);
  });
});

describe('WR-7a law M — the road is a real position', () => {
  const leg = openNamedPersonLeg({
    fromId: 'a', toId: 'd', departTick: 10, nominalWeeks: 4,
  });

  it('stays explicitly mid-route until the arrival tick', () => {
    expect(namedPersonLegPosition(leg, 10)).toEqual({
      arrived: false, atSettlementId: null, progress01: 0,
    });
    expect(namedPersonLegPosition(leg, 12)).toEqual({
      arrived: false, atSettlementId: null, progress01: 0.5,
    });
    expect(namedPersonLegPosition(leg, 14)).toEqual({
      arrived: true, atSettlementId: 'd', progress01: 1,
    });
  });

  it('projects the same position over a frozen path in either direction', () => {
    const path = ['a', 'b', 'c', 'd'];
    const outbound = namedPersonPathPosition({
      path, departTick: 10, arrivalTick: 14, tick: 12,
    });
    const returning = namedPersonPathPosition({
      path, departTick: 10, arrivalTick: 14, tick: 12, reverse: true,
    });
    expect(outbound).toMatchObject({ nodeId: 'b', nodeIndex: 1, hopIndex: 1, progress01: 0.5 });
    expect(returning).toMatchObject({ nodeId: 'b', nodeIndex: 1, hopIndex: 0, progress01: 0.5 });
  });
});
