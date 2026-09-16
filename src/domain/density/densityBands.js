/**
 * densityBands.js — THE TUNING SURFACE for the tier-gated political-density law
 * (ODQ §§810–810.4, Register VII). ONE HOME for every number the law rolls
 * within, so the owner's tuning signature lands in a single file (car D4).
 *
 * ⛔ EVERY VALUE IN THIS FILE IS A DRAFT. The chair's candidate ladder is
 * recorded here as the machinery's DEFAULT so the roll is runnable and
 * testable end to end; the numbers are signed LAST (the tuning-is-last law,
 * ODQ §810 R5: "the machinery is chartered NOW …, the numbers are signed
 * LAST"). Nothing outside this file may hard-code a band, a ceiling or a
 * weight — `densityRoll.js` and `densityRungs.js` are deliberately
 * band-AGNOSTIC and read every quantity from here, so retuning is an edit to
 * this file alone and never a code change.
 *
 * ⭐⭐ AND THE SIGNING ITSELF IS ONE FILE'S DIFF (car D4). `REGISTER_VII_SIGNATURE`
 * below is the whole ritual: the owner edits the numbers here and flips the two
 * words here, and `densityLaw.NEW_SETTLEMENT_DENSITY_LAW_VERSION` — the dial that
 * decides which law a NEW world is born under — reads that pair and nothing else.
 * Before D4 the values lived here and the dial lived in `densityLaw.js`, so the
 * signature was a two-file act; the three tunables that were still camped beside
 * their consumers (`FLOOR_LIFT_CHANCE`, `DOUBLED_NICHE_SHARE`, `VACANCY_WEIGHTS.cap`)
 * came home in the same car.
 *
 * THE BAND'S EDGES ARE BELIEVABILITY ASSERTIONS (§810.2b): a range endpoint is
 * not a performance bound, it is a claim about what a settlement of that size
 * can plausibly be. A thorp can never roll seven named figures; a metropolis
 * never rolls two. The roll explores the envelope and structurally cannot leave
 * it — `tests/generators/densityDistributionShape.test.js` asserts real entropy
 * INSIDE every band and ZERO mass outside it.
 *
 * Pure data. No RNG, no imports from the roll, no React, no store.
 */

/**
 * ⭐⭐ THE OWNER'S SIGNATURE — THE WHOLE RITUAL, IN THE ONE FILE (car D4).
 *
 * Every number below this record is the owner's pen. This record is what makes the
 * signing act a SINGLE FILE'S DIFF: the values are edited here, and the two words that
 * turn a draft ladder into the law new worlds are born under are edited here too.
 *
 *   `signed` — the pen has landed on the values in this file.
 *   `live`   — and NEW worlds are minted under them.
 *
 * `densityLaw.NEW_SETTLEMENT_DENSITY_LAW_VERSION` is derived from this pair and from
 * nothing else, so there is no second place to remember.
 *
 * ⛔ THE TWO WORDS ARE SEPARATE ON PURPOSE, AND THE ORDER IS STRUCTURAL. §810 R5 forbids
 * minting new worlds under unsigned numbers, so `live` CANNOT light the law while `signed`
 * is false — that ruling is machinery here rather than advice. Signing without lighting is
 * a legal and useful state (sign, soak, then light); lighting without signing is not a
 * state at all.
 *
 * ⛔ EXISTING WORLDS NEVER MOVE, whatever this record says. A world's law travels in its
 * own persisted config and there is no migration (`densityLaw.js`, property 3), so both
 * words only ever decide what a world BORN AFTER THE EDIT rolls. THE PROMISE ("a seed is a
 * STARTING world forever") is untouched by either.
 *
 * ⛔ A LANE MAY NOT FLIP EITHER WORD. Both are the owner's, by nature (tuning signature).
 */
export const REGISTER_VII_SIGNATURE = Object.freeze({
  signed: false,
  live: false,
});

/** Tier order, smallest first. The one canonical spelling for this module family. */
export const TIER_ORDER = Object.freeze([
  'thorp', 'hamlet', 'village', 'town', 'city', 'metropolis',
]);

/** The importance vocabulary, weakest first. Mirrors `IMPORTANCE_WEIGHT` in
 *  `domain/entities/npcs.js` (minor 0.0 · notable 0.4 · key 0.7 · pillar 1.0) —
 *  that module stays the single resolver; this is only the ORDER the rung
 *  mapping walks. */
export const IMPORTANCE_ORDER = Object.freeze([
  'minor', 'notable', 'key', 'pillar',
]);

/**
 * Register VII's ladder. Per tier:
 *
 *   factions       — the settlement's POWER-SEAT count roll range
 *                    (`powerStructure.factions`; §817-Q6 confirmed that list,
 *                    not the `settlement.factions` NPC-grouping list).
 *   mass           — the settlement's NAMED-NPC mass roll range. §817-Q1: this
 *                    band governs the WHOLE named roster, structural office
 *                    holders INCLUDED — which is why office coverage is a
 *                    CONSTRAINT ON THE ROLL and never a post-roll append.
 *   doubledNiches  — §810 R4's intra-power rivals: how many power niches may
 *                    carry TWO contesting factions. Zero below city.
 *   suite          — the per-faction roster size the dispersal aims at when
 *                    mass allows ("a full suite of NPCs" at city+).
 *   rivalBonusSeat — §810 R3's CONDITIONAL seat, written into Register VII's
 *                    thorp row as the literal "1 (+1 conditional)". One extra
 *                    seat ABOVE the rolled count, and only when §810.4 R16's
 *                    weighted rival roll actually takes it. It is 1 at thorp
 *                    because the thorp band has no width for a rival to win a
 *                    slot inside; at every larger tier the band already has
 *                    room, so the rival competes for an existing seat and this
 *                    is 0. The believability envelope therefore reads
 *                    [factions.min, factions.max + rivalBonusSeat] — declared
 *                    here, asserted by the distribution-shape fixture, never
 *                    an implicit overflow.
 *
 * MEASURED CONTEXT (R-DENSITY-CENSUS §5, 360 settlements at b85044099): today's
 * generator sits 100% ABOVE the faction band at hamlet/village/town and 40% of
 * metropolises sit BELOW the mass floor. This ladder is a real two-directional
 * move, not a ratification — which is exactly why it lands behind a version
 * gate rather than as an in-place retune.
 */
export const DENSITY_BANDS = Object.freeze({
  thorp:      Object.freeze({ factions: { min: 1, max: 1 }, mass: { min: 1,  max: 3  }, doubledNiches: { min: 0, max: 0 }, suite: { min: 1, max: 2 }, rivalBonusSeat: 1 }),
  hamlet:     Object.freeze({ factions: { min: 1, max: 2 }, mass: { min: 2,  max: 4  }, doubledNiches: { min: 0, max: 0 }, suite: { min: 1, max: 2 }, rivalBonusSeat: 0 }),
  village:    Object.freeze({ factions: { min: 2, max: 3 }, mass: { min: 3,  max: 6  }, doubledNiches: { min: 0, max: 0 }, suite: { min: 1, max: 2 }, rivalBonusSeat: 0 }),
  town:       Object.freeze({ factions: { min: 3, max: 5 }, mass: { min: 6,  max: 10 }, doubledNiches: { min: 0, max: 0 }, suite: { min: 1, max: 2 }, rivalBonusSeat: 0 }),
  city:       Object.freeze({ factions: { min: 5, max: 8 }, mass: { min: 12, max: 20 }, doubledNiches: { min: 1, max: 2 }, suite: { min: 2, max: 3 }, rivalBonusSeat: 0 }),
  metropolis: Object.freeze({ factions: { min: 7, max: 10 }, mass: { min: 18, max: 30 }, doubledNiches: { min: 1, max: 2 }, suite: { min: 2, max: 3 }, rivalBonusSeat: 0 }),
});

/** The band used for a tier this table does not name (custom/legacy spellings).
 *  Deliberately the TOWN row — the middle of the ladder — so an unknown tier
 *  degrades to a plausible settlement rather than to a thorp or a metropolis. */
export const FALLBACK_TIER = 'town';

/**
 * §810.2 R11's RANK CEILING, per tier: the highest importance band a named
 * figure may carry at this scale. "A thorp's head is at most notable; no
 * pillars below town."
 *
 * MEASURED CONTEXT: `FACTION_ROLES` (generators/factionRoles.js) assigns
 * pillar/key importances TIER-BLIND, which is why the census found 74 pillar
 * NPCs below town (7 thorps, 22 hamlets, 37 villages). Under this law the
 * ceiling is applied by `densityRungs.js` at the one place importance is
 * stamped, so a tier-blind role table can no longer out-rank its settlement.
 */
export const RANK_CEILING_BY_TIER = Object.freeze({
  thorp: 'notable', hamlet: 'notable', village: 'key',
  town: 'pillar', city: 'pillar', metropolis: 'pillar',
});

/**
 * §817-Q3, the chair's disposition: **an OCCUPIED head rung always rolls
 * ≥ notable** — head ∈ [notable, tier ceiling]. An authored VACANCY may leave
 * the planes dark; that is the receipted story-state, not an accident.
 *
 * This is the value that answers census consumer #3 (`clergyTraitPlane`'s
 * ORG_POWER minor=0 floor, which mirrors `religionLegitimacy.orgPower` and
 * shares the 0.4 threshold with `npcLadderState.RUNG_ELIGIBLE_FLOOR`): an
 * occupied temple head is notable+ ⇒ weight ≥ 0.4 ⇒ the plane lights.
 */
export const HEAD_RUNG_FLOOR = 'notable';

/**
 * §810.2 R11's VACANCY WEIGHTS — the probability each rung is EMPTY at birth.
 * "The VACANCY-PLUS-YEARNER pattern (no head priest, but one who aches for the
 * seat) is deliberately over-weighted because it is the best story the
 * generator can plant."
 *
 * `yearnerGivenHeadVacant` is that over-weight: given a vacant head, this is
 * the chance the roll seeds a yearner one band below with `seek_promotion`
 * pre-loaded rather than simply leaving the faction thin.
 *
 * `cap` is the ceiling a weight may reach AFTER `PARTICULAR_TILTS.vacancyTilt` has
 * multiplied it — a war-torn, impoverished settlement runs understaffed, but never so
 * understaffed that a rung is empty as a near-certainty. It came home from
 * `densityRoll.js`'s `rollRoster` in car D4: that file's own header promises "not one
 * number in this file", and this was the one it still carried.
 */
export const VACANCY_WEIGHTS = Object.freeze({
  head:   0.18,
  middle: 0.35,
  lowest: 0.30,
  yearnerGivenHeadVacant: 0.75,
  cap:    0.95,
});

/**
 * §810.3 R13 — THE CHANCE A SETTLEMENT CARRYING A MISSING-SEAT STRESSOR IS ACTUALLY
 * BORN RULERLESS. Deliberately not 1: the stressor is a climate, and most settlements
 * under it still have somebody holding the chair.
 *
 * Came home from `applyDensityLaw.js` in car D4, which had parked it beside its one
 * consumer with the note "belongs to the tuning surface's family … until D4 folds it in
 * with the rest of the signed values".
 */
export const FLOOR_LIFT_CHANCE = 0.5;

/**
 * §810 R4 — WHAT SHARE OF ITS HOST'S POWER THE SECOND CLAIMANT ON A DOUBLED NICHE
 * CARRIES. A second claimant SPLITS the niche's standing rather than inventing new
 * power (the shares idiom), and it stands below its host because it is the challenger
 * in that niche, not its equal.
 *
 * ⚠ THIS FILE ALREADY CITED THE NUMBER BEFORE IT HELD IT — `contestWidthForTier`'s
 * docblock below reads "the second claimant carries ~0.55 of its host's power
 * (`resizeSeats`)", and that measured claim is the reason the contest width had to
 * widen at all. A tuning surface that DOCUMENTS a value it does not own is one retune
 * away from documenting a lie; car D4 brought it home.
 */
export const DOUBLED_NICHE_SHARE = 0.55;

/**
 * How the settlement's PARTICULARS tilt the rolls within the band (§810 R1:
 * "a poor town may roll like a village, a rich crossroads village like a
 * town"). Each entry is the maximum fraction of the band's WIDTH a particular
 * may shift the roll's centre — the tilt moves the mean, it never moves the
 * EDGES, so the believability envelope is untouched by construction.
 *
 * `vacancyTilt` is §810.2's "a poor or shrinking place runs understaffed; a
 * prosperous one fills its benches" — a multiplier on the vacancy weights.
 */
export const PARTICULAR_TILTS = Object.freeze({
  prosperity:   0.20,
  connectivity: 0.12,
  war:         -0.15,
  corruption:  -0.08,
  vacancyTilt:  0.45,
});

/**
 * §810.4 R16 — THE RIVAL ROLL, WEIGHTED NOT GRANTED. A power out-influencing
 * the ruling power gains a STRONGER roll for a faction of its own, the weight
 * scaling with the influence gap; it is never a grant ("sometimes the
 * out-influenced throne stands unchallenged — that too is a world").
 *
 *   base   — the chance a rival power with a ZERO gap takes a seat it would
 *            not otherwise have won.
 *   perGap — added per unit of normalised influence gap (0..1).
 *   cap    — the ceiling; strictly below 1 so the roll can always decline.
 */
export const RIVAL_ROLL = Object.freeze({ base: 0.22, perGap: 0.55, cap: 0.88 });

/**
 * §810.2 R10's dispersal: "concentration FOLLOWS power without ever being
 * determined by it." The partition weights each faction by its power raised to
 * `concentrationExponent`; the exponent itself is ROLLED per settlement in
 * [min, max], which is what makes all-in-the-ruling-power, spread-one-each and
 * everything between reachable from the same law.
 *
 *   0  ⇒ power-blind (flat) — the spread-one-each end
 *   1  ⇒ strictly power-proportional (today's `factionTarget` behaviour)
 *   >1 ⇒ winner-takes-most — the all-in-one end
 *
 * ⛔ `halvings` IS NOT A TUNING TASTE — IT IS WHAT MAKES THE EXPONENT REPLAYABLE.
 * The exponent is applied on a DYADIC LADDER of `1 << halvings` = 64 steps, because
 * `Math.pow` is implementation-approximated per the ECMAScript spec: two engines may
 * return different bits for the same power, and a same-seed world would then fork ACROSS
 * ENGINES — which THE PROMISE ("a seed is a STARTING world forever") cannot survive.
 * `Math.sqrt` is required CORRECTLY ROUNDED by that same spec and multiplication is
 * exactly specified, so `x^(k/64)` reached by six halvings and a squaring chain is
 * bit-identical everywhere. The tree's transcendental ratchet forbids the alternative
 * outright and its declared-overrun ledger is monotone-down and full, so this is not a
 * preference: it is the only lawful spelling. Raising `halvings` refines the ladder and
 * costs one more sqrt; it never restores `Math.pow`.
 */
export const CONCENTRATION = Object.freeze({ min: 0.0, max: 2.6, halvings: 6 });

/**
 * §810.8 R24 — THE RESOLUTION CLOCK, in ticks. "A succession that never resolves is a
 * hole, not a story; termination is structural."
 *
 * The clock is how long claimants have to settle it themselves before the weighted roll
 * settles it for them. The RULING seat runs the shorter clock: a headless government is
 * the state R14 calls a hole, so the world does not tolerate it as long as it tolerates
 * a guild without a master.
 *
 * ⛔ DRAFTS, owner-unsigned (car D4). Deliberately NOT borrowed from
 * `DRIFT_REEMIT_COOLDOWN_TICKS`: that constant is a NEWS re-emit window, and the claim
 * a succession clock makes is a different claim about the world. D2c borrowed it where
 * the claim genuinely was the same (the emergence cadence); reusing it here would be
 * the HK-4 razing-latch law applied backwards.
 */
export const SUCCESSION_CLOCK_TICKS = Object.freeze({
  ruling_seat: 8,
  faction_head: 12,
});

/**
 * §810.8 R24's OUTCOME WEIGHTS — what the roll reads when play has not settled the
 * succession by the clock's end.
 *
 * ⛔⛔ EVERY VALUE HERE IS A DRAFT AND THE OWNER'S PEN IS WHAT FREEZES IT (car D4).
 * These are the judgment-dense numbers of the whole succession law: they decide how
 * often a realm's politics resolve quietly, how often a house is lawfully displaced,
 * and how often somebody takes the seat by force. A lane may not sign them. They are
 * recorded here as the machinery's runnable DEFAULT — the grammar is proven on FIXED
 * fixtures that drive each ending explicitly, so no fixture depends on these values.
 *
 * The terms are R24's own list, each read from a quantity the world already carries:
 *
 *   `continuityBase` / `perClaimant`     — HOUSE DEPTH. A house with people in it can
 *                                          seat one of them; an empty one cannot.
 *   `continuityLegitimacy`               — a legitimate order is succeeded, not replaced.
 *   `transferBase` / `perLegitimacyGap`  — THE LEGITIMACY/INFLUENCE GAP. A challenger
 *                                          with a case wins the seat lawfully.
 *   `transferLegitimacyFloor`            — ⭐ below this the challenger has no CASE, and
 *                                          R23's TRANSFER is defined by having one. A
 *                                          challenger under the floor can still take the
 *                                          seat — but only by OVERTHROW, which is the
 *                                          whole distinction §810.8 draws.
 *   `overthrowBase` / `perCoercionGap`   — arms. The gap is read from the coup
 *                                          machinery's own coercion-weighted contenders.
 *   `warTilt` / `instabilityTilt`        — WAR STATE and SETTLEMENT DISPOSITION. A town
 *                                          at war with a shaken order is where seats get
 *                                          taken rather than passed.
 *
 * ⬜ TWO OF R24's WEIGHTS ARE ABSENT ON PURPOSE, NOT FORGOTTEN: "the claimants'
 * characters and risk registers" belong to W-LIVES, which has not landed. The seam is
 * named in `successionGrammar.js`; inventing a lesser character term here would have to
 * be unpicked when the real one arrives.
 */
export const SUCCESSION_WEIGHTS = Object.freeze({
  continuityBase: 0.35,
  perClaimant: 0.22,
  continuityLegitimacy: 0.40,
  transferBase: 0.10,
  perLegitimacyGap: 0.55,
  transferLegitimacyFloor: 0.45,
  overthrowBase: 0.08,
  perCoercionGap: 0.60,
  warTilt: 0.35,
  instabilityTilt: 0.30,
});

/** @param {string|null|undefined} tier @returns {keyof typeof DENSITY_BANDS} the canonical tier key — GUARANTEED a band-table member (unknown tiers fall back) */
export function tierKey(tier) {
  const t = String(tier || '').toLowerCase();
  return /** @type {keyof typeof DENSITY_BANDS} */ (TIER_ORDER.includes(t) ? t : FALLBACK_TIER);
}

/** The whole band row for a tier (never undefined — unknown tiers fall back).
 *  @param {string|null|undefined} tier */
export function bandsForTier(tier) {
  return DENSITY_BANDS[tierKey(tier)];
}

/** The rank ceiling for a tier. @param {string|null|undefined} tier @returns {string} */
export function rankCeilingForTier(tier) {
  return RANK_CEILING_BY_TIER[tierKey(tier)] || 'pillar';
}

/** Index of an importance band in IMPORTANCE_ORDER, or -1.
 *  ⚠ THE PARAM IS `unknown` BY IMPLEMENTATION, AND NOW SAYS SO. The body coerces
 *  with `String(importance || '')`, so it has always accepted any value and
 *  returns -1 for anything unrecognized; the old `string|null|undefined` was
 *  narrower than the truth, which reddened `densityRungs.topImportanceIndex`
 *  (its members' `importance` is declared `unknown`) on `typecheck:ratchet`.
 *  Widening the declaration to match the body is documentation, not a change.
 *  @param {unknown} importance @returns {number} */
export function importanceIndex(importance) {
  return IMPORTANCE_ORDER.indexOf(String(importance || '').toLowerCase());
}

/** The believability envelope for a tier's FACTION COUNT, §810 R3's conditional
 *  seat included. This — not `bands.factions` alone — is what the roll may
 *  produce and what the distribution-shape fixture asserts against.
 *  @param {string|null|undefined} tier @returns {{min: number, max: number}} */
export function factionEnvelopeForTier(tier) {
  const b = bandsForTier(tier);
  return { min: b.factions.min, max: b.factions.max + (b.rivalBonusSeat || 0) };
}

/**
 * ⛔ THE PRE-LAW CONTEST WIDTH — `factionCompetition.js`'s literal `.slice(0, 3)`,
 * named here so the v1 arm is a NAMED CONSTANT rather than a magic number
 * repeated in two files. Every existing world evaluates exactly three factions,
 * and that must not move: it is shipped simulation behaviour.
 */
export const LEGACY_CONTEST_WIDTH = 3;

/**
 * §817-Q4 / ODQ §822 — HOW MANY FACTIONS THE CONTEST MACHINERY EVALUATES.
 *
 * ⭐ THE PROBLEM THIS SOLVES, MEASURED. `factionCompetition.js#topFactionEntries`
 * sorts a settlement's factions by raw power and evaluates a fixed top THREE.
 * Under Register VII a city seats 5–8 houses and a metropolis 7–10, of which
 * 1–2 are §810 R4's DOUBLED NICHES — two claimants contesting one power's niche.
 * The second claimant carries ~0.55 of its host's power (`resizeSeats`), which
 * pushes it down the ranking: over 240 measured v2 settlements, **361 of 362
 * doubled-niche pairs had at least one member outside the top three**, so R4
 * would mint a rivalry that the contest machinery it explicitly reuses could
 * never evaluate.
 *
 * ⭐ THE WIDTH SCALES WITH THE LADDER, AND THE SELECTION KEY DOES NOT MOVE.
 * D8's ruling — selection stays on RAW POWER — is untouched (see that function's
 * own docblock: discounting the sort key would make an absent faction DISAPPEAR
 * rather than merely weigh less). This widens only HOW MANY of that same
 * raw-power ordering are evaluated.
 *
 * ⛔ IT IS A FLOOR, NEVER A NARROWING. `Math.max(LEGACY_CONTEST_WIDTH, …)` is
 * load-bearing: the thorp and hamlet envelopes top out at 2, and letting the
 * width fall to 2 would EVALUATE FEWER factions than the engine does today —
 * a coverage regression wearing a feature's commit message. The width may only
 * grow. Measured result across the ladder: **3 · 3 · 3 · 5 · 8 · 10**.
 *
 * Derived from the faction envelope rather than tabulated, so the owner's
 * signature on `DENSITY_BANDS` at the tuning pass retunes this automatically and
 * no second table can drift out of agreement with the first.
 *
 * @param {string|null|undefined} tier
 * @returns {number}
 */
export function contestWidthForTier(tier) {
  return Math.max(LEGACY_CONTEST_WIDTH, factionEnvelopeForTier(tier).max);
}

/** Clamp an importance band to a tier's rank ceiling. Never returns a band
 *  above the ceiling; never returns a band below `minimum` when one is given.
 *  @param {string} importance @param {string|null|undefined} tier @param {string|null} [minimum] */
export function clampImportanceToTier(importance, tier, minimum = null) {
  const ceilIdx = importanceIndex(rankCeilingForTier(tier));
  const minIdx = minimum ? importanceIndex(minimum) : 0;
  let idx = importanceIndex(importance);
  if (idx < 0) idx = 0;
  // The ceiling wins over the floor: a tier whose ceiling sits BELOW the
  // requested minimum caps at its ceiling rather than breaching the envelope.
  idx = Math.min(idx, ceilIdx);
  idx = Math.max(idx, Math.min(minIdx, ceilIdx));
  return IMPORTANCE_ORDER[idx];
}
