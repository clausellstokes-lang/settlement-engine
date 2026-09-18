/**
 * Contract for the compact 1 / 3 / 1 / 3 / 1 settlement read-model.
 *
 * This is intentionally independent of the presentation surfaces. The same
 * immutable selection must drive Summary, Table View, Session Mode, and PDF.
 */

import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composeSettlementQuickGuide } from '../../src/domain/summary/settlementQuickGuide.js';
import { CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';

function completeSettlement() {
  return generateSettlementPipeline(
    {
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      priorityEconomy: 70,
    },
    null,
    { seed: 'settlement-quick-guide', customContent: {} },
  );
}

describe('composeSettlementQuickGuide', () => {
  it('composes one identity, three truths, one pressure, three people, and one entry point', () => {
    const guide = composeSettlementQuickGuide(completeSettlement());

    expect(guide.version).toBe(1);
    expect(guide.identitySentence).toMatch(/\.$/);
    expect(guide.definingTruths.map((truth) => truth.id)).toEqual([
      'foundation',
      'authority',
      'material_life',
    ]);
    expect(guide.immediatePressure.id).toBe('immediate_pressure');
    expect(guide.importantPeople).toHaveLength(3);
    expect(guide.entryPoint.id).toBe('entry_point');

    for (const item of [
      ...guide.definingTruths,
      guide.immediatePressure,
      ...guide.importantPeople,
      guide.entryPoint,
    ]) {
      expect(item.sourcePath).toBeTruthy();
    }
  });

  it('is deterministic and never mutates the generated settlement', () => {
    const settlement = completeSettlement();
    const before = JSON.stringify(settlement);

    const first = composeSettlementQuickGuide(settlement);
    const second = composeSettlementQuickGuide(settlement);

    expect(second).toEqual(first);
    expect(JSON.stringify(settlement)).toBe(before);
  });

  it('uses final power and canonical hook rankings rather than roster order', () => {
    const guide = composeSettlementQuickGuide({
      name: 'Hollowmere',
      tier: 'village',
      npcs: [
        { id: 'low', name: 'Low', power: 2, role: 'Miller', plotHooks: ['A quiet request'] },
        { id: 'high', name: 'High', power: 9, role: 'Reeve', plotHooks: ['The levy vanished'] },
        { id: 'mid', name: 'Mid', power: 5, role: 'Priest' },
      ],
      conflicts: [{
        intensity: 'high',
        parties: ['Guild', 'Council'],
        plotHooks: ['The council chamber is occupied before dawn'],
      }],
    });

    expect(guide.importantPeople.map((person) => person.name)).toEqual([
      'High',
      'Mid',
      'Low',
    ]);
    expect(guide.entryPoint.text).toContain('council chamber');
  });

  it('degrades honestly for sparse and legacy records', () => {
    const guide = composeSettlementQuickGuide({ name: 'Barebones' });

    expect(guide.identitySentence).toBe('Barebones is a settlement.');
    expect(guide.definingTruths).toHaveLength(3);
    expect(guide.importantPeople).toEqual([]);
    expect(guide.immediatePressure.text).toContain('currently recorded');
    expect(guide.entryPoint.text).toContain('currently recorded');
  });

  it('names the culture\'s design terms without reading the filing word out', () => {
    const guide = composeSettlementQuickGuide({
      name: 'Edznaxochitl',
      tier: 'hamlet',
      population: 130,
      culturalIdentity: {
        label: 'Mesoamerican-inspired',
        scope: 'A civic-ritual plaza, tribute, market-and-waterworks design grammar.',
      },
    });

    expect(guide.identitySentence).toBe(
      'Edznaxochitl is a Mesoamerican-inspired hamlet of 130 people, built around '
      + 'a civic-ritual plaza, tribute, and market-and-waterworks.',
    );
  });

  it('gives EVERY authored culture scope a phrase, and none of them dangles', () => {
    // THE COVERAGE PIN lives here rather than in the composer: settlementQuickGuide
    // is a headless leaf and src/data/cultureProfiles.js is lazily chunked away from
    // the first paint, so the map is keyed on the authored string and this test is
    // what makes a reworded scope loud instead of silently unphrased.
    const unphrased = [];
    for (const [key, profile] of Object.entries(CULTURE_PROFILES)) {
      const guide = composeSettlementQuickGuide({
        name: 'Testholm',
        tier: 'village',
        population: 400,
        culturalIdentity: { label: profile.label, scope: profile.scope },
      });
      // The fallback is recognisable: it ends at the population with nothing after it.
      if (/ of 400 people\.$/.test(guide.identitySentence)) unphrased.push(key);
    }
    // ⛔ ALL ELEVEN, WITH NO EXCEPTION. The blended profile is NOT in this corpus -
    // `materializeCulturalIdentity` synthesises it at generation time from two keys -
    // so the only scope allowed to reach the no-scope fallback is not reachable from
    // here, and every row that IS here must carry a phrase.
    expect(unphrased, 'every authored scope needs a row in SCOPE_PHRASE').toEqual([]);
    expect(Object.keys(CULTURE_PROFILES)).toHaveLength(11);

    // The four ADJECTIVE STACKS - the shape a mechanical term-lift turned into a
    // dangling modifier ("built around a timber-and-stone and guild-and-estate").
    const say = (key) => composeSettlementQuickGuide({
      name: 'Testholm',
      tier: 'village',
      population: 400,
      culturalIdentity: { label: CULTURE_PROFILES[key].label, scope: CULTURE_PROFILES[key].scope },
    }).identitySentence;
    expect(say('germanic')).toBe(
      'Testholm is a Germanic-inspired village of 400 people, built in timber and stone, '
      + 'and run by guild and estate.',
    );
    expect(say('norse')).toBe(
      'Testholm is a Norse-inspired village of 400 people, built around the hall and the '
      + 'water, on assembly and what the season allows.',
    );
    expect(say('east_asian')).toBe(
      'Testholm is an East-Asian-inspired village of 400 people, built in wards and '
      + 'courtyards, ordered by bureau and lineage.',
    );
    expect(say('steppe')).toBe(
      'Testholm is a Steppe-inspired village of 400 people, built for a pastoral life '
      + 'half-settled and half-moving, held by clan and caravan.',
    );

    // The article follows the label rather than being hardcoded 'a'.
    expect(say('arabic')).toMatch(/^Testholm is an Arabic-inspired village/);
  });

  it('falls through to historical character when the scope is not a term list', () => {
    // The mixed-culture profile's scope is a sentence about blending, not the
    // `<article> <terms> design grammar.` shape. Its label already carries the
    // blend, so the guide takes the character sentence rather than printing prose
    // written for a different slot.
    const guide = composeSettlementQuickGuide({
      name: 'Nassenfurt',
      tier: 'village',
      population: 400,
      culturalIdentity: {
        label: 'Germanic-inspired + Latin-inspired',
        scope: 'A locally blended design grammar; both traditions remain visible.',
      },
      history: { historicalCharacter: 'Founded at a ford and never moved from it.' },
    });

    expect(guide.identitySentence).toBe(
      'Nassenfurt is a Germanic-inspired + Latin-inspired village of 400 people, '
      + 'founded at a ford and never moved from it.',
    );
  });

  it('states how a settlement lives as a sentence, over every food-security label', () => {
    const lives = (prosperity, label, primaryExports) => composeSettlementQuickGuide({
      economicState: { prosperity, foodSecurity: { label }, primaryExports },
    }).definingTruths[2].text;

    // The six labels foodGenerator.js can emit, each as a clause rather than a
    // spliced field name ("deficit — active famine food security").
    expect(lives('Struggling', 'Deficit — Active Famine')).toBe(
      'The economy is struggling; food is in deficit and famine is active.',
    );
    expect(lives('Poor', 'Deficit')).toBe('The economy is poor; food is in deficit.');
    expect(lives('Moderate', 'Import-Dependent')).toBe(
      'The economy is moderate; the food supply depends on imports.',
    );
    expect(lives('Comfortable', 'Pressured')).toBe(
      'The economy is comfortable; the food supply is under pressure.',
    );
    expect(lives('Prosperous', 'Surplus')).toBe(
      'The economy is prosperous; there is food to spare.',
    );
    expect(lives('Wealthy', 'Secure')).toBe(
      'The economy is wealthy; the food supply is secure.',
    );

    // A label outside the ladder (a legacy save) names itself rather than vanishing.
    expect(lives('Poor', 'Rationed')).toBe('The economy is poor; the food supply is rationed.');

    // The export is the third field this fact has always read, and it keeps its
    // place and its source path.
    const withExport = composeSettlementQuickGuide({
      economicState: {
        prosperity: 'Moderate',
        foodSecurity: { label: 'Secure' },
        primaryExports: ['Wool'],
      },
    }).definingTruths[2];
    expect(withExport.text).toBe(
      'The economy is moderate; the food supply is secure. Its leading export is wool.',
    );
    expect(withExport.sourcePath).toBe('economicState.prosperity|foodSecurity|primaryExports');
  });

  it('recognizes the actual conflict prose keys when pressureSentence is absent', () => {
    const guide = composeSettlementQuickGuide({
      conflicts: [{ desc: 'The guild has barricaded the counting house.' }],
    });

    expect(guide.immediatePressure.text).toBe(
      'The guild has barricaded the counting house.',
    );
    expect(guide.immediatePressure.sourcePath).toBe('conflicts[0]');
  });
});
