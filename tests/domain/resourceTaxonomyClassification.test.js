/**
 * resourceTaxonomyClassification.test.js — the classification pin.
 *
 * classifyResource() sorts every RESOURCE_DATA entry into a fiction kind and a
 * recoveryMode by regex over its key + label + desc + category + trade goods.
 * recoveryMode is load-bearing: the lit resource_depletion/recovery drift
 * (tierResourceDynamics, rules.resourceDriftEnabled) and W-DISCOVERY's permanent
 * removal (resourceDynamicsKernel — removal fires only on recoveryMode 'manual')
 * both key off it. A substring collision in the regexes therefore mis-drives the
 * engine: it was mis-classifying grain fields (magical, via "bar[ley]") and coal
 * seams (renewable, via a stray 'timber' commodity) until 2026-07-15.
 *
 * EXPECTED is hand-checked against each resource's real-world fiction and is the
 * pin: every catalog key must classify to its entry, and a NEW resource must
 * extend this table (the coverage test fails otherwise), which forces a human to
 * hand-check the classification instead of trusting whatever the regexes happen
 * to return. Regenerate the raw values, then re-verify each by hand:
 *   node -e "import('./src/domain/worldPulse/resourceTaxonomy.js').then(async m=>{const {RESOURCE_DATA}=await import('./src/data/resourceData.js');for(const k of Object.keys(RESOURCE_DATA))console.log(k,JSON.stringify(m.classifyResource(k)))})"
 */
import { describe, it, expect } from 'vitest';
import { classifyResource } from '../../src/domain/worldPulse/resourceTaxonomy.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';

/** @type {Record<string, { kind: string, renewability: string, recoveryMode: string }>} */
const EXPECTED = {
  // Water/land renewables that recover naturally when pressure drops.
  fishing_grounds: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  deep_harbour: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  shipbuilding_timber: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  river_mills: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  fertile_floodplain: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  river_fish: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  hunting_grounds: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  managed_forest: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  foraging_areas: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  grazing_land: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  marshlands: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  date_palms: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  camel_herds: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  alpine_pasture: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  mountain_timber: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },
  // FIXED (2026-07-15): open farmland recovers naturally. Was 'magical' because the
  // desc "wheat, barley, and oats" tripped the unanchored 'ley' magical pattern.
  grain_fields: { kind: 'managed', renewability: 'renewable', recoveryMode: 'natural' },

  // 'special'/other renewables — kept 'renewable' (not 'managed') by category.
  ancient_grove: { kind: 'renewable', renewability: 'renewable', recoveryMode: 'natural' },
  hot_springs: { kind: 'renewable', renewability: 'renewable', recoveryMode: 'natural' },
  oasis_water: { kind: 'renewable', renewability: 'renewable', recoveryMode: 'natural' },
  hot_springs_mineral: { kind: 'renewable', renewability: 'renewable', recoveryMode: 'natural' },

  // Exhaustible seams — manual recovery, and removable once dwelled depleted.
  salt_flats: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  river_clay: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  iron_deposits: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  stone_quarry: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  precious_metals: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  gemstone_deposits: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  glass_sand: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  desert_salt: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },
  // FIXED (2026-07-15): a coal/peat seam is exhaustible. Was 'renewable' because its
  // stray 'timber' commodity tripped the renewable pattern; the subterranean category
  // now suppresses that incidental match.
  coal_deposits: { kind: 'nonrenewable', renewability: 'exhaustible', recoveryMode: 'manual' },

  // Strategic sites — finite, manual recovery.
  crossroads_position: { kind: 'strategic', renewability: 'limited', recoveryMode: 'manual' },
  ancient_ruins: { kind: 'strategic', renewability: 'exhaustible', recoveryMode: 'manual' },
  defended_pass: { kind: 'strategic', renewability: 'limited', recoveryMode: 'manual' },

  // Magical — recovers only under high magic.
  magical_node: { kind: 'magical', renewability: 'conditional', recoveryMode: 'requires_high_magic' },
};

describe('resource taxonomy classification pin', () => {
  it('every catalog resource classifies to its hand-checked table entry', () => {
    for (const [key, want] of Object.entries(EXPECTED)) {
      const got = classifyResource(key);
      expect({ kind: got.kind, renewability: got.renewability, recoveryMode: got.recoveryMode },
        `classifyResource('${key}')`).toEqual(want);
    }
  });

  it('the pin covers exactly the catalog — a new resource must extend this table', () => {
    // If this fails, a resource was added or renamed: hand-check its classification
    // and add it to EXPECTED rather than deleting the assertion.
    expect(Object.keys(RESOURCE_DATA).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  it('grain fields are managed farmland, never magical (the "barley" ⊃ "ley" guard)', () => {
    const t = classifyResource('grain_fields');
    expect(t.kind).toBe('managed');
    expect(t.recoveryMode).toBe('natural'); // recovers on its own — not gated on high magic
    expect(t.kind).not.toBe('magical');
  });

  it('coal seams are exhaustible and removal-eligible (the stray-"timber" guard)', () => {
    const t = classifyResource('coal_deposits');
    expect(t.kind).toBe('nonrenewable');
    // recoveryMode 'manual' is exactly the flag W-DISCOVERY removal keys on:
    // a worked-out coal seam can be permanently removed; a renewable one cannot.
    expect(t.recoveryMode).toBe('manual');
  });
});

describe('substring-collision boundary guards (would fail on the pre-2026-07-15 regexes)', () => {
  // These probe the regex boundaries directly via synthetic keys: an unknown key
  // has no RESOURCE_DATA entry, so its own string IS the classified text.
  it('"ley" inside a larger word does not read as magical', () => {
    expect(classifyResource('wheat barley oats').kind).not.toBe('magical');
    expect(classifyResource('a motley valley').kind).not.toBe('magical');
  });

  it('a standalone ley line still reads as magical', () => {
    expect(classifyResource('a ley line node').kind).toBe('magical');
  });

  it('"ore" inside "shore"/"lore" does not read as an exhaustible ore body', () => {
    // Both contain the letters "ore" but no renewable token to mask the hit, so
    // the unanchored 'ore' pattern would have flipped them to nonrenewable/manual.
    expect(classifyResource('petrified shore').kind).not.toBe('nonrenewable');
    expect(classifyResource('an ancient lore vault').kind).not.toBe('nonrenewable');
  });

  it('"coal" inside "charcoal" does not read as a coal seam', () => {
    expect(classifyResource('charcoal burners yard').kind).not.toBe('nonrenewable');
  });

  it('the standalone minerals still read as exhaustible', () => {
    expect(classifyResource('a rich iron ore body').kind).toBe('nonrenewable');
    expect(classifyResource('an open coal seam').kind).toBe('nonrenewable');
  });
});
