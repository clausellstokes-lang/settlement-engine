/**
 * DISAGREE (PROSE-6; the owner's order of 2026-11-22, "Can you fix these:"): NO PAGE PRINTS BOTH SIDES OF A PAIR THAT READS AS
 * OPPOSITE. The pairs are the one frozen table `tests/helpers/oppositeSentencePairs.mjs :: OPPOSITE_PAIRS`, keyed by pool and
 * variant id; each side is matched on the page (`buildPrintProse(s, {})`) by its leaf texts as templates, the page's
 * clause-cut forms included (GEN-17 GARRISONED v2 prints cut: `map/DISAGREE-PHASE1.md`).
 *   ARM 1: the chair's measure's five seeds (FOOD dz-town-12, dz-city-54, dz-metropolis-2; WAGES dz-town-2, dz-town-36),
 *          PROSE-E's fourteen (one a TRUE variant pair of `map/DISAGREE-E-PHASE1.md`: P1 dz-thorp-27, -5, -43, -33, -14, -17;
 *          P2 dz-city-63, -32, -124, -40, -19, -7; P3 dz-city-50; P4 dz-village-7) and the first N births of every size: no page
 *          prints both sides of any row (WAGES and P1-P4 have none: ARM 5 holds them; CRITICAL v2-v3 x GARRISONED v1 is watched).
 *   ARM 2 (anti-vacuity): each side's matcher matches its own leaf texts, slot-filled; and on real pages (ARM 1's births
 *          and the named control seeds) each side of each row is found.
 *   ARM 3: each pinned tail (`PINNED_TAILS`: GEN-13 NO-MARKET v12's "and trades in a small way: …", the chair's N71; the
 *          page cuts it; GEN-17 GARRISONED v2's tail left the table with WORDS-2 E9, below) prints on 0 pages of ARM 1's
 *          births; its matcher matches its own leaf text, and its variant's head prints: found by the side's matcher, or,
 *          where the printed head is a cut under the FLOOR (below), drawn by the ledger with the site mount's cut of its text
 *          (`generalDeskRead.js :: siteClause`) on the page.
 *   ARM 4 (no cell left empty): on ARM 1's births and dz-city-101, wherever the key of DS-DEF-2 `CHAIN: food trades failing`,
 *          DS-DEF-2 `Economic Survival: WEAK` or DS-GEN-17 `GARRISONED` holds (the desks' own key functions), the eligible set
 *          (`stateProseKernel.js :: eligibleVariants`, the desks' own entry answers) is not empty, but for the ONE NAMED
 *          exception, keyed by seed and cause: dz-city-101, GEN-17 GARRISONED, crisis `occupied` (`no crisis: occupied`
 *          refuses v1 and v2; empty at 244fa84ef by the same marks). The arm reds too if that exception stops being empty.
 *   ARM 5 (the chair, 2026-11-23 03:45 and 03:55): DS-DEF-2 Economic Survival: WEAK v1's and v2's OLD words
 *          (`PINNED_OLD_WORDS`; each re-worded in place through its WORD_CORRECTIONS row) print on 0 pages of ARM 1's births
 *          (on 244fa84ef's leaf dz-town-2 printed v1's, dz-town-36 v2's); each matcher matches its own text.
 *          PROSE-E (the chair, N70): five more re-worded in place, their old words pinned the same way (NO-MARKET v10; full
 *          legal chain v1, v2; CHAIN working v1; CRITICAL v1), red first on b443be64b's leaves.
 *   ARM 6 (WORDS-2 E9, the tenth chair's E9): GEN-17 GARRISONED v2's source says what the page prints: the place's trim
 *          (`generalDeskRead.js :: siteClause`) cuts nothing from it, so no clause of the leaf is a clause no page shows; its
 *          old words ("…, and the money is found every season.") are held at 0 pages by ARM 5. Red first on 0ec96f13d8's leaf.
 *   WORDS-2 E4 (the tenth chair's RULING G3 (a)): DS-ECO-1 COMBINATION C4 v6's old words ("There is no market at …") join
 *          ARM 5's pins, red first on 0ec96f13d8's leaf (the leaf still held them).
 * THE FLOOR (the chair, N71): the matcher does not match a clause cut of fewer than four literal words
 *   (`tests/helpers/oppositeSentencePairs.mjs :: formsOf`, `literalWords >= 4`), so a line the page prints only as such a cut
 *   is invisible to every arm that reads by matcher: NO-MARKET v12 draws on 46 of the 900 and prints as "{settlement} has no
 *   market." (PROSE-E item 0). The FLOOR measure's figure: measured over 900 births (map/FLOOR.md, 99a22c3ad): the floor
 *   hid 2 cell pairs on 111 pages, all GEN-13 NO-MARKET v11/v12's bare cut beside ECO-10 or ECO-1, and none reads as a
 *   contradiction. The floor itself is unchanged.
 * The arm "GEN-17 v2 never prints where the guard's pay reads 'short'" is NOT built: phase 1 (i) counted 8 such pages.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { siteClause } from '../../src/components/new/generalDeskRead.js';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { economicRowPoolKey, foodTradesPoolKey } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { institutionsPoolKey } from '../../src/domain/display/stateProse/generalStateProse.js';
import { factsAnswered } from '../../src/domain/facts/factsAnswered.js';
import { wallsAnswered } from '../../src/domain/defense/defenseFacts.js';
import { crisisAnswered } from '../../src/domain/crisis/crisisFacts.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import {
  OPPOSITE_PAIRS, PINNED_OLD_WORDS, PINNED_TAILS, matchersOf, oldWordsMatchersOf, oppositePairsOnPage, pageTextsOf, sidePrinted,
  tailMatchersOf, textsOf,
} from '../helpers/oppositeSentencePairs.mjs';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 6; // births a size: the file's own budget below
const MEASURE_SEEDS = ['dz-town-12', 'dz-city-54', 'dz-metropolis-2', 'dz-town-2', 'dz-town-36',
  // PROSE-E: one seed a TRUE variant pair of map/DISAGREE-E-PHASE1.md (P1 v10 x ECO-10 v5, v6, v4, v3, v1, v9; P2 v3xv2, v2xv2,
  // v1xv1, v1xv2, v2xv1, v3xv1; P3 v1xv1; P4 v1xv1).
  'dz-thorp-27', 'dz-thorp-5', 'dz-thorp-43', 'dz-thorp-33', 'dz-thorp-14', 'dz-thorp-17',
  'dz-city-63', 'dz-city-32', 'dz-city-124', 'dz-city-40', 'dz-city-19', 'dz-city-7', 'dz-city-50', 'dz-village-7'];
// ARM 2b's controls: a page that prints FOOD side A where it is true (food below secure; on the 900 at the cure, FOOD side A
// printed on dz-metropolis-6, 38, 58, 77, 125: map/disagree-phase2.mjs); FOOD side B prints on the first thorps. PROSE-E's
// watched row: CRITICAL v2 prints on dz-thorp-2 (which also draws NO-MARKET v12, ARM 3's head), CRITICAL v3 on dz-thorp-3,
// GARRISONED v1 on dz-village-7 (the forms probe on b443be64b, /home/user/logs/prose-e2-forms-base.log).
const CONTROL_SEEDS = ['dz-metropolis-6', 'dz-thorp-2', 'dz-thorp-3', 'dz-village-7'];
const SEEDS = [...new Set([...MEASURE_SEEDS, ...CONTROL_SEEDS, ...SIZES.flatMap((size) => Array.from({ length: N }, (_, i) => `dz-${size}-${i}`))])];

/** @type {Map<string, { s: any, texts: string[], drawn: Set<string> }>} */
const BIRTHS = new Map();
let lawsLoaded = false;
/**
 * @param {string} seed
 * @returns {Promise<{ s: any, texts: string[], drawn: Set<string> }>} the record, its page's mount texts, and the draws the
 *   kernel's ledger names (`${block}::${pool}::v${vid}`)
 */
async function birthOf(seed) {
  if (!lawsLoaded) { await loadGenerationLawPayloads(); lawsLoaded = true; }
  const held = BIRTHS.get(seed);
  if (held) return held;
  const settType = seed.split('-')[1];
  const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
  const { result, ledger } = withPresumptionLedger(() => buildPrintProse(s, {}));
  const drawn = new Set(ledger.filter((e) => typeof e.lineId === 'number').map((e) => `${e.pool}::v${e.lineId}`));
  const born = { s, texts: pageTextsOf(result), drawn };
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
        const { s, texts, drawn } = await birthOf(seed);
        if (sidePrinted(tailMatchersOf(pin.side), texts)) printed.push(`${seed}: ${pin.id}`);
        if (sidePrinted(matchersOf(pin.side), texts)) head = true;
        // Under the FLOOR: the ledger draws the variant and the page holds the site mount's cut of its own text.
        for (const t of textsOf(pin.side)) {
          const isDrawn = pin.side.vids.some((vid) => drawn.has(`${pin.side.position}::${pin.side.pool}::v${vid}`));
          const filled = t.replaceAll('{settlement}', s.name);
          const cut = siteClause(filled);
          if (isDrawn && cut !== filled && texts.some((x) => x.includes(cut))) head = true;
        }
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

  it('ARM 5: a re-worded line\'s old words print on 0 pages, and the matcher reads them', async () => {
    const printed = [];
    for (const pin of PINNED_OLD_WORDS) {
      expect(sidePrinted(oldWordsMatchersOf(pin), [pin.text.replaceAll(/\{[a-zA-Z]+\}/g, 'Drumburn')]), `${pin.id}: the matcher reads its own text`).toBe(true);
      for (const seed of SEEDS) if (sidePrinted(oldWordsMatchersOf(pin), await pageOf(seed))) printed.push(`${seed}: ${pin.id}`);
    }
    expect(printed).toEqual([]);
    for (const pin of PINNED_OLD_WORDS) expect(textsOf(pin.side).includes(pin.text), `${pin.id}: the leaf no longer holds the old words`).toBe(false);
  }, 120_000); // its own budget: the births of ARM 1, reused

  it('ARM 6: GEN-17 GARRISONED v2\'s source words are the words the page prints (the trim cuts nothing)', () => {
    const v2 = DOSSIER_STATE_PROSE_GENERAL['DS-GEN-17'].pools.GARRISONED.find((v) => v.vid === 2);
    expect(v2?.text).toBeTypeOf('string');
    expect(siteClause(v2.text)).toBe(v2.text);
  });
});
