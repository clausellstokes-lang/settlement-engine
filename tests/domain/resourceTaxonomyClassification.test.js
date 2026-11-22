/**
 * resourceTaxonomyClassification.test.js — the classification pin.
 *
 * classifyResource() projects every RESOURCE_DATA entry from the explicit
 * RESOURCE_SEMANTICS catalog. The fallback regex remains only for legacy/custom
 * unknown values. recoveryMode is load-bearing: the lit resource drift
 * (tierResourceDynamics, rules.resourceDriftEnabled) and W-DISCOVERY's permanent
 * removal (resourceDynamicsKernel — removal fires only on recoveryMode 'manual')
 * both key off it. randomDepletionEligible separately prevents fixed positions
 * and infrastructure from being consumed by settlement-size pressure.
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

const MANAGED_RENEWABLE = Object.freeze({
  type: 'renewable',
  kind: 'managed',
  renewability: 'renewable',
  recoveryMode: 'natural',
  randomDepletionEligible: true,
});
const SPECIAL_RENEWABLE = Object.freeze({
  ...MANAGED_RENEWABLE,
  kind: 'renewable',
});
const EXHAUSTIBLE = Object.freeze({
  type: 'exhaustible',
  kind: 'nonrenewable',
  renewability: 'exhaustible',
  recoveryMode: 'manual',
  randomDepletionEligible: true,
});
const EXHAUSTIBLE_SITE = Object.freeze({
  ...EXHAUSTIBLE,
  kind: 'strategic',
});
const POSITIONAL = Object.freeze({
  type: 'positional',
  kind: 'strategic',
  renewability: 'fixed',
  recoveryMode: 'not_applicable',
  randomDepletionEligible: false,
});
const INFRASTRUCTURE = Object.freeze({
  type: 'infrastructure',
  kind: 'infrastructure',
  renewability: 'maintained',
  recoveryMode: 'not_applicable',
  randomDepletionEligible: false,
});
const MAGICAL = Object.freeze({
  type: 'magical',
  kind: 'magical',
  renewability: 'conditional',
  recoveryMode: 'requires_high_magic',
  randomDepletionEligible: true,
});

/** @type {Record<string, typeof MANAGED_RENEWABLE>} */
const EXPECTED = {
  fishing_grounds: MANAGED_RENEWABLE,
  shipbuilding_timber: MANAGED_RENEWABLE,
  fertile_floodplain: MANAGED_RENEWABLE,
  river_fish: MANAGED_RENEWABLE,
  hunting_grounds: MANAGED_RENEWABLE,
  managed_forest: MANAGED_RENEWABLE,
  foraging_areas: MANAGED_RENEWABLE,
  grain_fields: MANAGED_RENEWABLE,
  grazing_land: MANAGED_RENEWABLE,
  marshlands: MANAGED_RENEWABLE,
  date_palms: MANAGED_RENEWABLE,
  camel_herds: MANAGED_RENEWABLE,
  alpine_pasture: MANAGED_RENEWABLE,
  mountain_timber: MANAGED_RENEWABLE,
  ancient_grove: SPECIAL_RENEWABLE,

  salt_flats: EXHAUSTIBLE,
  river_clay: EXHAUSTIBLE,
  iron_deposits: EXHAUSTIBLE,
  stone_quarry: EXHAUSTIBLE,
  precious_metals: EXHAUSTIBLE,
  gemstone_deposits: EXHAUSTIBLE,
  coal_deposits: EXHAUSTIBLE,
  glass_sand: EXHAUSTIBLE,
  desert_salt: EXHAUSTIBLE,
  ancient_ruins: EXHAUSTIBLE_SITE,

  deep_harbour: POSITIONAL,
  crossroads_position: POSITIONAL,
  hot_springs: POSITIONAL,
  defended_pass: POSITIONAL,
  oasis_water: POSITIONAL,
  hot_springs_mineral: POSITIONAL,
  river_mills: INFRASTRUCTURE,

  magical_node: MAGICAL,
};

describe('resource taxonomy classification pin', () => {
  it('every catalog resource classifies to its hand-checked table entry', () => {
    for (const [key, want] of Object.entries(EXPECTED)) {
      const got = classifyResource(key);
      expect({
        type: got.type,
        kind: got.kind,
        renewability: got.renewability,
        recoveryMode: got.recoveryMode,
        randomDepletionEligible: got.randomDepletionEligible,
      },
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
