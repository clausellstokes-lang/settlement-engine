/**
 * envoyCasting.js — WHO A COURT SENDS: the roster-availability law, and the diplomatic
 * selection draw that reads it.
 *
 * A LAZY LEAF OF THE ENVOY FAMILY (the L8 recipe), extracted from `envoyDiplomacy.js` at
 * ES-1 for two reasons, and the second is the load-bearing one.
 *
 *   THE SIZE REASON. `envoyDiplomacy.js` measured 797 effective lines against the
 *     800-line domain ceiling when ES-1 opened — three lines of headroom on a
 *     TOLERANCE-ZERO ratchet, and ES-1 has to edit that file (the covert kind fork at
 *     `buildEnvoyRoutePlan`'s one `livedHopToward` call). A wave that budgets no
 *     extraction and edits a file at its ceiling reds the ratchet on its first commit.
 *
 *   THE ARCHITECTURAL REASON, WHICH WOULD HAVE FORCED THIS EXTRACTION AT ANY SIZE.
 *     ES-1's charter requires covert casting to honour the DISPATCH-REFUSAL SEAMS — an
 *     off-stage or already-travelling person is refused, HZ8 honoured and never bypassed.
 *     That law was a module-PRIVATE function of `envoyDiplomacy.js`, reachable by nobody.
 *     The espionage mint could only have obeyed it by re-spelling it, and a second
 *     spelling of "who may be sent" is precisely the drift J-WR-10 forbids: the day the
 *     war lane adds a status to the refusal list, the spy lane would keep sending the
 *     dead. So the predicate is lifted, exported ONCE, and both casting laws read it.
 *
 * ── THE TWO CASTING LAWS, AND WHY THEY DO NOT LIVE IN ONE FUNCTION (J-ES-4) ─────────
 * The estate now has TWO selection laws over one roster, and they point OPPOSITE ways:
 *
 *   DIPLOMATIC casting — importance-DESCENDING, here in `envoyCandidate`. A realm's face
 *     is its most notable person, so the draw sorts importance down and breaks ties on a
 *     diplomatic role.
 *   COVERT casting — importance-INVERSE, in `src/domain/worldPulse/espionage/`
 *     `espionageMissions.js` (`castCovertOperative`), over the roads draw law
 *     `ROADS_TUNING.DRAW_WEIGHT_BASE − importanceWeight`. A realm's spies are its LEAST
 *     notable people, because notoriety is what gets an operative seen (ES §3.1/§3.2).
 *
 * They COEXIST BY CLASS and they are deliberately not merged. This note is one half of a
 * BOTH-SITE HEADER — the espionage leaf carries the mirror of it — because the failure
 * mode here is not a bug, it is a future lane reading two draws over one roster as
 * duplication and "unifying" them, which would either make every court's face its least
 * notable citizen or every spy its most famous one. Only the availability predicate is
 * shared, and it is shared because it answers a different question: not who SHOULD go,
 * but who CAN.
 *
 * K3 (NOBODY IS EVER CURRENT): the reach is the roster, the npc ledger and the errand
 * ledger. None can hand back a settlement's real strength, stock or pressure.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/envoyDiplomacy.test.js + tests/domain/espionageMission.test.js
 */
import { compareCodepoint } from '../deterministicSort.js';
import { importanceWeight } from '../entities/npcs.js';
import { isOffStage } from '../roads/state.js';
import { envoyErrandsOf } from './envoyErrandRecords.js';
import { durableIdForRoster, npcLedgerOf } from './npcLedger.js';

/**
 * The tie-break separator, PRESERVED EXACTLY as `envoyDiplomacy.js` spelled it: a NUL
 * between the two identity halves, so `a|b` and `ab|` can never collide into one sort
 * key. It is built from a CODE POINT rather than written as a unicode escape on purpose:
 * an authored escape of code point zero has six times landed in this repo's sources as a
 * RAW NUL BYTE, which grep and diff then report on silently. `String.fromCharCode(0)`
 * produces the identical separator and cannot be mistranscribed.
 */
const IDENTITY_SEPARATOR = String.fromCharCode(0);

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {Record<string, unknown>} npc */
export function rosterIdentity(npc) {
  return {
    rosterId: text(npc.id || npc.npcId),
    name: text(npc.name),
    role: text(npc.role || npc.title),
  };
}

/**
 * A person already walking another lane cannot stand in two places.
 *
 * ⚠ THE ONE SPELLING OF THE DISPATCH REFUSAL, and every casting law reads it. Adding a
 * status here refuses that person to the diplomatic draw AND the covert one in the same
 * edit, which is the whole reason it is exported rather than re-derived.
 *
 * @param {Record<string, unknown>} npc @returns {boolean}
 */
export function rosterPersonAvailable(npc) {
  if (isOffStage(npc)) return false;
  const status = text(npc.status).toLowerCase();
  if (['dead', 'killed', 'missing', 'exiled', 'imprisoned'].includes(status)) return false;
  const whereabouts = asObject(npc.whereabouts);
  const travelState = text(whereabouts.state || whereabouts.phase).toLowerCase();
  return !['outbound', 'travelling', 'traveling', 'returning', 'visiting', 'hostage'].includes(travelState);
}

/**
 * THE PEOPLE A COURT COULD SEND ANYWHERE, before either law says who it WOULD send.
 *
 * Availability is a fact about a person and their lane; importance is a fact about the
 * errand. So this returns everyone who is free, tagged with what each law needs to rank
 * them, and lets the caller's own law do the ranking. The three ledger refusals below are
 * the same in both directions: a person already carrying an errand, a person roaming, and
 * a person the ledger has placed somewhere else are all standing in another lane.
 *
 * @typedef {Object} CastableEntry
 * @property {Record<string, unknown>} npc
 * @property {{rosterId:string, name:string, role:string}} identity
 * @property {string} durableId the graduated id, or '' when the person has none yet
 * @property {number} importance the roster importance weight, 0..1
 */

/**
 * @param {unknown} worldState @param {string} settlementId @param {unknown} settlement
 * @returns {CastableEntry[]}
 */
export function castableRoster(worldState, settlementId, settlement) {
  const world = /** @type {Parameters<typeof npcLedgerOf>[0]} */ (worldState);
  const activeNpcIds = new Set(envoyErrandsOf(worldState)
    .filter((errand) => !['home', 'lost'].includes(String(errand.state)))
    .map((errand) => String(errand.npcId)));
  const ledger = npcLedgerOf(world);
  const roster = Array.isArray(asObject(settlement).npcs)
    ? /** @type {unknown[]} */ (asObject(settlement).npcs)
    : [];
  /** @type {CastableEntry[]} */
  const out = [];
  for (const raw of roster) {
    const npc = asObject(raw);
    if (!rosterPersonAvailable(npc)) continue;
    const identity = rosterIdentity(npc);
    if (!identity.name) continue;
    const durableId = durableIdForRoster(world, settlementId, identity) || '';
    if (durableId && activeNpcIds.has(durableId)) continue;
    if (durableId && ledger.roamers[durableId]) continue;
    if (durableId && ledger.placed[durableId]
      && String(ledger.placed[durableId].hostSettlementId || '') !== settlementId) continue;
    out.push({
      npc,
      identity,
      durableId,
      importance: importanceWeight(
        /** @type {Parameters<typeof importanceWeight>[0]} */ (npc),
      ),
    });
  }
  return out;
}

/**
 * THE INVERSE OF THE CAST — the person an errand's `npcId` NAMES, found again in the roster
 * that produced him.
 *
 * ⭐ THIS EXISTS SO THE ID LAW HAS ONE SPELLING IN BOTH DIRECTIONS. Both casting laws write
 * the errand's `npcId` as `durableId || rosterId` (the covert mint spells it exactly that
 * way, and the diplomatic one takes the same entry). A CONSUMER that wanted the person back
 * — to read his temperament, his flaws, his competence — had no reader and would have had to
 * re-derive that expression at its own call site. The day the graduation road changes which
 * half wins, an inlined copy keeps matching nothing and hands back null in silence, which is
 * the structurally-dead-world-term class this estate keeps paying for. So the forward law and
 * the inverse law sit in one file and move together.
 *
 * ⚠ IT DELIBERATELY DOES NOT FILTER ON AVAILABILITY. `castableRoster` refuses anyone already
 * carrying an errand, which is exactly who this function is asked about: the traveller is on
 * the road BECAUSE he was cast. Reusing that walk would return null for every live errand.
 *
 * @param {unknown} worldState @param {string} settlementId @param {unknown} settlement
 * @param {unknown} npcId the errand's own `npcId`
 * @returns {Record<string, unknown>|null} the roster record, or null when nobody matches
 */
export function rosterPersonById(worldState, settlementId, settlement, npcId) {
  const wanted = text(npcId);
  if (!wanted) return null;
  const world = /** @type {Parameters<typeof npcLedgerOf>[0]} */ (worldState);
  const roster = Array.isArray(asObject(settlement).npcs)
    ? /** @type {unknown[]} */ (asObject(settlement).npcs)
    : [];
  for (const raw of roster) {
    const npc = asObject(raw);
    const identity = rosterIdentity(npc);
    if (!identity.name) continue;
    const durableId = durableIdForRoster(world, settlementId, identity) || '';
    if ((durableId || identity.rosterId) === wanted) return npc;
  }
  return null;
}

/**
 * THE DIPLOMATIC DRAW — importance-DESCENDING. Choose one notable-or-higher roster person
 * deterministically. Diplomatic and governing roles win equal-importance ties; identity
 * then wins by codepoint.
 *
 * The `>= 0.4` floor is the roads law `ROADS_TUNING.MIN_TRAVEL_WEIGHT` states in words —
 * importance notable and above travels, minor and nameless never — and it is exactly what
 * covert casting does NOT apply, because a spy is drawn from the other end of the ladder.
 *
 * @param {unknown} worldState @param {string} settlementId @param {unknown} settlement
 * @returns {(CastableEntry & {diplomatic:number})|null}
 */
export function envoyCandidate(worldState, settlementId, settlement) {
  const candidates = castableRoster(worldState, settlementId, settlement)
    .filter((entry) => entry.importance >= 0.4)
    .map((entry) => {
      const role = entry.identity.role.toLowerCase();
      const diplomatic = /envoy|legate|diplomat|ambassador|chancellor|steward|council|ruler|mayor|lord|lady/.test(role) ? 1 : 0;
      return { ...entry, diplomatic };
    })
    .sort((left, right) => (right.importance - left.importance)
      || (right.diplomatic - left.diplomatic)
      || compareCodepoint(
        `${left.identity.rosterId}${IDENTITY_SEPARATOR}${left.identity.name}`,
        `${right.identity.rosterId}${IDENTITY_SEPARATOR}${right.identity.name}`,
      ));
  return candidates[0] || null;
}
