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
      'maritime-power-0',
    );
    const description = merchantDescription(settlement);

    expect(description).toMatch(/\bmaritime traders\b|\bport licences?\b/i);
  });
});
