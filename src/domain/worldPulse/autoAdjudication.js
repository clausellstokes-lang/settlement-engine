/**
 * autoAdjudication.js — FULL AUTO-RESOLVE, the engine-adjudicated half of realm
 * directive 7 (binding design ruling J-D7, docs/DESIGN_REALM_DIRECTIVES.md).
 *
 * ── THE PRODUCT SHAPE ───────────────────────────────────────────────────────
 * A world advance mints two kinds of outcome. MINORS apply themselves. MAJORS —
 * under the conservative default (simulationRules.majorChangesRequireProposal,
 * routed through changeAuthorityPolicy) — are withheld as PENDING proposal rows
 * awaiting the DM's word, and they sit in the docket until someone rules on them.
 * FULL AUTO-RESOLVE is the wide-world mode where the DM has said "the realm rules
 * on its own": the engine immediately renders the verdict the DM would otherwise
 * have rendered by hand, at the moment the advance produces it.
 *
 * Note what this is NOT: it is not the multi-tick PAUSE toggle. That toggle
 * (advanceInterval's `autoResolve`) decides whether an interval STOPS at the tick
 * that surfaces majors. Turning it on stops the pause but still leaves every
 * proposal-gated major sitting pending in the docket — the docket was the half
 * nobody resolved. This module closes that half.
 *
 * ── ONE VOCABULARY PER DECISION ─────────────────────────────────────────────
 * There is no second adjudication path here. Every row is routed through the
 * EXACT function the hand-accept path uses — applyWorldPulseProposal — in mint
 * order, threading each ruling's world forward into the next. The receipt a
 * full-auto advance leaves is therefore the receipt a DM leaves by clicking Apply
 * on every row: the same proposal-row status transition, the same appliedAt
 * stamp, the same recordProposalProvenance ledger entry, the same news entries,
 * the same settlement updates, the same refusal ('refused') and record-mode
 * supersession ('superseded') dispositions. The ONE difference is the mark below.
 *
 * ── THE PROVENANCE MARK ─────────────────────────────────────────────────────
 * Every row this module touches carries `adjudicatedBy: 'engine_auto'` on its
 * terminal status transition. A hand-accepted row carries NO such key — the
 * ABSENCE is the DM's signature, and it is the pre-existing row shape, unchanged.
 * So retrospective review can always answer "who ruled this?" off the docket
 * itself, with no second ledger to keep in sync. The mark is stamped on EVERY
 * terminal transition the engine writes, including the record-mode supersession
 * tombstone: a voided row with no mark under full-auto would read as a DM action,
 * which is precisely the mis-attribution the mark exists to prevent.
 *
 * ── DORMANCY ────────────────────────────────────────────────────────────────
 * Called only when an advance ran in full-auto (the store's engagement rule lives
 * in campaignAdvanceSession.js: the USER TOGGLE, never an internally-derived
 * autoResolve). With nothing to rule on it returns its input result BY REFERENCE
 * — no clone, no new keys — so a toggle-OFF world is byte-identical to the world
 * before this module existed.
 *
 * ── PURITY / DETERMINISM ────────────────────────────────────────────────────
 * No wall clock (the advance's pinned `now` is threaded through), no RNG (the
 * proposal resolver replays the STORED outcome with applyMode forced to 'auto'),
 * no store, no DOM, no React. Same seed + same toggle ⇒ same world, so the
 * same-seed law holds across the mode.
 *
 * ── LIFECYCLE OF WHAT THIS WRITES ───────────────────────────────────────────
 *   create    — the proposal row is minted by the tick (applyWorldPulseOutcomes);
 *               this module writes only its terminal status + the mark.
 *   read      — the docket surfaces (Herald adjudication, WorldPulsePanel) and
 *               worldSnapshotPublic's applied-proposal recovery.
 *   persist   — rides campaign.worldState.proposals, already in the persisted
 *               campaign record (localStorage cache + cloud snapshot). No new
 *               persistence container, no persist-version bump.
 *   regen     — proposals are never regenerated; ensureWorldState clones the
 *               array wholesale and preserves unknown row keys.
 *   undo      — the advance's pre-pulse snapshot predates every ruling here, so
 *               undoLastPulse reverts the rulings with the advance that made
 *               them. One advance, including its verdicts, is one undo step.
 *   migrate   — none owed: additive, absent-tolerant.
 */
import { applyWorldPulseProposal } from './applyWorldPulse.js';
import { foldUpdatesOntoSaves } from './advanceInterval.js';

/**
 * The loose sim shapes this module threads, spelled with `unknown` rather than the
 * domain's historical `any` holes: nothing here inspects a world, a graph or a save
 * — they are carried from one call to the next — so `unknown` is the honest type and
 * the any-cast ratchet (tests/lint/domainAnyCastBaseline.test.js) stays at zero for
 * this file.
 *
 * @typedef {{ id?: unknown }} MintedProposal
 * @typedef {{ saveId: unknown, settlement?: unknown }} SettlementUpdate
 * @typedef {{
 *   ok?: boolean,
 *   status?: string,
 *   worldState?: unknown,
 *   regionalGraph?: unknown,
 *   wizardNews?: unknown,
 *   settlementUpdates?: SettlementUpdate[],
 *   autoApplied?: unknown[],
 *   newsEntries?: unknown[],
 *   proposals?: MintedProposal[],
 *   autoAdjudicated?: Array<{ proposalId: string, disposition: string }>,
 * }} AdvanceResultLike
 * @typedef {AdvanceResultLike & { proposalDisposition?: string }} ProposalRulingLike
 * @typedef {{ worldState?: unknown, regionalGraph?: unknown, wizardNews?: unknown }} CampaignLike
 */

/**
 * The typed provenance value for a ruling the ENGINE rendered under full
 * auto-resolve. A frozen vocabulary of exactly one member today; a future
 * adjudicator (a scheduled ruling, a co-DM) adds a sibling here rather than
 * inventing a free-form string at a call site.
 * @type {'engine_auto'}
 */
export const ENGINE_AUTO_ADJUDICATOR = 'engine_auto';

/**
 * Is this proposal row one the ENGINE ruled on (rather than the DM)?
 * The single read-side accessor, so no surface re-spells the key.
 * @param {{ adjudicatedBy?: unknown } | null | undefined} proposal
 * @returns {boolean}
 */
export function isEngineAdjudicated(proposal) {
  return !!proposal && proposal.adjudicatedBy === ENGINE_AUTO_ADJUDICATOR;
}

/**
 * The de-duplicated, mint-ordered ids of the proposals an advance result minted.
 * `result.proposals` concatenates every tick's minted rows, so a row re-upserted
 * across ticks can appear more than once; ruling on it twice is a no-op (the
 * second call finds it non-pending and returns null) but the ordering must stay
 * stable and the receipt list honest, so it is collapsed here.
 * @param {AdvanceResultLike} result
 * @returns {string[]}
 */
function mintedProposalIds(result) {
  /** @type {MintedProposal[]} */
  const minted = Array.isArray(result?.proposals) ? result.proposals : [];
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {string[]} */
  const ids = [];
  for (const proposal of minted) {
    const id = proposal && proposal.id != null ? String(proposal.id) : '';
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

/**
 * Rule on every proposal an advance just minted, through the hand-accept path.
 *
 * Returns a NEW result of the SAME shape the advance already produced (so the
 * store's existing commit — applyWorldPulseResultToState — consumes it unchanged),
 * or the INPUT result by reference when there was nothing to rule on.
 *
 * `result.proposals` is left as minted on purpose: it is the "what this advance
 * proposed" telemetry the analytics tail reads, and the authoritative status of
 * each row lives on `worldState.proposals`, which this function advances. The
 * rulings are additionally itemized on `autoAdjudicated` for pins and for the
 * retrospective surfaces (wave F reads the docket itself, not this field).
 *
 * @param {Object} [args]
 * @param {CampaignLike|null} [args.campaign] the PRE-advance campaign clone
 *   (identity/binding fields only; its world is replaced by the result's below).
 * @param {unknown[]} [args.saves] the PRE-advance save clones.
 * @param {AdvanceResultLike|null} [args.result] the composed advance result.
 * @param {string} [args.now] the advance's PINNED clock — never a fresh read.
 * @param {string|null} [args.adjudicatedBy] the provenance mark to stamp.
 * @returns {AdvanceResultLike|null|undefined} the folded result, or `result` unchanged.
 */
export function autoAdjudicateAdvanceProposals({
  campaign, saves = [], result, now,
  adjudicatedBy = ENGINE_AUTO_ADJUDICATOR,
} = {}) {
  // A blocked advance (ok:false) committed nothing, and a PAUSED interval is by
  // construction the auto-resolve-OFF path — neither has a docket to rule on.
  if (!campaign || !result || result.ok === false || result.status === 'paused') return result;
  const queue = mintedProposalIds(result);
  if (!queue.length) return result;

  // Thread the ADVANCE's committed world (not the pre-advance clone) into the
  // first ruling, exactly as the store would have had the DM clicked Apply the
  // instant the advance returned.
  let runningCampaign = {
    ...campaign,
    worldState: result.worldState,
    regionalGraph: result.regionalGraph,
    wizardNews: result.wizardNews,
  };
  /** @type {SettlementUpdate[]} */
  const advanceUpdates = Array.isArray(result.settlementUpdates) ? result.settlementUpdates : [];
  /** @type {unknown[]} */
  let runningSaves = foldUpdatesOntoSaves(saves, advanceUpdates);
  /** id-keyed accumulator (last-write-wins), seeded with the advance's own updates.
   *  @type {Map<string, SettlementUpdate>} */
  const updatesById = new Map(advanceUpdates.map((u) => [String(u.saveId), u]));
  /** @type {unknown[]} */
  const autoApplied = [];
  /** @type {unknown[]} */
  const newsEntries = [];
  /** @type {Array<{ proposalId: string, disposition: string }>} */
  const adjudicated = [];

  for (const proposalId of queue) {
    // applyWorldPulse.js is a loosely-typed sim module; its inferred return union
    // omits the record-mode `proposalDisposition` arm. Re-declared through `unknown`
    // (never `any`) so this file states the shape it actually consumes.
    const ruled = /** @type {ProposalRulingLike|null} */ (/** @type {unknown} */ (
      applyWorldPulseProposal({
        campaign: runningCampaign,
        saves: runningSaves,
        proposalId,
        now,
        adjudicatedBy,
      })
    ));
    // null ⇒ the row is no longer PENDING at ruling time: an actor-major that
    // expired later in the same interval, a row the proposal ring evicted, or a
    // duplicate id. There is nothing to rule on and nothing to report — the row
    // already carries its own terminal receipt from whatever resolved it.
    if (!ruled) continue;
    runningCampaign = {
      ...runningCampaign,
      worldState: ruled.worldState,
      regionalGraph: ruled.regionalGraph,
      wizardNews: ruled.wizardNews,
    };
    for (const update of ruled.settlementUpdates || []) {
      updatesById.set(String(update.saveId), update);
    }
    runningSaves = foldUpdatesOntoSaves(runningSaves, ruled.settlementUpdates);
    if (ruled.autoApplied) autoApplied.push(...ruled.autoApplied);
    if (ruled.newsEntries) newsEntries.push(...ruled.newsEntries);
    adjudicated.push({
      proposalId,
      disposition: String(ruled.proposalDisposition || 'applied'),
    });
  }
  // Every queued row was already resolved ⇒ nothing was ruled ⇒ byte-identical.
  if (!adjudicated.length) return result;

  return {
    ...result,
    worldState: runningCampaign.worldState,
    regionalGraph: runningCampaign.regionalGraph,
    wizardNews: runningCampaign.wizardNews,
    settlementUpdates: [...updatesById.values()],
    autoApplied: [...(Array.isArray(result.autoApplied) ? result.autoApplied : []), ...autoApplied],
    newsEntries: [...(Array.isArray(result.newsEntries) ? result.newsEntries : []), ...newsEntries],
    autoAdjudicated: adjudicated,
  };
}
