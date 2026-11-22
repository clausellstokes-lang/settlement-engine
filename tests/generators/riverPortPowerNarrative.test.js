/**
 * riverPortPowerNarrative.test.js — the power narrative obeys the same
 * maritime capability law as institutions, resources, and arrival prose.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const generate = (config, seed) =>
  generateSettlementPipeline(config, null, {
    seed,
    customContent: {},
  });

const merchantDescription = settlement =>
  settlement.powerStructure.factions.find(
    faction => faction.faction?.startsWith('Merchant Guilds'),
  )?.desc;

describe('merchant power narrative maritime grounding', () => {
  test('the audited riverside port never claims maritime traders or port licences', () => {
    const settlement = generate(
      {
        settType: 'city',
        culture: 'east_asian',
        terrainOverride: 'riverside',
        tradeRouteAccess: 'port',
        magicExists: false,
        priorityMagic: 100,
      },
      'certification-v1-mundane-river-port-city-alder',
    );
    const description = merchantDescription(settlement);

    expect(description).toBeTruthy();
    // The faction this reads is the Merchant Guilds bloc, and its description always
    // names the merchant community. Asserting that FIRST means the maritime exclusion
    // below measures vocabulary, not a description that stopped being written.
    expect(description).toMatch(/\bmerchant\b/i);
    // anchored: the merchant-vocabulary assertion above proves this desc is live prose
    expect(description).not.toMatch(/\bmaritime\b|\bport licences?\b/i);
  });

  test('a true coastal seaport retains its maritime merchant wording', () => {
    const settlement = generate(
      {
        settType: 'city',
        culture: 'east_asian',
        terrainOverride: 'coastal',
        tradeRouteAccess: 'port',
        priorityEconomy: 75,
      },
      // Re-pinned maritime-power-0 to maritime-power-1 on 2026-09-30 (the urban band,
      // ODQ §934.86): the same-seed shift seated 'Merchant oligarchy' as this seaport's
      // government, and a merchant-GOVERNED settlement takes the governing-merchant
      // branch of rulingStructure ("the ruling class and the merchant class are the
      // same people"), which precedes the maritime branch by design — the base
      // already took it on maritime-power-4 and -6 (Merchant Guild Council). -1 is
      // the first sibling whose merchants do not govern; the precondition is now
      // asserted below instead of being implicit in the seed.
      // Re-pinned maritime-power-1 to maritime-power-2 on 2026-11-06 (LANDING-7 lane D): the
      // X-46 population bands (compose 1264a8152, bisected by first-parent stage) seated
      // 'Merchant Guild Council' as -1's government, so the precondition below read true. -2 is
      // the first sibling whose merchants do not govern (measured 0..9: -2, -4, -8, -9 do not,
      // and every one of them keeps the maritime wording; the water-fact reader is not at fault).
      'maritime-power-2',
    );
    const description = merchantDescription(settlement);
    const governing = settlement.powerStructure.factions.find(faction => faction.isGoverning)?.faction || '';

    // The arm's precondition: the merchants are a faction here, not the government
    // (the same three spellings rulingStructure's merchantGoverns test reads).
    expect(/Merchant oligarchy|Merchant Guild Council|Merchant Council/.test(governing)).toBe(false);
    expect(description).toMatch(/\bmaritime traders\b|\bport licences?\b/i);
  });
});
