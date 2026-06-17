/**
 * tests/joins/institutionIdentity.test.js — Cohesion Wave 8 (structural
 * prevention): institutions join by catalog id, not by label.
 *
 * The disease this wave immunizes against: identity-by-label at the engine's
 * load-bearing joints — computeActiveChains matched chain processors by
 * 12-char name prefix (with an in-code NOTE confessing false matches), and
 * institutionLifecycle's PROCESSOR_MATCH did the same. Goods already have the
 * cure (exactGoodId); this brings institutions onto ids:
 *
 *   1. CATALOG IDS — every institutionalCatalog entry has a stable id (the
 *      deterministic slug of its canonical name, collision-checked at module
 *      load); catalogIdForName is an EXACT-normalized resolver, null for
 *      unknown (custom/DM) names. Same name at multiple tiers shares the id;
 *      distinct entries ('Merchant guilds (3-8)' vs '(15-40)') get distinct ids.
 *   2. STAMPING — assembleInstitutions stamps catalogId on every catalog
 *      institution it places; the stamp is a pure name→id lookup that consumes
 *      no rng, pinned by a same-seed golden recorded BEFORE the change.
 *   3. ID-FIRST JOINS — each chain pattern resolves ONCE to the catalog-id set
 *      the legacy fuzzy matcher accepts; stamped institutions compare by id
 *      (rename-proof), unstamped ones (legacy saves, custom, cascade) fall
 *      back to the fuzzy matcher. By construction id-match === fuzzy-match for
 *      every catalog name, so same-seed chain outputs are identical and the
 *      known false matches are FROZEN as-is (owner balance pass pending), not
 *      silently changed.
 */
import { describe, it, expect } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  institutionalCatalog,
  catalogIdForName,
  slugifyInstitutionName,
} from '../../src/data/institutionalCatalog.js';
import {
  computeActiveChains,
  institutionMatchesProcessor,
  institutionMatchesKeyword,
  processorPatternIdSet,
} from '../../src/generators/computeActiveChains.js';
import { institutionContribution } from '../../src/domain/worldPulse/institutionLifecycle.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';

// ── Shared fixtures ───────────────────────────────────────────────────────────

const ALL_CATALOG_NAMES = [...new Set(
  Object.values(institutionalCatalog).flatMap(tierCatalog =>
    Object.values(tierCatalog).flatMap(group => Object.keys(group))),
)];

const ALL_CHAIN_PATTERNS = [...new Set(
  Object.values(SUPPLY_CHAIN_NEEDS).flatMap(need =>
    need.chains.flatMap(chain => chain.processingInstitutions || [])),
)];

// Independent replica of the legacy fuzzy matcher (computeActiveChains): an
// institution name matches a processor pattern when it CONTAINS the pattern
// lowercased and truncated to 12 chars. The id path must agree with THIS.
const fuzzy = (name, pattern) =>
  String(name).toLowerCase().includes(String(pattern).toLowerCase().slice(0, 12));

// ── 1. Catalog identity ───────────────────────────────────────────────────────

describe('catalog ids (deterministic slugs, collision-free, exact resolver)', () => {
  it('every catalog entry resolves to a non-empty id', () => {
    const unresolved = ALL_CATALOG_NAMES.filter(n => !catalogIdForName(n));
    expect(unresolved).toEqual([]);
  });

  it('distinct canonical names never share an id (the module-load collision check, re-proven)', () => {
    const byId = new Map();
    const collisions = [];
    for (const name of ALL_CATALOG_NAMES) {
      const id = catalogIdForName(name);
      const holder = byId.get(id);
      if (holder && holder !== name) collisions.push(`${holder} / ${name} -> ${id}`);
      byId.set(id, name);
    }
    expect(collisions).toEqual([]);
  });

  it('multi-tier entries share the id; scale-distinct entries get distinct ids', () => {
    // 'Wayside shrine' exists at thorp AND hamlet — one institution, one id.
    expect(catalogIdForName('Wayside shrine')).toBe('wayside_shrine');
    // Scale tiers of the guild family are DISTINCT catalog entries.
    expect(catalogIdForName('Merchant guilds (3-8)')).toBe('merchant_guilds_3_8');
    expect(catalogIdForName('Merchant guilds (15-40)')).toBe('merchant_guilds_15_40');
    expect(catalogIdForName('Merchant guilds (3-8)'))
      .not.toBe(catalogIdForName('Merchant guilds (15-40)'));
  });

  it('the slugger is deterministic over punctuation-heavy names', () => {
    expect(slugifyInstitutionName("Lord's reeve")).toBe('lord_s_reeve');
    expect(slugifyInstitutionName('Docks/port facilities')).toBe('docks_port_facilities');
    expect(slugifyInstitutionName('Mine (open cast)')).toBe('mine_open_cast');
  });

  it('resolution is EXACT-normalized: case/whitespace tolerated, no fuzzy matching', () => {
    expect(catalogIdForName('  wAYSIDE Shrine ')).toBe('wayside_shrine');
    expect(catalogIdForName('Merchant guild')).toBeNull();   // near-miss: no fuzz
    expect(catalogIdForName('Totally Custom Hut')).toBeNull(); // custom/DM: null
    expect(catalogIdForName('')).toBeNull();
    expect(catalogIdForName(null)).toBeNull();
  });
});

// ── 2. Stamping + same-seed identity ─────────────────────────────────────────

const GOLDEN_SEED = 'wave8-institution-identity';
const GOLDEN_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'crossroads',
  priorityEconomy: 60,
  priorityMilitary: 55,
};

// Recorded from this seed/config BEFORE catalogId stamping existed (clean
// HEAD f677dac). Stamping must not consume rng or move any other output:
// roster, chain statuses, and exports stay byte-identical — only the new
// catalogId fields appear.
const GOLDEN_ROSTER = [
  'required:Town granary', 'required:Market square', 'required:Weekly market',
  'generated:Annual fair', 'generated:Merchant guilds (3-8)', 'required:Craft guilds (5-15)',
  'generated:Money changers', 'required:Inn (multiple)', 'required:Taverns (5-20)',
  "generated:Carriers' guild", 'generated:Coaching inn', 'generated:Slave market',
  'generated:Assay office', 'generated:Customs house', 'generated:Post relay station',
  'generated:Stable district', "generated:Caravaneer's post", 'required:Mills (2-5)',
  'generated:Blacksmiths (3-10)', 'generated:Carpenters (5-15)', 'generated:Weavers/Textile workers',
  'generated:Tanners', 'generated:Butchers (3-8)', 'generated:Bakers (5-15)',
  'generated:Apothecary (established)', 'generated:Bowyers & fletchers (guild)', 'generated:Smelter',
  'generated:Brewery', "generated:Cobbler's guild", "generated:Tailor's guild",
  'generated:Town crier', 'required:Parish churches (2-5)', 'generated:Small hospital',
  'generated:Almshouse', 'generated:Mayor and council', 'required:Town watch',
  'generated:Free company hall', "generated:Wizard's tower", "generated:Warden's Lodge",
  'generated:Merchant warehouses', 'generated:Hireling hall', "generated:Adventurers' charter hall",
  'generated:Smuggling operation', 'generated:Front businesses', 'generated:Gambling den',
  'required:Town hall', 'generated:Small prison/stocks', 'required:Housing (180-1000 structures)',
  'required:Multiple water sources', "cascade:Travelers' inn", 'cascade:Fish market',
  'cascade:Toll bridge', 'cascade:Thatcher', 'cascade:Sawmill', 'cascade:Tannery',
  'cascade:Brickmaker',
];
const GOLDEN_CHAINS = [
  'trade_entrepot.transit_finance:vulnerable', 'arcane_magical.spellcasting:vulnerable',
  'arcane_magical.magical_goods:vulnerable', 'entertainment_culture.tavern_social:vulnerable',
  'food_security.fishing:vulnerable', 'healing_medicine.hospital:vulnerable',
  'manufacturing.food_processing:vulnerable', 'food_security.river_fishing:vulnerable',
  'food_security.animal_husbandry:vulnerable', 'manufacturing.textiles:running',
  'manufacturing.weapons_armor:vulnerable', 'manufacturing.textile_finishing:vulnerable',
  'manufacturing.leather_goods:vulnerable', 'raw_extraction.iron:running',
  'raw_extraction.smelting:vulnerable', 'trade_entrepot.spices_dyes:running',
  'trade_entrepot.warehouse_logistics:running', 'trade_entrepot.caravan_trade:vulnerable',
  'trade_entrepot.crossroads_trade:running', 'criminal_economy.smuggling:entrepot',
  'trade_entrepot.wine_spirits:entrepot', 'trade_entrepot.camel_caravan:entrepot',
  'criminal_economy.black_market:operational', 'criminal_economy.slave_trade:operational',
  'defense_security.garrison:vulnerable', 'defense_security.mercenary:operational',
  'defense_security.adventuring_escort:operational', 'entertainment_culture.gambling_arena:operational',
  'knowledge_information.intelligence:vulnerable', 'religion_civic.parish:operational',
  'religion_civic.law_governance:operational',
];
const GOLDEN_EXPORTS = [
  'Transit trade', 'Toll revenue', 'Spellcasting (1st-3rd level)', 'Magical identification',
  'Magical item market', 'Weapon enchantment', 'Salted fish', 'Smoked seafood', 'Baked goods',
  'Preserved foods', 'Rare spices and exotic dyes', 'Meals and drink',
  'Financial services (letters of credit)',
];

describe('stamping is a pure post-pass (same-seed identity)', () => {
  const settlement = generateSettlementPipeline(GOLDEN_CFG, null, { seed: GOLDEN_SEED, customContent: {} });

  it('the pre-change golden holds: roster, chain statuses, exports are unmoved', () => {
    expect(settlement.institutions.map(i => `${i.source}:${i.name}`)).toEqual(GOLDEN_ROSTER);
    expect((settlement.economicState?.activeChains || []).map(c => `${c.needKey}.${c.chainId}:${c.status}`))
      .toEqual(GOLDEN_CHAINS);
    expect(settlement.economicState?.primaryExports).toEqual(GOLDEN_EXPORTS);
  });

  it('every institution assembleInstitutions placed carries its catalog id', () => {
    const assembled = settlement.institutions.filter(i =>
      ['required', 'generated', 'forced'].includes(i.source));
    expect(assembled.length).toBeGreaterThan(0);
    for (const inst of assembled) {
      expect(inst.catalogId, inst.name).toBe(catalogIdForName(inst.name));
      expect(inst.catalogId, inst.name).toBeTruthy();
    }
  });

  it('any stamped catalogId is the pure lookup of the name — the field adds identity, not information', () => {
    for (const inst of settlement.institutions) {
      if ('catalogId' in inst) {
        expect(inst.catalogId, inst.name).toBe(catalogIdForName(inst.name));
      }
    }
  });

  it('generation stays deterministic: the same seed reproduces the settlement byte-for-byte', () => {
    const again = generateSettlementPipeline(GOLDEN_CFG, null, { seed: GOLDEN_SEED, customContent: {} });
    expect(JSON.stringify(again.institutions)).toBe(JSON.stringify(settlement.institutions));
    expect(JSON.stringify(again.economicState)).toBe(JSON.stringify(settlement.economicState));
  });

  it('custom/DM institutions are NEVER stamped — they keep no catalogId at all', () => {
    const withCustom = generateSettlementPipeline(GOLDEN_CFG, null, {
      seed: GOLDEN_SEED,
      customContent: {
        institutions: [{
          localUid: 'cc-shrine-1',
          name: 'Cartwheel Shrine of the Verge',
          essential: true,
          category: 'Religious',
          updatedAt: '2026-06-11T00:00:00.000Z',
        }],
      },
    });
    const custom = withCustom.institutions.find(i => i.name === 'Cartwheel Shrine of the Verge');
    expect(custom).toBeTruthy();
    expect(custom.source).toBe('custom');
    expect('catalogId' in custom).toBe(false);
  });
});

// ── 3. The behavior contract: id-match === fuzzy-match ───────────────────────

describe('id-first joins select EXACTLY what the fuzzy matcher selected', () => {
  it('for every catalog institution × every chain pattern, id-match === fuzzy-match', () => {
    // The pattern→id-set is BUILT from the fuzzy matcher, so this holds by
    // construction — and this pin keeps it that way: any drift between the
    // two paths (a re-tuned slug, a hand-edited id set) fails loudly here.
    const disagreements = [];
    for (const name of ALL_CATALOG_NAMES) {
      const stamped = { name, catalogId: catalogIdForName(name) };
      for (const pattern of ALL_CHAIN_PATTERNS) {
        if (institutionMatchesProcessor(stamped, pattern) !== fuzzy(name, pattern)) {
          disagreements.push(`${name} × ${pattern}`);
        }
      }
    }
    expect(disagreements).toEqual([]);
  });

  it('unstamped institutions (legacy saves, custom) keep the fuzzy matcher verbatim', () => {
    for (const pattern of ALL_CHAIN_PATTERNS.slice(0, 25)) {
      for (const name of ['Blacksmiths (3-10)', 'Parish church', 'My Bespoke Wizard Hut']) {
        expect(institutionMatchesProcessor({ name }, pattern), `${name} × ${pattern}`)
          .toBe(fuzzy(name, pattern));
      }
    }
  });

  it('a real generated roster derives IDENTICAL chains with and without its stamps', () => {
    for (const [cfg, seed] of [
      [GOLDEN_CFG, GOLDEN_SEED],
      [{ settType: 'city', culture: 'norse', tradeRouteAccess: 'port' }, 'wave8-port-city'],
      [{ settType: 'village', tradeRouteAccess: 'river' }, 'wave8-river-village'],
    ]) {
      const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
      const resources = s.config?.nearbyResources || [];
      const route = s.economicState?.tradeAccess || s.config?.tradeRouteAccess || 'road';
      const stripped = s.institutions.map(({ catalogId, ...rest }) => rest);
      const withIds = computeActiveChains(s.institutions, resources, s.tier, route);
      const withoutIds = computeActiveChains(stripped, resources, s.tier, route);
      expect(JSON.stringify(withIds), seed).toBe(JSON.stringify(withoutIds));
    }
  });

  it('the cure works: a RENAMED stamped institution keeps its chains; a bare rename loses them', () => {
    // This is the new capability the id buys — a DM rename (or a future
    // catalog respelling) no longer severs the institution from its economy.
    // SCOPE: only the two converted joints (computeActiveChains,
    // institutionLifecycle's processor join) honor catalogId; the ~131 frozen
    // label-join sites still join by name — the labelJoins.test.js freeze
    // inventory is the conversion roadmap.
    const renamedStamped = [{ id: 'i1', name: 'The Ember Hall', catalogId: catalogIdForName('Blacksmiths (3-10)') }];
    const renamedBare = [{ id: 'i1', name: 'The Ember Hall' }];
    const ironStamped = computeActiveChains(renamedStamped, ['iron_deposits'], 'town', 'road')
      .find(c => c.chainId === 'iron');
    expect(ironStamped).toBeTruthy();
    expect(ironStamped.status).toBe('running');
    expect(computeActiveChains(renamedBare, ['iron_deposits'], 'town', 'road')
      .some(c => c.chainId === 'iron')).toBe(false);
  });

  it("the 'Mill' false matches are FROZEN, not silently fixed (owner balance pass pending)", () => {
    // The in-code NOTE case: the 'Mill' pattern fuzzy-matches names that
    // merely CONTAIN 'mill' — including 'Access to external mill' (no local
    // mill!) and the sawmills (timber, not flour). The id mapping inherits
    // these verbatim so same-seed outputs cannot move; re-pointing them is an
    // owner decision, recorded for a balance pass.
    expect([...processorPatternIdSet('Mill')].sort()).toEqual([
      'access_to_external_mill',
      'mill',
      'mills_2_5',
      'sawmill',
      'sawmill_commercial',
    ]);
  });
});

// ── 3b. tradition / magic-transit gates are id-first (A+ generators.4) ────────

// The keywords the tradition + magic-transit gates in computeActiveChains match
// institutions against (druid/divine/arcane/alchemy + the magic-transit hub).
const TRADITION_KEYWORDS = [
  'druid circle', 'grove shrine', 'elder grove', "warden's lodge", 'sacred grove',
  'cathedral', 'monastery', 'great cathedral', 'parish church', 'friary', 'priest',
  'wizard', 'mages', 'arcane', 'enchant', 'spellcasting', 'academy of magic',
  'alchemist', 'apothecary district', 'alchemist quarter',
  'teleportation', 'planar', 'airship',
];

describe('tradition / magic-transit gates select EXACTLY what name-includes selected', () => {
  it('for every catalog institution × every tradition keyword, id-match === substring-match', () => {
    // institutionMatchesKeyword's id-set is BUILT from the same name.includes
    // rule the gates used, so this holds by construction — this pin keeps the
    // id path and the substring path from ever drifting apart.
    const disagreements = [];
    for (const name of ALL_CATALOG_NAMES) {
      const stamped = { name, catalogId: catalogIdForName(name) };
      for (const kw of TRADITION_KEYWORDS) {
        const idMatch = institutionMatchesKeyword(stamped, kw);
        const substringMatch = name.toLowerCase().includes(kw.toLowerCase());
        if (idMatch !== substringMatch) disagreements.push(`${name} × ${kw}`);
      }
    }
    expect(disagreements).toEqual([]);
  });

  it('unstamped institutions keep the substring matcher verbatim', () => {
    for (const kw of TRADITION_KEYWORDS) {
      for (const name of ["Mages' guild", 'The Spire', 'My Bespoke Wizard Hut']) {
        expect(institutionMatchesKeyword({ name }, kw), `${name} × ${kw}`)
          .toBe(name.toLowerCase().includes(kw.toLowerCase()));
      }
    }
  });

  it('the cure: a RENAMED stamped arcane institution still reads as a mages tradition; a bare rename does not', () => {
    const renamedStamped = { id: 'i1', name: 'The Obsidian Spire', catalogId: catalogIdForName("Mages' guild") };
    const renamedBare = { id: 'i1', name: 'The Obsidian Spire' };
    // The arcane tradition gate fires on the 'mages' keyword; the stamp carries
    // it through a rename, the bare rename severs it.
    expect(catalogIdForName("Mages' guild")).toBeTruthy(); // guard: the fixture is a real catalog name
    expect(institutionMatchesKeyword(renamedStamped, 'mages')).toBe(true);
    expect(institutionMatchesKeyword(renamedBare, 'mages')).toBe(false);
    // The id set carries only what the catalog NAME carried — "Mages' guild"
    // has no 'arcane' substring, so the stamp does not invent an arcane match.
    expect(institutionMatchesKeyword(renamedStamped, 'arcane')).toBe(false);
  });
});

// ── 4. institutionLifecycle parity (the second load-bearing joint) ───────────

describe("institutionLifecycle's processor join is id-first with the same fallback", () => {
  const settlementWith = (inst) => ({
    tier: 'town',
    institutions: [inst],
    config: { nearbyResources: ['iron_deposits'], tradeRouteAccess: 'road', priorityMagic: 50 },
    economicState: { primaryExports: [], tradeAccess: 'road' },
  });
  const stamped = { id: 'i1', name: 'Blacksmiths (3-10)', catalogId: catalogIdForName('Blacksmiths (3-10)') };
  const legacy = { id: 'i1', name: 'Blacksmiths (3-10)' };
  const renamedStamped = { id: 'i1', name: 'The Ember Hall', catalogId: catalogIdForName('Blacksmiths (3-10)') };
  const renamedBare = { id: 'i1', name: 'The Ember Hall' };

  it('stamped and legacy spellings of the same institution score the same contribution', () => {
    const a = institutionContribution(settlementWith(stamped), stamped);
    const b = institutionContribution(settlementWith(legacy), legacy);
    expect(a).toBeGreaterThan(0); // it IS a chain processor for the iron economy
    expect(a).toBe(b);
  });

  it('the closure shield survives a rename when stamped, and only when stamped', () => {
    expect(institutionContribution(settlementWith(renamedStamped), renamedStamped))
      .toBe(institutionContribution(settlementWith(stamped), stamped));
    expect(institutionContribution(settlementWith(renamedBare), renamedBare)).toBe(0);
  });
});
