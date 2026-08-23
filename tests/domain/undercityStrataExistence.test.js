/**
 * undercityStrataExistence.test.js — MF-UC0 acceptance: THE UNDERGROUND EXISTENCE GATE
 * (ODQ §311.1), the `institutionSubstructure` facet kind, and the joint vocabulary.
 *
 * Eight arms, one literal `describe`, straight-line `it` with string-literal titles (the MF
 * census law, preamble §P5). Every loop runs INSIDE a named test. Every scanned negative carries
 * its `// anchored:` line (§P3). A1 is the guard-the-guard arm the family opens with: the
 * inference rows are proved LIVE against the REAL catalog and keyed right — never a fixture
 * spelling (the TE-T2B lesson; the D-8 fixture-mirrors-the-deriver class) — before any arm
 * below can pass on nothing.
 *
 * Institutions are built from the REAL catalog rows the generator spreads onto a settlement
 * (`{ category, name, ...entry, source }`, assembleInstitutions.js) so the positive key arm
 * resolves the :886 'Underground network' row itself through `facetOf`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, it, expect } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { facetOf } from '../../src/domain/spatial/cohesionWeave.js';
import {
  deriveStrataExistence, institutionAnchorKey, sanitationRosterOf, sanitationRungSeeds,
  SEED_CLASSES, SANITATION_LADDER, SEED_LICENCES, SUBSTRUCTURE_FACET_KIND, SUBSTRUCTURE_VALUES,
  SUBTERRANEAN_FACET_KIND, STRATA_EXISTENCE_DERIVATION,
} from '../../src/domain/undercity/strataExistence.js';
import { JOINT_KINDS, TEMPERAMENTS, isJointKind, isTemperament } from '../../src/domain/undercity/jointVocabulary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** A settlement institution exactly as the generator spreads the catalog entry onto it. */
function real(tier, category, name) {
  const entry = institutionalCatalog[tier]?.[category]?.[name];
  if (!entry) throw new Error(`fixture names a catalog row that does not exist: ${tier}/${category}/${name}`);
  return { category, name, ...entry, source: 'generated', catalogId: catalogIdForName(name) };
}

/** The chokepoint's own text for a catalog row (name + type + category; type is absent on catalog rows). */
function substructureOfEveryCatalogRow() {
  /** @type {Record<string, string[]>} */
  const byValue = { crypt: [], cellar: [], sewer: [], mine: [], none: [] };
  const outside = [];
  const seen = new Set();
  for (const [tier, groups] of Object.entries(institutionalCatalog)) {
    for (const [category, rows] of Object.entries(groups)) {
      for (const name of Object.keys(rows)) {
        if (seen.has(name)) continue;
        seen.add(name);
        const v = facetOf(real(tier, category, name), SUBSTRUCTURE_FACET_KIND);
        if (v == null) continue;
        if (SUBSTRUCTURE_VALUES.includes(v)) byValue[v].push(name);
        else outside.push(`${name} → ${v}`);
      }
    }
  }
  for (const list of Object.values(byValue)) list.sort();
  return { byValue, outside, rowsSeen: seen.size };
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx|mjs)$/.test(entry)) out.push(p);
  }
  return out;
}

const DRY = { terrainType: 'hills', nearbyResources: ['timber', 'iron_ore'], nearbyResourcesNative: ['timber', 'iron_ore'] };
const MARSH = { terrainType: 'plains', nearbyResources: ['marshlands', 'timber'], nearbyResourcesNative: ['marshlands', 'timber'] };

describe('MF-UC0 — the underground existence gate, the substructure facet, and the joint vocabulary', () => {
  it('A1 · guard-the-guard: the substructure rows are LIVE against the REAL catalog and keyed right — exact name sets per value, first-match order proven, every vocabulary non-empty', () => {
    const { byValue, outside, rowsSeen } = substructureOfEveryCatalogRow();
    expect(rowsSeen, 'the catalog walk saw too few rows — the scan rotted').toBeGreaterThan(250);
    expect(outside, 'a catalog row resolved outside the closed substructure vocabulary').toEqual([]);
    // The one sewer row, the three workings, the ten burying houses, the nine storing commerces,
    // the two "access to" rows — every name a REAL catalog key, resolved through facetOf.
    expect(byValue.sewer).toEqual(['Sewage system']);
    expect(byValue.mine).toEqual(['Mine', 'Mine (open cast)', 'Stone quarry']);
    expect(byValue.crypt).toEqual([
      'Cathedral (10,000+ only)', 'Graveyard', 'Great cathedral', 'Major monasteries (5-10)', 'Monastery or friary',
      'Multiple monasteries', 'Parish church', 'Parish churches (10-30)', 'Parish churches (2-5)', 'Parish churches (50-100+)',
    ]);
    expect(byValue.cellar).toEqual([
      'Brewer', 'Brewery', 'City granaries', 'Communal root cellar', 'Merchant warehouses', 'State granary complex',
      'Town granary', 'Vintner', 'Warehouse district',
    ]);
    expect(byValue.none).toEqual(['Access to external mill', 'Access to parish church']);
    // First-match order is load-bearing: 'Access to parish church' contains "church" and would
    // infer a crypt for a church that stands 2–5 km away; the `none` row fires first.
    expect(facetOf(real('thorp', 'Religious', 'Access to parish church'), SUBSTRUCTURE_FACET_KIND)).toBe('none');
    expect(facetOf(real('village', 'Religious', 'Parish church'), SUBSTRUCTURE_FACET_KIND)).toBe('crypt');
    // The key is the catalog's spelling and the table's: a different kind resolves nothing.
    expect(facetOf(real('city', 'Infrastructure', 'Sewage system'), 'institutionSubstructures')).toBeNull();
    expect(SEED_CLASSES.length).toBeGreaterThan(0);
    expect(SANITATION_LADDER.length).toBeGreaterThan(0);
    expect(JOINT_KINDS.length).toBeGreaterThan(0);
    expect(TEMPERAMENTS.length).toBeGreaterThan(0);
  });

  it('A2 · no qualifying seed → no sheet: a real seedless roster, a cesspit rung, and garbage all read exists:false', () => {
    const seedless = { institutions: [real('thorp', 'Government', 'Household elder'), real('thorp', 'Religious', 'Wayside shrine'), real('thorp', 'Criminal', 'Local fence')], config: DRY };
    const r = deriveStrataExistence(seedless);
    expect(r).toEqual({ exists: false, seeds: [], refused: [], derivation: STRATA_EXISTENCE_DERIVATION });
    // §311.7.1: cesspits contribute no sheet — the bottom rung is not a seed.
    expect(sanitationRungSeeds('cesspits')).toBe(false);
    expect(deriveStrataExistence(seedless, { sanitationRung: 'cesspits' }).exists).toBe(false);
    expect(sanitationRungSeeds('not_a_rung')).toBe(false);
    expect(sanitationRungSeeds(undefined)).toBe(false);
    // Total on garbage: never throws, never invents.
    expect(deriveStrataExistence(null).exists).toBe(false);
    expect(deriveStrataExistence(undefined).seeds).toEqual([]);
    expect(deriveStrataExistence({ institutions: [null, 4, 'x', {}, { name: 7 }] }).exists).toBe(false);
    expect(deriveStrataExistence({ institutions: 'not-a-list', config: 'not-a-config' }).exists).toBe(false);
  });

  it('A3 · one modest seed → the sheet exists (the two-level reading\'s FIRST level): a root cellar alone, and a culvert alone', () => {
    const cellarOnly = { institutions: [real('thorp', 'Government', 'Household elder'), real('thorp', 'Infrastructure', 'Communal root cellar')], config: DRY };
    const r = deriveStrataExistence(cellarOnly);
    expect(r.exists).toBe(true);
    expect(r.seeds).toEqual([{
      class: 'cellar', licence: 'INSTITUTION_FACET', home: 'institutions', anchor: 'communal_root_cellar',
      name: 'Communal root cellar', facetKind: SUBSTRUCTURE_FACET_KIND, facetValue: 'cellar', terrain: 'hills',
    }]);
    expect(r.refused).toEqual([]);
    // The honest mundane network, however modest: a culverted stream / market drain is a small real seed.
    const seedless = { institutions: [real('thorp', 'Government', 'Household elder')], config: DRY };
    const c = deriveStrataExistence(seedless, { sanitationRung: 'culvert' });
    expect(c.exists).toBe(true);
    expect(c.seeds).toEqual([{
      class: 'sanitation', licence: 'DERIVED_RUNG', home: 'sanitation_ladder', anchor: null, name: null,
      facetKind: 'sanitationRung', facetValue: 'culvert', terrain: 'hills',
    }]);
    // Totality, not a loop that dies at its first failing rung (the seed-loop walker's class).
    expect(SANITATION_LADDER.slice(1).map((rung) => [rung, sanitationRungSeeds(rung)]))
      .toEqual([['culvert', true], ['quarter_network', true], ['full_web', true]]);
    // Undercity-proper predicates (criminal drivers) are UC-4's: a sheet needs none of them.
    expect(Object.keys(r)).toEqual(['exists', 'seeds', 'refused', 'derivation']);
  });

  it('A4 · a facet-DECLARED custom institution counts, whatever its English — including a custom sanitation/drains facet that joins the shared roster; `none` overrides; an unknown value licenses nothing', () => {
    const drains = { name: 'The Old Culverts', facets: { [SUBSTRUCTURE_FACET_KIND]: 'sewer' } };
    const ossuary = { name: 'House of Quiet Bones', tags: [`facet:${SUBSTRUCTURE_FACET_KIND}:crypt`] };
    const warren = { name: 'The Warren', tags: [`facet:${SUBTERRANEAN_FACET_KIND}:${SUBTERRANEAN_FACET_KIND}`] };
    const openSky = { name: 'Temple of the Open Sky', facets: { [SUBSTRUCTURE_FACET_KIND]: 'none' } };
    const vault = { name: 'Counting-house vault', facets: { [SUBSTRUCTURE_FACET_KIND]: 'vault' } };
    const r = deriveStrataExistence({ institutions: [openSky, vault, warren, ossuary, drains], config: DRY });
    expect(r.exists).toBe(true);
    expect(r.seeds.map((s) => [s.class, s.anchor, s.facetKind, s.facetValue])).toEqual([
      ['crypt', 'House of Quiet Bones', SUBSTRUCTURE_FACET_KIND, 'crypt'],
      ['sanitation', 'The Old Culverts', SUBSTRUCTURE_FACET_KIND, 'sewer'],
      ['subterranean', 'The Warren', SUBTERRANEAN_FACET_KIND, SUBTERRANEAN_FACET_KIND],
    ]);
    // The declared `none` beat the crypt inference "Temple" would otherwise earn — DECLARED over INFERRED.
    expect(facetOf({ name: 'Temple of the Open Sky' }, SUBSTRUCTURE_FACET_KIND)).toBe('crypt');
    expect(facetOf(openSky, SUBSTRUCTURE_FACET_KIND)).toBe('none');
    const anchors = r.seeds.map((s) => s.anchor);
    expectAbsentWithAnchor(anchors, 'Temple of the Open Sky', 'House of Quiet Bones', 'a declared none must not seed');
    expectAbsentWithAnchor(anchors, 'Counting-house vault', 'The Old Culverts', 'a value outside the closed set must not seed');
    // ONE TRUTH WITH UC-1: the custom drains facet is the same roster read UC-1's FULL WEB rung consumes.
    expect(sanitationRosterOf([openSky, vault, warren, ossuary, drains]).map((i) => i.name)).toEqual(['The Old Culverts']);
    expect(SEED_LICENCES).toContain('INSTITUTION_FACET');
  });

  it('A5 · the catalog\'s marsh/floodplain forbiddance is honoured: the real network row is REFUSED on a marsh and seeds on dry hills; a custom subterranean row inherits the class rule; a custom-labelled marsh does not refuse', () => {
    const network = real('village', 'Criminal', 'Underground network');
    expect(network.forbiddenResources).toEqual(['marshlands', 'fertile_floodplain']);
    const onMarsh = deriveStrataExistence({ institutions: [network], config: MARSH });
    expect(onMarsh.exists).toBe(false);
    expect(onMarsh.seeds).toEqual([]);
    expect(onMarsh.refused).toEqual([{
      class: 'subterranean', licence: 'INSTITUTION_FACET', home: 'institutions', anchor: 'underground_network',
      name: 'Underground network', facetKind: SUBTERRANEAN_FACET_KIND, facetValue: SUBTERRANEAN_FACET_KIND,
      terrain: 'plains', refusal: 'FORBIDDEN_RESOURCE', resources: ['marshlands'],
    }]);
    const onHills = deriveStrataExistence({ institutions: [network], config: DRY });
    expect(onHills.exists).toBe(true);
    expect(onHills.seeds.map((s) => s.anchor)).toEqual(['underground_network']);
    expect(onHills.refused).toEqual([]);
    // A custom row declaring the subterranean facet carries no forbiddance of its own and still
    // inherits "tunnels flood" from the catalog's class union — by key, never by name.
    const warren = { name: 'The Warren', facets: { [SUBTERRANEAN_FACET_KIND]: SUBTERRANEAN_FACET_KIND } };
    const flood = { terrainType: 'riverside', nearbyResources: ['fertile_floodplain'], nearbyResourcesNative: ['fertile_floodplain'] };
    const custom = deriveStrataExistence({ institutions: [warren], config: flood });
    expect(custom.exists).toBe(false);
    expect(custom.refused.map((x) => [x.anchor, x.resources])).toEqual([['The Warren', ['fertile_floodplain']]]);
    // The NATIVE projection, exactly as assembleInstitutions refuses: a custom-labelled
    // "marshlands" (nearbyResourcesCustom) grants no native physics and does not refuse.
    const customLabel = { terrainType: 'plains', nearbyResources: ['marshlands'], nearbyResourcesNative: [], nearbyResourcesCustom: ['marshlands'] };
    expect(deriveStrataExistence({ institutions: [network], config: customLabel }).exists).toBe(true);
    // The crypt beside it is untouched by the network's forbiddance — refusal is per row, not per settlement.
    const both = deriveStrataExistence({ institutions: [network, real('village', 'Religious', 'Parish church')], config: MARSH });
    expect(both.exists).toBe(true);
    expect(both.seeds.map((s) => s.class)).toEqual(['crypt']);
    expect(both.refused.map((s) => s.class)).toEqual(['subterranean']);
  });

  it('A6 · deterministic, closed, pure and dormant: same input → same output; every vocabulary is the frozen literal; no nondeterminism token and no townMap import is reachable; nothing in src imports the leaves', () => {
    const roster = [
      real('city', 'Infrastructure', 'Sewage system'), real('city', 'Religious', 'Cathedral (10,000+ only)'),
      real('city', 'Economy', 'Warehouse district'), real('village', 'Crafts', 'Mine'), real('city', 'Criminal', 'Underground network'),
      { name: 'Legacy Granary' }, { name: 'Old Chapel Crypt', facets: { [SUBSTRUCTURE_FACET_KIND]: 'crypt' } },
    ];
    const a = deriveStrataExistence({ institutions: roster, config: DRY }, { sanitationRung: 'full_web' });
    const b = deriveStrataExistence({ institutions: [...roster].reverse(), config: { ...DRY } }, { sanitationRung: 'full_web' });
    expect(a).toEqual(b);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.seeds.map((s) => s.anchor)).toEqual([null, 'Legacy Granary', 'Old Chapel Crypt', 'cathedral_10_000_only', 'mine', 'sewage_system', 'underground_network', 'warehouse_district']);
    // Every row inside the closed sets — reported as the full list of offenders, never a first-failure floor.
    expect(a.seeds.filter((s) => !SEED_CLASSES.includes(s.class) || !SEED_LICENCES.includes(s.licence))).toEqual([]);
    // The anchor rule (§441.5(k)): the stamped catalogId leads; an unstamped legacy catalog name
    // slugs to the same key; an unknown custom name is its own key; no name → null.
    expect(institutionAnchorKey({ name: 'Sewage system', catalogId: 'sewage_system' })).toBe('sewage_system');
    // …and the stamp LEADS even when a DM has renamed the display name (the one case where the
    // stamp and the slug disagree — the branch mutant m5 convicts here, not on a catalog name).
    expect(institutionAnchorKey({ name: 'The Drains', catalogId: 'sewage_system' })).toBe('sewage_system');
    expect(institutionAnchorKey({ name: 'sewage SYSTEM ' })).toBe('sewage_system');
    expect(institutionAnchorKey({ name: 'The Warren' })).toBe('The Warren');
    expect(institutionAnchorKey({ catalogId: '', name: '' })).toBeNull();
    expect(institutionAnchorKey(null)).toBeNull();
    // The closed vocabularies, as literals (FINITE SEMANTICS — a changed list is a declared shift).
    expect(SEED_CLASSES).toEqual(['sanitation', 'crypt', 'cellar', 'mine', 'subterranean']);
    expect(SANITATION_LADDER).toEqual(['cesspits', 'culvert', 'quarter_network', 'full_web']);
    expect(SEED_LICENCES).toEqual(['INSTITUTION_FACET', 'DERIVED_RUNG']);
    expect(SUBSTRUCTURE_VALUES).toEqual(['crypt', 'cellar', 'sewer', 'mine', 'none']);
    expect(JOINT_KINDS).toEqual(['grate', 'stair', 'sealed_door', 'sluice', 'breach']);
    expect(TEMPERAMENTS).toEqual(['STATIC', 'MONOTONE', 'SURFACE_COUPLED', 'DEMAND_DRIVEN']);
    expect([SEED_CLASSES, SANITATION_LADDER, SEED_LICENCES, SUBSTRUCTURE_VALUES, JOINT_KINDS, TEMPERAMENTS].map(Object.isFrozen))
      .toEqual([true, true, true, true, true, true]);
    expect(JOINT_KINDS.every(isJointKind)).toBe(true);
    expect(TEMPERAMENTS.every(isTemperament)).toBe(true);
    expect(isJointKind('door')).toBe(false);
    expect(isTemperament('static')).toBe(false);
    // PURITY over raw text (prose counts — the leaves name the vocabulary only in the abstract).
    const TOKENS = ['Date', 'Math.random', 'Intl', 'toLocale', 'performance', 'crypto', 'localeCompare'];
    const leafPaths = ['src/domain/undercity/strataExistence.js', 'src/domain/undercity/jointVocabulary.js'];
    const sources = leafPaths.map((p) => readFileSync(join(ROOT, p), 'utf8'));
    expect(sources.every((src) => src.length > 1000), 'a leaf read empty — the scan rotted').toBe(true);
    const planted = `${sources[0]}\nconst stamped = ${'Date'}.now();`;
    expect(TOKENS.filter((t) => planted.includes(t))).toEqual(['Date']);
    // anchored: the planted control two lines up proves this exact filter convicts, so an empty list is purity and not a broken scan
    expect(TOKENS.filter((t) => sources.some((src) => src.includes(t)))).toEqual([]);
    // FIRST-PAINT CLOSURE (§441.5(d)): the leaves import no townMap module, and the estate's
    // production tree imports neither leaf — the member is dormant, reached only by later cars.
    const importsOf = (src) => [...src.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
    expect(importsOf(sources[0]).length).toBeGreaterThan(3);
    // anchored: the import list above is proven non-empty, so an empty townMap filter is a real absence
    expect(importsOf(sources[0]).concat(importsOf(sources[1])).filter((p) => p.includes('townMap'))).toEqual([]);
    const importers = walk(join(ROOT, 'src')).filter((p) => readFileSync(p, 'utf8').includes('domain/undercity/'))
      .map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();
    // anchored: the leaf's own header prose names `src/domain/undercity/**`, so the scanner is proven to see the token before the production set is asserted empty
    expect(importers).toEqual(['src/domain/undercity/strataExistence.js']);
  });

  it('A7 · G-43 arm: remove the last qualifying institution → exists flips false; restore it → true (directional, pre-declared)', () => {
    const roster = [real('village', 'Government', 'Village reeve'), real('village', 'Religious', 'Parish church'), real('village', 'Crafts', 'Stone quarry'), real('village', 'Economy', 'Weekly market')];
    const at = (insts) => deriveStrataExistence({ institutions: insts, config: DRY });
    expect(at(roster).seeds.map((s) => s.class)).toEqual(['crypt', 'mine']);
    const withoutQuarry = roster.filter((i) => i.name !== 'Stone quarry');
    expect(at(withoutQuarry).exists).toBe(true);
    expect(at(withoutQuarry).seeds.map((s) => s.class)).toEqual(['crypt']);
    const withoutBoth = withoutQuarry.filter((i) => i.name !== 'Parish church');
    expect(at(withoutBoth).exists).toBe(false);
    expect(at(withoutBoth).seeds).toEqual([]);
    // The flip is caused by the SEED, not by roster size: the two surviving rows still stand.
    expect(withoutBoth.map((i) => i.name)).toEqual(['Village reeve', 'Weekly market']);
    expect(at([...withoutBoth, real('village', 'Religious', 'Parish church')]).exists).toBe(true);
  });

  it('A8 · the POSITIVE KEY arm: the real :886 \'Underground network\' row resolves `subterranean` through facetOf under the catalog\'s own key, and a roster carrying the real \'Sewage system\' yields the sanitation seed of the full-web class that UC-1 reads from the same roster', () => {
    // All three tiers read as ONE table, so a failure names every tier rather than the first.
    const readings = ['village', 'town', 'city'].map((tier) => {
      const row = real(tier, 'Criminal', 'Underground network');
      return [tier, row.facets, facetOf(row, SUBTERRANEAN_FACET_KIND), facetOf(row, 'clandestine'),
        deriveStrataExistence({ institutions: [row], config: DRY }).seeds.map((s) => [s.class, s.anchor])];
    });
    const declared = { clandestine: 'clandestine', subterranean: 'subterranean' };
    expect(readings).toEqual([
      ['village', declared, 'subterranean', 'clandestine', [['subterranean', 'underground_network']]],
      ['town', declared, 'subterranean', 'clandestine', [['subterranean', 'underground_network']]],
      ['city', declared, 'subterranean', 'clandestine', [['subterranean', 'underground_network']]],
    ]);
    // The metropolis roster is the city catalog merged with the metropolis block
    // (assembleInstitutions.js mergeCatalogs), so 'Underground city' seeds by the same declared key
    // only if it declares one — it does not today, and this pin says so rather than inferring it.
    expect(facetOf(real('metropolis', 'Criminal', 'Underground city'), SUBTERRANEAN_FACET_KIND)).toBeNull();
    // ONE TRUTH WITH UC-1 (§441.1): the sanitation seed and UC-1's FULL WEB rung read the SAME
    // roster institution — the city block's 'Sewage system' (rolled at city and metropolis).
    const sewer = real('city', 'Infrastructure', 'Sewage system');
    const bathhouse = real('town', 'Economy', 'Public bathhouse');
    const aqueduct = real('city', 'Infrastructure', 'Aqueduct or water system');
    const city = { institutions: [real('city', 'Government', 'Mayor and council'), bathhouse, aqueduct, sewer], config: DRY };
    const r = deriveStrataExistence(city);
    expect(r.exists).toBe(true);
    expect(r.seeds).toEqual([{
      class: 'sanitation', licence: 'INSTITUTION_FACET', home: 'institutions', anchor: 'sewage_system',
      name: 'Sewage system', facetKind: SUBSTRUCTURE_FACET_KIND, facetValue: 'sewer', terrain: 'hills',
    }]);
    expect(sanitationRosterOf(city.institutions).map((i) => i.catalogId)).toEqual(['sewage_system']);
    // The bathhouse is sanitation-TAGGED (a UC-1 cause) and the aqueduct is the WATER side:
    // neither is the full-web institution, so neither seeds the sheet.
    expect(bathhouse.tags).toContain('sanitation');
    const seedAnchors = r.seeds.map((s) => s.anchor);
    expectAbsentWithAnchor(seedAnchors, 'public_bathhouse', 'sewage_system', 'a sanitation-tagged bathhouse is a cause, not the full-web class');
    expectAbsentWithAnchor(seedAnchors, 'aqueduct_or_water_system', 'sewage_system', 'the water row licenses wells, not drains');
    expect(sanitationRosterOf([bathhouse, aqueduct])).toEqual([]);
  });
});
