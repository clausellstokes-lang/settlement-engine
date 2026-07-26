/**
 * Narrative-quality corpus invariants.
 *
 * These tests deliberately avoid pinning one seed's prose. They scan a stable
 * matrix of seeds and inputs for classes of defects that can hide in otherwise
 * valid output: unresolved template tokens, doubled articles, lower-case
 * sentence joins, number disagreement, scale drift, and ambiguous NPC names.
 */
import { describe, expect, test } from 'vitest';

import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { generateHistory } from '../../src/generators/historyGenerator.js';
import { renderHistoryTemplate } from '../../src/generators/historyTemplate.js';
import {
  generateNPCs,
  generateRelationships,
} from '../../src/generators/npcGenerator.js';
import { disambiguateNPCDisplayNames } from '../../src/generators/npcDisplayNames.js';
import {
  genRelNarrative,
  genSuccessionNarr,
} from '../../src/generators/power/settlementNarrative.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { generateEconomicState } from '../../src/generators/economicGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

const withSeed = (seed, work) => {
  setActiveRng(createPRNG(seed));
  try {
    return work();
  } finally {
    clearActiveRng();
  }
};

const normalize = value => String(value || '').trim().toLowerCase();

describe('history templates are total across the authored corpus', () => {
  const CURRENT_TENSION_TOKENS = [
    '{building_type}',
    '{demands}',
    '{duration}',
    '{location}',
    '{method}',
    '{quarter}',
    '{resource}',
    '{route_type}',
  ];

  test('the current-tension catalog uses exactly the supported token vocabulary', () => {
    const authoredTokens = [
      ...new Set(
        HISTORICAL_EVENTS_DATA.flatMap(event =>
          event.description.match(/\{[a-z_]+\}/g) || []
        ),
      ),
    ].sort();

    expect(authoredTokens).toEqual(CURRENT_TENSION_TOKENS);
  });

  test('the renderer replaces repeated occurrences, not only the first', () => {
    expect(
      renderHistoryTemplate(
        '{resource} left the market; {resource} returned by winter',
        { '{resource}': 'grain' },
      ),
    ).toBe('grain left the market; grain returned by winter');
  });

  test('route × seed sweep resolves every token-bearing tension without grammar residue', () => {
    const tokenBearingTypes = new Set(
      HISTORICAL_EVENTS_DATA
        .filter(event => /\{[a-z_]+\}/.test(event.description))
        .map(event => event.type),
    );
    const seenTokenBearingTypes = new Set();
    const offenders = [];

    for (const route of ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass']) {
      for (let index = 0; index < 80; index++) {
        const seed = `narrative-history-${route}-${index}`;
        const history = withSeed(seed, () =>
          generateHistory(
            'metropolis',
            {
              _seed: seed,
              settlementAgeMode: 'new',
              tradeRouteAccess: route,
              magicExists: true,
            },
            [],
            { issues: [], stability: 'Stable' },
            {
              primaryExports: ['Amber exports'],
              incomeSources: [{ source: route === 'port' ? 'Port fees' : 'Guild trade' }],
            },
            {
              factions: [
                {
                  faction: 'the town council',
                  category: 'government',
                  isGoverning: true,
                },
              ],
            },
          )
        );

        for (const tension of history.currentTensions || []) {
          if (tokenBearingTypes.has(tension.type)) {
            seenTokenBearingTypes.add(tension.type);
          }
          const text = String(tension.description || '');
          if (
            /\{[a-z_]+\}/.test(text) ||
            /\bthe\s+the\b/i.test(text) ||
            /\bthere is a outstanding\b/i.test(text)
          ) {
            offenders.push({ route, seed, type: tension.type, text });
          }
        }
      }
    }

    expect(
      [...seenTokenBearingTypes].sort(),
      'the deterministic corpus must exercise every token-bearing tension type',
    ).toEqual([...tokenBearingTypes].sort());
    expect(
      offenders,
      `history prose defects:\n${JSON.stringify(offenders.slice(0, 8), null, 2)}`,
    ).toHaveLength(0);
  });
});

describe('sentence boundaries and relationship rumors remain grammatical', () => {
  const baseContext = {
    name: 'Ashholt',
    tier: 'town',
    prosperity: 'Moderate',
    stability: 'Stable',
    isViable: true,
    viabilityIssues: [],
    govFaction: 'the town council',
    topFaction: 'the merchant league',
    topNPCName: 'the reeve',
    topNPCRole: 'reeve',
    milForce: 'the town watch',
    commodity: 'grain',
  };

  test.each([
    ['religious_tension', {}, /The town council has avoided/],
    ['guild_conflict', {}, /The merchant league has held/],
    ['external_threat', {}, /The reeve knows the intelligence/],
    ['external_threat', { neighbor: 'Stoneford' }, /The town council and the town watch/],
    ['resource_scarcity', {}, /The merchant league knows.*The town council has/s],
    ['resource_scarcity', { commodity: null }, /The town council controls the allocation/],
    ['magical_controversy', {}, /The town council is being pressured/],
    ['disputed_land', {}, /The town council has delayed ruling/],
  ])('%s capitalizes values only when they open a sentence', (topTension, overrides, expected) => {
    const prose = genSuccessionNarr({
      ...baseContext,
      topTension,
      ...overrides,
    }).join(' ');

    expect(prose).toMatch(expected);
    expect(prose).not.toMatch(/[.!?]\s+[a-z]/);
  });

  test('relationship-rumor variants never form "a outstanding"', () => {
    const relationship = {
      type: 'debtor_creditor',
      typeName: 'Outstanding Debt',
      npc1Name: 'Alda Stone',
      npc2Name: 'Marek Vale',
      description: 'Alda owes Marek — the debt is overdue',
      tension: 'Neither believes the original terms still apply.',
    };
    const phrasings = [];

    for (let index = 0; index < 160; index++) {
      const rumor = withSeed(`relationship-grammar-${index}`, () =>
        genRelNarrative({
          relationships: [relationship],
          stress: [{ type: 'indebted' }],
        })
      );
      if (rumor?.phrasing) phrasings.push(rumor.phrasing);
    }

    expect(phrasings.length).toBeGreaterThan(40);
    expect(phrasings.some(text => text.includes('best understood as outstanding debt'))).toBe(true);
    expect(phrasings.join('\n')).not.toMatch(/\bthere is a outstanding\b/i);
  });
});

describe('safety prose agrees in number and respects settlement scale', () => {
  test('city district-market revenue never claims metropolis scale', () => {
    const economy = withSeed('city-market-scale', () => generateEconomicState(
      'city',
      [{ name: 'District market' }],
      'road',
      {},
      {
        tier: 'city',
        priorityEconomy: 80,
        priorityMilitary: 50,
        priorityReligion: 50,
        priorityMagic: 50,
        priorityCriminal: 50,
      },
    ));
    const marketTaxes = economy.incomeSources.find(
      source => source.source === 'Market Taxes',
    );

    expect(marketTaxes).toBeTruthy();
    expect(marketTaxes.desc).toMatch(/urban districts/i);
    expect(marketTaxes.desc).not.toMatch(/metropolis scale/i);
  });

  test('a town watch is never promoted to a city watch in prose', () => {
    const profile = generateSafetyProfile(
      {
        priorityEconomy: 80,
        priorityMilitary: 90,
        priorityCriminal: 10,
      },
      'town',
      [{ name: 'Town watch' }],
    );
    const prose = `${profile.safetyDesc} ${profile.guardEffectivenessDesc}`;

    expect(prose).toMatch(/\btown watch\b/i);
    expect(prose).not.toMatch(/\bcity watch\b/i);
  });

  test('a professional city watch keeps city-scale terminology', () => {
    const profile = generateSafetyProfile(
      {
        priorityEconomy: 80,
        priorityMilitary: 90,
        priorityCriminal: 10,
      },
      'city',
      [{ name: 'Professional city watch' }],
    );
    expect(`${profile.safetyDesc} ${profile.guardEffectivenessDesc}`).toMatch(/\bcity watch\b/i);
  });

  test('singular and plural authority branches choose agreeing predicates', () => {
    const occupiedGarrison = generateSafetyProfile(
      { stressTypes: ['occupied'] },
      'town',
      [{ name: 'Garrison' }],
    );
    expect(occupiedGarrison.safetyDesc).toContain(
      'The garrison, now under occupier command, enforces curfew',
    );
    expect(occupiedGarrison.safetyDesc).not.toContain(
      'garrison, now under occupier command, enforce curfew',
    );

    const occupiedOfficials = generateSafetyProfile(
      { stressTypes: ['occupied'] },
      'town',
      [],
    );
    expect(occupiedOfficials.safetyDesc).toContain('Occupation authorities enforce curfew');
  });

  test('state-control and religious-fraud branches retain subject agreement', () => {
    const authoritarian = generateSafetyProfile(
      {
        priorityEconomy: 0,
        priorityMilitary: 70,
        priorityReligion: 0,
        priorityMagic: 20,
        priorityCriminal: 0,
      },
      'town',
      [{ name: 'Garrison' }],
    );
    expect(authoritarian.flags.stateCrime).toBe(true);
    expect(authoritarian.safetyDesc).toContain('The garrison is visible everywhere');
    expect(authoritarian.safetyDesc).not.toContain('The garrison are visible');

    const fraud = generateSafetyProfile(
      {
        priorityEconomy: 0,
        priorityMilitary: 0,
        priorityReligion: 60,
        priorityMagic: 20,
        priorityCriminal: 50,
      },
      'town',
      [
        { name: 'Parish church' },
        { name: "Thieves' guild chapter" },
      ],
    );
    const fraudDesc = fraud.crimeTypes.find(type => type.type === 'Religious fraud')?.desc;
    expect(fraud.flags.religiousFraud).toBe(true);
    expect(fraudDesc).toContain("The church's moral authority provides cover");
    expect(fraudDesc).not.toContain("authority provide cover");
  });
});

describe('NPC display identity is unique without perturbing RNG', () => {
  test('role qualifiers disambiguate both mixed-role and same-role collisions', () => {
    const roster = disambiguateNPCDisplayNames([
      { name: 'Alda Stone', role: 'Mayor' },
      { name: 'Alda Stone', role: 'Guild Master' },
      { name: 'Marek Vale', role: 'Council Member' },
      { name: 'Marek Vale', role: 'Council Member' },
      { name: 'Tomas Reed', role: 'Guard Captain' },
    ]);

    expect(roster.map(npc => npc.name)).toEqual([
      'Alda Stone (Mayor)',
      'Alda Stone (Guild Master)',
      'Marek Vale (Council Member I)',
      'Marek Vale (Council Member II)',
      'Tomas Reed',
    ]);
  });

  test('tier × seed corpus has unique names and unambiguous relationship endpoints', () => {
    const institutions = [
      { name: 'Town watch', category: 'Defense', tags: ['defense'] },
      { name: 'Parish church', category: 'Religious', tags: ['religious', 'church'] },
      { name: 'Merchant guilds (3-8)', category: 'Economy', tags: ['guild', 'trade'] },
    ];

    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let index = 0; index < 36; index++) {
        const seed = `npc-display-${tier}-${index}`;
        const { npcs, relationships } = withSeed(seed, () => {
          const generatedNPCs = generateNPCs(
            {
              tier,
              institutions,
              powerStructure: {
                factions: [
                  {
                    faction: 'the town council',
                    category: 'government',
                    isGoverning: true,
                  },
                ],
              },
              economicState: {
                primaryExports: ['Grain sales'],
                prosperity: 'Modest',
              },
            },
            'germanic',
            {
              stressTypes: ['politically_fractured'],
              priorityMilitary: 60,
              priorityEconomy: 60,
            },
          );
          return {
            npcs: generatedNPCs,
            relationships: generateRelationships(generatedNPCs, {}, institutions),
          };
        });

        const names = npcs.map(npc => normalize(npc.name));
        expect(
          new Set(names).size,
          `${tier}/${seed} emitted duplicate display names: ${names.join(', ')}`,
        ).toBe(names.length);

        for (const relationship of relationships) {
          if (relationship.npc1Id === relationship.npc2Id) continue;
          expect(
            normalize(relationship.npc1Name),
            `${tier}/${seed} relationship endpoints are visually ambiguous`,
          ).not.toBe(normalize(relationship.npc2Name));
        }
      }
    }
  });
});
