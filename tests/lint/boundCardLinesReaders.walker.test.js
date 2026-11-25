/**
 * boundCardLinesReaders.walker.test.js — E8b (WORDS-1; the tenth chair's G29 (1) and G30 of 2026-11-25): ONE DOOR FOR A READER
 * OF THE BOUND CARD LINES. Once the cards are final, a bound card line is stored in its card's own form ("speaks of herself
 * …"; `personMention.js :: boundReflexives`). A reader that matches a stored card line against the text of the tables that hold
 * the twelve rows would then miss it, silently: nothing crashes, the match just stops finding the row. So every source file that
 * imports one of those tables either reads through the one shared helper (`personMention.js :: heldCardLine`, the held form,
 * byte-equal to the line as drawn) or is declared here as running BEFORE the resolve pass (generation, where the line is still
 * as drawn), each with its reason. The successor of advance time (`worldPulse/successorNpc.js`, G30) copies the held form.
 * A PLANTED CONTROL proves the detector names a reader that skips the helper.
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** the tables that hold the twelve bound rows, by module and export */
/** @type {Readonly<Record<string, ReadonlyArray<string>>>} */
const ROW_TABLES = Object.freeze({
  'src/data/npcData.js': ['MANNERISMS', 'NPC_PLOT_HOOKS', 'NPC_PRESENTATION_MODES'],
  'src/data/stressInstitutionEffects.js': ['STRESS_INSTITUTION_EFFECTS'],
  'src/data/rareSecrets.js': ['RARE_DEEDS', 'RARE_NATURES', 'RARE_TIES', 'RARE_SECRET_ROWS'],
  'src/data/people/titleSecretsPresentations.js': ['TITLE_SECRETS', 'TITLE_PRESENTATIONS', 'TITLE_LINE_TWINS', 'TITLE_LINE_DECLARATIONS'],
  'src/data/people/goalSecretRefusals.js': ['GOAL_SECRET_REFUSAL_ROWS'],
  'src/generators/npcGenerator.js': ['SIEGE_GOALS'],
});
/** readers that run BEFORE the resolve pass (`narrativeGenerator.js :: generateCoherence`, goaledNpcs): they see the line as drawn */
/** @type {Readonly<Record<string, string>>} */
const BEFORE_THE_PASS = Object.freeze({
  'src/generators/npcGenerator.js': 'draws the rows themselves (tells, impressions, crisis and title secrets, the siege goals) on each card, and its held-key and dedupe reads run in the same draw',
  'src/generators/npc/factionLeaderSecret.js': 'compares a leader\'s presentation with the secret-bound presentation modes while the cast is drawn',
  'src/generators/people/poolMap.js': 'settles the title lines (representatives.js :: settleTitleLines) while the cast is drawn',
});
/** readers that also run on a FINAL record (a regen's keepers, the tonight sheet, the findings): through the helper */
const HELD = Object.freeze(['src/domain/coherence/crisisFactFindings.js', 'src/domain/summary/tonightSheet.js', 'src/generators/people/goals.js', 'src/generators/people/rareSecrets.js']);

/** @param {string} d @returns {string[]} */
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(?:js|jsx|mjs)$/.test(f) ? [p] : []; });
/**
 * The row tables a file imports (named or as a namespace). @param {string} rel the file, from the root @param {string} text
 * @returns {string[]}
 */
function rowTablesOf(rel, text) {
  /** @type {string[]} */ const hits = [];
  for (const m of text.matchAll(/import\s+(?:\{([^}]*)\}|\*\s+as\s+(\w+))\s*from\s*'([^']+)'/g)) {
    if (!m[3].startsWith('.')) continue;
    const target = relative(ROOT, resolve(dirname(join(ROOT, rel)), m[3])).split('\\').join('/');
    const names = ROW_TABLES[target]; if (!names) continue;
    if (m[2]) hits.push(`* as ${m[2]}`);
    else for (const n of m[1].split(',').map((x) => x.trim().split(/\s+as\s+/)[0])) if (names.includes(n)) hits.push(n);
  }
  return hits;
}
const usesHelper = (/** @type {string} */ text) => /\bheldCardLine\(/.test(text);
const readers = walk(join(ROOT, 'src')).map((f) => ({ rel: relative(ROOT, f).split('\\').join('/'), text: readFileSync(f, 'utf8') }))
  .map((x) => ({ ...x, tables: rowTablesOf(x.rel, x.text) })).filter((x) => x.tables.length);

describe('E8b · one door for a reader of the bound card lines', () => {
  test('every reader of the twelve rows\' tables reads through heldCardLine or is declared before the pass', () => {
    const undeclared = readers.filter((x) => !BEFORE_THE_PASS[x.rel] && !(HELD.includes(x.rel) && usesHelper(x.text))).map((x) => `${x.rel} (${x.tables.join(', ')})`);
    expect(undeclared).toEqual([]);
  });
  test('no declared row is stale: each is still a reader, and each held reader still calls the helper', () => {
    const rels = new Set(readers.map((x) => x.rel));
    expect(Object.keys(BEFORE_THE_PASS).filter((r) => !rels.has(r))).toEqual([]);
    expect(HELD.filter((r) => !rels.has(r) || !usesHelper(readers.find((x) => x.rel === r)?.text || ''))).toEqual([]);
  });
  test('the successor of advance time copies the held form (G30)', () => {
    expect(usesHelper(readFileSync(join(ROOT, 'src/domain/worldPulse/successorNpc.js'), 'utf8'))).toBe(true);
  });
  test('PLANTED CONTROL: a reader of a row table without the helper is found', () => {
    const planted = "import { STRESS_INSTITUTION_EFFECTS } from '../../data/stressInstitutionEffects.js';\nexport const f = (t) => STRESS_INSTITUTION_EFFECTS.x.some((r) => r.secret === t);\n";
    expect(rowTablesOf('src/domain/summary/planted.js', planted)).toEqual(['STRESS_INSTITUTION_EFFECTS']);
    expect(usesHelper(planted)).toBe(false);
    expect(rowTablesOf('src/domain/summary/planted.js', "import * as D from '../../data/rareSecrets.js';")).toEqual(['* as D']);
  });
});
