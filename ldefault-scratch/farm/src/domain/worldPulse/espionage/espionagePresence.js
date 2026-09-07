/**
 * espionagePresence.js — ES-5b: THE ABSENCE COST, the bench grain.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.11 (J-ES-9). A faction whose members are abroad weighs
 * LESS in the court that is deciding without them: its share of the council bench and
 * its weight in the contest math are both discounted by the share of its roster that is
 * away. The amendment's other grain — the CAREER cost, §3.14's promotion-risk register
 * folded into the ladder contest — is ES-5c's and is NOT here.
 *
 * PURE, and it WRITES NOTHING. This is a DERIVED read over two structures the wave does
 * not own: the roster (`worldState.factionStates[fid].memberNpcIds`, written only by
 * `seatNpcsIntoFactions`) and the whereabouts mirror (`settlement.npcs[].whereabouts`,
 * written only by `advanceRoads`). No persistence, no regen, no undo, no migration seam
 * applies — the `ransomDwellRead` precedent, and §1's zero-new-keys law.
 *
 * ── ⚠ THE DECLARED ONE-TICK LAG (§0.2, CR-ES5B-2 — ACCEPTED, DECLARED AND PINNED) ────
 * `presentShare01`'s two inputs are written at OPPOSITE ENDS of one tick, and every
 * consumer sits between them. `seatNpcsIntoFactions` writes `memberNpcIds` in the
 * actor_memory stage; `advanceRoads` writes `npc.whereabouts` in the consequence_fold
 * stage, LAST. All three bloc consumers — `advanceSettlementPolitics`, this wave's new
 * `evaluateFactionRules` reach, and `advanceNpcLadder` — read the mirror BEFORE this
 * tick's write, so every one of them sees LAST tick's whereabouts.
 *
 * THE LAG IS THEREFORE UNIFORM AT EXACTLY ONE TICK, AND IT IS FORCED. Moving a consumer
 * later is not available: FP L1 banks pulseKernel.js and applyWorldPulse.js at zero
 * headroom, so no wave reorders the pulse. An UNDECLARED lag is the bug; this one is
 * declared here, restated at both consumption sites, and pinned by acceptance case A5.
 * §3.11's own parenthesis already anticipates it — "the whereabouts mirror is
 * self-healing, rewritten from the ledger each tick".
 *
 * ── ⚠ ONE OF THIS LEAF'S TWO CROSS-LAYER EDGES IS INVISIBLE TO THE RATCHET ───────────
 * `factionCompetition.js` is INTERIOR and this file is INFO, so that importer mints a
 * live `INFO→INTERIOR` pair which the CPL-20 row `ES5B_ABSENCE_BENCH_COUPLING` licenses.
 * `settlementPolitics.js` is UNLAYERED, and `scanCrossLayerPairs` iterates only LAYERED
 * importers — so its read of this leaf mints NO pair at all. That is FAIL-OPEN
 * INVISIBILITY, not absence: the read is just as cross-layer as the other one, and the
 * walker simply cannot see it. CR-ES5B-4 rules that the row is minted anyway and names
 * the unseen edge in its own docstring, on the `ES5_DOCTRINE_MORAL_LADDER_COUPLING`
 * precedent of a row recording its own asymmetry.
 *
 * ⛔ THIS LEAF MUST NEVER IMPORT `factionCompetition.js` (or `candidateEvents.js`). The
 * edge runs INTERIOR→INFO in exactly one direction; importing back would close the loop
 * and a barrel hop drags the whole family into the espionage closure. Dependency
 * inversion is why `presentShare01` takes a caller-supplied Map and reaches for no world.
 *
 * DARK ⇒ NOTHING: `presenceSharesFor` returns null on one `espionageActive` read before
 * it touches a world object, so a dark world — including a roads-lit, espionage-dark one
 * — pays a single flag read and is BYTE-IDENTICAL. The lit shift is disclosed under ⟨F6⟩.
 */
import { clamp01 } from '../../../kernel/math.js';
import { compareCodepoint } from '../../deterministicSort.js';
import { WHEREABOUTS_STATES } from '../../roads/state.js';
import { npcId } from '../npcAgency.js';
import { stablePart } from '../worldState.js';
import { espionageActive } from './espionageGate.js';
import { ESPIONAGE_TUNING, round4 } from './espionageMath.js';

/**
 * THE AWAY SET — DERIVED FROM THE FROZEN EXPORT, NEVER RE-TYPED AS A LITERAL.
 *
 * §3.11's vocabulary is exactly `WHEREABOUTS_STATES` minus `hostage`, and the exclusion
 * is spelled as a filter over the roads export rather than as the triple
 * `['traveling', 'visiting', 'returning']` so that the day roads adds a fifth state it
 * joins the away set instead of escaping the discount in silence. A hostage is ALREADY
 * off-stage — §3.11 excludes them by name — so a captive faction is not also fined for
 * the captivity.
 * @type {ReadonlyArray<string>}
 */
const AWAY_STATES = Object.freeze(WHEREABOUTS_STATES.filter((state) => state !== 'hostage'));

/** The only npc shape this leaf reads. @typedef {{ whereabouts?: { state?: unknown } }} PresenceNpc */
/** The only factionStates shape this leaf reads.
 *  @typedef {{ settlementId?: unknown, name?: unknown, memberNpcIds?: unknown }} PresenceFactionState */
/** @typedef {{ byFactionId: Map<string, number>, byNameKey: Map<string, number> }} PresenceShares */

/**
 * §3.11 THE ABSENCE COST, pure core: what share of its weight a faction still carries
 * while part of its roster is abroad.
 *
 * TAKES NO WORLD OBJECT, BY CONSTRUCTION. The caller supplies the resolved npc index as
 * a plain Map (dependency inversion), which is what keeps this leaf importable from an
 * INTERIOR consumer without closing a module loop — and what lets a test drop any single
 * term. A member id that resolves to NO npc contributes ZERO away: absent from the index
 * is not the same claim as away from the court, and counting it would fine a faction for
 * a roster the settlement no longer carries.
 *
 * @param {unknown} memberNpcIds the roster off `factionStates[fid].memberNpcIds`
 * @param {unknown} npcsById caller-built `Map<string, npc>` keyed with `npcId(...)`
 * @returns {number} `[1 - ABSENT_W, 1]`, round4. NEVER 0, null, undefined or NaN.
 */
export function presentShare01(memberNpcIds, npcsById) {
  if (!Array.isArray(memberNpcIds) || memberNpcIds.length === 0) return 1;
  if (!(npcsById instanceof Map)) return 1;
  let away = 0;
  for (const id of memberNpcIds) {
    const npc = /** @type {PresenceNpc | null} */ (npcsById.get(String(id)) ?? null);
    if (!npc) continue;
    if (AWAY_STATES.includes(String(npc.whereabouts?.state ?? ''))) away += 1;
  }
  const ratio = away / Math.max(1, memberNpcIds.length);
  return round4(clamp01(1 - ESPIONAGE_TUNING.ABSENT_W * ratio));
}

/**
 * The per-settlement composer BOTH consumers call — the council bench
 * (`settlementPolitics.js#rulingBlocOf`) and the contest math
 * (`factionCompetition.js#topFactionEntries`).
 *
 * ⭐ TWO KEYS, BECAUSE THE TWO CONSUMERS ADDRESS A FACTION DIFFERENTLY, AND NEITHER KEY
 * IS MINTED HERE. `byFactionId` is keyed on the `factionStates` entry's OWN key, which
 * `ensureFactionStates` minted with `factionId(item.id, faction, index)` — the identical
 * expression `topFactionEntries` uses — so that join is exact by construction and this
 * file mints no second identity spelling (HZ5). `byNameKey` mirrors
 * `settlementPolitics.js`'s own bucket key, `stablePart(String(st.name || …))`, which is
 * what joins `rulingBlocOf`'s `stablePart(factionNameOf(f))` roster key.
 *
 * ⚠ THE NAME KEY IS THIS PACKET'S ONE KEY MIRROR, AND IT FAILS SAFE. A name that does
 * not join yields no map entry, the consumer's `?? 1` supplies the IDENTITY multiplier,
 * and the court is byte-identical to base. It can never degrade to 0. Case A7 drives a
 * deliberately unjoinable name and asserts exactly that.
 *
 * @param {unknown} worldState
 * @param {unknown} item the settlement item off the pre-tick snapshot
 * @returns {PresenceShares | null}
 *   null when espionage is dark, or the world carries no faction states at all.
 */
export function presenceSharesFor(worldState, item) {
  if (espionageActive(worldState) !== true) return null;
  const world = /** @type {{ factionStates?: Record<string, unknown> }} */ (worldState ?? {});
  const factionStates = world.factionStates;
  if (!factionStates || typeof factionStates !== 'object') return null;
  const settlementItem = /** @type {{ id?: unknown, settlement?: { npcs?: unknown } }} */ (item ?? {});
  const sid = String(settlementItem.id ?? '');
  // ⚠ THE RAW ROSTER, DELIBERATELY — NEVER THE PARTICIPATION VIEW (§8 disposition). The
  // participation gate filters OFF-STAGE npcs out, and an away member IS off-stage: read
  // through the gate, every absent member would simply be missing from this index, count
  // ZERO away by the absent-is-not-away rule, and the discount would silently never fire.
  // The question here is WHO BELONGS TO THIS COURT, not who acted this tick.
  const rosterValue = settlementItem.settlement?.npcs;
  const roster = Array.isArray(rosterValue) ? rosterValue : [];
  /** @type {Map<string, unknown>} */
  const npcsById = new Map();
  roster.forEach((npc, index) => {
    npcsById.set(String(npcId(settlementItem.id, npc, index)), npc);
  });
  /** @type {Map<string, number>} */
  const byFactionId = new Map();
  /** @type {Map<string, number>} */
  const byNameKey = new Map();
  // ONE codepoint-ordered walk builds both maps. The order is the SAME order
  // settlementPolitics.js:705 walks factionStates in, which is what makes the
  // first-wins name bucket below agree with the bucket rulingBlocOf reads against.
  // Neither map is iterated for output — both are only `get()`-ed — so no iteration
  // order can leak into a persisted byte.
  for (const fid of Object.keys(factionStates).sort(compareCodepoint)) {
    const state = /** @type {PresenceFactionState | null} */ (factionStates[fid] ?? null);
    if (!state || typeof state !== 'object') continue;
    if (String(state.settlementId ?? '') !== sid) continue;
    const share = presentShare01(state.memberNpcIds, npcsById);
    byFactionId.set(fid, share);
    const nameKey = stablePart(String(state.name || ''));
    if (nameKey && !byNameKey.has(nameKey)) byNameKey.set(nameKey, share);
  }
  return { byFactionId, byNameKey };
}
