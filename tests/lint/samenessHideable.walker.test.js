/**
 * samenessHideable.walker.test.js — THE HIDEABLE-HOUSE WALKER OF THE SAMENESS POOLS (SAME-1's brief 3,
 * `docs/chair/2026-11-20/content/same/SAME-1-HIDEABLE-BRIEF.md`; the chair's rule of 17:13 UTC and rulings of
 * 17:25 and 17:32 UTC, 2026-11-20).
 *
 * THE BASE IT STANDS ON: 43ab0f5eb, the join line (`lane/join-2026-11-14`). A line is NEW when it is not on that
 * commit; every list below was taken on it (this lane adds no pool line), and each one only shrinks.
 *
 * A shared read (a gallery, a player view) may withhold a house of a hideable kind (`src/domain/people/cardVeil.js ::
 * isHideableHouse`: criminal or clandestine). A wording that needs one, or needs any fact about crime, either leaks
 * it or falls silent there. Its arms, all over `tests/lint/factLayers.shared.mjs :: corpusPools` (the one backbone,
 * imported and never copied) and the hand list beside it:
 *
 *   RULE 1, BY ATOM  a wording whose declared needs (its marks, its pool's `declares`) hold a crime fact, or a keyed
 *                    house atom whose kind `isHideableHouse` takes for hideable, REDS.
 *   RULE 1, BY KEY   a pool whose state key is a criminal house, a crime state or the absence of one is a CRIME POOL
 *                    (`CRIME_POOLS`, by declaration; a pool whose key reads like one and is not is `NOT_CRIME_POOLS`,
 *                    with its reason). Every line in it REDS unless it is marked `dm-only`.
 *                    A line marked `dm-only` is withheld from every shared read (the kernel's covert mark), so neither
 *                    reading reds it. The reds standing on the base are banked in
 *                    `samenessHideable.existingReds.json` (pool, vid, the line's text hash, why): the bank must equal
 *                    the reds exactly, so a NEW red line (or a banked line reworded) reds until it is cured, and a
 *                    cured one reds until its row is removed. `EXISTING_CEILING` only falls.
 *   EXEMPT           by declaration only (`EXEMPT`), each entry naming a real pool and its class: a field withheld from
 *                    every shared read, or the trouble half's ruled design (its hooks are dropped on a public page;
 *                    its cause sentence is held equal on a served and a possible-world document). Nothing else.
 *   RULE 2           every OTHER house a wording needs (guild, church, court, market, watch, walls, an institution of
 *                    the roster) is LISTED, never red: `samenessHideable.houseReadings.json` (pool, vid, house),
 *                    sorted. It must equal the reading exactly. The security reader tests it at the join against
 *                    the veil's own registry; this walker makes no list of what may be withheld.
 *   TOTALITY         (the chair's way (i), 17:32 UTC) every exported `src/data/` constant that is an array of strings
 *                    or of `{ text | line }` rows, or an object of such arrays, and is imported outside `src/data/`
 *                    by a file that calls `pick(`, `drawDeclared(`, `weightedPick(`, `pickVariant(` or
 *                    `pickVariantMixed(`, is either reached by `corpusPools` or named in the HAND LIST,
 *                    `samenessHideable.handPools.json` (`path :: symbol`, the seat's branch and commit). Anything
 *                    else REDS. A join-line row whose table the arm no longer finds reds until removed; a seat's
 *                    row (its pool changed or added on that seat's branch) stands until the seat registers it.
 *                    `HAND_CEILING` only falls: a lane registers its pool and removes its row.
 *   THE KNOWN LIMIT  (the chair, 17:45, in these words) an indirectly drawn pool escapes the totality arm; the hand list is its remedy.
 *                    The arm sees only a `src/data/` table imported BY NAME into a file that draws; a pool reached
 *                    through a helper, a re-export or a closure is found by no scan, and is registered by hand.
 *   PHASE 3          (SAME-2 brief H; the chair's 17:45 order (2)) the hand-listed pools' LINES are read too
 *                    (`readHandLines`): a declared row (`needs` or `marks`) by its atoms, rule 1 and rule 2 as above;
 *                    every other line (a bare string, a function, a row that declares no need) by `CRIME_TEXT_FORMS`,
 *                    the precise free-text forms the chair ruled at 19:29 (SAME-2 brief H2), never by the key list;
 *                    a line under a key `CRIME_KEY_WORDS` takes is in a CRIME POOL (a SENTENCE key, by its free-text
 *                    form: `isSentenceKey`). A function line is read from its own source (literals and template quasis), never
 *                    called. The reds standing on 1c9673e84 are the bank's `hand` rows (pool, text hash, why); the
 *                    houses are the readings' `hand` rows. A seat's hand row whose table is not on this line is skipped.
 *
 * It renders nothing and births nothing: seconds.
 *
 * @enforced-by tests/lint/samenessHideable.walker.test.js
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { parse } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';

import { CORPUS_LEAVES, ROOT, corpusPools, readJson } from './factLayers.shared.mjs';
import { FACT_DIMENSIONS, declarationOfMarks, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

const BASE = '43ab0f5eb';
const JOIN = 'lane/join-2026-11-14';
const EXISTING_REL = 'tests/lint/samenessHideable.existingReds.json';
const HOUSES_REL = 'tests/lint/samenessHideable.houseReadings.json';
const HAND_REL = 'tests/lint/samenessHideable.handPools.json';
/** Shrink-only: today's counts on the base. Lower them as rows go; never raise them. */
const EXISTING_CEILING = 247; // 96 + 151 (SAME-2 brief H2: the hand rows 154 - 8 un-banked sentence-key lines (unit 2) + 5 free-text reds by word (unit 4); 146 by key, 5 by word, 0 by atom)
const HAND_CEILING = 44; // 42 + 2 (SAME-2's unit 0, the join's point 84: GOALS' two key lists, read by `.includes`, on the hand list as TIER_ORDER is)
const COVERT = 'dm-only';

// ── THE VOCABULARY, CLASSED ──────────────────────────────────────────────────────────────────────
/** The fact homes that answer a fact about crime (`factVocabulary.js :: FACT_DIMENSIONS`). */
const CRIME_HOMES = Object.freeze(['crime', 'rivalRings', 'criminalIncome', 'crimeWave']);
/** The fact homes whose atom names a house of the place (rule 2's houses). */
const HOUSE_HOMES = Object.freeze(['defence', 'courtSits', 'courtOrGaol', 'legalHouse', 'paidWatch', 'guardPresence', 'soldiers',
  'commander', 'market', 'guild', 'faith', 'sacredHouse', 'hasInstitution']);

/** A house of one kind, as the veil's predicate reads a house (its name and its classifier). @param {string} kind */
export const houseOfKind = (kind) => ({ name: kind, category: kind, priorityCategory: kind });

/**
 * What a needed atom asks of a shared read: `crime` (a fact about crime), `hideable` (a keyed house atom whose kind
 * the veil hides), `house` (another house: rule 2), or null.
 * @param {string} written
 */
export function atomClass(written) {
  const atom = parseAtom(written);
  if (!atom) return null;
  const { home } = FACT_DIMENSIONS[atom.dimension];
  if (CRIME_HOMES.includes(home)) return 'crime';
  if (!HOUSE_HOMES.includes(home)) return null;
  return atom.key && isHideableHouse(houseOfKind(atom.key)) ? 'hideable' : 'house';
}

/** @typedef {{ id: string, variants: Array<Record<string, any>>, meta: Record<string, any> }} Pool */

/** A wording's needed atoms: its marks' and the pool's own `declares` (the needs side only). @param {Record<string, any>} v @param {Pool} pool */
export const needsOf = (v, pool) => [...new Set([...variantFactDeclaration(v).needs, ...declarationOfMarks(v.marks || []).needs,
  ...(pool.meta.declares || []).filter((/** @type {string} */ a) => !/^no\s/i.test(a))])];

const textSha = (/** @type {unknown} */ text) => createHash('sha256').update(String(text ?? '')).digest('hex').slice(0, 12);

// ── THE CRIME POOLS (rule 1 by key), BY DECLARATION ─────────────────────────────────────────────
/** Whole blocks whose every pool is keyed by the criminal structure or its capture. */
const CRIME_BLOCKS = Object.freeze({ 'DS-DEF-4': 'Defense › Criminal structure + capture consequence: every pool is keyed by the structure, a capture state, or a criminal fixture' });
/** Pools keyed by a criminal house, a crime state or its absence, outside the crime blocks. */
const CRIME_POOLS = Object.freeze({
  'DS-ECO-6::TIER: a large share off the books (≥30)': 'the black-market capture share, a crime state',
  'DS-ECO-6::TIER: significant off-book activity (≥15)': 'the black-market capture share, a crime state',
  'DS-ECO-6::TIER: minor shadow activity (≥3)': 'the black-market capture share, a crime state',
  'DS-ECO-6::FLAG: arcaneBlackMarket': 'an arcane black market, a criminal house',
  'DS-ECO-6::FACET: an underground house': 'a subterranean house, hideable by the veil',
  'DS-ECO-6::FACET: a clandestine house': 'a clandestine house, hideable by the veil',
  'DS-ECO-12::INCOME MIX: a criminal line is present': 'a criminal income line, a crime state',
  'DS-ECO-12::INCOME MIX: the criminal line leads': 'a criminal income line, a crime state',
  'DS-SUP-2::CAPTURED': 'a chain captured by a faction that takes its cut, a crime state',
  'DS-DEF-3::COMPOUND: criminal governance': 'a criminal power governs, a crime state',
  'DS-GEN-1::crime_wave': 'the crime wave tension, a crime state',
  'DS-GEN-7::power_economic: criminal faction in a transit hub': 'a criminal power, a criminal house',
  'DS-GEN-7::power_economic: powerful criminal faction in a prosperous settlement': 'a criminal power, a criminal house',
  'DS-HK-1::clock smuggling_rise': 'a smuggling clock, a crime state',
  'DS-POW-5::criminal': 'a criminal government, a criminal house',
  'DS-POW-5::FLAG: stateCrime': 'the state in crime, a crime state',
  'DS-POW-5::FLAG: stateCrime, heavy': 'the state in crime, a crime state',
  'DS-POW-5::FLAG: crimeIsGovt': 'crime is the government, a crime state',
  'DS-POW-5::FLAG: merchantCriminalBlur': 'merchant and criminal houses blurred, a crime state',
  'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)': 'criminal capture, a crime state',
  'DS-POW-6::capture pressure RECOVERING (strong security, prosperity)': 'criminal capture, a crime state',
  'DS-POW-6::capture reached an AGENT of a faction': 'criminal capture, a crime state',
  'DS-POW-6::capture reached a LEADER': 'criminal capture, a crime state',
  'DS-POW-6::operation role parallel marketplace': 'a criminal operation, a criminal house',
  'DS-POW-6::operation role duty evasion': 'a criminal operation, a criminal house',
  'DS-POW-6::operation role unlicensed revenue': 'a criminal operation, a criminal house',
  'DS-POW-6::operation role money laundering': 'a criminal operation, a criminal house',
  'DS-POW-6::operation role stolen goods market': 'a criminal operation, a criminal house',
  'DS-POW-6::operation role protection + extraction': 'a criminal operation, a criminal house',
  'DS-POW-6::operation role criminal revenue stream (unclassified)': 'a criminal operation, a criminal house',
  'DS-POW-6::GM ADVISORY: officials with criminal arrangements': 'officials in a criminal arrangement, a crime state',
});
/** Pools whose key reads like crime and is not a crime state (each with its reason). */
const NOT_CRIME_POOLS = Object.freeze({
  'DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force': 'an organised defending force, not crime',
  'DS-DEF-2::Beasts & Monsters: settled, nothing organized': 'no organised defending force, not crime',
  'DS-DEF-5::NO organized force at all': 'no organised defending force, not crime',
  'DS-POW-7::glue compromise (a corruption leash)': 'a bloc held by a secret over one member: no criminal house or crime state',
});
/**
 * A key that reads like crime must be classed above. In a hand pool, a key it takes puts its lines in a crime pool;
 * `corrupt` stands in it: corruption IS a crime fact for this walker (the chair, 19:29 UTC 2026-11-20), so
 * `GOAL_FAMILY_LINES::POWER::corrupted` stays banked by key.
 */
const CRIME_KEY_WORDS = /thie(?:f|ves)|gang|criminal|crime|smuggl|syndicate|racket|underworld|black ?market|shadow|capture|clandest|underground|organi[sz]ed|corrupt|operation role|off-book|off the books/i;

/** @param {string} id */
export const isCrimePool = (id) => Object.hasOwn(CRIME_POOLS, id) || Object.hasOwn(CRIME_BLOCKS, id.split('::')[0]);

// ── EXEMPT, BY DECLARATION ONLY ─────────────────────────────────────────────────────────────────
/**
 * Each entry stands only WITH THE LINE OF CODE that withholds its block from every shared read (the chair, 17:45):
 * `withheldBy` (`path :: symbol`, the symbol found in that file) and, where one exists, `provedBy` (`path :: test
 * title`, the title found in that file). `exemptionFaults` reds an entry without them.
 * @type {Readonly<Record<string, { class: 'withheld' | 'trouble', reason: string, withheldBy: string, provedBy?: string }>>}
 */
const EXEMPT = Object.freeze({
  'DS-HK-1::clock smuggling_rise': {
    class: 'trouble',
    reason: 'the state a hook is framed from: DS-HK-1 prints nowhere. Its desk position `plot_hooks.framing` is a GLANCE (dossierMounts.js; the chair\'s RULINGS-T1 of 2026-10-30), so the reader hands no surface a framing line, privately or publicly (print reads the same framingLines); a public dossier reads GENERAL_STATE_PROSE_SILENT and PUBLIC_SITE_GROUP ships no hooks group',
    withheldBy: 'src/components/new/generalDeskRead.js :: generalDeskLines',
    provedBy: 'tests/ui/generalDeskTabFlow.test.js :: no "Plot hooks" title and no DS-HK-1 framing, privately or publicly; the hooks keep their own words',
  },
});

/**
 * The faults of the exemptions: an entry with no `withheldBy`, or one whose file or symbol (or whose `provedBy` file
 * or test title) is not found.
 * @param {Readonly<Record<string, { withheldBy?: string, provedBy?: string }>>} exempt @param {(rel: string) => string|null} read
 * @returns {string[]}
 */
export function exemptionFaults(exempt, read) {
  /** @type {string[]} */ const out = [];
  for (const [id, e] of Object.entries(exempt)) {
    const [rel, symbol] = String(e.withheldBy ?? '').split(' :: ');
    const code = rel ? read(rel) : null;
    const name = symbol?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!symbol || code === null || !new RegExp(`\\b${name}\\b`).test(code)) out.push(`${id}: withheldBy not found (${e.withheldBy ?? 'none'})`);
    if (e.provedBy === undefined) continue;
    const [trel, ...title] = e.provedBy.split(' :: ');
    const tests = read(trel);
    if (tests === null || !title.length || !tests.includes(title.join(' :: '))) out.push(`${id}: provedBy not found (${e.provedBy})`);
  }
  return out;
}

/**
 * RULE 1 over pools: every line that reds, unless the line is `dm-only` or its pool is exempt.
 * @param {Pool[]} pools @param {(id: string) => boolean} crimePool @param {Readonly<Record<string, unknown>>} exempt
 * @returns {Array<{ pool: string, vid: number, sha: string, why: string }>}
 */
export function ruleOneReds(pools, crimePool = isCrimePool, exempt = EXEMPT) {
  /** @type {Array<{ pool: string, vid: number, sha: string, why: string }>} */ const out = [];
  for (const pool of pools) {
    if (Object.hasOwn(exempt, pool.id)) continue;
    for (const v of pool.variants) {
      if ((v.marks || []).includes(COVERT)) continue;
      const why = needsOf(v, pool).filter((a) => ['crime', 'hideable'].includes(String(atomClass(a)))).map((a) => `needs ${a}`);
      if (crimePool(pool.id)) why.unshift('crime pool');
      if (why.length) out.push({ pool: pool.id, vid: v.vid, sha: textSha(v.text), why: why.join('; ') });
    }
  }
  return sortRows(out, ['pool', 'vid']);
}

/**
 * RULE 2 over pools: every other house a wording needs.
 * @param {Pool[]} pools @returns {Array<{ pool: string, vid: number, house: string }>}
 */
export function houseReadings(pools) {
  /** @type {Array<{ pool: string, vid: number, house: string }>} */ const out = [];
  for (const pool of pools) for (const v of pool.variants) {
    for (const a of needsOf(v, pool)) if (atomClass(a) === 'house') out.push({ pool: pool.id, vid: v.vid, house: a });
  }
  return sortRows(out, ['pool', 'vid', 'house']);
}

/** @template {Record<string, any>} T @param {T[]} rows @param {string[]} keys @returns {T[]} */
function sortRows(rows, keys) {
  const cmp = (/** @type {any} */ a, /** @type {any} */ b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);
  return [...rows].sort((x, y) => keys.reduce((c, k) => c || cmp(x[k], y[k]), 0));
}

// ── PHASE 3: THE HAND POOLS' LINES (SAME-2 brief H unit 1; the chair's 17:45 order (2)) ────────────
/**
 * THE FREE-TEXT FORMS (the chair's ruling of 19:29 UTC 2026-11-20 on PHASE3-REPORT's free-text table, accepted as
 * proposed): a bare line is read by this precise list, one form per word, NOT by `CRIME_KEY_WORDS` (a key's list).
 * organised only in "organised crime"; underground only before market, bazaar, network, trade or city; criminal(s)
 * kept EXCEPT in a court's sentence (courts, benches), the plural kept; gang(s) and "gang war", dropped before "of";
 * crime only in organised crime, crime wave, ring, lord, family, boss; corrupt only as corrupted or corruption; protection
 * racket and racketeer; shadow only in shadow market, economy, trade, guild, broker; thieves' guild or "the thief";
 * clandestine, syndicate, underworld as they stand. A word with no form (smuggl, black market, capture, operation role,
 * off-book) is no free-text red.
 */
export const CRIME_TEXT_FORMS = Object.freeze({
  organised: /\borgani[sz]ed crime\b/i,
  underground: /\bunderground (?:market|bazaar|network|trade|city)s?\b/i,
  criminal: /(?<!\b(?:courts?|benches)\b[^.]*)\bcriminals?\b(?![^.]*\b(?:courts?|benches)\b)/i,
  gang: /\bgang(?:s|\s+wars?)?\b(?!\s+of\b)/i,
  crime: /\bcrime (?:waves?|rings?|lords?|famil(?:y|ies)|boss(?:es)?)\b/i,
  corrupt: /\bcorrupt(?:ed|ion)\b/i,
  racket: /\b(?:protection rackets?|racketeer\w*)\b/i,
  shadow: /\bshadow (?:markets?|econom(?:y|ies)|trades?|guilds?|brokers?)\b/i,
  thief: /\bthieves'? guilds?\b|\bthe thief\b/i,
  clandestine: /\bclandest\w*/i,
  syndicate: /\bsyndicate\w*/i,
  underworld: /\bunderworld\w*/i,
});
/** The word whose form a text holds (the first, in the list's order), or null. @param {string} text */
export const crimeTextForm = (text) => Object.entries(CRIME_TEXT_FORMS).find(([, form]) => form.test(text))?.[0] ?? null;
/**
 * A SENTENCE KEY (SAME-2 brief H2 unit 2, the chair's 19:29): a key of FIVE OR MORE WORDS that holds no `|`. Measured on
 * this line, it takes every key of the five tables keyed by their base sentence (DESC_VARIANT_SIBLINGS 55,
 * SERVICE_DESC_SIBLINGS 18, HISTORY_DESC_SIBLINGS 28, FOODWAYS_PRINT_SIBLINGS 4, NPC_HOOK_SIBLINGS 2) and no other
 * table's key (INSTITUTION_DESC_VARIANTS' `tier|kind|name` keys hold `|`; the refusal rows' keys are two to four words).
 * A sentence key is read by the free-text forms, NOT by the key list: "Organised bands of hired blades." is no crime pool.
 * @param {string} key
 */
export const isSentenceKey = (key) => !key.includes('|') && key.trim().split(/\s+/).length >= 5;
/** A key that puts its lines in a CRIME POOL: a sentence key by its free-text form, any other by `CRIME_KEY_WORDS`. @param {string} key */
export const isCrimeKey = (key) => (isSentenceKey(key) ? crimeTextForm(key) !== null : CRIME_KEY_WORDS.test(key));
/** The tables keyed by a sentence (the measure above): the sentence-key rule takes all their keys and no other table's. */
const SENTENCE_KEYED = Object.freeze(['src/data/foodwaysPrintSiblings.js :: FOODWAYS_PRINT_SIBLINGS', 'src/data/historyData.js :: HISTORY_DESC_SIBLINGS',
  'src/data/institutionDescVariants.js :: DESC_VARIANT_SIBLINGS', 'src/data/institutionServices.js :: SERVICE_DESC_SIBLINGS', 'src/data/npcData.js :: NPC_HOOK_SIBLINGS']);
/** A row's fields that are not lines (its declaration, its classifiers, its labels). */
const NOT_LINE_KEYS = new Set(['key', 'type', 'label', 'twinOf', 'needs', 'excludes', 'crisis', 'institutions', 'trade',
  'dominant', 'arcane', 'colour', 'marks']);
const HOLE = '‹›';
/**
 * THE FREE-TEXT READING (the chair, 19:12 and 19:29 UTC 2026-11-20): every bare line is read by `CRIME_TEXT_FORMS`, and
 * the bank holds its reds by word (SAME-2 brief H2 unit 4).
 */
const FREE_TEXT_READ = true;

/**
 * A function line's text, read from its OWN SOURCE: its string literals and template quasis in source order, each
 * interpolation a hole. The walker calls no line and invents no record. Null when the source holds no static part.
 * @param {Function} fn
 */
export function sourceText(fn) {
  /** @type {any} */ let ast;
  try { ast = parse(`(${Function.prototype.toString.call(fn)})`, { ecmaVersion: 'latest' }); } catch { return null; }
  /** @type {Array<[number, string]>} */ const parts = [];
  walkSimple(ast, {
    Literal(/** @type {any} */ n) { if (typeof n.value === 'string') parts.push([n.start, n.value]); },
    TemplateLiteral(/** @type {any} */ n) { parts.push([n.start, n.quasis.map((/** @type {any} */ q) => q.value.cooked ?? q.value.raw).join(HOLE)]); },
  });
  return parts.length ? parts.sort((a, b) => a[0] - b[0]).map((p) => p[1]).join(' ') : null;
}

/**
 * DM-ONLY BY CONSTRUCTION (the chair's 18:38 forward; SAME-2's unit 4): a table whose name carries the owner-only mark
 * (`_dm`, `Dm`, `_DM`: DAILY's `commoner_resentments_dm`) is not exempted by a row; its lines are quiet because the
 * code DERIVES its slot only for the owner's audience. Each such hand table must name that gate (`gatedBy`, `path ::
 * symbol`, found in the file) and the test that proves the slot absent on every `toPublicSafe` document (`provedBy`,
 * `path :: title`, found in the file); a dm-named table without both is read as public and faults. Empty until the
 * Daily Life seat names its data files ("DAILY <commit>"): the gate (`src/domain/dailyLife.js :: deriveDailyLife`,
 * `audience === 'owner'`) and its proof are DAILY-2's B3 E1, not yet on any branch.
 * @type {Readonly<Record<string, { gatedBy: string, provedBy: string }>>}
 */
const DM_BY_CONSTRUCTION = Object.freeze({});
const DM_NAMED = /(?:_dm|Dm|_DM)$/;
/** @param {string} ref `path :: symbol` */
export const isDmNamed = (ref) => ref.split(' :: ').some((part) => DM_NAMED.test(part.replace(/\.[cm]?jsx?$/, '')));

/**
 * The faults of the by-construction arm: a dm-named hand table with no entry; an entry naming no dm-named hand table;
 * an entry whose gate or proof is not found.
 * @param {string[]} refs the hand list's tables @param {Readonly<Record<string, { gatedBy?: string, provedBy?: string }>>} table
 * @param {(rel: string) => string|null} read
 */
export function byConstructionFaults(refs, table, read) {
  const out = refs.filter((r) => isDmNamed(r) && !Object.hasOwn(table, r)).map((r) => `${r}: dm-named, no gate declared`);
  out.push(...Object.keys(table).filter((r) => !refs.includes(r) || !isDmNamed(r)).map((r) => `${r}: not a dm-named hand table`));
  const asExempt = Object.fromEntries(Object.entries(table).map(([r, e]) => [r, { withheldBy: e.gatedBy, provedBy: e.provedBy ?? '' }]));
  return [...out, ...exemptionFaults(asExempt, read)];
}

/** @param {unknown} x */
const isRow = (x) => !!x && typeof x === 'object' && !Array.isArray(x) && ('text' in x || 'line' in x);

/** A line's text: a string as it is; a function, or a row's function `text | line`, by its source. @param {unknown} x */
export function lineText(x) {
  const t = isRow(x) ? (/** @type {any} */ (x).text ?? /** @type {any} */ (x).line) : x;
  return typeof t === 'string' ? t : typeof t === 'function' ? sourceText(t) : null;
}

/**
 * Every line of a hand pool, with the key path it sits under: arrays and objects are walked to their leaves (a string,
 * a function, a `{ text | line }` row); a drawn closure that carries its rows (`lines`, e.g. `npcData.js :: pairProse`)
 * is read through them.
 * @param {unknown} value @returns {Array<{ path: string[], x: unknown }>}
 */
export function poolLeaves(value) {
  /** @type {Array<{ path: string[], x: unknown }>} */ const out = [];
  /** @param {unknown} x @param {string[]} path */
  const rec = (x, path) => {
    if (typeof x === 'function' && Array.isArray(/** @type {any} */ (x).lines)) rec(/** @type {any} */ (x).lines, path);
    else if (typeof x === 'string' || typeof x === 'function' || isRow(x)) out.push({ path, x });
    else if (Array.isArray(x)) for (const y of x) rec(y, path);
    else if (x && typeof x === 'object') for (const [k, y] of Object.entries(x)) if (!NOT_LINE_KEYS.has(k)) rec(y, [...path, k]);
  };
  rec(value, []);
  return out;
}

/** @typedef {{ ref: string, value: unknown }} HandPool a hand-listed table on this line: `path :: symbol` and its value */

/**
 * The phase-3 reading of the hand pools' lines. A DECLARED row (`needs` or `marks`) is read by its atoms: rule 1 reds
 * a crime or hideable atom, rule 2 lists its other houses. Every other line (a bare string, a function, a row that
 * declares no need) is read by `CRIME_TEXT_FORMS`. A line under a key `isCrimeKey` takes is in a CRIME POOL. A line
 * marked `dm-only`, or in a pool `EXEMPT` names, reds nowhere.
 * @param {HandPool[]} hand @param {Readonly<Record<string, unknown>>} [exempt] @param {boolean} [words] read bare lines by `CRIME_TEXT_FORMS`
 * @param {Readonly<Record<string, unknown>>} [dm] the tables dm-only by construction
 */
export function readHandLines(hand, exempt = EXEMPT, words = FREE_TEXT_READ, dm = DM_BY_CONSTRUCTION) {
  /** @type {Array<{ pool: string, sha: string, text: string|null, why: string[], houses: string[], quiet: boolean }>} */ const out = [];
  for (const { ref, value } of hand) for (const { path, x } of poolLeaves(value)) {
    const pool = [ref, ...path].join('::');
    const row = /** @type {Record<string, any>} */ (isRow(x) ? x : {});
    const declared = Array.isArray(row.needs) || Array.isArray(row.marks);
    const atoms = declared ? [...new Set([...(row.needs || []), ...(row.marks || []).filter((/** @type {string} */ m) => m !== COVERT)])] : [];
    const text = lineText(x);
    /** @type {string[]} */ const why = [];
    if (path.some(isCrimeKey)) why.push('crime pool');
    if (declared) why.push(...atoms.filter((a) => ['crime', 'hideable'].includes(String(atomClass(a)))).map((a) => `needs ${a}`));
    else if (words && text !== null && crimeTextForm(text)) why.push(`crime word ${crimeTextForm(text)}`);
    if (text === null) why.push('unreadable');
    const quiet = (row.marks || []).includes(COVERT) || Object.hasOwn(exempt, pool) || Object.hasOwn(exempt, ref) || Object.hasOwn(dm, ref);
    out.push({ pool, sha: textSha(text), text, why, houses: atoms.filter((a) => atomClass(a) === 'house'), quiet });
  }
  return out;
}

/** RULE 1 over the hand pools' lines. @param {HandPool[]} hand @param {Readonly<Record<string, unknown>>} [exempt] @param {boolean} [words] @param {Readonly<Record<string, unknown>>} [dm] */
export const handReds = (hand, exempt = EXEMPT, words = FREE_TEXT_READ, dm = DM_BY_CONSTRUCTION) => sortRows(readHandLines(hand, exempt, words, dm).filter((l) => l.why.length && !l.quiet)
  .map(({ pool, sha, why }) => ({ pool, sha, why: why.join('; ') })), ['pool', 'sha', 'why']);

/** RULE 2 over the hand pools' declared lines. @param {HandPool[]} hand */
export const handHouseReadings = (hand) => sortRows(readHandLines(hand, {}).flatMap(({ pool, sha, houses }) => houses.map((house) => ({ pool, sha, house }))),
  ['pool', 'sha', 'house']);

/**
 * THE WATCH (SAME-2 brief H2 unit 5, the chair's 19:29): a NEW hand line that holds a bare crime word OUTSIDE the forms
 * (crime, criminal, thief, thieves, gang, smuggl, bribe, or a fence as a person: "a fence", "the fence", "fences stolen")
 * is LISTED as "watch" (a warn block on stderr, one line each) for a human to read at every landing; NEVER red. A line is
 * new when its text hash is neither in the bank nor in `watchBase`, the lines on BASE (43ab0f5eb, the walker's base: a
 * line is new when it is not on that commit) that hold such a word.
 */
const WATCH_WORDS = /\b(?:crimes?|criminals?|thief|thieves|gangs?|smuggl\w*|brib\w*)\b|\b(?:a|the) fence\b|\bfences stolen\b/i;
const ANY_FORM = new RegExp(Object.values(CRIME_TEXT_FORMS).map((f) => `(?:${f.source})`).join('|'), 'gi');
/** The bare crime word a text holds outside the free-text forms, or null. @param {string} text */
export const watchWord = (text) => text.replace(ANY_FORM, ' ').match(WATCH_WORDS)?.[0]?.toLowerCase() ?? null;
/**
 * The watch rows: each line not quiet, not seen, holding a bare crime word outside the forms.
 * @param {ReturnType<typeof readHandLines>} lines @param {Set<string>} seen the bank's and the base's text hashes
 * @returns {Array<{ pool: string, sha: string, word: string, text: string }>}
 */
export function watchRows(lines, seen) {
  /** @type {Array<{ pool: string, sha: string, word: string, text: string }>} */ const out = [];
  for (const { pool, sha, text, quiet } of lines) {
    const word = !quiet && text !== null && !seen.has(sha) ? watchWord(text) : null;
    if (word && text !== null) out.push({ pool, sha, word, text });
  }
  return sortRows(out, ['pool', 'sha']);
}

// ── THE TOTALITY ARM ────────────────────────────────────────────────────────────────────────────
const DRAW_CALL = /\b(?:pick|drawDeclared|weightedPick|pickVariant|pickVariantMixed)\(/;
const NAMED_IMPORT = /import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g;

/**
 * The `src/data/` exports each draw site imports by name: `dataRel :: name`.
 * @param {Array<{ rel: string, text: string }>} files the tree's files outside `src/data/`
 * @returns {Map<string, Set<string>>}
 */
export function drawnDataImports(files) {
  /** @type {Map<string, Set<string>>} */ const out = new Map();
  for (const { rel, text } of files) {
    if (rel.startsWith('src/data/') || !DRAW_CALL.test(text)) continue;
    for (const m of text.matchAll(NAMED_IMPORT)) {
      if (!m[2].startsWith('.')) continue;
      let target = relative(ROOT, resolve(ROOT, dirname(rel), m[2])).replace(/\\/g, '/');
      if (!/\.[cm]?jsx?$/.test(target)) target += '.js';
      if (!target.startsWith('src/data/')) continue;
      for (const part of m[1].split(',')) {
        const name = part.trim().split(/\s+as\s+/)[0].trim();
        if (name && !name.startsWith('type ')) (out.get(target) ?? out.set(target, new Set()).get(target))?.add(name);
      }
    }
  }
  return out;
}

/** @param {unknown} x */
const isWording = (x) => typeof x === 'string' || (!!x && typeof x === 'object' && !Array.isArray(x)
  && (typeof (/** @type {any} */ (x)).text === 'string' || ['string', 'function'].includes(typeof (/** @type {any} */ (x)).line)));
/** @param {unknown} v */
const isPoolArray = (v) => Array.isArray(v) && v.length > 0 && v.every(isWording);
/** Pool-shaped: an array of wordings, or an object of such arrays. @param {unknown} v */
export const isPoolShaped = (v) => isPoolArray(v)
  || (!!v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0 && Object.values(v).every(isPoolArray));

/**
 * The pool-shaped tables the draw sites read, `path :: symbol`, sorted.
 * @param {Map<string, Set<string>>} imports @param {(rel: string) => Promise<Record<string, unknown>>} load
 */
export async function poolTables(imports, load) {
  /** @type {string[]} */ const out = [];
  for (const [rel, names] of imports) {
    const mod = await load(rel);
    for (const name of names) if (isPoolShaped(mod[name])) out.push(`${rel} :: ${name}`);
  }
  return out.sort();
}

/**
 * The totality verdict: a found table neither reached nor listed; a row of the join line whose table the arm no longer
 * finds (remove it). A seat's row stands until that seat registers its pool, whether or not the pool is on this line yet.
 * @param {string[]} found @param {Set<string>} reached
 * @param {Array<{ pool: string, seat: string, branch: string, commit: string }>} hand
 */
export function totalityVerdict(found, reached, hand) {
  const listed = new Set(hand.map((r) => r.pool));
  return {
    unregistered: found.filter((t) => !reached.has(t) && !listed.has(t)),
    stale: hand.filter((r) => r.branch === JOIN && !found.includes(r.pool)).map((r) => r.pool),
  };
}

/** @param {string} dir @param {string[]} [out] @returns {string[]} */
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) { const p = join(dir, e); if (statSync(p).isDirectory()) walk(p, out); else out.push(p); }
  return out;
};
const treeFiles = () => walk(join(ROOT, 'src')).filter((p) => /\.(?:jsx?|mjs)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), text: readFileSync(p, 'utf8') }));
/** A file of the tree, or null. @param {string} rel */
const readRel = (rel) => (existsSync(join(ROOT, rel)) ? readFileSync(join(ROOT, rel), 'utf8') : null);
/** The hand-listed tables on this line (a seat's row whose table is not on this line yet is skipped). @param {Array<{ pool: string }>} rows */
const handPoolsOnLine = async (rows) => {
  /** @type {HandPool[]} */ const out = [];
  for (const { pool } of rows) {
    const [rel, symbol] = pool.split(' :: ');
    if (!existsSync(join(ROOT, rel))) continue;
    const value = (await import(join(ROOT, rel)))[symbol];
    if (value !== undefined) out.push({ ref: pool, value });
  }
  return out;
};
// ── THE ARMS ────────────────────────────────────────────────────────────────────────────────────
describe(`the hideable-house walker of the sameness pools (base ${BASE})`, async () => {
  const pools = await corpusPools();
  const ids = new Set(pools.map((p) => p.id));

  test('THE KNOWN LIMIT stands in the header in the chair\'s words', () => {
    const head = readFileSync(join(ROOT, 'tests/lint/samenessHideable.walker.test.js'), 'utf8').split('\nimport ')[0];
    expect(head.replace(/\s*\n\s*\*\s*/g, ' ')).toContain('an indirectly drawn pool escapes the totality arm; the hand list is its remedy');
  });

  test('the classes stand on the live vocabulary: every home named is a home, every crime-like dimension is a crime home', () => {
    const homes = new Set(Object.values(FACT_DIMENSIONS).map((d) => d.home));
    expect([...CRIME_HOMES, ...HOUSE_HOMES].filter((h) => !homes.has(h))).toEqual([]);
    const crimeLike = Object.entries(FACT_DIMENSIONS).filter(([name, d]) => /crim|rings/i.test(`${name} ${d.home}`) && !CRIME_HOMES.includes(d.home));
    expect(crimeLike.map(([name]) => name)).toEqual([]);
    expect(isHideableHouse(houseOfKind('criminal'))).toBe(true);
  });

  test('the crime pools, the not-crime pools and the exemptions each name a real pool; a crime-like key is classed', () => {
    const named = [...Object.keys(CRIME_POOLS), ...Object.keys(NOT_CRIME_POOLS), ...Object.keys(EXEMPT)];
    expect(named.filter((id) => !ids.has(id))).toEqual([]);
    expect(Object.keys(CRIME_BLOCKS).filter((b) => !pools.some((p) => p.id.startsWith(`${b}::`)))).toEqual([]);
    const unclassed = pools.map((p) => p.id).filter((id) => CRIME_KEY_WORDS.test(id.split('::')[1]) && !isCrimePool(id) && !Object.hasOwn(NOT_CRIME_POOLS, id));
    expect(unclassed).toEqual([]);
    for (const [id, e] of Object.entries(EXEMPT)) {
      expect(['withheld', 'trouble'], id).toContain(e.class);
      expect(e.reason.length, id).toBeGreaterThan(0);
    }
  });

  test('EXEMPT: every exemption carries the line of code that withholds it (and its proving test, where one exists)', () => {
    expect(exemptionFaults(EXEMPT, readRel)).toEqual([]);
  });

  test('DM BY CONSTRUCTION: every dm-named hand table names its owner-only gate and its proof; every entry is one', () => {
    expect(byConstructionFaults(readJson(HAND_REL).rows.map((/** @type {{ pool: string }} */ r) => r.pool), DM_BY_CONSTRUCTION, readRel)).toEqual([]);
  });

  test('RULE 1: the reds equal the bank of the base exactly (a new red line reds; a cured one leaves the bank)', () => {
    const bank = readJson(EXISTING_REL).rows;
    expect(bank.length).toBeLessThanOrEqual(EXISTING_CEILING);
    expect(ruleOneReds(pools)).toEqual(bank);
  });

  test('RULE 2: the house readings equal the committed list exactly', () => {
    expect(houseReadings(pools)).toEqual(readJson(HOUSES_REL).rows);
  });

  test('PHASE 3, RULE 1: the hand pools\' red lines equal the bank\'s hand rows exactly (a new red line reds; a cured one leaves)', async () => {
    const bank = readJson(EXISTING_REL);
    expect(bank.rows.length + bank.hand.length).toBeLessThanOrEqual(EXISTING_CEILING);
    const hand = await handPoolsOnLine(readJson(HAND_REL).rows);
    expect(hand.length).toBeGreaterThan(0);
    expect(readHandLines(hand).filter((l) => l.text === null).map((l) => l.pool)).toEqual([]);
    expect(handReds(hand)).toEqual(bank.hand);
  });

  test('PHASE 3, RULE 2: the hand pools\' declared lines\' houses equal the committed list exactly', async () => {
    expect(handHouseReadings(await handPoolsOnLine(readJson(HAND_REL).rows))).toEqual(readJson(HOUSES_REL).hand);
  });

  test('SENTENCE KEYS: the rule takes every key of the sentence-keyed tables and no other table\'s key', async () => {
    const taken = new Map();
    for (const { ref, value } of await handPoolsOnLine(readJson(HAND_REL).rows)) {
      const keys = new Set(poolLeaves(value).flatMap(({ path }) => path));
      taken.set(ref, [[...keys].filter(isSentenceKey).length, keys.size]);
    }
    expect([...taken].filter(([, [n]]) => n > 0).map(([ref]) => ref).sort()).toEqual([...SENTENCE_KEYED]);
    for (const ref of SENTENCE_KEYED) expect(taken.get(ref)?.[0], ref).toBe(taken.get(ref)?.[1]);
  });

  test('THE WATCH: a new hand line with a bare crime word outside the forms is LISTED (a warn block), never red', async () => {
    const bank = readJson(EXISTING_REL);
    const seen = new Set([...bank.hand, ...bank.watchBase].map((/** @type {{ sha: string }} */ r) => r.sha));
    const watch = watchRows(readHandLines(await handPoolsOnLine(readJson(HAND_REL).rows)), seen);
    // The block goes to stderr directly: this suite's runner swallows a PASSING test's console.warn (measured, a probe),
    // and the watch is read on green runs.
    if (watch.length) {
      process.stderr.write(`${[`THE WATCH (samenessHideable, SAME-2 H2 unit 5): ${watch.length} new hand line(s) with a bare crime word outside the forms. A human reads each; none reds.`,
        ...watch.map((w) => `  watch  ${w.pool}  ${w.sha}  "${w.word}"  ${w.text}`)].join('\n')}\n`);
    }
    expect(watch.every((w) => w.word.length > 0)).toBe(true); // a listing: it never reds on its rows
  });

  test('TOTALITY: every pool-shaped table a draw site reads is reached by corpusPools or on the hand list', async () => {
    const hand = readJson(HAND_REL).rows;
    expect(hand.length).toBeLessThanOrEqual(HAND_CEILING);
    expect(hand.map((/** @type {{ pool: string }} */ r) => r.pool)).toEqual([...new Set(hand.map((/** @type {{ pool: string }} */ r) => r.pool))].sort());
    for (const r of hand) expect(r.seat && r.branch && /^[0-9a-f]{9}$/.test(r.commit), r.pool).toBeTruthy();
    const found = await poolTables(drawnDataImports(treeFiles()), (rel) => import(join(ROOT, rel)));
    expect(found.length).toBeGreaterThan(0);
    const reached = new Set();
    for (const leaf of CORPUS_LEAVES) {
      const rel = `src/data/dossierStateProse/${leaf}.generated.js`;
      for (const name of Object.keys(await import(join(ROOT, rel)))) reached.add(`${rel} :: ${name}`);
    }
    expect(totalityVerdict(found, reached, hand)).toEqual({ unregistered: [], stale: [] });
  });

  describe('planted reds', () => {
    /** @param {string} id @param {Array<Record<string, any>>} variants @returns {Pool} */
    const fixture = (id, variants) => ({ id, variants, meta: {} });

    test('a new line in a crime pool reds; the same line marked dm-only passes', () => {
      const pool = fixture('DS-DEF-4::structure organized', [{ vid: 99, text: 'A new public line about the crews.', marks: [] }]);
      expect(ruleOneReds([pool]).map((r) => r.why)).toEqual(['crime pool']);
      const covert = fixture('DS-DEF-4::structure organized', [{ vid: 99, text: 'A new public line about the crews.', marks: [COVERT] }]);
      expect(ruleOneReds([covert])).toEqual([]);
    });

    test('a new wording needing a criminal house reds in any pool; exempted by declaration, the pool passes', () => {
      const pool = fixture('DS-ECO-1::FIXTURE', [{ vid: 1, text: 'Somebody organises the trade here.', marks: ['organised crime'] }]);
      expect(ruleOneReds([pool], () => false, {}).map((r) => r.why)).toEqual(['needs organised crime']);
      expect(ruleOneReds([pool], () => false, { 'DS-ECO-1::FIXTURE': { class: 'withheld', reason: 'a fixture' } })).toEqual([]);
      expect(houseReadings([fixture('DS-ECO-1::FIXTURE', [{ vid: 1, text: 'x', marks: ['walls', 'organised crime'] }])])).toEqual([{ pool: 'DS-ECO-1::FIXTURE', vid: 1, house: 'walls' }]);
    });

    test('EXEMPT: an exemption without its withholding line reds; with a line found in its file, it passes', () => {
      const read = (/** @type {string} */ rel) => (rel === 'src/x.js' ? 'export function hideIt() {}' : rel === 'tests/x.test.js' ? "test('it hides', () => {})" : null);
      expect(exemptionFaults({ 'DS-X::a': {} }, read)).toEqual(['DS-X::a: withheldBy not found (none)']);
      expect(exemptionFaults({ 'DS-X::a': { withheldBy: 'src/x.js :: showIt' } }, read)).toHaveLength(1);
      expect(exemptionFaults({ 'DS-X::a': { withheldBy: 'src/y.js :: hideIt' } }, read)).toHaveLength(1);
      expect(exemptionFaults({ 'DS-X::a': { withheldBy: 'src/x.js :: hideIt', provedBy: 'tests/x.test.js :: it shows' } }, read)).toHaveLength(1);
      expect(exemptionFaults({ 'DS-X::a': { withheldBy: 'src/x.js :: hideIt', provedBy: 'tests/x.test.js :: it hides' } }, read)).toEqual([]);
    });

    test('DM BY CONSTRUCTION: a dm-named table without its gate faults and reads as public; with gate and proof found, its lines are quiet', () => {
      const ref = 'src/data/dailyLife/commonerResentmentsDm.js :: COMMONER_RESENTMENTS_DM';
      const read = (/** @type {string} */ rel) => (rel === 'src/domain/dailyLife.js' ? "export function deriveDailyLife(r, { audience } = {}) { if (audience === 'owner') {} }"
        : rel === 'tests/domain/dailyLifeDm.test.js' ? "test('absent on every toPublicSafe document', () => {})" : null);
      expect(isDmNamed(ref)).toBe(true);
      expect(isDmNamed('src/data/npcData.js :: NPC_WANTS')).toBe(false);
      expect(byConstructionFaults([ref], {}, read)).toEqual([`${ref}: dm-named, no gate declared`]);
      const value = { crime70: ['The smugglers pay no toll while honest carts queue.'] };
      expect(handReds([{ ref, value }]).map((r) => r.why)).toEqual(['crime pool']);
      const table = { [ref]: { gatedBy: 'src/domain/dailyLife.js :: deriveDailyLife', provedBy: 'tests/domain/dailyLifeDm.test.js :: absent on every toPublicSafe document' } };
      expect(byConstructionFaults([ref], table, read)).toEqual([]);
      expect(handReds([{ ref, value }], EXEMPT, true, table)).toEqual([]);
      expect(byConstructionFaults([ref], { [ref]: { gatedBy: 'src/domain/dailyLife.js :: deriveDailyLifeDm', provedBy: table[ref].provedBy } }, read)).toHaveLength(1);
      expect(byConstructionFaults(['src/data/npcData.js :: NPC_WANTS'], { 'src/data/npcData.js :: NPC_WANTS': table[ref] }, read)).toHaveLength(1);
    });

    test('PHASE 3: a new line in a hand-listed criminal key reds; dm-only, or in an exempt pool, it passes', () => {
      const ref = 'src/data/npcData.js :: NPC_FACTION_LOYALTY';
      expect(handReds([{ ref, value: { criminal: ['They owe the crew one favour more.'] } }]).map((r) => r.why)).toEqual(['crime pool']);
      expect(handReds([{ ref, value: { criminal: [{ text: 'They owe the crew one favour more.', marks: [COVERT] }] } }])).toEqual([]);
      expect(handReds([{ ref, value: { criminal: ['x'] } }], { [`${ref}::criminal`]: { class: 'withheld' } })).toEqual([]);
    });

    test('CORRUPTION IS A CRIME FACT (the chair, 19:29): a line under POWER::corrupted reds by key; dm-only, it passes', () => {
      const ref = 'src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES';
      expect(handReds([{ ref, value: { POWER: { corrupted: { short: ['Keeps the magistrate sweet.'] } } } }]).map((r) => r.why)).toEqual(['crime pool']);
      expect(handReds([{ ref, value: { POWER: { corrupted: { short: [{ text: 'Keeps the magistrate sweet.', marks: [COVERT] }] } } } }])).toEqual([]);
    });

    test('SENTENCE KEYS: a key that is a sentence is read by the free-text forms, not the key list', () => {
      const ref = 'src/data/institutionDescVariants.js :: DESC_VARIANT_SIBLINGS';
      const blades = 'Organised bands of hired blades. Major forces, hundreds to thousands strong.';
      expect(isSentenceKey(blades)).toBe(true);
      expect(isSentenceKey('city|Criminal|Thieves guild chapter')).toBe(false);
      expect(handReds([{ ref, value: { [blades]: ['Hired swords, by the hundred.'] } }])).toEqual([]);
      expect(handReds([{ ref, value: { 'A chapter of organised crime. Thirty to a hundred members.': ['A cell of the wider order.'] } }]).map((r) => r.why)).toEqual(['crime pool']);
      expect(handReds([{ ref: 'src/data/npcData.js :: NPC_WANTS', value: { organised: ['x'] } }]).map((r) => r.why)).toEqual(['crime pool']);
    });

    test('PHASE 3: a bare line holding a free-text form reds in a non-crime hand pool, a string or a function read by its source', () => {
      const ref = 'src/data/narrativeData.js :: STRESS_NOTES';
      expect(handReds([{ ref, value: { famine: ['Rival gangs, forever disputing their turf.'] } }], EXEMPT, true).map((r) => r.why)).toEqual(['crime word gang']);
      expect(handReds([{ ref, value: { famine: [(/** @type {string} */ n) => `${n} has a gang at its gate.`] } }], EXEMPT, true).map((r) => r.why)).toEqual(['crime word gang']);
      expect(sourceText((/** @type {string} */ n) => `${n} waits.`)).toBe('‹› waits.');
      expect(handReds([{ ref, value: { famine: ['A smuggler sells grain by the well.', 'An unorganised heap of sacks.'] } }], EXEMPT, true)).toEqual([]); // smuggl has no form
    });

    test('THE FREE-TEXT FORMS (the chair, 19:29): each form takes its hit and leaves its non-hit (the report\'s examples)', () => {
      /** @type {Record<string, [string, string]>} word -> [a hit, a non-hit] */
      const cases = {
        organised: ['A chapter of organised crime. Thirty to a hundred members.', 'Guild-organised carpenters, joiners and wrights.'],
        underground: ['A standing underground market dealing contraband, forged papers, and services no law permits.', 'Drains laid underground.'],
        criminal: ['Miles of tunnel and catacomb turned to shelter for criminals and refugees alike.', 'Commercial, criminal, and ecclesiastical benches, each in its own house.'],
        gang: ['The criminal syndicate the city has never rooted out, for fear that open gang war would be worse.', 'A stone quarry, its blocks cut and dressed by a gang of quarrymen.'],
        crime: ['A crime wave the watch cannot stem.', 'Separate courts for trade, for crime, and for the church.'],
        corrupt: ['Bribes and corrupted border infrastructure hold it together.', 'Corrupt, vain and quick to anger.'],
        racket: ['A "security fee" that is, in practice, a protection racket.', 'The racket of the mill wheel never stops.'],
        shadow: ['A shadow market trades behind the granary.', 'Never end up in their shadow.'],
        thief: ['On the payroll of the thieves\' guild as a silent informant.', 'Enough to discourage the casual thief.'],
        clandestine: ['An entirely clandestine trade in persons.', 'An open trade in persons.'],
        syndicate: ['The syndicate takes its cut.', 'The guild takes its cut.'],
        underworld: ['An underworld power the city has never rooted out.', 'A power the city has never rooted out.'],
      };
      expect(Object.keys(cases)).toEqual(Object.keys(CRIME_TEXT_FORMS));
      for (const [word, [hit, miss]] of Object.entries(cases)) {
        expect(crimeTextForm(hit), hit).not.toBeNull();
        expect(CRIME_TEXT_FORMS[/** @type {keyof typeof CRIME_TEXT_FORMS} */ (word)].test(hit), hit).toBe(true);
        expect(crimeTextForm(miss), miss).toBeNull();
      }
      expect(crimeTextForm('Several courts sitting at once, each to its province: commercial, criminal, appellate, ecclesiastical.')).toBeNull();
      expect(crimeTextForm('Holds debtors, criminals, and political prisoners alike.')).toBe('criminal'); // the plural is kept
    });

    test('THE WATCH: a new line "A fence buys what the carters lose." is listed, not red; seen, or a form\'s word, it is not listed', () => {
      const ref = 'src/data/narrativeData.js :: STRESS_NOTES';
      const fence = [{ ref, value: { famine: ['A fence buys what the carters lose.'] } }];
      expect(handReds(fence)).toEqual([]);
      const listed = watchRows(readHandLines(fence), new Set());
      expect(listed.map((w) => [w.pool, w.word])).toEqual([[`${ref}::famine`, 'a fence']]);
      expect(watchRows(readHandLines(fence), new Set([listed[0].sha]))).toEqual([]);
      expect(watchWord('A smuggler sells grain by the well.')).toBe('smuggler');
      expect(watchWord('They overheard two people settle a bribe.')).toBe('bribe');
      expect(watchWord('A chapter of organised crime.')).toBeNull();
      expect(watchWord('Rival gangs, forever disputing their turf.')).toBeNull();
      expect(watchWord('The fence along the lane needs mending.')).toBe('the fence'); // a listing errs toward the human's eye
    });

    test('PHASE 3: a declared hand line is read by its atoms (a crime atom reds; a house is listed), not by its words', () => {
      const ref = 'src/data/narrativeData.js :: ARRIVAL_SCENES';
      expect(handReds([{ ref, value: { calm: [{ text: 'Somebody runs the trade.', needs: ['organised crime'] }] } }]).map((r) => r.why)).toEqual(['needs organised crime']);
      const walled = { text: 'A smuggler waits at the walls.', needs: ['walls'] };
      expect(handReds([{ ref, value: { calm: [walled] } }], EXEMPT, true)).toEqual([]);
      expect(handHouseReadings([{ ref, value: { calm: [walled] } }]).map((r) => r.house)).toEqual(['walls']);
    });

    test('an unregistered pool-shaped table a draw site reads reds; listed, it passes', async () => {
      const files = [
        { rel: 'src/generators/fixtureDraw.js', text: "import { FIXTURE_LINES, FIXTURE_WORDS } from '../data/fixtureLines.js';\nexport const f = (r) => pick(FIXTURE_LINES, r);" },
        { rel: 'src/generators/fixtureQuiet.js', text: "import { QUIET_LINES } from '../data/fixtureLines.js';\nexport const g = () => QUIET_LINES[0];" },
      ];
      const values = { FIXTURE_LINES: { calm: ['One line.', { text: 'Another line.' }] }, FIXTURE_WORDS: 3, QUIET_LINES: ['A line nobody draws.'] };
      const found = await poolTables(drawnDataImports(files), async () => values);
      expect(found).toEqual(['src/data/fixtureLines.js :: FIXTURE_LINES']);
      expect(totalityVerdict(found, new Set(), []).unregistered).toEqual(found);
      const row = { pool: found[0], seat: 'FIXTURE', branch: 'lane/fixture', commit: '000000000' };
      expect(totalityVerdict(found, new Set(), [row])).toEqual({ unregistered: [], stale: [] });
      const gone = { pool: 'src/data/gone.js :: GONE', seat: 'join', branch: JOIN, commit: BASE };
      expect(totalityVerdict(found, new Set(), [row, gone]).stale).toEqual(['src/data/gone.js :: GONE']);
    });
  });
});
