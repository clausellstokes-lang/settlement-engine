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
import { backingArchetypeOf, dealDoubledNiches, houseBacksOf } from '../../domain/dossier/powerSupport.js';
import { BACKING_ARCHETYPES } from '../../data/institutionBacking.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import { deriveTradeCommodity } from '../tradeCommodity.js';
import { governingFactionOf, nameOf } from '../../domain/rulingPower.js';
import { isNoPowerInstitution } from '../../data/institutionalCatalog.js';
import { hookPoolFor } from './poolMap.js';
import { drawCardHooks, HOOKS_FORK_LABEL, mintPowerFace, onStream, seatHouseOf, SEAT_CARD_ID } from './representatives.js';
import { OTHER_CARD_PREFIX, otherMintRowFor } from './mintTitles.js';
import { RUNG_KEYS, rungBandsForTier } from '../../domain/density/densityRungs.js';

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
 * @param {Record<string, any>} settlement the settlement-shaped object at the coherence seam
 *   (tier, institutions, powerStructure, economicState, config, _userEdits for the DM's `backs`)
 * @param {Array<Record<string, any>>} cards the cast as born (step 2)
 * @param {{ fork: (label: string) => any } | null} rng the seam's stream; null ranks by weight alone, no roll
 * @returns {Array<Record<string, any>>}
 */
export function assignCastPowers(settlement, cards, rng) {
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const powers = factions.map((f) => nameOf(f)).filter(Boolean);
  if (!powers.length || !Array.isArray(cards)) return cards;
  const powerSet = new Set(powers);
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
    card.memberships.push({ power, rank: null, share: round4(share) });
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
  const unfaced = factions.filter((f) => {
    const name = nameOf(f);
    return name && name !== governing && !BACKING_ARCHETYPES.includes(backingArchetypeOf(f))
      && !existingIds.has(`${OTHER_CARD_PREFIX}${powerSlug(name)}`);
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
      _prosperity: economicState?.prosperity || null,
    };
    /** @type {Map<string, string>} minted card id → the person hook's pool */
    const mintHookPools = new Map();
    unfaced.forEach((f) => {
      const name = nameOf(f);
      const id = `${OTHER_CARD_PREFIX}${powerSlug(name)}`;
      existingIds.add(id);
      const row = otherMintRowFor(name);
      const draw = () => mintPowerFace(row, mintCtx, { hook: false });
      const card = mintStream ? onStream(mintStream.fork(powerSlug(name)), draw) : draw();
      card.id = id;
      card.title = row.title;
      card.role = row.title; // M-1b
      card.institution = { kind: 'power', key: name, family: null, title: row.title };
      card.memberships = [];
      // a name a card already bears takes the mint's TITLE as its qualifier — the MINT's name moves,
      // never an existing card's (the population step's ties store the names they were drawn with)
      const taken = new Set([...cards, ...lateMints].map((c) => String(c?.name || '').trim().toLowerCase()));
      if (taken.has(String(card.name || '').trim().toLowerCase())) card.name = `${String(card.name).trim()} (${row.title})`;
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

  // ── The three (R-P5), per power ──────────────────────────────────────────────────────────
  for (const power of powers) {
    const pool = members.get(power);
    if (!pool.length) continue;
    const isGoverning = power === governing;
    /** @type {Member[]} */
    const chosen = [];
    const remaining = [...pool];
    const take = (member) => { if (!member) return; chosen.push(member); remaining.splice(remaining.indexOf(member), 1); };
    // FLOOR 1 — the seat first (the governing power's): the seat house's face, or the minted seat;
    // and an `other` power's own minted face first (R-P4: the mint IS its person)
    if (isGoverning) {
      take(remaining.find((m) => (seatKey ? m.card.institution?.key === seatKey && m.card.institution?.kind === 'house' : m.card.id === SEAT_CARD_ID)));
    } else {
      take(remaining.find((m) => m.card.institution?.kind === 'power' && m.card.institution?.key === power));
    }
    // FLOOR 2 — the power's own landmark: the highest-weight house whose largest share lands here
    if (chosen.length < RANKS) {
      const landmark = remaining
        .filter((m) => m.largest && m.weight !== null)
        .sort((x, y) => (y.weight - x.weight) || (y.share - x.share) || (x.at - y.at))[0];
      take(landmark);
    }
    // the roll, without replacement, on the power's own fork
    const fork = rankStream ? rankStream.fork(powerSlug(power)) : null;
    while (chosen.length < RANKS && remaining.length) {
      const weights = remaining.map((m) => Math.max(rollWeightOf(m.share, m.weight), 1e-6));
      const pick = fork ? fork.weightedPick(remaining, weights) : remaining[0];
      take(pick);
    }
    chosen.forEach((m, i) => {
      const membership = m.card.memberships.find((x) => x.power === power);
      if (membership) membership.rank = /** @type {1 | 2 | 3} */ (i + 1);
    });
  }

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
