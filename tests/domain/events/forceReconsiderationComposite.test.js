/**
 * tests/domain/events/forceReconsiderationComposite.test.js — composer-realm-verbs-1.
 *
 * FORCE_RECONSIDERATION was functionally DEAD from the composer: its course dial was
 * a '__live__' placeholder that was never resolved, so every UI-staged order refused
 * at APPLY (reconsideration_no_course). The fix stages the LIVE (actorId, courseKey)
 * course as one composite target value; stageArgs (splitCourseTarget) splits it into
 * the { targetId, courseKey } the momentum apply arm reads.
 *
 * This is the composer → mint → approve integration pin:
 *  - the manifest targetOptions emit composite ids that round-trip to a real course,
 *  - the split args MINT an ok proposal AND APPLY without refusing,
 *  - the old '__live__' placeholder (and an unsplit composite) still refuse — proving
 *    the composite is load-bearing.
 */

import { describe, it, expect } from 'vitest';

import {
  realmVerbFor, splitCourseTarget, courseOptions, COURSE_TARGET_SEP,
} from '../../../src/domain/events/realmManifest.js';
import { mintRealmVerbProposal } from '../../../src/domain/worldPulse/applyWorldPulse.js';
import { applyRealmVerbOrder, REALM_VERB_PAYLOAD_KIND } from '../../../src/domain/worldPulse/realmVerbExecution.js';

// momentumActive needs beliefsActive too (infoMode lights the belief layer).
const MOMENTUM_LIT = { infoMode: 'unreliable', momentumEnabled: true, infoStatecraftEnabled: true };
const NOW = '2026-01-01T00:00:00.000Z';

/** A world carrying ONE live committed course a>war:b with real stock. */
function worldWithCourse(stock = 20) {
  return {
    tick: 9, simulationRules: { ...MOMENTUM_LIT }, spatialCanonVersion: 1, proposals: [],
    deployments: { a: { targetId: 'b', currentEffectiveStrength: 40 } },
    spatialLedgers: { commitments: { 'a>war:b': { stock, sinceTick: 0, lastDepositTick: 9, deposits: [] } } },
  };
}
const SAVES = [
  { id: 'a', settlement: { id: 'a', name: 'Aldford', powerStructure: { publicLegitimacy: { score: 50 } } } },
  { id: 'b', settlement: { id: 'b', name: 'Brackwater' } },
];
const CTX = { settlements: SAVES.map(s => ({ id: s.id, name: s.settlement.name, settlement: s.settlement })) };
const updatesMap = () => new Map(SAVES.map(s => [s.id, { saveId: s.id, settlement: s.settlement }]));
const snapshot = { settlements: CTX.settlements };

function applyReconsider(args) {
  return applyRealmVerbOrder({
    state: worldWithCourse(20), snapshot, settlementUpdates: updatesMap(),
    outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_RECONSIDERATION', args } },
    tick: 9, now: NOW,
  });
}

describe('FORCE_RECONSIDERATION composite course dial (composer-realm-verbs-1)', () => {
  it('the entry carries NO placeholder course dial — the target dial + a pressure band only', () => {
    const entry = realmVerbFor('FORCE_RECONSIDERATION');
    const keys = entry.dials.map(d => d.key);
    expect(keys).toContain('targetId');
    expect(keys).toContain('pressure01');
    expect(keys).not.toContain('courseKey'); // the dead '__live__' dial is gone
    for (const d of entry.dials) {
      if (d.kind === 'enum') for (const o of d.options) expect(String(o).startsWith('__')).toBe(false);
    }
  });

  it('targetOptions emit composite ids that round-trip to the live (actorId, courseKey)', () => {
    const entry = realmVerbFor('FORCE_RECONSIDERATION');
    const ws = worldWithCourse(20);
    const opts = entry.targetOptions(ws, CTX);
    expect(opts).toHaveLength(1);
    expect(opts[0].id).toBe(`a${COURSE_TARGET_SEP}war:b`);
    const split = splitCourseTarget({ targetId: opts[0].id, pressure01: 0.6 });
    const live = courseOptions(ws, 9)[0];
    expect(split.targetId).toBe(live.actorId);
    expect(split.courseKey).toBe(live.courseKey);
    expect(split.pressure01).toBe(0.6); // other dials survive the split
  });

  it('MINT: the split composite mints an ok proposal (composer → mint)', () => {
    const entry = realmVerbFor('FORCE_RECONSIDERATION');
    const ws = worldWithCourse(20);
    const composite = entry.targetOptions(ws, CTX)[0].id;
    const staged = splitCourseTarget({ targetId: composite, pressure01: 0.6 });
    const minted = mintRealmVerbProposal({
      campaign: { worldState: ws }, saves: SAVES, verb: 'FORCE_RECONSIDERATION', args: staged, now: NOW,
    });
    expect(minted.ok).toBe(true);
    expect(minted.proposalId).toBeTruthy();
  });

  it('APPROVE (apply): the split composite resolves the course and does NOT refuse', () => {
    const entry = realmVerbFor('FORCE_RECONSIDERATION');
    const composite = entry.targetOptions(worldWithCourse(20), CTX)[0].id;
    const r = applyReconsider(splitCourseTarget({ targetId: composite, pressure01: 0.6 }));
    expect(r.refusal).toBeNull();
    // The stock was withdrawn through the ledger — the order actually LANDED.
    expect(r.worldState.spatialLedgers.commitments['a>war:b'].stock).toBeLessThan(20);
  });

  it('NEGATIVE CONTROL: the old \'__live__\' placeholder still refuses at apply (the exact bug)', () => {
    const r = applyReconsider({ targetId: 'a', courseKey: '__live__', pressure01: 0.6 });
    expect(r.refusal?.code).toBe('reconsideration_no_course');
  });

  it('NEGATIVE CONTROL: an UNSPLIT composite target refuses (the split is load-bearing)', () => {
    const composite = realmVerbFor('FORCE_RECONSIDERATION').targetOptions(worldWithCourse(20), CTX)[0].id;
    const r = applyReconsider({ targetId: composite, courseKey: '', pressure01: 0.6 });
    expect(r.refusal?.code).toBe('reconsideration_no_course');
  });
});
