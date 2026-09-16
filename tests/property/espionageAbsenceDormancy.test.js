/**
 * espionageAbsenceDormancy.test.js — ES-5b: the absence cost's dormancy fences, the
 * declared one-tick lag, and the ⟨F6⟩ GOLDEN PAIR.
 *
 * Acceptance cases A2, A5 and A8. A1/A3/A4/A6/A7 live in tests/domain/espionagePresence.test.js.
 *
 * ── ⭐ HOW "BYTE-IDENTICAL TO BASE" IS MEASURED HERE, SINCE THE OLD CODE IS GONE ───────
 * A dormancy fence that only asserted "dark equals dark" would be comparing two runs of
 * the same branch and would stay green if the discount had been wired to fire in EVERY
 * world. So every identity claim below is TRIANGULATED across three worlds that differ in
 * exactly one thing each:
 *
 *   DARK+AWAY   — a member really is abroad, and the discount code is never REACHED.
 *   LIT+PRESENT — the discount code IS reached and computes the IDENTITY (every share 1).
 *   LIT+AWAY    — the discount is reached and really BITES.
 *
 * `DARK+AWAY === LIT+PRESENT` is the packet's own probe-6 identity control: it proves the
 * lit path with `s ≡ 1` reproduces base output exactly, so the dark path — which does
 * strictly less — cannot differ either. `LIT+AWAY !== LIT+PRESENT` is the anti-vacuity
 * anchor that stops all of it from being three readings of a dead feature.
 *
 * ── ⚠ ONE CLAUSE OF CASE A2 IS UNEXECUTABLE AS WRITTEN, AND IT IS REFUSED FORWARD ─────
 * A2(c) asks for "espionage-lit + `factionCompetitionEnabled` dark ⇒ the faction arm is
 * byte-identical WHILE THE BENCH ARM MOVES". The second half cannot happen, and the
 * reason is in `settlementPolitics.js`'s own gate: `settlementPoliticsActive` is the
 * conjunction `settlementPoliticsEnabled === true && factionCompetitionEnabled === true`
 * (factionStates are meaningless without the subsystem that maintains them — that module's
 * own dormancy docblock says so). So darkening `factionCompetitionEnabled` darkens the
 * BENCH too: `settlementBlocs` returns [], `rulingBlocOf` returns null, and there is no
 * bench reading left to move. The executable half is pinned below in full — the faction
 * arm's SECOND gate really is independent of espionage — and the contradiction is recorded
 * rather than papered over by a weaker assertion wearing A2(c)'s name.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  blocDecisionFactor,
  rulingBlocOf,
  settlementBlocs,
} from '../../src/domain/worldPulse/settlementPolitics.js';
import {
  evaluateFactionRules,
  evaluateWorldPulseRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LOAD_BEARING_MOVES = ['deploy', 'sue_for_peace', 'fortify', 'defend'];

const npc = (id, state = null) => ({
  id, name: id, ...(state ? { whereabouts: { state, placeId: 'S2', purposeKind: 'trade' } } : {}),
});

function factionState(key, name, archetype, memberNpcIds) {
  return {
    factionId: key, settlementId: 'S1', name, archetype,
    governmentPreference: 'noble_patronage',
    controlledInstitutions: [], suppressedInstitutions: [],
    lawPreferences: ['land_tenure'], rivals: [], memberNpcIds,
    internalSeats: {}, captureState: 'none',
    legitimacyClaim: 0.4, riskTolerance: 0.6, momentum: 0.3, exhaustion: 0,
  };
}

/**
 * @param {{ lit?: boolean, away?: string|null, rules?: Record<string, unknown>,
 *   canon?: boolean }} [options]
 */
function buildWorld(options = {}) {
  const { lit = true, away = null, rules = {}, canon = true } = options;
  const nobles = ['npc_1', 'npc_2', 'npc_3', 'npc_4'];
  const merchants = ['npc_5', 'npc_6', 'npc_7', 'npc_8'];
  const npcs = [
    ...nobles.map((id, index) => npc(id, index === 0 ? away : null)),
    ...merchants.map((id) => npc(id)),
  ];
  const worldState = {
    ...(canon ? { spatialCanonVersion: 1 } : {}),
    tick: 3,
    simulationRules: {
      settlementPoliticsEnabled: true,
      factionCompetitionEnabled: true,
      infoMode: 'full',
      ...(lit ? { errandSpineEnabled: true, espionageEnabled: true } : {}),
      ...rules,
    },
    factionStates: {
      'S1:noble_house': factionState('S1:noble_house', 'Noble House', 'noble', nobles.map((id) => `S1:${id}`)),
      'S1:merchant_league': factionState('S1:merchant_league', 'Merchant League', 'merchant', merchants.map((id) => `S1:${id}`)),
    },
    politicsLedgers: {
      S1: {
        blocs: [{
          id: 'noble_house', members: ['Noble House'],
          glue: [{ type: 'concession', detail: '' }],
          end: 'seats', strain: 0.2, sinceTick: 0,
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
          { faction: 'Noble House', power: 60, isGoverning: true },
          { faction: 'Merchant League', power: 40 },
        ],
      },
    },
  };
  return { worldState, item, snapshot: { worldState, settlements: [item] } };
}

const PRESSURES = pressureIndex(['food', 'disease', 'conflict', 'trade', 'legitimacy', 'crime']
  .map((kind) => ({
    settlementId: 'S1', kind, score: 0.88, label: `${kind} pressure`, reasons: [`test ${kind}`],
  })));

/** The whole observable surface this wave can reach, as one comparable projection. */
function project(world) {
  const bloc = rulingBlocOf(world.worldState, 'S1', world.item);
  return {
    consolidation: bloc ? bloc.consolidation : null,
    moves: LOAD_BEARING_MOVES.map((move) => [move, blocDecisionFactor(world.worldState, 'S1', world.item, move)]),
    candidates: evaluateFactionRules(world.snapshot, PRESSURES, { tick: 4 })
      .map((candidate) => [
        candidate.metadata.factionName, candidate.candidateType,
        candidate.severity, candidate.metadata.power,
      ])
      .sort((a, b) => (a.join('|') < b.join('|') ? -1 : 1)),
  };
}

const snapshotOf = (world) => JSON.stringify(project(world));

describe('ES-5b A2 — FOUR FENCES over the absence discount', () => {
  it('FENCE 1 — espionage dark is byte-identical, proven against the LIT IDENTITY control', () => {
    const darkAway = snapshotOf(buildWorld({ lit: false, away: 'traveling' }));
    const litPresent = snapshotOf(buildWorld({ lit: true, away: null }));
    const litAway = snapshotOf(buildWorld({ lit: true, away: 'traveling' }));

    // The identity control: the LIT path with every share equal to 1 reproduces the dark
    // output exactly, so the discount is a multiplier by 1 and nothing else.
    expect(litPresent, 'the lit identity discount is NOT byte-identical to dark — the wire'
      + ' is doing something beyond multiplying, and every dormancy claim here is void')
      .toBe(darkAway);
    // …and the whole fence is non-vacuous, because the SAME world with a member abroad
    // really does move. Without this line the two identities above could both be readings
    // of a feature that never fires at all.
    expect(litAway).not.toBe(litPresent);
  });

  it('FENCE 2 — a ROADS-LIT, espionage-dark world is untouched: the away words are inert', () => {
    // §3.11's own scope guard, fenced explicitly. The whereabouts mirror is REAL and
    // POPULATED here — roads has done its work — and espionage alone decides whether
    // anybody reads it. Every roads state is driven, so no single word carries the claim.
    const base = snapshotOf(buildWorld({ lit: false, away: null }));
    for (const state of ['traveling', 'visiting', 'returning', 'hostage']) {
      expect(snapshotOf(buildWorld({ lit: false, away: state, rules: { roadsEnabled: true } })),
        `a roads-lit, espionage-dark world moved on '${state}'`).toBe(base);
    }
    // NON-VACUITY: lighting espionage on the identical roads-lit world DOES move it.
    expect(snapshotOf(buildWorld({ lit: true, away: 'traveling', rules: { roadsEnabled: true } })))
      .not.toBe(base);
  });

  it('FENCE 3 — the faction arm carries a SECOND gate, and espionage cannot open it', () => {
    // The executable half of A2(c): `candidateEvents` admits `evaluateFactionRules` only
    // when `factionCompetitionEnabled` is true, and that admission is independent of
    // espionage. Driven through the real rules roll rather than asserted about it.
    const familyOf = (world, rules) => evaluateWorldPulseRules(world.snapshot, {
      tick: 4, pressures: [], pressureIndex: PRESSURES,
      simulationRules: { ...world.worldState.simulationRules, ...rules },
    }).filter((candidate) => candidate.ruleFamily === 'faction');

    const lit = buildWorld({ lit: true, away: 'traveling' });
    expect(familyOf(lit, { factionCompetitionEnabled: false }),
      'the faction arm ran with its own subsystem dark').toEqual([]);
    // NON-VACUITY: with the subsystem lit the same espionage-lit world DOES produce the
    // family, so the empty array above is a closed gate rather than a dead fixture.
    expect(familyOf(lit, {}).length).toBeGreaterThan(0);

    // …AND THE RECORDED CONTRADICTION, ASSERTED SO IT CANNOT ROT INTO PROSE. A2(c)'s
    // "while the bench arm moves" is unreachable: settlementPoliticsActive composes the
    // SAME flag, so darkening faction competition darkens the bench too.
    const benchDark = buildWorld({ lit: true, away: 'traveling', rules: { factionCompetitionEnabled: false } });
    expect(settlementBlocs(benchDark.worldState, 'S1')).toEqual([]);
    expect(rulingBlocOf(benchDark.worldState, 'S1', benchDark.item)).toBeNull();
    // The same world with the flag lit really does carry a bench, so the null is the gate.
    expect(rulingBlocOf(lit.worldState, 'S1', lit.item)).not.toBeNull();
  });

  it('FENCE 4 — THREE DOORS, EACH DROPPED ALONE (a guard that cannot be reddened is unproven)', () => {
    const litAway = snapshotOf(buildWorld({ lit: true, away: 'traveling' }));
    const base = snapshotOf(buildWorld({ lit: false, away: 'traveling' }));
    expect(litAway, 'the lit control does not move — every door below would pass vacuously')
      .not.toBe(base);

    // DOOR 1 — beliefs (spatialCanonVersion), dropped alone.
    expect(snapshotOf(buildWorld({ lit: true, away: 'traveling', canon: false })), 'canon door').toBe(base);
    // DOOR 1b — beliefs (infoMode omniscient), dropped alone.
    expect(snapshotOf(buildWorld({ lit: true, away: 'traveling', rules: { infoMode: 'omniscient' } })), 'infoMode door').toBe(base);
    // DOOR 2 — the errand spine, dropped alone. Out-of-order lighting is invalid SAFELY.
    expect(snapshotOf(buildWorld({ lit: true, away: 'traveling', rules: { errandSpineEnabled: false } })), 'spine door').toBe(base);
    // DOOR 3 — espionageEnabled itself, dropped alone.
    expect(snapshotOf(buildWorld({ lit: true, away: 'traveling', rules: { espionageEnabled: false } })), 'espionage door').toBe(base);
    // …and ABSENT reads exactly like explicit FALSE, which is the `=== true` polarity.
    expect(snapshotOf(buildWorld({ lit: true, away: 'traveling', rules: { espionageEnabled: undefined } })), 'absent === false').toBe(base);
  });
});

describe('ES-5b A5 — THE DECLARED ONE-TICK LAG (§0.2, CR-ES5B-2)', () => {
  it('THE ORDER, AT SOURCE: the sole whereabouts writer runs AFTER every bloc consumer', () => {
    // Content anchors only — `pulseKernelLineAddress.walker` bans hand-keyed
    // `pulseKernel.js:<n>` literals anywhere under src/ and tests/, and an address pinned
    // by line number rots into a lie the first time anything above it moves.
    const kernel = readFileSync(join(ROOT, 'src/domain/worldPulse/pulseKernel.js'), 'utf8');
    const ANCHORS = [
      // 1. the roster writer — memberNpcIds is FRESH from here on.
      'seatNpcsIntoFactions(',
      // 2. bloc consumer A.
      'advanceSettlementPolitics({',
      // 3. the rules roll, which reaches this wave's NEW consumer through evaluateFactionRules.
      'evaluateWorldPulseRules(',
      // 4. the roads stage — the SOLE per-tick writer of npc.whereabouts.
      'advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize({',
    ];
    const at = ANCHORS.map((anchor) => {
      const first = kernel.indexOf(anchor);
      expect(first, `the anchor '${anchor}' is GONE from pulseKernel.js — the stage was renamed`
        + ' or removed, so this ordering pin is measuring nothing').toBeGreaterThan(-1);
      expect(kernel.indexOf(anchor, first + 1), `'${anchor}' now appears twice; the pin can no`
        + ' longer say WHICH occurrence it ordered').toBe(-1);
      return first;
    });
    for (let i = 1; i < at.length; i += 1) {
      expect(at[i], `${ANCHORS[i]} must run after ${ANCHORS[i - 1]}`).toBeGreaterThan(at[i - 1]);
    }
    // The consequence, stated as the assertion it is: BOTH bloc consumers sit strictly
    // between the roster write and the whereabouts write, so both read LAST tick's mirror
    // and the lag is UNIFORM. A wave that moved either consumer past the roads stage would
    // give one consumer a fresher world than the other, and THAT divergence is the bug the
    // lag is not.
    expect(at[3], 'the whereabouts writer must be last of the four').toBe(Math.max(...at));
  });

  it('THE LAG, DRIVEN: the discount lands on the tick AFTER the mirror moves, at BOTH sites together', () => {
    // A miniature of the kernel's own stage order. Tick N reads the mirror as the roads
    // stage left it at the END of tick N-1; the roads write then lands LAST; tick N+1 is
    // the first read that can see it.
    const world = buildWorld({ lit: true, away: null });
    const bench = () => rulingBlocOf(world.worldState, 'S1', world.item).consolidation;
    const contest = () => evaluateFactionRules(world.snapshot, PRESSURES, { tick: 4 })
      .filter((candidate) => candidate.metadata.factionName === 'Noble House')[0].metadata.power;

    // ── TICK N: nobody has left yet. Both consumers read a full court.
    expect(bench()).toBe(0.6);
    expect(contest()).toBe(0.6);

    // ── TICK N, consequence_fold: advanceRoads writes the mirror, LAST in the tick. Every
    // consumer above has already run, so nothing in tick N can observe this.
    world.item.settlement.npcs[0].whereabouts = { state: 'traveling', placeId: 'S2', purposeKind: 'trade' };

    // ── TICK N+1: the first read after the write, and BOTH consumers move on it TOGETHER.
    const benchNext = bench();
    const contestNext = contest();
    expect(benchNext).toBe(0.5676);
    expect(contestNext).toBe(0.525);
    // UNIFORMITY, asserted rather than assumed: neither site is a tick ahead of the other.
    expect([benchNext !== 0.6, contestNext !== 0.6], 'one consumer moved without the other —'
      + ' the lag has become a DIVERGENCE, which is the failure CR-ES5B-2 accepted the'
      + ' uniform lag to avoid').toEqual([true, true]);
  });
});

describe('ES-5b A8 — ⭐ THE ⟨F6⟩ GOLDEN PAIR (the DISCLOSED one-time bloc-math shift)', () => {
  /**
   * ⛔ READ BEFORE TOUCHING EITHER GOLDEN BELOW.
   *
   * THE SHIFT: ES-5b changes LIT-world simulation output. Under `espionageActive`, a
   * faction's council weight and contest weight are multiplied by `presentShare01` — the
   * share of its roster still at home — so a differentially-absent faction commands less
   * of the court and presses its four contest rules less hard.
   *
   * THE CAUSE, NAMED: it is a DISCLOSED one-time bloc-math move under ⟨F6⟩ (FP §9 seam
   * row 6), anticipated BY NAME at DESIGN_FP_ARCH_ES.md:1123-1128 — "dark worlds … are
   * BYTE-IDENTICAL, and the one-time bloc-math shift in a lit world is DISCLOSED, named in
   * the wave's commit, and fenced by its own golden pair". This file is that fence.
   *
   * ⛔ THE LIT GOLDEN IS RECORDED ONCE, HERE, BY THIS PACKET. A later lane that finds it
   * red has found a SECOND shift, which is a different event needing its own disclosure —
   * NEVER a re-record. Re-recording it without stating a cause is forbidden outright.
   * ⛔ THE DARK GOLDEN MAY NEVER MOVE AT ALL. Dark worlds are byte-identical by
   * construction; a moved dark golden means the flag gate leaked and is a STOP.
   */
  const DARK_GOLDEN = {
    consolidation: 0.6,
    moves: [['deploy', 1.052], ['sue_for_peace', 0.99], ['fortify', 1.02], ['defend', 1.02]],
    candidates: [
      ['Merchant League', 'faction_government_challenge', 0.7063999999999999, 0.4],
      ['Merchant League', 'faction_institution_suppression', 0.5792, 0.4],
      ['Merchant League', 'faction_service_bolster', 0.4976, 0.4],
      ['Noble House', 'faction_government_challenge', 0.7624, 0.6],
      ['Noble House', 'faction_institution_suppression', 0.6272000000000001, 0.6],
      ['Noble House', 'faction_law_preference_push', 0.5376, 0.6],
    ],
  };

  /**
   * THE NEW OUTPUT, on the same seed and the same world, with one of Noble House's four
   * members traveling. Noble House keeps 0.875 of its weight; the Merchant League, with
   * nobody abroad, keeps all of its own — which is why this is a DIFFERENTIAL and not a
   * rescaling, and why the four Merchant League rows below are byte-identical to the dark
   * golden while every Noble House row moved.
   */
  const LIT_GOLDEN = {
    consolidation: 0.5676,
    moves: [['deploy', 1.0436], ['sue_for_peace', 0.9916], ['fortify', 1.0168], ['defend', 1.0168]],
    candidates: [
      ['Merchant League', 'faction_government_challenge', 0.7063999999999999, 0.4],
      ['Merchant League', 'faction_institution_suppression', 0.5792, 0.4],
      ['Merchant League', 'faction_service_bolster', 0.4976, 0.4],
      ['Noble House', 'faction_government_challenge', 0.7414, 0.525],
      ['Noble House', 'faction_institution_suppression', 0.6092000000000001, 0.525],
      ['Noble House', 'faction_law_preference_push', 0.5226000000000001, 0.525],
    ],
  };

  it('(i) THE DARK GOLDEN — byte-identity with the pre-change output, on the same seed', () => {
    expect(project(buildWorld({ lit: false, away: 'traveling' }))).toEqual(DARK_GOLDEN);
    // …and the LIT IDENTITY control reproduces it exactly, which is what makes this a
    // pre-change reading rather than merely a dark-path reading (probe 6).
    expect(project(buildWorld({ lit: true, away: null }))).toEqual(DARK_GOLDEN);
  });

  it('(ii) THE LIT GOLDEN — the NEW output, recorded ONCE, with its cause stated above', () => {
    expect(project(buildWorld({ lit: true, away: 'traveling' }))).toEqual(LIT_GOLDEN);
  });

  it('the pair really is a PAIR: the shift is differential, bounded, and set-preserving', () => {
    // Every one of the chooser's four load-bearing moves moved — this is the war chooser's
    // input, and §9b discloses that the CHOSEN move can flip on a close court.
    for (const [index, [move, litFactor]] of LIT_GOLDEN.moves.entries()) {
      expect(litFactor, `${move} did not move`).not.toBe(DARK_GOLDEN.moves[index][1]);
    }
    // DIFFERENTIAL: the faction with nobody abroad is untouched, byte for byte.
    const merchantsOf = (golden) => golden.candidates.filter(([name]) => name === 'Merchant League');
    expect(merchantsOf(LIT_GOLDEN)).toEqual(merchantsOf(DARK_GOLDEN));
    // BOUNDED: nothing collapses. The share floor is 1 - ABSENT_W, so the bloc holds and
    // the court keeps a ruling bloc — the consolidation-floor crossing §9b documents is
    // NOT reachable by absence alone here, and ABSENT_W is not tuned to make it so.
    expect(LIT_GOLDEN.consolidation).toBeLessThan(DARK_GOLDEN.consolidation);
    expect(LIT_GOLDEN.consolidation).toBeGreaterThan(0.4);
    // SET-PRESERVING (D8): the same six candidate rows, in the same order, weakened rather
    // than silenced. Selection stays on RAW power precisely so this holds.
    expect(LIT_GOLDEN.candidates.map(([name, type]) => `${name}|${type}`))
      .toEqual(DARK_GOLDEN.candidates.map(([name, type]) => `${name}|${type}`));
  });
});
