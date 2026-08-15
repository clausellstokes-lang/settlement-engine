/**
 * espionageLeak.test.js — ES-6a: THE DOUBLE AGENT'S LEAK, the leaf's own pins.
 *
 * Acceptance cases A1, A3, A4 and A6. A2/A5/A7/A8 live in
 * tests/property/espionageLeakDormancy.test.js.
 *
 * ── ⚠ NO BARE NEGATIVES. This file is NEW, so `negativeAssertionAnchor.walker` holds it at a
 * ceiling of ZERO un-anchored sites and no frozen row is legally available to it. None of the
 * three scanned matchers appears here at all: every claim below is an equality, an inequality
 * or a count. That is ES-5c's and ES-5d's precedent in their sibling files.
 *
 * ── ⭐ THE LEASH VOCABULARY IS DERIVED FROM THE RESOLVER, NEVER RE-TYPED HERE ────────────
 * Which kinds are FOREIGN comes from the resolver's own exported predicate, and which foreign
 * kind a production writer actually MINTS is read back out of the resolver by driving its
 * betrayal-seed road. So the day a writer for another foreign kind appears, these pins move
 * with the resolver instead of quietly asserting a hand-copied list that has stopped being
 * true. A hand-typed kind list is the address-rot class in a costume.
 */
import { describe, expect, it } from 'vitest';

import { isForeignLeashKind, resolveLeash } from '../../src/domain/corruptionLeash.js';
import { BELIEF_TUNING } from '../../src/domain/worldPulse/beliefMap.js';
import {
  LEAK_TUNING,
  deliverMissionLeaks,
  leakTargetFor,
} from '../../src/domain/worldPulse/espionage/espionageLeak.js';

const HOME = 'ashford';
const SUBJECT = 'irontown';
const PATRON = 'westmarch';
const TICK = 12;

/** A belief row in the shape the ledger actually holds. */
const belief = (over = {}) => ({
  readiness: 0.4,
  strengthBand: 3,
  allianceLabel: 'rival',
  faithLabel: null,
  confidence01: 0.8,
  lastUpdateTick: 11,
  ...over,
});

/**
 * A world with espionage, the errand spine, beliefs and the corruption web all lit, carrying
 * whatever belief slices the case needs.
 * @param {{patronSeat?: Record<string, unknown>|null, rules?: Record<string, unknown>}} [args]
 */
function world({ patronSeat = null, rules = {} } = {}) {
  /** @type {Record<string, unknown>} */
  const maps = { [HOME]: { seat: { [SUBJECT]: belief({ allianceLabel: 'hostile' }) } } };
  if (patronSeat) maps[PATRON] = { seat: patronSeat };
  return {
    tick: TICK,
    spatialCanonVersion: 1,
    simulationRules: {
      infoMode: 'unreliable',
      errandSpineEnabled: true,
      espionageEnabled: true,
      corruptionWebEnabled: true,
      ...rules,
    },
    spatialLedgers: { beliefMaps: maps },
  };
}

/** The betrayal-seeded traitor: the ONE foreign-leash shape production actually writes. */
const leashed = (id = 'npc.reeve') => ({ id, name: 'Reeve Mara', corruptTies: { foreignPatron: PATRON } });
/** An operative with an EXPLICIT normalized leash of a chosen kind. */
const withLeash = (kind, over = {}) => ({
  id: `npc.${kind}`,
  name: 'Reeve Mara',
  corruptTies: { leash: { kind, ...over }, criminalInstitution: 'Thieves' },
});

const LIVE = () => new Map([[HOME, {}], [SUBJECT, {}], [PATRON, {}]]);
const landing = (over = {}) => ({
  errandId: 'e1',
  observerId: HOME,
  subjectId: SUBJECT,
  product: 'acquire',
  world: 'magic',
  accuracy01: 0.9,
  completeness01: 1,
  changed: true,
  ...over,
});
const patronSlice = (state) => /** @type {any} */ (state).spatialLedgers?.beliefMaps?.[PATRON] ?? null;
const homeSlice = (state) => JSON.stringify(/** @type {any} */ (state).spatialLedgers?.beliefMaps?.[HOME]);

// ── A1. THE MAIN REACHABLE BEHAVIOR ────────────────────────────────────────────────────
describe('ES-6a A1 — a leashed operative delivers his patron a copy, and the patron learns twice', () => {
  it('writes BOTH arms: the mission subject, and confidence about the HOME court itself', () => {
    // The patron already holds a (stale, low-confidence) opinion about home, which is what
    // makes arm 2 expressible at all — a CONFIRM asserts the observer's OWN prior.
    const before = world({ patronSeat: { [HOME]: belief({ allianceLabel: 'neutral', confidence01: 0.3 }) } });
    const out = deliverMissionLeaks({
      worldState: before,
      tick: TICK,
      landings: [landing()],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });

    expect(out.changed).toBe(true);
    expect(out.leaks).toHaveLength(1);
    expect(out.leaks[0].patronId).toBe(PATRON);
    expect(out.leaks[0].patronKind).toBe('foreign_settlement');
    expect(out.leaks[0].arms).toEqual(['intel', 'existence']);
    expect(out.leaks[0].reason).toBe('leaked');

    // ARM 1 — the enemy court now holds a belief about the mission's subject that it did not
    // hold at all before, carrying the DISCOUNTED fidelity rather than the home court's.
    const seat = /** @type {any} */ (patronSlice(out.worldState)).seat;
    expect(Object.keys(seat).sort()).toEqual([HOME, SUBJECT].sort());
    expect(seat[SUBJECT].lastUpdateTick).toBe(TICK);
    expect(out.leaks[0].accuracy01).toBe(0.63);
    expect(out.leaks[0].accuracy01).toBeLessThan(landing().accuracy01);

    // ARM 2 — and its opinion about HOME is firmer than it was, without changing what that
    // opinion IS: a confirm asserts the prior, so only the confidence moves.
    expect(seat[HOME].allianceLabel).toBe('neutral');
    expect(seat[HOME].confidence01).toBeGreaterThan(0.3);

    // THE REACH IS THE CLAIM, AND SO IS THE SILENCE: home's own slice is untouched.
    expect(homeSlice(out.worldState)).toBe(homeSlice(before));
  });

  it('materializes a FIRST-EVER observer slice for a patron the ledger had never keyed', () => {
    // The belief ledger is arrival-gated: it never pre-populates pairs. The leak IS the
    // arrival, which is the whole reason espionage exists as a source of distant legs.
    const before = world();
    expect(patronSlice(before)).toBe(null);
    const out = deliverMissionLeaks({
      worldState: before,
      tick: TICK,
      landings: [landing()],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });
    expect(Object.keys(/** @type {any} */ (patronSlice(out.worldState)).seat)).toEqual([SUBJECT]);
  });
});

// ── A3. THE COUNTERFORCE, ANCHORED BY A LIVE POSITIVE IN THE SAME FIXTURE ──────────────
describe('ES-6a A3 — only a foreign COURT leash leaks, and the negative is anchored', () => {
  it('leaks for the leashed man and for nobody else, on one tick, in one call', () => {
    // ⭐ THE ANCHOR: the refusals below are measured in the SAME pass as a man who really does
    // leak. Without that control an "it wrote nothing" reading would hold just as well if the
    // whole leaf were dead.
    const out = deliverMissionLeaks({
      worldState: world(),
      tick: TICK,
      landings: [
        landing({ errandId: 'traitor' }),
        landing({ errandId: 'localOrg' }),
        landing({ errandId: 'cutout' }),
        landing({ errandId: 'bare' }),
      ],
      operatives: new Map([
        ['traitor', leashed()],
        ['localOrg', withLeash('local_org')],
        ['cutout', withLeash('cutout', { viaLocalOrg: 'Thieves' })],
        ['bare', { id: 'npc.honest', name: 'Honest Jan' }],
      ]),
      byId: LIVE(),
    });
    expect(out.leaks.map((row) => [row.errandId, row.changed]))
      .toEqual([['traitor', true], ['localOrg', false], ['cutout', false], ['bare', false]]);
    expect(out.leaks.slice(1).map((row) => row.reason))
      .toEqual(['local_leash', 'local_leash', 'local_leash']);
    // Exactly ONE patron slice exists, so the three refusals wrote nothing anywhere.
    expect(Object.keys(/** @type {any} */ (out.worldState).spatialLedgers.beliefMaps).sort())
      .toEqual([HOME, PATRON].sort());
  });

  it('partitions the leash vocabulary using the RESOLVER\'s own contract, not a typed list', () => {
    // The one foreign kind a production writer mints, read back out of the resolver itself.
    const written = resolveLeash(/** @type {any} */ ({ corruptTies: { foreignPatron: PATRON } })).kind;
    expect(isForeignLeashKind(written)).toBe(true);
    const kinds = ['local_org', 'cutout', 'foreign_settlement', 'foreign_faction', 'foreign_org'];
    const verdicts = kinds.map((kind) => {
      const target = leakTargetFor({
        worldState: world(),
        npc: withLeash(kind, { settlementId: PATRON, factionName: 'The Circle' }),
      });
      return [kind, target.leaks, target.reason];
    });
    // Every NON-foreign kind refuses as local; every FOREIGN kind that is not the written one
    // refuses by naming its MISSING ENDPOINT rather than being skipped in silence, so the day
    // a writer for one appears the reason is already on the receipt.
    for (const [kind, leaks, reason] of verdicts) {
      if (!isForeignLeashKind(String(kind))) {
        expect([kind, leaks, reason]).toEqual([kind, false, 'local_leash']);
      } else if (kind === written) {
        expect([kind, leaks, reason]).toEqual([kind, true, 'foreign_patron']);
      } else {
        expect([kind, leaks, reason]).toEqual([kind, false, 'no_settlement_endpoint']);
      }
    }
    // Anti-vacuity: the partition really did exercise all three arms.
    expect(verdicts.filter(([, leaks]) => leaks === true)).toHaveLength(1);
    expect(verdicts.filter(([, , reason]) => reason === 'no_settlement_endpoint')).toHaveLength(2);
  });
});

// ── A4. SPARSE, MALFORMED-BUT-SUPPORTED, AND THE FIDELITY BOUNDARY ────────────────────
describe('ES-6a A4 — every refusal names its reason, and nothing throws', () => {
  it('handles the whole sparse register with zero throws and zero partial writes', () => {
    const ops = new Map([
      ['e1', leashed()],
      ['faction', withLeash('foreign_faction', { factionName: 'The Circle' })],
      ['ghost', { id: 'npc.ghost', corruptTies: { foreignPatron: 'nowhere' } }],
      ['selfPatron', { id: 'npc.self', corruptTies: { foreignPatron: HOME } }],
    ]);
    const cases = [
      [[], []],
      [[landing({ changed: false })], ['home_belief_unchanged']],
      [[landing({ errandId: 'faction' })], ['no_settlement_endpoint']],
      [[landing({ errandId: 'ghost' })], ['patron_not_live']],
      [[landing({ errandId: 'selfPatron' })], ['patron_is_home']],
      [[landing({ errandId: 'absent' })], ['no_operative']],
    ];
    for (const [landings, reasons] of cases) {
      const before = world();
      let out;
      expect(() => {
        out = deliverMissionLeaks({
          worldState: before, tick: TICK, landings, operatives: ops, byId: LIVE(),
        });
      }).not.toThrow();
      const result = /** @type {any} */ (out);
      expect(result.leaks.map((row) => row.reason)).toEqual(reasons);
      expect(result.changed).toBe(false);
      // Byte-identity on BOTH sides, so a partial write cannot hide on either.
      expect(JSON.stringify(result.worldState.spatialLedgers.beliefMaps))
        .toBe(JSON.stringify(before.spatialLedgers.beliefMaps));
      for (const row of result.leaks) expect(Number.isFinite(Number(row.accuracy01))).toBe(true);
    }
  });

  it('refuses arm 1 when the patron IS the subject, and STILL fires arm 2', () => {
    // ⭐ THE CASE THE FEATURE WOULD BE VACUOUS WITHOUT. The belief writer refuses
    // `observer === subject` generically, so an intel-only leak would write NOTHING here —
    // and this is the case the design calls out by name ("whether or not it is the target").
    const before = world({ patronSeat: { [HOME]: belief({ allianceLabel: 'neutral', confidence01: 0.3 }) } });
    const out = deliverMissionLeaks({
      worldState: before,
      tick: TICK,
      landings: [landing({ subjectId: PATRON })],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });
    expect(out.leaks[0].reason).toBe('patron_is_subject');
    expect(out.leaks[0].arms).toEqual(['existence']);
    expect(out.changed).toBe(true);
    const seat = /** @type {any} */ (patronSlice(out.worldState)).seat;
    expect(Object.keys(seat)).toEqual([HOME]);
    expect(seat[HOME].confidence01).toBeGreaterThan(0.3);
  });

  it('takes the built-in honesty refusal when the patron has never heard of home', () => {
    const out = deliverMissionLeaks({
      worldState: world(),
      tick: TICK,
      landings: [landing({ subjectId: PATRON })],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });
    // Arm 1 refused for the pair, arm 2 refused for want of a prior — and NOTHING is
    // manufactured out of a court's ignorance.
    expect(out.leaks[0].arms).toEqual([]);
    expect(out.changed).toBe(false);
    expect(patronSlice(out.worldState)).toBe(null);
  });

  it('⭐ proves BOTH SIDES of the fidelity boundary the tuning was DERIVED from', () => {
    // THE DERIVATION, RE-DERIVED HERE RATHER THAN RESTATED: the belief layer adopts a
    // categorical value only at or above CAT_ADOPT_ACCURACY, so the discount decides the home
    // read at which a leak stops being a conclusion and becomes a rumour.
    const crossing = BELIEF_TUNING.CAT_ADOPT_ACCURACY / LEAK_TUNING.FIDELITY_W;
    expect(crossing).toBeGreaterThan(0.85);
    expect(crossing).toBeLessThan(0.86);
    // The patron must hold a DIFFERENT label, or adoption is unobservable: the belief layer
    // adopts unconditionally when there is no prior at all.
    const seatOf = (accuracy01) => {
      const out = deliverMissionLeaks({
        worldState: world({ patronSeat: { [SUBJECT]: belief({ allianceLabel: 'allied', confidence01: 0.5 }) } }),
        tick: TICK,
        landings: [landing({ accuracy01 })],
        operatives: new Map([['e1', leashed()]]),
        byId: LIVE(),
      });
      return { leaked: out.leaks[0].accuracy01, ...(/** @type {any} */ (patronSlice(out.worldState)).seat[SUBJECT]) };
    };
    // A CLEAR LOOK — above the crossing — leaks a CONCLUSION the enemy can act on.
    const clear = seatOf(0.9);
    expect(0.9).toBeGreaterThan(crossing);
    expect(clear.leaked).toBe(0.63);
    expect(Number(clear.leaked)).toBeGreaterThanOrEqual(BELIEF_TUNING.CAT_ADOPT_ACCURACY);
    expect(clear.allianceLabel).toBe('hostile');
    // A PARTIAL LOOK — below it — leaks only that SOMETHING HAPPENED: the label survives and
    // only the confidence moves.
    const partial = seatOf(0.8);
    expect(0.8).toBeLessThan(crossing);
    expect(partial.leaked).toBe(0.56);
    expect(Number(partial.leaked)).toBeLessThan(BELIEF_TUNING.CAT_ADOPT_ACCURACY);
    expect(partial.allianceLabel).toBe('allied');
    expect(partial.confidence01).toBeGreaterThan(0.5);
  });
});

// ── A6. IDEMPOTENCY AND REPEAT ────────────────────────────────────────────────────────
describe('ES-6a A6 — a second pass with no new landing leaks nothing, and mints no marker', () => {
  it('leaks once per landing, and a landing-free second pass is inert', () => {
    const first = deliverMissionLeaks({
      worldState: world(),
      tick: TICK,
      landings: [landing()],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });
    expect(first.changed).toBe(true);
    const second = deliverMissionLeaks({
      worldState: first.worldState,
      tick: TICK + 1,
      landings: [],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });
    expect(second.changed).toBe(false);
    expect(second.leaks).toEqual([]);
    expect(second.worldState).toBe(first.worldState);
    // NO PERSISTED MARKER: the only ledger this leaf ever touches is the belief map it writes
    // through, so a second telling is decided by the belief layer's own arithmetic and not by
    // a consume-once byte of this wave's invention.
    expect(Object.keys(/** @type {any} */ (second.worldState).spatialLedgers)).toEqual(['beliefMaps']);
  });

  it('leaks AGAIN when the mission lands again on a later tick, by design', () => {
    const first = deliverMissionLeaks({
      worldState: world(),
      tick: TICK,
      landings: [landing()],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });
    const again = deliverMissionLeaks({
      worldState: first.worldState,
      tick: TICK + 4,
      landings: [landing()],
      operatives: new Map([['e1', leashed()]]),
      byId: LIVE(),
    });
    expect(again.changed).toBe(true);
    const before = /** @type {any} */ (patronSlice(first.worldState)).seat[SUBJECT];
    const after = /** @type {any} */ (patronSlice(again.worldState)).seat[SUBJECT];
    expect(after.lastUpdateTick).toBe(TICK + 4);
    expect(after.confidence01).toBeGreaterThan(before.confidence01);
  });
});
