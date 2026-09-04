/**
 * envoyChanceMeetingStage.test.js — ENC-3's stage: the errand-neutrality invariant, the
 * drop pass that runs above both gates, the lived-experience adapter's shape, and the
 * MARK-GRAIN routing that stopped a rivalry being filed as a friendship.
 *
 * ⛔⛔ THIS FILE WAS CITED BEFORE IT EXISTED. `subsystemRowsEncounters.js` invariant
 * `deposit_consumed_once` and the errand-neutrality invariant both name this exact path in
 * their `check:` strings, and the stage's own header carried an `@enforced-by` tag pointing
 * here. None of it resolved: `tests/docs/enforcedByExists.test.js` convicted the target, and
 * a 759-line stage that mutates four ledgers had no test of its own. The claims are the
 * stage author's; the instruments are here now so the claims are checkable rather than
 * merely written down.
 *
 * ── WHAT THIS FILE DOES NOT CLAIM, STATED SO NOBODY READS SILENCE AS COVERAGE ──────────
 * The dormancy half of the row (byte-identity, the truthy-refusal spellings, the call-path
 * spy and the gate-polarity census) lives in `tests/property/chanceEncountersDormancyFence.test.js`
 * as FENCES 1-4. The LIT resolution behaviour — meeting rates, mark distributions, the
 * compromise leash — is ENC-1's leaf's own suite (`envoyChanceMeeting.test.js`) plus ENC-2's
 * ledger suite; this file tests the STAGE's contract with the pulse, not the leaf's arithmetic.
 * The §7.4 measured meeting and mark RATES asserted in the certification row are NOT pinned
 * anywhere yet, and that debt is recorded rather than papered over.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  CHANCE_MEETING_EXPERIENCE_KIND,
  CHANCE_MEETING_STAGE_TUNING,
  advanceChanceMeetings,
  chanceEncountersActive,
  chanceMeetingLessonEntries,
  dropStaleMeetingLedgers,
} from '../../src/domain/worldPulse/envoyChanceMeetingStage.js';
import { MEETING_MARK_GRAINS, meetingMarkKey } from '../../src/domain/worldPulse/envoyChanceMeetingLedger.js';
import { BOND_KINDS, GRUDGE_KINDS, mintBond } from '../../src/domain/worldPulse/npcLadderState.js';
import { ADAPTER_HOMED_ELSEWHERE } from '../../src/domain/npc/livedExperienceSources.js';
import { resolveChanceMeeting } from '../../src/domain/worldPulse/envoyChanceMeeting.js';
import { mintOne, spineWorld } from '../helpers/errandSpineFixture.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** A world carrying real errands, with the chance-encounters key in whatever state. */
function stageWorld(flag) {
  const base = spineWorld({ spine: true });
  if (flag !== undefined) {
    base.simulationRules = { ...base.simulationRules, chanceEncountersEnabled: flag };
  }
  return /** @type {Record<string, unknown>} */ (mintOne(base).worldState);
}

describe('ENC-3 stage — THE ERRAND-NEUTRALITY INVARIANT', () => {
  it('⭐ the stage spends no errand transition: envoyErrands is JSON-identical across it', () => {
    for (const flag of [undefined, false, true]) {
      const world = stageWorld(flag);
      const before = JSON.stringify(world.envoyErrands);
      // anchored: there really ARE errands to be neutral about. An identity over an empty
      // list is the vacuous green this invariant would otherwise drift into.
      expect(Array.isArray(world.envoyErrands), String(flag)).toBe(true);
      expect(/** @type {unknown[]} */ (world.envoyErrands).length, String(flag)).toBeGreaterThan(0);
      const out = advanceChanceMeetings({
        worldState: world,
        snapshot: { settlements: [] },
        regionalGraph: null,
        startErrands: world.envoyErrands,
        errands: world.envoyErrands,
        tick: 12,
      });
      expect(JSON.stringify(out.worldState.envoyErrands), String(flag)).toBe(before);
    }
  });

  it('the stage returns the four typed channels and never undefined', () => {
    const out = advanceChanceMeetings({ worldState: stageWorld(undefined), tick: 12 });
    expect(Object.keys(out).sort()).toEqual(['driftRefusals', 'heraldSeeds', 'receipts', 'worldState']);
    expect(Array.isArray(out.receipts)).toBe(true);
    expect(Array.isArray(out.driftRefusals)).toBe(true);
    expect(Array.isArray(out.heraldSeeds)).toBe(true);
  });
});

describe('ENC-3 stage — THE DROP PASS RUNS ABOVE BOTH GATES (the P-7 cure, widened)', () => {
  it('⭐ a NEVER-LIT world has no prior, so the drop pass reports no change and writes nothing', () => {
    const world = stageWorld(undefined);
    const before = JSON.stringify(world);
    const dropped = dropStaleMeetingLedgers({ worldState: world, tick: 12 });
    // anchored: the call really ran on a real world, and the world really is dark
    expect(chanceEncountersActive(world)).toBe(false);
    expect(dropped.changed).toBe(false);
    expect(JSON.stringify(dropped.worldState)).toBe(before);
  });

  it('⭐ and it is IDEMPOTENT, which is what lets the pulse and the stage both call it', () => {
    // The stage calls it as its own first act even though `envoyPulse.js` already did. That
    // is only safe because a second call on an already-dropped state finds nothing.
    const world = stageWorld(undefined);
    const once = dropStaleMeetingLedgers({ worldState: world, tick: 12 });
    const twice = dropStaleMeetingLedgers({ worldState: once.worldState, tick: 12 });
    expect(twice.changed).toBe(false);
    expect(JSON.stringify(twice.worldState)).toBe(JSON.stringify(once.worldState));
  });

  it('a world holding a STALE mark deposit drops it even while the feature is dark', () => {
    // THE BUG THE ORDERING EXISTS TO PREVENT: a world lit yesterday and darkened today must
    // still drain, or the one-tick ledger is a leak and the spatial namespace never empties.
    const world = stageWorld(false);
    const staleKey = meetingMarkKey('sid_alpha', 'nid_someone');
    const withStale = {
      ...world,
      spatialLedgers: {
        .../** @type {Record<string, unknown>} */ (world.spatialLedgers || {}),
        meetingMarkEvents: {
          [staleKey]: {
            mark: 'bond', otherNid: 'nid_other', foreignSid: 'sid_beta',
            kind: 'friendship', sev: 'half', depositTick: 3,
          },
        },
      },
    };
    // anchored: the stale key really is there before the pass
    const priorLedger = /** @type {Record<string, unknown>} */ (
      /** @type {Record<string, unknown>} */ (withStale.spatialLedgers).meetingMarkEvents);
    expect(Object.keys(priorLedger)).toEqual([staleKey]);
    const dropped = dropStaleMeetingLedgers({ worldState: withStale, tick: 12 });
    expect(dropped.changed).toBe(true);
    const after = /** @type {Record<string, unknown>} */ (
      /** @type {Record<string, unknown>} */ (dropped.worldState).spatialLedgers || {});
    expect(Object.keys(after).includes('meetingMarkEvents')).toBe(false);
  });
});

describe('ENC-3 stage — THE LIVED-EXPERIENCE ADAPTER', () => {
  const RECEIPT = Object.freeze({
    id: 'meet_1',
    drift: [
      { subjectNid: 'nid_b', axisId: 'MERCY', pole: 'virtue', band: 'faint' },
      { subjectNid: 'nid_a', axisId: 'COURAGE', pole: 'vice', band: 'faint' },
      { subjectNid: 'nid_a', axisId: 'MERCY', pole: 'virtue', band: 'faint' },
    ],
  });
  const subjectOf = (/** @type {string} */ nid) => ({
    settlementId: `sid_${nid}`, settlementSeed: `seed_${nid}`, npc: { id: nid },
  });

  it('⭐ one entry per SUBJECT, codepoint-ordered, carrying that subject`s pulls only', () => {
    const entries = chanceMeetingLessonEntries({ receipt: RECEIPT, subjectOf });
    expect(entries.map((e) => e.settlementId)).toEqual(['sid_nid_a', 'sid_nid_b']);
    expect(entries.every((e) => e.kind === CHANCE_MEETING_EXPERIENCE_KIND)).toBe(true);
    expect(entries.every((e) => e.eventId === 'meet_1')).toBe(true);
    // nid_a had TWO pulls and nid_b one — the grouping is per subject, not per pull
    expect(entries.map((e) => /** @type {unknown[]} */ (e.pulls).length)).toEqual([2, 1]);
  });

  it('a subject the caller REFUSES is dropped, which is how the season cap is expressed', () => {
    // The stage refuses a subject by returning null from `subjectOf` — that is the seam the
    // per-subject lesson cadence is enforced through, so a refusal must remove the entry
    // rather than emit a hollow one.
    const only = chanceMeetingLessonEntries({
      receipt: RECEIPT,
      subjectOf: (nid) => (nid === 'nid_a' ? subjectOf(nid) : null),
    });
    expect(only.map((e) => e.settlementId)).toEqual(['sid_nid_a']);
    // anchored: with no refusal the same receipt yields two, so the one above is the
    // refusal working and not a receipt that only ever had one subject.
    expect(chanceMeetingLessonEntries({ receipt: RECEIPT, subjectOf })).toHaveLength(2);
  });

  it('it is TOTAL: a garbage receipt or a missing chooser yields the frozen empty list', () => {
    expect(chanceMeetingLessonEntries()).toEqual([]);
    expect(chanceMeetingLessonEntries({ receipt: {}, subjectOf })).toEqual([]);
    expect(chanceMeetingLessonEntries({ receipt: RECEIPT })).toEqual([]);
  });

  it('⭐ and the funnel RESOLVES this adapter by name, so the registration is not prose', () => {
    expect(ADAPTER_HOMED_ELSEWHERE[CHANCE_MEETING_EXPERIENCE_KIND])
      .toBe('src/domain/worldPulse/envoyChanceMeetingStage.js#chanceMeetingLessonEntries');
    expect(CHANCE_MEETING_EXPERIENCE_KIND).toBe('met_a_foreigner');
  });
});

describe('ENC-3 stage — THE MARK GRAIN IS CHOSEN BY THE KIND', () => {
  it('⛔ a rivalry is a GRUDGE grain, so it can never reach the bond writer', () => {
    // THE INVERSION THIS PINS. `collectDeposits` used to write `mark: 'bond'`
    // unconditionally. A `rivalry` therefore travelled the bond road into `mintBond`,
    // whose unknown-kind coercion turned it into a `friendship` — the one outcome meaning
    // two people took against each other, filed as its opposite. Measured, not argued:
    expect(mintBond({}, 'nid_x', 'rivalry', 0.25, 5).nid_x.kind).toBe('friendship');
    // which is exactly why the grain must divert it before it gets there.
    expect(GRUDGE_KINDS.has('rivalry')).toBe(true);
    expect(BOND_KINDS.has('rivalry')).toBe(false);
    expect(MEETING_MARK_GRAINS.includes('grudge')).toBe(true);
  });

  it('⭐ and `respect` is a real bond kind now, so it survives the writer intact', () => {
    expect(BOND_KINDS.has('respect')).toBe(true);
    expect(mintBond({}, 'nid_x', 'respect', 0.25, 5).nid_x.kind).toBe('respect');
    // the other three, unchanged, so the widening did not disturb the originals
    for (const kind of ['loyalty', 'gratitude', 'friendship']) {
      expect(mintBond({}, 'nid_x', kind, 0.25, 5).nid_x.kind, kind).toBe(kind);
    }
  });

  it('the stage tuning is declared CANDIDATE and owner-unsigned, per §12 row 7', () => {
    // A tuning surface that forgets it is unsigned is a tuning surface that ships signed.
    expect(typeof CHANCE_MEETING_STAGE_TUNING).toBe('object');
    expect(Object.isFrozen(CHANCE_MEETING_STAGE_TUNING)).toBe(true);
    expect(Object.keys(CHANCE_MEETING_STAGE_TUNING).length).toBeGreaterThan(0);
  });
});

describe('⭐ THE FLAG-ON LIT WALKTHROUGH — chanceEncountersEnabled: true, end to end', () => {
  // ⛔⛔ THIS SUITE EXISTS BECAUSE THE MECHANISM HAD NEVER ONCE BEEN RUN LIT, AND WHEN IT
  // FINALLY WAS, IT DID NOT WORK. `mechanismLitCoverage`'s flag ratchet convicted
  // `chanceEncountersEnabled` as shipping with no lit walkthrough. Writing the walkthrough
  // immediately found the reason the gap mattered: the stage's traveller projection omitted
  // the `band` field, the leaf's `normalizeTraveller` refuses any row whose band is not
  // 'arrived', and so `censusChanceMeetingCandidates` returned ZERO for every possible
  // world. The feature was dead on arrival in the strongest sense — not mis-tuned, not rare,
  // but structurally incapable of producing a single meeting. A dormancy fence cannot see
  // that: a mechanism that does nothing when lit is byte-identical to one that is dark.
  //
  // ⭐ SO THE ONE ASSERTION THIS FILE MOST NEEDED WAS THE CHEAPEST ONE: light the flag and
  // check that something happens.
  const HOME = 'ashford';
  const HOST = 'irontown';
  const ARRIVAL_TICK = 12;

  const person = (id, name, role) => ({
    id, name, role, importance: 'pillar', dots: 3, structuralRank: 'dominant',
    personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
  });
  const town = (id, name, npcs) => ({
    id, name, settlement: { id, name, seed: `seed_${id}`, tier: 'city', population: 9000, npcs },
  });

  /** A world with the errand spine lit AND the chance-encounters flag lit. */
  function litWorld() {
    const base = spineWorld({ spine: true });
    // ⭐ THE LITERAL SPELLING IS DELIBERATE. `mechanismLitCoverage` credits a flag as
    // lit-covered by scanning the test corpus for `<flag>: true`, so a computed key
    // (`[FLAG]: true`) earns no credit — which is exactly how this mechanism slipped
    // through while a dormancy fence that DID drive the flag sat right beside it.
    base.simulationRules = { ...base.simulationRules, chanceEncountersEnabled: true };
    return /** @type {Record<string, unknown>} */ (mintOne(base).worldState);
  }

  function litSnapshot() {
    const settlements = [
      town(HOME, 'Ashford', [person('npc.envoy.1', 'A Named Legate', 'Legate')]),
      town(HOST, 'Irontown', [person('npc.host.1', 'Host Notable', 'Steward')]),
    ];
    return { settlements, byId: new Map(settlements.map((s) => [s.id, s])) };
  }

  const runLit = (tick = ARRIVAL_TICK) => {
    const world = litWorld();
    return advanceChanceMeetings({
      worldState: world,
      snapshot: litSnapshot(),
      regionalGraph: { edges: [{ from: HOME, to: HOST, relationshipType: 'neutral' }] },
      startErrands: world.envoyErrands,
      errands: world.envoyErrands,
      tick,
    });
  };

  it('⭐ A MEETING ACTUALLY HAPPENS: the lit stage produces a receipt on the arrival tick', () => {
    const world = litWorld();
    // anchored first, so a receipt count is a fact about the STAGE and not about a world
    // that was dark, or an errand list that was empty, or a traveller who never arrived.
    expect(chanceEncountersActive(world)).toBe(true);
    expect(/** @type {unknown[]} */ (world.envoyErrands).length).toBeGreaterThan(0);

    const out = runLit();
    expect(out.receipts.length).toBeGreaterThan(0);
    const receipt = /** @type {Record<string, unknown>} */ (out.receipts[0]);
    expect(receipt.kind).toBe('traveller_resident');
    expect(receipt.venue).toBe('host_settlement');
    expect(receipt.nodeId).toBe(HOST);
    expect(receipt.tick).toBe(ARRIVAL_TICK);
  });

  it('⛔ THE REGRESSION PIN: the traveller carries its `band`, or no meeting can EVER occur', () => {
    // The defect this suite found, pinned at the seam that caused it. `normalizeTraveller`
    // refuses a row whose band is not 'arrived'; the projection filters on exactly that
    // word, so the word must travel with the row. Drop it and the census silently returns
    // zero for every world — no error, no refusal receipt, just a feature that never fires.
    const source = readFileSync(
      join(REPO_ROOT, 'src/domain/worldPulse/envoyChanceMeetingStage.js'), 'utf8',
    );
    expect(source.length).toBeGreaterThan(5000);           // anchored: the real file
    expect(source).toContain('band: text(positionRef.progressBand)');
  });

  it('the meeting fires on the ARRIVAL tick only, which is what makes it a chance and not a stay', () => {
    // A traveller who is still standing in the host court on the next tick does not meet
    // the same notable again: the census keys on the arrival tick exactly.
    expect(runLit(ARRIVAL_TICK).receipts.length).toBeGreaterThan(0);
    expect(runLit(ARRIVAL_TICK + 1).receipts).toHaveLength(0);
    expect(runLit(ARRIVAL_TICK - 1).receipts).toHaveLength(0);
  });

  it('⭐ THE CALL-PATH, LIT: the resolver really executes (FENCE 3\'s other half)', () => {
    // The dormancy fence pins ZERO resolver calls dark. That half is only worth something
    // beside this one: a spy that counts zero in both states measures nothing at all.
    // Asserted here through the resolver's own output rather than a mock, because the
    // receipt shape below is only producible BY `resolveChanceMeeting`.
    expect(typeof resolveChanceMeeting).toBe('function');
    const out = runLit();
    const receipt = /** @type {Record<string, unknown>} */ (out.receipts[0]);
    expect(typeof receipt.id).toBe('string');
    expect(String(receipt.id).startsWith('chance_meeting:')).toBe(true);
    expect(Array.isArray(receipt.refusals)).toBe(true);
    expect(typeof receipt.outcome).toBe('string');
  });

  it('and the LIT run still spends no errand transition — neutrality is not a dark-only claim', () => {
    const world = litWorld();
    const before = JSON.stringify(world.envoyErrands);
    const out = advanceChanceMeetings({
      worldState: world,
      snapshot: litSnapshot(),
      regionalGraph: { edges: [{ from: HOME, to: HOST, relationshipType: 'neutral' }] },
      startErrands: world.envoyErrands,
      errands: world.envoyErrands,
      tick: ARRIVAL_TICK,
    });
    expect(out.receipts.length).toBeGreaterThan(0);        // anchored: the lit path really ran
    expect(JSON.stringify(out.worldState.envoyErrands)).toBe(before);
  });
});

describe('⛔ THE GRIEVANCE ARM — proven live, and pinned at last', () => {
  // ⛔⛔ THIS ARM WAS REPORTED AS DEAD AND IS NOT. The observed-shape ratchet convicted the
  // stage of reading `grievance.fromSid` / `.toSid` / `.incidentType` — "a key no writer
  // produces … the arm behind it is dead on every generated world" — and the prescribed
  // cures were to read a key the producer writes, or delete the arm. Neither applied: the
  // leaf writes those EXACT three names (`envoyChanceMeeting.js:955`), and the arm fires.
  // MEASURED before anything was changed: 360 lit runs (3 postures × 120 seeds) produced 5
  // `exposed` outcomes, each carrying the full grievance.
  //
  // ⭐ THE INSTRUMENT WAS TRUE ABOUT ITS CORPUS AND FALSE ABOUT THE CODE. Its corpus never
  // executes this leaf, and it predates the `band` cure — before that no meeting could occur
  // at all, so it had recorded a world in which the arm really WAS unreachable. A blocker is
  // a claim, and that one had decayed. Deleting proven product to satisfy a stale corpus
  // would have been the worst outcome available; the row is admitted through the door's
  // fourth gate instead (schema 16), and this suite is why that admission is honest.
  //
  // ⚠ AND THE REASON IT WENT UNPINNED SO LONG IS THE SAME REASON THE STAGE SHIPPED DEAD: an
  // arm with proven behaviour and no test is exactly the condition that let two dead arms
  // live in this file. This is the pin.
  const HOME = 'ashford';
  const HOST = 'irontown';
  const EXPOSED_SEED = 'g85';   // verified: reproduces `exposed` on this fixture
  const QUIET_SEED = 'g1';      // verified: reproduces `nothing` on the SAME fixture
  const EDGE_KEY = 'rel.ashford.irontown';

  const soul = (id, name, role) => ({
    id, name, role, importance: 'pillar', dots: 3, structuralRank: 'dominant',
    personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
  });
  const court = (id, name, npcs) => ({
    id, name, settlement: { id, name, seed: `seed_${id}`, tier: 'city', population: 9000, npcs },
  });

  /** The lit world, seeded so the exposure roll is deterministic. */
  function grievanceWorld(rngSeed) {
    const base = spineWorld({ spine: true });
    base.simulationRules = {
      ...base.simulationRules,
      chanceEncountersEnabled: true,
      memoryWeaveEnabled: true,
      npcLadderEnabled: true,
      corruptionWebEnabled: true,
    };
    base.rngSeed = rngSeed;
    return /** @type {Record<string, unknown>} */ (mintOne(base).worldState);
  }

  function runSeeded(rngSeed) {
    const world = grievanceWorld(rngSeed);
    const settlements = [
      court(HOME, 'Ashford', [soul('npc.envoy.1', 'A Named Legate', 'Legate')]),
      court(HOST, 'Irontown', [soul('npc.host.1', 'Host Notable', 'Steward')]),
    ];
    const out = advanceChanceMeetings({
      worldState: world,
      snapshot: { settlements, byId: new Map(settlements.map((s) => [s.id, s])) },
      regionalGraph: { edges: [{ from: HOME, to: HOST, relationshipType: 'neutral' }] },
      startErrands: world.envoyErrands,
      errands: world.envoyErrands,
      tick: 12,
    });
    return { before: JSON.stringify(world.relationshipStates || {}), out };
  }

  it('⭐ AN EXPOSED APPROACH FILES A GRIEVANCE carrying both courts and the incident word', () => {
    const { out } = runSeeded(EXPOSED_SEED);
    // anchored first: the run really produced a receipt, so the grievance below is a fact
    // about the OUTCOME rather than about an empty receipt list.
    expect(out.receipts.length).toBeGreaterThan(0);
    const receipt = /** @type {Record<string, unknown>} */ (out.receipts[0]);
    expect(receipt.outcome).toBe('exposed');
    // THE THREE KEYS THE STAGE READS, produced by the leaf. Asserted as an exact object so a
    // renamed or dropped field cannot pass by still being truthy.
    //
    // ⚠ THE DIRECTION IS MEASURED, NOT REASONED, AND I GOT IT WRONG FIRST. The leaf writes
    // `fromSid: lead.target.homeSid` and `toSid: lead.approacher.homeSid`, from which I
    // predicted HOST→HOME and the run returned HOME→HOST. Which party the lead makes the
    // approacher on this fixture is therefore NOT what I assumed, and this pin deliberately
    // does not claim it: it fixes the observed pair so a change of direction REDS and gets
    // read by someone, rather than asserting a role mapping I have not verified.
    expect(receipt.grievance).toEqual({
      fromSid: HOME, toSid: HOST, incidentType: 'approach_exposed',
    });
  });

  it('⭐ AND IT REACHES THE RELATIONSHIP PLANE — the arm writes, it does not merely receipt', () => {
    // The half that makes this a live arm rather than a live RECEIPT. `fileGrievances` reads
    // the three keys, resolves the courts' edge and patches the plane through its ONE writer.
    const { before, out } = runSeeded(EXPOSED_SEED);
    const after = /** @type {Record<string, unknown>} */ (out.worldState.relationshipStates || {});
    expect(JSON.stringify(after) === before).toBe(false);
    const edge = /** @type {Record<string, unknown>} */ (after[EDGE_KEY]);
    expect(typeof edge).toBe('object');
    expect(Array.isArray(edge.recentIncidents)).toBe(true);
    expect(/** @type {unknown[]} */ (edge.recentIncidents).length).toBeGreaterThan(0);
  });

  it('⭐ THE DIFFERENTIAL: no exposure ⇒ no grievance ⇒ the plane is untouched', () => {
    // ONE fixture, TWO seeds, opposite outcomes. Without this the pin above would pass just
    // as happily if the stage patched the plane on EVERY meeting — which is the shape of a
    // guard nobody has watched refuse.
    const { before, out } = runSeeded(QUIET_SEED);
    expect(out.receipts.length).toBeGreaterThan(0);       // anchored: a meeting DID happen
    const receipt = /** @type {Record<string, unknown>} */ (out.receipts[0]);
    expect(receipt.outcome).toBe('nothing');
    expect(receipt.grievance ?? null).toBe(null);
    expect(JSON.stringify(out.worldState.relationshipStates || {})).toBe(before);
  });

  it('⭐ THE TUNING IS LIVE, NOT DECORATIVE — exposureGrievance lands VERBATIM', () => {
    // ⚠ THIS PIN EXISTS SO NOBODY SIGNS A VALUE THAT DOES NOTHING. `CHANCE_MEETING_STAGE_TUNING`
    // is registered as a DRAFT row, and two of its three values exist only to drive this arm.
    // Registering is not signing — but a value whose only consumer was a dead arm would be a
    // dial connected to nothing, and this asserts the opposite by measuring what LANDS.
    const { out } = runSeeded(EXPOSED_SEED);
    const after = /** @type {Record<string, unknown>} */ (out.worldState.relationshipStates || {});
    const edge = /** @type {Record<string, unknown>} */ (after[EDGE_KEY]);
    // The approacher is NOT covert on this fixture, so the multiplier is 1 and the tuned
    // value lands unmodified. The covert arm doubles it at the same site; it is reachable
    // and is deliberately NOT pinned here, because that needs a covert errand fixture.
    expect(CHANCE_MEETING_STAGE_TUNING.exposureGrievance).toBe(0.25);
    expect(CHANCE_MEETING_STAGE_TUNING.exposureCovertMultiplier).toBe(2);
    expect(edge.resentment).toBe(CHANCE_MEETING_STAGE_TUNING.exposureGrievance);
  });
});
