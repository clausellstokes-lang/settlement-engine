/**
 * TAIL-CRISIS batch 6 (the seat TAIL-CRISIS-4; the chair's rulings K18 K19 K20 of 2026-11-15, each vetoable by the owner):
 * THE GROUP'S OWN NEW LINES SAY ONLY WHAT THE RECORD HOLDS.
 *   K18 `domain/crisis/crisisSummaryVantage.js`: an insurgency's vantage does not hide a quarrel the record holds in the open
 *       (every insurgency's safety profile carries its political violence and its loyalty testing).
 *   K19 `domain/summary/settlementQuickGuide.js :: scopeAgainstRecord`: a culture phrase names only what stands (the tank a
 *       water work, the bazaar a market, a pastoral life herds or pasture).
 *   K20 `domain/crisis/crisisCast.js :: CAST_REASONS`: the brunt's stored reason says the person's place in a power that
 *       loses by the crisis, never "the house the crisis hits" (a declared move of stored text).
 * One collected test on births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r-/r2s- arms, copied): each FALSE pair
 * is a (seed, words) the town printed at the base and must not print now, with what prints in its place; each KEEP pair a
 * true sibling that prints at both.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { crisisSummaryForSurface } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { crisisHookFor } from '../../src/domain/crisis/crisisHooks.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
    let cfg;
    if (m) cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
    else {
      m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
      if (!m) throw new Error(`no configuration for ${seed}`);
      cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    }
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 120000);

/** @param {any} s @param {string} text */
const named = (s, text) => text.replaceAll(String(s.name ?? '\u0000'), '{name}');
/** Every vantage line the town prints for its crises (the Defense tab, the exports, the Tonight sheet). @param {any} s */
const vantages = (s) => named(s, [].concat(s.stress || []).filter(Boolean)
  .flatMap((e) => ['cover', 'overview', 'defence', 'tonight'].map((surface) => crisisSummaryForSurface(e, s.name, /** @type {any} */ (surface)) || ''))
  .join('\n'));
/** The quick guide's culture line. @param {any} s */
const scope = (s) => cultureScopeLine(s);
/** The cast's stored reasons and the cast hooks. @param {any} s */
const cast = (s) => [].concat(s.stress || []).filter(Boolean)
  .flatMap((e) => [...(e.cast?.roles || []).map((/** @type {any} */ r) => `${r.role}: ${r.reason}`), crisisHookFor(s, e) || ''])
  .join('\n');

/** [seed, surface, words that must NOT print, what prints in their place] */
const FALSE = [
  // K18: beside "Street-level confrontations between insurgent supporters and the watch" (Dangerous — Insurgency)
  ['r2r-thorp-22', vantages, 'you would not see the quarrel over who is really in charge', 'Travellers in {name} are pressed, sooner or later, to say which side they are on, and both sides take note of the answer.'],
  ['r2r-thorp-22', vantages, 'Nobody in {name} fights in the open', 'In {name} both the government and those who defy it press people to say which side they are on, and those watching count who has stopped obeying.'],
  ['r2r-thorp-25', vantages, 'There is no fighting in {name}', 'In {name} the quarrel over who is in charge has turned to violence, and orders go unheeded and dues unpaid.'],
  ['r2r-thorp-25', vantages, '{name} looks calm', 'In {name} orders go unanswered, and some of its people have turned against those in charge.'],
  ['r2r-village-26', vantages, 'grows quietly', 'The defiance of {name}\'s government grows, and those watching it count who still obeys and who has stopped.'],
  // K19: the tank (wells and springs only), the pastoral life (no herds, no pasture: a coastal port fed by its fish)
  ['r2r-town-7', scope, 'the tank and the bazaar', 'built around the bazaar, in quarters by trade, under temple and guild'],
  ['r2r-village-1', scope, 'the tank and the bazaar', 'built around the bazaar, under the temple'],
  ['r2r-hamlet-41', scope, 'pastoral life', 'built on clan lines, held by clan and caravan'],
  ['r2r-thorp-21', scope, 'pastoral life', 'built on clan lines.'],
  // K20: the brunt's reason, on the cast and in the hook
  ['r2r-thorp-17', cast, 'the only one in the house the crisis hits', 'the only one named here of a power that loses by the crisis'],
  ['r2r-hamlet-16', cast, 'the one with the least say in the house the crisis hits', 'the one with the least say in a power that loses by the crisis'],
  ['r2r-hamlet-10', cast, 'one of the house the crisis hits', 'one of a power that loses by the crisis'],
];

/** [seed, surface, a true sibling that must still print] */
const KEEP = [
  ['r2r-city-33', vantages, 'In {name} people keep out of the quarrel between the government and those who defy it, and away from anyone asking questions.'],
  ['r2s-plague_onset-metropolis-1', scope, 'built around the tank and the bazaar'],
  ['r2r-thorp-29', scope, 'built for a pastoral life half-settled and half-moving'],
];

describe('TAIL-CRISIS batch 6: the group\'s own new lines say only what the record holds', () => {
  it('no FALSE words print, and what every printing town bears prints in their place', () => {
    const failures = collectSeedFailures(FALSE, ([seed, surface, gone, instead]) => {
      const text = /** @type {(s: any) => string} */ (surface)(birth(/** @type {string} */ (seed)));
      expectAbsentWithAnchor(text, gone, instead, String(seed));
    });
    expectNoSeedFailures(failures, 'a FALSE phrase printed, or what the town bears did not');
  }, 300000);

  it('the true siblings still print', () => {
    const failures = collectSeedFailures(KEEP, ([seed, surface, kept]) => {
      expect(/** @type {(s: any) => string} */ (surface)(birth(/** @type {string} */ (seed))), /** @type {string} */ (seed)).toContain(kept);
    });
    expectNoSeedFailures(failures, 'a true sibling no longer prints');
  }, 300000);
});
