/**
 * domain/worldPulse/npcLedgerProjection.js — W-H1: AUDIENCE PROJECTION OVER THE WORLD
 * NPC LEDGER (design DESIGN_NPC_CONSEQUENCES.md law 7 / J-D8b iii, §8).
 *
 * THE LAW. Roamer records carry DM TRUTH: a compromise source is covert intelligence,
 * and the corruption web's whole covert/revealed seam depends on it never leaking.
 * "Players see the wanderer, never the owner." Every pool read therefore rides the
 * ESTATE'S EXISTING `includeCovert` seam, extended here to world-level NPC state.
 *
 * WHY THE SEAM IS EXTENDED RATHER THAN FORKED. `includeCovert` is already the estate's
 * one covert-visibility convention: mobilizationStatus.js declares it (a covert
 * mobilizer is included only for the GM view), tradePressure.js and politicsRead.js
 * follow it verbatim, and visibilityAudit.js runs the player-safe side of it against
 * worst-case fixtures. A second spelling for the same idea would be a fork that drifts,
 * and the drift would be a privacy leak rather than a cosmetic inconsistency. Same
 * parameter name, same default (FALSE, so the unsafe call is the one you have to type),
 * same semantics.
 *
 * ALLOWLIST, NEVER SPREAD (the worldSnapshotPublic.js security model). The public record
 * is assembled field by field from named fields. It is never built by spreading a ledger
 * record and deleting the covert parts, because a delete-based scrub silently stops
 * covering a field the day someone adds one. Under this construction a field that is not
 * written CANNOT appear, so H2 and H3 may add anything they like to the ledger record and
 * the player projection stays closed by default.
 *
 * DEFENCE IN DEPTH, INDEPENDENTLY. The covert field is spelled `dmTruth`, which the
 * publicSafe.js recursive denylist (PRIVATE_KEY_RE, whose `\bdm` token matches it)
 * already strips from every public/anon/gallery projection. So the covert payload is
 * held out by TWO independent mechanisms: this allowlist, and the estate-wide scrub. The
 * pins assert both, because either one alone is a single point of failure.
 *
 * ONE TRUTH, TWO VIEWS (design §6c). The Wanderers register (world scope) and a
 * settlement's Unaffiliates section (local scope) are the SAME projection with a
 * different filter, not two read models. The optional `settlementId` argument exists
 * precisely so H4 cannot fork a second projection to get the local view.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/npcLedgerProjection.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { npcLedgerOf } from './npcLedger.js';
import { exclusionActiveAt, EDICT_EXCLUSION_KINDS } from './npcLedgerFacets.js';

/**
 * The covert field name, single-sourced so the projection, the audit helper and the
 * pins can never disagree about what they are holding out.
 */
export const DM_TRUTH_KEY = 'dmTruth';

/**
 * @typedef {import('./npcLedgerFacets.js').ExclusionEdge} ExclusionEdge
 */

/**
 * @typedef {Object} ProjectedNpc
 * @property {string} wnpcId
 * @property {string} name
 * @property {string} role
 * @property {string} notorietyBand
 * @property {string} edictMark
 * @property {string} scandalClass
 * @property {string} alignmentRead
 * @property {string} competenceRead
 * @property {string} verdictCause
 * @property {string} originSettlementId  the origin STORY POINTER (design §8), never the slot id
 * @property {string|null} hostSettlementId  null for a roamer
 * @property {number} sinceTick
 * @property {number} elapsedTicks  how long they have been in this state
 * @property {ReadonlyArray<string>} shutDoors  settlement ids currently excluding them
 * @property {true} [whereaboutsUnknown] DM VIEW ONLY: no route or residence supports a place
 * @property {{ compromiseSource: string }} [dmTruth]  DM VIEW ONLY
 */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * Project ONE ledger record into its audience-safe public shape.
 *
 * THE POSITIONAL ID IS DELIBERATELY WITHHELD. originRef carries `rosterId` (an internal
 * `npc_N` slot key) and it is NOT projected: a raw slot id in a fiction register reads
 * as machine noise to a human (the partyImpact.js "a raw npc_7 id in the fiction
 * register" note), and it is a join key rather than audience content. Only the origin
 * SETTLEMENT survives, which is the "origin story pointer" the design asks for.
 *
 * @param {string} wnpcId
 * @param {Record<string, unknown>} record
 * @param {ReadonlyArray<ExclusionEdge>} exclusions
 * @param {{ includeCovert: boolean, tick: number }} opts
 * @returns {ProjectedNpc}
 */
function projectRecord(wnpcId, record, exclusions, opts) {
  const identity = asObject(record.identityFacets);
  const reputation = asObject(record.reputation);
  const origin = asObject(record.originRef);
  const sinceTick = Number(record.sinceTick) || 0;
  const host = record.hostSettlementId == null ? null : String(record.hostSettlementId);
  // EDICT KINDS ONLY (W-H3). The exclusions map now also carries rehost cooldowns, which
  // are circulation bookkeeping rather than a legal fact about a person: a cooldown is
  // the wanderer not knocking again yet, not a door shut against them, and listing it in
  // a reader's register would invent a banishment that no court ever pronounced.
  const shutDoors = exclusions
    .filter((edge) => EDICT_EXCLUSION_KINDS.includes(edge.kind) && exclusionActiveAt(edge, opts.tick))
    .map((edge) => edge.settlementId)
    .sort(compareCodepoint);
  const residency = asObject(record.residency);
  const transit = asObject(record.transit);
  const assignment = asObject(record.dmAssignment);
  const restingAt = String(residency.settlementId || assignment.atSettlementId || '');

  /** @type {Record<string, unknown>} */
  const out = {
    wnpcId,
    name: String(identity.name || ''),
    role: String(identity.role || ''),
    notorietyBand: String(reputation.notorietyBand || 'unknown'),
    edictMark: String(reputation.edictMark || 'none'),
    scandalClass: String(reputation.scandalClass || 'none'),
    alignmentRead: String(reputation.alignmentRead || 'unknown'),
    competenceRead: String(reputation.competenceRead || 'unknown'),
    verdictCause: String(record.verdictCause || 'none'),
    originSettlementId: String(origin.settlementId || ''),
    hostSettlementId: host,
    sinceTick,
    elapsedTicks: Math.max(0, (Number(opts.tick) || 0) - sinceTick),
    shutDoors: Object.freeze(shutDoors),
    // W-H3, BOTH CONDITIONAL AT THE FIELD LEVEL. A record that carries neither a
    // residency nor a transit leg projects EXACTLY the shape H1 projected, so the H1
    // pins keep measuring the same object rather than one with two new null keys.
    ...(restingAt ? { restingAt } : {}),
    ...(String(transit.toId || '') ? { travellingTo: String(transit.toId) } : {}),
  };
  // THE ONE COVERT ATTACHMENT, and the ONLY statement in this file that can write it.
  // The player path never reaches this branch, so a player projection cannot carry the
  // key even if a future record grows new covert fields underneath it.
  if (opts.includeCovert) {
    // A remote loss is not public knowledge merely because the simulation knows it.
    // Until an observation carrier earns that knowledge, only the DM projection may
    // say that the person's whereabouts are unsupported.
    if (record.whereaboutsUnknown === true) out.whereaboutsUnknown = true;
    const dmTruth = asObject(record[DM_TRUTH_KEY]);
    if (typeof dmTruth.compromiseSource === 'string') {
      out[DM_TRUTH_KEY] = { compromiseSource: dmTruth.compromiseSource };
    }
  }
  return /** @type {ProjectedNpc} */ (out);
}

/**
 * THE POOL PROJECTION. Every graduated identity in the world, audience-projected.
 *
 * @param {Object} args
 * @param {{ spatialLedgers?: unknown } | null | undefined} args.worldState
 * @param {number} [args.tick]
 * @param {boolean} [args.includeCovert]  DM surfaces ⇒ true; PLAYER views ⇒ false (default)
 * @param {string|null} [args.settlementId]  when set, the LOCAL view (design §6c): only
 *   people whose current home is this settlement, i.e. placed here or roaming from here
 * @returns {{ roamers: ProjectedNpc[], placed: ProjectedNpc[], total: number }}
 */
export function projectNpcPool({ worldState, tick = 0, includeCovert = false, settlementId = null }) {
  const ledger = npcLedgerOf(worldState);
  const opts = { includeCovert: includeCovert === true, tick: Number(tick) || 0 };
  const scope = settlementId == null ? null : String(settlementId);

  /** @type {ProjectedNpc[]} */
  const roamers = [];
  for (const id of Object.keys(ledger.roamers).sort(compareCodepoint)) {
    const rec = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (ledger.roamers[id]));
    // A roamer's "home" for the local view is WHERE THEY ARE RESTING (design §6c: the
    // unaffiliates section of a settlement dossier), falling back to where they came
    // from while they have taken no lodging yet. The fallback is what keeps every H1
    // record, which carries no residency at all, projecting into exactly the local view
    // it projected into before this lane existed.
    const resting = rec.whereaboutsUnknown === true || !!String(asObject(rec.transit).toId || '')
      ? ''
      : String(asObject(rec.residency).settlementId || asObject(rec.dmAssignment).atSettlementId || '')
        || String(asObject(rec.originRef).settlementId || '');
    if (scope !== null && resting !== scope) continue;
    roamers.push(projectRecord(id, rec, ledger.exclusions[id] || [], opts));
  }
  /** @type {ProjectedNpc[]} */
  const placed = [];
  for (const id of Object.keys(ledger.placed).sort(compareCodepoint)) {
    const rec = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (ledger.placed[id]));
    if (scope !== null && String(rec.hostSettlementId || '') !== scope) continue;
    placed.push(projectRecord(id, rec, ledger.exclusions[id] || [], opts));
  }
  return { roamers, placed, total: roamers.length + placed.length };
}

/**
 * THE AUDIT HELPER. Every path at which a DM-truth key appears anywhere inside a value,
 * at any depth, through objects and arrays.
 *
 * Exported rather than inlined into a test because it is the same predicate the runtime
 * visibility audit will want when the Wanderers register lands (H4), and because a
 * negative assertion needs a POSITIVE anchor from the SAME function to prove it is not
 * vacuous: the DM projection must report a non-empty path list through this very
 * helper, or the empty player result proves nothing about the helper's liveness.
 *
 * @param {unknown} value
 * @param {string} [path]
 * @returns {string[]} dotted paths, in traversal order
 */
export function findDmTruthPaths(value, path = '$') {
  /** @type {string[]} */
  const hits = [];
  if (Array.isArray(value)) {
    value.forEach((item, i) => hits.push(...findDmTruthPaths(item, path + '[' + String(i) + ']')));
    return hits;
  }
  if (!value || typeof value !== 'object') return hits;
  for (const [key, child] of Object.entries(/** @type {Record<string, unknown>} */ (value))) {
    const here = path + '.' + key;
    if (key === DM_TRUTH_KEY) hits.push(here);
    hits.push(...findDmTruthPaths(child, here));
  }
  return hits;
}
