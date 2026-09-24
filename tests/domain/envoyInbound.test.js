/**
 * envoyInbound.test.js — FP SP-D2's acceptance battery (lane FP-A unit 1; the brief's A1,
 * A2 and A3 as amended by the chair on 2026-09-23: A4, the consumer, is WITHDRAWN until U123
 * composes the direction transport, and A5 is the partition re-record in
 * `tests/domain/editOperations.test.js`).
 *
 * EVERY ERRAND HERE IS MINTED BY THE PRODUCTION WRITER (`tests/helpers/errandSpineFixture.js`)
 * and moved by the production advance, never hand-authored: `normalizeErrand` is a cross-field
 * law with dozens of refusal clauses, and a hand-built row proves nothing about what a real
 * world can hold. Every negative carries its `// anchored:` reason on the line above it.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { commentsOnly } from '../helpers/codeOnlySource.js';
import { mintOne, peaceOffer, routePlan, spineWorld } from '../helpers/errandSpineFixture.js';
import { OP_CONSEQUENCE_POLICIES, OP_STAGES } from '../../src/domain/edit/operations.js';
import { isPhantomRecord, mintPhantom } from '../../src/domain/edit/phantoms.js';
import { RESOLUTION_MISSING_KINDS, resolveDecree } from '../../src/domain/edit/registry.js';
import {
  WORLD_CONDITIONS, worldConditionHolds, worldConditionSubjects,
} from '../../src/domain/edit/worldConditions.js';
import {
  ENVOY_REQUIRED_RULES,
  advanceEnvoyErrands,
  beginEnvoyReturn,
  envoyErrandIdForOffer,
  envoyErrandsOf,
  envoyOfferEpisodeKey,
  markEnvoyIntercepted,
  markEnvoyLost,
  normalizeEnvoyPeaceOffer,
  resolveEnvoyInterception,
} from '../../src/domain/worldPulse/envoyErrand.js';
import {
  ENVOY_PARLAY_REFUSAL_REASONS, ENVOY_RECEPTION_DECISIONS,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import {
  ENVOY_RECEPTION_TYPE, envoyReceptionRow, inboundEnvoySenders, inboundEnvoysAt,
} from '../../src/domain/worldPulse/envoyInbound.js';
import { resolveMaturedParlays } from '../../src/domain/worldPulse/envoyInterceptionStage.js';
import { createNegotiationPicture } from '../../src/domain/worldPulse/negotiationPictures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/worldPulse/envoyInbound.js';
const VOCABULARY_REL = 'src/domain/worldPulse/envoyErrandVocabulary.js';
/** A module's source with every comment blanked and every string literal KEPT. */
const literalsOf = (rel) => commentsOnly(readFileSync(join(ROOT, rel), 'utf8'));

const GATE = 'irontown';
const SENDER = 'ashford';

/** One real envoy, minted at tick 10 on a two-tick road, lit on all six rules and the spine. */
function mintedEnvoy(extra = {}) {
  const minted = mintOne(spineWorld({ spine: true }), extra);
  expect(minted.reason, 'the production writer minted the fixture').toBe('minted');
  return minted;
}

/** The same world at `tick`, moved by the production advance and by nothing else. */
const at = (worldState, tick) => advanceEnvoyErrands({ worldState, tick }).worldState;

/** A frozen picture of the fixture's one peace offer, at the shape the parlay compares. */
function pictureOf(outcome, { id, carrier, partyId, counterpartId, capturedTick }) {
  const offer = normalizeEnvoyPeaceOffer(outcome);
  const payload = offer.proposalPayload;
  return createNegotiationPicture({
    id,
    carrier,
    partyId,
    counterpartId,
    relationshipKey: offer.relationshipKey,
    episodeKey: envoyOfferEpisodeKey(outcome),
    frontOwnerId: payload.peaceFrontOwnerId,
    frontSinceTick: payload.peaceFrontSinceTick,
    capturedTick: capturedTick ?? offer.generatedAtTick,
    causeStatus: 'live',
    subjects: [
      { settlementId: partyId, strengthBand: 'ready', storesBand: 'thin' },
      { settlementId: counterpartId, strengthBand: 'strong', storesBand: 'stocked' },
    ],
    evidenceIds: [],
  });
}

/** One pending reception decree, at EM-C1's entry shape. */
const receptionEntry = (payload) => ({
  id: 'decree.reception.1',
  op: { type: ENVOY_RECEPTION_TYPE, target: { kind: 'settlement', id: GATE }, payload },
  status: 'pending',
  addedBy: 'dm',
  orderIndex: 0,
});

describe('FP SP-D2 — the inbound read, the envoyArrived condition and the reception row', () => {
  it('A1: an envoy arrived at the gate is returned and one still underway is not; a phantom sender passes through as its id, and phantom garbage throws nothing', () => {
    const minted = mintedEnvoy();
    const underway = at(minted.worldState, 11);
    expect(envoyErrandsOf(underway).map((row) => row.positionRef.progressBand),
      'the one envoy is on the road at tick 11, so the absence below measures the band').toEqual(['underway']);
    // anchored: the same errand answers exactly one row at tick 12, two assertions below.
    expect(inboundEnvoysAt(underway, GATE), 'an envoy underway is not at the gate').toEqual([]);

    const arrived = at(underway, 12);
    const inbound = inboundEnvoysAt(arrived, GATE);
    expect(inbound, 'the arrived envoy stands at his target\'s gate, read off the SENDER\'s errand').toEqual([{
      errandId: minted.errand.id,
      fromId: SENDER,
      envoyId: 'npc.envoy.1',
      purposeClass: 'diplomatic',
      position: 'arrived',
    }]);
    expect(Object.isFrozen(inbound) && inbound.every((row) => Object.isFrozen(row)),
      'the answer is frozen at both levels').toBe(true);

    // L10 (c) — THE PHANTOM SENDER, minted by the production phantom writer and sent by the
    // production errand writer. The reader never resolves the sender, so it passes as its id.
    const phantom = mintPhantom('seed.sp-d2', 'Greymoor', 0, {
      mintId: (seed, kind, n) => `dm:${kind}:${n}`,
      roll: (pool) => `${pool}.word`,
    });
    expect(isPhantomRecord(phantom), 'the fixture is a real phantom record').toBe(true);
    const fromPhantom = mintedEnvoy({
      outcome: peaceOffer({ id: 'peace.offer.phantom', from: phantom.id, to: GATE }),
      routePlan: routePlan({ from: phantom.id }),
    });
    const phantomGate = at(fromPhantom.worldState, 12);
    expect(inboundEnvoySenders(phantomGate, GATE), 'a phantom sender is named by its id').toEqual([phantom.id]);

    // The phantom RECORD filed where an errand belongs is garbage to the family normalizer,
    // and garbage is dropped, never thrown on; the same record handed where an id belongs
    // names no gate at all.
    const garbage = { ...phantomGate, envoyErrands: [...phantomGate.envoyErrands, phantom] };
    let threw = '';
    try {
      expect(inboundEnvoySenders(garbage, GATE), 'the lawful row survives beside the garbage').toEqual([phantom.id]);
      // anchored: the line above reads the same garbage world and names the phantom sender.
      expect(inboundEnvoysAt(garbage, phantom), 'a record is not a settlement id').toEqual([]);
    } catch (error) {
      threw = String(error);
    }
    expect(threw, 'nothing in the phantom arm throws').toBe('');

    // TOTAL AND FALSE-ON-ABSENCE, for every shape a caller could hand it.
    const absent = [undefined, null, 7, 'world', [], {}].filter((world) => {
      try { return inboundEnvoysAt(world, GATE).length !== 0; } catch { return true; }
    });
    // anchored: the arrived world above answers one row through this same door.
    expect(absent, 'an absent or misshapen world answers empty and never throws').toEqual([]);
  });

  it('A1b: at the gate is five facts — the target, a live errand, the arrived cursor, the target parlay and an undecided verdict — each refused alone', () => {
    const envoy = mintedEnvoy();
    const arrived = at(at(envoy.worldState, 11), 12);
    expect(inboundEnvoysAt(arrived, GATE).length, 'the positive control: one envoy at irontown').toBe(1);

    // 1. THE TARGET. The sender's own gate, and a third town's, see nobody.
    // anchored: the positive control two lines up reads the same world at the target.
    expect(inboundEnvoysAt(arrived, SENDER), 'the sender does not see its own envoy as inbound').toEqual([]);
    // anchored: the same positive control holds for this negative too.
    expect(inboundEnvoysAt(arrived, 'blackmere'), 'a third town is not the target').toEqual([]);

    // 2. LIVE. Lost at the table, he keeps the cursor and the parlay id he died with: every
    // other fact still holds on the row, and only the errand's terminal state refuses him.
    const lost = markEnvoyLost({ worldState: arrived, errandId: envoy.errand.id, tick: 13, cause: 'killed' });
    expect([lost.errand.state, lost.errand.positionRef.progressBand, lost.errand.parlayId !== undefined],
      'lost, at the arrived cursor, the target parlay id still on the row').toEqual(['lost', 'arrived', true]);
    // anchored: every other fact holds on this row, asserted on the line above.
    expect(inboundEnvoysAt(lost.worldState, GATE), 'a lost envoy stands at no gate').toEqual([]);

    // 3. ARRIVED. Sent home before any verdict (the mandatory return a caller may price at
    // once), he is LIVE, carries the target parlay's id and no verdict: only the cursor, now on
    // the return journey, says he has left the gate.
    const walkingHome = beginEnvoyReturn({
      worldState: arrived,
      errandId: envoy.errand.id,
      tick: 13,
      routePlan: routePlan({ from: GATE, to: SENDER, departTick: 13 }),
    });
    expect([walkingHome.errand.state, walkingHome.errand.positionRef.journey, walkingHome.errand.termSheet],
      'returning, on the return journey, with no verdict').toEqual(['returning', 'return', null]);
    // anchored: every other fact holds on this row, asserted on the line above.
    expect(inboundEnvoysAt(walkingHome.worldState, GATE), 'a returning envoy has left the gate').toEqual([]);

    // 4. THE TARGET PARLAY. The target's OWN army intercepts him on the target's node and opens
    // a FIELD parlay there: the row is `parlaying` on the last outbound leg at `arrived`, every
    // other fact holds, and the parlay's id names a road encounter, so he is not at the gate.
    const minted = mintedEnvoy();
    const outcome = peaceOffer();
    const intercepted = markEnvoyIntercepted({
      worldState: minted.worldState,
      errandId: minted.errand.id,
      expectedErrand: minted.errand,
      tick: 12,
      interceptorPicture: pictureOf(outcome, {
        id: 'army-picture.irontown',
        carrier: { kind: 'army', id: 'army.irontown.1' },
        partyId: GATE,
        counterpartId: SENDER,
        capturedTick: 12,
      }),
      encounter: {
        id: 'encounter.at-the-gate',
        kind: 'field_parlay',
        tick: 12,
        actorId: GATE,
        armyId: 'army.irontown.1',
        nodeId: GATE,
        venueRef: { id: GATE, kind: 'allied_hall' },
      },
    });
    expect(intercepted.reason, 'the column stops him on the target node').toBe('intercepted');
    const fieldParlay = resolveEnvoyInterception({
      worldState: intercepted.worldState,
      errandId: minted.errand.id,
      encounterId: 'encounter.at-the-gate',
      resolution: 'parlaying',
      expectedErrand: intercepted.errand,
      tick: 13,
    });
    expect([fieldParlay.errand.state, fieldParlay.errand.parlayId, fieldParlay.errand.positionRef.progressBand],
      'parlaying, on the encounter, at the arrived cursor').toEqual(['parlaying', 'encounter.at-the-gate', 'arrived']);
    // anchored: every other fact holds on this row, asserted on the line above.
    expect(inboundEnvoysAt(fieldParlay.worldState, GATE), 'a field parlay is the column\'s business').toEqual([]);

    // 5. UNDECIDED. With both frozen pictures on board the parlay's one draft speaks at tick 13,
    // and once it has spoken there is nothing left to receive or turn away.
    const withPictures = mintedEnvoy({
      negotiationPicture: pictureOf(outcome, {
        id: 'picture.ashford.irontown',
        carrier: { kind: 'envoy', id: envoyErrandIdForOffer(outcome) },
        partyId: SENDER,
        counterpartId: GATE,
      }),
      targetCourtPicture: pictureOf(outcome, {
        id: 'court-picture.irontown',
        carrier: { kind: 'court', id: GATE },
        partyId: GATE,
        counterpartId: SENDER,
      }),
    });
    const beforeDraft = at(withPictures.worldState, 12);
    expect(inboundEnvoysAt(beforeDraft, GATE).length, 'he stands at the gate undecided at tick 12').toBe(1);
    const drafted = resolveMaturedParlays({ worldState: beforeDraft, tick: 13, season: null });
    const [decided] = envoyErrandsOf(drafted.worldState);
    expect(decided.termSheet != null || decided.parlayRefusal != null,
      'the parlay\'s one draft has spoken').toBe(true);
    expect(decided.state, 'and he still stands there, waiting for his road home').toBe('parlaying');
    // anchored: the same envoy answered one row a tick earlier, three assertions up.
    expect(inboundEnvoysAt(drafted.worldState, GATE), 'a decided parlay offers no reception').toEqual([]);

    // MANY AT ONE GATE: two envoys from one court and one from another. The rows come in
    // codepoint order of their errand ids; the SUBJECTS name each court once, in codepoint order.
    const first = mintedEnvoy();
    const second = mintOne(first.worldState, {
      outcome: peaceOffer({ id: 'peace.offer.blackmere', from: 'blackmere', to: GATE }),
      npcId: 'npc.envoy.2',
      routePlan: routePlan({ from: 'blackmere' }),
    });
    const twinOffer = peaceOffer({ id: 'peace.offer.ashford.2' });
    twinOffer.proposalPayload.peaceFrontSinceTick = 5;
    const third = mintOne(second.worldState, { outcome: twinOffer, npcId: 'npc.envoy.3' });
    expect([second.reason, third.reason], 'three distinct episodes minted').toEqual(['minted', 'minted']);
    const crowded = at(third.worldState, 12);
    const rows = inboundEnvoysAt(crowded, GATE);
    expect(rows.map((row) => row.errandId), 'codepoint order of the errand ids')
      .toEqual([...rows.map((row) => row.errandId)].sort());
    expect(rows.map((row) => row.fromId).sort(), 'three envoys, two of them ashford\'s')
      .toEqual([SENDER, SENDER, 'blackmere']);
    expect(inboundEnvoySenders(crowded, GATE), 'each court named once, in codepoint order')
      .toEqual([SENDER, 'blackmere']);
  });

  it('A2: envoyArrived holds on a campaign with one arrived envoy and names the sender; false on a null campaign and on either dark gate', () => {
    const arrived = at(at(mintedEnvoy().worldState, 11), 12);
    const campaign = { worldState: arrived };
    const home = { id: GATE };
    expect(worldConditionHolds('envoyArrived', home, campaign), 'the condition holds in a real world').toBe(true);
    expect(worldConditionSubjects('envoyArrived', home, campaign), 'and names EXACTLY ONE subject, the sender')
      .toEqual([SENDER]);
    expect(WORLD_CONDITIONS.envoyArrived.source, 'the row is live, no longer ABSENT_UNTIL_E4').toBe('live');
    expect(WORLD_CONDITIONS.envoyArrived.readers.map((reader) => `${reader.module} :: ${reader.symbol}`),
      'and it names its reader').toEqual([`${LEAF_REL} :: inboundEnvoysAt`]);

    // THE SHELL'S READING TODAY: `worldConditionsOf` passes no campaign (§12.6 item 1), and the
    // row answers honestly false there rather than guessing.
    // anchored: the same record holds on a campaign four assertions up.
    expect(worldConditionHolds('envoyArrived', home, null), 'false on a null campaign').toBe(false);
    // anchored: the same record names the sender on a campaign five assertions up.
    expect(worldConditionSubjects('envoyArrived', home, null), 'and names nobody').toEqual([]);
    // anchored: the gate's own card holds on this campaign two assertions up.
    expect(worldConditionHolds('envoyArrived', { id: SENDER }, campaign), 'the sender\'s card offers no reception').toBe(false);

    // THE DARK GATES, each dropped ALONE while the ledger still holds the envoy: the six
    // ENVOY_REQUIRED_RULES one at a time, then the errand spine SP-D2 rides.
    const rules = arrived.simulationRules;
    const darkWorlds = [
      ...ENVOY_REQUIRED_RULES.map((rule) => [rule, { ...rules, [rule]: false }]),
      ['errandSpineEnabled', Object.fromEntries(Object.entries(rules).filter(([key]) => key !== 'errandSpineEnabled'))],
    ];
    expect(darkWorlds.length, 'six war rules and the spine').toBe(7);
    const offenders = [];
    for (const [rule, dark] of darkWorlds) {
      const world = { ...arrived, simulationRules: dark };
      if (envoyErrandsOf(world).length !== 1) offenders.push(`${rule}: the ledger lost the envoy, so the arm would measure nothing`);
      if (worldConditionHolds('envoyArrived', home, { worldState: world })) offenders.push(`${rule}: dark, yet the seal would open`);
    }
    // anchored: the lit world above holds, and each dark world is proven to keep its envoy.
    expect(offenders, 'a dark layer offers no reception, whatever its ledger still holds').toEqual([]);
  });

  it('A3: the reception row resolves through resolveDecree for both decisions and refuses a word outside either vocabulary', () => {
    const catalogues = { opTypes: { [ENVOY_RECEPTION_TYPE]: envoyReceptionRow } };
    const errandId = 'envoy_errand:fixture';
    const accepted = ENVOY_RECEPTION_DECISIONS.map((decision) => resolveDecree(
      receptionEntry({ decision, errandId }), catalogues,
    ));
    expect(accepted, 'both decisions resolve').toEqual(ENVOY_RECEPTION_DECISIONS.map(() => ({ ok: true })));
    const reasoned = ENVOY_PARLAY_REFUSAL_REASONS.map((reason) => resolveDecree(
      receptionEntry({ decision: 'turn_away', errandId, reason }), catalogues,
    ));
    expect(reasoned, 'a turn-away may name any of the parlay\'s own refusal words')
      .toEqual(ENVOY_PARLAY_REFUSAL_REASONS.map(() => ({ ok: true })));

    expect(RESOLUTION_MISSING_KINDS, 'the two refusal words below are EM-C1\'s own').toEqual(
      expect.arrayContaining(['op-type', 'pool-value']),
    );
    expect(resolveDecree(receptionEntry({ decision: 'welcome', errandId }), catalogues),
      'a decision word outside ENVOY_RECEPTION_DECISIONS is refused by EM-C1\'s own resolution')
      .toEqual({ ok: false, missing: 'pool-value', was: 'welcome' });
    expect(resolveDecree(receptionEntry({ decision: 'turn_away', errandId, reason: 'rudeness' }), catalogues),
      'and so is a reason outside the parlay\'s refusal words').toEqual({ ok: false, missing: 'pool-value', was: 'rudeness' });
    expect(resolveDecree(receptionEntry({ decision: 'receive', errandId }), { opTypes: {} }),
      'a catalogue that does not carry the row withdraws the entry by op type: the composition is the chair\'s')
      .toEqual({ ok: false, missing: 'op-type', was: ENVOY_RECEPTION_TYPE });
  });

  it('A3b: the row is the eleven-field declaration with both vocabularies imported by reference, and the leaf spells none of their words', () => {
    expect(ENVOY_RECEPTION_TYPE, 'one op type for both seals').toBe('receive-envoy');
    // ['receive', 'turn_away'] → + 'vet' at FP IN-3 (lane FP-I3, 2026-09-24; SR-1): IN-3 adds VET,
    // the third reception arm ("Test their word."), as a MEMBER of this one vocabulary (R-29).
    expect(ENVOY_RECEPTION_DECISIONS, 'the three words, codepoint-ordered').toEqual(['receive', 'turn_away', 'vet']);
    expect(Object.isFrozen(ENVOY_RECEPTION_DECISIONS), 'and frozen').toBe(true);
    expect(Object.keys(envoyReceptionRow).sort(), 'operations.js\'s eleven declaration keys, no more').toEqual([
      'conflictsWith', 'consequence', 'duration', 'enables', 'guards', 'guardsStated',
      'payload', 'relatedTo', 'requires', 'stage', 'target',
    ]);
    expect([envoyReceptionRow.target, envoyReceptionRow.stage, envoyReceptionRow.consequence],
      'a settlement-scale direction acts at home').toEqual(['settlement', 'home', 'home']);
    expect([OP_STAGES.includes(envoyReceptionRow.stage), OP_CONSEQUENCE_POLICIES.includes(envoyReceptionRow.consequence)],
      'both words are the catalogue\'s own').toEqual([true, true]);
    expect(envoyReceptionRow.requires, 'the world half is the condition this wave made live')
      .toEqual({ world: ['envoyArrived'], registry: [] });
    expect(envoyReceptionRow.requires.world.map((id) => WORLD_CONDITIONS[id]?.source),
      'and it is a LIVE row of the roster').toEqual(['live']);
    const { payload } = envoyReceptionRow;
    expect(Object.keys(payload).sort(), 'three fields').toEqual(['decision', 'errandId', 'reason']);
    expect(payload.decision.values, 'the decision is the vocabulary BY REFERENCE').toBe(ENVOY_RECEPTION_DECISIONS);
    expect(payload.reason.values, 'and the reason, too, is the parlay\'s own list BY REFERENCE').toBe(ENVOY_PARLAY_REFUSAL_REASONS);
    expect([payload.decision.required, payload.errandId.required, payload.reason.required, payload.errandId.kind],
      'decision and errand required, reason optional, the errand a reference').toEqual([true, true, false, 'ref']);
    const frozen = [envoyReceptionRow, payload, payload.decision, payload.errandId, payload.reason,
      envoyReceptionRow.requires, envoyReceptionRow.requires.world, envoyReceptionRow.guards];
    expect(frozen.every((part) => Object.isFrozen(part)), 'frozen at every level').toBe(true);

    // THE ONE-SPELLING LAW: the leaf names none of the words, and the scan is proved live on
    // the vocabulary leaf that does.
    const words = [...ENVOY_RECEPTION_DECISIONS, ...ENVOY_PARLAY_REFUSAL_REASONS].map((word) => `'${word}'`);
    const leaf = literalsOf(LEAF_REL);
    expect(words.filter((word) => literalsOf(VOCABULARY_REL).includes(word)),
      'the scan is live: the vocabulary leaf spells every word').toEqual(words);
    expect(leaf.length, 'the leaf source is live').toBeGreaterThan(1000);
    // anchored: the same scan finds all of these words in the vocabulary leaf, one assertion up.
    expect(words.filter((word) => leaf.includes(word)), 'the leaf spells none of them').toEqual([]);
    const specifiers = [...leaf.matchAll(/from\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
    expect(specifiers, 'the exact import list: the sort, the vocabulary, the gate, the reader, the spine').toEqual([
      '../deterministicSort.js', './envoyErrandVocabulary.js', './envoyErrandOffer.js',
      './envoyErrandRecords.js', './errandMint.js',
    ]);
  });
});
