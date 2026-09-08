/**
 * concludedWarsWriter.test.js — W-MEM's ONE writer, and the fences it must not fail.
 *
 * This file is the `concluded_wars` residue-strip site's named coverage (RESIDUE_STRIP_SITES),
 * so the pause-path arm below is not optional decoration: it is what that registry entry
 * points at. The site's "strip" is the writer's own defer gate — a paused tick returns
 * before it reads anything, so there is no banked residue to remove — and the arm proves
 * exactly that rather than asserting it.
 *
 * The other fences are the ones a dishonest ledger would fail first: dark means
 * byte-identical (at the BIT bar, not the canonical-form bar), a dismissed conquest is
 * still RECORDED, a war seals late rather than lying early, and a razing's road really
 * reconstructs — which it only does when the tick is resolved the way the estate spells it.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { closeRoadFor, recordConcludedWars, warMemoryActive } from '../../src/domain/worldPulse/concludedWars.js';
import { classifyWarEnding, RULER_CHANGE_ENDING_FAMILIES } from '../../src/domain/certification/warEndingClassifier.js';
import { razingOutcomeIdFor } from '../../src/domain/worldPulse/razing.js';
import { coalitionCallIdFor } from '../../src/domain/worldPulse/warCoalitionLedger.js';
import { RESIDUE_STRIP_SITES } from '../../src/domain/worldPulse/pulseKernel.js';

const LIT = { warMemoryEnabled: true, warLayerEnabled: true };
const TICK = 40;

/** One concluded edge as the war layer's carrier really shapes it. */
const edge = (over = {}) => ({
  attackerId: 'ashford',
  targetId: 'kelby',
  outcome: 'withdrawal',
  deployment: { targetId: 'kelby', sinceTick: 12, maxStartStrength: 60, currentEffectiveStrength: 24, recalled: { cause: 'sue_for_peace', tick: TICK } },
  ...over,
});

const world = (over = {}) => ({ tick: TICK, deployments: {}, warExhaustion: {}, ...over });

/** @param {Record<string, unknown>|null} led @returns {Record<string, Record<string, unknown>>} */
const wrote = (led) => {
  if (!led) throw new Error('the writer returned no ledger where this test needs one');
  return /** @type {Record<string, Record<string, unknown>>} */ (led);
};

const run = (over = {}) => recordConcludedWars({
  worldState: world(), resolvedDeployments: [edge()], appliedOutcomes: [], newsEntries: [],
  tick: TICK, rules: LIT, deferred: false, ...over,
});

describe('the gate', () => {
  test('reads the flag by name, strictly', () => {
    expect(warMemoryActive({ warMemoryEnabled: true })).toBe(true);
    for (const junk of [{ warMemoryEnabled: 1 }, { warMemoryEnabled: 'true' }, {}, null, undefined]) {
      expect(warMemoryActive(/** @type {never} */ (junk))).toBe(false);
    }
  });

  test('DARK MEANS BYTE-IDENTICAL — the writer returns before it reads anything', () => {
    expect(run({ rules: {} })).toBeNull();
    expect(run({ rules: { warMemoryEnabled: false } })).toBeNull();
    // The bit claim: a dark tick leaves the serialized world untouched, and "untouched"
    // is compared as BYTES, because an absent key and an empty one are the same world
    // only if they are the same string.
    const before = world({ concludedWars: undefined });
    const after = { ...before };
    expect(run({ rules: {}, worldState: after })).toBeNull();
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });

  test('ANTI-VACUITY CONTROL: the SAME comparator sees the lit run diverge', () => {
    // A dormancy proof that cannot see the lit case is a proof that compared nothing.
    const ledger = wrote(run());
    expect(Object.keys(ledger).length).toBe(1);
    expect(Object.keys(ledger)[0]).toBe('war.ashford.kelby.12.0');
  });
});

describe('the pause path — the concluded_wars residue-strip site', () => {
  test('the site is registered, and this file is what its registry row points at', () => {
    const site = RESIDUE_STRIP_SITES.find((row) => row.id === 'concluded_wars');
    expect(site, 'concluded_wars must be a registered residue-strip site').toBeTruthy();
    expect(site?.coveredBy).toBe('concludedWarsWriter.test.js');
  });

  test('a PAUSED tick writes nothing at all, so there is no residue to strip', () => {
    // Under deferred majors every major is parked and no verdict exists yet. Writing a
    // provisional record here and making it permanent on resume is the double-fire this
    // gate makes structurally impossible rather than patching after the fact.
    expect(run({ deferred: true })).toBeNull();
  });

  test('pause-then-resume is byte-equivalent to the single-pass tick', () => {
    const paused = run({ deferred: true });
    const single = run({ deferred: false });
    expect(paused).toBeNull();
    // The resume re-derives the tick from its pre-tick inputs, so it writes what the
    // unpaused tick would have written — the equivalence the registry row exists to pin.
    const resumed = run({ deferred: false });
    expect(JSON.stringify(resumed)).toBe(JSON.stringify(single));
  });
});

describe('the close road is recovered, never guessed', () => {
  test('the carrier names conquest and razing outright', () => {
    expect(closeRoadFor({ outcome: 'conquest' })).toBe('conquest');
    expect(closeRoadFor({ outcome: 'razing' })).toBe('razing');
  });

  test('all seven strategic-recall causes discriminate road 1', () => {
    for (const cause of [
      'sue_for_peace', 'return_home', 'sue_for_peace_decree', 'field_battle_retreat',
      'convoy_lost_debark', 'envoy_terms_carried_home', 'authority_verdict',
    ]) {
      expect(closeRoadFor({ outcome: 'withdrawal', deployment: { recalled: { cause } } })).toBe(cause);
    }
  });

  test('an UNMAPPED recall cause is reported unknown rather than mis-filed', () => {
    // The discovery-grade behaviour: a road the build does not know is a FINDING. Filing
    // it under a neighbouring road would be the silent mis-attribution this refuses.
    expect(closeRoadFor({ outcome: 'withdrawal', deployment: { recalled: { cause: 'a_cause_from_the_future' } } })).toBe('');
  });

  test('the three collapsed roads separate on the inputs the writer really holds', () => {
    expect(closeRoadFor({ outcome: 'withdrawal' }, { windDown: true })).toBe('wind_down');
    expect(closeRoadFor({ outcome: 'withdrawal', targetId: 'kelby' }, { abandonedIds: new Set(['kelby']) })).toBe('siege_abandoned');
    expect(closeRoadFor({ outcome: 'withdrawal' }, { targetGone: true })).toBe('target_lost');
  });

  test('the recovered road reaches the record', () => {
    const ledger = wrote(run());
    const fact = /** @type {Record<string, unknown>} */ (ledger['war.ashford.kelby.12.0'].fact);
    expect(fact.closeRoad).toBe('sue_for_peace');
  });
});

describe('THE DISMISSAL INVERSION', () => {
  test('a dismissed conquest is RECORDED, and honestly is not a conquest', () => {
    // The war concluded either way — the armies dispersed. The dismissal removes the
    // APPLIED outcome, never the record; writing nothing would reproduce the very
    // failure this ledger exists to cure, on the strangest ending there is.
    const ledger = wrote(run({ resolvedDeployments: [edge({ outcome: 'conquest' })], appliedOutcomes: [] }));
    const record = ledger['war.ashford.kelby.12.0'];
    const fact = /** @type {Record<string, unknown>} */ (record.fact);
    expect(fact.closeRoad).toBe('conquest');
    expect(/** @type {unknown[]} */ (fact.terminalOutcomes)).toEqual([]);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).not.toBe('conquest');
  });

  test('an APPLIED conquest carries its row and classifies', () => {
    const ledger = wrote(run({
      resolvedDeployments: [edge({ outcome: 'conquest' })],
      appliedOutcomes: [{ id: 'world_outcome.conquest.kelby', candidateType: 'conquest', targetSaveId: 'kelby', generatedAtTick: TICK }],
    }));
    const fact = /** @type {Record<string, unknown>} */ (ledger['war.ashford.kelby.12.0'].fact);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).toBe('conquest');
    expect(ledger['war.ashford.kelby.12.0'].victorId).toBe('ashford');
  });
});

describe('J-7R — the razing road only reconstructs when the tick is resolved', () => {
  test("a razing minted with the engine's own id classifies to its road", () => {
    // The road is recovered by RE-MINTING the id from (road, razer, victim, TICK) and
    // comparing for equality. Resolve the tick wrongly and EVERY razing reports its road
    // unreconstructable — a whole war unclassified, silently.
    const id = razingOutcomeIdFor({ road: 'vengeance', razerId: 'ashford', victimId: 'kelby', tick: TICK });
    expect(id).toBeTruthy();
    const ledger = wrote(run({
      resolvedDeployments: [edge({ outcome: 'razing' })],
      appliedOutcomes: [{ id, candidateType: 'razing', targetSaveId: 'kelby', generatedAtTick: TICK }],
    }));
    const fact = /** @type {Record<string, unknown>} */ (ledger['war.ashford.kelby.12.0'].fact);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).toBe('punitive_sack_vengeance');
  });

  test('the tick resolves through generatedAtTick, then tick, then the concluding tick', () => {
    const id = razingOutcomeIdFor({ road: 'initiation', razerId: 'ashford', victimId: 'kelby', tick: TICK });
    for (const stamp of [{ generatedAtTick: TICK }, { tick: TICK }, {}]) {
      const ledger = wrote(run({
        resolvedDeployments: [edge({ outcome: 'razing' })],
        appliedOutcomes: [{ id, candidateType: 'razing', targetSaveId: 'kelby', ...stamp }],
      }));
      const fact = /** @type {Record<string, unknown>} */ (ledger['war.ashford.kelby.12.0'].fact);
      expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).toBe('punitive_sack_initiation');
    }
  });
});

describe('THE SEAL LAW and its grace window', () => {
  test('a freshly concluded war is STAGED, never sealed on the spot', () => {
    expect(wrote(run())['war.ashford.kelby.12.0'].sealed).toBe(false);
  });

  test('it stays staged inside the window, and seals once the window has run', () => {
    // Sealing at conclusion would report "no treaty" for a war about to acquire one:
    // the mint is triggered by a later relationship incident, not by the recall.
    const staged = wrote(run());
    const held = recordConcludedWars({
      worldState: world({ tick: TICK + 1, concludedWars: staged }), resolvedDeployments: [],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 1, rules: LIT, deferred: false,
    });
    // NULL IS THE CONTRACT for "nothing changed" — inside the window the record is not
    // ready to seal and no edge resolved, so the writer hands back no new ledger at all
    // rather than an identical one. That is what keeps a quiet tick free of byte churn.
    expect(held).toBeNull();
    expect(staged['war.ashford.kelby.12.0'].sealed).toBe(false);
    const sealedLedger = recordConcludedWars({
      worldState: world({ tick: TICK + 3, concludedWars: staged }), resolvedDeployments: [],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 3, rules: LIT, deferred: false,
    });
    expect(wrote(sealedLedger)['war.ashford.kelby.12.0'].sealed).toBe(true);
  });

  test('a treaty arriving INSIDE the window reaches the sealed fact — the whole point', () => {
    const staged = wrote(run());
    const withTreaty = world({
      tick: TICK + 3,
      concludedWars: staged,
      spatialLedgers: { treaties: { 'rel.ashford.kelby': { parties: ['ashford', 'kelby'] } } },
    });
    const ledger = wrote(recordConcludedWars({
      worldState: withTreaty, resolvedDeployments: [{ ...edge(), deployment: { ...edge().deployment } }],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 3, rules: LIT, deferred: false,
    }));
    const fact = /** @type {Record<string, unknown>} */ (ledger['war.ashford.kelby.12.0'].fact);
    expect(fact.treatyWritten).toBe(true);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).toBe('terms');
  });

  test('a SEALED record is append-closed — a re-fired stale front cannot re-open it', () => {
    const sealed = { 'war.ashford.kelby.12.0': { ...wrote(run())['war.ashford.kelby.12.0'], sealed: true, victorId: 'ashford' } };
    const after = recordConcludedWars({
      worldState: world({ concludedWars: sealed }), resolvedDeployments: [edge({ outcome: 'conquest' })],
      appliedOutcomes: [], newsEntries: [], tick: TICK, rules: LIT, deferred: false,
    });
    const record = after ? wrote(after)['war.ashford.kelby.12.0'] : sealed['war.ashford.kelby.12.0'];
    expect(record.victorId).toBe('ashford');
    expect(record.sealed).toBe(true);
  });
});

describe('W-MEM-P1 — the annihilation channel finally has a producer', () => {
  // `fact.loserDied` had a READER (warEndingClassifier) and no writer anywhere: the one
  // census that claimed to fill it read `settlement.died`, a field no source file sets.
  // These arms hold the repair to the estate's real stamp, config.lifecycleDiedAtTick.
  const died = (at, ids = ['kelby']) => (id) => (ids.includes(id) ? at : undefined);

  test('a principal that died at or after the war opened earns the ending', () => {
    const fact = /** @type {Record<string, unknown>} */ (
      wrote(run({ diedAtOf: died(38) }))['war.ashford.kelby.12.0'].fact);
    expect(fact.loserDied).toBe(true);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).toBe('annihilation');
  });

  test('DEATH IS THE EVIDENCE OF LOSING — the attacker dying earns it too', () => {
    // No victor has to be resolved first. Whichever principal ceased to exist is the
    // losing belligerent, and reading only the defender would miss half the fact.
    expect(/** @type {Record<string, unknown>} */ (
      wrote(run({ diedAtOf: died(38, ['ashford']) }))['war.ashford.kelby.12.0'].fact).loserDied).toBe(true);
  });

  test('a stamp OLDER than the war refuses — a ghost cannot have been a belligerent', () => {
    const fact = /** @type {Record<string, unknown>} */ (
      wrote(run({ diedAtOf: died(11) }))['war.ashford.kelby.12.0'].fact);
    // anchored: the omit-not-default law — an unearned channel is structurally absent,
    // never present-and-false, because a false would assert the estate looked and knew.
    expect(Object.prototype.hasOwnProperty.call(fact, 'loserDied')).toBe(false);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).not.toBe('annihilation');
  });

  test('an ALLY dying is not this war\'s annihilation — the ORIGIN PAIR is the war', () => {
    const fact = /** @type {Record<string, unknown>} */ (
      wrote(run({ diedAtOf: died(38, ['briar']) }))['war.ashford.kelby.12.0'].fact);
    expect(Object.prototype.hasOwnProperty.call(fact, 'loserDied')).toBe(false);
  });

  test('with no resolver supplied the channel is ABSENT, not false', () => {
    const fact = /** @type {Record<string, unknown>} */ (wrote(run())['war.ashford.kelby.12.0'].fact);
    expect(Object.prototype.hasOwnProperty.call(fact, 'loserDied')).toBe(false);
  });

  test('THE STAGED RECORD IS A WATCH — a death inside the grace window still lands', () => {
    // The war closes with everyone alive; the loser dies two ticks later, while the
    // record is staged. Sealing at conclusion would have lost the fact entirely.
    const staged = wrote(run());
    expect(Object.prototype.hasOwnProperty.call(
      /** @type {Record<string, unknown>} */ (staged['war.ashford.kelby.12.0'].fact), 'loserDied')).toBe(false);
    const sealed = wrote(recordConcludedWars({
      worldState: world({ tick: TICK + 3, concludedWars: staged }), resolvedDeployments: [],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 3, rules: LIT, deferred: false,
      diedAtOf: died(TICK + 2),
    }))['war.ashford.kelby.12.0'];
    expect(sealed.sealed).toBe(true);
    expect(/** @type {Record<string, unknown>} */ (sealed.fact).loserDied).toBe(true);
  });

  test('the watch is MONOTONE — a stamp that later vanishes cannot unmake the fact', () => {
    // Resettlement is the one path that DELETES lifecycleDiedAtTick. It cannot reach a
    // war this record already saw: the fallow it must keep is far longer than this
    // window, and the fact is carried forward rather than re-polled.
    const withDeath = wrote(run({ diedAtOf: died(38) }));
    const later = recordConcludedWars({
      worldState: world({ tick: TICK + 3, concludedWars: withDeath }), resolvedDeployments: [],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 3, rules: LIT, deferred: false,
      diedAtOf: () => undefined,
    });
    expect(/** @type {Record<string, unknown>} */ (
      wrote(later)['war.ashford.kelby.12.0'].fact).loserDied).toBe(true);
  });

  test('a quiet staged tick that learns NOTHING still returns null — no ledger churn', () => {
    const staged = wrote(run());
    expect(recordConcludedWars({
      worldState: world({ tick: TICK + 1, concludedWars: staged }), resolvedDeployments: [],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 1, rules: LIT, deferred: false,
      diedAtOf: died(11),
    })).toBeNull();
  });

  test('DARK STILL MEANS BYTE-IDENTICAL with a resolver in hand', () => {
    // The negative control for the whole car: a wired producer must not light a dark world.
    const before = world({ concludedWars: undefined });
    const after = { ...before };
    expect(run({ rules: {}, worldState: after, diedAtOf: died(38) })).toBeNull();
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });
});

describe('W-MEM-P2 — the seat-transition channel finally has a producer, for ALL FOUR families', () => {
  // The charter priced this as "three of four families are discarded at the news
  // boundary". Measured at the base it was worse: `fact.seatTransitionFamily` appeared
  // nowhere in the writer at all, so the fourth family — whose facts DID reach the
  // kernel — was never written either. Zero of four, not one.
  const ruling = (kind, over = {}) => ({
    kind, id: `ruling.${kind}`, tick: TICK, settlementId: 'ashford', counterpartId: 'kelby', ...over,
  });
  const factOf = (led) => /** @type {Record<string, unknown>} */ (wrote(led)['war.ashford.kelby.12.0'].fact);

  test('every governed family lands, and each yields the ruler-change ending', () => {
    for (const kind of RULER_CHANGE_ENDING_FAMILIES) {
      const fact = factOf(run({ rulingEvidence: [ruling(kind)] }));
      expect(fact.seatTransitionFamily, `${kind} must reach the record`).toBe(kind);
      expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).toBe('ruler_change');
    }
    // The denominator, asserted rather than assumed: four families, all covered above.
    expect(RULER_CHANGE_ENDING_FAMILIES.length).toBe(4);
  });

  test('the ESCALATION twin is refused — same machinery, opposite fact', () => {
    // successor_escalates_war is a court that changed hands and WIDENED the war. It is
    // refused by the register itself, never by a substring test on the family name.
    const fact = factOf(run({ rulingEvidence: [ruling('successor_escalates_war')] }));
    expect(Object.prototype.hasOwnProperty.call(fact, 'seatTransitionFamily')).toBe(false);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).not.toBe('ruler_change');
  });

  test('the match is by ADDRESS — another pair\'s succession is not this war\'s ending', () => {
    const fact = factOf(run({
      rulingEvidence: [ruling('successor_repudiates_war', { settlementId: 'briar', counterpartId: 'morrow' })],
    }));
    expect(Object.prototype.hasOwnProperty.call(fact, 'seatTransitionFamily')).toBe(false);
  });

  test('EITHER orientation matches — the court that changed hands sits on either side', () => {
    expect(factOf(run({
      rulingEvidence: [ruling('war_dissolved_by_verdict', { settlementId: 'kelby', counterpartId: 'ashford' })],
    })).seatTransitionFamily).toBe('war_dissolved_by_verdict');
  });

  test('a half-addressed row cannot match — one named court is not a war', () => {
    const fact = factOf(run({
      rulingEvidence: [ruling('peace_party_overturns_warmonger', { counterpartId: '' })],
    }));
    expect(Object.prototype.hasOwnProperty.call(fact, 'seatTransitionFamily')).toBe(false);
  });

  test('with no evidence supplied the channel is ABSENT, not empty', () => {
    const fact = factOf(run());
    expect(Object.prototype.hasOwnProperty.call(fact, 'seatTransitionFamily')).toBe(false);
  });

  test('THE STAGED WATCH — a succession INSIDE the window still closes the record', () => {
    // The court can change hands after the front is recalled; the recall and the
    // succession are different ticks, so this channel needs the window as the treaty does.
    const staged = wrote(run());
    const sealed = wrote(recordConcludedWars({
      worldState: world({ tick: TICK + 3, concludedWars: staged }), resolvedDeployments: [],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 3, rules: LIT, deferred: false,
      rulingEvidence: [ruling('war_party_overturns_peacemaker')],
    }))['war.ashford.kelby.12.0'];
    expect(sealed.sealed).toBe(true);
    expect(/** @type {Record<string, unknown>} */ (sealed.fact).seatTransitionFamily)
      .toBe('war_party_overturns_peacemaker');
  });

  test('the watch is MONOTONE — the family does not vanish on a later empty tick', () => {
    const withFamily = wrote(run({ rulingEvidence: [ruling('successor_repudiates_war')] }));
    const later = recordConcludedWars({
      worldState: world({ tick: TICK + 3, concludedWars: withFamily }), resolvedDeployments: [],
      appliedOutcomes: [], newsEntries: [], tick: TICK + 3, rules: LIT, deferred: false,
      rulingEvidence: [],
    });
    expect(/** @type {Record<string, unknown>} */ (
      wrote(later)['war.ashford.kelby.12.0'].fact).seatTransitionFamily).toBe('successor_repudiates_war');
  });

  test('DARK STILL MEANS BYTE-IDENTICAL with evidence in hand', () => {
    const before = world({ concludedWars: undefined });
    const after = { ...before };
    expect(run({ rules: {}, worldState: after, rulingEvidence: [ruling('successor_repudiates_war')] })).toBeNull();
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });

  test('SP — the apply pass has exactly ONE ruling-news call site, and it is the funnel', () => {
    // The habitat, not the instance. Three of these call sites existed and every one of
    // them spent the typed array on the spot; a fourth was found while wiring the fix.
    // With one funnel, a future site cannot feed the reader and starve the ledger — and
    // this arm is what keeps that true, because nothing else in the tree connects them.
    const source = readFileSync(
      new URL('../../src/domain/worldPulse/applyWorldPulse.js', import.meta.url), 'utf8');
    const calls = source.match(/warRulingNewsEntries\(/g) || [];
    expect(calls.length, 'every WR-5 ruling must go through publishRuling').toBe(1);
    expect(source).toContain('rulingEvidence.push(...evidence);');
  });
});

describe('coalition folding and the record body', () => {
  test('a joiner folds onto the ORIGIN pair — one war, one record', () => {
    // Keyed naively a coalition would acquire a second name the day an ally marched.
    const anchor = {
      // ⚠ MINTED, never hand-spelled. normalizeJoinAnchor RE-MINTS this id and refuses an
      // anchor that does not reconstruct — so a fixture with an invented callId would
      // quietly fail to fold and "prove" folding by asserting a shape nothing validated.
      callId: coalitionCallIdFor({ callerId: 'ashford', partyId: 'briar', enemyId: 'kelby', callerDeploymentSinceTick: 12 }),
      partyId: 'briar', callerId: 'ashford', enemyId: 'kelby',
      joinedTick: 20, callerDeploymentSinceTick: 12, originAttackerId: 'ashford',
      originSinceTick: 12, allianceRelationshipKey: 'rel.ashford.briar',
      sourceCauseTypes: ['grievance'], cause: 'alliance_obligation',
    };
    const ledger = wrote(run({
      resolvedDeployments: [
        edge(),
        edge({ attackerId: 'briar', deployment: { targetId: 'kelby', sinceTick: 20, joinLedger: [anchor], recalled: { cause: 'return_home' } } }),
      ],
    }));
    expect(Object.keys(ledger)).toEqual(['war.ashford.kelby.12.0']);
    const ids = /** @type {Array<Record<string, unknown>>} */ (ledger['war.ashford.kelby.12.0'].participants).map((p) => p.id);
    expect(ids).toContain('briar');
  });

  test('costs are BAND KEYS, and no stored value is a raw strength', () => {
    const cost = /** @type {Record<string, unknown>} */ (wrote(run({
      worldState: world({ warExhaustion: { ashford: 0.7 } }),
    }))['war.ashford.kelby.12.0'].cost);
    // 24/60 = 0.4 remaining.
    expect(cost.attackerRemainingBand).toBe('battered');
    expect(/** @type {Record<string, string>} */ (cost.exhaustionBands).ashford).toBe('exhausted');
  });

  test('engagement epitomes are copied for the pair, with the place as an id', () => {
    const ledger = wrote(run({
      newsEntries: [
        { impactKind: 'field_battle', tick: 30, settlementIds: ['ashford', 'kelby'], sourceEventId: 'field_battle.ashford.kelby.30', region: 'morrow' },
        { impactKind: 'field_battle', tick: 31, settlementIds: ['other', 'places'] },
      ],
    }));
    const rows = /** @type {Array<Record<string, unknown>>} */ (ledger['war.ashford.kelby.12.0'].notableEngagements);
    expect(rows.length).toBe(1);
    expect(rows[0].region).toBe('morrow');
  });
});
