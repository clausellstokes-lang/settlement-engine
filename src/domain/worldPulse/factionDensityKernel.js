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
 *   1. §840 chartered a HARD CEILING — at this car's commit `subsystemRowsVirtual.js`
 *      sat at exactly 800/800 and NO further virtual flag could land estate-wide
 *      until TE-VIRT-1's decomposition car did; "any density successor" is named in
 *      that ruling. ⭐ THAT CEILING IS DISCHARGED (TE-VIRT-1 landed the
 *      decomposition at the ENGINE-HYGIENE landing; the file measures 282/800), so
 *      the estate-wide block is HISTORY and this clause is a record of why the car
 *      chose as it did — NOT a live blocker for any reader. Ground 2 below was
 *      always the load-bearing half and is untouched by the discharge.
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
import { readFactionLifecycle, factionRosterOf } from '../density/factionLifecycle.js';
import { planDensityCadence } from '../density/densityCadence.js';
import { importanceForRung } from '../density/densityRungs.js';
import { seatKey } from '../density/seatKey.js';
import { createNpc } from '../entities/npcs.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { slugify } from '../../kernel/slugify.js';
import { advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize } from './assizeKernel.js';

/** The mark an emptied ruling house carries while its succession is unresolved.
 *  It is BOTH the once-per-state-change latch for the beat AND the named seam a
 *  future §810.5 stressor mint reads — one field, not two. */
export const INTERREGNUM_MARK = 'interregnumSinceTick';

/**
 * The id a house takes, in the ONE spelling the estate already mints faction ids in.
 *
 * ⚠⚠ THIS IS AN IDENTITY-BEARING JOIN AND THE FIRST DRAFT BROKE IT. `kernel/slugify.js`
 * defaults to a DASH separator; the event layer's `mutateHelpers.slugify` — the spelling
 * `ADD_FACTION` mints with and `linkedFactionIds` joins on — passes `{ sep: '_' }`, as
 * does `densityAscension.js`. A cadence-minted house therefore carried
 * `faction.the-weavers` while the same house minted by DM verb carried
 * `faction.the_weavers`: one polity, two ids, no join, and nothing would have thrown.
 * That is exactly the aliasing class `slugify.js`'s own header warns about, and it was
 * caught by the estate's slug-idiom ratchet reding on a SIBLING file, not by review.
 *
 * @param {string} house @returns {string}
 */
function factionIdFor(house) {
  return `faction.${slugify(house, { sep: '_' })}`;
}

/** The cadence clock, kept INSIDE `powerStructure` rather than as a new top-level
 *  settlement key: the fabric's own pace belongs beside the fabric, and a nested
 *  field costs no schema, no field-manifest row and no undo-list amendment. */
export const CADENCE_CLOCK = 'densityStepTick';

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
      + `named figure to sit in it. The house does not fall, for a settlement cannot be `
      + `left with nobody running anything, so the seat stands empty and open, and `
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

// ── R8's CANDIDATE POOL — DERIVED, NOT INVENTED ───────────────────────────────────
//
// `densityCadence.js` takes the pool as INPUT and says why in its own header: R8 ranks
// "a power strong in the influence ranking / legitimacy / economics but unrepresented",
// and the settlement shape carries only the SEATED powers. D2b named that seam rather
// than burying a design decision in a helper. This is the decision, made in the open.
//
// ⭐ THE UNREPRESENTED POWERS ARE THE SETTLEMENT'S OWN INSTITUTIONS. A town with a
// temple and no faith house has a centre of power that is VISIBLE IN THE WORLD and
// carries no seat — that is R8's sentence, not an analogy. Nothing is conjured from a
// catalog of things the settlement does not have.
//
// ⭐⭐ AND IT CLOSES THE LOOP R7 OPENS. A tier promotion seats the new tier's REQUIRED
// institutions (`tierOutcomeApply.js`), so the promotion literally creates the
// unrepresented powers the fabric then thickens toward. The thickening has a cause in
// the world rather than a quota to fill.
//
// ⭐⭐ THE INFLUENCE RANKING R8 NAMES ALREADY EXISTS, AND IT IS NOT A COUNT.
// `economicState.compound` is the generator's own per-CATEGORY effective standing —
// economyOutput, militaryEffective, religionInfluence, magicInfluence, criminalEffective,
// each 0..100 and each already weighing the settlement's institutions, safety, trade and
// tier. Reading THAT is reading the ranking R8 points at; counting institution rows by
// hand would have been a second, weaker spelling of it sitting beside the real one.
//
// ⚠ AND THE FIRST DRAFT DID EXACTLY THAT, AND WAS CONVICTED BY THE ESTATE'S OWN
// READER-WITH-NO-WRITER WALKER. It scored the pool from an institution tally and an
// `economicState.prosperity01` that NO GENERATOR EVER WRITES — a guarded read that
// cannot throw, degrades to a default, and leaves the arm behind it dead on every
// generated world. The walker named it before a line of it shipped. The cure is not a
// different default; it is reading the key the producer actually writes.
//
// The three R8 terms are weighted equally by `representationGapOf` and each is applied
// WHERE IT MEANS SOMETHING, degrading to that module's own 0.5 "unremarkable" default
// elsewhere — the convention it documents, so a partial context tilts nothing rather
// than tilting wrongly. Influence is the category's own standing and always applies;
// legitimacy applies to the powers that answer for the settlement's public standing;
// economics to the powers that live off its trade.

/** Faction-category ← the `compound` field carrying that category's standing. There is
 *  deliberately no `noble` row: the governing power always holds a seat, so "an
 *  unrepresented noble power" is not a state this reading can produce.
 *  @type {Readonly<Record<string, string>>} */
const POWER_STANDING_FIELD = Object.freeze({
  economy: 'economyOutput',
  religious: 'religionInfluence',
  military: 'militaryEffective',
  arcane: 'magicInfluence',
  criminal: 'criminalEffective',
});

/** Faction-category ← institution-category. Both vocabularies are the tree's own; this
 *  is the join between them, written once. An institution category that is nobody's
 *  power base (Infrastructure, Entertainment) is deliberately absent.
 *  ⚠ The index signature is declared rather than inferred: these are string→string
 *  LOOKUPS whose miss is a real answer ("this category is nobody's power base"), and the
 *  `if (!name)` guard on every read is what makes the widening honest.
 *  @type {Readonly<Record<string, string>>} */
const POWER_CATEGORY_OF_INSTITUTION = Object.freeze({
  economy: 'economy',
  crafts: 'economy',
  religious: 'religious',
  defense: 'military',
  magic: 'arcane',
  criminal: 'criminal',
});

/** The display name an unrepresented power of each category takes when it seats. Fixed
 *  spellings, because a house's NAME is world-facing and must never be a slug.
 *  @type {Readonly<Record<string, string>>} */
const POWER_NAME_OF_CATEGORY = Object.freeze({
  economy: 'Rising Merchants',
  religious: 'Devout Assembly',
  military: 'Sworn Companies',
  arcane: 'Arcane Circle',
  criminal: 'Shadow Interests',
});

/** Terms whose meaning is category-scoped. Anything not listed reads 0.5. */
const LEGITIMACY_CATEGORIES = new Set(['religious']);
const ECONOMICS_CATEGORIES = new Set(['economy', 'criminal']);

/**
 * R8's pool for one settlement: every power the world already contains that holds no seat.
 *
 * A category qualifies only when the settlement carries at least one LIVE institution of
 * it — a merchant house cannot rise where there is no market — and it is then RANKED by
 * the settlement's own compound standing for that category.
 *
 * PURE and TOTAL. A settlement with no institutions, or one whose every implied power is
 * already seated, yields an empty array, and `planDensityCadence` then declines with its
 * typed `no_candidate_power` rather than inventing a house to seat.
 *
 * @param {Record<string, unknown>} settlement
 * @returns {Array<{key: string, name: string, category: string,
 *                  influence01: number, legitimacy01: number, economics01: number}>}
 */
export function densityCandidatePowersFrom(settlement) {
  /** @type {Set<string>} */
  const present = new Set();
  for (const raw of liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))) {
    const category = POWER_CATEGORY_OF_INSTITUTION[String(asObject(raw).category || '').toLowerCase()];
    if (category) present.add(category);
  }
  if (!present.size) return [];

  const ps = asObject(settlement.powerStructure);
  const seats = Array.isArray(ps.factions) ? /** @type {Record<string, unknown>[]} */ (ps.factions) : [];
  const seatedCategories = new Set(seats.map(s => String(asObject(s).category || '').toLowerCase()));
  const seatedKeys = new Set(seats.map(s => seatKey(s)));

  const compound = asObject(asObject(settlement.economicState).compound);
  const legitimacy = num(ps.publicLegitimacy && asObject(ps.publicLegitimacy).score, 50) / 100;
  const economy = num(compound.economyOutput, 50) / 100;

  const out = [];
  for (const category of present) {
    if (seatedCategories.has(category)) continue;
    const name = POWER_NAME_OF_CATEGORY[category];
    if (!name || seatedKeys.has(name)) continue;
    out.push({
      key: name,
      name,
      category,
      influence01: num(compound[POWER_STANDING_FIELD[category]], 50) / 100,
      legitimacy01: LEGITIMACY_CATEGORIES.has(category) ? legitimacy : 0.5,
      economics01: ECONOMICS_CATEGORIES.has(category) ? economy : 0.5,
    });
  }
  // Sorted so the pool handed to the law is itself order-independent; the law's own
  // sort is total anyway, and a deterministic pool makes that easy to see.
  return out.sort((a, b) => compareCodepoint(a.key, b.key));
}

/**
 * Is the fabric allowed to take a step this interval?
 *
 * R7's cadence is "one receipted emergence per interval, never an instant sprout".
 * The planner already returns AT MOST ONE step per call, so the remaining half of the
 * ruling is the INTERVAL — and it is the metronome's own window, imported rather than
 * re-typed, because the claim a second constant would make is the same claim.
 *
 * A settlement with no clock has never taken a step and never crossed a band under
 * this law: it may act. A future-dated clock does not hold (the razing-latch discipline).
 *
 * @param {Record<string, unknown>} powerStructure @param {number} tick @returns {boolean}
 */
function cadenceReady(powerStructure, tick) {
  const last = powerStructure[CADENCE_CLOCK];
  if (last === undefined || last === null) return true;
  const at = Number(last);
  if (!Number.isFinite(at)) return true;
  const age = tick - at;
  return age < 0 || age >= DRIFT_REEMIT_COOLDOWN_TICKS;
}

/**
 * The founding member an emerging house mints WITH (§810.4 R17: "a faction and its
 * first named NPC are ONE generation act").
 *
 * ⚠ THE SHAPE IS THE EVENT LAYER'S, DELIBERATELY AND IN EVERY DETAIL — the same
 * `createNpc` call, the same head-rung importance from the one rung mapping, the same
 * `factionAffiliation` re-write after construction (which reads as redundant and is
 * not: `createNpc` builds from a DECLARED field set and drops undeclared keys). A house
 * that arrives by cadence is byte-shaped like one that arrives by DM verb, and no
 * second importance policy comes into existence.
 *
 * ⚠ NO DRAW. `_idSeed` is a pure function of (settlement, tick, house), so the same
 * world mints the same founder — determinism without a stream.
 *
 * ⬜ R8's "new named members roll their characters through the W-LIVES generation path"
 * is NOT this. W-LIVES has not landed; when it does, THIS is the seam it replaces, and
 * until then the estate's own shipped answer to "a house mints with a member" is used
 * rather than a lesser private one.
 *
 * @param {{sid: string, tier: string|null|undefined, house: string, tick: number}} a
 * @returns {Record<string, unknown>}
 */
function foundingMemberForEmergence({ sid, tier, house, tick }) {
  const npc = createNpc({
    name: `The ${house} Founder`,
    role: 'Head',
    importance: /** @type {import('../entities/npcs.js').NpcImportance} */ (
      importanceForRung('head', tier)
    ),
    factionAffiliation: house,
    linkedFactionIds: [factionIdFor(house)],
    _idSeed: `density-emergence:${sid}:${tick}:${slugify(house, { sep: '_' })}`,
  });
  npc.factionAffiliation = house;
  return npc;
}

/**
 * The in-world receipt for a house that has risen among a settlement's powers.
 * R7's own example sets the register: "a weavers' house rises among the town's powers".
 *
 * @param {{sid: string, townName: string, houseName: string, tick: number, now: string|null}} a
 * @returns {Record<string, unknown>}
 */
function emergenceBeat({ sid, townName, houseName, tick, now }) {
  return {
    id: `wizard_news.${tick}.faction_seat_formed.${stablePart(sid)}.${stablePart(houseName)}`,
    createdAt: now,
    tick,
    scope: 'local',
    significance: 'notable',
    severity: 0.4,
    score: 50,
    headline: `${townName}: the ${houseName} rise among the powers`,
    summary: `${townName} has grown past the politics it had. A standing interest that `
      + `nobody spoke for has found a voice and a name, the ${houseName}, and takes a `
      + `place among the houses that answer for this town.`,
    kind: 'applied',
    impactKind: 'faction_seat_formed',
    channelType: 'political_authority',
    settlementIds: [sid],
    impactIds: [],
    channelIds: [],
    sourceEventId: `faction_seat_formed.${sid}.${stablePart(houseName)}.${tick}`,
    tags: ['world_pulse', 'faction_density', 'emergence'],
    reasons: ['the settlement carries a standing interest that holds no seat'],
  };
}

/**
 * The in-world receipt for a house that has folded into another.
 * R9's own example sets the register: "the guild hall stands empty".
 *
 * @param {{sid: string, townName: string, houseName: string, intoName: string,
 *          moved: number, tick: number, now: string|null}} a
 * @returns {Record<string, unknown>}
 */
function foldBeat({ sid, townName, houseName, intoName, moved, tick, now }) {
  const people = moved > 0
    ? `Its named figures do not vanish; they take their places under the ${intoName}, `
      + `which is what a fold is and what a killing is not. `
    : '';
  return {
    id: `wizard_news.${tick}.faction_seat_folded.${stablePart(sid)}.${stablePart(houseName)}`,
    createdAt: now,
    tick,
    scope: 'local',
    significance: 'notable',
    severity: 0.45,
    score: 52,
    headline: `${townName}: the ${houseName} fold into the ${intoName}`,
    summary: `${townName} no longer carries the politics it once did, and the weakest `
      + `standing among its houses is the one that goes. The ${houseName} keep their hall `
      + `no longer. ${people}The seat that ran this town is untouched: a shrinking place `
      + `may lose a house, but never its government.`,
    kind: 'applied',
    impactKind: 'faction_seat_folded',
    channelType: 'political_authority',
    settlementIds: [sid],
    impactIds: [],
    channelIds: [],
    sourceEventId: `faction_seat_folded.${sid}.${stablePart(houseName)}.${tick}`,
    tags: ['world_pulse', 'faction_density', 'fold'],
    reasons: ['the settlement fell below the fabric its tier supports'],
  };
}

/**
 * Apply at most ONE cadence step (§810.1 R7/R8/R9 with §810.3 R14) to one settlement.
 *
 * ⭐⭐ THE FOLD MOVES NOBODY OUT OF THE WORLD. R9's own words are "folds, MERGES, or
 * goes to exile", and merging is the only one of the three an engine may do on its own:
 * §827's STATE-NEVER-FATE binds this lane, and the engine kills no named character.
 * The folded house's figures are re-affiliated onto the strongest remaining house, which
 * ALSO keeps §817-Q8's always-affiliated invariant true — a fold that orphaned its
 * roster would break that invariant AND hand R18 an empty house to dissolve next tick.
 *
 * @param {Record<string, unknown>} fresh
 * @param {{sid: string, tick: number, now: string|null}} ctx
 * @returns {{settlement: Record<string, unknown>|null, beats: Record<string, unknown>[]}}
 */
function applyCadence(fresh, ctx) {
  const ps = asObject(fresh.powerStructure);
  const seats = Array.isArray(ps.factions) ? /** @type {Record<string, unknown>[]} */ (ps.factions) : null;
  if (!seats || !cadenceReady(ps, ctx.tick)) return { settlement: null, beats: [] };

  const tier = String(fresh.tier || asObject(fresh.config).tier || '') || null;
  const step = planDensityCadence({
    tier: tier || undefined,
    config: asObject(fresh.config),
    powerStructure: { factions: seats },
    candidatePowers: densityCandidatePowersFrom(fresh),
  });
  if (step.step === 'at_band' || step.reason) return { settlement: null, beats: [] };

  const townName = typeof fresh.name === 'string' && fresh.name ? String(fresh.name) : ctx.sid;
  const npcs = Array.isArray(fresh.npcs) ? /** @type {Record<string, unknown>[]} */ (fresh.npcs) : [];

  if (step.step === 'thicken' && step.emergence) {
    const house = String(step.emergence.name || step.emergence.key);
    const founder = foundingMemberForEmergence({ sid: ctx.sid, tier, house, tick: ctx.tick });
    return {
      settlement: {
        ...fresh,
        npcs: [...npcs, founder],
        powerStructure: {
          ...ps,
          [CADENCE_CLOCK]: ctx.tick,
          factions: [...seats, {
            id: factionIdFor(house),
            name: house,
            faction: house,
            status: 'active',
            category: String(step.emergence.category || 'other'),
            power: 1,
            impairments: [],
            internalSeats: {},
            description: '',
            memberNpcIds: [founder.id],
            // Provenance the chronicle can read without re-deriving it.
            materializedBy: 'density_cadence',
            materializedAtTick: ctx.tick,
          }],
        },
      },
      beats: [emergenceBeat({ sid: ctx.sid, townName, houseName: house, tick: ctx.tick, now: ctx.now })],
    };
  }

  if (step.step === 'thin' && step.thinning) {
    const folding = String(step.thinning.key);
    const remaining = seats.filter(s => seatKey(s) !== folding);
    if (!remaining.length) return { settlement: null, beats: [] };
    // The strongest remaining house takes them in. Ties break on the key, so the
    // absorbing house is the same on every device from the same world.
    const into = [...remaining].sort(
      (a, b) => (num(b.power, 0) - num(a.power, 0)) || compareCodepoint(seatKey(a), seatKey(b)),
    )[0];
    const intoName = seatKey(into);
    let moved = 0;
    const nextNpcs = npcs.map((raw) => {
      const npc = asObject(raw);
      if (String(npc.factionAffiliation || '') !== folding) return raw;
      moved += 1;
      return { ...npc, factionAffiliation: intoName };
    });
    return {
      settlement: {
        ...fresh,
        ...(moved ? { npcs: nextNpcs } : {}),
        powerStructure: { ...ps, [CADENCE_CLOCK]: ctx.tick, factions: remaining },
      },
      beats: [foldBeat({
        sid: ctx.sid, townName, houseName: folding, intoName, moved, tick: ctx.tick, now: ctx.now,
      })],
    };
  }
  return { settlement: null, beats: [] };
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
    // ⭐ THE LAW READS THE RAW ROSTER, NEVER THE PARTICIPATION VIEW (EM-B1k2; §810.4 R18).
    // `item.settlement` is the OFF-STAGE-filtered projection (worldSnapshot.js:124-133), and
    // an IRREVERSIBLE consequence may only be triggered by IRREVERSIBLE causes — so a house
    // whose one member is merely SHELVED must never even have its dissolution PROPOSED.
    // `asObject(item.save).settlement` is saveSettlement()'s exact meaning
    // (worldSnapshot.js:11-13), inlined rather than imported; the two are the SAME OBJECT
    // whenever nobody is off-stage, which is why the swap is behaviour-neutral everywhere
    // else. The `||` fallback is the snapshot's own tolerance: every save shape that carries a
    // falsy `.settlement` carries no roster either, so raw and filtered cannot diverge on it.
    // EM-B1k made the WRITE base raw at pulseKernel.js `settlement: localSettlements.get(String(item.id)) || item.save?.settlement`; this is the READ.
    // ⚠ WHY `asObject(item.save)` AND NOT `item.save?.` — the shape EM-B1k's sister line uses.
    // `buildSettlementMap` takes untyped parameters, so its `item` is implicitly `any` and an
    // optional chain type-checks there. Here `itemById` is declared
    // `Map<string, Record<string, unknown>>`, so `item.save` is `unknown` and `item.save?.
    // settlement` reds BOTH typecheck ratchets (TS2339, +1 against a baseline of 0). `asObject`
    // is this module's own narrowing helper, already imported and already applied to the very
    // next term, and it agrees with the optional chain on EVERY input: a missing, null,
    // primitive or array `save` all yield `{}` and fall through to `item.settlement`.
    // ⛔ Every REVERSIBLE reading in this file keeps the participation view (applyCadence's
    // arrival append, the marks) — the roads chokepoint is not reopened.
    const tickStart = item && item.settlement ? asObject(asObject(item.save).settlement || item.settlement) : null;
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

    // A settlement with no update entry cannot be written this tick — the fold only
    // carries entries that exist. Saying so by SKIPPING (rather than minting an entry
    // this seam does not own) keeps the one-writer law intact.
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    const fresh = asObject(nextUpdates[ui]).settlement
      ? asObject(asObject(nextUpdates[ui]).settlement)
      : tickStart;

    const ctx = { sid, tick, now: nowIso };
    // ⭐ LIFECYCLE FIRST, CADENCE SECOND, AND THE ORDER IS LOAD-BEARING. R18 removes
    // houses that have ceased to exist; the cadence then counts the seats that are
    // actually there. Reversed, a settlement would thicken toward a band it already
    // met on paper with a dissolved house still in the count.
    const lifecycle = applyReactions(
      fresh,
      /** @type {Record<string, unknown>[]} */ (reading.reactions),
      ctx,
    );
    const afterLifecycle = lifecycle.settlement || fresh;
    const cadence = applyCadence(afterLifecycle, ctx);
    const nextSettlement = cadence.settlement || lifecycle.settlement;
    if (!nextSettlement) continue;

    if (!cloned) { nextUpdates = updates.slice(); cloned = true; }
    nextUpdates[ui] = { ...asObject(nextUpdates[ui]), settlement: nextSettlement };
    for (const beat of lifecycle.beats) newsEntries.push(beat);
    for (const beat of cadence.beats) newsEntries.push(beat);
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
