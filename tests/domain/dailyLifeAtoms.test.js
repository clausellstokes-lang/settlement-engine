/**
 * tests/domain/dailyLifeAtoms.test.js — DAILY-2 B1b C2, THE ATOMS AND THE ROUTE (the chair's ruling 12 of 2026-11-20
 * 18:56, which supersedes B-BUILD-COMMON item 2: no `needsHold` module; every daily-life pool line is declared in the
 * vocabulary's own atoms and selected through `facts/drawDeclared.js :: filterDeclared`).
 *
 *   (a) THE 13 KINDS (ruling 8, ruling 12 (1)): each answers `hasInstitution` on a planted record holding a catalogue row
 *       of that kind (and not on one that holds none), and the vocabulary's `institution: <kind>` admits a line there.
 *   (b) AN UNKNOWN ATOM IS REFUSED (the vocabulary's own rule, pinned: `parseAtom` knows no such word, so
 *       `declarationAdmits` refuses the line fail-closed and `assertDeclarable` throws; never a silent admit). Every need
 *       name of LINES-1 / LINES-1b / LINES-2 maps to a declarable atom, or stands in the NOT-GRANTED list below.
 *   (c) THE LANE'S HIDEABLE-AND-CRIME ARM (ruling 6, LINES-COMMON rule 6): every line of every pool under
 *       `src/data/dailyLife/` declares only declarable atoms, no crime atom, and no atom a hideable house
 *       (`people/cardVeil.js :: isHideableHouse`) of the catalogue can satisfy; the walker reds on planted bad lines.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { hasInstitution, INSTITUTION_KINDS } from '../../src/domain/facts/institutions.js';
import { INSTITUTION_WORDS, assertDeclarable, atomHolds, atomsOf, declarationOf, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

// ── (a) the 13 kinds, each with a catalogue row that holds it (the names the catalogue prints) ──
const KIND_ROWS = Object.freeze({
  waterSource: 'Water source', dwellings: 'Dwellings (5-25)', farmland: 'Farmland', commonGrazing: 'Common grazing land',
  bridge: 'Toll bridge', square: 'Market square', bakery: 'Bakers (5-15)', warehouse: 'Merchant warehouses',
  theatre: 'Theaters', fishingLanding: "Fisher's landing", rootCellar: 'Communal root cellar', shepherd: 'Shepherd',
  craftGuild: 'Craft guilds (5-15)',
});
const planted = (/** @type {string[]} */ names) => ({ tier: 'village', institutions: names.map((name) => ({ name })) });

describe('(a) the 13 granted kinds answer hasInstitution (ruling 8; ruling 12 (1))', () => {
  for (const [kind, row] of Object.entries(KIND_ROWS)) {
    it(`${kind}: "${row}" holds it; an empty roster and an access row do not`, () => {
      expect(hasInstitution(planted([row]), kind)).toBe(true);
      expect(hasInstitution(planted([]), kind)).toBe(false);
      expect(hasInstitution(planted([`Access to ${row.toLowerCase()}`]), kind)).toBe(false);
      expect(INSTITUTION_WORDS).toContain(kind);
      const line = Object.freeze({ text: 'planted', needs: Object.freeze([`institution: ${kind}`]) });
      expect(filterDeclared([line], { facts: factsOf(planted([row])) })).toEqual([line]);
      expect(filterDeclared([line], { facts: factsOf(planted([])) })).toEqual([]);
    });
  }
  it('the kinds are appended rows: the vocabulary\'s words equal the home\'s kinds, the 14 earlier rows first', () => {
    expect(INSTITUTION_WORDS).toEqual(INSTITUTION_KINDS);
    expect(INSTITUTION_KINDS.slice(0, 14)).toEqual(['hospital', 'healer', 'monastery', 'mill', 'smith', 'bathhouse', 'docks', 'quarry', 'mine', 'tavern', 'school', 'temple', 'granary', 'bank']);
    expect(INSTITUTION_KINDS.slice(14)).toEqual(Object.keys(KIND_ROWS));
  });
});

// ── (b) the need names of the line files, each to an atom ──
/**
 * Every need name LINES-1 (`lines/L1/probe.1.mjs :: NEED_DOC`, with LINES-1b's `small` from the tier) and LINES-2
 * (`lines/L2/pools.2.mjs`) use, with ruling 11's split names, → the atoms a line declares for it (a conjunction). A
 * house a wording NAMES is found by the deriver from the live, non-hideable, non-access roster: that is the house's
 * lookup, not a need. Branch selectors (food band, threat kind/stage, tension type, audience) are not needs.
 */
const NEED_ATOMS = Object.freeze({
  // LINES-1 / LINES-1b
  walls: ['walls'], gate: ['gate'], militia: ['militia'], guard: ['guardPresence'], sickHouse: ['sick house'],
  granary: ['institution: granary'], smith: ['institution: smith'], millHouse: ['institution: mill'], inn: ['institution: tavern'],
  bathhouse: ['institution: bathhouse'], docks: ['docks'], sacred: ['sacredHouse'], church: ['church'], cathedral: ['temple'],
  market: ['market'], square: ['market', 'institution: square'], guild: ['guild'], fishSource: ['fish'], gameSource: ['game'],
  livestockSource: ['livestock'], route: ['route open'], navigable: ['navigable'], timber: ['timber at hand'],
  notSmallPop: ['population: ≥ middling'], small: ['tier: ≤ village'], elder: ['ruler: elder'], appointedPost: ['appointed post'],
  poor: ['prosperity: ≤ poor'], bakery: ['institution: bakery'], warehouse: ['institution: warehouse'], bridge: ['institution: bridge'],
  well: ['institution: waterSource'], water: ['institution: waterSource'], theater: ['institution: theatre'],
  common: ['institution: commonGrazing'], farming: ['institution: farmland'], dwellings: ['institution: dwellings'],
  landing: ['institution: fishingLanding'], rootCellar: ['institution: rootCellar'], shepherd: ['institution: shepherd'],
  craftGuild: ['institution: craftGuild'],
  // LINES-2
  council: ['ruling body'], gov: ['government named'], grain: ['grain'], stores: ['stores: > 0'], growsMore: ['food surplus'],
  fish: ['fish'], livestock: ['livestock'], game: ['game'], grainImport: ['grain imported', 'no grain'],
  prosperous: ['prosperity: ≥ comfortable'], notProsperous: ['prosperity: < comfortable'], notSmallTier: ['tier: ≥ village'],
  noGuard: ['no guardPresence'], watch: ['watch'], healer: ['sick house'], noHealer: ['no sick house'], magic: ['magic'],
});
/** Need names with NO granted home (ruling 12 (2): not granted; reported, not built). */
const NOT_GRANTED = Object.freeze({
  wellMark: 'a quarter landmark /well/ (spatialLayout): ruling 8 cut it (N26, N27, P12)',
  neighbour: 'record.neighborRelationship: no fact home',
  monster: 'a threatProfile row of type monster_pressure: no fact home (a branch kind in child_warnings)',
  tradeQuarter: 'a spatialLayout.quarters name test: no fact home',
  millSource: 'the food record\'s mill key: the layer walker (`tests/lint/factLayers.walker.test.js`, READERS) reads `foodSources.includes(\'mill\')` as a mill name test outside the mill\'s home, and its register is shrink-only: needs a home reader (the chair\'s)',
  grainHeld: 'grain or mill source or imported grain: one composite over two homes (foodSources, imports)',
  legitimacyGrave: 'causalState bands.public_legitimacy critical|collapsed: no fact home (the nearest atom, `legitimacy crisis`, reads powerStructure.publicLegitimacy)',
  elders: 'a government-label name test /elder/: no fact home', headman: 'a government-label name test /headman/: no fact home',
  mayor: 'a government-label name test /mayor/: no fact home', reeve: 'a government-label name test /reeve/: no fact home',
  steward: 'a government-label name test /steward/: no fact home',
  smuggling: 'a live-house or income-row name test /smuggl/: no fact home, and a crime fact (owner-only slot)',
  'power.merchant': 'the dominant power\'s archetype (factionProfile): no fact home',
  'power.religious': 'the dominant power\'s archetype (factionProfile): no fact home',
  'power.military': 'the dominant power\'s archetype (factionProfile): no fact home',
});

describe('(b) a line declaring an atom the vocabulary does not know is refused (never a silent admit)', () => {
  const facts = factsOf(planted(['Water source', 'Toll bridge']));
  it('the vocabulary\'s rule, pinned: no such atom parses, assertDeclarable throws, and filterDeclared refuses the line', () => {
    for (const word of ['wellMark', 'wellLandmark', 'institution: wellLandmark', 'institution: guild', 'small']) {
      expect(parseAtom(word), word).toBeNull();
      expect(() => assertDeclarable(word), word).toThrow(/not an atom/);
      const bad = Object.freeze({ text: 'planted', needs: Object.freeze([word]) });
      expect(filterDeclared([bad], { facts }), word).toEqual([]);
    }
  });
  it('the same line declaring the granted kind is admitted where the record holds it', () => {
    const good = Object.freeze({ text: 'planted', needs: Object.freeze(['institution: bridge', 'institution: waterSource']) });
    expect(filterDeclared([good], { facts })).toEqual([good]);
  });
  it('every need of LINES-1 and LINES-2 maps to declarable atoms, or stands in the not-granted list', () => {
    for (const [need, atoms] of Object.entries(NEED_ATOMS)) {
      expect(NOT_GRANTED[need], need).toBeUndefined();
      for (const a of atoms) expect(() => assertDeclarable(a.replace(/^no\s+/, '')), `${need} → ${a}`).not.toThrow();
    }
  });
  it('the granted atoms answer from their homes', () => {
    const f = (/** @type {Record<string, unknown>} */ rec) => factsOf(rec);
    expect(atomHolds('route open', f({ config: { tradeRouteAccess: 'road' } }))).toBe(true);
    for (const r of ['isolated', 'none', '']) expect(atomHolds('route open', f({ config: { tradeRouteAccess: r } })), r).toBe(false);
    expect(atomHolds('government named', f({ powerStructure: { government: 'Village elder' } }))).toBe(true);
    expect(atomHolds('government named', f({ powerStructure: {} }))).toBe(false);
    const food = (/** @type {string[]} */ foodSources) => f({ economicState: { foodSecurity: { foodRecord: { foodSources } } } });
    expect(atomHolds('grain', food(['grain', 'mill']))).toBe(true);
    expect(atomHolds('grain imported', f({ economicState: { primaryImports: ['Salt', 'Grain'] } }))).toBe(true);
    expect(atomHolds('grain imported', f({ economicState: { primaryImports: ['Salt'] } }))).toBe(false);
    expect(atomHolds('sick house', f({ institutions: [{ name: 'Healer' }] }))).toBe(true);
    expect(atomHolds('sick house', f({ institutions: [{ name: 'Hospital' }] }))).toBe(true);
    expect(atomHolds('sick house', f({ institutions: [{ name: 'Mill' }] }))).toBe(false);
  });
});

// ── (c) the hideable-and-crime walker ──
/** The crime dimensions (LINES-COMMON rule 6: criminal opportunity, corruption, smuggling, a crime structure). */
const CRIME_DIMENSIONS = Object.freeze(['organised crime', 'rival rings', 'criminal income', 'crime', 'crime wave']);

/** Every hideable row of the catalogue, at every tier (the shipped houses a record can hold). */
function hideableCatalogueRows() {
  /** @type {Array<Record<string, unknown>>} */ const out = [];
  for (const shelves of Object.values(institutionalCatalog)) for (const [shelf, rows] of Object.entries(shelves)) {
    for (const [name, entry] of Object.entries(rows)) { const row = { name, category: shelf, ...entry }; if (isHideableHouse(row)) out.push(row); }
  }
  return out;
}

/** Every `{ text, needs }` line a module exports, found through frozen arrays and objects. @param {unknown} v @param {string} path */
function linesOf(v, path, /** @type {Array<{ path: string, line: Record<string, unknown> }>} */ out = []) {
  if (Array.isArray(v)) v.forEach((x, i) => (x && typeof x === 'object' && !Array.isArray(x) && 'text' in x ? out.push({ path: `${path}[${i}]`, line: x }) : linesOf(x, `${path}[${i}]`, out)));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) linesOf(x, `${path}.${k}`, out);
  return out;
}

/**
 * THE WALKER: each line's atoms → the faults (an unknown atom, a crime atom, an atom a hideable row satisfies).
 * @param {Array<{ path: string, line: Record<string, unknown> }>} lines
 * @param {Array<Record<string, unknown>>} hideable
 */
function hideableCrimeFaults(lines, hideable) {
  /** @type {string[]} */ const faults = [];
  const tiers = ['thorp', 'village', 'town', 'metropolis'];
  for (const { path, line } of lines) {
    for (const written of atomsOf(declarationOf(line))) {
      const word = written.replace(/^no\s+/, '');
      const atom = parseAtom(word);
      if (!atom) { faults.push(`${path}: '${written}' is no atom of the vocabulary`); continue; }
      if (CRIME_DIMENSIONS.includes(atom.dimension)) { faults.push(`${path}: '${written}' is a crime atom`); continue; }
      if (atom.dimension === 'crisis') continue;
      for (const tier of tiers) {
        const without = atomHolds(word, factsOf({ tier, institutions: [] }));
        const by = hideable.find((row) => atomHolds(word, factsOf({ tier, institutions: [row] })) === true && without !== true);
        if (by) { faults.push(`${path}: '${written}' is satisfied by the hideable house '${String(by.name)}'`); break; }
      }
    }
  }
  return faults;
}

const POOL_DIR = fileURLToPath(new URL('../../src/data/dailyLife/', import.meta.url));
/** Every pool file under `src/data/dailyLife/` and its lines. */
async function dailyLifePoolLines() {
  const files = existsSync(POOL_DIR) ? readdirSync(POOL_DIR).filter((f) => f.endsWith('.js')).sort() : [];
  /** @type {Array<{ path: string, line: Record<string, unknown> }>} */ const out = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(`${POOL_DIR}${f}`).href);
    for (const [name, v] of Object.entries(mod)) linesOf(v, `${f}:${name}`, out);
  }
  return { files, lines: out };
}

describe('(c) the hideable-and-crime arm: no daily-life pool line needs a hideable house or a crime fact', () => {
  const hideable = hideableCatalogueRows();
  it('the catalogue holds hideable houses to test against (criminal and clandestine)', () => {
    expect(hideable.length).toBeGreaterThan(10);
    expect(hideable.map((r) => r.name)).toEqual(expect.arrayContaining(['Black market', "Thieves' guild chapter", 'Underground network']));
  });
  it('planted: an unknown atom, a crime atom and an atom a hideable house satisfies are each a fault; a clean line is not', () => {
    const lines = [
      { path: 'planted.unknown', line: { text: 'x', needs: ['wellLandmark'] } },
      { path: 'planted.crime', line: { text: 'x', needs: ['organised crime'] } },
      { path: 'planted.crimeBand', line: { text: 'x', needs: ['crime: ≥ diffuse'] } },
      { path: 'planted.income', line: { text: 'x', excludes: ['criminal income'] } },
      { path: 'planted.clean', line: { text: 'x', needs: ['institution: tavern', 'tier: ≤ village'] } },
    ];
    const faults = hideableCrimeFaults(lines, hideable);
    expect(faults.map((f) => f.split(':')[0])).toEqual(['planted.unknown', 'planted.crime', 'planted.crimeBand', 'planted.income']);
    // the hideable side alone: a planted hideable inn would make `institution: tavern` a fault
    const hiddenInn = { name: 'Smugglers\' inn', category: 'Criminal' };
    expect(isHideableHouse(hiddenInn)).toBe(true);
    expect(hideableCrimeFaults([lines[4]], [hiddenInn])).toEqual(["planted.clean: 'institution: tavern' is satisfied by the hideable house 'Smugglers' inn'"]);
  });
  it('no catalogue hideable house satisfies any of the 13 granted kinds', () => {
    const lines = Object.keys(KIND_ROWS).map((k) => ({ path: `kind.${k}`, line: { text: 'x', needs: [`institution: ${k}`] } }));
    expect(hideableCrimeFaults(lines, hideable)).toEqual([]);
  });
  it('every line of every pool under src/data/dailyLife/ is clean', async () => {
    const { lines } = await dailyLifePoolLines();
    expect(hideableCrimeFaults(lines, hideable)).toEqual([]);
  });
});
