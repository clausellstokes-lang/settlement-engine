/**
 * domain/worldPulse/concludedWarRecord.js — W-MEM's record shape and its one
 * normalizer. THE REMEMBRANCE-GRADE LEDGER OF CONCLUDED WARS (DESIGN_W_MEM §2).
 *
 * A dependency-light leaf, deliberately: worldState.js calls the normalizer from
 * inside the conditional-ledger loop, so this file may import only what the
 * closed casus taxonomy and the id slug need. It is the warCoalitionLedger
 * normalizeJoinAnchor precedent — the authority for what a record IS lives beside
 * the shape, never inside the 800-line persistence head.
 *
 * ── WHAT THIS FILE REFUSES TO STORE ─────────────────────────────────────────────
 * NO PROSE (DESIGN_W_MEM §2.2's no-prose law). No authored sentence, no copied
 * headline, no epitaph, no termination reason. Seven of the close roads emit no
 * sentence at all; the one candidate voice narrates a LIVE war's continuation and
 * sits under a standing reader-facing refusal; and copied prose would freeze
 * settlement names against live renames and can smuggle believed-layer numerics.
 * Sentences are authored at RENDER time from these typed facts.
 *
 * NO RAW CONTROL VALUES. No sue pressure, no believed-vs-truth diagnostics, no raw
 * strengths or scores. Costs are BANDS, and a band here is a KEY into a closed
 * register — never the register's rendered phrase (see the band note below).
 *
 * NO INVENTION. The record stores what the estate actually held at the war's
 * conclusion, thinner where the estate itself was thinner. A world whose casus
 * pins were minted under the legacy shape records the legacy shape.
 *
 * ── IMMUTABILITY (THE SEAL LAW, DESIGN_W_MEM §2.4) ──────────────────────────────
 * A record is STAGED when its first belligerent edge concludes and SEALED on the
 * tick no live deployment still folds onto its id. Immutability binds AT SEAL: a
 * sealed record is append-closed forever. Staged records accept exactly two
 * writes — a participant edge resolving, and the seal itself.
 *
 * ── FORWARD VERSIONS ────────────────────────────────────────────────────────────
 * A newer build's record must survive a round trip through an older reader, so
 * unknown close roads, unknown fact channels and unknown record fields are
 * PRESERVED VERBATIM. Only the casus taxonomy is validated closed, because that
 * taxonomy is walker-enforced across five surfaces and a foreign type there is a
 * corruption rather than a future.
 *
 * @see src/domain/worldPulse/warReasonTaxonomy.js — the closed 16-reason authority.
 * @see src/domain/certification/warEndingClassifier.js — the read-side classifier
 *      that derives a war's ENDING from the fact block stored here. One resolver:
 *      the ending is never stored, so a classifier improvement retroactively
 *      improves every war already recorded.
 */

import { isWarReasonType } from './warReasonTaxonomy.js';
import { stablePart } from './stablePart.js';

/** Per-record schema version. Bumped only by a shape migration, never by a field add. */
export const CONCLUDED_WAR_SCHEMA_VERSION = 1;

/** Hard cap on the engagement epitomes one record carries (DESIGN_W_MEM §2.2). */
export const NOTABLE_ENGAGEMENT_CAP = 5;

/**
 * THE MECHANICAL CLOSE ROAD — a FACT CHANNEL, not an ending ranking.
 *
 * The war layer's carrier collapses four of its seven roads onto one withdrawal
 * token, so the road is recovered at the writer from inputs it provably holds and
 * recorded here. Thirteen tokens: the seven strategic-recall causes the estate
 * really stamps, plus the six structural roads.
 *
 * ⚠ The recall half is a CENSUS of live stamp sites, not a wish list. An unmapped
 * cause reds the discovery arm rather than mis-filing a war — which is why the
 * census was completed before this register was frozen.
 * @type {ReadonlyArray<string>}
 */
export const CLOSE_ROADS = Object.freeze([
  'attacker_lost',
  'authority_verdict',
  'conquest',
  'convoy_lost_debark',
  'envoy_terms_carried_home',
  'field_battle_retreat',
  'razing',
  'return_home',
  'siege_abandoned',
  'sue_for_peace',
  'sue_for_peace_decree',
  'target_lost',
  'wind_down',
]);

const CLOSE_ROAD_SET = new Set(CLOSE_ROADS);

/**
 * A participant's side. Allies are distinguished from principals because the
 * coalition anchor is the only durable carrier of who fought beside whom, and it
 * dies with the deployment row.
 * @type {ReadonlyArray<string>}
 */
export const PARTICIPANT_SIDES = Object.freeze([
  'attacker', 'attacker_ally', 'defender', 'defender_ally',
]);

const PARTICIPANT_SIDE_SET = new Set(PARTICIPANT_SIDES);

/**
 * The two record FORMS, decided ONCE at seal by the write-time governor and
 * immutable from then on (DESIGN_W_MEM §2.5). Nothing is ever demoted, folded or
 * pruned; size is governed when the record is written, never afterwards.
 *
 * THE FORM IS STORED, AND THAT IS THE POINT: without it a reader cannot tell an
 * epitome's absent engagement list from a full record that genuinely had nothing
 * notable to say. An absence that cannot be distinguished from a silence is the
 * defect this field exists to refuse.
 * @type {ReadonlyArray<string>}
 */
export const CONCLUDED_WAR_FORMS = Object.freeze(['full', 'epitome']);

const FORM_SET = new Set(CONCLUDED_WAR_FORMS);

/** The territorial outcome kinds. Closed: a war either held a place or burned it. */
export const TERRITORIAL_OUTCOME_KINDS = Object.freeze(['occupied', 'razed']);

const TERRITORIAL_KIND_SET = new Set(TERRITORIAL_OUTCOME_KINDS);

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/** @param {unknown} a @param {unknown} b @returns {number} */
function codepoint(a, b) {
  return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
}

/**
 * THE WAR ID — the address the Herald's arc facet has been reading with no writer
 * to answer it.
 *
 * `war.<low>.<high>.<openedTick>.<seq>`: the sorted ORIGINAL belligerent pair (the
 * render-time namer's address), the origin deployment's opening tick, and a
 * deterministic sequence leg. The tick disambiguates the repeat war a century
 * later. The seq exists because pair+tick alone has a measured structural opening:
 * two settlements can open RECIPROCAL sieges on the SAME tick, since the blocking
 * gate reads the PRE-tick graph and neither sees the other's same-tick mint. A
 * reciprocal declaration folds onto ONE record; the seq disambiguates only a
 * genuinely distinct second episode.
 *
 * ⚠ Codepoint order over these ids sorts ticks LEXICALLY, so the opening tick is
 * ALSO carried as a field and every consumer orders by FIELD, never by key.
 *
 * @param {{ lowId: unknown, highId: unknown, openedTick: unknown, seq?: unknown }} args
 * @returns {string}
 */
export function warIdFor({ lowId, highId, openedTick, seq = 0 }) {
  const tick = wholeTick(openedTick) ?? 0;
  const n = Number(seq);
  const suffix = Number.isInteger(n) && n >= 0 ? n : 0;
  return `war.${stablePart(lowId)}.${stablePart(highId)}.${tick}.${suffix}`;
}

/**
 * The sorted original belligerent pair — the ADDRESS. Codepoint order, the same
 * convention every pair key in the estate uses.
 * @param {unknown} aId @param {unknown} bId @returns {[string, string]}
 */
export function originPairOf(aId, bId) {
  const a = String(aId);
  const b = String(bId);
  return a <= b ? [a, b] : [b, a];
}

/**
 * One participant row. Allies carry the tick they joined and, when their edge
 * resolved before the seal, the tick they left.
 * @param {unknown} value @returns {Record<string, unknown>|null}
 */
function normalizeParticipant(value) {
  const row = recordOf(value);
  const id = text(row.id);
  const side = text(row.side);
  if (!id || !PARTICIPANT_SIDE_SET.has(side)) return null;
  const joinedTick = wholeTick(row.joinedTick);
  const leftTick = wholeTick(row.leftTick);
  const viaCallId = text(row.viaCallId);
  const label = text(row.label);
  return {
    id,
    // THE NAME AS IT STOOD at this party's conclusion — the recorded-history
    // precedent the rename writer already sets. Display resolves the LIVE name
    // first and falls back here only when the id no longer resolves, so renames
    // re-title the war and the canon-departed stay nameable.
    ...(label ? { label } : {}),
    side,
    ...(joinedTick != null ? { joinedTick } : {}),
    ...(leftTick != null ? { leftTick } : {}),
    ...(viaCallId ? { viaCallId } : {}),
  };
}

/**
 * A founding casus pin, COPIED VERBATIM from the origin deployment. The type is
 * validated against the live closed taxonomy; everything else is carried as the
 * estate stored it.
 * @param {unknown} value @returns {Record<string, unknown>|null}
 */
function normalizeCasusReason(value) {
  const row = recordOf(value);
  if (!isWarReasonType(row.type)) return null;
  const score = Number(row.score);
  const atTick = wholeTick(row.atTick);
  return {
    type: String(row.type),
    score: Number.isFinite(score) ? score : 0,
    receipt: typeof row.receipt === 'string' ? row.receipt : '',
    // Absent on a world whose pins were minted under the legacy shape. The record
    // stores what the estate stored — thinner where the estate was thinner.
    ...(atTick != null ? { atTick } : {}),
  };
}

/**
 * One applied terminal outcome. APPLIED means post-verdict: a dismissed conquest
 * contributes NO row here, so the read-side classifier honestly yields a
 * non-conquest ending for a war whose takeover did not stick.
 * @param {unknown} value @returns {Record<string, unknown>|null}
 */
function normalizeTerminalOutcome(value) {
  const row = recordOf(value);
  const id = text(row.id);
  if (!id) return null;
  const tick = wholeTick(row.tick);
  const candidateType = text(row.candidateType);
  const targetSaveId = text(row.targetSaveId);
  return {
    id,
    ...(candidateType ? { candidateType } : {}),
    ...(targetSaveId ? { targetSaveId } : {}),
    ...(tick != null ? { tick } : {}),
  };
}

/**
 * The FACT BLOCK — the persisted input to the estate's own total war-ending
 * classifier. The ending itself is NOT stored: it derives at read, so one resolver
 * owns the question and an improved classifier improves every recorded war.
 *
 * The classifier's typedef also names an attacker and a defender; those are NOT
 * duplicated here. The read-side adapter derives them from the record's
 * orientation and pair — one home per datum.
 *
 * Unknown channels survive verbatim (the forward-version law above).
 * @param {unknown} value @returns {Record<string, unknown>}
 */
function normalizeFact(value) {
  const row = recordOf(value);
  const closeRoad = text(row.closeRoad);
  const known = new Set([
    'closed', 'closeRoad', 'terminalOutcomes', 'loserDied', 'coalitionFragmented',
    'seatTransitionFamily', 'peaceReason', 'treatyWritten',
  ]);
  /** @type {Record<string, unknown>} */
  const carried = {};
  for (const key of Object.keys(row).sort(codepoint)) {
    if (!known.has(key)) carried[key] = row[key];
  }
  const terminalOutcomes = (Array.isArray(row.terminalOutcomes) ? row.terminalOutcomes : [])
    .map(normalizeTerminalOutcome)
    .filter(/** @returns {outcome is Record<string, unknown>} */ (outcome) => outcome != null);
  const seatTransitionFamily = text(row.seatTransitionFamily);
  const peaceReason = text(row.peaceReason);
  return {
    closed: true,
    // An unrecognised road is KEPT, never blanked: a newer build's token read by
    // an older reader must survive the round trip. The discovery arm is what
    // refuses an unmapped road at WRITE time, where a finding is still a finding.
    ...(closeRoad ? { closeRoad } : {}),
    terminalOutcomes,
    ...(row.loserDied === true ? { loserDied: true } : {}),
    ...(row.coalitionFragmented === true ? { coalitionFragmented: true } : {}),
    ...(seatTransitionFamily ? { seatTransitionFamily } : {}),
    ...(peaceReason ? { peaceReason } : {}),
    ...(row.treatyWritten === true ? { treatyWritten: true } : {}),
    ...carried,
  };
}

/**
 * A peace clause, SLIMMED from the authority-neutral carried sheet. The
 * negotiation internals are deliberately dropped: one is a bounded value the
 * sheet's own validator pins to zero in every valid clause, the other is an
 * undeclared-unit negotiation weight. Magnitude stays because its unit IS
 * declared by the term catalog, and one display resolver bands it.
 * @param {unknown} value @returns {Record<string, unknown>|null}
 */
function normalizeTermClause(value) {
  const row = recordOf(value);
  const type = text(row.type);
  const family = text(row.family);
  if (!type || !family) return null;
  const magnitude = Number(row.magnitude);
  const durationTicks = Number(row.durationTicks);
  const good = text(row.good);
  const assetId = text(row.assetId);
  return {
    type,
    family,
    ...(good ? { good } : {}),
    ...(assetId ? { assetId } : {}),
    ...(Number.isInteger(durationTicks) && durationTicks > 0 ? { durationTicks } : {}),
    ...(Number.isFinite(magnitude) ? { magnitude } : {}),
  };
}

/**
 * A territorial outcome — usually none or one. The fallen seat's governing label
 * is the house datum the transfer-versus-overthrow story needs, and it is the
 * estate's one durable house trace, copied before the bounded government list
 * rotates it out.
 * @param {unknown} value @returns {Record<string, unknown>|null}
 */
function normalizeTerritorialOutcome(value) {
  const row = recordOf(value);
  const settlementId = text(row.settlementId);
  const kind = text(row.kind);
  if (!settlementId || !TERRITORIAL_KIND_SET.has(kind)) return null;
  const tick = wholeTick(row.tick);
  const occupierId = text(row.occupierId);
  const fallenSeatLabel = text(row.fallenSeatLabel);
  return {
    settlementId,
    kind,
    ...(occupierId ? { occupierId } : {}),
    ...(tick != null ? { tick } : {}),
    ...(fallenSeatLabel ? { fallenSeatLabel } : {}),
  };
}

/**
 * One engagement epitome. A TYPED copy, never prose, and never a bare reference:
 * the receipt stream these ids address is a ring buffer, so a reference alone dies
 * within eighty advances — on a three-century world, essentially the whole
 * timeline. The source id is kept as a SOFT pointer: while the referent lives the
 * chronicle can be deep-linked; after it rolls off, the epitome still tells the
 * story. A Remembrance ledger may reference nothing whose lifetime it does not
 * control.
 * @param {unknown} value @returns {Record<string, unknown>|null}
 */
function normalizeEngagement(value) {
  const row = recordOf(value);
  const kind = text(row.kind);
  if (!kind) return null;
  const tick = wholeTick(row.tick);
  const settlementIds = (Array.isArray(row.settlementIds) ? row.settlementIds : [])
    .map((id) => text(id))
    .filter((id) => id !== '');
  const sourceEventId = text(row.sourceEventId);
  const region = text(row.region);
  return {
    kind,
    ...(tick != null ? { tick } : {}),
    settlementIds,
    ...(sourceEventId ? { sourceEventId } : {}),
    // The field-battle site, as a settlement id. Present only when the transit
    // layer resolved one — absent when unknown, never an empty or null sentinel.
    ...(region ? { region } : {}),
  };
}

/**
 * The banded cost. Capacity is not headcount and no headcount is invented, so
 * nothing here can leak a casualty count the estate refused to model.
 *
 * ⚠ BANDS ARE KEYS, NOT PHRASES. The remaining-strength band is a key into the
 * estate's own remaining-fraction ladder and the exhaustion band a key into the
 * war-weariness ladder; the rendered words are resolved from those keys at read.
 * Persisting the phrase would have frozen display copy into lived history and put
 * a sentence in a record whose whole discipline is that it holds none.
 * @param {unknown} value @returns {Record<string, unknown>}
 */
function normalizeCost(value) {
  const row = recordOf(value);
  const attackerRemainingBand = text(row.attackerRemainingBand);
  const rawBands = recordOf(row.exhaustionBands);
  /** @type {Record<string, string>} */
  const exhaustionBands = {};
  for (const key of Object.keys(rawBands).sort(codepoint)) {
    const band = text(rawBands[key]);
    if (band) exhaustionBands[key] = band;
  }
  return {
    ...(attackerRemainingBand ? { attackerRemainingBand } : {}),
    exhaustionBands,
  };
}

/**
 * The optional last-standing band set — the prior tick's termination-read bands
 * for this pair, copied when one was in hand at the writer's seam.
 *
 * NEVER REQUIRED, and the reason is measured: the termination evaluator sees only
 * SURVIVORS on the closing tick and runs after the deployment row is gone, so a
 * same-tick receipt for the concluding pair does not exist. A design that required
 * it would have specified a field nothing could fill.
 * @param {unknown} value @returns {Record<string, unknown>|null}
 */
function normalizeLastStanding(value) {
  const row = recordOf(value);
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of ['causeBand', 'costToContinueBand', 'costToStopBand', 'momentumBand', 'homeFrontBand']) {
    const band = text(row[key]);
    if (band) out[key] = band;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Normalize ONE concluded-war record. Returns null for a record too malformed to
 * be history — a record with no address, no opening or no conclusion is not a
 * thinner truth, it is a corruption.
 *
 * @param {unknown} value
 * @param {string} key the ledger key this record is filed under
 * @returns {Record<string, unknown>|null}
 */
export function normalizeConcludedWarRecord(value, key) {
  const row = recordOf(value);
  const warId = text(row.warId) || text(key);
  if (!warId) return null;

  const pair = Array.isArray(row.originPair) ? row.originPair.map((id) => text(id)) : [];
  if (pair.length !== 2 || !pair[0] || !pair[1] || pair[0] === pair[1]) return null;
  const originPair = originPairOf(pair[0], pair[1]);

  const originAttackerId = text(row.originAttackerId);
  if (!originAttackerId || !originPair.includes(originAttackerId)) return null;

  const openedTick = wholeTick(row.openedTick);
  const concludedTick = wholeTick(row.concludedTick);
  if (openedTick == null || concludedTick == null || concludedTick < openedTick) return null;

  const participants = (Array.isArray(row.participants) ? row.participants : [])
    .map(normalizeParticipant)
    .filter(/** @returns {p is Record<string, unknown>} */ (p) => p != null)
    .sort((a, b) => codepoint(a.id, b.id));

  const casusReasons = (Array.isArray(row.casusReasons) ? row.casusReasons : [])
    .map(normalizeCasusReason)
    .filter(/** @returns {r is Record<string, unknown>} */ (r) => r != null);

  const sacredRow = recordOf(row.sacredAnchors);
  /** @type {Record<string, string>} */
  const sacredAnchors = {};
  for (const anchorKey of ['attackerPatronRef', 'defenderPatronRef']) {
    const ref = text(sacredRow[anchorKey]);
    if (ref) sacredAnchors[anchorKey] = ref;
  }

  const territorialOutcomes = (Array.isArray(row.territorialOutcomes) ? row.territorialOutcomes : [])
    .map(normalizeTerritorialOutcome)
    .filter(/** @returns {t is Record<string, unknown>} */ (t) => t != null);

  const notableEngagements = (Array.isArray(row.notableEngagements) ? row.notableEngagements : [])
    .map(normalizeEngagement)
    .filter(/** @returns {e is Record<string, unknown>} */ (e) => e != null)
    .slice(0, NOTABLE_ENGAGEMENT_CAP);

  const terms = (Array.isArray(row.terms) ? row.terms : [])
    .map(normalizeTermClause)
    .filter(/** @returns {t is Record<string, unknown>} */ (t) => t != null);

  const lastStanding = normalizeLastStanding(row.lastStanding);
  const victorId = text(row.victorId);
  const form = FORM_SET.has(text(row.form)) ? text(row.form) : 'full';

  // ⛔ A STAGED RECORD WITH NO LIVE EDGE LEFT TO FOLD IS SEALED HERE, not left in a
  // fourth state. That case is an import artifact — a save carried in mid-war whose
  // deployments did not come with it — and the road it closed on is preserved as
  // recorded. Load-time hygiene owns it because nothing else will ever revisit it.
  const sealed = row.sealed !== false;

  /** @type {Record<string, unknown>} */
  const known = {
    schemaVersion: CONCLUDED_WAR_SCHEMA_VERSION,
    warId,
    originPair,
    originAttackerId,
    ...(row.mutual === true ? { mutual: true } : {}),
    openedTick,
    concludedTick,
    sealed,
    form,
    participants,
    casusReasons,
    ...(Object.keys(sacredAnchors).length ? { sacredAnchors } : {}),
    fact: normalizeFact(row.fact),
    ...(victorId ? { victorId } : {}),
    ...(terms.length ? { terms } : {}),
    territorialOutcomes,
    cost: normalizeCost(row.cost),
    ...(lastStanding ? { lastStanding } : {}),
    notableEngagements,
  };

  // Forward-version carry: a field this build does not know is not a field this
  // build may delete. Appended in codepoint order so the carry is deterministic.
  for (const field of Object.keys(row).sort(codepoint)) {
    if (!Object.prototype.hasOwnProperty.call(known, field)) known[field] = row[field];
  }
  return known;
}

/**
 * THE LEDGER NORMALIZER. Runs UNGATED on every load, lit or dark, exactly as the
 * deployment ledger's own hygiene does: an arm that only cleaned malformed saves
 * while the flag was true would leave every dark world's saves un-normalized and
 * hand a later lit tick a ledger it never validated — the fail-OPEN direction, on
 * a persistence surface.
 *
 * Returns undefined for an absent, non-object or empty ledger, so the conditional
 * spread omits the key entirely and a world that has recorded no war serializes
 * byte-identically to one that never could.
 *
 * @param {unknown} value
 * @returns {Record<string, unknown>|undefined}
 */
export function normalizeConcludedWars(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const raw = /** @type {Record<string, unknown>} */ (value);
  /** @type {Record<string, unknown>} */
  const normalized = {};
  for (const key of Object.keys(raw).sort(codepoint)) {
    const record = normalizeConcludedWarRecord(raw[key], key);
    if (record) normalized[key] = record;
  }
  return Object.keys(normalized).length ? normalized : undefined;
}

/**
 * THE ENGINE OUTCOME → FACT ROW conversion, homed here because the fact row's SHAPE is
 * this file's business and the writer's is placement. Returns null for an outcome that
 * is not one of the two terminal kinds a war can end on.
 *
 * ⚠ THE TICK IS RESOLVED, NEVER ASSUMED. The razing road is recovered downstream by
 * RE-MINTING the outcome id from (road, razer, victim, TICK) and comparing for EQUALITY
 * — ids are never parsed, because settlement ids may contain dots and a mis-split would
 * mis-attribute an atrocity. Resolve the tick wrongly and EVERY razing reports its road
 * unreconstructable, taking its whole war to unclassified. Outcomes publish it as
 * `generatedAtTick`; a bare `tick` is accepted so a hand-built fixture reads like a real
 * outcome; and the caller's own tick is the exact fallback for a same-tick writer.
 *
 * @param {unknown} value @param {number} tick
 * @returns {{ row: Record<string, unknown>, razed: boolean }|null}
 */
export function terminalOutcomeFrom(value, tick) {
  const outcome = recordOf(value);
  const kind = text(outcome.candidateType);
  if (kind !== 'conquest' && kind !== 'razing') return null;
  const id = text(outcome.id);
  if (!id) return null;
  return {
    row: {
      id,
      candidateType: kind,
      targetSaveId: text(outcome.targetSaveId),
      tick: wholeTick(outcome.generatedAtTick) ?? wholeTick(outcome.tick) ?? tick,
    },
    razed: kind === 'razing',
  };
}

/**
 * Is this a close road the current build knows? Used by the WRITE side, where an
 * unmapped road is a finding worth reding a discovery arm over. The READ side
 * never asks: an unknown road on a loaded record is a future, not a fault.
 * @param {unknown} road @returns {boolean}
 */
export function isKnownCloseRoad(road) {
  return typeof road === 'string' && CLOSE_ROAD_SET.has(road);
}
