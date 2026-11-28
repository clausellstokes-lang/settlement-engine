/**
 * bar2People2Trade.test.js — BAR2-PEOPLE-2 (REVIEW-BAR-2, the TIES worklist, C18001 and C15449; the chair's rulings PP3,
 * PP3a and PP3b of 2026-11-15, vetoable by the owner), on births:
 *   A RIVALRY LINE THAT CLAIMS A PRESENT SHARED TRADE ("bid for the same contracts"; "Every client <A> wins is one <B>
 *   lost"; the gloss "are rivals in the same line of work") prints only where the pair shares a trade (one house family,
 *   or one category that is not the catch-all `other`: `npcData.js :: pairSharesTrade`); elsewhere THE DESCRIPTION'S TEXT
 *   TAKES ITS TWIN. THE DRAW IS NOT MOVED: the same index for the same pair, so the tension line beside it still prints;
 *   a line of a shared PAST ("trained together") keeps its text for any pair.
 * RED AT THE BASE (923f2b159): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape (r2r-) @param {string} seed */
function born(seed) {
  const m = seed.match(/^r2r-(\w+)-\d+$/);
  if (!m) throw new Error(`no shape for ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
}

/** [town, the line that must not print (the pair shares no trade), its twin that prints in its place] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  ['r2r-hamlet-18', "Daigh O'Connor and Rian Fitzgerald bid for the same contracts", "Daigh O'Connor and Rian Fitzgerald sit at the same tables and want the same things from them."],
  ['r2r-hamlet-23', 'Every client Cassius Severus wins is one Egeria Calvus lost', 'Every friend Cassius Severus wins is one Egeria Calvus lost, and the reverse.'],
  // RE-KEYED BY IDENTITY (DEBT-1, 2026-11-17): r2r-hamlet-20's pair (Kjara Eriksson, Skadi Ragnarsson) is now drawn as allies,
  // so no rivalry line prints there at all; the same claim in a hamlet whose rival pair shares no trade: r2r-hamlet-41
  ['r2r-hamlet-41', 'Kadan Kereit and Mönkhzul Borjigin are rivals in the same line of work.', 'Kadan Kereit and Mönkhzul Borjigin are rivals, and neither gives the other ground.'],
]);
/** KEEP: [town, a true line that must still print] */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-village-54', 'Genji Luo and Xin Ma bid for the same contracts and sit at the same tables.'], // the pair shares a trade
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-town-15's rivalry lit no longer draws the shared-trade line; the lowest r2r-town whose rival pair draws it
  // is town-95 (95 125 129 144 151 171 of 200)
  ['r2r-town-95', 'Every client Lei Tang wins is one Yang Dong lost'], // the pair shares a trade
  ['r2r-hamlet-33', 'Chitragupta Acharya and Jyoti Chaudhary trained together and have competed ever since.'], // a shared past: any pair
  ['r2r-hamlet-18', "Daigh O'Connor has hired away Rian Fitzgerald's best assistant."], // the draw is not moved: the same index's tension
  ['r2r-hamlet-23', 'Cassius Severus and Egeria Calvus will both present proposals at the next council session.'], // likewise
]);

/** @type {Record<string, string>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0])])) {
    const s = born(seed);
    towns[seed] = JSON.stringify({ relationships: s.relationships, rumour: s.prominentRelationship ?? null });
  }
}, 600000);

describe('BAR2-PEOPLE-2 · a rivalry claims a shared trade only where the pair shares one (PP3, PP3a, PP3b)', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; its twin prints`, () => {
      expectAbsentWithAnchor(towns[seed], refused, instead, `${seed}: the shared-trade claim; its twin in the same slot`);
      expect(towns[seed]).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(towns[seed]).toContain(kept);
    });
  }
});
