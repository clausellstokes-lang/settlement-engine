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

  if (scope) {
    return sentence(
      `${name} is a ${descriptors}${populationPhrase}, expressed through ${lowerLead(stripArticle(scope))}`,
    );
  }

  const historicalCharacter = cleanText(settlement.history?.historicalCharacter);
  if (historicalCharacter) {
    return sentence(
      `${name} is a ${descriptors}${populationPhrase}, ${lowerLead(firstSentence(historicalCharacter))}`,
    );
  }

  return sentence(`${name} is a ${descriptors}${populationPhrase}`);
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

  const clauses = [];
  if (prosperity) clauses.push(`${prosperity} economy`);
  if (food) clauses.push(`${food.toLowerCase()} food security`);
  if (topExport) clauses.push(`${lowerLead(topExport)} as a leading export`);

  const text = clauses.length
    ? sentence(joinClauses(clauses))
    : (situation ? sentence(situation) : 'Its material condition is not yet recorded.');

  return fact(
    'material_life',
    'How it lives',
    text,
    clauses.length
      ? 'economicState.prosperity|foodSecurity|primaryExports'
      : 'economicState.situationDesc',
  );
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
function stripArticle(value) {
  return value.replace(/^(?:a|an|the)\s+/i, '');
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

/** @param {string[]} clauses @returns {string} */
function joinClauses(clauses) {
  if (clauses.length <= 1) return clauses[0] || '';
  if (clauses.length === 2) return `${clauses[0]} and ${clauses[1]}`;
  return `${clauses[0]}, ${clauses[1]}, and ${clauses[2]}`;
}
