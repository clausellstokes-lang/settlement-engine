/**
 * factionDensityKernel.js — THE DENSITY LANE'S PULSE SEAM (§810.4 R18/R20).
 *
 * D2b built the density law's live half as four PURE LAWS: each decides and returns
 * an inert frozen plan, none of them writes, and the caller applies. This is that
 * caller. The laws stay provable in isolation over hundreds of seeds; the writing —
 * which needs a settlement, a tick and a news feed — lives here, once.
 *
 * ── WHY THE FROZEN KERNEL DOES NOT GROW ──────────────────────────────────────
 *
 * `pulseKernel.js` is baselined EXACT at 1581 effective lines and chair-banked
 * permanently (`_r_bld_10_…`, scripts/.size-baseline.json), and the size ratchet
 * fails ABOVE and BELOW alike — so a new `applyPulseMover(...)` call site would have
 * to be bought back line for line. The estate's own answer is the NAME-SWAP idiom
 * (traditions→roads→commons→assize): the composition grows in a LEAF and the kernel
 * changes by NAME ONLY. `advanceNpcGrowthWithFabricAndConsequenceAndLadderAnd-
 * TraditionsAndRoadsAndCommonsAndAssizeAndDensity` below is that swap, and this car
 * adds ZERO net lines to either pulse mouth.
 *
 * ── THE GATE IS THE WORLD'S OWN LAW VERSION, NOT A SIMULATION RULE ────────────
 *
 * Every other mover on this chain is dark behind a virtual `<x>Enabled` flag. This
 * one is NOT, and that is deliberate on two independent grounds:
 *
 *   1. §840 chartered a HARD CEILING — `subsystemRowsVirtual.js` sits at exactly
 *      800/800 and NO further virtual flag may land estate-wide until TE-VIRT-1's
 *      decomposition car does. "Any density successor" is named in that ruling.
 *   2. The density law already HAS its dormancy gate, and it is a better one.
 *      `rollsRegisterVii(settlement.config)` reads the version the world was BORN
 *      under (`_densityLawVersion`), which travels in the persisted config beside
 *      `_seed` — so a save, a load, a same-seed regen and an undo all replay the
 *      law the world was born under. THE PROMISE is kept by the gate that already
 *      exists rather than by a second dial.
 *
 * The product dial (`NEW_SETTLEMENT_DENSITY_LAW_VERSION`) is held at v1 pending the
 * owner's tuning signature, so every world the product makes today reads dormant
 * here and this mover returns its inputs BY REFERENCE.
 *
 * ── READ AT TICK-START, CONFIRM AT WRITE, WRITE FOR NEXT TICK ─────────────────
 *
 * The law is read against the SNAPSHOT — the tick's opening picture — so no other
 * mover's ordering can change what this one decides. The write then lands on the
 * FRESHEST `settlementUpdates` entry so nothing another mover wrote this tick is
 * clobbered, and every reaction is RE-CONFIRMED against that fresh copy before it
 * is applied: a house someone re-crewed mid-tick must not be dissolved by a reading
 * taken before they did. Settlements are walked in CODEPOINT order, so the result
 * cannot depend on map iteration order on any host.
 *
 * ── NO DRAW. NOT ONE. ────────────────────────────────────────────────────────
 *
 * This module never calls `_rng()`, and the growth chain hands it no rng to call.
 * That is the strongest dormancy guarantee available: a law that takes no draw
 * cannot perturb the ambient stream, so wired-but-dormant is byte-identical BY
 * CONSTRUCTION rather than by gating. D2b measured the alternative — a stressor row
 * that can NEVER FIRE still moved 104 of 240 same-seed worlds purely by drawing.
 *
 * ── THE TWO BEATS SELF-LIMIT AT THEIR OWN DOOR ───────────────────────────────
 *
 * Mover-authored receipts never reach `isMetronomeRepeat`, so each one must carry
 * its own suppression:
 *
 *   `faction_dissolved`   — self-limiting by CONSTRUCTION. The house leaves the live
 *                           roster, so the same beat cannot be minted twice.
 *   `faction_interregnum` — a ONCE-PER-STATE-CHANGE LATCH. An emptied ruling house
 *                           is a STANDING state that re-reads identically every tick,
 *                           which is exactly the E4-2a flood class. The house carries
 *                           `interregnumSinceTick`; the beat fires only on the
 *                           transition into the state, and a house that empties,
 *                           refills and empties again inside the metronome's own
 *                           `DRIFT_REEMIT_COOLDOWN_TICKS` window stays silent.
 *
 * ⚠ THE WINDOW IS BORROWED, NEVER AUTHORED (the HK-4 razing-latch law). A second
 * spelling of the same number would be free to drift away from the thing it mirrors.
 *
 * ── WHAT THIS CAR DELIBERATELY DOES NOT DO ───────────────────────────────────
 *
 * §810.5's JUNCTION — an emptied ruling roster triggering a typed missing-seat
 * stressor — is NOT wired here. §837 re-ruled §827 on executed evidence and reserved
 * the leaderless member to the owner's pen; until that word arrives the interregnum
 * is a receipted, marked state and no stressor is minted. The seam is named so the
 * next lane does not have to rediscover it: the mark this module writes
 * (`interregnumSinceTick`) is exactly the trigger a stressor mint would read.
 */

import { num, asObject, compareCodepoint } from './npcLadderState.js';
import { stablePart } from './stablePart.js';
import { DRIFT_REEMIT_COOLDOWN_TICKS } from './worldPulseFeedCuration.js';
import { readFactionLifecycle, factionRosterOf } from '../../generators/density/factionLifecycle.js';
import { seatKey } from '../../generators/density/applyDensityLaw.js';
import { advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize } from './assizeKernel.js';

/** The mark an emptied ruling house carries while its succession is unresolved.
 *  It is BOTH the once-per-state-change latch for the beat AND the named seam a
 *  future §810.5 stressor mint reads — one field, not two. */
export const INTERREGNUM_MARK = 'interregnumSinceTick';

/**
 * Is this house's interregnum beat still inside the metronome's window?
 *
 * A future-dated mark does NOT latch (`age >= 0` is required as well as
 * `age < the window`), so an imported or forged history whose tick sits ahead of the
 * world's cannot silence a settlement's politics forever — the razing latch's own
 * discipline, obeyed here rather than restated.
 *
 * @param {Record<string, unknown>} faction
 * @param {number} tick
 * @returns {boolean}
 */
function interregnumCooldownActive(faction, tick) {
  const since = faction[INTERREGNUM_MARK];
  if (since === undefined || since === null) return false;
  const at = Number(since);
  if (!Number.isFinite(at)) return false;
  const age = tick - at;
  return age >= 0 && age < DRIFT_REEMIT_COOLDOWN_TICKS;
}

/**
 * The in-world receipt for a house that has ceased to exist.
 *
 * R18's own example sets the register: "the last factor of the weavers' house took
 * the north road; the house is no more." No engine scalar reaches the prose.
 *
 * @param {{sid: string, townName: string, houseName: string, reason: string,
 *          tick: number, now: string|null}} a
 * @returns {Record<string, unknown>}
 */
function dissolvedBeat({ sid, townName, houseName, reason, tick, now }) {
  return {
    id: `wizard_news.${tick}.faction_dissolved.${stablePart(sid)}.${stablePart(houseName)}`,
    createdAt: now,
    tick,
    scope: 'local',
    significance: 'notable',
    severity: 0.5,
    score: 55,
    headline: `${townName}: the ${houseName} is no more`,
    summary: `The last named figure of the ${houseName} is off its roster, and a house `
      + `with nobody in it is not a house. Its grudges and its receipts stay on the `
      + `record; its seat among ${townName}'s powers does not. ${reason}`,
    kind: 'applied',
    impactKind: 'faction_dissolved',
    channelType: 'political_authority',
    settlementIds: [sid],
    impactIds: [],
    channelIds: [],
    sourceEventId: `faction_dissolved.${sid}.${stablePart(houseName)}.${tick}`,
    tags: ['world_pulse', 'faction_density', 'dissolution'],
    reasons: [reason],
  };
}

/**
 * The in-world receipt for a ruling house that has lost its last named figure.
 *
 * §810.3 R14 forbids the density law to fold the government — "the density roll
 * dissolved the government" is not a story, it is a hole — so this beat announces a
 * LOUD standing state rather than an ending.
 *
 * @param {{sid: string, townName: string, houseName: string, reason: string,
 *          tick: number, now: string|null}} a
 * @returns {Record<string, unknown>}
 */
function interregnumBeat({ sid, townName, houseName, reason, tick, now }) {
  return {
    id: `wizard_news.${tick}.faction_interregnum.${stablePart(sid)}.${stablePart(houseName)}`,
    createdAt: now,
    tick,
    scope: 'regional',
    significance: 'major',
    severity: 0.75,
    score: 78,
    headline: `${townName}: the ruling seat stands empty`,
    summary: `The ${houseName} holds ${townName}'s seat and no longer holds a single `
      + `named figure to sit in it. The house does not fall — a settlement cannot be `
      + `left with nobody running anything — so the seat stands empty and open, and `
      + `whoever can make a claim will be heard. ${reason}`,
    kind: 'applied',
    impactKind: 'faction_interregnum',
    channelType: 'political_authority',
    settlementIds: [sid],
    impactIds: [],
    channelIds: [],
    sourceEventId: `faction_interregnum.${sid}.${stablePart(houseName)}.${tick}`,
    tags: ['world_pulse', 'faction_density', 'interregnum'],
    reasons: [reason],
  };
}

/**
 * Apply one settlement's R18/R20 reactions, returning the next settlement record and
 * the beats it earned. PURE: it reads two settlement pictures and returns new values.
 *
 * @param {Record<string, unknown>} fresh the freshest copy — what the write lands on,
 *   and what every reaction is RE-CONFIRMED against (the law itself read tick-start)
 * @param {Array<Record<string, unknown>>} reactions from `readFactionLifecycle`
 * @param {{sid: string, tick: number, now: string|null}} ctx
 * @returns {{settlement: Record<string, unknown>|null, beats: Record<string, unknown>[]}}
 *   `settlement` is null when nothing moved, so the caller can keep its array reference.
 */
function applyReactions(fresh, reactions, ctx) {
  const ps = asObject(fresh.powerStructure);
  const factions = Array.isArray(ps.factions)
    ? /** @type {Record<string, unknown>[]} */ (ps.factions)
    : null;
  if (!factions) return { settlement: null, beats: [] };

  const townName = typeof fresh.name === 'string' && fresh.name ? String(fresh.name) : ctx.sid;
  /** @type {Map<string, Record<string, unknown>>} */
  const byKind = new Map();
  for (const raw of reactions) {
    const r = asObject(raw);
    byKind.set(`${String(r.kind)}::${String(r.factionKey)}`, r);
  }

  /** @type {Record<string, unknown>[]} */
  const beats = [];
  /** @type {Record<string, unknown>[]} */
  const next = [];
  let moved = false;

  for (const faction of factions) {
    const key = seatKey(faction);
    const dissolve = byKind.get(`faction_dissolved::${key}`);
    const interregnum = byKind.get(`ruling_interregnum::${key}`);
    // ⭐ THE CONFIRMATION. The law read the tick's opening picture; between then and
    // now another mover may have seated somebody. An irreversible consequence may
    // only fire on a fact that is still true at the moment it is applied.
    const stillEmpty = factionRosterOf(fresh, faction).length === 0;

    if (dissolve && stillEmpty) {
      moved = true;
      beats.push(dissolvedBeat({
        sid: ctx.sid, townName, houseName: key || 'house',
        reason: String(dissolve.reason || ''), tick: ctx.tick, now: ctx.now,
      }));
      continue; // R18: live state is swept. History (receipts, grudges) is untouched.
    }

    if (interregnum && stillEmpty) {
      if (interregnumCooldownActive(faction, ctx.tick)) { next.push(faction); continue; }
      moved = true;
      next.push({ ...faction, [INTERREGNUM_MARK]: ctx.tick });
      beats.push(interregnumBeat({
        sid: ctx.sid, townName, houseName: key || 'house',
        reason: String(interregnum.reason || ''), tick: ctx.tick, now: ctx.now,
      }));
      continue;
    }

    // A house that was marked and is crewed again leaves the interregnum SILENTLY —
    // the recovered seat is the record, not a second beat. Clearing the mark by
    // ABSENCE (rather than writing a null) keeps a never-emptied world byte-identical.
    if (!stillEmpty && faction[INTERREGNUM_MARK] !== undefined) {
      moved = true;
      const { [INTERREGNUM_MARK]: _resolvedInterregnum, ...cleared } = faction;
      next.push(cleared);
      continue;
    }
    next.push(faction);
  }

  if (!moved) return { settlement: null, beats: [] };
  return {
    settlement: { ...fresh, powerStructure: { ...ps, factions: next } },
    beats,
  };
}

/**
 * THE DENSITY LANE'S MOVER — §810.4 R18 (roster-bound existence) and R20 (the
 * three-states invariant), applied.
 *
 * Dormant (every world the product makes today) ⇒ an exact no-op: the same
 * `worldState` and `settlementUpdates` references come back, zero keys, zero beats.
 *
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>,
 *           settlementUpdates?: unknown, tick?: unknown, now?: unknown }} args
 * @returns {{ changed: boolean, worldState: Record<string, unknown>,
 *             settlementUpdates: Record<string, unknown>[],
 *             newsEntries: Record<string, unknown>[] }}
 */
export function advanceFactionDensity(args) {
  const worldState = args.worldState;
  const updates = Array.isArray(args.settlementUpdates)
    ? /** @type {Record<string, unknown>[]} */ (args.settlementUpdates)
    : [];
  const tick = Math.max(0, Math.floor(num(args.tick, 0)));
  const nowIso = typeof args.now === 'string' ? args.now : null;

  const snap = asObject(args.snapshot);
  const items = Array.isArray(snap.settlements)
    ? /** @type {Record<string, unknown>[]} */ (snap.settlements)
    : [];
  if (!items.length) return { changed: false, worldState, settlementUpdates: updates, newsEntries: [] };

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(asObject(u).saveId), i));
  /** @type {Map<string, Record<string, unknown>>} */
  const itemById = new Map(items.map(it => [String(asObject(it).id), asObject(it)]));
  const orderedIds = [...itemById.keys()].sort(compareCodepoint);

  /** @type {Record<string, unknown>[]} */
  const newsEntries = [];
  let nextUpdates = updates;
  let cloned = false;

  for (const sid of orderedIds) {
    const item = itemById.get(sid);
    const tickStart = item && item.settlement ? asObject(item.settlement) : null;
    if (!tickStart) continue;

    // THE LAW, READ AT TICK-START. Returns an empty no-op shape for a v1 world, so
    // the dormant path costs one config read per settlement and writes nothing.
    const reading = readFactionLifecycle(
      /** @type {Parameters<typeof readFactionLifecycle>[0]} */ (
        /** @type {unknown} */ (tickStart)),
      { tick },
    );
    // ⚠ NOT `|| !reading.reactions.length`. A house that RECOVERED carries a mark and
    // produces no reaction — it is `crewed` again — so an early return on an empty
    // reaction list would leave the interregnum mark on a settlement that has a ruler,
    // and the next emptying would then be silenced by a stale latch. The v1 gate is
    // what makes the walk free; the reaction count is not a gate at all.
    if (!reading.governed) continue;

    const ui = updateIndex.get(sid);
    const fresh = ui !== undefined && asObject(nextUpdates[ui]).settlement
      ? asObject(asObject(nextUpdates[ui]).settlement)
      : tickStart;

    const applied = applyReactions(
      fresh,
      /** @type {Record<string, unknown>[]} */ (reading.reactions),
      { sid, tick, now: nowIso },
    );
    if (!applied.settlement) continue;
    // A settlement with no update entry cannot be written this tick — the fold only
    // carries entries that exist. Saying so by SKIPPING (rather than minting an entry
    // this seam does not own) keeps the one-writer law intact.
    if (ui === undefined) continue;

    if (!cloned) { nextUpdates = updates.slice(); cloned = true; }
    nextUpdates[ui] = { ...asObject(nextUpdates[ui]), settlement: applied.settlement };
    for (const beat of applied.beats) newsEntries.push(beat);
  }

  // ⚠ `changed` must be true whenever EITHER output moved: applyPulseMover's guard
  // clause throws away both when it is false, which has shipped a defect before.
  const changed = newsEntries.length > 0 || nextUpdates !== updates;
  return { changed, worldState, settlementUpdates: nextUpdates, newsEntries };
}

// ── THE PULSE SEAM — the assize chain composed with the density lane ────────────────
/**
 * The growth+fabric+consequence+ladder+traditions+roads+commons+assize chain composed
 * with the DENSITY lane (§810.4 R18/R20). `pulseKernel` calls THIS in place of
 * `advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize`
 * — a name swap, so the frozen kernel changes by name only (the roads-onto-traditions
 * idiom).
 *
 * DENSITY RUNS LAST, over the fully-settled tick, and that is the point: a roster
 * reaches zero because something else in this tick emptied it, and R18 is a REACTION
 * to an accomplished fact. Running earlier would react to yesterday's world.
 *
 * No cycle: this leaf imports the assize kernel; it does not import back.
 *
 * @param {Parameters<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize>[0]} args
 * @returns {ReturnType<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize>}
 */
export function advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssizeAndDensity(args) {
  const prior = advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize(args);
  const a = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args));
  const density = advanceFactionDensity({
    snapshot: a.snapshot,
    worldState: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (prior.worldState)),
    settlementUpdates: prior.settlementUpdates,
    tick: a.tick,
    now: a.now,
  });
  if (!density.changed) return prior;
  return {
    worldState: /** @type {typeof prior.worldState} */ (/** @type {unknown} */ (density.worldState)),
    settlementUpdates: /** @type {typeof prior.settlementUpdates} */ (/** @type {unknown} */ (density.settlementUpdates)),
    changed: prior.changed || density.changed,
    newsEntries: [...prior.newsEntries, ...(/** @type {typeof prior.newsEntries} */ (/** @type {unknown} */ (density.newsEntries)))],
  };
}
