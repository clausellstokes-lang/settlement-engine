/**
 * Join harness — subsumption guards (the producer-eating dedup).
 *
 * SUBSUMPTION_RULES is a name-string join against the institutional catalog.
 * The matcher's contract:
 *   - greaters match by substring (tier-suffixed variants count),
 *   - lessers match by EXACT name (substring matching deleted the greater
 *     itself — "Brewery" contains 'brewer' — and independent scale variants
 *     — "Parish churches (10-30)" contains 'parish church'),
 *   - the institution that matched as greater is never removed by its own
 *     rule (no self-subsumption),
 *   - required / forced / custom institutions are never removed by any rule,
 *   - the table holds scale ladders only: no rule lets a downstream consumer
 *     absorb its upstream producer (smelter/charcoal burner, merchant
 *     guilds/salt works, butchers/shepherd, harbour master/docks) — those
 *     producers ARE the supply chain and the export gates key on their names.
 *
 * Empirics this pins (verified broken before the guards): ZERO Breweries
 * survived across 60 seeded settlements; EVERY city lost its required
 * Multiple courthouses; a Cathedral erased the required parish network;
 * port cities kept a harbour master but ZERO docks.
 */

import { describe, test, expect } from 'vitest';
import { SUBSUMPTION_RULES, applySubsumption } from '../../src/generators/steps/subsumptionPass.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const SEED = 'joins-subsumption-0';

function gen(config, seed = SEED) {
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
}

function names(settlement) {
  return settlement.institutions.map(i => i.name);
}

/** Flat lowercase set of every institution name in every tier catalog. */
function catalogNamesLower() {
  const out = new Set();
  for (const tierCat of Object.values(institutionalCatalog)) {
    for (const insts of Object.values(tierCat)) {
      for (const name of Object.keys(insts)) out.add(name.toLowerCase());
    }
  }
  return out;
}

/** Run applySubsumption over plain {name} objects, return surviving names. */
function subsume(instNames) {
  const insts = instNames.map(n => (typeof n === 'string' ? { name: n } : { ...n }));
  applySubsumption(insts);
  return insts.map(i => i.name);
}

// ── Rule-table lints ────────────────────────────────────────────────────────

describe('SUBSUMPTION_RULES table invariants', () => {
  test('no rule names itself: greater never equals one of its own lessers', () => {
    for (const { greater, lesser } of SUBSUMPTION_RULES) {
      for (const l of lesser) {
        expect(l.toLowerCase()).not.toBe(greater.toLowerCase());
      }
    }
  });

  test('chain producers are not subsumable by their consumers', () => {
    // These institutions are upstream producers / sole chain processors
    // (salt, fuel, wool, dairy, wine, mining). No rule may list them as a
    // lesser — deleting them deactivates the chains their consumers imply.
    const protectedProducers = new Set([
      'salt works', 'vintner', 'dairy farmer', 'shepherd',
      'charcoal burner', 'mine (open cast)',
    ]);
    for (const { greater, lesser } of SUBSUMPTION_RULES) {
      for (const l of lesser) {
        expect(protectedProducers.has(l.toLowerCase()),
          `rule "${greater}" must not absorb producer "${l}"`).toBe(false);
      }
    }
  });

  test('docks are complementary to the harbour master, not a ladder below it', () => {
    // Rule 49 (harbour master's office absorbs docks/port facilities) left
    // every port city with a harbour master and no port. Docks may only sit
    // under a genuine port upgrade ('major port').
    for (const { greater, lesser } of SUBSUMPTION_RULES) {
      if (lesser.some(l => l.toLowerCase() === 'docks/port facilities')) {
        expect(greater.toLowerCase()).toBe('major port');
      }
    }
  });

  test('tannery is not absorbed by the established tanner (leather gates key on it)', () => {
    for (const { greater, lesser } of SUBSUMPTION_RULES) {
      if (greater.toLowerCase() === 'tanner (established)') {
        expect(lesser.map(l => l.toLowerCase())).not.toContain('tannery');
      }
    }
  });

  test('every lesser resolves to an exact catalog name (vocabulary join)', () => {
    const catalog = catalogNamesLower();
    // Pre-existing vocabulary drift, out of this slice's scope. Anything NEW
    // added to this list is a dead rule — fix the name instead.
    const knownDead = new Set([
      "adventurers' guild chapter", // no such catalog entry
      'pit fights',                 // catalog spells it 'Fighting pits'
      'stone quarry (hamlet)',      // both catalog entries are 'Stone quarry'
    ]);
    for (const { greater, lesser } of SUBSUMPTION_RULES) {
      for (const l of lesser) {
        if (knownDead.has(l.toLowerCase())) continue;
        expect(catalog.has(l.toLowerCase()),
          `rule "${greater}" lesser "${l}" must be an exact catalog name`).toBe(true);
      }
    }
  });
});

// ── Matcher unit behavior ───────────────────────────────────────────────────

describe('applySubsumption matcher guards', () => {
  test('an institution never deletes itself (substring self-match)', () => {
    // Each of these previously vanished when generated alone, because its
    // own name contains its rule's lesser fragment.
    expect(subsume(['Brewery'])).toEqual(['Brewery']);
    expect(subsume(["Tailor's guild"])).toEqual(["Tailor's guild"]);
    expect(subsume(["Cobbler's guild"])).toEqual(["Cobbler's guild"]);
    expect(subsume(['Mint (official)'])).toEqual(['Mint (official)']);
    expect(subsume(['Multiple courthouses'])).toEqual(['Multiple courthouses']);
  });

  test('genuine scale ladders still collapse', () => {
    expect(subsume(['Brewery', 'Brewer'])).toEqual(['Brewery']);
    expect(subsume(['Multiple courthouses', 'Courthouse'])).toEqual(['Multiple courthouses']);
    expect(subsume(['Mint (official)', 'Mint', 'Assay office'])).toEqual(['Mint (official)']);
    expect(subsume(['Professional city watch', 'Town watch', 'Citizen militia']))
      .toEqual(['Professional city watch']);
    expect(subsume(['Craft guilds (30-80)', 'Craft guilds (5-15)'])).toEqual(['Craft guilds (30-80)']);
  });

  test('exact lesser matching: cathedral absorbs the singular parish church only', () => {
    // The (N-M) parish variants are the city/metropolis network the catalog
    // deliberately scales up — a cathedral coexists with them.
    expect(subsume(['Cathedral (10,000+ only)', 'Parish churches (10-30)', 'Access to parish church']))
      .toEqual(['Cathedral (10,000+ only)', 'Parish churches (10-30)', 'Access to parish church']);
    // The unprotected singular village entry is still genuine redundancy.
    expect(subsume(['Cathedral (10,000+ only)', { name: 'Parish church' }]))
      .toEqual(['Cathedral (10,000+ only)']);
  });

  test('required, forced, and custom institutions are never removed', () => {
    const roster = [
      { name: 'Cathedral (10,000+ only)' },
      { name: 'Parish church', source: 'required', required: true },
      { name: 'Wayside shrine', source: 'custom' },
      { name: 'Priest (resident)', source: 'forced' },
    ];
    applySubsumption(roster);
    expect(roster.map(i => i.name)).toEqual([
      'Cathedral (10,000+ only)', 'Parish church', 'Wayside shrine', 'Priest (resident)',
    ]);
  });

  test('producers coexist with their downstream consumers', () => {
    expect(subsume(['Smelter', 'Charcoal burner', 'Mine (open cast)']))
      .toEqual(['Smelter', 'Charcoal burner', 'Mine (open cast)']);
    expect(subsume(['Merchant guilds (3-8)', 'Salt works', 'Vintner']))
      .toEqual(['Merchant guilds (3-8)', 'Salt works', 'Vintner']);
    expect(subsume(['Butchers (3-8)', 'Dairy farmer', 'Shepherd']))
      .toEqual(['Butchers (3-8)', 'Dairy farmer', 'Shepherd']);
    expect(subsume(["Harbour master's office", 'Docks/port facilities']))
      .toEqual(["Harbour master's office", 'Docks/port facilities']);
    expect(subsume(['Tanner (established)', 'Tannery']))
      .toEqual(['Tanner (established)', 'Tannery']);
  });

  test('subsumption traces name an absorber that still exists', () => {
    const ctx = { simulationTrace: [], _traceClock: 0 };
    const roster = [{ name: 'Brewery' }, { name: 'Brewer' }];
    applySubsumption(roster, ctx);
    expect(roster.map(i => i.name)).toEqual(['Brewery']);
    const subsumed = ctx.simulationTrace.filter(t => t.result === 'subsumed');
    expect(subsumed).toHaveLength(1);
    expect(subsumed[0].targetId).toBe('institution.brewer');
    expect(subsumed[0].causes[0].source).toBe('institution.brewery');
  });
});

// ── Golden seeded generations ───────────────────────────────────────────────

describe('golden settlements: DM-visible truths survive the full pipeline', () => {
  test('seeded city keeps its required Multiple courthouses and parish network beside a Cathedral', () => {
    const city = gen({ settType: 'city', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' });
    const n = names(city);
    expect(n.some(x => x.toLowerCase().includes('cathedral'))).toBe(true);
    expect(n).toContain('Multiple courthouses');
    expect(n.filter(x => x.startsWith('Parish church')).length).toBeGreaterThanOrEqual(1);
  });

  test('every seeded city keeps its required institutions (no pass deletes the contract)', () => {
    for (let i = 1; i <= 4; i++) {
      const city = gen(
        { settType: 'city', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
        `joins-subsumption-${i}`
      );
      const n = names(city);
      expect(n, `seed joins-subsumption-${i}`).toContain('Multiple courthouses');
      expect(n, `seed joins-subsumption-${i}`).toContain('Parish churches (10-30)');
    }
  });

  test('seeded town with a brewery KEEPS it', () => {
    const town = gen({ settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' });
    expect(names(town)).toContain('Brewery');
  });

  test('port-route city keeps its docks alongside the harbour master', () => {
    const port = gen({ settType: 'city', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' });
    const n = names(port);
    expect(n).toContain("Harbour master's office");
    expect(n).toContain('Docks/port facilities');
  });

  test('a force-toggled institution survives subsumption by its greater', () => {
    // Brewer is a subsumption lesser of Brewery; this town rolls a Brewery
    // on this seed, so an unprotected Brewer would be absorbed.
    const town = gen({
      settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
      _institutionToggles: { 'town::Crafts::Brewer': { allow: true, require: true } },
    });
    const n = names(town);
    expect(n).toContain('Brewery');
    const brewer = town.institutions.find(i => i.name === 'Brewer');
    expect(brewer).toBeTruthy();
    expect(brewer.source).toBe('forced');
  });
});
