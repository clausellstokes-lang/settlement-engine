/**
 * TAIL-HISTORY-5 batch 6 (2026-11-15; the chair's ruling Y17, from the bar's readers at 5d1e3096b, and the exports'
 * read X9 03015): WHAT THE BAR'S READERS MET, CURED AT THE WRITER.
 * (1) HIGH: the occupation's past event "When the occupiers left…" printed in a town under an occupation now: under the
 *     occupied crisis it takes its twin, which speaks of the LAST occupiers (`historyData.js :: HISTORY_DESC_SIBLINGS`).
 * (2) The fish arrival lines (the racks of drying fish, the gutting and salting, the stacked salt fish, the nets and the
 *     smell of the catch) where the fish failed or under a siege (`crisis: hunger`): each takes a twin with no catch.
 * (3) The caravan broker where no market stands, or under a siege, or where no route reaches; the money changer and the
 *     whole place's looms under a siege: each takes a twin true there (`arrivalProse.js`).
 * (4) X9 03015: the creditor's agent "in town" under a siege: the hook excludes the siege (the timeline's hook gives
 *     way draw-free; the tension's list drops it).
 * (5) X9, the smaller lasting effects (batch 5's form): price ceilings where no market stands; formal council seats, an
 *     oversight office, charters lodged with a court and a regency council below a town: each takes its twin.
 * Every twin keeps its slot and spends no redraw (`arrivalScene.js :: drawAdmitted`; `sizedHistoryText`).
 *
 * THIS FILE REDS WHEN a cured line prints again in a town that makes it false (each with what prints instead), or when
 * the original stops printing where the town makes it true (each KEEP).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { FISH_TAKEN_HERE } from '../../src/domain/facts/tradeAtWork.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

/** The texts the batch's rows print in: the arrival scene, the timeline's descriptions, hooks and lasting effects, the tensions' hooks. */
const textsOf = (/** @type {string} */ seed) => {
  const s = /** @type {any} */ (bornCensus(seed));
  const events = s.history?.historicalEvents || [];
  const tensions = s.history?.currentTensions || [];
  return [s.arrivalScene || '', ...events.map((/** @type {any} */ e) => e.description || ''),
    ...events.flatMap((/** @type {any} */ e) => [...(e.plotHooks || []), ...(e.lastingEffects || [])]), ...tensions.flatMap((/** @type {any} */ t) => t.plotHooks || [])].join(' · ');
};

/** The hooks a SILENT row's line would stand among (the timeline's and the tensions'): its liveness anchor. */
const hooksOf = (/** @type {string} */ seed) => {
  const h = /** @type {any} */ (bornCensus(seed)).history || {};
  return [...(h.historicalEvents || []).flatMap((/** @type {any} */ e) => e.plotHooks || []), ...(h.currentTensions || []).flatMap((/** @type {any} */ t) => t.plotHooks || [])];
};

const SILENT = null; // the slot is silent by design: the timeline's hook gave way to another of its event's hooks, the tension's list dropped it

/** [seed, the false words, what prints instead on the same slot (the declared twin), or SILENT and the KEEP town that prints the original] */
const MUST_NOT = [
  ['r2s-occupied-hamlet-2', /When the occupiers left/, /When the last occupiers left, they left behind a hamlet of former collaborators and former resisters, and none of it was settled before the new occupation came/],
  ['r2s-occupied-metropolis-1', /When the occupiers left/, /When the last occupiers left, they left behind a metropolis/],
  ['r2r-village-21', /Racks of drying fish line the way in/, /The drying racks along the way in stand nearly bare, and only the smell of salt and old catch is left\./],
  ['r2r-city-44', /Racks of drying fish line the way in/, /The drying racks along the way in stand nearly bare/],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-hamlet-16 -> r2s-famine-hamlet-2, a hamlet
  // whose fish failed in the famine, the slot taking the twin
  ['r2s-famine-hamlet-2', /seems to be gutting, salting or selling fish/, /has worked fish all its life, and there is almost no fish to work\./],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's three fish twins of 17:13: a refused L2 fish line now keeps its slot with
  // its twin, so the draws after it moved): r2r-hamlet-28 -> r2r-hamlet-10, a hamlet whose fish is short, the slot taking the twin
  ['r2r-hamlet-10', /Barrels of salt fish stand stacked/, /Empty salt barrels stand stacked by the water, and even the gulls have given up on them\./],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-thorp-58 -> r2s-under_siege-hamlet-0, a
  // besieged place whose fish house is stopped, the slot taking the twin
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the same): r2s-under_siege-hamlet-0 -> r2s-under_siege-village-13, a besieged place
  // whose fish house is stopped, the slot taking the twin
  ['r2s-under_siege-village-13', /Barrels of salt fish stand stacked/, /Empty salt barrels stand stacked by the water/],
  // BAR4-SCENES-2 (2026-11-16, re-keyed by identity): the slot's first draw here is the basket line, which now has its own twin (the chair's
  // ruling HW1: a twin keeps the slot and spends no redraw), so the redraw that reached the nets line is no longer spent; the false words stay out
  ['r2s-famine-thorp-0', /the smell of the catch follows you/, /An empty fish basket is carried past, back from the water with nothing in it\./],
  ['r2s-under_siege-village-1', /the smell of the catch follows you/, /Nets hang drying on poles, and they have brought in little for a long while\./],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-thorp-8 -> r2r-thorp-42, a thorp with no
  // market where the broker is refused and its twin takes the slot
  ['r2r-thorp-42', /A caravan broker shouts terms/, /A pair of pack animals stands in a yard, unladen, while their keeper mends a strap\./],
  // RE-KEYED BY IDENTITY (TAIL-CLOSE-POOLS-2, 2026-11-15): r2s-plague_onset-village-0 printed the broker only on the history's own
  // branch; on the joined line its arrival's later beats are dealt otherwise (no broker and no twin at 796c49ef0 and every point after).
  // r2r-hamlet-41 holds the row's identity: the broker refused, its twin on the slot (one of the five census towns that print it).
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-hamlet-41 -> r2r-hamlet-70 (the same)
  ['r2r-hamlet-70', /A caravan broker shouts terms/, /A pair of pack animals stands in a yard, unladen/],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2s-under_siege-city-8 and -metropolis-43 ->
  // r2s-under_siege-metropolis-33 and -50, greek towns under the siege (the census's own family, extended) whose slot takes the twin
  ['r2s-under_siege-metropolis-33', /A money changer sits at his table with coins from many mints/, /A money changer sits at his table with little to do, counting the same coins from many mints again\./],
  ['r2s-under_siege-metropolis-50', /A money changer sits at his table with coins from many mints/, /A money changer sits at his table with little to do/],
  ['r2s-under_siege-town-8', /The clatter of looms follows you/, /Here and there someone works cloth behind a shutter in .+, though little of it goes out these days\./], // BAR6-SCENES (2026-11-16, LAW 6 rule 6b; re-keyed by identity): the siege twin reworded to name no loom
  ['r2s-under_siege-metropolis-67', /The clatter of looms follows you/, /Bolts of cloth and bales of wool are stacked in the shops, and none of it is going anywhere\./], // BAR6-SCENES (2026-11-16, LAW 6 rule 6b; re-keyed by identity): the first draw is the road out, refused by the siege; its twin (reworded, held to no route) now keeps the slot, so no redraw lands on the looms
  ['r2s-under_siege-thorp-1', /creditor's agent is in town/i, SILENT, 'r2r-thorp-28'],
  ['r2r-thorp-0', /Price ceilings on the affected goods/, /In lean seasons the affected goods are still shared out by agreement, not sold to whoever pays most/],
  ['r2r-hamlet-16', /Price ceilings on the affected goods/, /In lean seasons the affected goods are still shared out by agreement/],
  ['r2r-thorp-27', /Council seats now formally split/, /The old families and the young still quarrel over who speaks for the place/],
  ['r2r-village-37', /Council seats now formally split/, /The old families and the young still quarrel over who speaks for the place/],
  ['r2r-hamlet-42', /An oversight office was established/, /Since then, whoever handles the common purse has had to show the accounts to the heads of the families/],
  ['r2r-village-45', /An oversight office was established/, /whoever handles the common purse has had to show the accounts/],
  ['r2r-thorp-3', /Rival charters over the land are both still lodged with the court/, /Rival claims to the land are both still pressed, and no one here has the standing to settle them/],
  ['r2r-village-57', /Rival charters over the land are both still lodged with the court/, /Rival claims to the land are both still pressed/],
  ['r2r-hamlet-5', /A regency council formed in the interim/, /Those who held the place in the interim have never quite stopped expecting to be consulted/],
  ['r2s-famine-village-0', /A regency council formed in the interim/, /Those who held the place in the interim/],
];

/** [seed, the true original that must still print] */
const KEEP = [
  ['r2r-village-23', /When the occupiers left, they left behind a village of former collaborators and former resisters, none of it ever settled/],
  ['r2r-thorp-43', /Racks of drying fish line the way in, and the smell of salt and catch is everywhere\./],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-thorp-22 -> r2r-thorp-44, a thorp whose catch is taken here
  ['r2r-thorp-44', /seems to be gutting, salting or selling fish\./],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-thorp-53 -> r2r-thorp-22, a thorp whose fish is at work by navigable water
  ['r2r-thorp-22', /Barrels of salt fish stand stacked by the water, and the gulls have opinions about every one\./],
  ['r2r-thorp-27', /Nets hang drying on poles, and the smell of the catch follows you\./],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-city-15 -> r2r-city-8, a steppe market city with a road open
  ['r2r-city-8', /A caravan broker shouts terms to a line of laden animals and the people leading them\./],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-metropolis-13 -> r2r-metropolis-63, a greek metropolis under no siege
  ['r2r-metropolis-63', /A money changer sits at his table with coins from many mints\./],
  ['r2r-town-9', /The clatter of looms follows you through .+, from one shutter to the next\./],
  ['r2r-thorp-28', /creditor's agent is in town conducting a quiet assessment before enforcement/i],
  ['r2r-town-50', /Price ceilings on the affected goods still enforced in lean seasons/],
  ['r2r-town-40', /Council seats now formally split between the old guard and the young/],
  ['r2r-city-18', /An oversight office was established to audit officials afterward/],
  ['r2r-town-21', /Rival charters over the land are both still lodged with the court/],
  ['r2r-town-11', /A regency council formed in the interim never fully dissolved/],
];

describe('TAIL-HISTORY-5 batch 6: what the bar\'s readers met prints only where the town makes it true', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('MUST NOT: no cured line prints where the town makes it false; its twin prints on the same slot', () => {
    expectNoSeedFailures(collectSeedFailures(MUST_NOT.map(([seed], i) => `${i}|${seed}`), (key) => {
      const [i, seed] = key.split('|');
      const [, gone, instead, witness] = /** @type {[string, RegExp, RegExp | null, string?]} */ (MUST_NOT[Number(i)]);
      const s = textsOf(String(seed));
      if (instead) {
        // the patterns the town's texts match: the twin must be among them, the false words must not
        expectAbsentWithAnchor([gone, instead].filter((re) => re.test(s)), gone, instead, `${key}: the false words out, the twin on the slot`);
      } else {
        // a silent slot: the original prints in its KEEP town (computed from that town's texts), and not here
        const before = textsOf(String(witness));
        const original = before.match(gone)?.[0];
        expect(original, `${key}: the original prints in ${witness}`).toBeTruthy();
        expectPresentThenAbsent(before, s, original, `${key}: the slot is silent where the town makes the line false`);
      }
      // TAIL-CLOSE-TESTS-C: the liveness anchor first: the twin on the same slot, or for a SILENT row the hooks it stands among
      if (instead) expect(s, key).toMatch(/** @type {RegExp} */ (instead));
      else expect(hooksOf(String(seed)).length, `${key}: the hooks the silent line stood among still print`).toBeGreaterThan(0);
      // anchored: the branch above shows this town's slot is live (its twin prints, or its hooks print), so the absence is a cure
      expect(s, key).not.toMatch(/** @type {RegExp} */ (gone));
    }), 'the false lines');
  }, 600_000);

  test('KEEP: each original still prints where the town makes it true', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map(([seed], i) => `${i}|${seed}`), (key) => {
      const [i, seed] = key.split('|');
      expect(textsOf(String(seed)), key).toMatch(/** @type {RegExp} */ (KEEP[Number(i)][1]));
    }), 'the true originals');
  }, 600_000);

  // The chair's 04:08 note: ONE CONDITION FOR THE WHOLE FAMILY of fish-and-catch arrival lines. Every line of the fish
  // sense that shows a catch, fresh or salted, refuses `crisis: hunger` and has a declared twin true there (a twin keeps
  // the slot and spends no redraw); the twins themselves need it. Reds when a catch line is added without the condition.
  // The one exception is named: batch 1's basket of fish refuses the hunger bare (its slot redraws, as it has since
  // 3da34c70b); a twin now would spend no redraw there and move the paragraph's later beats.
  test('the fish sense: every catch line refuses crisis: hunger and has its twin', () => {
    const fish = /** @type {any} */ (ARRIVAL_SENSES.find((sense) => sense.key === 'fish'));
    const rows = [...fish.lines, ...fish.dominant].filter((l) => typeof l === 'object');
    const own = (/** @type {any} */ l) => { const t = textOf(l); return typeof t === 'function' ? t('{name}') : t; };
    const originals = rows.filter((l) => !l.twinOf);
    const BARE_SINCE_BATCH_1 = 'A basket of fish, still flapping, is carried past at a run.';
    expect(originals.length).toBeGreaterThan(0);
    for (const l of originals) {
      expect(l.excludes || [], own(l)).toContain('crisis: hunger');
      if (own(l) === BARE_SINCE_BATCH_1 && !rows.some((t) => t.twinOf === own(l))) continue; // BAR4-SCENES-2: it has its twin now (HW1)
      const twin = rows.find((t) => t.twinOf === own(l));
      expect(twin, `the twin of ${own(l)}`).toBeTruthy();
      // BAR4-SCENES-2 (2026-11-16, re-keyed by identity; the chair's ruling HW1): a twin speaks wherever its original is refused for want of
      // fish (the hunger, or every fish house short: `trade at work: fish`), so it needs its original's other needs and not the hunger
      // RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, BR25 (4)): the anchor was the plain key `trade at work: fish`; BAR8-SCENES had the
      // racks and the gutting declare the fish story's key `trade at work: fish taken here` (BR17), and their twins speak where it is
      // refused, so the filter takes ANY key of that atom for the fish (the plain key and the taker's), the same claim
      const FISH_KEYS = ['trade at work: fish', `trade at work: ${FISH_TAKEN_HERE}`];
      expect(twin.needs, own(twin)).toEqual((l.needs || []).filter((/** @type {string} */ a) => !FISH_KEYS.includes(a)));
    }
  });
});
