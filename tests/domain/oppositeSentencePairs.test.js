/**
 * DISAGREE (PROSE-6; the owner's order of 2026-11-22, "Can you fix these:"): NO PAGE PRINTS BOTH SIDES OF A PAIR THAT READS AS
 * OPPOSITE. The pairs are the one frozen table `tests/helpers/oppositeSentencePairs.mjs :: OPPOSITE_PAIRS`, keyed by pool and
 * variant id; each side is matched on the page (`buildPrintProse(s, {})`) by its leaf texts as templates, the page's
 * clause-cut forms included (GEN-17 GARRISONED v2 prints cut: `map/DISAGREE-PHASE1.md`).
 *   ARM 1: the chair's measure's five seeds (FOOD dz-town-12, dz-city-54, dz-metropolis-2; WAGES dz-town-2, dz-town-36) and
 *          the first N births of every size: no page prints both sides of any row.
 *   ARM 2 (anti-vacuity): each side's matcher matches its own leaf texts, slot-filled; and on real pages (ARM 1's births
 *          and a named control seed) each side of each row is found.
 *   ARM 3: each pinned tail (`PINNED_TAILS`: GEN-17 GARRISONED v2's "and the money is found every season", which the page
 *          cuts) prints on 0 pages of ARM 1's births; its matcher matches its own leaf text, and its variant's head prints.
 *   ARM 4 (no cell left empty): on ARM 1's births and dz-city-101, wherever the key of DS-DEF-2 `CHAIN: food trades failing`,
 *          DS-DEF-2 `Economic Survival: WEAK` or DS-GEN-17 `GARRISONED` holds (the desks' own key functions), the eligible set
 *          (`stateProseKernel.js :: eligibleVariants`, the desks' own entry answers) is not empty, but for the ONE NAMED
 *          exception, keyed by seed and cause: dz-city-101, GEN-17 GARRISONED, crisis `occupied` (`no crisis: occupied`
 *          refuses v1 and v2; empty at 244fa84ef by the same marks). The arm reds too if that exception stops being empty.
 * The arm "GEN-17 v2 never prints where the guard's pay reads 'short'" is NOT built: phase 1 (i) counted 8 such pages.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { economicRowPoolKey, foodTradesPoolKey } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { institutionsPoolKey } from '../../src/domain/display/stateProse/generalStateProse.js';
import { factsAnswered } from '../../src/domain/facts/factsAnswered.js';
import { wallsAnswered } from '../../src/domain/defense/defenseFacts.js';
import { crisisAnswered } from '../../src/domain/crisis/crisisFacts.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import {
  OPPOSITE_PAIRS, PINNED_TAILS, matchersOf, oppositePairsOnPage, pageTextsOf, sidePrinted, tailMatchersOf, textsOf,
} from '../helpers/oppositeSentencePairs.mjs';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 6; // births a size: the file's own budget below
const MEASURE_SEEDS = ['dz-town-12', 'dz-city-54', 'dz-metropolis-2', 'dz-town-2', 'dz-town-36'];
// ARM 2b's control after the cure: a page that prints FOOD side A where it is true (food below secure; on the 900 at the
// cure, FOOD side A printed on dz-metropolis-6, 38, 58, 77, 125: map/disagree-phase2.mjs). The other three sides print on
// the first births of a size (thorps for FOOD b and WAGES a; dz-town-2 for WAGES b).
const CONTROL_SEEDS = ['dz-metropolis-6'];
const SEEDS = [...new Set([...MEASURE_SEEDS, ...CONTROL_SEEDS, ...SIZES.flatMap((size) => Array.from({ length: N }, (_, i) => `dz-${size}-${i}`))])];

/** @type {Map<string, { s: any, texts: string[] }>} */
const BIRTHS = new Map();
let lawsLoaded = false;
/** @param {string} seed @returns {Promise<{ s: any, texts: string[] }>} the record and its page's mount texts */
async function birthOf(seed) {
  if (!lawsLoaded) { await loadGenerationLawPayloads(); lawsLoaded = true; }
  const held = BIRTHS.get(seed);
  if (held) return held;
  const settType = seed.split('-')[1];
  const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
  const born = { s, texts: pageTextsOf(buildPrintProse(s, {})) };
  BIRTHS.set(seed, born);
  return born;
}
/** @param {string} seed */
const pageOf = async (seed) => (await birthOf(seed)).texts;

/** The three cells whose key must never hold over an empty eligible set: [name, block, pool, the desk's own key]. */
const CELLS = Object.freeze([
  ['DS-DEF-2 CHAIN: food trades failing', DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-2'], 'CHAIN: food trades failing', (/** @type {any} */ s) => foodTradesPoolKey(s?.defenseProfile?.chainModifiers)],
  ['DS-DEF-2 Economic Survival: WEAK', DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-2'], 'Economic Survival: WEAK', (/** @type {any} */ s) => economicRowPoolKey(s?.defenseProfile?.scores?.economic)],
  ['DS-GEN-17 GARRISONED', DOSSIER_STATE_PROSE_GENERAL['DS-GEN-17'], 'GARRISONED', (/** @type {any} */ s) => institutionsPoolKey(s?.economicState?.compound?.inst, s)],
]);
/** THE ONE NAMED EXCEPTION, keyed by seed and cause; never a widened rule. */
const EMPTY_EXCEPTIONS = Object.freeze([
  Object.freeze({ seed: 'dz-city-101', cell: 'DS-GEN-17 GARRISONED', crisisKind: 'occupied', cause: '`no crisis: occupied` refuses v1 and v2' }),
]);

describe('DISAGREE: no page prints both sides of an opposite pair', () => {
  it('ARM 1: the measure\'s five seeds and the first births of every size print no row\'s two sides', async () => {
    const found = [];
    for (const seed of SEEDS) for (const id of oppositePairsOnPage(await pageOf(seed))) found.push(`${seed}: ${id}`);
    expect(found).toEqual([]);
  }, 120_000); // its own budget: 42 births (the five, the control, six a size)

  it('ARM 2a: each side\'s matcher matches each of its own leaf texts, its slots filled', () => {
    for (const pair of OPPOSITE_PAIRS) {
      for (const side of [pair.a, pair.b]) {
        const texts = textsOf(side);
        expect(texts.length, `${pair.id} ${side.position} [${side.pool}] holds its variants`).toBe(side.vids.length);
        for (const t of texts) {
          const filled = t.replaceAll(/\{[a-zA-Z]+\}/g, 'Drumburn');
          expect(sidePrinted(matchersOf(side), [filled]), `${pair.id} ${side.pool}: ${filled}`).toBe(true);
        }
      }
    }
  });

  it('ARM 2b: on real pages each side of each row is found by its matcher', async () => {
    const missing = [];
    for (const pair of OPPOSITE_PAIRS) {
      for (const [name, side] of [['a', pair.a], ['b', pair.b]]) {
        let hit = false;
        for (const seed of SEEDS) if (sidePrinted(matchersOf(side), await pageOf(seed))) { hit = true; break; }
        if (!hit) missing.push(`${pair.id} side ${name} (${side.position} [${side.pool}] v${side.vids.join(',')})`);
      }
    }
    expect(missing).toEqual([]);
  }, 120_000); // its own budget: the births of ARM 1, reused

  it('ARM 3: each pinned tail prints on 0 pages, its matcher is live, and its variant\'s head prints', async () => {
    const printed = [];
    const headless = [];
    for (const pin of PINNED_TAILS) {
      for (const t of textsOf(pin.side)) {
        expect(sidePrinted(tailMatchersOf(pin.side), [t.replaceAll(/\{[a-zA-Z]+\}/g, 'Drumburn')]), `${pin.id}: the matcher reads its own text`).toBe(true);
      }
      let head = false;
      for (const seed of SEEDS) {
        const texts = await pageOf(seed);
        if (sidePrinted(tailMatchersOf(pin.side), texts)) printed.push(`${seed}: ${pin.id}`);
        if (sidePrinted(matchersOf(pin.side), texts)) head = true;
      }
      if (!head) headless.push(pin.id);
    }
    expect(printed).toEqual([]);
    expect(headless, 'the pinned variant prints (cut) on some page of the sample, so the 0 is not vacuous').toEqual([]);
  }, 120_000); // its own budget: the births of ARM 1, reused

  it('ARM 4: no cell left empty where its key holds, but the one named exception, which must stay empty', async () => {
    const empty = [];
    for (const seed of [...SEEDS, ...EMPTY_EXCEPTIONS.map((e) => e.seed)]) {
      const { s } = await birthOf(seed);
      const read = { ...factsAnswered(s, crisisAnswered(s, wallsAnswered(s, { slots: { settlement: s.name } }))), audience: 'dm' };
      for (const [name, block, pool, keyOf] of CELLS) {
        if (keyOf(s) !== pool) continue;
        if (eligibleVariants(block.pools[pool], read).length === 0) {
          const kinds = read.facts.crisis?.kinds || [];
          const named = EMPTY_EXCEPTIONS.find((e) => e.seed === seed && e.cell === name && kinds.includes(e.crisisKind));
          empty.push(named ? `${seed}: ${name} (NAMED: crisis ${named.crisisKind}, ${named.cause})` : `${seed}: ${name}`);
        }
      }
    }
    expect(empty).toEqual(EMPTY_EXCEPTIONS.map((e) => `${e.seed}: ${e.cell} (NAMED: crisis ${e.crisisKind}, ${e.cause})`));
  }, 120_000); // its own budget: the births of ARM 1, reused, and dz-city-101
});
