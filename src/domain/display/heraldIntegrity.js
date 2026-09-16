/**
 * domain/display/heraldIntegrity.js — THE MANIPULATION DISCLOSURE (SP-6's
 * MANIPULATION DISCLOSURE + MUTATED PLANT laws, 2026-08-03; content from
 * docs/content/RECEIPT_POOLS_CAUSAL.md §4).
 *
 * Within the causality popup, every chain link carries its INFORMATION-INTEGRITY
 * register, honestly distinguished by the records the engine ALREADY holds:
 *
 *   CLEAN              the receipt as it happened.
 *   WORN IN THE TELLING organic hop-drift/exaggeration — AUTHORLESS.
 *   PLANTED            intentional manipulation: BY WHOM and FOR WHAT PURPOSE.
 *   PLANTED, THEN WORN the seed AND the growth, both halves shown.
 *   UNKNOWN            the records cannot classify it. Never guessed.
 *
 * ── THE SEED-NOT-GROWTH LAW ─────────────────────────────────────────────────
 * The planter owns the SEED, never the GROWTH. A planted idea that mutated
 * further in the carrying still shows the ORIGINAL INTENT — commissioner,
 * purpose, and the planted assertion AS SEEDED — while the post-planting wear
 * stays AUTHORLESS. Mutations are never re-attributed to the commissioner: the
 * world may judge the planter for the harvest; the RECORD charges them only for
 * the sowing. The organic case NEVER names an author, INCLUDING the wear atop a
 * plant.
 *
 * ── WHY THIS MODULE SITS OUTSIDE THE CONTAMINATION FENCE ────────────────────
 * The fence forbids the Herald's COMPOSERS from reading a rumor ledger, a belief
 * map, or a disinfo record AS A CONTENT SOURCE — their inputs are truth-side
 * events and receipts only. This module is not a composer: it is the DM's AUDIT
 * REGISTER over the same records, and it contributes no word to a headline, a
 * subheader or a telling. `heraldCausalVoice.js` (the composer) therefore does
 * not — and by pin may not — import this file; the popup composes the two
 * side by side. AUDIENCE: dm-only. A player projection strips the disclosure
 * whole rather than rendering a redacted stub.
 *
 * DERIVES FROM PERSISTED PROVENANCE ONLY. No new state, no writer, no rng, no
 * clock. A link the records cannot classify renders UNKNOWN (R-28 at the audit
 * grain).
 *
 * @enforced-by tests/domain/heraldIntegrity.test.js
 * @enforced-by tests/lint/heraldContaminationFence.test.js
 */

import { pickCausal, timeBandOf, timeBandWord } from './heraldCausalGrammar.js';

/** The five states, in disclosure order. Closed vocabulary (finite semantics). */
export const INTEGRITY_STATES = Object.freeze(['clean', 'worn', 'planted', 'planted_worn', 'unknown']);

/**
 * §4 THE INTEGRITY-DISCLOSURE LINES, verbatim. Slots: {house} {npc} {settlement}
 * {purpose} {timeband_since}.
 *
 * The WORN pool is authorless BY CONSTRUCTION — no variant carries {house} or
 * {npc}, and the pin asserts it. The PLANTED, THEN WORN pool names the sowing
 * only; every one of its variants attributes the growth to the road.
 */
export const DISCLOSURE_LINES = Object.freeze({
  clean: Object.freeze([
    'The record carries this as it happened.',
    'No hand touched this on the road; it arrived as it left.',
    'What was said is what was so.',
  ]),
  worn: Object.freeze([
    'The tale grew in the carrying; nobody grew it on purpose.',
    'Worn in the telling — each mouth added a little, and no mouth owned it.',
    'What left as a report arrived as a story; the road charges no one.',
    'The drift here is the ordinary kind: distance, seasons, and retelling.',
  ]),
  planted: Object.freeze([
    'Planted by {house}, to {purpose}. The record holds the sowing.',
    "This did not spring up; it was set — {house}'s hand, {timeband_since}, and the purpose is entered: {purpose}.",
    'A bought tale: {npc} carried it, {house} paid for it, and what it was for is on the record — {purpose}.',
    'The seed is signed. {house} planted this at {settlement} to {purpose}, and the ledger has held the receipt since.',
  ]),
  planted_worn: Object.freeze([
    'Planted by {house} to {purpose} — and grown in the carrying into something its planter never wrote. The record charges the sowing; the rest is the road’s.',
    "The seed was {house}'s; the harvest is nobody's design. What was set as a whisper walks now as a tale twice its size.",
    'Begun on purpose, finished by accident: {house} set it, {timeband_since}, and every mouth since has made it stranger.',
    'The intent is on the record — {house}, to {purpose}. What the tale became after is wear, and wear has no author.',
  ]),
  unknown: Object.freeze([
    'The record cannot say where this began; it is old, and its first carrier is not entered.',
    'Provenance ends here. What stands before this link was never receipted, and the paper will not invent it.',
    'Unknown — and marked so, because a guessed culprit would be a second manipulation.',
  ]),
});

/**
 * THE SEEDED ASSERTION, as a closed band phrase. The disinfo record holds only
 * `intent` + `assertedBand` vs `trueBand`; this is the in-world reading of that
 * pair and nothing more. Never a figure — the bands are the whole vocabulary.
 */
const SEEDED_ASSERTION = Object.freeze({
  inflate: 'a picture of strength the place did not have',
  deflate: 'a whisper of weak walls',
});

/**
 * THE PURPOSE VOCABULARY — closed, and every member is warranted by a field the
 * record already carries. `intent` is validated by `commissionedPlantAt` to be
 * exactly 'inflate' or 'deflate'; a `commission.target.purpose` token, when the
 * envelope carries one, wins because it is the recorded true purpose.
 */
const PURPOSE_BY_INTENT = Object.freeze({
  inflate: 'deter a neighbour that was measuring it for war',
  deflate: 'make a neighbour think it cheap to take',
});

/** The typed purposes a commission target may record. Unknown token ⇒ no purpose. */
const TARGET_PURPOSES = Object.freeze({
  intercepted_envoy_appraisal: 'bend an envoy’s appraisal before it was carried home',
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * The disinfo ledger off a worldState, indexed by the synthetic lineage id the
 * writer stamps (`disinfo:{liarId}:{audienceId}:{seededTick}`). Plain read of the
 * persisted ledger — no engine import, no writer.
 * @param {unknown} worldState
 * @returns {Map<string, Record<string, unknown>>}
 */
export function disinfoByLineage(worldState) {
  /** @type {Map<string, Record<string, unknown>>} */
  const out = new Map();
  const ledger = asObject(asObject(asObject(worldState).spatialLedgers).disinfo);
  for (const key of Object.keys(ledger).sort()) {
    const record = asObject(ledger[key]);
    const lineageId = text(record.lineageId);
    if (lineageId && !out.has(lineageId)) out.set(lineageId, record);
  }
  return out;
}

/**
 * THE COMMISSIONER + THE PURPOSE, read off one disinfo record. An ordinary court
 * lie carries no commission: its planter is the seat that seeded it, which the
 * record names as `liarId`. A PAID plant carries the commission envelope, whose
 * `patronId` is the house that bought the story — and the buyer, not the mouth,
 * is who the record charges.
 *
 * @param {Record<string, unknown>} record
 * @returns {{ commissionerId: string, mouthpieceId: string, purpose: string, seededAssertion: string, seededTick: number|null }}
 */
export function plantAttribution(record) {
  const row = asObject(record);
  const commission = asObject(row.commission);
  const receipt = asObject(commission.receipt);
  const target = asObject(commission.target);
  const intent = text(receipt.intent);
  const patronId = text(receipt.patronId);
  const targetPurpose = text(target.purpose);
  const seededTick = Number.isFinite(row.seededTick) ? Number(row.seededTick) : null;
  return {
    commissionerId: patronId || text(row.liarId),
    mouthpieceId: text(row.spokespersonNpcId),
    purpose: TARGET_PURPOSES[targetPurpose] || PURPOSE_BY_INTENT[intent] || '',
    seededAssertion: SEEDED_ASSERTION[intent] || '',
    seededTick,
  };
}

/**
 * A link's integrity state, derived from persisted provenance ONLY.
 *
 * `lineageIds` is the join: a telling that carries a synthetic disinfo lineage was
 * PLANTED. Wear is the ordinary telling-drift the rumor record already measures
 * (`accuracy01 < 1`, or a positive `hopCount` with a recorded drift) — and wear
 * ATOP a plant is the compound state, never a re-attribution.
 *
 * The honest terminal: a link with no resolvable receipt and no lineage is
 * UNKNOWN. A link that resolves to a truth-side receipt with no manipulation
 * marker at all is CLEAN — clean is EVIDENCED (a receipt exists and carries
 * nothing), never assumed from silence.
 *
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {Object} args.link
 * @param {boolean} [args.link.resolved]      the walk resolved this hop to a receipt
 * @param {ReadonlyArray<string>} [args.link.lineageIds]
 * @param {number} [args.link.accuracy01]     1 ⇒ no drift; < 1 ⇒ worn
 * @param {number} [args.link.hopCount]
 * @param {number} [args.link.tick]
 * @param {number} [args.nowTick]
 * @param {number} [args.intervalWeeks]
 * @returns {{ state: typeof INTEGRITY_STATES[number], commissionerId: string, mouthpieceId: string,
 *   purpose: string, seededAssertion: string, sinceTicks: number|null }}
 */
export function classifyLinkIntegrity({ worldState, link, nowTick = null, intervalWeeks = 1 }) {
  const row = asObject(link);
  const lineageIds = Array.isArray(row.lineageIds) ? row.lineageIds.map(String) : [];
  const accuracy = Number.isFinite(row.accuracy01) ? Number(row.accuracy01) : 1;
  const worn = accuracy < 1;
  const index = disinfoByLineage(worldState);
  /** @type {Record<string, unknown>|null} */
  let plant = null;
  for (const id of [...lineageIds].sort()) {
    const found = index.get(id);
    if (found) { plant = found; break; }
  }

  if (plant) {
    const attribution = plantAttribution(plant);
    const sinceTicks = Number.isFinite(nowTick) && attribution.seededTick != null
      ? Math.max(0, Number(nowTick) - attribution.seededTick)
      : null;
    return {
      state: worn ? 'planted_worn' : 'planted',
      commissionerId: attribution.commissionerId,
      mouthpieceId: attribution.mouthpieceId,
      purpose: attribution.purpose,
      seededAssertion: attribution.seededAssertion,
      sinceTicks,
      // The band is computed here so the popup never re-derives a duration.
      // Present only when the record dates the sowing.
      ...(sinceTicks == null ? {} : { timeBandId: timeBandOf(sinceTicks, intervalWeeks).id }),
    };
  }

  // AUTHORLESS FROM HERE DOWN. Nothing below may carry a commissioner, and the
  // returned attribution fields are empty strings by construction — the wear
  // atop an unplanted telling has no author, and neither has an unclassifiable
  // link. This is the hardest negative in the disclosure and it is structural:
  // the only branch that fills `commissionerId` is the plant branch above.
  const state = worn ? 'worn' : (row.resolved === true ? 'clean' : 'unknown');
  return { state, commissionerId: '', mouthpieceId: '', purpose: '', seededAssertion: '', sinceTicks: null };
}

/**
 * Render one disclosure line for a classified link. DM-ONLY: a caller with
 * `seesSecrets === false` gets null and renders nothing at all — the player
 * projection strips the disclosure whole rather than showing a hole where a name
 * would sit.
 *
 * A PLANTED line that has no commissioner to name falls back within the same
 * state to a variant that needs none; if the state cannot be told truthfully, the
 * disclosure degrades to UNKNOWN rather than printing an unfilled slot.
 *
 * @param {Object} args
 * @param {ReturnType<typeof classifyLinkIntegrity>} args.integrity
 * @param {string} args.seed
 * @param {boolean} args.seesSecrets
 * @param {(id: string) => string} [args.nameOf]
 * @param {string} [args.settlementName]
 * @param {number} [args.intervalWeeks]
 * @returns {{ state: string, line: string, seededAssertion: string }|null}
 */
export function disclosureFor({ integrity, seed, seesSecrets, nameOf = (id) => String(id), settlementName = '', intervalWeeks = 1 }) {
  if (!seesSecrets) return null;
  const state = INTEGRITY_STATES.includes(integrity?.state) ? integrity.state : 'unknown';
  const houseName = integrity?.commissionerId ? nameOf(integrity.commissionerId) : '';
  const npcName = integrity?.mouthpieceId ? nameOf(integrity.mouthpieceId) : '';
  const purpose = text(integrity?.purpose);
  const since = integrity?.sinceTicks == null
    ? ''
    : (timeBandWord(timeBandOf(integrity.sinceTicks, intervalWeeks), 'since') || '');

  const needs = (line) => [
    ['{house}', houseName],
    ['{npc}', npcName],
    ['{purpose}', purpose],
    ['{settlement}', settlementName],
    ['{timeband_since}', since],
  ].every(([token, fill]) => !line.includes(token) || !!fill);

  const pool = (DISCLOSURE_LINES[state] || DISCLOSURE_LINES.unknown).filter(needs);
  // No variant of this state can be filled truthfully ⇒ the honest terminal.
  const usable = pool.length ? pool : DISCLOSURE_LINES.unknown;
  const chosen = pickCausal(usable, `${seed}::integrity::${state}`) || DISCLOSURE_LINES.unknown[0];
  const line = chosen
    .replace(/\{house\}/g, houseName)
    .replace(/\{npc\}/g, npcName)
    .replace(/\{purpose\}/g, purpose)
    .replace(/\{settlement\}/g, settlementName)
    .replace(/\{timeband_since\}/g, since);
  return {
    state: pool.length ? state : 'unknown',
    line,
    // The ORIGINAL INTENT, always — shown beside the compound state's wear half.
    seededAssertion: (state === 'planted' || state === 'planted_worn') ? text(integrity?.seededAssertion) : '',
  };
}
