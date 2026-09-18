/**
 * applyDensityLaw.js — the ONLY writer of the tier-gated density law, and the
 * adapter between the estate's shapes and `densityRoll.js`'s pure plan.
 *
 * The roll decides; this module writes. Everything version-gated lives behind
 * `rollsRegisterVii(config)`, and every entry point below is a NO-OP that
 * returns its input UNTOUCHED under the dormant default — not "returns an
 * equivalent object", returns the SAME object — so a v1 world's generation is
 * not merely equal to the pre-law generation, it is the pre-law generation.
 *
 * ── THE THREE SEAMS, AND WHY THEY SIT WHERE THEY DO ──────────────────────────
 *
 *   `rollNamedMass()`          at the POPULATION seam — hands the tier-gated
 *       named-NPC mass target to the NPC generator, before the roster is drawn.
 *
 *   `resizePoliticalRoster()`  at the ASSEMBLY seam, AFTER
 *       `reconcilePowerStructure` — sizes the power roster to the tier's faction
 *       band and mints each doubled niche's second claimant.
 *
 *   `disperseNamedRoster()`    at the COHERENCE seam (`enrichNpcCoherence`) —
 *       partitions the roster that actually exists across the factions that
 *       actually exist, rolls their rungs, and stamps every figure's importance.
 *
 * ⛔ THE RESIZE CANNOT HAPPEN AT THE POPULATION SEAM, AND A REAL GUARD PROVED IT.
 * `power/economyReconciliation.js` REPLAYS the whole power generation at
 * assembly and asserts the faction identity roster is unchanged
 * (`assertStableGeneratedRoster`) — an earlier trim throws there, and even if it
 * did not, the replay would restore every trimmed seat. The roster is that
 * step's product until reconciliation has finished with it; the density law
 * therefore resizes AFTER, which is also where `generateCoherence` reads it
 * from. Attempted the other way first; the guard convicted it.
 *
 * The coherence seam is shared by full assembly AND by NPC section-regen, which
 * is why it runs in the roll's RE-DERIVATION mode: it takes the roster and the
 * mass as facts and draws only the dispersal and the rungs. A regen therefore
 * reproduces the same political shape instead of re-sizing a world that already
 * exists — the lifecycle bug that split exists to prevent.
 *
 * Each seam draws from its own keyed fork of its own caller's stream. That is
 * the fork discipline, not a compromise: one law, one roll function, three
 * callers (§810.6 R21's "birth · growth · ascension — one law, never three"),
 * each isolated so a draw at one seam cannot move another.
 *
 * ── WHAT THIS REPLACES (§817-Q1) ─────────────────────────────────────────────
 * Under v2 the office-coverage appender `ensureFactionStructuralNpcs` is gated
 * OFF, because office coverage has become a CONSTRAINT ON THE ROLL: R17's atomic
 * mint gives every seated faction ≥1 member and the rung roll makes one of them
 * its head. The census measured the appender pushing 15 of 60 thorps above the
 * candidate mass band by construction; a post-roll append cannot coexist with a
 * hard band, so the coverage moved inside the roll rather than the band moving.
 */

import { matchFactionArchetype } from '../factionRoles.js';
import { seatKey } from '../../domain/density/seatKey.js';
import { FACTION_DESCRIPTORS } from '../../data/powerData.js';
import {
  DOUBLED_NICHE_SHARE, FLOOR_LIFT_CHANCE, bandsForTier, tierKey,
} from '../../domain/density/densityBands.js';
import { rollsRegisterVii } from '../../domain/density/densityLaw.js';
import { RUNG_ROLE_FIELD } from '../../domain/density/densityRungs.js';
import { rollDensityPlan } from './densityRoll.js';
// ⚠ THE KERNEL'S CLAMP, NOT A LOCAL COPY (`tests/lint/clampPrimitiveBaseline.test.js`).
// All three call sites below are provably finite — two are `0.5 + 0.5 * <array length>`,
// and the third sits behind an explicit `Number.isFinite` guard — so the kernel's non-finite
// policy (⇒ 0) is unreachable here: a strictly safer floor, never a behaviour change.
import { clamp01 } from '../../kernel/math.js';
import { prosperityRank01 } from '../../domain/prosperityRank.js';

/** The stressor family that may lift the seat floor (§810.3 R13 / §810.5). ONE
 *  closed vocabulary serves birth and play; `succession_void` already exists in
 *  the generator's stressor list, which is why R13 is a pure build and not a
 *  new vocabulary. CANDIDATE register — the owner's pen freezes it. */
export const MISSING_SEAT_STRESSORS = Object.freeze(['succession_void']);

/* `FLOOR_LIFT_CHANCE` moved to `domain/density/densityBands.js` in car D4 — the
 * hand-off this line's own note asked for ("until D4 folds it in with the rest of the
 * signed values"). Imported above; value unchanged. */

const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

/* `seatKey` moved to `domain/density/seatKey.js` at the DENS landing (bill 7) —
 * the pulse seam joins on it at tick time, and importing the BIRTH writer for a
 * three-line key was the static edge that pulled the generator closure into
 * first paint. Imported back above; body verbatim at its new home. */

/**
 * Adapt `powerStructure.factions` into the roll's power shape.
 * @param {{factions?: Array<Record<string, unknown>>}|null|undefined} powerStructure
 */
export function densityPowersFrom(powerStructure) {
  const seats = powerStructure?.factions || [];
  return seats.map(seat => ({
    key: seatKey(seat),
    name: seatKey(seat),
    category: String(seat.category || 'other'),
    power: num(seat.power, 1),
    isGoverning: seat.isGoverning === true,
    officeRoleKey: matchFactionArchetype(seat),
  })).filter(p => p.key);
}

/**
 * The settlement's PARTICULARS, normalised to 0..1 — §810 R1's "prosperity,
 * connectivity, war state, corruption climate". Every term degrades to 0.5
 * ("unremarkable") when its source is absent, so a partial context tilts
 * nothing rather than tilting wrongly.
 *
 * @param {{economicState?: Record<string, unknown>, config?: Record<string, unknown>,
 *          stress?: unknown}} input
 */
export function densityParticularsFrom(input = {}) {
  const config = input.config || {};
  const prosperity = input.economicState?.prosperity;
  const stresses = stressTypesOf(config, input.stress);
  const WAR = new Set(['wartime', 'under_siege', 'insurgency', 'occupied', 'slave_revolt', 'monster_pressure']);
  const CORRUPT = new Set(['infiltrated', 'recently_betrayed', 'indebted', 'politically_fractured', 'succession_void']);
  const route = String(config.tradeRouteAccess || 'road').toLowerCase();
  const ROUTE_CONNECTIVITY = { isolated: 0.1, road: 0.5, river: 0.65, coastal: 0.75, port: 0.9 };
  return {
    prosperity01: prosperityRank01(prosperity),
    connectivity01: ROUTE_CONNECTIVITY[route] ?? 0.5,
    war01: clamp01(0.5 + 0.5 * stresses.filter(s => WAR.has(s)).length),
    corruption01: clamp01(0.5 + 0.5 * stresses.filter(s => CORRUPT.has(s)).length),
  };
}

/* Prosperity is read through `prosperityRank01` — THE canonical ladder — rather than a
 * private band map: §759.3 measured four private ladders scoring the same Comfortable
 * settlement 0.6, 0.5 and 0.65, and this module's first draft was the fifth. The leaf is
 * TOTAL: a label in any of its shapes resolves on the one ladder, and everything else —
 * including a bare NUMBER, whose unit no producer declares (§711.6) — degrades to
 * NEUTRAL 0.5, this module's own "unremarkable, tilts nothing" doctrine. The magnitude
 * sniff (`> 1 ? /100`) the first draft carried is exactly the undeclared-unit guess the
 * factionPowerShare inventory exists to refuse. */

/** @param {Record<string, unknown>} config @param {unknown} stress @returns {string[]} */
function stressTypesOf(config, stress) {
  const out = [];
  const push = v => { if (typeof v === 'string' && v) out.push(v.toLowerCase()); };
  if (Array.isArray(config.stressTypes)) config.stressTypes.forEach(push);
  push(/** @type {string} */ (config.stressType));
  if (Array.isArray(stress)) {
    for (const s of stress) push(typeof s === 'string' ? s : /** @type {any} */ (s)?.type);
  }
  return [...new Set(out)];
}

/**
 * §810.3 R13 — the TYPED floor lift, and the only road to a rulerless birth.
 *
 * MEASURED (R-DENSITY-CENSUS §3): 9 of 360 settlements carry `succession_void`
 * today and every one of them still births a seated ruler — the stressor exists
 * as climate and narrative only, and nothing anywhere lifts the floor. This is
 * the wire that makes it mean something. Absence-by-accident is a bug class;
 * absence-by-stressor is a receipted state, and the gate is what converts one
 * into the other.
 *
 * @param {{random: () => number}} rng
 * @param {Record<string, unknown>} config
 * @param {unknown} stress
 * @returns {{lifted: boolean, stressor: string|null}}
 */
export function rollFloorLift(rng, config, stress) {
  const carried = stressTypesOf(config, stress)
    .filter(s => MISSING_SEAT_STRESSORS.includes(s));
  // ⛔ The draw is unconditional so the stream position does not depend on
  // whether the settlement happens to carry the stressor.
  const roll = rng.random();
  if (!carried.length) return { lifted: false, stressor: null };
  return roll < FLOOR_LIFT_CHANCE
    ? { lifted: true, stressor: carried[0] }
    : { lifted: false, stressor: null };
}

/** Build a plan for one seam. Every seam shares this so the adapters (powers,
 *  particulars, floor lift) can never drift between them.
 *  @param {any} input @param {{seatAll?: boolean, massOverride?: number|null}} [mode] */
function planFor(input, mode = {}) {
  const config = input.config || {};
  const lawRng = input.rng.fork('density-law');
  return rollDensityPlan({
    tier: tierKey(input.tier),
    rng: lawRng,
    powers: densityPowersFrom(input.powerStructure),
    particulars: densityParticularsFrom({
      config, stress: input.stress, economicState: input.economicState || {},
    }),
    floorLift: rollFloorLift(lawRng.fork('floor-lift'), config, input.stress),
    seatAll: mode.seatAll,
    massOverride: mode.massOverride ?? null,
  });
}

/**
 * SEAM 1 (population) — the named-NPC mass target for this tier, or `null`
 * under the dormant default (no draw, no allocation).
 *
 * @param {{
 *   tier?: string, config?: Record<string, unknown>, stress?: unknown,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 *   economicState?: Record<string, unknown>|null,
 *   rng: {random: () => number, fork: (l: string) => any},
 * }} input
 * @returns {number|null}
 */
export function rollNamedMass(input) {
  if (!rollsRegisterVii(input.config || {})) return null;
  return planFor(input).namedMass;
}

/**
 * SEAM 1b (assembly, after `reconcilePowerStructure`) — size the power roster to
 * the tier's faction band and mint each doubled niche's second claimant.
 *
 * Returns the input powerStructure BY REFERENCE under the dormant default.
 *
 * ⚠ `massOverride` IS DECLARED HERE BECAUSE IT IS ALREADY PASSED. The assembly
 * step hands it the roster the population step actually produced, so the seat
 * ceiling (R17: a house the mass cannot crew must not exist) is computed against
 * a FACT rather than a second mass roll — see `assembleSettlement.js`. The field
 * was live and undeclared, which reddened both this file and its caller on
 * `typecheck:ratchet`. Declaring it moves no runtime byte.
 *
 * @param {{
 *   tier?: string, config?: Record<string, unknown>, stress?: unknown,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 *   economicState?: Record<string, unknown>|null,
 *   massOverride?: number|null,
 *   rng: {random: () => number, fork: (l: string) => any},
 * }} input
 */
export function resizePoliticalRoster(input) {
  if (!rollsRegisterVii(input.config || {})) {
    return { powerStructure: input.powerStructure, plan: null };
  }
  const plan = planFor(input, { massOverride: input.massOverride ?? null });
  return {
    powerStructure: resizeSeats(
      input.powerStructure, plan, input.rng.fork('density-law').fork('niche-mint'),
    ),
    plan,
  };
}

/**
 * Trim the power roster to the seats the roll chose, and mint the second
 * claimant for each DOUBLED NICHE (§810 R4).
 *
 * ⛔ THE GOVERNING SEAT IS NEVER TRIMMED (§810.3 R14: "the density roll
 * dissolved the government" is not a story, it is a hole) — `chooseSeats` seats
 * it first, so it is structurally always in the kept set; the filter below
 * cannot reach it.
 *
 * The doubled niche's rival takes an unused name from `FACTION_DESCRIPTORS` in
 * the SAME category — the same authored vocabulary the DM's own faction
 * compendium offers for the same purpose — so no new naming machinery, and no
 * new vocabulary, enters the world.
 */
function resizeSeats(powerStructure, plan, rng) {
  const seats = powerStructure?.factions || [];
  const keep = new Set(plan.factions.map(f => f.key));
  const kept = seats.filter(seat => keep.has(seatKey(seat)));
  const taken = new Set(kept.map(s => seatKey(s).toLowerCase()));
  /** @type {Array<Record<string, unknown>>} */
  const minted = [];
  for (const key of plan.doubledNiches) {
    const host = kept.find(s => seatKey(s) === key);
    if (!host) continue;
    const pool = (FACTION_DESCRIPTORS[String(host.category || 'other')] || [])
      .filter(n => !taken.has(String(n).toLowerCase()));
    if (!pool.length) continue;
    const name = pool[Math.floor(rng.random() * pool.length)] || pool[0];
    taken.add(String(name).toLowerCase());
    minted.push({
      ...host,
      faction: name,
      name,
      isGoverning: false,
      // The contested niche is DECLARED on the record, so the contest layer can
      // find the pair without re-deriving it from names. §810 R4 reuses the
      // pantheon niche-contest pattern; this is the tie it reads.
      contestsNiche: key,
      // A second claimant on one niche splits the niche's standing rather than
      // inventing new power — the shares idiom, not a new power source. The share
      // itself is a signed value and lives in `densityBands.DOUBLED_NICHE_SHARE`.
      power: Math.max(1, Math.round(num(host.power, 1) * DOUBLED_NICHE_SHARE)),
    });
  }
  const factions = [...kept, ...minted];
  return { ...(powerStructure || {}), factions };
}

/**
 * SEAM 2 (coherence) — disperse the named roster across the factions that
 * exist, roll their rungs, and stamp every figure.
 *
 * Idempotent and regen-safe: the roster and the mass are FACTS here (the roll
 * runs in re-derivation mode), so running it twice on the same settlement with
 * the same seed produces the same world.
 *
 * ⛔ IT REFUSES RATHER THAN BREAKING R17. If the roster cannot crew every
 * faction (fewer named figures than factions) the atomic mint is unsatisfiable,
 * and an NPC-less faction is exactly the state the law declares
 * unrepresentable. It returns the npcs UNCHANGED with a typed reason instead of
 * quietly minting an empty house; the end-to-end fixture asserts the refusal
 * never fires on the real corpus, so a refusal is a finding, not a fallback.
 *
 * @param {{
 *   tier?: string, config?: Record<string, unknown>, stress?: unknown,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 *   economicState?: Record<string, unknown>|null,
 *   npcs?: Array<Record<string, unknown>>,
 *   rng: {random: () => number, fork: (l: string) => any},
 * }} input
 * @returns {{npcs: Array<Record<string, unknown>>, plan: object|null, refused: string|null}}
 */
export function disperseNamedRoster(input) {
  const config = input.config || {};
  const npcs = input.npcs || [];
  if (!rollsRegisterVii(config)) return { npcs, plan: null, refused: null };

  const tier = tierKey(input.tier);
  const powers = densityPowersFrom(input.powerStructure);
  if (!powers.length) return { npcs, plan: null, refused: 'no_power_seats' };
  if (npcs.length < powers.length) return { npcs, plan: null, refused: 'mass_below_faction_count' };

  const plan = planFor(
    { ...input, tier, config },
    { seatAll: true, massOverride: npcs.length },
  );
  return { npcs: assignRoster(npcs, plan), plan, refused: null };
}

/**
 * Seat the settlement's named figures into the plan's slots.
 *
 * ⭐ THE LAW MOVES COUNTS, NOT MEANINGS. This runs immediately after
 * `mergeNPCLists`, whose Pass 1 already role-keyword-locks a Mayor into the
 * government seat, a High Priest into the temple, a Kingpin into the criminal
 * house. That answer is GOOD and it is not the density law's to overturn: R10
 * governs HOW MANY figures each house holds, not which house a priest belongs
 * in. So the seating is home-first — every figure keeps the affiliation the
 * merge gave it wherever the rolled counts allow — and only the surplus is
 * redistributed.
 *
 * ⚠ WITHOUT THIS, THE LAW READS AS A BUG. The first end-to-end run seated by
 * influence alone and produced "Merchant Guilds ⇒ the Mayor", "Military/Guard ⇒
 * the Village Priest" and a Crime Lord inside the Ducal Governorship. Every
 * count was in band and every census would have passed — the §710.6 lesson,
 * that a census asking whether a mark exists has not asked whether it is on the
 * thing it means.
 *
 * ⭐ SENIORITY IS THE ROSTER ORDER, and that is a real signal, not a shortcut.
 * `generateNPCs` emits `TIER_MANDATORY_ROLES[tier]` FIRST, in the order that
 * table declares — Elder, then the second thorp role; Mayor, Guard Captain,
 * High Priest, Wealthiest Merchant at a city — then the guild figure, then the
 * weighted-random fills. That ordering IS the settlement's declared seniority,
 * it already exists, and the density law does not get to second-guess it.
 *
 * ⚠ AN EARLIER DRAFT RANKED BY `influence` AND IT DEMOTED THE SETTLEMENT'S OWN
 * LEADER. Measured on `dens-e2e-hamlet-005`: the hamlet's Priest (then spelled
 * 'Parish Priest', renamed for the setting-agnostic law) carries a higher
 * influence band than the Elder, so the priest took the Feudal Stewardship's
 * only seat and the ELDER — the settlement's head — was pushed into the
 * Merchant Guilds. Under v1 that seed put the Elder in the government house.
 * Every count was in band; only a v1-vs-v2 comparison caught it.
 *
 * ⚠ `importance` is OVERWRITTEN, not defaulted, and that is the point. The
 * measured world classifies 90.5% of its figures through `inferImportance`'s
 * role regex, which reads a Mayor as `minor`; the rung stamp is what ends that.
 */
function assignRoster(npcs, plan) {
  const RUNG_ORDER = { head: 0, yearner: 0, middle: 1, lowest: 2 };

  /** Houses in a byte-stable order, strongest first — the strongest house fills
   *  its seats first when two want the same figure. */
  const houses = [...plan.factions].sort(
    (a, b) => (b.power - a.power)
      || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0),
  );
  /** Members of each house, seniority first. */
  const slotsOf = new Map(houses.map(f => [
    f.key,
    [...f.members].sort((a, b) => (RUNG_ORDER[a.rung] ?? 2) - (RUNG_ORDER[b.rung] ?? 2)),
  ]));

  // Roster order IS seniority (see the docblock): mandatory leadership roles
  // first, in the tier's declared order, then the fills. Byte-stable by
  // construction and free of any second ranking signal to drift out of sync.
  const bySeniority = npcs.map((npc, index) => ({
    npc, index, home: String(npc.factionAffiliation || ''), taken: false,
  }));

  /** @type {Map<number, {factionKey: string, member: any}>} */
  const assignment = new Map();
  /** Per-house cursor into its seniority-ordered slot list, so a slot is never
   *  handed out twice across the two passes. */
  const cursor = new Map(houses.map(f => [f.key, 0]));

  const fillHouse = (house, candidates) => {
    const slots = slotsOf.get(house.key);
    let i = cursor.get(house.key);
    for (const c of candidates) {
      if (i >= slots.length) break;
      if (c.taken) continue;
      c.taken = true;
      assignment.set(c.index, { factionKey: house.key, member: slots[i] });
      i += 1;
    }
    cursor.set(house.key, i);
  };

  // Pass 1 — HOME FIRST. Each house's slots go to the figures the merge already
  // placed there, most senior into the most senior slot.
  for (const house of houses) {
    fillHouse(house, bySeniority.filter(c => c.home === house.key));
  }
  // Pass 2 — the surplus. A house the merge under-crewed takes from whoever is
  // left, still seniority-ordered so senior slots get senior figures.
  for (const house of houses) fillHouse(house, bySeniority);

  return npcs.map((npc, index) => {
    const seat = assignment.get(index);
    if (!seat) return npc;
    return {
      ...npc,
      factionAffiliation: seat.factionKey,
      importance: seat.member.importance,
      [RUNG_ROLE_FIELD]: seat.member.isYearner ? 'yearner' : seat.member.rung,
    };
  });
}

/** The tier's mass band, exposed for callers that want to explain a target.
 *  @param {string|null|undefined} tier */
export function massBandForTier(tier) {
  return bandsForTier(tier).mass;
}
