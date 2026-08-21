/**
 * oathHolder.js — GR-1: THE OATH-HOLDER IDENTITY (flag `oathHolderEnabled`).
 *
 * Charter: docs/DESIGN_FP_ARCHITECTURE.md §5 wave #9. Fine grain:
 * docs/DESIGN_FP_ARCH_GR.md §5 GR-1 (+ its V-19/V-23/V-29 receipts). Design law:
 * docs/DESIGN_FP_GRAMMAR.md §GR-1.
 *
 * WHAT THIS IS FOR. A medieval treaty was a PERSONAL oath between princes, which is
 * why every royal death reopened every question. Today this estate's treaties are
 * signed by seats, not by people, so the Herald can only ever say "Thornwall and the
 * Vale made peace" — and GR-4's succession question ("the heir who breaks the
 * father's oath") is not even askable, because nothing records whose oath it was.
 * This wave lands the IDENTITY and nothing else: a stamp, a read, and no physics.
 *
 * ── THE COMPOSITION, AND WHY IT IS EXACTLY THESE FOUR STEPS ──────────────────────
 *
 * The GRAMMAR volume's original premise was that a "legitimate-power read" already
 * existed to reuse. It does not: `rulingPower.js` deals in faction and power NAMES
 * and never in npc ids, and there is no `rulerOf`/`seatHolder` anywhere in
 * src/domain (re-verified at build). The read is therefore COMPOSED here, ONCE,
 * from sanctioned helpers only — never hand-rolled, because the faction-key defect
 * class in this estate is precisely what hand-rolled affiliation matching produces:
 *
 *   1. `governingFactionOf(settlement)`   rulingPower.js — the faction carrying the seat
 *   2. `ladderFactionKey(faction)`        npcLadderState.js — the stable ladder key, which
 *                                         is `npcInFaction`'s required third argument
 *   3. `npcInFaction(npc, faction, fkey)` npcLadderState.js — THE sanctioned affiliation
 *                                         test (handle, normalized name, or linkedFactionIds)
 *   4. codepoint-stable pick over the members' roster ids, then
 *      `durableIdForRoster(...)`          npcLedger.js — the H1 durable identity when the
 *                                         person has graduated
 *
 * MEASURED REACHABILITY (the dead-arm law — a composition nobody can satisfy is worse
 * than no composition). Five really-generated settlements were probed at build: each
 * resolved a governing faction, and each matched one or two seated npcs through step 3.
 * The stamp is live on ordinary worlds, not only on hand-built fixtures.
 *
 * WHY CODEPOINT AND NOT THE LADDER'S RANK ORDER (JUDGMENT, vetoable). `eligibleMembersOf`
 * exists next door and orders a faction's members by importance, dots and structural
 * rank. It is deliberately NOT used: the compiled charter names exactly the four steps
 * above, the wave's own required mutant is "reverse the codepoint tie-break ⇒ the
 * SAME-SEAT pin reds" (which is only meaningful if codepoint IS the pick), and rank
 * order would make the signature line move whenever an unrelated ladder read retuned
 * an importance weight — a seat that changes hands because someone else got promoted
 * is exactly the physics this wave promises not to introduce. Codepoint over the
 * roster id is the same discipline `npcCirculation.js` already uses to make dispersal
 * "a pure function of the cast rather than of the array it happened to arrive in".
 * Swapping the pick is a one-line change at PICK below if the chair rules otherwise.
 *
 * WHY THE DURABLE ID IS A PREFERENCE AND NOT A GATE (MEASURED). `durableIdForRoster`
 * answers from the npc LEDGER, which is only populated by H1 graduation, which is
 * itself gated behind npc consequences. On the great majority of worlds it returns
 * null. Reading the volume's "→ H1 durable id" as a GATE would therefore have made
 * the stamp structurally unreachable — the feature would ship green and never fire.
 * So the durable id is taken WHEN IT EXISTS (durable ids are self-describing: they
 * carry the `wnpc_` prefix) and the roster id is used otherwise. The volume's own
 * null contract enumerates its causes as "no governing faction, no seated NPC" and
 * does not name the ledger, which is the reading this implements.
 *
 * ── THE CONTRACTS ────────────────────────────────────────────────────────────────
 *
 * NULL ⇒ NO STAMP ⇒ SEAT-VOICE. No governing faction, or no seated npc, returns null
 * and the treaty gains no `sworn` key at all — which is exactly the contract every
 * legacy treaty already has. Never an invented name, never a crash, never new NPC state.
 *
 * NO MIGRATION, EVER. Legacy treaties are never backfilled; unstamped means "the seat
 * swore", forever (the WR-0c item (4) provenance discipline, reused verbatim).
 *
 * VOICE AND READ, NEVER PHYSICS. Compliance math is untouched by whose name is on the
 * parchment. An oath-compliance bonus would be a courage ratchet wearing a ring.
 *
 * DEATH CHANGES NOTHING in this wave: no auto-void, no beat. The stamp records who
 * swore, and it never schedules or resolves anyone's fate.
 *
 * DELIBERATELY DEFERRED, DOCUMENTED NOT DROPPED: the pick does not exclude a roster
 * entry whose `status` reads 'dead'. Adding that filter is a FIFTH step the compiled
 * charter does not carry, and the person who holds the seat when the world is dark is
 * GR-4's subject (the succession question), not this wave's. Recorded here so it is
 * found rather than re-discovered.
 *
 * DETERMINISTIC: zero PRNG, zero wall-clock. Pure reads plus one keyless pick.
 *
 * @enforced-by tests/domain/oathHolderGr1.test.js,
 *   tests/lint/oathStampTotality.walker.test.js,
 *   tests/property/oathHolderDormancyFence.test.js
 */
import { governingFactionOf } from '../rulingPower.js';
import { compareCodepoint, ladderFactionKey, npcInFaction } from './npcLadderState.js';
import { durableIdForRoster } from './npcLedger.js';

/** @typedef {{ npcId: string, name: string }} OathHolder */
/** @typedef {{ npcId: string, name: string, swornTick: number }} SwornStamp */

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/**
 * THE GATE. Strict, by name, dark-never-permissive — absent and false are the same
 * answer. The by-name read is deliberate and load-bearing: a flag gated only through a
 * frozen-list `.every()` conjunction is a computed member access that attributes to NO
 * key, so it is fully wired, genuinely gated, and invisible to
 * tests/lint/engineGatedRuleKeys.walker.test.js (the hole that walker's own header
 * records). Accepts a worldState or a bare rules bag, the sovereigntyTradeActive shape.
 *
 * @param {unknown} worldStateOrRules
 * @returns {boolean}
 */
export function oathHolderActive(worldStateOrRules) {
  const root = recordOf(worldStateOrRules);
  const rules = Object.prototype.hasOwnProperty.call(root, 'simulationRules')
    ? recordOf(root.simulationRules)
    : root;
  return rules.oathHolderEnabled === true;
}

/**
 * WHO SPEAKS FOR THIS SEAT — the person whose name goes on the parchment, or null.
 *
 * UNGATED BY DESIGN: this is a pure identity read with no side effect and no state, so
 * GR-4's succession question and the Herald's signature line can consume it without
 * routing through a writer. The FLAG lives at `stampSworn`, which is the only thing
 * here that writes, and which refuses before ever calling this — so the call-path
 * dormancy fence can count invocations of this function and read a true zero while dark.
 *
 * @param {unknown} worldState the world (for the H1 durable-id lookup)
 * @param {string} settlementId
 * @param {unknown} settlement the roster-bearing settlement record
 * @returns {OathHolder | null}
 */
export function oathHolderOf(worldState, settlementId, settlement) {
  const sid = text(settlementId);
  if (!sid) return null;
  const record = recordOf(settlement);
  const faction = governingFactionOf(
    /** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (record)),
  );
  if (!faction) return null;
  const fkey = ladderFactionKey(faction);
  const roster = Array.isArray(record.npcs) ? record.npcs.map(recordOf) : [];
  // PICK: codepoint-lowest roster id among the governing faction's members. See the
  // header for why this is the pick and not the ladder's rank order.
  /** @type {Record<string, unknown> | null} */
  let chosen = null;
  for (const npc of roster) {
    const rosterId = text(npc.id);
    if (!rosterId) continue;                 // an id-less roster entry cannot be addressed
    if (!npcInFaction(npc, faction, fkey)) continue;
    if (!chosen || compareCodepoint(rosterId, text(chosen.id)) < 0) chosen = npc;
  }
  if (!chosen) return null;                  // a seat nobody sits in ⇒ seat-voice
  const rosterId = text(chosen.id);
  const name = text(chosen.name) || text(chosen.label) || rosterId;
  // The H1 durable identity when this person has graduated; the roster id otherwise.
  const durable = durableIdForRoster(
    /** @type {{ spatialLedgers?: unknown }} */ (recordOf(worldState)),
    sid,
    { rosterId, name: chosen.name },
  );
  return { npcId: text(durable) || rosterId, name };
}

/**
 * STAMP THE SIGNATURE LINE onto a freshly-minted treaty. THE ONE WRITER of `sworn`.
 *
 * Mutates the record in place, which is this writer family's own idiom for a treaty it
 * has just constructed (`treaty.mediator`, `treaty.coalitionScope`, `treaty.fracture`
 * are all written the same way at the same moment). DROP-WHEN-ABSENT (T4): dark, or a
 * pair where no party resolves a holder, leaves the record with NO `sworn` key at all —
 * absent, never null and never an empty object, because an empty object is a key and a
 * key is a byte.
 *
 * @param {Record<string, unknown>} treaty the record being minted
 * @param {{ worldState: unknown, tick: unknown, ids: ReadonlyArray<string>,
 *           settlementOf: (id: string) => unknown }} args
 * @returns {boolean} whether a stamp landed (for pins and receipts; callers may ignore)
 */
export function stampSworn(treaty, { worldState, tick, ids, settlementOf }) {
  if (!oathHolderActive(worldState)) return false;
  const swornTick = Number(tick);
  if (!Number.isFinite(swornTick)) return false;
  /** @type {Record<string, SwornStamp>} */
  const sworn = {};
  // Codepoint-ordered so the persisted key order is a function of the parties and not
  // of the order the mint road happened to name them in.
  for (const id of [...new Set(ids.map(text).filter(Boolean))].sort(compareCodepoint)) {
    const holder = oathHolderOf(worldState, id, settlementOf(id));
    if (holder) sworn[id] = { npcId: holder.npcId, name: holder.name, swornTick: Math.floor(swornTick) };
  }
  if (Object.keys(sworn).length === 0) return false;
  treaty.sworn = sworn;
  return true;
}

/**
 * THE READ SIDE. What the parchment says, codepoint-ordered. A legacy treaty carries no
 * `sworn` key and reads back as an EMPTY LIST — seat-voice, the same answer it gave
 * before this wave existed, and the reason no migration is owed and none may ever be
 * written. No consumer touches the raw field, so absent-forever tolerance and the
 * half-written-stamp guard live in exactly one place. This reader is TOTAL: it never
 * throws, on any shape.
 *
 * IT DOES NOT RE-RESOLVE AGAINST THE LIVING ROSTER, and that is the design rather than
 * an omission: the parchment is HISTORY, so a signatory who has since died, left, or
 * been renamed still signed it, and re-deriving the name from today's roster would let
 * the world quietly rewrite a treaty's signature line. The record has no load-time
 * normalizer, so shape discipline is pinned AT the writer and AT this reader (the
 * occupations precedent). DELIBERATELY DEFERRED: resolving a stamp to a LIVE person —
 * and degrading to seat-voice when that person no longer answers — belongs to the first
 * consumer that needs a live person, which is GR-4's succession question. Recorded here,
 * not dropped.
 *
 * @param {unknown} treaty
 * @returns {ReadonlyArray<{ settlementId: string } & SwornStamp>} codepoint-ordered
 */
export function swornPartiesOf(treaty) {
  const sworn = recordOf(recordOf(treaty).sworn);
  /** @type {Array<{ settlementId: string } & SwornStamp>} */
  const out = [];
  for (const settlementId of Object.keys(sworn).sort(compareCodepoint)) {
    const stamp = recordOf(sworn[settlementId]);
    const npcId = text(stamp.npcId);
    const name = text(stamp.name);
    if (!npcId || !name) continue;           // a half-written stamp is not a signature
    out.push({ settlementId, npcId, name, swornTick: Math.floor(Number(stamp.swornTick) || 0) });
  }
  return Object.freeze(out);
}
