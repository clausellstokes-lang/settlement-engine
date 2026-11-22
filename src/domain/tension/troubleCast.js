/**
 * domain/tension/troubleCast.js — A CALM TOWN'S TROUBLE OF WEIGHT, AND THREE PEOPLE ON ITS THREE SIDES (FRAME-1, the
 * seventh chair's CF1–CF6; the owner, 2026-11-20: "Do it pre deploy. I like it. But make sure there is variability of
 * who is relevant to a crisis where appropriate"; FRAME-2 · B2, the chair's CF1 as amended and CF11, final; the owner,
 * 2026-11-20: "A calm town should be as it currently is. Just a collection of people without a central issue if there is
 * none. Don't invent drama capitalize on what's already there if it's there.").
 *
 * The sibling, for a standing trouble, of crisis/crisisCast.js (docs/DESIGN_CRISIS_TAB.md), with one difference that
 * is the whole of CF2: NOTHING IS STORED. The cast is derived AT RENDER from the record by pure rules; no field is
 * written, nothing changes at generation, and so no stored town and no golden moves.
 *
 *   THE TROUBLE (CF11): ONLY a TROUBLE OF WEIGHT, a tension of `history.currentTensions` ABOUT a graded strain the town
 *   holds (`troubleOfWeight`, below: the seat under real pressure, two powers in a high conflict, a material strain short
 *   of a crisis, a hall in criminal hands with a live crime wave). Among those, the one whose strain has the highest grade, the record's own order breaking a tie. A town
 *   with none casts NO frame and keeps today's sheet byte for byte. The tension's `severity` is not read (it is the
 *   template's list, FRAME-1 measured it).
 *
 *   ITS SIDES: the tension's three `factions`, each classed by its template label (sideArchetypes.js) and filled
 *   through its archetype's LADDER: office, a tie on the record that speaks of the matter, trade, an outsider reached
 *   through a person who would know them, the criminal power. Facts first (a side the generator wrote as a POWER'S
 *   NAME stands for that power's head; a criminal side stands for the criminal power where the roster holds one), then
 *   the hash of the seed, the tension's type and the side against the kind's rate (FRAME_TUNING), then the first kind
 *   the town can fill. CAPS: one side of a trouble by office alone; the seat-holder fronts one side at most; nobody
 *   holds two sides; a person an active crisis's cast holds keeps that role (is never put on a side).
 *
 * ⛔ NOTHING IS INVENTED. Every name is a person (or a house) on the record; an outsider is never named, only reached
 * through a person on it; every reason is one of FRAME_REASONS, filled from the record; a side no rule fills is ABSENT
 * and says so in its own words. No placeholder name, ever.
 *
 * ⛔ THE SHARE VEIL (CF3). The cast needs the record's generation seed (`_seed`), which every shared projection
 * strips (display/publicSafe.js :: toPublicSafe, the gallery's and the party link's posture): on a record without it
 * no trouble is cast, so no page built from a shared record can draw the frame. Fail closed.
 *
 * Pure: no store, no React, no I/O, no rng.
 */

import { castHash } from '../crisis/crisisCast.js';
import { factionArchetype } from '../factionArchetypes.js';
import { crimeSignalOf } from '../crimeSignal.js';
import { governingFactionOf } from '../rulingPower.js';
import { rulingChainOf } from '../dossier/powerStrata.js';
import { isOfficeStandIn } from '../dossier/seatHolder.js';
import { membersByRank } from '../people/membership.js';
import { powerNameInProse } from '../display/governanceAccount.js';
import { coupContenders } from '../rulingPowerCoup.js';
import { governanceLedger } from '../governanceLedger.js';
import { FOOD_SECURITY_BANDS, LEGITIMACY_CUTS } from '../../data/bandLadders.js';
import { ARCHETYPE_LADDER, FRAME_TUNING, GENERATOR_REPLACED_SIDES, LODGING_HOUSE, SIDE_ARCHETYPE, TROUBLE_MATTER, TROUBLE_MATTER_DEFAULT } from './sideArchetypes.js';

/**
 * @typedef {import('./sideArchetypes.js').SideArchetype} SideArchetype
 * @typedef {import('./sideArchetypes.js').FaceKind} FaceKind
 * @typedef {{ id?: unknown, name?: unknown, role?: unknown, title?: unknown, gender?: unknown, power?: unknown,
 *   category?: unknown, ousted?: unknown, temporary?: unknown, plotHooks?: unknown, secret?: unknown,
 *   institution?: unknown, memberships?: unknown }} FrameNpc
 * @typedef {{ faction?: unknown, category?: unknown, power?: unknown, isGoverning?: unknown, captureState?: unknown }} FramePower
 * @typedef {{ type?: unknown, description?: unknown, factions?: unknown, plotHooks?: unknown }} FrameTension
 * @typedef {{ from?: unknown, to?: unknown, typeName?: unknown, type?: unknown }} FrameTie
 * @typedef {{ _seed?: unknown, name?: unknown, npcs?: unknown, relationships?: unknown, stress?: unknown,
 *   history?: { currentTensions?: unknown } | null,
 *   powerStructure?: { factions?: unknown, conflicts?: unknown, publicLegitimacy?: unknown } | null,
 *   economicState?: { foodSecurity?: { label?: unknown } | null, activeChains?: unknown } | null }} FrameSettlement
 *
 * @typedef {Object} SideFace
 * @property {FaceKind} kind         the rung that filled the side
 * @property {'seat'|'head'|'member'|'commander'|'tie'|'hook'|'trade'|'criminal'|'criminalHouse'|'outsider'} rule the rule that fired
 * @property {string} [npcId]         the person standing there (absent for an outsider or a house)
 * @property {string} [name]          their name, or the house's name in prose for a criminal house
 * @property {string} [viaId]         for an outsider: the person they are reached through
 * @property {string} [viaName]
 * @property {string} reason          one of FRAME_REASONS, filled
 *
 * @typedef {Object} TroubleSide
 * @property {string} words           the side as the record holds it (a power's name in prose where it names one)
 * @property {string} label           its template label (the archetype's key)
 * @property {SideArchetype} archetype
 * @property {SideFace | null} face   null where no rule fills it
 *
 * @typedef {Object} TroubleFrame
 * @property {string} type            the tension's template type
 * @property {number} at              its place in `history.currentTensions`
 * @property {string} line            the record's own sentence for it
 * @property {string[]} hooks         its own hooks, as the record holds them
 * @property {TroubleSide[]} sides
 * @property {WeightStrain['strain']} strain the strain its weight is read on (FRAME-8 · F3, the chair's ruling of 22:02 UTC: the
 *                                    sheet's Facts read it; derived, never stored)
 */

/**
 * THE REASONS (CF6): the closed set of words a face stands on its side with, in the page's own register. `{they}`,
 * `{their}` and `{them}` read the person's own `gender` (a person carries it from birth); a verb written `[owes|owe]`
 * takes its first form after "she" or "he", its second after "they". `{other}`, `{power}` and `{house}` are names
 * from the record.
 */
export const FRAME_REASONS = Object.freeze({
  seat: 'because {they} [holds|hold] the seat',
  head: 'because {they} [heads|head] {power}',
  // FRAME-6 · F1 (the chair, 2026-11-20 15:35): a power's own member, not its head, on that power's row
  member: 'because {they} [is|are] one of {power}',
  commander: 'because {they} [commands|command] {power}',
  debtor: 'because {they} [owes|owe] {other} a debt not yet paid',
  creditor: 'because {other} owes {them} a debt not yet paid',
  tie: 'because {they} and {other} {gloss}',
  hook: 'because {their} own trouble is part of it',
  trade: 'because the trouble touches {their} trade',
  criminal: 'because {they} [heads|head] {power}, which works outside the law',
  criminalHouse: 'it works outside the law, and no one in it is named here',
  outsider: 'not named here; {other} keeps the {house}, where strangers lodge, and would know of them',
});

/**
 * The tie's words after "{they} and {other}", by its archetype label (data/npcData.js); a tie not listed reads `tieDefault`.
 * FRAME-2 · B4 (CF9): `tieDefault` lives here, in the closed set, with the rest (it was a loose literal); "Mentor and
 * Successor" reads "teacher and pupil", never "heir": the record names a successor only where the place can pass
 * (npcData.js :: mentor_legacy, BAR4 TI1), and this rule reads the tie's label alone.
 */
export const FRAME_TIE_GLOSS = Object.freeze(/** @type {Record<string, string>} */ ({
  'Financial Dependence': 'are tied by money, one depending on the other',
  'Silent Partnership': 'are partners in something neither will name',
  'The Patron No One Names': 'are bound by a patronage no one names',
  'Corrupt Arrangement': 'are in a crooked arrangement together',
  'Held Over Them': 'are bound by something one holds over the other',
  'Active Suppression': 'are at open odds, one working to shut the other down',
  'Mentor and Successor': 'are teacher and pupil',
  'Family Complication': 'are family, and it is not simple',
  'Professional Rivalry': 'are rivals, and neither gives the other ground',
  'Unresolved History': 'share a past neither has put behind them',
  'Outstanding Debt': 'are tied by a debt not yet paid',
  tieDefault: 'are closely tied',
}));

/**
 * THE TIES OF STANDING (FRAME-6 · F1, the chair's ruling of 2026-11-20 15:35): the kinds of tie, by the record's own
 * `relationships[].type`, through which a person who is no member of a power may stand on that power's row, because they
 * stand WITH one of its members: an alliance (`ally`), respect (`respect`), teacher and pupil (`mentor_student`), family
 * (`family`), a patron and the one they keep (`patron_client`). Never a rivalry (`rival`), an enmity (`enemy`), leverage
 * (`political`, the record's "Mutual Leverage") or a debt one holds over the other (`debtor_creditor`).
 * @type {ReadonlyArray<string>}
 */
export const FRAME_STANDING_TIES = Object.freeze(['ally', 'respect', 'mentor_student', 'family', 'patron_client']);

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {number} */
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
/** @param {FrameNpc} n @returns {string} */
const idOf = (n) => str(n.id) || str(n.name);
/** @param {FramePower} f @returns {string} */
const powerName = (f) => str(f.faction);

/**
 * Fill a reason for a person: their pronouns and the verb forms after them, then the named slots.
 * @param {string} text @param {FrameNpc | null} npc @param {Record<string, string>} [slots] @returns {string}
 */
export function fillReason(text, npc, slots = {}) {
  const g = str(npc?.gender).toLowerCase();
  const p = g === 'female' ? { they: 'she', their: 'her', them: 'her' } : g === 'male' ? { they: 'he', their: 'his', them: 'him' } : { they: 'they', their: 'their', them: 'them' };
  const plural = p.they === 'they';
  return text
    .replace(/\[([^|\]]+)\|([^\]]+)\]/g, (_, one, many) => (plural ? many : one))
    .replace(/\{(they|their|them)\}/g, (_, k) => /** @type {Record<string, string>} */ (p)[k])
    .replace(/\{(\w+)\}/g, (whole, k) => (Object.hasOwn(slots, k) ? slots[k] : whole));
}

/**
 * THE GRADES OF A STRAIN OF WEIGHT, sharpest first (CF11). Two grades in one row are one grade.
 *   - `legitimacy-below-30` and `seat-ungated`: legitimacy below the Contested cut (LEGITIMACY_CUTS.contested, the gates'
 *     own read: governanceLedger, as politicalFractureGate makes it), or the incumbent UNGATED (coupContenders: a full
 *     field of three challengers and the ruler's amplified case below the weakest of them). The ungated seat stands
 *     with below 30 because of what resolveCoupVerdict makes of it: pHold 0.08, "the seat falls; only the heir is in
 *     question", under the 0.1 floor of every gated contest: the gravest read the record has of the seat.
 *   - `legitimacy-below-45`: legitimacy below the Tolerated cut (LEGITIMACY_CUTS.tolerated).
 *   - `high-conflict`: a row of `powerStructure.conflicts` at intensity `high` (never `moderate`, never a relationship).
 *   - `food-below-secure`, `creditor-power`, `impaired-chain`: food security below Secure, a creditor power on the roster,
 *     an `impaired` chain in `economicState.activeChains`. (The first two stay though no calm town holds them today.)
 *   - `hall-captured` (FRAME-5 · CF12, the chair's CF11 amended): a power of the roster at `captureState` `corrupted` or
 *     `capture` (`HALL_TAKEN`). Its OWN LAST ROW, the weakest: a town another strain already opens keeps that opening, and
 *     every other town's grade ranks as before.
 * @type {ReadonlyArray<ReadonlyArray<string>>}
 */
export const WEIGHT_GRADES = Object.freeze([
  Object.freeze(['legitimacy-below-30', 'seat-ungated']),
  Object.freeze(['legitimacy-below-45']),
  Object.freeze(['high-conflict']),
  Object.freeze(['food-below-secure', 'creditor-power', 'impaired-chain']),
  Object.freeze(['hall-captured']),
]);

/**
 * WHAT A TENSION IS ABOUT, by its matter (CF11's closed lists).
 *   seat      the types about the seat under pressure (W1); `corruption_scandal` is about it ONLY where its own sides name
 *             the ruling power (the template's sentence is "Evidence of official corruption has surfaced but powerful
 *             figures resist investigation", and the generator writes its first side, "Corrupt officials", as the
 *             governing power's name: historyGenerator.js :: substituteNames; on the 330 calm towns, 17 of 17 stored
 *             scandals name it so. The officials are the ruling body's own; a scandal whose sides do not name the seat
 *             is not read as one about it).
 *   material  the types about a material strain short of a crisis (W3); never `guild_conflict`, never
 *             `economic_disparity`.
 *   hall      the types about a hall in criminal hands (W4, FRAME-5 · CF12): the crime wave alone. Its sides are the
 *             watch, those who would take the law into their own hands, and the criminal power (sideArchetypes.js), and
 *             the frame casts them as it casts every trouble's (the ladder, the hash, the caps; nothing new is drawn).
 * A tension is about a high conflict (W2) by its SIDES, not its type: BOTH of the row's two powers are sides of it (FRAME-2
 * · B9, the chair's ruling of 2026-11-20: "its sides are the powers of W2", read as written; a conflict over an unrelated
 * issue, with only one of its powers a side, carries no trouble).
 */
export const WEIGHT_MATTER = Object.freeze({
  seat: Object.freeze(['legitimacy_crisis', 'succession_crisis', 'leadership_vacuum', 'tyranny', 'popular_uprising']),
  seatWhereItNamesTheRuler: Object.freeze(['corruption_scandal']),
  material: Object.freeze(['trade_collapse', 'trade_dispute', 'resource_scarcity', 'outside_debt', 'market_crash']),
  hall: Object.freeze(['crime_wave']),
});

/**
 * THE HALL IN CRIMINAL HANDS (W4): the rungs of the capture ladder at or above `corrupted` (corruption.js ::
 * CAPTURE_LADDER, the ladder worldPulse/factionCapture.js climbs), read on `powerStructure.factions[].captureState`. Held
 * here as the ladder's own words and pinned to it by tests/domain/tension/troubleWeight.test.js, so the sheet's closure
 * does not reach corruption.js and its tuning tables. Every public projection deletes the field (display/publicSafe.js),
 * so a public record holds no W4: a second lock, never the first (the audience gate, summary/tonightSheet.js, is the
 * first; the DM layer of a shared read keeps the field, and there the missing seed is the second lock).
 * @type {ReadonlyArray<string>}
 */
export const HALL_TAKEN = Object.freeze(['corrupted', 'capture']);

/**
 * A creditor power as the record marks it: by its name, the only mark the record gives (the two powers the `indebted`
 * stress pushes onto the roster, generators/power/stressFactions.js, are the only names that carry the word; B1's read).
 */
const CREDITOR_POWER = /\bcreditor/i;

/** The food bands below Secure, by the one ladder's own labels (data/bandLadders.js). */
const FOOD_BELOW_SECURE = Object.freeze([FOOD_SECURITY_BANDS.pressured, FOOD_SECURITY_BANDS.importDependent,
  FOOD_SECURITY_BANDS.deficit, FOOD_SECURITY_BANDS.famine].map((b) => b.label));

/** A side or a power's name, compared as B1 read them: lower case, a leading "the " dropped. @param {unknown} v */
const sideKey = (v) => str(v).toLowerCase().replace(/^the\s+/, '');

/** @param {string} grade @returns {number} its row in WEIGHT_GRADES (0 the sharpest) */
const gradeRank = (grade) => WEIGHT_GRADES.findIndex((row) => row.includes(grade));

/**
 * @typedef {Object} WeightStrain
 * @property {'W1' | 'W2' | 'W3' | 'W4'} strain  the seat under pressure, two powers in a high conflict, a material strain,
 *                                        a hall in criminal hands
 * @property {string} grade              one of WEIGHT_GRADES
 * @property {string[]} [powers]          for W2: the conflict's two powers, as the record names them
 */

/**
 * THE TROUBLE OF WEIGHT (CF11): among the town's tensions ABOUT a strain it holds, the one whose strain has the highest
 * grade, the record's order breaking a tie; null where the town holds no strain, or no tension is about one it holds.
 * @param {FrameSettlement | null | undefined} settlement
 * @returns {{ tension: FrameTension, at: number, strain: WeightStrain } | null}
 */
export function troubleOfWeight(settlement) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const list = /** @type {FrameTension[]} */ (arr(s.history?.currentTensions))
    .map((tension, at) => ({ tension, at }))
    .filter(({ tension }) => !!tension && typeof tension === 'object' && str(tension.type) && arr(tension.factions).some((f) => str(f)));
  if (!list.length) return null;
  const ps = s.powerStructure || {};
  // W1: the seat under real pressure (legitimacy below 45 ALONE is not weight: only a tension about the seat makes it so)
  const legitimacy = governanceLedger(/** @type {never} */ (s)).legitimacyScore;
  const coup = coupContenders(/** @type {never} */ (s));
  const seat = legitimacy < LEGITIMACY_CUTS.contested ? 'legitimacy-below-30'
    : coup.incumbent.gated === false ? 'seat-ungated'
      : legitimacy < LEGITIMACY_CUTS.tolerated ? 'legitimacy-below-45' : '';
  const ruler = sideKey(coup.incumbent.name);
  // W2: two powers in a recorded conflict at intensity high, a tension about it only where both are its sides
  const high = /** @type {Array<{ parties?: unknown, intensity?: unknown }>} */ (arr(ps.conflicts))
    .filter((r) => !!r && typeof r === 'object' && r.intensity === 'high' && arr(r.parties).filter((p) => str(p)).length === 2);
  // W3: a material strain short of a crisis
  const material = FOOD_BELOW_SECURE.includes(str(s.economicState?.foodSecurity?.label)) ? 'food-below-secure'
    : powersOf(s).some((f) => CREDITOR_POWER.test(powerName(f))) ? 'creditor-power'
      : arr(s.economicState?.activeChains).some((c) => /** @type {{ status?: unknown }} */ (c)?.status === 'impaired') ? 'impaired-chain' : '';
  // W4: a hall in criminal hands
  const hall = powersOf(s).some((f) => HALL_TAKEN.includes(str(f.captureState))) ? 'hall-captured' : '';

  /** @type {{ tension: FrameTension, at: number, strain: WeightStrain } | null} */
  let best = null;
  for (const { tension, at } of list) {
    const type = str(tension.type);
    const sides = arr(tension.factions).map(sideKey);
    /** @type {WeightStrain[]} */
    const about = [];
    if (seat && (WEIGHT_MATTER.seat.includes(type) || (WEIGHT_MATTER.seatWhereItNamesTheRuler.includes(type) && !!ruler && sides.includes(ruler)))) {
      about.push({ strain: 'W1', grade: seat });
    }
    const row = high.find((r) => arr(r.parties).every((p) => sides.includes(sideKey(p))));
    if (row) about.push({ strain: 'W2', grade: 'high-conflict', powers: arr(row.parties).map(str) });
    if (material && WEIGHT_MATTER.material.includes(type)) about.push({ strain: 'W3', grade: material });
    if (hall && WEIGHT_MATTER.hall.includes(type)) about.push({ strain: 'W4', grade: hall });
    if (!about.length) continue;
    const strain = about.reduce((a, b) => (gradeRank(b.grade) < gradeRank(a.grade) ? b : a));
    if (!best || gradeRank(strain.grade) < gradeRank(best.strain.grade)) best = { tension, at, strain };
  }
  return best;
}

/**
 * The template label a side came from: the side's own words where they are a label the table classes, else the label the
 * generator wrote over at that place (a power's name or its fallback words at birth: `GENERATOR_REPLACED_SIDES`).
 * Reads no template table, so the sheet's closure does not reach data/historyData.js.
 * @param {string} type @param {number} at @param {string} words @returns {string}
 */
export function templateLabelOf(type, at, words) {
  if (Object.hasOwn(SIDE_ARCHETYPE, words)) return words;
  const replaced = /** @type {Record<string, Readonly<Record<number, string>>>} */ (GENERATOR_REPLACED_SIDES)[type];
  return replaced && Object.hasOwn(replaced, at) ? replaced[at] : '';
}

/** @param {FrameSettlement} s @returns {FrameNpc[]} the live roster */
function rosterOf(s) {
  return /** @type {FrameNpc[]} */ (arr(s.npcs)).filter((n) => !!n && typeof n === 'object' && !n.temporary && !n.ousted && !!str(n.name) && !isOfficeStandIn(/** @type {never} */ (n)));
}

/** @param {FrameSettlement} s @returns {FramePower[]} */
function powersOf(s) {
  return /** @type {FramePower[]} */ (arr(s.powerStructure?.factions)).filter((f) => !!f && typeof f === 'object' && !!powerName(f));
}

/** The people an active crisis's cast already holds (they keep that role). @param {FrameSettlement} s @returns {Set<string>} */
function crisisHeld(s) {
  const entries = Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [];
  return new Set(entries.flatMap((e) => arr(/** @type {{ cast?: { roles?: unknown } }} */ (e)?.cast?.roles))
    .filter((r) => /** @type {{ kind?: unknown }} */ (r)?.kind === 'npc').map((r) => str(/** @type {{ id?: unknown }} */ (r).id)));
}

/** A person's own words that may speak of the trouble: their hooks and their secret. @param {FrameNpc} n @returns {string} */
function ownWordsOf(n) {
  const secret = typeof n.secret === 'object' && n.secret ? /** @type {{ what?: unknown }} */ (n.secret).what : n.secret;
  return [...arr(n.plotHooks).map(str), str(secret)].join(' ');
}

/** A person's trade as the record writes it: role, title, house. @param {FrameNpc} n @returns {string} */
function tradeWordsOf(n) {
  const inst = typeof n.institution === 'object' && n.institution ? /** @type {{ key?: unknown, family?: unknown }} */ (n.institution) : {};
  return [str(n.role), str(n.title), str(inst.key), str(inst.family)].join(' | ');
}

/** The house a keeper keeps, as the record names it (its article is FRAME_REASONS.outsider's). @param {FrameNpc} n @returns {string} */
function houseOf(n) {
  const inst = typeof n.institution === 'object' && n.institution ? /** @type {{ key?: unknown }} */ (n.institution) : {};
  return str(inst.key).replace(/\s*\([^)]*\)\s*$/, '').toLowerCase();
}

/**
 * THE OUTSIDER RUNG (an outsider is never named, only reached through the keeper of a house where strangers lodge): the
 * live roster's people whom `free` admits, strongest first and then roster order, whose role, title or house (key or
 * family) names a house where strangers lodge (`LODGING_HOUSE`) and whose house the record names; each with the house in
 * the record's own wording. The frame chooses among them by its hash, after its other sides have taken their people. The
 * crisis page's copy (crisis/crisisPage.js :: lodgingKeeperOf, which may not import this module: the veil test's "one
 * door") takes the first; tests/domain/crisis/crisisKeeperBothDoors.test.js holds the two together (FRAME-6 · P1BF).
 * @param {FrameSettlement} s
 * @param {(n: FrameNpc) => boolean} [free] who may stand; by default, nobody an active crisis's cast holds
 * @returns {Array<{ npc: FrameNpc, keeper: string, house: string }>}
 */
export function lodgingKeepersOf(s, free) {
  const held = free ? null : crisisHeld(s);
  const may = free || ((/** @type {FrameNpc} */ n) => !(/** @type {Set<string>} */ (held)).has(idOf(n)));
  return rosterOf(s).map((n, i) => ({ n, i })).sort((a, b) => (num(b.n.power) - num(a.n.power)) || (a.i - b.i)).map(({ n }) => n)
    .filter((n) => may(n) && LODGING_HOUSE.test(tradeWordsOf(n)) && !!houseOf(n))
    .map((n) => ({ npc: n, keeper: str(n.name), house: houseOf(n) }));
}

/**
 * @typedef {{ npc?: FrameNpc, power?: FramePower, via?: FrameNpc, rule: SideFace['rule'], slots?: Record<string, string> }} Candidate
 */

/**
 * Cast the sides of a town's trouble of weight (CF11). Null where the record holds none (the town keeps today's sheet),
 * or no seed (CF3).
 * @param {FrameSettlement | null | undefined} settlement
 * @returns {TroubleFrame | null}
 */
export function castTroubleFrame(settlement) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const seed = str(s._seed);
  if (!seed) return null; // CF3: a shared projection carries no seed, so no frame
  const weighty = troubleOfWeight(s);
  if (!weighty) return null;
  const { tension, at, strain } = weighty;
  const type = str(tension.type);
  const matter = TROUBLE_MATTER[type] || TROUBLE_MATTER_DEFAULT;
  const roster = rosterOf(s);
  const byId = new Map(roster.map((n) => [idOf(n), n]));
  const powers = powersOf(s);
  const held = crisisHeld(s);
  const seatName = str(rulingChainOf(/** @type {never} */ (s)).npc?.name);
  const seat = roster.find((n) => str(n.name) === seatName) || null;
  const governing = /** @type {FramePower | null} */ (governingFactionOf(/** @type {never} */ (s)));
  const ties = /** @type {FrameTie[]} */ (arr(s.relationships)).filter((t) => !!t && typeof t === 'object' && matter.ties.includes(str(t.typeName)));
  const byPower = (/** @type {number} */ a, /** @type {number} */ b) => b - a;
  const standing = /** @type {FrameTie[]} */ (arr(s.relationships)).filter((t) => !!t && typeof t === 'object' && FRAME_STANDING_TIES.includes(str(t.type)));

  /** @type {Set<string>} */
  const used = new Set();
  let officeUsed = 0;
  let seatUsed = 0;

  /** May this person stand on a side now? @param {FrameNpc | undefined} n */
  const free = (n) => !!n && !used.has(idOf(n)) && !held.has(idOf(n)) && !(seat && idOf(n) === idOf(seat) && seatUsed >= FRAME_TUNING.seatSidesMax);
  /** The head of a power: its first by rank. @param {FramePower} f */
  const headOf = (f) => membersByRank(roster, powerName(f))[0];
  /** Strongest first, then roster order. @param {FrameNpc[]} list */
  const strongest = (list) => list.map((n, i) => ({ n, i })).sort((a, b) => byPower(num(a.n.power), num(b.n.power)) || (a.i - b.i)).map(({ n }) => n);

  /**
   * The candidates for one kind on one side.
   * @param {FaceKind} kind @param {SideArchetype} archetype @returns {Candidate[]}
   */
  const candidatesOf = (kind, archetype) => {
    if (kind === 'office') {
      if (officeUsed >= FRAME_TUNING.officeSidesMax) return [];
      if (archetype === 'authority') return seat && free(seat) ? [{ npc: seat, rule: 'seat' }] : [];
      const archOf = (/** @type {FramePower} */ f) => factionArchetype(/** @type {never} */ (f));
      const notGoverning = (/** @type {FramePower} */ f) => !governing || powerName(f) !== powerName(governing);
      /** @type {string[]} */
      const wanted = archetype === 'enforcer' ? ['military']
        : archetype === 'faithful' ? ['religious']
          : archetype === 'profiteer' ? ['merchant']
            : archetype === 'establishment' ? [...matter.office]
              : archetype === 'reformer' ? ['civic', 'labor', 'religious', 'arcane']
                : archetype === 'challenger' ? ['noble', 'merchant', 'craft', 'labor', 'religious', 'arcane', 'civic'] : [];
      const fit = powers.filter((f) => wanted.includes(archOf(f)) && (archetype === 'challenger' || archetype === 'reformer' ? notGoverning(f) : true))
        .sort((a, b) => byPower(num(a.power), num(b.power)));
      // a side that presses against the seat is never fronted by the seat's own people
      const ofSeat = (/** @type {FrameNpc | undefined} */ n) => !!n && ((!!seat && idOf(n) === idOf(seat)) || (!!governing && membersByRank([n], powerName(governing)).length > 0));
      const against = archetype === 'challenger' || archetype === 'reformer';
      return fit.map((f) => ({ f, n: headOf(f) })).filter(({ n }) => free(n) && !(against && ofSeat(n)))
        .map(({ f, n }) => ({ npc: n, power: f, rule: /** @type {SideFace['rule']} */ (archOf(f) === 'military' ? 'commander' : 'head'), slots: { power: powerNameInProse(powerName(f)) } }));
    }
    if (kind === 'tie') {
      /** @type {Candidate[]} */
      const out = [];
      for (const t of ties) {
        const from = byId.get(str(t.from));
        const to = byId.get(str(t.to));
        if (!from || !to) continue;
        const debt = str(t.typeName) === 'Outstanding Debt';
        /** @type {Array<[FrameNpc, FrameNpc, SideFace['rule'], string]>} */
        const ends = debt
          ? (archetype === 'payer' || archetype === 'blamed' || archetype === 'authority' ? [[from, to, 'tie', FRAME_REASONS.debtor]]
            : archetype === 'profiteer' || archetype === 'creditor' ? [[to, from, 'tie', FRAME_REASONS.creditor]] : [])
          : [[from, to, 'tie', FRAME_REASONS.tie], [to, from, 'tie', FRAME_REASONS.tie]];
        for (const [who, other, rule, reason] of ends) {
          if (free(who)) out.push({ npc: who, rule, slots: { other: str(other.name), gloss: FRAME_TIE_GLOSS[str(t.typeName)] || FRAME_TIE_GLOSS.tieDefault, reasonText: reason } });
        }
      }
      if (['payer', 'blamed', 'middle', 'challenger', 'reformer'].includes(archetype)) {
        for (const n of strongest(roster)) if (free(n) && matter.words.test(ownWordsOf(n))) out.push({ npc: n, rule: 'hook' });
      }
      return out;
    }
    if (kind === 'trade') {
      return strongest(roster).filter((n) => free(n) && matter.trade.test(tradeWordsOf(n))).map((n) => ({ npc: n, rule: /** @type {SideFace['rule']} */ ('trade') }));
    }
    if (kind === 'criminal') {
      // the crime fact through its home leaf (crimeSignal.js): the criminal powers the roster seats
      const seated = new Set(crimeSignalOf({ seats: powers, estate: [] }).powerNames);
      const crooks = powers.filter((f) => seated.has(powerName(f)) && num(f.power) >= FRAME_TUNING.criminalMinPower)
        .sort((a, b) => byPower(num(a.power), num(b.power)));
      return crooks.map((f) => {
        const head = headOf(f);
        /** @type {Candidate} */
        const c = head && free(head)
          ? { npc: head, power: f, rule: /** @type {SideFace['rule']} */ ('criminal'), slots: { power: powerNameInProse(powerName(f)) } }
          : { power: f, rule: /** @type {SideFace['rule']} */ ('criminalHouse'), slots: {} };
        return c;
      }).filter((c) => c.npc || !used.has(`power:${powerName(/** @type {FramePower} */ (c.power))}`));
    }
    // outsider: never named; reached through the keeper of a house where strangers lodge
    return lodgingKeepersOf(s, free)
      .map((k) => ({ via: k.npc, rule: /** @type {SideFace['rule']} */ ('outsider'), slots: { other: k.keeper, house: k.house } }));
  };

  /**
   * FRAME-6 · F1: the free people of the live roster who are no member of a power and stand WITH one of its members by
   * a tie of standing (FRAME_STANDING_TIES), the members by rank and each member's ties in the record's order; each once,
   * standing by that tie (FRAME_REASONS.tie, the member named).
   * @param {FrameNpc[]} members the power's members, by rank @returns {Candidate[]}
   */
  const standingTiedTo = (members) => {
    const inPower = new Set(members.map(idOf));
    /** @type {Candidate[]} */
    const out = [];
    for (const m of members) {
      for (const t of standing) {
        const otherId = str(t.from) === idOf(m) ? str(t.to) : str(t.to) === idOf(m) ? str(t.from) : '';
        const who = otherId ? byId.get(otherId) : undefined;
        if (!who || inPower.has(idOf(who)) || !free(who) || out.some((c) => c.npc === who)) continue;
        out.push({ npc: who, rule: 'tie', slots: { other: str(m.name), gloss: FRAME_TIE_GLOSS[str(t.typeName)] || FRAME_TIE_GLOSS.tieDefault, reasonText: FRAME_REASONS.tie } });
      }
    }
    return out;
  };

  /** @param {Candidate} c @param {FaceKind} kind @returns {SideFace} */
  const take = (c, kind) => {
    if (c.npc) used.add(idOf(c.npc));
    if (c.power && !c.npc) used.add(`power:${powerName(c.power)}`);
    if (c.via) used.add(idOf(c.via));
    if (kind === 'office') officeUsed += 1;
    if (c.npc && seat && idOf(c.npc) === idOf(seat)) seatUsed += 1;
    const slots = c.slots || {};
    const text = slots.reasonText || /** @type {Record<string, string>} */ (FRAME_REASONS)[c.rule];
    const reason = fillReason(text, c.npc || null, slots);
    return {
      kind, rule: c.rule, reason,
      ...(c.npc ? { npcId: idOf(c.npc), name: str(c.npc.name) } : {}),
      ...(!c.npc && c.power ? { name: powerNameInProse(powerName(c.power), true) } : {}),
      ...(c.via ? { viaId: idOf(c.via), viaName: str(c.via.name) } : {}),
    };
  };

  const sides = arr(tension.factions).map(str).slice(0, 3).map((raw, i) => {
    const label = templateLabelOf(type, i, raw);
    const archetype = SIDE_ARCHETYPE[label];
    const named = powers.find((f) => powerName(f) === raw);
    const words = named ? powerNameInProse(raw, true) : raw ? raw[0].toUpperCase() + raw.slice(1) : '';
    return { i, raw, label, archetype, named, words };
  });

  /** @type {TroubleSide[]} */
  const out = [];
  // The side that holds the office is cast first, so the seat stands where the record puts it; the sides print in the
  // record's order.
  const castOrder = [...sides].sort((a, b) => (Number(b.archetype === 'authority') - Number(a.archetype === 'authority')) || (a.i - b.i));
  for (const side of castOrder) {
    if (!side.archetype) { out[side.i] = { words: side.words, label: side.label, archetype: /** @type {SideArchetype} */ ('middle'), face: null }; continue; }
    const ladder = ARCHETYPE_LADDER[side.archetype];
    const rates = /** @type {Partial<Record<FaceKind, number>>} */ (FRAME_TUNING.rates[side.archetype]);
    const key = `${type}`;
    /** @type {SideFace | null} */
    let face = null;
    // FACTS FIRST: the town decides who CAN stand by each rung. A side the record writes as a power's name is filled by
    // office only by that power's head; a criminal side stands for the criminal power wherever one is strong enough (on a
    // side that IS a power, that power itself: FRAME-6 · F1).
    if (side.archetype === 'criminal') {
      const criminalCandidates = candidatesOf('criminal', side.archetype);
      const c = criminalCandidates.find((x) => !side.named || (!!x.power && powerName(x.power) === powerName(side.named)));
      if (c) face = take(c, 'criminal');
    }
    /** @param {FaceKind} kind @returns {Candidate[]} */
    const listOf = (kind) => {
      if (kind !== 'office' || !side.named) return candidatesOf(kind, side.archetype);
      const f = side.named;
      const head = headOf(f);
      if (officeUsed >= FRAME_TUNING.officeSidesMax || !free(head) || factionArchetype(/** @type {never} */ (f)) === 'criminal') return [];
      const rule = factionArchetype(/** @type {never} */ (f)) === 'military' ? 'commander' : (seat && head && idOf(head) === idOf(seat) ? 'seat' : 'head');
      return [{ npc: head, power: f, rule: /** @type {SideFace['rule']} */ (rule), slots: { power: powerNameInProse(powerName(f)) } }];
    };
    // FRAME-6 · F1 (the chair, 2026-11-20 15:35): A SIDE THAT IS A POWER takes its ladder IN ORDER, and the hash chooses
    // only within a rung: its own free office-holder; then its own free member (not its head, who stands by office or
    // not at all: F2 below); then a person tied to one of its live members by a tie of standing (FRAME_STANDING_TIES).
    // A person with no membership and no such tie never stands on a power's row, whatever their trade.
    if (!face && side.named) {
      const f = side.named;
      const members = membersByRank(roster, powerName(f));
      const head = headOf(f);
      /** @type {Array<{ kind: FaceKind, list: Candidate[] }>} */
      const rungs = [
        { kind: 'office', list: listOf('office') },
        { kind: 'member', list: members.filter((n) => free(n) && n !== head).map((n) => ({ npc: n, power: f, rule: /** @type {SideFace['rule']} */ ('member'), slots: { power: powerNameInProse(powerName(f)) } })) },
        { kind: 'tie', list: standingTiedTo(members) },
      ];
      const fired = rungs.find((x) => x.list.length);
      if (fired) {
        const at = fired.kind === 'office' ? 0 : Math.floor(castHash(seed, key, `${side.i}:${fired.kind}:who`) * fired.list.length);
        face = take(fired.list[at], fired.kind);
      }
      out[side.i] = { words: side.words, label: side.label, archetype: side.archetype, face };
      continue;
    }
    // THEN THE HASH against the rate, rung by rung; then the first rung the town can fill at all. Office takes the
    // first by rank; a tie, a trade or a keeper is chosen among the eligible by the hash (no draw).
    /** @type {Array<{ kind: FaceKind, list: Candidate[] }>} */
    const open = face ? [] : ladder.map((kind) => ({ kind, list: listOf(kind) })).filter((x) => x.list.length);
    if (!face) {
      const fired = open.find(({ kind }) => castHash(seed, key, `${side.i}:${kind}`) < (rates[kind] ?? 0)) || open[0];
      if (fired) {
        const at = fired.kind === 'office' ? 0 : Math.floor(castHash(seed, key, `${side.i}:${fired.kind}:who`) * fired.list.length);
        face = take(fired.list[at], fired.kind);
      }
    }
    out[side.i] = { words: side.words, label: side.label, archetype: side.archetype, face };
  }

  // FRAME-6 · F2 (the chair, 2026-11-20 15:35): AN EMPTY SIDE YIELDS BEFORE THE CAPS. Once every side is cast, a side that
  // IS a power and stands empty takes that power's first live person by rank whom no side and no crisis holds, even one
  // the record names by role (an office stand-in, off the roster the rungs read) and even beyond `officeSidesMax`: the
  // head by office (or as the criminal power's head), another by membership.
  const alive = /** @type {FrameNpc[]} */ (arr(s.npcs)).filter((n) => !!n && typeof n === 'object' && !n.temporary && !n.ousted && !!str(n.name));
  for (const side of castOrder) {
    const f = side.named;
    if (!f || out[side.i]?.face) continue;
    const people = membersByRank(alive, powerName(f));
    const who = people.find((n) => !used.has(idOf(n)) && !held.has(idOf(n)));
    if (!who) continue;
    const arch = factionArchetype(/** @type {never} */ (f));
    const slots = { power: powerNameInProse(powerName(f)) };
    /** @type {[FaceKind, SideFace['rule']]} */
    const [kind, rule] = who !== people[0] ? ['member', 'member']
      : arch === 'criminal' ? ['criminal', 'criminal']
        : ['office', arch === 'military' ? 'commander' : seat && idOf(who) === idOf(seat) ? 'seat' : 'head'];
    out[side.i] = { ...out[side.i], face: take({ npc: who, power: f, rule, slots }, kind) };
  }

  return {
    type,
    at,
    line: str(tension.description),
    hooks: arr(tension.plotHooks).map(str).filter(Boolean).slice(0, FRAME_TUNING.hookCount),
    sides: out,
    strain: strain.strain,
  };
}
