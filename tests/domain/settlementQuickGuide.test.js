/**
 * Contract for the compact 1 / 3 / 1 / 3 / 1 settlement read-model.
 *
 * This is intentionally independent of the presentation surfaces. The same
 * immutable selection must drive Summary, Table View, Session Mode, and PDF.
 */

import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
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
        key: 'mesoamerican',
        label: 'Mesoamerican-inspired',
      },
    });

    expect(guide.identitySentence).toBe(
      'Edznaxochitl is a Mesoamerican-inspired hamlet of 130 people, built around '
      + 'a civic-ritual plaza, tribute, and market-and-waterworks.',
    );
  });

  it('gives EVERY authored culture profile a phrase, and none of them dangles', () => {
    // THE COVERAGE PIN lives here rather than in the composer: settlementQuickGuide
    // is a headless leaf and src/data/cultureProfiles.js is lazily chunked away from
    // the first paint, so SCOPE_PHRASE is authored there and cannot read the corpus
    // itself. This loop is what makes an added, renamed or removed profile loud
    // instead of silently unphrased. It drives the map by `culturalIdentity.key` —
    // the identity the generator stamps on the root — because a corpus SENTENCE may
    // be minted in exactly one source module (FP-G16).
    const unphrased = [];
    for (const [key, profile] of Object.entries(CULTURE_PROFILES)) {
      const guide = composeSettlementQuickGuide({
        name: 'Testholm',
        tier: 'village',
        population: 400,
        culturalIdentity: { key, label: profile.label },
      });
      // The fallback is recognisable: it ends at the population with nothing after it.
      if (/ of 400 people\.$/.test(guide.identitySentence)) unphrased.push(key);
    }
    // ⛔ ALL ELEVEN, WITH NO EXCEPTION. The blended profile is NOT in this corpus -
    // `materializeCulturalIdentity` synthesises it at generation time from two keys -
    // so the only scope allowed to reach the no-scope fallback is not reachable from
    // here, and every row that IS here must carry a phrase.
    expect(unphrased, 'every authored profile key needs a row in SCOPE_PHRASE').toEqual([]);
    expect(Object.keys(CULTURE_PROFILES)).toHaveLength(11);

    // The four ADJECTIVE STACKS - the shape a mechanical term-lift turned into a
    // dangling modifier ("built around a timber-and-stone and guild-and-estate").
    const say = (key) => composeSettlementQuickGuide({
      name: 'Testholm',
      tier: 'village',
      population: 400,
      culturalIdentity: { key, label: CULTURE_PROFILES[key].label },
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

  it('pins every authored scope by digest, so a reworded one is caught before its paraphrase lies', () => {
    // ⛔ WHY A DIGEST, AND WHY HERE. SCOPE_PHRASE used to be KEYED ON THE AUTHORED
    // SCOPE STRING, which is what made a reworded scope fall out of the map and reach
    // the fallback - loud, and never a paraphrase of terms that had moved. That key
    // also made src/domain/summary/settlementQuickGuide.js a SECOND MINT of the
    // culture corpus, and FP-G16 (tests/build/cultureProfilesLazy.test.js) says a
    // corpus sentence stands in exactly ONE source module. Keying the map on the
    // profile id cured the law and cost the reword-catch, so the catch is rebuilt
    // here: tests/ is outside FP-G16's walk of src/, and a digest is not the sentence,
    // so nothing is re-minted anywhere.
    //
    // ⚠ RE-RECORDING A ROW IS A CONTENT DECISION, NEVER A FORMALITY. A red row means
    // that profile's scope was reworded: read it against its phrase in SCOPE_PHRASE,
    // move the phrase if the terms moved, and only then re-record the digest, with the
    // reason written down.
    const SCOPE_DIGESTS = Object.freeze({
      germanic: '8f77e1e230c2',
      latin: '0cc8af355b91',
      celtic: '97f678c09dc6',
      arabic: 'ec62973a94cd',
      norse: '253f6b4f125f',
      slavic: '88544e6afb3e',
      east_asian: '1bc9c02eb27e',
      mesoamerican: '14cd6f9f9589',
      south_asian: '65b29d3cfde9',
      steppe: 'd12074bc3157',
      greek: '5434eac6f1bb',
    });
    const digest = (text) => createHash('sha256').update(text).digest('hex').slice(0, 12);

    expect(
      Object.fromEntries(
        Object.entries(CULTURE_PROFILES).map(([key, profile]) => [key, digest(profile.scope)]),
      ),
      'an authored culture scope moved - re-read its SCOPE_PHRASE paraphrase before re-recording',
    ).toEqual(SCOPE_DIGESTS);

    // ANCHOR: the digest answers to the TEXT, so a constant or empty hash cannot
    // satisfy the table above for the wrong reason.
    expect(digest(`${CULTURE_PROFILES.germanic.scope} `)).not.toBe(SCOPE_DIGESTS.germanic);
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
      // anchored: the line above proves the sentence is live and opens on the article
      expect(sentence, label).not.toMatch(/native code|\[object Object\]/);
    }
  });

  /**
   * ── ⭐⭐ THE ARTICLE BATTERY (review 10, 2026-09-18) ─────────────────────────────────
   *
   * THE ARM THIS REPLACES pinned fifteen words against a `uni-` PREFIX behind an eighteen-word
   * exception set, and every one of the fifteen passed while the rule was wrong about a whole
   * word class: measured against a dictionary, 538 of 542 `un` + vowel words came out "a"
   * ("a uninspired", "a unintended", "a unimaginable"), because a negative list can only name
   * the exceptions somebody thought of and `un-` is an open class. Nine of the twenty-six
   * single-letter initialisms were wrong too, and nothing looked at them at all.
   *
   * So the rule is inverted — 'an' is the default for a written vowel, the consonant-SOUND
   * words are a positive list, and an all-capital run is decided on the NAME of its first
   * letter — and the pin is a BATTERY rather than a handful, because the defect was never a
   * wrong answer on a word somebody had considered. Every row below is `[lead, article]`, and
   * a table is used so a red names the word rather than a line number.
   */
  it('THE ARTICLE BATTERY: every class the rule must decide, one row per word', () => {
    const lead = (label) => composeSettlementQuickGuide({
      name: 'X', tier: 'village', population: 9, culturalIdentity: { label },
    }).identitySentence.match(/^X is (an?) /)[1];

    /** @type {Array<[string, 'a'|'an']>} */
    const BATTERY = [
      // ── THE CLASS THE OLD RULE LOST: `un` + a vowel-initial word, which is unbounded.
      ['Uninspired', 'an'], ['Unintended', 'an'], ['Unimaginable', 'an'], ['Uninhabited', 'an'],
      ['Unimportant', 'an'], ['Unopposed', 'an'], ['Unarmed', 'an'], ['Unowned', 'an'],
      ['Uneasy', 'an'], ['Unequal', 'an'], ['Unusual', 'an'], ['Unearthly', 'an'],
      ['Uninvited', 'an'], ['Unerring', 'an'], ['Uneven', 'an'],
      // ── THE /juː/ POSITIVE LIST: a written vowel said with a consonant.
      ['Uniform', 'a'], ['Unified', 'a'], ['Unique', 'a'], ['Unit', 'a'], ['United', 'a'],
      ['Universe', 'a'], ['Universal', 'a'], ['University', 'a'], ['Union', 'a'],
      ['Unicorn', 'a'], ['Unicycle', 'a'], ['Unilateral', 'a'], ['Unicode', 'a'],
      ['Unisex', 'a'], ['Unison', 'a'], ['Unicameral', 'a'], ['Unanimous', 'a'],
      ['Usurper', 'a'], ['Usury', 'a'], ['Usual', 'a'], ['Useful', 'a'], ['Utopia', 'a'],
      ['Utensil', 'a'], ['Ubiquitous', 'a'], ['Ufo', 'a'], ['Eucharist', 'a'], ['Eunuch', 'a'],
      ['Euphemism', 'a'], ['Eulogy', 'a'], ['European-inspired', 'a'], ['Ewe', 'a'],
      // ── ONE / ONCE, and the word the old prefix swallowed beside them.
      ['One-Road', 'a'], ['Once-Fort', 'a'], ['Oneiric', 'an'],
      // ── THE `ur-` FAMILY, which needs the vowel after it and must not take `urn`.
      ['Uranium', 'a'], ['Urine', 'a'], ['Urea', 'a'],
      ['Urn', 'an'], ['Urban', 'an'], ['Urge', 'an'],
      // ── WRITTEN CONSONANTS SAID WITH A VOWEL — the silent h, and the American herb.
      ['Heir', 'an'], ['Honest', 'an'], ['Honour', 'an'], ['Hour', 'an'], ['Herb', 'an'],
      // …and the ordinary h beside them, which must NOT move.
      ['Hotel', 'a'], ['Highland', 'a'], ['Herd', 'a'], ['Honeycomb', 'a'], ['Hill-Clans', 'a'],
      // ── THE LETTER RUN IS READ FROM THE START OF THE LEAD, never from the middle.
      ['8-Isle', 'an'], ['7-Hills', 'a'],
      // ── INITIALISMS, by the NAME of the first letter. Three of these were wrong before.
      ['FMG', 'an'], ['URL', 'a'], ['SOS', 'an'], ['USA', 'a'], ['UNICEF', 'a'],
      ['NPC', 'an'], ['PDF', 'a'], ['HTML', 'an'], ['XP', 'an'], ['GM', 'a'],
      // ── PROPER NOUNS, which reach the rule because no authored map can hold them.
      ['Umbrian-inspired', 'an'], ['Oceanic-inspired', 'an'], ['Ironhold', 'an'],
      ['Ashfen', 'an'], ['Elderwyn', 'an'], ['Kilcross', 'a'], ['Thornwall', 'a'],
      // ── ALL-CAPS AUTHORED WORDS, which must be read as words and not spelled out.
      ['VILLAGE', 'a'], ['METROPOLIS', 'a'], ['THORP', 'a'], ['TOWN', 'a'], ['CITY', 'a'],
      ['HAMLET', 'a'], ['SETTLEMENT', 'a'],
      ['ARABIC-INSPIRED', 'an'], ['EAST-ASIAN-INSPIRED', 'an'], ['GERMANIC-INSPIRED', 'a'],
    ];

    // ── THE TWENTY-SIX SINGLE LETTERS, derived rather than typed: twelve letter names open
    // with a vowel sound (ay ee ef aitch eye el em en oh ar es ex) and fourteen do not — `U`
    // among them, which is why "an URL" was wrong.
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      BATTERY.push([letter, 'AEFHILMNORSX'.includes(letter) ? 'an' : 'a']);
    }

    // ── EVERY AUTHORED CULTURE LABEL AND TIER NOUN IN THE CORPUS, read from the corpus so a
    // relabelled culture cannot slip past the battery by being renamed out of it.
    for (const profile of Object.values(CULTURE_PROFILES)) {
      BATTERY.push([profile.label, /^[AEIOU]/.test(profile.label) && !/^Eu/.test(profile.label) ? 'an' : 'a']);
    }
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis', 'settlement']) {
      BATTERY.push([tier, 'a']);
    }

    expect(BATTERY.length, 'the battery shrank below the class count it was written to cover')
      .toBeGreaterThanOrEqual(60);
    // COLLECT-THEN-ASSERT: a red names EVERY word that moved, not the first one.
    const wrong = BATTERY
      .filter(([label, article]) => lead(label) !== article)
      .map(([label, article]) => `${label}: got "${lead(label)}", expected "${article}"`);
    expect(wrong, `${wrong.length} of ${BATTERY.length} leads take the wrong article`).toEqual([]);
  });

  it('falls through to historical character when the scope is not a term list', () => {
    // `materializeCulturalIdentity` synthesises the blend at generation time under
    // `key: 'mixed'`; it is not a corpus profile and has no SCOPE_PHRASE row, because
    // its scope is a sentence about blending rather than the `<article> <terms>
    // design grammar.` shape. Its label already carries the blend, so the guide takes
    // the character sentence rather than printing prose written for a different slot.
    const guide = composeSettlementQuickGuide({
      name: 'Nassenfurt',
      tier: 'village',
      population: 400,
      culturalIdentity: {
        key: 'mixed',
        label: 'Germanic-inspired + Latin-inspired',
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
