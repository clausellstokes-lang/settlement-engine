/**
 * R6 UNIT 2 — A SMALL PLACE DRAWS NO GUILD POWER WITHOUT A MARKET (soak 1000 rung 1, kind 8
 * `A-14:guild-power-small`: 5, of which 4 are a "Thieves' Guild" in a thorp or hamlet; the dry
 * run's row 10, 236). SIZE-3 (ODQ §934.104) already gated the Merchant Guilds of a thorp, hamlet
 * or village on a real market by the catalogue (`economy/viability.js :: hasMarketInstitution`).
 * `power/rulingStructure.js :: generatePowerStructure` still seated the Thieves' Guild there on
 * the criminal slider alone, and the Craft Guilds of every village on the economy slider alone.
 * The same gate now stands before every guild power of a small place.
 *
 * Seeds are the rung's own corpus (`scripts/audit/soak-review/corpus.mjs :: birth`).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { hasMarketInstitution } from '../../src/generators/economy/viability.js';

/** @param {any} s @returns {string[]} */
const guildPowers = (s) => (s.powerStructure?.factions || []).map((f) => String(f.faction)).filter((n) => /guild/i.test(n));

/** @type {Record<number, any>} */
const S = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of [13, 523, 840, 889, 20, 110, 313, 68]) S[i] = birth(i).settlement;
});

describe('a thorp or hamlet with no market seats no Thieves\' Guild', () => {
  it.each([[13, 'hamlet'], [523, 'hamlet'], [840, 'thorp'], [889, 'hamlet']])('soak1k-%i (%s)', (i, tier) => {
    const s = S[i];
    expect(s.tier).toBe(tier);
    expect(hasMarketInstitution(s.institutions)).toBe(false);
    expect(s.config.priorityCriminal).toBeGreaterThan(58);
    expect(guildPowers(s)).toEqual([]);
  });
});

describe('a village with no market seats no Craft Guilds', () => {
  it.each([20, 110])('soak1k-%i', (i) => {
    const s = S[i];
    expect(s.tier).toBe('village');
    expect(hasMarketInstitution(s.institutions)).toBe(false);
    expect(guildPowers(s)).toEqual([]);
  });
});

describe('a small place with a market keeps its guild powers', () => {
  it('soak1k-313: a hamlet with a Periodic market keeps its Merchant Guilds', () => {
    const s = S[313];
    expect(s.tier).toBe('hamlet');
    expect(hasMarketInstitution(s.institutions)).toBe(true);
    expect(guildPowers(s)).toContain('Merchant Guilds');
  });

  it('soak1k-68: a village with a market keeps its Merchant and Craft Guilds', () => {
    const s = S[68];
    expect(s.tier).toBe('village');
    expect(hasMarketInstitution(s.institutions)).toBe(true);
    expect(guildPowers(s)).toEqual(expect.arrayContaining(['Merchant Guilds', 'Craft Guilds']));
  });
});
