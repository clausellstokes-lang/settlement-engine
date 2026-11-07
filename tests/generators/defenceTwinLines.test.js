/**
 * F10 unit 4 (rung 1C, 2026-11-04): the generation-time writers print walls, a garrison or
 * soldiers only where the place's own defence record holds them.
 *
 * Red-first on three of the 1,000-soak's remaining 35 defence-words seeds, one per group:
 *   soak1k-452  the military loyalty hook "Someone is paying their soldiers more than their
 *               salary." in a place with no garrison or hired company (the hook-truth gate);
 *   soak1k-15   the town council's "Public works: Walls, wells, roads, and the watch" with no
 *               enclosure (`data/defenceTwinLines.js`);
 *   soak1k-213  the wartime Guard Captain's "Keep unit cohesion as conscription pulls away
 *               experienced soldiers…" with no garrison or hired company (the same table).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { defenseWordsFindings } from '../../src/domain/coherence/defenseWordsFindings.js';
import { resolveSibling, resolveSiblingSentences } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { SERVICE_DESC_SIBLINGS } from '../../src/data/institutionServices.js';
import { DESC_VARIANT_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { POLITICAL_FLAVOR_SIBLINGS } from '../../src/generators/narrativeText.js';
import { CAST_REASON_SIBLINGS } from '../../src/domain/crisis/crisisCast.js';
import { NPC_GOAL_SIBLINGS } from '../../src/generators/npcGenerator.js';
import { BASELINE_CONFLICT_SIBLINGS } from '../../src/generators/power/governanceNarrative.js';

// CENSUS-1c unit 1: the text-keyed table `data/defenceTwinLines.js` dissolved into the declared
// sibling sets beside each original (re-keyed by that cause; every twin to the byte).
/** @type {Record<string, ReadonlyArray<any>>} */
// CENSUS-5b unit 2 (re-keyed by that cause): the baseline-conflict table also declares lines that
// presume a militia, a mill or a market, so the defence pins read only the sets whose original
// declares a defence atom (walls, garrison, soldiers) — the twins F10 unit 4 retired.
// CENSUS-5e unit 2 (re-keyed by that cause, R-AN): MILITARY_MODIFIER_SIBLINGS dissolved (garrison is not
// settled at the power step; the modifier prints 'arms-backed'), so the table keys 10 lines, not 11.
const DEFENCE_ATOMS = new Set(['walls', 'garrison', 'soldiers']);
const defenceSetsOf = (/** @type {Record<string, ReadonlyArray<any>>} */ table) => Object.fromEntries(
  Object.entries(table).filter(([, set]) => (set[0].needs || []).some((/** @type {string} */ a) => DEFENCE_ATOMS.has(a))));
const DEFENCE_SIBLINGS = { ...SERVICE_DESC_SIBLINGS, ...DESC_VARIANT_SIBLINGS, ...POLITICAL_FLAVOR_SIBLINGS, ...CAST_REASON_SIBLINGS, ...NPC_GOAL_SIBLINGS, ...defenceSetsOf(BASELINE_CONFLICT_SIBLINGS) };
const twinOf = (/** @type {string} */ line) => DEFENCE_SIBLINGS[line].find((l) => l.twinOf === line).text;
const OPTS = (/** @type {any} */ facts) => ({ facts, poolId: 'test', drawKind: /** @type {'T'} */ ('T') });

/** Every string the record stores, depth-first. @param {unknown} v @param {string[]} [out] */
function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

/** @type {Record<number, { settlement: any, text: string[] }>} */
const BIRTHS = {};

beforeAll(async () => {
  await ensureLaws();
  for (const i of [452, 15, 213]) {
    const { settlement } = birth(i);
    BIRTHS[i] = { settlement, text: strings(settlement) };
  }
}, 120_000);

describe('F10 unit 4 · the three soak seeds', () => {
  it('soak1k-452 stores no soldiers hook where no garrison or hired company stands', () => {
    const { settlement, text } = BIRTHS[452];
    const f = defenseFactsOf(settlement);
    expect(f.hasGarrison || f.hasMercenary).toBe(false);
    expect(text.filter((s) => /paying their soldiers/.test(s))).toEqual([]);
  });

  it('soak1k-15 keeps its public works without the walls it lacks', () => {
    const { settlement, text } = BIRTHS[15];
    expect(defenseFactsOf(settlement).hasWalls).toBe(false);
    expect(text).not.toContain('Walls, wells, roads, and the watch'); // anchored: the next line pins the wall-free twin in this same text
    expect(text).toContain('Wells, roads and the common ground');
  });

  it('soak1k-213 gives its wartime Guard Captain a goal with no soldiers in it', () => {
    const { settlement, text } = BIRTHS[213];
    const f = defenseFactsOf(settlement);
    expect(f.hasGarrison || f.hasMercenary).toBe(false);
    expect(text.filter((s) => /conscription pulls away experienced soldiers/.test(s))).toEqual([]);
    expect(text.some((s) => /the call-up pulls away experienced hands/.test(s))).toBe(true);
  });
});

describe('F11 unit 2 · the reserve line', () => {
  it('soak1k-6879 keeps its reserve without the walls it lacks', () => {
    const s = birth(6879).settlement;
    expect(defenseFactsOf(s).hasWalls).toBe(false);
    const line = s.history.historicalCharacter;
    expect(line).toContain('granaries a little too large, stores a little too deep. The ');
    expect(defenseWordsFindings(s, line)).toEqual([]);
  });
  it('a walled place keeps the line to the byte, sentence by sentence', () => {
    const line = 'The settlement keeps more in reserve than its size explains: granaries a little too large, walls a little too strong. The Flood is the reason.';
    expect(resolveSiblingSentences(line, POLITICAL_FLAVOR_SIBLINGS, OPTS(factsOf({ institutions: [{ name: 'Massive Walls', category: 'Defense' }] })))).toBe(line);
    expect(resolveSiblingSentences(line, POLITICAL_FLAVOR_SIBLINGS, OPTS(factsOf({ institutions: [] })))).toBe('The settlement keeps more in reserve than its size explains: granaries a little too large, stores a little too deep. The Flood is the reason.');
  });
});

describe('F10 unit 4 · the declared sibling sets (CENSUS-1c unit 1)', () => {
  const BARE = { institutions: [] };
  const STRONG = {
    institutions: [{ name: 'Massive Walls', category: 'Defense' }, { name: 'Garrison', category: 'Defense' }],
  };

  it('every line the table keys is a defence-words finding on a bare place, and its twin is not', () => {
    const wrong = [];
    for (const line of Object.keys(DEFENCE_SIBLINGS)) {
      const twin = twinOf(line);
      if (defenseWordsFindings(BARE, line).length === 0) wrong.push(`not a finding: ${line}`);
      if (defenseWordsFindings(BARE, twin).length !== 0) wrong.push(`twin is a finding: ${twin}`);
    }
    expect(wrong).toEqual([]);
    expect(Object.keys(DEFENCE_SIBLINGS).length).toBe(10);
  });

  it('a place that holds the thing keeps the line to the byte; one that lacks it takes the twin', () => {
    const strong = OPTS(factsOf(STRONG));
    const bare = OPTS(factsOf(BARE));
    for (const line of Object.keys(DEFENCE_SIBLINGS)) {
      expect(resolveSibling(line, DEFENCE_SIBLINGS, strong)).toBe(line);
      expect(resolveSibling(line, DEFENCE_SIBLINGS, bare)).toBe(twinOf(line));
    }
    expect(resolveSibling('A line the table does not key.', DEFENCE_SIBLINGS, bare)).toBe('A line the table does not key.');
    expect(resolveSibling(null, DEFENCE_SIBLINGS, bare)).toBe(null);
    expect(resolveSibling(Object.keys(DEFENCE_SIBLINGS)[0], DEFENCE_SIBLINGS, OPTS(null))).toBe(Object.keys(DEFENCE_SIBLINGS)[0]);
  });
});
