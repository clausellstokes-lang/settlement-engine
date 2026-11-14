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

import { GOAL_FAMILY_LINES, PERSONALITY_CLUSTER_OF, TIE_TYPE_TO_GOAL_SUBKIND } from '../../data/people/goalFamilies.js';
import { familyOfInstitution, isLawEnforcementInstitution, isNoPowerInstitution } from '../../data/institutionalCatalog.js';
import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { chainPrintName } from '../../domain/display/chainPrintName.js';
import { powerSentenceName } from '../../domain/display/powerSentenceName.js';
import { filterDeclared, lineText, resolveSibling } from '../../domain/facts/drawDeclared.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { notePresumption, withPresumptionLedger } from '../../domain/facts/presumptionLedger.js';
import { magicOf } from '../../domain/facts/magic.js';
import { allegianceOf, criminalHousesOf, criminalPowersOf, organizedCrimeOf } from '../../domain/people/allegiance.js';
import { NPC_GOAL_SIBLINGS, SIEGE_GOALS, STRESS_GOAL_OVERRIDES, stressBucketOf } from '../npcGenerator.js';
import { deriveTradeCommodity } from '../tradeCommodity.js';
import { clamp, clamp01 } from '../../kernel/math.js';

/** @typedef {Record<string, any>} Rec */
/** @typedef {'short' | 'long'} Vantage */
/** @typedef {{ kind: 'npc' | 'power' | 'house' | 'chain', id: string }} GoalTarget */
/** @typedef {{ family: string, kind: string, text: string, target: GoalTarget | null, slots: Rec, refs: string[], crisisNote?: string | null, notes?: Rec[], refused?: boolean }} Candidate */

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
  const place = (/** @type {string} */ n) => (PERSON_HOUSE_PLACE[n].startsWith('the ') ? PERSON_HOUSE_PLACE[n] : `the ${n.replace(/\s*\(.*\)\s*/g, '')}'s ${PERSON_HOUSE_PLACE[n]}`);
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
    /** the held texts refused so far (the receipt's `refused`, per card) */
    refusals: { n: 0 },
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

/**
 * Every line of a cell the record fills and admits, unheld: the candidates of one sub-kind.
 * @param {string} family @param {string} kind @param {Vantage} vantage @param {Rec} slots @param {GoalContext} ctx
 * @param {Set<string>} held @param {{ target?: GoalTarget | null, refs?: string[] }} [extra]
 * @returns {Candidate[]}
 */
function cellCandidates(family, kind, vantage, slots, ctx, held, extra = {}) {
  const cell = arr(rec(rec(/** @type {Rec} */ (GOAL_FAMILY_LINES)[family])[kind])[vantage]);
  if (!cell.length) return [];
  // POWERS-16 (the chair's ruling (r2): a faction named in a sentence takes its prose form, from one leaf): the line
  // prints a power slot through display/powerSentenceName.js ("Military/Guard" -> "The Guard"); the slots kept on the
  // card (the keyed intent) keep the record's names, so every reader that matches a power by name still finds it.
  const said = Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, PROSE_SLOTS.has(k) && typeof v === 'string' && v ? powerSentenceName(v) : v]));
  const poolId = `goalFamilies:${family}.${kind}.${vantage}`;
  /** @type {Candidate[]} */
  const out = [];
  for (const line of cell) {
    const { result: kept, notes } = quiet(() => filterDeclared([line], { facts: ctx.facts, poolId, surface: 'npcs' }));
    if (!kept.length) continue;
    const text = fillLine(templateOf(line), said);
    if (!text) continue;
    if (held.has(text)) { ctx.refusals.n += 1; continue; }
    const used = Object.fromEntries(slotsIn(templateOf(line)).map((k) => [k, slots[k]]));
    out.push({ family, kind, text, target: extra.target ?? null, slots: used, refs: extra.refs ?? [], notes });
  }
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
      if (above) push(cellCandidates('RANK', 'climb', vantage, { power, above: personName(above) }, ctx, held, { target: { kind: 'npc', id: String(above.id) }, refs: [String(above.id)] }));
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
      for (const d of ctx.depsByHouse.get(ctx.famKey(houseKey)) || []) { const rf = resourceFill(d.resource); if (rf) push(cellCandidates('SUPPLY', 'dependency', vantage, { resource: rf, house: hf }, ctx, held, { target })); }
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
    push(cellCandidates('TIES', kind, vantage, { other: personName(other) }, ctx, held, { target: { kind: 'npc', id: String(other.id) }, refs: [String(other.id)] }));
  }

  // PERSONALITY (always): the cluster of the flaw, else the temperament, else the modifier
  const p = rec(card.personality);
  const cluster = [p.flaw, p.dominant, p.modifier].map((w) => /** @type {Rec} */ (PERSONALITY_CLUSTER_OF)[str(w).toLowerCase()]).find(Boolean);
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
    const bucket = stressBucketOf(str(card.role));
    const o = bucket ? rec(STRESS_GOAL_OVERRIDES[ctx.stressType])[bucket] : null;
    if (o) {
      const spoken = (/** @type {string} */ l) => resolveSibling(l, NPC_GOAL_SIBLINGS, { facts: ctx.facts, poolId: 'npcGenerator:NPC_GOAL_SIBLINGS', surface: 'npcs', drawKind: 'T' });
      const { result: [kept], notes } = quiet(() => filterDeclared([o], { facts: ctx.facts, poolId: `npcGenerator:STRESS_GOAL_OVERRIDES.${ctx.stressType}`, surface: 'npcs', drawKind: 'T' }));
      const row = rec(kept); const overrideNote = str(row.note); // the override row's own note, a caller-supplied bag (the flavor census's decoy)
      const { result: said, notes: saidNotes } = quiet(() => (kept ? { text: spoken(str(row.short)), crisisNote: overrideNote ? spoken(overrideNote) : null } : null));
      if (said?.text && !held.has(said.text)) push([{ family: 'CRISIS', kind: bucket, text: said.text, target: null, slots: {}, refs: [], crisisNote: said.crisisNote, notes: [...notes, ...saidNotes] }]);
    }
  }
  if (ctx.stresses.includes('under_siege')) {
    const rows = SIEGE_GOALS(ctx.commodity);
    rows.forEach((row, k) => {
      const { result: [kept], notes } = quiet(() => filterDeclared([row], { facts: ctx.facts, poolId: 'npcGenerator:STRESS_GOALS', surface: 'npcs' }));
      if (!kept) return;
      const { result: text, notes: saidNotes } = quiet(() => resolveSibling(str(rec(kept)[vantage]), NPC_GOAL_SIBLINGS, { facts: ctx.facts, poolId: 'npcGenerator:NPC_GOAL_SIBLINGS', surface: 'npcs', drawKind: 'T' }));
      if (text && !held.has(text)) push([{ family: 'CRISIS', kind: `siege_${k}`, text, target: null, slots: {}, refs: [], notes: [...notes, ...saidNotes] }]);
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

/**
 * A9 — DEAL THE GOALS over the final cast (design §2): each card's SHORT and LONG goal, from two
 * different families its record supports, on its own keyed fork. Returns a NEW array of new card
 * objects (`goal: { short, long, intent }`; a CRISIS override's note as `stressNote`); the receipts
 * ride beside it (`goalReceiptsOf`). Cards in `keep` (a regeneration's preserved keepers) are passed
 * through untouched, and their texts are held.
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
  for (const c of cards) if (keep.has(String(c?.id))) { if (c?.goal?.short) heldShort.add(String(c.goal.short).trim()); if (c?.goal?.long) heldLong.add(String(c.goal.long).trim()); }
  const U = GOAL_FAMILY_TUNING.uncanny;
  const pUncanny = ctx.magic ? (/** @type {Rec} */ (U.perCard)[ctx.tier] ?? 0) : 0;
  let uncannyDealt = 0;
  /** @type {Rec[]} */
  const receipts = [];
  const out = cards.map((card) => {
    if (!card || card.id == null || keep.has(String(card.id))) return card;
    const fork = family.fork(String(card.id));
    /** @type {Rec} */
    const receipt = { id: String(card.id), refs: [] };
    ctx.refusals.n = 0;
    /** @type {Candidate | null} */ let short = null;
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
        const cands = familyCandidates(card, cards, ctx, 'short', heldShort, { pursuit }).ALLEGIANCE?.filter((c) => c.kind === kind) || [];
        if (cands.length) { short = cands.length === 1 ? cands[0] : fork.pick(cands); law.landed = kind; }
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
    }
    const longPursuit = pursuit ? null : lawLongPursuit(card, cards, ctx);
    const byLong = familyCandidates(card, cards, ctx, 'long', heldLong, { pursuit: longPursuit });
    const dl = drawVantage(card, byLong, ctx, 'long', fork, short ? short.family : null);
    receipt.longWeights = dl.weights;
    let long = dl.chosen;
    // the floor (never a card without a goal): every family held → the card's own cluster, held or not
    if (!short) { short = personalityFloor(card, 'short'); receipt.floor = true; }
    if (!long) { long = personalityFloor(card, 'long'); receipt.floor = true; }
    noteDrawn(short); noteDrawn(long);
    if (short) heldShort.add(short.text);
    if (long) heldLong.add(long.text);
    for (const c of [short, long]) if (c) receipt.refs.push(...c.refs);
    receipt.refused = ctx.refusals.n;
    receipt.short = short && { family: short.family, kind: short.kind, slots: short.slots };
    receipt.long = long && { family: long.family, kind: long.kind, slots: long.slots };
    receipts.push(receipt);
    /** @type {Rec} */
    const next = { ...card, goal: { short: short?.text ?? null, long: long?.text ?? null, intent: { short: short ? intentOf(short) : null, long: long ? intentOf(long) : null } } };
    if (short?.family === 'CRISIS' && short.crisisNote) next.stressNote = short.crisisNote;
    else if ('stressNote' in next && short?.family !== 'CRISIS') delete next.stressNote;
    return next;
  });
  RECEIPTS.set(out, receipts);
  return out;
}

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

/** The floor: the card's own cluster's first line (no draw), held or not. @param {Rec} card @param {Vantage} vantage @returns {Candidate | null} */
function personalityFloor(card, vantage) {
  const p = rec(card.personality);
  const cluster = [p.flaw, p.dominant, p.modifier].map((w) => /** @type {Rec} */ (PERSONALITY_CLUSTER_OF)[str(w).toLowerCase()]).find(Boolean) || 'caution';
  const cell = arr(rec(rec(GOAL_FAMILY_LINES.PERSONALITY)[cluster])[vantage]);
  const text = cell.length ? templateOf(cell[0]) : '';
  return text ? { family: 'PERSONALITY', kind: cluster, text, target: null, slots: {}, refs: [] } : null;
}
