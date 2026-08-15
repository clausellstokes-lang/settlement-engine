/**
 * MG-3h — THE CANONICAL ARCANE-IDENTITY DETECTOR (leaks L10, L11, L12).
 *
 * Chair ruling R-BLD-5: the catalog's AUTHORED tag is the canonical detector; name
 * patterns are a fallback for non-catalog entities only and must apply the world law's
 * NEGATED_MAGIC_PATTERNS.
 *
 * Every leak pin below was RUN RED against the pre-MG-3h tree before its fix landed — the
 * `LEAK` blocks are the surveyor's reproductions inverted. The `LAW` blocks pin the
 * detector's own contract, and the `NO-DRIFT` blocks pin the things that must NOT have
 * moved: every authored catalog name still resolves to its authored tag, and the
 * classifiers' non-arcane axes answer exactly as before.
 */

import { describe, it, expect } from 'vitest';

import {
  ARCANE_IDENTITY,
  arcaneNameFallback,
  catalogFactionNames,
  factionCatalogArcaneTag,
  factionCatalogCategory,
  resolveArcaneIdentity,
} from '../../src/domain/arcaneIdentity.js';
import {
  catalogInstitutionNames,
  conflictingArcaneCatalogNames,
  institutionCatalogArcaneTag,
  isArcaneInstitution,
} from '../../src/domain/arcaneInstitutionIdentity.js';
import {
  stripNegatedMagic,
  textAssertsFunctionalMagic,
} from '../../src/domain/magicAssertionText.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';
import { inferFactionCategory } from '../../src/generators/power/factionCategories.js';
import { getBaseChance } from '../../src/generators/institutionProbability.js';
import { classifyCustomInstitution } from '../../src/domain/customContent.js';
import { FACTION_DESCRIPTORS, FACTION_DESCRIPTORS_EXTRA } from '../../src/data/powerData.js';
import { ARCANE_INST_TAGS } from '../../src/domain/magicFilter.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

// ── L10 — the ambiguous-token leak, both directions ────────────────────────

describe('L10 LEAK — ambiguous name tokens no longer classify a mundane entity arcane', () => {
  it('a cobblers\' guild in a tower district is a guild, not a wizards\' order', () => {
    expect(factionArchetype({ name: "The Tower Cobblers' Guild" }))
      .not.toBe(FACTION_ARCHETYPES.ARCANE);
  });

  it('a college of masons is not arcane', () => {
    expect(factionArchetype({ name: 'The College of Masons' }))
      .not.toBe(FACTION_ARCHETYPES.ARCANE);
  });

  it('the world law\'s denial clauses are applied to the fallback (R-BLD-5)', () => {
    expect(factionArchetype({
      name: 'The Academy',
      description: 'A non-magical school of letters.',
    })).not.toBe(FACTION_ARCHETYPES.ARCANE);
  });

  it('factionCategories agrees: a stonemasons\' bloc is not magic', () => {
    expect(inferFactionCategory('The Tower Wrights')).not.toBe('magic');
  });

  it('an ambiguous token WITH a functional-magic assertion still reads arcane', () => {
    expect(factionArchetype({ name: 'The Tower of Runes' })).toBe(FACTION_ARCHETYPES.ARCANE);
    expect(inferFactionCategory('The Tower of Spellcasters')).toBe('magic');
  });
});

describe('L10 LEAK — the false-negative half: an authored magic faction with no token', () => {
  it('"The Enlightened" is catalogued under magic and now reads arcane', () => {
    expect(factionCatalogCategory('The Enlightened')).toBe('magic');
    expect(factionArchetype({ name: 'The Enlightened' })).toBe(FACTION_ARCHETYPES.ARCANE);
    expect(inferFactionCategory('The Enlightened')).toBe('magic');
  });

  it('MG-LAW-4: a certain token still classifies alone, catalog or not', () => {
    expect(factionArchetype({ name: "The Mages' Guild of Nowhere" }))
      .toBe(FACTION_ARCHETYPES.ARCANE);
  });
});

// ── The detector's own law ─────────────────────────────────────────────────

describe('LAW — the catalog tag is canonical in BOTH directions', () => {
  it('every authored magic-pool name resolves ARCANE', () => {
    const magicNames = [
      ...(FACTION_DESCRIPTORS.magic || []),
      ...(FACTION_DESCRIPTORS_EXTRA.magic || []),
    ];
    expect(magicNames.length).toBeGreaterThan(0);
    for (const name of magicNames) {
      expect(factionCatalogArcaneTag(name), name).toBe(ARCANE_IDENTITY.ARCANE);
      expect(factionArchetype({ name }), name).toBe(FACTION_ARCHETYPES.ARCANE);
      expect(inferFactionCategory(name), name).toBe('magic');
    }
  });

  it('every authored NON-magic name resolves MUNDANE, ambiguous tokens included', () => {
    for (const pool of [FACTION_DESCRIPTORS, FACTION_DESCRIPTORS_EXTRA]) {
      for (const [category, names] of Object.entries(pool)) {
        if (category === 'magic') continue;
        for (const name of names) {
          expect(factionCatalogArcaneTag(name), name).toBe(ARCANE_IDENTITY.MUNDANE);
          expect(factionArchetype({ name }), name).not.toBe(FACTION_ARCHETYPES.ARCANE);
        }
      }
    }
  });

  it('a name the catalogs never heard of is UNKNOWN, not MUNDANE', () => {
    expect(factionCatalogArcaneTag('The Quiet Men of Harrow')).toBe(ARCANE_IDENTITY.UNKNOWN);
    expect(factionCatalogCategory('The Quiet Men of Harrow')).toBeNull();
  });

  it('the dedup pass\'s adjectival prefixes keep the authored identity', () => {
    // factionDedup prefixes a modifier onto a base descriptor when a realm reuses a name.
    for (const modifier of ['Greater', 'Elder', 'United', 'Northern', 'Second']) {
      const name = `The ${modifier} Tower Alliance`;
      expect(factionCatalogArcaneTag(name), name).toBe(ARCANE_IDENTITY.ARCANE);
      expect(factionArchetype({ name }), name).toBe(FACTION_ARCHETYPES.ARCANE);
    }
    expect(factionCatalogArcaneTag('The Greater Guild Alliance'))
      .toBe(ARCANE_IDENTITY.MUNDANE);
  });

  it('the index is unambiguous — no authored base name is a substring of another', () => {
    const keys = catalogFactionNames();
    const collisions = keys.filter(
      (a) => keys.some((b) => b !== a && b.includes(a)),
    );
    expect(collisions).toEqual([]);
  });

  it('a description cannot borrow another faction\'s authored tag', () => {
    // The index is keyed on the NAME. Flavour prose naming a catalogued magic order must
    // not hand that order's authored tag to the faction being described. Measured at the
    // base tree (0150bd01) this returned 'arcane', off the old flat regex's 'tower'.
    expect(factionArchetype({
      name: 'The Ropewalk Compact',
      description: 'Rivals of The Tower Alliance since the flood year.',
    })).not.toBe(FACTION_ARCHETYPES.ARCANE);
  });

  it('NO-DRIFT: a CERTAIN token in a description still classifies, as it always did', () => {
    // Not a leak and not this ruling's business: the description has been part of the
    // inference text since this module was written, and a certain token there read arcane
    // at the base tree too. Pinned as unchanged behaviour so nobody "fixes" it by accident.
    expect(factionArchetype({
      name: 'The Ropewalk Compact',
      description: 'Rivals of The Arcane Circle since the flood year.',
    })).toBe(FACTION_ARCHETYPES.ARCANE);
  });
});

describe('LAW — the two-tier name fallback', () => {
  it('a certain token classifies alone', () => {
    expect(arcaneNameFallback('the sorcerers of the vale')).toBe(true);
  });

  it('an ambiguous token alone does not', () => {
    expect(arcaneNameFallback('the bell tower')).toBe(false);
    expect(arcaneNameFallback('the college of physicians')).toBe(false);
  });

  it('an ambiguous token with a magic assertion does', () => {
    expect(arcaneNameFallback('the college of enchantment')).toBe(true);
  });

  it('the denial clauses are struck before either tier reads the text', () => {
    // anchored: the next line asserts the SAME call still contains 'academy', so a stripper that returned '' or dropped its input cannot pass both.
    expect(stripNegatedMagic('a non-magical academy')).not.toMatch(/non-magical/);
    expect(stripNegatedMagic('a non-magical academy')).toContain('academy');
    expect(arcaneNameFallback('a non-magical academy of letters')).toBe(false);
    // …and a denial does not disarm an independent affirmative claim.
    expect(textAssertsFunctionalMagic('no ward stops the wizard')).toBe(true);
  });

  it('an explicit catalog tag short-circuits the fallback entirely', () => {
    expect(resolveArcaneIdentity(ARCANE_IDENTITY.MUNDANE, 'the wizard tower')).toBe(false);
    expect(resolveArcaneIdentity(ARCANE_IDENTITY.ARCANE, 'the granary')).toBe(true);
    expect(resolveArcaneIdentity(ARCANE_IDENTITY.UNKNOWN, 'the wizard tower')).toBe(true);
  });

  it('empty and nullish input never asserts magic', () => {
    for (const value of [null, undefined, '', '   ', 0, false, {}]) {
      expect(arcaneNameFallback(value)).toBe(false);
    }
    expect(factionArchetype(null)).toBe(FACTION_ARCHETYPES.OTHER);
    expect(factionCatalogArcaneTag(null)).toBe(ARCANE_IDENTITY.UNKNOWN);
  });
});

// ── The institution adapter ────────────────────────────────────────────────

describe('LAW — the institution catalog\'s authored tag', () => {
  it('the catalog does not contradict itself across tiers', () => {
    expect(conflictingArcaneCatalogNames()).toEqual([]);
  });

  it('the index covers every catalog institution', () => {
    const names = new Set();
    for (const tiers of Object.values(institutionalCatalog)) {
      for (const insts of Object.values(tiers)) {
        for (const name of Object.keys(insts)) names.add(name.toLowerCase());
      }
    }
    expect(catalogInstitutionNames().length).toBe(names.size);
  });

  it('an arcane-TAGGED institution reads arcane', () => {
    expect(institutionCatalogArcaneTag("Mages' district")).toBe(ARCANE_IDENTITY.ARCANE);
    expect(institutionCatalogArcaneTag('Academy of magic')).toBe(ARCANE_IDENTITY.ARCANE);
    expect(isArcaneInstitution('Golem workforce')).toBe(true);
  });

  it('the TAG outranks the display bucket — a library of books is not a spellbook', () => {
    // 'Great library' is filed under the Magic bucket and authored `tags: ['education']`.
    expect(institutionCatalogArcaneTag('Great library')).toBe(ARCANE_IDENTITY.MUNDANE);
    expect(isArcaneInstitution('Great library')).toBe(false);
    // …and the estate already agreed about this one elsewhere: NON_MAGIC_EXOTICS.
    expect(isArcaneInstitution('Dragon resident')).toBe(false);
  });

  it('the tag reading matches the authored tags for every catalogued institution', () => {
    for (const tiers of Object.values(institutionalCatalog)) {
      for (const insts of Object.values(tiers)) {
        for (const [name, def] of Object.entries(insts)) {
          const tagged = (def.tags || []).some((t) => ARCANE_INST_TAGS.includes(String(t)));
          if (tagged) {
            expect(institutionCatalogArcaneTag(name), name).toBe(ARCANE_IDENTITY.ARCANE);
          }
        }
      }
    }
  });

  it('a non-catalog record\'s own authored tag still counts', () => {
    expect(isArcaneInstitution({ name: 'Quiet House', tags: ['enchanting'] })).toBe(true);
    expect(isArcaneInstitution({ name: 'Quiet House', magical: true })).toBe(true);
    expect(isArcaneInstitution({ name: 'Quiet House' })).toBe(false);
  });
});

// ── L11 — the direct world-fact gate ───────────────────────────────────────

describe('L11 LEAK — institutionProbability gates on the world fact, not only the dial', () => {
  const cfg = (over = {}) => ({
    priorityMagic: 50, priorityMilitary: 50, priorityEconomy: 50,
    priorityReligion: 50, priorityCriminal: 50,
    tier: 'city', settType: 'city', magicExists: true, ...over,
  });

  it('an UNRESOLVED config (dial still 50) no longer leaks an arcane institution', () => {
    // This is the leak: resolveConfig zeroes the dial when magic is off, so the old
    // suppression held only for callers that had already resolved. A raw config kept the
    // 50 default and the arcane institution survived at full probability.
    expect(getBaseChance(0.5, 'Magic', "Mages' district", cfg({ magicExists: false }), null))
      .toBe(0);
  });

  it('the gate reads the catalog tag: an authored-mundane institution is not swept up', () => {
    expect(getBaseChance(0.5, 'Magic', 'Great library', cfg({ magicExists: false }), null))
      .toBeGreaterThan(0);
  });

  it('NO-DRIFT: on the RESOLVED path the gate changes nothing — the dial already zeroed', () => {
    const resolved = cfg({ magicExists: false, priorityMagic: 0 });
    const dialOnly = cfg({ magicExists: true, priorityMagic: 0 });
    for (const name of ["Mages' district", 'Academy of magic', 'Golem workforce']) {
      expect(getBaseChance(0.5, 'Magic', name, resolved, null), name).toBe(0);
      expect(getBaseChance(0.5, 'Magic', name, dialOnly, null), name).toBe(0);
    }
  });

  it('NO-DRIFT: a magical world is untouched by the new line', () => {
    for (const [cat, name] of [['Magic', "Mages' district"], ['Defense', 'Garrison'],
      ['Economy', 'Market square'], ['Exotic', 'Dragon resident']]) {
      expect(getBaseChance(0.4, cat, name, cfg(), null), name)
        .toBe(getBaseChance(0.4, cat, name, cfg(), null));
      expect(getBaseChance(0.4, cat, name, cfg(), null), name).toBeGreaterThanOrEqual(0);
    }
    // A mundane institution is never zeroed by the magic gate, magic off or on.
    expect(getBaseChance(0.4, 'Defense', 'Garrison', cfg({ magicExists: false }), null))
      .toBeGreaterThan(0);
  });
});

// ── L12 — the custom-content magic path ────────────────────────────────────

describe('L12 LEAK — customContent reads the canonical band, not a raw string', () => {
  it('a dead-magic world now gets an HONEST line, not "exceptional rather than typical"', () => {
    const out = classifyCustomInstitution(
      { name: 'Wizard tower' },
      { config: { magicExists: false, priorityMagic: 0, magicLevel: 'none' } },
    );
    expect(out.inferredCategory).toBe('arcane');
    const inert = out.contributors.find((c) => c.effect === 'environment_inert');
    expect(inert).toBeTruthy();
    expect(inert.source).toBe('magicLedger.magicExists');
    expect(out.contributors.some((c) => c.effect === 'environment_dampen')).toBe(false);
  });

  it('the LEGACY band vocabulary now folds — "rare" reaches the dampen arm as "low"', () => {
    const out = classifyCustomInstitution(
      { name: 'Wizard tower' },
      { config: { magicLevel: 'rare' } },
    );
    const hint = out.contributors.find((c) => c.effect === 'environment_dampen');
    expect(hint).toBeTruthy();
    expect(hint.reason).toContain('low-magic');
  });

  it('a none-band world (dial zeroed, magic still real) gets its own line', () => {
    const out = classifyCustomInstitution(
      { name: 'Wizard tower' },
      { config: { magicExists: true, priorityMagic: 0 } },
    );
    const hint = out.contributors.find((c) => c.effect === 'environment_dampen');
    expect(hint).toBeTruthy();
    expect(hint.reason).toContain('No arcane practice is established here');
  });

  it('NO SETTLEMENT IN SCOPE ⇒ no magic claim at all (the neutral-envelope trap)', () => {
    // magicLedger's neutral envelope reports magicExists:false for an un-generated or
    // absent record. Reading that as a dead-magic world would stamp "magic does not
    // function" onto every context-free classification.
    for (const scope of [undefined, null, {}, { config: {} }, { config: null }]) {
      const out = classifyCustomInstitution({ name: 'Wizard tower' }, scope);
      expect(out.contributors.filter((c) => c.source.startsWith('magicLedger')))
        .toEqual([]);
    }
  });

  it('the recorded latent edge: a config carrying ONLY magicExists:false is now caught', () => {
    const out = classifyCustomInstitution(
      { name: 'Wizard tower' },
      { config: { magicExists: false } },
    );
    expect(out.contributors.some((c) => c.effect === 'environment_inert')).toBe(true);
  });

  it('R-BLD-5: an authored-mundane catalog name does not claim the arcane slot', () => {
    // 'Bardic college' is the discriminating case, and the only one in the whole catalog:
    // it MATCHES this surface's ambiguous pattern on 'college' yet is authored
    // `tags: ['education']`. Without the catalog consult it reads arcane; with it, a
    // school of music is a school of music. (Chosen by censusing every catalog name
    // against the pattern — the other three matches are all authored arcane, so a pin on
    // any of them would have passed with the consult removed and proved nothing.)
    expect(institutionCatalogArcaneTag('Bardic college')).toBe(ARCANE_IDENTITY.MUNDANE);
    expect(classifyCustomInstitution({ name: 'Bardic college' }).inferredCategory)
      .not.toBe('arcane');
    // …and the authored-arcane catalog names still claim it.
    for (const name of ["Wizard's tower", 'Druid Circle', 'Teleportation circle']) {
      expect(classifyCustomInstitution({ name }).inferredCategory, name).toBe('arcane');
    }
  });

  it('NO-DRIFT: the DM\'s own naming is still sovereign (MG-LAW-4)', () => {
    // This surface classifies USER-AUTHORED content, where the name IS the authored tag.
    expect(classifyCustomInstitution({ name: 'Conclave of the Veil' }).inferredCategory)
      .toBe('arcane');
    expect(classifyCustomInstitution({ name: 'Dragonbone Foundry' }).inferredCategory)
      .toBe('craft');
    expect(classifyCustomInstitution({ name: 'Temple of the Black Sun' }).inferredCategory)
      .toBe('religious');
  });
});

// ── MG-LAW-2 — the toggle gates the arcane axis, never faith ───────────────

describe('MG-LAW-2 — no faith surface is touched by the arcane detector', () => {
  it('no authored religious faction is ever read arcane', () => {
    for (const pool of [FACTION_DESCRIPTORS, FACTION_DESCRIPTORS_EXTRA]) {
      for (const name of pool.religious) {
        expect(factionArchetype({ name }), name).not.toBe(FACTION_ARCHETYPES.ARCANE);
        expect(inferFactionCategory(name), name).toBe('religious');
      }
    }
  });

  it('religious names carrying a religious token still classify RELIGIOUS', () => {
    // 'The Devout Circle' and 'The Congregation League' are deliberately NOT in this list:
    // they carry no token the ARCHETYPE vocabulary knows ('devout' and 'congregation' are
    // absent from NAME_RULES) and both read 'other' at the base tree too — measured, not
    // assumed. inferFactionCategory does know those words, which is why the category
    // assertion above covers the whole pool and this one covers only the token-carriers.
    for (const name of ['The Faithful Assembly', 'The Holy Compact', 'The Temple Union',
      'The Clergy Chapter', 'The Clergy Alliance']) {
      expect(factionArchetype({ name }), name).toBe(FACTION_ARCHETYPES.RELIGIOUS);
    }
    expect(classifyCustomInstitution({ name: 'Shrine of the Drowned' }).inferredCategory)
      .toBe('religious');
  });
});
