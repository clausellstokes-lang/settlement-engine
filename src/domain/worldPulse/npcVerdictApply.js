/**
 * domain/worldPulse/npcVerdictApply.js — W-H2: INFLUENCE RELINQUISHMENT, THE CONTESTED
 * OPENING, THE EXCLUSION DOOR, AND THE VERDICT'S HERALD ITEM.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §4 influence relinquishment, §3c "every verdict
 * emits an address-chain Herald item with the receipt naming inputs", §3b the exclusion
 * edge; laws 5 DORMANCY, 6 CONSERVATION, 7 AUDIENCE PROJECTION. Directive 8's
 * amendment: jailed and roaming BOTH relinquish ALL influence, and banishment's
 * mechanical distinction is the exclusion edge.)
 *
 * ── THE STRIP IS ATOMIC ACROSS BOTH ALIAS HOMES, AND THAT IS THE WHOLE POINT ──
 * A pipeline character is stored TWICE: once in `settlement.npcs[]` and once inside
 * a faction's `members[]`. At generation those are the SAME OBJECT, so a strip applied
 * to the roster appears to move both and every in-memory probe agrees. A SAVED
 * settlement is JSON, and JSON has no aliases: on reload the two copies are
 * independent, and a one-home strip leaves a disgraced official still holding their
 * influence in the faction roster of every reloaded campaign. That is the recorded
 * JSON-alias trap, and it is why this module walks BOTH homes explicitly rather than
 * trusting the alias, and why the pin round-trips its fixture before measuring.
 *
 * There are TWO faction homes, and they are different lists. `settlement.factions[]` is
 * the NPC GROUPING roster (factionGrouping mints `{ name, members[] }`, the only home
 * that carries members on real pipeline output); `powerStructure.factions[]` is the
 * POWER roster. Both are walked, because a fixture or an import may carry members on
 * either, and a strip that missed one would be exactly the half-write this file exists
 * to prevent.
 *
 * ── THE VACANCY IS NEVER SILENTLY REFILLED ───────────────────────────────────
 * Nothing here mints a successor. The seat is EMITTED as a contested opening carrying
 * the `vacancy_from_disgrace` cause tag, for the existing succession / npcLadderContest
 * / faction-competition machinery to fight over. Power abhors a vacuum; the contest is
 * the story, and it is their story to run. This module only opens the door.
 *
 * The opening is EPHEMERAL by design rather than by omission: design §3b freezes the
 * world ledger at exactly three maps (roamers, placed, exclusions), so an `openings`
 * map would be a shape change to a surface whose contract must be right before it
 * persists. A contest that mints its own durable state from a per-tick emission is the
 * estate's existing shape for this, and it keeps the ledger a record of PEOPLE rather
 * than a queue of work.
 *
 * ── THE RECEIPT RIDES dmTruth, DELIBERATELY ──────────────────────────────────
 * The Herald item's `reasons` are reader prose and carry nothing covert. The typed
 * receipt (which arm ran, the roll, the weights, the compromise source) sits under
 * `dmTruth`, so it is held out of every player projection by TWO independent
 * mechanisms: publicSafe.js's recursive denylist matches the `dmTruth` spelling, and
 * npcLedgerProjection.js's allowlist never writes an unlisted key. Naming the leash
 * holder is covert intelligence under law 7, and showing a reader a roll and a weight
 * table would violate the game-grade rule against exposing formulas even if it were not.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/npcVerdictApply.test.js
 */

import { graduateNpc, addExclusionEdge, npcConsequencesActive } from './npcLedger.js';
import {
  HOLDING_VERDICT,
  NPC_CONSEQUENCES_TUNING,
  npcVerdictFor,
} from './npcVerdictTable.js';

/** The cause tag design §4 names, single-sourced for the emitters and the pins. */
export const VACANCY_CAUSE = 'vacancy_from_disgrace';

/** The typed action a verdict's news item carries (the address chain's event kind). */
export const VERDICT_NEWS_TYPE = 'npc_verdict';

/** The conditional mark this lane stamps on a sentenced roster record. */
export const NPC_CONSEQUENCE_KEY = 'npcConsequence';

/** The covert field name, spelled to match the estate's scrub. */
const DM_TRUTH_KEY = 'dmTruth';

/**
 * THE INFLUENCE FIELDS, declared once.
 *
 * Enumerating them here rather than writing them inline is the same structural cure
 * factionRename.js uses for its own two-home cascade: a field added for one home can
 * never be forgotten at the other, because both homes apply THIS list.
 *
 * @type {ReadonlyArray<{ key: string, to: unknown, why: string }>}
 */
export const RELINQUISHED_FIELDS = Object.freeze([
  // ── influence contributions (design §4) ──
  Object.freeze({ key: 'influence', to: 0, why: 'the influence stock itself; a jailed or roaming person contributes none' }),
  Object.freeze({ key: 'power', to: 0, why: 'the numeric power score the faction and ladder reads consume' }),
  Object.freeze({ key: 'dots', to: 0, why: 'the prominence dots eligibleMembersOf orders rungs by' }),
  Object.freeze({ key: 'notability', to: 0, why: 'the propagation weight a named figure carries into other reads' }),
  // ── ladder position (design §4) ──
  // 'minor' is the canonical bottom tier, and importanceWeight('minor') is 0, which is
  // below the ladder's RUNG_ELIGIBLE_FLOOR of 0.4. The rung therefore vacates
  // STRUCTURALLY, through the ladder's own eligibility predicate, rather than by this
  // module reaching into a ladder sidecar it does not own.
  Object.freeze({ key: 'importance', to: 'minor', why: 'drops below the ladder rung-eligibility floor, so the rung vacates through the ladder own predicate' }),
  Object.freeze({ key: 'structuralRank', to: '', why: 'the dominant/subordinate indicator the rung order reads' }),
  Object.freeze({ key: 'structuralPosition', to: '', why: 'the prose position label that names the seat' }),
  Object.freeze({ key: 'factionSeat', to: '', why: 'the internal seat key faction competition seats members into' }),
  // ── faction role (design §4) ──
  // ALL FIVE affiliation handles are cleared, not just the display one. npcInFaction
  // (npcLadderState.js) resolves membership through factionAffiliation | factionId |
  // factionLink | faction | organizationId, first present wins, so clearing only the
  // first would leave the person still a member through any of the other four and the
  // rung would never vacate.
  Object.freeze({ key: 'factionAffiliation', to: '', why: 'the display-name link every pipeline NPC carries to its faction' }),
  Object.freeze({ key: 'secondaryAffiliation', to: '', why: 'the second affiliation npcGenerator writes for a character with a criminal tie' }),
  Object.freeze({ key: 'factionId', to: '', why: 'an affiliation handle npcInFaction accepts' }),
  Object.freeze({ key: 'factionLink', to: '', why: 'an affiliation handle npcInFaction accepts' }),
  Object.freeze({ key: 'faction', to: '', why: 'an affiliation handle npcInFaction accepts' }),
  Object.freeze({ key: 'organizationId', to: '', why: 'an affiliation handle npcInFaction accepts' }),
  Object.freeze({ key: 'institutionId', to: '', why: 'the institutional seat; the office is forfeit with the rest' }),
  Object.freeze({ key: 'linkedFactionIds', to: Object.freeze([]), why: 'the linked-faction list npcInFaction also matches on' }),
]);

/** The severity band each verdict carries into the Herald.
 *  @type {Readonly<Record<string, number>>} */
const VERDICT_SEVERITY = Object.freeze({
  jailed: 0.5,
  banished: 0.65,
  turncoat: 0.7,
  criminal_founding: 0.7,
});

/**
 * The audience a verdict's news item declares. A turncoat's defection is an
 * information-statecraft hook (design §8: DM-only until revealed), so its item is
 * declared DM-only here and the ROUTING that honours the declaration is H4's.
 * @type {Readonly<Record<string, string>>}
 */
const VERDICT_AUDIENCE = Object.freeze({
  jailed: 'public',
  banished: 'public',
  turncoat: 'dm_only',
  criminal_founding: 'public',
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

// ── INFLUENCE RELINQUISHMENT (design §4) ──────────────────────────────────────
/**
 * @typedef {Object} StripResult
 * @property {Record<string, unknown>} settlement  a NEW settlement, or the SAME one when nothing matched
 * @property {boolean} changed
 * @property {{ roster: number, groupingMembers: number, powerMembers: number }} homes  hits per alias home
 * @property {Record<string, unknown>|null} relinquished  what the person held before the strip
 */

/**
 * Apply the declared relinquishment patch to one record, plus the conditional mark.
 * @param {Record<string, unknown>} record
 * @param {Record<string, unknown>|null} mark
 * @returns {Record<string, unknown>}
 */
function relinquish(record, mark) {
  /** @type {Record<string, unknown>} */
  const out = { ...record };
  for (const field of RELINQUISHED_FIELDS) {
    // Only fields the record ACTUALLY carries are written. A record that never had a
    // `notability` does not grow one here, so the strip cannot add bytes to a shape
    // that did not have them and a dormant-adjacent record stays byte-comparable.
    if (Object.prototype.hasOwnProperty.call(record, field.key)) {
      out[field.key] = Array.isArray(field.to) ? [...field.to] : field.to;
    }
  }
  if (mark) out[NPC_CONSEQUENCE_KEY] = mark;
  return out;
}

/**
 * Read back what a person held, BEFORE the strip, for the receipt.
 * @param {Record<string, unknown>} record
 * @returns {Record<string, unknown>}
 */
function relinquishedSnapshot(record) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const field of RELINQUISHED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(record, field.key)) out[field.key] = record[field.key];
  }
  return out;
}

/**
 * Patch every members[] list in one faction roster.
 * @param {unknown} list
 * @param {string} rosterId
 * @param {Record<string, unknown>|null} mark
 * @returns {{ list: unknown[], hits: number }}
 */
function patchFactionRoster(list, rosterId, mark) {
  let hits = 0;
  const next = asArray(list).map((faction) => {
    const record = asObject(faction);
    if (!Array.isArray(record.members)) return faction;
    let touched = false;
    const members = record.members.map((member) => {
      if (text(asObject(member).id) !== rosterId) return member;
      touched = true;
      hits += 1;
      return relinquish(asObject(member), mark);
    });
    return touched ? { ...record, members } : faction;
  });
  return { list: next, hits };
}

/**
 * STRIP ONE PERSON'S LADDER POSITION, FACTION ROLE AND INFLUENCE, at every alias home.
 *
 * Returns a NEW settlement, or the SAME reference when the id appears nowhere. Never
 * mutates. `changed` is true when ANY home was patched, and `homes` reports the hits
 * per home so a caller (and the pin) can see that both were reached rather than
 * inferring it from an alias.
 *
 * FAIL-CLOSED ON A MISSING ID: an empty roster id patches nothing at all rather than
 * matching every member whose id is also empty, which is the reading that turns one
 * verdict into a settlement-wide purge.
 *
 * @param {unknown} settlement
 * @param {{ rosterId: string, mark?: Record<string, unknown>|null }} args
 * @returns {StripResult}
 */
export function stripNpcInfluence(settlement, { rosterId, mark = null }) {
  const source = asObject(settlement);
  const id = text(rosterId);
  const empty = { roster: 0, groupingMembers: 0, powerMembers: 0 };
  if (!id) {
    return { settlement: source, changed: false, homes: empty, relinquished: null };
  }

  /** @type {Record<string, unknown>|null} */
  let relinquished = null;
  let rosterHits = 0;
  const npcs = asArray(source.npcs).map((npc) => {
    const record = asObject(npc);
    if (text(record.id) !== id) return npc;
    rosterHits += 1;
    if (!relinquished) relinquished = relinquishedSnapshot(record);
    return relinquish(record, mark);
  });

  const grouping = patchFactionRoster(source.factions, id, mark);
  const power = asObject(source.powerStructure);
  const powerRoster = patchFactionRoster(power.factions, id, mark);

  const homes = { roster: rosterHits, groupingMembers: grouping.hits, powerMembers: powerRoster.hits };
  const changed = rosterHits > 0 || grouping.hits > 0 || powerRoster.hits > 0;
  if (!changed) return { settlement: source, changed: false, homes, relinquished: null };

  /** @type {Record<string, unknown>} */
  const next = { ...source };
  if (rosterHits > 0) next.npcs = npcs;
  if (grouping.hits > 0) next.factions = grouping.list;
  if (powerRoster.hits > 0) next.powerStructure = { ...power, factions: powerRoster.list };
  return { settlement: next, changed: true, homes, relinquished };
}

// ── THE CONTESTED OPENING (design §4) ─────────────────────────────────────────
/**
 * @typedef {Object} ContestedOpening
 * @property {'contested_opening'} kind
 * @property {string} cause             always VACANCY_CAUSE
 * @property {string} settlementId
 * @property {string} factionId
 * @property {string} factionName
 * @property {string} vacatedRosterId
 * @property {string} vacatedWnpcId
 * @property {string} verdict
 * @property {number} tick
 */

/**
 * The opening a verdict leaves behind, or null when it leaves none.
 *
 * NULL IS A REAL ANSWER, not a failure: an unaffiliated NPC holds no faction seat, so
 * their disgrace vacates nothing for anyone to contest. Emitting a nameless opening
 * would hand the contest machinery a seat that does not exist.
 *
 * @param {Object} args
 * @param {string} args.settlementId
 * @param {string} args.factionId
 * @param {string} args.factionName
 * @param {string} args.rosterId
 * @param {string} args.wnpcId
 * @param {string} args.verdict
 * @param {number} args.tick
 * @returns {ContestedOpening | null}
 */
export function contestedOpeningFor({ settlementId, factionId, factionName, rosterId, wnpcId, verdict, tick }) {
  if (!text(factionName)) return null;
  return Object.freeze({
    kind: /** @type {'contested_opening'} */ ('contested_opening'),
    cause: VACANCY_CAUSE,
    settlementId: text(settlementId),
    factionId: text(factionId),
    factionName: text(factionName),
    vacatedRosterId: text(rosterId),
    vacatedWnpcId: text(wnpcId),
    verdict: text(verdict),
    tick: tickOf(tick),
  });
}

// ── THE HERALD ITEM (design §3c, THE NEWS ADDRESS LAW) ────────────────────────
/**
 * The reader headline for each verdict. Names only, never ids: a raw slot id in the
 * fiction register reads as machine noise to a human.
 * @param {string} verdict @param {string} name @param {string} place @returns {string}
 */
function headlineFor(verdict, name, place) {
  const who = name || 'A disgraced official';
  const where = place || 'the settlement';
  if (verdict === 'banished') return `${who} is banished from ${where}.`;
  if (verdict === 'turncoat') return `${who} is stripped of office in ${where} and leaves before dawn.`;
  if (verdict === 'criminal_founding') return `${who} is stripped of office in ${where} and is taken in by the underworld.`;
  return `${who} is imprisoned in ${where}.`;
}

/**
 * The public-safe receipt, as reader sentences. THE FIRST ONE IS THE ADDRESS CHAIN'S
 * `reason`: settlementWorldChronicle.js reads reasons[0] into address.reason, so it
 * must be the sentence a human wants first.
 *
 * NOTHING COVERT APPEARS HERE. Who held the leash is DM truth and rides the receipt
 * under dmTruth instead, and no roll, weight or flag key reaches a reader surface.
 *
 * @param {{ verdict: string, prisonPresent: boolean, criminalPowerPresent: boolean, factionName: string }} args
 * @returns {string[]}
 */
function reasonsFor({ verdict, prisonPresent, criminalPowerPresent, factionName }) {
  const reasons = ['The corruption was proven and the office was forfeit.'];
  reasons.push(prisonPresent ? 'The settlement keeps a prison.' : 'The settlement keeps no prison.');
  if (criminalPowerPresent) reasons.push('A criminal power holds ground in the settlement.');
  if (factionName) reasons.push(`The seat at ${factionName} stands open.`);
  if (verdict === 'banished') reasons.push('The edict of banishment shuts the settlement door behind them.');
  return reasons;
}

/**
 * @typedef {Object} VerdictNewsItem
 * @property {string} id
 * @property {string} candidateType    the typed action (address chain part 2)
 * @property {string} targetSaveId     the containing settlement (address chain part 1)
 * @property {ReadonlyArray<string>} settlementIds  the affected settlements (address chain part 3)
 * @property {string} npcId            the subject slot id, for the address join only
 * @property {string} factionId
 * @property {string} factionName
 * @property {string} verdict
 * @property {string} audience         'public' | 'dm_only'
 * @property {number} severity
 * @property {number} tick
 * @property {string} headline
 * @property {string} summary
 * @property {ReadonlyArray<string>} reasons  the recorded reason (address chain part 4)
 * @property {Record<string, unknown>} dmTruth  COVERT: the compromise source + the typed receipt
 */

/**
 * THE VERDICT'S ADDRESS-CHAIN HERALD ITEM.
 *
 * Shaped as a PULSE ROW on purpose. settlementWorldChronicle.js already derives the
 * News Address Law's four parts from `targetSaveId` / `settlementIds` / `npcId` /
 * `factionId` / `candidateType` / `reasons`, so an item built in that shape gets a
 * correct, navigable address chain from the machinery that already exists instead of
 * from a second projection this slice would have to keep in agreement with it.
 *
 * @param {Object} args
 * @param {import('./npcVerdictTable.js').NpcVerdict} args.decision
 * @param {string} args.settlementId
 * @param {string} args.settlementName
 * @param {string} args.rosterId
 * @param {string} args.wnpcId
 * @param {string} args.npcName
 * @param {number} args.tick
 * @returns {VerdictNewsItem}
 */
export function verdictHeraldItem({ decision, settlementId, settlementName, rosterId, wnpcId, npcName, tick }) {
  const verdict = text(decision.verdict);
  const place = text(settlementName) || text(settlementId);
  const factionName = text(decision.factionName);
  const summary = factionName
    ? `The office is forfeit and the seat at ${factionName} stands open.`
    : 'The office is forfeit.';
  return Object.freeze({
    id: `npcverdict:${text(settlementId)}:${text(wnpcId)}:${String(tickOf(tick))}`,
    candidateType: VERDICT_NEWS_TYPE,
    targetSaveId: text(settlementId),
    settlementIds: Object.freeze([text(settlementId)]),
    npcId: text(rosterId),
    factionId: text(decision.factionId),
    factionName,
    verdict,
    audience: VERDICT_AUDIENCE[verdict] || 'public',
    severity: VERDICT_SEVERITY[verdict] || 0.5,
    tick: tickOf(tick),
    headline: headlineFor(verdict, text(npcName), place),
    summary,
    reasons: Object.freeze(reasonsFor({
      verdict,
      prisonPresent: decision.prisonPresent === true,
      criminalPowerPresent: decision.criminalPowerPresent === true,
      factionName,
    })),
    // THE ONE COVERT ATTACHMENT. Everything a player must never see lives under this
    // single key, so the estate-wide scrub and the ledger projection both hold it out
    // without either of them needing to know what H2 put inside.
    [DM_TRUTH_KEY]: Object.freeze({
      compromiseSource: text(decision.compromiseSource),
      receipt: Object.freeze({
        exposureKind: text(decision.exposureKind),
        prisonPresent: decision.prisonPresent === true,
        criminalPowerPresent: decision.criminalPowerPresent === true,
        arm: text(decision.arm),
        baseVerdict: text(decision.baseVerdict),
        eligibleVerdict: decision.eligibleVerdict == null ? null : text(decision.eligibleVerdict),
        roll01: Number(decision.roll01),
        weights: decision.weights ? Object.freeze({ ...decision.weights }) : null,
      }),
    }),
  });
}

// ── THE COMPOSED APPLY ────────────────────────────────────────────────────────
/**
 * @typedef {Object} VerdictApplyResult
 * @property {Record<string, unknown>} worldState
 * @property {Record<string, unknown>} settlement
 * @property {import('./npcVerdictTable.js').NpcVerdict | null} decision
 * @property {string|null} wnpcId
 * @property {ContestedOpening|null} opening
 * @property {VerdictNewsItem|null} news
 * @property {{ settlementId: string, kind: string, untilTick?: number, indefinite?: true }|null} exclusion
 * @property {number|null} jailUntilTick
 * @property {{ roster: number, groupingMembers: number, powerMembers: number }} homes
 * @property {boolean} changed
 */

/** The no-op result, returning the caller's OWN references so a dark or non-triggering
 *  pass cannot mint a fresh object and defeat an upstream change detector.
 *  @param {Record<string, unknown>} worldState @param {Record<string, unknown>} settlement
 *  @returns {VerdictApplyResult} */
function noVerdict(worldState, settlement) {
  return {
    worldState,
    settlement,
    decision: null,
    wnpcId: null,
    opening: null,
    news: null,
    exclusion: null,
    jailUntilTick: null,
    homes: { roster: 0, groupingMembers: 0, powerMembers: 0 },
    changed: false,
  };
}

/**
 * SENTENCE AND SETTLE ONE EXPOSED NPC.
 *
 * The whole H2 lane in one call, in the order the design fixes:
 *   1. the verdict (dark, covert, or non-triggering ⇒ an immediate no-op);
 *   2. GRADUATION, so the person has a durable identity before anything keys on them
 *      (jailed enters `placed` under this settlement, because a jailed person is still
 *      hosted here; the three roaming verdicts enter `roamers`);
 *   3. the EXCLUSION edge, minted for banishment only, which is the one mechanical
 *      difference between banishment and the other two roaming verdicts;
 *   4. RELINQUISHMENT at both alias homes;
 *   5. the CONTESTED OPENING and the HERALD ITEM, emitted, never applied.
 *
 * IDEMPOTENT. The verdict is a hash of the same key, graduation is H1's one-way door,
 * and the exclusion merge keeps the stricter edge, so re-running the same exposure
 * yields the same identity, the same sentence and no second edge.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {Record<string, unknown>} args.settlement
 * @param {unknown} args.npc            the ROSTER record
 * @param {unknown} args.exposure       the corruption lane's exposure record
 * @param {string} args.settlementSeed
 * @param {string} args.settlementId
 * @param {string} [args.settlementName]
 * @param {number} args.tick
 * @returns {VerdictApplyResult}
 */
export function applyNpcVerdict({
  worldState,
  settlement,
  npc,
  exposure,
  settlementSeed,
  settlementId,
  settlementName = '',
  tick,
}) {
  if (!npcConsequencesActive(worldState)) return noVerdict(worldState, settlement);
  const record = asObject(npc);
  const rosterId = text(record.id);
  // FAIL CLOSED ON AN ID-LESS ROSTER ENTRY, and the reason is law 6 rather than
  // fastidiousness. The strip matches by roster id, so a person with no id would
  // GRADUATE into the ledger while keeping every scrap of their influence at both
  // alias homes: a durable identity for a seat that never emptied. Refusing the whole
  // verdict is the only reading that cannot produce that half-write. The table itself
  // still answers for anybody, because it writes nothing.
  if (!rosterId) return noVerdict(worldState, settlement);
  const decision = npcVerdictFor({ worldState, settlement, npc, exposure, settlementSeed, settlementId, tick });
  if (!decision) return noVerdict(worldState, settlement);

  const npcName = text(record.name);
  const holding = decision.verdict === HOLDING_VERDICT;

  const graduated = graduateNpc({
    worldState,
    settlementSeed,
    settlementId,
    rosterIdentity: { rosterId, name: npcName, role: record.role },
    tick,
    verdictCause: decision.verdict,
    reputation: decision.reputation,
    dmTruth: { compromiseSource: decision.compromiseSource },
    hostSettlementId: holding ? settlementId : null,
  });
  const wnpcId = graduated.wnpcId;
  let nextWorld = graduated.worldState;

  /** @type {{ settlementId: string, kind: string, untilTick?: number, indefinite?: true }|null} */
  let exclusion = null;
  if (decision.verdict === 'banished' && wnpcId) {
    const window = NPC_CONSEQUENCES_TUNING.BANISHMENT_EXCLUSION_TICKS;
    exclusion = typeof window === 'number' && Number.isFinite(window) && window >= 0
      ? { settlementId: text(settlementId), kind: 'banishment_edict', untilTick: tickOf(tick) + Math.floor(window) }
      : { settlementId: text(settlementId), kind: 'banishment_edict', indefinite: /** @type {true} */ (true) };
    nextWorld = addExclusionEdge(nextWorld, wnpcId, exclusion).worldState;
  }

  const jailUntilTick = holding ? tickOf(tick) + NPC_CONSEQUENCES_TUNING.JAIL_TERM_TICKS : null;
  /** @type {Record<string, unknown>} */
  const mark = {
    wnpcId: text(wnpcId),
    verdictCause: decision.verdict,
    tick: tickOf(tick),
    formerFaction: text(decision.factionName),
  };
  // DROP-WHEN-EMPTY at the field level: only a jailed record carries a release tick, so
  // the three roaming verdicts add no key that would read as an unserved sentence.
  if (jailUntilTick !== null) mark.jailUntilTick = jailUntilTick;

  const stripped = stripNpcInfluence(settlement, { rosterId, mark: Object.freeze(mark) });

  return {
    worldState: nextWorld,
    settlement: stripped.settlement,
    decision,
    wnpcId,
    opening: contestedOpeningFor({
      settlementId,
      factionId: decision.factionId,
      factionName: decision.factionName,
      rosterId,
      wnpcId: text(wnpcId),
      verdict: decision.verdict,
      tick,
    }),
    news: verdictHeraldItem({
      decision,
      settlementId,
      settlementName,
      rosterId,
      wnpcId: text(wnpcId),
      npcName,
      tick,
    }),
    exclusion,
    jailUntilTick,
    homes: stripped.homes,
    changed: true,
  };
}
