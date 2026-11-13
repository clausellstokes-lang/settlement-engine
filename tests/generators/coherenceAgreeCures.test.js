/**
 * coherenceAgreeCures.test.js — COHERENCE-AGREE's cures, one pin each (the chair's charter of
 * 2026-11-11, §2): the town's own drawn facts override a terrain table, and a fact has one reader.
 * Each describe block was red at the lane's base (99bcc6944) and turns green with its own commit.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { foodLandOf } from '../../src/generators/foodLand.js';
import { getInstFlags } from '../../src/generators/helpers.js';
import { institutionsPoolKey } from '../../src/domain/display/stateProse/generalStateProse.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('cure 1: the critical imports never deny a live local resource', () => {
  test('"metals" is not a critical import beside live iron; it is with no metal at all', () => {
    expect(generateResourceAnalysis('plains', ['iron_deposits', 'iron', 'metalwork'], [], []).imports.critical).not.toContain('metals'); // anchored: the next line holds metals present for a town with no metal
    expect(generateResourceAnalysis('plains', ['gems'], [], []).imports.critical).toContain('metals');
  });
  test('"Charcoal and fuel" is not a critical import beside peat or coal', () => {
    expect(generateResourceAnalysis('mountain', ['marshlands', 'peat'], [], []).imports.critical).not.toContain('Charcoal and fuel'); // anchored: the third line below holds the import present with no fuel
    expect(generateResourceAnalysis('mountain', ['coal_deposits', 'coal'], [], []).imports.critical).not.toContain('Charcoal and fuel'); // anchored: the next line holds the import present with no fuel
    expect(generateResourceAnalysis('mountain', [], [], []).imports.critical).toContain('Charcoal and fuel');
  });
});

describe('cure 2: the strengths and the strategic line are the town\'s', () => {
  test('a plains town with no fields, herds or crossroads claims no plains strength and is no heartland', () => {
    const bare = generateResourceAnalysis('plains', ['honey'], [], [], { tradeRouteAccess: 'road' });
    expect(bare.economicStrengths).toEqual([]);
    expect(bare.strategicValue).toBe('Medium - open country, but exposed to raids');
  });
  test('a strength the town stands on stays, and the route can carry one', () => {
    const fields = generateResourceAnalysis('plains', ['grain_fields', 'grain', 'flour'], [], [], { tradeRouteAccess: 'crossroads' });
    expect(fields.economicStrengths).toEqual(['Grain production', 'Central trade hub']);
    expect(fields.strategicValue).toBe('Medium - agricultural heartland, but exposed to raids');
  });
  test('a forest town with game and no timber provides game', () => {
    expect(generateResourceAnalysis('forest', ['hunting_grounds', 'game meat'], [], []).strategicValue).toBe('Low-Medium - provides game, difficult to besiege');
  });
});

describe('cure 3: the safety writer reads the mercenary fact from the defence home', () => {
  test('a hireling hall beside the town watch is not "a mercenary company provides enforcement"', () => {
    const profile = generateSafetyProfile({ priorityEconomy: 50, priorityMilitary: 50, priorityCriminal: 20 }, 'town',
      [{ name: 'Town watch' }, { name: 'Hireling hall' }, { name: 'Town council' }]);
    expect(profile.guardEffectivenessDesc).not.toMatch(/mercenary compan/i); // anchored: the next line holds the watch named in the same text
    expect(profile.guardEffectivenessDesc).toMatch(/watch/i);
  });
});

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const birth = (seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed });

describe('cure 4: the import list tells the food record\'s story', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('agree-town-0 and agree-town-3 grow nine tenths of their need or more and say how little grain they bring in', () => expectNoSeedFailures(collectSeedFailures(['agree-town-0', 'agree-town-3'], (seed) => {
    const eco = birth(seed).economicState;
    expect(eco.foodSecurity.foodRecord.grownPct).toBeGreaterThanOrEqual(90);
    expect(eco.primaryImports.filter((label) => /^(?:bulk )?grain(?: and foodstuffs)?$/i.test(label))).toEqual([]);
    expect(eco.primaryImports).toContain('Grain (a little, beside its own harvest)');
  }), 'the grain import says how little'));
});

describe('cure 5: the viability hooks open events and do not answer the record otherwise', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('agree-village-28, agree-town-0 and agree-town-3 are at peace and no hook says war took their iron', () => expectNoSeedFailures(collectSeedFailures(['agree-village-28', 'agree-town-0', 'agree-town-3'], (seed) => {
    const hooks = (birth(seed).economicViability?.plotHooks || []).map((h) => h.hook);
    expect(hooks.filter((h) => /\b(?:war|armies)\b/i.test(h))).toEqual([]);
    expect(hooks.some((h) => /\biron\b/i.test(h))).toBe(true);
  }), 'no war hook in peace'));
  test('agree-village-1, agree-village-14 and agree-town-8 have a live material and no hook makes it scarce', () => expectNoSeedFailures(collectSeedFailures(['agree-village-1', 'agree-village-14', 'agree-town-8'], (seed) => {
    const s = birth(seed);
    const live = s.resourceAnalysis.availableResources;
    const scarce = (s.economicViability?.plotHooks || []).map((h) => h.hook).filter((h) => (
      (/\b(?:iron|metal)\b/i.test(h) && live.includes('iron_deposits'))
      || (/\btimber\b/i.test(h) && ['managed_forest', 'mountain_timber', 'shipbuilding_timber', 'timber'].some((k) => live.includes(k)))));
    expect(scarce).toEqual([]);
  }), 'no scarcity of a live material'));
});

describe('cure 6 (the chair\'s food-sources ruling): worked land is a source by its own name', () => {
  const land = (resources, institutions = []) => foodLandOf('town', institutions, { nearbyResources: resources, nearbyResourcesNativeDepleted: [], tradeRouteAccess: 'road', terrainType: 'plains' }, 'road');
  test('available fields are grain and available grazing is livestock, with no farm or pastoral row', () => {
    expect(land(['grain_fields', 'grazing_land']).foodSources).toEqual(['grain', 'livestock']);
  });
  test('naming the source grows nothing: the land\'s capacity is what the institutions make it', () => {
    expect(land(['grain_fields', 'grazing_land']).effectiveAgri).toBe(land([]).effectiveAgri);
  });
  test('hunting grounds stay wild land for a town with no hunters', () => {
    expect(land(['hunting_grounds']).foodSources).toEqual([]);
  });
});

describe('cure 8: the health summary\'s "paid hands" reads the defence home', () => {
  test('a militia and walls are not paid hands; a watch is', () => {
    const inst = { hasMilitaryInst: true };
    expect(institutionsPoolKey(inst, { institutions: [{ name: 'Citizen militia' }, { name: 'Town walls' }] })).not.toBe('GARRISONED');
    expect(institutionsPoolKey(inst, { institutions: [{ name: 'Town watch' }] })).toBe('GARRISONED');
  });
});

describe('cure 9: the flag bag\'s hired company and gate are the defence home\'s answers', () => {
  test('a veteran\'s lodge is not a mercenary company, and a palisade has no gates of record', () => {
    expect(getInstFlags({}, [{ name: "Veteran's lodge" }]).inst.hasMercenary).toBe(false);
    expect(getInstFlags({}, [{ name: 'Palisade or earthworks' }]).inst.hasGates).toBe(false);
    expect(getInstFlags({}, [{ name: 'Mercenary company' }, { name: 'Town walls' }]).inst).toMatchObject({ hasMercenary: true, hasGates: true });
  });
});

/**
 * F9 (COHERENCE-AGREE-3, REVIEW-AGREE): the market's latent second readers re-pointed to the market home —
 * viability.js's city-without-a-market warning and economicState.js's Market Taxes. THE PIN THAT NO PRINTED LINE
 * MOVES: on births across the four browser tiers, the name list each reader kept answers what the home answers
 * (measured on the 2,866-birth L2 corpus at 65ce74ce6: equal on every one), so the re-point is a change of
 * reader, never of answer.
 */
describe('F9: the market readers follow the market home, and no answer moves', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('the old name lists and the home agree on every roster', async () => {
    const { hasMarketInstitution } = await import('../../src/domain/facts/market.js');
    const { nativeSemanticNames } = await import('../../src/domain/content/customContentSemanticAuthority.js');
    const seeds = ['village', 'town', 'city', 'metropolis'].flatMap((tier) => Array.from({ length: 8 }, (_, i) => `agree-${tier}-${i}`));
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const names = nativeSemanticNames(settlement.institutions).map((n) => n.toLowerCase());
      const named = (...kws) => kws.some((kw) => names.some((n) => n.includes(kw)));
      const home = hasMarketInstitution(settlement.institutions);
      expect(named('market', 'merchant', 'district'), `${seed}: the viability reader`).toBe(home);
      if (named('district market', 'multiple market', 'daily market', 'market square', 'weekly market', 'annual fair')) expect(home, `${seed}: a market-tax name`).toBe(true);
    }), 'the market readers agree with the home');
  });
});

/** F13 (COHERENCE-AGREE-3, REVIEW-AGREE): the income lines on the town's own land are declared, keyed by the text the branch prints. */
describe('F13: the income lines are declared where they are printed', () => {
  test('each key is a line economicState.js prints, each atom is declarable, each twin answers its original', async () => {
    const { INCOME_LINE_SIBLINGS, LOCAL_COAL_LINE, GRAIN_SURPLUS_LINE } = await import('../../src/generators/economy/incomeLineSiblings.js');
    const { assertDeclarable } = await import('../../src/domain/facts/factVocabulary.js');
    const { DECLARATION_CHANNELS } = await import('../../scripts/lib/table-pools.mjs');
    expect(Object.keys(INCOME_LINE_SIBLINGS)).toEqual([GRAIN_SURPLUS_LINE, LOCAL_COAL_LINE]);
    expect(DECLARATION_CHANNELS.map((c) => c.name)).toContain('INCOME_LINE_SIBLINGS');
    const { readFileSync } = await import('node:fs');
    const site = readFileSync(new URL('../../src/generators/economy/economicState.js', import.meta.url), 'utf8');
    for (const [key, set] of Object.entries(INCOME_LINE_SIBLINGS)) {
      expect(set[0].text).toBe(key);
      for (const line of set) for (const atom of [...(line.needs || []), ...(line.excludes || [])]) expect(assertDeclarable(atom).dimension, atom).toBeTruthy();
      if (set[1]) expect(set[1].twinOf).toBe(key);
    }
    // the branch prints each by its declared constant, so a reworded line cannot leave its declaration behind
    expect(site).toMatch(/\? GRAIN_SURPLUS_LINE\b/);
    expect(site).toMatch(/\? LOCAL_COAL_LINE\b/);
    // anchored: the same source text matched the branch's LOCAL_COAL_LINE on the line above
    expect(site).not.toContain('Local coal fires the forges');
  });
});

/**
 * STOP 2 (b) (COHERENCE-AGREE-3, the chair's ruling, 2026-11-12): the Court Fees and Gate Tolls lines read the
 * defence home's narrower facts (`hasCourthouse`, `hasTollGate`), whose names moved there from the economy's own
 * lists. THE PIN THAT NO PRINTED LINE MOVES: on births across the four browser tiers each old list answers what
 * the home answers, and the record's two income lines stand exactly where the home says.
 */
describe('STOP 2 (b): Court Fees and Gate Tolls read the home, and no answer moves', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('the old lists, the home and the printed lines agree on every roster', async () => {
    const { defenseFactsOf } = await import('../../src/domain/defense/defenseFacts.js');
    const { nativeSemanticNames } = await import('../../src/domain/content/customContentSemanticAuthority.js');
    const seeds = ['village', 'town', 'city', 'metropolis'].flatMap((tier) => Array.from({ length: 8 }, (_, i) => `agree-${tier}-${i}`));
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const names = nativeSemanticNames(settlement.institutions).map((n) => n.toLowerCase());
      const named = (...kws) => kws.some((kw) => names.some((n) => n.includes(kw)));
      const home = defenseFactsOf(settlement);
      expect(named('courthouse', 'multiple court', 'city hall'), `${seed}: the court-fee list`).toBe(home.hasCourthouse);
      expect(named('gate', 'town wall', 'city wall'), `${seed}: the gate-toll list`).toBe(home.hasTollGate);
      const income = settlement.economicState.incomeSources.map((e) => e.source);
      expect(income.includes('Court Fees & Fines'), `${seed}: Court Fees where the home keeps a courthouse`).toBe(home.hasCourthouse);
      if (income.includes('Gate Tolls')) expect(home.hasTollGate, `${seed}: Gate Tolls only at a toll gate`).toBe(true);
    }), 'Court Fees and Gate Tolls agree with the home');
  });
});

/**
 * ITEM 1 (a) (COHERENCE-AGREE-4, 2026-11-12): the theocratic economic-situation line and its no-market twin name
 * the church, so each declares the sacred house beside the market it needs or refuses. The branch fires only beside
 * a cathedral or a monastery (`priorityHelpers.js :: theocraticEconomy`), so the declaration is true wherever the
 * line prints and the resolution answers as before: with a sacred house the pair resolves on the market alone.
 */
describe('item 1 (a): the theocratic pair declares the church it names', () => {
  test('the line and its twin both need the sacred house; the twin still refuses the market', async () => {
    const { PROSPERITY_LINE_SIBLINGS } = await import('../../src/generators/economy/prosperity.js');
    const { resolveSibling } = await import('../../src/domain/facts/drawDeclared.js');
    const key = Object.keys(PROSPERITY_LINE_SIBLINGS).find((k) => k.startsWith('The church controls'));
    const [line, twin] = PROSPERITY_LINE_SIBLINGS[key];
    expect(line.needs).toEqual(['market', 'sacredHouse']);
    expect(twin.needs).toEqual(['sacredHouse']);
    expect(twin.excludes).toEqual(['market']);
    const opts = (facts) => ({ facts, poolId: 'test:theocratic', surface: 'economics', drawKind: 'T' });
    expect(resolveSibling(key, PROSPERITY_LINE_SIBLINGS, opts({ market: true, sacredHouse: true }))).toBe(line.text);
    expect(resolveSibling(key, PROSPERITY_LINE_SIBLINGS, opts({ market: false, sacredHouse: true }))).toBe(twin.text);
  });
});

/**
 * ITEM 2 (COHERENCE-AGREE-4, the chair's ruling on the third seat's STOP 3): the vocabulary gains `court` and
 * `prison`, each the defence home's own atom (`defence.js :: court`, `prison`), so a line that names a court and
 * no prison can declare both. THE PIN THAT NO ANSWER MOVES: the home's prison, read off the live roster, answers
 * what the safety writer's own list (`priorityHelpers.js :: hasPrison`) answers on every roster.
 */
describe('item 2: the court and the prison are the defence home\'s atoms', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('both are declarable presence atoms homed on the defence record, and read it', async () => {
    const { assertDeclarable, atomHolds, FACT_DIMENSIONS } = await import('../../src/domain/facts/factVocabulary.js');
    for (const atom of ['court', 'prison']) {
      expect(assertDeclarable(atom).dimension).toBe(atom);
      expect(FACT_DIMENSIONS[atom].home).toBe('defence');
    }
    expect(atomHolds('court', { defence: { court: true, prison: false } })).toBe(true);
    expect(atomHolds('prison', { defence: { court: true, prison: false } })).toBe(false);
  });
  test('the home\'s prison answers what the safety writer\'s list answers, on every roster', async () => {
    const { defenseFactsOf } = await import('../../src/domain/defense/defenseFacts.js');
    const { defenceOf } = await import('../../src/domain/facts/defence.js');
    const seeds = ['village', 'town', 'city', 'metropolis'].flatMap((tier) => Array.from({ length: 8 }, (_, i) => `agree-${tier}-${i}`));
    let held = 0;
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const home = defenseFactsOf(settlement);
      expect(home.hasPrison, `${seed}: the prison`).toBe(getInstFlags({}, settlement.institutions).inst.hasPrison);
      expect(defenceOf(settlement).prison).toBe(home.hasPrison);
      if (home.hasPrison) held += 1;
    }), 'the prison has one answer');
    expect(held).toBeGreaterThan(0);
  });
});

/**
 * ITEM 2 (ii) (COHERENCE-AGREE-4): cure 11's three crime lines for a court with no prison are declared where they
 * are printed — each a declared cell needing the court and refusing the prison, the two facts its branch reads
 * (`inst.hasCourtSystem && !inst.hasPrison`). Text unchanged: the cell gives back its text.
 */
describe('item 2 (ii): the court-without-prison crime lines declare both facts', () => {
  test('each " With nowhere to hold the guilty, …" line is a cell that needs the court and excludes the prison', async () => {
    const { readFileSync } = await import('node:fs');
    const { assertDeclarable } = await import('../../src/domain/facts/factVocabulary.js');
    const site = readFileSync(new URL('../../src/generators/safetyProfile.js', import.meta.url), 'utf8');
    const said = [...site.matchAll(/' With nowhere to hold the guilty, [^']*'/g)].map((m) => m[0]);
    const declared = [...site.matchAll(/lineText\(\{ text: (' With nowhere to hold the guilty, [^']*'), needs: \['court'\], excludes: \['prison'\] \}\)/g)].map((m) => m[1]);
    expect(said).toHaveLength(3);
    expect(declared).toEqual(said);
    for (const atom of ['court', 'prison']) expect(assertDeclarable(atom).dimension).toBe(atom);
  });
});

/**
 * ITEM 3′ (i) (COHERENCE-AGREE-4, the chair's ruling of 2026-11-12): whether a chain yields its table's outputs is
 * ONE predicate in a leaf (`domain/chainYield.js :: chainYieldRefused`), read by the exporter and by every page that
 * prints a town's chain outputs. Lifting it moves nothing (field diff, 0 leaves over L2 + the golden's 525).
 */
describe('item 3′ (i): the exporter\'s refusal is the leaf\'s', () => {
  test('impaired, or a depleted input, is refused; the record\'s condition answers first', async () => {
    const { chainYieldRefused } = await import('../../src/domain/chainYield.js');
    expect(chainYieldRefused({ status: 'impaired', resourceInputCondition: 'available' })).toBe(true);
    expect(chainYieldRefused({ status: 'vulnerable', resourceInputCondition: 'depleted' })).toBe(true);
    expect(chainYieldRefused({ status: 'vulnerable', resourceInputCondition: 'available', resourceDepleted: true })).toBe(false);
    expect(chainYieldRefused({ status: 'running', resourceDepleted: true })).toBe(true);
    expect(chainYieldRefused({ status: 'running', resource: 'Fertile Floodplain' }, (r) => r === 'Fertile Floodplain')).toBe(true);
    expect(chainYieldRefused({ status: 'running', resource: 'Fertile Floodplain' })).toBe(false);
    expect(chainYieldRefused(null)).toBe(false);
  });
  test('the exporter reads the leaf, and keeps no private refusal of its own', async () => {
    const { readFileSync } = await import('node:fs');
    const site = readFileSync(new URL('../../src/generators/computeActiveChains.js', import.meta.url), 'utf8');
    // re-keyed by identity (COHERENCE-AGREE-6, F2): the one import from the leaf also names the leaf's goods set
    expect(site).toMatch(/import \{ chainYieldRefused, goodsOnlyRefusedChainsMake \} from '\.\.\/domain\/chainYield\.js';/);
    expect(site).toMatch(/\.filter\(ch => ch\.exportable && !chainYieldRefused\(ch, isDepletedResource\)\)/);
    // anchored: the same source text matched the exporter's filter on the line above
    expect(site).not.toMatch(/chainIsDepleted/);
  });
});

/**
 * A′'S SLOT REFILLED (COHERENCE-AGREE-4, the chair's ruling of 2026-11-12): a rolled winner the access refuses (the
 * crossroads position on a road) leaves no slot empty. Its slot takes another admissible member by a hash, with no
 * further roll. Each seed below rolled the position on a road at the bottom of its size's range, so the dropped slot
 * left it below the range; now it holds a full roll, and never the position.
 */
describe('A′ refilled: a refused winner does not leave a holder below its size\'s range', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const MIN = { village: 3, town: 4, city: 5, metropolis: 6 };
  test('road holders at the bottom of their range keep a full roll, with no crossroads position', () => {
    const seeds = ['agree-village-2', 'agree-village-27', 'agree-village-39', 'agree-town-16', 'agree-town-48', 'agree-city-12', 'agree-city-20', 'agree-metropolis-1', 'agree-metropolis-10'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const roster = settlement.config.nearbyResources;
      expect(settlement.config.tradeRouteAccess, seed).toBe('road');
      expect(roster.length, `${seed}: ${roster.join(', ')}`).toBeGreaterThanOrEqual(MIN[seed.split('-')[1]]);
      // anchored: the roster was just held at or above its size's minimum, so it cannot be empty
      expect(roster, seed).not.toContain('crossroads_position');
      expect(new Set(roster).size, seed).toBe(roster.length);
    }), 'a refused winner leaves no holder short');
  });
});

/**
 * ITEM 3′ (ii), THE GUARD (COHERENCE-AGREE-4): every file under src/components and src/pdf that prints a chain's
 * table outputs reads the one predicate (`domain/chainYield.js`), so a sixth reader cannot appear unseen. Exempt by
 * name, each with its reason.
 */
describe('item 3′ (ii): every page that prints a chain\'s outputs reads the leaf', () => {
  test('the readers of chain outputs under src/components and src/pdf import chainYieldRefused, or are exempt by name', async () => {
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const root = new URL('../..', import.meta.url).pathname;
    const EXEMPT = {
      'src/components/new/SupplyChainsPanel.jsx': 'the Compendium\'s ChainRow (mounted only by compendium/SupplyChainsManager.jsx): a discovered or custom chain in the abstract, no town and no status',
      'src/pdf/lib/customSupplyChains.js': 'the custom chains\' view-model: user-confirmed chains outside the exporter, with their own activation state',
      'src/pdf/lib/viewModelBodySlices.js': 'a projection, not a page: its chain rows are printed by EconomicsTrade.jsx, which reads the leaf',
    };
    const files = [];
    const walk = (rel) => {
      for (const e of readdirSync(join(root, rel)).sort()) {
        const p = `${rel}/${e}`;
        if (statSync(join(root, p)).isDirectory()) walk(p);
        else if (/\.(?:js|jsx|mjs)$/.test(e)) files.push(p);
      }
    };
    walk('src/components'); walk('src/pdf');
    const readers = files.filter((f) => /\b(?:chain|c)\??\.outputs\b/.test(readFileSync(join(root, f), 'utf8')));
    expect(readers.length).toBeGreaterThanOrEqual(4);
    const unread = readers.filter((f) => !(f in EXEMPT) && !/import \{[^}]*\bchainYieldRefused\b[^}]*\} from '[./]+\/domain\/chainYield\.js';/.test(readFileSync(join(root, f), 'utf8')));
    expect(unread, 'a page prints a chain\'s outputs without the leaf').toEqual([]);
    expect(Object.keys(EXEMPT).filter((f) => !readers.includes(f)), 'a stale exemption').toEqual([]);
  });
});

/**
 * F2 (COHERENCE-AGREE-6, the chair's ruling of 2026-11-12): `domain/chainYield.js` is the one home of "does this chain
 * yield now". A good only refused chains make (no yielding chain makes it) is not exported and is not produced
 * locally: the export bonus (`economy/finishedGoodsDemand.js`), the land's raw goods
 * (`computeActiveChains.js :: deriveExportsFromChains`) and "Produced locally"
 * (`computeActiveChains.js :: deriveLocalProductionFromChains`) all ask the leaf. Each seed below sold or listed such
 * a good at 8866a0ddd (REVIEW-AGREE-2's F2: Quality tools and weapons beside two impaired iron cards; Processed
 * textiles beside an impaired Textiles & Cloth card).
 */
describe('F2: a good only refused chains make is neither sold nor produced locally', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test("the leaf: a refused chain's output that a yielding chain also makes is not refused-only", async () => {
    const { goodsOnlyRefusedChainsMake } = await import('../../src/domain/chainYield.js');
    const only = goodsOnlyRefusedChainsMake([
      { status: 'impaired', outputs: ['Quality tools and weapons', 'Charcoal'] },
      { status: 'running', resourceInputCondition: 'available', outputs: ['Charcoal'] },
      { status: 'vulnerable', resourceInputCondition: 'depleted', outputs: ['Processed textiles'] },
    ]);
    expect([...only].sort()).toEqual(['processed textiles', 'quality tools and weapons']);
    expect(goodsOnlyRefusedChainsMake(null).size).toBe(0);
  });
  const SUFFIX = / \((?:transit|naval route only|taxed by occupation)\)$/;
  // agree-village-32: the entrepôt branch sent a depleted salt chain's "Preserved foods (transit)"
  test('r2read-city-4, r2r-city-42, r2r-city-6 and agree-village-32 sell and list no good only refused chains make', async () => {
    const { goodsOnlyRefusedChainsMake } = await import('../../src/domain/chainYield.js');
    expectNoSeedFailures(collectSeedFailures(['r2read-city-4', 'r2r-city-42', 'r2r-city-6', 'agree-village-32'], (seed) => {
      const eco = birth(seed).economicState;
      const only = goodsOnlyRefusedChainsMake(eco.activeChains);
      expect(only.size, `${seed}: anchored — the seed holds a good only a refused chain makes`).toBeGreaterThan(0);
      const sold = eco.primaryExports.filter((e) => only.has(e.replace(SUFFIX, '').toLowerCase()));
      const local = eco.localProduction.filter((e) => only.has(e.toLowerCase()));
      expect({ sold, local }, seed).toEqual({ sold: [], local: [] });
    }), "a refused chain's good stands on a trade list");
  });
});

/**
 * F2'S FIFTH WRITER (COHERENCE-AGREE-8, REVIEW-AGREE-3 FINDING 2): the institutional services
 * (`computeActiveChains.js :: deriveServiceExports`, from `INSTITUTIONAL_SERVICE_MAP`) exported "Financial services
 * (letters of credit)" from a banking house whatever its chain's state, beside an impaired "Letters of Credit &
 * Finance" card that reads "Normally yields: Financial services". It now reads the refusal as the other four writers
 * do (the leaf's goods set): a service whose good only a refused chain makes is not exported. Each seed below listed
 * it at faa20bc6c (14 of the lane's 4,141, 9 of them besieged).
 */
describe('F2\'s fifth writer: a service only a refused chain yields is not exported', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const born = (/** @type {string} */ seed) => {
    const m = /^(?:l2|r2s)-(under_siege|famine|wartime)-(\w+)-\d+$/.exec(seed);
    const settType = m ? m[2] : seed.split('-')[1];
    const forced = m ? { selectedStresses: [m[1]], selectedStressesRandom: false } : {};
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType, ...forced }), null, { seed, customContent: {} });
  };
  test('r2r-metropolis-14, r2s-under_siege-metropolis-1, l2-under_siege-city-7 and rvw12-city-97 export no letters of credit beside an impaired bank', async () => {
    const { goodsOnlyRefusedChainsMake } = await import('../../src/domain/chainYield.js');
    expectNoSeedFailures(collectSeedFailures(['r2r-metropolis-14', 'r2s-under_siege-metropolis-1', 'l2-under_siege-city-7', 'rvw12-city-97'], (seed) => {
      const eco = born(seed).economicState;
      // anchored: the bank's chain is refused here and its good is one only a refused chain makes
      expect(goodsOnlyRefusedChainsMake(eco.activeChains).has('financial services'), `${seed}: anchored`).toBe(true);
      expect(eco.primaryExports.filter((e) => /^Financial services/.test(e)), seed).toEqual([]);
    }), 'a refused chain\'s service stands on the export list');
  });
});

/**
 * THE COAL LINE (COHERENCE-AGREE-8, REVIEW-AGREE-3 FINDING 3 / T3): "Local coal fires the forges, but the iron is
 * bought in" is the lane's own sentence (cure 7, `incomeLineSiblings.js :: LOCAL_COAL_LINE`), and it printed in towns
 * whose roster holds no smith, forge, foundry, smelter, metalworker, armourer or weaponsmith. Where a forge house
 * stands it is true; where none does, its declared sibling says what is: the coal is sold to other towns' forges.
 * Each seed below printed it with no forge house at faa20bc6c (census 720).
 */
describe('the coal line: coal fires the forges only where a forge house stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const FORGE = /smith|forge|foundr|smelt|metal|armou?r|weapon/i;
  const born = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  test('r2r-thorp-2, r2r-village-6 and r2r-thorp-16 hold coal and no forge house, and no line says coal fires the forges', async () => {
    const { LOCAL_COAL_LINE, LOCAL_COAL_SOLD_LINE } = await import('../../src/generators/economy/incomeLineSiblings.js');
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-2', 'r2r-village-6', 'r2r-thorp-16'], (seed) => {
      const s = born(seed);
      expect(s.institutions.filter((i) => FORGE.test(String(i.name))), `${seed}: anchored, no forge house`).toEqual([]);
      const metal = s.economicState.incomeSources.find((e) => e.source === 'Iron & Metalwork');
      expect(metal?.desc, seed).toBe(LOCAL_COAL_SOLD_LINE);
      expect(metal?.desc).not.toBe(LOCAL_COAL_LINE);
    }), 'COAL-LINE-NO-FORGE-HOUSE');
  });
  test('the sibling is declared beside the line, keyed by its text', async () => {
    const { INCOME_LINE_SIBLINGS, LOCAL_COAL_LINE, LOCAL_COAL_SOLD_LINE } = await import('../../src/generators/economy/incomeLineSiblings.js');
    expect(INCOME_LINE_SIBLINGS[LOCAL_COAL_LINE].map((v) => v.text)).toEqual([LOCAL_COAL_LINE, LOCAL_COAL_SOLD_LINE]);
  });
});

/**
 * THE GATE TALLY (COHERENCE-AGREE-8, REVIEW-AGREE-3 FINDING 4 / T5): in a walled town with no gate of record the
 * lane's Services twin says "The walls leave few ways in", and Defense still said "{settlement} is walled, and every
 * arrival goes through a gate and into the gate tally" (`walls PRESENT` vid 2, marked `colour`, so the gate atom did
 * not gate it; census 720: both on one page in 22 towns, 0 on the line). The variant names a gate, so it carries the
 * `gate` mark (the pools' source, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, regenerated); the palisade's card and
 * its line still say the town is walled.
 */
describe('the gate tally is not said where no gate stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const born = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  test('r2r-village-6 and r2r-hamlet-18 are walled with no gate: the fortification line names no gate beside the twin', async () => {
    const { defenseForcesProse } = await import('../../src/domain/display/stateProse/defenseStateProse.js');
    const { factsOf } = await import('../../src/domain/facts/factsOf.js');
    expectNoSeedFailures(collectSeedFailures(['r2r-village-6', 'r2r-hamlet-18'], (seed) => {
      const s = born(seed);
      const d = factsOf(s).defence;
      expect([d?.walls, d?.gate], `${seed}: anchored, walled with no gate`).toEqual([true, false]);
      expect(String(s.economicState.safetyProfile.safetyDesc || '') + String(s.economicState.safetyProfile.guardEffectivenessDesc || ''), `${seed}: anchored, the twin speaks`).toMatch(/The walls leave few ways in/);
      // anchored: the same town is walled and its twin speaks (both held just above), so the line is read where it can speak
      expect(String(defenseForcesProse(s).fortification?.sentence || ''), seed).not.toMatch(/\bgates?\b/i);
    }), 'a gate is named where none stands');
  });
  test('every dossier prose variant that names a gate carries the gate mark (the gates fixture is keyed on the roster\'s gates)', async () => {
    const { readdirSync } = await import('node:fs');
    const dir = new URL('../../src/data/dossierStateProse/', import.meta.url);
    const unmarked = [];
    let seen = 0;
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.generated.js'))) {
      for (const corpus of Object.values(await import(new URL(f, dir).href))) {
        for (const [block, b] of Object.entries(corpus && typeof corpus === 'object' ? corpus : {})) {
          for (const [pool, variants] of Object.entries(b?.pools || {})) {
            for (const v of Array.isArray(variants) ? variants : []) {
              if (!/\bgates?\b/i.test(String(v?.text || ''))) continue;
              seen++;
              if (pool !== 'FIXTURE: gates' && !(v.marks || []).includes('gate')) unmarked.push(`${block} ${pool} vid ${v.vid}`);
            }
          }
        }
      }
    }
    expect(seen, 'anti-vacuity: the corpus names gates').toBeGreaterThanOrEqual(8);
    expect(unmarked).toEqual([]);
  });
});

/**
 * AGRICULTURE, WHERE THE TOWN LIVES BY IT (COHERENCE-AGREE-8, REVIEW-AGREE-3 FINDING 5 / T6). Cure 2 (72481b477, "the
 * economic strengths and the strategic line are the town's, not the terrain's") keeps a terrain strength only on the
 * town's own resource or route (`resourceGenerator.js :: STRENGTH_SUPPORT`); Agriculture stood only on grain fields, a
 * floodplain or grazing land, so 80 of the census's 720 lost it, 38 of them earning Agricultural Rents from tenant
 * farmers (r2r-village-35: 92% of its income). Agriculture now also stands on the town's own record of farming: an
 * Agricultural Rents income, or the food record's grain chain. A town that only fishes still does not claim it.
 */
describe('Agriculture: what the land offers, where the town farms it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const born = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  test('r2r-village-35 and r2r-hamlet-44 live on tenant farming and offer Agriculture; r2r-town-26 farms its grain', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-village-35', 'r2r-hamlet-44', 'r2r-town-26'], (seed) => {
      const s = born(seed);
      const rents = s.economicState.incomeSources.some((e) => e.source === 'Agricultural Rents');
      const grain = (s.economicState.foodSecurity.activeChains || []).includes('Grain & agriculture');
      expect(rents || grain, `${seed}: anchored, the record farms`).toBe(true);
      expect(s.resourceAnalysis.economicStrengths, seed).toContain('Agriculture');
    }), 'a farming town\'s land does not offer Agriculture');
  });
  test('twin: r2r-town-38 fishes and earns no rents, and its land still does not offer Agriculture', () => {
    const s = born('r2r-town-38');
    expect(s.economicState.incomeSources.some((e) => e.source === 'Agricultural Rents')).toBe(false);
    // anchored: the food record's chains are read for the grain chain the positive arm above finds in r2r-town-26
    expect(s.economicState.foodSecurity.activeChains || []).not.toContain('Grain & agriculture');
    // anchored: the same strengths list carries Agriculture in the farming towns of the arm above
    expect(s.resourceAnalysis.economicStrengths).not.toContain('Agriculture');
  });
});

/**
 * THE FELLING LINE, AN ORIGIN (COHERENCE-AGREE-8, REVIEW-AGREE-3 FINDING 3 / T2): cure 7 widened the Timber Trade
 * line's gate from a managed or shipbuilding forest to any timber (`hasNearbyResource('managed_forest', 'timber')`,
 * whose substring takes `mountain_timber`), so a town whose wild mountain stand nobody works, and whose resources the
 * lane did not change, turned from "Timber sourced from more distant forests" (the line's) to "managed felling and
 * sawmilling keep production consistent" beside "No one here works the timber". The felling line now stands on a
 * managed or shipbuilding forest, as before the lane, or on a wild stand a wood house works; otherwise the line's own.
 * The six towns below never held a pass and entered the census row at faa20bc6c.
 */
describe('the felling line: a wild stand is felled and sawn only where a wood house works it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const born = (/** @type {string} */ seed) => {
    const m = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m ? m[2] : seed.split('-')[1], ...(m ? { selectedStresses: [m[1]], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
  };
  test('r2r-thorp-32, -47, r2r-town-12, -30, r2r-city-46 and r2s-religious_conversion-thorp-1: mountain timber, no wood house, no felling line', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-32', 'r2r-thorp-47', 'r2r-town-12', 'r2r-town-30', 'r2r-city-46', 'r2s-religious_conversion-thorp-1'], (seed) => {
      const s = born(seed);
      expect(s.config.nearbyResources.filter((r) => /timber|forest/.test(r)), `${seed}: anchored, a wild stand only`).toEqual(['mountain_timber']);
      expect(s.institutions.filter((i) => /sawmill|lumber|timber|carpent|wood|forest/i.test(String(i.name))), `${seed}: anchored, no wood house`).toEqual([]);
      const timber = s.economicState.incomeSources.find((e) => e.source === 'Timber Trade');
      expect(timber?.desc, seed).toBe('Timber sourced from more distant forests and resold or processed locally: trade route dependent.');
    }), 'a stand nobody works is felled and sawn');
  });
});

/**
 * F8 (ii) (COHERENCE-AGREE-6, the chair's ruling of 2026-11-12): the flag bag's prison and hospital are the defence
 * home's answers (`defenseFactsOf`), off the live roster: the lane's own two private readers in
 * `priorityHelpers.js :: getInstitutionNames`, cured rather than banked when the walker learned the four atoms.
 */
describe('F8 (ii): the flag bag reads the prison and the hospital from the defence home', () => {
  test('a ruined prison holds no one; a gaol does', () => {
    expect(getInstFlags({}, [{ name: 'Large prison', status: 'ruined' }]).inst.hasPrison).toBe(false);
    expect(getInstFlags({}, [{ name: 'Village gaol' }]).inst.hasPrison).toBe(true);
    expect(getInstFlags({}, [{ name: 'Large prison' }]).inst.hasPrison).toBe(true);
  });
  // COHERENCE-AGREE-7 (P1): the hospital flag is the home's hospital OR healer. The old list read "monastery" as a
  // substring, so the catalogue's plural rows ("Multiple monasteries", "Major monasteries (5-10)") tended no one
  // (176 of the lane's 4,141 births), and a ruined hospital still did.
  test('a house of many monasteries tends the sick; a ruined hospital does not', () => {
    expect(getInstFlags({}, [{ name: 'Multiple monasteries' }]).inst.hasHospital).toBe(true);
    expect(getInstFlags({}, [{ name: 'Major monasteries (5-10)' }]).inst.hasHospital).toBe(true);
    expect(getInstFlags({}, [{ name: 'Hospital', status: 'ruined' }]).inst.hasHospital).toBe(false);
    expect(getInstFlags({}, [{ name: 'Hospital' }]).inst.hasHospital).toBe(true);
    expect(getInstFlags({}, [{ name: 'Healer' }]).inst.hasHospital).toBe(true);
    expect(getInstFlags({}, [{ name: 'Parish church' }]).inst.hasHospital).toBe(false);
  });
});

/**
 * F5 (a) (COHERENCE-AGREE-6, REVIEW-AGREE-2; the chair's ruling of 2026-11-12): ONE HOME FOR WHICH TERRAIN HOLDS A
 * PASS. "Mountain Pass" (`defended_pass`) named no terrain, so the roll gave it anywhere. Its own row now says the
 * terrain it requires (`requiresTerrain`, a key the roll's pool filter does not read), and agrees with the geography
 * table, which lists it under the mountains alone.
 */
describe('F5 (a): the mountain pass says the terrain it requires, and the geography table agrees', () => {
  test('RESOURCE_DATA.defended_pass.requiresTerrain is the terrains whose allowed resources list it', async () => {
    const { RESOURCE_DATA } = await import('../../src/data/resourceData.js');
    const { TERRAIN_DATA } = await import('../../src/data/geographyData.js');
    const listing = Object.entries(TERRAIN_DATA).filter(([, t]) => (t.allowedResources || []).includes('defended_pass')).map(([k]) => k).sort();
    expect(listing).toEqual(['mountain']);
    expect([...(RESOURCE_DATA.defended_pass.requiresTerrain || [])].sort()).toEqual(listing);
    // the pool filter reads `terrain`; the pass keeps none, so the pool is what it was
    expect(RESOURCE_DATA.defended_pass.terrain).toBeUndefined();
  });
});

/**
 * F5 (d) (COHERENCE-AGREE-6): the wizard reads the pass's own row, as it reads `requires` for the crossroads. Off the
 * mountains the pass is not OFFERED, says why, and may still be forced; the random roll's pool (`compatible`) is
 * unchanged.
 */
describe('F5 (d): the wizard offers the mountain pass on the mountains only', () => {
  test('hills: compatible (the pool) but not offered, with the reason; mountain: offered', async () => {
    const { getCompatibleResources } = await import('../../src/domain/resourceTerrainCompatibility.js');
    const pass = (terrain) => getCompatibleResources('road', terrain).find((r) => r.key === 'defended_pass');
    expect(pass('hills')).toMatchObject({ compatible: true, offered: false, incompatibleReason: 'Only available in mountain terrain' });
    expect(pass('mountain')).toMatchObject({ compatible: true, offered: true, incompatibleReason: null });
    // a row with no terrain law keeps its offer
    expect(getCompatibleResources('road', 'hills').find((r) => r.key === 'grain_fields')).toMatchObject({ offered: true });
  });
  // P4 (COHERENCE-AGREE-7, the validator's half, after P2 / F5 (c)): the roll keeps no pass off the mountains, so only a
  // person's forced pass stands there, and the structural validator warns on it as on a forced crossroads, in the
  // wizard's words.
  test('the validator warns on a pass forced off the mountains, in the wizard\'s words; on the mountains it does not', async () => {
    const { checkStructuralValidity } = await import('../../src/generators/structuralValidator.js');
    const warned = (terrainType) => checkStructuralValidity([], { tier: 'village', tradeRouteAccess: 'road', terrainType,
      nearbyResources: ['defended_pass', 'grain_fields'] }).violations.filter((v) => v.type === 'resource_access_violation');
    expect(warned('hills')).toEqual([expect.objectContaining({ institution: 'Mountain Pass', reason: 'Only available in mountain terrain', severity: 'warning' })]);
    expect(warned('mountain')).toEqual([]);
    expect(warned(undefined)).toEqual([]); // anchored: no terrain on the record, no claim either way
  });
});

/**
 * P2's RULE (COHERENCE-AGREE-7, the chair's ruling of 2026-11-12): A REFILLED SLOT TAKES ITS DEPLETION DRAW ONLY WHERE
 * THE REFUSED MEMBER COULD HAVE BEEN DEPLETED. A′'s refill (COHERENCE-AGREE-4) kept the slot's draw, and a crossroads is
 * never randomly depletable, so its replacement could arrive worked out where the roll's own winner never could (125
 * of the lane's 4,141 births; REVIEW-AGREE-2 F5's second effect). Each seed below is a crossroads holder off a
 * crossroads whose replacement arrived depleted at 7cf4f0c2e; it now arrives live. The one food band the rule moved is
 * r2s-under_siege-village-0's (its replacement grain fields arrived live: deficit -> importDependent; (c) re-deals it
 * since, below). REVIEW-AGREE-2 F6's besieged city (r2s-under_siege-city-3) frees its replacement forest too, and its band stays deficit: A′'s
 * re-deal moves it by another path, declared in the draft record.
 */
describe('P2\'s rule: a refilled slot arrives as live as the refused winner would have been', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const FREED = { 'agree-town-100': 'ancient_grove', 'agree-city-20': 'ancient_grove', 'r2r-village-50': 'ancient_grove',
    'r2r-town-47': 'grazing_land', 'r2r-metropolis-27': 'hunting_grounds', 'l2-wartime-metropolis-8': 'grain_fields' };
  test('each replacement is held and not depleted', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(FREED), (seed) => {
      const [, stress, tier] = seed.match(/^l2-(\w+)-(\w+)-\d+$/) ?? [];
      const settlement = stress
        ? generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStressesRandom: false, selectedStresses: [stress] }), null, { seed })
        : birth(seed);
      expect(settlement.config.tradeRouteAccess, seed).not.toBe('crossroads');
      expect(settlement.config.nearbyResources, `anchored: ${seed} holds its replacement`).toContain(FREED[seed]);
      expect(settlement.config.nearbyResourcesDepleted, seed).not.toContain(FREED[seed]); // anchored: the line above holds the key on the roster
    }), 'a refilled slot took a depletion draw its refused member could never take');
  });
  // RE-KEYED BY IDENTITY at P2 / F5 (c) (COHERENCE-AGREE-7): the village also rolled a pass off the mountains. Its pass
  // slot, earlier in the roll, now takes iron, so its crossroads slot takes marshlands where it took grain fields, and
  // its band reads deficit again by that re-deal (declared with (c)). The rule's claim is unchanged: both
  // replacements arrive live.
  test('the besieged: r2s-under_siege-village-0\'s replacements (iron, marshlands) arrive live', () => {
    const besieged = (seed, tier) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier,
      selectedStressesRandom: false, selectedStresses: ['under_siege'] }), null, { seed });
    const village = besieged('r2s-under_siege-village-0', 'village');
    for (const key of ['iron_deposits', 'marshlands']) {
      expect(village.config.nearbyResources).toContain(key); // anchored: the replacement is held
      expect(village.config.nearbyResourcesDepleted).not.toContain(key);
    }
    expect(village.economicState.foodSecurity.foodRecord.band).toBe('deficit');
    const city = besieged('r2s-under_siege-city-3', 'city');
    expect(city.config.nearbyResources).toContain('managed_forest'); // anchored: the replacement is held
    expect(city.config.nearbyResourcesDepleted).not.toContain('managed_forest');
  });
});

/**
 * F5 (b) (COHERENCE-AGREE-6, built; committed by COHERENCE-AGREE-7, as the chair ruled P3): THE REFILL never fills a
 * slot with a member the town's terrain refuses. Each seed below is a crossroads holder off a crossroads whose refused slot the refill gave "Mountain Pass" off the mountains at
 * 8866a0ddd (REVIEW-AGREE-2 F5: 46 of the reviewer's 54); it now holds a full roll with no pass. Over the lane's 4,141
 * births the refill placed 269 passes off the mountains; it now places none.
 */
describe('F5 (b): a refilled slot never takes a member the terrain refuses', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('refilled holders off the mountains hold no mountain pass, and keep their roll\'s size', () => {
    const seeds = ['r2r-thorp-10', 'r2r-hamlet-22', 'agree-village-40', 'agree-town-0', 'agree-city-28', 'r2r-metropolis-2'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const roster = settlement.config.nearbyResources;
      expect(settlement.config.terrainType, seed).not.toBe('mountain');
      expect(roster.length, `anchored: ${seed} holds a roll`).toBeGreaterThan(2);
      // anchored: the roster was just held to carry a full roll, so it is the live roster
      expect(roster, seed).not.toContain('defended_pass');
    }), 'a refilled slot takes a pass off the mountains');
  });
});

/**
 * P2 / F5 (c) (COHERENCE-AGREE-7, the chair's ruling of 2026-11-12): THE BASE ROLL'S PASS OFF ITS TERRAIN. "Mountain Pass"
 * names no `terrain`, so the roll's universal half drew it anywhere (963 of the lane's 4,141 births held one off the
 * mountains after the refill was confined). A rolled winner the record's terrain refuses is refused as one its access
 * refuses (A′), at the same point, and its slot refilled by the same rule; P2's rule (e11750d62) makes the replacement
 * arrive live. Each seed below held a rolled pass off the mountains at df2249ff8; agree-metropolis-33 and
 * rvw12-town-133 are two of the eleven that, built without the rule, were left with nothing live.
 */
describe('P2 / F5 (c): the roll keeps no mountain pass off the mountains', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const CAME = { 'agree-thorp-0': 'ancient_grove', 'r2r-hamlet-14': 'ancient_grove', 'agree-village-25': 'ancient_grove',
    'agree-town-4': 'iron_deposits', 'agree-city-12': 'precious_metals', 'agree-metropolis-16': 'gemstone_deposits',
    'agree-metropolis-33': 'coal_deposits', 'rvw12-town-133': 'ancient_grove' };
  test('each holder holds no pass, and its slot is refilled live', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(CAME), (seed) => {
      const { config } = birth(seed);
      expect(config.terrainType, seed).not.toBe('mountain');
      expect(config.nearbyResources, seed).not.toContain('defended_pass'); // anchored: the next line holds the replacement on this roster
      expect(config.nearbyResources, `anchored: ${seed} holds its replacement`).toContain(CAME[seed]);
      expect(config.nearbyResourcesDepleted, seed).not.toContain(CAME[seed]); // anchored: the line above holds the key on the roster
      expect(config.nearbyResources.filter((key) => !config.nearbyResourcesDepleted.includes(key)).length, `${seed}: something live`).toBeGreaterThan(0);
    }), 'a rolled pass stands off the mountains');
  });
  // The terrain is the record's: on the wizard's "Mountain Pass" route with the terrain left on 'auto' the town stands
  // on the mountains, and its rolled pass is kept (the step's own terrain override is null there).
  test('a village on the Mountain Pass route, terrain auto, stands on the mountains and keeps its rolled pass', () => {
    const settlement = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'village', tradeRouteAccess: 'mountain_pass',
      terrainOverride: 'auto', nearbyResourcesRandom: true }), null, { seed: 'agree7-mp-village-4' });
    expect(settlement.config.terrainType).toBe('mountain');
    expect(settlement.config.nearbyResources).toContain('defended_pass');
  });
});
