/**
 * settlementQuickGuide.js — one deterministic, compact settlement read-model.
 *
 * The generated dossier is intentionally deep. That depth is useful while
 * preparing, but a GM also needs a reliable first screen: one identity sentence,
 * three defining truths, one immediate pressure, three important people, and one
 * entry point. This composer selects those facts from canonical generator output
 * without inventing a second settlement model or persisting derived prose.
 *
 * The result is shared by Summary, Table View, Session Mode, and the PDF. Keeping
 * selection here prevents four presentation layers from quietly disagreeing
 * about who matters, what is urgent, or where play begins.
 */

import { collectPlotHooks } from '../dossier/plotHooks.js';
import { formatCount } from '../formatNumber.js';

const INFLUENCE_RANK = Object.freeze({
  high: 0,
  moderate: 1,
  low: 2,
});

/**
 * @typedef {Object} QuickGuideFact
 * @property {string} id
 * @property {string} label
 * @property {string} text
 * @property {string} sourcePath
 */

/**
 * @typedef {Object} QuickGuidePerson
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} detail
 * @property {string} sourcePath
 */

/**
 * Narrow source shapes for this read-model. Values remain `unknown` at the
 * persistence boundary and are normalized by cleanText/finiteNumber; the guide
 * does not assume that legacy saves are already schema-perfect.
 *
 * @typedef {Object} QuickGuideFaction
 * @property {unknown} [faction]
 * @property {unknown} [isGoverning]
 *
 * @typedef {Object} QuickGuideStress
 * @property {unknown} [summary]
 * @property {unknown} [description]
 * @property {unknown} [crisisHook]
 * @property {unknown} [label]
 * @property {unknown} [type]
 *
 * @typedef {Object} QuickGuideConflict
 * @property {unknown} [desc]
 * @property {unknown} [description]
 * @property {unknown} [issue]
 * @property {unknown} [tension]
 * @property {unknown} [stakes]
 *
 * @typedef {Object} QuickGuideNpc
 * @property {unknown} [id]
 * @property {unknown} [name]
 * @property {unknown} [role]
 * @property {unknown} [title]
 * @property {unknown} [power]
 * @property {unknown} [influence]
 * @property {string | { short?: unknown, long?: unknown } | null} [goal]
 * @property {string | { tell?: unknown, dominant?: unknown } | null} [personality]
 * @property {string | { what?: unknown } | null} [secret]
 *
 * @typedef {Object} QuickGuideTension
 * @property {unknown} [description]
 * @property {unknown[]} [plotHooks]
 *
 * @typedef {Object} SettlementQuickGuideSource
 * @property {unknown} [name]
 * @property {unknown} [tier]
 * @property {unknown} [population]
 * @property {{ label?: unknown, scope?: unknown }} [culturalIdentity]
 * @property {{ label?: unknown }} [culture]
 * @property {unknown} [settlementReason]
 * @property {{
 *   historicalCharacter?: unknown,
 *   founding?: { reason?: unknown },
 *   currentTensions?: QuickGuideTension[],
 * }} [history]
 * @property {{
 *   factions?: QuickGuideFaction[],
 *   governingName?: unknown,
 *   government?: unknown,
 *   stability?: unknown,
 * }} [powerStructure]
 * @property {{
 *   prosperity?: string | { tier?: unknown } | null,
 *   foodSecurity?: { label?: unknown },
 *   primaryExports?: unknown,
 *   situationDesc?: unknown,
 * }} [economicState]
 * @property {unknown} [pressureSentence]
 * @property {QuickGuideStress[]} [stressors]
 * @property {QuickGuideStress[]} [stress]
 * @property {QuickGuideConflict[]} [conflicts]
 * @property {QuickGuideNpc[]} [npcs]
 */

/**
 * @typedef {Object} SettlementQuickGuide
 * @property {1} version
 * @property {string} identitySentence
 * @property {QuickGuideFact[]} definingTruths
 * @property {QuickGuideFact} immediatePressure
 * @property {QuickGuidePerson[]} importantPeople
 * @property {QuickGuideFact} entryPoint
 */

/**
 * Compose the deliberately small 1 / 3 / 1 / 3 / 1 settlement guide.
 *
 * Complete generated settlements produce all three truths and all three people.
 * Sparse or legacy records remain honest: missing people are not fabricated, and
 * missing pressure or hook data is called out explicitly.
 *
 * @param {SettlementQuickGuideSource | null | undefined} settlement
 * @returns {SettlementQuickGuide}
 */
export function composeSettlementQuickGuide(settlement) {
  const source = settlement && typeof settlement === 'object' ? settlement : {};

  return {
    version: 1,
    identitySentence: composeIdentity(source),
    definingTruths: [
      composeFoundationTruth(source),
      composeAuthorityTruth(source),
      composeMaterialTruth(source),
    ],
    immediatePressure: composePressure(source),
    importantPeople: selectImportantPeople(source),
    entryPoint: composeEntryPoint(source),
  };
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {string}
 */
function composeIdentity(settlement) {
  const name = cleanText(settlement.name) || 'This settlement';
  const tier = cleanText(settlement.tier) || 'settlement';
  const population = finiteNumber(settlement.population);
  const cultureLabel = cleanText(
    settlement.culturalIdentity?.label
      || settlement.culture?.label,
  );
  const scope = cleanText(settlement.culturalIdentity?.scope);

  const descriptors = [
    cultureLabel,
    tier.toLowerCase(),
  ].filter(Boolean).join(' ');
  const populationPhrase = population == null
    ? ''
    : ` of ${formatCount(population)} ${population === 1 ? 'person' : 'people'}`;

  const article = articleFor(descriptors);

  const phrase = scopePhrase(scope);
  if (phrase) {
    return sentence(`${name} is ${article} ${descriptors}${populationPhrase}, ${phrase}`);
  }

  const historicalCharacter = cleanText(settlement.history?.historicalCharacter);
  if (historicalCharacter) {
    return sentence(
      `${name} is ${article} ${descriptors}${populationPhrase}, ${lowerLead(firstSentence(historicalCharacter))}`,
    );
  }

  return sentence(`${name} is ${article} ${descriptors}${populationPhrase}`);
}

/**
 * THE ARTICLE THE IDENTITY SENTENCE TAKES, per LEAD WORD.
 *
 * ⚠ IT WAS HARDCODED 'a', so every Arabic-inspired and East-Asian-inspired settlement
 * read "is a Arabic-inspired village" on the DM's first screen. ⚠ AND THE OBVIOUS
 * REPAIR IS ALSO WRONG: `/^[aeiou]/` gives "an European" and "an one-street hamlet",
 * because English takes the article from the SOUND and not from the letter.
 *
 * So the words the product actually mints are listed, and nothing is inferred for
 * them: the eleven authored culture labels and the six tiers. The rule below is a
 * fallback for a label this file did not write - a legacy save, a custom identity -
 * where being right most of the time is the best available and being wrong is no
 * worse than the hardcoded article it replaces.
 *
 * @type {Readonly<Record<string, 'a' | 'an'>>}
 */
const ARTICLE_BY_LEAD = Object.freeze({
  'Germanic-inspired': 'a',
  'Latin-inspired': 'a',
  'Celtic-inspired': 'a',
  'Arabic-inspired': 'an',
  'Norse-inspired': 'a',
  'Slavic-inspired': 'a',
  'East-Asian-inspired': 'an',
  'Mesoamerican-inspired': 'a',
  'South-Asian-inspired': 'a',
  'Steppe-inspired': 'a',
  'Greek-inspired': 'a',
  thorp: 'a',
  hamlet: 'a',
  village: 'a',
  town: 'a',
  city: 'a',
  metropolis: 'a',
  settlement: 'a',
});

/**
 * ⛔ WHOLE WORDS, NOT PREFIXES. The first spelling of this rule matched `/^(?:eu|one|uni|…)/`
 * and over-fired on every word that merely STARTS that way: "a uninhabited hamlet",
 * "a unimportant village", "a Oneiric-inspired town". A prefix cannot tell `unified`
 * (/juː/, takes 'a') from `uninhabited` (/ʌ/, takes 'an'), because the distinction is
 * the vowel that follows, not the letters that open. Both lists are therefore keyed on
 * the lead's first WORD and are kept as short as the defect allows.
 */
/** Written vowels that open with a consonant sound, so they take 'a'. */
const CONSONANT_SOUND_WORDS = new Set([
  'european', 'euphoric', 'eulogy', 'eucalyptus', 'ewe', 'one', 'once',
  'unified', 'union', 'united', 'unique', 'uniform', 'unit', 'universal',
  'university', 'unicorn', 'usual', 'useful', 'utopian', 'ubiquitous',
]);
/** Written consonants that open with a vowel sound, so they take 'an'. The silent h. */
const VOWEL_SOUND_WORDS = new Set([
  'heir', 'heiress', 'heirloom', 'honest', 'honesty', 'honour', 'honor',
  'honourable', 'honorable', 'honorary', 'hour', 'hourglass', 'hourly',
]);

/**
 * @param {string} descriptors
 * @returns {'a' | 'an'}
 */
function articleFor(descriptors) {
  const lead = descriptors.split(' ')[0] || '';
  // ⛔ `Object.hasOwn`, NEVER A BARE LOOKUP. `descriptors` carries a user-derived
  // `culturalIdentity.label`, and a plain-object read of it returns Object.prototype's
  // members for a label leading with `constructor`, `toString`, `valueOf` or
  // `hasOwnProperty` - each of them TRUTHY, so the function itself was returned and
  // printed: "X is function Object() { [native code] } constructor village of 9 people."
  if (Object.hasOwn(ARTICLE_BY_LEAD, lead)) return ARTICLE_BY_LEAD[lead];
  const word = (lead.match(/[a-z]+/i) || [''])[0].toLowerCase();
  if (CONSONANT_SOUND_WORDS.has(word)) return 'a';
  if (VOWEL_SOUND_WORDS.has(word)) return 'an';
  return /^[aeiou]/.test(word) ? 'an' : 'a';
}

/**
 * THE ELEVEN AUTHORED SCOPES, each with the phrase the identity sentence carries.
 *
 * A culture profile's `scope` (src/data/cultureProfiles.js) is authored as
 * `<article> <terms> design grammar.`, and the guide used to read the whole string
 * out - "expressed through civic-ritual plaza, tribute, market-and-waterworks design
 * grammar" - which puts the engine's own filing word in front of a reader.
 *
 * ⚠ LIFTING THE TERMS MECHANICALLY IS WHAT THIS REPLACES, AND WHY. Four of the
 * eleven scopes are ADJECTIVE STACKS, not noun lists: germanic's "timber-and-stone,
 * guild-and-estate", norse's "maritime", east-asian's "bureaucratic-and-lineage" and
 * steppe's "pastoral, mobile-sedentary" all modify the head noun the parse was
 * throwing away, so "built around a timber-and-stone and guild-and-estate" came out
 * a dangling modifier. A derived rule cannot tell the two shapes apart, and the
 * shapes are a property of authored copy rather than of the grammar. So the phrase
 * is AUTHORED per scope, once, here - display only, keyed on the EXACT authored
 * string so a scope that is reworded stops matching and is caught rather than
 * silently paraphrased.
 *
 * ⛔ THE MIXED PROFILE IS DELIBERATELY ABSENT. Its scope is a sentence about
 * blending rather than a term list, and its `label` already says "Germanic-inspired +
 * Latin-inspired", so the blend is on the page either way; an unmapped scope yields
 * '' and the identity sentence falls through to the historical-character form it
 * already uses for a settlement carrying no scope at all.
 *
 * The map is NOT derived from CULTURE_PROFILES here on purpose: this module is a
 * headless leaf and src/data/cultureProfiles.js is lazily chunked away from the
 * first paint (tests/build/cultureProfilesLazy.test.js). The coverage pin lives in
 * tests/domain/settlementQuickGuide.test.js, which imports the corpus and asserts
 * every authored scope but the blend has a phrase here.
 *
 * @type {Readonly<Record<string, string>>}
 */
const SCOPE_PHRASE = Object.freeze({
  'A timber-and-stone, guild-and-estate design grammar.':
    'built in timber and stone, and run by guild and estate',
  'A masonry, civic-square, patronage-and-law design grammar.':
    'built in masonry around a civic square, and run by patronage and law',
  'A kin-district, assembly, pastoral-and-earthwork design grammar.':
    'built around kin districts and an assembly ground, on pasture and earthwork',
  'A courtyard, waterworks, endowed-institution-and-caravan design grammar.':
    'built around courtyards and waterworks, on endowed institutions and the caravan road',
  'A hall, maritime, assembly-and-seasonal-survival design grammar.':
    'built around the hall and the water, on assembly and what the season allows',
  'A timber-compound, communal-land, river-and-forest design grammar.':
    'built in timber compounds on common land, between river and forest',
  'A ward, courtyard, bureaucratic-and-lineage design grammar.':
    'built in wards and courtyards, ordered by bureau and lineage',
  'A civic-ritual plaza, tribute, market-and-waterworks design grammar.':
    'built around a civic-ritual plaza, tribute, and market-and-waterworks',
  'A tank-and-bazaar, occupational-quarter, temple-and-guild design grammar.':
    'built around the tank and the bazaar, in quarters by trade, under temple and guild',
  'A pastoral, mobile-sedentary, clan-and-caravan design grammar.':
    'built for a pastoral life half-settled and half-moving, held by clan and caravan',
  'An agora, harbor, civic-association-and-hillside design grammar.':
    'built around the agora and the harbour, on hillside ground and civic association',
});

/** @param {string} scope @returns {string} */
function scopePhrase(scope) {
  return SCOPE_PHRASE[scope] || '';
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeFoundationTruth(settlement) {
  const statedReason = firstText(settlement.settlementReason);
  const foundingReason = cleanText(settlement.history?.founding?.reason);
  const text = statedReason || foundingReason;

  return fact(
    'foundation',
    'Why it exists',
    text ? sentence(text) : 'Its founding purpose is not recorded.',
    statedReason ? 'settlementReason[0]' : (foundingReason
      ? 'history.founding.reason'
      : 'settlementReason'),
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeAuthorityTruth(settlement) {
  const factions = Array.isArray(settlement.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : [];
  const governing = cleanText(
    settlement.powerStructure?.governingName
      || settlement.powerStructure?.government
      || factions.find((faction) => faction?.isGoverning)?.faction,
  );
  const stability = cleanText(settlement.powerStructure?.stability);

  let text = 'No governing authority is recorded.';
  if (governing && stability) {
    text = `${governing} governs; the balance of power is ${stability.toLowerCase()}.`;
  } else if (governing) {
    text = `${governing} governs.`;
  } else if (stability) {
    text = `The balance of power is ${stability.toLowerCase()}.`;
  }

  return fact(
    'authority',
    'Who holds power',
    text,
    governing
      ? 'powerStructure.governingName'
      : 'powerStructure.stability',
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeMaterialTruth(settlement) {
  const economy = settlement.economicState || {};
  const prosperity = cleanText(
    typeof economy.prosperity === 'object'
      ? economy.prosperity?.tier
      : economy.prosperity,
  );
  const food = cleanText(economy.foodSecurity?.label);
  const topExport = cleanText(firstText(economy.primaryExports));
  const situation = cleanText(economy.situationDesc);

  // The three fields were spliced in as bare labels and joined with "and", which
  // printed the generator's own vocabulary at the reader: "Struggling economy and
  // deficit — active famine food security." Each field becomes a clause of an
  // actual sentence instead. The fields, their precedence and the source path are
  // unchanged — only the rendering.
  const clauses = [];
  if (prosperity) clauses.push(`the economy is ${prosperity.toLowerCase()}`);
  if (food) clauses.push(foodSecurityClause(food));

  let text = clauses.length ? upperLead(clauses.join('; ')) : '';
  if (topExport) {
    const exportClause = `Its leading export is ${lowerLead(topExport)}`;
    text = text ? `${sentence(text)} ${exportClause}` : exportClause;
  }

  return fact(
    'material_life',
    'How it lives',
    text
      ? sentence(text)
      : (situation ? sentence(situation) : 'Its material condition is not yet recorded.'),
    text
      ? 'economicState.prosperity|foodSecurity|primaryExports'
      : 'economicState.situationDesc',
  );
}

/**
 * THE SIX LABELS `generateFoodSecurity` CAN EMIT (src/generators/foodGenerator.js),
 * each as the clause a sentence can carry. Keyed by the label lowercased with its
 * dash normalized, so a legacy save's hyphen cannot miss the famine row. A label
 * outside the ladder names itself rather than vanishing.
 *
 * @type {Readonly<Record<string, string>>}
 */
const FOOD_SECURITY_CLAUSE = Object.freeze({
  'deficit - active famine': 'food is in deficit and famine is active',
  deficit: 'food is in deficit',
  'import-dependent': 'the food supply depends on imports',
  pressured: 'the food supply is under pressure',
  surplus: 'there is food to spare',
  secure: 'the food supply is secure',
});

/** @param {string} label @returns {string} */
function foodSecurityClause(label) {
  const key = label.toLowerCase().replace(/[\u2013\u2014]/g, '-');
  return FOOD_SECURITY_CLAUSE[key] || `the food supply is ${label.toLowerCase()}`;
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composePressure(settlement) {
  const direct = cleanText(settlement.pressureSentence);
  if (direct) {
    return fact(
      'immediate_pressure',
      'What is urgent',
      sentence(direct),
      'pressureSentence',
    );
  }

  const stressors = Array.isArray(settlement.stressors)
    ? settlement.stressors
    : (Array.isArray(settlement.stress) ? settlement.stress : []);
  const stress = stressors.find(Boolean);
  const stressText = cleanText(
    stress?.summary
      || stress?.description
      || stress?.crisisHook
      || stress?.label
      || stress?.type,
  );
  if (stressText) {
    return fact(
      'immediate_pressure',
      'What is urgent',
      sentence(stressText),
      'stressors[0]',
    );
  }

  const conflicts = Array.isArray(settlement.conflicts)
    ? settlement.conflicts
    : [];
  const conflict = conflicts.find(Boolean);
  const conflictText = cleanText(
    conflict?.desc
      || conflict?.description
      || conflict?.issue
      || conflict?.tension
      || conflict?.stakes,
  );

  return fact(
    'immediate_pressure',
    'What is urgent',
    conflictText
      ? sentence(conflictText)
      : 'No immediate pressure is currently recorded.',
    conflictText ? 'conflicts[0]' : 'pressureSentence',
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuidePerson[]}
 */
function selectImportantPeople(settlement) {
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  return npcs
    .map((npc, index) => ({ npc, index }))
    .filter(({ npc }) => npc && typeof npc === 'object')
    .sort((left, right) => {
      const powerDelta = numericPower(right.npc) - numericPower(left.npc);
      if (powerDelta !== 0) return powerDelta;

      const influenceDelta = influenceRank(left.npc) - influenceRank(right.npc);
      return influenceDelta !== 0 ? influenceDelta : left.index - right.index;
    })
    .slice(0, 3)
    .map(({ npc, index }) => ({
      id: cleanText(npc.id) || `npc-${index + 1}`,
      name: cleanText(npc.name) || 'Unnamed person',
      role: cleanText(npc.role || npc.title) || 'Notable local',
      detail: personDetail(npc),
      sourcePath: `npcs[${index}]`,
    }));
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeEntryPoint(settlement) {
  const hook = collectPlotHooks(
    /** @type {Parameters<typeof collectPlotHooks>[0]} */ (settlement),
  )[0];
  if (hook?.text) {
    return fact(
      'entry_point',
      'Where play begins',
      sentence(hook.text),
      `plotHooks:${hook.category || 'unknown'}`,
    );
  }

  const tension = settlement.history?.currentTensions?.find?.(Boolean);
  const tensionText = cleanText(tension?.description || tension?.plotHooks?.[0]);
  return fact(
    'entry_point',
    'Where play begins',
    tensionText
      ? sentence(tensionText)
      : 'No immediate entry point is currently recorded.',
    tensionText
      ? 'history.currentTensions[0]'
      : 'plotHooks',
  );
}

/**
 * @param {QuickGuideNpc} npc
 * @returns {string}
 */
function personDetail(npc) {
  const goal = cleanText(
    typeof npc.goal === 'object'
      ? (npc.goal?.short || npc.goal?.long)
      : npc.goal,
  );
  if (goal) return sentence(`Wants to ${lowerLead(stripInfinitive(goal))}`);

  const tell = cleanText(
    typeof npc.personality === 'object'
      ? (npc.personality?.tell || npc.personality?.dominant)
      : npc.personality,
  );
  if (tell) return sentence(tell);

  const secret = cleanText(
    typeof npc.secret === 'object'
      ? npc.secret?.what
      : npc.secret,
  );
  if (secret) return sentence(`Secret: ${lowerLead(secret)}`);

  return 'No immediate agenda is recorded.';
}

/**
 * @param {string} id
 * @param {string} label
 * @param {string} text
 * @param {string} sourcePath
 * @returns {QuickGuideFact}
 */
function fact(id, label, text, sourcePath) {
  return { id, label, text, sourcePath };
}

/** @param {unknown} value @returns {string} */
function cleanText(value) {
  return typeof value === 'string'
    ? value.replace(/\s+/g, ' ').trim()
    : '';
}

/** @param {unknown} value @returns {string} */
function firstText(value) {
  if (Array.isArray(value)) {
    return cleanText(value.find((entry) => cleanText(entry)));
  }
  return cleanText(value);
}

/** @param {unknown} value @returns {number | null} */
function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

/** @param {QuickGuideNpc} npc @returns {number} */
function numericPower(npc) {
  const power = Number(npc?.power);
  return Number.isFinite(power) ? power : 0;
}

/** @param {QuickGuideNpc} npc @returns {number} */
function influenceRank(npc) {
  const influence = cleanText(npc.influence);
  if (influence === 'high' || influence === 'moderate' || influence === 'low') {
    return INFLUENCE_RANK[influence];
  }
  return 3;
}

/** @param {string} value @returns {string} */
function lowerLead(value) {
  return value ? value[0].toLowerCase() + value.slice(1) : '';
}

/** @param {string} value @returns {string} */
function upperLead(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : '';
}

/** @param {string} value @returns {string} */
function stripInfinitive(value) {
  return value.replace(/^to\s+/i, '');
}

/** @param {string} value @returns {string} */
function firstSentence(value) {
  const match = cleanText(value).match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : cleanText(value)).replace(/[.!?]+$/, '');
}

/** @param {string} value @returns {string} */
function sentence(value) {
  const text = cleanText(value);
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
}
