/**
 * faithNews.js — THE FP-FAITH GOVERNED KIND REGISTRY (WF-8a's slice, the settlement obituary).
 *
 * The WW-C split, copied deliberately from GR-0 and IN-1c-a: `faithReceiptPools.js` holds the
 * annex-verbatim corpus, THIS file holds the registry row, the eligibility declaration, the
 * seeded picker and the outcome builder, and the settlement fold in `religiousContest.js` holds
 * the ONE production mint. Nothing here decides that a creed died; it only voices a deletion the
 * prune already performed.
 *
 * THE ESTATE'S SIXTH PHRASED-KIND REGISTRY FAMILY, and its first row is a CHRONICLE obituary.
 *
 * ── ⛔ THE DEITY DOCTRINE IS THIS FILE'S FIRST LAW ────────────────────────────────
 *
 * Faith is CULTURAL, never theological. The beat records that THE PEOPLE STOPPED KEEPING THE
 * RITE — the altar went dark, the roster no longer carries the creed, the undercroft was cleared
 * for grain. It never says a god died, departed, abandoned anyone or failed. The corpus was
 * authored against that law and verifier-passed under it; this file adds no sentence of its own
 * beyond the receipt's own reason chain, which states only what the deletion entails.
 *
 * ── WHY THE ROW CARRIES A DESK AS WELL AS A LETTER SECTION ────────────────────────
 *
 * The annex files this beat at the CHRONICLE, and the Chronicler's Letter row
 * (`KIND_SECTION.faith_last_altar_dark = 'traditions'`) is that filing. The Herald desk is a
 * SECOND, orthogonal axis: the token reaches the feed through the generic outcome path, so it
 * files at the `faith` desk like every other creed beat. Both rows land in this member, and the
 * pair is what keeps the estate-wide registered-minus-routed honesty check still — a
 * desk-BEARING kind registered without an `EXACT_SECTION` row would inflate the deskless count
 * by one while routing free on the `faith_` family prefix. That prefix is the cheap door and the
 * trap, and this row is the refusal to take it.
 *
 * ── ⭐⭐ THE KEYED PICK IS THE CURED SPELLING, AND THE DIVERGENCE IS DOCKETED ───────
 *
 * `hash01` avalanches before the multiply, so the choice does not alias onto a parity class the
 * way a raw `fnv % poolLength` would. That is `grammarNews.js`'s cure, copied by
 * `informationNews.js` and copied again here VERBATIM. ⛔ It repairs none of the nine sibling
 * sites still carrying the uncured spelling; that cross-family refactor is docketed as
 * `CR-IN1C-DRIFT` and is a STOP for any single wave.
 *
 * ⛔ THERE IS NO UNSEEDED ARM. The seam always carries a settlement id and a deity ref, so the
 * siblings' `seed ? … : pool[0]` fallback would be a branch no producer can reach — the
 * unreachable-arm member of the pin-vacuity family — and it is refused here rather than carried
 * for symmetry with registries whose callers genuinely can pass nothing.
 *
 * ⚠ THE ONE DEGRADED ARM THAT DOES SURVIVE is `faithLine` answering null, and it is kept
 * because it is REACHABLE and DRIVEN: an unknown kind and a blank creed name both reach it, the
 * walker executes both, and the receipt then carries its own record sentence rather than a
 * blank headline. That is IN-1c-a's own posture — its read-model "turns that null into the
 * landed hand-composed sentence rather than into a blank line" — and the arm is a live
 * degradation path rather than dead symmetry.
 *
 * PURE: frozen data, one keyed hash, no store, no Date, no Math.random, no rng threading, no I/O.
 *
 * @enforced-by tests/lint/faithKindPools.walker.test.js
 */

import { hash01 } from '../region/contestMath.js';
import { stablePart } from '../region/graph.js';
import { FAITH_RECEIPTS } from './faithReceiptPools.js';

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * @typedef {{kind:string, significance:'notable'|'routine'|'major'|'n/a',
 *   audience:'public'|'dm-only', section:string|null,
 *   pool:readonly ProseVariant[], requiredSlots:ReadonlyArray<readonly string[]>}}
 *   FaithRegistryEntry
 */

/**
 * ⛔⛔ THE PARAMETER ORDER IS `grammarNews.js#grammarKindRow`'s, AND IT IS LOAD-BEARING:
 * `(kind, significance, audience, section, requiredSlots, …)`. A family that re-orders its row
 * constructor is a family whose rows cannot be read across the estate by eye.
 *
 * ⚠ POSITION SIX — GR-0's `contexts` axis — IS DELIBERATELY UNOCCUPIED rather than accepted and
 * ignored, on IN-1c-a's recorded reasoning: this corpus authors no split across a fact the
 * receipt carries, so taking the parameter and never consulting it would be a dead arm.
 *
 * @param {string} kind
 * @param {'notable'|'routine'|'major'|'n/a'} significance
 * @param {'public'|'dm-only'} audience
 * @param {string|null} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<FaithRegistryEntry>}
 */
function faithKindRow(kind, significance, audience, section, requiredSlots) {
  const pool = /** @type {readonly ProseVariant[]} */ (FAITH_RECEIPTS[kind]);
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool,
    requiredSlots: Object.freeze(requiredSlots.map((slots) => Object.freeze([...slots]))),
  });
}

/**
 * The governed rows. ONE today, and the singular is a SEQUENCING fact rather than a stage of
 * construction: the FAITH volume charters roughly twenty further narration kinds and each needs
 * its own producer, so WF-8 is a multi-member train by arithmetic and this member carries the
 * one beat whose producer already exists.
 *
 * ⚠ THIS IS THE ESTATE'S SECOND ONE-ROW FAMILY, AND THAT IS A REVIEWED ACT.
 * `kindPoolFloors.walker.test.js` keeps the old blanket width floor of five as an EXACT exception
 * list precisely so a second small family is a visible decision rather than a number that
 * quietly slipped. FAITH joins INFORMATION on that list under ODQ §309.3 / §347.1(2), and the
 * SHRINK-BACK IS A RECORDED OBLIGATION of the next WF-8 member that takes this family to five
 * rows or more.
 *
 * `requiredSlots` is WR-10's axis, verbatim, and it is parallel to the pool: a variant whose
 * named evidence is absent is skipped rather than rendered with a hole. ⚠ Index one names a
 * `{temple}` the deletion seam cannot supply, so the eligible set at this base is FOUR — exactly
 * the derived `major` floor — and the walker pins BOTH arms so a filter that had stopped
 * filtering cannot pass as a filter that is working.
 *
 * @type {ReadonlyArray<Readonly<FaithRegistryEntry>>}
 */
export const FAITH_KIND_REGISTRY = Object.freeze([
  faithKindRow('faith_last_altar_dark', 'major', 'public', 'faith', [
    ['creed', 'settlement'], ['temple'], ['creed', 'settlement'],
    ['creed', 'settlement'], ['creed', 'settlement'],
  ]),
]);

/** The exact governed pool set. */
export const FAITH_KINDS = Object.freeze(FAITH_KIND_REGISTRY.map((row) => row.kind));

/**
 * THE MEMBER'S ONE AUTHORED VALUE, and it is chair-signed under §42/§43 (ODQ §350.2 R-3).
 *
 * DERIVATION: the conversion outcome in the same fold composes `clamp01(0.5 * pietyMult)` and
 * therefore reads 0.5 exactly where no piety record exists — the no-record default of the
 * nearest sibling receipt, taken rather than invented. 0.5 sits deliberately BELOW
 * `newsEntryForOutcome`'s 0.72 major-entry line, so the obituary surfaces as a `notable` ENTRY:
 * a record, not an alarm. ⛔ THE TWO SIGNIFICANCE AXES ARE DISTINCT INSTRUMENTS. The KIND's
 * cadence class stays `major` (the pool-floor axis, which asks how OFTEN a reader meets the
 * beat), and no walker ties one to the other — asserted by execution in the acceptance battery
 * rather than assumed here.
 */
export const FAITH_NEWS_TUNING = Object.freeze({ LAST_ALTAR_SEVERITY: 0.5 });

/** @type {ReadonlyMap<string, Readonly<FaithRegistryEntry>>} */
const KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<FaithRegistryEntry>]>} */ (
    FAITH_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one authored FAITH sentence. Variants whose named evidence is absent are ineligible.
 * Null when nothing in the pool qualifies or the kind is unknown — silence, never generic prose.
 *
 * @param {string} kind
 * @param {string} seed  the namespaced pick key; the seam always supplies one
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string, line:string, familyId:string, templateIndex:number,
 *   significance:string, audience:string, section:string|null} | null}
 */
export function faithLine(kind, seed, interp = {}) {
  const row = KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  // THE KEYED PICK, copied from `informationNews.js` and cured for the same recorded reason:
  // `hash01` avalanches before the multiply, so the choice does not alias onto a parity class
  // the way a raw `fnv % poolLength` would. Same seed, same world, same sentence — forever.
  const templateIndex = eligible[
    Math.min(eligible.length - 1, Math.floor(hash01(String(seed)) * eligible.length))
  ];
  const variant = row.pool[templateIndex];
  const raw = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    // SENTENCE CASE AT THE RENDER, on GR-0's recorded reason: an authored family may open with
    // a slot whose fill is lower case because it also fills mid-sentence, and rendering that
    // template raw would put a lower-case letter at the head of a rendered sentence. The corpus
    // is right and the fill is right, so the CASING is the renderer's business and is
    // normalized here rather than by editing an annex-verbatim pool.
    line: raw.charAt(0).toUpperCase() + raw.slice(1),
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * THE SETTLEMENT EXTINCTION OBITUARY, as a pulse OUTCOME.
 *
 * ⛔ IT IS A RECORD, NOT A MUTATION. No deltas, no condition, no patch, no stressor, no
 * `deityReembed` — `applyOutcomeToSettlement` no-ops on it by construction and
 * `collectFaithDeltas` filters it out, so the pantheon ledger is untouched. The creed is already
 * gone when this is built; the beat only says so.
 *
 * `curationClass: 'transition'` is existing vocabulary (`pulseHelpers.js`) and forces
 * `isDriftOnlyOutcome` false, so the obituary always reaches the feed instead of being
 * metronome-suppressed as drift. `candidateType` carries the literal token: the generic
 * `newsEntryForOutcome` stamps it as the entry's `impactKind`, which is the promoted-candidateType
 * path the estate already walks.
 *
 * @param {{ cid: string, settlementName: string, ref: string, creedName: string, tick: number }} args
 * @returns {Record<string, unknown>}
 */
export function faithReceipt({ cid, settlementName, ref, creedName, tick }) {
  const kind = FAITH_KINDS[0];
  const picked = faithLine(kind, `${kind}::${cid}::${ref}`, { creed: creedName, settlement: settlementName });
  // The address chain (news address law L6): the typed action is the candidateType, the names
  // are the settlement and the creed, and the reason states only what the deletion entails.
  const reason = `${creedName} lost its last altar in ${settlementName}; no one there keeps the rite, and the parish roster carries the creed no longer.`;
  return {
    id: `faith.last_altar_dark.${stablePart(cid)}.${ref}`,
    type: 'faith_extinction',
    candidateType: kind,
    ruleId: 'religious_last_altar_dark',
    ruleFamily: 'religion',
    applyMode: 'auto',
    probability: 1,
    curationClass: 'transition',
    targetSaveId: cid,
    affectedSettlementIds: [cid],
    severity: FAITH_NEWS_TUNING.LAST_ALTAR_SEVERITY,
    headline: picked ? picked.line : reason,
    summary: reason,
    reasons: [reason],
    tick,
  };
}
