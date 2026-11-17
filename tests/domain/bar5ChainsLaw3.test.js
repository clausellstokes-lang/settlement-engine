/**
 * bar5ChainsLaw3.test.js — BAR5-CHAINS (BRIEF-BAR5 amendment L4; the chair's directions (a), (b), (c) and ruling CC1 of
 * 2026-11-16; each vetoable by the owner): LAW 3'S FOUR RULES OF ONE STATE ON EVERY TAB, KEPT AS A GUARD, read at the
 * record through the leaves the page prints from (the page-copy detector, `tests/helpers/pageLaws/law3.mjs`, reads the
 * rendered tabs; this file reads the same facts the tabs read, so the corpus can carry the census's 720).
 *
 *   L3.halfway (a)   the record's half-way gap names no house whose finisher by trade stands (`houseInputAtHand.js ::
 *                    tradeFinisherIn`, read by the gap writer and the page alike), and no chain card prints a good its
 *                    half-way gap denies (`facts/halfWayGoods.js :: halfWayGoodsDenied`, through `chainAsShown`);
 *   L3.needed (b)    a house the terrain's need list names ("Required by Vintner") whose good the page prints as "Needed, and
 *                    not brought in" is short by the one reading the mark reads (`crisisStoppedRow.js :: housesShortOfInput`);
 *                    a house of several inputs is excluded by name (the chair's M-S: short only if none reaches it);
 *   L3.outputs, L3.chainOverStopped (c, CC1)   no card printing a working word names an output the leaf marks for a crisis
 *                    in force, or stands over houses whose every service row one crisis marks.
 *
 * THIS FILE REDS WHEN (a) THE ZERO: an instance of any rule stands in a town of the census's 720 (born in the census's own
 * shape, CENSUS-3 seedcfg.mjs); (b) THE POSITIVE CONTROL: a rule read BLIND (the gap by its house's head alone, the card as
 * the record holds it, the mark read bare) stops finding its instance in a town of the 720 that held it at 600b7683a, the
 * second check's rows C37887 / C39608 (half-way), C31652 (the vintner), C3874 (an escort under a crisis) and C17893 (a
 * shrine's every service stopped), each in the census town that showed it.
 */
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { chainsOfHouse, houseHead, tradeFinisherIn } from '../../src/domain/facts/houseInputAtHand.js';
import { halfWayGoodsDenied } from '../../src/domain/facts/halfWayGoods.js';
import { chainAsShown } from '../../src/domain/display/chainStateShown.js';
import { chainCardUnderSiege } from '../../src/domain/display/economicsCrisisMarks.js';
import { chainOutputsShown, importsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { crisisOfMarkKind, housesShortOfInput, rowStoppedBy, stoppingCrisesOf } from '../../src/domain/display/crisisStoppedRow.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';
import { liveHouseOf } from '../../src/domain/facts/presence.js';
import { RESOURCE_CHAINS } from '../../src/data/goods/chains.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, in its own order of shapes. */
const CENSUS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((c) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${c}-${size}-${i}`))),
];
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
const born = (seed) => {
  let m = /^r2r-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  if (!m) throw new Error(`a guard seed is a census seed: ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };

const WORKING = new Set(['running', 'operational', 'entrepot']);
/** @param {unknown} x */
const fold = (x) => String(x ?? '').toLowerCase().replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** L3.halfway (a), the gap: a half-way gap names a house whose finisher by trade stands. Blind: the gap by head alone. */
function gapInstances(/** @type {any} */ s, blind = false) {
  const roster = liveInstitutions(s);
  const gaps = blind
    ? (s.resourceAnalysis?.exploitation?.partiallyExploited || []).map((/** @type {any} */ c) => ({ chain: c.rawResource,
      missing: (c.processingInstitutions || []).filter((/** @type {string} */ n) => !roster.some((i) => i?.name === n || houseHead(i?.name) === houseHead(n))) }))
    : (s.resourceAnalysis?.gaps || []).filter((/** @type {any} */ g) => !g.institution && /final goods/i.test(String(g.impact)));
  return gaps.filter((/** @type {any} */ g) => (g.missing || []).some((/** @type {string} */ m) => tradeFinisherIn(roster, m)))
    .map((/** @type {any} */ g) => `gap ${g.chain}: ${g.missing.join(', ')}`);
}

/** L3.halfway (a), the card: a card prints a good its half-way gap denies. Blind: the card as the record holds it. */
function cardGoodsInstances(/** @type {any} */ s, blind = false) {
  return (s.economicState?.activeChains || []).flatMap((/** @type {any} */ c) => {
    const card = blind ? c : chainCardUnderSiege(s, c, chainAsShown(c, s));
    const denied = halfWayGoodsDenied(s, c);
    return chainOutputsShown(card, s).filter((o) => denied.has(o)).map((o) => `card ${c.chainId}: ${o}`);
  });
}

/** L3.needed (b): a house the need list names, its good printed needed, unmarked. Blind: the mark read bare. */
function idleCraftInstances(/** @type {any} */ s, blind = false) {
  const reasons = s.resourceAnalysis?.imports?.reasons || {};
  const short = housesShortOfInput(s);
  /** @type {string[]} */
  const out = [];
  for (const good of importsAsPrinted(s).needed) {
    const named = /^Required by (.+?) but not available/.exec(String(reasons[good] || ''))?.[1];
    const inst = named ? liveInstitutions(s).find((i) => i?.name === named) : undefined;
    if (!inst) continue;
    // the detector's scope (BAR5-AUDIT-B precision draw 2): a CRAFT whose work stands idle; a market's stall (the fishmonger, whose
    // own trade is the route, `houseInputAtHand.js :: ROUTE_HOUSE_TAGS`) is named in the hand-back, not read here
    if (String(inst.category || '') !== 'Crafts') continue;
    if (chainsOfHouse(inst.name, RESOURCE_CHAINS).length > 1) continue; // NAMED EXCLUSION, M-S: a house of several inputs is short only if none reaches it
    if (blind || !short.has(inst.name)) out.push(`needed ${good}: ${inst.name}`);
  }
  return out;
}

/** L3.outputs and L3.chainOverStopped (c, CC1): a working card over a marked output or over houses whose every service is marked. Blind: the card before CC1 read it. */
function stoppedCardInstances(/** @type {any} */ s, blind = false) {
  const crises = stoppingCrisesOf(s);
  if (crises.length === 0) return [];
  const rows = serviceRowsOf(s.availableServices).map(({ svc }) => svc).filter((v) => v && typeof v.name === 'string');
  const marked = (/** @type {string} */ crisis, /** @type {any} */ row) => { const k = rowStoppedBy(s, 'service', row, [crisis]); return k !== null && crisisOfMarkKind(k) === crisis; };
  return (s.economicState?.activeChains || []).flatMap((/** @type {any} */ c) => {
    const card = blind ? chainAsShown(c, s) : chainCardUnderSiege(s, c, chainAsShown(c, s));
    if (!WORKING.has(String(card?.status))) return [];
    const outs = (Array.isArray(card.outputs) ? card.outputs : []).map(fold);
    const hit = rows.find((r) => fold(r.name).length >= 6 && crises.some((cr) => marked(cr, r)) && outs.some((o) => ` ${o} `.includes(` ${fold(r.name)} `)));
    if (hit) return [`output ${c.chainId}: ${hit.name}`];
    const houses = (c.processingInstitutions || []).map((/** @type {unknown} */ h) => liveHouseOf(s, h)).filter(Boolean);
    const allStopped = houses.length > 0 && crises.some((cr) => houses.every((/** @type {any} */ h) => {
      const k = rowStoppedBy(s, 'house', h, [cr]);
      if (k !== null && crisisOfMarkKind(k) === cr) return true; // the house's own mark (SW1b)
      const own = rows.filter((r) => r.institution === h.name);
      return own.length > 0 && own.every((r) => marked(cr, r)); // CC1 (ii): every service row marked
    }));
    return allStopped ? [`over ${c.chainId}: ${houses.map((h) => h.name).join(', ')}`] : [];
  });
}

const RULES = { gapInstances, cardGoodsInstances, idleCraftInstances, stoppedCardInstances };

describe('LAW 3, one state on every tab (BAR5-CHAINS): the chains, their gaps and their houses', () => {
  test('(a) THE ZERO over the census\'s 720: no rule stands in any town', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures(CENSUS, (seed) => {
      const s = town(seed);
      for (const [rule, read] of Object.entries(RULES)) for (const x of read(s)) found.push(`${seed} · ${rule} · ${x}`);
    });
    expectNoSeedFailures(failures, 'every census town is born and read');
    expect(found).toEqual([]);
  }, 1_800_000);

  // (b) each rule read blind, in the census town that showed it at 600b7683a (the second check's row of its kind)
  const CONTROLS = [
    ['r2r-town-49', 'gapInstances'], // the wool's gap named "Fulling mill" beside a Fuller (fact (a))
    ['r2r-town-39', 'gapInstances'], // the hides' gap named "Leatherworkers' guild" beside a Cobbler's guild
    ['r2r-city-32', 'cardGoodsInstances'], // C37887's form: "Finished clothing · Dyed cloth · Tailored garments" beside "Partial · Wool"
    // RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): the birth now brings grapes in for r2r-city-21's vintner (a connected road
    // no siege shuts: `resourceGenerator.js :: importsBroughtAtBirth`), so its need is met; the same vintner, grapes needed
    // and not brought in, stands in r2r-metropolis-54, a calm town of the 720 on no road.
    ['r2r-metropolis-54', 'idleCraftInstances'], // C31652's form: the vintner, grapes needed and not brought in (fact (b))
    ['r2s-plague_onset-city-1', 'stoppedCardInstances'], // C3874's form: an escort on a working card under the outbreak (CC1 (i))
    ['r2s-under_siege-hamlet-0', 'stoppedCardInstances'], // C17893: "Faith & Worship ✓ Running" over a shrine whose every service is stopped (CC1 (ii))
  ];
  test('(b) THE POSITIVE CONTROL: each rule read blind finds its instance in its town (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, rule]) => {
      const read = /** @type {(s: any, blind?: boolean) => string[]} */ (RULES[/** @type {keyof typeof RULES} */ (rule)]);
      expect(read(town(seed), true).length, `${seed}: ${rule} read blind finds its instance`).toBeGreaterThan(0);
    }), '(b) every positive control fires');
  }, 900_000);
});
