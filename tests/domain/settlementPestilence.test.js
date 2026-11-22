/**
 * tests/domain/settlementPestilence.test.js — the M11a pestilence read-model
 * sibling (domain-readmodels-4). Pure display selector over the `epidemic`
 * spatial ledger: banded fiction, the includeGroundTruth seam, care posture,
 * codepoint order, inert-not-crash. Golden-inert (generation never imports it).
 */

import { describe, it, expect } from 'vitest';

import {
  settlementPestilence,
  realmPestilence,
  hasPestilence,
  campaignHasEpidemic,
  pestilenceSeverityBand,
} from '../../src/domain/display/settlementPestilence.js';

/** A minimal epidemic record (spatial/pestilence EpidemicRecord shape). */
function rec(over = {}) {
  return {
    phase: 'active', level: 0.8, arrivedTick: 10, incubateUntil: 12,
    sinceTick: 12, lastTick: 20, activeSince: 12, refractoryUntil: 0, sourceId: 'ash',
    ...over,
  };
}
function worldWith(ledger, extra = {}) {
  return { tick: 20, spatialLedgers: { epidemic: ledger }, ...extra };
}
const NAMES = new Map([['briar', 'Briarwatch'], ['ash', 'Ashford'], ['deep', 'Deepmoor']]);
const nameFor = (id) => NAMES.get(id) || id;

describe('settlementPestilence — banded fiction per phase', () => {
  it('an ACTIVE front burns, bands its severity, and names its origin', () => {
    const p = settlementPestilence({ worldState: worldWith({ briar: rec() }), settlementId: 'briar', nameFor });
    expect(p).toBeTruthy();
    expect(p.phase).toBe('active');
    expect(p.presence).toContain('Plague burns in Briarwatch');
    expect(p.severityBand).toBe(3);
    expect(p.severity).toBe('a raging plague');
    // No digest ⇒ direction-only origin fiction, but the source is named.
    expect(p.originFiction).toContain('Ashford');
    // The fiction never leaks the phase/level engine words.
    const blob = JSON.stringify({ presence: p.presence, severity: p.severity, originFiction: p.originFiction });
    for (const bad of ['incubating', 'recovering', 'epidemic', 'sourceId', 'level']) {
      expect(blob.toLowerCase().includes(bad.toLowerCase()), `fiction leaks ${bad}`).toBe(false);
    }
  });

  it('an INCUBATING front reads as the approach, not the outbreak', () => {
    const p = settlementPestilence({ worldState: worldWith({ briar: rec({ phase: 'incubating', level: 0 }) }), settlementId: 'briar', nameFor });
    expect(p.phase).toBe('incubating');
    expect(p.presence).toContain('has not yet broken out');
    expect(p.trend).toBe('approaching');
  });

  it('a RECOVERING front reads as passing', () => {
    const p = settlementPestilence({ worldState: worldWith({ briar: rec({ phase: 'recovering', level: 0.3 }) }), settlementId: 'briar', nameFor });
    expect(p.presence).toContain('is passing');
    expect(p.trend).toBe('receding');
  });

  it('a seed origin (no sourceId) began here', () => {
    const p = settlementPestilence({ worldState: worldWith({ briar: rec({ sourceId: '' }) }), settlementId: 'briar', nameFor });
    expect(p.origin).toBeNull();
    expect(p.originFiction).toBe('It began here.');
  });
});

describe('settlementPestilence — care posture + ground truth', () => {
  it('care posture is derived from a supplied settlement institution roster', () => {
    const tended = settlementPestilence({
      worldState: worldWith({ briar: rec() }), settlementId: 'briar', nameFor,
      settlement: { institutions: [{ name: 'Grand Temple' }, { name: 'Healing house' }, { name: 'Apothecary' }] },
    });
    expect(tended.care).toBeTruthy();
    expect(tended.care.band).toBeGreaterThanOrEqual(1);
    expect(tended.care.fiction.length).toBeGreaterThan(0);
    // A settlement with no care institutions reads as having little to hold it back.
    const bare = settlementPestilence({
      worldState: worldWith({ briar: rec() }), settlementId: 'briar', nameFor,
      settlement: { institutions: [{ name: 'Blacksmith' }] },
    });
    expect(bare.care.band).toBe(0);
    expect(bare.care.fiction).toContain('little here');
    // No settlement ⇒ no care block.
    const noneKnown = settlementPestilence({ worldState: worldWith({ briar: rec() }), settlementId: 'briar', nameFor });
    expect(noneKnown.care).toBeNull();
  });

  it('includeGroundTruth adds a raw truth block; default omits it', () => {
    const player = settlementPestilence({ worldState: worldWith({ briar: rec() }), settlementId: 'briar', nameFor });
    expect(player.truth).toBeUndefined();
    const dm = settlementPestilence({ worldState: worldWith({ briar: rec() }), settlementId: 'briar', nameFor, includeGroundTruth: true });
    expect(dm.truth).toBeTruthy();
    expect(dm.truth.level).toBe(0.8);
    expect(dm.truth.phase).toBe('active');
  });
});

describe('settlementPestilence — realm view + gates + inertness', () => {
  it('realmPestilence lists every afflicted settlement, severity desc then codepoint', () => {
    const world = worldWith({
      deep: rec({ level: 0.3, sourceId: 'ash' }), // band 1
      briar: rec({ level: 0.9 }),                 // band 3
      ash: rec({ level: 0.5, sourceId: '' }),     // band 2
    });
    const list = realmPestilence({ worldState: world, nameFor });
    expect(list.map(p => p.settlementId)).toEqual(['briar', 'ash', 'deep']);
  });

  it('hasPestilence / campaignHasEpidemic gate on presence', () => {
    expect(hasPestilence(worldWith({ briar: rec() }))).toBe(true);
    expect(hasPestilence(worldWith({}))).toBe(false);
    expect(hasPestilence(null)).toBe(false);
    const campaigns = [{ settlementIds: ['briar'], worldState: worldWith({ briar: rec() }) }];
    expect(campaignHasEpidemic(campaigns, 'briar')).toBe(true);
    expect(campaignHasEpidemic(campaigns, 'nope')).toBe(false);
    expect(campaignHasEpidemic(null, 'briar')).toBe(false);
  });

  it('is inert-not-crash on garbage and absent ledgers', () => {
    expect(settlementPestilence({ worldState: null, settlementId: 'a' })).toBeNull();
    expect(settlementPestilence({ worldState: {}, settlementId: 'a' })).toBeNull();
    expect(settlementPestilence({ worldState: { spatialLedgers: { epidemic: [] } }, settlementId: 'a' })).toBeNull();
    expect(settlementPestilence({ worldState: worldWith({ a: null }), settlementId: 'a' })).toBeNull();
    expect(settlementPestilence({ worldState: worldWith({ a: rec() }), settlementId: null })).toBeNull();
    expect(realmPestilence({ worldState: null })).toEqual([]);
    expect(realmPestilence({ worldState: {} })).toEqual([]);
  });

  it('severity bands behave at their edges', () => {
    expect(pestilenceSeverityBand(0)).toBe(0);
    expect(pestilenceSeverityBand(0.2)).toBe(1);
    expect(pestilenceSeverityBand(0.45)).toBe(2);
    expect(pestilenceSeverityBand(0.7)).toBe(3);
  });
});
