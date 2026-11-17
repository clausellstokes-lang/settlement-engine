/**
 * people/rareSecrets.js — THE DEAL OF THE VERY RARE SECRETS (SECRETS-1, 2026-11-17; the owner's eleven messages, the
 * chair's ruling RS1 and its widenings; `docs/chair/2026-11-14/briefs/BRIEF-SECRETS-1.md`). The rows, their conditions
 * and the one table of odds are data (`data/rareSecrets.js`); this module only reads them.
 *
 * WHERE. Beside each call of `people/goals.js :: dealGoals` (the birth in `narrativeGenerator.js`, the re-roll in
 * `generateSettlementPipeline.js`): after the ties and the ranks exist. A person the re-roll KEEPS keeps the secret they
 * have (`keep`). Nothing runs at load or at print: a saved town is never touched.
 *
 * THE SEED PICKS, AND NO DRAW IS TAKEN. Whether a person carries one, and which, and whom it names, is read from the
 * kernel's keyed hash (`kernel/proseHash.js :: fnv1a32`, the draw-free reading the history's variant selection uses) over
 * the town's seed, the family and the person's id. The town's stream of draws is untouched: for the same seed a town is
 * born byte for byte as before but for the dealt cards' `secret` (`{ what, stakes }`, the card's own shape). Nothing else
 * is stored: no marker, no field (a rare secret is known by its words).
 *
 * HOW RARE (`RARE_SECRET_ODDS`). The first three families: each eligible named person passes with `perPerson`; of those
 * who pass and for whom a row of the family may stand, the one first by the hash carries it (never more than one of a
 * family in a place); a person carries at most one, so a family whose first pick already carries one goes to the next
 * who passed, or to no one. The hidden masters and the outsiders are counted by the PLACE: the place passes with
 * `perPlace` (the masters only in the family's `tiers`), then the first person by the hash for whom a row may stand.
 * Within a family the row is picked by the hash among the rows that may stand for that person in that place, each alike.
 *
 * WHO MAY CARRY ONE (item 5). A named adult whose present secret no other reader depends on: never a person whose card's
 * presentation was drawn from their secret's words (`npcGenerator.js :: getStressHistory`'s three modes), never a person
 * whose secret is one of a crisis pool's own (`data/stressInstitutionEffects.js`: the tonight sheet's keeper and target
 * read it), never a person another card's secret names (that secret is about them), never a card with no secret.
 *
 * WHERE A ROW STANDS (items 6 to 8). The place: the row's `needs`/`excludes` in the fact vocabulary's atoms, through the
 * declared door (`filterDeclared` over `factsOf`); `magic` only where the world law holds that magic functions
 * (`generationContext.js :: resolveGenerationWorldLaw`); and every row through that law's own filter for secrets
 * (`allowsSecret`). The person: the row's `holder` (data/rareSecrets.js :: HOLDER_KEYS). A row that names a person names
 * a real other person of the roster, by name: `{superior}` the head of a body the card prints this person a second or a
 * member of (a veiled standing is never read), else the mentor of a tie whose student this person is; `{target}` another
 * named adult picked by the hash (for 'younger' a generation younger, by the card's own age words), never the person,
 * never their superior; a pairing the two cards deny (`TARGET_REFUSALS`) is refused. The name rides the card's
 * `secret.what`/`secret.stakes`, the one substitution point the pipeline's roster prose refresh rewrites
 * (`generateSettlementPipeline.js :: refreshRosterProse`), so a replaced person is followed.
 *
 * Pure: returns a NEW array (the dealt cards new objects, every other card the same object). The receipt (who passed,
 * who was excluded and why) rides beside it (`rareSecretReceiptOf`), never on the record.
 */

import { HOLDER_KEYS, RARE_SECRET_FAMILIES, RARE_SECRET_AGE_YEARS, RARE_SECRET_GENERATION_YEARS, RARE_SECRET_ODDS, RARE_SECRET_ROWS } from '../../data/rareSecrets.js';
import { NPC_AGE_DATA, NPC_PRESENTATION_MODES } from '../../data/npcData.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../data/stressInstitutionEffects.js';
import { filterDeclared } from '../../domain/facts/drawDeclared.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { rulerKindOfLabel } from '../../domain/facts/rulerKindLabel.js'; // the leaf (rulerKind.js is pinned lazy)
import { governingNameOf, powerNameOf } from '../../domain/people/cardPowers.js';
import { criminalPowersOf } from '../../domain/people/allegiance.js';
import { membersByRank, membershipIn, powerOrderOf, powersByRankOf } from '../../domain/people/membership.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';

/** @typedef {Record<string, unknown>} Rec */
/** @typedef {{ key: string, what: string, stakes: string, owner?: boolean, magic?: boolean, needs?: readonly string[], excludes?: readonly string[], holder?: Readonly<Holder>, names?: 'superior' | 'other' | 'younger' }} RareRow */
/** @typedef {{ age?: 'ofYears' | 'old' | 'notOld', not?: readonly string[], office?: readonly string[], keepsHouse?: boolean, roles?: readonly string[], category?: readonly string[], notRoles?: readonly string[], notCategory?: readonly string[], notHouses?: readonly string[], deniedBy?: readonly string[], minYears?: number, notHookWords?: readonly string[] }} Holder */
/** @typedef {'deeds' | 'natures' | 'ties' | 'masters' | 'outsiders'} Family */
/** @typedef {{ family: Family, key: string, id: string, names: string | null }} Dealt */
/** @typedef {{ seed: string, persons: number, eligible: number, excluded: Record<string, number>, magic: boolean, dealt: Dealt[], kept: Dealt[], passed: Record<string, number>, standing: Record<string, number>, followed: Dealt[], unfollowed: Dealt[] }} RareReceipt */

/** The keyed family the deal reads its hash under (no fork: no draw). */
export const RARE_SECRETS_KEY = 'rare-secrets';

/** @type {WeakMap<object, RareReceipt>} */
const RECEIPTS = new WeakMap();
/** The receipt of a deal (beside the returned cast, never on the record). @param {unknown} cast @returns {RareReceipt | null} */
export function rareSecretReceiptOf(cast) {
  return cast && typeof cast === 'object' ? RECEIPTS.get(cast) ?? null : null;
}

/** @param {unknown} v @returns {Rec} */
const rec = (v) => (v && typeof v === 'object' ? /** @type {Rec} */ (v) : {});
/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');
/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);

/** The hash's unit reading in [0, 1). @param {string} key @returns {number} */
const unit = (key) => fnv1a32(key) / 4294967296;

/** A word list as one whole-word test over a lower-cased text. @param {readonly string[]} words @returns {RegExp} */
const wordsTest = (words) => new RegExp(`(?:^|[^a-z'-])(?:${words.map((w) => w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?:$|[^a-z'-])`);

/**
 * AMENDMENT 3: a word list as a test by STEM (a word, its plural and possessive: sister, sisters, sister's; family,
 * families). @param {readonly string[]} words @returns {RegExp}
 */
const stemsTest = (words) => wordsTest(words.flatMap((w) => [w, `${w}s`, `${w}'s`, `${w}s'`, `${w}es`, ...(w.endsWith('y') ? [`${w.slice(0, -1)}ies`] : [])]));

/** The card's age words in years (data/rareSecrets.js :: RARE_SECRET_AGE_YEARS). */
const AGE_YEARS = /** @type {Readonly<Record<string, number>>} */ (RARE_SECRET_AGE_YEARS);
/** @param {Rec} card @returns {string} */
const ageWordsOf = (card) => str(rec(card.physical).age).trim().toLowerCase();
/** @param {Rec} card @returns {'young' | 'middle' | 'mature' | 'elder' | null} */
function ageBandOf(card) {
  const w = ageWordsOf(card);
  for (const band of /** @type {const} */ (['young', 'middle', 'mature', 'elder'])) if (arr(rec(NPC_AGE_DATA)[band]).includes(w)) return band;
  return null;
}

/** The titles of blood (a hereditary title, or a noble of the page), by the role's or title's own words. */
const BLOOD_TITLE = /^(?:the )?(?:lord|lady|monarch|king|queen|duke|duchess|baron|baroness|count|countess|earl|prince|princess|margrave|jarl|emir|boyar|boyarina)$/i;
/** A power whose name is a noble house's. */
const NOBLE_POWER = /\bnobl|\baristocra|\blanded\b|\bgentry\b|\bhouse of\b/i;
/** An elder's office, by the role's own words. */
const ELDER_OFFICE = /\b(?:elder|eldest|headman)\b/i;

/**
 * The crisis pools' own secrets as patterns over a filled text (a slot reads as any words): a card whose secret is one of
 * them carries the crisis's plot (the tonight sheet's keeper and target read it).
 */
const CRISIS_SECRET_PATTERNS = Object.freeze(Object.values(rec(STRESS_INSTITUTION_EFFECTS)).flatMap((pool) => arr(pool).map((e) => str(rec(e).secret)).filter(Boolean))
  .map((t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-zA-Z]+\\\}/g, '.+')}$`)));
/** The presentation modes a secret's words draw (`getStressHistory`): a card holding one wears its secret's face. */
const SECRET_BOUND_PRESENTATIONS = Object.freeze(['dangerous_presents_safe', 'compromised_presents_professional', 'significant_presents_ordinary']
  .flatMap((k) => arr(rec(NPC_PRESENTATION_MODES)[k])).map((p) => JSON.stringify(p)));

/**
 * THE PAIRINGS TWO CARDS DENY (item 6): a row that names a person never names one the page ties to the holder by a tie
 * that says the opposite. Keyed by row; the tie types are the ties' own (`people/ties.js`).
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const TARGET_REFUSALS = Object.freeze({
  lovesNamed: Object.freeze(['family']),
  parentOf: Object.freeze([]),
  hired: Object.freeze([]),
  blackmailer: Object.freeze([]),
  owesLife: Object.freeze([]),
  guardian: Object.freeze([]),
  oathAgainst: Object.freeze(['enemy', 'rival']),
  hiddenSpouse: Object.freeze(['family']),
});

/**
 * The town's reading the deal needs, once.
 * @param {Rec} settlement @param {Rec[]} cards @param {unknown[]} relationships @param {unknown} worldLaw
 */
function placeOf(settlement, cards, relationships, worldLaw) {
  const config = rec(settlement.config);
  const law = resolveGenerationWorldLaw(worldLaw ?? null, config, {
    tier: str(settlement.tier) || null,
    tradeRoute: str(config.tradeRouteAccess) || null,
    terrainType: str(config.terrainType) || null,
  });
  const record = { ...settlement, npcs: cards, relationships };
  /** @type {ReturnType<typeof factsOf> | null} */ let facts = null;
  const order = powerOrderOf(record);
  const governing = governingNameOf(record);
  const lordly = rulerKindOfLabel(rec(settlement.powerStructure).government) === 'lord';
  /** the underworld's powers, by name (`domain/people/allegiance.js :: criminalPowersOf`, the goals' own reading) */
  const underworld = new Set(criminalPowersOf(record).map((x) => powerNameOf(x)));
  /** @type {Map<string, Set<string>>} */
  const tiesOf = new Map();
  for (const t of relationships) {
    const r = rec(t); const a = str(r.from); const b = str(r.to); const type = str(r.type);
    if (!a || !b || !type) continue;
    for (const [x, y] of [[a, b], [b, a]]) { const k = `${x}\t${y}`; const s = tiesOf.get(k) || new Set(); s.add(type); tiesOf.set(k, s); }
  }
  return {
    tier: str(settlement.tier),
    magic: law.magicFunctions() === true,
    law,
    facts: () => (facts ||= factsOf(record)),
    order,
    governing,
    lordly,
    underworld,
    relationships,
    /** @param {string} a @param {string} b @returns {Set<string>} */
    tieTypes: (a, b) => tiesOf.get(`${a}\t${b}`) || new Set(),
  };
}
/** @typedef {ReturnType<typeof placeOf>} Place */

/** The card is first of the governing power. @param {Rec} card @param {Place} place */
const isHead = (card, place) => !!place.governing && membershipIn(card, place.governing)?.rank === 1;
/** A title of blood or a noble of the page. @param {Rec} card @param {Place} place */
function isHereditary(card, place) {
  if (BLOOD_TITLE.test(str(card.role).trim()) || BLOOD_TITLE.test(str(card.title).trim())) return true;
  if (place.lordly && isHead(card, place)) return true;
  return powersByRankOf(card, place.order).some((m) => NOBLE_POWER.test(str(m.power)));
}
/** AMENDMENT 2: first of a power the engine reads as the underworld's (`allegiance.js`'s one reading). @param {Rec} card @param {Place} place */
const isUnderworldHead = (card, place) => arr(card.memberships).some((m) => rec(m).rank === 1 && place.underworld.has(str(rec(m).power)));
/** @param {Rec} card */
const isElder = (card) => ELDER_OFFICE.test(str(card.role)) || ELDER_OFFICE.test(str(card.title));
/** Kin on the page, an elder's office, or a title of blood. @param {Rec} card @param {Place} place */
function knownFromBirth(card, place) {
  if (isElder(card) || isHereditary(card, place)) return true;
  const id = String(card.id);
  return place.relationships.some((t) => { const r = rec(t); return str(r.type) === 'family' && (String(r.from) === id || String(r.to) === id); });
}

/**
 * The card's superior: the head (rank 1) of the first body the card prints it a second, a third or a member of (its
 * printed order; a veiled standing never read), else the mentor of a tie whose student it is. Null when none is clean.
 * @param {Rec} card @param {Rec[]} cards @param {Place} place @returns {Rec | null}
 */
export function superiorOf(card, cards, place) {
  for (const m of powersByRankOf(card, place.order)) {
    if (m.rank === 1 || rec(m).veiled === true) continue;
    const head = membersByRank(cards, m.power).find((c) => c !== card && membershipIn(c, m.power)?.rank === 1 && rec(membershipIn(c, m.power)).veiled !== true);
    if (head && str(rec(head).name)) return /** @type {Rec} */ (head);
  }
  const id = String(card.id);
  for (const t of place.relationships) {
    const r = rec(t);
    if (str(r.type) !== 'mentor_student' || String(r.to) !== id) continue;
    const mentor = cards.find((c) => String(c.id) === String(r.from));
    if (mentor && mentor !== card && str(mentor.name)) return mentor;
  }
  return null;
}

/** The card's personality and disposition words. @param {Rec} card @returns {string[]} */
function traitWordsOf(card) {
  const p = rec(card.personality);
  return [p.dominant, p.flaw, p.modifier, rec(card.presentation).disposition].map((w) => str(w).toLowerCase()).filter(Boolean);
}

/** The card's own hook lines, as one text. @param {Rec} card @returns {string} */
const hooksOf = (card) => {
  /** @type {string[]} */ const out = [];
  // AMENDMENT 3: a hook of either shape: a string, or a declared line, whose every word is read (all its strings: a
  // refusal reads the words, it draws nothing, so no declaration is set aside). The 720 and the 150 store strings only.
  for (const x of arr(card.plotHooks)) out.push(...(typeof x === 'string' ? [x] : Object.values(rec(x)).filter((v) => typeof v === 'string')));
  return out.join(' ');
};
/** The card's own printed goal and hook lines, as one text (a target is never one they name). @param {Rec} card @returns {string} */
const ownLinesOf = (card) => [str(rec(card.goal).short), str(rec(card.goal).long), hooksOf(card)].join(' ');

/** The person's own conditions (the row's `holder`). @param {Holder | undefined} h @param {Rec} card @param {Place} place @returns {boolean} */
function holderAdmits(h, card, place) {
  if (!h) return true;
  const band = ageBandOf(card);
  if (h.age === 'ofYears' && (band === null || band === 'young')) return false;
  if (h.age === 'old' && band !== 'elder') return false;
  if (h.age === 'notOld' && (band === null || band === 'elder')) return false;
  for (const o of h.not || []) {
    if (o === 'head' && isHead(card, place)) return false;
    if (o === 'elder' && isElder(card)) return false;
    if (o === 'hereditary' && isHereditary(card, place)) return false;
    if (o === 'knownFromBirth' && knownFromBirth(card, place)) return false;
    if (o === 'criminalHead' && isUnderworldHead(card, place)) return false;
  }
  for (const o of h.office || []) if (o === 'head' && !isHead(card, place)) return false;
  if (h.keepsHouse && rec(card.institution).kind !== 'house') return false;
  const role = ` ${str(card.role).toLowerCase()} `;
  const category = str(card.category).toLowerCase();
  if (h.roles || h.category) {
    const byRole = !!h.roles && wordsTest(h.roles).test(role);
    const byCategory = !!h.category && h.category.includes(category);
    if (!byRole && !byCategory) return false;
  }
  if (h.notRoles && wordsTest(h.notRoles).test(role)) return false;
  if (h.notCategory && h.notCategory.includes(category)) return false;
  if (h.notHouses && wordsTest(h.notHouses).test(` ${str(rec(card.institution).key).toLowerCase()} `)) return false;
  if (typeof h.minYears === 'number') { const y = AGE_YEARS[ageWordsOf(card)]; if (y === undefined || y < h.minYears) return false; }
  if (h.notHookWords && stemsTest(h.notHookWords).test(` ${hooksOf(card).toLowerCase()} `)) return false;
  if (h.deniedBy) { const words = traitWordsOf(card); if (h.deniedBy.some((w) => words.includes(w))) return false; }
  return true;
}

/**
 * The person a row names, or null where none is clean: the superior, or another named adult picked by the hash.
 * @param {RareRow} row @param {Rec} card @param {Rec[]} cards @param {Place} place @param {string} seed @param {Family} family
 * @returns {Rec | null | undefined} undefined for a row that names no one
 */
function namedFor(row, card, cards, place, seed, family) {
  if (!row.names) return undefined;
  const superior = superiorOf(card, cards, place);
  if (row.names === 'superior') return superior && !ownLinesOf(card).includes(str(superior.name)) ? superior : null; // AMENDMENT 3: never one the card's own goal or hook names
  const id = String(card.id);
  const refused = TARGET_REFUSALS[row.key] || [];
  const holderYears = AGE_YEARS[ageWordsOf(card)];
  const own = ownLinesOf(card);
  const pool = cards.filter((c) => {
    if (c === card || c.id == null || String(c.id) === id || !str(c.name) || c === superior) return false;
    if (own.includes(str(c.name))) return false; // AMENDMENT 2: never one the card's own goal or hook names
    if (str(c.name) === str(card.name)) return false;
    if (refused.some((t) => place.tieTypes(id, String(c.id)).has(t))) return false;
    if (row.names === 'younger') {
      const y = AGE_YEARS[ageWordsOf(c)];
      if (holderYears === undefined || y === undefined || holderYears - y < RARE_SECRET_GENERATION_YEARS) return false;
    }
    return true;
  });
  if (!pool.length) return null;
  const ranked = pool.map((c) => ({ c, h: fnv1a32(`${seed}::${RARE_SECRETS_KEY}::${family}::${id}::${row.key}::${String(c.id)}`) }))
    .sort((a, b) => a.h - b.h || (String(a.c.id) < String(b.c.id) ? -1 : 1));
  return ranked[0].c;
}

/** Every row's two lines as patterns (a name slot reads as any words), by family. */
const ROW_PATTERNS = Object.freeze(/** @type {readonly Family[]} */ (RARE_SECRET_FAMILIES).flatMap((family) => /** @type {readonly RareRow[]} */ (RARE_SECRET_ROWS[family]).map((row) => {
  /** @param {string} t */ const re = (t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{(?:superior|target)\\\}/g, '(.+)')}$`);
  return { family, row, what: re(row.what), stakes: re(row.stakes) };
})));
/**
 * The row a secret is, by its words (AMENDMENT 2: a kept person's rare secret is known by them), or null.
 * @param {unknown} secret @returns {{ family: Family, row: RareRow, name: string | null } | null}
 */
export function rareRowOf(secret) {
  const what = str(rec(secret).what); const stakes = str(rec(secret).stakes);
  if (!what) return null;
  const hit = ROW_PATTERNS.find((p) => p.what.test(what) && p.stakes.test(stakes));
  if (!hit) return null;
  // AMENDMENT 3: the name the row's slot holds (the same name in both lines, or the row is not this row)
  const names = [...(what.match(hit.what) || []).slice(1), ...(stakes.match(hit.stakes) || []).slice(1)];
  if (names.some((n) => n !== names[0])) return null;
  return { family: hit.family, row: hit.row, name: names.length ? names[0] : null };
}

/** @param {string} text @param {string} name */
const fill = (text, name) => text.replace(/\{superior\}|\{target\}/g, name);

/**
 * The rows of a family the PLACE admits: the world law (magic, and its filter for secrets) and the declared atoms.
 * @param {Family} family @param {Place} place @returns {RareRow[]}
 */
function placeRows(family, place) {
  const rows = /** @type {readonly RareRow[]} */ (RARE_SECRET_ROWS[family]);
  const lawful = rows.filter((r) => (!r.magic || place.magic) && place.law.allowsSecret({ what: r.what, stakes: r.stakes }));
  return filterDeclared(lawful, { facts: place.facts, poolId: `rareSecrets:${family}`, surface: 'npcs' });
}

/** Why a card may not carry one (item 5), or '' when it may. @param {Rec} card @param {Rec[]} cards @param {Set<string>} keep @returns {string} */
function exclusionOf(card, cards, keep) {
  if (!card || card.id == null) return 'no id';
  if (keep.has(String(card.id))) return 'kept';
  const secret = rec(card.secret);
  const what = str(secret.what);
  if (!what) return 'no secret';
  if (ageBandOf(card) === null) return 'no age';
  if (SECRET_BOUND_PRESENTATIONS.includes(JSON.stringify(card.presentation))) return 'presentation drawn from the secret';
  if (CRISIS_SECRET_PATTERNS.some((re) => re.test(what))) return "a crisis pool's secret";
  const name = str(card.name);
  if (name && cards.some((c) => c !== card && (str(rec(c.secret).what).includes(name) || str(rec(c.secret).stakes).includes(name)))) return "named in another card's secret";
  return '';
}

/**
 * The rows of a family that may stand for one card in this place, each with the name it fills (no odds read).
 * @param {Rec} c @param {RareRow[]} rows @param {Rec[]} cards @param {Place} place @param {string} seed @param {Family} family
 * @returns {{ row: RareRow, name: string | null }[]}
 */
function standingFor(c, rows, cards, place, seed, family) {
  /** @type {{ row: RareRow, name: string | null }[]} */
  const standing = [];
  for (const row of rows) {
    if (!holderAdmits(row.holder, c, place)) continue;
    const named = namedFor(row, c, cards, place, seed, family);
    if (named === null) continue;
    standing.push({ row, name: named ? str(named.name) : null });
  }
  return standing;
}

/**
 * THE ROWS THAT MAY STAND for one card of the cast, by family, with the name each fills: the deal's own reading with no
 * odds read (for the guard's reachability and the measures). Empty for a card the deal would exclude (item 5).
 * @param {Rec} settlement @param {Rec[]} cards @param {unknown[]} relationships @param {string} id
 * @param {{ seed?: unknown, keep?: Set<string>, worldLaw?: unknown }} [options]
 * @returns {Record<Family, { key: string, what: string, stakes: string, name: string | null }[]>}
 */
export function rareRowsStandingFor(settlement, cards, relationships, id, options = {}) {
  const seed = options.seed == null ? '' : String(options.seed);
  const place = placeOf(rec(settlement), cards, arr(relationships), options.worldLaw);
  const card = cards.find((c) => String(rec(c).id) === String(id));
  /** @type {Record<Family, { key: string, what: string, stakes: string, name: string | null }[]>} */
  const out = { deeds: [], natures: [], ties: [], masters: [], outsiders: [] };
  if (!card || exclusionOf(rec(card), cards, options.keep || new Set())) return out;
  for (const family of /** @type {readonly Family[]} */ (RARE_SECRET_FAMILIES)) {
    const odds = /** @type {{ tiers?: readonly string[] }} */ (RARE_SECRET_ODDS[family]);
    if (odds.tiers && !odds.tiers.includes(place.tier)) continue;
    out[family] = standingFor(card, placeRows(family, place), cards, place, seed, family)
      .map(({ row, name }) => ({ key: row.key, what: fill(row.what, name || ''), stakes: fill(row.stakes, name || ''), name }));
  }
  return out;
}

/**
 * DEAL THE VERY RARE SECRETS over the final cast (after the ranks and the ties). Returns a NEW array; a dealt card is a
 * new object whose `secret` is the row's `{ what, stakes }` (a named person filled in); every other card is passed
 * through as the same object. With no seed, nothing is dealt.
 * @param {Rec} settlement the settlement-shaped object at the seam (its `config`, `tier`, `powerStructure`)
 * @param {Rec[]} cards the final cast
 * @param {unknown[]} relationships the ties drawn over that cast
 * @param {{ seed?: unknown, keep?: Set<string>, worldLaw?: unknown }} [options]
 * @returns {Rec[]}
 */
export function dealRareSecrets(settlement, cards, relationships, options = {}) {
  const seed = options.seed == null ? '' : String(options.seed);
  if (!seed || !Array.isArray(cards) || !cards.length) return cards;
  const keep = options.keep || new Set();
  const place = placeOf(rec(settlement), cards, arr(relationships), options.worldLaw);
  /** @type {RareReceipt} */
  const receipt = { seed, persons: cards.length, eligible: 0, excluded: {}, magic: place.magic, dealt: [], kept: [], passed: {}, standing: {}, followed: [], unfollowed: [] };
  /** @type {Rec[]} */ const eligible = [];
  for (const c of cards) {
    const why = exclusionOf(rec(c), cards, keep);
    if (why) receipt.excluded[why] = (receipt.excluded[why] || 0) + 1;
    else eligible.push(c);
  }
  receipt.eligible = eligible.length;
  // AMENDMENT 2: a KEPT person's rare secret (known by its words) fills its family's cap in the place
  /** @type {Set<Family>} */ const filled = new Set();
  /** @type {Map<Rec, { what: string, stakes: string }>} AMENDMENT 3: a kept holder's name followed */ const follow = new Map();
  const live = new Set(cards.map((x) => str(rec(x).name)).filter(Boolean));
  for (const c of cards) {
    if (!keep.has(String(rec(c).id))) continue;
    const r = rareRowOf(rec(c).secret);
    if (!r) continue;
    filled.add(r.family);
    /** @type {Dealt} */ const k = { family: r.family, key: r.row.key, id: String(rec(c).id), names: r.name };
    receipt.kept.push(k);
    // AMENDMENT 3 (the chair's ruling): the named person gone, the SAME row takes a name by the row's own rules; none, and
    // the secret is left as it is and counted. A user's own words match no row, so they are never touched.
    if (!r.name || live.has(r.name)) continue;
    const named = namedFor(r.row, rec(c), cards, place, seed, r.family);
    if (!named) { receipt.unfollowed.push(k); continue; }
    follow.set(c, { what: fill(r.row.what, str(named.name)), stakes: fill(r.row.stakes, str(named.name)) });
    receipt.followed.push({ ...k, names: str(named.name) });
  }
  /** @type {Map<Rec, { row: RareRow, family: Family, name: string | null }>} */
  const dealt = new Map();
  for (const family of /** @type {readonly Family[]} */ (RARE_SECRET_FAMILIES)) {
    if (filled.has(family)) continue;
    const odds = /** @type {{ perPerson?: number, perPlace?: number, tiers?: readonly string[] }} */ (RARE_SECRET_ODDS[family]);
    if (odds.tiers && !odds.tiers.includes(place.tier)) continue;
    const rows = placeRows(family, place);
    if (!rows.length) continue;
    if (typeof odds.perPlace === 'number' && unit(`${seed}::${RARE_SECRETS_KEY}::${family}::place`) >= odds.perPlace) continue;
    const ranked = eligible
      .filter((c) => !dealt.has(c))
      .map((c) => ({ c, u: unit(`${seed}::${RARE_SECRETS_KEY}::${family}::${String(c.id)}`) }))
      .filter((x) => typeof odds.perPerson !== 'number' || x.u < odds.perPerson)
      .sort((a, b) => a.u - b.u || (String(a.c.id) < String(b.c.id) ? -1 : 1));
    receipt.passed[family] = ranked.length;
    receipt.standing[family] = 0;
    for (const { c } of ranked) {
      const standing = standingFor(c, rows, cards, place, seed, family);
      if (!standing.length) continue;
      receipt.standing[family] += 1; // every passer a row stands for (the cap's anchor), the first dealt
      if ([...dealt.values()].some((d) => d.family === family)) continue;
      const at = fnv1a32(`${seed}::${RARE_SECRETS_KEY}::${family}::${String(c.id)}::row`) % standing.length;
      dealt.set(c, { ...standing[at], family });
    }
  }
  if (!dealt.size && !follow.size) { RECEIPTS.set(cards, receipt); return cards; }
  const out = cards.map((c) => {
    const kept = follow.get(c);
    if (kept) return { ...c, secret: { ...rec(c.secret), ...kept } };
    const d = dealt.get(c);
    if (!d) return c;
    receipt.dealt.push({ family: d.family, key: d.row.key, id: String(c.id), names: d.name });
    const name = d.name || '';
    return { ...c, secret: { what: fill(d.row.what, name), stakes: fill(d.row.stakes, name) } };
  });
  RECEIPTS.set(out, receipt);
  return out;
}

/** Every row of every family, with its family (for the guard and the measures). @returns {{ family: Family, row: RareRow }[]} */
export function rareSecretRows() {
  return /** @type {readonly Family[]} */ (RARE_SECRET_FAMILIES).flatMap((family) => /** @type {readonly RareRow[]} */ (RARE_SECRET_ROWS[family]).map((row) => ({ family, row })));
}

/** The holder keys a row may carry (re-read from the data, for the guard). */
export const RARE_HOLDER_KEYS = HOLDER_KEYS;
