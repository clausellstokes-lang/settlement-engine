/**
 * espionagePresence.test.js — ES-5b: §3.11 THE ABSENCE COST, the bench grain's own pins.
 *
 * Acceptance cases A1, A3, A4, A6 and A7 (A2, A5 and A8 live in the dormancy fence file).
 *
 * ⭐ EVERY CASE THAT CLAIMS "THE REACH" DRIVES **BOTH** CONSUMPTION SITES ON ONE FIXTURE.
 * The whole reason this packet is worth building is that §3.11's "factionCompetition
 * read[s] the same bloc weights … with no further code" is FALSE as measured — that file
 * has no bloc read of any kind — so the reach had to be BUILT on the contest weight the
 * file actually has. A pin that only measured the bench would leave the contest half
 * exactly as unproven as the design sentence was, so the council share and the contest
 * severity are asserted TOGETHER, off the same world, in the same test.
 *
 * ⚠ THE CONTEST SITE IS DRIVEN THROUGH ITS PRODUCTION SEAM, NEVER REACHED INTO.
 * `topFactionEntries` is private and stays private; the observable is `metadata.power` on
 * a real candidate out of `evaluateFactionRules`, which is exactly the address the CPL-20
 * row registers. Reaching for the private producer would pin a function instead of the
 * behavior four severity terms actually read.
 *
 * ⚠ NO BARE NEGATIVES. This file is new, so `negativeAssertionAnchor.walker` gives it a
 * ceiling of ZERO un-anchored `not.toContain`/`not.toMatch`/`not.toHaveProperty` sites.
 * The one genuine absence claim routes through `expectAbsentWithAnchor`, whose liveness
 * arm is an EXECUTED precondition rather than prose claiming a control exists.
 */
import { describe, expect, it } from 'vitest';

import { presenceSharesFor, presentShare01 } from '../../src/domain/worldPulse/espionage/espionagePresence.js';
import { ESPIONAGE_TUNING } from '../../src/domain/worldPulse/espionage/espionageMath.js';
import { WHEREABOUTS_STATES } from '../../src/domain/roads/state.js';
import {
  SETTLEMENT_POLITICS_TUNING,
  coalitionConsolidation01,
  rulingBlocOf,
} from '../../src/domain/worldPulse/settlementPolitics.js';
import { evaluateFactionRules, pressureIndex } from '../../src/domain/worldPulse/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const AWAY_WORD = 'visiting';

/** The rulebook test's own pressure shape, at a crisis-band legitimacy. */
function pressuresFor(settlementIds, score = 0.88) {
  return pressureIndex(settlementIds.flatMap((settlementId) => (
    ['food', 'disease', 'conflict', 'trade', 'legitimacy', 'crime'].map((kind) => ({
      settlementId, kind, score, label: `${kind} pressure`, reasons: [`test ${kind}`],
    }))
  )));
}

/** One npc roster entry. `npcId(saveId, npc, i)` keys it `S1:<id>`. */
const npc = (id, state = null) => ({
  id, name: id, ...(state ? { whereabouts: { state, placeId: 'S2', purposeKind: 'trade' } } : {}),
});

/**
 * A faction state as `ensureFactionStates` mints one, plus the fields the four candidate
 * rules read. `key` is the factionStates key, which production mints with
 * `factionId(item.id, faction, index)` — the SAME expression `topFactionEntries` uses.
 */
function factionState(key, name, archetype, memberNpcIds) {
  return {
    factionId: key,
    settlementId: 'S1',
    name,
    archetype,
    governmentPreference: 'noble_patronage',
    controlledInstitutions: [],
    suppressedInstitutions: [],
    lawPreferences: ['land_tenure'],
    rivals: [],
    memberNpcIds,
    internalSeats: {},
    captureState: 'none',
    legitimacyClaim: 0.4,
    riskTolerance: 0.6,
    momentum: 0.3,
    exhaustion: 0,
  };
}

/**
 * ONE world serving both consumers. Noble House governs and carries FOUR members; the
 * Merchant League carries four who never leave, so it is the court-wide control that
 * makes the discount a RATIO rather than a constant (a uniform court-wide discount
 * cancels exactly, which is why only a differentially-absent faction can lose ground).
 *
 * @param {{ lit?: boolean, nobleAway?: string|null, nobleName?: string,
 *   nobleRosterId?: string|null, nobleMembers?: string[]|null|undefined }} [options]
 */
function buildWorld(options = {}) {
  const {
    lit = true, nobleAway = null, nobleName = 'Noble House',
    nobleRosterId = null, nobleMembers,
  } = options;
  const nobleKey = `S1:${nobleRosterId || 'noble_house'}`;
  const nobles = ['npc_1', 'npc_2', 'npc_3', 'npc_4'];
  const merchants = ['npc_5', 'npc_6', 'npc_7', 'npc_8'];
  const npcs = [
    ...nobles.map((id, index) => npc(id, index === 0 ? nobleAway : null)),
    ...merchants.map((id) => npc(id)),
  ];
  const worldState = {
    spatialCanonVersion: 1,
    tick: 3,
    simulationRules: {
      settlementPoliticsEnabled: true,
      factionCompetitionEnabled: true,
      // `espionageActive` is a THREE-DOOR conjunction and `beliefsActive` is the first
      // door: it demands a positive `spatialCanonVersion` AND a non-omniscient infoMode,
      // and `infoModeOf` returns 'omniscient' for an ABSENT key. Both worlds below carry
      // this identically so the ONLY difference between lit and dark is the espionage
      // pair — otherwise every "dark is byte-identical" claim here would be measuring
      // the belief gate instead of the flag it names.
      infoMode: 'full',
      ...(lit ? { errandSpineEnabled: true, espionageEnabled: true } : {}),
    },
    factionStates: {
      [nobleKey]: factionState(
        nobleKey, nobleName, 'noble',
        nobleMembers === undefined ? nobles.map((id) => `S1:${id}`) : nobleMembers,
      ),
      'S1:merchant_league': factionState(
        'S1:merchant_league', 'Merchant League', 'merchant', merchants.map((id) => `S1:${id}`),
      ),
    },
    politicsLedgers: {
      S1: {
        blocs: [{
          id: 'noble_house',
          members: ['Noble House'],
          glue: [{ type: 'concession', detail: '' }],
          end: 'seats',
          strain: 0.2,
          sinceTick: 0,
        }],
      },
    },
    proposals: [],
  };
  const item = {
    id: 'S1',
    settlement: {
      npcs,
      services: [{ id: 'granary', name: 'Public Granary' }],
      powerStructure: {
        factions: [
          {
            ...(nobleRosterId ? { id: nobleRosterId } : {}),
            faction: 'Noble House', power: 60, isGoverning: true,
          },
          { faction: 'Merchant League', power: 40 },
        ],
      },
    },
  };
  return { worldState, item, snapshot: { worldState, settlements: [item] } };
}

/** The Noble House candidate's recorded contest weight — the CPL-20 row's observable. */
function nobleContestWeight(snapshot) {
  const candidates = evaluateFactionRules(snapshot, pressuresFor(['S1']), { tick: 4 });
  const noble = candidates.filter((candidate) => candidate.metadata?.factionName === 'Noble House');
  expect(noble.length, 'the contest arm produced no Noble House candidate at all — the'
    + ' fixture stopped driving the rule family, so any weight comparison below would be'
    + ' comparing two absences').toBeGreaterThan(0);
  const weights = new Set(noble.map((candidate) => candidate.metadata.power));
  expect(weights.size, 'one faction, one contest weight per tick').toBe(1);
  return [...weights][0];
}

describe('ES-5b A1 — the reach: an absent faction weighs less at BOTH sites', () => {
  it('4 members, 1 traveling ⇒ share 0.875, and the SAME factor moves bench and contest', () => {
    const expected = Math.round((1 - ESPIONAGE_TUNING.ABSENT_W * 0.25) * 10000) / 10000;
    expect(expected, 'the chair-set ABSENT_W is 0.5, so a quarter abroad costs an eighth').toBe(0.875);

    const lit = buildWorld({ lit: true, nobleAway: 'traveling' });
    const dark = buildWorld({ lit: false, nobleAway: 'traveling' });

    // The kernel itself, on the fixture's own roster.
    const shares = presenceSharesFor(lit.worldState, lit.item);
    expect(shares.byFactionId.get('S1:noble_house')).toBe(0.875);
    expect(shares.byNameKey.get('noble_house')).toBe(0.875);
    expect(shares.byFactionId.get('S1:merchant_league'), 'nobody abroad ⇒ identity').toBe(1);

    // SITE 1 — THE COUNCIL BENCH. 60/100 dark; 52.5/92.5 lit. The discount reaches the
    // numerator and the denominator together, so this is a differential, not a scaling.
    const darkBloc = rulingBlocOf(dark.worldState, 'S1', dark.item);
    const litBloc = rulingBlocOf(lit.worldState, 'S1', lit.item);
    expect(darkBloc.consolidation).toBe(0.6);
    expect(litBloc.consolidation).toBe(0.5676);
    expect(litBloc.consolidation).toBeLessThan(darkBloc.consolidation);
    // …and it stays a ruling bloc: the floor is not crossed at ABSENT_W = 0.5 here.
    expect(litBloc.consolidation)
      .toBeGreaterThan(SETTLEMENT_POLITICS_TUNING.RULING_CONSOLIDATION_FLOOR);
    expect(coalitionConsolidation01(lit.worldState, 'S1', lit.item)).toBe(0.5676);

    // SITE 2 — THE CONTEST MATH, by the same factor exactly.
    const darkWeight = nobleContestWeight(dark.snapshot);
    const litWeight = nobleContestWeight(lit.snapshot);
    expect(darkWeight).toBe(0.6);
    expect(litWeight).toBe(0.525);
    expect(litWeight / darkWeight).toBeCloseTo(0.875, 10);

    // …AND THE CANDIDATE SET IS BYTE-STABLE, which is D8's whole claim: selection stays
    // on RAW power, so a lightened faction is WEAKENED, never SILENCED.
    const idsOf = (snapshot) => evaluateFactionRules(snapshot, pressuresFor(['S1']), { tick: 4 })
      .map((candidate) => `${candidate.factionId}|${candidate.candidateType}`).sort();
    expect(idsOf(lit.snapshot)).toEqual(idsOf(dark.snapshot));
  });
});

describe('ES-5b A3 — the counterforce: a hostage is already off-stage', () => {
  it('a hostage discounts ZERO while a visiting member on the same fixture discounts, at both sites', () => {
    const hostage = buildWorld({ lit: true, nobleAway: 'hostage' });
    const visiting = buildWorld({ lit: true, nobleAway: AWAY_WORD });
    const dark = buildWorld({ lit: false, nobleAway: 'hostage' });

    // THE NEGATIVE — and the POSITIVE CONTROL that makes it mean something. Same world,
    // same roster, same member; only the whereabouts word moves.
    expect(presenceSharesFor(hostage.worldState, hostage.item).byFactionId.get('S1:noble_house')).toBe(1);
    expect(presenceSharesFor(visiting.worldState, visiting.item).byFactionId.get('S1:noble_house')).toBe(0.875);

    // Both consumption sites agree with the kernel: hostage ⇒ identical to DARK.
    expect(rulingBlocOf(hostage.worldState, 'S1', hostage.item).consolidation)
      .toBe(rulingBlocOf(dark.worldState, 'S1', dark.item).consolidation);
    expect(nobleContestWeight(hostage.snapshot)).toBe(nobleContestWeight(dark.snapshot));
    // …and the visiting control really does move the same two readings off that value.
    expect(rulingBlocOf(visiting.worldState, 'S1', visiting.item).consolidation).toBe(0.5676);
    expect(nobleContestWeight(visiting.snapshot)).toBe(0.525);
  });

  it('THE AWAY SET IS DERIVED FROM THE FROZEN EXPORT, so a fifth roads state cannot escape', () => {
    // A TOTAL positive predicate over the roads totality rather than a re-typed triple:
    // every member is dispositioned by this loop, so the day WHEREABOUTS_STATES grows a
    // member this test asks the new question automatically instead of ignoring it.
    expect(WHEREABOUTS_STATES.length, 'the roads totality emptied').toBeGreaterThan(1);
    const dispositioned = [];
    for (const state of WHEREABOUTS_STATES) {
      const world = buildWorld({ lit: true, nobleAway: state });
      const share = presenceSharesFor(world.worldState, world.item).byFactionId.get('S1:noble_house');
      dispositioned.push(state);
      if (state === 'hostage') {
        expect(share, 'a hostage is already off-stage — §3.11 excludes them BY NAME').toBe(1);
      } else {
        expect(share, `'${state}' is in WHEREABOUTS_STATES minus hostage and MUST discount`).toBe(0.875);
      }
    }
    expect(dispositioned).toEqual([...WHEREABOUTS_STATES]);
    // The exclusion itself, anchored on a sibling that travels the same frozen export and
    // survives exactly the regression this guards (a hostage wrongly joining the away set).
    const derivedAwaySet = WHEREABOUTS_STATES.filter((state) => presentShare01(
      ['S1:npc_1'],
      new Map([['S1:npc_1', { whereabouts: { state } }]]),
    ) < 1);
    expectAbsentWithAnchor(derivedAwaySet, 'hostage', AWAY_WORD, 'the derived away set');
    expect(derivedAwaySet.sort(), 'the away set IS the frozen export minus hostage')
      .toEqual([...WHEREABOUTS_STATES].filter((state) => state !== 'hostage').sort());
  });
});

describe('ES-5b A4 — sparse and malformed rosters degrade to the IDENTITY multiplier', () => {
  it('absent, empty, unresolvable and stateless rosters all read exactly 1 — never 0, NaN or undefined', () => {
    const index = new Map([['S1:npc_1', { whereabouts: { state: AWAY_WORD } }]]);
    for (const [label, roster] of [
      ['absent', undefined],
      ['null', null],
      ['non-array', 'S1:npc_1'],
      ['empty', []],
      ['unresolvable id', ['S1:ghost']],
    ]) {
      const share = presentShare01(roster, index);
      expect(share, `${label} roster`).toBe(1);
      expect(Number.isFinite(share), `${label} roster is finite`).toBe(true);
    }
    // NON-VACUITY: the same index DOES discount a roster it can resolve, so the five
    // identities above are refusals rather than a dead index.
    expect(presentShare01(['S1:npc_1'], index)).toBe(0.5);
    // An absent npc index is the sixth degradation, and it is the caller-side one.
    expect(presentShare01(['S1:npc_1'], undefined)).toBe(1);

    // …and at BOTH SITES: a faction with NO factionStates entry at all is untouched. The
    // contest arm skips a faction it has no state for, so the whole CANDIDATE LIST is the
    // observable here rather than one weight — comparing two absent weights would prove
    // nothing, which is exactly the trap this shape avoids.
    const orphan = buildWorld({ lit: true, nobleAway: AWAY_WORD });
    delete orphan.worldState.factionStates['S1:noble_house'];
    const orphanDark = buildWorld({ lit: false, nobleAway: AWAY_WORD });
    delete orphanDark.worldState.factionStates['S1:noble_house'];
    expect(presenceSharesFor(orphan.worldState, orphan.item).byFactionId.get('S1:noble_house'))
      .toBeUndefined();
    expect(rulingBlocOf(orphan.worldState, 'S1', orphan.item).consolidation)
      .toBe(rulingBlocOf(orphanDark.worldState, 'S1', orphanDark.item).consolidation);
    const orphanRun = (snapshot) => JSON.stringify(
      evaluateFactionRules(snapshot, pressuresFor(['S1']), { tick: 4 }),
    );
    expect(orphanRun(orphan.snapshot)).toBe(orphanRun(orphanDark.snapshot));
    // NON-VACUITY for that identity: the list is non-empty, and the Merchant League — the
    // faction that still HAS a state — is the sibling proving the arm still runs.
    const orphanCandidates = evaluateFactionRules(orphan.snapshot, pressuresFor(['S1']), { tick: 4 });
    expect(orphanCandidates.length).toBeGreaterThan(0);
    expect(orphanCandidates.every((candidate) => candidate.metadata.factionName === 'Merchant League'))
      .toBe(true);

    // An EMPTY roster on a live entry is the fourth sparse shape, driven end to end.
    const empty = buildWorld({ lit: true, nobleAway: AWAY_WORD, nobleMembers: [] });
    expect(presenceSharesFor(empty.worldState, empty.item).byFactionId.get('S1:noble_house')).toBe(1);
    expect(nobleContestWeight(empty.snapshot)).toBe(0.6);
  });
});

describe('ES-5b A6 — determinism and order-independence', () => {
  it('same world twice ⇒ identical bloc output and identical candidate list', () => {
    const a = buildWorld({ lit: true, nobleAway: 'traveling' });
    const b = buildWorld({ lit: true, nobleAway: 'traveling' });
    expect(JSON.stringify(rulingBlocOf(a.worldState, 'S1', a.item)))
      .toBe(JSON.stringify(rulingBlocOf(b.worldState, 'S1', b.item)));
    const run = (snapshot) => JSON.stringify(
      evaluateFactionRules(snapshot, pressuresFor(['S1']), { tick: 4 }),
    );
    expect(run(a.snapshot)).toBe(run(b.snapshot));
  });

  it('the share is a RATIO, so reversing memberNpcIds in place cannot move it', () => {
    const index = new Map([
      ['S1:npc_1', { whereabouts: { state: 'traveling' } }],
      ['S1:npc_2', {}],
      ['S1:npc_3', { whereabouts: { state: 'hostage' } }],
      ['S1:npc_4', {}],
    ]);
    const roster = ['S1:npc_1', 'S1:npc_2', 'S1:npc_3', 'S1:npc_4'];
    const forward = presentShare01(roster, index);
    expect(forward, 'one of four away ⇒ an eighth off; the hostage is not counted').toBe(0.875);
    expect(presentShare01([...roster].reverse(), index)).toBe(forward);
    roster.reverse();
    expect(presentShare01(roster, index), 'reversed IN PLACE, per case A6').toBe(forward);
  });
});

describe('ES-5b A7 — the key mirror: two derivations, one faction, no minted spelling', () => {
  it('byFactionId joins the contest id and byNameKey joins the bench roster key when they DIVERGE', () => {
    // The case where the two derivations come apart: the roster entry carries an explicit
    // `id`, so `factionId(...)` keys on it while the bench keys on the DISPLAY name.
    const lit = buildWorld({
      lit: true, nobleAway: AWAY_WORD, nobleRosterId: 'house_of_valen', nobleName: 'Noble House',
    });
    const dark = buildWorld({
      lit: false, nobleAway: AWAY_WORD, nobleRosterId: 'house_of_valen', nobleName: 'Noble House',
    });
    const shares = presenceSharesFor(lit.worldState, lit.item);
    expect([...shares.byFactionId.keys()].sort())
      .toEqual(['S1:house_of_valen', 'S1:merchant_league']);
    expect([...shares.byNameKey.keys()].sort()).toEqual(['merchant_league', 'noble_house']);
    expect(shares.byFactionId.get('S1:house_of_valen')).toBe(0.875);
    expect(shares.byNameKey.get('noble_house')).toBe(0.875);

    // BOTH joins land, on the diverged fixture, through the real consumers.
    expect(rulingBlocOf(lit.worldState, 'S1', lit.item).consolidation).toBe(0.5676);
    expect(nobleContestWeight(lit.snapshot)).toBe(0.525);
    expect(rulingBlocOf(dark.worldState, 'S1', dark.item).consolidation).toBe(0.6);
    expect(nobleContestWeight(dark.snapshot)).toBe(0.6);
  });

  it('A FAILED name join degrades to share 1 — byte-identical to base, never to 0', () => {
    // A factionStates name the roster does not carry. The contest join still lands (it is
    // keyed on the id), so this isolates the BENCH key: an unjoinable name must yield the
    // identity multiplier, which is the difference between a quiet no-op and a court whose
    // governing faction silently drops to zero weight.
    const unjoinable = buildWorld({ lit: true, nobleAway: AWAY_WORD, nobleName: 'Ghost Assembly' });
    const dark = buildWorld({ lit: false, nobleAway: AWAY_WORD, nobleName: 'Ghost Assembly' });
    const shares = presenceSharesFor(unjoinable.worldState, unjoinable.item);
    expect(shares.byNameKey.get('noble_house'), 'nothing joins the roster key').toBeUndefined();
    expect(shares.byNameKey.get('ghost_assembly'), 'the entry is present under its own name').toBe(0.875);
    expect(JSON.stringify(rulingBlocOf(unjoinable.worldState, 'S1', unjoinable.item)))
      .toBe(JSON.stringify(rulingBlocOf(dark.worldState, 'S1', dark.item)));
    // NON-VACUITY: the SAME fixture with a joinable name really does move the bench, so
    // the byte-identity above is a degradation and not a dead code path.
    const joinable = buildWorld({ lit: true, nobleAway: AWAY_WORD });
    expect(rulingBlocOf(joinable.worldState, 'S1', joinable.item).consolidation).toBe(0.5676);
  });
});
