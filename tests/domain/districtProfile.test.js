/**
 * tests/domain/districtProfile.test.js — Tier 4.9 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  DISTRICT_CATEGORIES,
  deriveDistrictProfile,
  deriveAllDistricts,
  districtBands,
  supportedDistrictCategories,
  summarizeDistricts,
  QUARTER_CATEGORY,
} from '../../src/domain/districtProfile.js';
import {
  EXPLAINABLE_TYPES,
  explainEntity,
  explainDistrict,
  entityCatalog,
} from '../../src/domain/explanation.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function fixture() {
  return {
    name: 'Greycairn',
    tier: 'city',
    population: 8000,
    economicState: { prosperity: { tier: 'Modest' } },
    config: { tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Town Granary' },
      { id: 'institution.temple',  name: 'Temple of Light' },
      { id: 'institution.watch',   name: 'Town Watch' },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.council',   faction: 'Council',   name: 'Council',   power: 35 },
        { id: 'faction.merchants', faction: 'Merchant Guilds', name: 'Merchant Guilds', power: 50 },
        { id: 'faction.religious', faction: 'Religious Authorities', name: 'Religious Authorities', power: 30 },
      ],
    },
    spatialLayout: {
      quarters: [
        { name: 'Religious Quarter', location: 'Eastern district', desc: 'Churches and quiet streets',
          landmarks: ['Temple of Light'] },
        { name: 'Merchant Quarter',  location: 'Central',           desc: 'Market stalls and warehouses',
          landmarks: ['Market square'] },
        { name: 'Slums',             location: 'Southern',          desc: 'Crowded tenements; thieves know it',
          landmarks: [] },
      ],
    },
    activeConditions: [],
  };
}

describe('catalog', () => {
  it('exposes 12 canonical categories', () => {
    expect(DISTRICT_CATEGORIES).toEqual([
      'religious', 'merchant', 'military', 'craft',
      'residential', 'noble', 'civic', 'arcane',
      'criminal', 'foreign', 'industrial', 'other',
    ]);
    expect(supportedDistrictCategories()).toEqual([...DISTRICT_CATEGORIES]);
  });

  it('exposes wealth + safety bands', () => {
    const b = districtBands();
    expect(b.wealth.length).toBeGreaterThan(0);
    expect(b.safety.length).toBeGreaterThan(0);
  });
});

describe('deriveDistrictProfile()', () => {
  it('religious quarter classifies as religious + dominant religious faction', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d.category).toBe('religious');
    expect(d.dominantFaction?.archetype).toBe('religious');
  });

  it('merchant quarter classifies as merchant + dominant merchant faction', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[1], s);
    expect(d.category).toBe('merchant');
    expect(d.dominantFaction?.archetype).toBe('merchant');
  });

  it('slums classify as criminal with degraded safety', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[2], s);
    expect(d.category).toBe('criminal');
    expect(['lawless', 'unsafe']).toContain(d.safety);
  });

  it('produces the canonical shape', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d).toHaveProperty('id');
    expect(d).toHaveProperty('name');
    expect(d).toHaveProperty('category');
    expect(d).toHaveProperty('wealth');
    expect(d).toHaveProperty('safety');
    expect(d).toHaveProperty('dominantFaction');
    expect(d).toHaveProperty('institutions');
    expect(d).toHaveProperty('services');
    expect(d).toHaveProperty('sensoryIdentity');
    expect(d).toHaveProperty('currentTension');
    expect(d).toHaveProperty('hook');
    expect(Array.isArray(d.connectedDistricts)).toBe(true);
    expect(Array.isArray(d.contributors)).toBe(true);
  });

  it('returns null for nullish input', () => {
    expect(deriveDistrictProfile(null, {})).toBeNull();
    expect(deriveDistrictProfile({ name: 'X' }, null)).toBeNull();
  });

  it('plague active condition surfaces as religious tension', () => {
    const s = { ...fixture(), activeConditions: [{ archetype: 'plague', severity: 0.7 }] };
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d.currentTension.toLowerCase()).toMatch(/plague|relief|temple/);
  });

  it('connectedDistricts lists other quarters', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d.connectedDistricts).toContain('Merchant Quarter');
    expect(d.connectedDistricts).toContain('Slums');
    expect(d.connectedDistricts).not.toContain('Religious Quarter');
  });
});

describe('deriveAllDistricts()', () => {
  it('returns one district per quarter', () => {
    const s = fixture();
    const all = deriveAllDistricts(s);
    expect(all).toHaveLength(s.spatialLayout.quarters.length);
  });

  it('returns [] for settlement without quarters', () => {
    expect(deriveAllDistricts({})).toEqual([]);
  });
});

describe('Phase 19 wiring', () => {
  it('EXPLAINABLE_TYPES includes district', () => {
    expect(EXPLAINABLE_TYPES).toContain('district');
  });

  it('entityCatalog enumerates districts', () => {
    const cat = entityCatalog(fixture());
    expect(cat.some(e => e.type === 'district')).toBe(true);
  });

  it('explainDistrict returns canonical envelope', () => {
    const s = fixture();
    const id = `district.${'Religious Quarter'.toLowerCase().replace(/\s+/g, '_')}`;
    const env = explainDistrict(s, id);
    expect(env.entityType).toBe('district');
    expect(env.profile.category).toBe('religious');
    expect(env.causes.length).toBeGreaterThan(0);
  });

  it('dispatcher routes district.* ids', () => {
    const s = fixture();
    const env = explainEntity(s, 'district.religious_quarter');
    expect(env.entityType).toBe('district');
  });
});

describe('purity + smoke', () => {
  it('does not mutate input settlement', () => {
    const s = fixture();
    const before = JSON.stringify(s);
    deriveAllDistricts(s);
    summarizeDistricts(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'district-real-city', customContent: {} },
    );
    const all = deriveAllDistricts(settlement);
    expect(Array.isArray(all)).toBe(true);
    for (const d of all) {
      expect(DISTRICT_CATEGORIES).toContain(d.category);
    }
  });
});


// ── The QUARTER_CATEGORY registry walker ─────────────────────────────────────
//
// THE CLASS this prevents: districtProfile classified quarters with a
// first-match-wins regex sweep over name + desc + landmarks. Because the
// generator's quarter names are authored strings that the sweep never saw, the
// sweep mislabelled five of them — measured over a 504-settlement corpus,
// "Noxious Trades Quarter" read as merchant (164), "Shadows District" as
// merchant (168), "Wealthy Residential" as merchant (168), "Common Residential"
// as criminal (168, via the unanchored `den` inside "Dense"), and "Mages'
// Quarter" as craft (45). The criminal quarter and the common residential
// quarter were exactly swapped.
//
// A declared registry only stays true if it stays TOTAL. This walker reads the
// generator's OWN `quarters.push({ name: ... })` literals and pins them against
// the registry in BOTH directions, so adding a fifteenth quarter without a
// category row reds here rather than silently falling back to a regex guess.
const GENERATOR_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../src/generators/spatialGenerator.js',
);

/** The quarter `name:` literals the generator actually pushes. */
function generatorQuarterNames() {
  const src = fs.readFileSync(GENERATOR_PATH, 'utf8');
  const names = [];
  // Only `name:` lines that are PLAIN string literals. A template literal is
  // deliberately NOT matched — see the interpolation pin below.
  const re = /^\s*name:\s*('([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)")\s*,/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    names.push((m[2] !== undefined ? m[2] : m[3]).replace(/\\(['"])/g, '$1'));
  }
  return names;
}

describe('QUARTER_CATEGORY registry walker', () => {
  it('reads the generator source and finds its quarter name literals', () => {
    const names = generatorQuarterNames();
    // Anti-vacuity: a walker that parses nothing passes everything.
    expect(names.length).toBeGreaterThan(0);
    expect(names.length).toBe(14);
    expect(new Set(names).size).toBe(names.length);
  });

  it('every generator quarter has a declared category', () => {
    const missing = generatorQuarterNames().filter(n => !(n in QUARTER_CATEGORY));
    expect(missing).toEqual([]);
  });

  it('every declared row names a real generator quarter', () => {
    const names = new Set(generatorQuarterNames());
    const orphans = Object.keys(QUARTER_CATEGORY).filter(n => !names.has(n));
    expect(orphans).toEqual([]);
  });

  it('every declared category is a canonical district category', () => {
    const bad = Object.entries(QUARTER_CATEGORY)
      .filter(([, c]) => !DISTRICT_CATEGORIES.includes(c))
      .map(([n, c]) => `${n} -> ${c}`);
    expect(bad).toEqual([]);
  });

  it('no generator quarter name is interpolated', () => {
    // A template-literal name would be invisible to the parser above, so the
    // registry could go silently non-total. Pin the literal form itself.
    const src = fs.readFileSync(GENERATOR_PATH, 'utf8');
    const interpolated = src.match(/^\s*name:\s*`/gm) || [];
    expect(interpolated).toEqual([]);
  });
});

describe('district category corrections (measured over 504 settlements)', () => {
  const withQuarter = (quarter) => ({
    ...fixture(),
    spatialLayout: { quarters: [quarter] },
  });

  it('anchors `den`: a DENSE quarter is not a criminal den', () => {
    // Deliberately an UNDECLARED name: a registry row would short-circuit the
    // regex sweep and leave the anchoring itself unpinned. This carries the
    // Common Residential DESCRIPTION, which is where "Dense" actually lives.
    const d = deriveDistrictProfile({
      name: 'Weavers Row',
      location: 'Spread throughout',
      desc: 'Dense timber tenements, narrow streets, crowded',
      landmarks: [],
    }, fixture());
    expect(d.category).toBe('residential');
    expect(d.category).not.toBe('criminal');
  });

  it('the shipped Common Residential quarter is residential', () => {
    const d = deriveDistrictProfile({
      name: 'Common Residential',
      location: 'Spread throughout',
      desc: 'Dense timber tenements, narrow streets, crowded',
      landmarks: ["Tanners' Lane", "Weavers' Street", "Cooper's Close"],
    }, fixture());
    expect(d.category).toBe('residential');
  });

  it('still classifies a real criminal den', () => {
    const d = deriveDistrictProfile({
      name: 'The Dens', desc: 'A warren of gambling dens', landmarks: [],
    }, fixture());
    expect(d.category).toBe('criminal');
  });

  it('Noxious Trades is industrial, not merchant', () => {
    const d = deriveDistrictProfile({
      name: 'Noxious Trades Quarter',
      desc: 'Smelly, dirty area with tanneries, butchers, and dyers',
      landmarks: ['Tannery Row', 'Slaughterhouse', "Dyer's Bridge"],
    }, fixture());
    expect(d.category).toBe('industrial');
  });

  it('Shadows District is criminal, not merchant', () => {
    const d = deriveDistrictProfile({
      name: 'Shadows District',
      desc: 'Narrow alleys, hidden markets, criminal activity',
      landmarks: ["The Rat's Nest (tavern)", 'Blind Alley', 'The Warren (slums)'],
    }, fixture());
    expect(d.category).toBe('criminal');
  });

  it('Wealthy Residential is noble — and is NOT rendered poor', () => {
    const d = deriveDistrictProfile({
      name: 'Wealthy Residential',
      desc: 'Stone townhouses, private gardens, clean streets',
      landmarks: ["Noble's Row", 'Merchant Estates', 'Garden District'],
    }, fixture());
    expect(d.category).toBe('noble');
    expect(d.wealth).not.toBe('poor');
    expect(['wealthy', 'opulent']).toContain(d.wealth);
  });

  it('an UNDECLARED quarter still falls through to the regex sweep', () => {
    // `declared ?? inferred` — not a fall-through to 'other'.
    const d = deriveDistrictProfile({
      name: 'Merchant Quarter', desc: 'Market stalls and warehouses', landmarks: [],
    }, fixture());
    expect(d.category).toBe('merchant');
  });
});

describe('dominant faction: canonical routing + no silent row deletion', () => {
  it('a noble faction is reachable — the folded vocabulary hid it', () => {
    // factionProfile folds NOBLE into `government`, so matching on the folded
    // archetype could never see a noble house. Route (iii) fixes that.
    // The council deliberately OUTPOWERS the house. Matching on the folded
    // vocabulary, `noble` finds nothing and falls to `government`, which both
    // factions fold into — so the higher-power Town Council wins and the noble
    // quarter is handed the council. Canonical routing sees the house.
    const s = fixture();
    s.powerStructure.factions = [
      { faction: 'House Balmoor', name: 'House Balmoor', power: 20 },
      { faction: 'Town Council', name: 'Town Council', power: 60 },
    ];
    const d = deriveDistrictProfile({
      name: 'Wealthy Residential', desc: 'Stone townhouses', landmarks: [],
    }, s);
    expect(d.category).toBe('noble');
    expect(d.dominantFaction).not.toBeNull();
    expect(d.dominantFaction.name).toBe('House Balmoor');
    expect(d.dominantFaction.archetype).not.toBe('government');
  });

  it('an industrial district keeps a faction row when no craft faction exists', () => {
    // THE DELETION GUARD. `industrial -> craft` alone was an unconditional null:
    // the engine produces ZERO craft-archetype factions over 3,038 instances, so
    // declaring Noxious Trades `industrial` would have deleted its row from 164
    // cards. The preference list falls back to an archetype that occurs.
    const s = fixture();
    const d = deriveDistrictProfile({
      name: 'Noxious Trades Quarter', desc: 'Tanneries and dyers', landmarks: [],
    }, s);
    expect(d.category).toBe('industrial');
    expect(d.dominantFaction).not.toBeNull();
  });

  it('a civic district still resolves when the only power is a noble house', () => {
    // Route (iii) regression guard: matching canonical `government` ALONE drops
    // the government quarter's row in every settlement ruled by a noble house
    // (measured: 93 of 216 before the `noble` fallback was added).
    const s = fixture();
    s.powerStructure.factions = [{ faction: 'House Balmoor', name: 'House Balmoor', power: 60 }];
    const d = deriveDistrictProfile({
      name: 'Government Quarter', desc: 'Official buildings', landmarks: [],
    }, s);
    expect(d.category).toBe('civic');
    expect(d.dominantFaction).not.toBeNull();
  });

  it('residential districts honestly carry NO dominant faction', () => {
    const d = deriveDistrictProfile({
      name: 'Common Residential', desc: 'Dense timber tenements', landmarks: [],
    }, fixture());
    expect(d.category).toBe('residential');
    expect(d.dominantFaction).toBeNull();
  });
});
