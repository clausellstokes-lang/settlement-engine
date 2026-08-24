/**
 * institutionsForPower.test.js — the tag-driven power<->institution footprint.
 *
 * The Power tab used to map a power to its institutions by NAME regex alone,
 * which missed the non-obvious cases: a criminal power showed "None" even when
 * the settlement had a fence or a smuggling ring (those carry the `criminal`
 * tag but no criminal NAME keyword). institutionsForPower unions three signals —
 * tag affinity (primary), name hint (fallback), and the explicit factionSource
 * link — and lets one institution belong to several powers. This pins that.
 */

import { describe, it, expect } from 'vitest';
import { institutionsForPower } from '../../src/domain/npcProfile.js';

const settlement = {
  institutions: [
    { name: 'Local fence',        tags: ['criminal'] },              // tag-only criminal (no name keyword)
    { name: 'Smuggling ring',     tags: ['criminal', 'smuggling'] }, // tag-only criminal
    { name: "Coopers' Guild Hall", tags: ['guild', 'market'] },      // maps to BOTH economy and craft
    { name: 'The Iron Garrison',  tags: ['military', 'defense'] },   // military
    { name: 'Temple of the Dawn', tags: ['religious', 'church'] },   // religious
    { name: 'A quiet orchard',    tags: ['agriculture'] },           // maps to nothing
    { name: 'The Mint',           tags: [], factionSource: 'Merchant Princes' }, // explicit link, no tag/name
  ],
};

describe('institutionsForPower — tag-driven footprint', () => {
  it('maps a criminal power to tag-only criminal institutions the name match missed', () => {
    const out = institutionsForPower({ faction: 'The Shadow Hand', category: 'criminal' }, settlement);
    expect(out).toContain('Local fence');
    expect(out).toContain('Smuggling ring');
    expect(out).not.toContain('A quiet orchard');
  });

  it('lets one institution belong to MORE THAN ONE power (guild hall → economy and craft)', () => {
    const economy = institutionsForPower({ faction: 'Merchant Guilds', category: 'economy' }, settlement);
    const craft   = institutionsForPower({ faction: 'The Artisans',    category: 'crafts'  }, settlement);
    expect(economy).toContain("Coopers' Guild Hall");
    expect(craft).toContain("Coopers' Guild Hall");
  });

  it('honors the generator-category aliases (magic→arcane, noble→government, crafts→craft)', () => {
    expect(institutionsForPower({ faction: 'The Watch', category: 'military' }, settlement)).toContain('The Iron Garrison');
    expect(institutionsForPower({ faction: 'The Faithful', category: 'religious' }, settlement)).toContain('Temple of the Dawn');

    // ⭐ THE ARCANE POWER DOMAIN IS THE UNION OF THE TWO AUTHORED TAG LISTS, and this is the
    // only place that says so. `POWER_DOMAIN_TAGS.arcane` spreads BOTH `ARCANE_INST_TAGS`
    // (which answers "does this need magic to exist?") and `TRADE_INST_TAGS` (which answers
    // "what craft is practised here?"), because belonging to the arcane POWER is a third
    // question and an alchemist belongs to it whether or not alchemy needs magic
    // (TE-CH-5, ODQ §541). Before that car the four members were hand-typed here, a fifth
    // typing of a list whose zero-import leaf exists precisely to stop such drift.
    // ⚠ BOTH NAMES ARE DELIBERATELY OUTSIDE the arcane NAME hint
    // (/mage|wizard|college|alchemist|library|laboratory|tower|sanctum/i) and carry no
    // factionSource, so each row can only be reached down the TAG path — otherwise this
    // would pass with either spread deleted.
    const arcaneWorld = { institutions: [
      { name: 'The Silver Circle',    tags: ['arcane'] },      // via ARCANE_INST_TAGS
      { name: 'The Sootbottle Works', tags: ['alchemy'] },     // via TRADE_INST_TAGS
      { name: 'A quiet orchard',      tags: ['agriculture'] }, // via neither
    ] };
    const arcane = institutionsForPower({ faction: 'Arcane Orders', category: 'magic' }, arcaneWorld);
    expect(arcane).toContain('The Silver Circle');
    expect(arcane).toContain('The Sootbottle Works');
    // anchored: the two toContain assertions directly above run against THIS SAME `arcane` array, so it cannot have gone empty or drifted out from under this negative.
    expect(arcane).not.toContain('A quiet orchard');
  });

  it('includes an institution explicitly pulled by THIS faction (factionSource), even with no tag/name match', () => {
    const out = institutionsForPower({ faction: 'Merchant Princes', category: 'economy' }, settlement);
    expect(out).toContain('The Mint');
    // A different power does not claim it via the explicit link.
    const other = institutionsForPower({ faction: 'The Watch', category: 'military' }, settlement);
    expect(other).not.toContain('The Mint');
  });

  it('still matches by NAME when an institution has no tags (fallback path)', () => {
    const nameOnly = {
      institutions: [{ name: 'The Grand Market' }], // economy hint, no tags
    };
    expect(institutionsForPower({ faction: 'Guilds', category: 'economy' }, nameOnly))
      .toContain('The Grand Market');
  });

  it('returns [] for an unknown/absent category with no other signal, a missing settlement, or no institutions', () => {
    expect(institutionsForPower({ faction: 'X', category: 'zzz' }, settlement)).toEqual([]);
    expect(institutionsForPower({ faction: 'X' }, settlement)).toEqual([]); // no category, no factionSource match
    expect(institutionsForPower({ category: 'criminal' }, { institutions: [] })).toEqual([]);
    expect(institutionsForPower(null, settlement)).toEqual([]);
  });

  it('dedupes by institution name', () => {
    const out = institutionsForPower({ faction: 'The Shadow Hand', category: 'criminal' }, settlement);
    expect(new Set(out).size).toBe(out.length);
  });
});
