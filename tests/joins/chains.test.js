/**
 * tests/joins/chains.test.js — join harness for the supply-chain data tables
 * (Cohesion Remediation Wave 3: RESOURCE_TO_CHAINS namespaces, orphaned terrain
 * chains, civic/religious/healing chain processors, healing classifier).
 *
 * Every join here is a free-string reference that fails silently at runtime:
 *  - RESOURCE_TO_CHAINS values must be real `${needKey}.${chainId}` composites
 *    (computeActiveChains.js builds the activation set from exactly that form);
 *  - chain processingInstitutions must match a real institutionalCatalog name at
 *    a tier >= the chain's minTier, under the same fuzzy matcher the activation
 *    gate uses, or the chain can never activate;
 *  - every resource-backed chain must appear in the reverse index under the
 *    resource key its label resolves to, or it shows 'operational' instead of
 *    'running' and its outputs never reach localProduction;
 *  - HEALING_INSTITUTION_PATTERN must cover the catalog's medical vocabulary,
 *    or a hospital city reads "no dedicated healing institutions".
 */
import { describe, it, expect } from 'vitest';
import { SUPPLY_CHAIN_NEEDS, RESOURCE_TO_CHAINS } from '../../src/data/supplyChainData.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { computeActiveChains } from '../../src/generators/computeActiveChains.js';
import { healingLedger, HEALING_INSTITUTION_PATTERN } from '../../src/domain/healingLedger.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';

const TIER_ORDER = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

// ── Flattened chain catalog ────────────────────────────────────────────────────
const allChains = Object.entries(SUPPLY_CHAIN_NEEDS).flatMap(([needKey, need]) =>
  need.chains.map(chain => ({ needKey, fullId: `${needKey}.${chain.id}`, ...chain })),
);
const allChainIds = new Set(allChains.map(c => c.fullId));

// ── Catalog institution names, lowercased, per tier ────────────────────────────
const catalogNamesByTier = Object.fromEntries(
  TIER_ORDER.map(tier => [
    tier,
    Object.values(institutionalCatalog[tier] || {}).flatMap(category =>
      Object.keys(category).map(n => n.toLowerCase()),
    ),
  ]),
);
const allCatalogNames = new Set(
  TIER_ORDER.flatMap(t => Object.values(institutionalCatalog[t] || {}).flatMap(c => Object.keys(c))),
);

// Same matcher as the activation gate (computeActiveChains.js:114-116): a chain
// processor matches when a settlement institution name CONTAINS the processor
// pattern lowercased and truncated to 12 chars. If this drifts from the source,
// the behavior cases below (which run the real computeActiveChains) still catch it.
const processorMatches = (instName, pattern) => instName.includes(pattern.toLowerCase().slice(0, 12));

const hasResolvableProcessorAtOrAbove = (chain) => {
  const minIdx = TIER_ORDER.indexOf(chain.minTier || 'thorp');
  return (chain.processingInstitutions || []).some(p =>
    TIER_ORDER.slice(minIdx).some(tier =>
      catalogNamesByTier[tier].some(n => processorMatches(n, p)),
    ),
  );
};

// Replica of the private resourceLabelToKey in computeActiveChains.js:13-23
// (fuzzy word overlap from chain.resource label to RESOURCE_DATA key). Used to
// assert the reverse index agrees with runnability's label resolution.
function resourceLabelToKey(label) {
  if (!label) return null;
  const words = label.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  let bestKey = null, bestScore = 0;
  Object.keys(RESOURCE_DATA).forEach(key => {
    const keyWords = key.toLowerCase().split('_');
    const score = words.filter(w => keyWords.some(kw => kw.startsWith(w) || w.startsWith(kw))).length;
    if (score > bestScore) { bestScore = score; bestKey = key; }
  });
  return bestScore > 0 ? bestKey : null;
}

describe('RESOURCE_TO_CHAINS joins', () => {
  it('every key is a real RESOURCE_DATA resource key', () => {
    const orphanKeys = Object.keys(RESOURCE_TO_CHAINS).filter(rk => !RESOURCE_DATA[rk]);
    expect(orphanKeys).toEqual([]);
  });

  it('every chain ref resolves to a real needKey.chainId (no dead namespaces)', () => {
    const dead = [];
    for (const [rk, refs] of Object.entries(RESOURCE_TO_CHAINS)) {
      for (const ref of refs) {
        if (!allChainIds.has(ref)) dead.push(`${rk} -> ${ref}`);
      }
    }
    // 'agricultural.*' and 'services.*' were dead namespaces (no such need groups);
    // any new entry must use the real SUPPLY_CHAIN_NEEDS keys.
    expect(dead).toEqual([]);
  });

  it('every resource-backed chain is indexed under the resource key its label resolves to', () => {
    const unindexed = [];
    for (const chain of allChains) {
      if (!chain.resource) continue; // institution-only chains have no reverse-index slot
      const key = resourceLabelToKey(chain.resource);
      if (!key) { unindexed.push(`${chain.fullId}: label "${chain.resource}" resolves to no key`); continue; }
      if (!(RESOURCE_TO_CHAINS[key] || []).includes(chain.fullId)) {
        unindexed.push(`${chain.fullId}: missing from RESOURCE_TO_CHAINS.${key}`);
      }
    }
    // Without this, the chain runs but never reaches 'running'/activatedByResource,
    // and deriveLocalProductionFromChains skips its outputs.
    expect(unindexed).toEqual([]);
  });

  it('the formerly-orphaned terrain chains are registered under their terrain resources', () => {
    const expected = [
      ['deep_harbour', 'raw_extraction.harbour_trade'],
      ['river_mills', 'raw_extraction.river_milling'],
      ['fertile_floodplain', 'raw_extraction.floodplain_agriculture'],
      ['mountain_timber', 'raw_extraction.mountain_timber_harvest'],
      ['alpine_pasture', 'raw_extraction.alpine_wool'],
      ['oasis_water', 'raw_extraction.oasis_agriculture'],
      ['date_palms', 'raw_extraction.date_palm_harvest'],
      ['glass_sand', 'raw_extraction.desert_glasswork'],
      ['crossroads_position', 'trade_entrepot.crossroads_trade'],
      ['camel_herds', 'trade_entrepot.camel_caravan'],
      ['defended_pass', 'trade_entrepot.mountain_pass_trade'],
    ];
    for (const [resourceKey, chainRef] of expected) {
      expect(RESOURCE_TO_CHAINS[resourceKey], resourceKey).toContain(chainRef);
    }
  });
});

describe('chain processor joins (activation gate resolvability)', () => {
  it('every chain that declares processors has >=1 resolvable at a tier >= minTier', () => {
    // Chains with EMPTY processor lists (spices_dyes, silk_luxury_textiles,
    // transit_finance, luxury_goods, magical_goods, planar, smuggling) are a
    // separate audit finding owned by another slice; this rule guards the lists
    // that exist from referencing institutions the catalog never generates.
    const unresolvable = allChains
      .filter(c => (c.processingInstitutions || []).length > 0)
      .filter(c => !hasResolvableProcessorAtOrAbove(c))
      .map(c => c.fullId);
    expect(unresolvable).toEqual([]);
  });

  it('the re-pointed civic/religious/healing chains resolve against the catalog', () => {
    const named = [
      'religion_civic.parish',
      'religion_civic.law_governance',
      'religion_civic.pilgrimage',
      'healing_medicine.hospital',
      'healing_medicine.divine_healing',
      'arcane_magical.alchemy',
    ];
    for (const fullId of named) {
      const chain = allChains.find(c => c.fullId === fullId);
      expect(chain, fullId).toBeTruthy();
      expect(hasResolvableProcessorAtOrAbove(chain), fullId).toBe(true);
    }
  });

  it('the faith chain belongs to churches, law to courts, hospital to hospitals', () => {
    const procs = id => allChains.find(c => c.fullId === id).processingInstitutions;
    expect(procs('religion_civic.parish')).toContain('Parish church');
    expect(procs('religion_civic.law_governance')).toContain('Courthouse');
    expect(procs('religion_civic.law_governance')).not.toContain('Public bathhouse');
    expect(procs('religion_civic.law_governance')).not.toContain('Workhouse');
    expect(procs('healing_medicine.hospital')).toContain('Small hospital');
    expect(procs('healing_medicine.hospital')).toContain('Major hospital');
    expect(procs('healing_medicine.divine_healing')).toContain('Monastery');
  });

  it('chain outputs are goods/services, never institution names', () => {
    const leaks = [];
    for (const chain of allChains) {
      for (const output of chain.outputs || []) {
        if (allCatalogNames.has(output)) leaks.push(`${chain.fullId} output: ${output}`);
      }
    }
    // "Wizard's tower" / "Mages' guild" used to leak from spellcasting/divine_healing.
    expect(leaks).toEqual([]);
  });
});

describe('DM-visible activation behavior (computeActiveChains)', () => {
  const inst = (...names) => names.map((name, i) => ({ id: `i${i}`, name }));

  it('a village with a Parish church runs the Parish & Faith chain', () => {
    const chains = computeActiveChains(inst('Parish church'), [], 'village', 'road');
    const parish = chains.find(c => c.needKey === 'religion_civic' && c.chainId === 'parish');
    expect(parish).toBeTruthy();
  });

  it('a thorp with access to a parish church still gets the faith chain', () => {
    const chains = computeActiveChains(inst('Access to parish church'), [], 'thorp', 'road');
    expect(chains.some(c => c.chainId === 'parish')).toBe(true);
  });

  it('a courthouse runs Law & Governance; a bathhouse/workhouse does not', () => {
    const withCourt = computeActiveChains(inst('Courthouse'), [], 'town', 'road');
    expect(withCourt.some(c => c.chainId === 'law_governance')).toBe(true);
    const withBath = computeActiveChains(inst('Public bathhouse', 'Workhouse'), [], 'town', 'road');
    expect(withBath.some(c => c.chainId === 'law_governance')).toBe(false);
  });

  it('a city with a Major hospital runs the Hospital & Surgery chain', () => {
    const chains = computeActiveChains(inst('Major hospital'), [], 'city', 'road');
    expect(chains.some(c => c.needKey === 'healing_medicine' && c.chainId === 'hospital')).toBe(true);
  });

  it('terrain resources flag their dedicated chains as running (not merely operational)', () => {
    const alpine = computeActiveChains(inst('Shepherd'), ['alpine_pasture'], 'hamlet', 'road');
    const wool = alpine.find(c => c.chainId === 'alpine_wool');
    expect(wool).toBeTruthy();
    expect(wool.activatedByResource).toBe(true);
    expect(wool.status).toBe('running');

    const desert = computeActiveChains(inst('Farmland', "Caravaneer's post"), ['date_palms'], 'hamlet', 'road');
    const dates = desert.find(c => c.chainId === 'date_palm_harvest');
    expect(dates).toBeTruthy();
    expect(dates.activatedByResource).toBe(true);
    expect(dates.status).toBe('running');
  });
});

describe('healing classifier covers the catalog medical vocabulary', () => {
  it('hospitals, almshouses, and monastic houses read as healing-capable', () => {
    for (const name of [
      'Small hospital',
      'Major hospital',
      'Hospital network',
      'Almshouse',
      'Monastery or friary',
      'Multiple monasteries',
      'Major monasteries (5-10)',
    ]) {
      expect(HEALING_INSTITUTION_PATTERN.test(name), name).toBe(true);
    }
    expect(HEALING_INSTITUTION_PATTERN.test('Blacksmith')).toBe(false);
    expect(HEALING_INSTITUTION_PATTERN.test('Town granary')).toBe(false);
  });

  // The DM-visible wrong output: a city whose healing rests on its Major hospital
  // read healerCount=0 and "No dedicated healing institutions found".
  const town = (names) => ({
    name: 'T', tier: 'town', population: 2000, config: { monsterThreat: 'safe' },
    institutions: names.map((n, i) => ({ id: `i${i}`, name: n })),
    powerStructure: { factions: [] }, activeConditions: [],
  });

  it('a hospital town counts its hospital as a healer', () => {
    expect(healingLedger(town(['Major hospital'])).healerCount).toBe(1);
    expect(healingLedger(town(['Small hospital', 'Almshouse'])).healerCount).toBe(2);
  });

  it('causal healing_capacity reads higher with a hospital than bare (relieving direction)', () => {
    expect(deriveSystemVariable('healing_capacity', town(['Major hospital'])).score)
      .toBeGreaterThan(deriveSystemVariable('healing_capacity', town([])).score);
  });
});
