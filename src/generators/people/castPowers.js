/**
 * people/castPowers.js — THE POWERS' PEOPLE: every card's memberships from the backing
 * catalogue, the `other` powers' minted faces, and each power's first, second and third (the
 * people car, PEOPLE-1 CAST, 2026-11-07; the chair's rulings R-P3, R-P4, R-P5 in
 * docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §1).
 *
 * THE OWNER'S CHARTER (ODQ §934.105): "weighted rolls with a floor depending on which institution
 * and that institution's importance to the faction/power … those 3 chosen NPCs are applied to
 * powers as the first second and third most influential. Still each NPC according to their
 * institution, belongs to one or more powers now."
 *
 * MEMBERSHIPS. A card belongs to every power its house has a LANDED share in
 * (domain/dossier/powerSupport.js :: houseBacksOf — the X-45 arithmetic unchanged: a house's
 * shares sum to one, land on the leading power of each archetype, lapse or fall back, never
 * double count), after the doubled niches are dealt (R-P3, `dealDoubledNiches`, beside it). A
 * `default` landing (share 0: the house answers to the seat at no weight) is not a membership;
 * the three `noPower` houses have none (R-P1 e). The minted seat (step 2) belongs to the
 * governing power whole. Each membership: `{ power, rank: 1 | 2 | 3 | null, share }`.
 *
 * THE `other` MINT (R-P4). A power with NO ARCHETYPE ROW in the backing catalogue — the
 * stress-born `other` powers (Revolt Leadership, the Creditor's Representative, …) and the
 * archetypes no share can name (an Occupation Authority) — mints one face from its stressor
 * under its title (people/mintTitles.js), `institution: { kind: 'power', … }`, a member of that
 * power whole and its first, drawn on its own keyed fork (`people-powers::mint::<power slug>`).
 * The governing power is never minted here: its face is the seat. Recruiting from the
 * default-share faces is refused.
 *
 * THE THREE (R-P5). Within each power, a weighted roll WITHOUT replacement on the power's own
 * keyed fork (`people-powers::ranks::<power slug>`), weight = landed share × house weight (0.5
 * for weight 0; a minted face 1), under two floors: FLOOR 1 — the governing power's first is the
 * seat's face; FLOOR 2 — a non-governing power's first, and the governing power's second, is
 * the highest-weight member house whose LARGEST share lands on the power (ties by share, then
 * roster order). Up to three; a power ranks the faces it has — three, two, one, none. No
 * borrowing, no padding, no fabricated citizen (R-P5: the small places are short of people, and
 * that is the truth of a thorp).
 *
 * Runs at the coherence seam (narrativeGenerator.js :: enrichNpcCoherence), which both full
 * assembly and NPC section-regen run, AFTER the power roster is final (the density law's resize
 * at assembly) and BEFORE the shim derives the two legacy fields from the ranks. Deterministic:
 * the same roster, powers and stream give the same memberships and ranks.
 */

import { slugify } from '../../kernel/slugify.js';
import { backingArchetypeOf, dealDoubledNiches, houseBacksOf, RULER_KINDS } from '../../domain/dossier/powerSupport.js';
import { backingRowFor } from '../../data/institutionBacking.js';
import { BACKING_ARCHETYPES } from '../../data/institutionBacking.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import { deriveTradeCommodity } from '../tradeCommodity.js';
import { governingFactionOf, nameOf } from '../../domain/rulingPower.js';
import { FACE_SEAT, faceOfInstitution, isFabricInstitution, isNoPowerInstitution } from '../../data/institutionalCatalog.js';
import { hookPoolFor, POWER_BANDS, seatPoolFor } from './poolMap.js';
import { powerBandOfRole } from '../npcGenerator.js';
import { drawCardHooks, dualHatHouseOf, HOOKS_FORK_LABEL, houseKindOf, mintPowerFace, officeTitleFor, onStream, seatHouseOf, SEAT_CARD_ID } from './representatives.js';
import { OTHER_CARD_PREFIX, otherMintRowFor } from './mintTitles.js';
import { CLAIMANT_FACE, HOUSELESS_CRIMINAL_FACE } from '../../data/stressPowerFaces.js';
import { stressPowerRowOf } from '../../domain/people/stressPowerFaces.js';
import { isHideableHouse, isVeiledPower, veiledCardIdFor } from '../../domain/people/cardVeil.js';
import { veiledEpithetFor } from '../npcDisplayNames.js';
import { RUNG_KEYS, rungBandsForTier } from '../../domain/density/densityRungs.js';
import { allegianceOf, isCriminalPower, organizedCrimeOf } from '../../domain/people/allegiance.js';

/** The keyed fork the late mints and the ranks draw under (declared in the fork census). */
export const POWERS_FORK_LABEL = 'people-powers';
/** The one `other` mint's id prefix (owned by people/mintTitles.js; the mint is born in representatives.js). */
export { OTHER_CARD_PREFIX };
/** How many a power ranks (R-P5: "up to three"). */
/**
 * THE DIALS of the powers' people (R-P5), a tuning table so the register names them (DRAFT rows in
 * tests/lint/.tuning-register.json until the owner signs the estate): the three ranks a power
 * seats, and the roll weight a weight-0 house carries (the brief: "0.5 for weight 0").
 */
export const CAST_POWERS_TUNING = Object.freeze({ RANKS: 3, WEIGHT_ZERO_HOUSE: 0.5 });
export const RANKS = CAST_POWERS_TUNING.RANKS;

/**
 * THE GUILD'S PUSH (the allegiance train, car 2, ALLEGIANCE-CAR2, 2026-11-08; the design §3.2, the
 * chair's J-11). The owner (2026-11-08, verbatim): "if a legitimate business has ties with the thieves
 * guild and scaling with the thieves guild influence abd strenght abd amount or quality of organized
 * crime, they would try to push that individual to higher ranks within their respective powers. It may
 * not get them to the top three to be a face it it may that simply depends on the ranks after the maths."
 * A multiplier on a hidden agent's ROLL weight in each of its LEGITIMATE powers, a sum with a final clamp
 * (corruption.js's pressure-cap style):
 *   push = clamp(1 + strength·n01(criminalStrength ÷ strengthFull) + organized·organizedCrime, 1, max)
 * `criminalStrength` the points of `allegiance.power` (0 where the allegiance names no criminal power),
 * `organizedCrime` domain/people/allegiance.js :: organizedCrimeOf. The floors sort on raw house weight
 * and never read it (J-11): only the weighted ranks move. DRAFT rows in tests/lint/.tuning-register.json
 * until the owner signs the estate. Units: strength multiplier · strengthFull points · organized
 * multiplier · max multiplier.
 */
export const GUILD_PUSH_TUNING = Object.freeze({
  /** the criminal power's pull, at full strength */
  strength: 0.6,
  /** the criminal power's strength (points of 100) at which its pull is full */
  strengthFull: 30,
  /** organized crime's pull */
  organized: 0.4,
  /** the cap on the push (the same cap as corruption.js's pressure) */
  max: 2.0,
});

/** @param {number} x @returns {number} */
const n01 = (x) => (Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);

/**
 * The guild's push on one card (the design §3.2): 1 for a card with no hidden allegiance; else the
 * clamped sum. Pure and per card (I-13: removing a card never moves another card's push).
 * @param {unknown} card @param {Record<string, any>} settlement
 * @param {{ organized?: number, tuning?: typeof GUILD_PUSH_TUNING }} [opts] `organized` precomputed per town
 * @returns {number}
 */
export function guildPushOf(card, settlement, opts = {}) {
  const a = allegianceOf(card);
  if (!a) return 1;
  const T = opts.tuning || GUILD_PUSH_TUNING;
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const crim = a.power ? factions.find((f) => nameOf(f) === a.power) : null;
  const criminalStrength = crim ? Number(crim.power) || 0 : 0;
  const organized = typeof opts.organized === 'number' ? opts.organized : organizedCrimeOf(settlement);
  const raw = 1 + T.strength * n01(criminalStrength / T.strengthFull) + T.organized * n01(organized);
  return Math.max(1, Math.min(T.max, raw));
}

const powerSlug = (name) => slugify(name, { sep: '_', max: 60, fallback: 'power', empty: 'power' });
const round4 = (x) => Math.round(x * 10000) / 10000;

/**
 * The roll weight of a member: landed share × house weight, 0.5 for a weight-0 house, 1 for a
 * minted face (R-P5).
 * @param {number} share @param {number | null} weight null for a minted face
 */
export function rollWeightOf(share, weight) {
  const w = weight === null ? 1 : (weight === 0 ? CAST_POWERS_TUNING.WEIGHT_ZERO_HOUSE : weight);
  return share * w;
}

/**
 * @typedef {{ power: string, rank: 1 | 2 | 3 | null, share: number }} Membership
 * @typedef {{ card: Record<string, any>, share: number, weight: number | null, largest: boolean, at: number }} Member
 */

/**
 * THE POWERS' PEOPLE. Mutates the cards' `memberships` and `importance`, returns the cast (the
 * `other` mints are born with it in representatives.js; a power born after the population step is
 * minted here, appended, each tied to the seat).
 *
 * ALLEGIANCE-CAR1 (2026-11-08, the allegiance design §2, A1 / A3): the deal is TWO halves so the
 * hidden allegiance (A2, domain/people/allegiance.js :: dealAllegiances) is dealt between them —
 * `landMemberships` (A1: the memberships, rank null, and the `other` mints) then `rankPowers` (A3:
 * the three per power and the importance band). This wrapper runs them back to back, byte-identical
 * to the one function it was: every fork is minted in `landMemberships`, in the same order.
 *
 * @param {Record<string, any>} settlement the settlement-shaped object at the coherence seam
 *   (tier, institutions, powerStructure, economicState, config, _userEdits for the DM's `backs`)
 * @param {Array<Record<string, any>>} cards the cast as born (step 2)
 * @param {{ fork: (label: string) => any } | null} rng the seam's stream; null ranks by weight alone, no roll
 * @param {unknown} [seed] the record's `_seed`, the salt of a veiled mint's opaque id (FIX-PUBLIC-VEIL)
 * @returns {Array<Record<string, any>>}
 */
export function assignCastPowers(settlement, cards, rng, seed = settlement?._seed ?? null) {
  const landed = landMemberships(settlement, cards, rng, seed);
  return landed.plan ? rankPowers(settlement, landed) : landed.all;
}

/**
 * @typedef {{ powers: string[], members: Map<string, Member[]>, governing: string | null,
 *   seatKey: string | null, rankStream: any }} RankPlan
 * @typedef {{ all: Array<Record<string, any>>, plan: RankPlan | null }} Landed
 */

/**
 * A1 — LAND: every card's memberships (rank null) from the backing catalogue, the minted seat's,
 * and the `other` mints (R-P3, R-P4). Mints every fork of `people-powers` (mint, ranks, hooks) in
 * the order the one function minted them. `plan` is null where nothing ranks (no power, no cast).
 *
 * @param {Record<string, any>} settlement @param {Array<Record<string, any>>} cards
 * @param {{ fork: (label: string) => any } | null} rng @param {unknown} [seed]
 * @returns {Landed}
 */
export function landMemberships(settlement, cards, rng, seed = settlement?._seed ?? null) {
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const powers = factions.map((f) => nameOf(f)).filter(Boolean);
  if (!powers.length || !Array.isArray(cards)) return { all: cards, plan: null };
  const powerSet = new Set(powers);
  /** @type {Set<string>} the powers a membership may not name publicly (domain/people/cardVeil.js) */
  // COHERENCE-POWERS-3 (F5): a clandestine power of the stress table (its `veiled` row) is veiled for EVERY member, by
  // whichever path the member is dealt — a house's share as much as the face the rule seats
  const veiledPowers = new Set(factions.filter((f) => isVeiledPower(f) || stressPowerRowOf(settlement, f)?.veiled === true).map((f) => nameOf(f)));
  const governing = nameOf(governingFactionOf(settlement)) || null;
  const stream = rng && typeof rng.fork === 'function' ? rng.fork(POWERS_FORK_LABEL) : null;
  // ONE mint per label (the fork census counts every stream minted): the two families are forked
  // once here and keyed per power below, never re-forked inside a loop.
  const mintStream = stream ? stream.fork('mint') : null;
  const rankStream = stream ? stream.fork('ranks') : null;
  // the minted faces' ONE hook each (PEOPLE-3 HOOKS): `people-powers::people-hooks::<card id>`
  const hookStream = stream ? stream.fork(HOOKS_FORK_LABEL) : null;
  const byHouse = dealDoubledNiches(settlement, houseBacksOf(settlement));
  const houseByName = new Map(institutions.map((inst) => [String(inst?.name || ''), inst]));
  const seat = seatHouseOf(institutions);
  const seatKey = seat ? String(seat.house.name || '') : null;

  /** @type {Map<string, Member[]>} power -> its members, in cast order */
  const members = new Map(powers.map((p) => [p, []]));
  /** @param {Record<string, any>} card @param {string} power @param {number} share @param {number | null} weight @param {boolean} largest @param {number} at */
  const join = (card, power, share, weight, largest, at) => {
    if (!powerSet.has(power)) return;
    // FIX-PUBLIC-VEIL (the chair's ruling: the same law per entry): each membership carries the veil bit
    // of THAT power at birth — a membership in a hidden or criminal power is never published.
    card.memberships.push({ power, rank: null, share: round4(share), veiled: veiledPowers.has(power) });
    members.get(power).push({ card, share, weight, largest, at });
  };

  // ── Memberships from the backing catalogue (and the minted seat's) ──────────────────────
  cards.forEach((card, at) => {
    if (!card || !card.institution) return;
    card.memberships = [];
    if (card.institution.kind === 'power') {
      // a minted face (the seat of R-P2, an `other` power's of R-P4): its power's, whole
      if (card.institution.key && powerSet.has(card.institution.key)) join(card, card.institution.key, 1, null, true, at);
      return;
    }
    const house = houseByName.get(String(card.institution.key || ''));
    if (!house || isNoPowerInstitution(house)) return;
    const landed = (byHouse.get(String(house.name || '')) || []).filter((b) => b.share > 0);
    landed.forEach((b, i) => join(card, b.faction, b.share, b.weight, i === 0, at));
  });

  // ── The `other` mint (R-P4) ──────────────────────────────────────────────────────────────
  // Minted HERE, where the powers are FINAL (the assembly's replay thins and adds powers after the
  // population step), under the title table and on its own keyed fork (`people-powers::mint::<slug>`).
  // Its tie to the seat is drawn by the ONE tie writer (MERGE-234, the chair's ruling of 10:4x UTC:
  // people/ties.js :: drawTies forces the seat as an `other` mint's target on `people-ties::<card id>`;
  // the `…::tie` fork that drew it here through the retired pair generator is retired).
  const lateMints = [];
  const config = settlement?.config || {};
  const economicState = settlement?.economicState || {};
  const existingIds = new Set(cards.map((c) => c?.id));
  // FIX-PUBLIC-VEIL (the second seat): a hidden or criminal power's face is born with the opaque id
  // of people/cardVeil.js (salted by the record's seed), so its slug never names the power publicly.
  const mintIdOf = (/** @type {Record<string, unknown>} */ f) => (isVeiledPower(f)
    ? veiledCardIdFor(seed, `power_${powerSlug(nameOf(f))}`)
    : `${OTHER_CARD_PREFIX}${powerSlug(nameOf(f))}`);
  // COHERENCE-POWERS item 3 (the chair's ruling of 2026-11-12): two more powers mint their one face. An APPOINTED
  // stress power (the occupation authority) is the occupier's man, whatever house lands on it (one hat); a criminal
  // power no house of its own stands behind (a small place's protection operation) has its master, veiled.
  // COHERENCE-POWERS-3 (F4): a power is housed only where a house's face has joined it above (a share dealt to a house
  // with no face, or to one that backs no power, puts no one on the page)
  const housed = (/** @type {string} */ name) => (members.get(name) || []).some((m) => m.card?.institution?.kind === 'house');
  // COHERENCE-POWERS-4 (F3): a claimant power is faced by the claimant in person, minted as the occupier's man is
  const mintsBySent = (/** @type {Record<string, unknown>} */ f) => stressPowerRowOf(settlement, f)?.appointed === true
    || stressPowerRowOf(settlement, f)?.claimant === true || (isCriminalPower(f) && !housed(nameOf(f)));
  const unfaced = factions.filter((f) => {
    const name = nameOf(f);
    return name && name !== governing && (!BACKING_ARCHETYPES.includes(backingArchetypeOf(f)) || mintsBySent(f))
      && !existingIds.has(mintIdOf(f));
  });
  if (unfaced.length) {
    const tier = String(settlement?.tier || 'town');
    const culture = String(config.culture || 'germanic');
    const worldLaw = resolveGenerationWorldLaw(null, config);
    // THE ONE REGISTRY (MERGE-234, the chair's ruling of 10:4x UTC: one writer per fact): the roster's
    // texts so far, read by the mint's body (no goal, secret, tell or speech repeated) and by the hook
    // draw below (no line the roster holds) — the mint draws NO hook of its own.
    const hookRegistry = {
      titles: new Set(cards.flatMap((c) => c?.plotHooks || [])),
      themes: new Set(),
      tells: new Set(cards.map((c) => c?.personality?.tell).filter(Boolean)),
      speech: new Set(cards.map((c) => c?.personality?.speech).filter(Boolean)),
      goals: new Set(cards.map((c) => c?.goal?.short).filter(Boolean)),
      secrets: new Set(cards.map((c) => c?.secret?.what).filter(Boolean)),
    };
    const mintCtx = { tier, culture, config, economicState, powerStructure: settlement?.powerStructure, institutions, hookRegistry, worldLaw };
    // the pipeline's own npcConfig, as the birth seam spells it, for the hook draw's templates
    const npcConfig = {
      ...config,
      _tradeCommodity: deriveTradeCommodity(economicState, { firstWordFallback: true }),
      _dominantFaction: factions[0]?.faction || null,
      _government: settlement?.powerStructure?.government ?? null, // MERGE-CAR: CENSUS-4d (R-V) — the goal draw reads the ruler kind the record already has (generateNPCs' npcConfig carries it; the car's birth seams now do too)
      _prosperity: economicState?.prosperity || null,
    };
    /** @type {Map<string, string>} minted card id → the person hook's pool */
    const mintHookPools = new Map();
    unfaced.forEach((f) => {
      const name = nameOf(f);
      const id = mintIdOf(f);
      existingIds.add(id);
      const row = stressPowerRowOf(settlement, f)?.claimant === true ? CLAIMANT_FACE
        : isCriminalPower(f) && otherMintRowFor(name).fallback ? HOUSELESS_CRIMINAL_FACE : otherMintRowFor(name);
      const draw = () => mintPowerFace(row, mintCtx, { hook: false });
      const card = mintStream ? onStream(mintStream.fork(powerSlug(name)), draw) : draw();
      card.id = id;
      card.title = row.title;
      card.role = row.title; // M-1b
      // FIX-PUBLIC-VEIL: the veil bit at birth — a hidden power's mint (the stress infiltrator) or a criminal one's
      card.institution = { kind: 'power', key: name, family: null, title: row.title, veiled: isVeiledPower(f) };
      card.memberships = [];
      // a name a card already bears takes the mint's TITLE as its qualifier — the MINT's name moves,
      // never an existing card's (the population step's ties store the names they were drawn with)
      const taken = new Set([...cards, ...lateMints].map((c) => String(c?.name || '').trim().toLowerCase()));
      if (taken.has(String(card.name || '').trim().toLowerCase())) {
        // FIX-PUBLIC-VEIL (the chair's ruling, finding (b)): a hidden or criminal power's face never takes its
        // title as the qualifier; born after its namesake, it is "the Younger" (npcDisplayNames.js's epithets)
        const base = String(card.name).trim();
        if (isVeiledPower(f)) {
          let epithet = veiledEpithetFor(1, 2);
          for (let n = 2; taken.has(`${base} ${epithet}`.toLowerCase()); n += 1) epithet = veiledEpithetFor(n + 1, n + 2);
          card.name = `${base} ${epithet}`;
        } else card.name = `${base} (${row.title})`;
      }
      lateMints.push(card);
      // the hook's pool from the mint's EFFECTIVE category (no title-table row is `magic`, so no swap here)
      mintHookPools.set(id, hookPoolFor(row.title, null, { category: row.category }).pool);
      join(card, name, 1, null, true, cards.length + lateMints.length - 1);
    });
    // ONE HOOK PER SEAM-MINTED CARD (PEOPLE-3 HOOKS, composed by MERGE-234): lane 3's writer, in mint
    // order, each on its own per-card fork of lane 3's family (`people-powers::people-hooks::<card id>`),
    // so a mint's hook stream is its card's whenever it was minted. Idempotent: a card already holding
    // its one hook is skipped.
    const unhooked = lateMints.filter((card) => !(Array.isArray(card.plotHooks) && card.plotHooks.length));
    drawCardHooks(unhooked, (card) => mintHookPools.get(card.id) || 'other', hookStream, npcConfig, hookRegistry, { worldLaw, institutions, tier });
  }
  const all = lateMints.length ? [...cards, ...lateMints] : cards;
  return { all, plan: { powers, members, governing, seatKey, rankStream } };
}

/**
 * A3 — RANK: each power's first, second and third (R-P5) under FLOOR 1 and FLOOR 2, then the
 * importance band from the best rank. Reads the plan `landMemberships` returned; draws only on the
 * `ranks` fork it minted.
 *
 * @param {Record<string, any>} settlement @param {Landed} landed
 * @returns {Array<Record<string, any>>}
 */
export function rankPowers(settlement, landed, pushTuning = GUILD_PUSH_TUNING) {
  const { all, plan } = landed;
  if (!plan) return all;
  const { powers, members, governing, seatKey, rankStream } = plan;
  // THE GUILD'S PUSH (car 2, A3): read once per town; a criminal power's own deal is never pushed
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const criminalPowers = new Set(factions.filter((f) => isCriminalPower(f)).map((f) => nameOf(f)));
  const organized = organizedCrimeOf(settlement);
  /** @type {Map<Record<string, any>, number>} */
  const pushes = new Map();
  const pushOf = (/** @type {Record<string, any>} */ card) => {
    if (!pushes.has(card)) pushes.set(card, guildPushOf(card, settlement, { organized, tuning: pushTuning }));
    return /** @type {number} */ (pushes.get(card));
  };
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const tier = String(settlement?.tier || 'town');
  const rulerRow = governing ? factions.find((f) => nameOf(f) === governing) || null : null;
  const rulerKind = rulerRow ? backingArchetypeOf(rulerRow) : null;
  // ── The three (R-P5), per power ──────────────────────────────────────────────────────────
  for (const power of powers) {
    const pool = members.get(power);
    const isGoverning = power === governing;
    // the dual-hat leader holds the office whatever its house backs, so a governing power with no member
    // of its own still seats its leader (a hamlet's elders, whose houses back no power)
    const hat = isGoverning && rulerRow ? dualHatHouseOf(institutions, rulerRow) : null;
    if (!pool.length && !hat) continue;
    /** @type {Member[]} */
    const chosen = [];
    const remaining = [...pool];
    const take = (member) => { if (!member) return; chosen.push(member); remaining.splice(remaining.indexOf(member), 1); };
    // FLOOR 1 — the seat first (the governing power's): the seat house's face, or the minted seat;
    // and an `other` power's own minted face first (R-P4: the mint IS its person)
    if (isGoverning) {
      // THE DUAL HAT (COHERENCE-POWERS): where the government does not send its own man, its first is the
      // face of the house the leader comes from (representatives.js :: dualHatHouseOf), a member of the
      // governing power whatever its house backs, carrying the office's title in its `role` (its `title`
      // stays its house's). Else the seat as before: the seat house's face, or the minted seat.
      const leader = hat ? memberOrJoin(String(hat.house.name || ''), power, pool, remaining, all) : null;
      if (leader) {
        take(leader);
        leader.card.role = officeTitleFor(power, tier);
        raiseToOfficeBand(leader.card, seatPoolFor(tier).role); // COHERENCE-POWERS-5 (N2): the higher of the two hats, no draw
      } else {
        take(remaining.find((m) => (seatKey ? m.card.institution?.key === seatKey && m.card.institution?.kind === 'house' : m.card.id === SEAT_CARD_ID)));
      }
    } else {
      take(remaining.find((m) => m.card.institution?.kind === 'power' && m.card.institution?.key === power));
    }
    // FLOOR 2, THE RULER'S KIND (COHERENCE-POWERS): a ruler of a kind whose first is not of its kind (a
    // government that sent its own man) seats the heaviest house of its kind among its members second
    const kinMember = isGoverning && RULER_KINDS.includes(rulerKind) && !chosen.some((m) => memberKindOf(m) === rulerKind)
      ? remaining.filter((m) => m.weight !== null && memberKindOf(m) === rulerKind && !m.card.institution?.veiled)
        .sort((x, y) => (y.weight - x.weight) || (y.share - x.share) || (x.at - y.at))[0]
      : null;
    if (kinMember && chosen.length < RANKS) take(kinMember);
    // FLOOR 2 — the power's own landmark: the highest-weight house whose largest share lands here
    if (chosen.length < RANKS && !kinMember) {
      const landmark = remaining
        .filter((m) => m.largest && m.weight !== null)
        .sort((x, y) => (y.weight - x.weight) || (y.share - x.share) || (x.at - y.at))[0];
      take(landmark);
    }
    // the roll, without replacement, on the power's own fork — each agent's weight × the guild's push in a
    // legitimate power (car 2, J-11: the floors above sorted on raw house weight and never read it)
    const fork = rankStream ? rankStream.fork(powerSlug(power)) : null;
    const pushed = !criminalPowers.has(power);
    while (chosen.length < RANKS && remaining.length) {
      const weights = remaining.map((m) => Math.max(rollWeightOf(m.share, m.weight) * (pushed ? pushOf(m.card) : 1), 1e-6));
      const pick = fork ? fork.weightedPick(remaining, weights) : remaining[0];
      take(pick);
    }
    chosen.forEach((m, i) => {
      const membership = m.card.memberships.find((x) => x.power === power);
      if (membership) membership.rank = /** @type {1 | 2 | 3} */ (i + 1);
    });
  }

  seatStressPowers(settlement, all, members);
  settleCrisisLeaders(settlement, all);

  // ── THE IMPORTANCE BAND, from the rank ──────────────────────────────────────────────────
  // The retired rung roll expressed itself through `importance` on EVERY figure (densityRungs.js:
  // "ROLLED RUNGS EXPRESS THROUGH NOTABILITY PLACEMENT" — the ladder, the notability dot and
  // every simulation ledger keyed on eligible members read it through `inferImportance`, whose
  // role regex otherwise reads a Mayor as minor). The rank is the rung now: a card's best rank
  // across its powers places it at the tier's head, middle or lowest band (the same signed table
  // the roll read, densityBands.js untouched); a member ranked nowhere, or a face of no power, is
  // `minor`. Draw-free; the rung ROLE field is not written (M-5: it is unread).
  const bands = rungBandsForTier(String(settlement?.tier || 'town'));
  for (const card of all) {
    if (!card || !Array.isArray(card.memberships)) continue;
    const best = card.memberships.reduce((acc, m) => (Number.isInteger(m?.rank) && (acc === null || m.rank < acc) ? m.rank : acc), null);
    card.importance = best === null ? 'minor' : bands[RUNG_KEYS[best - 1]];
  }
  return all;
}

/**
 * THE POWER A STRESS BRINGS WITH NO ONE ON THE PAGE (COHERENCE-POWERS item 3; the chair's ruling of 2026-11-12, the rule
 * in data/stressPowerFaces.js). A power of the table that the deal left with no member takes, as its first, the face of
 * (0) the heaviest house of the town it sits in by its nature, else (a) of the stress's own cast's houses — in each
 * case the next house where that face already leads another power — joined at share 0 (the face keeps its own powers,
 * as the dual hat's leader does); else, for a row with `rungOf` (COHERENCE-POWERS-4, F3: the old families' body), the
 * next member of those powers in their rank order who leads no power (the next free rung). Where none stands, the power
 * keeps no one and the page prints its declared line (b). A claimant, like the appointed, has its mint. Draw-free. A
 * clandestine power's membership is veiled.
 * @param {Record<string, any>} settlement @param {Array<Record<string, any>>} all @param {Map<string, Member[]>} members
 */
function seatStressPowers(settlement, all, members) {
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const leads = (/** @type {Record<string, any>} */ card) => (card.memberships || []).some((m) => m.rank === 1);
  /** @param {(house: Record<string, any>) => boolean} fits */
  const faceFrom = (fits) => institutions
    .map((house, at) => ({ house, at, weight: backingRowFor(house?.name)?.weight ?? 1 }))
    .filter(({ house }) => house && !isFabricInstitution(house) && !isHideableHouse(house)
      && typeof faceOfInstitution(house) === 'string' && faceOfInstitution(house) !== FACE_SEAT && fits(house))
    .sort((x, y) => (y.weight - x.weight) || (x.at - y.at))
    .map(({ house }) => all.find((c) => c?.institution?.kind === 'house' && c.institution.key === house.name && Array.isArray(c.memberships)))
    .find((card) => card && !leads(card)) || null;
  for (const f of factions) {
    const power = nameOf(f);
    const row = stressPowerRowOf(settlement, f);
    if (!row || row.appointed || row.claimant || (members.get(power) || []).length) continue;
    const byHouse = row.house ? faceFrom((house) => (row.house.kinds || []).includes(String(houseKindOf(house)))
      || !!row.house.names?.test(String(house.name || ''))) : null;
    const card = byHouse || (row.cast ? faceFrom((house) => /** @type {RegExp} */ (row.cast).test(String(house.name || ''))) : null)
      || (row.rungOf ? freeRungOf(row.rungOf, all, leads) : null);
    if (card) card.memberships.push({ power, rank: 1, share: 0, veiled: row.veiled === true || isVeiledPower(f) });
  }
}

/**
 * THE NEXT FREE RUNG of the named powers (COHERENCE-POWERS-4, F3): their members power by power in the order named, then
 * their rank (the ranked first, the unranked after, in cast order), the first who leads no power; null where none does.
 * @param {ReadonlyArray<string>} powers @param {Array<Record<string, any>>} all @param {(card: Record<string, any>) => boolean} leads
 */
function freeRungOf(powers, all, leads) {
  for (const power of powers) {
    const own = (/** @type {Record<string, any>} */ c) => (Array.isArray(c?.memberships) ? c.memberships.find((m) => m.power === power) : null);
    const ranked = all.filter((c) => own(c)).sort((a, b) => (own(a).rank ?? RANKS + 1) - (own(b).rank ?? RANKS + 1));
    const free = ranked.find((c) => !leads(c));
    if (free) return free;
  }
  return null;
}

/**
 * A CRISIS'S POWER IS NEVER LED BY A PERSON WHO LEADS ANOTHER POWER (COHERENCE-POWERS-3, F6; REVIEW-POWERS F6): by
 * whichever path that person was dealt (a house's share as much as the face seatStressPowers seats), the first of a power
 * of the stress table who is first of another power gives the first rung to the next of the power's members who leads
 * none (ranks re-dealt in their order); where no such member stands, the power keeps no one and the page prints its
 * declared line (data/stressPowerFaces.js). An appointed power (the occupier's man) is minted and never shared. Draw-free.
 * @param {Record<string, any>} settlement @param {Array<Record<string, any>>} all
 */
function settleCrisisLeaders(settlement, all) {
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  /** @param {Record<string, any>} card @param {string} power */
  const leadsElsewhere = (card, power) => (card.memberships || []).some((m) => m.rank === 1 && m.power !== power);
  for (const f of factions) {
    const power = nameOf(f);
    const row = stressPowerRowOf(settlement, f);
    if (!row || row.appointed || row.claimant) continue;
    const members = all.filter((c) => Array.isArray(c?.memberships) && c.memberships.some((m) => m.power === power));
    const own = (/** @type {Record<string, any>} */ c) => c.memberships.find((m) => m.power === power);
    const first = members.find((c) => own(c).rank === 1);
    if (!first || !leadsElsewhere(first, power)) continue;
    const ranked = [...members.filter((c) => Number.isInteger(own(c).rank)).sort((a, b) => own(a).rank - own(b).rank),
      ...members.filter((c) => !Number.isInteger(own(c).rank))];
    const next = ranked.find((c) => c !== first && !leadsElsewhere(c, power));
    if (!next) {
      first.memberships = first.memberships.filter((m) => m.power !== power);
      continue;
    }
    [next, ...ranked.filter((c) => c !== next)].forEach((c, i) => { own(c).rank = i < RANKS ? i + 1 : null; });
  }
}

/**
 * THE HIGHER OF THE TWO HATS (COHERENCE-POWERS-5, N2; REVIEW-POWERS-2 at e86d069be): the dual-hat leader's influence is
 * never below the office's. The office's band is the one the seat's own face draws through at the town's size (the tier's
 * seat role, poolMap.js :: seatPoolFor: an Elder in a thorp or hamlet, a Mayor or Governor above). The house's draw stands
 * where its band is the office's or above; else the card takes the office's band and keeps its draw's place within it
 * (the same offset from the band's floor, clamped to the band), so NO stream draws again. Mutates `influence` and `power`.
 * Draw-free and idempotent.
 * @param {Record<string, any>} card @param {string} officeRole the role the office's own face draws through
 */
export function raiseToOfficeBand(card, officeRole) {
  const office = POWER_BANDS[powerBandOfRole(officeRole)];
  const own = POWER_BANDS[/** @type {keyof typeof POWER_BANDS} */ (String(card?.influence || ''))];
  if (!card || !own || own.order >= office.order) return;
  const offset = Math.max(0, Math.min(office.span - 1, (Number(card.power) || own.floor) - own.floor));
  card.influence = office.level;
  card.power = office.floor + offset;
}

/** A member's house kind (representatives.js :: houseKindOf); null for a minted face. @param {Member} m */
function memberKindOf(m) {
  return m.card.institution?.kind === 'house' ? houseKindOf({ name: m.card.institution.key }) : null;
}

/**
 * The member of `power` whose card is the face of `houseKey`; where the house lands elsewhere (its
 * share is another power's, or the DM's word names another), the face JOINS the power at share 0 —
 * the dual hat: the office is held whatever the house backs (COHERENCE-POWERS). Null where the house
 * has no face on the cast.
 * @param {string} houseKey @param {string} power @param {Member[]} pool @param {Member[]} remaining
 * @param {Array<Record<string, any>>} all
 * @returns {Member | null}
 */
function memberOrJoin(houseKey, power, pool, remaining, all) {
  const isFace = (/** @type {any} */ c) => c?.institution?.kind === 'house' && c.institution.key === houseKey;
  const held = remaining.find((m) => isFace(m.card));
  if (held) return held;
  const at = all.findIndex(isFace);
  if (at < 0 || !Array.isArray(all[at].memberships)) return null;
  const card = all[at];
  card.memberships.push({ power, rank: null, share: 0, veiled: false });
  const member = { card, share: 0, weight: backingRowFor(houseKey)?.weight ?? 1, largest: false, at };
  pool.push(member);
  remaining.push(member);
  return member;
}
