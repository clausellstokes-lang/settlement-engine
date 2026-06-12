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
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { computeActiveChains, processorPatternIdSet } from '../../src/generators/computeActiveChains.js';
import { healingLedger, HEALING_INSTITUTION_PATTERN } from '../../src/domain/healingLedger.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';
import { NEED_HEURISTICS } from '../../src/domain/supplyChainState.js';

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

// ── Baseline generability at a tier (mirrors assembleInstitutions.js:212-226) ──
// A settlement of tier T draws ONLY from institutionalCatalog[T] — metropolis
// merges the city section in (assembleInstitutions.js:213-214) — and an entry
// carrying its own minTier above T is skipped (line 226). DM "require" toggles
// can force out-of-tier entries, but a chain's minTier should be honest under
// baseline generation, not rescued by override.
const namesAvailableAtTier = (tier) => {
  const sections = tier === 'metropolis'
    ? [institutionalCatalog.city || {}, institutionalCatalog.metropolis || {}]
    : [institutionalCatalog[tier] || {}];
  const tierIdx = TIER_ORDER.indexOf(tier);
  return sections.flatMap(section =>
    Object.values(section).flatMap(group =>
      Object.entries(group)
        .filter(([, spec]) => tierIdx >= TIER_ORDER.indexOf(spec?.minTier || 'thorp'))
        .map(([name]) => name.toLowerCase()),
    ),
  );
};

const resolvesAtOwnMinTier = (chain) => {
  const pool = namesAvailableAtTier(chain.minTier || 'thorp');
  return (chain.processingInstitutions || []).some(p => pool.some(n => processorMatches(n, p)));
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

describe('NEED_HEURISTICS joins (beneficiary/victim vocabulary, Wave 5 #2)', () => {
  // chain.needKey only ever carries SUPPLY_CHAIN_NEEDS group keys. The
  // heuristic table once keyed 'trade'/'arcane'/'energy' — no such groups —
  // so inferBeneficiaries/inferVictims silently returned the generic
  // ['settlement residents'] for 8 of the 11 groups.
  it('every NEED_HEURISTICS key is a real SUPPLY_CHAIN_NEEDS group', () => {
    const groups = new Set(Object.keys(SUPPLY_CHAIN_NEEDS));
    const orphans = Object.keys(NEED_HEURISTICS).filter(k => !groups.has(k));
    expect(orphans).toEqual([]);
  });

  it('every SUPPLY_CHAIN_NEEDS group has a heuristic entry (no generic fallback in play)', () => {
    const missing = Object.keys(SUPPLY_CHAIN_NEEDS).filter(k => !NEED_HEURISTICS[k]);
    expect(missing).toEqual([]);
  });

  it('every entry carries non-empty beneficiaries, victims, and a failure consequence', () => {
    for (const [key, h] of Object.entries(NEED_HEURISTICS)) {
      expect(h.beneficiaries.length, key).toBeGreaterThan(0);
      expect(h.victims.length, key).toBeGreaterThan(0);
      expect(typeof h.failureConsequence, key).toBe('string');
      expect(h.failureConsequence.length, key).toBeGreaterThan(0);
    }
  });

  it("deriveTradeConnectivity's chain filter matches a real SUPPLY_CHAIN_NEEDS group", () => {
    // causalState.js filters activeChains by needKey before scoring trade
    // connectivity. The filter once keyed 'trade' — no such group — so the
    // whole trade-chain block was dead code (Wave 5 #2). One stable chain
    // per REAL group must surface at least one chain contributor, whichever
    // group key the filter reads.
    const s = {
      tier: 'town',
      population: 2000,
      config: { tradeRouteAccess: 'road' },
      economicState: {
        activeChains: Object.keys(SUPPLY_CHAIN_NEEDS).map(needKey => ({
          needKey,
          chainId: `probe_${needKey}`,
          label: `${needKey} probe`,
          status: 'operational',
        })),
      },
      activeConditions: [],
    };
    const out = deriveSystemVariable('trade_connectivity', s);
    const chainContributors = out.contributors.filter(c => String(c.source).startsWith('chain.'));
    expect(chainContributors.length).toBeGreaterThan(0);
  });
});

describe('chain id uniqueness', () => {
  it('inner chain ids are globally unique across need groups', () => {
    // raw_extraction used to carry two 'shipbuilding' chains (river + coastal).
    // Every inner-id-keyed join — computeActiveChains' chainById last-wins map,
    // CHAIN_DEPS, upstreamChains, the lifecycle's chainCatalogEntries — silently
    // aliased them, and both resolved to the same persisted stable id.
    const counts = new Map();
    for (const chain of allChains) counts.set(chain.id, (counts.get(chain.id) || 0) + 1);
    const dups = [...counts.entries()].filter(([, n]) => n > 1).map(([id]) => id);
    expect(dups).toEqual([]);
  });
});

describe('chain processor joins (activation gate resolvability)', () => {
  it('no chain has an empty processor list (a dead chain that can never activate)', () => {
    // computeActiveChains returns early on zero processor matches, so [] means
    // the chain can never run. The last empty lists (luxury_goods, spices_dyes,
    // silk_luxury_textiles, transit_finance, smuggling — and magical_goods/
    // planar before them) were filled from the catalog; none may regress.
    const dead = allChains
      .filter(c => (c.processingInstitutions || []).length === 0)
      .map(c => c.fullId);
    expect(dead).toEqual([]);
  });

  it('every chain has >=1 processor resolvable at a tier >= minTier', () => {
    const unresolvable = allChains
      .filter(c => !hasResolvableProcessorAtOrAbove(c))
      .map(c => c.fullId);
    expect(unresolvable).toEqual([]);
  });

  it('the formerly-dead entrepôt/luxury/criminal chains resolve against the catalog', () => {
    const revived = [
      'manufacturing.luxury_goods',
      'trade_entrepot.spices_dyes',
      'trade_entrepot.silk_luxury_textiles',
      'trade_entrepot.transit_finance',
      'criminal_economy.smuggling',
      'arcane_magical.magical_goods',
      'arcane_magical.planar',
    ];
    for (const fullId of revived) {
      const chain = allChains.find(c => c.fullId === fullId);
      expect(chain, fullId).toBeTruthy();
      expect(hasResolvableProcessorAtOrAbove(chain), fullId).toBe(true);
    }
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

  it('the magical_goods processors are catalog names, not spatialData service names', () => {
    // The first refill used 'Enchanting quarter' / 'Magic item consignment' —
    // spatialData.js SERVICE vocabulary, not institutionalCatalog entries — so
    // the chain passed the >=1-resolvable rule (via its metropolis processors)
    // while its town minTier stayed a dead letter for three tiers.
    const procs = allChains.find(c => c.fullId === 'arcane_magical.magical_goods').processingInstitutions;
    expect(procs).toContain("Wizard's tower");
    expect(procs).toContain("Enchanter's shop");
    expect(procs).not.toContain('Enchanting quarter');
    expect(procs).not.toContain('Magic item consignment');
  });

  it('every chain resolves through the id mapping too (Wave 8: the id path cannot go dark)', () => {
    // processorPatternIdSet is the pattern→catalog-id mapping the id-first
    // join compares against (built once from the fuzzy matcher). A chain all
    // of whose patterns resolve to EMPTY id sets would be invisible to every
    // stamped (generated) roster even if the fuzzy fallback still fires for
    // legacy saves — the id-path twin of the >=1-resolvable-processor rule.
    const dark = allChains
      .filter(c => !(c.processingInstitutions || []).some(p => processorPatternIdSet(p).size > 0))
      .map(c => c.fullId);
    expect(dark).toEqual([]);
  });

  it('the id mapping agrees with the fuzzy matcher pattern-by-pattern (same-tier ground truth)', () => {
    // For every chain pattern, the id set must contain EXACTLY the catalog
    // names the harness's fuzzy replica accepts — the mapping is frozen to
    // the matcher, never hand-tuned.
    const disagreements = [];
    const allPatterns = [...new Set(allChains.flatMap(c => c.processingInstitutions || []))];
    for (const pattern of allPatterns) {
      const expected = [...allCatalogNames]
        .filter(n => processorMatches(n.toLowerCase(), pattern))
        .map(catalogIdForName)
        .sort();
      const actual = [...processorPatternIdSet(pattern)].sort();
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        disagreements.push(`${pattern}: ids ${actual.join(',')} != fuzzy ${expected.join(',')}`);
      }
    }
    expect(disagreements).toEqual([]);
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

describe('chain minTier honesty (gate opens where a processor can be generated)', () => {
  // The magical_goods shape this pins: minTier 'town', but every processor that
  // resolved against the catalog lived in the metropolis section — the tier gate
  // opened three tiers before the chain could ever activate, and the
  // >=1-resolvable-at-SOME-tier assertion above cannot see that gap.
  //
  // The original 18-entry worklist (chains whose declared minTier sat below the
  // tier where any processor could be generated) was cleared by re-pointing
  // processors at lower-tier catalog names — plus raising garrison/law_governance
  // to 'town' and herbalism to 'village', where the catalog's first real standing
  // force / courthouse / herbalist lives. The list stays so the exact-equality
  // assertion refuses ANY new gap.
  const KNOWN_MINTIER_GAPS = [];

  it('every chain outside the known-gap list has >=1 processor generable at its own minTier', () => {
    const gaps = allChains.filter(c => !resolvesAtOwnMinTier(c)).map(c => c.fullId).sort();
    expect(gaps).toEqual(KNOWN_MINTIER_GAPS);
  });

  it('the arcane chains ladder honestly: magical_goods from town, planar at metropolis', () => {
    const magical = allChains.find(c => c.fullId === 'arcane_magical.magical_goods');
    expect(magical.minTier).toBe('town');
    expect(resolvesAtOwnMinTier(magical)).toBe(true); // "Wizard's tower" is town-catalog
    const planar = allChains.find(c => c.fullId === 'arcane_magical.planar');
    // 'Planar traders' carries minTier:'metropolis' in the city section and
    // 'Planar embassy' is metropolis-section, so 'city' was a dead gate.
    expect(planar.minTier).toBe('metropolis');
    expect(resolvesAtOwnMinTier(planar)).toBe(true);
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

  it('coastal timber runs the coastal shipbuilding chain, not the river variant', () => {
    const chains = computeActiveChains(inst('Shipyard'), ['shipbuilding_timber'], 'town', 'port');
    const coastal = chains.find(c => c.chainId === 'coastal_shipbuilding');
    expect(coastal).toBeTruthy();
    expect(coastal.activatedByResource).toBe(true);
    expect(coastal.status).toBe('running');
    // The river variant needs its own processors (boatyards) and resource gate.
    expect(chains.some(c => c.chainId === 'shipbuilding')).toBe(false);
  });

  it('a crossroads town with Money changers runs Letters of Credit & Finance', () => {
    const chains = computeActiveChains(inst('Money changers'), [], 'town', 'crossroads');
    expect(chains.some(c => c.chainId === 'transit_finance')).toBe(true);
  });

  it('a port city with a Luxury goods quarter runs the silk and spice entrepôt chains', () => {
    const chains = computeActiveChains(inst('Luxury goods quarter'), [], 'city', 'port');
    expect(chains.some(c => c.chainId === 'silk_luxury_textiles')).toBe(true);
    expect(chains.some(c => c.chainId === 'spices_dyes')).toBe(true);
  });

  it('entrepôt-only chains stay off hub-less roads even with the institutions present', () => {
    const chains = computeActiveChains(inst('Luxury goods quarter', 'Money changers'), [], 'city', 'road');
    expect(chains.some(c => c.chainId === 'silk_luxury_textiles')).toBe(false);
    expect(chains.some(c => c.chainId === 'transit_finance')).toBe(false);
  });

  it('a city on precious metal veins with Specialized metalworkers runs Luxury Goods', () => {
    const chains = computeActiveChains(inst('Specialized metalworkers'), ['precious_metals'], 'city', 'road');
    const lux = chains.find(c => c.chainId === 'luxury_goods');
    expect(lux).toBeTruthy();
    expect(lux.activatedByResource).toBe(true);
  });

  it('smuggling is the dark entrepôt: a fence runs it at a crossroads, not on a dead-end road', () => {
    const crossroads = computeActiveChains(inst('Local fence'), [], 'thorp', 'crossroads');
    expect(crossroads.some(c => c.chainId === 'smuggling')).toBe(true);
    const road = computeActiveChains(inst('Local fence'), [], 'thorp', 'road');
    expect(road.some(c => c.chainId === 'smuggling')).toBe(false);
  });

  it("a town wizard's tower on a ley line node runs Magical Items & Enchanting", () => {
    const chains = computeActiveChains(inst("Wizard's tower"), ['magical_node'], 'town', 'road');
    const goods = chains.find(c => c.chainId === 'magical_goods');
    expect(goods).toBeTruthy();
    expect(goods.activatedByResource).toBe(true);
    expect(goods.status).toBe('running');
    // Without the node (and no entrepôt route or magic transit), the tower
    // alone does not conjure a magic-item market.
    const bare = computeActiveChains(inst("Wizard's tower"), [], 'town', 'road');
    expect(bare.some(c => c.chainId === 'magical_goods')).toBe(false);
  });

  it('a settlement with Planar traders but NO circle/airship does not run Planar Trade', () => {
    // /planar/ matched the chain's own processors, so a metropolis that lost
    // its Teleportation circle mid-campaign kept 'Planar Trade running' with
    // no transit channel at all (the generation-time cull never re-runs).
    const chains = computeActiveChains(inst('Planar traders', 'Planar embassy'), [], 'metropolis', 'isolated');
    expect(chains.some(c => c.chainId === 'planar')).toBe(false);
  });

  it('the same settlement WITH a Teleportation circle (or airship dock) runs Planar Trade', () => {
    const circle = computeActiveChains(inst('Planar traders', 'Teleportation circle'), [], 'metropolis', 'isolated');
    expect(circle.some(c => c.chainId === 'planar')).toBe(true);
    const airship = computeActiveChains(inst('Planar traders', 'Airship docking (high magic)'), [], 'metropolis', 'isolated');
    expect(airship.some(c => c.chainId === 'planar')).toBe(true);
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
