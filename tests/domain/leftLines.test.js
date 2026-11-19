/**
 * leftLines.test.js — LEFT-LINES (the sixth chair's round of what earlier seats left by name, 2026-11-17;
 * `docs/chair/2026-11-17/sixth/briefs/BRIEF-LEFT.md` on the chair's lane, section LEFT-LINES). EACH CURED LINE IS
 * ABSENT WHERE ITS PREMISE IS FALSE, AND ITS TWIN STANDS THERE.
 *
 *   L33  one line of it: the brewer's welcoming and transactional presentations (`data/people/titleSecretsPresentations.js`)
 *        hear and sell to taverns, so each needs a tavern-kind house (`institution: tavern`, the existing atom).
 *   L32  DS-GEN-17 ADMINISTERED v4's gaol declares its `prison` (v5 its twin where neither court nor gaol stands);
 *        DS-GEN-13 ENTREPOT v2's "the town" declares its size band (v6 its small-place twin).
 *   L8   the soft food lines: DS-GEN-3 Moderate v3 and Import-Dependent v4 ("eats well") want `food: ≥ secure`; DS-DEF-2
 *        granary-and-parish v1 and DS-ECO-2 well-stocked v5 (food stored, stores deep) want `stores: ≥ 3`; each a twin.
 *   L9   two of its four desk lines that say a force keeps order want `law: > collapsed`, each a twin under the collapsed
 *        law (DS-DEF-2 neither walls nor force v7, DS-DEF-3 Moderate v7; the other two are left by name: their pools sit at
 *        or below the law's layer in `tests/lint/factLayers.poolTable.json`).
 *
 * THE ANCHORS (rule N7 of the brief): the desk lines are read over a CONSTRUCTED record, the facts of one fixed born town
 * on no road with ONE premise atom set each way (a negative beside a positive); the people lines over the census towns
 * that printed them false at the base, each beside a town where the premise holds. Every seed loop collects
 * every failure. THE SHARED PAGE (rule N4): the anchor's record, its public projection and the share veil admit each
 * desk line alike.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';

const DESKS = /** @type {Record<string, any>} */ ({ general: DOSSIER_STATE_PROSE_GENERAL, defense: DOSSIER_STATE_PROSE_DEFENSE, economy: DOSSIER_STATE_PROSE_ECONOMY });

/** the census's own dials (PAGE-COPY `seedcfg.mjs`, the SECOND-WAVE-CENSUS births), so a seed is the town the census read */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** a census seed (`r2r-<tier>-<n>`, `r2s-<crisis>-<tier>-<n>`), born as the census births it */
function bornCensus(/** @type {string} */ seed) {
  const r = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const c = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (!r && !c) throw new Error(`not a census seed: ${seed}`);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (c)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (c)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

/** @type {any} */ let anchor;
/** @type {any} */ let anchorFacts;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  // A town on no road (`isolated`): no seat of this round lifts its marks, and nothing below reads its draw.
  anchor = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'town', tradeRouteAccess: 'isolated', selectedStressesRandom: false, selectedStresses: [] }), null, { seed: 'left-lines-anchor-town', customContent: {} });
  anchorFacts = factsOf(anchor);
});

/** the anchor's facts with the given readings set (a constructed record: one premise atom, each way) */
const over = (/** @type {Record<string, unknown>} */ o) => {
  const f = Object.create(anchorFacts);
  for (const [k, v] of Object.entries(o)) Object.defineProperty(f, k, { value: typeof v === 'function' ? v(anchorFacts) : v });
  return f;
};
const noGranary = (/** @type {any} */ b) => (/** @type {string} */ k) => (k === 'granary' ? false : b.hasInstitution(k));
const defenceWith = (/** @type {boolean} */ prison) => (/** @type {any} */ b) => ({ ...(b.defence || {}), prison });

/** [line, desk, block, pool, the cured vid, its twin's vid, readings where the premise holds, readings where it fails] */
const DESK_LINES = /** @type {Array<[string, string, string, string, number, number, Record<string, unknown>, Record<string, unknown>]>} */ ([
  ['L32 · the gaol', 'general', 'DS-GEN-17', 'ADMINISTERED', 4, 5, { courtSits: false, defence: defenceWith(true) }, { courtSits: false, defence: defenceWith(false) }],
  ['L32 · the entrepot\'s "the town"', 'general', 'DS-GEN-13', 'ENTREPOT', 2, 6, { tier: 'town' }, { tier: 'village' }],
  ['L8 · eats well enough', 'general', 'DS-GEN-3', 'prosperity: Moderate / Modest', 3, 4, { famine: { band: 'secure', shownBand: 'secure' } }, { famine: { band: 'pressured', shownBand: 'pressured' } }],
  // BAR8-DESKS-ECO (item 6, 2026-11-17; READ-LEFT-LINES's MED-2): v4 ("eats well, but on food grown elsewhere") is RETIRED BY
  // NAME (its `food: ≥ secure` is a band this key never holds: dead by construction), and the row is RE-KEYED BY IDENTITY to the
  // pool's surviving line of the same claim, v6 ("eats on food grown elsewhere"), which now declares the food brought in
  // (`food: = importDependent`); its twin v7 says nothing comes in. The positive anchor is a state a birth produces (the key's
  // band with food brought in), the negative the key's band with none (the page prints Deficit: bar0-hamlet-under_siege-rand-34)
  // 2026-11-18 (BAR8-DESKS-2, ruling BR28 (2)): v4 is NOT retired after all: it went back exactly as it stood on the line (law
  // 6; the ledger DS-GEN-3.json names vid 4), never admitted under this key's band. This row stays on v6, the line that speaks.
  // the label re-worded 2026-11-18 (BAR8-DESKS-2, ruling BR28 (4)): it quoted the line (`proseDrawnAnchors.walker`)
  ['L8 · the threshold line, v6', 'general', 'DS-GEN-3', 'foodSecurity.label: Import-Dependent', 6, 7, { famine: { band: 'importDependent', shownBand: 'importDependent' } }, { famine: { band: 'importDependent', shownBand: 'deficit' } }],
  ['L8 · food stored, and clergy', 'defense', 'DS-DEF-2', 'Disasters & Famine: granary AND parish care only', 1, 4, { storesMonths: 5 }, { storesMonths: 1.5 }],
  ['L8 · the stores go in deep', 'economy', 'DS-ECO-2', 'GRANARY: well stocked', 5, 6, { storesMonths: 5, hasInstitution: noGranary }, { storesMonths: 1.5, hasInstitution: noGranary }],
  ['L9 · its watch keeps the peace', 'defense', 'DS-DEF-2', 'Invasion & War: neither walls nor force', 7, 10, { lawBand: 'strained' }, { lawBand: 'collapsed' }],
  ['L9 · people who keep order', 'defense', 'DS-DEF-3', 'Moderate', 7, 8, { lawBand: 'strained' }, { lawBand: 'collapsed' }],
]);

/** @returns {{ line: any, twin: any, admits: (v: any, f: any) => boolean }} */
function deskLine(/** @type {string} */ desk, /** @type {string} */ block, /** @type {string} */ pool, /** @type {number} */ vid, /** @type {number} */ twinVid) {
  const b = DESKS[desk]?.[block];
  const vs = b?.pools?.[pool] || [];
  const scoped = b?.poolMeta?.[pool]?.crisisScoped === true;
  return {
    line: vs.find((/** @type {any} */ v) => v.vid === vid) ?? null,
    twin: vs.find((/** @type {any} */ v) => v.vid === twinVid) ?? null,
    admits: (v, f) => declarationAdmits(variantFactDeclaration(v), f, { crisisScoped: scoped }).admitted,
  };
}

describe('LEFT-LINES · the desk lines (L32, L8, L9): absent where the premise is false, the twin there', () => {
  it('where the premise fails the line is refused and its twin admitted; where it holds, the line and not the twin (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(DESK_LINES, ([name, desk, block, pool, vid, twinVid, yes, no]) => {
      const { line, twin, admits } = deskLine(desk, block, pool, vid, twinVid);
      expect(line, `${name}: ${block} ${pool} v${vid}`).toBeTruthy();
      expect(twin, `${name}: ${block} ${pool} has its twin v${twinVid}`).toBeTruthy();
      expect(admits(line, over(no)), `${name}: v${vid} where its premise is false`).toBe(false);
      expect(admits(twin, over(no)), `${name}: the twin v${twinVid} where the premise is false`).toBe(true);
      expect(admits(line, over(yes)), `${name}: v${vid} where its premise holds (the positive anchor)`).toBe(true);
      expect(admits(twin, over(yes)), `${name}: the twin v${twinVid} where the premise holds`).toBe(false);
    }), 'each cured desk line and its twin');
  });

  it('THE SHARED PAGE (N4): the record, its public projection and the share veil admit each line and twin alike (every row)', () => {
    const forms = [['record', anchor], ['public', toPublicSafe(structuredClone(anchor))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(anchor)), null)]];
    const F = forms.map(([n, r]) => [n, factsOf(r)]);
    expectNoSeedFailures(collectSeedFailures(DESK_LINES, ([name, desk, block, pool, vid, twinVid]) => {
      const { line, twin, admits } = deskLine(desk, block, pool, vid, twinVid);
      expect(twin, `${name}: the twin v${twinVid}`).toBeTruthy();
      const read = (/** @type {any} */ f) => [admits(line, f), admits(twin, f)];
      for (const [n, f] of F.slice(1)) expect(read(f), `${name}: the ${n} form reads as the record does`).toEqual(read(F[0][1]));
    }), 'one reading on all three forms');
  });

  // BAR8-DESKS-ECO (READ-LEFT-LINES's LOW-2, 2026-11-17): the arm above reads only the anchor's own state; this one takes the
  // CONSTRUCTED states of the economy's and the general desk's rows (each premise each way, over each form's own facts), so a
  // reading the projection loses would red here. The defense desk's rows are DESKS-DEF's.
  it('THE SHARED PAGE (N4) over the constructed states: each form admits each economy and general line and twin alike', () => {
    const forms = [['record', anchor], ['public', toPublicSafe(structuredClone(anchor))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(anchor)), null)]];
    const F = forms.map(([n, r]) => [n, factsOf(r)]);
    const overOn = (/** @type {any} */ base, /** @type {Record<string, unknown>} */ o) => {
      const f = Object.create(base);
      for (const [k, v] of Object.entries(o)) Object.defineProperty(f, k, { value: typeof v === 'function' ? v(base) : v });
      return f;
    };
    const mine = DESK_LINES.filter(([, desk]) => desk === 'general' || desk === 'economy');
    expect(mine.length, 'the economy and general rows').toBeGreaterThan(3);
    expectNoSeedFailures(collectSeedFailures(mine, ([name, desk, block, pool, vid, twinVid, yes, no]) => {
      const { line, twin, admits } = deskLine(desk, block, pool, vid, twinVid);
      expect(twin, `${name}: the twin v${twinVid}`).toBeTruthy();
      for (const [state, o] of /** @type {Array<[string, Record<string, unknown>]>} */ ([['premise holds', yes], ['premise fails', no]])) {
        const read = (/** @type {any} */ f) => [admits(line, overOn(f, o)), admits(twin, overOn(f, o))];
        const want = read(F[0][1]);
        expect(want, `${name} (${state}): exactly one of line and twin on the record`).toEqual(state === 'premise holds' ? [true, false] : [false, true]);
        for (const [n, f] of F.slice(1)) expect(read(f), `${name} (${state}): the ${n} form reads as the record does`).toEqual(want);
      }
    }), 'one reading on all three forms, each constructed state');
  });
});

// ---------------------------------------------------------------------------------------------------------------- L33
// The four brewers of the census's 720 that stand with no tavern-kind house (measured at the base e0242a12a: three print
// the welcoming line, r2s-insurgency-village-0 the transactional one), and three that stand beside a tavern and welcome.
const BREWER_FALSE = ['r2r-village-16', 'r2s-monster_pressure-village-1', 'r2s-wartime-village-1', 'r2s-insurgency-village-0'];
const BREWER_TRUE = ['r2r-village-15', 'r2r-village-48', 'r2r-town-0'];

const WELCOMING = 'Smells of malt and hops, round and good-humoured. Offers you a taste before anything else.';
const TRANSACTIONAL = 'Practical, with the red hands of someone who works hot vats all day.';
const CAUTIOUS = 'Watchful around the vats and the store. Keeps the back of the brewery locked.';
const brewers = (/** @type {any} */ s) => (s.npcs || []).filter((/** @type {any} */ c) => c?.title === 'the brewer');

describe('LEFT-LINES · the brewer\'s tavern lines (L33, one line of it)', () => {
  it('a brewer in a town with no tavern-kind house hears no taverns and sells to none: the cautious line (every town)', () => {
    expect(BREWER_FALSE.length, 'the negative anchors are named').toBeGreaterThan(0);
    expectNoSeedFailures(collectSeedFailures(BREWER_FALSE, (seed) => {
      const s = bornCensus(seed);
      expect(declarationAdmits({ needs: ['institution: tavern'], excludes: [], crisis: [] }, factsOf(s)).admitted, `${seed}: no tavern-kind house`).toBe(false);
      const cards = brewers(s);
      expect(cards.length, `${seed}: a brewer`).toBeGreaterThan(0);
      for (const c of cards) {
        expect([WELCOMING, TRANSACTIONAL], `${seed}: the brewer's tavern line`).not.toContain(c.presentation?.impression); // anchored: a literal list built here; the next line pins the impression to the cautious line
        expect(c.presentation?.impression, `${seed}: the cautious line`).toBe(CAUTIOUS);
      }
    }), 'no brewer hears the taverns where none stands');
  });
  it('a brewer where a tavern stands keeps the welcoming line (every town)', () => {
    expect(BREWER_TRUE.length, 'the positive anchors are named').toBeGreaterThan(0);
    expectNoSeedFailures(collectSeedFailures(BREWER_TRUE, (seed) => {
      expect(brewers(bornCensus(seed)).map((c) => c.presentation?.impression), seed).toContain(WELCOMING);
    }), 'the welcoming line stands beside a tavern');
  });
});
