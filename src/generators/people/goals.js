/**
 * people/goals.js — THE GOALS REBUILT (the allegiance train, car 4, ALLEGIANCE-CAR4, 2026-11-09;
 * `docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md` §1.6, §2 step A9, §3.5, §3.6, §4 I-8/I-9/I-11/I-13,
 * §6; the chair's rulings J-14, J-15, J-16; the writers' record `docs/allegiance/WRITE_GOALS_2026-11-08.md`).
 *
 * A card's goal is drawn at the END of the coherence seam (A9), after the ranks, the agents, the
 * handlers and the ties it binds — facts that do not exist when a card is born. TWO draws per card,
 * SHORT (this season) and LONG (the life), from two DIFFERENT families its record supports; every line
 * is a cell of `data/people/goalFamilies.js :: GOAL_FAMILY_LINES` with each slot filled from the record
 * by the writers' fill rules (WRITE-GOALS §6), or the line is not drawn. The keyed intent is stored
 * beside the text for the simulation: `goal.intent.{short,long} = { family, kind, key, target }`, where
 * `key` is an `NPC_GOAL_CATALOG` key (the FP's law: the agency reads `goal.intent.key`, never the
 * role-keyed pool) and `target` is `{ kind: 'npc'|'power'|'house'|'chain', id }` or null.
 *
 * THE WEIGHTING (design §6.2, J-15). The GATES are draw-free: a family is supported when the record
 * fills at least one of its lines that the record's facts admit and the roster does not already hold
 * (REVIEW-INTAKE-4: a filled line another figure carries is refused). ONE weighted draw per vantage:
 * `w = base[family] × fit(family, card)` over the supported families, then one draw of the sub-kind
 * and one of the line. Three rolls come FIRST, each on the card's own fork and each outside the family
 * weighting: the law's pursuit (§3.5, a law face only), and the UNCANNY family's rarity (the owner's
 * word: magic ON only as the gate; a per-card chance that scales with the roster, never a flat share).
 *
 * THE FORKS. Each card draws on `people-goals::<card id>` off the seam's stream (the people car's
 * precedent), so removing a card moves no other card's rolls; what a removal CAN move is the record
 * other cards read (a tie's other end, a handler's agent, a pursuit's target pool, the held texts),
 * and the receipt names every card id a draw read (`refs`) so the keyed-determinism arm reads that.
 *
 * THE RECEIPT (the confidence of "plausibility with confidence"): per card, the families that passed,
 * their weights, the rolls, the sub-kind, the slots filled and the ids read. Kept beside the returned
 * cast (`goalReceiptsOf`), never on the record.
 *
 * Every dial is born DRAFT (`GOAL_FAMILY_TUNING`, `LAW_PURSUIT_TUNING`); signing is the owner's.
 * DM-only by construction: `npcs[].goal` (and so `intent`) never reaches a public page (design §6.3).
 */

import { GOAL_FAMILY_LINES, GOAL_LINE_MIN_MEMBERS, GOAL_LINE_NOT_ON_TIES, GOAL_RESERVE_LINES, PERSONALITY_CLUSTER_OF, TIE_TYPE_TO_GOAL_SUBKIND } from '../../data/people/goalFamilies.js'; import { facesInPower } from '../../domain/people/cardPowers.js'; // BAR8 K-PEOPLE (14h): the power's members as the Power tab counts them
import { familyOfInstitution, isLawEnforcementInstitution, isNoPowerInstitution } from '../../data/institutionalCatalog.js';
import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { chainPrintName } from '../../domain/display/chainPrintName.js';
import { fillAgreement, holdsPossessive, powerNameWithArticle } from '../../domain/display/powerSentenceName.js';
import { heldCardLine, reflexiveOf, secondMentions } from '../../data/people/personMention.js';
import { filterDeclared, lineText, resolveSibling } from '../../domain/facts/drawDeclared.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { notePresumption, withPresumptionLedger } from '../../domain/facts/presumptionLedger.js';
import { magicOf } from '../../domain/facts/magic.js';
import { goodNeededNotBroughtIn, goodsNeededNotBroughtIn } from '../../domain/facts/needNotBroughtIn.js'; // FAULTS-NEED item 2 (11e.wantBuy): the page's need list
import { allegianceOf, criminalHousesOf, criminalPowersOf, organizedCrimeOf } from '../../domain/people/allegiance.js';
import { sharesPower } from '../../domain/facts/sharedPower.js'; // GR1: a wording held twice is never held by two of one power where another is free
import { NPC_GOAL_SIBLINGS, SIEGE_GOALS, STRESS_GOAL_OVERRIDES, stressBucketOf } from '../npcGenerator.js';
import { deriveTradeCommodity } from '../tradeCommodity.js';
import { faceOfRole } from '../../data/holderTitleForms.js'; // TAIL-TITLES K-C: the bucket keys the face
import { clamp, clamp01 } from '../../kernel/math.js';
import { GOAL_SECRET_REFUSAL_RARE_KEYS, GOAL_SECRET_REFUSAL_ROWS, GOAL_SECRET_REFUSED_CLUSTERS } from '../../data/people/goalSecretRefusals.js'; // GOALS-1 item 6: the want refused beside the card's own secret
import { crimeFactionNameOf, crimeSignalOf, withTownsOwnUnderworld } from '../../domain/crimeSignal.js'; // item 6: the thieves' guild row as the town rewords it
import { rareRowOf } from './rareSecrets.js'; // AMENDMENT 3 (item 8): the rare deal's row, by its words

/** @typedef {Record<string, any>} Rec */
/** @typedef {'short' | 'long'} Vantage */
/** @typedef {{ kind: 'npc' | 'power' | 'house' | 'chain', id: string }} GoalTarget */
/**
 * @typedef {{ family: string, kind: string, text: string, target: GoalTarget | null, slots: Rec, refs: string[], crisisNote?: string | null, notes?: Rec[], refused?: boolean, wording: string, call?: number, floor?: boolean, exhausted?: boolean, selfText?: (self: string) => string | null }} Candidate
 * `wording`: the line's WORDING with the town's names masked (GR1, `wordingOf`); `call`: the `cellCandidates` call that built it (its rotation group);
 * `floor`: a floor's line (`personalityFloor`); `exhausted`: that floor found its cell and its reserve all printed (GOALS-3 (d)).
 * `selfText` (E8): a line with the `{self}` slot, its text with the slot filled by the given form (`writtenText`).
 */

/** The keyed fork family the goals draw under (declared in the fork census). */
export const GOALS_FORK_LABEL = 'people-goals';

/** The families the weighted draw chooses among (UNCANNY is drawn outside it, by its own roll). */
export const DRAWN_FAMILIES = Object.freeze(['RANK', 'POWER', 'INSTITUTION', 'SUPPLY', 'TIES', 'PERSONALITY', 'ALLEGIANCE', 'CRISIS']);

/**
 * THE FAMILY WEIGHTS (design §3.6 and §6.2, J-15; DRAFT, the owner signs). `base` is each family's
 * multiplier (1 everywhere at birth); `fit` the record's own pulls; `uncanny` the owner's rare fantasy
 * goals: `perCard[tier]` the chance per card (so the expected count per town grows with the roster),
 * `capPerSettlement` the hard ceiling, `vantage` the goal the roll replaces (WRITE-GOALS §8's drafts).
 */
export const GOAL_FAMILY_TUNING = Object.freeze({
  base: Object.freeze({ RANK: 1, POWER: 1, INSTITUTION: 1, SUPPLY: 1, TIES: 1, PERSONALITY: 1, ALLEGIANCE: 1, CRISIS: 1 }),
  fit: Object.freeze({
    rankClimb: 1.5, // RANK, a card ranked 2 or 3 (a rank to climb)
    powerFirst: 1.3, // POWER, a rank-1 face
    supplyTrade: 1.5, // SUPPLY, a house on the Crafts or Economy shelf
    institutionImpaired: 1.3, // INSTITUTION, the house processes an impaired chain
    allegianceAgentShort: 3, // ALLEGIANCE, an agent's SHORT goal (likely, never certain)
    allegianceHandler: 2, // ALLEGIANCE, a handler
    crisisStress: 2, // CRISIS, under its stress
    personality: 0.6, // PERSONALITY, the floor that keeps every card supported
  }),
  uncanny: Object.freeze({
    perCard: Object.freeze({ thorp: 0.003, hamlet: 0.004, village: 0.006, town: 0.008, city: 0.011, metropolis: 0.013 }),
    capPerSettlement: 2,
    vantage: 'short',
  }),
});

/**
 * THE LAW'S PURSUIT (design §3.5; DRAFT, the owner signs). A law face (the `lawEnforcement` mark, J-14)
 * rolls a WARRANT where an open criminal house's face stands, else a SUSPICION where a hidden allegiance
 * does; the strengths are points out of 100 over `strengthFull`. The target is drawn by
 * `exposure[kind] × importance[card importance]` among the real criminal links.
 */
export const LAW_PURSUIT_TUNING = Object.freeze({
  strengthFull: 30,
  warrant: Object.freeze({ base: 0.20, enforcer: 0.40, guild: 0.25, min: 0.05, max: 0.60 }),
  suspicion: Object.freeze({ base: 0.10, enforcer: 0.30, guild: 0.20, organized: 0.10, min: 0.02, max: 0.40 }),
  exposure: Object.freeze({ open: 1.0, front: 0.5, office: 0.75, retainer: 0.4 }),
  importance: Object.freeze({ pillar: 4, key: 3, notable: 2, minor: 1 }),
});

/**
 * THE KEY SPACE (design §6.3; the FP's law): every (family, sub-kind) → its `NPC_GOAL_CATALOG` key.
 * A sub-kind not named takes its family's `*` key.
 */
export const GOAL_INTENT_KEYS = Object.freeze({
  RANK: Object.freeze({ climb: 'secure_office', defend: 'consolidate_power', enter: 'secure_office' }),
  POWER: Object.freeze({ conflict: 'settle_rivalry', '*': 'expand_influence' }),
  INSTITUTION: Object.freeze({ '*': 'control_institution' }),
  SUPPLY: Object.freeze({ expansion: 'expand_trade_house', '*': 'secure_supply' }),
  TIES: Object.freeze({ rival_enemy: 'settle_rivalry', debtor: 'repay_debt', creditor: 'collect_debt', '*': 'protect_ally' }),
  PERSONALITY: Object.freeze({ '*': 'indulge_trait' }),
  ALLEGIANCE: Object.freeze({ warrant: 'pursue_warrant', suspicion: 'prove_allegiance', front_out: 'escape_patron', front_keep: 'serve_patron', '*': 'serve_patron' }),
  CRISIS: Object.freeze({ mil: 'mobilize_defenses', gov: 'restore_order', '*': 'survive_crisis' }),
  UNCANNY: Object.freeze({ '*': 'answer_the_uncanny' }),
});
// the ALLEGIANCE sub-kinds by prefix (escape_* → escape_patron, keep_* → keep_agent; the agent's serve_* → serve_patron)
const ALLEGIANCE_PREFIX_KEYS = Object.freeze({ escape: 'escape_patron', keep: 'keep_agent', serve: 'serve_patron' });

/** The intent key of a (family, sub-kind). @param {string} family @param {string} kind @returns {string} */
export function intentKeyOf(family, kind) {
  const table = /** @type {Rec} */ (GOAL_INTENT_KEYS)[family] || {};
  if (table[kind]) return table[kind];
  if (family === 'ALLEGIANCE') { const p = ALLEGIANCE_PREFIX_KEYS[/** @type {keyof typeof ALLEGIANCE_PREFIX_KEYS} */ (kind.split('_')[0])]; if (p) return p; }
  if (family === 'CRISIS' && kind.startsWith('siege')) return 'survive_crisis';
  return table['*'];
}

/** The handler tie's archetype → the handler's keep-in-line cell. */
const KEEP_KIND_OF_ARCHETYPE = Object.freeze({ handler_partnership: 'keep_partnership', handler_leverage: 'keep_leverage', handler_patron: 'keep_patron', handler_cause: 'keep_cause' });

/** The chain statuses that read as a running chain (SUPPLY `expansion`). */
const RUNNING_STATUSES = Object.freeze(['running', 'operational', 'entrepot']);
/** The isolation statuses SUPPLY `isolation` speaks to (WRITE-GOALS §2). */
const ISOLATION_STATUSES = Object.freeze(['precarious', 'untenable']);
/** The shelves `takeover` and `expansion` read true on (WRITE-GOALS §5 item 6; PLAUSIBLE, vetoable). */
const TRADING_SHELVES = Object.freeze(['Crafts', 'Economy', 'Entertainment']);
/** The shelves SUPPLY's fit reads (design §6.2). */
const SUPPLY_FIT_SHELVES = Object.freeze(['Crafts', 'Economy']);
/** A dependency that is no goods (WRITE-GOALS §6): it fills no `{resource}`. */
const NOT_GOODS = /trade access|ley line|capital|fishing \+ timber/i;

// ── THE {house} NOUN TABLE (WRITE-GOALS §6, bound exactly) ──────────────────────────────────────
// A house noun that names a PERSON fills as the place: "the cooper" → "the cooper's yard"; a value that
// begins "the " is the whole place ("the dairy farmer" → "the dairy"). A noun this table does not name
// reads as a place already.
/** @type {Readonly<Record<string, string>>} */
export const PERSON_HOUSE_PLACE = Object.freeze({
  potter: 'workshop', brickmaker: 'brickyard', cooper: 'yard', midwife: 'house', ropemaker: 'ropewalk', dyer: 'dyehouse',
  fuller: 'fulling mill', chandler: 'shop', vintner: 'cellars', 'charcoal burner': 'the charcoal kilns', tanner: 'yard', woodcarver: 'workshop',
  pawnbroker: 'shop', 'contract killer': 'people', fence: 'people', 'local fence': 'people', 'town crier': "the crier's post", brewer: 'brewhouse',
  blacksmith: 'forge', 'resident smith': 'forge', carpenter: 'workshop', tailor: 'shop', cobbler: 'shop', thatcher: 'yard',
  maltster: 'malt-house', apothecary: 'shop', glassblower: 'workshop', jeweller: 'shop', shepherd: 'the sheepfold', 'dairy farmer': 'the dairy',
  beekeeper: 'the hives', wildfowler: 'the fowling nets', fishmonger: 'the fish stall', 'hedge wizard': 'cottage', 'traveling hedge wizard': 'wagon',
  healer: 'house', 'scroll scribe': 'desk', 'village scribe': 'desk', 'stable master': 'stables', 'peat cutter': 'the peat cuttings',
  'pack animal trader': 'the horse yard', 'bandit affiliate': 'people', "lord's steward": 'office', "lord's appointee": 'office',
  "lord's reeve": 'office', 'village reeve': 'office', 'village headman': 'office', 'noble governor': "the governor's office",
  'village elder': "the elder's house", 'household elder': 'the household', 'bowyer & fletcher': 'workshop', 'tanner (established)': 'yard',
});

/** @param {unknown} v @returns {Rec} */
const rec = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Rec} */ (v) : {});
/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/** A person slot: the name before any parenthetical ("Milko Solovyov (the lanista)" → "Milko Solovyov"). @param {unknown} card */
export const personName = (card) => str(rec(card).name).replace(/\s*\(.*$/, '').trim();

/**
 * THE {house} FILL (WRITE-GOALS §6): "the" + the display noun, lower-cased, the parenthetical stripped;
 * "Multiple X" / "Massive X" → "the X"; a slash → its first noun; a person noun → its place.
 * @param {unknown} houseKey @returns {string} '' when the key gives no noun
 */
export function houseFill(houseKey) {
  const key = str(houseKey).trim();
  if (!key) return '';
  const lower = key.toLowerCase();
  // E1 (WORDS-1, the tenth chair's G5): a person noun that holds a possessive ("lord's steward") takes its SHORT title, the
  // possessor dropped ("the steward's office", as `noble governor` gives "the governor's office"), never "the lord's
  // steward's office"; where no short title is left, "the office of the lord's steward"
  const place = (/** @type {string} */ n) => {
    if (PERSON_HOUSE_PLACE[n].startsWith('the ')) return PERSON_HOUSE_PLACE[n];
    const who = n.replace(/\s*\(.*\)\s*/g, '');
    if (!holdsPossessive(who)) return `the ${who}'s ${PERSON_HOUSE_PLACE[n]}`;
    const short = who.replace(/^.*[\p{L}\p{N}](?:['’]s|s['’])\s+/u, '');
    return short && short !== who && !holdsPossessive(short) ? `the ${short}'s ${PERSON_HOUSE_PLACE[n]}` : `the ${PERSON_HOUSE_PLACE[n]} of the ${who}`;
  };
  if (PERSON_HOUSE_PLACE[lower]) return place(lower);
  let noun = str(institutionDisplayName(key) || key).replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  noun = noun.replace(/^(multiple|massive)\s+/i, '').split('/')[0].trim().toLowerCase();
  if (!noun) return '';
  if (PERSON_HOUSE_PLACE[noun]) return place(noun);
  return `the ${noun}`;
}

/** `{resource}`: goods with no article, lower-cased, "+" read as "and"; '' for a dependency that is no goods. @param {unknown} r */
export function resourceFill(r) {
  const s = str(r).trim();
  if (!s || NOT_GOODS.test(s)) return '';
  return s.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s*\+\s*/g, ' and ').replace(/\//g, ' and ').replace(/\s+/g, ' ').trim().toLowerCase();
}

/** `{import}`: a necessity import as goods, the parenthetical stripped. @param {unknown} i */
const importFill = (i) => str(typeof i === 'string' ? i : rec(i).name || rec(i).resource || rec(i).item).replace(/\s*\([^)]*\)\s*/g, ' ').trim().toLowerCase();

/** `{issue}`: the first letter lower-cased. @param {unknown} s */
const issueFill = (s) => { const t = str(s).trim(); return t ? t[0].toLowerCase() + t.slice(1) : ''; };

/**
 * A cell line's template: a bare string is itself; a declared line is the writers' `{ line, needs }`
 * (data/people/goalFamilies.js), or the census's `{ text, … }`.
 * @param {unknown} l @returns {string}
 */
const templateOf = (l) => (typeof l === 'string' ? l : str(rec(l).line) || str(lineText(l)));

/** Fill a template's `{slot}`s; null when any slot has no value. @param {string} line @param {Rec} slots @returns {string | null} */
export function fillLine(line, slots) {
  let missing = false;
  const out = String(line).replace(/\{(\w+)\}/g, (_m, k) => { const v = slots[k]; if (typeof v !== 'string' || !v) { missing = true; return ''; } return v; });
  return missing ? null : out;
}

/**
 * THE QUIET GATE: a declared line is admitted against the record's facts with its ledger notes KEPT ASIDE, so the
 * presumption ledger (`cert:false-presumption`) records the line the card prints, never the candidates it was
 * drawn among; `noteDrawn` writes the chosen line's notes into the open ledger.
 * @template T @param {() => T} fn @returns {{ result: T, notes: Rec[] }}
 */
const quiet = (fn) => { /** @type {Rec[]} */ const notes = []; const { result } = withPresumptionLedger(fn, /** @type {any} */ (notes)); return { result, notes }; };
/** @param {Candidate | null} c */
const noteDrawn = (c) => { for (const n of c?.notes || []) notePresumption(/** @type {any} */ (n)); };

/** The slots a template names. @param {string} line @returns {string[]} */
const slotsIn = (line) => [...String(line).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);

/**
 * THE REFLEXIVE SLOT (E8, WORDS-1; `data/people/personMention.js :: reflexiveOf`). A want's `{self}` binds the card that holds
 * it. THE DRAW IS NOT MOVED: every candidate is built, held, compared, rotated and refused on the text the line wrote before
 * the slot (`{self}` as "themselves", `HELD_SELF`), so every card's draw, rung and rotation is as it was; the card's own form
 * is written only where the deal writes the want to the card (`writtenText`). A want the town already holds in its WRITTEN
 * form (a keeper's, or another card's in the post-pass) is read back in the held form (`heldText`): no goal table writes
 * "himself" or "herself" but through this slot, so the read is exact.
 */
const HELD_SELF = 'themselves';
/** a written want in the form the draw holds and compares @param {unknown} t @returns {string} */
const heldText = (t) => String(t ?? '').replace(/\b(?:him|her)self\b/g, HELD_SELF);
/** the want as written to the card that holds it: the slot filled with the card's own form @param {Candidate | null} c @param {Rec} card @returns {string | null} */
const writtenText = (c, card) => (c ? (c.selfText ? c.selfText(reflexiveOf(card)) : c.text) : null);

/** A refused cluster (GOALS-1 item 6). @param {unknown} cluster */
const refusedCluster = (cluster) => GOAL_SECRET_REFUSED_CLUSTERS.includes(str(cluster));
/** The merchants of the protection-scheme row as a town with no market hears them (`npcGenerator.js :: mergeNPCLists`, R2-CODE-A-7). */
const NO_MARKET_WORDS = Object.freeze([["the very merchants they're supposed to serve", "the very households they're supposed to serve"]]);
/**
 * GOALS-1 item 6: the closed list's rows as the town prints them (draw-free, once per town): a row's `{token}` matches any fill
 * (a verb after `{faction}` in either number, `withPowerVerb`); the thieves' guild row as this town's own underworld rewords
 * it (`crimeSignal.js :: withTownsOwnUnderworld`, the reader `npcGenerator.js` and `castPowers.js` apply); the protection
 * scheme's merchants as a town with no market hears them. @param {Rec} settlement @returns {RegExp[]}
 */
function refusalRowsOf(settlement) {
  const factions = arr(rec(settlement.powerStructure).factions);
  const signal = crimeSignalOf({ seats: factions, estate: arr(settlement.institutions) });
  const faction = crimeFactionNameOf(/** @type {any[]} */ (factions));
  const esc = (/** @type {string} */ t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /** @type {Set<string>} */ const texts = new Set();
  for (const row of Object.values(GOAL_SECRET_REFUSAL_ROWS)) {
    const own = str(withTownsOwnUnderworld(row, signal, faction));
    for (const t of [row, own]) { texts.add(t); for (const [a, b] of NO_MARKET_WORDS) if (t.includes(a)) texts.add(t.replace(a, b)); }
  }
  return [...texts].map((t) => new RegExp(`^${t.split(/(\{\w+\}(?: \w+s\b)?)/).map((part) => {
    const m = /^\{(\w+)\}(?: (\w+)s)?$/.exec(part);
    return m ? `.+?${m[2] ? ` ${esc(m[2])}s?` : ''}` : esc(part);
  }).join('')}$`, 'u'));
}

/** Whether a card's own secret is a row of the closed list. @param {Rec} card @param {() => RegExp[]} rows the town's rows (`refusalRowsOf`) */
const secretRefuses = (card, rows) => { const what = heldCardLine(typeof card.secret === 'string' ? card.secret : str(rec(card.secret).what)); /* E8b: held form */ return !!what && rows().some((re) => re.test(what.trim())); };

/**
 * THE SETTLEMENT'S READS for the draw, computed once (draw-free): the houses, chains, dependencies,
 * criminal links, law faces, ties, the handler pairs and the facts the declared lines answer.
 * @param {Rec} settlement @param {Rec[]} cards @param {Rec[]} relationships
 */
export function goalContextOf(settlement, cards, relationships) {
  /** @type {Rec} */
  const view = { ...settlement, npcs: cards, relationships };
  const houses = arr(settlement.institutions).map(rec);
  const houseByName = new Map(houses.map((h) => [str(h.name), h]));
  const econ = rec(settlement.economicState);
  const chains = arr(econ.activeChains).map(rec);
  // a chain or a dependency may name a house by another tier's spelling ("Merchant guilds (3-8)" in a city whose
  // roster holds "Merchant guilds (15-40)"): both are keyed by the catalogue FAMILY, and a name resolves to the
  // roster's own house of that family (never a house the roster does not hold)
  const famKey = (/** @type {unknown} */ name) => familyOfInstitution({ name: str(name) })?.key || str(name);
  const rosterByFamily = new Map();
  for (const h of houses) if (!rosterByFamily.has(famKey(h.name))) rosterByFamily.set(famKey(h.name), str(h.name));
  const chainsByHouse = new Map();
  for (const ch of chains) for (const h of new Set(arr(ch.processingInstitutions).map(famKey))) { if (!chainsByHouse.has(h)) chainsByHouse.set(h, []); chainsByHouse.get(h).push(ch); }
  const depsByHouse = new Map();
  for (const d of arr(econ.tradeDependencies).map(rec)) { const k = famKey(d.institution); if (!depsByHouse.has(k)) depsByHouse.set(k, []); depsByHouse.get(k).push(d); }
  const crimHouseNames = new Set(criminalHousesOf(settlement).map((h) => str(h.name)));
  const crimPowers = criminalPowersOf(settlement);
  const powers = arr(rec(settlement.powerStructure).factions).map(rec);
  const strengthOf = new Map(powers.map((p) => [str(p.faction || p.name), Number(p.power) || 0]));
  const byId = new Map(cards.map((c) => [String(c?.id), c]));
  const ties = arr(relationships).map(rec);
  const iso = rec(settlement.isolationSupport);
  const stressTypes = arr(rec(settlement.config).stressTypes).map(str).filter(Boolean);
  const stressType = str(rec(settlement.config).stressType) || null;
  const stresses = stressTypes.length ? stressTypes : (stressType ? [stressType] : []);
  /** @type {ReturnType<typeof factsOf> | null} */
  let facts = null;
  return {
    view, houses, houseByName, famKey, rosterByFamily, chains, chainsByHouse, depsByHouse, crimHouseNames, crimPowers, powers, strengthOf, byId, ties,
    isolation: iso.applicable === true && ISOLATION_STATUSES.includes(str(iso.status)),
    imports: arr(econ.necessityImports).map(importFill).filter(Boolean),
    stressType, stresses,
    commodity: deriveTradeCommodity(econ, { firstWordFallback: true }),
    magic: magicOf(settlement).functions,
    tier: str(settlement.tier) || 'town',
    organized: organizedCrimeOf(settlement),
    facts: () => (facts ??= factsOf(view)),
    /** FAULTS-NEED item 2: whether a dependency's good is one the page's need list says is needed and not brought in */
    needUnmet: (/** @type {unknown} */ resource) => goodNeededNotBroughtIn(settlement, resource),
    // LAST-VARIETY (LR6 (5)): the unmet goods themselves, as the need list prints them (the `want` cell's {resource})
    needUnmetGoods: (/** @type {unknown} */ resource) => goodsNeededNotBroughtIn(settlement, resource),
    /** the held texts refused so far (the receipt's `refused`, per card) */
    refusals: { n: 0 },
    // GR1 (GOALS-1, the chair's rule): every `cellCandidates` call's id (its candidates' rotation group), and the reserve
    // lines' candidates of each call, filed apart from the draw (`GOAL_RESERVE_LINES`)
    calls: { n: 0 },
    /** @type {Map<number, Candidate[]>} */
    reserve: new Map(),
    // the handler's agents: handler id → [{ agent, archetype }] (the agent's covert handler tie names the kind)
    agentsOf: (() => {
      const m = new Map();
      for (const c of cards) {
        const a = allegianceOf(c);
        if (!a || a.handler == null) continue;
        const tie = ties.find((t) => t.handler === true && String(t.from) === String(c.id));
        if (!m.has(a.handler)) m.set(a.handler, []);
        m.get(a.handler).push({ agent: c, archetype: str(tie?.archetypeKey) });
      }
      return m;
    })(),
  };
}

/** @typedef {ReturnType<typeof goalContextOf>} GoalContext */

/** The card's house record, or null for a power's face. @param {Rec} card @param {GoalContext} ctx */
const houseOf = (card, ctx) => { const inst = rec(card.institution); return inst.kind === 'house' ? (ctx.houseByName.get(str(inst.key)) || { name: str(inst.key) }) : null; };

/** Is this card a law face (J-14: its house carries the `lawEnforcement` mark)? @param {Rec} card @param {GoalContext} ctx */
export const isLawFace = (card, ctx) => { const h = houseOf(card, ctx); return !!h && isLawEnforcementInstitution(h); };

/** The card's open powers (its memberships' names). @param {Rec} card @returns {Set<string>} */
const powersOfCard = (card) => new Set(arr(card.memberships).map((m) => str(rec(m).power)).filter(Boolean));

/** The guild an allegiance names (`{guild}`): the power as printed, else the house as a house. @param {Rec} a */
const guildFill = (a) => (a.power ? str(a.power) : houseFill(a.house));

/**
 * THE LAW'S PURSUIT TARGETS (§3.5; I-8, I-9). WARRANT: an OPEN member of a criminal house (a crim-house
 * face); SUSPICION: a card with a hidden allegiance. Never the enforcer itself, never a card of the
 * enforcer's own powers; a corrupt enforcer never names its own allegiance's house or power.
 * @param {Rec} card @param {Rec[]} cards @param {GoalContext} ctx @param {'warrant' | 'suspicion'} kind
 * @returns {Array<{ card: Rec, weight: number }>}
 */
export function pursuitTargetsOf(card, cards, ctx, kind) {
  const T = LAW_PURSUIT_TUNING;
  const own = powersOfCard(card);
  const mine = allegianceOf(card);
  /** @type {Array<{ card: Rec, weight: number }>} */
  const out = [];
  for (const c of cards) {
    if (!c || c === card || String(c.id) === String(card.id)) continue;
    const inst = rec(c.institution);
    const theirHouse = inst.kind === 'house' ? str(inst.key) : '';
    const theirPowers = powersOfCard(c);
    if ([...theirPowers].some((p) => own.has(p))) continue; // never the enforcer's own power
    const theirs = allegianceOf(c);
    if (mine) {
      if (theirHouse && theirHouse === mine.house) continue;
      if (mine.power && theirPowers.has(mine.power)) continue;
      if (theirs && (theirs.house === mine.house || (mine.power && theirs.power === mine.power))) continue;
    }
    /** @type {string | null} */ let exposure = null;
    if (kind === 'warrant' && inst.kind === 'house' && ctx.crimHouseNames.has(theirHouse)) exposure = 'open';
    if (kind === 'suspicion' && theirs && !(inst.kind === 'house' && ctx.crimHouseNames.has(theirHouse))) exposure = theirs.via;
    if (!exposure) continue;
    const w = (/** @type {Rec} */ (T.exposure)[exposure] ?? 0) * (/** @type {Rec} */ (T.importance)[str(c.importance)] ?? 1);
    if (w > 0) out.push({ card: c, weight: w });
  }
  return out;
}

/** The enforcer's strength and the guild's (points), for the pursuit's chances. @param {Rec} card @param {GoalContext} ctx */
function pursuitChances(card, ctx) {
  const T = LAW_PURSUIT_TUNING;
  const enf = Math.max(0, ...[...powersOfCard(card)].map((p) => ctx.strengthOf.get(p) || 0));
  const crim = ctx.crimPowers.length ? (Number(ctx.crimPowers[0].power) || 0) : 0;
  const e = clamp01(enf / T.strengthFull); const g = clamp01(crim / T.strengthFull);
  return {
    pWarrant: clamp(T.warrant.base + T.warrant.enforcer * e - T.warrant.guild * g, T.warrant.min, T.warrant.max),
    pSuspicion: clamp(T.suspicion.base + T.suspicion.enforcer * e + T.suspicion.guild * g + T.suspicion.organized * ctx.organized, T.suspicion.min, T.suspicion.max),
  };
}

/** The slots that name a power (`{guild}` names one where the allegiance is to a power, else a house as a house). */
const PROSE_SLOTS = new Set(['power', 'rival', 'guild']);
/** The slots that name a person (the slot contract: "a person, by name; a person may take 's"). */
const PERSON_SLOTS = Object.freeze(['above', 'below', 'other', 'handler', 'agent', 'target']);
/** The slots that name a house (the slot contract's {house} fill and UNCANNY's houses). */
const HOUSE_SLOTS = Object.freeze(['house', 'otherHouse', 'front', 'targetHouse', 'shrine', 'arcaneHouse']);
/** GR1: the NAME slots a line's wording masks (a person, a power, a house); every other slot is its value. */
const NAME_SLOTS = new Set([...PERSON_SLOTS, 'priest', ...PROSE_SLOTS, ...HOUSE_SLOTS]);

/**
 * GR1 (GOALS-1, the chair's rule): a line's WORDING, the key two people may not share in one town. Its template with every
 * NAME slot as `§` and every other slot (`resource`, `import`, `issue`, `chain`) as its value; the agreement forms
 * (`{power|it|them}`) as written (the key is never printed). @param {unknown} line @param {Rec} slots @returns {string}
 */
const wordingOf = (line, slots) => templateOf(line).replace(/\{(\w+)\}/g, (_m, k) => (NAME_SLOTS.has(k) ? '§' : str(slots[k])));

/**
 * The cards a line's person slots name, for its second mentions (NAMES-1, CN2): each slot's printed name with the one card
 * of the town that prints it (its gender, its role); a name two cards print is handed twice, so the line is left as written.
 * @param {Rec} slots @param {GoalContext} ctx @returns {Array<{ name: string, gender?: unknown, role?: unknown }>}
 */
function personCardsOf(slots, ctx) {
  /** @type {Array<{ name: string, gender?: unknown, role?: unknown }>} */ const out = [];
  for (const k of PERSON_SLOTS) {
    const name = slots[k];
    if (typeof name !== 'string' || !name || out.some((c) => c.name === name)) continue;
    const cards = [...ctx.byId.values()].filter((c) => personName(c) === name);
    if (cards.length === 1) out.push({ name, gender: rec(cards[0]).gender, role: rec(cards[0]).role });
    else out.push({ name }, { name });
  }
  return out;
}

/**
 * Every line of a cell the record fills and admits, unheld: the candidates of one sub-kind. GR1: every candidate carries
 * its WORDING and this call's id (`call`, its rotation group); the reserve lines of the cell (`GOAL_RESERVE_LINES`) are
 * built the same way and filed on `ctx.reserve` under the call's id, OUT of the returned list, so no draw moves.
 * @param {string} family @param {string} kind @param {Vantage} vantage @param {Rec} slots @param {GoalContext} ctx
 * @param {Set<string>} held @param {{ target?: GoalTarget | null, refs?: string[], members?: number, tie?: { type: string, strength: string } }} [extra] `members`: the power's members as the Power tab counts them (BAR8 K-PEOPLE 14h); `tie`: the tie a TIES call reads (GOALS-1, `GOAL_LINE_NOT_ON_TIES`)
 * @returns {Candidate[]}
 */
function cellCandidates(family, kind, vantage, slots, ctx, held, extra = {}) {
  const cell = arr(rec(rec(/** @type {Rec} */ (GOAL_FAMILY_LINES)[family])[kind])[vantage]);
  if (!cell.length) return [];
  const call = (ctx.calls.n += 1);
  const reserve = arr(rec(rec(/** @type {Rec} */ (GOAL_RESERVE_LINES)[family])[kind])[vantage]);
  // POWERS-16 (the chair's ruling (r2): a faction named in a sentence takes its prose form, from one leaf): the line
  // prints a power slot through display/powerSentenceName.js ("Military/Guard" -> "the Guard"); the slots kept on the
  // card (the keyed intent) keep the record's names, so every reader that matches a power by name still finds it.
  // NAMES-1 (the seventh chair's ruling CN1 of 2026-11-20): WITH ITS ARTICLE ("the Elder Council", "the Guard"), "The" where
  // the slot opens the line (the line's first letter is raised below); the slot contract never writes "the {power}".
  const said = Object.fromEntries(Object.entries({ ...slots, self: HELD_SELF }).map(([k, v]) => [k, PROSE_SLOTS.has(k) && typeof v === 'string' && v ? powerNameWithArticle(v) : v]));
  const people = personCardsOf(slots, ctx);
  const poolId = `goalFamilies:${family}.${kind}.${vantage}`;
  /**
   * GOALS-3 builder 8: the lines are the cell's (`counted`: a held refusal counts on the receipt) or the reserve's (it does
   * not), read off the two tables above, never handed in; every text below is taken off the door's own kept line (`drawn`).
   * @param {boolean} counted @returns {Candidate[]}
   */
  const build = (counted) => {
    /** @type {Candidate[]} */
    const out = [];
    for (const line of counted ? cell : reserve) {
      const { result: kept, notes } = quiet(() => filterDeclared([line], { facts: ctx.facts, poolId, surface: 'npcs' }));
      if (!kept.length) continue;
      const drawn = kept[0];
      // NAMES-3 (CV7): a line's agreement forms (`{power|it|them}`) take their power's own number, from the record's name
      const agreed = fillAgreement(templateOf(drawn), slots);
      // NAMES-1 (CN2): a person's later mention in the line is a pronoun, a surname, a role or a given name
      const sayWith = (/** @type {string} */ self) => { const f = fillLine(agreed, { ...said, self }); return f && secondMentions(f[0].toUpperCase() + f.slice(1), people); };
      const text = sayWith(HELD_SELF);
      if (!text) continue;
      if (held.has(text)) { if (counted) ctx.refusals.n += 1; continue; }
      const used = Object.fromEntries(slotsIn(templateOf(drawn)).map((k) => [k, slots[k]]));
      const fewMembers = typeof extra.members === 'number' && (GOAL_LINE_MIN_MEMBERS[templateOf(drawn)] ?? 0) > extra.members; // BAR8 K-PEOPLE (14h)
      // GOALS-1 (the chair's check of 10:48 UTC): a gentle line on a harsh tie is refused, marked (never dropped), draw-free
      const harshTie = !!extra.tie && arr(rec(/** @type {Rec} */ (GOAL_LINE_NOT_ON_TIES)[templateOf(drawn)])[extra.tie.type]).includes(extra.tie.strength);
      // E8: `{self}` takes the held form in the wording, as the line wrote it before the slot
      out.push({ family, kind, text, target: extra.target ?? null, slots: used, refs: extra.refs ?? [], notes, ...(fewMembers || harshTie ? { refused: true } : {}), wording: wordingOf(drawn, { ...slots, self: HELD_SELF }), call, ...(slotsIn(templateOf(drawn)).includes('self') ? { selfText: sayWith } : {}) });
    }
    return out;
  };
  const out = build(true);
  if (reserve.length) { const kept = build(false); if (kept.length) ctx.reserve.set(call, kept); }
  return out;
}

/**
 * THE GATES (draw-free): every candidate line per family for one vantage of one card.
 * @param {Rec} card @param {Rec[]} cards @param {GoalContext} ctx @param {Vantage} vantage @param {Set<string>} held
 * @param {{ pursuit?: { kind: 'warrant' | 'suspicion', target: Rec } | null }} [opts]
 * @returns {Record<string, Candidate[]>}
 */
export function familyCandidates(card, cards, ctx, vantage, held, opts = {}) {
  /** @type {Record<string, Candidate[]>} */
  const by = {};
  const push = (/** @type {Candidate[]} */ list) => { for (const c of list) (by[c.family] ??= []).push(c); };
  const id = String(card.id);
  const house = houseOf(card, ctx);
  const houseKey = house ? str(house.name) : '';
  const family = house ? familyOfInstitution(house) : null;
  const shelf = family?.shelf || '';
  const memberships = arr(card.memberships).map(rec);

  // RANK (own power): climb (ranked 2/3: {above}), defend (rank 1 with a second: {below}), enter (unranked)
  for (const m of memberships) {
    const power = str(m.power); if (!power) continue;
    const rank = m.rank == null ? null : Number(m.rank);
    const rankOf = (/** @type {number} */ r) => cards.find((c) => c !== card && arr(c?.memberships).some((x) => str(rec(x).power) === power && Number(rec(x).rank) === r));
    if (rank === 2 || rank === 3) {
      const above = rankOf(rank - 1);
      if (above) push(cellCandidates('RANK', 'climb', vantage, { power, above: personName(above) }, ctx, held, { target: { kind: 'npc', id: String(above.id) }, refs: [String(above.id)], members: facesInPower(cards, power).length }));
    } else if (rank === 1) {
      const below = rankOf(2);
      if (below) push(cellCandidates('RANK', 'defend', vantage, { power, below: personName(below) }, ctx, held, { target: { kind: 'npc', id: String(below.id) }, refs: [String(below.id)] }));
    } else {
      push(cellCandidates('RANK', 'enter', vantage, { power }, ctx, held, { target: { kind: 'power', id: power } }));
    }
  }

  // POWER vs RIVAL: a tense / competitive / corrupted relation, or a named conflict
  const mine = new Set(memberships.map((m) => str(m.power)).filter(Boolean));
  for (const r of arr(rec(ctx.view.powerStructure).factionRelationships).map(rec)) {
    const pair = arr(r.pair).map(str); const type = str(r.type);
    if (pair.length !== 2 || !['tense', 'competitive', 'corrupted'].includes(type)) continue;
    for (const [k, power] of pair.entries()) if (mine.has(power)) push(cellCandidates('POWER', type, vantage, { power, rival: pair[1 - k] }, ctx, held, { target: { kind: 'power', id: pair[1 - k] } }));
  }
  for (const c of arr(ctx.view.conflicts).map(rec)) {
    const parties = arr(c.parties).map(str); const issue = issueFill(c.issue);
    if (parties.length !== 2 || !issue) continue;
    for (const [k, power] of parties.entries()) if (mine.has(power)) push(cellCandidates('POWER', 'conflict', vantage, { power, rival: parties[1 - k], issue }, ctx, held, { target: { kind: 'power', id: parties[1 - k] } }));
  }

  // INSTITUTION and SUPPLY: the card's own house (a face in no power — the musician, the fortune teller, the dragon — keeps no books)
  if (house && houseKey && !isNoPowerInstitution(house)) {
    const hf = houseFill(houseKey);
    const own = ctx.chainsByHouse.get(ctx.famKey(houseKey)) || [];
    const impaired = own.filter((ch) => str(ch.status) === 'impaired');
    const target = /** @type {GoalTarget} */ ({ kind: 'house', id: houseKey });
    if (hf) {
      push(cellCandidates('INSTITUTION', 'solvency', vantage, { house: hf }, ctx, held, { target }));
      // POWERS-9 (ROUND-3-CUT-INCREMENT pf#51 pf#421): the house's rights FROM those who govern are no goal of a criminal
      // house (it asks no seal of the seat) nor of the head of the governing power (it IS those who govern). The lines stay
      // in the draw, marked refused, so no card's draw moves; a refused pick resolves draw-free (drawVantage)
      const govPower = str(rec(ctx.powers.find((p) => p.isGoverning)).faction);
      const refuseCharter = ctx.crimHouseNames.has(houseKey) || (!!govPower && memberships.some((m) => str(m.power) === govPower && Number(m.rank) === 1));
      push(cellCandidates('INSTITUTION', 'charter', vantage, { house: hf }, ctx, held, { target }).map((c) => (refuseCharter ? { ...c, refused: true } : c)));
      if (impaired.length) push(cellCandidates('INSTITUTION', 'rebuilding', vantage, { house: hf }, ctx, held, { target }));
      if (TRADING_SHELVES.includes(shelf)) {
        const others = [...new Set(own.flatMap((ch) => arr(ch.processingInstitutions).map((n) => ctx.rosterByFamily.get(ctx.famKey(n)))).filter((n) => n && n !== houseKey))];
        for (const other of others) { const of = houseFill(other); if (of) push(cellCandidates('INSTITUTION', 'takeover', vantage, { house: hf, otherHouse: of }, ctx, held, { target: { kind: 'house', id: other } })); }
      }
      // a chain's name in a goal is PRINTED words (the NPCs tab, the summary, the PDF, the Foundry journal): it is the
      // name the page gives the chain (`chainPrintName`: the toll by the town's access); the target id stays the record's
      for (const ch of impaired) push(cellCandidates('SUPPLY', 'impaired', vantage, { chain: str(chainPrintName(ch, ctx.view).label), house: hf }, ctx, held, { target: { kind: 'chain', id: str(ch.chainId || ch.label) } }));
      // FAULTS-NEED item 2 (11e.wantBuy; the sixth chair's BRIEF-FAULTS, 2026-11-18; vetoable by the owner): a dependency goal
      // presumes a supply of its good ("Secure a steady supply of {resource} …", "Buy {resource} at the market …"), so it is
      // dealt only where the good is brought in or had: where the page's own need list says it is needed and not brought in
      // (`facts/needNotBroughtIn.js`, held equal to `tradeListDisplay.js :: importsAsPrinted().needed`), the lines stay in the
      // draw, marked refused, so no other card's draw moves; a refused pick takes the family's next admitted goal (drawVantage)
      for (const d of ctx.depsByHouse.get(ctx.famKey(houseKey)) || []) {
        const rf = resourceFill(d.resource);
        if (!rf) continue;
        const unmet = ctx.needUnmet(d.resource);
        push(cellCandidates('SUPPLY', 'dependency', vantage, { resource: rf, house: hf }, ctx, held, { target }).map((c) => (unmet ? { ...c, refused: true } : c)));
        // LAST-VARIETY (item 2; LR2): where the good is needed and not brought in, the lines of a house that LACKS it (`want`);
        // LR6 (5): its {resource} names only the goods the need list prints, never the dependency's whole compound
        const wf = unmet ? resourceFill(ctx.needUnmetGoods(d.resource).join(' + ')) : '';
        if (wf) push(cellCandidates('SUPPLY', 'want', vantage, { resource: wf, house: hf }, ctx, held, { target }));
      }
      if (TRADING_SHELVES.includes(shelf)) for (const ch of own.filter((x) => RUNNING_STATUSES.includes(str(x.status)))) push(cellCandidates('SUPPLY', 'expansion', vantage, { chain: str(chainPrintName(ch, ctx.view).label), house: hf }, ctx, held, { target: { kind: 'chain', id: str(ch.chainId || ch.label) } }));
    }
  }
  if (ctx.isolation) {
    push(cellCandidates('SUPPLY', 'isolation', vantage, {}, ctx, held));
    for (const imp of ctx.imports) push(cellCandidates('SUPPLY', 'isolation', vantage, { import: imp }, ctx, held).filter((c) => 'import' in c.slots));
  }

  // TIES: each open tie the card stands at an end of (a covert handler tie is ALLEGIANCE's, not a tie goal)
  for (const t of ctx.ties) {
    if (t.covert === true || t.handler === true) continue;
    const end = String(t.from) === id ? 'from' : String(t.to) === id ? 'to' : null;
    if (!end) continue;
    const kind = rec(rec(/** @type {Rec} */ (TIE_TYPE_TO_GOAL_SUBKIND))[str(t.type)])[end];
    const other = ctx.byId.get(String(end === 'from' ? t.to : t.from));
    if (!kind || !other) continue;
    push(cellCandidates('TIES', kind, vantage, { other: personName(other) }, ctx, held, { target: { kind: 'npc', id: String(other.id) }, refs: [String(other.id)], tie: { type: str(t.type), strength: str(t.strength) } }));
  }

  // PERSONALITY (always): the cluster of the flaw, else the temperament, else the modifier
  const p = rec(card.personality);
  const cluster = [p.flaw, p.dominant, p.modifier].map((w) => /** @type {Rec} */ (PERSONALITY_CLUSTER_OF)[str(w).toLowerCase()]).find(Boolean);
  // GOALS-1 item 6 is NOT read here (GOALS-2, the chair's ruling of 12:05 UTC): the want refused beside the card's own secret is
  // a post-pass after the deal (`refuseWantsBesideSecrets`), so no other card's draw moves
  if (cluster) push(cellCandidates('PERSONALITY', cluster, vantage, {}, ctx, held));

  // ALLEGIANCE: the agent's serve / escape, the front's face, the handler's keep-in-line, the law's pursuit
  const a = allegianceOf(card);
  if (a && a.handler != null) {
    const handler = ctx.byId.get(String(a.handler));
    if (handler) {
      const slots = { guild: guildFill(a), handler: personName(handler) };
      const refs = [String(handler.id)];
      const target = /** @type {GoalTarget} */ (a.power ? { kind: 'power', id: a.power } : { kind: 'house', id: a.house });
      push(cellCandidates('ALLEGIANCE', `serve_${a.vector}`, vantage, slots, ctx, held, { target, refs }));
      push(cellCandidates('ALLEGIANCE', `escape_${a.vector}`, vantage, slots, ctx, held, { target, refs }));
      if (a.via === 'front' && houseKey) {
        const front = houseFill(houseKey);
        if (front) for (const k of ['front_keep', 'front_out']) push(cellCandidates('ALLEGIANCE', k, vantage, { ...slots, front }, ctx, held, { target, refs }));
      }
    }
  }
  for (const { agent, archetype } of ctx.agentsOf.get(id) || []) {
    const kind = /** @type {Rec} */ (KEEP_KIND_OF_ARCHETYPE)[archetype];
    const aa = allegianceOf(agent);
    if (!kind || !aa) continue;
    push(cellCandidates('ALLEGIANCE', kind, vantage, { agent: personName(agent), guild: guildFill(aa) }, ctx, held, { target: { kind: 'npc', id: String(agent.id) }, refs: [String(agent.id)] }));
  }
  if (opts.pursuit) {
    const t = opts.pursuit.target;
    const theirHouse = rec(t.institution).kind === 'house' ? houseFill(str(rec(t.institution).key)) : '';
    const slots = opts.pursuit.kind === 'warrant' ? { target: personName(t), targetHouse: theirHouse } : { target: personName(t) };
    push(cellCandidates('ALLEGIANCE', opts.pursuit.kind, vantage, slots, ctx, held, { target: { kind: 'npc', id: String(t.id) }, refs: [String(t.id)] }));
  }

  // CRISIS (a stress the record holds): today's overrides by the card's role bucket, and the siege goal
  if (ctx.stressType && STRESS_GOAL_OVERRIDES[ctx.stressType] && vantage === 'short') {
    const bucket = stressBucketOf(str(faceOfRole(card))); // TAIL-TITLES K-C: the face, not the holder's form
    const o = bucket ? rec(STRESS_GOAL_OVERRIDES[ctx.stressType])[bucket] : null;
    if (o) {
      const spoken = (/** @type {string} */ l) => resolveSibling(l, NPC_GOAL_SIBLINGS, { facts: ctx.facts, poolId: 'npcGenerator:NPC_GOAL_SIBLINGS', surface: 'npcs', drawKind: 'T' });
      const { result: [kept], notes } = quiet(() => filterDeclared([o], { facts: ctx.facts, poolId: `npcGenerator:STRESS_GOAL_OVERRIDES.${ctx.stressType}`, surface: 'npcs', drawKind: 'T' }));
      const row = rec(kept); const overrideNote = str(row.note); // the override row's own note, a caller-supplied bag (the flavor census's decoy)
      const { result: said, notes: saidNotes } = quiet(() => (kept ? { text: spoken(str(row.short)), crisisNote: overrideNote ? spoken(overrideNote) : null } : null));
      if (said?.text && !held.has(said.text)) push([{ family: 'CRISIS', kind: bucket, text: said.text, target: null, slots: {}, refs: [], crisisNote: said.crisisNote, notes: [...notes, ...saidNotes], wording: said.text }]);
    }
  }
  if (ctx.stresses.includes('under_siege')) {
    const rows = SIEGE_GOALS(ctx.commodity);
    rows.forEach((row, k) => {
      const { result: [kept], notes } = quiet(() => filterDeclared([row], { facts: ctx.facts, poolId: 'npcGenerator:STRESS_GOALS', surface: 'npcs' }));
      if (!kept) return;
      const { result: text, notes: saidNotes } = quiet(() => resolveSibling(str(rec(kept)[vantage]), NPC_GOAL_SIBLINGS, { facts: ctx.facts, poolId: 'npcGenerator:NPC_GOAL_SIBLINGS', surface: 'npcs', drawKind: 'T' }));
      if (text && !held.has(text)) push([{ family: 'CRISIS', kind: `siege_${k}`, text, target: null, slots: {}, refs: [], notes: [...notes, ...saidNotes], wording: text }]);
    });
  }
  return by;
}

/** The record's pull on a family for this card (design §6.2). @param {string} family @param {Rec} card @param {GoalContext} ctx @param {Vantage} vantage */
function fitOf(family, card, ctx, vantage) {
  const F = GOAL_FAMILY_TUNING.fit;
  const ranks = arr(card.memberships).map((m) => rec(m).rank).filter((r) => r != null).map(Number);
  const house = houseOf(card, ctx);
  const shelf = house ? familyOfInstitution(house)?.shelf || '' : '';
  switch (family) {
    case 'RANK': return ranks.some((r) => r === 2 || r === 3) ? F.rankClimb : 1;
    case 'POWER': return ranks.includes(1) ? F.powerFirst : 1;
    case 'SUPPLY': return SUPPLY_FIT_SHELVES.includes(shelf) ? F.supplyTrade : 1;
    case 'INSTITUTION': return house && (ctx.chainsByHouse.get(ctx.famKey(house.name)) || []).some((ch) => str(ch.status) === 'impaired') ? F.institutionImpaired : 1;
    case 'ALLEGIANCE': {
      if (allegianceOf(card) && vantage === 'short') return F.allegianceAgentShort;
      return ctx.agentsOf.has(String(card.id)) ? F.allegianceHandler : 1;
    }
    case 'CRISIS': return F.crisisStress;
    case 'PERSONALITY': return F.personality;
    default: return 1;
  }
}

/**
 * The next admitted candidate after a refused pick: the rest of its family's list in order (wrapping), then the other
 * drawn families' lists in their order. Draw-free. @param {Record<string, Candidate[]>} by @param {string} family
 * @param {Candidate} picked @param {string[]} families @returns {Candidate | null}
 */
function admittedAfter(by, family, picked, families) {
  const own = by[family] || [];
  const at = own.indexOf(picked);
  for (let k = 1; k < own.length; k += 1) { const c = own[(at + k) % own.length]; if (!c.refused) return c; }
  for (const f of families) if (f !== family) { const c = (by[f] || []).find((x) => !x.refused); if (c) return c; }
  return null;
}

/**
 * ONE WEIGHTED DRAW for one vantage: the family by weight, then the sub-kind evenly, then the line evenly.
 * @param {Rec} card @param {Record<string, Candidate[]>} by @param {GoalContext} ctx @param {Vantage} vantage
 * @param {{ weightedPick: Function, pick: Function }} fork @param {string | null} notFamily
 */
function drawVantage(card, by, ctx, vantage, fork, notFamily) {
  const families = DRAWN_FAMILIES.filter((f) => f !== notFamily && by[f]?.length);
  if (!families.length) return { chosen: null, weights: {} };
  const weights = Object.fromEntries(families.map((f) => [f, /** @type {Rec} */ (GOAL_FAMILY_TUNING.base)[f] * fitOf(f, card, ctx, vantage)]));
  const family = families.length === 1 ? families[0] : fork.weightedPick(families, families.map((f) => weights[f]));
  const kinds = [...new Set(by[family].map((c) => c.kind))];
  const kind = kinds.length === 1 ? kinds[0] : fork.pick(kinds);
  const lines = by[family].filter((c) => c.kind === kind);
  const picked = lines.length === 1 ? lines[0] : fork.pick(lines);
  // POWERS-9: a refused pick takes the next admitted candidate after it (its own family's first, then the families in
  // their drawn order), draw-free; none admitted deals nothing
  const chosen = picked?.refused ? admittedAfter(by, family, picked, families) : picked;
  return { chosen, weights };
}

/** The intent row of a drawn candidate. @param {Candidate} c */
const intentOf = (c) => ({ family: c.family, kind: c.kind, key: intentKeyOf(c.family, c.kind), target: c.target });

/** The receipts beside each returned cast. @type {WeakMap<object, Rec[]>} */
const RECEIPTS = new WeakMap();

/** The goal receipts A9 left beside a cast it returned (or an empty list). @param {unknown} cards @returns {Rec[]} */
export function goalReceiptsOf(cards) {
  return (cards && typeof cards === 'object' && RECEIPTS.get(/** @type {object} */ (cards))) || [];
}

/** A drawn candidate's ROTATION GROUP (GR1): the candidates of its `cellCandidates` call in list order, as the draw holds
 * them (a refusal marked on the list kept), then the call's reserve candidates unless every one of the call's own is
 * refused; a candidate of no call (a crisis line, the floor) is its own group. @param {Candidate | null} chosen @param {Candidate[]} pool @param {GoalContext} ctx @returns {Candidate[]} */
function groupOf(chosen, pool, ctx) {
  if (!chosen) return [];
  if (chosen.call == null) return [chosen];
  const main = pool.filter((c) => c.call === chosen.call);
  // a call its caller refused as a whole (the charter of a criminal house or of the governing head, a dependency whose good
  // is not brought in) lends no reserve line: draw-free, the callers as they are
  const group = [...main, ...(main.some((c) => !c.refused) ? (ctx.reserve.get(chosen.call) || []) : [])];
  return group.includes(chosen) ? group : [chosen];
}

/**
 * The NAME values a candidate filled (the slots `wordingOf` masks), sorted, as one key: a sentence and its mirror share it
 * (GOALS-1, the chair's ruling of 10:58 UTC); '' for a line that names no one (or a keeper's text, whose slots are not known).
 * @param {Candidate | null} c @returns {string}
 */
const namesOf = (c) => { const v = Object.entries(c?.slots || {}).filter(([k]) => NAME_SLOTS.has(k)).map(([, x]) => String(x)).sort(); return v.length ? JSON.stringify(v) : ''; };

/**
 * GR1's "apart" (pass two's rungs (ii) and (iii), and the post-pass's): two cards neither of one house nor tied, and (with
 * `power`) sharing no power. @param {GoalContext} ctx @returns {(a: Rec, b: Rec, power: boolean) => boolean}
 */
function apartIn(ctx) {
  const tied = new Set(ctx.ties.flatMap((t) => [`${t.from}\u0000${t.to}`, `${t.to}\u0000${t.from}`]));
  const houseKey = (/** @type {Rec} */ c) => (rec(c.institution).kind === 'house' ? str(rec(c.institution).key) : '');
  return (a, b, power) => !(houseKey(a) && houseKey(a) === houseKey(b)) && !tied.has(`${a.id}\u0000${b.id}`) && !(power && sharesPower(a, b));
}

/** The two vantages, in the order a card holds them. */
const VANTAGES = /** @type {const} */ (['short', 'long']);
/** A card's keyed intent at one vantage, read by its own key (`intent.short`, `intent.long`), never by a computed index. @param {unknown} intent @param {Vantage} v @returns {Rec} */
const intentAt = (intent, v) => rec(v === 'long' ? rec(intent).long : rec(intent).short);

/**
 * A9 — DEAL THE GOALS over the final cast (design §2): each card's SHORT and LONG goal, from two
 * different families its record supports, on its own keyed fork. Returns a NEW array of new card
 * objects (`goal: { short, long, intent }`; a CRISIS override's note as `stressNote`); the receipts
 * ride beside it (`goalReceiptsOf`). Cards in `keep` (a regeneration's preserved keepers) are passed
 * through untouched, and their texts are held.
 *
 * GR1 (GOALS-1, the chair's rule and rulings of 2026-11-20 10:28 UTC): within one town no two people hold the same goal
 * WORDING (`wordingOf`: the line with the town's names masked). PASS ONE is the deal above, every draw and every held
 * text as it was. A holding is a REPEAT iff an earlier holding of pass one (or a keeper) has its wording; a non-repeater
 * is never moved. PASS TWO, in roster order, short then long, counts the holders of each wording (every non-repeater's,
 * then each wording pass two assigns) and gives each repeat, in rotation order from the index it drew (k = 0 the drawn
 * candidate itself, a refused line skipped), NO NEW DRAW: (i) the first wording nobody holds ('free'); else (ii) the
 * first held once by someone not of its house, not tied to it and sharing no power with it ('twice'); else (iii) the
 * first held once by someone neither of its house nor tied to it ('twice-same-power'); else (iv) the drawn wording
 * stands ('stands'). A SENTENCE AND ITS MIRROR ARE ONE (the chair's ruling of 10:58 UTC): rungs (ii) and (iii) never take
 * a wording whose one holder filled its name slots with the same values as this card's, in either order (`namesOf`).
 * GOALS-3 (builder 7; the chair's gate of 12:32 UTC and rulings of 13:17 UTC): NO GOAL SENTENCE PRINTED TWICE IN ONE TOWN.
 * (a) rungs (ii)/(iii) and the mirror see EVERY holder of the wording (each holding placed so far, and each later repeat
 * whose pass-one wording it still is), and never take a candidate whose filled text the town prints; (b) rung (iv) stands
 * on the drawn wording only where its text is nobody's, else takes the first in rotation order whose text nobody prints
 * (still 'stands', rotated), else the drawn wording stands as 'exhausted'; (d) a floor that repeats walks its cluster's
 * cell, then its reserve, to the first line nobody prints ('free', rotated: indices in that walk), else 'exhausted'.
 * The receipt names the rung (`receipt.repeat[vantage]`), the pass-one wording (`drawn`) and any
 * move (`rotated: { from, to }`, indices in the group). The presumption ledger records
 * each card's FINAL lines, after pass two, in card order, short then long.
 * @param {Rec} settlement the settlement-shaped object at the seam
 * @param {Rec[]} cards the final cast (ranks, allegiances and handlers written)
 * @param {Rec[]} relationships the ties drawn over that cast
 * @param {{ fork: (label: string) => any } | null} rng the seam's stream; null deals nothing
 * @param {{ keep?: Set<string> }} [options]
 * @returns {Rec[]}
 */
export function dealGoals(settlement, cards, relationships, rng, options = {}) {
  if (!rng || typeof rng.fork !== 'function' || !Array.isArray(cards) || !cards.length) return cards;
  const keep = options.keep || new Set();
  const ctx = goalContextOf(settlement, cards, relationships);
  const family = rng.fork(GOALS_FORK_LABEL);
  const heldShort = new Set(); const heldLong = new Set();
  for (const c of cards) if (keep.has(String(c?.id))) { if (c?.goal?.short) heldShort.add(heldText(c.goal.short).trim()); if (c?.goal?.long) heldLong.add(heldText(c.goal.long).trim()); }
  const U = GOAL_FAMILY_TUNING.uncanny;
  const pUncanny = ctx.magic ? (/** @type {Rec} */ (U.perCard)[ctx.tier] ?? 0) : 0;
  let uncannyDealt = 0;
  /** @type {Rec[]} */
  const receipts = [];
  /** @typedef {{ card: Rec, receipt: Rec, short: Candidate | null, long: Candidate | null, groups: { short: Candidate[], long: Candidate[] }, drawn: { short: string | null, long: string | null }, rotated: Rec }} Dealt */
  /** PASS ONE: the deal, every draw and every held text as before; each holding's rotation group recorded. @type {Array<Dealt | null>} */
  const dealt = cards.map((card) => {
    if (!card || card.id == null || keep.has(String(card.id))) return null;
    const fork = family.fork(String(card.id));
    /** @type {Rec} */
    const receipt = { id: String(card.id), refs: [] };
    ctx.refusals.n = 0;
    /** @type {Candidate | null} */ let short = null;
    /** @type {Candidate[]} */ let shortPool = [];
    /** @type {{ kind: 'warrant' | 'suspicion', target: Rec } | null} */ let pursuit = null;
    // (1) THE LAW'S PURSUIT (§3.5): a WARRANT where an open criminal face stands, else a SUSPICION where an agent does
    if (isLawFace(card, ctx)) {
      const { pWarrant, pSuspicion } = pursuitChances(card, ctx);
      const law = /** @type {Rec} */ ({ pWarrant, pSuspicion, landed: null });
      for (const kind of /** @type {const} */ (['warrant', 'suspicion'])) {
        const pool = pursuitTargetsOf(card, cards, ctx, kind);
        law[`${kind}Pool`] = pool.length;
        receipt.refs.push(...pool.map((t) => String(t.card.id)));
        if (!pool.length) continue;
        if (!fork.chance(kind === 'warrant' ? pWarrant : pSuspicion)) continue;
        const target = pool.length === 1 ? pool[0].card : fork.weightedPick(pool.map((t) => t.card), pool.map((t) => t.weight));
        pursuit = { kind, target };
        const allegiance = familyCandidates(card, cards, ctx, 'short', heldShort, { pursuit }).ALLEGIANCE || [];
        const cands = allegiance.filter((c) => c.kind === kind);
        if (cands.length) { short = cands.length === 1 ? cands[0] : fork.pick(cands); shortPool = allegiance; law.landed = kind; }
        break;
      }
      receipt.law = law;
    }
    // (2) THE UNCANNY ROLL (the owner's word): magic ON only, a per-card chance, a hard cap per settlement
    if (!short && pUncanny > 0 && uncannyDealt < U.capPerSettlement) {
      const landed = fork.chance(pUncanny);
      receipt.uncanny = { p: pUncanny, landed };
      if (landed) {
        const kinds = Object.keys(rec(GOAL_FAMILY_LINES.UNCANNY));
        const all = kinds.flatMap((k) => uncannyCandidates(k, ctx, heldShort));
        const okKinds = [...new Set(all.map((c) => c.kind))];
        if (okKinds.length) {
          const kind = okKinds.length === 1 ? okKinds[0] : fork.pick(okKinds);
          const lines = all.filter((c) => c.kind === kind);
          short = lines.length === 1 ? lines[0] : fork.pick(lines);
          shortPool = all;
          uncannyDealt += 1;
        }
      }
    }
    // (3) THE SHORT DRAW, then (4) THE LONG DRAW from another family
    if (!short) {
      const by = familyCandidates(card, cards, ctx, 'short', heldShort);
      const d = drawVantage(card, by, ctx, 'short', fork, null);
      receipt.shortWeights = d.weights;
      short = d.chosen;
      shortPool = Object.values(by).flat();
    }
    const longPursuit = pursuit ? null : lawLongPursuit(card, cards, ctx);
    const byLong = familyCandidates(card, cards, ctx, 'long', heldLong, { pursuit: longPursuit });
    const dl = drawVantage(card, byLong, ctx, 'long', fork, short ? short.family : null);
    receipt.longWeights = dl.weights;
    let long = dl.chosen;
    const groups = { short: groupOf(short, shortPool, ctx), long: groupOf(long, Object.values(byLong).flat(), ctx) };
    // the floor (never a card without a goal): every family held → the card's own cluster, held or not; never rotated
    if (!short) { short = personalityFloor(card, 'short'); groups.short = short ? [short] : []; receipt.floor = true; }
    if (!long) { long = personalityFloor(card, 'long'); groups.long = long ? [long] : []; receipt.floor = true; }
    if (short) heldShort.add(short.text);
    if (long) heldLong.add(long.text);
    receipt.refused = ctx.refusals.n;
    receipts.push(receipt);
    return { card, receipt, short, long, groups, drawn: { short: short?.wording ?? null, long: long?.wording ?? null }, rotated: {} };
  });

  // PASS TWO (GR1): repeat status from pass one alone; the holders of each wording counted; each repeat takes its rung
  /** @typedef {{ card: Rec, names: string, text: string }} Holding a holder of a wording: its card, the name values it filled (a keeper's are unknown: ''), its text */
  /** the holdings placed so far, by wording @type {Map<string, Holding[]>} */ const holders = new Map();
  /** GOALS-3 (a): every LATER repeat whose pass-one wording it still is, by wording @type {Map<string, Holding[]>} */ const pending = new Map();
  /** GOALS-3 (b): every text the town prints now (each placed holding, each repeat still on its pass-one text), counted @type {Map<string, number>} */ const printed = new Map();
  const add = (/** @type {Map<string, Holding[]>} */ m, /** @type {string} */ key, /** @type {Holding} */ h) => { const l = m.get(key); if (l) l.push(h); else m.set(key, [h]); };
  const print = (/** @type {string} */ text, /** @type {number} */ n) => { const k = (printed.get(text) || 0) + n; if (k > 0) printed.set(text, k); else printed.delete(text); };
  const holdingOf = (/** @type {Rec} */ card, /** @type {Candidate | null} */ cand, /** @type {string} */ text) => ({ card, names: namesOf(cand), text });
  const hold = (/** @type {string} */ key, /** @type {Rec} */ card, /** @type {Candidate | null} */ cand, /** @type {string} */ text) => { add(holders, key, holdingOf(card, cand, text)); print(text, 1); };
  /** @type {Set<string>} */ const prior = new Set();
  for (const c of cards) if (c && keep.has(String(c.id))) for (const v of VANTAGES) { const t = c.goal?.[v]; if (t) { const key = heldText(t).trim(); prior.add(key); hold(key, c, null, key); } }
  /** @type {Array<{ d: Dealt, v: Vantage, h: Holding }>} */ const repeats = [];
  for (const d of dealt) if (d) for (const v of VANTAGES) {
    const c = d[v]; if (!c) continue;
    if (prior.has(c.wording)) { const h = holdingOf(d.card, c, c.text); repeats.push({ d, v, h }); add(pending, c.wording, h); print(c.text, 1); } else hold(c.wording, d.card, c, c.text);
    prior.add(c.wording);
  }
  const apart = apartIn(ctx);
  /** GOALS-3 (b): a text some card of the town prints now @param {string} text */
  const isPrinted = (text) => printed.has(text);
  for (const { d, v, h: mine } of repeats) {
    const drawn = /** @type {Candidate} */ (d[v]);
    // this repeat leaves the waiting holders: its own pass-one text is no other card's
    const waiting = /** @type {Holding[]} */ (pending.get(drawn.wording)); waiting.splice(waiting.indexOf(mine), 1);
    print(drawn.text, -1);
    /** @type {[string, Candidate]} */ let pick;
    /** @type {{ from: number, to: number } | null} */ let rotated = null;
    if (drawn.floor) {
      // GOALS-3 (d): the floor walks its cluster's cell, then its reserve, to the first line nobody prints; 'exhausted' when none
      const floor = /** @type {Candidate} */ (personalityFloor(d.card, v, false, isPrinted));
      const stays = !!floor.exhausted || floor.text === drawn.text;
      pick = [floor.exhausted ? 'exhausted' : stays ? 'stands' : 'free', stays ? drawn : floor];
      if (!stays) { const lines = floorLinesOf(d.card, v, false); rotated = { from: Math.max(0, lines.indexOf(drawn.text)), to: lines.indexOf(floor.text) }; }
    } else {
      const group = d.groups[v].length ? d.groups[v] : [drawn];
      const at = Math.max(0, group.indexOf(drawn));
      const order = group.map((_, k) => group[(at + k) % group.length]).filter((x) => !x.refused);
      const count = (/** @type {Candidate} */ x) => (holders.get(x.wording) || []).length;
      // GOALS-3 (a): rungs (ii)/(iii) and the mirror see EVERY holder of the wording, the later repeats still on it included
      const every = (/** @type {Candidate} */ x) => [...(holders.get(x.wording) || []), ...(pending.get(x.wording) || [])];
      // the mirror (10:58 UTC): a holder filled the name slots with this card's values, in either order
      const mirror = (/** @type {Candidate} */ x, /** @type {Holding[]} */ hs) => { const n = namesOf(x); return !!n && hs.some((h) => h.names === n); };
      // GOALS-3 (a): never a candidate whose filled text a holder prints (a line that names no one IS its sentence; the mirror's
      // `!!n` let it through), read on the town's printed texts, which hold every holder's
      const once = (/** @type {Candidate} */ x, /** @type {boolean} */ power) => {
        const hs = every(x);
        return hs.length === 1 && apart(hs[0].card, d.card, power) && !mirror(x, hs) && !isPrinted(x.text);
      };
      /** @type {[string, Candidate | undefined][]} */
      const rungs = [['free', order.find((x) => count(x) === 0)], ['twice', order.find((x) => once(x, true))], ['twice-same-power', order.find((x) => once(x, false))]];
      // GOALS-3 (b): rung (iv) stands on the drawn wording only where its text is nobody's; else the first in rotation order whose
      // text nobody prints; none: the drawn wording stands, 'exhausted'
      const walked = isPrinted(drawn.text) ? order.find((x) => !isPrinted(x.text)) : drawn;
      pick = /** @type {[string, Candidate]} */ (rungs.find(([, x]) => x) || (walked ? ['stands', walked] : ['exhausted', drawn]));
      if (pick[1] !== drawn) rotated = { from: at, to: group.indexOf(pick[1]) };
    }
    const [rung, took] = pick;
    hold(took.wording, d.card, took, took.text);
    (d.receipt.repeat ??= {})[v] = rung;
    if (rotated) { d[v] = took; d.rotated[v] = rotated; }
  }

  const out = cards.map((card, i) => {
    const d = dealt[i];
    if (!d) return card;
    const { receipt, short, long } = d;
    noteDrawn(short); noteDrawn(long);
    for (const c of [short, long]) if (c) receipt.refs.push(...c.refs);
    for (const v of VANTAGES) {
      const c = d[v];
      // GOALS-2: the FINAL wording, so the post-pass knows the town's (`refuseWantsBesideSecrets`)
      receipt[v] = c && { family: c.family, kind: c.kind, slots: c.slots, wording: c.wording, drawn: d.drawn[v], ...(d.rotated[v] ? { rotated: d.rotated[v] } : {}) };
    }
    /** @type {Rec} */
    const next = { ...card, goal: { short: writtenText(short, card), long: writtenText(long, card), intent: { short: short ? intentOf(short) : null, long: long ? intentOf(long) : null } } }; // E8: the slot written
    if (short?.family === 'CRISIS' && short.crisisNote) next.stressNote = short.crisisNote;
    else if ('stressNote' in next && short?.family !== 'CRISIS') delete next.stressNote;
    return next;
  });
  RECEIPTS.set(out, receipts);
  return out;
}

/**
 * GOALS-2 (builder 6; the chair's rulings of 2026-11-20 12:05 and 12:37 UTC (A); GOALS-1 item 6 and AMENDMENT 3 item 8): THE
 * WANT REFUSED BESIDE THE CARD'S OWN SECRET, ONE POST-PASS AFTER THE RARE DEAL. The deal (`dealGoals`) reads no closed list;
 * the rare deal (`people/rareSecrets.js :: dealRareSecrets`) reads the deal's wants; this pass runs ONCE after both,
 * draw-free, and NO OTHER CARD IS TOUCHED (a refused want is a PERSONALITY line and names no one, so the rare deal's output
 * is the same with the pass on or off). Each card is read by its FINAL secret: a card with THE REFUSED PAIRING (a want of a
 * refused cluster, `GOAL_SECRET_REFUSED_CLUSTERS`, short or long, beside its own secret of the closed list, `secretRefuses`,
 * or a rare row of `GOAL_SECRET_REFUSAL_RARE_KEYS`, `rareRowOf`) takes the next admitted candidate no card of the town holds
 * that passes the rungs. THE TOOTH, for every card whose final secret is a rare row naming a person: the same family, kind
 * and target first where its cell allows, else a candidate aimed at that person is skipped. Both seams call it the same
 * way (`generateSettlementPipeline.js :: regenNPCsPipeline`, `narrativeGenerator.js :: generateCoherence`), so they cannot
 * drift.
 * THE WALK: the card's candidates rebuilt over the cast with every OTHER card's final text held; its own PERSONALITY list from
 * the refused line, wrapping, then the drawn families in `DRAWN_FAMILIES` order, the family of its other vantage left out (two
 * goals, two families); a refused candidate skipped; a call's reserve candidates (`ctx.reserve`) after that call's own, as
 * `groupOf` orders a rotation group. THE RUNGS, on the WORDING (`receipt[v].wording`, from `goalReceiptsOf`; a keeper's is
 * its text): (i) the first whose wording no card of the town holds; else (ii) the first held once by a card not of its
 * house, not tied to it, sharing no power, and not its mirror (`namesOf`); else (iii) the same with a power shared; else (iv)
 * the first in walk order whose text nobody prints, else the first, its receipt's rung 'exhausted' (GOALS-3: (ii)/(iii) never
 * take a text the town prints). None at all: the floor's next cluster (`personalityFloor(card, v, true, printed)`, walking its
 * cell and its reserve). The intent follows the
 * text; a CRISIS line's note goes to `stressNote` as the deal writes it; the moved card's receipt names the new holding and
 * `refusedBy` ('secret' or 'rare-secret'). The receipts are read from `options.receiptsOf` (the array `dealGoals` returned:
 * the rare deal returns a new array, which carries none), else from `cast`; the returned array carries them, the moved
 * cards' updated. Keepers (`options.keep`) are never touched; a cast with no hit is returned as it is (the same array).
 * @param {Rec} settlement the settlement-shaped object the goals were dealt on @param {Rec[]} cast the rare deal's cast
 * @param {Rec[]} relationships the ties
 * @param {{ keep?: Set<string>, receiptsOf?: Rec[] }} [options] `keep`: a regeneration's keepers; `receiptsOf`: the deal's array
 * @returns {Rec[]}
 */
export function refuseWantsBesideSecrets(settlement, cast, relationships, options = {}) {
  if (!Array.isArray(cast) || !cast.length) return cast;
  const keep = options.keep || new Set();
  /** @type {RegExp[] | null} */ let rows = null;
  const rowsOf = () => (rows ??= refusalRowsOf(settlement));
  const hits = cast.map((c) => {
    if (!c || c.id == null || keep.has(String(c.id))) return null;
    const vs = VANTAGES.filter((v) => { const it = intentAt(rec(rec(c).goal).intent, v); return it.family === 'PERSONALITY' && refusedCluster(it.kind); });
    if (!vs.length) return null;
    const r = rareRowOf(rec(c).secret); // the final secret: a rare row (its name, for the tooth), else the card's own
    const rare = !!r && GOAL_SECRET_REFUSAL_RARE_KEYS.includes(str(r.row.key));
    return rare || secretRefuses(c, rowsOf) ? { vs, rare, name: r?.name ?? null } : null;
  });
  if (!hits.some(Boolean)) return cast;
  const ctx = goalContextOf(settlement, cast, arr(relationships));
  const apart = apartIn(ctx);
  const receipts = goalReceiptsOf(options.receiptsOf ?? cast).slice();
  const receiptAt = new Map(receipts.map((r, k) => [String(r.id), k]));
  const refuse = (/** @type {Candidate} */ c) => (c.family === 'PERSONALITY' && refusedCluster(c.kind) ? { ...c, refused: true } : c);
  /** a family's list with each call's reserve after the call's own (`groupOf`: none where every one of the call's is refused) @param {Candidate[]} list */
  const withReserve = (list) => list.flatMap((c, k) => (c.call != null && list[k + 1]?.call !== c.call && list.some((x) => x.call === c.call && !x.refused)
    ? [c, ...(ctx.reserve.get(c.call) || []).map(refuse)] : [c]));
  const out = cast.slice();
  hits.forEach((hit, i) => {
    if (!hit) return;
    const card = rec(out[i]);
    const id = String(card.id);
    const goal = { ...rec(card.goal), intent: { ...rec(rec(card.goal).intent) } };
    const named = hit.name ? [...ctx.byId.values()].find((x) => personName(x) === hit.name) : null;
    /** @type {string | null} */ let note = null;
    for (const v of hit.vs) {
      const held = new Set(out.filter((x, k) => k !== i && x?.goal?.[v]).map((x) => heldText(x.goal[v]).trim())); // E8: in the held form
      // the town's holdings by wording (every card's both vantages, this holding left out), with the name values each filled
      /** @type {Map<string, Array<{ card: Rec, names: string }>>} */ const holders = new Map();
      /** GOALS-3 (b): every text the town prints, this holding left out @type {Set<string>} */ const printed = new Set();
      out.forEach((x, k) => {
        for (const w of VANTAGES) {
          const t = k === i ? goal[w] : x?.goal?.[w];
          if (!t || (k === i && w === v)) continue;
          const rv = rec(rec(receipts[receiptAt.get(String(x.id)) ?? -1])[w]);
          const key = typeof rv.wording === 'string' ? rv.wording : heldText(t).trim();
          const h = { card: k === i ? card : rec(x), names: rv.slots ? namesOf(/** @type {any} */ ({ slots: rv.slots })) : '' };
          printed.add(heldText(t));
          const list = holders.get(key); if (list) list.push(h); else holders.set(key, [h]);
        }
      });
      const old = intentAt(goal.intent, v);
      const other = str(intentAt(goal.intent, v === 'short' ? 'long' : 'short').family);
      const by = familyCandidates(card, out, ctx, v, held, { pursuit: v === 'long' ? lawLongPursuit(card, out, ctx) : null });
      const own = (by.PERSONALITY || []).map(refuse);
      const picked = own.find((c) => c.text === heldText(goal[v])) || own.find((c) => c.kind === old.kind) || null;
      const at = picked ? own.indexOf(picked) : -1;
      const families = DRAWN_FAMILIES.filter((f) => f !== 'PERSONALITY' && f !== other && by[f]?.length);
      let walk = [...withReserve(own.map((_, k) => own[(at + 1 + k) % own.length])), ...families.flatMap((f) => withReserve(by[f].map(refuse)))].filter((c) => !c.refused);
      if (named) {
        const sameTarget = (/** @type {Candidate} */ c) => c.family === old.family && c.kind === old.kind && JSON.stringify(c.target ?? null) === JSON.stringify(old.target ?? null);
        const aimsAtNamed = (/** @type {Candidate} */ c) => !!named && c.target?.kind === 'npc' && String(c.target.id) === String(named.id);
        walk = walk.some(sameTarget) ? walk.filter(sameTarget) : walk.filter((c) => !aimsAtNamed(c));
      }
      const count = (/** @type {Candidate} */ c) => (holders.get(c.wording) || []).length;
      // GOALS-3 (a): never a candidate whose filled text the town prints (a line that names no one IS its sentence)
      const once = (/** @type {Candidate} */ c, /** @type {boolean} */ power) => {
        const h = holders.get(c.wording);
        return !!h && h.length === 1 && apart(h[0].card, card, power) && !(namesOf(c) && namesOf(c) === h[0].names) && !printed.has(c.text);
      };
      // GOALS-3 (b): the fallback is the first in walk order whose text nobody prints; only where none is, the first, 'exhausted';
      // no walk at all: the floor's next cluster, walking its cell and its reserve (`personalityFloor`)
      const isPrinted = (/** @type {string} */ t) => printed.has(t);
      const fallback = walk.find((c) => !isPrinted(c.text)) || (walk[0] ? { ...walk[0], exhausted: true } : null) || personalityFloor(card, v, true, isPrinted);
      const took = walk.find((c) => count(c) === 0) || walk.find((c) => once(c, true)) || walk.find((c) => once(c, false)) || fallback;
      if (!took) continue;
      noteDrawn(took);
      goal[v] = writtenText(took, card); // E8: the slot written
      goal.intent[v] = intentOf(took);
      if (v === 'short' && took.family === 'CRISIS' && took.crisisNote) note = took.crisisNote; // as the deal writes it
      const k = receiptAt.get(id);
      const prev = k == null ? { id, refs: [] } : rec(receipts[k]);
      // GOALS-3: the rung names the new holding: 'exhausted' where it prints a text the town prints, else no rung of the deal's
      const repeat = { ...rec(prev.repeat) }; if (took.exhausted) repeat[v] = 'exhausted'; else if (repeat[v] === 'exhausted') delete repeat[v];
      const next = { ...prev, refs: [...arr(prev.refs), ...took.refs], ...(Object.keys(repeat).length || prev.repeat ? { repeat } : {}), [v]: { family: took.family, kind: took.kind, slots: took.slots, wording: took.wording, refusedBy: hit.rare ? 'rare-secret' : 'secret' } };
      if (k == null) { receiptAt.set(id, receipts.length); receipts.push(next); } else receipts[k] = next;
    }
    out[i] = { ...card, goal, ...(note ? { stressNote: note } : {}) };
  });
  RECEIPTS.set(out, receipts);
  return out;
}

/** GOALS-1 AMENDMENT 3 (item 8): the name `data/people/goalSecretRefusals.js` gives the one post-pass (an alias, one body). */
export const refuseAfterRareSecrets = refuseWantsBesideSecrets;

/**
 * The law face's LONG pursuit (the enforcer's life's direction), where no SHORT pursuit landed: draw-free,
 * the heaviest target of the warrant pool, else of the suspicion pool (ties by roster order).
 * @param {Rec} card @param {Rec[]} cards @param {GoalContext} ctx
 * @returns {{ kind: 'warrant' | 'suspicion', target: Rec } | null}
 */
function lawLongPursuit(card, cards, ctx) {
  if (!isLawFace(card, ctx)) return null;
  for (const kind of /** @type {const} */ (['warrant', 'suspicion'])) {
    const pool = pursuitTargetsOf(card, cards, ctx, kind);
    if (pool.length) return { kind, target: pool.reduce((best, t) => (t.weight > best.weight ? t : best)).card };
  }
  return null;
}

/** The UNCANNY candidates of one kind: the shrine, the priest and the arcane house filled from the record. @param {string} kind @param {GoalContext} ctx @param {Set<string>} held */
function uncannyCandidates(kind, ctx, held) {
  const religious = ctx.houses.find((h) => familyOfInstitution(h)?.shelf === 'Religious');
  const arcane = ctx.houses.find((h) => familyOfInstitution(h)?.shelf === 'Magic');
  const cleric = rec(rec(ctx.facts()).faith).seniorCleric;
  const slots = { shrine: religious ? houseFill(religious.name) : '', priest: str(rec(cleric).name), arcaneHouse: arcane ? houseFill(arcane.name) : '' };
  return cellCandidates('UNCANNY', kind, String(GOAL_FAMILY_TUNING.uncanny.vantage) === 'long' ? 'long' : 'short', slots, ctx, held);
}

/** The floor's cluster: the card's own (flaw, dominant, modifier), a refused one skipped where `refuse`, else `caution`. @param {Rec} card @param {boolean} refuse */
const floorClusterOf = (card, refuse) => {
  const p = rec(card.personality);
  return [p.flaw, p.dominant, p.modifier].map((w) => /** @type {Rec} */ (PERSONALITY_CLUSTER_OF)[str(w).toLowerCase()]).find((c) => c && !(refuse && refusedCluster(c))) || 'caution';
};

/**
 * GOALS-3 (d): the floor's lines in walk order: its cluster's cell, then that cell's reserve (`GOAL_RESERVE_LINES.PERSONALITY`,
 * never drawn). @param {Rec} card @param {Vantage} vantage @param {boolean} refuse @returns {string[]}
 */
function floorLinesOf(card, vantage, refuse) {
  const cluster = floorClusterOf(card, refuse);
  const of = (/** @type {unknown} */ table) => arr(rec(rec(rec(table).PERSONALITY)[cluster])[vantage]).map(templateOf).filter(Boolean);
  return [...of(GOAL_FAMILY_LINES), ...of(GOAL_RESERVE_LINES)];
}

/**
 * The floor: the card's own cluster's first line (no draw), held or not. GOALS-1 item 6: where the card's secret refuses its
 * cluster (`refuse`), the next of its clusters in the order the deal reads them (flaw, dominant, modifier), else `caution`.
 * GOALS-3 (d): given `printed` (whether some card of the town prints a text), the first line of the cell, then of its
 * reserve, that nobody prints; only where every one is printed, the first line, marked `exhausted`. Every floor is `floor`.
 * @param {Rec} card @param {Vantage} vantage @param {boolean} [refuse] @param {((text: string) => boolean) | null} [printed]
 * @returns {Candidate | null}
 */
function personalityFloor(card, vantage, refuse = false, printed = null) {
  const lines = floorLinesOf(card, vantage, refuse);
  if (!lines.length) return null;
  const free = printed ? lines.find((t) => !printed(t)) : lines[0];
  const text = free ?? lines[0];
  return { family: 'PERSONALITY', kind: floorClusterOf(card, refuse), text, target: null, slots: {}, refs: [], wording: text, floor: true, ...(free == null ? { exhausted: true } : {}) };
}
