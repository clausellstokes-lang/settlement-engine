/**
 * domain/crisis/crisisCast.js — WHO A CRISIS TOUCHES, DERIVED, NEVER INVENTED.
 *
 * The design is docs/DESIGN_CRISIS_TAB.md (the owner, 2026-11-03: "Do it"). A crisis is a
 * singular event; its stress-container entry is its one record, and this module writes the
 * record's one new field, `cast`: the nature of the kind, the roles assigned to EXISTING people
 * (or houses, or institutions) with the rule that fired for each, a stake for every faction,
 * the institutions the crisis turns on, and the escalation the catalog already names.
 *
 * ⭐ THE TOWN IS CAST, NOT THE CRISIS. `deriveCrisisCast` takes every active entry, in the
 * engine's own severity order (the caller passes them ranked; `generateStress` already sorts
 * by `STRESS_SEVERITY_WEIGHT`, which lives on the generator side of the layering boundary),
 * and casts them worst first: a person never holds two roles of a contradictory pair across
 * the crises; the occasional roles are capped per town; one temporary person at most; and a
 * crisis the catalog links to an earlier one reads that earlier cast.
 *
 * ⛔ NO RANDOM DRAW. The occasional roles are chosen by a hash of the seed, the crisis id and
 * the role against the rate in `CRISIS_CAST_TUNING`, so nothing else's draw order moves. The
 * one exception, the temporary person's name, is minted by the CALLER (the pipeline step)
 * through the `mintTemporary` option; this module only says that one is needed.
 *
 * Every rule is total: when nothing matches, the role is absent and `absent` says why. No
 * row ever carries a placeholder name.
 *
 * Pure: no store, no React, no I/O, no rng.
 */

import { STRESSOR_CATALOG } from '../worldPulse/stressorsCore.js';
import { GEN_TO_PULSE_TYPE } from '../stressorPicker.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { governingFactionOf } from '../rulingPower.js';
import { outrankingRivalOf, rulingChainOf } from '../dossier/powerStrata.js';
import { isOfficeStandIn, seatHouseFaceOf } from '../dossier/seatHolder.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { partitionDefenseInstitutions } from '../institutions/defenseInstitutionBuckets.js';
import { factsOf } from '../facts/factsOf.js';
import { TIER_WORDS } from '../facts/factVocabulary.js';
import { resolveSibling } from '../facts/drawDeclared.js';
import { CAST_EDIT_PATH, CAST_EDIT_SEPARATOR } from '../userEditLines.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { firstRankMembershipOf, membersByRank, membershipsOf, powerOrderOf } from '../people/membership.js';
import { allegianceOf } from '../people/allegiance.js'; // ALLEGIANCE-CAR1: the hidden allegiance's one reader (J-1)
import { isSeatVacant } from '../people/seatKeeper.js'; // ROUND THREE item 4: the empty seat's one home

// ── The tuning (the owner's dials; docs/DESIGN_CRISIS_TAB.md "Open for the owner's veto") ──

/**
 * The five occasional-role rates and the per-town caps. A rate is the share of the crises of
 * the role's nature that carry the role; WHICH crisis is decided by `castHash`, never a draw.
 */
export const CRISIS_CAST_TUNING = Object.freeze({
  rates: Object.freeze({
    exploiter: 1 / 3,
    scapegoat: 1 / 4,
    waverer: 1 / 2,
    profiteer: 1 / 3,
    collaborator: 1 / 2,
  }),
  townCaps: Object.freeze({
    exploiter: 1,
    scapegoat: 1,
    profiteer: 1,
    collaborator: 1,
    temporary: 1,
  }),
});

// ── The vocabulary ────────────────────────────────────────────────────────────────────────

/** @typedef {'natural' | 'social' | 'engineered' | 'external'} CrisisNature */
/**
 * @typedef {'brunt' | 'lever' | 'exploiter' | 'scapegoat' | 'instigator' | 'target' | 'waverer'
 *   | 'collaborator' | 'defender' | 'treater' | 'face' | 'profiteer'} CrisisRole
 */

/** The nature of each kind: a property of the kind, not a draw. */
export const CRISIS_NATURE = Object.freeze(/** @type {Record<string, CrisisNature>} */ ({
  famine: 'natural',
  plague_onset: 'natural',
  mass_migration: 'natural',
  monster_pressure: 'natural',
  politically_fractured: 'social',
  succession_void: 'social',
  insurgency: 'social',
  slave_revolt: 'social',
  religious_conversion: 'social',
  recently_betrayed: 'social',
  infiltrated: 'engineered',
  under_siege: 'external',
  occupied: 'external',
  wartime: 'external',
  indebted: 'external',
}));

/** The role names as the page prints them. */
export const CRISIS_ROLE_LABEL = Object.freeze(/** @type {Record<CrisisRole, string>} */ ({
  brunt: 'bears the brunt',
  lever: 'holds the lever',
  exploiter: 'exploits it',
  scapegoat: 'takes the fall',
  instigator: 'instigator',
  target: 'target',
  waverer: 'wavers',
  collaborator: 'collaborates',
  defender: 'defends',
  treater: 'would treat',
  face: "the occupier's local face",
  profiteer: 'profits',
}));

/** Every role the vocabulary holds, in the page's order. */
export const CRISIS_ROLES = Object.freeze(/** @type {CrisisRole[]} */ (Object.keys(CRISIS_ROLE_LABEL)));

/** Pairs no one person holds across the crises of one town. */
export const CONTRADICTORY_ROLE_PAIRS = Object.freeze(/** @type {Array<readonly [CrisisRole, CrisisRole]>} */ ([
  Object.freeze(/** @type {const} */ (['exploiter', 'brunt'])),
  Object.freeze(/** @type {const} */ (['instigator', 'target'])),
  Object.freeze(/** @type {const} */ (['defender', 'collaborator'])),
  Object.freeze(/** @type {const} */ (['profiteer', 'brunt'])),
  Object.freeze(/** @type {const} */ (['scapegoat', 'instigator'])),
]));

/** The roles a crisis of each nature must try to fill (external varies by kind; see below). */
const REQUIRED_BY_NATURE = Object.freeze(/** @type {Record<CrisisNature, CrisisRole[]>} */ ({
  natural: ['brunt', 'lever'],
  social: ['instigator', 'target'],
  engineered: ['instigator'],
  external: [],
}));

/** The external kinds' required roles, kind by kind (the design's table). */
const REQUIRED_EXTERNAL = Object.freeze(/** @type {Record<string, CrisisRole[]>} */ ({
  under_siege: ['defender', 'treater'],
  wartime: ['defender'],
  indebted: ['treater'],
  occupied: ['face'],
}));

/** The occasional roles by nature; a kind-specific gate narrows collaborator to occupation. */
const OCCASIONAL_BY_NATURE = Object.freeze(/** @type {Record<CrisisNature, Array<keyof typeof CRISIS_CAST_TUNING.rates>>} */ ({
  natural: ['exploiter', 'scapegoat'],
  social: ['waverer', 'scapegoat'],
  engineered: ['collaborator'],
  external: ['profiteer', 'collaborator'],
}));

/** The fixed reason vocabulary. Every `reason` on the record is one of these sentences, or its declared defence-free sibling (`CAST_REASON_SIBLINGS`, at the end of this file; F10, CENSUS-1c). */
export const CAST_REASONS = Object.freeze({
  bruntBase: Object.freeze(/** @type {Record<string, string>} */ ({
    food_security: 'the hunger falls first on its people',
    labor_capacity: 'its people do the work the crisis needs most',
    trade_connectivity: 'its trade is cut',
    defense_readiness: 'its people stand on the walls',
    public_legitimacy: 'the blame falls on the house, and its good name pays for the crisis', // SW-6 (B3): never "it" for a person
    healing_capacity: 'its people tend the sick',
    tax_revenue: 'its income dries up first',
    housing_pressure: 'its people take in the newcomers',
    social_trust: 'its people stop trusting their neighbours',
    faction_stability: 'its own ranks begin to split',
    law_order: 'its people keep an order that is failing',
    criminal_opportunity: 'its streets are where the crime lands',
  })),
  // SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 A1, R1–R3): the fragments in the cast's own voice, no gender, no unread noun.
  bruntLeast: 'the one with the least say in the house the crisis hits',
  // ROUND THREE, ruling (c) (the chair, 2026-11-13; the cut's #11 #13 #53 #55): "the least say" presumes a house of
  // several. In a house of ONE the person is named as its only member; a person who also holds the crisis's lever
  // (the cut's #268) is named as one of the house, never as the one with the least say.
  bruntOnly: 'the only one in the house the crisis hits',
  bruntMember: 'one of the house the crisis hits',
  leverRuns: 'runs the office that decides how the crisis goes',
  leverInstitution: 'whoever runs it decides how the crisis goes, and nobody named here runs it',
  leverTemporary: 'nobody here could, so this one stepped in for the crisis',
  instigatorRival: 'already carries more weight than whoever holds the seat, and gains as the seat weakens',
  // SW-9b-B (E-3, URBAN-AUDIT §5; the chair's words, 02:2x, option C): a small name whose house the gaining power ranks by
  // its backing. A FIXED sentence: it names nobody (factionRename.js's law for this vocabulary), so no rename and no veil
  // reaches it. No draw.
  instigatorBacked: 'speaks for the power that gains from the crisis, from a house that power backs',
  instigatorGains: 'its power gains from the crisis',
  instigatorLinked: 'drawn from the house that bore the famine',
  targetSeat: 'holds the seat',
  targetSeatContested: 'holds the seat, and the right to it is already in dispute', // SW-6 second seat (B3): the rule's word "legitimacy" out
  targetGoverning: 'the governing house',
  targetLinked: "the occupation's resistance turns on its local face",
  exploiterCorrupt: 'corrupt, with ties to the underworld',
  exploiterTrait: 'grasping by nature, in a power that gains',
  exploiterPower: 'the strongest figure in a power that gains',
  exploiterLinked: "the siege's profiteer, still selling what the siege cut off",
  scapegoatSeat: 'holds the seat, and takes the blame while the right to it is in dispute', // SW-6 second seat (B3)
  scapegoatLever: 'runs the office the crisis turns on, and takes the blame while the seat is in dispute', // SW-6 second seat (B3): "the lever" is the engine's word
  defenderMilitary: 'leads the military',
  defenderOffice: "holds the garrison's office",
  defenderInstitution: "the town's defence, with no one on the roster leading it",
  defenderInstitutionPlace: 'the defence of the place, with no one named to lead it', // R2-CODE-B item 4: below the town tier
  treaterMerchant: 'a merchant, with the seat itself in dispute', // SW-6 second seat (B3): any member of a merchant house, so no "leads"
  // R2-CODE-B item 4 (the cold list REVIEW-W2A-3 #855: "Zuma Kanil · a merchant" for the master smith):
  // "a merchant" is said of the person, so only of one whose own role is trade (TRADE_ROLE); any other
  // member of the merchant power is named by the power, not by a trade the record does not give them.
  treaterMerchantMember: "a member of the merchants' power, with the seat itself in dispute",
  treaterSeat: 'holds the seat',
  collaboratorCorrupt: 'corrupt, with ties to the underworld',
  collaboratorAmbition: 'the most ambitious of a power that gains',
  collaboratorLinked: "the famine's exploiter, first to deal with the occupier",
  waverer: 'its power could go either way',
  face: 'leads the occupying power',
  nextInLine: 'next in line, the first choice already holding a role that contradicts this one',
  dm: "the DM's word",
});

/** The fixed absence vocabulary: why a role has no holder. */
export const CAST_ABSENCES = Object.freeze({
  noBase: "no house's base is hit",
  noLever: 'no house the crisis turns on stands here',
  noGains: 'no power gains',
  occupierOnly: "no local is named: none of the town's own powers gains", // R2-CODE-B-11, row 179: the collaborator is a local
  outsideHand: 'an outside hand, unnamed',
  noSeat: 'no seat or governing house stands',
  noMilitary: 'no military, garrison or watch stands',
  noMerchantOrSeat: 'no merchant house and no seat stands',
  noOccupier: 'no occupying power on the roster',
  noSplit: 'no power could go either way',
  notContested: 'legitimacy is not contested',
  noLoser: "neither the seat's house nor the lever's loses by it",
  townCap: 'the town already has one',
  noCandidate: 'everyone who could already holds a role that contradicts this one',
});

/** The stake reasons (rule 11). */
export const STAKE_REASONS = Object.freeze({
  gainsVacuum: 'the military gains in a vacuum of governance',
  gainsChurch: 'the church gains while the seat struggles',
  gainsMerchants: 'the merchants gain while the seat is endorsed',
  gainsCrime: 'crime gains from the disorder',
  gainsRival: 'already carries more weight than whoever holds the seat', // SW-6 (B3 C4): R3's fact, without the echo of "gains"
  gainsClaim: 'a rival claim to govern gains by it',
  gainsHolds: 'holds what the crisis makes scarce',
  gainsOccupier: 'the occupier gains by it',
  loses: 'its own people feel the crisis first', // SW-6 (B3 C4): "its base" was the rule's word
  losesSeat: 'the seat bears the blame',
  split: 'gains and loses by it at once',
  untouched: 'it could side with either camp', // SW-6 (B3 A·C4): the page's label says "no stake yet"
});

// ── The levers: the houses each kind turns on, and the faces that run them ─────────────────

/**
 * The institutions a kind turns on (by name). This is the lever table the design expected
 * `STRESS_INSTITUTION_EFFECTS` to be; that table holds NPC secrets, not institutions, so the
 * lever lives here (reported to the chair). The house's HOLDER is its face — the card born for
 * it (the people car, PEOPLE-2 CAST-DERIVED, 2026-11-07: one face per face-bearing house); the
 * old role-regex office table is gone with the faction roles (M-1b).
 * `temporary` names the kind of person minted when a natural kind's lever has neither a house
 * nor a face; the same kind serves two crises (one temporary person per town).
 */
export const CRISIS_LEVERS = Object.freeze(/** @type {Record<string, { house: RegExp, temporary: string | null }>} */ ({
  famine: { house: /granar|market|mill|baker|storehouse|warehouse/i, temporary: 'grain' },
  plague_onset: { house: /healer|hospital|apothec|infirm|hospice|temple|church|shrine/i, temporary: 'healer' },
  mass_migration: { house: /almshouse|hospital|hospice|healer|temple|church|inn/i, temporary: 'healer' },
  monster_pressure: { house: /watch|garrison|militia|guard|barracks|wall|ranger|palisade/i, temporary: 'warden' },
  under_siege: { house: /wall|garrison|barracks|watch|militia|guard|palisade|granar/i, temporary: null },
  wartime: { house: /barracks|garrison|militia|armou?r|smith|watch|guard/i, temporary: null },
  occupied: { house: /garrison|council|court|barracks|watch|hall/i, temporary: null },
  indebted: { house: /mint|customs|bank|money|treasury|exchequer|counting/i, temporary: null },
  politically_fractured: { house: /council|court|hall|assembly/i, temporary: null },
  succession_void: { house: /council|court|hall|keep|palace|manor/i, temporary: null },
  insurgency: { house: /council|court|hall|watch|customs/i, temporary: null },
  slave_revolt: { house: /slave|mine|quarr|plantation|watch|guard/i, temporary: null },
  religious_conversion: { house: /temple|church|shrine|chapel|cathedral|monaster/i, temporary: null },
  recently_betrayed: { house: /council|court|watch|hall/i, temporary: null },
  infiltrated: { house: /watch|guard|court|council|customs/i, temporary: null },
}));

// ── The base each affected system hits (rule 1) ───────────────────────────────────────────

const A = FACTION_ARCHETYPES;

/** Which faction archetypes each affected system hits, and which roles touch that base. */
const SYSTEM_BASE = Object.freeze(/** @type {Record<string, { archetypes: string[], governing?: boolean, role: RegExp }>} */ ({
  food_security: { archetypes: [A.LABOR, A.CIVIC, A.CRAFT], role: /farm|baker|miller|grain|butcher|fisher|herd|cook|labou?r/i },
  labor_capacity: { archetypes: [A.CRAFT, A.LABOR], role: /smith|mason|carpent|weaver|tanner|labou?r|craft|apprentice|miner/i },
  trade_connectivity: { archetypes: [A.MERCHANT], role: /merchant|trader|factor|carter|carrier|broker|innkeep/i },
  defense_readiness: { archetypes: [A.MILITARY], role: /guard|soldier|sergeant|watch|militia|captain|archer/i },
  public_legitimacy: { archetypes: [A.GOVERNMENT], governing: true, role: /clerk|official|council|magistrate|steward|reeve|collector|mayor/i },
  faction_stability: { archetypes: [A.GOVERNMENT], governing: true, role: /clerk|official|council|steward|reeve/i },
  tax_revenue: { archetypes: [A.GOVERNMENT], governing: true, role: /collector|clerk|treasurer|steward/i },
  healing_capacity: { archetypes: [A.RELIGIOUS], role: /healer|priest|acolyte|physician|herbal|midwife/i },
  housing_pressure: { archetypes: [A.LABOR, A.CIVIC], role: /labou?r|innkeep|builder|mason|almoner/i },
  law_order: { archetypes: [A.MILITARY], role: /guard|watch|sergeant|constable/i },
  social_trust: { archetypes: [A.CIVIC, A.RELIGIOUS], role: /priest|elder|innkeep|healer/i },
  criminal_opportunity: { archetypes: [], role: /^$/ },
}));

/** The greed and ambition slots of the personality register (rule 5, rule 9). */
export const GRASPING_TRAITS = Object.freeze(['greedy', 'self-serving', 'corrupt', 'envious', 'opportunistic', 'ambitious', 'calculating']);
const AMBITION_TRAITS = Object.freeze(['ambitious', 'opportunistic', 'calculating', 'self-serving']);

// ── Linked kinds (the catalog's spread channels and residual effects) ─────────────────────

/**
 * How a later crisis reads an earlier one. `via` is the catalog token that carries the link
 * (a spread channel or residual effect of the EARLIER kind; a test holds each to the catalog).
 * @type {ReadonlyArray<{ from: string, to: string, via: string, read: 'instigatorFromBrunt' | 'targetFromFace' | 'exploiterFromProfiteer' | 'collaboratorFromExploiter' }>}
 */
export const CRISIS_LINKS = Object.freeze([
  Object.freeze({ from: 'famine', to: 'insurgency', via: 'hoarding_grievance', read: /** @type {const} */ ('instigatorFromBrunt') }),
  Object.freeze({ from: 'occupied', to: 'insurgency', via: 'resistance_cells', read: /** @type {const} */ ('targetFromFace') }),
  Object.freeze({ from: 'under_siege', to: 'famine', via: 'trade_route', read: /** @type {const} */ ('exploiterFromProfiteer') }),
  Object.freeze({ from: 'famine', to: 'occupied', via: 'trade_dependency', read: /** @type {const} */ ('collaboratorFromExploiter') }),
]);

// ── Types ─────────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} CastRow
 * @property {CrisisRole} role
 * @property {'npc' | 'faction' | 'institution'} kind
 * @property {string} id      the NPC id, the faction's name, or the institution's name
 * @property {string} name
 * @property {string} reason  one sentence from CAST_REASONS
 * @property {boolean} temporary
 */
/** @typedef {{ role: CrisisRole, reason: string }} CastAbsence */
/** @typedef {{ factionId: string, stake: 'gains' | 'loses' | 'split', reason: string }} CastStake */
/** @typedef {{ institution: string, holderId: string | null, holderName: string | null }} CastLever */
/**
 * @typedef {Object} CrisisCast
 * @property {CrisisNature} nature
 * @property {number} rank          1 for the worst crisis, in casting order
 * @property {CastRow[]} roles
 * @property {CastAbsence[]} absent
 * @property {CastStake[]} stakes
 * @property {CastLever[]} levers
 * @property {{ residualEffects: string[] }} ifNothingIsDone   the entry's own viabilityNote is the line; these are the catalog's residues
 * @property {string[]} playersSeeFirst  the Tonight sheet's two facts, by reference
 * @property {string[]} links           the earlier crises this one reads, by kind
 */
/**
 * @typedef {Object} CastNpc
 * @property {string=} id
 * @property {string=} name
 * @property {string=} role
 * @property {unknown=} power
 * @property {Array<{ power: string, rank: 1 | 2 | 3 | null, share?: number }>=} memberships
 * @property {{ kind?: string, key?: string, title?: string } | null=} institution
 * @property {Record<string, unknown> | null=} allegiance the hidden allegiance (ALLEGIANCE-CAR1), read through allegianceOf
 * @property {{ dominant?: string | null, flaw?: string | null, modifier?: string | null } | null=} personality
 * @property {boolean=} temporary
 * @property {string=} temporaryKind
 * @property {string[]=} crisisIds
 * @property {unknown=} ousted
 */
/** @typedef {{ faction?: string, name?: string, category?: string, power?: unknown, isGoverning?: boolean }} CastFaction */
/**
 * @typedef {Object} CastSettlement
 * @property {string=} tier
 * @property {CastNpc[]=} npcs
 * @property {Array<{ name?: string, status?: string }>=} institutions
 * @property {{ factions?: CastFaction[], governingName?: string, publicLegitimacy?: { isContested?: boolean, isLegitimacyCrisis?: boolean } | null }=} powerStructure
 */
/** @typedef {{ type?: string, label?: string }} CastEntry */
/**
 * @typedef {Object} CastOptions
 * @property {(kind: string, crisisId: string) => ({ id: string, name: string } | null)=} mintTemporary
 *   the caller's mint for a temporary person; absent → the role is absent with its reason
 */

// ── Small readers ─────────────────────────────────────────────────────────────────────────

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');
/** @param {unknown} v @returns {number} */
const numOf = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
/** @param {CastFaction} f @returns {string} */
const factionName = (f) => str(f.faction) || str(f.name);

/**
 * A deterministic fraction in [0, 1) over the seed, the crisis id and the role (FNV-1a).
 * @param {string} seed @param {string} crisisId @param {string} role
 * @returns {number}
 */
export function castHash(seed, crisisId, role) {
  const text = `${seed}|${crisisId}|${role}`;
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h / 4294967296;
}

/** @param {CastNpc} n @returns {string[]} */
function traitsOf(n) {
  const p = n.personality || {};
  return [str(p.dominant), str(p.flaw), str(p.modifier)].filter(Boolean).map((t) => t.toLowerCase());
}

/**
 * The live roster: no temporary person, nobody ousted, and no office stand-in ("The Watch
 * Captain" names an office, not a person; the ruling chain refuses one for the same reason).
 * @param {CastSettlement} s @returns {CastNpc[]}
 */
function rosterOf(s) {
  return (Array.isArray(s.npcs) ? s.npcs : [])
    .filter((n) => !!n && typeof n === 'object' && !n.temporary && !n.ousted && !!str(n.name) && !isOfficeStandIn(/** @type {never} */ (n)));
}

/**
 * An occupying power. The generator files its "Occupation Authority" under the military
 * category, so the archetype alone (category first) misses it; the name decides too.
 * @param {CastFaction} f @returns {boolean}
 */
function isOccupier(f) {
  return factionArchetype(f) === A.OCCUPATION || /occupation|occupying|garrison\s+rule|imperial\s+presence|annex/i.test(factionName(f));
}

/**
 * Does this house already hold the seat: the governing house, or a criminal house holding it by
 * capture (rulingStructure.js stamps `criminalCaptureState`; factionDynamics.js "is a front")?
 * @param {CastSettlement} s @param {CastFaction} f @returns {boolean}
 */
function holdsTheSeat(s, f) {
  const governing = governingFactionOf(/** @type {never} */ (s));
  if (governing && factionName(/** @type {CastFaction} */ (governing)) === factionName(f)) return true;
  const captured = /** @type {{ criminalCaptureState?: unknown }} */ (s.powerStructure || {}).criminalCaptureState === 'capture';
  return captured && factionArchetype(f) === A.CRIMINAL;
}

/** @param {CastSettlement} s @returns {CastFaction[]} */
function factionsOf(s) {
  const fs = s.powerStructure?.factions;
  return (Array.isArray(fs) ? fs : []).filter((f) => !!f && typeof f === 'object' && !!factionName(f));
}

/**
 * A power's members: the faces holding a membership in it, ORDERED BY RANK — its first, second
 * and third, then the unranked in roster order (the people car, PEOPLE-2 CAST-DERIVED,
 * 2026-11-07: the owner's "each NPC according to their institution, belongs to one or more
 * powers now"; the shim's `factionAffiliation` is no longer read here).
 * @param {CastSettlement} s @param {string} fname
 */
function membersOf(s, fname) {
  return membersByRank(rosterOf(s), fname);
}

/** True when the card holds a membership in any power of `powers`. @param {CastNpc} n @param {Set<string>} powers */
function memberOfAny(n, powers) {
  return membershipsOf(n).some((m) => powers.has(m.power));
}

/** @param {CastNpc} n @param {CrisisRole} role @param {string} reason @returns {CastRow} */
function npcRow(n, role, reason) {
  return { role, kind: 'npc', id: str(n.id) || str(n.name), name: str(n.name), reason, temporary: !!n.temporary };
}
/** @param {CastFaction} f @param {CrisisRole} role @param {string} reason @returns {CastRow} */
function factionRow(f, role, reason) {
  const name = factionName(f);
  return { role, kind: 'faction', id: name, name, reason, temporary: false };
}

/** @param {CastSettlement} s */
function legitimacyContested(s) {
  const pl = s.powerStructure?.publicLegitimacy;
  return !!pl && (!!pl.isContested || !!pl.isLegitimacyCrisis);
}

/** @param {string} kind @returns {{ spreadChannels: string[], residualEffects: string[], affectedSystems: string[] }} */
export function catalogFor(kind) {
  const pulse = /** @type {Record<string, string>} */ (GEN_TO_PULSE_TYPE)[kind] || kind;
  const def = /** @type {Record<string, { spreadChannels?: string[], residualEffects?: string[], affectedSystems?: string[] }>} */ (/** @type {unknown} */ (STRESSOR_CATALOG))[pulse];
  return {
    spreadChannels: def?.spreadChannels ? [...def.spreadChannels] : [],
    residualEffects: def?.residualEffects ? [...def.residualEffects] : [],
    affectedSystems: def?.affectedSystems ? [...def.affectedSystems] : [],
  };
}

/** The nature of a kind; an unknown (custom) kind reads as social. @param {string} kind @returns {CrisisNature} */
export function natureOf(kind) {
  return CRISIS_NATURE[kind] || 'social';
}

// ── Rule 11: stakes ───────────────────────────────────────────────────────────────────────

/**
 * Every faction's one stake in a crisis of `kind`.
 * @param {CastSettlement} s @param {string} kind
 * @returns {CastStake[]}
 */
export function deriveStakes(s, kind) {
  const factions = factionsOf(s);
  const governing = governingFactionOf(/** @type {never} */ (s));
  const govName = governing ? factionName(/** @type {CastFaction} */ (governing)) : '';
  const rival = outrankingRivalOf(/** @type {never} */ (s)) || '';
  const pl = s.powerStructure?.publicLegitimacy || {};
  const systems = catalogFor(kind).affectedSystems;
  const nature = natureOf(kind);
  const scarce = kind === 'famine' ? /grain|food|granar|harvest/i : kind === 'plague_onset' ? /heal|apothec|physic/i : null;
  // ROUND THREE item 4 (the cut's #864 "Grain Holders gains · holds what the crisis makes scarce" where the city granaries'
  // face sits in another power): a power HOLDS what the crisis makes scarce only where one of its members faces a house of
  // that kind (the record's `institution.key`), never by its name alone. A refused reason falls to the next rule; no draw.
  /** @param {string} fname */
  const holdsScarce = (fname) => !!scarce && membersOf(s, fname).some((n) => n.institution?.kind === 'house' && scarce.test(str(n.institution?.key)));
  // ROUND THREE item 4 (the increment's rows on rpf-town-succession_void-13, rpf-village-succession_void-13): where the
  // seat stands empty (people/seatKeeper.js :: isSeatVacant) no one holds it, so the rival is not said to outweigh its
  // holder: its stake is the rival claim to govern (`gainsClaim`).
  const seatEmpty = isSeatVacant(s);
  return factions.map((f) => {
    const name = factionName(f);
    const arch = factionArchetype(f);
    const isGov = name === govName;
    /** @type {string | null} */
    let gains = null;
    if (isOccupier(f) && kind === 'occupied') gains = STAKE_REASONS.gainsOccupier;
    else if (scarce && scarce.test(name) && holdsScarce(name)) gains = STAKE_REASONS.gainsHolds;
    else if ((nature === 'social' || nature === 'engineered') && name === rival) gains = seatEmpty ? STAKE_REASONS.gainsClaim : STAKE_REASONS.gainsRival;
    else if (nature === 'social' && !isGov && arch === A.GOVERNMENT) gains = STAKE_REASONS.gainsClaim;
    else if (arch === A.CRIMINAL && (systems.includes('criminal_opportunity') || numOf(/** @type {{ crimMultiplier?: unknown }} */ (pl).crimMultiplier) > 1)) gains = STAKE_REASONS.gainsCrime;
    else if (arch === A.MILITARY && pl.isLegitimacyCrisis) gains = STAKE_REASONS.gainsVacuum;
    else if (arch === A.RELIGIOUS && (pl.isContested || pl.isLegitimacyCrisis)) gains = STAKE_REASONS.gainsChurch;
    else if (arch === A.MERCHANT && /** @type {{ isEndorsed?: boolean }} */ (pl).isEndorsed) gains = STAKE_REASONS.gainsMerchants;

    let loses = false;
    const occupierHere = kind === 'occupied' && isOccupier(f);
    for (const sys of occupierHere ? [] : systems) {
      const base = SYSTEM_BASE[sys];
      if (!base) continue;
      if ((base.governing && isGov) || base.archetypes.includes(arch)) { loses = true; break; }
    }
    const losesSeat = !loses && isGov && (nature === 'social' || nature === 'engineered');
    /** @type {CastStake} */
    let stake;
    if (gains && (loses || losesSeat)) stake = { factionId: name, stake: 'split', reason: STAKE_REASONS.split };
    else if (gains) stake = { factionId: name, stake: 'gains', reason: gains };
    else if (loses) stake = { factionId: name, stake: 'loses', reason: STAKE_REASONS.loses };
    else if (losesSeat) stake = { factionId: name, stake: 'loses', reason: STAKE_REASONS.losesSeat };
    else stake = { factionId: name, stake: 'split', reason: STAKE_REASONS.untouched };
    return stake;
  });
}

// ── The rules (each returns its candidates in order; the town caster takes the first fit) ──

/** @typedef {{ row: CastRow } | { absent: string }} RuleOut */
/** @typedef {{ candidates: CastRow[], absent: string }} Candidates */

/**
 * Ruling (c): the brunt's own words for a member of the house hit: "the least say" only in a house of more
 * than one; its only member is named as such. No draw; the candidates and their order are unchanged.
 * @param {ReadonlyArray<unknown>} members the house's members, the least powerful first
 * @returns {string}
 */
function leastSayOf(members) {
  return members.length > 1 ? CAST_REASONS.bruntLeast : CAST_REASONS.bruntOnly;
}

/**
 * Rule 1 — bears the brunt.
 * @param {CastSettlement} s @param {string} kind @param {CastStake[]} stakes
 * @returns {Candidates}
 */
export function bruntCandidates(s, kind, stakes) {
  const factions = factionsOf(s);
  const governing = governingFactionOf(/** @type {never} */ (s));
  const govName = governing ? factionName(/** @type {CastFaction} */ (governing)) : '';
  const losers = new Set(stakes.filter((k) => k.stake !== 'gains').map((k) => k.factionId));
  /** @type {CastRow[]} */
  const out = [];
  // F10 unit 4, CENSUS-1c: a reason that names walls the place lacks resolves to its declared sibling (CAST_REASON_SIBLINGS).
  const defence = castReasonOptions(s);
  for (const sys of catalogFor(kind).affectedSystems) {
    const base = SYSTEM_BASE[sys];
    if (!base) continue;
    const hit = factions.filter((f) => losers.has(factionName(f)) && ((base.governing && factionName(f) === govName) || base.archetypes.includes(factionArchetype(f))));
    for (const f of hit) {
      const members = membersOf(s, factionName(f)).reverse(); // the least powerful first
      const least = leastSayOf(members);
      const touching = members.filter((n) => base.role.test(str(n.role)));
      for (const n of touching) out.push(npcRow(n, 'brunt', resolveSibling(CAST_REASONS.bruntBase[sys] || least, BRUNT_SIBLINGS, defence)));
      for (const n of members) if (!touching.includes(n)) out.push(npcRow(n, 'brunt', least));
      out.push(factionRow(f, 'brunt', resolveSibling(CAST_REASONS.bruntBase[sys] || CAST_REASONS.bruntLeast, BRUNT_SIBLINGS, defence)));
    }
    if (out.length) break;
  }
  if (!out.length && factions.length === 1) {
    const f = factions[0];
    const members = membersOf(s, factionName(f)).reverse();
    for (const n of members) out.push(npcRow(n, 'brunt', leastSayOf(members)));
    out.push(factionRow(f, 'brunt', CAST_REASONS.bruntLeast));
  }
  return { candidates: out, absent: CAST_ABSENCES.noBase };
}

/**
 * A house's FACE on the live roster: the card born for it (`institution: { kind: 'house', key }`),
 * or null where the house bears no face (a market, a fabric row) or its face is gone.
 * @param {CastSettlement} s @param {string} house
 * @returns {CastNpc | null}
 */
function faceOfHouse(s, house) {
  if (!house) return null;
  // COHERENCE-POWERS (cure (i)): the seat's house where a house leads is faced by the leader (seatHolder.js)
  return rosterOf(s).find((n) => n.institution?.kind === 'house' && str(n.institution?.key) === house)
    || /** @type {CastNpc | null} */ (seatHouseFaceOf(/** @type {never} */ (s), house));
}

/**
 * The STANDING houses a kind turns on (`liveInstitutions`), each with its holder — the house's
 * face — where the roster has one.
 * @param {CastSettlement} s @param {string} kind
 * @returns {CastLever[]}
 */
export function deriveLevers(s, kind) {
  const lever = CRISIS_LEVERS[kind];
  if (!lever) return [];
  // The STANDING roster only (the ruin filter's one door): a calamity's ruin, an economic or
  // magic close, an abolition, an abandonment or a demotion leaves the row on the roster,
  // stamped, and a closed house holds no lever.
  // ⛔ A CUSTOM HOUSE IS NEVER A LEVER BY ITS NAME. The kind's house table is a native
  // catalog-name heuristic; a materialized custom institution's `name` is presentation only
  // (domain/content/customContentSemanticAuthority.js), so it is read through
  // `nativeSemanticName` exactly as the services generator reads it: a bespoke hall called
  // "State Granary" grants no famine lever.
  // ROUND THREE item 4 (record 375, the chair's ruling): an "Access to …" row ("Access to parish church", "Access to external
  // mill") is the town's road to another place's house, not a house here: it is never a lever.
  const houses = liveInstitutions(s)
    .filter((i) => !!i && !/^access to\b/i.test(str(i.name)) && lever.house.test(nativeSemanticName(i)));
  const seen = new Set();
  /** @type {CastLever[]} */
  const out = [];
  houses.forEach((h) => {
    const name = str(h.name);
    if (seen.has(name)) return;
    seen.add(name);
    const holder = faceOfHouse(s, name);
    out.push({ institution: name, holderId: holder ? (str(holder.id) || str(holder.name)) : null, holderName: holder ? str(holder.name) : null });
  });
  return out;
}

/**
 * Rule 2 — holds the lever: the lever house's face, else the house itself.
 * @param {CastSettlement} s @param {string} kind
 * @returns {Candidates}
 */
export function leverCandidates(s, kind) {
  const lever = CRISIS_LEVERS[kind];
  if (!lever) return { candidates: [], absent: CAST_ABSENCES.noLever };
  const levers = deriveLevers(s, kind);
  const byId = new Map(rosterOf(s).map((n) => [str(n.id) || str(n.name), n]));
  /** @type {CastRow[]} */
  const out = [];
  for (const l of levers) {
    const face = l.holderId ? byId.get(l.holderId) : null;
    if (face && !out.some((r) => r.id === l.holderId)) out.push(npcRow(face, 'lever', CAST_REASONS.leverRuns));
  }
  for (const l of levers) {
    out.push({ role: 'lever', kind: 'institution', id: l.institution, name: l.institution, reason: CAST_REASONS.leverInstitution, temporary: false });
  }
  return { candidates: out, absent: CAST_ABSENCES.noLever };
}

/**
 * Rule 3 — the instigator.
 * @param {CastSettlement} s @param {string} kind @param {CastStake[]} stakes
 * @returns {Candidates}
 */
export function instigatorCandidates(s, kind, stakes) {
  const nature = natureOf(kind);
  // An occupying power is never the town's own instigator (the design's "never a local
  // instigator"): a rising against the occupier is cast against it, not by it.
  // RUNG2-F13 (soak1k-4203): nor is a house that ALREADY holds the seat — the governing house, or
  // a criminal house that holds it by capture (`criminalCaptureState` 'capture': "the council is a
  // front") — an instigator against it: instigator and target are a contradictory pair.
  const factions = factionsOf(s).filter((f) => !isOccupier(f) && !holdsTheSeat(s, f));
  const rivalName = outrankingRivalOf(/** @type {never} */ (s));
  const rival = factions.some((f) => factionName(f) === rivalName) ? rivalName : null;
  const gainers = stakes.filter((k) => k.stake === 'gains')
    .map((k) => factions.find((f) => factionName(f) === k.factionId))
    .filter((f) => !!f)
    .sort((a, b) => numOf(/** @type {CastFaction} */ (b).power) - numOf(/** @type {CastFaction} */ (a).power));
  // ROUND THREE item 4: "already carries more weight than whoever holds the seat" only where someone holds it; under an
  // empty seat the rival is named by what it gains (`instigatorGains`), and so ONLY where its stake IS gains (the rival
  // claim, deriveStakes): a rival that gains and loses at once ('split') is no instigator by this rule there, and the
  // gainers follow in their own order (castDerived's "a power-drawn person holds a membership of that relation"). No draw.
  const seatEmpty = isSeatVacant(s);
  const rivalReason = seatEmpty ? CAST_REASONS.instigatorGains : CAST_REASONS.instigatorRival;
  const rivalGains = stakes.some((k) => k.factionId === rival && k.stake === 'gains');
  /** @type {Array<{ f: CastFaction, reason: string }>} */
  const picks = [];
  if (nature === 'engineered') {
    const g = /** @type {CastFaction[]} */ (gainers);
    const r = g.find((f) => factionName(f) === rival);
    if (r) picks.push({ f: r, reason: rivalReason });
    for (const f of g) if (f !== r) picks.push({ f, reason: CAST_REASONS.instigatorGains });
  } else {
    const r = rival && (!seatEmpty || rivalGains) ? factions.find((f) => factionName(f) === rival) : null;
    if (r) picks.push({ f: r, reason: rivalReason });
    for (const f of /** @type {CastFaction[]} */ (gainers)) if (f !== r) picks.push({ f, reason: CAST_REASONS.instigatorGains });
  }
  /** @type {CastRow[]} */
  const out = [];
  // MERGE-CAR (the car × rung-2 composition, the one-source rule): a card's HOUSE is its FIRST-RANK power (the people
  // car's shape, M-1b), so a member of an instigating house whose best standing is in a house that holds the seat acts
  // for the seat, and RUNG2-F13 refuses it as an instigator exactly as it refuses that house (coh:crisis-cast-sense's
  // plotter_governs, soak1k-21, -173, -231, -304, -358, -711, -891 at the merged tip).
  const order = powerOrderOf(s);
  const seatHouses = new Set(factionsOf(s).filter((f) => holdsTheSeat(s, f)).map(factionName));
  const actsForTheSeat = (/** @type {CastNpc} */ n) => seatHouses.has(str(firstRankMembershipOf(n, order)?.power));
  for (const { f, reason } of picks) {
    for (const n of membersOf(s, factionName(f))) if (!actsForTheSeat(n)) out.push(npcRow(n, 'instigator', smallNameBacked(n, f, gainers.includes(f)) ? CAST_REASONS.instigatorBacked : reason));
    out.push(factionRow(f, 'instigator', reason));
  }
  return { candidates: out, absent: nature === 'engineered' ? CAST_ABSENCES.outsideHand : CAST_ABSENCES.noGains };
}

/**
 * E-3 (URBAN-AUDIT §5, the chair's ruling; SW-9b-B): true for an instigator who is a SMALL NAME (card power 1-3), the
 * face of a house that holds a RANKED membership in the instigating power (the backing the people car wrote: the mill,
 * the opera house, the vintner at city scale), where that power gains from the crisis. Reads only; no draw.
 * @param {CastNpc} n @param {CastFaction} f @param {boolean} gains @returns {boolean}
 */
function smallNameBacked(n, f, gains) {
  const card = numOf(/** @type {{ power?: unknown }} */ (n).power);
  if (!gains || n.institution?.kind !== 'house' || !str(n.institution?.key)) return false;
  if (!(card > 0 && card <= 3)) return false; // a small name: card power 1-3 is "low" (URBAN-AUDIT §5's band)
  return membershipsOf(n).some((m) => m.power === factionName(f) && m.rank != null);
}

/**
 * The seat as a row: the named holder, else the governing house.
 * @param {CastSettlement} s @param {CrisisRole} role @param {string} seatReason @param {string} houseReason
 * @returns {CastRow[]}
 */
function seatRows(s, role, seatReason, houseReason) {
  /** @type {CastRow[]} */
  const out = [];
  const chain = rulingChainOf(/** @type {never} */ (s));
  if (chain.npc) {
    const n = rosterOf(s).find((x) => str(x.name) === chain.npc?.name);
    if (n) out.push(npcRow(n, role, seatReason));
  }
  const governing = governingFactionOf(/** @type {never} */ (s));
  if (governing) out.push(factionRow(/** @type {CastFaction} */ (governing), role, houseReason));
  return out;
}

/**
 * Rule 4 — the target: the seat, else the governing house.
 * @param {CastSettlement} s
 * @returns {Candidates}
 */
export function targetCandidates(s) {
  const seatReason = legitimacyContested(s) ? CAST_REASONS.targetSeatContested : CAST_REASONS.targetSeat;
  return { candidates: seatRows(s, 'target', seatReason, CAST_REASONS.targetGoverning), absent: CAST_ABSENCES.noSeat };
}

/**
 * Rule 5 — the exploiter (natural) or profiteer (external): a faction that gains, the corrupt
 * first, then the grasping by trait, then by power.
 * @param {CastSettlement} s @param {CastStake[]} stakes @param {'exploiter' | 'profiteer'} role
 * @returns {Candidates}
 */
export function exploiterCandidates(s, stakes, role) {
  const gainers = new Set(stakes.filter((k) => k.stake === 'gains').map((k) => k.factionId));
  const pool = rosterOf(s).map((n, at) => ({ n, at })).filter(({ n }) => memberOfAny(n, gainers));
  /** @param {CastNpc} n */
  const grade = (n) => (allegianceOf(n) ? 0 : traitsOf(n).some((t) => GRASPING_TRAITS.includes(t)) ? 1 : 2);
  pool.sort((a, b) => (grade(a.n) - grade(b.n)) || (numOf(b.n.power) - numOf(a.n.power)) || (a.at - b.at));
  const reasons = [CAST_REASONS.exploiterCorrupt, CAST_REASONS.exploiterTrait, CAST_REASONS.exploiterPower];
  return { candidates: pool.map(({ n }) => npcRow(n, role, reasons[grade(n)])), absent: CAST_ABSENCES.noGains };
}

/**
 * Rule 6 — the scapegoat: only under contested legitimacy; the seat, else the lever, whichever's
 * faction loses.
 * @param {CastSettlement} s @param {CastStake[]} stakes @param {CastRow | null} leverRow
 * @returns {Candidates}
 */
export function scapegoatCandidates(s, stakes, leverRow) {
  if (!legitimacyContested(s)) return { candidates: [], absent: CAST_ABSENCES.notContested };
  const losers = new Set(stakes.filter((k) => k.stake === 'loses').map((k) => k.factionId));
  const roster = rosterOf(s);
  /** A row's powers: a power row is its own; a person's are every power it holds a membership in. @param {CastRow} r */
  const losesBy = (r) => (r.kind === 'faction'
    ? losers.has(r.id)
    : memberOfAny(/** @type {CastNpc} */ (roster.find((n) => (str(n.id) || str(n.name)) === r.id) || {}), losers));
  /** @type {CastRow[]} */
  const out = seatRows(s, 'scapegoat', CAST_REASONS.scapegoatSeat, CAST_REASONS.scapegoatSeat)
    .filter((r) => r.kind === 'npc' && losesBy(r));
  if (leverRow && leverRow.kind === 'npc' && !leverRow.temporary && losesBy(leverRow)) {
    out.push({ ...leverRow, role: 'scapegoat', reason: CAST_REASONS.scapegoatLever });
  }
  return { candidates: out, absent: CAST_ABSENCES.noLoser };
}

/** The tier ladder, low to high (the vocabulary's own `tier` band, facts/factVocabulary.js :: TIER_WORDS). */
const TIER_ORDER = TIER_WORDS;

/** The defence buckets whose standing members defend the place (`defenseFacts.js :: defenceNames`'s own six). */
const DEFENDING_BUCKETS = Object.freeze(['walls', 'garrison', 'watch', 'militia', 'mercenary', 'charter']);

/**
 * Rule 7 — the defender.
 * @param {CastSettlement} s
 * @returns {Candidates}
 */
export function defenderCandidates(s) {
  /** @type {CastRow[]} */
  const out = [];
  for (const f of factionsOf(s).filter((x) => factionArchetype(x) === A.MILITARY)) {
    for (const n of membersOf(s, factionName(f))) out.push(npcRow(n, 'defender', CAST_REASONS.defenderMilitary));
  }
  for (const n of rosterOf(s).filter((x) => /captain|guard|watch|marshal|warden|sergeant|commander/i.test(str(x.role)))) {
    // F10 unit 4, CENSUS-1c: "holds the garrison's office" only where a garrison stands (CAST_REASON_SIBLINGS).
    out.push(npcRow(n, 'defender', resolveSibling(CAST_REASONS.defenderOffice, CAST_REASON_SIBLINGS, castReasonOptions(s))));
  }
  // The house fallback credits a house with the town's defence, so it reads the STANDING roster
  // only (`liveInstitutions`): a closed garrison defends nothing.
  // R2-CODE-B item 4 (the cold list REVIEW-W2A-3 #328: "defends: no military, garrison or watch
  // stands" beside the Tonight sheet's "Defence: Adventurers' charter hall."): the houses that defend
  // are the defence buckets' standing members (walls, garrison, militia, watch, mercenary, charter;
  // `partitionDefenseInstitutions`, the one keyword table `defenseFactsOf(s).defenceNames` reads for
  // that "Defence:" line), never a second regex of this file's own. Roster order kept.
  const roster = liveInstitutions(s);
  const buckets = partitionDefenseInstitutions(roster);
  const defends = new Set(DEFENDING_BUCKETS.flatMap((k) => buckets[k] || []));
  // "the town's defence" names the place a town: below the town tier the reason names the place
  // (the chair's size ruling of 2026-11-13; a reason written in code is a pool of two, chosen here).
  const houseReason = TIER_ORDER.indexOf(str(s.tier)) >= TIER_ORDER.indexOf('town') || !str(s.tier)
    ? CAST_REASONS.defenderInstitution
    : CAST_REASONS.defenderInstitutionPlace;
  for (const i of roster.filter((x) => defends.has(x))) {
    out.push({ role: 'defender', kind: 'institution', id: str(i.name), name: str(i.name), reason: houseReason, temporary: false });
  }
  return { candidates: out, absent: CAST_ABSENCES.noMilitary };
}

/** A person's own role that is trade (the record's `role`), the one case "a merchant" is said of them. */
const TRADE_ROLE = /\b(?:merchant|trader|factor|broker|magnate|banker|chandler)/i;

/**
 * Rule 8 — the one who would treat.
 * @param {CastSettlement} s
 * @returns {Candidates}
 */
export function treaterCandidates(s) {
  /** @type {CastRow[]} */
  const out = [];
  if (legitimacyContested(s)) {
    for (const f of factionsOf(s).filter((x) => factionArchetype(x) === A.MERCHANT)) {
      for (const n of membersOf(s, factionName(f))) out.push(npcRow(n, 'treater', TRADE_ROLE.test(str(n.role)) ? CAST_REASONS.treaterMerchant : CAST_REASONS.treaterMerchantMember));
    }
  }
  out.push(...seatRows(s, 'treater', CAST_REASONS.treaterSeat, CAST_REASONS.treaterSeat));
  return { candidates: out, absent: CAST_ABSENCES.noMerchantOrSeat };
}

/**
 * Rule 9 — the collaborator.
 * @param {CastSettlement} s @param {CastStake[]} stakes
 * @returns {Candidates}
 */
export function collaboratorCandidates(s, stakes) {
  // R2-CODE-B-11, the bar's row 179 (the chair's ruling (a), 2026-11-14): THE COLLABORATOR IS NEVER THE OCCUPIER. The role
  // is cast only in the occupation kinds (occasionalRolesOf), and a collaborator is a LOCAL who deals with the power the
  // crisis brings: no member of an occupying power (the face's own house, faceCandidates) is cast, in either arm. Where no
  // local remains the role is absent by its own reason (occupierOnly where the occupier alone gains). No draw.
  const occupiers = new Set(factionsOf(s).filter(isOccupier).map(factionName));
  const roster = rosterOf(s).filter((n) => !memberOfAny(n, occupiers));
  /** @type {CastRow[]} */
  const out = roster.filter((n) => !!allegianceOf(n)).map((n) => npcRow(n, 'collaborator', CAST_REASONS.collaboratorCorrupt));
  const gainers = new Set(stakes.filter((k) => k.stake === 'gains').map((k) => k.factionId));
  const ambitious = roster.map((n, at) => ({ n, at }))
    .filter(({ n }) => memberOfAny(n, gainers) && !allegianceOf(n))
    .sort((a, b) => {
      const am = (/** @type {CastNpc} */ n) => (traitsOf(n).some((t) => AMBITION_TRAITS.includes(t)) ? 0 : 1);
      return (am(a.n) - am(b.n)) || (numOf(b.n.power) - numOf(a.n.power)) || (a.at - b.at);
    });
  for (const { n } of ambitious) out.push(npcRow(n, 'collaborator', CAST_REASONS.collaboratorAmbition));
  const onlyTheOccupier = [...gainers].every((g) => occupiers.has(g)) && [...gainers].some((g) => occupiers.has(g));
  return { candidates: out, absent: onlyTheOccupier ? CAST_ABSENCES.occupierOnly : CAST_ABSENCES.noGains };
}

/**
 * Rule 10 — the waverer: a member of a faction whose stake is split.
 * @param {CastSettlement} s @param {CastStake[]} stakes
 * @returns {Candidates}
 */
export function wavererCandidates(s, stakes) {
  /** @type {CastRow[]} */
  const out = [];
  for (const k of stakes.filter((x) => x.stake === 'split')) {
    for (const n of membersOf(s, k.factionId)) out.push(npcRow(n, 'waverer', CAST_REASONS.waverer));
  }
  return { candidates: out, absent: CAST_ABSENCES.noSplit };
}

/**
 * The occupier's local face: the occupying house's leading member, else the house.
 * @param {CastSettlement} s
 * @returns {Candidates}
 */
export function faceCandidates(s) {
  /** @type {CastRow[]} */
  const out = [];
  for (const f of factionsOf(s).filter(isOccupier)) {
    for (const n of membersOf(s, factionName(f))) out.push(npcRow(n, 'face', CAST_REASONS.face));
    out.push(factionRow(f, 'face', CAST_REASONS.face));
  }
  return { candidates: out, absent: CAST_ABSENCES.noOccupier };
}

// ── The town caster ───────────────────────────────────────────────────────────────────────

/** @param {CrisisRole} a @param {CrisisRole} b */
function contradicts(a, b) {
  return CONTRADICTORY_ROLE_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

/**
 * The roles a crisis must try to fill.
 * @param {string} kind
 * @returns {CrisisRole[]}
 */
export function requiredRolesOf(kind) {
  const nature = natureOf(kind);
  return nature === 'external' ? [...(REQUIRED_EXTERNAL[kind] || [])] : [...REQUIRED_BY_NATURE[nature]];
}

/**
 * The occasional roles a crisis may carry (before the rate and the cap).
 * @param {string} kind
 * @returns {Array<keyof typeof CRISIS_CAST_TUNING.rates>}
 */
export function occasionalRolesOf(kind) {
  const nature = natureOf(kind);
  return OCCASIONAL_BY_NATURE[nature].filter((r) => r !== 'collaborator' || kind === 'occupied' || kind === 'infiltrated');
}

/**
 * Cast the whole town. `entries` are the active crises, worst first (the caller's order is
 * the casting order). Returns one cast per entry, keyed by the entry's type (its crisis id).
 *
 * @param {CastSettlement} settlement
 * @param {CastEntry[]} entries
 * @param {string} seed
 * @param {CastOptions} [options]
 * @returns {Map<string, CrisisCast>}
 */
export function deriveCrisisCast(settlement, entries, seed, options = {}) {
  /** @type {Map<string, CrisisCast>} */
  const casts = new Map();
  /** @type {Map<string, Array<{ role: CrisisRole, crisis: string }>>} who holds what, by row key */
  const held = new Map();
  /** @type {Record<string, number>} */
  const capUsed = {};
  /** @type {Map<string, { id: string, name: string }>} temporary people by kind */
  const temporaries = new Map();
  for (const n of Array.isArray(settlement.npcs) ? settlement.npcs : []) {
    if (n && n.temporary && n.temporaryKind && str(n.name)) temporaries.set(n.temporaryKind, { id: str(n.id) || str(n.name), name: str(n.name) });
  }
  const caps = /** @type {Record<string, number>} */ (CRISIS_CAST_TUNING.townCaps);
  /** @type {Map<string, Map<CrisisRole, CastRow>>} rows of the crises already cast, by kind */
  const earlier = new Map();

  entries.forEach((entry) => {
    const kind = str(entry?.type);
    if (!kind || casts.has(kind)) return;
    const nature = natureOf(kind);
    const stakes = deriveStakes(settlement, kind);
    /** @type {CastRow[]} */
    const roles = [];
    /** @type {CastAbsence[]} */
    const absent = [];
    /** @type {string[]} */
    const links = [];

    /** @param {CastRow} r */
    const keyOf = (r) => `${r.kind}:${r.id}`;
    /** @param {CastRow} r */
    const fits = (r) => !(held.get(keyOf(r)) || []).some((h) => contradicts(h.role, r.role));

    /**
     * Take the first candidate that fits; say so when the first choice was passed over.
     * @param {CrisisRole} role @param {Candidates} c @param {CastRow | null} [linked]
     * @returns {CastRow | null}
     */
    const take = (role, c, linked = null) => {
      const list = linked ? [linked, ...c.candidates] : c.candidates;
      if (!list.length) { absent.push({ role, reason: c.absent }); return null; }
      const pick = list.find(fits);
      if (!pick) { absent.push({ role, reason: CAST_ABSENCES.noCandidate }); return null; }
      const row = pick === list[0] ? { ...pick, role } : { ...pick, role, reason: `${pick.reason}; ${CAST_REASONS.nextInLine}` };
      roles.push(row);
      const k = keyOf(row);
      held.set(k, [...(held.get(k) || []), { role, crisis: kind }]);
      return row;
    };

    /** @param {'instigatorFromBrunt' | 'targetFromFace' | 'exploiterFromProfiteer' | 'collaboratorFromExploiter'} read @returns {CastRow | null} */
    const linkedRow = (read) => {
      for (const link of CRISIS_LINKS) {
        if (link.to !== kind || link.read !== read || !earlier.has(link.from)) continue;
        const prev = /** @type {Map<CrisisRole, CastRow>} */ (earlier.get(link.from));
        if (read === 'instigatorFromBrunt') {
          const b = prev.get('brunt');
          if (!b) continue;
          // the brunt's power: a power row's own; a person's FIRST-RANK power (its best standing)
          const fname = b.kind === 'faction'
            ? b.id
            : str(firstRankMembershipOf(rosterOf(settlement).find((n) => (str(n.id) || str(n.name)) === b.id), powerOrderOf(settlement))?.power);
          // no lead is drawn where the brunt's house holds the seat (RUNG2-F13)
          const house = fname ? factionsOf(settlement).find((f) => factionName(f) === fname) : undefined;
          const lead = fname && !(house && holdsTheSeat(settlement, house)) ? membersOf(settlement, fname).find((n) => (str(n.id) || str(n.name)) !== b.id) || null : null;
          if (lead) { links.push(link.from); return npcRow(lead, 'instigator', CAST_REASONS.instigatorLinked); }
        } else if (read === 'targetFromFace') {
          const f = prev.get('face');
          if (f) { links.push(link.from); return { ...f, role: 'target', reason: CAST_REASONS.targetLinked }; }
        } else if (read === 'exploiterFromProfiteer') {
          const p = prev.get('profiteer');
          if (p) { links.push(link.from); return { ...p, role: 'exploiter', reason: CAST_REASONS.exploiterLinked }; }
        } else {
          const e = prev.get('exploiter');
          // Row 179, read the same way: the famine's exploiter is the occupation's collaborator only as a LOCAL (never the
          // face, never a member of an occupying power); else the link is not read and the role falls to Rule 9.
          const occupiers = new Set(factionsOf(settlement).filter(isOccupier).map(factionName));
          const own = !!e && (e.kind === 'faction' ? occupiers.has(e.id) : memberOfAny(rosterOf(settlement).find((n) => (str(n.id) || str(n.name)) === e.id) || {}, occupiers));
          if (e && !own && !roles.some((r) => r.role === 'face' && keyOf(r) === keyOf(e))) { links.push(link.from); return { ...e, role: 'collaborator', reason: CAST_REASONS.collaboratorLinked }; }
        }
      }
      return null;
    };

    /** @type {CastRow | null} */
    let leverRow = null;
    for (const role of requiredRolesOf(kind)) {
      if (role === 'brunt') take('brunt', bruntCandidates(settlement, kind, stakes));
      else if (role === 'lever') {
        const c = leverCandidates(settlement, kind);
        const tempKind = CRISIS_LEVERS[kind]?.temporary || null;
        if (!c.candidates.length && tempKind) {
          let temp = temporaries.get(tempKind) || null;
          if (!temp && (capUsed.temporary || 0) < caps.temporary && options.mintTemporary) {
            temp = options.mintTemporary(tempKind, kind);
            if (temp) { temporaries.set(tempKind, temp); capUsed.temporary = (capUsed.temporary || 0) + 1; }
          }
          if (temp) {
            /** @type {CastRow} */
            const row = { role: 'lever', kind: 'npc', id: temp.id, name: temp.name, reason: CAST_REASONS.leverTemporary, temporary: true };
            leverRow = take('lever', { candidates: [row], absent: c.absent });
            continue;
          }
        }
        leverRow = take('lever', c);
      } else if (role === 'instigator') take('instigator', instigatorCandidates(settlement, kind, stakes), linkedRow('instigatorFromBrunt'));
      else if (role === 'target') take('target', targetCandidates(settlement), linkedRow('targetFromFace'));
      else if (role === 'defender') take('defender', defenderCandidates(settlement));
      else if (role === 'treater') take('treater', treaterCandidates(settlement));
      else if (role === 'face') take('face', faceCandidates(settlement));
    }

    // Ruling (c), the cut's #268: the person who bears the brunt and also holds the lever is not "the one with the
    // least say": that clause reads "one of the house the crisis hits" (any next-in-line tail kept). No draw moves.
    const bruntAt = roles.findIndex((r) => r.role === 'brunt' && r.kind === 'npc' && r.reason.startsWith(CAST_REASONS.bruntLeast));
    if (bruntAt >= 0 && roles.some((r) => r.role === 'lever' && keyOf(r) === keyOf(roles[bruntAt]))) {
      roles[bruntAt] = { ...roles[bruntAt], reason: CAST_REASONS.bruntMember + roles[bruntAt].reason.slice(CAST_REASONS.bruntLeast.length) };
    }

    for (const role of occasionalRolesOf(kind)) {
      if (castHash(seed, kind, role) >= CRISIS_CAST_TUNING.rates[role]) continue;
      if (role in caps && (capUsed[role] || 0) >= caps[role]) { absent.push({ role, reason: CAST_ABSENCES.townCap }); continue; }
      /** @type {CastRow | null} */
      let row;
      if (role === 'exploiter') row = take('exploiter', exploiterCandidates(settlement, stakes, 'exploiter'), linkedRow('exploiterFromProfiteer'));
      else if (role === 'profiteer') row = take('profiteer', exploiterCandidates(settlement, stakes, 'profiteer'));
      else if (role === 'scapegoat') row = take('scapegoat', scapegoatCandidates(settlement, stakes, leverRow));
      else if (role === 'collaborator') row = take('collaborator', collaboratorCandidates(settlement, stakes), linkedRow('collaboratorFromExploiter'));
      else row = take('waverer', wavererCandidates(settlement, stakes));
      if (row && role in caps) capUsed[role] = (capUsed[role] || 0) + 1;
    }

    earlier.set(kind, new Map(roles.map((r) => [r.role, r])));
    casts.set(kind, {
      nature,
      rank: casts.size + 1,
      roles,
      absent,
      stakes,
      levers: deriveLevers(settlement, kind),
      ifNothingIsDone: { residualEffects: catalogFor(kind).residualEffects },
      playersSeeFirst: ['food', 'defence'],
      links: [...new Set(links)],
    });
  });
  return casts;
}

// ── The DM's word (EDITABLE_FIELDS.crisis) ────────────────────────────────────────────────

/**
 * The crisis entry's editable path. The DM's cast is spelled as ONE line of
 * `role=kind:id` parts joined by `CAST_EDIT_SEPARATOR` (the X-45 idiom: a list spelled as one
 * string, so every reader of an edit record still reads a string), and it lives beside the
 * engine's `cast`, never over it, so "As the engine has it" reverts to the derived record.
 */
// RUNG1B-F8: the line's grammar lives in the leaf the rename modules re-key it through
// (domain/userEditLines.js), so a renamed faction or house keeps the DM's part.
export { CAST_EDIT_PATH, CAST_EDIT_SEPARATOR };

/**
 * @param {Array<{ role: string, kind: string, id: string }>} rows
 * @returns {string}
 */
export function formatCastRoles(rows) {
  return rows.map((r) => `${r.role}=${r.kind}:${r.id}`).join(CAST_EDIT_SEPARATOR);
}

/**
 * The DM's line read back: only roles of the vocabulary and kinds of the record survive.
 * @param {unknown} value
 * @returns {Array<{ role: CrisisRole, kind: 'npc' | 'faction' | 'institution', id: string }>}
 */
export function parseCastRoles(value) {
  if (typeof value !== 'string' || !value.trim()) return [];
  /** @type {Array<{ role: CrisisRole, kind: 'npc' | 'faction' | 'institution', id: string }>} */
  const out = [];
  for (const part of value.split(CAST_EDIT_SEPARATOR)) {
    const m = /^([a-z]+)=(npc|faction|institution):(.+)$/.exec(part.trim());
    if (!m || !CRISIS_ROLES.includes(/** @type {CrisisRole} */ (m[1]))) continue;
    out.push({ role: /** @type {CrisisRole} */ (m[1]), kind: /** @type {'npc' | 'faction' | 'institution'} */ (m[2]), id: m[3] });
  }
  return out;
}

/**
 * The cast as the page shows it: the DM's word where the DM spoke (each row resolved against
 * the roster, the faction set and the houses; a row whose holder is gone is dropped, never
 * shown nameless), else the engine's record.
 * @param {CastSettlement} settlement
 * @param {{ cast?: CrisisCast, _userEdits?: Record<string, { value?: unknown }> } | null | undefined} entry
 * @returns {{ cast: CrisisCast | null, edited: boolean }}
 */
export function effectiveCastOf(settlement, entry) {
  const engine = entry?.cast || null;
  const record = entry?._userEdits?.[CAST_EDIT_PATH];
  if (!record) return { cast: engine, edited: false };
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  const factions = factionsOf(settlement || {});
  const houses = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  /** @type {CastRow[]} */
  const roles = [];
  for (const r of parseCastRoles(record.value)) {
    /** @type {string} */
    let name;
    let temporary = false;
    if (r.kind === 'npc') {
      const n = npcs.find((x) => !!x && (str(x.id) || str(x.name)) === r.id);
      name = n ? str(n.name) : '';
      temporary = !!n?.temporary;
    } else if (r.kind === 'faction') {
      name = factions.some((f) => factionName(f) === r.id) ? r.id : '';
    } else {
      name = houses.some((h) => str(h?.name) === r.id) ? r.id : '';
    }
    if (name) roles.push({ role: r.role, kind: r.kind, id: r.id, name, reason: CAST_REASONS.dm, temporary });
  }
  /** @type {CrisisCast} */
  const base = engine || { nature: natureOf(''), rank: 0, roles: [], absent: [], stakes: [], levers: [], ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [], links: [] };
  return { cast: { ...base, roles, absent: [] }, edited: true };
}

/**
 * DECLARED SIBLINGS (CENSUS-1c unit 1; the twin tables dissolved, `docs/DESIGN_POOL_CENSUS.md`
 * §3.1): `CAST_REASONS.bruntBase.defense_readiness` and `CAST_REASONS.defenderOffice`. The original stays where it is spelled above; the twin stands beside it here with
 * the complementary atom, and the site resolves a drawn key through `resolveSibling`. Retired from
 * `data/defenceTwinLines.js` (F10 unit 4), every twin to the byte.
 */
export const CAST_REASON_SIBLINGS = Object.freeze({
  'its people stand on the walls': Object.freeze([
    Object.freeze({ text: 'its people stand on the walls', needs: Object.freeze(['walls']) }),
    Object.freeze({ text: 'its people stand guard', twinOf: 'its people stand on the walls', excludes: Object.freeze(['walls']) }),
  ]),
  'holds the garrison\'s office': Object.freeze([
    Object.freeze({ text: 'holds the garrison\'s office', needs: Object.freeze(['garrison']) }),
    Object.freeze({ text: 'holds the office of the guard', twinOf: 'holds the garrison\'s office', excludes: Object.freeze(['garrison']) }),
  ]),
});

/**
 * THE BRUNT REASONS' CRISIS DECLARATIONS (CENSUS-2d unit 3), apart from the defence sets above
 * (`DEFENCE_SIBLINGS` reads those as defence-word lines). Resolved with them at the brunt draw.
 */
export const CAST_CRISIS_SIBLINGS = Object.freeze({
  // CENSUS-2d unit 3 (Phase A's ledger CRISIS_CAST_REASONS.json; the brunt site is wired, so these
  // are enforced): food_security is reached under a famine OR a mass migration, and "the hunger" is
  // true only with the hunger family on (a fed influx is fed: CENSUS-1c unit 7); housing_pressure
  // under a migration OR monster pressure, and "the newcomers" only under an influx. Each twin is
  // the chair's ruling (R-G), recorded with its share in docs/CENSUS_2_LANE_2026-11-04.md "CENSUS-2d".
  // healing_capacity is reached under plague_onset alone: its key, never re-declared (R-B1).
  'the hunger falls first on its people': Object.freeze([
    Object.freeze({ text: 'the hunger falls first on its people', crisis: Object.freeze(['hunger']) }),
    Object.freeze({ text: 'the strain falls first on its people', twinOf: 'the hunger falls first on its people', excludes: Object.freeze(['crisis: hunger']) }),
  ]),
  'its people take in the newcomers': Object.freeze([
    Object.freeze({ text: 'its people take in the newcomers', needs: Object.freeze(['migration: influx']) }),
    Object.freeze({ text: 'its houses are where the crisis is felt first', twinOf: 'its people take in the newcomers', excludes: Object.freeze(['migration: influx']) }),
  ]),
});

/** The brunt draw's sibling sets: the defence sets and the crisis ones. */
const BRUNT_SIBLINGS = Object.freeze({ ...CAST_REASON_SIBLINGS, ...CAST_CRISIS_SIBLINGS });

/**
 * The resolution options for a cast reason: the record's facts (the defence home), the ledger's
 * pool name. Draw-free.
 * @param {CastSettlement} s
 */
function castReasonOptions(s) {
  return { facts: factsOf(s), poolId: 'crisisCast:CAST_REASON_SIBLINGS', surface: 'crisis', drawKind: /** @type {'T'} */ ('T') };
}
