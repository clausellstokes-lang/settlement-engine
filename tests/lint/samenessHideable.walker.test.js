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
 *
 * It renders nothing and births nothing: seconds.
 *
 * @enforced-by tests/lint/samenessHideable.walker.test.js
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

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
const EXISTING_CEILING = 96;
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
/** A key that reads like crime must be classed above. */
const CRIME_KEY_WORDS = /thie(?:f|ves)|gang|criminal|crime|smuggl|syndicate|racket|underworld|black ?market|shadow|capture|clandest|underground|organi[sz]ed|corrupt|operation role|off-book|off the books/i;

/** @param {string} id */
export const isCrimePool = (id) => Object.hasOwn(CRIME_POOLS, id) || Object.hasOwn(CRIME_BLOCKS, id.split('::')[0]);

// ── EXEMPT, BY DECLARATION ONLY ─────────────────────────────────────────────────────────────────
/** @type {Readonly<Record<string, { class: 'withheld' | 'trouble', reason: string }>>} */
const EXEMPT = Object.freeze({
  'DS-HK-1::clock smuggling_rise': { class: 'trouble', reason: 'the state a hook is framed from: the trouble half\'s hooks are dropped on a public page' },
});

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
// ── THE ARMS ────────────────────────────────────────────────────────────────────────────────────
describe(`the hideable-house walker of the sameness pools (base ${BASE})`, async () => {
  const pools = await corpusPools();
  const ids = new Set(pools.map((p) => p.id));

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

  test('RULE 1: the reds equal the bank of the base exactly (a new red line reds; a cured one leaves the bank)', () => {
    const bank = readJson(EXISTING_REL).rows;
    expect(bank.length).toBeLessThanOrEqual(EXISTING_CEILING);
    expect(ruleOneReds(pools)).toEqual(bank);
  });

  test('RULE 2: the house readings equal the committed list exactly', () => {
    expect(houseReadings(pools)).toEqual(readJson(HOUSES_REL).rows);
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
