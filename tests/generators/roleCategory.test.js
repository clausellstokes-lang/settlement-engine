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
 *  4. THE SETTING-AGNOSTIC RENAMES CARRY NO MECHANICS. A role label is display
 *     copy, but four separate classifiers read it as a SUBSTRING, so renaming one
 *     can silently move an NPC's faction, category, power band, importance or
 *     simulation archetype. This block asserts each rename lands on exactly what
 *     its predecessor did — the pin that caught 'Deacon/Curate' -> 'Junior Cleric'
 *     flipping npcAgency from `civic` to `religious` because 'cleric' is one of
 *     the religious archetype's labels and 'deacon' is none of them.
 */
import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { generateNPCs } from '../../src/generators/npcGenerator.js';
import {
  roleToCategory,
  institutionInCategory,
  institutionCategoryFlags,
  isCommerceGuild,
} from '../../src/generators/roleCategory.js';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { inferRoleArchetype, NPC_ROLE_ARCHETYPES } from '../../src/domain/worldPulse/npcAgency.js';
import { inferImportance } from '../../src/domain/entities/npcs.js';

// ── 0. the setting-agnostic renames are mechanically inert ───────────────────
//
// ⛔ EVERY CLASSIFIER THAT READS A ROLE STRING IS LISTED HERE, and the list is the
// point: a role label is display copy, but five separate readers take it as a
// SUBSTRING, so a rename can silently move an NPC's faction, category, power band,
// importance or simulation archetype.
//
// ⚠ THREE OF THE FIVE ARE IMPORTED AND ONE IS NOT, AND THE DIFFERENCE IS DECLARED
// rather than left to be discovered. `roleToCategory`, `inferRoleArchetype` and
// `inferImportance` are the SHIPPED functions, called here exactly as the product
// calls them — `inferRoleArchetype` over the whole field set it reads in production
// (`name`/`label`/`role`/`title`/`description`), and `inferImportance` over the npc
// shape. `generateNPCPowerLevel` is module-local to npcGenerator.js, which sits AT
// its frozen size baseline of 1345 effective lines and which this lane may not edit;
// exporting it is a zero-line change and is the better end state, but it is not this
// lane's to make. So its two bands are mirrored below AND PINNED TO THE SOURCE: the
// arrays are read out of npcGenerator.js and compared, so a drift there reds here
// instead of quietly making this pin measure a function that no longer exists.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const NPC_GENERATOR_SRC = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../src/generators/npcGenerator.js'),
  'utf8',
);
const HIGH_POWER = ['mayor', 'lord', 'governor', 'bishop', 'archmage', 'guild_master', 'captain', 'commander', 'crime lord'];
const MID_POWER = ['council_member', 'priest', 'wealthy_merchant', 'wizard', 'knight', 'magister', 'sergeant'];

/** npcGenerator.generateNPCPowerLevel's band, which decides influence and power. */
function powerBand(role) {
  const r = String(role).toLowerCase();
  if (HIGH_POWER.some((k) => r.includes(k))) return 'high';
  if (MID_POWER.some((k) => r.includes(k))) return 'moderate';
  return 'low';
}

/** The four classifiers a rename has to leave alone, over the shape each one ships against. */
const classifiersFor = (role) => ({
  category: roleToCategory(String(role).toLowerCase()),
  archetype: inferRoleArchetype({ role }),
  power: powerBand(role),
  importance: inferImportance({ role }),
});

describe('setting-agnostic role renames are mechanically inert', () => {
  it('the mirrored power bands still match npcGenerator\'s own', () => {
    // The mirror above is the only copy in this file; this is what keeps it honest.
    for (const keyword of [...HIGH_POWER, ...MID_POWER]) {
      expect(NPC_GENERATOR_SRC, `${keyword} left generateNPCPowerLevel`).toContain(`'${keyword}'`);
    }
    expect(NPC_GENERATOR_SRC).toContain('const HIGH_POWER = [');
    expect(NPC_GENERATOR_SRC).toContain('const MID_POWER = [');
  });

  it.each([
    ['Parish Priest', 'Priest'],
    ['Templar Commander', 'Temple Guard Commander'],
    ['Wandering Friar', 'Wandering Monk'],
    ['Deacon/Curate', 'Under-Chaplain'],
  ])('%s -> %s classifies identically everywhere', (before, after) => {
    expect(classifiersFor(after)).toEqual(classifiersFor(before));
  });

  it('⚠ Temple Guard Commander holds only because MILITARY precedes RELIGIOUS', () => {
    // The one rename whose stability is ORDER-DEPENDENT rather than absent-label. It
    // carries BOTH 'commander' (military) and 'temple' (religious), and
    // inferRoleArchetype returns the FIRST archetype that matches over
    // NPC_ROLE_ARCHETYPES' insertion order. 'Templar Commander' matched only
    // 'commander' — 'templar' is not 'temple' — so the two agree today because
    // military is declared before religious, and reordering that object would move
    // this NPC without touching a single label. Stated here so the coupling is a
    // written fact rather than a coincidence the next reader has to rediscover.
    expect(inferRoleArchetype({ role: 'Temple Guard Commander' })).toBe('military');
    // Drop the military words and the SAME 'temple' lands religious — which is the
    // proof that the label is live in the string and the order is what suppresses it.
    expect(inferRoleArchetype({ role: 'Temple Keeper' })).toBe('religious');
    expect(Object.keys(NPC_ROLE_ARCHETYPES).indexOf('military'))
      .toBeLessThan(Object.keys(NPC_ROLE_ARCHETYPES).indexOf('religious'));
  });

  it('the pin can fail: the rejected label DOES move the simulation archetype', () => {
    // The negative control. Without it this block proves only that two strings agree,
    // never that disagreement would be seen — and 'Junior Cleric' is the label this
    // lane actually wrote before the review caught it.
    expect(inferRoleArchetype({ role: 'Deacon/Curate' })).toBe('civic');
    expect(inferRoleArchetype({ role: 'Junior Cleric' })).toBe('religious');
    expect(classifiersFor('Junior Cleric')).not.toEqual(classifiersFor('Deacon/Curate'));
  });

  it('the archetype reads the whole shipped field set, not the role alone', () => {
    // inferRoleArchetype joins name/label/role/title/description. A pin that passed only
    // `{ role }` would miss a cultural TITLE carrying the tell — which is exactly how a
    // Mesoamerican hamlet's "Tlamacazqui" sits beside its role on the card.
    expect(inferRoleArchetype({ role: 'Under-Chaplain', title: 'Priest' })).toBe('religious');
    expect(inferRoleArchetype({ role: 'Under-Chaplain', title: 'Tlamacazqui' })).toBe('civic');
    expect(inferRoleArchetype({ description: 'keeps the temple roll' })).toBe('religious');
  });
});

// ── 1. roleToCategory ─────────────────────────────────────────────────────────

describe('roleToCategory', () => {
  it.each([
    ['Mayor', 'government'],
    ['Chief Magistrate', 'government'],
    ['Council Member', 'government'],
    ['Guard Captain', 'military'],
    ['City Watch Chief', 'military'],
    ['Garrison Commander', 'military'],
    ['Priest', 'religious'],
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
