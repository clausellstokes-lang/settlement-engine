/**
 * tests/generators/roleCategory.test.js
 *
 * Pins the metadata-driven NPC categorization that replaced brittle substring
 * keyword matching in npcGenerator's faction/secret/category assignment.
 *
 * Three things are proven:
 *  1. roleToCategory classifies representative roles correctly, longest-keyword-
 *     first (a generic substring never shadows a specific role: 'crime lord' is
 *     criminal, not government).
 *  2. institutionInCategory / institutionCategoryFlags / isCommerceGuild drive off
 *     catalog metadata (group category + tags) and so catch whole institution
 *     families the old `name.includes(...)` triple missed ('Street gang', 'Wayside
 *     shrine', 'Teleportation circle') while excluding non-matches.
 *  3. NPC generation stays deterministic — same seed ⇒ byte-identical NPCs.
 */
import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { generateNPCs } from '../../src/generators/npcGenerator.js';
import {
  roleToCategory,
  institutionInCategory,
  institutionCategoryFlags,
  isCommerceGuild,
} from '../../src/generators/roleCategory.js';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';

// ── 1. roleToCategory ─────────────────────────────────────────────────────────

describe('roleToCategory', () => {
  it.each([
    ['Mayor', 'government'],
    ['Chief Magistrate', 'government'],
    ['Council Member', 'government'],
    ['Guard Captain', 'military'],
    ['City Watch Chief', 'military'],
    ['Garrison Commander', 'military'],
    ['Parish Priest', 'religious'],
    ['High Priest', 'religious'],
    ['Bishop', 'religious'],
    ['Guild Archmage', 'magic'],
    ['Hedge Wizard', 'magic'],
    ['Wealthiest Merchant', 'economy'],
    ['Moneylender', 'economy'],
    ['Guild Master', 'economy'],
    ['Master Blacksmith', 'crafts'],
    ['Land Agent', 'noble'],
    ['Baron/Baroness', 'noble'],
  ])('classifies %s as %s', (role, expected) => {
    expect(roleToCategory(role)).toBe(expected);
  });

  it('matches the most specific keyword first (no generic shadowing)', () => {
    // 'lord' (noble) must not swallow 'crime lord' (criminal); 'official'
    // (government) must not swallow 'corrupt official' (criminal).
    expect(roleToCategory('Crime Lord')).toBe('criminal');
    expect(roleToCategory('Corrupt Official')).toBe('criminal');
    // Plain 'lord'/'official' still resolve to their generic category.
    expect(roleToCategory('Lord of the Manor')).toBe('noble');
    expect(roleToCategory('Customs Official')).toBe('government');
  });

  it('falls back to the supplied default for unknown roles', () => {
    expect(roleToCategory('Wandering Bard')).toBe('other');
    expect(roleToCategory('Wandering Bard', 'civilian')).toBe('civilian');
    expect(roleToCategory('')).toBe('other');
    expect(roleToCategory(null)).toBe('other');
  });
});

// ── 2. institution metadata categorization ────────────────────────────────────

// Stamp a catalog institution the way assembleInstitutions does (group category +
// catalogId + the catalog def's fields), to test the metadata-first path.
function stamp(name) {
  for (const tierCatalog of Object.values(institutionalCatalog)) {
    for (const [group, group_insts] of Object.entries(tierCatalog)) {
      if (group_insts[name]) {
        return { name, category: group, ...group_insts[name], catalogId: catalogIdForName(name) };
      }
    }
  }
  throw new Error(`catalog institution not found: ${name}`);
}

describe('institutionInCategory (metadata-driven)', () => {
  it('catches criminal institution families the old substring test missed', () => {
    // Old: name.includes('thieves'|'black market'|'smuggl') — these all missed.
    for (const name of ['Street gang', 'Front businesses', 'Local fence', 'Outlaw shelter', 'Assassins\' guild']) {
      expect(institutionInCategory(stamp(name), 'criminal'), name).toBe(true);
    }
    // And still catches the ones substrings DID catch.
    expect(institutionInCategory(stamp('Black market'), 'criminal')).toBe(true);
    expect(institutionInCategory(stamp('Smuggling network'), 'criminal')).toBe(true);
  });

  it('catches magic institution families the old substring test missed', () => {
    // Old: name.includes('wizard'|'mage'|'alchemist') — these all missed.
    for (const name of ['Teleportation circle', 'Enchanter\'s shop', 'Scroll scribe', 'Academy of magic']) {
      expect(institutionInCategory(stamp(name), 'magic'), name).toBe(true);
    }
    expect(institutionInCategory(stamp('Wizard\'s tower'), 'magic')).toBe(true);
  });

  it('catches religion institution families the old substring test missed', () => {
    // Old: name.includes('church'|'cathedral'|'monastery') — these all missed.
    for (const name of ['Wayside shrine', 'Priest (resident)', 'Almshouse']) {
      expect(institutionInCategory(stamp(name), 'religion'), name).toBe(true);
    }
    expect(institutionInCategory(stamp('Parish church'), 'religion')).toBe(true);
  });

  it('does not cross-categorize a plain market or housing institution', () => {
    const dwellings = stamp('Dwellings (4-16)');
    expect(institutionInCategory(dwellings, 'criminal')).toBe(false);
    expect(institutionInCategory(dwellings, 'magic')).toBe(false);
    expect(institutionInCategory(dwellings, 'religion')).toBe(false);
  });

  it('falls back to name keywords for unstamped (custom/legacy) institutions', () => {
    // No catalog category, no tags → name-keyword fallback path.
    expect(institutionInCategory({ name: "Smuggler's cove" }, 'criminal')).toBe(true);
    expect(institutionInCategory({ name: 'Old wizard tower' }, 'magic')).toBe(true);
    expect(institutionInCategory({ name: 'Village temple' }, 'religion')).toBe(true);
    expect(institutionInCategory({ name: 'Bakery' }, 'criminal')).toBe(false);
  });
});

describe('institutionCategoryFlags', () => {
  it('reports presence flags driven by metadata, not name substrings', () => {
    const insts = [stamp('Street gang'), stamp('Teleportation circle'), stamp('Wayside shrine')];
    expect(institutionCategoryFlags(insts)).toEqual({
      hasCriminal: true,
      hasMagic: true,
      hasReligion: true,
    });
  });

  it('reports all-false for a roster with none of the three families', () => {
    const insts = [stamp('Dwellings (4-16)'), stamp('Water source')];
    expect(institutionCategoryFlags(insts)).toEqual({
      hasCriminal: false,
      hasMagic: false,
      hasReligion: false,
    });
  });

  it('tolerates empty / null input', () => {
    expect(institutionCategoryFlags([])).toEqual({ hasCriminal: false, hasMagic: false, hasReligion: false });
    expect(institutionCategoryFlags()).toEqual({ hasCriminal: false, hasMagic: false, hasReligion: false });
  });
});

describe('isCommerceGuild', () => {
  it('accepts a commerce guild and rejects a criminal guild', () => {
    expect(isCommerceGuild(stamp('Merchant guilds (3-8)'))).toBe(true);
    // Thieves'/Assassins' guilds are excluded via the criminal detector even
    // though their names contain 'guild'.
    expect(isCommerceGuild(stamp('Thieves\' guild chapter'))).toBe(false);
    expect(isCommerceGuild(stamp('Assassins\' guild'))).toBe(false);
  });

  it('rejects a non-guild institution', () => {
    expect(isCommerceGuild(stamp('Dwellings (4-16)'))).toBe(false);
  });
});

// ── 3. Determinism: same seed ⇒ byte-identical NPCs ───────────────────────────

function npcsWithSeed(seed, settlement, culture, config) {
  setActiveRng(createPRNG(seed));
  try {
    return generateNPCs(settlement, culture, config);
  } finally {
    clearActiveRng();
  }
}

describe('generateNPCs determinism after metadata-driven matching', () => {
  // A roster that exercises the criminal/magic/religion secret-type weighting and
  // the commerce-guild path — exactly the branches the refactor touched.
  const settlement = {
    tier: 'city',
    institutions: [
      { name: 'Thieves\' guild chapter', category: 'Criminal', tags: ['criminal'], catalogId: catalogIdForName('Thieves\' guild chapter') },
      { name: 'Wizard\'s tower', category: 'Magic', tags: ['arcane'], catalogId: catalogIdForName('Wizard\'s tower') },
      { name: 'Cathedral (10,000+ only)', category: 'Religious', tags: ['religious', 'church'], catalogId: catalogIdForName('Cathedral (10,000+ only)') },
      { name: 'Merchant guilds (3-8)', category: 'Economy', tags: ['guild', 'trade'], catalogId: catalogIdForName('Merchant guilds (3-8)') },
    ],
    powerStructure: { factions: [{ faction: 'The Merchant Council', category: 'economy', power: 40, isGoverning: true }] },
    economicState: { primaryExports: ['Grain sales'], prosperity: 'Prosperous' },
  };
  const config = { culture: 'germanic', stressTypes: ['infiltrated'], priorityCriminal: 70, priorityMagic: 60 };

  it.each(['det-1', 'det-2', 'det-3', 'det-seed-x'])('same seed ⇒ identical NPCs (%s)', (seed) => {
    const a = npcsWithSeed(seed, settlement, 'germanic', config);
    const b = npcsWithSeed(seed, settlement, 'germanic', config);
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    expect(a.length).toBeGreaterThan(0);
  });

  it('a roster with criminal/magic/religion institutions is internally consistent with the flags', () => {
    expect(institutionCategoryFlags(settlement.institutions)).toEqual({
      hasCriminal: true,
      hasMagic: true,
      hasReligion: true,
    });
  });
});
