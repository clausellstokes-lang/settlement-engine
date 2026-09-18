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

  it('takes the article from the SOUND, not from the letter', () => {
    const lead = (label) => composeSettlementQuickGuide({
      name: 'Testholm',
      tier: 'village',
      population: 400,
      culturalIdentity: { label },
      history: { historicalCharacter: 'Founded at a ford.' },
    }).identitySentence.match(/^Testholm is (an?) /)[1];

    // Every label the product mints is listed in ARTICLE_BY_LEAD, so none of these
    // depends on the fallback rule at all.
    expect(Object.entries(CULTURE_PROFILES).map(([, p]) => `${lead(p.label)} ${p.label}`)).toEqual([
      'a Germanic-inspired', 'a Latin-inspired', 'a Celtic-inspired', 'an Arabic-inspired',
      'a Norse-inspired', 'a Slavic-inspired', 'an East-Asian-inspired',
      'a Mesoamerican-inspired', 'a South-Asian-inspired', 'a Steppe-inspired', 'a Greek-inspired',
    ]);

    // ⛔ THE FALLBACK IS WHERE THE NAIVE RULE WAS WRONG. A written vowel that opens
    // with a consonant SOUND takes 'a', which `/^[aeiou]/` cannot know: these labels
    // are not ones the product mints, so only the rule decides them.
    expect(lead('European-inspired')).toBe('a');
    expect(lead('Unified-Clans')).toBe('a');
    expect(lead('One-Road')).toBe('a');
    expect(lead('Umbrian-inspired')).toBe('an');
    expect(lead('Oceanic-inspired')).toBe('an');

    // And with no label at all the tier carries the article.
    expect(composeSettlementQuickGuide({ name: 'Barebones' }).identitySentence)
      .toBe('Barebones is a settlement.');
  });

  it('a label named for an Object.prototype member cannot print a native function', () => {
    // ⛔ THE LOOKUP WAS A BARE `MAP[lead]` ON A USER-DERIVED STRING. `culturalIdentity.label`
    // comes off the record, so a custom or legacy identity leading with `constructor`,
    // `toString`, `valueOf` or `hasOwnProperty` read Object.prototype's member back — each
    // of them TRUTHY, so the FUNCTION was returned as the article and interpolated:
    //   "X is function Object() { [native code] } constructor village of 9 people."
    for (const label of ['constructor', 'toString', '__proto__', 'valueOf', 'hasOwnProperty']) {
      const sentence = composeSettlementQuickGuide({
        name: 'X', tier: 'village', population: 9, culturalIdentity: { label },
      }).identitySentence;
      expect(sentence, label).toMatch(/^X is an? /);
      expect(sentence, label).not.toMatch(/native code|\[object Object\]/);
    }
  });

  it('the sound lists are whole words, because a prefix cannot hear the vowel after it', () => {
    const lead = (label) => composeSettlementQuickGuide({
      name: 'X', tier: 'village', population: 9, culturalIdentity: { label },
    }).identitySentence.match(/^X is (an?) /)[1];

    // ⛔ THE PREFIX SPELLING OVER-FIRED ON ALL THREE OF THESE. `/^uni/` cannot tell
    // `unified` (/juː/, 'a') from `uninhabited` (/ʌ/, 'an'), and `/^one/` swallowed
    // `Oneiric`; the distinction is the vowel that FOLLOWS, which a prefix never sees.
    expect(lead('Uninhabited')).toBe('an');
    expect(lead('Unimportant')).toBe('an');
    expect(lead('Oneiric')).toBe('an');
    // …while the words that really do open with a consonant sound still take 'a'.
    expect(lead('European-inspired')).toBe('a');
    expect(lead('Unified-Clans')).toBe('a');
    expect(lead('One-Road')).toBe('a');

    // ⛔ AND THERE WAS NO SILENT-H LIST AT ALL, so every one of these took 'a'.
    expect(lead('Honest')).toBe('an');
    expect(lead('Hourglass')).toBe('an');
    expect(lead('Heir')).toBe('an');
    // The ordinary h is untouched.
    expect(lead('Highland')).toBe('a');
    expect(lead('Hill-Clans')).toBe('a');
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
