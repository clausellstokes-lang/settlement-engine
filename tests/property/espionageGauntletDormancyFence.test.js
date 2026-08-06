/**
 * espionageGauntletDormancyFence.test.js — ES-2's FOUR-FENCE dormancy set, its lit mutant,
 * and the EXECUTED record of the one arm this wave could not build.
 *
 * ES-2's dormancy claim is stronger than a gate and this file says which part is which:
 *
 *   THE GATE is `espionageActive`, dropped door by door, absent/false/truthy-non-true all
 *     one world (FENCE 2 + the door census).
 *   THE STRUCTURE is that the stage WRITES NOTHING — it hands its readings back the way
 *     `openRansomClaims` hands back a priced claim, because custody cannot be opened until
 *     the encounter-shape question is ruled. So a LIT world and a DARK world are
 *     byte-identical in `worldState`, and the fence proves that BY RUNNING BOTH rather than
 *     by asserting the absence of a write nobody attempted (FENCE 1).
 *
 * ⚠ THE STRUCTURAL HALF IS ALSO THE TRAP, AND IT IS NAMED HERE. "The stage writes nothing"
 * makes byte-identity trivially true, which is exactly the shape in which a fence proves
 * nothing at all. Every fence below therefore carries its own LIVENESS CONTROL: the same
 * run, same tick, same fixture, must produce REAL detections with a REAL non-zero chance —
 * otherwise the identity being measured is the identity of two empty runs.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { advanceEspionageGauntlet } from '../../src/domain/worldPulse/espionage/espionageGauntlet.js';
import { espionageActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import {
  ENVOY_REQUIRED_RULES,
  advanceEnvoyErrands,
  envoyErrandsOf,
  mintEnvoyErrand,
  normalizeEnvoyPeaceOffer,
} from '../../src/domain/worldPulse/envoyErrand.js';
import { normalizeErrand } from '../../src/domain/worldPulse/envoyErrandRecords.js';
import { resumeEnvoyJourney } from '../../src/domain/worldPulse/envoyErrandEncounterWriter.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const WAR_RULES = Object.freeze(Object.fromEntries(ENVOY_REQUIRED_RULES.map((k) => [k, true])));

/** @param {unknown} value */
function hash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function world(rules = {}) {
  return {
    tick: 10,
    spatialCanonVersion: 1,
    simulationRules: {
      ...WAR_RULES, infoMode: 'unreliable', errandSpineEnabled: true, ...rules,
    },
    relationshipStates: { untouched: { relationshipType: 'hostile' } },
  };
}

const SNAPSHOT_BANDS = Object.freeze({
  storesBand: 'thin',
  strengthBand: 'ready',
  moraleExhaustionBand: 'present',
  foundingCauseStatus: 'live',
  believedRatioBand: 'matched',
});

function peaceOffer(from = 'ashford', to = 'irontown') {
  const relationshipKey = `${from}::${to}`;
  return {
    id: 'peace.offer.1',
    generatedAtTick: 10,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleId: 'settlement_strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: from,
    severity: 0.91,
    reasons: ['Engine prose does not ride with the envoy.'],
    relationshipKey,
    relationshipPatch: {
      proposedRelationshipType: 'neutral', trajectory: 'transitioning', privateScalar: 0.75,
    },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey,
      fromType: 'hostile',
      toType: 'neutral',
      peaceOffer: true,
      offererId: from,
      targetId: to,
      peaceFrontOwnerId: from,
      peaceFrontSinceTick: 4,
      reason: 'Engine prose is deliberately excluded.',
    },
  };
}

function acceptedRuling(outcome) {
  const offer = normalizeEnvoyPeaceOffer(outcome);
  const { offererId, targetId } = offer.proposalPayload;
  return {
    accepted: true,
    offererId,
    targetId,
    receipt: {
      id: `decision.${offererId}.${targetId}`,
      kind: 'war_peace_acceptance_read',
      tick: 10,
      offerId: offer.id,
      offererId,
      targetId,
      decision: 'accept',
      actualAction: 'peace',
      decidingTerm: 'cost_to_continue',
      bands: {
        cause: 'present', cost_to_continue: 'pressing', cost_to_stop: 'present', momentum: 'quiet',
      },
      reason: 'Both courts accept the carried peace.',
    },
    offererRead: {
      id: `termination.${offererId}.${targetId}`,
      kind: 'war_termination_read',
      tick: 10,
      attackerId: offererId,
      targetId,
      settlementIds: [offererId, targetId],
      booksDirection: 'peace',
      booksInterest: 'realm',
    },
    termination: {
      receipt: {
        id: `termination.${targetId}.${offererId}`,
        kind: 'war_termination_read',
        tick: 10,
        attackerId: targetId,
        targetId: offererId,
        settlementIds: [targetId, offererId],
        booksDirection: 'peace',
        booksInterest: 'realm',
      },
    },
    inheritedDemand: null,
    coalitionPeaceExpenditures: [],
  };
}

const SNAPSHOT = Object.freeze({
  settlements: [
    {
      id: 'ashford', name: 'Ashford', crimeRate: 'moderate', safety: 'guarded', wealth: 'moderate', population: 4000,
    },
    {
      id: 'westmarch',
      name: 'Westmarch',
      crimeRate: 'rampant',
      safety: 'lawless',
      wealth: 'poor',
      population: 2500,
      activeConditions: [{ id: 'c1' }, { id: 'c2' }],
    },
  ],
});
const GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'hostile' }],
});

function seeded(rules) {
  const start = world(rules);
  const outcome = peaceOffer();
  return mintEnvoyErrand({
    worldState: start,
    outcome,
    acceptance: acceptedRuling(outcome),
    npcId: 'npc.reeve',
    npcName: 'Reeve Mara',
    snapshot: SNAPSHOT_BANDS,
    purpose: 'sue',
    purposeClass: 'covert',
    covert: {
      demand: 'confirm',
      product: 'confirm',
      subjectId: 'irontown',
      itinerary: [
        { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
        { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
      ],
    },
    routePlan: {
      legs: [
        { fromId: 'ashford', toId: 'westmarch', departTick: 10, arrivalTick: 12 },
        { fromId: 'westmarch', toId: 'irontown', departTick: 20, arrivalTick: 22 },
      ],
      expectedReturnTick: 40,
      routeRef: { id: 'road.north', name: 'North Road' },
    },
    tick: 10,
  }).worldState;
}

/**
 * TEN TICKS OF THE REAL ERRAND ADVANCE with the gauntlet stage composed exactly where the
 * pulse composes it. Returns the per-tick worldState hashes AND the detections, so the
 * identity claim and the liveness control are measured off ONE run rather than two.
 */
function tenTicks(rules) {
  let state = seeded(rules);
  const hashes = [];
  const detections = [];
  for (let tick = 11; tick <= 20; tick += 1) {
    const advanced = advanceEnvoyErrands({ worldState: state, tick });
    state = advanced.worldState;
    const gauntlet = advanceEspionageGauntlet({
      worldState: state, tick, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    });
    detections.push(...gauntlet.detections);
    hashes.push(hash(envoyErrandsOf(state)));
  }
  // THE FLAG KEY ITSELF IS THE ONE LAWFUL DIFFERENCE and it is excluded EXPLICITLY rather
  // than by hashing a narrower object: `espionageEnabled: true` and `espionageEnabled:
  // false` are of course different bytes in `simulationRules`, and a fence that quietly
  // compared only the errand ledger would have hidden a write anywhere else in the world.
  const { espionageEnabled, ...rulesWithoutFlag } = state.simulationRules;
  return {
    hashes,
    detections,
    ledger: envoyErrandsOf(state),
    worldHash: hash({ ...state, simulationRules: rulesWithoutFlag }),
    flagSeen: espionageEnabled,
  };
}

describe('ES-2 dormancy — FENCE 1: the gauntlet has no footprint, lit OR dark', () => {
  test('ten ticks lit and ten ticks dark are the SAME world, and the lit run really ran', () => {
    const lit = tenTicks({ espionageEnabled: true });
    const dark = tenTicks({ espionageEnabled: false });
    // THE IDENTITY. Not one end state — the whole ten-tick sequence, so a write that
    // appeared mid-run and was overwritten before tick 20 still reds this array.
    expect(lit.hashes).toEqual(dark.hashes);
    expect(lit.worldHash).toBe(dark.worldHash);
    expect(lit.hashes).toHaveLength(10);
    // …and the two runs really were flagged differently, so the identity above is a
    // measurement rather than two spellings of the same world.
    expect([lit.flagSeen, dark.flagSeen]).toEqual([true, false]);
    // THE LIVENESS CONTROL, without which the identity above is the identity of two empty
    // runs. The lit run produced real readings with a real non-zero chance and at least one
    // real capture; the dark run produced none.
    expect(dark.detections).toEqual([]);
    expect(lit.detections.length).toBeGreaterThan(0);
    expect(lit.detections.every((row) => row.catch01 > 0)).toBe(true);
    expect(lit.detections.some((row) => row.caught)).toBe(true);
    // And the run really MOVED rather than sitting still for ten ticks: the traveller
    // finished the dwell and is on the second leg by tick 20 (the target arrives at 22).
    expect(lit.ledger[0].positionRef).toMatchObject({
      journey: 'outbound', legIndex: 1, fromId: 'westmarch', toId: 'irontown',
    });
    expect(dark.ledger[0].positionRef).toEqual(lit.ledger[0].positionRef);
  });

  test('the capture the lit run computed opened NO custody anywhere', () => {
    const lit = tenTicks({ espionageEnabled: true });
    const caught = lit.detections.filter((row) => row.caught);
    expect(caught.length).toBeGreaterThan(0);
    // anchored: `caught.length > 0` one line above proves the subject is a populated,
    // correctly-shaped collection, so this absence measures the stage's silence rather than
    // an empty harness.
    // anchored: `caught.length > 0` two lines above proves the run really computed captures, and the serialized ledger is asserted non-trivial by the FENCE 1 positionRef pin, so this absence measures the stage's silence rather than an empty subject
    expect(JSON.stringify(lit.ledger)).not.toContain('foreignGuestHolds');
    expect(lit.ledger.every((row) => row.state !== 'held')).toBe(true);
    expect(caught.every((row) => row.custodyWritten === false)).toBe(true);
  });
});

describe('ES-2 dormancy — FENCE 2: absent, false, and every truthy spelling are one world', () => {
  test('only a strict `=== true` produces a reading', () => {
    const spellings = [undefined, false, 0, '', 'true', 1, [], {}];
    for (const value of spellings) {
      const rules = value === undefined ? {} : { espionageEnabled: value };
      const run = advanceEspionageGauntlet({
        worldState: seeded(rules), tick: 13, snapshot: SNAPSHOT, regionalGraph: GRAPH,
      });
      expect(run.detections, `spelling ${JSON.stringify(value)} opened the door`).toEqual([]);
      expect(run.skipped).toEqual([]);
    }
    // THE CONTROL: the same fixture with the boolean really does open.
    expect(advanceEspionageGauntlet({
      worldState: seeded({ espionageEnabled: true }), tick: 13, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    }).detections).toHaveLength(1);
  });

  test('each door of the conjunction is dropped ALONE, and each one alone closes the stage', () => {
    const lit = { espionageEnabled: true };
    const run = (patch, base = seeded(lit)) => advanceEspionageGauntlet({
      worldState: { ...base, simulationRules: { ...base.simulationRules, ...patch } },
      tick: 13,
      snapshot: SNAPSHOT,
      regionalGraph: GRAPH,
    }).detections.length;
    // Door 3 open, doors 1 and 2 dropped one at a time. A second guard silently covering a
    // deleted first is the defect this estate has been bitten by twice.
    expect(run({})).toBe(1);
    expect(run({ errandSpineEnabled: false })).toBe(0);
    expect(run({ infoMode: 'omniscient' })).toBe(0);
    expect(run({ espionageEnabled: false })).toBe(0);
    // …and an invalid tick closes it independently of every flag.
    expect(advanceEspionageGauntlet({
      worldState: seeded(lit), tick: -1, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    }).detections).toEqual([]);
  });
});

describe('ES-2 dormancy — FENCE 3: the call path is never entered while dark', () => {
  test('the injected seams are called past the gate and NEVER before it', () => {
    // A REAL call-path spy with no mocking: `insideAssetAt` and `npcFor` are injected
    // seams the stage reaches only after every door and only for a row that is really
    // dwelling, so their call counts ARE the call path.
    const calls = [];
    const drive = (rules, tick) => advanceEspionageGauntlet({
      worldState: seeded(rules),
      tick,
      snapshot: SNAPSHOT,
      regionalGraph: GRAPH,
      insideAssetAt: (targetId, homeId) => { calls.push(`asset:${homeId}->${targetId}`); return false; },
      npcFor: (errand) => { calls.push(`npc:${errand.npcId}`); return null; },
    });
    drive({ espionageEnabled: false }, 13);
    expect(calls).toEqual([]);
    drive({ espionageEnabled: true }, 11); // lit, but the traveller is still on the road
    expect(calls).toEqual([]);
    drive({ espionageEnabled: true }, 13); // lit AND dwelling
    expect(calls).toEqual(['npc:npc.reeve', 'asset:ashford->westmarch']);
  });
});

describe('ES-2 dormancy — FENCE 4: one gate read, in one place', () => {
  test('the gauntlet names no flag itself and reaches the door exactly once', () => {
    const src = readFileSync(join(ROOT, 'src/domain/worldPulse/espionage/espionageGauntlet.js'), 'utf8');
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    // The stage MINTS no flag and spells no rule key: its whole authority is the ES-0 door.
    // The `espionageActive` count on the next line is the liveness anchor for both
    // absences — it can only hold while `code` is the real, comment-stripped module source.
    expect((code.match(/espionageActive\s*\(/g) || []).length).toBe(1);
    expect(code).not.toMatch(/espionageEnabled/); // anchored: the espionageActive count above proves `code` is the live stripped source
    expect(code).not.toMatch(/simulationRules/); // anchored: the espionageActive count above proves `code` is the live stripped source
    // A positive control on the detector: a planted second read would be seen.
    expect(/espionageEnabled/.test('rules.espionageEnabled === true')).toBe(true);
  });

  test('the gauntlet is reached by its mount and by ES-3, and by nothing else', () => {
    const files = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.jsx?$/.test(entry)) files.push(path);
      }
    };
    walk(join(ROOT, 'src'));
    // AN IMPORT, NOT A MENTION. The certification row names the module in its path list and
    // the coupling registry names it in a `read:` address; both are RECORDS OF the coupling
    // rather than uses of it, and a detector that counted them would have to be relaxed the
    // first time this wave documented itself honestly. The claim is about the module graph.
    const IMPORT_RE = /(?:^|\n)\s*import[^;]*?from\s*['"][^'"]*espionageGauntlet\.js['"]/;
    const importers = files
      .filter((path) => IMPORT_RE.test(readFileSync(path, 'utf8')))
      .map((path) => relative(ROOT, path).replace(/\\/g, '/'))
      .sort();
    // ⏱ WIDENED AT ES-3 (2026-08-06), AND THE WIDENING IS THE ARCHITECTURE HOLDING. The
    // product stage borrows THREE things from this leaf — `covertDwellRead`,
    // `gauntletCatchFactors` and `DWELL_INTERVAL_TICKS` — precisely so the estate keeps ONE
    // dwell clock, one factor gathering and one interval window. Re-deriving any of them in
    // ES-3 would have satisfied the old one-importer spelling of this pin while minting the
    // second position fraction law M forbids, so the honest set is TWO and the exactness of
    // the assertion is what still keeps a third out.
    expect(importers).toEqual([
      'src/domain/worldPulse/envoyPulse.js',
      'src/domain/worldPulse/espionage/espionageProductStage.js',
    ]);
    // A POSITIVE CONTROL on the detector, because a regex that stopped matching would report
    // an empty importer set and pass having proved nothing.
    expect(IMPORT_RE.test("import { x } from './espionage/espionageGauntlet.js';")).toBe(true);
    expect(IMPORT_RE.test("// espionageGauntlet.js is named in prose here")).toBe(false);
  });
});

describe('ES-2 — THE LIT MUTANT: opening every door produces a real, climbing gauntlet', () => {
  test('lit, hostile and rooted, the odds climb and a capture lands', () => {
    const state = seeded({ espionageEnabled: true });
    expect(espionageActive(state)).toBe(true);
    const rows = [12, 14, 16, 18].map((tick) => advanceEspionageGauntlet({
      worldState: state, tick, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    }).detections[0]);
    expect(rows.map((row) => row.intervalIdx)).toEqual([0, 1, 2, 3]);
    for (let index = 1; index < rows.length; index += 1) {
      expect(rows[index].catch01).toBeGreaterThan(rows[index - 1].catch01);
    }
    expect(rows.some((row) => row.caught)).toBe(true);
  });
});

describe('ES-2 — ⛔ THE MEASURED BLOCKER, recorded as a pin so its lifting is VISIBLE', () => {
  /**
   * This is the executed evidence behind the stage header's stop-report, kept as a test
   * rather than as prose for one reason: the day the encounter shape is ruled and either
   * DTO relaxes, THIS FILE REDS, and the next implementer learns that ES-2b's custody write
   * is now buildable. A comment could not have told anybody that.
   */
  test('the errand DTO refuses `held` without an errand-side encounter', () => {
    const state = seeded({ espionageEnabled: true });
    const row = envoyErrandsOf(state)[0];
    // The SAME row is accepted while travelling — so the refusal below measures the custody
    // clause and not a broken fixture.
    expect(normalizeErrand(row)).not.toBe(null);
    expect(normalizeErrand({
      ...row,
      state: 'held',
      heldTick: 14,
      positionRef: {
        journey: 'outbound', legIndex: 0, fromId: 'ashford', toId: 'westmarch', progressBand: 'arrived',
      },
    })).toBe(null);
  });

  test('the only release road refuses a hold whose errand carries no encounter', () => {
    const state = seeded({ espionageEnabled: true });
    const row = envoyErrandsOf(state)[0];
    expect(row.encounters === undefined || row.encounters.length === 0).toBe(true);
    // `releaseHeldEnvoy` is this function, and the DM pardon verb is its only caller. A
    // hold opened by the gauntlet today could therefore never be released — only closed by
    // death — which is why ES-2 computes custody instead of writing it.
    expect(resumeEnvoyJourney({
      worldState: state,
      errandId: row.id,
      encounterId: 'espionage_stay:westmarch',
      routePlan: null,
      tick: 20,
    }).reason).toBe('stale_encounter');
  });
});
