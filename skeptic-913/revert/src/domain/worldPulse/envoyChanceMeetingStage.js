/**
 * envoyChanceMeetingStage.js — ENC-3. THE STAGE, THE FLAG, AND THE ONE GATE READ.
 *
 * ENC-1 built the pure resolution, ENC-2 built the two deposit ledgers and the three
 * willed-leash fences, and until this file nothing called either. This is the wiring:
 * it projects the two parties from the pulse's ONE pre-mutation cut, calls the leaf,
 * and hands each receipt to the writer that already owns the ledger it lands in. It
 * writes NO errand row, mints NO leash, moves NO soul and speaks NO name.
 *
 * ── WHAT THIS FILE MAY AND MAY NOT DO ───────────────────────────────────────────
 *
 * It DEPOSITS. The ladder kernel is still the only writer of a mark, the corruption
 * web still the only writer of a leash, `writeAxisDrift` (through the funnel) still
 * the only mover of a soul, and `applyRelationshipPatch` still the only writer of the
 * relationship plane. Every one of those is reached through the consumer's own door,
 * under the consumer's own flag, and the deposit is ABSENT when that flag is dark —
 * the `espionageCareerCredit.js:225-228` law that the absence IS the gate.
 *
 * ── ⛔ THE DROP PASS RUNS ABOVE **TWO** GATES, NOT ONE ───────────────────────────
 *
 * `envoyChanceMeetingLedger.js` says, correctly, that `applyMeetingMarkLedger` must be
 * called BEFORE the flag read, or a world lit today and darkened tomorrow carries its
 * last deposits forever. What that header could not know is that the stage's mount
 * point is not the first thing the envoy pulse does: `advanceEnvoyDiplomacyPulse`
 * RETURNS EARLY when `envoyDiplomacyActive` is false, and that return sits ABOVE the
 * mount. So `chanceEncountersEnabled` is only the SECOND gate over the drop pass, and
 * a world that darkens `envoyDiplomacyEnabled` leaks `meetingMarkEvents` exactly as
 * P-7 described — the same bug, one gate further out.
 *
 * The cure is `dropStaleMeetingLedgers`, exported here and called by `envoyPulse.js`
 * as the pulse's FIRST act, ABOVE its own early return and above every flag. It is
 * IDEMPOTENT by construction (it reads its prior from the state handed in, so a second
 * call on an already-dropped state sees no prior and reports `changed: false`), which
 * is why this stage may call it again as its own first act and still be correct when
 * driven directly by a test. A never-lit world has no prior and is byte-identical.
 *
 * The LEAN ledger rides the same pass, and that is deliberate. §6.7/J26 rules that a
 * darkened flag LEAVES deposited channels for the web to consume — so the pass never
 * purges them — but the TTL is the only decay a compromise band has (§1.3: once the
 * web mints, a willed leash is permanent until one of its four typed ends fires). A
 * decay clock that stops ticking because a SIBLING flag went dark is a decay law that
 * ghosts on one path, which is this estate's most expensive bug class.
 *
 * ── THE SIGHT LAW, AND WHAT THIS STAGE HONESTLY SUPPLIES ────────────────────────
 *
 * §3.7 records that `npc.character` is written on NO generated world, so the KNOWN
 * chart and the TRUE chart are synthesized from the same legacy core today, and the
 * leaf already models that: it overlays whatever the caller discloses onto the core
 * rather than replacing it, so an empty overlay IS the production answer. What this
 * stage supplies that is NOT the core is `truePlane` — `npcTraitPlane(npc, null)`,
 * the DRIFTED plane — so the resolution reads what a man has become while the
 * decision reads what he was written as. A disclosure ledger and an observer-drift
 * read would be plumbing with no production effect at this tip; ENC-1's leaf pins the
 * split on a disclosed-axis fixture, and the day a disclosure surface exists this
 * stage hands its axes to the same parameter. Recorded, not forgotten.
 *
 * ── THE FUNNEL DOOR IS NOT THIS CAR'S ───────────────────────────────────────────
 *
 * ⟦A20⟧/§882.1 give the lived-experience funnel ONE production door, owned by
 * whichever train lands first. CHECKED at this dock: `LIVES_SUBSYSTEM_ROWS` is empty
 * and `characterDriftEnabled` is in no manifest, so the door is UNBUILT — and this
 * lane's charter does not name it as the owner, which §16 attack 10 makes the
 * deciding fact.
 *
 * ⛔ THIS STAGE THEREFORE DOES NOT CALL THE FUNNEL, AND THAT IS A RULING, NOT AN
 * OVERSIGHT. An earlier draft of this file called `foldLivedExperience` directly and
 * said so here. It was convicted by `characterDrift.test.js` STEP 2 (nothing outside
 * the family may name the funnel) — a red that had been INVISIBLE because STEP 1 was
 * failing first and a red at an early assertion blinds every later one in the same
 * test. Ruled at §893: the stage produces the funnel's INTAKE SHAPE and hands it to
 * nobody, exactly as `faithWitnessSource.js` does for the same funnel and for the same
 * reason. The reservation stays UNCLAIMED: STEP 2's roster is still empty and no door
 * exception was added for this file.
 *
 * ⭐ AND THE DEFERRAL COSTS NO PRODUCT TODAY, which is why it was preferred to claiming
 * the door. The funnel is absent from this tree, so a lesson cannot land through ANY
 * route at this tip — calling it, claiming the door, or building one would each ship
 * exactly what deferring ships: nothing taught, marks and leans and grievances landing
 * as before. Deferring was chosen because it is the option that ships the same product
 * without claiming a reserved door, NOT because it is cheaper.
 *
 * The successor is FUNDED: a real funnel door (a flag plus a supplier module) is its own
 * car, and it inherits `chanceMeetingLessonEntries` and the season cap below UNCHANGED.
 *
 * @enforced-by tests/domain/envoyChanceMeetingStage.test.js
 * @enforced-by tests/property/chanceEncountersDormancyFence.test.js
 */
import { tickStreamSeedOf } from '../advanceEpochLedger.js';
import { npcCorruptibleFlaw } from '../corruption.js';
import { importanceWeight } from '../entities/npcs.js';
import { driftTaughtWithin, positionValue } from '../npc/characterConsumers.js';
import { npcTraitPlane } from './clergyTraitPlane.js';
import { corruptionWebActive } from './corruptionWeb.js';
import {
  CHANCE_MEETING_TUNING,
  resolveChanceMeeting,
  selectChanceMeetings,
} from './envoyChanceMeeting.js';
import {
  applyMeetingLeanLedger,
  applyMeetingMarkLedger,
  meetingLeanKey,
  meetingMarkKey,
} from './envoyChanceMeetingLedger.js';
import { rosterPersonAvailable, rosterPersonById } from './envoyCasting.js';
import { previewEnvoyPosition } from './envoyErrandProjection.js';
import { overdueForeignNotables } from './espionage/espionageWariness.js';
import { npcId } from './npcAgency.js';
import { npcLadderActive } from './npcLadderKernel.js';
import { GRUDGE_KINDS } from './npcLadderState.js';
import { traitsOf } from './npcLadderGoals.js';
import { applyRelationshipPatch, memoryWeaveActive } from './relationshipEvolution.js';
import { relationshipKeyFromEdge } from './relationshipState.js';
import { settlementAlignment } from './settlementAlignment.js';
import { relationshipTypeBetweenIdx } from './tickIndices.js';

/**
 * THE STAGE'S OWN TUNING — the one dial the leaf deliberately left with its writer.
 * ENC-1's `CHANCE_MEETING_TUNING_PROVENANCE` names it in so many words: "the exposure
 * grievance magnitude, which lives with its writer in ENC-3". Every row a DRAFT,
 * `signedBy: null`, OWNER ROW §12 row 7, signed LAST at the tuning sitting.
 */
export const CHANCE_MEETING_STAGE_TUNING_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (§12 row 7; enrolled in TUNEREG at its landing)',
  signedBy: null,
  ownerRows: Object.freeze([
    'the exposure grievance magnitude, half the web\'s own EXPOSURE_GRIEVANCE_W because an approach is smaller than a discovered leash',
    'the doubling of that grievance when the approacher wore a covert face',
    'the residents floor, which is the estate\'s own notable line rather than a number this lane chose',
  ]),
});

/** The values themselves. No `@type` widening: see the leaf's own note — an annotation
 *  of `Record<string, unknown>` erases every leaf's number at every arithmetic site. */
export const CHANCE_MEETING_STAGE_TUNING = Object.freeze({
  /** the resentment an exposed approach puts on the two courts' edge */
  exposureGrievance: 0.25,
  /** a covert approacher's exposure costs double */
  exposureCovertMultiplier: 2,
  /** notable and above — the SAME floor diplomatic casting and rung eligibility use */
  residentImportanceFloor: 0.4,
});

/** The lived-experience kind a meeting teaches. Spelled ONCE, here, beside the adapter
 *  the out-of-leaf map names — `livedExperienceSources.ADAPTER_HOMED_ELSEWHERE` resolves
 *  this module AND this literal against the live tree. */
export const CHANCE_MEETING_EXPERIENCE_KIND = 'met_a_foreigner';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {unknown[]} */
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number} */
function num(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/**
 * ⛔ THE ONE GATE READ IN THIS ESTATE. By-name, strict `=== true`, at exactly one site —
 * the polarity census (FENCE 4) counts it and reds on a second reader or on any loose
 * truthiness. Absent from `DEFAULT_SIMULATION_RULES` and from every preset spread, so
 * the key is false everywhere by ABSENCE until the lighting wave declares its shift.
 * @param {unknown} worldState @returns {boolean}
 */
export function chanceEncountersActive(worldState) {
  return asObject(asObject(worldState).simulationRules).chanceEncountersEnabled === true;
}

/**
 * THE DROP PASS, ABOVE EVERY FLAG. Called by `envoyPulse.js` as the pulse's FIRST act —
 * above its own `envoyDiplomacyActive` early return — and again by the stage below, which
 * is safe because it is idempotent: the prior is read from the state handed in, so a
 * second call on an already-dropped state finds nothing and reports `changed: false`.
 *
 * A never-lit world has no prior and this is byte-identical. See the header for why it
 * may not live behind either gate.
 * @param {{worldState?: unknown, tick?: unknown}} [args]
 * @returns {{worldState: Record<string, unknown>, changed: boolean}}
 */
export function dropStaleMeetingLedgers({ worldState, tick } = {}) {
  const prior = asObject(worldState);
  const mark = applyMeetingMarkLedger(prior, prior, {});
  const lean = applyMeetingLeanLedger(prior, asObject(mark.worldState), {
    writes: {},
    tick: num(tick),
    ttlTicks: num(CHANCE_MEETING_TUNING.leanTtlTicks),
  });
  return {
    worldState: asObject(lean.worldState),
    changed: mark.changed === true || lean.changed === true,
  };
}

/**
 * THE ADAPTER, named by `livedExperienceSources.ADAPTER_HOMED_ELSEWHERE` and resolved
 * against this file by symbol. One entry per SUBJECT of one receipt; the funnel dedupes,
 * decays and refuses on its own terms and this hands it nothing but typed words.
 *
 * `pulls` is the receipt's own drift vector — the `vectorSupplied` arm ENC-2 opened, and
 * the reason `met_a_foreigner` is not an ambient row: an ambient kind divides its quantum
 * by a season and a one-week meeting can never cross that floor.
 * @param {{receipt?: unknown, subjectOf?: ((nid: string) => ({settlementId: string,
 *   settlementSeed: string, npc: Record<string, unknown>}|null))}} [args]
 * @returns {ReadonlyArray<Record<string, unknown>>}
 */
export function chanceMeetingLessonEntries({ receipt, subjectOf } = {}) {
  const row = asObject(receipt);
  const eventId = text(row.id);
  if (!eventId || typeof subjectOf !== 'function') return Object.freeze([]);
  /** @type {Map<string, Record<string, unknown>[]>} */
  const bySubject = new Map();
  for (const raw of asArray(row.drift)) {
    const pull = asObject(raw);
    const nid = text(pull.subjectNid);
    if (!nid) continue;
    const list = bySubject.get(nid) || [];
    list.push({ axisId: text(pull.axisId), pole: text(pull.pole), band: text(pull.band) });
    bySubject.set(nid, list);
  }
  /** @type {Record<string, unknown>[]} */
  const entries = [];
  for (const nid of [...bySubject.keys()].sort()) {
    const subject = subjectOf(nid);
    if (!subject) continue;
    entries.push({
      kind: CHANCE_MEETING_EXPERIENCE_KIND,
      settlementId: subject.settlementId,
      settlementSeed: subject.settlementSeed,
      npc: subject.npc,
      eventId,
      pulls: Object.freeze(bySubject.get(nid) || []),
    });
  }
  return Object.freeze(entries);
}

/** The two courts' edge, BANDED into the three words the leaf speaks. A banding OF
 *  `relationshipType`, never a rename of the posture vocabulary.
 *  @param {string} relationshipType @returns {string} */
function postureBandOf(relationshipType) {
  const word = text(relationshipType).toLowerCase();
  if (['allied', 'patron', 'client', 'vassal', 'trade_partner'].includes(word)) return 'friendly';
  if (['hostile', 'cold_war', 'rival'].includes(word)) return 'hostile';
  return 'neutral';
}

/** The regional edge for an ordered pair, the `envoyInterceptionStage.js:120` idiom.
 *  @param {unknown} regionalGraph @param {string} left @param {string} right
 *  @returns {Record<string, unknown>|null} */
function edgeForPair(regionalGraph, left, right) {
  for (const raw of asArray(asObject(regionalGraph).edges)) {
    const edge = asObject(raw);
    const a = text(edge.a || edge.from || edge.source);
    const b = text(edge.b || edge.to || edge.target);
    if ((a === left && b === right) || (a === right && b === left)) return edge;
  }
  return null;
}

/** The snapshot row for a settlement id, and the settlement inside it.
 *  @param {unknown} snapshot @param {string} sid
 *  @returns {{item: Record<string, unknown>, settlement: Record<string, unknown>}|null} */
function placeOf(snapshot, sid) {
  const byId = asObject(snapshot).byId;
  const item = asObject(byId instanceof Map ? byId.get(sid) : undefined);
  if (!Object.keys(item).length) return null;
  const settlement = asObject(item.settlement || asObject(item.save).settlement || item);
  if (!Object.keys(settlement).length) return null;
  return { item, settlement };
}

/**
 * THE TRAVELLER PROJECTION. Every row comes off the pulse's own pre-mutation cut through
 * `previewEnvoyPosition`, and the arrival tick is READ off the row's own leg — never
 * computed, which is what keeps this file outside `namedPersonTransitTotality`'s leg
 * arithmetic. A row whose state changed this tick is dropped by the caller.
 * @param {{startErrands?: unknown, snapshot?: unknown, worldState?: unknown, tick?: unknown}} args
 * @returns {Record<string, unknown>[]}
 */
function projectTravellers({ startErrands, snapshot, worldState, tick }) {
  /** @type {Record<string, unknown>[]} */
  const rows = [];
  for (const raw of asArray(startErrands)) {
    const errand = asObject(raw);
    const preview = previewEnvoyPosition(errand, tick);
    if (!preview) continue;
    const positionRef = asObject(preview.positionRef);
    if (text(positionRef.progressBand) !== 'arrived') continue;
    const homeSid = text(errand.from);
    const nodeId = text(preview.nodeId);
    if (!homeSid || !nodeId || nodeId === homeSid) continue;
    const journey = text(preview.journey);
    const leg = asObject(asArray(errand.legs)
      .map(asObject)
      .filter((row) => text(row.journey) === journey)[Number(positionRef.legIndex)]);
    const place = placeOf(snapshot, homeSid);
    if (!place) continue;
    const person = rosterPersonById(worldState, homeSid, place.settlement, errand.npcId);
    if (!person) continue;
    const index = asArray(place.settlement.npcs).indexOf(person);
    rows.push({
      errandId: text(errand.id),
      nid: npcId(homeSid, person, index),
      homeSid,
      nodeId,
      journey,
      // ⛔⛔ `band` IS A REQUIRED FIELD OF THE TRAVELLER CONTRACT, AND OMITTING IT MADE THE
      // WHOLE MECHANISM DEAD WHEN LIT. `normalizeTraveller` in the leaf refuses any row whose
      // `band` is not exactly 'arrived' (envoyChanceMeeting.js:530), and the leaf's own suite
      // pins that refusal with a `band: 'underway'` case. This projection filtered on
      // `progressBand === 'arrived'` above and then DID NOT CARRY THE WORD FORWARD, so every
      // traveller it produced was rejected by the census and `censusChanceMeetingCandidates`
      // returned zero for every world. Not one chance meeting could ever occur.
      //
      // ⭐ NO TEST SAW IT because there was no flag-ON lit test at all — the gap the
      // `mechanismLitCoverage` ratchet convicted. Measured both directions before this line
      // was written: the same fixture yields 0 candidates without `band` and 1 with it.
      // The real word is passed rather than the literal 'arrived', so a future widening of
      // the accepted bands cannot silently re-diverge the filter from the payload.
      band: text(positionRef.progressBand),
      arrivalTick: num(leg.arrivalTick),
      nodeKind: placeOf(snapshot, nodeId) ? 'settlement' : 'route_node',
      covert: Object.keys(asObject(errand.covert)).length > 0 || errand.covert === true,
      npc: person,
      index,
    });
  }
  return rows;
}

/** The people a visitor could meet at a court: notable and above, on stage, available.
 *  @param {unknown} snapshot @param {string} nodeId @returns {Record<string, unknown>[]} */
function residentsAtNode(snapshot, nodeId) {
  const place = placeOf(snapshot, nodeId);
  if (!place) return [];
  /** @type {Record<string, unknown>[]} */
  const out = [];
  const roster = asArray(place.settlement.npcs);
  for (let index = 0; index < roster.length; index += 1) {
    const npc = asObject(roster[index]);
    const weight = importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (
      /** @type {unknown} */ (npc)));
    if (num(weight) < num(CHANCE_MEETING_STAGE_TUNING.residentImportanceFloor)) continue;
    if (!rosterPersonAvailable(npc)) continue;
    out.push({ residentNid: npcId(nodeId, npc, index), index, npc });
  }
  return out;
}

/** One party's reads, in the shape `resolveChanceMeeting` declares.
 *  @param {Record<string, unknown>} person @param {Record<string, unknown>} worldState
 *  @param {string} nid @param {string} homeSid @param {boolean} covert @param {boolean} ladderLit
 *  @returns {Record<string, unknown>} */
function partyReads(person, worldState, nid, homeSid, covert, ladderLit) {
  const npcStates = asObject(asObject(worldState).npcStates);
  const state = asObject(npcStates[nid]);
  return {
    nid,
    homeSid,
    covert,
    clean: state.corruption !== true,
    corruptible: npcCorruptibleFlaw(/** @type {Parameters<typeof npcCorruptibleFlaw>[0]} */ (
      /** @type {unknown} */ (person))) != null,
    // The kernel MINTS AN ORPHAN standing record for a marked person who holds no rung
    // (ENC-2, owner row 4), so every addressable person has a home for a mark while the
    // ladder is lit. Dark ⇒ no record can be minted and the leaf receipts the refusal.
    hasRecord: ladderLit && !!nid,
    words: traitsOf(person),
    truePlane: npcTraitPlane(/** @type {Parameters<typeof npcTraitPlane>[0]} */ (
      /** @type {unknown} */ (person)), null),
  };
}

/**
 * THE STAGE. Mounted inside `advanceEnvoyDiplomacyPulse` after stage (4) and before the
 * advance, on the SAME pre-mutation cut the army stages read (K3), so an errand the army
 * census already moved is never also met on.
 *
 * @param {{worldState?: unknown, snapshot?: unknown, regionalGraph?: unknown,
 *   startErrands?: unknown, errands?: unknown, tick?: unknown,
 *   heraldEntryFor?: ((seed: Record<string, unknown>) => unknown)|null}} [args]
 * @returns {{worldState: Record<string, unknown>, receipts: ReadonlyArray<Record<string, unknown>>,
 *   driftRefusals: ReadonlyArray<Record<string, unknown>>,
 *   heraldSeeds: ReadonlyArray<Record<string, unknown>>}}
 */
export function advanceChanceMeetings({
  worldState, snapshot, regionalGraph, startErrands, errands, tick, heraldEntryFor = null,
} = {}) {
  // FIRST ACT, ABOVE THE FLAG: the one-tick ledger's drop pass and the lean TTL.
  const dropped = dropStaleMeetingLedgers({ worldState, tick });
  let state = dropped.worldState;
  if (!chanceEncountersActive(state)) {
    return {
      worldState: state,
      receipts: Object.freeze([]),
      driftRefusals: Object.freeze([]),
      heraldSeeds: Object.freeze([]),
    };
  }

  const seed = tickStreamSeedOf(state, { base: text(asObject(state).rngSeed) });
  const travellers = projectTravellers({ startErrands, snapshot, worldState: state, tick });
  const meetings = selectChanceMeetings({
    travellers,
    residentsAt: (/** @type {string} */ nodeId) => residentsAtNode(snapshot, nodeId),
    tick,
    seed,
  });
  if (!meetings.length) {
    return {
      worldState: state,
      receipts: Object.freeze([]),
      driftRefusals: Object.freeze([]),
      heraldSeeds: Object.freeze([]),
    };
  }

  const ladderLit = npcLadderActive(state);
  const weaveLit = memoryWeaveActive(state);
  const webLit = corruptionWebActive(state);
  const byNid = new Map(travellers.map((row) => [text(row.nid), row]));

  /** @type {Record<string, unknown>[]} */
  const receipts = [];
  /** @type {Record<string, unknown>} */
  const markWrites = {};
  /** @type {Record<string, unknown>} */
  const leanWrites = {};
  /** @type {Record<string, unknown>[]} */
  const lessons = [];
  /** @type {Set<string>} */
  const taughtThisPass = new Set();
  // ⭐ THE ADDRESS NAMES, GATHERED ON THIS SAME PRE-MUTATION CUT. The seam's contract below has
  // always said the seed carries "both courts, both names"; until ENC-4 measured it the seed
  // carried only IDS, and a consumer would have had to round-trip a nid back through a roster
  // reader that spells ids differently (`envoyCasting.js#rosterPersonById` matches a durable H1
  // id or a bare roster id, never `npcAgency.js#npcId`'s `sid:rosterId` composite). Reading the
  // names HERE, off the seats the census already resolved, removes that round-trip and its
  // spelling hazard outright. ⛔ NAMES ARE ADDRESS, NOT PROSE: no kind, no significance and no
  // sentence is minted here, which is the seam ruling this file records below.
  /** @type {Map<string, string>} */
  const npcNameByNid = new Map();
  /** @type {Map<string, string>} */
  const placeNameBySid = new Map();

  for (const raw of meetings) {
    const meeting = asObject(raw);
    const parties = asArray(meeting.parties).map(asObject);
    if (parties.length !== 2) continue;
    const seats = parties.map((party) => seatOf(party, snapshot, byNid));
    if (seats.some((seat) => seat === null)) continue;
    const [left, right] = /** @type {Record<string, unknown>[]} */ (seats);
    const hostSid = text(meeting.nodeId);
    const courts = courtsFor(snapshot, state, [text(left.homeSid), text(right.homeSid), hostSid]);
    const posture = postureBandOf(relationshipTypeBetweenIdx(
      /** @type {Parameters<typeof relationshipTypeBetweenIdx>[0]} */ (asObject(regionalGraph)),
      state, text(left.homeSid), text(right.homeSid),
    ));
    const receipt = resolveChanceMeeting({
      meetingKey: meeting.meetingKey,
      kind: meeting.kind,
      venue: meeting.venue,
      nodeId: hostSid,
      tick,
      seed,
      a: partyReads(asObject(left.npc), state, text(left.nid), text(left.homeSid),
        left.covert === true, ladderLit),
      b: partyReads(asObject(right.npc), state, text(right.nid), text(right.homeSid),
        right.covert === true, ladderLit),
      courts,
      posture,
      wariness: warinessAt(errands ?? startErrands, hostSid, tick),
      pickRoll: meeting.pickRoll,
      positionValue,
    });
    receipts.push(receipt);
    for (const seat of [left, right]) {
      npcNameByNid.set(text(seat.nid), text(asObject(seat.npc).name));
    }
    for (const sid of [text(left.homeSid), text(right.homeSid), hostSid]) {
      if (!sid || placeNameBySid.has(sid)) continue;
      const place = placeOf(snapshot, sid);
      placeNameBySid.set(sid, place ? text(asObject(place.settlement).name) : '');
    }
    collectDeposits({
      receipt, left, right, markWrites, leanWrites, weaveLit, webLit, ladderLit, tick,
    });
    collectLessons({ receipt, seats: [left, right], worldState: state, taughtThisPass, lessons, tick });
  }

  state = depositLedgers({ state, markWrites, leanWrites, tick, dropped: dropped.worldState });
  const taught = deferLessons(state, lessons, receipts);
  state = fileGrievances(taught.worldState, receipts, regionalGraph, tick);
  return {
    worldState: state,
    receipts: Object.freeze(receipts),
    driftRefusals: taught.driftRefusals,
    heraldSeeds: heraldSeedsOf(receipts, heraldEntryFor, { npcNameByNid, placeNameBySid }),
  };
}

/**
 * ⛔⛔ WHO APPROACHED WHOM, AND IT IS **NOT** WHAT PARTY ORDER OR TRAVELLER-NESS SAYS.
 *
 * ENC-4b's brief and the R1 ruling both derived this as "the traveller approaches the resident's
 * venue". MEASURED AT THE DOCK, over 4000 real `resolveChanceMeeting` calls per arm: THAT IS
 * FALSE. `envoyChanceMeeting.js` picks the direction by the COMPROMISE CHANCE ON THE TARGET
 * (`directions.sort((x, y) => (y.chance - x.chance) || codepoint(...))`), and `compromiseChance`
 * reads the TARGET's corruptibility and ambition — never which party travelled. With the
 * traveller as the softer target the RESIDENT led 23 of 23 exposed receipts; with the resident as
 * the softer target the TRAVELLER led 23 of 23. Assigning `{npc}` (who offered) from party role
 * would have named the refuser as the offerer on one of those two arms — the wrong-ROLE defect
 * the whole R1 ruling exists to prevent.
 *
 * ⭐ THE RECEIPT ALREADY CARRIES THE ANSWER, and the exposed branch is the branch that writes it:
 * `receipt.grievance = { fromSid: lead.target.homeSid, toSid: lead.approacher.homeSid }`. A home
 * settlement id names a PERSON here because the two parties' homes can never coincide, and that
 * is guaranteed three times over at the census rather than hoped for:
 *
 *   • a traveller is never at his own home  — `projectTravellers`: `if (… nodeId === homeSid) continue;`
 *   • the resident's home IS the host node  — `envoyChanceMeeting.js` rule 4: `homeSid: nodeId`
 *   • two travellers never share a home     — rule 5: `if (a.homeSid === b.homeSid) continue;`
 *
 * ⛔ IT IS STILL RESTRICTED TO `traveller_resident`, ON THE RULING'S FENCE. The third guarantee
 * means the derivation would answer for `traveller_traveller` too — that is a MEASURED finding
 * back to the chair, because the ruling's stated reason for excluding that kind ("symmetric", not
 * determinable) is wrong. The exclusion itself stands on the annex's own PROSE ground, which is
 * the chair's to rule: §B's variant 1 says "{counterpart} of {settlement}", and in a
 * traveller x traveller meeting neither party is of the host town.
 *
 * ⛔ THE EMPTY STRING, NEVER AN ABSENT KEY — the seam's own recorded posture for an unresolved
 * address limb, so a consumer that fails closed on a hole sees the hole instead of guessing.
 *
 * @param {Record<string, unknown>} receipt @param {Record<string, unknown>[]} parties
 * @returns {string}
 */
function approacherNidOf(receipt, parties) {
  if (text(receipt.kind) !== 'traveller_resident') return '';
  const toSid = text(asObject(receipt.grievance).toSid);
  if (!toSid) return '';
  const approachers = parties.filter((party) => text(party.homeSid) === toSid);
  // Exactly one, or nothing: a sid that names both parties names neither, and a guess here is
  // the defect this whole function exists to refuse.
  return approachers.length === 1 ? text(approachers[0].nid) : '';
}

/**
 * ⛔ THE HERALD SEAM, AND IT IS DELIBERATELY A SEAM RATHER THAN A MINT.
 *
 * A visible outcome becomes ONE typed seed carrying the NEWS ADDRESS LAW's whole chain —
 * both courts, both names, the venue, a typed beat word and a reason handle — and NOT a
 * kind, NOT a significance and NOT a sentence. ENC-4 owns those: it exports a single
 * builder on the `faithReceipt(...)` model and this stage calls it once per seed through
 * `heraldEntryFor`. Absent a builder the seeds are returned unbuilt and NOTHING is minted,
 * which is the state this car lands in.
 *
 * ⚠ THE BEAT WORDS ARE NOT THE KIND NAMES, ON PURPOSE. `'chance_meeting'` is ALREADY a
 * live constant in this tree — `corruptionLeash.WILLED_MEETING_CONSPIRACY`, wired at
 * `corruptionWeb.js:831` and pinned by a landed test — and the receipt id already carries
 * it as a prefix. A third meaning for that one literal is a conviction risk under the
 * §886 constant-resolving walker, so this file mints NEITHER Herald kind literal. The
 * mapping `meeting → chance_meeting` and `approach_exposed → chance_meeting_exposed`
 * (the owner's spelling, ODQ §882.13) lives in ENC-4 beside the pools.
 *
 * ⚠ AND THE `appendWizardNewsEntries` CALL IS NOT PLACED HERE OR IN `envoyPulse.js`.
 * MEASURED, not assumed: `wizardNewsAuthoring.walker.test.js:148` pins
 * `candidateSites.length === sites.length + 1` EXACTLY, so a mint site whose entries come
 * from a variable rather than an inline governed literal breaks that relation the day it
 * lands. A mint that cannot fire is not worth redding an exact census for; ENC-4 places it
 * in the commit that gives it something to say.
 *
 * ⭐ THE APPROACH DIRECTION IS ADDRESS TOO, AND IT IS CARRIED ONLY WHERE THE RECEIPT KNOWS IT.
 * `approacherNid` names the party who made the offer, for the `traveller_resident` kind alone and
 * only on a receipt whose exposure branch recorded a direction; everywhere else it is the EMPTY
 * STRING. It is DERIVED FROM THE RECEIPT, never from party order — see `approacherNidOf`, which
 * carries the measurement that refuted the obvious rule.
 *
 * ⭐ THE NAMES ARE PART OF THE ADDRESS AND THEY ARRIVE HERE RESOLVED. `npcNames` is parallel to
 * `npcIds`; `settlementNames` is keyed by settlement id and covers the host and both courts. A
 * name that could not be resolved is the EMPTY STRING rather than an absent key, so a consumer
 * that fails closed on a hole (ENC-4's builder does) sees the hole instead of guessing.
 *
 * @param {Record<string, unknown>[]} receipts
 * @param {((seed: Record<string, unknown>) => unknown)|null} heraldEntryFor
 * @param {{npcNameByNid?: Map<string, string>, placeNameBySid?: Map<string, string>}} [names]
 * @returns {ReadonlyArray<Record<string, unknown>>}
 */
function heraldSeedsOf(receipts, heraldEntryFor, names = {}) {
  const npcNameByNid = names.npcNameByNid instanceof Map ? names.npcNameByNid : new Map();
  const placeNameBySid = names.placeNameBySid instanceof Map ? names.placeNameBySid : new Map();
  /** @type {Record<string, unknown>[]} */
  const seeds = [];
  for (const raw of receipts) {
    const receipt = asObject(raw);
    const outcome = text(receipt.outcome);
    const beat = outcome === 'exposed' ? 'approach_exposed'
      : ['bond', 'respect', 'rivalry'].includes(outcome) ? 'meeting'
        : '';
    // `nothing`, `compromised` and `rejected` mint NO line: a compromise is a secret, a
    // refusal nobody spoke of is not news, and the equilibrium band is not an event.
    if (!beat) continue;
    const parties = asArray(receipt.parties).map(asObject);
    const seed = {
      beat,
      id: text(receipt.id),
      tick: num(receipt.tick),
      outcome,
      venue: text(receipt.venue),
      settlementIds: Object.freeze(parties.map((party) => text(party.homeSid))),
      npcIds: Object.freeze(parties.map((party) => text(party.nid))),
      venueIds: Object.freeze(text(receipt.venue) === 'field_node' ? [text(receipt.nodeId)] : []),
      hostId: text(receipt.nodeId),
      approacherNid: approacherNidOf(receipt, parties),
      npcNames: Object.freeze(parties.map((party) => npcNameByNid.get(text(party.nid)) || '')),
      settlementNames: Object.freeze(Object.fromEntries(
        [...new Set([text(receipt.nodeId), ...parties.map((party) => text(party.homeSid))])]
          .filter(Boolean)
          .map((sid) => [sid, placeNameBySid.get(sid) || '']),
      )),
    };
    seeds.push(typeof heraldEntryFor === 'function'
      ? { ...seed, entry: heraldEntryFor(seed) }
      : seed);
  }
  return Object.freeze(seeds);
}

/** Re-find a selected party's roster record and settlement seat.
 *  @param {Record<string, unknown>} party @param {unknown} snapshot
 *  @param {Map<string, Record<string, unknown>>} byNid
 *  @returns {Record<string, unknown>|null} */
function seatOf(party, snapshot, byNid) {
  const nid = text(party.nid);
  const homeSid = text(party.homeSid);
  if (!nid || !homeSid) return null;
  if (party.resident !== true) {
    const traveller = byNid.get(nid);
    if (!traveller) return null;
    return {
      nid, homeSid, npc: traveller.npc, index: traveller.index, covert: traveller.covert === true,
    };
  }
  const place = placeOf(snapshot, homeSid);
  if (!place) return null;
  const roster = asArray(place.settlement.npcs);
  const index = Number(party.index);
  const npc = asObject(roster[index]);
  if (!Object.keys(npc).length) return null;
  return { nid, homeSid, npc, index, covert: false };
}

/** Each named court's character at large, keyed by settlement id.
 *  @param {unknown} snapshot @param {Record<string, unknown>} worldState
 *  @param {string[]} sids @returns {Record<string, unknown>} */
function courtsFor(snapshot, worldState, sids) {
  /** @type {Record<string, unknown>} */
  const courts = {};
  for (const sid of [...new Set(sids)].filter(Boolean).sort()) {
    const place = placeOf(snapshot, sid);
    if (!place) continue;
    courts[sid] = settlementAlignment(
      /** @type {Parameters<typeof settlementAlignment>[0]} */ (
        /** @type {unknown} */ (place.item)),
      /** @type {Parameters<typeof settlementAlignment>[1]} */ (
        /** @type {unknown} */ (worldState)),
    );
  }
  return courts;
}

/** The host's own wariness read — the term the espionage gauntlet already takes, so no
 *  second wariness law is minted here.
 *  @param {unknown} errands @param {string} hostSid @param {unknown} tick @returns {number} */
function warinessAt(errands, hostSid, tick) {
  const read = overdueForeignNotables({
    errands: asArray(errands), observerId: hostSid, clusterIds: [], tick,
  });
  return num(asObject(read).count);
}

/** Turn one receipt into deposit rows. Each ledger is written ONLY while its own
 *  CONSUMER's flag is lit — the deposit is the gate, so a dark consumer means no key.
 *  @param {{receipt: Record<string, unknown>, left: Record<string, unknown>,
 *    right: Record<string, unknown>, markWrites: Record<string, unknown>,
 *    leanWrites: Record<string, unknown>, weaveLit: boolean, webLit: boolean,
 *    ladderLit: boolean, tick: unknown}} args */
function collectDeposits({
  receipt, left, right, markWrites, leanWrites, weaveLit, webLit, ladderLit, tick,
}) {
  const mark = asObject(receipt.mark);
  const depositTick = num(tick);
  if (weaveLit && ladderLit && Object.keys(mark).length) {
    const holderNid = text(mark.holderNid);
    const otherNid = text(mark.otherNid);
    const holder = text(left.nid) === holderNid ? left : right;
    const other = text(left.nid) === holderNid ? right : left;
    // ⛔ THE GRAIN IS CHOSEN BY THE KIND, NEVER HARDCODED. The leaf emits five mark
    // kinds and `rivalry` is the one that is not a tie at all. While this read said
    // `mark: 'bond'` unconditionally, a rivalry travelled the BOND road and the
    // ladder's `mintBond` coerced its unknown kind to `friendship` — so the single
    // outcome that means "these two took against each other" was persisted as the
    // outcome that means the opposite. Grained here, a rivalry lands under `grudge`,
    // which `applyMeetingMark` already declines to fold, so it is INERT rather than
    // inverted. ENC-5 lifts that fold; nothing here mints a grudge.
    const grain = GRUDGE_KINDS.has(text(mark.kind)) ? 'grudge' : 'bond';
    const row = {
      mark: grain,
      otherNid,
      foreignSid: text(other.homeSid),
      kind: text(mark.kind),
      sev: text(mark.sev),
      depositTick,
    };
    markWrites[meetingMarkKey(text(holder.homeSid), holderNid)] = row;
    // A MUTUAL mark is two rows, one per party's own home record; a COMPROMISE's
    // `loyalty` tie runs one way only (§5.4), from the person who was won over toward
    // the man who won him, so it is never mirrored.
    if (text(receipt.outcome) !== 'compromised') {
      markWrites[meetingMarkKey(text(other.homeSid), otherNid)] = {
        ...row, otherNid: holderNid, foreignSid: text(holder.homeSid),
      };
    }
  }
  const lean = asObject(receipt.lean);
  if (webLit && Object.keys(lean).length) {
    const patronSid = text(lean.patronSid);
    const targetSid = text(lean.targetSid);
    const targetNid = text(lean.targetNid);
    leanWrites[meetingLeanKey(patronSid, targetSid, targetNid)] = {
      patronId: patronSid,
      targetId: targetSid,
      npcKey: targetNid,
      depositTick,
      band: text(lean.band),
      willed: true,
    };
  }
}

/** The season cap (⟦A9⟧/J36): a subject takes at most ONE meeting lesson per season, and
 *  the clock is the drift map's own `updatedTick` — no new state. Refused BEFORE the
 *  funnel, so `FUNNEL_REFUSALS` is never widened for a refusal this layer can make.
 *  @param {{receipt: Record<string, unknown>, seats: Record<string, unknown>[],
 *    worldState: Record<string, unknown>, taughtThisPass: Set<string>,
 *    lessons: Record<string, unknown>[], tick: unknown}} args */
function collectLessons({ receipt, seats, worldState, taughtThisPass, lessons, tick }) {
  const cadence = num(CHANCE_MEETING_TUNING.lessonCadenceTicks);
  const now = num(tick);
  const byNid = new Map(seats.map((seat) => [text(seat.nid), seat]));
  const entries = chanceMeetingLessonEntries({
    receipt,
    subjectOf: (nid) => {
      const seat = byNid.get(nid);
      if (!seat) return null;
      if (taughtThisPass.has(nid)) return null;
      if (driftTaughtWithin({ worldState, wnpcId: nid, now, within: cadence })) return null;
      taughtThisPass.add(nid);
      return {
        settlementId: text(seat.homeSid),
        settlementSeed: text(seat.homeSid),
        npc: asObject(seat.npc),
      };
    },
  });
  for (const entry of entries) lessons.push(asObject(entry));
}

/** Persist both deposit ledgers. The prior is the ALREADY-DROPPED state, so an empty
 *  write set is a no-op rather than a second drop.
 *  @param {{state: Record<string, unknown>, markWrites: Record<string, unknown>,
 *    leanWrites: Record<string, unknown>, tick: unknown,
 *    dropped: Record<string, unknown>}} args @returns {Record<string, unknown>} */
function depositLedgers({ state, markWrites, leanWrites, tick, dropped }) {
  let next = state;
  const marks = applyMeetingMarkLedger(
    dropped, next,
    /** @type {Parameters<typeof applyMeetingMarkLedger>[2]} */ (
      /** @type {unknown} */ (markWrites)),
  );
  next = asObject(marks.worldState);
  const leans = applyMeetingLeanLedger(dropped, next, {
    writes: /** @type {NonNullable<Parameters<typeof applyMeetingLeanLedger>[2]['writes']>} */ (
      /** @type {unknown} */ (leanWrites)),
    tick: num(tick),
    ttlTicks: num(CHANCE_MEETING_TUNING.leanTtlTicks),
  });
  return asObject(leans.worldState);
}

/**
 * Build every lesson's intake row and hand it to NOBODY — the deferred funnel door.
 *
 * ⛔⛔ DELIBERATELY DEFERRED — DOCUMENTED, NOT A BUG TO RE-FIND. ⟦A20⟧/§882.1 reserve
 * the lived-experience funnel's ONE production door for whichever train lands first, and
 * this lane's charter does not name it as the owner. An earlier draft called
 * `foldLivedExperience` from here; `characterDrift.test.js` STEP 2 convicts exactly that,
 * and the conviction was hidden behind STEP 1's red until §893. Ruled: DEFER.
 *
 * ⭐ WHAT IS DEFERRED IS THE HAND-OFF, NOT THE WORK. Every lesson is still SELECTED (the
 * per-subject season cap runs, through the drift family's own door) and still SHAPED (the
 * adapter below produces the funnel's intake row, which `livedExperienceSources.js`
 * already resolves BY NAME through `ADAPTER_HOMED_ELSEWHERE`). The successor car wires a
 * consumer to rows that already exist; it does not rebuild them.
 *
 * ⚠ AND NOTHING IS SILENT, which is the same standard the funnel call was held to. Each
 * affected receipt carries `drift_dormant` — an EXISTING member of ENC-1's CLOSED
 * `MEETING_REFUSALS`, chosen rather than minted because this lane may not widen that set,
 * and honest on its face: the drift plane really is dormant, there being no door onto it.
 * The `driftRefusals` channel names the deferral itself, so a reader can tell "the funnel
 * refused" from "the funnel was never asked".
 *
 * ⚠ THIS FUNCTION MOVES NO STATE, BY CONSTRUCTION. It returns `state` by reference. That
 * is what makes the dark-world byte-identity claim hold through the lit path too, and it
 * is why the successor's diff will be legible: today this returns its input.
 *
 * @param {Record<string, unknown>} state @param {Record<string, unknown>[]} lessons
 * @param {Record<string, unknown>[]} receipts
 * @returns {{worldState: Record<string, unknown>,
 *   driftRefusals: ReadonlyArray<Record<string, unknown>>}}
 */
function deferLessons(state, lessons, receipts) {
  if (!lessons.length) return { worldState: state, driftRefusals: Object.freeze([]) };
  /** @type {Record<string, unknown>[]} */
  const driftRefusals = [];
  for (const raw of lessons) {
    const eventId = text(asObject(raw).eventId);
    driftRefusals.push({ reason: 'funnel_door_deferred', eventId });
    for (const receipt of receipts) {
      if (text(asObject(receipt).id) !== eventId) continue;
      asArray(asObject(receipt).refusals).push({ arm: 'drift', word: 'drift_dormant' });
    }
  }
  return { worldState: state, driftRefusals: Object.freeze(driftRefusals) };
}

/** A refused-and-discovered approach is a grievance on the two courts' edge, written by
 *  the relationship plane's ONE writer and carrying its edge (the edge-carry walker's law).
 *  @param {Record<string, unknown>} state @param {Record<string, unknown>[]} receipts
 *  @param {unknown} regionalGraph @param {unknown} tick @returns {Record<string, unknown>} */
function fileGrievances(state, receipts, regionalGraph, tick) {
  let next = state;
  for (const receipt of receipts) {
    const grievance = asObject(asObject(receipt).grievance);
    if (!Object.keys(grievance).length) continue;
    const fromSid = text(grievance.fromSid);
    const toSid = text(grievance.toSid);
    const edge = edgeForPair(regionalGraph, fromSid, toSid);
    if (!edge) continue;
    const covert = asArray(asObject(receipt).parties)
      .map(asObject).some((party) => party.covert === true);
    const resentment = num(CHANCE_MEETING_STAGE_TUNING.exposureGrievance)
      * (covert ? num(CHANCE_MEETING_STAGE_TUNING.exposureCovertMultiplier) : 1);
    const applied = applyRelationshipPatch(next, {
      relationshipKey: relationshipKeyFromEdge(edge),
      relationshipPatch: { resentment },
      metadata: { incidentType: text(grievance.incidentType) },
      severity: resentment,
      id: text(asObject(receipt).id),
      proposalPayload: null,
    }, num(tick), /** @type {Parameters<typeof applyRelationshipPatch>[3]} */ (
      /** @type {unknown} */ (edge)));
    // ⚠ IT RETURNS THE WORLD, NOT AN ENVELOPE (`relationshipEvolution.js:490-491` returns
    // `worldState` itself on its refusal arms). Read at the tip; a `.worldState` unwrap
    // here would have silently produced `{}` on every refused patch.
    next = asObject(applied);
  }
  return next;
}
