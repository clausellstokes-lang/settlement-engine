/**
 * domain/worldPulse/brokeragePlantHandoff.js — IN-0a, THE HANDOFF.
 *
 * A PURE LEAF of the information-statecraft writer family (ruling R-BLD-4). It writes
 * nothing and it decides nothing about the world; it CARRIES one already-paid thing from
 * the tick it was bought on to the tick it is told on, and it owns the two receipt shapes
 * that only a CARRIED, COMMISSIONED plant can produce.
 *
 * ── THE PROBLEM THIS LEAF EXISTS TO SOLVE (measured 2026-08-06, executed) ──
 *
 * The paid plant's whole lifecycle was already built. `brokerageServicesRules.js` mints a
 * `brokerage_plant` candidate whose `metadata.plant` carries the commission envelope;
 * `disinformationPlant.commissionedPlantAt` validates that envelope; `processLies` folds a
 * validated envelope into `nextDisinfo` under the disjoint `plant:*` namespace. What did
 * not exist was the road between them. The two consumers that want the envelope —
 * `advanceEnvoyDiplomacyPulse` (WR-7b picture targeting) and `advanceInformationStatecraft`
 * (the fold) — are called by the pulse kernel WITHOUT it, and the kernel mouths are BANKED
 * (pulseKernel 1580 / applyWorldPulse 941, scripts/.size-baseline.json): zero edits, ever.
 * Executed grep before this leaf landed: NOTHING in src read `metadata.plant`.
 *
 * ── THE ROAD, AND WHY IT IS THE ONLY ONE ──
 *
 * The envelope's one durable home is the pulse record. `compactOutcomeForHistory`
 * (pulseHelpers.js) carries `metadata: clone(outcome.metadata)` — a FULL deep clone — into
 * `pulseHistory[].selectedOutcomes[]`, and `brokerage_plant` is a PUBLIC outcome
 * (`isStateOnlyOutcome` false, `isSuppressionOnlyOutcome` false — measured), so it rides
 * that array rather than the mechanical one. But the record is appended at the very END of
 * the pulse, AFTER both consumers have run. So at either consumer's head the freshest
 * readable record is the PRIOR tick's, and the handoff is a ONE-WEEK LAG by construction —
 * which is law M and is thematically exact: a commission takes a week to become a telling.
 *
 * ── THE TRANSPORT HAS A CEILING, AND IT IS NOT THIS LEAF'S (declared 2026-08-06) ──
 *
 * The road's carrying capacity is set upstream and silently: `pulseKernel` writes
 * `selectedOutcomes: publicSelectedOutcomes.slice(0, PULSE_RECORD_OUTCOME_WINDOW)`. This
 * leaf reads ONLY that array, so a `brokerage_plant` that lands outside the window on a
 * busy tick is DROPPED — the patron is charged, the act narrates, and nothing is planted,
 * which is precisely the live defect IN-0a exists to close, restored by a crowded week.
 *
 * MEASURED 2026-08-06, executed over the whole property suite (3,716 real
 * `simulateCampaignWorldPulse` pulses, instrumented at the kernel's own write): the
 * distribution of `publicSelectedOutcomes.length` runs 0..18 and NOTHING exceeded the
 * window — headroom of six outcomes, never consumed in the estate's corpus. It is
 * nonetheless reachable rather than impossible: `rollCandidates`' own budget is
 * `maxAuto = 7 + floor(√(max(0, N − 24)))` in realm size N (realmScaling.js), so a realm
 * of ~313 settlements pushes the auto budget alone to the window, before the guaranteed
 * proposal admissions that ride on top of it.
 *
 * The window is therefore DECLARED here rather than assumed, and pinned: the constant
 * below is proven equal to the number pulseKernel actually spells, so moving the kernel's
 * literal reds this leaf's pins and forces whoever moves it to re-reason about the carry.
 * Widening the transport is a KERNEL edit (both mouths are banked) and belongs to IN-1
 * with the pendingPlants deposit; it is a declared residual, not an open defect to re-find.
 *
 * THE CONSUME-ONCE DOUBLE GUARD is borrowed VERBATIM from the D-3 intel lane
 * (informationStatecraft.js's intelTransfers consume arm): the record's tick must be
 * EXACTLY `tick - PLANT_HANDOFF_LAG_TICKS`, and the envelope's own
 * `receipt.commissionedAtTick` must be exactly that far behind too. Exact-age, never a
 * lower bound: a same-tick deposit has not travelled yet and a stale one is dropped, never
 * re-carried. Each applied commission is therefore carried EXACTLY once, without any new
 * world state and without a second writer.
 *
 * ── WHAT THE CARRY RE-STAMPS, AND WHAT IT MUST NOT ──
 *
 * The commission was PAID at tick T; the story is SEEDED at tick T+1. The carry moves the
 * SEED side to the fold tick — `record.seededTick`, `record.lineageId` (whose tick segment
 * IS the seed tick), and `override.lastUpdateTick` (the belief is written NOW, and claiming
 * otherwise would hand reconcileBelief a belief a week older than it is). The RECEIPT is
 * never touched: `receipt.commissionedAtTick` stays at T, because it is DM truth about when
 * a patron paid and moving it would put a one-week falsehood inside the very record the DM
 * reads to audit the lie. The lag is therefore VISIBLE in the folded record rather than
 * laundered out of it.
 *
 * Re-stamping the seed side (rather than relaxing the fold's freshness rule) is also what
 * keeps `envoyInterceptionStage.prepareEnvoyPlantTargets` — a WAR-OWNED file this slice does
 * not touch — correct and byte-unedited: its guard requires `record.seededTick === tick`,
 * and a carried envelope satisfies it exactly.
 *
 * PURE, TOTAL, ZERO-DRAW: no rng, no clock, no mutation, no I/O; every function is total on
 * garbage and returns an empty result rather than throwing. Nothing here validates the
 * envelope — the carry feeds THROUGH `commissionedPlantAt`, never around it (seam contract
 * two), and a forged or malformed row dies at that boundary as it always did.
 *
 * @enforced-by tests/domain/brokeragePlantHandoffPins.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { brokerageEffectsActive } from './brokerageStamps.js';
import { PLANT_HANDOFF_LAG_TICKS } from './disinformationPlant.js';

/**
 * The candidate type whose applied receipt carries a paid envelope. One frozen literal so
 * the reader and the producer (brokerageServicesRules.BROKERAGE_ACTS) can be pinned equal
 * rather than trusted to agree.
 * @type {string}
 */
export const BROKERAGE_PLANT_CANDIDATE_TYPE = 'brokerage_plant';

/** The news kind minted when a carried plant is still standing a week after it landed. */
export const PLANT_TOOK_KIND = 'plant_took';

/**
 * THE TRANSPORT'S CEILING — the number of public selected outcomes `pulseKernel` keeps on
 * a pulse record, and therefore the most plants one week can carry (see the header block).
 *
 * DECLARED here, DERIVED nowhere: this leaf must not import the kernel (it is a pure leaf
 * of the writer family and the kernel imports IT). So the constant is a restatement, and a
 * restatement goes stale — which is why the pins EXTRACT the kernel's own literal from
 * source and assert it equals this number. Change one without the other and IN-0a reds.
 * @type {number}
 */
export const PULSE_RECORD_OUTCOME_WINDOW = 24;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function strictText(v) {
  return typeof v === 'string' && v.length > 0 && v.trim() === v ? v : '';
}

/** @param {unknown} v @returns {number | null} */
function wholeTick(v) {
  return Number.isInteger(v) && Number(v) >= 0 ? Number(v) : null;
}

/**
 * Re-stamp ONE applied envelope onto the fold tick, or null when it is not a carry.
 * The exact-key and cross-field proofs are deliberately NOT repeated here: this leaf
 * hands its result to `commissionedPlantAt`, which is the one boundary that turns an
 * envelope into state, and duplicating its law here would create a second place for the
 * two to disagree.
 * @param {unknown} value the applied candidate's `metadata.plant`
 * @param {number} now the fold tick
 * @returns {Record<string, unknown>|null}
 */
function carriedEnvelope(value, now) {
  const row = asObject(value);
  const record = asObject(row.record);
  const override = asObject(row.override);
  const receipt = asObject(row.receipt);
  const key = strictText(row.key);
  const liarId = strictText(record.liarId);
  const audienceId = strictText(record.audienceId);
  const commissionedAtTick = wholeTick(receipt.commissionedAtTick);
  // THE SECOND HALF OF THE CONSUME-ONCE GUARD. The record's tick already proved WHICH
  // pulse this row came from; this proves the envelope inside it was bought on that same
  // pulse. Both must hold, so an envelope can be carried on exactly one tick of its life.
  if (!key || !liarId || !audienceId || commissionedAtTick == null
    || now - commissionedAtTick !== PLANT_HANDOFF_LAG_TICKS) return null;
  return {
    key,
    record: { ...record, seededTick: now, lineageId: `disinfo:${liarId}:${audienceId}:${now}` },
    override: { ...override, lastUpdateTick: now },
    receipt: { ...receipt },
  };
}

/**
 * THE HANDOFF. Every paid plant applied on the previous pulse, re-stamped for THIS tick's
 * fold, codepoint-ordered by ledger key and deduped by it.
 *
 * DORMANT ⇒ an immediate empty array: `brokerageEffectsActive` is exactly IN-0a's declared
 * gate composition (`informationBrokeragesEnabled` AND `infoStatecraftEnabled`, over a
 * live infoMode and the spatial-canon marker), so with either flag absent this reads no
 * history, allocates nothing, and both consumers behave as they did before this leaf
 * existed — byte-identical.
 *
 * A deliberately UNTARGETED carry: any `target` a prior tick attached is dropped, because
 * an envoy-picture address names an errand at a tick that has since moved. `envoyPulse`
 * attaches this tick's address to this tick's carry.
 *
 * @param {unknown} worldState
 * @param {unknown} tick
 * @returns {Array<Record<string, unknown>>}
 */
export function appliedPlantEnvelopesAt(worldState, tick) {
  if (!brokerageEffectsActive(worldState)) return [];
  const now = wholeTick(tick);
  if (now == null || now < PLANT_HANDOFF_LAG_TICKS) return [];
  const history = asObject(worldState).pulseHistory;
  const rows = Array.isArray(history) ? history : [];
  const record = asObject(rows[rows.length - 1]);
  if (wholeTick(record.tick) !== now - PLANT_HANDOFF_LAG_TICKS) return [];
  const outcomes = Array.isArray(record.selectedOutcomes) ? record.selectedOutcomes : [];
  /** @type {Map<string, Record<string, unknown>>} */
  const byKey = new Map();
  for (const raw of outcomes) {
    const outcome = asObject(raw);
    if (outcome.candidateType !== BROKERAGE_PLANT_CANDIDATE_TYPE) continue;
    const carried = carriedEnvelope(asObject(outcome.metadata).plant, now);
    if (carried && !byKey.has(String(carried.key))) byKey.set(String(carried.key), carried);
  }
  return [...byKey.keys()].sort(compareCodepoint)
    .map((key) => /** @type {Record<string, unknown>} */ (byKey.get(key)));
}

/**
 * THE TAKE. A DM-truth beat for the week a bought story is still standing in the court it
 * was bought into — the moment the commission actually became a belief.
 *
 * ONE-SHOT WITHOUT STATE: it fires on the single tick where the record is exactly one week
 * old AND the mark's current believed band is the band that was asserted. A week older and
 * the plant is simply an old lie; a band away and it never took. That makes "took" a read
 * over two numbers the ledger already holds rather than a new flag on the record, and it
 * keeps the beat out of hum territory (the anti-hum law) without a cooldown of its own.
 *
 * ONLY a COMMISSIONED record can mint it: `commission` is stamped by `commissionedPlantAt`
 * and a court's own garrison bluff never carries one, so a spontaneous lie holding its band
 * is silent here and stays IN-2's business.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.record the carried-forward DisinfoRecord
 * @param {number} args.currentBand the audience's believed strength band right now
 * @param {number} args.tick
 * @param {(id: string) => string} args.nameFor
 * @returns {Record<string, unknown>|null}
 */
export function plantTookEntry({ record, currentBand, tick, nameFor }) {
  const rec = asObject(record);
  const receipt = asObject(asObject(rec.commission).receipt);
  const seededTick = wholeTick(rec.seededTick);
  const now = wholeTick(tick);
  const asserted = wholeTick(rec.assertedBand);
  const marketName = strictText(receipt.marketName);
  if (!marketName || seededTick == null || now == null || asserted == null
    || now - seededTick !== PLANT_HANDOFF_LAG_TICKS
    || Math.round(Number(currentBand)) !== asserted) return null;
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);
  const liarId = strictText(rec.liarId);
  const audienceId = strictText(rec.audienceId);
  const subjectId = strictText(rec.subjectId);
  return {
    // THE FEED'S ADMISSION KEY (the wizardNews authoring guard): without an id the entry
    // is refused by normalizeEntry and reaches no reader. COLLISION-FREE by the ledger's
    // own uniqueness — one `plant:<liar>:<audience>:<subject>` record can take once.
    id: `wizard_news.${now}.${PLANT_TOOK_KIND}.${liarId}.${audienceId}.${subjectId}`,
    kind: PLANT_TOOK_KIND,
    headline: `A bought story takes hold in ${name(audienceId)}`,
    summary: `The telling ${marketName} of ${name(liarId)} placed about ${name(subjectId)} is being believed in ${name(audienceId)}: the court's reckoning now sits exactly where the commission asked it to. Nobody there knows it was paid for.`,
    reasons: [
      `A week after it landed, the mark's own reckoning of ${name(subjectId)} matches the band the commission asserted.`,
      `The market's name is what made it stick, and the market's name is what pays if it breaks.`,
    ],
    settlementIds: [liarId, audienceId, subjectId],
    // SP-6a CLASS ASSIGNMENT (bandFamilies.SIGNIFICANCE_CLASSES), never a minted scale:
    // a plant taking is a quiet fact of the world, not an event the realm remarks on. The
    // drama is the exposure, which already carries 'notable'.
    significance: 'routine',
    severity: 0.2,
    score: 24,
    tick: now,
    tags: ['world_pulse', 'infowar', 'deception', 'brokerage', 'plant'],
  };
}

/**
 * THE MARKET NAMED AT THE EXPOSURE. Extra reason lines for the built
 * `infowar_lie_exposed` beat when the collapsed lie was BOUGHT — the seller by name, and
 * the buyer too where the lineage still carries them (it does whenever the commission
 * receipt survived into the record, which is the only way this returns anything at all).
 *
 * Returns an EMPTY array for a court's own bluff, so the built beat is byte-identical for
 * every uncommissioned exposure — which is every exposure a world without both information
 * flags lit can produce.
 *
 * @param {Record<string, unknown>} record @param {(id: string) => string} nameFor
 * @returns {string[]}
 */
export function plantExposureReasons(record, nameFor) {
  const receipt = asObject(asObject(asObject(record).commission).receipt);
  const marketName = strictText(receipt.marketName);
  const patronId = strictText(receipt.patronId);
  const hostId = strictText(receipt.hostId);
  if (!marketName || !hostId) return [];
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);
  const lines = [`The telling was not this court's own: ${marketName} of ${name(hostId)} was paid to place it, and it is the market's name the collapse burns.`];
  if (patronId) lines.push(`The lineage holds all the way back to the counter: the order was bought by ${patronId}.`);
  return lines;
}
