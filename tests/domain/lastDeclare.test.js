/**
 * tests/domain/lastDeclare.test.js — LAST-DECLARE (BRIEF-LAST item 1, 2026-11-18): the lines the presumed-things register
 * carried as rows from the first close of 2026-11-18 (`docs/chair/2026-11-18/last/first-close-rows.json` on the chair's
 * lane) declare the thing each names, so the walker answers them WITHOUT a row, and the declaration is the door's own: it
 * admits the line where its thing stands and refuses it where it does not.
 *
 * RED AT THE BASE (b014a7bf3) for its own reason: every row below stands in the widened register and the walker lists each
 * literal as undeclared; the streets line, the roadside row and the court-and-prison twin carry no declaration at all.
 * Each positive has its negative beside it: the same source with the one declaration taken out is a hit again, and the
 * door refuses each line where its atom is false.
 *
 * Two rows of the twenty are not here: the `garrison` rows of the hiring office's and the lodging line's siege twins
 * (743cc96b12b6c45b, b50dee27dd04b260), STOPPED for the chair (the twins print where no garrison stands).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { drawnRanges, keyedDeclarations, literalHash, scanSource, WIDENED_REGISTER_REL } from '../lint/presumedThings.shared.mjs';
import { resolveSibling } from '../../src/domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { SAFETY_LINE_SIBLINGS } from '../../src/generators/safetyProfile.js';
import * as origin from '../../src/generators/narrative/settlementOriginProse.js';
import { GUARD_LAW_SIBLINGS, guardLineUnderTheLaw } from '../../src/domain/display/guardLineUnderTheLaw.js';
import { TITLE_LINE_DECLARATIONS } from '../../src/data/people/titleSecretsPresentations.js';
import { settleTitleLines } from '../../src/generators/people/poolMap.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** The rows this seat cured: [file, thing, the literal's hash, the declaration's own text in the file (the negative strips it)]. */
const CURED = [
  ['src/data/institutionDescVariants.js', 'armedForce', 'a2cdeb4bcbf27797', 'needs: Object.freeze(["mercenary"]), excludes'],
  ['src/data/institutionDescVariants.js', 'armedForce', '38ba15e3c2a308e4', 'needs: Object.freeze(["mercenary"]), crisis'],
  ['src/data/institutionDescVariants.js', 'armedForce', '743cc96b12b6c45b', 'needs: Object.freeze(["mercenary"]), crisis'],
  ['src/data/institutionDescVariants.js', 'armedForce', 'b50dee27dd04b260', 'needs: Object.freeze(["mercenary"]), crisis'],
  ['src/data/institutionDescVariants.js', 'armedForce', 'd163baaf3dfdbc97', 'needs: Object.freeze(["guardPresence"]), crisis'],
  ['src/data/institutionDescVariants.js', 'armedForce', 'c57566e5bfaaf1a1', 'needs: Object.freeze(["guardPresence"]), crisis'],
  ['src/data/institutionDescVariants.js', 'quarters', 'c6fded0acf9197fb', 'needs: Object.freeze(["population: ≥ middling"]), excludes'],
  ['src/data/institutionDescVariants.js', 'quarters', '522f88620a90790f', 'needs: Object.freeze(["church","population: ≥ middling"]), crisis'],
  ['src/data/institutionDescVariants.js', 'temple', '522f88620a90790f', 'needs: Object.freeze(["church","population: ≥ middling"]), crisis'],
  ['src/data/institutionDescVariants.js', 'quarters', '5c421f2f763ebdb8', 'needs: Object.freeze(["church","population: ≥ middling"]), crisis'],
  ['src/data/institutionDescVariants.js', 'temple', '5c421f2f763ebdb8', 'needs: Object.freeze(["church","population: ≥ middling"]), crisis'],
  ['src/data/institutionDescVariants.js', 'temple', 'fc8262cb8594256b', 'needs: Object.freeze(["church"]), crisis'],
  ['src/generators/safetyProfile.js', 'garrison', '26ba104371f73baf', "needs: Object.freeze(['garrison', 'church']) }"],
  ['src/generators/safetyProfile.js', 'clergy', '26ba104371f73baf', "needs: Object.freeze(['garrison', 'church']) }"],
  ['src/generators/safetyProfile.js', 'clergy', 'ad2781f9cea24c20', "needs: Object.freeze(['church']), excludes"],
  ['src/generators/safetyProfile.js', 'streets', 'd0cb088496831e60', "needs: Object.freeze(['tier: ≥ village']) }"],
  ['src/generators/narrative/settlementOriginProse.js', 'openTrade', '46a67ae06452f0b9', "excludes: Object.freeze(['crisis: under_siege']) }"],
  ['src/domain/display/guardLineUnderTheLaw.js', 'prison', '85fc61848472a7ad', ", needs: Object.freeze(['prison']) }"],
];

/** The door file a table of each source file is handed to, read with it (the walker reads the tree whole). */
const DOOR_FILE = { 'src/data/institutionDescVariants.js': 'src/generators/steps/assembleSettlement.js' };

/** Arm 1 over a file and its door file, as the walker's `scanTree` reads them; the hits as `thing hash`. */
function hitsOf(rel, src) {
  const files = [[rel, src], ...(DOOR_FILE[rel] ? [[DOOR_FILE[rel], read(DOOR_FILE[rel])]] : [])];
  const drawn = drawnRanges(files);
  const keyed = new Map();
  for (const [r, s] of files) for (const [k, v] of keyedDeclarations(r, s, drawn)) keyed.set(k, v);
  return scanSource(rel, src, keyed, drawn).map((h) => `${h.thing} ${literalHash(h.text)}`);
}

/** Take out one declaration (the snippet's carrier) from the line whose literal has this hash. */
function strip(src, hash, snippet) {
  const lines = src.split('\n');
  const at = lines.findIndex((l) => l.includes(snippet) && [...l.matchAll(/(["'])((?:(?!\1).)*)\1/g)].some((m) => literalHash(m[2]) === hash));
  expect(at, `the declaration of ${hash} stands in its file`).toBeGreaterThanOrEqual(0);
  const bare = snippet.replace(/needs: Object\.freeze\(\[[^\]]*\]\)(, )?/, '').replace(/,? ?excludes: Object\.freeze\(\['crisis: under_siege'\]\) \}/, ' }');
  lines[at] = lines[at].replace(snippet, bare);
  return lines.join('\n');
}

describe('LAST-DECLARE item 1: the first close\'s rows leave by declaration', () => {
  const widened = JSON.parse(read(WIDENED_REGISTER_REL));
  const sources = new Map([...new Set(CURED.map(([f]) => f))].map((f) => [f, read(f)]));
  const hits = new Map([...sources].map(([f, s]) => [f, new Set(hitsOf(f, s))]));

  test('each cured row: declared, answered, its row gone; without its declaration a hit again (every row read, the failures collected)', () => {
    const bad = [];
    for (const [file, thing, hash, snippet] of CURED) {
      const rows = (widened.arm1[file] || []).filter((r) => r[0] === thing && [].concat(r[3]).includes(hash));
      if (rows.length) bad.push(`${file} ${thing} ${hash}: its widened-register row stands`);
      if (hits.get(file).has(`${thing} ${hash}`)) bad.push(`${file} ${thing} ${hash}: the walker does not answer it`);
      // the negative: the same file with this one declaration taken out
      if (!new Set(hitsOf(file, strip(sources.get(file), hash, snippet))).has(`${thing} ${hash}`)) bad.push(`${file} ${thing} ${hash}: undeclared, it is no hit`);
    }
    expect(bad).toEqual([]);
    expect(CURED.length).toBe(18);
  });
});

/** A record's facts of the few atoms these lines declare. */
const facts = ({ siege = false, mercenary = true, guards = true, church = true, band = 'large' } = {}) => ({
  crisis: { active: siege, has: (k) => siege && k === 'under_siege' },
  defence: { mercenary }, guardPresence: guards, faith: { hasChurch: church }, populationBand: band,
});

describe('LAST-DECLARE item 1: each declaration is the door\'s, and refuses where its thing is absent', () => {
  const late = (key, f) => resolveSibling(key, DESC_LATE_SIBLINGS, { facts: f });
  const keyOf = (prefix) => Object.keys(DESC_LATE_SIBLINGS).find((k) => k.startsWith(prefix));
  const twinOf = (key) => DESC_LATE_SIBLINGS[key].find((l) => l.twinOf === key).text;

  test('each siege set: the twin where its thing stands; refused (the original kept, noted) where it does not', () => {
    const SETS = [
      ['A billet and contracting office', { mercenary: false }],
      ['A billet and hiring office', { mercenary: false }],
      ['Where a band of soldiers lodges', { mercenary: false }],
      ['Arrows by the sheaf, specialty broadheads, and commissioned', { guards: false }],
      ['Guild bowyers and fletchers: standard arrows', { guards: false }],
      ['Metropolitan cathedral.', { church: false }],
      ['The metropolitan cathedral, seat', { church: false }],
      ['The great church of the metropolis.', { church: false }],
    ];
    const bad = [];
    for (const [prefix, absent] of SETS) {
      const key = keyOf(prefix);
      if (!key) { bad.push(`${prefix}: no set`); continue; }
      if (late(key, facts({ siege: true })) !== twinOf(key)) bad.push(`${prefix}: no twin under the siege where its thing stands`);
      if (late(key, facts({ siege: true, ...absent })) !== key) bad.push(`${prefix}: the twin printed where its thing is absent`);
      if (late(key, facts()) !== key) bad.push(`${prefix}: the original refused in calm`);
    }
    expect(bad).toEqual([]);
  });

  test('the cathedral\'s original names a metropolitan size: refused in a small place', () => {
    const key = keyOf('Metropolitan cathedral.');
    const row = DESC_LATE_SIBLINGS[key].find((l) => !l.twinOf);
    expect(declarationAdmits(declarationOf(row), facts()).admitted).toBe(true);
    expect(declarationAdmits(declarationOf(row), facts({ band: 'small' })).admitted).toBe(false);
  });

  test('the chaplain\'s lines need a church: the twin where no garrison stands; neither line where no church does', () => {
    const key = Object.keys(SAFETY_LINE_SIBLINGS).find((k) => k.startsWith('The garrison chaplain'));
    const twin = SAFETY_LINE_SIBLINGS[key].find((l) => l.twinOf === key);
    const f = (garrison, hasChurch) => ({ defence: { garrison }, faith: { hasChurch } });
    expect(resolveSibling(key, SAFETY_LINE_SIBLINGS, { facts: f(true, true) })).toBe(key);
    expect(resolveSibling(key, SAFETY_LINE_SIBLINGS, { facts: f(false, true) })).toBe(twin.text);
    expect(declarationAdmits(declarationOf(twin), f(false, false)).admitted).toBe(false);
    expect(declarationAdmits(declarationOf(SAFETY_LINE_SIBLINGS[key][0]), f(true, false)).admitted).toBe(false);
  });

  test('the streets line resolves on the tier exactly as the tier test chose: streets from a village up, the place below', () => {
    const shown = (tier) => resolveSibling('The streets are unusually quiet.', SAFETY_LINE_SIBLINGS, { facts: () => factsOf({ institutions: [], tier }) });
    for (const tier of ['thorp', 'hamlet']) expect(shown(tier)).toBe('The place is unusually quiet.');
    for (const tier of ['village', 'town', 'city', 'metropolis']) expect(shown(tier)).toBe('The streets are unusually quiet.');
  });

  test('the roadside row is declared on the siege its noSiege test reads, and never picked under one', () => {
    const roadside = origin.ORIGIN_POOLS.road[2];
    const row = origin.ORIGIN_DECLARED?.[roadside]?.[0];
    expect(row?.text).toBe(roadside);
    expect(declarationAdmits(declarationOf(row), facts()).admitted).toBe(true);
    expect(declarationAdmits(declarationOf(row), facts({ siege: true })).admitted).toBe(false);
    const picked = Array.from({ length: 200 }, (_, i) => `last-declare-${i}`).filter((k) => origin.selectOriginBody({ route: 'road', seed: k, siege: true }) === roadside);
    expect(picked).toEqual([]);
  });

  test('the court-and-prison twin needs the prison: printed under a collapsed law where it stands, the line kept where it does not', () => {
    const key = ' A functioning court and prison mean crimes carry real consequences.';
    const twin = GUARD_LAW_SIBLINGS[key].find((l) => l.twinOf === key);
    expect(twin.text).toBe(' A court and a prison stand, but few offenders are ever brought to either.');
    const f = (prison) => ({ lawBand: 'collapsed', defence: { prison } });
    expect(resolveSibling(key, GUARD_LAW_SIBLINGS, { facts: f(true) })).toBe(twin.text);
    expect(resolveSibling(key, GUARD_LAW_SIBLINGS, { facts: f(false) })).toBe(key);
    expect(guardLineUnderTheLaw(`The watch keeps order.${key}`, null)).toBe(`The watch keeps order.${key}`);
  });
});

/**
 * LAST-DECLARE item 2 (the chair's ruling LR3): the sawyer's green-planks secret presumes building at work. Red at the base
 * (no declaration: the secret stands where nothing is built, as in bar0-village-calm-rand-36 beside "nothing new goes up").
 */
describe('LAST-DECLARE item 2: the sawyer\'s secret needs building at work', () => {
  const GREEN = 'Sells green planks as seasoned and the buildings made from them warp within a year';
  const town = (building) => ({ facts: { tradeAtWork: (k) => (k === 'building' ? building : undefined) }, boundaries: {}, held: null });
  const card = () => ({ secret: { what: GREEN, stakes: 'The builders who used the wood would want their losses back, and their customers would want them first' } });

  test('declared on `trade at work: building`', () => {
    expect(TITLE_LINE_DECLARATIONS.secret[GREEN]?.needs).toEqual(['trade at work: building']);
  });

  test('kept where something is built; the next admitted secret where nothing is (no new text)', () => {
    expect(settleTitleLines(card(), 'the sawyer', town(true)).secret.what).toBe(GREEN);
    const moved = settleTitleLines(card(), 'the sawyer', town(false)).secret.what;
    expect(moved).not.toBe(GREEN);
    expect(moved).toBe("A sawyer's boy lost an arm at the blade, and the family was paid to say it happened somewhere else");
  });
});

/**
 * LAST-DECLARE item 3 (the chair's ruling LR5; FAULTS-WATCH's 4b): `trade at work` reads the chain status the card SHOWS. Under
 * a siege a Dyer whose chains the record stores "running" on its own ground prints "impaired" on its chain cards (the crisis
 * state); the atom said at work. Red at the base (the stored status: true) and under the mutation that restores it.
 */
describe('LAST-DECLARE item 3: the house at work reads the state its chain card prints', () => {
  const chains = [
    { chainId: 'textiles', status: 'running', processingInstitutions: ['Dyer'], resourceKey: 'grazing_land', resourceInputKey: 'grazing_land', entrepot: false, needKey: 'manufacturing' },
    { chainId: 'textile_finishing', status: 'running', processingInstitutions: ['Dyer'], resourceKey: 'grazing_land', resourceInputKey: 'grazing_land', needKey: 'manufacturing' },
  ];
  // the Dyer works its own grazing land (`chainCarrier.js`: own ground), which a siege stops
  const record = (siege) => ({ institutions: [{ name: 'Dyer' }], config: { nearbyResources: ['grazing_land'] }, stresses: siege ? [{ type: 'under_siege' }] : [], economicState: { activeChains: chains } });

  test('under a siege: every chain card of the Dyer shows impaired, and the atom says the dyeing is not at work', async () => {
    const { tradeAtWorkOf } = await import('../../src/domain/facts/tradeAtWork.js');
    const { chainStateShown } = await import('../../src/domain/display/chainStateShown.js');
    expect(chains.map((c) => chainStateShown(c, record(true)))).toEqual(['impaired', 'impaired']);
    expect(tradeAtWorkOf(record(true), 'dyed cloth')).toBe(false);
  });

  test('in calm the same Dyer runs, its cards show it, and the atom says at work', async () => {
    const { tradeAtWorkOf } = await import('../../src/domain/facts/tradeAtWork.js');
    const { chainStateShown } = await import('../../src/domain/display/chainStateShown.js');
    expect(chains.map((c) => chainStateShown(c, record(false)))).toEqual(['running', 'running']);
    expect(tradeAtWorkOf(record(false), 'dyed cloth')).toBe(true);
  });
});
