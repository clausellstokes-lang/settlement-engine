/**
 * arrivalPoolsDeepened.test.js — L2 (PAGE-2, 2026-11-20; the brief `docs/chair/2026-11-20/content/page/briefs/L2.md`):
 * THE ARRIVAL PARAGRAPH'S THIN POOLS DEEPENED.
 *
 * PAGE-1's measure A (300 towns, `hxd-<size>-<i>`, DEFAULT_CONFIG): three forges in a row shared one of the arrival
 * paragraph's sentences 22.9% of the time, its pools 3 to 7 lines deep. The cure APPENDS lines to the pools most towns
 * draw (an existing line keeps its index, so the one `pickRandom` per beat stays one; only the line it lands on moves),
 * every new line in `docs/chair/2026-11-20/content/page/L2-LINES.md`.
 *
 * THIS FILE REDS WHEN:
 *   • a deepened pool holds fewer lines than its base count plus the lines L2 appended (an appended line removed);
 *   • over the 300, the chance that at least two of three distinct towns share an arrival sentence word for word is
 *     not below TARGET (L2's stated target: under 18%, from 22.9%);
 *   • an appended line is printed where its own declaration is refused by the town's record, or no appended line is
 *     printed at all (the admission check would be vacuous).
 * Every anchor is COMPUTED from the pool's own export (the line past the base count, through `textOf`), never quoted.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { ARRIVAL_CRISIS_SCOPED, ARRIVAL_PEOPLE, ARRIVAL_SENSES, ARRIVAL_TENSIONS } from '../../src/data/arrivalProse.js';
import { ARRIVAL_SCENES, ARRIVAL_SCENES_CRISIS_SCOPED } from '../../src/data/narrativeData.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { speakTierNoun } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';

/** L2's stated target for the three-town share of a verbatim arrival sentence over the 300 (measure A read 22.9%). */
const TARGET = 0.18;
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PER_SIZE = 50;

const sense = (/** @type {string} */ key) => /** @type {any} */ (ARRIVAL_SENSES.find((s) => s.key === key));

/**
 * The deepened pools: the entry count at the base (886a9c704, twins included) and the lines L2 appended.
 * @type {ReadonlyArray<{ id: string, pool: () => ReadonlyArray<any>, base: number, added: number, hook?: boolean, scoped: boolean }>}
 */
const DEEPENED = [
  { id: 'ARRIVAL_SCENES.ordinary', pool: () => ARRIVAL_SCENES.ordinary, base: 7, added: 6, hook: true, scoped: ARRIVAL_SCENES_CRISIS_SCOPED.includes('ordinary') },
  { id: 'ARRIVAL_SCENES.river', pool: () => ARRIVAL_SCENES.river, base: 4, added: 4, hook: true, scoped: ARRIVAL_SCENES_CRISIS_SCOPED.includes('river') },
  { id: 'ARRIVAL_SCENES.port', pool: () => ARRIVAL_SCENES.port, base: 6, added: 3, hook: true, scoped: ARRIVAL_SCENES_CRISIS_SCOPED.includes('port') },
  { id: 'ARRIVAL_SCENES.market', pool: () => ARRIVAL_SCENES.market, base: 4, added: 3, hook: true, scoped: ARRIVAL_SCENES_CRISIS_SCOPED.includes('market') },
  { id: 'ARRIVAL_SCENES.smoke', pool: () => ARRIVAL_SCENES.smoke, base: 4, added: 3, hook: true, scoped: ARRIVAL_SCENES_CRISIS_SCOPED.includes('smoke') },
  { id: 'ARRIVAL_TENSIONS.prosperous', pool: () => ARRIVAL_TENSIONS.prosperous, base: 4, added: 5, scoped: ARRIVAL_CRISIS_SCOPED.ARRIVAL_TENSIONS.includes('prosperous') },
  { id: 'ARRIVAL_TENSIONS.poor', pool: () => ARRIVAL_TENSIONS.poor, base: 4, added: 4, scoped: ARRIVAL_CRISIS_SCOPED.ARRIVAL_TENSIONS.includes('poor') },
  { id: 'ARRIVAL_SENSES.fish.dominant', pool: () => sense('fish').dominant, base: 6, added: 3, scoped: ARRIVAL_CRISIS_SCOPED.ARRIVAL_SENSES.includes('fish.dominant') },
  { id: 'ARRIVAL_SENSES.livestock.lines', pool: () => sense('livestock').lines, base: 5, added: 3, scoped: ARRIVAL_CRISIS_SCOPED.ARRIVAL_SENSES.includes('livestock.lines') },
  { id: 'ARRIVAL_SENSES.smiths.dominant', pool: () => sense('smiths').dominant, base: 8, added: 3, scoped: ARRIVAL_CRISIS_SCOPED.ARRIVAL_SENSES.includes('smiths.dominant') },
  { id: 'ARRIVAL_SENSES.arcane.dominant', pool: () => sense('arcane').dominant, base: 7, added: 3, scoped: ARRIVAL_CRISIS_SCOPED.ARRIVAL_SENSES.includes('arcane.dominant') },
  ...[['germanic', 4], ['latin', 4], ['celtic', 4], ['arabic', 5], ['norse', 5], ['slavic', 5], ['east_asian', 5], ['mesoamerican', 5], ['south_asian', 5], ['steppe', 5], ['greek', 5], ['mixed', 4]]
    .map(([k, base]) => ({ id: `ARRIVAL_PEOPLE.${k}`, pool: () => ARRIVAL_PEOPLE[k], base: Number(base), added: 3, scoped: ARRIVAL_CRISIS_SCOPED.ARRIVAL_PEOPLE.includes(String(k)) })),
];

/** The measure's own sentence cut (PAGE-1's measureA.mjs). @param {unknown} p */
const sentencesOf = (p) => String(p || '').split(/(?<=[.?!])\s+(?=[A-Z"'‘“])/).map((s) => s.trim()).filter(Boolean);

/** P(at least two of three distinct towns share a sentence), exact over every triple. @param {string[][]} keys */
function tripleShare(keys) {
  const n = keys.length; const sets = keys.map((k) => new Set(k));
  const share = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    let s = 0; for (const k of sets[i]) if (sets[j].has(k)) { s = 1; break; }
    share[i][j] = share[j][i] = s;
  }
  let hit = 0; let tot = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
    tot++; if (share[i][j] || share[i][k] || share[j][k]) hit++;
  }
  return hit / tot;
}

/** The printed text of a pool line for this town (a hook speaks the town's tier noun, as the composer does). */
function printed(/** @type {any} */ line, /** @type {any} */ town, /** @type {boolean} */ hook) {
  const t = textOf(line);
  const raw = typeof t === 'function' ? t(town.name, town.tier) : t;
  return hook ? speakTierNoun(String(raw), tierNounFor(town.tier)) : String(raw);
}

describe('L2: the deepened pools hold their appended lines', () => {
  test('every deepened pool keeps its base entries, with the appended lines after them', () => {
    const short = DEEPENED.filter((d) => d.pool().length < d.base + d.added).map((d) => `${d.id}: ${d.pool().length} < ${d.base} + ${d.added}`);
    expect(short).toEqual([]);
  });
});

describe('L2: over the 300 (the measure\'s towns)', () => {
  /** @type {any[]} */ let towns = [];
  beforeAll(async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    await loadGenerationLawPayloads();
    towns = [];
    for (const size of SIZES) for (let i = 0; i < PER_SIZE; i++) {
      towns.push(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }));
    }
  }, 600_000);

  test(`three towns share an arrival sentence word for word less than ${TARGET * 100}% of the time`, () => {
    expect(towns.length).toBe(SIZES.length * PER_SIZE);
    const share = tripleShare(towns.map((t) => sentencesOf(t.arrivalScene)));
    expect(share).toBeLessThan(TARGET);
  });

  test('an appended line is printed only where its own declaration is admitted, and some are printed', () => {
    /** @type {string[]} */ const refused = [];
    let printedCount = 0;
    for (const town of towns) {
      const para = String(town.arrivalScene || '');
      for (const d of DEEPENED) {
        d.pool().slice(d.base).forEach((line, i) => {
          if (line && typeof line === 'object' && typeof line.twinOf === 'string') return; // a twin is reached only by resolution, never drawn
          if (!para.includes(printed(line, town, Boolean(d.hook)))) return;
          printedCount++;
          const verdict = declarationAdmits(declarationOf(line), /** @type {any} */ (factsOf(town)), { crisisScoped: d.scoped });
          if (!verdict.admitted) refused.push(`${town.name} (${town.tier}) ${d.id}[${d.base + i}] refused: ${verdict.refused.join(', ')}`);
        });
      }
    }
    expect(refused).toEqual([]);
    expect(printedCount).toBeGreaterThan(0);
  });
});
