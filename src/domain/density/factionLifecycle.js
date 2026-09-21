/**
 * factionLifecycle.js — §810.4 R18 / R20: ROSTER-BOUND EXISTENCE, as a pure READING.
 *
 * This module answers one question for every faction in a settlement: **which of
 * the three legal states is it in?** — and, when a state transition is OWED, it
 * describes the reaction rather than performing it.
 *
 * ── WHY THIS IS A READER AND NOT A SWEEPER (§827: "STATE, NEVER FATE") ────────
 *
 * The owner's ruling binds R18's reshaping: *the engine kills no named
 * character, so dissolution is a REACTION to DM/party acts and to the typed
 * roster-emptying roads, never an engine sweep.* That is a constraint on WHERE
 * the decision lives, not merely on its tuning:
 *
 *   - Nothing here removes anyone. A roster reaches zero because a DM killed,
 *     exiled or removed its last member; this module only NOTICES that it did.
 *   - Nothing here draws a random number. Not one. A reaction to an accomplished
 *     fact needs no roll, and a law with no draw cannot perturb the ambient
 *     stream — so this module is dormancy-safe BY CONSTRUCTION, not by gating.
 *     (Compare the generation plane, where a probability-0 stressor row still
 *     moves 104 of 240 same-seed worlds precisely because it draws.)
 *   - The caller applies. This returns typed, inert descriptions.
 *
 * ── THE THREE STATES, AND WHY THERE IS NO FOURTH (§810.4 / R20) ───────────────
 *
 *   `crewed`               — roster ≥ 1. The ordinary state.
 *   `ruling_interregnum`   — roster 0, but this is the RULING faction, which
 *                            §810.3 R14 forbids the density law to fold: "the
 *                            density roll dissolved the government" is not a
 *                            story, it is a hole. The house persists, empty, and
 *                            the succession machinery owns it from here.
 *   `dissolved`            — roster 0, not ruling. The house ceases to exist,
 *                            with a chronicle receipt.
 *
 * R20 asserts over EVERY faction at EVERY tick that it is in one of these three
 * and no other. The walker that enforces it is v2-scoped per ODQ §827 — the
 * invariant only holds under the law that creates it, and a v1 world's state is
 * a census record, never a red.
 *
 * ⚠ THE RULING EXEMPTION IS NOT "SKIP IT". An emptied ruling house is a LOUD
 * state, not an ignored one: it reports as `ruling_interregnum` and carries its
 * own reaction kind, so a caller that forgets to handle it fails visibly rather
 * than silently leaving a headless government looking healthy.
 */

import { rollsRegisterVii } from './densityLaw.js';
import { seatKey } from './seatKey.js';

/** The three legal states of a faction under §810.4. There is no fourth. */
export const FACTION_LIFECYCLE_STATES = Object.freeze([
  'crewed', 'ruling_interregnum', 'dissolved',
]);

/**
 * The statuses that take a named figure OFF their house's roster.
 *
 * ⭐ CHOSEN BY IRREVERSIBILITY, AND THE CHOICE IS THE POINT. R18 names three
 * roads — "death, exile, departure". The full NPC vocabulary is
 * `active|dead|exiled|jailed|missing|removed|retired`, so four of those seven
 * had to be judged:
 *
 *   `dead`, `removed`  — irreversible. ABSENT.
 *   `exiled`           — named by R18 in its own words. ABSENT.
 *   `jailed`           — REVERSIBLE (a verdict ends). PRESENT. ⛔ AND THE NEAR
 *                        MISS IS WORTH THE WORDS: design §15 says "a jailed or
 *                        exiled holder cannot keep a seat", which is a fact about
 *                        AVAILABILITY, not about house membership. A jailed
 *                        figure cannot act, hold a place or succeed — that is
 *                        `NPC_UNAVAILABLE_STATUSES` in entities/npcs.js — but
 *                        they are still OF the house, so an all-jailed house
 *                        reads `crewed` and is never dissolved. Putting the word
 *                        on THIS line would trigger a permanent consequence from
 *                        a temporary cause, which is exactly what the rule below
 *                        forbids. Participation is a third question, cured once
 *                        at `isOffStage` by EM-B1f.
 *   `missing`          — REVERSIBLE; a missing factor may walk back through the
 *                        gate. Dissolution is permanent, so a temporary absence
 *                        must not trigger it — that would be R14's "hole" in a
 *                        second costume. PRESENT.
 *   `retired`          — a retired elder has not left the house. PRESENT.
 *   `active`           — PRESENT.
 *
 * The rule: an IRREVERSIBLE consequence may only be triggered by IRREVERSIBLE
 * causes. Vetoable — move a status across this line and the pins below will say
 * exactly what moved with it.
 */
export const ROSTER_ABSENT_STATUSES = Object.freeze(['dead', 'exiled', 'removed']);

const ABSENT = new Set(ROSTER_ABSENT_STATUSES);

/**
 * Is this figure still ON their house's roster?
 * @param {{status?: unknown}|null|undefined} npc
 * @returns {boolean}
 */
export function isOnRoster(npc) {
  if (!npc) return false;
  return !ABSENT.has(String(npc.status || 'active').toLowerCase());
}

/**
 * The named figures currently crewing one faction.
 *
 * Joins on `factionAffiliation` by the seat's DISPLAY NAME — the same key
 * `seatKey`, `ladderFactionKey` and `npcInFaction` all use. Read the name
 * through `seatKey`, never by hand: `.faction` wins over `.name`, and that
 * precedence is a house law several modules depend on.
 *
 * @param {{npcs?: Array<Record<string, unknown>>}|null|undefined} settlement
 * @param {Record<string, unknown>} faction
 * @returns {Array<Record<string, unknown>>}
 */
export function factionRosterOf(settlement, faction) {
  const key = seatKey(faction);
  if (!key) return [];
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  return npcs.filter(n => String(n?.factionAffiliation || '') === key && isOnRoster(n));
}

/**
 * The state of ONE faction. Pure, total, and never throws on a malformed input —
 * a faction with no resolvable key is `dissolved` by the same rule as an empty
 * roster: nothing joins to it, so nothing crews it.
 *
 * @param {{npcs?: Array<Record<string, unknown>>, powerStructure?: unknown}|null|undefined} settlement
 * @param {Record<string, unknown>} faction
 * @returns {'crewed'|'ruling_interregnum'|'dissolved'}
 */
export function factionLifecycleStateOf(settlement, faction) {
  if (factionRosterOf(settlement, faction).length > 0) return 'crewed';
  return faction?.isGoverning === true ? 'ruling_interregnum' : 'dissolved';
}

/**
 * READ the whole settlement's faction lifecycle — the R20 census and the R18
 * reactions in one pass.
 *
 * Returns a NO-OP shape under the dormant default (v1): no reactions, and an
 * empty census, because the invariant belongs to the law that creates it
 * (§827 scopes the R20 walker to v2). The settlement is never touched either
 * way — this function has no write path at all.
 *
 * @param {{
 *   config?: Record<string, unknown>,
 *   npcs?: Array<Record<string, unknown>>,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 * }|null|undefined} settlement
 * @param {{tick?: number|null}} [opts]
 * @returns {{
 *   governed: boolean,
 *   census: Array<{key: string, state: string, rosterSize: number, isGoverning: boolean}>,
 *   reactions: Array<{kind: string, factionKey: string, rosterSize: number, tick: number|null, reason: string}>,
 * }}
 */
export function readFactionLifecycle(settlement, opts = {}) {
  const config = settlement?.config || {};
  const factions = Array.isArray(settlement?.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : [];

  // The dormant default: v1 worlds carry no Register VII invariant, so there is
  // nothing to census and nothing to react to. Returning empty (rather than a
  // census that "happens to pass") keeps a v1 red structurally impossible.
  if (!rollsRegisterVii(config)) {
    return { governed: false, census: [], reactions: [] };
  }

  const tick = opts.tick ?? null;
  const census = [];
  const reactions = [];

  for (const faction of factions) {
    const key = seatKey(faction);
    const roster = factionRosterOf(settlement, faction);
    const state = factionLifecycleStateOf(settlement, faction);
    census.push({
      key, state, rosterSize: roster.length, isGoverning: faction?.isGoverning === true,
    });

    if (state === 'crewed') continue;

    reactions.push(state === 'ruling_interregnum'
      ? {
        kind: 'ruling_interregnum',
        factionKey: key,
        rosterSize: 0,
        tick,
        // The reason travels WITH the reaction so the chronicle line can say
        // what happened without re-deriving it from a shape it no longer has.
        reason: 'the ruling house lost its last named figure; R14 forbids the '
          + 'density law to fold the government, so the seat stands empty and '
          + 'the succession machinery owns it',
      }
      : {
        kind: 'faction_dissolved',
        factionKey: key,
        rosterSize: 0,
        tick,
        reason: 'the last named figure left the roster (death, exile or removal); '
          + 'a house with nobody in it is unrepresentable under R17',
      });
  }

  return { governed: true, census, reactions };
}
