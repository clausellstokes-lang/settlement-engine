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
import { FACTION_DESCRIPTORS, FACTION_NAME_SIBLINGS } from '../../data/powerData.js'; import { noteDeclared } from '../../domain/facts/drawDeclared.js'; // CENSUS-1f: one line
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
import { renormalizeFactionPower } from '../power/rulingStructure.js';
import { settleHouselessPowers } from '../power/rulerKin.js';
import { stressPowerRowOf } from '../../domain/people/stressPowerFaces.js';

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
    // X-46 car 4: the settlement's population, read by the sizing stage's population tilt.
    // Not a draw — every seam passes it, so the three plans agree on the same tilt.
    population: Number.isFinite(Number(input.population)) && input.population != null
      ? Number(input.population)
      : null,
    seatAll: mode.seatAll,
    massOverride: mode.massOverride ?? null,
    // COHERENCE-POWERS-3 (the chair's rulings (1), (2)): the powers a crisis seats (data/stressPowerFaces.js's `seated`)
    crisisSeatKeys: (input.powerStructure?.factions || [])
      .filter((seat) => stressPowerRowOf({ stress: input.stress }, seat)?.seated === true).map(seatKey),
  });
}

/**
 * SEAM 1 (population) — the named-NPC mass target for this tier, or `null`
 * under the dormant default (no draw, no allocation).
 *
 * @param {{
 *   tier?: string, config?: Record<string, unknown>, stress?: unknown,
 *   population?: number|null,
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
 *   population?: number|null,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 *   economicState?: Record<string, unknown>|null,
 *   massOverride?: number|null,
 *   institutions?: unknown,
 *   rng: {random: () => number, fork: (l: string) => any},
 * }} input
 */
export function resizePoliticalRoster(input) {
  if (!rollsRegisterVii(input.config || {})) {
    return { powerStructure: input.powerStructure, plan: null };
  }
  const plan = planFor(input, { massOverride: input.massOverride ?? null });
  return {
    powerStructure: foldKin(resizeSeats(
      input.powerStructure, plan, input.rng.fork('density-law').fork('niche-mint'),
    ), input.institutions),
    plan,
  };
}

/**
 * COHERENCE-POWERS 2B, THE FOLD (A-plus) and THE POWER WITH NO ONE ON THE PAGE, at the roster's last build: a
 * power that no face-bearing house stands behind after the doubled-niche deal is not a power. The ruler's own
 * kind folds its figure into the ruler; any other kinded power is not built (power/rulerKin.js ::
 * settleHouselessPowers), and a relationship naming either goes with it (pruneToRoster). The
 * houses here are final, the faction boost's included. No draw. A roster with nothing to fold is returned by
 * reference; otherwise its seats are copied, so no seat object another holder shares is written.
 * @param {{factions?: Array<Record<string, unknown>>, factionRelationships?: unknown}|null|undefined} powerStructure
 * @param {unknown} institutions the settlement's final roster of houses
 */
function foldKin(powerStructure, institutions) {
  if (!powerStructure || !Array.isArray(powerStructure.factions) || !Array.isArray(institutions)) return powerStructure;
  const factions = powerStructure.factions.map(seat => ({ ...seat }));
  const { folded, dropped } = settleHouselessPowers(factions, institutions);
  if (!folded.length && !dropped.length) return powerStructure;
  const settled = { ...powerStructure, factions };
  return pruneToRoster(settled, new Set([...folded, ...dropped]));
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
    noteDeclared(name, FACTION_NAME_SIBLINGS, { poolId: `powerData:FACTION_DESCRIPTORS.${String(host.category || 'other')}`, surface: 'power', drawKind: 'R' }); // CENSUS-1f: declared, carried, never pre-filtered (the self-check judges it)
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
  // The trim drops the unseated powers' shares and the mint adds each rival's, so this
  // roster does NOT total 100; `conservePower` restores it after the dispersal (below).
  const factions = [...kept, ...minted];
  const keptNames = new Set(factions.flatMap(seatNamesOf));
  const removed = new Set(seats.filter(seat => !keep.has(seatKey(seat)))
    .flatMap(seatNamesOf).filter(name => !keptNames.has(name)));
  return pruneToRoster({ ...(powerStructure || {}), factions }, removed);
}

/** Every name a seat is joined on: its key, its `faction`, its `name`.
 *  @param {Record<string, unknown>} seat @returns {string[]} */
function seatNamesOf(seat) {
  return [seatKey(seat), seat?.faction, seat?.name]
    .filter((/** @type {unknown} */ n) => typeof n === 'string' && n !== '')
    .map(String);
}

/**
 * ⛔ A RELATIONSHIP DOES NOT OUTLIVE A TRIM (lane RUNG1B-F4 unit 2, 2026-11-04;
 * docs/F4_CRIME_SIGNAL_2026-11-04.md §1, cause i). `power/rulingStructure.js` writes
 * `factionRelationships` for the whole pre-trim roster, and the resize above used to return
 * every row with the trimmed roster: 782 of 1,000 soak places kept a row (its narrative and its
 * dmNote) for a faction the law had removed, 69 for a removed criminal faction (soak1k-4:
 * "Ask: which specific officials have arrangements with Thieves' Guild?" with no guild). The
 * rows naming a REMOVED seat go with it here, at the trim, in one place. A row naming any other
 * faction — a DM's own off the roster included — is kept; nothing draws; a structure with
 * nothing removed (or no row naming it) is returned by reference.
 *
 * @template {{factionRelationships?: unknown}} T
 * @param {T} powerStructure the resized structure
 * @param {Set<string>} removed the names of the seats the trim removed
 * @returns {T}
 */
export function pruneToRoster(powerStructure, removed) {
  const rows = powerStructure?.factionRelationships;
  if (!removed.size || !Array.isArray(rows)) return powerStructure;
  const kept = rows.filter(row => !(Array.isArray(row?.pair)
    && row.pair.some((/** @type {unknown} */ name) => removed.has(String(name)))));
  return kept.length === rows.length ? powerStructure : { ...powerStructure, factionRelationships: kept };
}

/**
 * ⛔ THE ROSTER'S POWER IS CONSERVED AT 100 — AFTER THE DISPERSAL (rung 1 N1, 2026-11-04).
 *
 * `resizeSeats` trims the unseated powers' shares and mints each doubled niche's rival on
 * top, so the v2 roster reached the receipt totalling 20..102 and `conservationFindings`
 * ("Faction power is not conserved at 100%") failed 940 of 1,000 v2 settlements. The house
 * largest-remainder renormaliser (`power/rulingStructure.js :: renormalizeFactionPower`)
 * rescales to integer points totalling exactly 100: proportional, so no strict order
 * inverts, and no seat is added, dropped or moved.
 *
 * ⚠ WHY HERE AND NOT IN `resizeSeats`, MEASURED: renormalising at the resize hands the
 * dispersal rounded weights, and on soak seeds 0..119 that moved affiliations and rungs in
 * 13 of 120 births (`soak1k-23`'s Revolt Leadership changed head). After the dispersal the
 * plan reads exactly the powers it read before this cure, so the rungs and seats do not move.
 *
 * Written onto the roster the seam was handed, because the seam's caller keeps only the
 * npcs — as a NEW array of copied seats, so no seat object another holder shares is
 * written. An already-conserved roster (any world born after this cure) is left untouched.
 * @param {{factions?: Array<Record<string, unknown>>}|null|undefined} powerStructure
 */
/**
 * EVERY PATH CONSERVES (rung 1 N1 follow-up, the chair's ruling of 2026-11-04). Under a HELD
 * roster `generateCoherence` skips `enrichNpcCoherence` (EM-R2), so the dispersal — and the
 * `conservePower` inside it — never runs, and a v2 world regenerated with held NPCs reached
 * the receipt with its resized roster off 100 (12 of 12 held regenerations of soak seeds).
 * Assembly calls this once the coherence tail has finished with the roster, whichever path
 * that tail took. Returns the input BY REFERENCE for a v1 world and for a roster already at
 * 100; otherwise a new powerStructure whose seats are copies, renormalised. No draw.
 *
 * @param {{config?: Record<string, unknown>,
 *          powerStructure?: {factions?: Array<Record<string, unknown>>}|null}} input
 */
export function conserveSeatPower(input) {
  const powerStructure = input.powerStructure;
  if (!rollsRegisterVii(input.config || {}) || !powerStructure) return powerStructure;
  const copy = { ...powerStructure };
  conservePower(copy);
  return copy.factions === powerStructure.factions ? powerStructure : copy;
}

function conservePower(powerStructure) {
  const factions = powerStructure?.factions;
  if (!Array.isArray(factions) || !factions.length) return;
  const sum = factions.reduce((acc, seat) => acc + num(seat.power, 0), 0);
  if (sum === 100 && factions.every(seat => Number.isInteger(seat.power))) return;
  powerStructure.factions = renormalizeFactionPower(factions.map(seat => ({ ...seat })));
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
 *   population?: number|null,
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
  if (npcs.length < powers.length) {
    conservePower(input.powerStructure);
    return { npcs, plan: null, refused: 'mass_below_faction_count' };
  }

  const plan = planFor(
    { ...input, tier, config },
    { seatAll: true, massOverride: npcs.length },
  );
  const seated = assignRoster(npcs, plan);
  conservePower(input.powerStructure);
  return { npcs: seated, plan, refused: null };
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
