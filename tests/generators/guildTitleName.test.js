// CENSUS-4 R9 (`reader:possessive-slip`): a guild master's title never doubles a possessive.
import { describe, it, expect } from 'vitest';
import { guildTitleName } from '../../src/generators/npc/guildTitleName.js';

describe('guildTitleName — the guild in a guild master title', () => {
  it('turns a singular possessive into the plural possessive (no doubled apostrophe)', () => {
    expect(guildTitleName("Tailor's guild")).toBe("Tailors'");
    expect(guildTitleName("Cobbler's guild")).toBe("Cobblers'");
    expect(guildTitleName("Cartographer's guild")).toBe("Cartographers'");
  });
  it("keeps an irregular plural's own possessive", () => {
    expect(guildTitleName("Quarrymen's guild")).toBe("Quarrymen's");
  });
  it('prints the plural possessive names exactly as before', () => {
    expect(guildTitleName("Weavers' guild")).toBe("Weavers'");
    expect(guildTitleName("Carriers' guild")).toBe("Carriers'");
    expect(guildTitleName('Bowyers & fletchers (guild)')).toBe('Bowyers & fletchers');
    expect(guildTitleName('Merchant guilds (50-100+)')).toBe('Merchant guilds');
  });
  it('never prints a doubled possessive', () => {
    for (const n of ["Tailor's guild", "Quarrymen's guild", "Weavers' guild", "Dyers' guild", "Salters' guild"]) {
      expect(guildTitleName(n), n).toMatch(/^\w+/);
      expect(guildTitleName(n)).not.toMatch(/['’]s['’]/); // anchored: the line above proves a name is printed
    }
  });
});
