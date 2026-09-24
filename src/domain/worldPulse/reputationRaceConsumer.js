/**
 * reputationRaceConsumer.js — FP IN-4, THE ROAD: the reputation race's FIRST consumer, one race
 * stage over the arrivals the existing ledgers already KEEP (docs/DESIGN_FP_ARCH_IN.md §4 IN-4,
 * NORMATIVE; docs/DESIGN_FP_INFORMATION.md §5 IN-4; the compiled block #20; the chair's ruling
 * FP-16 over the IN-4 STOP of 2026-09-24).
 *
 * WHAT IT DOES. `routeNetworkConsumersRace.js` has answered "who reaches the gate first, the
 * traveller or his story" since W-J slice J4, and nothing in the estate ever asked it. This leaf
 * asks it at every arrival a ledger already records, voices the answer through the INFORMATION
 * registry, and stores nothing: the race is an instantaneous READ at arrival (the volume's clock
 * line), so a stage that persisted a verdict would be a second copy of a fact the ledgers hold.
 *
 * ── THE ARRIVALS, AND THE ONE THE TREE DOES NOT KEEP ─────────────────────────────────────────
 * Read as RECORDS ON THE NEXT TICK (FP-16), never from inside the functions that stage them:
 *   army   — `spatial/armyTransit.js :: armyTransitLedger`, a record whose `arrivalTick` is last
 *            tick's. The person leg is the LEDGER'S timing (departTick to arrivalTick), never a
 *            re-walk: the march was priced by the war layer's own transit, and the race does not
 *            second-guess it. The story departs from the march's first seat (`path[0]`, which a
 *            retreat keeps even when it rewrites `originId` to home).
 *   envoy  — `envoyErrandRecords.js :: envoyErrandsOf`, a row that came HOME last tick. The
 *            person leg is the return journey (`returnStartedTick` to `homeTick`) from the
 *            parlay's venue (`returnOriginId`, else the target court).
 *   exile  — `npcLedger.js :: npcLedgerOf(...).placed`, a DM-assigned roamer placed at his new
 *            host last tick, joined to the assignment ruling that sent him
 *            (`npcRulingRegister.js :: npcRulingsOf`) for his departure seat and tick. The
 *            assignment is the ONE ruling that names a departure seat (its one writer,
 *            `npcDmVerbRecords.js :: assignmentNewsItem`, is the only spelling of the field), so
 *            the seat itself is the join. A placement with no dated assignment behind it was not
 *            a journey.
 * ⛔ REFUGEE COLUMNS ARE NOT READ, AND THE REASON IS MEASURED: `releaseMigrationArrivals` deletes
 * a landed column and returns `{ destId, count }` with the origins stripped, pulseKernel keeps
 * only its worldState, and the one record left is the destination's `populationHistory` row,
 * which names no origin. A race needs an origin; the column's lives only while it walks.
 *
 * ── THE TRIVIAL RACE IS SILENT (J-INF-5) ────────────────────────────────────────────────────
 * A beat mints only with a STORY IN FLIGHT: the traveller carries one (an exile whose notoriety
 * is above `unknown`; an envoy coming home with a verdict, terms or a refusal; a marching column
 * always) AND the telling can reach the gate over open road (`storyArrivalTicks(...).arrives`).
 * Otherwise the staged arrival is walked past without a word, and `neither` can never occur here
 * because every arrival read is a person who arrived.
 *
 * ── THE TRUTH THAT ARRIVED TOO LATE (the wave's jewel) ──────────────────────────────────────
 * An ENVOY is the one racer who bears a court-level telling. When his story beat him home and
 * his court ACTED on it before he arrived (a resolved decision of the home court, stamped by the
 * misjudgment detector as a misreading of the very court he parleyed with, dated from the
 * story's arrival up to the tick before his), the beat is `word_came_too_late` instead of
 * `race_story`. The act is READ from `pulseHistory` and never touched: the true account changes
 * nothing already acted on, which is the whole of the jewel.
 *
 * ── THE LISTENERS AT THE GATE ───────────────────────────────────────────────────────────────
 * The race's third term is the gate's own information houses, read through I2's presence gate
 * (`brokerageHouseRosterIn`, the settlement-taking reader, so no raw roster is read here) at the
 * channel the race module names, and ONLY while the brokerage layer's own gate
 * (`brokerageEffectsActive`) is open: a dark layer buys the story nothing, which is the race's
 * two-term reading on an ordinary world.
 *
 * ── THE RACER'S VOICE ───────────────────────────────────────────────────────────────────────
 * The annex authored the race pools for a PERSON ("He reached the gate before his story did"),
 * so every sentence speaking of a man declares the `person` context and a column racer draws only
 * the sentences honest of a column (informationNews.js's context axis, position six). A column
 * that outruns its own story therefore says nothing: no annex sentence voices it honestly.
 *
 * DORMANCY: `reputationRaceActive` is the ONE by-name strict read of `reputationRaceEnabled` in
 * the tree; dark, `advanceReputationRace` returns the SAME worldState reference, `changed: false`
 * and no news before any ledger is read. PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O,
 * no store, no mutation, no write of any kind.
 *
 * @enforced-by tests/domain/reputationRaceIn4.test.js,
 *   tests/lint/reputationRaceKindPools.walker.test.js
 */

import { brokerageChannelCompetence } from '../../data/informationBrokerageTuning.js';
import { compareCodepoint } from '../deterministicSort.js';
import { armyTransitLedger } from '../spatial/armyTransit.js';
import { admitsSignificance } from './bandFamilies.js';
import { brokerageEffectsActive, brokerageHouseRosterIn } from './brokerageStamps.js';
import { envoyErrandsOf } from './envoyErrandRecords.js';
import { informationReceipt } from './informationNews.js';
import { npcLedgerOf } from './npcLedger.js';
import { NOTORIETY_BANDS } from './npcLedgerFacets.js';
import { npcRulingsOf } from './npcRulingRegister.js';
import {
  RACE_OUTCOMES, ROUTE_RACE_TUNING, raceWinner, storyArrivalTicks,
} from './routeNetworkConsumersRace.js';
import { stablePart } from './stablePart.js';

/**
 * The race beat's weights, DRAFT in tests/lint/.tuning-register.json. Read off the siblings
 * rather than authored: the notable weight is the lure's public twin's (`belief_misjudgment`'s
 * material weight), the routine one the comings-and-goings weight a DM assignment carries.
 * The three GAP ceilings close TOO_LATE_GAP_BANDS in weeks: a gap within the first is `a week`,
 * within the second `weeks`, within the third `a season`, and beyond it `more than a season`.
 */
export const REPUTATION_RACE_TUNING = Object.freeze({
  NOTABLE_SEVERITY: 0.5,
  ROUTINE_SEVERITY: 0.3,
  GAP_A_WEEK_MAX: 1,
  GAP_WEEKS_MAX: 4,
  GAP_A_SEASON_MAX: 13,
});

/** The arrival kinds the ledgers keep, codepoint-sorted. @type {ReadonlyArray<string>} */
export const RACE_ARRIVAL_KINDS = Object.freeze(['army', 'envoy', 'exile']);

/** Who races: a named person, or a column no annex sentence names. @type {ReadonlyArray<string>} */
export const RACER_CONTEXTS = Object.freeze(['column', 'person']);

/** The one racer whose telling a court can act on too early (see the header). */
export const TOO_LATE_BEARERS = Object.freeze(['envoy']);

/** The jewel's kind: registered in informationNews.js with the race kinds. */
export const TOO_LATE_KIND = 'word_came_too_late';

/** How far behind the story the true account came, one word per band. @type {ReadonlyArray<string>} */
export const TOO_LATE_GAP_BANDS = Object.freeze(['a week', 'weeks', 'a season', 'more than a season']);

/**
 * THE ONE DOOR. Strict, by name, absent-is-dark, in one statement.
 * @param {unknown} worldState @returns {boolean}
 */
export function reputationRaceActive(worldState) {
  return asObject(asObject(worldState).simulationRules).reputationRaceEnabled === true;
}

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
}

/** @param {unknown} v @returns {number|null} a whole tick, or null */
function tickOf(v) {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 ? v : null;
}

/**
 * @typedef {Object} StagedArrival
 * @property {string} kind        a RACE_ARRIVAL_KINDS member
 * @property {string} id          the record's own id
 * @property {string} originId    where the traveller and his story set out
 * @property {string} gateId      where he arrived
 * @property {number} departTick
 * @property {number} arrivalTick
 * @property {boolean} told       the traveller carries a story at all
 * @property {string} racer       a RACER_CONTEXTS member
 * @property {string} npcName     the racer's own name, '' for a column
 * @property {string} counterpartId  the court the story is about (envoys: the parlay's court)
 */

/**
 * THE KEPT ARRIVALS DATED `arrivedTick`, in a stable order (kind, then the record's id).
 * @param {unknown} worldState @param {number} arrivedTick @returns {StagedArrival[]}
 */
export function stagedArrivals(worldState, arrivedTick) {
  /** @type {StagedArrival[]} */
  const out = [];
  /** @param {Omit<StagedArrival, 'kind'|'racer'|'npcName'|'counterpartId'> & Partial<StagedArrival>} row @param {string} kind */
  const add = (row, kind) => {
    if (!row.originId || !row.gateId || row.originId === row.gateId || !(row.departTick < row.arrivalTick)) return;
    out.push({
      racer: 'person', npcName: '', counterpartId: '', ...row, kind,
    });
  };
  const armies = armyTransitLedger(/** @type {Parameters<typeof armyTransitLedger>[0]} */ (worldState)) || {};
  for (const armyId of Object.keys(armies).sort(compareCodepoint)) {
    const rec = armies[armyId];
    if (rec.arrivalTick !== arrivedTick || rec.path.length < 2) continue;
    add({
      id: `${armyId}.${rec.departTick}`, originId: text(rec.path[0]), gateId: text(rec.destId),
      departTick: rec.departTick, arrivalTick: rec.arrivalTick, told: true, racer: 'column',
    }, 'army');
  }
  for (const row of envoyErrandsOf(worldState)) {
    const homeTick = tickOf(row.homeTick);
    const setOut = tickOf(row.returnStartedTick);
    if (text(row.state) !== 'home' || homeTick !== arrivedTick || setOut == null) continue;
    add({
      id: text(row.id), originId: text(row.returnOriginId) || text(row.to), gateId: text(row.from),
      departTick: setOut, arrivalTick: homeTick, told: row.termSheet != null || row.parlayRefusal != null,
      npcName: text(row.npcName), counterpartId: text(row.to),
    }, 'envoy');
  }
  const rulings = npcRulingsOf(/** @type {Parameters<typeof npcRulingsOf>[0]} */ (worldState));
  const { placed } = npcLedgerOf(/** @type {Parameters<typeof npcLedgerOf>[0]} */ (worldState));
  for (const wnpcId of Object.keys(placed).sort(compareCodepoint)) {
    const rec = placed[wnpcId];
    if (rec.sinceTick !== arrivedTick) continue;
    const sent = [...rulings].reverse().find((r) => text(r.departureSettlementId)
      && text(r.wnpcId) === wnpcId && text(r.targetSaveId) === rec.hostSettlementId
      && (tickOf(r.tick) ?? arrivedTick) < arrivedTick);
    if (!sent) continue;
    add({
      id: wnpcId, originId: text(sent.departureSettlementId), gateId: rec.hostSettlementId,
      departTick: Number(sent.tick), arrivalTick: rec.sinceTick,
      told: NOTORIETY_BANDS.indexOf(rec.reputation.notorietyBand) > 0, npcName: text(rec.identityFacets.name),
    }, 'exile');
  }
  return out;
}

/**
 * RUN THE RACE AT ONE STAGED ARRIVAL: the person leg is the record's own, the story leg the
 * cheapest telling over the lived network from the same seat and the same departure.
 * @param {unknown} worldState @param {StagedArrival} arrival @param {number} [listeners01]
 * @returns {{ winner: string, storyArrives: boolean, storyAt: number, personAt: number }}
 */
export function raceAtArrival(worldState, arrival, listeners01 = 0) {
  const story = storyArrivalTicks({
    worldState: asObject(worldState), originId: arrival.originId, gateId: arrival.gateId, listeners01,
  });
  const storyAt = arrival.departTick + story.ticks;
  const winner = raceWinner({
    personArrives: true, personTicks: arrival.arrivalTick, storyArrives: story.arrives, storyTicks: storyAt,
  });
  return { winner, storyArrives: story.arrives, storyAt, personAt: arrival.arrivalTick };
}

/**
 * THE ACT THE TRUE ACCOUNT CAME TOO LATE FOR: the home court's resolved decision, stamped by the
 * misjudgment detector as a misreading of the parlay's court, dated in [storyAt, personAt). The
 * earliest one, or null. Read, never written.
 * @param {unknown} worldState @param {StagedArrival} arrival @param {number} storyAt
 * @returns {{ tick: number, outcomeId: string }|null}
 */
export function actedOnTheStory(worldState, arrival, storyAt) {
  if (!TOO_LATE_BEARERS.includes(arrival.kind)) return null;
  const history = asObject(worldState).pulseHistory;
  for (const record of Array.isArray(history) ? history : []) {
    const tick = tickOf(asObject(record).tick);
    if (tick == null || tick < storyAt || tick >= arrival.arrivalTick) continue;
    const outcomes = asObject(record).selectedOutcomes;
    for (const outcome of Array.isArray(outcomes) ? outcomes : []) {
      const misjudgment = asObject(asObject(asObject(outcome).metadata).misjudgment);
      if (text(misjudgment.observerId) === arrival.gateId && text(misjudgment.subjectId) === arrival.counterpartId) {
        return { tick, outcomeId: text(asObject(outcome).id) };
      }
    }
  }
  return null;
}

/** @param {number} weeks @returns {string} a TOO_LATE_GAP_BANDS member */
export function tooLateGapBand(weeks) {
  const T = REPUTATION_RACE_TUNING;
  const ceilings = [T.GAP_A_WEEK_MAX, T.GAP_WEEKS_MAX, T.GAP_A_SEASON_MAX];
  const band = ceilings.findIndex((ceiling) => weeks <= ceiling);
  return TOO_LATE_GAP_BANDS[band < 0 ? ceilings.length : band];
}

/**
 * THE RACE BEATS for the arrivals dated last tick. Each carries the address chain: both seats
 * by id and name, the typed outcome, the reasons naming both tellings, the audience and the desk.
 * @param {{ worldState: unknown, tick: number, nameFor: (id: string) => string,
 *   listenersAt?: (id: string) => number }} args
 * @returns {Array<Record<string, unknown>>}
 */
export function reputationRaceEntries({ worldState, tick, nameFor, listenersAt = () => 0 }) {
  const now = Math.max(0, Math.floor(Number(tick) || 0));
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const arrival of stagedArrivals(worldState, now - 1)) {
    if (!arrival.told) continue;
    const race = raceAtArrival(worldState, arrival, listenersAt(arrival.gateId));
    if (!race.storyArrives || !RACE_OUTCOMES.includes(race.winner)) continue;
    const act = race.winner === 'story' ? actedOnTheStory(worldState, arrival, race.storyAt) : null;
    const kind = act ? TOO_LATE_KIND : `race_${race.winner}`;
    const gate = nameFor(arrival.gateId);
    const origin = nameFor(arrival.originId);
    const who = arrival.npcName || (arrival.racer === 'column' ? 'the column' : 'the traveller');
    const lead = who.charAt(0).toUpperCase() + who.slice(1);
    const receipt = informationReceipt(kind, `${arrival.kind}:${arrival.id}:${now}`, {
      settlement: gate, counterpart: origin, npc: arrival.npcName,
    }, arrival.racer);
    if (!receipt) continue;
    const reasons = [race.winner === 'person'
      ? `${lead} reached ${gate} before the word out of ${origin} did.`
      : race.winner === 'story'
        ? `The word out of ${origin} reached ${gate} before ${who} did.`
        : `${lead} and the word out of ${origin} reached ${gate} in the same week.`];
    if (act) {
      reasons.push(`The seat at ${gate} acted on the story before ${who} came home, and the true account came ${tooLateGapBand(race.personAt - race.storyAt)} behind it.`);
    }
    out.push({
      id: `wizard_news.${now}.${kind}.${stablePart(arrival.kind)}.${stablePart(arrival.id)}`,
      kind,
      impactKind: kind,
      significance: receipt.significance,
      severity: admitsSignificance(receipt.significance, 'notable')
        ? REPUTATION_RACE_TUNING.NOTABLE_SEVERITY : REPUTATION_RACE_TUNING.ROUTINE_SEVERITY,
      tick: now,
      scope: 'regional',
      headline: act ? `${gate} acted on the story before the truth came home` : reasons[0],
      summary: receipt.line,
      reasons,
      settlementIds: [arrival.gateId, arrival.originId],
      settlementNames: [gate, origin],
      familyId: receipt.familyId,
      audience: receipt.audience,
      section: receipt.section,
      ...(act ? { sourceEventId: act.outcomeId } : {}),
      tags: ['world_pulse', 'reputation_race', arrival.kind],
    });
  }
  return out;
}

/**
 * THE STAGE, mounted in the lifecycle host (settlementLifecycleKernel.js), own flag before the
 * host's gate. Returns the SAME worldState reference always: the stage writes nothing, and its
 * vote is true exactly when it has a beat for the pulse to keep.
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>, tick: number }} args
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, newsEntries: Array<Record<string, unknown>> }}
 */
export function advanceReputationRace({ snapshot, worldState, tick }) {
  if (!reputationRaceActive(worldState)) return { worldState, changed: false, newsEntries: [] };
  const items = asObject(snapshot).settlements;
  const housesHeard = brokerageEffectsActive(worldState);
  /** @type {Map<string, string>} */
  const names = new Map();
  /** @type {Map<string, number>} */
  const listeners = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    const row = asObject(item);
    const id = text(row.id);
    const name = text(asObject(row.settlement).name) || text(row.name);
    if (id && name) names.set(id, name);
    if (!id || !housesHeard) continue;
    const houses = brokerageHouseRosterIn(asObject(row.settlement));
    listeners.set(id, Math.max(0, ...houses.map((house) => brokerageChannelCompetence(
      house.legality, house.form, ROUTE_RACE_TUNING.LISTENER_CHANNEL))));
  }
  const newsEntries = reputationRaceEntries({
    worldState, tick, nameFor: (id) => names.get(id) || id, listenersAt: (id) => listeners.get(id) || 0,
  });
  return { worldState, changed: newsEntries.length > 0, newsEntries };
}
