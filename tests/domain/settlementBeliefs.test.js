/**
 * settlementBeliefs.test.js — Phase 5.5 WAVE A, the DM belief read-model +
 * the player/DM scrub (adversarial).
 *
 * The belief map is DM knowledge. The player projection (includeGroundTruth
 * false, the default) is EMPTY — a player never sees any settlement's internal
 * model of the world, so beliefs add nothing to a player-facing surface
 * ("player projection unchanged"). The DM projection surfaces the belief + a
 * confidence/staleness band + the divergence against a supplied ground truth.
 */
import { describe, it, expect } from 'vitest';

import { settlementBeliefs, hasBeliefMaps } from '../../src/domain/display/settlementBeliefs.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';

function world() {
  return {
    tick: 20,
    beliefMaps: {
      alderport: { [GOVERNING_SEAT_KEY]: {
        // a STALE belief: alderport thinks Grimhold negligible + still an enemy
        grimhold: { readiness: 0, strengthBand: 0, allianceLabel: 'hostile', faithLabel: 'Old Sea-God', confidence01: 0.35, lastUpdateTick: 4 },
        // a CURRENT, confident belief
        rivermouth: { readiness: 0.75, strengthBand: 3, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 19 },
      } },
    },
  };
}

const nameFor = (id) => ({ grimhold: 'Grimhold', rivermouth: 'Rivermouth' }[id] || id);

describe('WAVE A — settlementBeliefs player/DM scrub', () => {
  it('the PLAYER projection (default, includeGroundTruth false) is EMPTY — beliefs are DM-only', () => {
    expect(settlementBeliefs({ worldState: world(), observerId: 'alderport' })).toEqual([]);
    expect(settlementBeliefs({ worldState: world(), observerId: 'alderport', includeGroundTruth: false })).toEqual([]);
  });

  it('ADVERSARIAL: no belief internal (strengthBand, confidence, faithLabel, allianceLabel) leaks into a player call', () => {
    const projection = JSON.stringify(settlementBeliefs({ worldState: world(), observerId: 'alderport' }));
    for (const leak of ['strengthBand', 'confidence', 'Old Sea-God', 'hostile', 'lastUpdateTick']) {
      expect(projection).not.toContain(leak);
    }
  });

  it('the DM projection surfaces each belief with confidence + staleness bands, codepoint-sorted', () => {
    const rows = settlementBeliefs({ worldState: world(), observerId: 'alderport', includeGroundTruth: true, nameFor });
    expect(rows.map((r) => r.subjectId)).toEqual(['grimhold', 'rivermouth']); // codepoint order
    const g = rows[0];
    expect(g.subjectName).toBe('Grimhold');
    expect(g.believed.strengthWord).toBe('negligible');
    expect(g.confidence).toBe('uncertain');     // 0.35
    expect(g.staleness).toBe('stale');          // 20 - 4 = 16 ticks old
    const r = rows[1];
    expect(r.confidence).toBe('certain');       // 0.9
    expect(r.staleness).toBe('current');        // 20 - 19 = 1
  });

  it('the DM projection joins a supplied ground truth into a legible DIVERGENCE', () => {
    const truthOf = (id) => (id === 'grimhold'
      ? { strengthBand: 4, readiness: 0.75, allianceLabel: 'trade_partner', faithLabel: 'Old Sea-God' }
      : null);
    const rows = settlementBeliefs({ worldState: world(), observerId: 'alderport', includeGroundTruth: true, truthOf, nameFor });
    const g = rows.find((row) => row.subjectId === 'grimhold');
    const div = g.divergence.join(' | ');
    expect(div).toMatch(/underestimates/);          // believed negligible, is overwhelming
    expect(div).toMatch(/trade_partner/);           // stale hostility
    expect(div).toMatch(/at peace|mobilizing|in the field/); // readiness gap
    // rivermouth (no truth supplied) ⇒ no divergence
    const rm = rows.find((row) => row.subjectId === 'rivermouth');
    expect(rm.divergence).toEqual([]);
  });

  it('an unknown observer / absent ledger ⇒ [] (inert, not crash); hasBeliefMaps gates the surface', () => {
    expect(settlementBeliefs({ worldState: world(), observerId: 'nowhere', includeGroundTruth: true })).toEqual([]);
    expect(settlementBeliefs({ worldState: {}, observerId: 'alderport', includeGroundTruth: true })).toEqual([]);
    expect(settlementBeliefs({ worldState: null, observerId: 'a', includeGroundTruth: true })).toEqual([]);
    expect(hasBeliefMaps(world())).toBe(true);
    expect(hasBeliefMaps({})).toBe(false);
    expect(hasBeliefMaps(null)).toBe(false);
  });
});
