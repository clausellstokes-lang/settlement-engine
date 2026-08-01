/**
 * brokeragePatronage.test.js — [W-I INFORMATION BROKERAGES] I3 §7, WHO THE HOUSE SERVES.
 *
 * THE FOUR CLAIMS, each with an executed negative control:
 *   1. a binding is derived, seeded, and stable across recomputation (THE PROMISE);
 *   2. REBINDING RIDES THE EXISTING CAPTURE MACHINERY, proved by driving the real
 *      faction-competition applier rather than by hand-writing a controlledInstitutions
 *      list, with the capture removed as the control;
 *   3. the faction-state key this module mints is BYTE-EQUAL to the key the faction layer
 *      itself mints, proved against the real `ensureFactionStates` (the local-copy parity
 *      pin the module's own header promises);
 *   4. a covert patron is DM truth: the player projection drops the name and keeps the
 *      house, and an exposed one projects in full.
 *
 * Plus dormancy: dark ⇒ no bindings at all, by an empty result rather than by an absent key.
 */
import { describe, expect, test } from 'vitest';
import {
  BROKERAGE_PATRON_SOURCES,
  PATRON_ELIGIBILITY,
  brokeragePatronBindings,
  capturedPatronOf,
  eligiblePatrons,
  genesisPatronOf,
  projectPatronBindings,
} from '../../src/domain/worldPulse/brokeragePatronage.js';
import { applyFactionPatch, ensureFactionStates } from '../../src/domain/worldPulse/factionCompetition.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const EXCHANGE = Object.freeze({
  name: "Chroniclers' exchange",
  tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
});
const MARKET = Object.freeze({
  name: 'Whisper market',
  tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
});
const SMITHY = Object.freeze({ name: 'Blacksmiths (3-10)', tags: ['metalwork'] });

const FACTIONS = Object.freeze([
  { name: 'The Grey Council', category: 'government', power: 60, isGoverning: true },
  { name: 'Ashwater Syndicate', category: 'criminal', power: 40 },
  { name: 'Coin Guild', category: 'merchant', power: 30 },
]);

/** @param {string} id @param {readonly unknown[]} institutions */
function itemOf(id, institutions) {
  return {
    id,
    settlement: {
      name: id,
      institutions: [...institutions],
      powerStructure: { factions: FACTIONS.map((f) => ({ ...f })) },
    },
  };
}

const LIT_RULES = Object.freeze({
  infoMode: 'unreliable', infoStatecraftEnabled: true, informationBrokeragesEnabled: true,
});
const DARK_RULES = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true });

/** @param {Record<string, unknown>} rules @param {Record<string, unknown>} [factionStates] */
function worldOf(rules, factionStates = {}) {
  return { tick: 4, spatialCanonVersion: 1, simulationRules: rules, factionStates };
}

describe('W-I I3 — brokerage patronage', () => {
  test('the closed vocabularies are exactly the design\'s', () => {
    expect(BROKERAGE_PATRON_SOURCES).toEqual(['genesis', 'captured']);
    // Design §7: legal houses bind to ruling and mercantile powers, illegal to criminal.
    expect(PATRON_ELIGIBILITY.legal).toContain('government');
    expect(PATRON_ELIGIBILITY.legal).toContain('merchant');
    expect(PATRON_ELIGIBILITY.illegal[0]).toBe('criminal');
    // A temple cannot shelter a loft, and a syndicate cannot hold a licence. ANCHORED by
    // the two positive memberships asserted on the same list immediately above.
    expectAbsentWithAnchor(PATRON_ELIGIBILITY.legal, 'criminal', 'government', 'legal family');
    expectAbsentWithAnchor(PATRON_ELIGIBILITY.illegal, 'religious', 'criminal', 'illegal family');
  });

  test('eligibility is ranked and family-scoped, and a house nobody may own binds to nobody', () => {
    const item = itemOf('aaa', [EXCHANGE, MARKET]);
    const legal = eligiblePatrons(item, 'legal');
    expect(legal.map((row) => row.archetype)).toEqual(['government', 'merchant']);
    const illegal = eligiblePatrons(item, 'illegal');
    expect(illegal.map((row) => row.archetype)).toEqual(['criminal']);

    // NEGATIVE CONTROL: strip the criminal power and the illegal house has no patron at
    // all. The legal roster is asserted STILL POPULATED in the same breath, so the empty
    // reading is a selection and not a collapsed producer.
    const lawful = itemOf('aaa', [EXCHANGE, MARKET]);
    lawful.settlement.powerStructure.factions = FACTIONS
      .filter((f) => f.category !== 'criminal').map((f) => ({ ...f }));
    expect(eligiblePatrons(lawful, 'illegal')).toEqual([]);
    expect(eligiblePatrons(lawful, 'legal').length).toBe(2);
    expect(genesisPatronOf(lawful, { institutionId: 'whisper_market', legality: 'illegal' })).toBeNull();
  });

  test('a binding is seeded, stable, and per-house (THE PROMISE)', () => {
    const world = worldOf(LIT_RULES);
    const item = itemOf('aaa', [EXCHANGE, MARKET]);
    const first = brokeragePatronBindings({ worldState: world, item });
    const second = brokeragePatronBindings({ worldState: world, item: itemOf('aaa', [EXCHANGE, MARKET]) });
    expect(first.length).toBe(2);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(first.every((row) => row.source === 'genesis')).toBe(true);
    // The two houses are bound INDEPENDENTLY: the legal house cannot end up serving the
    // syndicate, and the covert one cannot end up serving the council.
    const byHouse = Object.fromEntries(first.map((row) => [row.institutionId, row]));
    expect(byHouse.chroniclers_exchange.patronArchetype).toMatch(/government|merchant/);
    expect(byHouse.whisper_market.patronArchetype).toBe('criminal');
    expect(byHouse.whisper_market.covert).toBe(true);
    expect(byHouse.chroniclers_exchange.covert).toBe(false);
  });

  test('a non-brokerage institution is not a house, and a ruined house is not standing', () => {
    const world = worldOf(LIT_RULES);
    expect(brokeragePatronBindings({ worldState: world, item: itemOf('aaa', [SMITHY]) })).toEqual([]);
    const ruined = { ...EXCHANGE, status: 'ruined' };
    const live = brokeragePatronBindings({ worldState: world, item: itemOf('aaa', [EXCHANGE]) });
    const dead = brokeragePatronBindings({ worldState: world, item: itemOf('aaa', [ruined]) });
    // PRESENT-THEN-ABSENT: the same roster shape binds when the house stands, so the
    // empty reading measures the ruin filter and not a collapsed derivation.
    expect(live.length).toBe(1);
    expect(dead).toEqual([]);
  });

  test('the faction-state key is byte-equal to the one the faction layer itself mints', () => {
    // THE PARITY PIN the module header promises. `ensureFactionStates` is the real minter;
    // if it ever renames a key, this reds here rather than silently binding houses to
    // powers the capture machinery cannot address.
    const item = itemOf('aaa', [EXCHANGE, MARKET]);
    const snapshot = { settlements: [item] };
    const ensured = ensureFactionStates({}, snapshot, { fork: () => ({ random: () => 0 }) });
    const minted = new Set(Object.keys(ensured.factionStates));
    const derived = [
      ...eligiblePatrons(item, 'legal'),
      ...eligiblePatrons(item, 'illegal'),
    ].map((row) => row.factionStateId);
    expect(derived.length).toBeGreaterThan(0);
    for (const key of derived) expect(minted.has(key)).toBe(true);
  });

  test('REBINDING RIDES THE EXISTING CAPTURE MACHINERY', () => {
    const item = itemOf('aaa', [EXCHANGE]);
    const snapshot = { settlements: [item] };
    const ensured = ensureFactionStates({ simulationRules: LIT_RULES, spatialCanonVersion: 1 },
      snapshot, { fork: () => ({ random: () => 0 }) });
    const before = brokeragePatronBindings({ worldState: ensured, item });
    expect(before.length).toBe(1);
    expect(before[0].source).toBe('genesis');

    // The capture is applied through the REAL faction applier, with the exact outcome
    // shape `faction_institution_capture` authors: a factionPatch whose
    // controlledInstitutions accretes the target institution id.
    const captor = eligiblePatrons(item, 'legal')
      .find((row) => row.factionStateId !== before[0].patronId);
    expect(captor).toBeTruthy();
    const captured = applyFactionPatch(ensured, {
      type: 'faction',
      factionId: captor.factionStateId,
      factionPatch: { controlledInstitutions: ['chroniclers_exchange'], recentAction: 'capture_institution' },
    });
    const after = brokeragePatronBindings({ worldState: captured, item });
    expect(after[0].patronId).toBe(captor.factionStateId);
    expect(after[0].source).toBe('captured');
    expect(capturedPatronOf(captured, 'aaa', 'chroniclers_exchange').factionStateId)
      .toBe(captor.factionStateId);

    // NEGATIVE CONTROL: without the capture the SAME reader returns the genesis patron,
    // so the rebind measures the capture and not a reader that always prefers the captor.
    expect(capturedPatronOf(ensured, 'aaa', 'chroniclers_exchange')).toBeNull();
    expect(brokeragePatronBindings({ worldState: ensured, item })[0].source).toBe('genesis');
  });

  test('a covert patron is DM truth; the player projection keeps the house and drops the name', () => {
    const world = worldOf(LIT_RULES);
    const item = itemOf('aaa', [EXCHANGE, MARKET]);
    const bindings = brokeragePatronBindings({ worldState: world, item });
    const dm = projectPatronBindings(bindings, { audience: 'dm' });
    expect(JSON.stringify(dm)).toBe(JSON.stringify(bindings));

    const player = projectPatronBindings(bindings, { audience: 'player' });
    // The HOUSE survives (a Whisper market is a place people know about) and the PATRON
    // does not. Both halves asserted, so a projection that dropped the row entirely, or
    // one that dropped nothing, both fail.
    expect(player.length).toBe(bindings.length);
    const covert = player.find((row) => row.covert);
    expect(covert.houseName).toBe('Whisper market');
    expect(covert.patronName).toBe('unknown');
    expect(covert.patronId).toBe('');
    const open = player.find((row) => !row.covert);
    expect(open.patronName).toBe(bindings.find((row) => !row.covert).patronName);

    // EXPOSED ⇒ projects in full, which is the control proving the redaction is
    // conditional rather than unconditional.
    const exposed = projectPatronBindings(bindings, { audience: 'player', exposed: ['whisper_market'] });
    expect(exposed.find((row) => row.covert).patronName)
      .toBe(bindings.find((row) => row.covert).patronName);
  });

  test('DORMANCY — a dark flag yields no binding at all', () => {
    const item = itemOf('aaa', [EXCHANGE, MARKET]);
    expect(brokeragePatronBindings({ worldState: worldOf(DARK_RULES), item })).toEqual([]);
    // The lit reading on the identical item is the liveness anchor for that empty.
    expect(brokeragePatronBindings({ worldState: worldOf(LIT_RULES), item }).length).toBe(2);
    // And every partial gate is dark too (no canon marker, no statecraft flag).
    expect(brokeragePatronBindings({
      worldState: { simulationRules: LIT_RULES }, item,
    })).toEqual([]);
    expect(brokeragePatronBindings({
      worldState: worldOf({ infoMode: 'unreliable', informationBrokeragesEnabled: true }), item,
    })).toEqual([]);
  });
});
