/**
 * titularSuccession.js — §810.7 R22: A SUCCESSION BINDS TO THE TITLE, NEVER THE HOUSE.
 *
 * The owner's words: *"succession events are tied to title/position of the NPC and
 * not just faction."* The chair's ruling makes that structural: **one vacancy shape
 * at every scale.** A dead reeve, a dead high priest and a dead guildmaster all mint
 * the SAME open-rung-plus-claimants state, differing only in the CLAIM VOCABULARY.
 *
 * This module is the READING half. Like `factionLifecycle.js` it decides nothing and
 * writes nothing: it answers "which titles in this settlement stand vacant, and who
 * can claim each one?" `successionGrammar.js` answers what happens next.
 *
 * ── ⭐ THE VACANCY IS HEAD-RUNG-EMPTY, NOT ROSTER-EMPTY, AND THAT IS THE WHOLE POINT ──
 *
 * D2c's R18 reading fires when a roster reaches ZERO. That is the extreme case. R22's
 * ordinary case is a house with five members and NOBODY IN THE HEAD SEAT — Register
 * VII's vacancy-plus-yearner pattern, which the birth roll deliberately over-weights
 * because it is "the best story the generator can plant". R22(b) is explicit: a faction
 * PERSISTS through a head vacancy, and R18's dissolution still fires only at roster
 * zero. So the two readings are siblings, not rivals:
 *
 *   `factionLifecycle.js`   asks whether the HOUSE still exists  (roster ≥ 1)
 *   this module             asks whether the TITLE is OCCUPIED   (head rung filled)
 *
 * A house can be alive and headless; that is a succession, not a dissolution.
 *
 * ── ⭐⭐ THE YEARNER FIELD HAS A READER FOR THE FIRST TIME ─────────────────────────
 *
 * `densityRungRole` (`RUNG_ROLE_FIELD`) has been WRITTEN since D1 and READ BY NOTHING.
 * `densityBands.js` documents the yearner as seeded "with `seek_promotion` pre-loaded";
 * nothing loads it, and a census across `src/` finds one writer and no consumer. That
 * is the exact mirror of the reader-with-no-writer class this lane was convicted by at
 * D2c (`economicState.prosperity01`) — a WRITER WITH NO READER is just as dead, and it
 * hides for the same reason: nothing throws.
 *
 * R22 is that field's first legitimate reader. A yearner is "one who aches for the
 * seat", so it is a CLAIMANT — and among claimants of EQUAL STANDING it goes first.
 * ⚠ It does not out-rank standing. Intent buys a tie-break, never a promotion over a
 * better-placed rival; letting a stored intent overrule the ladder would invent a power
 * the settlement does not have.
 *
 * ── THE CLAIM VOCABULARY IS DERIVED, NOT AUTHORED (§817-Q11) ──────────────────────
 *
 * R22(a) types the claim by the office: "blood/heir where the government form implies
 * it · ladder standing for institutional heads · wealth/arms where the archetype fits".
 * That is a JOIN onto machinery that already exists, and it is taken through the
 * estate's own single governing-resolution law rather than a second table:
 *
 *   faction  →  `factionArchetype`  →  `rulingPowerFromArchetype`  →  RULING_POWERS
 *
 * — the same chain `treasury.resolveRulingPower` uses, whose docblock insists it is
 * never the free-text `powerStructure.government` string. `CLAIM_BASIS_BY_RULING_POWER`
 * below is the last link and the only new one.
 *
 * ⭐ AND R22(a) SETTLES THE NON-RULING CASE OUTRIGHT: "ladder standing for institutional
 * heads". The government form types the RULING SEAT and nothing else, so a guild's or a
 * temple's head rung always claims on `ladder`. One rule, no special case.
 *
 * ⬜ HEIR TIES ARE A NAMED SEAM, NOT A GAP. R22(d) reads "heir ties" among the claim
 * weights. The estate's heir machinery is `npcLadderState.designateHeir` /
 * `swapIntoSeat`, gated behind the dark `heirsEnabled` rule and awaiting W-LIVES. Until
 * it lights, a `blood` claim ranks by the same standing order as any other and the
 * BASIS is what differs — which is precisely what §817 asked this car to establish:
 * the claim vocabulary must EXIST before R24's clock leans on it.
 *
 * Pure. No RNG — not one draw. No writes. Dormant (v1) returns an empty reading.
 */

import { compareCodepoint } from '../../domain/deterministicSort.js';
import { factionArchetype } from '../../domain/factionArchetypes.js';
import { rulingPowerFromArchetype } from '../../domain/spatial/cohesionWeave.js';
import { importanceIndex } from '../../domain/density/densityBands.js';
import { rollsRegisterVii } from '../../domain/density/densityLaw.js';
import { factionRosterOf } from '../../domain/density/factionLifecycle.js';
import { isHeadRungVacant, rungBandsForTier, RUNG_ROLE_FIELD } from '../../domain/density/densityRungs.js';
import { seatKey } from '../../domain/density/seatKey.js';

/** The scales a title can sit at. The RULING SEAT takes §810.8's full three-ended
 *  grammar; every other head rung takes R25's reduced family. CLOSED — there is no
 *  third scale, because R22's whole claim is that one vacancy shape serves all of them. */
export const TITLE_SCOPES = Object.freeze(['ruling_seat', 'faction_head']);

/**
 * Why a title stands open. Two kinds, and the distinction is load-bearing rather than
 * descriptive: `head_vacant` is a house that is ALIVE and leaderless (R22(b)), while
 * `house_empty` is the R18/R14 extreme where the roster itself is gone. The second
 * cannot produce an internal claimant and the grammar must not pretend otherwise.
 */
export const TITLE_VACANCY_KINDS = Object.freeze(['head_vacant', 'house_empty']);

/**
 * ⚠ CANDIDATE REGISTER (finite semantics; frozen only by the owner's pen) — the
 * vocabularies a claim may be made in. R22(a)'s own words supply five of the six;
 * `ladder` is the institutional default it names separately.
 *
 * These are CLAIM BASES, not outcomes: the basis says what a claimant argues FROM
 * (birth, a seat among peers, a temple's authority, a purse, a sword, a rung), which
 * is what makes a reeve's succession read differently from a guildmaster's while both
 * run on one machine.
 */
export const CLAIM_BASES = Object.freeze([
  'blood', 'council', 'faith', 'wealth', 'arms', 'ladder',
]);

/**
 * §817-Q11's join: the RULING_POWERS-derived government form → the claim vocabulary
 * its seat passes in. Every key is a member of `RULING_POWERS` and every value a
 * member of `CLAIM_BASES`; the pins assert both directions against the real producer,
 * because a table that agrees only with itself proves nothing.
 *
 *   autocrat        → `blood`   a lord's seat passes by birth. `LAW_PREFS_BY_ARCHETYPE`
 *                               gives the noble archetype `inheritance_rights` — the
 *                               estate's ONLY hereditary token, and it lands here.
 *   council         → `council` a seat among peers is taken by peers.
 *   theocracy       → `faith`   the temple's authority is the claim.
 *   merchant_league → `wealth`  the purse that holds the league holds the seat.
 *   criminal        → `arms`    `RULING_POWER_LENS.criminal.legitimacyNerve` is
 *                               'betrayal'; nothing about that seat passes lawfully.
 *   mixed           → `ladder`  no form implies a claim, so standing decides — the
 *                               same answer institutional heads get, which is why
 *                               there is no seventh basis for "unclear".
 *
 * @type {Readonly<Record<string, string>>}
 */
export const CLAIM_BASIS_BY_RULING_POWER = Object.freeze({
  autocrat: 'blood',
  council: 'council',
  theocracy: 'faith',
  merchant_league: 'wealth',
  criminal: 'arms',
  mixed: 'ladder',
});

/**
 * The vocabulary one title's claims are made in.
 *
 * ⛔ THE GOVERNMENT FORM TYPES THE RULING SEAT AND NOTHING ELSE (R22(a)). A guild head
 * in an autocracy does not pass by blood — it passes by standing. Reading the form for
 * a non-governing house would give a temple's succession the throne's vocabulary, which
 * is the "one vacancy shape" ruling misread as "one vacancy vocabulary".
 *
 * @param {Record<string, unknown>} faction
 * @returns {string} a member of `CLAIM_BASES`
 */
export function claimBasisFor(faction) {
  if (faction?.isGoverning !== true) return 'ladder';
  const power = rulingPowerFromArchetype(
    factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (faction)),
  );
  // `rulingPowerFromArchetype` already fails soft to 'mixed', so an unrecognised
  // archetype lands on `ladder` through the table rather than through a second guard.
  return CLAIM_BASIS_BY_RULING_POWER[power] || 'ladder';
}

/**
 * The named figures who may claim a house's head rung, strongest claim first.
 *
 * Ranked by LADDER STANDING (importance band, high first), ties broken by the
 * YEARNER MARK, and remaining ties by codepoint on the figure's own key so the same
 * world produces the same order of claimants on every device.
 *
 * ⚠ ANYONE ALREADY AT THE HEAD BAND IS NOT A CLAIMANT — they would BE the head, and a
 * house with such a member has no vacancy for this module to report. The filter is
 * therefore unreachable through `readTitularVacancies`; it is here so a caller that
 * asks about an occupied title gets an empty list rather than a nonsense one.
 *
 * @param {{npcs?: Array<Record<string, unknown>>}|null|undefined} settlement
 * @param {Record<string, unknown>} faction
 * @param {string|null|undefined} tier
 * @returns {Array<{key: string, name: string, importance: string, isYearner: boolean, standing: number}>}
 */
export function claimantsFor(settlement, faction, tier) {
  // The head band comes from the ONE rung mapping — the same table `isHeadRungVacant`
  // decides vacancy from — so "who is not the head" can never drift away from "is the
  // head rung vacant". Two readings of one table, never two tables.
  const headIdx = importanceIndex(rungBandsForTier(tier).head);
  return factionRosterOf(settlement, faction)
    .map(npc => ({
      key: String(npc?.id || npc?.name || ''),
      name: String(npc?.name || npc?.id || ''),
      importance: String(npc?.importance || 'minor'),
      isYearner: String(npc?.[RUNG_ROLE_FIELD] || '') === 'yearner',
      standing: importanceIndex(npc?.importance),
    }))
    .filter(c => c.key && c.standing < headIdx)
    .sort((a, b) => (b.standing - a.standing)
      || (Number(b.isYearner) - Number(a.isYearner))
      || compareCodepoint(a.key, b.key));
}

/**
 * READ every title in a settlement (§810.7 R22) — the census and the open vacancies
 * in one pass.
 *
 * Returns a NO-OP shape under the dormant default (v1): the vacancy-plus-yearner
 * pattern is Register VII's, so a world born under the old law has no titles for this
 * reading to be about. Returning empty rather than a census that "happens to pass"
 * keeps a v1 red structurally impossible — `factionLifecycle.js`'s own discipline.
 *
 * @param {{
 *   tier?: unknown,
 *   config?: Record<string, unknown>,
 *   npcs?: Array<Record<string, unknown>>,
 *   powerStructure?: {factions?: Array<Record<string, unknown>>}|null,
 * }|null|undefined} settlement
 * @param {{tick?: number|null}} [opts]
 * @returns {{
 *   governed: boolean,
 *   census: Array<{key: string, scope: string, claimBasis: string, occupied: boolean, rosterSize: number}>,
 *   vacancies: Array<{
 *     scope: string, kind: string, factionKey: string, claimBasis: string, tier: string|null,
 *     rosterSize: number, tick: number|null,
 *     claimants: Array<{key: string, name: string, importance: string, isYearner: boolean, standing: number}>,
 *   }>,
 * }}
 */
export function readTitularVacancies(settlement, opts = {}) {
  const config = settlement?.config || {};
  const factions = Array.isArray(settlement?.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : [];
  if (!rollsRegisterVii(config)) return { governed: false, census: [], vacancies: [] };

  const tier = settlement?.tier ? String(settlement.tier) : null;
  const tick = opts.tick ?? null;
  const census = [];
  const vacancies = [];

  for (const faction of factions) {
    const key = seatKey(faction);
    const roster = factionRosterOf(settlement, faction);
    const scope = faction?.isGoverning === true ? 'ruling_seat' : 'faction_head';
    const claimBasis = claimBasisFor(faction);
    // ⭐ TWO KINDS, AND THE ORDER MATTERS. An empty roster is reported as `house_empty`
    // even though its head rung is also vacant: the grammar must know there can be no
    // internal claimant, and `head_vacant` would let it look for one.
    const kind = roster.length === 0
      ? 'house_empty'
      : (isHeadRungVacant(roster, tier) ? 'head_vacant' : null);

    census.push({ key, scope, claimBasis, occupied: kind === null, rosterSize: roster.length });
    if (!kind) continue;

    vacancies.push({
      scope,
      kind,
      factionKey: key,
      claimBasis,
      tier,
      rosterSize: roster.length,
      tick,
      claimants: claimantsFor(settlement, faction, tier),
    });
  }

  return { governed: true, census, vacancies };
}
