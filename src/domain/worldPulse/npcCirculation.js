/**
 * domain/worldPulse/npcCirculation.js — W-H3: REHOSTING, REJECTION, EQUILIBRIUM,
 * THE TURNCOAT FLOW, AND THE DESTRUCTION DISPERSAL.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §6 circulation, §6b belief-not-truth admission,
 * §6d the criminal destination generalization, §9 the population floor's dispersal half;
 * laws 3 TOTALITY, 4 FINITE SEMANTICS, 5 DORMANCY, 6 CONSERVATION, 7 AUDIENCE
 * PROJECTION.)
 *
 * ── THE ORDER OF OPERATIONS IS THE DESIGN'S, AND IT IS LOAD-BEARING ────────
 * Exclusion edges are filtered FIRST, before anything else looks at anybody. Not as an
 * optimization: a banished person who was scored, believed about, and then refused on
 * COMPATIBILITY grounds would carry the wrong reason into the Herald and could be
 * admitted the day their scandal faded, which is exactly the thing an edict of
 * banishment exists to prevent. The edict is a fact about the door, not an opinion about
 * the person, so it is read off the ledger's truth and never off a belief.
 *
 * ── ADMISSION RUNS AGAINST LOCAL BELIEF, NEVER GLOBAL TRUTH (§6b) ─────────
 * Everything downstream of the exclusion filter reads what THIS settlement believes,
 * derived on demand by npcCirculationBelief.js. So the same roamer is refused at the
 * gate a day's ride from the scandal and admitted six weeks up the road, through ONE
 * table and one strictness band rather than two policies that could drift apart. The
 * wanderer outrunning their story is not a special case in this file; it falls out of
 * handing the compatibility table a belief instead of a fact.
 *
 * ── EQUILIBRIUM HAS A FLOOR AS WELL AS A CEILING (§6 and §14) ─────────────
 * Rehost pressure RISES with time in the pool, so unassigned roamers eventually settle
 * themselves and the Wanderers register cannot become a graveyard of forgotten names.
 * But design §14 names the inverse failure too: pressure set too high makes roaming
 * trivially brief and the register vestigial. So the curve starts at ZERO for
 * ROAM_FLOOR_TICKS. Every displaced person is genuinely displaced for a while.
 *
 * ── THE REJECTION NEWS REFERENCES THE ORIGINAL SCANDAL, BY CONSTRUCTION ───
 * Design §6 asks that a rejection make circulation VISIBLE by pointing back at the story
 * that caused it. The item therefore carries the origin settlement, the verdict cause and
 * the believed scandal class in its own fields and in its reasons, and the pin reads those
 * fields rather than the prose, so a rewording cannot silently drop the reference.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation, and
 * ZERO rng draws (every choice is a labelled FNV-1a hash, the H1 mint / H2 verdict-roll
 * idiom, so this lane can never steal from the pulse stream and move a golden).
 *
 * @enforced-by tests/domain/npcCirculation.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { nameOf } from '../rulingPower.js';
import { clamp01 } from '../../kernel/math.js';
import {
  npcConsequencesActive,
  npcLedgerOf,
  exclusionsOf,
  isExcludedFrom,
  addExclusionEdge,
  moveNpcRecord,
  graduateNpc,
} from './npcLedger.js';
import { EDICT_EXCLUSION_KINDS, notorietyRank } from './npcLedgerFacets.js';
import { believedReputation } from './npcCirculationBelief.js';
import {
  ADMISSION_OUTCOMES,
  REJECTION_REASONS,
  circulationFactions,
  factionHasOpenSeat,
  rejectionFor,
  turncoatCapacityFor,
} from './npcCirculationTable.js';
import { NPC_CONSEQUENCES_TUNING } from './npcConsequencesTuning.js';

/** The typed actions this lane's news items carry (the address chain's event kinds). */
export const REJECTION_NEWS_TYPE = 'npc_rejection';
export const ARRIVAL_NEWS_TYPE = 'npc_arrival';
export const DISPERSAL_NEWS_TYPE = 'npc_dispersal';

/** The seeded-fork labels (design §11's `npcfate:*` namespace). */
export const REHOST_FORK_LABEL = 'npcfate:rehost';
export const SIBLING_FORK_LABEL = 'npcfate:sibling';

/** The composite-key delimiter, named for the same reason H1 and H2 name theirs. */
const KEY_DELIM = '|';

/** The covert field name, spelled to match the estate's scrub. */
const DM_TRUTH_KEY = 'dmTruth';

/**
 * The closed branch-word vocabulary a founded sibling faction draws its name from
 * (design §6: a new faction id, a seeded name, never reused). Five words, authored, and
 * deliberately plain: this is a splinter under an existing power, not a new institution
 * with a history, and inventing prose for it here would fork the faction-name generator.
 * @type {ReadonlyArray<string>}
 */
export const SIBLING_BRANCH_WORDS = Object.freeze([
  'Second',
  'Lesser',
  'Outer',
  'Younger',
  'New',
]);

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

/**
 * FNV-1a 32-bit. The estate's one hash idiom, carried locally so this leaf keeps a
 * narrow import posture (same constants as kernel/proseHash.js and its siblings).
 * @param {string} s @returns {number} unsigned 32-bit
 */
function fnv1a32(s) {
  let h = 0x811c9dc5;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A deterministic roll in [0, 1) from a labelled key. ZERO DRAWS.
 *  @param {string} key @returns {number} */
export function circulationRoll01(key) {
  return fnv1a32(text(key)) / 0x100000000;
}

// ── EQUILIBRIUM (design §6, J-D8b i) ──────────────────────────────────────────
/**
 * THE REHOST PRESSURE CURVE. Zero below the roaming floor, then rising linearly with
 * time in the pool to a ceiling below 1.
 *
 * Monotone non-decreasing over the whole domain and EXACTLY zero on the floor, which
 * are the two properties the equilibrium pin asserts: the first is what makes roamers
 * eventually settle, the second is what keeps roaming from being trivially brief.
 * @param {number} elapsedTicks ticks in the pool
 * @returns {number} 0..REHOST_PRESSURE_CEILING
 */
export function rehostPressure01(elapsedTicks) {
  const elapsed = tickOf(elapsedTicks);
  if (elapsed < NPC_CONSEQUENCES_TUNING.ROAM_FLOOR_TICKS) return 0;
  const past = elapsed - NPC_CONSEQUENCES_TUNING.ROAM_FLOOR_TICKS;
  const raw = NPC_CONSEQUENCES_TUNING.REHOST_BASE_PRESSURE
    + past * NPC_CONSEQUENCES_TUNING.REHOST_PRESSURE_PER_TICK;
  return clamp01(Math.min(NPC_CONSEQUENCES_TUNING.REHOST_PRESSURE_CEILING, raw));
}

/**
 * Does this roamer ATTEMPT a rehost this tick? A hashed reading of the pressure curve,
 * so the attempt is deterministic per (roamer, tick) and consumes no rng.
 * @param {{ wnpcId: string, tick: number, elapsedTicks: number }} args
 * @returns {boolean}
 */
export function attemptsRehost({ wnpcId, tick, elapsedTicks }) {
  const pressure = rehostPressure01(elapsedTicks);
  if (pressure <= 0) return false;
  return circulationRoll01([REHOST_FORK_LABEL, text(wnpcId), String(tickOf(tick))].join(KEY_DELIM)) < pressure;
}

/**
 * THE POOL ENVELOPE (design §6: pool size is bounded at soak horizons). A ceiling in
 * PEOPLE, scaled by the realm so a large map does not red for being large.
 * @param {number} settlementCount
 * @returns {number}
 */
export function poolCeilingFor(settlementCount) {
  const n = Math.max(1, tickOf(settlementCount));
  return Math.ceil(n * NPC_CONSEQUENCES_TUNING.POOL_PER_SETTLEMENT_CEILING);
}

/**
 * The pool census: how many souls are roaming, and whether that is inside the envelope.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {number} settlementCount
 * @returns {{ roaming: number, placed: number, ceiling: number, within: boolean }}
 */
export function poolCensus(worldState, settlementCount) {
  const ledger = npcLedgerOf(worldState);
  const roaming = Object.keys(ledger.roamers).length;
  const ceiling = poolCeilingFor(settlementCount);
  return { roaming, placed: Object.keys(ledger.placed).length, ceiling, within: roaming <= ceiling };
}

// ── THE CANDIDATE FLOW (design §6: exclusion edges filtered FIRST) ────────────
/**
 * THE REACHABLE, NOT-SHUT TARGETS for one roamer, in a deterministic order.
 *
 * EXCLUSIONS ARE FILTERED FIRST, before any belief is derived and before any
 * compatibility table is consulted, exactly as the design orders it. `filteredOut`
 * reports what the filter removed and why, so the pin can prove the filter RAN rather
 * than inferring it from a shorter list.
 *
 * @param {Object} args
 * @param {{ spatialLedgers?: unknown } | null | undefined} args.worldState
 * @param {string} args.wnpcId
 * @param {ReadonlyArray<string>} args.settlementIds  the candidate space
 * @param {number} args.tick
 * @returns {{ targets: string[], filteredOut: Array<{ settlementId: string, kind: string }> }}
 */
export function reachableTargets({ worldState, wnpcId, settlementIds, tick }) {
  /** @type {string[]} */
  const targets = [];
  /** @type {Array<{ settlementId: string, kind: string }>} */
  const filteredOut = [];
  const edges = exclusionsOf(worldState, wnpcId);
  for (const raw of asArray(settlementIds)) {
    const id = text(raw);
    if (!id) continue;
    if (isExcludedFrom(worldState, wnpcId, id, tick)) {
      const edge = edges.find((e) => e.settlementId === id);
      filteredOut.push({ settlementId: id, kind: edge ? edge.kind : 'banishment_edict' });
      continue;
    }
    targets.push(id);
  }
  return { targets: targets.sort(compareCodepoint), filteredOut };
}

// ── ADMISSION (design §6) ─────────────────────────────────────────────────────
/**
 * @typedef {Object} AdmissionResult
 * @property {string} outcome        an ADMISSION_OUTCOMES member
 * @property {string|null} reason    a REJECTION_REASONS member on a refusal, else null
 * @property {string} factionId      the faction joined or founded under ('' when none)
 * @property {string} factionName
 * @property {string} siblingName    the founded sibling's name ('' unless founded)
 * @property {string} siblingId      the founded sibling's id ('' unless founded)
 * @property {import('./npcLedgerFacets.js').ReputationFacets} believed  what the town thinks
 */

/**
 * THE ADMISSION DECISION for one roamer at one settlement (design §6, §6d).
 *
 * The rule, in the design's own order: a compatible faction with an OPEN SEAT admits at
 * the LOWEST position; if every compatible faction is full, a SIBLING faction is founded
 * under that power; if no faction will have them, the refusal carries the first authored
 * reason; if there is no faction to ask at all, they REMAIN ROAMING, which is a real
 * outcome rather than a failure.
 *
 * Factions are considered in codepoint-name order so the choice is a pure function of the
 * settlement rather than of array order, which a reload or a regen could permute.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {unknown} args.settlement
 * @param {string} args.settlementId
 * @param {string} args.wnpcId
 * @param {unknown} args.roamer          the RoamerRecord (truth)
 * @param {number} args.tick
 * @param {string} [args.factionAlignmentRead]
 * @returns {AdmissionResult}
 */
export function admissionFor({
  worldState, settlement, settlementId, wnpcId, roamer, tick, factionAlignmentRead = 'unknown',
}) {
  const record = asObject(roamer);
  const origin = asObject(record.originRef);
  const { believed } = believedReputation({
    worldState,
    originId: text(origin.settlementId),
    observerId: text(settlementId),
    roamerId: text(wnpcId),
    truth: record.reputation,
    elapsedTicks: Math.max(0, tickOf(tick) - tickOf(record.sinceTick)),
  });

  const entries = circulationFactions(settlement)
    .map((entry) => ({ ...entry, label: nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (entry.faction)) }))
    .filter((entry) => entry.label)
    .sort((a, b) => compareCodepoint(a.label, b.label));

  if (entries.length === 0) {
    return {
      outcome: 'remained_roaming', reason: null, factionId: '', factionName: '',
      siblingName: '', siblingId: '', believed,
    };
  }

  const banishedFromHere = isExcludedFrom(worldState, wnpcId, settlementId, tick, EDICT_EXCLUSION_KINDS);
  /** @type {string|null} */
  let firstRefusal = null;
  /** @type {{ label: string, faction: Record<string, unknown> }|null} */
  let compatibleFull = null;

  for (const entry of entries) {
    const verdict = rejectionFor({
      faction: entry.faction,
      believed,
      factionAlignmentRead,
      history: { banishedFromHere },
    });
    if (verdict.rejected) {
      if (firstRefusal == null) firstRefusal = verdict.reason;
      continue;
    }
    if (factionHasOpenSeat(entry.faction, settlement)) {
      return {
        outcome: 'admitted_lowest',
        reason: null,
        factionId: text(entry.faction.id),
        factionName: entry.label,
        siblingName: '',
        siblingId: '',
        believed,
      };
    }
    if (!compatibleFull) compatibleFull = { label: entry.label, faction: entry.faction };
  }

  if (compatibleFull) {
    const sibling = siblingFactionFor({
      settlement, settlementId, parentName: compatibleFull.label, wnpcId, tick,
    });
    return {
      outcome: 'founded_sibling',
      reason: null,
      factionId: text(compatibleFull.faction.id),
      factionName: compatibleFull.label,
      siblingName: sibling.name,
      siblingId: sibling.id,
      believed,
    };
  }
  return {
    outcome: 'rejected',
    reason: firstRefusal,
    factionId: '',
    factionName: '',
    siblingName: '',
    siblingId: '',
    believed,
  };
}

/**
 * A SIBLING FACTION UNDER AN EXISTING POWER: a seeded name that is NEVER REUSED, and an
 * id derived from it.
 *
 * Never-reused is enforced by CHECKING, not by hoping: the branch word walks the closed
 * vocabulary from its hashed start and takes the first reading that does not already name
 * a faction in this settlement. Past the vocabulary it falls back to a numbered form,
 * which terminates because each candidate is checked.
 *
 * @param {Object} args
 * @param {unknown} args.settlement
 * @param {string} args.settlementId
 * @param {string} args.parentName
 * @param {string} args.wnpcId
 * @param {number} args.tick
 * @returns {{ name: string, id: string }}
 */
export function siblingFactionFor({ settlement, settlementId, parentName, wnpcId, tick }) {
  const taken = new Set(
    circulationFactions(settlement)
      .map((entry) => nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (entry.faction)))
      .filter(Boolean),
  );
  const parent = text(parentName);
  const key = [SIBLING_FORK_LABEL, text(settlementId), parent, text(wnpcId), String(tickOf(tick))].join(KEY_DELIM);
  const start = fnv1a32(key) % SIBLING_BRANCH_WORDS.length;
  for (let i = 0; i < SIBLING_BRANCH_WORDS.length; i += 1) {
    const candidate = `${SIBLING_BRANCH_WORDS[(start + i) % SIBLING_BRANCH_WORDS.length]} ${parent}`;
    if (!taken.has(candidate)) return { name: candidate, id: siblingIdFor(candidate, settlementId) };
  }
  for (let n = 2; ; n += 1) {
    const candidate = `${SIBLING_BRANCH_WORDS[start]} ${parent} ${String(n)}`;
    if (!taken.has(candidate)) return { name: candidate, id: siblingIdFor(candidate, settlementId) };
  }
}

/** The id for a founded sibling: stable, collision-checked through its name.
 *  @param {string} name @param {string} settlementId @returns {string} */
function siblingIdFor(name, settlementId) {
  return `fac.sibling.${fnv1a32([text(settlementId), text(name)].join(KEY_DELIM)).toString(16).padStart(8, '0')}`;
}

// ── THE TURNCOAT FLOW (design §6, J-D8b iv) ──────────────────────────────────
/**
 * WHERE A TURNCOAT GOES, AND AS WHAT. The destination is the compromising rival power's
 * sphere; the capacity comes from the closed five-word vocabulary, mapped from the
 * person's ROLE ARCHETYPE by the authored table.
 *
 * The destination settlements are supplied by the caller rather than looked up here,
 * because "the rival power's sphere" is a region-graph question owned by src/domain/region
 * and re-deriving it in this file would fork it. What this function owns is the CHOICE
 * among them and the capacity, both closed and both seeded.
 *
 * @param {Object} args
 * @param {string} args.wnpcId
 * @param {unknown} args.roleArchetype
 * @param {ReadonlyArray<string>} args.sphereSettlementIds
 * @param {number} args.tick
 * @returns {{ capacity: string, destinationId: string|null }}
 */
export function turncoatDestination({ wnpcId, roleArchetype, sphereSettlementIds, tick }) {
  const capacity = turncoatCapacityFor(roleArchetype);
  const ids = asArray(sphereSettlementIds).map(text).filter(Boolean).sort(compareCodepoint);
  if (ids.length === 0) return { capacity, destinationId: null };
  const roll = circulationRoll01(['npcfate:turncoat', text(wnpcId), String(tickOf(tick))].join(KEY_DELIM));
  return { capacity, destinationId: ids[Math.min(ids.length - 1, Math.floor(roll * ids.length))] };
}

// ── THE NEWS ITEMS (THE NEWS ADDRESS LAW) ────────────────────────────────────
/**
 * THE REJECTION-AT-THE-GATE ITEM, which REFERENCES THE ORIGINAL SCANDAL (design §6).
 *
 * The reference is carried in TYPED FIELDS (`originSettlementId`, `verdictCause`,
 * `scandalClass`) as well as in the reader sentence, so a rewrite of the prose cannot
 * quietly drop it and the pin can assert the reference without matching a string.
 *
 * Shaped as a PULSE ROW, exactly as H2's verdict item is, so the address chain comes from
 * settlementWorldChronicle.js rather than from a second projection.
 *
 * @param {Object} args
 * @param {string} args.settlementId @param {string} args.settlementName
 * @param {string} args.wnpcId @param {unknown} args.roamer
 * @param {string} args.reason a REJECTION_REASONS member
 * @param {import('./npcLedgerFacets.js').ReputationFacets} args.believed
 * @param {number} args.tick
 * @returns {Record<string, unknown>}
 */
export function rejectionNewsItem({ settlementId, settlementName, wnpcId, roamer, reason, believed, tick }) {
  const record = asObject(roamer);
  const identity = asObject(record.identityFacets);
  const origin = asObject(record.originRef);
  const who = text(identity.name) || 'A stranger';
  const where = text(settlementName) || text(settlementId);
  const originId = text(origin.settlementId);
  const scandal = text(asObject(believed).scandalClass);
  const cause = text(record.verdictCause);
  return Object.freeze({
    id: `npcrejection:${text(settlementId)}:${text(wnpcId)}:${String(tickOf(tick))}`,
    candidateType: REJECTION_NEWS_TYPE,
    targetSaveId: text(settlementId),
    settlementIds: Object.freeze([text(settlementId), originId].filter(Boolean)),
    npcId: text(record.originRef && origin.rosterId),
    wnpcId: text(wnpcId),
    // THE SCANDAL REFERENCE, TYPED. These three fields are the machine-readable half of
    // "referencing the original scandal", and they are what the pin reads.
    originSettlementId: originId,
    verdictCause: cause,
    scandalClass: scandal,
    rejectionReason: REJECTION_REASONS.includes(text(reason)) ? text(reason) : 'scandal_class_unacceptable',
    audience: 'public',
    severity: 0.35,
    tick: tickOf(tick),
    headline: `${who} is turned away at the gates of ${where}.`,
    summary: `The story that put them on the road reached ${where} before they did.`,
    reasons: Object.freeze([
      `The gate was shut against them over the matter at ${originId || 'their last home'}.`,
      scandal === 'none'
        ? 'The house that refused them gave no cause beyond their standing.'
        : `What is spoken of them here is a matter of ${scandal}.`,
      cause === 'none' ? 'They travel without a court order against them.' : `They left their last home under a verdict of ${cause}.`,
    ]),
  });
}

/**
 * THE ARRIVAL ITEM. A person takes up residence, or founds a house of their own.
 * @param {Object} args
 * @param {string} args.settlementId @param {string} args.settlementName
 * @param {string} args.wnpcId @param {unknown} args.roamer
 * @param {AdmissionResult} args.admission
 * @param {number} args.tick
 * @returns {Record<string, unknown>}
 */
export function arrivalNewsItem({ settlementId, settlementName, wnpcId, roamer, admission, tick }) {
  const record = asObject(roamer);
  const identity = asObject(record.identityFacets);
  const origin = asObject(record.originRef);
  const who = text(identity.name) || 'A stranger';
  const where = text(settlementName) || text(settlementId);
  const founded = admission.outcome === 'founded_sibling';
  return Object.freeze({
    id: `npcarrival:${text(settlementId)}:${text(wnpcId)}:${String(tickOf(tick))}`,
    candidateType: ARRIVAL_NEWS_TYPE,
    targetSaveId: text(settlementId),
    settlementIds: Object.freeze([text(settlementId), text(origin.settlementId)].filter(Boolean)),
    wnpcId: text(wnpcId),
    factionId: founded ? admission.siblingId : admission.factionId,
    factionName: founded ? admission.siblingName : admission.factionName,
    admissionOutcome: ADMISSION_OUTCOMES.includes(admission.outcome) ? admission.outcome : 'remained_roaming',
    originSettlementId: text(origin.settlementId),
    audience: 'public',
    severity: founded ? 0.45 : 0.3,
    tick: tickOf(tick),
    headline: founded
      ? `${who} founds a house of their own in ${where}.`
      : `${who} takes up residence in ${where}.`,
    summary: founded
      ? `Every seat under ${admission.factionName} was taken, so they set up beside it as ${admission.siblingName}.`
      : `They enter ${admission.factionName} at its lowest rung.`,
    reasons: Object.freeze([
      founded
        ? `${admission.factionName} had no seat left, so a sibling house stands under the same power.`
        : `${admission.factionName} had a seat open at the bottom.`,
      `They came from ${text(origin.settlementId) || 'the road'}.`,
    ]),
  });
}

// ── THE COMPOSED REHOST ATTEMPT ──────────────────────────────────────────────
/**
 * @typedef {Object} RehostResult
 * @property {Record<string, unknown>} worldState
 * @property {AdmissionResult|null} admission
 * @property {Record<string, unknown>|null} news
 * @property {{ settlementId: string, kind: string, untilTick: number }|null} cooldown
 * @property {boolean} attempted
 * @property {boolean} changed
 */

/** The no-op result, returning the caller's OWN worldState reference so a dark or
 *  non-attempting pass cannot defeat an upstream change detector.
 *  @param {Record<string, unknown>} worldState @param {boolean} attempted @returns {RehostResult} */
function noRehost(worldState, attempted) {
  return { worldState, admission: null, news: null, cooldown: null, attempted, changed: false };
}

/**
 * ONE ROAMER KNOCKS ON ONE DOOR.
 *
 * The whole §6 lane in one call, in the design's order: the pressure curve decides
 * whether they try at all, the exclusion filter decides whether the door is even
 * available, the belief layer decides what this town thinks of them, the authored table
 * decides whether they are taken, and a refusal records a cooldown edge so they do not
 * knock again tomorrow.
 *
 * A successful admission MOVES the record from `roamers` to `placed` through the one
 * conservation-safe mover, so a person is never in both maps and never in neither.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {unknown} args.settlement
 * @param {string} args.settlementId
 * @param {string} [args.settlementName]
 * @param {string} args.wnpcId
 * @param {number} args.tick
 * @param {boolean} [args.force]  skip the pressure roll (a DM verb, or a caller that
 *   already decided); the exclusion filter and the table still run.
 * @returns {RehostResult}
 */
export function attemptRehost({
  worldState, settlement, settlementId, settlementName = '', wnpcId, tick, force = false,
}) {
  if (!npcConsequencesActive(worldState)) return noRehost(worldState, false);
  const id = text(wnpcId);
  const roamer = npcLedgerOf(worldState).roamers[id];
  if (!roamer) return noRehost(worldState, false);

  const elapsedTicks = Math.max(0, tickOf(tick) - tickOf(roamer.sinceTick));
  if (!force && !attemptsRehost({ wnpcId: id, tick, elapsedTicks })) return noRehost(worldState, false);

  // EXCLUSIONS FIRST. Any active edge against this door ends the attempt before a belief
  // is derived or a table is read.
  if (isExcludedFrom(worldState, id, settlementId, tick)) return noRehost(worldState, true);

  const admission = admissionFor({ worldState, settlement, settlementId, wnpcId: id, roamer, tick });

  if (admission.outcome === 'rejected') {
    const cooldown = {
      settlementId: text(settlementId),
      kind: 'rehost_cooldown',
      untilTick: tickOf(tick) + NPC_CONSEQUENCES_TUNING.REJECTION_COOLDOWN_TICKS,
    };
    const next = addExclusionEdge(worldState, id, cooldown).worldState;
    return {
      worldState: next,
      admission,
      news: rejectionNewsItem({
        settlementId, settlementName, wnpcId: id, roamer,
        reason: text(admission.reason), believed: admission.believed, tick,
      }),
      cooldown,
      attempted: true,
      changed: next !== worldState,
    };
  }
  if (admission.outcome === 'remained_roaming') {
    return { worldState, admission, news: null, cooldown: null, attempted: true, changed: false };
  }

  const moved = moveNpcRecord({
    worldState,
    wnpcId: id,
    hostSettlementId: text(settlementId),
    patch: { residency: null, transit: null },
    sinceTick: tickOf(tick),
  });
  return {
    worldState: moved.worldState,
    admission,
    news: arrivalNewsItem({ settlementId, settlementName, wnpcId: id, roamer, admission, tick }),
    cooldown: null,
    attempted: true,
    changed: moved.changed,
  };
}

// ── DESTRUCTION DISPERSAL (design §9) ────────────────────────────────────────
/**
 * @typedef {Object} DispersalResult
 * @property {Record<string, unknown>} worldState
 * @property {string[]} wnpcIds        every soul that entered the pool, codepoint-sorted
 * @property {Record<string, unknown>|null} news
 * @property {number} dispersed
 * @property {boolean} changed
 */

/**
 * A DESTROYED SETTLEMENT SCATTERS ITS NAMED CAST (design §9, §0's story-seeds).
 *
 * Every named resident graduates (H1's one-way door, so anybody already graduated keeps
 * their id) and enters the pool with the `destruction_dispersal` cause. Nobody dies: the
 * engine kills no named character, ever, and a dispersal is the mechanism that makes that
 * law survivable when the town itself does not.
 *
 * RIVAL-COMPROMISED MEMBERS RETAIN THE TURNCOAT OPTION, which is why the dm truth rides
 * along: their compromise source is carried into the roamer record so the turncoat flow
 * can still read it after the settlement that knew it is gone.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {unknown} args.settlement
 * @param {string} args.settlementSeed
 * @param {string} args.settlementId
 * @param {string} [args.settlementName]
 * @param {number} args.tick
 * @param {(npc: Record<string, unknown>) => string} [args.compromiseSourceOf]
 * @returns {DispersalResult}
 */
export function disperseCastToPool({
  worldState, settlement, settlementSeed, settlementId, settlementName = '', tick,
  compromiseSourceOf = () => 'none',
}) {
  if (!npcConsequencesActive(worldState)) {
    return { worldState, wnpcIds: [], news: null, dispersed: 0, changed: false };
  }
  let next = worldState;
  /** @type {string[]} */
  const wnpcIds = [];
  const roster = asArray(asObject(settlement).npcs).map(asObject);
  // Roster order is generation order; sorting by slot id makes the dispersal a pure
  // function of the cast rather than of the array it happened to arrive in.
  const ordered = [...roster].sort((a, b) => compareCodepoint(text(a.id), text(b.id)));
  for (const npc of ordered) {
    const rosterId = text(npc.id);
    if (!rosterId) continue;
    const graduated = graduateNpc({
      worldState: next,
      settlementSeed,
      settlementId,
      rosterIdentity: { rosterId, name: npc.name, role: npc.role },
      tick,
      verdictCause: 'destruction_dispersal',
      dmTruth: { compromiseSource: compromiseSourceOf(npc) },
      hostSettlementId: null,
    });
    next = graduated.worldState;
    if (graduated.wnpcId) wnpcIds.push(graduated.wnpcId);
  }
  wnpcIds.sort(compareCodepoint);
  const place = text(settlementName) || text(settlementId);
  return {
    worldState: next,
    wnpcIds,
    dispersed: wnpcIds.length,
    changed: next !== worldState,
    news: wnpcIds.length === 0 ? null : Object.freeze({
      id: `npcdispersal:${text(settlementId)}:${String(tickOf(tick))}`,
      candidateType: DISPERSAL_NEWS_TYPE,
      targetSaveId: text(settlementId),
      settlementIds: Object.freeze([text(settlementId)]),
      audience: 'public',
      severity: 0.6,
      tick: tickOf(tick),
      dispersed: wnpcIds.length,
      headline: `The named of ${place} scatter to the roads.`,
      summary: `${String(wnpcIds.length)} people who held names in ${place} are on the road with no home to return to.`,
      reasons: Object.freeze([
        `${place} passed from the living map and its cast went with it.`,
        'Their fates are UNRESOLVED; the engine kills no named character, ever.',
      ]),
      [DM_TRUTH_KEY]: Object.freeze({ wnpcIds: Object.freeze([...wnpcIds]) }),
    }),
  };
}

/**
 * The believed-notoriety rank one settlement holds about one roamer. Exported for the
 * belief-not-truth pin's anchor: a negative assertion about admission needs a POSITIVE
 * reading from the SAME derivation to prove the derivation ran.
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.observerId @param {string} args.wnpcId
 * @param {unknown} args.roamer @param {number} args.tick
 * @returns {number}
 */
export function believedNotorietyRank({ worldState, observerId, wnpcId, roamer, tick }) {
  const record = asObject(roamer);
  const { believed } = believedReputation({
    worldState,
    originId: text(asObject(record.originRef).settlementId),
    observerId,
    roamerId: wnpcId,
    truth: record.reputation,
    elapsedTicks: Math.max(0, tickOf(tick) - tickOf(record.sinceTick)),
  });
  return notorietyRank(believed.notorietyBand);
}
